---
version: alpha
name: leonardcl-com
description: Visual system of leonardcl.com, Leonard Christopher Limanjaya's personal site (React 18, Vite 5, Tailwind 3.4). A warm bone-paper page with near-black ink, a Fraunces serif display voice, Inter body text and JetBrains Mono labels. One ultramarine accent carries links, focus of attention and data; a pink blush is the second voice, used for italic title words, diamonds and quote marks. Corners are square, depth is hairlines and a faint paper grain, and the motion is quiet, once-only and gated to mouse devices for hover.

colors:
  primary: "#3538CD"
  primary-dim: "#8A8CE0"
  secondary: "#D6336C"
  neutral: "#FAF9F5"
  ink: "#191918"
  ink-muted: "#6B6A64"
  hairline: "#E6E4DC"
  hairline-strong: "#C9C7BD"
  graph-line: "#D9D7CD"
  code-surface: "#F0EFE9"
  on-ink: "#FAF9F5"

typography:
  display-hero:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 96px
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: -0.025em
  display-page:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 72px
    fontWeight: 500
    lineHeight: 1.02
  headline-section:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 60px
    fontWeight: 500
    lineHeight: 1.25
  headline-row:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 30px
    fontWeight: 500
    lineHeight: 36px
  title:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 32px
  lead-serif:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 24px
    fontWeight: 300
    lineHeight: 1.625
  wordmark:
    fontFamily: "Fraunces, ui-serif, Georgia, serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.025em
  body-lg:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.625
  body-article:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.85
  body-md:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.625
  body-sm:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.625
  label-button:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-md:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  label-kicker:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0.25em
  label-eyebrow:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.3em
  label-micro:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.2em
  code:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: 0.9em
    fontWeight: 400

rounded:
  none: 0px
  code: 3px
  sm: 4px
  full: 9999px

spacing:
  gutter: 24px
  gutter-sm: 40px
  section: 64px
  section-sm: 96px
  nav-height: 56px
  scroll-offset: 80px
  site-max: 72rem
  header-gap: 40px
  header-gap-sm: 56px
  row: 32px
  row-md: 40px
  card: 32px
  card-sm: 40px

components:
  page:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  top-nav:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-md}"
    height: 56px
  top-nav-link-active:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
  nav-wordmark:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.wordmark}"
  scroll-progress:
    backgroundColor: "{colors.primary}"
    height: 2px
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.label-button}"
    rounded: "{rounded.none}"
    padding: 12px 20px
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-ink}"
  button-outline:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 6px 12px
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
  menu-toggle:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: 10px 16px
  text-link:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.label-button}"
  text-link-hover:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
  hero-kicker:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.label-kicker}"
  hero-name:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.display-hero}"
  hero-tagline:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-lg}"
  section-eyebrow:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-eyebrow}"
  section-diamond:
    backgroundColor: "{colors.secondary}"
    size: 6px
  section-title:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.headline-section}"
  section-title-italic:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.headline-section}"
  about-lead:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.lead-serif}"
  work-row:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.headline-row}"
    rounded: "{rounded.none}"
    padding: 40px 0px
  work-row-hover:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
  work-meta:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-md}"
  timeline-item:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  timeline-date-career:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
  timeline-dot:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    size: 12px
  publication-row:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: 28px 0px
  blog-card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: 40px
  blog-tag:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.label-eyebrow}"
    rounded: "{rounded.full}"
    padding: 4px 10px
  article-body:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink}"
    typography: "{typography.body-article}"
  article-link:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    typography: "{typography.body-article}"
  article-code:
    backgroundColor: "{colors.code-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.code}"
    padding: 0.15em 0.4em
  footer:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-md}"
    padding: 96px 40px
  footer-column-label:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-micro}"
  text-selection:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-ink}"
  scrollbar-thumb:
    backgroundColor: "{colors.hairline-strong}"
    rounded: "{rounded.sm}"
    width: 8px
  divider:
    backgroundColor: "{colors.hairline}"
    height: 1px
  skill-graph-edge:
    backgroundColor: "{colors.graph-line}"
    textColor: "{colors.ink}"
  unused-accent-dim:
    backgroundColor: "{colors.primary-dim}"
---

# leonardcl.com design system

The visual system of leonardcl.com, written from the repo's `tailwind.config.js`, `src/index.css`, `src/components/v2/*` and the blog stylesheet on 2026-11-08. If this file and the site's CSS ever disagree, the CSS wins: fix this file.

