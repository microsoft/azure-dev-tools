# Page templates

Page templates are starting layouts built from public toolkit components.
A pattern explains a recurring user need; a template gives it a concrete page
structure. Scenarios demonstrate a template's states and interactions.
Templates are examples to copy and adapt, not new public component APIs.

## Choose by the user's job

| User's main job | Recommendation |
| --- | --- |
| Start, assemble or open an app; resume recent work | Use **Simple home**. |
| Monitor a selected environment; review incidents, blocked tasks or active investigations | Use an attention-first operational home instead. Do not put an equal task grid before urgent work. |
| Complete one known task, review a change or recover from a failure | Open the relevant task, review or recovery page. Do not add a home-page choice first. |
| Browse a large catalog or manage many resources | Use a searchable catalog or list-detail layout. Do not turn every item into a home card. |

### Agent guidance

Identify the user's next decision before selecting a template. A product name
alone does not determine the layout. Functions and Unity usually need entry
points for creation and existing work. SRE usually needs current operational
context and work that needs attention. Both are task-focused; the task differs.

For SRE and similar monitoring tools, recommend this order:

1. Selected agent, environment or resource scope, with a way to change it.
2. Work that needs attention, ordered by urgency, with explicit next actions.
3. Active investigations or tasks that the user can resume.
4. Secondary shortcuts, including creation where supported.

Keep scope, freshness and loading, empty, denied and failed states distinct.
Do not report "no incidents" after a failed or incomplete read. Keep approval
requests separate from execution and show health only from verified data.
This is guidance for another layout, not an implemented SRE template or a
change to a product canvas. An SRE tool that only launches tasks can use
Simple home when there is no operational queue to prioritize.

## Simple home

Use [simple-home.mjs](simple-home.mjs) and
[simple-home.css](simple-home.css) as one canonical starting composition:

**Short introduction → equal detached task cards → recent work.**

Use a task-oriented heading, such as "What would you like to do?", and one
short explanation. Give each card a distinct verb and object. Keep Create,
Assemble and Open available without a hero. This template has no hero or
illustration. Do not add an "Other tasks" heading above equal peers.

Keep product branding in a compact `CanvasHeader` above the page, rather than
a large content masthead. Use a small product mark and normal-weight wordmark.
Keep existing navigation and actions in the header's public slots; do not add
controls for capabilities the product does not have. The header is separate
from this template, so the template's 24-pixel top padding supplies the gap
before the introduction.

The content area is at most 888 pixels, including 24-pixel side padding.
It uses a 12-pixel card gap and 24 pixels between major sections. Cards use
one column below 520 pixels of available content width, two from 520 and
three from 760. One through six cards use the same structure; an incomplete
last row keeps the same column width. Do not stretch one card into a hero.
For larger sets, first review grouping and discovery rather than adding an
unbounded card wall.

Keep recent work below the tasks. Use a concise empty message after a
successful empty read, a loading indicator while reading and an explicit
failure with a separate retry action. Explain unavailable actions. Do not
replace a failed recent-work read with an empty list.

### Use the example

Copy the module and stylesheet into your app's source tree and use the app's
existing toolkit runtime. The factory accepts that runtime so a native browser
consumer and a bundler can use the same composition without a second React
copy. Load the template CSS after `ui/styles.css` and `ui/base.css`.

```js
import { createElement } from "react";
import * as UI from "@microsoft/canvas-toolkit/ui/react";
import { createSimpleHomeTemplate } from "./simple-home.mjs";

const SimpleHome = createSimpleHomeTemplate({ ...UI, createElement });
const page = createElement(SimpleHome, {
    title: "What would you like to do?",
    description: "Start a new app or continue working on an existing app.",
    tasks: [
        { id: "create", title: "Create an app", description: "Start with a template.",
            onClick: () => showCreateDraft() },
        { id: "open", title: "Open an app", description: "Continue existing work.",
            onClick: () => showOpenPicker() },
    ],
    recentTitle: "Recent apps",
    recentContent: renderRecentApps(),
});
```

`showCreateDraft`, `showOpenPicker` and `renderRecentApps` are caller-owned
functions, not toolkit exports. A bundler uses the app's React peer as shown;
the prepared browser entry already includes `createElement`. Render the page
below your product header and within the existing `CanvasProvider`. The example
introduction uses `h2` when the product header supplies `h1`. A `CanvasHeader`
with `onHome` renders a brand button instead; adapt the copied introduction to
`h1` when it is the page's main heading. Update the headings together. Supply
icons as toolkit nodes, not remote images.

Keep routing, recent-data storage, authentication, pending/error state,
permissions, approvals and operation callbacks in the app. A card should open
the next task step; it must not silently authorize creation, deployment or
another external operation. Do not import development workbench files into
products. Check wide/narrow, light/dark, keyboard, one-to-six tasks and the
relevant data states after adapting the layout.
