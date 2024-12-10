import { useState } from "react";
// import React from 'react'

const Publications = () => {
    const [date2024, setDate2024] = useState(true)
    const [date2022, setDate2022] = useState(false)
  return (
    <div>
        <div id="publication" className="p-10 mt-20 md:mt-10 xl:p-40 text-white text-center">
            <div className="relative">
                <div className="text-6xl font-bold font-sans md:text-9xl sm:text-8xl ">
                    <p className="text-gray-800 transition-all duration-400 ease-in-out hover:text-cyan-400">Publication</p>
                    </div>
                <div className="absolute w-full py-1 bottom-0 inset-x-0 text-white text-3xl sm:text-5xl leading-4 font-semibold font-quicksand">what i published?</div>
            </div>
            <div className="mt-10"></div>
            <div className="flex items-center mt-40 justify-center px-6 md:px-10 xl:px-60">
                <div className="border-l-4 border-left font-quicksand border-gray-500">
                    <div className="relative w-full mb-8">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute -top-1 z-10 -ml-4 h-7 w-7 rounded-full text-cyan-400">
                            <path fill-rule="evenodd" d="M 2.25 12 c 0 -5.385 4.365 -9.75 9.75 -9.75 s 9.75 4.365 9.75 9.75 s -4.365 9.75 -9.75 9.75 S 2.25 17.385 2.25 12 z z" clip-rule="evenodd" />
                        </svg>
                        <div className="ml-6 text-left">
                            <h4 onClick={() => setDate2024(!date2024)} className="font-bold text-cyan-400 text-5xl ">2024</h4>
                            {date2024 && (
                                <div className="ml-6 text-left">
                                    {/* <div className="mt-6 group">
                                        <h4 className="font-bold text-2xl text-cyan-700 group-hover:text-cyan-500">Pic2Plate: A Vision-Language and Retrieval-Augmented Framework for
                                        Personalized Recipe Recommendations</h4>
                                        <p className="mt-2 max-w-screen-sm text-gray-500 text-xl group-hover:text-gray-300">
                                        Yosua Setyawan Soekamto, Andreas Lim, Leonard Christopher Limanjaya, Yoshua Kaleb Purwanto, Suk-Ho Lee, Dae-Ki Kang    
                                        </p>
                                        <span className="mt-1 block text-md font-semibold text-cyan-700 group-hover:text-cyan-500">Sensors</span>
                                    </div> */}
                                    <div className="mt-6 group">
                                        <h4 className="font-bold text-cyan-700 text-2xl group-hover:text-cyan-500">Optimizing Information Retrieval in Dark Web Academic Literature: A Study Using KeyBERT for Keyword Extraction and Clustering</h4>
                                        <p className="mt-2 max-w-screen-sm text-gray-500 text-xl group-hover:text-gray-300">
                                        Soekamto, Y. S., Limanjaya, L. C., Purwanto, Y. K., Choi, B., Song, S.-K., and Kang, D.-K    
                                        </p>
                                        <span className="mt-1 block text-md font-semibold text-cyan-700 group-hover:text-cyan-500">International Journal of Internet, Broadcasting and Communication (IJIBC), 16(4)</span>
                                    </div>
                                    <div className="mt-6 group">
                                        <h4 className="font-bold text-cyan-700 text-2xl group-hover:text-cyan-500">An Empirical Analysis on Reinforcement Learning Algorithms for Stock Trading</h4>
                                        <p className="mt-2 max-w-screen-sm text-gray-500 text-xl group-hover:text-gray-300">
                                        Limanjaya, L. C., and Kang, D.-K    
                                        </p>
                                        <span className="mt-1 block text-md font-semibold text-cyan-700 group-hover:text-cyan-500">International Conference - ICATI-2024</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative w-full group">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute -top-1 z-10 -ml-4 h-7 w-7 rounded-full text-pink-600">
                            <path fill-rule="evenodd" d="M 2.25 12 c 0 -5.385 4.365 -9.75 9.75 -9.75 s 9.75 4.365 9.75 9.75 s -4.365 9.75 -9.75 9.75 S 2.25 17.385 2.25 12 z z" clip-rule="evenodd" />
                        </svg>
                        <div className="ml-6 text-left">
                            <h4 onClick={() => setDate2022(!date2022)} className="font-bold text-pink-600 text-5xl ">2022</h4>
                            {date2022 && (
                                <div className="ml-6 text-left ">
                                    <div className="mt-6">
                                        <h4 className="font-bold text-2xl text-pink-800 group-hover:text-pink-600">Sistem Untuk Mengklasifikasikan Emosi Dan Mendeteksi Wajah Pada Pembelajaran Daring</h4>
                                        <p className="mt-2 max-w-screen-sm text-gray-500 text-xl group-hover:text-gray-300">
                                        LC Limanjaya, H Khoswanto, I Sugiarto    
                                        </p>
                                        <span className="mt-1 block text-md font-semibold text-pink-800 group-hover:text-pink-600">Jurnal Teknik Elektro 15 (2), 41-47 | <a className="btn btn-blue hover:text-red-600 hover:underline" href="https://jurnalelektro.petra.ac.id/index.php/elk/article/view/25888">[PDF]</a></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            

        </div>
    </div>
  )
}

export default Publications