/**
 * Hand-drawn line icons — 24×24, stroke-based, inherit currentColor.
 * One symbol per section / expertise domain.
 */
import type { CSSProperties } from "react";

type IconProps = { className?: string; style?: CSSProperties };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Software Development — code brackets */
export const IconCode = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M8 6 3 12l5 6" />
    <path d="M16 6l5 6-5 6" />
    <path d="M13.5 4.5 10.5 19.5" />
  </svg>
);

/** Artificial Intelligence — connected neuron nodes */
export const IconNeural = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="5" cy="12" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="19" cy="19" r="2" />
    <circle cx="12" cy="12" r="2.4" />
    <path d="M7 11.4 9.6 12M14.3 10.6 17.2 6.4M14.3 13.4 17.2 17.6" />
  </svg>
);

/** Robot Development — robot head */
export const IconRobot = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="5" y="8" width="14" height="10" rx="2.5" />
    <path d="M12 8V4.5" />
    <circle cx="12" cy="3.5" r="1" />
    <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
    <path d="M2.5 12v3M21.5 12v3" />
  </svg>
);

/** Electrical Engineering — chip with pins */
export const IconChip = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3" />
    <path d="M11.8 10.2 10.8 12.4h2.4l-1 2.2" />
  </svg>
);

/** About — fingerprint arcs */
export const IconFingerprint = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 12a6 6 0 0 1 12 0c0 3-.5 5.5-1.4 7.6" />
    <path d="M9 12a3 3 0 0 1 6 0c0 2.6-.3 5-1 7" />
    <path d="M12 12c0 2.4-.2 4.6-.8 6.6" />
    <path d="M4.5 8.5A8.4 8.4 0 0 1 12 4a8.4 8.4 0 0 1 7.5 4.5" />
  </svg>
);

/** Selected Work — spark / eight-ray star */
export const IconSpark = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    <path d="M5.9 5.9l3.2 3.2M14.9 14.9l3.2 3.2M18.1 5.9l-3.2 3.2M9.1 14.9l-3.2 3.2" />
  </svg>
);

/** Work Experience — winding route between two points */
export const IconRoute = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="5" r="2" />
    <path d="M7 19h7a4 4 0 0 0 0-8H8a4 4 0 0 1 0-8h9" strokeDasharray="0.1 3.4" />
  </svg>
);

/** Education — graduation cap */
export const IconCap = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z" />
    <path d="M7 11.8V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.2" />
    <path d="M21.5 9.5V15" />
  </svg>
);

/** Publications — open book */
export const IconBook = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 6.5C10 4.8 7 4.5 3.5 5v13c3.5-.5 6.5-.2 8.5 1.5 2-1.7 5-2 8.5-1.5V5C17 4.5 14 4.8 12 6.5Z" />
    <path d="M12 6.5v13" />
  </svg>
);

/** Contact — paper plane */
export const IconPlane = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M21 3 3.8 10.3c-.9.4-.8 1.6.1 1.9l6 2 2 6c.3.9 1.5 1 1.9.1L21 3Z" />
    <path d="M21 3 10 14.2" />
  </svg>
);

/** The reward signal — a bicycle, the exact example from the RL post */
export const IconBike = ({ className = "", style }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} style={style} {...base}>
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <circle cx="15" cy="5" r="1" fill="currentColor" stroke="none" />
    <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
  </svg>
);
