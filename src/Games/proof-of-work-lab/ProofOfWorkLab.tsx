"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hammer, RotateCcw, Zap } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Proof-of-Work Lab — a hover-driven mining toy.                            */
/*                                                                            */
/*  Sweep the cursor across the grid to keep hex cells "hot". Hold enough of  */
/*  them hot at the same time and the block seals onto the chain, feeding its */
/*  hash into the next block and nudging the difficulty up.                   */
/*                                                                            */
/*  Self-contained: drop it anywhere. No props, no external calls, no data    */
/*  imports. Styles are inlined below and fall back to sensible colours when  */
/*  the host page has no theme tokens (`--accent`, `--panel`, …); when it     */
/*  does, the toy picks them up automatically, dark mode included.            */
/* -------------------------------------------------------------------------- */

const COLS = 6;
const ROWS = 4;
const CELLS = COLS * ROWS;
const HEX = "0123456789abcdef";

const WARM_RADIUS = 112; // px — cursor influence radius
const WARM_RATE = 3.4; // heat gained per second at the cursor centre
const BASE_COOL = 0.5; // heat lost per second away from the cursor
const LOCK_TIME = 0.55; // grace seconds a fully-charged cell stays hot for free
const SOLVED_AT = 0.8; // heat threshold for a cell to count as "hot"
const POKE = 0.55; // heat added by a tap / keyboard focus

/** How many cells must be hot at once to seal a block at this height. */
function targetFor(height: number) {
  return Math.min(CELLS, 6 + height * 2);
}

/** Cells cool faster as the chain grows — the "difficulty". */
function coolFor(height: number) {
  return BASE_COOL + height * 0.13;
}

/** Tiny synchronous FNV-flavoured hash → 16 hex chars. Demo only, not crypto. */
function toyHash(input: string) {
  let a = 0x811c9dc5;
  let b = 0x1000193;
  for (let i = 0; i < input.length; i += 1) {
    const c = input.charCodeAt(i);
    a = Math.imul(a ^ c, 0x01000193) >>> 0;
    b = Math.imul(b ^ c, 0x85ebca77) >>> 0;
  }
  return a.toString(16).padStart(8, "0") + b.toString(16).padStart(8, "0");
}

const GENESIS = `0x${toyHash("proof-of-work-lab::genesis")}`;

type Block = { height: number; hash: string };

