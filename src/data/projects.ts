import skyragCover from "../assets/skyrag_cover.png";
import pic2plateImage from "../assets/pic2plate_image.png";
import rlMario from "../assets/rl_mario.png";
import dingdongCover from "../assets/dingdongCover.png";
import smartGarden from "../assets/smartGarden.png";

export type Project = {
  title: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
  year: string;
};

// Curated order — strongest work first.
export const projects: Project[] = [
  {
    title: "SKYRAG",
    description:
      "A keyword-separated RAG system that generates personalized learning paths with LLMs — built to kill hallucination and irrelevance in educational retrieval. Published in IEEE Access.",
    link: "https://github.com/leonardcl/skyrag",
    image: skyragCover,
    tags: ["LLM", "RAG", "education"],
    year: "2024",
  },
  {
    title: "Pic2Plate",
    description:
      "Point a camera at your ingredients, get a recipe. Vision-language ingredient detection + retrieval-augmented recipe generation, with nutrition and dietary preferences built in. Published in Sensors (MDPI).",
    link: "https://github.com/leonardcl/pic2plate",
    image: pic2plateImage,
    tags: ["vision-language", "RAG", "recommendation"],
    year: "2024",
  },
  {
    title: "Reinforcement Learning Retro",
    description:
      "Teaching agents to beat Super Mario Bros and Felix the Cat with DQN and A2C — a hands-on study of what actually makes deep RL converge.",
    link: "https://github.com/leonardcl/reinforcement-learning-retro",
    image: rlMario,
    tags: ["reinforcement learning", "DQN", "A2C"],
    year: "2024",
  },
  {
    title: "DingDong — Student Engagement Analysis",
    description:
      "Real-time emotion and behavior detection over webcam to measure student engagement in online classes. Desktop app, OpenCV pipeline.",
    link: "https://github.com/leonardcl/dingdong-fer",
    image: dingdongCover,
    tags: ["emotion recognition", "OpenCV", "desktop"],
    year: "2024",
  },
  {
    title: "Smart Garden IoT",
    description:
      "Soil, temperature, and light sensing with automated irrigation and lighting — ESP32 hardware, web dashboard, and an Android app.",
    link: "https://github.com/leonardcl/smart-garden",
    image: smartGarden,
    tags: ["IoT", "ESP32", "Android"],
    year: "2024",
  },
];
