import { ArrowUpRight, Code2 } from "lucide-react";

type Segment = {
  text: string;
  tone?: "keyword" | "string" | "function" | "comment";
};

const lines: Segment[][] = [
  [
    { text: "const ", tone: "keyword" },
    { text: "profile = {" },
  ],
  [
    { text: "  role: " },
    { text: "'Front-End Developer'", tone: "string" },
    { text: "," },
  ],
  [{ text: "  workingAt: {" }],
  [
    { text: "    nexus: [" },
    { text: "'Blockchain'", tone: "string" },
    { text: ", " },
    { text: "'AI'", tone: "string" },
    { text: "]," },
  ],
  [{ text: "  }," }],
  [
    { text: "  wiring: [" },
    { text: "'chains'", tone: "string" },
    { text: ", " },
    { text: "'models'", tone: "string" },
    { text: ", " },
    { text: "'interfaces'", tone: "string" },
    { text: "]," },
  ],
  [
    { text: "  focus: " },
    { text: "'crafting delightful interfaces'", tone: "string" },
  ],
  [{ text: "}" }],
];

const toneClass = {
  keyword: "tok-kw",
  string: "tok-str",
  function: "tok-fn",
  comment: "tok-com",
};

export default function CodeBio() {
  return (
    <section className="support-card code-support" id="about">
      <div className="support-card-heading">
        <span className="flex items-center gap-2">
          <Code2 aria-hidden="true" className="h-3.5 w-3.5 text-accent" />
          Code profile
        </span>
      </div>

      <code className="mt-3 block overflow-x-auto font-mono text-[9px] leading-[1.55] text-text-soft">
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} className="block whitespace-pre">
            {line.map((segment, segmentIndex) => (
              <span
                key={`${lineIndex}-${segmentIndex}`}
                className={segment.tone ? toneClass[segment.tone] : undefined}
              >
                {segment.text}
              </span>
            ))}
          </span>
        ))}
      </code>

      <a
        href="/Siddhesh_Raje_Resume.pdf"
        download
        className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-medium text-accent"
      >
        View full profile
        <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
      </a>
    </section>
  );
}
