import { RefObject, useEffect, useRef } from "react";

/**
 * Calls `tick(dt)` every animation frame, but only while `ref` is on screen.
 * An element hidden by a breakpoint (display: none) never intersects, so a
 * desktop-only animation costs a phone nothing, and a hero animation stops
 * once it has been scrolled past. `dt` is in seconds, capped at 50 ms.
 */
export function useFrameWhileVisible(
  ref: RefObject<Element>,
  tick: (dt: number) => void
) {
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      tickRef.current(Math.min((now - last) / 1000, 0.05));
      last = now;
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

/** True when the visitor asked the OS for less motion. Read once per mount. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
