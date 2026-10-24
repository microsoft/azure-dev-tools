// packages/canvas-toolkit/src/ui/content.mjs
import { node, label, callback, content, visibleText, listen, lifecycle, button, actions, items, safeHref } from "./component-helpers.mjs";
import { createCommandsLog } from "./commands-log.mjs";
var tones = ["neutral", "info", "success", "warning", "error"];
function createBadge({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "span", "canvas-badge canvas-ui");
  const copy = node(document, "span");
  const cleanups = [];
  let state = { tone: "neutral", ...options };
  const remove = button(document, options.removeLabel ?? "Remove");
  root.append(copy, remove);
  listen(cleanups, remove, "click", () => state.onRemove?.());
  function update(patch = {}) {
    state = { ...state, ...patch };
    label(state.label);
    callback(state.onRemove);
    if (!tones.includes(state.tone)) throw new TypeError("Unknown badge tone.");
    root.setAttribute("data-tone", state.tone);
    copy.textContent = state.label;
    remove.hidden = !state.onRemove;
    remove.textContent = state.removeLabel ?? "\xD7";
    remove.setAttribute("aria-label", state.removeLabel ?? `Remove ${state.label}`);
  }
  update();
  return { ...lifecycle(root, mount, cleanups), update };
}
var createTag = createBadge;
function createCounter({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "span", "canvas-counter canvas-ui");
  let state = { value: 0, ...options };
  function update(patch = {}) {
    state = { ...state, ...patch };
    label(state.label);
    if (!Number.isFinite(state.value) || state.value < 0) throw new RangeError("Counter value must be nonnegative.");
    root.textContent = state.formatValue ? state.formatValue(state.value) : String(state.value);
    root.setAttribute("aria-label", `${state.label}: ${root.textContent}`);
  }
  update();
  return { ...lifecycle(root, mount), update };
}
function createActionGroup({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "div", "canvas-action-group canvas-ui");
  root.setAttribute("role", options.toolbar ? "toolbar" : "group");
  let state = { actions: [], ...options };
  let rowCleanups = [];
  const cleanups = [];
  function update(patch = {}) {
    state = { ...state, ...patch };
    label(state.label);
    for (const cleanup of rowCleanups.splice(0)) cleanup();
    root.setAttribute("aria-label", state.label);
    root.setAttribute("role", state.toolbar ? "toolbar" : "group");
    actions(document, root, state.actions, rowCleanups);
    if (state.toolbar) {
      const first = [...root.children].find((child) => !child.disabled);
      [...root.children].forEach((child) => {
        child.tabIndex = child === first ? 0 : -1;
      });
    }
  }
  listen(cleanups, root, "keydown", (event) => {
    if (!state.toolbar || !["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    const controls = [...root.children].filter((control) => !control.disabled);
    if (!controls.length) return;
    event.preventDefault();
    let index = controls.indexOf(document.activeElement);
    index = event.key === "Home" ? 0 : event.key === "End" ? controls.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + controls.length) % controls.length;
    for (const control of controls) control.tabIndex = -1;
    controls[index].tabIndex = 0;
    controls[index].focus();
  });
  update();
  return { ...lifecycle(root, mount, [() => {
    for (const cleanup of [...cleanups, ...rowCleanups]) cleanup();
  }]), update };
}
var createActionToolbar = (options) => createActionGroup({ ...options, toolbar: true });
function createSectionHeader({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "header", "canvas-section-header canvas-ui");
  const copy = node(document, "div");
  const heading = node(document, "h2");
  const description = node(document, "p", "canvas-field__hint");
  const counter = node(document, "span", "canvas-counter");
  const group = createActionGroup({ document, label: options.actionsLabel ?? "Section actions" });
  copy.append(heading, description);
  root.append(copy, counter, group.element);
  let state = { actions: [], ...options };
  function update(patch = {}) {
    state = { ...state, ...patch };
    heading.textContent = label(state.title, "title");
    visibleText(description, state.description);
    if (state.count != null && (!Number.isFinite(state.count) || state.count < 0)) throw new RangeError("count must be nonnegative.");
    visibleText(counter, state.count == null ? "" : String(state.count));
    counter.setAttribute("aria-label", `${state.countLabel ?? "Count"}: ${state.count ?? ""}`);
    group.update({ actions: state.actions, label: state.actionsLabel ?? "Section actions" });
  }
  update();
  return { ...lifecycle(root, mount, [group.dispose]), heading, update };
}
function createMetadataList({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "dl", "canvas-metadata canvas-ui");
  let state = { items: [], ...options };
  function update(patch = {}) {
    state = { ...state, ...patch };
    items(state.items);
    root.replaceChildren(...state.items.map((item) => {
      const row = node(document, "div", "canvas-metadata__row");
      const term = node(document, "dt", "", item.label);
      const value = node(document, "dd");
      if (item.href) {
        const link = node(document, "a", "", item.value);
        link.setAttribute("href", safeHref(item.href));
        value.append(link);
      } else content(value, item.value);
      row.append(term, value);
      return row;
    }));
  }
  update();
  return { ...lifecycle(root, mount), update };
}
var createKeyValueList = createMetadataList;
function createCodeBlock({ document = globalThis.document, mount, ...options } = {}) {
  label(options.label);
  callback(options.onCopy);
  const root = node(document, "section", "canvas-code-block canvas-ui");
  const header = node(document, "div", "canvas-section-header");
  const heading = node(document, "h3");
  const copy = button(document, options.copyLabel ?? "Copy");
  const pre = node(document, "pre");
  pre.tabIndex = 0;
  const code = node(document, "code");
  const status = node(document, "p", "canvas-field__hint");
  status.setAttribute("role", "status");
  pre.append(code);
  header.append(heading, copy);
  root.append(header, pre, status);
  status.hidden = true;
  const cleanups = [];
  let state = { code: "", copy: true, ...options };
  let revision = 0;
  let pending = false;
  const view = lifecycle(root, mount, cleanups);
  listen(cleanups, copy, "click", async () => {
    if (pending) return;
    const run = revision;
    pending = true;
    copy.disabled = true;
    try {
      if (state.onCopy) await state.onCopy(state.code);
      else {
        const clipboard = document.defaultView?.navigator?.clipboard;
        if (!clipboard?.writeText) throw new Error(state.unavailableText ?? "Clipboard is unavailable. Select and copy the text instead.");
        await clipboard.writeText(state.code);
      }
      if (!view.disposed && run === revision) {
        status.setAttribute("role", "status");
        visibleText(status, state.copiedText ?? "Copied.");
      }
    } catch (failure) {
      if (!view.disposed && run === revision) {
        status.setAttribute("role", "alert");
        visibleText(status, failure instanceof Error ? failure.message : String(failure));
      }
    } finally {
      if (!view.disposed && run === revision) {
        pending = false;
        copy.disabled = false;
      }
    }
  });
  function update(patch = {}) {
    state = { ...state, ...patch };
    label(state.label);
    callback(state.onCopy);
    revision++;
    pending = false;
    copy.disabled = false;
    visibleText(status, "");
    heading.textContent = state.label;
    pre.setAttribute("aria-label", state.label);
    code.textContent = state.code;
    code.setAttribute("data-language", state.language ?? "");
    copy.hidden = !state.copy;
    copy.textContent = label(state.copyLabel ?? "Copy");
  }
  update();
  return { ...view, code, update };
}
function createOutputPanel({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "section", "canvas-output canvas-ui");
  const heading = node(document, "h3");
  const status = node(document, "p", "canvas-field__hint");
  status.setAttribute("role", "status");
  const pre = node(document, "pre");
  pre.tabIndex = 0;
  const log = createCommandsLog({ document, title: options.commandsLabel ?? "Command activity" });
  root.append(heading, status, pre, log.element);
  let state = { output: "", status: "", commands: [], ...options };
  function update(patch = {}) {
    state = { ...state, ...patch };
    label(state.label);
    if (!Array.isArray(state.commands)) throw new TypeError("commands must be an array.");
    heading.textContent = state.label;
    visibleText(status, state.status);
    status.setAttribute("role", state.error ? "alert" : "status");
    status.textContent = state.error || state.status;
    status.hidden = !state.error && !state.status;
    pre.textContent = state.output;
    pre.setAttribute("aria-label", state.label);
    log.element.hidden = state.commands.length === 0;
    log.render(state.commands);
  }
  update();
  return { ...lifecycle(root, mount, [log.destroy]), update };
}
function createTable({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "section", "canvas-table canvas-ui");
  const viewport = node(document, "div", "canvas-table__viewport");
  viewport.tabIndex = 0;
  viewport.setAttribute("role", "region");
  const table = node(document, "table");
  const caption = node(document, "caption");
  const head = node(document, "thead");
  const body = node(document, "tbody");
  const status = node(document, "p", "canvas-field__hint");
  status.setAttribute("role", "status");
  table.append(caption, head, body);
  viewport.append(table);
  root.append(viewport, status);
  let state = { columns: [], rows: [], loading: false, emptyText: "No rows.", ...options };
  let cleanups = [];
  function update(patch = {}) {
    const next = { ...state, ...patch };
    label(next.label);
    items(next.columns);
    if (!Array.isArray(next.rows)) throw new TypeError("rows must be an array.");
    const rowIds = /* @__PURE__ */ new Set();
    for (const row of next.rows) {
      label(row.id, "row.id");
      if (rowIds.has(row.id)) throw new TypeError("Duplicate row id.");
      rowIds.add(row.id);
    }
    if (next.sort && (!next.columns.some((column) => column.id === next.sort.columnId) || !["ascending", "descending"].includes(next.sort.direction))) {
      throw new TypeError("sort requires an existing columnId and ascending/descending direction.");
    }
    callback(next.onSort);
    callback(next.onRowAction);
    callback(next.renderCell);
    state = next;
    for (const cleanup of cleanups.splice(0)) cleanup();
    caption.textContent = state.label;
    viewport.setAttribute("aria-label", state.label);
    root.setAttribute("aria-busy", String(Boolean(state.loading)));
    const header = node(document, "tr");
    header.append(...state.columns.map((column) => {
      const cell = node(document, "th");
      cell.scope = "col";
      if (state.sort?.columnId === column.id) cell.setAttribute("aria-sort", state.sort.direction);
      if (column.sortable && state.onSort) {
        cell.append(button(document, column.label, () => state.onSort({
          columnId: column.id,
          direction: state.sort?.columnId === column.id && state.sort.direction === "ascending" ? "descending" : "ascending"
        }), cleanups));
      } else cell.textContent = column.label;
      return cell;
    }));
    if (state.onRowAction) header.append(node(document, "th", "", state.actionsLabel ?? "Actions"));
    head.replaceChildren(header);
    body.replaceChildren(...(state.error ? [] : state.rows).map((row) => {
      const tr = node(document, "tr");
      for (const column of state.columns) {
        const cell = node(document, "td");
        content(cell, state.renderCell ? state.renderCell(row, column) : row[column.id]);
        tr.append(cell);
      }
      if (state.onRowAction) {
        const cell = node(document, "td");
        const control = button(document, state.rowActionLabel ?? "Open", () => state.onRowAction(row), cleanups);
        control.setAttribute("aria-label", `${state.rowActionLabel ?? "Open"} ${row.label ?? row.id}`);
        control.disabled = Boolean(row.disabled || state.loading);
        cell.append(control);
        tr.append(cell);
      }
      return tr;
    }));
    status.setAttribute("role", state.error ? "alert" : "status");
    visibleText(status, state.error || (state.loading ? state.loadingText ?? "Loading\u2026" : !state.rows.length ? state.emptyText : ""));
  }
  update();
  return { ...lifecycle(root, mount, [() => {
    for (const cleanup of cleanups.splice(0)) cleanup();
  }]), table, update };
}
export {
  createActionGroup,
  createActionToolbar,
  createBadge,
  createCodeBlock,
  createCounter,
  createKeyValueList,
  createMetadataList,
  createOutputPanel,
  createSectionHeader,
  createTable,
  createTag
};
