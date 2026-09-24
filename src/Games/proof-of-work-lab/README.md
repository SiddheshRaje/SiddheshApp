# Proof-of-Work Lab

A standalone, hover-driven mining toy. Not wired into the portfolio — it lives
here as a self-contained component you can drop into a page whenever you want it.

## How it plays

- Moving the pointer across the board warms the hex cells nearest the cursor;
  cells cool down again when the cursor moves away. A fully-charged cell "locks"
  hot for a short grace period, so holding a cluster feels chunky, not fiddly.
- Hold enough cells hot at the same time (the target rises with block height)
  and the block **seals**: its demo hash chains forward into the next block and
  the difficulty — how fast cells cool — steps up.
- **Auto-sweep** runs a virtual cursor so the toy plays itself (also the
  keyboard / no-pointer path). **Reset** returns to the genesis block.

## Using it

```tsx
import ProofOfWorkLab from "@/Games/proof-of-work-lab/ProofOfWorkLab";

// anywhere in a page / section
<ProofOfWorkLab />
```

It renders a single `<section id="lab">`. Give the wrapper whatever width you
want; the board sizes itself from that.

## Notes

- One file, one client component. Only dependency is `lucide-react` (already in
  this project) for three icons.
- Styles are inlined as a scoped `<style>` block. Every colour is
  `var(--token, fallback)` — it looks right on a bare page and adopts the host
  theme (light or dark) when tokens like `--accent` / `--panel` are defined.
- Hydration-safe: initial render is deterministic; `matchMedia` and timing are
  read only after mount.
- `prefers-reduced-motion`: the seal-flash animation is dropped and cells stop
  cooling, so it degrades to "hover each cell once".
- The heat sim runs in one `requestAnimationFrame` loop that owns each cell's
  text and `--heat` directly via refs; the cell grid is memoised so HUD
  re-renders never touch it.
- `toyHash` is a tiny synchronous FNV-style hash for display only — not
  cryptographic. Nothing here touches a wallet or the network.
- Feel/difficulty knobs are the constants at the top of the file
  (`WARM_RATE`, `BASE_COOL`, `LOCK_TIME`, `targetFor`, `coolFor`).
