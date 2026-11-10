// packages/canvas-toolkit/src/ui/navigation.mjs
import { id, node, label, callback, content, visibleText, listen, lifecycle, button, items, observeWidth } from "./component-helpers.mjs";
import { createDialog } from "./components.mjs";
function createDisclosure({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "details", "canvas-disclosure canvas-ui");
  const summary = node(document, "summary");
  const body = node(document, "div", "canvas-disclosure__body");
  root.append(summary, body);
  let state = { open: false, ...options };
  const cleanups = [];
  listen(cleanups, root, "toggle", () => {
    if (state.open === root.open) return;
    state.open = root.open;
    state.onToggle?.(root.open);
  });
  function update(patch = {}) {
    state = { ...state, ...patch };
    label(state.label);
    callback(state.onToggle);
    summary.textContent = state.label;
    if (!state.open && body.contains(document.activeElement)) summary.focus();
    root.open = Boolean(state.open);
    if (Object.hasOwn(patch, "content")) content(body, state.content);
  }
  update(state);
  return { ...lifecycle(root, mount, cleanups), content: body, summary, update };
}
function createTabs({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "div", "canvas-tabs canvas-ui");
  const list = node(document, "div", "canvas-tabs__list");
  list.setAttribute("role", "tablist");
  const panels = node(document, "div");
  root.append(list, panels);
  const prefix = id();
  let state = { items: [], selectedId: null, ...options };
  let cleanups = [];
  function update(patch = {}) {
    const next = { ...state, ...patch };
    label(next.label);
    items(next.items);
    callback(next.onSelect);
    if (next.selectedId === null) next.selectedId = next.items.find((item) => !item.disabled)?.id ?? null;
    if (next.selectedId != null && !next.items.some((item) => item.id === next.selectedId && !item.disabled)) {
      throw new RangeError("selectedId must identify an enabled tab.");
    }
    const focused = document.activeElement?.getAttribute("data-tab-id");
    for (const cleanup of cleanups.splice(0)) cleanup();
    state = next;
    list.setAttribute("aria-label", state.label);
    const tabs = [];
    const sections = [];
    state.items.forEach((item, index) => {
      const tab = button(document, item.label);
      tab.id = `${prefix}-tab-${index}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("data-tab-id", item.id);
      tab.setAttribute("aria-selected", String(item.id === state.selectedId));
      tab.tabIndex = item.id === state.selectedId ? 0 : -1;
      tab.disabled = Boolean(item.disabled);
      const panel = node(document, "section", "canvas-tabs__panel");
      panel.id = `${prefix}-panel-${index}`;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);
      tab.setAttribute("aria-controls", panel.id);
      panel.hidden = item.id !== state.selectedId;
      panel.tabIndex = 0;
      content(panel, item.content);
      listen(cleanups, tab, "click", () => {
        update({ selectedId: item.id });
        state.onSelect?.(item.id);
      });
      listen(cleanups, tab, "keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        const enabled = [...list.children].filter((control) => !control.disabled);
        event.preventDefault();
        const index2 = enabled.indexOf(tab);
        const next2 = event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : (index2 + (event.key === "ArrowRight" ? 1 : -1) + enabled.length) % enabled.length;
        enabled[next2].focus();
        enabled[next2].click();
      });
      tabs.push(tab);
      sections.push(panel);
    });
    list.replaceChildren(...tabs);
    panels.replaceChildren(...sections);
    if (focused) [...list.children].find((tab) => tab.getAttribute("data-tab-id") === focused && !tab.disabled)?.focus();
  }
  update();
  return { ...lifecycle(root, mount, [() => {
    for (const cleanup of cleanups.splice(0)) cleanup();
  }]), update };
}
function createResizeHandle({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "div", "canvas-resize canvas-ui");
  root.setAttribute("role", "separator");
  root.tabIndex = 0;
  let state = { value: 240, min: 120, max: 600, step: 10, orientation: "vertical", reverse: false, ...options };
  const cleanups = [];
  let drag;
  function update(patch = {}) {
    const next = { ...state, ...patch };
    label(next.label);
    callback(next.onResize);
    if (![next.min, next.max, next.value, next.step].every(Number.isFinite) || next.min > next.max || next.step <= 0 || !["vertical", "horizontal"].includes(next.orientation)) {
      throw new RangeError("Resize bounds, value, step or orientation are invalid.");
    }
    state = next;
    state.value = Math.min(state.max, Math.max(state.min, state.value));
    root.setAttribute("aria-label", state.label);
    root.setAttribute("aria-orientation", state.orientation);
    for (const key of ["min", "max", "now"]) root.setAttribute(`aria-value${key}`, String(key === "now" ? state.value : state[key]));
    root.setAttribute("data-orientation", state.orientation);
    if (state.controls) root.setAttribute("aria-controls", state.controls);
    else root.removeAttribute("aria-controls");
  }
  function resize(value) {
    update({ value });
    state.onResize?.(state.value);
  }
  listen(cleanups, root, "keydown", (event) => {
    const backward = state.orientation === "vertical" ? "ArrowLeft" : "ArrowUp";
    const forward = state.orientation === "vertical" ? "ArrowRight" : "ArrowDown";
    if (![backward, forward, "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    resize(event.key === "Home" ? state.min : event.key === "End" ? state.max : state.value + (event.key === forward ? state.step : -state.step) * (state.reverse ? -1 : 1));
  });
  const end = () => {
    if (drag && root.hasPointerCapture(drag.id)) root.releasePointerCapture(drag.id);
    drag = void 0;
  };
  listen(cleanups, root, "pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    root.focus();
    drag = { id: event.pointerId, coordinate: state.orientation === "vertical" ? event.clientX : event.clientY, value: state.value };
    root.setPointerCapture(event.pointerId);
  });
  listen(cleanups, root, "pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    resize(drag.value + ((state.orientation === "vertical" ? event.clientX : event.clientY) - drag.coordinate) * (state.reverse ? -1 : 1));
  });
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"]) listen(cleanups, root, event, end);
  update();
  return { ...lifecycle(root, mount, [end, ...cleanups]), update };
}
function createSplitPane({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "div", "canvas-split-pane canvas-ui");
  const primary = node(document, "section", "canvas-split-pane__primary");
  primary.id = id();
  const secondary = node(document, "section", "canvas-split-pane__secondary");
  let state = { size: 240, min: 120, max: 600, narrowAt: 520, ...options };
  const cleanups = [];
  const resize = createResizeHandle({
    document,
    label: options.resizeLabel ?? "Resize primary pane",
    controls: primary.id,
    value: state.size,
    min: state.min,
    max: state.max,
    onResize(value) {
      state.size = value;
      root.style.setProperty("--canvas-pane-size", `${value}px`);
      state.onResize?.(value);
    }
  });
  root.append(primary, resize.element, secondary);
  function update(patch = {}) {
    state = { ...state, ...patch };
    callback(state.onResize);
    primary.setAttribute("aria-label", label(state.primaryLabel ?? "Primary pane"));
    secondary.setAttribute("aria-label", label(state.secondaryLabel ?? "Secondary pane"));
    if (Object.hasOwn(patch, "primary")) content(primary, patch.primary);
    if (Object.hasOwn(patch, "secondary")) content(secondary, patch.secondary);
    resize.update({ value: state.size, min: state.min, max: state.max, label: state.resizeLabel ?? "Resize primary pane" });
    root.style.setProperty("--canvas-pane-size", `${Math.min(state.max, Math.max(state.min, state.size))}px`);
  }
  update(state);
  cleanups.push(resize.dispose);
  const view = lifecycle(root, mount, cleanups);
  observeWidth(root, (width) => {
    const narrow = width <= state.narrowAt;
    root.setAttribute("data-narrow", String(narrow));
    resize.element.hidden = narrow;
  }, cleanups);
  return { ...view, primary, secondary, resizeHandle: resize, update };
}
function createDetailPanel({ document = globalThis.document, mount, trigger, ...options } = {}) {
  const root = node(document, "aside", "canvas-detail-panel canvas-ui");
  root.id = id();
  const header = node(document, "header", "canvas-section-header");
  const heading = node(document, "h2");
  heading.id = id();
  root.setAttribute("aria-labelledby", heading.id);
  const closeButton = button(document, options.closeLabel ?? "Close");
  const body = node(document, "div", "canvas-detail-panel__body");
  header.append(heading, closeButton);
  root.append(header, body);
  let state = { open: false, size: 320, narrowAt: 640, ...options };
  const cleanups = [];
  let opener;
  const resize = createResizeHandle({
    document,
    label: options.resizeLabel ?? "Resize detail panel",
    value: state.size,
    min: 180,
    max: 800,
    controls: root.id,
    reverse: true,
    onResize(value) {
      state.size = value;
      root.style.setProperty("--canvas-detail-size", `${value}px`);
      state.onResize?.(value);
    }
  });
  root.prepend(resize.element);
  function update(patch = {}) {
    state = { ...state, ...patch };
    label(state.title, "title");
    callback(state.onOpenChange);
    callback(state.onResize);
    heading.textContent = state.title;
    closeButton.textContent = label(state.closeLabel ?? "Close");
    if (!state.open && root.contains(document.activeElement) && opener?.isConnected) opener.focus();
    root.hidden = !state.open;
    trigger?.setAttribute("aria-expanded", String(state.open));
    resize.update({ value: state.size, label: state.resizeLabel ?? "Resize detail panel" });
    state.size = Math.min(800, Math.max(180, state.size));
    root.style.setProperty("--canvas-detail-size", `${state.size}px`);
    if (Object.hasOwn(patch, "content")) content(body, patch.content);
  }
  const setOpen = (value) => {
    if (value === state.open) return;
    if (value) opener = trigger ?? document.activeElement;
    update({ open: value });
    if (value) closeButton.focus();
    state.onOpenChange?.(value);
  };
  if (trigger) {
    if (trigger.ownerDocument !== document) throw new TypeError("trigger must belong to the supplied document.");
    const attributes = ["aria-controls", "aria-expanded"].map((key) => [key, trigger.getAttribute(key)]);
    trigger.setAttribute("aria-controls", root.id);
    cleanups.push(() => {
      for (const [key, value] of attributes) {
        if (value == null) trigger.removeAttribute(key);
        else trigger.setAttribute(key, value);
      }
    });
    listen(cleanups, trigger, "click", () => setOpen(!state.open));
  }
  listen(cleanups, closeButton, "click", () => setOpen(false));
  listen(cleanups, root, "keydown", (event) => {
    if (event.key === "Escape" && !event.defaultPrevented) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    }
  });
  update(state);
  const view = lifecycle(root, mount, [resize.dispose, () => {
    for (const cleanup of cleanups.splice(0)) cleanup();
  }]);
  const container = mount?.nodeType === 1 ? mount : document.body;
  observeWidth(container, (width) => {
    const narrow = width <= state.narrowAt;
    root.setAttribute("data-narrow", String(narrow));
    resize.update({ orientation: narrow ? "horizontal" : "vertical" });
  }, cleanups);
  return { ...view, content: body, open: () => setOpen(true), close: () => setOpen(false), resizeHandle: resize, update };
}
function createInlineEditor({ document = globalThis.document, mount, ...options } = {}) {
  label(options.label);
  if (typeof options.onSave !== "function") throw new TypeError("onSave is required.");
  const root = node(document, "div", "canvas-inline-editor canvas-ui");
  const display = node(document, "span");
  const edit = button(document, options.editLabel ?? "Edit");
  const form = node(document, "form");
  const fieldLabel = node(document, "label");
  const input = node(document, "input");
  input.type = "text";
  input.id = id();
  fieldLabel.htmlFor = input.id;
  const save = button(document, options.saveLabel ?? "Save");
  save.type = "submit";
  const cancel = button(document, options.cancelLabel ?? "Cancel");
  const error = node(document, "p", "canvas-field__error");
  error.setAttribute("role", "alert");
  error.hidden = true;
  form.append(fieldLabel, input, save, cancel, error);
  root.append(display, edit, form);
  let state = { value: "", ...options };
  let editing = false;
  let pending = false;
  let revision = 0;
  const cleanups = [];
  const view = lifecycle(root, mount, cleanups);
  function sync() {
    display.textContent = state.value;
    display.hidden = editing;
    edit.hidden = editing;
    form.hidden = !editing;
    input.disabled = pending;
    save.disabled = pending;
    cancel.disabled = false;
    form.setAttribute("aria-busy", String(pending));
  }
  const finish = () => {
    revision++;
    pending = false;
    editing = false;
    sync();
    edit.focus();
  };
  listen(cleanups, edit, "click", () => {
    editing = true;
    input.value = state.value;
    visibleText(error, "");
    sync();
    input.focus();
  });
  listen(cleanups, cancel, "click", finish);
  listen(cleanups, form, "keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      finish();
    }
  });
  listen(cleanups, form, "submit", async (event) => {
    event.preventDefault();
    if (pending) return;
    const run = ++revision;
    const value = input.value;
    pending = true;
    sync();
    visibleText(error, "");
    try {
      const accepted = await state.onSave(value);
      if (view.disposed || revision !== run) return;
      if (accepted !== false) {
        state.value = value;
        finish();
      }
    } catch (failure) {
      if (!view.disposed && revision === run) visibleText(error, failure instanceof Error ? failure.message : String(failure));
    } finally {
      if (!view.disposed && revision === run) {
        pending = false;
        sync();
      }
    }
  });
  function update(patch = {}) {
    const next = { ...state, ...patch };
    label(next.label);
    if (typeof next.onSave !== "function") throw new TypeError("onSave is required.");
    state = next;
    fieldLabel.textContent = state.label;
    edit.textContent = label(state.editLabel ?? "Edit");
    save.textContent = label(state.saveLabel ?? "Save");
    cancel.textContent = label(state.cancelLabel ?? "Cancel");
    if (Object.hasOwn(patch, "value")) {
      revision++;
      pending = false;
      input.value = state.value;
      visibleText(error, "");
    }
    sync();
  }
  update(state);
  return { ...view, input, update };
}
function createProductNavigation({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "div", "canvas-product-navigation canvas-ui");
  const trigger = button(document, options.browseLabel ?? "Browse");
  const panel = node(document, "nav", "canvas-product-navigation__panel");
  panel.id = id();
  if (typeof panel.showPopover !== "function") throw new Error("ProductNavigation requires the Popover API.");
  trigger.setAttribute("aria-controls", panel.id);
  const header = node(document, "div", "canvas-section-header");
  const heading = node(document, "span");
  const close = button(document, options.closeLabel ?? "Close");
  const collapse = button(document, options.collapseLabel ?? "Collapse");
  const groups = node(document, "div");
  header.append(heading, collapse, close);
  panel.append(header, groups);
  root.append(trigger, panel);
  let state = { groups: [], currentId: null, collapsed: false, persistentAt: 1180, ...options };
  let persistent = false;
  let held = false;
  let suppressFocus = false;
  let rowCleanups = [];
  let leaveTimer;
  const cleanups = [];
  const cancelLeave = () => {
    document.defaultView.clearTimeout(leaveTimer);
    leaveTimer = void 0;
  };
  cleanups.push(cancelLeave);
  function isOpen() {
    return persistent && !state.collapsed || panel.matches(":popover-open");
  }
  function sync() {
    const inline = persistent && !state.collapsed;
    if (inline) {
      if (panel.matches(":popover-open")) panel.hidePopover();
      panel.removeAttribute("popover");
      panel.hidden = false;
    } else {
      panel.setAttribute("popover", "auto");
      panel.hidden = false;
    }
    root.setAttribute("data-persistent", String(inline));
    trigger.setAttribute("aria-expanded", String(isOpen()));
    collapse.hidden = !inline;
    close.hidden = inline;
  }
  const dismiss = (restore) => {
    cancelLeave();
    if (panel.matches(":popover-open")) panel.hidePopover();
    held = false;
    trigger.setAttribute("aria-expanded", String(isOpen()));
    if (restore) {
      suppressFocus = true;
      trigger.focus();
      suppressFocus = false;
    }
  };
  function open(focus = true) {
    cancelLeave();
    if (persistent && !state.collapsed) return;
    panel.showPopover();
    const rect = trigger.getBoundingClientRect();
    panel.style.left = `${Math.max(8, Math.min(rect.left, document.defaultView.innerWidth - panel.offsetWidth - 8))}px`;
    panel.style.top = `${Math.max(8, Math.min(rect.bottom + 4, document.defaultView.innerHeight - panel.offsetHeight - 8))}px`;
    trigger.setAttribute("aria-expanded", "true");
    if (focus) (panel.querySelector('[aria-current="page"]') ?? panel.querySelector("button"))?.focus();
  }
  listen(cleanups, trigger, "click", () => {
    if (persistent && !state.collapsed) {
      update({ collapsed: true });
      state.onCollapsedChange?.(true);
    } else if (held && isOpen()) dismiss(true);
    else {
      held = true;
      open();
    }
  });
  listen(cleanups, trigger, "pointerenter", (event) => {
    if (event.pointerType === "mouse" && !held) open(false);
  });
  listen(cleanups, trigger, "focus", () => {
    if (!held && !suppressFocus) open(false);
  });
  const leave = (event) => {
    if (held || panel.contains(event.relatedTarget) || trigger.contains(event.relatedTarget) || panel.contains(document.activeElement) || document.activeElement === trigger) return;
    cancelLeave();
    leaveTimer = document.defaultView.setTimeout(() => dismiss(false), 120);
  };
  listen(cleanups, trigger, "pointerleave", leave);
  listen(cleanups, panel, "pointerleave", leave);
  listen(cleanups, panel, "pointerenter", cancelLeave);
  listen(cleanups, root, "focusout", (event) => {
    if (!held && !root.contains(event.relatedTarget)) dismiss(false);
  });
  listen(cleanups, close, "click", () => dismiss(true));
  listen(cleanups, collapse, "click", () => {
    update({ collapsed: true });
    state.onCollapsedChange?.(true);
    trigger.focus();
  });
  listen(cleanups, panel, "toggle", () => trigger.setAttribute("aria-expanded", String(isOpen())));
  listen(cleanups, root, "keydown", (event) => {
    if (event.key === "Escape" && !event.defaultPrevented && !(persistent && !state.collapsed)) {
      event.preventDefault();
      dismiss(true);
    }
  });
  function update(patch = {}) {
    const next = { ...state, ...patch };
    label(next.label);
    callback(next.onSelect);
    callback(next.onCollapsedChange);
    if (!Array.isArray(next.groups)) throw new TypeError("groups must be an array.");
    items(next.groups.flatMap((group) => {
      label(group.label);
      return group.items;
    }));
    const hadFocus = panel.contains(document.activeElement);
    for (const cleanup of rowCleanups.splice(0)) cleanup();
    state = next;
    panel.setAttribute("aria-label", state.label);
    heading.textContent = state.label;
    trigger.textContent = label(state.browseLabel ?? "Browse");
    close.textContent = label(state.closeLabel ?? "Close");
    collapse.textContent = label(state.collapseLabel ?? "Collapse");
    groups.replaceChildren(...state.groups.map((group) => {
      const section = node(document, "section");
      const title = node(document, "h3", "", group.label);
      title.id = id();
      section.setAttribute("aria-labelledby", title.id);
      section.append(title, ...group.items.map((item) => {
        const control = button(document, item.label, () => {
          if (!(persistent && !state.collapsed)) dismiss(true);
          state.onSelect?.(item.id);
        }, rowCleanups);
        control.disabled = Boolean(item.disabled);
        control.setAttribute("data-destination", item.id);
        if (item.id === state.currentId) control.setAttribute("aria-current", "page");
        return control;
      }));
      return section;
    }));
    persistent = (options.container ?? root).getBoundingClientRect().width >= state.persistentAt;
    sync();
    if (hadFocus) (panel.querySelector('[aria-current="page"]') ?? trigger).focus();
  }
  update();
  const view = lifecycle(root, mount, [() => {
    dismiss(false);
    for (const cleanup of [...cleanups, ...rowCleanups]) cleanup();
  }]);
  observeWidth(options.container ?? root, (width) => {
    persistent = width >= state.persistentAt;
    sync();
  }, cleanups);
  return { ...view, trigger, panel, open: () => {
    held = true;
    open();
  }, close: () => dismiss(true), update };
}
function createCommandPalette({ document = globalThis.document, mount, ...options } = {}) {
  let state = { items: [], label: "Jump to", searchLabel: "Search destinations and actions", emptyText: "Nothing matches.", ...options };
  label(state.label);
  items(state.items);
  callback(state.onSelect);
  const dialog = createDialog({ document, mount, title: state.label, closeLabel: state.closeLabel ?? "Close" });
  dialog.element.classList.add("canvas-command-palette");
  const search = node(document, "input");
  search.type = "search";
  const list = node(document, "div", "canvas-command-palette__list");
  const status = node(document, "p", "canvas-field__hint");
  status.setAttribute("role", "status");
  dialog.content.append(search, list, status);
  const cleanups = [];
  let rowCleanups = [];
  let revision = 0;
  let pending = false;
  let disposed = false;
  function render() {
    const focused = document.activeElement?.getAttribute("data-command");
    for (const cleanup of rowCleanups.splice(0)) cleanup();
    const filtered = state.items.filter((item) => `${item.label} ${item.keywords ?? ""}`.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()));
    const groups = /* @__PURE__ */ new Map();
    for (const item of filtered) {
      const key = item.group ?? "";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    list.replaceChildren(...[...groups].map(([group, values]) => {
      const section = node(document, "section");
      if (group) section.append(node(document, "h3", "", group));
      section.append(...values.map((item) => {
        const control = button(document, item.label, async () => {
          if (pending) return;
          pending = true;
          const run = revision;
          search.disabled = true;
          render();
          visibleText(status, "");
          try {
            await state.onSelect(item.id);
            if (!disposed && revision === run) dialog.close();
          } catch (failure) {
            if (!disposed && revision === run) {
              status.setAttribute("role", "alert");
              visibleText(status, failure instanceof Error ? failure.message : String(failure));
            }
          } finally {
            if (!disposed && revision === run) {
              pending = false;
              search.disabled = false;
              render();
            }
          }
        }, rowCleanups);
        control.setAttribute("data-command", item.id);
        control.disabled = Boolean(item.disabled || pending || !state.onSelect);
        if (item.current) control.setAttribute("aria-current", "page");
        return control;
      }));
      return section;
    }));
    if (!status.textContent || status.getAttribute("role") !== "alert") visibleText(status, filtered.length ? "" : state.emptyText);
    dialog.element.setAttribute("aria-busy", String(pending));
    if (focused) [...list.querySelectorAll("button")].find((control) => control.getAttribute("data-command") === focused && !control.disabled)?.focus();
  }
  listen(cleanups, search, "input", () => {
    visibleText(status, "");
    status.setAttribute("role", "status");
    render();
  });
  listen(cleanups, dialog.content, "keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    if (event.target === search && !["ArrowDown", "ArrowUp"].includes(event.key)) return;
    const controls = [...list.querySelectorAll("button")].filter((control) => !control.disabled);
    if (!controls.length) return;
    event.preventDefault();
    const index = controls.indexOf(document.activeElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? controls.length - 1 : index < 0 ? event.key === "ArrowUp" ? controls.length - 1 : 0 : (index + (event.key === "ArrowDown" ? 1 : -1) + controls.length) % controls.length;
    controls[next].focus();
  });
  function update(patch = {}) {
    const next = { ...state, ...patch };
    label(next.label);
    items(next.items);
    callback(next.onSelect);
    state = next;
    revision++;
    pending = false;
    search.disabled = false;
    visibleText(status, "");
    search.setAttribute("aria-label", label(state.searchLabel));
    dialog.update({ title: state.label, closeLabel: state.closeLabel ?? "Close" });
    render();
  }
  update();
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    revision++;
    for (const cleanup of [...cleanups.splice(0), ...rowCleanups.splice(0)]) cleanup();
    dialog.dispose();
  };
  return {
    element: dialog.element,
    input: search,
    update,
    open() {
      revision++;
      pending = false;
      search.disabled = false;
      search.value = "";
      visibleText(status, "");
      render();
      dialog.open();
      search.focus();
    },
    close() {
      revision++;
      pending = false;
      search.disabled = false;
      dialog.close();
    },
    dispose,
    destroy: dispose
  };
}
export {
  createCommandPalette,
  createDetailPanel,
  createDisclosure,
  createInlineEditor,
  createProductNavigation,
  createResizeHandle,
  createSplitPane,
  createTabs
};
