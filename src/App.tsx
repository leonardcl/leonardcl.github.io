import './App.css';

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Navbar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import Education from './components/Education';
import Publications from './components/Publications';
import Projects from './components/Projects';
import Career from './components/Career';
import ContactMe from './components/Contact';
import Footer from './components/Footer';
import SectionTransition from './components/SectionTransition';
import ScrollProgress from './components/ScrollProgress';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", ""); // Remove the `#`
      navigate("/#/");
      // const element = document.getElementById(sectionId);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 500); // Delay to ensure navigation completes
    }
  }, [location]);

  return (
    <div className="App bg-gray-950">
      <ScrollProgress />
      <Navbar />
      <SectionTransition sectionId="home" direction="fade" delay={0}>
        <Home />
      </SectionTransition>
      <SectionTransition sectionId="about" direction="up" delay={50}>
        <About />
      </SectionTransition>
      <SectionTransition sectionId="career" direction="up" delay={100}>
        <Career />
      </SectionTransition>
      <SectionTransition sectionId="education" direction="up" delay={150}>
        <Education />
      </SectionTransition>
      <SectionTransition sectionId="publications" direction="up" delay={200}>
        <Publications />
      </SectionTransition>
      <SectionTransition sectionId="projects" direction="up" delay={250}>
        <Projects />
      </SectionTransition>
      <SectionTransition sectionId="contact" direction="up" delay={300}>
        <ContactMe />
      </SectionTransition>
      <SectionTransition sectionId="footer" direction="fade" delay={350}>
        <Footer />
      </SectionTransition>
    </div>
  );
}

export default App;
