import { site } from "../../data/site";

const Hero = () => (
  <section
    id="home"
    className="relative min-h-screen flex flex-col justify-center max-w-site mx-auto px-6 sm:px-10 pt-24 pb-16"
  >
    {/* Faint oversized index in the background */}
    <span
      aria-hidden
      className="pointer-events-none select-none absolute right-0 top-24 font-display italic text-[26vw] leading-none text-ink/[0.035]"
    >
      lc
    </span>

    <p
      className="font-mono text-xs sm:text-sm text-accent tracking-[0.25em] uppercase animate-riseIn"
      style={{ animationDelay: "100ms" }}
    >
      {site.role}
    </p>

    <h1
      className="mt-6 font-display font-medium text-ink leading-[0.95] tracking-tight text-[clamp(3rem,10vw,7.5rem)] animate-riseIn"
      style={{ animationDelay: "220ms" }}
    >
      Leonard
      <br />
      <span className="italic font-light">Christopher</span>
    </h1>

    <p
      className="mt-8 max-w-xl text-lg sm:text-xl text-inkmuted leading-relaxed animate-riseIn"
      style={{ animationDelay: "360ms" }}
    >
      {site.tagline}
    </p>

    <p
      className="mt-10 font-display italic text-ink/80 text-xl sm:text-2xl animate-riseIn"
      style={{ animationDelay: "480ms" }}
    >
      “{site.motto[0]} {site.motto[1]}”
    </p>

    {/* Capabilities — the old Expertise cards, distilled to one mono line */}
    <p
      className="mt-12 font-mono text-[11px] sm:text-xs text-inkmuted tracking-wide animate-riseIn"
      style={{ animationDelay: "600ms" }}
    >
      {site.capabilities.join("  ·  ")}
    </p>

    <div
      className="mt-10 flex items-center gap-6 animate-riseIn"
      style={{ animationDelay: "700ms" }}
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
        href="#/#now"
        className="ml-auto hidden sm:inline font-mono text-xs text-inkmuted hover:text-accent transition-colors"
      >
        scroll ↓
      </a>
    </div>
  </section>
);

export default Hero;
