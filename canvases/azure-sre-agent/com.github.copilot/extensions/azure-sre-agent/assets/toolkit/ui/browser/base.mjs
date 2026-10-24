// packages/canvas-toolkit/src/ui/browser/base.mjs
import { a as Xi, b as Tt, d as E, e as M, f as Ko, g as qP } from "./react-runtime.mjs";
var gh = Xi((Gc) => {
  "use strict";
  var tT = Symbol.for("react.transitional.element"), oT = Symbol.for("react.fragment");
  function mh(e4, t, o) {
    var n = null;
    if (o !== void 0 && (n = "" + o), t.key !== void 0 && (n = "" + t.key), "key" in t) {
      o = {};
      for (var r in t) r !== "key" && (o[r] = t[r]);
    } else o = t;
    return t = o.ref, { $$typeof: tT, type: e4, key: n, ref: t !== void 0 ? t : null, props: o };
  }
  Gc.Fragment = oT;
  Gc.jsx = mh;
  Gc.jsxs = mh;
});
var Ie = Xi((H0, hh) => {
  "use strict";
  hh.exports = gh();
});
var Tx = Xi((Px) => {
  "use strict";
  var ms = M();
  function DO(e4, t) {
    return e4 === t && (e4 !== 0 || 1 / e4 === 1 / t) || e4 !== e4 && t !== t;
  }
  var AO = typeof Object.is == "function" ? Object.is : DO, kO = ms.useState, FO = ms.useEffect, VO = ms.useLayoutEffect, LO = ms.useDebugValue;
  function _O(e4, t) {
    var o = t(), n = kO({ inst: { value: o, getSnapshot: t } }), r = n[0].inst, i = n[1];
    return VO(function() {
      r.value = o, r.getSnapshot = t, kd(r) && i({ inst: r });
    }, [e4, o, t]), FO(function() {
      return kd(r) && i({ inst: r }), e4(function() {
        kd(r) && i({ inst: r });
      });
    }, [e4]), LO(o), o;
  }
  function kd(e4) {
    var t = e4.getSnapshot;
    e4 = e4.value;
    try {
      var o = t();
      return !AO(e4, o);
    } catch {
      return true;
    }
  }
  function BO(e4, t) {
    return t();
  }
  var HO = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? BO : _O;
  Px.useSyncExternalStore = ms.useSyncExternalStore !== void 0 ? ms.useSyncExternalStore : HO;
});
var Oa = Xi((UV, wx) => {
  "use strict";
  wx.exports = Tx();
});
var Mx = Xi((Ox) => {
  "use strict";
  var Dl = M(), UO = Oa();
  function jO(e4, t) {
    return e4 === t && (e4 !== 0 || 1 / e4 === 1 / t) || e4 !== e4 && t !== t;
  }
  var GO = typeof Object.is == "function" ? Object.is : jO, WO = UO.useSyncExternalStore, $O = Dl.useRef, zO = Dl.useEffect, KO = Dl.useMemo, YO = Dl.useDebugValue;
  Ox.useSyncExternalStoreWithSelector = function(e4, t, o, n, r) {
    var i = $O(null);
    if (i.current === null) {
      var s = { hasValue: false, value: null };
      i.current = s;
    } else s = i.current;
    i = KO(function() {
      function l(m) {
        if (!c) {
          if (c = true, u = m, m = n(m), r !== void 0 && s.hasValue) {
            var d = s.value;
            if (r(d, m)) return f = d;
          }
          return f = m;
        }
        if (d = f, GO(u, m)) return d;
        var h = n(m);
        return r !== void 0 && r(d, h) ? (u = m, d) : (u = m, f = h);
      }
      var c = false, u, f, p = o === void 0 ? null : o;
      return [function() {
        return l(t());
      }, p === null ? void 0 : function() {
        return l(p());
      }];
    }, [t, o, n, r]);
    var a = WO(e4, i[0], i[1]);
    return zO(function() {
      s.hasValue = true, s.value = a;
    }, [a]), YO(a), a;
  };
});
var Dx = Xi((GV, Nx) => {
  "use strict";
  Nx.exports = Mx();
});
var Bg = E(M(), 1);
var EP = E(qP(), 1);
var Hg = E(Ko(), 1);
var Xe = E(M(), 1);
var st = E(M(), 1);
var br = {};
Tt(br, { Header: () => zh, Item: () => Wh, Panel: () => rb, Root: () => Nh, Trigger: () => Jh });
var gr = E(M(), 1);
var si = E(M(), 1);
function yt({ controlled: e4, default: t, name: o, state: n = "value" }) {
  let { current: r } = si.useRef(e4 !== void 0), [i, s] = si.useState(t), a = r && e4 !== void 0 ? e4 : i, l = si.useCallback((c) => {
    r || s(c);
  }, []);
  return [a, l];
}
var XP = E(M(), 1);
var ia = { ...XP };
var fh = E(M(), 1);
var uh = {};
function qe(e4, t) {
  let o = fh.useRef(uh);
  return o.current === uh && (o.current = e4(t)), o;
}
var Op = ia.useInsertionEffect;
var ZP = Op && Op !== ia.useLayoutEffect ? Op : (e4) => e4();
function G(e4) {
  let t = qe(JP).current;
  return t.next = e4, ZP(t.effect), t.trampoline;
}
function JP() {
  let e4 = { next: void 0, callback: QP, trampoline: (...t) => e4.callback?.(...t), effect: () => {
    e4.callback = e4.next;
  } };
  return e4;
}
function QP() {
}
function Oe() {
}
var It = Object.freeze([]);
var Me = Object.freeze({});
var zn = E(M(), 1);
var ph = E(M(), 1);
var eT = () => {
};
var W = typeof document < "u" ? ph.useLayoutEffect : eT;
var jc = E(M(), 1);
var Mp = jc.createContext({ register: () => {
}, unregister: () => {
}, subscribeMapChange: () => () => {
}, nextIndexRef: { current: 0 } });
function dh() {
  return jc.useContext(Mp);
}
var bh = E(Ie(), 1);
function Do(e4) {
  let { children: t, elementsRef: o, labelsRef: n, onMapChange: r } = e4, i = G(r), [, s] = zn.useState(false), a = qe(rT).current, l = qe(nT).current, c = zn.useRef(0), u = zn.useRef(true), f = zn.useRef(null), p = zn.useRef(null), m = G(() => {
    u.current || (u.current = true, s((R) => !R));
  }), d = G((R, I) => {
    l.set(R, I), m();
  }), h = G((R) => {
    l.delete(R), m();
  }), C = G((R) => {
    let I = /* @__PURE__ */ new Map();
    return o.current.length = 0, n && (n.current.length = 0), R.forEach((S) => {
      I.set(S.element, { ...S.registration.metadata ?? {}, index: S.index }), o.current[S.index] = S.element, n && (n.current[S.index] = S.registration.label !== void 0 ? S.registration.label : S.registration.textRef?.current?.textContent ?? S.element.textContent);
    }), c.current = o.current.length, I;
  });
  function g(R) {
    if (p.current?.disconnect(), p.current = null, typeof MutationObserver != "function" || R.length < 2) return;
    let I = new MutationObserver((v) => {
      if (!aT(v)) return;
      let T = null;
      for (let w of R) if (w.isConnected) {
        if (T && xh(T, w) > 0) {
          I.disconnect(), m();
          return;
        }
        T = w;
      }
    });
    p.current = I;
    let S = /* @__PURE__ */ new Set();
    for (let v = 1; v < R.length; v += 1) {
      let T = sT(R[v - 1], R[v]);
      T && S.add(T);
    }
    S.forEach((v) => I.observe(v, { childList: true }));
  }
  let x = G(() => {
    let [R, I] = iT(l), S = C(R), v = f.current, T = !v || v.length !== R.length || R.some((w, P) => {
      let O = v[P];
      return w.index !== O.index || w.element !== O.element || w.registration.index !== O.registration.index || w.registration.metadata !== O.registration.metadata;
    });
    g(I), f.current = R, u.current = false, T && (a.forEach((w) => w(S)), i(S));
  });
  W(() => (!u.current && f.current && C(f.current), () => {
    o.current = [], n && (n.current = []);
  }), [o, n, C]), W(() => {
    u.current && x();
  }), W(() => () => {
    p.current?.disconnect(), u.current = true;
  }, []);
  let b = G((R) => (a.add(R), () => {
    a.delete(R);
  })), y = zn.useMemo(() => ({ register: d, unregister: h, subscribeMapChange: b, nextIndexRef: c }), [d, h, b, c]);
  return (0, bh.jsx)(Mp.Provider, { value: y, children: t });
}
function nT() {
  return /* @__PURE__ */ new Map();
}
function rT() {
  return /* @__PURE__ */ new Set();
}
function iT(e4) {
  let t = /* @__PURE__ */ new Set(), o = [], n = [];
  e4.forEach((i, s) => {
    if (!s.isConnected) return;
    let a = i.index, l = { index: a ?? -1, element: s, registration: i };
    a === null ? n.push(l) : a >= 0 && (t.add(a), o.push(l));
  });
  let r = 0;
  return n.sort((i, s) => xh(i.element, s.element)), n.forEach((i) => {
    for (; t.has(r); ) r += 1;
    i.index = r, o.push(i), r += 1;
  }), t.size > 0 && o.sort((i, s) => i.index - s.index), [o, n.map((i) => i.element)];
}
function sT(e4, t) {
  let o = e4.parentElement;
  for (; o && !o.contains(t); ) o = o.parentElement;
  return o;
}
function aT(e4) {
  for (let t of e4) for (let o = 0; o < t.removedNodes.length; o += 1) if (t.removedNodes[o].isConnected) return true;
  return false;
}
function xh(e4, t) {
  return e4.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function cT(e4, t) {
  return function(n, ...r) {
    let i = new URL(e4);
    return i.searchParams.set("code", n.toString()), r.forEach((s) => i.searchParams.append("args[]", s)), `${t} error #${n}; visit ${i} for the full message.`;
  };
}
var lT = cT("https://base-ui.com/production-error", "Base UI");
var Re = lT;
var Wc = E(M(), 1);
var Np = Wc.createContext(void 0);
function $c() {
  let e4 = Wc.useContext(Np);
  if (e4 === void 0) throw new Error(Re(10));
  return e4;
}
var mr = E(M(), 1);
function ht(e4, t, o, n) {
  let r = qe(Ch).current;
  return uT(r, e4, t, o, n) && yh(r, [e4, t, o, n]), r.callback;
}
function Rh(e4) {
  let t = qe(Ch).current;
  return fT(t, e4) && yh(t, e4), t.callback;
}
function Ch() {
  return { callback: null, cleanup: null, refs: [] };
}
function uT(e4, t, o, n, r) {
  return e4.refs[0] !== t || e4.refs[1] !== o || e4.refs[2] !== n || e4.refs[3] !== r;
}
function fT(e4, t) {
  return e4.refs.length !== t.length || e4.refs.some((o, n) => o !== t[n]);
}
function yh(e4, t) {
  if (e4.refs = t, t.every((o) => o == null)) {
    e4.callback = null;
    return;
  }
  e4.callback = (o) => {
    if (e4.cleanup && (e4.cleanup(), e4.cleanup = null), o != null) {
      let n = Array(t.length).fill(null);
      for (let r = 0; r < t.length; r += 1) {
        let i = t[r];
        if (i != null) switch (typeof i) {
          case "function": {
            let s = i(o);
            typeof s == "function" && (n[r] = s);
            break;
          }
          case "object": {
            i.current = o;
            break;
          }
          default:
        }
      }
      e4.cleanup = () => {
        for (let r = 0; r < t.length; r += 1) {
          let i = t[r];
          if (i != null) switch (typeof i) {
            case "function": {
              let s = n[r];
              typeof s == "function" ? s() : i(null);
              break;
            }
            case "object": {
              i.current = null;
              break;
            }
            default:
          }
        }
      };
    }
  };
}
var Eh = E(M(), 1);
var vh = E(M(), 1);
var pT = parseInt(vh.version, 10);
function Zi(e4) {
  return pT >= e4;
}
function Dp(e4) {
  if (!Eh.isValidElement(e4)) return null;
  let t = e4, o = t.props;
  return (Zi(19) ? o?.ref : t.ref) ?? null;
}
function sa(e4, t) {
  if (e4 && !t) return e4;
  if (!e4 && t) return t;
  if (e4 || t) return { ...e4, ...t };
}
function Ih(e4, t) {
  let o = {};
  for (let n in e4) {
    let r = e4[n];
    if (t?.hasOwnProperty(n)) {
      let i = t[n](r);
      i != null && Object.assign(o, i);
      continue;
    }
    r === true ? o[`data-${n.toLowerCase()}`] = "" : r && (o[`data-${n.toLowerCase()}`] = r.toString());
  }
  return o;
}
function Sh(e4, t) {
  return typeof e4 == "function" ? e4(t) : e4;
}
function zc(e4, t) {
  return typeof e4 == "function" ? e4(t) : e4;
}
var Ap = {};
function Rt(e4, t, o, n, r) {
  if (!o && !n && !r && !e4) return Kc(t);
  let i = Kc(e4);
  return t && (i = aa(i, t)), o && (i = aa(i, o)), n && (i = aa(i, n)), r && (i = aa(i, r)), i;
}
function Ph(e4) {
  if (e4.length === 0) return Ap;
  if (e4.length === 1) return Kc(e4[0]);
  let t = Kc(e4[0]);
  for (let o = 1; o < e4.length; o += 1) t = aa(t, e4[o]);
  return t;
}
function Kc(e4) {
  return kp(e4) ? { ...wh(e4, Ap) } : dT(e4);
}
function aa(e4, t) {
  return kp(t) ? wh(t, e4) : mT(e4, t);
}
function dT(e4) {
  let t = { ...e4 };
  for (let o in t) {
    let n = t[o];
    Th(o, n) && (t[o] = Oh(n));
  }
  return t;
}
function mT(e4, t) {
  if (!t) return e4;
  for (let o in t) {
    let n = t[o];
    switch (o) {
      case "style": {
        e4[o] = sa(e4.style, n);
        break;
      }
      case "className": {
        e4[o] = Fp(e4.className, n);
        break;
      }
      default:
        Th(o, n) ? e4[o] = gT(e4[o], n) : e4[o] = n;
    }
  }
  return e4;
}
function Th(e4, t) {
  let o = e4.charCodeAt(0), n = e4.charCodeAt(1), r = e4.charCodeAt(2);
  return o === 111 && n === 110 && r >= 65 && r <= 90 && (typeof t == "function" || typeof t > "u");
}
function kp(e4) {
  return typeof e4 == "function";
}
function wh(e4, t) {
  return kp(e4) ? e4(t) : e4 ?? Ap;
}
function gT(e4, t) {
  return t ? e4 ? (...o) => {
    let n = o[0];
    if (Mh(n)) {
      let i = n;
      ca(i);
      let s = t(...o);
      return i.baseUIHandlerPrevented || e4?.(...o), s;
    }
    let r = t(...o);
    return e4?.(...o), r;
  } : Oh(t) : e4;
}
function Oh(e4) {
  return e4 && ((...t) => {
    let o = t[0];
    return Mh(o) && ca(o), e4(...t);
  });
}
function ca(e4) {
  return e4.preventBaseUIHandler = () => {
    e4.baseUIHandlerPrevented = true;
  }, e4;
}
function Fp(e4, t) {
  return t ? e4 ? t + " " + e4 : t : e4;
}
function Mh(e4) {
  return e4 != null && typeof e4 == "object" && "nativeEvent" in e4;
}
var Vp = E(M(), 1);
function U(e4, t, o = {}) {
  let n = t.render;
  o.enabled !== false && (n = RT(n));
  let r = hT(t, o, n);
  if (o.enabled === false) return null;
  let i = o.state ?? Me;
  return CT(e4, n, r, i);
}
function hT(e4, t, o) {
  let { className: n, style: r } = e4, { state: i = Me, ref: s, props: a, stateAttributesMapping: l, enabled: c = true } = t, u = c ? Sh(n, i) : void 0, f = c ? zc(r, i) : void 0, p = c ? Ih(i, l) : Me, m = c && a ? bT(a) : void 0, d = c ? sa(p, m) ?? {} : Me;
  return typeof document < "u" && (c ? Array.isArray(s) ? d.ref = Rh([d.ref, Dp(o), ...s]) : d.ref = ht(d.ref, Dp(o), s) : ht(null, null)), c ? (u !== void 0 && (d.className = Fp(d.className, u)), f !== void 0 && (d.style = sa(d.style, f)), d) : Me;
}
function bT(e4) {
  return Array.isArray(e4) ? Ph(e4) : Rt(void 0, e4);
}
var xT = Symbol.for("react.lazy");
function RT(e4) {
  if (e4?.$$typeof !== xT) return e4;
  let t = mr.Children.toArray(e4)[0];
  return mr.isValidElement(t) ? t : e4;
}
function CT(e4, t, o, n) {
  if (t) {
    if (typeof t == "function") return t(o, n);
    let r = Rt(o, t.props);
    return r.ref = o.ref, mr.cloneElement(t, r);
  }
  if (e4 && typeof e4 == "string") return yT(e4, o);
  throw new Error(Re(8));
}
function yT(e4, t) {
  return e4 === "button" ? (0, Vp.createElement)("button", { type: "button", ...t, key: t.key }) : e4 === "img" ? (0, Vp.createElement)("img", { alt: "", ...t, key: t.key }) : mr.createElement(e4, t);
}
var Lp = E(Ie(), 1);
var vT = { value: () => null };
var Nh = gr.forwardRef(function(t, o) {
  let { render: n, className: r, disabled: i = false, hiddenUntilFound: s, keepMounted: a, loopFocus: l, onValueChange: c, multiple: u = false, orientation: f = "vertical", value: p, defaultValue: m, style: d, ...h } = t, C = m ?? It, g = gr.useRef([]), [x, b] = yt({ controlled: p, default: C, name: "Accordion", state: "value" }), y = G((v, T, w) => {
    if (u) if (T) {
      let P = x.slice();
      if (P.push(v), c?.(P, w), w.isCanceled) return;
      b(P);
    } else {
      let P = x.filter((O) => O !== v);
      if (c?.(P, w), w.isCanceled) return;
      b(P);
    }
    else {
      let P = x[0] === v ? [] : [v];
      if (c?.(P, w), w.isCanceled) return;
      b(P);
    }
  }), R = gr.useMemo(() => ({ value: x, disabled: i, orientation: f }), [x, i, f]), I = gr.useMemo(() => ({ disabled: i, handleValueChange: y, hiddenUntilFound: s ?? false, keepMounted: a ?? false, state: R, value: x }), [i, y, s, a, R, x]), S = U("div", t, { state: R, ref: o, props: h, stateAttributesMapping: vT });
  return (0, Lp.jsx)(Np.Provider, { value: I, children: (0, Lp.jsx)(Do, { elementsRef: g, children: S }) });
});
var Kn = E(M(), 1);
var Yc = E(M(), 1);
var Dh = 0;
function ET(e4, t = "mui") {
  let [o, n] = Yc.useState(e4), r = e4 || o;
  return Yc.useEffect(() => {
    o == null && (Dh += 1, n(`${t}-${Dh}`));
  }, [o, t]), r;
}
var Ah = ia.useId;
function Bo(e4, t) {
  if (Ah !== void 0) {
    let o = Ah();
    return e4 ?? (t ? `${t}-${o}` : o);
  }
  return ET(e4, t);
}
function Pe(e4) {
  return Bo(e4, "base-ui");
}
var Zc = E(M(), 1);
var H = {};
Tt(H, { cancelOpen: () => ZT, chipRemovePress: () => AT, clearPress: () => DT, closePress: () => MT, closeWatcher: () => WT, decrementPress: () => VT, disabled: () => QT, drag: () => YT, escapeKey: () => GT, focusOut: () => jT, imperativeAction: () => ow, incrementPress: () => FT, initial: () => tw, inputBlur: () => BT, inputChange: () => LT, inputClear: () => _T, inputPaste: () => HT, inputPress: () => UT, itemPress: () => OT, keyboard: () => zT, linkPress: () => NT, listNavigation: () => $T, missing: () => ew, none: () => IT, outsidePress: () => wT, pointer: () => KT, scrub: () => XT, siblingOpen: () => JT, swipe: () => nw, trackPress: () => kT, triggerFocus: () => TT, triggerHover: () => PT, triggerPress: () => ST, wheel: () => qT, windowResize: () => rw });
var IT = "none";
var ST = "trigger-press";
var PT = "trigger-hover";
var TT = "trigger-focus";
var wT = "outside-press";
var OT = "item-press";
var MT = "close-press";
var NT = "link-press";
var DT = "clear-press";
var AT = "chip-remove-press";
var kT = "track-press";
var FT = "increment-press";
var VT = "decrement-press";
var LT = "input-change";
var _T = "input-clear";
var BT = "input-blur";
var HT = "input-paste";
var UT = "input-press";
var jT = "focus-out";
var GT = "escape-key";
var WT = "close-watcher";
var $T = "list-navigation";
var zT = "keyboard";
var KT = "pointer";
var YT = "drag";
var qT = "wheel";
var XT = "scrub";
var ZT = "cancel-open";
var JT = "sibling-open";
var QT = "disabled";
var ew = "missing";
var tw = "initial";
var ow = "imperative-action";
var nw = "swipe";
var rw = "window-resize";
function Q(e4, t, o, n) {
  let r = false, i = false, s = n ?? Me;
  return { reason: e4, event: t ?? new Event("base-ui"), cancel() {
    r = true;
  }, allowPropagation() {
    i = true;
  }, get isCanceled() {
    return r;
  }, get isPropagationAllowed() {
    return i;
  }, trigger: o, ...s };
}
function Ji(e4, t, o) {
  let n = o ?? Me;
  return { reason: e4, event: t ?? new Event("base-ui"), ...n };
}
var Bp = E(M(), 1);
var kh = E(M(), 1);
function Qi(e4) {
  kh.useEffect(e4, It);
}
var qc = null;
var kD = globalThis.requestAnimationFrame;
var _p = class {
  callbacks = [];
  callbacksCount = 0;
  nextId = 1;
  startId = 1;
  isScheduled = false;
  tick = (t) => {
    this.isScheduled = false;
    let o = this.callbacks, n = this.callbacksCount;
    if (this.callbacks = [], this.callbacksCount = 0, this.startId = this.nextId, n > 0) for (let r = 0; r < o.length; r += 1) o[r]?.(t);
  };
  request(t) {
    let o = this.nextId;
    return this.nextId += 1, this.callbacks.push(t), this.callbacksCount += 1, (!this.isScheduled || false) && (requestAnimationFrame(this.tick), this.isScheduled = true), o;
  }
  cancel(t) {
    let o = t - this.startId;
    o < 0 || o >= this.callbacks.length || this.callbacks[o] !== null && (this.callbacks[o] = null, this.callbacksCount -= 1);
  }
};
var Xc = new _p();
var so = class e {
  static create() {
    return new e();
  }
  static request(t) {
    return Xc.request(t);
  }
  static cancel(t) {
    return Xc.cancel(t);
  }
  currentId = qc;
  request(t) {
    this.cancel(), this.currentId = Xc.request(() => {
      this.currentId = qc, t();
    });
  }
  cancel = () => {
    this.currentId !== qc && (Xc.cancel(this.currentId), this.currentId = qc);
  };
  disposeEffect = () => this.cancel;
};
function Io() {
  let e4 = qe(so.create).current;
  return Qi(e4.disposeEffect), e4;
}
function wt(e4, t = false, o = false, n = false) {
  let [r, i] = Bp.useState(e4 && t ? "idle" : void 0), [s, a] = Bp.useState(e4 && !n);
  return e4 && !s && (a(true), i("starting")), !e4 && s && r !== "ending" && !o && i("ending"), !e4 && !s && r === "ending" && i(void 0), W(() => {
    if (!e4 && s && r !== "ending" && o) {
      let l = so.request(() => {
        i("ending");
      });
      return () => {
        so.cancel(l);
      };
    }
  }, [e4, s, r, o]), W(() => {
    if (!e4 || t) return;
    let l = so.request(() => {
      i(void 0);
    });
    return () => {
      so.cancel(l);
    };
  }, [t, e4]), W(() => {
    if (!e4 || !t) return;
    e4 && s && r !== "idle" && i("starting");
    let l = so.request(() => {
      i("idle");
    });
    return () => {
      so.cancel(l);
    };
  }, [t, e4, s, r]), { mounted: s, setMounted: a, transitionStatus: r };
}
function Fh(e4) {
  let { open: t, defaultOpen: o = false, onOpenChange: n, disabled: r } = e4, [i, s] = yt({ controlled: t, default: o, name: "Collapsible", state: "open" }), { mounted: a, setMounted: l, transitionStatus: c } = wt(i, true, true), u = Pe(), [f, p] = Zc.useState(), m = f === null ? void 0 : f ?? u, d = G((h) => {
    let C = !i, g = Q(H.triggerPress, h.nativeEvent);
    n(C, g), !g.isCanceled && s(C);
  });
  return Zc.useMemo(() => ({ defaultPanelId: u, disabled: r, handleTrigger: d, mounted: a, open: i, panelId: m, setMounted: l, setOpen: s, setPanelIdState: p, transitionStatus: c }), [u, r, d, a, i, m, l, s, p, c]);
}
var Jc = E(M(), 1);
var Hp = Jc.createContext(void 0);
function Qc() {
  let e4 = Jc.useContext(Hp);
  if (e4 === void 0) throw new Error(Re(15));
  return e4;
}
var ai = E(M(), 1);
function kt(e4 = {}) {
  let { guess: t, label: o, metadata: n, textRef: r, index: i } = e4, { register: s, unregister: a, subscribeMapChange: l, nextIndexRef: c } = dh(), u = ai.useRef(-1), [f, p] = ai.useState(i == null && t ? () => {
    if (u.current === -1) {
      let C = c.current;
      c.current += 1, u.current = C;
    }
    return u.current;
  } : -1), m = i ?? f, d = ai.useRef(null), h = ai.useCallback((C) => {
    let g = d.current;
    g && a(g), d.current = C, C && s(C, { metadata: n ?? null, index: i ?? null, label: o, textRef: r });
  }, [i, s, a, n, o, r]);
  return W(() => {
    if (i == null) return l((C) => {
      let g = d.current ? C.get(d.current)?.index : null;
      g != null && p(g);
    });
  }, [i, l]), { ref: h, index: m };
}
var el = E(M(), 1);
var Up = el.createContext(void 0);
function es() {
  let e4 = el.useContext(Up);
  if (e4 === void 0) throw new Error(Re(9));
  return e4;
}
var Tn = {};
Tt(Tn, { endingStyle: () => la, startingStyle: () => ci });
var ci = "data-starting-style";
var la = "data-ending-style";
var iw = { [ci]: "" };
var sw = { [la]: "" };
var Ot = { transitionStatus(e4) {
  return e4 === "starting" ? iw : e4 === "ending" ? sw : null;
} };
var Vh = "data-open";
var Lh = "data-closed";
var _h = Tn.startingStyle;
var tA = Tn.endingStyle;
var Hh = "data-panel-open";
var cw = { [Vh]: "" };
var lw = { [Lh]: "" };
var Uh = { open(e4) {
  return e4 ? { [Hh]: "" } : null;
} };
var jh = { open(e4) {
  return e4 ? cw : lw;
} };
var Gh = "data-index";
var ts = { ...jh, index: (e4) => ({ [Gh]: String(e4) }), ...Ot, value: () => null };
var jp = E(Ie(), 1);
var Wh = Kn.forwardRef(function(t, o) {
  let { className: n, disabled: r = false, onOpenChange: i, render: s, value: a, style: l, ...c } = t, { ref: u, index: f } = kt(), p = ht(o, u), { disabled: m, handleValueChange: d, state: h, value: C } = $c(), g = Pe(), x = a ?? g, b = r || m, y = C.indexOf(x) !== -1, R = G((_, B) => {
    i?.(_, B), !B.isCanceled && d(x, _, B);
  }), I = Fh({ open: y, onOpenChange: R, disabled: b }), S = Kn.useMemo(() => ({ open: I.open, disabled: I.disabled, transitionStatus: I.transitionStatus }), [I.open, I.disabled, I.transitionStatus]), v = Kn.useMemo(() => ({ ...I, onOpenChange: R, state: S }), [I, S, R]), T = Kn.useMemo(() => ({ ...h, hidden: !y && !I.mounted, index: f, disabled: b, open: y }), [I.mounted, b, f, y, h]), w = Pe(), [P, O] = Kn.useState(), N = P === null ? void 0 : P ?? w, D = Kn.useMemo(() => ({ defaultTriggerId: w, open: y, state: T, setTriggerId: O, triggerId: N }), [w, y, T, O, N]), A = U("div", t, { state: T, ref: p, props: c, stateAttributesMapping: ts });
  return (0, jp.jsx)(Hp.Provider, { value: v, children: (0, jp.jsx)(Up.Provider, { value: D, children: A }) });
});
var $h = E(M(), 1);
var zh = $h.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, { state: a } = es();
  return U("h3", t, { state: a, ref: o, props: s, stateAttributesMapping: ts });
});
var Zh = E(M(), 1);
var os = E(M(), 1);
function tl() {
  return typeof window < "u";
}
function Ht(e4) {
  return ol(e4) ? (e4.nodeName || "").toLowerCase() : "#document";
}
function Be(e4) {
  var t;
  return (e4 == null || (t = e4.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function On(e4) {
  var t;
  return (t = (ol(e4) ? e4.ownerDocument : e4.document) || window.document) == null ? void 0 : t.documentElement;
}
function ol(e4) {
  return tl() ? e4 instanceof Node || e4 instanceof Be(e4).Node : false;
}
function De(e4) {
  return tl() ? e4 instanceof Element || e4 instanceof Be(e4).Element : false;
}
function Ve(e4) {
  return tl() ? e4 instanceof HTMLElement || e4 instanceof Be(e4).HTMLElement : false;
}
function wn(e4) {
  return !tl() || typeof ShadowRoot > "u" ? false : e4 instanceof ShadowRoot || e4 instanceof Be(e4).ShadowRoot;
}
function ui(e4) {
  let { overflow: t, overflowX: o, overflowY: n, display: r } = Ut(e4);
  return /auto|scroll|overlay|hidden|clip/.test(t + n + o) && r !== "inline" && r !== "contents";
}
function Kh(e4) {
  return /^(table|td|th)$/.test(Ht(e4));
}
function ua(e4) {
  try {
    if (e4.matches(":popover-open")) return true;
  } catch {
  }
  try {
    return e4.matches(":modal");
  } catch {
    return false;
  }
}
var fw = /transform|translate|scale|rotate|perspective|filter/;
var pw = /paint|layout|strict|content/;
var li = (e4) => !!e4 && e4 !== "none";
var Gp;
function nl(e4) {
  let t = De(e4) ? Ut(e4) : e4;
  return li(t.transform) || li(t.translate) || li(t.scale) || li(t.rotate) || li(t.perspective) || !rl() && (li(t.backdropFilter) || li(t.filter)) || fw.test(t.willChange || "") || pw.test(t.contain || "");
}
function Yh(e4) {
  let t = po(e4);
  for (; Ve(t) && !So(t); ) {
    if (nl(t)) return t;
    if (ua(t)) return null;
    t = po(t);
  }
  return null;
}
function rl() {
  return Gp == null && (Gp = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), Gp;
}
function So(e4) {
  return /^(html|body|#document)$/.test(Ht(e4));
}
function Ut(e4) {
  return Be(e4).getComputedStyle(e4);
}
function fa(e4) {
  return De(e4) ? { scrollLeft: e4.scrollLeft, scrollTop: e4.scrollTop } : { scrollLeft: e4.scrollX, scrollTop: e4.scrollY };
}
function po(e4) {
  if (Ht(e4) === "html") return e4;
  let t = e4.assignedSlot || e4.parentNode || wn(e4) && e4.host || On(e4);
  return wn(t) ? t.host : t;
}
function qh(e4) {
  let t = po(e4);
  return So(t) ? (e4.ownerDocument || e4).body : Ve(t) && ui(t) ? t : qh(t);
}
function dn(e4, t, o) {
  var n;
  t === void 0 && (t = []), o === void 0 && (o = true);
  let r = qh(e4), i = r === ((n = e4.ownerDocument) == null ? void 0 : n.body), s = Be(r);
  if (i) {
    let a = il(s);
    return t.concat(s, s.visualViewport || [], ui(r) ? r : [], a && o ? dn(a) : []);
  } else return t.concat(r, dn(r, [], o));
}
function il(e4) {
  return e4.parent && Object.getPrototypeOf(e4.parent) ? e4.frameElement : null;
}
var sl = E(M(), 1);
var Wp = sl.createContext(void 0);
function hr(e4 = false) {
  let t = sl.useContext(Wp);
  if (t === void 0 && !e4) throw new Error(Re(16));
  return t;
}
var Xh = E(M(), 1);
function al(e4) {
  let { focusableWhenDisabled: t, disabled: o, composite: n = false, tabIndex: r = 0, isNativeButton: i } = e4, s = n && t !== false, a = n && t === false;
  return { props: Xh.useMemo(() => {
    let c = { onKeyDown(u) {
      o && t && u.key !== "Tab" && u.preventDefault();
    } };
    return n || (c.tabIndex = r, !i && o && (c.tabIndex = t ? r : -1)), (i && (t || s) || !i && o) && (c["aria-disabled"] = o), i && (!t || a) && (c.disabled = o), c;
  }, [n, o, t, s, a, i, r]) };
}
function Te(e4) {
  return e4?.ownerDocument || document;
}
function Yo(e4, t, { detail: o = 0 } = {}) {
  e4.dispatchEvent(new (Be(e4)).PointerEvent("click", { bubbles: true, cancelable: true, composed: true, detail: o, shiftKey: t.shiftKey, ctrlKey: t.ctrlKey, altKey: t.altKey, metaKey: t.metaKey }));
}
function Ke(e4 = {}) {
  let { disabled: t = false, focusableWhenDisabled: o, tabIndex: n = 0, native: r = true, composite: i } = e4, s = os.useRef(null), a = hr(true), l = i ?? a !== void 0, { props: c } = al({ focusableWhenDisabled: o, disabled: t, composite: l, tabIndex: n, isNativeButton: r }), u = os.useCallback(() => {
    let m = s.current;
    $p(m) && l && t && c.disabled === void 0 && m.disabled && (m.disabled = false);
  }, [t, c.disabled, l]);
  W(u, [u]);
  let f = os.useCallback((m = {}) => {
    let { onClick: d, onMouseDown: h, onKeyUp: C, onKeyDown: g, onPointerDown: x, ...b } = m;
    return Rt({ onClick(y) {
      if (t) {
        y.preventDefault();
        return;
      }
      d?.(y);
    }, onMouseDown(y) {
      t || h?.(y);
    }, onKeyDown(y) {
      if (t || (ca(y), g?.(y), y.baseUIHandlerPrevented)) return;
      let R = y.target === y.currentTarget, I = y.currentTarget, S = $p(I), v = !r && dw(I), T = R && (r ? S : !v), w = y.key === "Enter", P = y.key === " ", O = I.getAttribute("role"), N = O?.startsWith("menuitem") || O === "option" || O === "gridcell";
      if (R && l && P) {
        if (y.defaultPrevented && N) return;
        y.preventDefault(), (!r || S) && (y.preventBaseUIHandler(), Yo(I, y));
        return;
      }
      if (!T || r || !P && !w) {
        R && v && P && y.preventDefault();
        return;
      }
      y.defaultPrevented || (y.preventDefault(), w && (y.preventBaseUIHandler(), Yo(I, y)));
    }, onKeyUp(y) {
      if (!t) {
        if (ca(y), C?.(y), y.target === y.currentTarget && r && l && $p(y.currentTarget) && y.key === " ") {
          y.preventDefault();
          return;
        }
        y.baseUIHandlerPrevented || y.target === y.currentTarget && !r && !l && !y.defaultPrevented && y.key === " " && (y.preventBaseUIHandler(), Yo(y.currentTarget, y));
      }
    }, onPointerDown(y) {
      if (t) {
        y.preventDefault();
        return;
      }
      x?.(y);
    } }, r ? { type: "button" } : { role: "button" }, c, b);
  }, [t, c, l, r]), p = G((m) => {
    s.current = m, u();
  });
  return { getButtonProps: f, buttonRef: p };
}
function $p(e4) {
  return Ve(e4) && e4.tagName === "BUTTON";
}
function dw(e4) {
  return Ve(e4) && e4.tagName === "A" && !!e4.href;
}
var Jh = Zh.forwardRef(function(t, o) {
  let { disabled: n, className: r, id: i, render: s, nativeButton: a = true, style: l, ...c } = t, { panelId: u, open: f, handleTrigger: p, disabled: m } = Qc(), d = n || m, { getButtonProps: h, buttonRef: C } = Ke({ disabled: d, focusableWhenDisabled: true, native: a }), { defaultTriggerId: g, state: x, setTriggerId: b } = es(), y = i || void 0, R = y ?? g;
  return W(() => (b((v) => y ?? (v === null ? void 0 : v)), () => {
    b((v) => v === y ? null : v);
  }), [y, b]), U("button", t, { state: x, ref: [o, C], props: [{ "aria-controls": f ? u : void 0, "aria-expanded": f, id: R, onClick: p }, c, h], stateAttributesMapping: Uh });
});
var Kp = E(M(), 1);
var Po = E(M(), 1);
function Le(e4, t, o, n) {
  return e4.addEventListener(t, o, n), () => {
    e4.removeEventListener(t, o, n);
  };
}
function ct(e4) {
  let t = qe(mw, e4).current;
  return t.next = e4, W(t.effect), t;
}
function mw(e4) {
  let t = { current: e4, next: e4, effect: () => {
    t.current = t.next;
  } };
  return t;
}
var Qh = E(M(), 1);
var zp = E(Ko(), 1);
function mn(e4) {
  return e4 == null ? e4 : "current" in e4 ? e4.current : e4;
}
var cl = null;
function gw(e4) {
  if (!cl) {
    let t = [];
    cl = t, queueMicrotask(() => {
      cl = null, zp.flushSync(() => {
        for (let o of t) o();
      });
    });
  }
  cl.push(e4);
}
function Ao(e4, t = false, o = false) {
  let n = Io();
  return G((r, i = null) => {
    n.cancel();
    let s = mn(e4);
    if (s == null) return;
    let a = s, l = () => {
      if (!o) {
        zp.flushSync(r);
        return;
      }
      gw(() => {
        i?.aborted || r();
      });
    };
    if (typeof a.getAnimations != "function" || globalThis.BASE_UI_ANIMATIONS_DISABLED) {
      r();
      return;
    }
    function c() {
      Promise.all(a.getAnimations().map((u) => u.finished)).then(() => {
        i?.aborted || l();
      }, () => {
        if (i?.aborted) return;
        if (a.getAnimations().some((f) => f.pending || f.playState !== "finished")) {
          c();
          return;
        }
        l();
      });
    }
    if (t) {
      let u = ci;
      if (!a.hasAttribute(u)) {
        n.request(c);
        return;
      }
      let f = new MutationObserver(() => {
        a.hasAttribute(u) || (f.disconnect(), c());
      });
      f.observe(a, { attributes: true, attributeFilter: [u] }), i?.addEventListener("abort", () => f.disconnect(), { once: true });
      return;
    }
    n.request(c);
  });
}
function it(e4) {
  let { enabled: t = true, open: o, ref: n, batch: r = false, onComplete: i } = e4, s = G(i), a = Ao(n, o, r);
  Qh.useEffect(() => {
    if (!t) return;
    let l = new AbortController();
    return a(s, l.signal), () => {
      l.abort();
    };
  }, [t, o, s, a]);
}
var pa = { height: void 0, width: void 0 };
function tb(e4) {
  let { externalRef: t, hiddenUntilFound: o, id: n, keepMounted: r, mounted: i, onOpenChange: s, open: a, setMounted: l, setOpen: c, transitionStatus: u } = e4, f = Po.useRef(null), p = Po.useRef(null), [m, d] = Po.useState(pa), h = Po.useRef(pa), C = Po.useRef(false), g = Po.useRef(a), x = Po.useRef(false), [b, y] = Po.useState(false), R = Po.useRef(null), I = ht(t, f), S = ct(a), v = Ao(f), T = !a && !i, w = b ? "idle" : u, P = a && (g.current || x.current), O = !a && i && p.current === "css-animation" && m.height === void 0 && m.width === void 0 ? h.current : m, N = o && T && p.current !== "css-animation", D = G((F, $ = true) => {
    $ && (h.current = F), d(F);
  }), A = G(() => {
    R.current?.(), R.current = null;
  }), _ = G((F) => {
    A(), R.current = () => {
      R.current = null, F();
    };
  }), B = G(() => {
    a && i && p.current === "css-animation" && (x.current = true);
  });
  W(() => {
    !b || u === "starting" || y(false);
  }, [b, u]), Po.useEffect(() => () => {
    B(), A();
  }, [B, A]), W(() => {
    let F = f.current;
    if (!F) return;
    !a && R.current && A();
    let $ = hw(F, P);
    if (p.current = $, a && u === "idle" && g.current && $ === "css-animation") {
      h.current = ns(F);
      return;
    }
    if (a && u === "starting") {
      let te = C.current;
      if (C.current = false, $ === "none") {
        D(ns(F)), y(true);
        return;
      }
      if ($ === "css-transition") {
        let z = bw(F);
        if (D(ns(F)), !te) return z;
        let J = ll(F, "transition-duration", "0s");
        return _(J), y(true), z;
      }
      D(ns(F));
      let L = ll(F, "animation-name", "none");
      if (!te) {
        L();
        return;
      }
      let j = ll(F, "animation-duration", "0s");
      L(), _(j), y(true);
      return;
    }
    if (!a && i && (u === "idle" || u === "starting")) {
      if (g.current = false, x.current = false, $ === "none") {
        D(pa, false), l(false);
        return;
      }
      D(ns(F));
      return;
    }
    if (u !== "ending") return;
    if ($ === "none") {
      l(false);
      return;
    }
    let K = ns(F);
    if (!(K.height > 0 || K.width > 0)) {
      l(false);
      return;
    }
    D(K), $ === "css-animation" && ll(F, "animation-name", "none")();
  }, [i, a, A, D, l, _, P, u]), it({ enabled: a && i && w === "idle", open: true, ref: f, onComplete() {
    a && D(pa, false);
  } }), Po.useEffect(() => {
    if (a || !i || w !== "ending" || !f.current) return;
    let $ = new AbortController(), K = -1;
    function Y() {
      S.current || (l(false), D(pa, false));
    }
    return K = so.request(() => {
      v(Y, $.signal);
    }), () => {
      so.cancel(K), $.abort();
    };
  }, [S, i, a, w, v, D, l]), W(() => {
    let F = f.current;
    !F || !o || !T || F.setAttribute("hidden", "until-found");
  }, [T, o]), Po.useEffect(function() {
    let $ = f.current;
    if (!$) return;
    function K(Y) {
      let te = Q(H.none, Y);
      s(true, te), !te.isCanceled && (C.current = true, c(true));
    }
    return Le($, "beforematch", K);
  }, [s, c]);
  let k = r || o || i || a;
  return { height: O.height, props: { ...N ? { [_h]: "" } : void 0, hidden: T, id: n }, ref: I, shouldPreventOpenAnimation: P, shouldRender: k, transitionStatus: w, width: O.width };
}
function ns(e4) {
  return { height: e4.scrollHeight, width: e4.scrollWidth };
}
function hw(e4, t) {
  let o = Be(e4).getComputedStyle(e4), n = (o.animationName.split(",").map((i) => i.trim()).some((i) => i !== "" && i !== "none") || t) && eb(o.animationDuration), r = eb(o.transitionDuration);
  return n && r || r ? "css-transition" : n ? "css-animation" : "none";
}
function eb(e4) {
  return e4.split(",").map((t) => t.trim()).some((t) => t !== "" && Number.parseFloat(t) > 0);
}
function ll(e4, t, o) {
  let n = e4.style.getPropertyValue(t), r = e4.style.getPropertyPriority(t);
  return e4.style.setProperty(t, o), () => {
    if (n === "") {
      e4.style.removeProperty(t);
      return;
    }
    e4.style.setProperty(t, n, r);
  };
}
function bw(e4) {
  let t = { "justify-content": e4.style.justifyContent, "align-items": e4.style.alignItems, "align-content": e4.style.alignContent, "justify-items": e4.style.justifyItems };
  Object.keys(t).forEach((r) => {
    e4.style.setProperty(r, "initial", "important");
  });
  function o() {
    Object.entries(t).forEach(([r, i]) => {
      if (i === "") {
        e4.style.removeProperty(r);
        return;
      }
      e4.style.setProperty(r, i);
    });
  }
  let n = so.request(o);
  return () => {
    so.cancel(n), o();
  };
}
var ob = "--accordion-panel-height";
var nb = "--accordion-panel-width";
var rb = Kp.forwardRef(function(t, o) {
  let { className: n, hiddenUntilFound: r, keepMounted: i, id: s, render: a, style: l, ...c } = t, { hiddenUntilFound: u, keepMounted: f } = $c(), { defaultPanelId: p, mounted: m, onOpenChange: d, open: h, setMounted: C, setOpen: g, setPanelIdState: x, transitionStatus: b } = Qc(), y = r ?? u, R = i ?? f, I = s || void 0, S = s ?? p;
  W(() => (x(($) => I ?? ($ === null ? void 0 : $)), () => {
    x(($) => $ === I ? null : $);
  }), [I, x]);
  let { height: v, props: T, ref: w, shouldPreventOpenAnimation: P, shouldRender: O, transitionStatus: N, width: D } = tb({ externalRef: o, hiddenUntilFound: y, id: S, keepMounted: R, mounted: m, onOpenChange: d, open: h, setMounted: C, setOpen: g, transitionStatus: b }), { state: A, triggerId: _ } = es(), B = { ...A, transitionStatus: N }, k = zc(l, B), F = U("div", { ...t, style: void 0 }, { state: B, ref: w, props: [T, { "aria-labelledby": _, role: "region", style: { [ob]: v === void 0 ? "auto" : `${v}px`, [nb]: D === void 0 ? "auto" : `${D}px` } }, c, k ? { style: k } : void 0, P ? { style: { animationName: "none" } } : void 0], stateAttributesMapping: ts });
  return O ? F : null;
});
var tR = E(M(), 1);
var Kd = E(M(), 1);
var Je = {};
Tt(Je, { engine: () => Jp, env: () => ed, mediaQuery: () => td, os: () => Xp, screenReader: () => Qp });
var Xp = {};
Tt(Xp, { android: () => ab, apple: () => qp, ios: () => Yp, linux: () => Ew, mac: () => cb, windows: () => vw });
function Rw() {
  return typeof navigator > "u" ? { userAgent: "", platform: "", maxTouchPoints: 0 } : { userAgent: navigator.userAgent, platform: navigator.platform ?? "", maxTouchPoints: navigator.maxTouchPoints ?? 0 };
}
var { userAgent: Cw, platform: yw, maxTouchPoints: ib } = Rw();
var fi = Cw.toLowerCase();
var pi = yw.toLowerCase();
var Yp = /^i(os$|p)/.test(pi) || pi === "macintel" && ib > 1;
var sb = "android";
var ab = pi === sb || fi.includes(sb);
var cb = !Yp && pi.startsWith("mac");
var vw = pi.startsWith("win");
var Ew = !ab && /^(linux|chrome os)/.test(pi);
var qp = cb || Yp;
var Jp = {};
Tt(Jp, { blink: () => Sw, gecko: () => Iw, webkit: () => Zp });
var Zp = typeof CSS < "u" && !!CSS.supports?.("-webkit-backdrop-filter:none");
var Iw = !Zp && fi.includes("firefox");
var Sw = !Zp && fi.includes("chrom");
var Qp = {};
Tt(Qp, { voiceOver: () => Pw });
var Pw = qp;
var ed = {};
Tt(ed, { jsdom: () => Tw });
var Tw = /jsdom|happydom/.test(fi);
var td = {};
Tt(td, { iOS: () => ww });
var ww = "@supports (-webkit-touch-callout: none)";
var da = 0;
var oo = class e2 {
  static create() {
    return new e2();
  }
  currentId = da;
  start(t, o) {
    this.clear(), this.currentId = setTimeout(() => {
      this.currentId = da, o();
    }, t);
  }
  isStarted() {
    return this.currentId !== da;
  }
  clear = () => {
    this.currentId !== da && (clearTimeout(this.currentId), this.currentId = da);
  };
  disposeEffect = () => this.clear;
};
function ot() {
  let e4 = qe(oo.create).current;
  return Qi(e4.disposeEffect), e4;
}
var lb = {};
var ub = {};
var fb = "";
function ul(e4, t) {
  return ui(e4) ? e4 : t;
}
function pb(e4, t, o) {
  return /hidden|clip/.test(e4.getComputedStyle(ul(t, o)).overflowY);
}
function Ow(e4) {
  if (typeof document > "u") return false;
  let t = Te(e4);
  return Be(t).innerWidth - t.documentElement.clientWidth > 0;
}
function Mw(e4) {
  if (!(typeof CSS < "u" && CSS.supports && CSS.supports("scrollbar-gutter", "stable")) || typeof document > "u") return false;
  let o = Te(e4), n = o.documentElement, r = o.body, i = ul(n, r), s = i.style.overflowY, a = n.style.scrollbarGutter;
  n.style.scrollbarGutter = "stable", i.style.overflowY = "scroll";
  let l = i.offsetWidth;
  i.style.overflowY = "hidden";
  let c = i.offsetWidth;
  return i.style.overflowY = s, n.style.scrollbarGutter = a, l === c;
}
function Nw(e4) {
  let t = Te(e4), o = t.documentElement, n = t.body, r = ul(o, n), i = { overflowY: r.style.overflowY, overflowX: r.style.overflowX };
  return Object.assign(r.style, { overflowY: "hidden", overflowX: "hidden" }), () => {
    Object.assign(r.style, i);
  };
}
function Dw(e4) {
  let t = Te(e4), o = t.documentElement, n = t.body, r = Be(o), i = 0, s = 0, a = false, l = so.create();
  if (Je.engine.webkit && (r.visualViewport?.scale ?? 1) !== 1) return () => {
  };
  function c() {
    let m = r.getComputedStyle(o), d = r.getComputedStyle(n), g = (m.scrollbarGutter || "").includes("both-edges") ? "stable both-edges" : "stable";
    i = o.scrollTop, s = o.scrollLeft, lb = { scrollbarGutter: o.style.scrollbarGutter, overflowY: o.style.overflowY, overflowX: o.style.overflowX }, fb = o.style.scrollBehavior, ub = { position: n.style.position, height: n.style.height, width: n.style.width, boxSizing: n.style.boxSizing, overflowY: n.style.overflowY, overflowX: n.style.overflowX, scrollBehavior: n.style.scrollBehavior };
    let x = o.scrollHeight > o.clientHeight, b = o.scrollWidth > o.clientWidth, y = m.overflowY === "scroll" || d.overflowY === "scroll", R = m.overflowX === "scroll" || d.overflowX === "scroll", I = Math.max(0, r.innerWidth - n.clientWidth), S = Math.max(0, r.innerHeight - n.clientHeight), v = parseFloat(d.marginTop) + parseFloat(d.marginBottom), T = parseFloat(d.marginLeft) + parseFloat(d.marginRight), w = ul(o, n);
    if (a = Mw(e4), a) {
      o.style.scrollbarGutter = g, w.style.overflowY = "hidden", w.style.overflowX = "hidden";
      return;
    }
    Object.assign(o.style, { scrollbarGutter: g, overflowY: "hidden", overflowX: "hidden" }), (x || y) && (o.style.overflowY = "scroll"), (b || R) && (o.style.overflowX = "scroll"), Object.assign(n.style, { position: "relative", height: v || S ? `calc(100dvh - ${v + S}px)` : "100dvh", width: T || I ? `calc(100vw - ${T + I}px)` : "100vw", boxSizing: "border-box", overflowY: "hidden", overflowX: "hidden", scrollBehavior: "unset" }), n.scrollTop = i, n.scrollLeft = s, o.setAttribute("data-base-ui-scroll-locked", ""), o.style.scrollBehavior = "unset";
  }
  function u() {
    Object.assign(o.style, lb), Object.assign(n.style, ub), a || (o.scrollTop = i, o.scrollLeft = s, o.removeAttribute("data-base-ui-scroll-locked"), o.style.scrollBehavior = fb);
  }
  function f() {
    u(), l.request(c);
  }
  c();
  let p = Le(r, "resize", f);
  return () => {
    l.cancel(), u(), typeof r.removeEventListener == "function" && p();
  };
}
var od = class {
  lockCount = 0;
  restore = null;
  timeoutLock = oo.create();
  timeoutUnlock = oo.create();
  acquire(t) {
    return this.lockCount += 1, this.lockCount === 1 && this.restore === null && this.timeoutLock.start(0, () => this.lock(t)), this.release;
  }
  release = () => {
    this.lockCount -= 1, this.lockCount === 0 && this.restore && this.timeoutUnlock.start(0, this.unlock);
  };
  unlock = () => {
    this.lockCount === 0 && this.restore && (this.restore?.(), this.restore = null);
  };
  lock(t) {
    if (this.lockCount === 0 || this.restore !== null) return;
    let o = Te(t), n = o.documentElement, r = o.body, i = Be(n);
    if (pb(i, n, r)) {
      let a = new i.MutationObserver(() => {
        pb(i, n, r) || (a.disconnect(), this.restore = null, this.lock(t));
      }), l = { attributes: true };
      a.observe(n, l), a.observe(r, l), this.restore = () => a.disconnect();
      return;
    }
    let s = Je.os.ios || !Ow(t);
    this.restore = s ? Nw(t) : Dw(t);
  }
};
var Aw = new od();
function fl(e4 = true, t = null) {
  W(() => {
    if (e4) return Aw.acquire(t);
  }, [e4, t]);
}
var To = E(M(), 1);
function rt(e4) {
  e4.preventDefault(), e4.stopPropagation();
}
function db(e4) {
  return "nativeEvent" in e4;
}
function rs(e4) {
  return e4.pointerType === "" && e4.isTrusted ? true : Je.os.android && e4.pointerType ? e4.type === "click" && e4.buttons === 1 : e4.detail === 0 && !e4.pointerType;
}
function is(e4) {
  return Je.env.jsdom ? false : !Je.os.android && e4.width === 0 && e4.height === 0 || Je.os.android && e4.width === 1 && e4.height === 1 && e4.pressure === 0 && e4.detail === 0 && e4.pointerType === "mouse" || e4.width < 1 && e4.height < 1 && e4.pressure === 0 && e4.detail === 0 && e4.pointerType === "touch";
}
function Ho(e4, t) {
  let o = ["mouse", "pen"];
  return t || o.push("", void 0), o.includes(e4);
}
function mb(e4) {
  let t = e4.type;
  return t === "click" || t === "mousedown" || t === "keydown" || t === "keyup";
}
function Ct(e4) {
  let t = e4.activeElement;
  for (; t?.shadowRoot?.activeElement != null; ) t = t.shadowRoot.activeElement;
  return t;
}
function me(e4, t) {
  if (!e4 || !t) return false;
  let o = t.getRootNode?.();
  if (e4.contains(t)) return true;
  if (o && wn(o)) {
    let n = t;
    for (; n; ) {
      if (e4 === n) return true;
      n = n.parentNode || n.host;
    }
  }
  return false;
}
function We(e4) {
  return "composedPath" in e4 ? e4.composedPath()[0] ?? e4.target : e4.target;
}
var ma = "data-base-ui-focusable";
var nd = "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
var Yn = "ArrowLeft";
var qn = "ArrowRight";
var ga = "ArrowUp";
var ss = "ArrowDown";
var di = {};
Tt(di, { align: () => Lw, anchorHidden: () => sd, closed: () => id, endingStyle: () => Fw, open: () => rd, side: () => Vw, startingStyle: () => kw });
var rd = "data-open";
var id = "data-closed";
var kw = ci;
var Fw = la;
var sd = "data-anchor-hidden";
var Vw = "data-side";
var Lw = "data-align";
var mi = {};
Tt(mi, { popupOpen: () => pl, pressed: () => ad });
var pl = "data-popup-open";
var ad = "data-pressed";
var _w = { [pl]: "" };
var Bw = { [pl]: "", [ad]: "" };
var Hw = { [rd]: "" };
var Uw = { [id]: "" };
var jw = { [sd]: "" };
var Mn = { open(e4) {
  return e4 ? _w : null;
} };
var gi = { open(e4) {
  return e4 ? Bw : null;
} };
var ao = { open(e4) {
  return e4 ? Hw : Uw;
}, anchorHidden(e4) {
  return e4 ? jw : null;
} };
var qo = { ...ao, ...Ot };
var ok = mi.popupOpen;
var ha = "data-trigger-disabled";
function xr(e4, t) {
  if (!De(e4)) return false;
  let o = e4;
  if (t.hasElement(o)) return !o.hasAttribute(ha);
  for (let [, n] of t.entries()) if (me(n, o)) return !n.hasAttribute(ha);
  return false;
}
function dl(e4, t) {
  if (t == null) return false;
  if ("composedPath" in e4) return e4.composedPath().includes(t);
  let o = e4;
  return o.target != null && t.contains(o.target);
}
function hb(e4) {
  return e4.matches("html,body");
}
function hi(e4) {
  return Ve(e4) && e4.matches(nd);
}
function ba(e4) {
  return e4?.closest(`button,a[href],[role="button"],select,[tabindex]:not([tabindex="-1"]),${nd}`) != null;
}
function xa(e4) {
  return e4 ? e4.getAttribute("role") === "combobox" && hi(e4) : false;
}
function ml(e4) {
  if (!e4 || Je.env.jsdom) return true;
  try {
    return e4.matches(":focus-visible");
  } catch {
    return true;
  }
}
function Ra(e4) {
  return e4 ? e4.hasAttribute(ma) ? e4 : e4.querySelector(`[${ma}]`) || e4 : null;
}
function Gw(e4, t) {
  return t != null && !Ho(t) ? 0 : typeof e4 == "function" ? e4() : e4;
}
function gn(e4, t, o) {
  let n = Gw(e4, o);
  return typeof n == "number" ? n : n?.[t];
}
function cd(e4) {
  return typeof e4 == "function" ? e4() : e4;
}
function gl(e4, t) {
  return t || e4 === "click" || e4 === "mousedown";
}
function bb(e4) {
  return e4?.includes("mouse") && e4 !== "mousedown";
}
var xb = E(Ie(), 1);
var Rb = To.createContext({ hasProvider: false, timeoutMs: 0, delayRef: { current: 0 }, initialDelayRef: { current: 0 }, timeout: new oo(), currentIdRef: { current: null }, currentContextRef: { current: null } });
function Ww(e4, t) {
  e4.current = t.current;
}
function ld(e4) {
  let { children: t, delay: o, timeoutMs: n = 0 } = e4, r = To.useRef(o), i = To.useRef(o), s = To.useRef(null), a = To.useRef(null), l = ot();
  return W(() => {
    if (i.current = o, !s.current) {
      r.current = o;
      return;
    }
    r.current = { open: gn(r.current, "open"), close: gn(o, "close") };
  }, [o, s, r, i]), (0, xb.jsx)(Rb.Provider, { value: To.useMemo(() => ({ hasProvider: true, delayRef: r, initialDelayRef: i, currentIdRef: s, timeoutMs: n, currentContextRef: a, timeout: l }), [n, l]), children: t });
}
function ud(e4, t = { open: false }) {
  let { open: o } = t, n = "rootStore" in e4 ? e4.rootStore : e4, r = n.useState("floatingId"), i = To.useContext(Rb), { currentIdRef: s, delayRef: a, timeoutMs: l, initialDelayRef: c, currentContextRef: u, hasProvider: f, timeout: p } = i, [m, d] = To.useState(false), h = To.useRef(o);
  return W(() => {
    h.current = o;
  }, [o]), W(() => {
    function C() {
      u.current?.setIsInstantPhase(false), s.current = null, u.current = null, a.current = c.current, p.clear();
    }
    if (s.current && !o && s.current === r) {
      if (d(false), l) {
        let g = r;
        return p.start(l, () => {
          n.select("open") || s.current && s.current !== g || C();
        }), () => {
          (h.current || s.current !== g) && p.clear();
        };
      }
      C();
    }
  }, [o, r, s, a, l, c, u, p, n]), W(() => {
    if (!o) return;
    let C = u.current, g = s.current;
    p.clear(), u.current = { onOpenChange: n.setOpen, setIsInstantPhase: d }, s.current = r, a.current = { open: 0, close: gn(c.current, "close") }, g !== null && g !== r ? (d(true), C?.setIsInstantPhase(true), C?.onOpenChange(false, Q(H.none))) : (d(false), C?.setIsInstantPhase(false));
  }, [o, r, n, s, a, c, u, p]), W(() => () => {
    if (s.current === r) {
      if (u.current = null, !h.current) return;
      s.current = null, Ww(a, c), p.clear();
    }
  }, [u, s, a, r, c, p]), To.useMemo(() => ({ activeIdRef: s, hasProvider: f, delayRef: a, isInstantPhase: m }), [s, f, a, m]);
}
var bo = E(M(), 1);
function mo(...e4) {
  return () => {
    for (let t = 0; t < e4.length; t += 1) {
      let o = e4[t];
      o && o();
    }
  };
}
var hl = E(M(), 1);
var Cb = { clipPath: "inset(50%)", overflow: "hidden", whiteSpace: "nowrap", border: 0, padding: 0, width: 1, height: 1, margin: -1 };
var wo = { ...Cb, position: "fixed", top: 0, left: 0 };
var Nn = { ...Cb, position: "absolute" };
var yb = E(Ie(), 1);
var Xo = hl.forwardRef(function(t, o) {
  let [n, r] = hl.useState();
  return W(() => {
    Je.screenReader.voiceOver && Je.engine.webkit && r("button");
  }, []), (0, yb.jsx)("span", { ...t, ref: o, style: wo, "aria-hidden": n ? void 0 : true, ...{ tabIndex: 0, role: n }, "data-base-ui-focus-guard": "" });
});
var Rr = Math.min;
var hn = Math.max;
var Cr = Math.round;
var Xn = Math.floor;
var Dn = (e4) => ({ x: e4, y: e4 });
var $w = { left: "right", right: "left", bottom: "top", top: "bottom" };
function xl(e4, t, o) {
  return hn(e4, Rr(t, o));
}
function An(e4, t) {
  return typeof e4 == "function" ? e4(t) : e4;
}
function go(e4) {
  return e4.split("-")[0];
}
function Zo(e4) {
  return e4.split("-")[1];
}
function Rl(e4) {
  return e4 === "x" ? "y" : "x";
}
function ya(e4) {
  return e4 === "y" ? "height" : "width";
}
function ko(e4) {
  let t = e4[0];
  return t === "t" || t === "b" ? "y" : "x";
}
function va(e4) {
  return Rl(ko(e4));
}
function Ib(e4, t, o) {
  o === void 0 && (o = false);
  let n = Zo(e4), r = va(e4), i = ya(r), s = r === "x" ? n === (o ? "end" : "start") ? "right" : "left" : n === "start" ? "bottom" : "top";
  return t.reference[i] > t.floating[i] && (s = Ca(s)), [s, Ca(s)];
}
function Sb(e4) {
  let t = Ca(e4);
  return [bl(e4), t, bl(t)];
}
function bl(e4) {
  return e4.includes("start") ? e4.replace("start", "end") : e4.replace("end", "start");
}
var vb = ["left", "right"];
var Eb = ["right", "left"];
var zw = ["top", "bottom"];
var Kw = ["bottom", "top"];
function Yw(e4, t, o) {
  switch (e4) {
    case "top":
    case "bottom":
      return o ? t ? Eb : vb : t ? vb : Eb;
    case "left":
    case "right":
      return t ? zw : Kw;
    default:
      return [];
  }
}
function Pb(e4, t, o, n) {
  let r = Zo(e4), i = Yw(go(e4), o === "start", n);
  return r && (i = i.map((s) => s + "-" + r), t && (i = i.concat(i.map(bl)))), i;
}
function Ca(e4) {
  let t = go(e4);
  return $w[t] + e4.slice(t.length);
}
function qw(e4) {
  var t, o, n, r;
  return { top: (t = e4.top) != null ? t : 0, right: (o = e4.right) != null ? o : 0, bottom: (n = e4.bottom) != null ? n : 0, left: (r = e4.left) != null ? r : 0 };
}
function Cl(e4) {
  return typeof e4 != "number" ? qw(e4) : { top: e4, right: e4, bottom: e4, left: e4 };
}
function bi(e4) {
  let { x: t, y: o, width: n, height: r } = e4;
  return { width: n, height: r, top: o, left: t, right: t + n, bottom: o + r, x: t, y: o };
}
function yl(e4, t, o) {
  return Math.floor(e4 / t) !== o;
}
function Jo(e4, t) {
  return t < 0 || t >= e4.length;
}
function xi(e4, t) {
  return jt(e4.current, { disabledIndices: t });
}
function as(e4, t) {
  return jt(e4.current, { decrement: true, startingIndex: e4.current.length, disabledIndices: t });
}
function jt(e4, { startingIndex: t = -1, decrement: o = false, disabledIndices: n, amount: r = 1 } = {}) {
  let i = t;
  do
    i += o ? -r : r;
  while (i >= 0 && i <= e4.length - 1 && bn(e4, i, n));
  return i;
}
function Tb(e4, { event: t, orientation: o, loopFocus: n, onLoop: r, rtl: i, cols: s, disabledIndices: a, minIndex: l, maxIndex: c, prevIndex: u, stopEvent: f = false }) {
  let p = u, m;
  if (t.key === ga ? m = "up" : t.key === ss && (m = "down"), m) {
    let d = [], h = [], C = false, g = 0;
    {
      let T = null, w = -1;
      e4.forEach((P, O) => {
        if (P == null) return;
        g += 1;
        let N = P.closest('[role="row"]');
        N && (C = true), (N !== T || w === -1) && (T = N, w += 1, d[w] = []), d[w].push(O), h[O] = w;
      });
    }
    let x = false, b = 0;
    if (C) for (let T of d) {
      let w = T.length;
      w > b && (b = w), w !== s && (x = true);
    }
    let y = x && g < e4.length, R = b || s, I = (T) => {
      if (!x || u === -1) return;
      let w = h[u];
      if (w == null) return;
      let P = d[w].indexOf(u), O = T === "up" ? -1 : 1;
      for (let N = w + O, D = 0; D < d.length; D += 1, N += O) {
        if (N < 0 || N >= d.length) {
          if (!n || y) return;
          if (N = N < 0 ? d.length - 1 : 0, r) {
            let _ = Math.min(P, d[N].length - 1), B = d[N][_] ?? d[N][0], k = r(t, u, B);
            N = h[k] ?? N;
          }
        }
        let A = d[N];
        for (let _ = Math.min(P, A.length - 1); _ >= 0; _ -= 1) {
          let B = A[_];
          if (!bn(e4, B, a)) return B;
        }
      }
    }, S = (T) => {
      if (!y || u === -1) return;
      let w = u % R, P = T === "up" ? -R : R, O = c - c % R, N = Xn(c / R) + 1;
      for (let D = u - w + P, A = 0; A < N; A += 1, D += P) {
        if (D < 0 || D > c) {
          if (!n) return;
          D = D < 0 ? O : 0;
        }
        let _ = Math.min(D + R - 1, c);
        for (let B = Math.min(D + w, _); B >= D; B -= 1) if (!bn(e4, B, a)) return B;
      }
    };
    f && rt(t);
    let v = I(m) ?? S(m);
    if (v !== void 0) p = v;
    else if (u === -1) p = m === "up" ? c : l;
    else if (p = jt(e4, { startingIndex: u, amount: R, decrement: m === "up", disabledIndices: a }), n) {
      if (m === "up" && (u - R < l || p < 0)) {
        let T = u % R, w = c % R, P = c - (w - T);
        w === T ? p = c : p = w > T ? P : P - R, r && (p = r(t, u, p));
      }
      m === "down" && u + R > c && (p = jt(e4, { startingIndex: u % R - R, amount: R, disabledIndices: a }), r && (p = r(t, u, p)));
    }
    Jo(e4, p) && (p = u);
  }
  if (o === "both") {
    let d = Xn(u / s);
    t.key === (i ? Yn : qn) && (f && rt(t), u % s !== s - 1 ? (p = jt(e4, { startingIndex: u, disabledIndices: a }), n && yl(p, s, d) && (p = jt(e4, { startingIndex: u - u % s - 1, disabledIndices: a }), r && (p = r(t, u, p)))) : n && (p = jt(e4, { startingIndex: u - u % s - 1, disabledIndices: a }), r && (p = r(t, u, p))), yl(p, s, d) && (p = u)), t.key === (i ? qn : Yn) && (f && rt(t), u % s !== 0 ? (p = jt(e4, { startingIndex: u, decrement: true, disabledIndices: a }), n && yl(p, s, d) && (p = jt(e4, { startingIndex: u + (s - u % s), decrement: true, disabledIndices: a }), r && (p = r(t, u, p)))) : n && (p = jt(e4, { startingIndex: u + (s - u % s), decrement: true, disabledIndices: a }), r && (p = r(t, u, p))), yl(p, s, d) && (p = u));
    let h = Xn(c / s) === d;
    Jo(e4, p) && (n && h ? (p = t.key === (i ? qn : Yn) ? c : jt(e4, { startingIndex: u - u % s - 1, disabledIndices: a }), r && (p = r(t, u, p))) : p = u);
  }
  return p;
}
function bn(e4, t, o) {
  if (typeof o == "function" ? o(t) : o?.includes(t) ?? false) return true;
  let r = e4[t];
  return r ? !Ri(r) || r.matches(":disabled") ? true : !o && (r.hasAttribute("disabled") || r.getAttribute("aria-disabled") === "true") : false;
}
function Xw(e4) {
  return e4.visibility === "hidden" || e4.visibility === "collapse";
}
function Ri(e4, t = e4 ? Ut(e4) : null) {
  return !e4 || !e4.isConnected || !t || Xw(t) ? false : typeof e4.checkVisibility == "function" ? e4.checkVisibility() : t.display !== "none" && t.display !== "contents";
}
var Zw = 'a[href],button,input,select,textarea,summary,details,iframe,object,embed,[tabindex],[contenteditable]:not([contenteditable="false"]),audio[controls],video[controls]';
function Jw(e4) {
  let t = e4.assignedSlot;
  if (t) return t;
  if (e4.parentElement) return e4.parentElement;
  let o = e4.getRootNode();
  return wn(o) ? o.host : null;
}
function pd(e4) {
  for (let t of Array.from(e4.children)) if (Ht(t) === "summary") return t;
  return null;
}
function Qw(e4, t) {
  let o = pd(t);
  return !!o && (e4 === o || me(o, e4));
}
function wb(e4) {
  let t = e4 ? Ht(e4) : "";
  return e4 != null && e4.matches(Zw) && (t !== "summary" || e4.parentElement != null && Ht(e4.parentElement) === "details" && pd(e4.parentElement) === e4) && (t !== "details" || pd(e4) == null) && (t !== "input" || e4.type !== "hidden");
}
function Ob(e4) {
  if (!wb(e4) || !e4.isConnected || e4.matches(":disabled")) return false;
  for (let t = e4; t; t = Jw(t)) {
    let o = t !== e4, n = Ht(t) === "slot";
    if (t.hasAttribute("inert") || o && Ht(t) === "details" && !t.open && !Qw(e4, t) || t.hasAttribute("hidden") || !n && !eO(t, o)) return false;
  }
  return true;
}
function eO(e4, t) {
  let o = Ut(e4);
  return t ? o.display !== "none" : Ri(e4, o);
}
function Mb(e4) {
  let t = e4.tabIndex;
  if (t < 0) {
    let o = Ht(e4);
    if (o === "details" || o === "audio" || o === "video" || Ve(e4) && e4.isContentEditable) return 0;
  }
  return t;
}
function fd(e4) {
  if (Ht(e4) !== "input") return null;
  let t = e4;
  return t.type === "radio" && t.name !== "" ? t : null;
}
function tO(e4, t) {
  let o = fd(e4);
  if (!o) return true;
  let n = t.find((r) => {
    let i = fd(r);
    return i?.name === o.name && i.form === o.form && i.checked;
  });
  return n ? n === o : t.find((r) => {
    let i = fd(r);
    return i?.name === o.name && i.form === o.form;
  }) === o;
}
function Nb(e4) {
  if (Ve(e4) && Ht(e4) === "slot") {
    let t = e4.assignedElements({ flatten: true });
    if (t.length > 0) return t;
  }
  return Ve(e4) && e4.shadowRoot ? Array.from(e4.shadowRoot.children) : Array.from(e4.children);
}
function Db(e4, t) {
  Nb(e4).forEach((o) => {
    wb(o) && t.push(o), Db(o, t);
  });
}
function Ab(e4, t, o) {
  Nb(e4).forEach((n) => {
    Ve(n) && n.matches(t) && o.push(n), Ab(n, t, o);
  });
}
function vl(e4) {
  return Ob(e4) && Mb(e4) >= 0;
}
function dd(e4) {
  let t = [];
  return Db(e4, t), t.filter(Ob);
}
function cs(e4) {
  let t = dd(e4);
  return t.filter((o) => Mb(o) >= 0 && tO(o, t));
}
function kb(e4, t) {
  let o = cs(e4), n = o.length;
  if (n === 0) return;
  let r = Ct(Te(e4)), i = o.indexOf(r), s = i === -1 ? t === 1 ? 0 : n - 1 : i + t;
  return o[s];
}
function ls(e4) {
  return kb(Te(e4).body, 1) || e4;
}
function El(e4) {
  return kb(Te(e4).body, -1) || e4;
}
function Fb(e4, t) {
  if (!e4) return null;
  let o = cs(Te(e4).body), n = o.length;
  if (n === 0) return null;
  let r = o.indexOf(e4);
  if (r === -1) return null;
  let i = (r + t + n) % n;
  return o[i];
}
function Vb(e4) {
  return Fb(e4, 1);
}
function Lb(e4) {
  return Fb(e4, -1);
}
function Zn(e4, t) {
  let o = t || e4.currentTarget, n = e4.relatedTarget;
  return !n || !me(o, n);
}
function _b(e4) {
  cs(e4).forEach((o) => {
    o.dataset.tabindex = o.getAttribute("tabindex") || "", o.setAttribute("tabindex", "-1");
  });
}
function md(e4) {
  let t = [];
  Ab(e4, "[data-tabindex]", t), t.forEach((o) => {
    let n = o.dataset.tabindex;
    delete o.dataset.tabindex, n ? o.setAttribute("tabindex", n) : o.removeAttribute("tabindex");
  });
}
function Qo(e4, t, o = true) {
  return e4.filter((r) => r.parentId === t).flatMap((r) => [...!o || r.context?.open ? [r] : [], ...Qo(e4, r.id, o)]);
}
function gd(e4, t) {
  let o = [], n = e4.find((r) => r.id === t)?.parentId;
  for (; n; ) {
    let r = e4.find((i) => i.id === n);
    n = r?.parentId, r && (o = o.concat(r));
  }
  return o;
}
function Jn(e4) {
  return `data-base-ui-${e4}`;
}
var Il = 0;
function us(e4, t = {}) {
  let { preventScroll: o = false, sync: n = false, shouldFocus: r } = t;
  cancelAnimationFrame(Il);
  function i() {
    r && !r() || e4?.focus({ preventScroll: o });
  }
  if (n) return i(), Oe;
  let s = requestAnimationFrame(i);
  return Il = s, () => {
    Il === s && (cancelAnimationFrame(s), Il = 0);
  };
}
var hd = { inert: /* @__PURE__ */ new WeakMap(), "aria-hidden": /* @__PURE__ */ new WeakMap() };
var Bb = "data-base-ui-inert";
var xd = { inert: /* @__PURE__ */ new WeakSet(), "aria-hidden": /* @__PURE__ */ new WeakSet() };
var Ea = /* @__PURE__ */ new WeakMap();
var bd = 0;
function oO(e4) {
  return xd[e4];
}
function Gb(e4) {
  return e4 ? wn(e4) ? e4.host : Gb(e4.parentNode) : null;
}
var Hb = (e4, t) => t.map((o) => {
  if (e4.contains(o)) return o;
  let n = Gb(o);
  return e4.contains(n) ? n : null;
}).filter((o) => o != null);
var Ub = (e4) => {
  let t = /* @__PURE__ */ new Set();
  return e4.forEach((o) => {
    let n = o;
    for (; n && !t.has(n); ) t.add(n), n = n.parentNode;
  }), t;
};
var jb = (e4, t, o) => {
  let n = [], r = (i) => {
    !i || o.has(i) || Array.from(i.children).forEach((s) => {
      Ht(s) !== "script" && (t.has(s) ? r(s) : n.push(s));
    });
  };
  return r(e4), n;
};
function nO(e4, t, o, n, { mark: r = true }) {
  let i = null;
  n ? i = "inert" : o && (i = "aria-hidden");
  let s = null, a = null, l = Hb(t, e4), c = r ? jb(t, Ub(l), new Set(l)) : [], u = [], f = [];
  if (i) {
    let p = hd[i], m = oO(i);
    a = m, s = p;
    let d = Hb(t, Array.from(t.querySelectorAll("[aria-live]"))), h = l.concat(d);
    jb(t, Ub(h), new Set(h)).forEach((g) => {
      let x = g.getAttribute(i), b = x !== null && x !== "false", y = (p.get(g) || 0) + 1;
      p.set(g, y), u.push(g), y === 1 && b && m.add(g), b || g.setAttribute(i, i === "inert" ? "" : "true");
    });
  }
  return r && c.forEach((p) => {
    let m = (Ea.get(p) || 0) + 1;
    Ea.set(p, m), f.push(p), m === 1 && p.setAttribute(Bb, "");
  }), bd += 1, () => {
    s && u.forEach((p) => {
      let d = (s.get(p) || 0) - 1;
      s.set(p, d), d || (!a?.has(p) && i && p.removeAttribute(i), a?.delete(p));
    }), r && f.forEach((p) => {
      let m = (Ea.get(p) || 0) - 1;
      Ea.set(p, m), m || p.removeAttribute(Bb);
    }), bd -= 1, bd || (hd.inert = /* @__PURE__ */ new WeakMap(), hd["aria-hidden"] = /* @__PURE__ */ new WeakMap(), xd.inert = /* @__PURE__ */ new WeakSet(), xd["aria-hidden"] = /* @__PURE__ */ new WeakSet(), Ea = /* @__PURE__ */ new WeakMap());
  };
}
function Rd(e4, t = {}) {
  let { ariaHidden: o = false, inert: n = false, mark: r = true } = t, i = Te(e4[0]).body;
  return nO(e4, i, o, n, { mark: r });
}
var St = E(M(), 1);
var Cd = E(Ko(), 1);
var Wb = { style: { transition: "none" } };
var fs = "data-base-ui-click-trigger";
var rO = "data-base-ui-swipe-ignore";
var iO = "data-swipe-ignore";
var Uk = `[${rO}]`;
var jk = `[${iO}]`;
var Sl = { fallbackAxisSide: "none" };
var ps = { fallbackAxisSide: "end" };
var $b = { clipPath: "inset(50%)", position: "fixed", top: 0, left: 0 };
var Ci = E(Ie(), 1);
var zb = St.createContext(null);
var yd = () => St.useContext(zb);
var sO = Jn("portal");
function Pl(e4 = {}) {
  let { ref: t, container: o, componentProps: n = Me, elementProps: r } = e4, i = Bo(), a = yd()?.portalNode, [l, c] = St.useState(null), [u, f] = St.useState(null), p = G((C) => {
    C !== null && f(C);
  }), m = St.useRef(null);
  W(() => {
    if (o === null) {
      m.current && (m.current = null, f(null), c(null));
      return;
    }
    let C = (o && (ol(o) ? o : o.current)) ?? a ?? document.body;
    if (C == null) {
      m.current && (m.current = null, f(null), c(null));
      return;
    }
    m.current !== C && (m.current = C, f(null), c(C));
  }, [o, a]);
  let d = U("div", n, { ref: [t, p], props: [{ id: i, [sO]: "" }, r] }), h = l && d ? Cd.createPortal(d, l) : null;
  return { node: u, nodeId: St.isValidElement(d) ? d.props.id : void 0, subtree: h };
}
var Qn = St.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, children: s, container: a, portalOwnerRole: l, ...c } = t, { node: u, nodeId: f, subtree: p } = Pl({ container: a, ref: o, componentProps: t, elementProps: c }), m = St.useRef(null), d = St.useRef(null), h = St.useRef(null), C = St.useRef(null), [g, x] = St.useState(null), b = St.useRef(false), y = g?.modal, R = g?.open, I = !!g && !g.modal && g.open && !!u;
  St.useEffect(() => {
    if (!u || y) return;
    function v(T) {
      u && T.relatedTarget && Zn(T) && (T.type === "focusin" ? b.current && (md(u), b.current = false) : (_b(u), b.current = true));
    }
    return mo(Le(u, "focusin", v, true), Le(u, "focusout", v, true));
  }, [u, y]), W(() => {
    !u || R !== true || !b.current || (md(u), b.current = false);
  }, [R, u]);
  let S = St.useMemo(() => ({ beforeOutsideRef: m, afterOutsideRef: d, beforeInsideRef: h, afterInsideRef: C, portalNode: u, setFocusManagerState: x }), [u]);
  return (0, Ci.jsxs)(St.Fragment, { children: [p, (0, Ci.jsxs)(zb.Provider, { value: S, children: [I && u && (0, Ci.jsx)(Xo, { "data-type": "outside", ref: m, onFocus: (v) => {
    if (Zn(v, u)) h.current?.focus();
    else {
      let T = g ? g.domReference : null;
      El(T)?.focus();
    }
  } }), I && u && (0, Ci.jsx)("span", { role: l, "aria-owns": f, style: $b }), u && Cd.createPortal(s, u), I && u && (0, Ci.jsx)(Xo, { "data-type": "outside", ref: d, onFocus: (v) => {
    if (Zn(v, u)) C.current?.focus();
    else {
      let T = g ? g.domReference : null;
      ls(T)?.focus(), g?.closeOnFocusOut && g?.onOpenChange(false, Q(H.focusOut, v.nativeEvent));
    }
  } })] })] });
});
var vr = E(M(), 1);
function Tl() {
  let e4 = /* @__PURE__ */ new Map();
  return { emit(t, o) {
    e4.get(t)?.forEach((n) => n(o));
  }, on(t, o) {
    e4.has(t) || e4.set(t, /* @__PURE__ */ new Set()), e4.get(t).add(o);
  }, off(t, o) {
    e4.get(t)?.delete(o);
  } };
}
var yr = class {
  nodesRef = { current: [] };
  events = Tl();
  addNode(t) {
    this.nodesRef.current.push(t);
  }
  removeNode(t) {
    let o = this.nodesRef.current.findIndex((n) => n === t);
    o !== -1 && this.nodesRef.current.splice(o, 1);
  }
};
var vd = E(Ie(), 1);
var Kb = vr.createContext(null);
var Yb = vr.createContext(null);
var Oo = () => vr.useContext(Kb)?.id || null;
var ho = (e4) => {
  let t = vr.useContext(Yb);
  return e4 ?? t;
};
function yi(e4) {
  let t = Bo(), o = ho(e4), n = Oo();
  return W(() => {
    if (!t) return;
    let r = { id: t, parentId: n };
    return o?.addNode(r), () => {
      o?.removeNode(r);
    };
  }, [o, t, n]), t;
}
function Ia(e4) {
  let { children: t, id: o } = e4, n = Oo();
  return (0, vd.jsx)(Kb.Provider, { value: vr.useMemo(() => ({ id: o, parentId: n }), [o, n]), children: t });
}
function Sa(e4) {
  let { children: t, externalTree: o } = e4, n = qe(() => o ?? new yr()).current;
  return (0, vd.jsx)(Yb.Provider, { value: n, children: t });
}
var Pa = E(Ie(), 1);
function aO(e4, t) {
  let o = Be(We(e4));
  return e4 instanceof o.KeyboardEvent ? "keyboard" : e4 instanceof o.FocusEvent ? t || "keyboard" : "pointerType" in e4 ? e4.pointerType || "keyboard" : "touches" in e4 ? "touch" : e4 instanceof o.MouseEvent ? t || (e4.detail === 0 ? "keyboard" : "mouse") : "";
}
var qb = 20;
var Er = [];
function Ed() {
  Er = Er.filter((e4) => e4.deref()?.isConnected);
}
function Xb(e4) {
  Ed(), e4 && Ht(e4) !== "body" && (Er.push(new WeakRef(e4)), Er.length > qb && (Er = Er.slice(-qb)));
}
function Zb() {
  return Ed(), Er[Er.length - 1]?.deref();
}
function cO(e4) {
  return e4 ? vl(e4) ? e4 : cs(e4)[0] || e4 : null;
}
function Jb(e4) {
  if (e4.hasAttribute("tabindex") && !e4.hasAttribute("data-tabindex") || !e4.getAttribute("role")?.includes("dialog")) return;
  let o = dd(e4).filter((r) => {
    let i = r.getAttribute("data-tabindex") || "";
    return vl(r) || r.hasAttribute("data-tabindex") && !i.startsWith("-");
  }), n = e4.getAttribute("tabindex");
  o.length === 0 ? n !== "0" && (e4.setAttribute("tabindex", "0"), e4.setAttribute("data-tabindex", "0")) : (n !== "-1" || e4.hasAttribute("data-tabindex") && e4.getAttribute("data-tabindex") !== "-1") && (e4.setAttribute("tabindex", "-1"), e4.setAttribute("data-tabindex", "-1"));
}
function er(e4) {
  let { context: t, children: o, disabled: n = false, initialFocus: r = true, returnFocus: i = true, restoreFocus: s = false, modal: a = true, closeOnFocusOut: l = true, openInteractionType: c = "", nextFocusableElement: u, previousFocusableElement: f, beforeContentFocusGuardRef: p, externalTree: m, getInsideElements: d } = e4, h = "rootStore" in t ? t.rootStore : t, C = h.useState("open"), g = h.useState("domReferenceElement"), x = h.useState("floatingElement"), { events: b, dataRef: y } = h.context, R = G(() => y.current.floatingContext?.nodeId), I = r === false, S = xa(g) && I, v = ct(r), T = ct(i), w = ct(c), P = ct(C), O = ho(m), N = yd(), D = bo.useRef(false), A = bo.useRef(false), _ = bo.useRef(false), B = bo.useRef(null), k = bo.useRef(""), F = bo.useRef(""), $ = bo.useRef(null), K = bo.useRef(null), Y = ht($, p, N?.beforeInsideRef), te = ht(K, N?.afterInsideRef), L = ot(), j = ot(), z = Io(), J = N != null, X = Ra(x), pe = G((ce = X) => ce ? cs(ce) : []), de = G(() => d?.().filter((ce) => ce != null) ?? []);
  bo.useEffect(() => {
    if (n || !a) return;
    function ce(se) {
      se.key === "Tab" && me(X, Ct(Te(X))) && pe().length === 0 && !S && rt(se);
    }
    let fe = Te(X);
    return Le(fe, "keydown", ce);
  }, [n, X, a, S, pe]), bo.useEffect(() => {
    if (n || !C) return;
    let ce = Te(X);
    function fe() {
      _.current = false;
    }
    function se(be) {
      let re = We(be), Z = de(), ee = me(x, re) || me(g, re) || me(N?.portalNode, re) || Z.some((le) => le === re || me(le, re));
      _.current = !ee, F.current = be.pointerType || "keyboard", re?.closest(`[${fs}]`) && (A.current = true, j.start(0, () => {
        A.current = false;
      }));
    }
    function ge() {
      F.current = "keyboard";
    }
    return mo(Le(ce, "pointerdown", se, true), Le(ce, "pointerup", fe, true), Le(ce, "pointercancel", fe, true), Le(ce, "keydown", ge, true), fe);
  }, [n, x, g, X, C, N, j, de]), bo.useEffect(() => {
    if (n || !l) return;
    let ce = Te(X);
    function fe() {
      A.current = true, j.start(0, () => {
        A.current = false;
      });
    }
    function se(Z) {
      let ee = We(Z);
      vl(ee) && (B.current = ee);
    }
    function ge(Z) {
      let ee = Z.relatedTarget, le = Z.currentTarget, ue = We(Z);
      a && ee == null && ue != null && me(x, ue) && Xb(ue), queueMicrotask(() => {
        let xe = R(), ae = h.context.triggerElements, oe = de(), he = ee?.hasAttribute(Jn("focus-guard")) && [$.current, K.current, N?.beforeInsideRef.current, N?.afterInsideRef.current, N?.beforeOutsideRef.current, N?.afterOutsideRef.current, mn(f), mn(u)].includes(ee), ne = !(me(g, ee) || me(x, ee) || me(ee, x) || me(N?.portalNode, ee) || oe.some((q) => q === ee || me(q, ee)) || ae.hasMatchingElement((q) => me(q, ee)) || he || O && (Qo(O.nodesRef.current, xe).find((q) => me(q.context?.elements.floating, ee) || me(q.context?.elements.domReference, ee)) || gd(O.nodesRef.current, xe).find((q) => [q.context?.elements.floating, Ra(q.context?.elements.floating)].includes(ee) || q.context?.elements.domReference === ee)));
        if (le === g && X && Jb(X), s && le !== g && !Ri(ue) && Ct(ce) === ce.body) {
          if (Ve(X) && (X.focus(), s === "popup")) {
            z.request(() => {
              X.focus();
            });
            return;
          }
          let q = pe(), Ee = B.current, we = (Ee && q.includes(Ee) ? Ee : null) || q[q.length - 1] || X;
          Ve(we) && we.focus();
        }
        if (y.current.insideReactTree) {
          y.current.insideReactTree = false;
          return;
        }
        (S || !a) && ee && ne && !A.current && (S || ee !== Zb()) && (D.current = true, h.setOpen(false, Q(H.focusOut, Z)));
      });
    }
    function be() {
      _.current || (y.current.insideReactTree = true, L.start(0, () => {
        y.current.insideReactTree = false;
      }));
    }
    let re = Ve(g) ? g : null;
    if (!(!x && !re)) return mo(re && Le(re, "focusout", ge), re && Le(re, "pointerdown", fe), x && Le(x, "focusin", se), x && Le(x, "focusout", ge), x && N && Le(x, "focusout", be, true));
  }, [n, g, x, X, a, O, N, h, l, s, pe, S, R, y, L, j, z, u, f, de]), bo.useEffect(() => {
    if (n || !x || !C) return;
    let ce = Array.from(N?.portalNode?.querySelectorAll(`[${Jn("portal")}]`) || []), se = (O ? gd(O.nodesRef.current, R()) : []).find((le) => xa(le.context?.elements.domReference || null))?.context?.elements.domReference, be = [...[x, ...ce, $.current, K.current, N?.beforeOutsideRef.current, N?.afterOutsideRef.current, ...de()], se, mn(f), mn(u), S ? g : null].filter((le) => le != null), re = Rd(be, { ariaHidden: a || S, mark: false }), Z = [x, ...ce].filter((le) => le != null), ee = Rd(Z);
    return () => {
      ee(), re();
    };
  }, [C, n, g, x, a, N, S, O, R, u, f, de]), W(() => {
    if (!C || n || !Ve(X)) return;
    k.current = "", F.current = "";
    let ce = Te(X), fe = Ct(ce);
    queueMicrotask(() => {
      let se = v.current, ge = typeof se == "function" ? se(w.current || "") : se;
      if (ge === void 0 || ge === false || me(X, fe)) return;
      let re = null, Z = () => (re == null && (re = pe(X)), re[0] || X), ee;
      ge === true || ge === null ? ee = Z() : ee = mn(ge), ee = ee || Z();
      let le = me(X, Ct(ce));
      us(ee, { preventScroll: ee === X, shouldFocus() {
        if (!P.current) return false;
        if (le) return true;
        let ue = Ct(ce);
        return !(ue !== ee && me(X, ue));
      } });
    });
  }, [n, C, X, pe, v, w, P]), W(() => {
    if (n || !X) return;
    let ce = Te(X), fe = Ct(ce), se = w.current == null;
    Xb(fe);
    function ge(re) {
      if (re.open || (k.current = aO(re.nativeEvent, F.current)), re.reason === H.triggerHover && re.nativeEvent.type === "mouseleave" && (D.current = true), re.reason === H.outsidePress) if (re.nested) D.current = false;
      else if (rs(re.nativeEvent) || is(re.nativeEvent)) D.current = false;
      else {
        let Z = false;
        Te(X).createElement("div").focus({ get preventScroll() {
          return Z = true, false;
        } }), Z ? D.current = false : D.current = true;
      }
    }
    b.on("openchange", ge);
    function be(re) {
      let Z = T.current, ee = typeof Z == "function" ? Z(re) : Z;
      if (ee === void 0 || ee === false) return null;
      ee === null && (ee = true);
      let le = g?.isConnected ? g : null, ue = fe?.isConnected && Ht(fe) !== "body" ? fe : null, xe = se ? ue || le : le || ue;
      return xe || (xe = Zb() || null), typeof ee == "boolean" ? xe : mn(ee) || xe || null;
    }
    return () => {
      b.off("openchange", ge);
      let re = Ct(ce), Z = de(), ee = me(x, re) || Z.some((ae) => ae === re || me(ae, re)) || O && Qo(O.nodesRef.current, R(), false).some((ae) => me(ae.context?.elements.floating, re)), le = T.current, ue = k.current, xe = be(ue);
      queueMicrotask(() => {
        let ae = cO(xe), oe = typeof le != "boolean";
        if (le && !D.current && Ve(ae) && (!(!oe && ae !== re && re !== ce.body) || ee)) {
          let he = { preventScroll: true };
          ue === "keyboard" && (he.focusVisible = true), ae.focus(he);
        }
        D.current = false;
      });
    };
  }, [n, x, X, T, w, b, O, g, R, de]), W(() => {
    if (!Je.engine.webkit || C || !x) return;
    let ce = Ct(Te(x));
    !Ve(ce) || !hi(ce) || me(x, ce) && ce.blur();
  }, [C, x]), W(() => {
    if (!(n || !N)) return N.setFocusManagerState({ modal: a, closeOnFocusOut: l, open: C, onOpenChange: h.setOpen, domReference: g }), () => {
      N.setFocusManagerState(null);
    };
  }, [n, N, a, C, h, l, g]), W(() => {
    if (!(n || !X)) return Jb(X), () => {
      queueMicrotask(Ed);
    };
  }, [n, X]);
  let ye = !n && (a ? !S : true) && (J || a);
  return (0, Pa.jsxs)(bo.Fragment, { children: [ye && (0, Pa.jsx)(Xo, { "data-type": "inside", ref: Y, onFocus: (ce) => {
    if (a) {
      let fe = pe();
      us(fe[fe.length - 1]);
    } else N?.portalNode && (D.current = false, Zn(ce, N.portalNode) ? ls(g)?.focus() : mn(f ?? N.beforeOutsideRef)?.focus());
  } }), o, ye && (0, Pa.jsx)(Xo, { "data-type": "inside", ref: te, onFocus: (ce) => {
    a ? us(pe()[0]) : N?.portalNode && (l && (D.current = true), Zn(ce, N.portalNode) ? El(g)?.focus() : mn(u ?? N.afterOutsideRef)?.focus());
  } })] });
}
var Ta = E(M(), 1);
function Uo(e4, t = {}) {
  let { enabled: o = true, event: n = "click", toggle: r = true, ignoreMouse: i = false, stickIfOpen: s = true, touchOpenDelay: a = 0, reason: l = H.triggerPress } = t, c = "rootStore" in e4 ? e4.rootStore : e4, u = c.context.dataRef, f = Ta.useRef(void 0), p = Io(), m = ot(), d = Ta.useMemo(() => {
    function h(g, x, b, y) {
      let R = Q(l, x, b);
      g && y === "touch" && a > 0 ? m.start(a, () => {
        c.setOpen(true, R);
      }) : c.setOpen(g, R);
    }
    function C(g, x, b) {
      let y = u.current.openEvent, R = c.select("domReferenceElement") !== x;
      return g && R || !g || !r ? true : y && s ? !b(y.type) : false;
    }
    return { onPointerDown(g) {
      f.current = Ho(g.pointerType, true) && is(g.nativeEvent) ? "virtual" : g.pointerType;
    }, onMouseDown(g) {
      let x = f.current, b = g.nativeEvent, y = c.select("open");
      if (g.button !== 0 || n === "click" || Ho(x, true) && i) return;
      let R = C(y, g.currentTarget, (v) => v === "click" || v === "mousedown"), I = We(b);
      if (hi(I)) {
        h(R, b, I, x);
        return;
      }
      let S = g.currentTarget;
      p.request(() => {
        h(R, b, S, x);
      });
    }, onClick(g) {
      if (n === "mousedown-only") return;
      let x = f.current;
      if (n === "mousedown" && x) {
        f.current = void 0;
        return;
      }
      if (Ho(x, true) && i) return;
      let b = c.select("open"), y = C(b, g.currentTarget, (R) => R === "click" || R === "mousedown" || R === "keydown" || R === "keyup");
      h(y, g.nativeEvent, g.currentTarget, x);
    }, onKeyDown() {
      f.current = void 0;
    } };
  }, [u, n, i, l, c, s, r, p, m, a]);
  return Ta.useMemo(() => o ? { reference: d } : Me, [o, d]);
}
var Fo = E(M(), 1);
function lO(e4, t) {
  let o = null, n = null, r = false;
  return { contextElement: e4 || void 0, getBoundingClientRect() {
    let i = e4?.getBoundingClientRect() || { width: 0, height: 0, x: 0, y: 0 }, s = t.axis === "x" || t.axis === "both", a = t.axis === "y" || t.axis === "both", l = ["mouseenter", "mousemove"].includes(t.dataRef.current.openEvent?.type || "") && t.pointerType !== "touch", c = i.width, u = i.height, f = i.x, p = i.y;
    return o == null && t.x && s && (o = i.x - t.x), n == null && t.y && a && (n = i.y - t.y), f -= o || 0, p -= n || 0, c = 0, u = 0, !r || l ? (c = t.axis === "y" ? i.width : 0, u = t.axis === "x" ? i.height : 0, f = s && t.x != null ? t.x : f, p = a && t.y != null ? t.y : p) : r && !l && (u = t.axis === "x" ? i.height : u, c = t.axis === "y" ? i.width : c), r = true, { width: c, height: u, x: f, y: p, top: p, right: f + c, bottom: p + u, left: f };
  } };
}
function Qb(e4) {
  return e4 != null && e4.clientX != null;
}
function Id(e4, t = {}) {
  let { enabled: o = true, axis: n = "both" } = t, r = "rootStore" in e4 ? e4.rootStore : e4, i = r.useState("open"), s = r.useState("floatingElement"), a = r.useState("domReferenceElement"), l = r.context.dataRef, c = Fo.useRef(false), u = Fo.useRef(null), [f, p] = Fo.useState(), [m, d] = Fo.useState([]), h = G((y) => {
    r.set("positionReference", y);
  }), C = G((y, R, I) => {
    c.current || l.current.openEvent && !Qb(l.current.openEvent) || r.set("positionReference", lO(I ?? a, { x: y, y: R, axis: n, dataRef: l, pointerType: f }));
  }), g = G((y) => {
    i ? u.current || (C(y.clientX, y.clientY, y.currentTarget), d([])) : C(y.clientX, y.clientY, y.currentTarget);
  }), x = Ho(f) ? s : i;
  Fo.useEffect(() => {
    if (!o) {
      h(a);
      return;
    }
    if (!x) return;
    function y() {
      u.current?.(), u.current = null;
    }
    let R = Be(s);
    function I(S) {
      let v = We(S);
      me(s, v) ? y() : C(S.clientX, S.clientY);
    }
    return !l.current.openEvent || Qb(l.current.openEvent) ? u.current = Le(R, "mousemove", I) : h(a), y;
  }, [x, o, s, l, a, r, C, h, m]), Fo.useEffect(() => () => {
    r.set("positionReference", null);
  }, [r]), Fo.useEffect(() => {
    o && !s && (c.current = false);
  }, [o, s]), Fo.useEffect(() => {
    !o && i && (c.current = true);
  }, [o, i]);
  let b = Fo.useMemo(() => {
    function y(R) {
      p(R.pointerType);
    }
    return { onPointerDown: y, onPointerEnter: y, onMouseMove: g, onMouseEnter: g };
  }, [g]);
  return Fo.useMemo(() => o ? { reference: b, trigger: b } : {}, [o, b]);
}
var Mo = E(M(), 1);
function uO() {
  return false;
}
function fO(e4) {
  return { escapeKey: typeof e4 == "boolean" ? e4 : e4?.escapeKey ?? false, outsidePress: typeof e4 == "boolean" ? e4 : e4?.outsidePress ?? true };
}
function xn(e4, t = {}) {
  let { enabled: o = true, escapeKey: n = true, outsidePress: r = true, outsidePressEvent: i = "sloppy", referencePress: s = uO, bubbles: a, externalTree: l } = t, c = "rootStore" in e4 ? e4.rootStore : e4, u = c.useState("open"), f = c.useState("floatingElement"), { dataRef: p, events: m } = c.context, d = ho(l), h = G(typeof r == "function" ? r : () => false), C = typeof r == "function" ? h : r, g = C !== false, x = G(() => i), { escapeKey: b, outsidePress: y } = fO(a), R = Mo.useRef(false), I = Mo.useRef(false), S = Mo.useRef(false), v = Mo.useRef(false), T = Mo.useRef(false), w = Mo.useRef(""), P = Mo.useRef(null), O = ot(), N = ot(), D = G(() => {
    N.clear(), p.current.insideReactTree = false;
  }), A = G((L) => {
    let j = p.current.floatingContext?.nodeId;
    return (d ? Qo(d.nodesRef.current, j) : []).some((J) => J.context?.open && !J.context.dataRef.current[L]);
  }), _ = G((L) => dl(L, c.select("floatingElement")) || dl(L, c.select("domReferenceElement"))), B = G((L) => {
    s() && c.setOpen(false, Q(H.triggerPress, L.nativeEvent));
  }), k = G((L) => {
    if (!u || !o || !n || L.key !== "Escape" || T.current || !b && A("__escapeKeyBubbles")) return;
    let j = db(L) ? L.nativeEvent : L, z = Q(H.escapeKey, j);
    c.setOpen(false, z), z.isCanceled || L.preventDefault(), !b && !z.isPropagationAllowed && L.stopPropagation();
  }), F = G(() => {
    p.current.insideReactTree = true, N.start(0, D);
  }), $ = G((L) => {
    if (!u || !o || L.button !== 0) return;
    let j = We(L.nativeEvent);
    me(c.select("floatingElement"), j) && (R.current || (R.current = true, I.current = false));
  }), K = G((L) => {
    !u || !o || (L.defaultPrevented || L.nativeEvent.defaultPrevented) && R.current && (I.current = true);
  });
  Mo.useEffect(() => {
    function L(j) {
      j.open || (v.current = false);
    }
    return m.on("openchange", L), () => {
      m.off("openchange", L);
    };
  }, [m]), Mo.useEffect(() => {
    if (!u || !o) return u || (v.current = false), D;
    p.current.__escapeKeyBubbles = b, p.current.__outsidePressBubbles = y;
    let L = new oo(), j = new oo(), z = Te(f);
    function J() {
      L.clear(), T.current = true;
    }
    function X() {
      L.start(Je.engine.webkit ? 5 : 0, () => {
        T.current = false;
      });
    }
    function pe() {
      S.current = true, j.start(0, () => {
        S.current = false;
      });
    }
    function de() {
      R.current = false, I.current = false;
    }
    function ye() {
      let ne = w.current, q = ne === "pen" || !ne ? "mouse" : ne, Ee = x(), we = typeof Ee == "function" ? Ee() : Ee;
      return typeof we == "string" ? we : we[q];
    }
    function ce(ne) {
      let q = ye();
      return q === "intentional" && ne.type !== "click" || q === "sloppy" && ne.type === "click";
    }
    function fe(ne) {
      let q = p.current.floatingContext?.nodeId, Ee = d && Qo(d.nodesRef.current, q).some((we) => dl(ne, we.context?.elements.floating));
      return _(ne) || Ee;
    }
    function se(ne) {
      if (ce(ne)) {
        ne.type !== "click" && !_(ne) && (j.clear(), S.current = false), D();
        return;
      }
      if (p.current.insideReactTree) {
        D();
        return;
      }
      let q = We(ne), Ee = `[${Jn("inert")}]`, we = De(q) ? q.getRootNode() : null, je = Array.from((wn(we) ? we : Te(c.select("floatingElement"))).querySelectorAll(Ee)), et = c.context.triggerElements;
      if (q && (et.hasElement(q) || et.hasMatchingElement((ve) => me(ve, q)))) return;
      let ke = De(q) ? q : null;
      for (; ke && !So(ke); ) {
        let ve = po(ke);
        if (So(ve) || !De(ve)) break;
        ke = ve;
      }
      if (!(je.length && De(q) && !hb(q) && !me(q, c.select("floatingElement")) && je.every((ve) => !me(ke, ve)))) {
        if (Ve(q) && !("touches" in ne)) {
          let ve = So(q), Fe = Ut(q), nt = /auto|scroll/, Vt = ve || nt.test(Fe.overflowX), Ge = ve || nt.test(Fe.overflowY), Ne = Vt && q.clientWidth > 0 && q.scrollWidth > q.clientWidth, mt = Ge && q.clientHeight > 0 && q.scrollHeight > q.clientHeight, tt = Fe.direction === "rtl", Pt = mt && (tt ? ne.offsetX <= q.offsetWidth - q.clientWidth : ne.offsetX > q.clientWidth), _e = Ne && ne.offsetY > q.clientHeight;
          if (Pt || _e) return;
        }
        if (!fe(ne)) {
          if (ye() === "intentional") {
            if (ne.detail !== 0 && !rs(ne) && !v.current) return;
            if (S.current) {
              j.clear(), S.current = false;
              return;
            }
          }
          typeof C == "function" && !C(ne) || A("__outsidePressBubbles") || (c.setOpen(false, Q(H.outsidePress, ne)), D());
        }
      }
    }
    function ge(ne) {
      ye() !== "sloppy" || ne.pointerType === "touch" || !c.select("open") || !o || _(ne) || se(ne);
    }
    function be(ne) {
      if (ye() !== "sloppy" || !c.select("open") || !o || _(ne)) return;
      let q = ne.touches[0];
      q && (P.current = { startTime: Date.now(), startX: q.clientX, startY: q.clientY, dismissOnTouchEnd: false, dismissOnMouseDown: true }, O.start(1e3, () => {
        P.current && (P.current.dismissOnTouchEnd = false, P.current.dismissOnMouseDown = false);
      }));
    }
    function re(ne, q) {
      let Ee = We(ne);
      if (!Ee) return;
      let we = Le(Ee, ne.type, () => {
        q(ne), we();
      });
    }
    function Z(ne) {
      w.current = "touch", re(ne, be);
    }
    function ee(ne) {
      O.clear(), ne.type === "pointerdown" && (ne.button === 0 && (v.current = true), w.current = ne.pointerType), !(ne.type === "mousedown" && P.current && !P.current.dismissOnMouseDown) && re(ne, (q) => {
        q.type === "pointerdown" ? ge(q) : se(q);
      });
    }
    function le(ne) {
      if (ne.type === "pointercancel" && (v.current = false), !R.current) return;
      let q = I.current;
      if (de(), ye() === "intentional") {
        if (ne.type === "pointercancel") {
          q && pe();
          return;
        }
        if (!fe(ne)) {
          if (q) {
            pe();
            return;
          }
          typeof C == "function" && !C(ne) || (j.clear(), S.current = true, D());
        }
      }
    }
    function ue(ne) {
      if (ye() !== "sloppy" || !P.current || _(ne)) return;
      let q = ne.touches[0];
      if (!q) return;
      let Ee = Math.abs(q.clientX - P.current.startX), we = Math.abs(q.clientY - P.current.startY), je = Math.sqrt(Ee * Ee + we * we);
      je > 5 && (P.current.dismissOnTouchEnd = true), je > 10 && (se(ne), O.clear(), P.current = null);
    }
    function xe(ne) {
      re(ne, ue);
    }
    function ae(ne) {
      ye() !== "sloppy" || !P.current || _(ne) || (P.current.dismissOnTouchEnd && se(ne), O.clear(), P.current = null);
    }
    function oe(ne) {
      re(ne, ae);
    }
    let he = mo(n && mo(Le(z, "keydown", k), Le(z, "compositionstart", J), Le(z, "compositionend", X)), g && mo(Le(z, "click", ee, true), Le(z, "pointerdown", ee, true), Le(z, "pointerup", le, true), Le(z, "pointercancel", le, true), Le(z, "mousedown", ee, true), Le(z, "mouseup", le, true), Le(z, "touchstart", Z, { capture: true, passive: true }), Le(z, "touchmove", xe, { capture: true, passive: true }), Le(z, "touchend", oe, { capture: true, passive: true })));
    return () => {
      he(), L.clear(), j.clear(), de(), S.current = false, D();
    };
  }, [p, f, n, g, C, u, o, b, y, k, D, x, A, _, d, c, O]);
  let Y = Mo.useMemo(() => ({ onKeyDown: k, onPointerDown: B, onClick: B }), [k, B]), te = Mo.useMemo(() => ({ onKeyDown: k, onPointerDown: K, onMouseDown: K, onClickCapture: F, onMouseDownCapture(L) {
    F(), $(L);
  }, onPointerDownCapture(L) {
    F(), $(L);
  }, onMouseUpCapture: F, onTouchEndCapture: F, onTouchMoveCapture: F }), [k, F, $, K]);
  return Mo.useMemo(() => o ? { reference: Y, floating: te, trigger: Y } : {}, [o, Y, te]);
}
var Co = E(M(), 1);
function ex(e4, t, o) {
  let { reference: n, floating: r } = e4, i = ko(t), s = va(t), a = ya(s), l = go(t), c = i === "y", u = n.x + n.width / 2 - r.width / 2, f = n.y + n.height / 2 - r.height / 2, p = n[a] / 2 - r[a] / 2, m;
  switch (l) {
    case "top":
      m = { x: u, y: n.y - r.height };
      break;
    case "bottom":
      m = { x: u, y: n.y + n.height };
      break;
    case "right":
      m = { x: n.x + n.width, y: f };
      break;
    case "left":
      m = { x: n.x - r.width, y: f };
      break;
    default:
      m = { x: n.x, y: n.y };
  }
  let d = Zo(t);
  return d && (m[s] += p * (d === "end" ? 1 : -1) * (o && c ? -1 : 1)), m;
}
async function tx(e4, t) {
  var o;
  t === void 0 && (t = {});
  let { x: n, y: r, platform: i, rects: s, elements: a, strategy: l } = e4, { boundary: c = "clippingAncestors", rootBoundary: u = "viewport", elementContext: f = "floating", altBoundary: p = false, padding: m = 0 } = An(t, e4), d = Cl(m), C = a[p ? f === "floating" ? "reference" : "floating" : f], g = bi(await i.getClippingRect({ element: (o = await (i.isElement == null ? void 0 : i.isElement(C))) == null || o ? C : C.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(a.floating)), boundary: c, rootBoundary: u, strategy: l })), x = f === "floating" ? { x: n, y: r, width: s.floating.width, height: s.floating.height } : s.reference, b = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(a.floating)), y = await (i.isElement == null ? void 0 : i.isElement(b)) && await (i.getScale == null ? void 0 : i.getScale(b)) || { x: 1, y: 1 }, R = bi(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({ elements: a, rect: x, offsetParent: b, strategy: l }) : x);
  return { top: (g.top - R.top + d.top) / y.y, bottom: (R.bottom - g.bottom + d.bottom) / y.y, left: (g.left - R.left + d.left) / y.x, right: (R.right - g.right + d.right) / y.x };
}
var pO = 50;
var ox = async (e4, t, o) => {
  let { placement: n = "bottom", strategy: r = "absolute", middleware: i = [], platform: s } = o, a = s.detectOverflow ? s : { ...s, detectOverflow: tx }, l = await (s.isRTL == null ? void 0 : s.isRTL(t)), c = await s.getElementRects({ reference: e4, floating: t, strategy: r }), { x: u, y: f } = ex(c, n, l), p = n, m = 0, d = {};
  for (let h = 0; h < i.length; h++) {
    let C = i[h];
    if (!C) continue;
    let { name: g, fn: x } = C, { x: b, y, data: R, reset: I } = await x({ x: u, y: f, initialPlacement: n, placement: p, strategy: r, middlewareData: d, rects: c, platform: a, elements: { reference: e4, floating: t } });
    u = b ?? u, f = y ?? f, d[g] = { ...d[g], ...R }, I && m < pO && (m++, typeof I == "object" && (I.placement && (p = I.placement), I.rects && (c = I.rects === true ? await s.getElementRects({ reference: e4, floating: t, strategy: r }) : I.rects), { x: u, y: f } = ex(c, p, l)), h = -1);
  }
  return { x: u, y: f, placement: p, strategy: r, middlewareData: d };
};
var nx = function(e4) {
  return e4 === void 0 && (e4 = {}), { name: "flip", options: e4, async fn(t) {
    var o, n;
    let { placement: r, middlewareData: i, rects: s, initialPlacement: a, platform: l, elements: c } = t, { mainAxis: u = true, crossAxis: f = true, fallbackPlacements: p, fallbackStrategy: m = "bestFit", fallbackAxisSideDirection: d = "none", flipAlignment: h = true, ...C } = An(e4, t);
    if ((o = i.arrow) != null && o.alignmentOffset) return {};
    let g = go(r), x = ko(a), b = go(a) === a, y = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), R = p || (b || !h ? [Ca(a)] : Sb(a)), I = d !== "none";
    !p && I && R.push(...Pb(a, h, d, y));
    let S = [a, ...R], v = await l.detectOverflow(t, C), T = [], w = ((n = i.flip) == null ? void 0 : n.overflows) || [];
    if (u && T.push(v[g]), f) {
      let D = Ib(r, s, y);
      T.push(v[D[0]], v[D[1]]);
    }
    if (w = [...w, { placement: r, overflows: T }], !T.every((D) => D <= 0)) {
      var P, O;
      let D = (((P = i.flip) == null ? void 0 : P.index) || 0) + 1, A = S[D];
      if (A && (!(f === "alignment" ? x !== ko(A) : false) || w.every((k) => ko(k.placement) === x ? k.overflows[0] > 0 : true))) return { data: { index: D, overflows: w }, reset: { placement: A } };
      let _ = (O = w.filter((B) => B.overflows[0] <= 0).sort((B, k) => B.overflows[1] - k.overflows[1])[0]) == null ? void 0 : O.placement;
      if (!_) switch (m) {
        case "bestFit": {
          var N;
          let B = (N = w.filter((k) => {
            if (I) {
              let F = ko(k.placement);
              return F === x || F === "y";
            }
            return true;
          }).map((k) => [k.placement, k.overflows.filter((F) => F > 0).reduce((F, $) => F + $, 0)]).sort((k, F) => k[1] - F[1])[0]) == null ? void 0 : N[0];
          B && (_ = B);
          break;
        }
        case "initialPlacement":
          _ = a;
          break;
      }
      if (r !== _) return { reset: { placement: _ } };
    }
    return {};
  } };
};
var rx = /* @__PURE__ */ new Set(["left", "top"]);
async function dO(e4, t) {
  let { placement: o, platform: n, elements: r } = e4, i = await (n.isRTL == null ? void 0 : n.isRTL(r.floating)), s = go(o), a = Zo(o), l = ko(o) === "y", c = rx.has(s) ? -1 : 1, u = i && l ? -1 : 1, f = An(t, e4), { mainAxis: p, crossAxis: m, alignmentAxis: d } = typeof f == "number" ? { mainAxis: f, crossAxis: 0, alignmentAxis: null } : { mainAxis: f.mainAxis || 0, crossAxis: f.crossAxis || 0, alignmentAxis: f.alignmentAxis };
  return a && typeof d == "number" && (m = a === "end" ? d * -1 : d), l ? { x: m * u, y: p * c } : { x: p * c, y: m * u };
}
var ix = function(e4) {
  return e4 === void 0 && (e4 = 0), { name: "offset", options: e4, async fn(t) {
    var o, n;
    let { x: r, y: i, placement: s, middlewareData: a } = t, l = await dO(t, e4);
    return s === ((o = a.offset) == null ? void 0 : o.placement) && (n = a.arrow) != null && n.alignmentOffset ? {} : { x: r + l.x, y: i + l.y, data: { ...l, placement: s } };
  } };
};
var sx = function(e4) {
  return e4 === void 0 && (e4 = {}), { name: "shift", options: e4, async fn(t) {
    let { x: o, y: n, placement: r, platform: i } = t, { mainAxis: s = true, crossAxis: a = false, limiter: l = { fn: (x) => {
      let { x: b, y } = x;
      return { x: b, y };
    } }, ...c } = An(e4, t), u = { x: o, y: n }, f = await i.detectOverflow(t, c), p = ko(r), m = Rl(p), d = u[m], h = u[p], C = (x, b) => xl(b + f[x === "y" ? "top" : "left"], b, b - f[x === "y" ? "bottom" : "right"]);
    s && (d = C(m, d)), a && (h = C(p, h));
    let g = l.fn({ ...t, [m]: d, [p]: h });
    return { ...g, data: { x: g.x - o, y: g.y - n, enabled: { [m]: s, [p]: a } } };
  } };
};
var ax = function(e4) {
  return e4 === void 0 && (e4 = {}), { options: e4, fn(t) {
    var o, n;
    let { x: r, y: i, placement: s, rects: a, middlewareData: l } = t, { offset: c = 0, mainAxis: u = true, crossAxis: f = true } = An(e4, t), p = { x: r, y: i }, m = ko(s), d = Rl(m), h = p[d], C = p[m], g = An(c, t), x = typeof g == "number" ? { mainAxis: g, crossAxis: 0 } : { mainAxis: (o = g.mainAxis) != null ? o : 0, crossAxis: (n = g.crossAxis) != null ? n : 0 };
    if (u) {
      let R = d === "y" ? "height" : "width", I = a.reference[d] - a.floating[R] + x.mainAxis, S = a.reference[d] + a.reference[R] - x.mainAxis;
      h < I ? h = I : h > S && (h = S);
    }
    if (f) {
      var b, y;
      let R = d === "y" ? "width" : "height", I = rx.has(go(s)), S = a.reference[m] - a.floating[R] + (I && ((b = l.offset) == null ? void 0 : b[m]) || 0) + (I ? 0 : x.crossAxis), v = a.reference[m] + a.reference[R] + (I ? 0 : ((y = l.offset) == null ? void 0 : y[m]) || 0) - (I ? x.crossAxis : 0);
      C < S ? C = S : C > v && (C = v);
    }
    return { [d]: h, [m]: C };
  } };
};
var cx = function(e4) {
  return e4 === void 0 && (e4 = {}), { name: "size", options: e4, async fn(t) {
    let { placement: o, rects: n, platform: r, elements: i } = t, { apply: s = () => {
    }, ...a } = An(e4, t), l = await r.detectOverflow(t, a), c = go(o), u = Zo(o), f = ko(o) === "y", { width: p, height: m } = n.floating, d, h;
    c === "top" || c === "bottom" ? (d = c, h = u === (await (r.isRTL == null ? void 0 : r.isRTL(i.floating)) ? "start" : "end") ? "left" : "right") : (h = c, d = u === "end" ? "top" : "bottom");
    let C = m - l.top - l.bottom, g = p - l.left - l.right, x = Rr(m - l[d], C), b = Rr(p - l[h], g), y = t.middlewareData.shift, R = !y, I = x, S = b;
    y != null && y.enabled.x && (S = g), y != null && y.enabled.y && (I = C), R && !u && (f ? S = p - 2 * hn(l.left, l.right) : I = m - 2 * hn(l.top, l.bottom)), await s({ ...t, availableWidth: S, availableHeight: I });
    let v = await r.getDimensions(i.floating);
    return p !== v.width || m !== v.height ? { reset: { rects: true } } : {};
  } };
};
function fx(e4) {
  let t = Ut(e4), o = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0, r = Ve(e4), i = r ? e4.offsetWidth : o, s = r ? e4.offsetHeight : n, a = Cr(o) !== i || Cr(n) !== s;
  return a && (o = i, n = s), { width: o, height: n, $: a };
}
function Pd(e4) {
  return De(e4) ? e4 : e4.contextElement;
}
function ds(e4) {
  let t = Pd(e4);
  if (!Ve(t)) return Dn(1);
  let o = t.getBoundingClientRect(), { width: n, height: r, $: i } = fx(t), s = (i ? Cr(o.width) : o.width) / n, a = (i ? Cr(o.height) : o.height) / r;
  return (!s || !Number.isFinite(s)) && (s = 1), (!a || !Number.isFinite(a)) && (a = 1), { x: s, y: a };
}
var mO = Dn(0);
function px(e4) {
  let t = Be(e4);
  return !rl() || !t.visualViewport ? mO : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
}
function gO(e4, t, o) {
  return t === void 0 && (t = false), !!o && t && o === Be(e4);
}
function vi(e4, t, o, n) {
  t === void 0 && (t = false), o === void 0 && (o = false);
  let r = e4.getBoundingClientRect(), i = Pd(e4), s = Dn(1);
  t && (n ? De(n) && (s = ds(n)) : s = ds(e4));
  let a = gO(i, o, n) ? px(i) : Dn(0), l = (r.left + a.x) / s.x, c = (r.top + a.y) / s.y, u = r.width / s.x, f = r.height / s.y;
  if (i && n) {
    let p = Be(i), m = De(n) ? Be(n) : n, d = p, h = il(d);
    for (; h && m !== d; ) {
      let C = ds(h), g = h.getBoundingClientRect(), x = Ut(h), b = g.left + (h.clientLeft + parseFloat(x.paddingLeft)) * C.x, y = g.top + (h.clientTop + parseFloat(x.paddingTop)) * C.y;
      l *= C.x, c *= C.y, u *= C.x, f *= C.y, l += b, c += y, d = Be(h), h = il(d);
    }
  }
  return bi({ width: u, height: f, x: l, y: c });
}
function wl(e4, t) {
  let o = fa(e4).scrollLeft;
  return t ? t.left + o : vi(On(e4)).left + o;
}
function dx(e4, t) {
  let o = e4.getBoundingClientRect(), n = o.left + t.scrollLeft - wl(e4, o), r = o.top + t.scrollTop;
  return { x: n, y: r };
}
function hO(e4) {
  let { elements: t, rect: o, offsetParent: n, strategy: r } = e4, i = r === "fixed", s = On(n), a = t ? ua(t.floating) : false;
  if (n === s || a && i) return o;
  let l = { scrollLeft: 0, scrollTop: 0 }, c = Dn(1), u = Dn(0), f = Ve(n);
  if ((f || !i) && ((Ht(n) !== "body" || ui(s)) && (l = fa(n)), f)) {
    let m = vi(n);
    c = ds(n), u.x = m.x + n.clientLeft, u.y = m.y + n.clientTop;
  }
  let p = s && !f && !i ? dx(s, l) : Dn(0);
  return { width: o.width * c.x, height: o.height * c.y, x: o.x * c.x - l.scrollLeft * c.x + u.x + p.x, y: o.y * c.y - l.scrollTop * c.y + u.y + p.y };
}
function bO(e4) {
  return e4.getClientRects ? Array.from(e4.getClientRects()) : [];
}
function xO(e4) {
  let t = fa(e4), o = e4.ownerDocument.body, n = hn(e4.scrollWidth, e4.clientWidth, o.scrollWidth, o.clientWidth), r = hn(e4.scrollHeight, e4.clientHeight, o.scrollHeight, o.clientHeight), i = -t.scrollLeft + wl(e4), s = -t.scrollTop;
  return Ut(o).direction === "rtl" && (i += hn(e4.clientWidth, o.clientWidth) - n), { width: n, height: r, x: i, y: s };
}
var RO = 25;
function CO(e4, t, o) {
  o === void 0 && (o = "viewport");
  let n = o === "layoutViewport", r = Be(e4), i = On(e4), s = r.visualViewport, a = i.clientWidth, l = i.clientHeight, c = 0, u = 0;
  if (s) {
    let p = !rl() || t === "fixed";
    n ? p || (c = -s.offsetLeft, u = -s.offsetTop) : (a = s.width, l = s.height, p && (c = s.offsetLeft, u = s.offsetTop));
  }
  if (wl(i) <= 0) {
    let p = i.ownerDocument, m = p.body, d = getComputedStyle(m), h = p.compatMode === "CSS1Compat" && parseFloat(d.marginLeft) + parseFloat(d.marginRight) || 0, C = Math.abs(i.clientWidth - m.clientWidth - h), g = getComputedStyle(i).scrollbarGutter === "stable both-edges" ? C / 2 : C;
    g <= RO && (a -= g);
  }
  return { width: a, height: l, x: c, y: u };
}
function yO(e4, t) {
  let o = vi(e4, true, t === "fixed"), n = o.top + e4.clientTop, r = o.left + e4.clientLeft, i = ds(e4), s = e4.clientWidth * i.x, a = e4.clientHeight * i.y, l = r * i.x, c = n * i.y;
  return { width: s, height: a, x: l, y: c };
}
function lx(e4, t, o) {
  let n;
  if (t === "viewport" || t === "layoutViewport") n = CO(e4, o, t);
  else if (t === "document") n = xO(On(e4));
  else if (De(t)) n = yO(t, o);
  else {
    let r = px(e4);
    n = { x: t.x - r.x, y: t.y - r.y, width: t.width, height: t.height };
  }
  return bi(n);
}
function vO(e4, t) {
  let o = t.get(e4);
  if (o) return o;
  let n = dn(e4, [], false).filter((a) => De(a) && Ht(a) !== "body"), r = null, i = Ut(e4).position === "fixed", s = i ? po(e4) : e4;
  for (; De(s) && !So(s); ) {
    let a = Ut(s), l = nl(s), c = r ? r.position : i ? "fixed" : "";
    !l && (c === "fixed" || c === "absolute" && a.position === "static") ? n = n.filter((f) => f !== s) : r = a, s = po(s);
  }
  return t.set(e4, n), n;
}
function EO(e4) {
  let { element: t, boundary: o, rootBoundary: n, strategy: r } = e4, s = [...o === "clippingAncestors" ? ua(t) ? [] : vO(t, this._c) : [].concat(o), n], a = lx(t, s[0], r), l = a.top, c = a.right, u = a.bottom, f = a.left;
  for (let p = 1; p < s.length; p++) {
    let m = lx(t, s[p], r);
    l = hn(m.top, l), c = Rr(m.right, c), u = Rr(m.bottom, u), f = hn(m.left, f);
  }
  return { width: c - f, height: u - l, x: f, y: l };
}
function IO(e4) {
  let { width: t, height: o } = fx(e4);
  return { width: t, height: o };
}
function SO(e4, t, o) {
  let n = Ve(t), r = On(t), i = o === "fixed", s = vi(e4, true, i, t), a = { scrollLeft: 0, scrollTop: 0 }, l = Dn(0);
  if ((n || !i) && ((Ht(t) !== "body" || ui(r)) && (a = fa(t)), n)) {
    let p = vi(t, true, i, t);
    l.x = p.x + t.clientLeft, l.y = p.y + t.clientTop;
  }
  !n && r && (l.x = wl(r));
  let c = r && !n && !i ? dx(r, a) : Dn(0), u = s.left + a.scrollLeft - l.x - c.x, f = s.top + a.scrollTop - l.y - c.y;
  return { x: u, y: f, width: s.width, height: s.height };
}
function Sd(e4) {
  return Ut(e4).position === "static";
}
function ux(e4, t) {
  if (!Ve(e4) || Ut(e4).position === "fixed") return null;
  if (t) return t(e4);
  let o = e4.offsetParent;
  return On(e4) === o && (o = o.ownerDocument.body), o;
}
function mx(e4, t) {
  let o = Be(e4);
  if (ua(e4)) return o;
  if (!Ve(e4)) {
    let r = po(e4);
    for (; r && !So(r); ) {
      if (De(r) && !Sd(r)) return r;
      r = po(r);
    }
    return o;
  }
  let n = ux(e4, t);
  for (; n && Kh(n) && Sd(n); ) n = ux(n, t);
  return n && So(n) && Sd(n) && !nl(n) ? o : n || Yh(e4) || o;
}
var PO = async function(e4) {
  let t = this.getOffsetParent || mx, o = this.getDimensions, n = await o(e4.floating);
  return { reference: SO(e4.reference, await t(e4.floating), e4.strategy), floating: { x: 0, y: 0, width: n.width, height: n.height } };
};
function TO(e4) {
  return Ut(e4).direction === "rtl";
}
var Td = { convertOffsetParentRelativeRectToViewportRelativeRect: hO, getDocumentElement: On, getClippingRect: EO, getOffsetParent: mx, getElementRects: PO, getClientRects: bO, getDimensions: IO, getScale: ds, isElement: De, isRTL: TO };
function gx(e4, t) {
  return e4.x === t.x && e4.y === t.y && e4.width === t.width && e4.height === t.height;
}
function wO(e4, t, o) {
  let n = null, r, i = On(e4);
  function s() {
    var u;
    clearTimeout(r), (u = n) == null || u.disconnect(), n = null;
  }
  function a(u, f) {
    u === void 0 && (u = false), f === void 0 && (f = 1), s();
    let p = e4.getBoundingClientRect(), { left: m, top: d, width: h, height: C } = p;
    if (u || t(), !h || !C) return;
    let g = Xn(d), x = Xn(i.clientWidth - (m + h)), b = Xn(i.clientHeight - (d + C)), y = Xn(m), I = { rootMargin: -g + "px " + -x + "px " + -b + "px " + -y + "px", threshold: hn(0, Rr(1, f)) || 1 }, S = true;
    function v(T) {
      let w = T[0].intersectionRatio;
      if (!gx(p, e4.getBoundingClientRect())) return a();
      if (w !== f) {
        if (!S) return a();
        w ? a(false, w) : r = setTimeout(() => {
          a(false, 1e-7);
        }, 1e3);
      }
      S = false;
    }
    try {
      n = new IntersectionObserver(v, { ...I, root: i.ownerDocument });
    } catch {
      n = new IntersectionObserver(v, I);
    }
    n.observe(e4);
  }
  let l = Be(e4), c = () => a(o);
  return l.addEventListener("resize", c), a(true), () => {
    l.removeEventListener("resize", c), s();
  };
}
function wa(e4, t, o, n) {
  n === void 0 && (n = {});
  let { ancestorScroll: r = true, ancestorResize: i = true, elementResize: s = typeof ResizeObserver == "function", layoutShift: a = typeof IntersectionObserver == "function", animationFrame: l = false } = n, c = Pd(e4), u = r || i ? [...c ? dn(c) : [], ...t ? dn(t) : []] : [];
  u.forEach((g) => {
    r && g.addEventListener("scroll", o), i && g.addEventListener("resize", o);
  });
  let f = c && a ? wO(c, o, i) : null, p = -1, m = null;
  s && (m = new ResizeObserver((g) => {
    let [x] = g;
    x && x.target === c && m && t && (m.unobserve(t), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var b;
      (b = m) == null || b.observe(t);
    })), o();
  }), c && !l && m.observe(c), t && m.observe(t));
  let d, h = l ? vi(e4) : null;
  l && C();
  function C() {
    let g = vi(e4);
    h && !gx(h, g) && o(), h = g, d = requestAnimationFrame(C);
  }
  return o(), () => {
    var g;
    u.forEach((x) => {
      r && x.removeEventListener("scroll", o), i && x.removeEventListener("resize", o);
    }), f?.(), (g = m) == null || g.disconnect(), m = null, l && cancelAnimationFrame(d);
  };
}
var hx = ix;
var bx = sx;
var xx = nx;
var Rx = cx;
var Cx = ax;
var Ol = (e4, t, o) => {
  let n = /* @__PURE__ */ new Map(), r = o ?? {}, i = { ...Td, ...r.platform, _c: n };
  return ox(e4, t, { ...r, platform: i });
};
var qt = E(M(), 1);
var vx = E(M(), 1);
var Ex = E(Ko(), 1);
var MO = typeof document < "u";
var NO = function() {
};
var Ml = MO ? vx.useLayoutEffect : NO;
function Nl(e4, t) {
  if (e4 === t) return true;
  if (typeof e4 != typeof t) return false;
  if (typeof e4 == "function" && e4.toString() === t.toString()) return true;
  let o, n, r;
  if (e4 && t && typeof e4 == "object") {
    if (Array.isArray(e4)) {
      if (o = e4.length, o !== t.length) return false;
      for (n = o; n-- !== 0; ) if (!Nl(e4[n], t[n])) return false;
      return true;
    }
    if (r = Object.keys(e4), o = r.length, o !== Object.keys(t).length) return false;
    for (n = o; n-- !== 0; ) if (!{}.hasOwnProperty.call(t, r[n])) return false;
    for (n = o; n-- !== 0; ) {
      let i = r[n];
      if (!(i === "_owner" && e4.$$typeof) && !Nl(e4[i], t[i])) return false;
    }
    return true;
  }
  return e4 !== e4 && t !== t;
}
function Ix(e4) {
  return typeof window > "u" ? 1 : (e4.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function yx(e4, t) {
  let o = Ix(e4);
  return Math.round(t * o) / o;
}
function wd(e4) {
  let t = qt.useRef(e4);
  return Ml(() => {
    t.current = e4;
  }), t;
}
function Sx(e4) {
  e4 === void 0 && (e4 = {});
  let { placement: t = "bottom", strategy: o = "absolute", middleware: n = [], platform: r, elements: { reference: i, floating: s } = {}, transform: a = true, whileElementsMounted: l, open: c } = e4, [u, f] = qt.useState({ x: 0, y: 0, strategy: o, placement: t, middlewareData: {}, isPositioned: false }), [p, m] = qt.useState(n);
  Nl(p, n) || m(n);
  let [d, h] = qt.useState(null), [C, g] = qt.useState(null), x = qt.useCallback((k) => {
    k !== I.current && (I.current = k, h(k));
  }, []), b = qt.useCallback((k) => {
    k !== S.current && (S.current = k, g(k));
  }, []), y = i || d, R = s || C, I = qt.useRef(null), S = qt.useRef(null), v = qt.useRef(u), T = l != null, w = wd(l), P = wd(r), O = wd(c), N = qt.useCallback(() => {
    if (!I.current || !S.current) return;
    let k = { placement: t, strategy: o, middleware: p };
    P.current && (k.platform = P.current), Ol(I.current, S.current, k).then((F) => {
      let $ = { ...F, isPositioned: O.current !== false };
      D.current && !Nl(v.current, $) && (v.current = $, Ex.flushSync(() => {
        f($);
      }));
    });
  }, [p, t, o, P, O]);
  Ml(() => {
    c === false && v.current.isPositioned && (v.current.isPositioned = false, f((k) => ({ ...k, isPositioned: false })));
  }, [c]);
  let D = qt.useRef(false);
  Ml(() => (D.current = true, () => {
    D.current = false;
  }), []), Ml(() => {
    if (y && (I.current = y), R && (S.current = R), y && R) {
      if (w.current) return w.current(y, R, N);
      N();
    }
  }, [y, R, N, w, T]);
  let A = qt.useMemo(() => ({ reference: I, floating: S, setReference: x, setFloating: b }), [x, b]), _ = qt.useMemo(() => ({ reference: y, floating: R }), [y, R]), B = qt.useMemo(() => {
    let k = { position: o, left: 0, top: 0 };
    if (!_.floating) return k;
    let F = yx(_.floating, u.x), $ = yx(_.floating, u.y);
    return a ? { ...k, transform: "translate(" + F + "px, " + $ + "px)", ...Ix(_.floating) >= 1.5 && { willChange: "transform" } } : { position: o, left: F, top: $ };
  }, [o, a, _.floating, u.x, u.y]);
  return qt.useMemo(() => ({ ...u, update: N, refs: A, elements: _, floatingStyles: B }), [u, N, A, _, B]);
}
var Od = (e4, t) => {
  let o = hx(e4);
  return { name: o.name, fn: o.fn, options: [e4, t] };
};
var Md = (e4, t) => {
  let o = bx(e4);
  return { name: o.name, fn: o.fn, options: [e4, t] };
};
var Nd = (e4, t) => ({ fn: Cx(e4).fn, options: [e4, t] });
var Dd = (e4, t) => {
  let o = xx(e4);
  return { name: o.name, fn: o.fn, options: [e4, t] };
};
var Ad = (e4, t) => {
  let o = Rx(e4);
  return { name: o.name, fn: o.fn, options: [e4, t] };
};
var kn = class {
  attachedStores = [];
  attachedStoreValue = null;
  storeListeners = /* @__PURE__ */ new Set();
  constructor(t, o, n = true) {
    this.fallbackStore = t, this.componentName = o, this.throwOnMissingTrigger = n;
  }
  get attachedStore() {
    return this.attachedStoreValue;
  }
  get store() {
    return this.attachedStoreValue ?? this.fallbackStore;
  }
  get serverStore() {
    return this.fallbackStore;
  }
  subscribeStore(t) {
    return this.storeListeners.add(t), () => {
      this.storeListeners.delete(t);
    };
  }
  attachStore(t) {
    return this.attachedStores.push(t), this.setActiveStore(t), () => {
      let o = this.attachedStores.lastIndexOf(t);
      o !== -1 && this.attachedStores.splice(o, 1), this.setActiveStore(this.attachedStores[this.attachedStores.length - 1] ?? null);
    };
  }
  setActiveStore(t) {
    this.attachedStoreValue !== t && (this.attachedStoreValue = t, this.storeListeners.forEach((o) => {
      o();
    }));
  }
  openByTrigger(t) {
    let o = this.attachedStore;
    if (o === null) return;
    let n;
    if (t) {
      for (let r = this.attachedStores.length - 1; r >= 0 && !n; r -= 1) n = this.attachedStores[r].context.triggerElements.getById(t);
      n ??= this.fallbackStore.context.triggerElements.getById(t);
    }
    if (t && !n && this.throwOnMissingTrigger) throw new Error(Re(99, this.componentName, t, this.componentName));
    o.setOpen(true, Q(H.imperativeAction, void 0, n));
  }
  closePopup() {
    let t = this.attachedStore;
    t !== null && t.setOpen(false, Q(H.imperativeAction));
  }
};
var _d = E(M(), 1);
var Ux = E(Ko(), 1);
var Bx = E(M(), 1);
var Vx = E(M(), 1);
var Ld = E(Oa(), 1);
var Lx = E(Dx(), 1);
var Ax = E(M(), 1);
var Fd = [];
var Vd;
function kx() {
  return Vd;
}
function Fx(e4) {
  Fd.push(e4);
}
function tr(e4) {
  let t = (o, n) => {
    let r = qe(qO).current, i;
    try {
      Vd = r;
      for (let s of Fd) s.before(r);
      i = e4(o, n);
      for (let s of Fd) s.after(r);
      r.didInitialize = true;
    } finally {
      Vd = void 0;
    }
    return i;
  };
  return t.displayName = e4.displayName || e4.name, t;
}
function Ir(e4) {
  return Ax.forwardRef(tr(e4));
}
function qO() {
  return { didInitialize: false };
}
var XO = Zi(19);
var ZO = XO ? QO : eM;
function Al(e4, t, o, n, r) {
  return ZO(e4, t, o, n, r);
}
function JO(e4, t, o, n, r) {
  let i = Vx.useCallback(() => t(e4.getSnapshot(), o, n, r), [e4, t, o, n, r]);
  return (0, Ld.useSyncExternalStore)(e4.subscribe, i, i);
}
Fx({ before(e4) {
  e4.syncIndex = 0, e4.didInitialize || (e4.syncTick = 1, e4.syncHooks = [], e4.didChangeStore = true, e4.getSnapshot = () => {
    let t = false;
    for (let o = 0; o < e4.syncHooks.length; o += 1) {
      let n = e4.syncHooks[o], r = n.selector(n.store.state, n.a1, n.a2, n.a3);
      Object.is(n.value, r) || (t = true, n.value = r);
    }
    return t && (e4.syncTick += 1), e4.syncTick;
  });
}, after(e4) {
  e4.syncHooks.length > 0 && (e4.didChangeStore && (e4.didChangeStore = false, e4.subscribe = (t) => {
    let o = /* @__PURE__ */ new Set();
    for (let r of e4.syncHooks) o.add(r.store);
    let n = [];
    for (let r of o) n.push(r.subscribe(t));
    return () => {
      for (let r of n) r();
    };
  }), (0, Ld.useSyncExternalStore)(e4.subscribe, e4.getSnapshot, e4.getSnapshot));
} });
function QO(e4, t, o, n, r) {
  let i = kx();
  if (!i) return JO(e4, t, o, n, r);
  let s = i.syncIndex;
  i.syncIndex += 1;
  let a;
  return i.didInitialize ? (a = i.syncHooks[s], (a.store !== e4 || a.selector !== t || !Object.is(a.a1, o) || !Object.is(a.a2, n) || !Object.is(a.a3, r)) && (a.store !== e4 && (i.didChangeStore = true), a.store = e4, a.selector = t, a.a1 = o, a.a2 = n, a.a3 = r, a.value = t(e4.getSnapshot(), o, n, r))) : (a = { store: e4, selector: t, a1: o, a2: n, a3: r, value: t(e4.getSnapshot(), o, n, r) }, i.syncHooks.push(a)), a.value;
}
function eM(e4, t, o, n, r) {
  return (0, Lx.useSyncExternalStoreWithSelector)(e4.subscribe, e4.getSnapshot, e4.getSnapshot, (i) => t(i, o, n, r));
}
var kl = class {
  static create(t) {
    return new this(t);
  }
  constructor(t) {
    this.state = t, this.listeners = /* @__PURE__ */ new Set(), this.updateTick = 0;
  }
  subscribe = (t) => (this.listeners.add(t), () => {
    this.listeners.delete(t);
  });
  getSnapshot = () => this.state;
  setState(t) {
    if (this.state === t) return;
    this.state = t, this.updateTick += 1;
    let o = this.updateTick;
    for (let n of this.listeners) {
      if (o !== this.updateTick) return;
      n(t);
    }
  }
  update(t) {
    for (let o in t) if (!Object.is(this.state[o], t[o])) {
      this.setState({ ...this.state, ...t });
      return;
    }
  }
  set(t, o) {
    Object.is(this.state[t], o) || this.setState({ ...this.state, [t]: o });
  }
  notifyAll() {
    let t = { ...this.state };
    this.setState(t);
  }
  use(t, o, n, r) {
    return Al(this, t, o, n, r);
  }
};
var Ei = E(M(), 1);
var xo = class extends kl {
  constructor(t, o = {}, n) {
    super(t), this.context = o, this.selectors = n;
  }
  useSyncedValue(t, o) {
    Ei.useDebugValue(t);
    let n = this;
    W(() => {
      n.state[t] !== o && n.set(t, o);
    }, [n, t, o]);
  }
  useSyncedValueWithCleanup(t, o) {
    let n = this;
    W(() => (n.state[t] !== o && n.set(t, o), () => {
      n.set(t, void 0);
    }), [n, t, o]);
  }
  useSyncedValues(t) {
    let o = this, n = Object.values(t);
    W(() => {
      o.update(t);
    }, [o, ...n]);
  }
  useControlledProp(t, o) {
    Ei.useDebugValue(t);
    let n = this, r = o !== void 0;
    W(() => {
      r && !Object.is(n.state[t], o) && n.setState({ ...n.state, [t]: o });
    }, [n, t, o, r]);
  }
  select(t, o, n, r) {
    let i = this.selectors[t];
    return i(this.state, o, n, r);
  }
  useState(t, o, n, r) {
    return Ei.useDebugValue(t), Al(this, this.selectors[t], o, n, r);
  }
  useContextCallback(t, o) {
    Ei.useDebugValue(t);
    let n = G(o ?? Oe);
    this.context[t] = n;
  }
  useStateSetter(t) {
    let o = Ei.useRef(void 0);
    return o.current === void 0 && (o.current = (n) => {
      this.set(t, n);
    }), o.current;
  }
  observe(t, o) {
    let n;
    typeof t == "function" ? n = t : n = this.selectors[t];
    let r = n(this.state);
    return o(r, r, this), this.subscribe((i) => {
      let s = n(i);
      if (!Object.is(r, s)) {
        let a = r;
        r = s, o(s, a, this);
      }
    });
  }
};
var Fl = E(M(), 1);
function _x() {
  let [, e4] = Fl.useState({});
  return Fl.useCallback(() => {
    e4({});
  }, []);
}
var tM = { open: (e4) => e4.open, transitionStatus: (e4) => e4.transitionStatus, domReferenceElement: (e4) => e4.domReferenceElement, referenceElement: (e4) => e4.positionReference ?? e4.referenceElement, floatingElement: (e4) => e4.floatingElement, floatingId: (e4) => e4.floatingId };
var Sr = class extends xo {
  constructor(t) {
    let { syncOnly: o, nested: n, onOpenChange: r, triggerElements: i, ...s } = t;
    super({ ...s, positionReference: s.referenceElement, domReferenceElement: s.referenceElement }, { onOpenChange: r, dataRef: { current: {} }, events: Tl(), nested: n, triggerElements: i }, tM), this.syncOnly = o;
  }
  syncOpenEvent = (t, o) => {
    (!t || !this.state.open || o != null && mb(o)) && (this.context.dataRef.current.openEvent = t ? o : void 0);
  };
  dispatchOpenChange = (t, o) => {
    this.syncOpenEvent(t, o.event);
    let n = { open: t, reason: o.reason, nativeEvent: o.event, nested: this.context.nested, triggerElement: o.trigger };
    this.context.events.emit("openchange", n);
  };
  setOpen = (t, o) => {
    if (this.syncOnly) {
      this.context.onOpenChange?.(t, o);
      return;
    }
    this.dispatchOpenChange(t, o), this.context.onOpenChange?.(t, o);
  };
};
function Ma(e4) {
  let { popupStore: t, treatPopupAsFloatingElement: o = false, floatingRootContext: n, floatingId: r, nested: i, onOpenChange: s } = e4, a = t.useState("open"), l = t.useState("activeTriggerElement"), c = t.useState(o ? "popupElement" : "positionerElement"), u = t.context.triggerElements, f = s, p = Bx.useRef(null);
  n === void 0 && p.current === null && (p.current = new Sr({ open: a, transitionStatus: void 0, referenceElement: l, floatingElement: c, triggerElements: u, onOpenChange: f, floatingId: r, syncOnly: true, nested: i }));
  let m = n ?? p.current;
  return t.useSyncedValue("floatingId", r), W(() => {
    let d = { open: a, floatingId: r, referenceElement: l, floatingElement: c };
    De(l) && (d.domReferenceElement = l), m.state.positionReference === m.state.referenceElement && (d.positionReference = l), m.update(d);
  }, [a, r, l, c, m]), m.context.onOpenChange = f, m.context.nested = i, m;
}
var Fn = { tabIndex: -1, [ma]: "" };
function Vl(e4) {
  return (t) => t === "touch" ? e4.current : true;
}
function gs(e4, t = false) {
  let o = Bo(), n = Oo() != null, r = qe(() => e4(o, n)).current;
  return Ma({ popupStore: r, treatPopupAsFloatingElement: t, floatingRootContext: r.state.floatingRootContext, floatingId: o, nested: n, onOpenChange: r.setOpen }), r;
}
function Pr({ handle: e4, store: t }) {
  return W(() => e4.attachStore(t), [e4, t]), null;
}
function Hx(e4) {
  let t = e4.context.triggerElements.size;
  e4.select("open") && e4.state.triggerCount !== t && e4.set("triggerCount", t);
}
function Bd(e4, t) {
  let o = _d.useRef(null);
  return G((n) => {
    let r = o.current;
    if (r !== null) {
      if (r.element === n && r.store === t && r.id === e4) return;
      o.current = null;
      let i = r.store;
      i.context.triggerElements.getById(r.id) === r.element && (i.context.triggerElements.delete(r.id), Hx(i));
    }
    n !== null && e4 !== void 0 && (o.current = { store: t, id: e4, element: n }, t.context.triggerElements.add(e4, n), Hx(t));
  });
}
function Ii(e4, t, o, n = false) {
  let r = e4.preventUnmountingOnClose;
  t ? r = false : n && (r = true);
  let i = o?.id ?? null, s = e4.activeTriggerId, a = e4.activeTriggerElement;
  return (i || t) && (s = i, a = o ?? null), { open: t, preventUnmountingOnClose: r, activeTriggerId: s, activeTriggerElement: a };
}
function Na(e4) {
  let t = false;
  return e4.preventUnmountOnClose = () => {
    t = true;
  }, () => t;
}
function jx(e4, t, o, n = {}) {
  let r = o.reason, i = r === H.triggerHover, s = t && r === H.triggerFocus, a = !t && (r === H.triggerPress || r === H.escapeKey), l = Na(o);
  if (e4.context.onOpenChange?.(t, o), o.isCanceled) return;
  n.onBeforeDispatch?.(), e4.state.floatingRootContext.dispatchOpenChange(t, o);
  let c = () => {
    let u = Ii(e4.state, t, o.trigger, l()), f = { ...n.extraState, ...u };
    s ? f.instantType = "focus" : a ? f.instantType = "dismiss" : i && (f.instantType = void 0), e4.update(f);
  };
  i ? Ux.flushSync(c) : c();
}
function Tr(e4, t, o, n) {
  let r = o.useState("isMountedByTrigger", e4), i = Bd(e4, o), s = G((l) => {
    let c = o.select("open"), u = o.select("activeTriggerId");
    if (u === e4) {
      let f = { activeTriggerElement: l, ...c ? n : null };
      o.update(f);
      return;
    }
    if (u == null && c) {
      let f = { activeTriggerId: e4 ?? null, activeTriggerElement: l, ...n };
      o.update(f);
    }
  }), a = G((l) => {
    i(l), l && s(l);
  });
  return W(() => (a(t.current), () => a(null)), [a, t, o, e4]), W(() => {
    if (r) {
      let l = { activeTriggerElement: t.current, ...n };
      o.update(l);
    }
  }, [r, o, t, ...Object.values(n)]), { registerTrigger: a, isMountedByThisTrigger: r };
}
function wr(e4, t = {}) {
  let { closeOnActiveTriggerUnmount: o = false } = t, n = _d.useRef(null), r = e4.useState("open"), i = e4.useState("triggerCount"), s = e4.useState("activeTriggerId"), a = e4.useState("activeTriggerElement");
  W(() => {
    if (!r) {
      n.current = null, e4.state.triggerCount !== 0 && e4.set("triggerCount", 0);
      return;
    }
    let l = e4.context.triggerElements.size, c = {};
    e4.state.triggerCount !== l && (c.triggerCount = l);
    let u = e4.select("activeTriggerId"), f = null;
    if (u) {
      let p = e4.context.triggerElements.getById(u);
      if (p) n.current = u, p !== e4.state.activeTriggerElement && (c.activeTriggerElement = p);
      else {
        for (let [m, d] of e4.context.triggerElements.entries()) if (d === e4.state.activeTriggerElement) {
          c.activeTriggerId = m, c.activeTriggerElement = d, n.current = m;
          break;
        }
        c.activeTriggerId === void 0 && (n.current === u ? f = u : n.current = null);
      }
    } else n.current = null;
    if (!f && !u && l === 1) {
      let p = e4.context.triggerElements.entries().next();
      if (!p.done) {
        let [m, d] = p.value;
        c.activeTriggerId = m, c.activeTriggerElement = d, n.current = m;
      }
    }
    (c.triggerCount !== void 0 || c.activeTriggerId !== void 0 || c.activeTriggerElement !== void 0) && e4.update(c), f && o && queueMicrotask(() => {
      if (e4.select("open") && e4.select("activeTriggerId") === f && !e4.context.triggerElements.getById(f)) {
        let p = Q(H.none);
        e4.setOpen(false, p), p.isCanceled || e4.update({ activeTriggerId: null, activeTriggerElement: null });
      }
    });
  }, [r, e4, i, s, a, o]);
}
function Or(e4, t, o, n) {
  let { mounted: r, setMounted: i, transitionStatus: s } = wt(e4, false, false, n), a = t.useState("preventUnmountingOnClose"), l = e4 ? false : a;
  t.useSyncedValues({ mounted: r, transitionStatus: s, preventUnmountingOnClose: l });
  let c = G(() => {
    i(false), t.update({ activeTriggerId: null, activeTriggerElement: null, mounted: false, preventUnmountingOnClose: false }), o?.(), t.context.onOpenChangeComplete?.(false);
  });
  return it({ enabled: r && !e4 && !l, open: e4, ref: t.context.popupRef, onComplete() {
    e4 || c();
  } }), { forceUnmount: c, transitionStatus: s };
}
function Mr(e4, t) {
  e4.useSyncedValues(t), W(() => () => {
    e4.update({ activeTriggerProps: Me, inactiveTriggerProps: Me, popupProps: Me });
  }, [e4]);
}
function Ll(e4, t) {
  W(() => {
    !t && e4.state.openMethod !== null && e4.set("openMethod", null);
  }, [t, e4]), W(() => () => {
    e4.state.openMethod !== null && e4.set("openMethod", null);
  }, [e4]);
}
var Ro = class {
  constructor() {
    this.idMap = /* @__PURE__ */ new Map();
  }
  add(t, o) {
    this.idMap.set(t, o);
  }
  delete(t) {
    this.idMap.delete(t);
  }
  hasElement(t) {
    for (let o of this.idMap.values()) if (o === t) return true;
    return false;
  }
  hasMatchingElement(t) {
    for (let o of this.idMap.values()) if (t(o)) return true;
    return false;
  }
  getById(t) {
    return this.idMap.get(t);
  }
  entries() {
    return this.idMap.entries();
  }
  elements() {
    return this.idMap.values();
  }
  get size() {
    return this.idMap.size;
  }
};
function Nr(e4, t, o = false) {
  return { open: false, openProp: void 0, mounted: false, transitionStatus: void 0, floatingRootContext: new Sr({ open: false, transitionStatus: void 0, floatingElement: null, referenceElement: null, triggerElements: e4, floatingId: t, syncOnly: true, nested: o, onOpenChange: void 0 }), floatingId: t, triggerCount: 0, preventUnmountingOnClose: false, payload: void 0, activeTriggerId: null, activeTriggerElement: null, triggerIdProp: void 0, popupElement: null, positionerElement: null, activeTriggerProps: Me, inactiveTriggerProps: Me, popupProps: Me };
}
var Da = (e4) => e4.triggerIdProp ?? e4.activeTriggerId;
var Hd = (e4) => e4.openProp ?? e4.open;
var Gx = (e4) => (e4.popupElement?.id ?? e4.floatingId) || void 0;
function Wx(e4, t) {
  return t !== void 0 && Hd(e4) && Da(e4) === t;
}
function oM(e4, t) {
  return Wx(e4, t) ? true : t !== void 0 && Hd(e4) && Da(e4) == null && e4.triggerCount === 1;
}
var Dr = { open: Hd, mounted: (e4) => e4.mounted, transitionStatus: (e4) => e4.transitionStatus, floatingRootContext: (e4) => e4.floatingRootContext, triggerCount: (e4) => e4.triggerCount, preventUnmountingOnClose: (e4) => e4.preventUnmountingOnClose, payload: (e4) => e4.payload, activeTriggerId: Da, activeTriggerElement: (e4) => e4.mounted ? e4.activeTriggerElement : null, popupId: Gx, isTriggerActive: (e4, t) => t !== void 0 && Da(e4) === t, isOpenedByTrigger: (e4, t) => Wx(e4, t), isMountedByTrigger: (e4, t) => t !== void 0 && Da(e4) === t && e4.mounted, triggerProps: (e4, t) => t ? e4.activeTriggerProps : e4.inactiveTriggerProps, triggerPopupId: (e4, t) => oM(e4, t) ? Gx(e4) : void 0, popupProps: (e4) => e4.popupProps, popupElement: (e4) => e4.popupElement, positionerElement: (e4) => e4.positionerElement };
var Ud = E(M(), 1);
var $x = E(Oa(), 1);
function Ar(e4) {
  let t = Ud.useCallback((n) => e4 === void 0 ? Oe : e4.subscribeStore(n), [e4]), o = Ud.useCallback(() => e4 === void 0 ? void 0 : e4.store, [e4]);
  return (0, $x.useSyncExternalStore)(t, o, () => e4?.serverStore);
}
function jd(e4) {
  let { open: t = false, onOpenChange: o, elements: n = {} } = e4, r = Bo(), i = Oo() != null, s = qe(() => new Sr({ open: t, transitionStatus: void 0, onOpenChange: o, referenceElement: n.reference ?? null, floatingElement: n.floating ?? null, triggerElements: new Ro(), floatingId: r, syncOnly: false, nested: i })).current;
  return W(() => {
    let a = { open: t, floatingId: r };
    n.reference !== void 0 && (a.referenceElement = n.reference, a.domReferenceElement = De(n.reference) ? n.reference : null), n.floating !== void 0 && (a.floatingElement = n.floating), s.update(a);
  }, [t, r, n.reference, n.floating, s]), s.context.onOpenChange = o, s.context.nested = i, s;
}
function zx(e4) {
  return nM(e4, e4.rootContext);
}
function nM(e4, t) {
  let { nodeId: o, externalTree: n } = e4, r = t.useState("referenceElement"), i = t.useState("floatingElement"), s = t.useState("domReferenceElement"), a = t.useState("open"), l = t.useState("floatingId"), [c, u] = Co.useState(null), [f, p] = Co.useState(void 0), [m, d] = Co.useState(void 0), h = Co.useRef(null), C = ho(n), g = Co.useMemo(() => ({ reference: r, floating: i, domReference: s }), [r, i, s]), x = Sx({ ...e4, elements: { ...g, ...c && { reference: c } } }), b = De(f) ? f : null, y = m === void 0 ? t.state.floatingElement : m;
  t.useSyncedValue("referenceElement", f ?? null), t.useSyncedValue("domReferenceElement", f === void 0 ? s : b), t.useSyncedValue("floatingElement", y);
  let R = Co.useCallback((P) => {
    let O = De(P) ? { getBoundingClientRect: () => P.getBoundingClientRect(), getClientRects: () => P.getClientRects(), contextElement: P } : P;
    u(O), x.refs.setReference(O);
  }, [x.refs]), I = Co.useCallback((P) => {
    (De(P) || P === null) && (h.current = P, p(P)), (De(x.refs.reference.current) || x.refs.reference.current === null || P !== null && !De(P)) && x.refs.setReference(P);
  }, [x.refs, p]), S = Co.useCallback((P) => {
    d(P), x.refs.setFloating(P);
  }, [x.refs]), v = Co.useMemo(() => ({ ...x.refs, setReference: I, setFloating: S, setPositionReference: R, domReference: h }), [x.refs, I, S, R]), T = Co.useMemo(() => ({ ...x.elements, domReference: s }), [x.elements, s]), w = Co.useMemo(() => ({ ...x, dataRef: t.context.dataRef, open: a, onOpenChange: t.setOpen, events: t.context.events, floatingId: l, refs: v, elements: T, nodeId: o, rootStore: t }), [x, v, T, o, t, a, l]);
  return W(() => {
    s && (h.current = s);
  }, [s]), W(() => {
    t.context.dataRef.current.floatingContext = w;
    let P = C?.nodesRef.current.find((O) => O.id === o);
    P && (P.context = w);
  }), Co.useMemo(() => ({ ...x, context: w, refs: v, elements: T, rootStore: t }), [x, v, T, w, t]);
}
var Vn = E(M(), 1);
var Gd = Je.os.mac && Je.engine.webkit;
function Aa(e4, t = {}) {
  let { enabled: o = true, delay: n } = t, r = "rootStore" in e4 ? e4.rootStore : e4, { events: i, dataRef: s } = r.context, a = Vn.useRef(false), l = Vn.useRef(null), c = Vn.useRef(true), u = ot();
  Vn.useEffect(() => {
    let p = r.select("domReferenceElement");
    if (!o) return;
    let m = Be(p);
    function d() {
      let g = r.select("domReferenceElement");
      !r.select("open") && Ve(g) && g === Ct(Te(g)) && (a.current = true, l.current = g);
    }
    function h() {
      c.current = true;
    }
    function C() {
      c.current = false;
    }
    return mo(Le(m, "blur", d), Gd && Le(m, "keydown", h, true), Gd && Le(m, "pointerdown", C, true));
  }, [r, o]), Vn.useEffect(() => {
    if (!o) return;
    function p(m) {
      if (m.reason === H.triggerPress || m.reason === H.escapeKey) {
        let d = r.select("domReferenceElement");
        De(d) && (l.current = d, a.current = true);
      }
    }
    return i.on("openchange", p), () => {
      i.off("openchange", p);
    };
  }, [i, o, r]);
  let f = Vn.useMemo(() => {
    function p() {
      a.current = false, l.current = null;
    }
    return { onMouseLeave() {
      p();
    }, onFocus(m) {
      let d = m.currentTarget;
      if (a.current) {
        if (l.current === d) return;
        p();
      }
      let h = We(m.nativeEvent);
      if (De(h)) {
        if (Gd && !m.relatedTarget) {
          if (!c.current && !hi(h)) return;
        } else if (!ml(h)) return;
      }
      let C = xr(m.relatedTarget, r.context.triggerElements), { nativeEvent: g, currentTarget: x } = m, b = typeof n == "function" ? n() : n;
      if (r.select("open") && C || b === 0 || b === void 0) {
        r.setOpen(true, Q(H.triggerFocus, g, x));
        return;
      }
      u.start(b, () => {
        a.current || r.setOpen(true, Q(H.triggerFocus, g, x));
      });
    }, onBlur(m) {
      p();
      let d = m.relatedTarget, h = m.nativeEvent, C = De(d) && d.hasAttribute(Jn("focus-guard")) && d.getAttribute("data-type") === "outside";
      u.start(0, () => {
        let g = r.select("domReferenceElement"), x = Ct(Te(g));
        !d && x === g || me(s.current.floatingContext?.refs.floating.current, x) || me(g, x) || C || xr(d ?? x, r.context.triggerElements) || r.setOpen(false, Q(H.triggerFocus, h));
      });
    } };
  }, [s, n, r, u]);
  return Vn.useMemo(() => o ? { reference: f, trigger: f } : {}, [o, f]);
}
var $d = E(M(), 1);
var Wd = class e3 {
  constructor() {
    this.pointerType = void 0, this.interactedInside = false, this.handler = void 0, this.blockMouseMove = true, this.performedPointerEventsMutation = false, this.pointerEventsScopeElement = null, this.pointerEventsReferenceElement = null, this.pointerEventsFloatingElement = null, this.restTimeoutPending = false, this.openChangeTimeout = new oo(), this.restTimeout = new oo(), this.handleCloseOptions = void 0;
  }
  static create() {
    return new e3();
  }
  dispose = () => {
    this.openChangeTimeout.clear(), this.restTimeout.clear();
  };
  disposeEffect = () => this.dispose;
};
var _l = /* @__PURE__ */ new WeakMap();
function hs(e4) {
  if (!e4.performedPointerEventsMutation) return;
  let t = e4.pointerEventsScopeElement;
  t && _l.get(t) === e4 && (e4.pointerEventsScopeElement?.style.removeProperty("pointer-events"), e4.pointerEventsReferenceElement?.style.removeProperty("pointer-events"), e4.pointerEventsFloatingElement?.style.removeProperty("pointer-events"), _l.delete(t)), e4.performedPointerEventsMutation = false, e4.pointerEventsScopeElement = null, e4.pointerEventsReferenceElement = null, e4.pointerEventsFloatingElement = null;
}
function Bl(e4, t) {
  let { scopeElement: o, referenceElement: n, floatingElement: r } = t, i = _l.get(o);
  i && i !== e4 && hs(i), hs(e4), e4.performedPointerEventsMutation = true, e4.pointerEventsScopeElement = o, e4.pointerEventsReferenceElement = n, e4.pointerEventsFloatingElement = r, _l.set(o, e4), o.style.pointerEvents = "none", n.style.pointerEvents = "auto", r.style.pointerEvents = "auto";
}
function bs(e4) {
  let t = e4.context.dataRef.current, o = qe(() => t.hoverInteractionState ?? Wd.create()).current;
  return t.hoverInteractionState || (t.hoverInteractionState = o), Qi(t.hoverInteractionState.disposeEffect), t.hoverInteractionState;
}
function Si(e4, t = {}) {
  let { enabled: o = true, closeDelay: n = 0, nodeId: r } = t, i = "rootStore" in e4 ? e4.rootStore : e4, s = i.useState("open"), a = i.useState("floatingElement"), l = i.useState("domReferenceElement"), { dataRef: c } = i.context, u = ho(), f = Oo(), p = bs(i), m = ot(), d = G(() => gl(c.current.openEvent?.type, p.interactedInside)), h = G(() => bb(c.current.openEvent?.type)), C = G(() => {
    hs(p);
  });
  W(() => {
    s || (p.pointerType = void 0, p.restTimeoutPending = false, p.interactedInside = false, C());
  }, [s, p, C]), $d.useEffect(() => C, [C]), W(() => {
    if (o && s && p.handleCloseOptions?.blockPointerEvents && h() && De(l) && a) {
      let g = l, x = a, b = Te(a), y = u?.nodesRef.current.find((v) => v.id === f)?.context?.elements.floating;
      y && (y.style.pointerEvents = "");
      let R = p.pointerEventsScopeElement !== x ? p.pointerEventsScopeElement : null, I = y !== x ? y : null, S = p.handleCloseOptions?.getScope?.() ?? R ?? I ?? g.closest("[data-rootownerid]") ?? b.body;
      return Bl(p, { scopeElement: S, referenceElement: g, floatingElement: x }), () => {
        C();
      };
    }
  }, [o, s, l, a, p, h, u, f, C]), $d.useEffect(() => {
    if (!o) return;
    function g() {
      return !!(u && f && Qo(u.nodesRef.current, f).length > 0);
    }
    function x(v) {
      let T = gn(n, "close", p.pointerType), w = () => {
        i.setOpen(false, Q(H.triggerHover, v)), u?.events.emit("floating.closed", v);
      };
      T ? p.openChangeTimeout.start(T, w) : (p.openChangeTimeout.clear(), w());
    }
    function b(v) {
      let T = We(v);
      if (!ba(T)) {
        p.interactedInside = false;
        return;
      }
      p.interactedInside = T?.closest("[aria-haspopup]") != null;
    }
    function y() {
      p.openChangeTimeout.clear(), m.clear(), u?.events.off("floating.closed", I), C();
    }
    function R(v) {
      if (g() && u) {
        u.events.on("floating.closed", I);
        return;
      }
      if (xr(v.relatedTarget, i.context.triggerElements)) return;
      let T = c.current.floatingContext?.nodeId ?? r, w = v.relatedTarget;
      if (!(u && T && De(w) && Qo(u.nodesRef.current, T, false).some((O) => me(O.context?.elements.floating, w)))) {
        if (p.handler) {
          p.handler(v);
          return;
        }
        C(), h() && !d() && x(v);
      }
    }
    function I(v) {
      !u || !f || g() || m.start(0, () => {
        u.events.off("floating.closed", I), i.setOpen(false, Q(H.triggerHover, v)), u.events.emit("floating.closed", v);
      });
    }
    let S = a;
    return mo(S && Le(S, "mouseenter", y), S && Le(S, "mouseleave", R), S && Le(S, "pointerdown", b, true), () => {
      u?.events.off("floating.closed", I);
    });
  }, [o, a, i, c, n, r, h, d, C, p, u, f, m]);
}
var kr = E(M(), 1);
var Kx = E(Ko(), 1);
var rM = { current: null };
function or(e4, t = {}) {
  let { enabled: o = true, delay: n = 0, handleClose: r = null, mouseOnly: i = false, restMs: s = 0, move: a = true, triggerElementRef: l = rM, externalTree: c, isActiveTrigger: u = true, getHandleCloseContext: f, isClosing: p, shouldOpen: m, guardStaleOpen: d = false } = t, h = "rootStore" in e4 ? e4.rootStore : e4, { dataRef: C, events: g } = h.context, x = ho(c), b = bs(h), y = kr.useRef(false), R = ct(r), I = ct(n), S = ct(s), v = ct(o), T = ct(m), w = ct(p), P = G(() => gl(C.current.openEvent?.type, b.interactedInside)), O = G(() => T.current?.() !== false), N = G((_, B, k) => {
    let F = h.context.triggerElements;
    if (F.hasElement(B)) return !_ || !me(_, B);
    if (!De(k)) return false;
    let $ = k;
    return F.hasMatchingElement((K) => me(K, $)) && (!_ || !me(_, $));
  }), D = G(() => {
    if (!b.handler) return;
    Te(h.select("domReferenceElement")).removeEventListener("mousemove", b.handler), b.handler = void 0;
  }), A = G(() => {
    hs(b);
  });
  return u && (b.handleCloseOptions = r?.__options), kr.useEffect(() => D, [D]), kr.useEffect(() => {
    if (!o) return;
    function _(B) {
      B.open ? y.current = false : (y.current = B.reason === H.triggerHover, D(), b.openChangeTimeout.clear(), b.restTimeout.clear(), b.blockMouseMove = true, b.restTimeoutPending = false);
    }
    return g.on("openchange", _), () => {
      g.off("openchange", _);
    };
  }, [o, g, b, D]), kr.useEffect(() => {
    if (!o) return;
    function _(Y, te = true) {
      let L = gn(I.current, "close", b.pointerType);
      L ? b.openChangeTimeout.start(L, () => {
        h.setOpen(false, Q(H.triggerHover, Y)), x?.events.emit("floating.closed", Y);
      }) : te && (b.openChangeTimeout.clear(), h.setOpen(false, Q(H.triggerHover, Y)), x?.events.emit("floating.closed", Y));
    }
    let B = l.current ?? (u ? h.select("domReferenceElement") : null);
    if (!De(B)) return;
    function k(Y) {
      if (b.openChangeTimeout.clear(), b.blockMouseMove = false, i && !Ho(b.pointerType)) return;
      let te = cd(S.current), L = gn(I.current, "open", b.pointerType), j = We(Y), z = Y.currentTarget ?? null, J = h.select("domReferenceElement"), X = z;
      if (De(j) && !h.context.triggerElements.hasElement(j)) {
        for (let re of h.context.triggerElements.elements()) if (me(re, j)) {
          X = re;
          break;
        }
      }
      De(z) && De(J) && !h.context.triggerElements.hasElement(z) && me(z, J) && (X = J);
      let pe = X == null ? false : N(J, X, j), de = h.select("open"), ye = w.current?.() ?? h.select("transitionStatus") === "ending", ce = !de && ye && y.current, fe = !pe && De(X) && De(J) && me(J, X) && ce, se = te > 0 && !L, ge = pe && (de || ce) || fe, be = !de || pe;
      if (ge) {
        O() && h.setOpen(true, Q(H.triggerHover, Y, X));
        return;
      }
      se || (L ? b.openChangeTimeout.start(L, () => {
        be && O() && h.setOpen(true, Q(H.triggerHover, Y, X));
      }) : be && O() && h.setOpen(true, Q(H.triggerHover, Y, X)));
    }
    function F(Y) {
      if (P()) {
        A();
        return;
      }
      D();
      let te = h.select("domReferenceElement"), L = Te(te);
      b.restTimeout.clear(), b.restTimeoutPending = false;
      let j = C.current.floatingContext ?? f?.();
      if (xr(Y.relatedTarget, h.context.triggerElements)) return;
      if (R.current && j) {
        h.select("open") || b.openChangeTimeout.clear();
        let J = l.current;
        b.handler = R.current({ ...j, tree: x, x: Y.clientX, y: Y.clientY, onClose() {
          A(), D(), v.current && !P() && J === h.select("domReferenceElement") && _(Y, true);
        } }), L.addEventListener("mousemove", b.handler), b.handler(Y);
        return;
      }
      (b.pointerType === "touch" ? !me(h.select("floatingElement"), Y.relatedTarget) : true) && _(Y);
    }
    function $(Y) {
      me(B, Y.relatedTarget) || (b.openChangeTimeout.clear(), b.restTimeout.clear(), b.restTimeoutPending = false);
    }
    let K = d ? Le(B, "mouseout", $) : void 0;
    return a ? mo(Le(B, "mousemove", k, { once: true }), Le(B, "mouseenter", k), Le(B, "mouseleave", F), K) : mo(Le(B, "mouseenter", k), Le(B, "mouseleave", F), K);
  }, [D, A, C, I, h, o, R, b, u, N, P, i, a, S, l, x, v, f, w, O, d]), kr.useMemo(() => {
    if (!o) return;
    function _(B) {
      b.pointerType = B.pointerType;
    }
    return { onPointerDown: _, onPointerEnter: _, onMouseMove(B) {
      let { nativeEvent: k } = B, F = B.currentTarget, $ = h.select("domReferenceElement"), K = h.select("open"), Y = N($, F, B.target);
      if (i && !Ho(b.pointerType)) return;
      if (K && Y && b.handleCloseOptions?.blockPointerEvents) {
        let j = h.select("floatingElement");
        if (j) {
          let z = b.handleCloseOptions?.getScope?.() ?? F.ownerDocument.body;
          Bl(b, { scopeElement: z, referenceElement: F, floatingElement: j });
        }
      }
      let te = cd(S.current);
      if (K && !Y || te === 0 || !Y && b.restTimeoutPending && B.movementX ** 2 + B.movementY ** 2 < 2) return;
      b.restTimeout.clear();
      function L() {
        if (b.restTimeoutPending = false, P()) return;
        let j = h.select("open");
        !b.blockMouseMove && (!j || Y) && O() && h.setOpen(true, Q(H.triggerHover, k, F));
      }
      b.pointerType === "touch" ? Kx.flushSync(() => {
        L();
      }) : Y && K ? L() : (b.restTimeoutPending = true, b.restTimeout.start(te, L));
    } };
  }, [o, b, P, N, i, h, S, O]);
}
var co = E(M(), 1);
var iM = "Escape";
function Yx(e4) {
  return Je.engine.webkit && e4.movementX === 0 && e4.movementY === 0;
}
function Ul(e4, t, o) {
  switch (e4) {
    case "vertical":
      return t;
    case "horizontal":
      return o;
    default:
      return t || o;
  }
}
function Hl(e4, t) {
  return Ul(t, e4 === ga || e4 === ss, e4 === Yn || e4 === qn);
}
function zd(e4, t, o) {
  return Ul(t, e4 === ss, o ? e4 === Yn : e4 === qn) || e4 === "Enter" || e4 === " " || e4 === "";
}
function sM(e4, t, o) {
  return Ul(t, o ? e4 === Yn : e4 === qn, e4 === ss);
}
function aM(e4, t, o, n) {
  let r = o ? e4 === qn : e4 === Yn, i = e4 === ga;
  return t === "both" || t === "horizontal" && n ? e4 === iM : Ul(t, r, i);
}
function ka(e4, t) {
  let { listRef: o, activeIndex: n, onNavigate: r = () => {
  }, enabled: i = true, selectedIndex: s = null, allowEscape: a = false, loopFocus: l = false, nested: c = false, rtl: u = false, virtual: f = false, focusItemOnOpen: p = "auto", focusItemOnHover: m = true, openOnArrowKeyDown: d = true, disabledIndices: h = void 0, orientation: C = "vertical", parentOrientation: g, id: x, resetOnPointerLeave: b = true, externalTree: y, grid: R } = t, I = R != null, S = "rootStore" in e4 ? e4.rootStore : e4, v = S.useState("open"), T = S.useState("floatingElement"), w = S.useState("domReferenceElement"), P = S.context.dataRef, O = Ra(T), N = xa(w), D = ct(O), A = Oo(), _ = ho(y), B = co.useRef(p), k = co.useRef(s ?? -1), F = co.useRef(null), $ = co.useRef(true), K = G((oe) => {
    r(k.current === -1 ? null : k.current, oe);
  }), Y = co.useRef(!!T), te = co.useRef(v), L = co.useRef(false), j = co.useRef(false), z = co.useRef(null), J = ct(h), X = ct(v), pe = ct(s), de = ct(b), ye = Io(), ce = Io(), fe = G(() => {
    function oe(Ee) {
      f ? _?.events.emit("virtualfocus", Ee) : z.current = us(Ee, { sync: L.current, preventScroll: true });
    }
    let he = o.current[k.current], ne = j.current;
    he && oe(he), (L.current ? (Ee) => Ee() : (Ee) => ye.request(Ee))(() => {
      let Ee = o.current[k.current] || he;
      if (!Ee) return;
      he || oe(Ee), ee && (ne || !$.current) && Ee.scrollIntoView?.({ block: "nearest", inline: "nearest" });
    });
  });
  W(() => {
    P.current.orientation = C;
  }, [P, C]), W(() => {
    i && (v && T ? (k.current = s ?? -1, B.current && s != null && (j.current = true, K())) : Y.current && (k.current = -1, K()));
  }, [i, v, T, s, K]), W(() => {
    if (i) {
      if (!v) {
        L.current = false;
        return;
      }
      if (T) if (n == null) {
        if (L.current = false, pe.current != null) return;
        if (Y.current && (k.current = -1, fe()), (!te.current || !Y.current) && B.current && (F.current != null || B.current === true && F.current == null)) {
          let oe = 0, he = () => {
            o.current[0] == null ? (oe < 2 && (oe ? (q) => ce.request(q) : queueMicrotask)(he), oe += 1) : (k.current = F.current == null || zd(F.current, C, u) || c ? xi(o) : as(o), F.current = null, K());
          };
          he();
        }
      } else Jo(o.current, n) || (k.current = n, fe(), j.current = false);
    }
  }, [i, v, T, n, pe, c, o, C, u, K, fe, ce]), W(() => {
    if (!i || T || !_ || f || !Y.current) return;
    let oe = _.nodesRef.current, he = oe.find((Ee) => Ee.id === A)?.context?.elements.floating, ne = Ct(Te(w ?? he ?? null)), q = oe.some((Ee) => Ee.context && me(Ee.context.elements.floating, ne));
    he && !q && $.current && he.focus({ preventScroll: true });
  }, [i, T, w, _, A, f]), W(() => {
    te.current = v, Y.current = !!T;
  }), W(() => {
    v || (F.current = null, B.current = p);
  }, [v, p]);
  let se = n != null, ge = G((oe) => {
    if (!X.current) return;
    let he = o.current.indexOf(oe.currentTarget);
    he !== -1 && (k.current !== he || n !== he) && (k.current = he, K(oe));
  }), be = G(() => g ?? _?.nodesRef.current.find((oe) => oe.id === A)?.context?.dataRef?.current.orientation), re = G(() => xi(o, J.current)), Z = G((oe) => {
    if ($.current = false, L.current = true, oe.which === 229 || !X.current && oe.currentTarget === D.current) return;
    if (c && aM(oe.key, C, u, I)) {
      Hl(oe.key, be()) || rt(oe), S.setOpen(false, Q(H.listNavigation, oe.nativeEvent)), Ve(w) && (f ? _?.events.emit("virtualfocus", w) : w.focus());
      return;
    }
    let he = k.current, ne = xi(o, h), q = as(o, h);
    if (N || (oe.key === "Home" && (rt(oe), k.current = ne, K(oe)), oe.key === "End" && (rt(oe), k.current = q, K(oe))), R != null) {
      let Ee = R(oe, k.current, o, C, l, u, h, ne, q);
      if (Ee != null && (k.current = Ee, K(oe)), C === "both") return;
    }
    if (Hl(oe.key, C)) {
      if (rt(oe), v && !f && Ct(oe.currentTarget.ownerDocument) === oe.currentTarget) {
        k.current = zd(oe.key, C, u) ? ne : q, K(oe);
        return;
      }
      zd(oe.key, C, u) ? l ? he >= q ? a && he !== o.current.length ? k.current = -1 : (L.current = false, k.current = ne) : k.current = jt(o.current, { startingIndex: he, disabledIndices: h }) : k.current = Math.min(q, jt(o.current, { startingIndex: he, disabledIndices: h })) : l ? he <= ne ? a && he !== -1 ? k.current = o.current.length : (L.current = false, k.current = q) : k.current = jt(o.current, { startingIndex: he, decrement: true, disabledIndices: h }) : k.current = Math.max(ne, jt(o.current, { startingIndex: he, decrement: true, disabledIndices: h })), Jo(o.current, k.current) && (k.current = -1), K(oe);
    }
  }), ee = co.useMemo(() => ({ onFocus(he) {
    L.current = true, ge(he);
  }, onClick: ({ currentTarget: he }) => he.focus({ preventScroll: true }), onMouseMove(he) {
    Yx(he) || (L.current = true, j.current = false, m && ge(he));
  }, onPointerLeave(he) {
    if (!X.current || !$.current || he.pointerType === "touch") return;
    L.current = true;
    let ne = he.relatedTarget;
    if (!(!m || o.current.includes(ne)) && de.current && (z.current?.(), z.current = null, k.current = -1, K(he), !f)) {
      let q = D.current, Ee = Ct(Te(q));
      q && me(q, Ee) && q.focus({ preventScroll: true });
    }
  } }), [ge, X, D, m, o, K, de, f]), le = co.useMemo(() => f && v && se && { "aria-activedescendant": `${x}-${n}` }, [f, v, se, x, n]), ue = co.useMemo(() => ({ ...N ? {} : le, onKeyDown(oe) {
    if (oe.key === "Tab" && oe.shiftKey && v && !f) {
      let he = We(oe.nativeEvent);
      if (he && !me(D.current, he)) return;
      rt(oe), S.setOpen(false, Q(H.focusOut, oe.nativeEvent)), Ve(w) && w.focus();
      return;
    }
    Z(oe);
  }, onPointerMove(oe) {
    Yx(oe) || ($.current = true);
  } }), [le, Z, D, N, S, v, f, w]), xe = co.useMemo(() => {
    function oe(q) {
      S.setOpen(true, Q(H.listNavigation, q.nativeEvent, q.currentTarget));
    }
    function he(q) {
      p === "auto" && rs(q.nativeEvent) && (B.current = !f);
    }
    function ne(q) {
      B.current = p, p === "auto" && is(q.nativeEvent) && (B.current = true);
    }
    return { onKeyDown(q) {
      let Ee = S.select("open");
      $.current = false;
      let we = q.key.startsWith("Arrow"), je = sM(q.key, be(), u), et = Hl(q.key, C), ke = (c ? je : et) || q.key === "Enter" || q.key.trim() === "";
      if (f && Ee) return Z(q);
      if (!(!Ee && !d && we)) {
        if (ke) {
          let ve = Hl(q.key, be());
          F.current = c && ve ? null : q.key;
        }
        if (c) {
          je && (rt(q), Ee ? (k.current = re(), K(q)) : oe(q));
          return;
        }
        et && (pe.current != null && (k.current = pe.current), rt(q), !Ee && d ? oe(q) : Z(q), Ee && K(q));
      }
    }, onFocus(q) {
      S.select("open") && !f && (k.current = -1, K(q));
    }, onPointerDown: ne, onPointerEnter: ne, onMouseDown: he, onClick: he };
  }, [Z, p, re, c, K, S, d, C, be, u, pe, f]), ae = co.useMemo(() => ({ ...le, ...xe }), [le, xe]);
  return co.useMemo(() => i ? { reference: ae, floating: ue, item: ee, trigger: xe } : {}, [i, ae, ue, xe, ee]);
}
var Pi = E(M(), 1);
function Fa(e4, t) {
  let { listRef: o, elementsRef: n, activeIndex: r, onMatch: i, disabledIndices: s, onTyping: a, enabled: l = true, resetMs: c = 750, selectedIndex: u = null } = t, f = "rootStore" in e4 ? e4.rootStore : e4, p = f.useState("open"), m = ot(), d = Pi.useRef(""), h = Pi.useRef(u ?? r ?? -1), C = Pi.useRef(null), g = G((y) => {
    function R(D) {
      return n?.current[D];
    }
    function I(D) {
      let A = R(D);
      return A && !Ri(A) || A?.matches(":disabled") ? false : s == null || !bn(It, D, s);
    }
    function S(D, A, _ = 0) {
      if (D.length === 0) return -1;
      let B = (_ % D.length + D.length) % D.length, k = A.toLowerCase();
      for (let F = 0; F < D.length; F += 1) {
        let $ = (B + F) % D.length;
        if (!(!D[$]?.toLowerCase().startsWith(k) || !I($))) return $;
      }
      return -1;
    }
    let v = o.current;
    if (d.current.length > 0 && y.key === " " && (rt(y), a?.(true)), d.current.length > 0 && d.current[0] !== " " && S(v, d.current) === -1 && y.key !== " " && a?.(false), v == null || y.key.length !== 1 || y.ctrlKey || y.metaKey || y.altKey) return;
    p && y.key !== " " && (rt(y), a?.(true));
    let T = d.current === "";
    T && (h.current = u ?? r ?? -1), v.every((D, A) => D && I(A) ? D[0]?.toLowerCase() !== D[1]?.toLowerCase() : true) && d.current === y.key && (d.current = "", h.current = C.current), d.current += y.key, m.start(c, () => {
      d.current = "", h.current = C.current, a?.(false);
    });
    let O = ((T ? u ?? r ?? -1 : h.current) ?? 0) + 1, N = S(v, d.current, O);
    N !== -1 ? (i?.(N), C.current = N) : y.key !== " " && (d.current = "", a?.(false));
  }), x = G((y) => {
    let R = y.relatedTarget, I = f.select("domReferenceElement"), S = f.select("floatingElement");
    me(I, R) || me(S, R) || (m.clear(), d.current = "", h.current = C.current, a?.(false));
  });
  W(() => {
    !p && u !== null || (m.clear(), C.current = null, d.current !== "" && (d.current = ""));
  }, [p, u, m]);
  let b = Pi.useMemo(() => ({ onKeyDown: g, onBlur: x }), [g, x]);
  return Pi.useMemo(() => l ? { reference: b, floating: b } : {}, [l, b]);
}
var qx = 0.1;
var cM = qx * qx;
var bt = 0.5;
function jl(e4, t, o, n, r, i) {
  return n >= t != i >= t && e4 <= (r - o) * (t - n) / (i - n) + o;
}
function Gl(e4, t, o, n, r, i, s, a, l, c) {
  let u = false;
  return jl(e4, t, o, n, r, i) && (u = !u), jl(e4, t, r, i, s, a) && (u = !u), jl(e4, t, s, a, l, c) && (u = !u), jl(e4, t, l, c, o, n) && (u = !u), u;
}
function lM(e4, t, o) {
  return e4 >= o.x && e4 <= o.x + o.width && t >= o.y && t <= o.y + o.height;
}
function Wl(e4, t, o, n, r, i) {
  let s = Math.min(o, r), a = Math.max(o, r), l = Math.min(n, i), c = Math.max(n, i);
  return e4 >= s && e4 <= a && t >= l && t <= c;
}
function nr(e4 = {}) {
  let { blockPointerEvents: t = false } = e4, o = new oo(), n = ({ x: r, y: i, placement: s, elements: a, onClose: l, nodeId: c, tree: u }) => {
    let f = s?.split("-")[0], p = false, m = null, d = null, h = typeof performance < "u" ? performance.now() : 0;
    function C(x, b) {
      let y = performance.now(), R = y - h;
      if (m === null || d === null || R === 0) return m = x, d = b, h = y, false;
      let I = x - m, S = b - d, v = I * I + S * S, T = R * R * cM;
      return m = x, d = b, h = y, v < T;
    }
    function g() {
      o.clear(), l();
    }
    return function(b) {
      o.clear();
      let y = a.domReference, R = a.floating;
      if (!y || !R || f == null || r == null || i == null) return;
      let { clientX: I, clientY: S } = b, v = We(b), T = b.type === "mouseleave", w = me(R, v), P = me(y, v);
      if (w && (p = true, !T)) return;
      if (P && (p = false, !T)) {
        p = true;
        return;
      }
      if (T && De(b.relatedTarget) && me(R, b.relatedTarget)) return;
      function O() {
        return !!(u && Qo(u.nodesRef.current, c).length > 0);
      }
      function N() {
        O() || g();
      }
      if (O()) return;
      let D = y.getBoundingClientRect(), A = R.getBoundingClientRect(), _ = r > A.right - A.width / 2, B = i > A.bottom - A.height / 2, k = A.width > D.width, F = A.height > D.height, $ = (k ? D : A).left, K = (k ? D : A).right, Y = (F ? D : A).top, te = (F ? D : A).bottom;
      if (f === "top" && i >= D.bottom - 1 || f === "bottom" && i <= D.top + 1 || f === "left" && r >= D.right - 1 || f === "right" && r <= D.left + 1) {
        N();
        return;
      }
      let L = false;
      switch (f) {
        case "top":
          L = Wl(I, S, $, D.top + 1, K, A.bottom - 1);
          break;
        case "bottom":
          L = Wl(I, S, $, A.top + 1, K, D.bottom - 1);
          break;
        case "left":
          L = Wl(I, S, A.right - 1, te, D.left + 1, Y);
          break;
        case "right":
          L = Wl(I, S, D.right - 1, te, A.left + 1, Y);
          break;
        default:
      }
      if (L) return;
      if (p && !lM(I, S, D)) {
        N();
        return;
      }
      if (!T && C(I, S)) {
        N();
        return;
      }
      let j = false;
      switch (f) {
        case "top": {
          let z = k ? bt / 2 : bt * 4, J = k || _ ? r + z : r - z, X = k ? r - z : _ ? r + z : r - z, pe = i + bt + 1, de = _ || k ? A.bottom - bt : A.top, ye = _ ? k ? A.bottom - bt : A.top : A.bottom - bt;
          j = Gl(I, S, J, pe, X, pe, A.left, de, A.right, ye);
          break;
        }
        case "bottom": {
          let z = k ? bt / 2 : bt * 4, J = k || _ ? r + z : r - z, X = k ? r - z : _ ? r + z : r - z, pe = i - bt, de = _ || k ? A.top + bt : A.bottom, ye = _ ? k ? A.top + bt : A.bottom : A.top + bt;
          j = Gl(I, S, J, pe, X, pe, A.left, de, A.right, ye);
          break;
        }
        case "left": {
          let z = F ? bt / 2 : bt * 4, J = F || B ? i + z : i - z, X = F ? i - z : B ? i + z : i - z, pe = r + bt + 1, de = B || F ? A.right - bt : A.left, ye = B ? F ? A.right - bt : A.left : A.right - bt;
          j = Gl(I, S, de, A.top, ye, A.bottom, pe, J, pe, X);
          break;
        }
        case "right": {
          let z = F ? bt / 2 : bt * 4, J = F || B ? i + z : i - z, X = F ? i - z : B ? i + z : i - z, pe = r - bt, de = B || F ? A.left + bt : A.right, ye = B ? F ? A.left + bt : A.right : A.left + bt;
          j = Gl(I, S, pe, J, pe, X, de, A.top, ye, A.bottom);
          break;
        }
        default:
      }
      j ? p || o.start(40, N) : N();
    };
  };
  return n.__options = { ...e4, blockPointerEvents: t }, n;
}
function Xx({ store: e4, parentContext: t, isDrawer: o }) {
  let n = e4.useState("open"), r = e4.useState("disablePointerDismissal"), i = e4.useState("modal"), s = e4.useState("popupElement"), a = e4.useState("floatingRootContext"), [l, c] = Kd.useState(0), [u, f] = Kd.useState(0), p = l === 0, m = xn(a, { outsidePressEvent() {
    return e4.context.internalBackdropRef.current || e4.context.backdropRef.current ? "intentional" : { mouse: i === "trap-focus" ? "sloppy" : "intentional", touch: "sloppy" };
  }, outsidePress(d) {
    if (!e4.context.outsidePressEnabledRef.current || "button" in d && d.button !== 0) return false;
    if ("touches" in d) {
      if (d.type === "touchend") {
        if (d.changedTouches.length !== 1 || d.touches.length !== 0) return false;
      } else if (d.touches.length !== 1) return false;
    }
    let h = We(d);
    if (p && !r) {
      if (i) {
        let C = e4.context.internalBackdropRef.current, g = e4.context.backdropRef.current;
        return C || g ? C === h || g === h || me(h, s) && !h?.hasAttribute("data-base-ui-portal") : true;
      }
      return true;
    }
    return false;
  }, escapeKey: p });
  return fl(n && i === true, s), e4.useContextCallback("onNestedDialogOpen", (d, h) => {
    c(d), f(h);
  }), W(() => (t?.onNestedDialogOpen && (n ? t.onNestedDialogOpen(l + 1, u + (o ? 1 : 0)) : t.onNestedDialogOpen(0, 0)), () => {
    t?.onNestedDialogOpen && n && t.onNestedDialogOpen(0, 0);
  }), [o, n, l, u, t]), Mr(e4, { activeTriggerProps: m.reference, inactiveTriggerProps: m.trigger, popupProps: m.floating, nestedOpenDialogCount: l, nestedOpenDrawerCount: u }), null;
}
var $l = E(M(), 1);
var Yd = $l.createContext(void 0);
function no(e4) {
  let t = $l.useContext(Yd);
  if (!e4 && t === void 0) throw new Error(Re(27));
  return t;
}
var zl = E(M(), 1);
var Ln = class extends xo {
  setState(t) {
  }
  update(t) {
  }
  set(t, o) {
  }
  notifyAll() {
  }
};
var Zx = { ...Dr, modal: (e4) => e4.modal, nested: (e4) => e4.nested, nestedOpenDialogCount: (e4) => e4.nestedOpenDialogCount, nestedOpenDrawerCount: (e4) => e4.nestedOpenDrawerCount, disablePointerDismissal: (e4) => e4.disablePointerDismissal, openMethod: (e4) => e4.openMethod, descriptionElementId: (e4) => e4.descriptionElementId, titleElementId: (e4) => e4.titleElementId, viewportElement: (e4) => e4.viewportElement, role: (e4) => e4.role };
var Kl = class extends xo {
  constructor(t, o, n) {
    let r = new Ro(), i = Qx(t, r, o, n);
    super(i, eR(r), Zx);
  }
  setOpen = (t, o) => {
    o.preventUnmountOnClose = () => {
      this.set("preventUnmountingOnClose", true);
    }, !t && o.trigger == null && this.state.activeTriggerId != null && (o.trigger = this.state.activeTriggerElement ?? void 0), this.context.onOpenChange?.(t, o), !o.isCanceled && (this.state.floatingRootContext.dispatchOpenChange(t, o), this.update(Ii(this.state, t, o.trigger)));
  };
};
function Jx() {
  let e4 = new Ro();
  return new Ln(Object.freeze(Qx(void 0, e4)), Object.freeze(eR(e4)), Zx);
}
function Qx(e4, t, o, n = false) {
  return { ...Nr(t, o, n), modal: true, disablePointerDismissal: false, viewportElement: null, descriptionElementId: void 0, titleElementId: void 0, openMethod: null, nested: false, nestedOpenDialogCount: 0, nestedOpenDrawerCount: 0, role: "dialog", ...e4 };
}
function eR(e4) {
  return { popupRef: zl.createRef(), backdropRef: zl.createRef(), internalBackdropRef: zl.createRef(), outsidePressEnabledRef: { current: true }, triggerElements: e4, onOpenChange: void 0, onOpenChangeComplete: void 0 };
}
var Va = E(Ie(), 1);
function oR(e4, t) {
  let { children: o, open: n, defaultOpen: r = false, onOpenChange: i, onOpenChangeComplete: s, disablePointerDismissal: a = false, modal: l = true, actionsRef: c, handle: u, triggerId: f, defaultTriggerId: p = null } = t, m = e4 === "drawer", d = e4 === "alert-dialog", h = d ? true : l, C = d || a, g = d ? "alertdialog" : "dialog", x = no(true), b = x != null, y = { modal: h, disablePointerDismissal: C, nested: b, role: g }, R = gs((P, O) => new Kl({ open: r, openProp: n, activeTriggerId: p, triggerIdProp: f, ...y }, P, O), true);
  R.useControlledProp("openProp", n), R.useControlledProp("triggerIdProp", f), R.useSyncedValues(y), R.useContextCallback("onOpenChange", i), R.useContextCallback("onOpenChangeComplete", s);
  let I = R.useState("open"), S = R.useState("mounted"), v = R.useState("payload");
  Ll(R, I), wr(R);
  let { forceUnmount: T } = Or(I, R);
  tR.useImperativeHandle(c, () => ({ unmount: T, close: () => R.setOpen(false, Q(H.imperativeAction)) }), [T, R]);
  let w = I || S;
  return (0, Va.jsxs)(Yd.Provider, { value: R, children: [u && (0, Va.jsx)(Pr, { handle: u, store: R }), w && (0, Va.jsx)(Xx, { store: R, parentContext: x?.context, isDrawer: m }), typeof o == "function" ? o({ payload: v }) : o] });
}
var nR = E(M(), 1);
var rR = nR.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, forceRender: s = false, ...a } = t, l = no(), c = l.useState("open"), u = l.useState("nested"), f = l.useState("mounted"), p = l.useState("transitionStatus");
  return U("div", t, { state: { open: c, transitionStatus: p }, ref: [l.context.backdropRef, o], stateAttributesMapping: qo, props: [{ role: "presentation", hidden: !f, style: { userSelect: "none", WebkitUserSelect: "none" } }, a], enabled: s || !u });
});
var iR = E(M(), 1);
var sR = iR.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, disabled: s = false, nativeButton: a = true, ...l } = t, c = no(), u = c.useState("open"), { getButtonProps: f, buttonRef: p } = Ke({ disabled: s, native: a }), m = { disabled: s };
  function d(h) {
    u && c.setOpen(false, Q(H.closePress, h.nativeEvent));
  }
  return U("button", t, { state: m, ref: [o, p], props: [{ onClick: d }, l, f] });
});
var aR = E(M(), 1);
var cR = aR.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, id: s, ...a } = t, l = no(), c = Pe(s);
  return l.useSyncedValueWithCleanup("descriptionElementId", c), U("p", t, { ref: o, props: [{ id: c }, a] });
});
var dR = E(M(), 1);
var Yl = E(M(), 1);
var qd = Yl.createContext(void 0);
function ql() {
  let e4 = Yl.useContext(qd);
  if (e4 === void 0) throw new Error(Re(26));
  return e4;
}
var xs = "ArrowUp";
var Rs = "ArrowDown";
var Cs = "ArrowLeft";
var ys = "ArrowRight";
var vs = "Home";
var Es = "End";
var Xd = "PageUp";
var Zd = "PageDown";
var Rn = /* @__PURE__ */ new Set([xs, Rs, Cs, ys, vs, Es]);
var Jd = "Shift";
var uR = [Jd, "Control", "Alt", "Meta"];
function uM(e4) {
  return Ve(e4) && e4.tagName === "INPUT";
}
function Qd(e4) {
  return !!(uM(e4) && e4.selectionStart != null || Ve(e4) && e4.tagName === "TEXTAREA");
}
function em(e4, t, o, n) {
  if (!e4 || !t || !t.scrollTo) return;
  let r = e4.scrollLeft, i = e4.scrollTop, s = e4.clientWidth < e4.scrollWidth, a = e4.clientHeight < e4.scrollHeight;
  if (s && n !== "vertical") {
    let l = lR(e4, t, "left"), c = Xl(e4), u = Xl(t);
    o === "ltr" && (l + t.offsetWidth + u.scrollMarginRight > e4.scrollLeft + e4.clientWidth - c.scrollPaddingRight ? r = l + t.offsetWidth + u.scrollMarginRight - e4.clientWidth + c.scrollPaddingRight : l - u.scrollMarginLeft < e4.scrollLeft + c.scrollPaddingLeft && (r = l - u.scrollMarginLeft - c.scrollPaddingLeft)), o === "rtl" && (l - u.scrollMarginLeft < e4.scrollLeft + c.scrollPaddingLeft ? r = l - u.scrollMarginLeft - c.scrollPaddingLeft : l + t.offsetWidth + u.scrollMarginRight > e4.scrollLeft + e4.clientWidth - c.scrollPaddingRight && (r = l + t.offsetWidth + u.scrollMarginRight - e4.clientWidth + c.scrollPaddingRight));
  }
  if (a && n !== "horizontal") {
    let l = lR(e4, t, "top"), c = Xl(e4), u = Xl(t);
    l - u.scrollMarginTop < e4.scrollTop + c.scrollPaddingTop ? i = l - u.scrollMarginTop - c.scrollPaddingTop : l + t.offsetHeight + u.scrollMarginBottom > e4.scrollTop + e4.clientHeight - c.scrollPaddingBottom && (i = l + t.offsetHeight + u.scrollMarginBottom - e4.clientHeight + c.scrollPaddingBottom);
  }
  e4.scrollTo({ left: r, top: i, behavior: "auto" });
}
function lR(e4, t, o) {
  let n = o === "left" ? "offsetLeft" : "offsetTop", r = 0;
  for (; t.offsetParent && (r += t[n], t.offsetParent !== e4); ) t = t.offsetParent;
  return r;
}
function Xl(e4) {
  let t = getComputedStyle(e4);
  return { scrollMarginTop: parseFloat(t.scrollMarginTop) || 0, scrollMarginRight: parseFloat(t.scrollMarginRight) || 0, scrollMarginBottom: parseFloat(t.scrollMarginBottom) || 0, scrollMarginLeft: parseFloat(t.scrollMarginLeft) || 0, scrollPaddingTop: parseFloat(t.scrollPaddingTop) || 0, scrollPaddingRight: parseFloat(t.scrollPaddingRight) || 0, scrollPaddingBottom: parseFloat(t.scrollPaddingBottom) || 0, scrollPaddingLeft: parseFloat(t.scrollPaddingLeft) || 0 };
}
var fR = "--nested-dialogs";
var x5 = di.open;
var R5 = di.closed;
var C5 = di.startingStyle;
var y5 = di.endingStyle;
var pR = "data-nested-dialog-open";
var Zl = { ...ao, ...Ot, nestedDialogOpen(e4) {
  return e4 ? { [pR]: "" } : null;
} };
var mR = E(Ie(), 1);
var gR = dR.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, finalFocus: s, initialFocus: a, ...l } = t, c = no(), u = c.useState("descriptionElementId"), f = c.useState("disablePointerDismissal"), p = c.useState("floatingRootContext"), m = c.useState("popupProps"), d = c.useState("modal"), h = c.useState("mounted"), C = c.useState("nested"), g = c.useState("nestedOpenDialogCount"), x = c.useState("open"), b = c.useState("openMethod"), y = c.useState("titleElementId"), R = c.useState("transitionStatus"), I = c.useState("role"), S = p.useState("floatingId");
  ql(), it({ open: x, ref: c.context.popupRef, onComplete() {
    x && c.context.onOpenChangeComplete?.(true);
  } });
  let v = a === void 0 ? Vl(c.context.popupRef) : a, T = g > 0, w = c.useStateSetter("popupElement"), O = U("div", t, { state: { open: x, nested: C, transitionStatus: R, nestedDialogOpen: T }, props: [m, { id: S, "aria-labelledby": y, "aria-describedby": u, role: I, ...Fn, hidden: !h, onKeyDown(N) {
    Rn.has(N.key) && N.stopPropagation();
  }, style: { [fR]: g } }, l], ref: [o, c.context.popupRef, w], stateAttributesMapping: Zl });
  return (0, mR.jsx)(er, { context: p, openInteractionType: b, disabled: !h, closeOnFocusOut: !f, initialFocus: v, returnFocus: s, modal: d !== false, restoreFocus: "popup", children: O });
});
var xR = E(M(), 1);
function en(e4) {
  return Zi(19) ? e4 : e4 ? "true" : void 0;
}
var hR = E(M(), 1);
var bR = E(Ie(), 1);
var Fr = hR.forwardRef(function(t, o) {
  let { cutout: n, ...r } = t, i;
  if (n) {
    let s = n.getBoundingClientRect();
    i = `polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 0%,${s.left}px ${s.top}px,${s.left}px ${s.bottom}px,${s.right}px ${s.bottom}px,${s.right}px ${s.top}px,${s.left}px ${s.top}px)`;
  }
  return (0, bR.jsx)("div", { ref: o, role: "presentation", "data-base-ui-inert": "", ...r, style: { position: "fixed", inset: 0, userSelect: "none", WebkitUserSelect: "none", clipPath: i } });
});
var La = E(Ie(), 1);
var RR = xR.forwardRef(function(t, o) {
  let { keepMounted: n = false, ...r } = t, i = no(), s = i.useState("mounted"), a = i.useState("modal"), l = i.useState("open");
  return s || n ? (0, La.jsx)(qd.Provider, { value: n, children: (0, La.jsxs)(Qn, { ref: o, ...r, children: [s && a === true && (0, La.jsx)(Fr, { ref: i.context.internalBackdropRef, inert: en(!l) }), t.children] }) }) : null;
});
var CR = E(M(), 1);
var yR = CR.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, id: s, ...a } = t, l = no(), c = Pe(s);
  return l.useSyncedValueWithCleanup("titleElementId", c), U("h2", t, { ref: o, props: [{ id: c }, a] });
});
var IR = E(M(), 1);
var Ba = E(M(), 1);
var _a = E(M(), 1);
function vR(e4) {
  let t = _a.useRef(""), o = _a.useCallback((r) => {
    r.defaultPrevented || (t.current = r.pointerType, e4(r, r.pointerType));
  }, [e4]);
  return { onClick: _a.useCallback((r) => {
    if (r.detail === 0) {
      e4(r, "keyboard");
      return;
    }
    "pointerType" in r ? e4(r, r.pointerType) : e4(r, t.current), t.current = "";
  }, [e4]), onPointerDown: o };
}
var ER = E(M(), 1);
function Jt(e4, t) {
  let o = ER.useRef(e4), n = G(t);
  W(() => {
    o.current !== e4 && n(o.current), o.current = e4;
  }, [e4, n]);
}
function Ha(e4, t) {
  let o = G((i, s) => {
    (typeof e4 == "function" ? e4() : e4) || t(s || (Je.os.ios ? "touch" : ""));
  }), { onClick: n, onPointerDown: r } = vR(o);
  return Ba.useMemo(() => ({ onClick: n, onPointerDown: r }), [n, r]);
}
function Jl(e4) {
  let [t, o] = Ba.useState(null), n = Ha(e4, o);
  return Jt(e4, (r) => {
    r && !e4 && o(null);
  }), Ba.useMemo(() => ({ openMethod: t, triggerProps: n }), [t, n]);
}
var SR = Ir(function(t, o) {
  let { render: n, className: r, style: i, disabled: s = false, nativeButton: a = true, id: l, payload: c, handle: u, ...f } = t, p = no(true), d = Ar(u) ?? p;
  if (!d) throw new Error(Re(79));
  let h = Pe(l), C = d.useState("floatingRootContext"), g = d.useState("isOpenedByTrigger", h), x = d.useState("triggerPopupId", h), b = IR.useRef(null), { registerTrigger: y, isMountedByThisTrigger: R } = Tr(h, b, d, { payload: c }), { getButtonProps: I, buttonRef: S } = Ke({ disabled: s, native: a }), v = Uo(C), T = Ha(() => d.select("open"), (O) => {
    d.set("openMethod", O);
  }), w = { disabled: s, open: g }, P = d.useState("triggerProps", R);
  return U("button", t, { state: w, ref: [S, o, y, b], props: [v.reference, P, T, { [fs]: "", id: h, "aria-haspopup": "dialog", "aria-expanded": g, "aria-controls": x }, f, I], stateAttributesMapping: Mn });
});
var PR = E(M(), 1);
var TR = PR.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, children: s, ...a } = t, l = ql(), c = no(), u = c.useState("open"), f = c.useState("nested"), p = c.useState("transitionStatus"), m = c.useState("nestedOpenDialogCount"), d = c.useState("mounted"), h = c.useStateSetter("viewportElement"), C = m > 0;
  return U("div", t, { enabled: l || d, state: { open: u, nested: f, transitionStatus: p, nestedDialogOpen: C }, ref: [o, h], stateAttributesMapping: Zl, props: [{ role: "presentation", hidden: !d, style: { pointerEvents: u ? void 0 : "none" }, children: s }, a] });
});
var Ua = class extends kn {
  constructor() {
    super(Jx(), "Dialog", false);
  }
  open(t) {
    this.openByTrigger(t);
  }
  openWithPayload(t) {
    let o = this.attachedStore;
    o !== null && (o.set("payload", t), o.setOpen(true, Q(H.imperativeAction)));
  }
  close() {
    this.closePopup();
  }
  get isOpen() {
    return this.attachedStore?.select("open") ?? false;
  }
};
function wR() {
  return new Ua();
}
var Ue = E(M(), 1);
var OR = E(M(), 1);
function MR(e4) {
  let t = OR.useRef(true);
  t.current && (t.current = false, e4());
}
function NR(e4, t, o, n, r, i, s, a, l, c = 2) {
  let u = Tb(o.current, { event: e4, orientation: n, loopFocus: r, rtl: i, cols: c, disabledIndices: s, minIndex: a, maxIndex: l, prevIndex: t > l ? a : t, stopEvent: true });
  return Jo(o.current, u) ? void 0 : u;
}
var tn = E(M(), 1);
var tm = tn.createContext(void 0);
var om = tn.createContext(void 0);
var nm = tn.createContext(void 0);
var rm = tn.createContext(false);
var im = tn.createContext("");
function Ye() {
  let e4 = tn.useContext(tm);
  if (!e4) throw new Error(Re(22));
  return e4;
}
function Vr() {
  let e4 = tn.useContext(om);
  if (!e4) throw new Error(Re(23));
  return e4;
}
function on() {
  let e4 = tn.useContext(nm);
  if (!e4) throw new Error(Re(24));
  return e4;
}
function Is() {
  return tn.useContext(im);
}
function DR() {
  return tn.useContext(rm);
}
function ja(e4, t, o = Object.is) {
  let { length: n } = e4;
  if (n !== t.length) return false;
  for (let r = 0; r < n; r += 1) if (!o(e4[r], t[r])) return false;
  return true;
}
var Wa = (e4, t) => Object.is(e4, t);
function jo(e4, t, o) {
  return e4 == null || t == null ? Object.is(e4, t) : o(e4, t);
}
function AR(e4, t, o) {
  return Array.isArray(e4) && Array.isArray(t) ? !ja(e4, t, (n, r) => jo(n, r, o)) : e4 !== t;
}
function Ga(e4, t, o) {
  return e4 ? e4.some((n) => n === void 0 ? false : jo(t, n, o)) : false;
}
function Ti(e4, t, o) {
  return e4 ? e4.findIndex((n) => n === void 0 ? false : jo(n, t, o)) : -1;
}
function dM(e4, t) {
  if (t !== Wa) return (n) => Ga(e4, n, t);
  let o = new Set(e4);
  return o.delete(void 0), (n) => o.has(n) && (n !== 0 || e4.some((r) => Object.is(n, r)));
}
function $a(e4, t, o, n) {
  let r = n && Array.isArray(t) ? e4.findIndex(dM(t, o)) : Ti(e4, t, o);
  return r === -1 ? null : r;
}
function kR(e4, t, o, n, r, i) {
  return Ga(n, t, r) ? i != null && e4 > i && Ga(n, o[i], r) ? i : e4 : e4 === i ? $a(o, n, r, true) : i;
}
function FR(e4, t, o) {
  return e4.filter((n) => !jo(t, n, o));
}
var VR = E(M(), 1);
function Ss(e4) {
  if (e4 == null) return "";
  if (typeof e4 == "string") return e4;
  try {
    return JSON.stringify(e4);
  } catch {
    return String(e4);
  }
}
var LR = E(Ie(), 1);
function mM(e4) {
  return typeof e4 == "object" && e4 != null && Array.isArray(e4.items);
}
function Ql(e4) {
  return mM(e4?.[0]);
}
function wi(e4) {
  return Ql(e4) ? e4.flatMap((t) => t.items) : e4;
}
function _R(e4) {
  if (!Array.isArray(e4)) return e4 != null && "null" in e4;
  let t = e4;
  if (Ql(t)) {
    for (let o of t) for (let n of o.items) if (n && n.value == null && n.label != null) return true;
    return false;
  }
  for (let o of t) if (o && o.value == null && o.label != null) return true;
  return false;
}
function Go(e4, t) {
  if (t && e4 != null) return t(e4) ?? "";
  if (e4 && typeof e4 == "object") {
    if ("label" in e4 && e4.label != null) return String(e4.label);
    if ("value" in e4) return String(e4.value);
  }
  return Ss(e4);
}
function Ps(e4, t) {
  return t && e4 != null ? t(e4) ?? "" : e4 && typeof e4 == "object" && "value" in e4 && "label" in e4 ? Ss(e4.value) : Ss(e4);
}
function sm(e4, t, o) {
  function n() {
    return Go(e4, o);
  }
  if (o && e4 != null) return o(e4);
  if (e4 && typeof e4 == "object" && "label" in e4 && e4.label != null) return e4.label;
  if (t && !Array.isArray(t)) return (Object.hasOwn(t, e4) ? t[e4] : void 0) ?? n();
  if (Array.isArray(t)) {
    let i = wi(t);
    if (e4 == null || typeof e4 != "object") {
      let s = i.find((a) => a.value === e4);
      return s && s.label != null ? s.label : n();
    }
    if ("value" in e4) {
      let s = i.find((a) => a && a.value === e4.value);
      if (s && s.label != null) return s.label;
    }
  }
  return n();
}
function BR(e4, t, o) {
  return e4.reduce((n, r, i) => (i > 0 && n.push(", "), n.push((0, LR.jsx)(VR.Fragment, { children: sm(r, t, o) }, i)), n), []);
}
var HR = { id: (e4) => e4.id, labelId: (e4) => e4.labelId, items: (e4) => e4.items, selectedValue: (e4) => e4.selectedValue, hasSelectionChips: (e4) => {
  let t = e4.selectedValue;
  return Array.isArray(t) && t.length > 0;
}, hasSelectedValue: (e4) => {
  let { selectedValue: t, selectionMode: o } = e4;
  return t == null ? false : o === "multiple" && Array.isArray(t) ? t.length > 0 : true;
}, hasNullItemLabel: (e4, t) => t ? _R(e4.items) : false, open: (e4) => e4.open, mounted: (e4) => e4.mounted, forceMounted: (e4) => e4.forceMounted, inline: (e4) => e4.inline, activeIndex: (e4) => e4.activeIndex, selectedIndex: (e4) => e4.selectedIndex, isActive: (e4, t) => e4.activeIndex === t, isSelected: (e4, t) => {
  let o = e4.isItemEqualToValue, n = e4.selectedValue;
  return Array.isArray(n) ? n.some((r) => jo(t, r, o)) : jo(t, n, o);
}, transitionStatus: (e4) => e4.transitionStatus, popupProps: (e4) => e4.popupProps, listProps: (e4) => e4.listProps, inputProps: (e4) => e4.inputProps, triggerProps: (e4) => e4.triggerProps, itemProps: (e4) => e4.itemProps, positionerElement: (e4) => e4.positionerElement, listElement: (e4) => e4.listElement, popupId: (e4) => e4.popupId, triggerElement: (e4) => e4.triggerElement, inputElement: (e4) => e4.inputElement, inputGroupElement: (e4) => e4.inputGroupElement, popupSide: (e4) => e4.popupSide, openMethod: (e4) => e4.openMethod, inputInsidePopup: (e4) => e4.inputInsidePopup, inputOwnsFormValue: (e4) => e4.inputOwnsFormValue, selectionMode: (e4) => e4.selectionMode, name: (e4) => e4.name, form: (e4) => e4.form, disabled: (e4) => e4.disabled, readOnly: (e4) => e4.readOnly, required: (e4) => e4.required, grid: (e4) => e4.grid, virtualized: (e4) => e4.virtualized, itemToStringLabel: (e4) => e4.itemToStringLabel, isItemEqualToValue: (e4) => e4.isItemEqualToValue, modal: (e4) => e4.modal, autoHighlight: (e4) => e4.autoHighlight };
var eu = E(M(), 1);
var UR = "data-valid";
var jR = "data-invalid";
var Oi = { badInput: false, customError: false, patternMismatch: false, rangeOverflow: false, rangeUnderflow: false, stepMismatch: false, tooLong: false, tooShort: false, typeMismatch: false, valid: null, valueMissing: false };
var am = { valid: null, touched: false, dirty: false, filled: false, focused: false };
var GR = { disabled: false, ...am };
var vt = { valid(e4) {
  return e4 === null ? null : e4 ? { [UR]: "" } : { [jR]: "" };
} };
var cm = { invalid: void 0, name: void 0, validityData: { state: Oi, errors: [], error: "", value: "", initialValue: null }, setValidityData: Oe, disabled: void 0, setTouched: Oe, setDirty: Oe, setFilled: Oe, setFocused: Oe, validationMode: "onSubmit", shouldValidateOnChange: () => false, state: GR, registerFieldControl: Oe, validation: { getValidationProps: (e4, t = Me) => t, inputRef: { current: null }, registeredInputs: /* @__PURE__ */ new Map(), registerInput: Oe, getInputControl: () => null, commit: async () => {
}, change: Oe } };
var za = eu.createContext(cm);
function Qe(e4 = true) {
  let t = eu.useContext(za);
  if (t.setValidityData === Oe && !e4) throw new Error(Re(28));
  return t;
}
function nn(e4, t, o, n, r = true, i) {
  let { registerFieldControl: s } = Qe(), a = qe(() => Symbol());
  W(() => {
    let l = a.current;
    if (!r) {
      s(l, void 0);
      return;
    }
    s(l, { controlRef: e4, getValue: n, id: t, name: i, value: o });
  }, [e4, r, n, t, i, s, a, o]), W(() => {
    let l = a.current;
    return () => {
      s(l, void 0);
    };
  }, [s, a]);
}
var tu = E(M(), 1);
var hM = tu.createContext({ elementRef: { current: null }, formRef: { current: { fields: /* @__PURE__ */ new Map() } }, errors: {}, clearErrors: Oe, validationMode: "onSubmit", submitCountRef: { current: 0 } });
function Xt() {
  return tu.useContext(hM);
}
var um = E(M(), 1);
var ou = E(M(), 1);
var lm = ou.createContext({ controlId: void 0, registerControlId: Oe, resetControlId: Oe, labelId: void 0, setLabelId: Oe, messageIds: [], setMessageIds: Oe, getDescriptionProps: (e4) => e4 });
function pt() {
  return ou.useContext(lm);
}
function Vo(e4 = {}) {
  let { id: t, enabled: o = true } = e4, { controlId: n, registerControlId: r, resetControlId: i } = pt(), s = Pe(), a = qe(() => Symbol()), l = um.useRef(false), c = um.useRef(false), u = G(() => {
    !l.current || r === Oe || (l.current = false, r(a.current, void 0));
  });
  return W(() => {
    if (!o || r === Oe) {
      u();
      return;
    }
    let f;
    if (t !== void 0) c.current = true, f = t;
    else if (c.current) f = s;
    else {
      i();
      return;
    }
    if (f === void 0) {
      u();
      return;
    }
    l.current = true, r(a.current, f);
  }, [t, o, r, i, s, a, u]), W(() => u, [u]), (o ? n : void 0) ?? t ?? s;
}
function nu(e4) {
  return e4 == null ? void 0 : `${e4}-popup`;
}
function ru(e4, t) {
  return (o, n) => o == null ? false : e4.contains(o, n, t);
}
function WR(e4, t, o) {
  return (n, r) => {
    if (n == null) return false;
    if (!r) return true;
    let i = t?.selected ?? t, s = o != null ? Go(o, i) : "";
    return s && e4.contains(s, r) && s.length === r.length ? true : e4.contains(n, r, t);
  };
}
var iu = E(M(), 1);
function Ka(e4) {
  return Array.isArray(e4) ? e4.map((t) => Ka(t)).join(",") : e4 == null ? "" : String(e4);
}
var $R = /* @__PURE__ */ new Map();
function fm(e4 = {}) {
  let t = { usage: "search", sensitivity: "base", ignorePunctuation: true, ...e4 }, o = `${Ka(e4.locale)}|${JSON.stringify(t)}`, n = $R.get(o);
  if (n) return n;
  let r = new Intl.Collator(e4.locale, t), i = { contains(s, a, l) {
    if (!a) return true;
    let c = Go(s, l);
    for (let u = 0; u <= c.length - a.length; u += 1) if (r.compare(c.slice(u, u + a.length), a) === 0) return true;
    return false;
  }, startsWith(s, a, l) {
    if (!a) return true;
    let c = Go(s, l);
    return r.compare(c.slice(0, a.length), a) === 0;
  }, endsWith(s, a, l) {
    if (!a) return true;
    let c = Go(s, l), u = a.length;
    return c.length >= u && r.compare(c.slice(c.length - u), a) === 0;
  } };
  return $R.set(o, i), i;
}
var zR = fm;
function KR(e4 = {}) {
  let { multiple: t = false, value: o, ...n } = e4, r = fm(n), i = iu.useCallback((s, a, l) => t ? ru(r, l)(s, a) : WR(r, l, o)(s, a), [r, o, t]);
  return iu.useMemo(() => ({ ...r, contains: i }), [i, r]);
}
function YR(e4, t = false) {
  let { overflowY: o } = Ut(e4);
  return o !== "auto" && o !== "scroll" ? false : t ? e4.clientHeight > 0 : e4.scrollHeight > e4.clientHeight;
}
var pm = Symbol("none");
var su = { value: pm, index: -1 };
var au = E(M(), 1);
var bM = au.createContext(void 0);
function Zt() {
  return au.useContext(bM)?.direction ?? "ltr";
}
function Ya(e4, t, o) {
  let n = e4.get(t);
  if (n !== void 0 || o === Wa) return n;
  for (let [r, i] of e4) if (jo(r, t, o)) return i;
}
var _n = E(Ie(), 1);
function qR(e4) {
  let { id: t, onOpenChangeComplete: o, defaultSelectedValue: n = null, selectedValue: r, onSelectedValueChange: i, defaultInputValue: s, inputValue: a, open: l, defaultOpen: c = false, selectionMode: u, onItemHighlighted: f, name: p, form: m, disabled: d = false, readOnly: h = false, required: C = false, inputRef: g, grid: x = false, items: b, filteredItems: y, filter: R, filterQuery: I, openOnInputClick: S = true, autoHighlight: v = false, keepHighlight: T = false, highlightItemOnHover: w = true, loopFocus: P = true, itemToStringLabel: O, itemToStringValue: N, isItemEqualToValue: D = Wa, virtualized: A = false, inline: _ = false, fillInputOnItemPress: B = true, modal: k = false, limit: F = -1, autoComplete: $ = "list", formAutoComplete: K, locale: Y, submitOnItemClick: te = false } = e4, { clearErrors: L } = Xt(), { setDirty: j, validityData: z, setFilled: J, name: X, disabled: pe, setTouched: de, setFocused: ye, validationMode: ce, validation: fe } = Qe(), se = Zt(), ge = Vo({ id: t }), be = zR({ locale: Y }), re = Array.isArray(b) ? null : b;
  if (re && typeof re.label != "function") throw new Error(Re(100));
  let Z = re ? re.data : b, ee = re?.value, le = ee ? void 0 : Z, ue = Ue.useMemo(() => {
    if (!y || !ee) return;
    let Ce = wi(y), Se = Ce.map(ee), Ze;
    return { values: Se, findItem(ft, Bt) {
      if (!Ze) {
        Ze = /* @__PURE__ */ new Map();
        for (let Yt = 0; Yt < Se.length; Yt += 1) Ze.has(Se[Yt]) || Ze.set(Se[Yt], Ce[Yt]);
      }
      return Ya(Ze, ft, Bt);
    } };
  }, [y, ee]), xe = Ue.useMemo(() => re ? (Ce) => re.label(Ce, D, (Se) => {
    let Ze = ue?.findItem(Se, D);
    return Ze != null ? re.itemLabel(Ze) : Go(Se, O);
  }) : O, [re, O, ue, D]), ae = Ue.useMemo(() => re ? Object.assign((Ce) => re.itemLabel(Ce), { selected: (Ce) => Go(Ce, xe) }) : O, [re, xe, O]);
  function oe(Ce) {
    return Go(Ce, xe);
  }
  let [he, ne] = Ue.useState(false), [q, Ee] = Ue.useState(null), we = Ue.useRef(q), je = Ue.useRef([]), et = Ue.useRef([]), ke = Ue.useRef(null), ve = Ue.useRef(null), Fe = Ue.useRef(null), nt = Ue.useRef(null), Vt = Ue.useRef(null), Ge = Ue.useRef(true), Ne = Ue.useRef(false), mt = Ue.useRef(null), tt = Ue.useRef(null), Pt = Ue.useRef(null), _e = Ue.useRef(su), gt = Ue.useRef(null), ut = Ue.useRef([]), Kt = Ue.useRef(null), Mt = pe || d, At = X ?? p, Lt = u === "multiple", to = u === "single", He = a !== void 0 || s !== void 0, $e = Z !== void 0, Et = y !== void 0, at;
  v === "always" ? at = "always" : at = v ? "input-change" : false;
  let [ze, un] = yt({ controlled: r, default: Lt ? n ?? It : n, name: "Combobox", state: "selectedValue" }), $i = Ue.useMemo(() => R === null ? () => true : R !== void 0 ? R : ru(be, ae), [R, be, ae]), ni = qe(() => He ? s ?? "" : to ? oe(ze) : "").current, [_t, ta] = yt({ controlled: a, default: ni, name: "Combobox", state: "inputValue" }), [Nt, IP] = yt({ controlled: l, default: c, name: "Combobox", state: "open" }), Ug = Ql(Z), zo = !Nt && q !== null ? q : String(_t).trim(), ri = to ? oe(ze) : "", jg = to && !he && zo !== "" && ri.length === zo.length && be.contains(ri, zo), zi = jg ? "" : I ?? zo, Gg = $e && Et && jg && (!re || re.hasValue(ze, D)), kc = Ue.useMemo(() => Z ? wi(Z) : It, [Z]), oa = Ue.useMemo(() => {
    if (y && !Gg) return y;
    if (!Z) return It;
    if (Ug) {
      let Se = Z, Ze = [], ft = 0;
      for (let Bt of Se) {
        if (F > -1 && ft >= F) break;
        let Yt = F > -1 ? F - ft : 1 / 0, Dt = zi === "" ? Bt.items.slice(0, Yt) : [];
        if (zi !== "") for (let fo of Bt.items) {
          if (Dt.length >= Yt) break;
          $i(fo, zi, ae) && Dt.push(fo);
        }
        if (Dt.length > 0) {
          let fo = { ...Bt, items: Dt };
          Ze.push(fo), ft += Dt.length;
        }
      }
      return Ze;
    }
    if (zi === "") return F > -1 ? kc.slice(0, F) : kc;
    let Ce = [];
    for (let Se of kc) {
      if (F > -1 && Ce.length >= F) break;
      $i(Se, zi, ae) && Ce.push(Se);
    }
    return Ce;
  }, [y, Gg, Z, Ug, zi, F, $i, ae, kc]), Eo = Ue.useMemo(() => {
    if (ue && oa === y) return ue.values;
    let Ce = wi(oa);
    return ee ? Ce.map((Se) => ee(Se)) : Ce;
  }, [oa, y, ue, ee]), Ae = qe(() => {
    let Ce = null;
    return _ && Nt && $e && u !== "none" && (Ce = $a(Eo, ze, D, Lt)), new xo({ id: ge, labelId: void 0, selectedValue: ze, open: Nt, items: le, selectionMode: u, name: At, form: m, disabled: Mt, readOnly: h, required: C, grid: x, virtualized: A, openOnInputClick: S, itemToStringLabel: xe, isItemEqualToValue: D, modal: k, autoHighlight: at, submitOnItemClick: te, hasInputValue: He, mounted: false, forceMounted: false, transitionStatus: "idle", inline: _, activeIndex: null, selectedIndex: Ce, popupProps: {}, listProps: {}, inputProps: {}, triggerProps: {}, itemProps: Me, positionerElement: null, listElement: null, popupId: void 0, triggerElement: null, inputElement: null, inputGroupElement: null, popupSide: null, openMethod: null, inputInsidePopup: true, inputOwnsFormValue: u === "none" }, { onOpenChangeComplete: Oe, setOpen: Oe, setInputValue: Oe, setSelectedValue: Oe, setIndices: Oe, handleSelection: Oe, forceMount: Oe, requestSubmit: Oe, listRef: je, labelsRef: et, popupRef: ke, emptyRef: Vt, inputRef: ve, startDismissRef: Fe, endDismissRef: nt, keyboardActiveRef: Ge, chipsContainerRef: mt, clearRef: tt, valuesRef: ut, pointerDownItemRef: Kt, selectionEventRef: Pt }, HR);
  }).current, Ki = u === "none" ? _t : ze, SP = Ue.useMemo(() => u === "none" ? Ki : Array.isArray(ze) ? ze.map((Ce) => Ps(Ce, N)) : Ps(ze, N), [Ki, N, u, ze]), PP = G(f), TP = G(o), Wg = Ae.useState("activeIndex"), wP = Ae.useState("selectedIndex"), Fc = Ae.useState("positionerElement"), $g = Ae.useState("listElement"), na = Ae.useState("triggerElement"), Vc = Ae.useState("inputElement"), OP = Ae.useState("inputGroupElement"), No = Ae.useState("inline"), fn = Ae.useState("inputInsidePopup"), MP = Ae.useState("inputOwnsFormValue"), zg = to && !fn && _t === ri, NP = ct(na), { mounted: DP, setMounted: AP, transitionStatus: Kg } = wt(Nt), { openMethod: kP, triggerProps: Yg } = Jl(Nt), FP = G(() => SP);
  nn(fn ? NP : ve, ge, Ki, FP, !Mt, p);
  let qg = G(() => {
    Z ? et.current = Eo.map(oe) : Ae.set("forceMounted", true);
  }), Yi = G((Ce, Se, Ze) => {
    if (Se === -1) {
      if (_e.current === su) return;
      _e.current = su;
    } else _e.current = { value: Ce, index: Se };
    PP(Ce, Ji(Ze, void 0, { index: Se }));
  }), Sn = G((Ce) => {
    let Se = {};
    Ce.activeIndex !== void 0 && (Se.activeIndex = Ce.activeIndex), Ce.selectedIndex !== void 0 && (Se.selectedIndex = Ce.selectedIndex), Ae.update(Se);
    let Ze = Ce.activeIndex;
    if (Ze === void 0) return;
    let ft = Ce.type || H.none;
    Ze === null ? Yi(void 0, -1, ft) : Yi(ut.current[Ze], Ze, ft);
  }), Pn = G((Ce, Se) => {
    if (e4.onInputValueChange?.(Ce, Se), !Se.isCanceled) {
      if (Ne.current = Se.reason === H.inputClear, Se.reason === H.inputChange) {
        Nt && q !== null && Ee(null);
        let Ze = Se.event, ft = Ze.inputType;
        if (Ze.type === "compositionend" || ft != null && ft !== "" && ft !== "insertReplacementText") {
          let Yt = Ce.trim() !== "";
          Yt && ne(true), gt.current = { hasQuery: Yt };
          let Dt = Ae.state.listElement;
          if (!Ae.state.virtualized && Dt) {
            let fo = ke.current;
            for (let pn of dn(Dt.firstElementChild ?? Dt)) {
              if (!Ve(pn) || (fo ? !me(fo, pn) : pn.getAttribute("role") === "dialog")) break;
              if (YR(pn)) {
                pn.scrollTop = 0;
                break;
              }
            }
          }
          Yt && at && Ae.state.activeIndex == null && (Nt || No) && Ae.set("activeIndex", 0);
        }
      } else Se.reason === H.inputClear && Ce === "" && Ae.state.inputInsidePopup && (gt.current = { hasQuery: false, selection: true });
      ta(Ce);
    }
  }), Xg = G((Ce) => {
    let Se = !Ce && fn && !No && _t !== "" && (String(_t).trim() === q || _t === ri);
    !Ce && (Se || _t === "" || zg) && ne(false), Ee(null), Se && Pn("", Q(H.inputClear));
  }), ra = G((Ce, Se) => {
    if (Nt !== Ce && (Se.reason === H.escapeKey && $e && Eo.length === 0 && !Vt.current && Se.allowPropagation(), e4.onOpenChange?.(Ce, Se), !Se.isCanceled && (Ce && q !== null && Xg(Se.reason === H.inputChange), !Ce && he && (to ? (No || Ee(zo), zo === "" && ne(false)) : Lt && (No || Ee(zo), fn && Sn({ activeIndex: null }), (!fn || No) && Pn("", Q(H.inputClear, Se.event, void 0, { isItemPress: Se.reason === H.itemPress })))), IP(Ce), !Ce && fn && (Se.reason === H.focusOut || Se.reason === H.outsidePress) && (de(true), ye(false), ce === "onBlur")))) {
      let Ze = u === "none" ? _t : ze;
      fe.commit(Ze);
    }
  }), Lc = G((Ce, Se) => {
    if (i?.(Ce, Se), Se.isCanceled) return;
    un(Ce), (u === "none" && ke.current && B || to && !Ae.state.inputInsidePopup) && Pn(oe(Ce), Q(Se.reason, Se.event));
  }), VP = G((Ce, Se) => {
    let Ze = We(Ce), ft = Pt.current ?? Ce;
    Pt.current = null;
    let Bt = Q(H.itemPress, ft), Yt = Ze?.closest("a")?.getAttribute("href");
    if (Yt) {
      Yt.startsWith("#") && ra(false, Bt);
      return;
    }
    if (Lt) {
      let Dt = Array.isArray(ze) ? ze : [], fo = Ga(Dt, Se, D), pn = fo ? FR(Dt, Se, D) : [...Dt, Se];
      if (Lc(pn, Bt), Bt.isCanceled || !(ve.current ? ve.current.value.trim() !== "" : false)) return;
      if (Ae.state.inputInsidePopup) {
        Pn("", Q(H.inputClear, Bt.event, void 0, { isItemPress: true }));
        let dr = gt.current;
        dr && !fo && (dr.toggledValue = Se);
      } else ra(false, Bt);
    } else {
      if (Lc(Se, Bt), Bt.isCanceled) return;
      ra(false, Bt);
    }
  }), LP = G(() => {
    let Ce = fe.inputRef.current?.form ?? Ae.state.inputElement?.form;
    Ce && typeof Ce.requestSubmit == "function" && Ce.requestSubmit();
  }), Tp = G(() => {
    if (AP(false), TP?.(false), ne(false), Ee(null), Sn(u === "none" ? { activeIndex: null, selectedIndex: null } : { activeIndex: null }), Lt && ve.current && ve.current.value !== "" && !Ne.current && Pn("", Q(H.inputClear)), to) if (Ae.state.inputInsidePopup) ve.current && ve.current.value !== "" && Pn("", Q(H.inputClear));
    else {
      let Ce = oe(ze);
      if (ve.current && ve.current.value !== Ce) {
        let Se = Ce === "" ? H.inputClear : H.none;
        Pn(Ce, Q(Se));
      }
    }
  }), _P = Ue.useMemo(() => No && Fc ? { current: Fc.closest('[role="dialog"]') } : ke, [No, Fc]);
  it({ enabled: !e4.actionsRef, open: Nt, ref: _P, onComplete() {
    Nt || Tp();
  } }), Ue.useImperativeHandle(e4.actionsRef, () => ({ unmount: Tp }), [Tp]), W(function() {
    let Se = we.current !== null && q === null;
    if (we.current = q, Nt && (!Se || !$e) || (Nt || (Kt.current = null), u === "none")) return;
    let Ze = $e ? Eo : ut.current;
    Sn({ selectedIndex: $a(Ze, ze, D, Lt) });
  }, [Nt, q, ze, u, Lt, $e, Eo, D, Sn]), W(() => {
    Z && (ut.current = Eo, je.current.length = Eo.length);
  }, [Z, Eo]), W(() => {
    let Ce = gt.current;
    if (Ce) {
      let fo = Nt || No || Ae.state.positionerElement?.hidden === false;
      if (Ce.hasQuery) at && fo && Ae.set("activeIndex", 0), gt.current = null;
      else if (String(_t).trim() === "" && (gt.current = null, fo)) {
        let pn = Ce.selection;
        at === "always" && !pn && Ae.state.selectionMode === "none" && Ae.set("activeIndex", 0), queueMicrotask(() => {
          if (!Ae.state.open && !Ae.state.inline || ve.current && ve.current.value.trim() !== "") return;
          let ii = Ae.state.selectedValue, dr = Ae.state.selectionMode === "multiple";
          if (dr && Array.isArray(ii) ? ii.length > 0 : Ae.state.selectionMode !== "none" && ii != null) {
            let ch = $e || Et ? Eo : ut.current, lh = Ti(ch, Ce.toggledValue, Ae.state.isItemEqualToValue);
            Ae.set("activeIndex", lh !== -1 ? lh : $a(ch, ii, Ae.state.isItemEqualToValue, dr));
          } else pn ? Ae.set("activeIndex", null) : at === "always" && Ae.set("activeIndex", 0);
        });
      }
    }
    if (!Nt && !No) return;
    let Ze = $e || Et ? Eo : ut.current, ft = Ae.state.activeIndex;
    if (ft == null) {
      if (at === "always" && Ze.length > 0) {
        Ae.set("activeIndex", 0);
        return;
      }
      Yi(void 0, -1, H.none);
      return;
    }
    if (ft >= Ze.length) {
      Yi(void 0, -1, H.none), Ae.set("activeIndex", null);
      return;
    }
    let Bt = Ze[ft], Yt = _e.current.value, Dt = Yt !== pm && jo(Bt, Yt, Ae.state.isItemEqualToValue);
    (_e.current.index !== ft || !Dt) && Yi(Bt, ft, H.none);
  }, [Wg, at, Yi, Et, $e, Eo, No, Nt, Ae, _t]), W(() => {
    if (u === "none") {
      J(String(_t) !== "");
      return;
    }
    J(Lt ? Array.isArray(ze) && ze.length > 0 : ze != null);
  }, [J, u, _t, ze, Lt]), Ue.useEffect(() => {
    $e && at && Eo.length === 0 && Sn({ activeIndex: null });
  }, [$e, at, Eo.length, Sn]);
  function BP() {
    Nt && zo !== "" && zo !== String(ni) && !zg && ne(true);
  }
  function HP() {
    Nt && q !== null && Xg(false);
  }
  let Zg = false;
  function Jg() {
    !Zg && _t !== ri && (Zg = true, Pn(ri, Q(H.none)));
  }
  function UP() {
    u !== "none" && (L(At), j(AR(ze, z.initialValue, D)), fe.change(ze), to && !He && !fn && Jg());
  }
  function Qg() {
    to && !He && !fn && !he && Jg();
  }
  function jP() {
    u === "none" && (L(At), j(_t !== z.initialValue), fe.change(_t));
  }
  Jt(zo, BP), Jt(Nt, HP), Jt(ze, UP), Jt(ri, Qg), Jt(Z, Qg), Jt(_t, jP);
  let _c = jd({ open: No ? true : Nt, onOpenChange: ra, elements: { reference: fn ? na : Vc, floating: Fc } }), eh = x ? "grid" : "listbox", Bc = Nt || No, th = Bc ? "true" : "false", Hc = Ue.useMemo(() => {
    let Ce = Vc?.tagName === "INPUT", Se = Vc == null || Ce, Ze = Se || Bc, ft = Se ? { autoComplete: "off", spellCheck: "false", autoCorrect: "off", autoCapitalize: "none" } : {};
    return Ze && (ft.role = "combobox", ft["aria-expanded"] = th, ft["aria-haspopup"] = eh, ft["aria-controls"] = Bc ? $g?.id : void 0, ft["aria-autocomplete"] = h ? "none" : $), { reference: ft, floating: { role: "presentation" } };
  }, [Vc, Bc, th, eh, $g?.id, $, h]), oh = Uo(_c, { enabled: !Mt && S, event: "mousedown-only", toggle: false, touchOpenDelay: fn ? 0 : 100, reason: H.inputPress }), Uc = xn(_c, { enabled: !Mt && !No, outsidePressEvent: { mouse: "sloppy", touch: "intentional" }, bubbles: No ? true : void 0, outsidePress(Ce) {
    let Se = We(Ce);
    return !me(na, Se) && !me(tt.current, Se) && !me(mt.current, Se) && !me(OP, Se);
  } }), qi = ka(_c, { enabled: !Mt, id: ge, listRef: je, activeIndex: Wg, selectedIndex: wP, virtual: true, loopFocus: P, allowEscape: P && !at, focusItemOnOpen: he || u === "none" && !at ? false : "auto", focusItemOnHover: w, resetOnPointerLeave: !T, orientation: x ? "horizontal" : void 0, rtl: se === "rtl", disabledIndices: It, grid: x ? NR : void 0, onNavigate(Ce, Se) {
    !Se && !Nt || Kg === "ending" || Sn(Se ? { activeIndex: Ce, type: Ge.current ? H.keyboard : H.pointer } : { activeIndex: Ce });
  } }), nh = Ue.useMemo(() => Rt(qi.reference, { onKeyDown(Ce) {
    x && Ae.state.activeIndex == null && (Ce.key === "ArrowLeft" || Ce.key === "ArrowRight") && Ce.preventBaseUIHandler();
  } }, Uc.reference, oh.reference, Hc.reference), [qi.reference, Uc.reference, oh.reference, Hc.reference, x, Ae]), rh = Ue.useMemo(() => Rt(Fn, Uc.floating), [Uc.floating]), ih = Ue.useMemo(() => Rt(qi.floating, Hc.floating), [qi.floating, Hc.floating]), sh = Ue.useMemo(() => {
    let Ce = qi.item;
    return Ce ? { ...Ce, onFocus: void 0 } : Me;
  }, [qi.item]);
  Ae.useContextCallback("setOpen", ra), Ae.useContextCallback("setInputValue", Pn), Ae.useContextCallback("setSelectedValue", Lc), Ae.useContextCallback("setIndices", Sn), Ae.useContextCallback("handleSelection", VP), Ae.useContextCallback("forceMount", qg), Ae.useContextCallback("requestSubmit", LP), Ae.useContextCallback("onOpenChangeComplete", o), MR(() => {
    Ae.update({ inline: _, popupProps: rh, listProps: ih, inputProps: nh, triggerProps: Yg, itemProps: sh });
  });
  let ah = { id: ge, selectedValue: ze, open: Nt, mounted: DP, transitionStatus: Kg, items: le, inline: _, popupProps: rh, listProps: ih, inputProps: nh, triggerProps: Yg, itemProps: sh, openMethod: kP, selectionMode: u, name: At, form: m, disabled: Mt, readOnly: h, required: C, grid: x, virtualized: A, openOnInputClick: S, itemToStringLabel: xe, modal: k, autoHighlight: at, isItemEqualToValue: D, submitOnItemClick: te, hasInputValue: He };
  W(() => {
    Ae.update({ ...ah, inputOwnsFormValue: u === "none" && (_ || !Ae.state.inputInsidePopup) });
  }, [Ae, ...Object.values(ah)]);
  let GP = ht(g, fe.inputRef), WP = Ue.useMemo(() => ({ query: zo, hasItems: $e, filteredItems: oa, flatFilteredValues: Eo }), [zo, $e, oa, Eo]), $P = Ue.useMemo(() => Array.isArray(Ki) ? "" : Ps(Ki, N), [Ki, N]), zP = Lt && Array.isArray(ze) && ze.length > 0, wp = Lt || u === "none" && MP ? void 0 : At, KP = Ue.useMemo(() => !Lt || !Array.isArray(ze) || !At ? null : ze.map((Ce) => {
    let Se = Ps(Ce, N);
    return (0, _n.jsx)("input", { type: "hidden", form: m, name: At, value: Se, disabled: Mt }, Se);
  }), [Lt, ze, m, At, N, Mt]), YP = (0, _n.jsxs)(Ue.Fragment, { children: [e4.children, (0, _n.jsx)("input", { ...fe.getValidationProps(Mt, { onFocus() {
    if (fn) {
      na?.focus();
      return;
    }
    (ve.current || na)?.focus();
  }, onChange(Ce) {
    if (Ce.nativeEvent.defaultPrevented || Mt || h) return;
    let Se = Ce.currentTarget.value, Ze = Se.toLowerCase(), ft = Q(H.none, Ce.nativeEvent), Bt = () => ut.current.findIndex((Dt) => Ps(Dt, N).toLowerCase() === Ze || oe(Dt).toLowerCase() === Ze);
    function Yt() {
      if (Lt) return;
      if (u === "none") {
        Pn(Se, ft);
        return;
      }
      let Dt = Bt();
      Dt === -1 && (Dt = ut.current.findIndex((pn, ii) => {
        let dr = et.current[ii];
        return dr != null && dr.toLowerCase() === Ze;
      }));
      let fo = Dt === -1 ? void 0 : ut.current[Dt];
      fo != null && Lc?.(fo, ft);
    }
    to && (qg(), Z && Bt() === -1 && Ae.set("forceMounted", true)), queueMicrotask(Yt);
  } }), id: ge && wp == null ? `${ge}-hidden-input` : void 0, form: m, name: wp, autoComplete: K, disabled: Mt, required: C && !zP, readOnly: h, value: $P, ref: GP, style: wp ? Nn : wo, tabIndex: -1, "aria-hidden": true, suppressHydrationWarning: true }), KP] });
  return (0, _n.jsx)(tm.Provider, { value: Ae, children: (0, _n.jsx)(om.Provider, { value: _c, children: (0, _n.jsx)(rm.Provider, { value: $e, children: (0, _n.jsx)(nm.Provider, { value: WP, children: (0, _n.jsx)(im.Provider, { value: _t, children: YP }) }) }) }) });
}
var gu = E(M(), 1);
var cH = mi.popupOpen;
var lH = mi.pressed;
var XR = "data-popup-side";
var ZR = "data-list-empty";
var Ts = { ...gi, ...vt, popupSide: (e4) => e4 ? { [XR]: e4 } : null, listEmpty: (e4) => e4 ? { [ZR]: "" } : null };
var cu = 5;
function lu(e4, t) {
  let o = RM(t);
  return e4.clientX >= o.left - cu && e4.clientX <= o.right + cu && e4.clientY >= o.top - cu && e4.clientY <= o.bottom + cu;
}
function RM(e4) {
  let t = e4.getBoundingClientRect(), o = Be(e4);
  if (Je.env.jsdom) return t;
  let n = o.getComputedStyle(e4, "::before"), r = o.getComputedStyle(e4, "::after");
  if (!(n.content !== "none" || r.content !== "none")) return t;
  let s = parseFloat(n.width) || 0, a = parseFloat(n.height) || 0, l = parseFloat(r.width) || 0, c = parseFloat(r.height) || 0, u = Math.max(t.width, s, l), f = Math.max(t.height, a, c), p = u - t.width, m = f - t.height;
  return { left: t.left - p / 2, right: t.right + p / 2, top: t.top - m / 2, bottom: t.bottom + m / 2 };
}
function uu(e4) {
  return e4 == null ? void 0 : `${e4}-label`;
}
function fu(e4, t) {
  return e4 ?? t;
}
function ws(e4) {
  let t = e4.useState("mounted"), o = e4.useState("popupSide"), n = e4.useState("positionerElement");
  return t && n ? o : null;
}
function Bn() {
  return on().filteredItems.length === 0;
}
function pu(e4) {
  return e4 === "rtl" ? ["ArrowRight", "ArrowLeft"] : ["ArrowLeft", "ArrowRight"];
}
function du(e4, t) {
  let o = e4 >= t - 1 ? t - 2 : e4;
  return o >= 0 ? o : void 0;
}
function mu(e4, t, o) {
  let n = e4.context.listRef.current[t];
  n && (e4.context.selectionEventRef.current = o, n.click(), e4.context.selectionEventRef.current = null);
}
var JR = gu.forwardRef(function(t, o) {
  let { render: n, className: r, nativeButton: i = true, disabled: s = false, id: a, style: l, ...c } = t, { state: u, disabled: f, setTouched: p, setFocused: m, validationMode: d, validation: h } = Qe(), { labelId: C } = pt(), g = Ye(), x = g.useState("selectionMode"), b = g.useState("disabled"), y = g.useState("readOnly"), R = g.useState("required"), I = g.useState("positionerElement"), S = g.useState("listElement"), v = g.useState("popupId"), T = g.useState("triggerProps"), w = g.useState("inputInsidePopup"), P = g.useState("id"), O = g.useState("labelId"), N = g.useState("open"), D = g.useState("selectedValue"), A = g.useState("activeIndex"), _ = g.useState("selectedIndex"), B = g.useState("hasSelectedValue"), k = Vr(), F = Is(), $ = ot(), K = f || b || s, Y = Bn(), te = ws(g);
  Vo({ id: w ? a : void 0 });
  let L = w ? a ?? P : a, j = fu(C, O), z;
  N && w ? z = v ?? nu(P) : N && (z = S?.id);
  let J = gu.useRef("");
  function X(be) {
    J.current = be.pointerType;
  }
  let { reference: pe } = Fa(k, { enabled: !N && !y && !b && x === "single", listRef: g.context.labelsRef, activeIndex: A, selectedIndex: _, onMatch(be) {
    let re = g.context.valuesRef.current[be];
    re !== void 0 && g.context.setSelectedValue(re, Q(H.none));
  } }), { reference: de } = Uo(k, { enabled: !b, event: "mousedown" }), { buttonRef: ye, getButtonProps: ce } = Ke({ native: i, disabled: K }), fe = { ...u, readOnly: y, open: N, disabled: K, popupSide: te, listEmpty: Y, placeholder: x === "none" ? false : !B }, se = G((be) => {
    g.set("triggerElement", be);
  });
  return U("button", t, { ref: [o, ye, se], state: fe, props: [T, de, pe, { id: L, tabIndex: w ? 0 : -1, role: w ? "combobox" : void 0, "aria-expanded": N, "aria-haspopup": w ? "dialog" : "listbox", "aria-controls": z, "aria-required": w && R || void 0, "aria-readonly": w && y || void 0, "aria-labelledby": j, onPointerDown: X, onPointerEnter: X, onFocus() {
    m(true), !K && $.start(0, g.context.forceMount);
  }, onBlur(be) {
    if (!me(I, be.relatedTarget) && (p(true), m(false), d === "onBlur")) {
      let re = x === "none" ? F : D;
      h.commit(re);
    }
  }, onMouseDown(be) {
    if (K || (w || k.set("domReferenceElement", be.currentTarget), g.context.forceMount(), J.current !== "touch" && (g.context.inputRef.current?.focus(), w || be.preventDefault()), N)) return;
    let re = Te(be.currentTarget);
    function Z(ee) {
      let le = g.state.triggerElement;
      if (!le) return;
      let ue = We(ee), xe = g.state.positionerElement, ae = g.state.listElement;
      me(le, ue) || me(xe, ue) || me(ae, ue) || lu(ee, le) || g.context.setOpen(false, Q(H.cancelOpen, ee));
    }
    w && re.addEventListener("mouseup", Z, { once: true });
  }, onKeyDown(be) {
    (be.key === "ArrowDown" || be.key === "ArrowUp") && (rt(be), g.context.setOpen(true, Q(H.listNavigation, be.nativeEvent)), g.context.inputRef.current?.focus());
  } }, h.getValidationProps(K, c), ce], stateAttributesMapping: Ts });
});
var Hn = E(M(), 1);
var hu = E(M(), 1);
var dm = hu.createContext(void 0);
function bu() {
  return hu.useContext(dm);
}
var xu = E(M(), 1);
var mm = xu.createContext(void 0);
function Lr(e4) {
  let t = xu.useContext(mm);
  if (t === void 0 && !e4) throw new Error(Re(21));
  return t;
}
var QR = E(M(), 1);
var eC = E(Ie(), 1);
var Ru = QR.forwardRef(function(t, o) {
  let n = Ye(), { buttonRef: r, getButtonProps: i } = Ke({ native: false }), s = ht(o, r);
  function a(c) {
    n.context.setOpen(false, Q(H.closePress, c.nativeEvent, c.currentTarget));
  }
  let l = i({ onClick: a });
  return (0, eC.jsx)("span", { ref: s, ...l, "aria-label": "Dismiss", tabIndex: void 0, style: Nn });
});
var qa = E(Ie(), 1);
var tC = Hn.forwardRef(function(t, o) {
  let { render: n, className: r, disabled: i = false, id: s, style: a, ...l } = t, { state: c, disabled: u, setTouched: f, setFocused: p, validationMode: m, validation: d } = Qe(), { labelId: h } = pt(), C = bu(), x = !!Lr(true), b = Ye(), y = Is(), R = Zt(), I = b.useState("required"), S = b.useState("disabled"), v = b.useState("readOnly"), T = b.useState("name"), w = b.useState("form"), P = b.useState("selectionMode"), O = b.useState("autoHighlight"), N = b.useState("inputProps"), D = b.useState("triggerProps"), A = b.useState("open"), _ = b.useState("mounted"), B = b.useState("selectedValue"), k = b.useState("id"), F = b.useState("inline"), $ = b.useState("modal"), K = !!O, Y = ws(b), te = u || S || i, L = Bn(), j = x || F, z = !j || $, J = Pe(s ?? (j ? void 0 : k)), X = x ? am : c, [pe, de] = Hn.useState(null), ye = Hn.useRef(false), ce = Hn.useRef(null), fe = Hn.useRef(false), se = P === "none" && !x, ge = G((ae) => {
    let oe = x || b.state.inline;
    oe && !b.state.hasInputValue && b.context.setInputValue("", Q(H.none)), b.update({ inputElement: ae, inputInsidePopup: oe, inputOwnsFormValue: se });
  }), be = x ? l : d.getValidationProps(te, l);
  function re() {
    b.context.setIndices({ activeIndex: null, selectedIndex: null, type: b.context.keyboardActiveRef.current ? H.keyboard : H.pointer });
  }
  function Z() {
    b.context.keyboardActiveRef.current = false;
  }
  let ee = { ...X, open: A, disabled: te, readOnly: v, popupSide: Y, listEmpty: L };
  function le(ae) {
    if (!C) return;
    let oe, { highlightedChipIndex: he } = C, ne = C.chipsRef.current.length, [q, Ee] = pu(R);
    return he !== void 0 ? (ae.key === q ? (ae.preventDefault(), he > 0 ? oe = he - 1 : oe = void 0) : ae.key === Ee ? (ae.preventDefault(), he < ne - 1 ? oe = he + 1 : oe = void 0) : (ae.key === "Backspace" || ae.key === "Delete") && (ae.preventDefault(), oe = du(he, B.length), re()), oe) : (ae.key === q && (ae.currentTarget.selectionStart ?? 0) === 0 && B.length > 0 && (ae.preventDefault(), oe = ne > 0 ? ne - 1 : void 0), oe);
  }
  let ue = U("input", t, { state: ee, ref: [o, b.context.inputRef, ge], props: [N, D, { value: pe ?? y, "aria-readonly": v || void 0, "aria-required": I || void 0, "aria-labelledby": h, disabled: te, readOnly: v, required: P === "none" ? I : void 0, form: w, ...se && T && { name: T }, id: J, onFocus() {
    if (p(true), !F || !fe.current) return;
    fe.current = false;
    let ae = ce.current;
    ae == null || !Object.hasOwn(b.context.valuesRef.current, ae) || b.context.setIndices({ activeIndex: ae });
  }, onBlur() {
    f(true), p(false);
    let ae = b.state.activeIndex;
    if (F && ae !== null && O !== "always" && (ce.current = ae, fe.current = true, b.context.setIndices({ activeIndex: null })), m === "onBlur") {
      let oe = P === "none" ? y : B;
      d.commit(oe);
    }
  }, onCompositionStart(ae) {
    Je.os.android || (ye.current = true, de(ae.currentTarget.value));
  }, onCompositionEnd(ae) {
    ye.current = false;
    let oe = ae.currentTarget.value;
    de(null), b.context.setInputValue(oe, Q(H.inputChange, ae.nativeEvent));
  }, onChange(ae) {
    let oe = ae.nativeEvent, he = oe.inputType, ne = !he || he === "insertReplacementText", q = ye.current || !ne;
    function Ee(ke) {
      v || te || !ke || !q || (b.context.setOpen(true, Q(H.inputChange, oe)), K || re());
    }
    if (ye.current) {
      let ke = ae.currentTarget.value;
      de(ke), ke === "" && !b.state.openOnInputClick && !b.state.inputInsidePopup && b.context.setOpen(false, Q(H.inputClear, oe));
      let ve = ke.trim(), Fe = K && ve !== "";
      Ee(ve), A && b.state.activeIndex !== null && !Fe && re();
      return;
    }
    let we = Q(H.inputChange, oe);
    if (b.context.setInputValue(ae.currentTarget.value, we), we.isCanceled) return;
    let je = ae.currentTarget.value === "", et = Q(H.inputClear, oe);
    je && !b.state.inputInsidePopup && (P === "single" && b.context.setSelectedValue(null, et), b.state.openOnInputClick || b.context.setOpen(false, et)), Ee(ae.currentTarget.value.trim()), A && b.state.activeIndex !== null && !K && re();
  }, onKeyDown(ae) {
    if (ae.ctrlKey || ae.shiftKey || ae.altKey || ae.metaKey) return;
    if (b.context.keyboardActiveRef.current = true, te || v) {
      v && ae.key === "Enter" && A && b.state.activeIndex !== null && rt(ae);
      return;
    }
    let oe = ae.currentTarget, he = oe.scrollWidth - oe.clientWidth, ne = R === "rtl";
    if (ae.key === "Home") {
      rt(ae);
      let we = Je.engine.gecko && ne ? oe.value.length : 0;
      oe.setSelectionRange(we, we), oe.scrollLeft = 0;
      return;
    }
    if (ae.key === "End") {
      rt(ae);
      let we = Je.engine.gecko && ne ? 0 : oe.value.length;
      oe.setSelectionRange(we, we), oe.scrollLeft = ne ? -he : he;
      return;
    }
    if (!_ && ae.key === "Escape") {
      let we = P === "multiple" && Array.isArray(B) ? B.length === 0 : B === null, je = Q(H.escapeKey, ae.nativeEvent), et = P === "multiple" ? [] : null;
      b.context.setInputValue("", je), b.context.setSelectedValue(et, je), !we && !b.state.inline && !je.isPropagationAllowed && ae.stopPropagation();
      return;
    }
    if (C && ae.key === "Backspace" && oe.value === "" && C.highlightedChipIndex === void 0 && Array.isArray(B) && B.length > 0) {
      let we = C.chipsRef.current.length, je = we > 0 ? we - 1 : B.length - 1, et = B.filter((ke, ve) => ve !== je);
      re(), b.context.setSelectedValue(et, Q(H.none, ae.nativeEvent));
      return;
    }
    let q = C?.highlightedChipIndex !== void 0, Ee = le(ae);
    if (C?.setHighlightedChipIndex(Ee), Ee !== void 0 ? C?.chipsRef.current[Ee]?.focus() : q && b.context.inputRef.current?.focus(), ae.which !== 229 && ae.key === "Enter" && A) {
      let we = b.state.activeIndex, je = ae.nativeEvent;
      if (we === null) {
        if (F) return;
        b.context.setOpen(false, Q(H.none, je));
        return;
      }
      rt(ae), mu(b, we, je);
    }
  }, onPointerMove: Z, onPointerDown: Z }, be], stateAttributesMapping: Ts }), xe = x ? (0, qa.jsx)(za.Provider, { value: cm, children: ue }) : ue;
  return (0, qa.jsxs)(Hn.Fragment, { children: [A && z && (0, qa.jsx)(Ru, { ref: b.context.startDismissRef }), xe] });
});
var oC = E(M(), 1);
function Cu(e4, t, o, n) {
  if (e4.baseUIHandlerPrevented) return;
  let r = We(e4.nativeEvent), i = De(r) ? r : null;
  i !== e4.currentTarget && (n?.(i) || ba(i)) || (e4.preventDefault(), !o && (t.context.inputRef.current?.focus(), t.state.openOnInputClick && t.context.setOpen(true, Q(H.inputPress, e4.nativeEvent))));
}
var nC = oC.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, { state: a } = Qe(), l = Ye(), c = l.useState("open"), u = l.useState("disabled"), f = l.useState("readOnly"), p = l.useState("hasSelectedValue"), m = l.useState("selectionMode"), d = ws(l), h = u, C = Bn(), x = { ...a, open: c, disabled: h, readOnly: f, popupSide: d, listEmpty: C, placeholder: m === "none" ? false : !p }, b = G((y) => {
    l.set("inputGroupElement", y);
  });
  return U("div", t, { ref: [o, b], props: [{ role: "group", onMouseDown(y) {
    Cu(y, l, h, (R) => me(l.context.chipsContainerRef.current, R));
  } }, s], state: x, stateAttributesMapping: Ts });
});
var rC = E(M(), 1);
var iC = rC.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t;
  return U("span", t, { ref: o, props: [{ "aria-hidden": true, children: "\u25BC" }, s] });
});
var sC = E(M(), 1);
var CM = { ...Ot, ...Mn };
var aC = sC.forwardRef(function(t, o) {
  let { render: n, className: r, disabled: i = false, nativeButton: s = true, keepMounted: a = false, style: l, ...c } = t, { disabled: u } = Qe(), f = Ye(), p = f.useState("selectionMode"), m = f.useState("disabled"), d = f.useState("readOnly"), h = f.useState("open"), C = f.useState("selectedValue"), g = f.useState("hasSelectionChips"), x = Is(), b = false;
  p === "none" ? b = x !== "" : p === "single" ? b = C != null : b = g;
  let y = u || m || i, { buttonRef: R, getButtonProps: I } = Ke({ native: s, disabled: y }), { mounted: S, transitionStatus: v, setMounted: T } = wt(b), w = { disabled: y, visible: b, open: h, transitionStatus: v };
  it({ open: b, ref: f.context.clearRef, onComplete() {
    b || T(false);
  } });
  let P = U("button", t, { state: w, ref: [o, R, f.context.clearRef], props: [{ tabIndex: -1, children: "x", onMouseDown(N) {
    N.preventDefault();
  }, onClick(N) {
    if (y || d) return;
    let D = f.context.keyboardActiveRef.current ? H.keyboard : H.pointer;
    f.context.setInputValue("", Q(H.clearPress, N.nativeEvent)), p !== "none" ? (f.context.setSelectedValue(Array.isArray(C) ? [] : null, Q(H.clearPress, N.nativeEvent)), f.context.setIndices({ activeIndex: null, selectedIndex: null, type: D })) : f.context.setIndices({ activeIndex: null, type: D }), f.context.inputRef.current?.focus();
  } }, c, I], stateAttributesMapping: CM });
  return a || S ? P : null;
});
var vu = E(M(), 1);
var pC = E(M(), 1);
var Os = E(M(), 1);
var cC = E(Ie(), 1);
var lC = Os.createContext(null);
function uC() {
  return Os.useContext(lC);
}
function fC(e4) {
  let { children: t, items: o } = e4, n = Os.useMemo(() => ({ items: o }), [o]);
  return (0, cC.jsx)(lC.Provider, { value: n, children: t });
}
var dC = E(Ie(), 1);
function yu(e4) {
  let { children: t } = e4, { filteredItems: o } = on(), n = uC(), r = n ? n.items : o;
  return (0, dC.jsx)(pC.Fragment, { children: r.map(t) });
}
var gm = E(Ie(), 1);
var mC = vu.forwardRef(function(t, o) {
  var n;
  let { render: r, className: i, style: s, children: a, ...l } = t, c = Ye(), u = Vr(), f = !!Lr(true), { filteredItems: p, hasItems: m } = on(), d = c.useState("selectionMode"), h = c.useState("grid"), C = c.useState("readOnly"), g = c.useState("listProps"), x = c.useState("virtualized"), b = c.useState("forceMounted"), y = d === "multiple", R = p.length === 0, I = G((N) => {
    c.set("positionerElement", N);
  }), S = G((N) => {
    c.set("listElement", N);
  }), v = vu.useMemo(() => typeof a == "function" ? n || (n = (0, gm.jsx)(yu, { children: a })) : a, [a]), T = { empty: R }, w = u.useState("floatingId"), P = U("div", t, { state: T, ref: [o, S, f ? null : I], props: [g, { children: v, tabIndex: -1, id: w, role: h ? "grid" : "listbox", "aria-multiselectable": y ? "true" : void 0, "aria-readonly": !h && C ? true : void 0, onKeyDown(N) {
    if (!(c.state.disabled || c.state.readOnly) && N.key === "Enter") {
      let D = c.state.activeIndex;
      if (D == null) return;
      rt(N), mu(c, D, N.nativeEvent);
    }
  }, onKeyDownCapture() {
    c.context.keyboardActiveRef.current = true;
  }, onPointerMoveCapture() {
    c.context.keyboardActiveRef.current = false;
  } }, l] });
  if (x) return P;
  let O = m && !b ? void 0 : c.context.labelsRef;
  return (0, gm.jsx)(Do, { elementsRef: c.context.listRef, labelsRef: O, children: P });
});
var gC = E(M(), 1);
var Eu = E(M(), 1);
var yM = "\u2060";
var vM = 200;
function EM(e4) {
  let t = e4.ownerDocument.createTreeWalker(e4, NodeFilter.SHOW_TEXT), o = null;
  for (; t.nextNode(); ) {
    let n = t.currentNode;
    n.nodeValue !== "" && (o = n);
  }
  return o;
}
function Iu() {
  let e4 = ot(), t = Eu.useRef(null);
  return Eu.useEffect(() => {
    if (Je.os.ios) return;
    let o = t.current;
    if (o == null) return;
    let n = EM(o);
    if (n == null) return;
    let r = n.data, i = `${r}${yM}`;
    return n.nodeValue = i, e4.start(vM, () => {
      n.nodeValue === i && (n.nodeValue = r);
    }), () => {
      e4.clear(), n.nodeValue === i && (n.nodeValue = r);
    };
  }, [t, e4]), t;
}
var hC = gC.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, children: s, ...a } = t, l = Iu();
  return U("div", t, { ref: [o, l], props: [{ children: s, role: "status", "aria-live": "polite", "aria-atomic": true }, a] });
});
var xC = E(M(), 1);
var Su = E(M(), 1);
var hm = Su.createContext(void 0);
function bC() {
  let e4 = Su.useContext(hm);
  if (e4 === void 0) throw new Error(Re(20));
  return e4;
}
var bm = E(Ie(), 1);
var RC = xC.forwardRef(function(t, o) {
  let { keepMounted: n = false, ...r } = t, i = Ye(), s = i.useState("mounted"), a = i.useState("forceMounted");
  return s || n || a ? (0, bm.jsx)(hm.Provider, { value: n, children: (0, bm.jsx)(Qn, { ref: o, ...r }) }) : null;
});
var CC = E(M(), 1);
var IM = { ...ao, ...Ot };
var yC = CC.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = Ye(), l = a.useState("open"), c = a.useState("mounted"), u = a.useState("transitionStatus");
  return U("div", t, { state: { open: l, transitionStatus: u }, ref: o, stateAttributesMapping: IM, props: [{ role: "presentation", hidden: !c, style: { userSelect: "none", WebkitUserSelect: "none" } }, s] });
});
var VC = E(M(), 1);
var Wo = E(M(), 1);
var SM = (e4) => ({ name: "arrow", options: e4, async fn(t) {
  let { x: o, y: n, placement: r, rects: i, platform: s, elements: a, middlewareData: l } = t, { element: c, padding: u = 0, offsetParent: f = "real" } = An(e4, t) || {};
  if (c == null) return {};
  let p = Cl(u), m = { x: o, y: n }, d = va(r), h = ya(d), C = await s.getDimensions(c), g = d === "y", x = g ? "top" : "left", b = g ? "bottom" : "right", y = g ? "clientHeight" : "clientWidth", R = i.reference[h] + i.reference[d] - m[d] - i.floating[h], I = m[d] - i.reference[d], S = f === "real" ? await s.getOffsetParent?.(c) : a.floating, v = a.floating[y] || i.floating[h];
  (!v || !await s.isElement?.(S)) && (v = a.floating[y] || i.floating[h]);
  let T = R / 2 - I / 2, w = v / 2 - C[h] / 2 - 1, P = Math.min(p[x], w), O = Math.min(p[b], w), N = P, D = v - C[h] - O, A = v / 2 - C[h] / 2 + T, _ = xl(N, A, D), B = !l.arrow && Zo(r) != null && A !== _ && i.reference[h] / 2 - (A < N ? P : O) - C[h] / 2 < 0, k = B ? A < N ? A - N : A - D : 0;
  return { [d]: m[d] + k, data: { [d]: _, centerOffset: A - _ - k, ...B && { alignmentOffset: k } }, reset: B };
} });
var vC = (e4, t) => {
  let { name: o, fn: n } = SM(e4);
  return { name: o, fn: n, options: [e4, t] };
};
var EC = { name: "hide", async fn(e4) {
  let { width: t, height: o, x: n, y: r } = e4.rects.reference, i = t === 0 && o === 0 && n === 0 && r === 0, s = await e4.platform.detectOverflow(e4, { elementContext: "reference" });
  return { data: { referenceHidden: s.top - o >= 0 || s.right - t >= 0 || s.bottom - o >= 0 || s.left - t >= 0 || i } };
} };
var Ms = { sideX: "left", sideY: "top" };
var Pu = "--available-width";
var Tu = "--available-height";
var IC = "--anchor-width";
var SC = "--anchor-height";
var PC = "--transform-origin";
var TC = "--positioner-width";
var wC = "--positioner-height";
var MC = Pu;
var NC = Tu;
function kC(e4, t, o) {
  let n = e4 === "inline-start" || e4 === "inline-end";
  return { top: "top", right: n ? o ? "inline-start" : "inline-end" : "right", bottom: "bottom", left: n ? o ? "inline-end" : "inline-start" : "left" }[t];
}
function DC(e4, t, o) {
  let { rects: n, placement: r } = e4;
  return { side: kC(t, go(r), o), align: Zo(r) || "center", anchor: { width: n.reference.width, height: n.reference.height }, positioner: { width: n.floating.width, height: n.floating.height } };
}
function _r(e4) {
  return PM(e4, zx);
}
function PM(e4, t) {
  let { anchor: o, positionMethod: n = "absolute", side: r = "bottom", sideOffset: i = 0, align: s = "center", alignOffset: a = 0, collisionBoundary: l, collisionPadding: c = 5, sticky: u = false, arrowPadding: f = 5, disableAnchorTracking: p = false, inline: m, keepMounted: d = false, floatingRootContext: h, mounted: C, collisionAvoidance: g, shift: x, nodeId: b, adaptiveOrigin: y, lazyFlip: R = false, externalTree: I } = e4, [S, v] = Wo.useState(null);
  !C && S !== null && v(null);
  let T = g.side || "flip", w = g.align || "flip", P = g.fallbackAxisSide || "end", O = x?.crossAxis ?? false, N = x?.rootBoundary, D = typeof o == "function" ? o : void 0, A = G(D), _ = D ? A : o, B = ct(o), k = ct(C), $ = Zt() === "rtl", K = S || { top: "top", right: "right", bottom: "bottom", left: "left", "inline-end": $ ? "left" : "right", "inline-start": $ ? "right" : "left" }[r], Y = s === "center" ? K : `${K}-${s}`, te = c;
  typeof te == "number" ? te = { top: te, right: te, bottom: te, left: te } : te && (te = { top: te.top || 0, right: te.right || 0, bottom: te.bottom || 0, left: te.left || 0 });
  let L = 1, j = r === "bottom" ? L : 0, z = r === "top" ? L : 0, J = r === "right" ? L : 0, X = r === "left" ? L : 0, pe = { boundary: l === "clipping-ancestors" ? "clippingAncestors" : l, padding: te }, de = Wo.useRef(null), ye = ct(i), ce = ct(a), fe = typeof i != "function" ? i : 0, se = typeof a != "function" ? a : 0, ge = [];
  m && ge.push(m), ge.push(Od((_e) => {
    let gt = DC(_e, r, $), ut = typeof ye.current == "function" ? ye.current(gt) : ye.current, Kt = typeof ce.current == "function" ? ce.current(gt) : ce.current;
    return { mainAxis: ut, crossAxis: Kt, alignmentAxis: Kt };
  }, [fe, se, $, r]));
  let be = w === "none" && T !== "shift", re = !be && (u || O || T === "shift"), Z = T === "none" ? null : Dd({ ...pe, padding: { top: te.top + L + j, right: te.right + L + X, bottom: te.bottom + L + z, left: te.left + L + J }, mainAxis: !O && T === "flip", crossAxis: w === "flip" ? "alignment" : false, fallbackAxisSideDirection: P }), ee = be ? null : Md({ ...pe, rootBoundary: N, mainAxis: w !== "none", crossAxis: re, limiter: u || O ? void 0 : Nd((_e) => {
    if (!de.current) return {};
    let { width: gt, height: ut } = de.current.getBoundingClientRect(), Kt = ko(go(_e.placement)), Mt = Kt === "y" ? gt : ut, At = Kt === "y" ? te.left + te.right : te.top + te.bottom;
    return { offset: Mt / 2 + At / 2 };
  }) }, [pe, u, O, N, te, w]);
  T === "shift" || w === "shift" || s === "center" ? ge.push(ee, Z) : ge.push(Z, ee), ge.push(Ad({ ...pe, apply({ elements: { floating: _e }, availableWidth: gt, availableHeight: ut, rects: Kt }) {
    if (!k.current) return;
    let Mt = _e.style;
    Mt.setProperty(MC, `${gt}px`), Mt.setProperty(NC, `${ut}px`);
    let At = Be(_e).devicePixelRatio || 1, { x: Lt, y: to, width: He, height: $e } = Kt.reference, Et = (Math.round((Lt + He) * At) - Math.round(Lt * At)) / At, at = (Math.round((to + $e) * At) - Math.round(to * At)) / At;
    Mt.setProperty(IC, `${Et}px`), Mt.setProperty(SC, `${at}px`);
  } }), vC((_e) => ({ element: de.current || Te(_e.elements.floating).createElement("div"), padding: de.current ? f : 0, offsetParent: "floating" }), [f]), { name: "transformOrigin", fn(_e) {
    let { elements: { floating: gt }, middlewareData: ut, placement: Kt, platform: Mt, rects: At, y: Lt } = _e, to = go(Kt), He = Zo(Kt), $e = ko(to) === "y", Et = de.current, at = typeof i == "function" ? i(DC(_e, r, $)) : i, ze;
    if (!Et && He && Math.abs($e ? ut.shift?.x || 0 : ut.shift?.y || 0) <= 1) ze = He === "start" === ($e && Mt.isRTL?.(gt) === true) ? "100%" : "0%";
    else {
      let $i = $e ? ut.arrow?.x || 0 : ut.arrow?.y || 0, ni = $e ? Et?.clientWidth || 0 : Et?.clientHeight || 0;
      ze = `${$i + ni / 2}px`;
    }
    let un = to === "top" || to === "left" ? `calc(100% + ${at}px)` : `${-at}px`;
    return re && $e && Math.abs(ut.shift?.y || 0) > at && (un = `${At.reference.y + At.reference.height / 2 - Lt}px`), gt.style.setProperty(PC, $e ? `${ze} ${un}` : `${un} ${ze}`), {};
  } }, EC, y), W(() => {
    !C && h && h.update({ referenceElement: null, floatingElement: null, domReferenceElement: null, positionReference: null });
  }, [C, h]);
  let le = Wo.useMemo(() => ({ ancestorScroll: !p, elementResize: !p && typeof ResizeObserver < "u", layoutShift: !p && typeof IntersectionObserver < "u" }), [p]), { refs: ue, elements: xe, x: ae, y: oe, middlewareData: he, update: ne, placement: q, context: Ee, isPositioned: we, floatingStyles: je } = t({ rootContext: h, open: d ? C : void 0, placement: Y, middleware: ge, strategy: n, whileElementsMounted: d ? void 0 : (..._e) => wa(..._e, le), nodeId: b, externalTree: I }), { sideX: et, sideY: ke } = he.adaptiveOrigin || Ms, ve = we ? n : "fixed", Fe = Wo.useMemo(() => {
    let _e;
    return we ? y ? _e = { position: ve, [et]: ae, [ke]: oe } : _e = { ...je, position: ve } : _e = { position: ve, top: 0, left: 0 }, _e[MC] = "100vw", _e[NC] = "100vh", we || (_e.opacity = 0), _e;
  }, [y, ve, et, ae, ke, oe, je, we]), nt = Wo.useRef(null);
  W(() => {
    if (!C) return;
    let _e = B.current, gt = typeof _e == "function" ? _e() : _e, Kt = (AC(gt) ? gt.current : gt) || null || null;
    Kt !== nt.current && (ue.setPositionReference(Kt), nt.current = Kt);
  }, [C, ue, _, B]), Wo.useEffect(() => {
    if (!C) return;
    let _e = B.current;
    typeof _e != "function" && AC(_e) && _e.current !== nt.current && (ue.setPositionReference(_e.current), nt.current = _e.current);
  }, [C, ue, _, B]), Wo.useEffect(() => {
    if (d && C && xe.reference && xe.floating) return wa(xe.reference, xe.floating, ne, le);
  }, [d, C, xe, ne, le]);
  let Vt = go(q), Ge = kC(r, Vt, $), Ne = Zo(q) || "center", mt = !!he.hide?.referenceHidden;
  W(() => {
    R && C && we && Vt !== K && v(Vt);
  }, [R, C, we, Vt, K]);
  let tt = Wo.useMemo(() => ({ position: "absolute", top: he.arrow?.y, left: he.arrow?.x }), [he.arrow]), Pt = he.arrow?.centerOffset !== 0;
  return Wo.useMemo(() => ({ positionerStyles: Fe, arrowStyles: tt, arrowRef: de, arrowUncentered: Pt, side: Ge, align: Ne, physicalSide: Vt, anchorHidden: mt, refs: ue, context: Ee, isPositioned: we, update: ne }), [Fe, tt, de, Pt, Ge, Ne, Vt, mt, ue, Ee, we, ne]);
}
function AC(e4) {
  return e4 != null && "current" in e4;
}
function Un(e4) {
  return e4 === "starting" ? Wb : Me;
}
function Br(e4, t, { styles: o, transitionStatus: n, props: r, refs: i, hidden: s, inert: a = false }) {
  let l = { ...o };
  return a && (l.pointerEvents = "none"), U("div", e4, { state: t, ref: i, props: [{ role: "presentation", hidden: s, style: l }, Un(n), r], stateAttributesMapping: ao });
}
var FC = E(M(), 1);
var TM = 20;
function Ns(e4, t, o, n) {
  let [r, i] = FC.useState(false);
  W(() => {
    if (!e4 || !t || o == null) {
      i(false);
      return;
    }
    let s = Te(o).documentElement.clientWidth, a = o.offsetWidth;
    i(s > 0 && a > 0 && a >= s - TM);
  }, [e4, t, o]), fl(e4 && (!t || r), n);
}
var wu = E(Ie(), 1);
var LC = VC.forwardRef(function(t, o) {
  let { render: n, className: r, anchor: i, positionMethod: s, side: a, align: l, sideOffset: c, alignOffset: u, collisionBoundary: f = "clipping-ancestors", collisionPadding: p, arrowPadding: m, sticky: d, disableAnchorTracking: h = false, collisionAvoidance: C = Sl, style: g, ...x } = t, b = Ye(), y = Vr(), R = bC(), I = b.useState("modal"), S = b.useState("open"), v = b.useState("mounted"), T = b.useState("openMethod"), w = b.useState("positionerElement"), P = b.useState("triggerElement"), O = b.useState("inputElement"), N = b.useState("inputGroupElement"), D = b.useState("inputInsidePopup"), A = b.useState("transitionStatus"), _ = Bn(), k = _r({ anchor: i ?? (D ? P : N ?? O), floatingRootContext: y, positionMethod: s, mounted: v, side: a, sideOffset: c, align: l, alignOffset: u, arrowPadding: m, collisionBoundary: f, collisionPadding: p, sticky: d, disableAnchorTracking: h, keepMounted: R, collisionAvoidance: C, lazyFlip: true });
  Ns(S && I, T === "touch", w, P);
  let F = { open: S, side: k.side, align: k.align, anchorHidden: k.anchorHidden, empty: _ };
  W(() => {
    b.set("popupSide", k.side);
  }, [b, k.side]);
  let $ = G((Y) => {
    b.set("positionerElement", Y);
  }), K = Br(t, F, { styles: k.positionerStyles, transitionStatus: A, props: x, refs: [o, $], hidden: !v, inert: !S });
  return (0, wu.jsxs)(mm.Provider, { value: k, children: [v && I && (0, wu.jsx)(Fr, { inert: en(!S), cutout: N ?? O ?? P }), K] });
});
var Ou = E(M(), 1);
var Xa = E(Ie(), 1);
var wM = { ...ao, ...Ot };
var _C = Ou.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, initialFocus: s, finalFocus: a, ...l } = t, c = Ye(), u = Lr(), f = Vr(), p = c.useState("mounted"), m = c.useState("open"), d = c.useState("openMethod"), h = c.useState("popupProps"), C = c.useState("transitionStatus"), g = c.useState("inputInsidePopup"), x = c.useState("inputElement"), b = c.useState("modal"), y = c.useState("id"), R = Bn(), I = l.id ?? (g ? nu(y) : void 0);
  W(() => (c.set("popupId", c.context.popupRef.current?.id || I), () => {
    c.set("popupId", void 0);
  }), [c, I]), it({ open: m, ref: c.context.popupRef, onComplete() {
    m && c.context.onOpenChangeComplete(true);
  } });
  let S = { open: m, side: u.side, align: u.align, anchorHidden: u.anchorHidden, transitionStatus: C, empty: R }, v = U("div", t, { state: S, ref: [o, c.context.popupRef], props: [h, { id: I, role: g ? "dialog" : "presentation", onFocus(N) {
    let D = We(N.nativeEvent);
    d !== "touch" && (me(c.state.listElement, D) || D === N.currentTarget) && c.context.inputRef.current?.focus();
  } }, Un(C), l], stateAttributesMapping: wM }), w = s === void 0 ? g ? (N) => N === "touch" ? c.context.popupRef.current : x : false : s, P;
  a != null ? P = a : P = g ? void 0 : false;
  let O = !g || b;
  return (0, Xa.jsx)(er, { context: f, disabled: !p, modal: O, openInteractionType: d, initialFocus: w, returnFocus: P, getInsideElements: () => [c.context.startDismissRef.current, c.context.endDismissRef.current], children: (0, Xa.jsxs)(Ou.Fragment, { children: [v, O && (0, Xa.jsx)(Ru, { ref: c.context.endDismissRef })] }) });
});
var BC = E(M(), 1);
var HC = BC.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = Ye(), { arrowRef: l, side: c, align: u, arrowUncentered: f, arrowStyles: p } = Lr(), d = { open: a.useState("open"), side: c, align: u, uncentered: f };
  return U("div", t, { ref: [l, o], stateAttributesMapping: ao, state: d, props: { style: p, "aria-hidden": true, ...s } });
});
var Ds = E(M(), 1);
var Mu = E(M(), 1);
var xm = Mu.createContext(void 0);
function UC() {
  let e4 = Mu.useContext(xm);
  if (e4 === void 0) throw new Error(Re(18));
  return e4;
}
var Rm = E(Ie(), 1);
var jC = Ds.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, items: s, ...a } = t, c = Ye().useState("grid"), [u, f] = Ds.useState(), p = Ds.useMemo(() => ({ labelId: u, setLabelId: f, items: s }), [u, f, s]), m = U("div", t, { ref: o, props: [{ role: c ? "rowgroup" : "group", "aria-labelledby": u }, a] }), d = (0, Rm.jsx)(xm.Provider, { value: p, children: m });
  return s ? (0, Rm.jsx)(fC, { items: s, children: d }) : d;
});
var GC = E(M(), 1);
var WC = GC.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, id: s, ...a } = t, { setLabelId: l } = UC(), c = Pe(s);
  return W(() => (l(c), () => {
    l((f) => f === c ? void 0 : f);
  }), [c, l]), U("div", t, { ref: o, props: [{ id: c, "aria-hidden": true }, a] });
});
var rr = E(M(), 1);
var zC = E(Ko(), 1);
var Nu = E(M(), 1);
var Cm = Nu.createContext(void 0);
function ym() {
  let e4 = Nu.useContext(Cm);
  if (!e4) throw new Error(Re(19));
  return e4;
}
var Du = E(M(), 1);
var vm = Du.createContext(false);
function $C() {
  return Du.useContext(vm);
}
var Za = E(Ie(), 1);
function KC(e4) {
  let { componentProps: t, forwardedRef: o, virtualized: n, indexFromFilter: r } = e4, { render: i, className: s, style: a, value: l = null, index: c, disabled: u = false, nativeButton: f = false, ...p } = t, m = rr.useRef(null), d = kt({ guess: true, index: c, textRef: m }), h = Ye(), C = $C(), g = DR(), x = h.useState("selectionMode"), b = h.useState("disabled"), y = h.useState("readOnly"), R = h.useState("isItemEqualToValue"), I = b || u, S = x !== "none", v = c ?? r ?? d.index, T = v !== -1, w = h.useState("id"), P = h.useState("isActive", v), O = h.useState("isSelected", l), N = h.useState("itemProps"), D = rr.useRef(null), A = w != null && T ? `${w}-${v}` : void 0, _ = O && S;
  W(() => {
    if (!(T && (n || c != null))) return;
    let j = h.context.listRef.current;
    return j[v] = D.current, () => {
      delete j[v];
    };
  }, [T, n, v, c, h]), W(() => {
    if (!T || g) return;
    let L = h.context.valuesRef.current;
    return L[v] = l, () => {
      delete L[v];
    };
  }, [T, g, v, l, h]), W(() => {
    if (!T || g) return;
    let L = h.state.selectedValue, j = h.state.selectedIndex;
    h.state.selectionMode === "multiple" && Array.isArray(L) ? j = kR(v, l, h.context.valuesRef.current, L, R, j) : jo(l, L, R) && (j = v), h.set("selectedIndex", j);
  }, [T, g, h, v, l, R]);
  let { getButtonProps: B, buttonRef: k } = Ke({ disabled: I, focusableWhenDisabled: true, native: f, composite: true }), F = { disabled: I, selected: _, highlighted: P };
  function $(L) {
    function j() {
      h.context.handleSelection(L, l);
    }
    h.state.submitOnItemClick ? (zC.flushSync(j), h.context.requestSubmit()) : j();
  }
  let K = { id: A, role: C ? "gridcell" : "option", "aria-selected": S ? _ : void 0, tabIndex: void 0, onPointerDownCapture(L) {
    L.isPrimary && (h.context.pointerDownItemRef.current = L.currentTarget), L.preventDefault();
  }, onMouseDown(L) {
    L.preventDefault();
  }, onClick(L) {
    I || y || $(L.nativeEvent);
  }, onMouseUp(L) {
    let j = h.context.pointerDownItemRef.current === L.currentTarget;
    h.context.pointerDownItemRef.current = null, !(I || y || L.button !== 0 || j || !P) && $(L.nativeEvent);
  } }, Y = U("div", t, { ref: [k, o, d.ref, D], state: F, props: [N, K, p, B] }), te = rr.useMemo(() => ({ selected: _, textRef: m }), [_, m]);
  return (0, Za.jsx)(Cm.Provider, { value: te, children: Y });
}
function OM(e4) {
  let { componentProps: t, forwardedRef: o } = e4, r = Ye().useState("isItemEqualToValue"), { flatFilteredValues: i } = on(), s = t.value ?? null, a = Ti(i, s, r);
  return (0, Za.jsx)(KC, { componentProps: t, forwardedRef: o, virtualized: true, indexFromFilter: a });
}
var YC = rr.memo(rr.forwardRef(function(t, o) {
  let r = Ye().useState("virtualized");
  return r && t.index == null ? (0, Za.jsx)(OM, { componentProps: t, forwardedRef: o }) : (0, Za.jsx)(KC, { componentProps: t, forwardedRef: o, virtualized: r, indexFromFilter: void 0 });
}));
var qC = E(M(), 1);
var XC = E(Ie(), 1);
var ZC = qC.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = U("div", t, { ref: o, props: [{ role: "row" }, s] });
  return (0, XC.jsx)(vm.Provider, { value: true, children: a });
});
var JC = E(M(), 1);
var QC = JC.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, children: s, ...a } = t, { filteredItems: l } = on(), c = Ye(), u = Iu(), f = l.length === 0 ? s : null;
  return U("div", t, { ref: [o, c.context.emptyRef, u], props: [{ children: f, role: "status", "aria-live": "polite", "aria-atomic": true }, a] });
});
var ey = E(M(), 1);
var ty = ey.forwardRef(function(t, o) {
  let { className: n, render: r, orientation: i = "horizontal", style: s, ...a } = t;
  return U("div", t, { state: { orientation: i }, ref: o, props: [{ role: "presentation" }, a] });
});
function oy() {
  return on().filteredItems;
}
var ny = E(M(), 1);
var Em = ny.forwardRef(function(t, o) {
  let { render: n, className: r, disabled: i = false, focusableWhenDisabled: s = false, nativeButton: a = true, style: l, ...c } = t, { getButtonProps: u, buttonRef: f } = Ke({ disabled: i, focusableWhenDisabled: s, native: a });
  return U("button", t, { state: { disabled: i }, ref: [o, f], props: [c, u] });
});
var Qa = {};
Tt(Qa, { Indicator: () => fy, Root: () => uy });
var Cn = E(M(), 1);
function ry(e4) {
  if (!e4) return null;
  for (let t of e4.elements) {
    let o = t.tagName;
    if (o === "BUTTON" || o === "INPUT") {
      let n = t;
      if (n.type === "submit") return n;
    }
  }
  return null;
}
var iy = "data-checked";
var sy = "data-unchecked";
function Au(e4) {
  return { checked(t) {
    return e4.indeterminate ? {} : t ? { [iy]: "" } : { [sy]: "" };
  }, ...vt };
}
var ku = E(M(), 1);
var Im = ku.createContext({ disabled: false });
function Hr() {
  return ku.useContext(Im);
}
var ay = E(M(), 1);
function As(e4, t, o, n = true, r) {
  let [i, s] = ay.useState(), a = Pe(r ? `${r}-label` : void 0), l = e4 ?? t ?? i;
  return W(() => {
    let c = e4 || t || !n ? void 0 : NM(o.current, a);
    i !== c && s(c);
  }), l;
}
function NM(e4, t) {
  let o = DM(e4);
  if (o) return !o.id && t && (o.id = t), o.id || void 0;
}
function DM(e4) {
  if (!e4) return;
  let t = e4.parentElement;
  if (t && t.tagName === "LABEL") return t;
  let o = e4.id;
  if (o) {
    let r = e4.nextElementSibling;
    if (r && r.htmlFor === o) return r;
  }
  let n = e4.labels;
  return n && n[0];
}
var Fu = E(M(), 1);
var AM = Fu.createContext(void 0);
function cy() {
  return Fu.useContext(AM);
}
var Vu = E(M(), 1);
var Sm = Vu.createContext(void 0);
function ly() {
  let e4 = Vu.useContext(Sm);
  if (e4 === void 0) throw new Error(Re(14));
  return e4;
}
var Ja = E(Ie(), 1);
var kM = "data-parent";
var uy = Cn.forwardRef(function(t, o) {
  let { checked: n, className: r, defaultChecked: i = false, "aria-labelledby": s, disabled: a = false, form: l, id: c, indeterminate: u = false, inputRef: f, name: p, onCheckedChange: m, parent: d = false, readOnly: h = false, render: C, required: g = false, uncheckedValue: x, value: b, nativeButton: y = false, style: R, ...I } = t, { clearErrors: S } = Xt(), { disabled: v, name: T, setDirty: w, setFilled: P, setFocused: O, setTouched: N, state: D, validationMode: A, validityData: _, validation: B } = Qe(), k = Hr(), { labelId: F, registerControlId: $, getDescriptionProps: K } = pt(), Y = cy(), te = Y?.allValues === void 0 ? void 0 : Y.parent, L = te !== void 0, j = v || k.disabled || Y?.disabled || a, z = T ?? p, J = b ?? z, X = Pe(), pe = Y?.registerControlId !== $, de = Vo({ id: c || void 0, enabled: pe }), ye = y ? de : X, ce = {};
  L && (d ? ce = te.getParentProps() : J !== void 0 && (ce = te.getChildProps(J)));
  let { checked: fe = n, indeterminate: se = u, onCheckedChange: ge, ...be } = ce, re = Y?.value, Z = Cn.useRef(null), { getButtonProps: ee, buttonRef: le } = Ke({ disabled: j, native: y }), ue = Y?.validation ?? B, [xe, ae] = yt({ controlled: J !== void 0 && re !== void 0 && !d ? re.includes(J) : fe, default: i, name: "Checkbox", state: "checked" }), oe = L ? !!fe : xe, he = L && se || u;
  nn(Z, X, xe, void 0, !Y && !j, p);
  let ne = te?.registerChildId, q = Cn.useRef(null), Ee = ue.registerInput, we = Y ? J : void 0, je = Cn.useCallback((Ne) => Ee(Ne, { controlRef: Z, value: we }), [Ee, we]), et = ht(f, q, d ? void 0 : je), ke = As(s, F, q, !y, de);
  W(() => {
    q.current && (q.current.indeterminate = he), Y || P(xe);
  }, [xe, he, Y, P]), Jt(xe, () => {
    Y || (S(z), w(xe !== _.initialValue), ue.change(xe));
  });
  let ve = Rt({ checked: xe, disabled: j, form: l, name: d ? void 0 : z, id: y ? void 0 : de, required: g, ref: et, style: z ? Nn : wo, tabIndex: -1, type: "checkbox", "aria-hidden": true, onChange(Ne) {
    if (Ne.nativeEvent.defaultPrevented) return;
    if (h) {
      Ne.preventDefault();
      return;
    }
    let mt = Ne.currentTarget.checked, tt = Q(H.none, Ne.nativeEvent);
    if (m?.(mt, tt), !tt.isCanceled && (ge?.(mt, tt), !tt.isCanceled && (ae(mt), J !== void 0 && Y !== void 0 && !d && !L))) {
      let Pt = mt ? [...Y.value, J] : Y.value.filter((_e) => _e !== J);
      Y.setValue(Pt, tt);
    }
  }, onClick(Ne) {
    Ne.stopPropagation();
  }, onFocus() {
    Z.current?.focus();
  } }, b !== void 0 ? { value: (Y ? xe && b : b) || "" } : Me, K, (Ne) => ue.getValidationProps(j, Ne));
  Cn.useEffect(() => {
    if (!te || J === void 0) return;
    let Ne = te.disabledStatesRef.current;
    return Ne.set(J, j), () => {
      Ne.delete(J);
    };
  }, [te, j, J]);
  let Fe = Cn.useMemo(() => ({ ...D, checked: oe, disabled: j, readOnly: h, required: g, indeterminate: he }), [D, oe, j, h, g, he]), nt = Au(Fe), Vt = U("span", t, { state: Fe, ref: [le, Z, o], props: [{ id: ye, role: "checkbox", "aria-checked": he ? "mixed" : oe, "aria-readonly": h || void 0, "aria-required": g || void 0, "aria-labelledby": ke, [kM]: d ? "" : void 0, onFocus() {
    j || O(true);
  }, onBlur() {
    let Ne = q.current;
    Ne && (N(true), O(false), A === "onBlur" && ue.commit(Y ? re : Ne.checked));
  }, onKeyDown(Ne) {
    if (Ne.key !== "Enter" || (Ne.preventBaseUIHandler(), Ne.defaultPrevented)) return;
    let mt = q.current?.form ?? null, tt = Ne.currentTarget, Pt = Ne.nativeEvent, _e = Ne.preventDefault, gt = Pt.preventDefault, ut = false;
    Ne.preventDefault = () => {
      ut = true, _e.call(Ne);
    }, Pt.preventDefault = () => {
      ut = true, gt.call(Pt);
    }, gt.call(Pt), Be(tt).queueMicrotask(() => {
      Ne.preventDefault = _e, Pt.preventDefault = gt, ut || ry(mt)?.click();
    });
  }, onClick(Ne) {
    if (h || j) return;
    Ne.preventDefault();
    let mt = q.current;
    mt && Yo(mt, Ne);
  } }, I, be, ee, K, (Ne) => ue.getValidationProps(j, Ne)], stateAttributesMapping: nt }), Ge = Vt.props.id;
  return W(() => {
    if (!(!ne || d || J === void 0 || Ge === void 0)) return ne(J, Ge);
  }, [ne, d, J, Ge]), (0, Ja.jsxs)(Sm.Provider, { value: Fe, children: [Vt, !xe && !Y && z && !d && x !== void 0 && (0, Ja.jsx)("input", { type: "hidden", form: l, name: z, value: x, disabled: j }), (0, Ja.jsx)("input", { ...ve, suppressHydrationWarning: true })] });
});
var Lu = E(M(), 1);
var fy = Lu.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, keepMounted: s = false, ...a } = t, l = ly(), c = l.checked || l.indeterminate, { mounted: u, transitionStatus: f, setMounted: p } = wt(c), m = Lu.useRef(null), d = { ...l, transitionStatus: f };
  it({ batch: true, enabled: !c, open: c, ref: m, onComplete() {
    c || p(false);
  } });
  let C = { ...Au(l), ...Ot }, g = s || u, x = U("span", t, { ref: [o, m], state: d, stateAttributesMapping: C, props: a });
  return g ? x : null;
});
var ir = E(M(), 1);
function Mi(e4, t) {
  return { ...e4, state: { ...e4.state, valid: !t && e4.state.valid } };
}
var Pm = Object.keys(Oi);
function wm(e4, t) {
  return e4.matches(":disabled") ? false : !t || e4.form === t ? true : e4.form === null && !e4.hasAttribute("form");
}
function py(e4, t) {
  let o = null;
  for (let n of e4.keys()) if (wm(n, t)) {
    if (!n.validity.valid) return n;
    o ??= n;
  }
  return o;
}
function dy(e4) {
  return { ...Oi, valid: !e4, customError: e4 };
}
function Tm(e4) {
  return e4 && e4.validationMessage ? [e4.validationMessage] : [];
}
function my(e4) {
  let { elementRef: t, formRef: o } = Xt(), { setValidityData: n, validate: r, validityData: i, validationDebounceTime: s, invalid: a, markedDirtyRef: l, state: c, shouldValidateOnChange: u, validationMode: f, registeredFieldIdRef: p } = e4, { controlId: m, getDescriptionProps: d } = pt(), h = ot(), C = ir.useRef(null), g = qe(() => /* @__PURE__ */ new Map()).current, x = ir.useRef(0), b = ir.useRef(null), y = ir.useCallback((T, w) => (g.set(T, w), () => {
    g.delete(T);
  }), [g]), R = G(() => {
    let T = py(g, t.current);
    return T && g.get(T)?.controlRef.current || null;
  }), I = G(async (T, w = false) => {
    x.current += 1;
    let P = x.current;
    function O(L, j = a) {
      let z = p.current ?? m;
      if (z == null) return;
      let J = o.current.fields.get(z);
      if (!J) return;
      let X = Mi(L, j);
      o.current.fields.set(z, { ...J, validityData: X });
    }
    function N(L, j) {
      let z = L.valid === false ? j : [];
      return { value: T, state: L, error: z[0] ?? "", errors: z, initialValue: i.initialValue };
    }
    function D(L, j) {
      let z = L.validity.customError ? L.validationMessage : "", J = j.replace(/\r\n?/g, `
`);
      L.setCustomValidity(J), b.current = [L, J, z];
    }
    function A() {
      let L = b.current;
      b.current = null, L && (!L[0].willValidate || L[0].validationMessage === L[1]) && L[0].setCustomValidity(L[2]);
    }
    function _(L, j, z) {
      let J = N(L, j);
      O(J, z), n(J);
    }
    function B(L) {
      let j = Pm.reduce((J, X) => (J[X] = L.validity[X], J), {}), z = false;
      for (let J of Pm) if (J !== "valid") {
        if (J === "valueMissing" && j[J]) z = true;
        else if (j[J]) return j;
      }
      return z && !l.current && (j.valid = true, j.valueMissing = false), j;
    }
    function k() {
      return g.size > 0 ? py(g, t.current) : C.current;
    }
    let F = k();
    function $() {
      return F = k(), F?.willValidate ? B(F) : dy(false);
    }
    if (w) {
      if (c.valid !== false || !F) return;
      if (!F.validity.valueMissing) {
        A();
        let L = k(), j = L?.validity.customError ? Tm(L) : [];
        _(dy(j.length > 0), j, false);
        return;
      }
      for (let L of Pm) if (L !== "valid" && L !== "valueMissing" && L !== "customError" && F.validity[L]) return;
    }
    h.clear(), A();
    let K = $(), Y = Tm(F), te = u();
    if (Y.length === 0 || te) {
      let L = Array.from(o.current.fields.values()).reduce((J, X) => (X.name && (J[X.name] = X.getValue()), J), {}), j = r(T, L), z;
      if (typeof j == "object" && j !== null && "then" in j) {
        if (K.valid === false ? _(K, Y) : (f === "onSubmit" || !i.state.customError) && (K.valid = null, _(K, Y)), z = await j, P !== x.current) return;
        K = $();
      } else z = j;
      Y = z ? [].concat(z).filter(Boolean) : [], Y.length > 0 ? (K.valid = false, K.customError = true, F?.willValidate && D(F, Y.join(`
`))) : Y = Tm(F);
    }
    _(K, Y);
  }), S = G((T, w = false) => {
    if (h.clear(), x.current += 1, w) return;
    let P = u();
    P && T !== "" && s ? h.start(s, () => {
      I(T);
    }) : I(T, !P);
  }), v = ir.useCallback((T, w = {}) => Rt(d(w), c.valid === false && !c.disabled && !T ? { "aria-invalid": true } : Me), [d, c.disabled, c.valid]);
  return ir.useMemo(() => ({ getValidationProps: v, inputRef: C, registeredInputs: g, registerInput: y, getInputControl: R, commit: I, change: S }), [v, g, y, R, I, S]);
}
var $o = {};
Tt($o, { Arrow: () => HC, Backdrop: () => yC, Chip: () => Ty, ChipRemove: () => Oy, Chips: () => Ey, Clear: () => aC, Collection: () => yu, Empty: () => QC, Group: () => jC, GroupLabel: () => WC, Icon: () => iC, Input: () => tC, InputGroup: () => nC, Item: () => YC, ItemIndicator: () => vy, Label: () => by, List: () => mC, Popup: () => _C, Portal: () => RC, Positioner: () => LC, Root: () => hy, Row: () => ZC, Separator: () => My, Status: () => hC, Trigger: () => JR, Value: () => Cy, createItems: () => Ny, useFilter: () => KR, useFilteredItems: () => oy });
var l6 = E(M(), 1);
var gy = E(Ie(), 1);
function hy(e4) {
  let { multiple: t = false, defaultValue: o, value: n, onValueChange: r, autoComplete: i, ...s } = e4;
  return (0, gy.jsx)(qR, { ...s, selectionMode: t ? "multiple" : "single", selectedValue: n, defaultSelectedValue: o, onSelectedValueChange: r, formAutoComplete: i });
}
var Om = E(M(), 1);
function _u(e4, t) {
  let o = Pe(e4);
  return W(() => (t(o), () => {
    t((n) => n === o ? void 0 : n);
  }), [o, t]), o;
}
function ks(e4 = {}) {
  let { id: t, fallbackControlId: o, native: n = false, setLabelId: r, focusControl: i } = e4, { controlId: s, setLabelId: a } = pt(), l = G((m) => {
    a(m), r?.(m);
  }), c = _u(t, l), u = s ?? o;
  function f(m) {
    if (i) {
      i(m, u);
      return;
    }
    if (!u) return;
    let d = Te(m.currentTarget).getElementById(u);
    Ve(d) && Bu(d);
  }
  function p(m) {
    We(m.nativeEvent)?.closest("button,input,select,textarea") || (!m.defaultPrevented && m.detail > 1 && m.preventDefault(), !n && f(m));
  }
  return n ? { id: c, htmlFor: u, onMouseDown: p } : { id: c, onClick: p, onPointerDown(m) {
    m.preventDefault();
  } };
}
function Bu(e4) {
  e4.focus({ focusVisible: true });
}
var by = Om.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = s;
  delete a.id;
  let l = Qe(), c = Ye(), u = c.useState("inputInsidePopup"), f = c.useState("triggerElement"), p = c.useState("inputElement"), m = c.useState("id"), d = uu(m), h = f?.id ?? (u ? m : void 0), C = ks({ id: d, fallbackControlId: h, setLabelId(g) {
    let x = typeof g == "function" ? g(c.state.labelId) : g;
    c.set("labelId", x);
  } });
  return U("div", t, { ref: o, state: l.state, props: [C, s], stateAttributesMapping: vt });
});
var xy = E(M(), 1);
var Ry = E(Ie(), 1);
function Cy(e4) {
  let { children: t, placeholder: o } = e4, n = Ye(), r = n.useState("itemToStringLabel"), i = n.useState("selectedValue"), s = n.useState("items"), a = n.useState("selectionMode") === "multiple", l = n.useState("hasSelectedValue"), c = !l && o != null && t == null, u = n.useState("hasNullItemLabel", c), f = null;
  return typeof t == "function" ? f = t(i) : t != null ? f = t : !l && o != null && !u ? f = o : a && Array.isArray(i) ? f = BR(i, s, r) : f = sm(i, s, r), (0, Ry.jsx)(xy.Fragment, { children: f });
}
var Ni = E(M(), 1);
var yy = E(Ie(), 1);
var vy = Ni.forwardRef(function(t, o) {
  let { selected: n } = ym();
  return t.keepMounted || n ? (0, yy.jsx)(FM, { ...t, ref: o }) : null;
});
var FM = Ni.memo(Ni.forwardRef((e4, t) => {
  let { render: o, className: n, style: r, keepMounted: i, ...s } = e4, { selected: a } = ym(), l = Ni.useRef(null), { transitionStatus: c, setMounted: u } = wt(a), p = U("span", e4, { ref: [t, l], state: { selected: a, transitionStatus: c }, props: [{ "aria-hidden": true, children: "\u2714\uFE0F" }, s], stateAttributesMapping: Ot });
  return it({ batch: true, enabled: !a, open: a, ref: l, onComplete() {
    a || u(false);
  } }), p;
}));
var Ur = E(M(), 1);
var Mm = E(Ie(), 1);
var Ey = Ur.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = Ye(), l = a.useState("open"), c = a.useState("hasSelectionChips"), [u, f] = Ur.useState(void 0);
  l && u !== void 0 && f(void 0);
  let p = Ur.useRef([]), m = U("div", t, { ref: [o, a.context.chipsContainerRef], props: [c ? { role: "toolbar" } : Me, { onMouseDown(h) {
    Cu(h, a, a.state.disabled);
  } }, s] }), d = Ur.useMemo(() => ({ highlightedChipIndex: u, setHighlightedChipIndex: f, chipsRef: p }), [u, f, p]);
  return (0, Mm.jsx)(dm.Provider, { value: d, children: (0, Mm.jsx)(Do, { elementsRef: p, children: m }) });
});
var Uu = E(M(), 1);
var Sy = E(Ko(), 1);
var Hu = E(M(), 1);
var Nm = Hu.createContext(void 0);
function Iy() {
  let e4 = Hu.useContext(Nm);
  if (!e4) throw new Error(Re(17));
  return e4;
}
var Py = E(Ie(), 1);
var Ty = Uu.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = Ye(), { setHighlightedChipIndex: l, chipsRef: c } = bu(), u = Zt(), f = a.useState("disabled"), p = a.useState("readOnly"), m = a.useState("selectedValue"), { ref: d, index: h } = kt();
  function C(y) {
    let R = h, [I, S] = pu(u);
    return y.key === I ? (y.preventDefault(), h > 0 ? R = h - 1 : R = void 0) : y.key === S ? (y.preventDefault(), h < c.current.length - 1 ? R = h + 1 : R = void 0) : y.key === "Backspace" || y.key === "Delete" ? (R = du(h, m.length), rt(y), a.context.setIndices({ activeIndex: null, selectedIndex: null, type: H.keyboard }), a.context.setSelectedValue(m.filter((v, T) => T !== h), Q(H.none, y.nativeEvent))) : y.key === "Enter" || y.key === " " ? (rt(y), R = void 0) : y.key === "ArrowDown" || y.key === "ArrowUp" ? (rt(y), a.context.setOpen(true, Q(H.listNavigation, y.nativeEvent)), R = void 0) : y.key.length === 1 && !y.ctrlKey && !y.metaKey && !y.altKey && (R = void 0), R;
  }
  let x = U("div", t, { ref: [o, d], state: { disabled: f }, props: [{ tabIndex: -1, "aria-disabled": f || void 0, "aria-readonly": p || void 0, onKeyDown(y) {
    if (f || p) return;
    let R = C(y);
    Sy.flushSync(() => {
      l(R);
    }), R === void 0 ? a.context.inputRef.current?.focus() : c.current[R]?.focus();
  } }, s] }), b = Uu.useMemo(() => ({ index: h }), [h]);
  return (0, Py.jsx)(Nm.Provider, { value: b, children: x });
});
var wy = E(M(), 1);
var Oy = wy.forwardRef(function(t, o) {
  let { render: n, className: r, disabled: i = false, nativeButton: s = true, style: a, ...l } = t, c = Ye(), { index: u } = Iy(), f = c.useState("disabled"), p = c.useState("readOnly"), m = c.useState("selectedValue"), d = c.useState("isItemEqualToValue"), h = f || i, { buttonRef: C, getButtonProps: g } = Ke({ native: s, disabled: h || p, focusableWhenDisabled: true }), x = { disabled: h };
  function b(I) {
    let S = c.state.activeIndex;
    if (S == null) return;
    let v = Ti(c.context.valuesRef.current, I, d);
    v !== -1 && S === v && c.context.setIndices({ activeIndex: null, type: c.context.keyboardActiveRef.current ? H.keyboard : H.pointer });
  }
  function y(I) {
    let S = Q(H.chipRemovePress, I.nativeEvent), v = m[u];
    return b(v), c.context.setSelectedValue(m.filter((T, w) => w !== u), S), c.context.inputRef.current?.focus(), S;
  }
  return U("button", t, { ref: [o, C], state: x, props: [{ tabIndex: -1, onMouseDown(I) {
    I.preventDefault();
  }, onClick(I) {
    y(I).isPropagationAllowed || I.stopPropagation();
  }, onKeyDown(I) {
    (I.key === "Enter" || I.key === " ") && (y(I).isPropagationAllowed || rt(I));
  } }, l, g] });
});
var My = ty;
function Ny(e4, t) {
  let { getValue: o, getLabel: n } = t, r = null;
  function i() {
    if (r === null) {
      let a = /* @__PURE__ */ new Map(), l = e4 ? wi(e4) : It;
      for (let c of l) {
        if (c == null) continue;
        let u = o(c);
        a.has(u) || a.set(u, c);
      }
      r = a;
    }
    return r;
  }
  function s(a) {
    return a == null ? a : o(a);
  }
  return { data: e4, value: s, hasValue(a, l) {
    return Ya(i(), a, l) !== void 0;
  }, itemLabel: n, label(a, l, c) {
    let u = Ya(i(), a, l);
    return u !== void 0 ? n(u) : Go(a, c);
  } };
}
var ju = E(M(), 1);
var VM = ju.createContext(void 0);
function jr(e4 = true) {
  let t = ju.useContext(VM);
  if (t === void 0 && !e4) throw new Error(Re(25));
  return t;
}
var uo = {};
Tt(uo, { Arrow: () => Ay, Backdrop: () => Fy, CheckboxItem: () => Uy, CheckboxItemIndicator: () => jy, Group: () => $y, GroupLabel: () => Ky, Handle: () => sc, Item: () => qy, LinkItem: () => Xy, Popup: () => Jy, Portal: () => tv, Positioner: () => ov, RadioGroup: () => rv, RadioItem: () => av, RadioItemIndicator: () => cv, Root: () => ff, Separator: () => ic, SubmenuRoot: () => mv, SubmenuTrigger: () => Dv, Trigger: () => xv, Viewport: () => Ov, createHandle: () => Av });
var Dy = E(M(), 1);
var Gu = E(M(), 1);
var Dm = Gu.createContext(void 0);
function yo(e4) {
  let t = Gu.useContext(Dm);
  if (t === void 0 && !e4) throw new Error(Re(33));
  return t;
}
var Wu = E(M(), 1);
var Am = Wu.createContext(void 0);
function xt(e4) {
  let t = Wu.useContext(Am);
  if (t === void 0 && !e4) throw new Error(Re(36));
  return t;
}
var Ay = Dy.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, { store: a } = xt(), { arrowRef: l, side: c, align: u, arrowUncentered: f, arrowStyles: p } = yo(), d = { open: a.useState("open"), side: c, align: u, uncentered: f };
  return U("div", t, { ref: [l, o], stateAttributesMapping: ao, state: d, props: { style: p, "aria-hidden": true, ...s } });
});
var ky = E(M(), 1);
var Fy = ky.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, { store: a } = xt(), l = a.useState("open"), c = a.useState("mounted"), u = a.useState("transitionStatus"), f = a.useState("lastOpenChangeReason"), p = jr(), m = { open: l, transitionStatus: u };
  return U("div", t, { ref: p?.backdropRef ? [o, p.backdropRef] : o, state: m, stateAttributesMapping: qo, props: [{ role: "presentation", hidden: !c, style: { pointerEvents: f === H.triggerHover ? "none" : void 0, userSelect: "none", WebkitUserSelect: "none" } }, s] });
});
var Ku = E(M(), 1);
var $u = E(M(), 1);
var km = $u.createContext(void 0);
function Vy() {
  let e4 = $u.useContext(km);
  if (e4 === void 0) throw new Error(Re(30));
  return e4;
}
var Fs = E(M(), 1);
var Ly = E(M(), 1);
function zu(e4) {
  let { closeOnClick: t, highlighted: o, id: n, nodeId: r, store: i, typingRef: s, itemRef: a, itemMetadata: l } = e4, { events: c } = i.useState("floatingTreeRoot"), u = i.useState("open"), f = jr(true), p = f !== void 0;
  return Ly.useMemo(() => ({ id: n, role: "menuitem", tabIndex: u && o ? 0 : -1, onKeyDown(m) {
    m.key === " " && s?.current && m.preventDefault();
  }, onMouseMove(m) {
    r && c.emit("itemhover", { nodeId: r, target: m.currentTarget });
  }, onClick(m) {
    t && c.emit("close", { domEvent: m, reason: H.itemPress });
  }, onMouseUp(m) {
    if (f) {
      let d = f.initialCursorPointRef.current;
      if (f.initialCursorPointRef.current = null, p && d && Math.abs(m.clientX - d.x) <= 1 && Math.abs(m.clientY - d.y) <= 1 || p && !Je.os.mac && m.button === 2) return;
    }
    a.current && i.context.allowMouseUpTriggerRef.current && (!p || m.button === 2) && l.type === "regular-item" && Yo(a.current, m, { detail: 1 });
  } }), [t, o, n, c, r, u, i, s, a, f, p, l]);
}
var Gr = { type: "regular-item" };
function Wr(e4) {
  let { closeOnClick: t, disabled: o, highlighted: n, id: r, store: i, typingRef: s = i.context.typingRef, nativeButton: a, itemMetadata: l, nodeId: c } = e4, u = Fs.useRef(null), { getButtonProps: f, buttonRef: p } = Ke({ disabled: o, focusableWhenDisabled: true, native: a, composite: true }), m = zu({ closeOnClick: t, highlighted: n, id: r, nodeId: c, store: i, typingRef: s, itemRef: u, itemMetadata: l }), d = Fs.useCallback((C) => Rt(m, { onMouseEnter() {
    l.type === "submenu-trigger" && l.setActive();
  } }, C, f), [m, f, l]), h = ht(u, p);
  return Fs.useMemo(() => ({ getItemProps: d, itemRef: h }), [d, h]);
}
var _y = "data-checked";
var By = "data-unchecked";
var $r = { checked(e4) {
  return e4 ? { [_y]: "" } : { [By]: "" };
}, ...Ot };
var Hy = E(Ie(), 1);
var Uy = Ku.forwardRef(function(t, o) {
  let { render: n, className: r, id: i, label: s, nativeButton: a = false, disabled: l = false, closeOnClick: c = false, checked: u, defaultChecked: f, onCheckedChange: p, style: m, ...d } = t, h = kt({ guess: true, label: s }), C = yo(true), g = Pe(i), { store: x } = xt(), b = x.useState("disabled"), y = l || b, R = x.useState("isActive", h.index), I = x.useState("itemProps"), [S, v] = yt({ controlled: u, default: f ?? false, name: "MenuCheckboxItem", state: "checked" }), { getItemProps: T, itemRef: w } = Wr({ closeOnClick: c, disabled: y, highlighted: R, id: g, store: x, nativeButton: a, nodeId: C?.context.nodeId, itemMetadata: Gr }), P = Ku.useMemo(() => ({ disabled: y, highlighted: R, checked: S }), [y, R, S]);
  function O(D) {
    let A = Q(H.itemPress, D.nativeEvent, void 0, { preventUnmountOnClose: Oe });
    p?.(!S, A), !A.isCanceled && v((_) => !_);
  }
  let N = U("div", t, { state: P, stateAttributesMapping: $r, props: [I, { role: "menuitemcheckbox", "aria-checked": S, onClick: O }, d, T], ref: [w, o, h.ref] });
  return (0, Hy.jsx)(km.Provider, { value: P, children: N });
});
var Yu = E(M(), 1);
var jy = Yu.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, keepMounted: s = false, ...a } = t, l = Vy(), c = Yu.useRef(null), { transitionStatus: u, mounted: f, setMounted: p } = wt(l.checked);
  it({ batch: true, enabled: !l.checked, open: l.checked, ref: c, onComplete() {
    l.checked || p(false);
  } });
  let m = { checked: l.checked, disabled: l.disabled, highlighted: l.highlighted, transitionStatus: u };
  return U("span", t, { state: m, ref: [o, c], stateAttributesMapping: $r, props: { "aria-hidden": true, ...a }, enabled: s || f });
});
var Xu = E(M(), 1);
var qu = E(M(), 1);
var ec = qu.createContext(void 0);
function Gy() {
  let e4 = qu.useContext(ec);
  if (e4 === void 0) throw new Error(Re(31));
  return e4;
}
var Wy = E(Ie(), 1);
var $y = Xu.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, [a, l] = Xu.useState(void 0), c = U("div", t, { ref: o, props: { role: "group", "aria-labelledby": a, ...s } });
  return (0, Wy.jsx)(ec.Provider, { value: l, children: c });
});
var zy = E(M(), 1);
var Ky = zy.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, id: s, ...a } = t, l = Pe(s), c = Gy();
  return W(() => (c(l), () => {
    c((u) => u === l ? void 0 : u);
  }), [c, l]), U("div", t, { ref: o, props: { id: l, "aria-hidden": true, ...a } });
});
var Yy = E(M(), 1);
var qy = Yy.forwardRef(function(t, o) {
  let { render: n, className: r, id: i, label: s, nativeButton: a = false, disabled: l = false, closeOnClick: c = true, style: u, ...f } = t, p = kt({ guess: true, label: s }), m = yo(true), d = Pe(i), { store: h } = xt(), C = h.useState("disabled"), g = l || C, x = h.useState("isActive", p.index), b = h.useState("itemProps"), { getItemProps: y, itemRef: R } = Wr({ closeOnClick: c, disabled: g, highlighted: x, id: d, store: h, nativeButton: a, nodeId: m?.context.nodeId, itemMetadata: Gr });
  return U("div", t, { state: { disabled: g, highlighted: x }, props: [b, f, y], ref: [R, o, p.ref] });
});
var Zu = E(M(), 1);
var Xy = Zu.forwardRef(function(t, o) {
  let { render: n, className: r, id: i, label: s, closeOnClick: a = false, style: l, ...c } = t, u = Zu.useRef(null), f = kt({ guess: true, label: s }), m = yo(true)?.context.nodeId, d = Pe(i), { store: h } = xt(), C = h.useState("isActive", f.index), g = h.useState("itemProps"), x = h.context.typingRef, { getButtonProps: b, buttonRef: y } = Ke({ native: false, composite: true }), R = zu({ closeOnClick: a, highlighted: C, id: d, nodeId: m, store: h, typingRef: x, itemRef: u, itemMetadata: Gr });
  function I(v) {
    return Rt(R, v, b);
  }
  return U("a", t, { state: { highlighted: C }, props: [g, c, I], ref: [u, y, o, f.ref] });
});
var Qu = E(M(), 1);
var Ju = E(M(), 1);
var Fm = Ju.createContext(void 0);
function Lo(e4) {
  let t = Ju.useContext(Fm);
  if (t === void 0 && !e4) throw new Error(Re(69));
  return t;
}
var Zy = E(Ie(), 1);
var Jy = Qu.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, finalFocus: s, ...a } = t, { store: l } = xt(), { side: c, align: u } = yo(), f = Lo(true) != null, p = l.useState("open"), m = l.useState("transitionStatus"), d = l.useState("popupProps"), h = l.useState("mounted"), C = l.useState("instantType"), g = l.useState("activeTriggerElement"), x = l.useState("parent"), b = l.useState("lastOpenChangeReason"), y = l.useState("rootId"), R = l.useState("floatingRootContext"), I = l.useState("floatingTreeRoot"), S = l.useState("closeDelay"), v = l.useState("hoverEnabled"), T = l.useState("disabled"), w = l.useState("openMethod"), P = x.type === "context-menu";
  it({ open: p, ref: l.context.popupRef, onComplete() {
    p && l.context.onOpenChangeComplete?.(true);
  } }), Qu.useEffect(() => {
    function _(B) {
      l.setOpen(false, Q(B.reason, B.domEvent));
    }
    return I.events.on("close", _), () => {
      I.events.off("close", _);
    };
  }, [I.events, l]), Si(R, { enabled: v && !T && !P && x.type !== "menubar", closeDelay: S });
  let O = l.useStateSetter("popupElement"), N = { transitionStatus: m, side: c, align: u, open: p, nested: x.type === "menu", instant: C }, D = U("div", t, { state: N, ref: [o, l.context.popupRef, O], stateAttributesMapping: qo, props: [d, { onKeyDown(_) {
    f && Rn.has(_.key) && _.stopPropagation();
  } }, Un(m), a, { "data-rootownerid": y }] }), A = x.type === void 0 || P;
  return (g || x.type === "menubar" && b !== H.outsidePress) && (A = true), (0, Zy.jsx)(er, { context: R, openInteractionType: w, modal: P, disabled: !h, returnFocus: s === void 0 ? A : s, initialFocus: x.type !== "menu", restoreFocus: true, externalTree: x.type !== "menubar" ? I : void 0, previousFocusableElement: g, nextFocusableElement: x.type === void 0 ? l.context.triggerFocusTargetRef : void 0, beforeContentFocusGuardRef: x.type === void 0 ? l.context.beforeContentFocusGuardRef : void 0, children: D });
});
var ev = E(M(), 1);
var ef = E(M(), 1);
var Vm = ef.createContext(void 0);
function Qy() {
  let e4 = ef.useContext(Vm);
  if (e4 === void 0) throw new Error(Re(32));
  return e4;
}
var Lm = E(Ie(), 1);
var tv = ev.forwardRef(function(t, o) {
  let { keepMounted: n = false, ...r } = t, { store: i, parent: s } = xt();
  if (!(i.useState("mounted") || n)) return null;
  let c = s.type === "menu" || s.type === "menubar" ? "group" : void 0;
  return (0, Lm.jsx)(Vm.Provider, { value: n, children: (0, Lm.jsx)(Qn, { ref: o, ...r, portalOwnerRole: c }) });
});
var jn = E(M(), 1);
var Vs = E(Ie(), 1);
var ov = jn.forwardRef(function(t, o) {
  let { anchor: n, positionMethod: r = "absolute", className: i, render: s, side: a, align: l, sideOffset: c = 0, alignOffset: u = 0, collisionBoundary: f = "clipping-ancestors", collisionPadding: p = 5, arrowPadding: m = 5, sticky: d = false, disableAnchorTracking: h = false, collisionAvoidance: C = Sl, style: g, ...x } = t, { store: b } = xt(), y = Qy(), R = jr(true), I = b.useState("parent"), S = b.useState("floatingRootContext"), v = b.useState("floatingTreeRoot"), T = b.useState("mounted"), w = b.useState("open"), P = b.useState("modal"), O = b.useState("openMethod"), N = b.useState("activeTriggerElement"), D = b.useState("transitionStatus"), A = b.useState("positionerElement"), _ = b.useState("instantType"), B = b.useState("adaptiveOrigin"), k = b.useState("lastOpenChangeReason"), F = b.useState("floatingNodeId"), $ = b.useState("floatingParentNodeId"), K = S.useState("domReferenceElement"), Y = jn.useRef(null), te = Ao(A), L = n, j = c, z = u, J = l, X = C;
  I.type === "context-menu" && (L = n ?? I.context?.anchor, J = J ?? "start", !a && J !== "center" && (z = t.alignOffset ?? 2, j = t.sideOffset ?? -5));
  let pe = a, de = J;
  I.type === "menu" ? (pe = pe ?? "inline-end", de = de ?? "start", X = t.collisionAvoidance ?? ps) : I.type === "menubar" && (pe = pe ?? (I.context.orientation === "vertical" ? "inline-end" : "bottom"), de = de ?? "start");
  let ye = I.type === "context-menu", ce = _r({ anchor: L, floatingRootContext: S, positionMethod: R ? "fixed" : r, mounted: T, side: pe, sideOffset: j, align: de, alignOffset: z, arrowPadding: ye ? 0 : m, collisionBoundary: f, collisionPadding: p, sticky: d, nodeId: F, keepMounted: y, disableAnchorTracking: h, collisionAvoidance: X, shift: ye ? { crossAxis: !("side" in X && X.side === "flip"), rootBoundary: "layoutViewport" } : void 0, externalTree: v, adaptiveOrigin: B });
  jn.useEffect(() => {
    function le(ue) {
      ue.open && (ue.parentNodeId === F && b.set("hoverEnabled", false), ue.nodeId !== F && ue.parentNodeId === b.select("floatingParentNodeId") && b.setOpen(false, Q(H.siblingOpen)));
    }
    return v.events.on("menuopenchange", le), () => {
      v.events.off("menuopenchange", le);
    };
  }, [b, v.events, F]), jn.useEffect(() => {
    if (b.select("floatingParentNodeId") == null) return;
    function le(ue) {
      if (ue.open || ue.nodeId !== b.select("floatingParentNodeId")) return;
      let xe = ue.reason ?? H.siblingOpen;
      b.setOpen(false, Q(xe));
    }
    return v.events.on("menuopenchange", le), () => {
      v.events.off("menuopenchange", le);
    };
  }, [v.events, b]);
  let fe = ot();
  jn.useEffect(() => {
    w || fe.clear();
  }, [w, fe]), jn.useEffect(() => {
    function le(ue) {
      if (!(!w || ue.nodeId !== b.select("floatingParentNodeId"))) if (ue.target && N && N !== ue.target) {
        let xe = b.select("closeDelay");
        xe > 0 ? fe.isStarted() || fe.start(xe, () => {
          b.setOpen(false, Q(H.siblingOpen));
        }) : b.setOpen(false, Q(H.siblingOpen));
      } else fe.clear();
    }
    return v.events.on("itemhover", le), () => {
      v.events.off("itemhover", le);
    };
  }, [v.events, w, N, b, fe]), jn.useEffect(() => {
    let le = { open: w, nodeId: F, parentNodeId: $, reason: b.select("lastOpenChangeReason") };
    v.events.emit("menuopenchange", le);
  }, [v.events, w, b, F, $]), W(() => {
    let le = K, ue = Y.current;
    if (le && (Y.current = le), ue && le && le !== ue) {
      b.set("instantType", void 0);
      let xe = new AbortController();
      return te(() => {
        b.set("instantType", "trigger-change");
      }, xe.signal), () => {
        xe.abort();
      };
    }
  }, [K, te, b]);
  let se = { open: w, side: ce.side, align: ce.align, anchorHidden: ce.anchorHidden, nested: I.type === "menu", instant: _ }, ge = I.type === "menubar" && I.context.modal, be = P && k !== H.triggerHover;
  Ns(w && (ge || be), O === "touch", A, N);
  let re = Br(t, se, { styles: ce.positionerStyles, transitionStatus: D, props: x, refs: [o, b.useStateSetter("positionerElement")], hidden: !T, inert: !w }), Z = T && I.type !== "menu" && (I.type !== "menubar" && P && k !== H.triggerHover || I.type === "menubar" && I.context.modal), ee = null;
  return I.type === "menubar" ? ee = I.context.contentElement : I.type === void 0 && (ee = N), (0, Vs.jsxs)(Dm.Provider, { value: ce, children: [Z && (0, Vs.jsx)(Fr, { ref: I.type === "context-menu" || I.type === "nested-context-menu" ? I.context.internalBackdropRef : null, inert: en(!w), cutout: ee }), (0, Vs.jsx)(Ia, { id: F, children: (0, Vs.jsx)(Do, { elementsRef: b.context.itemDomElements, labelsRef: b.context.itemLabels, children: re }) })] });
});
var zr = E(M(), 1);
var tf = E(M(), 1);
var _m = tf.createContext(void 0);
function nv() {
  let e4 = tf.useContext(_m);
  if (e4 === void 0) throw new Error(Re(34));
  return e4;
}
var Bm = E(Ie(), 1);
var rv = zr.memo(zr.forwardRef(function(t, o) {
  let { render: n, className: r, value: i, defaultValue: s, onValueChange: a, disabled: l = false, style: c, "aria-labelledby": u, ...f } = t, [p, m] = zr.useState(void 0), [d, h] = yt({ controlled: i, default: s, name: "MenuRadioGroup" }), C = G((y, R) => {
    a?.(y, R), !R.isCanceled && h(y);
  }), x = U("div", t, { state: { disabled: l }, ref: o, props: { role: "group", "aria-labelledby": u ?? p, "aria-disabled": l || void 0, ...f } }), b = zr.useMemo(() => ({ value: d, setValue: C, disabled: l }), [d, C, l]);
  return (0, Bm.jsx)(ec.Provider, { value: m, children: (0, Bm.jsx)(_m.Provider, { value: b, children: x }) });
}));
var nf = E(M(), 1);
var of = E(M(), 1);
var Hm = of.createContext(void 0);
function iv() {
  let e4 = of.useContext(Hm);
  if (e4 === void 0) throw new Error(Re(35));
  return e4;
}
var sv = E(Ie(), 1);
var av = nf.forwardRef(function(t, o) {
  let { render: n, className: r, id: i, label: s, nativeButton: a = false, disabled: l = false, closeOnClick: c = false, value: u, style: f, ...p } = t, m = kt({ guess: true, label: s }), d = yo(true), h = Pe(i), { store: C } = xt(), g = C.useState("isActive", m.index), x = C.useState("itemProps"), { value: b, setValue: y, disabled: R } = nv(), I = C.useState("disabled"), S = l || R || I, v = b === u, { getItemProps: T, itemRef: w } = Wr({ closeOnClick: c, disabled: S, highlighted: g, id: h, store: C, nativeButton: a, nodeId: d?.context.nodeId, itemMetadata: Gr }), P = nf.useMemo(() => ({ disabled: S, highlighted: g, checked: v }), [S, g, v]);
  function O(D) {
    let A = Q(H.itemPress, D.nativeEvent, void 0, { preventUnmountOnClose: Oe });
    y(u, A);
  }
  let N = U("div", t, { state: P, stateAttributesMapping: $r, props: [x, { role: "menuitemradio", "aria-checked": v, onClick: O }, p, T], ref: [w, o, m.ref] });
  return (0, sv.jsx)(Hm.Provider, { value: P, children: N });
});
var rf = E(M(), 1);
var cv = rf.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, keepMounted: s = false, ...a } = t, l = iv(), c = rf.useRef(null), { transitionStatus: u, mounted: f, setMounted: p } = wt(l.checked);
  it({ batch: true, enabled: !l.checked, open: l.checked, ref: c, onComplete() {
    l.checked || p(false);
  } });
  let m = { checked: l.checked, disabled: l.disabled, highlighted: l.highlighted, transitionStatus: u };
  return U("span", t, { state: m, stateAttributesMapping: $r, ref: [o, c], props: { "aria-hidden": true, ...a }, enabled: s || f });
});
var Gt = E(M(), 1);
var sf = E(M(), 1);
var _M = sf.createContext(null);
function af(e4) {
  let t = sf.useContext(_M);
  if (t === null && !e4) throw new Error(Re(5));
  return t;
}
var tc = E(M(), 1);
var lv = { ...Dr, disabled: (e4) => e4.parent.type === "menubar" && e4.parent.context.disabled || e4.disabled, modal: (e4) => (e4.parent.type === void 0 || e4.parent.type === "context-menu") && (e4.modal ?? true), openMethod: (e4) => e4.openMethod, allowMouseEnter: (e4) => e4.allowMouseEnter, highlightItemOnHover: (e4) => e4.highlightItemOnHover, parent: (e4) => e4.parent, rootId: (e4) => e4.parent.type === "menu" ? e4.parent.store.select("rootId") : e4.parent.type !== void 0 ? e4.parent.context.rootId : e4.rootId, activeIndex: (e4) => e4.activeIndex, isActive: (e4, t) => e4.activeIndex === t, hoverEnabled: (e4) => e4.hoverEnabled, instantType: (e4) => e4.instantType, lastOpenChangeReason: (e4) => e4.openChangeReason, floatingTreeRoot: (e4) => e4.parent.type === "menu" ? e4.parent.store.select("floatingTreeRoot") : e4.floatingTreeRoot, floatingNodeId: (e4) => e4.floatingNodeId, floatingParentNodeId: (e4) => e4.floatingParentNodeId, itemProps: (e4) => e4.itemProps, closeDelay: (e4) => e4.closeDelay, adaptiveOrigin: (e4) => e4.adaptiveOrigin, keyboardEventRelay: (e4) => {
  if (e4.keyboardEventRelay) return e4.keyboardEventRelay;
  if (e4.parent.type === "menu") return e4.parent.store.select("keyboardEventRelay");
} };
var cf = class extends xo {
  constructor(t, o, n = false) {
    let r = new Ro(), i = pv(r, o, n, t);
    super(i, fv(r), lv), this.unsubscribeParentListener = this.observe("parent", (s) => {
      if (this.unsubscribeParentListener?.(), s.type === "menu") {
        let a = s.store.select("rootId"), l = s.store.select("floatingTreeRoot"), c = s.store.select("keyboardEventRelay");
        this.unsubscribeParentListener = s.store.subscribe(() => {
          let u = s.store.select("rootId"), f = s.store.select("floatingTreeRoot"), p = s.store.select("keyboardEventRelay");
          a === u && l === f && c === p || (a = u, l = f, c = p, this.notifyAll());
        }), this.context.allowMouseUpTriggerRef = s.store.context.allowMouseUpTriggerRef;
        return;
      }
      s.type !== void 0 && (this.context.allowMouseUpTriggerRef = s.context.allowMouseUpTriggerRef), this.unsubscribeParentListener = null;
    });
  }
  setOpen(t, o) {
    this.state.floatingRootContext.context.events.emit("setOpen", { open: t, eventDetails: o });
  }
  unsubscribeParentListener = null;
};
function uv() {
  let e4 = new Ro(), t = new Ln(Object.freeze(pv(e4)), Object.freeze(fv(e4)), lv);
  return Object.assign(t, { setOpen: Oe });
}
function fv(e4) {
  return { positionerRef: tc.createRef(), popupRef: tc.createRef(), typingRef: { current: false }, itemDomElements: { current: [] }, itemLabels: { current: [] }, allowMouseUpTriggerRef: { current: false }, triggerFocusTargetRef: tc.createRef(), beforeContentFocusGuardRef: tc.createRef(), onOpenChangeComplete: void 0, triggerElements: e4 };
}
function pv(e4, t, o = false, n) {
  return { ...Nr(e4, t, o), disabled: false, modal: true, openMethod: null, allowMouseEnter: false, highlightItemOnHover: true, parent: { type: void 0 }, rootId: void 0, activeIndex: null, hoverEnabled: true, instantType: void 0, openChangeReason: null, floatingTreeRoot: new yr(), floatingNodeId: void 0, floatingParentNodeId: null, itemProps: Me, keyboardEventRelay: void 0, closeDelay: 0, adaptiveOrigin: void 0, ...n };
}
var lf = E(M(), 1);
var Um = lf.createContext(void 0);
function uf() {
  return lf.useContext(Um);
}
var oc = E(Ie(), 1);
var ff = tr(function(t) {
  let { children: o, open: n, onOpenChange: r, onOpenChangeComplete: i, defaultOpen: s = false, disabled: a = false, modal: l, loopFocus: c = true, orientation: u = "vertical", actionsRef: f, closeParentOnEsc: p = false, handle: m, triggerId: d, defaultTriggerId: h = null, highlightItemOnHover: C = true } = t, g = jr(true), x = xt(true), b = af(true), y = uf(), R = Gt.useMemo(() => y && x ? { type: "menu", store: x.store } : b ? { type: "menubar", context: b } : g && !x ? { type: "context-menu", context: g } : { type: void 0 }, [g, x, b, y]), I = Bo(), S = Bo(), v = Oo(), T = R.type === "menu" ? R.store : void 0, w = (n ?? s) && T?.state.transitionStatus === "starting", P = qe(() => w ? T?.state.instantType : void 0).current, O = BM({ open: s, openProp: n, activeTriggerId: h, triggerIdProp: d, parent: R, disabled: a, highlightItemOnHover: C, modal: R.type === void 0 ? l : void 0, rootId: I, instantType: P }, S, v != null);
  O.useControlledProp("openProp", n), O.useControlledProp("triggerIdProp", d), O.useContextCallback("onOpenChangeComplete", i);
  let N = O.useState("floatingTreeRoot"), D = yi(N), A = O.useState("open"), _ = O.useState("activeTriggerElement"), B = O.useState("positionerElement"), k = O.useState("hoverEnabled"), F = O.useState("disabled"), $ = O.useState("lastOpenChangeReason"), K = O.useState("parent"), Y = O.useState("activeIndex"), te = O.useState("payload"), L = O.useState("floatingParentNodeId"), j = Gt.useRef(null), z = Gt.useRef(K.type !== "context-menu"), J = ot(), X = Gt.useRef(true), pe = ot(), de = L != null, { openMethod: ye, triggerProps: ce } = Jl(A);
  O.useSyncedValues({ disabled: a, highlightItemOnHover: C, modal: K.type === void 0 ? l : void 0, openMethod: ye, rootId: I }), wr(O);
  let { forceUnmount: fe, transitionStatus: se } = Or(A, O, () => {
    O.set("allowMouseEnter", false);
  }, w), ge = Ao(O.context.popupRef);
  Gt.useEffect(() => {
    if (P === void 0) return;
    let ve = () => {
      O.state.instantType === P && O.set("instantType", void 0);
    };
    if (!A) {
      ve();
      return;
    }
    if (se !== void 0) return;
    if (O.context.popupRef.current == null) {
      ve();
      return;
    }
    let Fe = new AbortController();
    return ge(ve, Fe.signal), () => {
      Fe.abort();
    };
  }, [P, A, se, ge, O]), W(() => {
    g && !x ? O.update({ parent: { type: "context-menu", context: g }, floatingNodeId: D, floatingParentNodeId: v }) : x && O.update({ floatingNodeId: D, floatingParentNodeId: v });
  }, [g, x, D, v, O]), Gt.useEffect(() => {
    if (A || (j.current = null), K.type === "context-menu") {
      if (!A) {
        J.clear(), z.current = false;
        return;
      }
      J.start(500, () => {
        z.current = true;
      });
    }
  }, [J, A, K.type]), W(() => {
    !A && !k && O.set("hoverEnabled", true);
  }, [A, k, O]);
  let be = G((ve, Fe) => {
    let nt = Fe.reason;
    if (!ve && !O.select("open") || A === ve && Fe.trigger === _ && $ === nt) return;
    let Vt = Na(Fe);
    if (!ve && Fe.trigger == null && (Fe.trigger = _ ?? void 0), r?.(ve, Fe), Fe.isCanceled) return;
    O.state.floatingRootContext.dispatchOpenChange(ve, Fe);
    let Ge = Fe.event;
    if (ve === false && Ge?.type === "click" && Ge.pointerType === "touch" && !X.current) return;
    ve && nt === H.triggerFocus ? (X.current = false, pe.start(300, () => {
      X.current = true;
    })) : (X.current = true, pe.clear());
    let Ne = (nt === H.triggerPress || nt === H.itemPress) && Ge.detail === 0, mt = !ve && (nt === H.escapeKey || nt == null);
    j.current = Fe.event;
    let tt = Ii(O.state, ve, Fe.trigger, Vt());
    tt.openChangeReason = nt, K.type === "menubar" && (nt === H.triggerFocus || nt === H.focusOut || nt === H.triggerHover || nt === H.listNavigation || nt === H.siblingOpen) ? tt.instantType = "group" : Ne || mt ? tt.instantType = Ne ? "click" : "dismiss" : tt.instantType = void 0, O.update(tt);
  }), re = Ma({ popupStore: O, floatingRootContext: O.state.floatingRootContext, floatingId: S, nested: v != null, onOpenChange: be }), Z = re.context.events;
  W(() => {
    let ve = ({ open: Fe, eventDetails: nt }) => be(Fe, nt);
    return Z.on("setOpen", ve), () => {
      Z?.off("setOpen", ve);
    };
  }, [Z, be]);
  let ee = Gt.useCallback(() => {
    O.setOpen(false, Q(H.imperativeAction));
  }, [O]);
  Gt.useImperativeHandle(f, () => ({ unmount: fe, close: ee }), [fe, ee]);
  let le;
  K.type === "context-menu" && (le = K.context), Gt.useImperativeHandle(le?.positionerRef, () => B, [B]), Gt.useImperativeHandle(le?.actionsRef, () => ({ setOpen: be }), [be]);
  let ue = xn(re, { enabled: !F, bubbles: { escapeKey: p && K.type === "menu" }, outsidePress() {
    return K.type !== "context-menu" || j.current?.type === "contextmenu" ? true : z.current;
  }, externalTree: de ? N : void 0 }), xe = Zt(), ae = Gt.useCallback((ve) => {
    O.select("activeIndex") !== ve && O.set("activeIndex", ve);
  }, [O]), oe = ka(re, { enabled: !F, listRef: O.context.itemDomElements, activeIndex: Y, nested: K.type !== void 0, loopFocus: c, orientation: u, parentOrientation: K.type === "menubar" ? K.context.orientation : void 0, rtl: xe === "rtl", disabledIndices: It, onNavigate: ae, openOnArrowKeyDown: K.type !== "context-menu", externalTree: de ? N : void 0, focusItemOnHover: C }), he = Gt.useCallback((ve) => {
    O.context.typingRef.current = ve;
  }, [O]), ne = Fa(re, { enabled: !F, listRef: O.context.itemLabels, elementsRef: O.context.itemDomElements, activeIndex: Y, resetMs: 500, onMatch: (ve) => {
    A && ve !== Y && O.set("activeIndex", ve);
  }, onTyping: he }), q = Gt.useMemo(() => {
    let ve = Rt(ne.reference, oe.reference, ue.reference, { onMouseMove() {
      O.set("allowMouseEnter", true);
    } }, ce);
    return ve["aria-haspopup"] = "menu", ve["aria-expanded"] = A, ve;
  }, [O, ne.reference, oe.reference, ue.reference, ce, A]), Ee = Gt.useMemo(() => {
    let ve = Rt(oe.trigger, ue.trigger, ce);
    return ve["aria-haspopup"] = "menu", ve["aria-expanded"] = false, ve;
  }, [oe.trigger, ue.trigger, ce]);
  qe(() => (O.update({ inactiveTriggerProps: Ee }), null));
  let we = Gt.useMemo(() => Rt(Fn, { id: S, role: "menu", "aria-orientation": u === "horizontal" ? "horizontal" : void 0, "aria-labelledby": _?.id, onMouseMove() {
    O.set("allowMouseEnter", true), K.type === "menu" && O.set("hoverEnabled", false);
  }, onClick() {
    O.select("hoverEnabled") && O.set("hoverEnabled", false);
  }, onKeyDown(ve) {
    let Fe = O.select("keyboardEventRelay");
    Fe && !ve.isPropagationStopped() && Fe(ve);
  } }, ne.floating, oe.floating, ue.floating), [_, S, u, K.type, O, ne.floating, oe.floating, ue.floating]), je = oe.item ?? Me;
  Mr(O, { floatingRootContext: re, activeTriggerProps: q, inactiveTriggerProps: Ee, popupProps: we, itemProps: je });
  let et = Gt.useMemo(() => ({ store: O, parent: R }), [O, R]), ke = (0, oc.jsxs)(Am.Provider, { value: et, children: [m && (0, oc.jsx)(Pr, { handle: m, store: O }), typeof o == "function" ? o({ payload: te }) : o] });
  return K.type === void 0 || K.type === "context-menu" ? (0, oc.jsx)(Sa, { externalTree: N, children: ke }) : ke;
});
function BM(e4, t, o) {
  return qe(() => new cf(e4, t, o)).current;
}
var dv = E(M(), 1);
var jm = E(Ie(), 1);
function mv(e4) {
  let t = xt().store, o = dv.useMemo(() => ({ parentMenu: t }), [t]);
  return (0, jm.jsx)(Um.Provider, { value: o, children: (0, jm.jsx)(ff, { ...e4 }) });
}
var vo = E(M(), 1);
var gv = E(M(), 1);
function pf(e4 = {}) {
  let { highlightItemOnHover: t, highlightedIndex: o, onHighlightedIndexChange: n } = hr(), { ref: r, index: i } = kt(e4), s = o === i, a = gv.useRef(null), l = ht(r, a);
  return { compositeProps: { tabIndex: s ? 0 : -1, onFocus() {
    n(i);
  }, onMouseMove() {
    let u = a.current;
    if (!t || !u) return;
    let f = u.hasAttribute("disabled") || u.ariaDisabled === "true";
    !s && !f && u.focus();
  } }, compositeRef: l, index: i };
}
function rn(e4) {
  let { render: t, className: o, style: n, state: r = Me, props: i = It, refs: s = It, metadata: a, stateAttributesMapping: l, tag: c = "div", ...u } = e4, { compositeProps: f, compositeRef: p } = pf({ metadata: a });
  return U(c, e4, { state: r, ref: [p, ...s], props: [f, ...i, u], stateAttributesMapping: l });
}
function Gm(e4) {
  if (Ve(e4) && e4.hasAttribute("data-rootownerid")) return e4.getAttribute("data-rootownerid");
  if (!So(e4)) return Gm(po(e4));
}
var hv = E(M(), 1);
var Wm = E(Ko(), 1);
function df(e4, t) {
  let o = hv.useRef(null);
  function n(i) {
    Wm.flushSync(() => {
      e4.setOpen(false, Q(H.focusOut, i.nativeEvent, i.currentTarget));
    }), Lb(o.current)?.focus();
  }
  function r(i) {
    let s = e4.select("positionerElement");
    if (s && Zn(i, s)) e4.context.beforeContentFocusGuardRef.current?.focus();
    else {
      Wm.flushSync(() => {
        e4.setOpen(false, Q(H.focusOut, i.nativeEvent, i.currentTarget));
      });
      let a = Vb(e4.context.triggerFocusTargetRef.current || t.current);
      for (; a !== null && me(s, a); ) {
        let l = a;
        if (a = ls(a), a === l) break;
      }
      a?.focus();
    }
  }
  return { preFocusGuardRef: o, handlePreFocusGuardFocus: n, handleFocusTargetFocus: r };
}
var mf = E(M(), 1);
function bv(e4) {
  let { enabled: t = true, mouseDownAction: o, open: n } = e4, r = mf.useRef(false);
  return mf.useMemo(() => t ? { onMouseDown: (i) => {
    (o === "open" && !n || o === "close" && n) && (r.current = true, Te(i.currentTarget).addEventListener("click", () => {
      r.current = false;
    }, { once: true }));
  }, onClick: (i) => {
    r.current && (r.current = false, i.preventBaseUIHandler());
  } } : Me, [t, o, n]);
}
var Kr = E(Ie(), 1);
var xv = Ir(function(t, o) {
  let { render: n, className: r, style: i, disabled: s = false, nativeButton: a = true, id: l, openOnHover: c, delay: u = 100, closeDelay: f = 0, handle: p, payload: m, ...d } = t, h = xt(true), g = Ar(p) ?? h?.store;
  if (!g) throw new Error(Re(85));
  let x = Pe(l), b = g.useState("isTriggerActive", x), y = g.useState("floatingRootContext"), R = g.useState("isOpenedByTrigger", x), I = g.useState("triggerPopupId", x), S = vo.useRef(null), v = jM(), T = hr(true), w = ho(), P = vo.useMemo(() => w ?? new yr(), [w]), O = yi(P), N = Oo(), { registerTrigger: D, isMountedByThisTrigger: A } = Tr(x, S, g, { payload: m, closeDelay: f, parent: v, floatingTreeRoot: P, floatingNodeId: O, floatingParentNodeId: N, keyboardEventRelay: T?.relayKeyboardEvent }), _ = v.type === "menubar", B = g.useState("disabled"), k = s || B || _ && v.context.disabled, { getButtonProps: F, buttonRef: $ } = Ke({ disabled: k, native: a });
  vo.useEffect(() => {
    !R && v.type === void 0 && (g.context.allowMouseUpTriggerRef.current = false);
  }, [g, R, v.type]);
  let K = vo.useRef(null), Y = ot(), te = G((le) => {
    if (!K.current) return;
    Y.clear(), g.context.allowMouseUpTriggerRef.current = false;
    let ue = le.target;
    me(K.current, ue) || me(g.select("positionerElement"), ue) || ue === K.current || ue != null && Gm(ue) === g.select("rootId") || lu(le, K.current) || P.events.emit("close", { domEvent: le, reason: H.cancelOpen });
  });
  vo.useEffect(() => {
    R && g.select("lastOpenChangeReason") === H.triggerHover && Te(K.current).addEventListener("mouseup", te, { once: true });
  }, [R, te, g]);
  let L = _ && v.context.hasSubmenuOpen, z = or(y, { enabled: (c ?? L) && !k && (!_ || L && !A), handleClose: nr({ blockPointerEvents: !_ }), mouseOnly: true, move: false, restMs: v.type === void 0 ? u : void 0, delay: { close: f }, triggerElementRef: S, externalTree: P, isActiveTrigger: b, isClosing: () => g.select("transitionStatus") === "ending" }), J = UM(R, g.select("lastOpenChangeReason")), X = Uo(y, { enabled: !k, event: R && _ ? "click" : "mousedown", toggle: true, ignoreMouse: false, stickIfOpen: v.type === void 0 ? J : false }), pe = Aa(y, { enabled: !k && L }), de = bv({ open: R, enabled: _, mouseDownAction: "open" }), ye = vo.useMemo(() => Rt(pe.reference, X.reference), [pe.reference, X.reference]), ce = g.useState("triggerProps", A), { preFocusGuardRef: fe, handlePreFocusGuardFocus: se, handleFocusTargetFocus: ge } = df(g, S), be = { disabled: k, open: R }, re = [K, o, $, D, S], Z = [ye, z ?? Me, ce, { "aria-haspopup": "menu", "aria-controls": I, id: x, onMouseDown: (le) => {
    if (g.select("open")) return;
    Y.start(200, () => {
      g.context.allowMouseUpTriggerRef.current = true;
    }), Te(le.currentTarget).addEventListener("mouseup", te, { once: true });
  } }, _ ? { role: "menuitem" } : {}, de, d, F], ee = U("button", t, { enabled: !_, stateAttributesMapping: gi, state: be, ref: re, props: Z });
  return _ ? (0, Kr.jsx)(rn, { tag: "button", render: n, className: r, style: i, state: be, refs: re, props: Z, stateAttributesMapping: gi }) : R ? (0, Kr.jsxs)(vo.Fragment, { children: [(0, Kr.jsx)(Xo, { ref: fe, onFocus: se }, `${x}-pre-focus-guard`), (0, Kr.jsx)(vo.Fragment, { children: ee }, x), (0, Kr.jsx)(Xo, { ref: g.context.triggerFocusTargetRef, onFocus: ge }, `${x}-post-focus-guard`)] }) : (0, Kr.jsx)(vo.Fragment, { children: ee }, x);
});
function UM(e4, t) {
  let o = ot(), [n, r] = vo.useState(false);
  return W(() => {
    e4 && t === H.triggerHover ? (r(true), o.start(500, () => {
      r(false);
    })) : e4 || (o.clear(), r(false));
  }, [e4, t, o]), n;
}
function jM() {
  let e4 = af(true);
  return vo.useMemo(() => e4 ? { type: "menubar", context: e4 } : { type: void 0 }, [e4]);
}
var wv = E(M(), 1);
var lo = E(M(), 1);
var Tv = E(Ko(), 1);
var Rv = E(M(), 1);
function Cv(e4) {
  let [t, o] = Rv.useState({ current: e4, previous: null });
  return Object.is(e4, t.current) || o({ current: e4, previous: t.current }), t.previous;
}
var _s = E(M(), 1);
function Ls(e4) {
  let t = Ut(e4), o = parseFloat(t.width) || 0, n = parseFloat(t.height) || 0, r = Ve(e4), i = r ? e4.offsetWidth : o, s = r ? e4.offsetHeight : n;
  return (Cr(o) !== i || Cr(n) !== s) && (o = i, n = s), { width: o, height: n };
}
var nc = "--popup-width";
var rc = "--popup-height";
function Ev(e4) {
  let { popupElement: t, positionerElement: o, content: n, mounted: r, onMeasureLayout: i, onMeasureLayoutComplete: s, side: a, direction: l } = e4, c = Ao(t, true), u = Io(), f = _s.useRef(null), p = _s.useRef(true), m = _s.useRef(Oe), d = G(i), h = G(s), C = _s.useMemo(() => GM(a, l), [a, l]);
  W(() => {
    if (!r) {
      m.current = Oe, p.current = true, f.current = null;
      return;
    }
    if (!t || !o) return;
    m.current = vv(t, C), $m(t, "auto");
    let g = hf(t, "position", "static"), x = hf(t, "transform", "none"), b = hf(t, "scale", "1"), y = vv(o, { [Pu]: "max-content", [Tu]: "max-content" });
    function R() {
      g(), x(), y();
    }
    function I() {
      R(), b();
    }
    if (d?.(), p.current || f.current === null) {
      gf(o, "max-content");
      let w = Ls(t);
      return f.current = w, gf(o, w), I(), h?.(null, w), p.current = false, () => {
        m.current(), m.current = Oe;
      };
    }
    gf(o, "max-content");
    let S = f.current, v = Ls(t);
    f.current = v, $m(t, S), I(), h?.(S, v), gf(o, v);
    let T = new AbortController();
    return u.request(() => {
      $m(t, v), c(() => {
        t.style.setProperty(nc, "auto"), t.style.setProperty(rc, "auto");
      }, T.signal);
    }), () => {
      T.abort(), u.cancel(), m.current(), m.current = Oe;
    };
  }, [n, t, o, c, u, r, d, h, C]);
}
function GM(e4, t) {
  let o = e4 === "top", n = e4 === "left" || e4 === (t === "rtl" ? "inline-end" : "inline-start");
  return !o && !n ? Me : { position: "absolute", [o ? "bottom" : "top"]: "0", [n ? "right" : "left"]: "0" };
}
function hf(e4, t, o) {
  let n = e4.style.getPropertyValue(t);
  return e4.style.setProperty(t, o), () => {
    e4.style.setProperty(t, n);
  };
}
function vv(e4, t) {
  let o = [];
  for (let [n, r] of Object.entries(t)) o.push(hf(e4, n, r));
  return o.length ? () => {
    o.forEach((n) => n());
  } : Oe;
}
function $m(e4, t) {
  let o = t === "auto" ? "auto" : `${t.width}px`, n = t === "auto" ? "auto" : `${t.height}px`;
  e4.style.setProperty(nc, o), e4.style.setProperty(rc, n);
}
function gf(e4, t) {
  let o = t === "max-content" ? "max-content" : `${t.width}px`, n = t === "max-content" ? "max-content" : `${t.height}px`;
  e4.style.setProperty(TC, o), e4.style.setProperty(wC, n);
}
var Iv = { name: "adaptiveOrigin", async fn(e4) {
  let { x: t, y: o, rects: { floating: n }, elements: { floating: r }, platform: i, strategy: s, placement: a } = e4, l = Be(r), c = l.getComputedStyle(r);
  if (!(c.transitionDuration !== "0s" && c.transitionDuration !== "")) return { x: t, y: o, data: Ms };
  let f = await i.getOffsetParent?.(r), p = { width: 0, height: 0 };
  if (s === "fixed" && l?.visualViewport) p = { width: l.visualViewport.width, height: l.visualViewport.height };
  else if (f === l) {
    let x = Te(r);
    p = { width: x.documentElement.clientWidth, height: x.documentElement.clientHeight };
  } else await i.isElement?.(f) && (p = await i.getDimensions(f));
  let m = go(a), d = t, h = o;
  m === "left" && (d = p.width - (t + n.width)), m === "top" && (h = p.height - (o + n.height));
  let C = m === "left" ? "right" : Ms.sideX, g = m === "top" ? "bottom" : Ms.sideY;
  return { x: d, y: h, data: { sideX: C, sideY: g } };
} };
var Sv = "data-activation-direction";
var Bs = E(Ie(), 1);
var Hs = { activationDirection: (e4) => e4 ? { [Sv]: e4 } : null };
function Us(e4) {
  let { store: t, side: o, children: n } = e4, r = Zt(), i = t.useState("activeTriggerElement"), s = t.useState("activeTriggerId"), a = t.useState("open"), l = t.useState("payload"), c = t.useState("mounted"), u = t.useState("popupElement"), f = t.useState("positionerElement"), p = Cv(a ? i : null), m = KM(s, l), d = lo.useRef(null), [h, C] = lo.useState(null), [g, x] = lo.useState(null), b = lo.useRef(null), y = lo.useRef(null), R = Ao(b, true), I = Io(), S = lo.useRef(null), [v, T] = lo.useState(null), [w, P] = lo.useState(false);
  W(() => (t.set("adaptiveOrigin", Iv), () => {
    t.set("adaptiveOrigin", void 0);
  }), [t]);
  let O = G(() => {
    b.current?.style.setProperty("animation", "none"), b.current?.style.setProperty("transition", "none"), y.current?.style.setProperty("display", "none");
  }), N = G((F) => {
    b.current?.style.removeProperty("animation"), b.current?.style.removeProperty("transition"), y.current?.style.removeProperty("display"), F && T(F);
  }), D = G(() => {
    S.current?.abort();
    let F = new AbortController();
    S.current = F, R(() => {
      C(null), T(null), d.current = null;
    }, F.signal);
  }), A = lo.useRef(null);
  W(() => {
    (!a || !c) && (A.current = null);
  }, [a, c]), W(() => {
    if (i && p && i !== p && A.current !== i && d.current) {
      C(d.current), P(true);
      let F = zM(p, i);
      x(F), A.current = i;
    }
  }, [i, p]), W(() => {
    h != null && (S.current?.abort(), P(true), I.request(() => {
      Tv.flushSync(() => {
        P(false);
      }), D();
    }));
  }, [m, h, D, I]), W(() => {
    let F = b.current;
    if (!F) return;
    let $ = Te(F).createElement("div");
    for (let K of Array.from(F.childNodes)) $.appendChild(K.cloneNode(true));
    d.current = $;
  });
  let _ = h != null, B;
  _ ? B = (0, Bs.jsxs)(lo.Fragment, { children: [(0, Bs.jsx)("div", { "data-previous": true, inert: en(true), ref: y, style: { ...v ? { [nc]: `${v.width}px`, [rc]: `${v.height}px` } : null, position: "absolute" }, "data-ending-style": w ? void 0 : "" }, "previous"), (0, Bs.jsx)("div", { "data-current": true, ref: b, "data-starting-style": w ? "" : void 0, children: n }, m)] }) : B = (0, Bs.jsx)("div", { "data-current": true, ref: b, children: n }, m), W(() => {
    let F = y.current;
    !F || !h || F.replaceChildren(...Array.from(h.childNodes));
  }, [h]), Ev({ popupElement: u, positionerElement: f, mounted: c, content: l, onMeasureLayout: O, onMeasureLayoutComplete: N, side: o, direction: r });
  let k = { activationDirection: $M(g), transitioning: _ };
  return { children: B, state: k };
}
function $M(e4) {
  if (e4) return `${Pv(e4.horizontal, 5, "right", "left")} ${Pv(e4.vertical, 5, "down", "up")}`;
}
function Pv(e4, t, o, n) {
  return e4 > t ? o : e4 < -t ? n : "";
}
function zM(e4, t) {
  let o = e4.getBoundingClientRect(), n = t.getBoundingClientRect(), r = { x: o.left + o.width / 2, y: o.top + o.height / 2 }, i = { x: n.left + n.width / 2, y: n.top + n.height / 2 };
  return { horizontal: i.x - r.x, vertical: i.y - r.y };
}
function KM(e4, t) {
  let [o, n] = lo.useState(0), r = lo.useRef(e4), i = lo.useRef(t), s = lo.useRef(false);
  return W(() => {
    let a = r.current, l = i.current, c = e4 !== a, u = t !== l;
    c ? (n((f) => f + 1), s.current = !u) : s.current && u && (n((f) => f + 1), s.current = false), r.current = e4, i.current = t;
  }, [e4, t]), `${e4 ?? "current"}-${o}`;
}
var Ov = wv.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, children: s, ...a } = t, { store: l } = xt(), { side: c } = yo(), u = l.useState("instantType"), { children: f, state: p } = Us({ store: l, side: c, children: s }), m = { activationDirection: p.activationDirection, transitioning: p.transitioning, instant: u };
  return U("div", t, { state: m, ref: o, props: [a, { children: f }], stateAttributesMapping: Hs });
});
var Mv = E(M(), 1);
var ic = Mv.forwardRef(function(t, o) {
  let { className: n, render: r, orientation: i = "horizontal", style: s, ...a } = t;
  return U("div", t, { state: { orientation: i }, ref: o, props: [{ role: "separator", "aria-orientation": i }, a] });
});
var sr = E(M(), 1);
function Nv(e4) {
  return e4 == null || e4.hasAttribute("disabled") || e4.getAttribute("aria-disabled") === "true";
}
var YM = { "aria-expanded": void 0 };
var Dv = sr.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, label: s, id: a, nativeButton: l = false, openOnHover: c = true, delay: u = 100, closeDelay: f = 0, disabled: p = false, ...m } = t, d = uf();
  if (!d?.parentMenu) throw new Error(Re(37));
  let h = kt({ guess: true, label: s }), C = yo(), { store: g } = xt(), x = Pe(a), b = g.useState("open"), y = g.useState("floatingRootContext"), R = g.useState("floatingTreeRoot"), I = g.useState("triggerPopupId", x), S = Bd(x, g), v = G((ye) => {
    S(ye), ye !== null && g.select("open") && g.select("activeTriggerId") == null && g.update({ activeTriggerId: x ?? null, activeTriggerElement: ye, closeDelay: f });
  }), T = sr.useRef(null), w = sr.useCallback((ye) => {
    T.current = ye, g.set("activeTriggerElement", ye);
  }, [g]);
  W(() => (v(T.current), () => v(null)), [v, x, g]), g.useSyncedValue("closeDelay", f);
  let P = d.parentMenu, O = g.useState("disabled"), N = P.useState("disabled"), D = p || O || N, A = P.useState("itemProps"), _ = P.useState("isActive", h.index), B = sr.useMemo(() => ({ type: "submenu-trigger", setActive() {
    P.select("highlightItemOnHover") && P.set("activeIndex", h.index);
  } }), [P, h.index]), { getItemProps: k, itemRef: F } = Wr({ closeOnClick: false, disabled: D, highlighted: _, id: x, store: g, typingRef: P.context.typingRef, nativeButton: l, itemMetadata: B, nodeId: C?.context.nodeId }), $ = g.useState("hoverEnabled"), K = or(y, { enabled: $ && c && !D, handleClose: nr({ blockPointerEvents: true }), mouseOnly: true, move: true, restMs: u, delay: { open: u, close: f }, shouldOpen: u > 0 ? () => P.select("allowMouseEnter") : void 0, triggerElementRef: T, externalTree: R, isClosing: () => g.select("transitionStatus") === "ending", guardStaleOpen: true }), te = Uo(y, { enabled: !D, event: "mousedown", toggle: !c, ignoreMouse: c, stickIfOpen: false }).reference ?? Me, L = g.useState("triggerProps", true);
  delete L.id;
  let j = { disabled: D, highlighted: _, open: b }, z = g.useState("openMethod"), X = g.useState("lastOpenChangeReason") === H.listNavigation || z === "keyboard", pe = b && X && Je.screenReader.voiceOver;
  return U("div", t, { state: j, stateAttributesMapping: Mn, props: [te, K, L, A, pe ? YM : void 0, { "aria-controls": I, tabIndex: b || _ ? 0 : -1, onBlur() {
    _ && P.set("activeIndex", null);
  } }, m, k], ref: [o, h.ref, F, v, w] });
});
var sc = class extends kn {
  constructor() {
    super(uv(), "Menu");
  }
  open(t) {
    this.openByTrigger(t);
  }
  close() {
    this.closePopup();
  }
  get isOpen() {
    return this.attachedStore?.select("open") ?? false;
  }
};
function Av() {
  return new sc();
}
var bf = E(M(), 1);
var qM = bf.createContext(void 0);
var XM = { disableStyleElements: false };
function kv() {
  return bf.useContext(qM) ?? XM;
}
var yn = {};
Tt(yn, { Backdrop: () => rR, Close: () => sR, Description: () => cR, Handle: () => Ua, Popup: () => gR, Portal: () => RR, Root: () => Fv, Title: () => yR, Trigger: () => SR, Viewport: () => TR, createHandle: () => wR });
var Fv = tr(function(t) {
  return oR("dialog", t);
});
function Wt(e4, t = Number.MIN_SAFE_INTEGER, o = Number.MAX_SAFE_INTEGER) {
  return Math.max(t, Math.min(e4, o));
}
function Vv(e4, t) {
  let o = (t ?? Be(e4).getComputedStyle(e4)).transform, n = 0, r = 0, i = 1;
  if (o && o !== "none") {
    let s = o.match(/matrix(?:3d)?\(([^)]+)\)/);
    if (s) {
      let a = s[1].split(", ").map(parseFloat);
      a.length === 6 ? (n = a[4], r = a[5], i = Math.sqrt(a[0] * a[0] + a[1] * a[1])) : a.length === 16 && (n = a[12], r = a[13], i = a[0]);
    }
  }
  return { x: n, y: r, scale: i };
}
var vn = {};
Tt(vn, { Control: () => Wv, Description: () => Gv, Error: () => Uv, Item: () => Kv, Label: () => Hv, Root: () => Bv, Validity: () => zv });
var ro = E(M(), 1);
var xf = E(M(), 1);
var ZM = xf.createContext(void 0);
function Rf(e4 = false) {
  let t = xf.useContext(ZM);
  if (!t && !e4) throw new Error(Re(86));
  return t;
}
var Yr = E(M(), 1);
var Lv = E(Ie(), 1);
var Cf = function(t) {
  let o = Pe(), [n, r] = Yr.useState(o), [i, s] = Yr.useState(), [a, l] = Yr.useState([]), c = n === void 0 ? o : n, u = qe(() => /* @__PURE__ */ new Map()), { messageIds: f } = pt(), p = G((C, g) => {
    let x = u.current;
    g === void 0 ? x.delete(C) : x.set(C, g), r((b) => {
      if (x.size === 0) return b;
      let y;
      for (let R of x.values()) {
        if (R === b) return b;
        y === void 0 && (y = R);
      }
      return y;
    });
  }), m = G(() => {
    u.current.size === 0 && r(o);
  }), d = Yr.useCallback((C) => {
    let g = C["aria-describedby"] ? C["aria-describedby"].split(" ") : [];
    return g.push(...f, ...a), { ...C, "aria-describedby": Array.from(new Set(g)).join(" ") || void 0 };
  }, [f, a]), h = Yr.useMemo(() => ({ controlId: c, registerControlId: p, resetControlId: m, labelId: i, setLabelId: s, messageIds: a, setMessageIds: l, getDescriptionProps: d }), [c, p, m, i, s, a, l, d]);
  return (0, Lv.jsx)(lm.Provider, { value: h, children: t.children });
};
var yf = E(M(), 1);
function _v(e4) {
  let { change: t, commit: o, invalid: n, markedDirtyRef: r, name: i, setRegisteredFieldName: s, registeredFieldIdRef: a, setValidityData: l, validityData: c } = e4, { formRef: u } = Xt(), f = yf.useRef(null), p = yf.useRef(null), m = yf.useRef(false), d = G(() => {
    let R = p.current;
    if (R) return R.getValue ? R.getValue() : R.value;
  });
  function h(R) {
    return R.value === void 0 ? d() : R.value;
  }
  let C = G(() => {
    let R = p.current;
    if (r.current = true, !R) {
      o(c.value);
      return;
    }
    o(h(R));
  });
  function g() {
    let R = p.current;
    !R || !R.id || u.current.fields.set(R.id, { getValue: d, name: i ?? R.name, controlRef: R.controlRef, validityData: Mi(c, n), validate: C });
  }
  function x(R = p.current?.id) {
    R && u.current.fields.delete(R);
  }
  function b(R) {
    if (m.current) return;
    m.current = true;
    let I = h(R);
    l((S) => S.initialValue === I ? S : { ...S, initialValue: I });
  }
  W(() => {
    let R = p.current;
    !R || !R.id || (s(i ? void 0 : R.name), u.current.fields.set(R.id, { getValue: d, name: i ?? R.name, controlRef: R.controlRef, validityData: Mi(c, n), validate: C }));
  }, [u, d, n, i, s, C, c]), W(() => {
    let R = u.current.fields;
    return () => {
      let I = p.current?.id;
      I && R.delete(I);
    };
  }, [u]);
  let y = G((R, I) => {
    if (!I) {
      f.current === R && (f.current = null, t(void 0, true), x(), p.current = null, s(void 0), a.current = void 0);
      return;
    }
    let S = p.current?.id, v = f.current;
    v && v !== R && t(void 0, true), f.current = R, p.current = I, i || s(I.name), a.current = I.id, S && S !== I.id && x(S), b(I), g();
  });
  return [C, y];
}
var vf = E(Ie(), 1);
var JM = ro.forwardRef(function(t, o) {
  let { errors: n, validationMode: r, submitCountRef: i } = Xt(), { render: s, className: a, validate: l, validationDebounceTime: c = 0, validationMode: u = r, name: f, disabled: p = false, invalid: m, dirty: d, touched: h, actionsRef: C, style: g, ...x } = t, b = Rf(true)?.disabled, y = G(l || (() => null)), R = b || p, [I, S] = ro.useState(false), [v, T] = ro.useState(false), [w, P] = ro.useState(false), [O, N] = ro.useState(false), D = d ?? v, A = h ?? I, _ = ro.useRef(D), B = ro.useRef(void 0), [k, F] = ro.useState(), $ = f ?? k;
  W(() => {
    d !== void 0 && (_.current = d);
  }, [d]);
  let K = G((be) => {
    d === void 0 && (be && (_.current = true), T(be));
  }), Y = G((be) => {
    h === void 0 && S(be);
  }), te = G(() => u === "onChange" || u === "onSubmit" && i.current > 0), L = $ && Object.hasOwn(n, $) ? n[$] : null, j = !!(Array.isArray(L) ? L.length : L), z = m === true || j, [J, X] = ro.useState({ state: Oi, error: "", errors: [], value: null, initialValue: null }), pe = !z && (R ? null : J.state.valid), de = ro.useMemo(() => ({ disabled: R, touched: A, dirty: D, valid: pe, filled: w, focused: O }), [R, A, D, pe, w, O]), ye = my({ setValidityData: X, validate: y, validityData: J, validationDebounceTime: c, invalid: z, markedDirtyRef: _, state: de, shouldValidateOnChange: te, validationMode: u, registeredFieldIdRef: B }), [ce, fe] = _v({ change: ye.change, commit: ye.commit, invalid: z, markedDirtyRef: _, name: f, setRegisteredFieldName: F, registeredFieldIdRef: B, setValidityData: X, validityData: J });
  ro.useImperativeHandle(C, () => ({ validate: ce }), [ce]);
  let se = ro.useMemo(() => ({ invalid: z, name: $, validityData: J, setValidityData: X, disabled: R, setTouched: Y, setDirty: K, setFilled: P, setFocused: N, validationMode: u, shouldValidateOnChange: te, state: de, registerFieldControl: fe, validation: ye }), [z, $, J, R, Y, K, P, N, u, te, de, fe, ye]), ge = U("div", t, { ref: o, state: de, props: x, stateAttributesMapping: vt });
  return (0, vf.jsx)(za.Provider, { value: se, children: ge });
});
var Bv = ro.forwardRef(function(t, o) {
  return (0, vf.jsx)(Cf, { children: (0, vf.jsx)(JM, { ...t, ref: o }) });
});
var ac = E(M(), 1);
var Hv = ac.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, id: s, nativeLabel: a = true, ...l } = t, c = Qe(false), u = Hr(), { labelId: f } = pt(), p = { ...c.state, disabled: c.disabled || u.disabled }, m = ac.useRef(null), d = ks({ id: f ?? s, native: a });
  return U("label", t, { ref: [o, m], state: p, props: [d, l], stateAttributesMapping: vt });
});
var Di = E(M(), 1);
var zm = E(Ie(), 1);
var QM = { ...vt, ...Ot };
var Uv = Di.forwardRef(function(t, o) {
  let { render: n, id: r, className: i, match: s, style: a, ...l } = t, c = Pe(r), { validityData: u, state: f, name: p } = Qe(false), { setMessageIds: m } = pt(), { errors: d } = Xt(), h = p && Object.hasOwn(d, p) ? d[p] : null, C = !!(Array.isArray(h) ? h.length : h), g = typeof s == "string", x = false;
  s === true ? x = true : f.disabled ? x = false : g ? x = !!u.state[s] : x = C || u.state.valid === false;
  let { mounted: b, transitionStatus: y, setMounted: R } = wt(x);
  W(() => {
    if (!(!x || !c)) return m((_) => _.concat(c)), () => {
      m((_) => _.filter((B) => B !== c));
    };
  }, [x, c, m]);
  let I = Di.useRef(null), [S, v] = Di.useState(null), [T, w] = Di.useState(null), P = u.error;
  !g && C ? P = h : u.errors.length > 1 && (P = u.errors);
  let O = P;
  Array.isArray(P) && (O = P.length > 1 ? (0, zm.jsx)("ul", { children: P.map((_) => (0, zm.jsx)("li", { children: _ }, _)) }) : P[0]);
  let N = Array.isArray(P) ? JSON.stringify(P) : P;
  x && N !== T && (w(N), v(O)), it({ open: x, ref: I, onComplete() {
    x || R(false);
  } });
  let D = { ...f, transitionStatus: y }, A = U("div", t, { ref: [o, I], state: D, props: [{ id: c, children: x ? O : S }, l], stateAttributesMapping: QM, enabled: b });
  return b ? A : null;
});
var jv = E(M(), 1);
var Gv = jv.forwardRef(function(t, o) {
  let { render: n, id: r, className: i, style: s, ...a } = t, l = Pe(r), c = Qe(false), u = Hr(), { setMessageIds: f } = pt(), p = { ...c.state, disabled: c.disabled || u.disabled };
  return W(() => {
    if (l) return f((d) => d.concat(l)), () => {
      f((d) => d.filter((h) => h !== l));
    };
  }, [l, f]), U("p", t, { ref: o, state: p, props: [{ id: l }, a], stateAttributesMapping: vt });
});
var Ef = E(M(), 1);
var Wv = Ef.forwardRef(function(t, o) {
  let { render: n, className: r, id: i, name: s, value: a, disabled: l = false, onValueChange: c, defaultValue: u, autoFocus: f = false, style: p, ...m } = t, { state: d, name: h, disabled: C, setTouched: g, setDirty: x, validityData: b, setFocused: y, setFilled: R, validationMode: I, validation: S } = Qe(), { clearErrors: v, elementRef: T, submitCountRef: w } = Xt(), P = C || l, O = h ?? s, N = { ...d, disabled: P }, { labelId: D } = pt(), A = Vo({ id: i }), [_] = yt({ controlled: a, default: u, name: "FieldControl", state: "value" }), B = a !== void 0, k = B ? _ : void 0, F = k == null ? void 0 : String(k), $ = G(() => S.inputRef.current?.value);
  nn(S.inputRef, A, F, $, !P, s), W(() => {
    let L = F ?? S.inputRef.current?.value;
    L !== void 0 && R(L !== "");
  }, [F, S.inputRef, R]), Jt(F, () => {
    F !== void 0 && (v(O), x(F !== (b.initialValue ?? "")), S.change(F));
  });
  let K = Ef.useRef(null), Y = ot();
  return W(() => {
    f && K.current === Ct(Te(K.current)) && y(true);
  }, [f, y]), U("input", t, { ref: [o, K], state: N, props: [{ id: A, disabled: P, name: O, ref: S.inputRef, "aria-labelledby": D, autoFocus: f, ...B ? { value: k } : { defaultValue: u }, onChange(L) {
    let j = L.currentTarget.value, z = Q(H.none, L.nativeEvent);
    c?.(j, z), !B && (x(j !== (b.initialValue ?? "")), R(j !== ""), !L.nativeEvent.defaultPrevented && !z.isCanceled && (v(O), S.change(j)));
  }, onFocus() {
    y(true);
  }, onBlur(L) {
    if (g(true), y(false), I === "onBlur") {
      let j = L.currentTarget.value;
      S.commit(j), B && queueMicrotask(() => {
        let z = S.inputRef.current?.value;
        z !== void 0 && z !== j && z !== (b.initialValue ?? "") && S.commit(z);
      });
    }
  }, onKeyDown(L) {
    if (L.currentTarget.tagName === "INPUT" && L.key === "Enter") {
      g(true);
      let j = L.currentTarget.value, z = L.currentTarget.form;
      if (z && z === T.current && !L.defaultPrevented) {
        let J = L.currentTarget, X = w.current;
        Y.start(0, () => {
          w.current === X && S.commit(J.value);
        });
      } else S.commit(j);
    }
  } }, m, (L) => S.getValidationProps(P, L)], stateAttributesMapping: vt });
});
var cc = E(M(), 1);
var $v = E(Ie(), 1);
var zv = function(t) {
  let { children: o } = t, { validityData: n, invalid: r } = Qe(false), i = cc.useMemo(() => Mi(n, r), [n, r]), s = i.state.valid === false, { transitionStatus: a } = wt(s), l = cc.useMemo(() => ({ ...i, validity: i.state, transitionStatus: a }), [i, a]);
  return (0, $v.jsx)(cc.Fragment, { children: o(l) });
};
var If = E(M(), 1);
var Km = E(Ie(), 1);
var Kv = If.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, disabled: s = false, ...a } = t, { state: l, disabled: c } = Qe(false), u = c || s, f = { ...l, disabled: u }, p = If.useMemo(() => ({ disabled: u }), [u]), m = U("div", t, { ref: o, state: f, props: a, stateAttributesMapping: vt });
  return (0, Km.jsx)(Cf, { children: (0, Km.jsx)(Im.Provider, { value: p, children: m }) });
});
var Yv = E(M(), 1);
var qv = E(Ie(), 1);
var Ym = Yv.forwardRef(function(t, o) {
  return (0, qv.jsx)(vn.Control, { ref: o, ...t });
});
var Zv = E(M(), 1);
var ki = E(M(), 1);
var Ai = "data-composite-item-active";
function Xv(e4) {
  let { loopFocus: t = true, orientation: o = "both", grid: n, onLoop: r, direction: i, highlightedIndex: s, onHighlightedIndexChange: a, rootRef: l, enableHomeAndEndKeys: c = false, stopEventPropagation: u, disabledIndices: f, modifierKeys: p = It } = e4, [m, d] = ki.useState(0), h = n != null, C = ki.useRef(null), g = ht(C, l), x = ki.useRef([]), b = ki.useRef(false), y = ki.useRef(null), R = s ?? m, I = G((P, O = false) => {
    if (y.current = x.current[P] ?? null, (a ?? d)(P), O) {
      let N = x.current[P];
      em(C.current, N, i, o);
    }
  }), S = G((P) => {
    if (P.size === 0) return;
    if (b.current) {
      let A = x.current, _ = A.indexOf(y.current);
      if (_ === -1) {
        let B = A[R];
        !B || bn(A, R, f) ? I(eN(A, f)) : y.current = B;
      } else _ !== R && I(_);
      return;
    }
    b.current = true;
    let O = Array.from(P.keys()), N = O.find((A) => A?.hasAttribute(Ai)) ?? null, D = N ? P.get(N)?.index ?? -1 : -1;
    if (D !== -1) I(D);
    else if (bn(O, R, f)) {
      let A = jt(O, { disabledIndices: f });
      Jo(O, A) || I(A);
    }
    em(C.current, N, i, o);
  });
  W(() => {
    if (f == null || s != null || !b.current) return;
    let P = x.current;
    if (bn(P, R, f)) {
      let O = jt(P, { disabledIndices: f });
      Jo(P, O) || I(O);
    }
  }, [f, s, R, x, I]);
  let v = G((P, O, N) => r ? r(P, O, N, x) : N), T = G((P) => {
    let O = P.key === vs || P.key === Es;
    if (!Rn.has(P.key) || !c && O || tN(P, p) || !C.current) return;
    let D = i === "rtl", A = D ? Cs : ys, _ = D ? ys : Cs, B = o === "vertical" ? Rs : A, k = o === "vertical" ? xs : _, F = We(P.nativeEvent);
    if (F != null && Qd(F) && !Nv(F)) {
      let j = F.selectionStart, z = F.selectionEnd, J = F.value;
      if (j == null || P.shiftKey || j !== z || P.key !== k && j < J.length || P.key !== B && j > 0) return;
    }
    let $ = R, K = xi(x, f), Y = as(x, f);
    n != null && ($ = n({ disabledIndices: f, elementsRef: x, event: P, highlightedIndex: R, loopFocus: t, maxIndex: Y, minIndex: K, onLoop: v, orientation: o, rtl: D }));
    let te = o !== "vertical" && P.key === A || o !== "horizontal" && P.key === Rs, L = o !== "vertical" && P.key === _ || o !== "horizontal" && P.key === xs;
    c && (P.key === vs ? $ = K : P.key === Es && ($ = Y)), $ === R && (te || L) && (t && $ === Y && te ? ($ = K, r && ($ = r(P, R, $, x))) : t && $ === K && L ? ($ = Y, r && ($ = r(P, R, $, x))) : $ = jt(x.current, { startingIndex: $, decrement: L, disabledIndices: f })), $ !== R && !Jo(x.current, $) && (u && P.stopPropagation(), (h || O || te || L) && P.preventDefault(), I($, true), queueMicrotask(() => {
      x.current[$]?.focus();
    }));
  });
  return { props: { ref: g, onFocus(P) {
    let O = C.current, N = We(P.nativeEvent);
    !O || N == null || !Qd(N) || N.setSelectionRange(0, N.value.length);
  }, onKeyDown: T }, highlightedIndex: R, onHighlightedIndexChange: I, elementsRef: x, onMapChange: S, relayKeyboardEvent: T };
}
function eN(e4, t) {
  let o = -1;
  for (let n = 0; n < e4.length; n += 1) {
    let r = e4[n];
    if (!(!r || bn(e4, n, t))) {
      if (r.hasAttribute(Ai)) return n;
      o === -1 && (o = n);
    }
  }
  return Math.max(o, 0);
}
function tN(e4, t) {
  for (let o of uR) if (!t.includes(o) && e4.getModifierState(o)) return true;
  return false;
}
var qm = E(Ie(), 1);
function js(e4) {
  let { render: t, className: o, style: n, refs: r = It, props: i = It, state: s = Me, stateAttributesMapping: a, highlightedIndex: l, onHighlightedIndexChange: c, orientation: u, grid: f, loopFocus: p, onLoop: m, enableHomeAndEndKeys: d, onMapChange: h, stopEventPropagation: C = true, rootRef: g, disabledIndices: x, modifierKeys: b, highlightItemOnHover: y = false, tag: R = "div", ...I } = e4, S = Zt(), { props: v, highlightedIndex: T, onHighlightedIndexChange: w, elementsRef: P, onMapChange: O, relayKeyboardEvent: N } = Xv({ grid: f, loopFocus: p, onLoop: m, orientation: u, highlightedIndex: l, onHighlightedIndexChange: c, rootRef: g, stopEventPropagation: C, enableHomeAndEndKeys: d, direction: S, disabledIndices: x, modifierKeys: b }), D = U(R, e4, { state: s, ref: r, props: [v, ...i, I], stateAttributesMapping: a }), A = Zv.useMemo(() => ({ highlightedIndex: T, onHighlightedIndexChange: w, highlightItemOnHover: y, relayKeyboardEvent: N }), [T, w, y, N]);
  return (0, qm.jsx)(Wp.Provider, { value: A, children: (0, qm.jsx)(Do, { elementsRef: P, onMapChange: (_) => {
    h?.(_), O(_);
  }, children: D }) });
}
var Jv = /* @__PURE__ */ new Map();
function oN(e4, t) {
  let o = JSON.stringify({ locale: Ka(e4), options: t }), n = Jv.get(o);
  if (n) return n;
  let r = new Intl.NumberFormat(e4, t);
  return Jv.set(o, r), r;
}
function ar(e4, t, o) {
  return e4 == null ? "" : oN(t, o).format(e4);
}
function Fi(e4, t, o) {
  return (e4 - t) * 100 / (o - t);
}
var Zr = {};
Tt(Zr, { Arrow: () => hE, Backdrop: () => xE, Close: () => IE, Description: () => vE, Handle: () => pc, Popup: () => mE, Portal: () => lE, Positioner: () => uE, Root: () => iE, Title: () => CE, Trigger: () => sE, Viewport: () => PE, createHandle: () => TE });
var lc = E(M(), 1);
var Sf = E(M(), 1);
var Xm = Sf.createContext(void 0);
function Ft(e4) {
  let t = Sf.useContext(Xm);
  if (t === void 0 && !e4) throw new Error(Re(47));
  return t;
}
var Pf = E(M(), 1);
var Qv = E(Ko(), 1);
var eE = { ...Dr, disabled: (e4) => e4.disabled, instantType: (e4) => e4.instantType, openMethod: (e4) => e4.openMethod, openChangeReason: (e4) => e4.openChangeReason, modal: (e4) => e4.modal, focusManagerModal: (e4) => e4.focusManagerModal, stickIfOpen: (e4) => e4.stickIfOpen, titleElementId: (e4) => e4.titleElementId, descriptionElementId: (e4) => e4.descriptionElementId, openOnHover: (e4) => e4.openOnHover, closeDelay: (e4) => e4.closeDelay, adaptiveOrigin: (e4) => e4.adaptiveOrigin };
var Tf = class extends xo {
  constructor(t, o, n) {
    let r = new Ro();
    super(oE(t, r, o, n), nE(r), eE);
  }
  setOpen = (t, o) => {
    let n = o.reason === H.triggerHover, r = o.reason === H.triggerPress && o.event.detail === 0, i = !t && (o.reason === H.escapeKey || o.reason == null), s = Na(o), a = this.select("activeTriggerId");
    if (!t && o.reason === H.closePress && o.trigger == null && a != null && (o.trigger = this.context.triggerElements.getById(a) ?? this.select("activeTriggerElement") ?? void 0), this.context.onOpenChange?.(t, o), o.isCanceled) return;
    this.state.floatingRootContext.dispatchOpenChange(t, o);
    let l = () => {
      let u = Ii(this.state, t, o.trigger, s());
      u.openChangeReason = o.reason, this.update(u);
    };
    n ? (this.set("stickIfOpen", true), this.context.stickIfOpenTimeout.start(500, () => {
      this.set("stickIfOpen", false);
    }), Qv.flushSync(l)) : l();
    let c;
    r ? c = "click" : i ? c = "dismiss" : o.reason === H.focusOut && (c = "focus"), this.set("instantType", c);
  };
};
function tE() {
  let e4 = new Ro(), t = new Ln(Object.freeze(oE(void 0, e4)), Object.freeze(nE(e4)), eE);
  return Object.assign(t, { setOpen: Oe });
}
function oE(e4, t, o, n = false) {
  let r = { ...Nr(t, o, n), disabled: false, modal: false, focusManagerModal: false, instantType: void 0, openMethod: null, openChangeReason: null, titleElementId: void 0, descriptionElementId: void 0, stickIfOpen: true, openOnHover: false, closeDelay: 0, adaptiveOrigin: void 0, ...e4 };
  return r.open && e4?.mounted === void 0 && (r.mounted = true), r;
}
function nE(e4) {
  return { popupRef: Pf.createRef(), onOpenChange: void 0, onOpenChangeComplete: void 0, triggerFocusTargetRef: Pf.createRef(), beforeContentFocusGuardRef: Pf.createRef(), stickIfOpenTimeout: new oo(), triggerElements: e4 };
}
var qr = E(Ie(), 1);
var rE = tr(function({ props: t }) {
  let { children: o, open: n, defaultOpen: r = false, onOpenChange: i, onOpenChangeComplete: s, modal: a = false, handle: l, triggerId: c, defaultTriggerId: u = null } = t, f = nN(l, { modal: a, open: r, openProp: n, activeTriggerId: u, triggerIdProp: c });
  f.useControlledProp("openProp", n), f.useControlledProp("triggerIdProp", c);
  let p = f.useState("open"), m = f.useState("mounted"), d = f.useState("payload");
  f.useContextCallback("onOpenChange", i), f.useContextCallback("onOpenChangeComplete", s), Ll(f, p), wr(f);
  let { forceUnmount: h } = Or(p, f, () => {
    f.update({ stickIfOpen: true, openChangeReason: null });
  });
  f.useSyncedValues({ modal: a }), lc.useEffect(() => {
    p || f.context.stickIfOpenTimeout.clear();
  }, [f, p]), lc.useImperativeHandle(t.actionsRef, () => ({ unmount: h, close: () => f.setOpen(false, Q(H.imperativeAction)) }), [h, f]);
  let C = p || m;
  return (0, qr.jsxs)(Xm.Provider, { value: f, children: [l && (0, qr.jsx)(Pr, { handle: l, store: f }), C && (0, qr.jsx)(rN, { store: f, modal: a }), typeof o == "function" ? o({ payload: d }) : o] });
});
function iE(e4) {
  return Ft(true) ? (0, qr.jsx)(rE, { props: e4 }) : (0, qr.jsx)(Sa, { children: (0, qr.jsx)(rE, { props: e4 }) });
}
function nN(e4, t) {
  let o = gs((n, r) => new Tf(t, n, r));
  return lc.useEffect(() => o.context.stickIfOpenTimeout.disposeEffect(), [o]), o;
}
function rN({ store: e4, modal: t }) {
  let o = e4.useState("floatingRootContext"), n = xn(o, { outsidePressEvent: { mouse: t === "trap-focus" ? "sloppy" : "intentional", touch: "sloppy" } }), r = n.reference, i = n.floating;
  return Mr(e4, { activeTriggerProps: r, inactiveTriggerProps: r, popupProps: i }), null;
}
var uc = E(M(), 1);
var Gs = E(Ie(), 1);
var sE = Ir(function(t, o) {
  let { render: n, className: r, style: i, disabled: s = false, nativeButton: a = true, handle: l, payload: c, openOnHover: u = false, delay: f = 300, closeDelay: p = 0, id: m, ...d } = t, h = Ft(true), g = Ar(l) ?? h;
  if (!g) throw new Error(Re(74));
  let x = Pe(m), b = g.useState("isTriggerActive", x), y = g.useState("floatingRootContext"), R = g.useState("isOpenedByTrigger", x), I = g.useState("triggerPopupId", x), S = uc.useRef(null), { registerTrigger: v, isMountedByThisTrigger: T } = Tr(x, S, g, { payload: c, disabled: s, openOnHover: u, closeDelay: p }), w = g.useState("openChangeReason"), P = g.useState("stickIfOpen"), O = g.useState("openMethod"), N = g.useState("focusManagerModal"), D = or(y, { enabled: !s && u && (O !== "touch" || w !== H.triggerPress), mouseOnly: true, move: false, handleClose: nr(), restMs: f, delay: { close: p }, triggerElementRef: S, isActiveTrigger: b, isClosing: () => g.select("transitionStatus") === "ending" }), A = Uo(y, { stickIfOpen: P }), _ = Ha(() => g.select("open"), (J) => {
    g.set("openMethod", J);
  }), B = g.useState("triggerProps", T), { getButtonProps: k, buttonRef: F } = Ke({ disabled: s, native: a }), $ = { open(J) {
    return J && w === H.triggerPress ? gi.open(J) : Mn.open(J);
  } }, { preFocusGuardRef: K, handlePreFocusGuardFocus: Y, handleFocusTargetFocus: te } = df(g, S), j = U("button", t, { state: { disabled: s, open: R }, ref: [F, o, v, S], props: [A.reference, D, B, _, { [fs]: "", id: x, "aria-haspopup": "dialog", "aria-expanded": R, "aria-controls": I }, d, k], stateAttributesMapping: $ }), z = (0, Gs.jsx)(uc.Fragment, { children: j }, x);
  return T && !N ? (0, Gs.jsxs)(uc.Fragment, { children: [(0, Gs.jsx)(Xo, { ref: K, onFocus: Y }), z, (0, Gs.jsx)(Xo, { ref: g.context.triggerFocusTargetRef, onFocus: te })] }) : z;
});
var cE = E(M(), 1);
var wf = E(M(), 1);
var Zm = wf.createContext(void 0);
function aE() {
  let e4 = wf.useContext(Zm);
  if (e4 === void 0) throw new Error(Re(45));
  return e4;
}
var Jm = E(Ie(), 1);
var lE = cE.forwardRef(function(t, o) {
  let { keepMounted: n = false, ...r } = t;
  return Ft().useState("mounted") || n ? (0, Jm.jsx)(Zm.Provider, { value: n, children: (0, Jm.jsx)(Qn, { ref: o, ...r }) }) : null;
});
var Mf = E(M(), 1);
var Of = E(M(), 1);
var Qm = Of.createContext(void 0);
function Ws() {
  let e4 = Of.useContext(Qm);
  if (!e4) throw new Error(Re(46));
  return e4;
}
var fc = E(Ie(), 1);
var uE = Mf.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, anchor: s, positionMethod: a, side: l, align: c, sideOffset: u, alignOffset: f, collisionBoundary: p = "clipping-ancestors", collisionPadding: m, arrowPadding: d, sticky: h, disableAnchorTracking: C = false, collisionAvoidance: g = ps, ...x } = t, b = Ft(), y = aE(), R = yi(), I = b.useState("floatingRootContext"), S = b.useState("mounted"), v = b.useState("open"), T = b.useState("openChangeReason"), w = b.useState("activeTriggerElement"), P = b.useState("modal"), O = b.useState("openMethod"), N = b.useState("positionerElement"), D = b.useState("instantType"), A = b.useState("transitionStatus"), _ = b.useState("adaptiveOrigin"), B = Mf.useRef(null), k = Ao(N), F = _r({ anchor: s, floatingRootContext: I, positionMethod: a, mounted: S, side: l, sideOffset: u, align: c, alignOffset: f, arrowPadding: d, collisionBoundary: p, collisionPadding: m, sticky: h, disableAnchorTracking: C, keepMounted: y, nodeId: R, collisionAvoidance: g, adaptiveOrigin: _ }), $ = I.useState("domReferenceElement");
  W(() => {
    let j = $, z = B.current;
    if (j && (B.current = j), z && j && j !== z) {
      b.set("instantType", void 0);
      let J = new AbortController();
      return k(() => {
        b.set("instantType", "trigger-change");
      }, J.signal), () => {
        J.abort();
      };
    }
  }, [$, k, b]);
  let K = P === true && T !== H.triggerHover;
  Ns(v && K, O === "touch", N, w);
  let Y = b.useStateSetter("positionerElement"), te = { open: v, side: F.side, align: F.align, anchorHidden: F.anchorHidden, instant: D }, L = Br(t, te, { styles: F.positionerStyles, transitionStatus: A, props: x, refs: [o, Y], hidden: !S, inert: !v });
  return (0, fc.jsxs)(Qm.Provider, { value: F, children: [S && K && (0, fc.jsx)(Fr, { inert: en(!v), cutout: w }), (0, fc.jsx)(Ia, { id: R, children: L })] });
});
var dE = E(M(), 1);
var Xr = E(M(), 1);
var eg = Xr.createContext(void 0);
function fE() {
  let [e4, t] = Xr.useState(0), o = G(() => (t((r) => r + 1), () => {
    t((r) => Math.max(0, r - 1));
  }));
  return { context: Xr.useMemo(() => ({ register: o }), [o]), hasClosePart: e4 > 0 };
}
function pE() {
  let e4 = Xr.useContext(eg);
  W(() => e4?.register(), [e4]);
}
var tg = E(Ie(), 1);
var mE = dE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, initialFocus: s, finalFocus: a, ...l } = t, c = Ft(), u = Ws(), f = Lo(true) != null, { context: p, hasClosePart: m } = fE(), d = c.useState("open"), h = c.useState("openMethod"), C = c.useState("instantType"), g = c.useState("transitionStatus"), x = c.useState("popupProps"), b = c.useState("titleElementId"), y = c.useState("descriptionElementId"), R = c.useState("modal"), I = c.useState("mounted"), S = c.useState("openChangeReason"), v = c.useState("activeTriggerElement"), T = c.useState("floatingRootContext"), w = T.useState("floatingId"), P = c.useState("disabled"), O = c.useState("openOnHover"), N = c.useState("closeDelay");
  it({ open: d, ref: c.context.popupRef, onComplete() {
    d && c.context.onOpenChangeComplete?.(true);
  } }), Si(T, { enabled: O && !P, closeDelay: N });
  let D = s === void 0 ? Vl(c.context.popupRef) : s, A = R !== false && m;
  c.useSyncedValue("focusManagerModal", A);
  let _ = c.useStateSetter("popupElement"), B = { open: d, side: u.side, align: u.align, instant: C, transitionStatus: g }, k = U("div", t, { state: B, ref: [o, c.context.popupRef, _], props: [x, { id: w, role: "dialog", ...Fn, "aria-labelledby": b, "aria-describedby": y, onKeyDown(F) {
    f && Rn.has(F.key) && F.stopPropagation();
  } }, Un(g), l], stateAttributesMapping: qo });
  return (0, tg.jsx)(er, { context: T, openInteractionType: h, modal: A, disabled: !I || S === H.triggerHover, initialFocus: D, returnFocus: a, restoreFocus: "popup", previousFocusableElement: Ve(v) ? v : void 0, nextFocusableElement: c.context.triggerFocusTargetRef, beforeContentFocusGuardRef: c.context.beforeContentFocusGuardRef, children: (0, tg.jsx)(eg.Provider, { value: p, children: k }) });
});
var gE = E(M(), 1);
var hE = gE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, l = Ft().useState("open"), { arrowRef: c, side: u, align: f, arrowUncentered: p, arrowStyles: m } = Ws();
  return U("div", t, { state: { open: l, side: u, align: f, uncentered: p }, ref: [o, c], props: [{ style: m, "aria-hidden": true }, s], stateAttributesMapping: ao });
});
var bE = E(M(), 1);
var xE = bE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = Ft(), l = a.useState("open"), c = a.useState("mounted"), u = a.useState("transitionStatus"), f = a.useState("openChangeReason");
  return U("div", t, { state: { open: l, transitionStatus: u }, ref: o, props: [{ role: "presentation", hidden: !c, style: { pointerEvents: f === H.triggerHover ? "none" : void 0, userSelect: "none", WebkitUserSelect: "none" } }, s], stateAttributesMapping: qo });
});
var RE = E(M(), 1);
var CE = RE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = Ft(), l = Pe(s.id);
  return a.useSyncedValueWithCleanup("titleElementId", l), U("h2", t, { ref: o, props: [{ id: l }, s] });
});
var yE = E(M(), 1);
var vE = yE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = Ft(), l = Pe(s.id);
  return a.useSyncedValueWithCleanup("descriptionElementId", l), U("p", t, { ref: o, props: [{ id: l }, s] });
});
var EE = E(M(), 1);
var IE = EE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, disabled: s = false, nativeButton: a = true, ...l } = t, { buttonRef: c, getButtonProps: u } = Ke({ disabled: s, focusableWhenDisabled: false, native: a }), f = Ft();
  return pE(), U("button", t, { ref: [o, c], props: [{ onClick(m) {
    f.setOpen(false, Q(H.closePress, m.nativeEvent));
  } }, l, u] });
});
var SE = E(M(), 1);
var PE = SE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, children: s, ...a } = t, l = Ft(), { side: c } = Ws(), u = l.useState("instantType"), { children: f, state: p } = Us({ store: l, side: c, children: s }), m = { activationDirection: p.activationDirection, transitioning: p.transitioning, instant: u };
  return U("div", t, { state: m, ref: o, props: [a, { children: f }], stateAttributesMapping: Hs });
});
var pc = class extends kn {
  constructor() {
    super(tE(), "Popover");
  }
  open(t) {
    this.openByTrigger(t);
  }
  close() {
    this.closePopup();
  }
  get isOpen() {
    return this.attachedStore?.select("open") ?? false;
  }
};
function TE() {
  return new pc();
}
var Nf = E(M(), 1);
var wE = E(Ko(), 1);
var OE = E(Ie(), 1);
var ME = Nf.forwardRef(function(t, o) {
  let { children: n, container: r, className: i, render: s, style: a, ...l } = t, { node: c, subtree: u } = Pl({ container: r, ref: o, componentProps: t, elementProps: l });
  return !u && !c ? null : (0, OE.jsxs)(Nf.Fragment, { children: [u, c && wE.createPortal(n, c)] });
});
var Vi = {};
Tt(Vi, { Indicator: () => _E, Label: () => jE, Root: () => kE, Track: () => VE, Value: () => HE });
var cr = E(M(), 1);
var Df = E(M(), 1);
var og = Df.createContext(void 0);
function Jr() {
  let e4 = Df.useContext(og);
  if (e4 === void 0) throw new Error(Re(51));
  return e4;
}
var NE = "data-complete";
var DE = "data-indeterminate";
var AE = "data-progressing";
var Gn = { status(e4) {
  return e4 === "progressing" ? { [AE]: "" } : e4 === "complete" ? { [NE]: "" } : e4 === "indeterminate" ? { [DE]: "" } : null;
} };
var dc = E(Ie(), 1);
var kE = cr.forwardRef(function(t, o) {
  let { format: n, getAriaValueText: r, locale: i, max: s = 100, min: a = 0, value: l, render: c, className: u, children: f, style: p, ...m } = t, [d, h] = cr.useState(), C = "indeterminate", g = null, x = null, b = "", y = "indeterminate progress";
  if (l != null && Number.isFinite(l)) {
    let T = Fi(l, a, s);
    g = Wt(Number.isNaN(T) ? 0 : T, 0, 100), x = Wt(l, a, s), C = x === s ? "complete" : "progressing", b = n ? ar(x, i, n) : ar(g / 100, i, { style: "percent" }), y = b;
  }
  let R = cr.useMemo(() => ({ status: C }), [C]), I = { "aria-labelledby": d, "aria-valuemax": s, "aria-valuemin": a, "aria-valuenow": x ?? void 0, "aria-valuetext": r ? r(b, l) : y, role: "progressbar", children: (0, dc.jsxs)(cr.Fragment, { children: [f, (0, dc.jsx)("span", { role: "presentation", style: wo, children: "x" })] }) }, S = cr.useMemo(() => ({ formattedValue: b, percentageValue: g, setLabelId: h, state: R, value: l }), [b, g, h, R, l]), v = U("div", t, { state: R, ref: o, props: [I, m], stateAttributesMapping: Gn });
  return (0, dc.jsx)(og.Provider, { value: S, children: v });
});
var FE = E(M(), 1);
var VE = FE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, { state: a } = Jr();
  return U("div", t, { state: a, ref: o, props: s, stateAttributesMapping: Gn });
});
var LE = E(M(), 1);
var _E = LE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, { percentageValue: a, state: l } = Jr(), c = a == null ? {} : { insetInlineStart: 0, height: "inherit", width: `${a}%` };
  return U("div", t, { state: l, ref: o, props: [{ style: c }, s], stateAttributesMapping: Gn });
});
var BE = E(M(), 1);
var HE = BE.forwardRef(function(t, o) {
  let { className: n, render: r, children: i, style: s, ...a } = t, { value: l, formattedValue: c, state: u } = Jr(), f = u.status === "indeterminate";
  return U("span", t, { state: u, ref: o, props: [{ "aria-hidden": true, children: typeof i == "function" ? i(f ? "indeterminate" : c, l) : f ? null : c }, a], stateAttributesMapping: Gn });
});
var UE = E(M(), 1);
var jE = UE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, id: s, ...a } = t, { setLabelId: l, state: c } = Jr(), u = _u(s, l);
  return U("span", t, { state: c, ref: o, props: [{ id: u, role: "presentation" }, a], stateAttributesMapping: Gn });
});
var hc = {};
Tt(hc, { Indicator: () => YE, Root: () => KE });
var lr = E(M(), 1);
var GE = "data-checked";
var WE = "data-unchecked";
var mc = { checked(e4) {
  return e4 ? { [GE]: "" } : { [WE]: "" };
}, ...Ot, ...vt };
var Af = E(M(), 1);
var ng = Af.createContext(void 0);
function $E() {
  return Af.useContext(ng);
}
var kf = E(M(), 1);
var rg = kf.createContext(void 0);
function zE() {
  let e4 = kf.useContext(rg);
  if (e4 === void 0) throw new Error(Re(52));
  return e4;
}
var gc = E(Ie(), 1);
var KE = lr.forwardRef(function(t, o) {
  let { render: n, className: r, disabled: i = false, readOnly: s = false, required: a = false, "aria-labelledby": l, value: c, inputRef: u, nativeButton: f = false, id: p, style: m, ...d } = t, h = $E(), { disabled: C, readOnly: g, required: x, form: b, checkedValue: y, touched: R = false, validation: I, name: S, setCheckedValue: v = Oe, setTouched: T = Oe, registerInputRef: w = Oe } = h ?? {}, { setTouched: P, setFilled: O, state: N, disabled: D } = Qe(), A = Hr(), { labelId: _, getDescriptionProps: B } = pt(), k = D || A.disabled || C || i, F = g || s, $ = x || a, K = b, Y = h ? y === c : c === "", te = lr.useRef(null), L = lr.useRef(null), j = I?.registerInput, z = lr.useCallback((xe) => j?.(xe, { controlRef: te, value: void 0 }), [j]), J = ht(u, L, w, z);
  W(() => {
    L.current?.checked && O(true);
  }, [O]), W(() => {
    if (L.current) {
      if (k && Y) {
        w(null);
        return;
      }
      w(L.current);
    }
  }, [Y, k, w]);
  let X = Pe(), pe = Vo({ id: p }), de = f ? void 0 : pe, ye = As(l, _, L, !f, de), ce = { role: "radio", "aria-checked": Y, "aria-labelledby": ye, [Ai]: Y ? "" : void 0, id: f ? pe : X, onKeyDown(xe) {
    xe.key === "Enter" && xe.preventDefault();
  }, onClick(xe) {
    if (xe.defaultPrevented || k || F) return;
    xe.preventDefault();
    let ae = L.current;
    ae && Yo(ae, xe);
  }, onFocus(xe) {
    xe.defaultPrevented || k || F || !R || (L.current?.click(), T(false));
  } }, { getButtonProps: fe, buttonRef: se } = Ke({ disabled: k, native: f, composite: false }), ge = { type: "radio", ref: J, form: K, id: de, name: S, tabIndex: -1, style: S ? Nn : wo, "aria-hidden": true, ...c !== void 0 ? { value: Ss(c) } : Me, disabled: k, checked: Y, required: $, readOnly: F, onChange(xe) {
    if (xe.nativeEvent.defaultPrevented || k || F || c === void 0) return;
    let ae = Q(H.none, xe.nativeEvent);
    v(c, ae), !ae.isCanceled && P(true);
  }, onClick(xe) {
    xe.stopPropagation();
  }, onFocus() {
    te.current?.focus();
  } }, be = lr.useMemo(() => ({ ...N, required: $, disabled: k, readOnly: F, checked: Y }), [N, k, F, Y, $]), re = be, Z = h !== void 0, ee = [o, te, se], le = [ce, d, fe, B, I ? (xe) => I.getValidationProps(k, xe) : Me], ue = U("span", t, { enabled: !Z, state: be, ref: ee, props: le, stateAttributesMapping: mc });
  return (0, gc.jsxs)(rg.Provider, { value: re, children: [Z ? (0, gc.jsx)(rn, { tag: "span", render: n, className: r, style: m, state: be, refs: ee, props: le, stateAttributesMapping: mc }) : ue, (0, gc.jsx)("input", { ...ge, suppressHydrationWarning: true })] });
});
var Ff = E(M(), 1);
var YE = Ff.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, keepMounted: s = false, ...a } = t, l = zE(), c = l.checked, { mounted: u, transitionStatus: f, setMounted: p } = wt(c), m = { ...l, transitionStatus: f }, d = Ff.useRef(null), h = s || u, C = U("span", t, { ref: [o, d], state: m, props: a, stateAttributesMapping: mc });
  return it({ batch: true, enabled: !c, open: c, ref: d, onComplete() {
    c || p(false);
  } }), h ? C : null;
});
var Wn = E(M(), 1);
var ig = E(Ie(), 1);
var aN = [Jd];
var sg = Wn.forwardRef(function(t, o) {
  let { render: n, className: r, disabled: i, readOnly: s, required: a, onValueChange: l, value: c, defaultValue: u, form: f, name: p, inputRef: m, id: d, style: h, ...C } = t, { setTouched: g, setFocused: x, validationMode: b, name: y, disabled: R, state: I, validation: S, setDirty: v, setFilled: T, validityData: w } = Qe(), { labelId: P } = pt(), { clearErrors: O, elementRef: N } = Xt(), D = Rf(true), A = R || i, _ = y ?? p, B = Pe(d), [k, F] = yt({ controlled: c, default: u, name: "RadioGroup", state: "value" }), [$, K] = Wn.useState(false), Y = G((se, ge) => {
    l?.(se, ge), !ge.isCanceled && F(se);
  }), te = S.getInputControl, L = Wn.useMemo(() => ({ get current() {
    return te();
  } }), [te]), j = Wn.useRef(null), z = Wn.useRef(null);
  function J(se) {
    let ge;
    return m && (typeof m == "function" ? ge = m(se) : m.current = se), j.current = se, ge;
  }
  let X = G((se) => {
    if (!se || se.disabled) return;
    z.current || (z.current = se);
    let ge = j.current, be = se.checked || ge == null || ge.disabled ? J(se) : void 0;
    return () => {
      z.current === se && (z.current = null), j.current === se ? be ? (be(), j.current = null) : J(null) : be?.();
    };
  }), pe = G(() => {
    let se = N.current;
    if (!se) return k ?? null;
    for (let ge of S.registeredInputs.keys()) if (ge.checked && wm(ge, se)) return k ?? null;
    return null;
  });
  nn(L, B, k ?? null, pe, !A, p), Jt(k, () => {
    O(_), v(k !== w.initialValue), T(k != null), S.change(k);
    let se = z.current;
    k == null && se && !se.disabled && J(se);
  });
  let de = P ?? D?.legendId, ye = { ...I, disabled: A ?? false, required: a ?? false, readOnly: s ?? false }, ce = Wn.useMemo(() => ({ checkedValue: k, disabled: A, form: f, validation: S, name: _, readOnly: s, registerInputRef: X, required: a, setCheckedValue: Y, setTouched: K, touched: $ }), [k, A, f, S, _, s, X, a, Y, K, $]), fe = { id: d, role: "radiogroup", "aria-required": a || void 0, "aria-disabled": A || void 0, "aria-readonly": s || void 0, "aria-labelledby": de, onFocus() {
    x(true);
  }, onBlur(se) {
    me(se.currentTarget, se.relatedTarget) || (g(true), x(false), b === "onBlur" && S.commit(k));
  }, onKeyDownCapture(se) {
    se.key.startsWith("Arrow") && (K(true), x(true));
  } };
  return (0, ig.jsx)(ng.Provider, { value: ce, children: (0, ig.jsx)(js, { render: n, className: r, style: h, state: ye, props: [fe, C, (se) => S.getValidationProps(A ?? false, se)], refs: [o], stateAttributesMapping: vt, enableHomeAndEndKeys: false, modifierKeys: aN }) });
});
var Qr = {};
Tt(Qr, { Control: () => eI, Indicator: () => lI, Label: () => ZE, Root: () => qE, Thumb: () => aI, Track: () => oI, Value: () => JE });
var $t = E(M(), 1);
function Vf(e4, t) {
  return e4 - t;
}
function Lf(e4, t, o, n, r, i) {
  let s = Wt(e4, o, n);
  if (!r) return s;
  let a = i.slice();
  return a[t] = Wt(s, i[t - 1] ?? -1 / 0, i[t + 1] ?? 1 / 0), a.sort(Vf);
}
function _f(e4, t, o) {
  if (!Array.isArray(e4)) return true;
  let n = t * o;
  for (let r = 0; r < e4.length - 1; r += 1) if (!(Math.abs(e4[r] - e4[r + 1]) >= n)) return false;
  return true;
}
var $s = () => null;
var _o = { activeThumbIndex: $s, max: $s, min: $s, minStepsBetweenValues: $s, step: $s, values: $s, ...vt };
var Bf = E(M(), 1);
var ag = Bf.createContext(void 0);
function sn() {
  let e4 = Bf.useContext(ag);
  if (e4 === void 0) throw new Error(Re(62));
  return e4;
}
var cg = E(Ie(), 1);
function cN(e4, t) {
  return e4 === t || Array.isArray(e4) && Array.isArray(t) && ja(e4, t);
}
var qE = $t.forwardRef(function(t, o) {
  let { "aria-labelledby": n, className: r, defaultValue: i, disabled: s = false, id: a, format: l, largeStep: c = 10, locale: u, render: f, max: p = 100, min: m = 0, minStepsBetweenValues: d = 0, form: h, name: C, onValueChange: g, onValueCommitted: x, orientation: b = "horizontal", step: y = 1, thumbCollisionBehavior: R = "push", thumbAlignment: I = "center", value: S, style: v, ...T } = t, w = Pe(a), P = uu(w), O = G(g), N = G(x), { clearErrors: D } = Xt(), { state: A, disabled: _, name: B, setTouched: k, setDirty: F, validityData: $, validation: K } = Qe(), { labelId: Y } = pt(), [te, L] = $t.useState(), j = n ?? fu(Y, te), z = _ || s, J = B ?? C, [X, pe] = yt({ controlled: S, default: i ?? m, name: "Slider" }), de = $t.useRef(null), ye = $t.useRef(null), ce = $t.useRef([]), fe = $t.useRef(null), se = $t.useRef(-1), ge = $t.useRef(null), be = $t.useRef(H.none), [re, Z] = $t.useState(-1), [ee, le] = $t.useState(-1), [ue, xe] = $t.useState(false), [ae, oe] = $t.useState(() => /* @__PURE__ */ new Map()), [he, ne] = $t.useState([void 0, void 0]), q = G((Ge) => {
    Z(Ge), Ge !== -1 && le(Ge);
  }), Ee = G((Ge) => {
    Ge && (ye.current = Ge);
  }), we = Array.isArray(X), je = $t.useMemo(() => we ? X.map((Ge) => Wt(Ge, m, p)).sort(Vf) : [Wt(X, m, p)], [p, m, we, X]), et = we ? je : je[0];
  nn(K.inputRef, w, et, void 0, !z, C), Jt(et, () => {
    D(J), K.change(et);
    let Ge = $.initialValue, Ne;
    Array.isArray(et) && Array.isArray(Ge) ? Ne = !ja(et, Ge) : Ne = et !== Ge, F(Ne);
  });
  let ke = G((Ge, Ne) => {
    if (Number.isNaN(Ge) || cN(Ge, X)) return false;
    let mt = Ne.event, tt = mt.constructor, Pt = new tt(mt.type, mt);
    return Object.defineProperty(Pt, "target", { writable: true, value: { value: Ge, name: J } }), Ne.event = Pt, O(Ge, Ne), Ne.isCanceled ? false : (be.current = Ne.reason, pe(Ge), true);
  }), ve = G((Ge, Ne, mt) => {
    let tt = Lf(Ge, Ne, m, p, we, je);
    if (_f(tt, y, d)) {
      let Pt = "key" in mt ? H.keyboard : H.inputChange, _e = ke(tt, Q(Pt, mt.nativeEvent, void 0, { activeThumbIndex: Ne }));
      k(true), _e && N(tt, Ji(Pt, mt.nativeEvent));
    }
  });
  W(() => {
    if (!z) return;
    let Ge = Ct(Te(de.current));
    me(de.current, Ge) && Ge.blur(), re !== -1 && q(-1);
  }, [re, z, q]);
  let Fe = $t.useMemo(() => ({ ...A, activeThumbIndex: re, disabled: z, dragging: ue, orientation: b, max: p, min: m, minStepsBetweenValues: d, step: y, values: je }), [A, re, z, ue, p, m, d, b, y, je]), nt = $t.useMemo(() => ({ active: re, controlRef: ye, disabled: z, dragging: ue, validation: K, format: l, handleInputChange: ve, indicatorPosition: he, inset: I !== "center", labelId: j, rootLabelId: P, largeStep: c, lastUsedThumbIndex: ee, lastChangeReasonRef: be, form: h, locale: u, max: p, min: m, minStepsBetweenValues: d, name: J, onValueCommitted: N, orientation: b, pressedThumbCenterOffsetRef: fe, pressedThumbIndexRef: se, pressedValuesRef: ge, registerFieldControlRef: Ee, renderBeforeHydration: I === "edge", setActive: q, setDragging: xe, setIndicatorPosition: ne, setLabelId: L, setValue: ke, state: Fe, step: y, thumbCollisionBehavior: R, thumbMap: ae, thumbRefs: ce, values: je }), [re, j, P, z, ue, K, l, ve, he, c, ee, h, u, p, m, d, J, N, b, Ee, q, ke, Fe, y, R, I, ae, je]), Vt = U("div", t, { state: Fe, ref: [o, de], props: [{ "aria-labelledby": j, id: w, role: "group" }, T, (Ge) => K.getValidationProps(z, Ge)], stateAttributesMapping: _o });
  return (0, cg.jsx)(ag.Provider, { value: nt, children: (0, cg.jsx)(Do, { elementsRef: ce, onMapChange: oe, children: Vt }) });
});
var XE = E(M(), 1);
var ZE = XE.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = s;
  delete a.id;
  let { state: l, setLabelId: c, controlRef: u, rootLabelId: f } = sn();
  function p(d, h) {
    if (h) {
      let x = Te(d.currentTarget).getElementById(h);
      if (Ve(x)) {
        Bu(x);
        return;
      }
    }
    let C = u.current?.querySelectorAll('input[type="range"]'), g = C?.length === 1 ? C[0] : null;
    Ve(g) && Bu(g);
  }
  let m = ks({ id: f, setLabelId: c, focusControl: p });
  return U("div", t, { ref: o, state: l, props: [m, s], stateAttributesMapping: _o });
});
var Hf = E(M(), 1);
var JE = Hf.forwardRef(function(t, o) {
  let { "aria-live": n = "off", render: r, className: i, children: s, style: a, ...l } = t, { thumbMap: c, state: u, values: f, format: p, locale: m } = sn(), d = Array.from(c.values(), ({ inputId: x }) => x).join(" ").trim() || void 0, h = Hf.useMemo(() => f.map((x) => ar(x, m, p)), [p, m, f]), C = h.join(" \u2013 ");
  return U("output", t, { state: u, ref: o, props: [{ "aria-live": n, children: typeof s == "function" ? s(h, f) : C, htmlFor: d }, l], stateAttributesMapping: _o });
});
var an = E(M(), 1);
function Uf(e4, t) {
  let o = e4.getBoundingClientRect();
  return t ? (o.top + o.bottom) / 2 : (o.left + o.right) / 2;
}
function zs(e4) {
  if (e4 === 0) return 0;
  if (Math.abs(e4) < 1) {
    let o = e4.toExponential().split("e-"), n = o[0].split(".")[1];
    return (n ? n.length : 0) + parseInt(o[1], 10);
  }
  let t = e4.toString().split(".")[1];
  return t ? t.length : 0;
}
function jf(e4, t, o) {
  let n = Math.round((e4 - o) / t) * t + o;
  return Number(n.toFixed(Math.max(zs(t), zs(o))));
}
function lg(e4, t, o, n, r, i, s, a) {
  let l = e4.slice(), c = i * s, u = l.length - 1, f = a ?? e4, p = n + t * c, m = r - (u - t) * c;
  l[t] = Wt(o, p, m);
  for (let d = t + 1; d <= u; d += 1) {
    let h = l[d - 1] + c, C = r - (u - d) * c, g = f[d], x = Math.max(l[d], h);
    g < x && (x = Math.max(g, h)), l[d] = Wt(x, h, C);
  }
  for (let d = t - 1; d >= 0; d -= 1) {
    let h = l[d + 1] - c, C = n + d * c, g = f[d], x = Math.min(l[d], h);
    g > x && (x = Math.min(g, h)), l[d] = Wt(x, C, h);
  }
  for (let d = 0; d <= u; d += 1) l[d] = Number(l[d].toFixed(12));
  return l;
}
function QE(e4, t, o, n, r, i, s, a, l, c) {
  let u = o ?? t, f = n ?? t;
  if (!(u.length > 1)) return { value: i, thumbIndex: 0, didSwap: false };
  let m = l * c;
  if (e4 === "push") return { value: lg(u, r, i, s, a, l, c), thumbIndex: r, didSwap: false };
  let d = u.slice(), h = d[r - 1], C = d[r + 1], g = h != null ? h + m : s, x = C != null ? C - m : a, b = Number(Wt(i, g, x).toFixed(12));
  switch (d[r] = b, e4) {
    case "swap": {
      let y = u[r], R = 1e-7, I = i > y, S = i < y, v = I && C != null && i >= C - R, T = S && h != null && i <= h + R;
      if (!v && !T) return { value: d, thumbIndex: r, didSwap: false };
      let w = v ? r + 1 : r - 1, P = d.map(($, K) => {
        if (K === r) return b;
        let Y = f[K];
        return Y ?? u[K];
      }), O = i;
      v ? O = Math.max(i, d[w]) : O = Math.min(i, d[w]);
      let N = lg(d, w, O, s, a, l, c, P), D = v ? w - 1 : w + 1, A = N[D - 1], _ = N[D + 1], B = A != null ? A + m : s;
      B = Math.max(B, s + D * m);
      let k = _ != null ? _ - m : a;
      k = Math.min(k, a - (N.length - 1 - D) * m);
      let F = Wt(b, B, k);
      return N[D] = Number(F.toFixed(12)), { value: N, thumbIndex: w, didSwap: true };
    }
    case "none":
    default:
      return { value: d, thumbIndex: r, didSwap: false };
  }
}
var lN = 2;
function uN(e4, t) {
  if (!e4) return { start: 0, end: 0 };
  function o(i) {
    let s = i != null ? parseFloat(i) : 0;
    return Number.isNaN(s) ? 0 : s;
  }
  let n = t ? "Top" : "InlineStart", r = t ? "Bottom" : "InlineEnd";
  return { start: o(e4[`border${n}Width`]) + o(e4[`padding${n}`]), end: o(e4[`border${r}Width`]) + o(e4[`padding${r}`]) };
}
function fN(e4, t) {
  if (t.current != null && e4.changedTouches) {
    let o = e4;
    for (let n = 0; n < o.changedTouches.length; n += 1) {
      let r = o.changedTouches[n];
      if (r.identifier === t.current) return { x: r.clientX, y: r.clientY };
    }
    return null;
  }
  return { x: e4.clientX, y: e4.clientY };
}
var eI = an.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, { disabled: a, dragging: l, inset: c, lastChangeReasonRef: u, max: f, min: p, minStepsBetweenValues: m, onValueCommitted: d, orientation: h, pressedThumbCenterOffsetRef: C, pressedThumbIndexRef: g, pressedValuesRef: x, registerFieldControlRef: b, renderBeforeHydration: y, setActive: R, setDragging: I, setValue: S, state: v, step: T, thumbCollisionBehavior: w, thumbRefs: P, values: O } = sn(), N = Zt(), D = O.length > 1, A = h === "vertical", _ = an.useRef(null), B = an.useRef(null), k = G((Z) => {
    Z && B.current == null && (B.current = Be(Z).getComputedStyle(Z));
  }), F = an.useRef(null), $ = an.useRef(0), K = an.useRef(0), Y = an.useRef(null), te = ct(O);
  function L(Z) {
    return Z?.querySelector('input[type="range"]');
  }
  function j(Z) {
    g.current = Z, P.current[Z] || (C.current = null);
  }
  function z() {
    g.current = -1, C.current = null;
  }
  function J(Z) {
    return De(Z) ? P.current.some((ee) => !De(ee) || !me(ee, Z) ? false : L(ee)?.disabled === true) : false;
  }
  function X(Z) {
    let ee = _.current, le = g.current;
    if (!ee || le < 0 || le >= O.length) return le >= O.length && (Y.current = null), null;
    let { width: ue, height: xe, bottom: ae, left: oe, right: he } = ee.getBoundingClientRect(), ne = uN(B.current, A), q = K.current, Ee = (A ? xe : ue) - ne.start - ne.end - q * 2, we = C.current ?? 0, je = Z.x - we, et = Z.y - we, ke = A ? ae - et - ne.end : (N === "rtl" ? he - je : je - oe) - ne.start, ve = Wt((ke - q) / Ee, 0, 1), Fe = (f - p) * ve + p;
    return Fe = jf(Fe, T, p), Fe = Wt(Fe, p, f), D ? QE(w, O, te.current, x.current, le, Fe, p, f, T, m) : { value: Fe, thumbIndex: le, didSwap: false };
  }
  function pe(Z) {
    x.current = D ? O.slice() : null, Y.current = null, te.current = O;
    let ee = g.current, le = ee;
    if (ee > -1 && ee < O.length) {
      if (O[ee] === f) {
        let ue = ee;
        for (; ue > 0 && O[ue - 1] === f; ) ue -= 1;
        le = ue;
      }
    } else {
      let ue = A ? "y" : "x", xe;
      le = -1;
      for (let ae = 0; ae < P.current.length; ae += 1) {
        let oe = P.current[ae];
        if (De(oe) && !L(oe)?.disabled) {
          let he = Uf(oe, A), ne = Math.abs(Z[ue] - he);
          (xe === void 0 || ne <= xe) && (le = ae, xe = ne);
        }
      }
    }
    if (le > -1 && le !== ee && j(le), c) {
      let ue = P.current[le];
      if (De(ue)) {
        let xe = ue.getBoundingClientRect(), ae = A ? "height" : "width";
        K.current = xe[ae] / 2;
      }
    }
  }
  function de(Z) {
    let ee = L(P.current?.[Z]);
    ee && ee.focus({ preventScroll: true, focusVisible: false });
  }
  function ye(Z, ee, le) {
    let ue = S(Z.value, Q(ee, le, void 0, { activeThumbIndex: Z.thumbIndex }));
    return ue && (Y.current = Z.value, te.current = Array.isArray(Z.value) ? Z.value : [Z.value], Z.didSwap && (j(Z.thumbIndex), de(Z.thumbIndex))), ue;
  }
  let ce = G((Z) => {
    let ee = fN(Z, F);
    if (ee == null) return;
    if ($.current += 1, Z.type === "pointermove" && Z.buttons === 0) {
      fe(Z);
      return;
    }
    let le = X(ee);
    le != null && _f(le.value, T, m) && (!l && $.current > lN && I(true), ye(le, H.drag, Z));
  }), fe = G((Z) => {
    R(-1), I(false), C.current = null;
    let ee = Y.current;
    if (Array.isArray(ee) && ee.length !== O.length && (Y.current = null), Y.current != null) {
      let le = u.current;
      d(Y.current, Ji(le, Z));
    }
    "pointerType" in Z && _.current?.hasPointerCapture(Z.pointerId) && _.current?.releasePointerCapture(Z.pointerId), g.current = -1, F.current = null, ge();
  }), se = G((Z) => {
    if (a) return;
    if (J(We(Z))) {
      z();
      return;
    }
    let ee = Z.changedTouches[0];
    if (ee == null) return;
    F.current = ee.identifier;
    let le = { x: ee.clientX, y: ee.clientY };
    pe(le);
    let ue = X(le);
    if (ue == null) return;
    de(ue.thumbIndex), ye(ue, H.trackPress, Z), $.current = 0;
    let xe = Te(_.current);
    xe.addEventListener("touchmove", ce, { passive: true }), xe.addEventListener("touchend", fe, { passive: true });
  }), ge = G(() => {
    let Z = Te(_.current);
    Z.removeEventListener("pointermove", ce), Z.removeEventListener("pointerup", fe), Z.removeEventListener("touchmove", ce), Z.removeEventListener("touchend", fe), x.current = null, Y.current = null;
  }), be = Io();
  return an.useEffect(() => {
    let Z = _.current;
    if (!Z) return () => ge();
    let ee = Le(Z, "touchstart", se, { passive: true });
    return () => {
      ee(), be.cancel(), ge();
    };
  }, [ge, se, _, be]), an.useEffect(() => {
    a && ge();
  }, [a, ge]), U("div", t, { state: v, ref: [o, b, _, k], props: [{ "data-base-ui-slider-control": y ? "" : void 0, onPointerDown(Z) {
    let ee = _.current, le = We(Z.nativeEvent);
    if (!ee || a || Z.defaultPrevented || !De(le) || Z.button !== 0) return;
    if (J(le)) {
      z();
      return;
    }
    let ue = { x: Z.clientX, y: Z.clientY };
    pe(ue);
    let xe = X(ue);
    if (xe == null) return;
    me(P.current[xe.thumbIndex], Ct(Te(ee))) ? Z.preventDefault() : be.request(() => {
      de(xe.thumbIndex);
    }), I(true), C.current != null || ye(xe, H.trackPress, Z.nativeEvent), Z.nativeEvent.pointerId && ee.setPointerCapture(Z.nativeEvent.pointerId), $.current = 0;
    let he = Te(ee);
    he.addEventListener("pointermove", ce, { passive: true }), he.addEventListener("pointerup", fe, { once: true });
  } }, s], stateAttributesMapping: _o });
});
var tI = E(M(), 1);
var oI = tI.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, { state: a } = sn();
  return U("div", t, { state: a, ref: o, props: [{ style: { position: "relative" } }, s], stateAttributesMapping: _o });
});
var cn = E(M(), 1);
var nI = E(Oa(), 1);
function pN() {
  return Oe;
}
function dN() {
  return false;
}
function mN() {
  return true;
}
function Ks() {
  return (0, nI.useSyncExternalStore)(pN, dN, mN);
}
var pte = E(M(), 1);
var rI = E(Ie(), 1);
function Gf(e4) {
  let { script: t } = e4, { nonce: o } = kv();
  return Ks() ? (0, rI.jsx)("script", { nonce: o, dangerouslySetInnerHTML: { __html: t }, suppressHydrationWarning: true }) : null;
}
var iI = "data-index";
var bc = E(Ie(), 1);
var sI;
var bN = /* @__PURE__ */ new Set([...Rn, Xd, Zd]);
function xN(e4, t, o, n) {
  if (!(t < 0)) return e4.length === 2 ? `${ar(e4[t], n, o)} ${t === 0 ? "start" : "end"} range` : o ? ar(e4[t], n, o) : void 0;
}
function RN(e4, t, o, n, r) {
  let i = e4 + t * o, s = Number(i.toFixed(Math.max(zs(e4), zs(t), zs(n))));
  return Wt(s, n, r);
}
var aI = cn.forwardRef(function(t, o) {
  let { render: n, children: r, className: i, "aria-describedby": s, "aria-label": a, "aria-labelledby": l, "aria-valuetext": c, disabled: u = false, getAriaLabel: f, getAriaValueText: p, id: m, index: d, inputRef: h, onBlur: C, onFocus: g, onKeyDown: x, tabIndex: b, style: y, ...R } = t, I = Pe(m), { active: S, lastUsedThumbIndex: v, controlRef: T, disabled: w, validation: P, format: O, handleInputChange: N, inset: D, labelId: A, largeStep: _, locale: B, max: k, min: F, minStepsBetweenValues: $, form: K, name: Y, orientation: te, pressedThumbCenterOffsetRef: L, pressedThumbIndexRef: j, renderBeforeHydration: z, setActive: J, setIndicatorPosition: X, state: pe, step: de, thumbRefs: ye, values: ce } = sn(), fe = Zt(), se = u || w, ge = ce.length > 1, be = te === "vertical", re = fe === "rtl", { setTouched: Z, setFocused: ee, validationMode: le } = Qe(), ue = cn.useRef(null), xe = cn.useRef(null), ae = cn.useRef(false), oe = G((He) => {
    ae.current || g?.(He);
  }), he = G((He) => {
    ae.current || C?.(He);
  }), ne = Pe(), q = Vo(), Ee = ge ? ne : q, we = cn.useMemo(() => ({ inputId: Ee }), [Ee]), { ref: je, index: et } = kt({ metadata: we }), ke = ge ? d ?? et : 0, ve = ke === ce.length - 1, Fe = ce[ke], nt = Fi(Fe, F, k), [Vt, Ge] = cn.useState(), Ne = Ks(), mt = v >= 0 && v < ce.length ? v : -1, tt = G(() => {
    let He = T.current, $e = ue.current;
    if (!He || !$e) return;
    let Et = $e.getBoundingClientRect(), at = He.getBoundingClientRect(), ze = be ? "height" : "width", un = at[ze] - Et[ze], ni = (Et[ze] / 2 + un * nt / 100) / at[ze] * 100, _t = Number.isFinite(ni) ? ni : void 0;
    Ge(_t), ke === 0 ? X((ta) => [_t, ta[1]]) : ve && X((ta) => [ta[0], _t]);
  });
  W(() => {
    D && queueMicrotask(tt);
  }, [tt, D]), W(() => {
    D && tt();
  }, [tt, D, nt]), W(() => {
    if (!D) return;
    let He = T.current, $e = ue.current;
    if (!He || !$e) return;
    let Et = Be(He).ResizeObserver;
    if (typeof Et != "function") return;
    let at = new Et(tt);
    return at.observe(He), at.observe($e), () => {
      at.disconnect();
    };
  }, [T, tt, D]);
  let Pt = be ? "bottom" : "insetInlineStart", _e = be ? "left" : "top", gt;
  ge ? S === ke ? gt = 2 : mt === ke && (gt = 1) : S === ke && (gt = 1);
  let ut;
  !D && !Number.isFinite(nt) ? ut = wo : ut = { position: "absolute", [Pt]: D ? "var(--position)" : `${nt}%`, [_e]: "50%", translate: `${(be || !re ? -1 : 1) * 50}% ${(be ? 1 : -1) * 50}%`, zIndex: gt, ...D && { "--position": `${Vt ?? 0}%`, visibility: z && Ne || Vt === void 0 ? "hidden" : void 0 } };
  let Kt;
  be && (Kt = re ? "vertical-rl" : "vertical-lr");
  let Mt = typeof f == "function" ? f(ke) : a, At = Rt({ "aria-label": Mt, "aria-labelledby": l ?? (Mt == null ? A : void 0), "aria-describedby": s, "aria-orientation": te, "aria-valuenow": Fe, "aria-valuetext": typeof p == "function" ? p(ar(Fe, B, O), Fe, ke) : c ?? xN(ce, ke, O, B), disabled: se, form: K, id: Ee, max: k, min: F, name: Y, onChange(He) {
    N(He.currentTarget.valueAsNumber, ke, He);
  }, onFocus(He) {
    let $e = ae.current;
    ae.current = false, J(ke), ee(true), $e && He.stopPropagation();
  }, onBlur(He) {
    if (ae.current) {
      He.stopPropagation();
      return;
    }
    J(-1), !ye.current.some(($e) => me($e, He.relatedTarget)) && (Z(true), ee(false), le === "onBlur" && P.commit(Lf(Fe, ke, F, k, ge, ce)));
  }, onKeyDown(He) {
    if (He.defaultPrevented || !bN.has(He.key)) return;
    Rn.has(He.key) && He.stopPropagation();
    let $e = null, Et = 0, at = He.shiftKey ? _ : de, ze = jf(Fe, de, F);
    switch (He.key) {
      case xs:
        Et = 1;
        break;
      case ys:
        Et = re ? -1 : 1;
        break;
      case Rs:
        Et = -1;
        break;
      case Cs:
        Et = re ? 1 : -1;
        break;
      case Xd:
        at = _, Et = 1;
        break;
      case Zd:
        at = _, Et = -1;
        break;
      case Es:
        $e = ge && Number.isFinite(ce[ke + 1]) ? ce[ke + 1] - de * $ : k;
        break;
      case vs:
        $e = ge && Number.isFinite(ce[ke - 1]) ? ce[ke - 1] + de * $ : F;
        break;
      default:
        break;
    }
    if (Et !== 0 && ($e = RN(ze, at, Et, F, k)), $e !== null) {
      let un = He.currentTarget;
      ml(un) || (ae.current = true, un.blur(), un.focus({ preventScroll: true, focusVisible: true })), N($e, ke, He), He.preventDefault();
    }
  }, step: de, style: { ...wo, width: "100%", height: "100%", writingMode: Kt }, tabIndex: b, type: "range", value: Fe ?? "" }, (He) => P.getValidationProps(se, He), { onFocus: oe, onBlur: he, onKeyDown: x }), Lt = ht(xe, P.inputRef, h);
  return U("div", t, { state: pe, ref: [o, je, ue], props: [{ [iI]: ke, children: (0, bc.jsxs)(cn.Fragment, { children: [r, (0, bc.jsx)("input", { ref: Lt, ...At, suppressHydrationWarning: true }), D && ve && z && (sI || (sI = (0, bc.jsx)(Gf, { script: "" })))] }), id: I, onPointerDown(He) {
    if (se) return;
    j.current = ke;
    let $e = Uf(He.currentTarget, be);
    L.current = (be ? He.clientY : He.clientX) - $e;
  }, style: ut, suppressHydrationWarning: z || void 0 }, R], stateAttributesMapping: _o });
});
var cI = E(M(), 1);
function CN(e4, t, o, n, r, i) {
  let s = { visibility: i || o && (n === void 0 || t && r === void 0) ? "hidden" : void 0, position: e4 ? "absolute" : "relative", [e4 ? "width" : "height"]: "inherit" }, a = `${n ?? 0}%`, l = `${(r ?? 0) - (n ?? 0)}%`;
  return o && (s["--start-position"] = a, a = "var(--start-position)", t && (s["--relative-size"] = l, l = "var(--relative-size)")), s[e4 ? "bottom" : "insetInlineStart"] = t ? a : 0, s[e4 ? "height" : "width"] = t ? l : a, s;
}
var lI = cI.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, { indicatorPosition: a, inset: l, max: c, min: u, orientation: f, renderBeforeHydration: p, state: m, values: d } = sn(), h = Ks(), C = f === "vertical", g = d.length > 1, x = CN(C, g, l, l ? a[0] : Fi(d[0], u, c), l ? a[1] : Fi(d[d.length - 1], u, c), l && p && h);
  return U("div", t, { state: m, ref: o, props: [{ "data-base-ui-slider-indicator": p ? "" : void 0, style: x, suppressHydrationWarning: p || void 0 }, s], stateAttributesMapping: _o });
});
var Rc = {};
Tt(Rc, { Root: () => dI, Thumb: () => gI });
var Li = E(M(), 1);
var Wf = E(M(), 1);
var ug = Wf.createContext(void 0);
function uI() {
  let e4 = Wf.useContext(ug);
  if (e4 === void 0) throw new Error(Re(63));
  return e4;
}
var fI = "data-checked";
var pI = "data-unchecked";
var $f = { ...vt, checked(e4) {
  return e4 ? { [fI]: "" } : { [pI]: "" };
} };
var xc = E(Ie(), 1);
var dI = Li.forwardRef(function(t, o) {
  let { checked: n, className: r, defaultChecked: i, "aria-labelledby": s, form: a, id: l, inputRef: c, name: u, nativeButton: f = false, onCheckedChange: p, readOnly: m = false, required: d = false, disabled: h = false, render: C, uncheckedValue: g, value: x, style: b, ...y } = t, { clearErrors: R } = Xt(), { state: I, setTouched: S, setDirty: v, validityData: T, setFilled: w, setFocused: P, validationMode: O, disabled: N, name: D, validation: A } = Qe(), { labelId: _ } = pt(), B = N || h, k = D ?? u, F = Li.useRef(null), $ = ht(F, c, A.inputRef), K = Li.useRef(null), Y = Pe(), te = Vo({ id: l }), L = f ? void 0 : te, [j, z] = yt({ controlled: n, default: !!i, name: "Switch", state: "checked" });
  nn(K, Y, j, void 0, !B, u), W(() => {
    w(j);
  }, [j, w]), Jt(j, () => {
    R(k), v(j !== T.initialValue), A.change(j);
  });
  let { getButtonProps: J, buttonRef: X } = Ke({ disabled: B, native: f }), pe = As(s, _, F, !f, L), de = { id: f ? te : Y, role: "switch", "aria-checked": j, "aria-readonly": m || void 0, "aria-required": d || void 0, "aria-labelledby": pe, onFocus() {
    B || P(true);
  }, onBlur() {
    let se = F.current;
    !se || B || (S(true), P(false), O === "onBlur" && A.commit(se.checked));
  }, onClick(se) {
    if (m || B) return;
    se.preventDefault();
    let ge = F.current;
    ge && Yo(ge, se);
  } }, ye = { ...A.getValidationProps(B), checked: j, disabled: B, form: a, id: L, name: k, required: d, style: k ? Nn : wo, tabIndex: -1, type: "checkbox", "aria-hidden": true, ref: $, onChange(se) {
    if (se.nativeEvent.defaultPrevented) return;
    if (m) {
      se.preventDefault();
      return;
    }
    let ge = se.currentTarget.checked, be = Q(H.none, se.nativeEvent);
    p?.(ge, be), !be.isCanceled && z(ge);
  }, onClick(se) {
    se.stopPropagation();
  }, onFocus() {
    K.current?.focus();
  }, ...x !== void 0 ? { value: x } : Me }, ce = Li.useMemo(() => ({ ...I, checked: j, disabled: B, readOnly: m, required: d }), [I, j, B, m, d]), fe = U("span", t, { state: ce, ref: [o, K, X], props: [de, y, J, (se) => A.getValidationProps(B, se)], stateAttributesMapping: $f });
  return (0, xc.jsxs)(ug.Provider, { value: ce, children: [fe, !j && k && g !== void 0 && (0, xc.jsx)("input", { type: "hidden", form: a, name: k, value: g, disabled: B }), (0, xc.jsx)("input", { ...ye, suppressHydrationWarning: true })] });
});
var mI = E(M(), 1);
var gI = mI.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = uI();
  return U("span", t, { state: a, ref: o, stateAttributesMapping: $f, props: s });
});
var qs = {};
Tt(qs, { Indicator: () => MI, List: () => AI, Panel: () => DI, Root: () => xI, Tab: () => RI });
var zt = E(M(), 1);
var zf = E(M(), 1);
var fg = zf.createContext(void 0);
function ei() {
  let e4 = zf.useContext(fg);
  if (e4 === void 0) throw new Error(Re(64));
  return e4;
}
var hI = "data-activation-direction";
var $n = { tabActivationDirection: (e4) => ({ [hI]: e4 }) };
var pg = E(Ie(), 1);
var xI = zt.forwardRef(function(t, o) {
  let { className: n, defaultValue: r = 0, onValueChange: i, orientation: s = "horizontal", render: a, value: l, style: c, ...u } = t, f = t.defaultValue !== void 0, p = zt.useRef([]), [m, d] = zt.useState(() => /* @__PURE__ */ new Map()), [h, C] = yt({ controlled: l, default: r, name: "Tabs", state: "value" }), g = l !== void 0, [x, b] = zt.useState(() => /* @__PURE__ */ new Map()), y = zt.useRef(void 0), R = zt.useCallback((X) => dg(x, X), [x]), [I, S] = zt.useState(() => ({ previousValue: h, tabActivationDirection: "none" })), { previousValue: v, tabActivationDirection: T } = I, w = T, P = false;
  v !== h && (w = bI(v, h, s, x), P = v != null && h != null && R(h) == null);
  let O = P ? v : h, N = v !== O || T !== w;
  W(() => {
    N && S({ previousValue: O, tabActivationDirection: w });
  }, [O, N, w]);
  let D = G((X, pe) => {
    let de = bI(h, X, s, x);
    pe.activationDirection = de, i?.(X, pe), !pe.isCanceled && C(X);
  }), A = G((X, pe) => {
    i?.(X, Q(pe, void 0, void 0, { activationDirection: "none" }));
  }), _ = G((X, pe) => (d((de) => {
    let ye = new Map(de);
    return ye.set(X, pe), ye;
  }), () => {
    d((de) => {
      if (de.get(X) !== pe) return de;
      let ye = new Map(de);
      return ye.delete(X), ye;
    });
  })), B = zt.useCallback((X) => m.get(X), [m]), k = zt.useCallback((X) => {
    for (let pe of x.values()) if (X === pe.value) return pe.id;
  }, [x]), F = zt.useMemo(() => ({ getTabElementBySelectedValue: R, getTabIdByPanelValue: k, getTabPanelIdByValue: B, onValueChange: D, orientation: s, registerMountedTabPanel: _, setTabMap: b, tabActivationDirection: w, value: h }), [R, k, B, D, s, _, b, w, h]), $ = zt.useMemo(() => {
    for (let X of x.values()) if (X.value === h) return X;
  }, [x, h]), K = zt.useMemo(() => {
    for (let X of x.values()) if (!X.disabled) return X.value;
  }, [x]), Y = zt.useRef(!f), te = zt.useRef(r), L = zt.useRef(f), j = zt.useRef(false);
  W(() => {
    if (g) return;
    function X(ce, fe) {
      C(ce), S({ previousValue: ce, tabActivationDirection: "none" }), A(ce, fe), Y.current = false;
    }
    if (x.size === 0) {
      j.current && h !== null && !y.current?.isConnected && X(null, H.missing);
      return;
    }
    j.current = true, y.current = x.keys().next().value;
    let pe = $?.disabled, de = $ == null && h !== null;
    if (!pe && h === te.current && (L.current = false), L.current && pe && h === te.current) return;
    let ye = Y.current;
    if (pe || de) {
      let ce = K ?? null;
      if (h === ce) {
        Y.current = false;
        return;
      }
      let fe = H.missing;
      ye ? fe = H.initial : pe && (fe = H.disabled), X(ce, fe);
      return;
    }
    ye && $ != null && (A(h, H.initial), Y.current = false);
  }, [K, g, A, $, C, x, h]);
  let J = U("div", t, { state: { orientation: s, tabActivationDirection: w }, ref: o, props: u, stateAttributesMapping: $n });
  return (0, pg.jsx)(fg.Provider, { value: F, children: (0, pg.jsx)(Do, { elementsRef: p, children: J }) });
});
function dg(e4, t) {
  for (let [o, n] of e4.entries()) if (t === n.value) return o;
  return null;
}
function bI(e4, t, o, n) {
  if (e4 == null || t == null) return "none";
  let [r, i, s] = o === "horizontal" ? ["left", "left", "right"] : ["top", "up", "down"], a = dg(n, e4), l = dg(n, t);
  if (a == null || l == null) return a !== l && (typeof e4 == "number" || typeof e4 == "string") && typeof e4 == typeof t ? t > e4 ? s : i : "none";
  let c = a.getBoundingClientRect()[r], u = l.getBoundingClientRect()[r];
  return u < c ? i : u > c ? s : "none";
}
var ur = E(M(), 1);
var Kf = E(M(), 1);
var mg = Kf.createContext(void 0);
function Yf() {
  let e4 = Kf.useContext(mg);
  if (e4 === void 0) throw new Error(Re(65));
  return e4;
}
var RI = ur.forwardRef(function(t, o) {
  let { className: n, disabled: r = false, render: i, value: s, id: a, nativeButton: l = true, style: c, ...u } = t, { value: f, getTabPanelIdByValue: p, onValueChange: m, orientation: d, tabActivationDirection: h } = ei(), { activateOnFocus: C, registerTabResizeObserverElement: g, tabsListElement: x } = Yf(), { highlightedIndex: b, onHighlightedIndexChange: y } = hr(), R = Pe(a), I = ur.useMemo(() => ({ disabled: r, id: R, value: s }), [r, R, s]), { compositeProps: S, compositeRef: v, index: T } = pf({ metadata: I }), w = s === f, P = ur.useRef(false), O = ur.useRef(null), N = G((j) => {
    O.current?.(), O.current = j ? g(j) : null;
  });
  W(() => {
    if (P.current) {
      P.current = false;
      return;
    }
    if (!(w && T > -1 && b !== T)) return;
    let j = x;
    if (j != null) {
      let z = Ct(Te(j));
      if (z && me(j, z)) return;
    }
    r || y(T);
  }, [w, T, b, y, r, x]);
  let { getButtonProps: D, buttonRef: A } = Ke({ disabled: r, native: l, focusableWhenDisabled: true }), _ = p(s), B = ur.useRef(false), k = ur.useRef(false);
  function F(j) {
    m(s, Q(H.none, j.nativeEvent, void 0, { activationDirection: "none" }));
  }
  function $(j) {
    w || r || F(j);
  }
  function K(j) {
    w || r || C && (!B.current || k.current) && F(j);
  }
  function Y(j) {
    if (w || r) return;
    B.current = true, k.current = j.button === 0;
    let z = Te(j.currentTarget);
    function J() {
      B.current = false, k.current = false, z.removeEventListener("pointerup", J), z.removeEventListener("pointercancel", J);
    }
    z.addEventListener("pointerup", J), z.addEventListener("pointercancel", J);
  }
  return U("button", t, { state: { disabled: r, active: w, orientation: d, tabActivationDirection: h }, ref: [o, A, v, N], props: [S, { role: "tab", "aria-controls": _, "aria-selected": w, id: R, onClick: $, onFocus: K, onPointerDown: Y, [Ai]: w ? "" : void 0, onKeyDownCapture() {
    P.current = true;
  } }, u, D], stateAttributesMapping: $n });
});
var Ys = E(M(), 1);
var CI = "--active-tab-left";
var yI = "--active-tab-right";
var vI = "--active-tab-top";
var EI = "--active-tab-bottom";
var II = "--active-tab-width";
var SI = "--active-tab-height";
var qf = E(Ie(), 1);
var PI;
var IN = { ...$n, activeTabPosition: () => null, activeTabSize: () => null };
var TI = 2;
var MI = Ys.forwardRef(function(t, o) {
  let { className: n, render: r, renderBeforeHydration: i = false, style: s, ...a } = t, { getTabElementBySelectedValue: l, orientation: c, tabActivationDirection: u, value: f } = ei(), { tabsListElement: p, registerIndicatorUpdateListener: m } = Yf(), d = _x();
  Ys.useEffect(() => m(d), [m, d]);
  let h = 0, C = 0, g = 0, x = 0, b = 0, y = 0, R = false;
  if (f != null && p != null) {
    let O = l(f);
    if (O != null) {
      R = true;
      let { width: N, height: D } = Ls(O), { width: A, height: _ } = Ls(p), B = O.getBoundingClientRect(), k = p.getBoundingClientRect(), F = A > 0 ? k.width / A : 1, $ = _ > 0 ? k.height / _ : 1, K = SN(O, p);
      h = K.left, g = K.top;
      let Y = (B.left - k.left) / F + p.scrollLeft - p.clientLeft, te = (B.top - k.top) / $ + p.scrollTop - p.clientTop, L = PN(O);
      Math.abs(Y - L.x - h) <= TI && Math.abs(te - L.y - g) <= TI && (h = Y, g = te), b = N, y = D, C = p.scrollWidth - h - b, x = p.scrollHeight - g - y;
    }
  }
  let I = R ? { left: h, right: C, top: g, bottom: x } : null, S = R ? { width: b, height: y } : null, v = R ? { [CI]: `${h}px`, [yI]: `${C}px`, [vI]: `${g}px`, [EI]: `${x}px`, [II]: `${b}px`, [SI]: `${y}px` } : void 0, T = R && b > 0 && y > 0, P = U("span", t, { state: { orientation: c, activeTabPosition: I, activeTabSize: S, tabActivationDirection: u }, ref: o, props: [{ role: "presentation", style: v, hidden: !T }, a, { suppressHydrationWarning: true }], stateAttributesMapping: IN });
  return f == null ? null : (0, qf.jsxs)(Ys.Fragment, { children: [P, i && (PI || (PI = (0, qf.jsx)(Gf, { script: "" })))] });
});
function SN(e4, t) {
  let o = wI(e4), n = wI(t), r = o.left - n.left - t.clientLeft, i = o.top - n.top - t.clientTop, s = po(e4);
  for (; Ve(s) && s !== t && !So(s); ) r -= s.scrollLeft, i -= s.scrollTop, s = po(s);
  return { left: r, top: i };
}
function wI(e4) {
  let t = 0, o = 0, n = e4;
  for (; n != null; ) {
    t += n.offsetLeft, o += n.offsetTop;
    let r = n.offsetParent;
    r != null && (t += r.clientLeft, o += r.clientTop), n = r;
  }
  return { left: t, top: o };
}
function PN(e4) {
  let t = Be(e4).getComputedStyle(e4), { x: o, y: n } = Vv(e4, t), r = o, i = n, { translate: s } = t;
  if (s && s !== "none") {
    let a = s.split(" ");
    r += OI(a[0], e4.offsetWidth), i += OI(a[1], e4.offsetHeight);
  }
  return { x: r, y: i };
}
function OI(e4, t) {
  if (!e4) return 0;
  let o = parseFloat(e4);
  return Number.isFinite(o) ? e4.endsWith("%") ? o / 100 * t : o : 0;
}
var Xf = E(M(), 1);
var NI = "data-index";
var Ene = Tn.startingStyle;
var Ine = Tn.endingStyle;
var wN = { ...$n, ...Ot };
var DI = Xf.forwardRef(function(t, o) {
  let { className: n, value: r, render: i, keepMounted: s = false, style: a, ...l } = t, { value: c, getTabIdByPanelValue: u, orientation: f, tabActivationDirection: p, registerMountedTabPanel: m } = ei(), d = Pe(), { ref: h, index: C } = kt(), g = r === c, { mounted: x, transitionStatus: b, setMounted: y } = wt(g), R = !x, I = u(r), S = { hidden: R, orientation: f, tabActivationDirection: p, transitionStatus: b }, v = Xf.useRef(null), T = U("div", t, { state: S, ref: [o, h, v], props: [{ "aria-labelledby": I, hidden: R, id: d, role: "tabpanel", tabIndex: g ? 0 : -1, inert: en(!g), [NI]: C }, l], stateAttributesMapping: wN });
  return it({ open: g, ref: v, onComplete() {
    g || y(false);
  } }), W(() => {
    if (!(d == null || R && !s)) return m(r, d);
  }, [R, s, r, d, m]), s || x ? T : null;
});
var En = E(M(), 1);
var gg = E(Ie(), 1);
var AI = En.forwardRef(function(t, o) {
  let { activateOnFocus: n = false, className: r, loopFocus: i = true, render: s, style: a, ...l } = t, { orientation: c, setTabMap: u, tabActivationDirection: f } = ei(), [p, m] = En.useState(0), [d, h] = En.useState(null), C = En.useRef(/* @__PURE__ */ new Set()), g = En.useRef(/* @__PURE__ */ new Set()), x = En.useRef(null);
  W(() => {
    if (typeof ResizeObserver > "u") return;
    let v = new ResizeObserver(() => {
      C.current.forEach((T) => {
        T();
      });
    });
    return x.current = v, d && v.observe(d), g.current.forEach((T) => {
      v.observe(T);
    }), () => {
      v.disconnect(), x.current = null;
    };
  }, [d]);
  let b = G((v) => (C.current.add(v), () => {
    C.current.delete(v);
  })), y = G((v) => (g.current.add(v), x.current?.observe(v), () => {
    g.current.delete(v), x.current?.unobserve(v);
  })), R = { orientation: c, tabActivationDirection: f }, I = { "aria-orientation": c === "vertical" ? "vertical" : void 0, role: "tablist" }, S = En.useMemo(() => ({ activateOnFocus: n, registerIndicatorUpdateListener: b, registerTabResizeObserverElement: y, tabsListElement: d }), [n, b, y, d]);
  return (0, gg.jsx)(mg.Provider, { value: S, children: (0, gg.jsx)(js, { render: s, className: r, style: a, state: R, refs: [o, h], props: [I, l], stateAttributesMapping: $n, highlightedIndex: p, enableHomeAndEndKeys: true, loopFocus: i, orientation: c, onHighlightedIndexChange: m, onMapChange: u, disabledIndices: It }) });
});
var Cc = E(M(), 1);
var Zf = E(M(), 1);
var ON = Zf.createContext(void 0);
function kI() {
  return Zf.useContext(ON);
}
var FI = E(Ie(), 1);
var Jf = Cc.forwardRef(function(t, o) {
  let { className: n, defaultPressed: r = false, disabled: i = false, form: s, onPressedChange: a, pressed: l, render: c, type: u, value: f, nativeButton: p = true, style: m, ...d } = t, h = Pe(f || void 0), C = kI(), g = C?.value ?? [], x = (i || C?.disabled) ?? false, [b, y] = yt({ controlled: C ? h !== void 0 && g.indexOf(h) > -1 : l, default: r, name: "Toggle", state: "pressed" }), { getButtonProps: R, buttonRef: I } = Ke({ disabled: x, native: p }), S = { disabled: x, pressed: b }, v = [I, o], T = [{ "aria-pressed": b, onClick(O) {
    let N = !b, D = Q(H.none, O.nativeEvent);
    a?.(N, D), !D.isCanceled && (h && C?.setGroupValue?.(h, N, D), !D.isCanceled && y(N));
  } }, d, R], w = U("button", t, { enabled: !C, state: S, ref: v, props: T }), P = Cc.useMemo(() => ({ disabled: x, focusableWhenDisabled: false }), [x]);
  return C ? (0, FI.jsx)(rn, { tag: "button", render: c, className: n, style: m, metadata: P, state: S, refs: v, props: T }) : w;
});
var Qf = E(M(), 1);
var hg = Qf.createContext(void 0);
function ep() {
  return Qf.useContext(hg);
}
var Bi = {};
Tt(Bi, { Button: () => GI, Group: () => UI, Input: () => YI, Link: () => zI, Root: () => BI, Separator: () => _I });
var VI = E(M(), 1);
var LI = E(Ie(), 1);
var _I = VI.forwardRef(function(t, o) {
  let r = Lo().orientation === "vertical" ? "horizontal" : "vertical";
  return (0, LI.jsx)(ic, { orientation: r, ...t, ref: o });
});
var _i = E(M(), 1);
var bg = E(Ie(), 1);
var BI = _i.forwardRef(function(t, o) {
  let { disabled: n = false, loopFocus: r, orientation: i = "horizontal", className: s, render: a, style: l, ...c } = t, [u, f] = _i.useState(() => /* @__PURE__ */ new Map()), p = _i.useMemo(() => {
    let C = [];
    for (let g of u.values()) g.disabled && !g.focusableWhenDisabled && C.push(g.index);
    return C;
  }, [u]), m = _i.useMemo(() => ({ disabled: n, orientation: i }), [n, i]), d = { disabled: n, orientation: i }, h = { "aria-orientation": i, role: "toolbar" };
  return (0, bg.jsx)(Fm.Provider, { value: m, children: (0, bg.jsx)(js, { render: a, className: s, style: l, state: d, refs: [o], props: [h, c], disabledIndices: p, loopFocus: r, onMapChange: f, orientation: i }) });
});
var tp = E(M(), 1);
var HI = E(Ie(), 1);
var UI = tp.forwardRef(function(t, o) {
  let { className: n, disabled: r = false, render: i, style: s, ...a } = t, { orientation: l, disabled: c } = Lo(), u = c || r, f = tp.useMemo(() => ({ disabled: u }), [u]), m = U("div", t, { state: { disabled: u, orientation: l }, ref: o, props: [{ role: "group" }, a] });
  return (0, HI.jsx)(hg.Provider, { value: f, children: m });
});
var op = E(M(), 1);
var jI = E(Ie(), 1);
var GI = op.forwardRef(function(t, o) {
  let { className: n, disabled: r = false, focusableWhenDisabled: i = true, render: s, nativeButton: a, style: l, ...c } = t, { disabled: u, orientation: f } = Lo(), p = ep(), m = u || (p?.disabled ?? false) || r, d = op.useMemo(() => ({ disabled: m, focusableWhenDisabled: i }), [m, i]), { getButtonProps: h, buttonRef: C } = Ke({ disabled: m, focusableWhenDisabled: i, native: a });
  return (0, jI.jsx)(rn, { tag: "button", render: s, className: n, style: l, metadata: d, state: { disabled: m, orientation: f, focusable: i }, refs: [o, C], props: [c, s ? { disabled: m } : Me, h] });
});
var WI = E(M(), 1);
var $I = E(Ie(), 1);
var MN = { disabled: false, focusableWhenDisabled: true };
var zI = WI.forwardRef(function(t, o) {
  let { className: n, render: r, style: i, ...s } = t, { orientation: a } = Lo();
  return (0, $I.jsx)(rn, { tag: "a", render: r, className: n, style: i, metadata: MN, state: { orientation: a }, refs: [o], props: [s] });
});
var np = E(M(), 1);
var KI = E(Ie(), 1);
var YI = np.forwardRef(function(t, o) {
  let { className: n, focusableWhenDisabled: r = true, render: i, disabled: s = false, style: a, ...l } = t, { disabled: c, orientation: u } = Lo(), f = ep(), p = c || (f?.disabled ?? false) || s, m = np.useMemo(() => ({ disabled: p, focusableWhenDisabled: r }), [p, r]), { props: d } = al({ composite: true, disabled: p, focusableWhenDisabled: r, isNativeButton: false }), h = { disabled: p, orientation: u, focusable: r }, C = (x) => {
    p && x.preventDefault();
  };
  return (0, KI.jsx)(rn, { tag: "input", render: i, className: n, style: a, metadata: m, state: h, refs: [o], props: [{ onClick: C, onPointerDown: C }, l, d] });
});
var fr = {};
Tt(fr, { Arrow: () => dS, Handle: () => vc, Popup: () => fS, Portal: () => aS, Positioner: () => lS, Provider: () => gS, Root: () => eS, Trigger: () => rS, Viewport: () => bS, createHandle: () => xS });
var Xs = E(M(), 1);
var rp = E(M(), 1);
var xg = rp.createContext(void 0);
function ln(e4) {
  let t = rp.useContext(xg);
  if (t === void 0 && !e4) throw new Error(Re(72));
  return t;
}
var qI = E(M(), 1);
var XI = { ...Dr, disabled: (e4) => e4.disabled, instantType: (e4) => e4.instantType, isInstantPhase: (e4) => e4.isInstantPhase, trackCursorAxis: (e4) => e4.trackCursorAxis, disableHoverablePopup: (e4) => e4.disableHoverablePopup, lastOpenChangeReason: (e4) => e4.openChangeReason, closeOnClick: (e4) => e4.closeOnClick, closeDelay: (e4) => e4.closeDelay, adaptiveOrigin: (e4) => e4.adaptiveOrigin };
var ip = class extends xo {
  constructor(t, o, n) {
    let r = new Ro();
    super(JI(t, r, o, n), QI(r), XI);
  }
  setOpen = (t, o) => {
    jx(this, t, o, { extraState: { openChangeReason: o.reason } });
  };
  cancelPendingOpen(t) {
    this.state.floatingRootContext.dispatchOpenChange(false, Q(H.triggerPress, t));
  }
};
function ZI() {
  let e4 = new Ro(), t = new Ln(Object.freeze(JI(void 0, e4)), Object.freeze(QI(e4)), XI);
  return Object.assign(t, { setOpen: Oe, cancelPendingOpen: Oe });
}
function JI(e4, t, o, n = false) {
  return { ...Nr(t, o, n), disabled: false, instantType: void 0, isInstantPhase: false, trackCursorAxis: "none", disableHoverablePopup: false, openChangeReason: null, closeOnClick: true, closeDelay: 0, adaptiveOrigin: void 0, ...e4 };
}
function QI(e4) {
  return { popupRef: qI.createRef(), onOpenChange: void 0, onOpenChangeComplete: void 0, triggerElements: e4 };
}
var yc = E(Ie(), 1);
var eS = tr(function(t) {
  let { disabled: o = false, defaultOpen: n = false, open: r, disableHoverablePopup: i = false, trackCursorAxis: s = "none", actionsRef: a, onOpenChange: l, onOpenChangeComplete: c, handle: u, triggerId: f, defaultTriggerId: p = null, children: m } = t, d = gs((P, O) => new ip({ open: n, openProp: r, activeTriggerId: p, triggerIdProp: f }, P, O));
  d.useControlledProp("openProp", r), d.useControlledProp("triggerIdProp", f), d.useContextCallback("onOpenChange", l), d.useContextCallback("onOpenChangeComplete", c);
  let h = d.useState("open"), C = !o && h, g = d.useState("activeTriggerId"), x = d.useState("mounted"), b = d.useState("payload");
  d.useSyncedValues({ trackCursorAxis: s, disableHoverablePopup: i, disabled: o }), wr(d, { closeOnActiveTriggerUnmount: true });
  let { forceUnmount: y, transitionStatus: R } = Or(C, d), I = d.useState("isInstantPhase"), S = d.useState("instantType"), v = d.useState("lastOpenChangeReason"), T = Xs.useRef(null);
  W(() => {
    h && o && d.setOpen(false, Q(H.disabled));
  }, [h, o, d]), W(() => {
    R === "ending" && v === H.none || R !== "ending" && I ? (S !== "delay" && (T.current = S), d.set("instantType", "delay")) : T.current !== null && (d.set("instantType", T.current), T.current = null);
  }, [R, I, v, S, d]), W(() => {
    C && g == null && d.set("payload", void 0);
  }, [d, g, C]), Xs.useImperativeHandle(a, () => ({ unmount: y, close: () => d.setOpen(false, Q(H.imperativeAction)) }), [y, d]);
  let w = C || x || !o && s !== "none";
  return (0, yc.jsxs)(xg.Provider, { value: d, children: [u && (0, yc.jsx)(Pr, { handle: u, store: d }), w && (0, yc.jsx)(NN, { store: d, disabled: o, trackCursorAxis: s }), typeof m == "function" ? m({ payload: b }) : m] });
});
function NN({ store: e4, disabled: t, trackCursorAxis: o }) {
  let n = e4.useState("floatingRootContext"), r = xn(n, { enabled: !t, referencePress: () => e4.select("closeOnClick") }), i = Id(n, { enabled: !t && o !== "none", axis: o === "none" ? void 0 : o }), s = Xs.useMemo(() => Rt(i.reference, r.reference), [i.reference, r.reference]);
  return Mr(e4, { activeTriggerProps: s, inactiveTriggerProps: s, popupProps: r.floating ?? Me }), null;
}
var ap = E(M(), 1);
var sp = E(M(), 1);
var Rg = sp.createContext(void 0);
function tS() {
  return sp.useContext(Rg);
}
var nS = "data-base-ui-tooltip-trigger";
function oS(e4) {
  if ("composedPath" in e4) {
    let o = e4.composedPath();
    for (let n = 0; n < o.length; n += 1) {
      let r = o[n];
      if (De(r)) return r;
    }
  }
  let t = e4.target;
  return De(t) ? t : null;
}
function DN(e4) {
  let t = e4;
  for (; t; ) {
    let o = t.closest(`[${nS}]`);
    if (o) return o;
    let n = t.getRootNode();
    t = "host" in n && De(n.host) ? n.host : null;
  }
  return null;
}
var rS = Ir(function(t, o) {
  let { render: n, className: r, style: i, handle: s, payload: a, disabled: l, delay: c, closeOnClick: u = true, closeDelay: f, id: p, ...m } = t, d = ln(true), C = Ar(s) ?? d;
  if (!C) throw new Error(Re(82));
  let g = Pe(p), x = C.useState("isTriggerActive", g), b = C.useState("isOpenedByTrigger", g), y = C.useState("floatingRootContext"), R = ap.useRef(null), I = f ?? 0, { registerTrigger: S, isMountedByThisTrigger: v } = Tr(g, R, C, { payload: a, closeOnClick: u, closeDelay: I }), T = tS(), { activeIdRef: w, delayRef: P, isInstantPhase: O, hasProvider: N } = ud(y, { open: b }), D = bs(y);
  C.useSyncedValue("isInstantPhase", O);
  let A = C.useState("disabled"), _ = l ?? A, B = ct(_), k = C.useState("trackCursorAxis"), F = C.useState("disableHoverablePopup"), $ = ap.useRef(false), K = ot(), Y = ap.useRef(void 0);
  function te() {
    return N && w.current != null ? 0 : c ?? T ?? 600;
  }
  function L(fe) {
    let se = R.current;
    if (!se || !fe) return false;
    let ge = DN(fe);
    return ge !== null && ge !== se && me(se, ge);
  }
  function j(fe) {
    let se = L(fe);
    return $.current = se, se && (D.openChangeTimeout.clear(), D.restTimeout.clear(), D.restTimeoutPending = false, K.clear()), se;
  }
  let z = or(y, { enabled: !_, mouseOnly: true, move: false, handleClose: !F && k !== "both" ? nr() : null, restMs: te, delay() {
    return f == null && N ? { close: gn(P.current, "close") } : { close: I };
  }, triggerElementRef: R, isActiveTrigger: x, isClosing: () => C.select("transitionStatus") === "ending", shouldOpen() {
    return !$.current;
  } }), J = Aa(y, { enabled: !_ }).reference, X = (fe) => {
    let se = $.current, ge = oS(fe), be = j(ge), re = R.current, Z = re && ge && me(re, ge);
    if (be && C.select("open") && C.select("lastOpenChangeReason") === H.triggerHover) {
      C.setOpen(false, Q(H.triggerHover, fe));
      return;
    }
    if (se && !be && Z && !B.current && !C.select("open") && re && Ho(Y.current)) {
      let ee = () => {
        !$.current && !B.current && !C.select("open") && C.setOpen(true, Q(H.triggerHover, fe, re));
      }, le = te();
      le === 0 ? (K.clear(), ee()) : K.start(le, ee);
    }
  }, pe = C.useState("triggerProps", v);
  return U("button", t, { state: { open: b }, ref: [o, S, R], props: [z, J, v || k !== "none" ? pe : void 0, { onMouseOver(fe) {
    X(fe.nativeEvent);
  }, onFocus(fe) {
    L(oS(fe.nativeEvent)) && fe.preventBaseUIHandler();
  }, onMouseLeave() {
    $.current = false, K.clear(), Y.current = void 0;
  }, onPointerEnter(fe) {
    Y.current = fe.pointerType;
  }, onPointerDown(fe) {
    Y.current = fe.pointerType, C.set("closeOnClick", u), u && !C.select("open") && C.cancelPendingOpen(fe.nativeEvent);
  }, onClick(fe) {
    u && !C.select("open") && C.cancelPendingOpen(fe.nativeEvent);
  }, id: g, [ha]: _ ? "" : void 0, [nS]: _ ? void 0 : "" }, m], stateAttributesMapping: Mn });
});
var sS = E(M(), 1);
var cp = E(M(), 1);
var Cg = cp.createContext(void 0);
function iS() {
  let e4 = cp.useContext(Cg);
  if (e4 === void 0) throw new Error(Re(70));
  return e4;
}
var yg = E(Ie(), 1);
var aS = sS.forwardRef(function(t, o) {
  let { keepMounted: n = false, ...r } = t;
  return ln().useState("mounted") || n ? (0, yg.jsx)(Cg.Provider, { value: n, children: (0, yg.jsx)(ME, { ref: o, ...r }) }) : null;
});
var up = E(M(), 1);
var lp = E(M(), 1);
var vg = lp.createContext(void 0);
function Zs() {
  let e4 = lp.useContext(vg);
  if (e4 === void 0) throw new Error(Re(71));
  return e4;
}
var cS = E(Ie(), 1);
var lS = up.forwardRef(function(t, o) {
  let { render: n, className: r, anchor: i, positionMethod: s = "absolute", side: a = "top", align: l = "center", sideOffset: c = 0, alignOffset: u = 0, collisionBoundary: f = "clipping-ancestors", collisionPadding: p = 5, arrowPadding: m = 5, sticky: d = false, disableAnchorTracking: h = false, collisionAvoidance: C = ps, style: g, ...x } = t, b = ln(), y = iS(), R = b.useState("open"), I = b.useState("mounted"), S = b.useState("trackCursorAxis"), v = b.useState("disableHoverablePopup"), T = b.useState("floatingRootContext"), w = b.useState("instantType"), P = b.useState("transitionStatus"), O = b.useState("adaptiveOrigin"), N = _r({ anchor: i, positionMethod: s, floatingRootContext: T, mounted: I, side: a, sideOffset: c, align: l, alignOffset: u, collisionBoundary: f, collisionPadding: p, sticky: d, arrowPadding: m, disableAnchorTracking: h, keepMounted: y, collisionAvoidance: C, adaptiveOrigin: O }), D = up.useMemo(() => ({ open: R, side: N.side, align: N.align, anchorHidden: N.anchorHidden, instant: S !== "none" ? "tracking-cursor" : w }), [R, N.side, N.align, N.anchorHidden, S, w]), A = Br(t, D, { styles: N.positionerStyles, transitionStatus: P, props: x, refs: [o, b.useStateSetter("positionerElement")], hidden: !I, inert: !R || S === "both" || v });
  return (0, cS.jsx)(vg.Provider, { value: N, children: A });
});
var uS = E(M(), 1);
var fS = uS.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = ln(), { side: l, align: c } = Zs(), u = a.useState("open"), f = a.useState("instantType"), p = a.useState("transitionStatus"), m = a.useState("popupProps"), d = a.useState("floatingRootContext"), h = a.useState("disabled"), C = a.useState("closeDelay");
  it({ open: u, ref: a.context.popupRef, onComplete() {
    u && a.context.onOpenChangeComplete?.(true);
  } }), Si(d, { enabled: !h, closeDelay: C });
  let g = a.useStateSetter("popupElement");
  return U("div", t, { state: { open: u, side: l, align: c, instant: f, transitionStatus: p }, ref: [o, a.context.popupRef, g], props: [Fn, m, Un(p), s], stateAttributesMapping: qo });
});
var pS = E(M(), 1);
var dS = pS.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, ...s } = t, a = ln(), { arrowRef: l, side: c, align: u, arrowUncentered: f, arrowStyles: p } = Zs(), m = a.useState("open"), d = a.useState("instantType");
  return U("div", t, { state: { open: m, side: c, align: u, uncentered: f, instant: d }, ref: [o, l], props: [{ style: p, "aria-hidden": true }, s], stateAttributesMapping: ao });
});
var mS = E(M(), 1);
var Eg = E(Ie(), 1);
var gS = function(t) {
  let { delay: o, closeDelay: n, timeout: r = 400 } = t, i = mS.useMemo(() => ({ open: o, close: n }), [o, n]);
  return (0, Eg.jsx)(Rg.Provider, { value: o, children: (0, Eg.jsx)(ld, { delay: i, timeoutMs: r, children: t.children }) });
};
var hS = E(M(), 1);
var bS = hS.forwardRef(function(t, o) {
  let { render: n, className: r, style: i, children: s, ...a } = t, l = ln(), c = Zs(), u = l.useState("instantType"), { children: f, state: p } = Us({ store: l, side: c.side, children: s }), m = { activationDirection: p.activationDirection, transitioning: p.transitioning, instant: u };
  return U("div", t, { state: m, ref: o, props: [a, { children: f }], stateAttributesMapping: Hs });
});
var vc = class extends kn {
  constructor() {
    super(ZI(), "Tooltip");
  }
  open(t) {
    this.openByTrigger(t);
  }
  close() {
    this.closePopup();
  }
  get isOpen() {
    return this.attachedStore?.select("open") ?? false;
  }
};
function xS() {
  return new vc();
}
var Ig = E(M(), 1);
function Ec(e4) {
  "@babel/helpers - typeof";
  return Ec = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ec(e4);
}
var AN = ["aria-hidden", "aria-label", "aria-labelledby", "tabIndex", "className", "fill", "size", "verticalAlign", "id", "title", "style"];
function Sg() {
  return Sg = Object.assign ? Object.assign.bind() : function(e4) {
    for (var t = 1; t < arguments.length; t++) {
      var o = arguments[t];
      for (var n in o) ({}).hasOwnProperty.call(o, n) && (e4[n] = o[n]);
    }
    return e4;
  }, Sg.apply(null, arguments);
}
function RS(e4, t) {
  var o = Object.keys(e4);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e4);
    t && (n = n.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e4, r).enumerable;
    })), o.push.apply(o, n);
  }
  return o;
}
function kN(e4) {
  for (var t = 1; t < arguments.length; t++) {
    var o = arguments[t] != null ? arguments[t] : {};
    t % 2 ? RS(Object(o), true).forEach(function(n) {
      FN(e4, n, o[n]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e4, Object.getOwnPropertyDescriptors(o)) : RS(Object(o)).forEach(function(n) {
      Object.defineProperty(e4, n, Object.getOwnPropertyDescriptor(o, n));
    });
  }
  return e4;
}
function FN(e4, t, o) {
  return (t = VN(t)) in e4 ? Object.defineProperty(e4, t, { value: o, enumerable: true, configurable: true, writable: true }) : e4[t] = o, e4;
}
function VN(e4) {
  var t = LN(e4, "string");
  return Ec(t) == "symbol" ? t : t + "";
}
function LN(e4, t) {
  if (Ec(e4) != "object" || !e4) return e4;
  var o = e4[Symbol.toPrimitive];
  if (o !== void 0) {
    var n = o.call(e4, t || "default");
    if (Ec(n) != "object") return n;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e4);
}
function _N(e4, t) {
  if (e4 == null) return {};
  var o, n, r = BN(e4, t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(e4);
    for (n = 0; n < i.length; n++) o = i[n], t.indexOf(o) === -1 && {}.propertyIsEnumerable.call(e4, o) && (r[o] = e4[o]);
  }
  return r;
}
function BN(e4, t) {
  if (e4 == null) return {};
  var o = {};
  for (var n in e4) if ({}.hasOwnProperty.call(e4, n)) {
    if (t.indexOf(n) !== -1) continue;
    o[n] = e4[n];
  }
  return o;
}
var HN = { small: 16, medium: 32, large: 64 };
function dt(e4, t, o, n, r) {
  var i = e4["aria-hidden"], s = e4["aria-label"], a = e4["aria-labelledby"], l = e4.tabIndex, c = e4.className, u = c === void 0 ? "" : c, f = e4.fill, p = f === void 0 ? "currentColor" : f, m = e4.size, d = m === void 0 ? 16 : m, h = e4.verticalAlign, C = h === void 0 ? "text-bottom" : h, g = e4.id, x = e4.title, b = e4.style, y = _N(e4, AN), R = HN[d] || d, I = UN(r, R), S = n[I].width, v = R * (S / I), T = n[I].path, w = s || a, P = i === void 0 ? w ? void 0 : "true" : i, O = w && P !== "true" ? "img" : void 0;
  return Ig.default.createElement("svg", Sg({ ref: t, "data-component": "Octicon" }, y, { "aria-hidden": P, tabIndex: l, focusable: l >= 0 ? "true" : "false", "aria-label": s, "aria-labelledby": a, className: "".concat(o, " ").concat(u).trim(), role: O, viewBox: "0 0 ".concat(S, " ").concat(I), width: v, height: R, fill: p, id: g, display: "inline-block", overflow: "visible", style: kN({ verticalAlign: C }, b) }), x ? Ig.default.createElement("title", null, x) : null, T);
}
function UN(e4, t) {
  return e4.map(function(o) {
    return parseInt(o, 10);
  }).reduce(function(o, n) {
    return n <= t ? n : o;
  }, e4[0]);
}
var Hi = E(M(), 1);
var jN = ["16", "24"];
var GN = { 16: { width: 16, path: Hi.default.createElement("path", { d: "M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" }) }, 24: { width: 24, path: Hi.default.createElement(Hi.default.Fragment, null, Hi.default.createElement("path", { d: "M13 17.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-.25-8.25a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Z" }), Hi.default.createElement("path", { d: "M9.836 3.244c.963-1.665 3.365-1.665 4.328 0l8.967 15.504c.963 1.667-.24 3.752-2.165 3.752H3.034c-1.926 0-3.128-2.085-2.165-3.752Zm3.03.751a1.002 1.002 0 0 0-1.732 0L2.168 19.499A1.002 1.002 0 0 0 3.034 21h17.932a1.002 1.002 0 0 0 .866-1.5L12.866 3.994Z" })) } };
var fp = Hi.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-alert", GN, jN);
});
fp.displayName = "AlertIcon";
var pp = E(M(), 1);
var WN = ["16", "24"];
var $N = { 16: { width: 16, path: pp.default.createElement("path", { d: "M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z" }) }, 24: { width: 24, path: pp.default.createElement("path", { d: "M10.78 19.03a.75.75 0 0 1-1.06 0l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L5.81 11.5h14.44a.75.75 0 0 1 0 1.5H5.81l4.97 4.97a.75.75 0 0 1 0 1.06Z" }) } };
var Ic = pp.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-arrow-left", $N, WN);
});
Ic.displayName = "ArrowLeftIcon";
var dp = E(M(), 1);
var zN = ["16", "24"];
var KN = { 16: { width: 16, path: dp.default.createElement("path", { d: "M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06Z" }) }, 24: { width: 24, path: dp.default.createElement("path", { d: "M13.22 19.03a.75.75 0 0 1 0-1.06L18.19 13H3.75a.75.75 0 0 1 0-1.5h14.44l-4.97-4.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z" }) } };
var Sc = dp.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-arrow-right", KN, zN);
});
Sc.displayName = "ArrowRightIcon";
var mp = E(M(), 1);
var YN = ["16", "24"];
var qN = { 16: { width: 16, path: mp.default.createElement("path", { d: "M3.47 7.78a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018L9 4.81v7.44a.75.75 0 0 1-1.5 0V4.81L4.53 7.78a.75.75 0 0 1-1.06 0Z" }) }, 24: { width: 24, path: mp.default.createElement("path", { d: "M18.655 10.405a.75.75 0 0 1-1.06 0l-4.97-4.97v14.44a.75.75 0 0 1-1.5 0V5.435l-4.97 4.97a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l6.25-6.25a.75.75 0 0 1 1.06 0l6.25 6.25a.75.75 0 0 1 0 1.06Z" }) } };
var gp = mp.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-arrow-up", qN, YN);
});
gp.displayName = "ArrowUpIcon";
var hp = E(M(), 1);
var XN = ["16", "24"];
var ZN = { 16: { width: 16, path: hp.default.createElement("path", { d: "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z" }) }, 24: { width: 24, path: hp.default.createElement("path", { d: "M21.03 5.72a.75.75 0 0 1 0 1.06l-11.5 11.5a.747.747 0 0 1-1.072-.012l-5.5-5.75a.75.75 0 1 1 1.084-1.036l4.97 5.195L19.97 5.72a.75.75 0 0 1 1.06 0Z" }) } };
var Ui = hp.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-check", ZN, XN);
});
Ui.displayName = "CheckIcon";
var ji = E(M(), 1);
var JN = ["16", "24"];
var QN = { 16: { width: 16, path: ji.default.createElement("path", { d: "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm1.5 0a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm10.28-1.72-4.5 4.5a.75.75 0 0 1-1.06 0l-2-2a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l1.47 1.47 3.97-3.97a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z" }) }, 24: { width: 24, path: ji.default.createElement(ji.default.Fragment, null, ji.default.createElement("path", { d: "M17.28 9.28a.75.75 0 0 0-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l6.5-6.5Z" }), ji.default.createElement("path", { d: "M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z" })) } };
var bp = ji.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-check-circle", QN, JN);
});
bp.displayName = "CheckCircleIcon";
var Pc = E(M(), 1);
var e0 = ["12", "16", "24"];
var t0 = { 12: { width: 12, path: Pc.default.createElement("path", { d: "M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 2.7-2.7c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z" }) }, 16: { width: 16, path: Pc.default.createElement("path", { d: "M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z" }) }, 24: { width: 24, path: Pc.default.createElement("path", { d: "M5.22 8.22a.749.749 0 0 0 0 1.06l6.25 6.25a.749.749 0 0 0 1.06 0l6.25-6.25a.749.749 0 1 0-1.06-1.06L12 13.939 6.28 8.22a.749.749 0 0 0-1.06 0Z" }) } };
var pr = Pc.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-chevron-down", t0, e0);
});
pr.displayName = "ChevronDownIcon";
var Tc = E(M(), 1);
var o0 = ["12", "16", "24"];
var n0 = { 12: { width: 12, path: Tc.default.createElement("path", { d: "M3.587 6.025c0 .2.1.4.2.5l3.3 3.3c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1l-2.7-2.7 2.7-2.7c.3-.3.3-.8 0-1.1-.3-.3-.8-.3-1.1 0l-3.2 3.2c-.2.2-.3.4-.3.6Z" }) }, 16: { width: 16, path: Tc.default.createElement("path", { d: "M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z" }) }, 24: { width: 24, path: Tc.default.createElement("path", { d: "M15.28 5.22a.75.75 0 0 1 0 1.06L9.56 12l5.72 5.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z" }) } };
var xp = Tc.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-chevron-left", n0, o0);
});
xp.displayName = "ChevronLeftIcon";
var wc = E(M(), 1);
var r0 = ["12", "16", "24"];
var i0 = { 12: { width: 12, path: wc.default.createElement("path", { d: "M4.7 10c-.2 0-.4-.1-.5-.2-.3-.3-.3-.8 0-1.1L6.9 6 4.2 3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l3.3 3.2c.3.3.3.8 0 1.1L5.3 9.7c-.2.2-.4.3-.6.3Z" }) }, 16: { width: 16, path: wc.default.createElement("path", { d: "M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" }) }, 24: { width: 24, path: wc.default.createElement("path", { d: "M8.72 18.78a.75.75 0 0 1 0-1.06L14.44 12 8.72 6.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z" }) } };
var ti = wc.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-chevron-right", i0, r0);
});
ti.displayName = "ChevronRightIcon";
var Gi = E(M(), 1);
var s0 = ["16", "24"];
var a0 = { 16: { width: 16, path: Gi.default.createElement("path", { d: "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" }) }, 24: { width: 24, path: Gi.default.createElement(Gi.default.Fragment, null, Gi.default.createElement("path", { d: "M13 7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-3 3.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v4.25h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75V12h-.75a.75.75 0 0 1-.75-.75Z" }), Gi.default.createElement("path", { d: "M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Z" })) } };
var Oc = Gi.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-info", a0, s0);
});
Oc.displayName = "InfoIcon";
var Rp = E(M(), 1);
var c0 = ["16", "24"];
var l0 = { 16: { width: 16, path: Rp.default.createElement("path", { d: "M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" }) }, 24: { width: 24, path: Rp.default.createElement("path", { d: "M10.25 2a8.25 8.25 0 0 1 6.34 13.53l5.69 5.69a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-5.69-5.69A8.25 8.25 0 1 1 10.25 2ZM3.5 10.25a6.75 6.75 0 1 0 13.5 0 6.75 6.75 0 0 0-13.5 0Z" }) } };
var oi = Rp.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-search", l0, c0);
});
oi.displayName = "SearchIcon";
var Cp = E(M(), 1);
var u0 = ["16", "24"];
var f0 = { 16: { width: 16, path: Cp.default.createElement("path", { d: "M0 4.25a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 4.25Zm0 4a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5H.75A.75.75 0 0 1 0 8.25Zm0 4a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75ZM13.5 10h2.25a.25.25 0 0 1 .177.427l-3 3a.25.25 0 0 1-.354 0l-3-3A.25.25 0 0 1 9.75 10H12V3.75a.75.75 0 0 1 1.5 0V10Z" }) }, 24: { width: 24, path: Cp.default.createElement("path", { d: "M18.5 16.44V6.75a.75.75 0 0 0-1.5 0v9.69l-2.22-2.22a.75.75 0 1 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 1 0-1.06-1.06l-2.22 2.22ZM2 7.25a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 2 7.25Zm0 5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75Zm0 5a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z" }) } };
var yp = Cp.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-sort-desc", f0, u0);
});
yp.displayName = "SortDescIcon";
var Wi = E(M(), 1);
var p0 = ["16", "24"];
var d0 = { 16: { width: 16, path: Wi.default.createElement("path", { d: "M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" }) }, 24: { width: 24, path: Wi.default.createElement(Wi.default.Fragment, null, Wi.default.createElement("path", { d: "M12 7a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 12 7Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" }), Wi.default.createElement("path", { d: "M7.328 1.47a.749.749 0 0 1 .53-.22h8.284c.199 0 .389.079.53.22l5.858 5.858c.141.14.22.33.22.53v8.284a.749.749 0 0 1-.22.53l-5.858 5.858a.749.749 0 0 1-.53.22H7.858a.749.749 0 0 1-.53-.22L1.47 16.672a.749.749 0 0 1-.22-.53V7.858c0-.199.079-.389.22-.53Zm.84 1.28L2.75 8.169v7.662l5.419 5.419h7.662l5.419-5.418V8.168L15.832 2.75Z" })) } };
var vp = Wi.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-stop", d0, p0);
});
vp.displayName = "StopIcon";
var Ep = E(M(), 1);
var m0 = ["16", "24"];
var g0 = { 16: { width: 16, path: Ep.default.createElement("path", { d: "M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" }) }, 24: { width: 24, path: Ep.default.createElement("path", { d: "M3.75 5.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Zm0 6a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Zm0 6a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" }) } };
var Mc = Ep.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-three-bars", g0, m0);
});
Mc.displayName = "ThreeBarsIcon";
var Nc = E(M(), 1);
var h0 = ["12", "16", "24"];
var b0 = { 12: { width: 12, path: Nc.default.createElement("path", { d: "M2.22 2.22a.749.749 0 0 1 1.06 0L6 4.939 8.72 2.22a.749.749 0 1 1 1.06 1.06L7.061 6 9.78 8.72a.749.749 0 1 1-1.06 1.06L6 7.061 3.28 9.78a.749.749 0 1 1-1.06-1.06L4.939 6 2.22 3.28a.749.749 0 0 1 0-1.06Z" }) }, 16: { width: 16, path: Nc.default.createElement("path", { d: "M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" }) }, 24: { width: 24, path: Nc.default.createElement("path", { d: "M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L13.06 12l5.22 5.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L12 13.06l-5.22 5.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06Z" }) } };
var Js = Nc.default.forwardRef(function(e4, t) {
  return dt(e4, t, "octicon octicon-x", b0, h0);
});
Js.displayName = "XIcon";
var ie = st.default.createElement;
var In = (...e4) => e4.filter(Boolean).join(" ");
var Qs = (0, st.createContext)(void 0);
var CS = (0, st.createContext)(false);
function yS({ owner: e4, children: t }) {
  return ie(Qs.Provider, { value: e4?.body }, ie(fr.Provider, { delay: 100 }, t));
}
var Pg = (e4) => (t, o) => e4?.(o.event, { value: t, ...o });
var Ip = (e4) => (t, o) => e4?.(o.event, { open: t, ...o });
function io(e4, t) {
  return st.default.forwardRef(function({ className: n, ...r }, i) {
    return ie(e4, { ...r, ref: i, className: In(t, n) });
  });
}
function vS(e4) {
  return st.default.forwardRef(function({ icon: o, children: n, appearance: r = "secondary", size: i = "medium", className: s, ...a }, l) {
    return ie(e4, { ...e4 === Bi.Button ? { focusableWhenDisabled: false } : {}, ...a, ref: l, className: s, "data-appearance": r, "data-size": i }, o ? ie("span", { className: "ct-button-icon", "aria-hidden": true }, o) : null, n);
  });
}
var Tg = vS(Em);
var wg = vS(Bi.Button);
function ES({ checked: e4, defaultChecked: t, onChange: o, ...n }) {
  return ie(wg, { ...n, className: In("ct-button", n.className), render: ie(Jf, { pressed: e4, defaultPressed: t, onPressedChange: (r, i) => o?.(i.event, { checked: r }) }) });
}
var IS = io(Bi.Separator, "ct-toolbar-divider");
var Og = Bi.Root;
var SS = st.default.forwardRef(function({ onChange: t, ...o }, n) {
  return ie(Ym, { ...o, ref: n, onChange: (r) => t?.(r, { value: r.target.value }) });
});
var PS = st.default.forwardRef(function({ onChange: t, textarea: o, resize: n = "vertical", style: r, ...i }, s) {
  return ie(vn.Control, { ...i, render: ie("textarea"), ref: o?.ref ?? s, style: { resize: n, ...r }, onChange: (a) => t?.(a, { value: a.target.value }) });
});
var TS = st.default.forwardRef(function({ onChange: t, ...o }, n) {
  return ie(vn.Control, { ...o, render: ie("select"), ref: n, onChange: (r) => t?.(r, { value: r.target.value }) });
});
function wS({ text: e4, children: t, ...o }) {
  return ie("option", o, t ?? e4);
}
function x0(e4, t, o) {
  return st.default.forwardRef(function({ label: r, hint: i, onChange: s, onCheckedChange: a, checked: l, ...c }, u) {
    return ie("label", { className: `ct-toggle-label ct-${o}-label` }, ie(e4, { ...c, ref: u, checked: l === "mixed" ? void 0 : l, ...l === "mixed" ? { indeterminate: true } : {}, onCheckedChange: (f, p) => {
      a?.(f, p), s?.(p.event, { checked: f });
    } }, ie(t, { className: `ct-${o}-indicator` }, o === "checkbox" ? ie(Ui, { size: 12 }) : null)), ie("span", null, r, i ? ie("span", { className: "ct-toggle-hint" }, i) : null));
  });
}
var OS = x0(Qa.Root, Qa.Indicator, "checkbox");
var MS = st.default.forwardRef(function({ label: t, hint: o, checked: n, defaultChecked: r = false, onChange: i, onCheckedChange: s, id: a, size: l = "medium", onLabel: c = "On", offLabel: u = "Off", ...f }, p) {
  let m = (0, st.useId)(), d = a ?? m;
  return ie("div", { className: "ct-switch-field" }, t ? ie("label", { id: `${d}-label`, htmlFor: d, className: "ct-switch-label" }, t) : null, ie("div", { className: "ct-switch-row" }, ie("label", { htmlFor: d, className: "ct-switch-state", "aria-hidden": true }, ie("span", { className: "ct-switch-state-on" }, c), ie("span", { className: "ct-switch-state-off" }, u)), ie(Rc.Root, { ...f, id: d, ref: p, checked: n, defaultChecked: r, "data-size": l, "aria-labelledby": f["aria-labelledby"] ?? (t ? `${d}-label` : void 0), "aria-describedby": In(f["aria-describedby"], o ? `${d}-hint` : void 0) || void 0, onCheckedChange: (h, C) => {
    s?.(h, C), i?.(C.event, { checked: h });
  } }, ie(Rc.Thumb, { className: "ct-switch-indicator", "aria-hidden": true }))), o ? ie("span", { id: `${d}-hint`, className: "ct-toggle-hint" }, o) : null);
});
function NS({ label: e4, description: t, className: o, ...n }) {
  return ie("label", { className: In("ct-radio-card", o) }, ie(hc.Root, { ...n, className: "ct-radio" }, ie(hc.Indicator, { className: "ct-radio-indicator" })), ie("span", null, ie("span", { className: "ct-radio-label" }, e4), t ? ie("span", { className: "ct-radio-description" }, t) : null));
}
function DS({ onChange: e4, onValueChange: t, ...o }) {
  return ie(sg, { ...o, className: In("ct-radio-group", o.className), onValueChange: (n, r) => {
    t?.(n, r), Pg(e4)(n, r);
  } });
}
function AS({ label: e4, hint: t, validationMessage: o, validationState: n, required: r, children: i, className: s, ...a }) {
  let l = e4 && typeof e4 == "object" && !st.default.isValidElement(e4) ? e4 : { children: e4 };
  return ie(vn.Root, { ...a, invalid: n === "error", className: s }, e4 ? ie(vn.Label, l) : null, st.default.isValidElement(i) ? st.default.cloneElement(i, r ? { required: true } : {}) : i, t ? ie(vn.Description, { className: "ct-field-hint" }, t) : null, o ? ie(vn.Error, { match: true, className: "ct-field-error", role: "alert" }, o.children ?? o) : null);
}
function kS({ label: e4, size: t = "tiny", className: o, ...n }) {
  return ie("span", { ...n, className: In("ct-spinner", o), role: "status", "data-size": t }, ie("span", { className: "ct-spinner-ring", "aria-hidden": true }), e4 ? ie("span", null, e4) : ie("span", { className: "ct-visually-hidden" }, "Loading"));
}
function FS({ value: e4, max: t = 1, label: o, tone: n, className: r, ...i }) {
  return ie(Vi.Root, { ...i, value: e4 ?? null, max: t, className: r, "data-tone": n, "aria-label": i["aria-label"] ?? "Progress" }, o ? ie(Vi.Label, { className: "ct-progress-label" }, o) : null, ie(Vi.Track, { className: "ct-progress-track" }, ie(Vi.Indicator, { className: "ct-progress-indicator" })));
}
function Sp({ appearance: e4, color: t, showZero: o, count: n, children: r, className: i, ...s }) {
  return ie("span", { ...s, className: i, "data-color": t, "data-appearance": e4 }, r ?? n);
}
var VS = Sp;
function LS({ checked: e4, defaultChecked: t, onChange: o, onClick: n, ...r }) {
  let { appearance: i, ...s } = r;
  return ie(Jf, { ...s, pressed: e4, defaultPressed: t, onPressedChange: (a, l) => o?.(l.event, { checked: a }), onClick: n });
}
var _S = io("div", "ct-skeleton");
function BS({ size: e4 = 16, className: t, ...o }) {
  return ie("div", { ...o, className: In("ct-skeleton-item", t), style: { height: e4, ...o.style } });
}
function HS({ selectedValue: e4, onTabSelect: t, children: o, ...n }) {
  return ie(qs.Root, { value: e4, onValueChange: Pg(t) }, ie(qs.List, { ...n, className: In("ct-tab-list", n.className) }, o));
}
function US({ icon: e4, children: t, ...o }) {
  return ie(qs.Tab, { ...o, "data-value": o.value, className: "ct-tab" }, e4, t);
}
function Mg({ onOpenChange: e4, ...t }) {
  return ie(yn.Root, { ...t, onOpenChange: Ip(e4) });
}
function ea({ children: e4, disableButtonEnhancement: t, ...o }) {
  let n = (0, st.useContext)(CS);
  return ie(n ? yn.Close : yn.Trigger, { ...o, render: e4 });
}
function jS({ backdrop: e4, className: t, children: o, ...n }) {
  let r = (0, st.useContext)(Qs), i = (0, st.useRef)(null);
  return ie(yn.Portal, { container: r, className: "ct-provider" }, ie(yn.Backdrop, { ...e4, className: In("ct-backdrop", e4?.className) }), ie(yn.Popup, { ...n, ref: i, className: t, initialFocus: n.initialFocus ?? (() => i.current?.querySelector("input, textarea") ?? i.current) }, ie(CS.Provider, { value: true }, o)));
}
var Ng = io("div", "ct-dialog-body");
function GS({ action: e4, children: t, ...o }) {
  return ie("div", { className: "ct-dialog-heading" }, ie(yn.Title, o, t), e4);
}
function Dg(e4) {
  return ie(yn.Description, { ...e4, render: ie("div"), className: In("ct-dialog-content", e4.className) });
}
var Ag = io("div", "ct-dialog-actions");
function WS({ onOpenChange: e4, positioning: t, ...o }) {
  return ie(Zr.Root, { ...o, onOpenChange: Ip(e4) });
}
function $S({ children: e4, disableButtonEnhancement: t, ...o }) {
  return ie(Zr.Trigger, { ...o, render: e4 });
}
function zS({ children: e4, ...t }) {
  let o = (0, st.useContext)(Qs);
  return ie(Zr.Portal, { container: o, className: "ct-provider" }, ie(Zr.Positioner, { sideOffset: 4, className: "ct-positioner" }, ie(Zr.Popup, t, e4)));
}
function KS({ content: e4, children: t, relationship: o = "description", positioning: n }) {
  let r = (0, st.useContext)(Qs), i = (0, st.useId)(), [s, a] = (0, st.useState)(false);
  return ie(fr.Root, { onOpenChange: a }, ie(fr.Trigger, { render: t, "aria-label": o === "label" && typeof e4 == "string" ? e4 : t.props["aria-label"], "aria-describedby": o === "description" && s ? In(t.props["aria-describedby"], i) : t.props["aria-describedby"], "aria-labelledby": o === "label" && s ? i : t.props["aria-labelledby"] }), ie(fr.Portal, { container: r, className: "ct-provider" }, ie(fr.Positioner, { side: n ?? "bottom", sideOffset: 4, className: "ct-positioner" }, ie(fr.Popup, { className: "ct-tooltip", id: i, role: "tooltip" }, e4))));
}
function kg({ onOpenChange: e4, inline: t, ...o }) {
  return ie(uo.Root, { ...o, onOpenChange: Ip(e4) });
}
function Fg({ children: e4, disableButtonEnhancement: t, ...o }) {
  return ie(uo.Trigger, { ...o, render: e4 });
}
function Vg({ children: e4, ...t }) {
  let o = (0, st.useContext)(Qs);
  return ie(uo.Portal, { container: o, className: "ct-provider" }, ie(uo.Positioner, { sideOffset: 4, align: "start", className: "ct-positioner" }, ie(uo.Popup, t, e4)));
}
var Lg = io("div", "ct-menu-list");
var YS = io(uo.Item, "ct-menu-item");
var qS = io(uo.Separator, "ct-menu-divider");
var XS = uo.Group;
var ZS = io(uo.GroupLabel, "ct-menu-label");
var JS = uo.CheckboxItem;
var QS = (e4) => ie(uo.CheckboxItemIndicator, e4, ie(Ui, { size: 16, "aria-hidden": true }));
var eP = uo.RadioGroup;
var tP = uo.RadioItem;
var oP = (e4) => ie(uo.RadioItemIndicator, e4, ie(Ui, { size: 16, "aria-hidden": true }));
function nP({ defaultOpenItems: e4, ...t }) {
  return ie(br.Root, { ...t, defaultValue: e4 });
}
function rP({ value: e4, ...t }) {
  return ie(br.Item, { ...t, value: e4 });
}
function iP({ children: e4, className: t }) {
  return ie(br.Header, { className: t }, ie(br.Trigger, { className: "ct-disclosure-trigger" }, ie(ti, { size: 16, "aria-hidden": true }), e4));
}
var sP = io(br.Panel, "ct-disclosure-panel");
var aP = io("div", "ct-message-body");
var cP = io("div", "ct-message-title");
var lP = io("div", "ct-message-actions");
function uP({ intent: e4 = "info", children: t, ...o }) {
  let n = { info: Oc, success: bp, warning: fp, error: vp }[e4] ?? Oc;
  return ie("div", { ...o, role: e4 === "error" ? "alert" : "status", "data-intent": e4 }, ie("span", { className: "ct-message-icon", "aria-hidden": true }, ie(n, { size: 16 })), t);
}
var fP = io("table");
var pP = io("thead");
var dP = io("th", "ct-tableHeaderCell");
var mP = io("tbody");
var gP = io("tr");
var hP = io("td", "ct-tableCell");
function bP({ onChange: e4, value: t, defaultValue: o, ...n }) {
  return ie(Qr.Root, { ...n, value: t, defaultValue: o, onValueChange: Pg(e4) }, ie(Qr.Control, { className: "ct-slider-control" }, ie(Qr.Track, { className: "ct-slider-track" }, ie(Qr.Indicator, { className: "ct-slider-indicator" })), ie(Qr.Thumb, { "aria-label": n["aria-label"], className: "ct-slider-thumb" })));
}
function xP({ options: e4, id: t, placeholder: o = "Select an option", title: n = "Select an option", searchPlaceholder: r = "Filter", selectedOptions: i, defaultSelectedOptions: s, onOptionSelect: a, onOpenChange: l, disabled: c, multiselect: u = false, className: f, ...p }) {
  let m = (0, st.useContext)(Qs), [d, h] = (0, st.useState)(s ?? []), [C, g] = (0, st.useState)(""), x = i ?? d, b = u ? x : x[0] ?? null, y = (0, st.useId)();
  return ie($o.Root, { items: e4.map((R) => R.value), multiple: u, value: b, inputValue: C, disabled: c, autoHighlight: true, itemToStringLabel: (R) => e4.find((I) => I.value === R)?.label ?? String(R ?? ""), onInputValueChange: g, onOpenChange: Ip(l), onValueChange: (R, I) => {
    let S = Array.isArray(R) ? R : R === null ? [] : [R], v = S.find((T) => !x.includes(T)) ?? x.find((T) => !S.includes(T)) ?? null;
    h(S), g(""), a?.(I.event, { optionValue: v, selectedOptions: S });
  } }, ie($o.Trigger, { ...p, id: t, disabled: c, className: f }, x.map((R) => e4.find((I) => I.value === R)?.label).filter(Boolean).join(", ") || o, ie(pr, { size: 16, "aria-hidden": true })), ie($o.Portal, { container: m, className: "ct-provider" }, ie($o.Positioner, { sideOffset: 4, align: "start", className: "ct-positioner" }, ie($o.Popup, { className: "ct-select-panel", "aria-labelledby": y }, ie("div", { className: "ct-select-panel-heading", id: y }, n), ie("div", { className: "ct-select-search-row" }, ie(oi, { size: 16, "aria-hidden": true }), ie($o.Input, { className: "ct-input ct-select-search", placeholder: r, "aria-label": r })), ie($o.List, { className: "ct-select-options" }, e4.filter((R) => R.label.toLocaleLowerCase().includes(C.toLocaleLowerCase())).map((R) => ie($o.Item, { key: R.value, value: R.value, disabled: R.disabled, className: "ct-select-option" }, ie($o.ItemIndicator, { className: "ct-option-check" }, ie(Ui, { size: 16 })), ie("span", null, ie("span", { className: "ct-option-label" }, R.label), R.description ? ie("span", { className: "ct-option-description" }, R.description) : null))), ie($o.Empty, { className: "ct-select-empty" }, "No matches"))))));
}
var V = Xe.default.createElement;
var lt = (...e4) => e4.filter(Boolean).join(" ");
function CP({ children: e4, document: t = globalThis.document, className: o, ...n }) {
  return V(yS, { owner: t }, V("div", { ...n, className: lt("ct-provider", o) }, e4));
}
function eo(e4, t, o = {}) {
  let n = Xe.default.forwardRef(function({ className: i, ...s }, a) {
    return V(e4, { ...o, ...s, ref: a, className: lt(`ct-${t}`, i), ...t === "button" ? { "data-appearance": s.appearance ?? o.appearance ?? "secondary" } : {} });
  });
  return n.displayName = t, n;
}
var Qt = eo(Tg, "button");
var Rae = eo(OS, "checkbox");
var Cae = eo(MS, "switch");
var C0 = eo(PS, "textarea", { resize: "vertical" });
var yae = eo(TS, "select");
var y0 = eo(kS, "spinner", { size: "tiny" });
var vae = eo(FS, "progress");
var Eae = eo(Sp, "badge", { appearance: "tint", color: "informative" });
var Iae = eo(VS, "counter", { appearance: "tint", showZero: true });
var Sae = eo(Sp, "tag", { appearance: "outline" });
var Pae = eo(LS, "filter-pill", { appearance: "subtle" });
var v0 = eo(Og, "toolbar");
var Tae = WS;
var wae = KS;
var Oae = eo(_S, "skeleton");
var Mae = BS;
var Nae = wS;
var Dae = NS;
var Aae = YS;
var kae = qS;
var Fae = XS;
var Vae = ZS;
var E0 = eo(wg, "button");
var Lae = ES;
var _ae = IS;
var Bae = $S;
var Hae = eo(zS, "popover");
var Uae = ea;
var yP = eo(jS, "dialog");
var jae = Ng;
var vP = eo(GS, "dialog-title");
var Gae = Dg;
var Wae = Ag;
var $ae = pP;
var zae = dP;
var Kae = mP;
var Yae = gP;
var qae = hP;
var Dc = eo(SS, "input");
function Pp({ label: e4, hint: t, error: o, required: n, children: r, className: i, ...s }) {
  return V(AS, { ...s, label: e4, hint: t, required: n, validationMessage: o ? { children: o, role: "alert" } : void 0, validationState: o ? "error" : "none", className: lt("ct-field", i) }, r);
}
function Xae({ label: e4, hint: t, error: o, required: n, input: r = {}, action: i, preview: s, className: a }) {
  let l = (0, Xe.useId)();
  return V("div", { className: lt("ct-input-action", a) }, V(Pp, { label: r.id ? { children: e4, htmlFor: r.id } : e4, hint: t, error: o, required: n }, V("div", { className: "ct-input-action-row" }, V(Dc, { ...r, required: n ?? r.required, "aria-describedby": lt(r["aria-describedby"], s ? l : "") || void 0 }), V(Qt, i))), s ? V("div", { id: l, className: "ct-preview" }, s) : null);
}
function I0({ label: e4, hint: t, children: o, className: n, ...r }) {
  let i = (0, Xe.useId)();
  return V("fieldset", { className: lt("ct-choice-group", n) }, e4 ? V("legend", { id: i }, e4) : null, t ? V("p", { id: `${i}-hint`, className: "ct-choice-hint" }, t) : null, V(DS, { "aria-labelledby": e4 ? i : void 0, "aria-describedby": t ? `${i}-hint` : void 0, ...r }, o));
}
var Zae = I0;
function Jae({ label: e4, hint: t, variant: o = "plain", children: n, className: r, ...i }) {
  let s = (0, Xe.useId)();
  return V("fieldset", { ...i, className: lt("ct-choice-group", r), "data-variant": o, "aria-describedby": lt(i["aria-describedby"], t ? `${s}-hint` : "") || void 0 }, e4 ? V("legend", null, e4) : null, t ? V("p", { id: `${s}-hint`, className: "ct-choice-hint" }, t) : null, n);
}
function Qae({ items: e4, selectedValue: t, defaultSelectedValue: o, onTabSelect: n, variant: r = "underline", className: i, ...s }) {
  let [a, l] = (0, Xe.useState)(o ?? e4[0]?.value), c = t ?? a, u = (0, Xe.useId)();
  return V("div", { className: lt("ct-tabs", i), "data-variant": r }, V(HS, { ...s, selectedValue: c, onTabSelect: (f, p) => {
    l(p.value), n?.(f, p);
  } }, e4.map((f, p) => V(US, { key: f.value, id: `${u}-${p}-tab`, value: f.value, disabled: f.disabled, icon: f.icon, "aria-controls": `${u}-${p}-panel` }, f.label))), e4.map((f, p) => V("div", { key: f.value, role: "tabpanel", id: `${u}-${p}-panel`, "aria-labelledby": `${u}-${p}-tab`, hidden: f.value !== c, tabIndex: 0 }, f.children)));
}
function RP({ children: e4, label: t = "More actions", button: o = {}, ...n }) {
  return V(kg, { ...n, inline: true }, V(Fg, { disableButtonEnhancement: true }, V(Qt, o, t)), V(Vg, { className: "ct-menu" }, V(Lg, null, e4)));
}
function ece({ button: e4 = {}, menuButton: t = {}, menuLabel: o = "More actions", children: n, disabled: r = false, className: i, ...s }) {
  let a = r || e4.disabled;
  return V("span", { className: lt("ct-split-button", i), role: "group", "data-size": e4.size ?? "medium", "aria-label": typeof e4.children == "string" ? e4.children : e4["aria-label"] }, V(Qt, { ...e4, disabled: a, className: lt("ct-split-primary", !e4.children && "ct-split-icon", e4.className) }), V(kg, s, V(Fg, null, V(Qt, { appearance: e4.appearance, size: e4.size, "aria-label": o, ...t, disabled: a || t.disabled, className: lt("ct-split-chevron", t.className), icon: V(pr, { size: 16, "aria-hidden": true }) })), V(Vg, { className: "ct-menu" }, V(Lg, null, n))));
}
function tce({ trigger: e4, title: t, subtitle: o, children: n, actions: r, closeLabel: i = "Close", size: s = "large", ...a }) {
  let l = (0, Xe.useId)();
  return V(Mg, a, e4 ? V(ea, { disableButtonEnhancement: true }, e4) : null, V(yP, { className: "ct-composed-dialog", "data-size": s, "aria-describedby": o ? l : void 0 }, V("header", { className: "ct-composed-dialog-header" }, V(vP, { action: V(ea, null, V(Qt, { appearance: "subtle", className: "ct-icon-button", "aria-label": i, icon: V(Js, { size: 16 }) })) }, t), o ? V("p", { id: l, className: "ct-dialog-subtitle" }, o) : null), V("div", { className: "ct-composed-dialog-content" }, n), r ? V(Ag, { className: "ct-composed-dialog-actions" }, r) : null));
}
function oce({ options: e4, className: t, ...o }) {
  return V(xP, { ...o, options: e4, className: lt("ct-combobox", t) });
}
function nce({ title: e4 = "Jump to destination", commands: t, onCommand: o, trigger: n, open: r, defaultOpen: i = false, onOpenChange: s, hint: a = "Filter destinations and actions, not work items", placeholder: l = "Filter destinations...", emptyMessage: c = "No matching destination.", closeLabel: u = "Close quick navigation", ...f }) {
  let [p, m] = (0, Xe.useState)(i), [d, h] = (0, Xe.useState)(""), C = t.filter((v) => `${v.label} ${v.description ?? ""}`.toLocaleLowerCase().includes(d.trim().toLocaleLowerCase())), g = (0, Xe.useRef)(null), x = (0, Xe.useRef)(null), b = (0, Xe.useId)(), y = r ?? p;
  (0, Xe.useEffect)(() => {
    y && (h(""), g.current?.focus());
  }, [y]);
  let R = (v, T) => {
    m(T.open), s?.(v, T);
  }, I = (v, T) => {
    !T || T.disabled || (R(v, { open: false, type: "trigger", event: v }), o?.(v, T.value));
  }, S = (v) => {
    let T = [...x.current?.querySelectorAll("button") ?? []].filter((w) => !w.disabled && w.getAttribute("aria-disabled") !== "true");
    (v ? T.at(-1) : T[0])?.focus();
  };
  return V(Mg, { ...f, open: y, onOpenChange: R }, n ? V(ea, { disableButtonEnhancement: true }, n) : null, V(yP, { className: "ct-palette", backdrop: { className: "ct-palette-backdrop" } }, V(Ng, null, V(vP, { action: V(ea, { disableButtonEnhancement: true }, V(Qt, { className: "ct-palette-close", appearance: "subtle", "aria-label": u, icon: V(Js, { size: 16 }) })) }, e4), V(Dg, null, V(Pp, { label: { children: a, htmlFor: `${b}-query` } }, V(Dc, { id: `${b}-query`, ref: g, type: "search", autoComplete: "off", placeholder: l, value: d, onChange: (v, T) => h(T.value), onKeyDown: (v) => {
    v.nativeEvent.isComposing || (v.key === "ArrowDown" || v.key === "ArrowUp" ? (v.preventDefault(), S(v.key === "ArrowUp")) : v.key === "Enter" && (v.preventDefault(), I(v, C.find((T) => !T.disabled))));
  } })), V(Og, { ref: x, orientation: "vertical", className: "ct-palette-destinations", "aria-label": "Destinations", onKeyDown: (v) => {
    !v.nativeEvent.isComposing && (v.key === "Home" || v.key === "End") && (v.preventDefault(), S(v.key === "End"));
  } }, C.map((v) => V(E0, { key: v.value, appearance: "subtle", disabled: v.disabled, "data-command": v.value, onClick: (T) => I(T, v), icon: v.icon }, V("span", null, v.label, v.description ? V("span", { className: "ct-palette-description" }, v.description) : null)))), C.length === 0 ? V("p", { role: "status", className: "ct-muted" }, c) : null))));
}
function S0({ title: e4, children: t, defaultOpen: o = false, keepMounted: n = false, ...r }) {
  return V(nP, { ...r, collapsible: true, defaultOpenItems: o ? ["content"] : [] }, V(rP, { value: "content" }, V(iP, { className: "ct-disclosure-header" }, e4), V(sP, { keepMounted: n }, t)));
}
function rce({ title: e4, children: t, intent: o = "info", actions: n, className: r, ...i }) {
  return V(uP, { ...i, intent: o, "data-intent": o, className: lt("ct-message", r) }, V(aP, null, e4 ? V(cP, null, e4) : null, t), n ? V(lP, null, n) : null);
}
function ice({ title: e4, description: t, icon: o, variant: n = "secondary", compact: r = false, joined: i = false, className: s, ...a }) {
  return V(Tg, { ...a, appearance: n === "primary" ? "primary" : "secondary", className: lt("ct-action-card", s), "data-variant": n, "data-compact": r, "data-joined": i }, o ? V("span", { className: "ct-action-card-icon", "aria-hidden": true }, o) : V("span"), V("span", { className: "ct-action-card-text" }, V("span", { className: "ct-action-card-title" }, e4), t ? V("span", { className: "ct-action-card-description" }, t) : null), V(n === "suggestion" ? gp : ti, { className: "ct-action-card-arrow", size: n === "suggestion" ? 20 : 16, "aria-hidden": true }));
}
function sce({ title: e4, description: t, actions: o, className: n, ...r }) {
  return V("div", { ...r, className: lt("ct-section-header", n) }, V("div", null, V("h2", null, e4), t ? V("p", null, t) : null), o);
}
function ace({ onBack: e4, onForward: t, onJump: o, backDisabled: n = false, forwardDisabled: r = false, variant: i = "classic", backLabel: s = "Back", forwardLabel: a = "Forward", jumpLabel: l = "Jump to", shortcutLabel: c, browse: u, layout: f = "inline", children: p, actions: m }) {
  return V("nav", { className: "ct-navigation", "aria-label": "History", "data-jump": !!o, "data-variant": i, "data-layout": f }, V("div", { className: "ct-history" }, u ? V(Qt, { "aria-label": "Browse destinations", ...u, appearance: "subtle", className: lt("ct-browse", u.className), icon: u.icon ?? V(Mc, { size: 16, "aria-hidden": true }) }) : null, e4 ? V(Qt, { appearance: "subtle", "aria-label": s, disabled: n, onClick: e4 }, V(i === "browser" ? xp : Ic, { size: 20, "aria-hidden": true })) : null, t ? V(Qt, { appearance: "subtle", "aria-label": a, disabled: r, onClick: t }, V(i === "browser" ? ti : Sc, { size: 20, "aria-hidden": true })) : null), p ? V("div", { className: "ct-navigation-identity" }, p) : null, o ? V(Qt, { className: "ct-jump", appearance: f === "header" ? "subtle" : void 0, "aria-label": l, "aria-haspopup": "dialog", onClick: o }, V(oi, { size: f === "header" ? 16 : 20, "aria-hidden": true }), V("span", null, l), c ? V("kbd", null, c) : null, f === "header" ? V(pr, { size: 16, "aria-hidden": true }) : null) : null, m);
}
function cce({ title: e4, context: t, icon: o, navigation: n, actions: r, onHome: i, browse: s, history: a, className: l, ...c }) {
  let u = !!(s || a), f = V("div", { className: "ct-header-identity" }, o ? V("span", { className: "ct-header-icon", "aria-hidden": true }, o) : null, i ? V(Qt, { appearance: "subtle", onClick: i }, e4) : V("h1", null, e4), t ? V(Xe.default.Fragment, null, V("span", { "aria-hidden": true }, "/"), V("span", { className: "ct-muted" }, t)) : null);
  return V("header", { ...c, className: lt("ct-header", l), "data-navigation": u || void 0 }, u ? V("div", { className: "ct-header-start" }, s ? V(Qt, { ...s, className: lt("ct-browse", s.className), appearance: "subtle", icon: s.icon ?? V(Mc, { size: 16, "aria-hidden": true }) }) : null, a, f) : f, u ? null : V("div", { className: "ct-header-center" }, n), V("div", { className: "ct-header-actions" }, u ? n : null, r));
}
function lce({ children: e4, links: t, language: o, version: n, className: r, ...i }) {
  return V("footer", { ...i, className: lt("ct-footer", r) }, V("div", { className: "ct-actions" }, t, e4), o, n ? V("span", { className: "ct-version" }, n) : null);
}
function uce({ header: e4, footer: t, children: o, className: n, ...r }) {
  return V("div", { ...r, className: lt("ct-shell", n) }, e4, V("main", { className: "ct-main" }, o), t);
}
function fce({ label: e4 = "Destinations", items: t = [], groups: o = [], current: n, onNavigate: r, variant: i = "sidebar", title: s }) {
  let a = (l) => V("ul", null, l.map((c) => V("li", { key: c.value }, V(Qt, { key: c.value, appearance: "subtle", disabled: c.disabled, icon: c.icon, "aria-current": n === c.value ? "page" : void 0, onClick: (u) => r?.(u, c.value) }, c.label))));
  return V("nav", { "aria-label": e4, className: "ct-product-navigation", "data-variant": i }, s ? V("h2", null, s) : null, a(t), o.map((l, c) => V("section", { key: c, "aria-label": l.label }, V("h3", null, l.label), a(l.items))));
}
function P0({ children: e4, className: t, ...o }) {
  return V("div", { ...o, className: lt("ct-actions", t) }, e4);
}
function pce({ search: e4, facets: t = [], values: o, defaultValues: n = {}, onFiltersChange: r, sort: i, resultCount: s, children: a, className: l, ...c }) {
  let [u, f] = (0, Xe.useState)(n), [p, m] = (0, Xe.useState)(i?.defaultValue ?? i?.options[0]?.value), d = o ?? u;
  if (!e4 && !t.length && !i) return V(v0, { ...c, className: l }, a);
  let h = (g, x, b, y) => {
    let R = d[x] ?? [], I = { ...d, [x]: y ? [...R, b] : R.filter((S) => S !== b) };
    f(I), r?.(g, { values: I });
  }, C = i?.value ?? p;
  return V("div", { ...c, role: "group", className: lt("ct-filter-toolbar", l) }, e4 ? V("div", { className: "ct-filter-search" }, V(oi, { size: 16, "aria-hidden": true }), V(Dc, { ...e4, type: "search", "aria-label": e4["aria-label"] ?? e4.placeholder ?? "Search" })) : null, V("div", { className: "ct-filter-controls" }, t.map((g) => {
    let x = g.options.filter((y) => d[g.id]?.includes(y.value)), b = x.length ? `${g.label}: ${x.length === 1 ? x[0].label : x.length}` : g.label;
    return V(RP, { key: g.id, label: V(Xe.default.Fragment, null, b, V(pr, { size: 16, "aria-hidden": true })), button: { "aria-label": b, disabled: g.disabled } }, g.options.map((y) => V(JS, { key: y.value, className: "ct-menu-choice", checked: d[g.id]?.includes(y.value) ?? false, disabled: y.disabled, onCheckedChange: (R, I) => h(I.event, g.id, y.value, R) }, V(QS, null), y.label)));
  }), i ? V(RP, { label: V(Xe.default.Fragment, null, V(yp, { size: 16, "aria-hidden": true }), V("span", null, `${i.label ?? "Sort"}: ${i.options.find((g) => g.value === C)?.label ?? ""}`), V(pr, { size: 16, "aria-hidden": true })), button: { className: "ct-filter-sort", "aria-label": `${i.label ?? "Sort"}: ${i.options.find((g) => g.value === C)?.label ?? ""}` } }, V(eP, { value: C, onValueChange: (g, x) => {
    m(g), i.onChange?.(x.event, { value: g });
  } }, i.options.map((g) => V(tP, { key: g.value, value: g.value, disabled: g.disabled, className: "ct-menu-choice" }, V(oP, null), g.label)))) : null, a), s !== void 0 ? V("span", { role: "status", className: "ct-visually-hidden" }, `${s} results`) : null);
}
function dce({ title: e4, children: t, action: o, className: n, ...r }) {
  return V("div", { ...r, className: lt("ct-blankslate", n) }, V("h2", null, e4), V("div", { className: "ct-muted" }, t), o);
}
function mce({ title: e4, status: t, statusTone: o = "neutral", children: n, actions: r, footer: i, onClose: s, closeLabel: a = "Close details", className: l, ...c }) {
  let u = (0, Xe.useId)();
  return V("section", { ...c, "aria-labelledby": c["aria-labelledby"] ?? u, className: lt("ct-detail", l) }, V("header", { className: "ct-detail-header" }, V("h2", { id: u }, e4), t ? V("span", { className: "ct-detail-status", "data-tone": o }, t) : null, V("div", { className: "ct-actions ct-detail-actions" }, r, s ? V(Qt, { appearance: "subtle", className: "ct-icon-button", "aria-label": a, onClick: s, icon: V(Js, { size: 16 }) }) : null)), V("div", { className: "ct-detail-body" }, n), i ? V("footer", { className: "ct-detail-footer" }, i) : null);
}
function gce({ list: e4, items: t = [], selectedValue: o, defaultSelectedValue: n, onSelect: r, title: i = "Items", actions: s, filters: a, searchable: l = true, searchLabel: c = "Search items", emptyMessage: u = "No matching items.", emptyDetail: f = "Select an item to view details.", backLabel: p = "Back to list", children: m, className: d, ...h }) {
  let [C, g] = (0, Xe.useState)(n), [x, b] = (0, Xe.useState)(""), [y, R] = (0, Xe.useState)(false), I = o === void 0 ? C : o, S = t.some((B) => B.value === I) ? I : void 0, v = (0, Xe.useRef)(null), T = (0, Xe.useRef)(null), w = (0, Xe.useId)(), P = (0, Xe.useId)(), O = t.filter((B) => `${B.title} ${B.description ?? ""} ${B.group ?? ""}`.toLocaleLowerCase().includes(x.trim().toLocaleLowerCase())), N = [...new Set(O.map((B) => B.group ?? ""))], D = (B, k) => {
    g(k.value), R(true), r?.(B, { value: k.value }), v.current?.clientWidth < 760 && v.current.ownerDocument.defaultView.requestAnimationFrame(() => T.current?.focus());
  }, A = () => {
    R(false), v.current?.ownerDocument.defaultView.requestAnimationFrame(() => v.current?.querySelector(".ct-list-item[aria-current=true]")?.focus());
  }, _ = typeof m == "function" ? m(S) : m;
  return V("div", { ...h, ref: v, className: lt("ct-list-detail", d), "data-view": e4 !== void 0 ? "slots" : y && S ? "detail" : "list" }, V("section", { className: "ct-list-pane", "aria-labelledby": w }, V("header", { className: "ct-list-heading" }, V("h2", { id: w }, i), V("div", { className: "ct-actions" }, s)), e4 ?? V(Xe.default.Fragment, null, l ? V("div", { className: "ct-filter-search ct-list-search" }, V(oi, { size: 16, "aria-hidden": true }), V(Dc, { type: "search", "aria-label": c, placeholder: c, value: x, onChange: (B, k) => b(k.value) })) : null, a, O.length ? N.map((B) => {
    let k = O.filter(($) => ($.group ?? "") === B), F = V("ul", null, k.map(($) => V("li", { key: $.value }, V(Qt, { appearance: "subtle", className: "ct-list-item", disabled: $.disabled, "aria-current": S === $.value ? "true" : void 0, "aria-controls": P, onClick: (K) => D(K, $) }, $.icon ? V("span", { "aria-hidden": true }, $.icon) : null, V("span", { className: "ct-list-item-text" }, V("span", null, $.title), $.description ? V("span", { className: "ct-muted" }, $.description) : null), $.meta ? V("span", { className: "ct-list-meta" }, $.meta) : null, V(ti, { size: 16, "aria-hidden": true })))));
    return V("div", { key: B, className: "ct-list-group", "data-group": B }, B ? V(S0, { title: V(Xe.default.Fragment, null, V("span", null, B), " ", V("span", { className: "ct-list-group-count" }, k.length)), defaultOpen: true }, F) : F);
  }) : V("p", { role: "status", className: "ct-list-empty" }, u))), V("section", { className: "ct-list-detail-pane", id: P, "aria-label": "Selected item" }, V("div", { className: "ct-list-detail-back", ref: T, tabIndex: -1, "aria-label": t.find((B) => B.value === S)?.title ?? "Details" }, V(Qt, { appearance: "subtle", onClick: A, icon: V(Ic, { size: 16, "aria-hidden": true }) }, p)), _ ?? V("p", { className: "ct-list-empty" }, f)));
}
function hce({ first: e4, second: t, ratio: o, onRatioChange: n, label: r = "First pane width", className: i }) {
  let [s, a] = (0, Xe.useState)(40), l = o ?? s;
  return V("div", { className: lt("ct-split", i) }, V("div", { className: "ct-split-content", style: { gridTemplateColumns: `${l}fr ${100 - l}fr` } }, e4, t), V(T0, { label: r, value: l, onChange: (c, u) => {
    a(u.value), n?.(c, u);
  } }));
}
function T0({ label: e4 = "Pane width", ...t }) {
  return V(bP, { ...t, min: 10, max: 90, "aria-label": e4, className: "ct-resize" });
}
function w0({ children: e4, label: t = "Code", title: o, language: n, actions: r, className: i, ...s }) {
  let a = V("pre", { ...s, className: lt("ct-code", i), "aria-label": t, tabIndex: 0 }, V("code", null, e4));
  return !o && !n && !r ? a : V("section", { className: "ct-code-block", "aria-label": typeof o == "string" ? o : t }, o ? V("h3", null, o) : null, V("div", { className: "ct-code-frame" }, V("header", { className: "ct-code-header" }, V("span", null, n), V("div", { className: "ct-actions" }, r)), a));
}
function bce({ children: e4, label: t = "Output", status: o, description: n, emptyMessage: r = "No process output yet.", className: i, ...s }) {
  return V("section", { ...s, className: lt("ct-output", i), "aria-label": t }, V("header", { className: "ct-output-header" }, V("h3", null, t), o ? V("span", { role: "status", className: "ct-muted" }, o) : null), n ? V("p", { className: "ct-output-description" }, n) : null, V(w0, { label: `${t} log` }, e4 == null || e4 === "" ? r : e4));
}
function xce({ items: e4, className: t, ...o }) {
  return V("dl", { ...o, className: lt("ct-key-values", t) }, e4.map(({ label: n, value: r }, i) => V(Xe.default.Fragment, { key: i }, V("dt", null, n), V("dd", null, r))));
}
function Rce({ items: e4, className: t, ...o }) {
  return V("dl", { ...o, className: lt("ct-metadata-list", t) }, e4.map(({ label: n, value: r }, i) => V("div", { key: i }, V("dt", null, n), V("dd", null, r))));
}
var Cce = eo(fP, "table");
function yce({ label: e4 = "Message", value: t, onChange: o, onSubmit: n, pending: r = false, error: i, placeholder: s, submitLabel: a = "Send", actions: l }) {
  let c = (0, Xe.useRef)(null);
  return (0, Xe.useLayoutEffect)(() => {
    let u = c.current;
    if (!u) return;
    let f = () => {
      u.style.height = "0px", u.style.height = `${Math.max(104, u.scrollHeight)}px`;
    };
    f();
    let p = u.ownerDocument.defaultView?.ResizeObserver, m = u.clientWidth, d = p ? new p(() => {
      u.clientWidth !== m && (m = u.clientWidth, f());
    }) : void 0;
    return d?.observe(u), () => d?.disconnect();
  }, [t]), V("form", { className: "ct-composer", "aria-busy": r, onSubmit: (u) => {
    u.preventDefault(), !r && t.trim() && n?.(u);
  } }, V(Pp, { label: { children: e4, className: "ct-visually-hidden" }, error: i }, V(C0, { value: t, onChange: o, placeholder: s, disabled: r, resize: "none", textarea: { ref: c } })), V("div", { className: "ct-actions ct-actions-end" }, l ? V("div", { className: "ct-composer-actions" }, l) : null, r ? V(y0, { label: "Sending" }) : null, V(Qt, { type: "submit", className: "ct-composer-send", appearance: "primary", "aria-label": a, disabled: r || !t.trim(), icon: V(Sc, { size: 20, "aria-hidden": true }) })));
}
function vce({ label: e4, value: t, onChange: o, onSave: n, onCancel: r, pending: i = false, error: s }) {
  return V("form", { className: "ct-editor", "aria-busy": i, onSubmit: (a) => {
    a.preventDefault(), i || n?.(a);
  } }, V(Pp, { label: e4, error: s }, V(Dc, { value: t, onChange: o, disabled: i })), V(P0, null, V(Qt, { type: "submit", appearance: "primary", disabled: i }, "Save"), V(Qt, { onClick: r, disabled: i }, "Cancel")));
}
var Ac = E(M(), 1);
var _g = /* @__PURE__ */ new WeakMap();
function Sce(e4, t, o = {}) {
  if (!e4 || e4.nodeType !== 1) throw new TypeError("A DOM element is required.");
  if (!t || typeof t != "function" && typeof t != "object") throw new TypeError("A React component is required.");
  if (_g.has(e4)) throw new Error("This container already has a toolkit React root. Dispose it first.");
  let n = (0, EP.createRoot)(e4), r = o, i = false;
  function s() {
    (0, Hg.flushSync)(() => n.render(Bg.default.createElement(CP, { document: e4.ownerDocument }, Bg.default.createElement(t, r))));
  }
  let a = { element: e4, update(l) {
    if (i) throw new Error("Cannot update a disposed canvas component.");
    r = { ...r, ...l }, s();
  }, dispose() {
    i || ((0, Hg.flushSync)(() => n.unmount()), i = true, _g.delete(e4));
  } };
  _g.set(e4, a);
  try {
    s();
  } catch (l) {
    throw a.dispose(), l;
  }
  return a;
}
var export_Fragment = Ac.Fragment;
var export_createElement = Ac.createElement;
var export_useEffect = Ac.useEffect;
var export_useRef = Ac.useRef;
var export_useState = Ac.useState;
export {
  ice as ActionCard,
  P0 as ActionGroup,
  v0 as ActionToolbar,
  Eae as Badge,
  dce as Blankslate,
  Qt as Button,
  lce as CanvasFooter,
  cce as CanvasHeader,
  CP as CanvasProvider,
  uce as CanvasShell,
  Rae as Checkbox,
  Jae as CheckboxGroup,
  I0 as ChoiceGroup,
  w0 as CodeBlock,
  nce as CommandPalette,
  Iae as Counter,
  mce as DetailPanel,
  tce as Dialog,
  Wae as DialogActions,
  jae as DialogBody,
  Gae as DialogContent,
  yP as DialogSurface,
  vP as DialogTitle,
  Uae as DialogTrigger,
  S0 as Disclosure,
  Pae as FilterPill,
  pce as FilterToolbar,
  Pp as FormField,
  export_Fragment as Fragment,
  vce as InlineEditor,
  Xae as InputWithAction,
  xce as KeyValueList,
  gce as ListDetail,
  RP as MenuButton,
  kae as MenuDivider,
  Fae as MenuGroup,
  Vae as MenuGroupHeader,
  Aae as MenuItem,
  rce as MessageBar,
  Rce as MetadataList,
  ace as NavigationControls,
  Nae as Option,
  bce as OutputPanel,
  Tae as Popover,
  Hae as PopoverSurface,
  Bae as PopoverTrigger,
  fce as ProductNavigation,
  vae as ProgressBar,
  yce as PromptComposer,
  Dae as Radio,
  Zae as RadioGroup,
  T0 as ResizeHandle,
  sce as SectionHeader,
  yae as Select,
  oce as SelectPanel,
  Oae as Skeleton,
  Mae as SkeletonItem,
  y0 as Spinner,
  ece as SplitButton,
  hce as SplitPane,
  Cae as Switch,
  Cce as Table,
  Kae as TableBody,
  qae as TableCell,
  $ae as TableHeader,
  zae as TableHeaderCell,
  Yae as TableRow,
  Qae as Tabs,
  Sae as Tag,
  Dc as TextInput,
  C0 as Textarea,
  E0 as ToolbarButton,
  _ae as ToolbarDivider,
  Lae as ToolbarToggleButton,
  wae as Tooltip,
  export_createElement as createElement,
  Sce as mountCanvasComponent,
  export_useEffect as useEffect,
  export_useRef as useRef,
  export_useState as useState
};
