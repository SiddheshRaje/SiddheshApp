import { Award, ArrowUpRight } from "lucide-react";
import { certifications } from "@/data/resume";

export default function CredentialsCard() {
  const featured = [...certifications].sort(
    (a, b) => Number(b.year) - Number(a.year),
  );

  return (
    <section className="support-card credentials-support" id="credentials">
      <div className="support-card-heading">
        <span className="flex items-center gap-2">
          <Award aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
          Credentials
        </span>
      </div>

      <div className="scrollbar-thin mt-2 max-h-[88px] space-y-2 overflow-y-auto pr-1">
        {featured.map((item, index) => (
          <div
            key={item.name}
            className="grid grid-cols-[24px_1fr_auto] items-center gap-2 text-[9px]"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full font-display text-[9px] font-semibold ${
                index % 3 === 0
                  ? "bg-accent-soft text-accent"
                  : index % 3 === 1
                    ? "bg-green/10 text-green"
                    : "bg-blue/10 text-blue"
              }`}
            >
              {item.name.charAt(0)}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-medium text-text-soft">{item.name}</span>
              <span className="block truncate text-faint">{item.issuer}</span>
            </span>
            <span className="font-mono text-faint">{item.year}</span>
          </div>
        ))}
      </div>

      <a
        href="/Siddhesh_Raje_Resume.pdf"
        download
        className="mt-1 inline-flex items-center gap-1.5 text-[9px] font-medium text-accent"
      >
        View all credentials
        <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
      </a>
    </section>
  );
}
