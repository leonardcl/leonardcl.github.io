import { site } from "../../data/site";
import Reveal from "./Reveal";

const FooterV2 = () => (
  <footer id="contact" className="border-t border-line mt-12">
    <div className="max-w-site mx-auto px-6 sm:px-10 py-24">
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
          07 — contact
        </p>
        <h2 className="mt-6 font-display text-4xl sm:text-6xl text-ink font-medium leading-tight">
          Let's build
          <br />
          <span className="italic font-light">something.</span>
        </h2>
        <a
          href={`mailto:${site.email}`}
          className="mt-8 inline-block u-link font-mono text-sm sm:text-base text-ink"
        >
          {site.email}
        </a>
      </Reveal>

      <div className="mt-20 pt-6 border-t border-line flex flex-wrap items-center gap-x-8 gap-y-3">
        <span className="font-display text-ink font-semibold">
          leonard<span className="text-accent">cl</span>
        </span>
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-inkmuted hover:text-accent transition-colors"
        >
          github
        </a>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-inkmuted hover:text-accent transition-colors"
        >
          linkedin
        </a>
        <span className="ml-auto font-mono text-[11px] text-inkmuted">
          © {new Date().getFullYear()} — {site.motto[0].toLowerCase()}{" "}
          {site.motto[1].replace(".", "").toLowerCase()}
        </span>
      </div>
    </div>
  </footer>
);

export default FooterV2;
