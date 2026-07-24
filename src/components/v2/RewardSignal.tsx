import { useEffect, useRef, useState } from "react";

/**
 * The reward signal — a hidden nod to reinforcement learning, live on the
 * site of someone who researches it. An agent travels a short path,
 * collects +1s (and one −1, because learning includes falling), and
 * settles on the same return you'd find in any RL textbook: Gt.
 *
 * Find it two ways:
 *   1. The Konami code, anywhere on the site.
 *   2. Five quick clicks on the "leonardcl." mark in the nav.
 *
 * Both dispatch/are caught here — this component mounts once, globally,
 * as a sibling of the router, so it works no matter which page you're on.
 */

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const BLUSH = "#D6336C";
const MUTED = "#6B6A64";

// [percent along the path, reward, delay before the message appears]
const SIGNALS: { pct: number; value: 1 | -1; delay: number }[] = [
  { pct: 14, value: 1, delay: 0.85 },
  { pct: 30, value: 1, delay: 1.85 },
  { pct: 47, value: -1, delay: 2.85 }, // a stumble — learning includes falling
  { pct: 64, value: 1, delay: 3.85 },
  { pct: 80, value: 1, delay: 4.85 },
];

const TRAVEL_S = 6;
const MESSAGE_DELAY = TRAVEL_S + 0.4;
const MESSAGE_DURATION = 2.6;
const TOTAL_MS = (MESSAGE_DELAY + MESSAGE_DURATION) * 1000;

const RewardSignal = () => {
  const [playing, setPlaying] = useState(false);
  const bufferRef = useRef<string[]>([]);
  const timerRef = useRef<number | undefined>(undefined);
  const playingRef = useRef(false);
  playingRef.current = playing;

  const trigger = () => {
    if (playingRef.current) return;
    setPlaying(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setPlaying(false), TOTAL_MS);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const buf = [...bufferRef.current, key].slice(-KONAMI.length);
      bufferRef.current = buf;
      if (buf.length === KONAMI.length && buf.every((k, i) => k === KONAMI[i])) {
        trigger();
        bufferRef.current = [];
      }
    };
    const onCustom = () => trigger();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("rl-easter-egg", onCustom);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("rl-easter-egg", onCustom);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!playing) return null;

  return (
    <div
      className="fixed inset-x-0 z-[200] pointer-events-none"
      style={{ bottom: "20%" }}
      aria-hidden
    >
      <div className="relative max-w-3xl mx-auto px-10 h-8">
        {/* the path */}
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-line" />

        {/* the agent */}
        <div
          className="reward-agent absolute top-1/2 h-3.5 w-3.5 rounded-full"
          style={{
            backgroundColor: "#3538CD",
            boxShadow: "0 0 14px rgba(53,56,205,0.55)",
          }}
        />

        {/* reward signals along the way */}
        {SIGNALS.map((s, i) => (
          <span
            key={i}
            className="reward-pop absolute font-mono text-sm font-semibold"
            style={{
              left: `${s.pct}%`,
              top: "-6px",
              color: s.value > 0 ? BLUSH : MUTED,
              animationDelay: `${s.delay}s`,
            }}
          >
            {s.value > 0 ? "+1" : "−1"}
          </span>
        ))}

        {/* the return, once the episode ends */}
        <div
          className="reward-message absolute left-1/2 text-center"
          style={{ top: "34px", animationDelay: `${MESSAGE_DELAY}s` }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-inkmuted whitespace-nowrap">
            reward signal received
          </p>
          <p className="mt-1.5 font-display italic text-ink text-lg whitespace-nowrap">
            G<sub>t</sub> = R<sub>t+1</sub> + R<sub>t+2</sub> + &hellip;
          </p>
          <p className="mt-1.5 text-blush text-xs tracking-[0.35em] whitespace-nowrap">
            悟 · 修 · 成
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardSignal;
