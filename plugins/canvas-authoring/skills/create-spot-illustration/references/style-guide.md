# Spot illustration reference

The bundled examples record the reference style. For hosted output, map colors
to the host's documented tokens; use the reference hex values only as standalone
fallbacks. A user's approved reference can change shape language without
silently replacing the host theme.

## Visual language

| Property | Default |
| --- | --- |
| Artboard | `viewBox="0 0 480 440"` |
| Background | Transparent; no full-artboard white rectangle |
| Blue | `#5C8DF8` |
| Navy | `#294482` |
| Pale blue | `#CEDEFF` |
| Cream | `#FFE4B4` |
| Off-white object fill | `#F5F5F5` |
| Shape outline | About 1.2-1.4 SVG units |
| Internal symbols | About 3-8 SVG units, with rounded ends |
| Geometry | Rounded rectangles, circles, simple paths, generous clear space |
| Depth | One flat offset layer; no blur, gradient, texture, or realistic shadow |
| Detail | Few large shapes; no tiny text, dense diagrams, or UI screenshots |

SVG units are not rendered pixels. At 240 CSS pixels wide, this artboard scales
by one half. Inspect the actual intended size before deciding that a line is
legible or that a motion is small. Never assume a fixed-size screenshot proves
every placement.

## Host color map

Use the toolkit's host-backed aliases when the target uses canvas-toolkit:

| Illustration role | Hosted paint |
| --- | --- |
| Main blue accent | `var(--canvas-accent, #5C8DF8)` |
| Navy outline and symbols | `var(--canvas-fg, #294482)` |
| Pale secondary layer | `color-mix(in srgb, var(--canvas-accent, #5C8DF8) 20%, var(--canvas-bg, #F5F5F5))` |
| Selected or supporting highlight | `color-mix(in srgb, var(--canvas-accent, #5C8DF8) 40%, var(--canvas-bg, #F5F5F5))` |
| Paper or panel surface | `var(--canvas-bg, #F5F5F5)` |

These are semantic role mappings, not claims that a host exports a dedicated
cream or illustration palette. Do not use warning/success colors for decoration.
Use `--canvas-attention`, `--canvas-success`, or `--canvas-danger` only when
that status is genuinely part of the task. For another host, verify its own
contract; toolkit aliases are not universal host APIs.

For example:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 440">
  <rect x="100" y="100" width="240" height="200" rx="20"
    fill="var(--canvas-bg, #F5F5F5)" stroke="var(--canvas-fg, #294482)"/>
  <circle cx="300" cy="280" r="44"
    fill="var(--canvas-accent, #5C8DF8)" stroke="var(--canvas-fg, #294482)"/>
</svg>
```

Inspect the resulting light and dark treatments. Do not blindly replace every
white fill: distinguish paper, a hole, a highlight, and an intentionally fixed
brand color. Hosted paper can follow `--canvas-bg`, but its outline and internal
symbols must remain legible. Keep the original fixed-color examples unchanged
as reference context.

An image-loaded SVG does not inherit page CSS variables. The fresh workbench
copies `--canvas-bg`, `--canvas-fg`, `--canvas-muted`, `--canvas-border`,
`--canvas-accent`, `--canvas-success`, `--canvas-attention`, and `--canvas-danger`
into a detached SVG image copy and supplies its current color scheme. It uses
the toolkit's theme observer for late delivery and live updates. Derived tints
must use those aliases, not an unrecognized local variable.

For another renderer, use the toolkit's `readCanvasTheme` / `observeCanvasTheme`
APIs or that host's documented equivalent and implement the correct boundary.
Do not treat `var(...)` with an unresolved image fallback as host theming.
Animated previews must also retain once-per-view state when theme colors change;
recreating an image document must not replay an entrance.

## Bundled examples

| Example | Meaning | Read as style context, not as |
| --- | --- | --- |
| [Functions App](../assets/functions-app.svg) | Functions and callable code | A deployment-complete state |
| [Unity Studio](../assets/unity-studio.svg) | App components around an agent | The game-engine logo or proof of a safety guarantee |
| [SRE incidents](../assets/sre-incidents.svg) | Select and inspect an incident | A metrics dashboard, help desk, or automatic repair |

The examples share a palette, geometry, outline language, and visual weight.
They do not require a shared outer silhouette. Use a frame only when it helps
explain the task. Avoid repeating a badge that adds no meaning.
Create four distinct options for each new comparison. Show A-D together in the
workbench's Spot illustrations mode when available, before any selection.

Prefer a selected incident queue plus a magnifier for browsing investigations.
Use a single incident record plus a magnifier for examining one incident.
An oversized warning triangle usually means a warning or error state rather
than the task of investigating incidents.

## Add your own references

A skill can carry local SVG/PNG examples and a written style guide. Add approved
assets beside the skill, link them from `SKILL.md`, and include them in the
plugin's explicit export list. Adding files only to the source directory does
not make them available in an installed plugin.

Use a small representative set. Keep a supplied sheet as reference rather than
turning every shape into a required template. Record its origin and permitted
use before distribution. Do not package private attachments, local machine
paths, remote dependencies, or third-party artwork without reuse permission.
The three bundled examples were created for this illustration workflow; the
original external reference sheet is not included.

## Motion context

The bundled examples are static on purpose. After selection, ask once whether
the user wants playful, subtle animation. Offer artwork-specific choices and
**Keep static**, then wait for approval. A tiny tilt-and-settle, staggered tile
pop, or curious magnifier peek can add character without repeated bouncing.
Use a separate variant, preserve the static source and the selected comparison,
stop after one entrance, and show every part under reduced motion.
For a host integration, retain once-per-view state outside the SVG and respect
the target's CSP and motion settings.
