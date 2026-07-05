import { useEffect, useState } from "react";

/**
 * A hand from the right offers a digital globe — and the globe really rotates:
 * a 3D lat/long point-sphere, projected each frame. Front points are bright,
 * the far side shows through faintly (wireframe feel). A tilted satellite
 * ring circles it; blush "data points" blink among the grid.
 */

const INK = "#191918";
const ACCENT = "#3538CD";
const BLUSH = "#D6336C";

const R = 58; // globe radius
const GX = 150; // globe center
const GY = 112;
const TILT = 0.32; // fixed axial tilt

// Point sphere: latitude rings every 20°, longitude every 18° (faint ocean grid)
type P3 = { x: number; y: number; z: number; data: boolean };
const spherePoints: P3[] = [];
let count = 0;
for (let lat = -80; lat <= 80; lat += 20) {
  const phi = (lat * Math.PI) / 180;
  for (let lon = 0; lon < 360; lon += 18) {
    const lam = (lon * Math.PI) / 180;
    spherePoints.push({
      x: R * Math.cos(phi) * Math.cos(lam),
      y: R * Math.sin(phi),
      z: R * Math.cos(phi) * Math.sin(lam),
      data: count++ % 17 === 0, // scattered blush "data points"
    });
  }
}

// ── Continents: coarse equirectangular land mask (36 lon × 18 lat, 10° cells).
//    Land cells become bright dots → the sphere reads as the actual world. ──
const LAND = [
  ".............###....................",
  "....########..##........###########.",
  "...##########....####..############.",
  "....#########....#####.###########..",
  ".....########....##############.##..",
  "......######.....#############..#...",
  ".......####......#######.######.#...",
  ".........##.....########..##..##....",
  "..........####....#####...######....",
  "..........#####....####....#####....",
  "...........####....###......####....",
  "...........###.....##.......#####...",
  "...........##.......#........###....",
  "...........##......................#",
  "...........#........................",
  "....................................",
  "..##########################........",
  "####################################",
];
const landPoints: { x: number; y: number; z: number }[] = [];
LAND.forEach((row, r) => {
  const lat = 85 - r * 10;
  const phi = (lat * Math.PI) / 180;
  row.split("").forEach((ch, c) => {
    if (ch !== "#") return;
    const lon = -180 + c * 10 + 5;
    const lam = (lon * Math.PI) / 180;
    landPoints.push({
      x: R * Math.cos(phi) * Math.cos(lam),
      y: R * Math.sin(phi),
      z: R * Math.cos(phi) * Math.sin(lam),
    });
  });
});

type HandBit = { lx: number; ly: number; ch: string | null; tone: string; delay: number };

