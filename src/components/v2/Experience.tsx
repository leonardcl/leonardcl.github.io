import { career, education, ExperienceItem } from "../../data/experience";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const Row = ({ item }: { item: ExperienceItem }) => (
  <div className="grid sm:grid-cols-[150px_minmax(0,1fr)] gap-2 sm:gap-10 py-8 border-b border-line">
    <span className="font-mono text-xs text-inkmuted pt-1.5">{item.dates}</span>
    <div>
      <h3 className="font-display text-xl sm:text-2xl text-ink font-medium">
        {item.title}
        <span className="text-inkmuted font-sans text-base sm:text-lg font-normal">
          {"  "}· {item.org}
        </span>
      </h3>
      <ul className="mt-3 space-y-1.5">
        {item.points.map((pt, i) => (
          <li key={i} className="text-inkmuted leading-relaxed max-w-2xl text-[15px]">
            — {pt}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Experience = () => (
  <section id="experience" className="max-w-site mx-auto px-6 sm:px-10 py-24">
    <SectionHeader index="03" title="Experience" hint="the journey so far" />
    <div className="border-t border-line">
      {career.map((item) => (
        <Reveal key={item.title + item.org}>
          <Row item={item} />
        </Reveal>
      ))}
    </div>

    <p className="mt-16 mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
      education
    </p>
    <div className="border-t border-line">
      {education.map((item) => (
        <Reveal key={item.title}>
          <Row item={item} />
        </Reveal>
      ))}
    </div>
  </section>
);

export default Experience;
