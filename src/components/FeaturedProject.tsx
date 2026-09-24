import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Layers3,
  UserRound,
} from "lucide-react";
import type { Project } from "@/data/resume";
import { profile } from "@/data/resume";
import TransactionApp from "@/projects/blockchain-transaction-app/TransactionApp";

export default function FeaturedProject({
  project,
  variant,
}: {
  project: Project;
  variant: "market" | "transaction";
}) {
  const isMarket = variant === "market";

  return (
    <article className="featured-project">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="rounded bg-accent-soft px-2 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-accent">
            Featured project
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.035em] text-text">
            {project.name}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {isMarket
              ? "Real-time market analytics and portfolio insights."
              : "Secure, transparent, and intuitive transaction flows."}
          </p>
        </div>
      </div>

      <div className="project-preview mt-4">
        {isMarket ? <MarketPreview /> : <TransactionApp />}
      </div>

      <div className="project-meta-grid">
        <ProjectMeta
          icon={UserRound}
          label="Role"
          value="Software Developer"
        />
        <ProjectMeta
          icon={Layers3}
          label="Stack"
          value={project.stack.slice(0, 4).join(" · ")}
        />
        <ProjectMeta
          icon={ChartNoAxesCombined}
          label="Outcome"
          value={
            isMarket
              ? "Live pricing with USD/INR conversion"
              : "Secure MetaMask transaction flow"
          }
        />
      </div>

      {isMarket && (
        <a
          href={`mailto:${profile.email}?subject=${encodeURIComponent(
            `Portfolio walkthrough: ${project.name}`,
          )}`}
          className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-accent transition-colors hover:text-text"
        >
          Request a walkthrough
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
      )}

      {!isMarket && (
        <p className="mt-4 text-[10px] text-muted">
          This is a small demo.{" "}
          <a
            href="https://github.com/SiddheshRaje/EthereumDecentralizedApp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-accent transition-colors hover:text-text"
          >
            Access the Code on Github.
            <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
          </a>
        </p>
      )}

    </article>
  );
}

function ProjectMeta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs text-text-soft">
        <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        {label}
      </p>
      <p className="mt-1 text-[10px] leading-4 text-muted">{value}</p>
    </div>
  );
}

function MarketPreview() {
  const assets = [
    ["Bitcoin", "BTC", "$67,324.60", "+2.4%"],
    ["Ethereum", "ETH", "$3,423.68", "+1.8%"],
    ["Solana", "SOL", "$176.35", "+2.9%"],
  ];

  return (
    <div className="market-preview">
      <div className="grid grid-cols-[1.35fr_0.8fr] gap-2">
        <div className="preview-panel p-3">
          <p className="text-[9px] text-muted">Market overview</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <p className="font-mono text-sm font-medium text-text">$48,629.31</p>
            <span className="text-[8px] text-green">+3.82% (24h)</span>
          </div>
          <svg viewBox="0 0 260 64" className="mt-2 h-12 w-full" aria-hidden="true">
            <defs>
              <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 52 18 44 34 47 52 31 68 36 88 18 107 24 125 12 143 22 160 15 179 28 198 19 218 34 238 27 260 38V64H0Z"
              fill="url(#chart-fill)"
            />
            <path
              d="M0 52 18 44 34 47 52 31 68 36 88 18 107 24 125 12 143 22 160 15 179 28 198 19 218 34 238 27 260 38"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="preview-panel p-3">
          <p className="text-[9px] text-muted">Top movers</p>
          <div className="mt-2 space-y-2">
            {assets.slice(0, 2).map(([name, symbol, , change]) => (
              <div key={symbol} className="flex items-center justify-between gap-2">
                <span>
                  <span className="block text-[8px] text-text-soft">{name}</span>
                  <span className="block font-mono text-[7px] text-faint">{symbol}</span>
                </span>
                <span className="text-[8px] text-green">{change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="preview-panel mt-2 overflow-hidden">
        <div className="grid grid-cols-[1fr_0.7fr_0.5fr] border-b border-line px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.08em] text-faint">
          <span>Asset</span>
          <span>Price</span>
          <span className="text-right">24h</span>
        </div>
        {assets.map(([name, symbol, price, change]) => (
          <div
            key={symbol}
            className="grid grid-cols-[1fr_0.7fr_0.5fr] items-center border-b border-line/60 px-3 py-1.5 last:border-0"
          >
            <span className="text-[8px] text-text-soft">
              {name} <span className="font-mono text-faint">{symbol}</span>
            </span>
            <span className="font-mono text-[8px] text-muted">{price}</span>
            <span className="text-right text-[8px] text-green">{change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
