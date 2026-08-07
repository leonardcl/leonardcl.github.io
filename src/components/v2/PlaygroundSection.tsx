import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";
import { IconSpark } from "./Icons";
import Reveal from "./Reveal";

/**
 * The playground, given a front door.
 *
 * These were only reachable from a line of text in the footer, which meant
 * almost nobody found them — including the POMDP simulator that demonstrates
 * my own published research. They're the most direct evidence on the site
 * that I build things, so they belong above the fold-line of attention.
 */

const toys = [
  {
    to: "/fog-of-war",
    title: "Breaking the fog",
    blurb:
      "Two agents race the same maze under the same limited vision — one memoryless, one reasoning over a belief state. My ACM TIST paper, playable.",
    tag: "POMDP",
  },
  {
    to: "/tictactoe-rl",
    title: "Teach it to play",
    blurb:
      "Q-learning trained by self-play in your browser. Beat it while it's untrained, then train it 20,000 games and try again.",
    tag: "reinforcement learning",
  },
  {
    to: "/rag-pipeline",
    title: "Watch a RAG pipeline think",
    blurb:
      "Query in, retrieval out, stage by stage — over a corpus built from my own papers and projects. Doubles as a search of this site.",
    tag: "retrieval",
  },
  {
    to: "/gradient-descent",
    title: "Gradient descent",
    blurb:
      "Drop a point on a loss surface and watch it fall. Learning rate, momentum, Nesterov, noise.",
    tag: "optimization",
  },
  {
    to: "/boids",
    title: "Boids swarm",
    blurb:
      "Three local rules, no leader, and flocking simply emerges. Turn one off and watch it fall apart.",
    tag: "emergence",
  },
  {
    to: "/pixel-cam",
    title: "Pixel camera",
    blurb:
      "Your webcam redrawn as this site's pixels and binary digits. Runs entirely on your machine.",
    tag: "computer vision",
  },
];

const PlaygroundSection = () => (
  <section id="playground" className="max-w-site mx-auto px-6 sm:px-10 py-24">
    <SectionHeader
      eyebrow="what have i been playing with?"
      title="Play"
      italicTitle="ground"
      icon={<IconSpark />}
    />

    <p className="-mt-6 mb-10 max-w-2xl text-inkmuted leading-relaxed">
      Ideas I wanted to understand properly, so I built them. Everything here
      runs live in your browser — no server, nothing to install.
    </p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {toys.map((toy, i) => (
        <Reveal key={toy.to} delay={Math.min(i * 70, 280)}>
          <Link
            to={toy.to}
            className="group flex h-full flex-col border border-line p-6 hover:border-accent/60 hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-blush">
              {toy.tag}
            </span>
            <h3 className="mt-3 font-display text-xl text-ink font-medium group-hover:text-accent transition-colors">
              {toy.title}
            </h3>
            <p className="mt-2.5 text-sm text-inkmuted leading-relaxed flex-1">
              {toy.blurb}
            </p>
            <span className="mt-5 font-mono text-xs text-inkmuted group-hover:text-accent transition-colors">
              open
              <span className="inline-block ml-1.5 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  </section>
);

export default PlaygroundSection;
