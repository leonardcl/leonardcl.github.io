// import React from 'react'
// import { useState } from "react";

const Education = () => {
  return (
    <div>
        <div id="education" className="p-10 mt-20 md:mt-10 xl:p-40 text-white text-center">
            <div className="relative">
                <div className="text-6xl font-bold font-sans sm:text-9xl">
                    <p className="text-gray-800 transition-all duration-400 ease-in-out hover:text-cyan-400">Education</p>
                    </div>
                <div className="absolute w-full py-1 bottom-0 inset-x-0 text-white text-3xl sm:text-5xl leading-4 font-semibold font-quicksand">where i studied?</div>
            </div>
            <div className="mt-10"></div>
            <div className="flex items-center mt-40 justify-center px-6 md:px-10 xl:px-60">
                <div className="border-l-4 border-left font-quicksand border-gray-500">
                    <div className="relative w-full group mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute -top-1 z-10 -ml-4 h-7 w-7 rounded-full text-cyan-500">
                            <path fill-rule="evenodd" d="M 2.25 12 c 0 -5.385 4.365 -9.75 9.75 -9.75 s 9.75 4.365 9.75 9.75 s -4.365 9.75 -9.75 9.75 S 2.25 17.385 2.25 12 z z" clip-rule="evenodd" />
                        </svg>
                        <div className="ml-6">
                            <h4 className="font-bold text-cyan-500 text-4xl ">Master in Computer Engineering</h4>
                            <h4 className="font-bold text-cyan-700 text-2xl ">Dongseo University</h4>
                            <p className="mt-2 max-w-screen-sm text-gray-500 text-xl group-hover:text-gray-300">
                            I specialized in Reinforcement Leanring, Computer Vision, and LLM. I gained expertise in predictive modeling, visual data interpretation, and optimizing decision-making processes in various environments.    
                            </p>
                            <span className="mt-1 block text-sm font-semibold text-cyan-500">2022 // Recent</span>
                        </div>
                    </div>
                    <div className="relative w-full group">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute -top-1 z-10 -ml-4 h-7 w-7 rounded-full text-yellow-600">
                            <path fill-rule="evenodd" d="M 2.25 12 c 0 -5.385 4.365 -9.75 9.75 -9.75 s 9.75 4.365 9.75 9.75 s -4.365 9.75 -9.75 9.75 S 2.25 17.385 2.25 12 z z" clip-rule="evenodd" />
                        </svg>
                        <div className="ml-6">
                            <h4 className="font-bold text-yellow-600 text-4xl ">Bachelor in Electrical Engineering</h4>
                            <h4 className="font-bold text-yellow-700 text-2xl ">Petra Christian University</h4>
                            <p className="mt-2 max-w-screen-sm text-gray-500 text-xl group-hover:text-gray-300">
                            Focused on Robotics, Electronics, and Computer Vision. In my final year, I developed a platform that can be used to monitor student emotion during online class by using a camera.   
                            </p>
                            <span className="mt-1 block text-sm font-semibold text-yellow-600">2018 // 2022</span>
                        </div>
                    </div>
                </div>
            </div>
            

        </div>
    </div>
  )
}

export default Education