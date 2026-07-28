import { ArrowUpRight, Mail } from "lucide-react";
import { profile } from "@/data/resume";

const values = [
  { label: "Clarity", background: "linear-gradient(135deg,#9b8afb,#6941c6)" },
  { label: "Security", background: "linear-gradient(135deg,#47cd89,#067647)" },
  { label: "Curiosity", background: "linear-gradient(135deg,#53b1fd,#175cd3)" },
  { label: "Craft", background: "linear-gradient(135deg,#3f3f46,#09090b)" },
];

export default function Footer() {
  return (
    <>
      <footer id="contact" className="contact-strip">
        <div className="mini-value-stack">
          {values.map((value, index) => (
            <span
              key={value.label}
              className="mini-value-card"
              style={{
                background: value.background,
                zIndex: values.length - index,
                top: `${index * 11}px`,
              }}
            >
              {index === 0 ? value.label : ""}
            </span>
          ))}
        </div>

        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
            Let&apos;s build something impactful
          </p>
          <h2 className="mt-2 font-display text-[clamp(1.5rem,2vw,1.8rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-text">
            Have a hard interface problem?
            <br />
            I&apos;d like to hear about it.
          </h2>
        </div>

        <p className="max-w-[30ch] text-xs leading-5 text-muted">
          I&apos;m open to thoughtful collaborations and challenging problems in Web3,
          AI, and developer experience.
        </p>

        <div className="flex flex-wrap gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-text px-4 py-2.5 text-xs font-medium text-panel transition-opacity hover:opacity-80"
          >
            <Mail aria-hidden="true" className="h-3.5 w-3.5" />
            Email me
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-2.5 text-xs font-medium text-text-soft transition-colors hover:bg-panel-muted"
          >
            LinkedIn
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>
      </footer>

      <div className="portfolio-footer">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <nav className="flex flex-wrap items-center gap-6" aria-label="Footer navigation">
          <a href="#top">Top</a>
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#credentials">Credentials</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </>
  );
}
