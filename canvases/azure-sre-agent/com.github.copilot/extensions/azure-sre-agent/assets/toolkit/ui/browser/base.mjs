// packages/canvas-toolkit/src/ui/browser/base.mjs
import { a as cc, b as em, d as T, e as S, f as tm, g as om, h as rm } from "./react-runtime.mjs";
var $c = cc((Qn) => {
  "use strict";
  var Cm = Symbol.for("react.transitional.element"), Tm = Symbol.for("react.fragment");
  function Wc(e, t, o) {
    var r = null;
    if (o !== void 0 && (r = "" + o), t.key !== void 0 && (r = "" + t.key), "key" in t) {
      o = {};
      for (var n in t) n !== "key" && (o[n] = t[n]);
    } else o = t;
    return t = o.ref, { $$typeof: Cm, type: e, key: r, ref: t !== void 0 ? t : null, props: o };
  }
  Qn.Fragment = Tm;
  Qn.jsx = Wc;
  Qn.jsxs = Wc;
});
var Yc = cc((Kh, qc) => {
  "use strict";
  qc.exports = $c();
});
var q = T(S(), 1);
var J = T(S(), 1);
var P = {};
em(P, { always: () => dc, optional: () => nm, resolveShorthand: () => pc });
var uc = T(S(), 1);
var Ao = Symbol.for("fui.slotRenderFunction");
var Ge = Symbol.for("fui.slotElementType");
var wo = Symbol.for("fui.slotClassNameProp");
function dc(e, t) {
  let { defaultProps: o, elementType: r } = t, n = pc(e), s = { ...o, ...n, [Ge]: r, [wo]: n?.className || o?.className };
  return n && typeof n.children == "function" && (s[Ao] = n.children, s.children = o?.children), s;
}
function nm(e, t) {
  if (!(e === null || e === void 0 && !t.renderByDefault)) return dc(e, t);
}
function pc(e) {
  return typeof e == "string" || typeof e == "number" || sm(e) || uc.isValidElement(e) ? { children: e } : e;
}
var sm = (e) => typeof e == "object" && e !== null && Symbol.iterator in e;
var mc = T(S(), 1);
function Zn(e) {
  return e !== null && typeof e == "object" && !Array.isArray(e) && !mc.isValidElement(e);
}
function qo(e) {
  return !!e?.hasOwnProperty(Ge);
}
var ae = (...e) => {
  let t = {};
  for (let o of e) {
    let r = Array.isArray(o) ? o : Object.keys(o);
    for (let n of r) t[n] = 1;
  }
  return t;
};
var am = ae(["onAuxClick", "onAnimationEnd", "onAnimationStart", "onCopy", "onCut", "onPaste", "onCompositionEnd", "onCompositionStart", "onCompositionUpdate", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onInput", "onSubmit", "onLoad", "onError", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyUp", "onAbort", "onCanPlay", "onCanPlayThrough", "onDurationChange", "onEmptied", "onEncrypted", "onEnded", "onLoadedData", "onLoadedMetadata", "onLoadStart", "onPause", "onPlay", "onPlaying", "onProgress", "onRateChange", "onSeeked", "onSeeking", "onStalled", "onSuspend", "onTimeUpdate", "onVolumeChange", "onWaiting", "onClick", "onClickCapture", "onContextMenu", "onDoubleClick", "onDrag", "onDragEnd", "onDragEnter", "onDragExit", "onDragLeave", "onDragOver", "onDragStart", "onDrop", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseOut", "onMouseOver", "onMouseUp", "onMouseUpCapture", "onSelect", "onTouchCancel", "onTouchEnd", "onTouchMove", "onTouchStart", "onScroll", "onWheel", "onPointerCancel", "onPointerDown", "onPointerEnter", "onPointerLeave", "onPointerMove", "onPointerOut", "onPointerOver", "onPointerUp", "onGotPointerCapture", "onLostPointerCapture"]);
var im = ae(["accessKey", "children", "className", "contentEditable", "dir", "draggable", "hidden", "htmlFor", "id", "lang", "popover", "focusgroup", "focusgroupstart", "ref", "role", "style", "tabIndex", "title", "translate", "spellCheck", "name"]);
var lm = ae(["itemID", "itemProp", "itemRef", "itemScope", "itemType"]);
var ue = ae(im, am, lm);
var fc = ae(ue, ["form"]);
var _i = ae(ue, ["height", "loop", "muted", "preload", "src", "width"]);
var bc = ae(_i, ["poster"]);
var hc = ae(ue, ["start"]);
var xc = ae(ue, ["value"]);
var vc = ae(ue, ["download", "href", "hrefLang", "media", "referrerPolicy", "rel", "target", "type"]);
var gc = ae(ue, ["dateTime"]);
var Yo = ae(ue, ["autoFocus", "disabled", "form", "formAction", "formEncType", "formMethod", "formNoValidate", "formTarget", "popoverTarget", "popoverTargetAction", "type", "value"]);
var Cc = ae(Yo, ["accept", "alt", "autoCorrect", "autoCapitalize", "autoComplete", "checked", "dirname", "form", "height", "inputMode", "list", "max", "maxLength", "min", "minLength", "multiple", "pattern", "placeholder", "readOnly", "required", "src", "step", "size", "type", "value", "width"]);
var Tc = ae(Yo, ["autoCapitalize", "cols", "dirname", "form", "maxLength", "placeholder", "readOnly", "required", "rows", "wrap"]);
var yc = ae(Yo, ["form", "multiple", "required"]);
var Sc = ae(ue, ["selected", "value"]);
var Ic = ae(ue, ["cellPadding", "cellSpacing"]);
var Mc = ue;
var Rc = ae(ue, ["colSpan", "rowSpan", "scope"]);
var _c = ae(ue, ["colSpan", "headers", "rowSpan", "scope"]);
var Pc = ae(ue, ["span"]);
var kc = ae(ue, ["span"]);
var Ac = ae(ue, ["disabled", "form"]);
var wc = ae(ue, ["acceptCharset", "action", "encType", "encType", "method", "noValidate", "target"]);
var Ec = ae(ue, ["allow", "allowFullScreen", "allowPaymentRequest", "allowTransparency", "csp", "height", "importance", "referrerPolicy", "sandbox", "src", "srcDoc", "width"]);
var Nc = ae(ue, ["alt", "crossOrigin", "height", "loading", "src", "srcSet", "useMap", "width"]);
var Dc = ae(ue, ["open", "onCancel", "onClose"]);
function Fc(e, t, o) {
  let r = Array.isArray(t), n = {}, s = Object.keys(e);
  for (let a of s) {
    let i = !r && Object.prototype.hasOwnProperty.call(t, a) || r && t.indexOf(a) >= 0 || a.indexOf("data-") === 0 || a.indexOf("aria-") === 0;
    a !== "__proto__" && i && (!o || o?.indexOf(a) === -1) && (n[a] = e[a]);
  }
  return n;
}
var Lc = { label: fc, audio: _i, video: bc, ol: hc, li: xc, a: vc, button: Yo, input: Cc, textarea: Tc, select: yc, option: Sc, table: Ic, tr: Mc, th: Rc, td: _c, colGroup: Pc, col: kc, fieldset: Ac, form: wc, iframe: Ec, img: Nc, time: gc, dialog: Dc };
function Xo(e, t, o) {
  let r = e && Object.prototype.hasOwnProperty.call(Lc, e) ? Lc[e] : ue;
  return r.as = 1, Fc(t, r, o);
}
var Te = ({ primarySlotTagName: e, props: t, excludedPropNames: o }) => ({ root: { style: t.style, className: t.className }, primary: Xo(e, t, [...o || [], "style", "className"]) });
var Q = (e, t, o) => {
  var r;
  return Xo((r = t.as) !== null && r !== void 0 ? r : e, t, o);
};
var zt = T(S(), 1);
function Bc(e, t) {
  let o = zt.useRef(void 0), r = zt.useCallback((s, a) => (o.current !== void 0 && t(o.current), o.current = e(s, a), o.current), [t, e]), n = zt.useCallback(() => {
    o.current !== void 0 && (t(o.current), o.current = void 0);
  }, [t]);
  return zt.useEffect(() => n, [n]), [r, n];
}
var Un = T(S(), 1);
var Oc = Un.createContext(void 0);
var cm = { targetDocument: typeof document == "object" ? document : void 0, dir: "ltr" };
var Jo = Oc.Provider;
function ee() {
  var e;
  return (e = Un.useContext(Oc)) !== null && e !== void 0 ? e : cm;
}
var rt = T(S(), 1);
function um(e) {
  return typeof e == "function";
}
var te = (e) => {
  "use no memo";
  let [t, o] = rt.useState(() => e.defaultState === void 0 ? e.initialState : dm(e.defaultState) ? e.defaultState() : e.defaultState), r = rt.useRef(e.state);
  rt.useEffect(() => {
    r.current = e.state;
  }, [e.state]);
  let n = rt.useCallback((s) => {
    um(s) && s(r.current);
  }, []);
  return pm(e.state) ? [e.state, n] : [t, o];
};
function dm(e) {
  return typeof e == "function";
}
var pm = (e) => {
  let [t] = rt.useState(() => e !== void 0);
  return t;
};
var $n = T(S(), 1);
var Wn = T(S(), 1);
function Eo() {
  return typeof window < "u" && !!(window.document && window.document.createElement);
}
var nt = T(S(), 1);
var jn = { current: 0 };
var Vc = nt.createContext(void 0);
function Kn() {
  var e;
  return (e = nt.useContext(Vc)) !== null && e !== void 0 ? e : jn;
}
function zn() {
  let e = Kn() !== jn, [t, o] = nt.useState(e);
  return Eo() && e && nt.useLayoutEffect(() => {
    o(false);
  }, []), t;
}
var le = Eo() ? Wn.useLayoutEffect : Wn.useEffect;
var A = (e) => {
  let t = $n.useRef(() => {
    throw new Error("Cannot call an event handler while rendering");
  });
  return le(() => {
    t.current = e;
  }, [e]), $n.useCallback((...o) => {
    let r = t.current;
    return r(...o);
  }, [t]);
};
var qn = T(S(), 1);
function Yn() {
  let e = qn.useRef(true);
  return qn.useEffect(() => {
    e.current && (e.current = false);
  }, []), e.current;
}
var st = T(S(), 1);
var Hc = st.createContext(void 0);
var Gc = Hc.Provider;
function fm() {
  return st.useContext(Hc) || "";
}
function ne(e = "fui-", t) {
  let o = Kn(), r = fm(), n = st.useId;
  if (n) {
    let s = n(), a = st.useMemo(() => s.replace(/:/g, ""), [s]);
    return t || `${r}${e}${a}`;
  }
  return st.useMemo(() => t || `${r}${e}${++o.current}`, [r, e, t, o]);
}
var Zc = T(S(), 1);
function X(...e) {
  let t = Zc.useCallback((o) => {
    t.current = o;
    for (let r of e) typeof r == "function" ? r(o) : r && (r.current = o);
  }, [...e]);
  return t;
}
var bm = (e) => -1;
var hm = (e) => {
};
function Ze() {
  let { targetDocument: e } = ee(), t = e?.defaultView, o = t ? t.setTimeout : bm, r = t ? t.clearTimeout : hm;
  return Bc(o, r);
}
var Qo = (e, t, o) => Math.max(t, Math.min(o, e || 0));
var Xn = (e, t, o) => o === t ? 0 : (e - t) / (o - t) * 100;
var Uc = T(S(), 1);
var vm = parseInt(Uc.version, 10) >= 19;
function Ue(e) {
  if (e) return vm ? e.props.ref : e.ref;
}
function z(e, t) {
  return (...o) => {
    e?.(...o), t?.(...o);
  };
}
function Be(e, t) {
  var o;
  let r = e;
  var n;
  return !!(!(r == null || (o = r.ownerDocument) === null || o === void 0) && o.defaultView && r instanceof r.ownerDocument.defaultView[(n = t?.constructorName) !== null && n !== void 0 ? n : "HTMLElement"]);
}
var Wt = T(S(), 1);
function er(e) {
  return !!e.type.isFluentTriggerComponent;
}
function je(e, t) {
  return typeof e == "function" ? e(t) : e ? jc(e, t) : e || null;
}
function jc(e, t) {
  if (!Wt.isValidElement(e) || e.type === Wt.Fragment) throw new Error("A trigger element must be a single element for this component. Please ensure that you're not using React Fragments.");
  if (er(e)) {
    let o = jc(e.props.children, t);
    return Wt.cloneElement(e, void 0, o);
  } else return Wt.cloneElement(e, t);
}
var Kc = T(S(), 1);
function Oe(e) {
  return Kc.isValidElement(e) ? er(e) ? Oe(e.props.children) : e : null;
}
function zc(e, t) {
  return { ...t, [Ge]: e };
}
function Pi(e, t) {
  return function(r, n, s, a, i) {
    return qo(n) ? t(zc(r, n), null, s, a, i) : qo(r) ? t(r, n, s, a, i) : e(r, n, s, a, i);
  };
}
var Xc = T(S(), 1);
function Jn(e) {
  let { as: t, [wo]: o, [Ge]: r, [Ao]: n, ...s } = e, a = s, i = typeof r == "string" ? t ?? r : r;
  return typeof i != "string" && t && (a.as = t), { elementType: i, props: a, renderFunction: n };
}
var ym = T(Yc(), 1);
var Ke = ym;
var Jc = (e, t, o) => {
  let { elementType: r, renderFunction: n, props: s } = Jn(e), a = { ...s, ...t };
  return n ? Ke.jsx(Xc.Fragment, { children: n(r, a) }, o) : Ke.jsx(r, a, o);
};
var ki = T(S(), 1);
var Qc = (e, t, o) => {
  let { elementType: r, renderFunction: n, props: s } = Jn(e), a = { ...s, ...t };
  return n ? Ke.jsx(ki.Fragment, { children: n(r, { ...a, children: Ke.jsxs(ki.Fragment, { children: a.children }, void 0) }) }, o) : Ke.jsxs(r, a, o);
};
var tr = T(S(), 1);
var R = Pi(Ke.jsx, Jc);
var $ = Pi(Ke.jsxs, Qc);
var Ai = (e, t) => R(Jo, { value: t.provider, children: R(e.root, {}) });
var wi = T(S(), 1);
var Ei = (e, t) => {
  let o = ee(), { children: r, dir: n, targetDocument: s } = e;
  return { dir: n || o.dir, targetDocument: s || o.targetDocument, components: { root: wi.Fragment }, root: P.always({ children: r }, { elementType: wi.Fragment }) };
};
var ze = (e, t, o) => {
  e.addEventListener(t, o, true);
};
var Ae = (e, t, o) => {
  e.removeEventListener(t, o, true);
};
var We = "keyborg:focusin";
var Sm = "keyborg:focusout";
function Im(e) {
  let t = e, o = t.document, r = t.HTMLElement.prototype, n = Object.getOwnPropertyDescriptor(r, "focus");
  if (n?.value?.__keyborgNativeFocus) return;
  u.__keyborgNativeFocus = m, u.__keyborgFocusDescriptor = n, Object.defineProperty(r, "focus", { configurable: n?.configurable ?? true, enumerable: n?.enumerable ?? false, writable: true, value: u });
  let s = /* @__PURE__ */ new Set(), a = (d) => {
    let f = d.target;
    if (!f) return;
    let g = new CustomEvent(Sm, { cancelable: true, bubbles: true, composed: true, detail: { originalEvent: d } });
    f.dispatchEvent(g);
  }, i = (d) => {
    let f = d.target;
    if (!f) return;
    let g = d.composedPath()[0], y = /* @__PURE__ */ new Set();
    for (; g; ) g.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? (y.add(g), g = g.host) : g = g.parentNode;
    for (let x of s) {
      let v = x.deref();
      (!v || !y.has(v)) && (s.delete(x), v && (Ae(v, "focusin", i), Ae(v, "focusout", a)));
    }
    l(f, d.relatedTarget || void 0);
  }, l = (d, f, g) => {
    let y = d.shadowRoot;
    if (y) {
      for (let C of s) if (C.deref() === y) return;
      ze(y, "focusin", i), ze(y, "focusout", a), s.add(new WeakRef(y));
      return;
    }
    let x = { relatedTarget: f, originalEvent: g }, v = new CustomEvent(We, { cancelable: true, bubbles: true, composed: true, detail: x });
    x.isFocusedProgrammatically = d === c[3]?.deref(), c[3] = void 0, d.dispatchEvent(v);
  }, c = [i, a, s];
  t.__keyborgData = c, ze(o, "focusin", i), ze(o, "focusout", a);
  function u() {
    let d = t.__keyborgData;
    return d && (d[3] = new WeakRef(this)), m.apply(this, arguments);
  }
  function m() {
    let d = n?.get ? n.get.call(this) : n?.value;
    if (typeof d != "function") throw new TypeError("HTMLElement.prototype.focus is not callable");
    return d.apply(this, arguments);
  }
  let h = o.activeElement;
  for (; h && h.shadowRoot; ) l(h), h = h.shadowRoot.activeElement;
}
function Mm(e) {
  let t = e, o = t.HTMLElement.prototype, r = Object.getOwnPropertyDescriptor(o, "focus")?.value, n = r?.__keyborgFocusDescriptor, s = t.__keyborgData;
  if (s) {
    let a = t.document;
    Ae(a, "focusin", s[0]), Ae(a, "focusout", s[1]);
    for (let i of s[2]) {
      let l = i.deref();
      l && (Ae(l, "focusin", s[0]), Ae(l, "focusout", s[1]));
    }
    s[2].clear(), delete t.__keyborgData;
  }
  r?.__keyborgNativeFocus && (n ? Object.defineProperty(o, "focus", n) : delete o.focus);
}
var Rm = 0;
function _m(e) {
  let t = e, o = false, r, n = () => {
    let d = t?.__keyborg?.refs;
    if (d) for (let f of Object.keys(d)) d[f]._cb.forEach((g) => g(o));
  }, s = (d) => {
    o !== d && (o = d, n());
  }, a = (d) => {
    if (d.key === "Tab") return true;
    let f = t?.document.activeElement;
    return !(f && (f.tagName === "INPUT" || f.tagName === "TEXTAREA" || f.isContentEditable));
  }, i = (d) => {
    if (r || o) return;
    let f = d.detail;
    f.relatedTarget && (f.isFocusedProgrammatically || f.isFocusedProgrammatically === void 0 || s(true));
  }, l = () => {
    t && (r && t.clearTimeout(r), r = t.setTimeout(() => {
      r = void 0;
    }, 1e3)), s(false);
  }, c = (d) => {
    d.buttons === 0 || d.clientX === 0 && d.clientY === 0 && d.screenX === 0 && d.screenY === 0 || l();
  }, u = (d) => {
    !o && a(d) && s(true);
  }, m = e.document;
  return ze(m, We, i), ze(m, "mousedown", c), ze(e, "keydown", u), ze(m, "touchstart", l), ze(m, "touchend", l), ze(m, "touchcancel", l), Im(e), { dispose: () => {
    if (!t) return;
    r && (t.clearTimeout(r), r = void 0), Mm(t);
    let d = t.document;
    Ae(d, We, i), Ae(d, "mousedown", c), Ae(t, "keydown", u), Ae(d, "touchstart", l), Ae(d, "touchend", l), Ae(d, "touchcancel", l), t = void 0;
  }, get isNavigatingWithKeyboard() {
    return o;
  }, set isNavigatingWithKeyboard(d) {
    s(d);
  } };
}
function es(e) {
  let t = e, o = "k" + ++Rm, r = t, n, s = [], a = t.__keyborg;
  a ? n = a.core : n = _m(t);
  let i = { isNavigatingWithKeyboard() {
    return !!n?.isNavigatingWithKeyboard;
  }, subscribe(l) {
    s.push(l);
  }, unsubscribe(l) {
    let c = s.indexOf(l);
    c >= 0 && s.splice(c, 1);
  }, setVal(l) {
    n && (n.isNavigatingWithKeyboard = l);
  }, _cb: s, dispose() {
    let l = r?.__keyborg;
    l?.refs[o] && (delete l.refs[o], Object.keys(l.refs).length === 0 && (l.core.dispose(), delete r.__keyborg)), s.length = 0, n = void 0, r = void 0;
  } };
  return a ? a.refs[o] = i : t.__keyborg = { core: n, refs: { [o]: i } }, i;
}
function ts(e) {
  e.dispose();
}
var Pm = "data-keyboard-nav";
var dx = `:global([${Pm}])`;
var Ni = "data-fui-focus-within";
var os = T(S(), 1);
function ou(e, t) {
  let o = es(t);
  o.subscribe((s) => {
    s || eu(e);
  });
  let r = (s) => {
    o.isNavigatingWithKeyboard() && tu(s.target) && km(e);
  }, n = (s) => {
    (!s.relatedTarget || tu(s.relatedTarget) && !e.contains(s.relatedTarget)) && eu(e);
  };
  return e.addEventListener(We, r), e.addEventListener("focusout", n), () => {
    e.removeEventListener(We, r), e.removeEventListener("focusout", n), ts(o);
  };
}
function km(e) {
  e.setAttribute(Ni, "");
}
function eu(e) {
  e.removeAttribute(Ni);
}
function tu(e) {
  return e ? !!(e && typeof e == "object" && "classList" in e && "contains" in e) : false;
}
function $e() {
  let { targetDocument: e } = ee(), t = os.useRef(null);
  return os.useEffect(() => {
    if (e?.defaultView && t.current) return ou(t.current, e.defaultView);
  }, [t, e]), t;
}
var ru = T(S(), 1);
var rs = T(S(), 1);
function ns() {
  let { targetDocument: e } = ee(), t = rs.useRef(null);
  return rs.useEffect(() => {
    let o = e?.defaultView;
    if (o) {
      let r = es(o);
      return t.current = r, () => {
        ts(r), t.current = null;
      };
    }
  }, [e]), t;
}
function No(e) {
  let t = ns(), o = A(e);
  ru.useEffect(() => {
    let r = t.current;
    if (r) {
      let n = (s) => {
        o(s);
      };
      return r.subscribe(n), n(r.isNavigatingWithKeyboard()), () => {
        r.unsubscribe(n);
      };
    }
  }, [t, o]);
}
var nu = T(S(), 1);
function ss() {
  let e = ns();
  return nu.useCallback(() => {
    var t, o;
    return (o = (t = e.current) === null || t === void 0 ? void 0 : t.isNavigatingWithKeyboard()) !== null && o !== void 0 ? o : false;
  }, [e]);
}
var or = T(S(), 1);
function rr(e) {
  let { applyStylesToPortals: t, customStyleHooks_unstable: o, dir: r, root: n, targetDocument: s, theme: a, themeClassName: i, overrides_unstable: l } = e, c = or.useMemo(() => ({ dir: r, targetDocument: s }), [r, s]), [u] = or.useState(() => ({})), m = or.useMemo(() => ({ textDirection: r }), [r]);
  return { customStyleHooks_unstable: o, overrides_unstable: l, provider: c, textDirection: r, iconDirection: m, tooltip: u, theme: a, themeClassName: t ? n.className : i };
}
var Di = rr;
var Fi = T(S(), 1);
function Z(e, t, o, r) {
  let n = r ? Fi.forwardRef((s, a) => {
    let i = t(s, a);
    return o(i, r(i));
  }) : Fi.forwardRef((s, a) => o(t(s, a)));
  return n.displayName = e, n;
}
var as = Z("Provider", Ei, Ai, Di);
var fe = (e) => {
  let { iconOnly: t, iconPosition: o } = e;
  return $(e.root, { children: [o !== "after" && e.icon && R(e.icon, {}), !t && e.root.children, o === "after" && e.icon && R(e.icon, {})] });
};
var qe = "Enter";
var Do = "ArrowDown";
var nr = "ArrowLeft";
var sr = "ArrowRight";
var ar = "ArrowUp";
var Li = "Home";
var Bi = "PageDown";
var Oi = "PageUp";
var at = "Escape";
function Ee(e, t) {
  let { disabled: o, disabledFocusable: r = false, ["aria-disabled"]: n, onClick: s, onKeyDown: a, onKeyUp: i, ...l } = t ?? {}, c = typeof n == "string" ? n === "true" : n, u = o || r || c, m = A((f) => {
    u ? (f.preventDefault(), f.stopPropagation()) : s?.(f);
  }), h = A((f) => {
    if (a?.(f), f.isDefaultPrevented()) return;
    let g = f.key;
    if (u && (g === qe || g === " ")) {
      f.preventDefault(), f.stopPropagation();
      return;
    }
    if (g === " ") {
      f.preventDefault();
      return;
    } else g === qe && (f.preventDefault(), f.currentTarget.click());
  }), d = A((f) => {
    if (i?.(f), f.isDefaultPrevented()) return;
    let g = f.key;
    if (u && (g === qe || g === " ")) {
      f.preventDefault(), f.stopPropagation();
      return;
    }
    g === " " && (f.preventDefault(), f.currentTarget.click());
  });
  if (e === "button" || e === void 0) return { ...l, disabled: o && !r, "aria-disabled": r ? true : c, onClick: r ? void 0 : m, onKeyUp: r ? void 0 : i, onKeyDown: r ? void 0 : a };
  {
    let f = !!l.href, g = f ? void 0 : "button";
    !g && u && (g = "link");
    let y = { role: g, tabIndex: r || !f && !o ? 0 : void 0, ...l, onClick: m, onKeyUp: d, onKeyDown: h, "aria-disabled": u };
    return e === "a" && u && (y.href = void 0), y;
  }
}
var ir = T(S(), 1);
var Re = () => {
};
var Om = { controller: { active: Re, blur: Re, find: Re, first: Re, focus: Re, focusLastActive: Re, scrollActiveIntoView: Re, last: Re, next: Re, prev: Re, showAttributes: Re, hideAttributes: Re, showFocusVisibleAttributes: Re, hideFocusVisibleAttributes: Re } };
var Vi = ir.createContext(void 0);
var ls = Vi.Provider;
var Fo = () => {
  var e;
  return (e = ir.useContext(Vi)) !== null && e !== void 0 ? e : Om;
};
var cs = () => !!ir.useContext(Vi);
var be = T(S(), 1);
var xt = T(S(), 1);
function au(e) {
  let { matchOption: t } = e, { targetDocument: o } = ee(), r = xt.useRef(null), n = xt.useRef(null), s = xt.useCallback((l) => Be(l) && t(l) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP, [t]), a = xt.useCallback((l) => {
    l && o ? (n.current = l, r.current = o.createTreeWalker(l, NodeFilter.SHOW_ELEMENT, s)) : (n.current = null, r.current = null);
  }, [o, s]);
  return { optionWalker: xt.useMemo(() => ({ first: () => !r.current || !n.current ? null : (r.current.currentNode = n.current, r.current.firstChild()), last: () => !r.current || !n.current ? null : (r.current.currentNode = n.current, r.current.lastChild()), next: () => r.current ? r.current.nextNode() : null, prev: () => r.current ? r.current.previousNode() : null, find: (l, c) => {
    if (!r.current || !n.current) return null;
    let u = c ? o?.getElementById(c) : null;
    r.current.currentNode = u ?? n.current;
    let m = r.current.currentNode;
    for (; m && !l(m.id); ) m = r.current.nextNode();
    return m;
  }, setCurrent: (l) => {
    r.current && (r.current.currentNode = l);
  } }), [o]), listboxCallbackRef: a };
}
var Hi = "data-activedescendant";
var vt = "data-activedescendant-focusvisible";
var Gi = (e) => {
  if (!e) return;
  let t = iu(e.parentElement);
  if (!t) return;
  let { offsetHeight: o } = e, r = lu(e, t), { scrollMarginTop: n, scrollMarginBottom: s } = Vm(e), { offsetHeight: a, scrollTop: i } = t, l = r - n < i, c = r + o + s > i + a, u = 2;
  l ? t.scrollTo(0, r - n - u) : c && t.scrollTo(0, r + o + s - a + u);
};
var iu = (e) => e ? e.scrollHeight > e.offsetHeight ? e : iu(e.parentElement) : null;
var lu = (e, t) => !e || e === t ? 0 : e.contains(t) ? t.offsetTop * -1 : e.offsetTop + lu(e.offsetParent, t);
var Vm = (e) => {
  var t;
  let o = (t = e.ownerDocument) === null || t === void 0 ? void 0 : t.defaultView;
  if (!o) return { scrollMarginTop: 0, scrollMarginBottom: 0 };
  let r = o.getComputedStyle(e);
  var n;
  let s = (n = us(r.scrollMarginTop)) !== null && n !== void 0 ? n : us(r.scrollMarginBlockStart);
  var a;
  let i = (a = us(r.scrollMarginBottom)) !== null && a !== void 0 ? a : us(r.scrollMarginBlockEnd);
  return { scrollMarginTop: s, scrollMarginBottom: i };
};
var us = (e) => e ? parseInt(e, 10) : 0;
var cu = (e) => new CustomEvent("activedescendantchange", { bubbles: true, cancelable: false, composed: true, detail: e });
function ds(e) {
  let { imperativeRef: t, matchOption: o } = e, r = be.useRef(false), n = be.useRef(true), s = be.useRef(null), a = be.useRef(null), i = be.useRef(null), l = be.useRef(true), c = be.useCallback(() => {
    var b;
    (b = i.current) === null || b === void 0 || b.removeAttribute("aria-activedescendant");
  }, []), u = be.useCallback((b) => {
    if (b && (s.current = b), l.current && s.current) {
      var _;
      (_ = i.current) === null || _ === void 0 || _.setAttribute("aria-activedescendant", s.current);
    }
  }, []);
  No((b) => {
    r.current = b;
    let _ = g();
    _ && (b && n.current ? _.setAttribute(vt, "") : _.removeAttribute(vt));
  });
  let m = A(o), h = be.useRef(null), { optionWalker: d, listboxCallbackRef: f } = au({ matchOption: m }), g = be.useCallback(() => {
    var b;
    return (b = h.current) === null || b === void 0 ? void 0 : b.querySelector(`#${s.current}`);
  }, [h]), y = be.useCallback((b) => {
    n.current = b;
    let _ = g();
    _ && (b && r.current ? _.setAttribute(vt, "") : _.removeAttribute(vt));
  }, [g]), x = be.useCallback(() => {
    let b = g();
    b && (b.removeAttribute(Hi), b.removeAttribute(vt)), c(), a.current = s.current, s.current = null;
    var _;
    return (_ = b?.id) !== null && _ !== void 0 ? _ : null;
  }, [g, c]), v = be.useCallback((b) => {
    if (!b) return;
    let _ = x();
    Gi(b), u(b.id), b.setAttribute(Hi, ""), r.current && n.current && b.setAttribute(vt, "");
    let I = cu({ id: b.id, previousId: _ });
    b.dispatchEvent(I);
  }, [x, u]), C = be.useMemo(() => ({ first: ({ passive: b } = {}) => {
    let _ = d.first();
    return b || v(_), _?.id;
  }, last: ({ passive: b } = {}) => {
    let _ = d.last();
    return b || v(_), _?.id;
  }, next: ({ passive: b } = {}) => {
    let _ = g();
    if (!_) return;
    d.setCurrent(_);
    let I = d.next();
    return b || v(I), I?.id;
  }, prev: ({ passive: b } = {}) => {
    let _ = g();
    if (!_) return;
    d.setCurrent(_);
    let I = d.prev();
    return b || v(I), I?.id;
  }, blur: () => {
    x();
  }, active: () => {
    var b;
    return (b = g()) === null || b === void 0 ? void 0 : b.id;
  }, focus: (b) => {
    if (!h.current) return;
    let _ = h.current.querySelector(`#${b}`);
    _ && v(_);
  }, focusLastActive: () => {
    if (!h.current || !a.current) return;
    let b = h.current.querySelector(`#${a.current}`);
    if (b) return v(b), true;
  }, find(b, { passive: _, startFrom: I } = {}) {
    let L = d.find(b, I);
    return _ || v(L), L?.id;
  }, scrollActiveIntoView: () => {
    if (!h.current) return;
    let b = g();
    b && Gi(b);
  }, showAttributes() {
    l.current = true, u();
  }, hideAttributes() {
    l.current = false, c();
  }, showFocusVisibleAttributes() {
    y(true);
  }, hideFocusVisibleAttributes() {
    y(false);
  } }), [d, h, u, c, v, x, g, y]);
  return be.useImperativeHandle(t, () => C), { listboxRef: X(h, f), activeParentRef: i, controller: C };
}
var it = (e, t) => {
  var o, r;
  let { icon: n, iconPosition: s = "before", ...a } = e, i = P.optional(n, { elementType: "span" });
  return { disabled: (o = e.disabled) !== null && o !== void 0 ? o : false, disabledFocusable: (r = e.disabledFocusable) !== null && r !== void 0 ? r : false, iconPosition: s, iconOnly: !!(i?.children && !e.children), components: { root: "button", icon: "span" }, root: P.always(Ee(a.as, a), { elementType: "button", defaultProps: { ref: t, type: e.as !== "a" ? "button" : void 0 } }), icon: i };
};
var uu = T(S(), 1);
function du(e, t) {
  let { checked: o, defaultChecked: r, disabled: n, disabledFocusable: s, isAccessible: a = false } = e, { onClick: i, role: l } = t.root, [c, u] = te({ state: o, defaultState: r, initialState: false }), m = l === "menuitemcheckbox" || l === "checkbox", h = uu.useCallback((d) => {
    if (!n && !s) {
      if (d.defaultPrevented) return;
      u(!c);
    }
  }, [c, n, s, u]);
  return { ...t, checked: c, isAccessible: a, root: { ...t.root, [m ? "aria-checked" : "aria-pressed"]: c, onClick: A(z(i, h)) } };
}
var lr = (e, t) => {
  let { checked: o = false, defaultChecked: r = false, isAccessible: n = false, ...s } = e, a = it(s, t);
  return du(e, a);
};
function N(e) {
  if (e === true || e === "true") return "";
  if (!(e === false || e === "false" || e === void 0)) return String(e);
}
var Ui = (e, t) => {
  let o = it(e, t);
  return o.root["data-disabled"] = N(o.disabled), o.root["data-disabled-focusable"] = N(o.disabledFocusable), o.root["data-icon-only"] = N(o.iconOnly), o.root["data-icon-position"] = o.icon ? o.iconPosition : void 0, o;
};
var ps = Z("Button", Ui, fe);
var ji = (e, t) => {
  let o = lr(e, t);
  return o.root["data-disabled"] = N(o.disabled), o.root["data-disabled-focusable"] = N(o.disabledFocusable), o.root["data-icon-only"] = N(o.iconOnly), o.root["data-checked"] = N(o.checked), o.root["data-icon-position"] = o.icon ? o.iconPosition : void 0, o;
};
var ms = Z("ToggleButton", ji, fe);
var fs = T(S(), 1);
var mu = fs.createContext(void 0);
var bs = mu.Provider;
var Ye = () => fs.useContext(mu);
var fu = T(S(), 1);
var hs = (e) => {
  var t, o, r, n;
  let { generatedControlId: s, orientation: a, required: i, size: l, validationState: c } = e, u = (t = e.label) === null || t === void 0 ? void 0 : t.htmlFor, m = (o = e.label) === null || o === void 0 ? void 0 : o.id, h = (r = e.validationMessage) === null || r === void 0 ? void 0 : r.id, d = (n = e.hint) === null || n === void 0 ? void 0 : n.id;
  return { field: fu.useMemo(() => ({ generatedControlId: s, hintId: d, labelFor: u, labelId: m, orientation: a, required: i, size: l, validationMessageId: h, validationState: c }), [s, d, u, m, a, i, l, h, c]) };
};
function ve(e, t) {
  return xs(Ye(), e, t);
}
function xs(e, t, o) {
  if (!e) return t;
  t = { ...t };
  let { generatedControlId: r, hintId: n, labelFor: s, labelId: a, required: i, validationMessageId: l, validationState: c } = e;
  if (r) {
    var u, m;
    (m = (u = t).id) !== null && m !== void 0 || (u.id = r);
  }
  if (a && (!o?.supportsLabelFor || s !== t.id)) {
    var h, d, f;
    (f = (h = t)[d = "aria-labelledby"]) !== null && f !== void 0 || (h[d] = a);
  }
  if ((l || n) && (t["aria-describedby"] = [l, n, t?.["aria-describedby"]].filter(Boolean).join(" ")), c === "error") {
    var g, y, x;
    (x = (g = t)[y = "aria-invalid"]) !== null && x !== void 0 || (g[y] = true);
  }
  if (i) if (o?.supportsRequired) {
    var v, C;
    (C = (v = t).required) !== null && C !== void 0 || (v.required = true);
  } else {
    var b, _, I;
    (I = (b = t)[_ = "aria-required"]) !== null && I !== void 0 || (b[_] = true);
  }
  if (o?.supportsSize) {
    var L, V;
    (V = (L = t).size) !== null && V !== void 0 || (L.size = e.size);
  }
  return t;
}
var $t = (e, t) => {
  let { children: o } = e;
  return typeof o == "function" && (o = o(xs(t.field) || {})), R(bs, { value: t?.field, children: $(e.root, { children: [e.label && R(e.label, {}), o, e.validationMessage && $(e.validationMessage, { children: [e.validationMessageIcon && R(e.validationMessageIcon, {}), e.validationMessage.children] }), e.hint && R(e.hint, {})] }) });
};
var cr = (e, t) => {
  let { children: o, required: r = false, validationState: n = e.validationMessage ? "error" : "none" } = e, s = ne("field-"), a = s + "__control", i = P.always(Q("div", { ...e, ref: t }, ["children"]), { elementType: "div" }), l = P.optional(e.label, { defaultProps: { htmlFor: a, id: s + "__label", required: r }, elementType: "label" }), c = P.optional(e.validationMessage, { defaultProps: { id: s + "__validationMessage", role: n === "error" || n === "warning" ? "alert" : void 0 }, elementType: "div" }), u = P.optional(e.hint, { defaultProps: { id: s + "__hint" }, elementType: "div" }), m = P.optional(e.validationMessageIcon, { renderByDefault: false, elementType: "span" });
  return { children: o, generatedControlId: a, required: r, validationState: n, components: { root: "div", label: "label", validationMessage: "div", validationMessageIcon: "span", hint: "div" }, root: i, label: l, validationMessageIcon: m, validationMessage: c, hint: u };
};
var ur = (e, t) => {
  let o = ve(e, { supportsLabelFor: true, supportsRequired: true }), [r, n] = te({ state: o.value, defaultState: o.defaultValue, initialState: "" }), s = Te({ props: o, primarySlotTagName: "input", excludedPropNames: ["onChange", "value", "defaultValue"] }), a = { components: { root: "span", input: "input", contentBefore: "span", contentAfter: "span" }, input: P.always(o.input, { defaultProps: { type: "text", ref: t, ...s.primary }, elementType: "input" }), contentAfter: P.optional(o.contentAfter, { elementType: "span" }), contentBefore: P.optional(o.contentBefore, { elementType: "span" }), root: P.always(o.root, { defaultProps: s.root, elementType: "span" }) };
  return a.input.value = r, a.input.onChange = A((i) => {
    var l;
    let c = i.target.value;
    (l = o.onChange) === null || l === void 0 || l.call(o, i, { value: c }), n(c);
  }), a;
};
var gt = (e) => $(e.root, { children: [e.contentBefore && R(e.contentBefore, {}), R(e.input, {}), e.contentAfter && R(e.contentAfter, {})] });
var vs = (e, t) => {
  let o = ur(e, t);
  return o.root["data-disabled"] = N(o.input.disabled), o.root["data-invalid"] = N(o.input["aria-invalid"]), o;
};
var Ct = (e) => R(e.root, { children: R(e.textarea, {}) });
var dr = (e, t) => {
  e = ve(e, { supportsLabelFor: true, supportsRequired: true });
  let { resize: o = "none", onChange: r } = e, [n, s] = te({ state: e.value, defaultState: e.defaultValue, initialState: void 0 }), a = Te({ props: e, primarySlotTagName: "textarea", excludedPropNames: ["onChange", "value", "defaultValue"] }), i = { resize: o, components: { root: "span", textarea: "textarea" }, textarea: P.always(e.textarea, { defaultProps: { ref: t, ...a.primary }, elementType: "textarea" }), root: P.always(e.root, { defaultProps: a.root, elementType: "span" }) };
  return i.textarea.value = n, i.textarea.onChange = A((l) => {
    let c = l.target.value;
    r?.(l, { value: c }), s(c);
  }), i;
};
var gs = (e, t) => {
  let o = dr(e, t);
  return o.root["data-disabled"] = N(o.textarea.disabled), o.root["data-invalid"] = N(o.textarea["aria-invalid"]), o.root["data-resize"] = o.resize, o;
};
var of = T(S(), 1);
var pr = (e, t) => {
  e = ve(e, { supportsLabelFor: true, supportsRequired: true });
  let { defaultValue: o, value: r, select: n, icon: s, root: a, onChange: i } = e, l = Te({ props: e, primarySlotTagName: "select", excludedPropNames: ["defaultValue", "onChange", "value"] }), c = { components: { root: "span", select: "select", icon: "span" }, select: P.always(n, { defaultProps: { defaultValue: o, value: r, ref: t, ...l.primary }, elementType: "select" }), icon: P.optional(s, { renderByDefault: true, elementType: "span" }), root: P.always(a, { defaultProps: l.root, elementType: "span" }) };
  return c.select.onChange = A((u) => {
    i?.(u, { value: u.target.value });
  }), c;
};
var qt = (e) => $(e.root, { children: [R(e.select, { children: e.select.children }), e.icon && R(e.icon, {})] });
var Ki = (e, t) => {
  let o = pr(e, t);
  return o.root["data-disabled"] = N(o.select.disabled), o.root["data-invalid"] = N(o.select["aria-invalid"]), o;
};
var Cs = Z("Select", Ki, qt);
var af = T(S(), 1);
var mr = (e, t) => {
  "use no memo";
  e = ve(e, { supportsLabelFor: true, supportsRequired: true });
  let { disabled: o = false, required: r, labelPosition: n = "after", onChange: s } = e, [a, i] = te({ defaultState: e.defaultChecked, state: e.checked, initialState: false }), l = Te({ props: e, primarySlotTagName: "input", excludedPropNames: ["checked", "defaultChecked", "onChange"] }), c = a === "mixed", u = ne("checkbox-", l.primary.id), m = { checked: a, disabled: o, labelPosition: n, components: { root: "span", input: "input", indicator: "div", label: "label" }, root: P.always(e.root, { defaultProps: { ref: $e(), ...l.root }, elementType: "span" }), input: P.always(e.input, { defaultProps: { type: "checkbox", id: u, ref: t, checked: a === true, ...l.primary }, elementType: "input" }), label: P.optional(e.label, { defaultProps: { htmlFor: u, disabled: o, required: r }, elementType: "label" }), indicator: P.optional(e.indicator, { renderByDefault: true, defaultProps: { "aria-hidden": true }, elementType: "div" }) };
  m.input.onChange = z(m.input.onChange, (d) => {
    let f = d.currentTarget.indeterminate ? "mixed" : d.currentTarget.checked;
    s?.(d, { checked: f }), i(f);
  });
  let h = X(m.input.ref);
  return m.input.ref = h, le(() => {
    h.current && (h.current.indeterminate = c);
  }, [h, c]), m;
};
var Tt = (e) => $(e.root, { children: [R(e.input, {}), e.labelPosition === "before" && e.label && R(e.label, {}), e.indicator && R(e.indicator, {}), e.labelPosition === "after" && e.label && R(e.label, {})] });
var Ts = (e, t) => {
  let o = mr(e, t);
  return o.root["data-disabled"] = N(o.disabled), o.root["data-checked"] = N(o.checked), o.root["data-label-position"] = o.labelPosition, o;
};
var df = T(S(), 1);
var fr = (e, t) => {
  e = ve(e, { supportsLabelFor: true, supportsRequired: true });
  let { checked: o, defaultChecked: r, disabled: n, disabledFocusable: s = false, labelPosition: a = "after", onChange: i, required: l } = e, c = Te({ props: e, primarySlotTagName: "input", excludedPropNames: ["checked", "defaultChecked", "onChange", "disabledFocusable"] }), u = ne("switch-", c.primary.id), m = P.always(e.root, { defaultProps: { ref: $e(), ...c.root }, elementType: "div" }), h = P.always(e.indicator, { defaultProps: { "aria-hidden": true }, elementType: "div" }), d = P.always(e.input, { defaultProps: { checked: o, defaultChecked: r, id: u, ref: t, role: "switch", type: "checkbox", ...c.primary, disabled: n && !s, ...s && { "aria-disabled": true } }, elementType: "input" });
  d.onChange = z(d.onChange, (g) => i?.(g, { checked: g.currentTarget.checked })), d.onClick = z(d.onClick, (g) => {
    s && g.preventDefault();
  }), d.onKeyDown = z(d.onKeyDown, (g) => {
    s && (g.key === " " || g.key === "Enter") && g.preventDefault();
  });
  let f = P.optional(e.label, { defaultProps: { disabled: n || s, htmlFor: u, required: l }, elementType: "label" });
  return { disabledFocusable: s, labelPosition: a, components: { root: "div", indicator: "div", input: "input", label: "label" }, root: m, indicator: h, input: d, label: f };
};
var yt = (e) => {
  let { labelPosition: t } = e;
  return $(e.root, { children: [R(e.input, {}), t !== "after" && e.label && R(e.label, {}), R(e.indicator, {}), t === "after" && e.label && R(e.label, {})] });
};
var ys = (e, t) => {
  let o = fr(e, t);
  return o.root["data-disabled"] = N(o.input.disabled || o.disabledFocusable), o.root["data-disabled-focusable"] = N(o.disabledFocusable), o.root["data-checked"] = N(o.input.checked), o.root["data-label-position"] = o.labelPosition, o;
};
var Ss = T(S(), 1);
var Is = Ss.createContext(void 0);
var hf = {};
var xf = Is.Provider;
var zi = () => Ss.useContext(Is) || hf;
var Yt = (e, t) => R(Is.Provider, { value: t.radioGroup, children: R(e.root, {}) });
var Xt = (e, t) => {
  e = ve(e);
  let o = ne("radiogroup-"), { name: r = o, value: n, defaultValue: s, disabled: a, onChange: i, required: l } = e;
  return { name: r, value: n, defaultValue: s, disabled: a, required: l, components: { root: "div" }, root: { ref: t, role: "radiogroup", ...P.always(Q("div", e, ["onChange", "name"]), { elementType: "div" }), onChange: A((c) => {
    i && Be(c.target, { constructorName: "HTMLInputElement" }) && c.target.type === "radio" && i(c, { value: c.target.value });
  }) } };
};
var Cu = T(S(), 1);
var Ms = (e) => {
  let { name: t, value: o, defaultValue: r, disabled: n, layout: s, required: a } = e, i = e.root["aria-describedby"];
  return { radioGroup: Cu.useMemo(() => ({ name: t, value: o, defaultValue: r, disabled: n, layout: s, required: a, "aria-describedby": i }), [t, o, r, n, s, a, i]) };
};
var St = (e) => $(e.root, { children: [R(e.input, {}), R(e.indicator, {}), e.label && R(e.label, {})] });
var br = (e, t) => {
  let o = zi(), { name: r = o.name, checked: n = o.value !== void 0 ? o.value === e.value : void 0, defaultChecked: s = o.defaultValue !== void 0 ? o.defaultValue === e.value : void 0, labelPosition: a = o.layout === "horizontal-stacked" ? "below" : "after", disabled: i = o.disabled, required: l = o.required, "aria-describedby": c = o["aria-describedby"], onChange: u } = e, m = Te({ props: e, primarySlotTagName: "input", excludedPropNames: ["checked", "defaultChecked", "onChange"] }), h = P.always(e.root, { defaultProps: { ref: $e(), ...m.root }, elementType: "span" }), d = P.always(e.input, { defaultProps: { ref: t, type: "radio", id: ne("radio-", m.primary.id), name: r, checked: n, defaultChecked: s, disabled: i, required: l, "aria-describedby": c, ...m.primary }, elementType: "input" });
  d.onChange = z(d.onChange, (y) => u?.(y, { value: y.currentTarget.value }));
  let f = P.optional(e.label, { defaultProps: { htmlFor: d.id, disabled: d.disabled }, elementType: "label" }), g = P.always(e.indicator, { defaultProps: { "aria-hidden": true }, elementType: "div" });
  return { labelPosition: a, components: { root: "span", input: "input", label: "label", indicator: "div" }, root: h, input: d, label: f, indicator: g };
};
var Wi = Ms;
var Rs = Z("RadioGroup", Xt, Yt, Wi);
var _s = (e, t) => {
  let o = br(e, t);
  return o.root["data-disabled"] = N(o.input.disabled), o.root["data-label-position"] = o.labelPosition, o;
};
var hr = Z("Radio", _s, St);
var $i = (e, t) => {
  let o = cr(e, t);
  return o.root["data-validate-state"] = o.validationState, o;
};
var qi = hs;
var Ps = Z("Field", $i, $t, qi);
var Yi = (e) => e <= 0 ? 1 : e;
var Xi = (e, t) => e === void 0 ? e : e < 0 ? 0 : e > t ? t : e;
var xr = (e, t) => {
  let o = Ye();
  var r;
  let n = Yi((r = e.max) !== null && r !== void 0 ? r : 1), s = Xi(e.value, n), a = P.always(Q("div", { ref: t, role: "progressbar", "aria-valuemin": s !== void 0 ? 0 : void 0, "aria-valuemax": s !== void 0 ? n : void 0, "aria-valuenow": s, "aria-labelledby": o?.labelId, ...e }), { elementType: "div" });
  o && (o.validationMessageId || o.hintId) && (a["aria-describedby"] = [o?.validationMessageId, o?.hintId, a["aria-describedby"]].filter(Boolean).join(" "));
  let i = P.always(e.bar, { elementType: "div" });
  return { max: n, value: s, components: { root: "div", bar: "div", indeterminateMotion: "div" }, root: a, bar: i };
};
var Jt = (e) => R(e.root, { children: e.bar && (e.indeterminateMotion ? R(e.indeterminateMotion, { children: R(e.bar, {}) }) : R(e.bar, {})) });
var Ji = (e, t) => {
  let o = xr(e, t);
  return o.root["data-indeterminate"] = N(o.value === void 0), o.bar && o.value !== void 0 && (o.bar.style = { width: Math.min(100, Math.max(0, o.value / o.max * 100)) + "%", ...o.bar.style }), o;
};
var ks = Z("ProgressBar", Ji, Jt);
var Qt = T(S(), 1);
var As = T(tm(), 1);
var _f = (e) => (o) => {
  let r = Qt.useRef(o.value), n = Qt.useRef(null);
  return n.current || (n.current = { value: r, listeners: [] }), le(() => {
    r.current = o.value, (0, As.unstable_runWithPriority)(As.unstable_NormalPriority, () => {
      n.current.listeners.forEach((s) => {
        s(o.value);
      });
    });
  }, [o.value]), Qt.createElement(e, { value: n.current }, o.children);
};
var ge = (e) => {
  let t = Qt.createContext({ value: { current: e }, listeners: [], isDefault: true });
  return t.Provider = _f(t.Provider), delete t.Consumer, t;
};
var eo = T(S(), 1);
var Ie = (e, t) => {
  let o = eo.useContext(e), { value: r, listeners: n } = o, s = t(r.current), [, a] = eo.useReducer((c) => c + 1, 0), i = eo.useRef(t), l = eo.useRef(s);
  return le(() => {
    i.current = t, l.current = s;
  }), le(() => {
    let c = (u) => {
      try {
        let m = i.current(u);
        Object.is(l.current, m) || a();
      } catch {
      }
    };
    return n.push(c), c(r.current), () => {
      let u = n.indexOf(c);
      u !== -1 && n.splice(u, 1);
    };
  }, [n, r]), s;
};
var Iu = T(S(), 1);
function Ve(e) {
  return !Iu.useContext(e).isDefault;
}
var Qi = ge(void 0);
var Pf = { size: "medium", handleToggleButton: () => null, handleRadio: () => null, vertical: false, checkedValues: {} };
var vr = (e) => Ie(Qi, (t = Pf) => e(t));
var gr = (e, t) => {
  let { vertical: o = false } = e, r = { vertical: o, components: { root: "div" }, root: P.always(Q("div", { role: "toolbar", ref: t, ...o && { "aria-orientation": "vertical" }, ...e }), { elementType: "div" }) }, [n, s] = kf({ checkedValues: e.checkedValues, defaultCheckedValues: e.defaultCheckedValues, onCheckedValueChange: e.onCheckedValueChange }), a = A((l, c, u, m) => {
    if (c && u) {
      let d = [...n?.[c] || []];
      m ? d.splice(d.indexOf(u), 1) : d.push(u), s?.(l, { name: c, checkedItems: d });
    }
  }), i = A((l, c, u, m) => {
    c && u && s?.(l, { name: c, checkedItems: [u] });
  });
  return { ...r, handleToggleButton: a, handleRadio: i, checkedValues: n ?? {} };
};
var kf = (e) => {
  let [t, o] = te({ state: e.checkedValues, defaultState: e.defaultCheckedValues, initialState: {} }), { onCheckedValueChange: r } = e, n = A((s, { name: a, checkedItems: i }) => {
    r && r(s, { name: a, checkedItems: i }), o((l) => l ? { ...l, [a]: i } : { [a]: i });
  });
  return [t, n];
};
var to = (e, t) => R(Qi.Provider, { value: t.toolbar, children: R(e.root, { children: e.root.children }) });
var Mu = T(S(), 1);
function Cr(e) {
  let { size: t, handleToggleButton: o, vertical: r, checkedValues: n, handleRadio: s } = e;
  return { toolbar: Mu.useMemo(() => ({ size: t, vertical: r, handleToggleButton: o, handleRadio: s, checkedValues: n }), [t, r, o, s, n]) };
}
var Tr = (e, t) => {
  let { vertical: o = false, ...r } = e, n = it(r, t);
  return { vertical: o, ...n };
};
var oo = (e) => R(e.root, { children: e.root.children !== void 0 && R(e.wrapper, { children: e.root.children }) });
var yr = (e, t) => {
  let { vertical: o = false, wrapper: r, ...n } = e, s = ne("divider-");
  return { vertical: o, components: { root: "div", wrapper: "div" }, root: P.always({ role: "separator", "aria-orientation": o ? "vertical" : "horizontal", "aria-labelledby": e.children ? s : void 0, ref: t, ...n }, { elementType: "div" }), wrapper: P.always(r, { defaultProps: { id: s, children: e.children }, elementType: "div" }) };
};
var Sr = (e, t) => {
  let o = vr((r) => r.vertical);
  return yr({ vertical: !o, ...e }, t);
};
var el = (e, t) => {
  let o = gr(e, t);
  return o.root.focusgroup = `toolbar ${o.vertical ? "block" : "inline"} wrap`, o.root["data-vertical"] = N(o.vertical), o;
};
var tl = Cr;
var ws = Z("Toolbar", el, to, tl);
var ol = (e, t) => {
  let o = Tr(e, t);
  return o.root["data-vertical"] = N(o.vertical), o.root["data-disabled"] = N(o.disabled), o.root["data-disabled-focusable"] = N(o.disabledFocusable), o.root["data-icon-only"] = N(o.iconOnly), o;
};
var Ir = Z("ToolbarButton", ol, fe);
var rl = (e, t) => {
  let o = Sr(e, t);
  return o.root["data-vertical"] = N(o.vertical), o;
};
var Mr = Z("ToolbarDivider", rl, oo);
var Ns = T(S(), 1);
var lt = T(S(), 1);
var Rr = (e, t) => {
  let { disabled: o = false, onTabSelect: r, selectTabOnFocus: n = false, vertical: s = false, selectedValue: a, defaultSelectedValue: i, ...l } = e, c = lt.useRef(null), [u, m] = te({ state: a, defaultState: i, initialState: void 0 }), h = lt.useRef(void 0), d = lt.useRef(void 0);
  lt.useEffect(() => {
    d.current = h.current, h.current = u;
  }, [u]);
  let f = A((C, b) => {
    m(b.value), r?.(C, b);
  }), g = lt.useRef({}), y = A((C) => {
    let b = JSON.stringify(C.value);
    g.current[b] = C;
  }), x = A((C) => {
    delete g.current[JSON.stringify(C.value)];
  }), v = lt.useCallback(() => ({ selectedValue: h.current, previousSelectedValue: d.current, registeredTabs: g.current }), []);
  return { components: { root: "div" }, root: P.always({ ref: X(t, c), role: "tablist", "aria-orientation": s ? "vertical" : "horizontal", ...l }, { elementType: "div" }), disabled: o, selectTabOnFocus: n, selectedValue: u, onRegister: y, onUnregister: x, onSelect: f, getRegisteredTabs: v, vertical: s };
};
var Gf = { appearance: "transparent", reserveSelectedTabSpace: true, selectTabOnFocus: false, disabled: false, selectedValue: void 0, onRegister: () => {
}, onUnregister: () => {
}, onSelect: () => {
}, getRegisteredTabs: () => ({ registeredTabs: {} }), size: "medium", vertical: false };
var Es = ge(void 0);
var _r = Es.Provider;
var Ne = (e) => Ie(Es, (t = Gf) => e(t));
var ro = (e, t) => R(e.root, { children: R(_r, { value: t.tabList, children: e.root.children }) });
var Au = T(S(), 1);
function Pr(e) {
  let { appearance: t, reserveSelectedTabSpace: o, disabled: r, selectTabOnFocus: n, selectedValue: s, onRegister: a, onUnregister: i, onSelect: l, getRegisteredTabs: c, size: u, vertical: m } = e;
  return { tabList: Au.useMemo(() => ({ appearance: t, reserveSelectedTabSpace: o, disabled: r, selectTabOnFocus: n, selectedValue: s, onSelect: l, onRegister: a, onUnregister: i, getRegisteredTabs: c, size: u, vertical: m }), [t, o, r, n, s, l, a, i, c, u, m]) };
}
var kr = (e, t) => {
  let { content: o, disabled: r = false, icon: n, onClick: s, onFocus: a, value: i, ...l } = e, c = Ne((V) => V.selectTabOnFocus), u = Ne((V) => V.disabled), m = Ne((V) => V.selectedValue === i), h = Ne((V) => V.onRegister), d = Ne((V) => V.onUnregister), f = Ne((V) => V.onSelect), g = Ne((V) => !!V.vertical), y = u || r, x = Ns.useRef(null), v = (V) => f(V, { value: i }), C = A(z(s, v)), b = A(z(a, v));
  Ns.useEffect(() => (h({ value: i, ref: x }), () => {
    d({ value: i, ref: x });
  }), [h, d, x, i]);
  let _ = P.optional(n, { elementType: "span" }), I = P.always(o, { defaultProps: { children: e.children }, elementType: "span" }), L = !!(_?.children && !I.children);
  return { components: { root: "button", icon: "span", content: "span", contentReservedSpace: "span" }, root: P.always({ ref: X(t, x), role: "tab", type: "button", "aria-selected": y ? void 0 : `${m}`, value: i, ...l, disabled: y, onClick: C, onFocus: c ? b : a }, { elementType: "button" }), icon: _, iconOnly: L, content: I, disabled: y, selected: m, value: i, vertical: g };
};
var ct = (e) => $(e.root, { children: [e.icon && R(e.icon, {}), !e.iconOnly && R(e.content, {}), e.contentReservedSpace && R(e.contentReservedSpace, {})] });
var Ar = (e, t) => {
  let o = kr(e, t);
  return o.root.focusgroupstart = N(o.selected), o.root["data-icon-only"] = N(o.iconOnly), o.root["data-selected"] = N(o.selected), o.root["data-disabled"] = N(o.disabled), o;
};
var nl = (e, t) => {
  let o = Rr(e, t);
  return o.root.focusgroup = `tablist ${o.vertical ? "block" : "inline"} wrap nomemory`, o.root["data-orientation"] = o.vertical ? "vertical" : "horizontal", o;
};
var sl = Pr;
var Ds = Z("TabList", nl, ro, sl);
var Fu = T(S(), 1);
var Fs = T(S(), 1);
var Lo = T(S(), 1);
var t1 = { open: false, modalType: "modal", dialogTitleId: "", isNestedDialog: false, inertTrapFocus: false, unmountOnClose: true, requestOpenChange() {
} };
var wr = Lo.createContext(void 0);
var Er = Lo.createContext(void 0);
var no = () => Lo.useContext(wr) ?? t1;
var al = () => Lo.useContext(Er) ?? false;
var il = (e) => {
  let { children: t, modalType: o = "modal", onOpenChange: r, inertTrapFocus: n = false, unmountOnClose: s = true } = e, a = ne("dialog-title-"), [i, l] = o1(t), [c, u] = te({ state: e.open, defaultState: e.defaultOpen, initialState: false }), h = Fs.useContext(wr) !== void 0, d = A((f) => {
    r?.(f.event, f);
    let g = f.event;
    (typeof g.isDefaultPrevented == "function" ? g.isDefaultPrevented() : f.event.defaultPrevented) || u(f.open);
  });
  return { open: c, modalType: o, dialogTitleId: a, isNestedDialog: h, inertTrapFocus: n, unmountOnClose: s, trigger: i, content: l, requestOpenChange: d };
};
function o1(e) {
  let t = Fs.Children.toArray(e);
  switch (t.length) {
    case 2:
      return t;
    case 1:
      return [void 0, t[0]];
    default:
      return [void 0, void 0];
  }
}
var Du = T(S(), 1);
var ll = (e) => {
  let { open: t, modalType: o, dialogTitleId: r, isNestedDialog: n, inertTrapFocus: s, unmountOnClose: a, requestOpenChange: i } = e;
  return { dialog: Du.useMemo(() => ({ open: t, modalType: o, dialogTitleId: r, isNestedDialog: n, inertTrapFocus: s, unmountOnClose: a, requestOpenChange: i }), [t, o, r, n, s, a, i]), dialogSurface: false };
};
var cl = T(S(), 1);
var ul = (e, t) => cl.createElement(wr.Provider, { value: t.dialog }, cl.createElement(Er.Provider, { value: t.dialogSurface }, e.trigger, e.content));
var Nr = Fu.memo((e) => {
  let t = il(e), o = ll(t);
  return ul(t, o);
});
Nr.displayName = "Dialog";
var Dr = T(S(), 1);
var Ls = /* @__PURE__ */ new WeakMap();
function Lu(e) {
  let t = Ls.get(e);
  if (t) {
    t.lockCount += 1;
    return;
  }
  Ls.set(e, { lockCount: 1, previousBodyOverflow: e.body.style.overflow }), e.body.style.overflow = "visible clip";
}
function Bu(e) {
  let t = Ls.get(e);
  t && (t.lockCount -= 1, !(t.lockCount > 0) && (e.body.style.overflow = t.previousBodyOverflow, Ls.delete(e)));
}
var Ou = typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("selector(:popover-open)");
var Fr = (e, t) => {
  let { open: o, modalType: r, unmountOnClose: n, requestOpenChange: s, dialogTitleId: a } = no(), { targetDocument: i } = ee(), l = Dr.useRef(null), c = Dr.useRef(null), u = X(t, l), [m, h] = Dr.useState(o || !n);
  (o || !n) && !m && h(true);
  let d = A((x) => {
    let C = x.newState === "open";
    C !== o && s({ type: "surfaceToggle", open: C, event: x });
  });
  le(() => {
    let x = l.current;
    if (!x) return;
    if (!o) {
      if (r === "non-modal") {
        typeof x.hidePopover == "function" ? Ou && x.matches(":popover-open") && x.hidePopover() : x.open && x.close();
        let b = c.current;
        b && i?.contains(b) && b.focus(), c.current = null;
      } else x.open && x.close();
      if (n) {
        let b = (x.getAnimations?.({ subtree: true }) ?? []).filter((_) => {
          let I = _.effect;
          return I && "target" in I && I.target === x && _.playState === "running" && Number.isFinite(I.getComputedTiming().endTime);
        });
        if (b.length === 0) h(false);
        else {
          let _ = false, I = b.length, L = () => {
            !_ && --I === 0 && h(false);
          };
          return b.forEach((V) => {
            V.finished.then(L, L);
          }), () => {
            _ = true;
          };
        }
      }
      return;
    }
    let v = r !== "non-modal" && !!i;
    v && Lu(i), r === "non-modal" && (c.current = i?.activeElement);
    let C;
    return r !== "non-modal" && (C = (b) => b.preventDefault(), x.addEventListener("cancel", C)), r !== "non-modal" ? x.open || x.showModal() : typeof x.showPopover == "function" ? (Ou && x.matches(":popover-open") || x.showPopover(), x.addEventListener("toggle", d)) : x.open || x.show(), () => {
      C && x.removeEventListener("cancel", C), x.removeEventListener("toggle", d), v && Bu(i);
    };
  }, [o, r, i, n, d]);
  let f = A((x) => {
    if (e.onKeyDown?.(x), x.key === "Escape" && !x.isDefaultPrevented()) {
      s({ type: "escapeKeyDown", open: false, event: x }), x.stopPropagation();
      return;
    }
    if (r === "non-modal" && x.key === "Tab" && !x.shiftKey && !x.isDefaultPrevented() && x.target === x.currentTarget) {
      let v = x.currentTarget.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      v && (x.preventDefault(), v.focus());
    }
  }), g = A((x) => {
    if (e.onClick?.(x), r !== "modal" || x.isDefaultPrevented() || x.target !== x.currentTarget) return;
    let v = x.currentTarget.getBoundingClientRect();
    (x.clientX < v.left || x.clientX > v.right || x.clientY < v.top || x.clientY > v.bottom) && s({ type: "backdropClick", open: false, event: x });
  });
  return { components: { root: "dialog" }, open: o, unmountOnClose: n, modalType: r, shouldRender: m, root: P.always(Q("dialog", { role: r === "alert" ? "alertdialog" : void 0, "aria-modal": r !== "non-modal" ? true : void 0, "aria-labelledby": e["aria-label"] ? void 0 : a || void 0, ...e, tabIndex: -1, ref: u, onKeyDown: f, onClick: g, popover: r === "non-modal" ? "manual" : void 0, "data-open": N(o), "data-modal-type": r }), { elementType: "dialog" }) };
};
var Lr = (e) => e.shouldRender ? R(Er.Provider, { value: true, children: R(e.root, {}) }) : null;
var dl = (e) => {
  let t = al(), { children: o, action: r = t ? "close" : "open" } = e, n = Oe(o), s = no().requestOpenChange, a = A((i) => {
    n?.props?.onClick?.(i), i.isDefaultPrevented() || s({ event: i, type: "triggerClick", open: r === "open" });
  });
  return { children: je(o, { ...n?.props, ref: Ue(n), onClick: a, "aria-haspopup": r === "open" ? "dialog" : void 0 }) };
};
var so = (e) => dl(e).children;
so.displayName = "DialogTrigger";
so.isFluentTriggerComponent = true;
var pl = (e, t) => {
  let { dialogTitleId: o } = no();
  return { components: { root: "h2" }, root: P.always(Q("h2", { ref: t, ...e, id: o }), { elementType: "h2" }) };
};
var ml = (e) => R(e.root, {});
var Br = Z("DialogTitle", pl, ml);
var fl = (e, t) => ({ components: { root: "div" }, root: P.always(Q("div", { ref: t, ...e }), { elementType: "div" }) });
var bl = (e) => R(e.root, {});
var Or = Z("DialogBody", fl, bl);
var hl = (e, t) => ({ components: { root: "div" }, root: P.always(Q("div", { ref: t, ...e }), { elementType: "div" }) });
var xl = (e) => R(e.root, {});
var Vr = Z("DialogActions", hl, xl);
var _e = T(S(), 1);
var n1 = { above: { position: "above", align: "center" }, "above-start": { position: "above", align: "start" }, "above-end": { position: "above", align: "end" }, below: { position: "below", align: "center" }, "below-start": { position: "below", align: "start" }, "below-end": { position: "below", align: "end" }, before: { position: "before", align: "center" }, "before-top": { position: "before", align: "top" }, "before-bottom": { position: "before", align: "bottom" }, after: { position: "after", align: "center" }, "after-top": { position: "after", align: "top" }, "after-bottom": { position: "after", align: "bottom" } };
function Bo(e) {
  return e == null ? {} : typeof e == "string" ? n1[e] : e;
}
var ut = Bo;
var De = T(S(), 1);
var de = { above: "above", below: "below", before: "before", after: "after" };
var ce = { start: "start", center: "center", end: "end" };
var Bs = { above: { center: "block-start", start: "block-start span-inline-end", end: "block-start span-inline-start" }, below: { center: "block-end", start: "block-end span-inline-end", end: "block-end span-inline-start" }, before: { center: "inline-start", start: "inline-start span-block-end", end: "inline-start span-block-start" }, after: { center: "inline-end", start: "inline-end span-block-end", end: "inline-end span-block-start" } };
var s1 = { top: ce.start, bottom: ce.end };
function Os(e) {
  return e === ce.start || e === ce.center || e === ce.end ? e : s1[e] ?? ce.center;
}
function ao(e, t) {
  let o = Os(t);
  return o === ce.center ? e : e === de.before || e === de.after ? `${e}-${o === ce.start ? "top" : "bottom"}` : `${e}-${o}`;
}
function vl(e) {
  let { position: t = de.above, align: o = ce.center } = Bo(e);
  return Bs[t][Os(o)];
}
function gl(e, t) {
  return e === de.above ? { alignSelf: ce.end, justifySelf: t } : e === de.below ? { alignSelf: ce.start, justifySelf: t } : e === de.before ? { alignSelf: t, justifySelf: ce.end } : { alignSelf: t, justifySelf: ce.start };
}
var a1 = 2;
var Vs = (e, t, o) => Math.abs(e - t) <= o;
function i1(e, t, o) {
  return e.bottom <= t.top + o ? de.above : e.top >= t.bottom - o ? de.below : e.right <= t.left + o ? de.before : e.left >= t.right - o ? de.after : null;
}
function l1(e, t, o, r) {
  let n = e === de.above || e === de.below;
  return (n ? Vs(t.left, o.left, r) : Vs(t.top, o.top, r)) ? ce.start : (n ? Vs(t.right, o.right, r) : Vs(t.bottom, o.bottom, r)) ? ce.end : ce.center;
}
function Cl(e, t, o) {
  let r = o?.tolerance ?? a1, n = e.getBoundingClientRect(), s = t.getBoundingClientRect(), a = i1(s, n, r);
  if (!a) return null;
  let i = l1(a, s, n, r), l = ao(a, i);
  return { position: a, align: i, placement: l };
}
function Tl(e) {
  let t = false;
  return () => {
    t || (t = true, Promise.resolve().then(() => {
      t = false, e();
    }));
  };
}
function yl(e, t, o, r) {
  let n = t === de.above || t === de.below;
  if (o) {
    let s = `${o}px`;
    n ? (e.style.marginBlockStart = s, e.style.marginBlockEnd = s) : (e.style.marginInlineStart = s, e.style.marginInlineEnd = s);
  }
  if (r) {
    let s = `${r}px`;
    n ? (e.style.marginInlineStart = s, e.style.marginInlineEnd = s) : (e.style.marginBlockStart = s, e.style.marginBlockEnd = s);
  }
}
function Sl(e) {
  return typeof e == "number" ? { mainAxis: e, crossAxis: 0 } : e && typeof e == "object" ? { mainAxis: e.mainAxis ?? 0, crossAxis: e.crossAxis ?? 0 } : { mainAxis: 0, crossAxis: 0 };
}
function Hs(e) {
  return e && "nodeType" in e ? e : null;
}
function Vu(e, t, o, r = false) {
  let n = A(() => {
    if (!e || !t) return;
    let s = Cl(t, e);
    s && e.getAttribute("data-placement") !== s.placement && e.setAttribute("data-placement", s.placement);
  });
  return le(() => {
    if (r || !e || !t) return;
    let s = o?.defaultView;
    if (!s) return;
    let a = Tl(n), i = s.ResizeObserver, l = i ? new i((c) => {
      c.every((m) => m.contentRect.width > 0 && m.contentRect.height > 0) && a();
    }) : null;
    return l?.observe(e), l?.observe(t), s.addEventListener("scroll", a, { capture: true, passive: true }), s.addEventListener("resize", a), a(), () => {
      l?.disconnect(), s.removeEventListener("scroll", a, { capture: true }), s.removeEventListener("resize", a);
    };
  }, [e, t, o, r, n]), n;
}
var c1 = ["flip-block", "flip-inline", "flip-block flip-inline"];
var u1 = [];
var Hu = (e) => e.style.getPropertyValue("anchor-name").split(",").map((t) => t.trim()).filter(Boolean);
function dt(e) {
  let { pinned: t, target: o = null, align: r = ce.center, position: n = de.above, fallbackPositions: s = u1, offset: a, coverTarget: i = false, strategy: l = "fixed", matchTargetSize: c, positioningRef: u } = e, m = Os(r), { mainAxis: h, crossAxis: d } = Sl(a), f = De.useMemo(() => i ? gl(n, m) : null, [i, n, m]), [g, y] = De.useState(null), [x, v] = De.useState(null), [C, b] = De.useState(null), _ = C ?? Hs(o) ?? g, I = `--${ne("popover-anchor-")}`, L = Bs[n][m], V = ao(n, m), { targetDocument: w } = ee(), M = De.useMemo(() => s.map(vl), [s]), B = Vu(x, _, w, i);
  De.useImperativeHandle(u, () => ({ setTarget: (D) => {
    b(Hs(D));
  }, updatePosition: B }), [B]), le(() => {
    if (_) {
      if (I) {
        let D = Hu(_);
        D.includes(I) || _.style.setProperty("anchor-name", [...D, I].join(", "));
      }
      return () => {
        if (I) {
          let D = Hu(_).filter((K) => K !== I);
          D.length > 0 ? _.style.setProperty("anchor-name", D.join(", ")) : _.style.removeProperty("anchor-name");
        }
      };
    }
  }, [_, I]);
  let j = De.useCallback((D) => {
    y(D);
  }, []), E = De.useCallback((D) => {
    if (v(D), !!D) {
      if (D.style.setProperty("position", l), D.style.setProperty("inset", "auto"), D.style.setProperty("margin", "0"), yl(D, n, h, d), c === "width" ? D.style.setProperty("width", "anchor-size(width)") : D.style.removeProperty("width"), D.style.setProperty("position-anchor", I), D.setAttribute("data-placement", V), f) {
        D.style.setProperty("position-area", "center"), D.style.setProperty("align-self", f.alignSelf), D.style.setProperty("justify-self", f.justifySelf), D.style.removeProperty("position-try-fallbacks");
        return;
      }
      if (D.style.setProperty("position-area", L), m === ce.center ? D.style.setProperty("place-self", "anchor-center") : (D.style.removeProperty("place-self"), D.style.removeProperty("align-self"), D.style.removeProperty("justify-self")), t) {
        D.style.removeProperty("position-try-fallbacks");
        return;
      }
      M.length > 0 ? D.style.setProperty("position-try-fallbacks", M.join(", ")) : D.style.setProperty("position-try-fallbacks", c1.join(", "));
    }
  }, [I, L, V, M, t, n, m, h, d, f, l, c]);
  return { targetRef: j, containerRef: E };
}
var Hr = (e) => !!e && typeof e.showModal == "function";
var Oo = (e) => {
  let t = e.getRootNode(), o = e.ownerDocument.defaultView?.ShadowRoot;
  return o && t instanceof o ? t.activeElement ?? e.ownerDocument.activeElement : e.ownerDocument.activeElement;
};
var Il = (e) => {
  let { openOnHover: t = false, openOnContext: o = false, mouseLeaveDelay: r = 500, withArrow: n = false, trapFocus: s = false } = e, [a, i] = te({ state: e.open, defaultState: e.defaultOpen, initialState: false }), [l, c] = _e.useState(a), u = _e.useRef(null), m = _e.useRef(null), [h, d] = _e.useState(void 0), f = A((k, H) => {
    e.onOpenChange?.(k, { event: k, type: k.type, open: H });
  }), [g, y] = Ze(), x = A((k, H) => {
    if (y(), H && k.type === "contextmenu") {
      let ie = k;
      d({ x: ie.clientX, y: ie.clientY });
    }
    H || d(void 0), k.type === "mouseleave" ? g(() => {
      i(H), f(k, H);
    }, r) : (H && e.open === void 0 && c(true), i(H), f(k, H));
  }), v = _e.useCallback((k) => {
    x(k, !a);
  }, [x, a]), C = _e.useRef(null), b = _e.useRef(null), _ = _e.useRef(null), I = ne("fui-popover-surface-"), L = e.id ?? I, V = dt(ut(e.positioning)), w = A(() => {
    let k = b.current;
    if (!k) return;
    let H = Oo(k);
    (u.current ?? k.contains(H)) && (!H || H === k.ownerDocument.body || k.contains(H)) && C.current?.isConnected && C.current.focus(), u.current = null, m.current = null, c(false);
  }), M = A((k) => {
    let ie = k.newState === "open", ot = b.current;
    k.currentTarget !== ot || !ot || ot.matches(":popover-open") !== ie || (ie || w(), ie !== a && (i(ie), e.onOpenChange?.(k, { event: k, type: k.type, open: ie })));
  }), B = A((k) => {
    let H = b.current;
    k.currentTarget !== H || Hr(H) && H.open || (w(), a && (i(false), e.onOpenChange?.(k, { event: k, type: k.type, open: false })));
  }), j = a || l;
  le(() => {
    let k = b.current;
    if (!k || !j) return;
    let H = (ie) => {
      (ie.type === "cancel" || ie.newState === "closed") && (u.current = k.contains(Oo(k)));
    };
    if (s) {
      if (!Hr(k)) return;
      let ie = () => {
        u.current = k.open ? null : true;
      };
      return k.addEventListener("close", B), k.addEventListener("cancel", H), k.addEventListener("beforetoggle", H), k.addEventListener("focusout", ie), () => {
        k.removeEventListener("close", B), k.removeEventListener("cancel", H), k.removeEventListener("beforetoggle", H), k.removeEventListener("focusout", ie);
      };
    }
    if (typeof k.showPopover == "function") return k.addEventListener("toggle", M), k.addEventListener("beforetoggle", H), () => {
      k.removeEventListener("toggle", M), k.removeEventListener("beforetoggle", H);
    };
  }), le(() => {
    let k = b.current;
    if (k) {
      if (a) {
        l || c(true), u.current = null, s ? (Hr(k) && !k.open && k.showModal(), Hr(k) && k.open && (m.current = k)) : typeof k.showPopover == "function" && !k.matches(":popover-open") && (k.showPopover(), k.matches(":popover-open") && (m.current = k));
        return;
      }
      s ? Hr(k) && k.open ? (u.current = k.contains(Oo(k)), k.close()) : m.current !== k && (u.current = k.contains(Oo(k)), w()) : typeof k.hidePopover == "function" ? k.matches(":popover-open") ? (u.current = k.contains(Oo(k)), k.hidePopover()) : m.current !== k && w() : (u.current = k.contains(Oo(k)), w());
    }
  }, [a, s, l, e.children, b, w]);
  let E = _e.Children.toArray(e.children), D, K;
  return E.length === 2 ? (D = E[0], K = E[1]) : E.length === 1 && (K = E[0]), { open: a, setOpen: x, toggleOpen: v, triggerRef: C, contentRef: b, arrowRef: _, popoverTrigger: D, popoverSurface: K, openOnHover: t, openOnContext: o, withArrow: n, trapFocus: s, onOpenChange: e.onOpenChange, contextTarget: h, setContextTarget: d, positioning: V, surfaceId: L, shouldRenderSurface: j };
};
var Ml = (e) => {
  let { open: t, setOpen: o, toggleOpen: r, triggerRef: n, contentRef: s, arrowRef: a, openOnHover: i, openOnContext: l, withArrow: c, trapFocus: u, positioning: m, surfaceId: h } = e;
  return { popover: { open: t, setOpen: o, toggleOpen: r, triggerRef: n, contentRef: s, arrowRef: a, openOnHover: i, openOnContext: l, withArrow: c, trapFocus: u, positioning: { targetRef: m.targetRef, containerRef: m.containerRef }, surfaceId: h } };
};
var Uu = T(S(), 1);
var Gu = ge(void 0);
var d1 = { open: false, setOpen: () => null, toggleOpen: () => null, triggerRef: { current: null }, contentRef: { current: null }, arrowRef: { current: null }, openOnContext: false, openOnHover: false, withArrow: false, trapFocus: false, positioning: { targetRef: () => {
}, containerRef: () => {
} }, surfaceId: "" };
var Zu = Gu.Provider;
var me = (e) => Ie(Gu, (t = d1) => e(t));
var Rl = (e, t) => Uu.createElement(Zu, { value: t.popover }, e.popoverTrigger, e.shouldRenderSurface ? e.popoverSurface : null);
var Vo = (e) => {
  let t = Il(e), o = Ml(t);
  return Rl(t, o);
};
Vo.displayName = "Popover";
var Gs = (e) => {
  let { children: t, disableButtonEnhancement: o = false } = e, r = Oe(t), n = me((b) => b.open), s = me((b) => b.setOpen), a = me((b) => b.toggleOpen), i = me((b) => b.triggerRef), l = me((b) => b.openOnHover), c = me((b) => b.openOnContext), u = me((b) => b.positioning), m = me((b) => b.surfaceId), { targetDocument: h } = ee(), d = (b) => {
    if (!c || !h) return;
    b.preventDefault();
    let _ = b.nativeEvent;
    h.addEventListener("pointerup", () => s(_, true), { once: true, capture: true });
  }, f = (b) => {
    c || a(b);
  }, g = (b) => {
    b.key === at && n && !b.isDefaultPrevented() && (s(b, false), b.preventDefault());
  }, y = (b) => {
    l && s(b, true);
  }, x = (b) => {
    l && s(b, false);
  }, v = { "aria-expanded": `${n}`, "aria-haspopup": "true", "aria-details": n ? m : void 0, "data-open": N(n), ...r?.props, onMouseEnter: A(z(r?.props.onMouseEnter, y)), onMouseLeave: A(z(r?.props.onMouseLeave, x)), onContextMenu: A(z(r?.props.onContextMenu, d)), onClick: A(z(r?.props.onClick, f)), onKeyDown: A(z(r?.props.onKeyDown, g)), ref: X(i, u.targetRef, Ue(r)) }, C = Ee(r?.type === "button" || r?.type === "a" ? r.type : "div", v);
  return { children: je(t, c || o ? v : C) };
};
var Zs = (e) => e.children;
var It = (e) => {
  let t = Gs(e);
  return Zs(t);
};
It.displayName = "PopoverTrigger";
It.isFluentTriggerComponent = true;
var Us = (e, t) => {
  let o = me((f) => f.contentRef), r = me((f) => f.openOnHover), n = me((f) => f.setOpen), s = me((f) => f.arrowRef), a = me((f) => f.withArrow), i = me((f) => f.open), l = me((f) => f.positioning), c = me((f) => f.surfaceId), u = me((f) => f.trapFocus), m = { withArrow: a, arrowRef: s, components: { root: "dialog" }, root: P.always({ ref: X(t, o, l.containerRef), role: u ? "dialog" : "group", ...e, id: c, "data-popover-surface": "", "data-open": N(i) }, { defaultProps: { popover: u ? void 0 : "auto" }, elementType: "dialog" }) }, { onMouseEnter: h, onMouseLeave: d } = m.root;
  return m.root.onMouseEnter = A((f) => {
    r && n(f, true), h?.(f);
  }), m.root.onMouseLeave = A((f) => {
    r && n(f, false), d?.(f);
  }), m;
};
var js = (e) => $(e.root, { children: [e.withArrow && R("div", { ref: e.arrowRef, "data-arrow": "" }), e.root.children] });
var Ho = Z("PopoverSurface", Us, js);
var Xe = T(S(), 1);
var Ks = ge(void 0);
var m1 = { open: false, setOpen: () => false, checkedValues: {}, onCheckedValueChange: () => null, isSubmenu: false, triggerRef: { current: null }, menuPopoverRef: { current: null }, mountNode: null, triggerId: "", openOnContext: false, openOnHover: false, hasIcons: false, hasCheckmarks: false, inline: false, persistOnItemClick: false };
var zs = Ks.Provider;
var U = (e) => Ie(Ks, (t = m1) => e(t));
var Ws = T(S(), 1);
var ju = Ws.createContext(void 0);
var f1 = false;
var Ku = ju.Provider;
var zu = () => {
  var e;
  return (e = Ws.useContext(ju)) !== null && e !== void 0 ? e : f1;
};
var $s = T(S(), 1);
var Wu = $s.createContext(void 0);
var b1 = { headerId: "" };
var $u = Wu.Provider;
var qu = () => {
  var e;
  return (e = $s.useContext(Wu)) !== null && e !== void 0 ? e : b1;
};
var qs = ge(void 0);
var h1 = { checkedValues: {}, setFocusByFirstCharacter: () => null, toggleCheckbox: () => null, selectRadio: () => null, hasIcons: false, hasCheckmarks: false };
var Yu = qs.Provider;
var Me = (e) => Ie(qs, (t = h1) => e(t));
var x1 = T(S(), 1);
var Go = "fuimenuenter";
var Ys = (e, t) => {
  e.dispatchEvent(new CustomEvent(Go, { bubbles: true, detail: { nativeEvent: t } }));
};
function Gr() {
  let e = U((o) => o.isSubmenu), t = Ve(qs);
  return e || t;
}
var _l = T(S(), 1);
var Xs = (e) => {
  let { targetDocument: t } = ee(), o = U((s) => s.triggerRef), r = U((s) => s.inline);
  return _l.useRef(null);
};
var Js = T(S(), 1);
var Pl = "fuimenusafezonetimeout";
var kl = (e) => {
  let t = Js.useRef(null);
  return Js.useCallback((o) => {
    var r;
    (r = t.current) === null || r === void 0 || r.removeEventListener(Pl, e), o?.addEventListener(Pl, e), t.current = o;
  }, [e]);
};
var Xu = T(S(), 1);
function Zr(e) {
  let { checkedValues: t, hasCheckmarks: o, hasIcons: r, inline: n, isSubmenu: s, menuPopoverRef: a, mountNode: i, onCheckedValueChange: l, open: c, openOnContext: u, openOnHover: m, persistOnItemClick: h, safeZone: d, setOpen: f, triggerId: g, triggerRef: y } = e;
  return { menu: Xu.useMemo(() => ({ checkedValues: t, hasCheckmarks: o, hasIcons: r, inline: n, isSubmenu: s, menuPopoverRef: a, mountNode: i, onCheckedValueChange: l, open: c, openOnContext: u, openOnHover: m, persistOnItemClick: h, safeZone: d, setOpen: f, triggerId: g, triggerRef: y }), [t, o, r, n, s, a, i, l, c, u, m, h, d, f, g, y]) };
}
var Mt = (e, t) => ({ components: { root: "div" }, root: P.always(Q("div", { role: "presentation", "aria-hidden": true, ...e, ref: t }), { elementType: "div" }) });
var Rt = (e) => R(e.root, {});
function _t(e, t) {
  let o = ne("menu-group");
  return { components: { root: "div" }, root: P.always(Q("div", { ref: t, "aria-labelledby": o, role: "group", ...e }), { elementType: "div" }), headerId: o };
}
var Pt = (e, t) => R($u, { value: t.menuGroup, children: R(e.root, {}) });
var Ju = T(S(), 1);
function kt(e) {
  let { headerId: t } = e;
  return { menuGroup: Ju.useMemo(() => ({ headerId: t }), [t]) };
}
function At(e, t) {
  let { headerId: o } = qu();
  return { components: { root: "div" }, root: P.always(Q("div", { ref: t, id: o, ...e }), { elementType: "div" }) };
}
var wt = (e) => R(e.root, {});
var El = T(S(), 1);
var Qu = (e, t) => {
  let o = Me((n) => n.setFocusByFirstCharacter), { onKeyDown: r } = e.root;
  return e.root.onKeyDown = (n) => {
    var s;
    r?.(n), !(((s = n.key) === null || s === void 0 ? void 0 : s.length) > 1) && t.current && o?.(n, t.current);
  }, e;
};
var Qs = T(S(), 1);
var ed = Qs.createContext(void 0);
var td = { setMultiline: () => null };
var Jk = ed.Provider;
var Al = () => {
  var e;
  return (e = Qs.useContext(ed)) !== null && e !== void 0 ? e : td;
};
var wl = () => Al() !== td;
var pt = (e, t) => {
  let o = zu(), r = U((v) => v.persistOnItemClick), { as: n = "div", disabled: s = false, hasSubmenu: a = o, persistOnClick: i = r, content: l, ...c } = e, { hasIcons: u, hasCheckmarks: m } = N1({ hasSubmenu: a }), h = U((v) => v.setOpen), d = U((v) => v.open);
  E1({ multiline: !!e.subText, hasSubmenu: a });
  let f = El.useRef(null), g = El.useRef(false), y = Xs(D1(e.role)), x = { hasSubmenu: a, submenuOpen: a && d, disabled: s, persistOnClick: i, components: { root: "div", icon: "span", checkmark: "span", submenuIndicator: "span", content: "span", secondaryContent: "span", subText: "span" }, root: P.always(Q(n, Ee(n, { role: "menuitem", ...c, disabled: false, disabledFocusable: s, ref: X(t, f, y), onKeyDown: A((v) => {
    var C;
    (C = e.onKeyDown) === null || C === void 0 || C.call(e, v), !v.isDefaultPrevented() && (v.key === " " || v.key === qe) && (g.current = true);
  }), onMouseMove: A((v) => {
    var C;
    if (v.currentTarget.ownerDocument.activeElement !== v.currentTarget) {
      var b;
      (b = f.current) === null || b === void 0 || b.focus();
    }
    (C = e.onMouseMove) === null || C === void 0 || C.call(e, v);
  }), onClick: A((v) => {
    var C;
    !a && !i && (h(v, { open: false, keyboard: g.current, bubble: true, type: "menuItemClick", event: v }), g.current = false), (C = e.onClick) === null || C === void 0 || C.call(e, v);
  }) })), { elementType: "div" }), icon: P.optional(e.icon, { renderByDefault: u, elementType: "span" }), checkmark: P.optional(e.checkmark, { renderByDefault: m, elementType: "span" }), submenuIndicator: P.optional(e.submenuIndicator, { renderByDefault: a, elementType: "span" }), content: P.optional(e.content, { renderByDefault: !!e.children, defaultProps: { children: e.children }, elementType: "span" }), secondaryContent: P.optional(e.secondaryContent, { elementType: "span" }), subText: P.optional(e.subText, { elementType: "span" }) };
  return Qu(x, f), x;
};
var E1 = (e) => {
  let { hasSubmenu: t, multiline: o } = e, r = wl() && t, { setMultiline: n } = Al();
  le(() => {
    r || n(o);
  }, [n, o, r]);
};
var N1 = (e) => {
  let { hasSubmenu: t } = e, o = Me((s) => s.hasIcons), r = Me((s) => s.hasCheckmarks), n = wl() && t;
  return { hasIcons: o && !n, hasCheckmarks: r && !n };
};
var D1 = (e) => {
  switch (e) {
    case "menuitemcheckbox":
      return "MenuItemCheckbox";
    case "menuitemradio":
      return "MenuItemRadio";
  }
  return "MenuItem";
};
var Et = (e) => $(e.root, { children: [e.checkmark && R(e.checkmark, {}), e.icon && R(e.icon, {}), e.content && $(e.content, { children: [e.content.children, e.subText && R(e.subText, {})] }), e.secondaryContent && R(e.secondaryContent, {}), e.submenuIndicator && R(e.submenuIndicator, {})] });
var V1 = T(S(), 1);
var Ur = (e, t) => {
  let o = Me((i) => i.toggleCheckbox), { name: r, value: n } = e, s = Me((i) => {
    var l;
    return (((l = i.checkedValues) === null || l === void 0 ? void 0 : l[r]) || []).indexOf(n) !== -1;
  });
  return { ...pt({ role: "menuitemcheckbox", persistOnClick: true, ...e, "aria-checked": s, checkmark: P.optional(e.checkmark, { renderByDefault: true, elementType: "span" }), onClick: (i) => {
    var l;
    o?.(i, r, n, s), (l = e.onClick) === null || l === void 0 || l.call(e, i);
  } }, t), name: r, value: n, checked: s };
};
var Nt = (e) => $(e.root, { children: [e.checkmark && R(e.checkmark, {}), e.icon && R(e.icon, {}), e.content && $(e.content, { children: [e.content.children, e.subText && R(e.subText, {})] }), e.secondaryContent && R(e.secondaryContent, {})] });
var U1 = T(S(), 1);
var jr = (e, t) => {
  let { name: o, value: r } = e, n = Me((a) => {
    var i;
    return (((i = a.checkedValues) === null || i === void 0 ? void 0 : i[o]) || []).indexOf(r) !== -1;
  }), s = Me((a) => a.selectRadio);
  return { ...pt({ ...e, role: "menuitemradio", "aria-checked": n, checkmark: P.optional(e.checkmark, { renderByDefault: true, elementType: "span" }), onClick: (a) => {
    var i;
    s?.(a, o, r, n), (i = e.onClick) === null || i === void 0 || i.call(e, a);
  } }, t), checked: n, name: o, value: r };
};
var Dt = (e) => $(e.root, { children: [e.checkmark && R(e.checkmark, {}), e.icon && R(e.icon, {}), e.content && $(e.content, { children: [e.content.children, e.subText && R(e.subText, {})] }), e.secondaryContent && R(e.secondaryContent, {})] });
var Kr = T(S(), 1);
var W1 = ["menuitem", "menuitemcheckbox", "menuitemradio"];
var $1 = W1.map((e) => `[role="${e}"]`).join(",");
var zr = (e, t) => {
  var o, r, n, s, a, i;
  let l = U((I) => I.triggerId), c = U((I) => I.checkedValues), u = U((I) => I.onCheckedValueChange), m = U((I) => I.hasIcons), h = U((I) => I.hasCheckmarks), d = Ve(Ks), f = Kr.useRef(null), g = Xs("MenuList"), y = Kr.useCallback((I, L) => {
    if (!f.current) return;
    let V = Array.from(f.current.querySelectorAll($1));
    q1(V, I.key, L);
  }, []), [x, v] = te({ state: (o = e.checkedValues) !== null && o !== void 0 ? o : d ? c : void 0, defaultState: e.defaultCheckedValues, initialState: {} }), C = (r = e.onCheckedValueChange) !== null && r !== void 0 ? r : d ? u : void 0, b = A((I, L, V, w) => {
    let B = [...x?.[L] || []];
    w ? B.splice(B.indexOf(V), 1) : B.push(V), C?.(I, { name: L, checkedItems: B }), v((j) => ({ ...j, [L]: B }));
  }), _ = A((I, L, V) => {
    let w = [V];
    v((M) => ({ ...M, [L]: w })), C?.(I, { name: L, checkedItems: w });
  });
  return { components: { root: "div" }, root: P.always(Q("div", { ref: X(t, f, g), role: "menu", "aria-labelledby": l, ...e }), { elementType: "div" }), checkedValues: x, hasIcons: (n = (s = e.hasIcons) !== null && s !== void 0 ? s : m) !== null && n !== void 0 ? n : false, hasCheckmarks: (a = (i = e.hasCheckmarks) !== null && i !== void 0 ? i : h) !== null && a !== void 0 ? a : false, hasMenuContext: d, setFocusByFirstCharacter: y, selectRadio: _, toggleCheckbox: b };
};
var q1 = (e, t, o) => {
  let r = e.indexOf(o) + 1;
  r === e.length && (r = 0);
  let n = e.map((l) => {
    var c;
    return (c = l.textContent) === null || c === void 0 ? void 0 : c.charAt(0).toLowerCase();
  }), s = t.toLowerCase(), a = (l) => {
    for (let c = l; c < n.length; c++) if (s === n[c]) return c;
    return -1;
  }, i = a(r);
  i === -1 && (i = a(0)), i > -1 && e[i].focus();
};
var Wr = (e, t) => R(Yu, { value: t.menuList, children: R(e.root, {}) });
var nd = T(S(), 1);
function Ft(e) {
  let { checkedValues: t, hasCheckmarks: o, hasIcons: r, selectRadio: n, setFocusByFirstCharacter: s, toggleCheckbox: a } = e;
  return { menuList: nd.useMemo(() => ({ checkedValues: t, hasCheckmarks: o, hasIcons: r, selectRadio: n, setFocusByFirstCharacter: s, toggleCheckbox: a }), [t, o, r, n, s, a]) };
}
var Zo = T(S(), 1);
var $r = (e, t) => {
  var o;
  let r = U((I) => I.safeZone), n = U((I) => I.menuPopoverRef), s = U((I) => I.setOpen), a = U((I) => I.open), i = U((I) => I.openOnHover), l = U((I) => I.triggerRef), c = Gr(), u = Me((I) => {
    var L;
    return (L = I.shouldCloseOnArrowLeft) !== null && L !== void 0 ? L : true;
  }), m = Zo.useRef(true), [h, d] = Ze(), { dir: f } = ee(), g = f === "ltr" ? nr : sr, y = Zo.useCallback((I) => {
    I && I.addEventListener("mouseover", (L) => {
      m.current && (m.current = false, Ys(n.current, L), h(() => {
        m.current = true;
      }, 250));
    });
  }, [n, h]);
  Zo.useEffect(() => () => d(), [d]);
  let x = (o = U((I) => I.inline)) !== null && o !== void 0 ? o : false, v = U((I) => I.mountNode), C = P.always(Q("div", { role: "presentation", ...e, ref: X(t, n, y) }), { elementType: "div" }), { onMouseEnter: b, onKeyDown: _ } = C;
  return C.onMouseEnter = A((I) => {
    (i || c) && s(I, { open: true, keyboard: false, type: "menuPopoverMouseEnter", event: I }), b?.(I);
  }), C.onKeyDown = A((I) => {
    let L = I.key;
    if (L === at || c && u && L === g) {
      var V;
      a && (!((V = n.current) === null || V === void 0) && V.contains(I.target)) && !I.isDefaultPrevented() && (s(I, { open: false, keyboard: true, type: "menuPopoverKeyDown", event: I }), I.preventDefault());
    }
    if (L === "Tab" && (s(I, { open: false, keyboard: true, type: "menuPopoverKeyDown", event: I }), !c)) {
      var w;
      (w = l.current) === null || w === void 0 || w.focus();
    }
    _?.(I);
  }), { inline: x, mountNode: v, safeZone: r, components: { root: "div" }, root: C };
};
var qr = T(S(), 1);
function r0() {
}
var Yr = (e) => {
  var t;
  let { children: o, disableButtonEnhancement: r = false, focusFirst: n } = e, s = U((E) => E.triggerRef), a = U((E) => E.setOpen), i = U((E) => E.open), l = U((E) => E.triggerId), c = U((E) => E.openOnHover), u = U((E) => E.openOnContext), m = Gr(), h = Me((E) => {
    var D;
    return (D = E.shouldOpenOnArrowRight) !== null && D !== void 0 ? D : true;
  }), d = qr.useRef(false), f = qr.useRef(false), g = qr.useRef(false), { dir: y } = ee(), x = y === "ltr" ? sr : nr, v = Oe(o), C = kl(A(() => {
    m && (f.current = true);
  })), b = (E) => {
    Uo(E) || E.isDefaultPrevented() || u && (E.preventDefault(), a(E, { open: true, keyboard: false, type: "menuTriggerContextMenu", event: E }));
  }, _ = (E) => {
    Uo(E) || u || (a(E, { open: !i, keyboard: d.current, type: "menuTriggerClick", event: E }), d.current = false);
  }, I = (E) => {
    if (Uo(E) || E.isDefaultPrevented()) return;
    let D = E.key;
    !u && (m && h && D === x || !m && D === Do) && a(E, { open: true, keyboard: true, type: "menuTriggerKeyDown", event: E }), D === at && !m && a(E, { open: false, keyboard: true, type: "menuTriggerKeyDown", event: E }), i && D === x && m && h && n?.();
  }, L = (E) => {
    Uo(E) || c && (g.current ? a(E, { open: true, keyboard: false, type: "menuTriggerMouseEnter", event: E }) : f.current && (a(E, { open: true, keyboard: false, ignoreHoverDelay: true, type: "menuTriggerMouseEnter", event: E }), f.current = false));
  }, V = (E) => {
    Uo(E) || c && !g.current && (a(E, { open: true, keyboard: false, type: "menuTriggerMouseMove", event: E }), g.current = true);
  }, w = (E) => {
    Uo(E) || c && a(E, { open: false, keyboard: false, type: "menuTriggerMouseLeave", event: E });
  }, M = { id: l, ...v?.props, ref: X(s, Ue(v), C), onMouseEnter: A((t = v?.props.onMouseEnter) !== null && t !== void 0 ? t : r0), onMouseLeave: A(z(v?.props.onMouseLeave, w)), onContextMenu: A(z(v?.props.onContextMenu, b)), onMouseMove: A(z(v?.props.onMouseMove, V)), onMouseOver: A(z(v?.props.onMouseOver, L)) }, B = { "aria-haspopup": "menu", "aria-expanded": !i && !m ? void 0 : i, ...M, onClick: A(z(v?.props.onClick, _)), onKeyDown: A(z(v?.props.onKeyDown, I)) }, j = Ee(v?.type === "button" || v?.type === "a" ? v.type : "div", B);
  return { isSubmenu: m, children: je(o, u ? M : r ? B : j) };
};
var Uo = (e) => {
  let t = (o) => o.hasAttribute("disabled") || o.hasAttribute("aria-disabled") && o.getAttribute("aria-disabled") === "true";
  return Be(e.target) && t(e.target) ? true : Be(e.currentTarget) && t(e.currentTarget);
};
var id = T(S(), 1);
var Lt = (e) => id.createElement(Ku, { value: e.isSubmenu }, e.children);
var cd = ge(void 0);
var ud = cd.Provider;
var dd = () => Ve(cd);
var Nl = (e) => {
  let t = a0(), { hoverDelay: o = 500, inline: r = false, hasCheckmarks: n = false, hasIcons: s = false, closeOnScroll: a = false, openOnContext: i = false, persistOnItemClick: l = false, openOnHover: c = t, defaultCheckedValues: u, mountNode: m = null } = e, h = ne("menu"), [d, f] = i0(), g = Xe.useRef(null), y = Xe.useRef(null), x = Xe.Children.toArray(e.children), v, C;
  x.length === 2 ? (v = x[0], C = x[1]) : x.length === 1 && (C = x[0]);
  let [b, _] = u0({ hoverDelay: o, setContextTarget: f, triggerRef: g, menuPopoverRef: y, open: e.open, defaultOpen: e.defaultOpen, onOpenChange: e.onOpenChange }), [I, L] = c0({ checkedValues: e.checkedValues, defaultCheckedValues: u, onCheckedValueChange: e.onCheckedValueChange }), V = ut(e.positioning), w = { position: t ? "after" : "below", align: t ? "top" : "start", target: i ? d : void 0, fallbackPositions: t ? s0 : void 0, ...V }, { targetRef: M, containerRef: B } = dt(w), j = X(g, M), E = X(y, B);
  return { inline: r, hoverDelay: o, triggerId: h, isSubmenu: t, openOnHover: c, contextTarget: d, setContextTarget: f, hasCheckmarks: n, hasIcons: s, closeOnScroll: a, menuTrigger: v, menuPopover: C, mountNode: m, triggerRef: j, menuPopoverRef: E, openOnContext: i, open: b, setOpen: _, checkedValues: I, onCheckedValueChange: L, persistOnItemClick: l };
};
var s0 = ["after", "after-bottom", "before-top", "before", "before-bottom", "above"];
var a0 = () => {
  let e = U((o) => o.isSubmenu), t = dd();
  return e || t;
};
var i0 = () => {
  let [e, t] = Xe.useState(void 0), o = A((r) => {
    if (r == null) {
      t(void 0);
      return;
    }
    let n = r instanceof MouseEvent ? r : r.nativeEvent;
    t(l0(n));
  });
  return [e, o];
};
var l0 = (e) => {
  let t = e.clientX, o = e.clientY, r = t + 1, n = o + 1;
  return { getBoundingClientRect() {
    return { left: t, top: o, right: r, bottom: n, x: t, y: o, height: 1, width: 1 };
  } };
};
var c0 = (e) => {
  let [t, o] = te({ state: e.checkedValues, defaultState: e.defaultCheckedValues, initialState: {} }), r = A((n, { name: s, checkedItems: a }) => {
    e.onCheckedValueChange?.(n, { name: s, checkedItems: a }), o((i) => ({ ...i, [s]: a }));
  });
  return [t, r];
};
var u0 = (e) => {
  let { targetDocument: t } = ee(), o = U((h) => h.setOpen), r = A((h, d) => e.onOpenChange?.(h, d)), n = Xe.useRef(false), [s, a] = te({ state: e.open, defaultState: e.defaultOpen, initialState: false }), i = A((h, d) => {
    let f = h instanceof CustomEvent && h.type === Go ? h.detail.nativeEvent : h;
    r?.(f, { ...d }), d.open && h.type === "contextmenu" && e.setContextTarget(h), d.open || e.setContextTarget(void 0), d.bubble && o(h, { ...d }), a(d.open);
  }), [l, c] = Ze(), u = A((h, d) => {
    c(), !(h instanceof Event) && h.persist && h.persist(), !d.ignoreHoverDelay && (h.type === "mouseleave" || h.type === "mouseover" || h.type === "mousemove" || h.type === Go) ? (e.triggerRef.current?.contains(h.target) && (n.current = h.type === "mouseover" || h.type === "mousemove"), l(() => i(h, d), e.hoverDelay)) : i(h, d);
  }), m = Yn();
  return Xe.useEffect(() => {
    s || m || (t?.activeElement === t?.body || e.menuPopoverRef.current?.contains(t?.activeElement ?? null)) && e.triggerRef.current?.focus();
  }, [s, t, e.menuPopoverRef, e.triggerRef]), [s, u];
};
var Dl = Zr;
var pd = T(S(), 1);
var Fl = (e, t) => pd.createElement(zs, { value: t.menu }, e.menuTrigger, e.menuPopover);
var Xr = (e) => {
  let t = Nl(e), o = Dl(t);
  return Fl(t, o);
};
Xr.displayName = "Menu";
var io = T(S(), 1);
var d0 = (e) => {
  let t = e.target;
  return Be(t) ? t.hasAttribute("disabled") || t.getAttribute("aria-disabled") === "true" : false;
};
var p0 = ':is([role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]):not([aria-disabled="true"])';
var ea = (e) => {
  let t = U((u) => u.menuPopoverRef), o = io.useCallback(() => {
    t.current?.querySelector(p0)?.focus();
  }, [t]), r = Yr({ ...e, focusFirst: o }), n = U((u) => u.open), s = U((u) => u.openOnContext), a = U((u) => u.setOpen), { targetDocument: i } = ee();
  if (!r.children || !io.isValidElement(r.children)) return r;
  let l = r.children, c = { "data-open": N(n) };
  if (s && i) {
    let u = e.children, m = io.isValidElement(u) ? u.props.onContextMenu : void 0;
    c.onContextMenu = (h) => {
      if (m?.(h), d0(h) || h.isDefaultPrevented()) return;
      h.preventDefault();
      let d = h.nativeEvent, f = () => a(d, { open: true, type: "menuTriggerContextMenu", event: d });
      if (h.button !== 2) {
        f();
        return;
      }
      i.addEventListener("pointerup", f, { once: true, capture: true });
    };
  }
  return { ...r, children: io.cloneElement(l, c) };
};
var lo = (e) => {
  let t = ea(e);
  return Lt(t);
};
lo.displayName = "MenuTrigger";
lo.isFluentTriggerComponent = true;
var ta = (e, t) => {
  let o = zr(e, t);
  return o.root.focusgroup = "menu block wrap", o;
};
var md = T(S(), 1);
var oa = (e, t) => md.createElement(ud, { value: true }, Wr(e, t));
var Jr = Z("MenuList", ta, oa, Ft);
var ra = (e, t) => {
  let o = pt(e, t);
  return o.root.focusgroupstart = "", o.root["data-disabled"] = N(o.disabled), o.root["data-has-submenu"] = N(o.hasSubmenu), o.root["data-submenu-open"] = N(o.submenuOpen), o;
};
var Qr = Z("MenuItem", ra, Et);
var na = (e, t) => {
  let o = Ur(e, t);
  return o.root["data-disabled"] = N(o.disabled), o.root["data-has-submenu"] = N(o.hasSubmenu), o.root["data-submenu-open"] = N(o.submenuOpen), o.root["data-checked"] = N(o.checked), o;
};
var en = Z("MenuItemCheckbox", na, Nt);
var sa = (e, t) => {
  let o = jr(e, t);
  return o.root["data-disabled"] = N(o.disabled), o.root["data-has-submenu"] = N(o.hasSubmenu), o.root["data-submenu-open"] = N(o.submenuOpen), o.root["data-checked"] = N(o.checked), o;
};
var tn = Z("MenuItemRadio", sa, Dt);
var on = Z("MenuDivider", Mt, Rt);
var bd = T(S(), 1);
var fd = typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("selector(:popover-open)");
var aa = (e, t) => {
  let o = $r(e, t), r = { ...o, root: { popover: "auto", ...o.root } }, n = U((i) => i.open), s = U((i) => i.setOpen), a = U((i) => i.menuPopoverRef);
  return bd.useEffect(() => {
    let i = a.current;
    if (!i || typeof i.showPopover != "function") return;
    if (!n) {
      if (fd && !i.matches(":popover-open")) return;
      i.hidePopover();
      return;
    }
    i.querySelector(':is([role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]):not([aria-disabled="true"])')?.setAttribute("autofocus", ""), fd && i.matches(":popover-open") || i.showPopover();
    let c = i.querySelector("[focusgroup]");
    c && c.setAttribute("focusgroup", c.getAttribute("focusgroup") ?? "");
    let u = (m) => {
      m.newState === "closed" && n && s(m, { open: false, type: "clickOutside", event: m });
    };
    return i.addEventListener("toggle", u), () => i.removeEventListener("toggle", u);
  }, [a, n, s]), r;
};
var ia = (e) => $(tr.Fragment, { children: [R(e.root, {}), e.safeZone] });
var rn = Z("MenuPopover", aa, ia);
var nn = Z("MenuGroup", _t, Pt, kt);
var sn = Z("MenuGroupHeader", At, wt);
var hd = ge(void 0);
var f0 = { openItems: [], collapsible: false, multiple: false, navigation: void 0, requestToggle() {
} };
var { Provider: xd } = hd;
var co = (e) => Ie(hd, (t = f0) => e(t));
var uo = (e, t) => R(e.root, { children: R(xd, { value: t.accordion, children: e.root.children }) });
var vd = T(S(), 1);
var an = (e, t) => {
  let { openItems: o, defaultOpenItems: r, multiple: n = false, collapsible: s = false, onToggle: a, ...i } = e, [l, c] = te({ state: vd.useMemo(() => x0(o), [o]), defaultState: r && (() => b0({ defaultOpenItems: r, multiple: n })), initialState: [] }), u = A((m) => {
    let h = h0(m.value, l, n, s);
    a?.(m.event, { value: m.value, openItems: h }), c(h);
  });
  return { collapsible: s, multiple: n, openItems: l, requestToggle: u, components: { root: "div" }, root: P.always({ ref: t, ...i }, { elementType: "div" }) };
};
function b0({ defaultOpenItems: e, multiple: t }) {
  return e !== void 0 ? Array.isArray(e) ? t ? e : [e[0]] : [e] : [];
}
function h0(e, t, o, r) {
  if (o) if (t.includes(e)) {
    if (t.length > 1 || r) return t.filter((n) => n !== e);
  } else return [...t, e].sort();
  else return t[0] === e && r ? [] : [e];
  return t;
}
function x0(e) {
  if (e !== void 0) return Array.isArray(e) ? e : [e];
}
var gd = T(S(), 1);
function ln(e) {
  let { navigation: t, openItems: o, requestToggle: r, multiple: n, collapsible: s } = e;
  return { accordion: gd.useMemo(() => ({ navigation: t, openItems: o, requestToggle: r, collapsible: s, multiple: n }), [t, o, r, s, n]) };
}
var cn = (e, t) => {
  let { value: o, disabled: r = false, ...n } = e, s = co((l) => l.requestToggle), a = co((l) => l.openItems.includes(o)), i = A((l) => s({ event: l, value: o }));
  return { open: a, value: o, disabled: r, onHeaderClick: i, components: { root: "div" }, root: P.always({ disabled: r, ref: t, ...n }, { elementType: "div" }) };
};
var Td = T(S(), 1);
function Bt(e) {
  let { disabled: t, open: o, value: r, onHeaderClick: n } = e;
  return { accordionItem: Td.useMemo(() => ({ disabled: t, open: o, value: r, onHeaderClick: n }), [t, o, r, n]) };
}
var la = T(S(), 1);
var yd = la.createContext(void 0);
var T0 = { open: false, disabled: false, value: void 0, onHeaderClick() {
} };
var { Provider: Sd } = yd;
var un = () => {
  var e;
  return (e = la.useContext(yd)) !== null && e !== void 0 ? e : T0;
};
var Ot = (e, t) => R(e.root, { children: R(Sd, { value: t.accordionItem, children: e.root.children }) });
var M0 = T(S(), 1);
var dn = (e, t) => {
  let { icon: o, button: r, expandIcon: n, expandIconPosition: s = "start", ...a } = e, { value: i, disabled: l, open: c } = un(), u = co((d) => d.requestToggle), m = co((d) => !d.collapsible && d.openItems.length === 1 && c), h = P.always(r, { elementType: "button", defaultProps: { disabled: l, disabledFocusable: m, "aria-expanded": c, type: "button" } });
  return h.onClick = A((d) => {
    if (Zn(r)) {
      var f;
      (f = r.onClick) === null || f === void 0 || f.call(r, d);
    }
    d.defaultPrevented || u({ value: i, event: d });
  }), { disabled: l, open: c, expandIconPosition: s, components: { root: "div", button: "button", expandIcon: "span", icon: "div" }, root: P.always({ ref: t, ...a }, { elementType: "div" }), icon: P.optional(o, { elementType: "div" }), expandIcon: P.optional(n, { renderByDefault: true, defaultProps: { "aria-hidden": true }, elementType: "span" }), button: Ee(h.as, h) };
};
var Ll = T(S(), 1);
var R0 = Ll.createContext(void 0);
var { Provider: Id } = R0;
var Vt = (e, t) => R(Id, { value: t.accordionHeader, children: R(e.root, { children: $(e.button, { children: [e.expandIconPosition === "start" && e.expandIcon && R(e.expandIcon, {}), e.icon && R(e.icon, {}), e.root.children, e.expandIconPosition === "end" && e.expandIcon && R(e.expandIcon, {})] }) }) });
var Md = T(S(), 1);
function pn(e) {
  let { disabled: t, expandIconPosition: o, open: r, size: n } = e;
  return { accordionHeader: Md.useMemo(() => ({ disabled: t, expandIconPosition: o, open: r, size: n }), [t, o, r, n]) };
}
var mn = (e, t) => {
  let { open: o } = un();
  return { open: o, components: { root: "div" }, root: P.always({ ref: t, ...e, ...o ? {} : { tabIndex: -1, inert: true } }, { elementType: "div" }) };
};
var fn = (e) => e.collapseMotion ? R(e.collapseMotion, { children: R(e.root, {}) }) : R(e.root, {});
var Bl = (e, t) => {
  let o = an(e, t);
  return o.root["data-collapsible"] = N(o.collapsible), o.root["data-multiple"] = N(o.multiple), o;
};
var Ol = ln;
var ca = Z("Accordion", Bl, uo, Ol);
var ua = (e, t) => {
  let o = dn(e, t);
  return o.root["data-open"] = N(o.open), o.root["data-disabled"] = N(o.disabled), o.root["data-expand-icon-position"] = o.expandIconPosition, o;
};
var da = pn;
var bn = Z("AccordionHeader", ua, Vt, da);
var pa = (e, t) => {
  let o = cn(e, t);
  return o.root["data-disabled"] = N(o.disabled), o.root["data-open"] = N(o.open), o;
};
var hn = Z("AccordionItem", pa, Ot, Bt);
var xn = (e, t) => {
  let o = mn(e, t);
  return o.root["data-open"] = N(o.open), o;
};
var vn = (e) => fn(e);
var mt = T(S(), 1);
var Vl = (e) => {
  let t = zn(), { targetDocument: o } = ee(), [r, n] = te({ state: e.visible, initialState: false }), { children: s, content: a, positioning: i = "above", withArrow: l = false, onVisibleChange: c, relationship: u, showDelay: m = 250, hideDelay: h = 250 } = e, d = { positioning: i, showDelay: m, hideDelay: h, relationship: u, visible: r, shouldRenderTooltip: r, withArrow: l, components: { content: "div" }, content: P.always(a, { defaultProps: { role: "tooltip", popover: "hint" }, elementType: "div" }) }, f = ut(i), { targetRef: g, containerRef: y } = dt(f);
  d.content.id = ne("tooltip-", d.content.id), d.content["data-open"] = N(d.visible);
  let x = X(d.content.ref, y);
  d.content.ref = x;
  let [v, C] = Ze(), b = mt.useCallback((K, k) => {
    C(), n((H) => (k.visible !== H && c?.(K, k), k.visible));
  }, [C, n, c]), _ = A((K) => {
    K.newState === "closed" && b(void 0, { visible: false });
  });
  le(() => {
    let K = x.current;
    if (K) {
      K.addEventListener("toggle", _);
      try {
        r ? K.showPopover() : K.matches(":popover-open") && K.hidePopover();
      } catch {
      }
      return () => {
        K.removeEventListener("toggle", _);
      };
    }
  }, [x, r, b, _]);
  let I = mt.useRef(false), L = mt.useCallback((K) => {
    if (K.type === "focus" && I.current) {
      I.current = false;
      return;
    }
    v(() => {
      b(K, { visible: true });
    }, d.showDelay), K.persist();
  }, [v, b, d.showDelay]), V = ss(), [w] = mt.useState(() => {
    let K = (H) => {
      H.detail?.isFocusedProgrammatically && !V() && (I.current = true);
    }, k = null;
    return (H) => {
      k?.removeEventListener(We, K), H?.addEventListener(We, K), k = H;
    };
  }), M = mt.useCallback((K) => {
    let k = d.hideDelay;
    K.type === "blur" && (k = 0, I.current = o?.activeElement === K.target), v(() => {
      b(K, { visible: false });
    }, k), K.persist();
  }, [v, b, d.hideDelay, o]), B = mt.useCallback((K) => {
    b(K, { visible: false });
  }, [b]);
  d.content.onPointerEnter = z(d.content.onPointerEnter, C), d.content.onPointerLeave = z(d.content.onPointerLeave, M), d.content.onFocus = z(d.content.onFocus, C), d.content.onBlur = z(d.content.onBlur, M), d.content.onPointerUp = z(d.content.onPointerUp, B);
  let j = Oe(s), E = {}, D = j?.props?.["aria-haspopup"] && (j?.props?.["aria-expanded"] === true || j?.props?.["aria-expanded"] === "true");
  return u === "label" ? typeof d.content.children == "string" ? E["aria-label"] = d.content.children : (E["aria-labelledby"] = d.content.id, d.shouldRenderTooltip = true) : u === "description" && (E["aria-describedby"] = d.content.id, d.shouldRenderTooltip = true), (t || D) && (d.shouldRenderTooltip = false), d.children = je(s, { ...E, ...j?.props, ref: X(Ue(j), w, f.target === void 0 ? g : void 0), onPointerEnter: A(z(j?.props?.onPointerEnter, L)), onPointerLeave: A(z(j?.props?.onPointerLeave, M)), onFocus: A(z(j?.props?.onFocus, L)), onBlur: A(z(j?.props?.onBlur, M)), onPointerUp: A(z(j?.props?.onPointerUp, B)) }), d;
};
var Hl = (e) => $(tr.Fragment, { children: [e.children, e.shouldRenderTooltip && $(e.content, { children: [e.withArrow && R("div", { ref: e.arrowRef, className: e.arrowClassName, "data-arrow": "" }), e.content.children] })] });
var jo = (e) => {
  let t = Vl(e);
  return Hl(t);
};
jo.displayName = "Tooltip";
jo.isFluentTriggerComponent = true;
var ma = { sliderDirectionVar: "--fui-Slider--direction", sliderInnerThumbRadiusVar: "--fui-Slider__inner-thumb--radius", sliderProgressVar: "--fui-Slider--progress", sliderProgressColorVar: "--fui-Slider__progress--color", sliderRailSizeVar: "--fui-Slider__rail--size", sliderRailColorVar: "--fui-Slider__rail--color", sliderStepsPercentVar: "--fui-Slider--steps-percent", sliderThumbColorVar: "--fui-Slider__thumb--color", sliderThumbSizeVar: "--fui-Slider__thumb--size" };
var { sliderStepsPercentVar: F0, sliderProgressVar: L0, sliderDirectionVar: B0 } = ma;
var fa = (e, t) => {
  let { min: o = 0, max: r = 100, step: n } = t, { dir: s } = ee(), [a, i] = te({ state: t.value, defaultState: t.defaultValue, initialState: 0 }), l = Qo(a, o, r), c = Xn(l, o, r), u = e.input.onChange, m = t.onChange, h = A((g) => {
    let y = Number(g.target.value);
    i(Qo(y, o, r)), u && u !== m ? u(g) : m && m(g, { value: y });
  }), d = n && n > 0 ? `${n * 100 / (r - o)}%` : void 0, f = { [B0]: e.vertical ? "0deg" : s === "ltr" ? "90deg" : "270deg", [L0]: `${c}%`, ...d !== void 0 && { [F0]: d } };
  return e.root.style = { ...f, ...e.root.style }, e.input.value = l, e.input.onChange = h, e;
};
var gn = (e, t) => {
  e = ve(e, { supportsLabelFor: true });
  let o = Te({ props: e, primarySlotTagName: "input", excludedPropNames: ["onChange"] }), { disabled: r, vertical: n, root: s, input: a, rail: i, thumb: l } = e, c = { disabled: r, vertical: n, components: { input: "input", rail: "div", root: "div", thumb: "div" }, root: P.always(s, { defaultProps: o.root, elementType: "div" }), input: P.always(a, { defaultProps: { id: ne("slider-", e.id), ref: t, ...o.primary, type: "range", orient: n ? "vertical" : void 0 }, elementType: "input" }), rail: P.always(i, { elementType: "div" }), thumb: P.always(l, { elementType: "div" }) };
  return c.input["aria-orientation"] === void 0 && (c.input["aria-orientation"] = c.vertical ? "vertical" : "horizontal"), c.root.ref = X(c.root.ref, $e()), fa(c, e), c;
};
var Ht = (e) => $(e.root, { children: [R(e.input, {}), R(e.rail, {}), R(e.thumb, {})] });
var ba = (e, t) => {
  let o = gn(e, t);
  return o.root["data-disabled"] = N(o.disabled), o.root["data-vertical"] = N(o.vertical), o;
};
var G0 = { activeOption: void 0, focusVisible: false, multiselect: false, getOptionById() {
}, getOptionsMatchingValue() {
  return [];
}, registerOption() {
  return () => {
  };
}, selectedOptions: [], onOptionClick() {
}, onActiveDescendantChange() {
}, selectOption() {
}, setActiveOption() {
} };
var Gt = ge(void 0);
var ye = (e) => Ie(Gt, (t = G0) => e(t));
var xB = Gt.Provider;
var kd = T(S(), 1);
function po(e) {
  let t = Ve(Gt), { getOptionById: o, getOptionsMatchingValue: r, multiselect: n, registerOption: s, selectedOptions: a, selectOption: i, activeDescendantController: l } = e, c = ye((g) => g.registerOption), u = ye((g) => g.onOptionClick), m = ye((g) => g.onActiveDescendantChange), d = { activeOption: void 0, focusVisible: false, getOptionById: o, getOptionsMatchingValue: r, multiselect: n, registerOption: t ? c : s, selectedOptions: a, selectOption: i, setActiveOption: () => {
  }, onOptionClick: u, onActiveDescendantChange: m }, f = kd.useMemo(() => ({ controller: l }), [l]);
  return { listbox: d, activeDescendant: f };
}
var ft = T(S(), 1);
function Ad(e, t = {}) {
  let { open: o = true, multiselect: r = false } = t, n = e.key, { altKey: s, ctrlKey: a, key: i, metaKey: l } = e;
  return i.length === 1 && n !== " " && !s && !a && !l ? "Type" : o ? n === ar && s || n === qe || !r && n === " " ? "CloseSelect" : r && n === " " ? "Select" : n === at ? "Close" : n === Do ? "Next" : n === ar ? "Previous" : n === Li ? "First" : n === "End" ? "Last" : n === Oi ? "PageUp" : n === Bi ? "PageDown" : n === "Tab" ? "Tab" : "None" : n === Do || n === ar || n === qe || n === " " ? "Open" : "None";
}
var Ko = T(S(), 1);
var wd = () => {
  let e = Ko.useRef(/* @__PURE__ */ new Map()), t = Ko.useMemo(() => ({ getCount: () => e.current.size, getOptionAtIndex: () => {
  }, getIndexOfId: () => -1, getOptionById: (c) => e.current.get(c), getOptionsMatchingText: (c) => Array.from(e.current.values()).filter(({ text: u }) => c(u)), getOptionsMatchingValue: (c) => {
    let u = [];
    for (let m of e.current.values()) c(m.value) && u.push(m);
    return u;
  } }), []), o = Ko.useCallback((r) => (e.current.set(r.id, r), () => e.current.delete(r.id)), []);
  return { ...t, options: Array.from(e.current.values()), registerOption: o };
};
var Ed = T(S(), 1);
var Nd = (e) => {
  let { defaultSelectedOptions: t, multiselect: o, onOptionSelect: r } = e, [n, s] = te({ state: e.selectedOptions, defaultState: t, initialState: [] }), a = Ed.useCallback((l, c) => {
    if (c.disabled) return;
    let u = [c.value];
    if (o) {
      let m = n.findIndex((h) => h === c.value);
      m > -1 ? u = [...n.slice(0, m), ...n.slice(m + 1)] : u = [...n, c.value];
    }
    s(u), r?.(l, { optionValue: c.value, optionText: c.text, selectedOptions: u });
  }, [r, o, n, s]);
  return { clearSelection: (l) => {
    s([]), r?.(l, { optionValue: void 0, optionText: void 0, selectedOptions: [] });
  }, selectOption: a, selectedOptions: n };
};
function Dd(e) {
  return e.role === "option" || e.role === "menuitemcheckbox";
}
var Fd = { activeOption: void 0, focusVisible: false, setActiveOption: () => null };
var Cn = (e, t) => {
  let { multiselect: o, disableAutoFocus: r = false } = e, n = wd(), { listboxRef: s, activeParentRef: a, controller: i } = ds({ matchOption: Dd }), l = Ve(Gt), c = ye((D) => D.onActiveDescendantChange), u = ye((D) => D.getOptionById), m = ye((D) => D.getOptionsMatchingValue), h = l ? u : n.getOptionById, d = l ? m : n.getOptionsMatchingValue, f = ft.useMemo(() => {
    let D = null, K = (k) => {
      c?.(k);
    };
    return (k) => {
      if (!k) {
        D?.removeEventListener("activedescendantchange", K);
        return;
      }
      D = k, D.addEventListener("activedescendantchange", K);
    };
  }, [c]), [g, y] = ft.useState(false);
  No(y);
  let x = Fo(), v = cs(), C = v ? x.controller : i, { clearSelection: b, selectedOptions: _, selectOption: I } = Nd(e), L = (D) => {
    let K = Ad(D, { open: true }), k = C.active(), H = k ? h(k) : null;
    switch (K) {
      case "First":
      case "Last":
      case "Next":
      case "Previous":
      case "PageDown":
      case "PageUp":
      case "CloseSelect":
      case "Select":
        D.preventDefault();
        break;
    }
    switch (K) {
      case "Next":
        H ? C.next() : C.first();
        break;
      case "Previous":
        H ? C.prev() : C.first();
        break;
      case "PageUp":
      case "First":
        C.first();
        break;
      case "PageDown":
      case "Last":
        C.last();
        break;
      case "Select":
      case "CloseSelect":
        H && I(D, H);
        break;
    }
  }, V = ye((D) => D.selectedOptions), w = ye((D) => D.selectOption), M = l ? { selectedOptions: V, selectOption: w, ...Fd } : { selectedOptions: _, selectOption: I, ...Fd };
  ft.useEffect(() => {
    if (!v) {
      if (C.hideFocusVisibleAttributes(), !r) if (!o && M.selectedOptions.length > 0) {
        let D = d((K) => K === M.selectedOptions[0]).pop();
        D?.id && C.focus(D.id);
      } else C.first();
      return () => {
        C.blur();
      };
    }
  }, []);
  let B = ft.useCallback(() => {
    v || (C.showFocusVisibleAttributes(), g && C.scrollActiveIntoView());
  }, [C, v, g]), j = ft.useCallback(() => {
    v || C.hideFocusVisibleAttributes();
  }, [C, v]), E = { components: { root: "div" }, root: P.always(Q("div", { ref: X(t, a, s, f), role: o ? "menu" : "listbox", tabIndex: 0, ...e }), { elementType: "div" }), standalone: !l, multiselect: o, clearSelection: b, activeDescendantController: C, onActiveDescendantChange: c, ...n, ...M };
  return E.root.onKeyDown = A(z(E.root.onKeyDown, L)), E.root.onFocus = A(z(E.root.onFocus, B)), E.root.onBlur = A(z(E.root.onBlur, j)), E;
};
var bt = (e, t) => R(ls, { value: t.activeDescendant, children: R(Gt.Provider, { value: t.listbox, children: R(e.root, {}) }) });
var ht = T(S(), 1);
function K0(e, t) {
  if (e !== void 0) return e;
  let o = "", r = false;
  return ht.Children.forEach(t, (n) => {
    typeof n == "string" ? o += n : r = true;
  }), r && console.warn("Provide a `text` prop to Option components when they contain non-string children."), o;
}
var Tn = (e, t) => {
  let { children: o, disabled: r, text: n, value: s } = e, a = ht.useRef(null), i = K0(n, o), l = s ?? i, c = ne("fluent-option", e.id), u = ht.useMemo(() => ({ id: c, disabled: r, text: i, value: l }), [c, r, i, l]), { controller: m } = Fo(), h = ye((C) => C.multiselect), d = ye((C) => C.registerOption), f = ye((C) => {
    let b = C.selectedOptions;
    return l !== void 0 && b.find((_) => _ === l) !== void 0;
  }), g = ye((C) => C.selectOption), y = ye((C) => C.onOptionClick), x = (C) => {
    var b;
    if (r) {
      C.preventDefault();
      return;
    }
    m.focus(c), g(C, u), y(C), (b = e.onClick) === null || b === void 0 || b.call(e, C);
  };
  ht.useEffect(() => {
    if (c && a.current) return d(u, a.current);
  }, [c, u, d]);
  let v = h ? { role: "menuitemcheckbox", "aria-checked": f } : { role: "option", "aria-selected": f };
  return { components: { root: "div", checkIcon: "span" }, root: P.always(Q("div", { ref: X(t, a), "aria-disabled": r ? "true" : void 0, id: c, ...v, ...e, onClick: x }), { elementType: "div" }), checkIcon: P.optional(e.checkIcon, { renderByDefault: true, defaultProps: { "aria-hidden": "true" }, elementType: "span" }), disabled: r, multiselect: h, selected: f, focusVisible: false, active: false };
};
var Zt = (e) => $(e.root, { children: [e.checkIcon && R(e.checkIcon, {}), e.root.children] });
var yn = (e, t) => {
  let o = Cn(e, t);
  return { ...o, root: { popover: "auto", ...o.root } };
};
var ha = (e, t) => {
  let o = Tn(e, t);
  return { ...o, root: { ...o.root, "data-disabled": N(o.disabled), "data-selected": N(o.selected), "data-multiselect": N(o.multiselect) } };
};
var Sn = Z("Option", ha, Zt);
var oe = { INFERRED_ROLE: "data-fg-ir", ITEM: "data-fg-item", AUTHOR_TABINDEX: "data-fg-ati", SEGMENT: "data-fg-seg", SEGMENT_START: "data-fg-segs" };
var Pe = { TOOLBAR: "toolbar", TABLIST: "tablist", RADIOGROUP: "radiogroup", LISTBOX: "listbox", MENU: "menu", MENUBAR: "menubar", NONE: "none" };
var Bd = [Pe.TOOLBAR, Pe.TABLIST, Pe.RADIOGROUP, Pe.LISTBOX, Pe.MENU, Pe.MENUBAR, Pe.NONE];
var Gl = { toolbar: { ownerRole: "toolbar", childRole: null, wrap: false, axis: "inline" }, tablist: { ownerRole: "tablist", childRole: "tab", wrap: true, axis: "inline" }, radiogroup: { ownerRole: "radiogroup", childRole: "radio", wrap: true, axis: void 0 }, listbox: { ownerRole: "listbox", childRole: "option", wrap: false, axis: "block" }, menu: { ownerRole: "menu", childRole: "menuitem", wrap: true, axis: "block" }, menubar: { ownerRole: "menubar", childRole: "menuitem", wrap: true, axis: "inline" } };
function zo(e, t) {
  if (!e || !t) return null;
  if (e instanceof ShadowRoot) return zo(e.host, t);
  let o = e.assignedSlot;
  return o ? e.matches(t) ? e : zo(o, t) : e.closest(t) ?? (e.getRootNode() instanceof ShadowRoot ? zo(e.getRootNode().host, t) : null);
}
function Fe(e, t) {
  if (!e || !t) return false;
  let o = t;
  for (; o; ) {
    if (o === e) return true;
    typeof o.assignedElements != "function" && o.assignedSlot?.parentNode ? o = o.assignedSlot?.parentNode : o.nodeType === document.DOCUMENT_FRAGMENT_NODE ? o = o.host : o = o.parentNode;
  }
  return false;
}
function In(e) {
  if (!e) return null;
  if (typeof e.assignedElements != "function" && e.assignedSlot) return e.assignedSlot;
  let t = e.getRootNode();
  return t instanceof ShadowRoot ? e.parentElement ?? t.host : e.parentElement;
}
function Zl(e) {
  return e ? e.lastElementChild ?? Zl(e.shadowRoot) : null;
}
function Od(e) {
  let t = null;
  for (let o = Zl(e); o; o = Zl(o)) t = o;
  return t;
}
var Y0 = class {
  filter;
  root;
  whatToShow;
  get currentNode() {
    return this.#e;
  }
  set currentNode(e) {
    if (!Fe(this.root, e)) throw new Error("Cannot set currentNode to a node that is not contained by the root node.");
    this.#e = e, this.#o = null, this.#s = null, this.#i(), this.#a = false;
  }
  #t;
  #e;
  #o = null;
  #s = null;
  #r = [];
  #n = /* @__PURE__ */ new WeakSet();
  #a = true;
  constructor(e, t, o, r) {
    this.#t = e, this.root = t, this.filter = r ?? null, this.whatToShow = o ?? NodeFilter.SHOW_ALL, this.#e = t;
  }
  nextNode() {
    this.#a || (this.#o = null, this.#i(), this.#a = true), this.#o === null && (this.#o = this.#u(true));
    let e = this.#e, t = this.#m();
    return t === null && (this.#e = e, this.#o = null, this.#i()), t;
  }
  previousNode() {
    this.#a && (this.#s = null, this.#i(), this.#a = false), this.#s === null && (this.#s = this.#u(false));
    let e = this.#e, t = this.#f();
    return t === null && (this.#e = e, this.#s = null, this.#i()), t;
  }
  #i() {
    this.#r = [], this.#n = /* @__PURE__ */ new WeakSet();
  }
  #l = (e) => typeof this.filter == "function" ? this.filter(e) : this.filter?.acceptNode ? this.filter.acceptNode(e) : NodeFilter.FILTER_ACCEPT;
  #c(e, t) {
    return this.#t.createTreeWalker(e, this.whatToShow, { acceptNode: this.#d(t) });
  }
  #d(e) {
    return (t) => {
      if (t.nodeType === Node.ELEMENT_NODE) {
        if (t.parentNode?.shadowRoot) return NodeFilter.FILTER_REJECT;
        if (t.localName === "slot" && t.getRootNode() instanceof ShadowRoot) return NodeFilter.FILTER_ACCEPT;
        let o = t.shadowRoot;
        if (o) {
          if (e) {
            let r = this.#o[0];
            if (!r || r.walker.root !== o) {
              let n = this.#c(o, true);
              this.#o.unshift({ walker: n, hostNode: t });
            }
          }
          return NodeFilter.FILTER_ACCEPT;
        } else return this.#l(t);
      }
      return NodeFilter.FILTER_SKIP;
    };
  }
  #u(e) {
    Fe(this.root, this.#e) || (this.#e = this.root);
    let t = [], o = this.#e, r = this.#e, n = (l) => {
      let c = l.assignedSlot;
      if (!c || !Fe(this.root, c)) return [];
      let u = [...c.assignedElements({ flatten: true })], m = u.indexOf(l), h = [];
      return e ? m >= 0 && m < u.length - 1 && (h = u.slice(m + 1)) : m > 0 && (h = u.slice(0, m).reverse()), o = r = c, h;
    }, s = n(this.#e);
    for (this.#r = s; o && o !== this.root; ) if (o.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      let l = o, c = this.#c(l, e);
      c.currentNode = r, t.push({ walker: c, hostNode: l.host }), o = r = l.host;
      let u = n(o);
      u.length && (t[t.length - 1].savedSlotted = u);
    } else o = o.parentNode;
    let a = this.#c(this.root, e);
    a.currentNode = r, t.push({ walker: a, hostNode: null });
    let i = this.root.shadowRoot;
    if (i && !t.some((l) => l.walker.root === i)) {
      let l = this.#c(i, e);
      t.unshift({ walker: l, hostNode: this.root });
    }
    if (e && this.#e !== this.root) {
      let l = this.#e.shadowRoot;
      if (l && !t.some((c) => c.walker.root === l)) {
        let c = { walker: this.#c(l, e), hostNode: this.#e };
        s.length && (c.savedSlotted = s, this.#r = []), t.unshift(c);
      }
    }
    return t;
  }
  #m() {
    for (; ; ) {
      if (this.#r.length > 0) {
        let o = this.#r.shift();
        if (o.shadowRoot) {
          let n = this.#l(o);
          if (n === NodeFilter.FILTER_REJECT) continue;
          let s = o.shadowRoot, a = this.#c(s, true), i = this.#r;
          if (this.#r = [], this.#o.unshift({ walker: a, hostNode: o, savedSlotted: i }), n === NodeFilter.FILTER_ACCEPT) return this.#e = o, o;
          continue;
        }
        let r = this.#l(o);
        if (r !== NodeFilter.FILTER_REJECT && o.firstElementChild && this.#r.unshift(...o.children), r === NodeFilter.FILTER_ACCEPT) return this.#e = o, o;
        continue;
      }
      let e = this.#o[0];
      if (!e) return null;
      let t = e.walker.nextNode();
      if (t) {
        if (t.localName === "slot") {
          this.#r = [...t.assignedElements({ flatten: true })];
          continue;
        }
        if (t.shadowRoot) {
          if (this.#l(t) === NodeFilter.FILTER_ACCEPT) return this.#e = t, t;
          continue;
        }
        return this.#e = t, t;
      } else if (this.#o.length > 1) {
        let o = this.#o.shift();
        o.savedSlotted?.length && (this.#r = o.savedSlotted);
      } else return null;
    }
  }
  #f() {
    for (; ; ) {
      if (this.#r.length > 0) {
        let o = this.#r.shift();
        if (o.shadowRoot) {
          if (this.#l(o) === NodeFilter.FILTER_REJECT) continue;
          this.#e = o;
          let n = this.#r;
          this.#r = [], this.#s.unshift({ walker: this.#c(o.shadowRoot, false), hostNode: o, savedSlotted: n });
          continue;
        }
        let r = this.#l(o);
        if (r === NodeFilter.FILTER_REJECT) continue;
        if (o.firstElementChild && !this.#n.has(o)) {
          this.#n.add(o), this.#r.unshift(...[...o.children].reverse(), o);
          continue;
        }
        if (r === NodeFilter.FILTER_ACCEPT) return this.#e = o, o;
        continue;
      }
      let e = this.#s[0];
      if (!e) return null;
      if (e.walker.currentNode === e.walker.root && e.walker.root !== this.root) {
        let o = Od(e.walker.root);
        if (o) {
          if (e.walker.currentNode = o, o.localName === "slot") {
            this.#r = [...o.assignedElements({ flatten: true })].reverse();
            continue;
          }
          if (o.shadowRoot) {
            this.#e = o, this.#s.unshift({ walker: this.#c(o.shadowRoot, false), hostNode: o });
            continue;
          }
          if (this.#l(o) === NodeFilter.FILTER_ACCEPT) return this.#e = o, o;
        }
      }
      let t = e.walker.previousNode();
      if (t) {
        if (t.localName === "slot") {
          this.#r = [...t.assignedElements({ flatten: true })].reverse();
          continue;
        }
        if (t.shadowRoot) {
          this.#e = t, this.#s.unshift({ walker: this.#c(t.shadowRoot, false), hostNode: t });
          continue;
        }
        return this.#l(t) === NodeFilter.FILTER_ACCEPT ? (this.#e = t, t) : (this.#e = t, t);
      } else if (this.#s.length > 1) {
        let o = this.#s.shift();
        o.savedSlotted?.length && (this.#r = o.savedSlotted);
        let r = o.hostNode;
        if (r && this.#l(r) === NodeFilter.FILTER_ACCEPT) return this.#e = r, r;
      } else return this.#e !== this.root && this.#l(this.root) === NodeFilter.FILTER_ACCEPT ? (this.#e = this.root, this.root) : null;
    }
  }
};
function mo(e, t, o, r) {
  return new Y0(e, t, o, r);
}
function Ul() {
  return typeof document < "u";
}
function Rn() {
  return "focusgroup" in (globalThis?.HTMLElement?.prototype ?? {}) || "focusGroup" in (globalThis?.HTMLElement?.prototype ?? {});
}
function xa(e) {
  let t = (e.getAttribute("focusgroup") ?? "").split(" "), o = t.find((i) => Bd.includes(i)) ?? null, r = Gl[o], n = r?.wrap ?? false;
  t.includes("wrap") ? n = true : t.includes("nowrap") && (n = false);
  let s = t.includes("inline"), a = s === t.includes("block") ? s ? void 0 : r?.axis : s ? "inline" : "block";
  return { behavior: o, wrap: n, axis: a, memory: !t.includes("nomemory") };
}
var X0 = 0;
function Vd() {
  return String(X0++);
}
function Mn(e, t) {
  return (e.isContentEditable || e.matches(":is(audio, video)[controls]") || e.tabIndex > -1) && !(e.disabled || e.hasAttribute("disabled") || e.matches(":is(a, area):not([href])") || e.inert || !Zd(e, t) || e.matches(":is(audio, video):not([controls])") || e.hasAttribute(oe.AUTHOR_TABINDEX));
}
function Hd(e, t, o) {
  let r = "forward", n = "backward", s = "block", a = "inline";
  if (J0(e.composedPath()[0])) return e.key === "Tab" ? e.shiftKey ? n : r : null;
  if (e.shiftKey || e.ctrlKey || e.metaKey) return null;
  let { writingMode: i, direction: l } = window.getComputedStyle(t), c = !i.startsWith("horizontal-"), u = l === "rtl", m = c ? s : a, h = c ? a : s, d = c ? i.endsWith("-rl") !== u : u, f = c && u, g = { ArrowUp: { axis: h, dir: f ? r : n }, ArrowDown: { axis: h, dir: f ? n : r }, ArrowLeft: { axis: m, dir: d ? r : n }, ArrowRight: { axis: m, dir: d ? n : r }, Home: { dir: "start" }, End: { dir: "end" } }[e.key];
  return !g || o && g.axis && g.axis !== o ? null : g.dir;
}
function J0(e) {
  return e?.nodeType === Node.ELEMENT_NODE && (["INPUT", "TEXTAREA", "SELECT"].includes(e.nodeName) && !["checkbox", "radio"].includes(e.getAttribute("type")) || e.isContentEditable || ["AUDIO", "VIDEO"].includes(e.nodeName) && e.hasAttribute("controls") || ["IFRAME", "OBJECT"].includes(e.nodeName));
}
function Gd(e, t) {
  if (!Zd(e)) return false;
  if (Mn(e, t)) return e.getAttribute("focusgroup").includes(Pe.NONE);
  let o = mo(document, e, NodeFilter.SHOW_ELEMENT);
  for (; o.nextNode(); ) if (o.currentNode !== e && Mn(o.currentNode, t)) return true;
  return false;
}
function Zd(e, t) {
  if ("checkVisibility" in Element.prototype) return e.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true });
  if (e.getClientRects().length === 0) return false;
  let o = e;
  for (; o; ) {
    let { visibility: r, contentVisibility: n } = window.getComputedStyle(o);
    if (["hidden", "collapse"].includes(r) || o !== e && n === "hidden") return false;
    if (!t || o === t) break;
    o = In(o);
  }
  return true;
}
function jl(e, t, o) {
  let r = Q0(e) || o === "child" && e.nodeName === "BUTTON", n = Gl[t], s = r ? o === "owner" ? n?.ownerRole : n?.childRole : void 0;
  s ? (!e.hasAttribute("role") || e.hasAttribute(oe.INFERRED_ROLE)) && (e.setAttribute("role", s), e.setAttribute(oe.INFERRED_ROLE, "")) : e.hasAttribute(oe.INFERRED_ROLE) && (e.removeAttribute("role"), e.removeAttribute(oe.INFERRED_ROLE));
}
function Q0(e) {
  return "computedRole" in HTMLElement.prototype ? e.computedRole === "generic" : ["DIV", "SPAN"].includes(e.nodeName) || e.nodeName.includes("-");
}
globalThis.__FOCUSGROUP_POLYFILL__ ??= { o: /* @__PURE__ */ new Set(), b: false };
var fo = globalThis.__FOCUSGROUP_POLYFILL__;
var va = fo.o;
function ga() {
  for (let e of va) e.takeRecords();
}
var Ud = class {
  #t;
  #e;
  #o = null;
  #s = void 0;
  #r = false;
  #n = true;
  #a;
  #i = null;
  #l = false;
  #c = null;
  #d = new AbortController();
  #u;
  #m;
  constructor(e, t, o = {}) {
    if (Rn() || !e) return;
    this.#t = e, this.#e = t, this.#u = o.decorateOwner, this.#m = o.decorateItem, this.#f(o.definition), this.#u?.(this.#t, this.#o), this.#b();
    let r = { signal: this.#d.signal };
    this.#t.addEventListener("keydown", this.#g.bind(this), r), this.#t.addEventListener("focusin", this.#C.bind(this), r), this.#t.addEventListener("focusout", this.#T.bind(this), r);
  }
  disconnect() {
    this.#p(), this.#d.abort(), this.#e?.disconnect?.(), this.#t = null;
  }
  update(e = {}) {
    if (this.#t) {
      if (e.definition !== void 0 && (this.#f(e.definition), this.#u?.(this.#t, this.#o)), e.authorTabindexChanges) for (let t of e.authorTabindexChanges) t.setAttribute(oe.AUTHOR_TABINDEX, t.getAttribute("tabindex") ?? "none");
      this.#h(), this.#b();
    }
  }
  #f(e) {
    this.#o = e?.behavior ?? null, this.#r = e?.wrap ?? false, this.#s = e?.axis, this.#n = e?.memory ?? true, this.#n || (this.#i = null);
  }
  #b() {
    if (!this.#o || this.#o === Pe.NONE) {
      this.#h();
      return;
    }
    this.#e.decorate?.();
    for (let { element: t, segmentBoundary: o } of this.#e.items()) this.#m?.(t, this.#o), t.setAttribute(oe.AUTHOR_TABINDEX, t.getAttribute("tabindex") ?? "none"), t.tabIndex = o ? 0 : -1;
    (!this.#i?.isConnected || !(this.#e.isItem?.(this.#i) ?? this.#e.contains(this.#i))) && (this.#i = null);
    let e = this.#i ?? this.#e.start ?? this.#e.first?.() ?? null;
    e && (e.tabIndex = 0, this.#a = e, this.#p(), this.#x(e)), this.#e.flush?.();
  }
  #h() {
    this.#p();
    let e = false;
    for (let { element: t } of this.#e.items()) {
      e = true, this.#m?.(t, null);
      let o = t.getAttribute(oe.AUTHOR_TABINDEX);
      o && (o === "none" ? t.removeAttribute("tabindex") : t.setAttribute("tabindex", o), t.removeAttribute(oe.AUTHOR_TABINDEX));
    }
    this.#e.undecorate?.(), e && this.#e.flush?.();
  }
  #g(e) {
    let t = e.composedPath()[0];
    if (e.defaultPrevented || t === this.#t || !this.#e.contains(t)) return;
    let o;
    switch (Hd(e, t, this.#s)) {
      case "start":
        o = this.#e.first();
        break;
      case "end":
        o = this.#e.last();
        break;
      case "forward":
        o = this.#e.next(t), !o && this.#r && (o = this.#e.first());
        break;
      case "backward":
        o = this.#e.previous(t), !o && this.#r && (o = this.#e.last());
        break;
    }
    o && o !== t && (this.#v(t, o, true), this.#i = o, e.preventDefault());
  }
  #C(e) {
    let t = e.composedPath()[0];
    if (t === this.#t && this.#l && (!e.relatedTarget || !Fe(this.#t, e.relatedTarget))) {
      let r = this.#i || this.#a;
      this.#p(), r && r.focus(), e.stopPropagation();
      return;
    }
    if (!this.#e.contains(t)) return;
    this.#l && this.#p();
    let o = this.#i;
    if (this.#i = t, o !== t && t.tabIndex < 0) {
      let r = o ?? this.#a;
      r && this.#v(r, t);
    }
  }
  #T(e) {
    if (!e.relatedTarget || !Fe(this.#t, e.relatedTarget)) {
      let r = this.#n ? this.#i || this.#a : this.#a;
      r && this.#x(r);
    }
    if (e.relatedTarget && Fe(this.#t, e.relatedTarget) || this.#n || !this.#a) return;
    let t = this.#i;
    this.#i = null;
    let o = this.#e.start ?? this.#e.first?.() ?? null;
    if (t !== this.#a || o !== this.#a) {
      for (let { element: r, segmentBoundary: n } of this.#e.items()) r.tabIndex = n ? 0 : -1;
      o && (o.tabIndex = 0, this.#a = o), this.#e.flush?.();
    }
  }
  #x(e) {
    let t = (e.assignedSlot ?? e).getRootNode(), o = t instanceof ShadowRoot && t.host.hasAttribute(oe.AUTHOR_TABINDEX);
    this.#l || !o || (this.#c = this.#t.getAttribute("tabindex"), this.#t.tabIndex = 0, this.#l = true, ga());
  }
  #p() {
    this.#l && (this.#c !== null ? this.#t.setAttribute("tabindex", this.#c) : this.#t.removeAttribute("tabindex"), this.#l = false, this.#c = null, this.#e.flush?.(), ga());
  }
  #v(e, t, o = false) {
    t.tabIndex = 0, o && t.focus(), e.tabIndex = this.#e.sameSegment?.(e, t) ?? true ? -1 : 0, this.#p(), ga();
  }
};
var e5 = class _n {
  static #t = /* @__PURE__ */ new Set();
  #e;
  #o;
  #s;
  #r;
  #n;
  #a = false;
  static #i(t) {
    let o = t.Element.prototype.attachShadow;
    o.__origAttachShadow || (Element.prototype.attachShadow = function(r) {
      let n = o.call(this, r);
      for (let s of _n.#t) s.#c(n);
      return n;
    }, Element.prototype.attachShadow.__origAttachShadow = o);
  }
  constructor(t) {
    this.#s = t, this.#r = new MutationObserver(this.#l), this.#n = /* @__PURE__ */ new Map();
  }
  #l = (t, o) => {
    for (let r of t) if (r.type === "childList") {
      let n = r.removedNodes, s = r.addedNodes;
      for (let a = 0; a < n.length; a++) this.#u(n[a], true);
      for (let a = 0; a < s.length; a++) this.#u(s[a]);
    }
    this.#s(t, o);
  };
  #c(t) {
    if (!(!this.#o || !this.#s || this.#n.has(t)) && this.#o.subtree && Fe(this.#e, t)) {
      let o = new MutationObserver(this.#l);
      this.#n.set(t, o), this.#a && o.observe(t, this.#o), this.#u(t);
    }
  }
  #d(t) {
    let o = this.#n.get(t);
    o && (o.disconnect(), this.#n.delete(t)), this.#n.size || this.#n.clear();
  }
  disconnect() {
    this.#a = false, this.#o = {}, _n.#t.delete(this);
    for (let t of this.#n.keys()) this.#d(t);
    this.#r.disconnect();
  }
  observe(t, o) {
    let r = t.nodeType === Node.DOCUMENT_NODE ? t : t.ownerDocument, n = r?.defaultView;
    !r || !n || (_n.#i(n), _n.#t.add(this), this.#e = t, this.#o = o, this.#a = true, this.#r.observe(t, o), this.#u(t));
  }
  #u(t, o) {
    let r = t.nodeType === Node.DOCUMENT_NODE ? t : t.ownerDocument;
    if (r) {
      if (t === r) t = r.body;
      else {
        let n = t.shadowRoot;
        if (n) {
          if (o) {
            let s = this.#n.get(n);
            s && (s.disconnect(), this.#n.delete(n));
          } else this.#c(n);
          return;
        }
      }
      r.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, { acceptNode: (n) => {
        if (n.nodeType === Node.ELEMENT_NODE) if (o) {
          let s = this.#n.get(n);
          s && (s.disconnect(), this.#n.delete(n));
        } else {
          let s = n.shadowRoot;
          s && this.#c(s);
        }
        return NodeFilter.FILTER_SKIP;
      } }).nextNode();
    }
  }
  takeRecords() {
    let t = this.#r.takeRecords();
    for (let o of this.#n.values()) t.push(...o.takeRecords());
    return t;
  }
};
function Ca(e) {
  return new e5(e);
}
var jd = class {
  id = Vd();
  get start() {
    if (!this.#t) return null;
    let e = null;
    for (let { element: t } of this.items()) {
      if (t.hasAttribute("focusgroupstart")) return t;
      e ??= t;
    }
    return e;
  }
  #t;
  #e;
  #o = null;
  constructor(e) {
    this.#t = e, this.#e = mo(document, this.#t, NodeFilter.SHOW_ELEMENT, (t) => this.#s(t));
  }
  observe(e) {
    this.#o = Ca((t) => {
      let o = this.#a(t);
      o && e.update(o);
    }), this.#o.observe(this.#t, { attributes: true, attributeFilter: ["focusgroup", "focusgroupstart", "controls", "contenteditable", "disabled", "href", "hidden", "tabindex", "type"], childList: true, subtree: true }), va.add(this.#o);
  }
  disconnect() {
    va.delete(this.#o), this.#o?.disconnect(), this.#t = null, this.#e = null, this.#o = null;
  }
  flush() {
    this.#o?.takeRecords();
  }
  decorate() {
    let e = mo(document, this.#t, NodeFilter.SHOW_ELEMENT, (n) => this.#r(n) || this.#n(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP), t = false, o = 0, r = null;
    for (; e.nextNode(); ) {
      let n = e.currentNode;
      if (!(r && Fe(r, n))) {
        if (r = null, this.#n(n)) {
          if (Gd(n, this.#t) && (t = true), n.getAttribute("focusgroup").includes(Pe.NONE)) {
            r = n;
            continue;
          }
          if (!Mn(n, this.#t)) continue;
        }
        n.setAttribute(oe.ITEM, this.id), t ? (o++, n.setAttribute(oe.SEGMENT, String(o)), n.setAttribute(oe.SEGMENT_START, ""), t = false) : o > 0 && n.setAttribute(oe.SEGMENT, String(o));
      }
    }
  }
  *items() {
    for (this.#e.currentNode = this.#t; this.#e.nextNode(); ) {
      let e = this.#e.currentNode;
      yield { element: e, segmentBoundary: e.hasAttribute(oe.SEGMENT_START) };
    }
  }
  undecorate() {
    let e = [];
    for (this.#e.currentNode = this.#t; this.#e.nextNode(); ) e.push(this.#e.currentNode);
    for (let t of e) t.removeAttribute(oe.ITEM), t.removeAttribute(oe.SEGMENT), t.removeAttribute(oe.SEGMENT_START);
  }
  isSegmentStart(e) {
    return e.hasAttribute(oe.SEGMENT_START);
  }
  sameSegment(e, t) {
    return e.getAttribute(oe.SEGMENT) === t.getAttribute(oe.SEGMENT);
  }
  first() {
    return this.#e.currentNode = this.#t, this.#e.nextNode() ?? null;
  }
  last() {
    this.#e.currentNode = this.#t;
    let e = null;
    for (; this.#e.nextNode(); ) e = this.#e.currentNode;
    return e;
  }
  next(e) {
    return this.#e.currentNode = e, this.#e.nextNode() ?? null;
  }
  previous(e) {
    return this.#e.currentNode = e, this.#e.previousNode() ?? null;
  }
  contains(e) {
    return this.#s(e) !== NodeFilter.FILTER_REJECT;
  }
  isItem(e) {
    return e.getAttribute(oe.ITEM) === this.id;
  }
  #s(e) {
    if (e.hasAttribute("focusgroup") && e.getAttribute(oe.ITEM) !== this.id) return NodeFilter.FILTER_REJECT;
    let t = zo(In(e), `[focusgroup]:not([${oe.ITEM}="${this.id}"])`);
    return t && t !== this.#t ? NodeFilter.FILTER_REJECT : this.isItem(e) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  }
  #r(e) {
    return Mn(e, this.#t) && zo(In(e), "[focusgroup]") === this.#t;
  }
  #n(e) {
    return e.hasAttribute("focusgroup") && e !== this.#t;
  }
  #a(e) {
    let t = e.filter((s) => !(s.type === "attributes" && s.attributeName === "tabindex" && (s.target.hasAttribute(oe.AUTHOR_TABINDEX) && s.target.getAttribute(oe.ITEM) !== this.id || s.target === this.#t)));
    if (t.length === 0) return null;
    let o = t.some((s) => s.target === this.#t && s.attributeName === "focusgroup"), r = [];
    for (let s of t) s.type === "childList" && s.removedNodes.length > 0 && r.push(...s.removedNodes);
    let n = [];
    for (let s of t) s.type === "attributes" && s.attributeName === "tabindex" && s.target.hasAttribute(oe.AUTHOR_TABINDEX) && s.target.getAttribute(oe.ITEM) === this.id && n.push(s.target);
    return { definition: o ? xa(this.#t) : void 0, removedNodes: r, authorTabindexChanges: n };
  }
};
var Ut;
if (Ul() && typeof MutationObserver < "u" && !Rn() && (Ut = fo.m ??= /* @__PURE__ */ new Map(), !fo.g)) {
  let e = Ca((t) => {
    for (let o of t) if (o.type === "childList") {
      for (let r of o.removedNodes) Ut.has(r) && (Ut.get(r)?.disconnect(), Ut.delete(r));
      if (fo.b) for (let r of o.addedNodes) r.nodeType === Node.ELEMENT_NODE && Pn(r);
    }
  });
  e.observe(document.body, { childList: true, subtree: true }), fo.g = e;
}
function Pn(e) {
  if (Rn() || !Ul()) return;
  e ??= document.body;
  let t = mo(document, e, NodeFilter.SHOW_ELEMENT, (o) => o.hasAttribute("focusgroup") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP);
  do {
    let o = t.currentNode;
    !o.hasAttribute?.("focusgroup") || Ut.has(o) || (Ut.set(o, null), requestAnimationFrame(() => {
      if (!Ut.has(o)) return;
      let r = new jd(o), n = new Ud(o, r, { definition: xa(o), decorateOwner: (s, a) => jl(s, a, "owner"), decorateItem: (s, a) => jl(s, a, "child") });
      r.observe(n), Ut.set(o, n);
    }));
  } while (t.nextNode());
}
var Kl = T(S(), 1);
function kn(e) {
  "@babel/helpers - typeof";
  return kn = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, kn(e);
}
var t5 = ["aria-hidden", "aria-label", "aria-labelledby", "tabIndex", "className", "fill", "size", "verticalAlign", "id", "title", "style"];
function zl() {
  return zl = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var o = arguments[t];
      for (var r in o) ({}).hasOwnProperty.call(o, r) && (e[r] = o[r]);
    }
    return e;
  }, zl.apply(null, arguments);
}
function Kd(e, t) {
  var o = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(n) {
      return Object.getOwnPropertyDescriptor(e, n).enumerable;
    })), o.push.apply(o, r);
  }
  return o;
}
function o5(e) {
  for (var t = 1; t < arguments.length; t++) {
    var o = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Kd(Object(o), true).forEach(function(r) {
      r5(e, r, o[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(o)) : Kd(Object(o)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(o, r));
    });
  }
  return e;
}
function r5(e, t, o) {
  return (t = n5(t)) in e ? Object.defineProperty(e, t, { value: o, enumerable: true, configurable: true, writable: true }) : e[t] = o, e;
}
function n5(e) {
  var t = s5(e, "string");
  return kn(t) == "symbol" ? t : t + "";
}
function s5(e, t) {
  if (kn(e) != "object" || !e) return e;
  var o = e[Symbol.toPrimitive];
  if (o !== void 0) {
    var r = o.call(e, t || "default");
    if (kn(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function a5(e, t) {
  if (e == null) return {};
  var o, r, n = i5(e, t);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (r = 0; r < s.length; r++) o = s[r], t.indexOf(o) === -1 && {}.propertyIsEnumerable.call(e, o) && (n[o] = e[o]);
  }
  return n;
}
function i5(e, t) {
  if (e == null) return {};
  var o = {};
  for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
    if (t.indexOf(r) !== -1) continue;
    o[r] = e[r];
  }
  return o;
}
var l5 = { small: 16, medium: 32, large: 64 };
function F(e, t, o, r, n) {
  var s = e["aria-hidden"], a = e["aria-label"], i = e["aria-labelledby"], l = e.tabIndex, c = e.className, u = c === void 0 ? "" : c, m = e.fill, h = m === void 0 ? "currentColor" : m, d = e.size, f = d === void 0 ? 16 : d, g = e.verticalAlign, y = g === void 0 ? "text-bottom" : g, x = e.id, v = e.title, C = e.style, b = a5(e, t5), _ = l5[f] || f, I = c5(n, _), L = r[I].width, V = _ * (L / I), w = r[I].path, M = a || i, B = s === void 0 ? M ? void 0 : "true" : s, j = M && B !== "true" ? "img" : void 0;
  return Kl.default.createElement("svg", zl({ ref: t, "data-component": "Octicon" }, b, { "aria-hidden": B, tabIndex: l, focusable: l >= 0 ? "true" : "false", "aria-label": a, "aria-labelledby": i, className: "".concat(o, " ").concat(u).trim(), role: j, viewBox: "0 0 ".concat(L, " ").concat(I), width: V, height: _, fill: h, id: x, display: "inline-block", overflow: "visible", style: o5({ verticalAlign: y }, C) }), v ? Kl.default.createElement("title", null, v) : null, w);
}
function c5(e, t) {
  return e.map(function(o) {
    return parseInt(o, 10);
  }).reduce(function(o, r) {
    return r <= t ? r : o;
  }, e[0]);
}
var bo = T(S(), 1);
var u5 = ["16", "24"];
var d5 = { 16: { width: 16, path: bo.default.createElement("path", { d: "M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" }) }, 24: { width: 24, path: bo.default.createElement(bo.default.Fragment, null, bo.default.createElement("path", { d: "M13 17.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-.25-8.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Z" }), bo.default.createElement("path", { d: "M9.836 3.244c.963-1.665 3.365-1.665 4.328 0l8.967 15.504c.963 1.667-.24 3.752-2.165 3.752H3.034c-1.926 0-3.128-2.085-2.165-3.752Zm3.03.751a1.002 1.002 0 0 0-1.732 0L2.168 19.499A1.002 1.002 0 0 0 3.034 21h17.932a1.002 1.002 0 0 0 .866-1.5L12.866 3.994Z" })) } };
var Ta = bo.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-alert", d5, u5);
});
Ta.displayName = "AlertIcon";
var ya = T(S(), 1);
var p5 = ["16", "24"];
var m5 = { 16: { width: 16, path: ya.default.createElement("path", { d: "M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z" }) }, 24: { width: 24, path: ya.default.createElement("path", { d: "M10.78 19.03a.75.75 0 0 1-1.06 0l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L5.81 11.5h14.44a.75.75 0 0 1 0 1.5H5.81l4.97 4.97a.75.75 0 0 1 0 1.06Z" }) } };
var ho = ya.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-arrow-left", m5, p5);
});
ho.displayName = "ArrowLeftIcon";
var Sa = T(S(), 1);
var f5 = ["16", "24"];
var b5 = { 16: { width: 16, path: Sa.default.createElement("path", { d: "M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z" }) }, 24: { width: 24, path: Sa.default.createElement("path", { d: "M13.22 19.03a.75.75 0 0 1 0-1.06L18.19 13H3.75a.75.75 0 0 1 0-1.5h14.44l-4.97-4.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z" }) } };
var xo = Sa.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-arrow-right", b5, f5);
});
xo.displayName = "ArrowRightIcon";
var Ia = T(S(), 1);
var h5 = ["16", "24"];
var x5 = { 16: { width: 16, path: Ia.default.createElement("path", { d: "M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0Z" }) }, 24: { width: 24, path: Ia.default.createElement("path", { d: "M18.655 10.405a.75.75 0 0 1-1.06 0l-4.97-4.97v14.44a.75.75 0 0 1-1.5 0V5.435l-4.97 4.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l6.25-6.25a.75.75 0 0 1 1.06 0l6.25 6.25a.75.75 0 0 1 0 1.06Z" }) } };
var Ma = Ia.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-arrow-up", x5, h5);
});
Ma.displayName = "ArrowUpIcon";
var Ra = T(S(), 1);
var v5 = ["16", "24"];
var g5 = { 16: { width: 16, path: Ra.default.createElement("path", { d: "M8.75 8.582v5.668a.75.75 0 0 1-1.5 0V8.582a1.75 1.75 0 1 1 1.5 0Zm3.983-7.125a.75.75 0 0 1 1.06.026A7.976 7.976 0 0 1 16 7c0 2.139-.84 4.083-2.207 5.517a.75.75 0 1 1-1.086-1.034A6.474 6.474 0 0 0 14.5 7a6.474 6.474 0 0 0-1.793-4.483.75.75 0 0 1 .026-1.06Zm-9.466 0c.3.286.312.76.026 1.06A6.474 6.474 0 0 0 1.5 7a6.47 6.47 0 0 0 1.793 4.483.75.75 0 0 1-1.086 1.034A7.973 7.973 0 0 1 0 7c0-2.139.84-4.083 2.207-5.517a.75.75 0 0 1 1.06-.026Zm8.556 2.321A4.988 4.988 0 0 1 13 7a4.988 4.988 0 0 1-1.177 3.222.75.75 0 1 1-1.146-.967A3.487 3.487 0 0 0 11.5 7c0-.86-.309-1.645-.823-2.255a.75.75 0 0 1 1.146-.967Zm-6.492.958A3.48 3.48 0 0 0 4.5 7a3.48 3.48 0 0 0 .823 2.255.75.75 0 0 1-1.146.967A4.981 4.981 0 0 1 3 7a4.982 4.982 0 0 1 1.188-3.236.75.75 0 1 1 1.143.972Z" }) }, 24: { width: 24, path: Ra.default.createElement("path", { d: "M20.485 2.515a.75.75 0 0 0-1.06 1.06A10.465 10.465 0 0 1 22.5 11c0 2.9-1.174 5.523-3.075 7.424a.75.75 0 0 0 1.06 1.061A11.965 11.965 0 0 0 24 11c0-3.314-1.344-6.315-3.515-8.485Zm-15.91 1.06a.75.75 0 0 0-1.06-1.06A11.965 11.965 0 0 0 0 11c0 3.313 1.344 6.314 3.515 8.485a.75.75 0 0 0 1.06-1.06A10.465 10.465 0 0 1 1.5 11c0-2.9 1.174-5.524 3.075-7.425ZM8.11 7.11a.75.75 0 0 0-1.06-1.06A6.98 6.98 0 0 0 5 11a6.98 6.98 0 0 0 2.05 4.95.75.75 0 0 0 1.06-1.061 5.48 5.48 0 0 1-1.61-3.89 5.48 5.48 0 0 1 1.61-3.888Zm8.84-1.06a.75.75 0 1 0-1.06 1.06A5.48 5.48 0 0 1 17.5 11a5.48 5.48 0 0 1-1.61 3.889.75.75 0 1 0 1.06 1.06A6.98 6.98 0 0 0 19 11a6.98 6.98 0 0 0-2.05-4.949ZM14 11a2 2 0 0 1-1.25 1.855v8.395a.75.75 0 0 1-1.5 0v-8.395A2 2 0 1 1 14 11Z" }) } };
var _a = Ra.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-broadcast", g5, v5);
});
_a.displayName = "BroadcastIcon";
var Pa = T(S(), 1);
var C5 = ["16", "24"];
var T5 = { 16: { width: 16, path: Pa.default.createElement("path", { d: "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" }) }, 24: { width: 24, path: Pa.default.createElement("path", { d: "M21.03 5.72a.75.75 0 0 1 0 1.06l-11.5 11.5a.747.747 0 0 1-1.072-.012l-5.5-5.75a.75.75 0 1 1 1.084-1.036l4.97 5.195L19.97 5.72a.75.75 0 0 1 1.06 0Z" }) } };
var vo = Pa.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-check", T5, C5);
});
vo.displayName = "CheckIcon";
var go = T(S(), 1);
var y5 = ["16", "24"];
var S5 = { 16: { width: 16, path: go.default.createElement("path", { d: "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm1.5 0a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm10.28-1.72-4.5 4.5a.75.75 0 0 1-1.06 0l-2-2a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l1.47 1.47 3.97-3.97a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z" }) }, 24: { width: 24, path: go.default.createElement(go.default.Fragment, null, go.default.createElement("path", { d: "M17.28 9.28a.75.75 0 0 0-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l6.5-6.5Z" }), go.default.createElement("path", { d: "M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z" })) } };
var ka = go.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-check-circle", S5, y5);
});
ka.displayName = "CheckCircleIcon";
var An = T(S(), 1);
var I5 = ["12", "16", "24"];
var M5 = { 12: { width: 12, path: An.default.createElement("path", { d: "M6 0a6 6 0 1 1 0 12A6 6 0 0 1 6 0Zm-.705 8.737L9.63 4.403 8.392 3.166 5.295 6.263l-1.7-1.702L2.356 5.8l2.938 2.938Z" }) }, 16: { width: 16, path: An.default.createElement("path", { d: "M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z" }) }, 24: { width: 24, path: An.default.createElement("path", { d: "M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Zm16.28-2.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018l-5.97 5.97-2.47-2.47a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l3 3a.75.75 0 0 0 1.06 0Z" }) } };
var Aa = An.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-check-circle-fill", M5, I5);
});
Aa.displayName = "CheckCircleFillIcon";
var wn = T(S(), 1);
var R5 = ["12", "16", "24"];
var _5 = { 12: { width: 12, path: wn.default.createElement("path", { d: "M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 2.7-2.7c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z" }) }, 16: { width: 16, path: wn.default.createElement("path", { d: "M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z" }) }, 24: { width: 24, path: wn.default.createElement("path", { d: "M5.22 8.22a.749.749 0 0 0 0 1.06l6.25 6.25a.749.749 0 0 0 1.06 0l6.25-6.25a.749.749 0 1 0-1.06-1.06L12 13.939 6.28 8.22a.749.749 0 0 0-1.06 0Z" }) } };
var He = wn.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-chevron-down", _5, R5);
});
He.displayName = "ChevronDownIcon";
var En = T(S(), 1);
var P5 = ["12", "16", "24"];
var k5 = { 12: { width: 12, path: En.default.createElement("path", { d: "M3.587 6.025c0 .2.1.4.2.5l3.3 3.3c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1l-2.7-2.7 2.7-2.7c.3-.3.3-.8 0-1.1-.3-.3-.8-.3-1.1 0l-3.2 3.2c-.2.2-.3.4-.3.6Z" }) }, 16: { width: 16, path: En.default.createElement("path", { d: "M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" }) }, 24: { width: 24, path: En.default.createElement("path", { d: "M15.28 5.22a.75.75 0 0 1 0 1.06L9.56 12l5.72 5.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z" }) } };
var wa = En.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-chevron-left", k5, P5);
});
wa.displayName = "ChevronLeftIcon";
var Nn = T(S(), 1);
var A5 = ["12", "16", "24"];
var w5 = { 12: { width: 12, path: Nn.default.createElement("path", { d: "M4.7 10c-.2 0-.4-.1-.5-.2-.3-.3-.3-.8 0-1.1L6.9 6 4.2 3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l3.3 3.2c.3.3.3.8 0 1.1L5.3 9.7c-.2.2-.4.3-.6.3Z" }) }, 16: { width: 16, path: Nn.default.createElement("path", { d: "M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" }) }, 24: { width: 24, path: Nn.default.createElement("path", { d: "M8.72 18.78a.75.75 0 0 1 0-1.06L14.44 12 8.72 6.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z" }) } };
var jt = Nn.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-chevron-right", w5, A5);
});
jt.displayName = "ChevronRightIcon";
var Co = T(S(), 1);
var E5 = ["16", "24"];
var N5 = { 16: { width: 16, path: Co.default.createElement("path", { d: "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z" }) }, 24: { width: 24, path: Co.default.createElement(Co.default.Fragment, null, Co.default.createElement("path", { d: "M12.5 7.25a.75.75 0 0 0-1.5 0v5.5c0 .27.144.518.378.651l3.5 2a.75.75 0 0 0 .744-1.302L12.5 12.315V7.25Z" }), Co.default.createElement("path", { d: "M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z" })) } };
var Ea = Co.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-clock", N5, E5);
});
Ea.displayName = "ClockIcon";
var Na = T(S(), 1);
var D5 = ["16", "24"];
var F5 = { 16: { width: 16, path: Na.default.createElement("path", { d: "M2 7.25A5.225 5.225 0 0 1 7.25 2a5.222 5.222 0 0 1 4.767 3.029A4.472 4.472 0 0 1 16 9.5c0 2.505-1.995 4.5-4.5 4.5h-8A3.474 3.474 0 0 1 0 10.5c0-1.41.809-2.614 2.001-3.17Zm1.54.482a.75.75 0 0 1-.556.832c-.86.22-1.484.987-1.484 1.936 0 1.124.876 2 2 2h8c1.676 0 3-1.324 3-3s-1.324-3-3-3a.75.75 0 0 1-.709-.504A3.72 3.72 0 0 0 7.25 3.5C5.16 3.5 3.5 5.16 3.5 7.25c.002.146.014.292.035.436l.004.036.001.008Z" }) }, 24: { width: 24, path: Na.default.createElement("path", { d: "M3.103 10.107c0-4.244 3.445-7.607 7.733-7.607 3.19 0 5.912 1.858 7.099 4.563l.01.022.001.006C21.348 7.345 24 10.095 24 13.536 24 17.148 21.076 20 17.431 20H5.017C2.23 20 0 17.83 0 15.06a4.899 4.899 0 0 1 3.112-4.581 7.696 7.696 0 0 1-.009-.372ZM10.836 4c-3.485 0-6.233 2.717-6.233 6.107 0 .284.022.602.052.756a.75.75 0 0 1-.552.869c-1.52.385-2.603 1.712-2.603 3.328 0 1.917 1.532 3.44 3.517 3.44h12.414c2.843 0 5.069-2.206 5.069-4.964 0-2.759-2.226-4.965-5.069-4.965a.75.75 0 0 1-.696-.47l-.179-.446C15.606 5.5 13.424 4 10.836 4Z" }) } };
var Da = Na.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-cloud", F5, D5);
});
Da.displayName = "CloudIcon";
var Fa = T(S(), 1);
var L5 = ["16", "24"];
var B5 = { 16: { width: 16, path: Fa.default.createElement("path", { d: "m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z" }) }, 24: { width: 24, path: Fa.default.createElement("path", { d: "M15.22 4.97a.75.75 0 0 1 1.06 0l6.5 6.5a.75.75 0 0 1 0 1.06l-6.5 6.5a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L21.19 12l-5.97-5.97a.75.75 0 0 1 0-1.06Zm-6.44 0a.75.75 0 0 1 0 1.06L2.81 12l5.97 5.97a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z" }) } };
var La = Fa.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-code", B5, L5);
});
La.displayName = "CodeIcon";
var xe = T(S(), 1);
var O5 = ["16", "24", "48", "96"];
var V5 = { 16: { width: 16, path: xe.default.createElement(xe.default.Fragment, null, xe.default.createElement("path", { d: "M7.998 15.035c-4.562 0-7.873-2.914-7.998-3.749V9.338c.085-.628.677-1.686 1.588-2.065.013-.07.024-.143.036-.218.029-.183.06-.384.126-.612-.201-.508-.254-1.084-.254-1.656 0-.87.128-1.769.693-2.484.579-.733 1.494-1.124 2.724-1.261 1.206-.134 2.262.034 2.944.765.05.053.096.108.139.165.044-.057.094-.112.143-.165.682-.731 1.738-.899 2.944-.765 1.23.137 2.145.528 2.724 1.261.566.715.693 1.614.693 2.484 0 .572-.053 1.148-.254 1.656.066.228.098.429.126.612.012.076.024.148.037.218.924.385 1.522 1.471 1.591 2.095v1.872c0 .766-3.351 3.795-8.002 3.795Zm0-1.485c2.28 0 4.584-1.11 5.002-1.433V7.862l-.023-.116c-.49.21-1.075.291-1.727.291-1.146 0-2.059-.327-2.71-.991A3.222 3.222 0 0 1 8 6.303a3.24 3.24 0 0 1-.544.743c-.65.664-1.563.991-2.71.991-.652 0-1.236-.081-1.727-.291l-.023.116v4.255c.419.323 2.722 1.433 5.002 1.433ZM6.762 2.83c-.193-.206-.637-.413-1.682-.297-1.019.113-1.479.404-1.713.7-.247.312-.369.789-.369 1.554 0 .793.129 1.171.308 1.371.162.181.519.379 1.442.379.853 0 1.339-.235 1.638-.54.315-.322.527-.827.617-1.553.117-.935-.037-1.395-.241-1.614Zm4.155-.297c-1.044-.116-1.488.091-1.681.297-.204.219-.359.679-.242 1.614.091.726.303 1.231.618 1.553.299.305.784.54 1.638.54.922 0 1.28-.198 1.442-.379.179-.2.308-.578.308-1.371 0-.765-.123-1.242-.37-1.554-.233-.296-.693-.587-1.713-.7Z" }), xe.default.createElement("path", { d: "M6.25 9.037a.75.75 0 0 1 .75.75v1.501a.75.75 0 0 1-1.5 0V9.787a.75.75 0 0 1 .75-.75Zm4.25.75v1.501a.75.75 0 0 1-1.5 0V9.787a.75.75 0 0 1 1.5 0Z" })) }, 24: { width: 24, path: xe.default.createElement(xe.default.Fragment, null, xe.default.createElement("path", { d: "M23.922 16.992c-.861 1.495-5.859 5.023-11.922 5.023-6.063 0-11.061-3.528-11.922-5.023A.641.641 0 0 1 0 16.736v-2.869a.841.841 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.195 10.195 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952 1.399-1.136 3.392-2.093 6.122-2.093 2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.832.832 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256ZM12.172 11h-.344a4.323 4.323 0 0 1-.355.508C10.703 12.455 9.555 13 7.965 13c-1.725 0-2.989-.359-3.782-1.259a2.005 2.005 0 0 1-.085-.104L4 11.741v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.323 4.323 0 0 1-.355-.508h-.016.016Zm.641-2.935c.136 1.057.403 1.913.878 2.497.442.544 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.15.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.319-.862-2.824-1.025-1.487-.161-2.192.138-2.533.529-.269.307-.437.808-.438 1.578v.021c0 .265.021.562.063.893Zm-1.626 0c.042-.331.063-.628.063-.894v-.02c-.001-.77-.169-1.271-.438-1.578-.341-.391-1.046-.69-2.533-.529-1.505.163-2.347.537-2.824 1.025-.462.472-.705 1.179-.705 2.319 0 1.211.175 1.926.558 2.361.365.414 1.084.751 2.657.751 1.21 0 1.902-.394 2.344-.938.475-.584.742-1.44.878-2.497Z" }), xe.default.createElement("path", { d: "M14.5 14.25a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1Zm-5 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1Z" })) }, 48: { width: 48, path: xe.default.createElement(xe.default.Fragment, null, xe.default.createElement("path", { d: "M47.801 34.003c-1.72 2.988-11.706 10.037-23.82 10.037S1.881 36.991.161 34.003a1.309 1.309 0 0 1-.161-.57v-5.615c.012-.17.047-.338.11-.498.744-1.867 2.692-4.58 5.206-5.308.333-.855.826-2.106 1.287-3.029a20.112 20.112 0 0 1-.104-2.171c0-2.659.563-4.992 2.262-6.729.793-.811 1.777-1.433 2.945-1.901C14.502 5.911 18.483 4 23.938 4c5.455 0 9.523 1.911 12.319 4.182 1.167.468 2.151 1.09 2.944 1.901 1.699 1.737 2.263 4.07 2.263 6.729 0 .736-.027 1.465-.105 2.171.461.923.954 2.174 1.288 3.029 2.513.728 4.461 3.441 5.205 5.308.081.205.115.424.115.645v5.318c0 .252-.04.502-.166.72ZM24.325 22.031h-.688a8.52 8.52 0 0 1-.709 1.016c-1.537 1.892-3.833 2.98-7.008 2.98-3.447 0-5.972-.717-7.557-2.514a4.408 4.408 0 0 1-.171-.21l-.195.21v13.155c2.867 1.558 9.02 4.353 15.984 4.353s13.117-2.795 15.984-4.353V23.513l-.195-.21s-.066.091-.171.21c-1.584 1.797-4.11 2.514-7.557 2.514-3.175 0-5.47-1.088-7.008-2.98a8.637 8.637 0 0 1-.709-1.016h-.033.033Zm-1.969-5.864a14.31 14.31 0 0 0 .127-1.785v-.042c-.003-1.537-.339-2.538-.876-3.152-.681-.78-2.09-1.378-5.06-1.057-3.008.326-4.69 1.073-5.643 2.048-.923.944-1.408 2.356-1.408 4.633 0 2.42.348 3.849 1.115 4.719.729.827 2.165 1.499 5.309 1.499 2.417 0 3.799-.786 4.683-1.873.948-1.168 1.482-2.878 1.753-4.99Zm3.25 0c.271 2.112.805 3.822 1.754 4.99.883 1.087 2.265 1.873 4.682 1.873 3.145 0 4.58-.672 5.309-1.499.767-.87 1.116-2.299 1.116-4.719 0-2.277-.485-3.689-1.408-4.633-.954-.975-2.635-1.722-5.644-2.048-2.969-.321-4.378.277-5.06 1.057-.537.614-.873 1.615-.876 3.152v.042c.002.53.042 1.123.127 1.785Z" }), xe.default.createElement("path", { d: "M28.998 28.516c1.104 0 1.999.895 1.999 1.999v3.998a2 2 0 1 1-3.998 0v-3.998c0-1.104.895-1.999 1.999-1.999Zm-9.996 0c1.104 0 1.999.895 1.999 1.999v3.998a2 2 0 1 1-3.998 0v-3.998c0-1.104.895-1.999 1.999-1.999Z" })) }, 96: { width: 96, path: xe.default.createElement(xe.default.Fragment, null, xe.default.createElement("path", { d: "M95.667 67.954C92.225 73.933 72.24 88.04 47.997 88.04 23.754 88.04 3.769 73.933.328 67.954c-.216-.375-.307-.796-.328-1.226V55.661c.019-.371.089-.736.226-1.081 1.489-3.738 5.386-9.166 10.417-10.623.667-1.712 1.655-4.215 2.576-6.062-.154-1.414-.208-2.872-.208-4.345 0-5.322 1.128-9.99 4.527-13.466 1.587-1.623 3.557-2.869 5.893-3.805 5.595-4.545 13.563-8.369 24.48-8.369s19.057 3.824 24.652 8.369c2.337.936 4.306 2.182 5.894 3.805 3.399 3.476 4.527 8.144 4.527 13.466 0 1.473-.054 2.931-.208 4.345.921 1.847 1.909 4.35 2.576 6.062 5.03 1.457 8.928 6.885 10.417 10.623.163.41.231.848.231 1.289v10.644c0 .504-.081 1.004-.333 1.441ZM48.686 43.993l-.3.001-1.077-.001c-.423.709-.894 1.39-1.418 2.035-3.078 3.787-7.672 5.964-14.026 5.964-6.897 0-11.952-1.435-15.123-5.032a7.886 7.886 0 0 1-.342-.419l-.39.419v26.326c5.737 3.118 18.05 8.713 31.987 8.713 13.938 0 26.251-5.595 31.988-8.713V46.96l-.39-.419s-.132.181-.342.419c-3.171 3.597-8.226 5.032-15.123 5.032-6.354 0-10.949-2.177-14.026-5.964a17.178 17.178 0 0 1-1.418-2.034h-.066l.066-.001Zm-3.94-11.733c.17-1.326.251-2.513.253-3.573v-.084c-.005-3.077-.678-5.079-1.752-6.308-1.365-1.562-4.184-2.758-10.127-2.115-6.021.652-9.386 2.146-11.294 4.098-1.847 1.889-2.818 4.715-2.818 9.272 0 4.842.698 7.703 2.232 9.443 1.459 1.655 4.332 3.001 10.625 3.001 4.837 0 7.603-1.573 9.371-3.749 1.899-2.336 2.967-5.759 3.51-9.985Zm6.503 0c.543 4.226 1.611 7.649 3.51 9.985 1.768 2.176 4.533 3.749 9.371 3.749 6.292 0 9.165-1.346 10.624-3.001 1.535-1.74 2.232-4.601 2.232-9.443 0-4.557-.97-7.383-2.817-9.272-1.908-1.952-5.274-3.446-11.294-4.098-5.943-.643-8.763.553-10.127 2.115-1.074 1.229-1.747 3.231-1.752 6.308v.084c.002 1.06.083 2.247.253 3.573Zm-2.563 11.734h.066l-.066-.001v.001Z" }), xe.default.createElement("path", { d: "M38.5 55.75a3.5 3.5 0 0 1 3.5 3.5v8.5a3.5 3.5 0 1 1-7 0v-8.5a3.5 3.5 0 0 1 3.5-3.5Zm19 0a3.5 3.5 0 0 1 3.5 3.5v8.5a3.5 3.5 0 1 1-7 0v-8.5a3.5 3.5 0 0 1 3.5-3.5Z" })) } };
var Dn = xe.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-copilot", V5, O5);
});
Dn.displayName = "CopilotIcon";
var Ba = T(S(), 1);
var H5 = ["16", "24"];
var G5 = { 16: { width: 16, path: Ba.default.createElement("path", { d: "M1 3.5c0-.626.292-1.165.7-1.59.406-.422.956-.767 1.579-1.041C4.525.32 6.195 0 8 0c1.805 0 3.475.32 4.722.869.622.274 1.172.62 1.578 1.04.408.426.7.965.7 1.591v9c0 .626-.292 1.165-.7 1.59-.406.422-.956.767-1.579 1.041C11.476 15.68 9.806 16 8 16c-1.805 0-3.475-.32-4.721-.869-.623-.274-1.173-.62-1.579-1.04-.408-.426-.7-.965-.7-1.591Zm1.5 0c0 .133.058.318.282.551.227.237.591.483 1.101.707C4.898 5.205 6.353 5.5 8 5.5c1.646 0 3.101-.295 4.118-.742.508-.224.873-.471 1.1-.708.224-.232.282-.417.282-.55 0-.133-.058-.318-.282-.551-.227-.237-.591-.483-1.101-.707C11.102 1.795 9.647 1.5 8 1.5c-1.646 0-3.101.295-4.118.742-.508.224-.873.471-1.1.708-.224.232-.282.417-.282.55Zm0 4.5c0 .133.058.318.282.551.227.237.591.483 1.101.707C4.898 9.705 6.353 10 8 10c1.646 0 3.101-.295 4.118-.742.508-.224.873-.471 1.1-.708.224-.232.282-.417.282-.55V5.724c-.241.15-.503.286-.778.407C11.475 6.68 9.805 7 8 7c-1.805 0-3.475-.32-4.721-.869a6.15 6.15 0 0 1-.779-.407Zm0 2.225V12.5c0 .133.058.318.282.55.227.237.592.484 1.1.708 1.016.447 2.471.742 4.118.742 1.647 0 3.102-.295 4.117-.742.51-.224.874-.47 1.101-.707.224-.233.282-.418.282-.551v-2.275c-.241.15-.503.285-.778.406-1.247.549-2.917.869-4.722.869-1.805 0-3.475-.32-4.721-.869a6.327 6.327 0 0 1-.779-.406Z" }) }, 24: { width: 24, path: Ba.default.createElement("path", { d: "M12 1.25c2.487 0 4.773.402 6.466 1.079.844.337 1.577.758 2.112 1.264.536.507.922 1.151.922 1.907v12.987l-.026.013h.026c0 .756-.386 1.4-.922 1.907-.535.506-1.268.927-2.112 1.264-1.693.677-3.979 1.079-6.466 1.079s-4.774-.402-6.466-1.079c-.844-.337-1.577-.758-2.112-1.264C2.886 19.9 2.5 19.256 2.5 18.5h.026l-.026-.013V5.5c0-.756.386-1.4.922-1.907.535-.506 1.268-.927 2.112-1.264C7.226 1.652 9.513 1.25 12 1.25ZM4 14.371v4.116l-.013.013H4c0 .211.103.487.453.817.351.332.898.666 1.638.962 1.475.589 3.564.971 5.909.971 2.345 0 4.434-.381 5.909-.971.739-.296 1.288-.63 1.638-.962.349-.33.453-.607.453-.817h.013L20 18.487v-4.116a7.85 7.85 0 0 1-1.534.8c-1.693.677-3.979 1.079-6.466 1.079s-4.774-.402-6.466-1.079a7.843 7.843 0 0 1-1.534-.8ZM20 12V7.871a7.85 7.85 0 0 1-1.534.8C16.773 9.348 14.487 9.75 12 9.75s-4.774-.402-6.466-1.079A7.85 7.85 0 0 1 4 7.871V12c0 .21.104.487.453.817.35.332.899.666 1.638.961 1.475.59 3.564.972 5.909.972 2.345 0 4.434-.382 5.909-.972.74-.295 1.287-.629 1.638-.96.35-.33.453-.607.453-.818ZM4 5.5c0 .211.103.487.453.817.351.332.898.666 1.638.962 1.475.589 3.564.971 5.909.971 2.345 0 4.434-.381 5.909-.971.739-.296 1.288-.63 1.638-.962.349-.33.453-.607.453-.817 0-.211-.103-.487-.453-.817-.351-.332-.898-.666-1.638-.962-1.475-.589-3.564-.971-5.909-.971-2.345 0-4.434.381-5.909.971-.739.296-1.288.63-1.638.962C4.104 5.013 4 5.29 4 5.5Z" }) } };
var Oa = Ba.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-database", G5, H5);
});
Oa.displayName = "DatabaseIcon";
var Va = T(S(), 1);
var Z5 = ["16", "24"];
var U5 = { 16: { width: 16, path: Va.default.createElement("path", { d: "M14.25 1c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0 1 14.25 12h-3.727c.099 1.041.52 1.872 1.292 2.757A.752.752 0 0 1 11.25 16h-6.5a.75.75 0 0 1-.565-1.243c.772-.885 1.192-1.716 1.292-2.757H1.75A1.75 1.75 0 0 1 0 10.25v-7.5C0 1.784.784 1 1.75 1ZM1.75 2.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25ZM9.018 12H6.982a5.72 5.72 0 0 1-.765 2.5h3.566a5.72 5.72 0 0 1-.765-2.5Z" }) }, 24: { width: 24, path: Va.default.createElement("path", { d: "M8.954 17H2.75A1.75 1.75 0 0 1 1 15.25V3.75C1 2.784 1.784 2 2.75 2h18.5c.966 0 1.75.784 1.75 1.75v11.5A1.75 1.75 0 0 1 21.25 17h-6.204c.171 1.375.805 2.652 1.769 3.757A.752.752 0 0 1 16.25 22h-8.5a.75.75 0 0 1-.565-1.243c.964-1.105 1.598-2.382 1.769-3.757ZM21.5 3.75a.25.25 0 0 0-.25-.25H2.75a.25.25 0 0 0-.25.25v11.5c0 .138.112.25.25.25h18.5a.25.25 0 0 0 .25-.25ZM13.537 17h-3.074c-.126 1.266-.564 2.445-1.223 3.5h5.52c-.659-1.055-1.098-2.234-1.223-3.5Z" }) } };
var Ha = Va.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-device-desktop", U5, Z5);
});
Ha.displayName = "DeviceDesktopIcon";
var Ga = T(S(), 1);
var j5 = ["16", "24"];
var K5 = { 16: { width: 16, path: Ga.default.createElement("path", { d: "M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" }) }, 24: { width: 24, path: Ga.default.createElement("path", { d: "M3 3a2 2 0 0 1 2-2h9.982a2 2 0 0 1 1.414.586l4.018 4.018A2 2 0 0 1 21 7.018V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm2-.5a.5.5 0 0 0-.5.5v18a.5.5 0 0 0 .5.5h14a.5.5 0 0 0 .5-.5V8.5h-4a2 2 0 0 1-2-2v-4Zm10 0v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0-.146-.336l-4.018-4.018A.5.5 0 0 0 15 2.5Z" }) } };
var Za = Ga.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-file", K5, j5);
});
Za.displayName = "FileIcon";
var To = T(S(), 1);
var z5 = ["16", "24"];
var W5 = { 16: { width: 16, path: To.default.createElement("path", { d: "M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 14.25 15h-9a.75.75 0 0 1 0-1.5h9a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 10 4.25V1.5H5.75a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0Zm1.72 4.97a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.47-1.47-1.47-1.47a.75.75 0 0 1 0-1.06ZM3.28 7.78 1.81 9.25l1.47 1.47a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-2-2a.75.75 0 0 1 0-1.06l2-2a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Zm8.22-6.218V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" }) }, 24: { width: 24, path: To.default.createElement(To.default.Fragment, null, To.default.createElement("path", { d: "M3 3a2 2 0 0 1 2-2h9.982a2 2 0 0 1 1.414.586l4.018 4.018A2 2 0 0 1 21 7.018V21a2 2 0 0 1-2 2H4.75a.75.75 0 0 1 0-1.5H19a.5.5 0 0 0 .5-.5V8.5h-4a2 2 0 0 1-2-2v-4H5a.5.5 0 0 0-.5.5v6.25a.75.75 0 0 1-1.5 0Zm12-.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0-.146-.336l-4.018-4.018A.5.5 0 0 0 15 2.5Z" }), To.default.createElement("path", { d: "M4.53 12.24a.75.75 0 0 1-.039 1.06l-2.639 2.45 2.64 2.45a.75.75 0 1 1-1.022 1.1l-3.23-3a.75.75 0 0 1 0-1.1l3.23-3a.75.75 0 0 1 1.06.04Zm3.979 1.06a.75.75 0 1 1 1.02-1.1l3.231 3a.75.75 0 0 1 0 1.1l-3.23 3a.75.75 0 1 1-1.021-1.1l2.639-2.45-2.64-2.45Z" })) } };
var Ua = To.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-file-code", W5, z5);
});
Ua.displayName = "FileCodeIcon";
var yo = T(S(), 1);
var $5 = ["16", "24"];
var q5 = { 16: { width: 16, path: yo.default.createElement("path", { d: "M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.018.066.079.158.212.224.231.114.454.243.668.386.123.082.233.09.299.071l1.103-.303c.644-.176 1.392.021 1.82.63.27.385.506.792.704 1.218.315.675.111 1.422-.364 1.891l-.814.806c-.049.048-.098.147-.088.294.016.257.016.515 0 .772-.01.147.038.246.088.294l.814.806c.475.469.679 1.216.364 1.891a7.977 7.977 0 0 1-.704 1.217c-.428.61-1.176.807-1.82.63l-1.102-.302c-.067-.019-.177-.011-.3.071a5.909 5.909 0 0 1-.668.386c-.133.066-.194.158-.211.224l-.29 1.106c-.168.646-.715 1.196-1.458 1.26a8.006 8.006 0 0 1-1.402 0c-.743-.064-1.289-.614-1.458-1.26l-.289-1.106c-.018-.066-.079-.158-.212-.224a5.738 5.738 0 0 1-.668-.386c-.123-.082-.233-.09-.299-.071l-1.103.303c-.644.176-1.392-.021-1.82-.63a8.12 8.12 0 0 1-.704-1.218c-.315-.675-.111-1.422.363-1.891l.815-.806c.05-.048.098-.147.088-.294a6.214 6.214 0 0 1 0-.772c.01-.147-.038-.246-.088-.294l-.815-.806C.635 6.045.431 5.298.746 4.623a7.92 7.92 0 0 1 .704-1.217c.428-.61 1.176-.807 1.82-.63l1.102.302c.067.019.177.011.3-.071.214-.143.437-.272.668-.386.133-.066.194-.158.211-.224l.29-1.106C6.009.645 6.556.095 7.299.03 7.53.01 7.764 0 8 0Zm-.571 1.525c-.036.003-.108.036-.137.146l-.289 1.105c-.147.561-.549.967-.998 1.189-.173.086-.34.183-.5.29-.417.278-.97.423-1.529.27l-1.103-.303c-.109-.03-.175.016-.195.045-.22.312-.412.644-.573.99-.014.031-.021.11.059.19l.815.806c.411.406.562.957.53 1.456a4.709 4.709 0 0 0 0 .582c.032.499-.119 1.05-.53 1.456l-.815.806c-.081.08-.073.159-.059.19.162.346.353.677.573.989.02.03.085.076.195.046l1.102-.303c.56-.153 1.113-.008 1.53.27.161.107.328.204.501.29.447.222.85.629.997 1.189l.289 1.105c.029.109.101.143.137.146a6.6 6.6 0 0 0 1.142 0c.036-.003.108-.036.137-.146l.289-1.105c.147-.561.549-.967.998-1.189.173-.086.34-.183.5-.29.417-.278.97-.423 1.529-.27l1.103.303c.109.029.175-.016.195-.045.22-.313.411-.644.573-.99.014-.031.021-.11-.059-.19l-.815-.806c-.411-.406-.562-.957-.53-1.456a4.709 4.709 0 0 0 0-.582c-.032-.499.119-1.05.53-1.456l.815-.806c.081-.08.073-.159.059-.19a6.464 6.464 0 0 0-.573-.989c-.02-.03-.085-.076-.195-.046l-1.102.303c-.56.153-1.113.008-1.53-.27a4.44 4.44 0 0 0-.501-.29c-.447-.222-.85-.629-.997-1.189l-.289-1.105c-.029-.11-.101-.143-.137-.146a6.6 6.6 0 0 0-1.142 0ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9.5 8a1.5 1.5 0 1 0-3.001.001A1.5 1.5 0 0 0 9.5 8Z" }) }, 24: { width: 24, path: yo.default.createElement(yo.default.Fragment, null, yo.default.createElement("path", { d: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-1.5 0a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" }), yo.default.createElement("path", { d: "M12 1c.266 0 .532.009.797.028.763.055 1.345.617 1.512 1.304l.352 1.45c.019.078.09.171.225.221.247.089.49.19.728.302.13.061.246.044.315.002l1.275-.776c.603-.368 1.411-.353 1.99.147.402.349.78.726 1.128 1.129.501.578.515 1.386.147 1.99l-.776 1.274c-.042.069-.058.185.002.315.112.238.213.481.303.728.048.135.142.205.22.225l1.45.352c.687.167 1.249.749 1.303 1.512.038.531.038 1.063 0 1.594-.054.763-.616 1.345-1.303 1.512l-1.45.352c-.078.019-.171.09-.221.225-.089.248-.19.491-.302.728-.061.13-.044.246-.002.315l.776 1.275c.368.603.353 1.411-.147 1.99-.349.402-.726.78-1.129 1.128-.578.501-1.386.515-1.99.147l-1.274-.776c-.069-.042-.185-.058-.314.002a8.606 8.606 0 0 1-.729.303c-.135.048-.205.142-.225.22l-.352 1.45c-.167.687-.749 1.249-1.512 1.303-.531.038-1.063.038-1.594 0-.763-.054-1.345-.616-1.512-1.303l-.352-1.45c-.019-.078-.09-.171-.225-.221a8.138 8.138 0 0 1-.728-.302c-.13-.061-.246-.044-.315-.002l-1.275.776c-.603.368-1.411.353-1.99-.147-.402-.349-.78-.726-1.128-1.129-.501-.578-.515-1.386-.147-1.99l.776-1.274c.042-.069.058-.185-.002-.314a8.606 8.606 0 0 1-.303-.729c-.048-.135-.142-.205-.22-.225l-1.45-.352c-.687-.167-1.249-.749-1.304-1.512a11.158 11.158 0 0 1 0-1.594c.055-.763.617-1.345 1.304-1.512l1.45-.352c.078-.019.171-.09.221-.225.089-.248.19-.491.302-.728.061-.13.044-.246.002-.315l-.776-1.275c-.368-.603-.353-1.411.147-1.99.349-.402.726-.78 1.129-1.128.578-.501 1.386-.515 1.99-.147l1.274.776c.069.042.185.058.315-.002.238-.112.481-.213.728-.303.135-.048.205-.142.225-.22l.352-1.45c.167-.687.749-1.249 1.512-1.304C11.466 1.01 11.732 1 12 1Zm-.69 1.525c-.055.004-.135.05-.161.161l-.353 1.45a1.832 1.832 0 0 1-1.172 1.277 7.147 7.147 0 0 0-.6.249 1.833 1.833 0 0 1-1.734-.074l-1.274-.776c-.098-.06-.186-.036-.228 0a9.774 9.774 0 0 0-.976.976c-.036.042-.06.131 0 .228l.776 1.274c.314.529.342 1.18.074 1.734a7.147 7.147 0 0 0-.249.6 1.831 1.831 0 0 1-1.278 1.173l-1.45.351c-.11.027-.156.107-.16.162a9.63 9.63 0 0 0 0 1.38c.004.055.05.135.161.161l1.45.353a1.832 1.832 0 0 1 1.277 1.172c.074.204.157.404.249.6.268.553.24 1.204-.074 1.733l-.776 1.275c-.06.098-.036.186 0 .228.301.348.628.675.976.976.042.036.131.06.228 0l1.274-.776a1.83 1.83 0 0 1 1.734-.075c.196.093.396.176.6.25a1.831 1.831 0 0 1 1.173 1.278l.351 1.45c.027.11.107.156.162.16a9.63 9.63 0 0 0 1.38 0c.055-.004.135-.05.161-.161l.353-1.45a1.834 1.834 0 0 1 1.172-1.278 6.82 6.82 0 0 0 .6-.248 1.831 1.831 0 0 1 1.733.074l1.275.776c.098.06.186.036.228 0 .348-.301.675-.628.976-.976.036-.042.06-.131 0-.228l-.776-1.275a1.834 1.834 0 0 1-.075-1.733c.093-.196.176-.396.25-.6a1.831 1.831 0 0 1 1.278-1.173l1.45-.351c.11-.027.156-.107.16-.162a9.63 9.63 0 0 0 0-1.38c-.004-.055-.05-.135-.161-.161l-1.45-.353c-.626-.152-1.08-.625-1.278-1.172a6.576 6.576 0 0 0-.248-.6 1.833 1.833 0 0 1 .074-1.734l.776-1.274c.06-.098.036-.186 0-.228a9.774 9.774 0 0 0-.976-.976c-.042-.036-.131-.06-.228 0l-1.275.776a1.831 1.831 0 0 1-1.733.074 6.88 6.88 0 0 0-.6-.249 1.835 1.835 0 0 1-1.173-1.278l-.351-1.45c-.027-.11-.107-.156-.162-.16a9.63 9.63 0 0 0-1.38 0Z" })) } };
var ja = yo.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-gear", q5, $5);
});
ja.displayName = "GearIcon";
var Ka = T(S(), 1);
var Y5 = ["16", "24"];
var X5 = { 16: { width: 16, path: Ka.default.createElement("path", { d: "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.78 8.75a9.64 9.64 0 0 0 1.363 4.177c.255.426.542.832.857 1.215.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a9.927 9.927 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.507 6.507 0 0 0 4.666 5.5c-.123-.181-.24-.365-.352-.552-.715-1.192-1.437-2.874-1.581-4.948Zm-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948.12-.197.237-.381.353-.552a6.507 6.507 0 0 0-4.666 5.5Zm10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948-.12.197-.237.381-.353.552a6.507 6.507 0 0 0 4.666-5.5Zm2.733-1.5a6.507 6.507 0 0 0-4.666-5.5c.123.181.24.365.353.552.714 1.192 1.436 2.874 1.58 4.948Z" }) }, 24: { width: 24, path: Ka.default.createElement("path", { d: "M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1Zm3.241 10.5v-.001c-.1-2.708-.992-4.904-1.89-6.452a13.919 13.919 0 0 0-1.304-1.88L12 3.11l-.047.059c-.354.425-.828 1.06-1.304 1.88-.898 1.547-1.79 3.743-1.89 6.451Zm-12.728 0h4.745c.1-3.037 1.1-5.49 2.093-7.204.39-.672.78-1.233 1.119-1.673C6.11 3.329 2.746 7 2.513 11.5Zm18.974 0C21.254 7 17.89 3.329 13.53 2.623c.339.44.729 1.001 1.119 1.673.993 1.714 1.993 4.167 2.093 7.204ZM8.787 13c.182 2.478 1.02 4.5 1.862 5.953.382.661.818 1.29 1.304 1.88l.047.057.047-.059c.354-.425.828-1.06 1.304-1.88.842-1.451 1.679-3.471 1.862-5.951Zm-1.504 0H2.552a9.505 9.505 0 0 0 7.918 8.377 15.773 15.773 0 0 1-1.119-1.673C8.413 18.085 7.47 15.807 7.283 13Zm9.434 0c-.186 2.807-1.13 5.085-2.068 6.704-.39.672-.78 1.233-1.118 1.673A9.506 9.506 0 0 0 21.447 13Z" }) } };
var za = Ka.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-globe", X5, Y5);
});
za.displayName = "GlobeIcon";
var Wa = T(S(), 1);
var J5 = ["16", "24"];
var Q5 = { 16: { width: 16, path: Wa.default.createElement("path", { d: "M2.8 2.06A1.75 1.75 0 0 1 4.41 1h7.18c.7 0 1.333.417 1.61 1.06l2.74 6.395c.04.093.06.194.06.295v4.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25v-4.5c0-.101.02-.202.06-.295Zm1.61.44a.25.25 0 0 0-.23.152L1.887 8H4.75a.75.75 0 0 1 .6.3L6.625 10h2.75l1.275-1.7a.75.75 0 0 1 .6-.3h2.863L11.82 2.652a.25.25 0 0 0-.23-.152Zm10.09 7h-2.875l-1.275 1.7a.75.75 0 0 1-.6.3h-3.5a.75.75 0 0 1-.6-.3L4.375 9.5H1.5v3.75c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Z" }) }, 24: { width: 24, path: Wa.default.createElement("path", { d: "M4.801 3.57A1.75 1.75 0 0 1 6.414 2.5h11.174c.702 0 1.337.42 1.611 1.067l3.741 8.828c.04.092.06.192.06.293v7.562A1.75 1.75 0 0 1 21.25 22H2.75A1.75 1.75 0 0 1 1 20.25v-7.5c0-.1.02-.199.059-.291L4.8 3.571ZM6.414 4a.25.25 0 0 0-.23.153L2.88 12H8a.75.75 0 0 1 .648.372L10.18 15h3.638l1.533-2.628a.75.75 0 0 1 .64-.372l5.13-.051-3.304-7.797a.25.25 0 0 0-.23-.152ZM21.5 13.445l-5.067.05-1.535 2.633a.75.75 0 0 1-.648.372h-4.5a.75.75 0 0 1-.648-.372L7.57 13.5H2.5v6.75c0 .138.112.25.25.25h18.5a.25.25 0 0 0 .25-.25Z" }) } };
var $a = Wa.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-inbox", Q5, J5);
});
$a.displayName = "InboxIcon";
var So = T(S(), 1);
var e2 = ["16", "24"];
var t2 = { 16: { width: 16, path: So.default.createElement("path", { d: "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" }) }, 24: { width: 24, path: So.default.createElement(So.default.Fragment, null, So.default.createElement("path", { d: "M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z" }), So.default.createElement("path", { d: "M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z" })) } };
var Fn = So.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-info", t2, e2);
});
Fn.displayName = "InfoIcon";
var Je = T(S(), 1);
var o2 = ["16", "24"];
var r2 = { 16: { width: 16, path: Je.default.createElement(Je.default.Fragment, null, Je.default.createElement("path", { d: "M5 8.25a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 5 8.25ZM4 10.5A.75.75 0 0 0 4 12h4a.75.75 0 0 0 0-1.5H4Z" }), Je.default.createElement("path", { d: "M13-.005c1.654 0 3 1.328 3 3 0 .982-.338 1.933-.783 2.818-.443.879-1.028 1.758-1.582 2.588l-.011.017c-.568.853-1.104 1.659-1.501 2.446-.398.789-.623 1.494-.623 2.136a1.5 1.5 0 1 0 2.333-1.248.75.75 0 0 1 .834-1.246A3 3 0 0 1 13 16H3a3 3 0 0 1-3-3c0-1.582.891-3.135 1.777-4.506.209-.322.418-.637.623-.946.473-.709.923-1.386 1.287-2.048H2.51c-.576 0-1.381-.133-1.907-.783A2.68 2.68 0 0 1 0 2.995a3 3 0 0 1 3-3Zm0 1.5a1.5 1.5 0 0 0-1.5 1.5c0 .476.223.834.667 1.132A.75.75 0 0 1 11.75 5.5H5.368c-.467 1.003-1.141 2.015-1.773 2.963-.192.289-.381.571-.558.845C2.13 10.711 1.5 11.916 1.5 13A1.5 1.5 0 0 0 3 14.5h7.401A2.989 2.989 0 0 1 10 13c0-.979.338-1.928.784-2.812.441-.874 1.023-1.748 1.575-2.576l.017-.026c.568-.853 1.103-1.658 1.501-2.448.398-.79.623-1.497.623-2.143 0-.838-.669-1.5-1.5-1.5Zm-10 0a1.5 1.5 0 0 0-1.5 1.5c0 .321.1.569.27.778.097.12.325.227.74.227h7.674A2.737 2.737 0 0 1 10 2.995c0-.546.146-1.059.401-1.5Z" })) }, 24: { width: 24, path: Je.default.createElement(Je.default.Fragment, null, Je.default.createElement("path", { d: "M9.197 10a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm-2.382 4a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm-1.581 4a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" }), Je.default.createElement("path", { d: "M4.125 0h15.75a4.11 4.11 0 0 1 2.92 1.205A4.11 4.11 0 0 1 24 4.125c0 1.384-.476 2.794-1.128 4.16-.652 1.365-1.515 2.757-2.352 4.104l-.008.013c-.849 1.368-1.669 2.691-2.28 3.97-.614 1.283-.982 2.45-.982 3.503a2.625 2.625 0 1 0 4.083-2.183.75.75 0 1 1 .834-1.247A4.126 4.126 0 0 1 19.875 24H4.5a4.125 4.125 0 0 1-4.125-4.125c0-2.234 1.258-4.656 2.59-6.902.348-.586.702-1.162 1.05-1.728.8-1.304 1.567-2.553 2.144-3.738H3.39c-.823 0-1.886-.193-2.567-1.035A3.647 3.647 0 0 1 0 4.125 4.125 4.125 0 0 1 4.125 0ZM15.75 19.875c0-1.38.476-2.786 1.128-4.15.649-1.358 1.509-2.743 2.343-4.086l.017-.028c.849-1.367 1.669-2.692 2.28-3.972.614-1.285.982-2.457.982-3.514A2.615 2.615 0 0 0 19.875 1.5a2.625 2.625 0 0 0-2.625 2.625c0 .865.421 1.509 1.167 2.009A.75.75 0 0 1 18 7.507H7.812c-.65 1.483-1.624 3.069-2.577 4.619-.334.544-.666 1.083-.98 1.612-1.355 2.287-2.38 4.371-2.38 6.137A2.625 2.625 0 0 0 4.5 22.5h12.193a4.108 4.108 0 0 1-.943-2.625ZM1.5 4.125c-.01.511.163 1.008.487 1.403.254.313.74.479 1.402.479h12.86a3.648 3.648 0 0 1-.499-1.882 4.11 4.11 0 0 1 .943-2.625H4.125A2.625 2.625 0 0 0 1.5 4.125Z" })) } };
var qa = Je.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-log", r2, o2);
});
qa.displayName = "LogIcon";
var Io = T(S(), 1);
var n2 = ["16", "24"];
var s2 = { 16: { width: 16, path: Io.default.createElement("path", { d: "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z" }) }, 24: { width: 24, path: Io.default.createElement(Io.default.Fragment, null, Io.default.createElement("path", { d: "M9.5 15.584V8.416a.5.5 0 0 1 .77-.42l5.576 3.583a.5.5 0 0 1 0 .842l-5.576 3.584a.5.5 0 0 1-.77-.42Z" }), Io.default.createElement("path", { d: "M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Zm11-9.5A9.5 9.5 0 0 0 2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5Z" })) } };
var Ya = Io.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-play", s2, n2);
});
Ya.displayName = "PlayIcon";
var Xa = T(S(), 1);
var a2 = ["16", "24"];
var i2 = { 16: { width: 16, path: Xa.default.createElement("path", { d: "M4 8H2.5a1 1 0 0 0-1 1v5.25a.75.75 0 0 1-1.5 0V9a2.5 2.5 0 0 1 2.5-2.5H4V5.133a1.75 1.75 0 0 1 1.533-1.737l2.831-.353.76-.913c.332-.4.825-.63 1.344-.63h.782c.966 0 1.75.784 1.75 1.75V4h2.25a.75.75 0 0 1 0 1.5H13v4h2.25a.75.75 0 0 1 0 1.5H13v.75a1.75 1.75 0 0 1-1.75 1.75h-.782c-.519 0-1.012-.23-1.344-.63l-.761-.912-2.83-.354A1.75 1.75 0 0 1 4 9.867Zm6.276-4.91-.95 1.14a.753.753 0 0 1-.483.265l-3.124.39a.25.25 0 0 0-.219.248v4.734c0 .126.094.233.219.249l3.124.39a.752.752 0 0 1 .483.264l.95 1.14a.25.25 0 0 0 .192.09h.782a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25h-.782a.25.25 0 0 0-.192.09Z" }) }, 24: { width: 24, path: Xa.default.createElement("path", { d: "M7 11.5H2.938c-.794 0-1.438.644-1.438 1.437v8.313a.75.75 0 0 1-1.5 0v-8.312A2.939 2.939 0 0 1 2.937 10H7V6.151c0-.897.678-1.648 1.57-1.74l6.055-.626 1.006-1.174A1.752 1.752 0 0 1 16.96 2h1.29c.966 0 1.75.784 1.75 1.75V6h3.25a.75.75 0 0 1 0 1.5H20V14h3.25a.75.75 0 0 1 0 1.5H20v2.25a1.75 1.75 0 0 1-1.75 1.75h-1.29a1.75 1.75 0 0 1-1.329-.611l-1.006-1.174-6.055-.627A1.749 1.749 0 0 1 7 15.348Zm9.77-7.913v.001l-1.201 1.4a.75.75 0 0 1-.492.258l-6.353.657a.25.25 0 0 0-.224.249v9.196a.25.25 0 0 0 .224.249l6.353.657c.191.02.368.112.493.258l1.2 1.401a.252.252 0 0 0 .19.087h1.29a.25.25 0 0 0 .25-.25v-14a.25.25 0 0 0-.25-.25h-1.29a.252.252 0 0 0-.19.087Z" }) } };
var Ja = Xa.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-plug", i2, a2);
});
Ja.displayName = "PlugIcon";
var Qa = T(S(), 1);
var l2 = ["16", "24"];
var c2 = { 16: { width: 16, path: Qa.default.createElement("path", { d: "M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z" }) }, 24: { width: 24, path: Qa.default.createElement("path", { d: "M11.75 4.5a.75.75 0 0 1 .75.75V11h5.75a.75.75 0 0 1 0 1.5H12.5v5.75a.75.75 0 0 1-1.5 0V12.5H5.25a.75.75 0 0 1 0-1.5H11V5.25a.75.75 0 0 1 .75-.75Z" }) } };
var ei = Qa.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-plus", c2, l2);
});
ei.displayName = "PlusIcon";
var ti = T(S(), 1);
var u2 = ["16", "24"];
var d2 = { 16: { width: 16, path: ti.default.createElement("path", { d: "M14.064 0h.186C15.216 0 16 .784 16 1.75v.186a8.752 8.752 0 0 1-2.564 6.186l-.458.459c-.314.314-.641.616-.979.904v3.207c0 .608-.315 1.172-.833 1.49l-2.774 1.707a.749.749 0 0 1-1.11-.418l-.954-3.102a1.214 1.214 0 0 1-.145-.125L3.754 9.816a1.218 1.218 0 0 1-.124-.145L.528 8.717a.749.749 0 0 1-.418-1.11l1.71-2.774A1.748 1.748 0 0 1 3.31 4h3.204c.288-.338.59-.665.904-.979l.459-.458A8.749 8.749 0 0 1 14.064 0ZM8.938 3.623h-.002l-.458.458c-.76.76-1.437 1.598-2.02 2.5l-1.5 2.317 2.143 2.143 2.317-1.5c.902-.583 1.74-1.26 2.499-2.02l.459-.458a7.25 7.25 0 0 0 2.123-5.127V1.75a.25.25 0 0 0-.25-.25h-.186a7.249 7.249 0 0 0-5.125 2.123ZM3.56 14.56c-.732.732-2.334 1.045-3.005 1.148a.234.234 0 0 1-.201-.064.234.234 0 0 1-.064-.201c.103-.671.416-2.273 1.15-3.003a1.502 1.502 0 1 1 2.12 2.12Zm6.94-3.935c-.088.06-.177.118-.266.175l-2.35 1.521.548 1.783 1.949-1.2a.25.25 0 0 0 .119-.213ZM3.678 8.116 5.2 5.766c.058-.09.117-.178.176-.266H3.309a.25.25 0 0 0-.213.119l-1.2 1.95ZM12 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" }) }, 24: { width: 24, path: ti.default.createElement("path", { d: "M20.322.75h1.176a1.75 1.75 0 0 1 1.75 1.749v1.177a10.75 10.75 0 0 1-2.925 7.374l-1.228 1.304a23.699 23.699 0 0 1-1.596 1.542v5.038c0 .615-.323 1.184-.85 1.5l-4.514 2.709a.75.75 0 0 1-1.12-.488l-.963-4.572a1.305 1.305 0 0 1-.14-.129L8.04 15.96l-1.994-1.873a1.305 1.305 0 0 1-.129-.14l-4.571-.963a.75.75 0 0 1-.49-1.12l2.71-4.514c.316-.527.885-.85 1.5-.85h5.037a23.668 23.668 0 0 1 1.542-1.594l1.304-1.23A10.753 10.753 0 0 1 20.321.75Zm-6.344 4.018v-.001l-1.304 1.23a22.275 22.275 0 0 0-3.255 3.851l-2.193 3.29 1.859 1.744a.545.545 0 0 1 .034.034l1.743 1.858 3.288-2.192a22.263 22.263 0 0 0 3.854-3.257l1.228-1.303a9.251 9.251 0 0 0 2.517-6.346V2.5a.25.25 0 0 0-.25-.25h-1.177a9.252 9.252 0 0 0-6.344 2.518ZM6.5 21c-1.209 1.209-3.901 1.445-4.743 1.49a.236.236 0 0 1-.18-.067.236.236 0 0 1-.067-.18c.045-.842.281-3.534 1.49-4.743.9-.9 2.6-.9 3.5 0 .9.9.9 2.6 0 3.5Zm-.592-8.588L8.17 9.017c.23-.346.47-.685.717-1.017H5.066a.25.25 0 0 0-.214.121l-2.167 3.612ZM16 15.112c-.333.248-.672.487-1.018.718l-3.393 2.262.678 3.223 3.612-2.167a.25.25 0 0 0 .121-.214ZM17.5 8a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 17.5 8Z" }) } };
var oi = ti.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-rocket", d2, u2);
});
oi.displayName = "RocketIcon";
var ri = T(S(), 1);
var p2 = ["16", "24"];
var m2 = { 16: { width: 16, path: ri.default.createElement("path", { d: "M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" }) }, 24: { width: 24, path: ri.default.createElement("path", { d: "M10.25 2a8.25 8.25 0 0 1 6.34 13.53l5.69 5.69a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-5.69-5.69A8.25 8.25 0 1 1 10.25 2ZM3.5 10.25a6.75 6.75 0 1 0 13.5 0 6.75 6.75 0 0 0-13.5 0Z" }) } };
var Qe = ri.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-search", m2, p2);
});
Qe.displayName = "SearchIcon";
var Mo = T(S(), 1);
var f2 = ["16", "24"];
var b2 = { 16: { width: 16, path: Mo.default.createElement("path", { d: "M7.467.133a1.748 1.748 0 0 1 1.066 0l5.25 1.68A1.75 1.75 0 0 1 15 3.48V7c0 1.566-.32 3.182-1.303 4.682-.983 1.498-2.585 2.813-5.032 3.855a1.697 1.697 0 0 1-1.33 0c-2.447-1.042-4.049-2.357-5.032-3.855C1.32 10.182 1 8.566 1 7V3.48a1.75 1.75 0 0 1 1.217-1.667Zm.61 1.429a.25.25 0 0 0-.153 0l-5.25 1.68a.25.25 0 0 0-.174.238V7c0 1.358.275 2.666 1.057 3.86.784 1.194 2.121 2.34 4.366 3.297a.196.196 0 0 0 .154 0c2.245-.956 3.582-2.104 4.366-3.298C13.225 9.666 13.5 8.36 13.5 7V3.48a.251.251 0 0 0-.174-.237l-5.25-1.68ZM8.75 4.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 1.5 0ZM9 10.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" }) }, 24: { width: 24, path: Mo.default.createElement(Mo.default.Fragment, null, Mo.default.createElement("path", { d: "M13 15.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-.25-8.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Z" }), Mo.default.createElement("path", { d: "M11.46.637a1.748 1.748 0 0 1 1.08 0l8.25 2.675A1.75 1.75 0 0 1 22 4.976V10c0 6.19-3.77 10.705-9.401 12.83a1.704 1.704 0 0 1-1.198 0C5.771 20.704 2 16.19 2 10V4.976c0-.76.49-1.43 1.21-1.664Zm.617 1.426a.253.253 0 0 0-.154 0L3.673 4.74a.25.25 0 0 0-.173.237V10c0 5.461 3.28 9.483 8.43 11.426a.199.199 0 0 0 .14 0C17.22 19.483 20.5 15.46 20.5 10V4.976a.25.25 0 0 0-.173-.237Z" })) } };
var ni = Mo.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-shield", b2, f2);
});
ni.displayName = "ShieldIcon";
var et = T(S(), 1);
var h2 = ["16", "24"];
var x2 = { 16: { width: 16, path: et.default.createElement(et.default.Fragment, null, et.default.createElement("path", { d: "M6.823 7.823a.25.25 0 0 1 0 .354l-2.396 2.396A.25.25 0 0 1 4 10.396V5.604a.25.25 0 0 1 .427-.177Z" }), et.default.createElement("path", { d: "M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25H9.5v-13H1.75a.25.25 0 0 0-.25.25ZM11 14.5h3.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11Z" })) }, 24: { width: 24, path: et.default.createElement(et.default.Fragment, null, et.default.createElement("path", { d: "M7.22 14.47 9.69 12 7.22 9.53a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3 3a.75.75 0 0 1 0 1.06l-3 3a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Z" }), et.default.createElement("path", { d: "M3.75 2h16.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0 1 20.25 22H3.75A1.75 1.75 0 0 1 2 20.25V3.75C2 2.784 2.784 2 3.75 2ZM3.5 3.75v16.5c0 .138.112.25.25.25H15v-17H3.75a.25.25 0 0 0-.25.25Zm13 16.75h3.75a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25H16.5Z" })) } };
var si = et.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-sidebar-collapse", x2, h2);
});
si.displayName = "SidebarCollapseIcon";
var tt = T(S(), 1);
var v2 = ["16", "24"];
var g2 = { 16: { width: 16, path: tt.default.createElement(tt.default.Fragment, null, tt.default.createElement("path", { d: "m4.177 7.823 2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354Z" }), tt.default.createElement("path", { d: "M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z" })) }, 24: { width: 24, path: tt.default.createElement(tt.default.Fragment, null, tt.default.createElement("path", { d: "M11.28 9.53 8.81 12l2.47 2.47a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-3-3a.75.75 0 0 1 0-1.06l3-3a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734Z" }), tt.default.createElement("path", { d: "M3.75 2h16.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0 1 20.25 22H3.75A1.75 1.75 0 0 1 2 20.25V3.75C2 2.784 2.784 2 3.75 2ZM3.5 3.75v16.5c0 .138.112.25.25.25H15v-17H3.75a.25.25 0 0 0-.25.25Zm13 16.75h3.75a.25.25 0 0 0 .25-.25V3.75a.25.25 0 0 0-.25-.25H16.5Z" })) } };
var ai = tt.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-sidebar-expand", g2, v2);
});
ai.displayName = "SidebarExpandIcon";
var ii = T(S(), 1);
var C2 = ["16", "24"];
var T2 = { 16: { width: 16, path: ii.default.createElement("path", { d: "M0 4.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 4.25Zm0 4a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 8.25Zm0 4a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75ZM13.5 10h2.25a.25.25 0 0 1 .177.427l-3 3a.25.25 0 0 1-.354 0l-3-3A.25.25 0 0 1 9.75 10H12V3.75a.75.75 0 0 1 1.5 0V10Z" }) }, 24: { width: 24, path: ii.default.createElement("path", { d: "M18.5 16.44V6.75a.75.75 0 0 0-1.5 0v9.69l-2.22-2.22a.75.75 0 1 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 1 0-1.06-1.06l-2.22 2.22ZM2 7.25a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 2 7.25Zm0 5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75Zm0 5a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z" }) } };
var li = ii.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-sort-desc", T2, C2);
});
li.displayName = "SortDescIcon";
var ci = T(S(), 1);
var y2 = ["16", "24"];
var S2 = { 16: { width: 16, path: ci.default.createElement("path", { d: "M7.198.57c.275-.752 1.34-.752 1.615 0l.849 2.317a5.819 5.819 0 0 0 3.462 3.463l2.317.848c.753.275.753 1.34 0 1.615l-2.317.849a5.815 5.815 0 0 0-3.462 3.462l-.849 2.317c-.275.753-1.34.753-1.615 0l-.848-2.317a5.819 5.819 0 0 0-3.463-3.462L.57 8.813c-.752-.275-.752-1.34 0-1.615l2.317-.848A5.823 5.823 0 0 0 6.35 2.887L7.198.57Zm.562 2.833A7.323 7.323 0 0 1 3.403 7.76l-.673.246.673.246a7.324 7.324 0 0 1 4.357 4.356l.246.673.246-.673a7.322 7.322 0 0 1 4.356-4.356l.673-.246-.673-.246a7.324 7.324 0 0 1-4.356-4.357l-.246-.673-.246.673Z" }) }, 24: { width: 24, path: ci.default.createElement("path", { d: "M11.191.565c.275-.754 1.342-.753 1.618 0l1.918 5.238a5.83 5.83 0 0 0 3.47 3.47l5.237 1.918c.755.275.755 1.342 0 1.618l-5.237 1.918a5.83 5.83 0 0 0-3.47 3.47l-1.918 5.237c-.276.755-1.343.755-1.618 0l-1.918-5.237a5.83 5.83 0 0 0-3.47-3.47L.565 12.809c-.753-.276-.754-1.342 0-1.618l5.238-1.918a5.83 5.83 0 0 0 3.47-3.47L11.191.565Zm-.505 5.756a7.336 7.336 0 0 1-4.365 4.365L2.73 12l3.591 1.315a7.333 7.333 0 0 1 4.365 4.365L12 21.269l1.315-3.589a7.33 7.33 0 0 1 4.365-4.365L21.269 12l-3.589-1.314a7.333 7.333 0 0 1-4.365-4.365L12 2.73l-1.314 3.591Z" }) } };
var ui = ci.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-sparkle", S2, y2);
});
ui.displayName = "SparkleIcon";
var Ro = T(S(), 1);
var I2 = ["16", "24"];
var M2 = { 16: { width: 16, path: Ro.default.createElement("path", { d: "M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" }) }, 24: { width: 24, path: Ro.default.createElement(Ro.default.Fragment, null, Ro.default.createElement("path", { d: "M12 7a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 12 7Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" }), Ro.default.createElement("path", { d: "M7.328 1.47a.749.749 0 0 1 .53-.22h8.284c.199 0 .389.079.53.22l5.858 5.858c.141.14.22.33.22.53v8.284a.749.749 0 0 1-.22.53l-5.858 5.858a.749.749 0 0 1-.53.22H7.858a.749.749 0 0 1-.53-.22L1.47 16.672a.749.749 0 0 1-.22-.53V7.858c0-.199.079-.389.22-.53Zm.84 1.28L2.75 8.169v7.662l5.419 5.419h7.662l5.419-5.418V8.168L15.832 2.75Z" })) } };
var di = Ro.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-stop", M2, I2);
});
di.displayName = "StopIcon";
var pi = T(S(), 1);
var R2 = ["16", "24"];
var _2 = { 16: { width: 16, path: pi.default.createElement("path", { d: "M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25ZM6.5 6.5v8h7.75a.25.25 0 0 0 .25-.25V6.5Zm8-1.5V1.75a.25.25 0 0 0-.25-.25H6.5V5Zm-13 1.5v7.75c0 .138.112.25.25.25H5v-8ZM5 5V1.5H1.75a.25.25 0 0 0-.25.25V5Z" }) }, 24: { width: 24, path: pi.default.createElement("path", { d: "M2 3.75C2 2.784 2.784 2 3.75 2h16.5c.966 0 1.75.784 1.75 1.75v16.5A1.75 1.75 0 0 1 20.25 22H3.75A1.75 1.75 0 0 1 2 20.25ZM9 9v11.5h11.25a.25.25 0 0 0 .25-.25V9Zm11.5-1.5V3.75a.25.25 0 0 0-.25-.25H9v4ZM3.5 9v11.25c0 .138.112.25.25.25H7.5V9Zm4-1.5v-4H3.75a.25.25 0 0 0-.25.25V7.5Z" }) } };
var mi = pi.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-table", _2, R2);
});
mi.displayName = "TableIcon";
var fi = T(S(), 1);
var P2 = ["16", "24"];
var k2 = { 16: { width: 16, path: fi.default.createElement("path", { d: "M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" }) }, 24: { width: 24, path: fi.default.createElement("path", { d: "M3.75 5.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Zm0 6a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Zm0 6a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" }) } };
var _o = fi.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-three-bars", k2, P2);
});
_o.displayName = "ThreeBarsIcon";
var bi = T(S(), 1);
var A2 = ["16", "24"];
var w2 = { 16: { width: 16, path: bi.default.createElement("path", { d: "M5.433 2.304A4.492 4.492 0 0 0 3.5 6c0 1.598.832 3.002 2.09 3.802.518.328.929.923.902 1.64v.008l-.164 3.337a.75.75 0 1 1-1.498-.073l.163-3.33c.002-.085-.05-.216-.207-.316A5.996 5.996 0 0 1 2 6a5.993 5.993 0 0 1 2.567-4.92 1.482 1.482 0 0 1 1.673-.04c.462.296.76.827.76 1.423v2.82c0 .082.041.16.11.206l.75.51a.25.25 0 0 0 .28 0l.75-.51A.249.249 0 0 0 9 5.282V2.463c0-.596.298-1.127.76-1.423a1.482 1.482 0 0 1 1.673.04A5.993 5.993 0 0 1 14 6a5.996 5.996 0 0 1-2.786 5.068c-.157.1-.209.23-.207.315l.163 3.33a.752.752 0 0 1-1.094.714.75.75 0 0 1-.404-.64l-.164-3.345c-.027-.717.384-1.312.902-1.64A4.495 4.495 0 0 0 12.5 6a4.492 4.492 0 0 0-1.933-3.696c-.024.017-.067.067-.067.16v2.818a1.75 1.75 0 0 1-.767 1.448l-.75.51a1.75 1.75 0 0 1-1.966 0l-.75-.51A1.75 1.75 0 0 1 5.5 5.282V2.463c0-.092-.043-.142-.067-.159Z" }) }, 24: { width: 24, path: bi.default.createElement("path", { d: "M7.875 2.292a.114.114 0 0 0-.032.018A7.239 7.239 0 0 0 4.75 8.25a7.248 7.248 0 0 0 3.654 6.297c.57.327.982.955.941 1.682v.002l-.317 6.058a.75.75 0 1 1-1.498-.078l.317-6.062v-.004c.006-.09-.047-.215-.188-.296A8.749 8.749 0 0 1 3.25 8.25a8.738 8.738 0 0 1 3.732-7.169 1.547 1.547 0 0 1 1.709-.064c.484.292.809.835.809 1.46v4.714a.25.25 0 0 0 .119.213l2.25 1.385c.08.05.182.05.262 0l2.25-1.385a.25.25 0 0 0 .119-.213V2.478c0-.626.325-1.169.81-1.461a1.547 1.547 0 0 1 1.708.064 8.741 8.741 0 0 1 3.732 7.17 8.747 8.747 0 0 1-4.41 7.598c-.14.081-.193.206-.188.296v.004l.318 6.062a.75.75 0 1 1-1.498.078l-.317-6.058v-.002c-.041-.727.37-1.355.94-1.682A7.247 7.247 0 0 0 19.25 8.25a7.239 7.239 0 0 0-3.093-5.94.114.114 0 0 0-.032-.018l-.01-.001c-.003 0-.014 0-.031.01-.036.022-.084.079-.084.177V7.19c0 .608-.315 1.172-.833 1.49l-2.25 1.385a1.75 1.75 0 0 1-1.834 0l-2.25-1.384A1.752 1.752 0 0 1 8 7.192V2.477c0-.098-.048-.155-.084-.176a.068.068 0 0 0-.031-.011l-.01.001Z" }) } };
var hi = bi.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-tools", w2, A2);
});
hi.displayName = "ToolsIcon";
var xi = T(S(), 1);
var E2 = ["16", "24"];
var N2 = { 16: { width: 16, path: xi.default.createElement("path", { d: "M0 1.75C0 .784.784 0 1.75 0h3.5C6.216 0 7 .784 7 1.75v3.5A1.75 1.75 0 0 1 5.25 7H4v4a1 1 0 0 0 1 1h4v-1.25C9 9.784 9.784 9 10.75 9h3.5c.966 0 1.75.784 1.75 1.75v3.5A1.75 1.75 0 0 1 14.25 16h-3.5A1.75 1.75 0 0 1 9 14.25v-.75H5A2.5 2.5 0 0 1 2.5 11V7h-.75A1.75 1.75 0 0 1 0 5.25Zm1.75-.25a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 0-.25-.25Zm9 9a.25.25 0 0 0-.25.25v3.5c0 .138.112.25.25.25h3.5a.25.25 0 0 0 .25-.25v-3.5a.25.25 0 0 0-.25-.25Z" }) }, 24: { width: 24, path: xi.default.createElement("path", { d: "M1 3a2 2 0 0 1 2-2h6.5a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H7v4.063C7 16.355 7.644 17 8.438 17H12.5v-2.5a2 2 0 0 1 2-2H21a2 2 0 0 1 2 2V21a2 2 0 0 1-2 2h-6.5a2 2 0 0 1-2-2v-2.5H8.437A2.939 2.939 0 0 1 5.5 15.562V11.5H3a2 2 0 0 1-2-2Zm2-.5a.5.5 0 0 0-.5.5v6.5a.5.5 0 0 0 .5.5h6.5a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5ZM14.5 14a.5.5 0 0 0-.5.5V21a.5.5 0 0 0 .5.5H21a.5.5 0 0 0 .5-.5v-6.5a.5.5 0 0 0-.5-.5Z" }) } };
var vi = xi.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-workflow", N2, E2);
});
vi.displayName = "WorkflowIcon";
var Ln = T(S(), 1);
var D2 = ["12", "16", "24"];
var F2 = { 12: { width: 12, path: Ln.default.createElement("path", { d: "M2.22 2.22a.749.749 0 0 1 1.06 0L6 4.939 8.72 2.22a.749.749 0 1 1 1.06 1.06L7.061 6 9.78 8.72a.749.749 0 1 1-1.06 1.06L6 7.061 3.28 9.78a.749.749 0 1 1-1.06-1.06L4.939 6 2.22 3.28a.749.749 0 0 1 0-1.06Z" }) }, 16: { width: 16, path: Ln.default.createElement("path", { d: "M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" }) }, 24: { width: 24, path: Ln.default.createElement("path", { d: "M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L13.06 12l5.22 5.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L12 13.06l-5.22 5.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06Z" }) } };
var Kt = Ln.default.forwardRef(function(e, t) {
  return F(e, t, "octicon octicon-x", F2, D2);
});
Kt.displayName = "XIcon";
var O = J.default.createElement;
var ke = (...e) => e.filter(Boolean).join(" ");
function zd({ owner: e, root: t, children: o }) {
  return (0, J.useLayoutEffect)(() => {
    let r = t.current;
    if (!r) return;
    Pn(r);
    let n = new MutationObserver((s) => {
      for (let a of s) for (let i of a.addedNodes) i.nodeType === 1 && Pn(i);
    });
    return n.observe(r, { childList: true, subtree: true }), () => n.disconnect();
  }, [t]), O(as, { targetDocument: e }, o);
}
function Ce(e, t) {
  return J.default.forwardRef(function({ className: r, ...n }, s) {
    return O(e, { ...n, ref: s, className: ke(t, r) });
  });
}
function Wl(e) {
  return J.default.forwardRef(function({ icon: o, children: r, appearance: n = "secondary", size: s = "medium", ...a }, i) {
    return O(e, { type: "button", ...a, ref: i, "data-appearance": n, "data-size": s, icon: o ? { className: "ct-button-icon", "aria-hidden": true, children: o } : void 0 }, r);
  });
}
var gi = Wl(ps);
var Wd = Wl(Ir);
function $l({ checked: e, defaultChecked: t = false, onChange: o, onClick: r, ...n }) {
  let [s, a] = (0, J.useState)(t);
  return O(L2, { ...n, checked: e ?? s, onClick: (i) => {
    if (r?.(i), i.defaultPrevented) return;
    let l = !(e ?? s);
    a(l), o?.(i, { checked: l });
  } });
}
var L2 = Wl(ms);
function $d(e) {
  return O($l, { ...e, className: ke("ct-button", e.className) });
}
var qd = Ce(Mr, "ct-toolbar-divider");
var ql = J.default.forwardRef(function({ orientation: t = "horizontal", ...o }, r) {
  return O(ws, { ...o, ref: r, vertical: t === "vertical", className: ke("ct-toolbar", o.className) });
});
var Yl = J.default.forwardRef(function({ className: t, style: o, ...r }, n) {
  let s = vs({ ...r, root: { className: "ct-input-root" }, input: { className: t, style: o } }, n);
  return r.value === void 0 && (delete s.input.value, s.input.defaultValue = r.defaultValue), gt(s);
});
var Yd = J.default.forwardRef(function({ className: t, textarea: o, resize: r = "vertical", style: n, ...s }, a) {
  let i = gs({ ...s, root: { className: "ct-textarea-root" }, textarea: { className: t, style: { resize: r, ...n } } }, o?.ref ?? a);
  return s.value === void 0 && (delete i.textarea.value, i.textarea.defaultValue = s.defaultValue), Ct(i);
});
var Xd = J.default.forwardRef(function({ className: t, style: o, ...r }, n) {
  return O(Cs, { ...r, ref: n, icon: null, root: { className: "ct-select-root" }, select: { className: t, style: o } });
});
function Jd({ text: e, children: t, ...o }) {
  return O("option", o, t ?? e);
}
var Qd = J.default.forwardRef(function({ label: t, hint: o, className: r, style: n, ...s }, a) {
  let i = Ts({ ...s, className: "ct-toggle-label ct-checkbox-label", input: { className: "ct-native-choice", role: "checkbox" }, indicator: { className: r, style: n, children: O(vo, { size: 12, "aria-hidden": true }) }, label: t || o ? { children: O("span", null, t, o ? O("span", { className: "ct-toggle-hint" }, o) : null) } : void 0 }, a);
  if (s.readOnly) {
    let l = i.input.onClick;
    i.input["aria-readonly"] = true, i.input.onClick = (c) => {
      l?.(c), c.preventDefault();
    }, i.input.onChange = void 0;
  }
  return Tt(i);
});
var B2 = J.default.forwardRef(function({ className: t, ...o }, r) {
  let n = ys({ ...o, root: { className: "ct-switch-control" }, input: { className: t }, indicator: { className: "ct-switch-indicator", "aria-hidden": true } }, r);
  return n.input["aria-checked"] = n.input.checked, o.readOnly && (n.input["aria-readonly"] = true), n.input["data-checked"] = n.root["data-checked"], n.input["data-size"] = o["data-size"], yt(n);
});
var ep = J.default.forwardRef(function({ label: t, hint: o, id: r, size: n = "medium", onLabel: s = "On", offLabel: a = "Off", checked: i, defaultChecked: l = false, onChange: c, readOnly: u, onClick: m, ...h }, d) {
  let [f, g] = (0, J.useState)(l), y = (0, J.useId)(), x = r ?? y;
  return O("div", { className: "ct-switch-field" }, t ? O("label", { id: `${x}-label`, htmlFor: x, className: "ct-switch-label" }, t) : null, O("div", { className: "ct-switch-row" }, O("label", { htmlFor: x, className: "ct-switch-state", "aria-hidden": true }, O("span", { className: "ct-switch-state-on" }, s), O("span", { className: "ct-switch-state-off" }, a)), O(B2, { ...h, id: x, ref: d, readOnly: u, checked: i ?? f, "data-size": n, "aria-labelledby": h["aria-labelledby"] ?? (t ? `${x}-label` : void 0), "aria-describedby": ke(h["aria-describedby"], o ? `${x}-hint` : void 0) || void 0, onClick: (v) => {
    u && v.preventDefault(), m?.(v);
  }, onChange: (v, C) => {
    u || (g(C.checked), c?.(v, C));
  } })), o ? O("span", { id: `${x}-hint`, className: "ct-toggle-hint" }, o) : null);
});
function tp({ label: e, description: t, className: o, ...r }) {
  return O("label", { className: ke("ct-radio-card", o) }, O(hr, { ...r, className: "ct-radio", input: { className: "ct-native-choice", role: "radio" }, indicator: { className: "ct-radio-indicator" } }), O("span", null, O("span", { className: "ct-radio-label" }, e), t ? O("span", { className: "ct-radio-description" }, t) : null));
}
function op(e) {
  return O(Rs, { ...e, className: ke("ct-radio-group", e.className) });
}
function rp({ label: e, hint: t, validationMessage: o, validationState: r, required: n, children: s, ...a }) {
  let i = e && typeof e == "object" && !J.default.isValidElement(e) ? e : { children: e }, l = i.htmlFor ?? (J.default.isValidElement(s) ? s.props.id : void 0);
  return O(Ps, { ...a, label: e ? { ...i, ...l ? { htmlFor: l } : {} } : void 0, hint: t ? { className: "ct-field-hint", children: t } : void 0, validationMessage: o ? { ...o, className: ke("ct-field-error", o.className) } : void 0, validationState: r, required: n }, s);
}
function np({ label: e, size: t = "tiny", className: o, ...r }) {
  return O("span", { ...r, className: ke("ct-spinner", o), role: "status", "data-size": t }, O("span", { className: "ct-spinner-ring", "aria-hidden": true }), e ? O("span", null, e) : r["aria-hidden"] ? null : O("span", { className: "ct-visually-hidden" }, "Loading"));
}
function sp({ value: e, max: t = 1, label: o, tone: r, className: n, ...s }) {
  return O("div", { className: n, "data-tone": r }, o ? O("span", { className: "ct-progress-label" }, o) : null, O(ks, { ...s, value: e, max: t, className: "ct-progress-track", bar: { className: "ct-progress-indicator" }, "aria-label": s["aria-label"] ?? o ?? "Progress" }));
}
function Ci({ appearance: e, color: t, showZero: o, count: r, children: n, className: s, ...a }) {
  return O("span", { ...a, className: s, "data-color": t, "data-appearance": e }, n ?? r);
}
var ap = Ci;
var ip = Ce("div", "ct-skeleton");
function lp({ size: e = 16, className: t, ...o }) {
  return O("div", { ...o, className: ke("ct-skeleton-item", t), style: { height: e, ...o.style } });
}
function cp({ ...e }) {
  return O(Ds, { ...e, selectTabOnFocus: false, className: ke("ct-tab-list", e.className) });
}
function up(e) {
  let t = Ar({ ...e, "data-value": e.value, className: "ct-tab" }, null);
  return t.disabled && (t.root.disabled = void 0, t.root["aria-disabled"] = true, t.root.onClick = (o) => o.preventDefault()), ct(t);
}
var Xl = Nr;
var Wo = so;
function dp({ backdrop: e, initialFocus: t, className: o, children: r, ...n }) {
  let s = (0, J.useRef)(null), a = Fr({ role: "dialog", ...n, className: o }, s);
  return (0, J.useLayoutEffect)(() => {
    a.open && (typeof t == "function" ? t() : s.current?.querySelector("input:not(:disabled), textarea:not(:disabled)") ?? s.current)?.focus();
  }, [a.open, t]), a.root.children = r, Lr(a);
}
var Jl = Ce(Or, "ct-dialog-body");
function pp({ action: e, children: t, ...o }) {
  return O("div", { className: "ct-dialog-heading" }, O(Br, o, t), e);
}
var Ql = Ce("div", "ct-dialog-content");
var ec = Ce(Vr, "ct-dialog-actions");
var mp = Vo;
var fp = It;
var bp = Ho;
function hp({ content: e, children: t, relationship: o = "description", positioning: r = "bottom" }) {
  let n = { top: "above", bottom: "below", left: "before", right: "after" }[r];
  return O(jo, { content: { children: e, className: "ct-tooltip" }, relationship: o, positioning: { position: n, offset: 4 }, showDelay: 100 }, t);
}
function tc({ inline: e, ...t }) {
  return O(Xr, t);
}
var oc = lo;
var rc = rn;
var nc = Ce(Jr, "ct-menu-list");
var xp = J.default.forwardRef(function({ icon: t, className: o, ...r }, n) {
  return O(Qr, { ...r, ref: n, className: ke("ct-menu-item", o), icon: t ? { className: "ct-menu-icon", "aria-hidden": true, children: t } : void 0 });
});
var vp = Ce(on, "ct-menu-divider");
var gp = nn;
var Cp = Ce(sn, "ct-menu-label");
function Tp(e) {
  return O(en, { ...e, checkmark: { className: "ct-menu-check", children: O(vo, { size: 16, "aria-hidden": true }) } });
}
function yp(e) {
  return O(tn, { ...e, checkmark: { className: "ct-menu-check", children: O(vo, { size: 16, "aria-hidden": true }) } });
}
var Sp = ca;
var Ip = hn;
function Mp({ children: e, className: t, ...o }) {
  return O(bn, { ...o, className: t, button: { className: "ct-disclosure-trigger" }, expandIcon: O(jt, { size: 16, "aria-hidden": true }) }, e);
}
function Rp({ keepMounted: e, className: t, ...o }) {
  let r = xn({ ...o, className: ke("ct-disclosure-panel", t) }, null);
  return !e && !r.open ? null : (r.root.hidden = !r.open, vn(r));
}
var _p = Ce("div", "ct-message-body");
var Pp = Ce("div", "ct-message-title");
var kp = Ce("div", "ct-message-actions");
function Ap({ intent: e = "info", children: t, ...o }) {
  let r = { info: Fn, success: ka, warning: Ta, error: di }[e] ?? Fn;
  return O("div", { ...o, role: e === "error" ? "alert" : "status", "data-intent": e }, O("span", { className: "ct-message-icon", "aria-hidden": true }, O(r, { size: 16 })), t);
}
var wp = Ce("table");
var Ep = Ce("thead");
var Np = Ce("th", "ct-tableHeaderCell");
var Dp = Ce("tbody");
var Fp = Ce("tr");
var Lp = Ce("td", "ct-tableCell");
function Bp(e) {
  let t = ba({ ...e, className: ke("ct-slider-control", e.className), input: { "aria-label": e["aria-label"] }, rail: { className: "ct-slider-track" }, thumb: { className: "ct-slider-thumb" } }, null), o = e.min ?? 0, r = e.max ?? 100, n = r > o ? (t.input.value - o) / (r - o) : 0;
  return t.root.style = { ...t.root.style, "--ct-slider-fraction": n, "--ct-slider-position": `${n * 100}%` }, Ht(t);
}
var O2 = J.default.forwardRef(function(t, o) {
  let r = (0, J.useRef)(null), n = yn(t, r);
  return n.root.popover = void 0, (0, J.useImperativeHandle)(o, () => ({ focusBoundary(s) {
    r.current?.focus(), s ? n.activeDescendantController.last() : n.activeDescendantController.first();
  } })), bt(n, po(n));
});
function Op({ options: e, placeholder: t = "Select an option", title: o = "Select an option", searchPlaceholder: r = "Filter", selectedOptions: n, defaultSelectedOptions: s, onOptionSelect: a, onOpenChange: i, open: l, defaultOpen: c = false, disabled: u, multiselect: m = false, ...h }) {
  let [d, f] = (0, J.useState)(s ?? []), [g, y] = (0, J.useState)(c), [x, v] = (0, J.useState)(""), C = n ?? d, b = l ?? g, _ = (0, J.useRef)(null), I = (0, J.useRef)(null), L = (0, J.useId)();
  (0, J.useLayoutEffect)(() => {
    let M = I.current;
    if (!b || !M) return;
    let B = () => {
      M.matches(":popover-open") && M.querySelector(".ct-select-search")?.focus();
    };
    return M.addEventListener("toggle", B), B(), () => M.removeEventListener("toggle", B);
  }, [b]);
  let V = e.filter((M) => M.label.toLocaleLowerCase().includes(x.toLocaleLowerCase())), w = (M, B) => {
    y(B.open), B.open && v(""), i?.(M, B);
  };
  return O(Vo, { open: b, onOpenChange: w, positioning: "below-start" }, O(It, { disableButtonEnhancement: true }, O(gi, { ...h, disabled: u }, C.map((M) => e.find((B) => B.value === M)?.label).filter(Boolean).join(", ") || t, O(He, { size: 16, "aria-hidden": true }))), O(Ho, { ref: I, as: "div", className: "ct-select-panel", "aria-labelledby": L }, O("div", { className: "ct-select-panel-heading", id: L }, o), O("div", { className: "ct-select-search-row" }, O(Qe, { size: 16, "aria-hidden": true }), O(Yl, { className: "ct-input ct-select-search", placeholder: r, "aria-label": r, value: x, onChange: (M, B) => v(B.value), onKeyDown: (M) => {
    !M.nativeEvent.isComposing && (M.key === "ArrowDown" || M.key === "ArrowUp") && (M.preventDefault(), _.current?.focusBoundary(M.key === "ArrowUp"));
  } })), O(O2, { ref: _, className: "ct-select-options", multiselect: m, selectedOptions: C, "aria-labelledby": L, onOptionSelect: (M, B) => {
    f(B.selectedOptions), a?.(M, B), m || w(M, { open: false });
  } }, V.map((M) => O(Sn, { key: M.value, value: M.value, text: M.label, disabled: M.disabled, className: "ct-select-option", checkIcon: { className: "ct-option-check", children: O(vo, { size: 16, "aria-hidden": true }) } }, O("span", null, O("span", { className: "ct-option-label" }, M.label), M.description ? O("span", { className: "ct-option-description" }, M.description) : null))), V.length === 0 ? O("div", { className: "ct-select-empty", role: "status" }, "No matches") : null)));
}
var Vp = T(S(), 1);
var H2 = { back: ho, forward: xo, search: Qe, panel: ai, commands: qa, rocket: oi, gear: ja, globe: za, shield: ni, clock: Ea, file: Za, broadcast: _a, inbox: $a, database: Oa, table: mi, workflow: vi, plug: Ja, copilot: Dn, agent: Dn, code: La, tools: hi, "file-code": Ua, play: Ya, plus: ei, cloud: Da, desktop: Ha, sparkle: ui, menu: _o, collapse: si, close: Kt, success: Aa, "chevron-down": He };
function Po({ name: e, size: t = 20, ...o }) {
  let r = H2[e];
  if (!r) throw new RangeError(`Unknown canvas symbol: ${e}`);
  return Vp.default.createElement(r, { size: t, "aria-hidden": true, ...o });
}
var p = q.default.createElement;
var Y = (...e) => e.filter(Boolean).join(" ");
function Hp({ children: e, document: t = globalThis.document, className: o, ...r }) {
  let n = (0, q.useRef)(null);
  return p(zd, { owner: t, root: n }, p("div", { ...r, ref: n, className: Y("ct-provider", o) }, e));
}
function he(e, t, o = {}) {
  let r = q.default.forwardRef(function({ className: s, ...a }, i) {
    return p(e, { ...o, ...a, ref: i, className: Y(`ct-${t}`, s), ...t === "button" ? { "data-appearance": a.appearance ?? o.appearance ?? "secondary" } : {} });
  });
  return r.displayName = t, r;
}
var se = he(gi, "button");
var sZ = he(Qd, "checkbox");
var aZ = he(ep, "switch");
var G2 = he(Yd, "textarea", { resize: "vertical" });
var iZ = he(Xd, "select");
var Ti = he(np, "spinner", { size: "tiny" });
var Gp = he(sp, "progress");
var lZ = he(Ci, "badge", { appearance: "tint", color: "informative" });
var cZ = he(ap, "counter", { appearance: "tint", showZero: true });
var uZ = he(Ci, "tag", { appearance: "outline" });
var dZ = he($l, "filter-pill", { appearance: "subtle" });
var Z2 = he(ql, "toolbar");
var pZ = mp;
var Zp = hp;
var mZ = he(ip, "skeleton");
var fZ = lp;
var bZ = Jd;
var hZ = tp;
var sc = xp;
var xZ = vp;
var vZ = gp;
var Up = Cp;
var U2 = he(Wd, "button");
var gZ = $d;
var CZ = qd;
var TZ = fp;
var yZ = he(bp, "popover");
var SZ = Wo;
var jp = he(dp, "dialog");
var IZ = Jl;
var Kp = he(pp, "dialog-title");
var MZ = Ql;
var RZ = ec;
var _Z = Ep;
var PZ = Np;
var kZ = Dp;
var AZ = Fp;
var wZ = Lp;
var ko = he(Yl, "input");
function $o({ label: e, hint: t, error: o, required: r, children: n, className: s, ...a }) {
  return p(rp, { ...a, label: e, hint: t, required: r, validationMessage: o ? { children: o, role: "alert" } : void 0, validationState: o ? "error" : "none", className: Y("ct-field", s) }, n);
}
function EZ({ label: e, hint: t, error: o, required: r, input: n = {}, action: s, preview: a, className: i }) {
  let l = (0, q.useId)();
  return p("div", { className: Y("ct-input-action", i) }, p($o, { label: n.id ? { children: e, htmlFor: n.id } : e, hint: t, error: o, required: r }, p("div", { className: "ct-input-action-row" }, p(ko, { ...n, required: r ?? n.required, "aria-describedby": Y(n["aria-describedby"], a ? l : "") || void 0 }), p(se, s))), a ? p("div", { id: l, className: "ct-preview" }, a) : null);
}
function j2({ label: e, hint: t, children: o, className: r, ...n }) {
  let s = (0, q.useId)();
  return p("fieldset", { className: Y("ct-choice-group", r) }, e ? p("legend", { id: s }, e) : null, t ? p("p", { id: `${s}-hint`, className: "ct-choice-hint" }, t) : null, p(op, { "aria-labelledby": e ? s : void 0, "aria-describedby": t ? `${s}-hint` : void 0, ...n }, o));
}
var NZ = j2;
function DZ({ label: e, hint: t, variant: o = "plain", children: r, className: n, ...s }) {
  let a = (0, q.useId)();
  return p("fieldset", { ...s, className: Y("ct-choice-group", n), "data-variant": o, "aria-describedby": Y(s["aria-describedby"], t ? `${a}-hint` : "") || void 0 }, e ? p("legend", null, e) : null, t ? p("p", { id: `${a}-hint`, className: "ct-choice-hint" }, t) : null, r);
}
function FZ({ items: e, selectedValue: t, defaultSelectedValue: o, onTabSelect: r, variant: n = "underline", className: s, ...a }) {
  let [i, l] = (0, q.useState)(o ?? e[0]?.value), c = t ?? i, u = (0, q.useId)();
  return p("div", { className: Y("ct-tabs", s), "data-variant": n }, p(cp, { ...a, selectedValue: c, onTabSelect: (m, h) => {
    l(h.value), r?.(m, h);
  } }, e.map((m, h) => p(up, { key: m.value, id: `${u}-${h}-tab`, value: m.value, disabled: m.disabled, icon: m.icon, "aria-controls": `${u}-${h}-panel` }, m.label))), e.map((m, h) => p("div", { key: m.value, role: "tabpanel", id: `${u}-${h}-panel`, "aria-labelledby": `${u}-${h}-tab`, hidden: m.value !== c, tabIndex: 0 }, m.children)));
}
function Bn({ children: e, label: t = "More actions", button: o = {}, popover: r = {}, menu: n = {}, checkedValues: s, onCheckedValueChange: a, ...i }) {
  return p(tc, { ...i, inline: true }, p(oc, { disableButtonEnhancement: true }, p(se, o, t)), p(rc, { ...r, className: Y("ct-menu", r.className) }, p(nc, { ...n, checkedValues: s, onCheckedValueChange: a }, e)));
}
function LZ({ button: e = {}, menuButton: t = {}, menuLabel: o = "More actions", children: r, disabled: n = false, collapseLabel: s = false, className: a, ...i }) {
  let l = n || e.disabled;
  return p("span", { className: Y("ct-split-button", a), role: "group", "data-collapse-label": s || void 0, "data-size": e.size ?? "medium", "aria-label": typeof e.children == "string" ? e.children : e["aria-label"] }, p(se, { ...e, disabled: l, className: Y("ct-split-primary", !e.children && "ct-split-icon", e.className) }, s ? p("span", { className: "ct-split-label" }, e.children) : e.children), p(tc, i, p(oc, null, p(se, { appearance: e.appearance, size: e.size, "aria-label": o, ...t, disabled: l || t.disabled, className: Y("ct-split-chevron", t.className), icon: p(He, { size: 16, "aria-hidden": true }) })), p(rc, { className: "ct-menu" }, p(nc, { "aria-label": o }, r))));
}
function BZ({ trigger: e, title: t, subtitle: o, children: r, actions: n, closeLabel: s = "Close", size: a = "large", ...i }) {
  let l = (0, q.useId)();
  return p(Xl, i, e ? p(Wo, { disableButtonEnhancement: true }, e) : null, p(jp, { className: "ct-composed-dialog", "data-size": a, "aria-describedby": o ? l : void 0 }, p("header", { className: "ct-composed-dialog-header" }, p(Kp, { action: p(Wo, null, p(se, { appearance: "subtle", className: "ct-icon-button", "aria-label": s, icon: p(Kt, { size: 16 }) })) }, t), o ? p("p", { id: l, className: "ct-dialog-subtitle" }, o) : null), p("div", { className: "ct-composed-dialog-content" }, r), n ? p(ec, { className: "ct-composed-dialog-actions" }, n) : null));
}
function OZ({ options: e, className: t, ...o }) {
  return p(Op, { ...o, options: e, className: Y("ct-combobox", t) });
}
function VZ({ title: e = "Jump to destination", commands: t, onCommand: o, trigger: r, open: n, defaultOpen: s = false, onOpenChange: a, hint: i = "Filter destinations and actions, not work items", placeholder: l = "Filter destinations...", emptyMessage: c = "No matching destination.", closeLabel: u = "Close quick navigation", resultsLabel: m = "Destinations", query: h, onQueryChange: d, closeOnCommand: f = true, beforeResults: g, surface: y = {}, searchInput: x = {}, closeButton: v = {}, results: C = {}, ...b }) {
  let [_, I] = (0, q.useState)(s), [L, V] = (0, q.useState)(""), w = h ?? L, M = t.filter((W) => `${W.label} ${W.description ?? ""}`.toLocaleLowerCase().includes(w.trim().toLocaleLowerCase())), B = /* @__PURE__ */ new Map();
  for (let W of M) {
    let pe = W.group ?? "";
    B.has(pe) || B.set(pe, []), B.get(pe).push(W);
  }
  let j = (0, q.useRef)(null), E = (0, q.useRef)(null), D = (0, q.useId)(), K = n ?? _;
  (0, q.useLayoutEffect)(() => {
    K && (V(""), j.current?.focus());
  }, [K]);
  let k = (W, pe) => {
    I(pe.open), a?.(W, pe);
  }, H = (W) => W.disabled || W.button?.disabled || [true, "true"].includes(W.button?.["aria-disabled"]), ie = (W, pe) => {
    !pe || H(pe) || (f && k(W, { open: false, type: "trigger", event: W }), o?.(W, pe.value));
  }, ot = (W) => {
    let pe = [...E.current?.querySelectorAll("button") ?? []].filter((Gn) => !Gn.disabled);
    (W ? pe.at(-1) : pe[0])?.focus();
  }, Se = [...B].map(([W, pe]) => {
    let Gn = pe.map((Le) => p(U2, { ...Le.button, key: Le.value, appearance: "subtle", disabled: Le.disabled || Le.button?.disabled, "data-command": Le.value, onClick: (Ri) => {
      Le.button?.onClick?.(Ri), Ri.defaultPrevented || ie(Ri, Le);
    }, icon: Le.icon }, p("span", null, Le.label, Le.description ? p("span", { className: "ct-palette-description" }, Le.description) : null)));
    return W ? p("section", { key: W, "aria-label": W }, W ? p("h3", { className: "ct-palette-group" }, W) : null, Gn) : Gn;
  });
  return p(Xl, { ...b, open: K, onOpenChange: k }, r ? p(Wo, { disableButtonEnhancement: true }, r) : null, p(jp, { ...y, className: Y("ct-palette", y.className), backdrop: { className: "ct-palette-backdrop" } }, p(Jl, null, p(Kp, { action: p(Wo, { disableButtonEnhancement: true }, p(se, { appearance: "subtle", "aria-label": u, ...v, className: Y("ct-palette-close", v.className), icon: p(Kt, { size: 16 }) })) }, e), p(Ql, null, p($o, { label: { children: i, htmlFor: x.id ?? `${D}-query` } }, p(ko, { ...x, id: x.id ?? `${D}-query`, ref: j, type: "search", autoComplete: "off", placeholder: l, value: w, onChange: (W, pe) => {
    V(pe.value), d?.(W, pe);
  }, onKeyDown: (W) => {
    W.nativeEvent.isComposing || (W.key === "ArrowDown" || W.key === "ArrowUp" ? (W.preventDefault(), ot(W.key === "ArrowUp")) : W.key === "Enter" && (W.preventDefault(), ie(W, M.find((pe) => !H(pe)))));
  } })), g, p(ql, { ...C, ref: E, orientation: "vertical", className: Y("ct-palette-destinations", C.className), "aria-label": m, onKeyDown: (W) => {
    !W.nativeEvent.isComposing && (W.key === "Home" || W.key === "End") && (W.preventDefault(), ot(W.key === "End"));
  } }, Se), M.length === 0 ? p("p", { role: "status", className: "ct-muted" }, c) : null))));
}
function K2({ title: e, children: t, defaultOpen: o = false, keepMounted: r = false, ...n }) {
  return p(Sp, { ...n, collapsible: true, defaultOpenItems: o ? ["content"] : [] }, p(Ip, { value: "content" }, p(Mp, { className: "ct-disclosure-header" }, e), p(Rp, { keepMounted: r }, t)));
}
function yi({ title: e, children: t, intent: o = "info", actions: r, className: n, ...s }) {
  return p(Ap, { ...s, intent: o, "data-intent": o, className: Y("ct-message", n) }, p(_p, null, e ? p(Pp, null, e) : null, t), r ? p(kp, null, r) : null);
}
function zp({ title: e, description: t, icon: o, variant: r = "secondary", compact: n = false, joined: s = false, className: a, ...i }) {
  return p(gi, { ...i, appearance: r === "primary" ? "primary" : "secondary", className: Y("ct-action-card", a), "data-variant": r, "data-compact": n, "data-joined": s }, o ? p("span", { className: "ct-action-card-icon", "aria-hidden": true }, o) : p("span"), p("span", { className: "ct-action-card-text" }, p("span", { className: "ct-action-card-title" }, e), t ? p("span", { className: "ct-action-card-description" }, t) : null), p(r === "suggestion" ? Ma : jt, { className: "ct-action-card-arrow", size: r === "suggestion" ? 20 : 16, "aria-hidden": true }));
}
function HZ({ title: e, description: t, actions: o, className: r, ...n }) {
  return p("div", { ...n, className: Y("ct-section-header", r) }, p("div", null, p("h2", null, e), t ? p("p", null, t) : null), o);
}
function GZ({ onBack: e, onForward: t, onJump: o, backDisabled: r = false, forwardDisabled: n = false, variant: s = "classic", backLabel: a = "Back", forwardLabel: i = "Forward", jumpLabel: l = "Jump to", shortcutLabel: c, browse: u, label: m = "History", backButton: h = {}, forwardButton: d = {}, jumpButton: f = {}, layout: g = "inline", children: y, actions: x }) {
  return p("nav", { className: "ct-navigation", "aria-label": m, "data-jump": !!o, "data-variant": s, "data-layout": g }, p("div", { className: "ct-history" }, u ? p(se, { "aria-label": "Browse destinations", ...u, appearance: "subtle", className: Y("ct-browse", u.className), icon: u.icon ?? p(_o, { size: 16, "aria-hidden": true }) }) : null, e ? p(se, { appearance: "subtle", "aria-label": a, ...h, disabled: r || h.disabled, onClick: e }, p(s === "browser" ? wa : ho, { size: 20, "aria-hidden": true })) : null, t ? p(se, { appearance: "subtle", "aria-label": i, ...d, disabled: n || d.disabled, onClick: t }, p(s === "browser" ? jt : xo, { size: 20, "aria-hidden": true })) : null), y ? p("div", { className: "ct-navigation-identity" }, y) : null, o ? p(se, { appearance: g === "header" ? "subtle" : void 0, "aria-label": l, "aria-haspopup": "dialog", ...f, className: Y("ct-jump", f.className), onClick: o }, p(Qe, { size: g === "header" ? 16 : 20, "aria-hidden": true }), p("span", null, l), c ? p("kbd", null, c) : null, g === "header" ? p(He, { size: 16, "aria-hidden": true }) : null) : null, x);
}
function ZZ({ title: e, context: t, icon: o, navigation: r, actions: n, onHome: s, homeButton: a = {}, contextVisibility: i = "responsive", contextHidden: l = false, browse: c, history: u, className: m, ...h }) {
  let d = !!(c || u), f = p("div", { className: "ct-header-identity" }, o ? p("span", { className: "ct-header-icon", "aria-hidden": true }, o) : null, s ? p(se, { appearance: "subtle", ...a, onClick: s }, a.children ?? e) : p("h1", null, e), t ? p("span", { className: "ct-header-context", hidden: l }, p("span", { "aria-hidden": true }, "/"), p("span", { className: "ct-muted" }, t)) : null);
  return p("header", { ...h, className: Y("ct-header", m), "data-navigation": d || void 0, "data-context-visibility": i }, d ? p("div", { className: "ct-header-start" }, c ? p(se, { ...c, className: Y("ct-browse", c.className), appearance: "subtle", icon: c.icon ?? p(_o, { size: 16, "aria-hidden": true }) }) : null, u, f) : f, d ? null : p("div", { className: "ct-header-center" }, r), p("div", { className: "ct-header-actions" }, d ? r : null, n));
}
function Wp({ children: e, links: t, language: o, version: r, className: n, ...s }) {
  return p("footer", { ...s, className: Y("ct-footer", n) }, p("div", { className: "ct-actions" }, t, e), o, r ? p("span", { className: "ct-version" }, r) : null);
}
function UZ({ header: e, footer: t, children: o, className: r, ...n }) {
  return p("div", { ...n, className: Y("ct-shell", r) }, e, p("main", { className: "ct-main" }, o), t);
}
function jZ({ label: e = "Destinations", items: t = [], groups: o = [], current: r, onNavigate: n, variant: s = "sidebar", title: a }) {
  let i = (l) => p("ul", null, l.map((c) => p("li", { key: c.value }, p(se, { key: c.value, appearance: "subtle", icon: c.icon, ...c.button, disabled: c.disabled || c.button?.disabled, "aria-current": r === c.value ? "page" : void 0, onClick: (u) => n?.(u, c.value) }, c.label))));
  return p("nav", { "aria-label": e, className: "ct-product-navigation", "data-variant": s }, a ? p("h2", null, a) : null, i(t), o.map((l, c) => p("section", { key: c, "aria-label": l.label }, p("h3", null, l.label), i(l.items))));
}
function ac({ children: e, className: t, ...o }) {
  return p("div", { ...o, className: Y("ct-actions", t) }, e);
}
function KZ({ search: e, facets: t = [], values: o, defaultValues: r = {}, onFiltersChange: n, sort: s, resultCount: a, children: i, className: l, ...c }) {
  let [u, m] = (0, q.useState)(r), [h, d] = (0, q.useState)(s?.defaultValue ?? s?.options[0]?.value), f = o ?? u;
  if (!e && !t.length && !s) return p(Z2, { ...c, className: l }, i);
  let g = s?.value ?? h;
  return p("div", { ...c, role: "group", className: Y("ct-filter-toolbar", l) }, e ? p("div", { className: "ct-filter-search" }, p(Qe, { size: 16, "aria-hidden": true }), p(ko, { ...e, type: "search", "aria-label": e["aria-label"] ?? e.placeholder ?? "Search" })) : null, p("div", { className: "ct-filter-controls" }, t.map((y) => {
    let x = y.options.filter((C) => f[y.id]?.includes(C.value)), v = x.length ? `${y.label}: ${x.length === 1 ? x[0].label : x.length}` : y.label;
    return p(Bn, { key: y.id, label: p(q.default.Fragment, null, v, p(He, { size: 16, "aria-hidden": true })), button: { "aria-label": v, disabled: y.disabled }, checkedValues: { [y.id]: f[y.id] ?? [] }, onCheckedValueChange: (C, b) => {
      let _ = { ...f, [y.id]: b.checkedItems };
      m(_), n?.(C, { values: _ });
    } }, y.options.map((C) => p(Tp, { key: C.value, name: y.id, value: C.value, className: "ct-menu-choice", disabled: C.disabled }, C.label)));
  }), s ? p(Bn, { label: p(q.default.Fragment, null, p(li, { size: 16, "aria-hidden": true }), p("span", null, `${s.label ?? "Sort"}: ${s.options.find((y) => y.value === g)?.label ?? ""}`), p(He, { size: 16, "aria-hidden": true })), button: { className: "ct-filter-sort", "aria-label": `${s.label ?? "Sort"}: ${s.options.find((y) => y.value === g)?.label ?? ""}` }, checkedValues: { sort: [g] }, onCheckedValueChange: (y, x) => {
    let v = x.checkedItems[0];
    d(v), s.onChange?.(y, { value: v });
  } }, s.options.map((y) => p(yp, { key: y.value, name: "sort", value: y.value, disabled: y.disabled, className: "ct-menu-choice" }, y.label))) : null, i), a !== void 0 ? p("span", { role: "status", className: "ct-visually-hidden" }, `${a} results`) : null);
}
function zZ({ title: e, children: t, action: o, className: r, ...n }) {
  return p("div", { ...n, className: Y("ct-blankslate", r) }, p("h2", null, e), p("div", { className: "ct-muted" }, t), o);
}
function WZ({ title: e, status: t, statusTone: o = "neutral", children: r, actions: n, footer: s, onClose: a, closeLabel: i = "Close details", closeButton: l = {}, className: c, ...u }) {
  let m = (0, q.useId)();
  return p("section", { ...u, "aria-labelledby": u["aria-labelledby"] ?? m, className: Y("ct-detail", c) }, p("header", { className: "ct-detail-header" }, p("h2", { id: m }, e), t ? p("span", { className: "ct-detail-status", "data-tone": o }, t) : null, p("div", { className: "ct-actions ct-detail-actions" }, n, a ? p(se, { appearance: "subtle", "aria-label": i, ...l, className: Y("ct-icon-button", l.className), onClick: a, icon: p(Kt, { size: 16 }) }) : null)), p("div", { className: "ct-detail-body" }, r), s ? p("footer", { className: "ct-detail-footer" }, s) : null);
}
function $Z({ list: e, items: t = [], selectedValue: o, defaultSelectedValue: r, onSelect: n, title: s = "Items", actions: a, filters: i, searchable: l = true, searchLabel: c = "Search items", emptyMessage: u = "No matching items.", emptyDetail: m = "Select an item to view details.", backLabel: h = "Back to list", children: d, className: f, ...g }) {
  let [y, x] = (0, q.useState)(r), [v, C] = (0, q.useState)(""), [b, _] = (0, q.useState)(false), I = o === void 0 ? y : o, L = t.some((H) => H.value === I) ? I : void 0, V = (0, q.useRef)(null), w = (0, q.useRef)(null), M = (0, q.useId)(), B = (0, q.useId)(), j = t.filter((H) => `${H.title} ${H.description ?? ""} ${H.group ?? ""}`.toLocaleLowerCase().includes(v.trim().toLocaleLowerCase())), E = [...new Set(j.map((H) => H.group ?? ""))], D = (H, ie) => {
    x(ie.value), _(true), n?.(H, { value: ie.value }), V.current?.clientWidth < 760 && V.current.ownerDocument.defaultView.requestAnimationFrame(() => w.current?.focus());
  }, K = () => {
    _(false), V.current?.ownerDocument.defaultView.requestAnimationFrame(() => V.current?.querySelector(".ct-list-item[aria-current=true]")?.focus());
  }, k = typeof d == "function" ? d(L) : d;
  return p("div", { ...g, ref: V, className: Y("ct-list-detail", f), "data-view": e !== void 0 ? "slots" : b && L ? "detail" : "list" }, p("section", { className: "ct-list-pane", "aria-labelledby": M }, p("header", { className: "ct-list-heading" }, p("h2", { id: M }, s), p("div", { className: "ct-actions" }, a)), e ?? p(q.default.Fragment, null, l ? p("div", { className: "ct-filter-search ct-list-search" }, p(Qe, { size: 16, "aria-hidden": true }), p(ko, { type: "search", "aria-label": c, placeholder: c, value: v, onChange: (H, ie) => C(ie.value) })) : null, i, j.length ? E.map((H) => {
    let ie = j.filter((Se) => (Se.group ?? "") === H), ot = p("ul", null, ie.map((Se) => p("li", { key: Se.value }, p(se, { appearance: "subtle", className: "ct-list-item", disabled: Se.disabled, "aria-current": L === Se.value ? "true" : void 0, "aria-controls": B, onClick: (W) => D(W, Se) }, Se.icon ? p("span", { "aria-hidden": true }, Se.icon) : null, p("span", { className: "ct-list-item-text" }, p("span", null, Se.title), Se.description ? p("span", { className: "ct-muted" }, Se.description) : null), Se.meta ? p("span", { className: "ct-list-meta" }, Se.meta) : null, p(jt, { size: 16, "aria-hidden": true })))));
    return p("div", { key: H, className: "ct-list-group", "data-group": H }, H ? p(K2, { title: p(q.default.Fragment, null, p("span", null, H), " ", p("span", { className: "ct-list-group-count" }, ie.length)), defaultOpen: true }, ot) : ot);
  }) : p("p", { role: "status", className: "ct-list-empty" }, u))), p("section", { className: "ct-list-detail-pane", id: B, "aria-label": "Selected item" }, p("div", { className: "ct-list-detail-back", ref: w, tabIndex: -1, "aria-label": t.find((H) => H.value === L)?.title ?? "Details" }, p(se, { appearance: "subtle", onClick: K, icon: p(ho, { size: 16, "aria-hidden": true }) }, h)), k ?? p("p", { className: "ct-list-empty" }, m)));
}
function qZ({ first: e, second: t, ratio: o, onRatioChange: r, label: n = "First pane width", className: s }) {
  let [a, i] = (0, q.useState)(40), l = o ?? a;
  return p("div", { className: Y("ct-split", s) }, p("div", { className: "ct-split-content", style: { gridTemplateColumns: `${l}fr ${100 - l}fr` } }, e, t), p(z2, { label: n, value: l, onChange: (c, u) => {
    i(u.value), r?.(c, u);
  } }));
}
function z2({ label: e = "Pane width", ...t }) {
  return p(Bp, { ...t, min: 10, max: 90, "aria-label": e, className: "ct-resize" });
}
function W2({ children: e, label: t = "Code", title: o, language: r, actions: n, className: s, ...a }) {
  let i = p("pre", { ...a, className: Y("ct-code", s), "aria-label": t, tabIndex: 0 }, p("code", null, e));
  return !o && !r && !n ? i : p("section", { className: "ct-code-block", "aria-label": typeof o == "string" ? o : t }, o ? p("h3", null, o) : null, p("div", { className: "ct-code-frame" }, p("header", { className: "ct-code-header" }, p("span", null, r), p("div", { className: "ct-actions" }, n)), i));
}
function YZ({ children: e, label: t = "Output", status: o, description: r, emptyMessage: n = "No process output yet.", className: s, ...a }) {
  return p("section", { ...a, className: Y("ct-output", s), "aria-label": t }, p("header", { className: "ct-output-header" }, p("h3", null, t), o ? p("span", { role: "status", className: "ct-muted" }, o) : null), r ? p("p", { className: "ct-output-description" }, r) : null, p(W2, { label: `${t} log` }, e == null || e === "" ? n : e));
}
function XZ({ items: e, className: t, ...o }) {
  return p("dl", { ...o, className: Y("ct-key-values", t) }, e.map(({ label: r, value: n }, s) => p(q.default.Fragment, { key: s }, p("dt", null, r), p("dd", null, n))));
}
function JZ({ items: e, className: t, ...o }) {
  return p("dl", { ...o, className: Y("ct-metadata-list", t) }, e.map(({ label: r, value: n }, s) => p("div", { key: s }, p("dt", null, r), p("dd", null, n))));
}
var QZ = he(wp, "table");
function $p({ label: e = "Message", value: t, defaultValue: o = "", onChange: r, onSubmit: n, pending: s = false, error: a, placeholder: i, submitLabel: l = "Send", actions: c, input: u = {}, submitButton: m = {} }) {
  let h = (0, q.useRef)(null), [d, f] = (0, q.useState)(o), g = t ?? h.current?.value ?? d;
  return (0, q.useLayoutEffect)(() => {
    let y = h.current;
    if (!y) return;
    let x = () => {
      y.style.height = "0px", y.style.height = `${Math.max(104, y.scrollHeight)}px`;
    };
    x();
    let v = y.ownerDocument.defaultView?.ResizeObserver, C = y.clientWidth, b = v ? new v(() => {
      y.clientWidth !== C && (C = y.clientWidth, x());
    }) : void 0;
    return b?.observe(y), () => b?.disconnect();
  }, [t, d]), p("form", { className: "ct-composer", "aria-busy": s, onSubmit: (y) => {
    y.preventDefault(), !s && (t ?? h.current?.value ?? d).trim() && n?.(y);
  } }, p($o, { label: { children: e, className: "ct-visually-hidden" }, error: a }, p(G2, { ...u, ...t === void 0 ? { defaultValue: o } : { value: t }, onChange: (y, x) => {
    f(x.value), r?.(y, x);
  }, placeholder: i, disabled: s || u.disabled, resize: "none", textarea: { ref: h } })), p("div", { className: "ct-actions ct-actions-end", "data-composer-actions": "" }, c ? p("div", { className: "ct-composer-actions" }, c) : null, s ? p(Ti, { label: "Sending" }) : null, p(se, { type: "submit", className: "ct-composer-send", appearance: "primary", "aria-label": l, ...m, disabled: s || !g.trim() || m.disabled, icon: p(xo, { size: 20, "aria-hidden": true }) })));
}
function eU({ label: e, value: t, onChange: o, onSave: r, onCancel: n, pending: s = false, error: a }) {
  return p("form", { className: "ct-editor", "aria-busy": s, onSubmit: (i) => {
    i.preventDefault(), s || r?.(i);
  } }, p($o, { label: e, error: a }, p(ko, { value: t, onChange: o, disabled: s })), p(ac, null, p(se, { type: "submit", appearance: "primary", disabled: s }, "Save"), p(se, { onClick: n, disabled: s }, "Cancel")));
}
var ic = T(S(), 1);
var qp = T(rm(), 1);
var lc = T(om(), 1);
var Si = /* @__PURE__ */ new WeakMap();
function Ii(e, t, o = {}) {
  if (!e || e.nodeType !== 1) throw new TypeError("A DOM element is required.");
  if (!t || typeof t != "function" && typeof t != "object") throw new TypeError("A React component is required.");
  if (Si.has(e)) throw new Error("This container already has a toolkit React root. Dispose it first.");
  let r = (0, qp.createRoot)(e), n = o, s = false;
  function a() {
    (0, lc.flushSync)(() => r.render(ic.default.createElement(Hp, { document: e.ownerDocument }, ic.default.createElement(t, n))));
  }
  let i = { element: e, get disposed() {
    return s;
  }, update(l) {
    if (s) throw new Error("Cannot update a disposed canvas component.");
    n = { ...n, ...l }, a();
  }, dispose() {
    s || ((0, lc.flushSync)(() => r.unmount()), s = true, Si.delete(e));
  } };
  Si.set(e, i);
  try {
    a();
  } catch (l) {
    throw i.dispose(), l;
  }
  return i;
}
function On(e) {
  for (let t of [...e.children]) On(t);
  Si.get(e)?.dispose();
}
function nU(e, ...t) {
  On(e), e.replaceChildren(...t.flat(1 / 0).filter((o) => o != null && o !== false));
}
function aU({ input: e, button: t, submit: o, unavailable: r = () => false }) {
  let n = false, s = false, a = () => {
    t.disabled = s || r() || !e.value.trim();
  }, i = async () => {
    if (a(), !t.disabled) {
      s = true, a();
      try {
        return await o();
      } finally {
        s = false, a();
      }
    }
  }, l = (m) => {
    m.key !== "Enter" || m.shiftKey || m.isComposing || n || m.keyCode === 229 || (m.preventDefault(), t.click());
  }, c = () => {
    n = true;
  }, u = () => {
    n = false;
  };
  return e.addEventListener("input", a), e.addEventListener("keydown", l), e.addEventListener("compositionstart", c), e.addEventListener("compositionend", u), t.addEventListener("click", i), a(), { update: a, dispose() {
    e.removeEventListener("input", a), e.removeEventListener("keydown", l), e.removeEventListener("compositionstart", c), e.removeEventListener("compositionend", u), t.removeEventListener("click", i);
  } };
}
function iU(e, { label: t, focusFirst: o = false } = {}) {
  t && e.setAttribute("aria-label", t), e.setAttribute("role", "group");
  let r = () => [...e.querySelectorAll("button.task")].filter((s) => !s.disabled && s.getClientRects().length), n = (s) => {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(s.key)) return;
    let a = r(), i = a.indexOf(document.activeElement);
    if (i < 0) return;
    s.preventDefault();
    let l = s.key === "Home" ? 0 : s.key === "End" ? a.length - 1 : (i + (s.key === "ArrowDown" ? 1 : -1) + a.length) % a.length;
    a[l].focus();
  };
  return e.addEventListener("keydown", n), o && r()[0]?.focus(), { focus: () => r()[0]?.focus(), dispose: () => e.removeEventListener("keydown", n) };
}
var Mi;
function lU({ panel: e, trigger: t, closeButton: o, resizeHandle: r, storageKey: n, changed: s = () => {
}, returnFocus: a = () => t }) {
  let i = () => globalThis.matchMedia("(max-width: 900px)").matches, l = { width: 380, height: 280 };
  if (n) for (let w of Object.keys(l)) try {
    let M = globalThis.localStorage.getItem(`${n}:${w}`);
    if (M === null) continue;
    let B = Number(M);
    Number.isFinite(B) && B > 0 ? l[w] = B : console.error(`Invalid saved detail panel ${w}; using its default size.`);
  } catch (M) {
    if (M.name !== "SecurityError") throw M;
    console.error("Cannot read saved detail panel dimensions.", M);
  }
  let c = null, u, m = () => {
    let w = i() ? Math.floor(globalThis.innerHeight * 0.7) : 560;
    return { min: i() ? Math.min(180, w) : 280, max: w };
  }, h = (w) => Math.max(m().min, Math.min(m().max, w)), d = (w) => {
    if (n) try {
      globalThis.localStorage.setItem(`${n}:${w}`, String(l[w]));
    } catch (M) {
      if (!["SecurityError", "QuotaExceededError"].includes(M.name)) throw M;
      console.error("Cannot save detail panel dimensions.", M);
    }
  }, f = () => {
    if (e.hidden) return;
    let w = i();
    e.style.width = w ? "" : `${h(l.width)}px`, e.style.height = w ? `${h(l.height)}px` : "";
    let M = e.getBoundingClientRect();
    document.documentElement.style.setProperty("--workbench-detail-width", `${M.width}px`), document.documentElement.style.setProperty("--workbench-detail-height", `${M.height}px`), r && (r.setAttribute("aria-orientation", i() ? "horizontal" : "vertical"), r.setAttribute("aria-valuemin", String(m().min)), r.setAttribute("aria-valuemax", String(m().max)), r.setAttribute("aria-valuenow", String(Math.round(i() ? M.height : M.width))));
  }, g = typeof ResizeObserver > "u" ? null : new ResizeObserver(f);
  g?.observe(e);
  let y = (w, { restoreFocus: M = true } = {}) => {
    if (w === !e.hidden) return;
    let B = document.querySelector("main.app"), j = B ? { x: globalThis.scrollX, y: globalThis.scrollY + B.scrollTop } : null, E = e.contains(document.activeElement) || document.activeElement === document.body;
    if (w) {
      let D = document.activeElement;
      Mi?.setOpen(false, { restoreFocus: false }), u = t ?? D, Mi = V;
    }
    if (!w && c) {
      let D = c.id;
      c = null, r.hasPointerCapture(D) && r.releasePointerCapture(D);
    }
    e.hidden = !w, document.body.classList.toggle("workbench-details-open", w), t?.setAttribute("aria-expanded", String(w)), !w && Mi === V && (Mi = null), s(w), w && f(), j && (B.scrollTop = j.y, globalThis.scrollTo(j.x, j.y - B.scrollTop)), w ? o.focus() : M && E && (u !== document.body && u?.isConnected && u.getClientRects().length && !u.disabled ? u : a())?.focus({ preventScroll: true });
  }, x = () => y(e.hidden), v = () => y(false), C = (w) => {
    !e.hidden && w.key === "Escape" && !w.defaultPrevented && !document.activeElement.closest("dialog[open], [role=menu]") && (w.preventDefault(), v());
  }, b = (w) => {
    let M = i() ? "height" : "width", B = e.getBoundingClientRect()[M], j = w.shiftKey ? 40 : 16, E;
    w.key === "Home" ? E = m().min : w.key === "End" ? E = m().max : w.key === (i() ? "ArrowUp" : "ArrowLeft") ? E = B + j : w.key === (i() ? "ArrowDown" : "ArrowRight") && (E = B - j), E !== void 0 && (w.preventDefault(), l[M] = h(E), d(M), f());
  }, _ = (w) => {
    if (w.button !== 0) return;
    w.preventDefault();
    let M = i();
    c = { id: w.pointerId, compact: M, origin: M ? w.clientY : w.clientX, size: e.getBoundingClientRect()[M ? "height" : "width"] }, r.setPointerCapture(w.pointerId);
  }, I = (w) => {
    if (!c || c.id !== w.pointerId || c.compact !== i()) return;
    let M = c.size + c.origin - (c.compact ? w.clientY : w.clientX);
    l[c.compact ? "height" : "width"] = h(M), f();
  }, L = (w) => {
    c?.id === w.pointerId && (d(c.compact ? "height" : "width"), c = null, r.hasPointerCapture(w.pointerId) && r.releasePointerCapture(w.pointerId));
  };
  t?.addEventListener("click", x), o.addEventListener("click", v), document.addEventListener("keydown", C), r?.addEventListener("keydown", b), r?.addEventListener("pointerdown", _), r?.addEventListener("pointermove", I), r?.addEventListener("pointerup", L), r?.addEventListener("pointercancel", L), r?.addEventListener("lostpointercapture", L), globalThis.addEventListener?.("resize", f), e.setAttribute("role", "complementary"), t?.setAttribute("aria-expanded", "false");
  let V = { setOpen: y, dispose() {
    t?.removeEventListener("click", x), o.removeEventListener("click", v), document.removeEventListener("keydown", C), r?.removeEventListener("keydown", b), r?.removeEventListener("pointerdown", _), r?.removeEventListener("pointermove", I), r?.removeEventListener("pointerup", L), r?.removeEventListener("pointercancel", L), r?.removeEventListener("lostpointercapture", L), globalThis.removeEventListener?.("resize", f), g?.disconnect(), y(false);
  } };
  return V;
}
function cU({ editor: e, trigger: t, changed: o = () => {
} }) {
  let r, n = (a) => {
    r !== a && (r = a, e.hidden = !r, e.inert = !r, t.setAttribute("aria-expanded", String(r)), o(r));
  }, s = () => n(!r);
  return t.addEventListener("click", s), n(false), { setOpen: n, isOpen: () => r, dispose: () => t.removeEventListener("click", s) };
}
function uU({ shell: e, surface: t, trigger: o, collapsed: r = false, onCollapsed: n = () => {
} }) {
  let s, a = false, i = false, l = false, c = false, u = false, m, h = () => {
    clearTimeout(m), m = void 0;
  }, d = new AbortController(), f = (M, B, j, E = {}) => M.addEventListener(B, j, { ...E, signal: d.signal }), g = (M) => M instanceof Node && (o.contains(M) || t.contains(M)), y = () => s && !r, x = t.querySelector("[data-navigation-collapse]"), v = () => (y() && x ? x : o).focus(), C = () => {
    let M = document.activeElement === o, B = y() || a || i;
    t.hidden = !B, t.dataset.mode = y() ? "sidebar" : i ? "held" : "preview", e.dataset.navigationExpanded = String(!!y()), o.setAttribute("aria-expanded", String(!!B)), o.hidden = !!(y() && x), x && (x.hidden = !y()), t.querySelector("[data-navigation-close]").hidden = !i || s, o.hidden && M && v();
  }, b = (M = false) => {
    h(), a = i = false, u = false, l = o.matches(":hover"), c = M, C(), M && v();
  }, _ = (M) => {
    r = M, b(!!x || t.contains(document.activeElement)), n(r);
  }, I = () => {
    let M = e.getBoundingClientRect(), B = o.closest("header").getBoundingClientRect();
    t.style.setProperty("--workbench-navigation-top", `${B.bottom + 4}px`), t.style.setProperty("--workbench-navigation-left", `${M.left}px`);
    let j = M.width >= 1180;
    if (j !== s) {
      let E = t.contains(document.activeElement) || u && document.activeElement === document.body;
      s = j, E || a || i ? b(E) : C();
    }
  }, L = new ResizeObserver(I);
  L.observe(e), I(), f(document, "scroll", I, { capture: true }), f(o, "click", () => {
    I(), s ? _(!r) : i ? b(true) : (i = true, C());
  }), f(o, "pointermove", (M) => {
    I(), M.pointerType !== "touch" && !y() && !l && (a = true, C());
  }), f(o, "pointerenter", h), f(t, "pointerenter", h), f(o, "focus", () => {
    h(), I(), c ? c = false : y() || (a = true, C());
  });
  let w = (M) => {
    l = false;
    let B = t.contains(document.activeElement) || document.activeElement === o && o.matches(":focus-visible");
    !i && a && !g(M.relatedTarget) && !B && (h(), m = setTimeout(() => {
      a = false, C();
    }, 200));
  };
  return f(o, "pointerleave", w), f(t, "pointerleave", w), f(t, "focusin", () => {
    h(), u = true;
  }), f(document, "focusin", (M) => {
    g(M.target) || b();
  }), f(document, "pointerdown", (M) => {
    g(M.target) || b(t.contains(document.activeElement));
  }), f(document, "keydown", (M) => {
    M.key === "Escape" && !M.defaultPrevented && !y() && (a || i) && (M.preventDefault(), M.stopPropagation(), b(g(document.activeElement)));
  }), f(o, "keydown", (M) => {
    (a || i) && (M.key === "ArrowDown" || M.key === "Tab" && !M.shiftKey) && (M.preventDefault(), t.querySelector("nav button")?.focus());
  }), f(t.querySelector("[data-navigation-close]"), "click", () => b(true)), x && f(x, "click", () => _(true)), { dismiss: b, refresh: C, dispose() {
    h(), d.abort(), L.disconnect(), t.hidden = true, o.hidden = false, x && (x.hidden = true), delete e.dataset.navigationExpanded, o.setAttribute("aria-expanded", "false");
  } };
}
function dU({ key: e, restore: t, changed: o, storage: r = sessionStorage }) {
  let n = r.getItem(e), s = n ? JSON.parse(n) : { entries: [], index: -1 }, a = false, i = () => {
    r.setItem(e, JSON.stringify(s)), o?.(!a && s.index > 0, !a && s.index < s.entries.length - 1);
  }, l = async (c) => {
    let u = s.index + c;
    if (a || u < 0 || u >= s.entries.length) return;
    let m = s.index;
    a = true, s.index = u, i();
    try {
      await t(structuredClone(s.entries[u]));
    } catch (h) {
      throw s.index = m, i(), h;
    } finally {
      a = false, i();
    }
  };
  return { current: () => structuredClone(s.entries[s.index]), isRestoring: () => a, record(c) {
    a || JSON.stringify(s.entries[s.index]) === JSON.stringify(c) || (s.entries = [...s.entries.slice(0, s.index + 1), structuredClone(c)].slice(-80), s.index = s.entries.length - 1, i());
  }, back: () => l(-1), forward: () => l(1), refresh: i, reset(c) {
    s = c === void 0 ? { entries: [], index: -1 } : { entries: [structuredClone(c)], index: 0 }, i();
  } };
}
var re = T(S(), 1);
var G = re.default.createElement;
var Xp = /* @__PURE__ */ new WeakMap();
var Yp = /* @__PURE__ */ new WeakMap();
function $2({ element: e }) {
  let t = (0, re.useRef)(null);
  return (0, re.useLayoutEffect)(() => (t.current.append(e), () => e.remove()), [e]), G("span", { ref: t, className: "ct-dom-content" });
}
function Vn(e, t, o = "div") {
  let r = document.createElement(o);
  r.className = "ct-view-mount";
  let n = t, s = Ii(r, e, n), a = (i) => {
    n = { ...n, ...i }, s.update(n);
  };
  return { element: r, update: a, render: a, dispose: () => s.dispose() };
}
function Jp({ label: e, description: t, symbol: o = "code", detail: r, emphasis: n = "secondary", variant: s, dataset: a, onclick: i, ...l }) {
  let c = Object.fromEntries(Object.entries(a ?? {}).map(([u, m]) => [`data-${u.replace(/[A-Z]/g, (h) => `-${h.toLowerCase()}`)}`, m]));
  return G(zp, { ...l, ...c, "data-kit-node": "ActionCard", className: ["task", l.className].filter(Boolean).join(" "), title: e, description: r ? G(re.default.Fragment, null, t, G($2, { element: r })) : t, icon: G(Po, { name: o }), onClick: i ?? l.onClick, variant: s === "suggestion" ? s : n === "primary" ? "primary" : "secondary" });
}
function hU(e) {
  let t = Vn(Jp, e, "span");
  return Xp.set(t.element, t), t.element;
}
function xU(e, t) {
  let o = Xp.get(e);
  if (!o) throw new Error("This action card has not been mounted by canvas-toolkit.");
  o.update(t);
}
function vU(e) {
  return Vn(Po, { name: e }, "span").element;
}
function gU(e, t) {
  return On(e), Ii(e, $p, t);
}
function q2({ node: e, onAction: t }) {
  let o = (r) => {
    let n = G(se, { disabled: r.disabled && !r.focusableWhenDisabled, "aria-disabled": r.disabled && r.focusableWhenDisabled ? true : void 0, "aria-busy": r.pending || void 0, "data-metric-id": r.metricId, icon: r.pending ? G(Ti, { "aria-hidden": true }) : void 0, onClick: () => {
      r.disabled || t?.({ type: "action", action: r.action });
    } }, r.label);
    return G(re.default.Fragment, { key: r.action }, r.tooltip ? G(Zp, { content: r.tooltip }, n) : n);
  };
  return G(yi, { intent: e.intent ?? "info", title: e.title, actions: e.actions?.map(o) }, e.text ? G("p", null, e.text) : null, e.feedback ? G("div", { className: "ct-view-feedback", role: "status", "aria-atomic": true, "data-feedback-intent": e.feedback.intent }, e.feedback.title ? G("p", null, e.feedback.title) : null, e.feedback.text ? G("p", null, e.feedback.text) : null) : null, e.status ? G("p", { role: "status" }, e.status) : null);
}
function Qp({ node: e, onAction: t }) {
  if (e.type === "MessageBar") return G(q2, { node: e, onAction: t });
  if (e.type === "Spinner") return e.paused ? G("span", { className: "ct-spinner", role: "status" }, G(Po, { name: "clock", size: 16 }), e.label) : G(Ti, { label: e.label });
  if (e.type === "ProgressBar") {
    if (e.value !== void 0 && (!Number.isFinite(e.value) || e.value < 0 || e.value > 100)) throw new RangeError("Progress must be between 0 and 100.");
    return G(Gp, { label: e.label, value: e.value, max: 100 });
  }
  if (e.type === "Celebration") return G("span", { className: "ct-completion", role: "status", "aria-live": "polite", "aria-label": e.announcement }, G(Po, { name: "success", size: 32 }));
  if (e.type === "Text") return G("span", null, e.text);
  if (e.type === "Stack") return G("div", { className: "ct-stack" }, e.children.map((o, r) => G(Qp, { key: r, node: o, onAction: t })));
  if (e.type === "Button") return G(se, { disabled: e.disabled, onClick: () => t?.({ type: "action", action: e.action }) }, e.label);
  if (e.type === "ActionCard") {
    let { type: o, action: r, itemId: n, icon: s, ...a } = e;
    return G(Jp, { ...a, symbol: s, onclick: () => t?.({ type: "action", action: r, ...n ? { id: n } : {} }) });
  }
  throw new RangeError(`Unsupported canvas view node: ${e.type}`);
}
function Y2({ body: e, onAction: t }) {
  return G(re.default.Fragment, null, e.map((o, r) => G(Qp, { key: `${o.type}:${r}`, node: o, onAction: t })));
}
function CU(e, t, o) {
  let r = Yp.get(e);
  if (r && !r.mount.disposed) return r.mount.update({ body: t.body, onAction: o }), r.handle;
  On(e);
  let n = Ii(e, Y2, { body: t.body, onAction: o }), s = { render: (a) => n.update({ body: a.body }), dispose: () => n.dispose() };
  return Yp.set(e, { mount: n, handle: s }), s;
}
function X2({ ids: e, labels: t, placeholder: o, list: r, required: n = false, readOnly: s = false, disabled: a = false, browseDisabled: i = false, primaryDisabled: l = false, editDisabled: c = false, hint: u = "", error: m = "", errorSlot: h = false, onInput: d, onPaste: f, onBrowse: g, onPrimary: y, onEdit: x }) {
  let v = (0, re.useRef)(false), C = e.hint ?? `${e.input}-hint`, b = e.error ?? `${e.input}-error`;
  return G("div", { className: "ct-folder-field", "data-kit-node": "FolderField" }, G($o, { label: { children: t.folder, htmlFor: e.input }, required: n }, e.edit ? G(se, { id: e.edit, appearance: "subtle", hidden: !s, disabled: a || c, "aria-controls": e.input, "aria-expanded": !s, onClick: x }, t.edit) : null, G("div", { className: "ct-folder-controls" }, G(ko, { id: e.input, placeholder: o, list: r, required: n, readOnly: s, disabled: a, onInput: d, onPaste: f, "aria-invalid": m ? true : void 0, "aria-describedby": [u && C, m && b].filter(Boolean).join(" ") || void 0, onFocus: (_) => {
    _.target.select(), v.current = true;
  }, onPointerUp: (_) => {
    v.current && (_.preventDefault(), _.target.select(), v.current = false);
  }, onBlur: () => {
    v.current = false;
  } }), G(ac, { hidden: s && !e.primary }, G(se, { id: e.browse, hidden: s, disabled: a || i, "aria-controls": e.browser, onClick: g }, t.browse), e.primary ? G(se, { id: e.primary, appearance: "primary", disabled: a || l, onClick: y }, t.primary) : null))), G("p", { id: C, className: "ct-muted", hidden: !u }, u), G(h ? "div" : "p", { id: b, role: h ? void 0 : "alert", "aria-atomic": true, hidden: !m }, h ? void 0 : m));
}
function TU(e) {
  let t = Vn(X2, e);
  return { ...t, focus: () => t.element.querySelector("input").focus() };
}
function J2({ group: e, menuRevision: t }) {
  let [o, r] = (0, re.useState)(false);
  return (0, re.useEffect)(() => {
    r(false);
  }, [t]), G(Bn, { open: o, onOpenChange: (n, s) => r(s.open), label: e.label, button: { id: e.id, title: e.title, appearance: "subtle" }, popover: { id: `${e.id}-menu` }, menu: { "aria-label": e.label } }, e.actions.map((n) => G(sc, { key: n.id, id: n.id, disabled: n.disabled, onClick: n.onClick }, G("span", null, n.label, n.description ? G("span", { className: "ct-palette-description" }, n.description) : null))));
}
function Q2({ ids: e, labels: t, docsHref: o, languages: r, locale: n, onLocaleChange: s, onFeedback: a, version: i, actions: l = [], actionGroups: c = [], menuRevision: u }) {
  let m = (0, re.useRef)(false), h = (0, re.useRef)(true), [d, f] = (0, re.useState)(false), [g, y] = (0, re.useState)(false), [x, v] = (0, re.useState)("");
  (0, re.useEffect)(() => (h.current = true, () => {
    h.current = false;
  }), []), (0, re.useEffect)(() => {
    f(false);
  }, [u]);
  let C = async (b) => {
    if (!m.current) {
      m.current = true, y(true), v("");
      try {
        await s(b), h.current && f(false);
      } catch (_) {
        h.current && v(_ instanceof Error ? _.message : String(_));
      } finally {
        m.current = false, h.current && y(false);
      }
    }
  };
  return G(Wp, { "aria-label": t.footer, version: i ? `v${i}` : void 0, links: G(re.default.Fragment, null, G(se, { id: e.feedback, appearance: "subtle", onClick: a }, t.feedback), G("a", { href: o, target: "_blank", rel: "noopener noreferrer" }, t.docs)), language: G(Bn, { open: d, onOpenChange: (b, _) => {
    m.current || f(_.open);
  }, label: t.translate, button: { id: e.localeTrigger ?? (e.locale ? `${e.locale}-trigger` : void 0), "data-metric-id": e.locale, appearance: "subtle" }, menu: { id: e.locale, "aria-label": t.languages, "aria-busy": g } }, G(Up, null, t.languages), r.map((b) => G(sc, { key: b.code, lang: b.code, "data-locale": b.code, disabled: g, persistOnClick: true, "aria-current": n === b.code ? "true" : void 0, icon: n === b.code ? G(Po, { name: "success", size: 16 }) : void 0, onClick: () => {
    C(b.code);
  } }, b.name)), x ? G(yi, { intent: "error" }, x) : null) }, l.map((b) => G(se, { key: b.id, id: b.id, disabled: b.disabled, appearance: "subtle", title: b.title, onClick: b.onClick }, b.label)), c.map((b) => G(J2, { key: b.id, group: b, menuRevision: u })));
}
function yU(e) {
  let t = Vn(Q2, e);
  t.element.className = "canvas-footer-host workbench-footer";
  let o = 0;
  return { ...t, setLocale: (r) => t.update({ locale: r }), setVersion: (r) => t.update({ version: r }), dismissMenus: () => t.update({ menuRevision: ++o }) };
}
function eb({ receipt: e = 0, title: t, detail: o, dismissLabel: r, source: n }) {
  let [s, a] = (0, re.useState)(0), [i, l] = (0, re.useState)(false), [c, u] = (0, re.useState)(false), [m, h] = (0, re.useState)("bottom"), d = (0, re.useRef)(null), f = (0, re.useRef)(null), g = e > s, y = () => {
    let x = d.current?.contains(document.activeElement);
    a(e), x && (f.current?.isConnected ? f.current : n?.())?.focus();
  };
  return (0, re.useLayoutEffect)(() => {
    if (!g) return;
    let x = () => {
      let C = n?.(), b = d.current;
      if (!C?.isConnected || !b) {
        h("bottom");
        return;
      }
      let _ = b.dataset.placement;
      b.dataset.placement = "bottom";
      let I = b.getBoundingClientRect(), L = C.getBoundingClientRect();
      b.dataset.placement = _, h(I.left < L.right && I.right > L.left && I.top < L.bottom && I.bottom > L.top ? "top" : "bottom");
    };
    x();
    let v = new ResizeObserver(x);
    return v.observe(d.current), v.observe(document.body), globalThis.addEventListener("resize", x), document.addEventListener("scroll", x, true), () => {
      v.disconnect(), globalThis.removeEventListener("resize", x), document.removeEventListener("scroll", x, true);
    };
  }, [g, n]), (0, re.useEffect)(() => {
    if (g || (l(false), u(false), f.current = null), !g || i || c) return;
    let x = setTimeout(() => a(e), 8e3);
    return () => clearTimeout(x);
  }, [e, g, i, c]), (0, re.useEffect)(() => {
    if (!g) return;
    let x = (v) => {
      v.key === "Escape" && !v.defaultPrevented && (v.preventDefault(), y());
    };
    return document.addEventListener("keydown", x), () => document.removeEventListener("keydown", x);
  }), G("div", { ref: d, className: "ct-toast", hidden: !g, "data-placement": m, onMouseEnter: () => l(true), onMouseLeave: () => l(false), onFocus: (x) => {
    x.currentTarget.contains(x.relatedTarget) || (f.current = x.relatedTarget), u(true);
  }, onBlur: (x) => {
    x.currentTarget.contains(x.relatedTarget) || u(false);
  } }, g ? G(yi, { key: e, title: t, "data-canvas-host-toast": "", "aria-live": "polite", "aria-atomic": true, actions: G(se, { appearance: "subtle", "aria-label": r, onClick: y }, "\xD7") }, o ? G("p", null, o) : null) : null);
}
function SU() {
  let e = Vn(eb, { receipt: 0 }), t = 0;
  return document.body.append(e.element), { update: e.update, show: (o) => e.update({ ...o, receipt: ++t }), clear: () => e.update({ receipt: 0 }), dispose: () => {
    e.dispose(), e.element.remove();
  } };
}
var Hn = T(S(), 1);
var export_Fragment = Hn.Fragment;
var export_createElement = Hn.createElement;
var export_useEffect = Hn.useEffect;
var export_useRef = Hn.useRef;
var export_useState = Hn.useState;
export {
  zp as ActionCard,
  ac as ActionGroup,
  Z2 as ActionToolbar,
  lZ as Badge,
  zZ as Blankslate,
  se as Button,
  Wp as CanvasFooter,
  ZZ as CanvasHeader,
  Hp as CanvasProvider,
  UZ as CanvasShell,
  sZ as Checkbox,
  DZ as CheckboxGroup,
  j2 as ChoiceGroup,
  W2 as CodeBlock,
  VZ as CommandPalette,
  cZ as Counter,
  WZ as DetailPanel,
  BZ as Dialog,
  RZ as DialogActions,
  IZ as DialogBody,
  MZ as DialogContent,
  jp as DialogSurface,
  Kp as DialogTitle,
  SZ as DialogTrigger,
  K2 as Disclosure,
  $2 as DomContent,
  dZ as FilterPill,
  KZ as FilterToolbar,
  $o as FormField,
  export_Fragment as Fragment,
  eb as HostMessageToast,
  eU as InlineEditor,
  EZ as InputWithAction,
  XZ as KeyValueList,
  $Z as ListDetail,
  Bn as MenuButton,
  xZ as MenuDivider,
  vZ as MenuGroup,
  Up as MenuGroupHeader,
  sc as MenuItem,
  yi as MessageBar,
  JZ as MetadataList,
  GZ as NavigationControls,
  bZ as Option,
  YZ as OutputPanel,
  pZ as Popover,
  yZ as PopoverSurface,
  TZ as PopoverTrigger,
  jZ as ProductNavigation,
  Gp as ProgressBar,
  $p as PromptComposer,
  hZ as Radio,
  NZ as RadioGroup,
  z2 as ResizeHandle,
  HZ as SectionHeader,
  iZ as Select,
  OZ as SelectPanel,
  mZ as Skeleton,
  fZ as SkeletonItem,
  Ti as Spinner,
  LZ as SplitButton,
  qZ as SplitPane,
  aZ as Switch,
  Po as SymbolIcon,
  QZ as Table,
  kZ as TableBody,
  wZ as TableCell,
  _Z as TableHeader,
  PZ as TableHeaderCell,
  AZ as TableRow,
  FZ as Tabs,
  uZ as Tag,
  ko as TextInput,
  G2 as Textarea,
  U2 as ToolbarButton,
  CZ as ToolbarDivider,
  gZ as ToolbarToggleButton,
  Zp as Tooltip,
  hU as actionCard,
  yU as appFooter,
  iU as bindActionGroup,
  lU as bindDetailPanel,
  cU as bindInlineEditor,
  uU as bindProductNavigation,
  aU as bindPromptComposer,
  export_createElement as createElement,
  dU as createNavigation,
  On as dispose,
  TU as folderField,
  SU as hostMessageToast,
  vU as icon,
  Ii as mountCanvasComponent,
  gU as promptComposer,
  CU as renderView,
  nU as replaceChildren,
  xU as updateActionCard,
  export_useEffect as useEffect,
  export_useRef as useRef,
  export_useState as useState
};
