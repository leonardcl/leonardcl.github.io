import { useEffect, useRef, useState } from "react";
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
  const brandClicks = useRef<number[]>([]);

  // Five quick clicks on the brand mark → the reward signal (a hidden nod
  // to RL, findable without a keyboard — the Konami code is the other way).
  const onBrandClick = () => {
    const now = Date.now();
    const recent = [...brandClicks.current, now].filter((t) => now - t < 1200);
    brandClicks.current = recent;
    if (recent.length >= 5) {
      brandClicks.current = [];
      window.dispatchEvent(new Event("rl-easter-egg"));
    }
  };

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
          onClick={() => {
            setOpen(false);
            onBrandClick();
          }}
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

        {/* Mobile toggle — sized to a comfortable ~44px tap target */}
        <button
          className="md:hidden font-mono text-xs text-ink px-4 py-2.5 border border-line"
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

      {/* Mobile menu — full-width rows with real padding, each a proper
          tap target rather than inline text with gaps between */}
      {open && (
        <div className="md:hidden border-t border-line bg-bone px-6 flex flex-col">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className="font-mono text-sm text-inkmuted hover:text-ink py-3.5 border-b border-line/60"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="font-mono text-sm text-accent py-3.5"
          >
            contact →
          </a>
        </div>
      )}
    </header>
  );
};

export default Nav;
