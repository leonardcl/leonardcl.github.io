import { useEffect, useRef, useState } from "react";
import Nav from "./v2/Nav";
import FooterV2 from "./v2/FooterV2";

/**
 * Boids — complex behavior from three simple rules.
 * Cohesion (steer toward the flock), alignment (match its heading),
 * separation (don't crowd). Click to scatter; move the mouse to attract.
 */

const ACCENT = "#3538CD";
const BLUSH = "#D6336C";

type Boid = { x: number; y: number; vx: number; vy: number; blush: boolean };

export default function Boids() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Controls (kept in refs for the animation loop, state for the UI)
  const [cohesion, setCohesion] = useState(0.9);
  const [alignment, setAlignment] = useState(1.0);
  const [separation, setSeparation] = useState(1.2);
  const [count, setCount] = useState(120);
  const [speed, setSpeed] = useState(2.4);
  const [mouseAttract, setMouseAttract] = useState(true);
  const params = useRef({ cohesion, alignment, separation, speed, mouseAttract });
  params.current = { cohesion, alignment, separation, speed, mouseAttract };

  const boidsRef = useRef<Boid[]>([]);
  const mouseRef = useRef<{ x: number; y: number; in: boolean }>({ x: 0, y: 0, in: false });
  const countRef = useRef(count);
  countRef.current = count;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = wrap.clientWidth - 2;
      const h = Math.min(560, Math.max(380, window.innerHeight * 0.55));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.clientWidth;
    const H = () => canvas.clientHeight;

    const spawn = (n: number): Boid[] =>
      Array.from({ length: n }, (_, i) => ({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        blush: i % 11 === 0, // a few pink ones
      }));
    if (boidsRef.current.length === 0) boidsRef.current = spawn(countRef.current);

    const PERCEPTION = 60;
    const SEP_DIST = 24;

    const tick = () => {
      // adjust population live
      const boids = boidsRef.current;
      if (boids.length < countRef.current)
        boids.push(...spawn(countRef.current - boids.length));
      else if (boids.length > countRef.current) boids.length = countRef.current;

      const { cohesion, alignment, separation, speed, mouseAttract } = params.current;

      for (const b of boids) {
        let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0, n = 0;
        for (const o of boids) {
          if (o === b) continue;
          const dx = o.x - b.x, dy = o.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > PERCEPTION * PERCEPTION) continue;
          n++;
          cx += o.x; cy += o.y;
          ax += o.vx; ay += o.vy;
          if (d2 < SEP_DIST * SEP_DIST) {
            const d = Math.sqrt(d2) || 1;
            sx -= dx / d; sy -= dy / d;
          }
        }
        if (n > 0) {
          // cohesion: toward local center
          b.vx += ((cx / n - b.x) * 0.004) * cohesion;
          b.vy += ((cy / n - b.y) * 0.004) * cohesion;
          // alignment: match average velocity
          b.vx += ((ax / n - b.vx) * 0.04) * alignment;
          b.vy += ((ay / n - b.vy) * 0.04) * alignment;
          // separation
          b.vx += sx * 0.25 * separation;
          b.vy += sy * 0.25 * separation;
        }
        // mouse
        if (mouseAttract && mouseRef.current.in) {
          const dx = mouseRef.current.x - b.x, dy = mouseRef.current.y - b.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 220) { b.vx += (dx / d) * 0.06; b.vy += (dy / d) * 0.06; }
        }
        // clamp speed
        const v = Math.hypot(b.vx, b.vy) || 1e-6;
        const max = speed, min = speed * 0.4;
        if (v > max) { b.vx = (b.vx / v) * max; b.vy = (b.vy / v) * max; }
        if (v < min) { b.vx = (b.vx / v) * min; b.vy = (b.vy / v) * min; }
        // move + wrap
        b.x += b.vx; b.y += b.vy;
        if (b.x < -10) b.x = W() + 10; if (b.x > W() + 10) b.x = -10;
        if (b.y < -10) b.y = H() + 10; if (b.y > H() + 10) b.y = -10;
      }

      // draw
      ctx.fillStyle = "#FAF9F5";
      ctx.fillRect(0, 0, W(), H());
      for (const b of boids) {
        const ang = Math.atan2(b.vy, b.vx);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(ang);
        ctx.fillStyle = b.blush ? BLUSH : ACCENT;
        ctx.globalAlpha = b.blush ? 0.95 : 0.85;
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(-5, 3.6);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-5, -3.6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, in: true };
    };
    const onLeave = () => (mouseRef.current.in = false);
    const onClick = () => {
      // scatter!
      for (const b of boidsRef.current) {
        b.vx = (Math.random() - 0.5) * 14;
        b.vy = (Math.random() - 0.5) * 14;
      }
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onClick);
    };
  }, []);

  return (
    <div className="min-h-screen min-h-dvh bg-bone text-ink font-sans">
      <Nav />
      <main className="max-w-site mx-auto px-6 sm:px-10 pt-32 pb-24">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
              playground · emergent behavior
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl text-ink font-medium leading-tight rise-blur">
            Boids <em className="font-light text-blush">swarm</em>
          </h1>
          <p className="mt-4 max-w-2xl text-inkmuted leading-relaxed">
            A flock with no leader. Each boid follows three local rules — cohesion,
            alignment, separation — and flocking simply <em>emerges</em>. Move your
            mouse to lead them; click to scatter.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div ref={wrapRef} className="md:col-span-2 border border-line overflow-hidden bg-bone">
            <canvas ref={canvasRef} className="block cursor-crosshair" />
          </div>

          <div className="border border-line p-5 bg-bone h-fit">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inkmuted mb-4">
              the three rules
            </p>
            <div className="space-y-4">
              <Slider label={`cohesion = ${cohesion.toFixed(2)}`} min={0} max={3} step={0.05} value={cohesion} setValue={setCohesion} />
              <Slider label={`alignment = ${alignment.toFixed(2)}`} min={0} max={3} step={0.05} value={alignment} setValue={setAlignment} />
              <Slider label={`separation = ${separation.toFixed(2)}`} min={0} max={3} step={0.05} value={separation} setValue={setSeparation} />
              <div className="pt-2 border-t border-line" />
              <Slider label={`boids = ${count}`} min={10} max={400} step={10} value={count} setValue={setCount} />
              <Slider label={`speed = ${speed.toFixed(1)}`} min={0.5} max={6} step={0.1} value={speed} setValue={setSpeed} />
              <div className="flex items-center justify-between gap-2">
                <label className="font-mono text-xs text-inkmuted">follow mouse</label>
                <input type="checkbox" checked={mouseAttract} onChange={(e) => setMouseAttract(e.target.checked)} className="accent-[#3538CD]" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-line text-xs text-inkmuted space-y-1.5 leading-relaxed">
              <p>Try: separation to 0 → they collapse into a blob. Alignment to 0 → a confused crowd. All three balanced → a living flock.</p>
              <p className="text-blush/80">turn curiosity into systems ✳</p>
            </div>
          </div>
        </div>
      </main>
      <FooterV2 />
    </div>
  );
}

function Slider({ label, min, max, step, value, setValue }: { label: string; min: number; max: number; step: number; value: number; setValue: (v: number) => void }) {
  return (
    <div>
      <div className="font-mono text-xs text-inkmuted mb-1.5">{label}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-[#3538CD]"
        style={{
          background: `linear-gradient(to right, #3538CD 0%, #3538CD ${((value - min) / (max - min)) * 100}%, #E6E4DC ${((value - min) / (max - min)) * 100}%, #E6E4DC 100%)`,
        }}
      />
    </div>
  );
}
