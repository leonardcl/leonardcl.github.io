type SectionHeaderProps = {
  index: string; // "01"
  title: string; // "Now"
  hint?: string; // "what i'm building"
};

/** Hairline rule + mono index + serif title. The site's structural signature. */
const SectionHeader = ({ index, title, hint }: SectionHeaderProps) => (
  <div className="border-t border-line pt-5 mb-12 flex flex-wrap items-baseline gap-x-4 gap-y-1">
    <span className="font-mono text-xs text-accent tracking-widest">{index}</span>
    <h2 className="font-display text-3xl sm:text-4xl text-ink font-medium">
      {title}
    </h2>
    {hint && (
      <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.2em] text-inkmuted">
        {hint}
      </span>
    )}
  </div>
);

export default SectionHeader;
