import { createRequire as __canvasCreateRequire } from "node:module";
const require = __canvasCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable2;
      createDebug.enable = enable2;
      createDebug.enabled = enabled2;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy2;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend2;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend2(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable2(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable2() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled2(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy2() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports, module) {
    "use strict";
    module.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports, module) {
    "use strict";
    var os3 = __require("node:os");
    var tty = __require("node:tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var forceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      forceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      forceColor = 1;
    }
    if ("FORCE_COLOR" in env) {
      if (env.FORCE_COLOR === "true") {
        forceColor = 1;
      } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
      } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, streamIsTTY) {
      if (forceColor === 0) {
        return 0;
      }
      if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
      }
      if (hasFlag("color=256")) {
        return 2;
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os3.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream) {
      const level = supportsColor(stream, stream && stream.isTTY);
      return translateLevel(level);
    }
    module.exports = {
      supportsColor: getSupportLevel,
      stdout: translateLevel(supportsColor(true, tty.isatty(1))),
      stderr: translateLevel(supportsColor(true, tty.isatty(2)))
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module) {
    var tty = __require("node:tty");
    var util2 = __require("node:util");
    exports.init = init;
    exports.log = log2;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.destroy = util2.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log2(...args) {
      return process.stderr.write(util2.formatWithOptions(exports.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports, module) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module.exports = require_browser();
    } else {
      module.exports = require_node();
    }
  }
});

// node_modules/agent-base/dist/helpers.js
var require_helpers = __commonJS({
  "node_modules/agent-base/dist/helpers.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.req = exports.json = exports.toBuffer = void 0;
    var http2 = __importStar(__require("node:http"));
    var https2 = __importStar(__require("node:https"));
    async function toBuffer(stream) {
      let length = 0;
      const chunks = [];
      for await (const chunk of stream) {
        length += chunk.length;
        chunks.push(chunk);
      }
      return Buffer.concat(chunks, length);
    }
    exports.toBuffer = toBuffer;
    async function json(stream) {
      const buf = await toBuffer(stream);
      const str = buf.toString("utf8");
      try {
        return JSON.parse(str);
      } catch (_err) {
        const err = _err;
        err.message += ` (input: ${str})`;
        throw err;
      }
    }
    exports.json = json;
    function req(url, opts = {}) {
      const href = typeof url === "string" ? url : url.href;
      const req2 = (href.startsWith("https:") ? https2 : http2).request(url, opts);
      const promise = new Promise((resolve, reject) => {
        req2.once("response", resolve).once("error", reject).end();
      });
      req2.then = promise.then.bind(promise);
      return req2;
    }
    exports.req = req;
  }
});

// node_modules/agent-base/dist/index.js
var require_dist = __commonJS({
  "node_modules/agent-base/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Agent = void 0;
    var net = __importStar(__require("node:net"));
    var http2 = __importStar(__require("node:http"));
    var https_1 = __require("node:https");
    __exportStar(require_helpers(), exports);
    var INTERNAL = Symbol("AgentBaseInternalState");
    var Agent = class extends http2.Agent {
      constructor(opts) {
        super(opts);
        this[INTERNAL] = {};
      }
      /**
       * Determine whether this is an `http` or `https` request.
       */
      isSecureEndpoint(options) {
        if (options) {
          if (typeof options.secureEndpoint === "boolean") {
            return options.secureEndpoint;
          }
          if (typeof options.protocol === "string") {
            return options.protocol === "https:";
          }
        }
        const { stack } = new Error();
        if (typeof stack !== "string")
          return false;
        return stack.split("\n").some((l) => l.indexOf("(https.js:") !== -1 || l.indexOf("node:https:") !== -1);
      }
      // In order to support async signatures in `connect()` and Node's native
      // connection pooling in `http.Agent`, the array of sockets for each origin
      // has to be updated synchronously. This is so the length of the array is
      // accurate when `addRequest()` is next called. We achieve this by creating a
      // fake socket and adding it to `sockets[origin]` and incrementing
      // `totalSocketCount`.
      incrementSockets(name) {
        if (this.maxSockets === Infinity && this.maxTotalSockets === Infinity) {
          return null;
        }
        if (!this.sockets[name]) {
          this.sockets[name] = [];
        }
        const fakeSocket = new net.Socket({ writable: false });
        this.sockets[name].push(fakeSocket);
        this.totalSocketCount++;
        return fakeSocket;
      }
      decrementSockets(name, socket) {
        if (!this.sockets[name] || socket === null) {
          return;
        }
        const sockets = this.sockets[name];
        const index = sockets.indexOf(socket);
        if (index !== -1) {
          sockets.splice(index, 1);
          this.totalSocketCount--;
          if (sockets.length === 0) {
            delete this.sockets[name];
          }
        }
      }
      // In order to properly update the socket pool, we need to call `getName()` on
      // the core `https.Agent` if it is a secureEndpoint.
      getName(options) {
        const secureEndpoint = this.isSecureEndpoint(options);
        if (secureEndpoint) {
          return https_1.Agent.prototype.getName.call(this, options);
        }
        return super.getName(options);
      }
      createSocket(req, options, cb) {
        const connectOpts = {
          ...options,
          secureEndpoint: this.isSecureEndpoint(options)
        };
        const name = this.getName(connectOpts);
        const fakeSocket = this.incrementSockets(name);
        Promise.resolve().then(() => this.connect(req, connectOpts)).then((socket) => {
          this.decrementSockets(name, fakeSocket);
          if (socket instanceof http2.Agent) {
            try {
              return socket.addRequest(req, connectOpts);
            } catch (err) {
              return cb(err);
            }
          }
          this[INTERNAL].currentSocket = socket;
          super.createSocket(req, options, cb);
        }, (err) => {
          this.decrementSockets(name, fakeSocket);
          cb(err);
        });
      }
      createConnection() {
        const socket = this[INTERNAL].currentSocket;
        this[INTERNAL].currentSocket = void 0;
        if (!socket) {
          throw new Error("No socket was returned in the `connect()` function");
        }
        return socket;
      }
      get defaultPort() {
        return this[INTERNAL].defaultPort ?? (this.protocol === "https:" ? 443 : 80);
      }
      set defaultPort(v) {
        if (this[INTERNAL]) {
          this[INTERNAL].defaultPort = v;
        }
      }
      get protocol() {
        return this[INTERNAL].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:");
      }
      set protocol(v) {
        if (this[INTERNAL]) {
          this[INTERNAL].protocol = v;
        }
      }
    };
    exports.Agent = Agent;
  }
});

// node_modules/https-proxy-agent/dist/parse-proxy-response.js
var require_parse_proxy_response = __commonJS({
  "node_modules/https-proxy-agent/dist/parse-proxy-response.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseProxyResponse = void 0;
    var debug_1 = __importDefault(require_src());
    var debug = (0, debug_1.default)("https-proxy-agent:parse-proxy-response");
    function parseProxyResponse(socket) {
      return new Promise((resolve, reject) => {
        let buffersLength = 0;
        const buffers = [];
        function read() {
          const b = socket.read();
          if (b)
            ondata(b);
          else
            socket.once("readable", read);
        }
        function cleanup() {
          socket.removeListener("end", onend);
          socket.removeListener("error", onerror);
          socket.removeListener("readable", read);
        }
        function onend() {
          cleanup();
          debug("onend");
          reject(new Error("Proxy connection ended before receiving CONNECT response"));
        }
        function onerror(err) {
          cleanup();
          debug("onerror %o", err);
          reject(err);
        }
        function ondata(b) {
          buffers.push(b);
          buffersLength += b.length;
          const buffered = Buffer.concat(buffers, buffersLength);
          const endOfHeaders = buffered.indexOf("\r\n\r\n");
          if (endOfHeaders === -1) {
            debug("have not received end of HTTP headers yet...");
            read();
            return;
          }
          const headerParts = buffered.slice(0, endOfHeaders).toString("ascii").split("\r\n");
          const firstLine = headerParts.shift();
          if (!firstLine) {
            socket.destroy();
            return reject(new Error("No header received from proxy CONNECT response"));
          }
          const firstLineParts = firstLine.split(" ");
          const statusCode = +firstLineParts[1];
          const statusText = firstLineParts.slice(2).join(" ");
          const headers = {};
          for (const header of headerParts) {
            if (!header)
              continue;
            const firstColon = header.indexOf(":");
            if (firstColon === -1) {
              socket.destroy();
              return reject(new Error(`Invalid header from proxy CONNECT response: "${header}"`));
            }
            const key = header.slice(0, firstColon).toLowerCase();
            const value = header.slice(firstColon + 1).trimStart();
            const current = headers[key];
            if (typeof current === "string") {
              headers[key] = [current, value];
            } else if (Array.isArray(current)) {
              current.push(value);
            } else {
              headers[key] = value;
            }
          }
          debug("got proxy server response: %o %o", firstLine, headers);
          cleanup();
          resolve({
            connect: {
              statusCode,
              statusText,
              headers
            },
            buffered
          });
        }
        socket.on("error", onerror);
        socket.on("end", onend);
        read();
      });
    }
    exports.parseProxyResponse = parseProxyResponse;
  }
});

// node_modules/https-proxy-agent/dist/index.js
var require_dist2 = __commonJS({
  "node_modules/https-proxy-agent/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HttpsProxyAgent = void 0;
    var net = __importStar(__require("node:net"));
    var tls = __importStar(__require("node:tls"));
    var assert_1 = __importDefault(__require("node:assert"));
    var debug_1 = __importDefault(require_src());
    var agent_base_1 = require_dist();
    var url_1 = __require("node:url");
    var parse_proxy_response_1 = require_parse_proxy_response();
    var debug = (0, debug_1.default)("https-proxy-agent");
    var setServernameFromNonIpHost = (options) => {
      if (options.servername === void 0 && options.host && !net.isIP(options.host)) {
        return {
          ...options,
          servername: options.host
        };
      }
      return options;
    };
    var HttpsProxyAgent2 = class extends agent_base_1.Agent {
      constructor(proxy, opts) {
        super(opts);
        this.options = { path: void 0 };
        this.proxy = typeof proxy === "string" ? new url_1.URL(proxy) : proxy;
        this.proxyHeaders = opts?.headers ?? {};
        debug("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
        const host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, "");
        const port = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
        this.connectOpts = {
          // Attempt to negotiate http/1.1 for proxy servers that support http/2
          ALPNProtocols: ["http/1.1"],
          ...opts ? omit(opts, "headers") : null,
          host,
          port
        };
      }
      /**
       * Called when the node-core HTTP client library is creating a
       * new HTTP request.
       */
      async connect(req, opts) {
        const { proxy } = this;
        if (!opts.host) {
          throw new TypeError('No "host" provided');
        }
        let socket;
        if (proxy.protocol === "https:") {
          debug("Creating `tls.Socket`: %o", this.connectOpts);
          socket = tls.connect(setServernameFromNonIpHost(this.connectOpts));
        } else {
          debug("Creating `net.Socket`: %o", this.connectOpts);
          socket = net.connect(this.connectOpts);
        }
        const headers = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : { ...this.proxyHeaders };
        const host = net.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
        let payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r
`;
        if (proxy.username || proxy.password) {
          const auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
          headers["Proxy-Authorization"] = `Basic ${Buffer.from(auth).toString("base64")}`;
        }
        headers.Host = `${host}:${opts.port}`;
        if (!headers["Proxy-Connection"]) {
          headers["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
        }
        for (const name of Object.keys(headers)) {
          payload += `${name}: ${headers[name]}\r
`;
        }
        const proxyResponsePromise = (0, parse_proxy_response_1.parseProxyResponse)(socket);
        socket.write(`${payload}\r
`);
        const { connect, buffered } = await proxyResponsePromise;
        req.emit("proxyConnect", connect);
        this.emit("proxyConnect", connect, req);
        if (connect.statusCode === 200) {
          req.once("socket", resume);
          if (opts.secureEndpoint) {
            debug("Upgrading socket connection to TLS");
            return tls.connect({
              ...omit(setServernameFromNonIpHost(opts), "host", "path", "port"),
              socket
            });
          }
          return socket;
        }
        socket.destroy();
        const fakeSocket = new net.Socket({ writable: false });
        fakeSocket.readable = true;
        req.once("socket", (s) => {
          debug("Replaying proxy buffer for failed request");
          (0, assert_1.default)(s.listenerCount("data") > 0);
          s.push(buffered);
          s.push(null);
        });
        return fakeSocket;
      }
    };
    HttpsProxyAgent2.protocols = ["http", "https"];
    exports.HttpsProxyAgent = HttpsProxyAgent2;
    function resume(socket) {
      socket.resume();
    }
    function omit(obj, ...keys) {
      const ret = {};
      let key;
      for (key in obj) {
        if (!keys.includes(key)) {
          ret[key] = obj[key];
        }
      }
      return ret;
    }
  }
});

// node_modules/http-proxy-agent/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/http-proxy-agent/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HttpProxyAgent = void 0;
    var net = __importStar(__require("node:net"));
    var tls = __importStar(__require("node:tls"));
    var debug_1 = __importDefault(require_src());
    var events_1 = __require("node:events");
    var agent_base_1 = require_dist();
    var url_1 = __require("node:url");
    var debug = (0, debug_1.default)("http-proxy-agent");
    var HttpProxyAgent2 = class extends agent_base_1.Agent {
      constructor(proxy, opts) {
        super(opts);
        this.proxy = typeof proxy === "string" ? new url_1.URL(proxy) : proxy;
        this.proxyHeaders = opts?.headers ?? {};
        debug("Creating new HttpProxyAgent instance: %o", this.proxy.href);
        const host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, "");
        const port = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
        this.connectOpts = {
          ...opts ? omit(opts, "headers") : null,
          host,
          port
        };
      }
      addRequest(req, opts) {
        req._header = null;
        this.setRequestProps(req, opts);
        super.addRequest(req, opts);
      }
      setRequestProps(req, opts) {
        const { proxy } = this;
        const protocol = opts.secureEndpoint ? "https:" : "http:";
        const hostname = req.getHeader("host") || "localhost";
        const base = `${protocol}//${hostname}`;
        const url = new url_1.URL(req.path, base);
        if (opts.port !== 80) {
          url.port = String(opts.port);
        }
        req.path = String(url);
        const headers = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : { ...this.proxyHeaders };
        if (proxy.username || proxy.password) {
          const auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
          headers["Proxy-Authorization"] = `Basic ${Buffer.from(auth).toString("base64")}`;
        }
        if (!headers["Proxy-Connection"]) {
          headers["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
        }
        for (const name of Object.keys(headers)) {
          const value = headers[name];
          if (value) {
            req.setHeader(name, value);
          }
        }
      }
      async connect(req, opts) {
        req._header = null;
        if (!req.path.includes("://")) {
          this.setRequestProps(req, opts);
        }
        let first;
        let endOfHeaders;
        debug("Regenerating stored HTTP header string for request");
        req._implicitHeader();
        if (req.outputData && req.outputData.length > 0) {
          debug("Patching connection write() output buffer with updated header");
          first = req.outputData[0].data;
          endOfHeaders = first.indexOf("\r\n\r\n") + 4;
          req.outputData[0].data = req._header + first.substring(endOfHeaders);
          debug("Output buffer: %o", req.outputData[0].data);
        }
        let socket;
        if (this.proxy.protocol === "https:") {
          debug("Creating `tls.Socket`: %o", this.connectOpts);
          socket = tls.connect(this.connectOpts);
        } else {
          debug("Creating `net.Socket`: %o", this.connectOpts);
          socket = net.connect(this.connectOpts);
        }
        await (0, events_1.once)(socket, "connect");
        return socket;
      }
    };
    HttpProxyAgent2.protocols = ["http", "https"];
    exports.HttpProxyAgent = HttpProxyAgent2;
    function omit(obj, ...keys) {
      const ret = {};
      let key;
      for (key in obj) {
        if (!keys.includes(key)) {
          ret[key] = obj[key];
        }
      }
      return ret;
    }
  }
});

// node_modules/@azure/core-tracing/dist/commonjs/state-cjs.js
var require_state_cjs = __commonJS({
  "node_modules/@azure/core-tracing/dist/commonjs/state-cjs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.state = void 0;
    exports.state = {
      instrumenterImplementation: void 0
    };
  }
});

// node_modules/@typespec/ts-http-runtime/dist/esm/logger/log.js
import { EOL } from "node:os";
import util from "node:util";
import process2 from "node:process";
function log(message, ...args) {
  process2.stderr.write(`${util.format(message, ...args)}${EOL}`);
}

// node_modules/@typespec/ts-http-runtime/dist/esm/env.js
import process3 from "node:process";
function getEnvironmentVariable(name) {
  return process3.env[name];
}
function emitNodeWarning(warning) {
  process3.emitWarning(warning);
}
var isDeno = typeof process3.versions.deno === "string" && process3.versions.deno.length > 0;
var isBun = typeof process3.versions.bun === "string" && process3.versions.bun.length > 0;
var isNodeLike = true;

// node_modules/@typespec/ts-http-runtime/dist/esm/logger/debug.js
var debugEnvVariable = getEnvironmentVariable("DEBUG");
var enabledString;
var enabledNamespaces = [];
var skippedNamespaces = [];
var debuggers = [];
if (debugEnvVariable) {
  enable(debugEnvVariable);
}
var debugObj = Object.assign((namespace) => {
  return createDebugger(namespace);
}, {
  enable,
  enabled,
  disable,
  log
});
function enable(namespaces) {
  enabledString = namespaces;
  enabledNamespaces = [];
  skippedNamespaces = [];
  const namespaceList = namespaces.split(",").map((ns) => ns.trim());
  for (const ns of namespaceList) {
    if (ns.startsWith("-")) {
      skippedNamespaces.push(ns.substring(1));
    } else {
      enabledNamespaces.push(ns);
    }
  }
  for (const instance of debuggers) {
    instance.enabled = enabled(instance.namespace);
  }
}
function enabled(namespace) {
  if (namespace.endsWith("*")) {
    return true;
  }
  for (const skipped of skippedNamespaces) {
    if (namespaceMatches(namespace, skipped)) {
      return false;
    }
  }
  for (const enabledNamespace of enabledNamespaces) {
    if (namespaceMatches(namespace, enabledNamespace)) {
      return true;
    }
  }
  return false;
}
function namespaceMatches(namespace, patternToMatch) {
  if (patternToMatch.indexOf("*") === -1) {
    return namespace === patternToMatch;
  }
  let pattern = patternToMatch;
  if (patternToMatch.indexOf("**") !== -1) {
    const patternParts = [];
    let lastCharacter = "";
    for (const character of patternToMatch) {
      if (character === "*" && lastCharacter === "*") {
        continue;
      } else {
        lastCharacter = character;
        patternParts.push(character);
      }
    }
    pattern = patternParts.join("");
  }
  let namespaceIndex = 0;
  let patternIndex = 0;
  const patternLength = pattern.length;
  const namespaceLength = namespace.length;
  let lastWildcard = -1;
  let lastWildcardNamespace = -1;
  while (namespaceIndex < namespaceLength && patternIndex < patternLength) {
    if (pattern[patternIndex] === "*") {
      lastWildcard = patternIndex;
      patternIndex++;
      if (patternIndex === patternLength) {
        return true;
      }
      while (namespace[namespaceIndex] !== pattern[patternIndex]) {
        namespaceIndex++;
        if (namespaceIndex === namespaceLength) {
          return false;
        }
      }
      lastWildcardNamespace = namespaceIndex;
      namespaceIndex++;
      patternIndex++;
      continue;
    } else if (pattern[patternIndex] === namespace[namespaceIndex]) {
      patternIndex++;
      namespaceIndex++;
    } else if (lastWildcard >= 0) {
      patternIndex = lastWildcard + 1;
      namespaceIndex = lastWildcardNamespace + 1;
      if (namespaceIndex === namespaceLength) {
        return false;
      }
      while (namespace[namespaceIndex] !== pattern[patternIndex]) {
        namespaceIndex++;
        if (namespaceIndex === namespaceLength) {
          return false;
        }
      }
      lastWildcardNamespace = namespaceIndex;
      namespaceIndex++;
      patternIndex++;
      continue;
    } else {
      return false;
    }
  }
  const namespaceDone = namespaceIndex === namespace.length;
  const patternDone = patternIndex === pattern.length;
  const trailingWildCard = patternIndex === pattern.length - 1 && pattern[patternIndex] === "*";
  return namespaceDone && (patternDone || trailingWildCard);
}
function disable() {
  const result = enabledString || "";
  enable("");
  return result;
}
function createDebugger(namespace) {
  const newDebugger = Object.assign(debug, {
    enabled: enabled(namespace),
    destroy,
    log: debugObj.log,
    namespace,
    extend
  });
  function debug(...args) {
    if (!newDebugger.enabled) {
      return;
    }
    if (args.length > 0) {
      args[0] = `${namespace} ${args[0]}`;
    }
    newDebugger.log(...args);
  }
  debuggers.push(newDebugger);
  return newDebugger;
}
function destroy() {
  const index = debuggers.indexOf(this);
  if (index >= 0) {
    debuggers.splice(index, 1);
    return true;
  }
  return false;
}
function extend(namespace) {
  const newDebugger = createDebugger(`${this.namespace}:${namespace}`);
  newDebugger.log = this.log;
  return newDebugger;
}
var debug_default = debugObj;

