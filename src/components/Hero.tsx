import { ArrowRight, Mail } from "lucide-react";
import { profile } from "@/data/resume";

export default function Hero() {
  return (
    <section className="intro-hero" aria-labelledby="intro-title">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-accent">
        Software developer
      </p>
      <h1
        id="intro-title"
        className="mt-4 font-display text-[clamp(2.2rem,2.55vw,2.45rem)] font-semibold leading-[1.04] tracking-[-0.05em] text-text"
      >
        Siddhesh Raje —
        <br />
        Software developer
        <br />
        shaping <span className="text-green">Web3</span> &amp;{" "}
        <span className="hero-ai-text">AI</span><br />
        into useful products.
      </h1>

      <p className="mt-5 max-w-[36ch] text-sm leading-6 text-muted">
        I turn ambitious blockchain and AI ideas into clear, dependable
        products—from first system sketch to production-ready software.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <a
          href="https://github.com/SiddheshRaje"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_color-mix(in_srgb,var(--accent)_22%,transparent)] transition-transform hover:-translate-y-0.5"
        >
          See my work
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-3 rounded-lg border border-line bg-panel px-5 py-3 text-sm font-medium text-text-soft transition-colors hover:bg-panel-muted"
        >
          Get in touch
          <Mail aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
