import { useEffect, useRef, useState } from "react";
import Nav from "./v2/Nav";
import FooterV2 from "./v2/FooterV2";

/**
 * Pixel Camera — your webcam, redrawn in the site's visual language.
 * The feed is sampled on a coarse grid; each cell becomes a square or a
 * mono digit (0/1), toned bone→periwinkle→ultramarine by brightness —
 * the same digitization effect as the footer's hand.
 * Everything stays in the browser; nothing is recorded or sent anywhere.
 */

export default function PixelCam() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState(12);
  const [mode, setMode] = useState<"squares" | "digits" | "mixed">("mixed");
  const [invert, setInvert] = useState(false);
  const [digitRatio, setDigitRatio] = useState(75); // % of cells drawn as digits in mixed mode
  const opts = useRef({ pixelSize, mode, invert, digitRatio });
  opts.current = { pixelSize, mode, invert, digitRatio };

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setRunning(true);
    } catch {
      setError("Camera unavailable — check browser permissions.");
    }
  };

  const stop = () => {
    const video = videoRef.current;
    if (video?.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    setRunning(false);
  };

  useEffect(() => stop, []); // release camera on unmount

  // Render loop
  useEffect(() => {
    if (!running) return;
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    const buf = document.createElement("canvas");
    const bctx = buf.getContext("2d", { willReadFrequently: true })!;
    let raf = 0;

    const tick = () => {
      const { pixelSize, mode, invert, digitRatio } = opts.current;
      const w = wrap.clientWidth - 2;
      const h = Math.floor((w * 3) / 4);
      if (canvas.width !== w) { canvas.width = w; canvas.height = h; }

      const cols = Math.max(8, Math.floor(w / pixelSize));
      const rows = Math.max(6, Math.floor(h / pixelSize));
      buf.width = cols;
      buf.height = rows;
      // mirror like a mirror should
      bctx.save();
      bctx.translate(cols, 0);
      bctx.scale(-1, 1);
      bctx.drawImage(video, 0, 0, cols, rows);
      bctx.restore();
      const data = bctx.getImageData(0, 0, cols, rows).data;

      ctx.fillStyle = "#FAF9F5";
      ctx.fillRect(0, 0, w, h);
      const cw = w / cols;
      const ch = h / rows;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${Math.floor(ch * 0.9)}px "JetBrains Mono", monospace`;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4;
          let lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          if (invert) lum = 1 - lum;
          const dark = 1 - lum; // 0 = bright, 1 = dark
          if (dark < 0.18) continue; // bright cells stay bone — negative space
          // tone: periwinkle → ultramarine → ink by darkness
          const tone =
            dark > 0.78 ? "#191918" : dark > 0.55 ? "#3538CD" : dark > 0.35 ? "#8A8FF2" : "#C9CCF8";
          const seed = ((r * 73856093) ^ (c * 19349663)) >>> 0;
          const asDigit =
            mode === "digits" ? true : mode === "squares" ? false : seed % 100 < digitRatio;
          ctx.fillStyle = seed % 61 === 0 ? "#D6336C" : tone; // rare blush bit
          if (asDigit) {
            ctx.fillText(String(seed % 2), c * cw + cw / 2, r * ch + ch / 2);
          } else {
            const s = cw * (0.35 + dark * 0.55);
            ctx.fillRect(c * cw + (cw - s) / 2, r * ch + (ch - s) / 2, s, s);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const btn =
    "font-mono text-xs px-3 py-2 border border-line text-ink hover:border-accent hover:text-accent transition-colors bg-bone";

  return (
    <div className="min-h-screen bg-bone text-ink font-sans">
      <Nav />
      <main className="max-w-site mx-auto px-6 sm:px-10 pt-32 pb-24">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
              playground · see yourself digitized
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl text-ink font-medium leading-tight rise-blur">
            Pixel <em className="font-light text-blush">camera</em>
          </h1>
          <p className="mt-4 max-w-2xl text-inkmuted leading-relaxed">
            Your webcam, redrawn as this site's pixels and binary digits.
            Everything runs locally in your browser — nothing is recorded,
            stored, or sent anywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div ref={wrapRef} className="md:col-span-2 border border-line overflow-hidden bg-bone relative">
            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas ref={canvasRef} className="block w-full" />
            {!running && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 min-h-[380px]">
                <p className="font-mono text-sm text-inkmuted">camera is off</p>
                <button
                  className="font-mono text-xs px-5 py-2.5 border border-ink bg-ink text-bone hover:bg-accent hover:border-accent transition-colors"
                  onClick={start}
                >
                  start camera ▸
                </button>
                {error && <p className="font-mono text-xs text-blush">{error}</p>}
              </div>
            )}
          </div>

          <div className="border border-line p-5 bg-bone h-fit">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-inkmuted mb-4">
              controls
            </p>
            <div className="space-y-4">
              <div className="flex gap-2">
                {running ? (
                  <button className={btn} onClick={stop}>stop camera</button>
                ) : (
                  <button className={btn} onClick={start}>start camera</button>
                )}
              </div>
              <div>
                <div className="font-mono text-xs text-inkmuted mb-1.5">{`pixel size = ${pixelSize}px`}</div>
                <input
                  type="range" min={6} max={28} step={1} value={pixelSize}
                  onChange={(e) => setPixelSize(Number(e.target.value))}
                  className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-[#3538CD]"
                  style={{ background: `linear-gradient(to right, #3538CD 0%, #3538CD ${((pixelSize - 6) / 22) * 100}%, #E6E4DC ${((pixelSize - 6) / 22) * 100}%, #E6E4DC 100%)` }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {(["mixed", "squares", "digits"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
                      mode === m ? "border-accent text-accent" : "border-line text-inkmuted hover:text-ink"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {mode === "mixed" && (
                <div>
                  <div className="font-mono text-xs text-inkmuted mb-1.5">{`digits = ${digitRatio}% · squares = ${100 - digitRatio}%`}</div>
                  <input
                    type="range" min={0} max={100} step={5} value={digitRatio}
                    onChange={(e) => setDigitRatio(Number(e.target.value))}
                    className="w-full h-[3px] rounded-full appearance-none cursor-pointer accent-[#3538CD]"
                    style={{ background: `linear-gradient(to right, #3538CD 0%, #3538CD ${digitRatio}%, #E6E4DC ${digitRatio}%, #E6E4DC 100%)` }}
                  />
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <label className="font-mono text-xs text-inkmuted">invert</label>
                <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} className="accent-[#3538CD]" />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-line text-xs text-inkmuted space-y-1.5 leading-relaxed">
              <p>Bright areas stay bone (negative space); shadows become ink, midtones ultramarine — with the occasional blush bit.</p>
              <p className="text-blush/80">the same digitization as the hand in the footer ✳</p>
            </div>
          </div>
        </div>
      </main>
      <FooterV2 />
    </div>
  );
}
