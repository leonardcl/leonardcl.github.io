import { now } from "../../data/site";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const Now = () => (
  <section id="now" className="max-w-site mx-auto px-6 sm:px-10 py-24">
    <SectionHeader index="01" title="Now" hint="what i'm building" />
    <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
      {now.map((item, i) => (
        <Reveal key={item.title} delay={i * 120}>
          <article className="group">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              {item.label}
            </p>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl text-ink font-medium group-hover:text-accent transition-colors">
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>
            <p className="mt-4 text-inkmuted leading-relaxed max-w-md">
              {item.description}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Now;
