# leonardcl.github.io — 2026 Redesign

**Date:** 2026-07-05
**Status:** Approved via brainstorming session

## Goal

Brand-new visual design for Leonard's personal site. Refined, elegant, minimalist,
subtly technical. Serves three audiences: recruiters/hiring managers, potential
clients/partners (founder credibility), and readers of the blog.

## Decisions

- **Stack:** keep React 18 + Vite + Tailwind + react-router + markdown blog engine.
- **Aesthetic:** light warm off-white background (~#FAFAF7), near-black ink text,
  one restrained indigo/ink-blue accent. Departure from the old dark/cyan look.
- **Typography:** Fraunces (serif display) + Inter (body) + JetBrains Mono
  (labels, dates, tags, section numbers like `01 — Work`).
- **Motion:** subtle fade/slide on scroll only. No floating tags, no animated gradients.
- **Founder story added:** new "Now / Building" section featuring ProjekinAja +
  current role — previously missing entirely.
- **Tools kept visible:** Blessed and Gradient Descent Tool exposed via a
  "Playground" section with buttons (user explicitly requested).

## Personas

- **A. Recruiter** (30–60s skim): one-line identity, scannable work, contact one click.
- **B. Client/partner** (2–3 min trust check): Now/Building section, outcome-focused
  projects, publications as credibility.
- **C. Peer/reader** (from a blog link): beautiful article typography, path back home.

## Structure

```
/                        one-page scroll
├─ 01 Hero               name, one-liner, motto, links (GitHub · LinkedIn · Email)
├─ 02 Now / Building     ProjekinAja + current role (NEW)
├─ 03 Selected Work      5 projects, elegant cards, curated order
├─ 04 Experience         career timeline (mono dates, serif titles)
├─ 05 Publications       compact list by year
├─ 06 Writing            latest blog posts
├─ 06b Playground        buttons → Blessed · Gradient Descent Tool
└─ 07 Contact            minimal footer
/blog/:slug              redesigned article template, same markdown engine
```

- Old "Expertise" 4-card section merged into hero/about as one tight capabilities line.
- Motto kept: "Turn curiosity into systems; turn systems into impact."

## Content carried over

- 5 projects: SKYRAG, Pic2Plate, RL Retro, DingDong FER, Smart Garden (+ images in src/assets).
- Career: WaveAI (2025–), IT Smart (2021–), Dongseo Univ RA (2022–2025), Petra lab (2019–2022).
- Publications: 2025 (SKYRAG IEEE Access, Pic2Plate Sensors), 2024 (Dark Web IJIBC,
  RL Stock Trading ICATI), 2022 (Jurnal Teknik Elektro).
- Contacts: leonardchristopher002@gmail.com, github.com/leonardcl, linkedin.com/in/leonardcl.
- Content moved into clean editable data files (src/data/).

## Implementation plan

1. Branch `redesign-2026`; `main` untouched until approval.
2. Fonts via @fontsource; new Tailwind theme tokens.
3. Rebuild components: Hero, Now, Work, Experience, Publications, Writing,
   Playground, Footer, minimal NavBar.
4. Keep blog engine, Blessed, GradientDescentTool working as-is.
5. Verify: `npm run build` passes; manual check mobile + desktop; all routes work.
6. Deploy (`npm run deploy`) only on explicit user approval.
