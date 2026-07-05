import './App.css'

import { Link } from 'react-router-dom'
import Nav from './components/v2/Nav'
import FooterV2 from './components/v2/FooterV2'

// Add new posts here as you write them.
const posts = [
  {
    slug: "/blog/1-rl-fundamentalconcept",
    title:
      "Mastering Reinforcement Learning: How Machines Learn from Rewards and Mistakes",
    excerpt:
      "Reinforcement Learning (RL) is the science of decision making. It is about learning the optimal behavior in an environment to obtain maximum reward.",
    date: "2024-12-10",
  },
]

function Blog() {
  return (
    <div className="App bg-bone text-ink font-sans min-h-screen flex flex-col">
      <Nav />
      <main className="max-w-site mx-auto w-full px-6 sm:px-10 pt-36 pb-24 flex-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
          writing
        </p>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl text-ink font-medium">
          Notes & <span className="italic font-light">essays</span>
        </h1>

        <div className="mt-16 border-t border-line">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={post.slug}
              className="group grid sm:grid-cols-[150px_minmax(0,1fr)] gap-1 sm:gap-10 py-8 border-b border-line"
            >
              <span className="font-mono text-xs text-inkmuted pt-1">{post.date}</span>
              <div>
                <h2 className="font-display text-xl sm:text-2xl text-ink font-medium leading-snug group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="mt-3 text-inkmuted leading-relaxed max-w-2xl text-[15px]">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-block font-mono text-xs text-accent">
                  read →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <FooterV2 />
    </div>
  )
}

export default Blog
