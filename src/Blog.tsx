import './App.css'

import { useEffect, useRef, useState } from 'react'
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
      "Reinforcement Learning is the science of decision making — learning the optimal behavior in an environment to obtain maximum reward.",
    date: "2024-12-10",
    topic: "reinforcement learning",
    minutes: 9,
  },
]

/** Article card with a real 3D tilt — it leans toward your cursor. */
const TiltCard = ({ post, index }: { post: (typeof posts)[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ rx: -py * 7, ry: px * 9 })
  }
  const onLeave = () => setTilt({ rx: 0, ry: 0 })

  return (
    <div className="tilt-wrap rise-blur" style={{ animationDelay: `${500 + index * 130}ms` }}>
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
        <Link
          to={post.slug}
          className="tilt-card group block border border-line bg-bone/60 backdrop-blur-sm p-8 sm:p-10 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5"
          style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
        >
          <div className="tilt-lift">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-blush border border-blush/30 px-2.5 py-1 rounded-full">
                {post.topic}
              </span>
              <span className="font-mono text-xs text-inkmuted">{post.date}</span>
              <span className="font-mono text-xs text-inkmuted">· {post.minutes} min read</span>
            </div>

            <h2 className="mt-5 font-display text-2xl sm:text-[2rem] leading-snug text-ink font-medium group-hover:text-accent transition-colors duration-300 max-w-3xl">
              {post.title}
            </h2>

            <p className="mt-4 text-inkmuted leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>

            <span className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-ink group-hover:text-accent transition-colors duration-300">
              read article
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

function Blog() {
  // land at the top when navigating here
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="App bg-bone text-ink font-sans min-h-screen min-h-dvh flex flex-col overflow-x-hidden">
      <Nav />

      <main className="relative w-full flex-1">
        {/* Ambient color, like the home hero */}
        <div className="blob w-[420px] h-[420px] -top-20 -right-28 bg-blush/10" />
        <div className="blob w-[360px] h-[360px] top-64 -left-32 bg-accent/10" style={{ animationDelay: "-8s" }} />

        <div className="relative max-w-site mx-auto w-full px-6 sm:px-10 pt-36 pb-24">
          {/* Header */}
          <div className="flex items-start justify-between gap-8">
            <div>
              <p
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent rise-blur"
                style={{ animationDelay: "100ms" }}
              >
                writing
              </p>
              <h1 className="mt-4 font-display text-5xl sm:text-7xl text-ink font-medium leading-[1.02]">
                <span className="block rise-blur" style={{ animationDelay: "200ms" }}>
                  Notes &
                </span>
                <span className="block italic font-light text-blush rise-blur" style={{ animationDelay: "320ms" }}>
                  essays
                </span>
              </h1>
              <p
                className="mt-6 max-w-lg text-inkmuted leading-relaxed rise-blur"
                style={{ animationDelay: "440ms" }}
              >
                Things I've learned building intelligent systems — written down
                so I don't forget, published in case they help you too.
              </p>
            </div>

            {/* Slowly turning asterisk — the page's quiet pulse */}
            <span
              aria-hidden
              className="slow-spin hidden sm:block font-display text-7xl text-blush/60 leading-none mt-2"
              style={{ animationDelay: "500ms" }}
            >
              ✳
            </span>
          </div>

          {/* Articles */}
          <div className="mt-16 space-y-8">
            {posts.map((post, i) => (
              <TiltCard key={post.slug} post={post} index={i} />
            ))}
          </div>

          <p
            className="mt-14 font-mono text-xs text-inkmuted rise-blur"
            style={{ animationDelay: "800ms" }}
          >
            more essays in progress <span className="text-blush">✍</span>
          </p>
        </div>
      </main>

      <FooterV2 />
    </div>
  )
}

export default Blog
