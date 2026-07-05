/**
 * Two pixel-art hands reaching toward each other — "let's build something."
 * Pixels materialize in a staggered cascade, a spark pulses between the
 * fingertips, and random pixels glitch-flicker, cyber style.
 * Hovering the footer CTA pulls the hands closer together.
 */

// 12×8 pixel map — a hand pointing right (1 = pixel). Mirrored for the other side.
const HAND: number[][] = [
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
];

const PX = 9; // pixel size in px

const Hand = ({
  mirror,
  color,
}: {
  mirror?: boolean;
  color: string;
}) => (
  <div
    className="grid"
    style={{
      gridTemplateColumns: `repeat(${HAND[0].length}, ${PX}px)`,
      transform: mirror ? "scaleX(-1)" : undefined,
    }}
  >
    {HAND.flatMap((row, r) =>
      row.map((cell, c) => {
        const i = r * row.length + c;
        // deterministic pseudo-random for stagger + flicker variety
        const seed = ((i * 2654435761) >>> 0) % 1000;
        return (
          <span
            key={i}
            className={cell ? "pixel-cell" : ""}
            style={
              cell
                ? {
                    width: PX,
                    height: PX,
                    backgroundColor: color,
                    animationDelay: `${300 + seed}ms, ${2000 + seed * 7}ms`,
                  }
                : { width: PX, height: PX }
            }
          />
        );
      })
    )}
  </div>
);

const PixelHands = () => (
  <div className="pixel-hands flex items-center justify-center gap-3 select-none" aria-hidden>
    {/* Left hand — ink, reaching right */}
    <div className="pixel-hand-left transition-transform duration-500 ease-out">
      <Hand color="#191918" />
    </div>

    {/* The spark */}
    <div className="relative w-5 h-5 -mt-6 shrink-0">
      <span className="spark-core absolute inset-0 rotate-45 bg-blush" />
      <span className="spark-halo absolute -inset-2 rotate-45 border border-blush/50" />
    </div>

    {/* Right hand — ultramarine, reaching left */}
    <div className="pixel-hand-right transition-transform duration-500 ease-out">
      <Hand color="#3538CD" mirror />
    </div>
  </div>
);

export default PixelHands;
