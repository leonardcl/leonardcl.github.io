import { career, education, ExperienceItem } from "../../data/experience";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

/**
 * Geometry: dot is 12px wide at left:0 → its center sits at 6px.
 * The line is 2px wide at left:5px → its center also sits at 6px.
 * Content is indented past the gutter with pl-10.
 */
const Timeline = ({
  items,
  tone,
}: {
  items: ExperienceItem[];
  tone: "accent" | "blush";
}) => (
  <div className="relative">
    {/* The line — draws itself downward on first view */}
    <Reveal className="!transform-none absolute left-[5px] top-1.5 bottom-1.5 w-[2px]">
      <div
        className={`timeline-line absolute inset-0 ${
          tone === "accent"
            ? "bg-gradient-to-b from-accent via-accent/50 to-line"
            : "bg-gradient-to-b from-blush via-blush/50 to-line"
        }`}
      />
    </Reveal>

    <div>
      {items.map((item, i) => (
        <Reveal key={item.title + item.org} delay={Math.min(i * 80, 320)}>
          <article className="relative pl-10 pb-14 last:pb-2 group">
            {/* Dot — centered on the line */}
            <span
              className={`timeline-dot absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 bg-bone ${
                tone === "accent" ? "border-accent" : "border-blush"
              }`}
            />

            <span
              className={`font-mono text-xs tracking-wider ${
                tone === "accent" ? "text-accent" : "text-blush"
              }`}
            >
              {item.dates}
            </span>

            <h3 className="mt-2 font-display text-xl sm:text-2xl text-ink font-medium group-hover:text-accent transition-colors duration-300">
              {item.title}
              <span className="text-inkmuted font-sans text-base font-normal">
                {"  "}· {item.org}
              </span>
            </h3>

            <ul className="mt-3 space-y-1.5">
              {item.points.map((pt, j) => (
                <li
                  key={j}
                  className="text-inkmuted/90 leading-relaxed max-w-2xl text-[15px]"
                >
                  <span
                    className={`mr-2 ${
                      tone === "accent" ? "text-accent/50" : "text-blush/50"
                    }`}
                  >
                    —
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      ))}
    </div>
  </div>
);

const ExperienceTimeline = () => (
  <>
    <section id="experience" className="max-w-site mx-auto px-6 sm:px-10 py-24">
      <SectionHeader eyebrow="the journey" title="Work" italicTitle="Experience" />
      <Timeline items={career} tone="accent" />
    </section>

    <section id="education" className="max-w-site mx-auto px-6 sm:px-10 pb-24">
      <SectionHeader eyebrow="foundations" title="" italicTitle="Education" />
      <Timeline items={education} tone="blush" />
    </section>
  </>
);

export default ExperienceTimeline;
