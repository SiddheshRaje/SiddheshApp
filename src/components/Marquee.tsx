"use client";

import { Wrench } from "lucide-react";
import { useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

const skills = [
  { label: "React", x: 0.07, y: 0.12, color: "#7a5af8", angle: -4 },
  { label: "Next.js", x: 0.49, y: 0.1, color: "#2e90fa", angle: 4 },
  { label: "Solidity", x: 0.23, y: 0.34, color: "#17b26a", angle: 2 },
  { label: "TypeScript", x: 0.59, y: 0.31, color: "#ee46bc", angle: -3 },
  { label: "Web3.js", x: 0.05, y: 0.58, color: "#f79009", angle: 4 },
  { label: "AI Models", x: 0.43, y: 0.55, color: "#f04438", angle: -2 },
  { label: "Python", x: 0.68, y: 0.73, color: "#0ba5ec", angle: 3 },
  { label: "Figma", x: 0.12, y: 0.8, color: "#15b79e", angle: -3 },
  { label: "REST APIs", x: 0.68, y: 0.51, color: "#7f56d9", angle: 2 },
  { label: "Node.js", x: 0.34, y: 0.75, color: "#12b76a", angle: -1 },
];

type Body = {
  element: HTMLButtonElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  angle: number;
  angularVelocity: number;
};

type Drag = {
  index: number;
  pointerId: number;
  offsetX: number;
  offsetY: number;
  lastX: number;
  lastY: number;
  lastTime: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

export default function Marquee() {
  const boardRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const bodiesRef = useRef<Body[]>([]);
  const dragRef = useRef<Drag | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const board = boardRef.current;
    const elements = pillRefs.current.slice(0, skills.length);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!board || elements.some((element) => !element) || prefersReducedMotion) {
      return;
    }

    const pills = elements as HTMLButtonElement[];

    const placeBodies = () => {
      const width = board.clientWidth;
      const height = board.clientHeight;

      bodiesRef.current = pills.map((element, index) => {
        const skill = skills[index];
        const bodyWidth = element.offsetWidth;
        const bodyHeight = element.offsetHeight;
        const x = clamp(skill.x * width, 4, width - bodyWidth - 4);
        const y = clamp(skill.y * height, 4, height - bodyHeight - 4);

        element.style.left = "0";
        element.style.top = "0";

        return {
          element,
          x,
          y,
          vx: ((index % 3) - 1) * 0.18,
          vy: index % 2 === 0 ? -0.08 : 0.08,
          width: bodyWidth,
          height: bodyHeight,
          angle: skill.angle,
          angularVelocity: ((index % 5) - 2) * 0.012,
        };
      });
    };

    placeBodies();
    const resizeObserver = new ResizeObserver(placeBodies);
    resizeObserver.observe(board);

    let frameId = 0;
    let previousTime = performance.now();

    const animate = (time: number) => {
      const bodies = bodiesRef.current;
      const delta = Math.min((time - previousTime) / 16.67, 2);
      const width = board.clientWidth;
      const height = board.clientHeight;
      previousTime = time;

      bodies.forEach((body, index) => {
        if (dragRef.current?.index === index) {
          return;
        }

        const centerX = body.x + body.width / 2;
        const centerY = body.y + body.height / 2;

        if (pointerRef.current.active) {
          const dx = centerX - pointerRef.current.x;
          const dy = centerY - pointerRef.current.y;
          const distance = Math.max(Math.hypot(dx, dy), 1);
          const radius = 105;

          if (distance < radius) {
            const force = (1 - distance / radius) * 0.42 * delta;
            body.vx += (dx / distance) * force;
            body.vy += (dy / distance) * force;
            body.angularVelocity += (dx / distance) * 0.004;
          }
        }

        body.vy += 0.012 * delta;
        body.vx *= 0.992;
        body.vy *= 0.992;
        body.angularVelocity *= 0.995;
        body.x += body.vx * delta;
        body.y += body.vy * delta;
        body.angle += body.angularVelocity * delta;

        if (body.x <= 4 || body.x + body.width >= width - 4) {
          body.x = clamp(body.x, 4, width - body.width - 4);
          body.vx *= -0.78;
          body.angularVelocity *= -0.8;
        }

        if (body.y <= 4 || body.y + body.height >= height - 4) {
          body.y = clamp(body.y, 4, height - body.height - 4);
          body.vy *= -0.72;
        }
      });

      for (let first = 0; first < bodies.length; first += 1) {
        for (let second = first + 1; second < bodies.length; second += 1) {
          const draggedIndex = dragRef.current?.index;

          if (first === draggedIndex || second === draggedIndex) {
            continue;
          }

          const a = bodies[first];
          const b = bodies[second];
          const overlapX =
            Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
          const overlapY =
            Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

          if (overlapX <= 0 || overlapY <= 0) {
            continue;
          }

          if (overlapX < overlapY) {
            const direction = a.x < b.x ? -1 : 1;
            const correction = overlapX / 2 + 0.5;
            a.x += direction * correction;
            b.x -= direction * correction;
            const aVelocity = a.vx;
            a.vx = b.vx * 0.82;
            b.vx = aVelocity * 0.82;
          } else {
            const direction = a.y < b.y ? -1 : 1;
            const correction = overlapY / 2 + 0.5;
            a.y += direction * correction;
            b.y -= direction * correction;
            const aVelocity = a.vy;
            a.vy = b.vy * 0.82;
            b.vy = aVelocity * 0.82;
          }
        }
      }

      bodies.forEach((body) => {
        body.element.style.transform = `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.angle}deg)`;
      });

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  function pointerPosition(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const position = pointerPosition(event);
    pointerRef.current = { ...position, active: true };
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const body = bodiesRef.current[drag.index];
    if (!body) {
      return;
    }

    const elapsed = Math.max(event.timeStamp - drag.lastTime, 8);
    body.x = clamp(
      position.x - drag.offsetX,
      4,
      event.currentTarget.clientWidth - body.width - 4,
    );
    body.y = clamp(
      position.y - drag.offsetY,
      4,
      event.currentTarget.clientHeight - body.height - 4,
    );
    body.vx = ((event.clientX - drag.lastX) / elapsed) * 8;
    body.vy = ((event.clientY - drag.lastY) / elapsed) * 8;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastTime = event.timeStamp;
  }

  function handlePointerDown(
    index: number,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    const board = boardRef.current;
    const body = bodiesRef.current[index];

    if (!board || !body) {
      return;
    }

    const rect = board.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
    dragRef.current = {
      index,
      pointerId: event.pointerId,
      offsetX: x - body.x,
      offsetY: y - body.y,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: event.timeStamp,
    };
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    event.currentTarget.classList.remove("is-dragging");
    dragRef.current = null;
  }

  return (
    <section className="support-card skills-support relative" id="skills">
      <div className="absolute inset-x-3 top-3 flex items-center justify-between">
        <span className="support-card-heading flex items-center gap-2">
          <Wrench aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
          Skills I build with
        </span>
        <span className="flex items-center gap-1.5 text-[9px] text-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          Drag to play
        </span>
      </div>
      <div
        ref={boardRef}
        className="skill-board absolute inset-x-3 bottom-3 top-8 overflow-hidden rounded-lg bg-panel-2"
        onPointerMove={handlePointerMove}
        onPointerEnter={(event) => {
          pointerRef.current = { ...pointerPosition(event), active: true };
        }}
        onPointerLeave={() => {
          pointerRef.current.active = false;
        }}
      >
        <div className="skill-cursor-hint" aria-hidden="true" />
        {skills.map((skill, index) => (
          <button
            key={skill.label}
            ref={(element) => {
              pillRefs.current[index] = element;
            }}
            type="button"
            aria-label={`Drag ${skill.label}`}
            className="skill-pill"
            onPointerDown={(event) => handlePointerDown(index, event)}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={
              {
                left: `${skill.x * 100}%`,
                top: `${skill.y * 100}%`,
                "--pill": skill.color,
                transform: `rotate(${skill.angle}deg)`,
              } as React.CSSProperties
            }
          >
            {skill.label}
          </button>
        ))}
      </div>
    </section>
  );
}
