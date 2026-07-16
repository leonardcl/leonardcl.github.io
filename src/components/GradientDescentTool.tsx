import { useEffect, useMemo, useRef, useState } from "react";
import Nav from "./v2/Nav";
import FooterV2 from "./v2/FooterV2";

export default function GradientDescentTool() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Canvas & sizing — responsive: fits the wrapper's width (capped at 600),
  // so the square canvas doesn't get squished/clipped on narrow screens.
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heatRef = useRef<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState(600);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const available = wrap.clientWidth - 24 /* p-3 padding */ - 2 /* canvas border */;
      setSize(Math.max(260, Math.min(600, available)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Controls
  const [funcKey, setFuncKey] = useState<"quadratic" | "saddle" | "rosenbrock">("quadratic");
  const [direction, setDirection] = useState<"descent" | "ascent">("descent");
  const [lr, setLr] = useState(0.03);
  const [momentum, setMomentum] = useState(0.8);
  const [nesterov, setNesterov] = useState(true);
  const [noise, setNoise] = useState(0);
  const [maxIter, setMaxIter] = useState(500);
  const [playSpeed, setPlaySpeed] = useState(30);
  const [domain, setDomain] = useState(2.5);
  const [showGrad, setShowGrad] = useState(true);

  // Simulation state
  const simRef = useRef({ x: 1.2, y: 1.2, vx: 0, vy: 0, iter: 0, path: [{ x: 1.2, y: 1.2 }] as Array<{x:number;y:number}> });

  // React state for UI/metrics
  const [point, setPoint] = useState<{ x: number; y: number }>({ x: 1.2, y: 1.2 });
  const [path, setPath] = useState<Array<{ x: number; y: number }>>([{ x: 1.2, y: 1.2 }]);
  const [iter, setIter] = useState(0);
  const [status, setStatus] = useState<string>("ready");
  const accTimeRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const hoverRef = useRef<{ x: number; y: number; has: boolean }>({ x: 0, y: 0, has: false });
  const dragRef = useRef<{ down: boolean; startX: number; startY: number; shift: boolean }>({ down: false, startX: 0, startY: 0, shift: false });

  // Function specs
  type Spec = {
    name: string;
    f: (x: number, y: number) => number;
    grad: (x: number, y: number) => { gx: number; gy: number };
    hint?: string;
    recommendedDomain?: number;
    recommendedLr?: number;
  };

  const specs: Record<string, Spec> = useMemo(
    () => ({
      quadratic: {
        name: "Quadratic: f=x²+y²",
        f: (x, y) => x * x + y * y,
        grad: (x, y) => ({ gx: 2 * x, gy: 2 * y }),
        hint: "Convex bowl – great for basics.",
        recommendedDomain: 2.5,
        recommendedLr: 0.08,
      },
      saddle: {
        name: "Saddle: f=x²−y²",
        f: (x, y) => x * x - y * y,
        grad: (x, y) => ({ gx: 2 * x, gy: -2 * y }),
        hint: "Saddle shows escaping/oscillation.",
        recommendedDomain: 2.5,
        recommendedLr: 0.05,
      },
      rosenbrock: {
        name: "Rosenbrock: f=(1−x)²+100(y−x²)²",
        f: (x, y) => (1 - x) * (1 - x) + 100 * (y - x * x) * (y - x * x),
        grad: (x, y) => {
          const gx = -2 * (1 - x) - 400 * x * (y - x * x);
          const gy = 200 * (y - x * x);
          return { gx, gy };
        },
        hint: "Banana valley – needs smaller LR.",
        recommendedDomain: 2.0,
        recommendedLr: 0.005,
      },
    }),
    []
  );

  const spec = specs[funcKey];

  // Derived metrics
  const fVal = spec.f(point.x, point.y);
  const grad = spec.grad(point.x, point.y);
  const gradNorm = Math.hypot(grad.gx, grad.gy);

  // Helpers
  const worldToCanvas = (x: number, y: number) => {
    const R = domain;
    const px = ((x + R) / (2 * R)) * size;
    const py = ((R - y) / (2 * R)) * size;
    return { px, py };
  };
  const canvasToWorld = (px: number, py: number) => {
    const R = domain;
    const x = (px / size) * 2 * R - R;
    const y = R - (py / size) * 2 * R;
    return { x, y };
  };

  // Heatmap generation (offscreen) on function/domain change
  useEffect(() => {
    if (!heatRef.current) heatRef.current = document.createElement("canvas");
    const heat = heatRef.current!;
    const GRID = 240; // heatmap resolution (grid x grid)
    heat.width = GRID;
    heat.height = GRID;
    const hctx = heat.getContext("2d")!;
    const img = hctx.createImageData(GRID, GRID);

    // Sample values
    const R = domain;
    const values = new Float64Array(GRID * GRID);
    let k = 0;
    for (let j = 0; j < GRID; j++) {
      const y = R - (j / (GRID - 1)) * 2 * R;
      for (let i = 0; i < GRID; i++) {
        const x = -R + (i / (GRID - 1)) * 2 * R;
        values[k++] = spec.f(x, y);
      }
    }
    // Robust range via percentiles
    const sorted = Array.from(values).sort((a, b) => a - b);
    const q = (p: number) => sorted[Math.max(0, Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1))))];
    const lo = q(0.02);
    const hi = q(0.98);
    const mid = (lo + hi) / 2;
    const scale = Math.max(1e-9, (hi - lo) / 2);

    const colormap = (t: number) => {
      // site palette: bone → pale periwinkle → ultramarine → deep ink
      const stops = [
        [250, 249, 245],
        [225, 227, 250],
        [163, 167, 244],
        [53, 56, 205],
        [30, 30, 64],
      ];
      const tt = Math.max(0, Math.min(1, t));
      const p = tt * (stops.length - 1);
      const i = Math.floor(p);
      const f = p - i;
      const a = stops[i];
      const b = stops[Math.min(stops.length - 1, i + 1)];
      return [
        Math.round(a[0] + (b[0] - a[0]) * f),
        Math.round(a[1] + (b[1] - a[1]) * f),
        Math.round(a[2] + (b[2] - a[2]) * f),
      ];
    };

    // Fill heatmap
    k = 0;
    for (let j = 0; j < GRID; j++) {
      for (let i = 0; i < GRID; i++) {
        const v = values[k++];
        // map via tanh around mid to compress extremes (handles saddle signs nicely)
        const t = 0.5 + 0.5 * Math.tanh((v - mid) / (scale || 1));
        const [r, g, b] = colormap(t);
        const idx = (j * GRID + i) * 4;
        img.data[idx + 0] = r;
        img.data[idx + 1] = g;
        img.data[idx + 2] = b;
        img.data[idx + 3] = 255;
      }
    }
    hctx.putImageData(img, 0, 0);
    draw();
  }, [funcKey, domain]);

  // Draw function
  const draw = () => {
    const cnv = canvasRef.current;
    if (!cnv) return;
    const ctx = cnv.getContext("2d")!;

    const dpr = window.devicePixelRatio || 1;
    cnv.width = Math.floor(size * dpr);
    cnv.height = Math.floor(size * dpr);
    cnv.style.width = `${size}px`;
    cnv.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background heatmap
    if (heatRef.current) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(heatRef.current, 0, 0, size, size);
    } else {
      ctx.fillStyle = "#FAF9F5";
      ctx.fillRect(0, 0, size, size);
    }

    // Grid + axes
    const R = domain;
    ctx.save();
    ctx.strokeStyle = "rgba(25,25,24,0.08)";
    ctx.lineWidth = 1;
    const ticks = 8;
    for (let i = 1; i < ticks; i++) {
      const x = (i / ticks) * size;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
      const y = (i / ticks) * size;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
    // axes at x=0, y=0
    ctx.strokeStyle = "rgba(25,25,24,0.35)";
    ctx.lineWidth = 1.25;
    const { px: x0 } = worldToCanvas(0, 0);
    const { py: y0 } = worldToCanvas(0, 0);
    ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0, size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(size, y0); ctx.stroke();
    ctx.restore();

    // Path
    const P = simRef.current.path;
    if (P.length > 0) {
      ctx.save();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#D6336C";
      ctx.beginPath();
      const p0 = worldToCanvas(P[0].x, P[0].y);
      ctx.moveTo(p0.px, p0.py);
      for (let i = 1; i < P.length; i++) {
        const p = worldToCanvas(P[i].x, P[i].y);
        ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Current point
    const cx = simRef.current.x; const cy = simRef.current.y;
    const { px, py } = worldToCanvas(cx, cy);
    ctx.fillStyle = "#D6336C";
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();

    // Gradient arrow reflecting chosen direction
    if (showGrad) {
      const g = spec.grad(cx, cy);
      const dir = direction === "descent" ? -1 : 1;
      const dxw = dir * g.gx; const dyw = dir * g.gy;
      const gn = Math.hypot(dxw, dyw) || 1e-9;
      const scale = (size / (2 * R)) * 0.4;
      const vx = (dxw / gn) * scale; const vy = (-dyw / gn) * scale;
      ctx.save(); ctx.strokeStyle = "#1f2937"; ctx.fillStyle = "#1f2937"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + vx, py + vy); ctx.stroke();
      const ang = Math.atan2(vy, vx), ah = 7;
      ctx.beginPath(); ctx.moveTo(px + vx, py + vy);
      ctx.lineTo(px + vx - ah * Math.cos(ang - 0.35), py + vy - ah * Math.sin(ang - 0.35));
      ctx.lineTo(px + vx - ah * Math.cos(ang + 0.35), py + vy - ah * Math.sin(ang - 0.35));
      ctx.closePath(); ctx.fill(); ctx.restore();
    }

    // velocity arrow (blue) if an initial velocity is set
    {
      const vxw = simRef.current.vx, vyw = simRef.current.vy;
      const mag = Math.hypot(vxw, vyw);
      if (mag > 1e-8) {
        const L = (size / (2 * R)) * 0.45;
        const ax = (vxw / mag) * L; const ay = (-vyw / mag) * L;
        ctx.save(); ctx.strokeStyle = "#8A8FF2"; ctx.fillStyle = "#8A8FF2"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + ax, py + ay); ctx.stroke();
        const ang = Math.atan2(ay, ax), ah = 7;
        ctx.beginPath(); ctx.moveTo(px + ax, py + ay);
        ctx.lineTo(px + ax - ah * Math.cos(ang - 0.35), py + ay - ah * Math.sin(ang - 0.35));
        ctx.lineTo(px + ax - ah * Math.cos(ang + 0.35), py + ay - ah * Math.sin(ang - 0.35));
        ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }

    // next-step arrow (green): shows the direction the update will actually take with η, β, Nesterov & ascent/descent
    {
      const beta = momentum; const step = direction === "descent" ? -lr : lr;
      const x = simRef.current.x, y = simRef.current.y; const vx0 = simRef.current.vx, vy0 = simRef.current.vy;
      let gx = 0, gy = 0;
      if (nesterov) { const g = spec.grad(x + beta * vx0, y + beta * vy0); gx = g.gx; gy = g.gy; }
      else { const g = spec.grad(x, y); gx = g.gx; gy = g.gy; }
      const vpx = beta * vx0 + step * gx; const vpy = beta * vy0 + step * gy;
      const mag = Math.hypot(vpx, vpy);
      if (mag > 1e-10) {
        const L = (size / (2 * R)) * 0.5;
        const ax = (vpx / mag) * L; const ay = (-vpy / mag) * L;
        ctx.save(); ctx.strokeStyle = "#3538CD"; ctx.fillStyle = "#3538CD"; ctx.lineWidth = 2.25;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + ax, py + ay); ctx.stroke();
        const ang = Math.atan2(ay, ax), ah = 7;
        ctx.beginPath(); ctx.moveTo(px + ax, py + ay);
        ctx.lineTo(px + ax - ah * Math.cos(ang - 0.35), py + ay - ah * Math.sin(ang - 0.35));
        ctx.lineTo(px + ax - ah * Math.cos(ang + 0.35), py + ay - ah * Math.sin(ang - 0.35));
        ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }

    // hover crosshair & drag vector (for Shift+drag)
    if (hoverRef.current.has) {
      const h = hoverRef.current; const hc = worldToCanvas(h.x, h.y);
      ctx.save(); ctx.strokeStyle = "rgba(15,23,42,0.35)"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(hc.px, 0); ctx.lineTo(hc.px, size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, hc.py); ctx.lineTo(size, hc.py); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(15,23,42,0.9)"; ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto";
      const label = `(${h.x.toFixed(3)}, ${h.y.toFixed(3)})`;
      ctx.fillText(label, Math.min(size - 120, hc.px + 8), Math.max(12, hc.py - 8));
      ctx.restore();
    }
    if (dragRef.current.down && dragRef.current.shift) {
      const s = { x: dragRef.current.startX, y: dragRef.current.startY };
      const h = hoverRef.current.has ? { x: hoverRef.current.x, y: hoverRef.current.y } : s;
      const sc = worldToCanvas(s.x, s.y); const hc = worldToCanvas(h.x, h.y);
      ctx.save(); ctx.strokeStyle = "#3538CD"; ctx.fillStyle = "#3538CD"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sc.px, sc.py); ctx.lineTo(hc.px, hc.py); ctx.stroke();
      const ang = Math.atan2(hc.py - sc.py, hc.px - sc.px), ah = 7;
      ctx.beginPath(); ctx.moveTo(hc.px, hc.py);
      ctx.lineTo(hc.px - ah * Math.cos(ang - 0.35), hc.py - ah * Math.sin(ang - 0.35));
      ctx.lineTo(hc.px - ah * Math.cos(ang + 0.35), hc.py - ah * Math.sin(ang - 0.35));
      ctx.closePath(); ctx.fill(); ctx.restore();
    }
  };

  useEffect(() => {
    draw();
  }, [size, path, point, showGrad, direction, domain]);

  // Interaction: precise pointer controls (hover crosshair; click to set; Shift+drag to set initial velocity)
  useEffect(() => {
    const cnv = canvasRef.current; if (!cnv) return;

    const toWorldFromEvent = (ev: PointerEvent) => {
      const rect = cnv.getBoundingClientRect();
      const x = ev.clientX - rect.left; const y = ev.clientY - rect.top;
      return canvasToWorld(x, y);
    };

    const onPointerMove = (ev: PointerEvent) => {
      const w = toWorldFromEvent(ev);
      hoverRef.current = { x: w.x, y: w.y, has: true };
      draw();
    };
    const onPointerLeave = () => { hoverRef.current.has = false; draw(); };

    const onPointerDown = (ev: PointerEvent) => {
      cnv.setPointerCapture(ev.pointerId);
      const w = toWorldFromEvent(ev);
      dragRef.current = { down: true, startX: w.x, startY: w.y, shift: ev.shiftKey };
      hoverRef.current = { x: w.x, y: w.y, has: true };
      draw();
    };
    const onPointerUp = (ev: PointerEvent) => {
      try { cnv.releasePointerCapture(ev.pointerId); } catch {}
      const w = toWorldFromEvent(ev);
      const { down, startX, startY, shift } = dragRef.current;
      dragRef.current.down = false;
      if (!down) return;

      if (shift) {
        const vx = (w.x - startX);
        const vy = (w.y - startY);
        simRef.current = { x: startX, y: startY, vx, vy, iter: 0, path: [{ x: startX, y: startY }] };
        setPoint({ x: startX, y: startY });
        setPath([{ x: startX, y: startY }]);
        setIter(0);
        setStatus("ready");
      } else {
        simRef.current = { x: w.x, y: w.y, vx: 0, vy: 0, iter: 0, path: [w] };
        setPoint(w);
        setPath([w]);
        setIter(0);
        setStatus("ready");
      }
      lastTsRef.current = null; accTimeRef.current = 0; draw();
    };

    cnv.addEventListener('pointermove', onPointerMove);
    cnv.addEventListener('pointerleave', onPointerLeave);
    cnv.addEventListener('pointerdown', onPointerDown);
    cnv.addEventListener('pointerup', onPointerUp);

    return () => {
      cnv.removeEventListener('pointermove', onPointerMove);
      cnv.removeEventListener('pointerleave', onPointerLeave);
      cnv.removeEventListener('pointerdown', onPointerDown);
      cnv.removeEventListener('pointerup', onPointerUp);
    };
  }, [domain, size]);

  // One optimization step (reads/writes simRef to avoid stale closures)
  const stepOnce = () => {
    const sim = simRef.current;
    if (sim.iter >= maxIter) {
      setStatus("done: reached max iters");
      return false;
    }
    const beta = momentum;
    let { x, y, vx, vy } = sim;

    const step = direction === "descent" ? -lr : lr; // -η∇f (descent) or +η∇f (ascent)
    if (nesterov) {
      const xLook = x + beta * vx;
      const yLook = y + beta * vy;
      const g = spec.grad(xLook, yLook);
      vx = beta * vx + step * g.gx;
      vy = beta * vy + step * g.gy;
      x = x + vx;
      y = y + vy;
    } else {
      const g = spec.grad(x, y);
      vx = beta * vx + step * g.gx;
      vy = beta * vy + step * g.gy;
      x = x + vx;
      y = y + vy;
    }

    if (noise > 0) {
      const n = gaussian2D();
      x += noise * n.dx;
      y += noise * n.dy;
    }

    // Stop criteria
    const g2 = spec.grad(x, y);
    const gnorm = Math.hypot(g2.gx, g2.gy);
    const R = domain * 1.25; // out-of-bounds margin
    if (Math.abs(x) > R || Math.abs(y) > R || !isFinite(x) || !isFinite(y)) {
      setStatus("stopped: diverged / out of bounds");
      return false;
    }
    if (gnorm < 1e-5) {
      // commit final state
      simRef.current = { ...sim, x, y, vx, vy, iter: sim.iter + 1, path: [...sim.path, { x, y }] };
      setPoint({ x, y });
      setPath((p) => [...p, { x, y }]);
      setIter((t) => t + 1);
      setStatus("done: ∥∇f∥ below threshold");
      return false;
    }

    // commit normal state
    const newPath = sim.path.length > 2000 ? [...sim.path.slice(1), { x, y }] : [...sim.path, { x, y }];
    simRef.current = { x, y, vx, vy, iter: sim.iter + 1, path: newPath };

    // sync UI
    setPoint({ x, y });
    setPath(newPath);
    setIter(sim.iter + 1);
    setStatus("running");
    return true;
  };

  const [playing, setPlaying] = useState(false);
  
  useEffect(() => {
    if (!playing) return;
    
    const interval = setInterval(() => {
      if (!stepOnce()) {
        setPlaying(false);
      }
      draw();
    }, 1000 / playSpeed);
    
    return () => clearInterval(interval);
  }, [playing, playSpeed, lr, momentum, nesterov, noise, maxIter, funcKey, domain, direction]);

  // Utilities
  function gaussian2D() {
    // Box-Muller
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const r = Math.sqrt(-2.0 * Math.log(u));
    const t = 2.0 * Math.PI * v;
    return { dx: r * Math.cos(t), dy: r * Math.sin(t) };
  }

  function resetToDefaults(kind: "soft" | "hard" = "soft") {
    if (kind === "soft") {
      // Reset simulation only: keep controls as-is, stop playback, keep current point
      setPlaying(false);
      const p = { x: simRef.current.x, y: simRef.current.y };
      simRef.current = { x: p.x, y: p.y, vx: 0, vy: 0, iter: 0, path: [p] };
      setPoint(p);
      setPath([p]);
      setIter(0);
      setStatus("ready");
      lastTsRef.current = null;
      accTimeRef.current = 0;
      draw();
      return;
    }
    // Hard reset: also reset controls to recommended values for this function
    const R = specs[funcKey].recommendedDomain ?? 2.5;
    const LR = specs[funcKey].recommendedLr ?? 0.03;
    setDomain(R);
    setLr(LR);
    setMomentum(0.8);
    setNesterov(true);
    setNoise(0);
    setMaxIter(500);
    setPlaySpeed(30);
    setDirection("descent");
    const p = funcKey === "rosenbrock" ? { x: -1.2, y: 1.0 } : { x: 1.2, y: 1.2 };
    simRef.current = { x: p.x, y: p.y, vx: 0, vy: 0, iter: 0, path: [p] };
    setPoint(p);
    setPath([p]);
    setIter(0);
    setStatus("ready");
    lastTsRef.current = null;
    accTimeRef.current = 0;
    draw();
  }

  // When function changes, reset to sensible defaults
  useEffect(() => {
    resetToDefaults("hard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funcKey]);

  const btn =
    "font-mono text-xs px-3 py-2 border border-line text-ink hover:border-accent hover:text-accent transition-colors bg-bone";
  const sel =
    "font-mono text-xs px-3 py-2 border border-line bg-bone text-ink hover:border-accent transition-colors cursor-pointer";

  return (
    <div className="min-h-screen bg-bone text-ink font-sans">
      <Nav />
      <main className="max-w-site mx-auto px-6 sm:px-10 pt-32 pb-24">
        {/* Header — matches the site's section language */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
              playground · interactive optimization
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl text-ink font-medium leading-tight rise-blur">
            Gradient <em className="font-light text-blush">Descent</em>
          </h1>
          <p className="mt-4 max-w-2xl text-inkmuted leading-relaxed">
            Watch an optimizer find its way downhill. Function:{" "}
            <span className="font-mono text-sm text-accent">{spec.name}</span>
            {spec.hint && <span> — {spec.hint}</span>}
          </p>
        </div>

        {/* Toolbar */}
        <header className="flex flex-wrap items-center gap-2 mb-6">
          <select className={sel} value={funcKey} onChange={(e) => setFuncKey(e.target.value as any)}>
            <option value="quadratic">Quadratic</option>
            <option value="saddle">Saddle</option>
            <option value="rosenbrock">Rosenbrock</option>
          </select>
          <select className={sel} value={direction} onChange={(e) => setDirection(e.target.value as any)}>
            <option value="descent">Descent (−∇f)</option>
            <option value="ascent">Ascent (+∇f)</option>
          </select>
          <span className="flex-1" />
          <button className={btn} onClick={() => resetToDefaults("soft")}>reset</button>
          <button
            className="font-mono text-xs px-4 py-2 border border-ink bg-ink text-bone hover:bg-accent hover:border-accent transition-colors"
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? "pause" : "play ▸"}
          </button>
          <button className={btn} onClick={() => { stepOnce(); draw(); }}>step</button>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Canvas */}
          <div ref={wrapRef} className="md:col-span-2 border border-line p-3 overflow-hidden bg-bone">
            <canvas ref={canvasRef} className="block border border-line max-w-full" />
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs text-inkmuted">
              <div>f(x,y) <b className="text-accent">{fVal.toFixed(6)}</b></div>
              <div>‖∇f‖ <b className="text-accent">{gradNorm.toExponential(3)}</b></div>
              <div>iter <b className="text-accent">{iter}</b></div>
              <div>x <b className="text-ink">{point.x.toFixed(4)}</b></div>
              <div>y <b className="text-ink">{point.y.toFixed(4)}</b></div>
              <div>
                <span
                  className={`px-2 py-0.5 border text-[11px] ${
                    status.startsWith("done")
                      ? "border-accent text-accent"
                      : status.startsWith("stopped")
                      ? "border-blush text-blush"
                      : "border-line text-inkmuted"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Parameters */}
          <div className="border border-line p-5 bg-bone">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inkmuted mb-4">
              parameters
            </p>

            <div className="space-y-4">
              <Range label={`learning rate η = ${lr.toFixed(3)}`} min={0.001} max={0.2} step={0.001} value={lr} setValue={setLr} />
              <Range label={`momentum β = ${momentum.toFixed(2)}`} min={0} max={0.99} step={0.01} value={momentum} setValue={setMomentum} />
              <div className="flex items-center justify-between gap-2">
                <label className="font-mono text-xs text-inkmuted">nesterov</label>
                <input type="checkbox" checked={nesterov} onChange={(e) => setNesterov(e.target.checked)} className="accent-[#3538CD]" />
              </div>
              <Range label={`noise σ = ${noise.toFixed(3)}`} min={0} max={0.08} step={0.001} value={noise} setValue={setNoise} />
              <Range label={`domain R = ${domain.toFixed(2)}`} min={1.2} max={4} step={0.1} value={domain} setValue={(v) => { setDomain(v); draw(); }} />
              <Range label={`speed = ${playSpeed} steps/s`} min={1} max={120} step={1} value={playSpeed} setValue={setPlaySpeed} />
              <Range label={`max iters = ${maxIter}`} min={50} max={5000} step={10} value={maxIter} setValue={setMaxIter} />
              <div className="flex items-center justify-between gap-2">
                <label className="font-mono text-xs text-inkmuted">gradient arrow</label>
                <input type="checkbox" checked={showGrad} onChange={(e) => { setShowGrad(e.target.checked); draw(); }} className="accent-[#3538CD]" />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-line text-xs text-inkmuted space-y-1.5 leading-relaxed">
              <p>
                Arrows: <span className="font-medium text-ink">ink</span> = gradient (±∇f),{" "}
                <span className="font-medium text-accent">blue</span> = next update step,{" "}
                <span className="font-medium" style={{ color: "#8A8FF2" }}>periwinkle</span> = initial velocity. Path & point in{" "}
                <span className="font-medium text-blush">blush</span>.
              </p>
              <p>Tip: for <b>Rosenbrock</b>, start near (−1.2, 1.0) with a small η (0.003–0.01).</p>
              <p>Click to set a start point. <b>Shift+drag</b> to set an initial velocity. Hover for coordinates.</p>
            </div>
          </div>
        </div>
      </main>
      <FooterV2 />
    </div>
  );
}

function Range({ label, min, max, step, value, setValue }: { label: string; min: number; max: number; step?: number; value: number; setValue: (v: number) => void; }) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-xs text-inkmuted mb-1.5">
        <span>{label}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? 1}
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