export default function ProofOfWorkLab() {
  const [height, setHeight] = useState(0);
  const [prevHash, setPrevHash] = useState(GENESIS);
  const [chain, setChain] = useState<Block[]>([]);
  const [hot, setHot] = useState(0);
  const [sealing, setSealing] = useState(false);
  const [auto, setAuto] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const heatRef = useRef<Float32Array>(new Float32Array(CELLS));
  const pokeRef = useRef<Float32Array>(new Float32Array(CELLS));
  const lockRef = useRef<Float32Array>(new Float32Array(CELLS));
  const pointerRef = useRef({ x: 0, y: 0, inside: false });

  const heightRef = useRef(0);
  const prevHashRef = useRef(GENESIS);
  const hotShownRef = useRef(0);
  const autoRef = useRef(false);
  const reducedRef = useRef(false);
  const sealTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    autoRef.current = auto;
  }, [auto]);

  const pokeCell = useCallback((index: number) => {
    pokeRef.current[index] = Math.min(1, pokeRef.current[index] + POKE);
  }, []);

  const reset = useCallback(() => {
    heatRef.current.fill(0);
    pokeRef.current.fill(0);
    lockRef.current.fill(0);
    heightRef.current = 0;
    prevHashRef.current = GENESIS;
    hotShownRef.current = 0;
    setHeight(0);
    setPrevHash(GENESIS);
    setChain([]);
    setHot(0);
    setAuto(false);
  }, []);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const board = boardRef.current;
    if (!board) return;

    let raf = 0;
    let last = performance.now();
    let tick = 0;
    let sweep = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      tick += 1;

      const rect = board.getBoundingClientRect();
      const heat = heatRef.current;
      const poke = pokeRef.current;
      const lock = lockRef.current;
      const pointer = pointerRef.current;
      const h = heightRef.current;
      const cool = coolFor(h);

      // Real cursor, or a virtual one: a tight fast circle that slowly wanders
      // the board, so auto-sweep keeps a cluster hot and seals the early blocks.
      let px = pointer.x;
      let py = pointer.y;
      let active = pointer.inside;
      if (autoRef.current) {
        sweep += dt * 4;
        px = rect.width * (0.5 + 0.2 * Math.cos(sweep * 0.11) + 0.12 * Math.cos(sweep));
        py = rect.height * (0.5 + 0.16 * Math.sin(sweep * 0.13) + 0.16 * Math.sin(sweep));
        active = true;
      }

      let hotCount = 0;
      const cellW = rect.width / COLS;
      const cellH = rect.height / ROWS;

      for (let i = 0; i < CELLS; i += 1) {
        const cx = ((i % COLS) + 0.5) * cellW;
        const cy = (Math.floor(i / COLS) + 0.5) * cellH;
        let next = heat[i];

        if (active) {
          const dist = Math.hypot(px - cx, py - cy);
          if (dist < WARM_RADIUS) {
            const prox = 1 - dist / WARM_RADIUS;
            next += WARM_RATE * prox * prox * dt;
          }
        }

        if (poke[i] > 0) {
          const give = Math.min(poke[i], 2 * dt);
          poke[i] -= give;
          next += give;
        }

        next = next > 1 ? 1 : next;

        // A cell that reaches full charge "locks" hot for a grace period —
        // makes holding a cluster hot feel chunky rather than knife-edge.
        if (next >= 0.98) lock[i] = LOCK_TIME;

        if (lock[i] > 0) {
          lock[i] -= dt;
        } else if (!reducedRef.current) {
          // Reduced motion: cells never cool, so the toy is "hover each once".
          next -= cool * dt;
        }

        next = next < 0 ? 0 : next;
        heat[i] = next;

        const el = cellRefs.current[i];
        if (el) {
          const isHot = next >= SOLVED_AT;
          if (isHot) hotCount += 1;
          el.style.setProperty("--heat", next.toFixed(3));
          const solvedFlag = isHot ? "true" : "false";
          if (el.dataset.solved !== solvedFlag) el.dataset.solved = solvedFlag;

          const glyph = isHot ? "0" : HEX[(i * 7 + (tick >> 2)) & 15];
          const node = el.firstChild;
          if (node && node.textContent !== glyph) node.textContent = glyph;
        }
      }

      const glow = glowRef.current;
      if (glow) {
        glow.style.opacity = active ? "1" : "0";
        if (active) {
          glow.style.transform = `translate3d(${px - 72}px, ${py - 72}px, 0)`;
        }
      }

      if (hotCount !== hotShownRef.current) {
        hotShownRef.current = hotCount;
        setHot(hotCount);
      }

      if (hotCount >= targetFor(h)) {
        const sealed = `0x${toyHash(`${prevHashRef.current}:${h + 1}:${now.toFixed(0)}`)}`;
        heat.fill(0);
        poke.fill(0);
        lock.fill(0);
        heightRef.current = h + 1;
        prevHashRef.current = sealed;
        hotShownRef.current = 0;
        setHeight(h + 1);
        setPrevHash(sealed);
        setHot(0);
        setChain((current) => [...current, { height: h + 1, hash: sealed }].slice(-6));
        setSealing(true);
        window.clearTimeout(sealTimer.current);
        sealTimer.current = window.setTimeout(() => setSealing(false), 620);
      }

      raf = window.requestAnimationFrame(frame);
    };

    raf = window.requestAnimationFrame(frame);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(sealTimer.current);
    };
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      inside: true,
    };
  }

  function handlePointerLeave() {
    pointerRef.current.inside = false;
  }

  const target = targetFor(height);

  // The grid never depends on render state, so memoise it — parent re-renders
  // (HUD counters, seal flash) then skip the 24 cells entirely and the rAF
  // loop stays the sole owner of each cell's text and heat.
  const cells = useMemo(
    () =>
      Array.from({ length: CELLS }, (_, i) => (
        <button
          key={i}
          type="button"
          ref={(el) => {
            cellRefs.current[i] = el;
          }}
          className="pow-lab-cell"
          data-solved="false"
          aria-label={`Hash cell ${i + 1} — activate to add heat`}
          onPointerDown={() => pokeCell(i)}
          onFocus={() => pokeCell(i)}
        >
          <span aria-hidden="true">{HEX[(i * 7) & 15]}</span>
        </button>
      )),
    [pokeCell],
  );

  return (
    <section id="lab" className="pow-lab" aria-labelledby="pow-lab-title">
      <style>{POW_LAB_CSS}</style>

      <div className="pow-lab-head">
        <div className="pow-lab-head-main">
          <p className="pow-lab-eyebrow">
            <Hammer aria-hidden="true" size={12} />
            Proof of work · interactive
          </p>
          <h2 id="pow-lab-title" className="pow-lab-title">
            Hover to mine a block
          </h2>
          <p className="pow-lab-sub">
            Sweep the cursor across the grid to keep hex cells hot. Hold{" "}
            <b>{target}</b> of {CELLS} at once and the block seals onto the
            chain — every block feeds its hash forward and raises the difficulty.
          </p>
        </div>

        <dl className="pow-lab-stats" aria-live="polite">
          <div>
            <dt>Height</dt>
            <dd>{height}</dd>
          </div>
          <div>
            <dt>Hot now</dt>
            <dd>
              {hot}
              <span className="pow-lab-stat-sub">/{target}</span>
            </dd>
          </div>
          <div>
            <dt>Difficulty</dt>
            <dd className="pow-lab-diff" aria-label={`Difficulty ${height + 1}`}>
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} data-lit={i <= height} />
              ))}
            </dd>
          </div>
        </dl>
      </div>

      <div
        ref={boardRef}
        className="pow-lab-board"
        data-sealing={sealing}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ "--cols": COLS, "--rows": ROWS } as React.CSSProperties}
      >
        <div ref={glowRef} className="pow-lab-glow" aria-hidden="true" />
        {cells}
      </div>

      <div className="pow-lab-foot">
        <div className="pow-lab-chain" aria-label="Sealed chain">
          <span className="pow-lab-chain-seed" title={prevHash}>
            {prevHash.slice(0, 10)}…
          </span>
          {chain.map((block) => (
            <span
              key={block.height}
              className="pow-lab-chain-block"
              title={block.hash}
            >
              #{block.height}
            </span>
          ))}
        </div>

        <div className="pow-lab-actions">
          <button
            type="button"
            className="pow-lab-btn"
            data-on={auto}
            aria-pressed={auto}
            onClick={() => setAuto((value) => !value)}
          >
            <Zap aria-hidden="true" size={14} />
            {auto ? "Auto-sweep on" : "Auto-sweep"}
          </button>
          <button type="button" className="pow-lab-btn" onClick={reset}>
            <RotateCcw aria-hidden="true" size={14} />
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

