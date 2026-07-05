import { useRef, useState } from "react";
import { site } from "../../data/site";
import SkillList from "./SkillList";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalized cursor position in [-1, 1] across the hero
    setOffset({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Ambient drifting color */}
      <div
        className="blob w-[480px] h-[480px] -top-24 -right-24 bg-accent/10"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="blob w-[380px] h-[380px] bottom-10 -left-32 bg-blush/10"
        style={{ animationDelay: "-9s" }}
      />

      <div className="relative max-w-site mx-auto w-full px-6 sm:px-10 pt-24 pb-16 grid lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] gap-10 items-center">
        {/* ── Left: identity ── */}
        <div>
          <p
            className="font-mono text-xs sm:text-sm text-accent tracking-[0.25em] uppercase rise-blur"
            style={{ animationDelay: "100ms" }}
          >
            {site.kicker}
          </p>

          <h1 className="mt-6 font-display font-medium text-ink leading-[0.95] tracking-tight text-[clamp(3rem,8vw,6.5rem)]">
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
            <span className="text-blush">“</span>
            {site.motto[0]} {site.motto[1]}
            <span className="text-blush">”</span>
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
            <a
              href={`mailto:${site.email}`}
              className="u-link font-mono text-sm text-ink"
            >
              email
            </a>
          </div>
        </div>

        {/* ── Right: the skill list ── */}
        <div className="hidden lg:block">
          <SkillList offset={offset} />
        </div>
      </div>

      {/* Mobile: skills as a quiet static line */}
      <p
        className="lg:hidden relative max-w-site mx-auto w-full px-6 sm:px-10 pb-10 font-mono text-[11px] text-inkmuted tracking-wide rise-blur"
        style={{ animationDelay: "850ms" }}
      >
        {site.capabilities.join("  ·  ")}
      </p>
    </section>
  );
};

export default Hero;
