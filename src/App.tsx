import './App.css';

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Nav from './components/v2/Nav';
import Hero from './components/v2/Hero';
import Now from './components/v2/Now';
import Work from './components/v2/Work';
import Experience from './components/v2/Experience';
import PublicationsList from './components/v2/PublicationsList';
import Writing from './components/v2/Writing';
import Playground from './components/v2/Playground';
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
      <Now />
      <Work />
      <Experience />
      <PublicationsList />
      <Writing />
      <Playground />
      <FooterV2 />
    </div>
  );
}

export default App;
