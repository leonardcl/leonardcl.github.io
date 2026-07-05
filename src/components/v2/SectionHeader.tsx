import Reveal from "./Reveal";

type SectionHeaderProps = {
  eyebrow: string; // small mono label, e.g. "the journey"
  title: string; // upright part, e.g. "Work"
  italicTitle?: string; // italic pink part, e.g. "Experience"
};

/** Pink diamond + mono eyebrow, then a serif title that slides out of a mask. */
const SectionHeader = ({ eyebrow, title, italicTitle }: SectionHeaderProps) => (
  <Reveal>
    <div className="mb-14">
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
          {eyebrow}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <h2 className="title-mask mt-4 font-display text-4xl sm:text-6xl text-ink font-medium leading-tight">
        <span>
          {title && <>{title}</>}
          {italicTitle && (
            <>
              {title ? " " : ""}
              <em className="font-light text-blush">{italicTitle}</em>
            </>
          )}
        </span>
      </h2>
    </div>
  </Reveal>
);

export default SectionHeader;
