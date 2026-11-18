# Shared canvas UI

Use `@microsoft/canvas-toolkit/ui/react` for new UI. Load `ui/styles.css` then
`ui/base.css`, and wrap the view in `CanvasProvider`. These are Fluent Headless
React controls with the Workbench visual treatment, not a second focus engine.
The provider follows late host tokens and tone changes without remounting.

```jsx
import { CanvasProvider, FormField, TextInput, Button } from "@microsoft/canvas-toolkit/ui/react";
import "@microsoft/canvas-toolkit/ui/styles.css";
import "@microsoft/canvas-toolkit/ui/base.css";

function App() {
    return <CanvasProvider>
        <FormField label="App name" hint="Choose a descriptive name.">
            <TextInput defaultValue="checkout" required />
        </FormField>
        <Button appearance="primary" onClick={continueWithReviewedDraft}>Continue</Button>
    </CanvasProvider>;
}
```

Plain JavaScript uses the **same implementation**, not parallel widget logic:

```js
import { mountCanvasComponent, ActionCard } from "@microsoft/canvas-toolkit/ui/dom";
const card = mountCanvasComponent(container, ActionCard, {
    title: "Refresh resources", description: "Reload the current scope.",
    onClick: () => refresh(),
});
card.update({ disabled: true });
card.dispose();
```

For decorative DOM icons, use `createIcon` from `@microsoft/canvas-toolkit/ui/icons`.
`createIcon("log")` supplies the canonical filled 16px Primer Log glyph for
command activity. Give its containing button an accessible label.

