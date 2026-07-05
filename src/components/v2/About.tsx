import { about } from "../../data/site";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const About = () => (
  <section id="about" className="max-w-site mx-auto px-6 sm:px-10 py-24">
    <SectionHeader eyebrow="who i am" title="About" italicTitle="me" />

    <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-14 lg:gap-20">
      {/* Bio */}
      <Reveal>
        <div className="space-y-6">
          {about.bio.map((paragraph, i) => (
            <p
              key={i}
              className={`leading-relaxed ${
                i === 0
                  ? "font-display text-xl sm:text-2xl text-ink/90 font-light"
                  : "text-inkmuted text-[16px]"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>

      {/* Expertise — the four domains */}
      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
        {about.expertise.map((domain, i) => (
          <Reveal key={domain.title} delay={i * 100}>
            <div className="group cursor-default">
              <div className="flex items-center gap-3">
                <span
                  className={`h-1.5 w-1.5 rotate-45 transition-transform duration-300 group-hover:rotate-[135deg] ${
                    i % 2 === 0 ? "bg-accent" : "bg-blush"
                  }`}
                />
                <h3
                  className={`font-display text-xl sm:text-2xl text-ink font-medium transition-colors duration-300 ${
                    i % 2 === 0 ? "group-hover:text-accent" : "group-hover:text-blush"
                  }`}
                >
                  {domain.title}
                </h3>
              </div>
              <p className="mt-3 pl-[18px] text-inkmuted text-[15px] leading-relaxed border-l border-line group-hover:border-current transition-colors duration-300">
                {domain.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default About;
