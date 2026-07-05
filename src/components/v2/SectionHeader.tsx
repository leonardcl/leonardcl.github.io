import { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeaderProps = {
  eyebrow: string; // personal question, e.g. "where has the journey taken me?"
  title: string; // upright part, e.g. "Work"
  italicTitle?: string; // italic pink part, e.g. "Experience"
  icon?: ReactNode; // section symbol — floats at the end of the rule
};

/** Pink diamond + personal eyebrow + section symbol, then a serif title out of a mask. */
const SectionHeader = ({ eyebrow, title, italicTitle, icon }: SectionHeaderProps) => (
  <Reveal>
    <div className="mb-14">
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 rotate-45 bg-blush" />
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-inkmuted">
          {eyebrow}
        </span>
        <span className="h-px flex-1 bg-line" />
        {icon && (
          <span className="section-icon text-ink w-7 h-7 sm:w-8 sm:h-8">
            {icon}
          </span>
        )}
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