For Azure resources, show the resource-type icon in the `CanvasHeader` `icon`
and in each `ListDetail` item `icon`. Resolve the key with
`iconForType(type, kind)` from `@microsoft/canvas-toolkit/icons` (it returns
`GENERIC_ICON` for unmapped types) and render
`<img src="icons/<Key>.svg" alt="" width="16" height="16">`. The server mounts
`azureIconAssets`, and a bundled provider build calls `prepareAzureIconAssets`;
see the [toolkit README](README.md#azure-resource-icons).

For resizable supporting activity, compose `CanvasShell.detailPanel` with
`DetailPanel` using `docked`, controlled `open`/`onOpenChange`, and `triggerRef`.
Give the shell's parent a definite height. The nonmodal panel reserves task
space on the right, or below at an available frame width of 900px or less.
Task and panel scroll independently without replacing their children. In bottom
dock mode the complete task scrolls, so its header/footer cannot squeeze the task
body to zero in a short pane.
Desktop width defaults to 380px (280-560px); bottom height defaults to 280px
(180px, or less in a short pane, through 70% of available height).
`storageKey` remembers width and height independently. Supply `onError` to
surface storage failures; otherwise they are logged. The separator supports
pointer drag, directional arrows (16px, Shift 40px), Home and End. Close and
Escape restore the opener when the panel owns focus; Escape leaves an active
menu or modal to its owner. Outside interaction does not dismiss the panel.
Static `DetailPanel` composition and shells without a detail slot are unchanged.
For existing vanilla canvases, `ui/dom` also provides `actionCard` /
`updateActionCard`, `folderField`, `appFooter`, `promptComposer`, `renderView`
and `hostMessageToast`. These adapters mount the canonical components through
the same retained-root implementation, not a second renderer. Card adapters
return a mount wrapper containing the actual button; locate the button for
focus or native button properties rather than treating the wrapper as a button.
Use `dispose(element)` or `replaceChildren(element, ...)` before removing a
subtree containing toolkit roots. A disposed mount is idempotent and reports
`disposed`; reuse a cleared container with a new mount. `renderView` updates
an existing root and replaces its action callback without remounting.

`bindPromptComposer`, `bindActionGroup`, `bindInlineEditor`,
`bindDetailPanel`, `bindProductNavigation` and `createNavigation` provide
vanilla lifecycle/controller integration. Routing, authorization, asynchronous
actions and display snapshots remain caller-owned. History stores at most 80
display snapshots, serializes restoration and rolls back a failed restore;
it never replays a product operation. Dispose controller listeners on permanent
navigation, not on a persisted `pagehide` when the browser is retaining the page.

`PromptComposer` supports controlled `value` or uncontrolled `defaultValue`.
The `input` and `submitButton` slots retain caller IDs, accessible names and
native hooks. Uncontrolled input drafts survive prop refreshes, including drafts
owned by an existing vanilla controller. The `data-composer-actions` row can
be hidden for a caller-owned setup/review step without hiding the draft.
`SymbolIcon` supplies a small named Primer symbol set for common canvas intents;
it does not load an icon catalog or alter routing.

`MenuButton` exposes native `button`, `popover` and `menu` slots. Use
`MenuItem.persistOnClick` when the caller must keep a menu open until an
asynchronous action succeeds; keep pending and failure state caller-owned.
The footer adapter uses this behavior for language saves, retains failures
in the open menu, and marks the active language with `aria-current`.
Its language trigger defaults to `${ids.locale}-trigger`, or use
`ids.localeTrigger` for an explicit ID.
The logical `ids.locale` remains the trigger's `data-metric-id`; the consuming
canvas still decides which controls are registered and whether to observe usage.
For joined cards, render their nodes together through `renderView` or one
React root so first/last styling sees the actual sibling buttons.
Compact `ActionCard` titles use normal weight. Titles and descriptions wrap
instead of being cut off in narrow panes.

`CanvasHeader.contextVisibility="always"` prioritizes a visible selected context.
Below 900 pixels of available header width, its Jump to control becomes
icon-only while retaining its accessible name and keyboard shortcut. Hidden
contexts and the default responsive layout keep the existing behavior.

`CommandPalette` supports localized result labels, grouped commands, controlled
queries and caller-controlled closing. Native command-button handlers run
before selection and can prevent it. Native-disabled and `aria-disabled`
commands never invoke `onCommand`; focusable unavailable rows remain reachable
with Home/End and the shared keyboard navigation. A caller can use native
capture handlers to explain why an unavailable action cannot run.

Controls and overlays follow a profile's `--canvas-font-family` mapping or the
delivered `--font-sans` token with the standard system fallback. The CoreAI
profile maps its existing type stack to the same alias, including for overlays.
Uncontrolled `TextInput`, `Textarea` and `PromptComposer` values also
retain native, programmatically restored drafts across unrelated updates.

Serve the complete `canvasUiAssets` map or use `prepareCanvasUiAssets`.
For native browser modules both `ui/react` and `ui/dom` resolve to the single
prepared `canvas-ui/base.mjs` entry and shared React chunk, which also export `createElement`,
`Fragment`, `useState`, `useEffect` and `useRef`. Do not mix that bundled React
with another React runtime. App bundlers use the raw entry points and the app's
React/React DOM peers (18.3.1 or 19). Public component props are toolkit-owned;
they do not expose a styling vendor's types.
TypeScript apps also install `@types/react` and `@types/react-dom`. Keep the
complete same-origin asset map, including the bundled third-party notices.

**Compatibility:** `ui/components` still exports the existing `create*` DOM
factories and uses `components.css`. Its props and async lifecycle are separate;
it is not silently converted to React. Keep it while migrating one subtree at
a time. New React slots accept React nodes, never DOM nodes or HTML strings.
Existing toolkit callbacks retain `onChange(event, {value})`,
`onChange(event, {checked})` and `onOpenChange(event, {open})`; progress uses 0–1
values by default. `ui/fluent.css` and the old `canvas-ui/fluent.mjs` browser
route remain compatibility aliases to the same canonical implementation.
Pass button icons through `icon`; the shared slot centers them beside labels
and in icon-only actions without a baseline offset.

## Shared icons

Use the existing `@primer/octicons-react` exports for Octicons. Give a
meaningful standalone icon an accessible label; hide decorative icons beside
visible text. Toolkit workbench's Icons section browses those same installed
exports and provides dependency-free inline SVG usage and chat context.
Product artwork context includes its SVG or an original PNG reference and
local-asset usage, not a package import. Attaching context never installs
dependencies or copies files into the receiving app.

## Interaction ownership

### Page templates

Use the [page-template guide](examples/page-templates/README.md) before choosing
a home layout. **Simple home** composes a short introduction, equal task cards
and recent work. It is an adaptable example, not a `TaskHome` public component.
The source and CSS ship in `examples/page-templates`; product code must not
depend on development workbench files.

Choose by the user's next task. Creation and resuming work fit this template.
For SRE monitoring, prioritize scope, work that needs attention and active
investigations before secondary shortcuts. Do not hide urgent work below a
creation grid or replace a failed read with a healthy/empty state. The guide
includes agent selection rules, caller ownership and adaptation checks.

### Task-focused home content

`FeaturePanel` groups a task title, description, optional eyebrow, metadata,
illustration and actions. Its default `appearance="tinted"` gives a creation
task a clear starting point; `"plain"` supports a monitoring introduction.
Use `headingLevel={1|2|3|4}` to fit the page hierarchy (default `2`).
The container is a named section, not a clickable card. Supply separate
`Button` or link nodes in `actions`; `children` can hold supporting content.

`WorkItem` groups a title, description, decorative icon, status, metadata and
independent actions. Titles may be links or buttons. The row itself is not
interactive, so a Review action and a menu do not become nested controls.
Status text, sorting, data freshness, empty/error states and approval rules
belong to the consumer, not the library.

`SpotIllustration` supplies the decorative `"code"`, `"layers"` and `"observe"`
variants. It has no accessible name, focus target or implied health state.
Pass it to `FeaturePanel.illustration`; the panel hides artwork when its own
content width is at most 460 pixels. Rows and action slots wrap in narrow panes.
All three components are available through both `ui/react` and `ui/dom`, with
the same retained-root `mountCanvasComponent` lifecycle.

The public CSS paths remain `ui/styles.css` followed by `ui/base.css`.
Bundlers can emit these as same-origin stylesheets under the consumer's CSP;
there is no remote stylesheet, image or runtime import. Scope `CanvasProvider`
to the new content, not an existing navigation header. A consumer with its own
theme can map `--canvas-bg`, `--canvas-fg`, `--canvas-muted`, `--canvas-border`,
`--canvas-accent`, `--canvas-tint`, `--canvas-hover`, `--canvas-selected`,
`--canvas-focus`, `--canvas-font-family`, `--canvas-body` and `--canvas-small`
on that subtree. Tokens remain live during updates. These components do not
discover resources, store recent work or perform operations.

`@fluentui/react-headless-components-preview` owns menu/toolbar/tab
navigation, listbox selection, dialogs, popovers, tooltips and choice semantics.
`CanvasProvider` initializes the bundled Microsoft focusgroup polyfill; consumers
do not install another arrow-key engine. Menus use native popovers and can remain
mounted while closed. Dialogs use native modality: the in-page background is
inert, focus returns to the trigger, and Tab may visit browser chrome before
cycling back. The adapter preserves initial input focus and focusable disabled
tabs without allowing disabled selection.
Do not add roving tabindex or another focus trap around them. The canvas still
owns labels, error announcements, async pending/error state, drafts, stale-result
invalidation and authorization. These event callbacks do not await operations or
turn rejected promises into UI; handle failures and pass `error`/`pending`.

### Product header composition

Compose `CanvasHeader` with `NavigationControls` and `ProductNavigation`; the
canvas retains routing, history snapshots, permissions and current-task state.
`homeButton` supplies the home control's accessible name, ref and native props.
`contextHidden` keeps a selected-resource control mounted while hiding it;
`contextVisibility="always"` retains that required context in narrow panes.
The default `"responsive"` policy hides context below 480px.

`NavigationControls.label` localizes its navigation landmark. `backButton`,
`forwardButton` and `jumpButton` provide IDs, refs, accessible relationships and
other native button props. Navigation callbacks remain the explicit `onBack`,
`onForward` and `onJump` handlers; a disabled history control cannot be enabled
by its slot props. Product destinations may supply `button` native props for
telemetry and dialog relationships; `onNavigate` and `current` still own
selection and routing. A displayed shortcut is a hint, not a registered key.
Do not use quick navigation to bypass a task's review or approval.

**Browser support:** overlays require native `<dialog>`, the Popover API and CSS
anchor positioning in the target browser or embedded webview. The bundled
focusgroup polyfill supplies keyboard navigation, not those platform features.
Check the actual packaged host before adopting the preview runtime; do not
silently disable CSP or assume an older webview has a positioning fallback.

## Button visuals and danger appearance

The canonical `Button` supports `appearance="danger"` for destructive actions.
Use an explicit action label and application-owned confirmation when appropriate;
color is not confirmation or authorization. Its host-themed danger treatment
retains the usual focus, sizing and disabled behavior.

Pass component references through `leadingVisual` and `trailingVisual`.
They independently place decorative visuals before and after the label in
reading order, including RTL, and can be used together. For example:

```jsx
import { PlusIcon, ArrowRightIcon } from "@primer/octicons-react";

<Button leadingVisual={PlusIcon}>Add item</Button>
<Button trailingVisual={ArrowRightIcon}>Continue</Button>
<Button leadingVisual={PlusIcon} trailingVisual={ArrowRightIcon}>Add and continue</Button>
<Button appearance="danger">Delete draft</Button>
```

Icon slots are hidden from assistive technology; keep a meaningful visible label
or supply `aria-label` for an icon-only action. These are normal Button props,
also accepted by the canonical DOM mounting API.
Existing `icon` React-node callers remain compatible as a leading fallback;
an explicit `leadingVisual` takes precedence. The unreleased `iconPosition`
proposal is replaced by these independent slots.

## Button schema and descriptions

`@microsoft/canvas-toolkit/ui/schema` exports `buttonNodeSchema`, a JSON Schema
2020-12 object, and `validateButtonNode`. Its stable identity is
`urn:microsoft:canvas-toolkit:Button:1`. The schema describes Button props and
named event/visual bindings for inspection and validation. It does not render UI,
attach handlers or introduce another component API. Keep using `Button`.

```jsx
import { Button, CanvasProvider } from "@microsoft/canvas-toolkit/ui/react";
import { validateButtonNode } from "@microsoft/canvas-toolkit/ui/schema";

const id = "save-draft";
const props = { children: "Save draft", appearance: "primary", type: "button" };
const handlers = { saveDraft: handleReviewedSave };
const description = validateButtonNode({
    schemaVersion: 1,
    kind: "Button",
    id,
    props,
    events: { click: "saveDraft" },
}, handlers);

<CanvasProvider>
    <Button id={id} {...props} onClick={handlers.saveDraft} />
</CanvasProvider>;
```

The description shares the component's props; it is not a second source of
rendering instructions. Load the usual toolkit styles. Plain JavaScript uses
the same `Button` with
`mountCanvasComponent(container, Button, { ...props, id, onClick: handlers.saveDraft })`.
Prepared browser imports for `ui/schema`, `ui/react` and `ui/dom` resolve to the
same canonical browser entry.

This version intentionally supports only text `children`, `appearance`, `size`,
`disabled`, optional `aria-label`, and `type: "button"`. It rejects arbitrary
props, raw callbacks, HTML nodes, expressions, and form submission/reset.
IDs and handler names are bounded identifiers. Validation returns a detached
node with the toolkit's secondary/medium/enabled defaults; it does not modify
the input. The consumer must keep IDs unique within its view. Invalid data
throws the shared `InputError`, with code `invalid_input` and a field path.

Structural validation does not require handlers. Supplying a registry to
`validateButtonNode` additionally requires any `events.click` name to be an own
callable member of that registry. An unknown binding is an error, not a no-op
fallback. Validation never attaches or executes handlers; the application
binds `Button.onClick` normally. The consuming canvas still
owns authorization, confirmation, async failures, and status announcements.

Optional `visuals: { leadingVisual: "PlusIcon", trailingVisual: "ArrowRightIcon" }`
describes application-owned components bound to the corresponding Button props.
Either name can be omitted independently. Each name is a bounded identifier,
not an import path, SVG, React node or renderer instruction. Validation detaches
this metadata but does not check the application's visual registry or load
anything. Your application supplies the actual component references normally.

The exported schema can be registered by its `$id` in a downstream JSON Schema
validator and referenced by composition schemas. The toolkit does not yet
provide a composite/view document renderer or state-expression language.
The native workbench's Button detail scenario connects the live example with
React, plain JavaScript and read-only JSON usage in one card. Visual controls
update the preview and code together; the JSON tab is not an editor. The
API section includes a collapsed JSON Schema reference, not a validation demo.
The scenario adds no native configuration or validation action.

## Making a small component change

Start with the public component name and one observable problem, not a coverage
target. `src/ui/react.mjs` is canonical; `src/ui/react.d.ts` is its public prop
contract. `src/ui/dom.mjs` mounts that same implementation. The `create*`
compatibility factories have separate contracts; do not use their passing tests
as proof of React behavior.

From the repository root, select the same scenario used for human review:

```sh
node packages/canvas-toolkit/scripts/test-ui.mjs --component=Disclosure --list
node packages/canvas-toolkit/scripts/test-ui.mjs --component=Disclosure --scenario=retained-disclosure
```

The selector consumes `dev/scenarios.mjs`, deduplicates exact existing test
names, and runs the selected files serially through Node's test runner. Missing
checks, stale mappings, skipped tests and zero-test runs fail rather than
claiming verification. `--list` shows the actual checks before execution.
A component selection includes shared compositions that name it, not just its
isolated sample. A smoke check establishes mounting/asset closure, **not** every
interaction of the selected component. Inspect the mapped names and add a
missing behavior when the change requires it.

### Choose the smallest useful regression

| Change | Useful evidence |
| --- | --- |
| Toolkit-owned deterministic validation, selection or lifecycle logic | A small unit test with an observable result and one meaningful failure/boundary. No browser needed. |
| Interaction, focus, keyboard, hidden drafts or async recovery | One user-oriented check in `tests/browser/ui-fluent-browser.test.mjs`, using the real canonical runtime under CSP. Exercise the gesture and assert the resulting state/callback/focus, not implementation text. |
| DOM mounting or compatibility behavior | The appropriate DOM/migration test, including draft identity and disposal when relevant. Do not duplicate the canonical interaction suite. |
| Public props or exports | Update the consumer in `tests/types`; run the existing strict public type lane. |
| Runtime assets, dependencies or packaging | Rebuild prepared browser assets; run asset closure and installed-package checks. Source success is not installed success. |
| Visual-only spacing, typography or copy | Inspect actual computed layout and the real canvas at relevant widths/themes. Add a browser assertion only for a stable requirement likely to regress, not every CSS property. |

Before adding a test, read the nearby existing checks. Extend the closest
regression when it already expresses the same user risk. Do **not** add tests
for Fluent internals, incidental markup, every prop combination, duplicate
snapshots, CSS source strings as visual proof, or a new assertion solely to
increase counts. A static component can reasonably have no dedicated unit
behavior test; that is not a claim that all its behavior is verified.
Keep intentional global integrity checks and mandatory browser discovery.
Use synthetic data; no Azure login or resource mutation is needed here.

### Agent handoff: make it reviewable in a canvas

Reproduce the problem with the existing scenario before editing when possible.
Keep assertions outside the example: reusing a fixture is useful; asserting
that the fixture implements itself is not. After the fix, run the focused
command and prepare the frozen review artifact with `npm run dev:canvas-toolkit`.
Open the **registered toolkit workbench canvas** on the same component/scenario
for the human to try:

```js
list_canvas_capabilities({ canvasId: "toolkit-component-workbench" });
open_canvas({
    canvasId: "toolkit-component-workbench",
    instanceId: "disclosure-review",
    input: { component: "Disclosure", scenario: "retained-disclosure" },
});
```

Use the current capabilities for action schemas; `get_state` returns the
selection and frozen artifact digest. A Browser canvas around a webpage is not
a substitute. Do not reload a global provider or an existing editing panel.

An honest after-only handoff is enough when no unchanged before artifact was
captured: "After only, Disclosure / retained-disclosure: expand, type a draft,
collapse, update and reopen; the same draft should remain." Identify the exact
build and state which checks actually ran. An open source preview does not prove
that a packaged build or its host integration works.

For before/after, freeze **distinct** build directories before and after the
change, including the prepared runtime and fixture dependency closure. Record
each source revision plus dirty patch or content digest, build command, artifact
digest and scenario. Keep both artifacts immutable and pass their absolute
directories as the workbench's `before` and `after` inputs; its `workbench.json`
checksums identify each build and equal digests are rejected. Do not relabel two renders of current source as
before/after, overwrite the before build, or fabricate a baseline screenshot.
If the old build cannot be reproduced, say after-only and keep the limitation.

Focused checks are an inner loop, not a replacement for existing gates:

```sh
node scripts/testing/run.mjs --workspace=@microsoft/canvas-toolkit --tier=unit
node scripts/auth/run-tests.mjs types
node scripts/auth/run-tests.mjs --files packages/canvas-toolkit/tests/browser/ui-fluent-browser.test.mjs
```

Broaden to the DOM/migration browser files for shared primitives or adapters,
and to the existing package/installed checks for asset or packaging changes.
Repository `npm test` and `npm run harness` remain handoff gates; report actual
failures and unrun checks rather than calling the focused lane a full green.

## Design rules

Use the host-aware toolkit tokens and type ramp. Keep labels and controls
normal-weight, headings modest, action labels short, and related actions aligned.
Hide unavailable optional surfaces rather than leaving empty gaps. Keep real
loading, empty, error and unavailable states distinct. Preserve drafts, focus
and selection when updating. Status must be expressed in text, not color alone.

### Follow the host theme

Load `ui/styles.css` before `ui/base.css`. All components use the existing
host-backed `--canvas-*` aliases and host font/type tokens, including native
choices, code blocks and top-layer panels. Host token changes apply live through
CSS; the provider adds no fixed light/dark palette or generated theme stylesheet.
Do not add a fixed palette, theme attributes or the optional CoreAI profile just
to use these components. The design patterns do not replace the host's theme.

The host must deliver its documented CSS tokens to the canvas document.
Without them, the toolkit uses its existing light/dark fallbacks; a standalone
Browser preview does not prove host token delivery. For non-DOM renderers, use
`readCanvasTheme` / `observeCanvasTheme` from `ui/theme` instead of copying colors.

Primary `Button` and `ActionCard` fallbacks use the paired public
`--canvas-button-primary-bg` / `--canvas-button-primary-fg` tokens, not the
text-accent token. Their existing blue treatment uses white text in light mode
and dark text in dark mode to meet normal-text AA contrast. Supplied host
`--background-color-button-primary-*` and `--text-color-button-primary-rest`
tokens take precedence, including live changes. Without a host hover/active
background, the control retains its resolved rest background. Disabled opacity
and keyboard focus styling are unchanged.

### Host presentation profiles

Select a presentation profile explicitly at the host integration boundary.
Do not infer host identity from light/dark attributes, and do not write host
color or font tokens to apply a structural profile. A profile can set the
following public CSS properties on the document or a containing element;
changing or removing them updates existing components without remounting.
Unset properties preserve the current rendered defaults.

| Component | Public property | Default |
| --- | --- | --- |
| Button | `--canvas-button-min-height` | `32px` |
| Button | `--canvas-button-padding-block`, `--canvas-button-padding-inline` | `5px`, `12px` |
| Button | `--canvas-button-radius`, `--canvas-button-gap` | `6px`, `8px` |
| Button | `--canvas-button-font-weight` | `400` |
| Button | `--canvas-button-line-height` | `var(--leading-body-medium, 20px)` |
| Small Button | `--canvas-button-small-min-height`, `--canvas-button-small-padding-block`, `--canvas-button-small-padding-inline` | Corresponding regular Button property |
| Large Button | `--canvas-button-large-min-height`, `--canvas-button-large-padding-block`, `--canvas-button-large-padding-inline` | Corresponding regular Button property |
| MessageBar | `--canvas-message-padding`, `--canvas-message-radius`, `--canvas-message-gap` | `16px`, `6px`, `8px` |
| MessageBar | `--canvas-message-line-height` | `20px`, for title, body and icon alignment |

Size-specific properties are opt-in: the existing size-neutral rendered
Button geometry remains unchanged when no profile supplies them. A profile
can, for example, set a compact Button's minimum height to `1.75rem` without
changing other sizes. Specialized compositions such as icon buttons, split
buttons and toolbars retain their own geometry rules; these hooks are not a
claim that every toolkit component supports arbitrary host geometry.

Keep profile rules scoped and use host-owned `--font-sans` and type tokens for
typography. These hooks do not install fonts, deliver host tokens, select a
host, or implement another host's integration. Document each actual host's
design requirements separately from its theme-delivery contract.
The [shipped host guides](src/ui/hosts/index.md) and opt-in
`GITHUB_APP_VISUAL_PROFILE` are available through the public
`ui/visual-profiles` registry and `prepareCanvasUiAssets`. Load the selected
stylesheet after `styles.css` and `base.css`, and add its class to a containing
element. The GitHub app profile supplies Primer-based structural roles without
changing host colors or fonts. It does not import the CoreAI Azure profile.

These independent implementations follow reviewed canvas design patterns;
they are not an importer for a prototype schema. Product routes, queries,
authorization, persistence, translation, clipboard policy and host capabilities
remain with the caller.

### Reference coverage

The full 49-component inventory is reviewed, not just the destination form.
Current treatments include the #304 form, #305 composer, #325 browser-style
navigation, #328 inset source tabs and #329 destination palette. Authoring
provenance and intentional adaptations are recorded in `src/ui/base.source.json`;
frozen browser references protect the declared geometry and styling.

Compact controls and bounded surfaces use Fluent Headless interactions and documented
semantic host tokens. Host-private shortcuts, stores and window hooks are not
canvas APIs and are not imported.

**Reference treatments:** chrome, cards, forms, destination rows, inset tabs,
composer, progress, metadata and tables follow the corresponding canvas patterns.
**Themed additions:** generic toolbars, Counter, Skeleton, Blankslate and
overlay/layout compositions follow the same type, spacing, action and state
standards, but do not all have an identically named Alex component. SplitPane's
Fluent Headless Slider and inline DetailPanel intentionally do not reproduce a product's
floating pane, persisted size or routing. Pattern coverage is not whole-screen
pixel identity. Legacy `create*` factories remain compatibility APIs, not the
reference-matched Fluent Headless implementation.

## Navigation and layout

Design for ~480px (one-third panel) first; it must also look good at half and full width. Components respond to their container width, not the viewport: below 760px `ListDetail` shows one pane with a Back control, below 520px `KeyValueList` stacks each label above its value and `Table` rows become labeled cards, below 600px the classic `CanvasHeader` stacks its actions under the title, and below 560px `CanvasFooter` stacks its items.

| Component | Use / how | Avoid |
| --- | --- | --- |
| `CanvasShell` | Page-layout wrapper for `header`, main `children` and `footer`. Optional `navigation` takes `ProductNavigation` props and a stable `id`; pair it with the header's Browse `aria-controls`. At 1180px available width it shows a 256px collapsible sidebar; otherwise Browse previews or pins an overlay. `defaultNavigationCollapsed` and `onNavigationCollapsedChange` let the caller retain its preference. Content and header stay mounted through transitions. | Comparing an entire page composition with a header alone, persisting product state inside the toolkit, or forcing every canvas into one page layout. |
| `CanvasHeader` | Product `title`, selected `context`, `navigation` and a few `actions`. Supply `browse` Button props and `history` for the browser-style header; omitting both keeps centered navigation. Optional `search` Button props render a canonical icon-only search button immediately before `actions`. `variant="workbench"` matches Functions: icon/product Home, history, target, responsive Jump and related actions, with product text hidden below 700px and icon-only Jump below 480px. | Putting every destination or raw account metadata in the header. |
| `CanvasFooter` | Real `links`, `language` control and `version` slots. Handle language errors in the app. | Placeholder links, fake translation, fixed overlays covering content. |
| `NavigationControls` | Supply `browse`, real history availability and Jump callbacks. `variant="browser"` uses chevrons; `layout="header"` puts caller-owned identity children on the left and Jump/`actions` on the right. Render the page scope below. Localize labels and only show registered `shortcutLabel`s. | Treating shortcut hints as registered shortcuts, or inventing history. |
| `ProductNavigation` | Grouped destinations: `items`, optional `groups`, `current`, `onNavigate(event, value)`. Use `variant="inline"` for a small wrapping set, or pass these props through `CanvasShell.navigation` for shared responsive disclosure, close/collapse controls and focus restoration. Standalone visibility remains caller-owned. | Using command search as the only way to discover core tasks; application-wide modal focus traps. |
| `CommandPalette` | Visible `commands`, `onCommand` and a `trigger` or controlled `open`. Type to filter; Down/Up enters results, Fluent owns arrow navigation, Home/End jumps to boundaries, Enter selects and Escape restores trigger focus. Localize copy. | Hard-coded routes, mouse-only entry, nested search dropdowns, or interpreting selection as authorization. Global shortcuts remain caller-owned. |
| `DetailPanel` | Bordered secondary surface with a divided header/body, `title`, optional `status`/`statusTone`, `actions`, `footer` and `onClose`. Compose activity content as children; the caller places and opens the panel. | Interrupting tasks that require a modal, hiding essential inputs, or assuming the component persists/docks itself. |
| `SplitPane` | `first`/`second` slots, 10–90% slider resizing; control with `ratio`/`onRatioChange`, or leave uncontrolled. Stacks when narrow. | Resizing a simple one-column screen or persisting widths without caller intent. |
| `ResizeHandle` | A Fluent Headless Slider with a meaningful `label`, `value` and `onChange`; the native range input owns arrows/Home/End. | Decorative separators with no working resize behavior or an unlabeled slider. |
| `ListDetail` | Supply `items: [{value,title,description?,group?,meta?,icon?}]`, optional controlled `selectedValue`/`onSelect`, and `children(value)` for details. Includes local text search, collapsible groups, selection and narrow Back flow. `list` preserves custom slots. | Fetching or paging remote data, silently persisting selection, or treating local search as a server-wide query. |
| `Tabs` | Related views of one entity; supply stable item IDs/content and selected state. Use `variant="inset"` for the compact source strip, otherwise underline tabs. Fluent owns arrow keys; disabled tabs remain focusable but cannot select. | A replacement for product-wide task navigation or sequential steps. |
| `Disclosure` | Optional metadata: `title`, `children`, `defaultOpen`. Use `keepMounted` for form drafts or content that must remain readable while collapsed. Fluent Accordion owns expansion; the adapter hides retained collapsed content. | Concealing required inputs or critical failures by default. |
| `InlineEditor` | One controlled `value`, `onChange`, `onSave`, `onCancel`, `pending` and `error`. Keep the draft until accepted. | Multi-field workflows, silent autosave, or using it as an authorization boundary. |

The responsive workspace follows Functions' disclosure behavior: hover/focus
previews Browse; a narrow click holds it open; selecting a destination, Escape,
outside pointer/focus or Close dismisses the overlay. Wide collapse returns
focus to Browse, and widening restores the selected collapse preference.
Arrow Down or forward Tab from Browse enters the first enabled destination.
There is no second roving-focus engine or modal focus trap. Routing, history,
global shortcuts and persistence errors remain consumer responsibilities.
Review the `responsive-workspace` scenario before adopting the composition.
For compact search beside other header actions, omit the `navigation` slot's
Jump control and supply `CanvasHeader.search={{ onClick: openSearch }}`.
The header owns the decorative 16px search icon, icon-only button and placement
immediately before `actions`; it does not render a search field or register a
shortcut. Search defaults to the accessible label and tooltip "Search".
Localize `aria-label`/`title` and pass native button props such as `ref`,
`disabled`, `hidden`, `aria-haspopup`, `aria-expanded` and `aria-keyshortcuts`
as needed. `children` and `icon` are not search props. Keep palette state,
actual shortcut registration and search behavior in the caller.
Omitting `search` preserves the existing header and navigation composition.
`primaryAction={{ label, onClick, icon?, disabled?, menu? }}` adds one trailing
primary button. Optional `menu={{ label, button?, children }}` uses the canonical
`SplitButton` with `MenuItem` children, keeping menu activation separate.
Disabling the primary disables both parts; `hidden` hides the whole action.
Workbench headers compact the visible label below 700px only when an icon is
provided, preserving the full accessible label and tooltip. Without an icon,
the label stays visible. Use `createIcon("plus")` for a creation action.
The application still owns approvals and execution. Review the
`navigation-detail` workspace pattern for live settings, code and API guidance.
`contextVisibility="always"` preserves required selected-resource context and
compacts Jump below 900px of available container width. The default
`"responsive"` retains ordinary context visibility rules. `contextHidden`
hides the target and separator without unmounting its draft or picker state;
hidden or absent context does not trigger earlier Jump compaction.
Mark optional secondary target controls `ct-header-secondary`
to hide them below 480px; provide the same action in a toolkit `MenuButton`
so compact layouts never lose functionality.
The workspace shell fills its provider's minimum height and scrolls overflowing
main content independently of the header and footer. Consumers retain ownership
of viewport sizing; fixed-height content must not paint over footer actions.

## Forms and choices

| Component | Use / how | Avoid |
| --- | --- | --- |
| `FormField` | Fluent Headless Field links `label`, `hint`, required state and `error` to a child control. | Using placeholders instead of labels or wrapping non-labelable custom widgets. |
| `TextInput` | One-line `value`/`defaultValue`, `onChange(event, {value})`; compose in FormField for hints/errors. | Long prose, secrets without a dedicated secure input, or validation on every keystroke without a reason. |
| `Textarea` | Multiline drafts with native textarea props and `onChange(event, {value})`; compose in FormField. | Treating Enter as submission; use PromptComposer for messages. |
| `Select` | A small, known single-choice set with native behavior; `value` must match an option. | Very large searchable catalogs; use SelectPanel. |
| `Checkbox` | Independent yes/no `checked` state; use toolkit `"mixed"` for partial selection. | Mutually exclusive choices or disguising an immediate write as harmless selection. |
| `CheckboxGroup` | Labeled fieldset containing Checkbox children with caller-owned checked state. Use `hint` for group guidance and `variant="cards"` for described choices. | A long catalog that needs search. |
| `RadioGroup` / `ChoiceGroup` | Labeled group with Radio children, `value` and `onChange`; use `hint` and per-Radio `description` to explain choices. | A command menu or unrelated action buttons. |
| `Switch` | Independent on/off setting: label above, state beside the track, optional `hint` below. Supports controlled or default state, `size="small"` and localized `onLabel`/`offLabel`. | Selecting a mode from several alternatives or implying a remote change succeeded. |
| `SelectPanel` | Trigger opens a titled, searchable option panel. Supply `options: [{value, label, description?, disabled?}]`, `selectedOptions` and `onOptionSelect`; use `multiselect` only for independent selections. Fluent Listbox owns selection and active-descendant navigation inside the popover. | Network discovery inside the control; present loading/errors outside it, not as fake empty options. |
| `InputWithAction` | `label`, `input` props and `action` Button props; stacks below 360px. `preview` is linked to the input. The caller handles picker cancellation, pending/errors and stale results. | Assuming filesystem access, folder drag/drop, or treating cancellation as failure. |

## Content and actions

| Component | Use / how | Avoid |
| --- | --- | --- |
| `SectionHeader` | Modest title, optional description/count, aligned section actions. | Nested page heroes or making every label bold. |
| `ActionGroup` | A small wrapping group of related native buttons. | Giving unrelated actions one ambiguous group label. |
| `ActionToolbar` | A related command set with Fluent-owned focusgroup navigation and arrow keys. | Ordinary forms whose controls need independent Tab stops. |
| `SplitButton` | Joined primary `button` and separate menu trigger; menu children use `MenuItem`. Name icon-only buttons and localize `menuLabel`. Fluent owns menu keys, dismissal and focus restoration. | Opening the menu by executing the primary action, or using menu selection as execution approval. |
| `ActionCard` | A short next action or prompt suggestion; optional decorative icon, compact/joined styles. | Nested interactive controls or selecting a value without choice semantics. |
| `Badge` / `Tag` | Short status or wrapping neutral metadata; supply text children. | Color-only severity, paragraphs, or action buttons disguised as status. These tags do not have removal behavior. |
| `Counter` | `count` and an accessible label, including zero. | Unknown totals represented as zero. |
| `MetadataList` | Responsive horizontal tiles with each label above its value; `items: [{label, value}]` keeps definition-list semantics. | Editable forms or aligned label/value rows; use `KeyValueList` for those read-only rows. |
| `KeyValueList` | Compact definition-list rows, label left and value right; below 520px each label stacks above its value. Values may be React nodes. | Comparing entities or using a row layout when metadata should scan horizontally. |
| `CodeBlock` | Preserved read-only text as children; optional `title`, `language`, accessible `label` and header `actions`. Caller supplies reviewed copy/run callbacks; omitting header props keeps a plain code region. | Automatically executing code, unsanitized HTML, or assuming clipboard permission. |
| `OutputPanel` | Read-only text with a visible `label`, optional actual `status`, supporting `description` and localized `emptyMessage`. Status is announced separately from the log. | A terminal emulator, executing commands, unredacted secrets, or inventing success. |
| `Table` | Compose TableHeader, TableBody, TableRow and cells. Caller supplies actual sorted rows and any actions. Each body cell gets `data-label` from its column header (an author-set value wins), shown as the card label below 520px; card rows use block layout, so keep tables small and the header text meaningful. | Spreadsheet editing, virtualization, nested controls on clickable rows, or sorting partial remote data. |

`Button` and `ToolbarButton` accept an optional
`counter={{ count: 3, label: "3 activity entries" }}`. The shared `Counter`
appears in the button's top-end corner without changing its layout size.
Omit `counter` to remove it; an explicit count of zero displays zero.
Counts above 99 display `99+`; use the full count in the accessible label.
The localized `label` describes the count through `aria-describedby`, preserving
the button's action name and any existing description. Counter updates do not
create a live region or move focus. The caller owns what is counted; adding this
capability does not enable activity counting in a product.

The shared form styling follows the Functions #304 treatment: normal-weight
caption labels, 32px-minimum controls, 6px button corners, wrapping neutral tags
and an 8px input/action gap. Colors and type ramps still come from the host.
Required fields retain native/ARIA semantics without adding an asterisk to the label.
For a multi-field destination summary, compose a separate caption/value block
after the fields and link its ID from both inputs' `aria-describedby`; hide it
until complete. Keep path formatting, readiness rules and end-aligned page
actions in the consuming canvas. The browser gallery includes this composition.
This is a reference for those patterns, not a claim of pixel parity for every
SRE or Functions screen.

## Feedback and interaction

| Component | Use / how | Avoid |
| --- | --- | --- |
| `PromptComposer` | Bordered autosizing draft with circular Send action: controlled `value`, `onChange`, explicit `onSubmit`, `pending`, `error` and optional extra `actions`. Its `label`/`submitLabel` remain accessible. Enter inserts a newline; clear only after accepted submission. | Sending from example-card selection or clearing before accepted submission. |
| `Spinner` | A short unknown-duration wait with a meaningful accessible label. | Showing it indefinitely without recovery or implying measured progress. |
| `ProgressBar` | Real 0–1 progress (or explicit `max`); omit value for indeterminate work. | Fabricated percentages or time estimates. |
| `Skeleton` | Wrap SkeletonItem children for an initial load; give the region an accessible label. | Masking errors or replacing stable content on every refresh. |
| `MessageBar` | Concise information, success, warning or error using the matching intent. Long paths and URLs wrap without text loss. | Long transcripts or reporting unavailable reads as “nothing found.” |
| `Blankslate` | A genuine empty state with one useful next action. | Displaying it after a failed or cancelled read. |
| `FilterPill` | One applied/available filter with caller-owned state. | Status decoration with no filtering behavior. |
| `FilterToolbar` | Supply `search` input props, `facets`, controlled `values`/`onFiltersChange` and `sort` options. Search stays visible; controls wrap when narrow. `resultCount` announces caller results. Children-only usage retains ActionToolbar behavior. | Implicit remote filtering/sorting or representing local matches as complete server results. |
| `Dialog` | Bounded modal with divided header/body/footer: `title`, optional `subtitle`, `trigger`, `children`, `actions` and Close. Use `size` for small/medium/large/xlarge; wrap footer dismiss buttons in DialogTrigger. Fluent and native dialog behavior own focus and Escape. | Routine details better shown inline or in DetailPanel; a second custom focus trap. |
| `Popover` | Compose PopoverTrigger and PopoverSurface for anchored interactive content. | Essential information available only on hover. |
| `MenuButton` | A short list of actions with keyboard selection. | Large searchable catalogs or product navigation. |
| `Tooltip` | Short supplementary description for an existing trigger. | Required instructions, interactive content or replacing an accessible name. |

### Azure CLI profile refresh and signed-out state

`createAzureSubscriptionPicker` from `ui/azure-subscription-picker` accepts
`refreshOnFocus: true` (or `{ debounceMs }`, default 500). It re-reads the
transport when the window gets focus or the tab becomes visible. It skips the
read while a read is in progress, while refresh is disabled, or while the
picker is open. Use it to pick up an `az login` from a terminal.

- Do not add a "Reload profile" or "Load profile" button. Users do not know
  what "profile" means.
- Show the signed-in account as a footer status item: `Azure CLI: <account>`.
- When the profile cannot load, show a `Blankslate` titled "Sign in to Azure",
  a `CodeBlock` with `az login` and a Copy header action, an Azure CLI install
  hint, and a "Check again" button.

## Legacy factory migration

The following examples and lifecycle notes are for existing `ui/components`
callers, not the React props above. They remain supported during migration.

```js
import {
    createTextInput, createDisclosure, createMetadataList, createInputWithAction,
} from "@microsoft/canvas-toolkit/ui/components";

const name = createTextInput({
    mount, label: "App name", value: draft.name,
    onChange: value => { draft.name = value; },
});
const details = createMetadataList({
    items: [{ id: "language", label: "Language", value: "JavaScript" }],
});
const disclosure = createDisclosure({
    mount, label: "App details", content: details.element,
});
const folder = createInputWithAction({
    mount, label: "Parent folder", value: draft.folder, actionLabel: "Browse",
    onChange: value => { draft.folder = value; },
    onAction: () => host.chooseFolder(), // Real host adapter; cancellation returns null.
});

// On the owning view's unmount, including a React effect cleanup:
name.dispose(); folder.dispose(); disclosure.dispose(); details.dispose();
```

For navigation, keep the two responsibilities separate:

```js
const navigation = createProductNavigation({
    mount, container: shellElement, label: "Tasks", currentId: route,
    groups: [{ label: "Work", items: destinations }],
    onSelect: id => navigate(id),
});
const commands = createCommandPalette({
    items: availableCommands,
    onSelect: id => executeReviewedCommand(id),
});
// The app wires its Jump trigger to commands.open().
```

`onSelect`, `onChange` and synchronous action callbacks report intent; the caller
owns failures from its own operations. Components with built-in async workflows
(composer, palette, inline editor, browse, copy and footer language selection)
display rejected operations and invalidate stale completions when replaced or
disposed. Other controls do not start background work.

## Migration boundaries

- Adopt one section at a time; keep product state, drafts, routes and operation
  approvals where they already live. Replace presentation, not business logic.
- Public updates are shallow patches. Supply a complete nested configuration
  when replacing groups/options; preserve stable IDs and explicitly adjust
  selection when removing the selected tab or option.
- Tables never query or sort implicitly. Pass the actual collection, sort state
  and loading/error state. Output text should already be appropriately redacted.
- Native dialog and Popover APIs are required by their components; unsupported
  browsers throw rather than pretending the interaction works.
- Keep app-wide keyboard shortcut registration at the consumer boundary.
  Components only handle keys while focus is within their own surface.
