import { useRef } from "react";
import { site } from "../../data/site";
import SkillConstellation from "./SkillConstellation";

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const litRef = useRef<HTMLDivElement>(null);
  // Cursor position in [-1, 1] across the hero. A ref, not state: the
  // constellation reads it every frame, and the spotlight is moved by
  // writing two CSS variables, so mouse movement never re-renders React.
  const pointer = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    pointer.current = { x: (fx - 0.5) * 2, y: (fy - 0.5) * 2 };
    litRef.current?.style.setProperty("--mx", `${fx * 100}%`);
    litRef.current?.style.setProperty("--my", `${fy * 100}%`);
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen min-h-svh flex flex-col justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Ambient drifting color */}
      <div
        className="blob w-[480px] h-[480px] -top-24 -right-24 text-accent/10"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="blob w-[380px] h-[380px] bottom-10 -left-32 text-blush/10"
        style={{ animationDelay: "-9s" }}
      />

      {/* Engineering dot grid — faint blueprint paper */}
      <div className="hero-grid" />
      {/* Blue dots wake up inside a spotlight that follows the cursor */}
      <div ref={litRef} className="hero-grid-lit" />

      <div className="relative max-w-site mx-auto w-full px-6 sm:px-10 pt-24 pb-16 grid lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] gap-10 items-center">
        {/* ── Left: identity ── */}
        <div>
          <p
            className="font-mono text-xs sm:text-sm text-accent tracking-[0.25em] uppercase rise-blur"
            style={{ animationDelay: "100ms" }}
          >
            {site.kicker}
            <span className="hidden sm:inline"> · </span>
            <br className="sm:hidden" />
            {site.location}
          </p>

          <h1 className="mt-6 font-display font-medium text-ink leading-[0.95] tracking-tight text-[clamp(2.75rem,7.2vw,6rem)]">
            <span className="block rise-blur-visible" style={{ animationDelay: "220ms" }}>
              Leonard
            </span>
            <span
              className="block italic font-light rise-blur-visible"
              style={{ animationDelay: "340ms" }}
            >
              Christopher
            </span>
            <span className="block rise-blur-visible" style={{ animationDelay: "460ms" }}>
              Limanjaya
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
              href={`mailto:${site.email}`}
              className="font-mono text-sm px-5 py-3 border border-ink bg-ink text-bone hover:bg-accent hover:border-accent active:scale-[0.97] transition-[color,background-color,border-color,transform] duration-150 ease-out"
            >
              email me
            </a>
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
          </div>
        </div>

        {/* ── Right: the skill constellation ── */}
        <div className="hidden lg:block rise-blur" style={{ animationDelay: "800ms" }}>
          <SkillConstellation pointer={pointer} />
        </div>
      </div>

      {/* Mobile: skills as a quiet static line */}
      <p
        className="lg:hidden relative max-w-site mx-auto w-full px-6 sm:px-10 pb-10 font-mono text-xs text-inkmuted tracking-wide rise-blur"
        style={{ animationDelay: "850ms" }}
      >
        {site.capabilities.join("  ·  ")}
      </p>
    </section>
  );
};

export default Hero;
