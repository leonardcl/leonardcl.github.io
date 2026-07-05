import { career, education, ExperienceItem } from "../../data/experience";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

type TimelineEntry = ExperienceItem & { kind: "work" | "education" };

// One combined stream, newest first.
const entries: TimelineEntry[] = [
  ...career.map((c) => ({ ...c, kind: "work" as const })),
  ...education.map((e) => ({ ...e, kind: "education" as const })),
].sort((a, b) => {
  const start = (d: string) => parseInt(d.slice(0, 4), 10);
  return start(b.dates) - start(a.dates);
});

const ExperienceTimeline = () => (
  <section id="experience" className="max-w-site mx-auto px-6 sm:px-10 py-24">
    <SectionHeader index="02" title="Experience" hint="work & education" />

    <div className="relative pl-8 sm:pl-12">
      {/* The line — draws itself downward on first view */}
      <Reveal className="!transform-none absolute left-[5px] sm:left-[7px] top-2 bottom-2 w-px">
        <div className="timeline-line absolute inset-0 bg-gradient-to-b from-accent via-accent/60 to-line" />
      </Reveal>

      <div className="space-y-14">
        {entries.map((item, i) => (
          <Reveal key={item.title + item.org} delay={Math.min(i * 80, 320)}>
            <article className="relative group">
              {/* Dot */}
              <span
                className={`timeline-dot absolute -left-8 sm:-left-12 top-1.5 h-[11px] w-[11px] rounded-full border-2 ${
                  item.kind === "work"
                    ? "bg-accent border-accent"
                    : "bg-bone border-accent"
                }`}
              />

              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-xs text-accent tracking-wider">
                  {item.dates}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-inkmuted border border-line px-2 py-0.5">
                  {item.kind}
                </span>
              </div>

              <h3 className="mt-3 font-display text-xl sm:text-2xl text-ink font-medium group-hover:text-accent transition-colors duration-300">
                {item.title}
              </h3>
              <p className="mt-1 text-inkmuted font-sans">{item.org}</p>

              <ul className="mt-3 space-y-1.5">
                {item.points.map((pt, j) => (
                  <li
                    key={j}
                    className="text-inkmuted/90 leading-relaxed max-w-2xl text-[15px]"
                  >
                    <span className="text-accent/60 mr-2">—</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default ExperienceTimeline;
