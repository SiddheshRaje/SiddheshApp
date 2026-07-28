import { ArrowUpRight, Blocks, ChartNoAxesCombined } from "lucide-react";
import { projects } from "@/data/resume";

const projectIcons = [ChartNoAxesCombined, Blocks];

export default function PortfolioCallout() {
  return (
    <div className="dashboard-card flex" id="projects">
      <div className="flex w-20 shrink-0 items-center justify-center border-r border-line bg-panel-muted">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-panel shadow-sm">
          <span className="font-display text-sm font-semibold text-accent">02</span>
        </div>
      </div>

      <div className="min-w-0 flex-1 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-soft">Selected work</p>
            <p className="mt-0.5 text-xs text-muted">Two builds, one practical obsession.</p>
          </div>
          <span className="rounded-full bg-green/10 px-2 py-1 text-[10px] font-medium text-green">
            Public
          </span>
        </div>

        <div className="mt-4 divide-y divide-dashed divide-line">
          {projects.map((project, index) => {
            const Icon = projectIcons[index] ?? Blocks;

            return (
              <a
                key={project.name}
                href={`mailto:siddhesh.raje28@gmail.com?subject=${encodeURIComponent(
                  `Tell me more about ${project.name}`,
                )}`}
                className="group flex items-center gap-3 py-3 first:pt-0"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-text-soft">
                    {project.name}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[10px] text-muted">
                    {project.stack.slice(0, 4).join(" · ")}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
