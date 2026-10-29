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

## Interaction ownership

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

| Component | Use / how | Avoid |
| --- | --- | --- |
| `CanvasShell` | Page-layout wrapper for `header`, main `children` and `footer`; it is not a header widget. Give the wrapper the available height when the footer must sit at the bottom. | Comparing an entire page composition with a header alone, or forcing every canvas into one page layout. |
| `CanvasHeader` | Product `title`, selected `context`, `navigation` and a few `actions`. Supply `browse` Button props and `history` for the current browser-style header; omitting both keeps centered navigation. | Putting every destination or raw account metadata in the header. |
| `CanvasFooter` | Real `links`, `language` control and `version` slots. Handle language errors in the app. | Placeholder links, fake translation, fixed overlays covering content. |
| `NavigationControls` | Supply `browse`, real history availability and Jump callbacks. `variant="browser"` uses chevrons; `layout="header"` puts caller-owned identity children on the left and Jump/`actions` on the right. Render the page scope below. Localize labels and only show registered `shortcutLabel`s. | Treating shortcut hints as registered shortcuts, or inventing history. |
| `ProductNavigation` | Grouped sidebar destinations: `items`, optional `groups`, `current`, `onNavigate(event, value)`. Use `variant="inline"` for a small wrapping set. Caller controls sidebar/overlay visibility. | Using command search as the only way to discover core tasks; application-wide modal focus traps. |
| `CommandPalette` | Visible `commands`, `onCommand` and a `trigger` or controlled `open`. Type to filter; Down/Up enters results, Fluent owns arrow navigation, Home/End jumps to boundaries, Enter selects and Escape restores trigger focus. Localize copy. | Hard-coded routes, mouse-only entry, nested search dropdowns, or interpreting selection as authorization. Global shortcuts remain caller-owned. |
| `DetailPanel` | Bordered secondary surface with a divided header/body, `title`, optional `status`/`statusTone`, `actions`, `footer` and `onClose`. Compose activity content as children; the caller places and opens the panel. | Interrupting tasks that require a modal, hiding essential inputs, or assuming the component persists/docks itself. |
| `SplitPane` | `first`/`second` slots, 10–90% slider resizing; control with `ratio`/`onRatioChange`, or leave uncontrolled. Stacks when narrow. | Resizing a simple one-column screen or persisting widths without caller intent. |
| `ResizeHandle` | A Fluent Headless Slider with a meaningful `label`, `value` and `onChange`; the native range input owns arrows/Home/End. | Decorative separators with no working resize behavior or an unlabeled slider. |
| `ListDetail` | Supply `items: [{value,title,description?,group?,meta?,icon?}]`, optional controlled `selectedValue`/`onSelect`, and `children(value)` for details. Includes local text search, collapsible groups, selection and narrow Back flow. `list` preserves custom slots. | Fetching or paging remote data, silently persisting selection, or treating local search as a server-wide query. |
| `Tabs` | Related views of one entity; supply stable item IDs/content and selected state. Use `variant="inset"` for the compact source strip, otherwise underline tabs. Fluent owns arrow keys; disabled tabs remain focusable but cannot select. | A replacement for product-wide task navigation or sequential steps. |
| `Disclosure` | Optional metadata: `title`, `children`, `defaultOpen`. Use `keepMounted` for form drafts or content that must remain readable while collapsed. Fluent Accordion owns expansion; the adapter hides retained collapsed content. | Concealing required inputs or critical failures by default. |
| `InlineEditor` | One controlled `value`, `onChange`, `onSave`, `onCancel`, `pending` and `error`. Keep the draft until accepted. | Multi-field workflows, silent autosave, or using it as an authorization boundary. |

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
| `KeyValueList` | Compact definition-list rows, label left and value right. Values may be React nodes. | Comparing entities or using a row layout when metadata should scan horizontally. |
| `CodeBlock` | Preserved read-only text as children; optional `title`, `language`, accessible `label` and header `actions`. Caller supplies reviewed copy/run callbacks; omitting header props keeps a plain code region. | Automatically executing code, unsanitized HTML, or assuming clipboard permission. |
| `OutputPanel` | Read-only text with a visible `label`, optional actual `status`, supporting `description` and localized `emptyMessage`. Status is announced separately from the log. | A terminal emulator, executing commands, unredacted secrets, or inventing success. |
| `Table` | Compose TableHeader, TableBody, TableRow and cells. Caller supplies actual sorted rows and any actions. | Spreadsheet editing, virtualization, nested controls on clickable rows, or sorting partial remote data. |

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
