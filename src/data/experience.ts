export type ExperienceItem = {
  dates: string;
  title: string;
  org: string;
  points: string[];
};

export const career: ExperienceItem[] = [
  {
    dates: "2025 —",
    title: "Robotics Software Engineer",
    org: "WaveAI",
    points: [
      "Robotic software for autonomous navigation and object detection.",
      "Person-following algorithms, developed and tuned on real hardware.",
      "Hardware–software integration with the mechanical team.",
    ],
  },
  {
    dates: "2022 — 2025",
    title: "AI Research Assistant",
    org: "Dongseo University",
    points: [
      "Reinforcement learning algorithms and a RAG system; published research on both.",
      "Knowledge-sharing on RL, LLMs, and generative models across the lab.",
      "Designed and deployed AI systems with cross-functional teams.",
    ],
  },
  {
    dates: "2021 —",
    title: "Programming Tutor",
    org: "IT Smart",
    points: [
      "Python curricula from basic to advanced; machine-vision course materials.",
      "Students from elementary to undergraduate level.",
    ],
  },
  {
    dates: "2019 — 2022",
    title: "Electronics Lab Assistant",
    org: "Petra Christian University",
    points: [
      "Built and deployed IoT systems for smart devices.",
      "Supervised practicums in electronics, robotics, and microcontrollers.",
    ],
  },
];

export const education: ExperienceItem[] = [
  {
    dates: "2022 — 2025",
    title: "M.Eng, Computer Engineering",
    org: "Dongseo University",
    points: [
      "Specialized in reinforcement learning, computer vision, and LLMs.",
    ],
  },
  {
    dates: "2018 — 2022",
    title: "B.Eng, Electrical Engineering",
    org: "Petra Christian University",
    points: [
      "Robotics, electronics, computer vision. Thesis: emotion monitoring for online classes.",
    ],
  },
];
