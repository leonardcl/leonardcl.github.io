// import React from 'react'
import laptop_logo from '../assets/laptop.svg'
import brain_logo from '../assets/brain.svg'
import robot_logo from '../assets/robot.svg'
import iot_logo from '../assets/iot.svg'

const About = () => {
      
  return (
    <div>
        <div id="about" className="p-10 mt-40 md:mt-20 md:p-40 text-white text-left">
            <div className="group relative">
                <div className="absolute w-full py-1 bottom-0 inset-x-0 text-white text-4xl sm:text-5xl leading-4 font-semibold font-quicksand">
                    <span className="group">want to know more?</span>
                    </div>
                <div className="group text-7xl font-bold font-sans sm:text-9xl">
                    <p className="">
                        <span className="text-gray-800 transition-all duration-400 ease-in-out hover:text-cyan-400 group-hover:text-cyan-400">About</span>
                        </p>
                    </div>
            </div>
            <div className="mt-10"></div>
            <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-2/3 xl:w-1/2">
                    <p className=" text-l sm:text-xl text-gray-400 p-2 text-wrap">
                    My passion lies in the dynamic realms of robotics, machine learning, and artificial intelligence (AI). Actively immersing myself in various projects and organizations, I constantly refine my expertise, driven by an unyielding commitment to technological innovation. The intricate interplay between these cutting-edge disciplines and their transformative potential across diverse industries captivates me deeply.
                    <br></br>
                    <br></br>
                    Fueled by insatiable curiosity and a thirst for continuous learning, I eagerly explore emerging technologies and embrace challenges as catalysts for personal and professional development. My relentless desire to propel the fields of robotics, machine learning, and AI forward is matched only by my enthusiasm for collaborating with like-minded professionals and organizations. Together, let's embark on a journey of learning, discovery, and innovation to push the boundaries of technological progress and revolutionize the world.
                    </p>
                </div>
                <div className="hidden lg:flex lg:w-1/3 xl:w-1/2 flex-col items-center justify-center space-y-8">
                    {/* Motto Section */}
                    <div className="relative group text-center px-16 py-8">
                        {/* Quote Icon - Top Left */}
                        <div className="absolute -top-2 -left-2">
                            <svg className="w-8 h-8 text-cyan-400/60" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                            </svg>
                        </div>
                        
                        {/* Quote Icon - Bottom Right */}
                        <div className="absolute -bottom-2 -right-2">
                            <svg className="w-8 h-8 text-rose-400/60 transform rotate-180" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                            </svg>
                        </div>
                        
                        {/* Motto Text */}
                        <div className="space-y-8">
                            {/* First Line */}
                            <div className="overflow-hidden">
                                <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                                    Turn curiosity into systems;
                                </p>
                            </div>
                            
                            {/* Second Line */}
                            <div className="overflow-hidden">
                                <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-rose-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x" style={{animationDelay: '0.5s'}}>
                                    turn systems into impact.
                                </p>
                            </div>
                            
                            {/* Decorative Line */}
                            <div className="w-24 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 mx-auto mt-8 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Motto Section for Tablet (below intro text) */}
            <div className="flex lg:hidden justify-center mt-16">
                <div className="relative group text-center px-8 py-6 max-w-md">
                    {/* Quote Icon - Top Left */}
                    <div className="absolute -top-2 -left-2">
                        <svg className="w-8 h-8 text-cyan-400/60" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                        </svg>
                    </div>
                    
                    {/* Quote Icon - Bottom Right */}
                    <div className="absolute -bottom-2 -right-2">
                        <svg className="w-8 h-8 text-rose-400/60 transform rotate-180" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                        </svg>
                    </div>
                    
                    {/* Motto Text */}
                    <div className="space-y-6">
                        {/* First Line */}
                        <div className="overflow-hidden">
                            <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                                Turn curiosity into systems;
                            </p>
                        </div>
                        
                        {/* Second Line */}
                        <div className="overflow-hidden">
                            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-rose-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x" style={{animationDelay: '0.5s'}}>
                                turn systems into impact.
                            </p>
                        </div>
                        
                        {/* Decorative Line */}
                        <div className="w-20 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 mx-auto mt-6 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

        </div>
        {/* <div className="mt-10"></div> */}
        <div id="about" className="p-10 mt-5 text-white">
            <div className="relative text-center group">
                    <div className="text-6xl font-bold font-sans sm:text-9xl mb-20">
                        <p className="text-gray-800 transition-all duration-400 ease-in-out group-hover:text-cyan-400">Expertise</p>
                        </div>
                    <div className="absolute w-full py-1 bottom-0 inset-x-0 text-white text-3xl sm:text-5xl leading-4 font-semibold font-quicksand">what i can do?</div>
            </div>
            <div className="mt-10"></div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 pl-2 md:pl-5 xl:pl-40 mb-20">
                    <div className="flex text-3xl font-bold font-sans mb-4 text-right border-b-8 border-cyan-400 pr-4">
                        <div className="image">
                            <img className="object-contain h-20 sm:h-24" src={laptop_logo} alt="Gambar Laptop" />
                        </div>
                        <div className='ml-auto'>
                            <p className="text-gray-100 text-3xl sm:text-6xl transition-all duration-400 ease-in-out hover:text-cyan-400">Software</p>
                            <p className="text-gray-100 transition-all duration-400 ease-in-out">Development</p>
                        </div>
                    </div>
                    <p className="text-xl text-gray-400 p-2 pt-1 text-wrap">
                    Experienced in both functional and OOP: Python, C, C++, JavaScript, TypeScript.
                    <br></br>
                    </p>
                </div>
                <div className="w-full md:w-1/2 pr-2 md:pr-5 xl:pr-40 mb-20">
                    <div className=" flex text-3xl font-bold font-sans mb-4 text-left border-b-8 border-rose-500 pl-4">
                        <div className="">
                            <p className="text-gray-100 text-3xl sm:text-6xl transition-all duration-400 ease-in-out hover:text-rose-500">Artificial</p>
                            <p className="text-gray-100 transition-all duration-400 ease-in-out">Intelligence</p>
                        </div>
                        <div className="image ml-auto">
                            <img className="object-contain h-20 sm:h-24" src={brain_logo} alt="Gambar Laptop" />
                        </div>
                    </div>
                    <p className="text-xl text-gray-400 p-2 text-wrap">
                    Experience in Computer Vision, Reinforcement Leanring, LLM, RAG and Finance Application.
                    <br></br>
                    </p>
                </div>
                
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 pl-2 md:pl-5 xl:pl-40 mb-20">
                    <div className="flex text-3xl font-bold font-sans mb-4 text-right border-b-8 border-yellow-400 pr-4">
                        <div className="image">
                            <img className="object-contain h-20 sm:h-24" src={robot_logo} alt="Gambar Laptop" />
                        </div>
                        <div className='ml-auto'>
                            <p className="text-gray-100 text-3xl sm:text-6xl transition-all duration-400 ease-in-out hover:text-yellow-400">Robot</p>
                            <p className="text-gray-100 transition-all duration-400 ease-in-out">Development</p>
                        </div>
                    </div>
                    <p className="text-xl text-gray-400 p-2 pt-1 text-wrap">
                    Experienced in UR3, ROS2, Gazebo, and OpenAI Gym.
                    <br></br>
                    </p>
                </div>
                <div className="w-full md:w-1/2 pr-2 md:pr-5 xl:pr-40 mb-20">
                    <div className=" flex text-3xl font-bold font-sans mb-4 text-left border-b-8 border-green-500 pl-4">
                        <div className="">
                            <p className="text-gray-100 text-3xl sm:text-6xl transition-all duration-400 ease-in-out hover:text-green-500">Electrical</p>
                            <p className="text-gray-100 transition-all duration-400 ease-in-out">Engineering</p>
                        </div>
                        <div className="image ml-auto">
                            <img className="object-contain h-20 sm:h-24" src={iot_logo} alt="Gambar Laptop" />
                        </div>
                    </div>
                    <p className="text-xl text-gray-400 p-2 text-wrap">
                    Experience in embedded software development, IoT, Industrial Automation, and PLC.
                    <br></br>
                    </p>
                </div>
                
            </div>
            

        </div>
        
    </div>
    
  )
}

export default About