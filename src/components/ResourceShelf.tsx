import { CodeXml, Files, FileText, Link, Mail } from "lucide-react";
import { profile } from "@/data/resume";

const resources = [
  {
    label: "Resume",
    detail: "PDF",
    href: "/Siddhesh_Raje_Resume.pdf",
    download: true,
    icon: FileText,
    accent: "text-[#f04438]",
  },
  {
    label: "LinkedIn",
    detail: "Profile",
    href: profile.linkedin,
    external: true,
    icon: Link,
    accent: "text-blue",
  },
  {
    label: "GitHub",
    detail: "Profile",
    href: profile.github,
    external: true,
    icon: CodeXml,
    accent: "text-text-soft",
  },
  {
    label: "Email me",
    detail: "Compose",
    href: `mailto:${profile.email}`,
    icon: Mail,
    accent: "text-green",
  },
];

export default function ResourceShelf() {
  return (
    <section className="support-card resources-support">
      <div className="support-card-heading">
        <span className="flex items-center gap-2">
          <Files aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
          Resume &amp; files
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {resources.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              download={item.download}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group flex min-w-0 items-center gap-2 rounded-lg border border-line bg-panel-2 p-2 transition-colors hover:border-accent/30 hover:bg-accent-soft"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line bg-panel">
                <Icon aria-hidden="true" className={`h-3.5 w-3.5 ${item.accent}`} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[9px] font-medium text-text-soft">
                  {item.label}
                </span>
                <span className="block text-[8px] text-faint">{item.detail}</span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
