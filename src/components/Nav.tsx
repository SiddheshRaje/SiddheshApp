"use client";

import { Download, MapPin } from "lucide-react";
import Clock from "./Clock";
import NavPopover, { NAV_POPOVER_LABELS } from "./NavPopover";
import ThemeToggle from "./ThemeToggle";

export function AvatarMark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-accent/20 bg-accent-soft font-display font-semibold text-accent ${
        compact ? "h-8 w-8 text-[10px]" : "h-10 w-10 text-sm"
      }`}
      aria-hidden="true"
    >
      SR
    </span>
  );
}

export default function Nav() {
  return (
    <header className="portfolio-nav">
      <nav className="flex h-full items-center justify-between gap-5 px-3 sm:px-4">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <AvatarMark compact />
          <span className="truncate text-sm font-semibold text-text">Siddhesh Raje</span>
        </a>

        <ul className="hidden items-center gap-7 text-[11px] text-muted xl:flex">
          {NAV_POPOVER_LABELS.map((label) => (
            <li key={label}>
              <NavPopover label={label} />
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden md:block">
            <Clock />
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-line bg-panel-2 px-3 py-1.5 text-[10px] text-muted xl:flex">
            <MapPin aria-hidden="true" className="h-3 w-3 text-green" />
            Mumbai, India
            <span className="text-green">&middot; Live</span>
          </span>
          <a
            href="/Siddhesh_Raje_Resume.pdf"
            download="Siddhesh_Raje_Resume.pdf"
            aria-label="Download Siddhesh Raje's resume"
            className="inline-flex h-8 items-center gap-2 rounded-full bg-accent px-2.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90 sm:px-3"
          >
            <Download aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Resume</span>
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
