import { useEffect, useRef, useState } from "react";
import Nav from "./v2/Nav";
import FooterV2 from "./v2/FooterV2";
import PageMeta from "./v2/PageMeta";

/**
 * Breaking the fog — a POMDP in miniature.
 *
 * Two agents, the same maze, the same limited vision. One reacts only to
 * what it can see right now; the other keeps a belief over everything it
 * has seen and plans against it. Watching them race is the whole argument
 * for state inference under partial observability, in one screen.
 */

const ACCENT = "#3538CD";
const BLUSH = "#D6336C";

const GW = 21;
const GH = 15;
const MAX_STEPS = 1500;

const DIRS = [1, -1, GW, -GW];

function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function neighbors(i: number): number[] {
  const x = i % GW;
  const y = (i / GW) | 0;
  const out: number[] = [];
  if (x > 0) out.push(i - 1);
  if (x < GW - 1) out.push(i + 1);
  if (y > 0) out.push(i - GW);
  if (y < GH - 1) out.push(i + GW);
  return out;
}

type World = { walls: Uint8Array; start: number; goal: number };

function reachable(walls: Uint8Array, a: number, b: number) {
  const seen = new Uint8Array(walls.length);
  const q = [a];
  seen[a] = 1;
  for (let h = 0; h < q.length; h++) {
    const c = q[h];
    if (c === b) return true;
    for (const n of neighbors(c)) {
      if (!seen[n] && !walls[n]) {
        seen[n] = 1;
        q.push(n);
      }
    }
  }
  return false;
}

function buildWorld(seed: number): World {
  const start = GW + 1;
  const goal = (GH - 2) * GW + (GW - 2);
  for (let attempt = 0; attempt < 80; attempt++) {
    const rng = makeRng(seed + attempt * 7919);
    const walls = new Uint8Array(GW * GH);
    for (let i = 0; i < walls.length; i++) walls[i] = rng() < 0.27 ? 1 : 0;
    for (let x = 0; x < GW; x++) {
      walls[x] = 1;
      walls[(GH - 1) * GW + x] = 1;
    }
    for (let y = 0; y < GH; y++) {
      walls[y * GW] = 1;
      walls[y * GW + GW - 1] = 1;
    }
    walls[start] = 0;
    walls[goal] = 0;
    if (reachable(walls, start, goal)) return { walls, start, goal };
  }
  // Fallback: an empty room always works.
  const walls = new Uint8Array(GW * GH);
  for (let x = 0; x < GW; x++) {
    walls[x] = 1;
    walls[(GH - 1) * GW + x] = 1;
  }
  for (let y = 0; y < GH; y++) {
    walls[y * GW] = 1;
    walls[y * GW + GW - 1] = 1;
  }
  return { walls, start, goal };
}

type Agent = {
  pos: number;
  known: Uint8Array; // 0 unknown · 1 free · 2 wall
  visited: Uint8Array;
  steps: number;
  done: boolean;
  goalKnown: boolean;
  dir: number;
};

function makeAgent(world: World): Agent {
  const known = new Uint8Array(GW * GH);
  const visited = new Uint8Array(GW * GH);
  visited[world.start] = 1;
  return {
    pos: world.start,
    known,
    visited,
    steps: 0,
    done: false,
    goalKnown: false,
    dir: 0,
  };
}

/** Reveal everything inside the vision radius. */
function observe(ag: Agent, world: World, radius: number) {
  const ax = ag.pos % GW;
  const ay = (ag.pos / GW) | 0;
  const r = Math.ceil(radius);
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy > radius * radius) continue;
      const x = ax + dx;
      const y = ay + dy;
      if (x < 0 || y < 0 || x >= GW || y >= GH) continue;
      const i = y * GW + x;
      ag.known[i] = world.walls[i] ? 2 : 1;
      if (i === world.goal) ag.goalKnown = true;
    }
  }
}