const HandGlobe = () => {
  const [t, setT] = useState(0);
  const [handBits, setHandBits] = useState<HandBit[]>([]);

  // Sample the hand glyph once: sparse cells over the hand become tiny
  // digits (0/1) and squares — the hand looks part-digitized.
  useEffect(() => {
    const GRID = 26;
    const S = 8;
    const size = GRID * S;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    // mirror to match the displayed hand
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${size * 0.95}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.fillText("🫴", size / 2, size / 2 + size * 0.03);
    const data = ctx.getImageData(0, 0, size, size).data;

    const bits: HandBit[] = [];
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        let alpha = 0;
        for (let dy = 0; dy < S; dy += 2)
          for (let dx = 0; dx < S; dx += 2)
            alpha += data[((r * S + dy) * size + (c * S + dx)) * 4 + 3];
        if (alpha / 16 < 120) continue;
        const seed = ((r * 73856093) ^ (c * 19349663)) >>> 0;
        if (seed % 100 >= 20) continue; // sparse — clean
        const isDigit = seed % 3 !== 0;
        bits.push({
          lx: (c / GRID) * 100,
          ly: (r / GRID) * 100,
          ch: isDigit ? String(seed % 2) : null,
          tone: seed % 8 === 0 ? BLUSH : "#A9ADF4",
          delay: (seed % 40) / 10,
        });
      }
    }
    setHandBits(bits);
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      setT((prev) => prev + Math.min((now - last) / 1000, 0.05));
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const yaw = t * 0.5;
  const cosY = Math.cos(yaw), sinY = Math.sin(yaw);
  const cosT = Math.cos(TILT), sinT = Math.sin(TILT);

  // rotate around the globe's vertical axis, then apply fixed tilt
  const project = (p: { x: number; y: number; z: number }) => {
    const x1 = p.x * cosY + p.z * sinY;
    const z1 = -p.x * sinY + p.z * cosY;
    const y2 = p.y * cosT - z1 * sinT;
    const z2 = p.y * sinT + z1 * cosT;
    const front = (R - z2) / (2 * R); // 1 = nearest, 0 = farthest
    return { sx: GX + x1, sy: GY - y2, front };
  };

  const dots = spherePoints.map((p) => ({ ...project(p), data: p.data }));
  const land = landPoints.map(project);

  return (
    <div className="hand-globe relative select-none" aria-hidden>
      <svg viewBox="0 0 320 300" className="w-full max-w-[460px] mx-auto overflow-visible">
        {/* ── The digital globe ── */}
        <g className="globe-float">
          {/* halo */}
          <circle cx={GX} cy={GY} r={R + 18} fill={ACCENT} opacity="0.05" />
          {/* limb (outline) */}
          <circle cx={GX} cy={GY} r={R} fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.35" />

          {/* faint rotating grid (oceans) */}
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={d.sx}
              cy={d.sy}
              r={0.6 + d.front * 0.9}
              fill={ACCENT}
              opacity={0.04 + d.front * 0.3}
            />
          ))}
          {/* continents — the world itself, rotating */}
          {land.map((d, i) => (
            <circle
              key={`l${i}`}
              cx={d.sx}
              cy={d.sy}
              r={0.9 + d.front * 1.7}
              fill={ACCENT}
              opacity={Math.max(0.05, d.front * 1.05 - 0.18)}
            />
          ))}

          {/* tilted satellite ring */}
          <g className="sat-ring">
            <ellipse
              cx={GX}
              cy={GY}
              rx={R + 24}
              ry={16}
              fill="none"
              stroke={INK}
              strokeWidth="1"
              strokeDasharray="3 6"
              opacity="0.4"
              transform={`rotate(-14 ${GX} ${GY})`}
            />
            {/* satellite dot riding the ring */}
            <circle
              cx={GX + (R + 24) * Math.cos(t * 0.9)}
              cy={GY + 16 * Math.sin(t * 0.9)}
              r="2.4"
              fill={BLUSH}
              transform={`rotate(-14 ${GX} ${GY})`}
            />
          </g>

        </g>

        {/* levitation ring between palm and globe */}
        <ellipse
          className="lev-ring"
          cx="150"
          cy="212"
          rx="34"
          ry="7"
          fill="none"
          stroke={BLUSH}
          strokeWidth="1.2"
          opacity="0.6"
        />

      </svg>

      {/* ── The hand — real artwork first; pixels are just an effect ── */}
      <div className="hand-breathe pointer-events-none absolute inset-x-0 bottom-0 h-[52%]">
        {/* realistic hand, duotone-tinted, mirrored — with a digit overlay */}
        <div
          className="absolute left-1/2 bottom-0"
          style={{ width: 210, height: 210, transform: "translateX(-54%)" }}
        >
          <span
            className="hand-emoji block leading-none"
            style={{ transform: "scaleX(-1)" }}
          >
            🫴
          </span>
          {/* glitch layers — blush & blue slices that jump for a split second */}
          <span className="hand-emoji hand-glitch-a absolute inset-0 leading-none" aria-hidden>
            🫴
          </span>
          <span className="hand-emoji hand-glitch-b absolute inset-0 leading-none" aria-hidden>
            🫴
          </span>
          {/* sparse binary bits pinned to the hand's own pixels */}
          {handBits.map((bit, i) =>
            bit.ch ? (
              <span
                key={i}
                className="hand-bit absolute font-mono font-semibold"
                style={{
                  left: `${bit.lx}%`,
                  top: `${bit.ly}%`,
                  color: bit.tone,
                  fontSize: 9,
                  animationDelay: `${-bit.delay}s`,
                }}
              >
                {bit.ch}
              </span>
            ) : (
              <span
                key={i}
                className="hand-bit absolute"
                style={{
                  left: `${bit.lx}%`,
                  top: `${bit.ly}%`,
                  width: 6.5,
                  height: 6.5,
                  backgroundColor: bit.tone,
                  animationDelay: `${-bit.delay}s`,
                }}
              />
            )
          )}
        </div>

        {/* digitization: pixels dissolve off the hand; some become numbers */}
        {[
          { left: "42%", delay: 0, size: 6, tone: "#3538CD" },
          { left: "50%", delay: 1.6, size: 5, tone: "#D6336C", digit: "1" },
          { left: "56%", delay: 3.2, size: 7, tone: "#3538CD" },
          { left: "46%", delay: 4.8, size: 5, tone: "#3538CD", digit: "0" },
          { left: "60%", delay: 6.4, size: 4, tone: "#D6336C" },
        ].map((px, i) => (
          <span
            key={i}
            className="pixel-rise absolute top-[16%]"
            style={{
              left: px.left,
              width: px.size + 4,
              height: px.size + 4,
              animationDelay: `${px.delay}s`,
            }}
          >
            {px.digit ? (
              <>
                {/* square dissolves… */}
                <span
                  className="morph-square absolute inset-0 m-auto"
                  style={{ width: px.size, height: px.size, backgroundColor: px.tone }}
                />
                {/* …and a digit takes its place */}
                <span
                  className="morph-digit absolute inset-0 flex items-center justify-center font-mono font-semibold"
                  style={{ color: px.tone, fontSize: px.size + 5 }}
                >
                  {px.digit}
                </span>
              </>
            ) : (
              <span
                className="absolute inset-0 m-auto"
                style={{ width: px.size, height: px.size, backgroundColor: px.tone }}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HandGlobe;
