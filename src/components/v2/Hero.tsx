import { useRef, useState } from "react";
import { site } from "../../data/site";

// Hand-placed constellation — no overlap, balanced composition.
// depth: how much the tag follows the cursor (parallax). Bigger = closer/faster.
const skillTags = [
  { label: "Machine Learning", top: "6%", left: "16%", depth: 22, size: "text-sm" },
  { label: "Robotics", top: "17%", left: "62%", depth: 34, size: "text-base" },
  { label: "Reinforcement Learning", top: "31%", left: "8%", depth: 16, size: "text-sm" },
  { label: "Python", top: "40%", left: "68%", depth: 28, size: "text-sm" },
  { label: "Computer Vision", top: "52%", left: "26%", depth: 38, size: "text-base" },
  { label: "LLM · RAG", top: "63%", left: "64%", depth: 20, size: "text-sm" },
  { label: "TypeScript", top: "74%", left: "12%", depth: 30, size: "text-xs" },
  { label: "ROS2", top: "83%", left: "48%", depth: 24, size: "text-sm" },
  { label: "IoT · Embedded", top: "93%", left: "20%", depth: 18, size: "text-xs" },
];

const Hero = () => {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalized cursor position in [-1, 1] relative to the skill field
    setOffset({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Ambient drifting color */}
      <div
        className="blob w-[480px] h-[480px] -top-24 -right-24 bg-accent/10"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="blob w-[380px] h-[380px] bottom-10 -left-32 bg-amber-400/15"
        style={{ animationDelay: "-9s" }}
      />

      <div className="relative max-w-site mx-auto w-full px-6 sm:px-10 pt-24 pb-16 grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 items-center">
        {/* ── Left: identity ── */}
        <div>
          <p
            className="font-mono text-xs sm:text-sm text-accent tracking-[0.25em] uppercase rise-blur"
            style={{ animationDelay: "100ms" }}
          >
            {site.role}
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
            <a
              href={`mailto:${site.email}`}
              className="u-link font-mono text-sm text-ink"
            >
              email
            </a>
          </div>
        </div>

        {/* ── Right: interactive skill constellation ── */}
        <div
          ref={fieldRef}
          className="relative hidden lg:block h-[520px] rise-blur"
          style={{ animationDelay: "850ms" }}
        >
          {skillTags.map((tag, i) => {
            const isHovered = hovered === tag.label;
            const dimOthers = hovered !== null && !isHovered;
            return (
              // Outer layer: cursor parallax
              <div
                key={tag.label}
                className="absolute transition-transform duration-500 ease-out will-change-transform"
                style={{
                  top: tag.top,
                  left: tag.left,
                  transform: `translate(${offset.x * tag.depth}px, ${offset.y * tag.depth}px)`,
                }}
              >
                {/* Inner layer: idle float */}
                <div
                  className="skill-float"
                  style={{
                    animationDuration: `${5 + (i % 4) * 1.3}s`,
                    animationDelay: `${-i * 0.9}s`,
                  }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setHovered(tag.label)}
                    onMouseLeave={() => setHovered(null)}
                    className={`font-mono ${tag.size} whitespace-nowrap border px-4 py-2 rounded-full cursor-default
                      transition-all duration-300 ease-out
                      ${
                        isHovered
                          ? "bg-accent text-bone border-accent scale-110 shadow-lg shadow-accent/25"
                          : "bg-bone/70 text-ink border-line backdrop-blur-sm"
                      }
                      ${dimOthers ? "opacity-30 blur-[1px]" : "opacity-100"}`}
                  >
                    {tag.label}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: skills as a quiet static line */}
      <p className="lg:hidden relative max-w-site mx-auto w-full px-6 sm:px-10 pb-10 font-mono text-[11px] text-inkmuted tracking-wide rise-blur"
         style={{ animationDelay: "850ms" }}>
        {site.capabilities.join("  ·  ")}
      </p>
    </section>
  );
};

export default Hero;
