// packages/canvas-toolkit/src/ui/components.mjs
import { createIcon } from "./icons.mjs";
import { createResizeHandle } from "./navigation.mjs";
import {
  createFormField,
  createTextInput,
  createTextarea,
  createSelect,
  createCheckbox,
  createCheckboxGroup,
  createRadioGroup,
  createChoiceGroup,
  createSwitch,
  createSelectPanel,
  createInputWithAction
} from "./forms.mjs";
import {
  createBadge,
  createTag,
  createCounter,
  createSectionHeader,
  createActionGroup,
  createActionToolbar,
  createMetadataList,
  createKeyValueList,
  createCodeBlock,
  createOutputPanel,
  createTable
} from "./content.mjs";
import {
  createProductNavigation,
  createCommandPalette,
  createDetailPanel,
  createResizeHandle as createResizeHandle2,
  createSplitPane,
  createDisclosure,
  createInlineEditor,
  createTabs
} from "./navigation.mjs";
var nextId = 0;
var text = (value) => value == null ? "" : String(value);
var validDocument = (document) => {
  if (!document?.createElement) throw new TypeError("A document is required.");
  return document;
};
var attach = (mount, element2) => {
  if (mount !== void 0) {
    if (typeof mount?.append !== "function") throw new TypeError("mount must be appendable.");
    mount.append(element2);
  }
};
var setText = (element2, value) => {
  element2.textContent = text(value);
};
var setHiddenText = (element2, value) => {
  setText(element2, value);
  element2.hidden = !value;
};
var element = (document, tag, className, content) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== void 0) setText(node, content);
  return node;
};
var button = (document, className, label, onClick, disabled = false) => {
  const node = element(document, "button", className, label);
  node.type = "button";
  node.disabled = Boolean(disabled);
  if (typeof onClick === "function") node.addEventListener("click", onClick);
  return node;
};
var destroyable = (root, cleanups = []) => {
  const dispose = () => {
    for (const cleanup of cleanups.splice(0)) cleanup();
    root.remove();
    root.replaceChildren();
  };
  return { element: root, dispose, destroy: dispose };
};
function createActionCard({
  document = globalThis.document,
  mount,
  label,
  description = "",
  detail = "",
  emphasis = "standard",
  disabled = false,
  onAction,
  icon,
  compact = false,
  joined = false
} = {}) {
  validDocument(document);
  if (typeof label !== "string" || !label.trim()) throw new TypeError("label is required.");
  if (!["standard", "primary", "secondary"].includes(emphasis)) {
    throw new TypeError("emphasis must be standard, primary, or secondary.");
  }
  if (onAction !== void 0 && typeof onAction !== "function") throw new TypeError("onAction must be a function.");
  let actionHandler = onAction;
  const root = element(document, "button", "canvas-action-card canvas-ui");
  root.type = "button";
  root.disabled = Boolean(disabled);
  const activate = () => actionHandler?.();
  root.addEventListener("click", activate);
  root.setAttribute("data-emphasis", emphasis);
  const content = element(document, "span", "canvas-action-card__content");
  const heading = element(document, "span", "canvas-action-card__heading");
  const title = element(document, "span", "canvas-action-card__title");
  const copy = element(document, "span", "canvas-action-card__copy");
  const summary = element(document, "span", "canvas-action-card__description");
  const extra = element(document, "span", "canvas-action-card__detail");
  const arrow = element(document, "span", "canvas-action-card__arrow", "\u203A");
  arrow.setAttribute("aria-hidden", "true");
  title.id = `canvas-action-card-${++nextId}-title`;
  summary.id = `${title.id}-description`;
  root.setAttribute("aria-labelledby", title.id);
  heading.append(title, arrow);
  copy.append(summary, extra);
  content.append(heading, copy);
  const iconSlot = element(document, "span", "canvas-action-card__icon");
  iconSlot.setAttribute("aria-hidden", "true");
  root.replaceChildren(iconSlot, content);
  function update(patch = {}) {
    if (Object.hasOwn(patch, "label")) {
      if (typeof patch.label !== "string" || !patch.label.trim()) throw new TypeError("label is required.");
      setText(title, patch.label);
    }
    if (Object.hasOwn(patch, "description")) {
      setHiddenText(summary, patch.description);
      root.setAttribute("aria-describedby", patch.description ? summary.id : "");
      if (!patch.description) root.removeAttribute("aria-describedby");
    }
    if (Object.hasOwn(patch, "detail")) setHiddenText(extra, patch.detail);
    if (Object.hasOwn(patch, "compact")) root.setAttribute("data-compact", String(Boolean(patch.compact)));
    if (Object.hasOwn(patch, "joined")) root.setAttribute("data-joined", String(Boolean(patch.joined)));
    if (Object.hasOwn(patch, "icon")) {
      if (patch.icon != null && (patch.icon.ownerDocument !== document || patch.icon.nodeType !== 1)) throw new TypeError("icon must be an element.");
      iconSlot.replaceChildren(...patch.icon ? [patch.icon] : []);
      iconSlot.hidden = !patch.icon;
    }
    if (Object.hasOwn(patch, "disabled")) root.disabled = Boolean(patch.disabled);
    if (Object.hasOwn(patch, "onAction")) {
      if (patch.onAction !== void 0 && typeof patch.onAction !== "function") {
        throw new TypeError("onAction must be a function.");
      }
      actionHandler = patch.onAction;
    }
    if (Object.hasOwn(patch, "emphasis")) {
      if (!["standard", "primary", "secondary"].includes(patch.emphasis)) {
        throw new TypeError("emphasis must be standard, primary, or secondary.");
      }
      root.setAttribute("data-emphasis", patch.emphasis);
    }
  }
  update({ label, description, detail, icon, compact, joined });
  attach(mount, root);
  return {
    ...destroyable(root, [() => {
      root.removeEventListener("click", activate);
      actionHandler = void 0;
    }]),
    update
  };
}
function createPromptComposer({
  document = globalThis.document,
  mount,
  label = "Message",
  placeholder = "Write a message\u2026",
  submitLabel = "Send",
  initialValue = "",
  disabled = false,
  clearOnSubmit = true,
  submitKey = "mod-enter",
  onSubmit,
  autoSize = false,
  sendAppearance = "text",
  accessories,
  pendingLabel = "Sending\u2026"
} = {}) {
  validDocument(document);
  if (typeof onSubmit !== "function") throw new TypeError("onSubmit is required.");
  const validateSubmitKey = (value) => {
    if (!["enter", "mod-enter"].includes(value)) throw new TypeError("submitKey must be enter or mod-enter.");
    return value;
  };
  let currentSubmitKey = validateSubmitKey(submitKey);
  const root = element(document, "form", "canvas-prompt-composer canvas-ui");
  const inputId = `canvas-prompt-${++nextId}`;
  const fieldLabel = element(document, "label", "canvas-prompt-composer__label", label);
  const input = element(document, "textarea", "canvas-prompt-composer__input");
  input.id = inputId;
  input.rows = 2;
  input.value = text(initialValue);
  input.placeholder = placeholder;
  fieldLabel.htmlFor = inputId;
  const footer = element(document, "div", "canvas-prompt-composer__footer");
  const error = element(document, "div", "canvas-prompt-composer__error");
  error.setAttribute("role", "alert");
  error.hidden = true;
  const status = element(document, "span", "canvas-prompt-composer__status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.hidden = true;
  const send = button(document, "primary-button canvas-prompt-composer__submit", submitLabel);
  const accessorySlot = element(document, "div", "canvas-prompt-composer__accessories");
  footer.append(accessorySlot, status, send);
  root.append(fieldLabel, input, error, footer);
  let pending = false;
  let unavailable = Boolean(disabled);
  let submitHandler = onSubmit;
  let shouldClearOnSubmit = clearOnSubmit;
  let disposed = false;
  let revision = 0;
  let currentAutoSize = autoSize;
  let currentPendingLabel = pendingLabel;
  const resize = () => {
    if (!currentAutoSize) {
      input.style.height = "";
      return;
    }
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight ?? 64, 240)}px`;
  };
  const updateControls = () => {
    send.disabled = pending || unavailable || !input.value.trim();
    input.disabled = pending || unavailable;
    status.hidden = !pending;
    setText(status, pending ? currentPendingLabel : "");
    resize();
  };
  const onKeyDown = (event) => {
    if (event.key !== "Enter" || currentSubmitKey === "mod-enter" && !event.ctrlKey && !event.metaKey || event.shiftKey || event.isComposing || event.keyCode === 229) return;
    event.preventDefault();
    if (!send.disabled) root.requestSubmit();
  };
  const submit = async (event) => {
    event.preventDefault();
    const value = input.value;
    if (pending || unavailable || !value.trim()) return;
    const run = ++revision;
    pending = true;
    setHiddenText(error, "");
    updateControls();
    try {
      const accepted = await submitHandler(value);
      if (disposed || run !== revision) return;
      if (accepted !== false && shouldClearOnSubmit) input.value = "";
    } catch (failure) {
      if (!disposed && run === revision) setHiddenText(error, failure instanceof Error ? failure.message : String(failure));
    } finally {
      if (!disposed && run === revision) {
        pending = false;
        updateControls();
      }
    }
  };
  input.addEventListener("input", updateControls);
  input.addEventListener("keydown", onKeyDown);
  root.addEventListener("submit", submit);
  updateControls();
  attach(mount, root);
  function update(patch = {}) {
    if (Object.hasOwn(patch, "label")) setText(fieldLabel, patch.label);
    if (Object.hasOwn(patch, "placeholder")) input.placeholder = text(patch.placeholder);
    if (Object.hasOwn(patch, "submitLabel")) setText(send, patch.submitLabel);
    if (Object.hasOwn(patch, "pendingLabel")) currentPendingLabel = requiredLabel(patch.pendingLabel);
    if (Object.hasOwn(patch, "autoSize")) {
      currentAutoSize = Boolean(patch.autoSize);
      resize();
    }
    if (Object.hasOwn(patch, "sendAppearance")) {
      if (!["text", "icon"].includes(patch.sendAppearance)) throw new TypeError("sendAppearance must be text or icon.");
      root.setAttribute("data-send-appearance", patch.sendAppearance);
      send.setAttribute("aria-label", text(patch.submitLabel ?? send.getAttribute("aria-label") ?? send.textContent));
      if (patch.sendAppearance === "icon") send.replaceChildren(createIcon("arrow-right", document));
      else setText(send, patch.submitLabel ?? send.getAttribute("aria-label"));
    } else if (Object.hasOwn(patch, "submitLabel") && root.getAttribute("data-send-appearance") === "icon") {
      send.setAttribute("aria-label", patch.submitLabel);
      send.replaceChildren(createIcon("arrow-right", document));
    }
    if (Object.hasOwn(patch, "accessories")) {
      if (patch.accessories != null && (patch.accessories.ownerDocument !== document || patch.accessories.nodeType !== 1)) throw new TypeError("accessories must be an element.");
      accessorySlot.replaceChildren(...patch.accessories ? [patch.accessories] : []);
      accessorySlot.hidden = !patch.accessories;
    }
    if (Object.hasOwn(patch, "disabled")) {
      unavailable = Boolean(patch.disabled);
      updateControls();
    }
    if (Object.hasOwn(patch, "clearOnSubmit")) shouldClearOnSubmit = Boolean(patch.clearOnSubmit);
    if (Object.hasOwn(patch, "submitKey")) currentSubmitKey = validateSubmitKey(patch.submitKey);
    if (Object.hasOwn(patch, "onSubmit")) {
      if (typeof patch.onSubmit !== "function") throw new TypeError("onSubmit is required.");
      submitHandler = patch.onSubmit;
    }
    if (Object.hasOwn(patch, "value")) {
      revision++;
      pending = false;
      input.value = text(patch.value);
      updateControls();
    }
  }
  update({ autoSize, sendAppearance, accessories, pendingLabel, submitLabel });
  return {
    ...destroyable(root, [
      () => input.removeEventListener("input", updateControls),
      () => input.removeEventListener("keydown", onKeyDown),
      () => root.removeEventListener("submit", submit),
      () => {
        disposed = true;
        revision++;
        submitHandler = void 0;
      }
    ]),
    input,
    update
  };
}
function validateItems(items) {
  if (!Array.isArray(items)) throw new TypeError("items must be an array.");
  const seen = /* @__PURE__ */ new Set();
  for (const item of items) {
    if (!item || typeof item.id !== "string" || !item.id || typeof item.label !== "string" || !item.label.trim()) {
      throw new TypeError("Each item requires a nonempty string id and label.");
    }
    if (seen.has(item.id)) throw new TypeError(`Duplicate list item id: ${item.id}`);
    seen.add(item.id);
  }
  return items;
}
function createListDetail({
  document = globalThis.document,
  mount,
  label = "Items",
  items = [],
  selectedId = null,
  emptyText = "No items to show.",
  renderDetail,
  onSelect,
  resizable = false,
  collapsible = false,
  collapsed = false,
  listWidth = 240,
  resizeLabel = "Resize list",
  toggleLabel = "Toggle list",
  backLabel = "Back to list"
} = {}) {
  validDocument(document);
  if (renderDetail !== void 0 && typeof renderDetail !== "function") {
    throw new TypeError("renderDetail must be a function.");
  }
  if (onSelect !== void 0 && typeof onSelect !== "function") throw new TypeError("onSelect must be a function.");
  if (!Number.isFinite(listWidth) || listWidth < 150 || listWidth > 600) throw new RangeError("listWidth must be 150\u2013600.");
  let currentItems = validateItems(items);
  let selection = currentItems.some((item) => item.id === selectedId) ? selectedId : null;
  let mode = selection === null ? "list" : "detail";
  let detailRenderer = renderDetail;
  let selectHandler = onSelect;
  const root = element(document, "div", "canvas-list-detail canvas-ui");
  root.setAttribute("role", "group");
  root.setAttribute("aria-label", label);
  const listPane = element(document, "nav", "canvas-list-detail__list");
  listPane.setAttribute("aria-label", label);
  const list = element(document, "div", "canvas-list-detail__items");
  list.setAttribute("role", "list");
  const empty = element(document, "p", "canvas-list-detail__empty", emptyText);
  const detailPane = element(document, "section", "canvas-list-detail__detail");
  const back = button(document, "secondary-button canvas-list-detail__back", backLabel, () => {
    mode = "list";
    render();
    findItemButton(selection)?.focus();
  });
  const heading = element(document, "h2", "canvas-list-detail__title", "Select an item");
  heading.tabIndex = -1;
  const description = element(document, "div", "canvas-list-detail__body");
  detailPane.setAttribute("aria-labelledby", heading.id = `canvas-list-detail-${++nextId}-heading`);
  detailPane.append(back, heading, description);
  const toggle = button(document, "secondary-button canvas-list-detail__toggle", toggleLabel, () => {
    collapsed = !collapsed;
    syncLayout();
    toggle.focus();
  });
  const listContent = element(document, "div");
  listContent.id = `canvas-list-${++nextId}`;
  listContent.append(list, empty);
  listPane.append(toggle, listContent);
  toggle.setAttribute("aria-controls", listContent.id);
  const resize = createResizeHandle({
    document,
    label: resizeLabel,
    value: listWidth,
    min: 150,
    max: 600,
    controls: listContent.id,
    onResize(value) {
      listWidth = value;
      root.style.setProperty("--canvas-list-size", `${value}px`);
    }
  });
  root.append(listPane, resize.element, detailPane);
  let currentEmptyText = emptyText;
  function syncLayout() {
    const compact = root.getAttribute("data-compact") === "true";
    root.setAttribute("data-resizable", String(Boolean(resizable)));
    root.setAttribute("data-collapsed", String(Boolean(collapsed && !compact)));
    root.style.setProperty("--canvas-list-size", `${listWidth}px`);
    toggle.hidden = !collapsible || compact;
    toggle.setAttribute("aria-expanded", String(!collapsed));
    listContent.hidden = collapsed && !compact;
    resize.element.hidden = !resizable || collapsed || compact;
  }
  function findItemButton(id) {
    return id == null ? null : [...list.children].find((row) => row.getAttribute("data-item-id") === id)?.firstChild;
  }
  function render() {
    const focusedId = [...list.children].find((row) => row.contains?.(document.activeElement))?.getAttribute("data-item-id");
    const selected = currentItems.find((item) => item.id === selection);
    root.setAttribute("data-has-selection", String(Boolean(selected)));
    root.setAttribute("data-mode", mode);
    list.replaceChildren(...currentItems.map((item) => {
      const row = element(document, "div", "canvas-list-detail__row");
      row.setAttribute("role", "listitem");
      row.setAttribute("data-item-id", item.id);
      const control = button(document, "canvas-list-detail__item", item.label, () => {
        selection = item.id;
        mode = "detail";
        render();
        if (root.getAttribute("data-compact") === "true") heading.focus();
        selectHandler?.(item);
      });
      control.setAttribute("aria-pressed", String(item.id === selection));
      const summary = element(document, "span", "canvas-list-detail__item-description", item.description);
      summary.hidden = !item.description;
      control.append(summary);
      row.append(control);
      return row;
    }));
    empty.hidden = currentItems.length > 0;
    if (!selected) {
      setText(heading, "Select an item");
      setText(description, currentEmptyText);
    } else {
      setText(heading, selected.label);
      description.replaceChildren();
      const rendered = detailRenderer?.(selected, document);
      if (rendered && typeof rendered === "object") description.append(rendered);
      else setText(description, rendered ?? selected.description ?? "");
    }
    syncLayout();
    if (focusedId) findItemButton(focusedId)?.focus();
  }
  const view = document.defaultView;
  const ResizeObserverType = view?.ResizeObserver ?? globalThis.ResizeObserver;
  let observer;
  const measure = (entries) => {
    const width = entries?.[0]?.contentRect?.width ?? root.getBoundingClientRect?.().width ?? 0;
    root.setAttribute("data-compact", String(width <= 520));
    syncLayout();
  };
  if (ResizeObserverType) {
    observer = new ResizeObserverType(measure);
    observer.observe(root);
  }
  attach(mount, root);
  measure();
  render();
  function update(patch = {}) {
    if (Object.hasOwn(patch, "resizable")) resizable = Boolean(patch.resizable);
    if (Object.hasOwn(patch, "collapsible")) collapsible = Boolean(patch.collapsible);
    if (Object.hasOwn(patch, "collapsed")) collapsed = Boolean(patch.collapsed);
    if (Object.hasOwn(patch, "listWidth")) {
      if (!Number.isFinite(patch.listWidth) || patch.listWidth < 150 || patch.listWidth > 600) throw new RangeError("listWidth must be 150\u2013600.");
      listWidth = patch.listWidth;
      resize.update({ value: listWidth });
    }
    if (Object.hasOwn(patch, "backLabel")) setText(back, requiredLabel(patch.backLabel));
    if (Object.hasOwn(patch, "toggleLabel")) setText(toggle, requiredLabel(patch.toggleLabel));
    if (Object.hasOwn(patch, "resizeLabel")) resize.update({ label: patch.resizeLabel });
    if (Object.hasOwn(patch, "items")) currentItems = validateItems(patch.items);
    if (Object.hasOwn(patch, "selectedId")) {
      selection = patch.selectedId;
      mode = selection == null ? "list" : "detail";
    }
    if (Object.hasOwn(patch, "label")) {
      root.setAttribute("aria-label", patch.label);
      listPane.setAttribute("aria-label", patch.label);
    }
    if (Object.hasOwn(patch, "emptyText")) {
      currentEmptyText = text(patch.emptyText);
      setText(empty, currentEmptyText);
    }
    if (Object.hasOwn(patch, "renderDetail")) {
      if (patch.renderDetail !== void 0 && typeof patch.renderDetail !== "function") {
        throw new TypeError("renderDetail must be a function.");
      }
      detailRenderer = patch.renderDetail;
    }
    if (Object.hasOwn(patch, "onSelect")) {
      if (patch.onSelect !== void 0 && typeof patch.onSelect !== "function") {
        throw new TypeError("onSelect must be a function.");
      }
      selectHandler = patch.onSelect;
    }
    if (selection != null && !currentItems.some((item) => item.id === selection)) {
      selection = null;
      mode = "list";
    }
    render();
  }
  return {
    ...destroyable(root, [
      () => observer?.disconnect(),
      resize.dispose,
      () => {
        detailRenderer = void 0;
        selectHandler = void 0;
      }
    ]),
    update,
    select(id) {
      if (id != null && !currentItems.some((item) => item.id === id)) throw new RangeError(`Unknown list item: ${id}`);
      selection = id;
      mode = id == null ? "list" : "detail";
      render();
      if (id != null) selectHandler?.(currentItems.find((item) => item.id === id));
    }
  };
}
function renderActions(document, container, actions, kind) {
  if (!Array.isArray(actions)) throw new TypeError(`${kind}Actions must be an array.`);
  const nodes = actions.map((action) => {
    if (!action || typeof action.label !== "string" || !action.label.trim()) {
      throw new TypeError("Each shell action requires a nonempty label.");
    }
    optionalCallback(action.onClick, "onClick");
    return button(
      document,
      action.primary ? "primary-button" : "secondary-button",
      action.label,
      action.onClick,
      action.disabled
    );
  });
  container.replaceChildren(...nodes);
}
function createCanvasShell({
  document = globalThis.document,
  mount,
  title,
  description = "",
  headerActions = [],
  footerActions = [],
  header: headerOptions = {},
  footer: footerOptions = {},
  navigation,
  detailPanel
} = {}) {
  validDocument(document);
  if (typeof title !== "string" || !title.trim()) throw new TypeError("title is required.");
  const root = element(document, "section", "canvas-shell canvas-ui");
  const header = createCanvasHeader({ ...headerOptions, document, title, description, actions: headerActions });
  const content = element(document, "main", "canvas-shell__content");
  const body = element(document, "div", "canvas-shell__body");
  const navigationSlot = element(document, "div", "canvas-shell__navigation");
  const detailSlot = element(document, "div", "canvas-shell__detail");
  const footer = createCanvasFooter({ ...footerOptions, document, actions: footerActions });
  body.append(navigationSlot, content, detailSlot);
  root.append(header.element, body, footer.element);
  function update(patch = {}) {
    for (const [key, slot] of [["navigation", navigationSlot], ["detailPanel", detailSlot]]) {
      if (!Object.hasOwn(patch, key)) continue;
      const value = patch[key];
      if (value != null && (value.ownerDocument !== document || value.nodeType !== 1)) throw new TypeError(`${key} must be an element.`);
      slot.replaceChildren(...value ? [value] : []);
      slot.hidden = !value;
    }
    if (Object.hasOwn(patch, "header")) header.update(patch.header);
    if (Object.hasOwn(patch, "footer")) footer.update(patch.footer);
    if (Object.hasOwn(patch, "title")) header.update({ title: patch.title });
    if (Object.hasOwn(patch, "description")) header.update({ description: patch.description });
    if (Object.hasOwn(patch, "headerActions")) header.update({ actions: patch.headerActions });
    if (Object.hasOwn(patch, "footerActions")) footer.update({ actions: patch.footerActions });
  }
  update({ title, description, headerActions, footerActions, navigation, detailPanel });
  attach(mount, root);
  return { ...destroyable(root, [header.dispose, footer.dispose]), content, navigationSlot, detailSlot, header, footer, update };
}
var requiredLabel = (value, name = "label") => {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${name} is required.`);
  return value;
};
var optionalCallback = (value, name) => {
  if (value !== void 0 && typeof value !== "function") throw new TypeError(`${name} must be a function.`);
};
function createNavigationControls({
  document = globalThis.document,
  mount,
  label = "Navigation",
  backLabel = "Back",
  forwardLabel = "Forward",
  jumpLabel = "Jump to",
  shortcutLabel = "",
  jumpControls = "",
  canGoBack = false,
  canGoForward = false,
  onBack,
  onForward,
  onJump
} = {}) {
  validDocument(document);
  const root = element(document, "nav", "canvas-navigation canvas-ui");
  const callbacks = {};
  const back = button(document, "secondary-button canvas-navigation__history", "", () => callbacks.onBack?.());
  const forward = button(document, "secondary-button canvas-navigation__history", "", () => callbacks.onForward?.());
  back.append(createIcon("arrow-left", document));
  forward.append(createIcon("arrow-right", document));
  const jump = button(document, "secondary-button canvas-navigation__jump", "", () => callbacks.onJump?.());
  const mark = createIcon("search", document);
  const copy = element(document, "span");
  const shortcut = element(document, "kbd", "canvas-navigation__shortcut");
  shortcut.hidden = true;
  jump.append(mark, copy, shortcut);
  root.append(back, forward, jump);
  let availableBack = canGoBack;
  let availableForward = canGoForward;
  function update(patch = {}) {
    for (const name of ["onBack", "onForward", "onJump"]) {
      if (Object.hasOwn(patch, name)) {
        optionalCallback(patch[name], name);
        callbacks[name] = patch[name];
      }
    }
    if (Object.hasOwn(patch, "label")) root.setAttribute("aria-label", requiredLabel(patch.label));
    for (const [key, control] of [["backLabel", back], ["forwardLabel", forward]]) {
      if (Object.hasOwn(patch, key)) {
        const label2 = requiredLabel(patch[key]);
        control.setAttribute("aria-label", label2);
        control.title = label2;
      }
    }
    if (Object.hasOwn(patch, "jumpLabel")) setText(copy, requiredLabel(patch.jumpLabel));
    if (Object.hasOwn(patch, "shortcutLabel")) setHiddenText(shortcut, patch.shortcutLabel);
    if (Object.hasOwn(patch, "jumpControls")) {
      if (patch.jumpControls) {
        jump.setAttribute("aria-controls", patch.jumpControls);
        jump.setAttribute("aria-haspopup", "dialog");
      } else {
        jump.removeAttribute("aria-controls");
        jump.removeAttribute("aria-haspopup");
      }
    }
    if (Object.hasOwn(patch, "canGoBack")) availableBack = Boolean(patch.canGoBack);
    if (Object.hasOwn(patch, "canGoForward")) availableForward = Boolean(patch.canGoForward);
    back.hidden = !callbacks.onBack;
    forward.hidden = !callbacks.onForward;
    jump.hidden = !callbacks.onJump;
    back.disabled = !availableBack;
    forward.disabled = !availableForward;
    root.hidden = back.hidden && forward.hidden && jump.hidden;
  }
  update({ label, backLabel, forwardLabel, jumpLabel, onBack, onForward, onJump, shortcutLabel, jumpControls });
  attach(mount, root);
  return {
    ...destroyable(root, [() => {
      callbacks.onBack = void 0;
      callbacks.onForward = void 0;
      callbacks.onJump = void 0;
    }]),
    backButton: back,
    forwardButton: forward,
    jumpButton: jump,
    update
  };
}
function createCanvasHeader({
  document = globalThis.document,
  mount,
  title,
  description = "",
  icon,
  homeLabel,
  onHome,
  context,
  navigation,
  actions = [],
  actionsLabel = "Page actions"
} = {}) {
  validDocument(document);
  const root = element(document, "header", "canvas-frame-header canvas-shell__header canvas-ui");
  const identity = element(document, "div", "canvas-frame-header__identity");
  const iconSlot = element(document, "span", "canvas-frame-header__icon");
  iconSlot.setAttribute("aria-hidden", "true");
  const heading = element(document, "h1", "canvas-shell__title");
  const home = button(document, "canvas-frame-header__home", "");
  const titleText = element(document, "span");
  let homeHandler;
  let currentHomeLabel;
  const goHome = () => homeHandler?.();
  home.addEventListener("click", goHome);
  const summary = element(document, "p", "canvas-shell__description");
  const separator = element(document, "span", "canvas-frame-header__separator", "/");
  separator.setAttribute("aria-hidden", "true");
  const contextButton = button(document, "secondary-button canvas-frame-header__context", "");
  let contextHandler;
  const chooseContext = () => contextHandler?.();
  contextButton.addEventListener("click", chooseContext);
  const navigationSlot = element(document, "div", "canvas-frame-header__navigation");
  const controls = element(document, "div", "canvas-shell__actions");
  controls.setAttribute("role", "group");
  identity.append(iconSlot, heading, separator, contextButton);
  root.append(identity, summary, navigationSlot, controls);
  function update(patch = {}) {
    if (Object.hasOwn(patch, "title")) {
      const next = requiredLabel(patch.title, "title");
      setText(titleText, next);
      setText(home, next);
    }
    if (Object.hasOwn(patch, "homeLabel")) {
      if (patch.homeLabel !== void 0) requiredLabel(patch.homeLabel, "homeLabel");
      currentHomeLabel = patch.homeLabel;
    }
    home.setAttribute("aria-label", currentHomeLabel ?? titleText.textContent);
    if (Object.hasOwn(patch, "onHome")) {
      optionalCallback(patch.onHome, "onHome");
      homeHandler = patch.onHome;
    }
    const titleNode = homeHandler ? home : titleText;
    if (heading.children[0] !== titleNode) heading.replaceChildren(titleNode);
    if (Object.hasOwn(patch, "description")) setHiddenText(summary, patch.description);
    if (Object.hasOwn(patch, "icon")) {
      if (patch.icon != null && (patch.icon.ownerDocument !== document || patch.icon.nodeType !== 1)) {
        throw new TypeError("icon must be an element in the supplied document.");
      }
      iconSlot.replaceChildren(...patch.icon ? [patch.icon] : []);
      iconSlot.hidden = !patch.icon;
    }
    if (Object.hasOwn(patch, "context")) {
      const value = patch.context;
      if (value != null) {
        requiredLabel(value.label);
        optionalCallback(value.onSelect, "context.onSelect");
      }
      contextHandler = value?.onSelect;
      setText(contextButton, value?.label);
      contextButton.hidden = !value;
      separator.hidden = !value;
      contextButton.disabled = Boolean(value?.disabled) || !contextHandler;
      contextButton.title = value?.label ?? "";
    }
    if (Object.hasOwn(patch, "navigation")) {
      const node = patch.navigation;
      if (node != null && (node.ownerDocument !== document || node.nodeType !== 1)) {
        throw new TypeError("navigation must be an element in the supplied document.");
      }
      navigationSlot.replaceChildren(...node ? [node] : []);
      navigationSlot.hidden = !node;
    }
    if (Object.hasOwn(patch, "actions")) {
      renderActions(document, controls, patch.actions, "header");
      controls.hidden = patch.actions.length === 0;
    }
    if (Object.hasOwn(patch, "actionsLabel")) controls.setAttribute("aria-label", requiredLabel(patch.actionsLabel));
  }
  update({ title, description, icon, homeLabel, onHome, context, navigation, actions, actionsLabel });
  attach(mount, root);
  return {
    ...destroyable(root, [() => {
      home.removeEventListener("click", goHome);
      contextButton.removeEventListener("click", chooseContext);
      homeHandler = void 0;
      contextHandler = void 0;
    }]),
    navigationSlot,
    update
  };
}
function validFooterLink(link) {
  if (link == null) return;
  requiredLabel(link.label);
  if (typeof link.href !== "string" || !link.href.trim() || /[\u0000-\u0020\\]/.test(link.href) || link.href.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(link.href) && !/^https?:\/\//i.test(link.href)) {
    throw new TypeError("Link href must be an HTTP(S) URL or a relative URL.");
  }
}
function createCanvasFooter({
  document = globalThis.document,
  mount,
  label = "Canvas information",
  docs,
  feedback,
  language,
  actions = [],
  actionGroups = [],
  version = "",
  versionLabel = "Version",
  actionsLabel = "Additional actions"
} = {}) {
  validDocument(document);
  const root = element(document, "footer", "canvas-frame-footer canvas-shell__footer canvas-ui");
  const links = element(document, "div", "canvas-frame-footer__links");
  const docsLink = element(document, "a", "canvas-frame-footer__action");
  const feedbackButton = button(document, "canvas-frame-footer__action", "");
  let feedbackHandler;
  const sendFeedback = () => feedbackHandler?.();
  feedbackButton.addEventListener("click", sendFeedback);
  links.append(docsLink, feedbackButton);
  const languageHost = element(document, "label", "canvas-frame-footer__language");
  const languageCopy = element(document, "span");
  const select = element(document, "select");
  languageHost.append(languageCopy, select);
  const controls = element(document, "div", "canvas-shell__actions");
  controls.setAttribute("role", "group");
  const groups = element(document, "div", "canvas-frame-footer__groups");
  const release = element(document, "span", "canvas-frame-footer__version");
  const error = element(document, "span", "canvas-frame-footer__error");
  error.setAttribute("role", "alert");
  error.hidden = true;
  root.append(links, languageHost, controls, groups, release, error);
  let menus = [];
  let localeHandler;
  let selectedLocale = "";
  let revision = 0;
  let disposed = false;
  let pending = false;
  let languageDisabled = false;
  let currentVersionLabel = versionLabel;
  let currentVersion = version;
  const changeLocale = async () => {
    if (pending || disposed) return;
    const value = select.value;
    const run = revision;
    const handler = localeHandler;
    pending = true;
    select.disabled = true;
    select.setAttribute("aria-busy", "true");
    setHiddenText(error, "");
    try {
      await handler(value);
      if (disposed || run !== revision) return;
      selectedLocale = value;
    } catch (failure) {
      if (!disposed && run === revision) {
        select.value = selectedLocale;
        setHiddenText(error, failure instanceof Error ? failure.message : String(failure));
      }
    } finally {
      if (!disposed && run === revision) {
        pending = false;
        select.disabled = languageDisabled;
        select.setAttribute("aria-busy", "false");
      }
    }
  };
  select.addEventListener("change", changeLocale);
  function update(patch = {}) {
    if (Object.hasOwn(patch, "label")) root.setAttribute("aria-label", requiredLabel(patch.label));
    if (Object.hasOwn(patch, "docs")) {
      validFooterLink(patch.docs);
      const value = patch.docs;
      docsLink.hidden = !value;
      if (value) {
        setText(docsLink, value.label);
        docsLink.setAttribute("href", value.href);
        if (value.newTab) {
          docsLink.setAttribute("target", "_blank");
          docsLink.setAttribute("rel", "noopener noreferrer");
        } else {
          docsLink.removeAttribute("target");
          docsLink.removeAttribute("rel");
        }
      } else {
        docsLink.removeAttribute("href");
        setText(docsLink, "");
      }
    }
    if (Object.hasOwn(patch, "feedback")) {
      if (patch.feedback != null) {
        requiredLabel(patch.feedback.label);
        if (typeof patch.feedback.onClick !== "function") throw new TypeError("feedback.onClick is required.");
      }
      feedbackHandler = patch.feedback?.onClick;
      setText(feedbackButton, patch.feedback?.label);
      feedbackButton.hidden = !patch.feedback;
      feedbackButton.disabled = Boolean(patch.feedback?.disabled);
    }
    links.hidden = docsLink.hidden && feedbackButton.hidden;
    if (Object.hasOwn(patch, "language")) {
      const value = patch.language;
      if (value != null) {
        requiredLabel(value.label);
        if (typeof value.onChange !== "function") throw new TypeError("language.onChange is required.");
        if (!Array.isArray(value.options) || !value.options.length) throw new TypeError("language.options must not be empty.");
        const ids = /* @__PURE__ */ new Set();
        for (const option of value.options) {
          requiredLabel(option.value);
          requiredLabel(option.label);
          if (ids.has(option.value)) throw new TypeError("Duplicate language option.");
          ids.add(option.value);
        }
        if (!ids.has(value.value)) throw new TypeError("language.value must match an option.");
      }
      revision++;
      pending = false;
      setHiddenText(error, "");
      languageDisabled = Boolean(value?.disabled);
      localeHandler = value?.onChange;
      selectedLocale = value?.value ?? "";
      select.replaceChildren(...(value?.options ?? []).map((option) => {
        const node = element(document, "option", "", option.label);
        node.value = option.value;
        node.lang = option.value;
        return node;
      }));
      select.value = selectedLocale;
      select.disabled = languageDisabled;
      select.setAttribute("aria-busy", "false");
      setText(languageCopy, value?.label);
      languageHost.hidden = !value;
    }
    if (Object.hasOwn(patch, "actions")) {
      renderActions(document, controls, patch.actions, "footer");
      controls.hidden = patch.actions.length === 0;
    }
    if (Object.hasOwn(patch, "actionsLabel")) controls.setAttribute("aria-label", requiredLabel(patch.actionsLabel));
    if (Object.hasOwn(patch, "actionGroups")) {
      if (!Array.isArray(patch.actionGroups)) throw new TypeError("actionGroups must be an array.");
      const next = patch.actionGroups.map((group) => {
        requiredLabel(group.label);
        if (!Array.isArray(group.items)) throw new TypeError("Group items must be an array.");
        for (const item of group.items) {
          requiredLabel(item.label);
          optionalCallback(item.onSelect, "onSelect");
        }
        return group;
      });
      for (const menu of menus) menu.dispose();
      menus = next.map((group) => createMenuButton({ document, mount: groups, label: group.label, items: group.items }));
      groups.hidden = menus.length === 0;
    }
    if (Object.hasOwn(patch, "version")) currentVersion = text(patch.version);
    if (Object.hasOwn(patch, "versionLabel")) currentVersionLabel = requiredLabel(patch.versionLabel);
    setHiddenText(release, currentVersion);
    release.setAttribute("aria-label", `${currentVersionLabel}: ${currentVersion}`);
    root.hidden = links.hidden && languageHost.hidden && controls.hidden && groups.hidden && release.hidden;
  }
  update({ label, docs, feedback, language, actions, actionGroups, version, versionLabel, actionsLabel });
  attach(mount, root);
  return {
    ...destroyable(root, [() => {
      disposed = true;
      revision++;
      select.removeEventListener("change", changeLocale);
      feedbackButton.removeEventListener("click", sendFeedback);
      localeHandler = void 0;
      feedbackHandler = void 0;
      for (const menu of menus) menu.dispose();
    }]),
    languageSelect: select,
    update
  };
}
function createSpinner({ document = globalThis.document, mount, label = "Loading", paused = false } = {}) {
  validDocument(document);
  const root = element(document, "div", "canvas-spinner canvas-ui");
  root.setAttribute("role", "status");
  const mark = element(document, "span", "canvas-spinner__mark");
  mark.setAttribute("aria-hidden", "true");
  const copy = element(document, "span");
  root.append(mark, copy);
  function update(patch = {}) {
    if (Object.hasOwn(patch, "label")) setText(copy, requiredLabel(patch.label));
    if (Object.hasOwn(patch, "paused")) root.setAttribute("data-paused", String(Boolean(patch.paused)));
  }
  update({ label, paused });
  attach(mount, root);
  return { ...destroyable(root), update };
}
function createProgressBar({ document = globalThis.document, mount, label = "Progress", value } = {}) {
  validDocument(document);
  const root = element(document, "div", "canvas-progress canvas-ui");
  root.setAttribute("role", "progressbar");
  root.setAttribute("aria-valuemin", "0");
  root.setAttribute("aria-valuemax", "100");
  const fill = element(document, "span", "canvas-progress__fill");
  root.append(fill);
  function update(patch = {}) {
    if (Object.hasOwn(patch, "label")) root.setAttribute("aria-label", requiredLabel(patch.label));
    if (Object.hasOwn(patch, "value")) {
      const value2 = patch.value;
      if (value2 !== void 0 && (!Number.isFinite(value2) || value2 < 0 || value2 > 100)) {
        throw new RangeError("Progress must be between 0 and 100.");
      }
      root.setAttribute("data-indeterminate", String(value2 === void 0));
      if (value2 === void 0) root.removeAttribute("aria-valuenow");
      else root.setAttribute("aria-valuenow", String(value2));
      fill.style.width = value2 === void 0 ? "35%" : `${value2}%`;
    }
  }
  update({ label, value });
  attach(mount, root);
  return { ...destroyable(root), update };
}
function createSkeleton({ document = globalThis.document, mount, label = "Loading content", lines = 3 } = {}) {
  validDocument(document);
  const root = element(document, "div", "canvas-skeleton canvas-ui");
  root.setAttribute("role", "status");
  function update(patch = {}) {
    if (Object.hasOwn(patch, "label")) root.setAttribute("aria-label", requiredLabel(patch.label));
    if (Object.hasOwn(patch, "lines")) {
      if (!Number.isInteger(patch.lines) || patch.lines < 1 || patch.lines > 20) {
        throw new RangeError("lines must be an integer between 1 and 20.");
      }
      root.replaceChildren(...Array.from({ length: patch.lines }, () => {
        const line = element(document, "span", "canvas-skeleton__line");
        line.setAttribute("aria-hidden", "true");
        return line;
      }));
    }
  }
  update({ label, lines });
  attach(mount, root);
  return { ...destroyable(root), update };
}
function createMessageBar({
  document = globalThis.document,
  mount,
  title,
  message = "",
  intent = "info"
} = {}) {
  validDocument(document);
  const root = element(document, "section", "canvas-message canvas-ui");
  const heading = element(document, "h3", "canvas-message__title");
  const copy = element(document, "p", "canvas-message__copy");
  root.append(heading, copy);
  function update(patch = {}) {
    if (Object.hasOwn(patch, "intent")) {
      if (!["info", "success", "warning", "error"].includes(patch.intent)) throw new TypeError("Unknown message intent.");
      root.setAttribute("data-intent", patch.intent);
      root.setAttribute("role", patch.intent === "error" ? "alert" : "status");
    }
    if (Object.hasOwn(patch, "title")) setText(heading, requiredLabel(patch.title, "title"));
    if (Object.hasOwn(patch, "message")) setHiddenText(copy, patch.message);
  }
  update({ title, message, intent });
  attach(mount, root);
  return { ...destroyable(root), update };
}
function createBlankslate({
  document = globalThis.document,
  mount,
  title,
  description = "",
  actions = []
} = {}) {
  validDocument(document);
  const root = element(document, "section", "canvas-blankslate canvas-ui");
  const heading = element(document, "h3", "canvas-blankslate__title");
  heading.id = `canvas-empty-${++nextId}`;
  root.setAttribute("aria-labelledby", heading.id);
  const copy = element(document, "p", "canvas-blankslate__copy");
  const controls = element(document, "div", "canvas-blankslate__actions");
  root.append(heading, copy, controls);
  function update(patch = {}) {
    if (Object.hasOwn(patch, "title")) setText(heading, requiredLabel(patch.title, "title"));
    if (Object.hasOwn(patch, "description")) setHiddenText(copy, patch.description);
    if (Object.hasOwn(patch, "actions")) {
      renderActions(document, controls, patch.actions, "emptyState");
      controls.hidden = patch.actions.length === 0;
    }
  }
  update({ title, description, actions });
  attach(mount, root);
  return { ...destroyable(root), update };
}
function preserveAttributes(node, names) {
  const previous = names.map((name) => [name, node.getAttribute(name)]);
  return () => {
    for (const [name, value] of previous) {
      if (value === null) node.removeAttribute(name);
      else node.setAttribute(name, value);
    }
  };
}
function createDialog({
  document = globalThis.document,
  mount = document?.body,
  title,
  closeLabel = "Close",
  onClose
} = {}) {
  validDocument(document);
  requiredLabel(title, "title");
  optionalCallback(onClose, "onClose");
  const root = element(document, "dialog", "canvas-dialog canvas-ui");
  if (typeof root.showModal !== "function") throw new Error("This browser does not support modal dialogs.");
  const header = element(document, "header", "canvas-dialog__header");
  const heading = element(document, "h2", "canvas-overlay__title", title);
  heading.id = `canvas-dialog-${++nextId}`;
  root.setAttribute("aria-labelledby", heading.id);
  const closeButton = button(document, "secondary-button", requiredLabel(closeLabel));
  const content = element(document, "div", "canvas-dialog__content");
  const footer = element(document, "footer", "canvas-dialog__footer");
  header.append(heading, closeButton);
  root.append(header, content, footer);
  let opener;
  let closeHandler = onClose;
  let disposed = false;
  const close = () => {
    if (root.open) root.close();
  };
  const closed = () => {
    if (root.open) return;
    if (opener?.isConnected && (document.activeElement === document.body || document.activeElement === opener || root.contains?.(document.activeElement))) opener.focus();
    if (!disposed) closeHandler?.();
  };
  root.addEventListener("close", closed);
  closeButton.addEventListener("click", close);
  attach(mount, root);
  return {
    ...destroyable(root, [() => {
      disposed = true;
      close();
      root.removeEventListener("close", closed);
      closeButton.removeEventListener("click", close);
      closeHandler = void 0;
    }]),
    content,
    footer,
    close,
    open() {
      if (disposed) throw new Error("Dialog has been disposed.");
      if (root.open) return;
      opener = document.activeElement;
      root.showModal();
    },
    update(patch = {}) {
      if (Object.hasOwn(patch, "title")) setText(heading, requiredLabel(patch.title, "title"));
      if (Object.hasOwn(patch, "closeLabel")) setText(closeButton, requiredLabel(patch.closeLabel));
      if (Object.hasOwn(patch, "onClose")) {
        optionalCallback(patch.onClose, "onClose");
        closeHandler = patch.onClose;
      }
    }
  };
}
function createPopover({
  trigger,
  document = trigger?.ownerDocument ?? globalThis.document,
  mount = document?.body,
  label
} = {}) {
  validDocument(document);
  if (!trigger || trigger.ownerDocument !== document) throw new TypeError("trigger must belong to the supplied document.");
  requiredLabel(label);
  const root = element(document, "div", "canvas-popover canvas-ui");
  if (typeof root.showPopover !== "function") throw new Error("This browser does not support popovers.");
  root.id = `canvas-popover-${++nextId}`;
  root.setAttribute("popover", "auto");
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", label);
  root.tabIndex = -1;
  const restore = preserveAttributes(trigger, ["aria-controls", "aria-expanded", "aria-haspopup"]);
  trigger.setAttribute("aria-controls", root.id);
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-haspopup", "dialog");
  let disposed = false;
  const isOpen = () => root.matches(":popover-open");
  const position = () => {
    if (!isOpen()) return;
    const anchor = trigger.getBoundingClientRect();
    const rect = root.getBoundingClientRect();
    const view = document.defaultView;
    const width = document.documentElement.clientWidth;
    const height = view.innerHeight;
    root.style.left = `${Math.max(8, Math.min(anchor.left, width - rect.width - 8))}px`;
    root.style.top = `${Math.max(8, anchor.bottom + rect.height + 8 <= height ? anchor.bottom + 4 : Math.min(anchor.top - rect.height - 4, height - rect.height - 8))}px`;
  };
  const close = (returnFocus = false) => {
    if (!isOpen()) return;
    root.hidePopover();
    trigger.setAttribute("aria-expanded", "false");
    if (returnFocus && trigger.isConnected) trigger.focus();
  };
  const open = () => {
    if (disposed) throw new Error("Popover has been disposed.");
    if (isOpen()) return;
    root.showPopover();
    trigger.setAttribute("aria-expanded", "true");
    position();
  };
  const toggle = () => {
    if (isOpen()) close(true);
    else {
      open();
      (root.querySelector("input:not(:disabled),button:not(:disabled),[tabindex='0']") ?? root).focus();
    }
  };
  const keydown = (event) => {
    if (event.key === "Escape" && isOpen()) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    }
  };
  const toggled = () => {
    trigger.setAttribute("aria-expanded", String(isOpen()));
  };
  const ResizeObserverType = document.defaultView?.ResizeObserver;
  const observer = ResizeObserverType ? new ResizeObserverType(position) : void 0;
  observer?.observe(root);
  observer?.observe(trigger);
  trigger.addEventListener("click", toggle);
  trigger.addEventListener("keydown", keydown);
  root.addEventListener("keydown", keydown);
  root.addEventListener("toggle", toggled);
  document.defaultView.addEventListener("resize", position);
  document.addEventListener("scroll", position, true);
  attach(mount, root);
  return {
    ...destroyable(root, [() => {
      close();
      disposed = true;
      observer?.disconnect();
      trigger.removeEventListener("click", toggle);
      trigger.removeEventListener("keydown", keydown);
      root.removeEventListener("keydown", keydown);
      root.removeEventListener("toggle", toggled);
      document.defaultView.removeEventListener("resize", position);
      document.removeEventListener("scroll", position, true);
      restore();
    }]),
    content: root,
    open,
    close,
    isOpen,
    update(patch = {}) {
      if (Object.hasOwn(patch, "label")) root.setAttribute("aria-label", requiredLabel(patch.label));
    }
  };
}
function createMenuButton({
  document = globalThis.document,
  mount,
  label,
  items = []
} = {}) {
  validDocument(document);
  const root = element(document, "span", "canvas-menu-button canvas-ui");
  const trigger = button(document, "secondary-button", requiredLabel(label));
  root.append(trigger);
  attach(mount, root);
  const popover = createPopover({ document, trigger, mount: root, label });
  popover.element.setAttribute("role", "menu");
  trigger.setAttribute("aria-haspopup", "menu");
  let currentItems;
  const buttons = () => [...popover.element.querySelectorAll("button:not(:disabled)")];
  const move = (event) => {
    const controls = buttons();
    if (!controls.length) return;
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      popover.open();
      const index = controls.indexOf(document.activeElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? controls.length - 1 : index < 0 ? event.key === "ArrowUp" ? controls.length - 1 : 0 : (index + (event.key === "ArrowDown" ? 1 : -1) + controls.length) % controls.length;
      controls[next].focus();
    } else if (event.key === "Tab") popover.close();
    else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const index = controls.indexOf(document.activeElement);
      const ordered = [...controls.slice(index + 1), ...controls.slice(0, index + 1)];
      const match = ordered.find((control) => control.textContent.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
      if (match) {
        event.preventDefault();
        match.focus();
      }
    }
  };
  const choose = (event) => {
    const control = event.target.closest("button[data-menu-index]");
    if (!control || control.disabled) return;
    const item = currentItems[Number(control.dataset.menuIndex)];
    popover.close(true);
    item.onSelect?.();
  };
  function update(patch = {}) {
    if (Object.hasOwn(patch, "label")) {
      setText(trigger, requiredLabel(patch.label));
      popover.update({ label: patch.label });
    }
    if (Object.hasOwn(patch, "items")) {
      if (!Array.isArray(patch.items)) throw new TypeError("items must be an array.");
      const next = patch.items.map((item) => {
        requiredLabel(item.label);
        optionalCallback(item.onSelect, "onSelect");
        return { ...item };
      });
      popover.close(popover.content.contains(document.activeElement));
      currentItems = next;
      popover.content.replaceChildren(...next.map((item, index) => {
        const control = button(document, "canvas-menu-button__item", item.label, void 0, item.disabled);
        control.setAttribute("role", "menuitem");
        control.tabIndex = -1;
        control.dataset.menuIndex = String(index);
        return control;
      }));
      trigger.disabled = next.length === 0;
    }
  }
  update({ items });
  trigger.addEventListener("keydown", move);
  popover.element.addEventListener("keydown", move);
  popover.element.addEventListener("click", choose);
  return {
    ...destroyable(root, [() => {
      trigger.removeEventListener("keydown", move);
      popover.element.removeEventListener("keydown", move);
      popover.element.removeEventListener("click", choose);
      popover.dispose();
      currentItems = [];
    }]),
    trigger,
    update,
    open: popover.open,
    close: popover.close
  };
}
function createTooltip({
  trigger,
  document = trigger?.ownerDocument ?? globalThis.document,
  text: copy
} = {}) {
  validDocument(document);
  if (!trigger || trigger.ownerDocument !== document) throw new TypeError("trigger must belong to the supplied document.");
  requiredLabel(copy, "text");
  const root = element(document, "div", "canvas-tooltip canvas-ui", copy);
  if (typeof root.showPopover !== "function") throw new Error("This browser does not support popovers.");
  root.id = `canvas-tooltip-${++nextId}`;
  root.setAttribute("popover", "manual");
  root.setAttribute("role", "tooltip");
  const restore = preserveAttributes(trigger, ["aria-describedby"]);
  trigger.setAttribute("aria-describedby", [trigger.getAttribute("aria-describedby"), root.id].filter(Boolean).join(" "));
  let hovered = false;
  let focused = false;
  let disposed = false;
  const hide = () => {
    if (root.matches(":popover-open")) root.hidePopover();
  };
  const show = () => {
    if (disposed) return;
    if (!root.matches(":popover-open")) root.showPopover();
    const anchor = trigger.getBoundingClientRect();
    const rect = root.getBoundingClientRect();
    root.style.left = `${Math.max(8, Math.min(anchor.left, document.documentElement.clientWidth - rect.width - 8))}px`;
    root.style.top = `${Math.max(8, Math.min(anchor.bottom, document.defaultView.innerHeight - rect.height - 8))}px`;
  };
  const enter = () => {
    hovered = true;
    show();
  };
  const leave = (event) => {
    if (trigger.contains(event.relatedTarget) || root.contains(event.relatedTarget)) return;
    hovered = false;
    if (!focused) hide();
  };
  const focus = () => {
    focused = true;
    show();
  };
  const blur = () => {
    focused = false;
    if (!hovered) hide();
  };
  const escape = (event) => {
    if (event.key === "Escape") hide();
  };
  trigger.addEventListener("pointerenter", enter);
  trigger.addEventListener("pointerleave", leave);
  root.addEventListener("pointerenter", enter);
  root.addEventListener("pointerleave", leave);
  trigger.addEventListener("focus", focus);
  trigger.addEventListener("blur", blur);
  document.addEventListener("keydown", escape);
  document.addEventListener("scroll", hide, true);
  document.defaultView.addEventListener("resize", hide);
  document.body.append(root);
  return {
    ...destroyable(root, [() => {
      disposed = true;
      hide();
      trigger.removeEventListener("pointerenter", enter);
      trigger.removeEventListener("pointerleave", leave);
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
      trigger.removeEventListener("focus", focus);
      trigger.removeEventListener("blur", blur);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("scroll", hide, true);
      document.defaultView.removeEventListener("resize", hide);
      restore();
    }]),
    update(patch = {}) {
      if (Object.hasOwn(patch, "text")) {
        setText(root, requiredLabel(patch.text, "text"));
        if (root.matches(":popover-open")) show();
      }
    }
  };
}
function createFilterPill({
  document = globalThis.document,
  mount,
  label,
  removeLabel = "Remove filter",
  onRemove
} = {}) {
  validDocument(document);
  optionalCallback(onRemove, "onRemove");
  const root = button(document, "canvas-filter-pill canvas-ui", "");
  const copy = element(document, "span");
  const mark = element(document, "span", "", "\xD7");
  mark.setAttribute("aria-hidden", "true");
  root.append(copy, mark);
  let currentLabel;
  let currentRemoveLabel;
  let removeHandler = onRemove;
  const remove = () => removeHandler?.();
  root.addEventListener("click", remove);
  function update(patch = {}) {
    if (Object.hasOwn(patch, "label")) {
      currentLabel = requiredLabel(patch.label);
      setText(copy, currentLabel);
    }
    if (Object.hasOwn(patch, "removeLabel")) currentRemoveLabel = requiredLabel(patch.removeLabel);
    if (Object.hasOwn(patch, "onRemove")) {
      optionalCallback(patch.onRemove, "onRemove");
      removeHandler = patch.onRemove;
    }
    root.setAttribute("aria-label", `${currentRemoveLabel}: ${currentLabel}`);
  }
  update({ label, removeLabel });
  attach(mount, root);
  return { ...destroyable(root, [() => {
    root.removeEventListener("click", remove);
    removeHandler = void 0;
  }]), update };
}
function validateFacets(facets) {
  if (!Array.isArray(facets)) throw new TypeError("facets must be an array.");
  const ids = /* @__PURE__ */ new Set();
  return facets.map((facet) => {
    requiredLabel(facet.id, "facet id");
    requiredLabel(facet.label);
    if (ids.has(facet.id)) throw new TypeError(`Duplicate facet: ${facet.id}`);
    ids.add(facet.id);
    if (!Array.isArray(facet.options)) throw new TypeError("facet options must be an array.");
    const values = /* @__PURE__ */ new Set();
    const options = facet.options.map((option) => {
      requiredLabel(option.value, "option value");
      requiredLabel(option.label);
      if (values.has(option.value)) throw new TypeError(`Duplicate option: ${option.value}`);
      values.add(option.value);
      return { ...option };
    });
    if (facet.values !== void 0 && (!Array.isArray(facet.values) || facet.values.some((value) => !values.has(value)) || new Set(facet.values).size !== facet.values.length)) {
      throw new TypeError(`Invalid selected values for facet: ${facet.id}`);
    }
    return { ...facet, options, values: [...facet.values ?? []] };
  });
}
function createFilterToolbar({
  document = globalThis.document,
  mount,
  label = "Filters",
  searchLabel = "Search",
  search = "",
  facets = [],
  resultCount,
  moreLabel = "More filters",
  clearLabel = "Clear filters",
  onChange,
  removeLabel = "Remove filter",
  formatResultCount = (count) => `${count} results`,
  sort
} = {}) {
  validDocument(document);
  optionalCallback(onChange, "onChange");
  if (typeof formatResultCount !== "function") throw new TypeError("formatResultCount must be a function.");
  let countFormatter = formatResultCount;
  let currentCount;
  let currentRemoveLabel = requiredLabel(removeLabel);
  let currentFacets = validateFacets(facets);
  let changeHandler = onChange;
  const root = element(document, "div", "canvas-filter-toolbar canvas-ui");
  root.setAttribute("role", "group");
  const row = element(document, "div", "canvas-filter-toolbar__row");
  const input = element(document, "input", "canvas-filter-toolbar__search");
  input.type = "search";
  input.value = text(search);
  const facetRow = element(document, "div", "canvas-filter-toolbar__facets");
  const more = button(document, "secondary-button", moreLabel);
  const sortHost = element(document, "label", "canvas-filter-toolbar__sort");
  const sortLabel = element(document, "span");
  const sortSelect = element(document, "select");
  sortHost.append(sortLabel, sortSelect);
  sortHost.hidden = true;
  row.append(input, facetRow, more, sortHost);
  const pills = element(document, "div", "canvas-filter-toolbar__pills");
  const count = element(document, "span", "canvas-filter-toolbar__count");
  count.setAttribute("role", "status");
  const clear = button(document, "text-button", clearLabel);
  root.append(row, pills, clear, count);
  attach(mount, root);
  const overflow = createPopover({ document, trigger: more, mount: root, label: moreLabel });
  let controls = [];
  let pillViews = [];
  let disposed = false;
  let currentSort;
  let overflowWidth = more.getBoundingClientRect().width || 110;
  const snapshot = () => ({
    search: input.value,
    values: Object.fromEntries(currentFacets.map((facet) => [facet.id, [...facet.values]])),
    ...currentSort ? { sort: sortSelect.value } : {}
  });
  const emit = () => changeHandler?.(snapshot());
  const renderPills = () => {
    const oldFocus = document.activeElement?.dataset.filterKey;
    for (const view of pillViews) view.dispose();
    pillViews = [];
    for (const facet of currentFacets) {
      for (const value of facet.values) {
        const option = facet.options.find((option2) => option2.value === value);
        const view = createFilterPill({
          document,
          mount: pills,
          label: `${facet.label}: ${option.label}`,
          removeLabel: currentRemoveLabel,
          onRemove: () => {
            facet.values = facet.values.filter((selected) => selected !== value);
            sync();
            emit();
          }
        });
        view.element.dataset.filterKey = JSON.stringify([facet.id, value]);
        pillViews.push(view);
      }
    }
    if (oldFocus) {
      (pillViews.find((view) => view.element.dataset.filterKey === oldFocus)?.element ?? pillViews[0]?.element ?? input).focus();
    }
    clear.hidden = !input.value && !currentFacets.some((facet) => facet.values.length);
  };
  const sync = () => {
    for (const { facet, fieldset, trigger } of controls) {
      const selected = new Set(facet.values);
      for (const checkbox of fieldset.querySelectorAll("input")) checkbox.checked = selected.has(checkbox.value);
      setText(trigger, facet.values.length ? `${facet.label} (${facet.values.length})` : facet.label);
    }
    renderPills();
    measure();
  };
  const measure = () => {
    if (disposed || !root.isConnected) return;
    const available = row.clientWidth;
    if (!available) return;
    if (!more.hidden) overflowWidth = more.getBoundingClientRect().width || overflowWidth;
    let remaining = available - input.getBoundingClientRect().width - overflowWidth - 24 - (currentSort ? sortHost.getBoundingClientRect().width + 8 : 0);
    let overflowed = 0;
    for (const control of controls) {
      if (control.root.parentElement === facetRow) control.width = control.trigger.getBoundingClientRect().width;
      const fits = overflowed === 0 && remaining >= control.width + 8;
      if (fits) {
        if (control.root.parentElement !== facetRow) {
          const hadFocus = control.root.contains(document.activeElement);
          control.popover.close();
          facetRow.append(control.root);
          if (hadFocus) control.trigger.focus();
        }
        control.root.dataset.overflow = "false";
        remaining -= control.width + 8;
      } else {
        if (control.root.parentElement !== overflow.content) {
          const hadFocus = control.root.contains(document.activeElement);
          control.popover.close();
          overflow.content.append(control.root);
          if (hadFocus) {
            more.hidden = false;
            more.focus();
          }
        }
        control.root.dataset.overflow = "true";
        overflowed++;
      }
    }
    more.hidden = overflowed === 0;
    if (!overflowed) overflow.close();
  };
  const buildFacets = () => {
    for (const control of controls) {
      control.popover.dispose();
      control.root.remove();
    }
    controls = currentFacets.map((facet) => {
      const host = element(document, "div", "canvas-filter-toolbar__facet");
      const trigger = button(document, "secondary-button", facet.label);
      const fieldset = element(document, "fieldset", "canvas-filter-toolbar__options");
      const legend = element(document, "legend", "", facet.label);
      fieldset.append(legend);
      host.append(trigger);
      facetRow.append(host);
      const popover = createPopover({ document, trigger, mount: host, label: facet.label });
      popover.content.append(fieldset);
      for (const option of facet.options) {
        const optionLabel = element(document, "label", "canvas-filter-toolbar__option");
        const checkbox = element(document, "input");
        checkbox.type = "checkbox";
        checkbox.value = option.value;
        checkbox.disabled = Boolean(option.disabled);
        optionLabel.append(checkbox, element(document, "span", "", option.label));
        fieldset.append(optionLabel);
        checkbox.addEventListener("change", () => {
          facet.values = checkbox.checked ? [...facet.values, option.value] : facet.values.filter((value) => value !== option.value);
          sync();
          emit();
        });
      }
      return { root: host, trigger, fieldset, facet, popover, width: trigger.getBoundingClientRect().width };
    });
    sync();
  };
  const changedSearch = () => {
    renderPills();
    emit();
  };
  const cleared = () => {
    input.value = "";
    for (const facet of currentFacets) facet.values = [];
    sync();
    input.focus();
    emit();
  };
  input.addEventListener("input", changedSearch);
  clear.addEventListener("click", cleared);
  sortSelect.addEventListener("change", emit);
  const ResizeObserverType = document.defaultView?.ResizeObserver;
  const observer = ResizeObserverType ? new ResizeObserverType(measure) : void 0;
  observer?.observe(row);
  document.defaultView?.addEventListener("resize", measure);
  buildFacets();
  function update(patch = {}) {
    if (Object.hasOwn(patch, "sort")) {
      const value = patch.sort;
      if (value != null) {
        requiredLabel(value.label);
        if (!Array.isArray(value.options) || !value.options.length) throw new TypeError("sort.options must not be empty.");
        const ids = /* @__PURE__ */ new Set();
        for (const option of value.options) {
          requiredLabel(option.value);
          requiredLabel(option.label);
          if (ids.has(option.value)) throw new TypeError("Duplicate sort option.");
          ids.add(option.value);
        }
        if (!ids.has(value.value)) throw new TypeError("sort.value must match an option.");
      }
      currentSort = value;
      sortHost.hidden = !value;
      setText(sortLabel, value?.label);
      sortSelect.replaceChildren(...(value?.options ?? []).map((option) => {
        const node = element(document, "option", "", option.label);
        node.value = option.value;
        return node;
      }));
      sortSelect.value = value?.value ?? "";
    }
    if (Object.hasOwn(patch, "facets")) {
      const next = validateFacets(patch.facets);
      const hadFocus = controls.some((control) => control.root.contains(document.activeElement));
      overflow.close();
      currentFacets = next;
      buildFacets();
      if (hadFocus) input.focus();
    }
    if (Object.hasOwn(patch, "label")) root.setAttribute("aria-label", requiredLabel(patch.label));
    if (Object.hasOwn(patch, "searchLabel")) {
      input.setAttribute("aria-label", requiredLabel(patch.searchLabel));
      input.placeholder = patch.searchLabel;
    }
    if (Object.hasOwn(patch, "search")) {
      input.value = text(patch.search);
      renderPills();
    }
    if (Object.hasOwn(patch, "resultCount")) {
      if (patch.resultCount !== void 0 && (!Number.isInteger(patch.resultCount) || patch.resultCount < 0)) {
        throw new RangeError("resultCount must be a nonnegative integer.");
      }
      currentCount = patch.resultCount;
    }
    if (Object.hasOwn(patch, "formatResultCount")) {
      if (typeof patch.formatResultCount !== "function") throw new TypeError("formatResultCount must be a function.");
      countFormatter = patch.formatResultCount;
    }
    setHiddenText(count, currentCount === void 0 ? "" : text(countFormatter(currentCount)));
    if (Object.hasOwn(patch, "removeLabel")) {
      currentRemoveLabel = requiredLabel(patch.removeLabel);
      renderPills();
    }
    if (Object.hasOwn(patch, "moreLabel")) {
      setText(more, requiredLabel(patch.moreLabel));
      overflow.update({ label: patch.moreLabel });
    }
    if (Object.hasOwn(patch, "clearLabel")) setText(clear, requiredLabel(patch.clearLabel));
    if (Object.hasOwn(patch, "onChange")) {
      optionalCallback(patch.onChange, "onChange");
      changeHandler = patch.onChange;
    }
    measure();
  }
  update({ label, searchLabel, resultCount, sort });
  return {
    ...destroyable(root, [() => {
      disposed = true;
      observer?.disconnect();
      document.defaultView?.removeEventListener("resize", measure);
      input.removeEventListener("input", changedSearch);
      clear.removeEventListener("click", cleared);
      sortSelect.removeEventListener("change", emit);
      for (const control of controls) control.popover.dispose();
      for (const view of pillViews) view.dispose();
      overflow.dispose();
      changeHandler = void 0;
    }]),
    input,
    update,
    getValue: snapshot
  };
}
export {
  createActionCard,
  createActionGroup,
  createActionToolbar,
  createBadge,
  createBlankslate,
  createCanvasFooter,
  createCanvasHeader,
  createCanvasShell,
  createCheckbox,
  createCheckboxGroup,
  createChoiceGroup,
  createCodeBlock,
  createCommandPalette,
  createCounter,
  createDetailPanel,
  createDialog,
  createDisclosure,
  createFilterPill,
  createFilterToolbar,
  createFormField,
  createInlineEditor,
  createInputWithAction,
  createKeyValueList,
  createListDetail,
  createMenuButton,
  createMessageBar,
  createMetadataList,
  createNavigationControls,
  createOutputPanel,
  createPopover,
  createProductNavigation,
  createProgressBar,
  createPromptComposer,
  createRadioGroup,
  createResizeHandle2 as createResizeHandle,
  createSectionHeader,
  createSelect,
  createSelectPanel,
  createSkeleton,
  createSpinner,
  createSplitPane,
  createSwitch,
  createTable,
  createTabs,
  createTag,
  createTextInput,
  createTextarea,
  createTooltip
};
