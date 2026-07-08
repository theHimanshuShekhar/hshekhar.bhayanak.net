# AGENTS.md — hshekhar.bhayanak.net

## Overview

Personal portfolio site for Himanshu Shekhar. Terminal/CLI aesthetic with a Tokyo Night Storm color scheme. Built with Astro, deployed on Cloudflare Workers.

## Tech Stack

| Layer        | Technology                                                 |
| ------------ | ---------------------------------------------------------- |
| SSG          | [Astro 6](https://astro.build)                             |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite` plugin) |
| Font         | JetBrains Mono (Google Fonts)                              |
| Theme        | Tokyo Night Storm                                          |
| Adapter      | `@astrojs/cloudflare`                                      |
| Runtime      | Cloudflare Workers (via `wrangler`)                        |
| Package Mgr  | `pnpm` (11.9.0)                                            |
| Node         | `>=22.12.0`                                                |

## Project Structure

```
.
├── astro.config.mjs          # Astro config (Tailwind + Cloudflare adapter)
├── src/
│   ├── pages/
│   │   ├── index.astro       # Homepage — terminal prompt layout
│   │   └── blog/
│   │       ├── index.astro   # Blog listing
│   │       └── [slug].astro  # Individual blog post
│   ├── content/
│   │   ├── config.ts         # Astro 6 content collections (glob loader)
│   │   └── blog/
│   │       ├── *.md          # Blog posts (Markdown with frontmatter)
│   │       └── ...           # Post stubs
│   └── styles/
│       └── global.css        # Global + Tailwind theme tokens
├── scripts/
│   ├── run-astro.mjs         # Wrapper: pnpm exec astro (suppresses DEP0205)
│   ├── verify-blog.mjs       # Blog structure/completeness checks
│   └── verify-build-clean.mjs# Verifies build has no DEP0205 warnings
├── public/                   # Static assets
├── dist/                     # Build output (gitignored)
├── pnpm-workspace.yaml       # Overrides: esbuild ^0.28.1, vite ^7
├── wrangler.jsonc            # Cloudflare Workers config
├── DESIGN.md                 # **Authoritative** design system reference
├── PRODUCT.md                # Product positioning
└── tsconfig.json             # astro/tsconfigs/strict
```

## Commands

```sh
pnpm install                  # Install dependencies (--frozen-lockfile in CI)
pnpm dev                      # Astro dev server → localhost:4321
pnpm build                    # Production build → dist/
pnpm preview                  # Build + wrangler dev (local Workers preview)
pnpm deploy                   # Build + wrangler deploy (production)
pnpm test:blog                # Verify blog structure (scripts/verify-blog.mjs)
pnpm test:build-clean         # Verify clean build w/o DEP0205 warnings
```

## Content: Blog Posts

Blog posts live in `src/content/blog/*.md` with Astro 6 content collections (glob loader, not legacy `type: 'content'`).

### Required frontmatter

```yaml
---
title: "Post title"
description: "One- or two-sentence summary"
pubDate: 2026-05-24
tags:
  - tag1
  - tag2
---
```

Optional: `updatedDate` (ISO date), `draft` (boolean, default false).

### Conventions

- Access posts via `getCollection('blog')` — use `.id` not `.slug`.
- Render dates as `YYYY-MM-DD` (terminal-friendly) with `toISOString().slice(0, 10)`.
- At least 2 posts expected for realistic index states.
- Every post must have section headings (`##`) for article typography.

## Design System

The **authoritative** design reference is `DESIGN.md`. Key rules:

- **One font:** JetBrains Mono everywhere (500 weight, mono family).
- **Flat shell:** No cards, shadows, glass, or gradients.
- **Color roles:** Prompt Violet (`#bb9af7`) for command labels, Path Blue (`#7aa2f7`) for links, Dollar Green (`#9ece6a`) for `$`, Storm Ink (`#c0caf5`) for text.
- **Layout:** Terminal-native — prompt/output groupings, no decorative containers.
- **Playful but scannable:** Jokes and animations must not hide content or break accessibility.

CSS custom properties in `global.css` under the `@theme` block use `--color-tn-*` prefixes matching Tokyo Night tokens.

## Code Conventions

- All styling uses Tailwind v4's `@import "tailwindcss"` syntax (no PostCSS config needed).
- TypeScript via `astro/tsconfigs/strict` — JSDoc in `.mjs` files, explicit types in `.ts`.
- Astro content collections use the Astro 6 API: `defineCollection` with `loader: glob(...)` and `z` schema.
- `scripts/run-astro.mjs` wraps `pnpm exec astro` to suppress Node DEP0205 warning — always use `node scripts/run-astro.mjs` not `pnpm astro` directly.
- Lockfile overrides live in `pnpm-workspace.yaml`, not `package.json`.

## Deployment

- **Host:** Cloudflare Workers (via `@astrojs/cloudflare` adapter).
- **Output:** static site in `dist/` built by `pnpm build`.
- **CI/CD:** Vercel deploys from GitHub. The `packageManager` field in `package.json` pins pnpm 11.9.0 for corepack compatibility.
- **Prod:** Manual deploy via `pnpm deploy` (or Vercel auto-deploy on push).
- Cloudflare config in `wrangler.jsonc` — compatibility date, KV bindings for sessions, Images binding for image processing.

## CI/CD Pitfalls

### Frozen lockfile mismatch (pnpm version drift)

**Symptom:** Vercel CI fails with `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` saying `overrides` configuration doesn't match the lockfile.

**Root cause:** The lockfile was generated with pnpm X locally, but Vercel's default environment runs a different pnpm version. pnpm 10 validates the lockfile's `overrides` section (from `pnpm-workspace.yaml`) more strictly than pnpm 11, and will reject a lockfile generated by a newer pnpm.

**The fix is NOT** `pnpm install --no-frozen-lockfile` — that masks the issue and can commit a lockfile with stale resolution data. **The fix** is to ensure Vercel uses the same pnpm version as local development. This is done by keeping the `packageManager` field in `package.json` in sync with the actual pnpm version used to generate the lockfile:

```json
"packageManager": "pnpm@11.9.0"
```

Vercel reads this field and downloads the matching pnpm version via corepack.

**When upgrading pnpm locally** (e.g. `corepack use pnpm@11.10.0`):
1. Run `pnpm install` to regenerate the lockfile with the new version.
2. Bump the `packageManager` value in `package.json` to match.
3. Commit both changes together.

**When changing overrides** in `pnpm-workspace.yaml`:
- Always run `pnpm install` afterward so the lockfile reflects the new effective overrides.
- The lockfile's top-level `overrides:` block is a snapshot of what was active during resolution — it must match `pnpm-workspace.yaml`.

## Tests

- `pnpm test:blog` — structural checks on blog content collection (frontmatter, IDs, links).
- `pnpm test:build-clean` — assert silent build output (no DEP0205 warnings).

Both exit non-zero on failure.
