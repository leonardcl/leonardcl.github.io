import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const [section, setSection] = useState<string | null>(null);
  const { pathname } = useLocation();
  const barRef = useRef<HTMLDivElement>(null);
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

  // Thin reading-progress line under the nav. Written straight to the
  // element as a transform: no re-render per scroll event, no layout.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Which section is under the middle of the screen, so its link can say
  // "you are here". The hero and footer are watched too, so nothing stays
  // lit once you scroll back to the top or down to the footer.
  useEffect(() => {
    const ids = ["home", ...links.filter((l) => l.to.startsWith("/#")).map((l) => l.to.slice(2)), "contact"];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSection(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  // Escape closes the phone menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (to: string) =>
    to === "/blog" ? pathname.startsWith("/blog") : pathname === "/" && to === `/#${section}`;

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
          {links.map((l) => {
            const active = isActive(l.to);
            return (
              <Link
                key={l.label}
                to={l.to}
                aria-current={active ? "location" : undefined}
                className={`relative font-mono text-xs transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-accent after:origin-left after:transition-transform after:duration-300 after:ease-out ${
                  active ? "text-ink after:scale-x-100" : "text-inkmuted hover:text-ink after:scale-x-0"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <a
            href={`mailto:${site.email}`}
            className="font-mono text-xs px-3 py-1.5 border border-ink text-ink hover:bg-ink hover:text-bone active:scale-[0.97] transition-[color,background-color,transform] duration-150 ease-out"
          >
            contact
          </a>
        </div>

        {/* Mobile toggle — sized to a comfortable ~44px tap target */}
        <button
          className="md:hidden font-mono text-xs text-ink px-4 py-2.5 border border-line active:scale-[0.97] transition-transform duration-150 ease-out"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? "close" : "menu"}
        </button>
      </nav>

      {/* Scroll progress */}
      <div ref={barRef} className="h-[2px] bg-accent origin-left scale-x-0" />

      {/* Mobile menu — full-width rows with real padding, each a proper
          tap target rather than inline text with gaps between */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-line bg-bone px-6 flex flex-col">
          {links.map((l, i) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              aria-current={isActive(l.to) ? "location" : undefined}
              className={`menu-in font-mono text-sm py-3.5 border-b border-line/60 transition-colors ${
                isActive(l.to) ? "text-accent" : "text-inkmuted hover:text-ink"
              }`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="menu-in font-mono text-sm text-accent py-3.5"
            style={{ animationDelay: `${links.length * 30}ms` }}
          >
            contact →
          </a>
        </div>
      )}
    </header>
  );
};

export default Nav;
