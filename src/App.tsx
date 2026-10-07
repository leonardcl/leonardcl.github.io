import './App.css';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Nav from './components/v2/Nav';
import Hero from './components/v2/Hero';
import About from './components/v2/About';
import Work from './components/v2/Work';
import ExperienceTimeline from './components/v2/ExperienceTimeline';
import PublicationsList from './components/v2/PublicationsList';
import FooterV2 from './components/v2/FooterV2';
import PageMeta from './components/v2/PageMeta';

function App() {
  const location = useLocation();

  // With real paths, a hash is just an in-page anchor again.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const t = window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location]);

  return (
    <div className="App bg-bone text-ink font-sans">
      <PageMeta
        title="Robotics & AI Engineer"
        description="Leonard Christopher Limanjaya — robotics software engineer, AI researcher, and founder of ProjekinAja. Reinforcement learning, computer vision, LLMs and RAG, ROS2 robotics."
        path="/"
      />
      <Nav />
      <Hero />
      <About />
      <Work />
      <ExperienceTimeline />
      <PublicationsList />
      <FooterV2 />
    </div>
  );
}

export default App;
