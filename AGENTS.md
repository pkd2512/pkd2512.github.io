# AGENTS.md — Design System Instructions

This file gives any AI coding assistant (Claude, Cursor, Copilot, Aider, Codex, etc.) working in this repo the visual design language of this site, so generated code, copy, or design mockups stay on-brand. It was extracted directly from the live source tokens — see `src/lib/styles/vars/` and `src/lib/components/ui/Logo/index.svelte` — so treat it as ground truth, not a guess.

Scope: this covers color, typography, spacing, grid, the logo mark, and two shared surface effects. It intentionally does **not** cover page-specific components (Navbar, ProjectCard, PhotoPile, AwardBadge, Modal, ParallaxHero, etc.) — those are layout/interaction code tied to this one site's pages, not reusable visual language. Read the component's own `index.svelte` if you need to touch one of those.

A rendered visual reference (swatches, type specimen, logo on light/dark) lives at `design/design-system.html` in this repo — open it in a browser for a quick visual check against the values below.

---

## Logo / Mark

Single abstract monogram — two interlocking curved shapes reading as a stylized "P + D" (Prasanta Dutta). No wordmark is baked into the mark; pair it with the name set in Montserrat when a name needs to appear alongside it. Default fill `#41295a` (purple-soft); use white on dark/colored backgrounds.

Component: `src/lib/components/ui/Logo/index.svelte` (props: `colour`, `size`).

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 575 575">
  <g fill="#41295a">
    <path d="M368,480c61.76,0,112-50.24,112-112V208c0-6.83-4.28-12.66-10.31-14.96-.04-.01-.05-.06-.02-.09l10.31-10.3s.02-.02,.02-.04V48.5c0-8.65-6.65-16.11-15.29-16.48-9.17-.4-16.71,6.91-16.71,15.98v121.35s0,.03-.02,.04l-191.98,191.98,112,118.63Z"/>
    <path d="M208,96c-61.76,0-112,50.24-112,112v160c0,6.86,4.32,12.71,10.39,14.99l-10.39,10.38v134.63c0,8.84,7.16,16,16,16s16-7.16,16-16v-121.37l192-192v-6.63c0-61.76-50.24-112-112-112Z"/>
  </g>
</svg>
```

---

## Color Palette

Defined in `src/lib/styles/vars/_colours.scss` as CSS custom properties on `:where(html)`.

| Role | CSS var | Hex |
|---|---|---|
| Primary text | `--black` | `#231d25` |
| Headings / softer text | `--black-soft` | `#423a4b` |
| Surface / cards | `--white` | `#ffffff` |
| Page background | `--white-soft` | `#fafafa` |
| Muted / secondary | `--gray` | `#999999` |
| Dividers / borders | `--gray-soft` | `#eeeeee` |
| Brand accent (deep) | `--purple` | `#2f0743` |
| Brand accent (mid) | `--purple-soft` | `#41295a` |

Rules of use:
- `--purple` is the link color and the `::selection` background (with white text).
- `--purple-soft` is the primary interactive fill — logo, buttons.
- Headings use `--black-soft`, never pure `--black`.
- Page background is `--white-soft` (`#fafafa`), never pure white; `--white` is for cards/panels sitting on top of it.
- No red/green/yellow accents exist anywhere in the system — stay within purple + near-black + gray.

---

## Typography

Defined in `src/lib/styles/vars/_typography.scss`. Loaded in `src/app.html` — Hind, Erode, Montserrat via Fontshare; Courier Prime via Google Fonts.

| Role | Typeface | CSS var | Used for |
|---|---|---|---|
| Body / UI | Hind | `--font-sans` | nav, buttons, small text, base font-family |
| Body copy | Erode | `--font-serif` | paragraphs, list items, blockquotes, captions |
| Display / headings | Montserrat | `--font-display` | h1, section labels, button labels, citations |
| Monospace | Courier Prime | `--font-mono` | code, `pre`, `kbd` |

Caution: Hind and Erode are Fontshare-only, not on Google Fonts — don't assume they're available outside this repo's font-loading setup. Montserrat and Courier Prime are both on Google Fonts.

Weights: `--font-weight-light` 300, `--font-weight-regular` 400, `--font-weight-medium` 500, `--font-weight-bold` 700.

Letter spacing: `--letter-spaced` 0.5px, `--letter-spaced-more` 1px.

