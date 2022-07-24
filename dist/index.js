var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/index.js
import util from "util";
import bracesFn from "braces";
import picomatch, { utils } from "picomatch";
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
    let isMatch = picomatch(String(patterns[i]), __spreadProps(__spreadValues({}, options), { onResult }), true);
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
micromatch.matcher = (pattern, options) => picomatch(pattern, options);
micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
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
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
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
  if (!utils.isObject(obj)) {
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
    let isMatch = picomatch(String(pattern), options);
    if (items.some((item) => isMatch(item))) {
      return true;
    }
  }
  return false;
};
micromatch.every = (list, patterns, options) => {
  let items = [].concat(list);
  for (let pattern of [].concat(patterns)) {
    let isMatch = picomatch(String(pattern), options);
    if (!items.every((item) => isMatch(item))) {
      return false;
    }
  }
  return true;
};
micromatch.all = (str, patterns, options) => {
  if (typeof str !== "string") {
    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
  }
  return [].concat(patterns).every((p) => picomatch(p, options)(str));
};
micromatch.capture = (glob, input, options) => {
  let posix = utils.isWindows(options);
  let regex = picomatch.makeRe(String(glob), __spreadProps(__spreadValues({}, options), { capture: true }));
  let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);
  if (match) {
    return match.slice(1).map((v) => v === void 0 ? "" : v);
  }
};
micromatch.makeRe = (...args) => picomatch.makeRe(...args);
micromatch.scan = (...args) => picomatch.scan(...args);
var parse = (patterns, options) => {
  let res = [];
  for (let pattern of [].concat(patterns || [])) {
    for (let str of braces(String(pattern), options)) {
      res.push(picomatch.parse(str, options));
    }
  }
  return res;
};
micromatch.parse = parse;
var braces = (pattern, options) => {
  if (typeof pattern !== "string")
    throw new TypeError("Expected a string");
  if (options && options.nobrace === true || !/\{.*\}/.test(pattern)) {
    return [pattern];
  }
  return bracesFn(pattern, options);
};
micromatch.braces = braces;
var braceExpand = (pattern, options) => {
  if (typeof pattern !== "string")
    throw new TypeError("Expected a string");
  return micromatch.braces(pattern, __spreadProps(__spreadValues({}, options), { expand: true }));
};
micromatch.braceExpand = braceExpand;
var src_default = micromatch;
export {
  braceExpand,
  braces,
  src_default as default,
  parse
};
