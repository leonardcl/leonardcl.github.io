import { useState, useEffect } from "react";

type Tag = {
  id: number;
  skill: string;
  top: string;
  left: string;
  duration: number;
  color: string;
  fontSize: string;
  opacity: number;
  scale: number;
  rotation: number;
  path: number;
  pathProgress: number;
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

  // Beautiful vibrant colors but more sophisticated - no borders, using your color palette
  const colors = [
    "bg-sky-600 text-white",
    "bg-emerald-600 text-white",
    "bg-pink-600 text-white",
    "bg-amber-600 text-white",
    "bg-indigo-600 text-white",
    "bg-rose-600 text-white",
  ];

  const MAX_TAGS = 10;
  const [tags, setTags] = useState<Tag[]>([]);
  const [hoveredTag, setHoveredTag] = useState<number | null>(null);

  // Simple, smooth floating paths
  const createFloatingPath = (id: number) => {
    const paths = [
      // Simple circular path
      (progress: number) => ({
        top: 50 + 20 * Math.sin(progress * Math.PI * 2),
        left: 50 + 20 * Math.cos(progress * Math.PI * 2),
      }),
      // Simple horizontal wave
      (progress: number) => ({
        top: 50 + 15 * Math.sin(progress * Math.PI * 2),
        left: 20 + 50 * progress,
      }),
      // Simple vertical wave
      (progress: number) => ({
        top: 20 + 50 * progress,
        left: 50 + 15 * Math.cos(progress * Math.PI * 2),
      }),
    ];
    
    return paths[id % paths.length];
  };

  const generateRandomTag = (id: number, existingPositions: { top: number; left: number }[]) => {
    let isOverlapping = true;
    let top = 0;
    let left = 0;

    while (isOverlapping) {
      top = Math.random() * 60 + 20; // 20–80%
      left = Math.random() * 70; // 0–80%

      isOverlapping = existingPositions.some((pos) => {
        const distance = Math.sqrt(Math.pow(pos.left - left, 2) + Math.pow(pos.top - top, 2));
        return distance < 18;
      });
    }

    existingPositions.push({ top, left });

    return {
      id,
      skill: skills[id % skills.length],
      top: `${top}%`,
      left: `${left}%`,
      duration: Math.random() * 8 + 12, // Good speed from before
      color: colors[Math.floor(Math.random() * colors.length)],
      fontSize: `${Math.random() * 0.5 + 0.8}rem`,
      opacity: 1, // Make tags visible immediately
      scale: 1, // Start at full size
      rotation: Math.random() * 360, // Bring back rotation!
      path: Math.floor(Math.random() * 3),
      pathProgress: Math.random(),
    };
  };

  const updateTagPosition = (tag: Tag) => {
    const path = createFloatingPath(tag.path);
    const newProgress = (tag.pathProgress + 0.0008) % 1;
    const newPosition = path(newProgress);
    
    return {
      ...tag,
      top: `${newPosition.top}%`,
      left: `${newPosition.left}%`,
      pathProgress: newProgress,
      rotation: tag.rotation + 0.3, // Gentle rotation as it moves
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

  // Initialize tags immediately
  useEffect(() => {
    const positions: { top: number; left: number }[] = [];
    const initialTags = Array.from({ length: MAX_TAGS }).map((_, id) =>
      generateRandomTag(id, positions)
    );

    setTags(initialTags);
  }, []);

  // Fixed animation loop - back to working version
  useEffect(() => {
    if (tags.length === 0) return; // Don't animate until tags exist
    
    const animationInterval = setInterval(() => {
      setTags(prev => prev.map(updateTagPosition));
    }, 50); // Back to 50ms for smooth movement

    return () => clearInterval(animationInterval);
  }, [tags]);

  // Reset tags periodically
  useEffect(() => {
    if (tags.length === 0) return; // Don't reset until tags exist
    
    const timeouts = tags.map((tag) =>
      setTimeout(() => resetTag(tag.id), tag.duration * 1000)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [tags]);

  return (
    <div id="home" className="h-screen w-full font-quicksand">
      <div className="flex flex-row">
        <div className="md:w-2/3 xl:w-1/2 text-gray-200 text-left p-10 pt-40 md:pt-80 pb-40 md:p-40 md:pb-40">
          <p className="text-2xl animate-on-scroll animate-fade-in-up animate-delay-100">Hello, I am</p>
          <div className="p-1 mb-5 animate-on-scroll animate-fade-in-up animate-delay-200">
            <h2 className="text-5xl xs:text-7xl sm:text-8xl font-bold text-gray-100 font-sans">
              <span className="text-cyan-400">L</span>eonard<br />Christopher
            </h2>
          </div>
          <div className="max-w-screen-sm animate-on-scroll animate-fade-in-up animate-delay-300">
            <p className="text-gray-400 font-sans max-w-100 font-quicksand">
              I am deeply passionate about the dynamic fields of robotics, machine learning, and artificial intelligence (AI). Currently I'm researching on Reinforcement Learning.
            </p>
          </div>
          <div className="flex space-x-4 mt-40 md:pt-20"></div>
          <a href="#about" className="bg-inhirit tracking-[.40em] text-gray-200 px-2 py-2 mt-4 hover:bg-cyan-400 border-b-2 border-cyan-400 hover:font-semibold transition-all duration-250 ease-in-out bg-inhirit group hover-lift hover-glow animate-on-scroll animate-fade-in-up animate-delay-400">
            <span className="w-full text-left transition-colors duration-150 ease-in-out group-hover:text-gray-800">SCROLL FOR MORE</span>
          </a>
          <div className="hidden md:flex md:w-1/3 xl:w-1/2 items-center justify-center"></div>
        </div>

        <div className="hidden md:flex md:w-1/3 xl:w-1/2 relative overflow-hidden mx-20">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className={`absolute px-4 py-2 rounded-full font-semibold cursor-pointer transition-all duration-500 ease-out shadow-lg ${
                tag.color
              } ${
                hoveredTag === tag.id 
                  ? 'scale-125 shadow-2xl z-10' 
                  : 'scale-100 hover:scale-110'
              }`}
              style={{
                top: tag.top,
                left: tag.left,
                fontSize: tag.fontSize,
                opacity: tag.opacity,
                transform: `scale(${tag.scale}) rotate(${tag.rotation}deg)`,
                filter: hoveredTag === tag.id ? 'brightness(1.2) saturate(1.1)' : 'brightness(1)',
                boxShadow: hoveredTag === tag.id 
                  ? tag.color.includes('sky') ? '0 0 30px rgba(14, 165, 233, 0.5)' :
                    tag.color.includes('emerald') ? '0 0 30px rgba(16, 185, 129, 0.5)' :
                    tag.color.includes('pink') ? '0 0 30px rgba(219, 39, 119, 0.5)' :
                    tag.color.includes('amber') ? '0 0 30px rgba(245, 158, 11, 0.5)' :
                    tag.color.includes('indigo') ? '0 0 30px rgba(99, 102, 241, 0.5)' :
                    '0 0 30px rgba(244, 63, 94, 0.5)'
                  : '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={() => setHoveredTag(tag.id)}
              onMouseLeave={() => setHoveredTag(null)}
              onClick={() => {
                console.log(`Clicked: ${tag.skill}`);
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
