import { projects } from "../../data/projects";
import SectionHeader from "./SectionHeader";
import { IconSpark } from "./Icons";
import Reveal from "./Reveal";

const Work = () => (
  <section id="work" className="max-w-site mx-auto px-6 sm:px-10 py-24">
    <SectionHeader eyebrow="what have i created?" title="Selected" italicTitle="Work" icon={<IconSpark />} />

    <div>
      {projects.map((p, i) => (
        <Reveal key={p.title} delay={Math.min(i * 60, 240)}>
          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="work-row group flex flex-col md:grid md:grid-cols-[minmax(0,1fr)_260px] gap-5 md:gap-12 md:items-center py-8 md:py-10 border-b border-line first:border-t"
          >
            {/* Mobile-only thumbnail — full width, above the text. Desktop
                gets the side thumbnail below instead (image swaps position
                rather than disappearing, so the row stays visually rich). */}
            <div className="md:hidden overflow-hidden border border-line">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="w-full h-44 object-cover"
              />
            </div>

            <div>
              <div className="flex items-baseline gap-4">
                <span className="shrink-0 font-mono text-xs text-inkmuted group-hover:text-accent transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="min-w-0 font-display text-2xl sm:text-3xl text-ink font-medium group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
                  {p.title}
                  <span className="work-arrow inline-block ml-2 text-accent transition-all duration-300">
                    ↗
                  </span>
                </h3>
              </div>
              <p className="mt-4 text-inkmuted leading-relaxed max-w-xl">
                {p.description}
              </p>
              <p className="mt-4 font-mono text-xs text-inkmuted tracking-wide">
                {p.year} · {p.tags.join(" · ")}
              </p>
            </div>

            <div className="hidden md:block overflow-hidden border border-line group-hover:border-accent/40 transition-colors duration-500">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="w-full h-40 object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700 ease-out"
              />
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Work;