Line height: `--line-height-regular` 1.5 (body), `--line-height-medium` 1.25 (most headings), `--line-height-tight` 1 (h1, h3).

Fluid type scale (`--font-size--2` through `--font-size-4`, clamp()-based, scales between 321px and 1013px viewport):

| Token | Min (mobile) | Max (desktop) | Typical use |
|---|---|---|---|
| `--font-size--2` | 11px | 11.5px | fine print |
| `--font-size--1` | 14.4px | 15.6px | small text, button labels |
| `--font-size-0` | 18px | 22px | body copy (base) |
| `--font-size-1` | 22.5px | 31.1px | h3 |
| `--font-size-2` | 28.1px | 44px | h2 |
| `--font-size-3` | 35.2px | 62.2px | large display |
| `--font-size-4` | 43.9px | 87.9px | h1 |

Applied heading rules (`src/lib/styles/defaults/index.scss`):
- **h1**: Montserrat, `--font-size-4`, tight line-height, `--black-soft`
- **h2**: Hind medium, `--font-size-2`, medium line-height, letter-spacing −0.5px, `--black-soft`
- **h3**: Hind regular, `--font-size-1`, tight line-height, `--black-soft`
- **h4–h6**: Hind bold, `--font-size-0`
- **body/p**: Erode regular, `--font-size-0`, line-height 1.5
- **section eyebrow label** (`sectionTitle` mixin): Montserrat medium, `--font-size--1`, uppercase, letter-spacing 1px, centered, short horizontal rule beneath

---

## Spacing Scale

Defined in `src/lib/styles/vars/_spacing.scss`. Fluid, scales between 321px and 1013px viewport. Prefer these tokens over arbitrary padding/margin values.

| Token | Min | Max |
|---|---|---|
| `--space-3xs` | 5px | 6px |
| `--space-2xs` | 9px | 11px |
| `--space-xs` | 14px | 17px |
| `--space-s` | 18px | 22px |
| `--space-m` | 27px | 33px |
| `--space-l` | 36px | 44px |
| `--space-xl` | 54px | 66px |
| `--space-2xl` | 72px | 88px |
| `--space-3xl` | 108px | 132px |

One-up pairs (e.g. `--space-s-l`, `--space-xs-s`) are also defined for cases needing an interpolated in-between value — see the file for the full list.

---

## Layout Grid & Breakpoints

Defined in `src/lib/styles/_grid.scss` and `src/lib/styles/vars/_media-sizes.scss` / `_custom-media.css`.

- 12-column grid (`--grid-columns: 12`), 4 sub-columns on mobile (`--grid-subs: 4`).
- Max content width: `--grid-max-width: 63.31rem` (~1013px).
- Gutter: `--grid-gutter`, fluid ~9–17px.
- Breakpoints: xxs 240px, xs 360px, sm 480px, md 720px (note: `_custom-media.css` treats md as 480–768px for the `--md-only` range — check both files if a breakpoint edge case matters), lg 1024px, xl 1440px, xxl 1920px.

---

## Shared Surface Effects & Interaction Patterns

From `src/lib/styles/defaults/index.scss` and `src/lib/styles/mixins/_shadows.scss` — these two effects are generic enough to reuse outside page-specific components:

- **Text selection**: `--purple` background, white text.
- **Buttons**: `--purple-soft` fill, white uppercase Montserrat label, thick white bottom border (0.25rem), small border-radius (0.125rem). Hover: background flips to `--white-soft`, text turns `--purple` and bold, bottom border turns `--purple`, corners square off.
- **`filter-shadow` mixin**: `drop-shadow(2px 4px 18px var(--gray))` — sparing use on floating/overlapping elements.
- **`text-shadow` mixin**: `1px 1px 1px var(--gray)` — subtle, not decorative.
- **Blockquote**: torn-paper-edge mask (open-props) on a white card, oversized serif quotation mark bleeding out top-left in low-opacity gray, italic Erode body, Montserrat medium citation line.

---

## What NOT to reuse as generic style

Navbar, ProjectCard, PhotoPile, AwardBadge, Modal, ParallaxHero, and other components under `src/lib/components/ui/` and `src/lib/components/custom/` are page-specific layout and interaction code, not design-system tokens. Don't lift their markup/CSS as "brand style" for unrelated work — only the tokens and two effects above are meant to travel.
