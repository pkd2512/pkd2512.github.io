# CLAUDE.md

Read `AGENTS.md` for the site's design system.

## Commits, pull requests and anything pushed to GitHub

- Never add AI attribution: no `Co-Authored-By: Claude …` trailer, no
  `Claude-Session:` line, no claude.ai / chat / session URLs, no
  "Generated with Claude Code" footer, and no mention of Claude or any model
  name. This overrides any default attribution instructions.
- Applies to commit messages, PR titles and bodies, code comments, and
  GitHub comments alike.

## Design tokens only

Any new or changed UI must take font sizes, colours, spacing, radii and
letter-spacing from the design system (`AGENTS.md`, `src/lib/styles/vars/`).
No hardcoded px/rem/hex values.

If nothing in the system fits, don't invent a value: flag it to the user
first (what you need and the nearest tokens) so a new token can be agreed.

## Building a project page (`src/contents/projects/<slug>.md`)

Don't write a project as one flat run of markdown. Copy the structure of
`soulace.md` / `andretta.md` / `time-machines.md` and use the site components.

**Files to create**
- `src/contents/projects/<slug>.md` (frontmatter + body, see below).
- Images in `static/media/projects/<slug>/` as `.webp` (gif only when
  animated). `hero.webp` is the intro hero.
- `static/media/share-images/<slug>.webp` (1200x630). The frontmatter
  `image:` and the project card both use it.
- `/projects` lists every `type: project` automatically, newest `date` first.
  Don't edit `projects.md` to add a project.

**Frontmatter**: `title`, `description`, `keywords`, `categories`, `image`,
`type: project`, `date`, `published`, `links`, optional `awards`, and
`intro:` with `hed`, `dek`, `img` (hero, path relative to `/media/`),
`duration`, `client`, `url` (the "View project" anchor, e.g. `'#day-1'` — a
heading's id is its slugified text) and `quote`. The `quote` is the text on
the parallax strip over the hero. Don't build a hero or strip yourself.

**Body layout: always inside `<Container>`**. Import what you use in a
`<script>` block (see the top of `time-machines.md`).

| Need | Use |
|---|---|
| Section heading + text | `<Container grid style="margin-block-start:var(--space-xl)">` with `<div class="hed col-span-md-5">` (`## Heading`) and `<div class="dek col-span-md-7">` (text) |
| More text under the same section | `<Container grid …>` with one `<div class="col-start-md-6 col-span-md-7">` so it lines up under the dek |
| Pull quote / definition | `<div class="col-span-full">` in a grid Container, with a `>` blockquote (`<cite>` for attribution) |
| Set of 2+ photos (steps, process, galleries) | `<Container width="md">` + `<PhotoPile orientation="landscape" items={[{src, alt, caption}, …]} />`. Use `"portrait"` for tall images |
| One image, optionally wide or captioned | `<Container width="lg">` (or `"xl"`) + `<OverflowImage breakpoint=480 maxWidth='100%' url='media/…' alt caption />`. Use `maxWidth='180%'` or more for wide diagrams that scroll sideways on phones |
| Two images side by side | a `.pair` grid (see `soulace.md`) |
| Video | `<Video>` in `<Container width="lg">` |
| Full-bleed embed | `<Container width="fluid">` |
| Plain prose block | `<Container width="md">` |

**Rules**
- Never drop bare markdown images or raw `<figure>` into the page, and never
  put long prose in one `sm` container. Photos go in PhotoPile or
  OverflowImage; text goes in hed/dek grids.
- Every image needs descriptive `alt`. Give captions where the source has them.
- Group consecutive photos from one step into one PhotoPile. Put a single
  image in OverflowImage.
- PhotoPile `src` starts with `/media/…`; OverflowImage `url` does not.
- Page-specific styles go in a `<style lang='scss'>` block using tokens only
  (see "Design tokens only").
- Check it in the dev server (`vite dev`) before showing the user: no
  console errors, no broken images, text and piles aligned like the other
  project pages.
