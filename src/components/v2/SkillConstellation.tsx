import { useEffect, useRef, useState } from "react";

/**
 * The skill constellation — in 3D.
 * A point cloud of skills revolving with real perspective depth.
 * - Far nodes shrink and soften but NEVER disappear (clamped fade).
 * - All motion is eased: rotation speed, hover slow-down, drag inertia.
 * - Grab and throw it: drag spins the cloud, then it glides and
 *   settles back into its idle rotation. Cursor tilt still applies.
 */

type Node3D = {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  big?: boolean;
};

const SPREAD = 1.28; // overall size of the cloud
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
  { id: "pytorch", label: "PyTorch", x: -60, y: -160, z: 100 },
  { id: "pomdp", label: "POMDP", x: -190, y: -50, z: -110 },
  { id: "gazebo", label: "Gazebo", x: 230, y: -60, z: -130 },
  { id: "react", label: "React", x: -230, y: 90, z: 40 },
  { id: "cpp", label: "C · C++", x: 90, y: 230, z: 20 },
  { id: "docker", label: "Docker", x: -40, y: 90, z: -170 },
].map((n) => ({ ...n, x: n.x * SPREAD, y: n.y * SPREAD, z: n.z * SPREAD }));

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
  ["pytorch", "ml"],
  ["pytorch", "rl"],
  ["pomdp", "rl"],
  ["gazebo", "robotics"],
  ["gazebo", "ros"],
  ["react", "ts"],
  ["cpp", "iot"],
  ["cpp", "robotics"],
  ["docker", "python"],
  ["docker", "llm"],
];

const INK = "#191918";
const MUTED = "#6B6A64";
const LINE = "#D9D7CD";
const ACCENT = "#3538CD";
const BLUSH = "#D6336C";

const CX = 260;
const CY = 250;
const FOV = 780; // higher = gentler perspective; far nodes stay readable