// node_modules/@typespec/ts-http-runtime/dist/esm/logger/logger.js
var TYPESPEC_RUNTIME_LOG_LEVELS = ["verbose", "info", "warning", "error"];
var levelMap = {
  verbose: 400,
  info: 300,
  warning: 200,
  error: 100
};
function patchLogMethod(parent, child) {
  child.log = (...args) => {
    parent.log(...args);
  };
}
function isTypeSpecRuntimeLogLevel(level) {
  return TYPESPEC_RUNTIME_LOG_LEVELS.includes(level);
}
function createLoggerContext(options) {
  const registeredLoggers = /* @__PURE__ */ new Set();
  const logLevelFromEnv = getEnvironmentVariable(options.logLevelEnvVarName);
  let logLevel;
  const clientLogger = debug_default(options.namespace);
  clientLogger.log = (...args) => {
    debug_default.log(...args);
  };
  function contextSetLogLevel(level) {
    if (level && !isTypeSpecRuntimeLogLevel(level)) {
      throw new Error(`Unknown log level '${level}'. Acceptable values: ${TYPESPEC_RUNTIME_LOG_LEVELS.join(",")}`);
    }
    logLevel = level;
    const enabledNamespaces2 = [];
    for (const logger4 of registeredLoggers) {
      if (shouldEnable(logger4)) {
        enabledNamespaces2.push(logger4.namespace);
      }
    }
    debug_default.enable(enabledNamespaces2.join(","));
  }
  if (logLevelFromEnv) {
    if (isTypeSpecRuntimeLogLevel(logLevelFromEnv)) {
      contextSetLogLevel(logLevelFromEnv);
    } else {
      console.error(`${options.logLevelEnvVarName} set to unknown log level '${logLevelFromEnv}'; logging is not enabled. Acceptable values: ${TYPESPEC_RUNTIME_LOG_LEVELS.join(", ")}.`);
    }
  }
  function shouldEnable(logger4) {
    return Boolean(logLevel && levelMap[logger4.level] <= levelMap[logLevel]);
  }
  function createLogger(parent, level) {
    const logger4 = Object.assign(parent.extend(level), {
      level
    });
    patchLogMethod(parent, logger4);
    if (shouldEnable(logger4)) {
      const enabledNamespaces2 = debug_default.disable();
      debug_default.enable(enabledNamespaces2 + "," + logger4.namespace);
    }
    registeredLoggers.add(logger4);
    return logger4;
  }
  function contextGetLogLevel() {
    return logLevel;
  }
  function contextCreateClientLogger(namespace) {
    const clientRootLogger = clientLogger.extend(namespace);
    patchLogMethod(clientLogger, clientRootLogger);
    return {
      error: createLogger(clientRootLogger, "error"),
      warning: createLogger(clientRootLogger, "warning"),
      info: createLogger(clientRootLogger, "info"),
      verbose: createLogger(clientRootLogger, "verbose")
    };
  }
  return {
    setLogLevel: contextSetLogLevel,
    getLogLevel: contextGetLogLevel,
    createClientLogger: contextCreateClientLogger,
    logger: clientLogger
  };
}
var context = createLoggerContext({
  logLevelEnvVarName: "TYPESPEC_RUNTIME_LOG_LEVEL",
  namespace: "typeSpecRuntime"
});
var TypeSpecRuntimeLogger = context.logger;
function createClientLogger(namespace) {
  return context.createClientLogger(namespace);
}

// node_modules/@azure/logger/dist/esm/index.js
var context2 = createLoggerContext({
  logLevelEnvVarName: "AZURE_LOG_LEVEL",
  namespace: "azure"
});
var AzureLogger = context2.logger;
function createClientLogger2(namespace) {
  return context2.createClientLogger(namespace);
}

// node_modules/@azure/monitor-query-logs/dist/esm/logger.js
var logger = createClientLogger2("monitor-query-logs");

// node_modules/@typespec/ts-http-runtime/dist/esm/abort-controller/AbortError.js
var AbortError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AbortError";
  }
};