/* Scoped styles. Every colour is `var(--token, fallback)` so the toy looks
   right on a bare page and adopts the host's theme (light or dark) when one
   is present. */
const POW_LAB_CSS = `
.pow-lab {
  --pl-accent: var(--accent, #6941c6);
  --pl-accent-soft: var(--accent-soft, #f1ecff);
  --pl-panel: var(--panel, #ffffff);
  --pl-surface: var(--panel-soft, #fafafa);
  --pl-surface-muted: var(--panel-muted, #f3f4f6);
  --pl-line: var(--line, #e4e4e7);
  --pl-line-strong: var(--line-strong, #d4d4d8);
  --pl-text: var(--text, #18181b);
  --pl-text-soft: var(--text-soft, #52525b);
  --pl-muted: var(--muted, #71717a);
  --pl-faint: var(--faint, #a1a1aa);
  --pl-green: var(--green, #12b76a);
  --pl-mono: var(--font-mono, ui-monospace, "IBM Plex Mono", "SFMono-Regular", Menlo, monospace);
  --pl-display: var(--font-display, "Space Grotesk", ui-sans-serif, system-ui, sans-serif);

  display: block;
  border: 1px solid var(--pl-line);
  border-radius: 16px;
  background:
    radial-gradient(circle at 90% 4%, color-mix(in srgb, var(--pl-accent) 9%, transparent), transparent 42%),
    var(--pl-panel);
  padding: 20px;
  color: var(--pl-text);
  box-shadow: 0 1px 2px rgb(10 13 18 / 4%);
}

.pow-lab *, .pow-lab *::before, .pow-lab *::after { box-sizing: border-box; }

.pow-lab-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 22px;
  flex-wrap: wrap;
}

.pow-lab-head-main { min-width: 0; }

.pow-lab-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-family: var(--pl-mono);
  font-size: 9px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--pl-accent);
}

.pow-lab-title {
  margin: 8px 0 0;
  font-family: var(--pl-display);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.035em;
  color: var(--pl-text);
}

.pow-lab-sub {
  margin: 6px 0 0;
  max-width: 54ch;
  font-size: 12px;
  line-height: 1.5;
  color: var(--pl-muted);
}

.pow-lab-sub b { color: var(--pl-text-soft); font-weight: 600; }

.pow-lab-stats {
  display: grid;
  grid-auto-flow: column;
  gap: 20px;
  margin: 0;
}

.pow-lab-stats dt {
  font-family: var(--pl-mono);
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--pl-faint);
}

.pow-lab-stats dd {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin: 3px 0 0;
  font-family: var(--pl-mono);
  font-size: 16px;
  font-weight: 500;
  color: var(--pl-text);
}

.pow-lab-stat-sub { font-size: 10px; color: var(--pl-faint); }

.pow-lab-diff { display: inline-flex; gap: 3px; align-self: center; }

.pow-lab-diff span {
  width: 6px;
  height: 14px;
  border-radius: 2px;
  background: var(--pl-line-strong);
}

.pow-lab-diff span[data-lit="true"] { background: var(--pl-accent); }

.pow-lab-board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--cols, 6), 1fr);
  grid-template-rows: repeat(var(--rows, 4), 1fr);
  gap: 8px;
  margin-top: 16px;
  aspect-ratio: 6 / 2;
  max-height: 360px;
  padding: 10px;
  border: 1px solid var(--pl-line);
  border-radius: 12px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--pl-surface) 65%, var(--pl-surface-muted)), var(--pl-surface));
  overflow: hidden;
  cursor: crosshair;
  touch-action: none;
}

.pow-lab-board[data-sealing="true"] { animation: pow-lab-seal 0.6s ease; }

@keyframes pow-lab-seal {
  0% { box-shadow: inset 0 0 0 0 color-mix(in srgb, var(--pl-green) 55%, transparent); }
  35% { box-shadow: inset 0 0 0 3px color-mix(in srgb, var(--pl-green) 55%, transparent); }
  100% { box-shadow: inset 0 0 0 0 transparent; }
}

.pow-lab-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 144px;
  height: 144px;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--pl-accent) 32%, transparent), transparent 70%);
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
  z-index: 0;
}

.pow-lab-cell {
  --heat: 0;
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--pl-line) 82%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--pl-panel) calc(94% - var(--heat) * 34%), var(--pl-accent));
  font-family: var(--pl-mono);
  font-size: 13px;
  color: color-mix(in srgb, var(--pl-faint), var(--pl-text) calc(var(--heat) * 100%));
  cursor: crosshair;
  transition: border-color 0.2s ease;
}

.pow-lab-cell::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 12px color-mix(in srgb, var(--pl-accent) calc(var(--heat) * 48%), transparent);
  pointer-events: none;
}

.pow-lab-cell[data-solved="true"] {
  border-color: color-mix(in srgb, var(--pl-green) 55%, var(--pl-line));
  background: color-mix(in srgb, var(--pl-green) 16%, var(--pl-panel));
  color: var(--pl-green);
}

.pow-lab-cell:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--pl-accent) 60%, transparent);
  outline-offset: 1px;
}

.pow-lab-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.pow-lab-chain {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex-wrap: wrap;
  font-family: var(--pl-mono);
  font-size: 10px;
}

.pow-lab-chain-seed { color: var(--pl-faint); }

.pow-lab-chain-block {
  padding: 3px 8px;
  border: 1px solid color-mix(in srgb, var(--pl-green) 40%, var(--pl-line));
  border-radius: 999px;
  background: color-mix(in srgb, var(--pl-green) 12%, var(--pl-panel));
  color: var(--pl-green);
}

.pow-lab-actions { display: flex; gap: 8px; }

.pow-lab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border: 1px solid var(--pl-line);
  border-radius: 999px;
  background: var(--pl-panel);
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  color: var(--pl-text-soft);
  cursor: pointer;
  transition: border-color 0.18s ease, background-color 0.18s ease, color 0.18s ease;
}

.pow-lab-btn:hover {
  border-color: color-mix(in srgb, var(--pl-accent) 40%, var(--pl-line));
  color: var(--pl-text);
}

.pow-lab-btn[data-on="true"] {
  border-color: color-mix(in srgb, var(--pl-accent) 55%, var(--pl-line));
  background: var(--pl-accent-soft);
  color: var(--pl-accent);
}

@media (max-width: 760px) {
  .pow-lab-board { aspect-ratio: 6 / 5; max-height: none; }
  .pow-lab-stats { grid-auto-flow: row; grid-template-columns: repeat(3, auto); gap: 12px 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .pow-lab-board[data-sealing="true"] { animation: none; }
  .pow-lab-glow { transition: none; }
}
`;
