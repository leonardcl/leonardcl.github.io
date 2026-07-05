// ── Site-wide content. Edit freely — everything here is plain text. ──

export const site = {
  name: "Leonard Christopher",
  shortName: "leonardcl",
  role: "engineer & founder",
  // One confident sentence. This is the first thing every visitor reads.
  tagline:
    "I build intelligent systems — robots, AI products, and the studio that ships them.",
  motto: ["Turn curiosity into systems;", "turn systems into impact."],
  email: "leonardchristopher002@gmail.com",
  github: "https://github.com/leonardcl",
  linkedin: "https://id.linkedin.com/in/leonardcl",
  // Shown as a single mono line under the hero — the old "Expertise" cards, distilled.
  capabilities: [
    "machine learning",
    "reinforcement learning",
    "robotics · ROS2",
    "LLM · RAG",
    "computer vision",
    "embedded · IoT",
  ],
};

// ── "Now / Building" — what you're actively working on. Keep to 2–3 items. ──
export type NowItem = {
  label: string; // mono kicker, e.g. "founder" / "engineer"
  title: string;
  description: string;
  link?: string;
};

export const now: NowItem[] = [
  {
    label: "founder",
    title: "ProjekinAja",
    description:
      "An AI-native build studio — I design and ship software products end-to-end, turning ideas into working systems with small, fast teams.",
  },
  {
    label: "engineer",
    title: "Robotics Software @ WaveAI",
    description:
      "Autonomous navigation, object detection, and person-following algorithms — robotic software that works outside the lab.",
  },
];