// node_modules/@typespec/ts-http-runtime/dist/esm/httpHeaders.js
function normalizeName(name) {
  return name.toLowerCase();
}
function normalizeValue(value) {
  return String(value).trim().replace(/[\r\n]/g, "");
}
function* headerIterator(map) {
  for (const entry of map.values()) {
    yield [entry.name, entry.value];
  }
}
var HttpHeadersImpl = class {
  _headersMap;
  constructor(rawHeaders) {
    this._headersMap = /* @__PURE__ */ new Map();
    if (rawHeaders) {
      for (const headerName of Object.keys(rawHeaders)) {
        this.set(headerName, rawHeaders[headerName]);
      }
    }
  }
  /**
   * Set a header in this collection with the provided name and value. The name is
   * case-insensitive.
   * @param name - The name of the header to set. This value is case-insensitive.
   * @param value - The value of the header to set.
   */
  set(name, value) {
    this._headersMap.set(normalizeName(name), { name, value: normalizeValue(value) });
  }
  /**
   * Get the header value for the provided header name, or undefined if no header exists in this
   * collection with the provided name.
   * @param name - The name of the header. This value is case-insensitive.
   */
  get(name) {
    return this._headersMap.get(normalizeName(name))?.value;
  }
  /**
   * Get whether or not this header collection contains a header entry for the provided header name.
   * @param name - The name of the header to set. This value is case-insensitive.
   */
  has(name) {
    return this._headersMap.has(normalizeName(name));
  }
  /**
   * Remove the header with the provided headerName.
   * @param name - The name of the header to remove.
   */
  delete(name) {
    this._headersMap.delete(normalizeName(name));
  }
  /**
   * Get the JSON object representation of this HTTP header collection.
   */
  toJSON(options = {}) {
    const result = {};
    if (options.preserveCase) {
      for (const entry of this._headersMap.values()) {
        result[entry.name] = entry.value;
      }
    } else {
      for (const [normalizedName, entry] of this._headersMap) {
        result[normalizedName] = entry.value;
      }
    }
    return result;
  }
  /**
   * Get the string representation of this HTTP header collection.
   */
  toString() {
    return JSON.stringify(this.toJSON({ preserveCase: true }));
  }
  /**
   * Iterate over tuples of header [name, value] pairs.
   */
  [Symbol.iterator]() {
    return headerIterator(this._headersMap);
  }
};
function createHttpHeaders(rawHeaders) {
  return new HttpHeadersImpl(rawHeaders);
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/uuidUtils.js
function randomUUID() {
  return globalThis.crypto.randomUUID();
}

// node_modules/@typespec/ts-http-runtime/dist/esm/pipelineRequest.js
var PipelineRequestImpl = class {
  url;
  method;
  headers;
  timeout;
  withCredentials;
  body;
  multipartBody;
  formData;
  streamResponseStatusCodes;
  enableBrowserStreams;
  proxySettings;
  disableKeepAlive;
  abortSignal;
  requestId;
  allowInsecureConnection;
  onUploadProgress;
  onDownloadProgress;
  requestOverrides;
  authSchemes;
  constructor(options) {
    this.url = options.url;
    this.body = options.body;
    this.headers = options.headers ?? createHttpHeaders();
    this.method = options.method ?? "GET";
    this.timeout = options.timeout ?? 0;
    this.multipartBody = options.multipartBody;
    this.formData = options.formData;
    this.disableKeepAlive = options.disableKeepAlive ?? false;
    this.proxySettings = options.proxySettings;
    this.streamResponseStatusCodes = options.streamResponseStatusCodes;
    this.withCredentials = options.withCredentials ?? false;
    this.abortSignal = options.abortSignal;
    this.onUploadProgress = options.onUploadProgress;
    this.onDownloadProgress = options.onDownloadProgress;
    this.requestId = options.requestId || randomUUID();
    this.allowInsecureConnection = options.allowInsecureConnection ?? false;
    this.enableBrowserStreams = options.enableBrowserStreams ?? false;
    this.requestOverrides = options.requestOverrides;
    this.authSchemes = options.authSchemes;
  }
};
function createPipelineRequest(options) {
  return new PipelineRequestImpl(options);
}

// node_modules/@typespec/ts-http-runtime/dist/esm/pipeline.js
var ValidPhaseNames = /* @__PURE__ */ new Set(["Deserialize", "Serialize", "Retry", "Sign"]);
var HttpPipeline = class _HttpPipeline {
  _policies = [];
  _orderedPolicies;
  constructor(policies) {
    this._policies = policies?.slice(0) ?? [];
    this._orderedPolicies = void 0;
  }
  addPolicy(policy, options = {}) {
    if (options.phase && options.afterPhase) {
      throw new Error("Policies inside a phase cannot specify afterPhase.");
    }
    if (options.phase && !ValidPhaseNames.has(options.phase)) {
      throw new Error(`Invalid phase name: ${options.phase}`);
    }
    if (options.afterPhase && !ValidPhaseNames.has(options.afterPhase)) {
      throw new Error(`Invalid afterPhase name: ${options.afterPhase}`);
    }
    this._policies.push({
      policy,
      options
    });
    this._orderedPolicies = void 0;
  }
  removePolicy(options) {
    const removedPolicies = [];
    this._policies = this._policies.filter((policyDescriptor) => {
      if (options.name && policyDescriptor.policy.name === options.name || options.phase && policyDescriptor.options.phase === options.phase) {
        removedPolicies.push(policyDescriptor.policy);
        return false;
      } else {
        return true;
      }
    });
    this._orderedPolicies = void 0;
    return removedPolicies;
  }
  sendRequest(httpClient, request) {
    const policies = this.getOrderedPolicies();
    const pipeline = policies.reduceRight((next, policy) => {
      return (req) => {
        return policy.sendRequest(req, next);
      };
    }, (req) => httpClient.sendRequest(req));
    return pipeline(request);
  }
  getOrderedPolicies() {
    if (!this._orderedPolicies) {
      this._orderedPolicies = this.orderPolicies();
    }
    return this._orderedPolicies;
  }
  clone() {
    return new _HttpPipeline(this._policies);
  }
  static create() {
    return new _HttpPipeline();
  }
  orderPolicies() {
    const result = [];
    const policyMap = /* @__PURE__ */ new Map();
    function createPhase(name) {
      return {
        name,
        policies: /* @__PURE__ */ new Set(),
        hasRun: false,
        hasAfterPolicies: false
      };
    }
    const serializePhase = createPhase("Serialize");
    const noPhase = createPhase("None");
    const deserializePhase = createPhase("Deserialize");
    const retryPhase = createPhase("Retry");
    const signPhase = createPhase("Sign");
    const orderedPhases = [serializePhase, noPhase, deserializePhase, retryPhase, signPhase];
    function getPhase(phase) {
      if (phase === "Retry") {
        return retryPhase;
      } else if (phase === "Serialize") {
        return serializePhase;
      } else if (phase === "Deserialize") {
        return deserializePhase;
      } else if (phase === "Sign") {
        return signPhase;
      } else {
        return noPhase;
      }
    }
    for (const descriptor of this._policies) {
      const policy = descriptor.policy;
      const options = descriptor.options;
      const policyName = policy.name;
      if (policyMap.has(policyName)) {
        throw new Error("Duplicate policy names not allowed in pipeline");
      }
      const node = {
        policy,
        dependsOn: /* @__PURE__ */ new Set(),
        dependants: /* @__PURE__ */ new Set()
      };
      if (options.afterPhase) {
        node.afterPhase = getPhase(options.afterPhase);
        node.afterPhase.hasAfterPolicies = true;
      }
      policyMap.set(policyName, node);
      const phase = getPhase(options.phase);
      phase.policies.add(node);
    }
    for (const descriptor of this._policies) {
      const { policy, options } = descriptor;
      const policyName = policy.name;
      const node = policyMap.get(policyName);
      if (!node) {
        throw new Error(`Missing node for policy ${policyName}`);
      }
      if (options.afterPolicies) {
        for (const afterPolicyName of options.afterPolicies) {
          const afterNode = policyMap.get(afterPolicyName);
          if (afterNode) {
            node.dependsOn.add(afterNode);
            afterNode.dependants.add(node);
          }
        }
      }
      if (options.beforePolicies) {
        for (const beforePolicyName of options.beforePolicies) {
          const beforeNode = policyMap.get(beforePolicyName);
          if (beforeNode) {
            beforeNode.dependsOn.add(node);
            node.dependants.add(beforeNode);
          }
        }
      }
    }
    function walkPhase(phase) {
      phase.hasRun = true;
      for (const node of phase.policies) {
        if (node.afterPhase && (!node.afterPhase.hasRun || node.afterPhase.policies.size)) {
          continue;
        }
        if (node.dependsOn.size === 0) {
          result.push(node.policy);
          for (const dependant of node.dependants) {
            dependant.dependsOn.delete(node);
          }
          policyMap.delete(node.policy.name);
          phase.policies.delete(node);
        }
      }
    }
    function walkPhases() {
      for (const phase of orderedPhases) {
        walkPhase(phase);
        if (phase.policies.size > 0 && phase !== noPhase) {
          if (!noPhase.hasRun) {
            walkPhase(noPhase);
          }
          return;
        }
        if (phase.hasAfterPolicies) {
          walkPhase(noPhase);
        }
      }
    }
    let iteration = 0;
    while (policyMap.size > 0) {
      iteration++;
      const initialResultLength = result.length;
      walkPhases();
      if (result.length <= initialResultLength && iteration > 1) {
        throw new Error("Cannot satisfy policy dependencies due to requirements cycle.");
      }
    }
    return result;
  }
};
function createEmptyPipeline() {
  return HttpPipeline.create();
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/object.js
function isObject(input) {
  return typeof input === "object" && input !== null && !Array.isArray(input) && !(input instanceof RegExp) && !(input instanceof Date);
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/error.js
function isError(e) {
  if (isObject(e)) {
    const hasName = typeof e.name === "string";
    const hasMessage = typeof e.message === "string";
    return hasName && hasMessage;
  }
  return false;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/inspect.js
import { inspect } from "node:util";
var custom = inspect.custom;

// node_modules/@typespec/ts-http-runtime/dist/esm/util/sanitizer.js
var RedactedString = "REDACTED";
var defaultAllowedHeaderNames = [
  "x-ms-client-request-id",
  "x-ms-return-client-request-id",
  "x-ms-useragent",
  "x-ms-correlation-request-id",
  "x-ms-request-id",
  "client-request-id",
  "ms-cv",
  "return-client-request-id",
  "traceparent",
  "Access-Control-Allow-Credentials",
  "Access-Control-Allow-Headers",
  "Access-Control-Allow-Methods",
  "Access-Control-Allow-Origin",
  "Access-Control-Expose-Headers",
  "Access-Control-Max-Age",
  "Access-Control-Request-Headers",
  "Access-Control-Request-Method",
  "Origin",
  "Accept",
  "Accept-Encoding",
  "Cache-Control",
  "Connection",
  "Content-Length",
  "Content-Type",
  "Date",
  "ETag",
  "Expires",
  "If-Match",
  "If-Modified-Since",
  "If-None-Match",
  "If-Unmodified-Since",
  "Last-Modified",
  "Pragma",
  "Request-Id",
  "Retry-After",
  "Server",
  "Transfer-Encoding",
  "User-Agent",
  "WWW-Authenticate"
];
var defaultAllowedQueryParameters = ["api-version"];
var Sanitizer = class {
  allowedHeaderNames;
  allowedQueryParameters;
  constructor({ additionalAllowedHeaderNames: allowedHeaderNames = [], additionalAllowedQueryParameters: allowedQueryParameters = [] } = {}) {
    allowedHeaderNames = defaultAllowedHeaderNames.concat(allowedHeaderNames);
    allowedQueryParameters = defaultAllowedQueryParameters.concat(allowedQueryParameters);
    this.allowedHeaderNames = new Set(allowedHeaderNames.map((n) => n.toLowerCase()));
    this.allowedQueryParameters = new Set(allowedQueryParameters.map((p) => p.toLowerCase()));
  }
  /**
   * Sanitizes an object for logging.
   * @param obj - The object to sanitize
   * @returns - The sanitized object as a string
   */
  sanitize(obj) {
    const seen = /* @__PURE__ */ new Set();
    return JSON.stringify(obj, (key, value) => {
      if (value instanceof Error) {
        return {
          ...value,
          name: value.name,
          message: value.message
        };
      }
      if (key === "headers" && isObject(value)) {
        return this.sanitizeHeaders(value);
      } else if (key === "url" && typeof value === "string") {
        return this.sanitizeUrl(value);
      } else if (key === "query" && isObject(value)) {
        return this.sanitizeQuery(value);
      } else if (key === "body") {
        return void 0;
      } else if (key === "response") {
        return void 0;
      } else if (key === "operationSpec") {
        return void 0;
      } else if (Array.isArray(value) || isObject(value)) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    }, 2);
  }
  /**
   * Sanitizes a URL for logging.
   * @param value - The URL to sanitize
   * @returns - The sanitized URL as a string
   */
  sanitizeUrl(value) {
    if (typeof value !== "string" || value === null || value === "") {
      return value;
    }
    const url = new URL(value);
    if (!url.search) {
      return value;
    }
    for (const [key] of url.searchParams) {
      if (!this.allowedQueryParameters.has(key.toLowerCase())) {
        url.searchParams.set(key, RedactedString);
      }
    }
    return url.toString();
  }
  sanitizeHeaders(obj) {
    const sanitized = {};
    for (const key of Object.keys(obj)) {
      if (this.allowedHeaderNames.has(key.toLowerCase())) {
        sanitized[key] = obj[key];
      } else {
        sanitized[key] = RedactedString;
      }
    }
    return sanitized;
  }
  sanitizeQuery(value) {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    const sanitized = {};
    for (const k of Object.keys(value)) {
      if (this.allowedQueryParameters.has(k.toLowerCase())) {
        sanitized[k] = value[k];
      } else {
        sanitized[k] = RedactedString;
      }
    }
    return sanitized;
  }
};

// node_modules/@typespec/ts-http-runtime/dist/esm/restError.js
var errorSanitizer = new Sanitizer();
var RestError = class _RestError extends Error {
  /**
   * Something went wrong when making the request.
   * This means the actual request failed for some reason,
   * such as a DNS issue or the connection being lost.
   */
  static REQUEST_SEND_ERROR = "REQUEST_SEND_ERROR";
  /**
   * This means that parsing the response from the server failed.
   * It may have been malformed.
   */
  static PARSE_ERROR = "PARSE_ERROR";
  /**
   * The code of the error itself (use statics on RestError if possible.)
   */
  code;
  /**
   * The HTTP status code of the request (if applicable.)
   */
  statusCode;
  /**
   * The request that was made.
   * This property is non-enumerable.
   */
  request;
  /**
   * The response received (if any.)
   * This property is non-enumerable.
   */
  response;
  /**
   * Bonus property set by the throw site.
   */
  details;
  constructor(message, options = {}) {
    super(message);
    this.name = "RestError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    Object.defineProperty(this, "request", { value: options.request, enumerable: false });
    Object.defineProperty(this, "response", { value: options.response, enumerable: false });
    const agent = this.request?.agent ? {
      maxFreeSockets: this.request.agent.maxFreeSockets,
      maxSockets: this.request.agent.maxSockets
    } : void 0;
    Object.defineProperty(this, custom, {
      value: () => {
        return `RestError: ${this.message} 
 ${errorSanitizer.sanitize({
          ...this,
          request: { ...this.request, agent },
          response: this.response
        })}`;
      },
      enumerable: false
    });
    Object.setPrototypeOf(this, _RestError.prototype);
  }
};
function isRestError(e) {
  if (e instanceof RestError) {
    return true;
  }
  return isError(e) && e.name === "RestError";
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/bytesEncoding.js
function uint8ArrayToString(bytes, format) {
  return Buffer.from(bytes).toString(format);
}
function stringToUint8Array(value, format) {
  return Buffer.from(value, format);
}

// node_modules/@typespec/ts-http-runtime/dist/esm/nodeHttpClient.js
import http from "node:http";
import https from "node:https";
import zlib from "node:zlib";
import { Transform } from "node:stream";

// node_modules/@typespec/ts-http-runtime/dist/esm/log.js
var logger2 = createClientLogger("ts-http-runtime");

// node_modules/@typespec/ts-http-runtime/dist/esm/nodeHttpClient.js
var DEFAULT_TLS_SETTINGS = {};
function isReadableStream(body) {
  return body && typeof body.pipe === "function";
}
function isStreamComplete(stream) {
  if (stream.readable === false) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const handler = () => {
      resolve();
      stream.removeListener("close", handler);
      stream.removeListener("end", handler);
      stream.removeListener("error", handler);
    };
    stream.on("close", handler);
    stream.on("end", handler);
    stream.on("error", handler);
  });
}
function isArrayBuffer(body) {
  return body && typeof body.byteLength === "number";
}
var ReportTransform = class extends Transform {
  loadedBytes = 0;
  progressCallback;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  _transform(chunk, _encoding, callback) {
    this.push(chunk);
    this.loadedBytes += chunk.length;
    try {
      this.progressCallback({ loadedBytes: this.loadedBytes });
      callback();
    } catch (e) {
      callback(e);
    }
  }
  constructor(progressCallback) {
    super();
    this.progressCallback = progressCallback;
  }
};
var NodeHttpClient = class {
  cachedHttpAgent;
  cachedHttpsAgents = /* @__PURE__ */ new WeakMap();
  /**
   * Makes a request over an underlying transport layer and returns the response.
   * @param request - The request to be made.
   */
  async sendRequest(request) {
    const abortController = new AbortController();
    let abortListener;
    if (request.abortSignal) {
      if (request.abortSignal.aborted) {
        throw new AbortError("The operation was aborted. Request has already been canceled.");
      }
      abortListener = (event) => {
        if (event.type === "abort") {
          abortController.abort();
        }
      };
      request.abortSignal.addEventListener("abort", abortListener);
    }
    let timeoutId;
    if (request.timeout > 0) {
      timeoutId = setTimeout(() => {
        const sanitizer = new Sanitizer();
        logger2.info(`request to '${sanitizer.sanitizeUrl(request.url)}' timed out. canceling...`);
        abortController.abort();
      }, request.timeout);
    }
    const acceptEncoding = request.headers.get("Accept-Encoding");
    const shouldDecompress = acceptEncoding?.includes("gzip") || acceptEncoding?.includes("deflate");
    let body = typeof request.body === "function" ? request.body() : request.body;
    if (body && !request.headers.has("Content-Length")) {
      const bodyLength = getBodyLength(body);
      if (bodyLength !== null) {
        request.headers.set("Content-Length", bodyLength);
      }
    }
    let responseStream;
    try {
      if (body && request.onUploadProgress) {
        const onUploadProgress = request.onUploadProgress;
        const uploadReportStream = new ReportTransform(onUploadProgress);
        uploadReportStream.on("error", (e) => {
          logger2.error("Error in upload progress", e);
        });
        if (isReadableStream(body)) {
          body.pipe(uploadReportStream);
        } else {
          uploadReportStream.end(body);
        }
        body = uploadReportStream;
      }
      const res = await this.makeRequest(request, abortController, body);
      const headers = getResponseHeaders(res);
      const status = res.statusCode ?? 0;
      const response = {
        status,
        headers,
        request
      };
      if (request.method === "HEAD") {
        res.resume();
        return response;
      }
      responseStream = shouldDecompress ? getDecodedResponseStream(res, headers) : res;
      const onDownloadProgress = request.onDownloadProgress;
      if (onDownloadProgress) {
        const downloadReportStream = new ReportTransform(onDownloadProgress);
        downloadReportStream.on("error", (e) => {
          logger2.error("Error in download progress", e);
        });
        responseStream.pipe(downloadReportStream);
        responseStream = downloadReportStream;
      }
      if (
        // Value of POSITIVE_INFINITY in streamResponseStatusCodes is considered as any status code
        request.streamResponseStatusCodes?.has(Number.POSITIVE_INFINITY) || request.streamResponseStatusCodes?.has(response.status)
      ) {
        response.readableStreamBody = responseStream;
      } else {
        response.bodyAsText = await streamToText(responseStream);
      }
      return response;
    } finally {
      if (timeoutId !== void 0) {
        clearTimeout(timeoutId);
      }
      if (request.abortSignal && abortListener) {
        let uploadStreamDone = Promise.resolve();
        if (isReadableStream(body)) {
          uploadStreamDone = isStreamComplete(body);
        }
        let downloadStreamDone = Promise.resolve();
        if (isReadableStream(responseStream)) {
          downloadStreamDone = isStreamComplete(responseStream);
        }
        Promise.all([uploadStreamDone, downloadStreamDone]).then(() => {
          if (abortListener) {
            request.abortSignal?.removeEventListener("abort", abortListener);
          }
        }).catch((e) => {
          logger2.warning("Error when cleaning up abortListener on httpRequest", e);
        });
      }
    }
  }
  makeRequest(request, abortController, body) {
    const url = new URL(request.url);
    const isInsecure = url.protocol !== "https:";
    if (isInsecure && !request.allowInsecureConnection) {
      throw new Error(`Cannot connect to ${request.url} while allowInsecureConnection is false.`);
    }
    const agent = request.agent ?? this.getOrCreateAgent(request, isInsecure);
    const options = {
      agent,
      hostname: url.hostname,
      path: `${url.pathname}${url.search}`,
      port: url.port,
      method: request.method,
      headers: request.headers.toJSON({ preserveCase: true }),
      ...request.requestOverrides
    };
    return new Promise((resolve, reject) => {
      const req = isInsecure ? http.request(options, resolve) : https.request(options, resolve);
      req.once("error", (err) => {
        reject(new RestError(err.message, { code: err.code ?? RestError.REQUEST_SEND_ERROR, request }));
      });
      abortController.signal.addEventListener("abort", () => {
        const abortError = new AbortError("The operation was aborted. Rejecting from abort signal callback while making request.");
        req.destroy(abortError);
        reject(abortError);
      });
      if (body && isReadableStream(body)) {
        body.pipe(req);
      } else if (body) {
        if (typeof body === "string" || Buffer.isBuffer(body)) {
          req.end(body);
        } else if (isArrayBuffer(body)) {
          req.end(ArrayBuffer.isView(body) ? Buffer.from(body.buffer, body.byteOffset, body.byteLength) : Buffer.from(body));
        } else {
          logger2.error("Unrecognized body type", body);
          reject(new RestError("Unrecognized body type"));
        }
      } else {
        req.end();
      }
    });
  }
  getOrCreateAgent(request, isInsecure) {
    const disableKeepAlive = request.disableKeepAlive;
    if (isInsecure) {
      if (disableKeepAlive) {
        return http.globalAgent;
      }
      if (!this.cachedHttpAgent) {
        this.cachedHttpAgent = new http.Agent({ keepAlive: true });
      }
      return this.cachedHttpAgent;
    } else {
      if (disableKeepAlive && !request.tlsSettings) {
        return https.globalAgent;
      }
      const tlsSettings = request.tlsSettings ?? DEFAULT_TLS_SETTINGS;
      let agent = this.cachedHttpsAgents.get(tlsSettings);
      if (agent && agent.options.keepAlive === !disableKeepAlive) {
        return agent;
      }
      logger2.info("No cached TLS Agent exist, creating a new Agent");
      agent = new https.Agent({
        // keepAlive is true if disableKeepAlive is false.
        keepAlive: !disableKeepAlive,
        // Since we are spreading, if no tslSettings were provided, nothing is added to the agent options.
        ...tlsSettings
      });
      this.cachedHttpsAgents.set(tlsSettings, agent);
      return agent;
    }
  }
};
function getResponseHeaders(res) {
  const headers = createHttpHeaders();
  for (const header of Object.keys(res.headers)) {
    const value = res.headers[header];
    if (Array.isArray(value)) {
      if (value.length > 0) {
        headers.set(header, value[0]);
      }
    } else if (value) {
      headers.set(header, value);
    }
  }
  return headers;
}
function getDecodedResponseStream(stream, headers) {
  const contentEncoding = headers.get("Content-Encoding");
  if (contentEncoding === "gzip") {
    const unzip = zlib.createGunzip();
    stream.pipe(unzip);
    return unzip;
  } else if (contentEncoding === "deflate") {
    const inflate = zlib.createInflate();
    stream.pipe(inflate);
    return inflate;
  }
  return stream;
}
function streamToText(stream) {
  return new Promise((resolve, reject) => {
    const buffer = [];
    stream.on("data", (chunk) => {
      if (Buffer.isBuffer(chunk)) {
        buffer.push(chunk);
      } else {
        buffer.push(Buffer.from(chunk));
      }
    });
    stream.on("end", () => {
      resolve(Buffer.concat(buffer).toString("utf8"));
    });
    stream.on("error", (e) => {
      if (e && e?.name === "AbortError") {
        reject(e);
      } else {
        reject(new RestError(`Error reading response as text: ${e.message}`, {
          code: RestError.PARSE_ERROR
        }));
      }
    });
  });
}
function getBodyLength(body) {
  if (!body) {
    return 0;
  } else if (Buffer.isBuffer(body)) {
    return body.length;
  } else if (isReadableStream(body)) {
    return null;
  } else if (isArrayBuffer(body)) {
    return body.byteLength;
  } else if (typeof body === "string") {
    return Buffer.from(body).length;
  } else {
    return null;
  }
}
function createNodeHttpClient() {
  return new NodeHttpClient();
}

// node_modules/@typespec/ts-http-runtime/dist/esm/defaultHttpClient.js
function createDefaultHttpClient() {
  return createNodeHttpClient();
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/logPolicy.js
var logPolicyName = "logPolicy";
function logPolicy(options = {}) {
  const logger4 = options.logger ?? logger2.info;
  const sanitizer = new Sanitizer({
    additionalAllowedHeaderNames: options.additionalAllowedHeaderNames,
    additionalAllowedQueryParameters: options.additionalAllowedQueryParameters
  });
  return {
    name: logPolicyName,
    async sendRequest(request, next) {
      if (!logger4.enabled) {
        return next(request);
      }
      logger4(`Request: ${sanitizer.sanitize(request)}`);
      const response = await next(request);
      logger4(`Response status code: ${response.status}`);
      logger4(`Headers: ${sanitizer.sanitize({ headers: response.headers })}`);
      return response;
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/userAgentPlatform.js
import os from "node:os";
import process4 from "node:process";
function getHeaderName() {
  return "User-Agent";
}
async function setPlatformSpecificData(map) {
  if (process4 && process4.versions) {
    const osInfo = `${os.type()} ${os.release()}; ${os.arch()}`;
    if (process4.versions.bun) {
      map.set("Bun", `${process4.versions.bun} (${osInfo})`);
    } else if (process4.versions.deno) {
      map.set("Deno", `${process4.versions.deno} (${osInfo})`);
    } else if (process4.versions.node) {
      map.set("Node", `${process4.versions.node} (${osInfo})`);
    }
  }
}

// node_modules/@typespec/ts-http-runtime/dist/esm/constants.js
var SDK_VERSION = "0.3.9";
var DEFAULT_RETRY_POLICY_COUNT = 3;

// node_modules/@typespec/ts-http-runtime/dist/esm/util/userAgent.js
function getUserAgentString(telemetryInfo) {
  const parts = [];
  for (const [key, value] of telemetryInfo) {
    const token = value ? `${key}/${value}` : key;
    parts.push(token);
  }
  return parts.join(" ");
}
function getUserAgentHeaderName() {
  return getHeaderName();
}
async function getUserAgentValue(prefix) {
  const runtimeInfo = /* @__PURE__ */ new Map();
  runtimeInfo.set("ts-http-runtime", SDK_VERSION);
  await setPlatformSpecificData(runtimeInfo);
  const defaultAgent = getUserAgentString(runtimeInfo);
  const userAgentValue = prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
  return userAgentValue;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/userAgentPolicy.js
var UserAgentHeaderName = getUserAgentHeaderName();
var userAgentPolicyName = "userAgentPolicy";
function userAgentPolicy(options = {}) {
  const userAgentValue = getUserAgentValue(options.userAgentPrefix);
  return {
    name: userAgentPolicyName,
    async sendRequest(request, next) {
      if (!request.headers.has(UserAgentHeaderName)) {
        request.headers.set(UserAgentHeaderName, await userAgentValue);
      }
      return next(request);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/random.js
function getRandomIntegerInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const offset = Math.floor(Math.random() * (max - min + 1));
  return offset + min;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/delay.js
function calculateRetryDelay(retryAttempt, config) {
  const exponentialDelay = config.retryDelayInMs * Math.pow(2, retryAttempt);
  const clampedDelay = Math.min(config.maxRetryDelayInMs, exponentialDelay);
  const retryAfterInMs = clampedDelay / 2 + getRandomIntegerInclusive(0, clampedDelay / 2);
  return { retryAfterInMs };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/helpers.js
var StandardAbortMessage = "The operation was aborted.";
function delay(delayInMs, value, options) {
  return new Promise((resolve, reject) => {
    let timer = void 0;
    let onAborted = void 0;
    const rejectOnAbort = () => {
      return reject(new AbortError(options?.abortErrorMsg ? options?.abortErrorMsg : StandardAbortMessage));
    };
    const removeListeners = () => {
      if (options?.abortSignal && onAborted) {
        options.abortSignal.removeEventListener("abort", onAborted);
      }
    };
    onAborted = () => {
      if (timer) {
        clearTimeout(timer);
      }
      removeListeners();
      return rejectOnAbort();
    };
    if (options?.abortSignal && options.abortSignal.aborted) {
      return rejectOnAbort();
    }
    timer = setTimeout(() => {
      removeListeners();
      resolve(value);
    }, delayInMs);
    if (options?.abortSignal) {
      options.abortSignal.addEventListener("abort", onAborted);
    }
  });
}
function parseHeaderValueAsNumber(response, headerName) {
  const value = response.headers.get(headerName);
  if (!value)
    return;
  const valueAsNum = Number(value);
  if (Number.isNaN(valueAsNum))
    return;
  return valueAsNum;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/retryStrategies/throttlingRetryStrategy.js
var RetryAfterHeader = "Retry-After";
var AllRetryAfterHeaders = ["retry-after-ms", "x-ms-retry-after-ms", RetryAfterHeader];
function getRetryAfterInMs(response) {
  if (!(response && [429, 503].includes(response.status)))
    return void 0;
  try {
    for (const header of AllRetryAfterHeaders) {
      const retryAfterValue = parseHeaderValueAsNumber(response, header);
      if (retryAfterValue === 0 || retryAfterValue) {
        const multiplyingFactor = header === RetryAfterHeader ? 1e3 : 1;
        return retryAfterValue * multiplyingFactor;
      }
    }
    const retryAfterHeader = response.headers.get(RetryAfterHeader);
    if (!retryAfterHeader)
      return;
    const date = Date.parse(retryAfterHeader);
    const diff = date - Date.now();
    return Number.isFinite(diff) ? Math.max(0, diff) : void 0;
  } catch {
    return void 0;
  }
}
function isThrottlingRetryResponse(response) {
  return Number.isFinite(getRetryAfterInMs(response));
}
function throttlingRetryStrategy() {
  return {
    name: "throttlingRetryStrategy",
    retry({ response }) {
      const retryAfterInMs = getRetryAfterInMs(response);
      if (!Number.isFinite(retryAfterInMs)) {
        return { skipStrategy: true };
      }
      return {
        retryAfterInMs
      };
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/retryStrategies/exponentialRetryStrategy.js
var DEFAULT_CLIENT_RETRY_INTERVAL = 1e3;
var DEFAULT_CLIENT_MAX_RETRY_INTERVAL = 1e3 * 64;
function exponentialRetryStrategy(options = {}) {
  const retryInterval = options.retryDelayInMs ?? DEFAULT_CLIENT_RETRY_INTERVAL;
  const maxRetryInterval = options.maxRetryDelayInMs ?? DEFAULT_CLIENT_MAX_RETRY_INTERVAL;
  return {
    name: "exponentialRetryStrategy",
    retry({ retryCount, response, responseError }) {
      const matchedSystemError = isSystemError(responseError);
      const ignoreSystemErrors = matchedSystemError && options.ignoreSystemErrors;
      const isExponential = isExponentialRetryResponse(response);
      const ignoreExponentialResponse = isExponential && options.ignoreHttpStatusCodes;
      const unknownResponse = response && (isThrottlingRetryResponse(response) || !isExponential);
      if (unknownResponse || ignoreExponentialResponse || ignoreSystemErrors) {
        return { skipStrategy: true };
      }
      if (responseError && !matchedSystemError && !isExponential) {
        return { errorToThrow: responseError };
      }
      return calculateRetryDelay(retryCount, {
        retryDelayInMs: retryInterval,
        maxRetryDelayInMs: maxRetryInterval
      });
    }
  };
}
function isExponentialRetryResponse(response) {
  return Boolean(response && response.status !== void 0 && (response.status >= 500 || response.status === 408) && response.status !== 501 && response.status !== 505);
}
function isSystemError(err) {
  if (!err) {
    return false;
  }
  return err.code === "ETIMEDOUT" || err.code === "ESOCKETTIMEDOUT" || err.code === "ECONNREFUSED" || err.code === "ECONNRESET" || err.code === "ENOENT" || err.code === "ENOTFOUND";
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/retryPolicy.js
var retryPolicyLogger = createClientLogger("ts-http-runtime retryPolicy");
var retryPolicyName = "retryPolicy";
function retryPolicy(strategies, options = { maxRetries: DEFAULT_RETRY_POLICY_COUNT }) {
  const logger4 = options.logger || retryPolicyLogger;
  return {
    name: retryPolicyName,
    async sendRequest(request, next) {
      let response;
      let responseError;
      let retryCount = -1;
      retryRequest: while (true) {
        retryCount += 1;
        responseError = void 0;
        try {
          logger4.info(`Retry ${retryCount}: Attempting to send request`, request.requestId);
          response = await next(request);
          logger4.info(`Retry ${retryCount}: Received a response from request`, request.requestId);
        } catch (e) {
          logger4.error(`Retry ${retryCount}: Received an error from request`, request.requestId);
          if (!isRestError(e)) {
            throw e;
          }
          responseError = e;
          response = e.response;
        }
        if (request.abortSignal?.aborted) {
          logger4.error(`Retry ${retryCount}: Request aborted.`);
          const abortError = new AbortError();
          throw abortError;
        }
        if (retryCount >= (options.maxRetries ?? DEFAULT_RETRY_POLICY_COUNT)) {
          logger4.info(`Retry ${retryCount}: Maximum retries reached. Returning the last received response, or throwing the last received error.`);
          if (responseError) {
            throw responseError;
          } else if (response) {
            return response;
          } else {
            throw new Error("Maximum retries reached with no response or error to throw");
          }
        }
        logger4.info(`Retry ${retryCount}: Processing ${strategies.length} retry strategies.`);
        strategiesLoop: for (const strategy of strategies) {
          const strategyLogger = strategy.logger || logger4;
          strategyLogger.info(`Retry ${retryCount}: Processing retry strategy ${strategy.name}.`);
          const modifiers = strategy.retry({
            retryCount,
            response,
            responseError
          });
          if (modifiers.skipStrategy) {
            strategyLogger.info(`Retry ${retryCount}: Skipped.`);
            continue strategiesLoop;
          }
          const { errorToThrow, retryAfterInMs, redirectTo } = modifiers;
          if (errorToThrow) {
            strategyLogger.error(`Retry ${retryCount}: Retry strategy ${strategy.name} throws error:`, errorToThrow);
            throw errorToThrow;
          }
          if (retryAfterInMs || retryAfterInMs === 0) {
            strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} retries after ${retryAfterInMs}`);
            await delay(retryAfterInMs, void 0, { abortSignal: request.abortSignal });
            continue retryRequest;
          }
          if (redirectTo) {
            strategyLogger.info(`Retry ${retryCount}: Retry strategy ${strategy.name} redirects to ${redirectTo}`);
            request.url = redirectTo;
            continue retryRequest;
          }
        }
        if (responseError) {
          logger4.info(`None of the retry strategies could work with the received error. Throwing it.`);
          throw responseError;
        }
        if (response) {
          logger4.info(`None of the retry strategies could work with the received response. Returning it.`);
          return response;
        }
      }
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/defaultRetryPolicy.js
var defaultRetryPolicyName = "defaultRetryPolicy";
function defaultRetryPolicy(options = {}) {
  return {
    name: defaultRetryPolicyName,
    sendRequest: retryPolicy([throttlingRetryStrategy(), exponentialRetryStrategy(options)], {
      maxRetries: options.maxRetries ?? DEFAULT_RETRY_POLICY_COUNT
    }).sendRequest
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/formData.js
function convertBodyToFormDataMap(body) {
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    const formDataMap = {};
    for (const [key, value] of body.entries()) {
      const existing = formDataMap[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        formDataMap[key] = existing !== void 0 ? [existing, value] : [value];
      }
    }
    return formDataMap;
  }
  return void 0;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/formDataPolicy.js
var formDataPolicyName = "formDataPolicy";
function formDataPolicy() {
  return {
    name: formDataPolicyName,
    async sendRequest(request, next) {
      const converted = convertBodyToFormDataMap(request.body);
      if (converted) {
        request.formData = converted;
        request.body = void 0;
      }
      if (request.formData) {
        const contentType = request.headers.get("Content-Type");
        if (contentType && contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
          request.body = wwwFormUrlEncode(request.formData);
        } else {
          await prepareFormData(request.formData, request);
        }
        request.formData = void 0;
      }
      return next(request);
    }
  };
}
function wwwFormUrlEncode(formData) {
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(formData)) {
    if (Array.isArray(value)) {
      for (const subValue of value) {
        urlSearchParams.append(key, subValue.toString());
      }
    } else {
      urlSearchParams.append(key, value.toString());
    }
  }
  return urlSearchParams.toString();
}
async function prepareFormData(formData, request) {
  const contentType = request.headers.get("Content-Type");
  if (contentType && !contentType.startsWith("multipart/form-data")) {
    return;
  }
  request.headers.set("Content-Type", contentType ?? "multipart/form-data");
  const parts = [];
  for (const [fieldName, values] of Object.entries(formData)) {
    for (const value of Array.isArray(values) ? values : [values]) {
      if (typeof value === "string") {
        parts.push({
          headers: createHttpHeaders({
            "Content-Disposition": `form-data; name="${fieldName}"`
          }),
          body: stringToUint8Array(value, "utf-8")
        });
      } else if (value === void 0 || value === null || typeof value !== "object") {
        throw new Error(`Unexpected value for key ${fieldName}: ${value}. Value should be serialized to string first.`);
      } else {
        const fileName = value.name || "blob";
        const headers = createHttpHeaders();
        headers.set("Content-Disposition", `form-data; name="${fieldName}"; filename="${fileName}"`);
        headers.set("Content-Type", value.type || "application/octet-stream");
        parts.push({
          headers,
          body: value
        });
      }
    }
  }
  request.multipartBody = { parts };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/agentPolicy.js
var agentPolicyName = "agentPolicy";
function agentPolicy(agent) {
  return {
    name: agentPolicyName,
    sendRequest: async (req, next) => {
      if (!req.agent) {
        req.agent = agent;
      }
      return next(req);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/tlsPolicy.js
var tlsPolicyName = "tlsPolicy";
function tlsPolicy(tlsSettings) {
  return {
    name: tlsPolicyName,
    sendRequest: async (req, next) => {
      if (!req.tlsSettings) {
        req.tlsSettings = tlsSettings;
      }
      return next(req);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/proxyPolicy.js
var import_https_proxy_agent = __toESM(require_dist2(), 1);
var import_http_proxy_agent = __toESM(require_dist3(), 1);
var HTTPS_PROXY = "HTTPS_PROXY";
var HTTP_PROXY = "HTTP_PROXY";
var ALL_PROXY = "ALL_PROXY";
var NO_PROXY = "NO_PROXY";
var proxyPolicyName = "proxyPolicy";
var globalNoProxyList = [];
var noProxyListLoaded = false;
var globalBypassedMap = /* @__PURE__ */ new Map();
function getEnvironmentValue(name) {
  if (process.env[name]) {
    return process.env[name];
  } else if (process.env[name.toLowerCase()]) {
    return process.env[name.toLowerCase()];
  }
  return void 0;
}
function loadEnvironmentProxyValue() {
  if (!process) {
    return void 0;
  }
  const httpsProxy = getEnvironmentValue(HTTPS_PROXY);
  const allProxy = getEnvironmentValue(ALL_PROXY);
  const httpProxy = getEnvironmentValue(HTTP_PROXY);
  return httpsProxy || allProxy || httpProxy;
}
function isBypassed(uri, noProxyList, bypassedMap) {
  if (noProxyList.length === 0) {
    return false;
  }
  const host = new URL(uri).hostname;
  if (bypassedMap?.has(host)) {
    return bypassedMap.get(host);
  }
  let isBypassedFlag = false;
  for (const pattern of noProxyList) {
    if (pattern[0] === ".") {
      if (host.endsWith(pattern)) {
        isBypassedFlag = true;
      } else {
        if (host.length === pattern.length - 1 && host === pattern.slice(1)) {
          isBypassedFlag = true;
        }
      }
    } else {
      if (host === pattern) {
        isBypassedFlag = true;
      }
    }
  }
  bypassedMap?.set(host, isBypassedFlag);
  return isBypassedFlag;
}
function loadNoProxy() {
  const noProxy = getEnvironmentValue(NO_PROXY);
  noProxyListLoaded = true;
  if (noProxy) {
    return noProxy.split(",").map((item) => item.trim()).filter((item) => item.length);
  }
  return [];
}
function getDefaultProxySettingsInternal() {
  const envProxy = loadEnvironmentProxyValue();
  return envProxy ? new URL(envProxy) : void 0;
}
function getUrlFromProxySettings(settings) {
  let parsedProxyUrl;
  try {
    parsedProxyUrl = new URL(settings.host);
  } catch {
    throw new Error(`Expecting a valid host string in proxy settings, but found "${settings.host}".`);
  }
  parsedProxyUrl.port = String(settings.port);
  if (settings.username) {
    parsedProxyUrl.username = settings.username;
  }
  if (settings.password) {
    parsedProxyUrl.password = settings.password;
  }
  return parsedProxyUrl;
}
function setProxyAgentOnRequest(request, cachedAgents, proxyUrl) {
  if (request.agent) {
    return;
  }
  const url = new URL(request.url);
  const isInsecure = url.protocol !== "https:";
  if (request.tlsSettings) {
    logger2.warning("TLS settings are not supported in combination with custom Proxy, certificates provided to the client will be ignored.");
  }
  if (isInsecure) {
    if (!cachedAgents.httpProxyAgent) {
      cachedAgents.httpProxyAgent = new import_http_proxy_agent.HttpProxyAgent(proxyUrl);
    }
    request.agent = cachedAgents.httpProxyAgent;
  } else {
    if (!cachedAgents.httpsProxyAgent) {
      cachedAgents.httpsProxyAgent = new import_https_proxy_agent.HttpsProxyAgent(proxyUrl);
    }
    request.agent = cachedAgents.httpsProxyAgent;
  }
}
function proxyPolicy(proxySettings, options) {
  if (!noProxyListLoaded) {
    globalNoProxyList.push(...loadNoProxy());
  }
  const defaultProxy = proxySettings ? getUrlFromProxySettings(proxySettings) : getDefaultProxySettingsInternal();
  const cachedAgents = {};
  return {
    name: proxyPolicyName,
    async sendRequest(request, next) {
      if (!request.proxySettings && defaultProxy && !isBypassed(request.url, options?.customNoProxyList ?? globalNoProxyList, options?.customNoProxyList ? void 0 : globalBypassedMap)) {
        setProxyAgentOnRequest(request, cachedAgents, defaultProxy);
      } else if (request.proxySettings) {
        setProxyAgentOnRequest(request, cachedAgents, getUrlFromProxySettings(request.proxySettings));
      }
      return next(request);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/decompressResponsePolicy.js
var decompressResponsePolicyName = "decompressResponsePolicy";
function decompressResponsePolicy() {
  return {
    name: decompressResponsePolicyName,
    async sendRequest(request, next) {
      if (request.method !== "HEAD") {
        request.headers.set("Accept-Encoding", "gzip,deflate");
      }
      return next(request);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/redirectPolicy.js
var redirectPolicyName = "redirectPolicy";
var allowedRedirect = ["GET", "HEAD"];
function redirectPolicy(options = {}) {
  const { maxRetries = 20, allowCrossOriginRedirects = false } = options;
  return {
    name: redirectPolicyName,
    async sendRequest(request, next) {
      const response = await next(request);
      return handleRedirect(next, response, maxRetries, allowCrossOriginRedirects);
    }
  };
}
async function handleRedirect(next, response, maxRetries, allowCrossOriginRedirects, currentRetries = 0) {
  const { request, status, headers } = response;
  const locationHeader = headers.get("location");
  if (locationHeader && (status === 300 || status === 301 && allowedRedirect.includes(request.method) || status === 302 && allowedRedirect.includes(request.method) || status === 303 && request.method === "POST" || status === 307) && currentRetries < maxRetries) {
    const url = new URL(locationHeader, request.url);
    if (!allowCrossOriginRedirects) {
      const originalUrl = new URL(request.url);
      if (url.origin !== originalUrl.origin) {
        logger2.verbose(`Skipping cross-origin redirect from ${originalUrl.origin} to ${url.origin}.`);
        return response;
      }
    }
    request.url = url.toString();
    if (status === 303) {
      request.method = "GET";
      request.headers.delete("Content-Length");
      delete request.body;
    }
    request.headers.delete("Authorization");
    const res = await next(request);
    return handleRedirect(next, res, maxRetries, allowCrossOriginRedirects, currentRetries + 1);
  }
  return response;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/platformPolicies.js
function addPlatformPolicies(pipeline, options) {
  if (options.agent) {
    pipeline.addPolicy(agentPolicy(options.agent));
  }
  if (options.tlsOptions) {
    pipeline.addPolicy(tlsPolicy(options.tlsOptions));
  }
  pipeline.addPolicy(proxyPolicy(options.proxyOptions));
  pipeline.addPolicy(decompressResponsePolicy());
  pipeline.addPolicy(redirectPolicy(options.redirectOptions), { afterPhase: "Retry" });
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/typeGuards-node.js
import { Readable } from "node:stream";
function isNodeReadableStream(x) {
  return x instanceof Readable;
}
function isWebReadableStream(x) {
  return x instanceof ReadableStream;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/typeGuards.js
function isBinaryBody(body) {
  return body !== void 0 && (body instanceof Uint8Array || isReadableStream2(body) || typeof body === "function" || body instanceof Blob);
}
function isReadableStream2(x) {
  return isNodeReadableStream(x) || isWebReadableStream(x);
}
function isBlob(x) {
  return x instanceof Blob;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/concat.js
import { Readable as Readable2 } from "node:stream";
async function* streamAsyncIterator() {
  const reader = this.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
function makeAsyncIterable(webStream) {
  if (!webStream[Symbol.asyncIterator]) {
    webStream[Symbol.asyncIterator] = streamAsyncIterator.bind(webStream);
  }
  if (!webStream.values) {
    webStream.values = streamAsyncIterator.bind(webStream);
  }
}
function ensureNodeStream(stream) {
  if (stream instanceof ReadableStream) {
    makeAsyncIterable(stream);
    return Readable2.fromWeb(stream);
  } else {
    return stream;
  }
}
function toStream(source) {
  if (source instanceof Uint8Array) {
    return Readable2.from(Buffer.from(source));
  } else if (isBlob(source)) {
    return ensureNodeStream(source.stream());
  } else {
    return ensureNodeStream(source);
  }
}
async function concat(sources) {
  return function() {
    const streams = sources.map((x) => typeof x === "function" ? x() : x).map(toStream);
    return Readable2.from((async function* () {
      for (const stream of streams) {
        for await (const chunk of stream) {
          yield chunk;
        }
      }
    })());
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/multipartPolicy.js
function generateBoundary() {
  return `----AzSDKFormBoundary${randomUUID()}`;
}
function encodeHeaders(headers) {
  let result = "";
  for (const [key, value] of headers) {
    result += `${key}: ${value}\r
`;
  }
  return result;
}
function getLength(source) {
  if (source instanceof Uint8Array) {
    return source.byteLength;
  } else if (isBlob(source)) {
    return source.size === -1 ? void 0 : source.size;
  } else {
    return void 0;
  }
}
function getTotalLength(sources) {
  let total = 0;
  for (const source of sources) {
    const partLength = getLength(source);
    if (partLength === void 0) {
      return void 0;
    } else {
      total += partLength;
    }
  }
  return total;
}
async function buildRequestBody(request, parts, boundary) {
  const sources = [
    stringToUint8Array(`--${boundary}`, "utf-8"),
    ...parts.flatMap((part) => [
      stringToUint8Array("\r\n", "utf-8"),
      stringToUint8Array(encodeHeaders(part.headers), "utf-8"),
      stringToUint8Array("\r\n", "utf-8"),
      part.body,
      stringToUint8Array(`\r
--${boundary}`, "utf-8")
    ]),
    stringToUint8Array("--\r\n\r\n", "utf-8")
  ];
  const contentLength = getTotalLength(sources);
  if (contentLength) {
    request.headers.set("Content-Length", contentLength);
  }
  request.body = await concat(sources);
}
var multipartPolicyName = "multipartPolicy";
var maxBoundaryLength = 70;
var validBoundaryCharacters = new Set(`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'()+,-./:=?`);
function assertValidBoundary(boundary) {
  if (boundary.length > maxBoundaryLength) {
    throw new Error(`Multipart boundary "${boundary}" exceeds maximum length of 70 characters`);
  }
  if (Array.from(boundary).some((x) => !validBoundaryCharacters.has(x))) {
    throw new Error(`Multipart boundary "${boundary}" contains invalid characters`);
  }
}
function multipartPolicy() {
  return {
    name: multipartPolicyName,
    async sendRequest(request, next) {
      if (!request.multipartBody) {
        return next(request);
      }
      if (request.body) {
        throw new Error("multipartBody and regular body cannot be set at the same time");
      }
      let boundary = request.multipartBody.boundary;
      const contentTypeHeader = request.headers.get("Content-Type") ?? "multipart/mixed";
      const parsedHeader = contentTypeHeader.match(/^(multipart\/[^ ;]+)(?:; *boundary=(.+))?$/);
      if (!parsedHeader) {
        throw new Error(`Got multipart request body, but content-type header was not multipart: ${contentTypeHeader}`);
      }
      const [, contentType, parsedBoundary] = parsedHeader;
      if (parsedBoundary && boundary && parsedBoundary !== boundary) {
        throw new Error(`Multipart boundary was specified as ${parsedBoundary} in the header, but got ${boundary} in the request body`);
      }
      boundary ??= parsedBoundary;
      if (boundary) {
        assertValidBoundary(boundary);
      } else {
        boundary = generateBoundary();
      }
      request.headers.set("Content-Type", `${contentType}; boundary=${boundary}`);
      await buildRequestBody(request, request.multipartBody.parts, boundary);
      request.multipartBody = void 0;
      return next(request);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/createPipelineFromOptions.js
function createPipelineFromOptions(options) {
  const pipeline = createEmptyPipeline();
  addPlatformPolicies(pipeline, options);
  pipeline.addPolicy(formDataPolicy(), { beforePolicies: [multipartPolicyName] });
  pipeline.addPolicy(userAgentPolicy(options.userAgentOptions));
  pipeline.addPolicy(multipartPolicy(), { afterPhase: "Deserialize" });
  pipeline.addPolicy(defaultRetryPolicy(options.retryOptions), { phase: "Retry" });
  pipeline.addPolicy(logPolicy(options.loggingOptions), { afterPhase: "Sign" });
  return pipeline;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/client/apiVersionPolicy.js
var apiVersionPolicyName = "ApiVersionPolicy";
function apiVersionPolicy(options) {
  return {
    name: apiVersionPolicyName,
    sendRequest: (req, next) => {
      const url = new URL(req.url);
      if (!url.searchParams.get("api-version") && options.apiVersion) {
        req.url = `${req.url}${Array.from(url.searchParams.keys()).length > 0 ? "&" : "?"}api-version=${options.apiVersion}`;
      }
      return next(req);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/auth/credentials.js
function isOAuth2TokenCredential(credential) {
  return "getOAuth2Token" in credential;
}
function isBearerTokenCredential(credential) {
  return "getBearerToken" in credential;
}
function isBasicCredential(credential) {
  return "username" in credential && "password" in credential;
}
function isApiKeyCredential(credential) {
  return "key" in credential;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/auth/checkInsecureConnection.js
var insecureConnectionWarningEmmitted = false;
function allowInsecureConnection(request, options) {
  if (options.allowInsecureConnection && request.allowInsecureConnection) {
    const url = new URL(request.url);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return true;
    }
  }
  return false;
}
function emitInsecureConnectionWarning() {
  const warning = "Sending token over insecure transport. Assume any token issued is compromised.";
  logger2.warning(warning);
  if (!insecureConnectionWarningEmmitted) {
    insecureConnectionWarningEmmitted = true;
    emitNodeWarning(warning);
  }
}
function ensureSecureConnection(request, options) {
  if (!request.url.toLowerCase().startsWith("https://")) {
    if (allowInsecureConnection(request, options)) {
      emitInsecureConnectionWarning();
    } else {
      throw new Error("Authentication is not permitted for non-TLS protected (non-https) URLs when allowInsecureConnection is false.");
    }
  }
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/auth/apiKeyAuthenticationPolicy.js
var apiKeyAuthenticationPolicyName = "apiKeyAuthenticationPolicy";
function apiKeyAuthenticationPolicy(options) {
  return {
    name: apiKeyAuthenticationPolicyName,
    async sendRequest(request, next) {
      ensureSecureConnection(request, options);
      const scheme = (request.authSchemes ?? options.authSchemes)?.find((x) => x.kind === "apiKey");
      if (!scheme) {
        return next(request);
      }
      if (scheme.apiKeyLocation !== "header") {
        throw new Error(`Unsupported API key location: ${scheme.apiKeyLocation}`);
      }
      request.headers.set(scheme.name, options.credential.key);
      return next(request);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/auth/basicAuthenticationPolicy.js
var basicAuthenticationPolicyName = "bearerAuthenticationPolicy";
function basicAuthenticationPolicy(options) {
  return {
    name: basicAuthenticationPolicyName,
    async sendRequest(request, next) {
      ensureSecureConnection(request, options);
      const scheme = (request.authSchemes ?? options.authSchemes)?.find((x) => x.kind === "http" && x.scheme === "basic");
      if (!scheme) {
        return next(request);
      }
      const { username, password } = options.credential;
      const headerValue = uint8ArrayToString(stringToUint8Array(`${username}:${password}`, "utf-8"), "base64");
      request.headers.set("Authorization", `Basic ${headerValue}`);
      return next(request);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/auth/bearerAuthenticationPolicy.js
var bearerAuthenticationPolicyName = "bearerAuthenticationPolicy";
function bearerAuthenticationPolicy(options) {
  return {
    name: bearerAuthenticationPolicyName,
    async sendRequest(request, next) {
      ensureSecureConnection(request, options);
      const scheme = (request.authSchemes ?? options.authSchemes)?.find((x) => x.kind === "http" && x.scheme === "bearer");
      if (!scheme) {
        return next(request);
      }
      const token = await options.credential.getBearerToken({
        abortSignal: request.abortSignal
      });
      request.headers.set("Authorization", `Bearer ${token}`);
      return next(request);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/policies/auth/oauth2AuthenticationPolicy.js
var oauth2AuthenticationPolicyName = "oauth2AuthenticationPolicy";
function oauth2AuthenticationPolicy(options) {
  return {
    name: oauth2AuthenticationPolicyName,
    async sendRequest(request, next) {
      ensureSecureConnection(request, options);
      const scheme = (request.authSchemes ?? options.authSchemes)?.find((x) => x.kind === "oauth2");
      if (!scheme) {
        return next(request);
      }
      const token = await options.credential.getOAuth2Token(scheme.flows, {
        abortSignal: request.abortSignal
      });
      request.headers.set("Authorization", `Bearer ${token}`);
      return next(request);
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/client/clientHelpers.js
var cachedHttpClient;
function createDefaultPipeline(options = {}) {
  const pipeline = createPipelineFromOptions(options);
  pipeline.addPolicy(apiVersionPolicy(options));
  const { credential, authSchemes, allowInsecureConnection: allowInsecureConnection2 } = options;
  if (credential) {
    if (isApiKeyCredential(credential)) {
      pipeline.addPolicy(apiKeyAuthenticationPolicy({ authSchemes, credential, allowInsecureConnection: allowInsecureConnection2 }));
    } else if (isBasicCredential(credential)) {
      pipeline.addPolicy(basicAuthenticationPolicy({ authSchemes, credential, allowInsecureConnection: allowInsecureConnection2 }));
    } else if (isBearerTokenCredential(credential)) {
      pipeline.addPolicy(bearerAuthenticationPolicy({ authSchemes, credential, allowInsecureConnection: allowInsecureConnection2 }));
    } else if (isOAuth2TokenCredential(credential)) {
      pipeline.addPolicy(oauth2AuthenticationPolicy({ authSchemes, credential, allowInsecureConnection: allowInsecureConnection2 }));
    }
  }
  return pipeline;
}
function getCachedDefaultHttpsClient() {
  if (!cachedHttpClient) {
    cachedHttpClient = createDefaultHttpClient();
  }
  return cachedHttpClient;
}

// node_modules/@typespec/ts-http-runtime/dist/esm/client/multipart.js
function getHeaderValue(descriptor, headerName) {
  if (descriptor.headers) {
    const actualHeaderName = Object.keys(descriptor.headers).find((x) => x.toLowerCase() === headerName.toLowerCase());
    if (actualHeaderName) {
      return descriptor.headers[actualHeaderName];
    }
  }
  return void 0;
}
function getPartContentType(descriptor) {
  const contentTypeHeader = getHeaderValue(descriptor, "content-type");
  if (contentTypeHeader) {
    return contentTypeHeader;
  }
  if (descriptor.contentType === null) {
    return void 0;
  }
  if (descriptor.contentType) {
    return descriptor.contentType;
  }
  const { body } = descriptor;
  if (body === null || body === void 0) {
    return void 0;
  }
  if (typeof body === "string" || typeof body === "number" || typeof body === "boolean") {
    return "text/plain; charset=UTF-8";
  }
  if (body instanceof Blob) {
    return body.type || "application/octet-stream";
  }
  if (isBinaryBody(body)) {
    return "application/octet-stream";
  }
  return "application/json";
}
function escapeDispositionField(value) {
  return JSON.stringify(value);
}
function getContentDisposition(descriptor) {
  const contentDispositionHeader = getHeaderValue(descriptor, "content-disposition");
  if (contentDispositionHeader) {
    return contentDispositionHeader;
  }
  if (descriptor.dispositionType === void 0 && descriptor.name === void 0 && descriptor.filename === void 0) {
    return void 0;
  }
  const dispositionType = descriptor.dispositionType ?? "form-data";
  let disposition = dispositionType;
  if (descriptor.name) {
    disposition += `; name=${escapeDispositionField(descriptor.name)}`;
  }
  let filename = void 0;
  if (descriptor.filename) {
    filename = descriptor.filename;
  } else if (typeof File !== "undefined" && descriptor.body instanceof File) {
    const filenameFromFile = descriptor.body.name;
    if (filenameFromFile !== "") {
      filename = filenameFromFile;
    }
  }
  if (filename) {
    disposition += `; filename=${escapeDispositionField(filename)}`;
  }
  return disposition;
}
function normalizeBody(body, contentType) {
  if (body === void 0) {
    return new Uint8Array([]);
  }
  if (isBinaryBody(body)) {
    return body;
  }
  if (typeof body === "string" || typeof body === "number" || typeof body === "boolean") {
    return stringToUint8Array(String(body), "utf-8");
  }
  if (contentType && /application\/(.+\+)?json(;.+)?/i.test(String(contentType))) {
    return stringToUint8Array(JSON.stringify(body), "utf-8");
  }
  throw new RestError(`Unsupported body/content-type combination: ${body}, ${contentType}`);
}
function buildBodyPart(descriptor) {
  const contentType = getPartContentType(descriptor);
  const contentDisposition = getContentDisposition(descriptor);
  const headers = createHttpHeaders(descriptor.headers ?? {});
  if (contentType) {
    headers.set("content-type", contentType);
  }
  if (contentDisposition) {
    headers.set("content-disposition", contentDisposition);
  }
  const body = normalizeBody(descriptor.body, contentType);
  return {
    headers,
    body
  };
}
function buildMultipartBody(parts) {
  return { parts: parts.map(buildBodyPart) };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/client/sendRequest.js
async function sendRequest(method, url, pipeline, options = {}, customHttpClient) {
  const httpClient = customHttpClient ?? getCachedDefaultHttpsClient();
  const request = buildPipelineRequest(method, url, options);
  try {
    const response = await pipeline.sendRequest(httpClient, request);
    const headers = response.headers.toJSON();
    const stream = response.readableStreamBody ?? response.browserStreamBody;
    const parsedBody = options.responseAsStream || stream !== void 0 ? void 0 : getResponseBody(response);
    const body = stream ?? parsedBody;
    if (options?.onResponse) {
      options.onResponse({ ...response, request, rawHeaders: headers, parsedBody });
    }
    return {
      request,
      headers,
      status: `${response.status}`,
      body
    };
  } catch (e) {
    if (isRestError(e) && e.response && options.onResponse) {
      const { response } = e;
      const rawHeaders = response.headers.toJSON();
      options?.onResponse({ ...response, request, rawHeaders }, e);
    }
    throw e;
  }
}
function getRequestContentType(options = {}) {
  if (options.contentType) {
    return options.contentType;
  }
  const headerContentType = options.headers?.["content-type"];
  if (typeof headerContentType === "string") {
    return headerContentType;
  }
  return getContentType(options.body);
}
function getContentType(body) {
  if (body === void 0) {
    return void 0;
  }
  if (ArrayBuffer.isView(body)) {
    return "application/octet-stream";
  }
  if (isBlob(body) && body.type) {
    return body.type;
  }
  if (typeof body === "string") {
    try {
      JSON.parse(body);
      return "application/json";
    } catch (error) {
      return void 0;
    }
  }
  return "application/json";
}
function buildPipelineRequest(method, url, options = {}) {
  const requestContentType = getRequestContentType(options);
  const { body, multipartBody } = getRequestBody(options.body, requestContentType);
  const accept = options.accept ?? options.headers?.accept ?? (options.noDefaultAcceptHeader ? void 0 : "application/json");
  const headers = createHttpHeaders({
    ...options.headers ? options.headers : {},
    ...accept !== void 0 && { accept },
    ...requestContentType && {
      "content-type": requestContentType
    }
  });
  const { allowInsecureConnection: allowInsecureConnection2, abortSignal, onUploadProgress, onDownloadProgress, timeout, responseAsStream, noDefaultAcceptHeader: _noDefaultAcceptHeader, url: _url, method: _method, body: _body, multipartBody: _multiBody, headers: _headers, ...rest } = options;
  const request = createPipelineRequest({
    url,
    method,
    body,
    multipartBody,
    headers,
    allowInsecureConnection: allowInsecureConnection2,
    abortSignal,
    onUploadProgress,
    onDownloadProgress,
    timeout,
    enableBrowserStreams: true,
    streamResponseStatusCodes: responseAsStream ? /* @__PURE__ */ new Set([Number.POSITIVE_INFINITY]) : void 0
  });
  Object.assign(request, rest);
  return request;
}
function getRequestBody(body, contentType = "") {
  if (body === void 0) {
    return { body: void 0 };
  }
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    return { body };
  }
  if (isBlob(body)) {
    return { body };
  }
  if (isReadableStream2(body)) {
    return { body };
  }
  if (typeof body === "function") {
    return { body };
  }
  if (ArrayBuffer.isView(body)) {
    return {
      body: body instanceof Uint8Array ? body : JSON.stringify(body)
    };
  }
  const firstType = contentType.split(";")[0];
  switch (firstType) {
    case "application/json":
      return { body: JSON.stringify(body) };
    case "multipart/form-data":
      if (Array.isArray(body)) {
        return { multipartBody: buildMultipartBody(body) };
      }
      return { body: JSON.stringify(body) };
    case "text/plain":
      return { body: String(body) };
    default:
      if (typeof body === "string") {
        return { body };
      }
      return { body: JSON.stringify(body) };
  }
}
function getResponseBody(response) {
  const contentType = response.headers.get("content-type") ?? "";
  const firstType = contentType.split(";")[0];
  const bodyToParse = response.bodyAsText ?? "";
  if (firstType === "text/plain") {
    return String(bodyToParse);
  }
  try {
    return bodyToParse ? JSON.parse(bodyToParse) : void 0;
  } catch (error) {
    if (firstType === "application/json") {
      throw createParseError(response, error);
    }
    return String(bodyToParse);
  }
}
function createParseError(response, err) {
  const msg = `Error "${err}" occurred while parsing the response body - ${response.bodyAsText}.`;
  const errCode = err.code ?? RestError.PARSE_ERROR;
  return new RestError(msg, {
    code: errCode,
    statusCode: response.status,
    request: response.request,
    response
  });
}

// node_modules/@typespec/ts-http-runtime/dist/esm/client/urlHelpers.js
function isQueryParameterWithOptions(x) {
  if (typeof x !== "object" || x === null || !Object.hasOwn(x, "value")) {
    return false;
  }
  const value = x.value;
  return typeof value?.toString === "function";
}
function buildRequestUrl(endpoint, routePath, pathParameters, options = {}) {
  if (routePath.startsWith("https://") || routePath.startsWith("http://")) {
    return routePath;
  }
  endpoint = buildBaseUrl(endpoint, options);
  const updatedRoutePath = buildRoutePath(routePath, pathParameters, options);
  const requestUrl = appendQueryParams(appendPath(endpoint, updatedRoutePath), options);
  const url = new URL(requestUrl);
  return url.toString();
}
function appendPath(endpoint, pathToAppend) {
  const endpointSearchStart = endpoint.indexOf("?");
  const pathSearchStart = pathToAppend.indexOf("?");
  const endpointParts = endpointSearchStart !== -1 ? [endpoint.substring(0, endpointSearchStart), endpoint.substring(endpointSearchStart + 1)] : [endpoint, ""];
  const pathParts = pathSearchStart !== -1 ? [pathToAppend.substring(0, pathSearchStart), pathToAppend.substring(pathSearchStart + 1)] : [pathToAppend, ""];
  const combinedSearch = [endpointParts[1], pathParts[1].replaceAll("?", "&")].filter(Boolean).join("&");
  const baseEndpoint = endpointParts[0].replace(/(^[^:]+:\/\/[^/]+)\/\/+/, "$1/");
  const basePathToAppend = pathParts[0];
  let combinedUrl = baseEndpoint;
  if (!baseEndpoint.endsWith("/") && !basePathToAppend.startsWith("/") && basePathToAppend !== "") {
    combinedUrl += `/${basePathToAppend}`;
  } else if (baseEndpoint.endsWith("/") && basePathToAppend.startsWith("/")) {
    combinedUrl += basePathToAppend.substring(1);
  } else {
    combinedUrl += basePathToAppend;
  }
  if (combinedSearch) {
    combinedUrl += `?${combinedSearch}`;
  }
  return combinedUrl;
}
function getQueryParamValue(key, allowReserved, style, param) {
  let separator;
  if (style === "pipeDelimited") {
    separator = "|";
  } else if (style === "spaceDelimited") {
    separator = "%20";
  } else {
    separator = ",";
  }
  let paramValues;
  if (Array.isArray(param)) {
    paramValues = param;
  } else if (typeof param === "object" && param.toString === Object.prototype.toString) {
    paramValues = Object.entries(param).flat();
  } else {
    paramValues = [param];
  }
  const value = paramValues.map((p) => {
    if (p === null || p === void 0) {
      return "";
    }
    if (!p.toString || typeof p.toString !== "function") {
      throw new Error(`Query parameters must be able to be represented as string, ${key} can't`);
    }
    const rawValue = p.toISOString !== void 0 ? p.toISOString() : p.toString();
    return allowReserved ? rawValue : encodeURIComponent(rawValue);
  }).join(separator);
  return `${allowReserved ? key : encodeURIComponent(key)}=${value}`;
}
function simpleParseQueryParams(queryString) {
  const result = /* @__PURE__ */ new Map();
  if (!queryString || queryString[0] !== "?") {
    return result;
  }
  queryString = queryString.slice(1);
  const pairs = queryString.split("&");
  for (const pair of pairs) {
    const eqIndex = pair.indexOf("=");
    const name = eqIndex === -1 ? pair : pair.substring(0, eqIndex);
    const value = eqIndex === -1 ? "" : pair.substring(eqIndex + 1);
    const existingValue = result.get(name);
    if (existingValue !== void 0) {
      if (Array.isArray(existingValue)) {
        existingValue.push(value);
      } else {
        result.set(name, [existingValue, value]);
      }
    } else {
      result.set(name, value);
    }
  }
  return result;
}
function appendQueryParams(url, options = {}) {
  if (!options.queryParameters) {
    return url;
  }
  const parsedUrl = new URL(url);
  const queryParams = options.queryParameters;
  const existingParams = simpleParseQueryParams(parsedUrl.search);
  const newParamStrings = [];
  for (const key of Object.keys(queryParams)) {
    const param = queryParams[key];
    if (param === void 0 || param === null) {
      continue;
    }
    const hasMetadata = isQueryParameterWithOptions(param);
    const rawValue = hasMetadata ? param.value : param;
    const explode = hasMetadata ? param.explode ?? false : false;
    const style = hasMetadata && param.style ? param.style : "form";
    if (explode) {
      if (Array.isArray(rawValue)) {
        for (const item of rawValue) {
          newParamStrings.push(getQueryParamValue(key, options.skipUrlEncoding ?? false, style, item));
        }
      } else if (rawValue !== null && typeof rawValue === "object") {
        for (const [actualKey, value] of Object.entries(rawValue)) {
          newParamStrings.push(getQueryParamValue(actualKey, options.skipUrlEncoding ?? false, style, value));
        }
      } else {
        throw new Error("explode can only be set to true for objects and arrays");
      }
    } else {
      newParamStrings.push(getQueryParamValue(key, options.skipUrlEncoding ?? false, style, rawValue));
    }
  }
  for (const paramString of newParamStrings) {
    const eqIndex = paramString.indexOf("=");
    const name = paramString.substring(0, eqIndex);
    const value = paramString.substring(eqIndex + 1);
    const existingValue = existingParams.get(name);
    if (existingValue !== void 0) {
      if (Array.isArray(existingValue)) {
        if (!existingValue.includes(value)) {
          existingValue.push(value);
        }
      } else if (existingValue !== value) {
        existingParams.set(name, [existingValue, value]);
      }
    } else {
      existingParams.set(name, value);
    }
  }
  const searchPieces = [];
  for (const [name, value] of existingParams) {
    if (Array.isArray(value)) {
      for (const subValue of value) {
        searchPieces.push(`${name}=${subValue}`);
      }
    } else {
      searchPieces.push(`${name}=${value}`);
    }
  }
  parsedUrl.search = searchPieces.length ? `?${searchPieces.join("&")}` : "";
  return parsedUrl.toString();
}
function buildBaseUrl(endpoint, options) {
  if (!options.pathParameters) {
    return endpoint;
  }
  const pathParams = options.pathParameters;
  for (const [key, param] of Object.entries(pathParams)) {
    if (param === void 0 || param === null) {
      throw new Error(`Path parameters ${key} must not be undefined or null`);
    }
    if (!param.toString || typeof param.toString !== "function") {
      throw new Error(`Path parameters must be able to be represented as string, ${key} can't`);
    }
    let value = param.toISOString !== void 0 ? param.toISOString() : String(param);
    if (!options.skipUrlEncoding) {
      value = encodeURIComponent(param);
    }
    endpoint = replaceAll(endpoint, `{${key}}`, value) ?? "";
  }
  return endpoint;
}
function buildRoutePath(routePath, pathParameters, options = {}) {
  for (const pathParam of pathParameters) {
    const allowReserved = typeof pathParam === "object" && (pathParam.allowReserved ?? false);
    let value = typeof pathParam === "object" ? pathParam.value : pathParam;
    if (!options.skipUrlEncoding && !allowReserved) {
      value = encodeURIComponent(value);
    }
    routePath = routePath.replace(/\{[\w-]+\}/, String(value));
  }
  return routePath;
}
function replaceAll(value, searchValue, replaceValue) {
  return !value || !searchValue ? value : value.split(searchValue).join(replaceValue || "");
}

// node_modules/@typespec/ts-http-runtime/dist/esm/client/getClient.js
function getClient(endpoint, clientOptions = {}) {
  const pipeline = clientOptions.pipeline ?? createDefaultPipeline(clientOptions);
  if (clientOptions.additionalPolicies?.length) {
    for (const { policy, position } of clientOptions.additionalPolicies) {
      const afterPhase = position === "perRetry" ? "Sign" : void 0;
      pipeline.addPolicy(policy, {
        afterPhase
      });
    }
  }
  const noDefaultAcceptHeader = clientOptions.internal?.noDefaultAcceptHeader ?? false;
  const { allowInsecureConnection: allowInsecureConnection2, httpClient } = clientOptions;
  const endpointUrl = clientOptions.endpoint ?? endpoint;
  const client = (path, ...args) => {
    const getUrl = (requestOptions) => buildRequestUrl(endpointUrl, path, args, { allowInsecureConnection: allowInsecureConnection2, ...requestOptions });
    return {
      get: (requestOptions = {}) => {
        return buildOperation("GET", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection2, httpClient, noDefaultAcceptHeader);
      },
      post: (requestOptions = {}) => {
        return buildOperation("POST", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection2, httpClient, noDefaultAcceptHeader);
      },
      put: (requestOptions = {}) => {
        return buildOperation("PUT", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection2, httpClient, noDefaultAcceptHeader);
      },
      patch: (requestOptions = {}) => {
        return buildOperation("PATCH", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection2, httpClient, noDefaultAcceptHeader);
      },
      delete: (requestOptions = {}) => {
        return buildOperation("DELETE", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection2, httpClient, noDefaultAcceptHeader);
      },
      head: (requestOptions = {}) => {
        return buildOperation("HEAD", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection2, httpClient, noDefaultAcceptHeader);
      },
      options: (requestOptions = {}) => {
        return buildOperation("OPTIONS", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection2, httpClient, noDefaultAcceptHeader);
      },
      trace: (requestOptions = {}) => {
        return buildOperation("TRACE", getUrl(requestOptions), pipeline, requestOptions, allowInsecureConnection2, httpClient, noDefaultAcceptHeader);
      }
    };
  };
  return {
    path: client,
    pathUnchecked: client,
    pipeline
  };
}
function buildOperation(method, url, pipeline, options, allowInsecureConnection2, httpClient, noDefaultAcceptHeader = false) {
  allowInsecureConnection2 = options.allowInsecureConnection ?? allowInsecureConnection2;
  return {
    then: function(onFulfilled, onrejected) {
      return sendRequest(method, url, pipeline, { ...options, allowInsecureConnection: allowInsecureConnection2, noDefaultAcceptHeader }, httpClient).then(onFulfilled, onrejected);
    },
    async asBrowserStream() {
      if (isNodeLike) {
        throw new Error("`asBrowserStream` is supported only in the browser environment. Use `asNodeStream` instead to obtain the response body stream. If you require a Web stream of the response in Node, consider using `Readable.toWeb` on the result of `asNodeStream`.");
      } else {
        return sendRequest(method, url, pipeline, { ...options, allowInsecureConnection: allowInsecureConnection2, noDefaultAcceptHeader, responseAsStream: true }, httpClient);
      }
    },
    async asNodeStream() {
      if (isNodeLike) {
        return sendRequest(method, url, pipeline, { ...options, allowInsecureConnection: allowInsecureConnection2, noDefaultAcceptHeader, responseAsStream: true }, httpClient);
      } else {
        throw new Error("`isNodeStream` is not supported in the browser environment. Use `asBrowserStream` to obtain the response body stream.");
      }
    }
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/client/operationOptionHelpers.js
function operationOptionsToRequestParameters(options) {
  return {
    allowInsecureConnection: options.requestOptions?.allowInsecureConnection,
    timeout: options.requestOptions?.timeout,
    skipUrlEncoding: options.requestOptions?.skipUrlEncoding,
    abortSignal: options.abortSignal,
    onUploadProgress: options.requestOptions?.onUploadProgress,
    onDownloadProgress: options.requestOptions?.onDownloadProgress,
    headers: { ...options.requestOptions?.headers },
    onResponse: options.onResponse
  };
}

// node_modules/@typespec/ts-http-runtime/dist/esm/client/restError.js
function createRestError(messageOrResponse, response) {
  const resp = typeof messageOrResponse === "string" ? response : messageOrResponse;
  const internalError = resp.body?.error ?? resp.body;
  const message = typeof messageOrResponse === "string" ? messageOrResponse : internalError?.message ?? `Unexpected status code: ${resp.status}`;
  return new RestError(message, {
    statusCode: statusCodeToNumber(resp.status),
    code: internalError?.code,
    request: resp.request,
    response: toPipelineResponse(resp)
  });
}
function toPipelineResponse(errorResponse) {
  return {
    headers: createHttpHeaders(errorResponse.headers),
    request: errorResponse.request,
    status: statusCodeToNumber(errorResponse.status) ?? -1,
    ...typeof errorResponse.body === "string" ? { bodyAsText: errorResponse.body } : {}
  };
}
function statusCodeToNumber(statusCode) {
  const status = Number.parseInt(statusCode);
  return Number.isNaN(status) ? void 0 : status;
}

// node_modules/@azure-rest/core-client/dist/esm/restError.js
function createRestError2(messageOrResponse, response) {
  if (typeof messageOrResponse === "string") {
    return createRestError(messageOrResponse, response);
  } else {
    return createRestError(messageOrResponse);
  }
}

// node_modules/@azure/core-rest-pipeline/dist/esm/pipeline.js
function createEmptyPipeline2() {
  return createEmptyPipeline();
}

// node_modules/@azure/core-rest-pipeline/dist/esm/log.js
var logger3 = createClientLogger2("core-rest-pipeline");

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/logPolicy.js
function logPolicy2(options = {}) {
  return logPolicy({
    logger: logger3.info,
    ...options
  });
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/redirectPolicy.js
function redirectPolicy2(options = {}) {
  return redirectPolicy(options);
}

// node_modules/@azure/core-rest-pipeline/dist/esm/util/userAgentPlatform.js
import os2 from "node:os";
import process5 from "node:process";
function getHeaderName2() {
  return "User-Agent";
}
async function setPlatformSpecificData2(map) {
  if (process5 && process5.versions) {
    const osInfo = `${os2.type()} ${os2.release()}; ${os2.arch()}`;
    if (process5.versions.bun) {
      map.set("Bun", `${process5.versions.bun} (${osInfo})`);
    } else if (process5.versions.deno) {
      map.set("Deno", `${process5.versions.deno} (${osInfo})`);
    } else if (process5.versions.node) {
      map.set("Node", `${process5.versions.node} (${osInfo})`);
    }
  }
}

// node_modules/@azure/core-rest-pipeline/dist/esm/constants.js
var SDK_VERSION2 = "1.25.0";

// node_modules/@azure/core-rest-pipeline/dist/esm/util/userAgent.js
function getUserAgentString2(telemetryInfo) {
  const parts = [];
  for (const [key, value] of telemetryInfo) {
    const token = value ? `${key}/${value}` : key;
    parts.push(token);
  }
  return parts.join(" ");
}
function getUserAgentHeaderName2() {
  return getHeaderName2();
}
async function getUserAgentValue2(prefix) {
  const runtimeInfo = /* @__PURE__ */ new Map();
  runtimeInfo.set("core-rest-pipeline", SDK_VERSION2);
  await setPlatformSpecificData2(runtimeInfo);
  const defaultAgent = getUserAgentString2(runtimeInfo);
  const userAgentValue = prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
  return userAgentValue;
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/userAgentPolicy.js
var UserAgentHeaderName2 = getUserAgentHeaderName2();
var userAgentPolicyName2 = "userAgentPolicy";
function userAgentPolicy2(options = {}) {
  const userAgentValue = getUserAgentValue2(options.userAgentPrefix);
  return {
    name: userAgentPolicyName2,
    async sendRequest(request, next) {
      if (!request.headers.has(UserAgentHeaderName2)) {
        request.headers.set(UserAgentHeaderName2, await userAgentValue);
      }
      return next(request);
    }
  };
}

// node_modules/@azure/core-rest-pipeline/dist/esm/util/file.js
var rawContent = Symbol("rawContent");
function hasRawContent(x) {
  return typeof x[rawContent] === "function";
}
function getRawContent(blob) {
  if (hasRawContent(blob)) {
    return blob[rawContent]();
  } else {
    return blob;
  }
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/multipartPolicy.js
var multipartPolicyName2 = multipartPolicyName;
function multipartPolicy2() {
  const tspPolicy = multipartPolicy();
  return {
    name: multipartPolicyName2,
    sendRequest: async (request, next) => {
      if (request.multipartBody) {
        for (const part of request.multipartBody.parts) {
          if (hasRawContent(part.body)) {
            part.body = getRawContent(part.body);
          }
        }
      }
      return tspPolicy.sendRequest(request, next);
    }
  };
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/decompressResponsePolicy.js
function decompressResponsePolicy2() {
  return decompressResponsePolicy();
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/defaultRetryPolicy.js
function defaultRetryPolicy2(options = {}) {
  return defaultRetryPolicy(options);
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/formDataPolicy.js
function formDataPolicy2() {
  return formDataPolicy();
}

// node_modules/@typespec/ts-http-runtime/dist/esm/util/sha256.js
import { createHash, createHmac } from "node:crypto";

// node_modules/@azure/abort-controller/dist/esm/AbortError.js
var AbortError2 = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AbortError";
  }
};

// node_modules/@azure/core-util/dist/esm/createAbortablePromise.js
function createAbortablePromise(buildPromise, options) {
  const { cleanupBeforeAbort, abortSignal, abortErrorMsg } = options ?? {};
  return new Promise((resolve, reject) => {
    function rejectOnAbort() {
      reject(new AbortError2(abortErrorMsg ?? "The operation was aborted."));
    }
    function removeListeners() {
      abortSignal?.removeEventListener("abort", onAbort);
    }
    function onAbort() {
      cleanupBeforeAbort?.();
      removeListeners();
      rejectOnAbort();
    }
    if (abortSignal?.aborted) {
      return rejectOnAbort();
    }
    try {
      buildPromise((x) => {
        removeListeners();
        resolve(x);
      }, (x) => {
        removeListeners();
        reject(x);
      });
    } catch (err) {
      reject(err);
    }
    abortSignal?.addEventListener("abort", onAbort);
  });
}

// node_modules/@azure/core-util/dist/esm/delay.js
var StandardAbortMessage2 = "The delay was aborted.";
function delay2(timeInMs, options) {
  let token;
  const { abortSignal, abortErrorMsg } = options ?? {};
  return createAbortablePromise((resolve) => {
    token = setTimeout(resolve, timeInMs);
  }, {
    cleanupBeforeAbort: () => clearTimeout(token),
    abortSignal,
    abortErrorMsg: abortErrorMsg ?? StandardAbortMessage2
  });
}

// node_modules/@azure/core-util/dist/esm/error.js
function getErrorMessage(e) {
  if (isError(e)) {
    return e.message;
  } else {
    let stringified;
    try {
      if (typeof e === "object" && e) {
        stringified = JSON.stringify(e);
      } else {
        stringified = String(e);
      }
    } catch (err) {
      stringified = "[unable to stringify input]";
    }
    return `Unknown error ${stringified}`;
  }
}

// node_modules/@azure/core-util/dist/esm/typeGuards.js
function isDefined(thing) {
  return typeof thing !== "undefined" && thing !== null;
}
function isObjectWithProperties(thing, properties) {
  if (!isDefined(thing) || typeof thing !== "object") {
    return false;
  }
  for (const property of properties) {
    if (!objectHasProperty(thing, property)) {
      return false;
    }
  }
  return true;
}
function objectHasProperty(thing, property) {
  return isDefined(thing) && typeof thing === "object" && property in thing;
}

// node_modules/@azure/core-util/dist/esm/index.js
function isError2(e) {
  return isError(e);
}
var isNodeLike2 = isNodeLike;

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/proxyPolicy.js
function proxyPolicy2(proxySettings, options) {
  return proxyPolicy(proxySettings, options);
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/setClientRequestIdPolicy.js
var setClientRequestIdPolicyName = "setClientRequestIdPolicy";
function setClientRequestIdPolicy(requestIdHeaderName = "x-ms-client-request-id") {
  return {
    name: setClientRequestIdPolicyName,
    async sendRequest(request, next) {
      if (!request.headers.has(requestIdHeaderName)) {
        request.headers.set(requestIdHeaderName, request.requestId);
      }
      return next(request);
    }
  };
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/agentPolicy.js
function agentPolicy2(agent) {
  return agentPolicy(agent);
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/tlsPolicy.js
function tlsPolicy2(tlsSettings) {
  return tlsPolicy(tlsSettings);
}

// node_modules/@azure/core-tracing/dist/esm/tracingContext.js
var knownContextKeys = {
  span: Symbol.for("@azure/core-tracing span"),
  namespace: Symbol.for("@azure/core-tracing namespace")
};
function createTracingContext(options = {}) {
  let context3 = new TracingContextImpl(options.parentContext);
  if (options.span) {
    context3 = context3.setValue(knownContextKeys.span, options.span);
  }
  if (options.namespace) {
    context3 = context3.setValue(knownContextKeys.namespace, options.namespace);
  }
  return context3;
}
var TracingContextImpl = class _TracingContextImpl {
  _contextMap;
  constructor(initialContext) {
    this._contextMap = initialContext instanceof _TracingContextImpl ? new Map(initialContext._contextMap) : /* @__PURE__ */ new Map();
  }
  setValue(key, value) {
    const newContext = new _TracingContextImpl(this);
    newContext._contextMap.set(key, value);
    return newContext;
  }
  getValue(key) {
    return this._contextMap.get(key);
  }
  deleteValue(key) {
    const newContext = new _TracingContextImpl(this);
    newContext._contextMap.delete(key);
    return newContext;
  }
};

// node_modules/@azure/core-tracing/dist/esm/state.js
var import_state_cjs = __toESM(require_state_cjs(), 1);
var state = import_state_cjs.state;

// node_modules/@azure/core-tracing/dist/esm/instrumenter.js
function createDefaultTracingSpan() {
  return {
    end: () => {
    },
    isRecording: () => false,
    recordException: () => {
    },
    setAttribute: () => {
    },
    setStatus: () => {
    },
    addEvent: () => {
    }
  };
}
function createDefaultInstrumenter() {
  return {
    createRequestHeaders: () => {
      return {};
    },
    parseTraceparentHeader: () => {
      return void 0;
    },
    startSpan: (_name, spanOptions) => {
      return {
        span: createDefaultTracingSpan(),
        tracingContext: createTracingContext({ parentContext: spanOptions.tracingContext })
      };
    },
    withContext(_context, callback, ...callbackArgs) {
      return callback(...callbackArgs);
    }
  };
}
function getInstrumenter() {
  if (!state.instrumenterImplementation) {
    state.instrumenterImplementation = createDefaultInstrumenter();
  }
  return state.instrumenterImplementation;
}

// node_modules/@azure/core-tracing/dist/esm/tracingClient.js
function createTracingClient(options) {
  const { namespace, packageName, packageVersion } = options;
  function startSpan(name, operationOptions, spanOptions) {
    const startSpanResult = getInstrumenter().startSpan(name, {
      ...spanOptions,
      packageName,
      packageVersion,
      tracingContext: operationOptions?.tracingOptions?.tracingContext
    });
    let tracingContext = startSpanResult.tracingContext;
    const span = startSpanResult.span;
    if (!tracingContext.getValue(knownContextKeys.namespace)) {
      tracingContext = tracingContext.setValue(knownContextKeys.namespace, namespace);
    }
    span.setAttribute("az.namespace", tracingContext.getValue(knownContextKeys.namespace));
    const updatedOptions = Object.assign({}, operationOptions, {
      tracingOptions: { ...operationOptions?.tracingOptions, tracingContext }
    });
    return {
      span,
      updatedOptions
    };
  }
  async function withSpan(name, operationOptions, callback, spanOptions) {
    const { span, updatedOptions } = startSpan(name, operationOptions, spanOptions);
    try {
      const result = await withContext(updatedOptions.tracingOptions.tracingContext, () => callback(updatedOptions, span));
      span.setStatus({ status: "success" });
      return result;
    } catch (err) {
      span.setStatus({ status: "error", error: err });
      throw err;
    } finally {
      span.end();
    }
  }
  function withContext(context3, callback, ...callbackArgs) {
    return getInstrumenter().withContext(context3, callback, ...callbackArgs);
  }
  function parseTraceparentHeader(traceparentHeader) {
    return getInstrumenter().parseTraceparentHeader(traceparentHeader);
  }
  function createRequestHeaders(tracingContext) {
    return getInstrumenter().createRequestHeaders(tracingContext);
  }
  return {
    startSpan,
    withSpan,
    withContext,
    parseTraceparentHeader,
    createRequestHeaders
  };
}

// node_modules/@azure/core-rest-pipeline/dist/esm/restError.js
function isRestError2(e) {
  return isRestError(e);
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/tracingPolicy.js
var tracingPolicyName = "tracingPolicy";
function tracingPolicy(options = {}) {
  const userAgentPromise = getUserAgentValue2(options.userAgentPrefix);
  const sanitizer = new Sanitizer({
    additionalAllowedQueryParameters: options.additionalAllowedQueryParameters
  });
  const tracingClient = tryCreateTracingClient();
  return {
    name: tracingPolicyName,
    async sendRequest(request, next) {
      if (!tracingClient) {
        return next(request);
      }
      const userAgent = await userAgentPromise;
      const spanAttributes = {
        "http.url": sanitizer.sanitizeUrl(request.url),
        "http.method": request.method,
        "http.user_agent": userAgent,
        requestId: request.requestId
      };
      if (userAgent) {
        spanAttributes["http.user_agent"] = userAgent;
      }
      const { span, tracingContext } = tryCreateSpan(tracingClient, request, spanAttributes) ?? {};
      if (!span || !tracingContext) {
        return next(request);
      }
      try {
        const response = await tracingClient.withContext(tracingContext, next, request);
        tryProcessResponse(span, response);
        return response;
      } catch (err) {
        tryProcessError(span, err);
        throw err;
      }
    }
  };
}
function tryCreateTracingClient() {
  try {
    return createTracingClient({
      namespace: "",
      packageName: "@azure/core-rest-pipeline",
      packageVersion: SDK_VERSION2
    });
  } catch (e) {
    logger3.warning(`Error when creating the TracingClient: ${getErrorMessage(e)}`);
    return void 0;
  }
}
function tryCreateSpan(tracingClient, request, spanAttributes) {
  try {
    const { span, updatedOptions } = tracingClient.startSpan(`HTTP ${request.method}`, { tracingOptions: request.tracingOptions }, {
      spanKind: "client",
      spanAttributes
    });
    if (!span.isRecording()) {
      span.end();
      return void 0;
    }
    const headers = tracingClient.createRequestHeaders(updatedOptions.tracingOptions.tracingContext);
    for (const [key, value] of Object.entries(headers)) {
      request.headers.set(key, value);
    }
    return { span, tracingContext: updatedOptions.tracingOptions.tracingContext };
  } catch (e) {
    logger3.warning(`Skipping creating a tracing span due to an error: ${getErrorMessage(e)}`);
    return void 0;
  }
}
function tryProcessError(span, error) {
  try {
    span.setStatus({
      status: "error",
      error: isError2(error) ? error : void 0
    });
    if (isRestError2(error) && error.statusCode) {
      span.setAttribute("http.status_code", error.statusCode);
    }
    span.end();
  } catch (e) {
    logger3.warning(`Skipping tracing span processing due to an error: ${getErrorMessage(e)}`);
  }
}
function tryProcessResponse(span, response) {
  try {
    span.setAttribute("http.status_code", response.status);
    const serviceRequestId = response.headers.get("x-ms-request-id");
    if (serviceRequestId) {
      span.setAttribute("serviceRequestId", serviceRequestId);
    }
    if (response.status >= 400) {
      span.setStatus({
        status: "error"
      });
    }
    span.end();
  } catch (e) {
    logger3.warning(`Skipping tracing span processing due to an error: ${getErrorMessage(e)}`);
  }
}

// node_modules/@azure/core-rest-pipeline/dist/esm/util/wrapAbortSignal.js
function wrapAbortSignalLike(abortSignalLike) {
  if (abortSignalLike instanceof AbortSignal) {
    return { abortSignal: abortSignalLike };
  }
  if (abortSignalLike.aborted) {
    return {
      abortSignal: AbortSignal.abort("reason" in abortSignalLike ? abortSignalLike.reason : void 0)
    };
  }
  const controller = new AbortController();
  let needsCleanup = true;
  function cleanup() {
    if (needsCleanup) {
      abortSignalLike.removeEventListener("abort", listener);
      needsCleanup = false;
    }
  }
  function listener() {
    controller.abort("reason" in abortSignalLike ? abortSignalLike.reason : void 0);
    cleanup();
  }
  abortSignalLike.addEventListener("abort", listener);
  return { abortSignal: controller.signal, cleanup };
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/wrapAbortSignalLikePolicy.js
var wrapAbortSignalLikePolicyName = "wrapAbortSignalLikePolicy";
function wrapAbortSignalLikePolicy() {
  return {
    name: wrapAbortSignalLikePolicyName,
    sendRequest: async (request, next) => {
      if (!request.abortSignal) {
        return next(request);
      }
      const { abortSignal, cleanup } = wrapAbortSignalLike(request.abortSignal);
      request.abortSignal = abortSignal;
      try {
        return await next(request);
      } finally {
        cleanup?.();
      }
    }
  };
}

// node_modules/@azure/core-rest-pipeline/dist/esm/createPipelineFromOptions.js
function createPipelineFromOptions2(options) {
  const pipeline = createEmptyPipeline2();
  if (isNodeLike2) {
    if (options.agent) {
      pipeline.addPolicy(agentPolicy2(options.agent));
    }
    if (options.tlsOptions) {
      pipeline.addPolicy(tlsPolicy2(options.tlsOptions));
    }
    pipeline.addPolicy(proxyPolicy2(options.proxyOptions));
    pipeline.addPolicy(decompressResponsePolicy2());
  }
  pipeline.addPolicy(wrapAbortSignalLikePolicy());
  pipeline.addPolicy(formDataPolicy2(), { beforePolicies: [multipartPolicyName2] });
  pipeline.addPolicy(userAgentPolicy2(options.userAgentOptions));
  pipeline.addPolicy(setClientRequestIdPolicy(options.telemetryOptions?.clientRequestIdHeaderName));
  pipeline.addPolicy(multipartPolicy2(), { afterPhase: "Deserialize" });
  pipeline.addPolicy(defaultRetryPolicy2(options.retryOptions), { phase: "Retry" });
  pipeline.addPolicy(tracingPolicy({ ...options.userAgentOptions, ...options.loggingOptions }), {
    afterPhase: "Retry"
  });
  if (isNodeLike2) {
    pipeline.addPolicy(redirectPolicy2(options.redirectOptions), { afterPhase: "Retry" });
  }
  pipeline.addPolicy(logPolicy2(options.loggingOptions), { afterPhase: "Sign" });
  return pipeline;
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/retryPolicy.js
var retryPolicyLogger2 = createClientLogger2("core-rest-pipeline retryPolicy");

// node_modules/@azure/core-rest-pipeline/dist/esm/util/tokenCycler.js
var DEFAULT_CYCLER_OPTIONS = {
  forcedRefreshWindowInMs: 1e3,
  // Force waiting for a refresh 1s before the token expires
  retryIntervalInMs: 3e3,
  // Allow refresh attempts every 3s
  refreshWindowInMs: 1e3 * 60 * 2
  // Start refreshing 2m before expiry
};
async function beginRefresh(getAccessToken, retryIntervalInMs, refreshTimeout) {
  async function tryGetAccessToken() {
    if (Date.now() < refreshTimeout) {
      try {
        return await getAccessToken();
      } catch {
        return null;
      }
    } else {
      const finalToken = await getAccessToken();
      if (finalToken === null) {
        throw new Error("Failed to refresh access token.");
      }
      return finalToken;
    }
  }
  let token = await tryGetAccessToken();
  while (token === null) {
    await delay2(retryIntervalInMs);
    token = await tryGetAccessToken();
  }
  return token;
}
function createTokenCycler(credential, tokenCyclerOptions) {
  let refreshWorker = null;
  let token = null;
  let tenantId;
  const options = {
    ...DEFAULT_CYCLER_OPTIONS,
    ...tokenCyclerOptions
  };
  const cycler = {
    /**
     * Produces true if a refresh job is currently in progress.
     */
    get isRefreshing() {
      return refreshWorker !== null;
    },
    /**
     * Produces true if the cycler SHOULD refresh (we are within the refresh
     * window and not already refreshing)
     */
    get shouldRefresh() {
      if (token === null) {
        return true;
      }
      if (cycler.isRefreshing) {
        return false;
      }
      if (token.refreshAfterTimestamp && token.refreshAfterTimestamp < Date.now()) {
        return true;
      }
      return token.expiresOnTimestamp - options.refreshWindowInMs < Date.now();
    },
    /**
     * Produces true if the cycler MUST refresh (null or nearly-expired
     * token).
     */
    get mustRefresh() {
      return token === null || token.expiresOnTimestamp - options.forcedRefreshWindowInMs < Date.now();
    }
  };
  function refresh(scopes, getTokenOptions) {
    if (!cycler.isRefreshing) {
      const tryGetAccessToken = () => credential.getToken(scopes, getTokenOptions);
      refreshWorker = beginRefresh(
        tryGetAccessToken,
        options.retryIntervalInMs,
        // If we don't have a token, then we should timeout immediately
        token?.expiresOnTimestamp ?? Date.now()
      ).then((_token) => {
        refreshWorker = null;
        token = _token;
        tenantId = getTokenOptions.tenantId;
        return token;
      }).catch((reason) => {
        refreshWorker = null;
        token = null;
        tenantId = void 0;
        throw reason;
      });
    }
    return refreshWorker;
  }
  return async (scopes, tokenOptions) => {
    const hasClaimChallenge = Boolean(tokenOptions.claims);
    const tenantIdChanged = tenantId !== tokenOptions.tenantId;
    if (hasClaimChallenge) {
      token = null;
    }
    const mustRefresh = tenantIdChanged || hasClaimChallenge || cycler.mustRefresh;
    if (mustRefresh) {
      return refresh(scopes, tokenOptions);
    }
    if (cycler.shouldRefresh) {
      refresh(scopes, tokenOptions);
    }
    return token;
  };
}

// node_modules/@azure/core-rest-pipeline/dist/esm/policies/bearerTokenAuthenticationPolicy.js
var bearerTokenAuthenticationPolicyName = "bearerTokenAuthenticationPolicy";
async function trySendRequest(request, next) {
  try {
    return [await next(request), void 0];
  } catch (e) {
    if (isRestError2(e) && e.response) {
      return [e.response, e];
    } else {
      throw e;
    }
  }
}
async function defaultAuthorizeRequest(options) {
  const { scopes, getAccessToken, request } = options;
  const getTokenOptions = {
    abortSignal: request.abortSignal,
    tracingOptions: request.tracingOptions,
    enableCae: true
  };
  const accessToken = await getAccessToken(scopes, getTokenOptions);
  if (accessToken) {
    options.request.headers.set("Authorization", `Bearer ${accessToken.token}`);
  }
}
function isChallengeResponse(response) {
  return response.status === 401 && response.headers.has("WWW-Authenticate");
}
async function authorizeRequestOnCaeChallenge(onChallengeOptions, caeClaims) {
  const { scopes } = onChallengeOptions;
  const accessToken = await onChallengeOptions.getAccessToken(scopes, {
    enableCae: true,
    claims: caeClaims
  });
  if (!accessToken) {
    return false;
  }
  onChallengeOptions.request.headers.set("Authorization", `${accessToken.tokenType ?? "Bearer"} ${accessToken.token}`);
  return true;
}
function bearerTokenAuthenticationPolicy(options) {
  const { credential, scopes, challengeCallbacks } = options;
  const logger4 = options.logger || logger3;
  const callbacks = {
    authorizeRequest: challengeCallbacks?.authorizeRequest?.bind(challengeCallbacks) ?? defaultAuthorizeRequest,
    authorizeRequestOnChallenge: challengeCallbacks?.authorizeRequestOnChallenge?.bind(challengeCallbacks)
  };
  const getAccessToken = credential ? createTokenCycler(
    credential
    /* , options */
  ) : () => Promise.resolve(null);
  return {
    name: bearerTokenAuthenticationPolicyName,
    /**
     * If there's no challenge parameter:
     * - It will try to retrieve the token using the cache, or the credential's getToken.
     * - Then it will try the next policy with or without the retrieved token.
     *
     * It uses the challenge parameters to:
     * - Skip a first attempt to get the token from the credential if there's no cached token,
     *   since it expects the token to be retrievable only after the challenge.
     * - Prepare the outgoing request if the `prepareRequest` method has been provided.
     * - Send an initial request to receive the challenge if it fails.
     * - Process a challenge if the response contains it.
     * - Retrieve a token with the challenge information, then re-send the request.
     */
    async sendRequest(request, next) {
      if (!request.url.toLowerCase().startsWith("https://")) {
        throw new Error("Bearer token authentication is not permitted for non-TLS protected (non-https) URLs.");
      }
      await callbacks.authorizeRequest({
        scopes: Array.isArray(scopes) ? scopes : [scopes],
        request,
        getAccessToken,
        logger: logger4
      });
      let response;
      let error;
      let shouldSendRequest;
      [response, error] = await trySendRequest(request, next);
      if (isChallengeResponse(response)) {
        let claims = getCaeChallengeClaims(response.headers.get("WWW-Authenticate"));
        if (claims) {
          let parsedClaim;
          try {
            parsedClaim = atob(claims);
          } catch (e) {
            logger4.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${claims}`);
            return response;
          }
          shouldSendRequest = await authorizeRequestOnCaeChallenge({
            scopes: Array.isArray(scopes) ? scopes : [scopes],
            response,
            request,
            getAccessToken,
            logger: logger4
          }, parsedClaim);
          if (shouldSendRequest) {
            [response, error] = await trySendRequest(request, next);
          }
        } else if (callbacks.authorizeRequestOnChallenge) {
          shouldSendRequest = await callbacks.authorizeRequestOnChallenge({
            scopes: Array.isArray(scopes) ? scopes : [scopes],
            request,
            response,
            getAccessToken,
            logger: logger4
          });
          if (shouldSendRequest) {
            [response, error] = await trySendRequest(request, next);
          }
          if (isChallengeResponse(response)) {
            claims = getCaeChallengeClaims(response.headers.get("WWW-Authenticate") ?? "");
            if (claims) {
              let parsedClaim;
              try {
                parsedClaim = atob(claims);
              } catch (e) {
                logger4.warning(`The WWW-Authenticate header contains "claims" that cannot be parsed. Unable to perform the Continuous Access Evaluation authentication flow. Unparsable claims: ${claims}`);
                return response;
              }
              shouldSendRequest = await authorizeRequestOnCaeChallenge({
                scopes: Array.isArray(scopes) ? scopes : [scopes],
                response,
                request,
                getAccessToken,
                logger: logger4
              }, parsedClaim);
              if (shouldSendRequest) {
                [response, error] = await trySendRequest(request, next);
              }
            }
          }
        }
      }
      if (error) {
        throw error;
      } else {
        return response;
      }
    }
  };
}
function parseChallenges(challenges) {
  const challengeRegex = /(\w+)\s+((?:\w+=(?:"[^"]*"|[^,]*),?\s*)+)/g;
  const paramRegex = /(\w+)="([^"]*)"/g;
  const parsedChallenges = [];
  let match;
  while ((match = challengeRegex.exec(challenges)) !== null) {
    const scheme = match[1];
    const paramsString = match[2];
    const params = {};
    let paramMatch;
    while ((paramMatch = paramRegex.exec(paramsString)) !== null) {
      params[paramMatch[1]] = paramMatch[2];
    }
    parsedChallenges.push({ scheme, params });
  }
  return parsedChallenges;
}
function getCaeChallengeClaims(challenges) {
  if (!challenges) {
    return;
  }
  const parsedChallenges = parseChallenges(challenges);
  return parsedChallenges.find((x) => x.scheme === "Bearer" && x.params.claims && x.params.error === "insufficient_claims")?.params.claims;
}

// node_modules/@azure/core-auth/dist/esm/keyCredential.js
function isKeyCredential(credential) {
  return isObjectWithProperties(credential, ["key"]) && typeof credential.key === "string";
}

// node_modules/@azure/core-auth/dist/esm/tokenCredential.js
function isTokenCredential(credential) {
  const castCredential = credential;
  return castCredential && typeof castCredential.getToken === "function" && (castCredential.signRequest === void 0 || castCredential.getToken.length > 0);
}

// node_modules/@azure-rest/core-client/dist/esm/apiVersionPolicy.js
var apiVersionPolicyName2 = "ApiVersionPolicy";
function apiVersionPolicy2(options) {
  return {
    name: apiVersionPolicyName2,
    sendRequest: (req, next) => {
      const url = new URL(req.url);
      if (!url.searchParams.get("api-version") && options.apiVersion) {
        req.url = `${req.url}${url.searchParams.size > 0 ? "&" : "?"}api-version=${options.apiVersion}`;
      }
      return next(req);
    }
  };
}

// node_modules/@azure-rest/core-client/dist/esm/keyCredentialAuthenticationPolicy.js
var keyCredentialAuthenticationPolicyName = "keyCredentialAuthenticationPolicy";
function keyCredentialAuthenticationPolicy(credential, apiKeyHeaderName) {
  return {
    name: keyCredentialAuthenticationPolicyName,
    sendRequest(request, next) {
      request.headers.set(apiKeyHeaderName, credential.key);
      return next(request);
    }
  };
}

// node_modules/@azure-rest/core-client/dist/esm/clientHelpers.js
function addCredentialPipelinePolicy(pipeline, endpoint, options = {}) {
  const { credential, clientOptions } = options;
  if (!credential) {
    return;
  }
  if (isTokenCredential(credential)) {
    const tokenPolicy = bearerTokenAuthenticationPolicy({
      credential,
      scopes: clientOptions?.credentials?.scopes ?? `${endpoint}/.default`
    });
    pipeline.addPolicy(tokenPolicy);
  } else if (isKeyCredential2(credential)) {
    if (!clientOptions?.credentials?.apiKeyHeaderName) {
      throw new Error(`Missing API Key Header Name`);
    }
    const keyPolicy = keyCredentialAuthenticationPolicy(credential, clientOptions?.credentials?.apiKeyHeaderName);
    pipeline.addPolicy(keyPolicy);
  }
}
function createDefaultPipeline2(endpoint, credential, options = {}) {
  const pipeline = createPipelineFromOptions2(options);
  pipeline.addPolicy(apiVersionPolicy2(options));
  addCredentialPipelinePolicy(pipeline, endpoint, { credential, clientOptions: options });
  return pipeline;
}
function isKeyCredential2(credential) {
  return typeof credential === "object" && credential !== null && "key" in credential && typeof credential.key === "string";
}

// node_modules/@azure-rest/core-client/dist/esm/operationOptionHelpers.js
function operationOptionsToRequestParameters2(options) {
  const compatibilityOptions = options;
  const tspRequestParameters = operationOptionsToRequestParameters(options);
  return {
    ...tspRequestParameters,
    headers: mergeHeaders(compatibilityOptions.requestOptions?.customHeaders, tspRequestParameters.headers),
    tracingOptions: options.tracingOptions
  };
}
function mergeHeaders(...headerSets) {
  const headers = /* @__PURE__ */ new Map();
  for (const headerSet of headerSets) {
    for (const [name, value] of Object.entries(headerSet ?? {})) {
      headers.set(name.toLowerCase(), value);
    }
  }
  return Object.fromEntries(headers);
}

// node_modules/@azure-rest/core-client/dist/esm/getClient.js
function wrapRequestParameters(parameters) {
  if (parameters.onResponse) {
    return {
      ...parameters,
      onResponse(rawResponse, error) {
        parameters.onResponse?.(rawResponse, error, error);
      }
    };
  }
  return parameters;
}
function getClient2(endpoint, credentialsOrPipelineOptions, clientOptions = {}) {
  let credentials;
  if (credentialsOrPipelineOptions) {
    if (isCredential(credentialsOrPipelineOptions)) {
      credentials = credentialsOrPipelineOptions;
    } else {
      clientOptions = credentialsOrPipelineOptions ?? {};
    }
  }
  const pipeline = clientOptions.pipeline ?? createDefaultPipeline2(endpoint, credentials, clientOptions);
  const tspClient = getClient(endpoint, {
    ...clientOptions,
    pipeline
  });
  const client = (path, ...args) => {
    return {
      get: (requestOptions = {}) => {
        return tspClient.path(path, ...args).get(wrapRequestParameters(requestOptions));
      },
      post: (requestOptions = {}) => {
        return tspClient.path(path, ...args).post(wrapRequestParameters(requestOptions));
      },
      put: (requestOptions = {}) => {
        return tspClient.path(path, ...args).put(wrapRequestParameters(requestOptions));
      },
      patch: (requestOptions = {}) => {
        return tspClient.path(path, ...args).patch(wrapRequestParameters(requestOptions));
      },
      delete: (requestOptions = {}) => {
        return tspClient.path(path, ...args).delete(wrapRequestParameters(requestOptions));
      },
      head: (requestOptions = {}) => {
        return tspClient.path(path, ...args).head(wrapRequestParameters(requestOptions));
      },
      options: (requestOptions = {}) => {
        return tspClient.path(path, ...args).options(wrapRequestParameters(requestOptions));
      },
      trace: (requestOptions = {}) => {
        return tspClient.path(path, ...args).trace(wrapRequestParameters(requestOptions));
      }
    };
  };
  return {
    path: client,
    pathUnchecked: client,
    pipeline: tspClient.pipeline
  };
}
function isCredential(param) {
  return isKeyCredential(param) || isTokenCredential(param);
}

// node_modules/@azure/monitor-query-logs/dist/esm/api/monitorQueryLogsContext.js
function createMonitorQueryLogs(credential, options = {}) {
  const endpointParam = options.endpoint ?? "https://api.loganalytics.io";
  const apiVersion = options.apiVersion ?? "v1";
  const endpointUrl = options.endpoint ?? options.baseUrl ?? `${endpointParam}/${apiVersion}`;
  const prefixFromOptions = options?.userAgentOptions?.userAgentPrefix;
  const userAgentInfo = `azsdk-js-monitor-query-logs/1.0.0`;
  const userAgentPrefix = prefixFromOptions ? `${prefixFromOptions} azsdk-js-api ${userAgentInfo}` : `azsdk-js-api ${userAgentInfo}`;
  const { apiVersion: _, ...updatedOptions } = {
    ...options,
    userAgentOptions: { userAgentPrefix },
    loggingOptions: { logger: options.loggingOptions?.logger ?? logger.info },
    credentials: {
      scopes: options.credentials?.scopes ?? ["https://api.loganalytics.io/.default"]
    }
  };
  const clientContext = getClient2(endpointUrl, credential, updatedOptions);
  clientContext.pipeline.removePolicy({ name: "ApiVersionPolicy" });
  return { ...clientContext, apiVersion };
}

// node_modules/@azure/monitor-query-logs/dist/esm/models/public.js
var LogsQueryResultStatus;
(function(LogsQueryResultStatus2) {
  LogsQueryResultStatus2["Success"] = "Success";
  LogsQueryResultStatus2["PartialFailure"] = "PartialFailure";
  LogsQueryResultStatus2["Failure"] = "Failure";
})(LogsQueryResultStatus || (LogsQueryResultStatus = {}));
var KnownMonitorLogsQueryAudience;
(function(KnownMonitorLogsQueryAudience2) {
  KnownMonitorLogsQueryAudience2["AzurePublicCloud"] = "https://api.loganalytics.io";
  KnownMonitorLogsQueryAudience2["AzureChina"] = "https://api.loganalytics.azure.cn";
  KnownMonitorLogsQueryAudience2["AzureGovernment"] = "https://api.loganalytics.us";
})(KnownMonitorLogsQueryAudience || (KnownMonitorLogsQueryAudience = {}));

// node_modules/@azure/monitor-query-logs/dist/esm/models/models.js
function convertQueryBatch(query, id) {
  const headers = {};
  const preferParts = [];
  if (query.serverTimeoutInSeconds) {
    preferParts.push(`wait=${query.serverTimeoutInSeconds}`);
  }
  if (query.includeQueryStatistics) {
    preferParts.push("include-statistics=true");
  }
  if (query.includeVisualization) {
    preferParts.push("include-render=true");
  }
  if (preferParts.length > 0) {
    headers.prefer = preferParts.join(",");
  }
  return {
    id,
    query: query.query,
    timespan: query.timespan,
    headers: Object.keys(headers).length > 0 ? headers : void 0,
    workspaces: query.additionalWorkspaces,
    workspace: query.workspaceId
  };
}
function queryBodySerializer(item) {
  return {
    query: item["query"],
    timespan: item["timespan"],
    workspaces: !item["workspaces"] ? item["workspaces"] : item["workspaces"].map((p) => {
      return p;
    })
  };
}
function queryResultsDeserializer(item) {
  return {
    tables: tableArrayDeserializer(item["tables"]),
    statistics: item["statistics"],
    render: item["render"],
    error: !item["error"] ? item["error"] : errorInfoDeserializer(item["error"])
  };
}
function convertTable(table) {
  const dynamicsIndices = [];
  const datesIndices = [];
  for (let i = 0; i < table.columns.length; ++i) {
    if (table.columns[i].type === "datetime") {
      datesIndices.push(i);
    } else if (table.columns[i].type === "dynamic") {
      dynamicsIndices.push(i);
    }
  }
  return {
    name: table.name,
    columnDescriptors: table.columns,
    rows: table.rows.map((originalRow) => {
      const row = [...originalRow];
      for (const dateIndex of datesIndices) {
        if (row[dateIndex] != null && typeof row[dateIndex] === "string") {
          row[dateIndex] = new Date(row[dateIndex]);
        }
      }
      for (const dynamicIndex of dynamicsIndices) {
        try {
          if (row[dynamicIndex] != null && typeof row[dynamicIndex] === "string") {
            row[dynamicIndex] = JSON.parse(row[dynamicIndex]);
          }
        } catch (_err) {
        }
      }
      return row;
    })
  };
}
function convertToLogsQueryResult(queryResults) {
  const convertedTables = queryResults.tables.map(convertTable);
  if (queryResults.error) {
    return {
      status: LogsQueryResultStatus.PartialFailure,
      partialTables: convertedTables,
      partialError: queryResults.error,
      statistics: queryResults.statistics,
      visualization: queryResults.render
    };
  }
  return {
    status: LogsQueryResultStatus.Success,
    tables: convertedTables,
    statistics: queryResults.statistics,
    visualization: queryResults.render
  };
}
function tableArrayDeserializer(result) {
  return result.map((item) => {
    return tableDeserializer(item);
  });
}
function tableDeserializer(item) {
  return {
    name: item["name"],
    columns: columnArrayDeserializer(item["columns"]),
    rows: item["rows"].map((row) => {
      return row.map((cell) => {
        return cell;
      });
    })
  };
}
function columnArrayDeserializer(result) {
  return result.map((item) => {
    return columnDeserializer(item);
  });
}
function columnDeserializer(item) {
  return {
    name: item["name"],
    type: item["type"]
  };
}
function errorInfoDeserializer(item) {
  return {
    code: item["code"],
    message: item["message"],
    details: !item["details"] ? item["details"] : errorDetailArrayDeserializer(item["details"]),
    innererror: !item["innererror"] ? item["innererror"] : errorInfoDeserializer(item["innererror"]),
    additionalProperties: item["additionalProperties"]
  };
}
function errorDetailArrayDeserializer(result) {
  return result.map((item) => {
    return errorDetailDeserializer(item);
  });
}
function errorDetailDeserializer(item) {
  return {
    code: item["code"],
    message: item["message"],
    target: item["target"],
    value: item["value"],
    resources: !item["resources"] ? item["resources"] : item["resources"].map((p) => {
      return p;
    }),
    additionalProperties: item["additionalProperties"]
  };
}
function errorResponseDeserializer(item) {
  return {
    error: errorInfoDeserializer(item["error"])
  };
}
function batchRequestSerializer(item) {
  return { requests: batchQueryRequestArraySerializer(item["requests"]) };
}
function batchQueryRequestArraySerializer(result) {
  return result.map((item) => {
    return batchQueryRequestSerializer(item);
  });
}
function batchQueryRequestSerializer(item) {
  return {
    id: item["id"],
    headers: item["headers"],
    body: queryBodySerializer(item["body"]),
    path: item["path"],
    method: item["method"],
    workspace: item["workspace"]
  };
}
function batchResponseDeserializer(item) {
  return {
    responses: !item["responses"] ? item["responses"] : batchQueryResponseArrayDeserializer(item["responses"])
  };
}
function convertToLogsBatchResult(internalResult) {
  if (!internalResult.responses) {
    return [];
  }
  return internalResult.responses.map((response) => {
    if (!response.body) {
      const error = {
        name: "LogsQueryError",
        message: "Query failed with no response body",
        code: response.status?.toString() || "Unknown",
        status: LogsQueryResultStatus.Failure
      };
      return error;
    }
    const queryResults = {
      tables: response.body.tables || [],
      statistics: response.body.statistics,
      render: response.body.render,
      error: response.body.error
    };
    const queryResult = convertToLogsQueryResult(queryResults);
    if (queryResult.status === LogsQueryResultStatus.PartialFailure) {
      return queryResult;
    }
    return queryResult;
  });
}
function batchQueryResponseArrayDeserializer(result) {
  return result.map((item) => {
    return batchQueryResponseDeserializer(item);
  });
}
function batchQueryResponseDeserializer(item) {
  return {
    id: item["id"],
    status: item["status"],
    body: !item["body"] ? item["body"] : batchQueryResultsDeserializer(item["body"]),
    headers: item["headers"]
  };
}
function batchQueryResultsDeserializer(item) {
  return {
    tables: !item["tables"] ? item["tables"] : tableArrayDeserializer(item["tables"]),
    statistics: item["statistics"],
    render: item["render"],
    error: !item["error"] ? item["error"] : errorInfoDeserializer(item["error"])
  };
}

// node_modules/@azure/monitor-query-logs/dist/esm/static-helpers/urlTemplate.js
function encodeComponent(val, reserved, op) {
  return (reserved ?? op === "+") || op === "#" ? encodeReservedComponent(val) : encodeRFC3986URIComponent(val);
}
function encodeReservedComponent(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map((part) => !/%[0-9A-Fa-f]/.test(part) ? encodeURI(part) : part).join("");
}
function encodeRFC3986URIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}
function isDefined2(val) {
  return val !== void 0 && val !== null;
}
function getNamedAndIfEmpty(op) {
  return [!!op && [";", "?", "&"].includes(op), !!op && ["?", "&"].includes(op) ? "=" : ""];
}
function getFirstOrSep(op, isFirst = false) {
  if (isFirst) {
    return !op || op === "+" ? "" : op;
  } else if (!op || op === "+" || op === "#") {
    return ",";
  } else if (op === "?") {
    return "&";
  } else {
    return op;
  }
}
function getExpandedValue(option) {
  let isFirst = option.isFirst;
  const { op, varName, varValue: value, reserved } = option;
  const vals = [];
  const [named, ifEmpty] = getNamedAndIfEmpty(op);
  if (Array.isArray(value)) {
    for (const val of value.filter(isDefined2)) {
      vals.push(`${getFirstOrSep(op, isFirst)}`);
      if (named && varName) {
        vals.push(`${encodeURIComponent(varName)}`);
        if (val === "") {
          vals.push(ifEmpty);
        } else {
          vals.push("=");
        }
      }
      vals.push(encodeComponent(val, reserved, op));
      isFirst = false;
    }
  } else if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      const val = value[key];
      if (!isDefined2(val)) {
        continue;
      }
      vals.push(`${getFirstOrSep(op, isFirst)}`);
      if (key) {
        vals.push(`${encodeURIComponent(key)}`);
        if (named && val === "") {
          vals.push(ifEmpty);
        } else {
          vals.push("=");
        }
      }
      vals.push(encodeComponent(val, reserved, op));
      isFirst = false;
    }
  }
  return vals.join("");
}
function getNonExpandedValue(option) {
  const { op, varName, varValue: value, isFirst, reserved } = option;
  const vals = [];
  const first = getFirstOrSep(op, isFirst);
  const [named, ifEmpty] = getNamedAndIfEmpty(op);
  if (named && varName) {
    vals.push(encodeComponent(varName, reserved, op));
    if (value === "") {
      if (!ifEmpty) {
        vals.push(ifEmpty);
      }
      return !vals.join("") ? void 0 : `${first}${vals.join("")}`;
    }
    vals.push("=");
  }
  const items = [];
  if (Array.isArray(value)) {
    for (const val of value.filter(isDefined2)) {
      items.push(encodeComponent(val, reserved, op));
    }
  } else if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (!isDefined2(value[key])) {
        continue;
      }
      items.push(encodeRFC3986URIComponent(key));
      items.push(encodeComponent(value[key], reserved, op));
    }
  }
  vals.push(items.join(","));
  return !vals.join(",") ? void 0 : `${first}${vals.join("")}`;
}
function getVarValue(option) {
  const { op, varName, modifier, isFirst, reserved, varValue: value } = option;
  if (!isDefined2(value)) {
    return void 0;
  } else if (["string", "number", "boolean"].includes(typeof value)) {
    let val = value.toString();
    const [named, ifEmpty] = getNamedAndIfEmpty(op);
    const vals = [getFirstOrSep(op, isFirst)];
    if (named && varName) {
      vals.push(varName);
      if (val === "") {
        vals.push(ifEmpty);
      } else {
        vals.push("=");
      }
    }
    if (modifier && modifier !== "*") {
      val = val.substring(0, parseInt(modifier, 10));
    }
    vals.push(encodeComponent(val, reserved, op));
    return vals.join("");
  } else if (modifier === "*") {
    return getExpandedValue(option);
  } else {
    return getNonExpandedValue(option);
  }
}
function expandUrlTemplate(template, context3, option) {
  return template.replace(/\{([^{}]+)\}|([^{}]+)/g, (_, expr, text) => {
    if (!expr) {
      return encodeReservedComponent(text);
    }
    let op;
    let expressionToParse = expr;
    if (["+", "#", ".", "/", ";", "?", "&"].includes(expressionToParse[0])) {
      op = expressionToParse[0];
      expressionToParse = expressionToParse.slice(1);
    }
    const varList = expressionToParse.split(/,/g);
    const result = [];
    for (const varSpec of varList) {
      const varMatch = /([^:*]*)(?::(\d+)|(\*))?/.exec(varSpec);
      if (!varMatch || !varMatch[1]) {
        continue;
      }
      const varValue = getVarValue({
        isFirst: result.length === 0,
        op,
        varValue: context3[varMatch[1]],
        varName: varMatch[1],
        modifier: varMatch[2] || varMatch[3],
        reserved: option?.allowReserved
      });
      if (varValue) {
        result.push(varValue);
      }
    }
    return result.join("");
  });
}

// node_modules/@azure/monitor-query-logs/dist/esm/api/operations.js
function _batchSend(context3, body, options = { requestOptions: {} }) {
  return context3.path("/$batch").post({
    ...operationOptionsToRequestParameters2(options),
    contentType: "application/json",
    headers: {
      accept: "application/json",
      ...options.requestOptions?.headers
    },
    body: batchRequestSerializer(body)
  });
}
async function _batchDeserialize(result) {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError2(result);
    error.details = errorResponseDeserializer(result.body);
    throw error;
  }
  const internalResult = batchResponseDeserializer(result.body);
  return convertToLogsBatchResult(internalResult);
}
async function batch(context3, body, options = { requestOptions: {} }) {
  const result = await _batchSend(context3, body, options);
  return _batchDeserialize(result);
}
function _executeWithResourceIdSend(context3, resourceId, body, options = { requestOptions: {} }) {
  const path = expandUrlTemplate("/{+resourceId}/query", {
    resourceId
  }, {
    allowReserved: options?.requestOptions?.skipUrlEncoding
  });
  return context3.path(path).post({
    ...operationOptionsToRequestParameters2(options),
    contentType: "application/json",
    headers: {
      ...options?.prefer !== void 0 ? { Prefer: options?.prefer } : {},
      accept: "application/json",
      ...options.requestOptions?.headers
    },
    body: queryBodySerializer(body)
  });
}
async function _executeWithResourceIdDeserialize(result) {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError2(result);
    error.details = errorResponseDeserializer(result.body);
    throw error;
  }
  return convertToLogsQueryResult(queryResultsDeserializer(result.body));
}
async function executeWithResourceId(context3, resourceId, body, options = { requestOptions: {} }) {
  const result = await _executeWithResourceIdSend(context3, resourceId, body, options);
  return _executeWithResourceIdDeserialize(result);
}
function _executeSend(context3, workspaceId, body, options = { requestOptions: {} }) {
  const path = expandUrlTemplate("/workspaces/{workspaceId}/query", {
    workspaceId
  }, {
    allowReserved: options?.requestOptions?.skipUrlEncoding
  });
  return context3.path(path).post({
    ...operationOptionsToRequestParameters2(options),
    contentType: "application/json",
    headers: {
      ...options?.prefer !== void 0 ? { Prefer: options?.prefer } : {},
      accept: "application/json",
      ...options.requestOptions?.headers
    },
    body: queryBodySerializer(body)
  });
}
async function _executeDeserialize(result) {
  const expectedStatuses = ["200"];
  if (!expectedStatuses.includes(result.status)) {
    const error = createRestError2(result);
    error.details = errorResponseDeserializer(result.body);
    throw error;
  }
  return convertToLogsQueryResult(queryResultsDeserializer(result.body));
}
async function execute(context3, workspaceId, body, options = { requestOptions: {} }) {
  const result = await _executeSend(context3, workspaceId, body, options);
  return _executeDeserialize(result);
}

// node_modules/@azure/monitor-query-logs/dist/esm/static-helpers/timespanConversion.js
function convertTimespanToInterval(timespan) {
  if (isObjectWithProperties(timespan, ["startTime", "endTime", "duration"])) {
    throw new TypeError("Invalid Timespan - contains startTime, endTime, and duration.");
  }
  if (isObjectWithProperties(timespan, ["startTime", "endTime"])) {
    return `${timespan.startTime.toISOString()}/${timespan.endTime.toISOString()}`;
  } else if (isObjectWithProperties(timespan, ["startTime", "duration"])) {
    return `${timespan.startTime.toISOString()}/${timespan.duration}`;
  } else if (isObjectWithProperties(timespan, ["duration", "endTime"])) {
    return `${timespan.duration}/${timespan.endTime.toISOString()}`;
  } else if (isObjectWithProperties(timespan, ["duration"])) {
    return timespan.duration;
  }
  throw new TypeError("Invalid Timespan - no valid fields assigned.");
}

// node_modules/@azure/monitor-query-logs/dist/esm/logsQueryClient.js
function convertToInternalOptions(options) {
  if (!options) {
    return { requestOptions: {} };
  }
  const preferParts = [];
  if (options.serverTimeoutInSeconds !== void 0) {
    preferParts.push(`wait=${options.serverTimeoutInSeconds}`);
  }
  if (options.includeQueryStatistics) {
    preferParts.push("include-statistics=true");
  }
  if (options.includeVisualization) {
    preferParts.push("include-render=true");
  }
  const prefer = preferParts.length > 0 ? preferParts.join(",") : void 0;
  return {
    prefer,
    requestOptions: options.requestOptions ? options.requestOptions : {}
  };
}
var LogsQueryClient = class {
  _client;
  /** The pipeline used by this client to make requests */
  pipeline;
  /**
   * Initializes a new instance of the LogsQueryClient.
   * @param tokenCredential - The credential to use for authentication.
   * @param options - The optional parameters for the client.
   */
  constructor(tokenCredential, options = {}) {
    const prefixFromOptions = options?.userAgentOptions?.userAgentPrefix;
    const userAgentPrefix = prefixFromOptions ? `${prefixFromOptions} azsdk-js-client` : `azsdk-js-client`;
    this._client = createMonitorQueryLogs(tokenCredential, {
      ...options,
      userAgentOptions: { userAgentPrefix }
    });
    this.pipeline = this._client.pipeline;
  }
  /**
   * Executes a batch of Analytics queries for data.
   * [Here](https://learn.microsoft.com/azure/azure-monitor/logs/api/batch-queries)
   * is an example for using POST with an Analytics query.
   * @param batch - The batch of queries to execute.
   * @param options - The optional parameters for the operation.
   * @returns The results of the batch of queries.
   */
  queryBatch(batch2, options = { requestOptions: {} }) {
    const requests = batch2.map((q, index) => {
      const id = `query-${index}`;
      const internalQuery = convertQueryBatch(q, id);
      return {
        id: internalQuery.id,
        body: {
          query: internalQuery.query,
          timespan: internalQuery.timespan ? convertTimespanToInterval(internalQuery.timespan) : void 0,
          workspaces: internalQuery.workspaces
        },
        path: "/query",
        method: "POST",
        workspace: internalQuery.workspace,
        headers: internalQuery.headers
      };
    });
    return batch(this._client, { requests }, options);
  }
  /**
   * Executes an Analytics query for data in the context of a resource.
   * [Here](https://learn.microsoft.com/azure/azure-monitor/logs/api/azure-resource-queries)
   * is an example for using POST with an Analytics query.
   * @param resourceId - The resource ID to query the data for.
   * @param query - The query to execute.
   * @param timespan - The timespan for the query.
   * @param options - The optional parameters for the operation.
   * @returns The results of the query.
   */
  queryResource(resourceId, query, timespan, options) {
    const internalOptions = convertToInternalOptions(options);
    const body = {
      query,
      timespan: convertTimespanToInterval(timespan),
      workspaces: options?.additionalWorkspaces
    };
    return executeWithResourceId(this._client, resourceId, body, internalOptions);
  }
  /**
   * Executes an Analytics query for data.
   * [Here](https://learn.microsoft.com/azure/azure-monitor/logs/api/request-format)
   * is an example for using POST with an Analytics query.
   * @param workspaceId - The workspace ID to query the data for.
   * @param query - The query to execute.
   * @param timespan - The timespan for the query.
   * @param options - The optional parameters for the operation.
   * @returns The results of the query.
   */
  queryWorkspace(workspaceId, query, timespan, options) {
    const internalOptions = convertToInternalOptions(options);
    const body = {
      query,
      timespan: convertTimespanToInterval(timespan),
      workspaces: options?.additionalWorkspaces
    };
    return execute(this._client, workspaceId, body, internalOptions);
  }
};
export {
  LogsQueryClient
};
