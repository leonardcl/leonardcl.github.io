import './App.css';

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Nav from './components/v2/Nav';
import Hero from './components/v2/Hero';
import Work from './components/v2/Work';
import ExperienceTimeline from './components/v2/ExperienceTimeline';
import PublicationsList from './components/v2/PublicationsList';
import FooterV2 from './components/v2/FooterV2';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      navigate("/#/");
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
    <div className="App bg-bone text-ink font-sans">
      <Nav />
      <Hero />
      <Work />
      <ExperienceTimeline />
      <PublicationsList />
      <FooterV2 />
    </div>
  );
}

export default App;