// Depth fade floors — far things get quiet, never gone
const MIN_OPACITY = 0.38;
const MIN_EDGE_OPACITY = 0.25;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const SkillConstellation = ({ offset }: { offset: { x: number; y: number } }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [, setFrame] = useState(0);
  // Entrance cascade plays once; afterwards animation classes are removed.
  // (Depth sorting reorders the DOM, which would restart CSS animations —
  //  that was the "node vanishes then pops back" bug.)
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), 3300); // after the last edge finishes drawing
    return () => clearTimeout(timer);
  }, []);

  // Animation state lives in refs — updated every frame, eased, never jumps
  const anim = useRef({
    t: 0, // idle rotation angle
    speed: 1, // eased toward target (1 idle, ~0 when inspecting)
    dragYaw: 0, // extra rotation from dragging
    dragPitch: 0,
    velYaw: 0, // inertia after release
    velPitch: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
  });
  const hoveredRef = useRef<string | null>(null);
  hoveredRef.current = hovered;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (nowMs: number) => {
      const dt = clamp((nowMs - last) / 1000, 0, 0.05);
      last = nowMs;
      const a = anim.current;

      // Ease rotation speed toward its target — no sudden stops
      const targetSpeed = hoveredRef.current || a.dragging ? 0.05 : 1;
      a.speed += (targetSpeed - a.speed) * Math.min(1, dt * 4);
      a.t += dt * a.speed;

      // Drag inertia: glide, then decay smoothly
      if (!a.dragging) {
        a.dragYaw += a.velYaw * dt;
        a.dragPitch += a.velPitch * dt;
        a.velYaw *= Math.exp(-dt * 2.2);
        a.velPitch *= Math.exp(-dt * 2.2);
        // pitch relaxes back to level so it never stays flipped
        a.dragPitch += (0 - a.dragPitch) * Math.min(1, dt * 0.8);
      }

      setFrame((f) => f + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Drag to spin ──
  const onPointerDown = (e: React.PointerEvent) => {
    const a = anim.current;
    a.dragging = true;
    a.lastX = e.clientX;
    a.lastY = e.clientY;
    a.velYaw = 0;
    a.velPitch = 0;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const a = anim.current;
    if (!a.dragging) return;
    const dx = e.clientX - a.lastX;
    const dy = e.clientY - a.lastY;
    a.lastX = e.clientX;
    a.lastY = e.clientY;
    a.dragYaw += dx * 0.006;
    a.dragPitch = clamp(a.dragPitch + dy * 0.004, -0.6, 0.6);
    a.velYaw = dx * 0.35; // remembered for the throw
    a.velPitch = dy * 0.2;
  };
  const onPointerUp = () => {
    anim.current.dragging = false;
  };

  const a = anim.current;
  const yaw = a.t * 0.22 + a.dragYaw + offset.x * 0.35;
  const pitch = clamp(-0.1 + a.dragPitch + offset.y * 0.22, -0.9, 0.9);
  const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
  const cosP = Math.cos(pitch), sinP = Math.sin(pitch);

  const projected = Object.fromEntries(
    nodes.map((n, i) => {
      const bob = Math.sin(a.t * 0.8 + i * 1.9) * 5;
      const x1 = n.x * cosY + n.z * sinY;
      const z1 = -n.x * sinY + n.z * cosY;
      const y2 = (n.y + bob) * cosP - z1 * sinP;
      const z2 = (n.y + bob) * sinP + z1 * cosP;
      const f = FOV / (FOV + z2);
      return [n.id, { x: CX + x1 * f, y: CY + y2 * f, f, z: z2 }];
    })
  );

  const isLit = (x: string, y: string) => hovered === x || hovered === y;
  const isNeighbor = (id: string) =>
    hovered !== null &&
    edges.some(([p, q]) => (p === hovered && q === id) || (q === hovered && p === id));

  // Keep DOM order stable during the intro so animations never restart;
  // sort by depth afterwards so near nodes paint over far ones.
  const drawOrder = intro
    ? nodes
    : [...nodes].sort((p, q) => projected[q.id].z - projected[p.id].z);

  return (
    <div
      className="transition-transform duration-700 ease-out will-change-transform"
      style={{
        transform: `translate(${offset.x * 8}px, ${offset.y * 8}px)`,
        cursor: a.dragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <svg
        viewBox="0 0 520 500"
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label="Skill map — drag to spin"
      >
        {/* Edges */}
        {edges.map(([p, q], i) => {
          const pa = projected[p];
          const pb = projected[q];
          const lit = isLit(p, q);
          const depth = Math.min(pa.f, pb.f);
          return (
            <line
              key={`${p}-${q}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              pathLength={1}
              className={intro ? "edge-draw" : ""}
              style={{
                animationDelay: intro ? `${900 + i * 100}ms` : undefined,
                stroke: lit ? ACCENT : LINE,
                strokeWidth: lit ? 1.5 : clamp(depth, 0.7, 1.1),
                opacity: lit
                  ? 1
                  : clamp((depth - 0.75) * 2.2 + 0.5, MIN_EDGE_OPACITY, 0.9) *
                    (hovered ? 0.45 : 1),
                transition: "stroke 0.35s ease",
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
          // Depth fade with a floor — far nodes soften, never vanish
          const depthOpacity = clamp((p.f - 0.78) * 2.4 + 0.55, MIN_OPACITY, 1);
          const nodeOpacity = dimmed ? MIN_OPACITY * 0.8 : depthOpacity;
          return (
            <g
              key={node.id}
              className={intro ? "node-pop" : ""}
              style={{ animationDelay: intro ? `${1100 + i * 90}ms` : undefined }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle cx={p.x} cy={p.y} r={28} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={r + 5 * p.f}
                fill={active ? BLUSH : ACCENT}
                style={{
                  opacity: (active ? 0.28 : 0.1) * depthOpacity * 1.5,
                  transition: "fill 0.35s ease",
                }}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={active ? r + 1.5 : r}
                fill={active ? BLUSH : related ? ACCENT : INK}
                style={{ opacity: nodeOpacity, transition: "fill 0.35s ease" }}
              />
              <text
                x={p.x + (10 + r)}
                y={p.y + 4}
                textAnchor="start"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: `${(node.big ? 13 : 11.5) * clamp(p.f, 0.82, 1.12)}px`,
                  fill: active ? BLUSH : related ? ACCENT : MUTED,
                  opacity: nodeOpacity,
                  transition: "fill 0.35s ease",
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
