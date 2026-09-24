"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Mail, MapPin, X } from "lucide-react";
import {
  certifications,
  education,
  experience,
  profile,
  projects,
  skills,
} from "@/data/resume";

/* ------------------------------------------------------------------ */
/*  Popup content — pulls from resume.ts (read-only), edit copy here.  */
/* ------------------------------------------------------------------ */

const aboutCopy = {
  intro:
    "Software developer with 3+ years in blockchain, turning ambitious Web3 and AI ideas into clear, dependable products.",
  paragraphs: [
    "I work at the intersection of blockchain and artificial intelligence, leading cross-functional teams from first client requirements through to shippable technical systems. My focus is building dependable software that makes complex on-chain and model-driven workflows feel simple.",
    "As Technical Architect at Blockchain Council I've led platform migrations, shipped blockchain courses with subject-matter experts, run 50+ instructor-led sessions, and trained AI models that now power a production chatbot.",
  ],
};

function Points({ items }: { items: string[] }) {
  return (
    <ul className="nav-pop-points">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="nav-pop-pills">
      {items.map((item) => (
        <span key={item} className="nav-pop-pill">
          {item}
        </span>
      ))}
    </div>
  );
}

type PopoverConfig = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  body: ReactNode;
};

const CONTENT: Record<string, PopoverConfig> = {
  Work: {
    eyebrow: "Work",
    title: "Featured projects",
    subtitle: "Selected builds across crypto data and on-chain transactions",
    body: (
      <>
        {projects.map((project) => (
          <div key={project.name} className="nav-pop-entry">
            <div className="nav-pop-entry-head">
              <span>{project.name}</span>
              <span>{project.period}</span>
            </div>
            <Points items={project.points} />
            <Pills items={project.stack} />
          </div>
        ))}
        {profile.githubRepository ? (
          <div className="nav-pop-links">
            <a
              href={profile.githubRepository}
              target="_blank"
              rel="noreferrer"
              className="nav-pop-link"
            >
              View source on GitHub
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : null}
      </>
    ),
  },

  Skills: {
    eyebrow: "Skills",
    title: "Technical toolkit",
    subtitle: "Languages, frameworks, and the way I work",
    body: (
      <>
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="nav-pop-entry">
            <p className="nav-pop-section-label">{group}</p>
            <Pills items={items} />
          </div>
        ))}
      </>
    ),
  },

  Experience: {
    eyebrow: "Experience",
    title: "Where I've worked",
    subtitle: "3+ years across blockchain teams and client delivery",
    body: (
      <>
        <p className="nav-pop-body" style={{ marginTop: 0 }}>
          {profile.summary}
        </p>
        {experience.map((block) => (
          <div key={block.id} className="nav-pop-entry">
            <div className="nav-pop-entry-head">
              <span>{block.title}</span>
              <span>{block.period}</span>
            </div>
            <p className="nav-pop-entry-sub">
              {block.org} · {block.location}
            </p>
            <Points items={block.points} />
          </div>
        ))}
      </>
    ),
  },

  Credentials: {
    eyebrow: "Credentials",
    title: "Education & certifications",
    body: (
      <>
        <div className="nav-pop-section">
          <p className="nav-pop-section-label">Education</p>
          {education.map((item) => (
            <div key={item.school} className="nav-pop-entry">
              <div className="nav-pop-entry-head">
                <span>{item.degree}</span>
                <span>{item.year}</span>
              </div>
              <p className="nav-pop-entry-sub">
                {item.school}
                {item.detail ? ` · ${item.detail}` : ""} · {item.score}
              </p>
            </div>
          ))}
        </div>
        <div className="nav-pop-section">
          <p className="nav-pop-section-label">Certifications</p>
          <dl className="nav-pop-facts" style={{ marginTop: "10px" }}>
            {certifications.map((cert) => (
              <div key={cert.name}>
                <dt>
                  {cert.issuer} · {cert.year}
                </dt>
                <dd>{cert.name}</dd>
              </div>
            ))}
          </dl>
        </div>
      </>
    ),
  },

  About: {
    eyebrow: "About",
    title: profile.name,
    subtitle: profile.role,
    body: (
      <>
        <p className="nav-pop-intro">{aboutCopy.intro}</p>
        {aboutCopy.paragraphs.map((paragraph, index) => (
          <p key={index} className="nav-pop-body">
            {paragraph}
          </p>
        ))}
        <div className="nav-pop-section">
          <dl className="nav-pop-facts">
            <div>
              <dt>Based in</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Software · Blockchain · AI</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>3+ years</dd>
            </div>
            <div>
              <dt>Now</dt>
              <dd>Technical Architect, Blockchain Council</dd>
            </div>
          </dl>
        </div>
        <div className="nav-pop-links">
          <a
            href="/Siddhesh_Raje_Resume.pdf"
            download="Siddhesh_Raje_Resume.pdf"
            className="nav-pop-link"
          >
            View full Resume
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>
      </>
    ),
  },

  Contact: {
    eyebrow: "Contact",
    title: "Get in touch",
    subtitle: "Open to software, blockchain, and AI product work",
    body: (
      <div className="nav-pop-links">
        <a href={`mailto:${profile.email}`} className="nav-pop-link">
          <Mail aria-hidden="true" className="h-3.5 w-3.5" />
          {profile.email}
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="nav-pop-link"
        >
          LinkedIn
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="nav-pop-link"
        >
          GitHub
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
        <span className="nav-pop-link" style={{ color: "var(--muted)" }}>
          <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
          {profile.location}
        </span>
      </div>
    ),
  },
};

export const NAV_POPOVER_LABELS = Object.keys(CONTENT);

/* ------------------------------------------------------------------ */
/*  Shell — click to open, close via ✕ / Escape / backdrop.            */
/* ------------------------------------------------------------------ */

export default function NavPopover({ label }: { label: string }) {
  const config = CONTENT[label];

  // `open` is always false on the server and first client render, so the portal
  // (which touches document.body) never runs during SSR.
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeNow = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNow();
    };
    document.addEventListener("keydown", onKey);

    closeRef.current?.focus();

    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open, closeNow]);

  if (!config) return null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="nav-pop-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-open={open}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>

      {open
        ? createPortal(
            <div
              className="nav-pop-overlay"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeNow();
              }}
            >
              <div
                className="nav-pop-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby={`nav-pop-${label}`}
              >
                <button
                  ref={closeRef}
                  type="button"
                  className="nav-pop-close"
                  aria-label={`Close ${label}`}
                  onClick={closeNow}
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>

                <p className="nav-pop-eyebrow">{config.eyebrow}</p>
                <h2 id={`nav-pop-${label}`} className="nav-pop-title">
                  {config.title}
                </h2>
                {config.subtitle ? (
                  <p className="nav-pop-subtitle">{config.subtitle}</p>
                ) : null}

                <div className="nav-pop-content">{config.body}</div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
