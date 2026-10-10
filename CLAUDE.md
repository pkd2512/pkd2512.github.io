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
