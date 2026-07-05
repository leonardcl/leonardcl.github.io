import { useEffect, useRef, useState } from "react";

/**
 * The skill constellation — in 3D.
 * Nodes live in 3D space and revolve slowly around the vertical axis.
 * Perspective projection gives real depth: near skills are large and dark,
 * far skills shrink and fade. The cursor tilts the whole system;
 * hovering a node slows the rotation and lights its connections.
 */

type Node3D = {
  id: string;
  label: string;
  x: number; // 3D coords, roughly within a ±170 sphere
  y: number;
  z: number;
  big?: boolean;
};

const nodes: Node3D[] = [
  { id: "ml", label: "Machine Learning", x: 0, y: -40, z: 60, big: true },
  { id: "rl", label: "Reinforcement Learning", x: -130, y: -120, z: -20 },
  { id: "cv", label: "Computer Vision", x: 130, y: -130, z: 30 },
  { id: "robotics", label: "Robotics", x: 165, y: 10, z: -60, big: true },
  { id: "llm", label: "LLM · RAG", x: 60, y: 60, z: 110 },
  { id: "python", label: "Python", x: -110, y: 20, z: 80, big: true },
  { id: "ts", label: "TypeScript", x: -160, y: 130, z: -40 },
  { id: "iot", label: "IoT · Embedded", x: 20, y: 165, z: -90 },
  { id: "ros", label: "ROS2", x: 150, y: 130, z: 60 },
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

const CX = 260; // screen center
const CY = 250;
const FOV = 620; // perspective strength — lower = more dramatic depth

const SkillConstellation = ({ offset }: { offset: { x: number; y: number } }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const hoveredRef = useRef<string | null>(null);
  hoveredRef.current = hovered;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let t = 0;
    const tick = (nowMs: number) => {
      const dt = (nowMs - last) / 1000;
      last = nowMs;
      // Slow to a near-stop while the visitor inspects a node
      t += dt * (hoveredRef.current ? 0.06 : 1);
      setTime(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Rotation: continuous yaw + cursor-driven tilt
  const yaw = time * 0.22 + offset.x * 0.45;
  const pitch = -0.12 + offset.y * 0.3;
  const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
  const cosP = Math.cos(pitch), sinP = Math.sin(pitch);

  // Project all nodes: rotate Y, rotate X, perspective divide
  const projected = Object.fromEntries(
    nodes.map((n, i) => {
      // gentle individual bob so the cloud feels alive even mid-rotation
      const bob = Math.sin(time * 0.8 + i * 1.9) * 6;
      const x1 = n.x * cosY + n.z * sinY;
      const z1 = -n.x * sinY + n.z * cosY;
      const y2 = (n.y + bob) * cosP - z1 * sinP;
      const z2 = (n.y + bob) * sinP + z1 * cosP;
      const f = FOV / (FOV + z2);
      return [
        n.id,
        {
          x: CX + x1 * f,
          y: CY + y2 * f,
          f, // scale factor: >1 near, <1 far
          z: z2,
        },
      ];
    })
  );

  const isLit = (a: string, b: string) => hovered === a || hovered === b;
  const isNeighbor = (id: string) =>
    hovered !== null &&
    edges.some(([a, b]) => (a === hovered && b === id) || (b === hovered && a === id));

  // Paint far-to-near so near nodes overlap far ones correctly
  const drawOrder = [...nodes].sort((a, b) => projected[b.id].z - projected[a.id].z);

  return (
    <div
      className="transition-transform duration-700 ease-out will-change-transform"
      style={{ transform: `translate(${offset.x * 10}px, ${offset.y * 10}px)` }}
    >
      <svg
        viewBox="0 0 520 500"
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Skill map"
      >
        {/* Edges */}
        {edges.map(([a, b], i) => {
          const pa = projected[a];
          const pb = projected[b];
          const lit = isLit(a, b);
          const depthFade = Math.min(pa.f, pb.f); // far edges fade
          return (
            <line
              key={`${a}-${b}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              pathLength={1}
              className="edge-draw"
              style={{
                animationDelay: `${900 + i * 100}ms`,
                stroke: lit ? ACCENT : LINE,
                strokeWidth: lit ? 1.5 : depthFade,
                opacity: hovered && !lit ? 0.25 : Math.min(1, depthFade * 1.1),
                transition: "stroke 0.3s ease, opacity 0.3s ease",
              }}
            />
          );
        })}

        {/* Nodes, far first */}
        {drawOrder.map((node) => {
          const p = projected[node.id];
          const i = nodes.indexOf(node);
          const active = hovered === node.id;
          const related = isNeighbor(node.id);
          const dimmed = hovered !== null && !active && !related;
          const r = (node.big ? 5.5 : 4) * p.f;
          const depthOpacity = 0.35 + (p.f - 0.7) * 1.6; // near ≈1, far ≈0.4
          return (
            <g
              key={node.id}
              className="node-pop cursor-default"
              style={{ animationDelay: `${1100 + i * 90}ms` }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle cx={p.x} cy={p.y} r={26} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={r + 5 * p.f}
                fill={active ? BLUSH : ACCENT}
                style={{
                  opacity: (active ? 0.25 : 0.1) * depthOpacity * 1.4,
                  transition: "fill 0.3s ease",
                }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={active ? r + 1.5 : r}
                fill={active ? BLUSH : related ? ACCENT : INK}
                style={{
                  opacity: dimmed ? 0.25 : Math.min(1, depthOpacity),
                  transition: "fill 0.3s ease",
                }}
              />
              <text
                x={p.x + (10 + r)}
                y={p.y + 4}
                textAnchor="start"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: `${(node.big ? 13 : 11.5) * p.f}px`,
                  fill: active ? BLUSH : related ? ACCENT : MUTED,
                  opacity: dimmed ? 0.3 : Math.min(1, depthOpacity),
                  transition: "fill 0.3s ease",
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
