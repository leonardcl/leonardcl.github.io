import { site } from "../../data/site";

const marqueeSkills = [
  "Python",
  "Machine Learning",
  "Robotics",
  "Reinforcement Learning",
  "Computer Vision",
  "TypeScript",
  "LLM",
  "RAG",
  "ROS2",
  "Electrical Engineering",
  "IoT",
  "POMDP",
  "Education",
  "AI Products",
];

const Hero = () => (
  <section
    id="home"
    className="relative min-h-screen flex flex-col justify-center overflow-hidden"
  >
    {/* Ambient drifting color — the room's atmosphere */}
    <div
      className="blob w-[480px] h-[480px] -top-24 -right-24 bg-accent/15"
      style={{ animationDelay: "0s" }}
    />
    <div
      className="blob w-[380px] h-[380px] bottom-10 -left-32 bg-amber-400/20"
      style={{ animationDelay: "-9s" }}
    />

    {/* Faint oversized monogram */}
    <span
      aria-hidden
      className="pointer-events-none select-none absolute right-0 top-24 font-display italic text-[26vw] leading-none text-ink/[0.04]"
    >
      lc
    </span>

    <div className="relative max-w-site mx-auto w-full px-6 sm:px-10 pt-24 pb-10">
      <p
        className="font-mono text-xs sm:text-sm text-accent tracking-[0.25em] uppercase rise-blur"
        style={{ animationDelay: "100ms" }}
      >
        {site.role}
      </p>

      <h1 className="mt-6 font-display font-medium text-ink leading-[0.95] tracking-tight text-[clamp(3rem,10vw,7.5rem)]">
        <span className="block rise-blur" style={{ animationDelay: "220ms" }}>
          Leonard
        </span>
        <span
          className="block italic font-light rise-blur"
          style={{ animationDelay: "340ms" }}
        >
          Christopher
        </span>
      </h1>

      <p
        className="mt-8 max-w-xl text-lg sm:text-xl text-inkmuted leading-relaxed rise-blur"
        style={{ animationDelay: "480ms" }}
      >
        {site.tagline}
      </p>

      <p
        className="mt-10 font-display italic text-ink/80 text-xl sm:text-2xl rise-blur"
        style={{ animationDelay: "600ms" }}
      >
        “{site.motto[0]} {site.motto[1]}”
      </p>

      <div
        className="mt-12 flex items-center gap-6 rise-blur"
        style={{ animationDelay: "720ms" }}
      >
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="u-link font-mono text-sm text-ink"
        >
          github
        </a>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="u-link font-mono text-sm text-ink"
        >
          linkedin
        </a>
        <a href={`mailto:${site.email}`} className="u-link font-mono text-sm text-ink">
          email
        </a>
        <a
          href="#/#work"
          className="ml-auto hidden sm:inline font-mono text-xs text-inkmuted hover:text-accent transition-colors"
        >
          scroll ↓
        </a>
      </div>
    </div>

    {/* Skills — alive, endless, pausable */}
    <div
      className="relative mt-6 border-y border-line py-4 overflow-hidden rise-blur"
      style={{ animationDelay: "850ms" }}
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {marqueeSkills.map((skill) => (
              <span
                key={`${copy}-${skill}`}
                className="mx-6 font-mono text-xs sm:text-sm text-inkmuted whitespace-nowrap hover:text-accent transition-colors cursor-default"
              >
                {skill} <span className="text-accent/50 ml-6">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bone to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bone to-transparent" />
    </div>
  </section>
);

export default Hero;
