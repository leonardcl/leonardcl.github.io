/**
 * An open hand offering a floating globe — drawn in the site's ink-line style,
 * after the engraving reference. The globe levitates and "rotates" (scrolling
 * dashed equator), sparks twinkle around it, and a levitation ring pulses
 * between palm and sphere. Hovering the footer CTA lifts the globe higher.
 */

const INK = "#191918";
const ACCENT = "#3538CD";
const BLUSH = "#D6336C";

const HandGlobe = () => (
  <div className="hand-globe relative select-none" aria-hidden>
    <svg viewBox="0 0 320 400" className="w-full max-w-[320px] mx-auto overflow-visible">
      {/* ── The globe ── */}
      <g className="globe-float">
        {/* halo */}
        <circle cx="160" cy="100" r="66" fill={ACCENT} opacity="0.07" />
        <circle cx="160" cy="100" r="80" fill={ACCENT} opacity="0.04" />

        {/* sphere wireframe */}
        <g fill="none" stroke={ACCENT} strokeWidth="1.6">
          <circle cx="160" cy="100" r="52" />
          {/* meridians */}
          <ellipse cx="160" cy="100" rx="20" ry="52" strokeWidth="1" opacity="0.7" />
          <ellipse cx="160" cy="100" rx="38" ry="52" strokeWidth="1" opacity="0.45" />
          {/* parallels */}
          <ellipse cx="160" cy="100" rx="52" ry="18" strokeWidth="1" opacity="0.45" />
          {/* dashed equator — dash offset scrolls, so the globe feels like it spins */}
          <ellipse
            className="globe-spin-line"
            cx="160"
            cy="100"
            rx="52"
            ry="34"
            strokeWidth="1.3"
            strokeDasharray="5 7"
            opacity="0.9"
          />
        </g>
        {/* highlight arc */}
        <path
          d="M 128 70 A 46 46 0 0 1 158 52"
          fill="none"
          stroke={ACCENT}
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* twinkling sparks */}
        <g stroke={BLUSH} strokeWidth="1.6" strokeLinecap="round">
          <g className="twinkle" style={{ animationDelay: "0s" }}>
            <path d="M 236 52 v 12 M 230 58 h 12" />
          </g>
          <g className="twinkle" style={{ animationDelay: "-1.3s" }}>
            <path d="M 92 34 v 9 M 87.5 38.5 h 9" />
          </g>
          <g className="twinkle" style={{ animationDelay: "-2.4s" }}>
            <path d="M 74 130 v 8 M 70 134 h 8" />
          </g>
        </g>
      </g>

      {/* levitation ring between palm and globe */}
      <ellipse
        className="lev-ring"
        cx="160"
        cy="196"
        rx="34"
        ry="7"
        fill="none"
        stroke={BLUSH}
        strokeWidth="1.2"
        opacity="0.6"
      />

      {/* ── The hand — single contour, palm open to the sky ── */}
      <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {/* outer wrist → back of hand → thumb → web → finger mass → palm → inner wrist */}
        <path
          d="M 258 400
             C 252 352 244 318 224 294
             C 233 281 241 264 244 249
             C 246 240 238 234 231 241
             C 222 251 213 262 203 268
             C 195 262 187 258 179 256
             C 158 243 122 234 98 247
             C 89 252 89 262 97 266
             C 122 276 152 284 172 293
             C 191 302 208 318 216 340
             C 222 358 224 380 224 400"
        />
        {/* finger separations */}
        <path d="M 116 250 C 121 258 127 264 134 268" strokeWidth="1.4" opacity="0.75" />
        <path d="M 136 246 C 141 255 147 261 154 266" strokeWidth="1.4" opacity="0.75" />
        <path d="M 157 246 C 161 255 166 262 172 267" strokeWidth="1.4" opacity="0.75" />
        {/* thumb base crease */}
        <path d="M 203 268 C 199 280 197 290 198 300" strokeWidth="1.4" opacity="0.75" />
        {/* palm crease */}
        <path d="M 180 262 C 186 274 191 286 193 298" strokeWidth="1.2" opacity="0.5" />
      </g>

      {/* engraving hatching — wrist & palm heel */}
      <g stroke={INK} strokeWidth="1" opacity="0.35" strokeLinecap="round">
        <path d="M 230 340 l 16 -7" />
        <path d="M 231 352 l 17 -7" />
        <path d="M 232 364 l 18 -7" />
        <path d="M 233 376 l 18 -6" />
        <path d="M 234 388 l 19 -6" />
        <path d="M 196 310 l 14 -6" />
        <path d="M 199 322 l 14 -6" />
      </g>
    </svg>
  </div>
);

export default HandGlobe;
