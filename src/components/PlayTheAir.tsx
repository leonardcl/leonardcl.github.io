import { useEffect, useRef, useState } from "react";
import Nav from "./v2/Nav";
import FooterV2 from "./v2/FooterV2";
import PageMeta from "./v2/PageMeta";

/**
 * An instrument played by moving your hands through the air.
 *
 * MediaPipe tracks 21 landmarks per hand from the webcam; those drive a
 * Web Audio synth voice each. Height sets pitch — snapped to a scale so it
 * stays musical rather than a theremin howl — sideways position opens the
 * filter, and pinching your thumb and finger together controls expression.
 * Two hands, two independent voices.
 *
 * Everything runs locally. MediaPipe loads from a CDN on demand, so this
 * page costs the rest of the site nothing.
 */

const ACCENT = "#3538CD";
const BLUSH = "#D6336C";
const MP = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";

const SCALES: Record<string, number[]> = {
  "major pentatonic": [0, 2, 4, 7, 9],
  "minor pentatonic": [0, 3, 5, 7, 10],
  major: [0, 2, 4, 5, 7, 9, 11],
  "natural minor": [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  blues: [0, 3, 5, 6, 7, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const WAVES: OscillatorType[] = ["sine", "triangle", "sawtooth", "square"];

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

const midiToFreq = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

/** Map 0..1 to a note in the chosen scale, spanning `octaves` from the root. */
function quantize(t: number, scale: number[], rootMidi: number, octaves: number) {
  const steps = scale.length * octaves;
  const i = Math.max(0, Math.min(steps - 1, Math.round(t * (steps - 1))));
  return rootMidi + Math.floor(i / scale.length) * 12 + scale[i % scale.length];
}

const noteName = (m: number) => `${KEYS[((m % 12) + 12) % 12]}${Math.floor(m / 12) - 1}`;

type Voice = {
  osc: OscillatorNode;
  sub: OscillatorNode;
  filter: BiquadFilterNode;
  gain: GainNode;
};

type HandState = { note: number; cutoff: number; level: number } | null;

export default function PlayTheAir() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hands, setHands] = useState<HandState[]>([null, null]);

  const [scaleName, setScaleName] = useState("major pentatonic");
  const [keyName, setKeyName] = useState("C");
  const [wave, setWave] = useState<OscillatorType>("triangle");
  const [octaves, setOctaves] = useState(2);
  const [showVideo, setShowVideo] = useState(false);
  const opts = useRef({ scaleName, keyName, wave, octaves, showVideo });
  opts.current = { scaleName, keyName, wave, octaves, showVideo };

  const audio = useRef<{ ctx: AudioContext; master: GainNode; voices: Voice[] } | null>(null);
  const landmarker = useRef<any>(null);
  const raf = useRef(0);
  const smooth = useRef<{ y: number; x: number; p: number }[]>([
    { y: 0.5, x: 0.5, p: 0 },
    { y: 0.5, x: 0.5, p: 0 },
  ]);

  const buildAudio = () => {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = new Ctor();

    // A little delay keeps it from sounding bone dry.
    const master = ctx.createGain();
    master.gain.value = 0.9;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.28;
    const fb = ctx.createGain();
    fb.gain.value = 0.28;
    const wet = ctx.createGain();
    wet.gain.value = 0.22;
    master.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(ctx.destination);
    master.connect(ctx.destination);

    const voices: Voice[] = [0, 1].map(() => {
      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = opts.current.wave;
      sub.type = "sine";
      filter.type = "lowpass";
      filter.Q.value = 6;
      filter.frequency.value = 800;
      gain.gain.value = 0;
      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start();
      sub.start();
      return { osc, sub, filter, gain };
    });

    audio.current = { ctx, master, voices };
  };

  const start = async () => {
    setError(null);
    try {
      setStatus("loading hand tracking…");
      // Fetched at runtime, never bundled — the model is far larger than
      // the entire rest of the site.
      const vision: any = await import(/* @vite-ignore */ MP);
      const fileset = await vision.FilesetResolver.forVisionTasks(`${MP}/wasm`);
      landmarker.current = await vision.HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });

      setStatus("opening camera…");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      buildAudio();
      setStatus("");
      setRunning(true);
    } catch (e) {
      setStatus("");
      setError(
        e instanceof Error && e.name === "NotAllowedError"
          ? "Camera permission denied — the instrument needs it to see your hands."
          : "Couldn't start. This needs a modern browser with camera access; hand tracking loads from a CDN, so an offline or heavily blocked connection will fail here."
      );
    }
  };

  const stop = () => {
    cancelAnimationFrame(raf.current);
    const video = videoRef.current;
    if (video?.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    const a = audio.current;
    if (a) {
      a.voices.forEach((v) => v.gain.gain.setTargetAtTime(0, a.ctx.currentTime, 0.02));
      const ctx = a.ctx;
      window.setTimeout(() => ctx.close().catch(() => {}), 120);
      audio.current = null;
    }
    setRunning(false);
    setHands([null, null]);
  };

  // Always release the camera and silence the synth when leaving the page.
  useEffect(() => stop, []);

  useEffect(() => {
    if (!running) return;
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx2d = canvas.getContext("2d")!;
    let last = -1;

    const tick = () => {
      const { scaleName, keyName, wave, octaves, showVideo } = opts.current;
      const a = audio.current;
      const w = wrap.clientWidth - 2;
      const h = Math.floor((w * 3) / 4);
      if (canvas.width !== w) {
        canvas.width = w;
        canvas.height = h;
      }

      let results: any = null;
      const now = performance.now();
      if (landmarker.current && video.readyState >= 2 && now !== last) {
        last = now;
        try {
          results = landmarker.current.detectForVideo(video, now);
        } catch {
          /* a dropped frame is not worth stopping for */
        }
      }

      // ── paint ──
      ctx2d.fillStyle = "#FAF9F5";
      ctx2d.fillRect(0, 0, w, h);
      if (showVideo) {
        ctx2d.save();
        ctx2d.globalAlpha = 0.22;
        ctx2d.translate(w, 0);
        ctx2d.scale(-1, 1);
        ctx2d.drawImage(video, 0, 0, w, h);
        ctx2d.restore();
      }
      // faint guide grid: the pitch ladder
      const scale = SCALES[scaleName];
      const steps = scale.length * octaves;
      ctx2d.strokeStyle = "rgba(25,25,24,0.07)";
      ctx2d.lineWidth = 1;
      for (let i = 0; i < steps; i++) {
        const y = h - (i / (steps - 1)) * h;
        ctx2d.beginPath();
        ctx2d.moveTo(0, y);
        ctx2d.lineTo(w, y);
        ctx2d.stroke();
      }

      const next: HandState[] = [null, null];
      const lms: any[] = results?.landmarks ?? [];

      for (let i = 0; i < Math.min(2, lms.length); i++) {
        const pts = lms[i];
        const tone = i === 0 ? ACCENT : BLUSH;

        // Mirror x so moving right on screen matches moving right in life.
        const px = (p: any) => (1 - p.x) * w;
        const py = (p: any) => p.y * h;

        ctx2d.strokeStyle = tone;
        ctx2d.lineWidth = 2;
        ctx2d.globalAlpha = 0.85;
        for (const [a1, b1] of CONNECTIONS) {
          ctx2d.beginPath();
          ctx2d.moveTo(px(pts[a1]), py(pts[a1]));
          ctx2d.lineTo(px(pts[b1]), py(pts[b1]));
          ctx2d.stroke();
        }
        ctx2d.fillStyle = tone;
        for (const p of pts) {
          ctx2d.beginPath();
          ctx2d.arc(px(p), py(p), 3, 0, Math.PI * 2);
          ctx2d.fill();
        }
        ctx2d.globalAlpha = 1;

        // ── gesture → control ──
        const palm = pts[9];
        const pinch = Math.hypot(pts[4].x - pts[8].x, pts[4].y - pts[8].y);
        const s = smooth.current[i];
        // Landmarks jitter frame to frame; smoothing is what makes it
        // feel like an instrument instead of a broken sensor.
        s.y += ((1 - palm.y) - s.y) * 0.35;
        s.x += ((1 - palm.x) - s.x) * 0.35;
        s.p += (pinch - s.p) * 0.35;

        const rootMidi = 48 + KEYS.indexOf(keyName); // from C3
        const note = quantize(s.y, scale, rootMidi, octaves);
        const cutoff = 180 * Math.pow(60, s.x); // exponential, 180Hz→~10kHz
        const level = Math.max(0, Math.min(1, (s.p - 0.03) / 0.20));

        next[i] = { note, cutoff, level };

        if (a) {
          const v = a.voices[i];
          const t = a.ctx.currentTime;
          if (v.osc.type !== wave) v.osc.type = wave;
          const f = midiToFreq(note);
          // setTargetAtTime everywhere — instant jumps click audibly.
          v.osc.frequency.setTargetAtTime(f, t, 0.02);
          v.sub.frequency.setTargetAtTime(f / 2, t, 0.02);
          v.filter.frequency.setTargetAtTime(cutoff, t, 0.03);
          v.gain.gain.setTargetAtTime(level * 0.22, t, 0.04);
        }

        // pinch readout at the fingertips
        ctx2d.strokeStyle = tone;
        ctx2d.setLineDash([3, 3]);
        ctx2d.beginPath();
        ctx2d.moveTo(px(pts[4]), py(pts[4]));
        ctx2d.lineTo(px(pts[8]), py(pts[8]));
        ctx2d.stroke();
        ctx2d.setLineDash([]);
        ctx2d.fillStyle = tone;
        ctx2d.font = '600 13px "JetBrains Mono", monospace';
        ctx2d.fillText(noteName(note), px(pts[9]) + 12, py(pts[9]));
      }

      // silence any voice whose hand left the frame
      if (a) {
        for (let i = lms.length; i < 2; i++) {
          a.voices[i].gain.gain.setTargetAtTime(0, a.ctx.currentTime, 0.05);
        }
      }
      if (!lms.length) {
        ctx2d.fillStyle = "#6B6A64";
        ctx2d.font = '12px "JetBrains Mono", monospace';
        ctx2d.fillText("show your hands to the camera", 16, 26);
      }

      setHands(next);
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  const btn =
    "font-mono text-xs px-3 py-2 border border-line text-ink hover:border-accent hover:text-accent transition-colors bg-bone";

  return (
    <div className="min-h-screen min-h-dvh bg-bone text-ink font-sans">
      <PageMeta
        title="Play the Air — Hand-Gesture Instrument"
        description="An instrument played with hand gestures through your webcam. MediaPipe hand tracking drives a Web Audio synth: height is pitch, locked to a scale; sideways opens the filter; pinch controls expression."
        path="/play-the-air"
      />
      <Nav />
      <main className="max-w-site mx-auto px-6 sm:px-10 pt-32 pb-24">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
              playground · gesture → sound
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl text-ink font-medium leading-tight rise-blur">
            Play the <em className="font-light text-blush">air</em>
          </h1>
          <p className="mt-4 max-w-2xl text-inkmuted leading-relaxed">
            Twenty-one points per hand, tracked from your webcam, wired straight
            into a synthesiser. Raise a hand to climb the scale, move it sideways
            to open the filter, pinch to swell the note. Two hands, two voices.
            Nothing is recorded and nothing leaves your machine.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div ref={wrapRef} className="md:col-span-2 border border-line overflow-hidden bg-bone relative">
            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas ref={canvasRef} className="block w-full" />
            {!running && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 min-h-[380px] px-6 text-center">
                <p className="font-mono text-sm text-inkmuted">
                  {status || "the instrument is off"}
                </p>
                {!status && (
                  <button
                    className="font-mono text-xs px-5 py-2.5 border border-ink bg-ink text-bone hover:bg-accent hover:border-accent transition-colors"
                    onClick={start}
                  >
                    start playing ▸
                  </button>
                )}
                {!status && (
                  <p className="font-mono text-[10px] text-inkmuted max-w-xs leading-relaxed">
                    loads ~6 MB of hand-tracking model the first time
                  </p>
                )}
                {error && (
                  <p className="font-mono text-xs text-blush max-w-sm leading-relaxed">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="border border-line p-5 bg-bone h-fit">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inkmuted mb-4">
              the instrument
            </p>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {running ? (
                  <button className={btn} onClick={stop}>stop</button>
                ) : (
                  <button className={btn} onClick={start} disabled={!!status}>
                    start
                  </button>
                )}
              </div>

              <Select label="key" value={keyName} options={KEYS} onChange={setKeyName} />
              <Select
                label="scale"
                value={scaleName}
                options={Object.keys(SCALES)}
                onChange={setScaleName}
              />
              <Select
                label="waveform"
                value={wave}
                options={WAVES as string[]}
                onChange={(v) => setWave(v as OscillatorType)}
              />

              <div>
                <div className="font-mono text-xs text-inkmuted mb-1.5">{`range = ${octaves} octave${octaves > 1 ? "s" : ""}`}</div>
                <input
                  type="range" min={1} max={4} step={1} value={octaves}
                  onChange={(e) => setOctaves(Number(e.target.value))}
                  className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-[#3538CD]"
                  style={{ background: `linear-gradient(to right, #3538CD 0%, #3538CD ${((octaves - 1) / 3) * 100}%, #E6E4DC ${((octaves - 1) / 3) * 100}%, #E6E4DC 100%)` }}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <label className="font-mono text-xs text-inkmuted">show camera</label>
                <input
                  type="checkbox"
                  checked={showVideo}
                  onChange={(e) => setShowVideo(e.target.checked)}
                  className="accent-[#3538CD]"
                />
              </div>
            </div>

            {/* live readout */}
            <div className="mt-5 pt-4 border-t border-line space-y-2">
              {hands.map((hnd, i) => (
                <div key={i} className="font-mono text-[11px]">
                  <span style={{ color: i === 0 ? ACCENT : BLUSH }}>
                    voice {i + 1}
                  </span>{" "}
                  {hnd ? (
                    <span className="text-inkmuted">
                      {noteName(hnd.note)} · {Math.round(hnd.cutoff)}Hz ·{" "}
                      {Math.round(hnd.level * 100)}%
                    </span>
                  ) : (
                    <span className="text-inkmuted/50">—</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-line text-xs text-inkmuted space-y-1.5 leading-relaxed">
              <p>
                <b className="text-ink">Up/down</b> is pitch, snapped to the scale
                so it stays in key. <b className="text-ink">Left/right</b> opens
                the filter. <b className="text-ink">Pinch</b> thumb to finger for
                volume — open hand is silent.
              </p>
              <p>
                Start with <b className="text-ink">major pentatonic</b>: every note
                sits well against every other, so it's hard to sound wrong.
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

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="font-mono text-xs text-inkmuted mb-1.5">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full font-mono text-xs px-3 py-2 border border-line bg-bone text-ink hover:border-accent transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
