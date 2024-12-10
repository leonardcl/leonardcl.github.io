import { useState } from "react";
// import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
// import { FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
    const [nav, setNav] = useState(false)
    const navigate = useNavigate();
    
    const links = [
        {
            id: 1,
            name: 'About',
            url: '/#about'
        },
        {
            id: 2,
            name: 'Career',
            url: '/#career'
        },
        {
            id: 3,
            name: 'Education',
            url: '/#education'
        },
        {
            id: 4,
            name: 'Projects',
            url: '/#projects'
        },
        {
            id: 5,
            name: 'Publications',
            url: '/#publication'
        },
        {
            id: 6,
            name: 'Blogs',
            url: '/blog'
        },
        {
            id: 7,
            name: 'Contact',
            url: '/#contact'
        }
    ];

    const handleLinkClick = (url: string) => {
        if (url.startsWith("/#")) {
          const sectionId = url.replace("/#", "");
    
          if (location.pathname !== "/") {
            // Navigate to home and scroll to the section
            navigate("/");
            setTimeout(() => {
              const element = document.getElementById(sectionId);
              if (element) {
                element.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100); // Delay to ensure navigation completes
          } else {
            // Scroll directly to the section
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }
        } else {
          // Navigate to external pages like /blog
          navigate(url);
        }
      };
    

  return (
    <div className="flex justify-between items-center w-full z-[200] h-20 px-4 text-white bg-black md:px-20 fixed stop-0">
        <div className="text-2xl font-bold font-quicksand">
            <h1>.leonardcl</h1>
        </div>
        {/* <div className="hidden md:flex space-x-10 font-semibold">
            {links.map((link) => (
                <a key={link.id} href={`${link.url}`} className="transition-colors duration-300 ease-in-out hover:text-cyan-300">
                    {link.name}
                </a>
            ))}
        </div> */}
        {/* Desktop Links */}
      <div className="hidden md:flex space-x-10 font-semibold">
        {links.map(({ id, name, url }) => (
          <button
            key={id}
            onClick={() => handleLinkClick(url)}
            className="transition-colors duration-300 ease-in-out hover:text-cyan-300"
          >
            {name}
          </button>
        ))}
      </div>
        
        {/* <div onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-300 md:hidden text-2xl">
            {nav ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-red-300">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
            : 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
            }
        </div>

        {nav && (
            <ul className="flex flex-col justify-center items-center absolute top-0 left-0 transition-all w-full max-h-screen max-h-0 h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
            {links.map(({id, name, url}) => (
                <li 
                key={id} 
                className="px-4 cursor-pointer capitalize py-6 text-3xl hover:text-gray-100 hover:text-4xl">
                    <a href={`#${url}`}>{name}</a>
                </li>
            ))}
            </ul>
        )} */}
        {/* Hamburger Icon */}
      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 z-10 text-gray-300 md:hidden text-2xl"
      >
        {nav ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-red-300"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        )}
      </div>

      {/* Mobile Menu */}
      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 transition-all w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
          {links.map(({ id, name, url }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-6 text-3xl hover:text-gray-100 hover:text-4xl"
            >
              <button
                onClick={() => {
                  setNav(false); // Close menu
                  handleLinkClick(url);
                }}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NavBar