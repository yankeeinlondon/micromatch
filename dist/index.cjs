var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// src/index.js
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
var import_util = __toESM(require("util"), 1);
var import_braces = __toESM(require("braces"), 1);
var import_picomatch = __toESM(require("picomatch"), 1);
var isEmptyString = (val) => val === "" || val === "./";
var micromatch = (list, patterns, options) => {
  patterns = [].concat(patterns);
  list = [].concat(list);
  let omit = /* @__PURE__ */ new Set();
  let keep = /* @__PURE__ */ new Set();
  let items = /* @__PURE__ */ new Set();
  let negatives = 0;
  let onResult = (state) => {
    items.add(state.output);
    if (options && options.onResult) {
      options.onResult(state);
    }
  };
  for (let i = 0; i < patterns.length; i++) {
    let isMatch = (0, import_picomatch.default)(String(patterns[i]), __spreadProps(__spreadValues({}, options), { onResult }), true);
    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
    if (negated)
      negatives++;
    for (let item of list) {
      let matched = isMatch(item, true);
      let match = negated ? !matched.isMatch : matched.isMatch;
      if (!match)
        continue;
      if (negated) {
        omit.add(matched.output);
      } else {
        omit.delete(matched.output);
        keep.add(matched.output);
      }
    }
  }
  let result = negatives === patterns.length ? [...items] : [...keep];
  let matches = result.filter((item) => !omit.has(item));
  if (options && matches.length === 0) {
    if (options.failglob === true) {
      throw new Error(`No matches found for "${patterns.join(", ")}"`);
    }
    if (options.nonull === true || options.nullglob === true) {
      return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
    }
  }
  return matches;
};
micromatch.match = micromatch;
micromatch.matcher = (pattern, options) => (0, import_picomatch.default)(pattern, options);
micromatch.isMatch = (str, patterns, options) => (0, import_picomatch.default)(patterns, options)(str);
micromatch.any = micromatch.isMatch;
micromatch.not = (list, patterns, options = {}) => {
  patterns = [].concat(patterns).map(String);
  let result = /* @__PURE__ */ new Set();
  let items = [];
  let onResult = (state) => {
    if (options.onResult)
      options.onResult(state);
    items.push(state.output);
  };
  let matches = new Set(micromatch(list, patterns, __spreadProps(__spreadValues({}, options), { onResult })));
  for (let item of items) {
    if (!matches.has(item)) {
      result.add(item);
    }
  }
  return [...result];
};
micromatch.contains = (str, pattern, options) => {
  if (typeof str !== "string") {
    throw new TypeError(`Expected a string: "${import_util.default.inspect(str)}"`);
  }
  if (Array.isArray(pattern)) {
    return pattern.some((p) => micromatch.contains(str, p, options));
  }
  if (typeof pattern === "string") {
    if (isEmptyString(str) || isEmptyString(pattern)) {
      return false;
    }
    if (str.includes(pattern) || str.startsWith("./") && str.slice(2).includes(pattern)) {
      return true;
    }
  }
  return micromatch.isMatch(str, pattern, __spreadProps(__spreadValues({}, options), { contains: true }));
};
micromatch.matchKeys = (obj, patterns, options) => {
  if (!import_picomatch.utils.isObject(obj)) {
    throw new TypeError("Expected the first argument to be an object");
  }
  let keys = micromatch(Object.keys(obj), patterns, options);
  let res = {};
  for (let key of keys)
    res[key] = obj[key];
  return res;
};
micromatch.some = (list, patterns, options) => {
  let items = [].concat(list);
  for (let pattern of [].concat(patterns)) {
    let isMatch = (0, import_picomatch.default)(String(pattern), options);
    if (items.some((item) => isMatch(item))) {
      return true;
    }
  }
  return false;
};
micromatch.every = (list, patterns, options) => {
  let items = [].concat(list);
  for (let pattern of [].concat(patterns)) {
    let isMatch = (0, import_picomatch.default)(String(pattern), options);
    if (!items.every((item) => isMatch(item))) {
      return false;
    }
  }
  return true;
};
micromatch.all = (str, patterns, options) => {
  if (typeof str !== "string") {
    throw new TypeError(`Expected a string: "${import_util.default.inspect(str)}"`);
  }
  return [].concat(patterns).every((p) => (0, import_picomatch.default)(p, options)(str));
};
micromatch.capture = (glob, input, options) => {
  let posix = import_picomatch.utils.isWindows(options);
  let regex = import_picomatch.default.makeRe(String(glob), __spreadProps(__spreadValues({}, options), { capture: true }));
  let match = regex.exec(posix ? import_picomatch.utils.toPosixSlashes(input) : input);
  if (match) {
    return match.slice(1).map((v) => v === void 0 ? "" : v);
  }
};
micromatch.makeRe = (...args) => import_picomatch.default.makeRe(...args);
micromatch.scan = (...args) => import_picomatch.default.scan(...args);
micromatch.parse = (patterns, options) => {
  let res = [];
  for (let pattern of [].concat(patterns || [])) {
    for (let str of (0, import_braces.default)(String(pattern), options)) {
      res.push(import_picomatch.default.parse(str, options));
    }
  }
  return res;
};
micromatch.braces = (pattern, options) => {
  if (typeof pattern !== "string")
    throw new TypeError("Expected a string");
  if (options && options.nobrace === true || !/\{.*\}/.test(pattern)) {
    return [pattern];
  }
  return (0, import_braces.default)(pattern, options);
};
micromatch.braceExpand = (pattern, options) => {
  if (typeof pattern !== "string")
    throw new TypeError("Expected a string");
  return micromatch.braces(pattern, __spreadProps(__spreadValues({}, options), { expand: true }));
};
var src_default = micromatch;
module.exports = __toCommonJS(src_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
