import { useState } from "react";

/**
 * The skill list — calm, editorial, type-first.
 * Each line slides in on load; hovering indents it, colors it,
 * and reveals a small mono note. The whole list leans gently with the cursor.
 */
const skills = [
  { name: "Machine Learning", note: "models that ship" },
  { name: "Reinforcement Learning", note: "my research home" },
  { name: "Robotics", note: "ROS2 · real hardware" },
  { name: "Computer Vision", note: "pixels → decisions" },
  { name: "LLM · RAG", note: "grounded generation" },
  { name: "Python · TypeScript", note: "daily drivers" },
  { name: "IoT · Embedded", note: "hardware roots" },
];

const SkillList = ({ offset }: { offset: { x: number; y: number } }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="transition-transform duration-700 ease-out will-change-transform"
      style={{ transform: `translate(${offset.x * 10}px, ${offset.y * 10}px)` }}
    >
      <p
        className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted mb-8 rise-blur"
        style={{ animationDelay: "850ms" }}
      >
        <span className="inline-block h-1.5 w-1.5 rotate-45 bg-blush mr-3 align-middle" />
        what i work with
      </p>

      <ul>
        {skills.map((skill, i) => {
          const isHovered = hovered === i;
          const dimmed = hovered !== null && !isHovered;
          return (
            <li key={skill.name} className="rise-blur" style={{ animationDelay: `${950 + i * 90}ms` }}>
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`group flex items-baseline gap-4 py-3 border-b border-line/70 cursor-default
                  transition-all duration-300 ease-out
                  ${isHovered ? "pl-4" : "pl-0"}
                  ${dimmed ? "opacity-40" : "opacity-100"}`}
              >
                <span
                  className={`font-mono text-xs transition-colors duration-300 ${
                    isHovered ? "text-blush" : "text-line"
                  }`}
                >
                  —
                </span>
                <span
                  className={`font-display text-2xl sm:text-[1.75rem] font-light leading-snug transition-colors duration-300 ${
                    isHovered ? "text-accent italic" : "text-ink/85"
                  }`}
                >
                  {skill.name}
                </span>
                <span
                  className={`ml-auto font-mono text-[11px] whitespace-nowrap transition-all duration-300 ${
                    isHovered ? "opacity-100 translate-x-0 text-blush" : "opacity-0 translate-x-2 text-inkmuted"
                  }`}
                >
                  {skill.note}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SkillList;
