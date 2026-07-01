---
name: "hshekhar.bhayanak.net"
description: "A playful, technical, sharp personal portfolio in a Tokyo Night terminal shell."
colors:
  storm-shell: "#24283b"
  storm-ink: "#c0caf5"
  prompt-violet: "#bb9af7"
  path-blue: "#7aa2f7"
  dollar-green: "#9ece6a"
  ghost-output: "#565f89"
  badge-ink: "#1a1b26"
typography:
  display:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "1rem / 1.25rem at 600px+"
    fontWeight: 500
    lineHeight: "normal"
    letterSpacing: "normal"
  headline:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "inherit"
    fontWeight: 500
    lineHeight: "normal"
    letterSpacing: "normal"
  body:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "1rem / 1.25rem at 600px+"
    fontWeight: 500
    lineHeight: "normal"
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "inherit"
    fontWeight: 500
    lineHeight: "normal"
    letterSpacing: "normal"
spacing:
  page-padding: "1rem"
  section-gap: "1rem"
  output-offset: "0.5em"
  list-indent: "1.5em"
  label-x-padding: "0.5em"
components:
  shell-page:
    backgroundColor: "{colors.storm-shell}"
    textColor: "{colors.storm-ink}"
    typography: "{typography.body}"
    padding: "{spacing.page-padding}"
  prompt-line:
    backgroundColor: "{colors.storm-shell}"
    textColor: "{colors.storm-ink}"
    typography: "{typography.label}"
  command-label:
    backgroundColor: "{colors.prompt-violet}"
    textColor: "{colors.badge-ink}"
    typography: "{typography.headline}"
    padding: "0 {spacing.label-x-padding}"
  text-link:
    backgroundColor: "{colors.storm-shell}"
    textColor: "{colors.path-blue}"
    typography: "{typography.body}"
---

# Design System: hshekhar.bhayanak.net

## 1. Overview

**Creative North Star: "The Mischief Terminal"**

This design system is a compact shell session for a real engineer, not a generic portfolio dressed in dark mode. The surface is Tokyo Night Storm, the voice is mono-forward, and the rhythm is command then output. It should feel like a competent terminal that occasionally reveals a joke, not a joke that happens to contain a résumé.

The system is deliberately flat. Depth comes from terminal roles: prompt identity, path color, command color, output color, cursor behavior, and highlighted command labels. No cards, no soft shadows, no decorative panels. The page should stay fast to scan for hiring/recruiting readers and still reward developer peers with small CLI details.

It explicitly rejects the PRODUCT.md anti-references: generic SaaS portfolio polish, corporate résumé sterility, and unreadable terminal cosplay. Terminal identity is the frame, not an excuse; legibility and control win over theatrics.

**Key Characteristics:**

- Mono-forward, single-family typography with JetBrains Mono.
- Tokyo Night Storm base with violet, blue, and green prompt roles.
- Flat terminal primitives instead of cards, shadows, or glass.
- Short command/output groupings with high information density.
- Mischief is allowed only when it does not hide content or reduce accessibility.

## 2. Colors

The palette is a Storm Console: a dark blue-violet terminal base, pale lavender ink, and role colors borrowed from Tokyo Night prompt syntax.

### Primary

- **Prompt Violet** (`prompt-violet`): the highest-emphasis accent. Use for prompt identity and command-label backgrounds. Its job is to mark system voice, not decorate arbitrary blocks.
- **Path Blue** (`path-blue`): navigational and link color. Use for paths, URLs, and interactive text.
- **Dollar Green** (`dollar-green`): command prompt punctuation. Use sparingly for `$`, confirmations, and “ready” states.

### Neutral

- **Storm Shell** (`storm-shell`): the page and component background. This is the terminal surface and should remain dominant.
- **Storm Ink** (`storm-ink`): primary text and command text. Use when the user must read it.
- **Ghost Output** (`ghost-output`): muted terminal output. Current implementation uses it for body copy; future work must not use it for body-sized essential text unless contrast is raised to WCAG AA.
- **Badge Ink** (`badge-ink`): dark ink used on Prompt Violet command labels.

### Named Rules

**The Role Color Rule.** Violet identifies the prompt/system label, blue identifies paths and links, green identifies prompt punctuation or success. Do not use these colors interchangeably.

**The Ghost Is Not Body Rule.** Muted terminal output may annotate; it must not carry essential body text below WCAG AA contrast.

**The No Beige Escape Rule.** Do not soften the site into cream, sand, paper, or warm-neutral portfolio territory. The shell is the brand surface.

## 3. Typography

**Display Font:** JetBrains Mono, with monospace fallback  
**Body Font:** JetBrains Mono, with monospace fallback  
**Label/Mono Font:** JetBrains Mono, with monospace fallback

**Character:** The type system is intentionally one-family and terminal-native. Weight and role color create hierarchy; font pairing would weaken the shell illusion unless the design intentionally departs from the terminal frame.

