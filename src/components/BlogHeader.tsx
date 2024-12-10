// import React from 'react'

const BlogHeader = () => {
    return (
      <div id="home" className="h-sceeen w-full font-quicksand">
          <div>
              <div className="text-gray-200 text-left p-10 pt-40 md:pt-80 pb-40 md:p-40 md:pb-40">
                  <p className="text-2xl">Hello, this is another page of mine</p> 
                  <div className="p-1 mb-5">
                  <h2 className="text-5xl xs:text-7xl sm:text-8xl font-bold text-gray-100 font-sans"><span className="text-cyan-400">J</span>ust<br></br>Writing</h2>
  
                  </div>
                  <div className="max-w-screen-sm">
                  <p className="text-gray-400 font-sans max-w-100 font-quicksand"> I just write this to share my knowledge. I will only write what are interesting to me.</p>
                  </div>
                  
                  <div className="flex space-x-4 mt-40 md:mt-20"></div>
                  <a href="#about" className="bg-inhirit tracking-[.40em] text-gray-200 px-2 py-2 mt-4 hover:bg-cyan-400 border-b-2 border-cyan-400 hover:font-semibold transition-all duration-250 ease-in-out bg-inhirit group">
                  <span className="w-full text-left transition-colors duration-150 ease-in-out group-hover:text-gray-800">START READING</span></a>
              
  
              </div>
          </div>
      </div>
    )
  }
  
  export default BlogHeader
  
  