import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

// Add new posts here as you write them.
const posts = [
  {
    slug: "/blog/1-rl-fundamentalconcept",
    title:
      "Mastering Reinforcement Learning: How Machines Learn from Rewards and Mistakes",
    excerpt:
      "Reinforcement Learning is the science of decision making — learning optimal behavior in an environment to obtain maximum reward.",
    date: "2024-12-10",
  },
];

const Writing = () => (
  <section id="writing" className="max-w-site mx-auto px-6 sm:px-10 py-24">
    <SectionHeader index="05" title="Writing" hint="notes & essays" />
    <div className="border-t border-line">
      {posts.map((post) => (
        <Reveal key={post.slug}>
          <Link
            to={post.slug}
            className="group grid sm:grid-cols-[150px_minmax(0,1fr)] gap-1 sm:gap-10 py-8 border-b border-line"
          >
            <span className="font-mono text-xs text-inkmuted pt-1">{post.date}</span>
            <div>
              <h3 className="font-display text-xl sm:text-2xl text-ink font-medium leading-snug group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <p className="mt-3 text-inkmuted leading-relaxed max-w-2xl text-[15px]">
                {post.excerpt}
              </p>
              <span className="mt-3 inline-block font-mono text-xs text-accent">
                read →
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
    <Reveal>
      <Link
        to="/blog"
        className="mt-8 inline-block u-link font-mono text-sm text-ink"
      >
        all writing
      </Link>
    </Reveal>
  </section>
);

export default Writing;
