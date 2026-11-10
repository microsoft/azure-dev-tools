// packages/canvas-toolkit/src/ui/component-helpers.mjs
var sequence = 0;
var id = () => `canvas-control-${++sequence}`;
var text = (value) => value == null ? "" : String(value);
function label(value, name = "label") {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${name} is required.`);
  return value;
}
function callback(value, name = "callback") {
  if (value !== void 0 && typeof value !== "function") throw new TypeError(`${name} must be a function.`);
}
function node(document, tag, className = "", content2) {
  if (!document?.createElement) throw new TypeError("A document is required.");
  const element = document.createElement(tag);
  element.className = className;
  if (content2 !== void 0) element.textContent = text(content2);
  return element;
}
function content(target, value) {
  if (value?.nodeType) {
    if (value.ownerDocument !== target.ownerDocument) throw new TypeError("Content must belong to the supplied document.");
    if (target.childNodes.length !== 1 || target.firstChild !== value) target.replaceChildren(value);
  } else target.textContent = text(value);
}
function visibleText(target, value) {
  target.textContent = text(value);
  target.hidden = !value;
}
function listen(cleanups, element, event, handler, options) {
  element.addEventListener(event, handler, options);
  cleanups.push(() => element.removeEventListener(event, handler, options));
}
function lifecycle(element, mount, cleanups = []) {
  if (mount !== void 0) {
    if (typeof mount?.append !== "function") throw new TypeError("mount must be appendable.");
    mount.append(element);
  }
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    for (const cleanup of cleanups.splice(0)) cleanup();
    element.remove();
    element.replaceChildren();
  };
  return { element, dispose, destroy: dispose, get disposed() {
    return disposed;
  } };
}
function button(document, value, handler, cleanups = []) {
  const control = node(document, "button", "secondary-button", label(value));
  control.type = "button";
  if (handler) listen(cleanups, control, "click", handler);
  return control;
}
function items(values) {
  if (!Array.isArray(values)) throw new TypeError("items must be an array.");
  const seen = /* @__PURE__ */ new Set();
  for (const value of values) {
    label(value?.id, "item.id");
    label(value.label);
    if (seen.has(value.id)) throw new TypeError(`Duplicate item id: ${value.id}`);
    seen.add(value.id);
  }
  return values;
}
function actions(document, target, values = [], cleanups = []) {
  if (!Array.isArray(values)) throw new TypeError("actions must be an array.");
  target.replaceChildren(...values.map((value) => {
    callback(value.onClick);
    const control = button(document, value.label, value.onClick, cleanups);
    control.disabled = Boolean(value.disabled);
    if (value.primary) control.className = "primary-button";
    return control;
  }));
  target.hidden = values.length === 0;
}
function safeHref(value) {
  if (typeof value !== "string" || !value.trim() || /[\u0000-\u0020\\]/.test(value) || value.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) {
    throw new TypeError("href must be an HTTP(S) or relative URL.");
  }
  return value;
}
function observeWidth(element, handler, cleanups) {
  const view = element.ownerDocument.defaultView;
  const measure = () => handler(element.getBoundingClientRect().width);
  const observer = view?.ResizeObserver ? new view.ResizeObserver(measure) : void 0;
  observer?.observe(element);
  cleanups.push(() => observer?.disconnect());
  measure();
}
export {
  actions,
  button,
  callback,
  content,
  id,
  items,
  label,
  lifecycle,
  listen,
  node,
  observeWidth,
  safeHref,
  text,
  visibleText
};