/** BFS over known-free cells; returns the first step toward the nearest target. */
function bfsFirstStep(
  known: Uint8Array,
  from: number,
  isTarget: (i: number) => boolean
): number {
  const prev = new Int32Array(known.length).fill(-1);
  const seen = new Uint8Array(known.length);
  seen[from] = 1;
  const q = [from];
  for (let h = 0; h < q.length; h++) {
    const c = q[h];
    for (const n of neighbors(c)) {
      if (seen[n] || known[n] !== 1) continue;
      seen[n] = 1;
      prev[n] = c;
      if (isTarget(n)) {
        let cur = n;
        while (prev[cur] !== from && prev[cur] !== -1) cur = prev[cur];
        return cur;
      }
      q.push(n);
    }
  }
  return -1;
}

const hasUnknownNeighbor = (known: Uint8Array, i: number) =>
  neighbors(i).some((n) => known[n] === 0);

/**
 * Memoryless: acts on the current observation alone. It can see the walls
 * beside it and will beeline once the goal is in view — but it has no idea
 * where it has already been, so it revisits the same ground endlessly.
 * This is perceptual aliasing, the core failure mode in a POMDP.
 */
function stepReactive(ag: Agent, world: World, radius: number, rng: () => number) {
  const ax = ag.pos % GW;
  const ay = (ag.pos / GW) | 0;
  const gx = world.goal % GW;
  const gy = (world.goal / GW) | 0;
  const goalVisible =
    (gx - ax) * (gx - ax) + (gy - ay) * (gy - ay) <= radius * radius;

  const free = neighbors(ag.pos).filter((n) => !world.walls[n]);
  if (!free.length) return;

  let next: number;
  if (goalVisible) {
    const d = (i: number) =>
      Math.abs((i % GW) - gx) + Math.abs(((i / GW) | 0) - gy);
    next = free.reduce((best, c) => (d(c) < d(best) ? c : best), free[0]);
  } else {
    const ahead = ag.pos + DIRS[ag.dir];
    if (free.includes(ahead) && rng() < 0.8) {
      next = ahead;
    } else {
      next = free[(rng() * free.length) | 0];
      const di = DIRS.indexOf(next - ag.pos);
      if (di >= 0) ag.dir = di;
    }
  }
  ag.pos = next;
  ag.visited[next] = 1;
  ag.steps++;
}

/**
 * Belief-state: everything it has observed is retained as a map, and it
 * plans over that map — straight to the goal once seen, otherwise to the
 * nearest frontier between the known and the unknown.
 */
function stepBelief(ag: Agent, world: World) {
  let next = -1;

  if (ag.goalKnown) {
    // Vision passes through walls, so the goal can be spotted before any
    // route to it is known. Head for it only if a path over observed-free
    // ground actually exists — otherwise carry on exploring rather than
    // stalling in sight of it.
    next = bfsFirstStep(ag.known, ag.pos, (i) => i === world.goal);
  }
  if (next < 0) {
    next = bfsFirstStep(ag.known, ag.pos, (i) => hasUnknownNeighbor(ag.known, i));
  }
  if (next < 0) {
    ag.done = true; // everything reachable has been explored
    return;
  }

  ag.pos = next;
  ag.visited[next] = 1;
  ag.steps++;
}