### Hierarchy

- **Display** (500, `1rem` mobile / `1.25rem` at 600px+, normal line-height): reserved for the primary identity line when the page needs a stronger hero. Do not overscale; this system should feel like a terminal, not a poster.
- **Headline** (500, inherit size, normal line-height): command-label headings such as `Himanshu Shekhar`, `Interests`, `Now`, and `Contact`.
- **Title** (500, inherit size, normal line-height): prompt command text such as `cat interests.md` or `me -h`.
- **Body** (500, `1rem` mobile / `1.25rem` at 600px+, normal line-height): all readable output and links. Keep line length at or below 80ch in the current system; tighten to 65–75ch if longer prose is added.
- **Label** (500, inherit size, normal letter-spacing, lowercase command syntax): prompt fragments, path fragments, and terminal state labels.

### Named Rules

**The One Font Rule.** JetBrains Mono carries the whole identity. Add hierarchy through role, color, spacing, and content structure before adding another typeface.

**The No Resume Typography Rule.** Do not introduce corporate résumé typography: no generic sans hero, no soft card headings, no over-polished startup landing hierarchy.

## 4. Elevation

This system is flat by default. It uses no box shadows and no raised cards. Depth is conveyed through terminal sequencing, color roles, prompt repetition, and occasional cursor/state changes. If a future component needs focus or hover depth, use a crisp outline or color shift before any shadow.

### Named Rules

**The Flat Shell Rule.** Surfaces are not lifted. If something needs emphasis, make it a command, a prompt state, or a label — not a card.

**The No Ghost Card Rule.** Never combine a 1px border with a soft wide drop shadow. That pattern is prohibited for this brand.

## 5. Components

### Shell Page

A full-page terminal surface.

- **Shape:** rectangular viewport, no component radius.
- **Background:** Storm Shell (`storm-shell`).
- **Text:** Storm Ink (`storm-ink`) by default.
- **Padding:** compact page padding (`1rem`).
- **Behavior:** static-first; content must be readable even when motion is disabled or blocked.

### Prompt Line

The core identity primitive: `hshekhar@bhayanak ~ $ command`.

- **Shape:** inline text sequence, no border or container.
- **Color roles:** Prompt Violet for identity, Path Blue for `~`, Dollar Green for `$`, Storm Ink for command text.
- **Spacing:** preserve terminal-like small gaps; do not spread into decorative nav pills.
- **State:** can animate only if reduced-motion fallback is present.

### Command Label

The highlighted section heading used for output labels.

- **Shape:** flat inline label with no radius.
- **Color:** Prompt Violet background with Badge Ink text.
- **Padding:** horizontal padding only (`0 0.5em`).
- **Use:** section labels and current command results. Do not repeat it so often that every section has identical weight.

### Output Text

The readable terminal response.

- **Color:** currently Ghost Output; future production text should use a WCAG AA-compliant value.
- **Width:** output column maxes at `80ch`.
- **Density:** compact paragraphs and lists; no card wrappers.
- **Rule:** essential content must remain visible by default. Animation may not gate it.

### Text Links

Contact and external links.

- **Color:** Path Blue.
- **Hover:** underline.
- **Shape:** text-only, arrow-prefixed where useful.
- **Focus:** future work should add a visible terminal-style focus state, not rely on invisible default outlines.

### Cursor

The playful terminal state marker.

- **Shape:** block cursor (`0.55em` wide) for live prompt, currently with a wider typewriter cursor on the first line.
- **Motion:** blink and typewriter behavior must honor reduced-motion preferences.
- **Role:** flavor only. It must not distract from the intro, contact path, or readability.

## 6. Do's and Don'ts

### Do:

- **Do** preserve the Storm Console roles: Prompt Violet for prompt identity, Path Blue for paths/links, Dollar Green for `$`, Storm Ink for readable commands.
- **Do** keep the layout terminal-native and flat; use prompts and command structure instead of cards.
- **Do** make essential text meet WCAG AA contrast before treating it as production body copy.
- **Do** keep content visible by default; motion may enhance but must not hide the page.
- **Do** make playful details feel earned: one good terminal joke beats constant gimmick motion.
- **Do** use exact, personal copy that sounds like Himanshu rather than portfolio-generator filler.

### Don't:

- **Don't** create a generic SaaS portfolio: no gradient cards, hero-metric templates, startup sameness, or template polish without personality.
- **Don't** create a corporate résumé page: no sterile recruiter-first layout that removes the terminal voice.
- **Don't** create unreadable terminal cosplay: no tiny text, low contrast, hidden links, motion gimmicks, or jokes that block scanning.
- **Don't** use gradient text, glassmorphism, side-stripe card borders, or repeating stripe backgrounds.
- **Don't** add rounded cards, nested cards, or soft shadows to make the page feel “designed.” That is the wrong register.
- **Don't** use `Ghost Output` for essential body text unless the contrast is corrected to ≥4.5:1.
