import { useEffect, useRef, useState } from "react";
import Nav from "./v2/Nav";
import FooterV2 from "./v2/FooterV2";
import PageMeta from "./v2/PageMeta";

/**
 * An instrument played by moving your hands through the air.
 *
 * MediaPipe tracks 21 landmarks per hand from the webcam; those drive a
 * Web Audio synth voice each. Middle, ring and pinky are the notes, while
 * thumb and index pinch together as a volume fader — the most controllable
 * gesture the hand has. Hand height moves the chord up a scale, sideways
 * opens the filter.
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
  filter: BiquadFilterNode;
  gain: GainNode;
  note: number;
};

type HandState = { notes: number[]; cutoff: number; level: number; open: boolean[] } | null;

const TIP = [4, 8, 12, 16, 20];
// Each finger as [base, middle joint, tip] — the angle at the middle
// joint is what tells us whether it's straight or curled.
const JOINTS: [number, number, number][] = [
  [1, 2, 4],    // thumb
  [5, 6, 8],    // index
  [9, 10, 12],  // middle
  [13, 14, 16], // ring
  [17, 18, 20], // pinky
];
// Curled-vs-straight cutoff in degrees. The thumb never straightens as
// far as the others, and the pinky is stubby enough to read shallower,
// so a single threshold across all five leaves them permanently silent —
// which is exactly what a distance-ratio test got wrong.
const STRAIGHT = [148, 158, 158, 152, 145];

// Middle, ring and pinky play notes. Thumb and index aren't voices at
// all — they work together as one pinch, which is the most controllable
// gesture the hand has, and the three remaining fingers give eight
// combinations to play with.
const NOTE_FINGERS = [2, 3, 4];
const THUMB = 4; // landmark: thumb tip
const INDEX = 8; // landmark: index tip
const VOICES_PER_HAND = NOTE_FINGERS.length;

const dist = (a: any, b: any) => Math.hypot(a.x - b.x, a.y - b.y);

/** Interior angle at `b`, in degrees. */
function angleAt(a: any, b: any, c: any) {
  const v1x = a.x - b.x, v1y = a.y - b.y;
  const v2x = c.x - b.x, v2y = c.y - b.y;
  const d = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y) || 1e-6;
  const cos = Math.max(-1, Math.min(1, (v1x * v2x + v1y * v2y) / d));
  return (Math.acos(cos) * 180) / Math.PI;
}

/**
 * Is this finger extended? Measured as joint angle rather than distance,
 * because distance ratios scale with finger length — the pinky and thumb
 * simply never cleared a threshold tuned for the index finger.
 */
