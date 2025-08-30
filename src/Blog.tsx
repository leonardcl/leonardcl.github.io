import './App.css'

import Navbar from './components/NavBar'
import BlogHeader from './components/BlogHeader'
import CardWithLink from './components/CardWithLink';
import Footer from './components/Footer';

function Blog() {
  return (
    <div className="App bg-gray-950">
      <Navbar />
      <BlogHeader />
      <CardWithLink />
      <Footer />
    </div>
  )
}

export default Blog
