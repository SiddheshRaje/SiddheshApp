import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { experience } from "@/data/resume";

export default function ExperienceTimeline() {
  const sorted = [...experience].sort((a, b) => b.index - a.index);

  return (
    <section className="support-card experience-support" id="experience">
      <div className="support-card-heading">
        <span className="flex items-center gap-2">
          <BriefcaseBusiness aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
          Experience timeline
        </span>
      </div>

      <div className="mt-2 space-y-1">
        {sorted.map((item, index) => (
          <div key={item.id} className="grid grid-cols-[12px_94px_1fr] gap-2 text-[9px]">
            <span className="relative flex justify-center">
              <span
                className={`mt-1 h-2 w-2 rounded-full border ${
                  index === 0 ? "border-accent bg-accent" : "border-line-strong bg-panel"
                }`}
              />
              {index < sorted.length - 1 && (
                <span className="absolute bottom-[-14px] top-3 w-px bg-line" />
              )}
            </span>
            <span className="leading-4 text-muted">{item.period}</span>
            <span className="min-w-0">
              <span className="block font-medium text-text-soft">{item.org}</span>
              <span className="block truncate text-muted">{item.title}</span>
            </span>
          </div>
        ))}
      </div>

      <a
        href="/Siddhesh_Raje_Resume.pdf"
        download
        className="mt-1 inline-flex items-center gap-1.5 text-[9px] font-medium text-accent"
      >
        View full experience
        <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
      </a>
    </section>
  );
}
