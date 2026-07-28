import { ArrowUpRight, CodeXml, GitFork, Plus } from "lucide-react";
import { profile, projects } from "@/data/resume";

export default function GitHubSection() {
  const hasProfile = profile.github.trim().length > 0;

  return (
    <section id="github" className="github-section">
      <div className="github-profile-panel">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel-2 text-accent">
          <CodeXml aria-hidden="true" className="h-5 w-5" />
        </span>
        <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
          GitHub · Open source
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.035em] text-text">
          Code, experiments, and things I&apos;m learning in public.
        </h2>
        <p className="mt-3 max-w-[48ch] text-xs leading-5 text-muted">
          {hasProfile
            ? "My GitHub profile is connected. Featured project source links will appear here as each repository becomes public."
            : "This section is ready for your GitHub profile and repository links. Add them in the portfolio data file and every button will activate automatically."}
        </p>

        {hasProfile ? (
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-text px-4 py-2.5 text-xs font-medium text-panel"
            >
              View @SiDxxXx
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
            <a
              href={profile.githubRepository}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 text-xs font-medium text-text-soft transition-colors hover:bg-panel-muted"
            >
              Siddhesh-Raje repo
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <span className="mt-5 inline-flex items-center gap-2 rounded-lg border border-dashed border-line-strong px-4 py-2.5 text-xs text-muted">
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            Profile link coming soon
          </span>
        )}
      </div>

      <div className="github-repositories">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-text-soft">
              Featured repositories
            </p>
            <p className="mt-1 text-[10px] text-muted">
              Project slots are ready for your repository URLs.
            </p>
          </div>
          <GitFork aria-hidden="true" className="h-4 w-4 text-faint" />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {projects.map((project, index) => {
            const hasRepo = Boolean(project.repo);
            const content = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <CodeXml aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 font-mono text-[8px] ${
                      hasRepo
                        ? "bg-green/10 text-green"
                        : "bg-panel-muted text-faint"
                    }`}
                  >
                    {hasRepo ? "Public" : "Link pending"}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-text-soft">
                  {project.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-muted">
                  {project.points[0]}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="rounded border border-line bg-panel px-2 py-1 font-mono text-[8px] text-faint"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-medium text-accent">
                  {hasRepo ? "View repository" : `Repository slot ${index + 1}`}
                  {hasRepo && <ArrowUpRight aria-hidden="true" className="h-3 w-3" />}
                </span>
              </>
            );

            return hasRepo ? (
              <a
                key={project.name}
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="github-repo-card"
              >
                {content}
              </a>
            ) : (
              <article key={project.name} className="github-repo-card">
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
