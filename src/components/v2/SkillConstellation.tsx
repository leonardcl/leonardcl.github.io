import { useState } from "react";

/**
 * The skill constellation — a quiet network graph.
 * Thin lines draw themselves in on load, dots breathe,
 * hovering a node lights it pink and its connections blue.
 * The whole constellation leans gently with the cursor.
 */

type Node = {
  id: string;
  label: string;
  x: number; // viewBox coords (0–520)
  y: number; // (0–560)
  anchor?: "start" | "end" | "middle"; // label side
  big?: boolean; // hub nodes render slightly larger
};

const nodes: Node[] = [
  { id: "ml", label: "Machine Learning", x: 250, y: 150, big: true, anchor: "start" },
  { id: "rl", label: "Reinforcement Learning", x: 130, y: 60, anchor: "start" },
  { id: "cv", label: "Computer Vision", x: 380, y: 80, anchor: "start" },
  { id: "robotics", label: "Robotics", x: 430, y: 230, big: true, anchor: "start" },
  { id: "llm", label: "LLM · RAG", x: 320, y: 300, anchor: "start" },
  { id: "python", label: "Python", x: 160, y: 250, big: true, anchor: "end" },
  { id: "ts", label: "TypeScript", x: 100, y: 380, anchor: "start" },
  { id: "iot", label: "IoT · Embedded", x: 280, y: 440, anchor: "start" },
  { id: "ros", label: "ROS2", x: 430, y: 400, anchor: "start" },
];

const edges: [string, string][] = [
  ["ml", "rl"],
  ["ml", "cv"],
  ["ml", "llm"],
  ["ml", "python"],
  ["rl", "python"],
  ["cv", "robotics"],
  ["robotics", "ros"],
  ["llm", "python"],
  ["python", "ts"],
  ["python", "iot"],
  ["iot", "ros"],
  ["robotics", "llm"],
];

const INK = "#191918";
const MUTED = "#6B6A64";
const LINE = "#D9D7CD";
const ACCENT = "#3538CD";
const BLUSH = "#D6336C";

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

const SkillConstellation = ({ offset }: { offset: { x: number; y: number } }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const isNeighbor = (id: string) =>
    hovered !== null &&
    edges.some(
      ([a, b]) => (a === hovered && b === id) || (b === hovered && a === id)
    );

  return (
    <div
      className="transition-transform duration-700 ease-out will-change-transform"
      style={{ transform: `translate(${offset.x * 14}px, ${offset.y * 14}px)` }}
    >
      <svg
        viewBox="0 0 520 500"
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Skill map"
      >
        {/* Edges — draw themselves in */}
        {edges.map(([a, b], i) => {
          const na = byId[a];
          const nb = byId[b];
          const lit = hovered === a || hovered === b;
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              pathLength={1}
              className="edge-draw"
              style={{
                animationDelay: `${900 + i * 110}ms`,
                stroke: lit ? ACCENT : LINE,
                strokeWidth: lit ? 1.4 : 1,
                opacity: hovered && !lit ? 0.35 : 1,
                transition: "stroke 0.3s ease, opacity 0.3s ease, stroke-width 0.3s ease",
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const active = hovered === node.id;
          const related = isNeighbor(node.id);
          const dimmed = hovered !== null && !active && !related;
          const r = node.big ? 5.5 : 4;
          return (
            <g
              key={node.id}
              className="node-pop cursor-default"
              style={{ animationDelay: `${1100 + i * 90}ms` }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* generous invisible hover target */}
              <circle cx={node.x} cy={node.y} r={26} fill="transparent" />

              {/* breathing halo */}
              <circle
                cx={node.x}
                cy={node.y}
                r={r + 5}
                fill={active ? BLUSH : ACCENT}
                className="dot-breathe"
                style={{
                  opacity: active ? 0.25 : 0.12,
                  animationDelay: `${-i * 0.7}s`,
                  transition: "fill 0.3s ease",
                }}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={active ? r + 1.5 : r}
                fill={active ? BLUSH : related ? ACCENT : INK}
                style={{
                  opacity: dimmed ? 0.35 : 1,
                  transition: "fill 0.3s ease, opacity 0.3s ease, r 0.3s ease",
                }}
              />
              <text
                x={node.anchor === "end" ? node.x - 14 : node.x + 14}
                y={node.y + 4}
                textAnchor={node.anchor === "end" ? "end" : "start"}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: node.big ? "13px" : "12px",
                  fill: active ? BLUSH : related ? ACCENT : MUTED,
                  opacity: dimmed ? 0.4 : 1,
                  transition: "fill 0.3s ease, opacity 0.3s ease",
                }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default SkillConstellation;
