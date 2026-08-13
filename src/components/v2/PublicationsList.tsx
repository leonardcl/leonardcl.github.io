import { publications } from "../../data/publications";
import { site } from "../../data/site";
import SectionHeader from "./SectionHeader";
import { IconBook } from "./Icons";
import Reveal from "./Reveal";

const PublicationsList = () => {
  let lastYear = "";
  return (
    <section id="publications" className="max-w-site mx-auto px-6 sm:px-10 py-24">
      <SectionHeader eyebrow="what have i published?" title="" italicTitle="Publications" icon={<IconBook />} />
      <div className="border-t border-line">
        {publications.map((pub) => {
          const showYear = pub.year !== lastYear;
          lastYear = pub.year;
          const inner = (
            <div className="grid sm:grid-cols-[150px_minmax(0,1fr)] gap-1 sm:gap-10 py-7 border-b border-line">
              {/* On mobile the grid collapses to one column — an empty year
                  cell would still render as a blank row, so it's dropped
                  from the layout entirely when there's nothing to show.
                  At sm+ it stays present (even empty) to hold the column. */}
              <span
                className={`font-mono text-xs text-accent pt-1 ${
                  showYear ? "block" : "hidden sm:block"
                }`}
              >
                {pub.year}
              </span>
              <div>
                <h3 className="font-display text-lg sm:text-xl text-ink leading-snug group-hover:text-accent transition-colors">
                  {pub.title}
                  {pub.link && <span className="ml-2 text-accent text-sm">↗</span>}
                </h3>
                <p className="mt-2 text-sm text-inkmuted">
                  {pub.authors} · <span className="font-mono text-xs">{pub.venue}</span>
                </p>
              </div>
            </div>
          );
          return (
            <Reveal key={pub.title}>
              {pub.link ? (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  {inner}
                </a>
              ) : (
                <div className="group">{inner}</div>
              )}
            </Reveal>
          );
        })}
      </div>
      <a
        href={site.scholar}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block font-mono text-xs text-inkmuted hover:text-accent transition-colors"
      >
        full record on Google Scholar ↗
      </a>
    </section>
  );
};

export default PublicationsList;
