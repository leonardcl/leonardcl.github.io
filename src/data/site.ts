// ── Site-wide content. Edit freely — everything here is plain text. ──

export const site = {
  name: "Leonard Christopher Limanjaya",
  shortName: "leonardcl",
  role: "engineer & founder",
  // Hero kicker — a plain role line; the motto lives only in the hero quote.
  // Non-breaking spaces keep "· South Korea" from splitting on a phone.
  kicker: "robotics & AI engineer\u00a0· South\u00a0Korea",
  // One confident sentence. This is the first thing every visitor reads.
  tagline:
    "I build intelligent systems — robots, AI products, and the studio that ships them.",
  motto: ["Turn curiosity into systems;", "turn systems into impact."],
  email: "leonardchristopher002@gmail.com",
  github: "https://github.com/leonardcl",
  linkedin: "https://id.linkedin.com/in/leonardcl",
  scholar: "https://scholar.google.com/citations?user=EZZXGykAAAAJ",
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

// ── About — short bio + the four domains. ──
export const about = {
  bio: [
    "I live where robotics, machine learning, and AI meet — researching reinforcement learning, shipping AI products, and building robots that work outside the lab.",
    "I learn by building. Every project, paper, and late-night experiment feeds the same loop: understand a system deeply, then push it somewhere it hasn't been.",
  ],
  expertise: [
    {
      title: "Software Development",
      note: "Python, C/C++, JavaScript & TypeScript — functional and OOP, from scripts to products.",
    },
    {
      title: "Artificial Intelligence",
      note: "Computer vision, reinforcement learning, LLMs, RAG, and finance applications.",
    },
    {
      title: "Robot Development",
      note: "UR3, ROS2, Gazebo, OpenAI Gym — simulation to real hardware.",
    },
    {
      title: "Electrical Engineering",
      note: "Embedded software, IoT, industrial automation, and PLC.",
    },
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
