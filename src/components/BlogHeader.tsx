// import React from 'react'

const BlogHeader = () => {
    return (
      <div id="home" className="h-sceeen w-full font-quicksand relative overflow-hidden">
          <div className="flex">
              {/* Left side - existing content */}
              <div className="flex-1">
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
              
              {/* Right side - Simple line-by-line reveal */}
              <div className="flex-1 relative hidden md:block">
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-96 h-80">
                          {/* Code editor window */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-64 bg-gray-900/90 rounded-lg border border-gray-700/50 shadow-2xl overflow-hidden">
                              {/* Window header */}
                              <div className="w-full h-8 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600/50 flex items-center px-3">
                                  {/* Window controls */}
                                  <div className="flex space-x-2">
                                      <div className="w-3 h-3 bg-red-500/70 rounded-full"></div>
                                      <div className="w-3 h-3 bg-yellow-500/70 rounded-full"></div>
                                      <div className="w-3 h-3 bg-green-500/70 rounded-full"></div>
                                  </div>
                                  {/* Window title */}
                                  <div className="ml-4 text-xs text-gray-400 font-mono">story.md</div>
                              </div>
                              
                              {/* Code content area */}
                              <div className="p-4 font-mono text-sm">
                                  {/* Typing story */}
                                  <div className="text-cyan-400/80 space-y-2">
                                      <div className="typing-simple">Once upon a time...</div>
                                      <div className="typing-simple">in a world of code...</div>
                                      <div className="typing-simple">a story began to unfold.</div>
                                      <div className="typing-simple"></div>
                                      <div className="typing-simple">Words appeared...</div>
                                      <div className="typing-simple">one by one...</div>
                                      <div className="typing-simple">like magic.</div>
                                  </div>
                              </div>
                              
                              {/* Subtle glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent pointer-events-none"></div>
                          </div>
                          
                          {/* Floating code elements */}
                          <div className="absolute -top-4 -right-4 text-xs text-cyan-400/40 font-mono animate-float-code">
                              &lt;/&gt;
                          </div>
                          <div className="absolute -bottom-2 -left-2 text-xs text-gray-500/40 font-mono animate-float-code-delayed">
                              { }
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    )
  }
  
  export default BlogHeader
  
  