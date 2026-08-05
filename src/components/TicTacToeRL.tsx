import { useEffect, useRef, useState } from "react";
import Nav from "./v2/Nav";
import FooterV2 from "./v2/FooterV2";

/**
 * Tabular Q-learning, trained by self-play, live in your browser.
 *
 * Start it untrained and you will beat it — it moves at random. Train it a
 * few thousand games against itself and you won't win again. The whole
 * loop (explore, receive reward, back it up, improve) runs client-side in
 * a few milliseconds, which is what makes tic-tac-toe such a good window
 * into how RL actually works.
 *
 * Both players share one Q table: every board is canonicalised so the side
 * to move is always "X", and the bootstrap is negamax-style — the value of
 * the position I hand you is the negative of your best reply.
 */

type Player = "X" | "O";
const EMPTY = ".........";

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winnerOf(b: string): Player | "D" | null {
  for (const [a, c, d] of LINES) {
    if (b[a] !== "." && b[a] === b[c] && b[c] === b[d]) return b[a] as Player;
  }
  return b.includes(".") ? null : "D";
}

/** Which three squares won it — for drawing the strike-through. */
function winningLine(b: string): number[] | null {
  for (const line of LINES) {
    const [a, c, d] = line;
    if (b[a] !== "." && b[a] === b[c] && b[c] === b[d]) return line;
  }
  return null;
}

// Marks drawn as strokes, in the same line-art language as the site's icons.
const XMark = () => (
  <svg viewBox="0 0 100 100" className="w-1/2 h-1/2">
    <line x1="18" y1="18" x2="82" y2="82" className="mark-stroke" pathLength={1} />
    <line
      x1="82"
      y1="18"
      x2="18"
      y2="82"
      className="mark-stroke"
      style={{ animationDelay: "150ms" }}
      pathLength={1}
    />
  </svg>
);

const OMark = () => (
  <svg viewBox="0 0 100 100" className="w-1/2 h-1/2">
    <circle cx="50" cy="50" r="32" className="mark-stroke" pathLength={1} />
  </svg>
);

/**
 * Cell centres as a fraction of the board, accounting for the 8px gaps.
 * (Exact at 340px and within a pixel at any size the board actually renders.)
 */
const GAP_R = 8 / 340;
const centerFrac = (i: number) => (i * (1 + GAP_R)) / 3 + (1 - 2 * GAP_R) / 6;

const legal = (b: string) => {
  const out: number[] = [];
  for (let i = 0; i < 9; i++) if (b[i] === ".") out.push(i);
  return out;
};

const place = (b: string, i: number, p: Player) =>
  b.slice(0, i) + p + b.slice(i + 1);

/** Always describe the board from the mover's point of view. */
const canon = (b: string, mover: Player) =>
  mover === "X"
    ? b
    : b.replace(/[XO]/g, (c) => (c === "X" ? "O" : "X"));

const ALPHA = 0.2;
const GAMMA = 0.95;
const EPS = 0.25;

type QTable = Map<string, Float64Array>;

function qRow(Q: QTable, s: string): Float64Array {
  let row = Q.get(s);
  if (!row) {
    row = new Float64Array(9);
    Q.set(s, row);
  }
  return row;
}

function bestValue(Q: QTable, s: string, acts: number[]) {
  const row = Q.get(s);
  if (!row) return 0;
  let best = -Infinity;
  for (const a of acts) if (row[a] > best) best = row[a];
  return best === -Infinity ? 0 : best;
}

function argmax(Q: QTable, s: string, acts: number[]) {
  const row = Q.get(s);
  if (!row) return acts[(Math.random() * acts.length) | 0];
  let best = -Infinity;
  let ties: number[] = [];
  for (const a of acts) {
    if (row[a] > best) {
      best = row[a];
      ties = [a];
    } else if (row[a] === best) ties.push(a);
  }
  return ties[(Math.random() * ties.length) | 0];
}

/** One self-play game, updating Q as it goes. */
function playEpisode(Q: QTable) {
  let b = EMPTY;
  let mover: Player = "X";

  for (;;) {
    const s = canon(b, mover);
    const acts = legal(b);
    const a =
      Math.random() < EPS ? acts[(Math.random() * acts.length) | 0] : argmax(Q, s, acts);

    const nb = place(b, a, mover);
    const w = winnerOf(nb);

    let target: number;
    if (w) {
      // The move ended it: +1 if it won, 0 for a draw. You can never lose
      // on your own move, so there is no negative terminal here.
      target = w === "D" ? 0 : 1;
    } else {
      const opp: Player = mover === "X" ? "O" : "X";
      // Negamax: whatever is good for them is bad for me.
      target = -GAMMA * bestValue(Q, canon(nb, opp), legal(nb));
    }

    const row = qRow(Q, s);
    row[a] += ALPHA * (target - row[a]);

    if (w) return;
    b = nb;
    mover = mover === "X" ? "O" : "X";
  }
}

type Tally = { w: number; l: number; d: number };

