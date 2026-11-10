// packages/canvas-toolkit/src/ui/forms.mjs
import { id, node, label, callback, visibleText, listen, lifecycle, button, items } from "./component-helpers.mjs";
function createFormField({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "div", "canvas-field canvas-ui");
  const title = node(document, "label", "canvas-field__label");
  const host = node(document, "div", "canvas-field__control");
  const hint = node(document, "div", "canvas-field__hint");
  const error = node(document, "div", "canvas-field__error");
  hint.id = id();
  error.id = id();
  error.setAttribute("aria-live", "polite");
  root.append(title, host, hint, error);
  let state = { label: "", required: false, hint: "", error: "", ...options };
  let control;
  let original;
  const restore = () => {
    if (!control || !original) return;
    for (const [name, value] of Object.entries(original)) {
      if (value === null) control.removeAttribute(name);
      else control.setAttribute(name, value);
    }
  };
  function update(patch = {}) {
    const next = { ...state, ...patch };
    label(next.label);
    if (next.control !== control) {
      restore();
      if (!next.control || next.control.ownerDocument !== document || !["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(next.control.tagName)) {
        throw new TypeError("control must be a native labelable control in the supplied document.");
      }
      control = next.control;
      original = Object.fromEntries(["aria-describedby", "aria-invalid", "aria-required"].map((key) => [key, control.getAttribute(key)]));
      control.id ||= id();
      host.replaceChildren(control);
    }
    state = next;
    title.htmlFor = control.id;
    title.textContent = state.label;
    visibleText(hint, state.hint);
    visibleText(error, state.error);
    const descriptions = [original["aria-describedby"], state.hint && hint.id, state.error && error.id].filter(Boolean).join(" ");
    if (descriptions) control.setAttribute("aria-describedby", descriptions);
    else control.removeAttribute("aria-describedby");
    control.setAttribute("aria-invalid", String(Boolean(state.error)));
    control.setAttribute("aria-required", String(Boolean(state.required)));
  }
  update();
  return { ...lifecycle(root, mount, [restore]), controlHost: host, update };
}
function createInput(kind, { document = globalThis.document, mount, ...options } = {}) {
  const input = node(document, kind === "textarea" ? "textarea" : "input", "canvas-input");
  if (kind !== "textarea") input.type = kind === "switch" ? "checkbox" : kind;
  if (kind === "switch") input.setAttribute("role", "switch");
  const check = kind === "checkbox" || kind === "switch";
  const field = createFormField({ document, control: input, label: options.label, ...options });
  field.element.classList.toggle("canvas-field--check", check);
  const cleanups = [field.dispose];
  let state = { value: "", checked: false, ...options };
  const resize = () => {
    if (kind !== "textarea" || !state.autoSize) {
      input.style.height = "";
      return;
    }
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 240)}px`;
  };
  function update(patch = {}) {
    state = { ...state, ...patch };
    callback(state.onChange, "onChange");
    field.update({ label: state.label, hint: state.hint, error: state.error, required: state.required });
    for (const key of ["disabled", "readOnly", "required"]) input[key] = Boolean(state[key]);
    input.name = state.name ?? "";
    input.placeholder = state.placeholder ?? "";
    if (check) {
      input.checked = Boolean(state.checked);
      if (kind === "checkbox") input.indeterminate = Boolean(state.indeterminate);
    } else if (Object.hasOwn(patch, "value") || !input.value) input.value = String(state.value ?? "");
    if (kind === "textarea") input.rows = state.rows ?? 3;
    resize();
  }
  listen(cleanups, input, check ? "change" : "input", () => {
    if (check) state.checked = input.checked;
    else state.value = input.value;
    resize();
    state.onChange?.(check ? input.checked : input.value);
  });
  update(state);
  const view = lifecycle(field.element, mount, cleanups);
  return { ...view, input, update };
}
var createTextInput = (options) => createInput("text", options);
var createTextarea = (options) => createInput("textarea", options);
var createCheckbox = (options) => createInput("checkbox", options);
var createSwitch = (options) => createInput("switch", options);
function createSelect({ document = globalThis.document, mount, ...options } = {}) {
  const select = node(document, "select", "canvas-input");
  const field = createFormField({ document, control: select, label: options.label });
  const cleanups = [field.dispose];
  let state = { options: [], value: "", ...options };
  function update(patch = {}) {
    const next = { ...state, ...patch };
    items(next.options.map((option) => ({ ...option, id: option.value })));
    callback(next.onChange, "onChange");
    if (next.options.length && !next.options.some((option) => option.value === next.value)) {
      throw new RangeError("value must match a select option.");
    }
    state = next;
    field.update({ label: state.label, hint: state.hint, error: state.error, required: state.required });
    select.disabled = Boolean(state.disabled);
    select.required = Boolean(state.required);
    select.name = state.name ?? "";
    if (Object.hasOwn(patch, "options")) select.replaceChildren(...state.options.map((value) => {
      const option = node(document, "option", "", value.label);
      option.value = value.value;
      option.disabled = Boolean(value.disabled);
      return option;
    }));
    select.value = state.value;
  }
  listen(cleanups, select, "change", () => {
    state.value = select.value;
    state.onChange?.(select.value);
  });
  update(state);
  return { ...lifecycle(field.element, mount, cleanups), input: select, update };
}
function createChoices(multiple, { document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "fieldset", "canvas-choice-group canvas-ui");
  const legend = node(document, "legend");
  const hint = node(document, "div", "canvas-field__hint");
  const error = node(document, "div", "canvas-field__error");
  const choices = node(document, "div", "canvas-choice-group__items");
  hint.id = id();
  error.id = id();
  error.setAttribute("aria-live", "polite");
  root.append(legend, hint, choices, error);
  let state = { items: [], value: multiple ? [] : null, ...options };
  const name = id();
  const cleanups = [];
  function update(patch = {}) {
    const next = { ...state, ...patch };
    label(next.label);
    items(next.items);
    callback(next.onChange);
    if (multiple && !Array.isArray(next.value)) throw new TypeError("CheckboxGroup value must be an array.");
    const selected = multiple ? next.value : next.value == null ? [] : [next.value];
    if (selected.some((value) => !next.items.some((item) => item.id === value))) throw new RangeError("Unknown choice.");
    state = next;
    for (const cleanup of cleanups.splice(0)) cleanup();
    legend.textContent = state.label;
    visibleText(hint, state.hint);
    visibleText(error, state.error);
    root.setAttribute("aria-describedby", [state.hint && hint.id, state.error && error.id].filter(Boolean).join(" "));
    root.setAttribute("aria-invalid", String(Boolean(state.error)));
    root.disabled = Boolean(state.disabled);
    root.setAttribute("data-cards", String(Boolean(state.cards)));
    choices.replaceChildren(...state.items.map((item) => {
      const wrapper = node(document, "label", "canvas-choice");
      const input = node(document, "input");
      input.type = multiple ? "checkbox" : "radio";
      input.name = state.name ?? name;
      input.value = item.id;
      input.disabled = Boolean(item.disabled);
      input.checked = selected.includes(item.id);
      const copy = node(document, "span");
      copy.append(node(document, "span", "", item.label));
      if (item.description) copy.append(node(document, "span", "canvas-field__hint", item.description));
      wrapper.append(input, copy);
      listen(cleanups, input, "change", () => {
        if (multiple) {
          const values = new Set(state.value);
          if (input.checked) values.add(item.id);
          else values.delete(item.id);
          state.value = state.items.filter((item2) => values.has(item2.id)).map((item2) => item2.id);
        } else state.value = item.id;
        state.onChange?.(multiple ? [...state.value] : state.value);
      });
      return wrapper;
    }));
  }
  update();
  return { ...lifecycle(root, mount, [() => {
    for (const cleanup of cleanups.splice(0)) cleanup();
  }]), update };
}
var createRadioGroup = (options) => createChoices(false, options);
var createChoiceGroup = createRadioGroup;
var createCheckboxGroup = (options) => createChoices(true, options);
function createInputWithAction({ document = globalThis.document, mount, ...options } = {}) {
  const input = createTextInput({ document, ...options });
  const row = node(document, "div", "canvas-input-action");
  const action = button(document, options.actionLabel ?? "Browse");
  const preview = node(document, "div", "canvas-field__hint");
  preview.id = id();
  row.append(input.input, action);
  input.element.querySelector(".canvas-field__control").append(row, preview);
  let state = { ...options };
  let revision = 0;
  let pending = false;
  const cleanups = [input.dispose];
  const result = lifecycle(input.element, mount, cleanups);
  const updateInput = (patch) => {
    input.update(patch);
    const descriptions = (input.input.getAttribute("aria-describedby") ?? "").split(" ").filter(Boolean);
    if (state.preview) descriptions.push(preview.id);
    if (descriptions.length) input.input.setAttribute("aria-describedby", descriptions.join(" "));
  };
  const refresh = () => {
    action.disabled = pending || Boolean(state.disabled) || !state.onAction;
    action.setAttribute("aria-busy", String(pending));
  };
  listen(cleanups, action, "click", async () => {
    if (pending) return;
    const run = ++revision;
    pending = true;
    refresh();
    updateInput({ error: "" });
    try {
      const value = await state.onAction(input.input.value);
      if (result.disposed || run !== revision) return;
      if (value != null) {
        updateInput({ value });
        state.onChange?.(value);
      }
    } catch (failure) {
      if (!result.disposed && run === revision) {
        updateInput({ error: failure instanceof Error ? failure.message : String(failure) });
        input.input.focus();
      }
    } finally {
      if (!result.disposed && run === revision) {
        pending = false;
        refresh();
      }
    }
  });
  listen(cleanups, input.input, "input", () => {
    revision++;
    pending = false;
    refresh();
  });
  function update(patch = {}) {
    callback(patch.onAction);
    state = { ...state, ...patch };
    if (Object.hasOwn(patch, "value") || Object.hasOwn(patch, "onAction")) {
      revision++;
      pending = false;
    }
    updateInput(patch);
    action.textContent = label(state.actionLabel ?? "Browse");
    visibleText(preview, state.preview);
    refresh();
  }
  update();
  return { ...result, input: input.input, actionButton: action, update };
}
function createSelectPanel({ document = globalThis.document, mount, ...options } = {}) {
  const root = node(document, "div", "canvas-select-panel canvas-ui");
  const trigger = button(document, options.label ?? "Select");
  const panel = node(document, "div", "canvas-select-panel__panel");
  if (typeof panel.showPopover !== "function") throw new Error("SelectPanel requires the Popover API.");
  panel.popover = "auto";
  panel.id = id();
  panel.setAttribute("role", "group");
  trigger.setAttribute("aria-controls", panel.id);
  trigger.setAttribute("aria-expanded", "false");
  const search = node(document, "input");
  search.type = "search";
  const results = node(document, "div", "canvas-select-panel__items");
  const status = node(document, "p", "canvas-field__hint");
  status.setAttribute("role", "status");
  panel.append(search, results, status);
  root.append(trigger, panel);
  const cleanups = [];
  let rowCleanups = [];
  let state = { items: [], value: null, multiple: false, loading: false, error: "", emptyText: "No matches.", searchLabel: "Search options", ...options };
  function render() {
    const focused = results.contains(document.activeElement) ? document.activeElement.value : null;
    for (const cleanup of rowCleanups.splice(0)) cleanup();
    const selected = state.multiple ? state.value ?? [] : state.value == null ? [] : [state.value];
    const filtered = state.items.filter((item) => item.label.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()));
    results.replaceChildren(...filtered.map((item) => {
      const wrapper = node(document, "label", "canvas-choice");
      const input = node(document, "input");
      input.type = state.multiple ? "checkbox" : "radio";
      input.name = panel.id;
      input.value = item.id;
      input.checked = selected.includes(item.id);
      input.disabled = Boolean(item.disabled || state.loading || state.error);
      wrapper.append(input, node(document, "span", "", item.label));
      listen(rowCleanups, input, "change", () => {
        state.value = state.multiple ? input.checked ? [...selected.filter((value) => value !== item.id), item.id] : selected.filter((value) => value !== item.id) : item.id;
        state.onChange?.(state.multiple ? [...state.value] : state.value);
        if (!state.multiple) {
          panel.hidePopover();
          trigger.focus();
        }
        render();
      });
      return wrapper;
    }));
    visibleText(status, state.error || (state.loading ? state.loadingText ?? "Loading\u2026" : !filtered.length ? state.emptyText : ""));
    status.setAttribute("role", state.error ? "alert" : "status");
    trigger.textContent = selected.length ? state.items.filter((item) => selected.includes(item.id)).map((item) => item.label).join(", ") : state.label;
    trigger.setAttribute("aria-label", `${state.label}${selected.length ? `: ${trigger.textContent}` : ""}`);
    panel.setAttribute("aria-busy", String(Boolean(state.loading)));
    if (focused) [...results.querySelectorAll("input")].find((input) => input.value === focused && !input.disabled)?.focus();
  }
  function position() {
    const rect = trigger.getBoundingClientRect();
    panel.style.inset = "auto";
    panel.style.left = `${Math.max(8, Math.min(rect.left, document.defaultView.innerWidth - panel.offsetWidth - 8))}px`;
    panel.style.top = `${Math.max(8, Math.min(rect.bottom + 4, document.defaultView.innerHeight - panel.offsetHeight - 8))}px`;
  }
  listen(cleanups, trigger, "click", () => {
    if (panel.matches(":popover-open")) panel.hidePopover();
    else {
      panel.showPopover();
      position();
      search.focus();
    }
  });
  listen(cleanups, panel, "toggle", () => trigger.setAttribute("aria-expanded", String(panel.matches(":popover-open"))));
  listen(cleanups, search, "input", render);
  listen(cleanups, panel, "keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      panel.hidePopover();
      trigger.focus();
    }
  });
  listen(cleanups, document.defaultView, "resize", () => {
    if (panel.matches(":popover-open")) position();
  });
  function update(patch = {}) {
    const next = { ...state, ...patch };
    label(next.label);
    items(next.items);
    callback(next.onChange);
    if (next.multiple && next.value != null && !Array.isArray(next.value)) throw new TypeError("Multiple selection requires an array.");
    const selected = next.multiple ? next.value ?? [] : next.value == null ? [] : [next.value];
    if (selected.some((value) => !next.items.some((item) => item.id === value))) throw new RangeError("Unknown selected option.");
    state = next;
    search.setAttribute("aria-label", label(state.searchLabel));
    panel.setAttribute("aria-label", state.label);
    trigger.disabled = Boolean(state.disabled);
    if (trigger.disabled && panel.matches(":popover-open")) panel.hidePopover();
    render();
  }
  update();
  return { ...lifecycle(root, mount, [() => {
    if (panel.matches(":popover-open")) panel.hidePopover();
    for (const cleanup of [...cleanups, ...rowCleanups].splice(0)) cleanup();
  }]), trigger, panel, update };
}
export {
  createCheckbox,
  createCheckboxGroup,
  createChoiceGroup,
  createFormField,
  createInputWithAction,
  createRadioGroup,
  createSelect,
  createSelectPanel,
  createSwitch,
  createTextInput,
  createTextarea
};
