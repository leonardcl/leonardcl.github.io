import { Link } from "react-router-dom"

import rlMario from "../assets/rl_mario.png";
import skyragCover from "../assets/skyrag_cover.png";
import smartGarden from "../assets/smartGarden.png";
import dingdongCover from "../assets/dingdongCover.png";
import pic2plate_image from "../assets/pic2plate_image.png";

const Projects = () => {
    const projects = [
        {
          id: 1,
          title: "SKYRAG: Separated Keyword Retrieval Augmentation Generation System",
          description:
            "SKYRAG is an AI-driven system designed to generate personalized learning paths by integrating advanced retrieval mechanisms with Large Language Models (LLMs). It addresses the common challenges of hallucinations and content irrelevance in traditional LLMs, offering a more precise and tailored educational experience.",
          uploaded: "2024-08-14",
          author: "Leonard Christopher",
          link: "https://github.com/leonardcl/skyrag",
          image: skyragCover,
          tags: ["LLM", "RAG", "Education", "Learning Path Generation"],
        },
        {
          id: 2,
          title: "Pic2Plate: AI-Powered Personalized Recipe Recommendations",
          description:
            "A personalized recipe recommender system that detects ingredients from user-uploaded images, retrieves relevant recipes using RAG, and generates custom recipes with a Large Language Model (LLM). It also provides nutritional information and adapts to user preferences like dietary restrictions and flavor.",
          uploaded: "2024-08-14",
          author: "Leonard Christopher",
          link: "https://github.com/leonardcl/pic2plate",
          image: pic2plate_image,
          tags: ["LLM", "RAG", "Recipe Recommendation", "Object Detection"],
        },
        {
          id: 3,
          title: "Reinforcement Learning Retro",
          description:
            "Experiment on Super Mario Bros and Felix The Cat game using DQN and A2C",
          uploaded: "2024-09-01",
          author: "Leonard Christopher",
          link: "https://github.com/leonardcl/reinforcement-learning-retro",
          image: rlMario,
          tags: ["Reinforcement Learning", "AI", "NES", "Retro Gaming"],
        },
        {
          id: 4,
          title: "Student Engagement Analysis System for Online Learning",
          description:
            "The system is designed to analyze student engagement in real-time during online learning sessions by detecting emotional and behavioral cues from students using their webcam.",
          uploaded: "2024-09-01",
          author: "Leonard Christopher",
          link: "https://github.com/leonardcl/dingdong-fer",
          image: dingdongCover,
          tags: ["Emotion Recognition", "Monitoring Tool", "Desktop App", "OpenCV"],
        },
        {
          id: 5,
          title: "Smart Garden IoT System",
          description:
            "The Smart Garden IoT System is designed to help users monitor and control garden conditions remotely. It measures soil moisture, temperature, and light intensity, automating lighting and irrigation based on these readings. The system includes both a web dashboard and an Android application for user control and visualization.",
          uploaded: "2024-09-01",
          author: "Leonard Christopher",
          link: "https://github.com/leonardcl/smart-garden",
          image: smartGarden,
          tags: ["IoT", "ESP32", "Android App", "Web Dashboard"],
        },
        // Add more projects as needed
      ];

    return (
        // <div className="flex flex-col md:flex-row border border-gray-200 rounded-lg">
        //     <div className="w-full pl-2 md:pl-5 xl:pl-40 pr-2 md:pr-5 xl:pr-40 mb-20">
        //     <div className=" flex text-3xl font-sans mb-4 text-left border-b-2 border-grey-500 pl-4">
        //         <div className="">
        //         <p className="text-gray-100 text-2xl sm:text-4xl transition-all duration-400 ease-in-out hover:text-green-500">Reinforcement Learning Basic</p>
        //         </div>
        //     </div>
        //     <p className="text-xl text-gray-400 p-2 text-wrap">
        //         Experience in Conputer Vision, Reinforcement Leanring, and Finance Application.
        //         <br></br>
        //     </p>
        //     </div>
        // </div>

        <div className="mt-40 h-sceeen w-full font-quicksand">
        <div>
            <div className="relative">
                <div id="projects" className="text-8xl font-bold font-sans sm:text-9xl">
                    <p className="text-gray-800 transition-all duration-400 ease-in-out hover:text-cyan-400">Projects</p>
                    </div>
                <div className="absolute w-full py-1 bottom-0 inset-x-0 text-white text-4xl sm:text-5xl leading-4 font-semibold font-quicksand">what i created?</div>
            </div>

            <div className="mt-20"></div>

            {/* <div className="text-gray-500 text-left p-10 md:pl-40 md:pr-40 md:pb-40">
            
                <Link to="/blog/1-rl-fundamentalconcept" className="block  p-6 bg-white  rounded-lg shadow hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800">

                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reinforcement Learning Basic</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">Reinforcement Learning (RL) is the science of decision making. It is about learning the optimal behavior in an environment to obtain maximum reward.</p>

                    <p className="pt-4 font-normal text-gray-700 dark:text-gray-400">Uploaded: 2024-08-14 | Author: Leonard Christopher</p>
                </Link>

            </div> */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mx-5 md:mx-60">
                {projects.map((project, index) => (
                <Link
                    to={project.link}
                    key={project.id}
                    className={`block bg-white rounded-lg shadow hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 overflow-hidden ${
                        projects.length % 2 === 1 && index === projects.length - 1
                          ? "xl:col-span-2 justify-self-center xl:max-w-[48%]"
                          : ""
                      }`}
                    // style={{
                    // maxWidth:
                    //     projects.length % 2 === 1 && index === projects.length - 1
                    //     ? "48%"
                    //     : "100%",
                    // }}
                    // className="block bg-white rounded-lg shadow hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 overflow-hidden"
                >
                    <div className="aspect-w-1 aspect-h-1">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="object-cover w-full h-80 rounded-t-lg"
                        />
                    </div>
                    <div className="p-6 text-left">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {project.title}
                        </h5>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                        {project.description}
                        </p>
                        {/* <p className="pt-4 font-normal text-gray-700 dark:text-gray-400">
                        Uploaded: {project.uploaded} | Author: {project.author}
                        </p> */}
                        {/* Tags Section */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="bg-cyan-950 text-cyan-200 text-sm font-medium px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                    </div>
                </Link>
                ))}
            </div>

            <div className="pb-20"></div>
        </div>
    </div>
    )
  }

  export default Projects