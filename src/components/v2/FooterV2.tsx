import { Link } from "react-router-dom";
import { site } from "../../data/site";
import Reveal from "./Reveal";
import { IconPlane } from "./Icons";
import HandGlobe from "./HandGlobe";

const FooterV2 = () => (
  <footer id="contact" className="relative border-t border-line mt-12 overflow-hidden">
    {/* Quiet ambient color in the corner */}
    <div className="blob w-[360px] h-[360px] -bottom-40 -right-24 bg-accent/10" />

    <div className="relative max-w-site mx-auto px-6 sm:px-10 py-24">
      <Reveal>
        <div className="footer-cta grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 items-center">
          <div>
            <div className="flex items-center gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                shall we talk?
              </p>
              <span className="section-icon text-ink w-6 h-6">
                <IconPlane />
              </span>
            </div>
            <h2 className="mt-6 font-display text-4xl sm:text-6xl text-ink font-medium leading-tight">
              Let's build
              <br />
              <span className="italic font-light text-blush">something.</span>
            </h2>
          </div>
          <div className="hidden lg:block">
            <HandGlobe />
          </div>
        </div>
        <a
          href={`mailto:${site.email}`}
          className="mt-8 inline-block u-link font-mono text-sm sm:text-base text-ink"
        >
          {site.email}
        </a>

        <p className="mt-8 max-w-xl text-inkmuted leading-relaxed">
          Looking for a mentor? Find me at{" "}
          <a
            href="https://projekinaja.com"
            target="_blank"
            rel="noopener noreferrer"
            className="u-link font-medium text-ink"
          >
            ProjekinAja
          </a>
          . Have a project to ship?{" "}
          <a
            href="https://studio.projekinaja.com"
            target="_blank"
            rel="noopener noreferrer"
            className="u-link font-medium text-ink"
          >
            ProjekinAja Studio
          </a>{" "}
          builds it with you.
        </p>
      </Reveal>

      <div className="mt-20 pt-6 border-t border-line grid sm:grid-cols-3 gap-8">
        <div>
          <span className="font-display text-ink font-semibold">
            leonard<span className="text-accent">cl</span><span className="text-blush">.</span>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-inkmuted">
            elsewhere
          </span>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            github ↗
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            linkedin ↗
          </a>
          <Link
            to="/blog"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            blog →
          </Link>
        </div>

        <div className="flex flex-col">
          <span className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-inkmuted">
            playground
          </span>
          <Link
            to="/play-the-air"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            play the air →
          </Link>
          <Link
            to="/fog-of-war"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            breaking the fog →
          </Link>
          <Link
            to="/tictactoe-rl"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            teach it to play →
          </Link>
          <Link
            to="/rag-pipeline"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            rag pipeline →
          </Link>
          <Link
            to="/gradient-descent"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            gradient descent tool →
          </Link>
          <Link
            to="/boids"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            boids swarm →
          </Link>
          <Link
            to="/pixel-cam"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            pixel camera →
          </Link>
          <Link
            to="/blessed"
            className="inline-block py-1 [@media(pointer:coarse)]:py-2 font-mono text-xs text-inkmuted hover:text-accent transition-colors w-fit"
          >
            daily verse →
          </Link>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="font-mono text-[11px] text-inkmuted">
          © {new Date().getFullYear()} {site.name}
        </p>
        <p
          className="font-display text-base text-ink/70 tracking-[0.35em] cursor-default hover:text-ink transition-colors"
          title="悟 awaken · 修 cultivate · 成 accomplish"
        >
          悟 <span className="text-blush">·</span> 修 <span className="text-blush">·</span> 成
        </p>
      </div>
    </div>
  </footer>
);

export default FooterV2;
