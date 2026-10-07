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
      "Autonomous navigation and person-following for a trolley robot, driven by UWB distance and bearing and tuned on the real hardware.",
      "Designed its control electronics in KiCad: an ESP32 board with dual UWB, CAN, RS-485 and relay outputs, taken to fab-ready Gerbers.",
      "Traced a CCTV safety system's vest-colour errors to automatic white balance fighting a yellow floor, and corrected the colour pipeline rather than the model.",
    ],
  },
  {
    dates: "2022 — 2025",
    title: "AI Research Assistant",
    org: "Dongseo University",
    points: [
      "First author of SIGHT, attention-guided state prediction for partially observable reinforcement learning, in ACM TIST (2026).",
      "Co-built two retrieval-augmented systems published as journal papers: SKYRAG in IEEE Access and Pic2Plate in Sensors.",
      "First author of a benchmark of reinforcement learning algorithms for stock trading (ICATI 2024).",
    ],
  },
  {
    dates: "2021 —",
    title: "Programming Tutor",
    org: "IT Smart",
    points: [
      "Teach Python, robotics and machine vision to students from elementary school to undergraduate, with course materials I wrote.",
      "Built and run the school's online coding placement test.",
    ],
  },
  {
    dates: "2019 — 2022",
    title: "Electronics Lab Assistant",
    org: "Petra Christian University",
    points: [
      "Ran undergraduate practicums in electronics, robotics and microcontrollers.",
      "Built and deployed IoT systems for smart devices.",
    ],
  },
];

export const education: ExperienceItem[] = [
  {
    dates: "2022 — 2025",
    title: "M.Sc, Computer Engineering",
    org: "Dongseo University",
    points: [
      "Specialized in reinforcement learning, computer vision, and LLMs.",
    ],
  },
  {
    dates: "2018 — 2022",
    title: "S.T., Electrical Engineering",
    org: "Petra Christian University",
    points: [
      "Robotics, electronics, computer vision. Thesis: emotion monitoring for online classes.",
    ],
  },
];
