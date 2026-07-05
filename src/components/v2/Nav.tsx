import { useState } from "react";
import { Link } from "react-router-dom";
import { site } from "../../data/site";

const links = [
  { n: "01", label: "now", to: "/#now" },
  { n: "02", label: "work", to: "/#work" },
  { n: "03", label: "experience", to: "/#experience" },
  { n: "04", label: "publications", to: "/#publications" },
  { n: "05", label: "writing", to: "/#writing" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-bone/85 backdrop-blur-md border-b border-line">
      <nav className="max-w-site mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-lg text-ink font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          leonard<span className="text-accent">cl</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="group font-mono text-xs text-inkmuted hover:text-ink transition-colors"
            >
              <span className="text-accent/60 group-hover:text-accent mr-1">{l.n}</span>
              {l.label}
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="font-mono text-xs px-3 py-1.5 border border-ink text-ink hover:bg-ink hover:text-bone transition-colors"
          >
            contact
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden font-mono text-xs text-ink px-3 py-1.5 border border-line"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "close" : "menu"}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-line bg-bone px-6 py-5 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className="font-mono text-sm text-inkmuted hover:text-ink"
            >
              <span className="text-accent mr-2">{l.n}</span>
              {l.label}
            </Link>
          ))}
          <a href={`mailto:${site.email}`} className="font-mono text-sm text-accent">
            contact →
          </a>
        </div>
      )}
    </header>
  );
};

export default Nav;