function isExtended(pts: any[], f: number, sens: number) {
  const [a, b, c] = JOINTS[f];
  // sens > 1 should make triggering *easier*, so it lowers the bar.
  return angleAt(pts[a], pts[b], pts[c]) > STRAIGHT[f] / sens;
}

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
  const [spacing, setSpacing] = useState(2); // scale degrees between fingers
  const [sens, setSens] = useState(1);
  const [echo, setEcho] = useState(0.22);
  const [echoTime, setEchoTime] = useState(0.28);
  const [reverb, setReverb] = useState(0.16);
  const [drive, setDrive] = useState(0);
  const [reso, setReso] = useState(5);
  const opts = useRef({ scaleName, keyName, wave, octaves, showVideo, spacing, sens });
  opts.current = { scaleName, keyName, wave, octaves, showVideo, spacing, sens };

  const audio = useRef<{
    ctx: AudioContext;
    master: GainNode;
    voices: Voice[];
    delay: DelayNode;
    feedback: GainNode;
    echoMix: GainNode;
    reverbMix: GainNode;
    drive: WaveShaperNode;
    driveMix: GainNode;
    dry: GainNode;
  } | null>(null);
  const landmarker = useRef<any>(null);
  const raf = useRef(0);
  const smooth = useRef<{ y: number; x: number; d: number }[]>([
    { y: 0.5, x: 0.5, d: 0.2 },
    { y: 0.5, x: 0.5, d: 0.2 },
  ]);

  // Effects are applied straight to the running graph, so a slider moves
  // the sound under your hands rather than on the next note.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const t = a.ctx.currentTime;
    a.echoMix.gain.setTargetAtTime(echo, t, 0.05);
    a.delay.delayTime.setTargetAtTime(echoTime, t, 0.08);
    a.feedback.gain.setTargetAtTime(Math.min(0.85, echo * 1.4), t, 0.05);
    a.reverbMix.gain.setTargetAtTime(reverb, t, 0.05);
    a.driveMix.gain.setTargetAtTime(drive, t, 0.05);
    a.dry.gain.setTargetAtTime(1 - drive * 0.55, t, 0.05);
    a.voices.forEach((v) => v.filter.Q.setTargetAtTime(reso, t, 0.05));
  }, [echo, echoTime, reverb, drive, reso, running]);

  const buildAudio = () => {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = new Ctor();

    const master = ctx.createGain();
    master.gain.value = 0.55; // headroom for several voices at once

    // Drive: a soft-clip curve, blended in rather than replacing the dry
    // signal, so it adds grit without turning everything to fuzz.
    const driveNode = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1;
      curve[i] = Math.tanh(x * 3);
    }
    driveNode.curve = curve;
    driveNode.oversample = "2x";
    const driveMix = ctx.createGain();
    driveMix.gain.value = drive;
    const dry = ctx.createGain();
    dry.gain.value = 1 - drive * 0.55;

    // Echo
    const delay = ctx.createDelay(2);
    delay.delayTime.value = echoTime;
    const feedback = ctx.createGain();
    feedback.gain.value = Math.min(0.85, echo * 1.4);
    const echoMix = ctx.createGain();
    echoMix.gain.value = echo;

    // Reverb: a decaying noise burst as the impulse — no audio file needed,
    // and close enough to a room for an instrument like this.
    const reverbNode = ctx.createConvolver();
    const len = ctx.sampleRate * 2.4;
    const imp = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = imp.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      }
    }
    reverbNode.buffer = imp;
    const reverbMix = ctx.createGain();
    reverbMix.gain.value = reverb;

    master.connect(dry);
    master.connect(driveNode);
    driveNode.connect(driveMix);
    dry.connect(ctx.destination);
    driveMix.connect(ctx.destination);

    master.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(echoMix);
    echoMix.connect(ctx.destination);

    master.connect(reverbNode);
    reverbNode.connect(reverbMix);
    reverbMix.connect(ctx.destination);

    // Two hands x five fingers, so a full chord can sound at once.
    const voices: Voice[] = Array.from({ length: 2 * VOICES_PER_HAND }, () => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = opts.current.wave;
      filter.type = "lowpass";
      filter.Q.value = reso;
      filter.frequency.value = 800;
      gain.gain.value = 0;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start();
      return { osc, filter, gain, note: -1 };
    });

    audio.current = { ctx, master, voices, delay, feedback, echoMix, reverbMix, drive: driveNode, driveMix, dry };
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
    // Downsampling target for the pixelated view — one pixel per cell,
    // which is far cheaper than reading the full frame every tick.
    const buf = document.createElement("canvas");
    const bctx = buf.getContext("2d", { willReadFrequently: true })!;
    let last = -1;

    const tick = () => {
      const { scaleName, keyName, wave, octaves, showVideo, spacing, sens } = opts.current;
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
      if (showVideo && video.readyState >= 2) {
        // You, rendered in the same pixel language as the rest of the site —
        // kept deliberately faint and coarse so your hands stay the subject
        // and the per-frame cost stays negligible.
        const cell = 20;
        const cols = Math.max(8, Math.floor(w / cell));
        const rows = Math.max(6, Math.floor(h / cell));
        buf.width = cols;
        buf.height = rows;
        bctx.save();
        bctx.translate(cols, 0);
        bctx.scale(-1, 1); // mirror, so it reads like a mirror
        bctx.drawImage(video, 0, 0, cols, rows);
        bctx.restore();
        const data = bctx.getImageData(0, 0, cols, rows).data;
        const cw = w / cols;
        const chh = h / rows;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = (r * cols + c) * 4;
            const lum =
              (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
            const dark = 1 - lum;
            if (dark < 0.28) continue; // bright areas stay bone
            const sz = cw * (0.32 + dark * 0.5);
            ctx2d.fillStyle =
              dark > 0.72
                ? "rgba(25,25,24,0.26)"
                : dark > 0.52
                ? "rgba(53,56,205,0.22)"
                : "rgba(138,143,242,0.18)";
            ctx2d.fillRect(c * cw + (cw - sz) / 2, r * chh + (chh - sz) / 2, sz, sz);
          }
        }
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

        // ── gesture → notes ──
        const palm = pts[9];
        const sm = smooth.current[i];
        // Landmarks jitter frame to frame; smoothing is what makes this
        // feel like an instrument rather than a broken sensor.
        sm.y += ((1 - palm.y) - sm.y) * 0.3;
        sm.x += ((1 - palm.x) - sm.x) * 0.3;
        // Thumb spread is the volume fader — measured as the distance from
        // thumb tip to the pinky knuckle, scaled by hand size so it holds up
        // as you move nearer or further from the camera. Tuck the thumb in
        // to fade out, splay it to play full.
        const span = dist(pts[0], pts[9]) || 1e-6;
        sm.d += (dist(pts[4], pts[17]) / span - sm.d) * 0.25;
        const level = Math.max(0, Math.min(1, (sm.d - 0.75) / 0.55));

        // Index lifts the whole hand an octave — the cheapest way to widen
        // the range without spending another note-finger on it.

        const rootMidi = 48 + KEYS.indexOf(keyName); // from C3
        const base = quantize(sm.y, scale, rootMidi, octaves); // hand height
        const cutoff = 180 * Math.pow(60, sm.x); // exponential, 180Hz -> ~10kHz
        const baseIdx = scale.indexOf(((base - rootMidi) % 12 + 12) % 12);
        const baseOct = Math.floor((base - rootMidi) / 12);

        const sounding: number[] = [];
        const open: boolean[] = [];
        for (let n = 0; n < NOTE_FINGERS.length; n++) {
          const f = NOTE_FINGERS[n];
          const vi = i * VOICES_PER_HAND + n;
          const v = a?.voices[vi];
          const out = isExtended(pts, f, sens);
          open.push(out);

          if (out) {
            // Each extended finger stacks another scale degree on top of
            // the hand's base note. At spacing 2 that's thirds, so three
            // fingers give you an actual triad.
            const deg = (baseIdx < 0 ? 0 : baseIdx) + n * spacing;
            const note =
              rootMidi + (baseOct + Math.floor(deg / scale.length)) * 12 +
              scale[deg % scale.length];
            sounding.push(note);

            if (v && a) {
              const t = a.ctx.currentTime;
              if (v.osc.type !== wave) v.osc.type = wave;
              v.osc.frequency.setTargetAtTime(midiToFreq(note), t, 0.02);
              v.filter.frequency.setTargetAtTime(cutoff, t, 0.03);
              // quieter as more fingers open, so chords don't clip
              v.gain.gain.setTargetAtTime(level * 0.20, t, 0.04);
              v.note = note;
            }
          } else if (v && a) {
            v.gain.gain.setTargetAtTime(0, a.ctx.currentTime, 0.06);
            v.note = -1;
          }

          // fingertip marker: filled when that finger is sounding
          const p = pts[TIP[f]];
          ctx2d.beginPath();
          ctx2d.arc(px(p), py(p), out ? 7 : 4, 0, Math.PI * 2);
          if (out) {
            ctx2d.fillStyle = tone;
            ctx2d.fill();
          } else {
            ctx2d.strokeStyle = tone;
            ctx2d.lineWidth = 1.5;
            ctx2d.stroke();
          }
        }

        // mark the control fingers so the panel can show them too
        next[i] = { notes: sounding, cutoff, level, open };

        // the pinch itself, drawn as the fader it is
        ctx2d.strokeStyle = tone;
        ctx2d.globalAlpha = 0.35 + level * 0.65;
        ctx2d.lineWidth = 1 + level * 2.5;
        ctx2d.setLineDash([4, 4]);
        ctx2d.beginPath();
        ctx2d.moveTo(px(pts[THUMB]), py(pts[THUMB]));
        ctx2d.lineTo(px(pts[INDEX]), py(pts[INDEX]));
        ctx2d.stroke();
        ctx2d.setLineDash([]);
        for (const cf of [THUMB, INDEX]) {
          ctx2d.beginPath();
          ctx2d.arc(px(pts[cf]), py(pts[cf]), 6, 0, Math.PI * 2);
          ctx2d.stroke();
        }
        ctx2d.globalAlpha = 1;

        // level meter — otherwise nobody would guess distance does anything
        const barX = i === 0 ? 20 : w - 26;
        ctx2d.fillStyle = "rgba(25,25,24,0.08)";
        ctx2d.fillRect(barX, 64, 6, 90);
        ctx2d.fillStyle = tone;
        ctx2d.fillRect(barX, 64 + 90 * (1 - level), 6, 90 * level);

        // the note names, big enough to actually read while playing
        if (sounding.length) {
          const label = sounding.map(noteName).join("  ");
          ctx2d.fillStyle = tone;
          ctx2d.font = '600 30px "Fraunces", Georgia, serif';
          ctx2d.textAlign = i === 0 ? "left" : "right";
          ctx2d.fillText(label, i === 0 ? 20 : w - 20, i === 0 ? 48 : 48);
          ctx2d.textAlign = "left";
        }
      }

      // silence any voice whose hand left the frame
      if (a) {
        for (let i = lms.length; i < 2; i++) {
          for (let f = 0; f < VOICES_PER_HAND; f++) {
            const v = a.voices[i * VOICES_PER_HAND + f];
            v.gain.gain.setTargetAtTime(0, a.ctx.currentTime, 0.05);
            v.note = -1;
          }
        }
      }
      if (!lms.length) {
        ctx2d.fillStyle = "#6B6A64";
        ctx2d.font = '12px "JetBrains Mono", monospace';
        ctx2d.fillText("show your hands — extend fingers to play notes", 16, 26);
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
        description="An instrument played with hand gestures through your webcam. Middle, ring and pinky play notes stacked into chords while thumb and index pinch together as a volume fader, and hand height moves the whole chord up a scale."
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
            into a synthesiser. Middle, ring and pinky play notes — extend them to
            sound, curl them to stop. Your thumb and index pinch together as the
            volume fader, while hand height moves the whole chord up the scale.
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

              <div>
                <div className="font-mono text-xs text-inkmuted mb-1.5">
                  {`finger spacing = ${spacing} ${spacing === 1 ? "step (cluster)" : spacing === 2 ? "steps (chords)" : "steps (wide)"}`}
                </div>
                <input
                  type="range" min={1} max={3} step={1} value={spacing}
                  onChange={(e) => setSpacing(Number(e.target.value))}
                  className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-[#3538CD]"
                  style={{ background: `linear-gradient(to right, #3538CD 0%, #3538CD ${((spacing - 1) / 2) * 100}%, #E6E4DC ${((spacing - 1) / 2) * 100}%, #E6E4DC 100%)` }}
                />
              </div>

              <div>
                <div className="font-mono text-xs text-inkmuted mb-1.5">
                  {`finger sensitivity = ${sens.toFixed(2)}`}
                </div>
                <input
                  type="range" min={0.8} max={1.3} step={0.05} value={sens}
                  onChange={(e) => setSens(Number(e.target.value))}
                  className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-[#3538CD]"
                  style={{ background: `linear-gradient(to right, #3538CD 0%, #3538CD ${((sens - 0.8) / 0.5) * 100}%, #E6E4DC ${((sens - 0.8) / 0.5) * 100}%, #E6E4DC 100%)` }}
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <label className="font-mono text-xs text-inkmuted">pixelate me</label>
                <input
                  type="checkbox"
                  checked={showVideo}
                  onChange={(e) => setShowVideo(e.target.checked)}
                  className="accent-[#3538CD]"
                />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-line space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inkmuted">
                effects
              </p>
              <Knob label={`echo = ${Math.round(echo * 100)}%`} min={0} max={0.6} step={0.02} value={echo} setValue={setEcho} />
              <Knob label={`echo time = ${echoTime.toFixed(2)}s`} min={0.06} max={0.8} step={0.02} value={echoTime} setValue={setEchoTime} />
              <Knob label={`reverb = ${Math.round(reverb * 100)}%`} min={0} max={0.7} step={0.02} value={reverb} setValue={setReverb} />
              <Knob label={`drive = ${Math.round(drive * 100)}%`} min={0} max={1} step={0.02} value={drive} setValue={setDrive} />
              <Knob label={`resonance = ${reso.toFixed(1)}`} min={0.5} max={18} step={0.5} value={reso} setValue={setReso} />
            </div>

            {/* live readout */}
            <div className="mt-5 pt-4 border-t border-line space-y-2">
              {hands.map((hnd, i) => (
                <div key={i} className="font-mono text-[11px]">
                  <span style={{ color: i === 0 ? ACCENT : BLUSH }}>
                    voice {i + 1}
                  </span>{" "}
                  {hnd ? (
                    <span className="ml-2 inline-flex gap-1 align-middle">
                      {["M", "R", "P"].map((f, k) => (
                        <span
                          key={k}
                          className="inline-block px-1 border text-[9px] leading-[1.4]"
                          style={
                            hnd.open[k]
                              ? { borderColor: i === 0 ? ACCENT : BLUSH, color: "#FAF9F5", background: i === 0 ? ACCENT : BLUSH }
                              : { borderColor: "#E6E4DC", color: "#6B6A64" }
                          }
                        >
                          {f}
                        </span>
                      ))}
                      <span
                        className="inline-block px-1 border text-[9px] leading-[1.4] border-line text-inkmuted"
                        title="thumb + index pinch — volume"
                      >
                        {Math.round(hnd.level * 100)}%
                      </span>
                    </span>
                  ) : null}
                  {hnd && hnd.notes.length ? (
                    <span className="text-inkmuted">
                      {hnd.notes.map(noteName).join(" ")} · {Math.round(hnd.cutoff)}Hz ·{" "}
                      {Math.round(hnd.level * 100)}%
                    </span>
                  ) : (
                    <span className="text-inkmuted/50"> —</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-line text-xs text-inkmuted space-y-1.5 leading-relaxed">
              <p>
                <b className="text-ink">Middle, ring and pinky play the notes</b> —
                extend one to sound it, curl it to stop. All three out is a chord;
                a fist is silence. Eight combinations per hand.
              </p>
              <p>
                <b className="text-ink">Thumb and index pinch together as the
                volume fader</b> — squeeze them shut to fade to silence, open them
                out to play full. The dashed line between them thickens as you
                get louder.
              </p>
              <p>
                <b className="text-ink">Raise your hand</b> to move the whole chord
                up the scale. <b className="text-ink">Move sideways</b> to open the
                filter. A closed fist is silence.
              </p>
              <p>
                <b className="text-ink">M R P</b> light up as those fingers play,
                and the percentage is your pinch volume. If a
                finger won't fire, raise <b className="text-ink">sensitivity</b>;
                if they stick on, lower it — hands and cameras genuinely differ.
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

function Knob({
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
  const pct = ((value - min) / (max - min)) * 100;
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
          background: `linear-gradient(to right, #3538CD 0%, #3538CD ${pct}%, #E6E4DC ${pct}%, #E6E4DC 100%)`,
        }}
      />
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
