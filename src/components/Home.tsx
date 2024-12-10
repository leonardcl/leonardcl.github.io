import { useState, useEffect } from "react";

type Tag = {
  id: number;
  skill: string;
  top: string;
  left: string;
  duration: number;
  color: string;
  fontSize: string;
};

const Home = () => {
  const skills = [
    "Python",
    "Machine Learning",
    "Robotics",
    "Artificial Intelligence",
    "Reinforcement Learning",
    "Computer Vision",
    "TypeScript",
    "Electrical Engineering",
    "JavaScript",
    "Large Language Model",
    "Retrieval Augmented Generation",
    "POMDP",
    "Education",
    "Financial Application",
  ];

  const colors = [
    "bg-sky-950 text-sky-400",
    "bg-lime-950 text-lime-400",
    "bg-pink-950 text-pink-400",
    "bg-yellow-950 text-yellow-400",
  ];

  const MAX_TAGS = 10; // Limit number of tags
  const minDistance = 10;

  const [tags, setTags] = useState<Tag[]>([]);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const generateRandomTag = (id: number, existingPositions: { top: number; left: number }[]) => {
    let isOverlapping = true;
    let top = 0;
    let left = 0;

    while (isOverlapping) {
      top = Math.random() * 60 + 20; // 20–80%
      left = Math.random() *70; // 0–80%

      isOverlapping = existingPositions.some((pos) => {
        const distance = calculateDistance(pos.left, pos.top, left, top);
        return distance < minDistance;
      });
    }

    existingPositions.push({ top, left });

    return {
      id,
      skill: skills[id % skills.length],
      top: `${top}%`,
      left: `${left}%`,
      duration: Math.random() * 5 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      fontSize: `${Math.random() * 0.8 + 0.8}rem`,
    };
  };

  const resetTag = (id: number) => {
    setTags((prevTags) => {
      const positions = prevTags.map((tag) => ({
        top: parseFloat(tag.top),
        left: parseFloat(tag.left),
      }));

      const updatedTag = generateRandomTag(id, positions);
      return prevTags.map((tag) => (tag.id === id ? updatedTag : tag));
    });
  };

  useEffect(() => {
    const positions: { top: number; left: number }[] = [];
    const initialTags = Array.from({ length: MAX_TAGS }).map((_, id) =>
      generateRandomTag(id, positions)
    );

    setTags(initialTags);
  }, []);

  useEffect(() => {
    const timeouts = tags.map((tag) =>
      setTimeout(() => resetTag(tag.id), tag.duration * 1000)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [tags]);

  return (
    <div id="home" className="h-screen w-full font-quicksand">
      <div className="flex flex-row">
        <div className="md:w-2/3 xl:w-1/2 text-gray-200 text-left p-10 pt-40 md:pt-80 pb-40 md:p-40 md:pb-40">
          <p className="text-2xl">Hello, I am</p>
          <div className="p-1 mb-5">
            <h2 className="text-5xl xs:text-7xl sm:text-8xl font-bold text-gray-100 font-sans">
              <span className="text-cyan-400">L</span>eonard<br />Christopher
            </h2>
          </div>
          <div className="max-w-screen-sm">
            <p className="text-gray-400 font-sans max-w-100 font-quicksand">
              I am deeply passionate about the dynamic fields of robotics, machine learning, and artificial intelligence (AI). Currently I'm researching on Reinforcement Learning.
            </p>
          </div>
          <div className="flex space-x-4 mt-40 md:mt-20"></div>
                <a href="#about" className="bg-inhirit tracking-[.40em] text-gray-200 px-2 py-2 mt-4 hover:bg-cyan-400 border-b-2 border-cyan-400 hover:font-semibold transition-all duration-250 ease-in-out bg-inhirit group">
                <span className="w-full text-left transition-colors duration-150 ease-in-out group-hover:text-gray-800">SCROLL FOR MORE</span></a>
                <div className="hidden md:flex md:w-1/3 xl:w-1/2 items-center justify-center"></div>
        
        </div>

        <div className="hidden md:flex md:w-1/3 xl:w-1/2 relative overflow-hidden mx-20">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={`absolute px-3 py-1 rounded-full shadow-lg font-semibold ${tag.color} animate-fade`}
              style={{
                top: tag.top,
                left: tag.left,
                fontSize: tag.fontSize,
                animationDuration: `${tag.duration}s`,
              }}
            >
              {tag.skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
