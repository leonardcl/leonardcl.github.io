import { useState } from "react";

const Career = () => {
  const [activeCard, setActiveCard] = useState(null); // Tracks the active (expanded) card

  const careerData = [
    {
      id: 1,
      title: "Robotics Software Engineer",
      company: "WaveAI",
      dates: "2025 - Present",
      description: [
        "Developed robotic software for autonomous navigation and object detection.",
        "Collaborated with the hardware team to integrate the software with the hardware.",
        "Developed and enhanced algorithm for person following robot."
      ]
    },
    {
      id: 2,
      title: "Online Programming Tutor",
      company: "IT Smart",
      dates: "2021 - Present",
      description: [
        "Designed comprehensive curricula for Python programming at basic, intermediate, and advanced levels.",
        "Developed learning materials for Machine Vision applications.",
        "Taught students across various educational levels, ranging from elementary to undergraduate."
      ]
    },
    {
      id: 3,
      title: "AI Research Assistant",
      company: "Dongseo University",
      dates: "2022 - 2025",
      description: [
        "Developed advanced reinforcement learning (RL) algorithms and a Retrieval-Augmented Generation (RAG) system.",
        "Shared knowledge on Reinforcement Learning, Large Language Models (LLMs), and Generative Models with labmates.",
        "Collaborated with cross-functional teams to design and deploy AI systems.",
        "Published research papers on RL and LLM advancements."
      ]
    },
    {
      id: 4,
      title: "Electronics Laboratory Assistant",
      company: "Petra Christian University",
      dates: "2019 - 2022",
      description: [
        "Built and deployed IoT systems for smart devices.",
        "Supervised and tutored students in Basic Electronics, Robotics, and Microcontroller Practicum.",
        "Developed educational materials on computer vision and robotics."
      ]
    }
    
  ];

  const toggleCard = (id: any) => {
    setActiveCard(activeCard === id ? null : id); // Collapse if the same card is clicked
  };

  return (
    <div id="career" className="mt-20 w-full ">
      <div className="group relative">
            <div className="absolute w-full py-1 bottom-0 inset-x-0 text-white text-3xl sm:text-5xl leading-4 font-semibold font-quicksand">
                <span className="group">my journey?</span>
                </div>
            <div className="group text-6xl font-bold font-sans sm:text-9xl">
                <p className="">
                    <span className="text-gray-800 transition-all duration-400 ease-in-out hover:text-cyan-400 group-hover:text-cyan-400">Career</span>
                    </p>
                </div>
        </div>

        <div className="mt-20"></div>

      {/* Cards: One per Row */}
      <div className="space-y-8 mx-6 md:mx-40 font-quicksand">
        {careerData.map((job) => (
          <div
            key={job.id}
            className="text-left mx-auto xl:max-w-[48%] bg-gray-900 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => toggleCard(job.id)}
          >
            {/* Job Title */}
            {activeCard === job.id && (
            <div>
                <h3 className="text-3xl font-semibold text-pink-600">{job.title}</h3>
                <p className="text-xl text-gray-200">{job.company}</p>
                <p className="text-sm text-gray-400">{job.dates}</p>
            </div>
            )}
            {activeCard != job.id && (
            <div>
                <h3 className="text-3xl font-semibold text-pink-600">{job.title}</h3>
                <p className="text-xl text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">{job.dates}</p>
            </div>
            )}

            {/* Expandable Description */}
            {activeCard === job.id && (
                
              <div className="text-xl mt-4 text-gray-200">
                <ul className="list-disc list-inside space-y-2">
                  {job.description.map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Career;
