"use client";

import { useState } from "react";
import { certifications, education, experience, projects } from "@/data/resume";

const tabs = ["Experience", "Projects", "Education", "Credentials"] as const;
type Tab = (typeof tabs)[number];

export default function ResumeTabs() {
  const [active, setActive] = useState<Tab>("Experience");

  return (
    <div className="dashboard-card flex flex-col gap-3 p-3" id="experience">
      <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`shrink-0 rounded-lg border px-2.5 py-1 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/40 ${
              active === tab
                ? "border-accent/25 bg-accent-soft text-accent"
                : "border-line bg-panel-muted text-text-soft hover:border-line-strong"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto pr-1">
        {active === "Experience" && <ExperiencePanel />}
        {active === "Projects" && <ProjectsPanel />}
        {active === "Education" && <EducationPanel />}
        {active === "Credentials" && <CredentialsPanel />}
      </div>
    </div>
  );
}

function ExperiencePanel() {
  return (
    <div className="flex flex-col">
      {[...experience]
        .sort((a, b) => b.index - a.index)
        .map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-3 border-b border-dashed border-line py-3 text-sm"
          >
            <span className="min-w-0">
              <span className="block font-medium text-text-soft">{item.org}</span>
              <span className="mt-0.5 block text-xs text-muted">{item.title}</span>
            </span>
            <span className="max-w-[112px] shrink-0 text-right text-xs leading-5 text-muted">
              {item.period}
            </span>
          </div>
        ))}
    </div>
  );
}

function ProjectsPanel() {
  return (
    <div className="flex flex-col">
      {projects.map((project) => (
        <div key={project.name} className="border-b border-dashed border-line py-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm font-medium text-text-soft">{project.name}</span>
            <span className="shrink-0 text-right text-xs text-muted">{project.period}</span>
          </div>
          <p className="mt-1 text-xs leading-[18px] text-muted">{project.points[0]}</p>
          <p className="mt-1 font-mono text-[10px] text-faint">{project.stack.join(" · ")}</p>
        </div>
      ))}
    </div>
  );
}

function EducationPanel() {
  return (
    <div className="flex flex-col">
      {education.map((item) => (
        <div key={item.degree} className="border-b border-dashed border-line py-3">
          <div className="flex items-start justify-between gap-3">
            <span className="text-sm font-medium leading-5 text-text-soft">{item.degree}</span>
            <span className="shrink-0 text-xs text-muted">{item.year}</span>
          </div>
          <p className="mt-1 text-xs leading-[18px] text-muted">{item.school}</p>
          <p className="mt-0.5 font-mono text-[10px] text-faint">{item.score}</p>
        </div>
      ))}
    </div>
  );
}

function CredentialsPanel() {
  return (
    <div className="flex flex-col">
      {certifications.map((item) => (
        <div
          key={item.name}
          className="flex items-start justify-between gap-3 border-b border-dashed border-line py-3"
        >
          <span>
            <span className="block text-sm font-medium text-text-soft">{item.name}</span>
            <span className="mt-0.5 block text-xs text-muted">{item.issuer}</span>
          </span>
          <span className="text-xs text-muted">{item.year}</span>
        </div>
      ))}
    </div>
  );
}
