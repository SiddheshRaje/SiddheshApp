"use client";

import { MapPin } from "lucide-react";
import { useRef } from "react";
import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";

export default function LocationInteractive({
  children,
  markerLeft,
  markerTop,
}: {
  children: ReactNode;
  markerLeft: string;
  markerTop: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const card = cardRef.current;
    const glow = glowRef.current;

    if (!card || !glow) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const horizontal = x / rect.width - 0.5;
    const vertical = y / rect.height - 0.5;

    card.style.setProperty("--map-x", `${horizontal * -12}px`);
    card.style.setProperty("--map-y", `${vertical * -9}px`);
    glow.style.opacity = "1";
    glow.style.transform = `translate3d(${x - 90}px, ${y - 90}px, 0)`;
  }

  function handlePointerLeave() {
    const card = cardRef.current;
    const glow = glowRef.current;

    card?.style.setProperty("--map-x", "0px");
    card?.style.setProperty("--map-y", "0px");

    if (glow) {
      glow.style.opacity = "0";
    }
  }

  return (
    <div
      ref={cardRef}
      className="support-card map-grid location-card relative"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div
        ref={glowRef}
        className="location-glow pointer-events-none absolute left-0 top-0 z-[1] h-[180px] w-[180px] rounded-full"
        aria-hidden="true"
      />

      <span className="support-card-heading absolute left-3 top-3 z-20 flex items-center gap-2">
        <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
        Where I build
      </span>

      <div className="location-map-art absolute inset-0 z-10">
        {children}

        <button
          type="button"
          aria-label="Mumbai, India — Siddhesh's location"
          className="group absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          style={{ left: markerLeft, top: markerTop }}
        >
          <span className="location-pulse absolute inset-2 rounded-full bg-accent/30" />
          <span className="absolute inset-[11px] rounded-full bg-accent/25 transition-transform group-hover:scale-125 group-focus-visible:scale-125" />
          <span className="absolute inset-[16px] rounded-full bg-accent shadow-[0_0_14px_var(--accent)]" />
          <span className="pointer-events-none absolute bottom-[calc(100%+7px)] left-1/2 w-max -translate-x-1/2 translate-y-1 rounded-lg border border-line bg-panel px-3 py-2 text-left opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <span className="block text-xs font-semibold text-text">Mumbai, India 🇮🇳</span>
            <span className="mt-0.5 block text-[10px] text-muted">19.0760° N · 72.8777° E</span>
          </span>
        </button>
      </div>

      <div className="absolute inset-x-3 bottom-2.5 z-20 grid grid-cols-3 divide-x divide-line">
        <span className="px-2 first:pl-0">
          <span className="block text-[8px] text-faint">Countries</span>
          <span className="block text-[10px] font-medium text-text-soft">180+</span>
        </span>
        <span className="px-2">
          <span className="block text-[8px] text-faint">Borders</span>
          <span className="block text-[10px] font-medium text-text-soft">250+</span>
        </span>
        <span className="px-2">
          <span className="block text-[8px] text-faint">Coordinates</span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-text-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            Live
          </span>
        </span>
      </div>
    </div>
  );
}
