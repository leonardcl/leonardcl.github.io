import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const toys = [
  {
    to: "/gradient-descent",
    label: "gradient descent tool",
    description: "An interactive visualization of how optimizers find minima.",
  },
  {
    to: "/blessed",
    label: "blessed",
    description: "A small corner of gratitude.",
  },
];

const Playground = () => (
  <section id="playground" className="max-w-site mx-auto px-6 sm:px-10 py-24">
    <SectionHeader index="06" title="Playground" hint="interactive toys" />
    <div className="grid sm:grid-cols-2 gap-6">
      {toys.map((toy, i) => (
        <Reveal key={toy.to} delay={i * 120}>
          <Link
            to={toy.to}
            className="group block border border-line p-8 hover:border-accent transition-colors duration-300"
          >
            <span className="font-mono text-sm text-ink group-hover:text-accent transition-colors">
              → {toy.label}
            </span>
            <p className="mt-3 text-sm text-inkmuted leading-relaxed">
              {toy.description}
            </p>
          </Link>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Playground;
