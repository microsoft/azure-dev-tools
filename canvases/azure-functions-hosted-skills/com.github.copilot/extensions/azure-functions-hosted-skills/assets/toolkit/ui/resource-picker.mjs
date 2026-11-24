// packages/canvas-toolkit/src/ui/resource-picker.mjs
import { createIcon } from "./icons.mjs";
var instances = /* @__PURE__ */ new WeakMap();
var errorMessage = (error) => error instanceof Error ? error.message : String(error ?? "");
var defaultVocabulary = Object.freeze({
  singular: "resource",
  plural: "resources",
  title: "Select resources",
  descriptionMultiple: "Choose one or more resources.",
  descriptionSingle: "Choose one resource.",
  descriptionImmediate: "Changes take effect immediately. Choose one or more resources.",
  searchPlaceholder: "Search resources...",
  searchLabel: "Search resources",
  listLabel: "Resources",
  triggerEmpty: "Choose resources",
  triggerAction: "Change resources",
  triggerSummary: (item) => item.name,
  triggerAccessibleSummary: (item) => item.name,
  chooseLabel: "Choose resources",
  defaultTitle: "Use your default resource?",
  defaultDescription: "Continue with this resource, or choose others.",
  defaultBackLabel: "Back to default resource",
  closeLabel: "Close resource picker",
  refreshLabel: "Refresh resources",
  loadingLabel: "Loading resources...",
  emptyTitle: "No resources found",
  emptyDescription: "No resources are available.",
  emptySearchDescription: "Try a different search.",
  validationEmpty: "Select at least one resource.",
  validationMissing: "Some selected resources are no longer available. Clear selection and choose again.",
  validationDisabled: "Some selected resources are unavailable. Clear selection and choose again.",
  validationSingle: "Select only one resource.",
  groupHelp: "Select resources from one group. Clear selection to switch.",
  groupBlocked: "Clear selection to switch groups.",
  countLabel: (count) => `${count} resource${count === 1 ? "" : "s"}`,
  summaryLabel: (count) => `${count} resource${count === 1 ? "" : "s"}`,
  selectedLabel: (count) => `${count} selected`,
  selectAllLabel: "Select all matching resources",
  clearMatchingLabel: "Clear matching resources"
});
var defaultItemModel = Object.freeze({
  key: (item) => item.key,
  primary: (item) => item.name ?? item.label ?? item.key,
  secondary: (item) => item.id ?? "",
  tertiary: () => "",
  groupKey: (item) => item.groupKey ?? "",
  groupLabel: (item) => item.groupLabel ?? "",
  groupDescription: () => "",
  searchText: (item) => Object.values(item).filter((value) => typeof value === "string").join(" "),
  disabled: (item) => !!item.disabled,
  disabledReason: (item) => item.disabledReason ?? "",
  isDefault: (item) => !!item.isDefault,
  icon: () => "",
  badge: () => "",
  badgeAccessibleLabel: (item) => item.badge ?? "",
  accessibleDescription: () => ""
});
function createGroupedResourcePicker({
  document = globalThis.document,
  id,
  trigger,
  triggerVariant = "toolbar",
  mount = document?.body,
  selectionMode = "multiple",
  commitMode = "explicit",
  singleGroup = false,
  onApply,
  onRefresh,
  onCancel,
  onOpenChange,
  classPrefix = "canvas-resource-picker",
  metricPrefix = "resource-picker",
  itemModel: suppliedItemModel = {},
  vocabulary: suppliedVocabulary = {},
  dialogSize = "default",
  rowDensity = "default",
  draftSummary,
  stateKey = "items",
  pageSize = 200
} = {}) {
  if (!document?.createElement || !mount?.append) throw new TypeError("A document and dialog mount are required.");
  if (typeof id !== "string" || !id || /\s/.test(id)) throw new TypeError("A unique, nonempty id without whitespace is required.");
  if (!["multiple", "single"].includes(selectionMode)) throw new TypeError("selectionMode must be multiple or single.");
  if (!["explicit", "immediate"].includes(commitMode)) throw new TypeError("commitMode must be explicit or immediate.");
  if (!["default", "wide"].includes(dialogSize)) throw new TypeError("dialogSize must be default or wide.");
  if (!["default", "compact"].includes(rowDensity)) throw new TypeError("rowDensity must be default or compact.");
  const immediate = commitMode === "immediate";
  if (!["toolbar", "field"].includes(triggerVariant)) throw new TypeError("triggerVariant must be toolbar or field.");
  if (typeof onApply !== "function") throw new TypeError("onApply is required.");
  if (onRefresh !== void 0 && typeof onRefresh !== "function") throw new TypeError("onRefresh must be a function.");
  if (draftSummary !== void 0 && typeof draftSummary !== "function") throw new TypeError("draftSummary must be a function.");
  if (typeof classPrefix !== "string" || !classPrefix || /\s/.test(classPrefix)) throw new TypeError("classPrefix must be a nonempty class name.");
  if (typeof metricPrefix !== "string" || !metricPrefix || /\s/.test(metricPrefix)) throw new TypeError("metricPrefix must be a nonempty identifier.");
  if (typeof stateKey !== "string" || !stateKey || /\s/.test(stateKey)) throw new TypeError("stateKey must be a nonempty property name.");
  if (!Number.isInteger(pageSize) || pageSize < 20 || pageSize > 1e3) throw new TypeError("pageSize must be an integer from 20 to 1000.");
  if (trigger && (trigger.tagName !== "BUTTON" || trigger.ownerDocument !== document)) {
    throw new TypeError("trigger must be a button in the supplied document.");
  }
  const itemModel = { ...defaultItemModel, ...suppliedItemModel };
  const vocabulary = { ...defaultVocabulary, ...suppliedVocabulary };
  const prefix = classPrefix;
  const classNames = (suffix) => [.../* @__PURE__ */ new Set([`${prefix}-${suffix}`, `canvas-resource-picker-${suffix}`, `canvas-subscription-picker-${suffix}`])].join(" ");
  const groupKey = (item) => item.groupKey;
  const countLabel = vocabulary.countLabel;
  const ids = instances.get(document) ?? /* @__PURE__ */ new Set();
  const baseId = `${prefix}-${id}`;
  if (ids.has(id) || document.getElementById(id) || document.getElementById(baseId)) {
    throw new Error(`Resource picker id is already in use: ${id}`);
  }
  instances.set(document, ids);
  ids.add(id);
  const ownsTrigger = !trigger;
  trigger ??= document.createElement("button");
  if (ownsTrigger) trigger.setAttribute("data-metric-id", `${metricPrefix}-open`);
  const originalChildren = [...trigger.childNodes];
  const originalAttributes = new Map(
    ["type", "aria-haspopup", "aria-controls", "aria-expanded", "aria-label", "title", "disabled", "data-trigger-variant"].map((name) => [name, trigger.getAttribute(name)])
  );
  const hadTriggerClass = trigger.classList.contains(`${prefix}-trigger`);
  const listeners = [];
  const itemIds = /* @__PURE__ */ new Map();
  const groupIds = /* @__PURE__ */ new Map();
  let items = [];
  let itemsByKey = /* @__PURE__ */ new Map();
  let applied = /* @__PURE__ */ new Set();
  let draft = /* @__PURE__ */ new Set();
  let loading = false;
  let externalError = "";
  let applyError = "";
  let refreshError = "";
  let refreshing = false;
  let refreshDisabledReason = "";
  let busy = false;
  let queuedSelection = null;
  let opened = false;
  let destroyed = false;
  let operation = 0;
  let confirmDefault = false;
  let defaultStep = false;
  let returnFocus;
  let pointerStartedOutside = false;
  let rows = [];
  let renderedLimit = pageSize;
  function element(tag, suffix, text) {
    const node = document.createElement(tag);
    node.className = classNames(suffix);
    if (text !== void 0) node.textContent = text;
    return node;
  }
  function identified(tag, suffix, text) {
    const node = element(tag, suffix, text);
    node.id = `${baseId}-${suffix}`;
    return node;
  }
  function button(suffix, text, style = "secondary") {
    const node = identified("button", suffix, text);
    node.setAttribute("data-metric-id", `${metricPrefix}-${suffix}`);
    for (const name of classNames("button").split(" ")) node.classList.add(name);
    for (const name of classNames(style).split(" ")) node.classList.add(name);
    node.type = "button";
    return node;
  }
  function icon(suffix, size, value, legacyImage = false) {
    if (legacyImage) {
      const image = identified("img", suffix);
      image.width = size;
      image.height = size;
      image.alt = "";
      image.setAttribute("aria-hidden", "true");
      setIcon(image, size, value);
      return image;
    }
    const container = element("span", suffix);
    container.setAttribute("aria-hidden", "true");
    setIcon(container, size, value);
    return container;
  }
  function setIcon(container, size, value) {
    if (container.tagName === "IMG") {
      container.hidden = !value;
      if (value) container.src = value;
      else container.removeAttribute("src");
      return;
    }
    container.replaceChildren();
    if (!value) {
      container.hidden = true;
      return;
    }
    container.hidden = false;
    if (/^(?:https?:|file:|data:)/.test(value)) {
      const image = document.createElement("img");
      image.src = value;
      image.width = size;
      image.height = size;
      image.alt = "";
      container.append(image);
    } else container.append(createIcon(value, document));
  }
  function glyph(paths) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    for (const [name, value] of Object.entries({
      viewBox: "0 0 16 16",
      width: "16",
      height: "16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "aria-hidden": "true",
      focusable: "false",
      class: classNames("glyph")
    })) svg.setAttribute(name, value);
    for (const d of paths) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      svg.append(path);
    }
    return svg;
  }
  function listen(node, type, handler) {
    node.addEventListener(type, handler);
    listeners.push(() => node.removeEventListener(type, handler));
  }
  const dialog = document.createElement("dialog");
  dialog.className = [.../* @__PURE__ */ new Set([prefix, "canvas-resource-picker", "canvas-subscription-picker"])].join(" ");
  if (dialogSize !== "default") dialog.classList.add(`canvas-resource-picker-size-${dialogSize}`);
  if (rowDensity !== "default") dialog.classList.add(`canvas-resource-picker-density-${rowDensity}`);
  dialog.id = id;
  dialog.setAttribute("aria-modal", "true");
  const header = element("header", "header");
  const back = button("back", void 0, "icon-button");
  back.setAttribute("aria-label", vocabulary.defaultBackLabel);
  back.append(createIcon("arrow-left", document));
  const heading = element("div", "heading");
  const title = identified("h2", "title");
  const description = identified("p", "description");
  heading.append(title, description);
  dialog.setAttribute("aria-labelledby", title.id);
  dialog.setAttribute("aria-describedby", description.id);
  const dismiss = button("close", void 0, "icon-button");
  dismiss.setAttribute("aria-label", vocabulary.closeLabel);
  dismiss.append(glyph(["m4 4 8 8M12 4l-8 8"]));
  const refresh = button("refresh", void 0, "icon-button");
  refresh.title = vocabulary.refreshLabel;
  refresh.setAttribute("aria-label", vocabulary.refreshLabel);
  refresh.hidden = !onRefresh;
  refresh.append(createIcon("refresh", document));
  header.append(back, heading, refresh, dismiss);
  const defaultCard = identified("div", "default");
  const defaultCopy = element("div", "default-copy");
  const defaultName = element("span", "default-name");
  const defaultId = element("span", "subscription-id");
  defaultCopy.append(defaultName, defaultId);
  const defaultIcon = icon("default-icon", 28, void 0, true);
  defaultCard.append(defaultIcon, defaultCopy);
  const selection = identified("div", "selection");
  const searchBox = element("div", "search-box");
  const search = identified("input", "search");
  search.setAttribute("data-metric-id", `${metricPrefix}-search`);
  search.type = "search";
  search.placeholder = vocabulary.searchPlaceholder;
  search.autocomplete = "off";
  search.spellcheck = false;
  const searchLabel = element("label", "sr-only", vocabulary.searchLabel);
  searchLabel.htmlFor = search.id;
  searchBox.append(glyph(["M11.5 7a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0", "m10.5 10.5 3 3"]), searchLabel, search);
  const toolbar = element("div", "toolbar");
  const matches = identified("span", "matches");
  matches.setAttribute("role", "status");
  const bulk = button("bulk", "Select all", "text-button");
  const showMore = button("show-more", "Show more", "text-button");
  toolbar.append(matches, showMore, bulk);
  const groupHelp = identified("p", "group-help", vocabulary.groupHelp);
  const list = identified("div", "list");
  list.setAttribute("role", selectionMode === "single" ? "radiogroup" : "group");
  list.setAttribute("aria-label", vocabulary.listLabel);
  if (singleGroup) list.setAttribute("aria-describedby", groupHelp.id);
  groupHelp.hidden = !singleGroup;
  selection.append(searchBox, toolbar, groupHelp, list);
  const error = identified("div", "error");
  error.setAttribute("role", "alert");
  const defaultActions = element("footer", "footer");
  for (const name of classNames("default-actions").split(" ")) defaultActions.classList.add(name);
  const choose = button("choose", vocabulary.chooseLabel);
  const proceed = button("continue", "Continue", "primary");
  defaultActions.append(choose, proceed);
  const actions = element("footer", "footer");
  const selectionCount = identified("span", "count");
  selectionCount.setAttribute("role", "status");
  const selectedSummary = identified("div", "selected-summary");
  selectedSummary.setAttribute("role", "status");
  selectedSummary.setAttribute("aria-live", "polite");
  selectedSummary.hidden = true;
  const selectedSummaryLabel = element("span", "selected-summary-label", "Selected");
  const selectedSummaryCopy = element("span", "selected-summary-copy");
  const selectedSummaryPrimary = element("strong", "selected-summary-primary");
  const selectedSummarySecondary = element("span", "selected-summary-secondary");
  selectedSummaryCopy.append(selectedSummaryPrimary, selectedSummarySecondary);
  selectedSummary.append(selectedSummaryLabel, selectedSummaryCopy);
  const footerButtons = element("div", "footer-buttons");
  const cancel = button("cancel", immediate ? "Done" : "Cancel");
  const apply = button("apply", suppliedVocabulary.applyLabel ?? "Apply", "primary");
  footerButtons.append(cancel);
  if (!immediate) footerButtons.append(apply);
  actions.append(selectionCount, footerButtons);
  dialog.append(header, defaultCard, selection, error, defaultActions, selectedSummary, actions);
  mount.append(dialog);
  for (const name of classNames("trigger").split(" ")) trigger.classList.add(name);
  trigger.setAttribute("data-trigger-variant", triggerVariant);
  trigger.type = "button";
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-controls", dialog.id);
  trigger.setAttribute("aria-expanded", "false");
  const pill = element("span", "pill");
  const summary = element("span", "summary");
  const pillIcon = icon("pill-icon", 14);
  pill.append(pillIcon, summary);
  const change = element("span", "change");
  if (triggerVariant === "toolbar") change.append(element("span", "change-label", suppliedVocabulary.changeLabel ?? "Change"));
  change.append(createIcon("chevron-down", document));
  trigger.replaceChildren(pill, change);
  function normalizeItem(original) {
    const key = itemModel.key(original);
    const name = itemModel.primary(original);
    const group = itemModel.groupKey(original);
    if (typeof key !== "string" || !key || typeof name !== "string" || typeof group !== "string") {
      throw new TypeError("Resource items require nonempty string keys, primary labels, and string group keys.");
    }
    return {
      original,
      key,
      name,
      id: String(itemModel.secondary(original) ?? ""),
      tertiary: String(itemModel.tertiary(original) ?? ""),
      tenantId: String(itemModel.groupDescription(original) ?? ""),
      tenantName: String(itemModel.groupLabel(original) ?? ""),
      groupKey: group,
      searchText: String(itemModel.searchText(original) ?? ""),
      disabled: !!itemModel.disabled(original),
      disabledReason: String(itemModel.disabledReason(original) ?? ""),
      isDefault: !!itemModel.isDefault(original),
      icon: String(itemModel.icon(original) ?? ""),
      badge: String(itemModel.badge(original) ?? ""),
      badgeAccessibleLabel: String(itemModel.badgeAccessibleLabel(original) ?? ""),
      accessibleDescription: String(itemModel.accessibleDescription(original) ?? "")
    };
  }
  function defaultResource() {
    const candidates = items.filter((item) => item.isDefault && !item.disabled);
    return candidates.length === 1 ? candidates[0] : void 0;
  }
  function matching() {
    const query = search.value.trim().toLowerCase();
    return query ? items.filter((item) => item.searchText.toLowerCase().includes(query)) : items;
  }
  function validation(keys) {
    const candidates = itemsByKey;
    if (!keys.size) return immediate && selectionMode === "multiple" ? "" : vocabulary.validationEmpty;
    if ([...keys].some((key) => !candidates.has(key))) return vocabulary.validationMissing;
    const selectedItems = [...keys].map((key) => candidates.get(key));
    if (selectedItems.some((item) => item.disabled)) return vocabulary.validationDisabled;
    if (selectionMode === "single" && keys.size !== 1) return vocabulary.validationSingle;
    if (singleGroup && new Set(selectedItems.map(groupKey)).size > 1) return vocabulary.groupHelp;
    return "";
  }
  function blockedByGroup(item) {
    if (!singleGroup || draft.has(item.key)) return false;
    const candidates = itemsByKey;
    return [...draft].some((key) => !candidates.has(key) || groupKey(candidates.get(key)) !== groupKey(item));
  }
  function bulkClears() {
    const eligible = matching().filter((item) => !item.disabled);
    return draft.size > 0 && (singleGroup || selectionMode === "single" || !!validation(draft) || eligible.length > 0 && eligible.every((item) => draft.has(item.key)));
  }
  function renderSummary() {
    const candidates = itemsByKey;
    const names = [...immediate && opened ? draft : applied].map((key) => candidates.get(key)?.name ?? key);
    const selected = names.length === 1 ? candidates.get([...immediate && opened ? draft : applied][0]) : null;
    summary.textContent = selected ? vocabulary.triggerSummary(selected.original) : names.length ? vocabulary.summaryLabel(names.length) : vocabulary.triggerEmpty;
    const label = names.length ? `${vocabulary.triggerAction}. ${vocabulary.countLabel(names.length)} selected: ${selected ? vocabulary.triggerAccessibleSummary(selected.original) : names.join(", ")}` : vocabulary.triggerEmpty;
    trigger.title = label;
    trigger.setAttribute("aria-label", label);
    setIcon(pillIcon, 14, selected?.icon || suppliedVocabulary.icon || "");
  }
  function updateControls() {
    const locked = !immediate && busy || loading || refreshing;
    const invalid = validation(draft);
    const candidate = defaultResource();
    dialog.setAttribute("aria-busy", String(busy || locked));
    const draftItems = [...draft].map((key) => itemsByKey.get(key)).filter(Boolean);
    const summaryValue = draftSummary?.(draftItems.map((item) => ({ ...item.original })));
    const summary2 = typeof summaryValue === "string" ? { primary: summaryValue } : summaryValue;
    if (summary2 !== void 0 && summary2 !== null && (typeof summary2 !== "object" || typeof summary2.primary !== "string" || !summary2.primary || summary2.label !== void 0 && (typeof summary2.label !== "string" || !summary2.label))) {
      throw new TypeError("draftSummary must return a nonempty string, an object with a nonempty primary string, or null.");
    }
    selectedSummary.hidden = !summary2;
    selectionCount.hidden = !!summary2;
    selectionCount.textContent = `${vocabulary.selectedLabel(draft.size)}${busy ? " - Updating..." : ""}`;
    selectedSummaryLabel.textContent = summary2?.label ?? "Selected";
    selectedSummaryPrimary.textContent = summary2?.primary ?? "";
    selectedSummarySecondary.textContent = summary2?.secondary ?? "";
    selectedSummarySecondary.hidden = !summary2?.secondary;
    selectedSummary.setAttribute("aria-label", summary2 ? `${summary2.label ?? "Selected"}: ${summary2.accessible ?? [summary2.primary, summary2.secondary].filter(Boolean).join(", ")}${busy ? ". Updating." : ""}` : "");
    apply.disabled = locked || !!invalid;
    apply.textContent = busy ? suppliedVocabulary.applyingLabel ?? "Applying..." : suppliedVocabulary.applyLabel ?? "Apply";
    proceed.disabled = locked || !candidate;
    proceed.textContent = busy ? "Continuing..." : "Continue";
    for (const control of [cancel, dismiss, back, choose]) control.disabled = busy || refreshing;
    refresh.disabled = busy || locked || !!refreshDisabledReason;
    refresh.title = refreshDisabledReason || (refreshing ? vocabulary.loadingLabel : vocabulary.refreshLabel);
    search.disabled = locked;
    const eligible = matching().filter((item) => !item.disabled);
    const clear = bulkClears();
    bulk.textContent = clear ? "Clear selection" : "Select all";
    const clearAll = singleGroup || selectionMode === "single" || !!invalid;
    bulk.setAttribute("aria-label", clear ? clearAll ? "Clear selection" : vocabulary.clearMatchingLabel : vocabulary.selectAllLabel);
    bulk.hidden = selectionMode === "single" && !draft.size;
    bulk.disabled = locked || !clear && (!eligible.length || singleGroup && new Set(eligible.map(groupKey)).size > 1);
    const matched = matching().length;
    const shown = rows.length;
    matches.textContent = loading || refreshing ? vocabulary.loadingLabel : shown < matched ? `${vocabulary.countLabel(matched)} \xB7 ${shown} shown` : vocabulary.countLabel(matched);
    showMore.hidden = locked || shown >= matched;
    showMore.disabled = locked;
    showMore.textContent = shown < matched ? `Show ${Math.min(pageSize, matched - shown)} more` : "Show more";
    for (const { input, item, row, reason } of rows) {
      const blocked = blockedByGroup(item);
      input.checked = draft.has(item.key);
      input.disabled = locked || !!item.disabled || blocked;
      for (const name of classNames("disabled").split(" ")) row.classList.toggle(name, !!item.disabled || blocked);
      reason.textContent = item.disabled ? item.disabledReason || "Unavailable" : blocked ? vocabulary.groupBlocked : "";
      reason.hidden = !reason.textContent;
    }
    const message = refreshError || externalError || applyError || (!defaultStep && draft.size ? invalid : "");
    error.textContent = message;
    error.hidden = !message;
    renderSummary();
  }
  function stableId(map, key, kind) {
    if (!map.has(key)) map.set(key, `${baseId}-${kind}-${map.size + 1}`);
    return map.get(key);
  }
  function resourceRow(item) {
    const row = element("label", "option");
    const input = element("input", "input");
    input.setAttribute("data-metric-id", `${metricPrefix}-item`);
    const rowId = stableId(itemIds, item.key, "item");
    input.id = rowId;
    input.type = selectionMode === "single" ? "radio" : "checkbox";
    input.name = `${baseId}-resource`;
    input.value = item.key;
    const copy = element("span", "copy");
    const itemIcon = icon("item-icon", 20, item.icon);
    const primaryLine = element("span", "primary-line");
    const name = element("span", "name", item.name);
    name.id = `${rowId}-name`;
    name.title = item.name;
    const badge = element("span", "badge", item.badge);
    badge.hidden = !item.badge;
    badge.title = item.badgeAccessibleLabel || item.badge;
    if (item.badgeAccessibleLabel) badge.setAttribute("aria-label", item.badgeAccessibleLabel);
    primaryLine.append(name, badge);
    const subscriptionId = element("span", "subscription-id", item.id);
    for (const className of classNames("secondary").split(" ")) subscriptionId.classList.add(className);
    subscriptionId.id = `${rowId}-id`;
    subscriptionId.title = item.id;
    const tertiary = element("span", "tertiary", item.tertiary);
    tertiary.id = `${rowId}-tertiary`;
    tertiary.hidden = !item.tertiary;
    const accessibleDescription = element("span", "sr-only", item.accessibleDescription);
    for (const className of classNames("accessible-detail").split(" ")) accessibleDescription.classList.add(className);
    accessibleDescription.id = `${rowId}-accessible`;
    accessibleDescription.hidden = !item.accessibleDescription;
    const reason = element("span", "reason");
    reason.id = `${rowId}-reason`;
    input.setAttribute("aria-labelledby", name.id);
    input.setAttribute("aria-describedby", `${subscriptionId.id} ${tertiary.id} ${accessibleDescription.id} ${reason.id}`);
    copy.append(primaryLine, subscriptionId, tertiary, accessibleDescription, reason);
    row.append(input, itemIcon, copy);
    rows.push({ row, input, item, reason });
    return row;
  }
  function renderList() {
    const focusKey = rows.find(({ input }) => input === document.activeElement)?.item.key;
    const scrollTop = list.scrollTop;
    const groups = /* @__PURE__ */ new Map();
    for (const item of matching()) {
      const key = groupKey(item);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    const quota = Math.max(1, Math.ceil(renderedLimit / Math.max(1, groups.size)));
    rows = [];
    const nodes = [...groups].map(([key, groupItems]) => {
      const section = element("section", "group");
      section.setAttribute("role", "group");
      const heading2 = element("div", "tenant-heading");
      const item = groupItems[0];
      const label = item.tenantName || item.tenantId || vocabulary.plural;
      const name = element("h3", "tenant-name", label);
      name.title = item.tenantId ? `${label}
${item.tenantId}` : label;
      name.id = stableId(groupIds, key, "tenant");
      section.setAttribute("aria-labelledby", name.id);
      const count = element("span", "tenant-count", String(groupItems.length));
      count.setAttribute("aria-label", vocabulary.countLabel(groupItems.length));
      heading2.append(name, count);
      const selectedInGroup = groupItems.filter((candidate) => draft.has(candidate.key));
      const visible = [...new Map([...groupItems.slice(0, quota), ...selectedInGroup].map((candidate) => [candidate.key, candidate])).values()];
      section.append(heading2, ...visible.map(resourceRow));
      return section;
    });
    if (!nodes.length) {
      const empty = element("div", "empty");
      empty.append(
        element("h3", "empty-title", loading ? vocabulary.loadingLabel : vocabulary.emptyTitle),
        element("p", "empty-help", loading ? "Please wait." : search.value ? vocabulary.emptySearchDescription : vocabulary.emptyDescription)
      );
      nodes.push(empty);
    }
    list.replaceChildren(...nodes);
    list.scrollTop = scrollTop;
    updateControls();
    if (focusKey !== void 0 && opened) {
      const input = rows.find((row) => row.item.key === focusKey)?.input;
      if (input && !input.disabled) input.focus({ preventScroll: true });
      else if (!search.disabled) search.focus({ preventScroll: true });
    }
  }
  function showStep(useDefault, focus = true) {
    const candidate = defaultResource();
    defaultStep = confirmDefault && useDefault && !!candidate && !loading;
    defaultCard.hidden = !defaultStep;
    defaultActions.hidden = !defaultStep;
    selection.hidden = defaultStep;
    actions.hidden = defaultStep;
    back.hidden = !confirmDefault || defaultStep || !candidate || loading;
    title.textContent = defaultStep ? vocabulary.defaultTitle : vocabulary.title;
    description.textContent = defaultStep ? vocabulary.defaultDescription : immediate ? vocabulary.descriptionImmediate : selectionMode === "single" ? vocabulary.descriptionSingle : vocabulary.descriptionMultiple;
    defaultName.textContent = candidate?.name ?? "";
    defaultName.title = candidate?.name ?? "";
    defaultId.textContent = candidate?.id ?? "";
    defaultId.title = candidate?.id ?? "";
    setIcon(defaultIcon, 28, candidate?.icon || suppliedVocabulary.icon || "");
    updateControls();
    if (focus) (defaultStep ? proceed : search.disabled ? dismiss : search).focus();
  }
  function finish(cancelled) {
    if (!opened) return;
    opened = false;
    operation++;
    busy = false;
    queuedSelection = null;
    pointerStartedOutside = false;
    draft = new Set(applied);
    if (dialog.open) dialog.close();
    trigger.setAttribute("aria-expanded", "false");
    renderSummary();
    const target = returnFocus?.isConnected && !returnFocus.disabled && returnFocus !== document.body && returnFocus !== document.documentElement ? returnFocus : trigger;
    if (target.isConnected) target.focus();
    onOpenChange?.(false);
    if (cancelled) onCancel?.();
  }
  function close({ cancelled = false } = {}) {
    if (!destroyed && !busy && !refreshing) finish(cancelled);
  }
  function open({ confirmDefault: requestedDefault = false } = {}) {
    if (destroyed || opened) return;
    draft = new Set(applied);
    confirmDefault = requestedDefault;
    applyError = "";
    refreshError = "";
    search.value = "";
    renderedLimit = pageSize;
    returnFocus = document.activeElement;
    renderList();
    showStep(true, false);
    dialog.showModal();
    opened = true;
    trigger.setAttribute("aria-expanded", "true");
    list.scrollTop = 0;
    (defaultStep ? proceed : search.disabled ? dismiss : search).focus();
    onOpenChange?.(true);
  }
  async function applySelection(keys) {
    if (destroyed || !opened || loading || refreshing) return;
    if (busy) {
      if (immediate) queuedSelection = new Set(keys);
      return;
    }
    const invalid = validation(keys);
    if (invalid) {
      applyError = invalid;
      updateControls();
      return;
    }
    const currentOperation = ++operation;
    const candidates = itemsByKey;
    const selectedItems = [...keys].map((key) => ({ ...candidates.get(key).original }));
    busy = true;
    applyError = "";
    updateControls();
    try {
      await onApply(selectedItems);
      if (destroyed || currentOperation !== operation) return;
      const stale = validation(keys);
      if (stale) throw new Error(stale);
      applied = new Set(keys);
      if (!immediate || defaultStep || selectionMode === "single") finish(false);
    } catch (failure) {
      if (destroyed || currentOperation !== operation) return;
      applyError = errorMessage(failure) || `Could not apply ${vocabulary.plural}. Try again.`;
      if (immediate && !queuedSelection) draft = new Set(applied);
      busy = false;
      updateControls();
      if (!immediate) {
        const retry = defaultStep ? proceed : apply;
        (retry.disabled ? dismiss : retry).focus();
      }
    } finally {
      if (immediate && !destroyed && currentOperation === operation) {
        busy = false;
        const next = queuedSelection;
        queuedSelection = null;
        updateControls();
        if (next) await applySelection(next);
      }
    }
  }
  async function refreshResources() {
    if (destroyed || !opened || !onRefresh || busy || loading || refreshing || refreshDisabledReason) return;
    const currentOperation = ++operation;
    refreshing = true;
    refreshError = "";
    applyError = "";
    updateControls();
    try {
      await onRefresh();
    } catch (failure) {
      if (!destroyed && currentOperation === operation) refreshError = errorMessage(failure) || `Could not refresh ${vocabulary.plural}. Try again.`;
    } finally {
      refreshing = false;
      if (!destroyed) updateControls();
    }
  }
  function setState(state = {}) {
    if (destroyed) return;
    if (Object.hasOwn(state, stateKey)) {
      if (!Array.isArray(state[stateKey])) throw new TypeError(`${stateKey} must be an array.`);
      const keys = /* @__PURE__ */ new Set();
      for (const original of state[stateKey]) {
        if (!original || typeof original !== "object") throw new TypeError("Resource items must be objects.");
        const item = normalizeItem(original);
        if (keys.has(item.key)) throw new TypeError("Resource items require unique string keys.");
        keys.add(item.key);
      }
    }
    if (Object.hasOwn(state, "selectedKeys")) {
      if (!Array.isArray(state.selectedKeys) && !(state.selectedKeys instanceof Set) || [...state.selectedKeys].some((key) => typeof key !== "string")) {
        throw new TypeError("selectedKeys must be an array or Set of opaque string keys.");
      }
    }
    if (Object.hasOwn(state, stateKey)) {
      items = state[stateKey].map((original) => normalizeItem({ ...original }));
      itemsByKey = new Map(items.map((item) => [item.key, item]));
    }
    if (Object.hasOwn(state, "selectedKeys")) applied = new Set(state.selectedKeys);
    if (Object.hasOwn(state, "loading")) loading = !!state.loading;
    if (Object.hasOwn(state, "error")) externalError = errorMessage(state.error);
    if (Object.hasOwn(state, "refreshDisabledReason")) refreshDisabledReason = errorMessage(state.refreshDisabledReason);
    if (!opened) draft = new Set(applied);
    const focusDefault = opened && defaultStep && (!defaultResource() || loading);
    renderList();
    showStep(defaultStep, focusDefault);
  }
  listen(trigger, "click", () => open());
  const cancelSelection = () => close({ cancelled: true });
  listen(dismiss, "click", cancelSelection);
  listen(cancel, "click", immediate ? () => close() : cancelSelection);
  listen(choose, "click", () => {
    if (!busy && !refreshing) showStep(false);
  });
  listen(back, "click", () => {
    if (!busy && !refreshing) showStep(true);
  });
  listen(refresh, "click", refreshResources);
  listen(apply, "click", () => applySelection(new Set(draft)));
  listen(proceed, "click", () => {
    const candidate = defaultResource();
    if (candidate) applySelection(/* @__PURE__ */ new Set([candidate.key]));
  });
  listen(dialog, "cancel", (event) => {
    event.preventDefault();
    cancelSelection();
  });
  listen(dialog, "close", () => {
    if (!dialog.open) finish(false);
  });
  const outside = (event) => {
    if (event.target !== dialog) return false;
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  listen(dialog, "pointerdown", (event) => {
    pointerStartedOutside = outside(event);
  });
  listen(dialog, "pointercancel", () => {
    pointerStartedOutside = false;
  });
  listen(dialog, "click", (event) => {
    const dismissOutside = pointerStartedOutside && outside(event);
    pointerStartedOutside = false;
    if (dismissOutside) cancelSelection();
  });
  listen(search, "input", () => {
    if (!immediate && busy || loading || refreshing) return;
    renderedLimit = pageSize;
    list.scrollTop = 0;
    renderList();
  });
  listen(showMore, "click", () => {
    if (!immediate && busy || loading || refreshing) return;
    renderedLimit += pageSize;
    renderList();
    showMore.focus({ preventScroll: true });
  });
  listen(search, "keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      rows.find(({ input }) => !input.disabled)?.input.focus();
    }
  });
  listen(list, "keydown", (event) => {
    if (immediate && event.key === "Enter" && rows.some(({ input }) => input === event.target)) {
      event.preventDefault();
      event.target.click();
      return;
    }
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    const inputs = rows.map((row) => row.input).filter((input) => !input.disabled);
    const index = inputs.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    if (index === 0 && event.key === "ArrowUp") search.focus();
    else {
      const next = inputs[Math.min(inputs.length - 1, Math.max(0, index + (event.key === "ArrowDown" ? 1 : -1)))];
      next.focus();
      if (selectionMode === "single") next.click();
    }
  });
  listen(list, "change", (event) => {
    const row = rows.find(({ input: input2 }) => input2 === event.target);
    if (!row) return;
    const { input, item } = row;
    if (!immediate && busy || loading || refreshing || item.disabled || blockedByGroup(item)) {
      updateControls();
      return;
    }
    if (input.checked) {
      if (selectionMode === "single") draft.clear();
      draft.add(item.key);
    } else draft.delete(item.key);
    applyError = "";
    updateControls();
    if (immediate) void applySelection(new Set(draft));
  });
  listen(bulk, "click", () => {
    if (!immediate && busy || loading || refreshing) return;
    if (bulkClears()) {
      if (singleGroup || selectionMode === "single" || validation(draft)) draft.clear();
      else for (const item of matching()) if (!item.disabled) draft.delete(item.key);
    } else {
      const eligible = matching().filter((item) => !item.disabled);
      if (selectionMode === "single" || singleGroup && new Set(eligible.map(groupKey)).size > 1) return;
      for (const item of eligible) draft.add(item.key);
    }
    applyError = "";
    updateControls();
    if (immediate) void applySelection(new Set(draft));
  });
  renderList();
  showStep(false, false);
  return {
    trigger,
    dialog,
    setState,
    open,
    close,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      operation++;
      for (const dispose of listeners) dispose();
      finish(false);
      dialog.remove();
      if (ownsTrigger) trigger.remove();
      else {
        trigger.replaceChildren(...originalChildren);
        if (!hadTriggerClass) for (const name of classNames("trigger").split(" ")) trigger.classList.remove(name);
        for (const [name, value] of originalAttributes) {
          if (value === null) trigger.removeAttribute(name);
          else trigger.setAttribute(name, value);
        }
      }
      ids.delete(id);
      itemIds.clear();
      groupIds.clear();
    },
    get isOpen() {
      return opened;
    }
  };
}
export {
  createGroupedResourcePicker
};
