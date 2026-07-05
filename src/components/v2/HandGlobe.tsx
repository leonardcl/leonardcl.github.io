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

// Point sphere: latitude rings every 20°, longitude every 18°
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

const HandGlobe = () => {
  const [t, setT] = useState(0);

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

  const dots = spherePoints.map((p) => {
    // rotate around the globe's vertical axis, then apply fixed tilt
    const x1 = p.x * cosY + p.z * sinY;
    const z1 = -p.x * sinY + p.z * cosY;
    const y2 = p.y * cosT - z1 * sinT;
    const z2 = p.y * sinT + z1 * cosT;
    const front = (R - z2) / (2 * R); // 1 = nearest, 0 = farthest
    return {
      sx: GX + x1,
      sy: GY - y2,
      front,
      data: p.data,
    };
  });

  return (
    <div className="hand-globe relative select-none" aria-hidden>
      <svg viewBox="0 0 320 400" className="w-full max-w-[320px] mx-auto overflow-visible">
        {/* ── The digital globe ── */}
        <g className="globe-float">
          {/* halo */}
          <circle cx={GX} cy={GY} r={R + 14} fill={ACCENT} opacity="0.06" />
          <circle cx={GX} cy={GY} r={R + 30} fill={ACCENT} opacity="0.03" />
          {/* limb (outline) */}
          <circle cx={GX} cy={GY} r={R} fill="none" stroke={ACCENT} strokeWidth="1" opacity="0.35" />

          {/* rotating point-sphere */}
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={d.sx}
              cy={d.sy}
              r={d.data ? 1.1 + d.front * 1.6 : 0.7 + d.front * 1.3}
              fill={d.data ? BLUSH : ACCENT}
              opacity={0.1 + d.front * (d.data ? 0.95 : 0.75)}
            />
          ))}

          {/* polar axis ticks */}
          <g stroke={ACCENT} strokeWidth="1.2" strokeLinecap="round" opacity="0.7">
            <path d={`M ${GX + R * Math.sin(TILT) * 0} ${GY - R * cosT - 10} v 7`} transform={`rotate(${(TILT * 180) / Math.PI} ${GX} ${GY})`} />
            <path d={`M ${GX} ${GY + R * cosT + 3} v 7`} transform={`rotate(${(TILT * 180) / Math.PI} ${GX} ${GY})`} />
          </g>

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

          {/* twinkling sparks */}
          <g stroke={BLUSH} strokeWidth="1.6" strokeLinecap="round">
            <g className="twinkle" style={{ animationDelay: "0s" }}>
              <path d="M 244 40 v 12 M 238 46 h 12" />
            </g>
            <g className="twinkle" style={{ animationDelay: "-1.3s" }}>
              <path d="M 70 58 v 9 M 65.5 62.5 h 9" />
            </g>
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

        {/* ── The hand — entering from the right, palm open under the globe ── */}
        <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {/* top edge of forearm → back of hand → thumb → web → fingers (left) → underside → forearm bottom */}
          <path
            d="M 320 238
               C 292 233 266 231 246 236
               C 238 226 231 213 227 202
               C 224 194 215 196 216 205
               C 217 216 212 228 204 234
               C 180 238 148 240 119 250
               C 109 254 109 264 119 267
               C 150 272 182 272 208 271
               C 238 270 265 274 288 280
               C 300 283 312 285 320 286"
          />
          {/* finger separations */}
          <path d="M 128 252 C 132 258 137 263 143 267" strokeWidth="1.4" opacity="0.75" />
          <path d="M 150 248 C 154 255 159 261 165 266" strokeWidth="1.4" opacity="0.75" />
          <path d="M 173 244 C 177 252 181 259 186 265" strokeWidth="1.4" opacity="0.75" />
          {/* thumb crease */}
          <path d="M 204 234 C 208 244 212 254 214 264" strokeWidth="1.4" opacity="0.75" />
          {/* palm crease */}
          <path d="M 232 240 C 236 250 239 258 241 266" strokeWidth="1.2" opacity="0.5" />
        </g>

        {/* engraving hatching — forearm */}
        <g stroke={INK} strokeWidth="1" opacity="0.35" strokeLinecap="round">
          <path d="M 292 244 l 3 32" />
          <path d="M 302 245 l 3 33" />
          <path d="M 312 246 l 2 34" />
          <path d="M 262 240 l 4 30" />
          <path d="M 274 242 l 4 31" />
        </g>
      </svg>
    </div>
  );
};

export default HandGlobe;
