import './App.css'

import Navbar from './components/NavBar'
import Home from './components/Home'
import About from './components/About'
import Education from './components/Education'
import Publications from './components/Publications'
// import Projects from './components/Projects'
// import { createRoot } from 'react-dom/client';
import Projects from './components/Projects'
import Career from './components/Career'
import ContactMe from './components/Contact'
import Footer from './components/Footer'

// const root = createRoot(document.getElementById('root')!);

function App() {
  return (
    <div className="App bg-gray-950">
      <Navbar />
      <Home />
      <About />
      <Career />
      <Education />
      <Publications />
      <Projects />
      <ContactMe />
      <Footer />
    </div>
  )
}

export default App