export default function TicTacToeRL() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const Q = useRef<QTable>(new Map());
  const [board, setBoard] = useState(EMPTY);
  const [episodes, setEpisodes] = useState(0);
  const [states, setStates] = useState(0);
  const [record, setRecord] = useState<Tally>({ w: 0, l: 0, d: 0 });
  const [status, setStatus] = useState<"playing" | "won" | "lost" | "draw">("playing");
  const [training, setTraining] = useState(false);
  const [showQ, setShowQ] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [gameId, setGameId] = useState(0); // bumping this replays the entrance

  // The self-play counter rolls up rather than snapping, so training reads
  // as something that actually happened.
  const [shownEpisodes, setShownEpisodes] = useState(0);
  const shownRef = useRef(0);
  useEffect(() => {
    const from = shownRef.current;
    if (from === episodes) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 700);
      const v = Math.round(from + (episodes - from) * (1 - Math.pow(1 - p, 3)));
      shownRef.current = v;
      setShownEpisodes(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [episodes]);

  // You are X and move first; the agent answers as O.
  const agentMove = (b: string) => {
    const acts = legal(b);
    if (!acts.length) return b;
    const a = argmax(Q.current, canon(b, "O"), acts);
    return place(b, a, "O");
  };

  const settle = (b: string) => {
    const w = winnerOf(b);
    if (!w) return false;
    setWinLine(winningLine(b));
    if (w === "X") {
      setStatus("won");
      setRecord((r) => ({ ...r, w: r.w + 1 }));
    } else if (w === "O") {
      setStatus("lost");
      setRecord((r) => ({ ...r, l: r.l + 1 }));
    } else {
      setStatus("draw");
      setRecord((r) => ({ ...r, d: r.d + 1 }));
    }
    return true;
  };

  const clickCell = (i: number) => {
    if (status !== "playing" || thinking || board[i] !== ".") return;
    const afterYou = place(board, i, "X");
    setBoard(afterYou);
    if (settle(afterYou)) return;

    // A beat before it replies, so the exchange is readable.
    setThinking(true);
    window.setTimeout(() => {
      const afterAgent = agentMove(afterYou);
      setBoard(afterAgent);
      settle(afterAgent);
      setThinking(false);
    }, 260);
  };

  const train = (n: number) => {
    setTraining(true);
    // Yield first so the button state paints before we block the thread.
    window.setTimeout(() => {
      for (let i = 0; i < n; i++) playEpisode(Q.current);
      setEpisodes((e) => e + n);
      setStates(Q.current.size);
      setTraining(false);
    }, 20);
  };

  const newGame = () => {
    setBoard(EMPTY);
    setStatus("playing");
    setThinking(false);
    setWinLine(null);
    setGameId((g) => g + 1);
  };

  const resetAgent = () => {
    Q.current = new Map();
    setEpisodes(0);
    setStates(0);
    shownRef.current = 0;
    setShownEpisodes(0);
    setRecord({ w: 0, l: 0, d: 0 });
    newGame();
  };

  const btn =
    "font-mono text-xs px-3 py-2 border border-line text-ink hover:border-accent hover:text-accent transition-colors bg-bone disabled:opacity-40 disabled:hover:border-line disabled:hover:text-ink";

  const qRowNow = showQ ? Q.current.get(canon(board, "O")) : undefined;

  return (
    <div className="min-h-screen min-h-dvh bg-bone text-ink font-sans">
      <Nav />
      <main className="max-w-site mx-auto px-6 sm:px-10 pt-32 pb-24">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
              playground · learning from reward
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl text-ink font-medium leading-tight rise-blur">
            Teach it to <em className="font-light text-blush">play</em>
          </h1>
          <p className="mt-4 max-w-2xl text-inkmuted leading-relaxed">
            This agent starts knowing nothing — go ahead and beat it. Then train
            it a few thousand games against itself and try again. No server, no
            model file: tabular Q-learning, learned in your browser in the time
            it takes to click a button.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Board */}
          <div className="md:col-span-2 border border-line bg-bone p-6 sm:p-10 flex flex-col items-center">
            <div className="relative w-full max-w-[340px]">
              <div key={gameId} className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }, (_, i) => {
                  const v = board[i];
                  const q = qRowNow && v === "." ? qRowNow[i] : undefined;
                  const playable = status === "playing" && v === "." && !thinking;
                  const inWin = winLine?.includes(i) ?? false;
                  return (
                    <button
                      key={i}
                      onClick={() => clickCell(i)}
                      disabled={!playable}
                      style={{ animationDelay: `${i * 35}ms` }}
                      className={`cell-in group relative aspect-square border bg-bone flex items-center justify-center transition-all duration-200
                        ${inWin ? "win-cell border-accent/50" : "border-line"}
                        ${playable ? "hover:border-accent/60 active:scale-[0.97]" : ""}`}
                    >
                      {v === "X" && (
                        <span className="text-ink w-full h-full flex items-center justify-center">
                          <XMark />
                        </span>
                      )}
                      {v === "O" && (
                        <span className="text-accent w-full h-full flex items-center justify-center">
                          <OMark />
                        </span>
                      )}
                      {/* a ghost of your mark, previewing the square */}
                      {playable && (
                        <span className="absolute inset-0 flex items-center justify-center text-ink opacity-0 group-hover:opacity-[0.16] transition-opacity duration-200 pointer-events-none">
                          <svg viewBox="0 0 100 100" className="w-1/2 h-1/2">
                            <line x1="18" y1="18" x2="82" y2="82" stroke="currentColor" strokeWidth={7} strokeLinecap="round" />
                            <line x1="82" y1="18" x2="18" y2="82" stroke="currentColor" strokeWidth={7} strokeLinecap="round" />
                          </svg>
                        </span>
                      )}
                      {q !== undefined && (
                        <span
                          className="absolute bottom-1 right-1.5 font-mono text-[10px] transition-colors"
                          style={{ color: q >= 0 ? "#3538CD" : "#D6336C" }}
                        >
                          {q.toFixed(2)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* strike-through, drawn across the winning three */}
              {winLine && (
                <svg
                  viewBox="0 0 1 1"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                >
                  {(() => {
                    const a = winLine[0];
                    const c = winLine[2];
                    const x1 = centerFrac(a % 3);
                    const y1 = centerFrac((a / 3) | 0);
                    const x2 = centerFrac(c % 3);
                    const y2 = centerFrac((c / 3) | 0);
                    // a touch of overshoot past both ends reads as a real stroke
                    const dx = (x2 - x1) * 0.08;
                    const dy = (y2 - y1) * 0.08;
                    return (
                      <line
                        className="win-line"
                        x1={x1 - dx}
                        y1={y1 - dy}
                        x2={x2 + dx}
                        y2={y2 + dy}
                        pathLength={1}
                        stroke={status === "won" ? "#D6336C" : "#3538CD"}
                        strokeWidth={0.02}
                      />
                    );
                  })()}
                </svg>
              )}
            </div>

            <div className="mt-6 h-6 font-mono text-xs">
              {status === "playing" &&
                (thinking ? (
                  <span className="text-inkmuted inline-flex items-center gap-1">
                    agent is choosing
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="think-dot inline-block h-1 w-1 rounded-full bg-accent"
                        style={{ animationDelay: `${d * 140}ms` }}
                      />
                    ))}
                  </span>
                ) : (
                  <span className="text-inkmuted">your move — you are X</span>
                ))}
              {status === "won" && <span className="text-blush">you win</span>}
              {status === "lost" && <span className="text-accent">agent wins</span>}
              {status === "draw" && <span className="text-inkmuted">a draw</span>}
            </div>

            <button className={`${btn} mt-2`} onClick={newGame}>
              new game
            </button>
          </div>

          {/* Controls */}
          <div className="border border-line p-5 bg-bone h-fit">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inkmuted mb-4">
              the agent
            </p>

            <div className="font-mono text-xs text-inkmuted space-y-1.5">
              <div className="flex justify-between">
                <span>games self-played</span>
                <b className="text-accent tabular-nums">
                  {shownEpisodes.toLocaleString()}
                </b>
              </div>
              {/* a scan line while the thread is busy learning */}
              <div className="h-[2px] bg-line/70 overflow-hidden">
                {training && (
                  <div className="train-scan h-full w-1/4 bg-accent" />
                )}
              </div>
              <div className="flex justify-between">
                <span>positions known</span>
                <b className="text-ink">{states.toLocaleString()}</b>
              </div>
              <div className="flex justify-between pt-2 border-t border-line mt-2">
                <span>your record</span>
                <b className="text-ink">
                  <span className="text-blush">{record.w}W</span> ·{" "}
                  <span className="text-accent">{record.l}L</span> · {record.d}D
                </b>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button className={btn} disabled={training} onClick={() => train(1000)}>
                {training ? "training…" : "train 1,000"}
              </button>
              <button className={btn} disabled={training} onClick={() => train(20000)}>
                train 20,000
              </button>
              <button className={btn} disabled={training} onClick={resetAgent}>
                forget everything
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between gap-2">
              <label className="font-mono text-xs text-inkmuted">
                show its Q-values
              </label>
              <input
                type="checkbox"
                checked={showQ}
                onChange={(e) => setShowQ(e.target.checked)}
                className="accent-[#3538CD]"
              />
            </div>

            <div className="mt-5 pt-4 border-t border-line text-xs text-inkmuted space-y-1.5 leading-relaxed">
              <p>
                Turn on Q-values to see what it expects from each open square —{" "}
                <span className="text-accent font-medium">blue</span> is good for
                the agent, <span className="text-blush font-medium">blush</span> is
                bad. Untrained, they're all zero. Trained, they're a map of the
                whole game.
              </p>
              <p>α = 0.2 · γ = 0.95 · ε = 0.25 · negamax bootstrap</p>
            </div>
          </div>
        </div>
      </main>
      <FooterV2 />
    </div>
  );
}
