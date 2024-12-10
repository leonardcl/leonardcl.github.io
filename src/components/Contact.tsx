// import React from "react";

const ContactMe = () => {
  return (
    <section id="contact" className="bg-black text-white py-20 px-10">
      <div className="max-w-5xl mx-auto text-center">
      <div className="group relative mb-5">
            <div className="absolute w-full py-1 bottom-0 inset-x-0 text-white text-3xl sm:text-5xl leading-4 font-semibold font-quicksand">
                <span className="group">get in touch?</span>
                </div>
            <div className="group text-6xl font-bold font-sans sm:text-9xl">
                <p className="">
                    <span className="text-gray-800 transition-all duration-400 ease-in-out hover:text-cyan-400 group-hover:text-cyan-400">Contact</span>
                    </p>
                </div>
        </div>
        {/* Title */}
        {/* <h2 className="text-4xl md:text-6xl font-bold mb-6 text-cyan-400">
          Get in Touch
        </h2> */}
        <p className="text-gray-400 text-lg mb-12">
          Feel free to reach out via email or connect with me on social media!
        </p>

        {/* Contact Details */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-xl">
          {/* Email */}
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-cyan-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 8l9 6 9-6" />
              <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
            </svg>
            <a
              href="mailto:leonardchristopher002@gmail.com"
              className="hover:text-cyan-400 transition duration-300"
            >
              leonardchristopher002@gmail.com
            </a>
          </div>

          {/* GitHub */}
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-cyan-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.016-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.774.418-1.305.762-1.605-2.665-.3-5.466-1.334-5.466-5.93 0-1.31.467-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.654 1.653.242 2.873.118 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.803 5.625-5.472 5.922.43.372.824 1.103.824 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 22.092 24 17.593 24 12.297c0-6.627-5.373-12-12-12z"
                clipRule="evenodd"
              />
            </svg>
            <a
              href="https://github.com/leonardcl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition duration-300"
            >
              GitHub
            </a>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-cyan-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22.23 0H1.77A1.77 1.77 0 0 0 0 1.77v20.46A1.77 1.77 0 0 0 1.77 24h20.46A1.77 1.77 0 0 0 24 22.23V1.77A1.77 1.77 0 0 0 22.23 0ZM7.12 20.54H3.56V9H7.1ZM5.34 7.53a2.05 2.05 0 1 1 0-4.1 2.05 2.05 0 0 1 0 4.1ZM20.54 20.54h-3.57v-5.5c0-1.31-.47-2.2-1.65-2.2-.9 0-1.43.61-1.66 1.2-.09.22-.11.52-.11.82v5.68h-3.57s.05-9.21 0-10.17h3.57v1.44c.47-.73 1.31-1.78 3.18-1.78 2.32 0 4.06 1.51 4.06 4.75v5.76Z" />
            </svg>
            <a
              href="https://id.linkedin.com/in/leonardcl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition duration-300"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;
