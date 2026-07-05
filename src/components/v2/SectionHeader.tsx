import Reveal from "./Reveal";

type SectionHeaderProps = {
  index: string; // "01"
  title: string; // "Work"
  hint?: string; // "things i've shipped"
};

/** Hairline rule + mono index + serif title that slides up out of a mask. */
const SectionHeader = ({ index, title, hint }: SectionHeaderProps) => (
  <Reveal>
    <div className="border-t border-line pt-5 mb-14 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <span className="font-mono text-xs text-accent tracking-widest">{index}</span>
      <h2 className="title-mask font-display text-3xl sm:text-5xl text-ink font-medium">
        <span>{title}</span>
      </h2>
      {hint && (
        <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-inkmuted">
          {hint}
        </span>
      )}
    </div>
  </Reveal>
);

export default SectionHeader;