## Overview

leonardcl.com is a one-page portfolio plus a blog and eight small playground pages. It reads like a quiet engineering notebook printed on warm paper: a bone background (`{colors.neutral}`, Tailwind `bone`, #FAF9F5) with a 3.5% fractal-noise grain fixed over the whole viewport, near-black ink text (`{colors.ink}`, #191918), and a faint dot grid behind the hero that lights up in the accent colour under the cursor.

The voice is set by three type families with fixed jobs. **Fraunces**, a soft optical-size serif, carries every name, title and lead paragraph, often with one word in light italic. **Inter** carries running text. **JetBrains Mono** carries everything that behaves like metadata or a control: nav links, buttons, dates, tags, eyebrows, numbers. Lowercase mono labels ("email me", "github", "menu") are part of the personality.

Colour is restrained. One ultramarine (`{colors.primary}`, Tailwind `accent`, #3538CD) means "this is live": links on hover, the active nav item, the scroll progress bar, the hero kicker, career dates, text selection. One blush pink (`{colors.secondary}`, Tailwind `blush`, #D6336C) is the human, second voice: the italic word in each section title, the small rotated diamond before every eyebrow, quote marks, education dates. Nothing else on the page is saturated.

**Key characteristics**
- Warm bone canvas with grain, never pure white.
- Serif display at weight 500, with a light (300) italic word in blush for contrast inside the same heading.
- Mono lowercase for every control and every piece of metadata.
- Square corners everywhere; the only round shapes are dots, the blog tag pill and inline code.
- Hairline borders (`{colors.hairline}`) and whitespace do the structuring; there are no filled cards on the home page.
- Motion is a short rise on first view, a few decorative loops that pause off screen, and hover effects that exist only for a mouse.

## Colors

The Tailwind theme (`tailwind.config.js`, `theme.extend.colors`) defines seven colours. The YAML names map to them as shown.

### Brand
- **Ultramarine / Primary** (`{colors.primary}`, Tailwind `accent`, #3538CD): links on hover, active nav underline, the 2px scroll progress bar, hero kicker, career timeline line and dates, publication years, lit hero dots, `::selection` background, scrollbar thumb on hover, bold text inside blog articles. Contrast on bone 7.67:1.
- **Accent Dim** (`{colors.primary-dim}`, Tailwind `accentdim`, #8A8CE0): defined in the theme but used by no component. See Known Gaps.
- **Blush / Secondary** (`{colors.secondary}`, Tailwind `blush`, #D6336C): italic word in section titles and the footer heading, the 6px rotated diamond before eyebrows, hero quote marks, the education timeline line and dates, blog tag pill text, the "·" separators in the footer motto, link hover inside articles, the italic "0" of the 404 page, the pulsing diamond of the route loader. Contrast on bone 4.38:1, which passes for large text only.

### Surface
- **Bone / Neutral** (`{colors.neutral}`, Tailwind `bone`, #FAF9F5): page background, set three times (inline on `<html>` and `<body>`, and `!important` in `index.css`) so no white flash shows before CSS loads; also `theme-color`, scrollbar track and the fill inside timeline dots. The nav uses it at 85% opacity with `backdrop-blur-md`; blog cards at 60% with `backdrop-blur-sm`.
- **Code Surface** (`{colors.code-surface}`, #F0EFE9): inline `code` and `pre` blocks in blog articles only.
- **On Ink** (`{colors.on-ink}`, #FAF9F5): the same bone, used as text on ink and on ultramarine fills.

### Text
- **Ink** (`{colors.ink}`, Tailwind `ink`, #191918): headings, body in articles, primary button fill. Contrast on bone 16.70:1. Opacity variants appear in a few places: `ink/90` (About lead), `ink/80` (hero quote), `ink/70` (footer motto).
- **Ink Muted** (`{colors.ink-muted}`, Tailwind `inkmuted`, #6B6A64): body copy on the home page, nav links at rest, metadata, eyebrows, footer links. Contrast on bone 5.15:1.

### Lines
- **Hairline** (`{colors.hairline}`, Tailwind `line`, #E6E4DC): every border and divider: nav bottom edge, section rules, work and publication row separators, thumbnails, blog card border, article image and `pre` borders, `hr`.
- **Hairline Strong** (`{colors.hairline-strong}`, #C9C7BD): the resting 1px underline of `.u-link`, the scrollbar thumb and the Firefox scrollbar colour.
- **Graph Line** (`{colors.graph-line}`, #D9D7CD): edges of the hero skill constellation (`SkillConstellation.tsx`).

### Decorative tints
These live in component code, not in the theme, and are listed so nobody re-invents them: blobs are `accent/10` and `blush/10` radial pools; hero dots are ink at 8% and 4%, lit dots ultramarine at 55% and 25%; the work-row hover wash is ultramarine at 4%; the footer globe uses ultramarine gradients at 14% to 0% and a pale periwinkle `#A9ADF4` for its orbit points.

## Typography

### Families
Loaded from Google Fonts in `index.html`, non-blocking (`media="print"` swapped to `all` on load, `display=swap`):
- **Fraunces** (variable: optical size 9 to 144, weight 300 to 700, roman and italic). Tailwind `font-display`.
- **Inter** (variable: optical size 14 to 32, weight 300 to 700, roman and italic). Tailwind `font-sans`, the default on `.App`.
- **JetBrains Mono** (weight 300 to 700, roman and italic). Tailwind `font-mono`.
- **Quicksand** is also requested and mapped to `font-quicksand`, but no component uses it. See Known Gaps.

Fallbacks are Tailwind's default serif, sans and mono stacks.

### Scale

| Token | Family | Size | Weight | Line height | Tracking | Where |
|---|---|---|---|---|---|---|
| `{typography.display-hero}` | Fraunces | `clamp(2.75rem, 7.2vw, 6rem)`, so 44px to 96px | 500; middle line italic 300 | 0.95 | -0.025em | Hero name, three stacked lines |
| `{typography.display-page}` | Fraunces | 48px, 72px from `sm` | 500; second line italic 300 blush | 1.02 | 0 | Blog index title |
| `{typography.headline-section}` | Fraunces | 36px, 60px from `sm` | 500; italic word 300 blush | 1.25 | 0 | Section titles, footer "Let's build something." |
| `{typography.headline-row}` | Fraunces | 24px, 30px from `sm` | 500 | 36px | 0 | Work row titles |
| `{typography.title}` | Fraunces | 20px, 24px from `sm` | 500 | 32px | 0 | About domain titles, timeline titles, publication titles (18px to 20px) |
| `{typography.lead-serif}` | Fraunces | 20px, 24px from `sm` | 300 | 1.625 | 0 | First About paragraph; hero quote uses the same size in italic 400 at `ink/80` |
| `{typography.wordmark}` | Fraunces | 18px | 600 | 28px | -0.025em | "leonard**cl**." with `cl` in ultramarine and the dot in blush |
| `{typography.body-lg}` | Inter | 18px, 20px from `sm` | 400 | 1.625 | 0 | Hero tagline |
| `{typography.body-article}` | Inter | 17px (1.0625rem) | 400 | 1.85 | 0 | Blog article body |
| `{typography.body-md}` | Inter | 16px | 400 | 1.625 | 0 | Default body, project descriptions |
| `{typography.body-sm}` | Inter | 15px | 400 | 1.625 | 0 | About notes, timeline bullet points |
| `{typography.label-button}` | JetBrains Mono | 14px | 400 | 20px | 0 | Hero buttons and text links |
| `{typography.label-kicker}` | JetBrains Mono | 12px, 14px from `sm` | 400 | 20px | 0.25em, uppercase | Hero kicker, ultramarine |
| `{typography.label-md}` | JetBrains Mono | 12px | 400 | 16px | 0 to 0.025em | Nav links, dates, tags, row numbers, footer links |
| `{typography.label-eyebrow}` | JetBrains Mono | 11px | 400 | 16px | 0.3em, uppercase | Section eyebrows, blog tag (0.2em) |
| `{typography.label-micro}` | JetBrains Mono | 10px | 400 | 16px | 0.2em, uppercase | Footer column labels, reward-signal caption |
| `{typography.code}` | JetBrains Mono | 0.9em | 400 | inherit | 0 | Inline code in articles |

Blog article headings (`markdown-styles.module.css`) are Fraunces 500: h1 2.5em / 1.1, h2 1.75em / 1.2, h3 1.35em. Bold inside articles is weight 600 in ultramarine; blockquotes are italic ink-muted with a 2px blush left rule.

### Principles
- Serif for names and titles, sans for reading, mono for anything a reader scans or clicks. Do not swap these roles.
- Emphasis inside a heading is a light italic word in blush, not bold.
- Mono labels are lowercase in running UI ("email me", "contact", "menu") and uppercase only when tracked wide as an eyebrow or kicker.
- On touch screens every `input`, `select` and `textarea` is forced to 16px so iOS does not zoom on focus.

## Layout

- **Container:** `max-w-site` = 72rem (1152px), centred, with 24px side padding (`px-6`) that grows to 40px from 640px (`sm:px-10`). The blog article column is narrower, `max-w-3xl` (48rem).
- **Section rhythm:** 64px top and bottom (`py-16`), 96px from `sm` (`py-24`). Section headers sit 40px above their content, 56px from `sm`.
- **Nav:** fixed, 56px tall (`h-14`); `scroll-padding-top: 80px` keeps anchored headings clear of it. The hero adds 96px top padding (`pt-24`) for the same reason; the blog index adds 144px (`pt-36`).
- **Grids:** hero `6fr / 6fr` from `lg` with a 40px gap; About `5fr / 7fr` from `lg` with an 80px gap, and its four domains in a 2-column grid from `sm`; work rows `1fr / 260px` from `md` with a 48px gap; publications `150px / 1fr` from `sm` with a 40px gap; footer heading `7fr / 5fr` from `lg`; footer link columns 3-up from `sm`.
- **Rows, not cards:** Work, Experience and Publications are lists separated by hairlines. Work rows are 32px tall padding top and bottom, 40px from `md`; publication rows 28px.
- **Spacing scale:** Tailwind's default 4px scale. The values that recur are 24, 32, 40, 56, 64 and 96px; the YAML `spacing` block records those.

## Elevation & Depth

The home page is flat. Depth comes from three quiet layers instead of shadows:

| Layer | Treatment | Where |
|---|---|---|
| Paper grain | Fixed SVG fractal noise at 3.5% opacity, `z-index: 9999`, `pointer-events: none` | Whole viewport, every page |
| Colour pools | `.blob` radial gradients in `accent/10` or `blush/10`, drifting on an 18s loop | Hero corners, footer corner, blog index |
| Frosted bar | `bg-bone/85` plus `backdrop-blur-md` and a hairline bottom border | Fixed nav |
| Hairlines | 1px `{colors.hairline}` | All structure |
| Tilt lift | `perspective: 900px`, inner content `translateZ(28px)` on hover, `shadow-xl` tinted `accent/5`, border to `accent/50` | Blog post cards only, mouse only |

The hero adds a faint 26px dot grid (ink at 8%) masked to fade at the edges, and a second grid of ultramarine dots visible only inside a 240px spotlight that follows the cursor through two CSS variables (`--mx`, `--my`).

## Shapes

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Default for everything: buttons, thumbnails, rows, blog cards, the menu toggle |
| `{rounded.code}` | 3px | Inline code in articles |
| `{rounded.sm}` | 4px | Scrollbar thumb; a few controls inside playground pages |
| `{rounded.full}` | 9999px | Timeline dots, the blog tag pill, sliders and markers in playground pages |

Other recurring shapes: the **diamond**, a 6px square rotated 45 degrees in blush, marks every section eyebrow and the blog article header (a 10px version pulses on the route loader); the **↗ arrow** marks external links; line icons are 24×24, stroke 1.6, round caps and joins, `currentColor` (`Icons.tsx`), and bob gently on a 4.5s loop beside section titles.

Project thumbnails are photos cropped `object-cover` at 160px tall (176px on phones), shown in greyscale on desktop and turning to colour with a 1.04 scale on hover.

## Components

### Navigation
**`top-nav`**: fixed bar, 56px, bone at 85% with blur and a hairline bottom border. Left: the Fraunces wordmark (`nav-wordmark`). Right from `md`: lowercase mono links at 12px in ink-muted, 28px apart; the link for the section under the middle of the screen turns ink and gets a 1px ultramarine underline that scales in from the left (`top-nav-link-active`, `aria-current="location"`). A `contact` outline button closes the row. Under the bar sits **`scroll-progress`**, a 2px ultramarine line whose `scaleX` follows page scroll.

**Phone menu**: below `md` a `menu` / `close` toggle (`menu-toggle`, hairline border, 10px by 16px padding) opens a full-width list of 14px mono rows, each 14px padded with a hairline between, dropping in with a 30ms stagger. The active row is ultramarine. Escape closes it.

### Buttons and links
**`button-primary`** ("email me"): ink fill, bone text, mono 14px, 12px by 20px padding, square, 1px ink border. Hover fills ultramarine; press scales to 0.97. 150ms ease-out on colour, border and transform. The 404 page's "back to home" is the same button in 12px uppercase mono with 0.2em tracking and 12px by 24px padding.

**`button-outline`** ("contact" in the nav): 1px ink border, ink text, mono 12px, 6px by 12px padding. Hover inverts to ink fill and bone text.

**`text-link`** (`.u-link`): mono or body text with a 1px `{colors.hairline-strong}` underline 4px below. On mouse hover a 2px blush-to-ultramarine gradient sweeps across it, the text turns ultramarine and lifts 2px (0.5s, `cubic-bezier(0.22, 1, 0.36, 1)`).

Plain footer and metadata links are mono 12px ink-muted and turn ultramarine on hover. On touch they get 8px vertical padding (`[@media(pointer:coarse)]:py-2`) for a bigger target.

### Hero
**`hero-kicker`** (role and location, mono, uppercase, 0.25em tracking, ultramarine) → **`hero-name`** (three Fraunces lines; "Christopher" in light italic) → **`hero-tagline`** (Inter 18 to 20px, ink-muted, max 36rem) → a Fraunces italic quote with blush quote marks → the button row. From `lg` the right half holds the interactive skill constellation; below `lg` it is replaced by one static mono line of capabilities.

### Section header
**`section-eyebrow`** row: blush diamond (`section-diamond`), a lowercase personal question in uppercase-tracked mono ("what have i created?"), a hairline rule filling the row, and a line icon. Below it the **`section-title`** in Fraunces with the last word as **`section-title-italic`** (light italic blush), revealed by sliding up out of an `overflow: hidden` mask.

### Lists
**`work-row`**: full-width link. Two-digit mono number, Fraunces title with a ↗ that appears on mouse hover (always visible on touch), Inter description, mono `year · tags` line (`work-meta`), and a 260px greyscale thumbnail from `md`. Hover: title and number turn ultramarine and shift 4px right, a 4% ultramarine wash fades in behind the row, the thumbnail regains colour.

**`timeline-item`**: a 2px vertical line (gradient from the tone colour through 50% to hairline) that draws downward on first view, a 12px bone dot with a 2px tone border centred on it, a mono date in the tone colour, a Fraunces title with the organisation in Inter ink-muted, and em-dash bullet points. Career uses ultramarine (`timeline-date-career`, `timeline-dot`); education uses blush.

**`publication-row`**: mono year in ultramarine (shown once per year group), Fraunces title with ↗ when linked, Inter authors with a mono venue.

### Blog
**`blog-card`**: hairline border, bone at 60% with a light blur, 32px padding (40px from `sm`), square. A **`blog-tag`** pill (1px border at `blush/30`, blush mono 11px uppercase), mono date and reading time, Fraunces 24px to 32px title, Inter excerpt, "read article →" in mono 14px. Mouse hover tilts the card in 3D and lifts its contents.

**`article-body`**: 48rem column, Inter 17px with 1.85 line height. **`article-link`**: ultramarine, 1px underline offset 3px, blush on hover. **`article-code`**: `{colors.code-surface}` with 3px corners; `pre` blocks add a hairline border and scroll horizontally. Images are capped at 32em and 90% width with a hairline border. Syntax colours come from highlight.js `a11y-light`; maths from KaTeX.

### Footer
**`footer`**: hairline top border, 96px vertical padding from `sm`. A mono uppercase "shall we talk?" eyebrow in ultramarine, the Fraunces headline with a blush italic word, the animated hand-and-globe illustration, the email as a `.u-link`, then three columns: wordmark, "elsewhere" links, "playground" links (`footer-column-label` headings in 10px mono). Last line: copyright in 11px mono and the motto glyphs "悟 · 修 · 成" in Fraunces with blush dots.

### Small system details
**`text-selection`**: ultramarine background, bone text. **`scrollbar-thumb`**: 8px WebKit scrollbar, hairline-strong thumb with 4px corners, ultramarine on hover; Firefox uses `scrollbar-width: thin` with the same colours. **`divider`**: 1px hairline.

## Do's and Don'ts

### Do
- Keep the canvas bone (#FAF9F5) with the grain overlay. Set it on `html` and `body` as well as in Tailwind so a slow load never flashes white.
- Use `{colors.primary}` for one meaning: live, active or linked. Use `{colors.secondary}` for one meaning: the personal second voice (italic words, diamonds, quote marks, education).
- Put names and titles in Fraunces 500, reading text in Inter, controls and metadata in lowercase JetBrains Mono.
- Separate content with hairlines and whitespace. Prefer a row list over a grid of cards.
- Keep corners square unless the shape is a dot or a pill tag.
- Gate every hover effect to mouse devices. Tailwind's `future.hoverOnlyWhenSupported` does this for `hover:` utilities; hand-written CSS uses `@media (hover: hover) and (pointer: fine)`.
- Give touch users the information hover would have shown (the ↗ on work rows stays visible on touch) and an `:active` opacity of 0.6 as press feedback.
- Use blush only at 24px and above, or as decoration, until its contrast gap is fixed.

### Don't
- Don't add a global `* { transition }`. It was removed on purpose; each element names the properties it animates.
- Don't start a new `requestAnimationFrame` loop by hand. Use `src/components/v2/useFrameWhileVisible.ts`, which only ticks while the element is on screen (a `display: none` element still runs a bare rAF loop).
- Don't drive per-frame or per-mousemove updates through React state. Write to a ref or a CSS variable, as the hero spotlight and nav progress bar do.
- Don't use pure white, pure black, a third saturated colour or gradients outside the existing link sweep, blobs and timeline lines.
- Don't round buttons, rows or thumbnails.
- Don't fade the hero name in from opacity 0: it is the largest paint, and `.rise-blur-visible` deliberately animates only position and blur so first paint is not held back.
- Don't use the Quicksand family or the legacy Tailwind keyframes (`float`, `moveLeft`, `fade`) for new work.

## Responsive Behavior

| Breakpoint (Tailwind default) | Width | Changes |
|---|---|---|
| base | under 640px | 24px gutters; 64px section padding; hero kicker breaks onto two lines; work thumbnail full width above the text; skills shown as a static mono line; one-column everything |
| `sm` | 640px | 40px gutters; 96px section padding; larger titles; About domains 2-up; publications get the 150px year column; footer links 3-up |
| `md` | 768px | Desktop nav replaces the menu toggle; work rows switch to text plus 260px greyscale thumbnail |
| `lg` | 1024px | Hero splits 6/6 and shows the skill constellation; About splits 5/7; footer heading and globe side by side |

Touch handling (`index.css`): no tap highlight, `touch-action: manipulation` on links and controls (no double-tap delay), no font inflation, 16px form fields on coarse pointers, range sliders padded to a 27px touch height while the drawn track stays 3px.

## Motion

Easing is almost always `cubic-bezier(0.22, 1, 0.36, 1)` (a soft ease-out). Springy pops use `cubic-bezier(0.34, 1.56, 0.64, 1)`.

- **Scroll reveal** (`Reveal.tsx`, `.reveal`): opacity 0 and 16px down to resting, 0.7s, once, when 12% of the element is visible. Lists stagger with `transitionDelay` (60 to 100ms per item, capped at 240 to 320ms).
- **Hero entrance**: `.rise-blur` (30px rise, 6px blur, fade, 1.1s) staggered 100ms to 850ms; the name uses `.rise-blur-visible` with no fade so it counts as painted immediately.
- **Title mask**: section titles slide up 110% inside an `overflow: hidden` mask, 1s.
- **Timeline**: line scales from the top over 1.6s; dots pop in at 0.2s.
- **Hover** (mouse only): 150ms for buttons, 300ms for title colour and shifts, 0.5s for the link underline sweep, 0.7s for thumbnail colour and scale.
- **Ambient loops**: blobs 18s, section icons 4.5s, footer globe float and levitation ring 4.5s, hand wave 4.2s. The hero constellation and footer globe run on `useFrameWhileVisible`, so they stop off screen and cost nothing on phones where they are hidden.
- **Phone menu**: rows drop 6px in 220ms with a 30ms stagger; closing is instant.
- **Scrolling**: `scroll-behavior: smooth` on `html`; hash links scroll into view after an 80ms delay on route change.
- **Reduced motion**: under `prefers-reduced-motion: reduce` every animation and transition is cut to 0.01ms and one iteration, smooth scroll is off and `.reveal` content is shown resolved; the JS loops read `prefersReducedMotion()` once per mount.

```yaml
motion:
  ease-out: cubic-bezier(0.22, 1, 0.36, 1)        # reveals, hero, links, tilt, menu
  ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)  # timeline dot, constellation node, tic-tac-toe cells
  duration-press: 150ms        # buttons: colour, border, scale 0.97
  duration-hover: 300ms        # title colour and shifts, icon nudges
  duration-menu: 220ms         # phone menu rows, 30ms stagger, no exit animation
  duration-link-sweep: 500ms   # .u-link underline
  duration-reveal: 700ms       # .reveal, 16px rise, once, threshold 0.12
  duration-hero: 1100ms        # .rise-blur / .rise-blur-visible, 30px rise, 6-8px blur
  duration-title-mask: 1000ms
  duration-timeline: 1600ms
  stagger-list: 60-100ms per item, capped at 240-320ms
  ambient-loops: blob 18s, icon bob 4.5s, globe float 4.5s, hand wave 4.2s
  reduced-motion: all animations and transitions 0.01ms, one iteration; smooth scroll off; reveals resolved; JS loops check prefersReducedMotion()
```

Easter eggs share the system: five quick clicks on the wordmark (or the Konami code) send a small RL agent on a bicycle across the screen (`RewardSignal.tsx`).

## Iteration Guide

1. Start from the Tailwind theme names (`bone`, `ink`, `inkmuted`, `line`, `accent`, `blush`) in code; the YAML names here are their spec-friendly aliases.
2. New section: wrap it in `max-w-site mx-auto px-6 sm:px-10 py-16 sm:py-24`, open with `SectionHeader` (eyebrow question, title, italic word, icon) and wrap its blocks in `Reveal`.
3. New list: hairline-separated rows with a mono number or date, a Fraunces title and Inter body.
4. New animation: decide whether it must run at all, gate hover to mouse, use the shared easing, register it under the reduced-motion rule, and use `useFrameWhileVisible` for anything per-frame.
5. Check contrast with a script before using a colour for small text.

## Known Gaps

- **Blush small text fails WCAG AA.** #D6336C on #FAF9F5 is 4.38:1 (AA needs 4.5:1 below 24px, or 18.66px bold). It passes for the large italic title words but is used at 11px to 12px for education timeline dates, the blog tag pill and the reward-signal caption. Not changed here.
- **Faded muted text fails AA.** Timeline bullet points use `text-inkmuted/90`, which blends to about #797872 on bone: 4.20:1 at 15px. Not changed here.
- **`accentdim` (#8A8CE0) is defined but unused** (2.89:1 on bone, so it could not carry text anyway). It is listed as `{colors.primary-dim}` only to match the Tailwind config.
- **Quicksand is still loaded from Google Fonts** and mapped to `font-quicksand`, but nothing uses it. The Tailwind comment calls it "legacy pages"; those pages now use the v2 palette and fonts.
- **Unused keyframes**: Tailwind defines `riseIn`, `float`, `moveLeft` and `fade`; no component uses them. `App.css` still holds Vite starter rules (`.logo`, `.card`, `.read-the-docs`) that match nothing on the site.
- **Smooth scroll is declared twice** (`index.css` and `App.css`); harmless, but the second copy is redundant.
- **No focus-visible style is defined.** Keyboard focus falls back to the browser default outline.
- **Lint warnings left on purpose:** `contrast-ratio` on `section-title-italic` and `blog-tag` (blush on bone, 4.38:1). The title word is 36px to 60px and passes the 3:1 large-text bar; the tag is 11px and is the real failure above.
- **`token-like-ignored` lint warning on `motion`:** the motion values sit in a fenced yaml block in the Motion section on purpose; the spec has no motion group, so the linter notes the block and ignores it.
- The linter's contrast check needs a solid background, so components that sit straight on the page list `{colors.neutral}` as their background even where the CSS sets none.
- **Menu toggle is under 44px.** Its code comment aims for a ~44px tap target, but 12px mono with a 16px line, 10px vertical padding and a 1px border comes to about 38px tall.
- Hero cloud labels can collide while the constellation rotates, and the phone capabilities line can wrap with a leading "·" (noted on 2026-11-05, not fixed).
