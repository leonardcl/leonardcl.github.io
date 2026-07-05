import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { site } from "../../data/site";

const links = [
  { label: "about", to: "/#about" },
  { label: "work", to: "/#work" },
  { label: "experience", to: "/#experience" },
  { label: "education", to: "/#education" },
  { label: "publications", to: "/#publications" },
  { label: "blog", to: "/blog" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Thin reading-progress line under the nav
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? (doc.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-bone/85 backdrop-blur-md border-b border-line">
      <nav className="max-w-site mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-lg text-ink font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          leonard<span className="text-accent">cl</span><span className="text-blush">.</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="group font-mono text-xs text-inkmuted hover:text-ink transition-colors"
            >
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

      {/* Scroll progress */}
      <div
        className="h-[2px] bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />

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