function draw(
  cv: HTMLCanvasElement,
  ag: Agent,
  world: World,
  radius: number,
  tone: string
) {
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const cs = Math.max(5, Math.floor(cv.clientWidth / GW));
  const w = cs * GW;
  const h = cs * GH;
  // Scale the whole-pixel grid uniformly to the panel's exact width, so the
  // maze fills it edge to edge and the cells stay square.
  const k = cv.clientWidth / w;
  if (cv.width !== Math.round(w * k * dpr) || cv.height !== Math.round(h * k * dpr)) {
    cv.width = Math.round(w * k * dpr);
    cv.height = Math.round(h * k * dpr);
    cv.style.height = `${h * k}px`;
  }
  ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
  ctx.fillStyle = "#FAF9F5";
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < GW * GH; i++) {
    const x = (i % GW) * cs;
    const y = ((i / GW) | 0) * cs;
    const k = ag.known[i];
    if (k === 0) {
      ctx.fillStyle = "rgba(25,25,24,0.11)"; // the fog
      ctx.fillRect(x, y, cs, cs);
    } else if (k === 2) {
      ctx.fillStyle = "rgba(25,25,24,0.82)";
      ctx.fillRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
    } else if (ag.visited[i]) {
      ctx.fillStyle = "rgba(53,56,205,0.11)";
      ctx.fillRect(x, y, cs, cs);
    }
  }

  if (ag.goalKnown) {
    const gx = (world.goal % GW) * cs;
    const gy = ((world.goal / GW) | 0) * cs;
    ctx.fillStyle = BLUSH;
    ctx.fillRect(gx + cs * 0.22, gy + cs * 0.22, cs * 0.56, cs * 0.56);
  }

  const ax = (ag.pos % GW) * cs + cs / 2;
  const ay = ((ag.pos / GW) | 0) * cs + cs / 2;
  ctx.strokeStyle = "rgba(53,56,205,0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(ax, ay, radius * cs, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = tone;
  ctx.beginPath();
  ctx.arc(ax, ay, cs * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

type Stat = { steps: number; explored: number; done: boolean; won: boolean };
const EMPTY_STAT: Stat = { steps: 0, explored: 0, done: false, won: false };

export default function FogOfWar() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const reactiveCv = useRef<HTMLCanvasElement | null>(null);
  const beliefCv = useRef<HTMLCanvasElement | null>(null);

  const [radius, setRadius] = useState(2.5);
  const [speed, setSpeed] = useState(14);
  const [running, setRunning] = useState(true);
  const [seed, setSeed] = useState(7);
  const [epoch, setEpoch] = useState(0); // bumping this replays the same maze
  const [reactiveStat, setReactiveStat] = useState<Stat>(EMPTY_STAT);
  const [beliefStat, setBeliefStat] = useState<Stat>(EMPTY_STAT);

  const sim = useRef<{
    world: World;
    reactive: Agent;
    belief: Agent;
    rng: () => number;
  } | null>(null);
  const opts = useRef({ radius, speed, running });
  opts.current = { radius, speed, running };

  // (Re)build whenever the maze seed or the vision radius changes.
  useEffect(() => {
    const world = buildWorld(seed);
    const reactive = makeAgent(world);
    const belief = makeAgent(world);
    observe(reactive, world, radius);
    observe(belief, world, radius);
    sim.current = { world, reactive, belief, rng: makeRng(seed * 31 + 5) };
    setReactiveStat(EMPTY_STAT);
    setBeliefStat(EMPTY_STAT);
  }, [seed, radius, epoch]);

  useEffect(() => {
    let raf = 0;
    let acc = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const s = sim.current;
      if (s) {
        const { radius, speed, running } = opts.current;
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;

        if (running) {
          acc += dt * speed;
          let budget = Math.min(Math.floor(acc), 40);
          acc -= budget;
          while (budget-- > 0) {
            let moved = false;
            if (!s.reactive.done) {
              stepReactive(s.reactive, s.world, radius, s.rng);
              observe(s.reactive, s.world, radius);
              if (s.reactive.pos === s.world.goal || s.reactive.steps >= MAX_STEPS)
                s.reactive.done = true;
              moved = true;
            }
            if (!s.belief.done) {
              stepBelief(s.belief, s.world);
              observe(s.belief, s.world, radius);
              if (s.belief.pos === s.world.goal || s.belief.steps >= MAX_STEPS)
                s.belief.done = true;
              moved = true;
            }
            if (!moved) break;
          }

          const total = GW * GH;
          const pct = (a: Agent) => {
            let n = 0;
            for (let i = 0; i < total; i++) if (a.known[i]) n++;
            return Math.round((n / total) * 100);
          };
          setReactiveStat({
            steps: s.reactive.steps,
            explored: pct(s.reactive),
            done: s.reactive.done,
            won: s.reactive.pos === s.world.goal,
          });
          setBeliefStat({
            steps: s.belief.steps,
            explored: pct(s.belief),
            done: s.belief.done,
            won: s.belief.pos === s.world.goal,
          });
        } else {
          last = now;
        }

        if (reactiveCv.current)
          draw(reactiveCv.current, s.reactive, s.world, radius, BLUSH);
        if (beliefCv.current)
          draw(beliefCv.current, s.belief, s.world, radius, ACCENT);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const btn =
    "font-mono text-xs px-3 py-2 border border-line text-ink hover:border-accent hover:text-accent transition-colors bg-bone";

  return (
    <div className="min-h-screen min-h-dvh bg-bone text-ink font-sans">
      <PageMeta title={"Breaking the Fog — POMDP Simulator"} description={"An interactive POMDP: a memoryless agent races a belief-state agent through the same fogged maze. Built around my ACM TIST research on partial observability."} path={"/fog-of-war"} />
      <Nav />
      <main className="max-w-site mx-auto px-6 sm:px-10 pt-32 pb-24">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
              playground · partial observability
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl text-ink font-medium leading-tight rise-blur">
            Breaking the <em className="font-light text-blush">fog</em>
          </h1>
          <p className="mt-4 max-w-2xl text-inkmuted leading-relaxed">
            Same maze, same limited vision, two very different agents. One acts
            only on what it can see this instant. The other remembers everything
            it has observed and plans against that belief. This is the problem my
            research lives in — and the reason inferring hidden state matters.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
            <Panel
              tone="blush"
              label="memoryless"
              sub="reacts to the current view only"
              stat={reactiveStat}
              canvasRef={reactiveCv}
              won={reactiveStat.won}
            />
            <Panel
              tone="accent"
              label="belief-state"
              sub="remembers, then plans"
              stat={beliefStat}
              canvasRef={beliefCv}
              won={beliefStat.won}
            />
          </div>

          <div className="border border-line p-5 bg-bone h-fit">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inkmuted mb-4">
              the environment
            </p>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button className={btn} onClick={() => setRunning((r) => !r)}>
                  {running ? "pause" : "play ▸"}
                </button>
                <button className={btn} onClick={() => setSeed((s) => s + 1)}>
                  new maze
                </button>
                <button
                  className={btn}
                  onClick={() => setEpoch((e) => e + 1)}
                  title="replay this maze from the start"
                >
                  restart
                </button>
              </div>

              <Slider
                label={`vision radius = ${radius.toFixed(1)}`}
                min={1.5}
                max={5}
                step={0.5}
                value={radius}
                setValue={setRadius}
              />
              <Slider
                label={`speed = ${speed} steps/s`}
                min={1}
                max={60}
                step={1}
                value={speed}
                setValue={setSpeed}
              />
            </div>

            <div className="mt-5 pt-4 border-t border-line text-xs text-inkmuted space-y-1.5 leading-relaxed">
              <p>
                Fogged cells are what the agent has never observed. The{" "}
                <span className="text-blush font-medium">blush</span> square is the
                goal — it only appears once that agent has actually seen it.
              </p>
              <p>
                Widen the vision radius and the gap narrows: the more observable
                the world becomes, the less memory buys you. That relationship is
                the whole point.
              </p>
              <p className="text-blush/80">悟 · 修 · 成</p>
            </div>
          </div>
        </div>
      </main>
      <FooterV2 />
    </div>
  );
}

function Panel({
  tone,
  label,
  sub,
  stat,
  canvasRef,
  won,
}: {
  tone: "accent" | "blush";
  label: string;
  sub: string;
  stat: Stat;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  won?: boolean;
}) {
  return (
    <div className="border border-line bg-bone p-3">
      <div className="flex items-baseline gap-2">
        <span
          className={`h-1.5 w-1.5 rotate-45 ${
            tone === "accent" ? "bg-accent" : "bg-blush"
          }`}
        />
        <span
          className={`font-mono text-xs ${
            tone === "accent" ? "text-accent" : "text-blush"
          }`}
        >
          {label}
        </span>
      </div>
      <p className="mt-1 font-mono text-[10px] text-inkmuted">{sub}</p>
      <canvas ref={canvasRef} className="mt-3 block w-full" />
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-inkmuted">
        <span>
          steps <b className="text-ink">{stat.steps}</b>
        </span>
        <span>
          seen <b className="text-ink">{stat.explored}%</b>
        </span>
        {won && (
          <span
            className={`px-2 py-0.5 border ${
              tone === "accent"
                ? "border-accent text-accent"
                : "border-blush text-blush"
            }`}
          >
            goal reached
          </span>
        )}
      </div>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  setValue,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  setValue: (v: number) => void;
}) {
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
          background: `linear-gradient(to right, #3538CD 0%, #3538CD ${
            ((value - min) / (max - min)) * 100
          }%, #E6E4DC ${((value - min) / (max - min)) * 100}%, #E6E4DC 100%)`,
        }}
      />
    </div>
  );
}
