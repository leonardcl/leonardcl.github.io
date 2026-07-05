/**
 * The skill system — a hand-built orbital graphic.
 * Skills orbit a pulsing core on three rings: slow, counter-rotating, slower.
 * Labels counter-rotate so they stay upright. Hovering a ring pauses it.
 * The whole system follows the cursor with per-ring parallax depth.
 */

type Ring = {
  radius: number; // px
  duration: number; // seconds per revolution
  reverse?: boolean;
  depth: number; // cursor parallax strength
  tone: "accent" | "blush";
  skills: string[];
};

const rings: Ring[] = [
  {
    radius: 105,
    duration: 42,
    depth: 30,
    tone: "blush",
    skills: ["Machine Learning", "Robotics", "AI Products"],
  },
  {
    radius: 180,
    duration: 64,
    reverse: true,
    depth: 20,
    tone: "accent",
    skills: ["Reinforcement Learning", "Computer Vision", "LLM · RAG", "Python"],
  },
  {
    radius: 255,
    duration: 90,
    depth: 12,
    tone: "accent",
    skills: ["TypeScript", "ROS2", "IoT · Embedded", "Electrical Eng", "Education"],
  },
];

const OrbitSkills = ({ offset }: { offset: { x: number; y: number } }) => (
  <div className="relative h-[560px] w-full select-none" aria-hidden>
    {rings.map((ring) => (
      <div
        key={ring.radius}
        className="orbit-group absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `translate(${offset.x * ring.depth}px, ${offset.y * ring.depth}px)`,
        }}
      >
        {/* Ring outline */}
        <div
          className={`absolute left-1/2 top-1/2 rounded-full border border-dashed ${
            ring.tone === "blush" ? "border-blush/25" : "border-accent/20"
          }`}
          style={{
            width: ring.radius * 2,
            height: ring.radius * 2,
            marginLeft: -ring.radius,
            marginTop: -ring.radius,
          }}
        />

        {/* Spinner — carries the skills around */}
        <div
          className={`orbit-spin absolute left-1/2 top-1/2 ${ring.reverse ? "reverse" : ""}`}
          style={{ animationDuration: `${ring.duration}s` }}
        >
          {ring.skills.map((skill, i) => {
            const angle = (360 / ring.skills.length) * i;
            return (
              <div
                key={skill}
                className="absolute"
                style={{ transform: `rotate(${angle}deg) translateX(${ring.radius}px)` }}
              >
                <div
                  className="orbit-counter"
                  style={{ animationDuration: `${ring.duration}s` }}
                >
                  <span
                    className={`block font-mono text-xs whitespace-nowrap border rounded-full px-3.5 py-1.5 backdrop-blur-sm cursor-default transition-all duration-300
                      ${
                        ring.tone === "blush"
                          ? "bg-bone/80 text-ink border-blush/40 hover:bg-blush hover:text-bone hover:border-blush hover:shadow-lg hover:shadow-blush/25"
                          : "bg-bone/80 text-ink border-line hover:bg-accent hover:text-bone hover:border-accent hover:shadow-lg hover:shadow-accent/25"
                      }`}
                    style={{ transform: `translate(-50%, -50%) rotate(${-angle}deg)` }}
                  >
                    {skill}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ))}

    {/* Core */}
    <div
      className="absolute inset-0 transition-transform duration-500 ease-out"
      style={{ transform: `translate(${offset.x * 40}px, ${offset.y * 40}px)` }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="relative">
          <span className="core-pulse absolute inset-0 rounded-full bg-accent/30" />
          <span className="relative block h-3 w-3 rounded-full bg-accent" />
        </div>
        <span className="mt-3 font-display italic text-ink/60 text-lg">systems</span>
      </div>
    </div>
  </div>
);

export default OrbitSkills;
