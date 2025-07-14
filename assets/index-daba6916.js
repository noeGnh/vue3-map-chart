(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/vue3-map-chart/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i = links.length - 1; i >= 0; i--) {
        const link2 = links[i];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule()).catch((err) => {
    const e = new Event("vite:preloadError", { cancelable: true });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  });
};
/**
* @vue/shared v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el2) => {
  const i = arr.indexOf(el2);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$2 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject$2(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject$2(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$2(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject$2(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$2(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      this.onStop && this.onStop();
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4
      );
    }
  }
  resetScheduling();
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  if (!isSymbol(key))
    key = String(key);
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$2(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$2(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject$2(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$2(value) ? readonly(value) : value;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      )
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel
    );
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
/**
* @vue/runtime-core v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      pauseTracking();
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id2) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id2 || middleJobId === id2 && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen2, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen2) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen2) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$2(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$2(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id2) {
  currentScopeId = id2;
}
function popScopeId() {
  currentScopeId = null;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          false ? shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el2) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.el = vnode.el;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el2;
      parent = parent.parent;
    } else {
      break;
    }
  }
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watchPostEffect(effect, options) {
  return doWatch(
    effect,
    null,
    { flush: "post" }
  );
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect.onStop = void 0;
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active || !effect.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect.stop();
    if (scope) {
      remove(scope.effects, effect);
    }
  };
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect.run.bind(effect),
      instance && instance.suspense
    );
  } else {
    effect.run();
  }
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth = Infinity, seen2) {
  if (depth <= 0 || !isObject$2(value) || value["__v_skip"]) {
    return value;
  }
  seen2 = seen2 || /* @__PURE__ */ new Set();
  if (seen2.has(value)) {
    return value;
  }
  seen2.add(value);
  depth--;
  if (isRef(value)) {
    traverse(value.value, depth, seen2);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen2);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen2);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen2);
    }
  }
  return value;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(currentRenderingInstance) || currentRenderingInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
    if (name !== "default")
      props.name = name;
    return createVNode("slot", props, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(
    Fragment,
    {
      key: props.key || // slot content array of a dynamic conditional slot may have a branch
      // key attached in the `createSlots` helper, respect that
      validSlotContent && validSlotContent.key || `_${name}`
    },
    validSlotContent || (fallback ? fallback() : []),
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function useSlots() {
  return getContext().slots;
}
function getContext() {
  const i = getCurrentInstance();
  return i.setupContext || (i.setupContext = createSetupContext(i));
}
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$2(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$2(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$2(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$2(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject$2(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2))
          ;
        else if (plugin2 && isFunction(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options);
        } else if (isFunction(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options);
        } else
          ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else
      ;
  }
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$2(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$2(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
function getType(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      extend(slots, children);
      def(slots, "_", type, true);
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el2 = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el2, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el: el2, anchor }, container, nextSibling) => {
    let next;
    while (el2 && el2 !== anchor) {
      next = hostNextSibling(el2);
      hostInsert(el2, container, nextSibling);
      el2 = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el: el2, anchor }) => {
    let next;
    while (el2 && el2 !== anchor) {
      next = hostNextSibling(el2);
      hostRemove(el2);
      el2 = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el2;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el2 = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el2, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el2,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el2, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(
            el2,
            key,
            null,
            props[key],
            namespace,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in props) {
        hostPatchProp(el2, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el2);
    }
    hostInsert(el2, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el2);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el2, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el2, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el2, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el2,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el2 = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el2,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el2,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(
          el2,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          namespace
        );
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el2, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el2, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(
                el2,
                key,
                prev,
                next,
                namespace,
                n1.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el2, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(
        el2,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        namespace
      );
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el2, vnode, oldProps, newProps, parentComponent, parentSuspense, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el2,
              key,
              oldProps[key],
              null,
              namespace,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(
            el2,
            key,
            prev,
            next,
            namespace,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el2, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.effect.dirty = true;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el: el2, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el2 && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el2,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              if (!instance.isUnmounted) {
                componentUpdateFn();
              }
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      NOOP,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => {
      if (effect.dirty) {
        effect.run();
      }
    };
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el: el2, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el2, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el2);
        hostInsert(el2, container, anchor);
        queuePostRenderEffect(() => transition.enter(el2), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el2, container, anchor);
        const performLeave = () => {
          leave(el2, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el2, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el2, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref2,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          optimized,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el: el2, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el2, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el2);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el2, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  let isFlushing2 = false;
  const render = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    if (!isFlushing2) {
      isFlushing2 = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing2 = false;
    }
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(
      internals
    );
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref2,
  ref_key,
  ref_for
}) => {
  if (typeof ref2 === "number") {
    ref2 = "" + ref2;
  }
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$2(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$2(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref2, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    cloned.transition = transition.clone(cloned);
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key]))
      setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1)
        setters.forEach((set2) => set2(v));
      else
        setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$2(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
const version = "3.4.27";
/**
* @vue/runtime-dom v3.4.27
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is2, props) => {
    const el2 = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : doc.createElement(tag, is2 ? { is: is2 } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el2.setAttribute("multiple", props.multiple);
    }
    return el2;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el2, text) => {
    el2.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el2, id2) {
    el2.setAttribute(id2, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content;
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = Symbol("_vtc");
function patchClass(el2, value, isSVG2) {
  const transitionClasses = el2[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el2.removeAttribute("class");
  } else if (isSVG2) {
    el2.setAttribute("class", value);
  } else {
    el2.className = value;
  }
}
const vShowOriginalDisplay = Symbol("_vod");
const vShowHidden = Symbol("_vsh");
const vShow = {
  beforeMount(el2, { value }, { transition }) {
    el2[vShowOriginalDisplay] = el2.style.display === "none" ? "" : el2.style.display;
    if (transition && value) {
      transition.beforeEnter(el2);
    } else {
      setDisplay(el2, value);
    }
  },
  mounted(el2, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el2);
    }
  },
  updated(el2, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el2);
        setDisplay(el2, true);
        transition.enter(el2);
      } else {
        transition.leave(el2, () => {
          setDisplay(el2, false);
        });
      }
    } else {
      setDisplay(el2, value);
    }
  },
  beforeUnmount(el2, { value }) {
    setDisplay(el2, value);
  }
};
function setDisplay(el2, value) {
  el2.style.display = value ? el2[vShowOriginalDisplay] : "none";
  el2[vShowHidden] = !value;
}
const CSS_VAR_TEXT = Symbol("");
function useCssVars(getter) {
  const instance = getCurrentInstance();
  if (!instance) {
    return;
  }
  const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
    Array.from(
      document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)
    ).forEach((node) => setVarsOnNode(node, vars));
  };
  const setVars = () => {
    const vars = getter(instance.proxy);
    setVarsOnVNode(instance.subTree, vars);
    updateTeleports(vars);
  };
  onMounted(() => {
    watchPostEffect(setVars);
    const ob = new MutationObserver(setVars);
    ob.observe(instance.subTree.el.parentNode, { childList: true });
    onUnmounted(() => ob.disconnect());
  });
}
function setVarsOnVNode(vnode, vars) {
  if (vnode.shapeFlag & 128) {
    const suspense = vnode.suspense;
    vnode = suspense.activeBranch;
    if (suspense.pendingBranch && !suspense.isHydrating) {
      suspense.effects.push(() => {
        setVarsOnVNode(suspense.activeBranch, vars);
      });
    }
  }
  while (vnode.component) {
    vnode = vnode.component.subTree;
  }
  if (vnode.shapeFlag & 1 && vnode.el) {
    setVarsOnNode(vnode.el, vars);
  } else if (vnode.type === Fragment) {
    vnode.children.forEach((c) => setVarsOnVNode(c, vars));
  } else if (vnode.type === Static) {
    let { el: el2, anchor } = vnode;
    while (el2) {
      setVarsOnNode(el2, vars);
      if (el2 === anchor)
        break;
      el2 = el2.nextSibling;
    }
  }
}
function setVarsOnNode(el2, vars) {
  if (el2.nodeType === 1) {
    const style = el2.style;
    let cssText = "";
    for (const key in vars) {
      style.setProperty(`--${key}`, vars[key]);
      cssText += `--${key}: ${vars[key]};`;
    }
    style[CSS_VAR_TEXT] = cssText;
  }
}
const displayRE = /(^|;)\s*display\s*:/;
function patchStyle(el2, prev, next) {
  const style = el2.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el2.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el2) {
    el2[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el2[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el2, key, value, isSVG2, instance) {
  if (isSVG2 && key.startsWith("xlink:")) {
    if (value == null) {
      el2.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el2.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el2.removeAttribute(key);
    } else {
      el2.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el2, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el2[key] = value == null ? "" : value;
    return;
  }
  const tag = el2.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el2.getAttribute("value") || "" : el2.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue || !("_value" in el2)) {
      el2.value = newValue;
    }
    if (value == null) {
      el2.removeAttribute(key);
    }
    el2._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el2[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el2[key] = value;
  } catch (e) {
  }
  needRemove && el2.removeAttribute(key);
}
function addEventListener(el2, event, handler, options) {
  el2.addEventListener(event, handler, options);
}
function removeEventListener(el2, event, handler, options) {
  el2.removeEventListener(event, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el2, rawName, prevValue, nextValue, instance = null) {
  const invokers = el2[veiKey] || (el2[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el2, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el2, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el2, key, prevValue, nextValue, namespace, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  const isSVG2 = namespace === "svg";
  if (key === "class") {
    patchClass(el2, nextValue, isSVG2);
  } else if (key === "style") {
    patchStyle(el2, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el2, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el2, key, nextValue, isSVG2)) {
    patchDOMProp(
      el2,
      key,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
  } else {
    if (key === "true-value") {
      el2._trueValue = nextValue;
    } else if (key === "false-value") {
      el2._falseValue = nextValue;
    }
    patchAttr(el2, key, nextValue, isSVG2);
  }
};
function shouldSetAsProp(el2, key, value, isSVG2) {
  if (isSVG2) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el2 && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el2.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el2.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el2.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el2;
}
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
};
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function toValue(r) {
  return typeof r === "function" ? r() : unref(r);
}
const isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const toString = Object.prototype.toString;
const isObject$1 = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
function getLifeCycleTarget(target) {
  return target || getCurrentInstance();
}
function tryOnMounted(fn, sync = true, target) {
  const instance = getLifeCycleTarget();
  if (instance)
    onMounted(fn, target);
  else if (sync)
    fn();
  else
    nextTick(fn);
}
function unrefElement(elRef) {
  var _a;
  const plain = toValue(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
const defaultWindow = isClient ? window : void 0;
const defaultDocument = isClient ? window.document : void 0;
function useEventListener(...args) {
  let target;
  let events;
  let listeners;
  let options;
  if (typeof args[0] === "string" || Array.isArray(args[0])) {
    [events, listeners, options] = args;
    target = defaultWindow;
  } else {
    [target, events, listeners, options] = args;
  }
  if (!target)
    return noop;
  if (!Array.isArray(events))
    events = [events];
  if (!Array.isArray(listeners))
    listeners = [listeners];
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn) => fn());
    cleanups.length = 0;
  };
  const register = (el2, event, listener, options2) => {
    el2.addEventListener(event, listener, options2);
    return () => el2.removeEventListener(event, listener, options2);
  };
  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el2, options2]) => {
      cleanup();
      if (!el2)
        return;
      const optionsClone = isObject$1(options2) ? { ...options2 } : options2;
      cleanups.push(
        ...events.flatMap((event) => {
          return listeners.map((listener) => register(el2, event, listener, optionsClone));
        })
      );
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
const UseMouseBuiltinExtractors = {
  page: (event) => [event.pageX, event.pageY],
  client: (event) => [event.clientX, event.clientY],
  screen: (event) => [event.screenX, event.screenY],
  movement: (event) => event instanceof Touch ? null : [event.movementX, event.movementY]
};
function useMouse(options = {}) {
  const {
    type = "page",
    touch = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    window: window2 = defaultWindow,
    target = window2,
    scroll = true,
    eventFilter
  } = options;
  let _prevMouseEvent = null;
  const x = ref(initialValue.x);
  const y = ref(initialValue.y);
  const sourceType = ref(null);
  const extractor = typeof type === "function" ? type : UseMouseBuiltinExtractors[type];
  const mouseHandler = (event) => {
    const result = extractor(event);
    _prevMouseEvent = event;
    if (result) {
      [x.value, y.value] = result;
      sourceType.value = "mouse";
    }
  };
  const touchHandler = (event) => {
    if (event.touches.length > 0) {
      const result = extractor(event.touches[0]);
      if (result) {
        [x.value, y.value] = result;
        sourceType.value = "touch";
      }
    }
  };
  const scrollHandler = () => {
    if (!_prevMouseEvent || !window2)
      return;
    const pos = extractor(_prevMouseEvent);
    if (_prevMouseEvent instanceof MouseEvent && pos) {
      x.value = pos[0] + window2.scrollX;
      y.value = pos[1] + window2.scrollY;
    }
  };
  const reset = () => {
    x.value = initialValue.x;
    y.value = initialValue.y;
  };
  const mouseHandlerWrapper = eventFilter ? (event) => eventFilter(() => mouseHandler(event), {}) : (event) => mouseHandler(event);
  const touchHandlerWrapper = eventFilter ? (event) => eventFilter(() => touchHandler(event), {}) : (event) => touchHandler(event);
  const scrollHandlerWrapper = eventFilter ? () => eventFilter(() => scrollHandler(), {}) : () => scrollHandler();
  if (target) {
    const listenerOptions = { passive: true };
    useEventListener(target, ["mousemove", "dragover"], mouseHandlerWrapper, listenerOptions);
    if (touch && type !== "movement") {
      useEventListener(target, ["touchstart", "touchmove"], touchHandlerWrapper, listenerOptions);
      if (resetOnTouchEnds)
        useEventListener(target, "touchend", reset, listenerOptions);
    }
    if (scroll && type === "page")
      useEventListener(window2, "scroll", scrollHandlerWrapper, { passive: true });
  }
  return {
    x,
    y,
    sourceType
  };
}
function useMouseInElement(target, options = {}) {
  const {
    handleOutside = true,
    window: window2 = defaultWindow
  } = options;
  const type = options.type || "page";
  const { x, y, sourceType } = useMouse(options);
  const targetRef = ref(target != null ? target : window2 == null ? void 0 : window2.document.body);
  const elementX = ref(0);
  const elementY = ref(0);
  const elementPositionX = ref(0);
  const elementPositionY = ref(0);
  const elementHeight = ref(0);
  const elementWidth = ref(0);
  const isOutside = ref(true);
  let stop = () => {
  };
  if (window2) {
    stop = watch(
      [targetRef, x, y],
      () => {
        const el2 = unrefElement(targetRef);
        if (!el2)
          return;
        const {
          left,
          top,
          width,
          height
        } = el2.getBoundingClientRect();
        elementPositionX.value = left + (type === "page" ? window2.pageXOffset : 0);
        elementPositionY.value = top + (type === "page" ? window2.pageYOffset : 0);
        elementHeight.value = height;
        elementWidth.value = width;
        const elX = x.value - elementPositionX.value;
        const elY = y.value - elementPositionY.value;
        isOutside.value = width === 0 || height === 0 || elX < 0 || elY < 0 || elX > width || elY > height;
        if (handleOutside || !isOutside.value) {
          elementX.value = elX;
          elementY.value = elY;
        }
      },
      { immediate: true }
    );
    useEventListener(document, "mouseleave", () => {
      isOutside.value = true;
    });
  }
  return {
    x,
    y,
    sourceType,
    elementX,
    elementY,
    elementPositionX,
    elementPositionY,
    elementHeight,
    elementWidth,
    isOutside,
    stop
  };
}
let _id = 0;
function useStyleTag(css, options = {}) {
  const isLoaded = ref(false);
  const {
    document: document2 = defaultDocument,
    immediate = true,
    manual = false,
    id: id2 = `vueuse_styletag_${++_id}`
  } = options;
  const cssRef = ref(css);
  let stop = () => {
  };
  const load = () => {
    if (!document2)
      return;
    const el2 = document2.getElementById(id2) || document2.createElement("style");
    if (!el2.isConnected) {
      el2.id = id2;
      if (options.media)
        el2.media = options.media;
      document2.head.appendChild(el2);
    }
    if (isLoaded.value)
      return;
    stop = watch(
      cssRef,
      (value) => {
        el2.textContent = value;
      },
      { immediate: true }
    );
    isLoaded.value = true;
  };
  const unload = () => {
    if (!document2 || !isLoaded.value)
      return;
    stop();
    document2.head.removeChild(document2.getElementById(id2));
    isLoaded.value = false;
  };
  if (immediate && !manual)
    tryOnMounted(load);
  if (!manual)
    tryOnScopeDispose(unload);
  return {
    id: id2,
    css: cssRef,
    unload,
    load,
    isLoaded: readonly(isLoaded)
  };
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var i18nIsoCountries = {};
const require$$0 = [
  [
    "AF",
    "AFG",
    "004",
    "ISO 3166-2:AF"
  ],
  [
    "AL",
    "ALB",
    "008",
    "ISO 3166-2:AL"
  ],
  [
    "DZ",
    "DZA",
    "012",
    "ISO 3166-2:DZ"
  ],
  [
    "AS",
    "ASM",
    "016",
    "ISO 3166-2:AS"
  ],
  [
    "AD",
    "AND",
    "020",
    "ISO 3166-2:AD"
  ],
  [
    "AO",
    "AGO",
    "024",
    "ISO 3166-2:AO"
  ],
  [
    "AI",
    "AIA",
    "660",
    "ISO 3166-2:AI"
  ],
  [
    "AQ",
    "ATA",
    "010",
    "ISO 3166-2:AQ"
  ],
  [
    "AG",
    "ATG",
    "028",
    "ISO 3166-2:AG"
  ],
  [
    "AR",
    "ARG",
    "032",
    "ISO 3166-2:AR"
  ],
  [
    "AM",
    "ARM",
    "051",
    "ISO 3166-2:AM"
  ],
  [
    "AW",
    "ABW",
    "533",
    "ISO 3166-2:AW"
  ],
  [
    "AU",
    "AUS",
    "036",
    "ISO 3166-2:AU"
  ],
  [
    "AT",
    "AUT",
    "040",
    "ISO 3166-2:AT"
  ],
  [
    "AZ",
    "AZE",
    "031",
    "ISO 3166-2:AZ"
  ],
  [
    "BS",
    "BHS",
    "044",
    "ISO 3166-2:BS"
  ],
  [
    "BH",
    "BHR",
    "048",
    "ISO 3166-2:BH"
  ],
  [
    "BD",
    "BGD",
    "050",
    "ISO 3166-2:BD"
  ],
  [
    "BB",
    "BRB",
    "052",
    "ISO 3166-2:BB"
  ],
  [
    "BY",
    "BLR",
    "112",
    "ISO 3166-2:BY"
  ],
  [
    "BE",
    "BEL",
    "056",
    "ISO 3166-2:BE"
  ],
  [
    "BZ",
    "BLZ",
    "084",
    "ISO 3166-2:BZ"
  ],
  [
    "BJ",
    "BEN",
    "204",
    "ISO 3166-2:BJ"
  ],
  [
    "BM",
    "BMU",
    "060",
    "ISO 3166-2:BM"
  ],
  [
    "BT",
    "BTN",
    "064",
    "ISO 3166-2:BT"
  ],
  [
    "BO",
    "BOL",
    "068",
    "ISO 3166-2:BO"
  ],
  [
    "BA",
    "BIH",
    "070",
    "ISO 3166-2:BA"
  ],
  [
    "BW",
    "BWA",
    "072",
    "ISO 3166-2:BW"
  ],
  [
    "BV",
    "BVT",
    "074",
    "ISO 3166-2:BV"
  ],
  [
    "BR",
    "BRA",
    "076",
    "ISO 3166-2:BR"
  ],
  [
    "IO",
    "IOT",
    "086",
    "ISO 3166-2:IO"
  ],
  [
    "BN",
    "BRN",
    "096",
    "ISO 3166-2:BN"
  ],
  [
    "BG",
    "BGR",
    "100",
    "ISO 3166-2:BG"
  ],
  [
    "BF",
    "BFA",
    "854",
    "ISO 3166-2:BF"
  ],
  [
    "BI",
    "BDI",
    "108",
    "ISO 3166-2:BI"
  ],
  [
    "KH",
    "KHM",
    "116",
    "ISO 3166-2:KH"
  ],
  [
    "CM",
    "CMR",
    "120",
    "ISO 3166-2:CM"
  ],
  [
    "CA",
    "CAN",
    "124",
    "ISO 3166-2:CA"
  ],
  [
    "CV",
    "CPV",
    "132",
    "ISO 3166-2:CV"
  ],
  [
    "KY",
    "CYM",
    "136",
    "ISO 3166-2:KY"
  ],
  [
    "CF",
    "CAF",
    "140",
    "ISO 3166-2:CF"
  ],
  [
    "TD",
    "TCD",
    "148",
    "ISO 3166-2:TD"
  ],
  [
    "CL",
    "CHL",
    "152",
    "ISO 3166-2:CL"
  ],
  [
    "CN",
    "CHN",
    "156",
    "ISO 3166-2:CN"
  ],
  [
    "CX",
    "CXR",
    "162",
    "ISO 3166-2:CX"
  ],
  [
    "CC",
    "CCK",
    "166",
    "ISO 3166-2:CC"
  ],
  [
    "CO",
    "COL",
    "170",
    "ISO 3166-2:CO"
  ],
  [
    "KM",
    "COM",
    "174",
    "ISO 3166-2:KM"
  ],
  [
    "CG",
    "COG",
    "178",
    "ISO 3166-2:CG"
  ],
  [
    "CD",
    "COD",
    "180",
    "ISO 3166-2:CD"
  ],
  [
    "CK",
    "COK",
    "184",
    "ISO 3166-2:CK"
  ],
  [
    "CR",
    "CRI",
    "188",
    "ISO 3166-2:CR"
  ],
  [
    "CI",
    "CIV",
    "384",
    "ISO 3166-2:CI"
  ],
  [
    "HR",
    "HRV",
    "191",
    "ISO 3166-2:HR"
  ],
  [
    "CU",
    "CUB",
    "192",
    "ISO 3166-2:CU"
  ],
  [
    "CY",
    "CYP",
    "196",
    "ISO 3166-2:CY"
  ],
  [
    "CZ",
    "CZE",
    "203",
    "ISO 3166-2:CZ"
  ],
  [
    "DK",
    "DNK",
    "208",
    "ISO 3166-2:DK"
  ],
  [
    "DJ",
    "DJI",
    "262",
    "ISO 3166-2:DJ"
  ],
  [
    "DM",
    "DMA",
    "212",
    "ISO 3166-2:DM"
  ],
  [
    "DO",
    "DOM",
    "214",
    "ISO 3166-2:DO"
  ],
  [
    "EC",
    "ECU",
    "218",
    "ISO 3166-2:EC"
  ],
  [
    "EG",
    "EGY",
    "818",
    "ISO 3166-2:EG"
  ],
  [
    "SV",
    "SLV",
    "222",
    "ISO 3166-2:SV"
  ],
  [
    "GQ",
    "GNQ",
    "226",
    "ISO 3166-2:GQ"
  ],
  [
    "ER",
    "ERI",
    "232",
    "ISO 3166-2:ER"
  ],
  [
    "EE",
    "EST",
    "233",
    "ISO 3166-2:EE"
  ],
  [
    "ET",
    "ETH",
    "231",
    "ISO 3166-2:ET"
  ],
  [
    "FK",
    "FLK",
    "238",
    "ISO 3166-2:FK"
  ],
  [
    "FO",
    "FRO",
    "234",
    "ISO 3166-2:FO"
  ],
  [
    "FJ",
    "FJI",
    "242",
    "ISO 3166-2:FJ"
  ],
  [
    "FI",
    "FIN",
    "246",
    "ISO 3166-2:FI"
  ],
  [
    "FR",
    "FRA",
    "250",
    "ISO 3166-2:FR"
  ],
  [
    "GF",
    "GUF",
    "254",
    "ISO 3166-2:GF"
  ],
  [
    "PF",
    "PYF",
    "258",
    "ISO 3166-2:PF"
  ],
  [
    "TF",
    "ATF",
    "260",
    "ISO 3166-2:TF"
  ],
  [
    "GA",
    "GAB",
    "266",
    "ISO 3166-2:GA"
  ],
  [
    "GM",
    "GMB",
    "270",
    "ISO 3166-2:GM"
  ],
  [
    "GE",
    "GEO",
    "268",
    "ISO 3166-2:GE"
  ],
  [
    "DE",
    "DEU",
    "276",
    "ISO 3166-2:DE"
  ],
  [
    "GH",
    "GHA",
    "288",
    "ISO 3166-2:GH"
  ],
  [
    "GI",
    "GIB",
    "292",
    "ISO 3166-2:GI"
  ],
  [
    "GR",
    "GRC",
    "300",
    "ISO 3166-2:GR"
  ],
  [
    "GL",
    "GRL",
    "304",
    "ISO 3166-2:GL"
  ],
  [
    "GD",
    "GRD",
    "308",
    "ISO 3166-2:GD"
  ],
  [
    "GP",
    "GLP",
    "312",
    "ISO 3166-2:GP"
  ],
  [
    "GU",
    "GUM",
    "316",
    "ISO 3166-2:GU"
  ],
  [
    "GT",
    "GTM",
    "320",
    "ISO 3166-2:GT"
  ],
  [
    "GN",
    "GIN",
    "324",
    "ISO 3166-2:GN"
  ],
  [
    "GW",
    "GNB",
    "624",
    "ISO 3166-2:GW"
  ],
  [
    "GY",
    "GUY",
    "328",
    "ISO 3166-2:GY"
  ],
  [
    "HT",
    "HTI",
    "332",
    "ISO 3166-2:HT"
  ],
  [
    "HM",
    "HMD",
    "334",
    "ISO 3166-2:HM"
  ],
  [
    "VA",
    "VAT",
    "336",
    "ISO 3166-2:VA"
  ],
  [
    "HN",
    "HND",
    "340",
    "ISO 3166-2:HN"
  ],
  [
    "HK",
    "HKG",
    "344",
    "ISO 3166-2:HK"
  ],
  [
    "HU",
    "HUN",
    "348",
    "ISO 3166-2:HU"
  ],
  [
    "IS",
    "ISL",
    "352",
    "ISO 3166-2:IS"
  ],
  [
    "IN",
    "IND",
    "356",
    "ISO 3166-2:IN"
  ],
  [
    "ID",
    "IDN",
    "360",
    "ISO 3166-2:ID"
  ],
  [
    "IR",
    "IRN",
    "364",
    "ISO 3166-2:IR"
  ],
  [
    "IQ",
    "IRQ",
    "368",
    "ISO 3166-2:IQ"
  ],
  [
    "IE",
    "IRL",
    "372",
    "ISO 3166-2:IE"
  ],
  [
    "IL",
    "ISR",
    "376",
    "ISO 3166-2:IL"
  ],
  [
    "IT",
    "ITA",
    "380",
    "ISO 3166-2:IT"
  ],
  [
    "JM",
    "JAM",
    "388",
    "ISO 3166-2:JM"
  ],
  [
    "JP",
    "JPN",
    "392",
    "ISO 3166-2:JP"
  ],
  [
    "JO",
    "JOR",
    "400",
    "ISO 3166-2:JO"
  ],
  [
    "KZ",
    "KAZ",
    "398",
    "ISO 3166-2:KZ"
  ],
  [
    "KE",
    "KEN",
    "404",
    "ISO 3166-2:KE"
  ],
  [
    "KI",
    "KIR",
    "296",
    "ISO 3166-2:KI"
  ],
  [
    "KP",
    "PRK",
    "408",
    "ISO 3166-2:KP"
  ],
  [
    "KR",
    "KOR",
    "410",
    "ISO 3166-2:KR"
  ],
  [
    "KW",
    "KWT",
    "414",
    "ISO 3166-2:KW"
  ],
  [
    "KG",
    "KGZ",
    "417",
    "ISO 3166-2:KG"
  ],
  [
    "LA",
    "LAO",
    "418",
    "ISO 3166-2:LA"
  ],
  [
    "LV",
    "LVA",
    "428",
    "ISO 3166-2:LV"
  ],
  [
    "LB",
    "LBN",
    "422",
    "ISO 3166-2:LB"
  ],
  [
    "LS",
    "LSO",
    "426",
    "ISO 3166-2:LS"
  ],
  [
    "LR",
    "LBR",
    "430",
    "ISO 3166-2:LR"
  ],
  [
    "LY",
    "LBY",
    "434",
    "ISO 3166-2:LY"
  ],
  [
    "LI",
    "LIE",
    "438",
    "ISO 3166-2:LI"
  ],
  [
    "LT",
    "LTU",
    "440",
    "ISO 3166-2:LT"
  ],
  [
    "LU",
    "LUX",
    "442",
    "ISO 3166-2:LU"
  ],
  [
    "MO",
    "MAC",
    "446",
    "ISO 3166-2:MO"
  ],
  [
    "MG",
    "MDG",
    "450",
    "ISO 3166-2:MG"
  ],
  [
    "MW",
    "MWI",
    "454",
    "ISO 3166-2:MW"
  ],
  [
    "MY",
    "MYS",
    "458",
    "ISO 3166-2:MY"
  ],
  [
    "MV",
    "MDV",
    "462",
    "ISO 3166-2:MV"
  ],
  [
    "ML",
    "MLI",
    "466",
    "ISO 3166-2:ML"
  ],
  [
    "MT",
    "MLT",
    "470",
    "ISO 3166-2:MT"
  ],
  [
    "MH",
    "MHL",
    "584",
    "ISO 3166-2:MH"
  ],
  [
    "MQ",
    "MTQ",
    "474",
    "ISO 3166-2:MQ"
  ],
  [
    "MR",
    "MRT",
    "478",
    "ISO 3166-2:MR"
  ],
  [
    "MU",
    "MUS",
    "480",
    "ISO 3166-2:MU"
  ],
  [
    "YT",
    "MYT",
    "175",
    "ISO 3166-2:YT"
  ],
  [
    "MX",
    "MEX",
    "484",
    "ISO 3166-2:MX"
  ],
  [
    "FM",
    "FSM",
    "583",
    "ISO 3166-2:FM"
  ],
  [
    "MD",
    "MDA",
    "498",
    "ISO 3166-2:MD"
  ],
  [
    "MC",
    "MCO",
    "492",
    "ISO 3166-2:MC"
  ],
  [
    "MN",
    "MNG",
    "496",
    "ISO 3166-2:MN"
  ],
  [
    "MS",
    "MSR",
    "500",
    "ISO 3166-2:MS"
  ],
  [
    "MA",
    "MAR",
    "504",
    "ISO 3166-2:MA"
  ],
  [
    "MZ",
    "MOZ",
    "508",
    "ISO 3166-2:MZ"
  ],
  [
    "MM",
    "MMR",
    "104",
    "ISO 3166-2:MM"
  ],
  [
    "NA",
    "NAM",
    "516",
    "ISO 3166-2:NA"
  ],
  [
    "NR",
    "NRU",
    "520",
    "ISO 3166-2:NR"
  ],
  [
    "NP",
    "NPL",
    "524",
    "ISO 3166-2:NP"
  ],
  [
    "NL",
    "NLD",
    "528",
    "ISO 3166-2:NL"
  ],
  [
    "NC",
    "NCL",
    "540",
    "ISO 3166-2:NC"
  ],
  [
    "NZ",
    "NZL",
    "554",
    "ISO 3166-2:NZ"
  ],
  [
    "NI",
    "NIC",
    "558",
    "ISO 3166-2:NI"
  ],
  [
    "NE",
    "NER",
    "562",
    "ISO 3166-2:NE"
  ],
  [
    "NG",
    "NGA",
    "566",
    "ISO 3166-2:NG"
  ],
  [
    "NU",
    "NIU",
    "570",
    "ISO 3166-2:NU"
  ],
  [
    "NF",
    "NFK",
    "574",
    "ISO 3166-2:NF"
  ],
  [
    "MP",
    "MNP",
    "580",
    "ISO 3166-2:MP"
  ],
  [
    "MK",
    "MKD",
    "807",
    "ISO 3166-2:MK"
  ],
  [
    "NO",
    "NOR",
    "578",
    "ISO 3166-2:NO"
  ],
  [
    "OM",
    "OMN",
    "512",
    "ISO 3166-2:OM"
  ],
  [
    "PK",
    "PAK",
    "586",
    "ISO 3166-2:PK"
  ],
  [
    "PW",
    "PLW",
    "585",
    "ISO 3166-2:PW"
  ],
  [
    "PS",
    "PSE",
    "275",
    "ISO 3166-2:PS"
  ],
  [
    "PA",
    "PAN",
    "591",
    "ISO 3166-2:PA"
  ],
  [
    "PG",
    "PNG",
    "598",
    "ISO 3166-2:PG"
  ],
  [
    "PY",
    "PRY",
    "600",
    "ISO 3166-2:PY"
  ],
  [
    "PE",
    "PER",
    "604",
    "ISO 3166-2:PE"
  ],
  [
    "PH",
    "PHL",
    "608",
    "ISO 3166-2:PH"
  ],
  [
    "PN",
    "PCN",
    "612",
    "ISO 3166-2:PN"
  ],
  [
    "PL",
    "POL",
    "616",
    "ISO 3166-2:PL"
  ],
  [
    "PT",
    "PRT",
    "620",
    "ISO 3166-2:PT"
  ],
  [
    "PR",
    "PRI",
    "630",
    "ISO 3166-2:PR"
  ],
  [
    "QA",
    "QAT",
    "634",
    "ISO 3166-2:QA"
  ],
  [
    "RE",
    "REU",
    "638",
    "ISO 3166-2:RE"
  ],
  [
    "RO",
    "ROU",
    "642",
    "ISO 3166-2:RO"
  ],
  [
    "RU",
    "RUS",
    "643",
    "ISO 3166-2:RU"
  ],
  [
    "RW",
    "RWA",
    "646",
    "ISO 3166-2:RW"
  ],
  [
    "SH",
    "SHN",
    "654",
    "ISO 3166-2:SH"
  ],
  [
    "KN",
    "KNA",
    "659",
    "ISO 3166-2:KN"
  ],
  [
    "LC",
    "LCA",
    "662",
    "ISO 3166-2:LC"
  ],
  [
    "PM",
    "SPM",
    "666",
    "ISO 3166-2:PM"
  ],
  [
    "VC",
    "VCT",
    "670",
    "ISO 3166-2:VC"
  ],
  [
    "WS",
    "WSM",
    "882",
    "ISO 3166-2:WS"
  ],
  [
    "SM",
    "SMR",
    "674",
    "ISO 3166-2:SM"
  ],
  [
    "ST",
    "STP",
    "678",
    "ISO 3166-2:ST"
  ],
  [
    "SA",
    "SAU",
    "682",
    "ISO 3166-2:SA"
  ],
  [
    "SN",
    "SEN",
    "686",
    "ISO 3166-2:SN"
  ],
  [
    "SC",
    "SYC",
    "690",
    "ISO 3166-2:SC"
  ],
  [
    "SL",
    "SLE",
    "694",
    "ISO 3166-2:SL"
  ],
  [
    "SG",
    "SGP",
    "702",
    "ISO 3166-2:SG"
  ],
  [
    "SK",
    "SVK",
    "703",
    "ISO 3166-2:SK"
  ],
  [
    "SI",
    "SVN",
    "705",
    "ISO 3166-2:SI"
  ],
  [
    "SB",
    "SLB",
    "090",
    "ISO 3166-2:SB"
  ],
  [
    "SO",
    "SOM",
    "706",
    "ISO 3166-2:SO"
  ],
  [
    "ZA",
    "ZAF",
    "710",
    "ISO 3166-2:ZA"
  ],
  [
    "GS",
    "SGS",
    "239",
    "ISO 3166-2:GS"
  ],
  [
    "ES",
    "ESP",
    "724",
    "ISO 3166-2:ES"
  ],
  [
    "LK",
    "LKA",
    "144",
    "ISO 3166-2:LK"
  ],
  [
    "SD",
    "SDN",
    "729",
    "ISO 3166-2:SD"
  ],
  [
    "SR",
    "SUR",
    "740",
    "ISO 3166-2:SR"
  ],
  [
    "SJ",
    "SJM",
    "744",
    "ISO 3166-2:SJ"
  ],
  [
    "SZ",
    "SWZ",
    "748",
    "ISO 3166-2:SZ"
  ],
  [
    "SE",
    "SWE",
    "752",
    "ISO 3166-2:SE"
  ],
  [
    "CH",
    "CHE",
    "756",
    "ISO 3166-2:CH"
  ],
  [
    "SY",
    "SYR",
    "760",
    "ISO 3166-2:SY"
  ],
  [
    "TW",
    "TWN",
    "158",
    "ISO 3166-2:TW"
  ],
  [
    "TJ",
    "TJK",
    "762",
    "ISO 3166-2:TJ"
  ],
  [
    "TZ",
    "TZA",
    "834",
    "ISO 3166-2:TZ"
  ],
  [
    "TH",
    "THA",
    "764",
    "ISO 3166-2:TH"
  ],
  [
    "TL",
    "TLS",
    "626",
    "ISO 3166-2:TL"
  ],
  [
    "TG",
    "TGO",
    "768",
    "ISO 3166-2:TG"
  ],
  [
    "TK",
    "TKL",
    "772",
    "ISO 3166-2:TK"
  ],
  [
    "TO",
    "TON",
    "776",
    "ISO 3166-2:TO"
  ],
  [
    "TT",
    "TTO",
    "780",
    "ISO 3166-2:TT"
  ],
  [
    "TN",
    "TUN",
    "788",
    "ISO 3166-2:TN"
  ],
  [
    "TR",
    "TUR",
    "792",
    "ISO 3166-2:TR"
  ],
  [
    "TM",
    "TKM",
    "795",
    "ISO 3166-2:TM"
  ],
  [
    "TC",
    "TCA",
    "796",
    "ISO 3166-2:TC"
  ],
  [
    "TV",
    "TUV",
    "798",
    "ISO 3166-2:TV"
  ],
  [
    "UG",
    "UGA",
    "800",
    "ISO 3166-2:UG"
  ],
  [
    "UA",
    "UKR",
    "804",
    "ISO 3166-2:UA"
  ],
  [
    "AE",
    "ARE",
    "784",
    "ISO 3166-2:AE"
  ],
  [
    "GB",
    "GBR",
    "826",
    "ISO 3166-2:GB"
  ],
  [
    "US",
    "USA",
    "840",
    "ISO 3166-2:US"
  ],
  [
    "UM",
    "UMI",
    "581",
    "ISO 3166-2:UM"
  ],
  [
    "UY",
    "URY",
    "858",
    "ISO 3166-2:UY"
  ],
  [
    "UZ",
    "UZB",
    "860",
    "ISO 3166-2:UZ"
  ],
  [
    "VU",
    "VUT",
    "548",
    "ISO 3166-2:VU"
  ],
  [
    "VE",
    "VEN",
    "862",
    "ISO 3166-2:VE"
  ],
  [
    "VN",
    "VNM",
    "704",
    "ISO 3166-2:VN"
  ],
  [
    "VG",
    "VGB",
    "092",
    "ISO 3166-2:VG"
  ],
  [
    "VI",
    "VIR",
    "850",
    "ISO 3166-2:VI"
  ],
  [
    "WF",
    "WLF",
    "876",
    "ISO 3166-2:WF"
  ],
  [
    "EH",
    "ESH",
    "732",
    "ISO 3166-2:EH"
  ],
  [
    "YE",
    "YEM",
    "887",
    "ISO 3166-2:YE"
  ],
  [
    "ZM",
    "ZMB",
    "894",
    "ISO 3166-2:ZM"
  ],
  [
    "ZW",
    "ZWE",
    "716",
    "ISO 3166-2:ZW"
  ],
  [
    "AX",
    "ALA",
    "248",
    "ISO 3166-2:AX"
  ],
  [
    "BQ",
    "BES",
    "535",
    "ISO 3166-2:BQ"
  ],
  [
    "CW",
    "CUW",
    "531",
    "ISO 3166-2:CW"
  ],
  [
    "GG",
    "GGY",
    "831",
    "ISO 3166-2:GG"
  ],
  [
    "IM",
    "IMN",
    "833",
    "ISO 3166-2:IM"
  ],
  [
    "JE",
    "JEY",
    "832",
    "ISO 3166-2:JE"
  ],
  [
    "ME",
    "MNE",
    "499",
    "ISO 3166-2:ME"
  ],
  [
    "BL",
    "BLM",
    "652",
    "ISO 3166-2:BL"
  ],
  [
    "MF",
    "MAF",
    "663",
    "ISO 3166-2:MF"
  ],
  [
    "RS",
    "SRB",
    "688",
    "ISO 3166-2:RS"
  ],
  [
    "SX",
    "SXM",
    "534",
    "ISO 3166-2:SX"
  ],
  [
    "SS",
    "SSD",
    "728",
    "ISO 3166-2:SS"
  ],
  [
    "XK",
    "XKK",
    "983",
    "ISO 3166-2:XK"
  ]
];
const require$$1 = [
  "br",
  "cy",
  "dv",
  "sw",
  "eu",
  "af",
  "am",
  "ha",
  "ku",
  "ml",
  "mt",
  "no",
  "ps",
  "sd",
  "so",
  "sq",
  "ta",
  "tg",
  "tt",
  "ug",
  "ur",
  "vi",
  "ar",
  "az",
  "be",
  "bg",
  "bn",
  "bs",
  "ca",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "es",
  "et",
  "fa",
  "fi",
  "fr",
  "ga",
  "gl",
  "he",
  "hi",
  "hr",
  "hu",
  "hy",
  "id",
  "is",
  "it",
  "ja",
  "ka",
  "kk",
  "km",
  "ko",
  "ky",
  "lt",
  "lv",
  "mk",
  "mn",
  "mr",
  "ms",
  "nb",
  "nl",
  "nn",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sl",
  "sr",
  "sv",
  "th",
  "tr",
  "uk",
  "uz",
  "zh"
];
var diacritics = {};
diacritics.remove = removeDiacritics;
var replacementList = [
  {
    base: " ",
    chars: " "
  },
  {
    base: "0",
    chars: "߀"
  },
  {
    base: "A",
    chars: "ⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"
  },
  {
    base: "AA",
    chars: "Ꜳ"
  },
  {
    base: "AE",
    chars: "ÆǼǢ"
  },
  {
    base: "AO",
    chars: "Ꜵ"
  },
  {
    base: "AU",
    chars: "Ꜷ"
  },
  {
    base: "AV",
    chars: "ꜸꜺ"
  },
  {
    base: "AY",
    chars: "Ꜽ"
  },
  {
    base: "B",
    chars: "ⒷＢḂḄḆɃƁ"
  },
  {
    base: "C",
    chars: "ⒸＣꜾḈĆCĈĊČÇƇȻ"
  },
  {
    base: "D",
    chars: "ⒹＤḊĎḌḐḒḎĐƊƉᴅꝹ"
  },
  {
    base: "Dh",
    chars: "Ð"
  },
  {
    base: "DZ",
    chars: "ǱǄ"
  },
  {
    base: "Dz",
    chars: "ǲǅ"
  },
  {
    base: "E",
    chars: "ɛⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎᴇ"
  },
  {
    base: "F",
    chars: "ꝼⒻＦḞƑꝻ"
  },
  {
    base: "G",
    chars: "ⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾɢ"
  },
  {
    base: "H",
    chars: "ⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"
  },
  {
    base: "I",
    chars: "ⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"
  },
  {
    base: "J",
    chars: "ⒿＪĴɈȷ"
  },
  {
    base: "K",
    chars: "ⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"
  },
  {
    base: "L",
    chars: "ⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"
  },
  {
    base: "LJ",
    chars: "Ǉ"
  },
  {
    base: "Lj",
    chars: "ǈ"
  },
  {
    base: "M",
    chars: "ⓂＭḾṀṂⱮƜϻ"
  },
  {
    base: "N",
    chars: "ꞤȠⓃＮǸŃÑṄŇṆŅṊṈƝꞐᴎ"
  },
  {
    base: "NJ",
    chars: "Ǌ"
  },
  {
    base: "Nj",
    chars: "ǋ"
  },
  {
    base: "O",
    chars: "ⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"
  },
  {
    base: "OE",
    chars: "Œ"
  },
  {
    base: "OI",
    chars: "Ƣ"
  },
  {
    base: "OO",
    chars: "Ꝏ"
  },
  {
    base: "OU",
    chars: "Ȣ"
  },
  {
    base: "P",
    chars: "ⓅＰṔṖƤⱣꝐꝒꝔ"
  },
  {
    base: "Q",
    chars: "ⓆＱꝖꝘɊ"
  },
  {
    base: "R",
    chars: "ⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"
  },
  {
    base: "S",
    chars: "ⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"
  },
  {
    base: "T",
    chars: "ⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"
  },
  {
    base: "Th",
    chars: "Þ"
  },
  {
    base: "TZ",
    chars: "Ꜩ"
  },
  {
    base: "U",
    chars: "ⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"
  },
  {
    base: "V",
    chars: "ⓋＶṼṾƲꝞɅ"
  },
  {
    base: "VY",
    chars: "Ꝡ"
  },
  {
    base: "W",
    chars: "ⓌＷẀẂŴẆẄẈⱲ"
  },
  {
    base: "X",
    chars: "ⓍＸẊẌ"
  },
  {
    base: "Y",
    chars: "ⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"
  },
  {
    base: "Z",
    chars: "ⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"
  },
  {
    base: "a",
    chars: "ⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑ"
  },
  {
    base: "aa",
    chars: "ꜳ"
  },
  {
    base: "ae",
    chars: "æǽǣ"
  },
  {
    base: "ao",
    chars: "ꜵ"
  },
  {
    base: "au",
    chars: "ꜷ"
  },
  {
    base: "av",
    chars: "ꜹꜻ"
  },
  {
    base: "ay",
    chars: "ꜽ"
  },
  {
    base: "b",
    chars: "ⓑｂḃḅḇƀƃɓƂ"
  },
  {
    base: "c",
    chars: "ｃⓒćĉċčçḉƈȼꜿↄ"
  },
  {
    base: "d",
    chars: "ⓓｄḋďḍḑḓḏđƌɖɗƋᏧԁꞪ"
  },
  {
    base: "dh",
    chars: "ð"
  },
  {
    base: "dz",
    chars: "ǳǆ"
  },
  {
    base: "e",
    chars: "ⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇǝ"
  },
  {
    base: "f",
    chars: "ⓕｆḟƒ"
  },
  {
    base: "ff",
    chars: "ﬀ"
  },
  {
    base: "fi",
    chars: "ﬁ"
  },
  {
    base: "fl",
    chars: "ﬂ"
  },
  {
    base: "ffi",
    chars: "ﬃ"
  },
  {
    base: "ffl",
    chars: "ﬄ"
  },
  {
    base: "g",
    chars: "ⓖｇǵĝḡğġǧģǥɠꞡꝿᵹ"
  },
  {
    base: "h",
    chars: "ⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"
  },
  {
    base: "hv",
    chars: "ƕ"
  },
  {
    base: "i",
    chars: "ⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"
  },
  {
    base: "j",
    chars: "ⓙｊĵǰɉ"
  },
  {
    base: "k",
    chars: "ⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"
  },
  {
    base: "l",
    chars: "ⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇɭ"
  },
  {
    base: "lj",
    chars: "ǉ"
  },
  {
    base: "m",
    chars: "ⓜｍḿṁṃɱɯ"
  },
  {
    base: "n",
    chars: "ⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥлԉ"
  },
  {
    base: "nj",
    chars: "ǌ"
  },
  {
    base: "o",
    chars: "ⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿꝋꝍɵɔᴑ"
  },
  {
    base: "oe",
    chars: "œ"
  },
  {
    base: "oi",
    chars: "ƣ"
  },
  {
    base: "oo",
    chars: "ꝏ"
  },
  {
    base: "ou",
    chars: "ȣ"
  },
  {
    base: "p",
    chars: "ⓟｐṕṗƥᵽꝑꝓꝕρ"
  },
  {
    base: "q",
    chars: "ⓠｑɋꝗꝙ"
  },
  {
    base: "r",
    chars: "ⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"
  },
  {
    base: "s",
    chars: "ⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛʂ"
  },
  {
    base: "ss",
    chars: "ß"
  },
  {
    base: "t",
    chars: "ⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"
  },
  {
    base: "th",
    chars: "þ"
  },
  {
    base: "tz",
    chars: "ꜩ"
  },
  {
    base: "u",
    chars: "ⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"
  },
  {
    base: "v",
    chars: "ⓥｖṽṿʋꝟʌ"
  },
  {
    base: "vy",
    chars: "ꝡ"
  },
  {
    base: "w",
    chars: "ⓦｗẁẃŵẇẅẘẉⱳ"
  },
  {
    base: "x",
    chars: "ⓧｘẋẍ"
  },
  {
    base: "y",
    chars: "ⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"
  },
  {
    base: "z",
    chars: "ⓩｚźẑżžẓẕƶȥɀⱬꝣ"
  }
];
var diacriticsMap = {};
for (var i = 0; i < replacementList.length; i += 1) {
  var chars = replacementList[i].chars;
  for (var j = 0; j < chars.length; j += 1) {
    diacriticsMap[chars[j]] = replacementList[i].base;
  }
}
function removeDiacritics(str) {
  return str.replace(/[^\u0000-\u007e]/g, function(c) {
    return diacriticsMap[c] || c;
  });
}
diacritics.replacementList = replacementList;
diacritics.diacriticsMap = diacriticsMap;
(function(exports) {
  const codes = require$$0;
  const supportedLocales = require$$1;
  const removeDiacritics2 = diacritics.remove;
  const registeredLocales = {};
  const alpha2 = {}, alpha3 = {}, numeric = {}, invertedNumeric = {};
  codes.forEach(function(codeInformation) {
    const s = codeInformation;
    alpha2[s[0]] = s[1];
    alpha3[s[1]] = s[0];
    numeric[s[2]] = s[0];
    invertedNumeric[s[0]] = s[2];
  });
  function formatNumericCode(code) {
    return String("000" + (code ? code : "")).slice(-3);
  }
  function hasOwnProperty2(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  function localeFilter(localeList, filter) {
    return Object.keys(localeList).reduce(function(newLocaleList, alpha22) {
      const nameList = localeList[alpha22];
      newLocaleList[alpha22] = filter(nameList, alpha22);
      return newLocaleList;
    }, {});
  }
  function filterNameBy(type, countryNameList) {
    switch (type) {
      case "official":
        return Array.isArray(countryNameList) ? countryNameList[0] : countryNameList;
      case "all":
        return typeof countryNameList === "string" ? [countryNameList] : countryNameList;
      case "alias":
        return Array.isArray(countryNameList) ? countryNameList[1] || countryNameList[0] : countryNameList;
      default:
        throw new TypeError(
          "LocaleNameType must be one of these: all, official, alias!"
        );
    }
  }
  exports.registerLocale = function(localeData) {
    if (!localeData.locale) {
      throw new TypeError("Missing localeData.locale");
    }
    if (!localeData.countries) {
      throw new TypeError("Missing localeData.countries");
    }
    registeredLocales[localeData.locale] = localeData.countries;
  };
  function alpha3ToAlpha2(code) {
    return alpha3[code];
  }
  exports.alpha3ToAlpha2 = alpha3ToAlpha2;
  function alpha2ToAlpha3(code) {
    return alpha2[code];
  }
  exports.alpha2ToAlpha3 = alpha2ToAlpha3;
  function alpha3ToNumeric(code) {
    return invertedNumeric[alpha3ToAlpha2(code)];
  }
  exports.alpha3ToNumeric = alpha3ToNumeric;
  function alpha2ToNumeric(code) {
    return invertedNumeric[code];
  }
  exports.alpha2ToNumeric = alpha2ToNumeric;
  function numericToAlpha3(code) {
    const padded = formatNumericCode(code);
    return alpha2ToAlpha3(numeric[padded]);
  }
  exports.numericToAlpha3 = numericToAlpha3;
  function numericToAlpha2(code) {
    const padded = formatNumericCode(code);
    return numeric[padded];
  }
  exports.numericToAlpha2 = numericToAlpha2;
  function toAlpha3(code) {
    if (typeof code === "string") {
      if (/^[0-9]*$/.test(code)) {
        return numericToAlpha3(code);
      }
      if (code.length === 2) {
        return alpha2ToAlpha3(code.toUpperCase());
      }
      if (code.length === 3) {
        return code.toUpperCase();
      }
    }
    if (typeof code === "number") {
      return numericToAlpha3(code);
    }
    return void 0;
  }
  exports.toAlpha3 = toAlpha3;
  function toAlpha2(code) {
    if (typeof code === "string") {
      if (/^[0-9]*$/.test(code)) {
        return numericToAlpha2(code);
      }
      if (code.length === 2) {
        return code.toUpperCase();
      }
      if (code.length === 3) {
        return alpha3ToAlpha2(code.toUpperCase());
      }
    }
    if (typeof code === "number") {
      return numericToAlpha2(code);
    }
    return void 0;
  }
  exports.toAlpha2 = toAlpha2;
  exports.getName = function(code, lang, options = {}) {
    if (!("select" in options)) {
      options.select = "official";
    }
    try {
      const codeMaps = registeredLocales[lang.toLowerCase()];
      const nameList = codeMaps[toAlpha2(code)];
      return filterNameBy(options.select, nameList);
    } catch (err) {
      return void 0;
    }
  };
  exports.getNames = function(lang, options = {}) {
    if (!("select" in options)) {
      options.select = "official";
    }
    const localeList = registeredLocales[lang.toLowerCase()];
    if (localeList === void 0)
      return {};
    return localeFilter(localeList, function(nameList) {
      return filterNameBy(options.select, nameList);
    });
  };
  exports.getAlpha2Code = function(name, lang) {
    const normalizeString = (string) => string.toLowerCase();
    const areSimilar = (a, b) => normalizeString(a) === normalizeString(b);
    try {
      const codenames = registeredLocales[lang.toLowerCase()];
      for (const p2 in codenames) {
        if (!hasOwnProperty2(codenames, p2)) {
          continue;
        }
        if (typeof codenames[p2] === "string") {
          if (areSimilar(codenames[p2], name)) {
            return p2;
          }
        }
        if (Array.isArray(codenames[p2])) {
          for (const mappedName of codenames[p2]) {
            if (areSimilar(mappedName, name)) {
              return p2;
            }
          }
        }
      }
      return void 0;
    } catch (err) {
      return void 0;
    }
  };
  exports.getSimpleAlpha2Code = function(name, lang) {
    const normalizeString = (string) => removeDiacritics2(string.toLowerCase());
    const areSimilar = (a, b) => normalizeString(a) === normalizeString(b);
    try {
      const codenames = registeredLocales[lang.toLowerCase()];
      for (const p2 in codenames) {
        if (!hasOwnProperty2(codenames, p2)) {
          continue;
        }
        if (typeof codenames[p2] === "string") {
          if (areSimilar(codenames[p2], name)) {
            return p2;
          }
        }
        if (Array.isArray(codenames[p2])) {
          for (const mappedName of codenames[p2]) {
            if (areSimilar(mappedName, name)) {
              return p2;
            }
          }
        }
      }
      return void 0;
    } catch (err) {
      return void 0;
    }
  };
  exports.getAlpha2Codes = function() {
    return alpha2;
  };
  exports.getAlpha3Code = function(name, lang) {
    const alpha22 = exports.getAlpha2Code(name, lang);
    if (alpha22) {
      return exports.toAlpha3(alpha22);
    } else {
      return void 0;
    }
  };
  exports.getSimpleAlpha3Code = function(name, lang) {
    const alpha22 = exports.getSimpleAlpha2Code(name, lang);
    if (alpha22) {
      return exports.toAlpha3(alpha22);
    } else {
      return void 0;
    }
  };
  exports.getAlpha3Codes = function() {
    return alpha3;
  };
  exports.getNumericCodes = function() {
    return numeric;
  };
  exports.langs = function() {
    return Object.keys(registeredLocales);
  };
  exports.getSupportedLanguages = function() {
    return supportedLocales;
  };
  exports.isValid = function(code) {
    if (!code) {
      return false;
    }
    const coerced = code.toString().toUpperCase();
    return hasOwnProperty2(alpha3, coerced) || hasOwnProperty2(alpha2, coerced) || hasOwnProperty2(numeric, coerced);
  };
})(i18nIsoCountries);
const countries$1d = /* @__PURE__ */ getDefaultExportFromCjs(i18nIsoCountries);
var iso3166_min = { exports: {} };
iso3166_min.exports;
(function(module) {
  (function() {
    var data = { BD: { name: "Bangladesh", sub: { "BD-E": { type: "Division", name: "Rajshahi" }, "BD-41": { type: "District", name: "Netrakona" }, "BD-G": { type: "Division", name: "Sylhet" }, "BD-38": { type: "District", name: "Moulvibazar" }, "BD-A": { type: "Division", name: "Barisal" }, "BD-C": { type: "Division", name: "Dhaka" }, "BD-B": { type: "Division", name: "Chittagong" }, "BD-D": { type: "Division", name: "Khulna" }, "BD-46": { type: "District", name: "Nilphamari" }, "BD-59": { type: "District", name: "Sirajganj" }, "BD-55": { type: "District", name: "Rangpur" }, "BD-47": { type: "District", name: "Noakhali" }, "BD-60": { type: "District", name: "Sylhet" }, "BD-49": { type: "District", name: "Pabna" }, "BD-62": { type: "District", name: "Shariatpur" }, "BD-63": { type: "District", name: "Tangail" }, "BD-64": { type: "District", name: "Thakurgaon" }, "BD-22": { type: "District", name: "Jessore" }, "BD-36": { type: "District", name: "Madaripur" }, "BD-61": { type: "District", name: "Sunamganj" }, "BD-23": { type: "District", name: "Jhenaidah" }, "BD-06": { type: "District", name: "Barisal" }, "BD-07": { type: "District", name: "Bhola" }, "BD-04": { type: "District", name: "Brahmanbaria" }, "BD-05": { type: "District", name: "Bagerhat" }, "BD-02": { type: "District", name: "Barguna" }, "BD-03": { type: "District", name: "Bogra" }, "BD-01": { type: "District", name: "Bandarban" }, "BD-24": { type: "District", name: "Jaipurhat" }, "BD-25": { type: "District", name: "Jhalakati" }, "BD-26": { type: "District", name: "Kishoreganj" }, "BD-27": { type: "District", name: "Khulna" }, "BD-20": { type: "District", name: "Habiganj" }, "BD-21": { type: "District", name: "Jamalpur" }, "BD-08": { type: "District", name: "Comilla" }, "BD-09": { type: "District", name: "Chandpur" }, "BD-35": { type: "District", name: "Munshiganj" }, "BD-54": { type: "District", name: "Rajshahi" }, "BD-33": { type: "District", name: "Manikganj" }, "BD-58": { type: "District", name: "Satkhira" }, "BD-F": { type: "Division", name: "Rangpur" }, "BD-32": { type: "District", name: "Lalmonirhat" }, "BD-31": { type: "District", name: "Lakshmipur" }, "BD-53": { type: "District", name: "Rajbari" }, "BD-30": { type: "District", name: "Kushtia" }, "BD-28": { type: "District", name: "Kurigram" }, "BD-44": { type: "District", name: "Natore" }, "BD-48": { type: "District", name: "Naogaon" }, "BD-29": { type: "District", name: "Khagrachari" }, "BD-15": { type: "District", name: "Faridpur" }, "BD-14": { type: "District", name: "Dinajpur" }, "BD-17": { type: "District", name: "Gopalganj" }, "BD-16": { type: "District", name: "Feni" }, "BD-11": { type: "District", name: "Cox's Bazar" }, "BD-10": { type: "District", name: "Chittagong" }, "BD-13": { type: "District", name: "Dhaka" }, "BD-12": { type: "District", name: "Chuadanga" }, "BD-51": { type: "District", name: "Patuakhali" }, "BD-50": { type: "District", name: "Pirojpur" }, "BD-39": { type: "District", name: "Meherpur" }, "BD-34": { type: "District", name: "Mymensingh" }, "BD-19": { type: "District", name: "Gaibandha" }, "BD-18": { type: "District", name: "Gazipur" }, "BD-57": { type: "District", name: "Sherpur" }, "BD-52": { type: "District", name: "Panchagarh" }, "BD-42": { type: "District", name: "Narsingdi" }, "BD-45": { type: "District", name: "Nawabganj" }, "BD-43": { type: "District", name: "Narail" }, "BD-37": { type: "District", name: "Magura" }, "BD-40": { type: "District", name: "Narayanganj" }, "BD-56": { type: "District", name: "Rangamati" } } }, BE: { name: "Belgium", sub: { "BE-VWV": { type: "Province", name: "West-Vlaanderen" }, "BE-VAN": { type: "Province", name: "Antwerpen" }, "BE-VLG": { type: "Region", name: "Vlaams Gewest" }, "BE-VLI": { type: "Province", name: "Limburg" }, "BE-WBR": { type: "Province", name: "Brabant wallon" }, "BE-VBR": { type: "Province", name: "Vlaams-Brabant" }, "BE-VOV": { type: "Province", name: "Oost-Vlaanderen" }, "BE-WLG": { type: "Province", name: "Liège" }, "BE-WLX": { type: "Province", name: "Luxembourg" }, "BE-WHT": { type: "Province", name: "Hainaut" }, "BE-WAL": { type: "Region", name: "wallonne, Région" }, "BE-BRU": { type: "Region", name: "Brussels Hoofdstedelijk Gewest" }, "BE-WNA": { type: "Province", name: "Namur" } } }, BF: { name: "Burkina Faso", sub: { "BF-SEN": { type: "Province", name: "Séno" }, "BF-KEN": { type: "Province", name: "Kénédougou" }, "BF-BLK": { type: "Province", name: "Boulkiemdé" }, "BF-NAM": { type: "Province", name: "Namentenga" }, "BF-NAO": { type: "Province", name: "Nahouri" }, "BF-BLG": { type: "Province", name: "Boulgou" }, "BF-KOP": { type: "Province", name: "Koulpélogo" }, "BF-KAD": { type: "Province", name: "Kadiogo" }, "BF-01": { type: "Region", name: "Boucle du Mouhoun" }, "BF-02": { type: "Region", name: "Cascades" }, "BF-03": { type: "Region", name: "Centre" }, "BF-04": { type: "Region", name: "Centre-Est" }, "BF-05": { type: "Region", name: "Centre-Nord" }, "BF-06": { type: "Region", name: "Centre-Ouest" }, "BF-07": { type: "Region", name: "Centre-Sud" }, "BF-08": { type: "Region", name: "Est" }, "BF-09": { type: "Region", name: "Hauts-Bassins" }, "BF-YAT": { type: "Province", name: "Yatenga" }, "BF-PAS": { type: "Province", name: "Passoré" }, "BF-YAG": { type: "Province", name: "Yagha" }, "BF-IOB": { type: "Province", name: "Ioba" }, "BF-GNA": { type: "Province", name: "Gnagna" }, "BF-PON": { type: "Province", name: "Poni" }, "BF-HOU": { type: "Province", name: "Houet" }, "BF-LER": { type: "Province", name: "Léraba" }, "BF-KMD": { type: "Province", name: "Komondjari" }, "BF-SMT": { type: "Province", name: "Sanmatenga" }, "BF-ZON": { type: "Province", name: "Zondoma" }, "BF-MOU": { type: "Province", name: "Mouhoun" }, "BF-COM": { type: "Province", name: "Comoé" }, "BF-TUI": { type: "Province", name: "Tui" }, "BF-SIS": { type: "Province", name: "Sissili" }, "BF-GAN": { type: "Province", name: "Ganzourgou" }, "BF-BGR": { type: "Province", name: "Bougouriba" }, "BF-SOR": { type: "Province", name: "Sourou" }, "BF-ZIR": { type: "Province", name: "Ziro" }, "BF-KOW": { type: "Province", name: "Kourwéogo" }, "BF-SOM": { type: "Province", name: "Soum" }, "BF-KOT": { type: "Province", name: "Kouritenga" }, "BF-13": { type: "Region", name: "Sud-Ouest" }, "BF-12": { type: "Region", name: "Sahel" }, "BF-11": { type: "Region", name: "Plateau-Central" }, "BF-10": { type: "Region", name: "Nord" }, "BF-ZOU": { type: "Province", name: "Zoundwéogo" }, "BF-LOR": { type: "Province", name: "Loroum" }, "BF-BAL": { type: "Province", name: "Balé" }, "BF-BAM": { type: "Province", name: "Bam" }, "BF-BAN": { type: "Province", name: "Banwa" }, "BF-OUB": { type: "Province", name: "Oubritenga" }, "BF-OUD": { type: "Province", name: "Oudalan" }, "BF-NAY": { type: "Province", name: "Nayala" }, "BF-NOU": { type: "Province", name: "Noumbiel" }, "BF-KOS": { type: "Province", name: "Kossi" }, "BF-TAP": { type: "Province", name: "Tapoa" }, "BF-BAZ": { type: "Province", name: "Bazèga" }, "BF-SNG": { type: "Province", name: "Sanguié" }, "BF-KMP": { type: "Province", name: "Kompienga" }, "BF-GOU": { type: "Province", name: "Gourma" } } }, BG: { name: "Bulgaria", sub: { "BG-14": { type: "Region", name: "Pernik" }, "BG-15": { type: "Region", name: "Pleven" }, "BG-16": { type: "Region", name: "Plovdiv" }, "BG-17": { type: "Region", name: "Razgrad" }, "BG-10": { type: "Region", name: "Kyustendil" }, "BG-11": { type: "Region", name: "Lovech" }, "BG-12": { type: "Region", name: "Montana" }, "BG-13": { type: "Region", name: "Pazardzhik" }, "BG-18": { type: "Region", name: "Ruse" }, "BG-19": { type: "Region", name: "Silistra" }, "BG-25": { type: "Region", name: "Targovishte" }, "BG-24": { type: "Region", name: "Stara Zagora" }, "BG-27": { type: "Region", name: "Shumen" }, "BG-07": { type: "Region", name: "Gabrovo" }, "BG-06": { type: "Region", name: "Vratsa" }, "BG-23": { type: "Region", name: "Sofia" }, "BG-04": { type: "Region", name: "Veliko Tarnovo" }, "BG-09": { type: "Region", name: "Kardzhali" }, "BG-08": { type: "Region", name: "Dobrich" }, "BG-28": { type: "Region", name: "Yambol" }, "BG-03": { type: "Region", name: "Varna" }, "BG-02": { type: "Region", name: "Burgas" }, "BG-01": { type: "Region", name: "Blagoevgrad" }, "BG-26": { type: "Region", name: "Haskovo" }, "BG-21": { type: "Region", name: "Smolyan" }, "BG-20": { type: "Region", name: "Sliven" }, "BG-05": { type: "Region", name: "Vidin" }, "BG-22": { type: "Region", name: "Sofia" } } }, BA: { name: "Bosnia and Herzegovina", sub: { "BA-BRC": { type: "District with special status", name: "Brčko distrikt" }, "BA-10": { type: "Canton", name: "Kanton br. 10" }, "BA-BIH": { type: "Entity", name: "Federacija Bosne i Hercegovine" }, "BA-09": { type: "Canton", name: "Kanton Sarajevo" }, "BA-08": { type: "Canton", name: "Zapadnohercegovačka županija" }, "BA-SRP": { type: "Entity", name: "Republika Srpska" }, "BA-05": { type: "Canton", name: "Bosansko-podrinjska županija" }, "BA-04": { type: "Canton", name: "Zeničko-dobojska županija" }, "BA-07": { type: "Canton", name: "Hercegovačko-neretvanska županija" }, "BA-06": { type: "Canton", name: "Srednjobosanska županija" }, "BA-01": { type: "Canton", name: "Unsko-sanska županija" }, "BA-03": { type: "Canton", name: "Tuzlanska županija" }, "BA-02": { type: "Canton", name: "Posavska županija" } } }, BB: { name: "Barbados", sub: { "BB-11": { type: "Parish", name: "Saint Thomas" }, "BB-10": { type: "Parish", name: "Saint Philip" }, "BB-08": { type: "Parish", name: "Saint Michael" }, "BB-09": { type: "Parish", name: "Saint Peter" }, "BB-04": { type: "Parish", name: "Saint James" }, "BB-05": { type: "Parish", name: "Saint John" }, "BB-06": { type: "Parish", name: "Saint Joseph" }, "BB-07": { type: "Parish", name: "Saint Lucy" }, "BB-01": { type: "Parish", name: "Christ Church" }, "BB-02": { type: "Parish", name: "Saint Andrew" }, "BB-03": { type: "Parish", name: "Saint George" } } }, WF: { name: "Wallis & Futuna Islands", sub: { "WF-WF": { type: "Country", name: "Wallis & Futuna Islands" } } }, BL: { name: "St. Barthélemy", sub: { "BL-BL": { type: "Country", name: "St. Barthélemy" } } }, BM: { name: "Bermuda", sub: { "BM-BM": { type: "Country", name: "Bermuda" } } }, BN: { name: "Brunei Darussalam", sub: { "BN-TE": { type: "District", name: "Temburong" }, "BN-BM": { type: "District", name: "Brunei-Muara" }, "BN-TU": { type: "District", name: "Tutong" }, "BN-BE": { type: "District", name: "Belait" } } }, BO: { name: "Bolivia", sub: { "BO-B": { type: "Department", name: "El Beni" }, "BO-C": { type: "Department", name: "Cochabamba" }, "BO-N": { type: "Department", name: "Pando" }, "BO-O": { type: "Department", name: "Oruro" }, "BO-L": { type: "Department", name: "La Paz" }, "BO-H": { type: "Department", name: "Chuquisaca" }, "BO-T": { type: "Department", name: "Tarija" }, "BO-S": { type: "Department", name: "Santa Cruz" }, "BO-P": { type: "Department", name: "Potosí" } } }, BH: { name: "Bahrain", sub: { "BH-13": { type: "Governorate", name: "Al Manāmah" }, "BH-15": { type: "Governorate", name: "Al Muḩarraq" }, "BH-14": { type: "Governorate", name: "Al Janūbīyah" }, "BH-17": { type: "Governorate", name: "Ash Shamālīyah" }, "BH-16": { type: "Governorate", name: "Al Wusţá" } } }, BI: { name: "Burundi", sub: { "BI-BB": { type: "Province", name: "Bubanza" }, "BI-MA": { type: "Province", name: "Makamba" }, "BI-CI": { type: "Province", name: "Cibitoke" }, "BI-KR": { type: "Province", name: "Karuzi" }, "BI-NG": { type: "Province", name: "Ngozi" }, "BI-RY": { type: "Province", name: "Ruyigi" }, "BI-RT": { type: "Province", name: "Rutana" }, "BI-CA": { type: "Province", name: "Cankuzo" }, "BI-BM": { type: "Province", name: "Bujumbura Mairie" }, "BI-BL": { type: "Province", name: "Bujumbura Rural" }, "BI-BR": { type: "Province", name: "Bururi" }, "BI-MW": { type: "Province", name: "Mwaro" }, "BI-KI": { type: "Province", name: "Kirundo" }, "BI-MU": { type: "Province", name: "Muramvya" }, "BI-GI": { type: "Province", name: "Gitega" }, "BI-MY": { type: "Province", name: "Muyinga" }, "BI-KY": { type: "Province", name: "Kayanza" } } }, BJ: { name: "Benin", sub: { "BJ-AK": { type: "Department", name: "Atakora" }, "BJ-BO": { type: "Department", name: "Borgou" }, "BJ-CO": { type: "Department", name: "Collines" }, "BJ-AL": { type: "Department", name: "Alibori" }, "BJ-MO": { type: "Department", name: "Mono" }, "BJ-LI": { type: "Department", name: "Littoral" }, "BJ-ZO": { type: "Department", name: "Zou" }, "BJ-OU": { type: "Department", name: "Ouémé" }, "BJ-PL": { type: "Department", name: "Plateau" }, "BJ-DO": { type: "Department", name: "Donga" }, "BJ-AQ": { type: "Department", name: "Atlantique" }, "BJ-KO": { type: "Department", name: "Kouffo" } } }, BT: { name: "Bhutan", sub: { "BT-33": { type: "District", name: "Bumthang" }, "BT-42": { type: "District", name: "Monggar" }, "BT-GA": { type: "District", name: "Gasa" }, "BT-32": { type: "District", name: "Trongsa" }, "BT-34": { type: "District", name: "Zhemgang" }, "BT-45": { type: "District", name: "Samdrup Jongkha" }, "BT-15": { type: "District", name: "Thimphu" }, "BT-14": { type: "District", name: "Samtse" }, "BT-31": { type: "District", name: "Sarpang" }, "BT-TY": { type: "District", name: "Trashi Yangtse" }, "BT-11": { type: "District", name: "Paro" }, "BT-44": { type: "District", name: "Lhuentse" }, "BT-13": { type: "District", name: "Ha" }, "BT-12": { type: "District", name: "Chhukha" }, "BT-24": { type: "District", name: "Wangdue Phodrang" }, "BT-43": { type: "District", name: "Pemagatshel" }, "BT-41": { type: "District", name: "Trashigang" }, "BT-21": { type: "District", name: "Tsirang" }, "BT-22": { type: "District", name: "Dagana" }, "BT-23": { type: "District", name: "Punakha" } } }, JM: { name: "Jamaica", sub: { "JM-12": { type: "Parish", name: "Manchester" }, "JM-14": { type: "Parish", name: "Saint Catherine" }, "JM-11": { type: "Parish", name: "Saint Elizabeth" }, "JM-10": { type: "Parish", name: "Westmoreland" }, "JM-01": { type: "Parish", name: "Kingston" }, "JM-13": { type: "Parish", name: "Clarendon" }, "JM-03": { type: "Parish", name: "Saint Thomas" }, "JM-02": { type: "Parish", name: "Saint Andrew" }, "JM-05": { type: "Parish", name: "Saint Mary" }, "JM-04": { type: "Parish", name: "Portland" }, "JM-07": { type: "Parish", name: "Trelawny" }, "JM-06": { type: "Parish", name: "Saint Ann" }, "JM-09": { type: "Parish", name: "Hanover" }, "JM-08": { type: "Parish", name: "Saint James" } } }, BV: { name: "Bouvet Island", sub: { "BV-BV": { type: "Country", name: "Bouvet Island" } } }, BW: { name: "Botswana", sub: { "BW-KW": { type: "District", name: "Kweneng" }, "BW-JW": { type: "Town", name: "Jwaneng" }, "BW-FR": { type: "City", name: "Francistown" }, "BW-CH": { type: "District", name: "Chobe" }, "BW-SO": { type: "District", name: "Southern" }, "BW-LO": { type: "Town", name: "Lobatse" }, "BW-ST": { type: "Town", name: "Sowa Town" }, "BW-CE": { type: "District", name: "Central" }, "BW-NW": { type: "District", name: "North West" }, "BW-KG": { type: "District", name: "Kgalagadi" }, "BW-GA": { type: "City", name: "Gaborone" }, "BW-SP": { type: "Town", name: "Selibe Phikwe" }, "BW-GH": { type: "District", name: "Ghanzi" }, "BW-SE": { type: "District", name: "South East" }, "BW-NE": { type: "District", name: "North East" }, "BW-KL": { type: "District", name: "Kgatleng" } } }, WS: { name: "Samoa", sub: { "WS-AA": { type: "District", name: "A'ana" }, "WS-VF": { type: "District", name: "Va'a-o-Fonoti" }, "WS-SA": { type: "District", name: "Satupa'itea" }, "WS-FA": { type: "District", name: "Fa'asaleleaga" }, "WS-VS": { type: "District", name: "Vaisigano" }, "WS-AL": { type: "District", name: "Aiga-i-le-Tai" }, "WS-GI": { type: "District", name: "Gagaifomauga" }, "WS-PA": { type: "District", name: "Palauli" }, "WS-AT": { type: "District", name: "Atua" }, "WS-TU": { type: "District", name: "Tuamasaga" }, "WS-GE": { type: "District", name: "Gaga'emauga" } } }, BQ: { name: "Bonaire, Sint Eustatius and Saba", sub: { "BQ-SE": { type: "Special municipality", name: "Sint Eustatius" }, "BQ-BO": { type: "Special municipality", name: "Bonaire" }, "BQ-SA": { type: "Special municipality", name: "Saba" } } }, BR: { name: "Brazil", sub: { "BR-RJ": { type: "State", name: "Rio de Janeiro" }, "BR-BA": { type: "State", name: "Bahia" }, "BR-SE": { type: "State", name: "Sergipe" }, "BR-DF": { type: "Federal district", name: "Distrito Federal" }, "BR-SP": { type: "State", name: "São Paulo" }, "BR-SC": { type: "State", name: "Santa Catarina" }, "BR-RR": { type: "State", name: "Roraima" }, "BR-RS": { type: "State", name: "Rio Grande do Sul" }, "BR-AP": { type: "State", name: "Amapá" }, "BR-CE": { type: "State", name: "Ceará" }, "BR-GO": { type: "State", name: "Goiás" }, "BR-AM": { type: "State", name: "Amazonas" }, "BR-AL": { type: "State", name: "Alagoas" }, "BR-AC": { type: "State", name: "Acre" }, "BR-PI": { type: "State", name: "Piauí" }, "BR-RN": { type: "State", name: "Rio Grande do Norte" }, "BR-RO": { type: "State", name: "Rondônia" }, "BR-MT": { type: "State", name: "Mato Grosso" }, "BR-MS": { type: "State", name: "Mato Grosso do Sul" }, "BR-PA": { type: "State", name: "Pará" }, "BR-PB": { type: "State", name: "Paraíba" }, "BR-ES": { type: "State", name: "Espírito Santo" }, "BR-PR": { type: "State", name: "Paraná" }, "BR-PE": { type: "State", name: "Pernambuco" }, "BR-MG": { type: "State", name: "Minas Gerais" }, "BR-MA": { type: "State", name: "Maranhão" }, "BR-TO": { type: "State", name: "Tocantins" } } }, BS: { name: "Bahamas", sub: { "BS-SA": { type: "District", name: "South Andros" }, "BS-EX": { type: "District", name: "Exuma" }, "BS-CS": { type: "District", name: "Central Andros" }, "BS-CK": { type: "District", name: "Crooked Island and Long Cay" }, "BS-CI": { type: "District", name: "Cat Island" }, "BS-GC": { type: "District", name: "Grand Cay" }, "BS-EG": { type: "District", name: "East Grand Bahama" }, "BS-CE": { type: "District", name: "Central Eleuthera" }, "BS-RI": { type: "District", name: "Ragged Island" }, "BS-RC": { type: "District", name: "Rum Cay" }, "BS-AK": { type: "District", name: "Acklins" }, "BS-MG": { type: "District", name: "Mayaguana" }, "BS-IN": { type: "District", name: "Inagua" }, "BS-MC": { type: "District", name: "Mangrove Cay" }, "BS-MI": { type: "District", name: "Moore's Island" }, "BS-BY": { type: "District", name: "Berry Islands" }, "BS-FP": { type: "District", name: "City of Freeport" }, "BS-BP": { type: "District", name: "Black Point" }, "BS-LI": { type: "District", name: "Long Island" }, "BS-BI": { type: "District", name: "Bimini" }, "BS-WG": { type: "District", name: "West Grand Bahama" }, "BS-NO": { type: "District", name: "North Abaco" }, "BS-SO": { type: "District", name: "South Abaco" }, "BS-NE": { type: "District", name: "North Eleuthera" }, "BS-HT": { type: "District", name: "Hope Town" }, "BS-SE": { type: "District", name: "South Eleuthera" }, "BS-HI": { type: "District", name: "Harbour Island" }, "BS-SS": { type: "District", name: "San Salvador" }, "BS-SW": { type: "District", name: "Spanish Wells" }, "BS-NS": { type: "District", name: "North Andros" }, "BS-CO": { type: "District", name: "Central Abaco" } } }, JE: { name: "Jersey", sub: { "JE-JE": { type: "Country", name: "Jersey" } } }, BY: { name: "Belarus", sub: { "BY-HM": { type: "City", name: "Gorod Minsk" }, "BY-BR": { type: "Oblast", name: "Bresckaja voblasć" }, "BY-HO": { type: "Oblast", name: "Gomel'skaja oblast'" }, "BY-MA": { type: "Oblast", name: "Mahilioŭskaja voblasć" }, "BY-MI": { type: "Oblast", name: "Minskaja oblast'" }, "BY-VI": { type: "Oblast", name: "Viciebskaja voblasć" }, "BY-HR": { type: "Oblast", name: "Grodnenskaja oblast'" } } }, BZ: { name: "Belize", sub: { "BZ-CY": { type: "District", name: "Cayo" }, "BZ-CZL": { type: "District", name: "Corozal" }, "BZ-SC": { type: "District", name: "Stann Creek" }, "BZ-BZ": { type: "District", name: "Belize" }, "BZ-TOL": { type: "District", name: "Toledo" }, "BZ-OW": { type: "District", name: "Orange Walk" } } }, RU: { name: "Russia", sub: { "RU-PNZ": { type: "Administrative region", name: "Penzenskaja oblast'" }, "RU-KRS": { type: "Administrative region", name: "Kurskaja oblast'" }, "RU-ULY": { type: "Administrative region", name: "Ul'janovskaja oblast'" }, "RU-BEL": { type: "Administrative region", name: "Belgorodskaja oblast'" }, "RU-SAK": { type: "Administrative region", name: "Sahalinskaja oblast'" }, "RU-KYA": { type: "Administrative territory", name: "Krasnojarskij kraj" }, "RU-STA": { type: "Administrative territory", name: "Stavropol'skij kraj" }, "RU-IVA": { type: "Administrative region", name: "Ivanovskaja oblast'" }, "RU-LIP": { type: "Administrative region", name: "Lipeckaja oblast'" }, "RU-AST": { type: "Administrative region", name: "Astrahanskaja oblast'" }, "RU-CE": { type: "Republic", name: "Čečenskaja Respublika" }, "RU-KHA": { type: "Administrative territory", name: "Habarovskij kraj" }, "RU-ORE": { type: "Administrative region", name: "Orenburgskaja oblast'" }, "RU-VLG": { type: "Administrative region", name: "Vologodskaja oblast'" }, "RU-YAR": { type: "Administrative region", name: "Jaroslavskaja oblast'" }, "RU-NGR": { type: "Administrative region", name: "Novgorodskaja oblast'" }, "RU-KLU": { type: "Administrative region", name: "Kaluzhskaya oblast'" }, "RU-OMS": { type: "Administrative region", name: "Omskaja oblast'" }, "RU-IRK": { type: "Administrative region", name: "Irkutskaja oblast'" }, "RU-ORL": { type: "Administrative region", name: "Orlovskaja oblast'" }, "RU-DA": { type: "Republic", name: "Dagestan, Respublika" }, "RU-PRI": { type: "Administrative territory", name: "Primorskij kraj" }, "RU-SAM": { type: "Administrative region", name: "Samarskaja oblast'" }, "RU-SAR": { type: "Administrative region", name: "Saratovskaja oblast'" }, "RU-KOS": { type: "Administrative region", name: "Kostromskaja oblast'" }, "RU-SPE": { type: "Autonomous city", name: "Sankt-Peterburg" }, "RU-NIZ": { type: "Administrative region", name: "Nižegorodskaja oblast'" }, "RU-SA": { type: "Republic", name: "Saha, Respublika" }, "RU-KHM": { type: "Autonomous district", name: "Hanty-Mansijskij avtonomnyj okrug" }, "RU-LEN": { type: "Administrative region", name: "Leningradskaja oblast'" }, "RU-CHE": { type: "Administrative region", name: "Čeljabinskaja oblast'" }, "RU-BA": { type: "Republic", name: "Bashkortostan, Respublika" }, "RU-SE": { type: "Republic", name: "Severnaja Osetija, Respublika" }, "RU-MOS": { type: "Administrative region", name: "Moskovskaja oblast'" }, "RU-YAN": { type: "Autonomous district", name: "Jamalo-Neneckij avtonomnyj okrug" }, "RU-KGD": { type: "Administrative region", name: "Kaliningradskaja oblast'" }, "RU-MOW": { type: "Autonomous city", name: "Moskva" }, "RU-KAM": { type: "Administrative territory", name: "Kamčatskij kraj" }, "RU-ARK": { type: "Administrative region", name: "Arhangel'skaja oblast'" }, "RU-BU": { type: "Republic", name: "Burjatija, Respublika" }, "RU-KEM": { type: "Administrative region", name: "Kemerovskaja oblast'" }, "RU-CHU": { type: "Autonomous district", name: "Chukotskiy avtonomnyy okrug" }, "RU-UD": { type: "Republic", name: "Udmurtskaja Respublika" }, "RU-KGN": { type: "Administrative region", name: "Kurganskaja oblast'" }, "RU-TUL": { type: "Administrative region", name: "Tul'skaja oblast'" }, "RU-KIR": { type: "Administrative region", name: "Kirovskaja oblast'" }, "RU-KR": { type: "Republic", name: "Karelija, Respublika" }, "RU-ME": { type: "Republic", name: "Marij Èl, Respublika" }, "RU-IN": { type: "Republic", name: "Ingušetija, Respublika" }, "RU-MAG": { type: "Administrative region", name: "Magadanskaja oblast'" }, "RU-MO": { type: "Republic", name: "Mordovija, Respublika" }, "RU-TA": { type: "Republic", name: "Tatarstan, Respublika" }, "RU-SVE": { type: "Administrative region", name: "Sverdlovskaja oblast'" }, "RU-RYA": { type: "Administrative region", name: "Rjazanskaja oblast'" }, "RU-ZAB": { type: "Administrative territory", name: "Zabajkal'skij kraj" }, "RU-NEN": { type: "Autonomous district", name: "Neneckij avtonomnyj okrug" }, "RU-KB": { type: "Republic", name: "Kabardino-Balkarskaja Respublika" }, "RU-ALT": { type: "Administrative territory", name: "Altajskij kraj" }, "RU-TY": { type: "Republic", name: "Tyva, Respublika" }, "RU-MUR": { type: "Administrative region", name: "Murmanskaja oblast'" }, "RU-VOR": { type: "Administrative region", name: "Voronezhskaya oblast'" }, "RU-PSK": { type: "Administrative region", name: "Pskovskaja oblast'" }, "RU-TVE": { type: "Administrative region", name: "Tverskaja oblast'" }, "RU-VGG": { type: "Administrative region", name: "Volgogradskaja oblast'" }, "RU-KK": { type: "Republic", name: "Hakasija, Respublika" }, "RU-KL": { type: "Republic", name: "Kalmykija, Respublika" }, "RU-TOM": { type: "Administrative region", name: "Tomskaja oblast'" }, "RU-KO": { type: "Republic", name: "Komi, Respublika" }, "RU-TYU": { type: "Administrative region", name: "Tjumenskaja oblast'" }, "RU-TAM": { type: "Administrative region", name: "Tambovskaja oblast'" }, "RU-NVS": { type: "Administrative region", name: "Novosibirskaja oblast'" }, "RU-AD": { type: "Republic", name: "Adygeja, Respublika" }, "RU-PER": { type: "Administrative territory", name: "Permskij kraj" }, "RU-ROS": { type: "Administrative region", name: "Rostovskaja oblast'" }, "RU-AMU": { type: "Administrative region", name: "Amurskaja oblast'" }, "RU-AL": { type: "Republic", name: "Altaj, Respublika" }, "RU-KC": { type: "Republic", name: "Karačaevo-Čerkesskaja Respublika" }, "RU-KDA": { type: "Administrative territory", name: "Krasnodarskij kraj" }, "RU-YEV": { type: "Autonomous region", name: "Evrejskaja avtonomnaja oblast'" }, "RU-VLA": { type: "Administrative region", name: "Vladimirskaja oblast'" }, "RU-BRY": { type: "Administrative region", name: "Brjanskaja oblast'" }, "RU-SMO": { type: "Administrative region", name: "Smolenskaja oblast'" }, "RU-CU": { type: "Republic", name: "Chuvashskaya Respublika" } } }, RW: { name: "Rwanda", sub: { "RW-03": { type: "Province", name: "Nord" }, "RW-02": { type: "Province", name: "Est" }, "RW-01": { type: "Town council", name: "Ville de Kigal" }, "RW-05": { type: "Province", name: "Sud" }, "RW-04": { type: "Province", name: "Ouest" } } }, RS: { name: "Serbia", sub: { "RS-07": { type: "District", name: "Sremski okrug" }, "RS-06": { type: "District", name: "Južnobački okrug" }, "RS-05": { type: "District", name: "Zapadnobački okrug" }, "RS-04": { type: "District", name: "Južnobanatski okrug" }, "RS-03": { type: "District", name: "Severnobanatski okrug" }, "RS-02": { type: "District", name: "Srednjebanatski okrug" }, "RS-01": { type: "District", name: "Severnobački okrug" }, "RS-00": { type: "City", name: "Beograd" }, "RS-09": { type: "District", name: "Kolubarski okrug" }, "RS-08": { type: "District", name: "Mačvanski okrug" }, "RS-29": { type: "District", name: "Kosovsko-Pomoravski okrug" }, "RS-28": { type: "District", name: "Kosovsko-Mitrovački okrug" }, "RS-21": { type: "District", name: "Toplički okrug" }, "RS-20": { type: "District", name: "Nišavski okrug" }, "RS-23": { type: "District", name: "Jablanički okrug" }, "RS-22": { type: "District", name: "Pirotski okrug" }, "RS-25": { type: "District", name: "Kosovski okrug" }, "RS-24": { type: "District", name: "Pčinjski okrug" }, "RS-27": { type: "District", name: "Prizrenski okrug" }, "RS-26": { type: "District", name: "Pećki okrug" }, "RS-VO": { type: "Autonomous province", name: "Vojvodina" }, "RS-10": { type: "District", name: "Podunavski okrug" }, "RS-11": { type: "District", name: "Braničevski okrug" }, "RS-12": { type: "District", name: "Šumadijski okrug" }, "RS-13": { type: "District", name: "Pomoravski okrug" }, "RS-14": { type: "District", name: "Borski okrug" }, "RS-15": { type: "District", name: "Zaječarski okrug" }, "RS-16": { type: "District", name: "Zlatiborski okrug" }, "RS-17": { type: "District", name: "Moravički okrug" }, "RS-18": { type: "District", name: "Raški okrug" }, "RS-19": { type: "District", name: "Rasinski okrug" }, "RS-KM": { type: "Autonomous province", name: "Kosovo-Metohija" } } }, TL: { name: "East Timor", sub: { "TL-ER": { type: "District", name: "Ermera" }, "TL-LA": { type: "District", name: "Lautém" }, "TL-OE": { type: "District", name: "Oecussi" }, "TL-AN": { type: "District", name: "Ainaro" }, "TL-AL": { type: "District", name: "Aileu" }, "TL-MF": { type: "District", name: "Manufahi" }, "TL-MT": { type: "District", name: "Manatuto" }, "TL-VI": { type: "District", name: "Vikeke" }, "TL-BO": { type: "District", name: "Bobonaro" }, "TL-CO": { type: "District", name: "Cova Lima" }, "TL-BA": { type: "District", name: "Baucau" }, "TL-LI": { type: "District", name: "Likisá" }, "TL-DI": { type: "District", name: "Díli" } } }, RE: { name: "Reunion", sub: { "RE-RE": { type: "Country", name: "Reunion" } } }, TM: { name: "Turkmenistan", sub: { "TM-S": { type: "City", name: "Aşgabat" }, "TM-L": { type: "Region", name: "Lebap" }, "TM-M": { type: "Region", name: "Mary" }, "TM-D": { type: "Region", name: "Daşoguz" }, "TM-B": { type: "Region", name: "Balkan" }, "TM-A": { type: "Region", name: "Ahal" } } }, TJ: { name: "Tajikistan", sub: { "TJ-GB": { type: "Autonomous region", name: "Kŭhistoni Badakhshon" }, "TJ-SU": { type: "Region", name: "Sughd" }, "TJ-DU": { type: "Capital territory", name: "Dushanbe" }, "TJ-KT": { type: "Region", name: "Khatlon" } } }, RO: { name: "Romania", sub: { "RO-SB": { type: "Department", name: "Sibiu" }, "RO-DB": { type: "Department", name: "Dâmboviţa" }, "RO-SM": { type: "Department", name: "Satu Mare" }, "RO-SJ": { type: "Department", name: "Sălaj" }, "RO-DJ": { type: "Department", name: "Dolj" }, "RO-HD": { type: "Department", name: "Hunedoara" }, "RO-SV": { type: "Department", name: "Suceava" }, "RO-B": { type: "Municipality", name: "Bucureşti" }, "RO-HR": { type: "Department", name: "Harghita" }, "RO-VS": { type: "Department", name: "Vaslui" }, "RO-NT": { type: "Department", name: "Neamţ" }, "RO-CV": { type: "Department", name: "Covasna" }, "RO-CT": { type: "Department", name: "Constanţa" }, "RO-CS": { type: "Department", name: "Caraş-Severin" }, "RO-GR": { type: "Department", name: "Giurgiu" }, "RO-VN": { type: "Department", name: "Vrancea" }, "RO-AR": { type: "Department", name: "Arad" }, "RO-GJ": { type: "Department", name: "Gorj" }, "RO-GL": { type: "Department", name: "Galaţi" }, "RO-CL": { type: "Department", name: "Călăraşi" }, "RO-AG": { type: "Department", name: "Argeş" }, "RO-CJ": { type: "Department", name: "Cluj" }, "RO-AB": { type: "Department", name: "Alba" }, "RO-PH": { type: "Department", name: "Prahova" }, "RO-TR": { type: "Department", name: "Teleorman" }, "RO-OT": { type: "Department", name: "Olt" }, "RO-IS": { type: "Department", name: "Iaşi" }, "RO-VL": { type: "Department", name: "Vâlcea" }, "RO-MS": { type: "Department", name: "Mureş" }, "RO-MH": { type: "Department", name: "Mehedinţi" }, "RO-IF": { type: "Department", name: "Ilfov" }, "RO-MM": { type: "Department", name: "Maramureş" }, "RO-IL": { type: "Department", name: "Ialomiţa" }, "RO-TM": { type: "Department", name: "Timiş" }, "RO-TL": { type: "Department", name: "Tulcea" }, "RO-BT": { type: "Department", name: "Botoşani" }, "RO-BV": { type: "Department", name: "Braşov" }, "RO-BR": { type: "Department", name: "Brăila" }, "RO-BZ": { type: "Department", name: "Buzău" }, "RO-BC": { type: "Department", name: "Bacău" }, "RO-BN": { type: "Department", name: "Bistriţa-Năsăud" }, "RO-BH": { type: "Department", name: "Bihor" } } }, TK: { name: "Tokelau", sub: { "TK-TK": { type: "Country", name: "Tokelau" } } }, GW: { name: "Guinea-Bissau", sub: { "GW-BL": { type: "Region", name: "Bolama" }, "GW-BM": { type: "Region", name: "Biombo" }, "GW-CA": { type: "Region", name: "Cacheu" }, "GW-QU": { type: "Region", name: "Quinara" }, "GW-S": { type: "Province", name: "Sul" }, "GW-OI": { type: "Region", name: "Oio" }, "GW-L": { type: "Province", name: "Leste" }, "GW-N": { type: "Province", name: "Norte" }, "GW-BA": { type: "Region", name: "Bafatá" }, "GW-TO": { type: "Region", name: "Tombali" }, "GW-GA": { type: "Region", name: "Gabú" }, "GW-BS": { type: "Autonomous sector", name: "Bissau" } } }, GU: { name: "Guam", sub: { "GU-GU": { type: "Country", name: "Guam" } } }, GT: { name: "Guatemala", sub: { "GT-SO": { type: "Department", name: "Sololá" }, "GT-SM": { type: "Department", name: "San Marcos" }, "GT-JA": { type: "Department", name: "Jalapa" }, "GT-BV": { type: "Department", name: "Baja Verapaz" }, "GT-QZ": { type: "Department", name: "Quetzaltenango" }, "GT-SA": { type: "Department", name: "Sacatepéquez" }, "GT-JU": { type: "Department", name: "Jutiapa" }, "GT-HU": { type: "Department", name: "Huehuetenango" }, "GT-QC": { type: "Department", name: "Quiché" }, "GT-SU": { type: "Department", name: "Suchitepéquez" }, "GT-SR": { type: "Department", name: "Santa Rosa" }, "GT-ZA": { type: "Department", name: "Zacapa" }, "GT-RE": { type: "Department", name: "Retalhuleu" }, "GT-PE": { type: "Department", name: "Petén" }, "GT-CQ": { type: "Department", name: "Chiquimula" }, "GT-TO": { type: "Department", name: "Totonicapán" }, "GT-CM": { type: "Department", name: "Chimaltenango" }, "GT-IZ": { type: "Department", name: "Izabal" }, "GT-PR": { type: "Department", name: "El Progreso" }, "GT-AV": { type: "Department", name: "Alta Verapaz" }, "GT-GU": { type: "Department", name: "Guatemala" }, "GT-ES": { type: "Department", name: "Escuintla" } } }, GS: { name: "S.Georgia & S.Sandwich Islands", sub: { "GS-GS": { type: "Country", name: "S.Georgia & S.Sandwich Islands" } } }, GR: { name: "Greece", sub: { "GR-85": { type: "Department", name: "Chíos" }, "GR-84": { type: "Department", name: "Sámos" }, "GR-64": { type: "Department", name: "Chalkidikí" }, "GR-81": { type: "Department", name: "Dodekánisa" }, "GR-83": { type: "Department", name: "Lésvos" }, "GR-54": { type: "Department", name: "Thessaloníki" }, "GR-A": { type: "Administrative region", name: "Anatolikí Makedonía kai Thráki" }, "GR-G": { type: "Administrative region", name: "Dytikí Elláda" }, "GR-B": { type: "Administrative region", name: "Kentrikí Makedonía" }, "GR-73": { type: "Department", name: "Rodópi" }, "GR-J": { type: "Administrative region", name: "Peloponnísos" }, "GR-I": { type: "Administrative region", name: "Attikí" }, "GR-34": { type: "Department", name: "Préveza" }, "GR-53": { type: "Department", name: "Imathía" }, "GR-51": { type: "Department", name: "Grevená" }, "GR-56": { type: "Department", name: "Kastoriá" }, "GR-31": { type: "Department", name: "Árta" }, "GR-32": { type: "Department", name: "Thesprotía" }, "GR-33": { type: "Department", name: "Ioánnina" }, "GR-71": { type: "Department", name: "Évros" }, "GR-58": { type: "Department", name: "Kozáni" }, "GR-59": { type: "Department", name: "Pélla" }, "GR-16": { type: "Department", name: "Lakonía" }, "GR-17": { type: "Department", name: "Messinía" }, "GR-14": { type: "Department", name: "Ileía" }, "GR-15": { type: "Department", name: "Korinthía" }, "GR-12": { type: "Department", name: "Arkadía" }, "GR-13": { type: "Department", name: "Achaḯa" }, "GR-11": { type: "Department", name: "Argolída" }, "GR-52": { type: "Department", name: "Dráma" }, "GR-94": { type: "Department", name: "Chaniá" }, "GR-92": { type: "Department", name: "Lasíthi" }, "GR-93": { type: "Department", name: "Rethýmnis" }, "GR-91": { type: "Department", name: "Irakleío" }, "GR-L": { type: "Administrative region", name: "Notío Aigaío" }, "GR-A1": { type: "Department", name: "Attikí" }, "GR-05": { type: "Department", name: "Evrytanía" }, "GR-04": { type: "Department", name: "Évvoia" }, "GR-82": { type: "Department", name: "Kykládes" }, "GR-07": { type: "Department", name: "Fokída" }, "GR-57": { type: "Department", name: "Kilkís" }, "GR-41": { type: "Department", name: "Kardítsa" }, "GR-M": { type: "Administrative region", name: "Krítí" }, "GR-43": { type: "Department", name: "Magnisía" }, "GR-42": { type: "Department", name: "Lárisa" }, "GR-H": { type: "Administrative region", name: "Stereá Elláda" }, "GR-44": { type: "Department", name: "Tríkala" }, "GR-69": { type: "Self-governed part", name: "Ágion Óros" }, "GR-K": { type: "Administrative region", name: "Voreío Aigaío" }, "GR-D": { type: "Administrative region", name: "Ípeiros" }, "GR-E": { type: "Administrative region", name: "Thessalía" }, "GR-F": { type: "Administrative region", name: "Ionía Nísia" }, "GR-55": { type: "Department", name: "Kavála" }, "GR-63": { type: "Department", name: "Flórina" }, "GR-62": { type: "Department", name: "Sérres" }, "GR-61": { type: "Department", name: "Piería" }, "GR-C": { type: "Administrative region", name: "Dytikí Makedonía" }, "GR-23": { type: "Department", name: "Kefallinía" }, "GR-22": { type: "Department", name: "Kérkyra" }, "GR-21": { type: "Department", name: "Zákynthos" }, "GR-06": { type: "Department", name: "Fthiótida" }, "GR-01": { type: "Department", name: "Aitoloakarnanía" }, "GR-72": {
      type: "Department",
      name: "Xánthi"
    }, "GR-03": { type: "Department", name: "Voiotía" }, "GR-24": { type: "Department", name: "Lefkáda" } } }, GQ: { name: "Equatorial Guinea", sub: { "GQ-LI": { type: "Province", name: "Litoral" }, "GQ-C": { type: "Region", name: "Região Continental" }, "GQ-BN": { type: "Province", name: "Bioko Nord" }, "GQ-AN": { type: "Province", name: "Annobón" }, "GQ-I": { type: "Region", name: "Região Insular" }, "GQ-KN": { type: "Province", name: "Kié-Ntem" }, "GQ-BS": { type: "Province", name: "Bioko Sud" }, "GQ-CS": { type: "Province", name: "Centro Sud" }, "GQ-WN": { type: "Province", name: "Wele-Nzas" } } }, GP: { name: "Guadeloupe", sub: { "GP-GP": { type: "Country", name: "Guadeloupe" } } }, JP: { name: "Japan", sub: { "JP-37": { type: "Prefecture", name: "Kagawa" }, "JP-36": { type: "Prefecture", name: "Tokushima" }, "JP-35": { type: "Prefecture", name: "Yamaguchi" }, "JP-34": { type: "Prefecture", name: "Hiroshima" }, "JP-33": { type: "Prefecture", name: "Okayama" }, "JP-32": { type: "Prefecture", name: "Shimane" }, "JP-31": { type: "Prefecture", name: "Tottori" }, "JP-30": { type: "Prefecture", name: "Wakayama" }, "JP-39": { type: "Prefecture", name: "Kochi" }, "JP-38": { type: "Prefecture", name: "Ehime" }, "JP-19": { type: "Prefecture", name: "Yamanashi" }, "JP-18": { type: "Prefecture", name: "Fukui" }, "JP-11": { type: "Prefecture", name: "Saitama" }, "JP-10": { type: "Prefecture", name: "Gunma" }, "JP-13": { type: "Prefecture", name: "Tôkyô" }, "JP-12": { type: "Prefecture", name: "Chiba" }, "JP-15": { type: "Prefecture", name: "Niigata" }, "JP-14": { type: "Prefecture", name: "Kanagawa" }, "JP-17": { type: "Prefecture", name: "Ishikawa" }, "JP-16": { type: "Prefecture", name: "Toyama" }, "JP-20": { type: "Prefecture", name: "Nagano" }, "JP-21": { type: "Prefecture", name: "Gifu" }, "JP-22": { type: "Prefecture", name: "Shizuoka" }, "JP-23": { type: "Prefecture", name: "Aichi" }, "JP-24": { type: "Prefecture", name: "Mie" }, "JP-25": { type: "Prefecture", name: "Shiga" }, "JP-26": { type: "Prefecture", name: "Kyoto" }, "JP-27": { type: "Prefecture", name: "Osaka" }, "JP-28": { type: "Prefecture", name: "Hyogo" }, "JP-29": { type: "Prefecture", name: "Nara" }, "JP-46": { type: "Prefecture", name: "Kagoshima" }, "JP-47": { type: "Prefecture", name: "Okinawa" }, "JP-08": { type: "Prefecture", name: "Ibaraki" }, "JP-09": { type: "Prefecture", name: "Tochigi" }, "JP-42": { type: "Prefecture", name: "Nagasaki" }, "JP-43": { type: "Prefecture", name: "Kumamoto" }, "JP-40": { type: "Prefecture", name: "Fukuoka" }, "JP-41": { type: "Prefecture", name: "Saga" }, "JP-02": { type: "Prefecture", name: "Aomori" }, "JP-03": { type: "Prefecture", name: "Iwate" }, "JP-01": { type: "Prefecture", name: "Hokkaido" }, "JP-06": { type: "Prefecture", name: "Yamagata" }, "JP-07": { type: "Prefecture", name: "Fukushima" }, "JP-04": { type: "Prefecture", name: "Miyagi" }, "JP-05": { type: "Prefecture", name: "Akita" }, "JP-44": { type: "Prefecture", name: "Oita" }, "JP-45": { type: "Prefecture", name: "Miyazaki" } } }, GY: { name: "Guyana", sub: { "GY-UT": { type: "Region", name: "Upper Takutu-Upper Essequibo" }, "GY-MA": { type: "Region", name: "Mahaica-Berbice" }, "GY-PM": { type: "Region", name: "Pomeroon-Supenaam" }, "GY-UD": { type: "Region", name: "Upper Demerara-Berbice" }, "GY-ES": { type: "Region", name: "Essequibo Islands-West Demerara" }, "GY-EB": { type: "Region", name: "East Berbice-Corentyne" }, "GY-PT": { type: "Region", name: "Potaro-Siparuni" }, "GY-CU": { type: "Region", name: "Cuyuni-Mazaruni" }, "GY-BA": { type: "Region", name: "Barima-Waini" }, "GY-DE": { type: "Region", name: "Demerara-Mahaica" } } }, GG: { name: "Guernsey", sub: { "GG-GG": { type: "Country", name: "Guernsey" } } }, GF: { name: "French Guiana", sub: { "GF-GF": { type: "Country", name: "French Guiana" } } }, GE: { name: "Georgia", sub: { "GE-GU": { type: "Region", name: "Guria" }, "GE-SK": { type: "Region", name: "Shida Kartli" }, "GE-SJ": { type: "Region", name: "Samtskhe-Javakheti" }, "GE-AB": { type: "Autonomous republic", name: "Abkhazia" }, "GE-MM": { type: "Region", name: "Mtskheta-Mtianeti" }, "GE-AJ": { type: "Autonomous republic", name: "Ajaria" }, "GE-TB": { type: "City", name: "Tbilisi" }, "GE-KA": { type: "Region", name: "K'akheti" }, "GE-IM": { type: "Region", name: "Imereti" }, "GE-SZ": { type: "Region", name: "Samegrelo-Zemo Svaneti" }, "GE-KK": { type: "Region", name: "Kvemo Kartli" }, "GE-RL": { type: "Region", name: "Rach'a-Lechkhumi-Kvemo Svaneti" } } }, GD: { name: "Grenada", sub: { "GD-03": { type: "Parish", name: "Saint George" }, "GD-02": { type: "Parish", name: "Saint David" }, "GD-01": { type: "Parish", name: "Saint Andrew" }, "GD-06": { type: "Parish", name: "Saint Patrick" }, "GD-05": { type: "Parish", name: "Saint Mark" }, "GD-04": { type: "Parish", name: "Saint John" }, "GD-10": { type: "Dependency", name: "Southern Grenadine Islands" } } }, GB: { name: "United Kingdom", sub: { "GB-TRF": { type: "Metropolitan district", name: "Trafford" }, "GB-WRX": { type: "Unitary authority", name: "Wrexham" }, "GB-BEN": { type: "London borough", name: "Brent" }, "GB-HRW": { type: "London borough", name: "Harrow" }, "GB-WRT": { type: "Unitary authority", name: "Warrington" }, "GB-LBH": { type: "London borough", name: "Lambeth" }, "GB-DAL": { type: "Unitary authority", name: "Darlington" }, "GB-WRL": { type: "Metropolitan district", name: "Wirral" }, "GB-MYL": { type: "District council area", name: "Moyle" }, "GB-UKM": { type: "Nation", name: "United Kingdom" }, "GB-BEX": { type: "London borough", name: "Bexley" }, "GB-BUR": { type: "Metropolitan district", name: "Bury" }, "GB-KIR": { type: "Metropolitan district", name: "Kirklees" }, "GB-FER": { type: "District council area", name: "Fermanagh" }, "GB-NBL": { type: "Unitary authority", name: "Northumberland" }, "GB-DRY": { type: "District council area", name: "Derry" }, "GB-CKF": { type: "District council area", name: "Carrickfergus" }, "GB-ERY": { type: "Unitary authority", name: "East Riding of Yorkshire" }, "GB-CMA": { type: "Two-tier county", name: "Cumbria" }, "GB-HCK": { type: "London borough", name: "Hackney" }, "GB-CRY": { type: "London borough", name: "Croydon" }, "GB-ABE": { type: "Council area", name: "Aberdeen City" }, "GB-ABD": { type: "Council area", name: "Aberdeenshire" }, "GB-CKT": { type: "District council area", name: "Cookstown" }, "GB-ERW": { type: "Council area", name: "East Renfrewshire" }, "GB-HIL": { type: "London borough", name: "Hillingdon" }, "GB-NLN": { type: "Unitary authority", name: "North Lincolnshire" }, "GB-WSX": { type: "Two-tier county", name: "West Sussex" }, "GB-BIR": { type: "Metropolitan district", name: "Birmingham" }, "GB-WBK": { type: "Unitary authority", name: "West Berkshire" }, "GB-EDU": { type: "Council area", name: "East Dunbartonshire" }, "GB-WSM": { type: "London borough", name: "Westminster" }, "GB-STS": { type: "Two-tier county", name: "Staffordshire" }, "GB-HRT": { type: "Two-tier county", name: "Hertfordshire" }, "GB-LSB": { type: "District council area", name: "Lisburn" }, "GB-EDH": { type: "Council area", name: "Edinburgh, City of" }, "GB-HRY": { type: "London borough", name: "Haringey" }, "GB-LAN": { type: "Two-tier county", name: "Lancashire" }, "GB-RIC": { type: "London borough", name: "Richmond upon Thames" }, "GB-LRN": { type: "District council area", name: "Larne" }, "GB-ZET": { type: "Council area", name: "Shetland Islands" }, "GB-ELS": { type: "Council area", name: "Eilean Siar" }, "GB-NTA": { type: "District council area", name: "Newtownabbey" }, "GB-SRY": { type: "Two-tier county", name: "Surrey" }, "GB-BMH": { type: "Unitary authority", name: "Bournemouth" }, "GB-CHE": { type: "Unitary authority", name: "Cheshire East" }, "GB-FLN": { type: "Unitary authority", name: "Flintshire" }, "GB-NET": { type: "Metropolitan district", name: "Newcastle upon Tyne" }, "GB-NTH": { type: "Two-tier county", name: "Northamptonshire" }, "GB-NTT": { type: "Two-tier county", name: "Nottinghamshire" }, "GB-NTL": { type: "Unitary authority", name: "Neath Port Talbot" }, "GB-ESX": { type: "Two-tier county", name: "East Sussex" }, "GB-KTT": { type: "London borough", name: "Kingston upon Thames" }, "GB-MRT": { type: "London borough", name: "Merton" }, "GB-OXF": { type: "Two-tier county", name: "Oxfordshire" }, "GB-MRY": { type: "Council area", name: "Moray" }, "GB-ESS": { type: "Two-tier county", name: "Essex" }, "GB-CHW": { type: "Unitary authority", name: "Cheshire West and Chester" }, "GB-SOS": { type: "Unitary authority", name: "Southend-on-Sea" }, "GB-PEM": { type: "Unitary authority", name: "Pembrokeshire" }, "GB-NTY": { type: "Metropolitan district", name: "North Tyneside" }, "GB-NEL": { type: "Unitary authority", name: "North East Lincolnshire" }, "GB-HAL": { type: "Unitary authority", name: "Halton" }, "GB-RFW": { type: "Council area", name: "Renfrewshire" }, "GB-LUT": { type: "Unitary authority", name: "Luton" }, "GB-WOK": { type: "Unitary authority", name: "Wokingham" }, "GB-WOR": { type: "Two-tier county", name: "Worcestershire" }, "GB-HLD": { type: "Council area", name: "Highland" }, "GB-MFT": { type: "District council area", name: "Magherafelt" }, "GB-NSM": { type: "Unitary authority", name: "North Somerset" }, "GB-LDS": { type: "Metropolitan district", name: "Leeds" }, "GB-KWL": { type: "Metropolitan district", name: "Knowsley" }, "GB-SOM": { type: "Two-tier county", name: "Somerset" }, "GB-DEN": { type: "Unitary authority", name: "Denbighshire" }, "GB-BST": { type: "Unitary authority", name: "Bristol, City of" }, "GB-EAL": { type: "London borough", name: "Ealing" }, "GB-RDB": { type: "London borough", name: "Redbridge" }, "GB-CSR": { type: "District council area", name: "Castlereagh" }, "GB-RDG": { type: "Unitary authority", name: "Reading" }, "GB-EAW": { type: "Nation", name: "England and Wales" }, "GB-CMD": { type: "London borough", name: "Camden" }, "GB-MON": { type: "Unitary authority", name: "Monmouthshire" }, "GB-OLD": { type: "Metropolitan district", name: "Oldham" }, "GB-CON": { type: "Unitary authority", name: "Cornwall" }, "GB-CMN": { type: "Unitary authority", name: "Carmarthenshire" }, "GB-EAY": { type: "Council area", name: "East Ayrshire" }, "GB-HEF": { type: "Unitary authority", name: "Herefordshire" }, "GB-ROT": { type: "Metropolitan district", name: "Rotherham" }, "GB-NAY": { type: "Council area", name: "North Ayrshire" }, "GB-BBD": { type: "Unitary authority", name: "Blackburn with Darwen" }, "GB-TOF": { type: "Unitary authority", name: "Torfaen" }, "GB-WDU": { type: "Council area", name: "West Dunbartonshire" }, "GB-WLL": { type: "Metropolitan district", name: "Walsall" }, "GB-WLN": { type: "Council area", name: "West Lothian" }, "GB-GRE": { type: "London borough", name: "Greenwich" }, "GB-MIK": { type: "Unitary authority", name: "Milton Keynes" }, "GB-KEC": { type: "London borough", name: "Kensington and Chelsea" }, "GB-MAN": { type: "Metropolitan district", name: "Manchester" }, "GB-WLV": { type: "Metropolitan district", name: "Wolverhampton" }, "GB-WLS": { type: "Country", name: "Wales" }, "GB-ELN": { type: "Council area", name: "East Lothian" }, "GB-CBF": { type: "Unitary authority", name: "Central Bedfordshire" }, "GB-STH": { type: "Unitary authority", name: "Southampton" }, "GB-KEN": { type: "Two-tier county", name: "Kent" }, "GB-STY": { type: "Metropolitan district", name: "South Tyneside" }, "GB-LCE": { type: "Unitary authority", name: "Leicester" }, "GB-ARM": { type: "District council area", name: "Armagh" }, "GB-BKM": { type: "Two-tier county", name: "Buckinghamshire" }, "GB-SLG": { type: "Unitary authority", name: "Slough" }, "GB-SLF": { type: "Metropolitan district", name: "Salford" }, "GB-ORK": { type: "Council area", name: "Orkney Islands" }, "GB-ARD": { type: "District council area", name: "Ards" }, "GB-SLK": { type: "Council area", name: "South Lanarkshire" }, "GB-BRY": { type: "London borough", name: "Bromley" }, "GB-STT": { type: "Unitary authority", name: "Stockton-on-Tees" }, "GB-POL": { type: "Unitary authority", name: "Poole" }, "GB-BRC": { type: "Unitary authority", name: "Bracknell Forest" }, "GB-SHN": { type: "Metropolitan district", name: "St. Helens" }, "GB-POW": { type: "Unitary authority", name: "Powys" }, "GB-GBN": { type: "Nation", name: "Great Britain" }, "GB-BRD": { type: "Metropolitan district", name: "Bradford" }, "GB-CRF": { type: "Unitary authority", name: "Cardiff" }, "GB-STB": { type: "District council area", name: "Strabane" }, "GB-STE": { type: "Unitary authority", name: "Stoke-on-Trent" }, "GB-DBY": { type: "Two-tier county", name: "Derbyshire" }, "GB-STG": { type: "Council area", name: "Stirling" }, "GB-AGB": { type: "Council area", name: "Argyll and Bute" }, "GB-DEV": { type: "Two-tier county", name: "Devon" }, "GB-WIL": { type: "Unitary authority", name: "Wiltshire" }, "GB-DER": { type: "Unitary authority", name: "Derby" }, "GB-HNS": { type: "London borough", name: "Hounslow" }, "GB-SAW": { type: "Metropolitan district", name: "Sandwell" }, "GB-PLY": { type: "Unitary authority", name: "Plymouth" }, "GB-NIR": { type: "Province", name: "Northern Ireland" }, "GB-THR": { type: "Unitary authority", name: "Thurrock" }, "GB-BAS": { type: "Unitary authority", name: "Bath and North East Somerset" }, "GB-FIF": { type: "Council area", name: "Fife" }, "GB-AGY": { type: "Unitary authority", name: "Isle of Anglesey" }, "GB-SAY": { type: "Council area", name: "South Ayrshire" }, "GB-NFK": { type: "Two-tier county", name: "Norfolk" }, "GB-TFW": { type: "Unitary authority", name: "Telford and Wrekin" }, "GB-BNE": { type: "London borough", name: "Barnet" }, "GB-BNB": { type: "District council area", name: "Banbridge" }, "GB-TOB": { type: "Unitary authority", name: "Torbay" }, "GB-CGN": { type: "Unitary authority", name: "Ceredigion" }, "GB-BFS": { type: "District council area", name: "Belfast" }, "GB-BNH": { type: "Unitary authority", name: "Brighton and Hove" }, "GB-WAR": { type: "Two-tier county", name: "Warwickshire" }, "GB-CGV": { type: "District council area", name: "Craigavon" }, "GB-BNS": { type: "Metropolitan district", name: "Barnsley" }, "GB-TWH": { type: "London borough", name: "Tower Hamlets" }, "GB-ANS": { type: "Council area", name: "Angus" }, "GB-FAL": { type: "Council area", name: "Falkirk" }, "GB-NYK": { type: "Two-tier county", name: "North Yorkshire" }, "GB-ANT": { type: "District council area", name: "Antrim" }, "GB-SWD": { type: "Unitary authority", name: "Swindon" }, "GB-IOS": { type: "Unitary authority", name: "Isles of Scilly" }, "GB-WNM": { type: "Unitary authority", name: "Windsor and Maidenhead" }, "GB-IOW": { type: "Unitary authority", name: "Isle of Wight" }, "GB-GLS": { type: "Two-tier county", name: "Gloucestershire" }, "GB-SFT": { type: "Metropolitan district", name: "Sefton" }, "GB-IVC": { type: "Council area", name: "Inverclyde" }, "GB-WND": { type: "London borough", name: "Wandsworth" }, "GB-LEC": { type: "Two-tier county", name: "Leicestershire" }, "GB-SWK": { type: "London borough", name: "Southwark" }, "GB-YOR": { type: "Unitary authority", name: "York" }, "GB-GLG": { type: "Council area", name: "Glasgow City" }, "GB-RUT": { type: "Unitary authority", name: "Rutland" }, "GB-HMF": { type: "London borough", name: "Hammersmith and Fulham" }, "GB-SFK": { type: "Two-tier county", name: "Suffolk" }, "GB-LEW": { type: "London borough", name: "Lewisham" }, "GB-NYM": { type: "District council area", name: "Newry and Mourne" }, "GB-DUD": { type: "Metropolitan district", name: "Dudley" }, "GB-CLR": { type: "District council area", name: "Coleraine" }, "GB-CWY": { type: "Unitary authority", name: "Conwy" }, "GB-SND": { type: "Metropolitan district", name: "Sunderland" }, "GB-BPL": { type: "Unitary authority", name: "Blackpool" }, "GB-VGL": { type: "Unitary authority", name: "Vale of Glamorgan, The" }, "GB-WFT": { type: "London borough", name: "Waltham Forest" }, "GB-LND": { type: "City corporation", name: "London, City of" }, "GB-CLD": { type: "Metropolitan district", name: "Calderdale" }, "GB-GWN": { type: "Unitary authority", name: "Gwynedd" }, "GB-DUR": { type: "Unitary authority", name: "Durham County" }, "GB-SCT": { type: "Country", name: "Scotland" }, "GB-CLK": { type: "Council area", name: "Clackmannanshire" }, "GB-ENG": { type: "Country", name: "England" }, "GB-MDW": { type: "Unitary authority", name: "Medway" }, "GB-SCB": { type: "Council area", name: "Scottish Borders, The" }, "GB-DNC": { type: "Metropolitan district", name: "Doncaster" }, "GB-TAM": { type: "Metropolitan district", name: "Tameside" }, "GB-WGN": { type: "Metropolitan district", name: "Wigan" }, "GB-DGY": { type: "Council area", name: "Dumfries and Galloway" }, "GB-PTE": { type: "Unitary authority", name: "Peterborough" }, "GB-SKP": { type: "Metropolitan district", name: "Stockport" }, "GB-NWP": { type: "Unitary authority", name: "Newport" }, "GB-ISL": { type: "London borough", name: "Islington" }, "GB-SGC": { type: "Unitary authority", name: "South Gloucestershire" }, "GB-CAY": { type: "Unitary authority", name: "Caerphilly" }, "GB-DGN": { type: "District council area", name: "Dungannon and South Tyrone" }, "GB-WKF": { type: "Metropolitan district", name: "Wakefield" }, "GB-NWM": { type: "London borough", name: "Newham" }, "GB-MDB": { type: "Unitary authority", name: "Middlesbrough" }, "GB-CAM": { type: "Two-tier county", name: "Cambridgeshire" }, "GB-SWA": { type: "Unitary authority", name: "Swansea" }, "GB-DOW": { type: "District council area", name: "Down" }, "GB-BLA": { type: "District council area", name: "Ballymena" }, "GB-HAV": { type: "London borough", name: "Havering" }, "GB-DOR": { type: "Two-tier county", name: "Dorset" }, "GB-GAT": { type: "Metropolitan district", name: "Gateshead" }, "GB-POR": { type: "Unitary authority", name: "Portsmouth" }, "GB-NLK": { type: "Council area", name: "North Lanarkshire" }, "GB-LIV": { type: "Metropolitan district", name: "Liverpool" }, "GB-LIN": { type: "Two-tier county", name: "Lincolnshire" }, "GB-HAM": { type: "Two-tier county", name: "Hampshire" }, "GB-BLY": { type: "District council area", name: "Ballymoney" }, "GB-NDN": { type: "District council area", name: "North Down" }, "GB-BDF": { type: "Unitary authority", name: "Bedford" }, "GB-BDG": { type: "London borough", name: "Barking and Dagenham" }, "GB-SOL": { type: "Metropolitan district", name: "Solihull" }, "GB-OMH": { type: "District council area", name: "Omagh" }, "GB-HPL": { type: "Unitary authority", name: "Hartlepool" }, "GB-COV": { type: "Metropolitan district", name: "Coventry" }, "GB-SHR": { type: "Unitary authority", name: "Shropshire" }, "GB-PKN": { type: "Council area", name: "Perth and Kinross" }, "GB-LMV": { type: "District council area", name: "Limavady" }, "GB-RCH": { type: "Metropolitan district", name: "Rochdale" }, "GB-SHF": { type: "Metropolitan district", name: "Sheffield" }, "GB-NGM": { type: "Unitary authority", name: "Nottingham" }, "GB-RCT": { type: "Unitary authority", name: "Rhondda, Cynon, Taff" }, "GB-BOL": { type: "Metropolitan district", name: "Bolton" }, "GB-BGW": { type: "Unitary authority", name: "Blaenau Gwent" }, "GB-ENF": { type: "London borough", name: "Enfield" }, "GB-DND": { type: "Council area", name: "Dundee City" }, "GB-STN": { type: "London borough", name: "Sutton" }, "GB-MLN": { type: "Council area", name: "Midlothian" }, "GB-RCC": { type: "Unitary authority", name: "Redcar and Cleveland" }, "GB-BGE": { type: "Unitary authority", name: "Bridgend" }, "GB-KHL": { type: "Unitary authority", name: "Kingston upon Hull" }, "GB-MTY": { type: "Unitary authority", name: "Merthyr Tydfil" } } }, GA: { name: "Gabon", sub: { "GA-7": { type: "Province", name: "Ogooué-Lolo" }, "GA-6": { type: "Province", name: "Ogooué-Ivindo" }, "GA-5": { type: "Province", name: "Nyanga" }, "GA-4": { type: "Province", name: "Ngounié" }, "GA-3": { type: "Province", name: "Moyen-Ogooué" }, "GA-2": { type: "Province", name: "Haut-Ogooué" }, "GA-1": { type: "Province", name: "Estuaire" }, "GA-9": { type: "Province", name: "Woleu-Ntem" }, "GA-8": { type: "Province", name: "Ogooué-Maritime" } } }, GN: { name: "Guinea", sub: { "GN-GU": { type: "Prefecture", name: "Guékédou" }, "GN-YO": { type: "Prefecture", name: "Yomou" }, "GN-TE": { type: "Prefecture", name: "Télimélé" }, "GN-GA": { type: "Prefecture", name: "Gaoual" }, "GN-PI": { type: "Prefecture", name: "Pita" }, "GN-ML": { type: "Prefecture", name: "Mali" }, "GN-MM": { type: "Prefecture", name: "Mamou" }, "GN-DI": { type: "Prefecture", name: "Dinguiraye" }, "GN-MD": { type: "Prefecture", name: "Mandiana" }, "GN-KS": { type: "Prefecture", name: "Kissidougou" }, "GN-MC": { type: "Prefecture", name: "Macenta" }, "GN-CO": { type: "Prefecture", name: "Coyah" }, "GN-LA": { type: "Prefecture", name: "Labé" }, "GN-B": { type: "Administrative region", name: "Boké" }, "GN-C": { type: "Governorate", name: "Conakry" }, "GN-D": { type: "Administrative region", name: "Kindia" }, "GN-F": { type: "Administrative region", name: "Faranah" }, "GN-KO": { type: "Prefecture", name: "Kouroussa" }, "GN-KA": { type: "Prefecture", name: "Kankan" }, "GN-KB": { type: "Prefecture", name: "Koubia" }, "GN-K": { type: "Administrative region", name: "Kankan" }, "GN-KD": { type: "Prefecture", name: "Kindia" }, "GN-KE": { type: "Prefecture", name: "Kérouané" }, "GN-N": { type: "Administrative region", name: "Nzérékoré" }, "GN-DU": { type: "Prefecture", name: "Dubréka" }, "GN-FR": { type: "Prefecture", name: "Fria" }, "GN-KN": { type: "Prefecture", name: "Koundara" }, "GN-LO": { type: "Prefecture", name: "Lola" }, "GN-FA": { type: "Prefecture", name: "Faranah" }, "GN-DB": { type: "Prefecture", name: "Dabola" }, "GN-DL": { type: "Prefecture", name: "Dalaba" }, "GN-FO": { type: "Prefecture", name: "Forécariah" }, "GN-BF": { type: "Prefecture", name: "Boffa" }, "GN-BE": { type: "Prefecture", name: "Beyla" }, "GN-LE": { type: "Prefecture", name: "Lélouma" }, "GN-L": { type: "Administrative region", name: "Labé" }, "GN-BK": { type: "Prefecture", name: "Boké" }, "GN-M": { type: "Administrative region", name: "Mamou" }, "GN-NZ": { type: "Prefecture", name: "Nzérékoré" }, "GN-SI": { type: "Prefecture", name: "Siguiri" }, "GN-TO": { type: "Prefecture", name: "Tougué" } } }, GM: { name: "Gambia", sub: { "GM-N": { type: "Division", name: "North Bank" }, "GM-M": { type: "Division", name: "Central River" }, "GM-L": { type: "Division", name: "Lower River" }, "GM-B": { type: "City", name: "Banjul" }, "GM-W": { type: "Division", name: "Western" }, "GM-U": { type: "Division", name: "Upper River" } } }, GL: { name: "Greenland", sub: { "GL-QE": { type: "Municipality", name: "Qeqqata Kommunia" }, "GL-KU": { type: "Municipality", name: "Kommune Kujalleq" }, "GL-QA": { type: "Municipality", name: "Qaasuitsup Kommunia" }, "GL-SM": { type: "Municipality", name: "Kommuneqarfik Sermersooq" } } }, GI: { name: "Gibraltar", sub: { "GI-GI": { type: "Country", name: "Gibraltar" } } }, GH: { name: "Ghana", sub: { "GH-AH": { type: "Region", name: "Ashanti" }, "GH-BA": { type: "Region", name: "Brong-Ahafo" }, "GH-UW": { type: "Region", name: "Upper West" }, "GH-AA": { type: "Region", name: "Greater Accra" }, "GH-UE": { type: "Region", name: "Upper East" }, "GH-CP": { type: "Region", name: "Central" }, "GH-EP": { type: "Region", name: "Eastern" }, "GH-NP": { type: "Region", name: "Northern" }, "GH-TV": { type: "Region", name: "Volta" }, "GH-WP": { type: "Region", name: "Western" } } }, OM: { name: "Oman", sub: { "OM-WU": { type: "Region", name: "Al Wusţá" }, "OM-ZU": { type: "Governorate", name: "Z̧ufār" }, "OM-BA": { type: "Region", name: "Al Bāţinah" }, "OM-DA": { type: "Region", name: "Ad Dākhilīyah" }, "OM-MU": { type: "Governorate", name: "Musandam" }, "OM-SH": { type: "Region", name: "Ash Sharqīyah" }, "OM-ZA": { type: "Region", name: "Az̧ Z̧āhirah" }, "OM-MA": { type: "Governorate", name: "Masqaţ" }, "OM-BU": { type: "Governorate", name: "Al Buraymī" } } }, TN: { name: "Tunisia", sub: { "TN-61": { type: "Governorate", name: "Sfax" }, "TN-14": { type: "Governorate", name: "La Manouba" }, "TN-82": { type: "Governorate", name: "Medenine" }, "TN-83": { type: "Governorate", name: "Tataouine" }, "TN-81": { type: "Governorate", name: "Gabès" }, "TN-42": { type: "Governorate", name: "Kasserine" }, "TN-43": { type: "Governorate", name: "Sidi Bouzid" }, "TN-41": { type: "Governorate", name: "Kairouan" }, "TN-21": { type: "Governorate", name: "Nabeul" }, "TN-22": { type: "Governorate", name: "Zaghouan" }, "TN-23": { type: "Governorate", name: "Bizerte" }, "TN-12": { type: "Governorate", name: "Ariana" }, "TN-73": { type: "Governorate", name: "Kebili" }, "TN-72": { type: "Governorate", name: "Tozeur" }, "TN-71": { type: "Governorate", name: "Gafsa" }, "TN-33": { type: "Governorate", name: "Le Kef" }, "TN-32": { type: "Governorate", name: "Jendouba" }, "TN-31": { type: "Governorate", name: "Béja" }, "TN-11": { type: "Governorate", name: "Tunis" }, "TN-13": { type: "Governorate", name: "Ben Arous" }, "TN-34": { type: "Governorate", name: "Siliana" }, "TN-51": { type: "Governorate", name: "Sousse" }, "TN-53": { type: "Governorate", name: "Mahdia" }, "TN-52": { type: "Governorate", name: "Monastir" } } }, JO: { name: "Jordan", sub: { "JO-AT": { type: "Governorate", name: "Aţ Ţafīlah" }, "JO-MA": { type: "Governorate", name: "Al Mafraq" }, "JO-MD": { type: "Governorate", name: "Mādabā" }, "JO-AQ": { type: "Governorate", name: "Al ʽAqabah" }, "JO-MN": { type: "Governorate", name: "Ma'ān" }, "JO-BA": { type: "Governorate", name: "Al Balqā'" }, "JO-AZ": { type: "Governorate", name: "Az Zarqā'" }, "JO-JA": { type: "Governorate", name: "Jarash" }, "JO-IR": { type: "Governorate", name: "Irbid" }, "JO-KA": { type: "Governorate", name: "Al Karak" }, "JO-AM": { type: "Governorate", name: "‘Ammān" }, "JO-AJ": { type: "Governorate", name: "ʽAjlūn" } } }, HR: { name: "Croatia", sub: { "HR-16": { type: "County", name: "Vukovarsko-srijemska županija" }, "HR-19": { type: "County", name: "Dubrovačko-neretvanska županija" }, "HR-18": { type: "County", name: "Istarska županija" }, "HR-08": { type: "County", name: "Primorsko-goranska županija" }, "HR-09": { type: "County", name: "Ličko-senjska županija" }, "HR-06": { type: "County", name: "Koprivničko-križevačka županija" }, "HR-07": { type: "County", name: "Bjelovarsko-bilogorska županija" }, "HR-04": { type: "County", name: "Karlovačka županija" }, "HR-05": { type: "County", name: "Varaždinska županija" }, "HR-02": { type: "County", name: "Krapinsko-zagorska županija" }, "HR-03": { type: "County", name: "Sisačko-moslavačka županija" }, "HR-13": { type: "County", name: "Zadarska županija" }, "HR-01": { type: "County", name: "Zagrebačka županija" }, "HR-15": { type: "County", name: "Šibensko-kninska županija" }, "HR-20": { type: "County", name: "Međimurska županija" }, "HR-21": { type: "City", name: "Grad Zagreb" }, "HR-14": { type: "County", name: "Osječko-baranjska županija" }, "HR-12": { type: "County", name: "Brodsko-posavska županija" }, "HR-10": { type: "County", name: "Virovitičko-podravska županija" }, "HR-17": { type: "County", name: "Splitsko-dalmatinska županija" }, "HR-11": { type: "County", name: "Požeško-slavonska županija" } } }, HT: { name: "Haiti", sub: { "HT-CE": { type: "Department", name: "Centre" }, "HT-OU": { type: "Department", name: "Lwès" }, "HT-GA": { type: "Department", name: "Grandans" }, "HT-NI": { type: "Department", name: "Nip" }, "HT-NO": { type: "Department", name: "Nòdwès" }, "HT-SD": { type: "Department", name: "Sid" }, "HT-SE": { type: "Department", name: "Sidès" }, "HT-AR": { type: "Department", name: "Artibonite" }, "HT-ND": { type: "Department", name: "Nò" }, "HT-NE": { type: "Department", name: "Nòdès" } } }, HU: { name: "Hungary", sub: { "HU-HE": { type: "County", name: "Heves" }, "HU-BU": { type: "Capital city", name: "Budapest" }, "HU-HB": { type: "County", name: "Hajdú-Bihar" }, "HU-FE": { type: "County", name: "Fejér" }, "HU-SN": { type: "City of county right", name: "Sopron" }, "HU-BZ": { type: "County", name: "Borsod-Abaúj-Zemplén" }, "HU-DE": { type: "City of county right", name: "Debrecen" }, "HU-BA": { type: "County", name: "Baranya" }, "HU-HV": { type: "City of county right", name: "Hódmezővásárhely" }, "HU-BC": { type: "City of county right", name: "Békéscsaba" }, "HU-BE": { type: "County", name: "Békés" }, "HU-BK": { type: "County", name: "Bács-Kiskun" }, "HU-DU": { type: "City of county right", name: "Dunaújváros" }, "HU-SF": { type: "City of county right", name: "Székesfehérvár" }, "HU-SD": { type: "City of county right", name: "Szeged" }, "HU-SK": { type: "City of county right", name: "Szolnok" }, "HU-SH": { type: "City of county right", name: "Szombathely" }, "HU-KV": { type: "City of county right", name: "Kaposvár" }, "HU-SO": { type: "County", name: "Somogy" }, "HU-SS": { type: "City of county right", name: "Szekszárd" }, "HU-MI": { type: "City of county right", name: "Miskolc" }, "HU-ST": { type: "City of county right", name: "Salgótarján" }, "HU-KM": { type: "City of county right", name: "Kecskemét" }, "HU-SZ": { type: "County", name: "Szabolcs-Szatmár-Bereg" }, "HU-KE": { type: "County", name: "Komárom-Esztergom" }, "HU-CS": { type: "County", name: "Csongrád" }, "HU-ER": { type: "City of county right", name: "Érd" }, "HU-ZA": { type: "County", name: "Zala" }, "HU-ZE": { type: "City of county right", name: "Zalaegerszeg" }, "HU-VM": { type: "City of county right", name: "Veszprém" }, "HU-EG": { type: "City of county right", name: "Eger" }, "HU-TO": { type: "County", name: "Tolna" }, "HU-GY": { type: "City of county right", name: "Győr" }, "HU-VE": { type: "County", name: "Veszprém" }, "HU-TB": { type: "City of county right", name: "Tatabánya" }, "HU-VA": { type: "County", name: "Vas" }, "HU-GS": { type: "County", name: "Győr-Moson-Sopron" }, "HU-PE": { type: "County", name: "Pest" }, "HU-NY": { type: "City of county right", name: "Nyíregyháza" }, "HU-JN": { type: "County", name: "Jász-Nagykun-Szolnok" }, "HU-NO": { type: "County", name: "Nógrád" }, "HU-PS": { type: "City of county right", name: "Pécs" }, "HU-NK": { type: "City of county right", name: "Nagykanizsa" } } }, HK: { name: "Hong Kong", sub: { "HK-HK": { type: "Country", name: "Hong Kong" } } }, HN: { name: "Honduras", sub: { "HN-OC": { type: "Department", name: "Ocotepeque" }, "HN-CM": { type: "Department", name: "Comayagua" }, "HN-CL": { type: "Department", name: "Colón" }, "HN-YO": { type: "Department", name: "Yoro" }, "HN-CH": { type: "Department", name: "Choluteca" }, "HN-FM": { type: "Department", name: "Francisco Morazán" }, "HN-IB": { type: "Department", name: "Islas de la Bahía" }, "HN-EP": { type: "Department", name: "El Paraíso" }, "HN-OL": { type: "Department", name: "Olancho" }, "HN-LE": { type: "Department", name: "Lempira" }, "HN-IN": { type: "Department", name: "Intibucá" }, "HN-AT": { type: "Department", name: "Atlántida" }, "HN-LP": { type: "Department", name: "La Paz" }, "HN-VA": { type: "Department", name: "Valle" }, "HN-SB": { type: "Department", name: "Santa Bárbara" }, "HN-GD": { type: "Department", name: "Gracias a Dios" }, "HN-CR": { type: "Department", name: "Cortés" }, "HN-CP": { type: "Department", name: "Copán" } } }, HM: { name: "Heard & McDonald Islands", sub: { "HM-HM": { type: "Country", name: "Heard & McDonald Islands" } } }, VE: { name: "Venezuela", sub: { "VE-L": { type: "State", name: "Mérida" }, "VE-M": { type: "State", name: "Miranda" }, "VE-N": { type: "State", name: "Monagas" }, "VE-O": { type: "State", name: "Nueva Esparta" }, "VE-H": { type: "State", name: "Cojedes" }, "VE-I": { type: "State", name: "Falcón" }, "VE-J": { type: "State", name: "Guárico" }, "VE-K": { type: "State", name: "Lara" }, "VE-D": { type: "State", name: "Aragua" }, "VE-E": { type: "State", name: "Barinas" }, "VE-F": { type: "State", name: "Bolívar" }, "VE-G": { type: "State", name: "Carabobo" }, "VE-A": { type: "Capital district", name: "Distrito Capital" }, "VE-B": { type: "State", name: "Anzoátegui" }, "VE-C": { type: "State", name: "Apure" }, "VE-X": { type: "State", name: "Vargas" }, "VE-Y": { type: "State", name: "Delta Amacuro" }, "VE-Z": { type: "State", name: "Amazonas" }, "VE-T": { type: "State", name: "Trujillo" }, "VE-U": { type: "State", name: "Yaracuy" }, "VE-V": { type: "State", name: "Zulia" }, "VE-W": { type: "Federal dependency", name: "Dependencias Federales" }, "VE-P": { type: "State", name: "Portuguesa" }, "VE-R": { type: "State", name: "Sucre" }, "VE-S": { type: "State", name: "Táchira" } } }, PR: { name: "Puerto Rico", sub: { "PR-PR": { type: "Country", name: "Puerto Rico" } } }, PS: { name: "Palestine", sub: { "PS-SLT": { type: "Governorate", name: "Salfit" }, "PS-HBN": { type: "Governorate", name: "Al Khalīl" }, "PS-RBH": { type: "Governorate", name: "Ramallah" }, "PS-QQA": { type: "Governorate", name: "Qalqilya" }, "PS-TBS": { type: "Governorate", name: "Tubas" }, "PS-JEN": { type: "Governorate", name: "Janīn" }, "PS-JEM": { type: "Governorate", name: "Al Quds" }, "PS-KYS": { type: "Governorate", name: "Khan Yunis" }, "PS-DEB": { type: "Governorate", name: "Dayr al Balaḩ" }, "PS-BTH": { type: "Governorate", name: "Bayt Laḩm" }, "PS-JRH": { type: "Governorate", name: "Arīḩā wa al Aghwār" }, "PS-GZA": { type: "Governorate", name: "Gaza" }, "PS-NBS": { type: "Governorate", name: "Nablus" }, "PS-RFH": { type: "Governorate", name: "Rafah" }, "PS-TKM": { type: "Governorate", name: "Tulkarm" }, "PS-NGZ": { type: "Governorate", name: "North Gaza" } } }, PW: { name: "Palau", sub: { "PW-222": { type: "State", name: "Ngardmau" }, "PW-050": { type: "State", name: "Hatobohei" }, "PW-218": { type: "State", name: "Ngarchelong" }, "PW-226": { type: "State", name: "Ngchesar" }, "PW-227": { type: "State", name: "Ngeremlengui" }, "PW-224": { type: "State", name: "Ngatpang" }, "PW-100": { type: "State", name: "Kayangel" }, "PW-212": { type: "State", name: "Melekeok" }, "PW-228": { type: "State", name: "Ngiwal" }, "PW-150": { type: "State", name: "Koror" }, "PW-214": { type: "State", name: "Ngaraard" }, "PW-370": { type: "State", name: "Sonsorol" }, "PW-004": { type: "State", name: "Airai" }, "PW-002": { type: "State", name: "Aimeliik" }, "PW-010": { type: "State", name: "Angaur" }, "PW-350": { type: "State", name: "Peleliu" } } }, PT: { name: "Portugal", sub: { "PT-13": { type: "District", name: "Porto" }, "PT-12": { type: "District", name: "Portalegre" }, "PT-11": { type: "District", name: "Lisboa" }, "PT-10": { type: "District", name: "Leiria" }, "PT-08": { type: "District", name: "Faro" }, "PT-09": { type: "District", name: "Guarda" }, "PT-15": { type: "District", name: "Setúbal" }, "PT-14": { type: "District", name: "Santarém" }, "PT-04": { type: "District", name: "Bragança" }, "PT-05": { type: "District", name: "Castelo Branco" }, "PT-06": { type: "District", name: "Coimbra" }, "PT-07": { type: "District", name: "Évora" }, "PT-01": { type: "District", name: "Aveiro" }, "PT-02": { type: "District", name: "Beja" }, "PT-03": { type: "District", name: "Braga" }, "PT-20": { type: "Autonomous region", name: "Região Autónoma dos Açores" }, "PT-18": { type: "District", name: "Viseu" }, "PT-17": { type: "District", name: "Vila Real" }, "PT-30": { type: "Autonomous region", name: "Região Autónoma da Madeira" }, "PT-16": { type: "District", name: "Viana do Castelo" } } }, KN: { name: "Saint Kitts And Nevis", sub: { "KN-05": { type: "Parish", name: "Saint James Windward" }, "KN-04": { type: "Parish", name: "Saint George Gingerland" }, "KN-07": { type: "Parish", name: "Saint John Figtree" }, "KN-06": { type: "Parish", name: "Saint John Capisterre" }, "KN-01": { type: "Parish", name: "Christ Church Nichola Town" }, "KN-10": { type: "Parish", name: "Saint Paul Charlestown" }, "KN-03": { type: "Parish", name: "Saint George Basseterre" }, "KN-02": { type: "Parish", name: "Saint Anne Sandy Point" }, "KN-N": { type: "State", name: "Nevis" }, "KN-11": { type: "Parish", name: "Saint Peter Basseterre" }, "KN-09": { type: "Parish", name: "Saint Paul Capisterre" }, "KN-08": { type: "Parish", name: "Saint Mary Cayon" }, "KN-K": { type: "State", name: "Saint Kitts" }, "KN-15": { type: "Parish", name: "Trinity Palmetto Point" }, "KN-12": { type: "Parish", name: "Saint Thomas Lowland" }, "KN-13": { type: "Parish", name: "Saint Thomas Middle Island" } } }, PY: { name: "Paraguay", sub: { "PY-19": { type: "Department", name: "Boquerón" }, "PY-14": { type: "Department", name: "Canindeyú" }, "PY-15": { type: "Department", name: "Presidente Hayes" }, "PY-16": { type: "Department", name: "Alto Paraguay" }, "PY-10": { type: "Department", name: "Alto Paraná" }, "PY-11": { type: "Department", name: "Central" }, "PY-12": {
      type: "Department",
      name: "Ñeembucú"
    }, "PY-13": { type: "Department", name: "Amambay" }, "PY-6": { type: "Department", name: "Caazapá" }, "PY-7": { type: "Department", name: "Itapúa" }, "PY-4": { type: "Department", name: "Guairá" }, "PY-5": { type: "Department", name: "Caaguazú" }, "PY-2": { type: "Department", name: "San Pedro" }, "PY-3": { type: "Department", name: "Cordillera" }, "PY-1": { type: "Department", name: "Concepción" }, "PY-ASU": { type: "Capital", name: "Asunción" }, "PY-8": { type: "Department", name: "Misiones" }, "PY-9": { type: "Department", name: "Paraguarí" } } }, IQ: { name: "Iraq", sub: { "IQ-NA": { type: "Governorate", name: "An Najaf" }, "IQ-AN": { type: "Governorate", name: "Al Anbār" }, "IQ-WA": { type: "Governorate", name: "Wāsiţ" }, "IQ-SD": { type: "Governorate", name: "Şalāḩ ad Dīn" }, "IQ-MU": { type: "Governorate", name: "Al Muthanná" }, "IQ-DA": { type: "Governorate", name: "Dahūk" }, "IQ-SU": { type: "Governorate", name: "As Sulaymānīyah" }, "IQ-KA": { type: "Governorate", name: "Karbalā'" }, "IQ-BG": { type: "Governorate", name: "Baghdād" }, "IQ-NI": { type: "Governorate", name: "Nīnawá" }, "IQ-BA": { type: "Governorate", name: "Al Başrah" }, "IQ-BB": { type: "Governorate", name: "Bābil" }, "IQ-DQ": { type: "Governorate", name: "Dhī Qār" }, "IQ-MA": { type: "Governorate", name: "Maysān" }, "IQ-KI": { type: "Governorate", name: "Kirkūk" }, "IQ-DI": { type: "Governorate", name: "Diyālá" }, "IQ-QA": { type: "Governorate", name: "Al Qādisīyah" }, "IQ-AR": { type: "Governorate", name: "Arbīl" } } }, PA: { name: "Panama", sub: { "PA-NB": { type: "Indigenous region", name: "Ngöbe-Buglé" }, "PA-8": { type: "Province", name: "Panamá" }, "PA-9": { type: "Province", name: "Veraguas" }, "PA-6": { type: "Province", name: "Herrera" }, "PA-7": { type: "Province", name: "Los Santos" }, "PA-4": { type: "Province", name: "Chiriquí" }, "PA-5": { type: "Province", name: "Darién" }, "PA-2": { type: "Province", name: "Coclé" }, "PA-3": { type: "Province", name: "Colón" }, "PA-1": { type: "Province", name: "Bocas del Toro" }, "PA-10": { type: "Province", name: "Panamá Oeste" }, "PA-EM": { type: "Indigenous region", name: "Emberá" }, "PA-KY": { type: "Indigenous region", name: "Kuna Yala" } } }, PF: { name: "French Polynesia", sub: { "PF-PF": { type: "Country", name: "French Polynesia" } } }, PG: { name: "Papua New Guinea", sub: { "PG-WBK": { type: "Province", name: "West New Britain" }, "PG-NCD": { type: "District", name: "National Capital District" }, "PG-MPM": { type: "Province", name: "Madang" }, "PG-MPL": { type: "Province", name: "Morobe" }, "PG-MRL": { type: "Province", name: "Manus" }, "PG-EHG": { type: "Province", name: "Eastern Highlands" }, "PG-ESW": { type: "Province", name: "East Sepik" }, "PG-SAN": { type: "Province", name: "West Sepik" }, "PG-NIK": { type: "Province", name: "New Ireland" }, "PG-JWK": { type: "Province", name: "Jiwaka" }, "PG-MBA": { type: "Province", name: "Milne Bay" }, "PG-HLA": { type: "Province", name: "Hela" }, "PG-WPD": { type: "Province", name: "Western" }, "PG-NSB": { type: "Autonomous region", name: "Bougainville" }, "PG-EPW": { type: "Province", name: "Enga" }, "PG-CPM": { type: "Province", name: "Central" }, "PG-CPK": { type: "Province", name: "Chimbu" }, "PG-NPP": { type: "Province", name: "Northern" }, "PG-WHM": { type: "Province", name: "Western Highlands" }, "PG-GPK": { type: "Province", name: "Gulf" }, "PG-EBR": { type: "Province", name: "East New Britain" }, "PG-SHM": { type: "Province", name: "Southern Highlands" } } }, PE: { name: "Peru", sub: { "PE-PIU": { type: "Region", name: "Piura" }, "PE-ARE": { type: "Region", name: "Arequipa" }, "PE-APU": { type: "Region", name: "Apurímac" }, "PE-JUN": { type: "Region", name: "Hunin" }, "PE-LMA": { type: "Municipality", name: "Lima hatun llaqta" }, "PE-LOR": { type: "Region", name: "Loreto" }, "PE-LIM": { type: "Region", name: "Lima" }, "PE-AMA": { type: "Region", name: "Amarumayu" }, "PE-LAM": { type: "Region", name: "Lambayeque" }, "PE-LAL": { type: "Region", name: "La Libertad" }, "PE-HUC": { type: "Region", name: "Huánuco" }, "PE-CUS": { type: "Region", name: "Cusco" }, "PE-PUN": { type: "Region", name: "Puno" }, "PE-HUV": { type: "Region", name: "Huancavelica" }, "PE-MOQ": { type: "Region", name: "Moquegua" }, "PE-TAC": { type: "Region", name: "Tacna" }, "PE-AYA": { type: "Region", name: "Ayacucho" }, "PE-UCA": { type: "Region", name: "Ucayali" }, "PE-ICA": { type: "Region", name: "Ica" }, "PE-SAM": { type: "Region", name: "San Martin" }, "PE-ANC": { type: "Region", name: "Ancash" }, "PE-PAS": { type: "Region", name: "Pasco" }, "PE-CAL": { type: "Region", name: "El Callao" }, "PE-TUM": { type: "Region", name: "Tumbes" }, "PE-CAJ": { type: "Region", name: "Cajamarca" }, "PE-MDD": { type: "Region", name: "Madre de Dios" } } }, PK: { name: "Pakistan", sub: { "PK-IS": { type: "Federal capital territory", name: "Islāmābād" }, "PK-TA": { type: "Territory", name: "Federally Administered Tribal Areas" }, "PK-BA": { type: "Province", name: "Balochistan" }, "PK-KP": { type: "Province", name: "Khaībar Pakhtūnkhwā" }, "PK-PB": { type: "Province", name: "Panjāb" }, "PK-JK": { type: "Pakistan administered area", name: "Azad Kashmir" }, "PK-SD": { type: "Province", name: "Sindh" }, "PK-GB": { type: "Pakistan administered area", name: "Gilgit-Baltistān" } } }, PH: { name: "Philippines", sub: { "PH-08": { type: "Region", name: "Eastern Visayas" }, "PH-09": { type: "Region", name: "Rehiyon ng Tangway ng Sambuwangga" }, "PH-00": { type: "Region", name: "National Capital Region" }, "PH-01": { type: "Region", name: "Ilocos" }, "PH-02": { type: "Region", name: "Cagayan Valley" }, "PH-03": { type: "Region", name: "Central Luzon" }, "PH-05": { type: "Region", name: "Bicol" }, "PH-06": { type: "Region", name: "Rehiyon ng Kanlurang Bisaya" }, "PH-07": { type: "Region", name: "Central Visayas" }, "PH-SUR": { type: "Province", name: "Surigao del Sur" }, "PH-SLU": { type: "Province", name: "Sulu" }, "PH-DAV": { type: "Province", name: "Davao del Norte" }, "PH-CAM": { type: "Province", name: "Camiguin" }, "PH-CAN": { type: "Province", name: "Camarines Norte" }, "PH-BUL": { type: "Province", name: "Bulacan" }, "PH-CAG": { type: "Province", name: "Cagayan" }, "PH-BOH": { type: "Province", name: "Bohol" }, "PH-CAP": { type: "Province", name: "Capiz" }, "PH-CAS": { type: "Province", name: "Camarines Sur" }, "PH-CAT": { type: "Province", name: "Catanduanes" }, "PH-CAV": { type: "Province", name: "Cavite" }, "PH-BIL": { type: "Province", name: "Biliran" }, "PH-SLE": { type: "Province", name: "Katimogang Leyte" }, "PH-RIZ": { type: "Province", name: "Risal" }, "PH-COM": { type: "Province", name: "Compostela Valley" }, "PH-SCO": { type: "Province", name: "South Cotabato" }, "PH-ZSI": { type: "Province", name: "Sambuwangga Sibugay" }, "PH-ILS": { type: "Province", name: "Ilocos Sur" }, "PH-AGS": { type: "Province", name: "Agusan del Sur" }, "PH-ILI": { type: "Province", name: "Iloilo" }, "PH-WSA": { type: "Province", name: "Samar" }, "PH-PLW": { type: "Province", name: "Palawan" }, "PH-KAL": { type: "Province", name: "Kalinga" }, "PH-ZAS": { type: "Province", name: "Timog Sambuwangga" }, "PH-ZAN": { type: "Province", name: "Hilagang Sambuwangga" }, "PH-ALB": { type: "Province", name: "Albay" }, "PH-NUE": { type: "Province", name: "Nueva Ecija" }, "PH-NUV": { type: "Province", name: "Nueva Vizcaya" }, "PH-SUK": { type: "Province", name: "Sultan Kudarat" }, "PH-TAW": { type: "Province", name: "Tawi-Tawi" }, "PH-TAR": { type: "Province", name: "Tarlac" }, "PH-AKL": { type: "Province", name: "Aklan" }, "PH-BEN": { type: "Province", name: "Benget" }, "PH-DIN": { type: "Province", name: "Dinagat Islands" }, "PH-DAS": { type: "Province", name: "Davao del Sur" }, "PH-ROM": { type: "Province", name: "Romblon" }, "PH-ISA": { type: "Province", name: "Isabela" }, "PH-NER": { type: "Province", name: "Negros Oriental" }, "PH-LAS": { type: "Province", name: "Lanao del Sur" }, "PH-LAN": { type: "Province", name: "Hilagang Lanaw" }, "PH-NEC": { type: "Province", name: "Kanlurang Negros" }, "PH-LAG": { type: "Province", name: "Laguna" }, "PH-SUN": { type: "Province", name: "Hilagang Surigaw" }, "PH-AUR": { type: "Province", name: "Aurora" }, "PH-MSR": { type: "Province", name: "Misamis Oriental" }, "PH-ABR": { type: "Province", name: "Abra" }, "PH-MSC": { type: "Province", name: "Kanlurang Misamis" }, "PH-40": { type: "Region", name: "Calabarzon" }, "PH-41": { type: "Region", name: "Mimaropa" }, "PH-EAS": { type: "Province", name: "Eastern Samar" }, "PH-BTN": { type: "Province", name: "Batanes" }, "PH-BTG": { type: "Province", name: "Batangas" }, "PH-QUI": { type: "Province", name: "Kirino" }, "PH-CEB": { type: "Province", name: "Cebu" }, "PH-APA": { type: "Province", name: "Apayao" }, "PH-SAR": { type: "Province", name: "Sarangani" }, "PH-QUE": { type: "Province", name: "Keson" }, "PH-IFU": { type: "Province", name: "Ifugao" }, "PH-MAS": { type: "Province", name: "Masbate" }, "PH-SOR": { type: "Province", name: "Sorsogon" }, "PH-NCO": { type: "Province", name: "Cotabato" }, "PH-ZMB": { type: "Province", name: "Sambales" }, "PH-MAG": { type: "Province", name: "Magindanaw" }, "PH-MAD": { type: "Province", name: "Marinduke" }, "PH-BUK": { type: "Province", name: "Bukidnon" }, "PH-PAN": { type: "Province", name: "Pangasinan" }, "PH-PAM": { type: "Province", name: "Pampanga" }, "PH-GUI": { type: "Province", name: "Gimaras" }, "PH-NSA": { type: "Province", name: "Hilagang Samar" }, "PH-MDC": { type: "Province", name: "Kanlurang Mindoro" }, "PH-MDR": { type: "Province", name: "Mindoro Oriental" }, "PH-LUN": { type: "Province", name: "La Union" }, "PH-BAS": { type: "Province", name: "Basilan" }, "PH-BAN": { type: "Province", name: "Bataan" }, "PH-MOU": { type: "Province", name: "Lalawigang Bulubundukin" }, "PH-15": { type: "Region", name: "Cordillera Administrative Region" }, "PH-14": { type: "Region", name: "Autonomous Region in Muslim Mindanao" }, "PH-13": { type: "Region", name: "Caraga" }, "PH-12": { type: "Region", name: "Rehiyon ng Soccsksargen" }, "PH-11": { type: "Region", name: "Davao" }, "PH-10": { type: "Region", name: "Northern Mindanao" }, "PH-SIG": { type: "Province", name: "Sikihor" }, "PH-AGN": { type: "Province", name: "Agusan del Norte" }, "PH-ILN": { type: "Province", name: "Hilagang Iloko" }, "PH-DAO": { type: "Province", name: "Davao Oriental" }, "PH-LEY": { type: "Province", name: "Leyte" }, "PH-ANT": { type: "Province", name: "Antike" } } }, PN: { name: "Pitcairn", sub: { "PN-PN": { type: "Country", name: "Pitcairn" } } }, PL: { name: "Poland", sub: { "PL-SL": { type: "Province", name: "Śląskie" }, "PL-LU": { type: "Province", name: "Lubelskie" }, "PL-SK": { type: "Province", name: "Świętokrzyskie" }, "PL-WP": { type: "Province", name: "Wielkopolskie" }, "PL-ZP": { type: "Province", name: "Zachodniopomorskie" }, "PL-MZ": { type: "Province", name: "Mazowieckie" }, "PL-PD": { type: "Province", name: "Podlaskie" }, "PL-LB": { type: "Province", name: "Lubuskie" }, "PL-LD": { type: "Province", name: "Łódzkie" }, "PL-KP": { type: "Province", name: "Kujawsko-pomorskie" }, "PL-MA": { type: "Province", name: "Małopolskie" }, "PL-PM": { type: "Province", name: "Pomorskie" }, "PL-OP": { type: "Province", name: "Opolskie" }, "PL-DS": { type: "Province", name: "Dolnośląskie" }, "PL-WN": { type: "Province", name: "Warmińsko-mazurskie" }, "PL-PK": { type: "Province", name: "Podkarpackie" } } }, PM: { name: "St. Pierre & Miquelon", sub: { "PM-PM": { type: "Country", name: "St. Pierre & Miquelon" } } }, ZM: { name: "Zambia", sub: { "ZM-01": { type: "Province", name: "Western" }, "ZM-03": { type: "Province", name: "Eastern" }, "ZM-02": { type: "Province", name: "Central" }, "ZM-05": { type: "Province", name: "Northern" }, "ZM-04": { type: "Province", name: "Luapula" }, "ZM-07": { type: "Province", name: "Southern" }, "ZM-06": { type: "Province", name: "North-Western" }, "ZM-09": { type: "Province", name: "Lusaka" }, "ZM-08": { type: "Province", name: "Copperbelt" }, "ZM-10": { type: "Province", name: "Muchinga" } } }, EH: { name: "Western Sahara", sub: { "EH-EH": { type: "Country", name: "Western Sahara" } } }, EE: { name: "Estonia", sub: { "EE-86": { type: "County", name: "Võrumaa" }, "EE-39": { type: "County", name: "Hiiumaa" }, "EE-74": { type: "County", name: "Saaremaa" }, "EE-44": { type: "County", name: "Ida-Virumaa" }, "EE-70": { type: "County", name: "Raplamaa" }, "EE-37": { type: "County", name: "Harjumaa" }, "EE-51": { type: "County", name: "Järvamaa" }, "EE-84": { type: "County", name: "Viljandimaa" }, "EE-82": { type: "County", name: "Valgamaa" }, "EE-57": { type: "County", name: "Läänemaa" }, "EE-78": { type: "County", name: "Tartumaa" }, "EE-59": { type: "County", name: "Lääne-Virumaa" }, "EE-49": { type: "County", name: "Jõgevamaa" }, "EE-65": { type: "County", name: "Põlvamaa" }, "EE-67": { type: "County", name: "Pärnumaa" } } }, EG: { name: "Egypt", sub: { "EG-DT": { type: "Governorate", name: "Dumyāţ" }, "EG-SIN": { type: "Governorate", name: "Shamāl Sīnā'" }, "EG-BA": { type: "Governorate", name: "Al Baḩr al Aḩmar" }, "EG-BH": { type: "Governorate", name: "Al Buḩayrah" }, "EG-DK": { type: "Governorate", name: "Ad Daqahlīyah" }, "EG-SHG": { type: "Governorate", name: "Sūhāj" }, "EG-MT": { type: "Governorate", name: "Maţrūḩ" }, "EG-KN": { type: "Governorate", name: "Qinā" }, "EG-KB": { type: "Governorate", name: "Al Qalyūbīyah" }, "EG-MN": { type: "Governorate", name: "Al Minyā" }, "EG-GH": { type: "Governorate", name: "Al Gharbīyah" }, "EG-AST": { type: "Governorate", name: "Asyūţ" }, "EG-SHR": { type: "Governorate", name: "Ash Sharqīyah" }, "EG-ASN": { type: "Governorate", name: "Aswān" }, "EG-IS": { type: "Governorate", name: "Al Ismā'īlīyah" }, "EG-GZ": { type: "Governorate", name: "Al Jīzah" }, "EG-C": { type: "Governorate", name: "Al Qāhirah" }, "EG-SUZ": { type: "Governorate", name: "As Suways" }, "EG-ALX": { type: "Governorate", name: "Al Iskandarīyah" }, "EG-BNS": { type: "Governorate", name: "Banī Suwayf" }, "EG-LX": { type: "Governorate", name: "Al Uqşur" }, "EG-MNF": { type: "Governorate", name: "Al Minūfīyah" }, "EG-JS": { type: "Governorate", name: "Janūb Sīnā'" }, "EG-WAD": { type: "Governorate", name: "Al Wādī al Jadīd" }, "EG-KFS": { type: "Governorate", name: "Kafr ash Shaykh" }, "EG-FYM": { type: "Governorate", name: "Al Fayyūm" }, "EG-PTS": { type: "Governorate", name: "Būr Sa‘īd" } } }, ZA: { name: "South Africa", sub: { "ZA-NL": { type: "Province", name: "GaZulu-Natala" }, "ZA-GT": { type: "Province", name: "Gauteng" }, "ZA-EC": { type: "Province", name: "Eastern Cape" }, "ZA-NC": { type: "Province", name: "iTlhagwini-Kapa" }, "ZA-LP": { type: "Province", name: "Limpopo" }, "ZA-MP": { type: "Province", name: "iMpumalanga" }, "ZA-WC": { type: "Province", name: "iTjhingalanga-Kapa" }, "ZA-NW": { type: "Province", name: "Bokone Bophirima" }, "ZA-FS": { type: "Province", name: "Foreisetata" } } }, EC: { name: "Ecuador", sub: { "EC-SE": { type: "Province", name: "Santa Elena" }, "EC-SD": { type: "Province", name: "Santo Domingo de los Tsáchilas" }, "EC-Z": { type: "Province", name: "Zamora-Chinchipe" }, "EC-Y": { type: "Province", name: "Pastaza" }, "EC-X": { type: "Province", name: "Cotopaxi" }, "EC-W": { type: "Province", name: "Galápagos" }, "EC-U": { type: "Province", name: "Sucumbíos" }, "EC-T": { type: "Province", name: "Tungurahua" }, "EC-S": { type: "Province", name: "Morona-Santiago" }, "EC-R": { type: "Province", name: "Los Ríos" }, "EC-P": { type: "Province", name: "Pichincha" }, "EC-O": { type: "Province", name: "El Oro" }, "EC-N": { type: "Province", name: "Napo" }, "EC-M": { type: "Province", name: "Manabí" }, "EC-L": { type: "Province", name: "Loja" }, "EC-I": { type: "Province", name: "Imbabura" }, "EC-H": { type: "Province", name: "Chimborazo" }, "EC-G": { type: "Province", name: "Guayas" }, "EC-F": { type: "Province", name: "Cañar" }, "EC-E": { type: "Province", name: "Esmeraldas" }, "EC-D": { type: "Province", name: "Orellana" }, "EC-C": { type: "Province", name: "Carchi" }, "EC-B": { type: "Province", name: "Bolívar" }, "EC-A": { type: "Province", name: "Azuay" } } }, IT: { name: "Italy", sub: { "IT-BA": { type: "Province", name: "Bari" }, "IT-TR": { type: "Province", name: "Terni" }, "IT-BG": { type: "Province", name: "Bergamo" }, "IT-BI": { type: "Province", name: "Biella" }, "IT-BO": { type: "Province", name: "Bologna" }, "IT-BN": { type: "Province", name: "Benevento" }, "IT-BL": { type: "Province", name: "Belluno" }, "IT-BS": { type: "Province", name: "Brescia" }, "IT-BR": { type: "Province", name: "Brindisi" }, "IT-BT": { type: "Province", name: "Barletta-Andria-Trani" }, "IT-BZ": { type: "Province", name: "Bolzano" }, "IT-23": { type: "Region", name: "Val d'Aoste" }, "IT-21": { type: "Region", name: "Piemonte" }, "IT-25": { type: "Region", name: "Lombardia" }, "IT-RC": { type: "Province", name: "Reggio Calabria" }, "IT-RA": { type: "Province", name: "Ravenna" }, "IT-RG": { type: "Province", name: "Ragusa" }, "IT-RE": { type: "Province", name: "Reggio Emilia" }, "IT-RI": { type: "Province", name: "Rieti" }, "IT-RO": { type: "Province", name: "Rovigo" }, "IT-RN": { type: "Province", name: "Rimini" }, "IT-RM": { type: "Province", name: "Roma" }, "IT-AG": { type: "Province", name: "Agrigento" }, "IT-AN": { type: "Province", name: "Ancona" }, "IT-AO": { type: "Province", name: "Aosta" }, "IT-AL": { type: "Province", name: "Alessandria" }, "IT-IS": { type: "Province", name: "Isernia" }, "IT-AV": { type: "Province", name: "Avellino" }, "IT-AT": { type: "Province", name: "Asti" }, "IT-IM": { type: "Province", name: "Imperia" }, "IT-AR": { type: "Province", name: "Arezzo" }, "IT-AP": { type: "Province", name: "Ascoli Piceno" }, "IT-AQ": { type: "Province", name: "L'Aquila" }, "IT-FG": { type: "Province", name: "Foggia" }, "IT-34": { type: "Region", name: "Veneto" }, "IT-36": { type: "Region", name: "Friuli-Venezia Giulia" }, "IT-FE": { type: "Province", name: "Ferrara" }, "IT-32": { type: "Region", name: "Trentino-Alto Adige" }, "IT-VE": { type: "Province", name: "Venezia" }, "IT-LC": { type: "Province", name: "Lecco" }, "IT-LE": { type: "Province", name: "Lecce" }, "IT-LI": { type: "Province", name: "Livorno" }, "IT-TP": { type: "Province", name: "Trapani" }, "IT-TS": { type: "Province", name: "Trieste" }, "IT-42": { type: "Region", name: "Liguria" }, "IT-45": { type: "Region", name: "Emilia-Romagna" }, "IT-LO": { type: "Province", name: "Lodi" }, "IT-TV": { type: "Province", name: "Treviso" }, "IT-LU": { type: "Province", name: "Lucca" }, "IT-LT": { type: "Province", name: "Latina" }, "IT-TO": { type: "Province", name: "Torino" }, "IT-TN": { type: "Province", name: "Trento" }, "IT-TA": { type: "Province", name: "Taranto" }, "IT-TE": { type: "Province", name: "Teramo" }, "IT-CL": { type: "Province", name: "Caltanissetta" }, "IT-CN": { type: "Province", name: "Cuneo" }, "IT-CO": { type: "Province", name: "Como" }, "IT-CH": { type: "Province", name: "Chieti" }, "IT-CI": { type: "Province", name: "Carbonia-Iglesias" }, "IT-CE": { type: "Province", name: "Caserta" }, "IT-CA": { type: "Province", name: "Cagliari" }, "IT-CB": { type: "Province", name: "Campobasso" }, "IT-CZ": { type: "Province", name: "Catanzaro" }, "IT-CT": { type: "Province", name: "Catania" }, "IT-CR": { type: "Province", name: "Cremona" }, "IT-CS": { type: "Province", name: "Cosenza" }, "IT-52": { type: "Region", name: "Toscana" }, "IT-SV": { type: "Province", name: "Savona" }, "IT-SP": { type: "Province", name: "La Spezia" }, "IT-57": { type: "Region", name: "Marche" }, "IT-SR": { type: "Province", name: "Siracusa" }, "IT-55": { type: "Region", name: "Umbria" }, "IT-SO": { type: "Province", name: "Sondrio" }, "IT-SI": { type: "Province", name: "Siena" }, "IT-KR": { type: "Province", name: "Crotone" }, "IT-SA": { type: "Province", name: "Salerno" }, "IT-VR": { type: "Province", name: "Verona" }, "IT-FR": { type: "Province", name: "Frosinone" }, "IT-67": { type: "Region", name: "Molise" }, "IT-65": { type: "Region", name: "Abruzzo" }, "IT-FC": { type: "Province", name: "Forlì-Cesena" }, "IT-62": { type: "Region", name: "Lazio" }, "IT-FM": { type: "Province", name: "Fermo" }, "IT-FI": { type: "Province", name: "Firenze" }, "IT-NO": { type: "Province", name: "Novara" }, "IT-NA": { type: "Province", name: "Napoli" }, "IT-NU": { type: "Province", name: "Nuoro" }, "IT-EN": { type: "Province", name: "Enna" }, "IT-72": { type: "Region", name: "Campania" }, "IT-75": { type: "Region", name: "Puglia" }, "IT-77": { type: "Region", name: "Basilicata" }, "IT-78": { type: "Region", name: "Calabria" }, "IT-MB": { type: "Province", name: "Monza e Brianza" }, "IT-MC": { type: "Province", name: "Macerata" }, "IT-ME": { type: "Province", name: "Messina" }, "IT-MI": { type: "Province", name: "Milano" }, "IT-MN": { type: "Province", name: "Mantova" }, "IT-MO": { type: "Province", name: "Modena" }, "IT-MS": { type: "Province", name: "Massa-Carrara" }, "IT-MT": { type: "Province", name: "Matera" }, "IT-UD": { type: "Province", name: "Udine" }, "IT-88": { type: "Region", name: "Sardegna" }, "IT-SS": { type: "Province", name: "Sassari" }, "IT-82": { type: "Region", name: "Sicilia" }, "IT-PU": { type: "Province", name: "Pesaro e Urbino" }, "IT-PT": { type: "Province", name: "Pistoia" }, "IT-PV": { type: "Province", name: "Pavia" }, "IT-PR": { type: "Province", name: "Parma" }, "IT-PZ": { type: "Province", name: "Potenza" }, "IT-PE": { type: "Province", name: "Pescara" }, "IT-PD": { type: "Province", name: "Padova" }, "IT-PG": { type: "Province", name: "Perugia" }, "IT-PA": { type: "Province", name: "Palermo" }, "IT-PC": { type: "Province", name: "Piacenza" }, "IT-PO": { type: "Province", name: "Prato" }, "IT-PN": { type: "Province", name: "Pordenone" }, "IT-PI": { type: "Province", name: "Pisa" }, "IT-GR": { type: "Province", name: "Grosseto" }, "IT-VC": { type: "Province", name: "Vercelli" }, "IT-VB": { type: "Province", name: "Verbano-Cusio-Ossola" }, "IT-VA": { type: "Province", name: "Varese" }, "IT-VI": { type: "Province", name: "Vicenza" }, "IT-VV": { type: "Province", name: "Vibo Valentia" }, "IT-VT": { type: "Province", name: "Viterbo" }, "IT-VS": { type: "Province", name: "Medio Campidano" }, "IT-GE": { type: "Province", name: "Genova" }, "IT-GO": { type: "Province", name: "Gorizia" }, "IT-OG": { type: "Province", name: "Ogliastra" }, "IT-OR": { type: "Province", name: "Oristano" }, "IT-OT": { type: "Province", name: "Olbia-Tempio" } } }, VN: { name: "Viet Nam", sub: { "VN-28": { type: "Province", name: "Kon Tum" }, "VN-29": { type: "Province", name: "Quảng Ngãi" }, "VN-26": { type: "Province", name: "Thừa Thiên-Huế" }, "VN-27": { type: "Province", name: "Quảng Nam" }, "VN-24": { type: "Province", name: "Quảng Bình" }, "VN-25": { type: "Province", name: "Quảng Trị" }, "VN-22": { type: "Province", name: "Nghệ An" }, "VN-23": { type: "Province", name: "Hà Tĩnh" }, "VN-20": { type: "Province", name: "Thái Bình" }, "VN-21": { type: "Province", name: "Thanh Hóa" }, "VN-72": { type: "Province", name: "Đắk Nông" }, "VN-DN": { type: "Municipality", name: "Da Nang" }, "VN-SG": { type: "Municipality", name: "Ho Chi Minh" }, "VN-70": { type: "Province", name: "Vĩnh Phúc" }, "VN-67": { type: "Province", name: "Nam Ðịnh" }, "VN-49": { type: "Province", name: "Vĩnh Long" }, "VN-63": { type: "Province", name: "Hà Nam" }, "VN-HN": { type: "Municipality", name: "Ha Noi" }, "VN-71": { type: "Province", name: "Điện Biên" }, "VN-35": { type: "Province", name: "Lâm Ðồng" }, "VN-73": { type: "Province", name: "Hậu Giang" }, "VN-61": { type: "Province", name: "Hải Dương" }, "VN-59": { type: "Province", name: "Cà Mau" }, "VN-58": { type: "Province", name: "Bình Phước" }, "VN-57": { type: "Province", name: "Bình Dương" }, "VN-56": { type: "Province", name: "Bắc Ninh" }, "VN-55": { type: "Province", name: "Bạc Liêu" }, "VN-54": { type: "Province", name: "Bắc Giang" }, "VN-53": { type: "Province", name: "Bắc Kạn" }, "VN-52": { type: "Province", name: "Sóc Trăng" }, "VN-51": { type: "Province", name: "Trà Vinh" }, "VN-50": { type: "Province", name: "Bến Tre" }, "VN-18": { type: "Province", name: "Ninh Bình" }, "VN-39": { type: "Province", name: "Ðồng Nai" }, "VN-13": { type: "Province", name: "Quảng Ninh" }, "VN-34": { type: "Province", name: "Khánh Hòa" }, "VN-37": { type: "Province", name: "Tây Ninh" }, "VN-36": { type: "Province", name: "Ninh Thuận" }, "VN-31": { type: "Province", name: "Bình Định" }, "VN-30": { type: "Province", name: "Gia Lai" }, "VN-33": { type: "Province", name: "Đắk Lắk" }, "VN-14": { type: "Province", name: "Hòa Bình" }, "VN-CT": { type: "Municipality", name: "Can Tho" }, "VN-32": { type: "Province", name: "Phú Yên" }, "VN-69": { type: "Province", name: "Thái Nguyên" }, "VN-HP": { type: "Municipality", name: "Hai Phong" }, "VN-45": { type: "Province", name: "Ðồng Tháp" }, "VN-04": { type: "Province", name: "Cao Bằng" }, "VN-05": { type: "Province", name: "Sơn La" }, "VN-06": { type: "Province", name: "Yên Bái" }, "VN-07": { type: "Province", name: "Tuyên Quang" }, "VN-66": { type: "Province", name: "Hưng Yên" }, "VN-01": { type: "Province", name: "Lai Châu" }, "VN-02": { type: "Province", name: "Lào Cai" }, "VN-03": { type: "Province", name: "Hà Giang" }, "VN-40": { type: "Province", name: "Bình Thuận" }, "VN-41": { type: "Province", name: "Long An" }, "VN-68": { type: "Province", name: "Phú Thọ" }, "VN-43": { type: "Province", name: "Bà Rịa - Vũng Tàu" }, "VN-44": { type: "Province", name: "An Giang" }, "VN-09": { type: "Province", name: "Lạng Sơn" }, "VN-46": { type: "Province", name: "Tiền Giang" }, "VN-47": { type: "Province", name: "Kiến Giang" } } }, SB: { name: "Solomon Islands", sub: { "SB-TE": { type: "Province", name: "Temotu" }, "SB-IS": { type: "Province", name: "Isabel" }, "SB-ML": { type: "Province", name: "Malaita" }, "SB-MK": { type: "Province", name: "Makira-Ulawa" }, "SB-CH": { type: "Province", name: "Choiseul" }, "SB-GU": { type: "Province", name: "Guadalcanal" }, "SB-CT": { type: "Capital territory", name: "Capital Territory" }, "SB-RB": { type: "Province", name: "Rennell and Bellona" }, "SB-WE": { type: "Province", name: "Western" }, "SB-CE": { type: "Province", name: "Central" } } }, ET: { name: "Ethiopia", sub: { "ET-BE": { type: "State", name: "Benshangul-Gumaz" }, "ET-OR": { type: "State", name: "Oromia" }, "ET-TI": { type: "State", name: "Tigrai" }, "ET-HA": { type: "State", name: "Harari People" }, "ET-DD": { type: "Administration", name: "Dire Dawa" }, "ET-AM": { type: "State", name: "Amara" }, "ET-AA": { type: "Administration", name: "Addis Ababa" }, "ET-AF": { type: "State", name: "Afar" }, "ET-GA": { type: "State", name: "Gambēla Hizboch" }, "ET-SN": { type: "State", name: "Southern Nations, Nationalities and Peoples" }, "ET-SO": { type: "State", name: "Somali" } } }, SO: { name: "Somalia", sub: { "SO-SO": { type: "Region", name: "Sool" }, "SO-BK": { type: "Region", name: "Bakool" }, "SO-WO": { type: "Region", name: "Woqooyi Galbeed" }, "SO-BN": { type: "Region", name: "Banaadir" }, "SO-TO": { type: "Region", name: "Togdheer" }, "SO-MU": { type: "Region", name: "Mudug" }, "SO-BY": { type: "Region", name: "Bay" }, "SO-HI": { type: "Region", name: "Hiiraan" }, "SO-JD": { type: "Region", name: "Jubbada Dhexe" }, "SO-SA": { type: "Region", name: "Sanaag" }, "SO-AW": { type: "Region", name: "Awdal" }, "SO-SH": { type: "Region", name: "Shabeellaha Hoose" }, "SO-JH": { type: "Region", name: "Jubbada Hoose" }, "SO-NU": { type: "Region", name: "Nugaal" }, "SO-GA": { type: "Region", name: "Galguduud" }, "SO-SD": { type: "Region", name: "Shabeellaha Dhexe" }, "SO-BR": { type: "Region", name: "Bari" }, "SO-GE": { type: "Region", name: "Gedo" } } }, ZW: { name: "Zimbabwe", sub: { "ZW-BU": { type: "Province", name: "Bulawayo" }, "ZW-HA": { type: "Province", name: "Harare" }, "ZW-MS": { type: "Province", name: "Matabeleland South" }, "ZW-MV": { type: "Province", name: "Masvingo" }, "ZW-MW": { type: "Province", name: "Mashonaland West" }, "ZW-MI": { type: "Province", name: "Midlands" }, "ZW-MN": { type: "Province", name: "Matabeleland North" }, "ZW-MA": { type: "Province", name: "Manicaland" }, "ZW-MC": { type: "Province", name: "Mashonaland Central" }, "ZW-ME": { type: "Province", name: "Mashonaland East" } } }, SA: { name: "Saudi Arabia", sub: { "SA-08": { type: "Province", name: "Al Ḩudūd ash Shamālīyah" }, "SA-09": { type: "Province", name: "Jāzān" }, "SA-14": { type: "Province", name: "'Asīr" }, "SA-01": { type: "Province", name: "Ar Riyāḑ" }, "SA-02": { type: "Province", name: "Makkah al Mukarramah" }, "SA-03": { type: "Province", name: "Al Madīnah al Munawwarah" }, "SA-04": { type: "Province", name: "Ash Sharqīyah" }, "SA-05": { type: "Province", name: "Al Qaşīm" }, "SA-06": { type: "Province", name: "Ḩā'il" }, "SA-07": { type: "Province", name: "Tabūk" }, "SA-11": { type: "Province", name: "Al Bāḩah" }, "SA-10": { type: "Province", name: "Najrān" }, "SA-12": { type: "Province", name: "Al Jawf" } } }, ES: { name: "Spain", sub: { "ES-NA": { type: "Province", name: "Nafarroa*" }, "ES-PM": { type: "Province", name: "Balears" }, "ES-TF": { type: "Province", name: "Santa Cruz de Tenerife" }, "ES-B": { type: "Province", name: "Barcelona" }, "ES-A": { type: "Province", name: "Alacant*" }, "ES-ZA": { type: "Province", name: "Zamora" }, "ES-MU": { type: "Province", name: "Murcia" }, "ES-VI": { type: "Province", name: "Álava" }, "ES-Z": { type: "Province", name: "Zaragoza" }, "ES-O": { type: "Province", name: "Asturias" }, "ES-IB": { type: "Autonomous community", name: "Illes Balears" }, "ES-M": { type: "Province", name: "Madrid" }, "ES-L": { type: "Province", name: "Lleida" }, "ES-J": { type: "Province", name: "Jaén" }, "ES-H": { type: "Province", name: "Huelva" }, "ES-AS": { type: "Autonomous community", name: "Asturias, Principado de" }, "ES-AR": { type: "Autonomous community", name: "Aragón" }, "ES-C": { type: "Province", name: "A Coruña" }, "ES-AV": { type: "Province", name: "Ávila" }, "ES-CS": { type: "Province", name: "Castelló*" }, "ES-CR": { type: "Province", name: "Ciudad Real" }, "ES-CM": { type: "Autonomous community", name: "Castilla-La Mancha" }, "ES-CL": { type: "Autonomous community", name: "Castilla y León" }, "ES-CO": { type: "Province", name: "Córdoba" }, "ES-CN": { type: "Autonomous community", name: "Canarias" }, "ES-MC": { type: "Autonomous community", name: "Murcia, Región de" }, "ES-AN": { type: "Autonomous community", name: "Andalucía" }, "ES-MA": { type: "Province", name: "Málaga" }, "ES-AL": { type: "Province", name: "Almería" }, "ES-CE": { type: "Autonomous city in north africa", name: "Ceuta" }, "ES-AB": { type: "Province", name: "Albacete" }, "ES-T": { type: "Province", name: "Tarragona" }, "ES-ML": { type: "Autonomous city in north africa", name: "Melilla" }, "ES-CA": { type: "Province", name: "Cádiz" }, "ES-TE": { type: "Province", name: "Teruel" }, "ES-CC": { type: "Province", name: "Cáceres" }, "ES-CB": { type: "Autonomous community", name: "Cantabria" }, "ES-GA": { type: "Autonomous community", name: "Galicia" }, "ES-PO": { type: "Province", name: "Pontevedra" }, "ES-GC": { type: "Province", name: "Las Palmas" }, "ES-RI": { type: "Autonomous community", name: "La Rioja" }, "ES-S": { type: "Province", name: "Cantabria" }, "ES-GI": { type: "Province", name: "Girona" }, "ES-TO": { type: "Province", name: "Toledo" }, "ES-CT": { type: "Autonomous community", name: "Catalunya" }, "ES-GR": { type: "Province", name: "Granada" }, "ES-GU": { type: "Province", name: "Guadalajara" }, "ES-MD": { type: "Autonomous community", name: "Madrid, Comunidad de" }, "ES-EX": { type: "Autonomous community", name: "Extremadura" }, "ES-PV": { type: "Autonomous community", name: "Euskal Herria" }, "ES-V": { type: "Province", name: "Valencia" }, "ES-VC": { type: "Autonomous community", name: "Valenciana, Comunidad" }, "ES-SO": { type: "Province", name: "Soria" }, "ES-OR": { type: "Province", name: "Ourense" }, "ES-LU": { type: "Province", name: "Lugo" }, "ES-SE": { type: "Province", name: "Sevilla" }, "ES-NC": { type: "Autonomous community", name: "Nafarroako Foru Komunitatea*" }, "ES-SG": { type: "Province", name: "Segovia" }, "ES-BU": { type: "Province", name: "Burgos" }, "ES-SA": { type: "Province", name: "Salamanca" }, "ES-VA": { type: "Province", name: "Valladolid" }, "ES-CU": { type: "Province", name: "Cuenca" }, "ES-P": { type: "Province", name: "Palencia" }, "ES-LE": { type: "Province", name: "León" }, "ES-BI": { type: "Province", name: "Bizkaia*" }, "ES-HU": { type: "Province", name: "Huesca" }, "ES-LO": { type: "Province", name: "La Rioja" }, "ES-SS": { type: "Province", name: "Gipuzkoa*" }, "ES-BA": { type: "Province", name: "Badajoz" } } }, ER: { name: "Eritrea", sub: { "ER-AN": { type: "Region", name: "Ansabā" }, "ER-MA": { type: "Region", name: "Al Awsaţ" }, "ER-DU": { type: "Region", name: "Al Janūbī" }, "ER-DK": { type: "Region", name: "Debubawi K’eyyĭḥ Baḥri" }, "ER-SK": { type: "Region", name: "Semienawi K’eyyĭḥ Baḥri" }, "ER-GB": { type: "Region", name: "Gash-Barka" } } }, ME: { name: "Montenegro", sub: { "ME-06": { type: "Municipality", name: "Cetinje" }, "ME-07": { type: "Municipality", name: "Danilovgrad" }, "ME-04": { type: "Municipality", name: "Bijelo Polje" }, "ME-05": { type: "Municipality", name: "Budva" }, "ME-02": { type: "Municipality", name: "Bar" }, "ME-03": { type: "Municipality", name: "Berane" }, "ME-01": { type: "Municipality", name: "Andrijevica" }, "ME-20": { type: "Municipality", name: "Ulcinj" }, "ME-21": { type: "Municipality", name: "Žabljak" }, "ME-08": { type: "Municipality", name: "Herceg-Novi" }, "ME-09": { type: "Municipality", name: "Kolašin" }, "ME-15": { type: "Municipality", name: "Plužine" }, "ME-14": { type: "Municipality", name: "Pljevlja" }, "ME-17": { type: "Municipality", name: "Rožaje" }, "ME-16": { type: "Municipality", name: "Podgorica" }, "ME-11": { type: "Municipality", name: "Mojkovac" }, "ME-10": { type: "Municipality", name: "Kotor" }, "ME-13": { type: "Municipality", name: "Plav" }, "ME-12": { type: "Municipality", name: "Nikšić" }, "ME-19": { type: "Municipality", name: "Tivat" }, "ME-18": { type: "Municipality", name: "Šavnik" }, "ME-22": { type: "Municipality", name: "Gusinje" }, "ME-23": { type: "Municipality", name: "Petnjica" } } }, MD: { name: "Moldova", sub: { "MD-LE": { type: "District", name: "Leova" }, "MD-SO": { type: "District", name: "Soroca" }, "MD-TE": { type: "District", name: "Teleneşti" }, "MD-IA": { type: "District", name: "Ialoveni" }, "MD-TA": { type: "District", name: "Taraclia" }, "MD-OC": { type: "District", name: "Ocniţa" }, "MD-RI": { type: "District", name: "Rîşcani" }, "MD-ED": { type: "District", name: "Edineţ" }, "MD-RE": { type: "District", name: "Rezina" }, "MD-OR": { type: "District", name: "Orhei" }, "MD-CL": { type: "District", name: "Călăraşi" }, "MD-CM": { type: "District", name: "Cimişlia" }, "MD-GL": { type: "District", name: "Glodeni" }, "MD-CA": { type: "District", name: "Cahul" }, "MD-AN": { type: "District", name: "Anenii Noi" }, "MD-UN": { type: "District", name: "Ungheni" }, "MD-CR": { type: "District", name: "Criuleni" }, "MD-CS": { type: "District", name: "Căuşeni" }, "MD-CT": { type: "District", name: "Cantemir" }, "MD-CU": { type: "City", name: "Chişinău" }, "MD-HI": { type: "District", name: "Hînceşti" }, "MD-DU": { type: "District", name: "Dubăsari" }, "MD-NI": { type: "District", name: "Nisporeni" }, "MD-ST": { type: "District", name: "Străşeni" }, "MD-SV": { type: "District", name: "Ştefan Vodă" }, "MD-DR": { type: "District", name: "Drochia" }, "MD-SI": { type: "District", name: "Sîngerei" }, "MD-DO": { type: "District", name: "Donduşeni" }, "MD-SN": { type: "Territorial unit", name: "Stînga Nistrului, unitatea teritorială din" }, "MD-FL": { type: "District", name: "Floreşti" }, "MD-FA": { type: "District", name: "Făleşti" }, "MD-SD": { type: "District", name: "Şoldăneşti" }, "MD-GA": { type: "Autonomous territorial unit", name: "Găgăuzia, Unitatea teritorială autonomă" }, "MD-BD": { type: "City", name: "Bender" }, "MD-BA": { type: "City", name: "Bălţi" }, "MD-BS": { type: "District", name: "Basarabeasca" }, "MD-BR": { type: "District", name: "Briceni" } } }, MG: { name: "Madagascar", sub: { "MG-A": { type: "Province", name: "Toamasina" }, "MG-F": { type: "Province", name: "Fianarantsoa" }, "MG-D": { type: "Province", name: "Antsiranana" }, "MG-M": { type: "Province", name: "Mahajanga" }, "MG-U": { type: "Province", name: "Toliara" }, "MG-T": { type: "Province", name: "Antananarivo" } } }, MF: { name: "St. Martin", sub: { "MF-MF": { type: "Country", name: "St. Martin" } } }, MA: { name: "Morocco", sub: { "MA-RAB": { type: "Prefecture", name: "Rabat" }, "MA-MMD": { type: "Prefecture", name: "Marrakech-Medina" }, "MA-AOU": { type: "Prefecture", name: "Aousserd" }, "MA-BEM": { type: "Province", name: "Beni Mellal" }, "MA-CAS": { type: "Prefecture", name: "Casablanca" }, "MA-TIZ": { type: "Province", name: "Tiznit" }, "MA-SAF": { type: "Province", name: "Safi" }, "MA-FIG": { type: "Province", name: "Figuig" }, "MA-SAL": { type: "Prefecture", name: "Salé" }, "MA-JDI": {
      type: "Province",
      name: "El Jadida"
    }, "MA-LAR": { type: "Province", name: "Larache" }, "MA-SKH": { type: "Prefecture", name: "Skhirate-Témara" }, "MA-KHE": { type: "Province", name: "Khemisset" }, "MA-LAA": { type: "Province", name: "Laâyoune" }, "MA-GUE": { type: "Province", name: "Guelmim" }, "MA-HAO": { type: "Province", name: "Al Haouz" }, "MA-KHN": { type: "Province", name: "Khenifra" }, "MA-KHO": { type: "Province", name: "Khouribga" }, "MA-TAR": { type: "Province", name: "Taroudant" }, "MA-ESM": { type: "Province", name: "Es Smara" }, "MA-BER": { type: "Province", name: "Berkane" }, "MA-BES": { type: "Province", name: "Ben Slimane" }, "MA-ESI": { type: "Province", name: "Essaouira" }, "MA-SET": { type: "Province", name: "Settat" }, "MA-CHT": { type: "Province", name: "Chtouka-Ait Baha" }, "MA-AZI": { type: "Province", name: "Azilal" }, "MA-NOU": { type: "Province", name: "Nouaceur" }, "MA-MOH": { type: "Prefecture", name: "Mohammadia" }, "MA-MOU": { type: "Province", name: "Moulay Yacoub" }, "MA-KEN": { type: "Province", name: "Kénitra" }, "MA-11": { type: "Region", name: "Marrakech-Tensift-Al Haouz" }, "MA-10": { type: "Region", name: "Doukkala-Abda" }, "MA-13": { type: "Region", name: "Sous-Massa-Draa" }, "MA-12": { type: "Region", name: "Tadla-Azilal" }, "MA-15": { type: "Region", name: "Laâyoune-Boujdour-Sakia el Hamra" }, "MA-14": { type: "Region", name: "Guelmim-Es Semara" }, "MA-HAJ": { type: "Province", name: "El Hajeb" }, "MA-16": { type: "Region", name: "Oued ed Dahab-Lagouira" }, "MA-BOD": { type: "Province", name: "Boujdour" }, "MA-SYB": { type: "Prefecture", name: "Sidi Youssef Ben Ali" }, "MA-ZAG": { type: "Province", name: "Zagora" }, "MA-CHE": { type: "Province", name: "Chefchaouen" }, "MA-KES": { type: "Province", name: "Kelaat es Sraghna" }, "MA-TAI": { type: "Province", name: "Taourirt" }, "MA-JRA": { type: "Province", name: "Jrada" }, "MA-MED": { type: "Province", name: "Médiouna" }, "MA-TAO": { type: "Province", name: "Taounate" }, "MA-TET": { type: "Prefecture", name: "Tétouan" }, "MA-ASZ": { type: "Province", name: "Assa-Zag" }, "MA-TNG": { type: "Prefecture", name: "Tanger-Assilah" }, "MA-SEF": { type: "Province", name: "Sefrou" }, "MA-MMN": { type: "Prefecture", name: "Marrakech-Menara" }, "MA-TAZ": { type: "Province", name: "Taza" }, "MA-INE": { type: "Prefecture", name: "Inezgane-Ait Melloul" }, "MA-NAD": { type: "Province", name: "Nador" }, "MA-CHI": { type: "Province", name: "Chichaoua" }, "MA-ERR": { type: "Province", name: "Errachidia" }, "MA-TNT": { type: "Province", name: "Tan-Tan" }, "MA-TAT": { type: "Province", name: "Tata" }, "MA-IFR": { type: "Province", name: "Ifrane" }, "MA-09": { type: "Region", name: "Chaouia-Ouardigha" }, "MA-SIK": { type: "Province", name: "Sidi Kacem" }, "MA-OUJ": { type: "Prefecture", name: "Oujda-Angad" }, "MA-FES": { type: "Prefecture", name: "Fès-Dar-Dbibegh" }, "MA-OUD": { type: "Province", name: "Oued ed Dahab" }, "MA-MEK": { type: "Prefecture", name: "Meknès" }, "MA-OUA": { type: "Province", name: "Ouarzazate" }, "MA-02": { type: "Region", name: "Gharb-Chrarda-Beni Hssen" }, "MA-03": { type: "Region", name: "Taza-Al Hoceima-Taounate" }, "MA-01": { type: "Region", name: "Tanger-Tétouan" }, "MA-06": { type: "Region", name: "Meknès-Tafilalet" }, "MA-07": { type: "Region", name: "Rabat-Salé-Zemmour-Zaer" }, "MA-04": { type: "Region", name: "L'Oriental" }, "MA-05": { type: "Region", name: "Fès-Boulemane" }, "MA-08": { type: "Region", name: "Grand Casablanca" }, "MA-AGD": { type: "Prefecture", name: "Agadir-Ida-Outanane" }, "MA-BOM": { type: "Province", name: "Boulemane" }, "MA-FAH": { type: "Prefecture", name: "Fahs-Beni Makada" }, "MA-HOC": { type: "Province", name: "Al Hoceïma" } } }, MC: { name: "Monaco", sub: { "MC-MO": { type: "Quarter", name: "Monaco-Ville" }, "MC-VR": { type: "Quarter", name: "Vallon de la Rousse" }, "MC-FO": { type: "Quarter", name: "Fontvieille" }, "MC-SD": { type: "Quarter", name: "Sainte-Dévote" }, "MC-GA": { type: "Quarter", name: "La Gare" }, "MC-CL": { type: "Quarter", name: "La Colle" }, "MC-CO": { type: "Quarter", name: "La Condamine" }, "MC-SR": { type: "Quarter", name: "Saint-Roman" }, "MC-MC": { type: "Quarter", name: "Monte-Carlo" }, "MC-MA": { type: "Quarter", name: "Malbousquet" }, "MC-MG": { type: "Quarter", name: "Moneghetti" }, "MC-PH": { type: "Quarter", name: "Port-Hercule" }, "MC-LA": { type: "Quarter", name: "Larvotto" }, "MC-MU": { type: "Quarter", name: "Moulins" }, "MC-JE": { type: "Quarter", name: "Jardin Exotique" }, "MC-SO": { type: "Quarter", name: "La Source" }, "MC-SP": { type: "Quarter", name: "Spélugues" } } }, UZ: { name: "Uzbekistan", sub: { "UZ-QA": { type: "Region", name: "Qashqadaryo" }, "UZ-FA": { type: "Region", name: "Farg‘ona" }, "UZ-JI": { type: "Region", name: "Jizzax" }, "UZ-TO": { type: "Region", name: "Toshkent" }, "UZ-NW": { type: "Region", name: "Navoiy" }, "UZ-SU": { type: "Region", name: "Surxondaryo" }, "UZ-XO": { type: "Region", name: "Xorazm" }, "UZ-QR": { type: "Republic", name: "Qoraqalpog‘iston Respublikasi" }, "UZ-SI": { type: "Region", name: "Sirdaryo" }, "UZ-TK": { type: "City", name: "Toshkent" }, "UZ-NG": { type: "Region", name: "Namangan" }, "UZ-SA": { type: "Region", name: "Samarqand" }, "UZ-BU": { type: "Region", name: "Buxoro" }, "UZ-AN": { type: "Region", name: "Andijon" } } }, MM: { name: "Myanmar", sub: { "MM-16": { type: "State", name: "Rakhine" }, "MM-18": { type: "Union territory", name: "Nay Pyi Taw" }, "MM-06": { type: "Region", name: "Yangon" }, "MM-07": { type: "Region", name: "Ayeyawady" }, "MM-04": { type: "Region", name: "Mandalay" }, "MM-05": { type: "Region", name: "Taninthayi" }, "MM-02": { type: "Region", name: "Bago" }, "MM-03": { type: "Region", name: "Magway" }, "MM-13": { type: "State", name: "Kayin" }, "MM-01": { type: "Region", name: "Sagaing" }, "MM-15": { type: "State", name: "Mon" }, "MM-14": { type: "State", name: "Chin" }, "MM-11": { type: "State", name: "Kachin" }, "MM-12": { type: "State", name: "Kayah" }, "MM-17": { type: "State", name: "Shan" } } }, ML: { name: "Mali", sub: { "ML-BKO": { type: "District", name: "Bamako" }, "ML-1": { type: "Region", name: "Kayes" }, "ML-2": { type: "Region", name: "Koulikoro" }, "ML-3": { type: "Region", name: "Sikasso" }, "ML-4": { type: "Region", name: "Ségou" }, "ML-5": { type: "Region", name: "Mopti" }, "ML-6": { type: "Region", name: "Tombouctou" }, "ML-7": { type: "Region", name: "Gao" }, "ML-8": { type: "Region", name: "Kidal" } } }, MO: { name: "Macau", sub: { "MO-MO": { type: "Country", name: "Macau" } } }, MN: { name: "Mongolia", sub: { "MN-073": { type: "Province", name: "Arhangay" }, "MN-047": { type: "Province", name: "Töv" }, "MN-039": { type: "Province", name: "Hentiy" }, "MN-071": { type: "Province", name: "Bayan-Ölgiy" }, "MN-059": { type: "Province", name: "Dundgovĭ" }, "MN-057": { type: "Province", name: "Dzavhan" }, "MN-055": { type: "Province", name: "Övörhangay" }, "MN-053": { type: "Province", name: "Ömnögovĭ" }, "MN-051": { type: "Province", name: "Sühbaatar" }, "MN-035": { type: "Province", name: "Orhon" }, "MN-037": { type: "Province", name: "Darhan uul" }, "MN-1": { type: "Capital city", name: "Ulaanbaatar" }, "MN-067": { type: "Province", name: "Bulgan" }, "MN-064": { type: "Province", name: "Govĭ-Sümber" }, "MN-065": { type: "Province", name: "Govĭ-Altay" }, "MN-063": { type: "Province", name: "Dornogovĭ" }, "MN-046": { type: "Province", name: "Uvs" }, "MN-061": { type: "Province", name: "Dornod" }, "MN-049": { type: "Province", name: "Selenge" }, "MN-069": { type: "Province", name: "Bayanhongor" }, "MN-041": { type: "Province", name: "Hövsgöl" }, "MN-043": { type: "Province", name: "Hovd" } } }, MH: { name: "Marshall Islands", sub: { "MH-RON": { type: "Municipality", name: "Rongelap" }, "MH-KWA": { type: "Municipality", name: "Kwajalein" }, "MH-MAL": { type: "Municipality", name: "Maloelap" }, "MH-WTH": { type: "Municipality", name: "Wotho" }, "MH-WTJ": { type: "Municipality", name: "Wotje" }, "MH-L": { type: "Chain", name: "Ralik chain" }, "MH-ENI": { type: "Municipality", name: "Enewetak and Ujelang" }, "MH-UTI": { type: "Municipality", name: "Utrik" }, "MH-T": { type: "Chain", name: "Ratak chain" }, "MH-AUR": { type: "Municipality", name: "Aur" }, "MH-JAL": { type: "Municipality", name: "Jaluit" }, "MH-UJA": { type: "Municipality", name: "Ujae" }, "MH-JAB": { type: "Municipality", name: "Jabat" }, "MH-ALK": { type: "Municipality", name: "Ailuk" }, "MH-NMU": { type: "Municipality", name: "Namu" }, "MH-ALL": { type: "Municipality", name: "Ailinglaplap" }, "MH-MEJ": { type: "Municipality", name: "Mejit" }, "MH-LAE": { type: "Municipality", name: "Lae" }, "MH-EBO": { type: "Municipality", name: "Ebon" }, "MH-KIL": { type: "Municipality", name: "Bikini and Kili" }, "MH-NMK": { type: "Municipality", name: "Namdrik" }, "MH-ARN": { type: "Municipality", name: "Arno" }, "MH-MAJ": { type: "Municipality", name: "Majuro" }, "MH-MIL": { type: "Municipality", name: "Mili" }, "MH-LIB": { type: "Municipality", name: "Lib" }, "MH-LIK": { type: "Municipality", name: "Likiep" } } }, MK: { name: "Macedonia, the Former Yugoslav Republic Of", sub: { "MK-36": { type: "Municipality", name: "Kavadarci" }, "MK-45": { type: "Municipality", name: "Krivogaštani" }, "MK-33": { type: "Municipality", name: "Zrnovci" }, "MK-68": { type: "Municipality", name: "Saraj †" }, "MK-31": { type: "Municipality", name: "Zajas" }, "MK-65": { type: "Municipality", name: "Rankovce" }, "MK-64": { type: "Municipality", name: "Radoviš" }, "MK-30": { type: "Municipality", name: "Želino" }, "MK-04": { type: "Municipality", name: "Bitola" }, "MK-05": { type: "Municipality", name: "Bogdanci" }, "MK-06": { type: "Municipality", name: "Bogovinje" }, "MK-07": { type: "Municipality", name: "Bosilovo" }, "MK-66": { type: "Municipality", name: "Resen" }, "MK-01": { type: "Municipality", name: "Aerodrom †" }, "MK-02": { type: "Municipality", name: "Aračinovo" }, "MK-03": { type: "Municipality", name: "Berovo" }, "MK-40": { type: "Municipality", name: "Kičevo" }, "MK-41": { type: "Municipality", name: "Konče" }, "MK-42": { type: "Municipality", name: "Kočani" }, "MK-32": { type: "Municipality", name: "Zelenikovo" }, "MK-08": { type: "Municipality", name: "Brvenica" }, "MK-09": { type: "Municipality", name: "Butel †" }, "MK-46": { type: "Municipality", name: "Kruševo" }, "MK-47": { type: "Municipality", name: "Kumanovo" }, "MK-43": { type: "Municipality", name: "Kratovo" }, "MK-69": { type: "Municipality", name: "Sveti Nikole" }, "MK-28": { type: "Municipality", name: "Drugovo" }, "MK-29": { type: "Municipality", name: "Gjorče Petrov †" }, "MK-26": { type: "Municipality", name: "Dojran" }, "MK-27": { type: "Municipality", name: "Dolneni" }, "MK-24": { type: "Municipality", name: "Demir Kapija" }, "MK-25": { type: "Municipality", name: "Demir Hisar" }, "MK-22": { type: "Municipality", name: "Debarca" }, "MK-23": { type: "Municipality", name: "Delčevo" }, "MK-20": { type: "Municipality", name: "Gradsko" }, "MK-21": { type: "Municipality", name: "Debar" }, "MK-62": { type: "Municipality", name: "Prilep" }, "MK-74": { type: "Municipality", name: "Studeničani" }, "MK-80": { type: "Municipality", name: "Čaška" }, "MK-81": { type: "Municipality", name: "Češinovo-Obleševo" }, "MK-82": { type: "Municipality", name: "Čučer Sandevo" }, "MK-83": { type: "Municipality", name: "Štip" }, "MK-78": { type: "Municipality", name: "Centar Župa" }, "MK-71": { type: "Municipality", name: "Staro Nagoričane" }, "MK-70": { type: "Municipality", name: "Sopište" }, "MK-60": { type: "Municipality", name: "Pehčevo" }, "MK-72": { type: "Municipality", name: "Struga" }, "MK-75": { type: "Municipality", name: "Tearce" }, "MK-73": { type: "Municipality", name: "Strumica" }, "MK-59": { type: "Municipality", name: "Petrovec" }, "MK-58": { type: "Municipality", name: "Ohrid" }, "MK-57": { type: "Municipality", name: "Oslomej" }, "MK-56": { type: "Municipality", name: "Novo Selo" }, "MK-55": { type: "Municipality", name: "Novaci" }, "MK-54": { type: "Municipality", name: "Negotino" }, "MK-53": { type: "Municipality", name: "Mogila" }, "MK-52": { type: "Municipality", name: "Makedonski Brod" }, "MK-51": { type: "Municipality", name: "Makedonska Kamenica" }, "MK-50": { type: "Municipality", name: "Mavrovo i Rostuša" }, "MK-48": { type: "Municipality", name: "Lipkovo" }, "MK-19": { type: "Municipality", name: "Gostivar" }, "MK-18": { type: "Municipality", name: "Gevgelija" }, "MK-39": { type: "Municipality", name: "Kisela Voda †" }, "MK-38": { type: "Municipality", name: "Karpoš †" }, "MK-44": { type: "Municipality", name: "Kriva Palanka" }, "MK-49": { type: "Municipality", name: "Lozovo" }, "MK-13": { type: "Municipality", name: "Veles" }, "MK-12": { type: "Municipality", name: "Vevčani" }, "MK-11": { type: "Municipality", name: "Vasilevo" }, "MK-10": { type: "Municipality", name: "Valandovo" }, "MK-17": { type: "Municipality", name: "Gazi Baba †" }, "MK-16": { type: "Municipality", name: "Vrapčište" }, "MK-15": { type: "Municipality", name: "Vraneštica" }, "MK-14": { type: "Municipality", name: "Vinica" }, "MK-35": { type: "Municipality", name: "Jegunovce" }, "MK-84": { type: "Municipality", name: "Šuto Orizari †" }, "MK-61": { type: "Municipality", name: "Plasnica" }, "MK-79": { type: "Municipality", name: "Čair †" }, "MK-34": { type: "Municipality", name: "Ilinden" }, "MK-63": { type: "Municipality", name: "Probištip" }, "MK-76": { type: "Municipality", name: "Tetovo" }, "MK-77": { type: "Municipality", name: "Centar †" }, "MK-37": { type: "Municipality", name: "Karbinci" }, "MK-67": { type: "Municipality", name: "Rosoman" } } }, MU: { name: "Mauritius", sub: { "MU-VP": { type: "City", name: "Vacoas-Phoenix" }, "MU-CC": { type: "Dependency", name: "Cargados Carajos Shoals" }, "MU-SA": { type: "District", name: "Savanne" }, "MU-RO": { type: "Dependency", name: "Rodrigues Island" }, "MU-CU": { type: "City", name: "Curepipe" }, "MU-PA": { type: "District", name: "Pamplemousses" }, "MU-PL": { type: "District", name: "Port Louis" }, "MU-QB": { type: "City", name: "Quatre Bornes" }, "MU-FL": { type: "District", name: "Flacq" }, "MU-BR": { type: "City", name: "Beau Bassin-Rose Hill" }, "MU-BL": { type: "District", name: "Black River" }, "MU-PW": { type: "District", name: "Plaines Wilhems" }, "MU-AG": { type: "Dependency", name: "Agalega Islands" }, "MU-PU": { type: "City", name: "Port Louis" }, "MU-RR": { type: "District", name: "Rivière du Rempart" }, "MU-GP": { type: "District", name: "Grand Port" }, "MU-MO": { type: "District", name: "Moka" } } }, MT: { name: "Malta", sub: { "MT-58": { type: "Local council", name: "Ta’ Xbiex" }, "MT-59": { type: "Local council", name: "Tarxien" }, "MT-56": { type: "Local council", name: "Sliema" }, "MT-57": { type: "Local council", name: "Swieqi" }, "MT-54": { type: "Local council", name: "Santa Venera" }, "MT-55": { type: "Local council", name: "Siġġiewi" }, "MT-52": { type: "Local council", name: "Sannat" }, "MT-53": { type: "Local council", name: "Saint Lucia’s" }, "MT-50": { type: "Local council", name: "Saint Lawrence" }, "MT-51": { type: "Local council", name: "Saint Paul’s Bay" }, "MT-68": { type: "Local council", name: "Żurrieq" }, "MT-60": { type: "Local council", name: "Valletta" }, "MT-48": { type: "Local council", name: "Saint Julian’s" }, "MT-38": { type: "Local council", name: "Naxxar" }, "MT-67": { type: "Local council", name: "Żejtun" }, "MT-39": { type: "Local council", name: "Paola" }, "MT-01": { type: "Local council", name: "Attard" }, "MT-63": { type: "Local council", name: "Xgħajra" }, "MT-03": { type: "Local council", name: "Birgu" }, "MT-02": { type: "Local council", name: "Balzan" }, "MT-05": { type: "Local council", name: "Birżebbuġa" }, "MT-04": { type: "Local council", name: "Birkirkara" }, "MT-07": { type: "Local council", name: "Dingli" }, "MT-06": { type: "Local council", name: "Bormla" }, "MT-09": { type: "Local council", name: "Floriana" }, "MT-08": { type: "Local council", name: "Fgura" }, "MT-25": { type: "Local council", name: "Luqa" }, "MT-24": { type: "Local council", name: "Lija" }, "MT-23": { type: "Local council", name: "Kirkop" }, "MT-22": { type: "Local council", name: "Kerċem" }, "MT-21": { type: "Local council", name: "Kalkara" }, "MT-20": { type: "Local council", name: "Isla" }, "MT-46": { type: "Local council", name: "Rabat Malta" }, "MT-49": { type: "Local council", name: "Saint John" }, "MT-29": { type: "Local council", name: "Mdina" }, "MT-45": { type: "Local council", name: "Rabat Gozo" }, "MT-44": { type: "Local council", name: "Qrendi" }, "MT-47": { type: "Local council", name: "Safi" }, "MT-28": { type: "Local council", name: "Marsaxlokk" }, "MT-41": { type: "Local council", name: "Pietà" }, "MT-40": { type: "Local council", name: "Pembroke" }, "MT-43": { type: "Local council", name: "Qormi" }, "MT-42": { type: "Local council", name: "Qala" }, "MT-27": { type: "Local council", name: "Marsaskala" }, "MT-66": { type: "Local council", name: "Żebbuġ Malta" }, "MT-65": { type: "Local council", name: "Żebbuġ Gozo" }, "MT-26": { type: "Local council", name: "Marsa" }, "MT-61": { type: "Local council", name: "Xagħra" }, "MT-62": { type: "Local council", name: "Xewkija" }, "MT-64": { type: "Local council", name: "Żabbar" }, "MT-32": { type: "Local council", name: "Mosta" }, "MT-33": { type: "Local council", name: "Mqabba" }, "MT-12": { type: "Local council", name: "Gżira" }, "MT-13": { type: "Local council", name: "Għajnsielem" }, "MT-10": { type: "Local council", name: "Fontana" }, "MT-11": { type: "Local council", name: "Gudja" }, "MT-16": { type: "Local council", name: "Għasri" }, "MT-17": { type: "Local council", name: "Għaxaq" }, "MT-14": { type: "Local council", name: "Għarb" }, "MT-15": { type: "Local council", name: "Għargħur" }, "MT-30": { type: "Local council", name: "Mellieħa" }, "MT-31": { type: "Local council", name: "Mġarr" }, "MT-18": { type: "Local council", name: "Ħamrun" }, "MT-19": { type: "Local council", name: "Iklin" }, "MT-34": { type: "Local council", name: "Msida" }, "MT-35": { type: "Local council", name: "Mtarfa" }, "MT-36": { type: "Local council", name: "Munxar" }, "MT-37": { type: "Local council", name: "Nadur" } } }, MW: { name: "Malawi", sub: { "MW-CR": { type: "District", name: "Chiradzulu" }, "MW-CT": { type: "District", name: "Chitipa" }, "MW-CK": { type: "District", name: "Chikwawa" }, "MW-KS": { type: "District", name: "Kasungu" }, "MW-KR": { type: "District", name: "Karonga" }, "MW-TH": { type: "District", name: "Thyolo" }, "MW-NS": { type: "District", name: "Nsanje" }, "MW-MC": { type: "District", name: "Mchinji" }, "MW-MG": { type: "District", name: "Mangochi" }, "MW-MZ": { type: "District", name: "Mzimba" }, "MW-PH": { type: "District", name: "Phalombe" }, "MW-MW": { type: "District", name: "Mwanza" }, "MW-MU": { type: "District", name: "Mulanje" }, "MW-RU": { type: "District", name: "Rumphi" }, "MW-ZO": { type: "District", name: "Zomba" }, "MW-DO": { type: "District", name: "Dowa" }, "MW-BL": { type: "District", name: "Blantyre" }, "MW-DE": { type: "District", name: "Dedza" }, "MW-BA": { type: "District", name: "Balaka" }, "MW-S": { type: "Region", name: "Chakumwera" }, "MW-NK": { type: "District", name: "Nkhotakota" }, "MW-NI": { type: "District", name: "Ntchisi" }, "MW-SA": { type: "District", name: "Salima" }, "MW-NE": { type: "District", name: "Neno" }, "MW-NB": { type: "District", name: "Nkhata Bay" }, "MW-LI": { type: "District", name: "Lilongwe" }, "MW-C": { type: "Region", name: "Central Region" }, "MW-MH": { type: "District", name: "Machinga" }, "MW-NU": { type: "District", name: "Ntcheu" }, "MW-N": { type: "Region", name: "Chakumpoto" }, "MW-LK": { type: "District", name: "Likoma" } } }, MV: { name: "Maldives", sub: { "MV-00": { type: "Administrative atoll", name: "Alifu Dhaalu" }, "MV-23": { type: "Administrative atoll", name: "Haa Dhaalu" }, "MV-NO": { type: "Province", name: "North" }, "MV-NC": { type: "Province", name: "Medhu-Uthuru" }, "MV-SU": { type: "Province", name: "Dhekunu" }, "MV-08": { type: "Administrative atoll", name: "Kolhumadulu" }, "MV-29": { type: "Administrative atoll", name: "Fuvammulah" }, "MV-28": { type: "Administrative atoll", name: "Gaafu Dhaalu" }, "MV-03": { type: "Administrative atoll", name: "Faadhippolhu" }, "MV-02": { type: "Administrative atoll", name: "Alifu Alifu" }, "MV-01": { type: "Administrative atoll", name: "Addu Atholhu" }, "MV-26": { type: "Administrative atoll", name: "Kaafu" }, "MV-07": { type: "Administrative atoll", name: "Haa Alifu" }, "MV-20": { type: "Administrative atoll", name: "Baa" }, "MV-05": { type: "Administrative atoll", name: "Hadhdhunmathi" }, "MV-04": { type: "Administrative atoll", name: "Felidhu Atholhu" }, "MV-MLE": { type: "Capital", name: "Maale" }, "MV-SC": { type: "Province", name: "Medhu-Dhekunu" }, "MV-UN": { type: "Province", name: "Mathi-Uthuru" }, "MV-14": { type: "Administrative atoll", name: "Faafu" }, "MV-17": { type: "Administrative atoll", name: "Dhaalu" }, "MV-12": { type: "Administrative atoll", name: "Meemu" }, "MV-13": { type: "Administrative atoll", name: "Maalhosmadulu Uthuruburi" }, "MV-US": { type: "Province", name: "Mathi-Dhekunu" }, "MV-CE": { type: "Province", name: "Central" }, "MV-25": { type: "Administrative atoll", name: "Miladhunmadulu Dhekunuburi" }, "MV-24": { type: "Administrative atoll", name: "Miladhunmadulu Uthuruburi" }, "MV-27": { type: "Administrative atoll", name: "Gaafu Alifu" } } }, MQ: { name: "Martinique", sub: { "MQ-MQ": { type: "Country", name: "Martinique" } } }, MP: { name: "Northern Mariana Islands", sub: { "MP-MP": { type: "Country", name: "Northern Mariana Islands" } } }, MS: { name: "Montserrat", sub: { "MS-MS": { type: "Country", name: "Montserrat" } } }, MR: { name: "Mauritania", sub: { "MR-07": { type: "Region", name: "Adrar" }, "MR-06": { type: "Region", name: "Trarza" }, "MR-05": { type: "Region", name: "Brakna" }, "MR-04": { type: "Region", name: "Gorgol" }, "MR-03": { type: "Region", name: "Assaba" }, "MR-02": { type: "Region", name: "Hodh el Gharbi" }, "MR-01": { type: "Region", name: "Hodh ech Chargui" }, "MR-11": { type: "Region", name: "Tiris Zemmour" }, "MR-NKC": { type: "District", name: "Nouakchott" }, "MR-12": { type: "Region", name: "Inchiri" }, "MR-09": { type: "Region", name: "Tagant" }, "MR-08": { type: "Region", name: "Dakhlet Nouâdhibou" }, "MR-10": { type: "Region", name: "Guidimaka" } } }, IM: { name: "Isle of Man", sub: { "IM-IM": { type: "Country", name: "Isle of Main" } } }, UG: { name: "Uganda", sub: { "UG-328": { type: "District", name: "Napak" }, "UG-329": { type: "District", name: "Nwoya" }, "UG-108": { type: "District", name: "Mukono" }, "UG-109": { type: "District", name: "Nakasongola" }, "UG-101": { type: "District", name: "Kalangala" }, "UG-102": { type: "City", name: "Kampala" }, "UG-103": { type: "District", name: "Kiboga" }, "UG-104": { type: "District", name: "Luwero" }, "UG-105": { type: "District", name: "Masaka" }, "UG-106": { type: "District", name: "Mpigi" }, "UG-107": { type: "District", name: "Mubende" }, "UG-229": { type: "District", name: "Luuka" }, "UG-228": { type: "District", name: "Kween" }, "UG-221": { type: "District", name: "Manafwa" }, "UG-220": { type: "District", name: "Kaliro" }, "UG-223": { type: "District", name: "Bududa" }, "UG-222": { type: "District", name: "Namutumba" }, "UG-225": { type: "District", name: "Bulambuli" }, "UG-224": { type: "District", name: "Bukedea" }, "UG-227": { type: "District", name: "Kibuku" }, "UG-226": { type: "District", name: "Buyende" }, "UG-117": { type: "District", name: "Buikwe" }, "UG-116": { type: "District", name: "Lyantonde" }, "UG-115": { type: "District", name: "Nakaseke" }, "UG-114": { type: "District", name: "Mityana" }, "UG-113": { type: "District", name: "Wakiso" }, "UG-112": { type: "District", name: "Kayunga" }, "UG-111": { type: "District", name: "Sembabule" }, "UG-110": { type: "District", name: "Rakai" }, "UG-119": { type: "District", name: "Butambala" }, "UG-118": { type: "District", name: "Bukomansibi" }, "UG-214": { type: "District", name: "Mayuge" }, "UG-215": { type: "District", name: "Sironko" }, "UG-216": { type: "District", name: "Amuria" }, "UG-217": { type: "District", name: "Budaka" }, "UG-210": { type: "District", name: "Pallisa" }, "UG-211": { type: "District", name: "Soroti" }, "UG-212": { type: "District", name: "Tororo" }, "UG-213": { type: "District", name: "Kaberamaido" }, "UG-218": { type: "District", name: "Bukwa" }, "UG-219": { type: "District", name: "Butaleja" }, "UG-421": { type: "District", name: "Kyegegwa" }, "UG-203": { type: "District", name: "Iganga" }, "UG-202": { type: "District", name: "Busia" }, "UG-201": { type: "District", name: "Bugiri" }, "UG-207": { type: "District", name: "Katakwi" }, "UG-206": { type: "District", name: "Kapchorwa" }, "UG-205": { type: "District", name: "Kamuli" }, "UG-204": { type: "District", name: "Jinja" }, "UG-209": { type: "District", name: "Mbale" }, "UG-208": { type: "District", name: "Kumi" }, "UG-416": { type: "District", name: "Ibanda" }, "UG-418": { type: "District", name: "Kiruhura" }, "UG-419": { type: "District", name: "Buliisa" }, "UG-417": { type: "District", name: "Isingiro" }, "UG-308": { type: "District", name: "Moroto" }, "UG-309": { type: "District", name: "Moyo" }, "UG-302": { type: "District", name: "Apac" }, "UG-303": { type: "District", name: "Arua" }, "UG-301": { type: "District", name: "Adjumani" }, "UG-306": { type: "District", name: "Kotido" }, "UG-307": { type: "District", name: "Lira" }, "UG-304": { type: "District", name: "Gulu" }, "UG-305": { type: "District", name: "Kitgum" }, "UG-420": { type: "District", name: "Kiryandongo" }, "UG-425": { type: "District", name: "Sheema" }, "UG-424": { type: "District", name: "Rubirizi" }, "UG-423": { type: "District", name: "Ntoroko" }, "UG-422": { type: "District", name: "Mitooma" }, "UG-319": { type: "District", name: "Amuru" }, "UG-318": { type: "District", name: "Dokolo" }, "UG-414": { type: "District", name: "Kanungu" }, "UG-415": { type: "District", name: "Kyenjojo" }, "UG-412": { type: "District", name: "Rukungiri" }, "UG-413": { type: "District", name: "Kamwenge" }, "UG-410": { type: "District", name: "Mbarara" }, "UG-411": { type: "District", name: "Ntungamo" }, "UG-311": { type: "District", name: "Nakapiripirit" }, "UG-310": { type: "District", name: "Nebbi" }, "UG-313": { type: "District", name: "Yumbe" }, "UG-312": { type: "District", name: "Pader" }, "UG-315": { type: "District", name: "Kaabong" }, "UG-314": { type: "District", name: "Amolatar" }, "UG-317": { type: "District", name: "Abim" }, "UG-316": { type: "District", name: "Koboko" }, "UG-324": { type: "District", name: "Amudat" }, "UG-325": { type: "District", name: "Buhweju" }, "UG-326": { type: "District", name: "Kole" }, "UG-327": { type: "District", name: "Lamwo" }, "UG-320": { type: "District", name: "Maracha" }, "UG-321": { type: "District", name: "Oyam" }, "UG-322": { type: "District", name: "Agago" }, "UG-323": { type: "District", name: "Alebtong" }, "UG-124": { type: "District", name: "Lwengo" }, "UG-122": { type: "District", name: "Kalungu" }, "UG-123": { type: "District", name: "Kyankwanzi" }, "UG-120": { type: "District", name: "Buvuma" }, "UG-121": { type: "District", name: "Gomba" }, "UG-405": { type: "District", name: "Kabarole" }, "UG-404": { type: "District", name: "Kabale" }, "UG-407": { type: "District", name: "Kibaale" }, "UG-406": { type: "District", name: "Kasese" }, "UG-401": { type: "District", name: "Bundibugyo" }, "UG-403": { type: "District", name: "Hoima" }, "UG-402": { type: "District", name: "Bushenyi" }, "UG-409": { type: "District", name: "Masindi" }, "UG-408": { type: "District", name: "Kisoro" }, "UG-N": { type: "Geographical region", name: "Northern" }, "UG-C": { type: "Geographical region", name: "Central" }, "UG-E": { type: "Geographical region", name: "Eastern" }, "UG-W": { type: "Geographical region", name: "Western" }, "UG-331": { type: "District", name: "Zombo" }, "UG-330": { type: "District", name: "Otuke" }, "UG-232": { type: "District", name: "Serere" }, "UG-230": { type: "District", name: "Namayingo" }, "UG-231": { type: "District", name: "Ngora" } } }, TZ: { name: "Tanzania", sub: { "TZ-28": { type: "Region", name: "Katavi" }, "TZ-29": { type: "Region", name: "Njombe" }, "TZ-02": { type: "Region", name: "Dar es Salaam" }, "TZ-03": { type: "Region", name: "Dodoma" }, "TZ-01": { type: "Region", name: "Arusha" }, "TZ-06": { type: "Region", name: "Kaskazini Pemba" }, "TZ-07": { type: "Region", name: "Kaskazini Unguja" }, "TZ-04": { type: "Region", name: "Iringa" }, "TZ-05": { type: "Region", name: "Kagera" }, "TZ-20": { type: "Region", name: "Rukwa" }, "TZ-21": { type: "Region", name: "Ruvuma" }, "TZ-08": { type: "Region", name: "Kigoma" }, "TZ-09": { type: "Region", name: "Kilimanjaro" }, "TZ-24": { type: "Region", name: "Tabora" }, "TZ-25": { type: "Region", name: "Tanga" }, "TZ-26": { type: "Region", name: "Manyara" }, "TZ-27": { type: "Region", name: "Geita" }, "TZ-22": { type: "Region", name: "Shinyanga" }, "TZ-23": { type: "Region", name: "Singida" }, "TZ-11": { type: "Region", name: "Kusini Unguja" }, "TZ-10": { type: "Region", name: "Kusini Pemba" }, "TZ-13": { type: "Region", name: "Mara" }, "TZ-12": { type: "Region", name: "Lindi" }, "TZ-15": { type: "Region", name: "Mjini Magharibi" }, "TZ-14": { type: "Region", name: "Mbeya" }, "TZ-17": { type: "Region", name: "Mtwara" }, "TZ-16": { type: "Region", name: "Morogoro" }, "TZ-19": { type: "Region", name: "Coast" }, "TZ-18": { type: "Region", name: "Mwanza" }, "TZ-30": { type: "Region", name: "Simiyu" } } }, MY: { name: "Malaysia", sub: { "MY-08": { type: "State", name: "Perak" }, "MY-09": { type: "State", name: "Perlis" }, "MY-16": { type: "Federal territory", name: "Wilayah Persekutuan Putrajaya" }, "MY-02": { type: "State", name: "Kedah" }, "MY-03": { type: "State", name: "Kelantan" }, "MY-13": { type: "State", name: "Sarawak" }, "MY-01": { type: "State", name: "Johor" }, "MY-06": { type: "State", name: "Pahang" }, "MY-07": { type: "State", name: "Pulau Pinang" }, "MY-04": { type: "State", name: "Melaka" }, "MY-05": { type: "State", name: "Negeri Sembilan" }, "MY-11": { type: "State", name: "Terengganu" }, "MY-10": { type: "State", name: "Selangor" }, "MY-14": { type: "Federal territory", name: "Wilayah Persekutuan Kuala Lumpur" }, "MY-15": { type: "Federal territory", name: "Wilayah Persekutuan Labuan" }, "MY-12": { type: "State", name: "Sabah" } } }, MX: { name: "Mexico", sub: { "MX-JAL": { type: "State", name: "Jalisco" }, "MX-MEX": { type: "State", name: "México" }, "MX-DUR": { type: "State", name: "Durango" }, "MX-TAB": { type: "State", name: "Tabasco" }, "MX-GUA": { type: "State", name: "Guanajuato" }, "MX-CMX": { type: "Federal District", name: "Ciudad de México" }, "MX-SIN": { type: "State", name: "Sinaloa" }, "MX-BCS": { type: "State", name: "Baja California Sur" }, "MX-NAY": { type: "State", name: "Nayarit" }, "MX-AGU": { type: "State", name: "Aguascalientes" }, "MX-ROO": { type: "State", name: "Quintana Roo" }, "MX-NLE": { type: "State", name: "Nuevo León" }, "MX-BCN": { type: "State", name: "Baja California" }, "MX-SON": { type: "State", name: "Sonora" }, "MX-MOR": { type: "State", name: "Morelos" }, "MX-MIC": { type: "State", name: "Michoacán de Ocampo" }, "MX-CAM": { type: "State", name: "Campeche" }, "MX-COA": { type: "State", name: "Coahuila de Zaragoza" }, "MX-QUE": { type: "State", name: "Querétaro" }, "MX-COL": { type: "State", name: "Colima" }, "MX-TAM": { type: "State", name: "Tamaulipas" }, "MX-YUC": { type: "State", name: "Yucatán" }, "MX-PUE": { type: "State", name: "Puebla" }, "MX-HID": { type: "State", name: "Hidalgo" }, "MX-CHP": { type: "State", name: "Chiapas" }, "MX-TLA": { type: "State", name: "Tlaxcala" }, "MX-GRO": { type: "State", name: "Guerrero" }, "MX-CHH": { type: "State", name: "Chihuahua" }, "MX-VER": { type: "State", name: "Veracruz de Ignacio de la Llave" }, "MX-ZAC": { type: "State", name: "Zacatecas" }, "MX-SLP": { type: "State", name: "San Luis Potosí" }, "MX-OAX": { type: "State", name: "Oaxaca" } } }, IL: { name: "Israel", sub: { "IL-TA": { type: "District", name: "Tel Aviv" }, "IL-Z": { type: "District", name: "Northern District" }, "IL-M": { type: "District", name: "Central District" }, "IL-HA": { type: "District", name: "Haifa" }, "IL-D": { type: "District", name: "Southern District" }, "IL-JM": { type: "District", name: "Jerusalem" } } }, FR: { name: "France", sub: { "FR-28": { type: "Metropolitan department", name: "Eure-et-Loir" }, "FR-29": { type: "Metropolitan department", name: "Finistère" }, "FR-22": { type: "Metropolitan department", name: "Côtes-d'Armor" }, "FR-23": { type: "Metropolitan department", name: "Creuse" }, "FR-21": { type: "Metropolitan department", name: "Côte-d'Or" }, "FR-26": { type: "Metropolitan department", name: "Drôme" }, "FR-27": { type: "Metropolitan department", name: "Eure" }, "FR-24": { type: "Metropolitan department", name: "Dordogne" }, "FR-25": { type: "Metropolitan department", name: "Doubs" }, "FR-TF": { type: "Overseas territorial collectivity", name: "Terres australes françaises" }, "FR-95": { type: "Metropolitan department", name: "Val-d'Oise" }, "FR-94": { type: "Metropolitan department", name: "Val-de-Marne" }, "FR-93": { type: "Metropolitan department", name: "Seine-Saint-Denis" }, "FR-92": { type: "Metropolitan department", name: "Hauts-de-Seine" }, "FR-91": { type: "Metropolitan department", name: "Essonne" }, "FR-90": { type: "Metropolitan department", name: "Territoire de Belfort" }, "FR-17": { type: "Metropolitan department", name: "Charente-Maritime" }, "FR-16": { type: "Metropolitan department", name: "Charente" }, "FR-15": { type: "Metropolitan department", name: "Cantal" }, "FR-14": { type: "Metropolitan department", name: "Calvados" }, "FR-13": { type: "Metropolitan department", name: "Bouches-du-Rhône" }, "FR-12": { type: "Metropolitan department", name: "Aveyron" }, "FR-11": { type: "Metropolitan department", name: "Aude" }, "FR-10": { type: "Metropolitan department", name: "Aube" }, "FR-2B": { type: "Metropolitan department", name: "Haute-Corse" }, "FR-2A": { type: "Metropolitan department", name: "Corse-du-Sud" }, "FR-MF": { type: "Overseas territorial collectivity", name: "Saint-Martin" }, "FR-19": { type: "Metropolitan department", name: "Corrèze" }, "FR-18": { type: "Metropolitan department", name: "Cher" }, "FR-88": { type: "Metropolitan department", name: "Vosges" }, "FR-89": { type: "Metropolitan department", name: "Yonne" }, "FR-A": { type: "Metropolitan region", name: "Alsace" }, "FR-G": { type: "Metropolitan region", name: "Champagne-Ardenne" }, "FR-F": { type: "Metropolitan region", name: "Centre" }, "FR-BL": { type: "Overseas territorial collectivity", name: "Saint-Barthélemy" }, "FR-D": { type: "Metropolitan region", name: "Bourgogne" }, "FR-80": { type: "Metropolitan department", name: "Somme" }, "FR-81": { type: "Metropolitan department", name: "Tarn" }, "FR-82": { type: "Metropolitan department", name: "Tarn-et-Garonne" }, "FR-83": { type: "Metropolitan department", name: "Var" }, "FR-84": { type: "Metropolitan department", name: "Vaucluse" }, "FR-85": { type: "Metropolitan department", name: "Vendée" }, "FR-86": { type: "Metropolitan department", name: "Vienne" }, "FR-87": { type: "Metropolitan department", name: "Haute-Vienne" }, "FR-S": { type: "Metropolitan region", name: "Picardie" }, "FR-01": { type: "Metropolitan department", name: "Ain" }, "FR-02": { type: "Metropolitan department", name: "Aisne" }, "FR-03": { type: "Metropolitan department", name: "Allier" }, "FR-04": { type: "Metropolitan department", name: "Alpes-de-Haute-Provence" }, "FR-05": { type: "Metropolitan department", name: "Hautes-Alpes" }, "FR-06": { type: "Metropolitan department", name: "Alpes-Maritimes" }, "FR-07": { type: "Metropolitan department", name: "Ardèche" }, "FR-08": { type: "Metropolitan department", name: "Ardennes" }, "FR-09": { type: "Metropolitan department", name: "Ariège" }, "FR-RE": { type: "Overseas department", name: "La Réunion" }, "FR-E": { type: "Metropolitan region", name: "Bretagne" }, "FR-CP": { type: "Dependency", name: "Clipperton" }, "FR-75": { type: "Metropolitan department", name: "Paris" }, "FR-74": { type: "Metropolitan department", name: "Haute-Savoie" }, "FR-77": { type: "Metropolitan department", name: "Seine-et-Marne" }, "FR-76": { type: "Metropolitan department", name: "Seine-Maritime" }, "FR-71": { type: "Metropolitan department", name: "Saône-et-Loire" }, "FR-70": { type: "Metropolitan department", name: "Haute-Saône" }, "FR-73": { type: "Metropolitan department", name: "Savoie" }, "FR-72": { type: "Metropolitan department", name: "Sarthe" }, "FR-79": { type: "Metropolitan department", name: "Deux-Sèvres" }, "FR-78": { type: "Metropolitan department", name: "Yvelines" }, "FR-C": { type: "Metropolitan region", name: "Auvergne" }, "FR-B": {
      type: "Metropolitan region",
      name: "Aquitaine"
    }, "FR-YT": { type: "Overseas department", name: "Mayotte" }, "FR-66": { type: "Metropolitan department", name: "Pyrénées-Orientales" }, "FR-67": { type: "Metropolitan department", name: "Bas-Rhin" }, "FR-64": { type: "Metropolitan department", name: "Pyrénées-Atlantiques" }, "FR-65": { type: "Metropolitan department", name: "Hautes-Pyrénées" }, "FR-62": { type: "Metropolitan department", name: "Pas-de-Calais" }, "FR-63": { type: "Metropolitan department", name: "Puy-de-Dôme" }, "FR-60": { type: "Metropolitan department", name: "Oise" }, "FR-61": { type: "Metropolitan department", name: "Orne" }, "FR-68": { type: "Metropolitan department", name: "Haut-Rhin" }, "FR-69": { type: "Metropolitan department", name: "Rhône" }, "FR-K": { type: "Metropolitan region", name: "Languedoc-Roussillon" }, "FR-J": { type: "Metropolitan region", name: "Île-de-France" }, "FR-R": { type: "Metropolitan region", name: "Pays-de-la-Loire" }, "FR-I": { type: "Metropolitan region", name: "Franche-Comté" }, "FR-H": { type: "Metropolitan region", name: "Corse" }, "FR-O": { type: "Metropolitan region", name: "Nord-Pas-de-Calais" }, "FR-N": { type: "Metropolitan region", name: "Midi-Pyrénées" }, "FR-M": { type: "Metropolitan region", name: "Lorraine" }, "FR-L": { type: "Metropolitan region", name: "Limousin" }, "FR-53": { type: "Metropolitan department", name: "Mayenne" }, "FR-52": { type: "Metropolitan department", name: "Haute-Marne" }, "FR-51": { type: "Metropolitan department", name: "Marne" }, "FR-50": { type: "Metropolitan department", name: "Manche" }, "FR-57": { type: "Metropolitan department", name: "Moselle" }, "FR-56": { type: "Metropolitan department", name: "Morbihan" }, "FR-55": { type: "Metropolitan department", name: "Meuse" }, "FR-54": { type: "Metropolitan department", name: "Meurthe-et-Moselle" }, "FR-59": { type: "Metropolitan department", name: "Nord" }, "FR-58": { type: "Metropolitan department", name: "Nièvre" }, "FR-Q": { type: "Metropolitan region", name: "Haute-Normandie" }, "FR-P": { type: "Metropolitan region", name: "Basse-Normandie" }, "FR-V": { type: "Metropolitan region", name: "Rhône-Alpes" }, "FR-U": { type: "Metropolitan region", name: "Provence-Alpes-Côte-d'Azur" }, "FR-T": { type: "Metropolitan region", name: "Poitou-Charentes" }, "FR-NC": { type: "Overseas territorial collectivity", name: "Nouvelle-Calédonie" }, "FR-48": { type: "Metropolitan department", name: "Lozère" }, "FR-49": { type: "Metropolitan department", name: "Maine-et-Loire" }, "FR-44": { type: "Metropolitan department", name: "Loire-Atlantique" }, "FR-45": { type: "Metropolitan department", name: "Loiret" }, "FR-46": { type: "Metropolitan department", name: "Lot" }, "FR-47": { type: "Metropolitan department", name: "Lot-et-Garonne" }, "FR-40": { type: "Metropolitan department", name: "Landes" }, "FR-41": { type: "Metropolitan department", name: "Loir-et-Cher" }, "FR-42": { type: "Metropolitan department", name: "Loire" }, "FR-43": { type: "Metropolitan department", name: "Haute-Loire" }, "FR-MQ": { type: "Overseas department", name: "Martinique" }, "FR-GF": { type: "Overseas department", name: "Guyane" }, "FR-PF": { type: "Overseas territorial collectivity", name: "Polynésie française" }, "FR-PM": { type: "Overseas territorial collectivity", name: "Saint-Pierre-et-Miquelon" }, "FR-GP": { type: "Overseas department", name: "Guadeloupe" }, "FR-39": { type: "Metropolitan department", name: "Jura" }, "FR-38": { type: "Metropolitan department", name: "Isère" }, "FR-31": { type: "Metropolitan department", name: "Haute-Garonne" }, "FR-30": { type: "Metropolitan department", name: "Gard" }, "FR-33": { type: "Metropolitan department", name: "Gironde" }, "FR-32": { type: "Metropolitan department", name: "Gers" }, "FR-35": { type: "Metropolitan department", name: "Ille-et-Vilaine" }, "FR-34": { type: "Metropolitan department", name: "Hérault" }, "FR-37": { type: "Metropolitan department", name: "Indre-et-Loire" }, "FR-36": { type: "Metropolitan department", name: "Indre" }, "FR-WF": { type: "Overseas territorial collectivity", name: "Wallis-et-Futuna" } } }, AW: { name: "Aruba", sub: { "AW-AW": { type: "Country", name: "Aruba" } } }, SH: { name: "Saint Helena, Ascension and Tristan Da Cunha", sub: { "SH-HL": { type: "Geographical entity", name: "Saint Helena" }, "SH-TA": { type: "Geographical entity", name: "Tristan da Cunha" }, "SH-AC": { type: "Geographical entity", name: "Ascension" } } }, SJ: { name: "Svalbard & Jan Mayen Islands", sub: { "SJ-SJ": { type: "Country", name: "Svalbard & Jan Mayen Islands" } } }, FI: { name: "Finland", sub: { "FI-10": { type: "Region", name: "Lappi" }, "FI-11": { type: "Region", name: "Birkaland" }, "FI-12": { type: "Region", name: "Österbotten" }, "FI-16": { type: "Region", name: "Päijänne-Tavastland" }, "FI-17": { type: "Region", name: "Satakunda" }, "FI-09": { type: "Region", name: "Kymenlaakso" }, "FI-08": { type: "Region", name: "Keski-Suomi" }, "FI-18": { type: "Region", name: "Nyland" }, "FI-19": { type: "Region", name: "Egentliga Finland" }, "FI-14": { type: "Region", name: "Norra Österbotten" }, "FI-15": { type: "Region", name: "Norra Savolax" }, "FI-01": { type: "Region", name: "Ahvenanmaan maakunta" }, "FI-13": { type: "Region", name: "Norra Karelen" }, "FI-03": { type: "Region", name: "Etelä-Pohjanmaa" }, "FI-02": { type: "Region", name: "Etelä-Karjala" }, "FI-05": { type: "Region", name: "Kainuu" }, "FI-04": { type: "Region", name: "Etelä-Savo" }, "FI-07": { type: "Region", name: "Keski-Pohjanmaa" }, "FI-06": { type: "Region", name: "Egentliga Tavastland" } } }, FJ: { name: "Fiji", sub: { "FJ-08": { type: "Province", name: "Nadroga and Navosa" }, "FJ-09": { type: "Province", name: "Naitasiri" }, "FJ-14": { type: "Province", name: "Tailevu" }, "FJ-N": { type: "Division", name: "Northern" }, "FJ-C": { type: "Division", name: "Central" }, "FJ-01": { type: "Province", name: "Ba" }, "FJ-02": { type: "Province", name: "Bua" }, "FJ-03": { type: "Province", name: "Cakaudrove" }, "FJ-04": { type: "Province", name: "Kadavu" }, "FJ-05": { type: "Province", name: "Lau" }, "FJ-06": { type: "Province", name: "Lomaiviti" }, "FJ-07": { type: "Province", name: "Macuata" }, "FJ-11": { type: "Province", name: "Ra" }, "FJ-R": { type: "Dependency", name: "Rotuma" }, "FJ-12": { type: "Province", name: "Rewa" }, "FJ-13": { type: "Province", name: "Serua" }, "FJ-10": { type: "Province", name: "Namosi" }, "FJ-W": { type: "Division", name: "Western" }, "FJ-E": { type: "Division", name: "Eastern" } } }, FK: { name: "Falkland Islands", sub: { "FK-FK": { type: "Country", name: "Falkland Islands" } } }, FM: { name: "Micronesia, Federated States Of", sub: { "FM-YAP": { type: "State", name: "Yap" }, "FM-KSA": { type: "State", name: "Kosrae" }, "FM-PNI": { type: "State", name: "Pohnpei" }, "FM-TRK": { type: "State", name: "Chuuk" } } }, FO: { name: "Faroe Islands", sub: { "FO-FO": { type: "Country", name: "Faroe Islands" } } }, NI: { name: "Nicaragua", sub: { "NI-BO": { type: "Department", name: "Boaco" }, "NI-CI": { type: "Department", name: "Chinandega" }, "NI-LE": { type: "Department", name: "León" }, "NI-RI": { type: "Department", name: "Rivas" }, "NI-CO": { type: "Department", name: "Chontales" }, "NI-MN": { type: "Department", name: "Managua" }, "NI-CA": { type: "Department", name: "Carazo" }, "NI-AN": { type: "Autonomous region", name: "Atlántico Norte" }, "NI-ES": { type: "Department", name: "Estelí" }, "NI-SJ": { type: "Department", name: "Río San Juan" }, "NI-NS": { type: "Department", name: "Nueva Segovia" }, "NI-AS": { type: "Autonomous region", name: "Atlántico Sur" }, "NI-MT": { type: "Department", name: "Matagalpa" }, "NI-MD": { type: "Department", name: "Madriz" }, "NI-MS": { type: "Department", name: "Masaya" }, "NI-GR": { type: "Department", name: "Granada" }, "NI-JI": { type: "Department", name: "Jinotega" } } }, NL: { name: "Netherlands", sub: { "NL-ZH": { type: "Province", name: "Zuid-Holland" }, "NL-FR": { type: "Province", name: "Fryslân" }, "NL-AW": { type: "Country", name: "Aruba" }, "NL-CW": { type: "Country", name: "Curaçao" }, "NL-UT": { type: "Province", name: "Utrecht" }, "NL-OV": { type: "Province", name: "Overijssel" }, "NL-GE": { type: "Province", name: "Gelderland" }, "NL-BQ2": { type: "Special municipality", name: "Saba" }, "NL-BQ3": { type: "Special municipality", name: "Sint Eustatius" }, "NL-BQ1": { type: "Special municipality", name: "Bonaire" }, "NL-NH": { type: "Province", name: "Noord-Holland" }, "NL-ZE": { type: "Province", name: "Zeeland" }, "NL-SX": { type: "Country", name: "Sint Maarten" }, "NL-FL": { type: "Province", name: "Flevoland" }, "NL-GR": { type: "Province", name: "Groningen" }, "NL-DR": { type: "Province", name: "Drenthe" }, "NL-NB": { type: "Province", name: "Noord-Brabant" }, "NL-LI": { type: "Province", name: "Limburg" } } }, NO: { name: "Norway", sub: { "NO-10": { type: "County", name: "Vest-Agder" }, "NO-16": { type: "County", name: "Sør-Trøndelag" }, "NO-19": { type: "County", name: "Romsa" }, "NO-11": { type: "County", name: "Rogaland" }, "NO-21": { type: "Arctic region", name: "Svalbard" }, "NO-20": { type: "County", name: "Finnmark" }, "NO-22": { type: "Arctic region", name: "Jan Mayen" }, "NO-12": { type: "County", name: "Hordaland" }, "NO-15": { type: "County", name: "Møre og Romsdal" }, "NO-07": { type: "County", name: "Vestfold" }, "NO-06": { type: "County", name: "Buskerud" }, "NO-05": { type: "County", name: "Oppland" }, "NO-04": { type: "County", name: "Hedmark" }, "NO-03": { type: "County", name: "Oslo" }, "NO-02": { type: "County", name: "Akershus" }, "NO-01": { type: "County", name: "Østfold" }, "NO-17": { type: "County", name: "Nord-Trøndelag" }, "NO-18": { type: "County", name: "Nordland" }, "NO-14": { type: "County", name: "Sogn og Fjordane" }, "NO-09": { type: "County", name: "Aust-Agder" }, "NO-08": { type: "County", name: "Telemark" } } }, NA: { name: "Namibia", sub: { "NA-HA": { type: "Region", name: "Hardap" }, "NA-KH": { type: "Region", name: "Khomas" }, "NA-KA": { type: "Region", name: "Karas" }, "NA-ON": { type: "Region", name: "Oshana" }, "NA-OH": { type: "Region", name: "Omaheke" }, "NA-KE": { type: "Region", name: "Kavango East" }, "NA-OT": { type: "Region", name: "Oshikoto" }, "NA-CA": { type: "Region", name: "Zambezi" }, "NA-OW": { type: "Region", name: "Ohangwena" }, "NA-ER": { type: "Region", name: "Erongo" }, "NA-OS": { type: "Region", name: "Omusati" }, "NA-OD": { type: "Region", name: "Otjozondjupa" }, "NA-KU": { type: "Region", name: "Kunene" }, "NA-KW": { type: "Region", name: "Kavango West" } } }, VU: { name: "Vanuatu", sub: { "VU-PAM": { type: "Province", name: "Pénama" }, "VU-TOB": { type: "Province", name: "Torba" }, "VU-MAP": { type: "Province", name: "Malampa" }, "VU-SAM": { type: "Province", name: "Sanma" }, "VU-TAE": { type: "Province", name: "Taféa" }, "VU-SEE": { type: "Province", name: "Shéfa" } } }, NC: { name: "New Caledonia", sub: { "NC-NC": { type: "Country", name: "New Caledonia" } } }, NE: { name: "Niger", sub: { "NE-4": { type: "Region", name: "Maradi" }, "NE-5": { type: "Region", name: "Tahoua" }, "NE-6": { type: "Region", name: "Tillabéri" }, "NE-7": { type: "Region", name: "Zinder" }, "NE-1": { type: "Region", name: "Agadez" }, "NE-2": { type: "Region", name: "Diffa" }, "NE-3": { type: "Region", name: "Dosso" }, "NE-8": { type: "Urban community", name: "Niamey" } } }, NF: { name: "Norfolk Island", sub: { "NF-NF": { type: "Country", name: "Norfolk Island" } } }, NG: { name: "Nigeria", sub: { "NG-PL": { type: "State", name: "Plateau" }, "NG-RI": { type: "State", name: "Rivers" }, "NG-JI": { type: "State", name: "Jigawa" }, "NG-LA": { type: "State", name: "Lagos" }, "NG-NA": { type: "State", name: "Nasarawa" }, "NG-FC": { type: "Capital territory", name: "Abuja Federal Capital Territory" }, "NG-NI": { type: "State", name: "Niger" }, "NG-OS": { type: "State", name: "Osun" }, "NG-BY": { type: "State", name: "Bayelsa" }, "NG-DE": { type: "State", name: "Delta" }, "NG-BA": { type: "State", name: "Bauchi" }, "NG-BE": { type: "State", name: "Benue" }, "NG-BO": { type: "State", name: "Borno" }, "NG-YO": { type: "State", name: "Yobe" }, "NG-AN": { type: "State", name: "Anambra" }, "NG-KW": { type: "State", name: "Kwara" }, "NG-KT": { type: "State", name: "Katsina" }, "NG-OY": { type: "State", name: "Oyo" }, "NG-OG": { type: "State", name: "Ogun" }, "NG-KN": { type: "State", name: "Kano" }, "NG-KO": { type: "State", name: "Kogi" }, "NG-ON": { type: "State", name: "Ondo" }, "NG-EN": { type: "State", name: "Enugu" }, "NG-KD": { type: "State", name: "Kaduna" }, "NG-KE": { type: "State", name: "Kebbi" }, "NG-CR": { type: "State", name: "Cross River" }, "NG-GO": { type: "State", name: "Gombe" }, "NG-ZA": { type: "State", name: "Zamfara" }, "NG-SO": { type: "State", name: "Sokoto" }, "NG-IM": { type: "State", name: "Imo" }, "NG-ED": { type: "State", name: "Edo" }, "NG-AK": { type: "State", name: "Akwa Ibom" }, "NG-EB": { type: "State", name: "Ebonyi" }, "NG-TA": { type: "State", name: "Taraba" }, "NG-AB": { type: "State", name: "Abia" }, "NG-AD": { type: "State", name: "Adamawa" }, "NG-EK": { type: "State", name: "Ekiti" } } }, NZ: { name: "New Zealand", sub: { "NZ-NSN": { type: "Unitary authority", name: "Nelson City" }, "NZ-S": { type: "Island", name: "South Island" }, "NZ-STL": { type: "Regional council", name: "Southland" }, "NZ-BOP": { type: "Regional council", name: "Bay of Plenty" }, "NZ-HKB": { type: "Regional council", name: "Hawke's Bay" }, "NZ-AUK": { type: "Unitary authority", name: "Auckland" }, "NZ-TKI": { type: "Regional council", name: "Taranaki" }, "NZ-MBH": { type: "Unitary authority", name: "Marlborough District" }, "NZ-CIT": { type: "Special island authority", name: "Chatham Islands Territory" }, "NZ-WKO": { type: "Regional council", name: "Waikato" }, "NZ-TAS": { type: "Unitary authority", name: "Tasman District" }, "NZ-WGN": { type: "Regional council", name: "Wellington" }, "NZ-WTC": { type: "Regional council", name: "West Coast" }, "NZ-OTA": { type: "Regional council", name: "Otago" }, "NZ-NTL": { type: "Regional council", name: "Northland" }, "NZ-MWT": { type: "Regional council", name: "Manawatu-Wanganui" }, "NZ-N": { type: "Island", name: "North Island" }, "NZ-GIS": { type: "Unitary authority", name: "Gisborne District" }, "NZ-CAN": { type: "Regional council", name: "Canterbury" } } }, NP: { name: "Nepal", sub: { "NP-KA": { type: "Zone", name: "Karnali" }, "NP-BA": { type: "Zone", name: "Bagmati" }, "NP-MA": { type: "Zone", name: "Mahakali" }, "NP-KO": { type: "Zone", name: "Kosi" }, "NP-DH": { type: "Zone", name: "Dhawalagiri" }, "NP-BH": { type: "Zone", name: "Bheri" }, "NP-JA": { type: "Zone", name: "Janakpur" }, "NP-GA": { type: "Zone", name: "Gandaki" }, "NP-NA": { type: "Zone", name: "Narayani" }, "NP-ME": { type: "Zone", name: "Mechi" }, "NP-RA": { type: "Zone", name: "Rapti" }, "NP-5": { type: "Development region", name: "Far Western" }, "NP-4": { type: "Development region", name: "Eastern" }, "NP-SE": { type: "Zone", name: "Seti" }, "NP-LU": { type: "Zone", name: "Lumbini" }, "NP-1": { type: "Development region", name: "Central" }, "NP-SA": { type: "Zone", name: "Sagarmatha" }, "NP-3": { type: "Development region", name: "Pashchimanchal" }, "NP-2": { type: "Development region", name: "Madhya Pashchimanchal" } } }, NR: { name: "Nauru", sub: { "NR-08": { type: "District", name: "Denigomodu" }, "NR-09": { type: "District", name: "Ewa" }, "NR-14": { type: "District", name: "Yaren" }, "NR-01": { type: "District", name: "Aiwo" }, "NR-02": { type: "District", name: "Anabar" }, "NR-03": { type: "District", name: "Anetan" }, "NR-04": { type: "District", name: "Anibare" }, "NR-05": { type: "District", name: "Baiti" }, "NR-06": { type: "District", name: "Boe" }, "NR-07": { type: "District", name: "Buada" }, "NR-11": { type: "District", name: "Meneng" }, "NR-12": { type: "District", name: "Nibok" }, "NR-13": { type: "District", name: "Uaboe" }, "NR-10": { type: "District", name: "Ijuw" } } }, NU: { name: "Niue", sub: { "NU-NU": { type: "Country", name: "Niue" } } }, CK: { name: "Cook Islands", sub: { "CK-CK": { type: "Country", name: "Cook Islands" } } }, CI: { name: "Côte D'Ivoire", sub: { "CI-11": { type: "Region", name: "Nzi-Comoé" }, "CI-13": { type: "Region", name: "Sud-Comoé" }, "CI-16": { type: "Region", name: "Agnébi" }, "CI-14": { type: "Region", name: "Worodougou" }, "CI-10": { type: "Region", name: "Denguélé" }, "CI-15": { type: "Region", name: "Sud-Bandama" }, "CI-17": { type: "Region", name: "Bafing" }, "CI-01": { type: "Region", name: "Lagunes" }, "CI-02": { type: "Region", name: "Haut-Sassandra" }, "CI-03": { type: "Region", name: "Savanes" }, "CI-04": { type: "Region", name: "Vallée du Bandama" }, "CI-05": { type: "Region", name: "Moyen-Comoé" }, "CI-06": { type: "Region", name: "18 Montagnes" }, "CI-07": { type: "Region", name: "Lacs" }, "CI-08": { type: "Region", name: "Zanzan" }, "CI-09": { type: "Region", name: "Bas-Sassandra" }, "CI-18": { type: "Region", name: "Fromager" }, "CI-19": { type: "Region", name: "Moyen-Cavally" }, "CI-12": { type: "Region", name: "Marahoué" } } }, CH: { name: "Switzerland", sub: { "CH-SO": { type: "Canton", name: "Solothurn" }, "CH-LU": { type: "Canton", name: "Luzern" }, "CH-SH": { type: "Canton", name: "Schaffhausen" }, "CH-SG": { type: "Canton", name: "Sankt Gallen" }, "CH-UR": { type: "Canton", name: "Uri" }, "CH-NE": { type: "Canton", name: "Neuchâtel" }, "CH-BS": { type: "Canton", name: "Basel-Stadt" }, "CH-JU": { type: "Canton", name: "Jura" }, "CH-BL": { type: "Canton", name: "Basel-Landschaft" }, "CH-SZ": { type: "Canton", name: "Schwyz" }, "CH-BE": { type: "Canton", name: "Bern" }, "CH-NW": { type: "Canton", name: "Nidwalden" }, "CH-ZG": { type: "Canton", name: "Zug" }, "CH-FR": { type: "Canton", name: "Freiburg" }, "CH-ZH": { type: "Canton", name: "Zürich" }, "CH-VS": { type: "Canton", name: "Valais" }, "CH-VD": { type: "Canton", name: "Vaud" }, "CH-TI": { type: "Canton", name: "Ticino" }, "CH-TG": { type: "Canton", name: "Thurgau" }, "CH-OW": { type: "Canton", name: "Obwalden" }, "CH-AG": { type: "Canton", name: "Aargau" }, "CH-GE": { type: "Canton", name: "Genève" }, "CH-AI": { type: "Canton", name: "Appenzell Innerrhoden" }, "CH-GL": { type: "Canton", name: "Glarus" }, "CH-GR": { type: "Canton", name: "Graubünden" }, "CH-AR": { type: "Canton", name: "Appenzell Ausserrhoden" } } }, CO: { name: "Colombia", sub: { "CO-CUN": { type: "Department", name: "Cundinamarca" }, "CO-BOY": { type: "Department", name: "Boyacá" }, "CO-COR": { type: "Department", name: "Córdoba" }, "CO-HUI": { type: "Department", name: "Huila" }, "CO-VAU": { type: "Department", name: "Vaupés" }, "CO-RIS": { type: "Department", name: "Risaralda" }, "CO-NSA": { type: "Department", name: "Norte de Santander" }, "CO-VID": { type: "Department", name: "Vichada" }, "CO-BOL": { type: "Department", name: "Bolívar" }, "CO-VAC": { type: "Department", name: "Valle del Cauca" }, "CO-GUV": { type: "Department", name: "Guaviare" }, "CO-CAU": { type: "Department", name: "Cauca" }, "CO-CAS": { type: "Department", name: "Casanare" }, "CO-CAQ": { type: "Department", name: "Caquetá" }, "CO-CES": { type: "Department", name: "Cesar" }, "CO-SAN": { type: "Department", name: "Santander" }, "CO-ATL": { type: "Department", name: "Atlántico" }, "CO-AMA": { type: "Department", name: "Amazonas" }, "CO-MET": { type: "Department", name: "Meta" }, "CO-MAG": { type: "Department", name: "Magdalena" }, "CO-ARA": { type: "Department", name: "Arauca" }, "CO-GUA": { type: "Department", name: "Guainía" }, "CO-LAG": { type: "Department", name: "La Guajira" }, "CO-CAL": { type: "Department", name: "Caldas" }, "CO-QUI": { type: "Department", name: "Quindío" }, "CO-SAP": { type: "Department", name: "San Andrés, Providencia y Santa Catalina" }, "CO-TOL": { type: "Department", name: "Tolima" }, "CO-SUC": { type: "Department", name: "Sucre" }, "CO-PUT": { type: "Department", name: "Putumayo" }, "CO-NAR": { type: "Department", name: "Nariño" }, "CO-CHO": { type: "Department", name: "Chocó" }, "CO-DC": { type: "Capital district", name: "Distrito Capital de Bogotá" }, "CO-ANT": { type: "Department", name: "Antioquia" } } }, CN: { name: "China", sub: { "CN-54": { type: "Autonomous region", name: "Xizang" }, "CN-34": { type: "Province", name: "Anhui" }, "CN-35": { type: "Province", name: "Fujian" }, "CN-36": { type: "Province", name: "Jiangxi" }, "CN-37": { type: "Province", name: "Shandong" }, "CN-31": { type: "Municipality", name: "Shanghai" }, "CN-32": { type: "Province", name: "Jiangsu" }, "CN-33": { type: "Province", name: "Zhejiang" }, "CN-71": { type: "Province", name: "Taiwan" }, "CN-91": { type: "Special administrative region", name: "Hong Kong" }, "CN-14": { type: "Province", name: "Shanxi" }, "CN-15": { type: "Autonomous region", name: "Nei Mongol" }, "CN-12": { type: "Municipality", name: "Tianjin" }, "CN-13": { type: "Province", name: "Hebei" }, "CN-11": { type: "Municipality", name: "Beijing" }, "CN-52": { type: "Province", name: "Guizhou" }, "CN-92": { type: "Special administrative region", name: "Aomen" }, "CN-53": { type: "Province", name: "Yunnan" }, "CN-50": { type: "Municipality", name: "Chongqing" }, "CN-51": { type: "Province", name: "Sichuan" }, "CN-41": { type: "Province", name: "Henan" }, "CN-43": { type: "Province", name: "Hunan" }, "CN-42": { type: "Province", name: "Hubei" }, "CN-45": { type: "Autonomous region", name: "Guangxi" }, "CN-44": { type: "Province", name: "Guangdong" }, "CN-46": { type: "Province", name: "Hainan" }, "CN-65": { type: "Autonomous region", name: "Xinjiang" }, "CN-64": { type: "Autonomous region", name: "Ningxia" }, "CN-63": { type: "Province", name: "Qinghai" }, "CN-62": { type: "Province", name: "Gansu" }, "CN-61": { type: "Province", name: "Shaanxi" }, "CN-23": { type: "Province", name: "Heilongjiang" }, "CN-22": { type: "Province", name: "Jilin" }, "CN-21": { type: "Province", name: "Liaoning" } } }, CM: { name: "Cameroon", sub: { "CM-CE": { type: "Region", name: "Centre" }, "CM-SU": { type: "Region", name: "South" }, "CM-SW": { type: "Region", name: "South-West" }, "CM-ES": { type: "Region", name: "East" }, "CM-AD": { type: "Region", name: "Adamaoua" }, "CM-NO": { type: "Region", name: "Nord" }, "CM-OU": { type: "Region", name: "Ouest" }, "CM-NW": { type: "Region", name: "Nord-Ouest" }, "CM-EN": { type: "Region", name: "Extrême-Nord" }, "CM-LT": { type: "Region", name: "Littoral" } } }, CL: { name: "Chile", sub: { "CL-AP": { type: "Region", name: "Arica y Parinacota" }, "CL-BI": { type: "Region", name: "Biobío" }, "CL-AR": { type: "Region", name: "Araucanía" }, "CL-AT": { type: "Region", name: "Atacama" }, "CL-CO": { type: "Region", name: "Coquimbo" }, "CL-VS": { type: "Region", name: "Valparaíso" }, "CL-ML": { type: "Region", name: "Maule" }, "CL-LR": { type: "Region", name: "Los Ríos" }, "CL-TA": { type: "Region", name: "Tarapacá" }, "CL-LI": { type: "Region", name: "Libertador General Bernardo O'Higgins" }, "CL-RM": { type: "Region", name: "Región Metropolitana de Santiago" }, "CL-LL": { type: "Region", name: "Los Lagos" }, "CL-AI": { type: "Region", name: "Aysén" }, "CL-AN": { type: "Region", name: "Antofagasta" }, "CL-MA": { type: "Region", name: "Magallanes" } } }, CC: { name: "Cocos  Islands", sub: { "CC-CC": { type: "Country", name: "Cocos  Islands" } } }, CA: { name: "Canada", sub: { "CA-NT": { type: "Territory", name: "Northwest Territories" }, "CA-NU": { type: "Territory", name: "Nunavut" }, "CA-NS": { type: "Province", name: "Nova Scotia" }, "CA-MB": { type: "Province", name: "Manitoba" }, "CA-SK": { type: "Province", name: "Saskatchewan" }, "CA-QC": { type: "Province", name: "Quebec" }, "CA-PE": { type: "Province", name: "Prince Edward Island" }, "CA-BC": { type: "Province", name: "British Columbia" }, "CA-YT": { type: "Territory", name: "Yukon" }, "CA-NB": { type: "Province", name: "New Brunswick" }, "CA-NL": { type: "Province", name: "Newfoundland and Labrador" }, "CA-ON": { type: "Province", name: "Ontario" }, "CA-AB": { type: "Province", name: "Alberta" } } }, CG: { name: "Congo", sub: { "CG-2": { type: "Department", name: "Lékoumou" }, "CG-5": { type: "Department", name: "Kouilou" }, "CG-7": { type: "Department", name: "Likouala" }, "CG-9": { type: "Department", name: "Niari" }, "CG-8": { type: "Department", name: "Cuvette" }, "CG-BZV": { type: "Department", name: "Brazzaville" }, "CG-11": { type: "Department", name: "Bouenza" }, "CG-13": { type: "Department", name: "Sangha" }, "CG-12": { type: "Department", name: "Pool" }, "CG-15": { type: "Department", name: "Cuvette-Ouest" }, "CG-14": { type: "Department", name: "Plateaux" }, "CG-16": { type: "Department", name: "Pointe-Noire" } } }, CF: { name: "Central African Republic", sub: { "CF-MB": { type: "Prefecture", name: "Mbomou" }, "CF-BB": { type: "Prefecture", name: "Bamïngï-Bangoran" }, "CF-NM": { type: "Prefecture", name: "Nana-Mambéré" }, "CF-BGF": { type: "Commune", name: "Bangî" }, "CF-AC": { type: "Prefecture", name: "Ouham" }, "CF-KB": { type: "Economic prefecture", name: "Gïrïbïngï" }, "CF-BK": { type: "Prefecture", name: "Basse-Kotto" }, "CF-LB": { type: "Prefecture", name: "Lobaye" }, "CF-VK": { type: "Prefecture", name: "Vakaga" }, "CF-HS": { type: "Prefecture", name: "Haute-Sangha / Mambéré-Kadéï" }, "CF-HM": { type: "Prefecture", name: "Haut-Mbomou" }, "CF-UK": { type: "Prefecture", name: "Ouaka" }, "CF-MP": { type: "Prefecture", name: "Ömbëlä-Pökö" }, "CF-KG": { type: "Prefecture", name: "Kemö-Gïrïbïngï" }, "CF-HK": { type: "Prefecture", name: "Haute-Kotto" }, "CF-OP": { type: "Prefecture", name: "Ouham-Pendé" }, "CF-SE": { type: "Economic prefecture", name: "Sangä" } } }, CD: { name: "Congo, The Democratic Republic Of The", sub: { "CD-OR": { type: "Province", name: "Orientale" }, "CD-EQ": { type: "Province", name: "Équateur" }, "CD-SK": { type: "Province", name: "Sud-Kivu" }, "CD-KW": { type: "Province", name: "Kasai-Occidental" }, "CD-BN": { type: "Province", name: "Bandundu" }, "CD-BC": { type: "Province", name: "Bas-Congo" }, "CD-KN": { type: "City", name: "Kinshasa" }, "CD-KA": { type: "Province", name: "Katanga" }, "CD-MA": { type: "Province", name: "Maniema" }, "CD-NK": { type: "Province", name: "Nord-Kivu" }, "CD-KE": { type: "Province", name: "Kasai-Oriental" } } }, CZ: { name: "Czech Republic", sub: { "CZ-10C": { type: "District", name: "Praha 12" }, "CZ-10B": { type: "District", name: "Praha 11" }, "CZ-10A": { type: "District", name: "Praha 10" }, "CZ-10F": { type: "District", name: "Praha 15" }, "CZ-10E": { type: "District", name: "Praha 14" }, "CZ-10D": { type: "District", name: "Praha 13" }, "CZ-511": { type: "District", name: "Česká Lípa" }, "CZ-512": { type: "District", name: "Jablonec nad Nisou" }, "CZ-513": { type: "District", name: "Liberec" }, "CZ-514": { type: "District", name: "Semily" }, "CZ-JC": { type: "Region", name: "Jihočeský kraj" }, "CZ-JM": { type: "Region", name: "Jihomoravský kraj" }, "CZ-103": { type: "District", name: "Praha 3" }, "CZ-102": { type: "District", name: "Praha 2" }, "CZ-101": { type: "District", name: "Praha 1" }, "CZ-107": { type: "District", name: "Praha 7" }, "CZ-106": { type: "District", name: "Praha 6" }, "CZ-105": { type: "District", name: "Praha 5" }, "CZ-104": { type: "District", name: "Praha 4" }, "CZ-613": { type: "District", name: "Pelhřimov" }, "CZ-612": { type: "District", name: "Jihlava" }, "CZ-611": { type: "District", name: "Havlíčkův Brod" }, "CZ-108": { type: "District", name: "Praha 8" }, "CZ-615": { type: "District", name: "Žd'ár nad Sázavou" }, "CZ-614": { type: "District", name: "Třebíč" }, "CZ-LI": { type: "Region", name: "Liberecký kraj" }, "CZ-US": { type: "Region", name: "Ústecký kraj" }, "CZ-714": { type: "District", name: "Přerov" }, "CZ-715": { type: "District", name: "Šumperk" }, "CZ-712": { type: "District", name: "Olomouc" }, "CZ-713": { type: "District", name: "Prostĕjov" }, "CZ-711": { type: "District", name: "Jeseník" }, "CZ-ST": { type: "Region", name: "Středočeský kraj" }, "CZ-109": { type: "District", name: "Praha 9" }, "CZ-KA": { type: "Region", name: "Karlovarský kraj" }, "CZ-ZL": { type: "Region", name: "Zlínský kraj" }, "CZ-KR": { type: "Region", name: "Královéhradecký kraj" }, "CZ-802": { type: "District", name: "Frýdek Místek" }, "CZ-803": { type: "District", name: "Karviná" }, "CZ-801": { type: "District", name: "Bruntál" }, "CZ-806": { type: "District", name: "Ostrava město" }, "CZ-804": { type: "District", name: "Nový Jičín" }, "CZ-805": { type: "District", name: "Opava" }, "CZ-411": { type: "District", name: "Cheb" }, "CZ-413": { type: "District", name: "Sokolov" }, "CZ-412": { type: "District", name: "Karlovy Vary" }, "CZ-312": { type: "District", name: "Český Krumlov" }, "CZ-313": { type: "District", name: "Jindřichův Hradec" }, "CZ-311": { type: "District", name: "České Budějovice" }, "CZ-316": { type: "District", name: "Strakonice" }, "CZ-317": { type: "District", name: "Tábor" }, "CZ-314": { type: "District", name: "Písek" }, "CZ-315": { type: "District", name: "Prachatice" }, "CZ-534": { type: "District", name: "Ústí nad Orlicí" }, "CZ-724": { type: "District", name: "Zlín" }, "CZ-532": { type: "District", name: "Pardubice" }, "CZ-422": { type: "District", name: "Chomutov" }, "CZ-423": { type: "District", name: "Litoměřice" }, "CZ-424": { type: "District", name: "Louny" }, "CZ-425": { type: "District", name: "Most" }, "CZ-426": { type: "District", name: "Teplice" }, "CZ-722": { type: "District", name: "Uherské Hradištĕ" }, "CZ-PL": { type: "Region", name: "Plzeňský kraj" }, "CZ-MO": { type: "Region", name: "Moravskoslezský kraj" }, "CZ-VY": { type: "Region", name: "Vysočina" }, "CZ-PA": { type: "Region", name: "Pardubický kraj" }, "CZ-20A": { type: "District", name: "Praha-západ" }, "CZ-20B": { type: "District", name: "Příbram" }, "CZ-20C": { type: "District", name: "Rakovník" }, "CZ-723": { type: "District", name: "Vsetín" }, "CZ-533": { type: "District", name: "Svitavy" }, "CZ-721": { type: "District", name: "Kromĕříž" }, "CZ-531": { type: "District", name: "Chrudim" }, "CZ-PR": { type: "Region", name: "Praha, hlavní mešto" }, "CZ-622": { type: "District", name: "Brno-město" }, "CZ-623": { type: "District", name: "Brno-venkov" }, "CZ-621": { type: "District", name: "Blansko" }, "CZ-626": { type: "District", name: "Vyškov" }, "CZ-627": { type: "District", name: "Znojmo" }, "CZ-624": { type: "District", name: "Břeclav" }, "CZ-625": { type: "District", name: "Hodonín" }, "CZ-421": { type: "District", name: "Děčín" }, "CZ-525": { type: "District", name: "Trutnov" }, "CZ-524": { type: "District", name: "Rychnov nad Kněžnou" }, "CZ-521": { type: "District", name: "Hradec Králové" }, "CZ-523": { type: "District", name: "Náchod" }, "CZ-522": { type: "District", name: "Jičín" }, "CZ-OL": { type: "Region", name: "Olomoucký kraj" }, "CZ-427": { type: "District", name: "Ústí nad Labem" }, "CZ-323": { type: "District", name: "Plzeň-město" }, "CZ-322": { type: "District", name: "Klatovy" }, "CZ-321": { type: "District", name: "Domažlice" }, "CZ-327": { type: "District", name: "Tachov" }, "CZ-326": { type: "District", name: "Rokycany" }, "CZ-325": { type: "District", name: "Plzeň-sever" }, "CZ-324": { type: "District", name: "Plzeň-jih" }, "CZ-208": { type: "District", name: "Nymburk" }, "CZ-209": { type: "District", name: "Praha-východ" }, "CZ-201": { type: "District", name: "Benešov" }, "CZ-202": { type: "District", name: "Beroun" }, "CZ-203": { type: "District", name: "Kladno" }, "CZ-204": { type: "District", name: "Kolín" }, "CZ-205": { type: "District", name: "Kutná Hora" }, "CZ-206": { type: "District", name: "Mělník" }, "CZ-207": { type: "District", name: "Mladá Boleslav" } } }, CY: { name: "Cyprus", sub: { "CY-01": { type: "District", name: "Lefkoşa" }, "CY-02": { type: "District", name: "Lemesos" }, "CY-03": { type: "District", name: "Larnaka" }, "CY-04": { type: "District", name: "Ammochostos" }, "CY-05": { type: "District", name: "Baf" }, "CY-06": { type: "District", name: "Girne" } } }, CX: { name: "Christmas Island", sub: { "CX-CX": { type: "Country", name: "Christmas Island" } } }, CR: { name: "Costa Rica", sub: { "CR-P": { type: "Province", name: "Puntarenas" }, "CR-A": { type: "Province", name: "Alajuela" }, "CR-C": { type: "Province", name: "Cartago" }, "CR-G": { type: "Province", name: "Guanacaste" }, "CR-H": { type: "Province", name: "Heredia" }, "CR-SJ": { type: "Province", name: "San José" }, "CR-L": { type: "Province", name: "Limón" } } }, CW: { name: "Curaçao", sub: { "CW-CW": { type: "Country", name: "Curaçao" } } }, CV: { name: "Cape Verde", sub: { "CV-SL": { type: "Municipality", name: "Sal" }, "CV-SM": { type: "Municipality", name: "São Miguel" }, "CV-SO": { type: "Municipality", name: "São Lourenço dos Órgãos" }, "CV-S": { type: "Geographical region", name: "Ilhas de Sotavento" }, "CV-SD": { type: "Municipality", name: "São Domingos" }, "CV-SF": { type: "Municipality", name: "São Filipe" }, "CV-B": { type: "Geographical region", name: "Ilhas de Barlavento" }, "CV-RG": { type: "Municipality", name: "Ribeira Grande" }, "CV-SV": { type: "Municipality", name: "São Vicente" }, "CV-SS": { type: "Municipality", name: "São Salvador do Mundo" }, "CV-CR": { type: "Municipality", name: "Santa Cruz" }, "CV-CF": { type: "Municipality", name: "Santa Catarina do Fogo" }, "CV-CA": { type: "Municipality", name: "Santa Catarina" }, "CV-RB": { type: "Municipality", name: "Ribeira Brava" }, "CV-PA": { type: "Municipality", name: "Paul" }, "CV-TA": { type: "Municipality", name: "Tarrafal" }, "CV-PN": { type: "Municipality", name: "Porto Novo" }, "CV-RS": { type: "Municipality", name: "Ribeira Grande de Santiago" }, "CV-MA": { type: "Municipality", name: "Maio" }, "CV-PR": { type: "Municipality", name: "Praia" }, "CV-TS": { type: "Municipality", name: "Tarrafal de São Nicolau" }, "CV-MO": { type: "Municipality", name: "Mosteiros" }, "CV-BR": { type: "Municipality", name: "Brava" }, "CV-BV": { type: "Municipality", name: "Boa Vista" } } }, CU: { name: "Cuba", sub: { "CU-04": { type: "Province", name: "Matanzas" }, "CU-05": { type: "Province", name: "Villa Clara" }, "CU-06": { type: "Province", name: "Cienfuegos" }, "CU-07": { type: "Province", name: "Sancti Spíritus" }, "CU-01": { type: "Province", name: "Pinar del Río" }, "CU-03": { type: "Province", name: "La Habana" }, "CU-99": { type: "Special municipality", name: "Isla de la Juventud" }, "CU-08": { type: "Province", name: "Ciego de Ávila" }, "CU-09": { type: "Province", name: "Camagüey" }, "CU-13": { type: "Province", name: "Santiago de Cuba" }, "CU-12": { type: "Province", name: "Granma" }, "CU-11": { type: "Province", name: "Holguín" }, "CU-10": { type: "Province", name: "Las Tunas" }, "CU-16": { type: "Province", name: "Mayabeque" }, "CU-15": { type: "Province", name: "Artemisa" }, "CU-14": { type: "Province", name: "Guantánamo" } } }, SZ: { name: "Swaziland", sub: { "SZ-LU": { type: "District", name: "Lubombo" }, "SZ-HH": { type: "District", name: "Hhohho" }, "SZ-SH": { type: "District", name: "Shiselweni" }, "SZ-MA": { type: "District", name: "Manzini" } } }, SY: { name: "Syria", sub: { "SY-HI": { type: "Province", name: "Ḩimş" }, "SY-HL": { type: "Province", name: "Ḩalab" }, "SY-DI": { type: "Province", name: "Dimashq" }, "SY-HA": { type: "Province", name: "Al Ḩasakah" }, "SY-ID": { type: "Province", name: "Idlib" }, "SY-SU": { type: "Province", name: "As Suwaydā'" }, "SY-TA": { type: "Province", name: "Ţarţūs" }, "SY-QU": { type: "Province", name: "Al Qunayţirah" }, "SY-DY": { type: "Province", name: "Dayr az Zawr" }, "SY-RA": { type: "Province", name: "Ar Raqqah" }, "SY-LA": { type: "Province", name: "Al Lādhiqīyah" }, "SY-RD": { type: "Province", name: "Rīf Dimashq" }, "SY-DR": { type: "Province", name: "Dar'ā" }, "SY-HM": { type: "Province", name: "Ḩamāh" } } }, SX: { name: "St. Maarten", sub: { "SX-SX": { type: "Country", name: "St. Maarten" } } }, KG: { name: "Kyrgyzstan", sub: { "KG-Y": { type: "Region", name: "Issyk-Kul'skaja oblast'" }, "KG-GO": { type: "City", name: "Gorod Oš" }, "KG-GB": { type: "City", name: "Bishkek" }, "KG-T": { type: "Region", name: "Talas" }, "KG-J": { type: "Region", name: "Džalal-Abadskaja oblast'" }, "KG-O": { type: "Region", name: "Osh" }, "KG-N": { type: "Region", name: "Naryn" }, "KG-C": { type: "Region", name: "Chü" }, "KG-B": { type: "Region", name: "Batken" } } }, KE: { name: "Kenya", sub: { "KE-32": { type: "County", name: "Nandi" }, "KE-38": { type: "County", name: "Siaya" }, "KE-40": { type: "County", name: "Tana River" }, "KE-41": { type: "County", name: "Tharaka-Nithi" }, "KE-42": { type: "County", name: "Trans Nzoia" }, "KE-43": { type: "County", name: "Turkana" }, "KE-44": { type: "County", name: "Uasin Gishu" }, "KE-28": { type: "County", name: "Mombasa" }, "KE-46": { type: "County", name: "Wajir" }, "KE-47": { type: "County", name: "West Pokot" }, "KE-29": { type: "County", name: "Murang'a" }, "KE-26": { type: "County", name: "Meru" }, "KE-27": { type: "County", name: "Migori" }, "KE-24": { type: "County", name: "Mandera" }, "KE-25": { type: "County", name: "Marsabit" }, "KE-08": {
      type: "County",
      name: "Homa Bay"
    }, "KE-09": { type: "County", name: "Isiolo" }, "KE-20": { type: "County", name: "Laikipia" }, "KE-21": { type: "County", name: "Lamu" }, "KE-04": { type: "County", name: "Busia" }, "KE-05": { type: "County", name: "Elgeyo/Marakwet" }, "KE-06": { type: "County", name: "Embu" }, "KE-07": { type: "County", name: "Garissa" }, "KE-01": { type: "County", name: "Baringo" }, "KE-02": { type: "County", name: "Bomet" }, "KE-03": { type: "County", name: "Bungoma" }, "KE-31": { type: "County", name: "Nakuru" }, "KE-35": { type: "County", name: "Nyandarua" }, "KE-34": { type: "County", name: "Nyamira" }, "KE-37": { type: "County", name: "Samburu" }, "KE-30": { type: "County", name: "Nairobi City" }, "KE-36": { type: "County", name: "Nyeri" }, "KE-22": { type: "County", name: "Machakos" }, "KE-23": { type: "County", name: "Makueni" }, "KE-13": { type: "County", name: "Kiambu" }, "KE-12": { type: "County", name: "Kericho" }, "KE-11": { type: "County", name: "Kakamega" }, "KE-10": { type: "County", name: "Kajiado" }, "KE-17": { type: "County", name: "Kisumu" }, "KE-16": { type: "County", name: "Kisii" }, "KE-15": { type: "County", name: "Kirinyaga" }, "KE-14": { type: "County", name: "Kilifi" }, "KE-19": { type: "County", name: "Kwale" }, "KE-18": { type: "County", name: "Kitui" }, "KE-39": { type: "County", name: "Taita/Taveta" }, "KE-33": { type: "County", name: "Narok" }, "KE-45": { type: "County", name: "Vihiga" } } }, SS: { name: "South Sudan", sub: { "SS-BW": { type: "State", name: "Western Bahr el Ghazal" }, "SS-EW": { type: "State", name: "Western Equatoria" }, "SS-LK": { type: "State", name: "Lakes" }, "SS-EC": { type: "State", name: "Central Equatoria" }, "SS-EE": { type: "State", name: "Eastern Equatoria" }, "SS-NU": { type: "State", name: "Upper Nile" }, "SS-UY": { type: "State", name: "Unity" }, "SS-BN": { type: "State", name: "Northern Bahr el Ghazal" }, "SS-JG": { type: "State", name: "Jonglei" }, "SS-WR": { type: "State", name: "Warrap" } } }, SR: { name: "Suriname", sub: { "SR-SA": { type: "District", name: "Saramacca" }, "SR-CR": { type: "District", name: "Coronie" }, "SR-BR": { type: "District", name: "Brokopondo" }, "SR-SI": { type: "District", name: "Sipaliwini" }, "SR-PR": { type: "District", name: "Para" }, "SR-WA": { type: "District", name: "Wanica" }, "SR-NI": { type: "District", name: "Nickerie" }, "SR-PM": { type: "District", name: "Paramaribo" }, "SR-CM": { type: "District", name: "Commewijne" }, "SR-MA": { type: "District", name: "Marowijne" } } }, KI: { name: "Kiribati", sub: { "KI-P": { type: "Group of islands", name: "Phoenix Islands" }, "KI-G": { type: "Group of islands", name: "Gilbert Islands" }, "KI-L": { type: "Group of islands", name: "Line Islands" } } }, KH: { name: "Cambodia", sub: { "KH-24": { type: "Autonomous municipality", name: "Krŏng Pailĭn" }, "KH-21": { type: "Province", name: "Taakaev" }, "KH-20": { type: "Province", name: "Svaay Rieng" }, "KH-23": { type: "Autonomous municipality", name: "Krong Kaeb" }, "KH-22": { type: "Province", name: "Ŏtdâr Méanchey" }, "KH-6": { type: "Province", name: "Kâmpóng Thum" }, "KH-7": { type: "Province", name: "Kampot" }, "KH-4": { type: "Province", name: "Kampong Chhnang" }, "KH-5": { type: "Province", name: "Kâmpóng Spœ" }, "KH-2": { type: "Province", name: "Baat Dambang" }, "KH-3": { type: "Province", name: "Kampong Chaam" }, "KH-1": { type: "Province", name: "Bântéay Méanchey" }, "KH-8": { type: "Province", name: "Kandaal" }, "KH-9": { type: "Province", name: "Kaoh Kong" }, "KH-18": { type: "Autonomous municipality", name: "Krŏng Preăh Sihanouk" }, "KH-19": { type: "Province", name: "Stoĕng Trêng" }, "KH-14": { type: "Province", name: "Prey Veaeng" }, "KH-15": { type: "Province", name: "Pousaat" }, "KH-16": { type: "Province", name: "Rotanak Kiri" }, "KH-17": { type: "Province", name: "Siem Reab" }, "KH-10": { type: "Province", name: "Krâchéh" }, "KH-11": { type: "Province", name: "Môndól Kiri" }, "KH-12": { type: "Autonomous municipality", name: "Phnom Penh" }, "KH-13": { type: "Province", name: "Preăh Vihéar" } } }, SV: { name: "El Salvador", sub: { "SV-CH": { type: "Department", name: "Chalatenango" }, "SV-LI": { type: "Department", name: "La Libertad" }, "SV-US": { type: "Department", name: "Usulután" }, "SV-SV": { type: "Department", name: "San Vicente" }, "SV-CA": { type: "Department", name: "Cabañas" }, "SV-AH": { type: "Department", name: "Ahuachapán" }, "SV-MO": { type: "Department", name: "Morazán" }, "SV-SM": { type: "Department", name: "San Miguel" }, "SV-SO": { type: "Department", name: "Sonsonate" }, "SV-PA": { type: "Department", name: "La Paz" }, "SV-UN": { type: "Department", name: "La Unión" }, "SV-CU": { type: "Department", name: "Cuscatlán" }, "SV-SS": { type: "Department", name: "San Salvador" }, "SV-SA": { type: "Department", name: "Santa Ana" } } }, KM: { name: "Comoros", sub: { "KM-G": { type: "Island", name: "Andjazîdja" }, "KM-M": { type: "Island", name: "Mohéli" }, "KM-A": { type: "Island", name: "Andjouân" } } }, ST: { name: "Sao Tome and Principe", sub: { "ST-S": { type: "Province", name: "São Tomé" }, "ST-P": { type: "Province", name: "Príncipe" } } }, SK: { name: "Slovakia", sub: { "SK-PV": { type: "Region", name: "Prešovský kraj" }, "SK-KI": { type: "Region", name: "Košický kraj" }, "SK-TC": { type: "Region", name: "Trenčiansky kraj" }, "SK-TA": { type: "Region", name: "Trnavský kraj" }, "SK-ZI": { type: "Region", name: "Žilinský kraj" }, "SK-BL": { type: "Region", name: "Bratislavský kraj" }, "SK-NI": { type: "Region", name: "Nitriansky kraj" }, "SK-BC": { type: "Region", name: "Banskobystrický kraj" } } }, KR: { name: "Korea, Republic of", sub: { "KR-31": { type: "Metropolitan city", name: "Ulsan Gwang'yeogsi" }, "KR-49": { type: "Special self-governing province", name: "Cheju-do" }, "KR-48": { type: "Province", name: "Gyeongsangnamdo" }, "KR-45": { type: "Province", name: "Chǒllabuk-do" }, "KR-44": { type: "Province", name: "Ch'ungch'ǒngnam-do" }, "KR-47": { type: "Province", name: "Gyeongsangbugdo" }, "KR-46": { type: "Province", name: "Chǒllanam-do" }, "KR-41": { type: "Province", name: "Gyeonggido" }, "KR-43": { type: "Province", name: "Ch'ungch'ǒngbuk-do" }, "KR-42": { type: "Province", name: "Gang'weondo" }, "KR-30": { type: "Metropolitan city", name: "Daejeon Gwang'yeogsi" }, "KR-11": { type: "Special city", name: "Seoul-T'ǔkpyǒlshi" }, "KR-50": { type: "Special self-governing city", name: "Sejong" }, "KR-29": { type: "Metropolitan city", name: "Gwangju Gwang'yeogsi" }, "KR-28": { type: "Metropolitan city", name: "Inch'ǒn-Kwangyǒkshi" }, "KR-27": { type: "Metropolitan city", name: "Daegu Gwang'yeogsi" }, "KR-26": { type: "Metropolitan city", name: "Busan Gwang'yeogsi" } } }, SI: { name: "Slovenia", sub: { "SI-056": { type: "Commune", name: "Kuzma" }, "SI-057": { type: "Commune", name: "Laško" }, "SI-054": { type: "Commune", name: "Krško" }, "SI-055": { type: "Commune", name: "Kungota" }, "SI-052": { type: "Commune", name: "Kranj" }, "SI-053": { type: "Commune", name: "Kranjska Gora" }, "SI-050": { type: "Commune", name: "Koper" }, "SI-051": { type: "Commune", name: "Kozje" }, "SI-117": { type: "Commune", name: "Šenčur" }, "SI-116": { type: "Commune", name: "Sveti Jurij" }, "SI-115": { type: "Commune", name: "Starše" }, "SI-114": { type: "Commune", name: "Slovenske Konjice" }, "SI-113": { type: "Commune", name: "Slovenska Bistrica" }, "SI-112": { type: "Commune", name: "Slovenj Gradec" }, "SI-058": { type: "Commune", name: "Lenart" }, "SI-059": { type: "Commune", name: "Lendava" }, "SI-166": { type: "Commune", name: "Križevci" }, "SI-167": { type: "Commune", name: "Lovrenc na Pohorju" }, "SI-128": { type: "Commune", name: "Tolmin" }, "SI-129": { type: "Commune", name: "Trbovlje" }, "SI-210": { type: "Commune", name: "Sveti Jurij v Slovenskih Goricah" }, "SI-211": { type: "Commune", name: "Šentrupert" }, "SI-212": { type: "Commune", name: "Mirna" }, "SI-045": { type: "Commune", name: "Kidričevo" }, "SI-044": { type: "Commune", name: "Kanal" }, "SI-047": { type: "Commune", name: "Kobilje" }, "SI-046": { type: "Commune", name: "Kobarid" }, "SI-041": { type: "Commune", name: "Jesenice" }, "SI-040": { type: "Commune", name: "Izola" }, "SI-043": { type: "Commune", name: "Kamnik" }, "SI-042": { type: "Commune", name: "Juršinci" }, "SI-162": { type: "Commune", name: "Horjul" }, "SI-163": { type: "Commune", name: "Jezersko" }, "SI-160": { type: "Commune", name: "Hoče-Slivnica" }, "SI-161": { type: "Commune", name: "Hodoš" }, "SI-049": { type: "Commune", name: "Komen" }, "SI-048": { type: "Commune", name: "Kočevje" }, "SI-164": { type: "Commune", name: "Komenda" }, "SI-165": { type: "Commune", name: "Kostel" }, "SI-197": { type: "Commune", name: "Kosanjevica na Krki" }, "SI-196": { type: "Commune", name: "Cirkulane" }, "SI-195": { type: "Commune", name: "Apače" }, "SI-194": { type: "Commune", name: "Šmartno pri Litiji" }, "SI-193": { type: "Commune", name: "Žužemberk" }, "SI-192": { type: "Commune", name: "Žirovnica" }, "SI-191": { type: "Commune", name: "Žetale" }, "SI-190": { type: "Commune", name: "Žalec" }, "SI-199": { type: "Commune", name: "Mokronog-Trebelno" }, "SI-198": { type: "Commune", name: "Makole" }, "SI-188": { type: "Commune", name: "Veržej" }, "SI-209": { type: "Commune", name: "Rečica ob Savinji" }, "SI-208": { type: "Commune", name: "Log-Dragomer" }, "SI-119": { type: "Commune", name: "Šentjernej" }, "SI-189": { type: "Commune", name: "Vransko" }, "SI-203": { type: "Commune", name: "Straža" }, "SI-202": { type: "Commune", name: "Središče ob Dravi" }, "SI-201": { type: "Commune", name: "Renče-Vogrsko" }, "SI-118": { type: "Commune", name: "Šentilj" }, "SI-207": { type: "Commune", name: "Gorje" }, "SI-206": { type: "Commune", name: "Šmarješke Toplice" }, "SI-205": { type: "Commune", name: "Sveti Tomaž" }, "SI-204": { type: "Commune", name: "Sveta Trojica v Slovenskih Goricah" }, "SI-070": { type: "Commune", name: "Maribor" }, "SI-071": { type: "Commune", name: "Medvode" }, "SI-072": { type: "Commune", name: "Mengeš" }, "SI-073": { type: "Commune", name: "Metlika" }, "SI-074": { type: "Commune", name: "Mežica" }, "SI-075": { type: "Commune", name: "Miren-Kostanjevica" }, "SI-076": { type: "Commune", name: "Mislinja" }, "SI-077": { type: "Commune", name: "Moravče" }, "SI-078": { type: "Commune", name: "Moravske Toplice" }, "SI-079": { type: "Commune", name: "Mozirje" }, "SI-173": { type: "Commune", name: "Polzela" }, "SI-172": { type: "Commune", name: "Podlehnik" }, "SI-175": { type: "Commune", name: "Prevalje" }, "SI-174": { type: "Commune", name: "Prebold" }, "SI-177": { type: "Commune", name: "Ribnica na Pohorju" }, "SI-176": { type: "Commune", name: "Razkrižje" }, "SI-180": { type: "Commune", name: "Solčava" }, "SI-111": { type: "Commune", name: "Sežana" }, "SI-110": { type: "Commune", name: "Sevnica" }, "SI-182": { type: "Commune", name: "Sveti Andraž v Slovenskih Goricah" }, "SI-144": { type: "Commune", name: "Zreče" }, "SI-146": { type: "Commune", name: "Železniki" }, "SI-147": { type: "Commune", name: "Žiri" }, "SI-140": { type: "Commune", name: "Vrhnika" }, "SI-141": { type: "Commune", name: "Vuzenica" }, "SI-142": { type: "Commune", name: "Zagorje ob Savi" }, "SI-143": { type: "Commune", name: "Zavrč" }, "SI-148": { type: "Commune", name: "Benedikt" }, "SI-149": { type: "Commune", name: "Bistrica ob Sotli" }, "SI-069": { type: "Commune", name: "Majšperk" }, "SI-068": { type: "Commune", name: "Lukovica" }, "SI-067": { type: "Commune", name: "Luče" }, "SI-066": { type: "Commune", name: "Loški Potok" }, "SI-065": { type: "Commune", name: "Loška Dolina" }, "SI-064": { type: "Commune", name: "Logatec" }, "SI-063": { type: "Commune", name: "Ljutomer" }, "SI-062": { type: "Commune", name: "Ljubno" }, "SI-061": { type: "Commune", name: "Ljubljana" }, "SI-060": { type: "Commune", name: "Litija" }, "SI-153": { type: "Commune", name: "Cerkvenjak" }, "SI-152": { type: "Commune", name: "Cankova" }, "SI-151": { type: "Commune", name: "Braslovče" }, "SI-150": { type: "Commune", name: "Bloke" }, "SI-157": { type: "Commune", name: "Dolenjske Toplice" }, "SI-156": { type: "Commune", name: "Dobrovnik" }, "SI-155": { type: "Commune", name: "Dobrna" }, "SI-154": { type: "Commune", name: "Dobje" }, "SI-159": { type: "Commune", name: "Hajdina" }, "SI-158": { type: "Commune", name: "Grad" }, "SI-018": { type: "Commune", name: "Destrnik" }, "SI-019": { type: "Commune", name: "Divača" }, "SI-012": { type: "Commune", name: "Cerklje na Gorenjskem" }, "SI-013": { type: "Commune", name: "Cerknica" }, "SI-010": { type: "Commune", name: "Tišina" }, "SI-011": { type: "Commune", name: "Celje" }, "SI-016": { type: "Commune", name: "Črna na Koroškem" }, "SI-017": { type: "Commune", name: "Črnomelj" }, "SI-014": { type: "Commune", name: "Cerkno" }, "SI-015": { type: "Commune", name: "Črenšovci" }, "SI-200": { type: "Commune", name: "Poljčane" }, "SI-009": { type: "Commune", name: "Brežice" }, "SI-008": { type: "Commune", name: "Brezovica" }, "SI-124": { type: "Commune", name: "Šmarje pri Jelšah" }, "SI-125": { type: "Commune", name: "Šmartno ob Paki" }, "SI-122": { type: "Commune", name: "Škofja Loka" }, "SI-123": { type: "Commune", name: "Škofljica" }, "SI-120": { type: "Commune", name: "Šentjur" }, "SI-121": { type: "Commune", name: "Škocjan" }, "SI-001": { type: "Commune", name: "Ajdovščina" }, "SI-003": { type: "Commune", name: "Bled" }, "SI-002": { type: "Commune", name: "Beltinci" }, "SI-005": { type: "Commune", name: "Borovnica" }, "SI-004": { type: "Commune", name: "Bohinj" }, "SI-007": { type: "Commune", name: "Brda" }, "SI-006": { type: "Commune", name: "Bovec" }, "SI-179": { type: "Commune", name: "Sodražica" }, "SI-178": { type: "Commune", name: "Selnica ob Dravi" }, "SI-092": { type: "Commune", name: "Podčetrtek" }, "SI-093": { type: "Commune", name: "Podvelka" }, "SI-090": { type: "Commune", name: "Piran" }, "SI-091": { type: "Commune", name: "Pivka" }, "SI-096": { type: "Commune", name: "Ptuj" }, "SI-097": { type: "Commune", name: "Puconci" }, "SI-094": { type: "Commune", name: "Postojna" }, "SI-095": { type: "Commune", name: "Preddvor" }, "SI-098": { type: "Commune", name: "Rače-Fram" }, "SI-099": { type: "Commune", name: "Radeče" }, "SI-034": { type: "Commune", name: "Hrastnik" }, "SI-035": { type: "Commune", name: "Hrpelje-Kozina" }, "SI-036": { type: "Commune", name: "Idrija" }, "SI-037": { type: "Commune", name: "Ig" }, "SI-030": { type: "Commune", name: "Gornji Grad" }, "SI-031": { type: "Commune", name: "Gornji Petrovci" }, "SI-032": { type: "Commune", name: "Grosuplje" }, "SI-033": { type: "Commune", name: "Šalovci" }, "SI-038": { type: "Commune", name: "Ilirska Bistrica" }, "SI-039": { type: "Commune", name: "Ivančna Gorica" }, "SI-135": { type: "Commune", name: "Videm" }, "SI-134": { type: "Commune", name: "Velike Lašče" }, "SI-137": { type: "Commune", name: "Vitanje" }, "SI-136": { type: "Commune", name: "Vipava" }, "SI-131": { type: "Commune", name: "Tržič" }, "SI-130": { type: "Commune", name: "Trebnje" }, "SI-133": { type: "Commune", name: "Velenje" }, "SI-132": { type: "Commune", name: "Turnišče" }, "SI-139": { type: "Commune", name: "Vojnik" }, "SI-138": { type: "Commune", name: "Vodice" }, "SI-171": { type: "Commune", name: "Oplotnica" }, "SI-081": { type: "Commune", name: "Muta" }, "SI-080": { type: "Commune", name: "Murska Sobota" }, "SI-083": { type: "Commune", name: "Nazarje" }, "SI-082": { type: "Commune", name: "Naklo" }, "SI-085": { type: "Commune", name: "Novo Mesto" }, "SI-084": { type: "Commune", name: "Nova Gorica" }, "SI-087": { type: "Commune", name: "Ormož" }, "SI-086": { type: "Commune", name: "Odranci" }, "SI-089": { type: "Commune", name: "Pesnica" }, "SI-088": { type: "Commune", name: "Osilnica" }, "SI-023": { type: "Commune", name: "Domžale" }, "SI-022": { type: "Commune", name: "Dol pri Ljubljani" }, "SI-021": { type: "Commune", name: "Dobrova-Polhov Gradec" }, "SI-020": { type: "Commune", name: "Dobrepolje" }, "SI-027": { type: "Commune", name: "Gorenja vas-Poljane" }, "SI-026": { type: "Commune", name: "Duplek" }, "SI-025": { type: "Commune", name: "Dravograd" }, "SI-024": { type: "Commune", name: "Dornava" }, "SI-170": { type: "Commune", name: "Mirna Peč" }, "SI-181": { type: "Commune", name: "Sveta Ana" }, "SI-029": { type: "Commune", name: "Gornja Radgona" }, "SI-028": { type: "Commune", name: "Gorišnica" }, "SI-184": { type: "Commune", name: "Tabor" }, "SI-185": { type: "Commune", name: "Trnovska Vas" }, "SI-186": { type: "Commune", name: "Trzin" }, "SI-187": { type: "Commune", name: "Velika Polana" }, "SI-100": { type: "Commune", name: "Radenci" }, "SI-101": { type: "Commune", name: "Radlje ob Dravi" }, "SI-102": { type: "Commune", name: "Radovljica" }, "SI-103": { type: "Commune", name: "Ravne na Koroškem" }, "SI-104": { type: "Commune", name: "Ribnica" }, "SI-105": { type: "Commune", name: "Rogašovci" }, "SI-106": { type: "Commune", name: "Rogaška Slatina" }, "SI-107": { type: "Commune", name: "Rogatec" }, "SI-108": { type: "Commune", name: "Ruše" }, "SI-109": { type: "Commune", name: "Semič" }, "SI-126": { type: "Commune", name: "Šoštanj" }, "SI-127": { type: "Commune", name: "Štore" }, "SI-168": { type: "Commune", name: "Markovci" }, "SI-169": { type: "Commune", name: "Miklavž na Dravskem Polju" }, "SI-183": { type: "Commune", name: "Šempeter-Vrtojba" } } }, KP: { name: "Korea, Democratic People's Republic Of", sub: { "KP-09": { type: "Province", name: "Hamgyǒng-bukto" }, "KP-08": { type: "Province", name: "Hamgyǒng-namdo" }, "KP-03": { type: "Province", name: "P'yǒngan-bukto" }, "KP-02": { type: "Province", name: "P'yǒngan-namdo" }, "KP-01": { type: "Capital city", name: "P'yǒngyang" }, "KP-07": { type: "Province", name: "Kangweonto" }, "KP-06": { type: "Province", name: "Hwanghae-bukto" }, "KP-05": { type: "Province", name: "Hwanghae-namdo" }, "KP-04": { type: "Province", name: "Chagang-do" }, "KP-10": { type: "Province", name: "Ryangkangto" }, "KP-13": { type: "Special city", name: "Nasǒn" } } }, KW: { name: "Kuwait", sub: { "KW-KU": { type: "Governorate", name: "Al Kuwayt" }, "KW-FA": { type: "Governorate", name: "Al Farwānīyah" }, "KW-AH": { type: "Governorate", name: "Al Aḩmadī" }, "KW-HA": { type: "Governorate", name: "Ḩawallī" }, "KW-MU": { type: "Governorate", name: "Mubārak al Kabīr" }, "KW-JA": { type: "Governorate", name: "Al Jahrā’" } } }, SN: { name: "Senegal", sub: { "SN-SE": { type: "Region", name: "Sédhiou" }, "SN-TC": { type: "Region", name: "Tambacounda" }, "SN-ZG": { type: "Region", name: "Ziguinchor" }, "SN-SL": { type: "Region", name: "Saint-Louis" }, "SN-TH": { type: "Region", name: "Thiès" }, "SN-MT": { type: "Region", name: "Matam" }, "SN-KL": { type: "Region", name: "Kaolack" }, "SN-DB": { type: "Region", name: "Diourbel" }, "SN-FK": { type: "Region", name: "Fatick" }, "SN-KD": { type: "Region", name: "Kolda" }, "SN-KE": { type: "Region", name: "Kédougou" }, "SN-DK": { type: "Region", name: "Dakar" }, "SN-KA": { type: "Region", name: "Kaffrine" }, "SN-LG": { type: "Region", name: "Louga" } } }, SM: { name: "San Marino", sub: { "SM-08": { type: "Municipality", name: "Montegiardino" }, "SM-09": { type: "Municipality", name: "Serravalle" }, "SM-04": { type: "Municipality", name: "Faetano" }, "SM-05": { type: "Municipality", name: "Fiorentino" }, "SM-06": { type: "Municipality", name: "Borgo Maggiore" }, "SM-07": { type: "Municipality", name: "San Marino" }, "SM-01": { type: "Municipality", name: "Acquaviva" }, "SM-02": { type: "Municipality", name: "Chiesanuova" }, "SM-03": { type: "Municipality", name: "Domagnano" } } }, SL: { name: "Sierra Leone", sub: { "SL-S": { type: "Province", name: "Southern" }, "SL-N": { type: "Province", name: "Northern" }, "SL-W": { type: "Area", name: "Western Area" }, "SL-E": { type: "Province", name: "Eastern" } } }, SC: { name: "Seychelles", sub: { "SC-19": { type: "District", name: "Plaisance" }, "SC-18": { type: "District", name: "Mon Fleri" }, "SC-15": { type: "District", name: "Ladig" }, "SC-14": { type: "District", name: "Grand'Anse Praslin" }, "SC-17": { type: "District", name: "Mon Bikston" }, "SC-16": { type: "District", name: "English River" }, "SC-11": { type: "District", name: "Cascade" }, "SC-10": { type: "District", name: "Bel Ombre" }, "SC-13": { type: "District", name: "Grand'Anse Mahé" }, "SC-12": { type: "District", name: "Glacis" }, "SC-24": { type: "District", name: "Lemamel" }, "SC-25": { type: "District", name: "Roche Caïman" }, "SC-20": { type: "District", name: "Pointe La Rue" }, "SC-21": { type: "District", name: "Porglo" }, "SC-22": { type: "District", name: "Saint Louis" }, "SC-23": { type: "District", name: "Takamaka" }, "SC-08": { type: "District", name: "Beau Vallon" }, "SC-09": { type: "District", name: "Bel Air" }, "SC-06": { type: "District", name: "Baie Lazare" }, "SC-07": { type: "District", name: "Baie Sainte-Anne" }, "SC-04": { type: "District", name: "Au Cap" }, "SC-05": { type: "District", name: "Anse Royale" }, "SC-02": { type: "District", name: "Ans Bwalo" }, "SC-03": { type: "District", name: "Anse Etoile" }, "SC-01": { type: "District", name: "Anse aux Pins" } } }, KZ: { name: "Kazakhstan", sub: { "KZ-KAR": { type: "Region", name: "Karagandinskaja oblast'" }, "KZ-SEV": { type: "Region", name: "Severo-Kazahstanskaja oblast'" }, "KZ-MAN": { type: "Region", name: "Mangghystaū oblysy" }, "KZ-VOS": { type: "Region", name: "Shyghys Qazaqstan oblysy" }, "KZ-KZY": { type: "Region", name: "Kyzylordinskaja oblast'" }, "KZ-PAV": { type: "Region", name: "Pavlodar oblysy" }, "KZ-KUS": { type: "Region", name: "Kostanajskaja oblast'" }, "KZ-AKT": { type: "Region", name: "Aktjubinskaja oblast'" }, "KZ-ALM": { type: "Region", name: "Almatinskaja oblast'" }, "KZ-ALA": { type: "City", name: "Almaty" }, "KZ-AST": { type: "City", name: "Astana" }, "KZ-AKM": { type: "Region", name: "Akmolinskaja oblast'" }, "KZ-ZHA": { type: "Region", name: "Žambylskaja oblast'" }, "KZ-ZAP": { type: "Region", name: "Batys Qazaqstan oblysy" }, "KZ-YUZ": { type: "Region", name: "Južno-Kazahstanskaja oblast'" }, "KZ-ATY": { type: "Region", name: "Atyraū oblysy" } } }, KY: { name: "Cayman Islands", sub: { "KY-KY": { type: "Country", name: "Cayman Islands" } } }, SG: { name: "Singapore", sub: { "SG-02": { type: "District", name: "North East" }, "SG-03": { type: "District", name: "North West" }, "SG-01": { type: "District", name: "Central Singapore" }, "SG-04": { type: "District", name: "South East" }, "SG-05": { type: "District", name: "South West" } } }, SE: { name: "Sweden", sub: { "SE-O": { type: "County", name: "Västra Götalands län" }, "SE-N": { type: "County", name: "Hallands län" }, "SE-M": { type: "County", name: "Skåne län" }, "SE-K": { type: "County", name: "Blekinge län" }, "SE-I": { type: "County", name: "Gotlands län" }, "SE-H": { type: "County", name: "Kalmar län" }, "SE-G": { type: "County", name: "Kronobergs län" }, "SE-F": { type: "County", name: "Jönköpings län" }, "SE-E": { type: "County", name: "Östergötlands län" }, "SE-D": { type: "County", name: "Södermanlands län" }, "SE-C": { type: "County", name: "Uppsala län" }, "SE-W": { type: "County", name: "Dalarnas län" }, "SE-Z": { type: "County", name: "Jämtlands län" }, "SE-Y": { type: "County", name: "Västernorrlands län" }, "SE-X": { type: "County", name: "Gävleborgs län" }, "SE-AC": { type: "County", name: "Västerbottens län" }, "SE-AB": { type: "County", name: "Stockholms län" }, "SE-BD": { type: "County", name: "Norrbottens län" }, "SE-T": { type: "County", name: "Örebro län" }, "SE-S": { type: "County", name: "Värmlands län" }, "SE-U": { type: "County", name: "Västmanlands län" } } }, SD: { name: "Sudan", sub: { "SD-KH": { type: "State", name: "Al Kharţūm" }, "SD-GZ": { type: "State", name: "Al Jazīrah" }, "SD-NB": { type: "State", name: "An Nīl al Azraq" }, "SD-DS": { type: "State", name: "Janūb Dārfūr" }, "SD-NR": { type: "State", name: "An Nīl" }, "SD-NO": { type: "State", name: "Ash Shamālīyah" }, "SD-KA": { type: "State", name: "Kassala" }, "SD-DW": { type: "State", name: "Gharb Dārfūr" }, "SD-RS": { type: "State", name: "Al Baḩr al Aḩmar" }, "SD-NW": { type: "State", name: "An Nīl al Abyaḑ" }, "SD-DN": { type: "State", name: "North Darfur" }, "SD-KS": { type: "State", name: "Janūb Kurdufān" }, "SD-DC": { type: "State", name: "Central Darfur" }, "SD-KN": { type: "State", name: "North Kordofan" }, "SD-GD": { type: "State", name: "Al Qaḑārif" }, "SD-SI": { type: "State", name: "Sennar" }, "SD-DE": { type: "State", name: "East Darfur" } } }, DO: { name: "Dominican Republic", sub: { "DO-33": { type: "Region", name: "Cibao Nordeste" }, "DO-40": { type: "Region", name: "Ozama" }, "DO-12": { type: "Province", name: "La Romana" }, "DO-13": { type: "Province", name: "La Vega" }, "DO-10": { type: "Province", name: "Independencia" }, "DO-11": { type: "Province", name: "La Altagracia" }, "DO-16": { type: "Province", name: "Pedernales" }, "DO-17": { type: "Province", name: "Peravia" }, "DO-14": { type: "Province", name: "María Trinidad Sánchez" }, "DO-15": { type: "Province", name: "Monte Cristi" }, "DO-30": { type: "Province", name: "Hato Mayor" }, "DO-31": { type: "Province", name: "San José de Ocoa" }, "DO-18": { type: "Province", name: "Puerto Plata" }, "DO-19": { type: "Province", name: "Hermanas Mirabal" }, "DO-34": { type: "Region", name: "Cibao Noroeste" }, "DO-35": { type: "Region", name: "Cibao Norte" }, "DO-36": { type: "Region", name: "Cibao Sur" }, "DO-37": { type: "Region", name: "El Valle" }, "DO-38": { type: "Region", name: "Enriquillo" }, "DO-39": { type: "Region", name: "Higuamo" }, "DO-29": { type: "Province", name: "Monte Plata" }, "DO-28": { type: "Province", name: "Monseñor Nouel" }, "DO-01": { type: "District", name: "Distrito Nacional" }, "DO-03": { type: "Province", name: "Baoruco" }, "DO-02": { type: "Province", name: "Azua" }, "DO-05": { type: "Province", name: "Dajabón" }, "DO-04": { type: "Province", name: "Barahona" }, "DO-07": { type: "Province", name: "La Estrelleta" }, "DO-06": { type: "Province", name: "Duarte" }, "DO-09": { type: "Province", name: "Espaillat" }, "DO-08": { type: "Province", name: "El Seibo" }, "DO-25": { type: "Province", name: "Santiago" }, "DO-24": { type: "Province", name: "Sánchez Ramírez" }, "DO-23": { type: "Province", name: "San Pedro de Macorís" }, "DO-22": { type: "Province", name: "San Juan" }, "DO-21": { type: "Province", name: "San Cristóbal" }, "DO-20": { type: "Province", name: "Samaná" }, "DO-27": { type: "Province", name: "Valverde" }, "DO-26": { type: "Province", name: "Santiago Rodríguez" }, "DO-41": { type: "Region", name: "Valdesia" }, "DO-32": { type: "Province", name: "Santo Domingo" }, "DO-42": { type: "Region", name: "Yuma" } } }, DM: { name: "Dominica", sub: { "DM-10": { type: "Parish", name: "Saint Paul" }, "DM-11": { type: "Parish", name: "Saint Peter" }, "DM-09": { type: "Parish", name: "Saint Patrick" }, "DM-08": { type: "Parish", name: "Saint Mark" }, "DM-03": { type: "Parish", name: "Saint David" }, "DM-02": { type: "Parish", name: "Saint Andrew" }, "DM-07": { type: "Parish", name: "Saint Luke" }, "DM-06": { type: "Parish", name: "Saint Joseph" }, "DM-05": { type: "Parish", name: "Saint John" }, "DM-04": { type: "Parish", name: "Saint George" } } }, DJ: { name: "Djibouti", sub: { "DJ-AS": { type: "Region", name: "Ali Sabieh" }, "DJ-AR": { type: "Region", name: "Arta" }, "DJ-DJ": { type: "City", name: "Djibouti" }, "DJ-DI": { type: "Region", name: "Dikhīl" }, "DJ-OB": { type: "Region", name: "Obock" }, "DJ-TA": { type: "Region", name: "Tadjourah" } } }, DK: { name: "Denmark", sub: { "DK-85": { type: "Region", name: "Sjælland" }, "DK-84": { type: "Region", name: "Hovedstaden" }, "DK-81": { type: "Region", name: "Nordjylland" }, "DK-83": { type: "Region", name: "Syddanmark" }, "DK-82": { type: "Region", name: "Midtjylland" } } }, VG: { name: "Virgin Islands", sub: { "VG-VG": { type: "Country", name: "Virgin Islands" } } }, DE: { name: "Germany", sub: { "DE-BE": { type: "Länder", name: "Berlin" }, "DE-ST": { type: "Länder", name: "Sachsen-Anhalt" }, "DE-RP": { type: "Länder", name: "Rheinland-Pfalz" }, "DE-BB": { type: "Länder", name: "Brandenburg" }, "DE-NI": { type: "Länder", name: "Niedersachsen" }, "DE-SH": { type: "Länder", name: "Schleswig-Holstein" }, "DE-TH": { type: "Länder", name: "Thüringen" }, "DE-BW": { type: "Länder", name: "Baden-Württemberg" }, "DE-HH": { type: "Länder", name: "Hamburg" }, "DE-MV": { type: "Länder", name: "Mecklenburg-Vorpommern" }, "DE-NW": { type: "Länder", name: "Nordrhein-Westfalen" }, "DE-SN": { type: "Länder", name: "Sachsen" }, "DE-HB": { type: "Länder", name: "Bremen" }, "DE-SL": { type: "Länder", name: "Saarland" }, "DE-BY": { type: "Länder", name: "Bayern" }, "DE-HE": { type: "Länder", name: "Hessen" } } }, YE: { name: "Yemen", sub: { "YE-BA": { type: "Governorate", name: "Al Bayḑā'" }, "YE-SD": { type: "Governorate", name: "Şāʻdah" }, "YE-SA": { type: "Municipality", name: "Amānat al ‘Āşimah" }, "YE-HU": { type: "Governorate", name: "Al Ḩudaydah" }, "YE-SN": { type: "Governorate", name: "Şanʻā'" }, "YE-SH": { type: "Governorate", name: "Shabwah" }, "YE-TA": { type: "Governorate", name: "Tāʻizz" }, "YE-MA": { type: "Governorate", name: "Ma'rib" }, "YE-LA": { type: "Governorate", name: "Laḩij" }, "YE-RA": { type: "Governorate", name: "Raymah" }, "YE-IB": { type: "Governorate", name: "Ibb" }, "YE-AM": { type: "Governorate", name: "'Amrān" }, "YE-HD": { type: "Governorate", name: "Ḩaḑramawt" }, "YE-DA": { type: "Governorate", name: "Aḑ Ḑāli'" }, "YE-HJ": { type: "Governorate", name: "Ḩajjah" }, "YE-JA": { type: "Governorate", name: "Al Jawf" }, "YE-MW": { type: "Governorate", name: "Al Maḩwīt" }, "YE-AB": { type: "Governorate", name: "Abyān" }, "YE-AD": { type: "Governorate", name: "'Adan" }, "YE-DH": { type: "Governorate", name: "Dhamār" }, "YE-MR": { type: "Governorate", name: "Al Mahrah" } } }, DZ: { name: "Algeria", sub: { "DZ-11": { type: "Province", name: "Tamanrasset" }, "DZ-10": { type: "Province", name: "Bouira" }, "DZ-13": { type: "Province", name: "Tlemcen" }, "DZ-12": { type: "Province", name: "Tébessa" }, "DZ-15": { type: "Province", name: "Tizi Ouzou" }, "DZ-14": { type: "Province", name: "Tiaret" }, "DZ-17": { type: "Province", name: "Djelfa" }, "DZ-16": { type: "Province", name: "Alger" }, "DZ-19": { type: "Province", name: "Sétif" }, "DZ-18": { type: "Province", name: "Jijel" }, "DZ-35": { type: "Province", name: "Boumerdès" }, "DZ-34": { type: "Province", name: "Bordj Bou Arréridj" }, "DZ-33": { type: "Province", name: "Illizi" }, "DZ-32": { type: "Province", name: "El Bayadh" }, "DZ-31": { type: "Province", name: "Oran" }, "DZ-30": { type: "Province", name: "Ouargla" }, "DZ-28": { type: "Province", name: "Msila" }, "DZ-39": { type: "Province", name: "El Oued" }, "DZ-38": { type: "Province", name: "Tissemsilt" }, "DZ-37": { type: "Province", name: "Tindouf" }, "DZ-36": { type: "Province", name: "El Tarf" }, "DZ-22": { type: "Province", name: "Sidi Bel Abbès" }, "DZ-29": { type: "Province", name: "Mascara" }, "DZ-02": { type: "Province", name: "Chlef" }, "DZ-03": { type: "Province", name: "Laghouat" }, "DZ-01": { type: "Province", name: "Adrar" }, "DZ-06": { type: "Province", name: "Béjaïa" }, "DZ-07": { type: "Province", name: "Biskra" }, "DZ-04": { type: "Province", name: "Oum el Bouaghi" }, "DZ-05": { type: "Province", name: "Batna" }, "DZ-20": { type: "Province", name: "Saïda" }, "DZ-21": { type: "Province", name: "Skikda" }, "DZ-08": { type: "Province", name: "Béchar" }, "DZ-09": { type: "Province", name: "Blida" }, "DZ-24": { type: "Province", name: "Guelma" }, "DZ-25": { type: "Province", name: "Constantine" }, "DZ-26": { type: "Province", name: "Médéa" }, "DZ-27": { type: "Province", name: "Mostaganem" }, "DZ-48": { type: "Province", name: "Relizane" }, "DZ-46": { type: "Province", name: "Aïn Témouchent" }, "DZ-47": { type: "Province", name: "Ghardaïa" }, "DZ-44": { type: "Province", name: "Aïn Defla" }, "DZ-45": { type: "Province", name: "Naama" }, "DZ-42": { type: "Province", name: "Tipaza" }, "DZ-43": { type: "Province", name: "Mila" }, "DZ-40": { type: "Province", name: "Khenchela" }, "DZ-41": { type: "Province", name: "Souk Ahras" }, "DZ-23": { type: "Province", name: "Annaba" } } }, US: { name: "United States", sub: { "US-NY": { type: "State", name: "New York" }, "US-PA": { type: "State", name: "Pennsylvania" }, "US-TN": { type: "State", name: "Tennessee" }, "US-VI": { type: "Outlying area", name: "Virgin Islands, U.S." }, "US-NV": { type: "State", name: "Nevada" }, "US-NJ": { type: "State", name: "New Jersey" }, "US-NH": { type: "State", name: "New Hampshire" }, "US-VA": { type: "State", name: "Virginia" }, "US-HI": { type: "State", name: "Hawaii" }, "US-PR": { type: "Outlying area", name: "Puerto Rico" }, "US-NM": { type: "State", name: "New Mexico" }, "US-NC": { type: "State", name: "North Carolina" }, "US-ND": { type: "State", name: "North Dakota" }, "US-NE": { type: "State", name: "Nebraska" }, "US-LA": { type: "State", name: "Louisiana" }, "US-UT": { type: "State", name: "Utah" }, "US-SD": { type: "State", name: "South Dakota" }, "US-DC": { type: "District", name: "District of Columbia" }, "US-DE": { type: "State", name: "Delaware" }, "US-FL": { type: "State", name: "Florida" }, "US-WA": { type: "State", name: "Washington" }, "US-UM": { type: "Outlying area", name: "United States Minor Outlying Islands" }, "US-KS": { type: "State", name: "Kansas" }, "US-WI": { type: "State", name: "Wisconsin" }, "US-OR": { type: "State", name: "Oregon" }, "US-KY": { type: "State", name: "Kentucky" }, "US-ME": { type: "State", name: "Maine" }, "US-OH": { type: "State", name: "Ohio" }, "US-IA": { type: "State", name: "Iowa" }, "US-MD": { type: "State", name: "Maryland" }, "US-ID": { type: "State", name: "Idaho" }, "US-WY": { type: "State", name: "Wyoming" }, "US-VT": { type: "State", name: "Vermont" }, "US-RI": { type: "State", name: "Rhode Island" }, "US-IN": { type: "State", name: "Indiana" }, "US-IL": { type: "State", name: "Illinois" }, "US-AK": { type: "State", name: "Alaska" }, "US-TX": { type: "State", name: "Texas" }, "US-CO": { type: "State", name: "Colorado" }, "US-AR": { type: "State", name: "Arkansas" }, "US-GU": { type: "Outlying area", name: "Guam" }, "US-MA": { type: "State", name: "Massachusetts" }, "US-AL": { type: "State", name: "Alabama" }, "US-MO": { type: "State", name: "Missouri" }, "US-MN": { type: "State", name: "Minnesota" }, "US-WV": { type: "State", name: "West Virginia" }, "US-CA": { type: "State", name: "California" }, "US-OK": { type: "State", name: "Oklahoma" }, "US-MI": { type: "State", name: "Michigan" }, "US-GA": { type: "State", name: "Georgia" }, "US-AZ": { type: "State", name: "Arizona" }, "US-MT": { type: "State", name: "Montana" }, "US-MS": { type: "State", name: "Mississippi" }, "US-SC": { type: "State", name: "South Carolina" }, "US-MP": { type: "Outlying area", name: "Northern Mariana Islands" }, "US-AS": { type: "Outlying area", name: "American Samoa" }, "US-CT": { type: "State", name: "Connecticut" } } }, UY: { name: "Uruguay", sub: { "UY-SO": { type: "Department", name: "Soriano" }, "UY-FD": { type: "Department", name: "Florida" }, "UY-AR": { type: "Department", name: "Artigas" }, "UY-SJ": { type: "Department", name: "San José" }, "UY-RN": { type: "Department", name: "Río Negro" }, "UY-FS": { type: "Department", name: "Flores" }, "UY-PA": { type: "Department", name: "Paysandú" }, "UY-TT": { type: "Department", name: "Treinta y Tres" }, "UY-RO": { type: "Department", name: "Rocha" }, "UY-SA": { type: "Department", name: "Salto" }, "UY-CO": { type: "Department", name: "Colonia" }, "UY-CL": { type: "Department", name: "Cerro Largo" }, "UY-MA": { type: "Department", name: "Maldonado" }, "UY-RV": { type: "Department", name: "Rivera" }, "UY-LA": { type: "Department", name: "Lavalleja" }, "UY-MO": { type: "Department", name: "Montevideo" }, "UY-DU": { type: "Department", name: "Durazno" }, "UY-CA": { type: "Department", name: "Canelones" }, "UY-TA": { type: "Department", name: "Tacuarembó" } } }, YT: { name: "Mayotte", sub: { "YT-YT": { type: "Country", name: "Mayotte" } } }, UM: { name: "United States Minor Outlying Islands", sub: { "UM-76": { type: "Islands, groups of islands", name: "Navassa Island" }, "UM-71": { type: "Islands, groups of islands", name: "Midway Islands" }, "UM-67": { type: "Islands, groups of islands", name: "Johnston Atoll" }, "UM-86": { type: "Islands, groups of islands", name: "Jarvis Island" }, "UM-84": { type: "Islands, groups of islands", name: "Howland Island" }, "UM-89": { type: "Islands, groups of islands", name: "Kingman Reef" }, "UM-79": { type: "Islands, groups of islands", name: "Wake Island" }, "UM-81": { type: "Islands, groups of islands", name: "Baker Island" }, "UM-95": { type: "Islands, groups of islands", name: "Palmyra Atoll" } } }, LB: { name: "Lebanon", sub: { "LB-JA": { type: "Governorate", name: "Al Janūb" }, "LB-AS": { type: "Governorate", name: "Ash Shimāl" }, "LB-JL": { type: "Governorate", name: "Jabal Lubnān" }, "LB-BH": { type: "Governorate", name: "Baalbek-Hermel" }, "LB-BI": { type: "Governorate", name: "Al Biqā‘" }, "LB-BA": { type: "Governorate", name: "Bayrūt" }, "LB-AK": {
      type: "Governorate",
      name: "Aakkâr"
    }, "LB-NA": { type: "Governorate", name: "An Nabaţīyah" } } }, LC: { name: "Saint Lucia", sub: { "LC-11": { type: "District", name: "Vieux Fort" }, "LC-12": { type: "District", name: "Canaries" }, "LC-10": { type: "District", name: "Soufrière" }, "LC-08": { type: "District", name: "Micoud" }, "LC-05": { type: "District", name: "Dennery" }, "LC-07": { type: "District", name: "Laborie" }, "LC-06": { type: "District", name: "Gros Islet" }, "LC-01": { type: "District", name: "Anse la Raye" }, "LC-03": { type: "District", name: "Choiseul" }, "LC-02": { type: "District", name: "Castries" } } }, LA: { name: "Laos", sub: { "LA-HO": { type: "Province", name: "Houaphan" }, "LA-VT": { type: "Prefecture", name: "Vientiane" }, "LA-CH": { type: "Province", name: "Champasak" }, "LA-OU": { type: "Province", name: "Oudomsai" }, "LA-AT": { type: "Province", name: "Attapu" }, "LA-BL": { type: "Province", name: "Bolikhamxai" }, "LA-SL": { type: "Province", name: "Salavan" }, "LA-KH": { type: "Province", name: "Khammouan" }, "LA-LP": { type: "Province", name: "Louangphabang" }, "LA-SV": { type: "Province", name: "Savannakhét" }, "LA-BK": { type: "Province", name: "Bokèo" }, "LA-PH": { type: "Province", name: "Phôngsali" }, "LA-XN": { type: "Special zone", name: "Xaisômboun" }, "LA-LM": { type: "Province", name: "Louang Namtha" }, "LA-XI": { type: "Province", name: "Xiangkhouang" }, "LA-XE": { type: "Province", name: "Sékong" }, "LA-VI": { type: "Province", name: "Vientiane" }, "LA-XA": { type: "Province", name: "Sayaboury" } } }, TV: { name: "Tuvalu", sub: { "TV-NKL": { type: "Island council", name: "Nukulaelae" }, "TV-NKF": { type: "Island council", name: "Nukufetau" }, "TV-VAI": { type: "Island council", name: "Vaitupu" }, "TV-FUN": { type: "Town council", name: "Funafuti" }, "TV-NIT": { type: "Island council", name: "Niutao" }, "TV-NMG": { type: "Island council", name: "Nanumanga" }, "TV-NUI": { type: "Island council", name: "Nui" }, "TV-NMA": { type: "Island council", name: "Nanumea" } } }, TW: { name: "Taiwan", sub: { "TW-ILA": { type: "District", name: "Ilan" }, "TW-YUN": { type: "District", name: "Yunlin" }, "TW-NAN": { type: "District", name: "Nantou" }, "TW-TNQ": { type: "District", name: "Tainan" }, "TW-TNN": { type: "Municipality", name: "Tainan" }, "TW-KEE": { type: "Municipality", name: "Keelung" }, "TW-CHA": { type: "District", name: "Changhua" }, "TW-TPE": { type: "Special municipality", name: "Taipei" }, "TW-HUA": { type: "District", name: "Hualien" }, "TW-TXG": { type: "Municipality", name: "Taichung" }, "TW-TAO": { type: "District", name: "Taoyuan" }, "TW-PIF": { type: "District", name: "Pingtung" }, "TW-KHH": { type: "Special municipality", name: "Kaohsiung" }, "TW-PEN": { type: "District", name: "Penghu" }, "TW-CYI": { type: "Municipality", name: "Chiayi" }, "TW-TXQ": { type: "District", name: "Taichung" }, "TW-MIA": { type: "District", name: "Miaoli" }, "TW-HSQ": { type: "District", name: "Hsinchu" }, "TW-CYQ": { type: "District", name: "Chiayi" }, "TW-TPQ": { type: "District", name: "Taipei" }, "TW-KHQ": { type: "District", name: "Kaohsiung" }, "TW-HSZ": { type: "Municipality", name: "Hsinchu" }, "TW-TTT": { type: "District", name: "Taitung" } } }, TT: { name: "Trinidad and Tobago", sub: { "TT-SJL": { type: "Region", name: "San Juan-Laventille" }, "TT-ETO": { type: "Region", name: "Eastern Tobago" }, "TT-SGE": { type: "Region", name: "Sangre Grande" }, "TT-PTF": { type: "Municipality", name: "Point Fortin" }, "TT-RCM": { type: "Region", name: "Rio Claro-Mayaro" }, "TT-WTO": { type: "Region", name: "Western Tobago" }, "TT-PRT": { type: "Region", name: "Princes Town" }, "TT-POS": { type: "Municipality", name: "Port of Spain" }, "TT-CTT": { type: "Region", name: "Couva-Tabaquite-Talparo" }, "TT-CHA": { type: "Municipality", name: "Chaguanas" }, "TT-ARI": { type: "Municipality", name: "Arima" }, "TT-SIP": { type: "Region", name: "Siparia" }, "TT-PED": { type: "Region", name: "Penal-Debe" }, "TT-SFO": { type: "Municipality", name: "San Fernando" }, "TT-DMN": { type: "Region", name: "Diego Martin" }, "TT-TUP": { type: "Region", name: "Tunapuna-Piarco" } } }, TR: { name: "Turkey", sub: { "TR-61": { type: "Province", name: "Trabzon" }, "TR-73": { type: "Province", name: "Şırnak" }, "TR-62": { type: "Province", name: "Tunceli" }, "TR-77": { type: "Province", name: "Yalova" }, "TR-54": { type: "Province", name: "Sakarya" }, "TR-60": { type: "Province", name: "Tokat" }, "TR-37": { type: "Province", name: "Kastamonu" }, "TR-36": { type: "Province", name: "Kars" }, "TR-35": { type: "Province", name: "İzmir" }, "TR-34": { type: "Province", name: "İstanbul" }, "TR-33": { type: "Province", name: "Mersin" }, "TR-32": { type: "Province", name: "Isparta" }, "TR-31": { type: "Province", name: "Hatay" }, "TR-30": { type: "Province", name: "Hakkâri" }, "TR-68": { type: "Province", name: "Aksaray" }, "TR-55": { type: "Province", name: "Samsun" }, "TR-63": { type: "Province", name: "Şanlıurfa" }, "TR-44": { type: "Province", name: "Malatya" }, "TR-39": { type: "Province", name: "Kırklareli" }, "TR-38": { type: "Province", name: "Kayseri" }, "TR-19": { type: "Province", name: "Çorum" }, "TR-18": { type: "Province", name: "Çankırı" }, "TR-57": { type: "Province", name: "Sinop" }, "TR-45": { type: "Province", name: "Manisa" }, "TR-51": { type: "Province", name: "Niğde" }, "TR-50": { type: "Province", name: "Nevşehir" }, "TR-53": { type: "Province", name: "Rize" }, "TR-52": { type: "Province", name: "Ordu" }, "TR-11": { type: "Province", name: "Bilecik" }, "TR-10": { type: "Province", name: "Balıkesir" }, "TR-13": { type: "Province", name: "Bitlis" }, "TR-12": { type: "Province", name: "Bingöl" }, "TR-15": { type: "Province", name: "Burdur" }, "TR-14": { type: "Province", name: "Bolu" }, "TR-17": { type: "Province", name: "Çanakkale" }, "TR-16": { type: "Province", name: "Bursa" }, "TR-48": { type: "Province", name: "Muğla" }, "TR-75": { type: "Province", name: "Ardahan" }, "TR-76": { type: "Province", name: "Iğdır" }, "TR-69": { type: "Province", name: "Bayburt" }, "TR-78": { type: "Province", name: "Karabük" }, "TR-74": { type: "Province", name: "Bartın" }, "TR-72": { type: "Province", name: "Batman" }, "TR-49": { type: "Province", name: "Muş" }, "TR-64": { type: "Province", name: "Uşak" }, "TR-80": { type: "Province", name: "Osmaniye" }, "TR-81": { type: "Province", name: "Düzce" }, "TR-67": { type: "Province", name: "Zonguldak" }, "TR-56": { type: "Province", name: "Siirt" }, "TR-65": { type: "Province", name: "Van" }, "TR-70": { type: "Province", name: "Karaman" }, "TR-71": { type: "Province", name: "Kırıkkale" }, "TR-79": { type: "Province", name: "Kilis" }, "TR-20": { type: "Province", name: "Denizli" }, "TR-21": { type: "Province", name: "Diyarbakır" }, "TR-22": { type: "Province", name: "Edirne" }, "TR-23": { type: "Province", name: "Elazığ" }, "TR-24": { type: "Province", name: "Erzincan" }, "TR-25": { type: "Province", name: "Erzurum" }, "TR-26": { type: "Province", name: "Eskişehir" }, "TR-27": { type: "Province", name: "Gaziantep" }, "TR-28": { type: "Province", name: "Giresun" }, "TR-29": { type: "Province", name: "Gümüşhane" }, "TR-59": { type: "Province", name: "Tekirdağ" }, "TR-58": { type: "Province", name: "Sivas" }, "TR-46": { type: "Province", name: "Kahramanmaraş" }, "TR-47": { type: "Province", name: "Mardin" }, "TR-08": { type: "Province", name: "Artvin" }, "TR-09": { type: "Province", name: "Aydın" }, "TR-42": { type: "Province", name: "Konya" }, "TR-43": { type: "Province", name: "Kütahya" }, "TR-40": { type: "Province", name: "Kırşehir" }, "TR-41": { type: "Province", name: "Kocaeli" }, "TR-02": { type: "Province", name: "Adıyaman" }, "TR-03": { type: "Province", name: "Afyonkarahisar" }, "TR-66": { type: "Province", name: "Yozgat" }, "TR-01": { type: "Province", name: "Adana" }, "TR-06": { type: "Province", name: "Ankara" }, "TR-07": { type: "Province", name: "Antalya" }, "TR-04": { type: "Province", name: "Ağrı" }, "TR-05": { type: "Province", name: "Amasya" } } }, LK: { name: "Sri Lanka", sub: { "LK-23": { type: "District", name: "Nuvara Ĕliya" }, "LK-22": { type: "District", name: "Matale" }, "LK-21": { type: "District", name: "Kandy" }, "LK-41": { type: "District", name: "Jaffna" }, "LK-43": { type: "District", name: "Mannar" }, "LK-42": { type: "District", name: "Kilinochchi" }, "LK-45": { type: "District", name: "Mulativ" }, "LK-44": { type: "District", name: "Vavuniya" }, "LK-4": { type: "Province", name: "Northern Province" }, "LK-5": { type: "Province", name: "Eastern Province" }, "LK-6": { type: "Province", name: "North Western Province" }, "LK-7": { type: "Province", name: "North Central Province" }, "LK-1": { type: "Province", name: "Basnāhira paḷāta" }, "LK-2": { type: "Province", name: "Central Province" }, "LK-3": { type: "Province", name: "Dakuṇu paḷāta" }, "LK-8": { type: "Province", name: "Ūvā mākāṇam" }, "LK-9": { type: "Province", name: "Chappirakamuva mākāṇam" }, "LK-71": { type: "District", name: "Anuradhapura" }, "LK-72": { type: "District", name: "Pŏlaṉṉaṛuvai" }, "LK-92": { type: "District", name: "Kægalla" }, "LK-91": { type: "District", name: "Irattiṉapuri" }, "LK-12": { type: "District", name: "Gampaha" }, "LK-13": { type: "District", name: "Kalutara" }, "LK-11": { type: "District", name: "Colombo" }, "LK-52": { type: "District", name: "Ampara" }, "LK-53": { type: "District", name: "Tirukŏṇamalai" }, "LK-51": { type: "District", name: "Batticaloa" }, "LK-31": { type: "District", name: "Gālla" }, "LK-32": { type: "District", name: "Matara" }, "LK-33": { type: "District", name: "Ampāntōṭṭai" }, "LK-62": { type: "District", name: "Puttalam" }, "LK-61": { type: "District", name: "Kuruṇægala" }, "LK-81": { type: "District", name: "Badulla" }, "LK-82": { type: "District", name: "Monaragala" } } }, LI: { name: "Liechtenstein", sub: { "LI-11": { type: "Commune", name: "Vaduz" }, "LI-10": { type: "Commune", name: "Triesenberg" }, "LI-09": { type: "Commune", name: "Triesen" }, "LI-08": { type: "Commune", name: "Schellenberg" }, "LI-07": { type: "Commune", name: "Schaan" }, "LI-06": { type: "Commune", name: "Ruggell" }, "LI-05": { type: "Commune", name: "Planken" }, "LI-04": { type: "Commune", name: "Mauren" }, "LI-03": { type: "Commune", name: "Gamprin" }, "LI-02": { type: "Commune", name: "Eschen" }, "LI-01": { type: "Commune", name: "Balzers" } } }, LV: { name: "Latvia", sub: { "LV-DGV": { type: "Republican city", name: "Daugavpils" }, "LV-078": { type: "Municipality", name: "Riebiņu novads" }, "LV-079": { type: "Municipality", name: "Rojas novads" }, "LV-072": { type: "Municipality", name: "Pļaviņu novads" }, "LV-073": { type: "Municipality", name: "Preiļu novads" }, "LV-070": { type: "Municipality", name: "Pārgaujas novads" }, "LV-071": { type: "Municipality", name: "Pāvilostas novads" }, "LV-076": { type: "Municipality", name: "Raunas novads" }, "LV-077": { type: "Municipality", name: "Rēzeknes novads" }, "LV-074": { type: "Municipality", name: "Priekules novads" }, "LV-075": { type: "Municipality", name: "Priekuļu novads" }, "LV-106": { type: "Municipality", name: "Ventspils novads" }, "LV-107": { type: "Municipality", name: "Viesītes novads" }, "LV-JEL": { type: "Republican city", name: "Jelgava" }, "LV-069": { type: "Municipality", name: "Ozolnieku novads" }, "LV-068": { type: "Municipality", name: "Olaines novads" }, "LV-104": { type: "Municipality", name: "Vecpiebalgas novads" }, "LV-105": { type: "Municipality", name: "Vecumnieku novads" }, "LV-102": { type: "Municipality", name: "Varakļānu novads" }, "LV-103": { type: "Municipality", name: "Vārkavas novads" }, "LV-100": { type: "Municipality", name: "Vaiņodes novads" }, "LV-101": { type: "Municipality", name: "Valkas novads" }, "LV-061": { type: "Municipality", name: "Mālpils novads" }, "LV-060": { type: "Municipality", name: "Mazsalacas novads" }, "LV-063": { type: "Municipality", name: "Mērsraga novads" }, "LV-062": { type: "Municipality", name: "Mārupes novads" }, "LV-065": { type: "Municipality", name: "Neretas novads" }, "LV-064": { type: "Municipality", name: "Naukšēnu novads" }, "LV-067": { type: "Municipality", name: "Ogres novads" }, "LV-066": { type: "Municipality", name: "Nīcas novads" }, "LV-LPX": { type: "Republican city", name: "Liepāja" }, "LV-VEN": { type: "Republican city", name: "Ventspils" }, "LV-054": { type: "Municipality", name: "Limbažu novads" }, "LV-055": { type: "Municipality", name: "Līgatnes novads" }, "LV-056": { type: "Municipality", name: "Līvānu novads" }, "LV-057": { type: "Municipality", name: "Lubānas novads" }, "LV-050": { type: "Municipality", name: "Kuldīgas novads" }, "LV-051": { type: "Municipality", name: "Ķeguma novads" }, "LV-052": { type: "Municipality", name: "Ķekavas novads" }, "LV-053": { type: "Municipality", name: "Lielvārdes novads" }, "LV-REZ": { type: "Republican city", name: "Rēzekne" }, "LV-109": { type: "Municipality", name: "Viļānu novads" }, "LV-058": { type: "Municipality", name: "Ludzas novads" }, "LV-059": { type: "Municipality", name: "Madonas novads" }, "LV-110": { type: "Municipality", name: "Zilupes novads" }, "LV-VMR": { type: "Republican city", name: "Valmiera" }, "LV-043": { type: "Municipality", name: "Kandavas novads" }, "LV-042": { type: "Municipality", name: "Jēkabpils novads" }, "LV-041": { type: "Municipality", name: "Jelgavas novads" }, "LV-040": { type: "Municipality", name: "Jaunpils novads" }, "LV-047": { type: "Municipality", name: "Krāslavas novads" }, "LV-046": { type: "Municipality", name: "Kokneses novads" }, "LV-045": { type: "Municipality", name: "Kocēnu novads" }, "LV-044": { type: "Municipality", name: "Kārsavas novads" }, "LV-049": { type: "Municipality", name: "Krustpils novads" }, "LV-048": { type: "Municipality", name: "Krimuldas novads" }, "LV-036": { type: "Municipality", name: "Ilūkstes novads" }, "LV-037": { type: "Municipality", name: "Inčukalna novads" }, "LV-034": { type: "Municipality", name: "Iecavas novads" }, "LV-035": { type: "Municipality", name: "Ikšķiles novads" }, "LV-032": { type: "Municipality", name: "Grobiņas novads" }, "LV-033": { type: "Municipality", name: "Gulbenes novads" }, "LV-030": { type: "Municipality", name: "Ērgļu novads" }, "LV-031": { type: "Municipality", name: "Garkalnes novads" }, "LV-038": { type: "Municipality", name: "Jaunjelgavas novads" }, "LV-039": { type: "Municipality", name: "Jaunpiebalgas novads" }, "LV-025": { type: "Municipality", name: "Daugavpils novads" }, "LV-024": { type: "Municipality", name: "Dagdas novads" }, "LV-027": { type: "Municipality", name: "Dundagas novads" }, "LV-026": { type: "Municipality", name: "Dobeles novads" }, "LV-021": { type: "Municipality", name: "Cesvaines novads" }, "LV-020": { type: "Municipality", name: "Carnikavas novads" }, "LV-023": { type: "Municipality", name: "Ciblas novads" }, "LV-022": { type: "Municipality", name: "Cēsu novads" }, "LV-029": { type: "Municipality", name: "Engures novads" }, "LV-028": { type: "Municipality", name: "Durbes novads" }, "LV-108": { type: "Municipality", name: "Viļakas novads" }, "LV-JKB": { type: "Republican city", name: "Jēkabpils" }, "LV-098": { type: "Municipality", name: "Tērvetes novads" }, "LV-099": { type: "Municipality", name: "Tukuma novads" }, "LV-090": { type: "Municipality", name: "Sējas novads" }, "LV-091": { type: "Municipality", name: "Siguldas novads" }, "LV-092": { type: "Municipality", name: "Skrīveru novads" }, "LV-093": { type: "Municipality", name: "Skrundas novads" }, "LV-094": { type: "Municipality", name: "Smiltenes novads" }, "LV-095": { type: "Municipality", name: "Stopiņu novads" }, "LV-096": { type: "Municipality", name: "Strenču novads" }, "LV-097": { type: "Municipality", name: "Talsu novads" }, "LV-010": { type: "Municipality", name: "Auces novads" }, "LV-011": { type: "Municipality", name: "Ādažu novads" }, "LV-012": { type: "Municipality", name: "Babītes novads" }, "LV-013": { type: "Municipality", name: "Baldones novads" }, "LV-014": { type: "Municipality", name: "Baltinavas novads" }, "LV-015": { type: "Municipality", name: "Balvu novads" }, "LV-016": { type: "Municipality", name: "Bauskas novads" }, "LV-017": { type: "Municipality", name: "Beverīnas novads" }, "LV-018": { type: "Municipality", name: "Brocēnu novads" }, "LV-019": { type: "Municipality", name: "Burtnieku novads" }, "LV-JUR": { type: "Republican city", name: "Jūrmala" }, "LV-087": { type: "Municipality", name: "Salaspils novads" }, "LV-086": { type: "Municipality", name: "Salacgrīvas novads" }, "LV-085": { type: "Municipality", name: "Salas novads" }, "LV-084": { type: "Municipality", name: "Rūjienas novads" }, "LV-083": { type: "Municipality", name: "Rundāles novads" }, "LV-082": { type: "Municipality", name: "Rugāju novads" }, "LV-081": { type: "Municipality", name: "Rucavas novads" }, "LV-080": { type: "Municipality", name: "Ropažu novads" }, "LV-089": { type: "Municipality", name: "Saulkrastu novads" }, "LV-088": { type: "Municipality", name: "Saldus novads" }, "LV-009": { type: "Municipality", name: "Apes novads" }, "LV-008": { type: "Municipality", name: "Amatas novads" }, "LV-007": { type: "Municipality", name: "Alūksnes novads" }, "LV-006": { type: "Municipality", name: "Alsungas novads" }, "LV-005": { type: "Municipality", name: "Alojas novads" }, "LV-004": { type: "Municipality", name: "Aknīstes novads" }, "LV-003": { type: "Municipality", name: "Aizputes novads" }, "LV-002": { type: "Municipality", name: "Aizkraukles novads" }, "LV-001": { type: "Municipality", name: "Aglonas novads" }, "LV-RIX": { type: "Republican city", name: "Rīga" } } }, TO: { name: "Tonga", sub: { "TO-01": { type: "Division", name: "'Eua" }, "TO-03": { type: "Division", name: "Niuas" }, "TO-02": { type: "Division", name: "Ha'apai" }, "TO-05": { type: "Division", name: "Vava'u" }, "TO-04": { type: "Division", name: "Tongatapu" } } }, LT: { name: "Lithuania", sub: { "LT-MR": { type: "County", name: "Marijampolės apskritis" }, "LT-TA": { type: "County", name: "Tauragės apskritis" }, "LT-56": { type: "District municipality", name: "Vilkaviškis" }, "LT-41": { type: "District municipality", name: "Šakiai" }, "LT-KL": { type: "County", name: "Klaipėdos apskritis" }, "LT-52": { type: "District municipality", name: "Trakai" }, "LT-53": { type: "District municipality", name: "Ukmergė" }, "LT-01": { type: "District municipality", name: "Akmenė" }, "LT-02": { type: "City municipality", name: "Alytaus miestas" }, "LT-03": { type: "District municipality", name: "Alytus" }, "LT-04": { type: "District municipality", name: "Anykščiai" }, "LT-05": { type: "Municipality", name: "Birštono" }, "LT-06": { type: "District municipality", name: "Biržai" }, "LT-07": { type: "Municipality", name: "Druskininkai" }, "LT-08": { type: "Municipality", name: "Elektrénai" }, "LT-09": { type: "District municipality", name: "Ignalina" }, "LT-KU": { type: "County", name: "Kauno apskritis" }, "LT-28": { type: "Municipality", name: "Neringa" }, "LT-29": { type: "Municipality", name: "Pagégiai" }, "LT-48": { type: "District municipality", name: "Skuodas" }, "LT-49": { type: "District municipality", name: "Švenčionys" }, "LT-60": { type: "District municipality", name: "Zarasai" }, "LT-UT": { type: "County", name: "Utenos apskritis" }, "LT-22": { type: "District municipality", name: "Kretinga" }, "LT-23": { type: "District municipality", name: "Kupiškis" }, "LT-20": { type: "City municipality", name: "Klaipėdos miestas" }, "LT-21": { type: "District municipality", name: "Klaipėda" }, "LT-26": { type: "District municipality", name: "Mažeikiai" }, "LT-27": { type: "District municipality", name: "Molėtai" }, "LT-24": { type: "District municipality", name: "Lazdijai" }, "LT-25": { type: "District municipality", name: "Marijampolė" }, "LT-58": { type: "District municipality", name: "Vilnius" }, "LT-PN": { type: "County", name: "Panevėžio apskritis" }, "LT-54": { type: "District municipality", name: "Utena" }, "LT-43": { type: "City municipality", name: "Šiaulių miestas" }, "LT-59": { type: "Municipality", name: "Visaginas" }, "LT-45": { type: "District municipality", name: "Šilalė" }, "LT-47": { type: "District municipality", name: "Širvintos" }, "LT-46": { type: "District municipality", name: "Šilutė" }, "LT-17": { type: "Municipality", name: "Kazlų Rūdos" }, "LT-16": { type: "District municipality", name: "Kaunas" }, "LT-15": { type: "City municipality", name: "Kauno miestas" }, "LT-14": { type: "Municipality", name: "Kalvarijos" }, "LT-13": { type: "District municipality", name: "Kaišiadorys" }, "LT-12": { type: "District municipality", name: "Jurbarkas" }, "LT-11": { type: "District municipality", name: "Joniškis" }, "LT-10": { type: "District municipality", name: "Jonava" }, "LT-TE": { type: "County", name: "Telšių apskritis" }, "LT-40": { type: "District municipality", name: "Rokiškis" }, "LT-VL": { type: "County", name: "Vilniaus apskritis" }, "LT-AL": { type: "County", name: "Alytaus apskritis" }, "LT-SA": { type: "County", name: "Šiaulių apskritis" }, "LT-19": { type: "District municipality", name: "Kelmė" }, "LT-18": { type: "District municipality", name: "Kėdainiai" }, "LT-39": { type: "Municipality", name: "Rietavo" }, "LT-38": { type: "District municipality", name: "Raseiniai" }, "LT-51": { type: "District municipality", name: "Telšiai" }, "LT-50": { type: "District municipality", name: "Tauragė" }, "LT-57": { type: "City municipality", name: "Vilniaus miestas" }, "LT-42": { type: "District municipality", name: "Šalčininkai" }, "LT-55": { type: "District municipality", name: "Varėna" }, "LT-44": { type: "District municipality", name: "Šiauliai" }, "LT-31": { type: "City municipality", name: "Palangos miestas" }, "LT-30": { type: "District municipality", name: "Pakruojis" }, "LT-33": { type: "District municipality", name: "Panevėžys" }, "LT-32": { type: "City municipality", name: "Panevėžio miestas" }, "LT-35": { type: "District municipality", name: "Plungė" }, "LT-34": { type: "District municipality", name: "Pasvalys" }, "LT-37": { type: "District municipality", name: "Radviliškis" }, "LT-36": { type: "District municipality", name: "Prienai" } } }, LU: { name: "Luxembourg", sub: { "LU-G": { type: "District", name: "Grevenmacher" }, "LU-D": { type: "District", name: "Diekirch" }, "LU-L": { type: "District", name: "Lëtzebuerg" } } }, LR: { name: "Liberia", sub: { "LR-CM": { type: "County", name: "Grand Cape Mount" }, "LR-BM": { type: "County", name: "Bomi" }, "LR-MY": { type: "County", name: "Maryland" }, "LR-LO": { type: "County", name: "Lofa" }, "LR-MO": { type: "County", name: "Montserrado" }, "LR-GP": { type: "County", name: "Gbarpolu" }, "LR-MG": { type: "County", name: "Margibi" }, "LR-BG": { type: "County", name: "Bong" }, "LR-GK": { type: "County", name: "Grand Kru" }, "LR-RI": { type: "County", name: "Rivercess" }, "LR-SI": { type: "County", name: "Sinoe" }, "LR-GB": { type: "County", name: "Grand Bassa" }, "LR-RG": { type: "County", name: "River Gee" }, "LR-GG": { type: "County", name: "Grand Gedeh" }, "LR-NI": { type: "County", name: "Nimba" } } }, LS: { name: "Lesotho", sub: { "LS-H": { type: "District", name: "Qacha's Nek" }, "LS-J": { type: "District", name: "Mokhotlong" }, "LS-K": { type: "District", name: "Thaba-Tseka" }, "LS-D": { type: "District", name: "Berea" }, "LS-E": { type: "District", name: "Mafeteng" }, "LS-F": { type: "District", name: "Mohale's Hoek" }, "LS-G": { type: "District", name: "Quthing" }, "LS-A": { type: "District", name: "Maseru" }, "LS-B": { type: "District", name: "Butha-Buthe" }, "LS-C": { type: "District", name: "Leribe" } } }, TH: { name: "Thailand", sub: { "TH-57": { type: "Province", name: "Chiang Rai" }, "TH-56": { type: "Province", name: "Phayao" }, "TH-55": { type: "Province", name: "Nan" }, "TH-54": { type: "Province", name: "Phrae" }, "TH-53": { type: "Province", name: "Uttaradit" }, "TH-33": { type: "Province", name: "Si Sa Ket" }, "TH-51": { type: "Province", name: "Lamphun" }, "TH-50": { type: "Province", name: "Chiang Mai" }, "TH-90": { type: "Province", name: "Songkhla" }, "TH-92": { type: "Province", name: "Trang" }, "TH-91": { type: "Province", name: "Satun" }, "TH-32": { type: "Province", name: "Surin" }, "TH-96": { type: "Province", name: "Narathiwat" }, "TH-95": { type: "Province", name: "Yala" }, "TH-58": { type: "Province", name: "Mae Hong Son" }, "TH-13": { type: "Province", name: "Pathum Thani" }, "TH-12": { type: "Province", name: "Nonthaburi" }, "TH-11": { type: "Province", name: "Samut Prakan" }, "TH-10": { type: "Metropolitan administration", name: "Krung Thep Maha Nakhon" }, "TH-31": { type: "Province", name: "Buri Ram" }, "TH-30": { type: "Province", name: "Nakhon Ratchasima" }, "TH-15": { type: "Province", name: "Ang Thong" }, "TH-14": { type: "Province", name: "Phra Nakhon Si Ayutthaya" }, "TH-71": { type: "Province", name: "Kanchanaburi" }, "TH-70": { type: "Province", name: "Ratchaburi" }, "TH-19": { type: "Province", name: "Saraburi" }, "TH-18": { type: "Province", name: "Chai Nat" }, "TH-39": { type: "Province", name: "Nong Bua Lam Phu" }, "TH-38": { type: "Province", name: "Bueng Kan" }, "TH-77": { type: "Province", name: "Prachuap Khiri Khan" }, "TH-52": { type: "Province", name: "Lampang" }, "TH-72": { type: "Province", name: "Suphan Buri" }, "TH-75": { type: "Province", name: "Samut Songkhram" }, "TH-93": { type: "Province", name: "Phatthalung" }, "TH-74": { type: "Province", name: "Samut Sakhon" }, "TH-84": { type: "Province", name: "Surat Thani" }, "TH-85": { type: "Province", name: "Ranong" }, "TH-86": { type: "Province", name: "Chumphon" }, "TH-S": { type: "Special administrative city", name: "Phatthaya" }, "TH-80": { type: "Province", name: "Nakhon Si Thammarat" }, "TH-81": { type: "Province", name: "Krabi" }, "TH-82": { type: "Province", name: "Phangnga" }, "TH-83": { type: "Province", name: "Phuket" }, "TH-76": { type: "Province", name: "Phetchaburi" }, "TH-40": { type: "Province", name: "Khon Kaen" }, "TH-41": { type: "Province", name: "Udon Thani" }, "TH-42": { type: "Province", name: "Loei" }, "TH-43": { type: "Province", name: "Nong Khai" }, "TH-44": { type: "Province", name: "Maha Sarakham" }, "TH-45": { type: "Province", name: "Roi Et" }, "TH-46": { type: "Province", name: "Kalasin" }, "TH-47": { type: "Province", name: "Sakon Nakhon" }, "TH-48": { type: "Province", name: "Nakhon Phanom" }, "TH-49": { type: "Province", name: "Mukdahan" }, "TH-26": { type: "Province", name: "Nakhon Nayok" }, "TH-27": { type: "Province", name: "Sa Kaeo" }, "TH-24": { type: "Province", name: "Chachoengsao" }, "TH-25": { type: "Province", name: "Prachin Buri" }, "TH-22": { type: "Province", name: "Chanthaburi" }, "TH-23": { type: "Province", name: "Trat" }, "TH-20": { type: "Province", name: "Chon Buri" }, "TH-21": { type: "Province", name: "Rayong" }, "TH-62": { type: "Province", name: "Kamphaeng Phet" }, "TH-63": { type: "Province", name: "Tak" }, "TH-60": { type: "Province", name: "Nakhon Sawan" }, "TH-61": { type: "Province", name: "Uthai Thani" }, "TH-66": { type: "Province", name: "Phichit" }, "TH-67": { type: "Province", name: "Phetchabun" }, "TH-64": { type: "Province", name: "Sukhothai" }, "TH-65": { type: "Province", name: "Phitsanulok" }, "TH-35": { type: "Province", name: "Yasothon" }, "TH-34": { type: "Province", name: "Ubon Ratchathani" }, "TH-37": { type: "Province", name: "Amnat Charoen" }, "TH-73": { type: "Province", name: "Nakhon Pathom" }, "TH-36": { type: "Province", name: "Chaiyaphum" }, "TH-17": { type: "Province", name: "Sing Buri" }, "TH-94": { type: "Province", name: "Pattani" }, "TH-16": { type: "Province", name: "Lop Buri" } } }, TF: { name: "French Southern Territories", sub: { "TF-TF": { type: "Country", name: "French Southern Territories" } } }, TG: { name: "Togo", sub: { "TG-P": { type: "Region", name: "Plateaux" }, "TG-S": { type: "Region", name: "Savannes" }, "TG-C": { type: "Region", name: "Centre" }, "TG-M": { type: "Region", name: "Maritime" }, "TG-K": { type: "Region", name: "Kara" } } }, TD: { name: "Chad", sub: { "TD-ND": { type: "Region", name: "Madīnat Injamīnā" }, "TD-LO": { type: "Region", name: "Logone-Occidental" }, "TD-WF": { type: "Region", name: "Wadi Fira" }, "TD-LC": { type: "Region", name: "Al Buḩayrah" }, "TD-SA": { type: "Region", name: "Salamat" }, "TD-SI": { type: "Region", name: "Sila" }, "TD-HL": { type: "Region", name: "Hadjer Lamis" }, "TD-LR": { type: "Region", name: "Logone-Oriental" }, "TD-BA": { type: "Region", name: "Al Baţḩah" }, "TD-BG": { type: "Region", name: "Baḩr al Ghazāl" }, "TD-BO": { type: "Region", name: "Borkou" }, "TD-MC": { type: "Region", name: "Moyen-Chari" }, "TD-OD": { type: "Region", name: "Ouaddaï" }, "TD-MA": { type: "Region", name: "Mandoul" }, "TD-ME": { type: "Region", name: "Mayo-Kebbi-Est" }, "TD-KA": { type: "Region", name: "Kanem" }, "TD-MO": { type: "Region", name: "Mayo-Kebbi-Ouest" }, "TD-GR": { type: "Region", name: "Guéra" }, "TD-EO": { type: "Region", name: "Ennedi-Ouest" }, "TD-TA": { type: "Region", name: "Tandjilé" }, "TD-TI": { type: "Region", name: "Tibastī" }, "TD-EE": { type: "Region", name: "Ennedi-Est" }, "TD-CB": { type: "Region", name: "Chari-Baguirmi" } } }, TC: { name: "Turks & Caicos Islands", sub: { "TC-TC": { type: "Country", name: "Turks & Caicos Islands" } } }, LY: { name: "Libya", sub: { "LY-JI": { type: "Popularate", name: "Al Jifārah" }, "LY-SR": { type: "Popularate", name: "Surt" }, "LY-JA": { type: "Popularate", name: "Al Jabal al Akhḑar" }, "LY-DR": { type: "Popularate", name: "Darnah" }, "LY-WD": { type: "Popularate", name: "Wādī al Ḩayāt" }, "LY-JG": { type: "Popularate", name: "Al Jabal al Gharbī" }, "LY-WA": { type: "Popularate", name: "Al Wāḩāt" }, "LY-SB": { type: "Popularate", name: "Sabhā" }, "LY-NQ": { type: "Popularate", name: "An Nuqāţ al Khams" }, "LY-JU": { type: "Popularate", name: "Al Jufrah" }, "LY-WS": { type: "Popularate", name: "Wādī ash Shāţi’" }, "LY-BA": { type: "Popularate", name: "Banghāzī" }, "LY-BU": { type: "Popularate", name: "Al Buţnān" }, "LY-NL": { type: "Popularate", name: "Nālūt" }, "LY-ZA": { type: "Popularate", name: "Az Zāwiyah" }, "LY-MI": { type: "Popularate", name: "Mişrātah" }, "LY-MJ": { type: "Popularate", name: "Al Marj" }, "LY-TB": { type: "Popularate", name: "Ţarābulus" }, "LY-GT": { type: "Popularate", name: "Ghāt" }, "LY-KF": { type: "Popularate", name: "Al Kufrah" }, "LY-MB": { type: "Popularate", name: "Al Marqab" }, "LY-MQ": { type: "Popularate", name: "Murzuq" } } }, VA: { name: "Vatican City", sub: { "VA-VA": { type: "Country", name: "Vatican City" } } }, VC: { name: "Saint Vincent And The Grenadines", sub: { "VC-03": { type: "Parish", name: "Saint David" }, "VC-02": { type: "Parish", name: "Saint Andrew" }, "VC-01": { type: "Parish", name: "Charlotte" }, "VC-06": { type: "Parish", name: "Grenadines" }, "VC-05": { type: "Parish", name: "Saint Patrick" }, "VC-04": { type: "Parish", name: "Saint George" } } }, AE: { name: "United Arab Emirates", sub: { "AE-FU": { type: "Emirate", name: "Al Fujayrah" }, "AE-AJ": { type: "Emirate", name: "'Ajmān" }, "AE-SH": { type: "Emirate", name: "Ash Shāriqah" }, "AE-AZ": { type: "Emirate", name: "Abū Z̧aby" }, "AE-UQ": { type: "Emirate", name: "Umm al Qaywayn" }, "AE-RK": { type: "Emirate", name: "Ra's al Khaymah" }, "AE-DU": { type: "Emirate", name: "Dubayy" } } }, AD: { name: "Andorra", sub: { "AD-08": { type: "Parish", name: "Escaldes-Engordany" }, "AD-05": { type: "Parish", name: "Ordino" }, "AD-04": { type: "Parish", name: "La Massana" }, "AD-07": { type: "Parish", name: "Andorra la Vella" }, "AD-06": { type: "Parish", name: "Sant Julià de Lòria" }, "AD-03": { type: "Parish", name: "Encamp" }, "AD-02": { type: "Parish", name: "Canillo" } } }, AG: { name: "Antigua and Barbuda", sub: { "AG-11": { type: "Dependency", name: "Redonda" }, "AG-10": { type: "Dependency", name: "Barbuda" }, "AG-08": { type: "Parish", name: "Saint Philip" }, "AG-04": { type: "Parish", name: "Saint John" }, "AG-05": { type: "Parish", name: "Saint Mary" }, "AG-06": { type: "Parish", name: "Saint Paul" }, "AG-07": { type: "Parish", name: "Saint Peter" }, "AG-03": { type: "Parish", name: "Saint George" } } }, AF: { name: "Afghanistan", sub: { "AF-TAK": { type: "Province", name: "Takhār" }, "AF-BGL": { type: "Province", name: "Baghlān" }, "AF-BAM": { type: "Province", name: "Bāmyān" }, "AF-BAL": { type: "Province", name: "Balkh" }, "AF-SAR": { type: "Province", name: "Sar-e Pul" }, "AF-KNR": { type: "Province", name: "Kunar" }, "AF-SAM": { type: "Province", name: "Samangān" }, "AF-LOG": { type: "Province", name: "Lōgar" }, "AF-NUR": { type: "Province", name: "Nūristān" }, "AF-KDZ": { type: "Province", name: "Kunduz" }, "AF-NIM": { type: "Province", name: "Nīmrōz" }, "AF-PAN": { type: "Province", name: "Panjshayr" }, "AF-NAN": { type: "Province", name: "Nangarhār" }, "AF-KHO": { type: "Province", name: "Khōst" }, "AF-PIA": { type: "Province", name: "Paktiyā" }, "AF-BDS": { type: "Province", name: "Badakhshān" }, "AF-FYB": { type: "Province", name: "Fāryāb" }, "AF-URU": { type: "Province", name: "Uruzgān" }, "AF-BDG": { type: "Province", name: "Bādghīs" }, "AF-LAG": { type: "Province", name: "Laghmān" }, "AF-PAR": { type: "Province", name: "Parwān" }, "AF-KAP": { type: "Province", name: "Kāpīsā" }, "AF-GHA": { type: "Province", name: "Ghaznī" }, "AF-GHO": { type: "Province", name: "Ghōr" }, "AF-FRA": { type: "Province", name: "Farāh" }, "AF-KAB": { type: "Province", name: "Kābul" }, "AF-KAN": { type: "Province", name: "Kandahār" }, "AF-ZAB": { type: "Province", name: "Zābul" }, "AF-WAR": { type: "Province", name: "Wardak" }, "AF-HEL": { type: "Province", name: "Helmand" }, "AF-PKA": { type: "Province", name: "Paktīkā" }, "AF-DAY": { type: "Province", name: "Dāykundī" }, "AF-JOW": { type: "Province", name: "Jowzjān" }, "AF-HER": { type: "Province", name: "Herāt" } } }, AI: { name: "Anguilla", sub: { "AI-AI": { type: "Country", name: "Anguilla" } } }, VI: { name: "Virgin Islands", sub: { "VI-VI": { type: "Country", name: "Virgin Islands" } } }, IS: { name: "Iceland", sub: { "IS-8": { type: "Region", name: "Suðurland" }, "IS-3": { type: "Region", name: "Vesturland" }, "IS-2": { type: "Region", name: "Suðurnes" }, "IS-1": { type: "Region", name: "Höfuðborgarsvæði utan Reykjavíkur" }, "IS-0": { type: "Region", name: "Reykjavík" }, "IS-7": { type: "Region", name: "Austurland" }, "IS-6": { type: "Region", name: "Norðurland eystra" }, "IS-5": { type: "Region", name: "Norðurland vestra" }, "IS-4": { type: "Region", name: "Vestfirðir" } } }, IR: { name: "Iran", sub: { "IR-03": { type: "Province", name: "Ardabīl" }, "IR-02": { type: "Province", name: "Āz̄arbāyjān-e Gharbī" }, "IR-01": { type: "Province", name: "Āz̄arbāyjān-e Sharqī" }, "IR-26": { type: "Province", name: "Qom" }, "IR-07": { type: "Province", name: "Tehrān" }, "IR-06": { type: "Province", name: "Būshehr" }, "IR-05": { type: "Province", name: "Īlām" }, "IR-04": { type: "Province", name: "Eşfahān" }, "IR-08": { type: "Province", name: "Chahār Maḩāll va Bakhtīārī" }, "IR-29": { type: "Province", name: "Khorāsān-e Janūbī" }, "IR-27": { type: "Province", name: "Golestān" }, "IR-21": { type: "Province", name: "Māzandarān" }, "IR-20": { type: "Province", name: "Lorestān" }, "IR-23": { type: "Province", name: "Hormozgān" }, "IR-22": { type: "Province", name: "Markazī" }, "IR-18": { type: "Province", name: "Kohgīlūyeh va Būyer Aḩmad" }, "IR-19": { type: "Province", name: "Gīlān" }, "IR-30": { type: "Province", name: "Khorāsān-e Razavī" }, "IR-31": { type: "Province", name: "Khorāsān-e Shemālī" }, "IR-14": { type: "Province", name: "Fārs" }, "IR-15": { type: "Province", name: "Kermān" }, "IR-16": { type: "Province", name: "Kordestān" }, "IR-17": { type: "Province", name: "Kermānshāh" }, "IR-10": { type: "Province", name: "Khūzestān" }, "IR-11": { type: "Province", name: "Zanjān" }, "IR-12": { type: "Province", name: "Semnān" }, "IR-13": { type: "Province", name: "Sīstān va Balūchestān" }, "IR-24": { type: "Province", name: "Hamadān" }, "IR-25": { type: "Province", name: "Yazd" }, "IR-28": { type: "Province", name: "Qazvīn" }, "IR-32": { type: "Province", name: "Alborz" } } }, AM: { name: "Armenia", sub: { "AM-GR": { type: "Region", name: "Geġark'unik'" }, "AM-SU": { type: "Region", name: "Syunik'" }, "AM-AR": { type: "Region", name: "Ararat" }, "AM-ER": { type: "City", name: "Erevan" }, "AM-VD": { type: "Region", name: "Vayoć Jor" }, "AM-KT": { type: "Region", name: "Kotayk'" }, "AM-LO": { type: "Region", name: "Loṙi" }, "AM-AV": { type: "Region", name: "Armavir" }, "AM-TV": { type: "Region", name: "Tavuš" }, "AM-AG": { type: "Region", name: "Aragac̣otn" }, "AM-SH": { type: "Region", name: "Širak" } } }, AL: { name: "Albania", sub: { "AL-DI": { type: "District", name: "Dibër" }, "AL-KO": { type: "District", name: "Korçë" }, "AL-FR": { type: "District", name: "Fier" }, "AL-BR": { type: "District", name: "Berat" }, "AL-BU": { type: "District", name: "Bulqizë" }, "AL-MR": { type: "District", name: "Mirditë" }, "AL-DR": {
      type: "District",
      name: "Durrës"
    }, "AL-HA": { type: "District", name: "Has" }, "AL-DV": { type: "District", name: "Devoll" }, "AL-05": { type: "County", name: "Gjirokastër" }, "AL-04": { type: "County", name: "Fier" }, "AL-07": { type: "County", name: "Kukës" }, "AL-06": { type: "County", name: "Korçë" }, "AL-01": { type: "County", name: "Berat" }, "AL-03": { type: "County", name: "Elbasan" }, "AL-02": { type: "County", name: "Durrës" }, "AL-TP": { type: "District", name: "Tropojë" }, "AL-TR": { type: "District", name: "Tiranë" }, "AL-09": { type: "County", name: "Dibër" }, "AL-08": { type: "County", name: "Lezhë" }, "AL-PG": { type: "District", name: "Pogradec" }, "AL-LU": { type: "District", name: "Lushnjë" }, "AL-PR": { type: "District", name: "Përmet" }, "AL-TE": { type: "District", name: "Tepelenë" }, "AL-PU": { type: "District", name: "Pukë" }, "AL-GR": { type: "District", name: "Gramsh" }, "AL-MT": { type: "District", name: "Mat" }, "AL-EL": { type: "District", name: "Elbasan" }, "AL-VL": { type: "District", name: "Vlorë" }, "AL-KB": { type: "District", name: "Kurbin" }, "AL-LB": { type: "District", name: "Librazhd" }, "AL-ER": { type: "District", name: "Kolonjë" }, "AL-LE": { type: "District", name: "Lezhë" }, "AL-GJ": { type: "District", name: "Gjirokastër" }, "AL-12": { type: "County", name: "Vlorë" }, "AL-KA": { type: "District", name: "Kavajë" }, "AL-10": { type: "County", name: "Shkodër" }, "AL-11": { type: "County", name: "Tiranë" }, "AL-MK": { type: "District", name: "Mallakastër" }, "AL-KC": { type: "District", name: "Kuçovë" }, "AL-SR": { type: "District", name: "Sarandë" }, "AL-MM": { type: "District", name: "Malësi e Madhe" }, "AL-DL": { type: "District", name: "Delvinë" }, "AL-KU": { type: "District", name: "Kukës" }, "AL-SH": { type: "District", name: "Shkodër" }, "AL-PQ": { type: "District", name: "Peqin" }, "AL-KR": { type: "District", name: "Krujë" }, "AL-SK": { type: "District", name: "Skrapar" } } }, AO: { name: "Angola", sub: { "AO-CUS": { type: "Province", name: "Kwanza Sul" }, "AO-HUA": { type: "Province", name: "Huambo" }, "AO-BIE": { type: "Province", name: "Bié" }, "AO-NAM": { type: "Province", name: "Namibe" }, "AO-LNO": { type: "Province", name: "Lunda Norte" }, "AO-UIG": { type: "Province", name: "Uíge" }, "AO-HUI": { type: "Province", name: "Huíla" }, "AO-BGO": { type: "Province", name: "Bengo" }, "AO-LUA": { type: "Province", name: "Luanda" }, "AO-LSU": { type: "Province", name: "Lunda Sul" }, "AO-CCU": { type: "Province", name: "Kuando Kubango" }, "AO-MAL": { type: "Province", name: "Malange" }, "AO-BGU": { type: "Province", name: "Benguela" }, "AO-MOX": { type: "Province", name: "Moxico" }, "AO-CNN": { type: "Province", name: "Cunene" }, "AO-CNO": { type: "Province", name: "Kwanza Norte" }, "AO-ZAI": { type: "Province", name: "Zaire" }, "AO-CAB": { type: "Province", name: "Cabinda" } } }, AQ: { name: "Antarctica", sub: { "AQ-AQ": { type: "Country", name: "Antarctica" } } }, AS: { name: "American Samoa", sub: { "AS-AS": { type: "Country", name: "American Samoa" } } }, AR: { name: "Argentina", sub: { "AR-Z": { type: "Province", name: "Santa Cruz" }, "AR-X": { type: "Province", name: "Córdoba" }, "AR-Y": { type: "Province", name: "Jujuy" }, "AR-V": { type: "Province", name: "Tierra del Fuego" }, "AR-W": { type: "Province", name: "Corrientes" }, "AR-T": { type: "Province", name: "Tucumán" }, "AR-U": { type: "Province", name: "Chubut" }, "AR-R": { type: "Province", name: "Río Negro" }, "AR-S": { type: "Province", name: "Santa Fe" }, "AR-P": { type: "Province", name: "Formosa" }, "AR-Q": { type: "Province", name: "Neuquén" }, "AR-N": { type: "Province", name: "Misiones" }, "AR-L": { type: "Province", name: "La Pampa" }, "AR-M": { type: "Province", name: "Mendoza" }, "AR-J": { type: "Province", name: "San Juan" }, "AR-K": { type: "Province", name: "Catamarca" }, "AR-H": { type: "Province", name: "Chaco" }, "AR-F": { type: "Province", name: "La Rioja" }, "AR-G": { type: "Province", name: "Santiago del Estero" }, "AR-D": { type: "Province", name: "San Luis" }, "AR-E": { type: "Province", name: "Entre Ríos" }, "AR-B": { type: "Province", name: "Buenos Aires" }, "AR-C": { type: "City", name: "Ciudad Autónoma de Buenos Aires" }, "AR-A": { type: "Province", name: "Salta" } } }, AU: { name: "Australia", sub: { "AU-ACT": { type: "Territory", name: "Australian Capital Territory" }, "AU-QLD": { type: "State", name: "Queensland" }, "AU-TAS": { type: "State", name: "Tasmania" }, "AU-VIC": { type: "State", name: "Victoria" }, "AU-NT": { type: "Territory", name: "Northern Territory" }, "AU-WA": { type: "State", name: "Western Australia" }, "AU-SA": { type: "State", name: "South Australia" }, "AU-NSW": { type: "State", name: "New South Wales" } } }, AT: { name: "Austria", sub: { "AT-8": { type: "Federal länder", name: "Vorarlberg" }, "AT-9": { type: "Federal länder", name: "Wien" }, "AT-4": { type: "Federal länder", name: "Oberösterreich" }, "AT-5": { type: "Federal länder", name: "Salzburg" }, "AT-6": { type: "Federal länder", name: "Steiermark" }, "AT-7": { type: "Federal länder", name: "Tirol" }, "AT-1": { type: "Federal länder", name: "Burgenland" }, "AT-2": { type: "Federal länder", name: "Kärnten" }, "AT-3": { type: "Federal länder", name: "Niederösterreich" } } }, IO: { name: "British Indian Ocean Territory", sub: { "IO-IO": { type: "Country", name: "British Indian Ocean Territory" } } }, IN: { name: "India", sub: { "IN-BR": { type: "State", name: "Bihar" }, "IN-MZ": { type: "State", name: "Mizoram" }, "IN-DD": { type: "Union territory", name: "Daman and Diu" }, "IN-LD": { type: "Union territory", name: "Lakshadweep" }, "IN-DN": { type: "Union territory", name: "Dadra and Nagar Haveli" }, "IN-DL": { type: "Union territory", name: "Delhi" }, "IN-NL": { type: "State", name: "Nagaland" }, "IN-WB": { type: "State", name: "West Bengal" }, "IN-HR": { type: "State", name: "Haryana" }, "IN-HP": { type: "State", name: "Himachal Pradesh" }, "IN-AS": { type: "State", name: "Assam" }, "IN-UT": { type: "State", name: "Uttarakhand" }, "IN-JH": { type: "State", name: "Jharkhand" }, "IN-JK": { type: "State", name: "Jammu and Kashmir" }, "IN-UP": { type: "State", name: "Uttar Pradesh" }, "IN-SK": { type: "State", name: "Sikkim" }, "IN-CT": { type: "State", name: "Chhattisgarh" }, "IN-PY": { type: "Union territory", name: "Puducherry" }, "IN-CH": { type: "Union territory", name: "Chandigarh" }, "IN-GA": { type: "State", name: "Goa" }, "IN-TG": { type: "State", name: "Telangana" }, "IN-GJ": { type: "State", name: "Gujarat" }, "IN-RJ": { type: "State", name: "Rajasthan" }, "IN-MP": { type: "State", name: "Madhya Pradesh" }, "IN-OR": { type: "State", name: "Odisha" }, "IN-TN": { type: "State", name: "Tamil Nadu" }, "IN-AN": { type: "Union territory", name: "Andaman and Nicobar Islands" }, "IN-AP": { type: "State", name: "Andhra Pradesh" }, "IN-TR": { type: "State", name: "Tripura" }, "IN-AR": { type: "State", name: "Arunachal Pradesh" }, "IN-KA": { type: "State", name: "Karnataka" }, "IN-PB": { type: "State", name: "Punjab" }, "IN-ML": { type: "State", name: "Meghalaya" }, "IN-MN": { type: "State", name: "Manipur" }, "IN-MH": { type: "State", name: "Maharashtra" }, "IN-KL": { type: "State", name: "Kerala" } } }, AX: { name: "Åland Islands", sub: { "AX-AX": { type: "Country", name: "Åland Islands" } } }, AZ: { name: "Azerbaijan", sub: { "AZ-SBN": { type: "Rayon", name: "Şabran" }, "AZ-OGU": { type: "Rayon", name: "Oğuz" }, "AZ-ABS": { type: "Rayon", name: "Abşeron" }, "AZ-QBA": { type: "Rayon", name: "Quba" }, "AZ-FUZ": { type: "Rayon", name: "Füzuli" }, "AZ-HAC": { type: "Rayon", name: "Hacıqabul" }, "AZ-SKR": { type: "Rayon", name: "Şәmkir" }, "AZ-AST": { type: "Rayon", name: "Astara" }, "AZ-ZAQ": { type: "Rayon", name: "Zaqatala" }, "AZ-QBI": { type: "Rayon", name: "Qubadlı" }, "AZ-XCI": { type: "Rayon", name: "Xocalı" }, "AZ-GYG": { type: "Rayon", name: "Göygöl" }, "AZ-BA": { type: "Municipality", name: "Bakı" }, "AZ-CUL": { type: "Rayon", name: "Culfa" }, "AZ-YEV": { type: "Rayon", name: "Yevlax" }, "AZ-BEY": { type: "Rayon", name: "Beyləqan" }, "AZ-MAS": { type: "Rayon", name: "Masallı" }, "AZ-SAB": { type: "Rayon", name: "Sabirabad" }, "AZ-GOR": { type: "Rayon", name: "Goranboy" }, "AZ-QAX": { type: "Rayon", name: "Qax" }, "AZ-BAR": { type: "Rayon", name: "Bərdə" }, "AZ-SAH": { type: "Rayon", name: "Şahbuz" }, "AZ-LER": { type: "Rayon", name: "Lerik" }, "AZ-SAK": { type: "Rayon", name: "Şәki" }, "AZ-SAL": { type: "Rayon", name: "Salyan" }, "AZ-ORD": { type: "Rayon", name: "Ordubad" }, "AZ-KUR": { type: "Rayon", name: "Kürdəmir" }, "AZ-GOY": { type: "Rayon", name: "Göyçay" }, "AZ-NA": { type: "Municipality", name: "Naftalan" }, "AZ-CAB": { type: "Rayon", name: "Cəbrayıl" }, "AZ-XVD": { type: "Rayon", name: "Xocavәnd" }, "AZ-LAC": { type: "Rayon", name: "Laçın" }, "AZ-QOB": { type: "Rayon", name: "Qobustan" }, "AZ-BAB": { type: "Rayon", name: "Babək" }, "AZ-YE": { type: "Municipality", name: "Yevlax" }, "AZ-BAL": { type: "Rayon", name: "Balakən" }, "AZ-IMI": { type: "Rayon", name: "İmişli" }, "AZ-CAL": { type: "Rayon", name: "Cəlilabad" }, "AZ-LA": { type: "Municipality", name: "Lәnkәran" }, "AZ-BIL": { type: "Rayon", name: "Biləsuvar" }, "AZ-SMI": { type: "Rayon", name: "Şamaxı" }, "AZ-SIY": { type: "Rayon", name: "Siyәzәn" }, "AZ-AGU": { type: "Rayon", name: "Ağsu" }, "AZ-SUS": { type: "Rayon", name: "Şuşa" }, "AZ-TAR": { type: "Rayon", name: "Tәrtәr" }, "AZ-AGS": { type: "Rayon", name: "Ağdaş" }, "AZ-AGM": { type: "Rayon", name: "Ağdam" }, "AZ-YAR": { type: "Rayon", name: "Yardımlı" }, "AZ-SM": { type: "Municipality", name: "Sumqayıt" }, "AZ-SA": { type: "Municipality", name: "Şәki" }, "AZ-LAN": { type: "Rayon", name: "Lənkəran" }, "AZ-GAD": { type: "Rayon", name: "Gədəbəy" }, "AZ-QAZ": { type: "Rayon", name: "Qazax" }, "AZ-GA": { type: "Municipality", name: "Gәncә" }, "AZ-AGA": { type: "Rayon", name: "Ağstafa" }, "AZ-SAT": { type: "Rayon", name: "Saatlı" }, "AZ-AGC": { type: "Rayon", name: "Ağcabәdi" }, "AZ-QUS": { type: "Rayon", name: "Qusar" }, "AZ-ZAN": { type: "Rayon", name: "Zәngilan" }, "AZ-SAR": { type: "Rayon", name: "Şәrur" }, "AZ-UCA": { type: "Rayon", name: "Ucar" }, "AZ-TOV": { type: "Rayon", name: "Tovuz" }, "AZ-QAB": { type: "Rayon", name: "Qәbәlә" }, "AZ-NV": { type: "Municipality", name: "Naxçıvan" }, "AZ-ISM": { type: "Rayon", name: "İsmayıllı" }, "AZ-SR": { type: "Municipality", name: "Şirvan" }, "AZ-MI": { type: "Municipality", name: "Mingәçevir" }, "AZ-NEF": { type: "Rayon", name: "Neftçala" }, "AZ-KAL": { type: "Rayon", name: "Kəlbəcər" }, "AZ-KAN": { type: "Rayon", name: "Kǝngǝrli" }, "AZ-NX": { type: "Autonomous republic", name: "Naxçıvan" }, "AZ-XAC": { type: "Rayon", name: "Xaçmaz" }, "AZ-SMX": { type: "Rayon", name: "Samux" }, "AZ-XA": { type: "Municipality", name: "Xankәndi" }, "AZ-XIZ": { type: "Rayon", name: "Xızı" }, "AZ-DAS": { type: "Rayon", name: "Daşkəsən" }, "AZ-SAD": { type: "Rayon", name: "Sәdәrәk" }, "AZ-ZAR": { type: "Rayon", name: "Zәrdab" } } }, IE: { name: "Ireland", sub: { "IE-WD": { type: "County", name: "Port Láirge" }, "IE-TA": { type: "County", name: "Tiobraid Árann" }, "IE-WW": { type: "County", name: "Cill Mhantáin" }, "IE-CW": { type: "County", name: "Carlow" }, "IE-C": { type: "Province", name: "Connacht" }, "IE-D": { type: "County", name: "Baile Átha Cliath" }, "IE-G": { type: "County", name: "Gaillimh" }, "IE-M": { type: "Province", name: "An Mhumhain" }, "IE-L": { type: "Province", name: "Laighin" }, "IE-RN": { type: "County", name: "Ros Comáin" }, "IE-MO": { type: "County", name: "Maigh Eo" }, "IE-MN": { type: "County", name: "Monaghan" }, "IE-U": { type: "Province", name: "Ulaidh" }, "IE-MH": { type: "County", name: "An Mhí" }, "IE-CO": { type: "County", name: "Corcaigh" }, "IE-CN": { type: "County", name: "An Cabhán" }, "IE-KK": { type: "County", name: "Cill Chainnigh" }, "IE-KE": { type: "County", name: "Cill Dara" }, "IE-WX": { type: "County", name: "Loch Garman" }, "IE-OY": { type: "County", name: "Offaly" }, "IE-KY": { type: "County", name: "Ciarraí" }, "IE-CE": { type: "County", name: "An Clár" }, "IE-WH": { type: "County", name: "An Iarmhí" }, "IE-SO": { type: "County", name: "Sligeach" }, "IE-DL": { type: "County", name: "Donegal" }, "IE-LS": { type: "County", name: "Laois" }, "IE-LM": { type: "County", name: "Leitrim" }, "IE-LK": { type: "County", name: "Limerick" }, "IE-LH": { type: "County", name: "Louth" }, "IE-LD": { type: "County", name: "An Longfort" } } }, ID: { name: "Indonesia", sub: { "ID-JK": { type: "Special district", name: "Jakarta Raya" }, "ID-SL": { type: "Geographical unit", name: "Sulawesi" }, "ID-JI": { type: "Province", name: "Jawa Timur" }, "ID-SM": { type: "Geographical unit", name: "Sumatera" }, "ID-JB": { type: "Province", name: "Jawa Barat" }, "ID-JA": { type: "Province", name: "Jambi" }, "ID-NT": { type: "Province", name: "Nusa Tenggara Timur" }, "ID-SA": { type: "Province", name: "Sulawesi Utara" }, "ID-SB": { type: "Province", name: "Sumatera Barat" }, "ID-LA": { type: "Province", name: "Lampung" }, "ID-YO": { type: "Special region", name: "Yogyakarta" }, "ID-ST": { type: "Province", name: "Sulawesi Tengah" }, "ID-SU": { type: "Province", name: "Sumatera Utara" }, "ID-JW": { type: "Geographical unit", name: "Jawa" }, "ID-NB": { type: "Province", name: "Nusa Tenggara Barat" }, "ID-SR": { type: "Province", name: "Sulawesi Barat" }, "ID-JT": { type: "Province", name: "Jawa Tengah" }, "ID-MU": { type: "Province", name: "Maluku Utara" }, "ID-AC": { type: "Autonomous province", name: "Aceh" }, "ID-SS": { type: "Province", name: "Sumatera Selatan" }, "ID-NU": { type: "Geographical unit", name: "Nusa Tenggara" }, "ID-KT": { type: "Province", name: "Kalimantan Tengah" }, "ID-KU": { type: "Province", name: "Kalimantan Utara" }, "ID-SG": { type: "Province", name: "Sulawesi Tenggara" }, "ID-PA": { type: "Province", name: "Papua" }, "ID-KR": { type: "Province", name: "Kepulauan Riau" }, "ID-KS": { type: "Province", name: "Kalimantan Selatan" }, "ID-RI": { type: "Province", name: "Riau" }, "ID-PB": { type: "Province", name: "Papua Barat" }, "ID-GO": { type: "Province", name: "Gorontalo" }, "ID-MA": { type: "Province", name: "Maluku" }, "ID-KA": { type: "Geographical unit", name: "Kalimantan" }, "ID-KB": { type: "Province", name: "Kalimantan Barat" }, "ID-KI": { type: "Province", name: "Kalimantan Timur" }, "ID-ML": { type: "Geographical unit", name: "Maluku" }, "ID-SN": { type: "Province", name: "Sulawesi Selatan" }, "ID-BT": { type: "Province", name: "Banten" }, "ID-BB": { type: "Province", name: "Bangka Belitung" }, "ID-BA": { type: "Province", name: "Bali" }, "ID-BE": { type: "Province", name: "Bengkulu" }, "ID-PP": { type: "Geographical unit", name: "Papua" } } }, UA: { name: "Ukraine", sub: { "UA-61": { type: "Region", name: "Ternopilska oblast" }, "UA-21": { type: "Region", name: "Zakarpatska oblast" }, "UA-23": { type: "Region", name: "Zaporizka oblast" }, "UA-26": { type: "Region", name: "Ivano-Frankivska oblast" }, "UA-05": { type: "Region", name: "Vinnytska oblast" }, "UA-46": { type: "Region", name: "Lvivska oblast" }, "UA-09": { type: "Region", name: "Luhanska oblast" }, "UA-68": { type: "Region", name: "Khmelnytska oblast" }, "UA-43": { type: "Republic", name: "Avtonomna Respublika Krym" }, "UA-40": { type: "City", name: "Sevastopol" }, "UA-65": { type: "Region", name: "Khersonska oblast" }, "UA-07": { type: "Region", name: "Volynska oblast" }, "UA-48": { type: "Region", name: "Mykolaivska oblast" }, "UA-63": { type: "Region", name: "Kharkivska oblast" }, "UA-35": { type: "Region", name: "Kirovohradska oblast" }, "UA-32": { type: "Region", name: "Kyivska oblast" }, "UA-30": { type: "City", name: "Kyiv" }, "UA-77": { type: "Region", name: "Chernivetska oblast" }, "UA-18": { type: "Region", name: "Zhytomyrska oblast" }, "UA-71": { type: "Region", name: "Cherkaska oblast" }, "UA-56": { type: "Region", name: "Rivnenska oblast" }, "UA-51": { type: "Region", name: "Odeska oblast" }, "UA-53": { type: "Region", name: "Poltavska oblast" }, "UA-74": { type: "Region", name: "Chernihivska oblast" }, "UA-12": { type: "Region", name: "Dnipropetrovska oblast" }, "UA-59": { type: "Region", name: "Sumska oblast" }, "UA-14": { type: "Region", name: "Donetska oblast" } } }, QA: { name: "Qatar", sub: { "QA-MS": { type: "Municipality", name: "Ash Shamāl" }, "QA-KH": { type: "Municipality", name: "Al Khawr wa adh Dhakhīrah" }, "QA-ZA": { type: "Municipality", name: "Az̧ Z̧a‘āyin" }, "QA-RA": { type: "Municipality", name: "Ar Rayyān" }, "QA-WA": { type: "Municipality", name: "Al Wakrah" }, "QA-US": { type: "Municipality", name: "Umm Şalāl" }, "QA-DA": { type: "Municipality", name: "Ad Dawḩah" } } }, MZ: { name: "Mozambique", sub: { "MZ-MPM": { type: "City", name: "Maputo" }, "MZ-I": { type: "Province", name: "Inhambane" }, "MZ-N": { type: "Province", name: "Nampula" }, "MZ-L": { type: "Province", name: "Maputo" }, "MZ-B": { type: "Province", name: "Manica" }, "MZ-A": { type: "Province", name: "Niassa" }, "MZ-G": { type: "Province", name: "Gaza" }, "MZ-S": { type: "Province", name: "Sofala" }, "MZ-P": { type: "Province", name: "Cabo Delgado" }, "MZ-Q": { type: "Province", name: "Zambézia" }, "MZ-T": { type: "Province", name: "Tete" } } } }, codes = { AGO: "AO", DZA: "DZ", EGY: "EG", BGD: "BD", NER: "NE", LIE: "LI", NAM: "NA", BGR: "BG", BOL: "BO", GHA: "GH", CCK: "CC", PAK: "PK", CPV: "CV", JOR: "JO", LBR: "LR", LBY: "LY", MYS: "MY", DOM: "DO", PRI: "PR", SXM: "SX", PRK: "KP", PSE: "PS", TZA: "TZ", BWA: "BW", KHM: "KH", UMI: "UM", NIC: "NI", TTO: "TT", ETH: "ET", PRY: "PY", HKG: "HK", SAU: "SA", LBN: "LB", SVN: "SI", BFA: "BF", CHE: "CH", MRT: "MR", HRV: "HR", CHL: "CL", CHN: "CN", KNA: "KN", SLE: "SL", JAM: "JM", SMR: "SM", GIB: "GI", DJI: "DJ", GIN: "GN", FIN: "FI", URY: "UY", THA: "TH", STP: "ST", SYC: "SC", NPL: "NP", CXR: "CX", LAO: "LA", YEM: "YE", BVT: "BV", ZAF: "ZA", KIR: "KI", PHL: "PH", ROU: "RO", VIR: "VI", SYR: "SY", MAC: "MO", MAF: "MF", MLT: "MT", KAZ: "KZ", TCA: "TC", PYF: "PF", NIU: "NU", DMA: "DM", BEN: "BJ", GUF: "GF", BEL: "BE", MSR: "MS", TGO: "TG", DEU: "DE", GUM: "GU", LKA: "LK", SSD: "SS", FLK: "FK", GBR: "GB", BES: "BQ", GUY: "GY", CRI: "CR", CMR: "CM", MAR: "MA", MNP: "MP", LSO: "LS", HUN: "HU", TKM: "TM", SUR: "SR", NLD: "NL", BMU: "BM", HMD: "HM", TCD: "TD", GEO: "GE", MNE: "ME", MNG: "MN", MHL: "MH", MTQ: "MQ", BLZ: "BZ", NFK: "NF", MMR: "MM", AFG: "AF", BDI: "BI", VGB: "VG", BLR: "BY", BLM: "BL", GRD: "GD", TKL: "TK", GRC: "GR", RUS: "RU", GRL: "GL", SHN: "SH", AND: "AD", MOZ: "MZ", TJK: "TJ", HTI: "HT", MEX: "MX", ZWE: "ZW", LCA: "LC", IND: "IN", LVA: "LV", BTN: "BT", VCT: "VC", VNM: "VN", NOR: "NO", CZE: "CZ", ATF: "TF", ATG: "AG", FJI: "FJ", IOT: "IO", HND: "HN", MUS: "MU", ATA: "AQ", LUX: "LU", ISR: "IL", FSM: "FM", PER: "PE", REU: "RE", IDN: "ID", VUT: "VU", MKD: "MK", COD: "CD", COG: "CG", ISL: "IS", GLP: "GP", COK: "CK", COM: "KM", COL: "CO", NGA: "NG", TLS: "TL", TWN: "TW", PRT: "PT", MDA: "MD", GGY: "GG", MDG: "MG", ECU: "EC", SEN: "SN", NZL: "NZ", MDV: "MV", ASM: "AS", SPM: "PM", CUW: "CW", FRA: "FR", LTU: "LT", RWA: "RW", ZMB: "ZM", GMB: "GM", WLF: "WF", JEY: "JE", FRO: "FO", GTM: "GT", DNK: "DK", IMN: "IM", AUS: "AU", AUT: "AT", SJM: "SJ", VEN: "VE", PLW: "PW", KEN: "KE", MYT: "YT", WSM: "WS", TUR: "TR", ALB: "AL", OMN: "OM", TUV: "TV", ALA: "AX", BRN: "BN", TUN: "TN", PCN: "PN", BRB: "BB", BRA: "BR", CIV: "CI", SRB: "RS", GNQ: "GQ", USA: "US", QAT: "QA", SWE: "SE", AZE: "AZ", GNB: "GW", SWZ: "SZ", TON: "TO", CAN: "CA", UKR: "UA", KOR: "KR", AIA: "AI", CAF: "CF", SVK: "SK", CYP: "CY", BIH: "BA", SGP: "SG", SGS: "GS", SOM: "SO", UZB: "UZ", ERI: "ER", POL: "PL", KWT: "KW", GAB: "GA", CYM: "KY", VAT: "VA", EST: "EE", MWI: "MW", ESP: "ES", IRQ: "IQ", SLV: "SV", MLI: "ML", IRL: "IE", IRN: "IR", ABW: "AW", PNG: "PG", PAN: "PA", SDN: "SD", SLB: "SB", ESH: "EH", MCO: "MC", ITA: "IT", JPN: "JP", KGZ: "KG", UGA: "UG", NCL: "NC", ARE: "AE", ARG: "AR", BHS: "BS", BHR: "BH", ARM: "AM", NRU: "NR", CUB: "CU" }, functions = { subdivision: function(e, a) {
      if ("undefined" == typeof a) {
        a = e.trim().toUpperCase();
        var n = a.split("-");
        if (2 !== n.length)
          return {};
        e = n[0], a = n[1];
      }
      3 === e.length && (e = codes[e]);
      var t = e + "-" + a;
      if (!(e in data))
        return null;
      var i = data[e].sub, m = i[t];
      if ("undefined" == typeof m) {
        for (var o in i)
          if (i.hasOwnProperty(o) && i[o].name.toUpperCase() === a.toUpperCase()) {
            m = i[o], t = o;
            break;
          }
        if ("undefined" == typeof m)
          return null;
      }
      return m.countryName = data[e].name, m.countryCode = e, m.code = t, m.regionCode = 2 === t.split("-").length ? t.split("-")[1] : "", m;
    }, country: function(e) {
      if (e = e.trim().toUpperCase(), 3 === e.length && (e = codes[e]), e in data) {
        var a = data[e];
        return a.code = e, a;
      }
      for (var n in data)
        if (data.hasOwnProperty(n) && data[n].name.toUpperCase() === e.toUpperCase()) {
          a = data[n], a.code = n;
          break;
        }
      return "undefined" == typeof a ? null : a;
    }, data, codes };
    null !== module ? module.exports = functions : window.iso3166 = functions;
  })();
})(iso3166_min);
var iso3166_minExports = iso3166_min.exports;
const iso3166 = /* @__PURE__ */ getDefaultExportFromCjs(iso3166_minExports);
const locale$1c = "af";
const countries$1c = {
  AF: "Afganistan",
  AL: "Albanië",
  DZ: "Algerië",
  AS: "Amerikaans-Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarktika",
  AG: "Antigua en Barbuda",
  AR: "Argentinië",
  AM: "Armenië",
  AW: "Aruba",
  AU: "Australië",
  AT: "Oostenryk",
  AZ: "Azerbeidjan",
  BS: "Bahamas",
  BH: "Bahrein",
  BD: "Bangladesj",
  BB: "Barbados",
  BY: "Belarus",
  BE: "België",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhoetan",
  BO: "Bolivië",
  BA: "Bosnië en Herzegowina",
  BW: "Botswana",
  BV: "Bouveteiland",
  BR: "Brasilië",
  IO: "Britse Indiese Oseaangebied",
  BN: "Broenei",
  BG: "Bulgarye",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Kambodja",
  CM: "Kameroen",
  CA: "Kanada",
  CV: "Kaap Verde",
  KY: "Kaaimanseilande",
  CF: "Sentraal-Afrikaanse Republiek",
  TD: "Tsjad",
  CL: "Chili",
  CN: "Sjina",
  CX: "Kerseiland",
  CC: "Cocos- (Keeling) eilande",
  CO: "Colombië",
  KM: "Comore",
  CG: "Republiek van die Kongo",
  CD: "Demokratiese Republiek van die Kongo",
  CK: "Cookeilande",
  CR: "Costa Rica",
  CI: "Ivoorkus",
  HR: "Kroasië",
  CU: "Kuba",
  CY: "Siprus",
  CZ: "Tjeggiese Republiek",
  DK: "Denemarke",
  DJ: "Djiboeti",
  DM: "Dominica",
  DO: "Dominikaanse Republiek",
  EC: "Ecuador",
  EG: "Egipte",
  SV: "El Salvador",
  GQ: "Ekwatoriaal-Guinee",
  ER: "Eritrea",
  EE: "Estland",
  ET: "Ethiopië",
  FK: "Falklandeilande",
  FO: "Faroëreilande",
  FJ: "Fidji",
  FI: "Finland",
  FR: "Frankryk",
  GF: "Frans-Guyana",
  PF: "Frans-Polinesië",
  TF: "Franse Suidelike Gebiede",
  GA: "Gaboen",
  GM: "Gambië",
  GE: "Georgië",
  DE: "Duitsland",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Griekeland",
  GL: "Groenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinee",
  GW: "Guinee-Bissau",
  GY: "Guyana",
  HT: "Haïti",
  HM: "Heard en McDonaldeilande",
  VA: "Vatikaanstad",
  HN: "Honduras",
  HK: "Hongkong SAS Sjina",
  HU: "Hongarye",
  IS: "Ysland",
  IN: "Indië",
  ID: "Indonesië",
  IR: "Iran",
  IQ: "Irak",
  IE: "Ierland",
  IL: "Israel",
  IT: "Italië",
  JM: "Jamaika",
  JP: "Japan",
  JO: "Jordanië",
  KZ: "Kazakstan",
  KE: "Kenia",
  KI: "Kiribati",
  KP: "Noord-Korea",
  KR: "Suid-Korea",
  KW: "Koeweit",
  KG: "Kirgisië",
  LA: "Laos",
  LV: "Letland",
  LB: "Libanon",
  LS: "Lesotho",
  LR: "Liberië",
  LY: "Libië",
  LI: "Liechtenstein",
  LT: "Litaue",
  LU: "Luxemburg",
  MO: "Macau SAS Sjina",
  MG: "Madagaskar",
  MW: "Malawi",
  MY: "Maleisië",
  MV: "Maledive",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshalleilande",
  MQ: "Martinique",
  MR: "Mauritanië",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Meksiko",
  FM: "Mikronesië",
  MD: "Moldowa",
  MC: "Monaco",
  MN: "Mongolië",
  MS: "Montserrat",
  MA: "Marokko",
  MZ: "Mosambiek",
  MM: "Mianmar (Birma)",
  NA: "Namibië",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Nederland",
  NC: "Nieu-Kaledonië",
  NZ: "Nieu-Seeland",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigerië",
  NU: "Niue",
  NF: "Norfolkeiland",
  MK: "Macedonië",
  MP: "Noordelike Mariana-eilande",
  NO: "Noorweë",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestynse gebiede",
  PA: "Panama",
  PG: "Papoea-Nieu-Guinee",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Filippyne",
  PN: "Pitcairneilande",
  PL: "Pole",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Katar",
  RE: "Réunion",
  RO: "Roemenië",
  RU: "Rusland",
  RW: "Rwanda",
  SH: "Sint Helena",
  KN: "Sint Kitts en Nevis",
  LC: "Sint Lucia",
  PM: "Sint Pierre en Miquelon",
  VC: "Sint Vincent en die Grenadine",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome en Principe",
  SA: "Saoedi-Arabië",
  SN: "Senegal",
  SC: "Seychelle",
  SL: "Sierra Leone",
  SG: "Singapoer",
  SK: "Slowakye",
  SI: "Slowenië",
  SB: "Solomoneilande",
  SO: "Somalië",
  ZA: "Suid-Afrika",
  GS: "Suid-Georgië en die Suidelike Sandwicheilande",
  ES: "Spanje",
  LK: "Sri Lanka",
  SD: "Soedan",
  SR: "Suriname",
  SJ: "Svalbard en Jan Mayen",
  SZ: "Swaziland",
  SE: "Swede",
  CH: "Switserland",
  SY: "Sirië",
  TW: "Taiwan",
  TJ: "Tadjikistan",
  TZ: "Tanzanië",
  TH: "Thailand",
  TL: "Oos-Timor",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad en Tobago",
  TN: "Tunisië",
  TR: "Turkye",
  TM: "Turkmenië",
  TC: "Turks- en Caicoseilande",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Oekraïne",
  AE: "Verenigde Arabiese Emirate",
  GB: "Verenigde Koninkryk",
  US: "Verenigde State van Amerika",
  UM: "VS klein omliggende eilande",
  UY: "Uruguay",
  UZ: "Oesbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Viëtnam",
  VG: "Britse Maagde-eilande",
  VI: "Amerikaanse Maagde-eilande",
  WF: "Wallis en Futuna",
  EH: "Wes-Sahara",
  YE: "Jemen",
  ZM: "Zambië",
  ZW: "Zimbabwe",
  AX: "Ålandeilande",
  BQ: "Karibiese Nederland",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Eiland Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Sint Barthélemy",
  MF: "Sint Martin",
  RS: "Serwië",
  SX: "Sint Maarten",
  SS: "Suid-Soedan",
  XK: "Kosovo"
};
const af = {
  locale: locale$1c,
  countries: countries$1c
};
const locale$1b = "am";
const countries$1b = {
  AF: "አፍጋኒስታን",
  AL: "አልባኒያ",
  DZ: "አልጄሪያ",
  AS: "የአሜሪካ ሳሞአ",
  AD: "አንዶራ",
  AO: "አንጐላ",
  AI: "አንጉኢላ",
  AQ: "አንታርክቲካ",
  AG: "አንቲጓ እና ባሩዳ",
  AR: "አርጀንቲና",
  AM: "አርሜኒያ",
  AW: "አሩባ",
  AU: "አውስትራልያ",
  AT: "ኦስትሪያ",
  AZ: "አዘርባጃን",
  BS: "ባሃማስ",
  BH: "ባህሬን",
  BD: "ባንግላዲሽ",
  BB: "ባርቤዶስ",
  BY: "ቤላሩስ",
  BE: "ቤልጄም",
  BZ: "ቤሊዘ",
  BJ: "ቤኒን",
  BM: "ቤርሙዳ",
  BT: "ቡህታን",
  BO: "ቦሊቪያ",
  BA: "ቦስኒያ እና ሄርዞጎቪኒያ",
  BW: "ቦትስዋና",
  BV: "ቡቬት ደሴት",
  BR: "ብራዚል",
  IO: "የብሪታኒያ ህንድ ውቂያኖስ ግዛት",
  BN: "ብሩኒ",
  BG: "ቡልጌሪያ",
  BF: "ቡርኪና ፋሶ",
  BI: "ብሩንዲ",
  KH: "ካምቦዲያ",
  CM: "ካሜሩን",
  CA: "ካናዳ",
  CV: "ኬፕ ቬርዴ",
  KY: "ካይማን ደሴቶች",
  CF: "የመካከለኛው አፍሪካ ሪፐብሊክ",
  TD: "ቻድ",
  CL: "ቺሊ",
  CN: "ቻይና",
  CX: "የገና ደሴት",
  CC: "ኮኮስ(ኬሊንግ) ደሴቶች",
  CO: "ኮሎምቢያ",
  KM: "ኮሞሮስ",
  CG: "ኮንጎ ብራዛቪል",
  CD: "ኮንጎ-ኪንሻሳ",
  CK: "ኩክ ደሴቶች",
  CR: "ኮስታ ሪካ",
  CI: "ኮት ዲቯር",
  HR: "ክሮኤሽያ",
  CU: "ኩባ",
  CY: "ሳይፕረስ",
  CZ: "ቼክ ሪፑብሊክ",
  DK: "ዴንማርክ",
  DJ: "ጂቡቲ",
  DM: "ዶሚኒካ",
  DO: "ዶሚኒክ ሪፑብሊክ",
  EC: "ኢኳዶር",
  EG: "ግብጽ",
  SV: "ኤል ሳልቫዶር",
  GQ: "ኢኳቶሪያል ጊኒ",
  ER: "ኤርትራ",
  EE: "ኤስቶኒያ",
  ET: "ኢትዮጵያ",
  FK: "የፎክላንድ ደሴቶች",
  FO: "የፋሮ ደሴቶች",
  FJ: "ፊጂ",
  FI: "ፊንላንድ",
  FR: "ፈረንሳይ",
  GF: "የፈረንሳይ ጉዊአና",
  PF: "የፈረንሳይ ፖሊኔዢያ",
  TF: "የፈረንሳይ ደቡባዊ ግዛቶች",
  GA: "ጋቦን",
  GM: "ጋምቢያ",
  GE: "ጆርጂያ",
  DE: "ጀርመን",
  GH: "ጋና",
  GI: "ጂብራልተር",
  GR: "ግሪክ",
  GL: "ግሪንላንድ",
  GD: "ግሬናዳ",
  GP: "ጉዋደሉፕ",
  GU: "ጉዋም",
  GT: "ጉዋቲማላ",
  GN: "ጊኒ",
  GW: "ጊኒ ቢሳኦ",
  GY: "ጉያና",
  HT: "ሀይቲ",
  HM: "ኽርድ ደሴቶችና ማክዶናልድ ደሴቶች",
  VA: "ቫቲካን ከተማ",
  HN: "ሆንዱራስ",
  HK: "ሆንግ ኮንግ SAR ቻይና",
  HU: "ሀንጋሪ",
  IS: "አይስላንድ",
  IN: "ህንድ",
  ID: "ኢንዶኔዢያ",
  IR: "ኢራን",
  IQ: "ኢራቅ",
  IE: "አየርላንድ",
  IL: "እስራኤል",
  IT: "ጣሊያን",
  JM: "ጃማይካ",
  JP: "ጃፓን",
  JO: "ጆርዳን",
  KZ: "ካዛኪስታን",
  KE: "ኬንያ",
  KI: "ኪሪባቲ",
  KP: "ሰሜን ኮሪያ",
  KR: "ደቡብ ኮሪያ",
  KW: "ክዌት",
  KG: "ኪርጊስታን",
  LA: "ላኦስ",
  LV: "ላትቪያ",
  LB: "ሊባኖስ",
  LS: "ሌሶቶ",
  LR: "ላይቤሪያ",
  LY: "ሊቢያ",
  LI: "ሊችተንስታይን",
  LT: "ሊቱዌኒያ",
  LU: "ሉክሰምበርግ",
  MO: "ማካኡ ልዩ የአስተዳደር ክልል ቻይና",
  MG: "ማዳጋስካር",
  MW: "ማላዊ",
  MY: "ማሌዢያ",
  MV: "ማልዲቭስ",
  ML: "ማሊ",
  MT: "ማልታ",
  MH: "ማርሻል አይላንድ",
  MQ: "ማርቲኒክ",
  MR: "ሞሪቴኒያ",
  MU: "ሞሪሸስ",
  YT: "ሜይኦቴ",
  MX: "ሜክሲኮ",
  FM: "ሚክሮኔዢያ",
  MD: "ሞልዶቫ",
  MC: "ሞናኮ",
  MN: "ሞንጎሊያ",
  MS: "ሞንትሴራት",
  MA: "ሞሮኮ",
  MZ: "ሞዛምቢክ",
  MM: "ማይናማር(በርማ)",
  NA: "ናሚቢያ",
  NR: "ናኡሩ",
  NP: "ኔፓል",
  NL: "ኔዘርላንድ",
  NC: "ኒው ካሌዶኒያ",
  NZ: "ኒው ዚላንድ",
  NI: "ኒካራጓ",
  NE: "ኒጀር",
  NG: "ናይጄሪያ",
  NU: "ኒኡይ",
  NF: "ኖርፎልክ ደሴት",
  MK: "መቄዶንያ",
  MP: "የሰሜናዊ ማሪያና ደሴቶች",
  NO: "ኖርዌ",
  OM: "ኦማን",
  PK: "ፓኪስታን",
  PW: "ፓላው",
  PS: "የፍልስጤም ግዛት",
  PA: "ፓናማ",
  PG: "ፓፑዋ ኒው ጊኒ",
  PY: "ፓራጓይ",
  PE: "ፔሩ",
  PH: "ፊሊፒንስ",
  PN: "ፒትካኢርን አይስላንድ",
  PL: "ፖላንድ",
  PT: "ፖርቱጋል",
  PR: "ፖርታ ሪኮ",
  QA: "ኳታር",
  RE: "ሪዩኒየን",
  RO: "ሮሜኒያ",
  RU: "ራሺያ",
  RW: "ሩዋንዳ",
  SH: "ሴንት ሄለና",
  KN: "ቅዱስ ኪትስ እና ኔቪስ",
  LC: "ሴንት ሉቺያ",
  PM: "ቅዱስ ፒዬር እና ሚኩኤሎን",
  VC: "ቅዱስ ቪንሴንት እና ግሬናዲንስ",
  WS: "ሳሞአ",
  SM: "ሳን ማሪኖ",
  ST: "ሳኦ ቶሜ እና ፕሪንሲፔ",
  SA: "ሳውድአረቢያ",
  SN: "ሴኔጋል",
  SC: "ሲሼልስ",
  SL: "ሴራሊዮን",
  SG: "ሲንጋፖር",
  SK: "ስሎቫኪያ",
  SI: "ስሎቬኒያ",
  SB: "ሰሎሞን ደሴት",
  SO: "ሱማሌ",
  ZA: "ደቡብ አፍሪካ",
  GS: "ደቡብ ጆርጂያ እና የደቡብ ሳንድዊች ደሴቶች",
  ES: "ስፔን",
  LK: "ሲሪላንካ",
  SD: "ሱዳን",
  SR: "ሱሪናም",
  SJ: "ስቫልባርድ እና ጃን ማየን",
  SZ: "ሱዋዚላንድ",
  SE: "ስዊድን",
  CH: "ስዊዘርላንድ",
  SY: "ሲሪያ",
  TW: "ታይዋን",
  TJ: "ታጃኪስታን",
  TZ: "ታንዛኒያ",
  TH: "ታይላንድ",
  TL: "ምስራቅ ሌስት",
  TG: "ቶጐ",
  TK: "ቶክላው",
  TO: "ቶንጋ",
  TT: "ትሪናዳድ እና ቶቤጎ",
  TN: "ቱኒዚያ",
  TR: "ቱርክ",
  TM: "ቱርክሜኒስታን",
  TC: "የቱርኮችና የካኢኮስ ደሴቶች",
  TV: "ቱቫሉ",
  UG: "ዩጋንዳ",
  UA: "ዩክሬን",
  AE: "የተባበሩት አረብ ኤምሬትስ",
  GB: "እንግሊዝ",
  US: "ዩናይትድ ስቴትስ",
  UM: "የዩ ኤስ ጠረፍ ላይ ያሉ ደሴቶች",
  UY: "ኡራጓይ",
  UZ: "ኡዝቤኪስታን",
  VU: "ቫኑአቱ",
  VE: "ቬንዙዌላ",
  VN: "ቬትናም",
  VG: "የእንግሊዝ ቨርጂን ደሴቶች",
  VI: "የአሜሪካ ቨርጂን ደሴቶች",
  WF: "ዋሊስ እና ፉቱና ደሴቶች",
  EH: "ምዕራባዊ ሳህራ",
  YE: "የመን",
  ZM: "ዛምቢያ",
  ZW: "ዚምቧቤ",
  AX: "የአላንድ ደሴቶች",
  BQ: "የካሪቢያን ኔዘርላንድስ",
  CW: "ኩራሳዎ",
  GG: "ጉርነሲ",
  IM: "አይል ኦፍ ማን",
  JE: "ጀርሲ",
  ME: "ሞንተኔግሮ",
  BL: "ቅዱስ በርቴሎሜ",
  MF: "ሴንት ማርቲን",
  RS: "ሰርብያ",
  SX: "ሲንት ማርተን",
  SS: "ደቡብ ሱዳን",
  XK: "ኮሶቮ"
};
const am = {
  locale: locale$1b,
  countries: countries$1b
};
const locale$1a = "ar";
const countries$1a = {
  AF: "أفغانستان",
  AL: "ألبانيا",
  DZ: "الجزائر",
  AS: "ساموا الأمريكية",
  AD: "أندورا",
  AO: "أنغولا",
  AI: "أنغويلا",
  AQ: "القارة القطبية الجنوبية",
  AG: "أنتيغوا وباربودا",
  AR: "الأرجنتين",
  AM: "أرمينيا",
  AW: "أروبا",
  AU: "أستراليا",
  AT: "النمسا",
  AZ: "أذربيجان",
  BS: "باهاماس",
  BH: "البحرين",
  BD: "بنغلاديش",
  BB: "باربادوس",
  BY: "روسيا البيضاء",
  BE: "بلجيكا",
  BZ: "بليز",
  BJ: "بنين",
  BM: "برمودا",
  BT: "بوتان",
  BO: "بوليفيا",
  BA: "البوسنة والهرسك",
  BW: "بوتسوانا",
  BV: "جزيرة بوفيه",
  BR: "البرازيل",
  IO: "إقليم المحيط الهندي البريطاني",
  BN: "بروناي",
  BG: "بلغاريا",
  BF: "بوركينا فاسو",
  BI: "بوروندي",
  KH: "كمبوديا",
  CM: "الكاميرون",
  CA: "كندا",
  CV: "الرأس الأخضر",
  KY: "جزر كايمان",
  CF: "جمهورية أفريقيا الوسطى",
  TD: "تشاد",
  CL: "تشيلي",
  CN: "الصين",
  CX: "جزيرة عيد الميلاد",
  CC: "جزر كوكوس",
  CO: "كولومبيا",
  KM: "جزر القمر",
  CG: "جمهورية الكونغو",
  CD: "جمهورية الكونغو الديمقراطية",
  CK: "جزر كوك",
  CR: "كوستاريكا",
  CI: "ساحل العاج",
  HR: "كرواتيا",
  CU: "كوبا",
  CY: "قبرص",
  CZ: "جمهورية التشيك",
  DK: "الدنمارك",
  DJ: "جيبوتي",
  DM: "دومينيكا",
  DO: "جمهورية الدومينيكان",
  EC: "الإكوادور",
  EG: "مصر",
  SV: "السلفادور",
  GQ: "غينيا الاستوائية",
  ER: "إريتريا",
  EE: "إستونيا",
  ET: "إثيوبيا",
  FK: "جزر فوكلاند",
  FO: "جزر فارو",
  FJ: "فيجي",
  FI: "فنلندا",
  FR: "فرنسا",
  GF: "غويانا الفرنسية",
  PF: "بولينزيا الفرنسية",
  TF: "أراض فرنسية جنوبية وأنتارتيكية",
  GA: "الغابون",
  GM: "غامبيا",
  GE: "جورجيا",
  DE: "ألمانيا",
  GH: "غانا",
  GI: "جبل طارق",
  GR: "اليونان",
  GL: "جرينلاند",
  GD: "غرينادا",
  GP: "غوادلوب",
  GU: "غوام",
  GT: "غواتيمالا",
  GN: "غينيا",
  GW: "غينيا بيساو",
  GY: "غيانا",
  HT: "هايتي",
  HM: "جزيرة هيرد وجزر ماكدونالد",
  VA: "الفاتيكان",
  HN: "هندوراس",
  HK: "هونغ كونغ",
  HU: "المجر",
  IS: "آيسلندا",
  IN: "الهند",
  ID: "إندونيسيا",
  IR: "إيران",
  IQ: "العراق",
  IE: "أيرلندا",
  IL: "إسرائيل",
  IT: "إيطاليا",
  JM: "جامايكا",
  JP: "اليابان",
  JO: "الأردن",
  KZ: "كازاخستان",
  KE: "كينيا",
  KI: "كيريباتي",
  KP: "كوريا الشمالية",
  KR: "كوريا الجنوبية",
  KW: "الكويت",
  KG: "قيرغيزستان",
  LA: "لاوس",
  LV: "لاتفيا",
  LB: "لبنان",
  LS: "ليسوتو",
  LR: "ليبيريا",
  LY: "ليبيا",
  LI: "ليختنشتاين",
  LT: "ليتوانيا",
  LU: "لوكسمبورغ",
  MO: "ماكاو",
  MK: "مقدونيا الشمالية",
  MG: "مدغشقر",
  MW: "مالاوي",
  MY: "ماليزيا",
  MV: "جزر المالديف",
  ML: "مالي",
  MT: "مالطا",
  MH: "جزر مارشال",
  MQ: "مارتينيك",
  MR: "موريتانيا",
  MU: "موريشيوس",
  YT: "مايوت",
  MX: "المكسيك",
  FM: "ولايات ميكرونيسيا المتحدة",
  MD: "مولدوفا",
  MC: "موناكو",
  MN: "منغوليا",
  MS: "مونتسرات",
  MA: "المغرب",
  MZ: "موزمبيق",
  MM: "بورما",
  NA: "ناميبيا",
  NR: "ناورو",
  NP: "نيبال",
  NL: "هولندا",
  NC: "كاليدونيا الجديدة",
  NZ: "نيوزيلندا",
  NI: "نيكاراغوا",
  NE: "النيجر",
  NG: "نيجيريا",
  NU: "نييوي",
  NF: "جزيرة نورفولك",
  MP: "جزر ماريانا الشمالية",
  NO: "النرويج",
  OM: "عمان",
  PK: "باكستان",
  PW: "بالاو",
  PS: "فلسطين",
  PA: "بنما",
  PG: "بابوا غينيا الجديدة",
  PY: "باراغواي",
  PE: "بيرو",
  PH: "الفلبين",
  PN: "جزر بيتكيرن",
  PL: "بولندا",
  PT: "البرتغال",
  PR: "بورتوريكو",
  QA: "قطر",
  RE: "لا ريونيون",
  RO: "رومانيا",
  RU: "روسيا",
  RW: "رواندا",
  SH: "سانت هيلينا وأسينشين وتريستان دا كونا",
  KN: "سانت كيتس ونيفيس",
  LC: "سانت لوسيا",
  PM: "سان بيير وميكلون",
  VC: "سانت فينسنت والغرينادين",
  WS: "ساموا",
  SM: "سان مارينو",
  ST: "ساو تومي وبرينسيب",
  SA: "السعودية",
  SN: "السنغال",
  SC: "سيشل",
  SL: "سيراليون",
  SG: "سنغافورة",
  SK: "سلوفاكيا",
  SI: "سلوفينيا",
  SB: "جزر سليمان",
  SO: "الصومال",
  ZA: "جنوب أفريقيا",
  GS: "جورجيا الجنوبية وجزر ساندويتش الجنوبية",
  ES: "إسبانيا",
  LK: "سريلانكا",
  SD: "السودان",
  SR: "سورينام",
  SJ: "سفالبارد ويان ماين",
  SZ: "سوازيلاند",
  SE: "السويد",
  CH: "سويسرا",
  SY: "سوريا",
  TW: "تايوان",
  TJ: "طاجيكستان",
  TZ: "تانزانيا",
  TH: "تايلاند",
  TL: "تيمور الشرقية",
  TG: "توغو",
  TK: "توكيلاو",
  TO: "تونغا",
  TT: "ترينيداد وتوباغو",
  TN: "تونس",
  TR: "تركيا",
  TM: "تركمانستان",
  TC: "جزر توركس وكايكوس",
  TV: "توفالو",
  UG: "أوغندا",
  UA: "أوكرانيا",
  AE: "الإمارات العربية المتحدة",
  GB: "المملكة المتحدة",
  US: "الولايات المتحدة",
  UM: "جزر الولايات المتحدة",
  UY: "الأوروغواي",
  UZ: "أوزبكستان",
  VU: "فانواتو",
  VE: "فنزويلا",
  VN: "فيتنام",
  VG: "جزر العذراء البريطانية",
  VI: "جزر العذراء الأمريكية",
  WF: "والس وفوتونا",
  EH: "الصحراء الغربية",
  YE: "اليمن",
  ZM: "زامبيا",
  ZW: "زيمبابوي",
  AX: "جزر أولاند",
  BQ: "الجزر الكاريبية الهولندية",
  CW: "كوراساو",
  GG: "غيرنزي",
  IM: "جزيرة مان",
  JE: "جيرزي",
  ME: "الجبل الأسود",
  BL: "سان بارتيلمي",
  MF: "سانت مارتن (الجزء الفرنسي)",
  RS: "صربيا",
  SX: "سانت مارتن (الجزء الهولندي)",
  SS: "جنوب السودان",
  XK: "كوسوفو"
};
const ar = {
  locale: locale$1a,
  countries: countries$1a
};
const locale$19 = "az";
const countries$19 = {
  AD: "Andorra",
  AE: "Birləşmiş Ərəb Əmirlikləri",
  AF: "Əfqanıstan",
  AG: "Antiqua və Barbuda",
  AI: "Angilya",
  AL: "Albaniya",
  AM: "Ermənistan",
  AO: "Anqola",
  AQ: "Antarktika",
  AR: "Argentina",
  AS: "Amerika Samoası",
  AT: "Avstriya",
  AU: "Avstraliya",
  AW: "Aruba",
  AX: "Aland adaları",
  AZ: "Azərbaycan",
  BA: "Bosniya və Herseqovina",
  BB: "Barbados",
  BD: "Banqladeş",
  BE: "Belçika",
  BF: "Burkina Faso",
  BG: "Bolqarıstan",
  BH: "Bəhreyn",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Sent-Bartelemi",
  BM: "Bermud adaları",
  BN: "Bruney",
  BO: "Boliviya",
  BQ: "Karib Niderlandı",
  BR: "Braziliya",
  BS: "Baham adaları",
  BT: "Butan",
  BV: "Buve adası",
  BW: "Botsvana",
  BY: "Belarus",
  BZ: "Beliz",
  CA: "Kanada",
  CC: "Kokos (Kilinq) adaları",
  CD: "Konqo - Kinşasa",
  CF: "Mərkəzi Afrika Respublikası",
  CG: "Konqo - Brazzavil",
  CH: "İsveçrə",
  CI: "Kotd’ivuar",
  CK: "Kuk adaları",
  CL: "Çili",
  CM: "Kamerun",
  CN: "Çin",
  CO: "Kolumbiya",
  CR: "Kosta Rika",
  CU: "Kuba",
  CV: "Kabo-Verde",
  CW: "Kurasao",
  CX: "Milad adası",
  CY: "Kipr",
  CZ: "Çex Respublikası",
  DE: "Almaniya",
  DJ: "Cibuti",
  DK: "Danimarka",
  DM: "Dominika",
  DO: "Dominikan Respublikası",
  DZ: "Əlcəzair",
  EC: "Ekvador",
  EE: "Estoniya",
  EG: "Misir",
  EH: "Qərbi Saxara",
  ER: "Eritreya",
  ES: "İspaniya",
  ET: "Efiopiya",
  FI: "Finlandiya",
  FJ: "Fici",
  FK: "Folklend adaları",
  FM: "Mikroneziya",
  FO: "Farer adaları",
  FR: "Fransa",
  GA: "Qabon",
  GB: "Birləşmiş Krallıq",
  GD: "Qrenada",
  GE: "Gürcüstan",
  GF: "Fransa Qvianası",
  GG: "Gernsi",
  GH: "Qana",
  GI: "Cəbəllütariq",
  GL: "Qrenlandiya",
  GM: "Qambiya",
  GN: "Qvineya",
  GP: "Qvadelupa",
  GQ: "Ekvatorial Qvineya",
  GR: "Yunanıstan",
  GS: "Cənubi Corciya və Cənubi Sendviç adaları",
  GT: "Qvatemala",
  GU: "Quam",
  GW: "Qvineya-Bisau",
  GY: "Qayana",
  HK: "Honq Konq",
  HM: "Herd və Makdonald adaları",
  HN: "Honduras",
  HR: "Xorvatiya",
  HT: "Haiti",
  HU: "Macarıstan",
  ID: "İndoneziya",
  IE: "İrlandiya",
  IL: "İsrail",
  IM: "Men adası",
  IN: "Hindistan",
  IO: "Britaniyanın Hind Okeanı Ərazisi",
  IQ: "İraq",
  IR: "İran",
  IS: "İslandiya",
  IT: "İtaliya",
  JE: "Cersi",
  JM: "Yamayka",
  JO: "İordaniya",
  JP: "Yaponiya",
  KE: "Keniya",
  KG: "Qırğızıstan",
  KH: "Kamboca",
  KI: "Kiribati",
  KM: "Komor adaları",
  KN: "Sent-Kits və Nevis",
  KP: "Şimali Koreya",
  KR: "Cənubi Koreya",
  KW: "Küveyt",
  KY: "Kayman adaları",
  KZ: "Qazaxıstan",
  LA: "Laos",
  LB: "Livan",
  LC: "Sent-Lusiya",
  LI: "Lixtenşteyn",
  LK: "Şri-Lanka",
  LR: "Liberiya",
  LS: "Lesoto",
  LT: "Litva",
  LU: "Lüksemburq",
  LV: "Latviya",
  LY: "Liviya",
  MA: "Mərakeş",
  MC: "Monako",
  MD: "Moldova",
  ME: "Monteneqro",
  MF: "Sent Martin",
  MG: "Madaqaskar",
  MH: "Marşal adaları",
  MK: "Şimali Makedoniya",
  ML: "Mali",
  MM: "Myanma",
  MN: "Monqolustan",
  MO: "Makao",
  MP: "Şimali Marian adaları",
  MQ: "Martinik",
  MR: "Mavritaniya",
  MS: "Monserat",
  MT: "Malta",
  MU: "Mavriki",
  MV: "Maldiv adaları",
  MW: "Malavi",
  MX: "Meksika",
  MY: "Malayziya",
  MZ: "Mozambik",
  NA: "Namibiya",
  NC: "Yeni Kaledoniya",
  NE: "Niger",
  NF: "Norfolk adası",
  NG: "Nigeriya",
  NI: "Nikaraqua",
  NL: "Niderland",
  NO: "Norveç",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Yeni Zelandiya",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "Fransa Polineziyası",
  PG: "Papua-Yeni Qvineya",
  PH: "Filippin",
  PK: "Pakistan",
  PL: "Polşa",
  PM: "Müqəddəs Pyer və Mikelon",
  PN: "Pitkern adaları",
  PR: "Puerto Riko",
  PS: "Fələstin Əraziləri",
  PT: "Portuqaliya",
  PW: "Palau",
  PY: "Paraqvay",
  QA: "Qətər",
  RE: "Reyunyon",
  RO: "Rumıniya",
  RS: "Serbiya",
  RU: "Rusiya",
  RW: "Ruanda",
  SA: "Səudiyyə Ərəbistanı",
  SB: "Solomon adaları",
  SC: "Seyşel adaları",
  SD: "Sudan",
  SE: "İsveç",
  SG: "Sinqapur",
  SH: "Müqəddəs Yelena",
  SI: "Sloveniya",
  SJ: "Svalbard və Yan-Mayen",
  SK: "Slovakiya",
  SL: "Syerra-Leone",
  SM: "San-Marino",
  SN: "Seneqal",
  SO: "Somali",
  SR: "Surinam",
  SS: "Cənubi Sudan",
  ST: "San-Tome və Prinsipi",
  SV: "Salvador",
  SX: "Sint-Marten",
  SY: "Suriya",
  SZ: "Svazilend",
  TC: "Törks və Kaykos adaları",
  TD: "Çad",
  TF: "Fransanın Cənub Əraziləri",
  TG: "Toqo",
  TH: "Tailand",
  TJ: "Tacikistan",
  TK: "Tokelau",
  TL: "Şərqi Timor",
  TM: "Türkmənistan",
  TN: "Tunis",
  TO: "Tonqa",
  TR: "Türkiyə",
  TT: "Trinidad və Tobaqo",
  TV: "Tuvalu",
  TW: "Tayvan",
  TZ: "Tanzaniya",
  UA: "Ukrayna",
  UG: "Uqanda",
  UM: "ABŞ-a bağlı kiçik adacıqlar",
  US: "Amerika Birləşmiş Ştatları",
  UY: "Uruqvay",
  UZ: "Özbəkistan",
  VA: "Vatikan",
  VC: "Sent-Vinsent və Qrenadinlər",
  VE: "Venesuela",
  VG: "Britaniyanın Virgin adaları",
  VI: "ABŞ Virgin adaları",
  VN: "Vyetnam",
  VU: "Vanuatu",
  WF: "Uollis və Futuna",
  WS: "Samoa",
  XK: "Kosovo",
  YE: "Yəmən",
  YT: "Mayot",
  ZA: "Cənub Afrika",
  ZM: "Zambiya",
  ZW: "Zimbabve"
};
const az = {
  locale: locale$19,
  countries: countries$19
};
const locale$18 = "be";
const countries$18 = {
  AD: "Андора",
  AE: "Аб’яднаныя Арабскія Эміраты",
  AF: "Афганістан",
  AG: "Антыгуа і Барбуда",
  AI: "Ангілья",
  AL: "Албанія",
  AM: "Арменія",
  AO: "Ангола",
  AQ: "Антарктыка",
  AR: "Аргенціна",
  AS: "Амерыканскае Самоа",
  AT: "Аўстрыя",
  AU: "Аўстралія",
  AW: "Аруба",
  AX: "Аландскія астравы",
  AZ: "Азербайджан",
  BA: "Боснія і Герцагавіна",
  BB: "Барбадас",
  BD: "Бангладэш",
  BE: "Бельгія",
  BF: "Буркіна-Фасо",
  BG: "Балгарыя",
  BH: "Бахрэйн",
  BI: "Бурундзі",
  BJ: "Бенін",
  BL: "Сен-Бартэльмі",
  BM: "Бермудскія астравы",
  BN: "Бруней",
  BO: "Балівія",
  BQ: "Карыбскія Нідэрланды",
  BR: "Бразілія",
  BS: "Багамы",
  BT: "Бутан",
  BV: "Востраў Бувэ",
  BW: "Батсвана",
  BY: "Беларусь",
  BZ: "Беліз",
  CA: "Канада",
  CC: "Какосавыя (Кілінг) астравы",
  CD: "Конга (Кіншаса)",
  CF: "Цэнтральнаафрыканская Рэспубліка",
  CG: "Конга - Бразавіль",
  CH: "Швейцарыя",
  CI: "Кот-д’Івуар",
  CK: "Астравы Кука",
  CL: "Чылі",
  CM: "Камерун",
  CN: "Кітай",
  CO: "Калумбія",
  CR: "Коста-Рыка",
  CU: "Куба",
  CV: "Каба-Вердэ",
  CW: "Кюрасаа",
  CX: "Востраў Каляд",
  CY: "Кіпр",
  CZ: "Чэхія",
  DE: "Германія",
  DJ: "Джыбуці",
  DK: "Данія",
  DM: "Дамініка",
  DO: "Дамініканская Рэспубліка",
  DZ: "Алжыр",
  EC: "Эквадор",
  EE: "Эстонія",
  EG: "Егіпет",
  EH: "Заходняя Сахара",
  ER: "Эрытрэя",
  ES: "Іспанія",
  ET: "Эфіопія",
  FI: "Фінляндыя",
  FJ: "Фіджы",
  FK: "Фалклендскія астравы",
  FM: "Мікранезія",
  FO: "Фарэрскія астравы",
  FR: "Францыя",
  GA: "Габон",
  GB: "Вялікабрытанія",
  GD: "Грэнада",
  GE: "Грузія",
  GF: "Французская Гвіяна",
  GG: "Гернсі",
  GH: "Гана",
  GI: "Гібралтар",
  GL: "Грэнландыя",
  GM: "Гамбія",
  GN: "Гвінея",
  GP: "Гвадэлупа",
  GQ: "Экватарыяльная Гвінея",
  GR: "Грэцыя",
  GS: "Паўднёвая Джорджыя і Паўднёвыя Сандвічавы астравы",
  GT: "Гватэмала",
  GU: "Гуам",
  GW: "Гвінея-Бісау",
  GY: "Гаяна",
  HK: "Ганконг, САР (Кітай)",
  HM: "Астравы Херд і Макдональд",
  HN: "Гандурас",
  HR: "Харватыя",
  HT: "Гаіці",
  HU: "Венгрыя",
  ID: "Інданезія",
  IE: "Ірландыя",
  IL: "Ізраіль",
  IM: "Востраў Мэн",
  IN: "Індыя",
  IO: "Брытанская тэрыторыя ў Індыйскім акіяне",
  IQ: "Ірак",
  IR: "Іран",
  IS: "Ісландыя",
  IT: "Італія",
  JE: "Джэрсі",
  JM: "Ямайка",
  JO: "Іарданія",
  JP: "Японія",
  KE: "Кенія",
  KG: "Кыргызстан",
  KH: "Камбоджа",
  KI: "Кірыбаці",
  KM: "Каморскія Астравы",
  KN: "Сент-Кітс і Невіс",
  KP: "Паўночная Карэя",
  KR: "Паўднёвая Карэя",
  KW: "Кувейт",
  KY: "Кайманавы астравы",
  KZ: "Казахстан",
  LA: "Лаос",
  LB: "Ліван",
  LC: "Сент-Люсія",
  LI: "Ліхтэнштэйн",
  LK: "Шры-Ланка",
  LR: "Ліберыя",
  LS: "Лесота",
  LT: "Літва",
  LU: "Люксембург",
  LV: "Латвія",
  LY: "Лівія",
  MA: "Марока",
  MC: "Манака",
  MD: "Малдова",
  ME: "Чарнагорыя",
  MF: "Сен-Мартэн",
  MG: "Мадагаскар",
  MH: "Маршалавы Астравы",
  MK: "Рэспубліка Македонія",
  ML: "Малі",
  MM: "М’янма (Бірма)",
  MN: "Манголія",
  MO: "Макаа, САР (Кітай)",
  MP: "Паўночныя Марыянскія астравы",
  MQ: "Марцініка",
  MR: "Маўрытанія",
  MS: "Мантсерат",
  MT: "Мальта",
  MU: "Маўрыкій",
  MV: "Мальдывы",
  MW: "Малаві",
  MX: "Мексіка",
  MY: "Малайзія",
  MZ: "Мазамбік",
  NA: "Намібія",
  NC: "Новая Каледонія",
  NE: "Нігер",
  NF: "Востраў Норфалк",
  NG: "Нігерыя",
  NI: "Нікарагуа",
  NL: "Нідэрланды",
  NO: "Нарвегія",
  NP: "Непал",
  NR: "Науру",
  NU: "Ніуэ",
  NZ: "Новая Зеландыя",
  OM: "Аман",
  PA: "Панама",
  PE: "Перу",
  PF: "Французская Палінезія",
  PG: "Папуа-Новая Гвінея",
  PH: "Філіпіны",
  PK: "Пакістан",
  PL: "Польшча",
  PM: "Сен-П’ер і Мікелон",
  PN: "Астравы Піткэрн",
  PR: "Пуэрта-Рыка",
  PS: "Палесцінскія Тэрыторыі",
  PT: "Партугалія",
  PW: "Палау",
  PY: "Парагвай",
  QA: "Катар",
  RE: "Рэюньён",
  RO: "Румынія",
  RS: "Сербія",
  RU: "Расія",
  RW: "Руанда",
  SA: "Саудаўская Аравія",
  SB: "Саламонавы Астравы",
  SC: "Сейшэльскія Астравы",
  SD: "Судан",
  SE: "Швецыя",
  SG: "Сінгапур",
  SH: "Востраў Святой Алены",
  SI: "Славенія",
  SJ: "Шпіцберген і Ян-Маен",
  SK: "Славакія",
  SL: "Сьера-Леонэ",
  SM: "Сан-Марына",
  SN: "Сенегал",
  SO: "Самалі",
  SR: "Сурынам",
  SS: "Паўднёвы Судан",
  ST: "Сан-Тамэ і Прынсіпі",
  SV: "Сальвадор",
  SX: "Сінт-Мартэн",
  SY: "Сірыя",
  SZ: "Свазіленд",
  TC: "Цёркс і Кайкас",
  TD: "Чад",
  TF: "Французскія Паўднёвыя тэрыторыі",
  TG: "Тога",
  TH: "Тайланд",
  TJ: "Таджыкістан",
  TK: "Такелау",
  TL: "Тымор-Лешці",
  TM: "Туркменістан",
  TN: "Туніс",
  TO: "Тонга",
  TR: "Турцыя",
  TT: "Трынідад і Табага",
  TV: "Тувалу",
  TW: "Тайвань",
  TZ: "Танзанія",
  UA: "Украіна",
  UG: "Уганда",
  UM: "Малыя Аддаленыя астравы ЗША",
  US: "Злучаныя Штаты Амерыкі",
  UY: "Уругвай",
  UZ: "Узбекістан",
  VA: "Ватыкан",
  VC: "Сент-Вінсент і Грэнадзіны",
  VE: "Венесуэла",
  VG: "Брытанскія Віргінскія астравы",
  VI: "Амерыканскія Віргінскія астравы",
  VN: "В’етнам",
  VU: "Вануату",
  WF: "Уоліс і Футуна",
  WS: "Самоа",
  XK: "Косава",
  YE: "Емен",
  YT: "Маёта",
  ZA: "Паўднёваафрыканская Рэспубліка",
  ZM: "Замбія",
  ZW: "Зімбабвэ"
};
const be = {
  locale: locale$18,
  countries: countries$18
};
const locale$17 = "bg";
const countries$17 = {
  AD: "Андора",
  AE: "Обединени арабски емирства",
  AF: "Афганистан",
  AG: "Антигуа и Барбуда",
  AI: "Ангуила",
  AL: "Албания",
  AM: "Армения",
  AO: "Ангола",
  AQ: "Антарктика",
  AR: "Аржентина",
  AS: "Американска Самоа",
  AT: "Австрия",
  AU: "Австралия",
  AW: "Аруба",
  AX: "Оландски острови",
  AZ: "Азербайджан",
  BA: "Босна и Херцеговина",
  BB: "Барбадос",
  BD: "Бангладеш",
  BE: "Белгия",
  BF: "Буркина Фасо",
  BG: "България",
  BH: "Бахрейн",
  BI: "Бурунди",
  BJ: "Бенин",
  BL: "Сен Бартелеми",
  BM: "Бермуда",
  BN: "Бруней Даруссалам",
  BO: "Боливия",
  BQ: "Карибска Нидерландия",
  BR: "Бразилия",
  BS: "Бахами",
  BT: "Бутан",
  BV: "остров Буве",
  BW: "Ботсвана",
  BY: "Беларус",
  BZ: "Белиз",
  CA: "Канада",
  CC: "Кокосови острови (острови Кийлинг)",
  CD: "Конго (Киншаса)",
  CF: "Централноафриканска република",
  CG: "Конго (Бразавил)",
  CH: "Швейцария",
  CI: "Кот д’Ивоар",
  CK: "острови Кук",
  CL: "Чили",
  CM: "Камерун",
  CN: "Китай",
  CO: "Колумбия",
  CR: "Коста Рика",
  CU: "Куба",
  CV: "Кабо Верде",
  CW: "Кюрасао",
  CX: "остров Рождество",
  CY: "Кипър",
  CZ: "Чехия",
  DE: "Германия",
  DJ: "Джибути",
  DK: "Дания",
  DM: "Доминика",
  DO: "Доминиканска република",
  DZ: "Алжир",
  EC: "Еквадор",
  EE: "Естония",
  EG: "Египет",
  EH: "Западна Сахара",
  ER: "Еритрея",
  ES: "Испания",
  ET: "Етиопия",
  FI: "Финландия",
  FJ: "Фиджи",
  FK: "Фолклендски острови",
  FM: "Микронезия",
  FO: "Фарьорски острови",
  FR: "Франция",
  GA: "Габон",
  GB: "Обединеното кралство",
  GD: "Гренада",
  GE: "Грузия",
  GF: "Френска Гвиана",
  GG: "Гърнзи",
  GH: "Гана",
  GI: "Гибралтар",
  GL: "Гренландия",
  GM: "Гамбия",
  GN: "Гвинея",
  GP: "Гваделупа",
  GQ: "Екваториална Гвинея",
  GR: "Гърция",
  GS: "Южна Джорджия и Южни Сандвичеви острови",
  GT: "Гватемала",
  GU: "Гуам",
  GW: "Гвинея-Бисау",
  GY: "Гаяна",
  HK: "Хонконг, САР на Китай",
  HM: "остров Хърд и острови Макдоналд",
  HN: "Хондурас",
  HR: "Хърватия",
  HT: "Хаити",
  HU: "Унгария",
  ID: "Индонезия",
  IE: "Ирландия",
  IL: "Израел",
  IM: "остров Ман",
  IN: "Индия",
  IO: "Британска територия в Индийския океан",
  IQ: "Ирак",
  IR: "Иран",
  IS: "Исландия",
  IT: "Италия",
  JE: "Джърси",
  JM: "Ямайка",
  JO: "Йордания",
  JP: "Япония",
  KE: "Кения",
  KG: "Киргизстан",
  KH: "Камбоджа",
  KI: "Кирибати",
  KM: "Коморски острови",
  KN: "Сейнт Китс и Невис",
  KP: "Северна Корея",
  KR: "Южна Корея",
  KW: "Кувейт",
  KY: "Кайманови острови",
  KZ: "Казахстан",
  LA: "Лаос",
  LB: "Ливан",
  LC: "Сейнт Лусия",
  LI: "Лихтенщайн",
  LK: "Шри Ланка",
  LR: "Либерия",
  LS: "Лесото",
  LT: "Литва",
  LU: "Люксембург",
  LV: "Латвия",
  LY: "Либия",
  MA: "Мароко",
  MC: "Монако",
  MD: "Молдова",
  ME: "Черна гора",
  MF: "Сен Мартен",
  MG: "Мадагаскар",
  MH: "Маршалови острови",
  MK: "Северна Македония",
  ML: "Мали",
  MM: "Мианмар (Бирма)",
  MN: "Монголия",
  MO: "Макао, САР на Китай",
  MP: "Северни Мариански острови",
  MQ: "Мартиника",
  MR: "Мавритания",
  MS: "Монтсерат",
  MT: "Малта",
  MU: "Мавриций",
  MV: "Малдиви",
  MW: "Малави",
  MX: "Мексико",
  MY: "Малайзия",
  MZ: "Мозамбик",
  NA: "Намибия",
  NC: "Нова Каледония",
  NE: "Нигер",
  NF: "остров Норфолк",
  NG: "Нигерия",
  NI: "Никарагуа",
  NL: "Нидерландия",
  NO: "Норвегия",
  NP: "Непал",
  NR: "Науру",
  NU: "Ниуе",
  NZ: "Нова Зеландия",
  OM: "Оман",
  PA: "Панама",
  PE: "Перу",
  PF: "Френска Полинезия",
  PG: "Папуа-Нова Гвинея",
  PH: "Филипини",
  PK: "Пакистан",
  PL: "Полша",
  PM: "Сен Пиер и Микелон",
  PN: "Острови Питкерн",
  PR: "Пуерто Рико",
  PS: "Палестински територии",
  PT: "Португалия",
  PW: "Палау",
  PY: "Парагвай",
  QA: "Катар",
  RE: "Реюнион",
  RO: "Румъния",
  RS: "Сърбия",
  RU: "Русия",
  RW: "Руанда",
  SA: "Саудитска Арабия",
  SB: "Соломонови острови",
  SC: "Сейшели",
  SD: "Судан",
  SE: "Швеция",
  SG: "Сингапур",
  SH: "Света Елена",
  SI: "Словения",
  SJ: "Свалбард и Ян Майен",
  SK: "Словакия",
  SL: "Сиера Леоне",
  SM: "Сан Марино",
  SN: "Сенегал",
  SO: "Сомалия",
  SR: "Суринам",
  SS: "Южен Судан",
  ST: "Сао Томе и Принсипи",
  SV: "Салвадор",
  SX: "Синт Мартен",
  SY: "Сирия",
  SZ: "Свазиленд",
  TC: "острови Търкс и Кайкос",
  TD: "Чад",
  TF: "Френски южни територии",
  TG: "Того",
  TH: "Тайланд",
  TJ: "Таджикистан",
  TK: "Токелау",
  TL: "Източен Тимор",
  TM: "Туркменистан",
  TN: "Тунис",
  TO: "Тонга",
  TR: "Турция",
  TT: "Тринидад и Тобаго",
  TV: "Тувалу",
  TW: "Тайван",
  TZ: "Танзания",
  UA: "Украйна",
  UG: "Уганда",
  UM: "Отдалечени острови на САЩ",
  US: "Съединени щати",
  UY: "Уругвай",
  UZ: "Узбекистан",
  VA: "Ватикан",
  VC: "Сейнт Винсънт и Гренадини",
  VE: "Венецуела",
  VG: "Британски Вирджински острови",
  VI: "Американски Вирджински острови",
  VN: "Виетнам",
  VU: "Вануату",
  WF: "Уолис и Футуна",
  WS: "Самоа",
  XK: "Косово",
  YE: "Йемен",
  YT: "Майот",
  ZA: "Южна Африка",
  ZM: "Замбия",
  ZW: "Зимбабве"
};
const bg = {
  locale: locale$17,
  countries: countries$17
};
const locale$16 = "bn";
const countries$16 = {
  AD: "অ্যান্ডোরা",
  AE: "সংযুক্ত আরব আমিরাত",
  AF: "আফগানিস্তান",
  AG: "অ্যান্টিগুয়া ও বার্বুডা",
  AI: "এ্যাঙ্গুইলা",
  AL: "আলবেনিয়া",
  AM: "আর্মেনিয়া",
  AO: "অ্যাঙ্গোলা",
  AQ: "অ্যান্টার্কটিকা",
  AR: "আর্জেন্টিনা",
  AS: "আমেরিকান সামোয়া",
  AT: "অস্ট্রিয়া",
  AU: "অস্ট্রেলিয়া",
  AW: "আরুবা",
  AX: "অলান্দ দ্বীপপুঞ্জ",
  AZ: "আজারবাইজান",
  BA: "বসনিয়া ও হার্জেগোভিনা",
  BB: "বার্বাডোস",
  BD: "বাংলাদেশ",
  BE: "বেলজিয়াম",
  BF: "বুর্কিনা ফাসো",
  BG: "বুলগেরিয়া",
  BH: "বাহরাইন",
  BI: "বুরুন্ডি",
  BJ: "বেনিন",
  BL: "সেন্ট বার্থলেমি",
  BM: "বারমুডা",
  BN: "ব্রুনাই দারুসালাম",
  BO: "বলিভিয়া, বহুজাতিক রাষ্ট্র",
  BQ: "ক্যারিবীয় নেদারল্যান্ডস",
  BR: "ব্রাজিল",
  BS: "বাহামা দ্বীপপুঞ্জ",
  BT: "ভূটান",
  BV: "বোভেট দ্বীপ",
  BW: "বতসোয়ানা",
  BY: "বেলারুশ",
  BZ: "বেলিজ",
  CA: "কানাডা",
  CC: "কোকোস (কিলিং) দ্বীপপুঞ্জ",
  CD: "গণতান্ত্রিক কঙ্গো প্রজাতন্ত্র",
  CF: "মধ্য আফ্রিকান প্রজাতন্ত্র",
  CG: "কঙ্গো প্রজাতন্ত্র",
  CH: "সুইজারল্যান্ড",
  CI: "কোত দিভোয়ার",
  CK: "কুক দ্বীপপুঞ্জ",
  CL: "চিলি",
  CM: "ক্যামেরুন",
  CN: "গণচীন",
  CO: "কলম্বিয়া",
  CR: "কোস্টা রিকা",
  CU: "কিউবা",
  CV: "কেপ ভার্দ",
  CW: "কিউরাসাও",
  CX: "ক্রিস্টমাস দ্বীপ",
  CY: "সাইপ্রাস",
  CZ: "চেক প্রজাতন্ত্র",
  DE: "জার্মানি",
  DJ: "জিবুতি",
  DK: "ডেনমার্ক",
  DM: "ডোমিনিকা",
  DO: "ডোমিনিকান প্রজাতন্ত্র",
  DZ: "আলজেরিয়া",
  EC: "ইকুয়েডর",
  EE: "এস্তোনিয়া",
  EG: "মিশর",
  EH: "পশ্চিম সাহারা",
  ER: "ইরিত্রিয়া",
  ES: "স্পেন",
  ET: "ইথিওপিয়া",
  FI: "ফিনল্যান্ড",
  FJ: "ফিজি",
  FK: "ফক্‌ল্যান্ড দ্বীপপুঞ্জ (মালভিনাস)",
  FM: "মাইক্রোনেশিয়া যুক্তরাজ্য",
  FO: "ফারো দ্বীপপুঞ্জ",
  FR: "ফ্রান্স",
  GA: "গাবন",
  GB: "যুক্তরাজ্য এবং উত্তর আয়ারল্যান্ড",
  GD: "গ্রানাডা",
  GE: "জর্জিয়া",
  GF: "ফরাসি গায়ানা",
  GG: "Guernsey",
  GH: "ঘানা",
  GI: "জিব্রাল্টার",
  GL: "গ্রিনল্যান্ড",
  GM: "গাম্বিয়া",
  GN: "গিনি",
  GP: "গুয়াদলুপ",
  GQ: "বিষুবীয় গিনি",
  GR: "গ্রিস",
  GS: "দক্ষিণ জর্জিয়া ও দক্ষিণ স্যান্ডউইচ দ্বীপপুঞ্জ",
  GT: "গুয়াতেমালা",
  GU: "গুয়াম",
  GW: "গিনি-বিসাউ",
  GY: "গায়ানা",
  HK: "হংকং",
  HM: "হার্ড দ্বীপ এবং ম্যাকডোনাল্ড দ্বীপপুঞ্জ",
  HN: "হন্ডুরাস",
  HR: "ক্রোয়েশিয়া",
  HT: "হাইতি",
  HU: "হাঙ্গেরি",
  ID: "ইন্দোনেশিয়া",
  IE: "প্রজাতন্ত্রী আয়ারল্যান্ড",
  IL: "ইসরায়েল",
  IM: "আইল অব ম্যান",
  IN: "ভারত",
  IO: "ব্রিটিশ ভারত মহাসাগরীয় এলাকা",
  IQ: "ইরাক",
  IR: "ইরান",
  IS: "আইসল্যান্ড",
  IT: "ইতালি",
  JE: "Jersey",
  JM: "জামাইকা",
  JO: "জর্দান",
  JP: "জাপান",
  KE: "কেনিয়া",
  KG: "কির্গিজস্তান",
  KH: "কম্বোডিয়া",
  KI: "কিরিবাস",
  KM: "কোমোরোস",
  KN: "সেন্ট কিট্‌স ও নেভিস",
  KP: "কোরিয়া গণতান্ত্রিক গণপ্রজাতন্ত্রী",
  KR: "কোরিয়া প্রজাতন্ত্র",
  KW: "কুয়েত",
  KY: "কেইম্যান দ্বীপপুঞ্জ",
  KZ: "কাজাখস্তান",
  LA: "গণতান্ত্রিক গণপ্রজাতন্ত্রী লাওস",
  LB: "লেবানন",
  LC: "সেন্ট লুসিয়া",
  LI: "লিশটেনস্টাইন",
  LK: "শ্রীলঙ্কা",
  LR: "লাইবেরিয়া",
  LS: "লেসোথো",
  LT: "লিথুয়ানিয়া",
  LU: "লুক্সেমবুর্গ",
  LV: "লাতভিয়া",
  LY: "লিবিয়া",
  MA: "মরোক্কো",
  MC: "মোনাকো",
  MD: "মলদোভা প্রজাতন্ত্র",
  ME: "মন্টিনিগ্রো",
  MF: "সেন্ট মার্টিন (ফরাসি অংশ)",
  MG: "মাদাগাস্কার",
  MH: "মার্শাল দ্বীপপুঞ্জ",
  MK: "ম্যাসেডোনিয়ার প্রাক্তন যুগোস্লাভ প্রজাতন্ত্র",
  ML: "মালি",
  MM: "মায়ানমার",
  MN: "মঙ্গোলিয়া",
  MO: "মাকাও",
  MP: "উত্তর মারিয়ানা দ্বীপপুঞ্জ",
  MQ: "মার্তিনিক",
  MR: "মৌরিতানিয়া",
  MS: "মন্টসেরাট",
  MT: "মাল্টা",
  MU: "মরিশাস",
  MV: "মালদ্বীপ",
  MW: "মালাউই",
  MX: "মেক্সিকো",
  MY: "মালয়েশিয়া",
  MZ: "মোজাম্বিক",
  NA: "নামিবিয়া",
  NC: "নিউ ক্যালিডোনিয়া",
  NE: "নাইজার",
  NF: "নরফোক দ্বীপ",
  NG: "নাইজেরিয়া",
  NI: "নিকারাগুয়া",
  NL: "নেদারল্যান্ডস",
  NO: "নরওয়ে",
  NP: "নেপাল",
  NR: "নাউরু",
  NU: "নিউয়ে",
  NZ: "নিউজিল্যান্ড",
  OM: "ওমান",
  PA: "পানামা",
  PE: "পেরু",
  PF: "ফরাসি পলিনেশিয়া",
  PG: "পাপুয়া নিউগিনি",
  PH: "ফিলিপাইন",
  PK: "পাকিস্তান",
  PL: "পোল্যান্ড",
  PM: "সাঁ পিয়ের ও মিক‌লোঁ",
  PN: "পিটকেয়ার্ন",
  PR: "পুয়ের্তো রিকো",
  PS: "ফিলিস্তিন রাষ্ট্র",
  PT: "পর্তুগাল",
  PW: "পালাউ",
  PY: "প্যারাগুয়ে",
  QA: "কাতার",
  RE: "রেউনিওঁ",
  RO: "রোমানিয়া",
  RS: "সার্বিয়া",
  RU: "রাশিয়া",
  RW: "রুয়ান্ডা",
  SA: "সৌদি আরব",
  SB: "সলোমন দ্বীপপুঞ্জ",
  SC: "সেশেল",
  SD: "সুদান",
  SE: "সুইডেন",
  SG: "সিঙ্গাপুর",
  SH: "সেন্ট হেলেনা, অ্যাসেনশন ও ত্রিস্তান দা কুনহা",
  SI: "স্লোভেনিয়া",
  SJ: "স্বালবার্ড ও জান মায়েন",
  SK: "স্লোভাকিয়া",
  SL: "সিয়েরা লিওন",
  SM: "সান মারিনো",
  SN: "সেনেগাল",
  SO: "সোমালিয়া",
  SR: "সুরিনাম",
  SS: "দক্ষিণ সুদান",
  ST: "সাঁউ তুমি ও প্রিন্সিপি",
  SV: "এল সালভাদোর",
  SX: "সিন্ট মার্টেন (ওলন্দাজ অংশ)",
  SY: "আরব প্রজাতন্ত্র সিরিয়া",
  SZ: "সোয়াজিল্যান্ড",
  TC: "টার্কস্‌ ও কেইকোস দ্বীপপুঞ্জ",
  TD: "চাদ",
  TF: "ফরাসি সাউদার্ন টেরিটোরিজ",
  TG: "টোগো",
  TH: "থাইল্যান্ড",
  TJ: "তাজিকিস্তান",
  TK: "টোকেলাউ",
  TL: "তিমোর্‌ ল্যেশ্ত্যি",
  TM: "তুর্কমেনিস্তান",
  TN: "তিউনিসিয়া",
  TO: "টোঙ্গা",
  TR: "তুরস্ক",
  TT: "ত্রিনিদাদ ও টোবাগো",
  TV: "টুভালু",
  TW: "তাইওয়ান, চীনের প্রদেশ",
  TZ: "তানজানিয়া যুক্তপ্রজাতন্ত্র",
  UA: "ইউক্রেন",
  UG: "উগান্ডা",
  UM: "মার্কিন যুক্তরাষ্ট্রের ক্ষুদ্র পার্শ্ববর্তী দ্বীপপুঞ্জ",
  US: "মার্কিন যুক্তরাষ্ট্র",
  UY: "উরুগুয়ে",
  UZ: "উজবেকিস্তান",
  VA: "ভ্যাটিকান সিটি",
  VC: "সেন্ট ভিনসেন্ট ও গ্রেনাডাইন দ্বীপপুঞ্জ",
  VE: "ভেনেজুয়েলার বোলিভিয় প্রজাতন্ত্র",
  VG: "ব্রিটিশ ভার্জিন দ্বীপপুঞ্জ",
  VI: "মার্কিন ভার্জিন দ্বীপপুঞ্জ ",
  VN: "ভিয়েত নাম",
  VU: "ভানুয়াটু",
  WF: "ওয়ালিম ও ফুটুনা দ্বীপপুঞ্জের",
  WS: "সামোয়া",
  XK: "কসোভো",
  YE: "ইয়েমেন",
  YT: "মায়োত",
  ZA: "দক্ষিণ আফ্রিকা",
  ZM: "জাম্বিয়া",
  ZW: "জিম্বাবুয়ে"
};
const bn = {
  locale: locale$16,
  countries: countries$16
};
const locale$15 = "br";
const countries$15 = {
  AD: "Andorra",
  AE: "Emirelezhioù Arab Unanet",
  AF: "Afghanistan",
  AG: "Antigua ha Barbuda",
  AI: "Anguilla",
  AL: "Albania",
  AM: "Armenia",
  AO: "Angola",
  AQ: "Antarktika",
  AR: "Arc'hantina",
  AS: "Samoa Amerikan",
  AT: "Aostria",
  AU: "Aostralia",
  AW: "Aruba",
  AX: "Åland",
  AZ: "Azerbaidjan",
  BA: "Bosnia ha Herzegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgia",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrein",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint-Barthélemy",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivia",
  BQ: "Bonaire, Sint Eustatius ha Saba",
  BR: "Brazil",
  BS: "Bahamas",
  BT: "Bhoutan",
  BV: "Enez Bouvet",
  BW: "Botswana",
  BY: "Belarus",
  BZ: "Belize",
  CA: "Kanada",
  CC: "Inizi Cocos (Keeling)",
  CD: "Kongo-Kinshasa",
  CF: "Republik Kreizafrikan",
  CG: "Kongo-Brazzaville",
  CH: "Suis",
  CI: "Aod an Olifant",
  CK: "Inizi Cook",
  CL: "Chile",
  CM: "Kameroun",
  CN: "Sina",
  CO: "Kolombia",
  CR: "Costa Rica",
  CU: "Kuba",
  CV: "Kab Glas",
  CW: "Curaçao",
  CX: "Enez Christmas",
  CY: "Kiprenez",
  CZ: "Tchekia",
  DE: "Alamagn",
  DJ: "Djibouti",
  DK: "Danmark",
  DM: "Dominica",
  DO: "Republik Dominikan",
  DZ: "Aljeria",
  EC: "Ecuador",
  EE: "Estonia",
  EG: "Egipt",
  EH: "Sahara ar C'hornôg",
  ER: "Eritrea",
  ES: "Spagn",
  ET: "Etiopia",
  FI: "Finland",
  FJ: "Fidji",
  FK: "Inizi Maloù",
  FM: "Mikronezia",
  FO: "Inizi Faero",
  FR: "Frañs",
  GA: "Gabon",
  GB: "Rouantelezh-Unanet",
  GD: "Grenada",
  GE: "Jorjia",
  GF: "Gwiana C'hall",
  GG: "Gwernenez",
  GH: "Ghana",
  GI: "Jibraltar",
  GL: "Greunland",
  GM: "Gambia",
  GN: "Ginea",
  GP: "Gwadeloup",
  GQ: "Ginea ar C'heheder",
  GR: "Gres",
  GS: "Georgia ar Su hag Inizi Sandwich ar Su",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Ginea-Bissau",
  GY: "Guyana",
  HK: "Hong Kong",
  HM: "Inizi Heard ha McDonald",
  HN: "Honduras",
  HR: "Kroatia",
  HT: "Haiti",
  HU: "Hungaria",
  ID: "Indonezia",
  IE: "Iwerzhon",
  IL: "Israel",
  IM: "Enez Vanav",
  IN: "India",
  IO: "Tiriad breizhveurat Meurvor Indez",
  IQ: "Irak",
  IR: "Iran",
  IS: "Island",
  IT: "Italia",
  JE: "Jerzenez",
  JM: "Jamaika",
  JO: "Jordania",
  JP: "Japan",
  KE: "Kenya",
  KG: "Kirgizstan",
  KH: "Kambodja",
  KI: "Kiribati",
  KM: "Komorez",
  KN: "Saint Kitts ha Nevis",
  KP: "Korea an Norzh",
  KR: "Korea ar Su",
  KW: "Koweit",
  KY: "Inizi Cayman",
  KZ: "Kazakstan",
  LA: "Laos",
  LB: "Liban",
  LC: "Santez-Lusia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberia",
  LS: "Lesotho",
  LT: "Lituania",
  LU: "Luksembourg",
  LV: "Latvia",
  LY: "Libia",
  MA: "Maroko",
  MC: "Monaco",
  MD: "Moldova",
  ME: "Montenegro",
  MF: "Saint-Martin",
  MG: "Madagaskar",
  MH: "Inizi Marshall",
  MK: "Makedonia an Norzh",
  ML: "Mali",
  MM: "Myanmar",
  MN: "Mongolia",
  MO: "Makao",
  MP: "Inizi Mariana an Norzh",
  MQ: "Martinik",
  MR: "Maouritania",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Moris",
  MV: "Maldivez",
  MW: "Malawi",
  MX: "Mec'hiko",
  MY: "Malaysia",
  MZ: "Mozambik",
  NA: "Namibia",
  NC: "Kaledonia-Nevez",
  NE: "Niger",
  NF: "Enez Norfolk",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Izelvroioù",
  NO: "Norvegia",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Zeland-Nevez",
  OM: "Oman",
  PA: "Panama",
  PE: "Perou",
  PF: "Polinezia C'hall",
  PG: "Papoua-Ginea Nevez",
  PH: "Filipinez",
  PK: "Pakistan",
  PL: "Polonia",
  PM: "Sant-Pêr-ha-Mikelon",
  PN: "Inizi Pitcairn",
  PR: "Puerto Rico",
  PS: "Palestina",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Katar",
  RE: "Reünion",
  RO: "Roumania",
  RS: "Serbia",
  RU: "Rusia",
  RW: "Rwanda",
  SA: "Arabia Saoudat",
  SB: "Inizi Salomon",
  SC: "Sechelez",
  SD: "Soudan",
  SE: "Sveden",
  SG: "Singapour",
  SH: "Saint Helena, Ascension, ha Tristan da Cunha",
  SI: "Slovenia",
  SJ: "Svalbard ha Jan Mayen",
  SK: "Slovakia",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalia",
  SR: "Surinam",
  SS: "Soudan ar Su",
  ST: "São Tomé ha Príncipe",
  SV: "El Salvador",
  SX: "Sint Maarten",
  SY: "Siria",
  SZ: "Eswatini",
  TC: "Inizi Turks ha Caicos",
  TD: "Tchad",
  TF: "Douaroù Aostral hag Antarktikel Frañs",
  TG: "Togo",
  TH: "Thailand",
  TJ: "Tadjikistan",
  TK: "Tokelau",
  TL: "Timor ar Reter",
  TM: "Turkmenistan",
  TN: "Tunizia",
  TO: "Tonga",
  TR: "Turkia",
  TT: "Trinidad ha Tobago",
  TV: "Tuvalu",
  TW: "Taiwan",
  TZ: "Tanzania",
  UA: "Ukraina",
  UG: "Ouganda",
  UM: "Inizi Minor A-bell Stadoù-Unanet",
  US: "Stadoù-Unanet",
  UY: "Uruguay",
  UZ: "Ouzbekistan",
  VA: "Vatikan",
  VC: "Sant Visant hag ar Grenadinez",
  VE: "Venezuela",
  VG: "Inizi Gwerc'h Breizhveurat",
  VI: "Inizi Gwerc'h ar Stadoù Unanet",
  VN: "Viêt Nam",
  VU: "Vanuatu",
  WF: "Wallis ha Futuna",
  WS: "Samoa",
  XK: "Kosovo",
  YE: "Yemen",
  YT: "Mayotte",
  ZA: "Suafrika",
  ZM: "Zambia",
  ZW: "Zimbabwe"
};
const br = {
  locale: locale$15,
  countries: countries$15
};
const locale$14 = "bs";
const countries$14 = {
  AD: "Andora",
  AE: "Ujedinjeni Arapski Emirati",
  AF: "Afganistan",
  AG: "Antigva i Barbuda",
  AI: "Angvila",
  AL: "Albanija",
  AM: "Armenija",
  AO: "Angola",
  AQ: "Antarktika",
  AR: "Argentina",
  AS: "Američka Samoa",
  AT: "Austrija",
  AU: "Australija",
  AW: "Aruba",
  AX: "Olandska Ostrva",
  AZ: "Azerbejdžan",
  BA: "Bosna i Hercegovina",
  BB: "Barbados",
  BD: "Bangladeš",
  BE: "Belgija",
  BF: "Burkina Faso",
  BG: "Bugarska",
  BH: "Bahrein",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Sveti Bartolomej",
  BM: "Bermuda",
  BN: "Brunej",
  BO: "Bolivija",
  BQ: "Karipska Holandija",
  BR: "Brazil",
  BS: "Bahami",
  BT: "Butan",
  BV: "Ostrvo Buve",
  BW: "Bocvana",
  BY: "Bjelorusija",
  BZ: "Belize",
  CA: "Kanada",
  CC: "Kokosova (Kilingova) Ostrva",
  CD: "Demokratska Republika Kongo",
  CF: "Centralnoafrička Republika",
  CG: "Kongo",
  CH: "Švicarska",
  CI: "Obala Slonovače",
  CK: "Kukova Ostrva",
  CL: "Čile",
  CM: "Kamerun",
  CN: "Kina",
  CO: "Kolumbija",
  CR: "Kostarika",
  CU: "Kuba",
  CV: "Kape Verde",
  CW: "Kurasao",
  CX: "Božićna Ostrva",
  CY: "Kipar",
  CZ: "Češka",
  DE: "Njemačka",
  DJ: "Džibuti",
  DK: "Danska",
  DM: "Dominika",
  DO: "Dominikanska Republika",
  DZ: "Alžir",
  EC: "Ekvador",
  EE: "Estonija",
  EG: "Egipat",
  EH: "Zapadna Sahara",
  ER: "Eritreja",
  ES: "Španija",
  ET: "Etiopija",
  FI: "Finska",
  FJ: "Fidži",
  FK: "Folklandska Ostrva",
  FM: "Mikronezija",
  FO: "Farska Ostrva",
  FR: "Francuska",
  GA: "Gabon",
  GB: "Velika Britanija",
  GD: "Grenada",
  GE: "Gruzija",
  GF: "Francuska Gvajana",
  GG: "Gernzi",
  GH: "Gana",
  GI: "Gibraltar",
  GL: "Grenland",
  GM: "Gambija",
  GN: "Gvineja",
  GP: "Gvadalupe",
  GQ: "Ekvatorijalna Gvineja",
  GR: "Grčka",
  GS: "Južna Džordžija i Južna Sendvička Ostrva",
  GT: "Gvatemala",
  GU: "Guam",
  GW: "Gvineja-Bisao",
  GY: "Gvajana",
  HK: "Hong Kong (SAR Kina)",
  HM: "Herd i arhipelag MekDonald",
  HN: "Honduras",
  HR: "Hrvatska",
  HT: "Haiti",
  HU: "Mađarska",
  ID: "Indonezija",
  IE: "Irska",
  IL: "Izrael",
  IM: "Ostrvo Man",
  IN: "Indija",
  IO: "Britanska Teritorija u Indijskom Okeanu",
  IQ: "Irak",
  IR: "Iran",
  IS: "Island",
  IT: "Italija",
  JE: "Džerzi",
  JM: "Jamajka",
  JO: "Jordan",
  JP: "Japan",
  KE: "Kenija",
  KG: "Kirgistan",
  KH: "Kambodža",
  KI: "Kiribati",
  KM: "Komorska Ostrva",
  KN: "Sveti Kits i Nevis",
  KP: "Sjeverna Koreja",
  KR: "Južna Koreja",
  KW: "Kuvajt",
  KY: "Kajmanska Ostrva",
  KZ: "Kazahstan",
  LA: "Laos",
  LB: "Liban",
  LC: "Sveta Lucija",
  LI: "Lihtenštajn",
  LK: "Šri Lanka",
  LR: "Liberija",
  LS: "Lesoto",
  LT: "Litvanija",
  LU: "Luksemburg",
  LV: "Latvija",
  LY: "Libija",
  MA: "Maroko",
  MC: "Monako",
  MD: "Moldavija",
  ME: "Crna Gora",
  MF: "Sv. Martin",
  MG: "Madagaskar",
  MH: "Maršalova Ostrva",
  MK: "Sjeverna Makedonija",
  ML: "Mali",
  MM: "Mijanmar",
  MN: "Mongolija",
  MO: "Makao (SAR Kina)",
  MP: "Sjeverna Marijanska Ostrva",
  MQ: "Martinik",
  MR: "Mauritanija",
  MS: "Monserat",
  MT: "Malta",
  MU: "Mauricijus",
  MV: "Maldivi",
  MW: "Malavi",
  MX: "Meksiko",
  MY: "Malezija",
  MZ: "Mozambik",
  NA: "Namibija",
  NC: "Nova Kaledonija",
  NE: "Niger",
  NF: "Ostrvo Norfolk",
  NG: "Nigerija",
  NI: "Nikaragva",
  NL: "Holandija",
  NO: "Norveška",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Novi Zeland",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "Francuska Polinezija",
  PG: "Papua Nova Gvineja",
  PH: "Filipini",
  PK: "Pakistan",
  PL: "Poljska",
  PM: "Sveti Petar i Mikelon",
  PN: "Pitkernska Ostrva",
  PR: "Porto Riko",
  PS: "Palestinska Teritorija",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paragvaj",
  QA: "Katar",
  RE: "Reunion",
  RO: "Rumunija",
  RS: "Srbija",
  RU: "Rusija",
  RW: "Ruanda",
  SA: "Saudijska Arabija",
  SB: "Solomonska Ostrva",
  SC: "Sejšeli",
  SD: "Sudan",
  SE: "Švedska",
  SG: "Singapur",
  SH: "Sveta Helena",
  SI: "Slovenija",
  SJ: "Svalbard i Jan Majen",
  SK: "Slovačka",
  SL: "Sijera Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalija",
  SR: "Surinam",
  SS: "Južni Sudan",
  ST: "Sao Tome i Principe",
  SV: "Salvador",
  SX: "Sint Marten",
  SY: "Sirija",
  SZ: "Svazilend",
  TC: "Ostrva Turks i Kaikos",
  TD: "Čad",
  TF: "Francuske Južne Teritorije",
  TG: "Togo",
  TH: "Tajland",
  TJ: "Tadžikistan",
  TK: "Tokelau",
  TL: "Istočni Timor",
  TM: "Turkmenistan",
  TN: "Tunis",
  TO: "Tonga",
  TR: "Turska",
  TT: "Trinidad i Tobago",
  TV: "Tuvalu",
  TW: "Tajvan",
  TZ: "Tanzanija",
  UA: "Ukrajina",
  UG: "Uganda",
  UM: "Američka Vanjska Ostrva",
  US: "Sjedinjene Američke Države",
  UY: "Urugvaj",
  UZ: "Uzbekistan",
  VA: "Vatikan",
  VC: "Sveti Vinsent i Grenadin",
  VE: "Venecuela",
  VG: "Britanska Djevičanska Ostrva",
  VI: "Američka Djevičanska Ostrva",
  VN: "Vijetnam",
  VU: "Vanuatu",
  WF: "Ostrva Valis i Futuna",
  WS: "Samoa",
  XK: "Kosovo",
  YE: "Jemen",
  YT: "Majote",
  ZA: "Južnoafrička Republika",
  ZM: "Zambija",
  ZW: "Zimbabve"
};
const bs = {
  locale: locale$14,
  countries: countries$14
};
const locale$13 = "ca";
const countries$13 = {
  AF: "Afganistan",
  AX: "Åland, illes",
  AL: "Albània",
  DE: "Alemanya",
  DZ: "Algèria",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antàrtida",
  AG: "Antigua i Barbuda",
  SA: "Aràbia Saudita",
  AR: "Argentina",
  AM: "Armènia",
  AW: "Aruba",
  AU: "Austràlia",
  AT: "Àustria",
  AZ: "Azerbaidjan",
  BS: "Bahames",
  BH: "Bahrain",
  BD: "Bangla Desh",
  BB: "Barbados",
  BE: "Bèlgica",
  BZ: "Belize",
  BJ: "Benín",
  BM: "Bermudes",
  BT: "Bhutan",
  BY: "Bielorússia",
  BO: "Bolívia",
  BQ: "Bonaire, Sint Eustatius i Saba",
  BA: "Bòsnia i Hercegovina",
  BW: "Botswana",
  BV: "Bouvet",
  BR: "Brasil",
  BN: "Brunei",
  BG: "Bulgària",
  BF: "Burkina Faso",
  BI: "Burundi",
  KY: "Caiman, illes",
  KH: "Cambodja",
  CM: "Camerun",
  CA: "Canadà",
  CV: "Cap Verd",
  CF: "Centreafricana, República",
  CX: "Christmas, illa",
  CC: "Cocos, illes",
  CO: "Colòmbia",
  KM: "Comores",
  CG: "Congo, República del",
  CD: "Congo, República Democràtica del",
  CK: "Cook, illes",
  KP: "Corea del Nord",
  KR: "Corea del Sud",
  CI: "Costa d'Ivori",
  CR: "Costa Rica",
  HR: "Croàcia",
  CU: "Cuba",
  CW: "Curaçao",
  DK: "Dinamarca",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominicana, República",
  EG: "Egipte",
  EC: "Equador",
  AE: "Emirats Àrabs Units",
  ER: "Eritrea",
  SK: "Eslovàquia",
  SI: "Eslovènia",
  ES: "Espanya",
  US: "Estats Units (EUA)",
  EE: "Estònia",
  ET: "Etiòpia",
  FO: "Fèroe, illes",
  FJ: "Fiji",
  PH: "Filipines",
  FI: "Finlàndia",
  FR: "França",
  GA: "Gabon",
  GM: "Gàmbia",
  GE: "Geòrgia",
  GS: "Geòrgia del Sud i Sandwich del Sud, illes",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Grècia",
  GD: "Grenada",
  GL: "Groenlàndia",
  GP: "Guadeloupe",
  GF: "Guaiana Francesa",
  GU: "Guam",
  GT: "Guatemala",
  GG: "Guernsey",
  GN: "República de Guinea",
  GW: "Guinea Bissau",
  GQ: "Guinea Equatorial",
  GY: "Guyana",
  HT: "Haití",
  HM: "Heard, illa i McDonald, illes",
  HN: "Hondures",
  HK: "Hong Kong",
  HU: "Hongria",
  YE: "Iemen",
  IM: "Illa de Man",
  UM: "Illes Perifèriques Menors dels EUA",
  IN: "Índia",
  ID: "Indonèsia",
  IR: "Iran",
  IQ: "Iraq",
  IE: "Irlanda",
  IS: "Islàndia",
  IL: "Israel",
  IT: "Itàlia",
  JM: "Jamaica",
  JP: "Japó",
  JE: "Jersey",
  JO: "Jordània",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KG: "Kirguizistan",
  KI: "Kiribati",
  KW: "Kuwait",
  LA: "Laos",
  LS: "Lesotho",
  LV: "Letònia",
  LB: "Líban",
  LR: "Libèria",
  LY: "Líbia",
  LI: "Liechtenstein",
  LT: "Lituània",
  LU: "Luxemburg",
  MO: "Macau",
  MK: "Macedònia del Nord",
  MG: "Madagascar",
  MY: "Malàisia",
  MW: "Malawi",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  FK: "Malvines, illes",
  MP: "Mariannes Septentrionals, illes",
  MA: "Marroc",
  MH: "Marshall, illes",
  MQ: "Martinica",
  MU: "Maurici",
  MR: "Mauritània",
  YT: "Mayotte",
  MX: "Mèxic",
  FM: "Micronèsia, Estats Federats de",
  MZ: "Moçambic",
  MD: "Moldàvia",
  MC: "Mònaco",
  MN: "Mongòlia",
  ME: "Montenegro",
  MS: "Montserrat",
  MM: "Myanmar",
  NA: "Namíbia",
  NR: "Nauru",
  NP: "Nepal",
  NI: "Nicaragua",
  NE: "Níger",
  NG: "Nigèria",
  NU: "Niue",
  NF: "Norfolk, illa",
  NO: "Noruega",
  NC: "Nova Caledònia",
  NZ: "Nova Zelanda",
  OM: "Oman",
  NL: "Països Baixos",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestina",
  PA: "Panamà",
  PG: "Papua Nova Guinea",
  PY: "Paraguai",
  PE: "Perú",
  PN: "Pitcairn, illes",
  PF: "Polinèsia Francesa",
  PL: "Polònia",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  GB: "Regne Unit",
  RE: "Reunió, illa de la",
  RO: "Romania",
  RU: "Rússia",
  RW: "Ruanda",
  EH: "Sàhara Occidental",
  KN: "Saint Kitts i Nevis",
  LC: "Saint Lucia",
  PM: "Saint-Pierre i Miquelon",
  VC: "Saint Vincent i les Grenadines",
  BL: "Saint-Barthélemy",
  MF: "Saint-Martin",
  SB: "Salomó",
  SV: "Salvador, El",
  WS: "Samoa",
  AS: "Samoa Nord-americana",
  SM: "San Marino",
  SH: "Santa Helena",
  ST: "São Tomé i Príncipe",
  SN: "Senegal",
  RS: "Sèrbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapur",
  SX: "Sint Maarten",
  SY: "Síria",
  SO: "Somàlia",
  LK: "Sri Lanka",
  ZA: "Sud-àfrica",
  SD: "Sudan",
  SS: "Sudan del Sud",
  SE: "Suècia",
  CH: "Suïssa",
  SR: "Surinam",
  SJ: "Svalbard i Jan Mayen",
  SZ: "Swazilàndia",
  TJ: "Tadjikistan",
  TH: "Tailàndia",
  TW: "Taiwan",
  TZ: "Tanzània",
  IO: "Territori Britànic de l'Oceà Índic",
  TF: "Territoris Francesos del Sud",
  TL: "Timor Oriental",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinitat i Tobago",
  TN: "Tunísia",
  TM: "Turkmenistan",
  TC: "Turks i Caicos, illes",
  TR: "Turquia",
  TV: "Tuvalu",
  TD: "Txad",
  CZ: "Txèquia",
  UA: "Ucraïna",
  UG: "Uganda",
  UY: "Uruguai",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VA: "Vaticà, Ciutat del",
  VE: "Veneçuela",
  VG: "Verges Britàniques, illes",
  VI: "Verges Nord-americanes, illes",
  VN: "Vietnam",
  WF: "Wallis i Futuna",
  CL: "Xile",
  CN: "Xina",
  CY: "Xipre",
  ZM: "Zàmbia",
  ZW: "Zimbabwe",
  XK: "Kosovo"
};
const ca = {
  locale: locale$13,
  countries: countries$13
};
const locale$12 = "cs";
const countries$12 = {
  AF: "Afghánistán",
  AX: "Ålandy",
  AL: "Albánie",
  DZ: "Alžírsko",
  AS: "Americká Samoa",
  VI: "Americké Panenské ostrovy",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarktida",
  AG: "Antigua a Barbuda",
  AR: "Argentina",
  AM: "Arménie",
  AW: "Aruba",
  AU: "Austrálie",
  AZ: "Ázerbájdžán",
  BS: "Bahamy",
  BH: "Bahrajn",
  BD: "Bangladéš",
  BB: "Barbados",
  BE: "Belgie",
  BZ: "Belize",
  BY: "Bělorusko",
  BJ: "Benin",
  BM: "Bermudy",
  BT: "Bhútán",
  BO: "Bolívie",
  BQ: "Bonaire, Svatý Eustach a Saba",
  BA: "Bosna a Hercegovina",
  BW: "Botswana",
  BV: "Bouvetův ostrov",
  BR: "Brazílie",
  IO: "Britské indickooceánské území",
  VG: "Britské Panenské ostrovy",
  BN: "Brunej",
  BG: "Bulharsko",
  BF: "Burkina Faso",
  BI: "Burundi",
  CK: "Cookovy ostrovy",
  CW: "Curaçao",
  TD: "Čad",
  ME: "Černá Hora",
  CZ: "Česká republika",
  CN: "Čína",
  DK: "Dánsko",
  CD: "Demokratická republika Kongo",
  DM: "Dominika",
  DO: "Dominikánská republika",
  DJ: "Džibutsko",
  EG: "Egypt",
  EC: "Ekvádor",
  ER: "Eritrea",
  EE: "Estonsko",
  ET: "Etiopie",
  FO: "Faerské ostrovy",
  FK: "Falklandy (Malvíny)",
  FJ: "Fidži",
  PH: "Filipíny",
  FI: "Finsko",
  FR: "Francie",
  GF: "Francouzská Guyana",
  TF: "Francouzská jižní a antarktická území",
  PF: "Francouzská Polynésie",
  GA: "Gabon",
  GM: "Gambie",
  GH: "Ghana",
  GI: "Gibraltar",
  GD: "Grenada",
  GL: "Grónsko",
  GE: "Gruzie",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GG: "Guernsey",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heardův ostrov a McDonaldovy ostrovy",
  HN: "Honduras",
  HK: "Hongkong",
  CL: "Chile",
  HR: "Chorvatsko",
  IN: "Indie",
  ID: "Indonésie",
  IQ: "Irák",
  IR: "Írán",
  IE: "Irsko",
  IS: "Island",
  IT: "Itálie",
  IL: "Izrael",
  JM: "Jamajka",
  JP: "Japonsko",
  YE: "Jemen",
  JE: "Jersey",
  ZA: "Jihoafrická republika",
  GS: "Jižní Georgie a Jižní Sandwichovy ostrovy",
  KR: "Jižní Korea",
  SS: "Jižní Súdán",
  JO: "Jordánsko",
  KY: "Kajmanské ostrovy",
  KH: "Kambodža",
  CM: "Kamerun",
  CA: "Kanada",
  CV: "Kapverdy",
  QA: "Katar",
  KZ: "Kazachstán",
  KE: "Keňa",
  KI: "Kiribati",
  CC: "Kokosové ostrovy",
  CO: "Kolumbie",
  KM: "Komory",
  CG: "Kongo",
  CR: "Kostarika",
  CU: "Kuba",
  KW: "Kuvajt",
  CY: "Kypr",
  KG: "Kyrgyzstán",
  LA: "Laos",
  LS: "Lesotho",
  LB: "Libanon",
  LR: "Libérie",
  LY: "Libye",
  LI: "Lichtenštejnsko",
  LT: "Litva",
  LV: "Lotyšsko",
  LU: "Lucembursko",
  MO: "Macao",
  MG: "Madagaskar",
  HU: "Maďarsko",
  MY: "Malajsie",
  MW: "Malawi",
  MV: "Maledivy",
  ML: "Mali",
  MT: "Malta",
  IM: "Ostrov Man",
  MA: "Maroko",
  MH: "Marshallovy ostrovy",
  MQ: "Martinik",
  MU: "Mauricius",
  MR: "Mauritánie",
  YT: "Mayotte",
  UM: "Menší odlehlé ostrovy USA",
  MX: "Mexiko",
  FM: "Mikronésie",
  MD: "Moldavsko",
  MC: "Monako",
  MN: "Mongolsko",
  MS: "Montserrat",
  MZ: "Mosambik",
  MM: "Myanmar",
  NA: "Namibie",
  NR: "Nauru",
  DE: "Německo",
  NP: "Nepál",
  NE: "Niger",
  NG: "Nigérie",
  NI: "Nikaragua",
  NU: "Niue",
  NL: "Nizozemsko",
  NF: "Norfolk",
  NO: "Norsko",
  NC: "Nová Kaledonie",
  NZ: "Nový Zéland",
  OM: "Omán",
  PK: "Pákistán",
  PW: "Palau",
  PS: "Palestinská autonomie",
  PA: "Panama",
  PG: "Papua-Nová Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PN: "Pitcairnovy ostrovy",
  CI: "Pobřeží slonoviny",
  PL: "Polsko",
  PR: "Portoriko",
  PT: "Portugalsko",
  AT: "Rakousko",
  RE: "Réunion",
  GQ: "Rovníková Guinea",
  RO: "Rumunsko",
  RU: "Rusko",
  RW: "Rwanda",
  GR: "Řecko",
  PM: "Saint-Pierre a Miquelon",
  SV: "Salvador",
  WS: "Samoa",
  SM: "San Marino",
  SA: "Saúdská Arábie",
  SN: "Senegal",
  KP: "Severní Korea",
  MK: "Severní Makedonie",
  MP: "Severní Mariany",
  SC: "Seychely",
  SL: "Sierra Leone",
  SG: "Singapur",
  SK: "Slovensko",
  SI: "Slovinsko",
  SO: "Somálsko",
  AE: "Spojené arabské emiráty",
  GB: "Spojené království",
  US: "Spojené státy americké",
  RS: "Srbsko",
  CF: "Středoafrická republika",
  SD: "Súdán",
  SR: "Surinam",
  SH: "Svatá Helena, Ascension a Tristan da Cunha",
  LC: "Svatá Lucie",
  BL: "Svatý Bartoloměj",
  KN: "Svatý Kryštof a Nevis",
  MF: "Svatý Martin (francouzská část)",
  SX: "Svatý Martin (nizozemská část)",
  ST: "Svatý Tomáš a Princův ostrov",
  VC: "Svatý Vincenc a Grenadiny",
  SZ: "Svazijsko",
  SY: "Sýrie",
  SB: "Šalamounovy ostrovy",
  ES: "Španělsko",
  SJ: "Špicberky a Jan Mayen",
  LK: "Šrí Lanka",
  SE: "Švédsko",
  CH: "Švýcarsko",
  TJ: "Tádžikistán",
  TZ: "Tanzanie",
  TH: "Thajsko",
  TW: "Tchaj-wan",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad a Tobago",
  TN: "Tunisko",
  TR: "Turecko",
  TM: "Turkmenistán",
  TC: "Turks a Caicos",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukrajina",
  UY: "Uruguay",
  UZ: "Uzbekistán",
  CX: "Vánoční ostrov",
  VU: "Vanuatu",
  VA: "Vatikán",
  VE: "Venezuela",
  VN: "Vietnam",
  TL: "Východní Timor",
  WF: "Wallis a Futuna",
  ZM: "Zambie",
  EH: "Západní Sahara",
  ZW: "Zimbabwe",
  XK: "Kosovo"
};
const cs = {
  locale: locale$12,
  countries: countries$12
};
const locale$11 = "cy";
const countries$11 = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "Samoa Americanaidd",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua a Barbuda",
  AR: "Yr Ariannin",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Awstralia",
  AT: "Awstria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Gwlad Belg",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolifia",
  BA: "Bosnia a Herzegovina",
  BW: "Botswana",
  BV: "Ynys Bouvet",
  BR: "Brasil",
  IO: "Tiriogaeth Cefnfor India Prydain",
  BN: "Brunei Darussalam",
  BG: "Bwlgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodia",
  CM: "Camerŵn",
  CA: "Canada",
  CV: "Cape Verde",
  KY: "Ynysoedd Cayman",
  CF: "Gweriniaeth Canolbarth Affrica",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CX: "Ynys y Nadolig",
  CC: "Ynysoedd Cocos (Keeling)",
  CO: "Colombia",
  KM: "Comoros",
  CG: "Congo",
  CD: "Congo, Gweriniaeth Ddemocrataidd y",
  CK: "Ynysoedd Cook",
  CR: "Costa Rica",
  CI: [
    "Cote d'Ivoire",
    "Côte d'Ivoire"
  ],
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Gweriniaeth Tsiec",
  DK: "Denmarc",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Gweriniaeth Ddominicaidd",
  EC: "Ecwador",
  EG: "Yr Aifft",
  SV: "El Salvador",
  GQ: "Gini Cyhydeddol",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Ynysoedd y Falkland (Malvinas)",
  FO: "Ynysoedd Ffaro",
  FJ: "Ffiji",
  FI: "Y Ffindir",
  FR: "Ffrainc",
  GF: "Guiana Ffrengig",
  PF: "Polynesia Ffrainc",
  TF: "Tiriogaethau De Ffrainc",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Yr Almaen",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Gwlad Groeg",
  GL: "Yr Ynys Las",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Gini",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Ynys Heard ac Ynysoedd McDonald",
  VA: "Holy See (Dinas-wladwriaeth y Fatican)",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hwngari",
  IS: "Gwlad yr Iâ",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran, Gweriniaeth Islamaidd",
  IQ: "Irac",
  IE: "Iwerddon",
  IL: "Israel",
  IT: "Yr Eidal",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Gogledd Corea",
  KR: "De Korea",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Gweriniaeth Ddemocrataidd Pobl Lao",
  LV: "Latfia",
  LB: "Libanus",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithwania",
  LU: "Lwcsembwrg",
  MO: "Macao",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Ynysoedd Marshall",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mecsico",
  FM: "Micronesia, Gwladwriaethau Ffederal o",
  MD: "Moldofa, Gweriniaeth",
  MC: "Monaco",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Moroco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Yr Iseldiroedd",
  NC: "Caledonia Newydd",
  NZ: "Seland Newydd",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Ynys Norfolk",
  MK: "Gogledd Macedonia, Gweriniaeth",
  MP: "Ynysoedd Gogledd Mariana",
  NO: "Norwy",
  OM: "Oman",
  PK: "Pacistan",
  PW: "Palau",
  PS: [
    "Cyflwr Palestina",
    "Palestina"
  ],
  PA: "Panama",
  PG: "Gini Newydd Papua",
  PY: "Paraguay",
  PE: "Periw",
  PH: "Philippines",
  PN: "Pitcairn",
  PL: "Gwlad Pwyl",
  PT: "Portiwgal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Aduniad",
  RO: "Rwmania",
  RU: [
    "Ffederasiwn Rwseg",
    "Rwsia"
  ],
  RW: "Rwanda",
  SH: "Saint Helena",
  KN: "Saint Kitts a Nevis",
  LC: "Saint Lucia",
  PM: "Saint Pierre a Miquelon",
  VC: "Saint Vincent and the Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome a Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slofacia",
  SI: "Slofenia",
  SB: "Ynysoedd Solomon",
  SO: "Somalia",
  ZA: "De Affrica",
  GS: "De Georgia ac Ynysoedd De Sandwich",
  ES: "Sbaen",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Swrinam",
  SJ: "Svalbard a Jan Mayen",
  SZ: "Eswatini",
  SE: "Sweden",
  CH: "Y Swistir",
  SY: "Gweriniaeth Arabaidd Syria",
  TW: [
    "Taiwan, Talaith China",
    "Taiwan"
  ],
  TJ: "Tajikistan",
  TZ: "Tanzania, Gweriniaeth Unedig",
  TH: "Gwlad Thai",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad a Tobago",
  TN: "Tiwnisia",
  TR: "Twrci",
  TM: "Turkmenistan",
  TC: "Ynysoedd y Twrciaid ac Ynysoedd Caicos",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Wcráin",
  AE: "Emiradau Arabaidd Unedig",
  GB: [
    "Y Deyrnas Unedig",
    "DU",
    "Prydain Fawr"
  ],
  US: [
    "Unol Daleithiau America",
    "UDA"
  ],
  UM: "Mân Ynysoedd Allanol yr Unol Daleithiau",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Fietnam",
  VG: "Ynysoedd Virgin, Prydeinig",
  VI: "Ynysoedd Virgin, U.S.",
  WF: "Wallis a Futuna",
  EH: "Sahara Gorllewinol",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Ynysoedd Åland",
  BQ: "Bonaire, Sint Eustatius a Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Ynys Manaw",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint Barthélemy",
  MF: "Saint Martin (rhan Ffrangeg)",
  RS: "Serbia",
  SX: "Sint Maarten (rhan Iseldireg)",
  SS: "De Swdan",
  XK: "Kosovo"
};
const cy = {
  locale: locale$11,
  countries: countries$11
};
const locale$10 = "da";
const countries$10 = {
  AF: "Afghanistan",
  AL: "Albanien",
  DZ: "Algeriet",
  AS: "Amerikansk Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarktis",
  AG: "Antigua og Barbuda",
  AR: "Argentina",
  AM: "Armenien",
  AW: "Aruba",
  AU: "Australien",
  AT: "Østrig",
  AZ: "Aserbajdsjan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Hviderusland",
  BE: "Belgien",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnien-Hercegovina",
  BW: "Botswana",
  BV: "Bouvet Island",
  BR: "Brasilien",
  IO: "British Indian Ocean Territory",
  BN: "Brunei Darussalam",
  BG: "Bulgarien",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodja",
  CM: "Cameroun",
  CA: "Canada",
  CV: "Kap Verde",
  KY: "Caymanøerne",
  CF: "Den Centralafrikanske Republik",
  TD: "Tchad",
  CL: "Chile",
  CN: "Kina",
  CX: "Juløen",
  CC: "Cocosøerne",
  CO: "Colombia",
  KM: "Comorerne",
  CG: "Congo",
  CD: "Demokratiske Republik Congo",
  CK: "Cookøerne",
  CR: "Costa Rica",
  CI: "Elfenbenskysten",
  HR: "Kroatien",
  CU: "Cuba",
  CY: "Cypern",
  CZ: "Tjekkiet",
  DK: "Danmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominikanske Republik",
  EC: "Ecuador",
  EG: "Egypten",
  SV: "El Salvador",
  GQ: "Ækvatorialguinea",
  ER: "Eritrea",
  EE: "Estland",
  ET: "Etiopien",
  FK: "Falklandsøerne",
  FO: "Færøerne",
  FJ: "Fiji",
  FI: "Finland",
  FR: "Frankrig",
  GF: "Fransk Guiana",
  PF: "Fransk Polynesien",
  TF: "Franske Sydterritorier",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgien",
  DE: "Tyskland",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Grækenland",
  GL: "Grønland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard-øen og McDonald-øerne",
  VA: "Vatikanstaten",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Ungarn",
  IS: "Island",
  IN: "Indien",
  ID: "Indonesien",
  IR: "Iran",
  IQ: "Irak",
  IE: "Irland",
  IL: "Israel",
  IT: "Italien",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Nordkorea",
  KR: "Sydkorea",
  KW: "Kuwait",
  KG: "Kirgisistan",
  LA: "Laos",
  LV: "Letland",
  LB: "Libanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libyen",
  LI: "Liechtenstein",
  LT: "Litauen",
  LU: "Luxembourg",
  MO: "Macao",
  MK: "Nordmakedonien",
  MG: "Madagaskar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldiverne",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshalløerne",
  MQ: "Martinique",
  MR: "Mauretanien",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Mikronesien",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongoliet",
  MS: "Montserrat",
  MA: "Marokko",
  MZ: "Mozambique",
  MM: "Myanmar (Burma)",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Holland",
  NC: "Ny Kaledonien",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk Island",
  MP: "Nordmarianerne",
  NO: "Norge",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palæstina",
  PA: "Panama",
  PG: "Papua Ny Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Filippinerne",
  PN: "Pitcairn",
  PL: "Polen",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Rumænien",
  RU: "Rusland",
  RW: "Rwanda",
  SH: "Sankt Helena",
  KN: "Saint Kitts og Nevis",
  LC: "Saint Lucia",
  PM: "Saint-Pierre og Miquelon",
  VC: "Saint Vincent og Grenadinerne",
  WS: "Samoa",
  SM: "San Marino",
  ST: "São Tomé og Príncipe",
  SA: "Saudi-Arabien",
  SN: "Senegal",
  SC: "Seychellerne",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakiet",
  SI: "Slovenien",
  SB: "Salomonøerne",
  SO: "Somalia",
  ZA: "Sydafrika",
  GS: "South Georgia og South Sandwich Islands",
  ES: "Spanien",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Surinam",
  SJ: "Norge Svalbard og Jan Mayen",
  SZ: "Eswatini",
  SE: "Sverige",
  CH: "Schweiz",
  SY: "Syrien",
  TW: "Republikken Kina Taiwan",
  TJ: "Tadsjikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Østtimor",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad og Tobago",
  TN: "Tunesien",
  TR: "Tyrkiet",
  TM: "Turkmenistan",
  TC: "Turks- og Caicosøerne",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "Forenede Arabiske Emirater",
  GB: "Storbritannien",
  US: "USA",
  UM: "USA's ydre småøer",
  UY: "Uruguay",
  UZ: "Usbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "Britiske Jomfruøer",
  VI: "Amerikanske Jomfruøer",
  WF: "Wallis og Futuna",
  EH: "Vestsahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Ålandsøerne",
  BQ: "Nederlandske Antiller",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Isle of Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint-Barthélemy",
  MF: "Saint Martin (fransk side)",
  RS: "Serbien",
  SX: "Saint Martin (hollandsk side)",
  SS: "Sydsudan",
  XK: "Kosovo"
};
const da = {
  locale: locale$10,
  countries: countries$10
};
const locale$$ = "de";
const countries$$ = {
  AF: "Afghanistan",
  EG: "Ägypten",
  AX: "Åland",
  AL: "Albanien",
  DZ: "Algerien",
  AS: "Amerikanisch-Samoa",
  VI: "Amerikanische Jungferninseln",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarktis",
  AG: "Antigua und Barbuda",
  GQ: "Äquatorialguinea",
  AR: "Argentinien",
  AM: "Armenien",
  AW: "Aruba",
  AZ: "Aserbaidschan",
  ET: "Äthiopien",
  AU: "Australien",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesch",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgien",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivien",
  BQ: "Bonaire",
  BA: "Bosnien und Herzegowina",
  BW: "Botswana",
  BV: "Bouvetinsel",
  BR: "Brasilien",
  VG: "Britische Jungferninseln",
  IO: "Britisches Territorium im Indischen Ozean",
  BN: "Brunei Darussalam",
  BG: "Bulgarien",
  BF: "Burkina Faso",
  BI: "Burundi",
  CL: "Chile",
  CN: "China",
  CK: "Cookinseln",
  CR: "Costa Rica",
  CI: "Elfenbeinküste",
  CW: "Curaçao",
  DK: "Dänemark",
  DE: "Deutschland",
  DM: "Dominica",
  DO: "Dominikanische Republik",
  DJ: "Dschibuti",
  EC: "Ecuador",
  SV: "El Salvador",
  ER: "Eritrea",
  EE: "Estland",
  FK: "Falklandinseln",
  FO: "Färöer",
  FJ: "Fidschi",
  FI: "Finnland",
  FR: "Frankreich",
  GF: "Französisch-Guayana",
  PF: "Französisch-Polynesien",
  TF: "Französische Süd- und Antarktisgebiete",
  GA: "Gabun",
  GM: "Gambia",
  GE: "Georgien",
  GH: "Ghana",
  GI: "Gibraltar",
  GD: "Grenada",
  GR: "Griechenland",
  GL: "Grönland",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GG: "Guernsey",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard und McDonaldinseln",
  HN: "Honduras",
  HK: [
    "Hongkong",
    "Hong Kong"
  ],
  IN: "Indien",
  ID: "Indonesien",
  IM: "Insel Man",
  IQ: "Irak",
  IR: "Iran",
  IE: "Irland",
  IS: "Island",
  IL: "Israel",
  IT: "Italien",
  JM: "Jamaika",
  JP: "Japan",
  YE: "Jemen",
  JE: "Jersey",
  JO: "Jordanien",
  KY: "Kaimaninseln",
  KH: "Kambodscha",
  CM: "Kamerun",
  CA: "Kanada",
  CV: "Kap Verde",
  KZ: "Kasachstan",
  QA: "Katar",
  KE: "Kenia",
  KG: "Kirgisistan",
  KI: "Kiribati",
  CC: "Kokosinseln",
  CO: "Kolumbien",
  KM: "Komoren",
  CD: "Kongo",
  KP: "Nordkorea",
  KR: "Südkorea",
  HR: "Kroatien",
  CU: "Kuba",
  KW: "Kuwait",
  LA: "Laos",
  LS: "Lesotho",
  LV: "Lettland",
  LB: "Libanon",
  LR: "Liberia",
  LY: "Libyen",
  LI: "Liechtenstein",
  LT: "Litauen",
  LU: "Luxemburg",
  MO: "Macao",
  MG: "Madagaskar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Malediven",
  ML: "Mali",
  MT: "Malta",
  MA: "Marokko",
  MH: "Marshallinseln",
  MQ: "Martinique",
  MR: "Mauretanien",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexiko",
  FM: "Mikronesien",
  MD: "Moldawien",
  MC: "Monaco",
  MN: "Mongolei",
  ME: "Montenegro",
  MS: "Montserrat",
  MZ: "Mosambik",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NC: "Neukaledonien",
  NZ: "Neuseeland",
  NI: "Nicaragua",
  NL: "Niederlande",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  MK: "Nordmazedonien",
  MP: "Nördliche Marianen",
  NF: "Norfolkinsel",
  NO: "Norwegen",
  OM: "Oman",
  AT: "Österreich",
  TL: "Osttimor",
  PK: "Pakistan",
  PS: "Staat Palästina",
  PW: "Palau",
  PA: "Panama",
  PG: "Papua-Neuguinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippinen",
  PN: "Pitcairninseln",
  PL: "Polen",
  PT: "Portugal",
  PR: "Puerto Rico",
  TW: "Taiwan",
  CG: "Republik Kongo",
  RE: "Réunion",
  RW: "Ruanda",
  RO: "Rumänien",
  RU: [
    "Russische Föderation",
    "Russland"
  ],
  BL: "Saint-Barthélemy",
  MF: "Saint-Martin",
  SB: "Salomonen",
  ZM: "Sambia",
  WS: "Samoa",
  SM: "San Marino",
  ST: "São Tomé und Príncipe",
  SA: "Saudi-Arabien",
  SE: "Schweden",
  CH: "Schweiz",
  SN: "Senegal",
  RS: "Serbien",
  SC: "Seychellen",
  SL: "Sierra Leone",
  ZW: "Simbabwe",
  SG: "Singapur",
  SX: "Sint Maarten",
  SK: "Slowakei",
  SI: "Slowenien",
  SO: "Somalia",
  ES: "Spanien",
  LK: "Sri Lanka",
  SH: "St. Helena",
  KN: "St. Kitts und Nevis",
  LC: "St. Lucia",
  PM: "Saint-Pierre und Miquelon",
  VC: "St. Vincent und die Grenadinen",
  ZA: "Südafrika",
  SD: "Sudan",
  GS: "Südgeorgien und die Südlichen Sandwichinseln",
  SS: "Südsudan",
  SR: "Suriname",
  SJ: "Svalbard und Jan Mayen",
  SZ: "Eswatini",
  SY: "Syrien, Arabische Republik",
  TJ: "Tadschikistan",
  TZ: [
    "Tansania, Vereinigte Republik",
    "Tansania"
  ],
  TH: "Thailand",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad und Tobago",
  TD: "Tschad",
  CZ: [
    "Tschechische Republik",
    "Tschechien"
  ],
  TN: "Tunesien",
  TR: "Türkei",
  TM: "Turkmenistan",
  TC: "Turks- und Caicosinseln",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  HU: "Ungarn",
  UM: "United States Minor Outlying Islands",
  UY: "Uruguay",
  UZ: "Usbekistan",
  VU: "Vanuatu",
  VA: "Vatikanstadt",
  VE: "Venezuela",
  AE: "Vereinigte Arabische Emirate",
  US: [
    "Vereinigte Staaten von Amerika",
    "Vereinigte Staaten",
    "USA"
  ],
  GB: [
    "Vereinigtes Königreich",
    "Großbritannien"
  ],
  VN: "Vietnam",
  WF: "Wallis und Futuna",
  CX: "Weihnachtsinsel",
  EH: "Westsahara",
  CF: "Zentralafrikanische Republik",
  CY: "Zypern",
  XK: "Kosovo"
};
const de = {
  locale: locale$$,
  countries: countries$$
};
const locale$_ = "dv";
const countries$_ = {
  AF: "އަފްޣާނިސްތާން",
  AL: "އަލްބޭނިއާ",
  DZ: "އަލްޖީރިއާ",
  AS: "އެމެރިކަން ސަމޯއާ",
  AD: "އެންޑޯރާ",
  AO: "އެންގޯލާ",
  AI: "އެންގުއިލާ",
  AQ: "އެންޓަރްޓިކަ",
  AG: "އެންޓިގުއާ އެންޑް ބަރބުޑާ",
  AR: "އާޖެންޓީނާ",
  AM: "އަރްމީނިއާ",
  AW: "އަރޫބާ (ހޮލެންޑު)",
  AU: "އޮސްޓްރޭލިއާ",
  AT: "އޮސްޓްރިއާ",
  AZ: "އަޒަރުބައިޖާން",
  BS: "ބަހާމަސް",
  BH: "ބަޙްރައިން",
  BD: "ބަންގާޅު",
  BB: "ބާބަޑޮސް",
  BY: "ބެލަރޫސް",
  BE: "ބެލްޖިއަމް",
  BZ: "ބެލީޒު",
  BJ: "ބެނިން",
  BM: "ބާމިއުޑާ (ޔުނައިޓެޑް ކިންގްޑަމް)",
  BT: "ބޫޓާން",
  BO: "ބޮލީވިއާ",
  BA: "ބޮސްނިއާ އެންޑް ހާޒެގޮވީނާ",
  BW: "ބޮސްވާނާ",
  BV: "ބުވި ޖަޒީރާ",
  BR: "ބްރެޒިލް",
  IO: "ބްރިޓިޝް ހިންދު ކަނޑު ބިން",
  BN: "ބުރުނައީ",
  BG: "ބަލްގޭރިއާ",
  BF: "ބުރުކީނާ ފާސޯ",
  BI: "ބުރުންޑީ",
  KH: "ކެމްބޯޑިއާ",
  CM: "ކެމަރޫން",
  CA: "ކެނެޑާ",
  CV: "ކޭޕް ވާޑޭ",
  KY: "ކޭމަން އައިލެންޑްސް",
  CF: "ސެންޓްރަލް އެފްރިކަން ރިޕަބްލިކް",
  TD: "ޗާޑް",
  CL: "ޗިލީ",
  CN: "ޗައިނާ",
  CX: "ކްރިސްޓްމަސް ޖަޒީރާ",
  CC: "ކުކް ޖަޒީރާ",
  CO: "ކޮލަންބިއާ",
  KM: "ކޮމޮރޯސް",
  CG: "ކޮންގޯ (ޖުމްހޫރިއްޔާ)",
  CD: "ކޮންގޯ (ދިމިޤްރާޠީ ޖުމްހޫރިއްޔާ)",
  CK: "ކޫކް އައިލަންޑްސް",
  CR: "ކޮސްޓަ ރީކާ",
  CI: "ކޯޓް ޑްލްވޮއަރ",
  HR: "ކްރޮއޭޝިއާ",
  CU: "ކިޔުބާ",
  CY: "ސައިޕްރަސް",
  CZ: "ޗެޗް ރިޕަބްލިކް",
  DK: "ޑެންމާކު",
  DJ: "ޑްޖިބޯޓި",
  DM: "ޑޮމިނިކާ",
  DO: "ޑޮމިނިކަން ރިޕަބްލިކް",
  EC: "އީކުއެޑޯ",
  EG: "މިޞްރު",
  SV: "އެލް ސަލްވަޑޯރ",
  GQ: "އީކުއޭޓޯރިއަލް ގުއީނިއާ",
  ER: "އެރިޓްރިއާ",
  EE: "އެސްޓޯނިއާ",
  ET: "އެތިއޯޕިއާ",
  FK: "ފޯކްލޭންޑް އައިލޭންޑްސް",
  FO: "ފަރޯ އައިލެންޑްސް",
  FJ: "ފިޖީ",
  FI: "ފިންލޭންޑް",
  FR: "ފަރަނސޭސިވިލާތް، ފަރަންސާ",
  GF: "ފަރަންސޭސީ ގިޔާނާ",
  PF: "ފްރެންޗް ޕޮލިނީސިއާ",
  TF: "ފްރެންތް ސަދާން ޓެރިޓޮރީސް",
  GA: "ގެބޮން",
  GM: "ގެމްބިއާ",
  GE: "ޖޯޖިއާ",
  DE: "ޖަރުމަނުވިލާތް",
  GH: "ގާނާ",
  GI: "ގިބްރަލްޓަރ",
  GR: "ގްރީސް",
  GL: "ގުރީންލޭންޑު (ޑެންމާކު)",
  GD: "ގްރެނަޑާ",
  GP: "ގުވަދެލޫޕު",
  GU: "ގުއާމު",
  GT: "ގުއަޓެމާލާ",
  GN: "ގުއީނިއާ",
  GW: "ގުއީނިއާ ބިއްސައު",
  GY: "ގުޔާނާ",
  HT: "ހެއިޓީ",
  HM: "ާހޑް އައިލެންޑްސް މެކްޑޮނާލްޑް އައިފެންޑްސް",
  VA: "ހޮލީ ސީ",
  HN: "ހޮންޑިއުރާސް",
  HK: "ހޮންކޮންގު",
  HU: "ހަންގޭރީ",
  IS: "އައިސްލޭންޑް",
  IN: "ހިންދުސްތާން",
  ID: "އިންޑޮނީޝިޔާ",
  IR: "އީރާން",
  IQ: "ޢިރާޤު",
  IE: "އަޔަލޭންޑުގެ ޖުމްހޫރިއްޔާ",
  IL: "އިސްރާއީލު",
  IT: "އިޓަލީ",
  JM: "ޖެމޭއިކާ",
  JP: " ޖަޕާނު ",
  JO: "ޖޯޑަން",
  KZ: "ކަޒަކިސްތާން",
  KE: "ކެންޔާ",
  KI: "ކިރިބަޓި",
  KP: "ޑިމޮކްރޭޓތިކް ޕީޕަލްސް ރިޕަބްލިކް އޮފް ކޮރެއާ",
  KR: "ރިޕަބްލިކް އޮފް ކޮރެއާ",
  KW: "ކުވެއިތު",
  KG: "ކިރިގިސްތާން",
  LA: "ޕީޕަލްސް ޑިމޮކްރޭޓިކް ރިޕަބްލިކް އޮފް ލާއޯ",
  LV: "ލަޓްވިއާ",
  LB: "ލުބުނާން",
  LS: "ލެސޯތޯ",
  LR: "ލައިބީރިއާ",
  LY: "ލީބިޔަން އަރަބް ޖަމާހިރިއްޔާ",
  LI: "ލިއެޗެންސްޓެއިން",
  LT: "ލިތުއޭނިއާ",
  LU: "ލަގްޒެމްބާގް",
  MO: "މަކާއޯ",
  MK: "ޔޫގޮސްލާވިއާ",
  MG: "މަޑަގަސްކަރ",
  MW: "މެލޭޝިޔާ",
  MY: "މެލޭޝިޔާ",
  MV: "މާލީ",
  ML: "މޯލްޓާ",
  MT: "މަލްޓާ",
  MH: "މާޝަލް އައިލެންޑްސް",
  MQ: "މަރުތިނީކު",
  MR: "މައުރިޓޭނިއާ",
  MU: "މައުރިޓިއަސް",
  YT: "މެކްސިކޯ",
  MX: "މައިކްރޮނޭޝިއާ",
  FM: "މޮލްޑޯވާ",
  MD: "މޮނާކޯ",
  MC: "މޮންގޯލިއާ",
  MN: "މޮންގޯލިއާ",
  MS: "މޮރޮކޯ",
  MA: "މޮރޮކޯ",
  MZ: "މޮޒަންބީކް",
  MM: "މިޔަންމާ",
  NA: "ނައުރޫ",
  NR: "ނޭޕާލް",
  NP: "ނެދަލޭންޑު",
  NL: "ނެދަލޭންޑްސް",
  NC: "ނިއު ކެލިޑޯނިއާ",
  NZ: "ނިކަރާގުއާ",
  NI: "ނިޖަރު",
  NE: "ނައިޖީރިއާ",
  NG: "ނީއު",
  NU: "ނިއޫ",
  NF: "ނޯފޯކް އައިލެންޑް",
  MP: "ނޮދާން މަރިއާނާ އައިލަންޑްސް",
  NO: "ނޫރުވޭޖިއާ",
  OM: "އޯމާން",
  PK: "ޕާކިސްތާން",
  PW: "ޕަލާއޫ",
  PS: "ފަލަސްޠީނުގެ ދައުލަތް",
  PA: "ޕެނަމާ",
  PG: "ޕައުޕާ ނިއުގީނިއާ",
  PY: "ޕަރަގުއޭއީ",
  PE: "ޕެރޫ",
  PH: "ފިލިޕީންސް",
  PN: "ޕިޓްކެއާން",
  PL: "ޕޮލޭންޑް",
  PT: "ޕޯޗުގަލް",
  PR: "ޕުއަރޓޯ ރީކޯ",
  QA: "ޤަޠަރު",
  RE: "ރިޔޫނިއަން (ފަރަންސޭސިވިލާތް)",
  RO: "ރޮމޭނިއާ",
  RU: "ރަޝިއަން ފެޑޭރޭޝަން",
  RW: "ރުވާންޑާ",
  SH: "ސަންތި ހެލީނާ (ޔުނައިޓެޑް ކިންގްޑަމް)",
  KN: "ސައިންޓް ކިޓްސް އެންޑް ނެވީސް",
  LC: "ސައިންޓް ލޫސިއާ",
  PM: "ސަންތި ޕިއޭރޭ އާއި މިކުއެލޯން (ފަރަންސޭސިވިލާތް)",
  VC: "ސައިންޓް ވިންސެންޓް އެންޑް ދަ ގޮރެނޭޑިންސް",
  WS: "ސަމޯއާ",
  SM: "ސަން މެރީނޯ",
  ST: "ސައޯ ޓޯމީ އެންޑް ޕްރިންސިޕީ",
  SA: "ސައުދީ އެރޭބިއާ",
  SN: "ސެނެގާލް",
  SC: "ސީޝެލްސް",
  SL: "ސެރެލިއޯން",
  SG: "ސިންގަޕޯރ",
  SK: "ސްލޮވާކިއާ",
  SI: "ސްލޮވީނިއާ",
  SB: "ސޮލޮމޮން އައިލަންޑްސް",
  SO: "ސޯމާލިއާ",
  ZA: "ސައުތު އެފްރިކާ",
  GS: "ސައުތު ޖޯޖިއާ އަންޑް ދަ ސައުތު ސޭންޑްވިޗް އައިލެންޑްސް",
  ES: "ސްޕެއިން",
  LK: "އޮޅުދޫކަރަ",
  SD: "ސޫދާން",
  SR: "ސުރިނާމް",
  SJ: "ސްވަ ލްބަރްޑް އެންޑް ޖަން މަޔިން",
  SZ: "ސުވާޒިލޭންޑު",
  SE: "ސްވީޑަން",
  CH: "ސްވިޒަރލޭންޑް",
  SY: "ސީރިއަން އަރަބް ރިޕަބްލިކް",
  TW: "ޓައިވާން",
  TJ: "ޓަޖިކިސްތާން",
  TZ: "ޓާންޒޭނިއާ",
  TH: "ތައިލެންޑް",
  TL: "ޓީމޯ ލެސްޓޭ",
  TG: "ޓޯގޯ",
  TK: "ތޮކެލާއު",
  TO: "ޓޮންގާ",
  TT: "ޓްރިނިޑެޑް އެންޑް ޓޮބޭގޯ",
  TN: "ޓިއުނީޝިއާ",
  TR: "ތުރުކީވިލާތް",
  TM: "ތުރުކުމެނިސްތާން",
  TC: "ޓާކްސް އެންޑް ކެއިކޯސް އައިލެންޑްސް",
  TV: "ތުވާލޫ",
  UG: "ޔުގެންޑާ",
  UA: "ޔޫކްރޭން",
  AE: "އެކުވެރި ޢަރަބި އިމާރާތ",
  GB: "ޔުނައިޓަޑް ކިންގްޑޮމް",
  US: "ޔުނައިޓަޑް ސްޓޭޓްސް",
  UM: "ޔުނައިޓަޑް ސްޓޭޓްސް ކުޑާ ދެރެން އައިލޭންޑްސް",
  UY: "އުރުގުއޭއީ",
  UZ: "އުޒްބެކިސްތާން",
  VU: "ވަނުއާޓޫ",
  VE: "ވެނެޒުއޭލާ",
  VN: "ވިއެޓުނާމު",
  VG: "ވާރޖިން އައިލޭންޑްސް ބްރިޓިޝް",
  VI: "ވާރޖިން އައިލޭންޑްސް ޔޫއެސް",
  WF: "ވޯލިސް އެންޑް ފުޓުނަ",
  EH: "ހުޅަނގު ސަހަރާ",
  YE: "ޔަމަން",
  ZM: "ޒެމްބިއާ",
  ZW: "ޒިމްބާބުވޭ",
  AX: "އަލޭންޑް އައިލެންޑްސް",
  BQ: "ބުނިރް، ސިންޓް ޔުސްޓަޒިއުސ އެންޑް ސަބަ",
  CW: "ކުރަކާއޯ",
  GG: "ގުއާންސޭ (ބިރިޓިޝް ތާޖުގެ ހިޔާވަހިކަމުގައި)",
  IM: "އައިޒަލް އޮފް މޭން (ބިރިޓިޝް ތާޖުގެ ހިޔާވަހިކަމުގައި)",
  JE: "ޖާސޭ (ބިރިޓިޝް ތާޖުގެ ހިޔާވަހިކަމުގައި)",
  ME: "ކަޅުފަރުބަދަ",
  BL: "ސެއިންޓް ބާތެލެމީ",
  MF: "ސެއިންޓް މާޓީން",
  RS: "ސިރިބިއާ، ސިރިބިސްތާން، ސިރިބިވިލާތް",
  SX: "ސިންޓް މާޓީން",
  SS: "ސައުތު ސޫދާން",
  XK: "ކޮސޮވާ"
};
const dv = {
  locale: locale$_,
  countries: countries$_
};
const locale$Z = "el";
const countries$Z = {
  AF: "Αφγανιστάν",
  AL: "Αλβανία",
  DZ: "Αλγερία",
  AS: "Αμερικανική Σαμόα",
  AD: "Ανδόρρα",
  AO: "Ανγκόλα",
  AI: "Ανγκουίλα",
  AQ: "Ανταρκτική",
  AG: "Αντίγκουα και Μπαρμπούντα",
  AR: "Αργεντινή",
  AM: "Αρμενία",
  AW: "Αρούμπα",
  AU: "Αυστραλία",
  AT: "Αυστρία",
  AZ: "Αζερμπαϊτζάν",
  BS: "Μπαχάμες",
  BH: "Μπαχρέιν",
  BD: "Μπανγκλαντές",
  BB: "Μπαρμπάντος",
  BY: "Λευκορωσία",
  BE: "Βέλγιο",
  BZ: "Μπελίζ",
  BJ: "Μπενίν",
  BM: "Βερμούδες",
  BT: "Μπουτάν",
  BO: "Βολιβία",
  BA: "Βοσνία και Ερζεγοβίνη",
  BW: "Μποτσουάνα",
  BV: "Μπουβέ",
  BR: "Βραζιλία",
  IO: "Βρετανικό Έδαφος Ινδικού Ωκεανού",
  BN: "Σουλτανάτο του Μπρουνέι",
  BG: "Βουλγαρία",
  BF: "Μπουρκίνα Φάσο",
  BI: "Μπουρουντί",
  KH: "Καμπότζη",
  CM: "Καμερούν",
  CA: "Καναδάς",
  CV: "Δημοκρατία του Πράσινου Ακρωτηρίου",
  KY: "Κέιμαν Νήσοι",
  CF: "Κεντροαφρικανική Δημοκρατίαc",
  TD: "Τσάντ",
  CL: "Χιλή",
  CN: "Κίνα",
  CX: "Νήσος των Χριστουγέννων",
  CC: "Νησιά Κόκος",
  CO: "Κολομβία",
  KM: "Ένωση των Κομορών",
  CG: "Δημοκρατία του Κονγκό",
  CD: "Λαϊκή Δημοκρατία του Κονγκό",
  CK: "Νήσοι Κουκ",
  CR: "Κόστα Ρίκα",
  CI: "Ακτή Ελεφαντοστού",
  HR: "Κροατία",
  CU: "Κούβα",
  CY: "Κύπρος",
  CZ: "Τσεχική Δημοκρατία",
  DK: "Δανία",
  DJ: "Τζιμπουτί",
  DM: "Κοινοπολιτεία της Δομινίκας",
  DO: "Δομινικανή Δημοκρατία",
  EC: "Εκουαδόρ",
  EG: "Αίγυπτος",
  SV: "Ελ Σαλβαδόρ",
  GQ: "Ισημερινή-Γουινέα",
  ER: "Κράτος της Ερυθραίας",
  EE: "Εσθονία",
  ET: "Αιθιοπία",
  FK: "Νήσοι Φώκλαντ (Μαλβίνας)",
  FO: "Νήσοι Φερόες",
  FJ: "Δημοκρατία των Φίτζι",
  FI: "Φινλανδία",
  FR: "Γαλλία",
  GF: "Γαλλική Γουιάνα",
  PF: "Γαλλική Πολυνησία",
  TF: "Γαλλικά Νότια και Ανταρκτικά Εδάφη",
  GA: "Γκαμπόν",
  GM: "Γκάμπια",
  GE: "Γεωργία",
  DE: "Γερμανία",
  GH: "Γκάνα",
  GI: "Γιβραλτάρ",
  GR: "Ελλάδα",
  GL: "Γροιλανδία",
  GD: "Γρενάδα",
  GP: "Γουαδελούπη",
  GU: "Γκουάμ",
  GT: "Γουατεμάλα",
  GN: "Γουινέα",
  GW: "Γουινέα-Μπισσάου",
  GY: "Γουιάνα",
  HT: "Αϊτη",
  HM: "Νήσοι Χερντ και Μακντόναλντ",
  VA: "Κράτος της Πόλης του Βατικανού",
  HN: "Ονδούρα",
  HK: "Χονγκ Κόνγκ",
  HU: "Ουγγαρία",
  IS: "Ισλανδία",
  IN: "Ινδία",
  ID: "Ινδονησία",
  IR: "Ισλαμική Δημοκρατία του Ιράν",
  IQ: "Ιράκ",
  IE: "Ιρλανδία",
  IL: "Ισραήλ",
  IT: "Ιταλία",
  JM: "Τζαμάικα",
  JP: "Ιαπωνία",
  JO: "Ιορδανία",
  KZ: "Καζακστάν",
  KE: "Κένυα",
  KI: "Κιριμπάτι",
  KP: "Λαοκρατική Δημοκρατία της Κορέας",
  KR: "Δημοκρατία της Κορέας",
  KW: "Κουβέιτ",
  KG: "Κιργιζία",
  LA: "Λαϊκή Δημοκρατία του Λάος",
  LV: "Λετονία",
  LB: "Λίβανο",
  LS: "Βασίλειο του Λεσότο",
  LR: "Λιβερία",
  LY: "Κράτος της Λιβύης",
  LI: "Πριγκιπάτο του Λίχτενσταϊν",
  LT: "Λιθουανία",
  LU: "Λουξεμβούργο",
  MO: "Μακάου",
  MK: "Δημοκρατία της Βόρειας Μακεδονίας",
  MG: "Μαδαγασκάρη",
  MW: "Μαλάουι",
  MY: "Μαλαισία",
  MV: "Μαλβίδες",
  ML: "Μαλί",
  MT: "Μάλτα",
  MH: "Νήσοι Μάρσαλ",
  MQ: "Μαρτινίκα",
  MR: "Μαυριτανία",
  MU: "Μαυρίκιος",
  YT: "Μαγιότ",
  MX: "Μεξικό",
  FM: "Ομόσπονδες Πολιτείες της Μικρονησίας",
  MD: "Δημοκρατία της Μολδαβίας",
  MC: "Πριγκιπάτο του Μονακό",
  MN: "Μογγολία",
  MS: "Μοντσερράτ",
  MA: "Μαρόκο",
  MZ: "Μοζαμβίκη",
  MM: "Μιανμάρ",
  NA: "Ναμίμπια",
  NR: "Ναουρού",
  NP: "Νεπάλ",
  NL: "Ολλανδία",
  NC: "Νέα Καληδονία",
  NZ: "Νέα Ζηλανδία",
  NI: "Νικαράγουα",
  NE: "Νίγηρας",
  NG: "Νιγηρία",
  NU: "Νιούε",
  NF: "Νησί Νόρφολκ",
  MP: "Βόρειες Μαριάνες Νήσοι",
  NO: "Νορβηγία",
  OM: "Ομάν",
  PK: "Πακιστάν",
  PW: "Παλάου",
  PS: "Κράτος της Παλαιστίνης",
  PA: "Παναμάς",
  PG: "Παπούα Νέα Γουινέα",
  PY: "Παραγουάη",
  PE: "Περού",
  PH: "Φιλιππίνες",
  PN: "Νήσοι Πίτκαιρν",
  PL: "Πολωνία",
  PT: "Πορτογαλία",
  PR: "Πουέρτο Ρίκο",
  QA: "Κατάρ",
  RE: "Ρεϋνιόν",
  RO: "Ρουμανία",
  RU: "Ρωσική Ομοσπονδία",
  RW: "Ρουάντα",
  SH: "Νήσος Αγίας Ελένης",
  KN: "Ομοσπονδία Αγίου Χριστόφορου και Νέβις",
  LC: "Αγία Λουκία",
  PM: "Σαιν Πιερ και Μικελόν",
  VC: "Άγιος Βικέντιος και Γρεναδίνες",
  WS: "Σαμόα",
  SM: "Άγιος Μαρίνος",
  ST: "Σάο Τομέ και Πρίνσιπε",
  SA: "Σαουδική Αραβία",
  SN: "Σενεγάλη",
  SC: "Σεϋχέλλες",
  SL: "Σιέρα Λεόνε",
  SG: "Σιγκαπούρη",
  SK: "Σλοβακία",
  SI: "Σλοβενία",
  SB: "Νήσοι Σολομώντα",
  SO: "Σομαλία",
  ZA: "Νότια Αφρική",
  GS: "Νότιος Γεωργία και Νότιοι Σάντουιτς Νήσοι",
  ES: "Ισπανία",
  LK: "Σρι Λάνκα",
  SD: "Σουδάν",
  SR: "Σουρινάμ",
  SJ: "Σβάλμπαρντ και Γιαν Μαγιέν",
  SZ: "Σουαζιλάνδη",
  SE: "Σουηδία",
  CH: "Ελβετία",
  SY: "Αραβική Δημοκρατία της Συρίας",
  TW: "Δημοκρατία της Κίνας",
  TJ: "Τατζικιστάν",
  TZ: "Ενωμένη Δημοκρατία της Τανζανίας",
  TH: "Ταϊλάνδη",
  TL: "Ανατολικό Τιμόρ",
  TG: "Τογκό",
  TK: "Τοκελάου",
  TO: "Τόνγκα",
  TT: "Τρινιντάντ και Τομπάγκο",
  TN: "Τυνησία",
  TR: "Τουρκία",
  TM: "Τουρκμενιστάν",
  TC: "Τερκς και Κέικος",
  TV: "Τουβαλού",
  UG: "Ουγκάντα",
  UA: "Ουκρανια",
  AE: "Ηνωμένα Αραβικά Εμιράτα",
  GB: "Ηνωμένο Βασίλειο",
  US: "Ηνωμένες Πολιτείες Αμερικής",
  UM: "Απομακρυσμένες Νησίδες των Ηνωμένων Πολιτειών",
  UY: "Ουρουγουάη",
  UZ: "Ουζμπεκιστάν",
  VU: "Βανουάτου",
  VE: "Βενεζουέλα",
  VN: "Βιετνάμ",
  VG: "Βρετανικές Παρθένοι Νήσοι",
  VI: "Αμερικανικές Παρθένοι Νήσοι",
  WF: "Ουαλίς και Φουτουνά",
  EH: "Δυτική Σαχάρα",
  YE: "Υεμένη",
  ZM: "Ζάμπια",
  ZW: "Ζιμπάμπουε",
  AX: "Νήσοι Ώλαντ",
  BQ: "Μποναίρ, Άγιος Ευστάθιος και Σάμπα",
  CW: "Κουρασάο",
  GG: "Γκουέρνσεϊ",
  IM: "Νήσος του Μαν",
  JE: "Βαϊλάτο του Τζέρσεϊ",
  ME: "Μαυροβούνιο",
  BL: "Άγιος Βαρθολομαίος",
  MF: "Άγιος Μαρτίνος (Γαλλία)",
  RS: "Σερβία",
  SX: "Άγιος Μαρτίνος (Ολλανδία)",
  SS: "Νότιο Σουδάν",
  XK: "Κόσοβο"
};
const el = {
  locale: locale$Z,
  countries: countries$Z
};
const locale$Y = "en";
const countries$Y = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua and Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BV: "Bouvet Island",
  BR: "Brazil",
  IO: "British Indian Ocean Territory",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  CV: "Cape Verde",
  KY: "Cayman Islands",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: [
    "People's Republic of China",
    "China"
  ],
  CX: "Christmas Island",
  CC: "Cocos (Keeling) Islands",
  CO: "Colombia",
  KM: "Comoros",
  CG: [
    "Republic of the Congo",
    "Congo"
  ],
  CD: [
    "Democratic Republic of the Congo",
    "Congo"
  ],
  CK: "Cook Islands",
  CR: "Costa Rica",
  CI: [
    "Cote d'Ivoire",
    "Côte d'Ivoire",
    "Ivory Coast"
  ],
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: [
    "Czech Republic",
    "Czechia"
  ],
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Falkland Islands (Malvinas)",
  FO: "Faroe Islands",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GF: "French Guiana",
  PF: "French Polynesia",
  TF: "French Southern Territories",
  GA: "Gabon",
  GM: [
    "Republic of The Gambia",
    "The Gambia",
    "Gambia"
  ],
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Greece",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard Island and McDonald Islands",
  VA: "Holy See (Vatican City State)",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: [
    "Islamic Republic of Iran",
    "Iran"
  ],
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "North Korea",
  KR: [
    "South Korea",
    "Korea, Republic of",
    "Republic of Korea"
  ],
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Lao People's Democratic Republic",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MO: "Macao",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Micronesia, Federated States of",
  MD: "Moldova, Republic of",
  MC: "Monaco",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: [
    "Netherlands",
    "The Netherlands",
    "Netherlands (Kingdom of the)"
  ],
  NC: "New Caledonia",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk Island",
  MK: [
    "The Republic of North Macedonia",
    "North Macedonia"
  ],
  MP: "Northern Mariana Islands",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: [
    "State of Palestine",
    "Palestine"
  ],
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PN: [
    "Pitcairn",
    "Pitcairn Islands"
  ],
  PL: "Poland",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Romania",
  RU: [
    "Russian Federation",
    "Russia"
  ],
  RW: "Rwanda",
  SH: "Saint Helena",
  KN: "Saint Kitts and Nevis",
  LC: "Saint Lucia",
  PM: "Saint Pierre and Miquelon",
  VC: "Saint Vincent and the Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome and Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  GS: "South Georgia and the South Sandwich Islands",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard and Jan Mayen",
  SZ: "Eswatini",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syrian Arab Republic",
  TW: [
    "Taiwan, Province of China",
    "Taiwan"
  ],
  TJ: "Tajikistan",
  TZ: [
    "United Republic of Tanzania",
    "Tanzania"
  ],
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tunisia",
  TR: [
    "Türkiye",
    "Turkey"
  ],
  TM: "Turkmenistan",
  TC: "Turks and Caicos Islands",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: [
    "United Arab Emirates",
    "UAE"
  ],
  GB: [
    "United Kingdom",
    "UK",
    "Great Britain"
  ],
  US: [
    "United States of America",
    "United States",
    "USA",
    "U.S.A.",
    "US",
    "U.S."
  ],
  UM: "United States Minor Outlying Islands",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "Virgin Islands, British",
  VI: "Virgin Islands, U.S.",
  WF: "Wallis and Futuna",
  EH: "Western Sahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: [
    "Åland Islands",
    "Aland Islands"
  ],
  BQ: "Bonaire, Sint Eustatius and Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Isle of Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint Barthélemy",
  MF: "Saint Martin (French part)",
  RS: "Serbia",
  SX: "Sint Maarten (Dutch part)",
  SS: "South Sudan",
  XK: "Kosovo"
};
const en = {
  locale: locale$Y,
  countries: countries$Y
};
const locale$X = "es";
const countries$X = {
  AF: "Afganistán",
  AL: "Albania",
  DZ: "Argelia",
  AS: "Samoa Americana",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguila",
  AQ: "Antártida",
  AG: "Antigua y Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaiyán",
  BS: "Bahamas",
  BH: "Bahrein",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Bielorrusia",
  BE: "Bélgica",
  BZ: "Belice",
  BJ: "Benin",
  BM: "Bermudas",
  BT: "Bután",
  BO: "Bolivia",
  BA: "Bosnia y Herzegovina",
  BW: "Botswana",
  BV: "Isla Bouvet",
  BR: "Brasil",
  IO: "Territorio Británico del Océano Índico",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Camboya",
  CM: "Camerún",
  CA: "Canadá",
  CV: "Cabo Verde",
  KY: "Islas Caimán",
  CF: "República Centroafricana",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CX: "Isla de Navidad",
  CC: "Islas Cocos (Keeling)",
  CO: "Colombia",
  KM: "Comoras",
  CG: "Congo",
  CD: "Congo (República Democrática del)",
  CK: "Islas Cook",
  CR: "Costa Rica",
  CI: "Costa de Marfil",
  HR: "Croacia",
  CU: "Cuba",
  CY: "Chipre",
  CZ: "República Checa",
  DK: "Dinamarca",
  DJ: "Yibuti",
  DM: "Dominica",
  DO: "República Dominicana",
  EC: "Ecuador",
  EG: "Egipto",
  SV: "El Salvador",
  GQ: "Guinea Ecuatorial",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Etiopía",
  FK: "Islas Malvinas",
  FO: "Islas Feroe",
  FJ: "Fiji",
  FI: "Finlandia",
  FR: "Francia",
  GF: "Guayana Francesa",
  PF: "Polinesia Francesa",
  TF: "Tierras Australes Francesas",
  GA: "Gabón",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Alemania",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Grecia",
  GL: "Groenlandia",
  GD: "Granada",
  GP: "Guadalupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea Bissau",
  GY: "Guyana",
  HT: "Haití",
  HM: "Heard e Islas McDonald",
  VA: "Santa Sede",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungría",
  IS: "Islandia",
  IN: "India",
  ID: "Indonesia",
  IR: [
    "Irán",
    "República Islámica de Irán"
  ],
  IQ: "Iraq",
  IE: "Irlanda",
  IL: "Israel",
  IT: "Italia",
  JM: "Jamaica",
  JP: "Japón",
  JO: "Jordania",
  KZ: "Kazajistán",
  KE: "Kenia",
  KI: "Kiribati",
  KP: "República Popular Democrática de Corea",
  KR: "República de Corea",
  KW: "Kuwait",
  KG: "Kirguistán",
  LA: "República Democrática Popular de Lao",
  LV: "Letonia",
  LB: "Líbano",
  LS: "Lesoto",
  LR: "Liberia",
  LY: "Libia",
  LI: "Liechtenstein",
  LT: "Lituania",
  LU: "Luxemburgo",
  MO: "Macao",
  MK: "Macedonia del Norte",
  MG: "Madagascar",
  MW: "Malaui",
  MY: "Malasia",
  MV: "Maldivas",
  ML: "Malí",
  MT: "Malta",
  MH: "Islas Marshall",
  MQ: "Martinica",
  MR: "Mauritania",
  MU: "Mauricio",
  YT: "Mayotte",
  MX: "México",
  FM: "Micronesia",
  MD: "Moldavia",
  MC: "Mónaco",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Marruecos",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Países Bajos",
  NC: "Nueva Caledonia",
  NZ: "Nueva Zelanda",
  NI: "Nicaragua",
  NE: "Níger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Isla Norfolk",
  MP: "Islas Marianas del Norte",
  NO: "Noruega",
  OM: "Omán",
  PK: "Pakistán",
  PW: "Palau",
  PS: "Palestina",
  PA: "Panamá",
  PG: "Papua Nueva Guinea",
  PY: "Paraguay",
  PE: "Perú",
  PH: "Filipinas",
  PN: "Pitcairn",
  PL: "Polonia",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Catar",
  RE: "Reunión",
  RO: "Rumanía",
  RU: "Rusia",
  RW: "Ruanda",
  SH: "Santa Helena, Ascensión y Tristán de Acuña",
  KN: "Saint Kitts y Nevis",
  LC: "Santa Lucía",
  PM: "San Pedro y Miquelón",
  VC: "San Vicente y las Granadinas",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Santo Tomé y Príncipe",
  SA: "Arabia Saudita",
  SN: "Senegal",
  SC: "Seychelles",
  SL: "Sierra Leona",
  SG: "Singapur",
  SK: "Eslovaquia",
  SI: "Eslovenia",
  SB: "Islas Salomón",
  SO: "Somalia",
  ZA: "Sudáfrica",
  GS: "Georgia del Sur y las Islas Sandwich del Sur",
  ES: "España",
  LK: "Sri Lanka",
  SD: "Sudán",
  SR: "Suriname",
  SJ: "Svalbard y Jan Mayen",
  SZ: "Esuatini",
  SE: "Suecia",
  CH: "Suiza",
  SY: "República Árabe Siria",
  TW: "Taiwán",
  TJ: "Tayikistán",
  TZ: "Tanzania",
  TH: "Tailandia",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad y Tobago",
  TN: "Túnez",
  TR: "Turquía",
  TM: "Turkmenistán",
  TC: "Islas Turcas y Caicos",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ucrania",
  AE: "Emiratos Árabes Unidos",
  GB: "Reino Unido",
  US: "Estados Unidos",
  UM: "Islas Ultramarinas Menores de los Estados Unidos",
  UY: "Uruguay",
  UZ: "Uzbekistán",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "Islas Vírgenes británicas",
  VI: "Islas Vírgenes de los Estados Unidos",
  WF: "Wallis y Futuna",
  EH: "Sahara Occidental",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabue",
  AX: "Islas Åland",
  BQ: "Bonaire, San Eustaquio y Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Isla de Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint Barthélemy",
  MF: "Saint Martin (francesa)",
  RS: "Serbia",
  SX: "Sint Maarten (neerlandesa)",
  SS: "Sudán del Sur",
  XK: "Kosovo"
};
const es = {
  locale: locale$X,
  countries: countries$X
};
const locale$W = "et";
const countries$W = {
  AF: "Afganistan",
  AX: "Ahvenamaa",
  AL: "Albaania",
  DZ: "Alžeeria",
  AS: "Ameerika Samoa",
  US: "Ameerika Ühendriigid",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarktis",
  AG: "Antigua ja Barbuda",
  MO: "Aomen - Hiina erihalduspiirkond",
  AE: "Araabia Ühendemiraadid",
  AR: "Argentina",
  AM: "Armeenia",
  AW: "Aruba",
  AZ: "Aserbaidžaan",
  AU: "Austraalia",
  AT: "Austria",
  BS: "Bahama",
  BH: "Bahrein",
  BD: "Bangladesh",
  BB: "Barbados",
  PW: "Belau",
  BE: "Belgia",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Boliivia",
  BA: "Bosnia ja Hertsegoviina",
  BW: "Botswana",
  BV: "Bouvet’i saar",
  BR: "Brasiilia",
  BQ: "Bonaire, Sint Eustatius ja Saba",
  IO: "Briti India ookeani ala",
  VG: "Briti Neitsisaared",
  BN: "Brunei",
  BG: "Bulgaaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  CO: "Colombia",
  CK: "Cooki saared",
  CR: "Costa Rica",
  CI: "Côte d'Ivoire",
  CW: "Curaçao",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominikaani Vabariik",
  EC: "Ecuador",
  EE: "Eesti",
  EG: "Egiptus",
  GQ: "Ekvatoriaal-Guinea",
  SV: "El Salvador",
  ER: "Eritrea",
  ET: "Etioopia",
  FK: "Falklandi saared",
  FJ: "Fidži",
  PH: "Filipiinid",
  FO: "Fääri saared",
  GA: "Gabon",
  GM: "Gambia",
  GH: "Ghana",
  GI: "Gibraltar",
  GD: "Grenada",
  GE: "Gruusia",
  GL: "Gröönimaa",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GG: "Guernsey",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard ja McDonald saared",
  CN: "Hiina",
  ES: "Hispaania",
  NL: "Holland",
  HN: "Honduras",
  HK: "Hongkong - Hiina erihalduspiirkond",
  HR: "Horvaatia",
  TL: "Ida-Timor",
  IE: "Iirimaa",
  IL: "Iisrael",
  IN: "India",
  ID: "Indoneesia",
  IQ: "Iraak",
  IR: "Iraan",
  IS: "Island",
  IT: "Itaalia",
  JP: "Jaapan",
  JM: "Jamaica",
  YE: "Jeemen",
  JE: "Jersey",
  JO: "Jordaania",
  CX: "Jõulusaar",
  KY: "Kaimanisaared",
  KH: "Kambodža",
  CM: "Kamerun",
  CA: "Kanada",
  KZ: "Kasahstan",
  QA: "Katar",
  KE: "Kenya",
  CF: "Kesk-Aafrika Vabariik",
  KI: "Kiribati",
  KM: "Komoorid",
  CD: "Kongo DV",
  CG: "Kongo-Brazzaville",
  CC: "Kookossaared",
  GR: "Kreeka",
  CU: "Kuuba",
  KW: "Kuveit",
  KG: "Kõrgõzstan",
  CY: "Küpros",
  LA: "Laos",
  LT: "Leedu",
  LS: "Lesotho",
  LR: "Libeeria",
  LI: "Liechtenstein",
  LB: "Liibanon",
  LY: "Liibüa",
  LU: "Luksemburg",
  ZA: "Lõuna-Aafrika Vabariik",
  GS: "Lõuna-Georgia ja Lõuna-Sandwichi saared",
  KR: "Lõuna-Korea",
  LV: "Läti",
  EH: "Lääne-Sahara",
  MG: "Madagaskar",
  MY: "Malaisia",
  MW: "Malawi",
  MV: "Maldiivid",
  ML: "Mali",
  MT: "Malta",
  IM: "Mani saar",
  MA: "Maroko",
  MH: "Marshalli saared",
  MQ: "Martinique",
  MR: "Mauritaania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mehhiko",
  FM: "Mikroneesia Liiduriigid",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongoolia",
  ME: "Montenegro",
  MS: "Montserrat",
  MZ: "Mosambiik",
  MM: "Myanmar",
  NA: "Namiibia",
  NR: "Nauru",
  NP: "Nepal",
  NI: "Nicaragua",
  NG: "Nigeeria",
  NE: "Niger",
  NU: "Niue",
  NF: "Norfolk",
  NO: "Norra",
  OM: "Omaan",
  PG: "Paapua Uus-Guinea",
  PK: "Pakistan",
  PS: "Palestiina ala",
  PA: "Panama",
  PY: "Paraguay",
  PE: "Peruu",
  PN: "Pitcairn",
  PL: "Poola",
  PT: "Portugal",
  GF: "Prantsuse Guajaana",
  TF: "Prantsuse Lõunaalad",
  PF: "Prantsuse Polüneesia",
  FR: "Prantsusmaa",
  PR: "Puerto Rico",
  KP: "Põhja-Korea",
  MK: "Põhja-Makedoonia",
  MP: "Põhja-Mariaanid",
  RE: "Réunion",
  CV: "Roheneemesaared",
  SE: "Rootsi",
  SX: "Sint Maarten",
  RO: "Rumeenia",
  RW: "Rwanda",
  SB: "Saalomoni Saared",
  BL: "Saint Barthélemy",
  SH: "Saint Helena",
  KN: "Saint Kitts ja Nevis",
  LC: "Saint Lucia",
  MF: "Saint Martin",
  PM: "Saint Pierre ja Miquelon",
  VC: "Saint Vincent ja Grenadiinid",
  DE: "Saksamaa",
  ZM: "Sambia",
  WS: "Samoa",
  SM: "San Marino",
  ST: "São Tomé ja Príncipe",
  SA: "Saudi Araabia",
  SC: "Seišellid",
  SN: "Senegal",
  RS: "Serbia",
  SL: "Sierra Leone",
  SG: "Singapur",
  SK: "Slovakkia",
  SI: "Sloveenia",
  SO: "Somaalia",
  FI: "Soome",
  LK: "Sri Lanka",
  SD: "Sudaan",
  SS: "Lõuna-Sudaan",
  SR: "Suriname",
  GB: "Suurbritannia",
  SZ: "Svaasimaa",
  SJ: "Svalbard ja Jan Mayen",
  SY: "Süüria",
  CH: "Šveits",
  ZW: "Zimbabwe",
  DK: "Taani",
  TJ: "Tadžikistan",
  TH: "Tai",
  TW: "Taiwan",
  TZ: "Tansaania",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad ja Tobago",
  TD: "Tšaad",
  CZ: "Tšehhi",
  CL: "Tšiili",
  TN: "Tuneesia",
  TC: "Turks ja Caicos",
  TV: "Tuvalu",
  TR: "Türgi",
  TM: "Türkmenistan",
  UG: "Uganda",
  UA: "Ukraina",
  HU: "Ungari",
  UY: "Uruguay",
  VI: "USA Neitsisaared",
  UZ: "Usbekistan",
  NC: "Uus-Kaledoonia",
  NZ: "Uus-Meremaa",
  BY: "Valgevene",
  WF: "Wallis ja Futuna",
  VU: "Vanuatu",
  VA: "Vatikan",
  RU: "Venemaa",
  VE: "Venezuela",
  VN: "Vietnam",
  UM: "Ühendriikide hajasaared",
  XK: "Kosovo"
};
const et = {
  locale: locale$W,
  countries: countries$W
};
const locale$V = "eu";
const countries$V = {
  AF: "Afganistan",
  AL: "Albania",
  DZ: "Aljeria",
  AS: "Samoa Estatubatuarra",
  AD: "Andorra",
  AO: "Angola",
  AI: "Aingira",
  AQ: "Antartika",
  AG: "Antigua eta Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamak",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Bielorrusia",
  BE: "Belgika",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermudas",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia-Herzegovina",
  BW: "Botswana",
  BV: "Bouvet uhartea",
  BR: "Brasil",
  IO: "Indiako Ozeanoko Britainiar Lurraldea",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Kanbodia",
  CM: "Kamerun",
  CA: "Kanada",
  CV: "Cabo Verde",
  KY: "Kaiman uharteak",
  CF: "Afrika Erdiko Errepublika",
  TD: "Txad",
  CL: "Txile",
  CN: "Txina",
  CX: "Christmas uhartea",
  CC: "Cocosak (Keeling uharteak)",
  CO: "Kolonbia",
  KM: "Komoreak",
  CG: "Kongo",
  CD: "Kongoko Errepublika Demokratikoa",
  CK: "Cook uharteak",
  CR: "Costa Rica",
  CI: "Boli Kosta",
  HR: "Kroazia",
  CU: "Kuba",
  CY: "Zipre",
  CZ: "Txekia",
  DK: "Danimarka",
  DJ: "Djibuti",
  DM: "Dominika",
  DO: "Dominikar Errepublika",
  EC: "Ekuador",
  EG: "Egipto",
  SV: "El Salvador",
  GQ: "Ekuatore Ginea",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Etiopia",
  FK: "Malvinak",
  FO: "Faroe uharteak",
  FJ: "Fiji",
  FI: "Finlandia",
  FR: "Frantzia",
  GF: "Guyana Frantsesa",
  PF: "Polinesia Frantsesa",
  TF: "Frantziaren Lurralde Australak",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Alemania",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Grezia",
  GL: "Groenlandia",
  GD: "Grenada",
  GP: "Guadalupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Ginea",
  GW: "Ginea Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard eta McDonald uharteak",
  VA: "Vatikanoa (Egoitza Santua)",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungaria",
  IS: "Islandia",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Irak",
  IE: "Irlanda",
  IL: "Israel",
  IT: "Italia",
  JM: "Jamaika",
  JP: "Japonia",
  JO: "Jordania",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Ipar Korea",
  KR: "Hego Korea",
  KW: "Kuwait",
  KG: "Kirgizistan",
  LA: "Laos",
  LV: "Letonia",
  LB: "Libano",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libia",
  LI: "Liechtenstein",
  LT: "Lituania",
  LU: "Luxenburgo",
  MO: "Macao",
  MK: "Ipar Mazedonia",
  MG: "Madagaskar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldivak",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Uharteak",
  MQ: "Martinika",
  MR: "Mauritania",
  MU: "Maurizio",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Mikronesia",
  MD: "Moldavia",
  MC: "Monako",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Maroko",
  MZ: "Mozambike",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Herbehereak",
  NC: "Kaledonia Berria",
  NZ: "Zeelanda Berria",
  NI: "Nikaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk uhartea",
  MP: "Ipar Marianak",
  NO: "Norvegia",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestina",
  PA: "Panama",
  PG: "Papua Ginea Berria",
  PY: "Paraguai",
  PE: "Peru",
  PH: "Filipinak",
  PN: "Pitcairn uharteak",
  PL: "Polonia",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Errumania",
  RU: "Errusia",
  RW: "Ruanda",
  SH: "Santa Helena, Ascension eta Tristan da Cunha",
  KN: "Saint Kitts eta Nevis",
  LC: "Santa Luzia",
  PM: "Saint-Pierre eta Mikelune",
  VC: "Saint Vincent eta Grenadinak",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome eta Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  SC: "Seychelleak",
  SL: "Sierra Leona",
  SG: "Singapur",
  SK: "Eslovakia",
  SI: "Eslovenia",
  SB: "Salomon Uharteak",
  SO: "Somalia",
  ZA: "Hegoafrika",
  GS: "Hegoaldeko Georgiak eta Hegoaldeko Sandwichak",
  ES: "Espainia",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Surinam",
  SJ: "Svalbard eta Jan Mayen",
  SZ: "Swazilandia",
  SE: "Suedia",
  CH: "Suitza",
  SY: "Siriako Arabiar Errepublika",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailandia",
  TL: "Ekialdeko Timor",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad eta Tobago",
  TN: "Tunisia",
  TR: "Turkia",
  TM: "Turkmenistan",
  TC: "Turkak eta Caicoak",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraina",
  AE: "Arabiar Emirerri Batuak",
  GB: "Erresuma Batua",
  US: "Estatu Batuak",
  UM: "Ameriketako Estatu Batuetako itsasoz haraindiko uharteak",
  UY: "Uruguai",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "Birjina britainiar uharteak",
  VI: "Birjina Uharte Estatubatuarrak",
  WF: "Wallis eta Futuna",
  EH: "Mendebaldeko Sahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Åland uharteak",
  BQ: "Bonaire, San Eustakio eta Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Man uhartea",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "San Bartolome",
  MF: "San Martin (frantsesa)",
  RS: "Serbia",
  SX: "San Martin (herbeheretarra)",
  SS: "Hego Sudan",
  XK: "Kosovo"
};
const eu = {
  locale: locale$V,
  countries: countries$V
};
const locale$U = "fa";
const countries$U = {
  AD: "آندورا",
  AE: "امارات متحدهٔ عربی",
  AF: "افغانستان",
  AG: "آنتیگوا و باربودا",
  AI: "آنگویلا",
  AL: "آلبانی",
  AM: "ارمنستان",
  AO: "آنگولا",
  AQ: "جنوبگان",
  AR: "آرژانتین",
  AS: "ساموآی امریکا",
  AT: "اتریش",
  AU: "استرالیا",
  AW: "آروبا",
  AX: "جزایر آلاند",
  AZ: "جمهوری آذربایجان",
  BA: "بوسنی و هرزگوین",
  BB: "باربادوس",
  BD: "بنگلادش",
  BE: "بلژیک",
  BF: "بورکینافاسو",
  BG: "بلغارستان",
  BH: "بحرین",
  BI: "بوروندی",
  BJ: "بنین",
  BL: "سن بارتلمی",
  BM: "برمودا",
  BN: "برونئی",
  BO: "بولیوی",
  BQ: "جزایر کارائیب هلند",
  BR: "برزیل",
  BS: "باهاما",
  BT: "بوتان",
  BV: "جزیرهٔ بووه",
  BW: "بوتسوانا",
  BY: "بلاروس",
  BZ: "بلیز",
  CA: "کانادا",
  CC: "جزایر کوکوس",
  CD: "کنگو - کینشاسا",
  CF: "جمهوری افریقای مرکزی",
  CG: "کنگو - برازویل",
  CH: "سوئیس",
  CI: "ساحل عاج",
  CK: "جزایر کوک",
  CL: "شیلی",
  CM: "کامرون",
  CN: "چین",
  CO: "کلمبیا",
  CR: "کاستاریکا",
  CU: "کوبا",
  CV: "کیپ‌ورد",
  CW: "کوراسائو",
  CX: "جزیرهٔ کریسمس",
  CY: "قبرس",
  CZ: "جمهوری چک",
  DE: "آلمان",
  DJ: "جیبوتی",
  DK: "دانمارک",
  DM: "دومینیکا",
  DO: "جمهوری دومینیکن",
  DZ: "الجزایر",
  EC: "اکوادور",
  EE: "استونی",
  EG: "مصر",
  EH: "صحرای غربی",
  ER: "اریتره",
  ES: "اسپانیا",
  ET: "اتیوپی",
  FI: "فنلاند",
  FJ: "فیجی",
  FK: "جزایر فالکلند",
  FM: "میکرونزی",
  FO: "جزایر فارو",
  FR: "فرانسه",
  GA: "گابن",
  GB: "بریتانیا",
  GD: "گرنادا",
  GE: "گرجستان",
  GF: "گویان فرانسه",
  GG: "گرنزی",
  GH: "غنا",
  GI: "جبل‌الطارق",
  GL: "گرینلند",
  GM: "گامبیا",
  GN: "گینه",
  GP: "گوادلوپ",
  GQ: "گینهٔ استوایی",
  GR: "یونان",
  GS: "جزایر جورجیای جنوبی و ساندویچ جنوبی",
  GT: "گواتمالا",
  GU: "گوام",
  GW: "گینهٔ بیسائو",
  GY: "گویان",
  HK: "هنگ‌کنگ",
  HM: "جزیرهٔ هرد و جزایر مک‌دونالد",
  HN: "هندوراس",
  HR: "کرواسی",
  HT: "هائیتی",
  HU: "مجارستان",
  ID: "اندونزی",
  IE: "ایرلند",
  IL: "اسرائیل",
  IM: "جزیرهٔ من",
  IN: "هند",
  IO: "قلمرو بریتانیا در اقیانوس هند",
  IQ: "عراق",
  IR: "ایران",
  IS: "ایسلند",
  IT: "ایتالیا",
  JE: "جرزی",
  JM: "جامائیکا",
  JO: "اردن",
  JP: "ژاپن",
  KE: "کنیا",
  KG: "قرقیزستان",
  KH: "کامبوج",
  KI: "کیریباتی",
  KM: "کومورو",
  KN: "سنت کیتس و نویس",
  KP: "کرهٔ شمالی",
  KR: "کرهٔ جنوبی",
  KW: "کویت",
  KY: "جزایر کِیمن",
  KZ: "قزاقستان",
  LA: "لائوس",
  LB: "لبنان",
  LC: "سنت لوسیا",
  LI: "لیختن‌اشتاین",
  LK: "سری‌لانکا",
  LR: "لیبریا",
  LS: "لسوتو",
  LT: "لیتوانی",
  LU: "لوکزامبورگ",
  LV: "لتونی",
  LY: "لیبی",
  MA: "مراکش",
  MC: "موناکو",
  MD: "مولداوی",
  ME: "مونته‌نگرو",
  MF: "سنت مارتین",
  MG: "ماداگاسکار",
  MH: "جزایر مارشال",
  MK: "مقدونیه شمالی",
  ML: "مالی",
  MM: "میانمار (برمه)",
  MN: "مغولستان",
  MO: "ماکائو",
  MP: "جزایر ماریانای شمالی",
  MQ: "مارتینیک",
  MR: "موریتانی",
  MS: "مونت‌سرات",
  MT: "مالت",
  MU: "موریس",
  MV: "مالدیو",
  MW: "مالاوی",
  MX: "مکزیک",
  MY: "مالزی",
  MZ: "موزامبیک",
  NA: "نامیبیا",
  NC: "کالدونیای جدید",
  NE: "نیجر",
  NF: "جزیرهٔ نورفولک",
  NG: "نیجریه",
  NI: "نیکاراگوئه",
  NL: "هلند",
  NO: "نروژ",
  NP: "نپال",
  NR: "نائورو",
  NU: "نیوئه",
  NZ: "نیوزیلند",
  OM: "عمان",
  PA: "پاناما",
  PE: "پرو",
  PF: "پلی‌نزی فرانسه",
  PG: "پاپوا گینهٔ نو",
  PH: "فیلیپین",
  PK: "پاکستان",
  PL: "لهستان",
  PM: "سن پیر و میکلن",
  PN: "جزایر پیت‌کرن",
  PR: "پورتوریکو",
  PS: "سرزمین‌های فلسطینی",
  PT: "پرتغال",
  PW: "پالائو",
  PY: "پاراگوئه",
  QA: "قطر",
  RE: "رئونیون",
  RO: "رومانی",
  RS: "صربستان",
  RU: "روسیه",
  RW: "رواندا",
  SA: "عربستان سعودی",
  SB: "جزایر سلیمان",
  SC: "سیشل",
  SD: "سودان",
  SE: "سوئد",
  SG: "سنگاپور",
  SH: "سنت هلن",
  SI: "اسلوونی",
  SJ: "اسوالبارد و جان‌ماین",
  SK: "اسلواکی",
  SL: "سیرالئون",
  SM: "سان‌مارینو",
  SN: "سنگال",
  SO: "سومالی",
  SR: "سورینام",
  SS: "سودان جنوبی",
  ST: "سائوتومه و پرینسیپ",
  SV: "السالوادور",
  SX: "سنت مارتن",
  SY: "سوریه",
  SZ: "سوازیلند",
  TC: "جزایر تورکس و کایکوس",
  TD: "چاد",
  TF: "قلمروهای جنوبی فرانسه",
  TG: "توگو",
  TH: "تایلند",
  TJ: "تاجیکستان",
  TK: "توکلائو",
  TL: "تیمور-لسته",
  TM: "ترکمنستان",
  TN: "تونس",
  TO: "تونگا",
  TR: "ترکیه",
  TT: "ترینیداد و توباگو",
  TV: "تووالو",
  TW: "تایوان",
  TZ: "تانزانیا",
  UA: "اوکراین",
  UG: "اوگاندا",
  UM: "جزایر دورافتادهٔ ایالات متحده",
  US: "ایالات متحده",
  UY: "اروگوئه",
  UZ: "ازبکستان",
  VA: "واتیکان",
  VC: "سنت وینسنت و گرنادین",
  VE: "ونزوئلا",
  VG: "جزایر ویرجین بریتانیا",
  VI: "جزایر ویرجین ایالات متحده",
  VN: "ویتنام",
  VU: "وانواتو",
  WF: "والیس و فوتونا",
  WS: "ساموآ",
  XK: "کوزوو",
  YE: "یمن",
  YT: "مایوت",
  ZA: "افریقای جنوبی",
  ZM: "زامبیا",
  ZW: "زیمبابوه"
};
const fa = {
  locale: locale$U,
  countries: countries$U
};
const locale$T = "fi";
const countries$T = {
  AF: "Afganistan",
  AX: "Ahvenanmaa",
  NL: "Alankomaat",
  AL: "Albania",
  DZ: "Algeria",
  AS: "Amerikan Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarktis",
  AG: "Antigua ja Barbuda",
  AE: "Arabiemiirikunnat",
  AR: "Argentiina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AZ: "Azerbaidžan",
  BS: "Bahama",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BE: "Belgia",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BQ: "Bonaire, Sint Eustatius ja Saba",
  BA: "Bosnia ja Hertsegovina",
  BW: "Botswana",
  BV: "Bouvet’nsaari",
  BR: "Brasilia",
  IO: "Brittiläinen Intian valtameren alue",
  VG: "Brittiläiset Neitsytsaaret",
  BN: "Brunei",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KY: "Caymansaaret",
  CL: "Chile",
  CK: "Cookinsaaret",
  CR: "Costa Rica",
  CW: "Curaçao",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominikaaninen tasavalta",
  EC: "Ecuador",
  EG: "Egypti",
  SV: "El Salvador",
  ER: "Eritrea",
  ES: "Espanja",
  ET: "Etiopia",
  ZA: "Etelä-Afrikka",
  GS: "Etelä-Georgia ja Eteläiset Sandwichsaaret",
  SS: "Etelä-Sudan",
  FK: "Falklandinsaaret",
  FO: "Färsaaret",
  FJ: "Fidži",
  PH: "Filippiinit",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  GH: "Ghana",
  GI: "Gibraltar",
  GD: "Grenada",
  GL: "Grönlanti",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GG: "Guernsey",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard ja McDonaldinsaaret",
  HN: "Honduras",
  HK: "Hongkong",
  ID: "Indonesia",
  IN: "Intia",
  IQ: "Irak",
  IR: "Iran",
  IE: "Irlanti",
  IS: "Islanti",
  IL: "Israel",
  IT: "Italia",
  TL: "Itä-Timor",
  AT: "Itävalta",
  JM: "Jamaika",
  JP: "Japani",
  YE: "Jemen",
  JE: "Jersey",
  JO: "Jordania",
  CX: "Joulusaari",
  KH: "Kambodža",
  CM: "Kamerun",
  CA: "Kanada",
  CV: "Kap Verde",
  KZ: "Kazakstan",
  KE: "Kenia",
  CF: "Keski-Afrikan tasavalta",
  CN: "Kiina",
  KG: "Kirgisia",
  KI: "Kiribati",
  CO: "Kolumbia",
  KM: "Komorit",
  CD: "Kongon demokraattinen tasavalta",
  CG: "Kongon tasavalta",
  CC: "Kookossaaret",
  KP: "Korean demokraattinen kansantasavalta",
  KR: "Korean tasavalta",
  GR: "Kreikka",
  HR: "Kroatia",
  CU: "Kuuba",
  KW: "Kuwait",
  CY: "Kypros",
  LA: "Laos",
  LV: "Latvia",
  LS: "Lesotho",
  LB: "Libanon",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Liettua",
  LU: "Luxemburg",
  EH: "Länsi-Sahara",
  MO: "Macao",
  MG: "Madagaskar",
  MW: "Malawi",
  MV: "Malediivit",
  MY: "Malesia",
  ML: "Mali",
  MT: "Malta",
  IM: "Mansaari",
  MA: "Marokko",
  MH: "Marshallinsaaret",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Meksiko",
  FM: "Mikronesian liittovaltio",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MS: "Montserrat",
  MZ: "Mosambik",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolkinsaari",
  NO: "Norja",
  CI: "Norsunluurannikko",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestiina",
  PA: "Panama",
  PG: "Papua-Uusi-Guinea",
  PY: "Paraguay",
  PE: "Peru",
  MK: "Pohjois-Makedonia",
  MP: "Pohjois-Mariaanit",
  PN: "Pitcairn",
  PT: "Portugali",
  PR: "Puerto Rico",
  PL: "Puola",
  GQ: "Päiväntasaajan Guinea",
  QA: "Qatar",
  FR: "Ranska",
  TF: "Ranskan eteläiset alueet",
  GF: "Ranskan Guayana",
  PF: "Ranskan Polynesia",
  RE: "Réunion",
  RO: "Romania",
  RW: "Ruanda",
  SE: "Ruotsi",
  BL: "Saint-Barthélemy",
  SH: "Saint Helena",
  KN: "Saint Kitts ja Nevis",
  LC: "Saint Lucia",
  MF: "Saint-Martin",
  PM: "Saint-Pierre ja Miquelon",
  VC: "Saint Vincent ja Grenadiinit",
  DE: "Saksa",
  SB: "Salomonsaaret",
  ZM: "Sambia",
  WS: "Samoa",
  SM: "San Marino",
  ST: "São Tomé ja Príncipe",
  SA: "Saudi-Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychellit",
  SL: "Sierra Leone",
  SG: "Singapore",
  SX: "Sint Maarten",
  SK: "Slovakia",
  SI: "Slovenia",
  SO: "Somalia",
  LK: "Sri Lanka",
  SD: "Sudan",
  FI: "Suomi",
  SR: "Suriname",
  SJ: "Svalbard ja Jan Mayen",
  SZ: "Swazimaa",
  CH: "Sveitsi",
  SY: "Syyria",
  TJ: "Tadžikistan",
  TW: "Taiwan",
  TZ: "Tansania",
  DK: "Tanska",
  TH: "Thaimaa",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad ja Tobago",
  TD: "Tšad",
  CZ: "Tšekki",
  TN: "Tunisia",
  TR: "Turkki",
  TM: "Turkmenistan",
  TC: "Turks- ja Caicossaaret",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraina",
  HU: "Unkari",
  UY: "Uruguay",
  NC: "Uusi-Kaledonia",
  NZ: "Uusi-Seelanti",
  UZ: "Uzbekistan",
  BY: "Valko-Venäjä",
  VU: "Vanuatu",
  VA: "Vatikaanivaltio",
  VE: "Venezuela",
  RU: "Venäjä",
  VN: "Vietnam",
  EE: "Viro",
  WF: "Wallis ja Futunasaaret",
  GB: "Yhdistynyt kuningaskunta",
  US: "Yhdysvallat",
  VI: "Yhdysvaltain Neitsytsaaret",
  UM: "Yhdysvaltain pienet erillissaaret",
  ZW: "Zimbabwe",
  XK: "Kosovo"
};
const fi = {
  locale: locale$T,
  countries: countries$T
};
const locale$S = "fr";
const countries$S = {
  AF: "Afghanistan",
  AL: "Albanie",
  DZ: "Algérie",
  AS: "Samoa américaines",
  AD: "Andorre",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctique",
  AG: "Antigua-et-Barbuda",
  AR: "Argentine",
  AM: "Arménie",
  AW: "Aruba",
  AU: "Australie",
  AT: "Autriche",
  AZ: "Azerbaïdjan",
  BS: "Bahamas",
  BH: "Bahreïn",
  BD: "Bangladesh",
  BB: "Barbade",
  BY: "Biélorussie",
  BE: "Belgique",
  BZ: "Belize",
  BJ: "Bénin",
  BM: "Bermudes",
  BT: "Bhoutan",
  BO: "Bolivie",
  BA: "Bosnie-Herzégovine",
  BW: "Botswana",
  BV: "Île Bouvet",
  BR: "Brésil",
  IO: "Océan Indien Britannique",
  BN: "Brunei Darussalam",
  BG: "Bulgarie",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodge",
  CM: "Cameroun",
  CA: "Canada",
  CV: "Cap-Vert",
  KY: "Îles Caïmans",
  CF: "République Centrafricaine",
  TD: "Tchad",
  CL: "Chili",
  CN: "Chine",
  CX: "Île Christmas",
  CC: "Îles Cocos",
  CO: "Colombie",
  KM: "Comores",
  CG: "République du Congo",
  CD: "République démocratique du Congo",
  CK: "Îles Cook",
  CR: "Costa Rica",
  CI: "Côte-d'Ivoire",
  HR: "Croatie",
  CU: "Cuba",
  CY: "Chypre",
  CZ: "République Tchèque",
  DK: "Danemark",
  DJ: "Djibouti",
  DM: "Dominique",
  DO: "République Dominicaine",
  EC: "Équateur",
  EG: "Égypte",
  SV: "El Salvador",
  GQ: "Guinée équatoriale",
  ER: "Érythrée",
  EE: "Estonie",
  ET: "Éthiopie",
  FK: "Îles Malouines",
  FO: "Îles Féroé",
  FJ: "Fidji",
  FI: "Finlande",
  FR: "France",
  GF: "Guyane française",
  PF: "Polynésie française",
  TF: "Terres australes françaises",
  GA: "Gabon",
  GM: "Gambie",
  GE: "Géorgie",
  DE: "Allemagne",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Grèce",
  GL: "Groenland",
  GD: "Grenade",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinée",
  GW: "Guinée-Bissau",
  GY: "Guyana",
  HT: "Haïti",
  HM: "Îles Heard-et-MacDonald",
  VA: "Saint-Siège (Vatican)",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hongrie",
  IS: "Islande",
  IN: "Inde",
  ID: "Indonésie",
  IR: "Iran",
  IQ: "Irak",
  IE: "Irlande",
  IL: "Israël",
  IT: "Italie",
  JM: "Jamaïque",
  JP: "Japon",
  JO: "Jordanie",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Corée du Nord",
  KR: "Corée du Sud",
  KW: "Koweït",
  KG: "Kirghizistan",
  LA: "Laos",
  LV: "Lettonie",
  LB: "Liban",
  LS: "Lesotho",
  LR: "Libéria",
  LY: "Libye",
  LI: "Liechtenstein",
  LT: "Lituanie",
  LU: "Luxembourg",
  MO: "Macao",
  MK: "Macédoine du Nord",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaisie",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malte",
  MH: "Îles Marshall",
  MQ: "Martinique",
  MR: "Mauritanie",
  MU: "Maurice",
  YT: "Mayotte",
  MX: "Mexique",
  FM: "Micronésie",
  MD: "Moldavie",
  MC: "Monaco",
  MN: "Mongolie",
  MS: "Montserrat",
  MA: "Maroc",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibie",
  NR: "Nauru",
  NP: "Népal",
  NL: "Pays-Bas",
  NC: "Nouvelle-Calédonie",
  NZ: "Nouvelle-Zélande",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigéria",
  NU: "Niué",
  NF: "Île Norfolk",
  MP: "Îles Mariannes du Nord",
  NO: "Norvège",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palaos",
  PS: "Palestine",
  PA: "Panama",
  PG: "Papouasie-Nouvelle-Guinée",
  PY: "Paraguay",
  PE: "Pérou",
  PH: "Philippines",
  PN: "Îles Pitcairn",
  PL: "Pologne",
  PT: "Portugal",
  PR: "Porto Rico",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Roumanie",
  RU: "Russie",
  RW: "Rwanda",
  SH: "Sainte-Hélène",
  KN: "Saint-Christophe-et-Niévès",
  LC: "Sainte-Lucie",
  PM: "Saint-Pierre-et-Miquelon",
  VC: "Saint-Vincent-et-les-Grenadines",
  WS: "Samoa",
  SM: "Saint-Marin",
  ST: "São Tomé-et-Principe",
  SA: "Arabie Saoudite",
  SN: "Sénégal",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapour",
  SK: "Slovaquie",
  SI: "Slovénie",
  SB: "Îles Salomon",
  SO: "Somalie",
  ZA: "Afrique du Sud",
  GS: "Géorgie du Sud-et-les Îles Sandwich du Sud",
  ES: "Espagne",
  LK: "Sri Lanka",
  SD: "Soudan",
  SR: "Suriname",
  SJ: "Svalbard et Île Jan Mayen",
  SZ: "Royaume d'Eswatini",
  SE: "Suède",
  CH: "Suisse",
  SY: "Syrie",
  TW: "Taïwan",
  TJ: "Tadjikistan",
  TZ: "République unie de Tanzanie",
  TH: "Thaïlande",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinité-et-Tobago",
  TN: "Tunisie",
  TR: "Turquie",
  TM: "Turkménistan",
  TC: "Îles Turques-et-Caïques",
  TV: "Tuvalu",
  UG: "Ouganda",
  UA: "Ukraine",
  AE: "Émirats Arabes Unis",
  GB: "Royaume-Uni",
  US: "États-Unis d'Amérique",
  UM: "Îles mineures éloignées des États-Unis",
  UY: "Uruguay",
  UZ: "Ouzbékistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "Îles vierges britanniques",
  VI: "Îles vierges américaines",
  WF: "Wallis-et-Futuna",
  EH: "Sahara occidental",
  YE: "Yémen",
  ZM: "Zambie",
  ZW: "Zimbabwe",
  AX: "Åland",
  BQ: "Bonaire, Saint-Eustache et Saba",
  CW: "Curaçao",
  GG: "Guernesey",
  IM: "Île de Man",
  JE: "Jersey",
  ME: "Monténégro",
  BL: "Saint-Barthélemy",
  MF: "Saint-Martin (partie française)",
  RS: "Serbie",
  SX: "Saint-Martin (partie néerlandaise)",
  SS: "Soudan du Sud",
  XK: "Kosovo"
};
const fr = {
  locale: locale$S,
  countries: countries$S
};
const locale$R = "ga";
const countries$R = {
  AF: "An Afganastáin",
  AL: "An Albáin",
  DZ: "An Ailgéir",
  AS: "Samó Meiriceánach",
  AD: "Andóra",
  AO: "Angóla",
  AI: "Anguilla",
  AQ: "An Antartaice",
  AG: "Antigua agus Barbúda",
  AR: "An Airgintín",
  AM: "An Airméin",
  AW: "Arúba",
  AU: "An Astráil",
  AT: "An Ostair",
  AZ: "An Asarbaiseáin",
  BS: "Na Bahámaí",
  BH: "Bairéin",
  BD: "An Bhanglaidéis",
  BB: "Barbadós",
  BY: "An Bhealarúis",
  BE: "An Bheilg",
  BZ: "An Bheilís",
  BJ: "Beinin",
  BM: "Beirmiúda",
  BT: "An Bhútáin",
  BO: "An Bholaiv",
  BA: "An Bhoisnia agus An Heirseagaivéin",
  BW: "An Bhotsuáin",
  BV: "Oileán Bouvet",
  BR: "An Bhrasaíl",
  IO: "Críoch Aigéan Indiach na Breataine",
  BN: "Brúiné",
  BG: "An Bhulgáir",
  BF: "Buircíne Fasó",
  BI: "An Bhurúin",
  KH: "An Chambóid",
  CM: "Camarún",
  CA: "Ceanada",
  CV: "Rinn Verde",
  KY: "Oileáin Cayman",
  CF: "Poblacht na hAfraice Láir",
  TD: "Sead",
  CL: "An tSile",
  CN: [
    "Poblacht na Síne",
    "An tSín"
  ],
  CX: "Oileán na Nollag",
  CC: "Oileáin Cocos (Keeling)",
  CO: "An Cholóim",
  KM: "Oileáin Chomóra",
  CG: [
    "Poblacht an Chongó",
    "An Congó"
  ],
  CD: [
    "Poblacht Dhaonlathach an Chongó",
    "An Congó"
  ],
  CK: "Oileáin Cook",
  CR: "Cósta Ríce",
  CI: [
    "Cósta Eabhair",
    "An Cósta Eabhair",
    "Côte d'Ivoire"
  ],
  HR: "An Chróit",
  CU: "Cúba",
  CY: "An Chipir",
  CZ: [
    "Poblacht na Seice",
    "An tSeicia"
  ],
  DK: "An Danmhairg",
  DJ: "Djibouti",
  DM: "Doiminice",
  DO: "Poblacht Dhoiminiceach",
  EC: "Eacuadór",
  EG: "An Éigipt",
  SV: "An tSalvadóir",
  GQ: "An Ghuine Mheánchiorclach",
  ER: "An Eiritré",
  EE: "An Eastóin",
  ET: "An Aetóip",
  FK: "Oileáin Fháclainne (Malvinas)",
  FO: "Oileáin Fharó",
  FJ: "Fidsí",
  FI: "An Fhionlainn",
  FR: "An Fhrainc",
  GF: "Guáin na Fraince",
  PF: "Polainéis na Fraince",
  TF: "Críocha Deisceartacha na Fraince",
  GA: "An Ghabúin",
  GM: [
    "Poblacht na Gaimbia",
    "An Ghaimbia"
  ],
  GE: "An tSeoirsia",
  DE: "An Ghearmáin",
  GH: "Gána",
  GI: "Giobráltar",
  GR: "An Ghréig",
  GL: "An Ghraonlainn",
  GD: "Greanáda",
  GP: "Guadalúip",
  GU: "Guam",
  GT: "Guatamala",
  GN: "An Ghuine",
  GW: "Guine Bissau",
  GY: "An Ghuáin",
  HT: "Háití",
  HM: "Oileán Heard agus Oileáin McDonald",
  VA: "Cathair na Vatacáine",
  HN: "Hondúras",
  HK: "Hong Cong",
  HU: "An Ungáir",
  IS: "An Íoslainn",
  IN: "An India",
  ID: "An Indinéis",
  IR: [
    "Poblacht Ioslamach na hIaráine",
    "An Iaráin"
  ],
  IQ: "An Iaráic",
  IE: "Éire",
  IL: "Iosrael",
  IT: "An Iodáil",
  JM: "Iamáice",
  JP: "An tSeapáin",
  JO: "An Iordáin",
  KZ: "An Chasacstáin",
  KE: "An Chéinia",
  KI: "Cireabaití",
  KP: "An Chóiré Thuaidh",
  KR: [
    "An Chóiré Theas",
    "Poblacht na Cóiré",
    "An Chóiré"
  ],
  KW: "Cuáit",
  KG: "An Chirgeastáin",
  LA: "Poblacht Dhaonlathach na Laoise",
  LV: "An Laitvia",
  LB: "An Liobáin",
  LS: "Leosóta",
  LR: "An Libéir",
  LY: "An Libia",
  LI: "Lichtinstéin",
  LT: "An Liotuáin",
  LU: "Lucsamburg",
  MO: "Macao",
  MG: "Madagascar",
  MW: "An Mhaláiv",
  MY: "An Mhalaeisia",
  MV: "Oileáin Mhaildíve",
  ML: "Mailí",
  MT: "Málta",
  MH: "Oileáin Marshall",
  MQ: "Martinique",
  MR: "An Mháratáin",
  MU: "Oileán Mhuirís",
  YT: "Mayotte",
  MX: "Meicsiceo",
  FM: "Micrinéis, Stáit Chónaidhme",
  MD: "An Mholdóiv",
  MC: "Monacó",
  MN: "An Mhongóil",
  MS: "Montsarat",
  MA: "Maracó",
  MZ: "Mósaimbíc",
  MM: "Maenmar (Burma)",
  NA: "An Namaib",
  NR: "Nárú",
  NP: "Neipeal",
  NL: "An Ísiltír",
  NC: "An Nua-Chaladóin",
  NZ: "An Nua-Shéalainn",
  NI: "Nicearagua",
  NE: "An Nígir",
  NG: "An Nigéir",
  NU: "Niue",
  NF: "Oileán Norfolk",
  MK: [
    "Poblacht Iarthar na Macadóine",
    "An Mhacadóin Thuaidh"
  ],
  MP: "Oileáin Mariana Thuaidh",
  NO: "An Iorua",
  OM: "Óman",
  PK: "An Phacastáin",
  PW: "Palau",
  PS: [
    "Stát na Palaistíne",
    "An Phalaistín"
  ],
  PA: "Panama",
  PG: "Nua-Ghuine Phapua",
  PY: "Paragua",
  PE: "Peiriú",
  PH: "Na hOileáin Fhilipíneacha",
  PN: [
    "Oileáin Pitcairn",
    "Pitcairn"
  ],
  PL: "An Pholainn",
  PT: "An Phortaingéil",
  PR: "Pórtó Ríce",
  QA: "Catar",
  RE: "Réunion",
  RO: "An Rómáin",
  RU: [
    "An Rúis",
    "Cónaidhm na Rúise"
  ],
  RW: "Ruanda",
  SH: "Saint Helena",
  KN: "Saint Kitts agus Nevis",
  LC: "Saint Lucia",
  PM: "Saint Pierre agus Miquelon",
  VC: "Saint Vincent agus na Greanáidíní",
  WS: "Samó",
  SM: "San Mairíne",
  ST: "São Tomé agus Príncipe",
  SA: "An Araib Shádach",
  SN: "An tSeineagáil",
  SC: "Na Séiséil",
  SL: "Siarra Leon",
  SG: "Singeapór",
  SK: "An tSlóvaic",
  SI: "An tSlóivéin",
  SB: "Oileáin Sholamón",
  SO: "An tSomáil",
  ZA: "An Afraic Theas",
  GS: "An tSeoirsia Theas agus Oileáin Sandwich Theas",
  ES: "An Spáinn",
  LK: "Srí Lanca",
  SD: "An tSúdáin",
  SR: "Suranam",
  SJ: "Svalbard agus Jan Mayen",
  SZ: "An tSuasalainn",
  SE: "An tSualainn",
  CH: "An Eilvéis",
  SY: "Poblacht Arabach na Siria",
  TW: [
    "Taiwan, Cúige na Síne",
    "Taiwan"
  ],
  TJ: "An Táidsíceastáin",
  TZ: [
    "Poblacht Aontaithe na Tansáine",
    "An Tansáin"
  ],
  TH: "An Téalainn",
  TL: "Tíomór-Leste",
  TG: "Tóga",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Oileáin na Tríonóide agus Tobága",
  TN: "An Túinéis",
  TR: [
    "An Tuirc",
    "Tuirc"
  ],
  TM: "An Tuircméanastáin",
  TC: "Oileáin na dTurcach agus Caicos",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "An Úcráin",
  AE: "Aontas na nÉimíríochtaí Arabacha",
  GB: [
    "An Ríocht Aontaithe",
    "An Bhreatain Mhór",
    "An Ríocht Aontaithe"
  ],
  US: [
    "Stáit Aontaithe Mheiriceá",
    "Stáit Aontaithe",
    "SAM",
    "S.A.M.",
    "US",
    "S.A."
  ],
  UM: "Oileáin Imeallacha Stáit Aontaithe",
  UY: "Uragua",
  UZ: "An Úisbéiceastáin",
  VU: "Vanuatú",
  VE: "Veiniséala",
  VN: "Vítneam",
  VG: "Oileáin Bhriotanacha na Maighdean",
  VI: "Oileáin Mheiriceánacha na Maighdean",
  WF: "Wallis agus Futuna",
  EH: "An Sahára Thiar",
  YE: "Éimin",
  ZM: "An tSaimbia",
  ZW: "An tSiombáib",
  AX: [
    "Oileáin Åland",
    "Oileáin Aland"
  ],
  BQ: "Bonaire, Sint Eustatius agus Saba",
  CW: "Curaçao",
  GG: "Geansaí",
  IM: "Oileán Mhanann",
  JE: "Geirsí",
  ME: "Montainéagró",
  BL: "Saint Barthélemy",
  MF: "Saint Martin (cuid na Fraince)",
  RS: "An tSeirbia",
  SX: "Sint Maarten (cuid na hÍsiltíre)",
  SS: "An tSúdáin Theas",
  XK: "An Chosaiv"
};
const ga = {
  locale: locale$R,
  countries: countries$R
};
const locale$Q = "gl";
const countries$Q = {
  AF: "Afganistán",
  AL: "Albania",
  DZ: "Alxeria",
  AS: "Samoa Americana",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguila",
  AQ: "Antártida",
  AG: "Antiga e Barbuda",
  AR: "Arxentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Acerbaixán",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarús",
  BE: "Bélxica",
  BZ: "Belize",
  BJ: "Benín",
  BM: "Bermudas",
  BT: "Bhután",
  BO: "Bolivia",
  BA: "Bosnia e Hercegovina",
  BW: "Botswana",
  BV: "Illa Bouvet",
  BR: "Brasil",
  IO: "Territorio Británico do Océano Índico",
  BN: "Brunei",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Camboxa",
  CM: "Camerún",
  CA: "Canadá",
  CV: "Cabo Verde",
  KY: "Illas Caimán",
  CF: "República Centroafricana",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CX: "Territorio da Illa de Nadal",
  CC: "Illas Cocos (Keeling)",
  CO: "Colombia",
  KM: "Comores",
  CG: "Congo",
  CD: "Congo (República Democrática do)",
  CK: "Illas Cook",
  CR: "Costa Rica",
  CI: "Costa do Marfil",
  HR: "Croacia",
  CU: "Cuba",
  CY: "Chipre",
  CZ: "República Checa",
  DK: "Dinamarca",
  DJ: "Djibuti",
  DM: "Mancomunidade de Dominica",
  DO: "República Dominicana",
  EC: "Ecuador",
  EG: "Exipto",
  SV: "O Salvador",
  GQ: "Guinea Ecuatorial",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Etiopía",
  FK: "Illas Malvinas",
  FO: "Illas Feroe",
  FJ: "Fidxi",
  FI: "Finlandia",
  FR: "Francia",
  GF: "Güiana Francesa",
  PF: "Polinesia Francesa",
  TF: "Territorios Austrais Franceses",
  GA: "Gabón",
  GM: "Gambia",
  GE: "Xeorxia",
  DE: "Alemaña",
  GH: "Ghana",
  GI: "Xibraltar",
  GR: "Grecia",
  GL: "Groenlandia",
  GD: "Granada",
  GP: "Guadalupe",
  GU: "Territorio de Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Güiana",
  HT: "República de Haití",
  HM: "Illas Heard e McDonald",
  VA: "Santa Sé",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungría",
  IS: "Islandia",
  IN: "India",
  ID: "Indonesia",
  IR: "Irán (República Islámica de)",
  IQ: "Iraq",
  IE: "Irlanda",
  IL: "Israel",
  IT: "Italia",
  JM: "Xamaica",
  JP: "Xapón",
  JO: "Xordania",
  KZ: "Casaquistán",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "República Popular e Democrática de Corea",
  KR: "Corea do Sur",
  KW: "Kuwait",
  KG: "Kirguizistán",
  LA: "República Democrática Popular Lao",
  LV: "Letonia",
  LB: "Líbano",
  LS: "Lesoto",
  LR: "Liberia",
  LY: "Libia",
  LI: "Liechtenstein",
  LT: "Lituania",
  LU: "Luxemburgo",
  MO: "Macau",
  MK: "Macedonia do Norte",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaisia",
  MV: "República das Maldivas",
  ML: "Malí",
  MT: "Malta",
  MH: "República das Illas Marshall",
  MQ: "Martinica",
  MR: "Mauritania",
  MU: "Mauricio",
  YT: "Mayotte",
  MX: "México",
  FM: "Estados Federados de Micronesia",
  MD: "Moldova",
  MC: "Mónaco",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Marrocos",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Países Baixos",
  NC: "Nova Caledonia",
  NZ: "Nova Zelandia",
  NI: "Nicaragua",
  NE: "Níxer",
  NG: "Nixeria",
  NU: "Niue",
  NF: "Illa Norfolk",
  MP: "Marianas do Norte",
  NO: "Noruega",
  OM: "Omán",
  PK: "Paquistán",
  PW: "Palau",
  PS: "Palestina",
  PA: "Panamá",
  PG: "Papúa Nova Guinea",
  PY: "Paraguai",
  PE: "Perú",
  PH: "Filipinas",
  PN: "Illas Pitcairn",
  PL: "Polonia",
  PT: "Portugal",
  PR: "Porto Rico",
  QA: "Qatar",
  RE: "Reunión",
  RO: "Romanía",
  RU: "Rusia",
  RW: "Ruanda",
  SH: "Santa Helena, Ascensión e Tristan da Cunha",
  KN: "Saint Kitts e Nevis",
  LC: "Santa Lucía",
  PM: "San Pedro e Miquelón",
  VC: "San Vicente e as Granadinas",
  WS: "Samoa",
  SM: "San Marino",
  ST: "San Tomé e Príncipe",
  SA: "Arabia Saudita",
  SN: "Senegal",
  SC: "Seychelles",
  SL: "Serra Leoa",
  SG: "Singapur",
  SK: "Eslovaquia",
  SI: "Eslovenia",
  SB: "Illas Salomón",
  SO: "Somalia",
  ZA: "Suráfrica",
  GS: "Illas Xeorxia do Sur e Sandwich do Sur",
  ES: "España",
  LK: "Sri Lanka",
  SD: "Sudán",
  SR: "Suriname",
  SJ: "Svalbard e Jan Mayen",
  SZ: "Swazilandia",
  SE: "Suecia",
  CH: "Suiza",
  SY: "República Árabe Siria",
  TW: "Taiwán",
  TJ: "Taxicon",
  TZ: "Tanzania",
  TH: "Tailandia",
  TL: "Timor Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad e Tobago",
  TN: "Tunisia",
  TR: "Turquía",
  TM: "Turkmenistán",
  TC: "Illas Turks e Caicos",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ucraína",
  AE: "Emiratos Árabes Unidos",
  GB: "Reino Unido",
  US: "Estados Unidos",
  UM: "Illas Ultramarinas Menores dos Estados Unidos",
  UY: "Uruguai",
  UZ: "Uzbekistán",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "Illas Virxes Británicas",
  VI: "Illas Virxes dos Estados Unidos",
  WF: "Wallis e Futuna",
  EH: "Sáhara Occidental",
  YE: "Iemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Illas Åland",
  BQ: "Bonaire, San Eustaquio e Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Illa de Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint Barthélemy",
  MF: "San Martiño (francesa)",
  RS: "Serbia",
  SX: "Sint Maarten (neerlandesa)",
  SS: "Sudán do Sur",
  XK: "Kosovo"
};
const gl = {
  locale: locale$Q,
  countries: countries$Q
};
const locale$P = "ha";
const countries$P = {
  AF: "Afaganistan",
  AL: "Albaniya",
  DZ: "Aljeriya",
  AS: "Samowa Ta Amurka",
  AD: "Andora",
  AO: "Angola",
  AI: "Angila",
  AQ: "Antarctica",
  AG: "Antigwa da Barbuba",
  AR: "Arjantiniya",
  AM: "Armeniya",
  AW: "Aruba",
  AU: "Ostareliya",
  AT: "Ostiriya",
  AZ: "Azarbaijan",
  BS: "Bahamas",
  BH: "Baharan",
  BD: "Bangiladas",
  BB: "Barbadas",
  BY: "Belarus",
  BE: "Belgiyom",
  BZ: "Beliz",
  BJ: "Binin",
  BM: "Barmuda",
  BT: "Butan",
  BO: "Bolibiya",
  BA: "Bosniya Harzagobina",
  BW: "Baswana",
  BV: "Tsibirin Bouvet",
  BR: "Birazil",
  IO: "Yankin Birtaniya Na Tekun Indiya",
  BN: "Burune",
  BG: "Bulgariya",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Kambodiya",
  CM: "Kamaru",
  CA: "Kanada",
  CV: "Tsibiran Kap Barde",
  KY: "Tsibiran Kaiman",
  CF: "Jamhuriyar Afirka Ta Tsakiya",
  TD: "Cadi",
  CL: "Cayile",
  CN: "Caina, Sin",
  CX: "Tsibirin Kirsimeti",
  CC: "Tsibiran Cocos (Keeling)",
  CO: "Kolambiya",
  KM: "Kwamoras",
  CG: "Kongo",
  CD: "Jamhuriyar Dimokuraɗiyyar Kongo",
  CK: "Tsibiran Kuku",
  CR: "Kwasta Rika",
  CI: "Aibari Kwas",
  HR: "Kurowaishiya",
  CU: "Kyuba",
  CY: "Sifurus",
  CZ: "Jamhuriyar Cak",
  DK: "Danmark",
  DJ: "Jibuti",
  DM: "Dominika",
  DO: "Jamhuriyar Dominika",
  EC: "Ekwador",
  EG: "Masar, Misira",
  SV: "El Salbador",
  GQ: "Gini Ta Ikwaita",
  ER: "Eritireya",
  EE: "Estoniya",
  ET: "Habasha",
  FK: "Tsibiran Falkilan",
  FO: "Tsibirin Faroe",
  FJ: "Fiji",
  FI: "Finlan",
  FR: "Faransa",
  GF: "Gini Ta Faransa",
  PF: "Folinesiya Ta Faransa",
  TF: "Southernasashen Kudancin Faransa",
  GA: "Gabon",
  GM: "Gambiya",
  GE: "Jiwarjiya",
  DE: "Jamus",
  GH: "Gana",
  GI: "Jibaraltar",
  GR: "Girka",
  GL: "Grinlan",
  GD: "Girnada",
  GP: "Gwadaluf",
  GU: "Gwam",
  GT: "Gwatamala",
  GN: "Gini",
  GW: "Gini Bisau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Tsibirin Heard da McDonald",
  VA: "Batikan",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungari",
  IS: "Aisalan",
  IN: "Indiya",
  ID: "Indunusiya",
  IR: "Iran",
  IQ: "Iraƙi",
  IE: "Ayalan",
  IL: "Iziraʼila",
  IT: "Italiya",
  JM: "Jamaika",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakistan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Koreya Ta Arewa",
  KR: "Koreya Ta Kudu",
  KW: "Kwiyat",
  KG: "Kirgizistan",
  LA: "Lawas",
  LV: "latibiya",
  LB: "Labanan",
  LS: "Lesoto",
  LR: "Laberiya",
  LY: "Libiya",
  LI: "Licansitan",
  LT: "Lituweniya",
  LU: "Lukusambur",
  MO: "Macao",
  MG: "Madagaskar",
  MW: "Malawi",
  MY: "Malaisiya",
  MV: "Maldibi",
  ML: "Mali",
  MT: "Malta",
  MH: "Tsibiran Marshal",
  MQ: "Martinik",
  MR: "Moritaniya",
  MU: "Moritus",
  YT: "Mayoti",
  MX: "Makasiko",
  FM: "Mikuronesiya",
  MD: "Maldoba",
  MC: "Monako",
  MN: "Mangoliya",
  MS: "Manserati",
  MA: "Maroko",
  MZ: "Mozambik",
  MM: "Burma, Miyamar",
  NA: "Namibiya",
  NR: "Nauru",
  NP: "Nefal",
  NL: "Holan",
  NC: "Kaledoniya Sabuwa",
  NZ: "Nuzilan",
  NI: "Nikaraguwa",
  NE: "Nijar",
  NG: "Najeriya",
  NU: "Niyu",
  NF: "Tsibirin Narfalk",
  MK: "Masedoniya",
  MP: "Tsibiran Mariyana Na Arewa",
  NO: "Norwe",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palasɗinu",
  PA: "Panama",
  PG: "Papuwa Nugini",
  PY: "Paragai",
  PE: "Peru",
  PH: "Filipin",
  PN: "Pitakarin",
  PL: "Polan",
  PT: "Portugal",
  PR: "Porto Riko",
  QA: "Kwatar",
  RE: "Rawuniyan",
  RO: "Romaniya",
  RU: "Rasha",
  RW: "Ruwanda",
  SH: "San Helena",
  KN: "San Kiti Da Nebis",
  LC: "San Lusiya",
  PM: "San Piyar Da Mikelan",
  VC: "San Binsan Da Girnadin",
  WS: "Samowa",
  SM: "San Marino",
  ST: "Sawo Tome Da Paransip",
  SA: "Ƙasar Makka",
  SN: "Sinigal",
  SC: "Saishal",
  SL: "Salewo",
  SG: "Singapur",
  SK: "Sulobakiya",
  SI: "Sulobeniya",
  SB: "Tsibiran Salaman",
  SO: "Somaliya",
  ZA: "Afirka Ta Kudu",
  GS: "Kudancin Georgia da Kudancin Sandwich Island",
  ES: "Sipen",
  LK: "Siri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard da Jan Mayen",
  SZ: "Suwazilan",
  SE: "Suwedan",
  CH: "Suwizalan",
  SY: "Sham, Siriya",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzaniya",
  TH: "Tailan",
  TL: "Timor Ta Gabas",
  TG: "Togo",
  TK: "Takelau",
  TO: "Tanga",
  TT: "Tirinidad Da Tobago",
  TN: "Tunisiya",
  TR: "Turkiyya",
  TM: "Turkumenistan",
  TC: "Turkis Da Tsibiran Kaikwas",
  TV: "Tubalu",
  UG: "Yuganda",
  UA: "Yukaran",
  AE: "Haɗaɗɗiyar Daular Larabawa",
  GB: "Birtaniya",
  US: "Amurka",
  UM: "Kananan Tsibiran Amurka",
  UY: "Yurugai",
  UZ: "Uzubekistan",
  VU: "Banuwatu",
  VE: "Benezuwela",
  VN: "Biyetinam",
  VG: "Tsibirin Birjin Na Birtaniya",
  VI: "Tsibiran Birjin Ta Amurka",
  WF: "Walis Da Futuna",
  EH: "Yammacin Sahara",
  YE: "Yamal",
  ZM: "Zambiya",
  ZW: "Zimbabuwe",
  AX: "Tsibirin Åland",
  BQ: "Bonaire, Sint Eustatius da Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Isle na Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint Barthélemy",
  MF: "Saint Martin (Bangaren Faransa)",
  RS: "Sabiya",
  SX: "Sint Maarten (Sashin Yaren mutanen Holland)",
  SS: "Sudan ta Kudu",
  XK: "Kosovo"
};
const ha = {
  locale: locale$P,
  countries: countries$P
};
const locale$O = "he";
const countries$O = {
  AF: "אפגניסטן",
  AX: "איי אולנד",
  AL: "אלבניה",
  DZ: "אלג׳יריה",
  AS: "סמואה האמריקנית",
  AD: "אנדורה",
  AO: "אנגולה",
  AI: "אנגילה",
  AQ: "אנטארקטיקה",
  AG: "אנטיגואה וברבודה",
  AR: "ארגנטינה",
  AM: "ארמניה",
  AW: "ארובה",
  AU: "אוסטרליה",
  AT: "אוסטריה",
  AZ: "אזרבייג׳ן",
  BS: "איי בהאמה",
  BH: "בחריין",
  BD: "בנגלדש",
  BB: "ברבדוס",
  BY: "בלארוס",
  BE: "בלגיה",
  BZ: "בליז",
  BJ: "בנין",
  BM: "ברמודה",
  BT: "בהוטן",
  BO: "בוליביה",
  BQ: "האיים הקריביים ההולנדיים",
  BA: "בוסניה והרצגובינה",
  BW: "בוצוואנה",
  BV: "איי בובה",
  BR: "ברזיל",
  IO: "הטריטוריה הבריטית באוקיינוס ההודי",
  BN: "ברוניי",
  BG: "בולגריה",
  BF: "בורקינה פאסו",
  BI: "בורונדי",
  KH: "קמבודיה",
  CM: "קמרון",
  CA: "קנדה",
  CV: "כף ורדה",
  KY: "איי קיימן",
  CF: "הרפובליקה של מרכז אפריקה",
  TD: "צ׳אד",
  CL: "צ׳ילה",
  CN: "סין",
  CX: "האי כריסטמס",
  CC: "איי קוקוס (קילינג)",
  CO: "קולומביה",
  KM: "קומורו",
  CG: "קונגו - ברזאויל",
  CD: "קונגו - קינשאסה",
  CK: "איי קוק",
  CR: "קוסטה ריקה",
  CI: "חוף השנהב",
  HR: "קרואטיה",
  CU: "קובה",
  CW: "קוראסאו",
  CY: "קפריסין",
  CZ: "צ׳כיה",
  DK: "דנמרק",
  DJ: "ג׳יבוטי",
  DM: "דומיניקה",
  DO: "הרפובליקה הדומיניקנית",
  EC: "אקוודור",
  EG: "מצרים",
  SV: "אל סלבדור",
  GQ: "גינאה המשוונית",
  ER: "אריתריאה",
  EE: "אסטוניה",
  ET: "אתיופיה",
  FK: "איי פוקלנד",
  FO: "איי פארו",
  FJ: "פיג׳י",
  FI: "פינלנד",
  FR: "צרפת",
  GF: "גיאנה הצרפתית",
  PF: "פולינזיה הצרפתית",
  TF: "הטריטוריות הדרומיות של צרפת",
  GA: "גבון",
  GM: "גמביה",
  GE: "גאורגיה",
  DE: "גרמניה",
  GH: "גאנה",
  GI: "גיברלטר",
  GR: "יוון",
  GL: "גרינלנד",
  GD: "גרנדה",
  GP: "גוואדלופ",
  GU: "גואם",
  GT: "גואטמלה",
  GG: "גרנסי",
  GN: "גינאה",
  GW: "גינאה ביסאו",
  GY: "גיאנה",
  HT: "האיטי",
  HM: "איי הרד ומקדונלד",
  VA: "הוותיקן",
  HN: "הונדורס",
  HK: "הונג קונג (מחוז מנהלי מיוחד של סין)",
  HU: "הונגריה",
  IS: "איסלנד",
  IN: "הודו",
  ID: "אינדונזיה",
  IR: "איראן",
  IQ: "עיראק",
  IE: "אירלנד",
  IM: "האי מאן",
  IL: "ישראל",
  IT: "איטליה",
  JM: "ג׳מייקה",
  JP: "יפן",
  JE: "ג׳רסי",
  JO: "ירדן",
  KZ: "קזחסטן",
  KE: "קניה",
  KI: "קיריבאטי",
  KP: "קוריאה הצפונית",
  KR: "קוריאה הדרומית",
  KW: "כווית",
  KG: "קירגיזסטן",
  LA: "לאוס",
  LV: "לטביה",
  LB: "לבנון",
  LS: "לסוטו",
  LR: "ליבריה",
  LY: "לוב",
  LI: "ליכטנשטיין",
  LT: "ליטא",
  LU: "לוקסמבורג",
  MO: "מקאו (מחוז מנהלי מיוחד של סין)",
  MK: "מקדוניה הצפונית",
  MG: "מדגסקר",
  MW: "מלאווי",
  MY: "מלזיה",
  MV: "האיים המלדיביים",
  ML: "מאלי",
  MT: "מלטה",
  MH: "איי מרשל",
  MQ: "מרטיניק",
  MR: "מאוריטניה",
  MU: "מאוריציוס",
  YT: "מאיוט",
  MX: "מקסיקו",
  FM: "מיקרונזיה",
  MD: "מולדובה",
  MC: "מונקו",
  MN: "מונגוליה",
  ME: "מונטנגרו",
  MS: "מונסראט",
  MA: "מרוקו",
  MZ: "מוזמביק",
  MM: "מיאנמר (בורמה)",
  NA: "נמיביה",
  NR: "נאורו",
  NP: "נפאל",
  NL: "הולנד",
  NC: "קלדוניה החדשה",
  NZ: "ניו זילנד",
  NI: "ניקרגואה",
  NE: "ניז׳ר",
  NG: "ניגריה",
  NU: "ניווה",
  NF: "איי נורפוק",
  MP: "איי מריאנה הצפוניים",
  NO: "נורווגיה",
  OM: "עומאן",
  PK: "פקיסטן",
  PW: "פלאו",
  PS: "השטחים הפלסטיניים",
  PA: "פנמה",
  PG: "פפואה גינאה החדשה",
  PY: "פרגוואי",
  PE: "פרו",
  PH: "הפיליפינים",
  PN: "איי פיטקרן",
  PL: "פולין",
  PT: "פורטוגל",
  PR: "פוארטו ריקו",
  QA: "קטאר",
  RE: "ראוניון",
  RO: "רומניה",
  RU: "רוסיה",
  RW: "רואנדה",
  BL: "סנט ברתולומיאו",
  SH: "סנט הלנה",
  KN: "סנט קיטס ונוויס",
  LC: "סנט לוסיה",
  MF: "סן מרטן",
  PM: "סנט פייר ומיקלון",
  VC: "סנט וינסנט והגרנדינים",
  WS: "סמואה",
  SM: "סן מרינו",
  ST: "סאו טומה ופרינסיפה",
  SA: "ערב הסעודית",
  SN: "סנגל",
  RS: "סרביה",
  SC: "איי סיישל",
  SL: "סיירה לאונה",
  SG: "סינגפור",
  SX: "סנט מארטן",
  SK: "סלובקיה",
  SI: "סלובניה",
  SB: "איי שלמה",
  SO: "סומליה",
  ZA: "דרום אפריקה",
  GS: "ג׳ורג׳יה הדרומית ואיי סנדוויץ׳ הדרומיים",
  SS: "דרום סודן",
  ES: "ספרד",
  LK: "סרי לנקה",
  SD: "סודן",
  SR: "סורינם",
  SJ: "סוולבארד ויאן מאיין",
  SZ: "סווזילנד",
  SE: "שוודיה",
  CH: "שווייץ",
  SY: "סוריה",
  TW: "טייוואן",
  TJ: "טג׳יקיסטן",
  TZ: "טנזניה",
  TH: "תאילנד",
  TL: "טימור לסטה",
  TG: "טוגו",
  TK: "טוקלאו",
  TO: "טונגה",
  TT: "טרינידד וטובגו",
  TN: "טוניסיה",
  TR: "טורקיה",
  TM: "טורקמניסטן",
  TC: "איי טורקס וקאיקוס",
  TV: "טובאלו",
  UG: "אוגנדה",
  UA: "אוקראינה",
  AE: [
    "איחוד האמירויות הערביות",
    "איחוד האמירויות"
  ],
  GB: "הממלכה המאוחדת",
  US: [
    "ארצות הברית",
    "ארהב",
    "ארה״ב"
  ],
  UM: "האיים המרוחקים הקטנים של ארה״ב",
  UY: "אורוגוואי",
  UZ: "אוזבקיסטן",
  VU: "ונואטו",
  VE: "ונצואלה",
  VN: "וייטנאם",
  VG: "איי הבתולה הבריטיים",
  VI: "איי הבתולה של ארצות הברית",
  WF: "איי ווליס ופוטונה",
  EH: "סהרה המערבית",
  YE: "תימן",
  ZM: "זמביה",
  ZW: "זימבבואה",
  XK: "קוסובו"
};
const he = {
  locale: locale$O,
  countries: countries$O
};
const locale$N = "hi";
const countries$N = {
  AD: "अंडोरा",
  AE: "संयुक्त अरब अमीरात",
  AF: "अफगानिस्तान",
  AG: "एंटीगुआ और बारबूडा",
  AI: "अंग्विला",
  AL: "अल्बानिया",
  AM: "अर्मेनिया",
  AO: "अंगोला",
  AQ: "अंटार्टिका",
  AR: "अर्जेंटिना",
  AS: "अमेरिकान सामोआ",
  AT: "आस्ट्रिया",
  AU: "आस्ट्रेलिया",
  AW: "अरुबा",
  AX: "ऑलैण्ड द्वीपसमूह",
  AZ: "अजरबेजान",
  BA: "बोस्निया हर्जेगोविना",
  BB: "बार्बाडोस",
  BD: "बांग्लादेश",
  BE: "बेल्जियम",
  BF: "बुर्किना फासो",
  BG: "बल्गारिया",
  BH: "बहरीन",
  BI: "बुरुंडी",
  BJ: "बानिन",
  BL: "सेंट_बार्थेलेमी",
  BM: "बर्मूडा",
  BN: "ब्रुनेई",
  BO: "बोलिविया",
  BQ: "कैरिबियन नीदरलैंड",
  BR: "ब्राजील",
  BS: "बहामास",
  BT: "भूटान",
  BV: "बाउवेट",
  BW: "बोत्सवाना",
  BY: "बेलारुस",
  BZ: "बेलिजे",
  CA: "कनाडा",
  CC: "कोकोस (कीलिंग) द्वीप",
  CD: "कांगो लोकतान्त्रिक गणराज्य",
  CF: "सेंट्रल अफ्रीका गणतंत्र",
  CG: "कांगो",
  CH: "स्विट्जरलैंड",
  CI: "आइवरी कोस्ट",
  CK: "कुक द्वीप",
  CL: "चिली",
  CM: "कैमरून",
  CN: "चीन",
  CO: "कोलंबिया",
  CR: "कोस्टा रिका",
  CU: "क्यूबा",
  CV: "केप वर्दे",
  CW: "कुराकाओ",
  CX: "क्रिसमस द्वीप",
  CY: "साइप्रस",
  CZ: "चेक",
  DE: "जर्मनी",
  DJ: "जिबॉती",
  DK: "डैनमार्क",
  DM: "डोमिनिक",
  DO: "डोमिनिक गणतंत्र",
  DZ: "अल्जीरिया",
  EC: "इक्वाडोर",
  EE: "एस्तोनिया",
  EG: "मिस्र",
  EH: "पश्चिमी सहारा",
  ER: "एरिट्रेया",
  ES: "स्पेन",
  ET: "इथियोपिया",
  FI: "फिनलैंड",
  FJ: "फिजी",
  FK: "फाकलैंड द्वीप समूह (मालविनास)",
  FM: "माइक्रोनेशिया",
  FO: "फराओ द्वीप समूह",
  FR: "फ्रांस",
  GA: "गैबोन",
  GB: "ग्रेट ब्रिटेन",
  GD: "ग्रेनेडा",
  GE: "जॉर्जिया",
  GF: "फ्रेंच गुआना",
  GG: "ग्वेर्नसे",
  GH: "घाना",
  GI: "जिब्राल्टर",
  GL: "ग्रीनलैंड",
  GM: "गाम्बिया",
  GN: "गिनी",
  GP: "ग्वाडेलोप",
  GQ: "एक्वेटोरियल गिनी",
  GR: "यूनान",
  GS: "दक्षिण जॉर्जिया और दक्षिण सैंडविच द्वीप समूह",
  GT: "ग्वाटेमाला",
  GU: "ग्वाम",
  GW: "गिनी-बिसाउ",
  GY: "गुआना",
  HK: "हांग कांग",
  HM: "हर्ड एंड मैकडोनाल्ड द्वीपसमूह",
  HN: "होंडुरास",
  HR: "क्रोएशिया",
  HT: "हैती",
  HU: "हंगरी",
  ID: "इंडोनेशिया",
  IE: "आयरलैंड",
  IL: "इजराइल",
  IM: "आइसल ऑफ मैन",
  IN: "भारत",
  IO: "ब्रितानी हिंद महासागरीय क्षेत्र",
  IQ: "इराक",
  IR: "ईरान",
  IS: "आइसलैंड",
  IT: "इटली",
  JE: "जर्सी",
  JM: "जमैका",
  JO: "जॉर्डन",
  JP: "जापान",
  KE: "केन्या",
  KG: "किर्जिस्तान",
  KH: "कंबोडिया",
  KI: "किरिबिती",
  KM: "कोमोरोस",
  KN: "सेंट किट्स एंड नेविस",
  KP: "उत्तर कोरिया",
  KR: "दक्षिण कोरिया",
  KW: "कुवैत",
  KY: "केमैन आइसलैंड्स",
  KZ: "कज़ाखिस्तान",
  LA: "लाओस",
  LB: "लेबनान",
  LC: "सेंट लुसिया",
  LI: "लिक्टेनिस्टीन",
  LK: "श्री लंका",
  LR: "लाइबेरिया",
  LS: "लेसोथो",
  LT: "लिथुआनिया",
  LU: "लक्जमबर्ग",
  LV: "लात्विया",
  LY: "लीबिया",
  MA: "मोरक्को",
  MC: "मोनाको",
  MD: "मोलदोवा",
  ME: "मोंटेनेग्रो",
  MF: "सेंट मार्टिन की सामूहिकता",
  MG: "मैडागास्कर",
  MH: "मार्शल द्वीपसमूह",
  MK: "मकदूनिया",
  ML: "माली",
  MM: "म्यामांर (बर्मा)",
  MN: "मंगोलिया",
  MO: "मकाओ",
  MP: "उत्तर मैरिना द्वीपसमूह",
  MQ: "मार्टिनिक",
  MR: "मॉरितानिया",
  MS: "मोंटसेराट",
  MT: "माल्टा",
  MU: "मारीशस",
  MV: "मालदीव",
  MW: "मालावी",
  MX: "मेक्सिको",
  MY: "मलयेशिया",
  MZ: "मोजांबिक",
  NA: "नामीबिया",
  NC: "न्यू कैलेडोनिया",
  NE: "नाइजर",
  NF: "नोरफॉक द्वीप",
  NG: "नाइजीरिया",
  NI: "निकारागुआ",
  NL: "नीदरलैंड्स",
  NO: "नॉर्वे",
  NP: "नेपाल",
  NR: "नाउरू",
  NU: "नियू",
  NZ: "न्यूजीलैंड",
  OM: "ओमान",
  PA: "पनामा",
  PE: "पेरू",
  PF: "फ्रैंच गुआना",
  PG: "पापुआ न्यू गिनी",
  PH: "फिलीपींस",
  PK: "पाकिस्तान",
  PL: "पोलैंड",
  PM: "सेंट पिएरे एंड मिक्वेलॉन",
  PN: "पिटकैर्न द्वीपसमूह",
  PR: "पुएर्तो रिको",
  PS: "फिलिस्तीन राज्य",
  PT: "पुर्तगाल",
  PW: "पलाउ",
  PY: "पराग्वे",
  QA: "क़तार",
  RE: "रीयूनियन",
  RO: "रोमानिया",
  RS: "सर्बिया",
  RU: "रूस",
  RW: "रवांडा",
  SA: "सऊदी अरब",
  SB: "सोलोमन द्वीपसमूह",
  SC: "सेशेल्स",
  SD: "सूडान",
  SE: "स्वीडन",
  SG: "सिंगापुर",
  SH: "सेंट हेलेना",
  SI: "स्लोवानिया",
  SJ: "स्यालबार्ड (स्यालबार्ड एंड जन मावेम)",
  SK: "स्लोवाकिया",
  SL: "सियारा लिओन",
  SM: "सैन मारिनो",
  SN: "सेनेगल",
  SO: "सोमालिया",
  SR: "सूरीनाम",
  SS: "दक्षिण सूडान",
  ST: "साओ टॉम एंड प्रिंसिपी",
  SV: "सल्वाडोर",
  SX: "सिण्ट मार्टेन",
  SY: "सीरिया",
  SZ: "स्वाजीलैंड",
  TC: "तुर्क एंड कैकोस द्वीपसमूह",
  TD: "चाड",
  TF: "फ्रांसीसी दक्षिणी क्षेत्र",
  TG: "टोगो",
  TH: "थाईलैंड",
  TJ: "तज़ाकिस्तान",
  TK: "टोकेलू",
  TL: "पूर्वी तिमोर",
  TM: "तुर्कमेनिस्तान",
  TN: "ट्यूनीशिया",
  TO: "टोंगा",
  TR: "तुर्की",
  TT: "ट्रिनिडाड एंड टोबैगो",
  TV: "तुवालू",
  TW: "ताइवान",
  TZ: "तंजानिया",
  UA: "उक्रेन",
  UG: "उगांडा",
  UM: "यूएस माइनर आउटलाइंग द्वीपसमूह",
  US: "यूएसए (संयुक्त राज्य अमेरिका)",
  UY: "उरुग्वे",
  UZ: "उजबेकिस्तान",
  VA: "वेटिकन",
  VC: "सेंट विंसेंट एंड द ग्रेनेंडाइन्स",
  VE: "वेनेजुएला",
  VG: "ब्रितानी वर्जिन द्वीपसमूह",
  VI: "अमेरिकी वर्जिन द्वीपसमूह",
  VN: "विएतनाम",
  VU: "वनातू",
  WF: "वालीज एंड फुटुना",
  WS: "पश्चिमी सामोआ",
  XK: "कोसोवो",
  YE: "यमन",
  YT: "मायोते",
  ZA: "दक्षिण अफ्रीका",
  ZM: "जाम्बिया",
  ZW: "जिंबावे"
};
const hi = {
  locale: locale$N,
  countries: countries$N
};
const locale$M = "hr";
const countries$M = {
  AD: "Andora",
  AE: "Ujedinjeni Arapski Emirati",
  AF: "Afganistan",
  AG: "Antigva i Barbuda",
  AI: "Angvila",
  AL: "Albanija",
  AM: "Armenija",
  AO: "Angola",
  AQ: "Antarktika",
  AR: "Argentina",
  AS: "Američka Samoa",
  AT: "Austrija",
  AU: "Australija",
  AW: "Aruba",
  AX: "Ålandski otoci",
  AZ: "Azerbajdžan",
  BA: "Bosna i Hercegovina",
  BB: "Barbados",
  BD: "Bangladeš",
  BE: "Belgija",
  BF: "Burkina Faso",
  BG: "Bugarska",
  BH: "Bahrein",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint Barthélemy",
  BM: "Bermudi",
  BN: "Brunej",
  BO: "Bolivija",
  BQ: "Karipski otoci Nizozemske",
  BR: "Brazil",
  BS: "Bahami",
  BT: "Butan",
  BV: "Otok Bouvet",
  BW: "Bocvana",
  BY: "Bjelorusija",
  BZ: "Belize",
  CA: "Kanada",
  CC: "Kokosovi (Keelingovi) otoci",
  CD: "Kongo - Kinshasa",
  CF: "Srednjoafrička Republika",
  CG: "Kongo - Brazzaville",
  CH: "Švicarska",
  CI: "Obala Bjelokosti",
  CK: "Cookovi Otoci",
  CL: "Čile",
  CM: "Kamerun",
  CN: "Kina",
  CO: "Kolumbija",
  CR: "Kostarika",
  CU: "Kuba",
  CV: "Zelenortska Republika",
  CW: "Curaçao",
  CX: "Božićni otok",
  CY: "Cipar",
  CZ: "Češka",
  DE: "Njemačka",
  DJ: "Džibuti",
  DK: "Danska",
  DM: "Dominika",
  DO: "Dominikanska Republika",
  DZ: "Alžir",
  EC: "Ekvador",
  EE: "Estonija",
  EG: "Egipat",
  EH: "Zapadna Sahara",
  ER: "Eritreja",
  ES: "Španjolska",
  ET: "Etiopija",
  FI: "Finska",
  FJ: "Fidži",
  FK: "Falklandski otoci",
  FM: "Mikronezija",
  FO: "Farski otoci",
  FR: "Francuska",
  GA: "Gabon",
  GB: "Ujedinjeno Kraljevstvo",
  GD: "Grenada",
  GE: "Gruzija",
  GF: "Francuska Gijana",
  GG: "Guernsey",
  GH: "Gana",
  GI: "Gibraltar",
  GL: "Grenland",
  GM: "Gambija",
  GN: "Gvineja",
  GP: "Guadalupe",
  GQ: "Ekvatorska Gvineja",
  GR: "Grčka",
  GS: "Južna Georgija i Južni Sendvički Otoci",
  GT: "Gvatemala",
  GU: "Guam",
  GW: "Gvineja Bisau",
  GY: "Gvajana",
  HK: "PUP Hong Kong Kina",
  HM: "Otoci Heard i McDonald",
  HN: "Honduras",
  HR: "Hrvatska",
  HT: "Haiti",
  HU: "Mađarska",
  ID: "Indonezija",
  IE: "Irska",
  IL: "Izrael",
  IM: "Otok Man",
  IN: "Indija",
  IO: "Britanski Indijskooceanski teritorij",
  IQ: "Irak",
  IR: "Iran",
  IS: "Island",
  IT: "Italija",
  JE: "Jersey",
  JM: "Jamajka",
  JO: "Jordan",
  JP: "Japan",
  KE: "Kenija",
  KG: "Kirgistan",
  KH: "Kambodža",
  KI: "Kiribati",
  KM: "Komori",
  KN: "Sveti Kristofor i Nevis",
  KP: "Sjeverna Koreja",
  KR: "Južna Koreja",
  KW: "Kuvajt",
  KY: "Kajmanski otoci",
  KZ: "Kazahstan",
  LA: "Laos",
  LB: "Libanon",
  LC: "Sveta Lucija",
  LI: "Lihtenštajn",
  LK: "Šri Lanka",
  LR: "Liberija",
  LS: "Lesoto",
  LT: "Litva",
  LU: "Luksemburg",
  LV: "Latvija",
  LY: "Libija",
  MA: "Maroko",
  MC: "Monako",
  MD: "Moldavija",
  ME: "Crna Gora",
  MF: "Saint Martin",
  MG: "Madagaskar",
  MH: "Maršalovi Otoci",
  MK: "Sjeverna Makedonija",
  ML: "Mali",
  MM: "Mjanmar (Burma)",
  MN: "Mongolija",
  MO: "PUP Makao Kina",
  MP: "Sjevernomarijanski otoci",
  MQ: "Martinique",
  MR: "Mauretanija",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauricijus",
  MV: "Maldivi",
  MW: "Malavi",
  MX: "Meksiko",
  MY: "Malezija",
  MZ: "Mozambik",
  NA: "Namibija",
  NC: "Nova Kaledonija",
  NE: "Niger",
  NF: "Otok Norfolk",
  NG: "Nigerija",
  NI: "Nikaragva",
  NL: "Nizozemska",
  NO: "Norveška",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Novi Zeland",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "Francuska Polinezija",
  PG: "Papua Nova Gvineja",
  PH: "Filipini",
  PK: "Pakistan",
  PL: "Poljska",
  PM: "Saint-Pierre-et-Miquelon",
  PN: "Otoci Pitcairn",
  PR: "Portoriko",
  PS: "Palestinsko Područje",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paragvaj",
  QA: "Katar",
  RE: "Réunion",
  RO: "Rumunjska",
  RS: "Srbija",
  RU: "Rusija",
  RW: "Ruanda",
  SA: "Saudijska Arabija",
  SB: "Salomonski Otoci",
  SC: "Sejšeli",
  SD: "Sudan",
  SE: "Švedska",
  SG: "Singapur",
  SH: "Sveta Helena",
  SI: "Slovenija",
  SJ: "Svalbard i Jan Mayen",
  SK: "Slovačka",
  SL: "Sijera Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalija",
  SR: "Surinam",
  SS: "Južni Sudan",
  ST: "Sveti Toma i Princip",
  SV: "Salvador",
  SX: "Sint Maarten",
  SY: "Sirija",
  SZ: "Svazi",
  TC: "Otoci Turks i Caicos",
  TD: "Čad",
  TF: "Francuski južni i antarktički teritoriji",
  TG: "Togo",
  TH: "Tajland",
  TJ: "Tadžikistan",
  TK: "Tokelau",
  TL: "Timor-Leste",
  TM: "Turkmenistan",
  TN: "Tunis",
  TO: "Tonga",
  TR: "Turska",
  TT: "Trinidad i Tobago",
  TV: "Tuvalu",
  TW: "Tajvan",
  TZ: "Tanzanija",
  UA: "Ukrajina",
  UG: "Uganda",
  UM: "Mali udaljeni otoci SAD-a",
  US: "Sjedinjene Američke Države",
  UY: "Urugvaj",
  UZ: "Uzbekistan",
  VA: "Vatikanski Grad",
  VC: "Sveti Vincent i Grenadini",
  VE: "Venezuela",
  VG: "Britanski Djevičanski otoci",
  VI: "Američki Djevičanski otoci",
  VN: "Vijetnam",
  VU: "Vanuatu",
  WF: "Wallis i Futuna",
  WS: "Samoa",
  XK: "Kosovo",
  YE: "Jemen",
  YT: "Mayotte",
  ZA: "Južnoafrička Republika",
  ZM: "Zambija",
  ZW: "Zimbabve"
};
const hr = {
  locale: locale$M,
  countries: countries$M
};
const locale$L = "hu";
const countries$L = {
  AF: "Afganisztán",
  AL: "Albánia",
  DZ: "Algéria",
  AS: "Amerikai Szamoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarktisz",
  AG: "Antigua és Barbuda",
  AR: "Argentína",
  AM: "Örményország",
  AW: "Aruba",
  AU: "Ausztrália",
  AT: "Ausztria",
  AZ: "Azerbajdzsán",
  BS: "Bahama-szigetek",
  BH: "Bahrein",
  BD: "Banglades",
  BB: "Barbados",
  BY: "Fehéroroszország",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhután",
  BO: "Bolívia",
  BA: "Bosznia-Hercegovina",
  BW: "Botswana",
  BV: "Bouvet-sziget",
  BR: "Brazília",
  IO: "Brit Indiai-óceáni Terület",
  BN: "Brunei",
  BG: "Bulgária",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Kambodzsa",
  CM: "Kamerun",
  CA: "Kanada",
  CV: "Zöld-foki Köztársaság",
  KY: "Kajmán-szigetek",
  CF: "Közép-afrikai Köztársaság",
  TD: "Csád",
  CL: "Chile",
  CN: "Kína",
  CX: "Karácsony-sziget",
  CC: "Kókusz (Keeling)-szigetek",
  CO: "Kolumbia",
  KM: "Comore-szigetek",
  CG: "Kongói Köztársaság",
  CD: "Kongói Demokratikus Köztársaság",
  CK: "Cook-szigetek",
  CR: "Costa Rica",
  CI: "Elefántcsontpart",
  HR: "Horvátország",
  CU: "Kuba",
  CY: "Ciprus",
  CZ: "Csehország",
  DK: "Dánia",
  DJ: "Dzsibuti",
  DM: "Dominikai Közösség",
  DO: "Dominikai Köztársaság",
  EC: "Ecuador",
  EG: "Egyiptom",
  SV: "Salvador",
  GQ: "Egyenlítői-Guinea",
  ER: "Eritrea",
  EE: "Észtország",
  ET: "Etiópia",
  FK: "Falkland-szigetek",
  FO: "Feröer",
  FJ: "Fidzsi-szigetek",
  FI: "Finnország",
  FR: "Franciaország",
  GF: "Francia Guyana",
  PF: "Francia Polinézia",
  TF: "Francia déli területek",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Grúzia",
  DE: "Németország",
  GH: "Ghána",
  GI: "Gibraltár",
  GR: "Görögország",
  GL: "Grönland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Bissau-Guinea",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard-sziget és McDonald-szigetek",
  VA: "Vatikán",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Magyarország",
  IS: "Izland",
  IN: "India",
  ID: "Indonézia",
  IR: "Irán",
  IQ: "Irak",
  IE: "Írország",
  IL: "Izrael",
  IT: "Olaszország",
  JM: "Jamaica",
  JP: "Japán",
  JO: "Jordánia",
  KZ: "Kazahsztán",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Észak-Korea",
  KR: "Dél-Korea",
  KW: "Kuvait",
  KG: "Kirgizisztán",
  LA: "Laosz",
  LV: "Lettország",
  LB: "Libanon",
  LS: "Lesotho",
  LR: "Libéria",
  LY: "Líbia",
  LI: "Liechtenstein",
  LT: "Litvánia",
  LU: "Luxemburg",
  MO: "Makao",
  MK: "Észak-Macedónia",
  MG: "Madagaszkár",
  MW: "Malawi",
  MY: "Malajzia",
  MV: "Maldív-szigetek",
  ML: "Mali",
  MT: "Málta",
  MH: "Marshall-szigetek",
  MQ: "Martinique",
  MR: "Mauritánia",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexikó",
  FM: "Mikronéziai Szövetségi Államok",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongólia",
  MS: "Montserrat",
  MA: "Marokkó",
  MZ: "Mozambik",
  MM: "Mianmar",
  NA: "Namíbia",
  NR: "Nauru",
  NP: "Nepál",
  NL: "Hollandia",
  NC: "Új-Kaledónia",
  NZ: "Új-Zéland",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigéria",
  NU: "Niue",
  NF: "Norfolk-sziget",
  MP: "Északi-Mariana-szigetek",
  NO: "Norvégia",
  OM: "Omán",
  PK: "Pakisztán",
  PW: "Palau",
  PS: "Palesztina",
  PA: "Panama",
  PG: "Pápua Új-Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Fülöp-szigetek",
  PN: "Pitcairn-szigetek",
  PL: "Lengyelország",
  PT: "Portugália",
  PR: "Puerto Rico",
  QA: "Katar",
  RE: "Réunion",
  RO: "Románia",
  RU: "Oroszország",
  RW: "Ruanda",
  SH: "Saint Helena",
  KN: "Saint Kitts és Nevis",
  LC: "Saint Lucia",
  PM: "Saint Pierre and Miquelon",
  VC: "Saint Vincent és a Grenadine-szigetek",
  WS: "Szamoa",
  SM: "San Marino",
  ST: "São Tomé és Príncipe",
  SA: "Szaudi-Arábia",
  SN: "Szenegál",
  SC: "Seychelle-szigetek",
  SL: "Sierra Leone",
  SG: "Szingapúr",
  SK: "Szlovákia",
  SI: "Szlovénia",
  SB: "Salamon-szigetek",
  SO: "Szomália",
  ZA: "Dél-Afrika",
  GS: "Déli-Georgia és Déli-Sandwich-szigetek",
  ES: "Spanyolország",
  LK: "Sri Lanka",
  SD: "Szudán",
  SR: "Suriname",
  SJ: "Spitzbergák és Jan Mayen",
  SZ: "Szváziföld",
  SE: "Svédország",
  CH: "Svájc",
  SY: "Szíria",
  TW: "Tajvan",
  TJ: "Tádzsikisztán",
  TZ: "Tanzánia",
  TH: "Thaiföld",
  TL: "Kelet-Timor",
  TG: "Togo",
  TK: "Tokelau-szigetek",
  TO: "Tonga",
  TT: "Trinidad és Tobago",
  TN: "Tunézia",
  TR: "Törökország",
  TM: "Türkmenisztán",
  TC: "Turks- és Caicos-szigetek",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukrajna",
  AE: "Egyesült Arab Emírségek",
  GB: "Egyesült Királyság",
  US: "Amerikai Egyesült Államok",
  UM: "Az Amerikai Egyesült Államok lakatlan külbirtokai",
  UY: "Uruguay",
  UZ: "Üzbegisztán",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "Brit Virgin-szigetek",
  VI: "Amerikai Virgin-szigetek",
  WF: "Wallis és Futuna",
  EH: "Nyugat-Szahara",
  YE: "Jemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Åland",
  BQ: "Karibi Hollandia",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Man-sziget",
  JE: "Jersey",
  ME: "Montenegró",
  BL: "Saint Barthélemy",
  MF: "Szent Márton-sziget (francia rész)",
  RS: "Szerbia",
  SX: "Szent Márton-sziget (holland rész)",
  SS: "Dél-Szudán",
  XK: "Koszovó"
};
const hu = {
  locale: locale$L,
  countries: countries$L
};
const locale$K = "hy";
const countries$K = {
  AD: "Անդորրա",
  AE: "Արաբական Միացյալ Էմիրություններ",
  AF: "Աֆղանստան",
  AG: "Անտիգուա և Բարբուդա",
  AI: "Անգուիլա",
  AL: "Ալբանիա",
  AM: "Հայաստան",
  AO: "Անգոլա",
  AQ: "Անտարկտիդա",
  AR: "Արգենտինա",
  AS: "Ամերիկյան Սամոա",
  AT: "Ավստրիա",
  AU: "Ավստրալիա",
  AW: "Արուբա",
  AX: "Ալանդյան կղզիներ",
  AZ: "Ադրբեջան",
  BA: "Բոսնիա և Հերցեգովինա",
  BB: "Բարբադոս",
  BD: "Բանգլադեշ",
  BE: "Բելգիա",
  BF: "Բուրկինա Ֆասո",
  BG: "Բուլղարիա",
  BH: "Բահրեյն",
  BI: "Բուրունդի",
  BJ: "Բենին",
  BL: "Սեն Բարտելմի",
  BM: "Բերմուդներ",
  BN: "Բրունեյ",
  BO: "Բոլիվիա",
  BQ: "Կարիբյան Նիդեռլանդներ",
  BR: "Բրազիլիա",
  BS: "Բահամաներ",
  BT: "Բութան",
  BV: "Բուվե կղզի",
  BW: "Բոթսվանա",
  BY: "Բելառուս",
  BZ: "Բելիզ",
  CA: "Կանադա",
  CC: "Կոկոսյան (Քիլինգ) կղզիներ",
  CD: "Կոնգո - Կինշասա",
  CF: "Կենտրոնական Աֆրիկյան Հանրապետություն",
  CG: "Կոնգո - Բրազավիլ",
  CH: "Շվեյցարիա",
  CI: "Կոտ դ’Իվուար",
  CK: "Կուկի կղզիներ",
  CL: "Չիլի",
  CM: "Կամերուն",
  CN: "Չինաստան",
  CO: "Կոլումբիա",
  CR: "Կոստա Ռիկա",
  CU: "Կուբա",
  CV: "Կաբո Վերդե",
  CW: "Կյուրասաո",
  CX: "Սուրբ Ծննդյան կղզի",
  CY: "Կիպրոս",
  CZ: "Չեխիա",
  DE: "Գերմանիա",
  DJ: "Ջիբութի",
  DK: "Դանիա",
  DM: "Դոմինիկա",
  DO: "Դոմինիկյան Հանրապետություն",
  DZ: "Ալժիր",
  EC: "Էկվադոր",
  EE: "Էստոնիա",
  EG: "Եգիպտոս",
  EH: "Արևմտյան Սահարա",
  ER: "Էրիթրեա",
  ES: "Իսպանիա",
  ET: "Եթովպիա",
  FI: "Ֆինլանդիա",
  FJ: "Ֆիջի",
  FK: "Ֆոլքլենդյան կղզիներ",
  FM: "Միկրոնեզիա",
  FO: "Ֆարերյան կղզիներ",
  FR: "Ֆրանսիա",
  GA: "Գաբոն",
  GB: "Միացյալ Թագավորություն",
  GD: "Գրենադա",
  GE: "Վրաստան",
  GF: "Ֆրանսիական Գվիանա",
  GG: "Գերնսի",
  GH: "Գանա",
  GI: "Ջիբրալթար",
  GL: "Գրենլանդիա",
  GM: "Գամբիա",
  GN: "Գվինեա",
  GP: "Գվադելուպա",
  GQ: "Հասարակածային Գվինեա",
  GR: "Հունաստան",
  GS: "Հարավային Ջորջիա և Հարավային Սենդվիչյան կղզիներ",
  GT: "Գվատեմալա",
  GU: "Գուամ",
  GW: "Գվինեա-Բիսսաու",
  GY: "Գայանա",
  HK: "Հոնկոնգի ՀՎՇ",
  HM: "Հերդ կղզի և ՄակԴոնալդի կղզիներ",
  HN: "Հոնդուրաս",
  HR: "Խորվաթիա",
  HT: "Հայիթի",
  HU: "Հունգարիա",
  ID: "Ինդոնեզիա",
  IE: "Իռլանդիա",
  IL: "Իսրայել",
  IM: "Մեն կղզի",
  IN: "Հնդկաստան",
  IO: "Բրիտանական Տարածք Հնդկական Օվկիանոսում",
  IQ: "Իրաք",
  IR: "Իրան",
  IS: "Իսլանդիա",
  IT: "Իտալիա",
  JE: "Ջերսի",
  JM: "Ճամայկա",
  JO: "Հորդանան",
  JP: "Ճապոնիա",
  KE: "Քենիա",
  KG: "Ղրղզստան",
  KH: "Կամբոջա",
  KI: "Կիրիբատի",
  KM: "Կոմորյան կղզիներ",
  KN: "Սենտ Քիտս և Նևիս",
  KP: "Հյուսիսային Կորեա",
  KR: "Հարավային Կորեա",
  KW: "Քուվեյթ",
  KY: "Կայմանյան կղզիներ",
  KZ: "Ղազախստան",
  LA: "Լաոս",
  LB: "Լիբանան",
  LC: "Սենթ Լյուսիա",
  LI: "Լիխտենշտեյն",
  LK: "Շրի Լանկա",
  LR: "Լիբերիա",
  LS: "Լեսոտո",
  LT: "Լիտվա",
  LU: "Լյուքսեմբուրգ",
  LV: "Լատվիա",
  LY: "Լիբիա",
  MA: "Մարոկկո",
  MC: "Մոնակո",
  MD: "Մոլդովա",
  ME: "Չեռնոգորիա",
  MF: "Սեն Մարտեն",
  MG: "Մադագասկար",
  MH: "Մարշալյան կղզիներ",
  MK: "Հյուսիսային Մակեդոնիա",
  ML: "Մալի",
  MM: "Մյանմա (Բիրմա)",
  MN: "Մոնղոլիա",
  MO: "Չինաստանի Մակաո ՀՎՇ",
  MP: "Հյուսիսային Մարիանյան կղզիներ",
  MQ: "Մարտինիկա",
  MR: "Մավրիտանիա",
  MS: "Մոնսեռատ",
  MT: "Մալթա",
  MU: "Մավրիկիոս",
  MV: "Մալդիվներ",
  MW: "Մալավի",
  MX: "Մեքսիկա",
  MY: "Մալայզիա",
  MZ: "Մոզամբիկ",
  NA: "Նամիբիա",
  NC: "Նոր Կալեդոնիա",
  NE: "Նիգեր",
  NF: "Նորֆոլկ կղզի",
  NG: "Նիգերիա",
  NI: "Նիկարագուա",
  NL: "Նիդեռլանդներ",
  NO: "Նորվեգիա",
  NP: "Նեպալ",
  NR: "Նաուրու",
  NU: "Նիուե",
  NZ: "Նոր Զելանդիա",
  OM: "Օման",
  PA: "Պանամա",
  PE: "Պերու",
  PF: "Ֆրանսիական Պոլինեզիա",
  PG: "Պապուա Նոր Գվինեա",
  PH: "Ֆիլիպիններ",
  PK: "Պակիստան",
  PL: "Լեհաստան",
  PM: "Սեն Պիեռ և Միքելոն",
  PN: "Պիտկեռն կղզիներ",
  PR: "Պուերտո Ռիկո",
  PS: "Պաղեստինյան տարածքներ",
  PT: "Պորտուգալիա",
  PW: "Պալաու",
  PY: "Պարագվայ",
  QA: "Կատար",
  RE: "Ռեյունիոն",
  RO: "Ռումինիա",
  RS: "Սերբիա",
  RU: "Ռուսաստան",
  RW: "Ռուանդա",
  SA: "Սաուդյան Արաբիա",
  SB: "Սողոմոնյան կղզիներ",
  SC: "Սեյշելներ",
  SD: "Սուդան",
  SE: "Շվեդիա",
  SG: "Սինգապուր",
  SH: "Սուրբ Հեղինեի կղզի",
  SI: "Սլովենիա",
  SJ: "Սվալբարդ և Յան Մայեն",
  SK: "Սլովակիա",
  SL: "Սիեռա Լեոնե",
  SM: "Սան Մարինո",
  SN: "Սենեգալ",
  SO: "Սոմալի",
  SR: "Սուրինամ",
  SS: "Հարավային Սուդան",
  ST: "Սան Տոմե և Փրինսիպի",
  SV: "Սալվադոր",
  SX: "Սինտ Մարտեն",
  SY: "Սիրիա",
  SZ: "Սվազիլենդ",
  TC: "Թըրքս և Կայկոս կղզիներ",
  TD: "Չադ",
  TF: "Ֆրանսիական Հարավային Տարածքներ",
  TG: "Տոգո",
  TH: "Թայլանդ",
  TJ: "Տաջիկստան",
  TK: "Տոկելաու",
  TL: "Թիմոր Լեշտի",
  TM: "Թուրքմենստան",
  TN: "Թունիս",
  TO: "Տոնգա",
  TR: "Թուրքիա",
  TT: "Տրինիդադ և Տոբագո",
  TV: "Տուվալու",
  TW: "Թայվան",
  TZ: "Տանզանիա",
  UA: "Ուկրաինա",
  UG: "Ուգանդա",
  UM: "Արտաքին կղզիներ (ԱՄՆ)",
  US: "Միացյալ Նահանգներ",
  UY: "Ուրուգվայ",
  UZ: "Ուզբեկստան",
  VA: "Վատիկան",
  VC: "Սենթ Վինսենթ և Գրենադիններ",
  VE: "Վենեսուելա",
  VG: "Բրիտանական Վիրջինյան կղզիներ",
  VI: "ԱՄՆ Վիրջինյան կղզիներ",
  VN: "Վիետնամ",
  VU: "Վանուատու",
  WF: "Ուոլիս և Ֆուտունա",
  WS: "Սամոա",
  XK: "Կոսովո",
  YE: "Եմեն",
  YT: "Մայոտ",
  ZA: "Հարավաֆրիկյան Հանրապետություն",
  ZM: "Զամբիա",
  ZW: "Զիմբաբվե"
};
const hy = {
  locale: locale$K,
  countries: countries$K
};
const locale$J = "id";
const countries$J = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "Samoa Amerika",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua dan Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahama",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarusia",
  BE: "Belgia",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia dan Herzegovina",
  BW: "Botswana",
  BV: "Kepulauan Bouvet",
  BR: "Brasil",
  IO: "Teritori Samudra Hindia Britania",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Kamboja",
  CM: "Kamerun",
  CA: "Kanada",
  CV: "Tanjung Verde",
  KY: "Kepulauan Cayman",
  CF: "Afrika Tengah",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CX: "Pulau Natal",
  CC: "Kepulauan Cocos (Keeling)",
  CO: "Kolombia",
  KM: "Komoro",
  CG: "Kongo",
  CD: "Republik Demokratik Kongo",
  CK: "Kepulauan Cook",
  CR: "Kosta Rika",
  CI: "Pantai Gading",
  HR: "Kroasia",
  CU: "Kuba",
  CY: "Siprus",
  CZ: "Republik Ceko",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominika",
  DO: "Republik Dominika",
  EC: "Ekuador",
  EG: "Mesir",
  SV: "El Salvador",
  GQ: "Guinea Khatulistiwa",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Kepulauan Falkland(Malvinas)",
  FO: "Kepulauan Faroe",
  FJ: "Fiji",
  FI: "Finlandia",
  FR: "Perancis",
  GF: "Guyana Perancis",
  PF: "Polinesia Perancis",
  TF: "Antartika Perancis",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Jerman",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Yunani",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatamala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Pulau Heard dan Kepulauan McDonald",
  VA: "Vatikan",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungaria",
  IS: "Islandia",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Irak",
  IE: "Irlandia",
  IL: "Israel",
  IT: "Italia",
  JM: "Jamaika",
  JP: "Jepang",
  JO: "Yordania",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Korea Utara",
  KR: "Korea Selatan",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Laos",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxemburg",
  MO: "Makau",
  MK: "Makedonia Utara",
  MG: "Madagaskar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Kepulauan Marshall",
  MQ: "Martinik",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Meksiko",
  FM: "Federasi Mikronesia",
  MD: "Moldova",
  MC: "Monako",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Moroko",
  MZ: "Mozambik",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Belanda",
  NC: "Kaledonia Baru",
  NZ: "Selandia Baru",
  NI: "Nikaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Kepulauan Norfolk",
  MP: "Kepulauan Mariana Utara",
  NO: "Norwegia",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestina",
  PA: "Panama",
  PG: "Papua Nugini",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Filipina",
  PN: "Pitcairn",
  PL: "Polandia",
  PT: "Portugal",
  PR: "Puerto Riko",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Rumania",
  RU: "Rusia",
  RW: "Rwanda",
  SH: "Saint Helena",
  KN: "Saint Kitts dan Nevis",
  LC: "Saint Lucia",
  PM: "Saint Pierre dan Miquelon",
  VC: "Saint Vincent dan the Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome dan Principe",
  SA: "Arab Saudi",
  SN: "Senegal",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapura",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Kepulauan Solomon",
  SO: "Somalia",
  ZA: "Afrika Selatan",
  GS: "Georgia Selatan dan Kepulauan Sandwich Selatan",
  ES: "Spanyol",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard dan Jan Mayen",
  SZ: "Eswatini",
  SE: "Sweden",
  CH: "Swiss",
  SY: "Suriah",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad dan Tobago",
  TN: "Tunisia",
  TR: "Turki",
  TM: "Turkmenistan",
  TC: "Turks dan Caicos Islands",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraina",
  AE: "Uni Emirat Arab",
  GB: "Britania Raya",
  US: "Amerika Serikat",
  UM: "United States Minor Outlying Islands",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Viet Nam",
  VG: "Virgin Islands, British",
  VI: "Virgin Islands, U.S.",
  WF: "Wallis and Futuna",
  EH: "Sahara Barat",
  YE: "Yaman",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Åland Islands",
  BQ: "Bonaire, Sint Eustatius and Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Isle of Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint Barthélemy",
  MF: "Saint Martin (French part)",
  RS: "Serbia",
  SX: "Sint Maarten (Dutch part)",
  SS: "Sudan Selatan",
  XK: "Kosovo"
};
const id = {
  locale: locale$J,
  countries: countries$J
};
const locale$I = "is";
const countries$I = {
  AD: "Andorra",
  AE: "Sameinuðu arabísku furstadæmin",
  AF: "Afganistan",
  AG: "Antígva og Barbúda",
  AI: "Angvilla",
  AL: "Albanía",
  AM: "Armenía",
  AO: "Angóla",
  AQ: "Suðurskautslandið",
  AR: "Argentína",
  AS: "Bandaríska Samóa",
  AT: "Austurríki",
  AU: "Ástralía",
  AW: "Arúba",
  AX: "Álandseyjar",
  AZ: "Aserbaísjan",
  BA: "Bosnía og Hersegóvína",
  BB: "Barbados",
  BD: "Bangladess",
  BE: "Belgía",
  BF: "Búrkína Fasó",
  BG: "Búlgaría",
  BH: "Barein",
  BI: "Búrúndí",
  BJ: "Benín",
  BL: "Saint-Barthélemy",
  BM: "Bermúda",
  BN: "Brúnei",
  BO: "Bólivía",
  BQ: "Bonaire",
  BR: "Brasilía",
  BS: "Bahamas",
  BT: "Bútan",
  BV: "Bouveteyja",
  BW: "Botsvana",
  BY: "Hvíta-Rússland",
  BZ: "Belís",
  CA: "Kanada",
  CC: "Kókoseyjar",
  CD: "Lýðstjórnarlýðveldið Kongó",
  CF: "Mið-Afríkulýðveldið",
  CG: "Kongó",
  CH: "Sviss",
  CI: "Fílabeinsströndin",
  CK: "Cooks-eyjar",
  CL: "Síle",
  CM: "Kamerún",
  CN: "Kína",
  CO: "Kólumbía",
  CR: "Kosta Ríka",
  CU: "Kúba",
  CV: "Grænhöfðaeyjar",
  CW: "Curaçao",
  CX: "Jólaeyja",
  CY: "Kípur",
  CZ: "Tékkland",
  DE: "Þýskaland",
  DJ: "Djibútí",
  DK: "Danmörk",
  DM: "Dóminíka",
  DO: "Dóminíska lýðveldið",
  DZ: "Alsír",
  EC: "Ekvador",
  EE: "Eistland",
  EG: "Egyptaland",
  EH: "Vestur-Sahara",
  ER: "Eritrea",
  ES: "Spánn",
  ET: "Eþíópía",
  FI: "Finnland",
  FJ: "Fídjíeyjar",
  FK: "Falklandseyjar",
  FM: "Míkrónesía",
  FO: "Færeyjar",
  FR: "Frakkland",
  GA: "Gabon",
  GB: "Bretland",
  GD: "Grenada",
  GE: "Georgía",
  GF: "Franska Gvæjana",
  GG: "Guernsey",
  GH: "Gana",
  GI: "Gíbraltar",
  GL: "Grænland",
  GM: "Gambía",
  GN: "Gínea",
  GP: "Gvadelúpeyjar",
  GQ: "Miðbaugs-Gínea",
  GR: "Grikkland",
  GS: "Suður-Georgía og Suður-Sandvíkureyjar",
  GT: "Gvatemala",
  GU: "Gvam",
  GW: "Gínea-Bissá",
  GY: "Gvæjana",
  HK: "Hong Kong",
  HM: "Heard og McDonaldseyjar",
  HN: "Hondúras",
  HR: "Króatía",
  HT: "Haítí",
  HU: "Ungverjaland",
  ID: "Indónesía",
  IE: "Írland",
  IL: "Ísrael",
  IM: "Mön",
  IN: "Indland",
  IO: "Bresku Indlandshafseyjar",
  IQ: "Írak",
  IR: "Íran",
  IS: "Ísland",
  IT: "Ítalía",
  JE: "Jersey",
  JM: "Jamaíka",
  JO: "Jórdanía",
  JP: "Japan",
  KE: "Kenía",
  KG: "Kirgistan",
  KH: "Kambódía",
  KI: "Kíribatí",
  KM: "Kómoreyjar",
  KN: "Sankti Kristófer og Nevis",
  KP: "Norður-Kórea",
  KR: "Suður-Kórea",
  KW: "Kúveit",
  KY: "Cayman-eyjar",
  KZ: "Kasakstan",
  LA: "Laos",
  LB: "Líbanon",
  LC: "Sankti Lúsía",
  LI: "Liechtenstein",
  LK: "Srí Lanka",
  LR: "Líbería",
  LS: "Lesótó",
  LT: "Litháen",
  LU: "Lúxemborg",
  LV: "Lettland",
  LY: "Líbía",
  MA: "Marokkó",
  MC: "Mónakó",
  MD: "Moldóva",
  ME: "Svartfjallaland",
  MF: "Saint-Martin",
  MG: "Madagaskar",
  MH: "Marshalleyjar",
  MK: "Norður-Makedónía",
  ML: "Malí",
  MM: "Mjanmar",
  MN: "Mongólía",
  MO: "Makaó",
  MP: "Norður-Maríanaeyjar",
  MQ: "Martinique",
  MR: "Máritanía",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Máritíus",
  MV: "Maldívur",
  MW: "Malaví",
  MX: "Mexíkó",
  MY: "Malasía",
  MZ: "Mósambík",
  NA: "Namibía",
  NC: "Nýja-Kaledónía",
  NE: "Níger",
  NF: "Norfolkeyja",
  NG: "Nígería",
  NI: "Níkaragva",
  NL: "Holland",
  NO: "Noregur",
  NP: "Nepal",
  NR: "Naúrú",
  NU: "Niue",
  NZ: "Nýja-Sjáland",
  OM: "Óman",
  PA: "Panama",
  PE: "Perú",
  PF: "Franska Pólýnesía",
  PG: "Papúa Nýja-Gínea",
  PH: "Filippseyjar",
  PK: "Pakistan",
  PL: "Pólland",
  PM: "Sankti Pierre og Miquelon",
  PN: "Pitcairn",
  PR: "Púertó Ríkó",
  PS: "Palestína",
  PT: "Portúgal",
  PW: "Palá",
  PY: "Paragvæ",
  QA: "Katar",
  RE: "Réunion",
  RO: "Rúmenía",
  RS: "Serbía",
  RU: "Rússland",
  RW: "Rúanda",
  SA: "Sádi-Arabía",
  SB: "Salómonseyjar",
  SC: "Seychelles-eyjar",
  SD: "Súdan",
  SE: "Svíþjóð",
  SG: "Singapúr",
  SH: "Sankti Helena",
  SI: "Slóvenía",
  SJ: "Svalbarði",
  SK: "Slóvakía",
  SL: "Síerra Leóne",
  SM: "San Marínó",
  SN: "Senegal",
  SO: "Sómalía",
  SR: "Súrínam",
  SS: "Suður-Súdan",
  ST: "Saó Tóme og Prinsípe",
  SV: "El Salvador",
  SX: "Sint Maarten",
  SY: "Sýrland",
  SZ: "Esvatíní",
  TC: "Turks- og Caicoseyjar",
  TD: "Tjad",
  TF: "Frönsku suðlægu landsvæðin",
  TG: "Tógó",
  TH: "Taíland",
  TJ: "Tadsíkistan",
  TK: "Tókelá",
  TL: "Austur-Tímor",
  TM: "Túrkmenistan",
  TN: "Túnis",
  TO: "Tonga",
  TR: "Tyrkland",
  TT: "Trínidad og Tóbagó",
  TV: "Túvalú",
  TW: "Taívan",
  TZ: "Tansanía",
  UA: "Úkraína",
  UG: "Úganda",
  UM: "Smáeyjar Bandaríkjanna",
  US: "Bandaríkin",
  UY: "Úrúgvæ",
  UZ: "Úsbekistan",
  VA: "Vatíkanið",
  VC: "Sankti Vinsent og Grenadínur",
  VE: "Venesúela",
  VG: "Bresku Jómfrúaeyjar",
  VI: "Bandarísku Jómfrúaeyjar",
  VN: "Víetnam",
  VU: "Vanúatú",
  WF: "Wallis- og Fútúnaeyjar",
  WS: "Samóa",
  XK: "Kósovó",
  YE: "Jemen",
  YT: "Mayotte",
  ZA: "Suður-Afríka",
  ZM: "Sambía",
  ZW: "Simbabve"
};
const is = {
  locale: locale$I,
  countries: countries$I
};
const locale$H = "it";
const countries$H = {
  AD: "Andorra",
  AE: "Emirati Arabi Uniti",
  AF: "Afghanistan",
  AG: "Antigua e Barbuda",
  AI: "Anguilla",
  AL: "Albania",
  AM: "Armenia",
  AO: "Angola",
  AQ: "Antartide",
  AR: "Argentina",
  AS: "Samoa Americane",
  AT: "Austria",
  AU: "Australia",
  AW: "Aruba",
  AX: "Isole Åland",
  AZ: "Azerbaigian",
  BA: "Bosnia ed Erzegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgio",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrain",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint-Barthélemy",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivia",
  BQ: "Isole BES",
  BR: "Brasile",
  BS: "Bahamas",
  BT: "Bhutan",
  BV: "Isola Bouvet",
  BW: "Botswana",
  BY: "Bielorussia",
  BZ: "Belize",
  CA: "Canada",
  CC: "Isole Cocos e Keeling",
  CD: "Repubblica Democratica del Congo",
  CF: "Repubblica Centrafricana",
  CG: "Repubblica del Congo",
  CH: "Svizzera",
  CI: "Costa d'Avorio",
  CK: "Isole Cook",
  CL: "Cile",
  CM: "Camerun",
  CN: "Cina",
  CO: "Colombia",
  CR: "Costa Rica",
  CU: "Cuba",
  CV: "Capo Verde",
  CW: "Curaçao",
  CX: "Isola del Natale",
  CY: "Cipro",
  CZ: "Repubblica Ceca",
  DE: "Germania",
  DJ: "Gibuti",
  DK: "Danimarca",
  DM: "Dominica",
  DO: "Repubblica Dominicana",
  DZ: "Algeria",
  EC: "Ecuador",
  EE: "Estonia",
  EG: "Egitto",
  EH: "Sahara Occidentale",
  ER: "Eritrea",
  ES: "Spagna",
  ET: "Etiopia",
  FI: "Finlandia",
  FJ: "Figi",
  FK: "Isole Falkland",
  FM: "Stati Federati di Micronesia",
  FO: "Isole Fær Øer",
  FR: "Francia",
  GA: "Gabon",
  GB: "Regno Unito",
  GD: "Grenada",
  GE: "Georgia",
  GF: "Guyana Francese",
  GG: "Guernsey",
  GH: "Ghana",
  GI: "Gibilterra",
  GL: "Groenlandia",
  GM: "Gambia",
  GN: "Guinea",
  GP: "Guadalupa",
  GQ: "Guinea Equatoriale",
  GR: "Grecia",
  GS: "Georgia del Sud e isole Sandwich meridionali",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HK: "Hong Kong",
  HM: "Isole Heard e McDonald",
  HN: "Honduras",
  HR: "Croazia",
  HT: "Haiti",
  HU: "Ungheria",
  ID: "Indonesia",
  IE: "Irlanda",
  IL: "Israele",
  IM: "Isola di Man",
  IN: "India",
  IO: "Territori Britannici dell'Oceano Indiano",
  IQ: "Iraq",
  IR: "Iran",
  IS: "Islanda",
  IT: "Italia",
  JE: "Jersey",
  JM: "Giamaica",
  JO: "Giordania",
  JP: "Giappone",
  KE: "Kenya",
  KG: "Kirghizistan",
  KH: "Cambogia",
  KI: "Kiribati",
  KM: "Comore",
  KN: "Saint Kitts e Nevis",
  KP: "Corea del Nord",
  KR: "Corea del Sud",
  KW: "Kuwait",
  KY: "Isole Cayman",
  KZ: "Kazakistan",
  LA: "Laos",
  LB: "Libano",
  LC: "Santa Lucia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberia",
  LS: "Lesotho",
  LT: "Lituania",
  LU: "Lussemburgo",
  LV: "Lettonia",
  LY: "Libia",
  MA: "Marocco",
  MC: "Monaco",
  MD: "Moldavia",
  ME: "Montenegro",
  MF: "Saint-Martin",
  MG: "Madagascar",
  MH: "Isole Marshall",
  MK: "Macedonia del Nord",
  ML: "Mali",
  MM: "Birmania  Myanmar",
  MN: "Mongolia",
  MO: "Macao",
  MP: "Isole Marianne Settentrionali",
  MQ: "Martinica",
  MR: "Mauritania",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldive",
  MW: "Malawi",
  MX: "Messico",
  MY: "Malesia",
  MZ: "Mozambico",
  NA: "Namibia",
  NC: "Nuova Caledonia",
  NE: "Niger",
  NF: "Isola Norfolk",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Paesi Bassi",
  NO: "Norvegia",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Nuova Zelanda",
  OM: "Oman",
  PA: "Panamá",
  PE: "Perù",
  PF: "Polinesia Francese",
  PG: "Papua Nuova Guinea",
  PH: "Filippine",
  PK: "Pakistan",
  PL: "Polonia",
  PM: "Saint Pierre e Miquelon",
  PN: "Isole Pitcairn",
  PR: "Porto Rico",
  PS: "Stato di Palestina",
  PT: "Portogallo",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Romania",
  RS: "Serbia",
  RU: "Russia",
  RW: "Ruanda",
  SA: "Arabia Saudita",
  SB: "Isole Salomone",
  SC: "Seychelles",
  SD: "Sudan",
  SE: "Svezia",
  SG: "Singapore",
  SH: "Sant'Elena, Isola di Ascensione e Tristan da Cunha",
  SI: "Slovenia",
  SJ: "Svalbard e Jan Mayen",
  SK: "Slovacchia",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalia",
  SR: "Suriname",
  SS: "Sudan del Sud",
  ST: "São Tomé e Príncipe",
  SV: "El Salvador",
  SX: "Sint Maarten",
  SY: "Siria",
  SZ: "Eswatini",
  TC: "Isole Turks e Caicos",
  TD: "Ciad",
  TF: "Territori Francesi del Sud",
  TG: "Togo",
  TH: "Thailandia",
  TJ: "Tagikistan",
  TK: "Tokelau",
  TL: "Timor Est",
  TM: "Turkmenistan",
  TN: "Tunisia",
  TO: "Tonga",
  TR: "Turchia",
  TT: "Trinidad e Tobago",
  TV: "Tuvalu",
  TW: [
    "Repubblica di Cina",
    "Taiwan"
  ],
  TZ: "Tanzania",
  UA: "Ucraina",
  UG: "Uganda",
  UM: "Isole minori esterne degli Stati Uniti",
  US: "Stati Uniti d'America",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VA: "Città del Vaticano",
  VC: "Saint Vincent e Grenadine",
  VE: "Venezuela",
  VG: "Isole Vergini Britanniche",
  VI: "Isole Vergini Americane",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis e Futuna",
  WS: "Samoa",
  YE: "Yemen",
  YT: "Mayotte",
  ZA: "Sudafrica",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  XK: "Kosovo"
};
const it = {
  locale: locale$H,
  countries: countries$H
};
const locale$G = "ja";
const countries$G = {
  AF: "アフガニスタン",
  AL: "アルバニア",
  DZ: "アルジェリア",
  AS: "アメリカ領サモア",
  AD: "アンドラ",
  AO: "アンゴラ",
  AI: "アンギラ",
  AQ: "南極",
  AG: "アンティグア・バーブーダ",
  AR: "アルゼンチン",
  AM: "アルメニア",
  AW: "アルバ",
  AU: "オーストラリア",
  AT: "オーストリア",
  AZ: "アゼルバイジャン",
  BS: "バハマ",
  BH: "バーレーン",
  BD: "バングラデシュ",
  BB: "バルバドス",
  BY: "ベラルーシ",
  BE: "ベルギー",
  BZ: "ベリーズ",
  BJ: "ベナン",
  BM: "バミューダ",
  BT: "ブータン",
  BO: "ボリビア多民族国",
  BA: "ボスニア・ヘルツェゴビナ",
  BW: "ボツワナ",
  BV: "ブーベ島",
  BR: "ブラジル",
  IO: "イギリス領インド洋地域",
  BN: "ブルネイ・ダルサラーム",
  BG: "ブルガリア",
  BF: "ブルキナファソ",
  BI: "ブルンジ",
  KH: "カンボジア",
  CM: "カメルーン",
  CA: "カナダ",
  CV: "カーボベルデ",
  KY: "ケイマン諸島",
  CF: "中央アフリカ共和国",
  TD: "チャド",
  CL: "チリ",
  CN: "中華人民共和国",
  CX: "クリスマス島",
  CC: "ココス（キーリング）諸島",
  CO: "コロンビア",
  KM: "コモロ",
  CG: "コンゴ共和国",
  CD: "コンゴ民主共和国",
  CK: "クック諸島",
  CR: "コスタリカ",
  CI: "コートジボワール",
  HR: "クロアチア",
  CU: "キューバ",
  CY: "キプロス",
  CZ: "チェコ",
  DK: "デンマーク",
  DJ: "ジブチ",
  DM: "ドミニカ国",
  DO: "ドミニカ共和国",
  EC: "エクアドル",
  EG: "エジプト",
  SV: "エルサルバドル",
  GQ: "赤道ギニア",
  ER: "エリトリア",
  EE: "エストニア",
  ET: "エチオピア",
  FK: "フォークランド（マルビナス）諸島",
  FO: "フェロー諸島",
  FJ: "フィジー",
  FI: "フィンランド",
  FR: "フランス",
  GF: "フランス領ギアナ",
  PF: "フランス領ポリネシア",
  TF: "フランス領南方・南極地域",
  GA: "ガボン",
  GM: "ガンビア",
  GE: "ジョージア",
  DE: "ドイツ",
  GH: "ガーナ",
  GI: "ジブラルタル",
  GR: "ギリシャ",
  GL: "グリーンランド",
  GD: "グレナダ",
  GP: "グアドループ",
  GU: "グアム",
  GT: "グアテマラ",
  GN: "ギニア",
  GW: "ギニアビサウ",
  GY: "ガイアナ",
  HT: "ハイチ",
  HM: "ハード島とマクドナルド諸島",
  VA: "バチカン市国",
  HN: "ホンジュラス",
  HK: "香港",
  HU: "ハンガリー",
  IS: "アイスランド",
  IN: "インド",
  ID: "インドネシア",
  IR: "イラン・イスラム共和国",
  IQ: "イラク",
  IE: "アイルランド",
  IL: "イスラエル",
  IT: "イタリア",
  JM: "ジャマイカ",
  JP: "日本",
  JO: "ヨルダン",
  KZ: "カザフスタン",
  KE: "ケニア",
  KI: "キリバス",
  KP: "朝鮮民主主義人民共和国",
  KR: "大韓民国",
  KW: "クウェート",
  KG: "キルギス",
  LA: "ラオス人民民主共和国",
  LV: "ラトビア",
  LB: "レバノン",
  LS: "レソト",
  LR: "リベリア",
  LY: "リビア",
  LI: "リヒテンシュタイン",
  LT: "リトアニア",
  LU: "ルクセンブルク",
  MO: "マカオ",
  MG: "マダガスカル",
  MW: "マラウイ",
  MY: "マレーシア",
  MV: "モルディブ",
  ML: "マリ",
  MT: "マルタ",
  MH: "マーシャル諸島",
  MQ: "マルティニーク",
  MR: "モーリタニア",
  MU: "モーリシャス",
  YT: "マヨット",
  MX: "メキシコ",
  FM: "ミクロネシア連邦",
  MD: "モルドバ共和国",
  MC: "モナコ",
  MN: "モンゴル",
  MS: "モントセラト",
  MA: "モロッコ",
  MZ: "モザンビーク",
  MM: "ミャンマー",
  NA: "ナミビア",
  NR: "ナウル",
  NP: "ネパール",
  NL: "オランダ",
  NC: "ニューカレドニア",
  NZ: "ニュージーランド",
  NI: "ニカラグア",
  NE: "ニジェール",
  NG: "ナイジェリア",
  NU: "ニウエ",
  NF: "ノーフォーク島",
  MK: "北マケドニア",
  MP: "北マリアナ諸島",
  NO: "ノルウェー",
  OM: "オマーン",
  PK: "パキスタン",
  PW: "パラオ",
  PS: "パレスチナ",
  PA: "パナマ",
  PG: "パプアニューギニア",
  PY: "パラグアイ",
  PE: "ペルー",
  PH: "フィリピン",
  PN: "ピトケアン",
  PL: "ポーランド",
  PT: "ポルトガル",
  PR: "プエルトリコ",
  QA: "カタール",
  RE: "レユニオン",
  RO: "ルーマニア",
  RU: "ロシア連邦",
  RW: "ルワンダ",
  SH: "セントヘレナ・アセンションおよびトリスタンダクーニャ",
  KN: "セントクリストファー・ネイビス",
  LC: "セントルシア",
  PM: "サンピエール島・ミクロン島",
  VC: "セントビンセントおよびグレナディーン諸島",
  WS: "サモア",
  SM: "サンマリノ",
  ST: "サントメ・プリンシペ",
  SA: "サウジアラビア",
  SN: "セネガル",
  SC: "セーシェル",
  SL: "シエラレオネ",
  SG: "シンガポール",
  SK: "スロバキア",
  SI: "スロベニア",
  SB: "ソロモン諸島",
  SO: "ソマリア",
  ZA: "南アフリカ",
  GS: "サウスジョージア・サウスサンドウィッチ諸島",
  ES: "スペイン",
  LK: "スリランカ",
  SD: "スーダン",
  SR: "スリナム",
  SJ: "スヴァールバル諸島およびヤンマイエン島",
  SZ: "スワジランド",
  SE: "スウェーデン",
  CH: "スイス",
  SY: "シリア・アラブ共和国",
  TW: "台湾",
  TJ: "タジキスタン",
  TZ: "タンザニア",
  TH: "タイ",
  TL: "東ティモール",
  TG: "トーゴ",
  TK: "トケラウ",
  TO: "トンガ",
  TT: "トリニダード・トバゴ",
  TN: "チュニジア",
  TR: "トルコ",
  TM: "トルクメニスタン",
  TC: "タークス・カイコス諸島",
  TV: "ツバル",
  UG: "ウガンダ",
  UA: "ウクライナ",
  AE: "アラブ首長国連邦",
  GB: "イギリス",
  US: "アメリカ合衆国",
  UM: "合衆国領有小離島",
  UY: "ウルグアイ",
  UZ: "ウズベキスタン",
  VU: "バヌアツ",
  VE: "ベネズエラ・ボリバル共和国",
  VN: "ベトナム",
  VG: "イギリス領ヴァージン諸島",
  VI: "アメリカ領ヴァージン諸島",
  WF: "ウォリス・フツナ",
  EH: "西サハラ",
  YE: "イエメン",
  ZM: "ザンビア",
  ZW: "ジンバブエ",
  AX: "オーランド諸島",
  BQ: "ボネール、シント・ユースタティウスおよびサバ",
  CW: "キュラソー",
  GG: "ガーンジー",
  IM: "マン島",
  JE: "ジャージー",
  ME: "モンテネグロ",
  BL: "サン・バルテルミー",
  MF: "サン・マルタン（フランス領）",
  RS: "セルビア",
  SX: "シント・マールテン（オランダ領）",
  SS: "南スーダン",
  XK: "コソボ"
};
const ja = {
  locale: locale$G,
  countries: countries$G
};
const locale$F = "ka";
const countries$F = {
  AD: "ანდორა",
  AE: "არაბთა გაერთიანებული საამიროები",
  AF: "ავღანეთი",
  AG: "ანტიგუა და ბარბუდა",
  AI: "ანგვილა",
  AL: "ალბანეთი",
  AM: "სომხეთი",
  AO: "ანგოლა",
  AQ: "ანტარქტიკა",
  AR: "არგენტინა",
  AS: "ამერიკის სამოა",
  AT: "ავსტრია",
  AU: "ავსტრალია",
  AW: "არუბა",
  AX: "ალანდის კუნძულები",
  AZ: "აზერბაიჯანი",
  BA: "ბოსნია და ჰერცეგოვინა",
  BB: "ბარბადოსი",
  BD: "ბანგლადეში",
  BE: "ბელგია",
  BF: "ბურკინა-ფასო",
  BG: "ბულგარეთი",
  BH: "ბაჰრეინი",
  BI: "ბურუნდი",
  BJ: "ბენინი",
  BL: "სენ-ბართელმი",
  BM: "ბერმუდა",
  BN: "ბრუნეი",
  BO: "ბოლივია",
  BQ: "კარიბის ნიდერლანდები",
  BR: "ბრაზილია",
  BS: "ბაჰამის კუნძულები",
  BT: "ბუტანი",
  BV: "ბუვე",
  BW: "ბოტსვანა",
  BY: "ბელარუსი",
  BZ: "ბელიზი",
  CA: "კანადა",
  CC: "ქოქოსის (კილინგის) კუნძულები",
  CD: "კონგო - კინშასა",
  CF: "ცენტრალური აფრიკის რესპუბლიკა",
  CG: "კონგო - ბრაზავილი",
  CH: "შვეიცარია",
  CI: "კოტ-დივუარი",
  CK: "კუკის კუნძულები",
  CL: "ჩილე",
  CM: "კამერუნი",
  CN: "ჩინეთი",
  CO: "კოლუმბია",
  CR: "კოსტა-რიკა",
  CU: "კუბა",
  CV: "კაბო-ვერდე",
  CW: "კიურასაო",
  CX: "შობის კუნძული",
  CY: "კვიპროსი",
  CZ: "ჩეხეთის რესპუბლიკა",
  DE: "გერმანია",
  DJ: "ჯიბუტი",
  DK: "დანია",
  DM: "დომინიკა",
  DO: "დომინიკელთა რესპუბლიკა",
  DZ: "ალჟირი",
  EC: "ეკვადორი",
  EE: "ესტონეთი",
  EG: "ეგვიპტე",
  EH: "დასავლეთ საჰარა",
  ER: "ერიტრეა",
  ES: "ესპანეთი",
  ET: "ეთიოპია",
  FI: "ფინეთი",
  FJ: "ფიჯი",
  FK: "ფოლკლენდის კუნძულები",
  FM: "მიკრონეზია",
  FO: "ფარერის კუნძულები",
  FR: "საფრანგეთი",
  GA: "გაბონი",
  GB: "გაერთიანებული სამეფო",
  GD: "გრენადა",
  GE: "საქართველო",
  GF: "საფრანგეთის გვიანა",
  GG: "გერნსი",
  GH: "განა",
  GI: "გიბრალტარი",
  GL: "გრენლანდია",
  GM: "გამბია",
  GN: "გვინეა",
  GP: "გვადელუპა",
  GQ: "ეკვატორული გვინეა",
  GR: "საბერძნეთი",
  GS: "სამხრეთ ჯორჯია და სამხრეთ სენდვიჩის კუნძულები",
  GT: "გვატემალა",
  GU: "გუამი",
  GW: "გვინეა-ბისაუ",
  GY: "გაიანა",
  HK: "ჰონკონგი",
  HM: "ჰერდი და მაკდონალდის კუნძულები",
  HN: "ჰონდურასი",
  HR: "ხორვატია",
  HT: "ჰაიტი",
  HU: "უნგრეთი",
  ID: "ინდონეზია",
  IE: "ირლანდია",
  IL: "ისრაელი",
  IM: "მენის კუნძული",
  IN: "ინდოეთი",
  IO: "ბრიტანეთის ტერიტორია ინდოეთის ოკეანეში",
  IQ: "ერაყი",
  IR: "ირანი",
  IS: "ისლანდია",
  IT: "იტალია",
  JE: "ჯერსი",
  JM: "იამაიკა",
  JO: "იორდანია",
  JP: "იაპონია",
  KE: "კენია",
  KG: "ყირგიზეთი",
  KH: "კამბოჯა",
  KI: "კირიბატი",
  KM: "კომორის კუნძულები",
  KN: "სენტ-კიტსი და ნევისი",
  KP: "ჩრდილოეთ კორეა",
  KR: "სამხრეთ კორეა",
  KW: "ქუვეითი",
  KY: "კაიმანის კუნძულები",
  KZ: "ყაზახეთი",
  LA: "ლაოსი",
  LB: "ლიბანი",
  LC: "სენტ-ლუსია",
  LI: "ლიხტენშტაინი",
  LK: "შრი-ლანკა",
  LR: "ლიბერია",
  LS: "ლესოთო",
  LT: "ლიტვა",
  LU: "ლუქსემბურგი",
  LV: "ლატვია",
  LY: "ლიბია",
  MA: "მაროკო",
  MC: "მონაკო",
  MD: "მოლდოვა",
  ME: "მონტენეგრო",
  MF: "სენ-მარტენი",
  MG: "მადაგასკარი",
  MH: "მარშალის კუნძულები",
  MK: "ჩრდილოეთი მაკედონია",
  ML: "მალი",
  MM: "მიანმარი (ბირმა)",
  MN: "მონღოლეთი",
  MO: "მაკაო",
  MP: "ჩრდილოეთ მარიანას კუნძულები",
  MQ: "მარტინიკა",
  MR: "მავრიტანია",
  MS: "მონსერატი",
  MT: "მალტა",
  MU: "მავრიკი",
  MV: "მალდივები",
  MW: "მალავი",
  MX: "მექსიკა",
  MY: "მალაიზია",
  MZ: "მოზამბიკი",
  NA: "ნამიბია",
  NC: "ახალი კალედონია",
  NE: "ნიგერი",
  NF: "ნორფოლკის კუნძული",
  NG: "ნიგერია",
  NI: "ნიკარაგუა",
  NL: "ნიდერლანდები",
  NO: "ნორვეგია",
  NP: "ნეპალი",
  NR: "ნაურუ",
  NU: "ნიუე",
  NZ: "ახალი ზელანდია",
  OM: "ომანი",
  PA: "პანამა",
  PE: "პერუ",
  PF: "საფრანგეთის პოლინეზია",
  PG: "პაპუა-ახალი გვინეა",
  PH: "ფილიპინები",
  PK: "პაკისტანი",
  PL: "პოლონეთი",
  PM: "სენ-პიერი და მიკელონი",
  PN: "პიტკერნის კუნძულები",
  PR: "პუერტო-რიკო",
  PS: "პალესტინის ტერიტორიები",
  PT: "პორტუგალია",
  PW: "პალაუ",
  PY: "პარაგვაი",
  QA: "კატარი",
  RE: "რეუნიონი",
  RO: "რუმინეთი",
  RS: "სერბეთი",
  RU: "რუსეთი",
  RW: "რუანდა",
  SA: "საუდის არაბეთი",
  SB: "სოლომონის კუნძულები",
  SC: "სეიშელის კუნძულები",
  SD: "სუდანი",
  SE: "შვედეთი",
  SG: "სინგაპური",
  SH: "წმინდა ელენეს კუნძული",
  SI: "სლოვენია",
  SJ: "შპიცბერგენი და იან-მაიენი",
  SK: "სლოვაკეთი",
  SL: "სიერა-ლეონე",
  SM: "სან-მარინო",
  SN: "სენეგალი",
  SO: "სომალი",
  SR: "სურინამი",
  SS: "სამხრეთ სუდანი",
  ST: "სან-ტომე და პრინსიპი",
  SV: "სალვადორი",
  SX: "სინტ-მარტენი",
  SY: "სირია",
  SZ: "სვაზილენდი",
  TC: "თერქს-ქაიქოსის კუნძულები",
  TD: "ჩადი",
  TF: "ფრანგული სამხრეთის ტერიტორიები",
  TG: "ტოგო",
  TH: "ტაილანდი",
  TJ: "ტაჯიკეთი",
  TK: "ტოკელაუ",
  TL: "ტიმორ-ლესტე",
  TM: "თურქმენეთი",
  TN: "ტუნისი",
  TO: "ტონგა",
  TR: "თურქეთი",
  TT: "ტრინიდადი და ტობაგო",
  TV: "ტუვალუ",
  TW: "ტაივანი",
  TZ: "ტანზანია",
  UA: "უკრაინა",
  UG: "უგანდა",
  UM: "აშშ-ის შორეული კუნძულები",
  US: "ამერიკის შეერთებული შტატები",
  UY: "ურუგვაი",
  UZ: "უზბეკეთი",
  VA: "ქალაქი ვატიკანი",
  VC: "სენტ-ვინსენტი და გრენადინები",
  VE: "ვენესუელა",
  VG: "ბრიტანეთის ვირჯინის კუნძულები",
  VI: "აშშ-ის ვირჯინის კუნძულები",
  VN: "ვიეტნამი",
  VU: "ვანუატუ",
  WF: "უოლისი და ფუტუნა",
  WS: "სამოა",
  XK: "კოსოვო",
  YE: "იემენი",
  YT: "მაიოტა",
  ZA: "სამხრეთ აფრიკის რესპუბლიკა",
  ZM: "ზამბია",
  ZW: "ზიმბაბვე"
};
const ka = {
  locale: locale$F,
  countries: countries$F
};
const locale$E = "kk";
const countries$E = {
  AD: "Андорра",
  AE: "Біріккен Араб Әмірліктері",
  AF: "Ауғанстан",
  AG: "Антигуа және Барбуда",
  AI: "Ангилья",
  AL: "Албания",
  AM: "Армения",
  AO: "Ангола",
  AQ: "Антарктида",
  AR: "Аргентина",
  AS: "Америкалық Самоа",
  AT: "Австрия",
  AU: "Австралия",
  AW: "Аруба",
  AX: "Аланд аралдары",
  AZ: "Әзірбайжан",
  BA: "Босния және Герцеговина",
  BB: "Барбадос",
  BD: "Бангладеш",
  BE: "Бельгия",
  BF: "Буркина-Фасо",
  BG: "Болгария",
  BH: "Бахрейн",
  BI: "Бурунди",
  BJ: "Бенин",
  BL: "Сен-Бартелеми",
  BM: "Бермуд аралдары",
  BN: "Бруней",
  BO: "Боливия",
  BQ: "Кариб Нидерландысы",
  BR: "Бразилия",
  BS: "Багам аралдары",
  BT: "Бутан",
  BV: "Буве аралы",
  BW: "Ботсвана",
  BY: "Беларусь",
  BZ: "Белиз",
  CA: "Канада",
  CC: "Кокос (Килинг) аралдары",
  CD: "Конго",
  CF: "Орталық Африка Республикасы",
  CG: "Конго Республикасы",
  CH: "Швейцария",
  CI: "Кот-д’Ивуар",
  CK: "Кук аралдары",
  CL: "Чили",
  CM: "Камерун",
  CN: "Қытай",
  CO: "Колумбия",
  CR: "Коста-Рика",
  CU: "Куба",
  CV: "Кабо-Верде",
  CW: "Кюрасао",
  CX: "Рождество аралы",
  CY: "Кипр",
  CZ: "Чех Республикасы",
  DE: "Германия",
  DJ: "Джибути",
  DK: "Дания",
  DM: "Доминика",
  DO: "Доминикан Республикасы",
  DZ: "Алжир",
  EC: "Эквадор",
  EE: "Эстония",
  EG: "Мысыр",
  EH: "Батыс Сахара",
  ER: "Эритрея",
  ES: "Испания",
  ET: "Эфиопия",
  FI: "Финляндия",
  FJ: "Фиджи",
  FK: "Фолкленд аралдары",
  FM: "Микронезия",
  FO: "Фарер аралдары",
  FR: "Франция",
  GA: "Габон",
  GB: "Ұлыбритания",
  GD: "Гренада",
  GE: "Грузия",
  GF: "Француз Гвианасы",
  GG: "Гернси",
  GH: "Гана",
  GI: "Гибралтар",
  GL: "Гренландия",
  GM: "Гамбия",
  GN: "Гвинея",
  GP: "Гваделупа",
  GQ: "Экваторлық Гвинея",
  GR: "Грекия",
  GS: "Оңтүстік Георгия және Оңтүстік Сандвич аралдары",
  GT: "Гватемала",
  GU: "Гуам",
  GW: "Гвинея-Бисау",
  GY: "Гайана",
  HK: "Гонконг",
  HM: "Херд аралы және Макдональд аралдары",
  HN: "Гондурас",
  HR: "Хорватия",
  HT: "Гаити",
  HU: "Венгрия",
  ID: "Индонезия",
  IE: "Ирландия",
  IL: "Израиль",
  IM: "Мэн аралы",
  IN: "Үндістан",
  IO: "Үнді мұхитындағы Британ аймағы",
  IQ: "Ирак",
  IR: "Иран",
  IS: "Исландия",
  IT: "Италия",
  JE: "Джерси",
  JM: "Ямайка",
  JO: "Иордания",
  JP: "Жапония",
  KE: "Кения",
  KG: "Қырғызстан",
  KH: "Камбоджа",
  KI: "Кирибати",
  KM: "Комор аралдары",
  KN: "Сент-Китс және Невис",
  KP: "Солтүстік Корея",
  KR: "Оңтүстік Корея",
  KW: "Кувейт",
  KY: "Кайман аралдары",
  KZ: "Қазақстан",
  LA: "Лаос",
  LB: "Ливан",
  LC: "Сент-Люсия",
  LI: "Лихтенштейн",
  LK: "Шри-Ланка",
  LR: "Либерия",
  LS: "Лесото",
  LT: "Литва",
  LU: "Люксембург",
  LV: "Латвия",
  LY: "Ливия",
  MA: "Марокко",
  MC: "Монако",
  MD: "Молдова",
  ME: "Черногория",
  MF: "Сен-Мартен",
  MG: "Мадагаскар",
  MH: "Маршалл аралдары",
  MK: "Солтүстік Македония Республикасы",
  ML: "Мали",
  MM: "Мьянма (Бирма)",
  MN: "Моңғолия",
  MO: "Макао",
  MP: "Солтүстік Мариана аралдары",
  MQ: "Мартиника",
  MR: "Мавритания",
  MS: "Монтсеррат",
  MT: "Мальта",
  MU: "Маврикий",
  MV: "Мальдив аралдары",
  MW: "Малави",
  MX: "Мексика",
  MY: "Малайзия",
  MZ: "Мозамбик",
  NA: "Намибия",
  NC: "Жаңа Каледония",
  NE: "Нигер",
  NF: "Норфолк аралы",
  NG: "Нигерия",
  NI: "Никарагуа",
  NL: "Нидерланд",
  NO: "Норвегия",
  NP: "Непал",
  NR: "Науру",
  NU: "Ниуэ",
  NZ: "Жаңа Зеландия",
  OM: "Оман",
  PA: "Панама",
  PE: "Перу",
  PF: "Француз Полинезиясы",
  PG: "Папуа — Жаңа Гвинея",
  PH: "Филиппин",
  PK: "Пәкістан",
  PL: "Польша",
  PM: "Сен-Пьер және Микелон",
  PN: "Питкэрн аралдары",
  PR: "Пуэрто-Рико",
  PS: "Палестина аймақтары",
  PT: "Португалия",
  PW: "Палау",
  PY: "Парагвай",
  QA: "Катар",
  RE: "Реюньон",
  RO: "Румыния",
  RS: "Сербия",
  RU: "Ресей",
  RW: "Руанда",
  SA: "Сауд Арабиясы",
  SB: "Соломон аралдары",
  SC: "Сейшель аралдары",
  SD: "Судан",
  SE: "Швеция",
  SG: "Сингапур",
  SH: "Әулие Елена аралы",
  SI: "Словения",
  SJ: "Шпицберген және Ян-Майен",
  SK: "Словакия",
  SL: "Сьерра-Леоне",
  SM: "Сан-Марино",
  SN: "Сенегал",
  SO: "Сомали",
  SR: "Суринам",
  SS: "Оңтүстік Судан",
  ST: "Сан-Томе және Принсипи",
  SV: "Сальвадор",
  SX: "Синт-Мартен",
  SY: "Сирия",
  SZ: "Свазиленд",
  TC: "Теркс және Кайкос аралдары",
  TD: "Чад",
  TF: "Францияның оңтүстік аймақтары",
  TG: "Того",
  TH: "Тайланд",
  TJ: "Тәжікстан",
  TK: "Токелау",
  TL: "Тимор-Лесте",
  TM: "Түрікменстан",
  TN: "Тунис",
  TO: "Тонга",
  TR: "Түркия",
  TT: "Тринидад және Тобаго",
  TV: "Тувалу",
  TW: "Тайвань",
  TZ: "Танзания",
  UA: "Украина",
  UG: "Уганда",
  UM: "АҚШ-тың сыртқы кіші аралдары",
  US: "Америка Құрама Штаттары",
  UY: "Уругвай",
  UZ: "Өзбекстан",
  VA: "Ватикан",
  VC: "Сент-Винсент және Гренадин аралдары",
  VE: "Венесуэла",
  VG: "Британдық Виргин аралдары",
  VI: "АҚШ-тың Виргин аралдары",
  VN: "Вьетнам",
  VU: "Вануату",
  WF: "Уоллис және Футуна",
  WS: "Самоа",
  XK: "Косово",
  YE: "Йемен",
  YT: "Майотта",
  ZA: "Оңтүстік Африка Республикасы",
  ZM: "Замбия",
  ZW: "Зимбабве"
};
const kk = {
  locale: locale$E,
  countries: countries$E
};
const locale$D = "km";
const countries$D = {
  AF: "អាហ្វហ្គានីស្ថាន",
  AL: "អាល់បានី",
  DZ: "អាល់ហ្សេរី",
  AS: "សាម័រអាមេរិក",
  AD: "អង់ដូរ៉ា",
  AO: "អង់ហ្គោឡា",
  AI: "អង់ហ្គីឡា",
  AQ: "អង់តាក់ទិក",
  AG: "អង់ទីហ្គានិងបាប៊ូដា",
  AR: "អាហ្សង់ទីន",
  AM: "អាមេនី",
  AW: "អារូបា",
  AU: "អូស្ត្រាលី",
  AT: "អូទ្រីស",
  AZ: "អាស៊ែបៃហ្សង់",
  BS: "បាហាម៉ា",
  BH: "បារ៉ែន",
  BD: "បង់ក្លាដែស",
  BB: "បាបាដុស",
  BY: "បេឡារុស",
  BE: "បែលហ្ស៊ីក",
  BZ: "បេលី",
  BJ: "បេណាំង",
  BM: "ប៊ែម៉ូដ",
  BT: "ប៊ូតង់",
  BO: "បូលីវី",
  BA: "បូស្នុីនិងហឺហ្សេហ្គូវីណា",
  BW: "បុតស្វាណា",
  BV: "កោះប៊ូវ៉េ",
  BR: "ប្រេស៊ីល",
  IO: "ដែនសមុទ្រ​ឥណ្ឌាអង់គ្លេស",
  BN: "ព្រុយណេ",
  BG: "ប៊ុលហ្គារី",
  BF: "បួគីណាហ្វាសូ​​",
  BI: "ប៊ូរុនឌី",
  KH: "កម្ពុជា",
  CM: "កាមេរូន",
  CA: "កាណាដា",
  CV: "កាប់វែរ",
  KY: "ប្រជុំកោះកេមេន",
  CF: "សាធារណរដ្ឋអាហ្វ្រីកកណ្ដាល​",
  TD: "ឆាដ",
  CL: "ស៊ីលី",
  CN: "ចិន",
  CX: "កោះគ្រីស្តម៉ាស់",
  CC: "ប្រជុំកោះកូកូ",
  CO: "កូឡុំប៊ី",
  KM: "កូម័រ",
  CG: "កុងហ្គោ",
  CD: "សាធារណរដ្ឋប្រជាធិបតេយ្យកុងហ្គោ",
  CK: "ប្រជុំកោះឃុក",
  CR: "កូស្តារីកា",
  CI: "កូតឌីវ៍រ",
  HR: "ក្រូអាស៊ី",
  CU: "គុយបា",
  CY: "ស៊ីប",
  CZ: "សាធារណរដ្ឋឆែក",
  DK: "ដាណឹម៉ាក",
  DJ: "ជីប៊ូទី",
  DM: "ដូមីនីក",
  DO: "សាធារណរដ្ឋដូមីនីក",
  EC: "អេក្វាទ័រ",
  EG: "អេហ្ស៊ីប",
  SV: "អែលសាល់វ៉ាឌ័រ",
  GQ: "ហ្គីណេអេក្វាទ័រ",
  ER: "អេរីត្រេ",
  EE: "អេស្តូនី",
  ET: "អេត្យូពី",
  FK: "ប្រជុំកោះម៉ាលូអុីន",
  FO: "ប្រជុំកោះហ្វារ៉ូ",
  FJ: "ហ្វុីជី",
  FI: "ហ្វាំងឡង់",
  FR: "បារាំង",
  GF: "ហ្គាយ៉ានបារាំង",
  PF: "ប៉ូលីណេស៊ីបារាំង",
  TF: "ប្រជុំដែនដីភាគខាងត្បូងបារាំង",
  GA: "ហ្គាបុង",
  GM: "ហ្គំប៊ី",
  GE: "ហ្សកហ្ស៊ី",
  DE: "អាល្លឺម៉ង់",
  GH: "ហ្គាណា",
  GI: "ហ្ស៊ីប្រាល់តា",
  GR: "ក្រិក",
  GL: "ហ្គ្រោអង់ឡង់",
  GD: "ហ្គ្រើណាដ",
  GP: "ហ្គួដាលូប",
  GU: "ហ្គាំ",
  GT: "ក្វាតេម៉ាឡា",
  GN: "ហ្គីណេ",
  GW: "ហ្គីណេប៊ីស្សូ",
  GY: "ហ្គីយ៉ាន",
  HT: "ហៃទី",
  HM: "ប្រជុំកោះហើរ៍ដនិងម៉ាកដូណាល់",
  VA: "បុរីវ៉ាទីកង់",
  HN: "ហុងឌូរ៉ាស",
  HK: "ហុងកុង",
  HU: "ហុងគ្រី",
  IS: "អុីស្លង់",
  IN: "ឥណ្ឌា",
  ID: "ឥណ្ឌូណេស៊ី",
  IR: "អុីរ៉ង់",
  IQ: "អុីរ៉ាក់",
  IE: "អៀរឡង់",
  IL: "អុីស្រាអែល",
  IT: "អុីតាលី",
  JM: "ហ្សាម៉ាអុីក",
  JP: "ជប៉ុន",
  JO: "ហ៊្សកដានី",
  KZ: "កាហ្សាក់ស្ថាន",
  KE: "កេនយ៉ា",
  KI: "គីរីបាទី",
  KP: [
    "កូរ៉េខាងជើង",
    "សាធារណរដ្ឋប្រជាធិបតេយ្យប្រជាមានិតកូរ៉េ"
  ],
  KR: [
    "កូរ៉េខាងត្បូង",
    "សាធារណរដ្ឋកូរ៉េ"
  ],
  KW: "កូវ៉ែត",
  KG: "កៀហ្ស៊ីស៊ីស្ថាន",
  LA: "សាធារណរដ្ឋប្រជាធិបតេយ្យប្រជាមានិតឡាវ",
  LV: "ឡេតូនី",
  LB: "លីបង់",
  LS: "ឡេសូតូ",
  LR: "លីបេរីយ៉ា",
  LY: "លីប៊ី",
  LI: "លិចតិនស្តាញ",
  LT: "លីទុយអានី",
  LU: "លុចសំបួ",
  MO: "ម៉ាកាវ",
  MG: "ម៉ាដាហ្គាស្កា",
  MW: "ម៉ាឡាវី",
  MY: "ម៉ាឡេស៊ី",
  MV: "ម៉ាល់ឌីវ",
  ML: "ម៉ាលី",
  MT: "ម៉ាល់ត៍",
  MH: "ប្រជុំកោះម៉ាស្សាល់",
  MQ: "ម៉ាទីនីក",
  MR: "ម៉ូរីតានី",
  MU: "ម៉ូរីស",
  YT: "ម៉ាយ៉ូត",
  MX: "មុិកស៊ិក",
  FM: "រដ្ឋសហព័ន្ធមីក្រូណេស៊ី",
  MD: "សាធារណរដ្ឋម៉ុលដាវី",
  MC: "ម៉ូណាកូ",
  MN: "ម៉ុងហ្គោលី",
  MS: "ម៉ុងស៊ែរ៉ា",
  MA: "ម៉ារ៉ុក",
  MZ: "ម៉ូសំប៊ិក",
  MM: [
    "ភូមា",
    "មីយ៉ានម៉ា"
  ],
  NA: "ណាមីប៊ី",
  NR: "ណូរូ",
  NP: "នេប៉ាល់",
  NL: "ហូឡង់",
  NC: "នូវែលកាឡេដូនី",
  NZ: "នូវែលសេឡង់",
  NI: "នីការ៉ាហ្គា",
  NE: "នីហ្សេ",
  NG: "នីហ្សេរីយ៉ា",
  NU: "នីអេ",
  NF: "កោះន័រហ្វុក",
  MK: "សាធារណរដ្ឋម៉ាសេដ្វានខាងជើង",
  MP: "ប្រជុំកោះម៉ារីយ៉ានខាងជើង",
  NO: "ន័រវែស",
  OM: "អូម៉ង់",
  PK: "បាគីស្ថាន",
  PW: "ប៉ាឡៅ",
  PS: "ដែនដីប៉ាឡេស្ទីន",
  PA: "ប៉ាណាម៉ា",
  PG: "ប៉ាពូអាស៊ីនូវែលហ្គីណេ",
  PY: "ប៉ារ៉ាហ្គាយ",
  PE: "ប៉េរូ",
  PH: "ហ្វីលីពីន",
  PN: "ពីតកែរ៍ន",
  PL: "ប៉ូឡូញ",
  PT: "ព័រទុយហ្គាល់",
  PR: "ព័រតូរីកូ",
  QA: "កាតា",
  RE: "រ៉េញ៊ូញ៊ុង",
  RO: "រូម៉ានី",
  RU: [
    "សហព័ន្ធរុស្ស៊ី",
    "រុស្ស៊ី"
  ],
  RW: "រវ៉ាន់ដា",
  SH: "សាំងតេលែន",
  KN: "សាំងគ្រីស្តុបនិងនីវែស",
  LC: "សាំងលូស៊ី",
  PM: "សាំងព្រែរ៍និងមីហ្គែឡុង",
  VC: "សាំងវ៉ាងស្សង់និងហ្គឺណាឌីន",
  WS: "សាម័រ",
  SM: "សាំងម៉ារ៊ាំង",
  ST: "សៅតូម៉េនិងប្រាំងស៊ីប",
  SA: "អារ៉ាប៊ីសាអូឌីត",
  SN: "សេណេហ្គាល់",
  SC: "សីស្ហែល",
  SL: "សៀរ៉ាឡេអូន",
  SG: "សិង្ហបុរី",
  SK: [
    "សាធារណរដ្ឋស្លូវ៉ាគី",
    "ស្លូវ៉ាគី"
  ],
  SI: "ស្លូវេនី",
  SB: "ប្រជុំកោះសាឡូម៉ុង",
  SO: "សូម៉ាលី",
  ZA: "អាហ្វ្រិកខាងត្បូង",
  GS: "ហ្សកហ្ស៊ីនិងប្រជុំកោះសាំងវុីចខាងត្បូង",
  ES: "អេស្ប៉ាញ",
  LK: "ស្រីលង្កា",
  SD: "ស៊ូដង់",
  SR: "សូរីណាម",
  SJ: "ស្វាល់ប៉ានិងកោះហ្សង់ម៉ាយ៉េន",
  SZ: "អ៊ែស្វាទីនី",
  SE: "ស៊ុយអែត",
  CH: "ស្វ៊ីស",
  SY: "សាធារណរដ្ឋស៊ីរី",
  TW: "តៃវ៉ាន់",
  TJ: "តាហ្ស៊ីគីស្ថាន",
  TZ: "តង់សានី",
  TH: "ថៃ",
  TL: "ទីម័រខាងកើត",
  TG: "តូហ្គោ",
  TK: "តូកេឡូ",
  TO: "តុងហ្គា",
  TT: "ទ្រីនីដាដនិងតូបាហ្គោ",
  TN: "ទុយនីស៊ី",
  TR: "តួកគី",
  TM: "តួកម៉េនីស្ថាន",
  TC: "ប្រជុំកោះទួកនិងកៃកេ",
  TV: "ទូវ៉ាលូ",
  UG: "អ៊ូហ្គង់ដា",
  UA: "អ៊ុយក្រែន",
  AE: "អេមីរ៉ាតអារ៉ាប់រួម",
  GB: "ចក្រភពអង់គ្លេស",
  US: "សហរដ្ឋអាមេរិក",
  UM: "ប្រជុំកោះមីន័រអេឡួញ៉េអាមេរិក",
  UY: "អ៊ុយរូហ្គាយ",
  UZ: "អ៊ូសបេគីស្ថាន",
  VU: "វ៉ានូទូ",
  VE: "វ៉េណេស៊ុយអេឡា",
  VN: "វៀតណាម",
  VG: "ប្រជុំកោះវីអ៊ែអង់គ្លេស",
  VI: "ប្រជុំកោះវីអ៊ែអាមេរិក",
  WF: "វ៉ាលីសនិងហ្វូតូណា",
  EH: "សាហារ៉ាខាងលិច",
  YE: "យេម៉ែន",
  ZM: "សំប៊ី",
  ZW: "ស៊ីមបាវ៉េ",
  AX: "ប្រជុំកោះអូឡង់",
  BQ: "បូនែរ៍ សាំងអឺស្ទាហ្សឺស និងសាបា",
  CW: "គុរ៉ាសៅ",
  GG: "ហ្គេនស៊ី",
  IM: "កោះម៉ាន",
  JE: "ហ្សែរ៍ស្ស៊ី",
  ME: "ម៉ុងតេណេហ្គ្រោ",
  BL: "សាំងប៉ាតេឡាមុី",
  MF: "សាំងម៉ាតាំង (បារាំង)",
  RS: "ស៊ែប៊ី",
  SX: "សាំងម៉ាតាំង (ហូឡង់)",
  SS: "ស៊ូដង់ខាងត្បូង",
  XK: "កូសូវ៉ូ"
};
const km = {
  locale: locale$D,
  countries: countries$D
};
const locale$C = "ko";
const countries$C = {
  AF: "아프가니스탄",
  AL: "알바니아",
  DZ: "알제리",
  AS: "아메리칸 사모아",
  AD: "안도라",
  AO: "앙골라",
  AI: "앙길라",
  AQ: "안타티카",
  AG: "안티구아 바부다",
  AR: "아르헨티나",
  AM: "아르메니아",
  AW: "아루바",
  AU: "호주",
  AT: "오스트리아",
  AZ: "아제르바이잔",
  BS: "바하마",
  BH: "바레인",
  BD: "방글라데시",
  BB: "바베이도스",
  BY: "벨라루스",
  BE: "벨기에",
  BZ: "벨리즈",
  BJ: "베냉",
  BM: "버뮤다",
  BT: "부탄",
  BO: "볼리비아",
  BA: "보스니아 헤르체고비나",
  BW: "보츠와나",
  BV: "부베섬",
  BR: "브라질",
  IO: "영인도 제도",
  BN: "브루나이",
  BG: "불가리아",
  BF: "부르키나파소",
  BI: "부룬디",
  KH: "캄보디아",
  CM: "카메룬",
  CA: "캐나다",
  CV: "카보 베르데",
  KY: "케이맨섬",
  CF: "중앙 아프리카",
  TD: "차드",
  CL: "칠레",
  CN: "중국",
  CX: "크리스마스섬",
  CC: "코코스 제도",
  CO: "콜롬비아",
  KM: "코모로",
  CG: "콩고",
  CD: "콩고 민주 공화국",
  CK: "쿡 제도",
  CR: "코스타리카",
  CI: "코트디부아르",
  HR: "크로아티아",
  CU: "쿠바",
  CY: "사이프러스",
  CZ: "체코공화국",
  DK: "덴마크",
  DJ: "지부티",
  DM: "도미니카 연방",
  DO: "도미니카 공화국",
  EC: "에콰도르",
  EG: "이집트",
  SV: "엘살바도르",
  GQ: "적도 기니",
  ER: "에리트레아",
  EE: "에스토니아",
  ET: "이디오피아",
  FK: "포클랜드섬",
  FO: "페로 군도",
  FJ: "피지",
  FI: "핀란드",
  FR: "프랑스",
  GF: "프랑스령 기아나",
  PF: "프랑스령 폴리네시아",
  TF: "프랑스 남부영토",
  GA: "가봉",
  GM: "감비아",
  GE: "그루지아",
  DE: "독일",
  GH: "가나",
  GI: "지브랄타",
  GR: "그리스",
  GL: "그린랜드",
  GD: "그레나다",
  GP: "과들루프",
  GU: "괌",
  GT: "과테말라",
  GN: "기니",
  GW: "기네비쏘",
  GY: "가이아나",
  HT: "아이티",
  HM: "허드 맥도날드 군도",
  VA: "바티칸",
  HN: "온두라스",
  HK: "홍콩",
  HU: "헝가리",
  IS: "아이슬란드",
  IN: "인도",
  ID: "인도네시아",
  IR: "이란",
  IQ: "이라크",
  IE: "아일랜드",
  IL: "이스라엘",
  IT: "이탈리아",
  JM: "자메이카",
  JP: "일본",
  JO: "요르단",
  KZ: "카자흐스탄",
  KE: "케냐",
  KI: "키르바시",
  KP: "북한",
  KR: "대한민국",
  KW: "쿠웨이트",
  KG: "키르키즈스탄",
  LA: "라오스",
  LV: "라트비아",
  LB: "레바논",
  LS: "레소토",
  LR: "라이베리아",
  LY: "리비아",
  LI: "리히텐슈타인",
  LT: "리투아니아",
  LU: "룩셈부르크",
  MO: "마카오",
  MG: "마다가스카르",
  MW: "말라위",
  MY: "말레이시아",
  MV: "몰디브",
  ML: "말리",
  MT: "몰타",
  MH: "마샬군도",
  MQ: "마르티니크",
  MR: "모리타니",
  MU: "모리셔스",
  YT: "마요트",
  MX: "멕시코",
  FM: "미크로네시아",
  MD: "몰도바",
  MC: "모나코",
  MN: "몽골",
  MS: "몬트세라트",
  MA: "모로코",
  MZ: "모잠비크",
  MM: "미얀마",
  NA: "나미비아",
  NR: "나우루",
  NP: "네팔",
  NL: "네덜란드",
  NC: "뉴칼레도니아",
  NZ: "뉴질랜드",
  NI: "니카라과",
  NE: "니제르",
  NG: "나이지리아",
  NU: "니우에",
  NF: "노퍽섬",
  MK: "마케도니아",
  MP: "북마리아나 군도",
  NO: "노르웨이",
  OM: "오만",
  PK: "파키스탄",
  PW: "팔라우",
  PS: "팔레스타인",
  PA: "파나마",
  PG: "파푸아 뉴기니",
  PY: "파라과이",
  PE: "페루",
  PH: "필리핀",
  PN: "핏케언 군도",
  PL: "폴랜드",
  PT: "포르투칼",
  PR: "푸에르토리코",
  QA: "카타르",
  RE: "리유니온",
  RO: "루마니아",
  RU: "러시아연방",
  RW: "르완다",
  SH: "세인트 헬레나",
  KN: "세인트 키츠 네비스",
  LC: "세인트 루시아",
  PM: "세인트리에르도,미괘론도",
  VC: "세인트 빈센트 그레나딘",
  WS: "사모아",
  SM: "산 마리노",
  ST: "상토메프린시페",
  SA: "사우디아라비아",
  SN: "세네갈",
  SC: "세이셸",
  SL: "시에라 리온",
  SG: "싱가포르",
  SK: "슬로바키아",
  SI: "슬로베니아",
  SB: "솔로몬 아일랜드",
  SO: "소말리아",
  ZA: "남아프리카",
  GS: "남조지아 군도",
  ES: "스페인",
  LK: "스리랑카",
  SD: "수단",
  SR: "수리남",
  SJ: "스발바드, 잠마엔도",
  SZ: "스와질란드",
  SE: "스웨덴",
  CH: "스위스",
  SY: "시리아",
  TW: "중화민국",
  TJ: "타지키스탄",
  TZ: "탄자니아",
  TH: "태국",
  TL: "동티모르",
  TG: "토고",
  TK: "토켈로",
  TO: "통가",
  TT: "트리니다드 토바고",
  TN: "튀니지아",
  TR: "터키",
  TM: "트르크메니스탄",
  TC: "터크스",
  TV: "트발루",
  UG: "우간다",
  UA: "우크라이나",
  AE: "아랍에미리트연합",
  GB: "영국",
  US: "미국",
  UM: "미국령 소군도",
  UY: "우루과이",
  UZ: "우즈베키스탄",
  VU: "바누아투",
  VE: "베네수엘라",
  VN: "베트남",
  VG: "영국령 버진아일랜드",
  VI: "미국령 버진아일랜드",
  WF: "월리스 후트나",
  EH: "서사하라",
  YE: "예멘",
  ZM: "잠비아",
  ZW: "짐바브웨 공화국",
  AX: "올란드 제도",
  BQ: "보네르,신트유스타티우스,사바",
  CW: "큐라소",
  GG: "건지",
  IM: "맨섬",
  JE: "저지",
  ME: "몬테네그로",
  BL: "생 바르 텔레 미",
  MF: "세인트 마틴 (프랑스어 부분)",
  RS: "세르비아",
  SX: "신트마르텐",
  SS: "남수단",
  XK: "코소보"
};
const ko = {
  locale: locale$C,
  countries: countries$C
};
const locale$B = "ku";
const countries$B = {
  AF: "Efxanistan",
  AL: "Albanya",
  DZ: "Cezayir",
  AS: "Samoaya Amerîkanî",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguîla",
  AQ: "Antarktîka",
  AG: "Antîgua û Berbûda",
  AR: "Arjentîn",
  AM: "Ermenistan",
  AW: "Arûba",
  AU: "Awistralya",
  AT: "Awistirya",
  AZ: "Azerbaycan",
  BS: "Bahama",
  BH: "Behreyn",
  BD: "Bangladeş",
  BB: "Barbados",
  BY: "Belarûs",
  BE: "Belçîka",
  BZ: "Belîze",
  BJ: "Bênîn",
  BM: "Bermûda",
  BT: "Bûtan",
  BO: "Bolîvya",
  BA: "Bosniya û Herzegovîna",
  BW: "Botswana",
  BV: "Girava Bouvet",
  BR: "Brazîl",
  IO: "Erdê Okyanûsa Hindî ya Brîtanî",
  BN: "Brûney",
  BG: "Bulgaristan",
  BF: "Burkîna Faso",
  BI: "Burundî",
  KH: "Kamboca",
  CM: "Kamerûn",
  CA: "Kanada",
  CV: "Kap Verde",
  KY: "Giravên Kaymanê",
  CF: "Komara Afrîkaya Navend",
  TD: "Çad",
  CL: "Şîle",
  CN: "Çîn",
  CX: "Girava Sersalê",
  CC: "Giravên Cocos (Keeling)",
  CO: "Kolombiya",
  KM: "Komor",
  CG: "Kongo - Brazzaville",
  CD: "Kongo - Kînşasa",
  CK: "Giravên Cook",
  CR: "Kosta Rîka",
  CI: "Peravê Diranfîl",
  HR: "Kroatya",
  CU: "Kûba",
  CY: "Kîpros",
  CZ: "Çekya",
  DK: "Danîmarka",
  DJ: "Cîbûtî",
  DM: "Domînîka",
  DO: "Komara Domînîk",
  EC: "Ekuador",
  EG: "Misir",
  SV: "El Salvador",
  GQ: "Gîneya Rojbendî",
  ER: "Erîtrea",
  EE: "Estonya",
  ET: "Etiyopya",
  FK: "Giravên Malvîn",
  FO: "Giravên Feroe",
  FJ: "Fîjî",
  FI: "Fînlenda",
  FR: "Fransa",
  GF: "Guyanaya Fransî",
  PF: "Polînezyaya Fransî",
  TF: "Erdên Başûr ên Fransî",
  GA: "Gabon",
  GM: "Gambiya",
  GE: "Gurcistan",
  DE: "Almanya",
  GH: "Gana",
  GI: "Cîbraltar",
  GR: "Yewnanistan",
  GL: "Grînlenda",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Gîne",
  GW: "Gîne-Bissau",
  GY: "Guyana",
  HT: "Haîtî",
  HM: "Girava Heard û Giravên McDonald",
  VA: "Vatîkan",
  HN: "Hondûras",
  HK: "Hong Kong",
  HU: "Macaristan",
  IS: "Îslenda",
  IN: "Hindistan",
  ID: "Îndonezya",
  IR: "Îran",
  IQ: "Iraq",
  IE: "Îrlenda",
  IL: "Îsraêl",
  IT: "Îtalya",
  JM: "Jamaîka",
  JP: "Japon",
  JO: "Urdun",
  KZ: "Qazaxistan",
  KE: "Kenya",
  KI: "Kirîbatî",
  KP: "Korêya Bakur",
  KR: "Korêya Başûr",
  KW: "Kuweyt",
  KG: "Qirgizistan",
  LA: "Laos",
  LV: "Letonya",
  LB: "Libnan",
  LS: "Lesoto",
  LR: "Lîberya",
  LY: "Lîbya",
  LI: "Liechtenstein",
  LT: "Lîtvanya",
  LU: "Lûksembûrg",
  MO: "Macao",
  MG: "Madagaskar",
  MW: "Malawî",
  MY: "Malezya",
  MV: "Maldîv",
  ML: "Malî",
  MT: "Malta",
  MH: "Giravên Marşal",
  MQ: "Martinique",
  MR: "Morîtanya",
  MU: "Maurîtius",
  YT: "Mayotte",
  MX: "Meksîk",
  FM: "Mîkronezya",
  MD: "Moldova",
  MC: "Monako",
  MN: "Mongolya",
  MS: "Montserat",
  MA: "Maroko",
  MZ: "Mozambîk",
  MM: "Myanmar (Birmanya)",
  NA: "Namîbya",
  NR: "Naûrû",
  NP: "Nepal",
  NL: "Holenda",
  NC: "Kaledonyaya Nû",
  NZ: "Nû Zelenda",
  NI: "Nîkaragua",
  NE: "Nîjer",
  NG: "Nîjerya",
  NU: "Niûe",
  NF: "Girava Norfolk",
  MK: "Makedonya",
  MP: "Giravên Bakurê Marianan",
  NO: "Norwêc",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Xakên filistînî",
  PA: "Panama",
  PG: "Papua Gîneya Nû",
  PY: "Paraguay",
  PE: "Perû",
  PH: "Filîpîn",
  PN: "Giravên Pitcairn",
  PL: "Polonya",
  PT: "Portûgal",
  PR: "Porto Rîko",
  QA: "Qeter",
  RE: "Réunion",
  RO: "Romanya",
  RU: "Rûsya",
  RW: "Rwanda",
  SH: "Ezîze Helena",
  KN: "Saint Kitts û Nevîs",
  LC: "Saint Lucia",
  PM: "Saint-Pierre û Miquelon",
  VC: "Saint Vincent û Giravên Grenadîn",
  WS: "Samoa",
  SM: "San Marîno",
  ST: "Sao Tome û Prînsîpe",
  SA: "Erebistana Siyûdî",
  SN: "Senegal",
  SC: "Seyşel",
  SL: "Sierra Leone",
  SG: "Singapûr",
  SK: "Slovakya",
  SI: "Slovenya",
  SB: "Giravên Salomon",
  SO: "Somalya",
  ZA: "Afrîkaya Başûr",
  GS: "South Georgia û Giravên Sandwich-a Başûr",
  ES: "Spanya",
  LK: "Srî Lanka",
  SD: "Sûdan",
  SR: "Sûrînam",
  SJ: "Svalbard û Jan Mayen",
  SZ: "Swazîlenda",
  SE: "Swêd",
  CH: "Swîsre",
  SY: "Sûrî",
  TW: "Taywan",
  TJ: "Tacîkistan",
  TZ: "Tanzanya",
  TH: "Taylenda",
  TL: "Tîmora-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trînîdad û Tobago",
  TN: "Tûnis",
  TR: "Tirkiye",
  TM: "Tirkmenistan",
  TC: "Giravên Turk û Kaîkos",
  TV: "Tûvalû",
  UG: "Ûganda",
  UA: "Ûkrayna",
  AE: "Emîrtiyên Erebî yên Yekbûyî",
  GB: "Keyaniya Yekbûyî",
  US: "Dewletên Yekbûyî yên Amerîkayê",
  UM: "Giravên Derveyî Piçûk ên Dewletên Yekbûyî",
  UY: "Ûrûguay",
  UZ: "Ûzbêkistan",
  VU: "Vanûatû",
  VE: "Venezuela",
  VN: "Vîetnam",
  VG: "Giravên Virgin, Brîtanî",
  VI: "Giravên Virgin, U.S.",
  WF: "Wallis û Futuna",
  EH: "Sahraya Rojava",
  YE: "Yemen",
  ZM: "Zambiya",
  ZW: "Zîmbabwe",
  AX: "Giravên Åland",
  BQ: "Bonaire, Sint Eustatius û Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Girava Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint-Barthélemy",
  MF: "Saint Martin (beşa fransî)",
  RS: "Serbistan",
  SX: "Sint Maarten (Beşa Hollandî)",
  SS: "Sûdana Başûr",
  XK: "Kosova"
};
const ku = {
  locale: locale$B,
  countries: countries$B
};
const locale$A = "ky";
const countries$A = {
  AD: "Андорра",
  AE: "Бириккен Араб Эмираттары",
  AF: "Афганистан",
  AG: "Антигуа жана Барбуда",
  AI: "Ангуила",
  AL: "Албания",
  AM: "Армения",
  AO: "Ангола",
  AQ: "Антарктика",
  AR: "Аргентина",
  AS: "Америка Самоасы",
  AT: "Австрия",
  AU: "Австралия",
  AW: "Аруба",
  AX: "Аланд аралдары",
  AZ: "Азербайжан",
  BA: "Босния жана Герцеговина",
  BB: "Барбадос",
  BD: "Бангладеш",
  BE: "Бельгия",
  BF: "Буркина-Фасо",
  BG: "Болгария",
  BH: "Бахрейн",
  BI: "Бурунди",
  BJ: "Бенин",
  BL: "Сент Бартелеми",
  BM: "Бермуд аралдары",
  BN: "Бруней",
  BO: "Боливия",
  BQ: "Кариб Нидерланддары",
  BR: "Бразилия",
  BS: "Багам аралдары",
  BT: "Бутан",
  BV: "Буве аралдары",
  BW: "Ботсвана",
  BY: "Беларусь",
  BZ: "Белиз",
  CA: "Канада",
  CC: "Кокос (Килиӊ) аралдары",
  CD: "Конго-Киншаса",
  CF: "Борбордук Африка Республикасы",
  CG: "Конго-Браззавил",
  CH: "Швейцария",
  CI: "Кот-д’Ивуар",
  CK: "Кук аралдары",
  CL: "Чили",
  CM: "Камерун",
  CN: "Кытай",
  CO: "Колумбия",
  CR: "Коста-Рика",
  CU: "Куба",
  CV: "Капе Верде",
  CW: "Кюрасао",
  CX: "Крисмас аралы",
  CY: "Кипр",
  CZ: "Чехия",
  DE: "Германия",
  DJ: "Джибути",
  DK: "Дания",
  DM: "Доминика",
  DO: "Доминика Республикасы",
  DZ: "Алжир",
  EC: "Эквадор",
  EE: "Эстония",
  EG: "Египет",
  EH: "Батыш Сахара",
  ER: "Эритрея",
  ES: "Испания",
  ET: "Эфиопия",
  FI: "Финляндия",
  FJ: "Фиджи",
  FK: "Фолклэнд аралдары",
  FM: "Микронезия",
  FO: "Фарер аралдары",
  FR: "Франция",
  GA: "Габон",
  GB: "Улуу Британия",
  GD: "Гренада",
  GE: "Грузия",
  GF: "Гвиана (Франция)",
  GG: "Гернси",
  GH: "Гана",
  GI: "Гибралтар",
  GL: "Гренландия",
  GM: "Гамбия",
  GN: "Гвинея",
  GP: "Гваделупа",
  GQ: "Экваториалдык Гвинея",
  GR: "Греция",
  GS: "Түштүк Жоржия жана Түштүк Сэндвич аралдары",
  GT: "Гватемала",
  GU: "Гуам",
  GW: "Гвинея-Бисау",
  GY: "Гайана",
  HK: "Гонконг Кытай ААА",
  HM: "Херд жана Макдоналд аралдары",
  HN: "Гондурас",
  HR: "Хорватия",
  HT: "Гаити",
  HU: "Венгрия",
  ID: "Индонезия",
  IE: "Ирландия",
  IL: "Израиль",
  IM: "Мэн аралы",
  IN: "Индия",
  IO: "Британиянын Индия океанындагы аймагы",
  IQ: "Ирак",
  IR: "Иран",
  IS: "Исландия",
  IT: "Италия",
  JE: "Жерси",
  JM: "Ямайка",
  JO: "Иордания",
  JP: "Япония",
  KE: "Кения",
  KG: "Кыргызстан",
  KH: "Камбоджа",
  KI: "Кирибати",
  KM: "Коморос",
  KN: "Сент-Китс жана Невис",
  KP: "Түндүк Корея",
  KR: "Түштүк Корея",
  KW: "Кувейт",
  KY: "Кайман Аралдары",
  KZ: "Казакстан",
  LA: "Лаос",
  LB: "Ливан",
  LC: "Сент-Люсия",
  LI: "Лихтенштейн",
  LK: "Шри-Ланка",
  LR: "Либерия",
  LS: "Лесото",
  LT: "Литва",
  LU: "Люксембург",
  LV: "Латвия",
  LY: "Ливия",
  MA: "Марокко",
  MC: "Монако",
  MD: "Молдова",
  ME: "Черногория",
  MF: "Сент-Мартин",
  MG: "Мадагаскар",
  MH: "Маршалл аралдары",
  MK: "Түндүк Македония",
  ML: "Мали",
  MM: "Мьянма (Бирма)",
  MN: "Монголия",
  MO: "Макау Кытай ААА",
  MP: "Түндүк Мариана аралдары",
  MQ: "Мартиника",
  MR: "Мавритания",
  MS: "Монсеррат",
  MT: "Мальта",
  MU: "Маврикий",
  MV: "Малдив аралдары",
  MW: "Малави",
  MX: "Мексика",
  MY: "Малайзия",
  MZ: "Мозамбик",
  NA: "Намибия",
  NC: "Жаӊы Каледония",
  NE: "Нигер",
  NF: "Норфолк аралы",
  NG: "Нигерия",
  NI: "Никарагуа",
  NL: "Нидерланддар",
  NO: "Норвегия",
  NP: "Непал",
  NR: "Науру",
  NU: "Ниуэ",
  NZ: "Жаӊы Зеландия",
  OM: "Оман",
  PA: "Панама",
  PE: "Перу",
  PF: "Француз Полинезиясы",
  PG: "Папуа Жаңы-Гвинея",
  PH: "Филлипин",
  PK: "Пакистан",
  PL: "Польша",
  PM: "Сен-Пьер жана Микелон",
  PN: "Питкэрн аралдары",
  PR: "Пуэрто-Рико",
  PS: "Палестина аймактары",
  PT: "Португалия",
  PW: "Палау",
  PY: "Парагвай",
  QA: "Катар",
  RE: "Реюнион",
  RO: "Румыния",
  RS: "Сербия",
  RU: "Россия",
  RW: "Руанда",
  SA: "Сауд Арабиясы",
  SB: "Соломон аралдары",
  SC: "Сейшелдер",
  SD: "Судан",
  SE: "Швеция",
  SG: "Сингапур",
  SH: "Ыйык Елена",
  SI: "Словения",
  SJ: "Свалбард жана Жан Майен",
  SK: "Словакия",
  SL: "Сьерра-Леоне",
  SM: "Сан Марино",
  SN: "Сенегал",
  SO: "Сомали",
  SR: "Суринаме",
  SS: "Түштүк Судан",
  ST: "Сан-Томе жана Принсипи",
  SV: "Эл Салвадор",
  SX: "Синт Маартен",
  SY: "Сирия",
  SZ: "Свазиленд",
  TC: "Түркс жана Кайкос аралдары",
  TD: "Чад",
  TF: "Франциянын Түштүктөгү аймактары",
  TG: "Того",
  TH: "Таиланд",
  TJ: "Тажикстан",
  TK: "Токелау",
  TL: "Тимор-Лесте",
  TM: "Түркмөнстан",
  TN: "Тунис",
  TO: "Тонга",
  TR: "Түркия",
  TT: "Тринидад жана Тобаго",
  TV: "Тувалу",
  TW: "Тайвань",
  TZ: "Танзания",
  UA: "Украина",
  UG: "Уганда",
  UM: "АКШнын сырткы аралдары",
  US: "Америка Кошмо Штаттары",
  UY: "Уругвай",
  UZ: "Өзбекстан",
  VA: "Ватикан",
  VC: "Сент-Винсент жана Гренадиналар",
  VE: "Венесуэла",
  VG: "Виргин аралдары (Британия)",
  VI: "Виргин аралдары (АКШ)",
  VN: "Вьетнам",
  VU: "Вануату",
  WF: "Уоллис жана Футуна",
  WS: "Самоа",
  XK: "Косово",
  YE: "Йемен",
  YT: "Майотта",
  ZA: "Түштүк Африка Республикасы",
  ZM: "Замбия",
  ZW: "Зимбабве"
};
const ky = {
  locale: locale$A,
  countries: countries$A
};
const locale$z = "lt";
const countries$z = {
  AD: "Andora",
  AE: "Jungtiniai Arabų Emyratai",
  AF: "Afganistanas",
  AG: "Antigva ir Barbuda",
  AI: "Angilija",
  AL: "Albanija",
  AM: "Armėnija",
  AO: "Angola",
  AQ: "Antarktida",
  AR: "Argentina",
  AS: "Amerikos Samoa",
  AT: "Austrija",
  AU: "Australija",
  AW: "Aruba",
  AX: "Alandų Salos",
  AZ: "Azerbaidžanas",
  BA: "Bosnija ir Hercegovina",
  BB: "Barbadosas",
  BD: "Bangladešas",
  BE: "Belgija",
  BF: "Burkina Fasas",
  BG: "Bulgarija",
  BH: "Bahreinas",
  BI: "Burundis",
  BJ: "Beninas",
  BL: "Sen Bartelemi",
  BM: "Bermuda",
  BN: "Brunėjus",
  BO: "Bolivija",
  BQ: "Karibų Nyderlandai",
  BR: "Brazilija",
  BS: "Bahamos",
  BT: "Butanas",
  BV: "Buvė Sala",
  BW: "Botsvana",
  BY: "Baltarusija",
  BZ: "Belizas",
  CA: "Kanada",
  CC: "Kokosų (Kilingo) Salos",
  CD: "Kongas-Kinšasa",
  CF: "Centrinės Afrikos Respublika",
  CG: "Kongas-Brazavilis",
  CH: "Šveicarija",
  CI: "Dramblio Kaulo Krantas",
  CK: "Kuko Salos",
  CL: "Čilė",
  CM: "Kamerūnas",
  CN: "Kinija",
  CO: "Kolumbija",
  CR: "Kosta Rika",
  CU: "Kuba",
  CV: "Žaliasis Kyšulys",
  CW: "Kiurasao",
  CX: "Kalėdų Sala",
  CY: "Kipras",
  CZ: "Čekija",
  DE: "Vokietija",
  DJ: "Džibutis",
  DK: "Danija",
  DM: "Dominika",
  DO: "Dominikos Respublika",
  DZ: "Alžyras",
  EC: "Ekvadoras",
  EE: "Estija",
  EG: "Egiptas",
  EH: "Vakarų Sachara",
  ER: "Eritrėja",
  ES: "Ispanija",
  ET: "Etiopija",
  FI: "Suomija",
  FJ: "Fidžis",
  FK: "Folklando Salos",
  FM: "Mikronezija",
  FO: "Farerų Salos",
  FR: "Prancūzija",
  GA: "Gabonas",
  GB: "Jungtinė Karalystė",
  GD: "Grenada",
  GE: [
    "Sakartvelas",
    "Gruzija"
  ],
  GF: "Prancūzijos Gviana",
  GG: "Gernsis",
  GH: "Gana",
  GI: "Gibraltaras",
  GL: "Grenlandija",
  GM: "Gambija",
  GN: "Gvinėja",
  GP: "Gvadelupa",
  GQ: "Pusiaujo Gvinėja",
  GR: "Graikija",
  GS: "Pietų Džordžija ir Pietų Sandvičo salos",
  GT: "Gvatemala",
  GU: "Guamas",
  GW: "Bisau Gvinėja",
  GY: "Gajana",
  HK: "Honkongas",
  HM: "Herdo ir Makdonaldo Salos",
  HN: "Hondūras",
  HR: "Kroatija",
  HT: "Haitis",
  HU: "Vengrija",
  ID: "Indonezija",
  IE: "Airija",
  IL: "Izraelis",
  IM: "Meno Sala",
  IN: "Indija",
  IO: "Indijos Vandenyno Britų Sritis",
  IQ: "Irakas",
  IR: "Iranas",
  IS: "Islandija",
  IT: "Italija",
  JE: "Džersis",
  JM: "Jamaika",
  JO: "Jordanija",
  JP: "Japonija",
  KE: "Kenija",
  KG: "Kirgizija",
  KH: "Kambodža",
  KI: "Kiribatis",
  KM: "Komorai",
  KN: "Sent Kitsas ir Nevis",
  KP: "Šiaurės Korėja",
  KR: "Pietų Korėja",
  KW: "Kuveitas",
  KY: "Kaimanų Salos",
  KZ: "Kazachstanas",
  LA: "Laosas",
  LB: "Libanas",
  LC: "Sent Lusija",
  LI: "Lichtenšteinas",
  LK: "Šri Lanka",
  LR: "Liberija",
  LS: "Lesotas",
  LT: "Lietuva",
  LU: "Liuksemburgas",
  LV: "Latvija",
  LY: "Libija",
  MA: "Marokas",
  MC: "Monakas",
  MD: "Moldova",
  ME: "Juodkalnija",
  MF: "Sen Martenas",
  MG: "Madagaskaras",
  MH: "Maršalo Salos",
  MK: "Šiaurės Makedonija",
  ML: "Malis",
  MM: "Mianmaras (Birma)",
  MN: "Mongolija",
  MO: "Makao",
  MP: "Marianos Šiaurinės Salos",
  MQ: "Martinika",
  MR: "Mauritanija",
  MS: "Montseratas",
  MT: "Malta",
  MU: "Mauricijus",
  MV: "Maldyvai",
  MW: "Malavis",
  MX: "Meksika",
  MY: "Malaizija",
  MZ: "Mozambikas",
  NA: "Namibija",
  NC: "Naujoji Kaledonija",
  NE: "Nigeris",
  NF: "Norfolko sala",
  NG: "Nigerija",
  NI: "Nikaragva",
  NL: "Nyderlandai",
  NO: "Norvegija",
  NP: "Nepalas",
  NR: "Nauru",
  NU: "Niujė",
  NZ: "Naujoji Zelandija",
  OM: "Omanas",
  PA: "Panama",
  PE: "Peru",
  PF: "Prancūzijos Polinezija",
  PG: "Papua Naujoji Gvinėja",
  PH: "Filipinai",
  PK: "Pakistanas",
  PL: "Lenkija",
  PM: "Sen Pjeras ir Mikelonas",
  PN: "Pitkerno salos",
  PR: "Puerto Rikas",
  PS: "Palestinos teritorija",
  PT: "Portugalija",
  PW: "Palau",
  PY: "Paragvajus",
  QA: "Kataras",
  RE: "Reunjonas",
  RO: "Rumunija",
  RS: "Serbija",
  RU: "Rusija",
  RW: "Ruanda",
  SA: "Saudo Arabija",
  SB: "Saliamono Salos",
  SC: "Seišeliai",
  SD: "Sudanas",
  SE: "Švedija",
  SG: "Singapūras",
  SH: "Šv. Elenos Sala",
  SI: "Slovėnija",
  SJ: "Svalbardas ir Janas Majenas",
  SK: "Slovakija",
  SL: "Siera Leonė",
  SM: "San Marinas",
  SN: "Senegalas",
  SO: "Somalis",
  SR: "Surinamas",
  SS: "Pietų Sudanas",
  ST: "San Tomė ir Prinsipė",
  SV: "Salvadoras",
  SX: "Sint Martenas",
  SY: "Sirija",
  SZ: "Svazilandas",
  TC: "Terkso ir Kaikoso Salos",
  TD: "Čadas",
  TF: "Prancūzijos Pietų sritys",
  TG: "Togas",
  TH: "Tailandas",
  TJ: "Tadžikija",
  TK: "Tokelau",
  TL: "Rytų Timoras",
  TM: "Turkmėnistanas",
  TN: "Tunisas",
  TO: "Tonga",
  TR: "Turkija",
  TT: "Trinidadas ir Tobagas",
  TV: "Tuvalu",
  TW: "Taivanas",
  TZ: "Tanzanija",
  UA: "Ukraina",
  UG: "Uganda",
  UM: "Jungtinių Valstijų Mažosios Tolimosios Salos",
  US: "Jungtinės Valstijos",
  UY: "Urugvajus",
  UZ: "Uzbekistanas",
  VA: "Vatikano Miesto Valstybė",
  VC: "Šventasis Vincentas ir Grenadinai",
  VE: "Venesuela",
  VG: "Didžiosios Britanijos Mergelių Salos",
  VI: "Jungtinių Valstijų Mergelių Salos",
  VN: "Vietnamas",
  VU: "Vanuatu",
  WF: "Volisas ir Futūna",
  WS: "Samoa",
  XK: "Kosovas",
  YE: "Jemenas",
  YT: "Majotas",
  ZA: "Pietų Afrika",
  ZM: "Zambija",
  ZW: "Zimbabvė"
};
const lt = {
  locale: locale$z,
  countries: countries$z
};
const locale$y = "lv";
const countries$y = {
  AD: "Andora",
  AE: "Apvienotie Arābu Emirāti",
  AF: "Afganistāna",
  AG: "Antigva un Barbuda",
  AI: "Angilja",
  AL: "Albānija",
  AM: "Armēnija",
  AO: "Angola",
  AQ: "Antarktika",
  AR: "Argentīna",
  AS: "ASV Samoa",
  AT: "Austrija",
  AU: "Austrālija",
  AW: "Aruba",
  AX: "Olandes salas",
  AZ: "Azerbaidžāna",
  BA: "Bosnija un Hercegovina",
  BB: "Barbadosa",
  BD: "Bangladeša",
  BE: "Beļģija",
  BF: "Burkinafaso",
  BG: "Bulgārija",
  BH: "Bahreina",
  BI: "Burundija",
  BJ: "Benina",
  BL: "Senbartelmī",
  BM: "Bermudu salas",
  BN: "Bruneja",
  BO: "Bolīvija",
  BQ: "Nīderlandes Karību salas",
  BR: "Brazīlija",
  BS: "Bahamu salas",
  BT: "Butāna",
  BV: "Buvē sala",
  BW: "Botsvāna",
  BY: "Baltkrievija",
  BZ: "Beliza",
  CA: "Kanāda",
  CC: "Kokosu (Kīlinga) salas",
  CD: "Kongo (Kinšasa)",
  CF: "Centrālāfrikas Republika",
  CG: "Kongo (Brazavila)",
  CH: "Šveice",
  CI: "Kotdivuāra",
  CK: "Kuka salas",
  CL: "Čīle",
  CM: "Kamerūna",
  CN: "Ķīna",
  CO: "Kolumbija",
  CR: "Kostarika",
  CU: "Kuba",
  CV: "Kaboverde",
  CW: "Kirasao",
  CX: "Ziemsvētku sala",
  CY: "Kipra",
  CZ: "Čehija",
  DE: "Vācija",
  DJ: "Džibutija",
  DK: "Dānija",
  DM: "Dominika",
  DO: "Dominikāna",
  DZ: "Alžīrija",
  EC: "Ekvadora",
  EE: "Igaunija",
  EG: "Ēģipte",
  EH: "Rietumsahāra",
  ER: "Eritreja",
  ES: "Spānija",
  ET: "Etiopija",
  FI: "Somija",
  FJ: "Fidži",
  FK: "Folklenda salas",
  FM: "Mikronēzija",
  FO: "Fēru salas",
  FR: "Francija",
  GA: "Gabona",
  GB: "Lielbritānija",
  GD: "Grenāda",
  GE: "Gruzija",
  GF: "Francijas Gviāna",
  GG: "Gērnsija",
  GH: "Gana",
  GI: "Gibraltārs",
  GL: "Grenlande",
  GM: "Gambija",
  GN: "Gvineja",
  GP: "Gvadelupa",
  GQ: "Ekvatoriālā Gvineja",
  GR: "Grieķija",
  GS: "Dienviddžordžija un Dienvidsendviču salas",
  GT: "Gvatemala",
  GU: "Guama",
  GW: "Gvineja-Bisava",
  GY: "Gajāna",
  HK: "Ķīnas īpašās pārvaldes apgabals Honkonga",
  HM: "Hērda sala un Makdonalda salas",
  HN: "Hondurasa",
  HR: "Horvātija",
  HT: "Haiti",
  HU: "Ungārija",
  ID: "Indonēzija",
  IE: "Īrija",
  IL: "Izraēla",
  IM: "Mena",
  IN: "Indija",
  IO: "Indijas okeāna Britu teritorija",
  IQ: "Irāka",
  IR: "Irāna",
  IS: "Islande",
  IT: "Itālija",
  JE: "Džērsija",
  JM: "Jamaika",
  JO: "Jordānija",
  JP: "Japāna",
  KE: "Kenija",
  KG: "Kirgizstāna",
  KH: "Kambodža",
  KI: "Kiribati",
  KM: "Komoru salas",
  KN: "Sentkitsa un Nevisa",
  KP: "Ziemeļkoreja",
  KR: "Dienvidkoreja",
  KW: "Kuveita",
  KY: "Kaimanu salas",
  KZ: "Kazahstāna",
  LA: "Laosa",
  LB: "Libāna",
  LC: "Sentlūsija",
  LI: "Lihtenšteina",
  LK: "Šrilanka",
  LR: "Libērija",
  LS: "Lesoto",
  LT: "Lietuva",
  LU: "Luksemburga",
  LV: "Latvija",
  LY: "Lībija",
  MA: "Maroka",
  MC: "Monako",
  MD: "Moldova",
  ME: "Melnkalne",
  MF: "Senmartēna",
  MG: "Madagaskara",
  MH: "Māršala salas",
  MK: "Ziemeļmaķedonija",
  ML: "Mali",
  MM: "Mjanma (Birma)",
  MN: "Mongolija",
  MO: "Ķīnas īpašās pārvaldes apgabals Makao",
  MP: "Ziemeļu Marianas salas",
  MQ: "Martinika",
  MR: "Mauritānija",
  MS: "Montserrata",
  MT: "Malta",
  MU: "Maurīcija",
  MV: "Maldīvija",
  MW: "Malāvija",
  MX: "Meksika",
  MY: "Malaizija",
  MZ: "Mozambika",
  NA: "Namībija",
  NC: "Jaunkaledonija",
  NE: "Nigēra",
  NF: "Norfolkas sala",
  NG: "Nigērija",
  NI: "Nikaragva",
  NL: "Nīderlande",
  NO: "Norvēģija",
  NP: "Nepāla",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Jaunzēlande",
  OM: "Omāna",
  PA: "Panama",
  PE: "Peru",
  PF: "Francijas Polinēzija",
  PG: "Papua-Jaungvineja",
  PH: "Filipīnas",
  PK: "Pakistāna",
  PL: "Polija",
  PM: "Senpjēra un Mikelona",
  PN: "Pitkērnas salas",
  PR: "Puertoriko",
  PS: "Palestīna",
  PT: "Portugāle",
  PW: "Palau",
  PY: "Paragvaja",
  QA: "Katara",
  RE: "Reinjona",
  RO: "Rumānija",
  RS: "Serbija",
  RU: "Krievija",
  RW: "Ruanda",
  SA: "Saūda Arābija",
  SB: "Zālamana salas",
  SC: "Seišelu salas",
  SD: "Sudāna",
  SE: "Zviedrija",
  SG: "Singapūra",
  SH: "Sv.Helēnas sala",
  SI: "Slovēnija",
  SJ: "Svalbāra un Jana Majena sala",
  SK: "Slovākija",
  SL: "Sjerraleone",
  SM: "Sanmarīno",
  SN: "Senegāla",
  SO: "Somālija",
  SR: "Surinama",
  SS: "Dienvidsudāna",
  ST: "Santome un Prinsipi",
  SV: "Salvadora",
  SX: "Sintmārtena",
  SY: "Sīrija",
  SZ: "Svazilenda",
  TC: "Tērksas un Kaikosas salas",
  TD: "Čada",
  TF: "Francijas Dienvidjūru teritorija",
  TG: "Togo",
  TH: "Taizeme",
  TJ: "Tadžikistāna",
  TK: "Tokelau",
  TL: "Austrumtimora",
  TM: "Turkmenistāna",
  TN: "Tunisija",
  TO: "Tonga",
  TR: "Turcija",
  TT: "Trinidāda un Tobāgo",
  TV: "Tuvalu",
  TW: "Taivāna",
  TZ: "Tanzānija",
  UA: "Ukraina",
  UG: "Uganda",
  UM: "ASV Mazās Aizjūras salas",
  US: "Amerikas Savienotās Valstis",
  UY: "Urugvaja",
  UZ: "Uzbekistāna",
  VA: "Vatikāns",
  VC: "Sentvinsenta un Grenadīnas",
  VE: "Venecuēla",
  VG: "Britu Virdžīnas",
  VI: "ASV Virdžīnas",
  VN: "Vjetnama",
  VU: "Vanuatu",
  WF: "Volisa un Futunas salas",
  WS: "Samoa",
  XK: "Kosova",
  YE: "Jemena",
  YT: "Majota",
  ZA: "Dienvidāfrikas Republika",
  ZM: "Zambija",
  ZW: "Zimbabve"
};
const lv = {
  locale: locale$y,
  countries: countries$y
};
const locale$x = "mk";
const countries$x = {
  AD: "Андора",
  AE: "Обединети Арапски Емирати",
  AF: "Авганистан",
  AG: "Антигва и Барбуда",
  AI: "Ангвила",
  AL: "Албанија",
  AM: "Ерменија",
  AO: "Ангола",
  AQ: "Антарктик",
  AR: "Аргентина",
  AS: "Американска Самоа",
  AT: "Австрија",
  AU: "Австралија",
  AW: "Аруба",
  AX: "Оландски Острови",
  AZ: "Азербејџан",
  BA: "Босна и Херцеговина",
  BB: "Барбадос",
  BD: "Бангладеш",
  BE: "Белгија",
  BF: "Буркина Фасо",
  BG: "Бугарија",
  BH: "Бахреин",
  BI: "Бурунди",
  BJ: "Бенин",
  BL: "Свети Вартоломеј",
  BM: "Бермуди",
  BN: "Брунеј",
  BO: "Боливија",
  BQ: "Карипска Холандија",
  BR: "Бразил",
  BS: "Бахами",
  BT: "Бутан",
  BV: "Остров Буве",
  BW: "Боцвана",
  BY: "Белорусија",
  BZ: "Белизе",
  CA: "Канада",
  CC: "Кокосови (Килиншки) Острови",
  CD: "Конго - Киншаса",
  CF: "Централноафриканска Република",
  CG: "Конго - Бразавил",
  CH: "Швајцарија",
  CI: "Брегот на Слоновата Коска",
  CK: "Кукови Острови",
  CL: "Чиле",
  CM: "Камерун",
  CN: "Кина",
  CO: "Колумбија",
  CR: "Костарика",
  CU: "Куба",
  CV: "Зелен ’Рт",
  CW: "Курасао",
  CX: "Божиќен Остров",
  CY: "Кипар",
  CZ: "Чешка",
  DE: "Германија",
  DJ: "Џибути",
  DK: "Данска",
  DM: "Доминика",
  DO: "Доминиканска Република",
  DZ: "Алжир",
  EC: "Еквадор",
  EE: "Естонија",
  EG: "Египет",
  EH: "Западна Сахара",
  ER: "Еритреја",
  ES: "Шпанија",
  ET: "Етиопија",
  FI: "Финска",
  FJ: "Фиџи",
  FK: "Фолкландски Острови",
  FM: "Микронезија",
  FO: "Фарски Острови",
  FR: "Франција",
  GA: "Габон",
  GB: "Обединето Кралство",
  GD: "Гренада",
  GE: "Грузија",
  GF: "Француска Гвајана",
  GG: "Гернзи",
  GH: "Гана",
  GI: "Гибралтар",
  GL: "Гренланд",
  GM: "Гамбија",
  GN: "Гвинеја",
  GP: "Гвадалупе",
  GQ: "Екваторска Гвинеја",
  GR: "Грција",
  GS: "Јужна Џорџија и Јужни Сендвички Острови",
  GT: "Гватемала",
  GU: "Гуам",
  GW: "Гвинеја-Бисау",
  GY: "Гвајана",
  HK: "Хонг Конг С.А.Р Кина",
  HM: "Остров Херд и Острови Мекдоналд",
  HN: "Хондурас",
  HR: "Хрватска",
  HT: "Хаити",
  HU: "Унгарија",
  ID: "Индонезија",
  IE: "Ирска",
  IL: "Израел",
  IM: "Остров Ман",
  IN: "Индија",
  IO: "Британска Индоокеанска Територија",
  IQ: "Ирак",
  IR: "Иран",
  IS: "Исланд",
  IT: "Италија",
  JE: "Џерси",
  JM: "Јамајка",
  JO: "Јордан",
  JP: "Јапонија",
  KE: "Кенија",
  KG: "Киргистан",
  KH: "Камбоџа",
  KI: "Кирибати",
  KM: "Коморски Острови",
  KN: "Свети Кристофер и Невис",
  KP: "Северна Кореја",
  KR: "Јужна Кореја",
  KW: "Кувајт",
  KY: "Кајмански Острови",
  KZ: "Казахстан",
  LA: "Лаос",
  LB: "Либан",
  LC: "Света Луција",
  LI: "Лихтенштајн",
  LK: "Шри Ланка",
  LR: "Либерија",
  LS: "Лесото",
  LT: "Литванија",
  LU: "Луксембург",
  LV: "Латвија",
  LY: "Либија",
  MA: "Мароко",
  MC: "Монако",
  MD: "Молдавија",
  ME: "Црна Гора",
  MF: "Сент Мартин",
  MG: "Мадагаскар",
  MH: "Маршалски Острови",
  MK: "Северна Македонија",
  ML: "Мали",
  MM: "Мјанмар (Бурма)",
  MN: "Монголија",
  MO: "Макао САР",
  MP: "Северни Маријански Острови",
  MQ: "Мартиник",
  MR: "Мавританија",
  MS: "Монсерат",
  MT: "Малта",
  MU: "Маврициус",
  MV: "Малдиви",
  MW: "Малави",
  MX: "Мексико",
  MY: "Малезија",
  MZ: "Мозамбик",
  NA: "Намибија",
  NC: "Нова Каледонија",
  NE: "Нигер",
  NF: "Норфолшки Остров",
  NG: "Нигерија",
  NI: "Никарагва",
  NL: "Холандија",
  NO: "Норвешка",
  NP: "Непал",
  NR: "Науру",
  NU: "Ниује",
  NZ: "Нов Зеланд",
  OM: "Оман",
  PA: "Панама",
  PE: "Перу",
  PF: "Француска Полинезија",
  PG: "Папуа Нова Гвинеја",
  PH: "Филипини",
  PK: "Пакистан",
  PL: "Полска",
  PM: "Сент Пјер и Микелан",
  PN: "Питкернски Острови",
  PR: "Порторико",
  PS: "Палестински територии",
  PT: "Португалија",
  PW: "Палау",
  PY: "Парагвај",
  QA: "Катар",
  RE: "Реунион",
  RO: "Романија",
  RS: "Србија",
  RU: "Русија",
  RW: "Руанда",
  SA: "Саудиска Арабија",
  SB: "Соломонски Острови",
  SC: "Сејшели",
  SD: "Судан",
  SE: "Шведска",
  SG: "Сингапур",
  SH: "Света Елена",
  SI: "Словенија",
  SJ: "Свалбард и Жан Мејен",
  SK: "Словачка",
  SL: "Сиера Леоне",
  SM: "Сан Марино",
  SN: "Сенегал",
  SO: "Сомалија",
  SR: "Суринам",
  SS: "Јужен Судан",
  ST: "Сао Томе и Принсипе",
  SV: "Ел Салвадор",
  SX: "Свети Мартин",
  SY: "Сирија",
  SZ: "Свазиленд",
  TC: "Острови Туркс и Каикос",
  TD: "Чад",
  TF: "Француски Јужни Територии",
  TG: "Того",
  TH: "Тајланд",
  TJ: "Таџикистан",
  TK: "Токелау",
  TL: "Источен Тимор (Тимор Лесте)",
  TM: "Туркменистан",
  TN: "Тунис",
  TO: "Тонга",
  TR: "Турција",
  TT: "Тринидад и Тобаго",
  TV: "Тувалу",
  TW: "Тајван",
  TZ: "Танзанија",
  UA: "Украина",
  UG: "Уганда",
  UM: "Американски територии во Пацификот",
  US: "Соединети Американски Држави",
  UY: "Уругвај",
  UZ: "Узбекистан",
  VA: "Ватикан",
  VC: "Свети Винсент и Гренадините",
  VE: "Венецуела",
  VG: "Британски Девствени Острови",
  VI: "Американски Девствени Острови",
  VN: "Виетнам",
  VU: "Вануату",
  WF: "Валис и Футуна",
  WS: "Самоа",
  XK: "Косово",
  YE: "Јемен",
  YT: "Мајот",
  ZA: "Јужноафриканска Република",
  ZM: "Замбија",
  ZW: "Зимбабве"
};
const mk = {
  locale: locale$x,
  countries: countries$x
};
const locale$w = "ml";
const countries$w = {
  AF: "അഫ്‌ഗാനിസ്ഥാൻ",
  AL: "അൽബേനിയ",
  DZ: "അൾജീരിയ",
  AS: "അമേരിക്കൻ സമോവ",
  AD: "അന്റോറ",
  AO: "അംഗോള",
  AI: "ആൻഗ്വില്ല",
  AQ: "അൻറാർട്ടിക്ക",
  AG: "ആൻറിഗ്വയും ബർബുഡയും",
  AR: "അർജൻറീന",
  AM: "അർമേനിയ",
  AW: "അറൂബ",
  AU: "ഓസ്‌ട്രേലിയ",
  AT: "ഓസ്ട്രിയ",
  AZ: "അസർബൈജാൻ",
  BS: "ബഹാമാസ്",
  BH: "ബഹ്റിൻ",
  BD: "ബംഗ്ലാദേശ്",
  BB: "ബാർബഡോസ്",
  BY: "ബെലറൂസ്",
  BE: "ബെൽജിയം",
  BZ: "ബെലീസ്",
  BJ: "ബെനിൻ",
  BM: "ബർമുഡ",
  BT: "ഭൂട്ടാൻ",
  BO: "ബൊളീവിയ",
  BA: "ബോസ്നിയയും ഹെർസഗോവിനയും",
  BW: "ബോട്സ്വാന",
  BV: "ബൗവെട്ട് ദ്വീപ്",
  BR: "ബ്രസീൽ",
  IO: "ബ്രിട്ടീഷ് ഇന്ത്യൻ മഹാസമുദ്ര പ്രദേശം",
  BN: "ബ്രൂണൈ",
  BG: "ബൾഗേറിയ",
  BF: "ബുർക്കിനാ ഫാസോ",
  BI: "ബറുണ്ടി",
  KH: "കംബോഡിയ",
  CM: "കാമറൂൺ",
  CA: "കാനഡ",
  CV: "കേപ്പ് വെർദെ",
  KY: "കേമാൻ ദ്വീപുകൾ",
  CF: "സെൻട്രൽ ആഫ്രിക്കൻ റിപ്പബ്ലിക്",
  TD: "ഛാഡ്",
  CL: "ചിലി",
  CN: "ചൈന",
  CX: "ക്രിസ്മസ് ദ്വീപ്",
  CC: "കോക്കസ് ദ്വീപുകൾ",
  CO: "കൊളംബിയ",
  KM: "കോമൊറോസ്",
  CG: "കോംഗോ - ബ്രാസവില്ലി",
  CD: "കോംഗോ - കിൻഷാസ",
  CK: "കുക്ക് ദ്വീപുകൾ",
  CR: "കോസ്റ്ററിക്ക",
  CI: "കോട്ട് ഡി വാർ",
  HR: "ക്രൊയേഷ്യ",
  CU: "ക്യൂബ",
  CY: "സൈപ്രസ്",
  CZ: "ചെക്ക് റിപ്പബ്ലിക്",
  DK: "ഡെൻമാർക്ക്",
  DJ: "ദിജിബൗട്ടി",
  DM: "ഡൊമിനിക്ക",
  DO: "ഡൊമിനിക്കൻ റിപ്പബ്ലിക്",
  EC: "ഇക്വഡോർ",
  EG: "ഈജിപ്ത്",
  SV: "എൽ സാൽവദോർ",
  GQ: "ഇക്വറ്റോറിയൽ ഗിനിയ",
  ER: "എറിത്രിയ",
  EE: "എസ്റ്റോണിയ‍",
  ET: "എത്യോപ്യ",
  FK: "ഫാക്ക്‌ലാന്റ് ദ്വീപുകൾ",
  FO: "ഫറോ ദ്വീപുകൾ",
  FJ: "ഫിജി",
  FI: "ഫിൻലാൻഡ്",
  FR: "ഫ്രാൻസ്",
  GF: "ഫ്രഞ്ച് ഗയാന",
  PF: "ഫ്രഞ്ച് പോളിനേഷ്യ",
  TF: "ഫ്രഞ്ച് ദക്ഷിണ ഭൂപ്രദേശം",
  GA: "ഗാബൺ",
  GM: "ഗാംബിയ",
  GE: "ജോർജ്ജിയ",
  DE: "ജർമനി",
  GH: "ഘാന",
  GI: "ജിബ്രാൾട്ടർ",
  GR: "ഗ്രീസ്",
  GL: "ഗ്രീൻലാൻറ്",
  GD: "ഗ്രനേഡ",
  GP: "ഗ്വാഡലൂപ്പ്",
  GU: "ഗ്വാം",
  GT: "ഗ്വാട്ടിമാല",
  GN: "ഗിനിയ",
  GW: "ഗിനിയ-ബിസൗ",
  GY: "ഗയാന",
  HT: "ഹെയ്തി",
  HM: "ഹിയേർഡും മക്‌ഡൊണാൾഡ് ദ്വീപുകളും",
  VA: "വത്തിക്കാൻ",
  HN: "ഹോണ്ടുറാസ്",
  HK: "ഹോങ് കോങ് എസ്.ഏ.ആർ. ചൈന",
  HU: "ഹംഗറി",
  IS: "ഐസ്‌ലാന്റ്",
  IN: "ഇന്ത്യ",
  ID: "ഇന്തോനേഷ്യ",
  IR: "ഇറാൻ",
  IQ: "ഇറാഖ്",
  IE: "അയർലാൻഡ്",
  IL: "ഇസ്രായേൽ",
  IT: "ഇറ്റലി",
  JM: "ജമൈക്ക",
  JP: "ജപ്പാൻ",
  JO: "ജോർദ്ദാൻ",
  KZ: "കസാഖിസ്ഥാൻ",
  KE: "കെനിയ",
  KI: "കിരിബാട്ടി",
  KP: "ഉത്തരകൊറിയ",
  KR: "ദക്ഷിണകൊറിയ",
  KW: "കുവൈറ്റ്",
  KG: "കിർഗിസ്ഥാൻ",
  LA: "ലാവോസ്",
  LV: "ലാറ്റ്വിയ",
  LB: "ലെബനൻ",
  LS: "ലെസോതോ",
  LR: "ലൈബീരിയ",
  LY: "ലിബിയ",
  LI: "ലിച്ചൺസ്റ്റൈൻ",
  LT: "ലിത്വാനിയ",
  LU: "ലക്സംബർഗ്",
  MO: "മക്കാവോ SAR ചൈന",
  MG: "മഡഗാസ്കർ",
  MW: "മലാവി",
  MY: "മലേഷ്യ",
  MV: "മാലിദ്വീപ്",
  ML: "മാലി",
  MT: "മാൾട്ട",
  MH: "മാർഷൽ‍‍ ദ്വീപുകൾ",
  MQ: "മാർട്ടിനിക്ക്",
  MR: "മൗറിറ്റാനിയ",
  MU: "മൗറീഷ്യസ്",
  YT: "മയോട്ടി",
  MX: "മെക്സിക്കോ",
  FM: "മൈക്രോനേഷ്യ",
  MD: "മൾഡോവ",
  MC: "മൊണാക്കോ",
  MN: "മംഗോളിയ",
  MS: "മൊണ്ടെസരത്ത്",
  MA: "മൊറോക്കൊ",
  MZ: "മൊസാംബിക്ക്",
  MM: "മ്യാൻമാർ (ബർമ്മ)",
  NA: "നമീബിയ",
  NR: "നൗറു",
  NP: "നേപ്പാൾ",
  NL: "നെതർലാൻഡ്‌സ്",
  NC: "പുതിയ കാലിഡോണിയ",
  NZ: "ന്യൂസിലാൻറ്",
  NI: "നിക്കരാഗ്വ",
  NE: "നൈജർ",
  NG: "നൈജീരിയ",
  NU: "ന്യൂയി",
  NF: "നോർഫോക് ദ്വീപ്",
  MK: "മാസിഡോണിയ",
  MP: "ഉത്തര മറിയാനാ ദ്വീപുകൾ",
  NO: "നോർവെ",
  OM: "ഒമാൻ",
  PK: "പാക്കിസ്ഥാൻ",
  PW: "പലാവു",
  PS: "പാലസ്‌തീൻ പ്രദേശങ്ങൾ",
  PA: "പനാമ",
  PG: "പാപ്പുവ ന്യൂ ഗിനിയ",
  PY: "പരാഗ്വേ",
  PE: "പെറു",
  PH: "ഫിലിപ്പൈൻസ്",
  PN: "പിറ്റ്‌കെയ്‌ൻ ദ്വീപുകൾ",
  PL: "പോളണ്ട്",
  PT: "പോർച്ചുഗൽ",
  PR: "പ്യൂർട്ടോ റിക്കോ",
  QA: "ഖത്തർ",
  RE: "റീയൂണിയൻ",
  RO: "റൊമാനിയ",
  RU: "റഷ്യ",
  RW: "റുവാണ്ട",
  SH: "സെൻറ് ഹെലീന",
  KN: "സെന്റ് കിറ്റ്‌സും നെവിസും",
  LC: "സെൻറ് ലൂസിയ",
  PM: "സെന്റ് പിയറിയും മിക്കലണും",
  VC: "സെന്റ് വിൻസെന്റും ഗ്രനെഡൈൻസും",
  WS: "സമോവ",
  SM: "സാൻ മറിനോ",
  ST: "സാവോ ടോമും പ്രിൻസിപെയും",
  SA: "സൗദി അറേബ്യ",
  SN: "സെനഗൽ",
  SC: "സെയ്‌ഷെൽസ്",
  SL: "സിയെറ ലിയോൺ",
  SG: "സിംഗപ്പുർ",
  SK: "സ്ലോവാക്യ",
  SI: "സ്ലോവേനിയ",
  SB: "സോളമൻ‍ ദ്വീപുകൾ",
  SO: "സോമാലിയ",
  ZA: "ദക്ഷിണാഫ്രിക്ക",
  GS: "ദക്ഷിണ ജോർജ്ജിയയും ദക്ഷിണ സാൻഡ്‌വിച്ച് ദ്വീപുകളും",
  ES: "സ്‌പെയിൻ",
  LK: "ശ്രീലങ്ക",
  SD: "സുഡാൻ",
  SR: "സുരിനെയിം",
  SJ: "സ്വാൽബാഡും ജാൻ മായേനും",
  SZ: "സ്വാസിലാൻറ്",
  SE: "സ്വീഡൻ",
  CH: "സ്വിറ്റ്സർലാൻഡ്",
  SY: "സിറിയ",
  TW: "തായ്‌വാൻ",
  TJ: "താജിക്കിസ്ഥാൻ",
  TZ: "ടാൻസാനിയ",
  TH: "തായ്‌ലാൻഡ്",
  TL: "തിമോർ-ലെസ്റ്റെ",
  TG: "ടോഗോ",
  TK: "ടോക്കെലൂ",
  TO: "ടോംഗ",
  TT: "ട്രിനിഡാഡും ടുബാഗോയും",
  TN: "ടുണീഷ്യ",
  TR: "തുർക്കി",
  TM: "തുർക്ക്മെനിസ്ഥാൻ",
  TC: "ടർക്ക്‌സും കെയ്‌ക്കോ ദ്വീപുകളും",
  TV: "ടുവാലു",
  UG: "ഉഗാണ്ട",
  UA: "ഉക്രെയ്‌ൻ",
  AE: "യുണൈറ്റഡ് അറബ് എമിറൈറ്റ്‌സ്",
  GB: "ബ്രിട്ടൻ",
  US: "അമേരിക്കൻ ഐക്യനാടുകൾ",
  UM: "യു.എസ്. ദ്വീപസമൂഹങ്ങൾ",
  UY: "ഉറുഗ്വേ",
  UZ: "ഉസ്‌ബെക്കിസ്ഥാൻ",
  VU: "വന്വാതു",
  VE: "വെനിസ്വേല",
  VN: "വിയറ്റ്നാം",
  VG: "ബ്രിട്ടീഷ് വെർജിൻ ദ്വീപുകൾ",
  VI: "യു.എസ്. വെർജിൻ ദ്വീപുകൾ",
  WF: "വാലിസ് ആന്റ് ഫ്യൂച്യുന",
  EH: "പശ്ചിമ സഹാറ",
  YE: "യെമൻ",
  ZM: "സാംബിയ",
  ZW: "സിംബാബ്‌വേ",
  AX: "അലൻഡ് ദ്വീപുകൾ",
  BQ: "ബൊണെയ്ർ, സിന്റ് യുസ്റ്റേഷ്യസ്, സാബ എന്നിവ",
  CW: "കുറാകാവോ",
  GG: "ഗേൺസി",
  IM: "ഐൽ ഓഫ് മാൻ",
  JE: "ജേഴ്സി",
  ME: "മോണ്ടെനെഗ്രോ",
  BL: "സെന്റ് ബാർത്തലമി",
  MF: "സെൻറ് മാർട്ടിൻ",
  RS: "സെർബിയ",
  SX: "സിന്റ് മാർട്ടെൻ",
  SS: "ദക്ഷിണ സുഡാൻ",
  XK: "കൊസോവൊ"
};
const ml = {
  locale: locale$w,
  countries: countries$w
};
const locale$v = "mn";
const countries$v = {
  AD: "Андорра",
  AE: "Арабын Нэгдсэн Эмират",
  AF: "Афганистан",
  AG: "Антигуа ба Барбуда",
  AI: "Ангила",
  AL: "Албани",
  AM: "Армени",
  AO: "Ангол",
  AQ: "Антарктик",
  AR: "Аргентин",
  AS: "Америкийн Самоа",
  AT: "Австри",
  AU: "Австрали",
  AW: "Аруба",
  AX: "Аландын Арлууд",
  AZ: "Азербайжан",
  BA: "Босни Герцеговин",
  BB: "Барбадос",
  BD: "Бангладеш",
  BE: "Белги",
  BF: "Буркина фасо",
  BG: "Болгар",
  BH: "Бахрейн",
  BI: "Бурунди",
  BJ: "Бенин",
  BL: "Сент Бартельми",
  BM: "Бермуд",
  BN: "Бруней",
  BO: "Боливи",
  BQ: "Карибын Нидерланд",
  BR: "Бразил",
  BS: "Багам",
  BT: "Бутан",
  BV: "Буветын арлууд",
  BW: "Ботсвана",
  BY: "Беларусь",
  BZ: "Белиз",
  CA: "Канад",
  CC: "Кокос (Кийлинг) арлууд",
  CD: "Конго-Киншаса",
  CF: "Төв Африкийн Бүгд Найрамдах Улс",
  CG: "Конго Браззавиль",
  CH: "Швейцари",
  CI: "Кот д’Ивуар",
  CK: "Күүкийн арлууд",
  CL: "Чили",
  CM: "Камерун",
  CN: "Хятад",
  CO: "Колумб",
  CR: "Коста Рика",
  CU: "Куба",
  CV: "Капе Верде",
  CW: "Куракао",
  CX: "Зул сарын арал",
  CY: "Кипр",
  CZ: "Чех",
  DE: "Герман",
  DJ: "Джибути",
  DK: "Дани",
  DM: "Доминик",
  DO: "Бүгд Найрамдах Доминикан Улс",
  DZ: "Алжир",
  EC: "Эквадор",
  EE: "Эстони",
  EG: "Египет",
  EH: "Баруун Сахар",
  ER: "Эритри",
  ES: "Испани",
  ET: "Этиоп",
  FI: "Финланд",
  FJ: "Фижи",
  FK: "Фолькландын Арлууд",
  FM: "Микронези",
  FO: "Фароэ Арлууд",
  FR: "Франц",
  GA: "Габон",
  GB: "Их Британи",
  GD: "Гренада",
  GE: "Гүрж",
  GF: "Францын Гайана",
  GG: "Гернси",
  GH: "Гана",
  GI: "Гибралтар",
  GL: "Гренланд",
  GM: "Гамби",
  GN: "Гвиней",
  GP: "Гваделуп",
  GQ: "Экваторын Гвиней",
  GR: "Грек",
  GS: "Өмнөд Жоржиа ба Өмнөд Сэндвичийн Арлууд",
  GT: "Гватемал",
  GU: "Гуам",
  GW: "Гвиней-Бисау",
  GY: "Гайана",
  HK: "Хонг Конг",
  HM: "Хэрд болон Макдоналд арлууд",
  HN: "Гондурас",
  HR: "Хорват",
  HT: "Гаити",
  HU: "Унгар",
  ID: "Индонези",
  IE: "Ирланд",
  IL: "Израиль",
  IM: "Мэн Арал",
  IN: "Энэтхэг",
  IO: "Британийн харьяа Энэтхэгийн далай дахь нутаг дэвсгэрүүд",
  IQ: "Ирак",
  IR: "Иран",
  IS: "Исланд",
  IT: "Итали",
  JE: "Жерси",
  JM: "Ямайк",
  JO: "Йордан",
  JP: "Япон",
  KE: "Кени",
  KG: "Кыргызстан",
  KH: "Камбож",
  KI: "Кирибати",
  KM: "Коморос",
  KN: "Сент-Киттс ба Невис",
  KP: "Хойд Солонгос",
  KR: "Өмнөд Солонгос",
  KW: "Кувейт",
  KY: "Кайманы Арлууд",
  KZ: "Казахстан",
  LA: "Лаос",
  LB: "Ливан",
  LC: "Сент Люсиа",
  LI: "Лихтенштейн",
  LK: "Шри Ланка",
  LR: "Либери",
  LS: "Лесото",
  LT: "Литва",
  LU: "Люксембург",
  LV: "Латви",
  LY: "Ливи",
  MA: "Марокко",
  MC: "Монако",
  MD: "Молдав",
  ME: "Монтенегро",
  MF: "Сент-Мартин",
  MG: "Мадагаскар",
  MH: "Маршаллын арлууд",
  MK: "Умард Македон",
  ML: "Мали",
  MM: "Мьянмар (Бурма)",
  MN: "Монгол",
  MO: "Макао",
  MP: "Хойд Марианы арлууд",
  MQ: "Мартиник",
  MR: "Мавритани",
  MS: "Монтсеррат",
  MT: "Мальта",
  MU: "Мавритус",
  MV: "Мальдив",
  MW: "Малави",
  MX: "Мексик",
  MY: "Малайз",
  MZ: "Мозамбик",
  NA: "Намиби",
  NC: "Шинэ Каледони",
  NE: "Нигер",
  NF: "Норфолк арлууд",
  NG: "Нигери",
  NI: "Никарагуа",
  NL: "Нидерланд",
  NO: "Норвеги",
  NP: "Балба",
  NR: "Науру",
  NU: "Ниуэ",
  NZ: "Шинэ Зеланд",
  OM: "Оман",
  PA: "Панам",
  PE: "Перу",
  PF: "Францын Полинез",
  PG: "Папуа Шинэ Гвиней",
  PH: "Филиппин",
  PK: "Пакистан",
  PL: "Польш",
  PM: "Сэнт Пьер ба Микелон",
  PN: "Питкэрн арлууд",
  PR: "Пуэрто Рико",
  PS: "Палестины нутаг дэвсгэрүүд",
  PT: "Португаль",
  PW: "Палау",
  PY: "Парагвай",
  QA: "Катар",
  RE: "Реюньон",
  RO: "Румын",
  RS: "Серби",
  RU: "Орос",
  RW: "Руанда",
  SA: "Саудын Араб",
  SB: "Соломоны Арлууд",
  SC: "Сейшел",
  SD: "Судан",
  SE: "Швед",
  SG: "Сингапур",
  SH: "Сент Хелена",
  SI: "Словени",
  SJ: "Свалбард ба Ян Майен",
  SK: "Словак",
  SL: "Сьерра-Леоне",
  SM: "Сан-Марино",
  SN: "Сенегал",
  SO: "Сомали",
  SR: "Суринам",
  SS: "Өмнөд Судан",
  ST: "Сан-Томе ба Принсипи",
  SV: "Эль Сальвадор",
  SX: "Синт Мартен",
  SY: "Сири",
  SZ: "Свазиланд",
  TC: "Турк ба Кайкосын Арлууд",
  TD: "Чад",
  TF: "Францын өмнөд газар нутаг",
  TG: "Того",
  TH: "Тайланд",
  TJ: "Тажикистан",
  TK: "Токелау",
  TL: "Тимор-Лесте",
  TM: "Туркменистан",
  TN: "Тунис",
  TO: "Тонга",
  TR: "Турк",
  TT: "Тринидад Тобаго",
  TV: "Тувалу",
  TW: "Тайвань",
  TZ: "Танзани",
  UA: "Украин",
  UG: "Уганда",
  UM: "АНУ-ын тойрсон арлууд",
  US: "Америкийн Нэгдсэн Улс",
  UY: "Уругвай",
  UZ: "Узбекистан",
  VA: "Ватикан хот улс",
  VC: "Сэнт Винсэнт ба Гренадин",
  VE: "Венесуэл",
  VG: "Британийн Виржиний Арлууд",
  VI: "АНУ-ын Виржиний Арлууд",
  VN: "Вьетнам",
  VU: "Вануату",
  WF: "Уоллис ба Футуна",
  WS: "Самоа",
  XK: "Косово",
  YE: "Йемен",
  YT: "Майотте",
  ZA: "Өмнөд Африк тив",
  ZM: "Замби",
  ZW: "Зимбабве"
};
const mn = {
  locale: locale$v,
  countries: countries$v
};
const locale$u = "mr";
const countries$u = {
  AD: "आंदोरा",
  AE: "संयुक्त अरब अमिराती",
  AF: "अफगाणिस्तान",
  AG: "अँटिगा आणि बार्बुडा",
  AI: "अँग्विला",
  AL: "अल्बानिया",
  AM: "अर्मेनिया",
  AO: "अँगोला",
  AQ: "अंटार्क्टिका",
  AR: "अर्जेंटीना",
  AS: "अमेरिकन सामोआ",
  AT: "ऑस्ट्रिया",
  AU: "ऑस्ट्रेलिया",
  AW: "अरूबा",
  AX: "ऑलंड द्वीपसमूह",
  AZ: "अझरबैजान",
  BA: "बॉस्निया आणि हर्झगोव्हिना",
  BB: "बार्बाडोस",
  BD: "बांग्लादेश",
  BE: "बेल्जियम",
  BF: "बुर्किना फासो",
  BG: "बल्गेरिया",
  BH: "बहारीन",
  BI: "बुरुंडी",
  BJ: "बेनिन",
  BL: "सेंट बार्थेलेमी",
  BM: "बर्म्युडा",
  BN: "ब्रुनेई दारुसलाम",
  BO: "बोलिव्हिया",
  BQ: "कैरिबियन नेदरलँड्स",
  BR: "ब्राझील",
  BS: "बहामास",
  BT: "भूतान",
  BV: "बुवेट बेट",
  BW: "बोत्स्वाना",
  BY: "बेलारूस",
  BZ: "बेलीज",
  CA: "कॅनडा",
  CC: "कोकोस द्वीपसमूह",
  CD: "काँगो, लोकशाही प्रजासत्ताक",
  CF: "मध्य आफ्रिकेचे प्रजासत्ताक",
  CG: "काँगो",
  CH: "स्वित्झर्लंड",
  CI: "आयव्हरी कोस्ट",
  CK: "कुक द्वीप",
  CL: "चिली",
  CM: "कैमरून",
  CN: "चीन",
  CO: "कोलंबिया",
  CR: "कॉस्टा रिका",
  CU: "क्यूबा",
  CV: "केप वर्दे",
  CW: "कुराकाओ",
  CX: "क्रिसमस द्वीप",
  CY: "सायप्रस",
  CZ: "झेक प्रजासत्ताक",
  DE: "जर्मनी",
  DJ: "जिबूती",
  DK: "डेन्मार्क",
  DM: "डोमिनिका",
  DO: "डॉमिनिकन प्रजासत्ताक",
  DZ: "अल्जेरिया",
  EC: "इक्वेडोर",
  EE: "एस्टोनिया",
  EG: "इजिप्त",
  EH: "पश्चिम सहारा",
  ER: "इरिट्रिया",
  ES: "स्पेन",
  ET: "इथिओपिया",
  FI: "फिनलंड",
  FJ: "फिजी",
  FK: "फॉकलंड द्वीपसमूह (माल्विनास)",
  FM: "मायक्रोनेशिया (संघीय राज्ये)",
  FO: "फॅरो द्वीपसमूह",
  FR: "फ्रान्स",
  GA: "गॅबॉन",
  GB: "ग्रेट ब्रिटन व उत्तर आयर्लंडचे संयुक्त राजतंत्र",
  GD: "ग्रेनेडा",
  GE: "जॉर्जिया",
  GF: "फ्रेंच गयाना",
  GG: "ग्वेर्नसे",
  GH: "घाना",
  GI: "जिब्राल्टर",
  GL: "ग्रीनलँड",
  GM: "गांबिया",
  GN: "गिनी",
  GP: "ग्वाडेलूप",
  GQ: "इक्वेटोरियल गिनी",
  GR: "ग्रीस",
  GS: "दक्षिण जॉर्जिया आणि दक्षिण सँडविच द्वीपसमूह",
  GT: "ग्वाटेमाला",
  GU: "ग्वाम",
  GW: "गिनी-बिसाऊ",
  GY: "गयाना",
  HK: "हाँग काँग",
  HM: "हर्ड द्वीप व मॅकडॉनल्ड द्वीपसमूह",
  HN: "होंडुरास",
  HR: "क्रोएशिया",
  HT: "हैती",
  HU: "हंगेरी",
  ID: "इंडोनेशिया",
  IE: "आयर्लंड",
  IL: "इस्रायल",
  IM: "आइल ऑफ मॅन",
  IN: "भारत",
  IO: "ब्रिटीश हिंदी महासागर क्षेत्र",
  IQ: "इराक",
  IR: "इराण",
  IS: "आइसलँड",
  IT: "इटली",
  JE: "जर्सी",
  JM: "जमैका",
  JO: "जॉर्डन",
  JP: "जापान",
  KE: "केनिया",
  KG: "किर्गिझस्तान",
  KH: "कंबोडिया",
  KI: "किरिबाती",
  KM: "कोमोरोस",
  KN: "सेंट किट्स आणि नेव्हिस",
  KP: "उत्तर कोरिया",
  KR: "दक्षिण कोरिया",
  KW: "कुवेत",
  KY: "केमन द्वीपसमूह",
  KZ: "कझाकस्तान",
  LA: "लाओस",
  LB: "लेबनॉन",
  LC: "सेंट लुसिया",
  LI: "लिश्टनस्टाइन",
  LK: "श्रीलंका",
  LR: "लायबेरिया",
  LS: "लेसोथो",
  LT: "लिथुआनिया",
  LU: "लक्झेंबर्ग",
  LV: "लात्व्हिया",
  LY: "लिबिया",
  MA: "मोरोक्को",
  MC: "मोनॅको",
  MD: "मोल्दोव्हा प्रजासत्ताक",
  ME: "माँटेनिग्रो",
  MF: "सेंट मार्टिन",
  MG: "मादागास्कर",
  MH: "मार्शल द्वीपसमूह",
  MK: "उत्तर मॅसेडोनिया",
  ML: "माली",
  MM: "म्यानमार",
  MN: "मंगोलिया",
  MO: "मकाओ",
  MP: "उत्तर मारियाना द्वीपसमूह",
  MQ: "मार्टिनिक",
  MR: "मॉरिटानिया",
  MS: "माँटसेराट",
  MT: "माल्टा",
  MU: "मॉरिशस",
  MV: "मालदीव",
  MW: "मलावी",
  MX: "मेक्सिको",
  MY: "मलेशिया",
  MZ: "मोझांबिक",
  NA: "नामिबिया",
  NC: "न्यू कॅलिडोनिया",
  NE: "नायजर",
  NF: "नॉरफोक द्वीप",
  NG: "नायजेरिया",
  NI: "निकाराग्वा",
  NL: "नेदरलँड्स",
  NO: "नॉर्वे",
  NP: "नेपाळ",
  NR: "नौरू",
  NU: "नियू",
  NZ: "न्यूझीलंड",
  OM: "ओमान",
  PA: "पनामा",
  PE: "पेरू",
  PF: "फ्रेंच पॉलिनेशिया",
  PG: "पापुआ न्यू गिनी",
  PH: "फिलिपाईन्स",
  PK: "पाकिस्तान",
  PL: "पोलंड",
  PM: "सेंट पियरे आणि मिकेलॉन",
  PN: "पिटकेर्न द्वीपसमूह",
  PR: "पोर्तु रिको",
  PS: "पॅलेस्टाईन",
  PT: "पोर्तुगाल",
  PW: "पलाऊ",
  PY: "पॅराग्वे",
  QA: "कतार",
  RE: "रीयूनियन",
  RO: "रोमानिया",
  RS: "सर्बिया",
  RU: "रशिया",
  RW: "रवांडा",
  SA: "सौदी अरेबिया",
  SB: "सोलोमन द्वीपसमूह",
  SC: "सेशेल्स",
  SD: "सुदान",
  SE: "स्वीडन",
  SG: "सिंगापूर",
  SH: "सेंट हेलेना, असेन्शन आणि ट्रिस्टन दा कुन्हा",
  SI: "स्लोव्हेनिया",
  SJ: "स्वालबार्ड व यान मायेन",
  SK: "स्लोव्हाकिया",
  SL: "सिएरा लिओन",
  SM: "सॅन मारिनो",
  SN: "सेनेगल",
  SO: "सोमालिया",
  SR: "सुरिनाम",
  SS: "दक्षिण सुदान",
  ST: "साओ टोम आणि प्रिंसिपे",
  SV: "एल साल्वाडोर",
  SX: "सिंट मार्टेन",
  SY: "सीरिया",
  SZ: "इस्वातीनी",
  TC: "तुर्क आणि कैकोस द्वीपसमूह",
  TD: "चाड",
  TF: "फ्रान्सचे दक्षिणी व अंटार्क्टिक भूभाग",
  TG: "टोगो",
  TH: "थायलंड",
  TJ: "ताजिकिस्तान",
  TK: "टोकेलाऊ",
  TL: "पूर्व तिमोर",
  TM: "तुर्कमेनिस्तान",
  TN: "ट्युनिशिया",
  TO: "टोंगा",
  TR: "तुर्कस्तान",
  TT: "त्रिनिदाद आणि टोबॅगो",
  TV: "तुवालू",
  TW: "तैवान",
  TZ: "टांझानिया",
  UA: "युक्रेन",
  UG: "युगांडा",
  UM: "संयुक्त राज्य अमेरिकेचे छोटे दूरस्थ द्वीपसमूह",
  US: "अमेरिका",
  UY: "उरुग्वे",
  UZ: "उझबेकिस्तान",
  VA: "व्हॅटिकन सिटी",
  VC: "सेंट व्हिन्सेंट आणि ग्रेनेडीन्स",
  VE: "व्हेनेझुएला",
  VG: "ब्रिटीश व्हर्जिन द्वीपसमूह",
  VI: "अमेरिकी व्हर्जिन द्वीपसमूह",
  VN: "व्हिएतनाम",
  VU: "व्हानुआतू",
  WF: "वॉलिस आणि फ्युटुना",
  WS: "सामोआ",
  XK: "कोसोवो",
  YE: "यमनचे प्रजासत्ताक",
  YT: "मेयोट",
  ZA: "दक्षिण आफ्रिका",
  ZM: "झांबिया",
  ZW: "झिम्बाब्वे"
};
const mr = {
  locale: locale$u,
  countries: countries$u
};
const locale$t = "ms";
const countries$t = {
  AD: "Andorra",
  AE: "Emiriah Arab Bersatu",
  AF: "Afghanistan",
  AG: "Antigua dan Barbuda",
  AI: "Anguilla",
  AL: "Albania",
  AM: "Armenia",
  AO: "Angola",
  AQ: "Antartika",
  AR: "Argentina",
  AS: "Samoa Amerika",
  AT: "Austria",
  AU: "Australia",
  AW: "Aruba",
  AX: "Kepulauan Aland",
  AZ: "Azerbaijan",
  BA: "Bosnia dan Herzegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgium",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrain",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint Barthélemy",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivia",
  BQ: "Belanda Caribbean",
  BR: "Brazil",
  BS: "Bahamas",
  BT: "Bhutan",
  BV: "Pulau Bouvet",
  BW: "Botswana",
  BY: "Belarus",
  BZ: "Belize",
  CA: "Kanada",
  CC: "Kepulauan Cocos (Keeling)",
  CD: "Congo - Kinshasa",
  CF: "Republik Afrika Tengah",
  CG: "Congo - Brazzaville",
  CH: "Switzerland",
  CI: [
    "Cote d'Ivoire",
    "Côte d'Ivoire"
  ],
  CK: "Kepulauan Cook",
  CL: "Chile",
  CM: "Cameroon",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  CU: "Cuba",
  CV: "Cape Verde",
  CW: "Curacao",
  CX: "Pulau Krismas",
  CY: "Cyprus",
  CZ: "Czechia",
  DE: "Jerman",
  DJ: "Djibouti",
  DK: "Denmark",
  DM: "Dominica",
  DO: "Republik Dominica",
  DZ: "Algeria",
  EC: "Ecuador",
  EE: "Estonia",
  EG: "Mesir",
  EH: "Sahara Barat",
  ER: "Eritrea",
  ES: "Sepanyol",
  ET: "Ethiopia",
  FI: "Finland",
  FJ: "Fiji",
  FK: "Kepulauan Falkland",
  FM: "Micronesia",
  FO: "Kepulauan Faroe",
  FR: "Perancis",
  GA: "Gabon",
  GB: "United Kingdom",
  GD: "Grenada",
  GE: "Georgia",
  GF: "Guiana Perancis",
  GG: "Guernsey",
  GH: "Ghana",
  GI: "Gibraltar",
  GL: "Greenland",
  GM: "Gambia",
  GN: "Guinea",
  GP: "Guadeloupe",
  GQ: "Guinea Khatulistiwa",
  GR: "Greece",
  GS: "Kepulauan Georgia Selatan & Sandwich Selatan",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Guinea Bissau",
  GY: "Guyana",
  HK: "Hong Kong SAR China",
  HM: "Kepulauan Heard & McDonald",
  HN: "Honduras",
  HR: "Croatia",
  HT: "Haiti",
  HU: "Hungary",
  ID: "Indonesia",
  IE: "Ireland",
  IL: "Israel",
  IM: "Isle of Man",
  IN: "India",
  IO: "Wilayah Lautan Hindi British",
  IQ: "Iraq",
  IR: "Iran",
  IS: "Iceland",
  IT: "Itali",
  JE: "Jersey",
  JM: "Jamaica",
  JO: "Jordan",
  JP: "Jepun",
  KE: "Kenya",
  KG: "Kyrgyzstan",
  KH: "Kemboja",
  KI: "Kiribati",
  KM: "Comoros",
  KN: "Saint Kitts dan Nevis",
  KP: "Korea Utara",
  KR: "Korea Selatan",
  KW: "Kuwait",
  KY: "Kepulauan Cayman",
  KZ: "Kazakhstan",
  LA: "Laos",
  LB: "Lubnan",
  LC: "Saint Lucia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberia",
  LS: "Lesotho",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  LY: "Libya",
  MA: "Maghribi",
  MC: "Monaco",
  MD: "Moldova",
  ME: "Montenegro",
  MF: "Saint Martin",
  MG: "Madagaskar",
  MH: "Kepulauan Marshall",
  MK: "Macedonia",
  ML: "Mali",
  MM: "Myanmar (Burma)",
  MN: "Mongolia",
  MO: "Macau SAR China",
  MP: "Kepulauan Mariana Utara",
  MQ: "Martinique",
  MR: "Mauritania",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldives",
  MW: "Malawi",
  MX: "Mexico",
  MY: "Malaysia",
  MZ: "Mozambique",
  NA: "Namibia",
  NC: "New Caledonia",
  NE: "Niger",
  NF: "Pulau Norfolk",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Belanda",
  NO: "Norway",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "New Zealand",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "Polinesia Perancis",
  PG: "Papua New Guinea",
  PH: "Filipina",
  PK: "Pakistan",
  PL: "Poland",
  PM: "Saint Pierre dan Miquelon",
  PN: "Kepulauan Pitcairn",
  PR: "Puerto Rico",
  PS: "Wilayah Palestin",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Romania",
  RS: "Serbia",
  RU: "Rusia",
  RW: "Rwanda",
  SA: "Arab Saudi",
  SB: "Kepulauan Solomon",
  SC: "Seychelles",
  SD: "Sudan",
  SE: "Sweden",
  SG: "Singapura",
  SH: "Saint Helena",
  SI: "Slovenia",
  SJ: "Svalbard dan Jan Mayen",
  SK: "Slovakia",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalia",
  SR: "Surinam",
  SS: "Sudan Selatan",
  ST: "Sao Tome dan Principe",
  SV: "El Salvador",
  SX: "Sint Maarten",
  SY: "Syria",
  SZ: "Eswatini",
  TC: "Kepulauan Turks dan Caicos",
  TD: "Chad",
  TF: "Wilayah Selatan Perancis",
  TG: "Togo",
  TH: "Thailand",
  TJ: "Tajikistan",
  TK: "Tokelau",
  TL: "Timor-Leste",
  TM: "Turkmenistan",
  TN: "Tunisia",
  TO: "Tonga",
  TR: "Turki",
  TT: "Trinidad dan Tobago",
  TV: "Tuvalu",
  TW: "Taiwan",
  TZ: "Tanzania",
  UA: "Ukraine",
  UG: "Uganda",
  UM: "Kepulauan Terpencil A.S.",
  US: "Amerika Syarikat",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VA: "Kota Vatican",
  VC: "Saint Vincent dan Grenadines",
  VE: "Venezuela",
  VG: "Kepulauan Virgin British",
  VI: "Kepulauan Virgin A.S.",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis dan Futuna",
  WS: "Samoa",
  XK: "Kosovo",
  YE: "Yaman",
  YT: "Mayotte",
  ZA: "Afrika Selatan",
  ZM: "Zambia",
  ZW: "Zimbabwe"
};
const ms = {
  locale: locale$t,
  countries: countries$t
};
const locale$s = "mt";
const countries$s = {
  AF: "l-Afganistan",
  AL: "l-Albanija",
  DZ: "l-Alġerija",
  AS: "is-Samoa Amerikana",
  AD: "Andorra",
  AO: "l-Angola",
  AI: "Anguilla",
  AQ: "l-Antartika",
  AG: "Antigua u Barbuda",
  AR: "l-Arġentina",
  AM: "l-Armenja",
  AW: "Aruba",
  AU: "l-Awstralja",
  AT: "l-Awstrija",
  AZ: "l-Ażerbajġan",
  BS: "il-Bahamas",
  BH: "il-Bahrain",
  BD: "il-Bangladesh",
  BB: "Barbados",
  BY: "il-Belarussja",
  BE: "il-Belġju",
  BZ: "il-Belize",
  BJ: "il-Benin",
  BM: "Bermuda",
  BT: "il-Bhutan",
  BO: "il-Bolivja",
  BA: "il-Bożnija-Ħerzegovina",
  BW: "il-Botswana",
  BV: "Gżira Bouvet",
  BR: "Il-Brażil",
  IO: "Territorju Brittaniku tal-Oċean Indjan",
  BN: "il-Brunei",
  BG: "il-Bulgarija",
  BF: "il-Burkina Faso",
  BI: "il-Burundi",
  KH: "il-Kambodja",
  CM: "il-Kamerun",
  CA: "il-Kanada",
  CV: "Cape Verde",
  KY: "il-Gżejjer Cayman",
  CF: "ir-Repubblika Ċentru-Afrikana",
  TD: "iċ-Chad",
  CL: "iċ-Ċili",
  CN: "iċ-Ċina",
  CX: "il-Gżira Christmas",
  CC: "Gżejjer Cocos (Keeling)",
  CO: "il-Kolombja",
  KM: "Comoros",
  CG: "il-Kongo - Brazzaville",
  CD: "ir-Repubblika Demokratika tal-Kongo",
  CK: "Gżejjer Cook",
  CR: "il-Costa Rica",
  CI: "il-Kosta tal-Avorju",
  HR: "il-Kroazja",
  CU: "Kuba",
  CY: "Ċipru",
  CZ: "ir-Repubblika Ċeka",
  DK: "id-Danimarka",
  DJ: "il-Djibouti",
  DM: "Dominica",
  DO: "ir-Repubblika Dominicana",
  EC: "l-Ekwador",
  EG: "l-Eġittu",
  SV: "El Salvador",
  GQ: "il-Guinea Ekwatorjali",
  ER: "l-Eritrea",
  EE: "l-Estonja",
  ET: "l-Etjopja",
  FK: "il-Gżejjer Falkland",
  FO: "il-Gżejjer Faeroe",
  FJ: "Fiġi",
  FI: "il-Finlandja",
  FR: "Franza",
  GF: "il-Guyana Franċiża",
  PF: "Polineżja Franċiża",
  TF: "It-Territorji Franċiżi tan-Nofsinhar",
  GA: "il-Gabon",
  GM: "il-Gambja",
  GE: "il-Georgia",
  DE: "il-Ġermanja",
  GH: "il-Ghana",
  GI: "Ġibiltà",
  GR: "il-Greċja",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "il-Gwatemala",
  GN: "il-Guinea",
  GW: "il-Guinea-Bissau",
  GY: "il-Guyana",
  HT: "il-Haiti",
  HM: "il-Gżejjer Heard u l-Gżejjer McDonald",
  VA: "l-Istat tal-Belt tal-Vatikan",
  HN: "il-Honduras",
  HK: "ir-Reġjun Amministrattiv Speċjali ta’ Hong Kong tar-Repubblika tal-Poplu taċ-Ċina",
  HU: "l-Ungerija",
  IS: "l-Iżlanda",
  IN: "l-Indja",
  ID: "l-Indoneżja",
  IR: "l-Iran",
  IQ: "l-Iraq",
  IE: "l-Irlanda",
  IL: "Iżrael",
  IT: "l-Italja",
  JM: "il-Ġamajka",
  JP: "il-Ġappun",
  JO: "il-Ġordan",
  KZ: "il-Każakistan",
  KE: "il-Kenja",
  KI: "Kiribati",
  KP: "il-Korea ta’ Fuq",
  KR: "il-Korea t’Isfel",
  KW: "il-Kuwajt",
  KG: "il-Kirgiżistan",
  LA: "il-Laos",
  LV: "il-Latvja",
  LB: "il-Libanu",
  LS: "il-Lesoto",
  LR: "il-Liberja",
  LY: "il-Libja",
  LI: "il-Liechtenstein",
  LT: "il-Litwanja",
  LU: "il-Lussemburgu",
  MO: "ir-Reġjun Amministrattiv Speċjali tal-Macao tar-Repubblika tal-Poplu taċ-Ċina",
  MG: "Madagascar",
  MW: "il-Malawi",
  MY: "il-Malasja",
  MV: "il-Maldivi",
  ML: "il-Mali",
  MT: "Malta",
  MH: "Gżejjer Marshall",
  MQ: "Martinique",
  MR: "il-Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "il-Messiku",
  FM: "il-Mikroneżja",
  MD: "il-Moldova",
  MC: "Monaco",
  MN: "il-Mongolja",
  MS: "Montserrat",
  MA: "il-Marokk",
  MZ: "il-Mozambique",
  MM: "il-Myanmar/Burma",
  NA: "in-Namibja",
  NR: "Nauru",
  NP: "in-Nepal",
  NL: "in-Netherlands",
  NC: "New Caledonia",
  NZ: "New Zealand",
  NI: "in-Nikaragwa",
  NE: "in-Niġer",
  NG: "in-Niġerja",
  NU: "Niue",
  NF: "Gżira Norfolk",
  MK: "il-Maċedonja ta’ Fuq",
  MP: "Ġżejjer Mariana tat-Tramuntana",
  NO: "in-Norveġja",
  OM: "l-Oman",
  PK: "il-Pakistan",
  PW: "Palau",
  PS: "it-Territorji Palestinjani",
  PA: "il-Panama",
  PG: "Papua New Guinea",
  PY: "il-Paragwaj",
  PE: "il-Perù",
  PH: "il-Filippini",
  PN: "Gżejjer Pitcairn",
  PL: "il-Polonja",
  PT: "il-Portugall",
  PR: "Puerto Rico",
  QA: "il-Qatar",
  RE: "Réunion",
  RO: "ir-Rumanija",
  RU: "ir-Russja",
  RW: "ir-Rwanda",
  SH: "Saint Helena",
  KN: "Saint Kitts u Nevis",
  LC: "Saint Lucia",
  PM: "Saint Pierre u Miquelon",
  VC: "Saint Vincent u l-Grenadini",
  WS: "Samoa",
  SM: "San Marino",
  ST: "São Tomé u Príncipe",
  SA: "l-Arabja Sawdija",
  SN: "is-Senegal",
  SC: "is-Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "is-Slovakkja",
  SI: "is-Slovenja",
  SB: "il-Gżejjer Solomon",
  SO: "is-Somalja",
  ZA: "l-Afrika t’Isfel",
  GS: "il-Georgia tan-Nofsinhar u l-Gżejjer Sandwich tan-Nofsinhar",
  ES: "Spanja",
  LK: "is-Sri Lanka",
  SD: "is-Sudan",
  SR: "is-Suriname",
  SJ: "Svalbard u Jan Mayen",
  SZ: "l-Eswatini",
  SE: "l-Iżvezja",
  CH: "l-Iżvizzera",
  SY: "is-Sirja",
  TW: "it-Tajwan",
  TJ: "it-Taġikistan",
  TZ: "it-Tanzanija",
  TH: "it-Tajlandja",
  TL: "Timor Leste",
  TG: "it-Togo",
  TK: "it-Tokelau",
  TO: "Tonga",
  TT: "Trinidad u Tobago",
  TN: "it-Tuneżija",
  TR: "it-Turkija",
  TM: "it-Turkmenistan",
  TC: "il-Gżejjer Turks u Caicos",
  TV: "Tuvalu",
  UG: "l-Uganda",
  UA: "l-Ukrajna",
  AE: "l-Emirati Għarab Magħquda",
  GB: "ir-Renju Unit",
  US: [
    "l-Istati Uniti",
    "l-Istati Uniti tal-Amerka"
  ],
  UM: "Il-Gżejjer Minuri Mbiegħda tal-Istati Uniti",
  UY: "l-Urugwaj",
  UZ: "l-Użbekistan",
  VU: "Vanuatu",
  VE: "il-Venezwela",
  VN: "il-Vjetnam",
  VG: "il-Gżejjer Verġni Brittaniċi",
  VI: "il-Gżejjer Verġni tal-Istati Uniti",
  WF: "Wallis u Futuna",
  EH: "is-Saħara tal-Punent",
  YE: "il-Jemen",
  ZM: "iż-Żambja",
  ZW: "iż-Żimbabwe",
  AX: "il-Gżejjer Aland",
  BQ: "in-Netherlands tal-Karibew",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Isle of Man",
  JE: "Jersey",
  ME: "il-Montenegro",
  BL: "Saint Barthélemy",
  MF: "Saint Martin",
  RS: "is-Serbja",
  SX: "Sint Maarten",
  SS: "is-Sudan t’Isfel",
  XK: "il-Kosovo"
};
const mt = {
  locale: locale$s,
  countries: countries$s
};
const locale$r = "nb";
const countries$r = {
  AD: "Andorra",
  AE: "De forente arabiske emirater",
  AF: "Afghanistan",
  AG: "Antigua og Barbuda",
  AI: "Anguilla",
  AL: "Albania",
  AM: "Armenia",
  AO: "Angola",
  AQ: "Antarktis",
  AR: "Argentina",
  AS: "Amerikansk Samoa",
  AT: "Østerrike",
  AU: "Australia",
  AW: "Aruba",
  AX: "Åland",
  AZ: "Aserbajdsjan",
  BA: "Bosnia-Hercegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgia",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrain",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint-Barthélemy",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivia",
  BQ: "Karibisk Nederland",
  BR: "Brasil",
  BS: "Bahamas",
  BT: "Bhutan",
  BV: "Bouvetøya",
  BW: "Botswana",
  BY: "Hviterussland",
  BZ: "Belize",
  CA: "Canada",
  CC: "Kokosøyene",
  CD: "Kongo",
  CF: "Den sentralafrikanske republikk",
  CG: "Kongo-Brazzaville",
  CH: "Sveits",
  CI: "Elfenbenskysten",
  CK: "Cookøyene",
  CL: "Chile",
  CM: "Kamerun",
  CN: "Kina",
  CO: "Colombia",
  CR: "Costa Rica",
  CU: "Cuba",
  CV: "Kapp Verde",
  CW: "Curaçao",
  CX: "Christmasøya",
  CY: "Kypros",
  CZ: "Tsjekkia",
  DE: "Tyskland",
  DJ: "Djibouti",
  DK: "Danmark",
  DM: "Dominica",
  DO: "Den dominikanske republikk",
  DZ: "Algerie",
  EC: "Ecuador",
  EE: "Estland",
  EG: "Egypt",
  EH: "Vest-Sahara",
  ER: "Eritrea",
  ES: "Spania",
  ET: "Etiopia",
  FI: "Finland",
  FJ: "Fiji",
  FK: "Falklandsøyene",
  FM: "Mikronesiaføderasjonen",
  FO: "Færøyene",
  FR: "Frankrike",
  GA: "Gabon",
  GB: "Storbritannia",
  GD: "Grenada",
  GE: "Georgia",
  GF: "Fransk Guyana",
  GG: "Guernsey",
  GH: "Ghana",
  GI: "Gibraltar",
  GL: "Grønland",
  GM: "Gambia",
  GN: "Guinea",
  GP: "Guadeloupe",
  GQ: "Ekvatorial-Guinea",
  GR: "Hellas",
  GS: "Sør-Georgia og de søre Sandwichøyene",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HK: "Hongkong",
  HM: "Heard- og McDonald-øyene",
  HN: "Honduras",
  HR: "Kroatia",
  HT: "Haiti",
  HU: "Ungarn",
  ID: "Indonesia",
  IE: "Irland",
  IL: "Israel",
  IM: "Man",
  IN: "India",
  IO: "Britisk territorium i Indiahavet",
  IQ: "Irak",
  IR: "Iran",
  IS: "Island",
  IT: "Italia",
  JE: "Jersey",
  JM: "Jamaica",
  JO: "Jordan",
  JP: "Japan",
  KE: "Kenya",
  KG: "Kirgisistan",
  KH: "Kambodsja",
  KI: "Kiribati",
  KM: "Komorene",
  KN: "Saint Kitts og Nevis",
  KP: "Nord-Korea",
  KR: "Sør-Korea",
  KW: "Kuwait",
  KY: "Caymanøyene",
  KZ: "Kasakhstan",
  LA: "Laos",
  LB: "Libanon",
  LC: "Saint Lucia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberia",
  LS: "Lesotho",
  LT: "Litauen",
  LU: "Luxembourg",
  LV: "Latvia",
  LY: "Libya",
  MA: "Marokko",
  MC: "Monaco",
  MD: "Moldova",
  ME: "Montenegro",
  MF: "Saint-Martin",
  MG: "Madagaskar",
  MH: "Marshalløyene",
  MK: "Nord-Makedonia",
  ML: "Mali",
  MM: "Myanmar (Burma)",
  MN: "Mongolia",
  MO: "Macao",
  MP: "Nord-Marianene",
  MQ: "Martinique",
  MR: "Mauritania",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldivene",
  MW: "Malawi",
  MX: "Mexico",
  MY: "Malaysia",
  MZ: "Mosambik",
  NA: "Namibia",
  NC: "Ny-Caledonia",
  NE: "Niger",
  NF: "Norfolk Island",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Nederland",
  NO: "Norge",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "New Zealand",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "Fransk Polynesia",
  PG: "Papua Ny-Guinea",
  PH: "Filippinene",
  PK: "Pakistan",
  PL: "Polen",
  PM: "Saint-Pierre-et-Miquelon",
  PN: "Pitcairn",
  PR: "Puerto Rico",
  PS: "De okkuperte palestinske områdene",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Romania",
  RS: "Serbia",
  RU: "Russland",
  RW: "Rwanda",
  SA: "Saudi-Arabia",
  SB: "Salomonøyene",
  SC: "Seychellene",
  SD: "Sudan",
  SE: "Sverige",
  SG: "Singapore",
  SH: "St. Helena",
  SI: "Slovenia",
  SJ: "Svalbard og Jan Mayen",
  SK: "Slovakia",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalia",
  SR: "Surinam",
  SS: "Sør-Sudan",
  ST: "São Tomé og Príncipe",
  SV: "El Salvador",
  SX: "Sint Maarten (Nederlandsk del)",
  SY: "Syria",
  SZ: "Eswatini",
  TC: "Turks- og Caicosøyene",
  TD: "Tsjad",
  TF: "Søre franske territorier",
  TG: "Togo",
  TH: "Thailand",
  TJ: "Tadsjikistan",
  TK: "Tokelau",
  TL: "Øst-Timor",
  TM: "Turkmenistan",
  TN: "Tunisia",
  TO: "Tonga",
  TR: "Tyrkia",
  TT: "Trinidad og Tobago",
  TV: "Tuvalu",
  TW: "Taiwan",
  TZ: "Tanzania",
  UA: "Ukraina",
  UG: "Uganda",
  UM: "USA, mindre, utenforliggende øyer",
  US: "USA",
  UY: "Uruguay",
  UZ: "Usbekistan",
  VA: "Vatikanstaten",
  VC: "Saint Vincent og Grenadinene",
  VE: "Venezuela",
  VG: "Jomfruøyene (Britisk)",
  VI: "Jomfruøyene (USA)",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis- og Futunaøyene",
  WS: "Samoa",
  YE: "Jemen",
  YT: "Mayotte",
  ZA: "Sør-Afrika",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  XK: "Kosovo"
};
const nb = {
  locale: locale$r,
  countries: countries$r
};
const locale$q = "nl";
const countries$q = {
  AF: "Afghanistan",
  AL: "Albanië",
  DZ: "Algerije",
  AS: "Amerikaans-Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua en Barbuda",
  AR: "Argentinië",
  AM: "Armenië",
  AW: "Aruba",
  AU: "Australië",
  AT: "Oostenrijk",
  AZ: "Azerbeidzjan",
  BS: "Bahama's",
  BH: "Bahrein",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Wit-Rusland",
  BE: [
    "België",
    "Koninkrijk België"
  ],
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivië",
  BA: "Bosnië-Herzegovina",
  BW: "Botswana",
  BV: "Bouvet Eiland",
  BR: "Brazilië",
  IO: "Brits Indische oceaan",
  BN: "Brunei Darussalam",
  BG: "Bulgarije",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodja",
  CM: "Kameroen",
  CA: "Canada",
  CV: "Kaapverdië",
  KY: "Kaaimaneilanden",
  CF: "Centraal-Afrikaanse Republiek",
  TD: "Tsjaad",
  CL: "Chili",
  CN: "China",
  CX: "Christmaseiland",
  CC: "Cocoseilanden",
  CO: "Colombia",
  KM: "Comoren",
  CG: "Congo, Volksrepubliek",
  CD: "Congo, Democratische Republiek",
  CK: "Cookeilanden",
  CR: "Costa Rica",
  CI: "Ivoorkust",
  HR: "Kroatië",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Tsjechië",
  DK: "Denemarken",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominicaanse Republiek",
  EC: "Ecuador",
  EG: "Egypte",
  SV: "El Salvador",
  GQ: "Equatoriaal-Guinea",
  ER: "Eritrea",
  EE: "Estland",
  ET: "Ethiopië",
  FK: "Falklandeilanden",
  FO: "Faeröer",
  FJ: "Fiji",
  FI: "Finland",
  FR: "Frankrijk",
  GF: "Frans-Guyana",
  PF: "Frans-Polynesië",
  TF: "Franse Zuidelijke Gebieden",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgië",
  DE: "Duitsland",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Griekenland",
  GL: "Groenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinee-Bissau",
  GY: "Guyana",
  HT: "Haïti",
  HM: "Heard en McDonaldeilanden",
  VA: "Heilige Stoel",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hongarije",
  IS: "IJsland",
  IN: "India",
  ID: "Indonesië",
  IR: "Iran",
  IQ: "Irak",
  IE: "Ierland",
  IL: "Israël",
  IT: "Italië",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordanië",
  KZ: "Kazachstan",
  KE: "Kenia",
  KI: "Kiribati",
  KP: "Noord-Korea",
  KR: "Zuid-Korea",
  KW: "Koeweit",
  KG: "Kirgizstan",
  LA: "Laos",
  LV: "Letland",
  LB: "Libanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libië",
  LI: "Liechtenstein",
  LT: "Litouwen",
  LU: "Luxemburg",
  MO: "Macao",
  MG: "Madagaskar",
  MW: "Malawi",
  MY: "Maleisië",
  MV: [
    "Maldiven",
    "Malediven"
  ],
  ML: "Mali",
  MT: "Malta",
  MH: "Marshalleilanden",
  MQ: "Martinique",
  MR: "Mauritanië",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Micronesië, Federale Staten",
  MD: "Moldavië",
  MC: "Monaco",
  MN: "Mongolië",
  MS: "Montserrat",
  MA: "Marokko",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibië",
  NR: "Nauru",
  NP: "Nepal",
  NL: [
    "Nederland",
    "Koninkrijk der Nederlanden"
  ],
  NC: "Nieuw-Caledonië",
  NZ: "Nieuw-Zeeland",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk",
  MP: "Noordelijke Marianen",
  MK: "Noord-Macedonië",
  NO: "Noorwegen",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestina",
  PA: "Panama",
  PG: "Papoea-Nieuw-Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Filipijnen",
  PN: "Pitcairn",
  PL: "Polen",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Roemenië",
  RU: "Rusland",
  RW: "Rwanda",
  SH: "Sint-Helena",
  KN: "Saint Kitts en Nevis",
  LC: "Saint Lucia",
  PM: "Saint-Pierre en Miquelon",
  VC: "Saint Vincent en de Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "São Tomé en Principe",
  SA: "Saudi-Arabië",
  SN: "Senegal",
  SC: "Seychellen",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slowakije",
  SI: "Slovenië",
  SB: "Salomonseilanden",
  SO: "Somalië",
  ZA: "Zuid-Afrika",
  GS: "Zuid-Georgia en de Zuidelijke Sandwicheilanden",
  ES: "Spanje",
  LK: "Sri Lanka",
  SD: "Soedan",
  SR: "Suriname",
  SJ: "Spitsbergen en Jan Mayen",
  SZ: "Ngwane, Koninkrijk Eswatini",
  SE: "Zweden",
  CH: "Zwitserland",
  SY: "Syrië",
  TW: "Taiwan",
  TJ: "Tadzjikistan",
  TZ: [
    "Tanzania",
    "Tanzania, Verenigde Republiek"
  ],
  TH: "Thailand",
  TL: "Timor Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad en Tobago",
  TN: "Tunesië",
  TR: "Turkije",
  TM: "Turkmenistan",
  TC: "Turks- en Caicoseilanden",
  TV: "Tuvalu",
  UG: "Oeganda",
  UA: "Oekraïne",
  AE: "Verenigde Arabische Emiraten",
  GB: [
    "Groot-Brittannië",
    "Verenigd Koninkrijk"
  ],
  US: [
    "Verenigde Staten van Amerika",
    "Verenigde Staten"
  ],
  UM: "Ver afgelegen eilandjes van de Verenigde Staten",
  UY: "Uruguay",
  UZ: "Oezbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "Maagdeneilanden, Britse",
  VI: "Maagdeneilanden, Amerikaanse",
  WF: "Wallis en Futuna",
  EH: "Westelijke Sahara",
  YE: "Jemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Åland",
  BQ: "Bonaire, Sint Eustatius en Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Man Eiland",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint Barthélemy",
  MF: [
    "Sint-Maarten (Frans deel)",
    "Sint-Maarten (Franse Antillen)",
    "Collectiviteit van Sint-Maarten"
  ],
  RS: "Servië",
  SX: [
    "Sint Maarten",
    "Sint-Maarten",
    "Sint Maarten (Nederlands deel)",
    "Land Sint Maarten"
  ],
  SS: "Zuid-Soedan",
  XK: "Kosovo"
};
const nl = {
  locale: locale$q,
  countries: countries$q
};
const locale$p = "nn";
const countries$p = {
  AD: "Andorra",
  AE: "Dei sameinte arabiske emirata",
  AF: "Afghanistan",
  AG: "Antigua og Barbuda",
  AI: "Anguilla",
  AL: "Albania",
  AM: "Armenia",
  AO: "Angola",
  AQ: "Antarktis",
  AR: "Argentina",
  AS: "Amerikansk Samoa",
  AT: "Austerrike",
  AU: "Australia",
  AW: "Aruba",
  AX: "Åland",
  AZ: "Aserbajdsjan",
  BA: "Bosnia-Hercegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgia",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrain",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint-Barthélemy",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivia",
  BQ: "Karibisk Nederland",
  BR: "Brasil",
  BS: "Bahamas",
  BT: "Bhutan",
  BV: "Bouvetøya",
  BW: "Botswana",
  BY: "Kviterussland",
  BZ: "Belize",
  CA: "Canada",
  CC: "Kokosøyane",
  CD: "Kongo",
  CF: "Den sentralafrikanske republikken",
  CG: "Kongo-Brazzaville",
  CH: "Sveits",
  CI: "Elfenbeinskysten",
  CK: "Cookøyane",
  CL: "Chile",
  CM: "Kamerun",
  CN: "Kina",
  CO: "Colombia",
  CR: "Costa Rica",
  CU: "Cuba",
  CV: "Kapp Verde",
  CW: "Curaçao",
  CX: "Christmasøya",
  CY: "Kypros",
  CZ: "Tsjekkia",
  DE: "Tyskland",
  DJ: "Djibouti",
  DK: "Danmark",
  DM: "Dominica",
  DO: "Den dominikanske republikken",
  DZ: "Algerie",
  EC: "Ecuador",
  EE: "Estland",
  EG: "Egypt",
  EH: "Vest-Sahara",
  ER: "Eritrea",
  ES: "Spania",
  ET: "Etiopia",
  FI: "Finland",
  FJ: "Fiji",
  FK: "Falklandsøyane",
  FM: "Mikronesiaføderasjonen",
  FO: "Færøyane",
  FR: "Frankrike",
  GA: "Gabon",
  GB: "Storbritannia",
  GD: "Grenada",
  GE: "Georgia",
  GF: "Fransk Guyana",
  GG: "Guernsey",
  GH: "Ghana",
  GI: "Gibraltar",
  GL: "Grønland",
  GM: "Gambia",
  GN: "Guinea",
  GP: "Guadeloupe",
  GQ: "Ekvatorial-Guinea",
  GR: "Hellas",
  GS: "Sør-Georgia og de søre Sandwichøyane",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HK: "Hongkong",
  HM: "Heard- og McDonald-øyane",
  HN: "Honduras",
  HR: "Kroatia",
  HT: "Haiti",
  HU: "Ungarn",
  ID: "Indonesia",
  IE: "Irland",
  IL: "Israel",
  IM: "Man",
  IN: "India",
  IO: "Britisk territorium i Indiahavet",
  IQ: "Irak",
  IR: "Iran",
  IS: "Island",
  IT: "Italia",
  JE: "Jersey",
  JM: "Jamaica",
  JO: "Jordan",
  JP: "Japan",
  KE: "Kenya",
  KG: "Kirgisistan",
  KH: "Kambodsja",
  KI: "Kiribati",
  KM: "Komorane",
  KN: "Saint Kitts og Nevis",
  KP: "Nord-Korea",
  KR: "Sør-Korea",
  KW: "Kuwait",
  KY: "Caymanøyane",
  KZ: "Kasakhstan",
  LA: "Laos",
  LB: "Libanon",
  LC: "Saint Lucia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberia",
  LS: "Lesotho",
  LT: "Litauen",
  LU: "Luxembourg",
  LV: "Latvia",
  LY: "Libya",
  MA: "Marokko",
  MC: "Monaco",
  MD: "Moldova",
  ME: "Montenegro",
  MF: "Saint-Martin",
  MG: "Madagaskar",
  MH: "Marshalløyane",
  MK: "Nord-Makedonia",
  ML: "Mali",
  MM: "Myanmar (Burma)",
  MN: "Mongolia",
  MO: "Macao",
  MP: "Nord-Marianane",
  MQ: "Martinique",
  MR: "Mauritania",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldivane",
  MW: "Malawi",
  MX: "Mexico",
  MY: "Malaysia",
  MZ: "Mosambik",
  NA: "Namibia",
  NC: "Ny-Caledonia",
  NE: "Niger",
  NF: "Norfolk Island",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Nederland",
  NO: "Noreg",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "New Zealand",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "Fransk Polynesia",
  PG: "Papua Ny-Guinea",
  PH: "Filippinane",
  PK: "Pakistan",
  PL: "Polen",
  PM: "Saint-Pierre-et-Miquelon",
  PN: "Pitcairn",
  PR: "Puerto Rico",
  PS: "Dei okkuperte palestinske områda",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Romania",
  RS: "Serbia",
  RU: "Russland",
  RW: "Rwanda",
  SA: "Saudi-Arabia",
  SB: "Salomonøyane",
  SC: "Seychellane",
  SD: "Sudan",
  SE: "Sverige",
  SG: "Singapore",
  SH: "St. Helena",
  SI: "Slovenia",
  SJ: "Svalbard og Jan Mayen",
  SK: "Slovakia",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalia",
  SR: "Surinam",
  SS: "Sør-Sudan",
  ST: "São Tomé og Príncipe",
  SV: "El Salvador",
  SX: "Sint Maarten (Nederlandsk del)",
  SY: "Syria",
  SZ: "Eswatini",
  TC: "Turks- og Caicosøyane",
  TD: "Tsjad",
  TF: "Søre franske territorier",
  TG: "Togo",
  TH: "Thailand",
  TJ: "Tadsjikistan",
  TK: "Tokelau",
  TL: "Aust-Timor",
  TM: "Turkmenistan",
  TN: "Tunisia",
  TO: "Tonga",
  TR: "Tyrkia",
  TT: "Trinidad og Tobago",
  TV: "Tuvalu",
  TW: "Taiwan",
  TZ: "Tanzania",
  UA: "Ukraina",
  UG: "Uganda",
  UM: "USA, mindre, utanforliggande øyar",
  US: "USA",
  UY: "Uruguay",
  UZ: "Usbekistan",
  VA: "Vatikanstaten",
  VC: "Saint Vincent og Grenadinane",
  VE: "Venezuela",
  VG: "Jomfruøyane (Britisk)",
  VI: "Jomfruøyane (USA)",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis- og Futunaøyane",
  WS: "Samoa",
  YE: "Jemen",
  YT: "Mayotte",
  ZA: "Sør-Afrika",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  XK: "Kosovo"
};
const nn = {
  locale: locale$p,
  countries: countries$p
};
const locale$o = "no";
const countries$o = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algerie",
  AS: "Amerikansk Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarktis",
  AG: "Antigua og Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Østerrike",
  AZ: "Aserbajdsjan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Hviterussland",
  BE: "Belgia",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia-Hercegovina",
  BW: "Botswana",
  BV: "Bouvetøya",
  BR: "Brasil",
  IO: "Det britiske territoriet i Indiahavet",
  BN: "Brunei",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Kambodsja",
  CM: "Kamerun",
  CA: "Canada",
  CV: "Kapp Verde",
  KY: "Caymanøyene",
  CF: "Den sentralafrikanske republikk",
  TD: "Tsjad",
  CL: "Chile",
  CN: "Kina",
  CX: "Christmasøya",
  CC: "Kokosøyene",
  CO: "Colombia",
  KM: "Komorene",
  CG: "Kongo-Brazzaville",
  CD: "Kongo",
  CK: "Cookøyene",
  CR: "Costa Rica",
  CI: "Elfenbenskysten",
  HR: "Kroatia",
  CU: "Cuba",
  CY: "Kypros",
  CZ: "Tsjekkia",
  DK: "Danmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Den dominikanske republikk",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Ekvatorial-Guinea",
  ER: "Eritrea",
  EE: "Estland",
  ET: "Etiopia",
  FK: "Falklandsøyene",
  FO: "Færøyene",
  FJ: "Fiji",
  FI: "Finland",
  FR: "Frankrike",
  GF: "Fransk Guyana",
  PF: "Fransk Polynesia",
  TF: "De franske sørterritorier",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Tyskland",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Hellas",
  GL: "Grønland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard- og McDonaldøyene",
  VA: "Vatikanstaten",
  HN: "Honduras",
  HK: "Hongkong SAR Kina",
  HU: "Ungarn",
  IS: "Island",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Irak",
  IE: "Irland",
  IL: "Israel",
  IT: "Italia",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kasakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Nord-Korea",
  KR: "Sør-Korea",
  KW: "Kuwait",
  KG: "Kirgisistan",
  LA: "Laos",
  LV: "Latvia",
  LB: "Libanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Litauen",
  LU: "Luxemburg",
  MO: "Macao SAR Kina",
  MG: "Madagaskar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldivene",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshalløyene",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Mikronesiaføderasjonen",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Marokko",
  MZ: "Mosambik",
  MM: "Myanmar (Burma)",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Nederland",
  NC: "Ny-Caledonia",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolkøya",
  MK: "Nord-Makedonia",
  MP: "Nord-Marianene",
  NO: "Norge",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Det palestinske området",
  PA: "Panama",
  PG: "Papua Ny-Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Filippinene",
  PN: "Pitcairnøyene",
  PL: "Polen",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Romania",
  RU: "Russland",
  RW: "Rwanda",
  SH: "St. Helena",
  KN: "Saint Kitts og Nevis",
  LC: "St. Lucia",
  PM: "Saint-Pierre-et-Miquelon",
  VC: "St. Vincent og Grenadinene",
  WS: "Samoa",
  SM: "San Marino",
  ST: "São Tomé og Príncipe",
  SA: "Saudi-Arabia",
  SN: "Senegal",
  SC: "Seychellene",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Salomonøyene",
  SO: "Somalia",
  ZA: "Sør-Afrika",
  GS: "Sør-Georgia og Sør-Sandwichøyene",
  ES: "Spania",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Surinam",
  SJ: "Svalbard og Jan Mayen",
  SZ: "Eswatini",
  SE: "Sverige",
  CH: "Sveits",
  SY: "Syria",
  TW: "Taiwan",
  TJ: "Tadsjikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Øst-Timor",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad og Tobago",
  TN: "Tunisia",
  TR: "Tyrkia",
  TM: "Turkmenistan",
  TC: "Turks- og Caicosøyene",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraina",
  AE: "De forente arabiske emirater",
  GB: "Storbritannia",
  US: "USA",
  UM: "USAs ytre øyer",
  UY: "Uruguay",
  UZ: "Usbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "De britiske jomfruøyene",
  VI: "De amerikanske jomfruøyene",
  WF: "Wallis og Futuna",
  EH: "Vest-Sahara",
  YE: "Jemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Åland",
  BQ: "Karibisk Nederland",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint-Barthélemy",
  MF: "Saint-Martin",
  RS: "Serbia",
  SX: "Sint Maarten",
  SS: "Sør-Sudan",
  XK: "Kosovo"
};
const no = {
  locale: locale$o,
  countries: countries$o
};
const locale$n = "pl";
const countries$n = {
  AF: "Afganistan",
  AL: "Albania",
  DZ: "Algieria",
  AS: "Samoa Amerykańskie",
  AD: "Andora",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarktyka",
  AG: "Antigua i Barbuda",
  AR: "Argentyna",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbejdżan",
  BS: "Bahamy",
  BH: "Bahrajn",
  BD: "Bangladesz",
  BB: "Barbados",
  BY: "Białoruś",
  BE: "Belgia",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermudy",
  BT: "Bhutan",
  BO: "Boliwia",
  BA: "Bośnia i Hercegowina",
  BW: "Botswana",
  BV: "Wyspa Bouveta",
  BR: "Brazylia",
  IO: "Brytyjskie Terytorium Oceanu Indyjskiego",
  BN: "Brunei",
  BG: "Bułgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Kambodża",
  CM: "Kamerun",
  CA: "Kanada",
  CV: "Republika Zielonego Przylądka",
  KY: "Kajmany",
  CF: "Republika Środkowoafrykańska",
  TD: "Czad",
  CL: "Chile",
  CN: "Chiny",
  CX: "Wyspa Bożego Narodzenia",
  CC: "Wyspy Kokosowe",
  CO: "Kolumbia",
  KM: "Komory",
  CG: "Kongo",
  CD: "Demokratyczna Republika Konga",
  CK: "Wyspy Cooka",
  CR: "Kostaryka",
  CI: "Wybrzeże Kości Słoniowej",
  HR: "Chorwacja",
  CU: "Kuba",
  CY: "Cypr",
  CZ: "Czechy",
  DK: "Dania",
  DJ: "Dżibuti",
  DM: "Dominika",
  DO: "Dominikana",
  EC: "Ekwador",
  EG: "Egipt",
  SV: "Salwador",
  GQ: "Gwinea Równikowa",
  ER: "Erytrea",
  EE: "Estonia",
  ET: "Etiopia",
  FK: "Falklandy",
  FO: "Wyspy Owcze",
  FJ: "Fidżi",
  FI: "Finlandia",
  FR: "Francja",
  GF: "Gujana Francuska",
  PF: "Polinezja Francuska",
  TF: "Francuskie Terytoria Południowe i Antarktyczne",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Gruzja",
  DE: "Niemcy",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Grecja",
  GL: "Grenlandia",
  GD: "Grenada",
  GP: "Gwadelupa",
  GU: "Guam",
  GT: "Gwatemala",
  GN: "Gwinea",
  GW: "Gwinea Bissau",
  GY: "Gujana",
  HT: "Haiti",
  HM: "Wyspy Heard i McDonalda",
  VA: "Watykan",
  HN: "Honduras",
  HK: "Hongkong",
  HU: "Węgry",
  IS: "Islandia",
  IN: "Indie",
  ID: "Indonezja",
  IR: "Iran",
  IQ: "Irak",
  IE: "Irlandia",
  IL: "Izrael",
  IT: "Włochy",
  JM: "Jamajka",
  JP: "Japonia",
  JO: "Jordania",
  KZ: "Kazachstan",
  KE: "Kenia",
  KI: "Kiribati",
  KP: "Korea Północna",
  KR: "Korea Południowa",
  KW: "Kuwejt",
  KG: "Kirgistan",
  LA: "Laos",
  LV: "Łotwa",
  LB: "Liban",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libia",
  LI: "Liechtenstein",
  LT: "Litwa",
  LU: "Luksemburg",
  MO: "Makau",
  MK: "Macedonia Północna",
  MG: "Madagaskar",
  MW: "Malawi",
  MY: "Malezja",
  MV: "Malediwy",
  ML: "Mali",
  MT: "Malta",
  MH: "Wyspy Marshalla",
  MQ: "Martynika",
  MR: "Mauretania",
  MU: "Mauritius",
  YT: "Majotta",
  MX: "Meksyk",
  FM: "Mikronezja",
  MD: "Mołdawia",
  MC: "Monako",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Maroko",
  MZ: "Mozambik",
  MM: "Mjanma",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Holandia",
  NC: "Nowa Kaledonia",
  NZ: "Nowa Zelandia",
  NI: "Nikaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk",
  MP: "Mariany Północne",
  NO: "Norwegia",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestyna",
  PA: "Panama",
  PG: "Papua-Nowa Gwinea",
  PY: "Paragwaj",
  PE: "Peru",
  PH: "Filipiny",
  PN: "Pitcairn",
  PL: "Polska",
  PT: "Portugalia",
  PR: "Portoryko",
  QA: "Katar",
  RE: "Reunion",
  RO: "Rumunia",
  RU: "Rosja",
  RW: "Rwanda",
  SH: "Wyspa Świętej Heleny, Wyspa Wniebowstąpienia i Tristan da Cunha",
  KN: "Saint Kitts i Nevis",
  LC: "Saint Lucia",
  PM: "Saint-Pierre i Miquelon",
  VC: "Saint Vincent i Grenadyny",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Wyspy Świętego Tomasza i Książęca",
  SA: "Arabia Saudyjska",
  SN: "Senegal",
  SC: "Seszele",
  SL: "Sierra Leone",
  SG: "Singapur",
  SK: "Słowacja",
  SI: "Słowenia",
  SB: "Wyspy Salomona",
  SO: "Somalia",
  ZA: "Południowa Afryka",
  GS: "Georgia Południowa i Sandwich Południowy",
  ES: "Hiszpania",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Surinam",
  SJ: "Svalbard i Jan Mayen",
  SZ: "Eswatini",
  SE: "Szwecja",
  CH: "Szwajcaria",
  SY: "Syria",
  TW: "Tajwan",
  TJ: "Tadżykistan",
  TZ: "Tanzania",
  TH: "Tajlandia",
  TL: "Timor Wschodni",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trynidad i Tobago",
  TN: "Tunezja",
  TR: "Turcja",
  TM: "Turkmenistan",
  TC: "Turks i Caicos",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraina",
  AE: "Zjednoczone Emiraty Arabskie",
  GB: "Wielka Brytania",
  US: "Stany Zjednoczone",
  UM: "Dalekie Wyspy Mniejsze Stanów Zjednoczonych",
  UY: "Urugwaj",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Wenezuela",
  VN: "Wietnam",
  VG: "Brytyjskie Wyspy Dziewicze",
  VI: "Wyspy Dziewicze Stanów Zjednoczonych",
  WF: "Wallis i Futuna",
  EH: "Sahara Zachodnia",
  YE: "Jemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Wyspy Alandzkie",
  BQ: "Bonaire, Sint Eustatius i Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Wyspa Man",
  JE: "Jersey",
  ME: "Czarnogóra",
  BL: "Saint-Barthélemy",
  MF: "Saint-Martin",
  RS: "Serbia",
  SX: "Sint Maarten",
  SS: "Sudan Południowy",
  XK: "Kosowo"
};
const pl = {
  locale: locale$n,
  countries: countries$n
};
const locale$m = "ps";
const countries$m = {
  AF: "افغانستان",
  AL: "البانیه",
  DZ: "الجزایر",
  AS: "امریکایی ساماوا",
  AD: "اندورا",
  AO: "انګولا",
  AI: "انګیلا",
  AQ: "انتارکتیکا",
  AG: "انټيګوا او باربودا",
  AR: "ارجنټاين",
  AM: "ارمنستان",
  AW: "آروبا",
  AU: "آسټرالیا",
  AT: "اتریش",
  AZ: "اذربايجان",
  BS: "باهماس",
  BH: "بحرين",
  BD: "بنگله دېش",
  BB: "باربادوس",
  BY: "بیلاروس",
  BE: "بیلجیم",
  BZ: "بلیز",
  BJ: "بینن",
  BM: "برمودا",
  BT: "بهوټان",
  BO: "بولیویا",
  BA: "بوسنيا او هېرزګوينا",
  BW: "بوتسوانه",
  BV: "بوویټ ټاپو",
  BR: "برازیل",
  IO: "د برتانوي هند سمندري سيمه",
  BN: "برونائي",
  BG: "بلغاریه",
  BF: "بورکینا فاسو",
  BI: "بروندي",
  KH: "کمبودیا",
  CM: "کامرون",
  CA: "کاناډا",
  CV: "کیپ ورد",
  KY: "کیمان ټاپوګان",
  CF: "وسطي افريقا جمهور",
  TD: "چاډ",
  CL: "چیلي",
  CN: "چین",
  CX: "د کريسمس ټاپو",
  CC: "کوکوز (کيلنګ) ټاپوګان",
  CO: "کولمبیا",
  KM: "کوموروس",
  CG: "کانګو - بروزوییل",
  CD: "کانګو - کینشاسا",
  CK: "کوک ټاپوګان",
  CR: "کوستاریکا",
  CI: "د عاج ساحل",
  HR: "کرواشيا",
  CU: "کیوبا",
  CY: "قبرس",
  CZ: "چکیا",
  DK: "ډنمارک",
  DJ: "جبوتي",
  DM: "دومینیکا",
  DO: "جمهوريه ډومينيکن",
  EC: "اکوادور",
  EG: "مصر",
  SV: "سالوېډور",
  GQ: "استوایی ګیني",
  ER: "اریتره",
  EE: "استونیا",
  ET: "حبشه",
  FK: "فاکلينډ ټاپوګان",
  FO: "فارو ټاپو",
  FJ: "فجي",
  FI: "فنلینډ",
  FR: "فرانسه",
  GF: "فرانسوي ګانا",
  PF: "فرانسوي پولينيسيا",
  TF: "د فرانسې جنوبي سیمې",
  GA: "ګابن",
  GM: "ګامبیا",
  GE: "گورجستان",
  DE: "المان",
  GH: "ګانا",
  GI: "جبل الطارق",
  GR: "یونان",
  GL: "ګرینلینډ",
  GD: "ګرنادا",
  GP: "ګوادلوپ",
  GU: "ګوام",
  GT: "ګواتیمالا",
  GN: "ګینه",
  GW: "ګینه بیسو",
  GY: "ګیانا",
  HT: "هایټي",
  HM: "هارډ او ميکډانلډ ټاپوګان",
  VA: "واتیکان ښار",
  HN: "هانډوراس",
  HK: "هانګ کانګ SAR چین",
  HU: "مجارستان",
  IS: "آیسلینډ",
  IN: "هند",
  ID: "اندونیزیا",
  IR: "ايران",
  IQ: "عراق",
  IE: "آيرلېنډ",
  IL: "اسراييل",
  IT: "ایټالیه",
  JM: "جمیکا",
  JP: "جاپان",
  JO: "اردن",
  KZ: "قزاقستان",
  KE: "کینیا",
  KI: "کیري باتي",
  KP: "شمالی کوریا",
  KR: "سویلي کوریا",
  KW: "کويت",
  KG: "قرغزستان",
  LA: "لاوس",
  LV: "ليتهويا",
  LB: "لبنان",
  LS: "لسوتو",
  LR: "لايبيريا",
  LY: "لیبیا",
  LI: "لیختن اشتاین",
  LT: "لیتوانیا",
  LU: "لوګزامبورګ",
  MO: "مکاو SAR چین",
  MG: "مدغاسکر",
  MW: "مالاوي",
  MY: "مالیزیا",
  MV: "مالديپ",
  ML: "مالي",
  MT: "مالټا",
  MH: "مارشل ټاپوګان",
  MQ: "مارټینیک",
  MR: "موریتانیا",
  MU: "موریشیس",
  YT: "مايوټ",
  MX: "میکسیکو",
  FM: "میکرونیزیا",
  MD: "مولدوا",
  MC: "موناکو",
  MN: "منګوليا",
  MS: "مانټیسیرت",
  MA: "مراکش",
  MZ: "موزمبيق",
  MM: "ميانمار (برما)",
  NA: "نیمبیا",
  NR: "نایرو",
  NP: "نیپال",
  NL: "هالېنډ",
  NC: "نوی کالیډونیا",
  NZ: "نیوزیلنډ",
  NI: "نکاراګوا",
  NE: "نايجير",
  NG: "نایجیریا",
  NU: "نیوو",
  NF: "نارفولک ټاپوګان",
  MK: "شمالي مقدونيه",
  MP: "شمالي ماريانا ټاپوګان",
  NO: "ناروۍ",
  OM: "عمان",
  PK: "پاکستان",
  PW: "پلاؤ",
  PS: "فلسطیني سيمې",
  PA: "پاناما",
  PG: "پاپوا نيو ګيني",
  PY: "پاراګوی",
  PE: "پیرو",
  PH: "فلپين",
  PN: "پيټکيرن ټاپوګان",
  PL: "پولنډ",
  PT: "پورتګال",
  PR: "پورتو ریکو",
  QA: "قطر",
  RE: "ریونین",
  RO: "رومانیا",
  RU: "روسیه",
  RW: "روندا",
  SH: "سینټ هیلینا",
  KN: "سینټ کټس او نیویس",
  LC: "سینټ لوسیا",
  PM: "سینټ پییر او میکولون",
  VC: "سینټ ویسنټینټ او ګرینډینز",
  WS: "ساماوا",
  SM: "سان مارینو",
  ST: "ساو ټیم او پرنسیپ",
  SA: "سعودي عربستان",
  SN: "سينيګال",
  SC: "سیچیلیس",
  SL: "سییرا لیون",
  SG: "سينگاپور",
  SK: "سلواکیا",
  SI: "سلوانیا",
  SB: "سليمان ټاپوګان",
  SO: "سومالیا",
  ZA: "سویلي افریقا",
  GS: "سويلي جارجيا او سويلي سېنډوچ ټاپوګان",
  ES: "هسپانیه",
  LK: "سريلنکا",
  SD: "سوډان",
  SR: "سورینام",
  SJ: "سوالبارد او جان ميين",
  SZ: "اسواټيني",
  SE: "سویډن",
  CH: "سویس",
  SY: "سوریه",
  TW: "تائيوان",
  TJ: "تاجکستان",
  TZ: "تنزانیا",
  TH: "تهايلنډ",
  TL: "تيمور-ليسټ",
  TG: "ټوګو",
  TK: "توکیلو",
  TO: "تونګا",
  TT: "ټرينيډاډ او ټوباګو",
  TN: "تونس",
  TR: "ترکي",
  TM: "تورکمنستان",
  TC: "د ترکیې او کیکاسو ټاپو",
  TV: "توالیو",
  UG: "یوګانډا",
  UA: "اوکراین",
  AE: "متحده عرب امارات",
  GB: "برتانیه",
  US: "متحده آيالات",
  UM: "د متحده ایالاتو ټاپوګان",
  UY: "یوروګوی",
  UZ: "اوزبکستان",
  VU: "واناتو",
  VE: "وینزویلا",
  VN: "وېتنام",
  VG: "بریتانوی ویګور ټاپوګان",
  VI: "د متحده آيالاتو ورجن ټاپوګان",
  WF: "والیس او فوتونا",
  EH: "لويديځ صحارا",
  YE: "یمن",
  ZM: "زیمبیا",
  ZW: "زیمبابوی",
  AX: "الاند ټاپوان",
  BQ: "کیریبین هالینډ",
  CW: "کوراکاو",
  GG: "ګرنسي",
  IM: "د آئل آف مین",
  JE: "جرسی",
  ME: "مونټینیګرو",
  BL: "سينټ بارتيلمي",
  MF: "سینټ مارټن",
  RS: "سربيا",
  SX: "سینټ مارټین",
  SS: "سويلي سوډان",
  XK: "کوسوو"
};
const ps = {
  locale: locale$m,
  countries: countries$m
};
const locale$l = "pt";
const countries$l = {
  AF: "Afeganistão",
  ZA: "África do Sul",
  AL: "Albânia",
  DE: "Alemanha",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguila",
  AQ: "Antártida",
  AG: "Antígua e Barbuda",
  SA: "Arábia Saudita",
  DZ: "Argélia",
  AR: "Argentina",
  AM: "Arménia",
  AW: "Aruba",
  AU: "Austrália",
  AT: "Áustria",
  AZ: "Azerbaijão",
  BS: "Bahamas",
  BH: "Bahrein",
  BD: "Bangladesh",
  BB: "Barbados",
  BE: "Bélgica",
  BZ: "Belize",
  BJ: "Benim",
  BM: "Bermudas",
  BY: "Bielorrússia",
  BO: "Bolívia",
  BA: "Bósnia-Herzegovina",
  BW: "Botsuana",
  BR: "Brasil",
  BN: "Brunei",
  BG: "Bulgária",
  BF: "Burkina Faso",
  BI: "Burundi",
  BT: "Butão",
  CV: "Cabo Verde",
  KH: "Camboja",
  CA: "Canadá",
  QA: "Qatar",
  KZ: "Cazaquistão",
  TD: "Chade",
  CL: "Chile",
  CN: "China",
  CY: "Chipre",
  VA: "Santa Sé",
  SG: "Singapura",
  CO: "Colômbia",
  KM: "Comores",
  CG: "República Democrática do Congo",
  CD: "República Popular do Congo",
  KP: "Coreia do Norte",
  KR: "Coreia do Sul",
  CI: "Costa do Marfim",
  CR: "Costa Rica",
  HR: "Croácia",
  CU: "Cuba",
  CW: "Curaçao",
  DK: "Dinamarca",
  DJ: "Djibouti",
  DM: "Dominica",
  EG: "Egito",
  SV: "El Salvador",
  AE: "Emirados Árabes Unidos",
  EC: "Equador",
  ER: "Eritreia",
  SK: "Eslováquia",
  SI: "Eslovénia",
  ES: "Espanha",
  US: [
    "Estados Unidos",
    "Estados Unidos da América"
  ],
  EE: "Estónia",
  ET: "Etiópia",
  FJ: "Fiji",
  PH: "Filipinas",
  FI: "Finlândia",
  FR: "França",
  GA: "Gabão",
  GM: "Gâmbia",
  GH: "Gana",
  GE: "Geórgia",
  GS: "Geórgia do Sul e Ilhas Sandwich do Sul",
  GI: "Gibraltar",
  GD: "Granada",
  GR: "Grécia",
  GL: "Gronelândia",
  GP: "Guadalupe",
  GU: "Guam",
  GT: "Guatemala",
  GG: "Guernsey",
  GY: "Guiana",
  GF: "Guiana Francesa",
  GN: "Guiné",
  GW: "Guiné-Bissau",
  GQ: "Guiné Equatorial",
  HT: "Haiti",
  NL: "Países Baixos",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungria",
  YE: "Iémen",
  BV: "Ilha Bouvet",
  CX: "Ilha de Natal",
  IM: "Ilha de Man",
  NF: "Ilha Norfolk",
  AX: "Ilhas Åland",
  KY: "Ilhas Caimão",
  CC: "Ilhas Cocos (Keeling)",
  CK: "Ilhas Cook",
  UM: "Ilhas Distantes dos EUA",
  HM: "Ilha Heard e Ilhas McDonald",
  FO: "Ilhas Faroé",
  FK: "Ilhas Malvinas",
  MP: "Ilhas Marianas do Norte",
  MH: "Ilhas Marshall",
  PN: "Ilhas Pitcairn",
  SB: "Ilhas Salomão",
  TC: "Ilhas Turcas e Caicos",
  VG: "Ilhas Virgens Britânicas",
  VI: "Ilhas Virgens Americanas",
  IN: "Índia",
  ID: "Indonésia",
  IR: "Irão",
  IQ: "Iraque",
  IE: "Irlanda",
  IS: "Islândia",
  IL: "Israel",
  IT: "Itália",
  JM: "Jamaica",
  JP: "Japão",
  JE: "Jersey",
  JO: "Jordânia",
  KW: "Koweit",
  LA: "Laos",
  LS: "Lesoto",
  LV: "Letónia",
  LB: "Líbano",
  LR: "Libéria",
  LY: "Líbia",
  LI: "Liechtenstein",
  LT: "Lituânia",
  LU: "Luxemburgo",
  MO: "Macau",
  MK: "Macedónia do Norte",
  MG: "Madagáscar",
  MY: "Malásia",
  MW: "Maláui",
  MV: "Maldivas",
  ML: "Mali",
  MT: "Malta",
  MA: "Marrocos",
  MQ: "Martinica",
  MU: "Maurícia",
  MR: "Mauritânia",
  YT: "Mayotte",
  MX: "México",
  MM: "Mianmar (Birmânia)",
  FM: "Micronésia",
  MZ: "Moçambique",
  MD: "Moldávia",
  MC: "Mónaco",
  MN: "Mongólia",
  ME: "Montenegro",
  MS: "Monserrate",
  NA: "Namíbia",
  NR: "Nauru",
  NP: "Nepal",
  NI: "Nicarágua",
  NE: "Níger",
  NG: "Nigéria",
  NU: "Niue",
  NO: "Noruega",
  NC: "Nova Caledónia",
  NZ: "Nova Zelândia",
  OM: "Omã",
  BQ: "Países Baixos Caribenhos",
  PW: "Palau",
  PA: "Panamá",
  PG: "Papua-Nova Guiné",
  PK: "Paquistão",
  PY: "Paraguai",
  PE: "Peru",
  PF: "Polinésia Francesa",
  PL: "Polónia",
  PR: "Porto Rico",
  PT: "Portugal",
  KE: "Quénia",
  KG: "Quirguistão",
  KI: "Quiribati",
  GB: "Reino Unido",
  CF: "República Centro-Africana",
  DO: "República Dominicana",
  CM: "Camarões",
  CZ: "Chéquia",
  RE: "Reunião",
  RO: "Roménia",
  RW: "Ruanda",
  RU: "Rússia",
  EH: "Saara Ocidental",
  PM: "Saint Pierre e Miquelon",
  WS: "Samoa",
  AS: "Samoa Americana",
  SM: "San Marino",
  SH: "Santa Helena",
  LC: "Santa Lúcia",
  BL: "São Bartolomeu",
  KN: "São Cristóvão e Neves",
  MF: "São Martinho",
  ST: "São Tomé e Príncipe",
  VC: "São Vicente e Granadinas",
  SN: "Senegal",
  SL: "Serra Leoa",
  RS: "Sérvia",
  SC: "Seychelles",
  SX: "São Martinho",
  SY: "Síria",
  SO: "Somália",
  LK: "Sri Lanka",
  SZ: "Essuatíni",
  SD: "Sudão",
  SS: "Sudão do Sul",
  SE: "Suécia",
  CH: "Suíça",
  SR: "Suriname",
  SJ: "Svalbard e Jan Mayen",
  TH: "Tailândia",
  TW: "Taiwan",
  TJ: "Tajiquistão",
  TZ: "Tanzânia",
  IO: "Território Britânico do Oceano Índico",
  TF: "Terras Austrais e Antárticas Francesas",
  PS: "Territórios palestinos",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trindade e Tobago",
  TN: "Tunísia",
  TM: "Turquemenistão",
  TR: "Turquia",
  TV: "Tuvalu",
  UA: "Ucrânia",
  UG: "Uganda",
  UY: "Uruguai",
  UZ: "Uzbequistão",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietname",
  WF: "Wallis e Futuna",
  ZM: "Zâmbia",
  ZW: "Zimbábue",
  XK: "Kosovo"
};
const pt = {
  locale: locale$l,
  countries: countries$l
};
const locale$k = "ro";
const countries$k = {
  AD: "Andorra",
  AE: "Emiratele Arabe Unite",
  AF: "Afganistan",
  AG: "Antigua și Barbuda",
  AI: "Anguilla",
  AL: "Albania",
  AM: "Armenia",
  AO: "Angola",
  AQ: "Antarctica",
  AR: "Argentina",
  AS: "Samoa Americană",
  AT: "Austria",
  AU: "Australia",
  AW: "Aruba",
  AX: "Insulele Åland",
  AZ: "Azerbaidjan",
  BA: "Bosnia și Herțegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgia",
  BF: "Burkina Faso",
  BG: "Bulgaria",
  BH: "Bahrain",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Sfântul Bartolomeu",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivia",
  BQ: "Insulele Caraibe Olandeze",
  BR: "Brazilia",
  BS: "Bahamas",
  BT: "Bhutan",
  BV: "Insula Bouvet",
  BW: "Botswana",
  BY: "Belarus",
  BZ: "Belize",
  CA: "Canada",
  CC: "Insulele Cocos (Keeling)",
  CD: "Congo - Kinshasa",
  CF: "Republica Centrafricană",
  CG: "Congo - Brazzaville",
  CH: "Elveția",
  CI: "Côte d’Ivoire",
  CK: "Insulele Cook",
  CL: "Chile",
  CM: "Camerun",
  CN: "China",
  CO: "Columbia",
  CR: "Costa Rica",
  CU: "Cuba",
  CV: "Capul Verde",
  CW: "Curaçao",
  CX: "Insula Christmas",
  CY: "Cipru",
  CZ: "Cehia",
  DE: "Germania",
  DJ: "Djibouti",
  DK: "Danemarca",
  DM: "Dominica",
  DO: "Republica Dominicană",
  DZ: "Algeria",
  EC: "Ecuador",
  EE: "Estonia",
  EG: "Egipt",
  EH: "Sahara Occidentală",
  ER: "Eritreea",
  ES: "Spania",
  ET: "Etiopia",
  FI: "Finlanda",
  FJ: "Fiji",
  FK: "Insulele Falkland",
  FM: "Micronezia",
  FO: "Insulele Feroe",
  FR: "Franța",
  GA: "Gabon",
  GB: "Regatul Unit",
  GD: "Grenada",
  GE: "Georgia",
  GF: "Guyana Franceză",
  GG: "Guernsey",
  GH: "Ghana",
  GI: "Gibraltar",
  GL: "Groenlanda",
  GM: "Gambia",
  GN: "Guineea",
  GP: "Guadelupa",
  GQ: "Guineea Ecuatorială",
  GR: "Grecia",
  GS: "Georgia de Sud și Insulele Sandwich de Sud",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Guineea-Bissau",
  GY: "Guyana",
  HK: "R.A.S. Hong Kong a Chinei",
  HM: "Insula Heard și Insulele McDonald",
  HN: "Honduras",
  HR: "Croația",
  HT: "Haiti",
  HU: "Ungaria",
  ID: "Indonezia",
  IE: "Irlanda",
  IL: "Israel",
  IM: "Insula Man",
  IN: "India",
  IO: "Teritoriul Britanic din Oceanul Indian",
  IQ: "Irak",
  IR: "Iran",
  IS: "Islanda",
  IT: "Italia",
  JE: "Jersey",
  JM: "Jamaica",
  JO: "Iordania",
  JP: "Japonia",
  KE: "Kenya",
  KG: "Kârgâzstan",
  KH: "Cambodgia",
  KI: "Kiribati",
  KM: "Comore",
  KN: "Saint Kitts și Nevis",
  KP: "Coreea de Nord",
  KR: "Coreea de Sud",
  KW: "Kuweit",
  KY: "Insulele Cayman",
  KZ: "Kazahstan",
  LA: "Laos",
  LB: "Liban",
  LC: "Sfânta Lucia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberia",
  LS: "Lesotho",
  LT: "Lituania",
  LU: "Luxemburg",
  LV: "Letonia",
  LY: "Libia",
  MA: "Maroc",
  MC: "Monaco",
  MD: "Republica Moldova",
  ME: "Muntenegru",
  MF: "Sfântul Martin",
  MG: "Madagascar",
  MH: "Insulele Marshall",
  MK: "Macedonia de Nord",
  ML: "Mali",
  MM: "Myanmar",
  MN: "Mongolia",
  MO: "R.A.S. Macao a Chinei",
  MP: "Insulele Mariane de Nord",
  MQ: "Martinica",
  MR: "Mauritania",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldive",
  MW: "Malawi",
  MX: "Mexic",
  MY: "Malaysia",
  MZ: "Mozambic",
  NA: "Namibia",
  NC: "Noua Caledonie",
  NE: "Niger",
  NF: "Insula Norfolk",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Țările de Jos",
  NO: "Norvegia",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Noua Zeelandă",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "Polinezia Franceză",
  PG: "Papua-Noua Guinee",
  PH: "Filipine",
  PK: "Pakistan",
  PL: "Polonia",
  PM: "Saint-Pierre și Miquelon",
  PN: "Insulele Pitcairn",
  PR: "Puerto Rico",
  PS: "Teritoriile Palestiniene",
  PT: "Portugalia",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Qatar",
  RE: "Réunion",
  RO: "România",
  RS: "Serbia",
  RU: "Rusia",
  RW: "Rwanda",
  SA: "Arabia Saudită",
  SB: "Insulele Solomon",
  SC: "Seychelles",
  SD: "Sudan",
  SE: "Suedia",
  SG: "Singapore",
  SH: "Sfânta Elena",
  SI: "Slovenia",
  SJ: "Svalbard și Jan Mayen",
  SK: "Slovacia",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalia",
  SR: "Suriname",
  SS: "Sudanul de Sud",
  ST: "Sao Tomé și Príncipe",
  SV: "El Salvador",
  SX: "Sint-Maarten",
  SY: "Siria",
  SZ: "Eswatini",
  TC: "Insulele Turks și Caicos",
  TD: "Ciad",
  TF: "Teritoriile Australe și Antarctice Franceze",
  TG: "Togo",
  TH: "Thailanda",
  TJ: "Tadjikistan",
  TK: "Tokelau",
  TL: "Timorul de Est",
  TM: "Turkmenistan",
  TN: "Tunisia",
  TO: "Tonga",
  TR: "Turcia",
  TT: "Trinidad și Tobago",
  TV: "Tuvalu",
  TW: "Taiwan",
  TZ: "Tanzania",
  UA: "Ucraina",
  UG: "Uganda",
  UM: "Insulele Îndepărtate ale S.U.A.",
  US: "Statele Unite ale Americii",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VA: "Statul Cetății Vaticanului",
  VC: "Saint Vincent și Grenadinele",
  VE: "Venezuela",
  VG: "Insulele Virgine Britanice",
  VI: "Insulele Virgine Americane",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis și Futuna",
  WS: "Samoa",
  XK: "Kosovo",
  YE: "Yemen",
  YT: "Mayotte",
  ZA: "Africa de Sud",
  ZM: "Zambia",
  ZW: "Zimbabwe"
};
const ro = {
  locale: locale$k,
  countries: countries$k
};
const locale$j = "ru";
const countries$j = {
  AU: "Австралия",
  AT: "Австрия",
  AZ: "Азербайджан",
  AX: "Аландские острова",
  AL: "Албания",
  DZ: "Алжир",
  VI: "Виргинские Острова (США)",
  AS: "Американское Самоа",
  AI: "Ангилья",
  AO: "Ангола",
  AD: "Андорра",
  AQ: "Антарктида",
  AG: "Антигуа и Барбуда",
  AR: "Аргентина",
  AM: "Армения",
  AW: "Аруба",
  AF: "Афганистан",
  BS: "Багамы",
  BD: "Бангладеш",
  BB: "Барбадос",
  BH: "Бахрейн",
  BZ: "Белиз",
  BY: "Беларусь",
  BE: "Бельгия",
  BJ: "Бенин",
  BM: "Бермуды",
  BG: "Болгария",
  BO: "Боливия",
  BQ: "Бонэйр, Синт-Эстатиус и Саба",
  BA: "Босния и Герцеговина",
  BW: "Ботсвана",
  BR: "Бразилия",
  IO: "Британская территория в Индийском океане",
  VG: "Виргинские Острова (Великобритания)",
  BN: "Бруней",
  BF: "Буркина-Фасо",
  BI: "Бурунди",
  BT: "Бутан",
  VU: "Вануату",
  VA: "Ватикан",
  GB: "Великобритания",
  HU: "Венгрия",
  VE: "Венесуэла",
  UM: "Внешние малые острова (США)",
  TL: "Восточный Тимор",
  VN: "Вьетнам",
  GA: "Габон",
  HT: "Гаити",
  GY: "Гайана",
  GM: "Гамбия",
  GH: "Гана",
  GP: "Гваделупа",
  GT: "Гватемала",
  GF: "Гвиана",
  GN: "Гвинея",
  GW: "Гвинея-Бисау",
  DE: "Германия",
  GG: "Гернси",
  GI: "Гибралтар",
  HN: "Гондурас",
  HK: "Гонконг",
  GD: "Гренада",
  GL: "Гренландия",
  GR: "Греция",
  GE: "Грузия",
  GU: "Гуам",
  DK: "Дания",
  JE: "Джерси",
  DJ: "Джибути",
  DM: "Доминика",
  DO: "Доминиканская Республика",
  CD: "Демократическая Республика Конго",
  EG: "Египет",
  ZM: "Замбия",
  EH: "САДР",
  ZW: "Зимбабве",
  IL: "Израиль",
  IN: "Индия",
  ID: "Индонезия",
  JO: "Иордания",
  IQ: "Ирак",
  IR: "Иран",
  IE: "Ирландия",
  IS: "Исландия",
  ES: "Испания",
  IT: "Италия",
  YE: "Йемен",
  CV: "Кабо-Верде",
  KZ: "Казахстан",
  KY: "Острова Кайман",
  KH: "Камбоджа",
  CM: "Камерун",
  CA: "Канада",
  QA: "Катар",
  KE: "Кения",
  CY: "Кипр",
  KG: "Киргизия",
  KI: "Кирибати",
  TW: [
    "Тайвань",
    "Китайская Республика"
  ],
  KP: "КНДР (Корейская Народно-Демократическая Республика)",
  CN: "КНР (Китайская Народная Республика)",
  CC: "Кокосовые острова",
  CO: "Колумбия",
  KM: "Коморы",
  CR: "Коста-Рика",
  CI: "Кот-д’Ивуар",
  CU: "Куба",
  KW: "Кувейт",
  CW: "Кюрасао",
  LA: "Лаос",
  LV: "Латвия",
  LS: "Лесото",
  LR: "Либерия",
  LB: "Ливан",
  LY: "Ливия",
  LT: "Литва",
  LI: "Лихтенштейн",
  LU: "Люксембург",
  MU: "Маврикий",
  MR: "Мавритания",
  MG: "Мадагаскар",
  YT: "Майотта",
  MO: "Макао",
  MW: "Малави",
  MY: "Малайзия",
  ML: "Мали",
  MV: "Мальдивы",
  MT: "Мальта",
  MA: "Марокко",
  MQ: "Мартиника",
  MH: "Маршалловы Острова",
  MX: "Мексика",
  FM: "Микронезия",
  MZ: "Мозамбик",
  MD: "Молдавия",
  MC: "Монако",
  MN: "Монголия",
  MS: "Монтсеррат",
  MM: "Мьянма",
  NA: "Намибия",
  NR: "Науру",
  NP: "Непал",
  NE: "Нигер",
  NG: "Нигерия",
  NL: "Нидерланды",
  NI: "Никарагуа",
  NU: "Ниуэ",
  NZ: "Новая Зеландия",
  NC: "Новая Каледония",
  NO: "Норвегия",
  AE: "ОАЭ",
  OM: "Оман",
  BV: "Остров Буве",
  IM: "Остров Мэн",
  CK: "Острова Кука",
  NF: "Остров Норфолк",
  CX: "Остров Рождества",
  PN: "Острова Питкэрн",
  SH: "Острова Святой Елены, Вознесения и Тристан-да-Кунья",
  PK: "Пакистан",
  PW: "Палау",
  PS: "Государство Палестина",
  PA: "Панама",
  PG: "Папуа — Новая Гвинея",
  PY: "Парагвай",
  PE: "Перу",
  PL: "Польша",
  PT: "Португалия",
  PR: "Пуэрто-Рико",
  CG: "Республика Конго",
  KR: "Республика Корея",
  RE: "Реюньон",
  RU: [
    "Российская Федерация",
    "Россия"
  ],
  RW: "Руанда",
  RO: "Румыния",
  SV: "Сальвадор",
  WS: "Самоа",
  SM: "Сан-Марино",
  ST: "Сан-Томе и Принсипи",
  SA: "Саудовская Аравия",
  SZ: "Эсватини",
  MK: "Северная Македония",
  MP: "Северные Марианские Острова",
  SC: "Сейшельские Острова",
  BL: "Сен-Бартелеми",
  MF: "Сен-Мартен",
  PM: "Сен-Пьер и Микелон",
  SN: "Сенегал",
  VC: "Сент-Винсент и Гренадины",
  KN: "Сент-Китс и Невис",
  LC: "Сент-Люсия",
  RS: "Сербия",
  SG: "Сингапур",
  SX: "Синт-Мартен",
  SY: "Сирия",
  SK: "Словакия",
  SI: "Словения",
  SB: "Соломоновы Острова",
  SO: "Сомали",
  SD: "Судан",
  SR: "Суринам",
  US: "США",
  SL: "Сьерра-Леоне",
  TJ: "Таджикистан",
  TH: "Таиланд",
  TZ: "Танзания",
  TC: "Теркс и Кайкос",
  TG: "Того",
  TK: "Токелау",
  TO: "Тонга",
  TT: "Тринидад и Тобаго",
  TV: "Тувалу",
  TN: "Тунис",
  TM: "Туркмения",
  TR: "Турция",
  UG: "Уганда",
  UZ: "Узбекистан",
  UA: "Украина",
  WF: "Уоллис и Футуна",
  UY: "Уругвай",
  FO: "Фареры",
  FJ: "Фиджи",
  PH: "Филиппины",
  FI: "Финляндия",
  FK: "Фолклендские острова",
  FR: "Франция",
  PF: "Французская Полинезия",
  TF: "Французские Южные и Антарктические Территории",
  HM: "Херд и Макдональд",
  HR: "Хорватия",
  CF: "ЦАР",
  TD: "Чад",
  ME: "Черногория",
  CZ: "Чехия",
  CL: "Чили",
  CH: "Швейцария",
  SE: "Швеция",
  SJ: "Шпицберген и Ян-Майен",
  LK: "Шри-Ланка",
  EC: "Эквадор",
  GQ: "Экваториальная Гвинея",
  ER: "Эритрея",
  EE: "Эстония",
  ET: "Эфиопия",
  ZA: "ЮАР",
  GS: "Южная Георгия и Южные Сандвичевы Острова",
  SS: "Южный Судан",
  JM: "Ямайка",
  JP: "Япония",
  XK: "Косово"
};
const ru = {
  locale: locale$j,
  countries: countries$j
};
const locale$i = "sd";
const countries$i = {
  AF: "افغانستان",
  AL: "البانيا",
  DZ: "الجيريا",
  AS: "آمريڪي ساموا",
  AD: "اندورا",
  AO: "انگولا",
  AI: "انگويلا",
  AQ: "انٽارڪٽيڪا",
  AG: "انٽيگا ۽ باربوڊا",
  AR: "ارجنٽينا",
  AM: "ارمینیا",
  AW: "عروبا",
  AU: "آسٽريليا",
  AT: "آسٽريا",
  AZ: "آذربائيجان",
  BS: "باهاماس",
  BH: "بحرين",
  BD: "بنگلاديش",
  BB: "باربڊوس",
  BY: "بیلارس",
  BE: "بيلجيم",
  BZ: "بيليز",
  BJ: "بينن",
  BM: "برمودا",
  BT: "ڀوٽان",
  BO: "بوليويا",
  BA: "بوسنيا ۽ ھرزيگوينا",
  BW: "بوٽسوانا",
  BV: "بووٽ ٻيٽ",
  BR: "برازيل",
  IO: "برطانوي هندي سمنڊ خطو",
  BN: "برونائي",
  BG: "بلغاريا",
  BF: "برڪينا فاسو",
  BI: "برونڊي",
  KH: "ڪمبوڊيا",
  CM: "ڪيمرون",
  CA: "ڪينيڊا",
  CV: "ڪيپ وردي",
  KY: "ڪي مين ٻيٽ",
  CF: "وچ آفريقي جمهوريه",
  TD: "چاڊ",
  CL: "چلي",
  CN: "چين",
  CX: "ڪرسمس ٻيٽ",
  CC: "ڪوڪوس ٻيٽ",
  CO: "ڪولمبيا",
  KM: "ڪوموروس",
  CG: "ڪانگو - برازاویل",
  CD: "ڪانگو -ڪنشاسا",
  CK: "ڪوڪ ٻيٽ",
  CR: "ڪوسٽا ريڪا",
  CI: "ڪوٽ ڊي وار",
  HR: "ڪروئيشيا",
  CU: "ڪيوبا",
  CY: "سائپرس",
  CZ: "چيڪيا",
  DK: "ڊينمارڪ",
  DJ: "ڊجبيوتي",
  DM: "ڊومينيڪا",
  DO: "ڊومينيڪن جمهوريه",
  EC: "ايڪواڊور",
  EG: "مصر",
  SV: "ال سلواڊور",
  GQ: "ايڪوٽوريل گائينا",
  ER: "ايريٽيريا",
  EE: "ايسٽونيا",
  ET: "ايٿوپيا",
  FK: "فاڪ لينڊ ٻيٽ",
  FO: "فارو ٻيٽ",
  FJ: "فجي",
  FI: "فن لينڊ",
  FR: "فرانس",
  GF: "فرانسيسي گيانا",
  PF: "فرانسيسي پولينيشيا",
  TF: "فرانسيسي ڏاکڻي علائقا",
  GA: "گبون",
  GM: "گيمبيا",
  GE: "جارجيا",
  DE: "جرمني",
  GH: "گهانا",
  GI: "جبرالٽر",
  GR: "يونان",
  GL: "گرين لينڊ",
  GD: "گرينڊا",
  GP: "گواڊیلوپ",
  GU: "گوام",
  GT: "گوئٽي مالا",
  GN: "گني",
  GW: "گني بسائو",
  GY: "گيانا",
  HT: "هيٽي",
  HM: "هرڊ ۽ مڪڊونلڊ ٻيٽ",
  VA: "ويٽڪين سٽي",
  HN: "هنڊورس",
  HK: "هانگ ڪانگ SAR",
  HU: "هنگري",
  IS: "آئس لينڊ",
  IN: "ڀارت",
  ID: "انڊونيشيا",
  IR: "ايران",
  IQ: "عراق",
  IE: "آئرلينڊ",
  IL: "اسرائيل",
  IT: "اٽلي",
  JM: "جميڪا",
  JP: "جاپان",
  JO: "اردن",
  KZ: "قازقستان",
  KE: "ڪينيا",
  KI: "ڪرباتي",
  KP: "اتر ڪوريا",
  KR: "ڏکڻ ڪوريا",
  KW: "ڪويت",
  KG: "ڪرغستان",
  LA: "لائوس",
  LV: "لاتويا",
  LB: "لبنان",
  LS: "ليسوٿو",
  LR: "لائبیریا",
  LY: "لبيا",
  LI: "لچي ٽينسٽين",
  LT: "لٿونيا",
  LU: "لگزمبرگ",
  MO: "مڪائو SAR چين",
  MG: "مدگاسڪر",
  MW: "مالاوي",
  MY: "ملائيشيا",
  MV: "مالديپ",
  ML: "مالي",
  MT: "مالٽا",
  MH: "مارشل ٻيٽ",
  MQ: "مارتينڪ",
  MR: "موريتانيا",
  MU: "موريشس",
  YT: "مياتي",
  MX: "ميڪسيڪو",
  FM: "مائڪرونيشيا",
  MD: "مالدووا",
  MC: "موناڪو",
  MN: "منگوليا",
  MS: "مونٽسراٽ",
  MA: "مراڪش",
  MZ: "موزمبیق",
  MM: "ميانمار (برما)",
  NA: "نيميبيا",
  NR: "نائورو",
  NP: "نيپال",
  NL: "نيدرلينڊ",
  NC: "نیو ڪالیڊونیا",
  NZ: "نيو زيلينڊ",
  NI: "نڪراگوا",
  NE: "نائيجر",
  NG: "نائيجيريا",
  NU: "نووي",
  NF: "نورفوڪ ٻيٽ",
  MK: "اتر مقدونيا",
  MP: "اتريان ماريانا ٻيٽ",
  NO: "ناروي",
  OM: "عمان",
  PK: "پاڪستان",
  PW: "پلائو",
  PS: "فلسطيني علائقا",
  PA: "پناما",
  PG: "پاپوا نیو گني",
  PY: "پيراگوءِ",
  PE: "پيرو",
  PH: "فلپائن",
  PN: "پٽڪئرن ٻيٽ",
  PL: "پولينڊ",
  PT: "پرتگال",
  PR: "پيوئرٽو ريڪو",
  QA: "قطر",
  RE: "ري يونين",
  RO: "رومانيا",
  RU: "روس",
  RW: "روانڊا",
  SH: "سينٽ ھيلينا",
  KN: "سينٽ ڪٽس و نيوس",
  LC: "سينٽ لوسيا",
  PM: "سینٽ پیئر و میڪوئیلون",
  VC: "سینٽ ونسنت ۽ گریناڊینز",
  WS: "ساموا",
  SM: "سین مرینو",
  ST: "سائو ٽوم ۽ پرنسپیي",
  SA: "سعودي عرب",
  SN: "سينيگال",
  SC: "شي شلز",
  SL: "سيرا ليون",
  SG: "سنگاپور",
  SK: "سلوواڪيا",
  SI: "سلوینیا",
  SB: "سولومون ٻيٽَ",
  SO: "سوماليا",
  ZA: "ڏکڻ آفريقا",
  GS: "ڏکڻ جارجيا ۽ ڏکڻ سينڊوچ ٻيٽ",
  ES: "اسپين",
  LK: "سري لنڪا",
  SD: "سوڊان",
  SR: "سورينام",
  SJ: "سوالبارڊ ۽ جان ماین",
  SZ: "ايسواٽني",
  SE: "سوئيڊن",
  CH: "سوئزرلينڊ",
  SY: "شام",
  TW: "تائیوان",
  TJ: "تاجڪستان",
  TZ: "تنزانيا",
  TH: "ٿائيليند",
  TL: "تيمور ليستي",
  TG: "ٽوگو",
  TK: "ٽوڪلائو",
  TO: "ٽونگا",
  TT: "ٽريني ڊيڊ ۽ ٽوباگو ٻيٽ",
  TN: "تيونيسيا",
  TR: "ترڪي",
  TM: "ترڪمانستان",
  TC: "ترڪ ۽ ڪيڪوس ٻيٽ",
  TV: "توالو",
  UG: "يوگنڊا",
  UA: "يوڪرين",
  AE: "متحده عرب امارات",
  GB: "برطانيہ",
  US: "آمريڪا جون گڏيل رياستون",
  UM: "آمريڪي خارجي ٻيٽ",
  UY: "يوروگوءِ",
  UZ: "ازبڪستان",
  VU: "وينيٽيو",
  VE: "وينزويلا",
  VN: "ويتنام",
  VG: "برطانوي ورجن ٻيٽ",
  VI: "آمريڪي ورجن ٻيٽ",
  WF: "والس ۽ فتونا",
  EH: "اولهه صحارا",
  YE: "يمن",
  ZM: "زيمبيا",
  ZW: "زمبابوي",
  AX: "الند ٻيٽ",
  BQ: "ڪيريبين نيدرلينڊ",
  CW: "ڪيوراسائو",
  GG: "گورنسي",
  IM: "انسانن جو ٻيٽ",
  JE: "جرسي",
  ME: "مونٽي نيگرو",
  BL: "سینٽ برٿلیمی",
  MF: "سينٽ مارٽن",
  RS: "سربيا",
  SX: "سنٽ مارٽن",
  SS: "ڏکڻ سوڊان",
  XK: "ڪوسووو"
};
const sd = {
  locale: locale$i,
  countries: countries$i
};
const locale$h = "sk";
const countries$h = {
  AD: "Andorra",
  AE: "Spojené arabské emiráty",
  AF: "Afganistan",
  AG: "Antigua a Barbuda",
  AI: "Anguilla",
  AL: "Albánsko",
  AM: "Arménsko",
  AO: "Angola",
  AQ: "Antarktída",
  AR: "Argentína",
  AS: "Americká Samoa",
  AT: "Rakúsko",
  AU: "Austrália",
  AW: "Aruba",
  AX: "Alandy",
  AZ: "Azerbajdžan",
  BA: "Bosna a Hercegovina",
  BB: "Barbados",
  BD: "Bangladéš",
  BE: "Belgicko",
  BF: "Burkina Faso",
  BG: "Bulharsko",
  BH: "Bahrajn",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Svätý Bartolomej",
  BM: "Bermudy",
  BN: "Brunej",
  BO: "Bolívia",
  BQ: "Karibské Holandsko",
  BR: "Brazília",
  BS: "Bahamy",
  BT: "Bhután",
  BV: "Bouvetov ostrov",
  BW: "Botswana",
  BY: "Bielorusko",
  BZ: "Belize",
  CA: "Kanada",
  CC: "Kokosové ostrovy",
  CD: "Konžská demokratická republika",
  CF: "Stredoafrická republika",
  CG: "Konžská republika",
  CH: "Švajčiarsko",
  CI: "Pobrežie Slonoviny",
  CK: "Cookove ostrovy",
  CL: "Čile",
  CM: "Kamerun",
  CN: "Čína",
  CO: "Kolumbia",
  CR: "Kostarika",
  CU: "Kuba",
  CV: "Kapverdy",
  CW: "Curaçao",
  CX: "Vianočný ostrov",
  CY: "Cyprus",
  CZ: "Česko",
  DE: "Nemecko",
  DJ: "Džibutsko",
  DK: "Dánsko",
  DM: "Dominika",
  DO: "Dominikánska republika",
  DZ: "Alžírsko",
  EC: "Ekvádor",
  EE: "Estónsko",
  EG: "Egypt",
  EH: "Západná Sahara",
  ER: "Eritrea",
  ES: "Španielsko",
  ET: "Etiópia",
  FI: "Fínsko",
  FJ: "Fidži",
  FK: "Falklandy",
  FM: "Mikronézia",
  FO: "Faerské ostrovy",
  FR: "Francúzsko",
  GA: "Gabon",
  GB: "Spojené kráľovstvo",
  GD: "Grenada",
  GE: "Gruzínsko",
  GF: "Francúzska Guayana",
  GG: "Guernsey",
  GH: "Ghana",
  GI: "Gibraltár",
  GL: "Grónsko",
  GM: "Gambia",
  GN: "Guinea",
  GP: "Guadeloupe",
  GQ: "Rovníková Guinea",
  GR: "Grécko",
  GS: "Južná Georgia a Južné Sandwichove ostrovy",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Guinea-Bissau",
  GY: "Guayana",
  HK: "Hongkong – OAO Číny",
  HM: "Heardov ostrov a Macdonaldove ostrovy",
  HN: "Honduras",
  HR: "Chorvátsko",
  HT: "Haiti",
  HU: "Maďarsko",
  ID: "Indonézia",
  IE: "Írsko",
  IL: "Izrael",
  IM: "Ostrov Man",
  IN: "India",
  IO: "Britské indickooceánske územie",
  IQ: "Irak",
  IR: "Irán",
  IS: "Island",
  IT: "Taliansko",
  JE: "Jersey",
  JM: "Jamajka",
  JO: "Jordánsko",
  JP: "Japonsko",
  KE: "Keňa",
  KG: "Kirgizsko",
  KH: "Kambodža",
  KI: "Kiribati",
  KM: "Komory",
  KN: "Svätý Krištof a Nevis",
  KP: "Severná Kórea",
  KR: "Južná Kórea",
  KW: "Kuvajt",
  KY: "Kajmanie ostrovy",
  KZ: "Kazachstan",
  LA: "Laos",
  LB: "Libanon",
  LC: "Svätá Lucia",
  LI: "Lichtenštajnsko",
  LK: "Srí Lanka",
  LR: "Libéria",
  LS: "Lesotho",
  LT: "Litva",
  LU: "Luxembursko",
  LV: "Lotyšsko",
  LY: "Líbya",
  MA: "Maroko",
  MC: "Monako",
  MD: "Moldavsko",
  ME: "Čierna Hora",
  MF: "Svätý Martin (fr.)",
  MG: "Madagaskar",
  MH: "Marshallove ostrovy",
  MK: "Severné Macedónsko",
  ML: "Mali",
  MM: "Mjanmarsko",
  MN: "Mongolsko",
  MO: "Macao – OAO Číny",
  MP: "Severné Mariány",
  MQ: "Martinik",
  MR: "Mauritánia",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Maurícius",
  MV: "Maldivy",
  MW: "Malawi",
  MX: "Mexiko",
  MY: "Malajzia",
  MZ: "Mozambik",
  NA: "Namíbia",
  NC: "Nová Kaledónia",
  NE: "Niger",
  NF: "Norfolk",
  NG: "Nigéria",
  NI: "Nikaragua",
  NL: "Holandsko",
  NO: "Nórsko",
  NP: "Nepál",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Nový Zéland",
  OM: "Omán",
  PA: "Panama",
  PE: "Peru",
  PF: "Francúzska Polynézia",
  PG: "Papua Nová Guinea",
  PH: "Filipíny",
  PK: "Pakistan",
  PL: "Poľsko",
  PM: "Saint Pierre a Miquelon",
  PN: "Pitcairnove ostrovy",
  PR: "Portoriko",
  PS: "Palestínske územia",
  PT: "Portugalsko",
  PW: "Palau",
  PY: "Paraguaj",
  QA: "Katar",
  RE: "Réunion",
  RO: "Rumunsko",
  RS: "Srbsko",
  RU: "Rusko",
  RW: "Rwanda",
  SA: "Saudská Arábia",
  SB: "Šalamúnove ostrovy",
  SC: "Seychely",
  SD: "Sudán",
  SE: "Švédsko",
  SG: "Singapur",
  SH: "Svätá Helena",
  SI: "Slovinsko",
  SJ: "Svalbard a Jan Mayen",
  SK: "Slovensko",
  SL: "Sierra Leone",
  SM: "San Maríno",
  SN: "Senegal",
  SO: "Somálsko",
  SR: "Surinam",
  SS: "Južný Sudán",
  ST: "Svätý Tomáš a Princov ostrov",
  SV: "Salvádor",
  SX: "Svätý Martin (hol.)",
  SY: "Sýria",
  SZ: "Svazijsko",
  TC: "Turks a Caicos",
  TD: "Čad",
  TF: "Francúzske južné a antarktické územia",
  TG: "Togo",
  TH: "Thajsko",
  TJ: "Tadžikistan",
  TK: "Tokelau",
  TL: "Východný Timor",
  TM: "Turkménsko",
  TN: "Tunisko",
  TO: "Tonga",
  TR: "Turecko",
  TT: "Trinidad a Tobago",
  TV: "Tuvalu",
  TW: "Taiwan",
  TZ: "Tanzánia",
  UA: "Ukrajina",
  UG: "Uganda",
  UM: "Menšie odľahlé ostrovy USA",
  US: "Spojené štáty",
  UY: "Uruguaj",
  UZ: "Uzbekistan",
  VA: "Vatikán",
  VC: "Svätý Vincent a Grenadíny",
  VE: "Venezuela",
  VG: "Britské Panenské ostrovy",
  VI: "Americké Panenské ostrovy",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis a Futuna",
  WS: "Samoa",
  XK: "Kosovo",
  YE: "Jemen",
  YT: "Mayotte",
  ZA: "Južná Afrika",
  ZM: "Zambia",
  ZW: "Zimbabwe"
};
const sk = {
  locale: locale$h,
  countries: countries$h
};
const locale$g = "sl";
const countries$g = {
  AD: "Andora",
  AE: "Združeni arabski emirati",
  AF: "Afganistan",
  AG: "Antigva in Barbuda",
  AI: "Angvila",
  AL: "Albanija",
  AM: "Armenija",
  AO: "Angola",
  AQ: "Antarktika",
  AR: "Argentina",
  AS: "Ameriška Samoa",
  AT: "Avstrija",
  AU: "Avstralija",
  AW: "Aruba",
  AX: "Ålandski otoki",
  AZ: "Azerbajdžan",
  BA: "Bosna in Hercegovina",
  BB: "Barbados",
  BD: "Bangladeš",
  BE: "Belgija",
  BF: "Burkina Faso",
  BG: "Bolgarija",
  BH: "Bahrajn",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint Barthélemy",
  BM: "Bermudi",
  BN: "Brunej",
  BO: "Bolivija",
  BQ: "Nizozemski Karibi",
  BR: "Brazilija",
  BS: "Bahami",
  BT: "Butan",
  BV: "Bouvetov otok",
  BW: "Bocvana",
  BY: "Belorusija",
  BZ: "Belize",
  CA: "Kanada",
  CC: "Kokosovi otoki",
  CD: "Demokratična republika Kongo",
  CF: "Centralnoafriška republika",
  CG: "Kongo - Brazzaville",
  CH: "Švica",
  CI: "Slonokoščena obala",
  CK: "Cookovi otoki",
  CL: "Čile",
  CM: "Kamerun",
  CN: "Kitajska",
  CO: "Kolumbija",
  CR: "Kostarika",
  CU: "Kuba",
  CV: "Zelenortski otoki",
  CW: "Curaçao",
  CX: "Božični otok",
  CY: "Ciper",
  CZ: "Češka",
  DE: "Nemčija",
  DJ: "Džibuti",
  DK: "Danska",
  DM: "Dominika",
  DO: "Dominikanska republika",
  DZ: "Alžirija",
  EC: "Ekvador",
  EE: "Estonija",
  EG: "Egipt",
  EH: "Zahodna Sahara",
  ER: "Eritreja",
  ES: "Španija",
  ET: "Etiopija",
  FI: "Finska",
  FJ: "Fidži",
  FK: "Falklandski otoki",
  FM: "Mikronezija",
  FO: "Ferski otoki",
  FR: "Francija",
  GA: "Gabon",
  GB: "Združeno kraljestvo",
  GD: "Grenada",
  GE: "Gruzija",
  GF: "Francoska Gvajana",
  GG: "Guernsey",
  GH: "Gana",
  GI: "Gibraltar",
  GL: "Grenlandija",
  GM: "Gambija",
  GN: "Gvineja",
  GP: "Gvadalupe",
  GQ: "Ekvatorialna Gvineja",
  GR: "Grčija",
  GS: "Južna Georgia in Južni Sandwichevi otoki",
  GT: "Gvatemala",
  GU: "Guam",
  GW: "Gvineja Bissau",
  GY: "Gvajana",
  HK: "Hongkong",
  HM: "Heardov otok in McDonaldovi otoki",
  HN: "Honduras",
  HR: "Hrvaška",
  HT: "Haiti",
  HU: "Madžarska",
  ID: "Indonezija",
  IE: "Irska",
  IL: "Izrael",
  IM: "Otok Man",
  IN: "Indija",
  IO: "Britansko ozemlje v Indijskem oceanu",
  IQ: "Irak",
  IR: "Iran",
  IS: "Islandija",
  IT: "Italija",
  JE: "Jersey",
  JM: "Jamajka",
  JO: "Jordanija",
  JP: "Japonska",
  KE: "Kenija",
  KG: "Kirgizistan",
  KH: "Kambodža",
  KI: "Kiribati",
  KM: "Komori",
  KN: "Saint Kitts in Nevis",
  KP: "Severna Koreja",
  KR: "Južna Koreja",
  KW: "Kuvajt",
  KY: "Kajmanski otoki",
  KZ: "Kazahstan",
  LA: "Laos",
  LB: "Libanon",
  LC: "Saint Lucia",
  LI: "Lihtenštajn",
  LK: "Šrilanka",
  LR: "Liberija",
  LS: "Lesoto",
  LT: "Litva",
  LU: "Luksemburg",
  LV: "Latvija",
  LY: "Libija",
  MA: "Maroko",
  MC: "Monako",
  MD: "Moldavija",
  ME: "Črna gora",
  MF: "Saint Martin",
  MG: "Madagaskar",
  MH: "Marshallovi otoki",
  MK: "Severna Makedonija",
  ML: "Mali",
  MM: "Mjanmar (Burma)",
  MN: "Mongolija",
  MO: "Macao",
  MP: "Severni Marianski otoki",
  MQ: "Martinik",
  MR: "Mavretanija",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldivi",
  MW: "Malavi",
  MX: "Mehika",
  MY: "Malezija",
  MZ: "Mozambik",
  NA: "Namibija",
  NC: "Nova Kaledonija",
  NE: "Niger",
  NF: "Norfolški otok",
  NG: "Nigerija",
  NI: "Nikaragva",
  NL: "Nizozemska",
  NO: "Norveška",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Nova Zelandija",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "Francoska Polinezija",
  PG: "Papua Nova Gvineja",
  PH: "Filipini",
  PK: "Pakistan",
  PL: "Poljska",
  PM: "Saint Pierre in Miquelon",
  PN: "Pitcairn",
  PR: "Portoriko",
  PS: "Palestinsko ozemlje",
  PT: "Portugalska",
  PW: "Palau",
  PY: "Paragvaj",
  QA: "Katar",
  RE: "Reunion",
  RO: "Romunija",
  RS: "Srbija",
  RU: "Rusija",
  RW: "Ruanda",
  SA: "Saudova Arabija",
  SB: "Salomonovi otoki",
  SC: "Sejšeli",
  SD: "Sudan",
  SE: "Švedska",
  SG: "Singapur",
  SH: "Sveta Helena",
  SI: "Slovenija",
  SJ: "Svalbard in Jan Mayen",
  SK: "Slovaška",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalija",
  SR: "Surinam",
  SS: "Južni Sudan",
  ST: "Sao Tome in Principe",
  SV: "Salvador",
  SX: "Sint Maarten",
  SY: "Sirija",
  SZ: "Svazi",
  TC: "Otoki Turks in Caicos",
  TD: "Čad",
  TF: "Francosko južno ozemlje",
  TG: "Togo",
  TH: "Tajska",
  TJ: "Tadžikistan",
  TK: "Tokelau",
  TL: "Timor-Leste",
  TM: "Turkmenistan",
  TN: "Tunizija",
  TO: "Tonga",
  TR: "Turčija",
  TT: "Trinidad in Tobago",
  TV: "Tuvalu",
  TW: "Tajvan",
  TZ: "Tanzanija",
  UA: "Ukrajina",
  UG: "Uganda",
  UM: "Stranski zunanji otoki Združenih držav",
  US: "Združene države Amerike",
  UY: "Urugvaj",
  UZ: "Uzbekistan",
  VA: "Vatikan",
  VC: "Saint Vincent in Grenadine",
  VE: "Venezuela",
  VG: "Britanski Deviški otoki",
  VI: "Ameriški Deviški otoki",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis in Futuna",
  WS: "Samoa",
  XK: "Kosovo",
  YE: "Jemen",
  YT: "Mayotte",
  ZA: "Južnoafriška republika",
  ZM: "Zambija",
  ZW: "Zimbabve"
};
const sl = {
  locale: locale$g,
  countries: countries$g
};
const locale$f = "so";
const countries$f = {
  AF: "Afgaanistaan",
  AL: "Albaaniya",
  DZ: "Aljeeriya",
  AS: "Samowa Ameerika",
  AD: "Andora",
  AO: "Angoola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua iyo Barbuda",
  AR: "Arjantiin",
  AM: "Armeeniya",
  AW: "Aruba",
  AU: "Awstaraaliya",
  AT: "Awsteriya",
  AZ: "Azerbajaan",
  BS: "Bahaamas",
  BH: "Baxreyn",
  BD: "Bangaaladheesh",
  BB: "Baarbadoos",
  BY: "Belarus",
  BE: "Biljam",
  BZ: "Belize",
  BJ: "Biniin",
  BM: "Bermuuda",
  BT: "Bhutan",
  BO: "Boliifiya",
  BA: "Bosniya Hersigoviina",
  BW: "Botuswaana",
  BV: "Jasiiradda Bouvet",
  BR: "Braasiil",
  IO: "British Indian Ocean Territory",
  BN: "Buruneeya",
  BG: "Bulgaariya",
  BF: "Burkiina Faaso",
  BI: "Burundi",
  KH: "Kamboodiya",
  CM: "Kaameruun",
  CA: "Kanada",
  CV: "Cape Verde Islands",
  KY: "Cayman Islands",
  CF: "Jamhuuriyadda Afrikada Dhexe",
  TD: "Jaad",
  CL: "Jili",
  CN: "Shiinaha",
  CX: "Jasiiradda Kirismaska",
  CC: "Jasiiradaha Cocos (Keeling)",
  CO: "Kolombiya",
  KM: "Komooros",
  CG: "Kongo",
  CD: "Jamhuuriyadda Dimuquraadiga Kongo",
  CK: "Jaziiradda Cook",
  CR: "Kosta Riika",
  CI: "Ivory coast",
  HR: "Korweeshiya",
  CU: "Kuuba",
  CY: "Qubrus",
  CZ: "Jamhuuriyadda Jek",
  DK: "Denmark",
  DJ: "Jabuuti",
  DM: "Domeenika",
  DO: "Jamhuuriyadda Domeenika",
  EC: "Ikuwadoor",
  EG: "Masar",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eretereeya",
  EE: "Estooniya",
  ET: "Itoobiya",
  FK: "Jaziiradaha Fooklaan",
  FO: "Jasiiradaha Faroe",
  FJ: "Fiji",
  FI: "Finland",
  FR: "Faransiis",
  GF: "French Guiana",
  PF: "French Polynesia",
  TF: "Gobollada Koofureed ee Faransiiska",
  GA: "Gaaboon",
  GM: "Gambiya",
  GE: "Joorjiya",
  DE: "Jarmal",
  GH: "Gaana",
  GI: "Gibraltar",
  GR: "Giriig",
  GL: "Greenland",
  GD: "Giriinaada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guwaatamaala",
  GN: "Gini",
  GW: "Gini-Bisaaw",
  GY: "Guyana",
  HT: "Hayti",
  HM: "Jasiiradaha Heard iyo McDonald Islands",
  VA: "Faatikaan",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hangeri",
  IS: "Iislaand",
  IN: "Hindiya",
  ID: "Indoneesiya",
  IR: "Iiraan",
  IQ: "Ciraaq",
  IE: "Ayrlaand",
  IL: "Israaʼiil",
  IT: "Talyaani",
  JM: "Jameyka",
  JP: "Jabaan",
  JO: "Urdun",
  KZ: "Kasaakhistaan",
  KE: "Kiiniya",
  KI: "Kiribati",
  KP: "Kuuriyada Waqooyi",
  KR: "Kuuriyada Koonfureed",
  KW: "Kuwayt",
  KG: "Kirgistaan",
  LA: "Laos",
  LV: "Latfiya",
  LB: "Lubnaan",
  LS: "Losooto",
  LR: "Laybeeriya",
  LY: "Liibiya",
  LI: "Liechtenstein",
  LT: "Lituweeniya",
  LU: "Luksemboorg",
  MO: "Macao",
  MG: "Madagaskar",
  MW: "Malaawi",
  MY: "Malaysia",
  MV: "Maaldiqeen",
  ML: "Maali",
  MT: "Maalda",
  MH: "Marshall Islands",
  MQ: "Martinique",
  MR: "Muritaaniya",
  MU: "Murishiyoos",
  YT: "Mayotte",
  MX: "Meksiko",
  FM: "Micronesia",
  MD: "Moldofa",
  MC: "Moonako",
  MN: "Mongooliya",
  MS: "Montserrat",
  MA: "Marooko",
  MZ: "Musambiig",
  MM: "Myanmar",
  NA: "Namiibiya",
  NR: "Nauru",
  NP: "Nebaal",
  NL: "Netherlands",
  NC: "New Caledonia",
  NZ: "Neyuusilaand",
  NI: "Nikaraaguwa",
  NE: "Nayjer",
  NG: "Nayjeeriya",
  NU: "Niue",
  NF: "Norfolk Island",
  MK: "Makadooniya",
  MP: "Northern Mariana Islands",
  NO: "Noorweey",
  OM: "Cumaan",
  PK: "Bakistaan",
  PW: "Palau",
  PS: "Falastiin Daanka galbeed iyo Qasa",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Filibiin",
  PN: "Pitcairn",
  PL: "Booland",
  PT: "Bortuqaal",
  PR: "Puerto Rico",
  QA: "Qadar",
  RE: "Réunion",
  RO: "Rumaaniya",
  RU: "Ruush",
  RW: "Ruwanda",
  SH: "Saint Helena",
  KN: "Saint Kitts and Nevis",
  LC: "Saint Lucia",
  PM: "Saint Pierre and Miquelon",
  VC: "Saint Vincent and the Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "São Tomé and Príncipe",
  SA: "Sacuudi Carabiya",
  SN: "Sinigaal",
  SC: "Sishelis",
  SL: "Siraaliyoon",
  SG: "Singaboor",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Soomaaliya",
  ZA: "Koonfur Afrika",
  GS: "Koonfurta Georgia iyo Koonfurta Sandwich Islands",
  ES: "Isbeyn",
  LK: "Sirilaanka",
  SD: "Suudaan",
  SR: "Suriname",
  SJ: "Svalbard iyo Jan Mayen",
  SZ: "Iswaasilaand",
  SE: "Iswidhan",
  CH: "Swiiserlaand",
  SY: "Suuriya",
  TW: "Taywaan",
  TJ: "Tajikistan",
  TZ: "Tansaaniya",
  TH: "Taylaand",
  TL: "Timorka bari",
  TG: "Toogo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tuniisiya",
  TR: "Turki",
  TM: "Turkmenistan",
  TC: "Turks and Caicos Islands",
  TV: "Tuvalu",
  UG: "Ugaanda",
  UA: "Ukrayn",
  AE: "Imaaraadka Carabta ee Midoobay",
  GB: "United Kingdom",
  US: "Maraykanka",
  UM: "Jasiiradaha yaryar ee ka baxsan Mareykanka",
  UY: "Uruguwaay",
  UZ: "Uusbakistaan",
  VU: "Vanuatu",
  VE: "Fenisuweela",
  VN: "Fiyetnaam",
  VG: "British Virgin Islands",
  VI: "U.S. Virgin Islands",
  WF: "Wallis and Futuna",
  EH: "Saxaraha Galbeed",
  YE: "Yaman",
  ZM: "Saambiya",
  ZW: "Simbaabwe",
  AX: "Jasiiradaha Åland",
  BQ: "Bonaire, Sint Eustatius iyo Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Jasiiradda Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint Barthélemy",
  MF: "Saint Martin (qayb Faransiis ah)",
  RS: "Serbia",
  SX: "Sint Maarten (Qaybta Nederlandka)",
  SS: "Koonfur Suudaan",
  XK: "Kosovo"
};
const so = {
  locale: locale$f,
  countries: countries$f
};
const locale$e = "sq";
const countries$e = {
  AF: "Afganistan",
  AL: "Shqipëri",
  DZ: "Algjeri",
  AS: "Samoa Amerikane",
  AD: "Andorrë",
  AO: "Angolë",
  AI: "Anguilë",
  AQ: "Antarktidë",
  AG: "Antigua & Barbuda",
  AR: "Argjentinë",
  AM: "Armeni",
  AW: "Arubë",
  AU: "Australi",
  AT: "Austri",
  AZ: "Azerbajxhan",
  BS: "Bahamas",
  BH: "Bahrein",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Bjellorusi",
  BE: "Belgjikë",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Butan",
  BO: "Bolivi",
  BA: "Bosnjë & Hercegovinë",
  BW: "Botsvanë",
  BV: "Ishulli Buve",
  BR: "Brazil",
  IO: "Territori Britanik i Oqeanit Indian",
  BN: "Brunej",
  BG: "Bullgari",
  BF: "Burkina Faso",
  BI: "Burund",
  KH: "Kamboxhia",
  CM: "Kamerun",
  CA: "Kanada",
  CV: "Kepi i Gjelbër",
  KY: "Ishujt Kajman",
  CF: "Republika Afrikano-Qendrore",
  TD: "Çad",
  CL: "Kili",
  CN: "Kinë",
  CX: "Ishulli i Krishtlindjes",
  CC: "Ishujt Kokos (Kiling)",
  CO: "Kolumbi",
  KM: "Komore",
  CG: "Kongo-Brazavil",
  CD: "Kongo-Kinshasa",
  CK: "Ishulli Kuk",
  CR: "Kosta Rikë",
  CI: "Bregu i Fildishtë",
  HR: "Kroaci",
  CU: "Kubë",
  CY: "Qipro",
  CZ: "Republika Çeke",
  DK: "Danimarkë",
  DJ: "Xhibut",
  DM: "Dominikë",
  DO: "Republika Dominikane",
  EC: "Ekuador",
  EG: "Egjipt",
  SV: "El Salvador",
  GQ: "Guineja Ekuatoriale",
  ER: "Eritre",
  EE: "Estoni",
  ET: "Etiopi",
  FK: "Ishujt Folkland",
  FO: "Ishujt Faroe",
  FJ: "Fixhi",
  FI: "Finlandë",
  FR: "Francë",
  GF: "Guajana Frënge",
  PF: "Polinezia Frënge",
  TF: "Territoret Frënge Jugore",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Gjeorgji",
  DE: "Gjermani",
  GH: "Gana",
  GI: "Gjibraltar",
  GR: "Greqi",
  GL: "Groenlandë",
  GD: "Grenadë",
  GP: "Guadalup",
  GU: "Guam",
  GT: "Guatemalë",
  GN: "Guine",
  GW: "Guinea-Bisau",
  GY: "Guajanë",
  HT: "Haiti",
  HM: "Ishujt Hërd & Mekdonald",
  VA: "Vatikan",
  HN: "Honduras",
  HK: "RVA i Hong Kongut Kinë",
  HU: "Hungari",
  IS: "Islandë",
  IN: "Indi",
  ID: "Indonezi",
  IR: "Iran",
  IQ: "Irak",
  IE: "Irlandë",
  IL: "Izrael",
  IT: "Itali",
  JM: "Xhamajkë",
  JP: "Japoni",
  JO: "Jordani",
  KZ: "Kazakistan",
  KE: "Kenia",
  KI: "Kiribati",
  KP: "Koreja e Veriut",
  KR: "Koreja e Jugut",
  KW: "Kuvajt",
  KG: "Kirgizstan",
  LA: "Laos",
  LV: "Letoni",
  LB: "Liban",
  LS: "Lesoto",
  LR: "Liberi",
  LY: "Libi",
  LI: "Lihtenshtein",
  LT: "Lituani",
  LU: "Luksemburg",
  MO: "RVA i Makaos Kinë",
  MG: "Madagaskar",
  MW: "Malavi",
  MY: "Malajzi",
  MV: "Maldive",
  ML: "Mali",
  MT: "Maltë",
  MH: "Ishujt Marshall",
  MQ: "Martinikë",
  MR: "Mauritani",
  MU: "Mauritius",
  YT: "Majote",
  MX: "Meksikë",
  FM: "Mikronezi",
  MD: "Moldavi",
  MC: "Monako",
  MN: "Mongoli",
  MS: "Montserat",
  MA: "Marok",
  MZ: "Mozambik",
  MM: "Mianmar (Burma)",
  NA: "Namibi",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Holandë",
  NC: "Kaledonia e Re",
  NZ: "Zelandë e Re",
  NI: "Nikaragua",
  NE: "Niger",
  NG: "Nigeri",
  NU: "Niue",
  NF: "Ishujt Norfolk",
  MK: "Maqedoni",
  MP: "Ishujt Veriorë Mariana",
  NO: "Norvegji",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Territoret Palestineze",
  PA: "Panama",
  PG: "Papua Guineja e Re",
  PY: "Paraguai",
  PE: "Peru",
  PH: "Filipine",
  PN: "Ishujt Pitkern",
  PL: "Poloni",
  PT: "Portugali",
  PR: "Porto Riko",
  QA: "Katar",
  RE: "Reunion",
  RO: "Rumani",
  RU: "Rusi",
  RW: "Ruandë",
  SH: "Shën Helena",
  KN: "Shën Kits e Nevis",
  LC: "Shën Luçia",
  PM: "Shën Pier dhe Mikëlon",
  VC: "Shën Vinsent & Grenadinet",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome & Prinsipe",
  SA: "Arabi Saudite",
  SN: "Senegal",
  SC: "Sejshelle",
  SL: "Sierra Leone",
  SG: "Singapor",
  SK: "Sllovaki",
  SI: "Slloveni",
  SB: "Ishujt Solomon",
  SO: "Somali",
  ZA: "Afrikë e Jugut",
  GS: "Xhorxha Jugore dhe Ishujt Sanduiç të Jugut",
  ES: "Spanjë",
  LK: "Sri Lankë",
  SD: "Sudan",
  SR: "Surinam",
  SJ: "Svalbard & Zhan Majen",
  SZ: "Svaziland",
  SE: "Suedi",
  CH: "Zvicër",
  SY: "Siri",
  TW: "Tajvan",
  TJ: "Taxhikistan",
  TZ: "Tanzani",
  TH: "Tajlandë",
  TL: "Timori Lindor",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad & Tobago",
  TN: "Tunizi",
  TR: "Turqi",
  TM: "Turkmenistan",
  TC: "Ishujt Turk & Kaikos",
  TV: "Tuvalu",
  UG: "Ugandë",
  UA: "Ukrainë",
  AE: "Emiratet e Bashkuara Arabe",
  GB: "Mbretëria e Bashkuar",
  US: "Shtetet e Bashkuara të Amerikës",
  UM: "Ishujt e Përtejmë SHBA-së",
  UY: "Uruguai",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuelë",
  VN: "Vietnam",
  VG: "Ishujt e Virgjër Britanikë",
  VI: "Ishujt e Virgjër Amerikanë",
  WF: "Uollis e Futuna",
  EH: "Sahara Perëndimore",
  YE: "Jemen",
  ZM: "Zambia",
  ZW: "Zimbabve",
  AX: "Ishujt Aland",
  BQ: "Karaibet Holandeze",
  CW: "Kurasao",
  GG: "Gërnsi",
  IM: "Ishulli i Robit",
  JE: "Xhërsi",
  ME: "Mali i Zi",
  BL: "Shën Bartolomeo",
  MF: "Shën Martin",
  RS: "Serbi",
  SX: "Shën Martin",
  SS: "Sudan i Jugut",
  XK: "Kosovë"
};
const sq = {
  locale: locale$e,
  countries: countries$e
};
const locale$d = "sr";
const countries$d = {
  AD: "Андора",
  AE: "Уједињени Арапски Емирати",
  AF: "Авганистан",
  AG: "Антигва и Барбуда",
  AI: "Ангвила",
  AL: "Албанија",
  AM: "Јерменија",
  AO: "Ангола",
  AQ: "Антарктик",
  AR: "Аргентина",
  AS: "Америчка Самоа",
  AT: "Аустрија",
  AU: "Аустралија",
  AW: "Аруба",
  AX: "Оландска Острва",
  AZ: "Азербејџан",
  BA: "Босна и Херцеговина",
  BB: "Барбадос",
  BD: "Бангладеш",
  BE: "Белгија",
  BF: "Буркина Фасо",
  BG: "Бугарска",
  BH: "Бахреин",
  BI: "Бурунди",
  BJ: "Бенин",
  BL: "Сен Бартелеми",
  BM: "Бермуда",
  BN: "Брунеј",
  BO: "Боливија",
  BQ: "Карипска Холандија",
  BR: "Бразил",
  BS: "Бахами",
  BT: "Бутан",
  BV: "Острво Буве",
  BW: "Боцвана",
  BY: "Белорусија",
  BZ: "Белизе",
  CA: "Канада",
  CC: "Кокосова (Килингова) Острва",
  CD: "Конго - Киншаса",
  CF: "Централноафричка Република",
  CG: "Конго - Бразавил",
  CH: "Швајцарска",
  CI: "Обала Слоноваче",
  CK: "Кукова Острва",
  CL: "Чиле",
  CM: "Камерун",
  CN: "Кина",
  CO: "Колумбија",
  CR: "Костарика",
  CU: "Куба",
  CV: "Зеленортска Острва",
  CW: "Курасао",
  CX: "Божићно Острво",
  CY: "Кипар",
  CZ: "Чешка",
  DE: "Немачка",
  DJ: "Џибути",
  DK: "Данска",
  DM: "Доминика",
  DO: "Доминиканска Република",
  DZ: "Алжир",
  EC: "Еквадор",
  EE: "Естонија",
  EG: "Египат",
  EH: "Западна Сахара",
  ER: "Еритреја",
  ES: "Шпанија",
  ET: "Етиопија",
  FI: "Финска",
  FJ: "Фиџи",
  FK: "Фокландска Острва",
  FM: "Микронезија",
  FO: "Фарска Острва",
  FR: "Француска",
  GA: "Габон",
  GB: "Уједињено Краљевство",
  GD: "Гренада",
  GE: "Грузија",
  GF: "Француска Гвајана",
  GG: "Гернзи",
  GH: "Гана",
  GI: "Гибралтар",
  GL: "Гренланд",
  GM: "Гамбија",
  GN: "Гвинеја",
  GP: "Гваделуп",
  GQ: "Екваторијална Гвинеја",
  GR: "Грчка",
  GS: "Јужна Џорџија и Јужна Сендвичка Острва",
  GT: "Гватемала",
  GU: "Гуам",
  GW: "Гвинеја-Бисао",
  GY: "Гвајана",
  HK: "САР Хонгконг (Кина)",
  HM: "Острво Херд и Мекдоналдова острва",
  HN: "Хондурас",
  HR: "Хрватска",
  HT: "Хаити",
  HU: "Мађарска",
  ID: "Индонезија",
  IE: "Ирска",
  IL: "Израел",
  IM: "Острво Ман",
  IN: "Индија",
  IO: "Британска територија Индијског океана",
  IQ: "Ирак",
  IR: "Иран",
  IS: "Исланд",
  IT: "Италија",
  JE: "Џерзи",
  JM: "Јамајка",
  JO: "Јордан",
  JP: "Јапан",
  KE: "Кенија",
  KG: "Киргистан",
  KH: "Камбоџа",
  KI: "Кирибати",
  KM: "Коморска Острва",
  KN: "Сент Китс и Невис",
  KP: "Северна Кореја",
  KR: "Јужна Кореја",
  KW: "Кувајт",
  KY: "Кајманска Острва",
  KZ: "Казахстан",
  LA: "Лаос",
  LB: "Либан",
  LC: "Света Луција",
  LI: "Лихтенштајн",
  LK: "Шри Ланка",
  LR: "Либерија",
  LS: "Лесото",
  LT: "Литванија",
  LU: "Луксембург",
  LV: "Летонија",
  LY: "Либија",
  MA: "Мароко",
  MC: "Монако",
  MD: "Молдавија",
  ME: "Црна Гора",
  MF: "Свети Мартин (Француска)",
  MG: "Мадагаскар",
  MH: "Маршалска Острва",
  MK: "Северна Македонија",
  ML: "Мали",
  MM: "Мијанмар (Бурма)",
  MN: "Монголија",
  MO: "САР Макао (Кина)",
  MP: "Северна Маријанска Острва",
  MQ: "Мартиник",
  MR: "Мауританија",
  MS: "Монсерат",
  MT: "Малта",
  MU: "Маурицијус",
  MV: "Малдиви",
  MW: "Малави",
  MX: "Мексико",
  MY: "Малезија",
  MZ: "Мозамбик",
  NA: "Намибија",
  NC: "Нова Каледонија",
  NE: "Нигер",
  NF: "Острво Норфок",
  NG: "Нигерија",
  NI: "Никарагва",
  NL: "Холандија",
  NO: "Норвешка",
  NP: "Непал",
  NR: "Науру",
  NU: "Ниуе",
  NZ: "Нови Зеланд",
  OM: "Оман",
  PA: "Панама",
  PE: "Перу",
  PF: "Француска Полинезија",
  PG: "Папуа Нова Гвинеја",
  PH: "Филипини",
  PK: "Пакистан",
  PL: "Пољска",
  PM: "Сен Пјер и Микелон",
  PN: "Питкерн",
  PR: "Порторико",
  PS: "Палестинске територије",
  PT: "Португалија",
  PW: "Палау",
  PY: "Парагвај",
  QA: "Катар",
  RE: "Реинион",
  RO: "Румунија",
  RS: "Србија",
  RU: "Русија",
  RW: "Руанда",
  SA: "Саудијска Арабија",
  SB: "Соломонска Острва",
  SC: "Сејшели",
  SD: "Судан",
  SE: "Шведска",
  SG: "Сингапур",
  SH: "Света Јелена",
  SI: "Словенија",
  SJ: "Свалбард и Јан Мајен",
  SK: "Словачка",
  SL: "Сијера Леоне",
  SM: "Сан Марино",
  SN: "Сенегал",
  SO: "Сомалија",
  SR: "Суринам",
  SS: "Јужни Судан",
  ST: "Сао Томе и Принципе",
  SV: "Салвадор",
  SX: "Свети Мартин (Холандија)",
  SY: "Сирија",
  SZ: "Свазиленд",
  TC: "Острва Туркс и Каикос",
  TD: "Чад",
  TF: "Француске Јужне Територије",
  TG: "Того",
  TH: "Тајланд",
  TJ: "Таџикистан",
  TK: "Токелау",
  TL: "Источни Тимор",
  TM: "Туркменистан",
  TN: "Тунис",
  TO: "Тонга",
  TR: "Турска",
  TT: "Тринидад и Тобаго",
  TV: "Тувалу",
  TW: "Тајван",
  TZ: "Танзанија",
  UA: "Украјина",
  UG: "Уганда",
  UM: "Удаљена острва САД",
  US: "Сједињене Државе",
  UY: "Уругвај",
  UZ: "Узбекистан",
  VA: "Ватикан",
  VC: "Сент Винсент и Гренадини",
  VE: "Венецуела",
  VG: "Британска Девичанска Острва",
  VI: "Америчка Девичанска Острва",
  VN: "Вијетнам",
  VU: "Вануату",
  WF: "Валис и Футуна",
  WS: "Самоа",
  XK: "Косово",
  YE: "Јемен",
  YT: "Мајот",
  ZA: "Јужноафричка Република",
  ZM: "Замбија",
  ZW: "Зимбабве"
};
const sr = {
  locale: locale$d,
  countries: countries$d
};
const locale$c = "sv";
const countries$c = {
  AD: "Andorra",
  AE: "Förenade Arabemiraten",
  AF: "Afghanistan",
  AG: "Antigua och Barbuda",
  AI: "Anguilla",
  AL: "Albanien",
  AM: "Armenien",
  AO: "Angola",
  AQ: "Antarktis",
  AR: "Argentina",
  AS: "Amerikanska Samoa",
  AT: "Österrike",
  AU: "Australien",
  AW: "Aruba",
  AX: "Åland",
  AZ: "Azerbajdzjan",
  BA: "Bosnien och Hercegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgien",
  BF: "Burkina Faso",
  BG: "Bulgarien",
  BH: "Bahrain",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint-Barthélemy",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivia",
  BQ: "Bonaire, Saint Eustatius och Saba",
  BR: "Brasilien",
  BS: "Bahamas",
  BT: "Bhutan",
  BV: "Bouvetön",
  BW: "Botswana",
  BY: "Belarus",
  BZ: "Belize",
  CA: "Kanada",
  CC: "Kokosöarna",
  CD: "Demokratiska republiken Kongo",
  CF: "Centralafrikanska republiken",
  CG: "Kongo-Brazzaville",
  CH: "Schweiz",
  CI: "Elfenbenskusten",
  CK: "Cooköarna",
  CL: "Chile",
  CM: "Kamerun",
  CN: "Kina",
  CO: "Colombia",
  CR: "Costa Rica",
  CU: "Kuba",
  CV: "Kap Verde",
  CW: "Curacao",
  CX: "Julön",
  CY: "Cypern",
  CZ: "Tjeckien",
  DE: "Tyskland",
  DJ: "Djibouti",
  DK: "Danmark",
  DM: "Dominica",
  DO: "Dominikanska republiken",
  DZ: "Algeriet",
  EC: "Ecuador",
  EE: "Estland",
  EG: "Egypten",
  EH: "Västsahara",
  ER: "Eritrea",
  ES: "Spanien",
  ET: "Etiopien",
  FI: "Finland",
  FJ: "Fiji",
  FK: "Falklandsöarna",
  FM: "Mikronesiska federationen",
  FO: "Färöarna",
  FR: "Frankrike",
  GA: "Gabon",
  GB: "Storbritannien",
  GD: "Grenada",
  GE: "Georgien",
  GF: "Franska Guyana",
  GG: "Guernsey",
  GH: "Ghana",
  GI: "Gibraltar",
  GL: "Grönland",
  GM: "Gambia",
  GN: "Guinea",
  GP: "Guadeloupe",
  GQ: "Ekvatorialguinea",
  GR: "Grekland",
  GS: "Sydgeorgien och Sydsandwichöarna",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Guinea Bissau",
  GY: "Guyana",
  HK: "Hongkong",
  HM: "Heard- och McDonaldsöarna",
  HN: "Honduras",
  HR: "Kroatien",
  HT: "Haiti",
  HU: "Ungern",
  ID: "Indonesien",
  IE: "Irland",
  IL: "Israel",
  IM: "Isle of Man",
  IN: "Indien",
  IO: "Brittiska territoriet i Indiska Oceanen",
  IQ: "Irak",
  IR: "Iran",
  IS: "Island",
  IT: "Italien",
  JE: "Jersey",
  JM: "Jamaica",
  JO: "Jordanien",
  JP: "Japan",
  KE: "Kenya",
  KG: "Kirgizistan",
  KH: "Kambodja",
  KI: "Kiribati",
  KM: "Komorerna",
  KN: "Saint Kitts och Nevis",
  KP: "Nordkorea",
  KR: "Sydkorea",
  KW: "Kuwait",
  KY: "Caymanöarna",
  KZ: "Kazakstan",
  LA: "Laos",
  LB: "Libanon",
  LC: "Saint Lucia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberia",
  LS: "Lesotho",
  LT: "Litauen",
  LU: "Luxemburg",
  LV: "Lettland",
  LY: "Libyen",
  MA: "Marocko",
  MC: "Monaco",
  MD: "Moldavien",
  ME: "Montenegro",
  MF: "Saint Martin (franska delen)",
  MG: "Madagaskar",
  MH: "Marshallöarna",
  MK: "Nordmakedonien",
  ML: "Mali",
  MM: "Burma",
  MN: "Mongoliet",
  MO: "Macau",
  MP: "Nordmarianerna",
  MQ: "Martinique",
  MR: "Mauretanien",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldiverna",
  MW: "Malawi",
  MX: "Mexiko",
  MY: "Malaysia",
  MZ: "Moçambique",
  NA: "Namibia",
  NC: "Nya Kaledonien",
  NE: "Niger",
  NF: "Norfolkön",
  NG: "Nigeria",
  NI: "Nicaragua",
  NL: "Nederländerna",
  NO: "Norge",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Nya Zeeland",
  OM: "Oman",
  PA: "Panama",
  PE: "Peru",
  PF: "Franska Polynesien",
  PG: "Papua Nya Guinea",
  PH: "Filippinerna",
  PK: "Pakistan",
  PL: "Polen",
  PM: "Saint-Pierre och Miquelon",
  PN: "Pitcairnöarna",
  PR: "Puerto Rico",
  PS: "Palestinska territoriet, ockuperade",
  PT: "Portugal",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Qatar",
  RE: "Réunion",
  RO: "Rumänien",
  RS: "Serbien",
  RU: "Ryssland",
  RW: "Rwanda",
  SA: "Saudiarabien",
  SB: "Salomonöarna",
  SC: "Seychellerna",
  SD: "Sudan",
  SE: "Sverige",
  SG: "Singapore",
  SH: "Sankta Helena",
  SI: "Slovenien",
  SJ: "Svalbard och Jan Mayen",
  SK: "Slovakien",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somalia",
  SR: "Surinam",
  SS: "Sydsudan",
  ST: "São Tomé och Príncipe",
  SV: "El Salvador",
  SX: "Sint Maarten (nederländska delen)",
  SY: "Syrien",
  SZ: "Eswatini",
  TC: "Turks- och Caicosöarna",
  TD: "Tchad",
  TF: "Franska södra territorierna",
  TG: "Togo",
  TH: "Thailand",
  TJ: "Tadzjikistan",
  TK: "Tokelauöarna",
  TL: "Östtimor",
  TM: "Turkmenistan",
  TN: "Tunisien",
  TO: "Tonga",
  TR: "Turkiet",
  TT: "Trinidad och Tobago",
  TV: "Tuvalu",
  TW: "Taiwan",
  TZ: "Tanzania",
  UA: "Ukraina",
  UG: "Uganda",
  UM: "USA:s yttre öar",
  US: "USA",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VA: "Vatikanstaten",
  VC: "Saint Vincent och Grenadinerna",
  VE: "Venezuela",
  VG: "Brittiska Jungfruöarna",
  VI: "Amerikanska Jungfruöarna",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis- och Futunaöarna",
  WS: "Samoa",
  YE: "Jemen",
  YT: "Mayotte",
  ZA: "Sydafrika",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  XK: "Kosovo"
};
const sv = {
  locale: locale$c,
  countries: countries$c
};
const locale$b = "sw";
const countries$b = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "Samoa ya Marekani",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antaktiki",
  AG: "Antigua na Barbuda",
  AR: "Ajentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azabajani",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarusi",
  BE: "Ubelgiji",
  BZ: "Belize",
  BJ: "Benign",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia na Herzegovina",
  BW: "Botswana",
  BV: "Kisiwa cha Bouvet",
  BR: "Brazil",
  IO: "Bahari ya Hindi ya Uingereza",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Kamboja",
  CM: "Kamerun",
  CA: "Canada",
  CV: "Kofia ya kijani",
  KY: "Visiwa vya Cayman",
  CF: "Jamhuri ya Afrika ya Kati",
  TD: "Chad",
  CL: "Chile",
  CN: "Uchina",
  CX: "Kisiwa cha Krismasi",
  CC: "Cocos",
  CO: "Kolombia",
  KM: "Comoro",
  CG: "Jamhuri ya Kongo",
  CD: "Kongo, Jamhuri ya Kidemokrasia",
  CK: "Visiwa vya Cook",
  CR: "Costa Rica",
  CI: "Pwani ya Pembe",
  HR: "Kroatia",
  CU: "Cuba",
  CY: "Kupro",
  CZ: "Jamhuri ya Czech",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Jamhuri ya Dominika",
  EC: "Ekvado",
  EG: "Misri",
  SV: "El Salvador",
  GQ: "Guinea ya Ikweta",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Visiwa vya Falkland",
  FO: "Visiwa vya Faroe",
  FJ: "Fiji",
  FI: "Ufini",
  FR: "Ufaransa",
  GF: "Guiana ya Ufaransa",
  PF: "Polynesia ya Ufaransa",
  TF: "Wilaya za Kusini mwa Ufaransa",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Ujerumani",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Ugiriki",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Gine",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Visiwa vya Heard na MacDonald",
  VA: "Holy See",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israeli",
  IT: "Italia",
  JM: "Jamaica",
  JP: "Japani",
  JO: "Yordani",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Korea Kaskazini, Jamhuri ya Watu wa Kidemokrasiaatique",
  KR: "Korea Kusini, Jamhuri",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Laos",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxemburg",
  MO: "Macao",
  MK: "Makedonia Kaskazini",
  MG: "Madagaska",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Visiwa vya Marshall",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Maurice",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Micronesia",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  MS: "Montserrat",
  MA: "Moroko",
  MZ: "Msumbiji",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Uholanzi",
  NC: "Kaledonia mpya",
  NZ: "New Zealand",
  NI: "Nikaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Kisiwa cha Norfolk",
  MP: "Mariana ya Kaskazini",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestina",
  PA: "Panama",
  PG: "Papua Guinea Mpya",
  PY: "Paragwai",
  PE: "Peru",
  PH: "Ufilipino",
  PN: "Pitcairn",
  PL: "Poland",
  PT: "Ureno",
  PR: "Porto Rico",
  QA: "Qatar",
  RE: "Mkutano",
  RO: "Romania",
  RU: "Urusi",
  RW: "Rwanda",
  SH: "Mtakatifu Helena",
  KN: "Mtakatifu Kitts na Nevis",
  LC: "Mtakatifu LUCIA",
  PM: "Mtakatifu Pierre na Miquelon",
  VC: "Saint Vincent na Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome na Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  SC: "Shelisheli",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Sulemani",
  SO: "Somalia",
  ZA: "Africa Kusini",
  GS: "Georgia Kusini na Visiwa vya Sandwich Kusini",
  ES: "Uhispania",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard na Kisiwa cha Jan Mayen",
  SZ: "Ngwane, Ufalme wa Eswatini",
  SE: "Uswidi",
  CH: "Uswisi",
  SY: "Syria",
  TW: "Taiwan",
  TJ: "Tajikistani",
  TZ: "Tanzania, Jamhuri ya Muungano",
  TH: "Thailand",
  TL: "Timor Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad na Tobago",
  TN: "Tunisia",
  TR: "Uturuki",
  TM: "Turkmenistan",
  TC: "Visiwa vya Turks na Caicos",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "Falme za Kiarabu",
  GB: "Uingereza",
  US: "Amerika",
  UM: "Visiwa Vidogo vilivyo nje ya Merika",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  VG: "Visiwa vya Briteni vya Uingereza",
  VI: "Visiwa vya Bikira za Amerika",
  WF: "Wallis na futuna",
  EH: "Sahara Magharibi",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Bara",
  BQ: "Bonaire, Saint-Eustache na Saba",
  CW: "Curacao",
  GG: "Guernsey",
  IM: "Kisiwa cha mwanadamu",
  JE: "Jezi",
  ME: "Montenegro",
  BL: "Mtakatifu-Barthélemy",
  MF: "Saint-Martin (sehemu ya Kifaransa)",
  RS: "Serbia",
  SX: "Saint-Martin (sehemu ya Uholanzi)",
  SS: "Sudan Kusini",
  XK: "Kosovo"
};
const sw = {
  locale: locale$b,
  countries: countries$b
};
const locale$a = "ta";
const countries$a = {
  AF: "ஆப்கானிஸ்தான்",
  AL: "அல்பேனியா",
  DZ: "அல்ஜீரியா",
  AS: "அமெரிக்க சமோவா",
  AD: "அன்டோரா",
  AO: "அங்கோலா",
  AI: "அங்குய்லா",
  AQ: "அண்டார்டிகா",
  AG: "ஆண்டிகுவா மற்றும் பார்புடா",
  AR: "அர்ஜென்டினா",
  AM: "ஆர்மேனியா",
  AW: "அரூபா",
  AU: "ஆஸ்திரேலியா",
  AT: "ஆஸ்திரியா",
  AZ: "அசர்பைஜான்",
  BS: "பஹாமாஸ்",
  BH: "பஹ்ரைன்",
  BD: "பங்களாதேஷ்",
  BB: "பார்படோஸ்",
  BY: "பெலாரூஸ்",
  BE: "பெல்ஜியம்",
  BZ: "பெலிஸ்",
  BJ: "பெனின்",
  BM: "பெர்முடா",
  BT: "பூடான்",
  BO: "பொலிவியா",
  BA: "போஸ்னியா மற்றும் ஹெர்ஸிகோவினா",
  BW: "போட்ஸ்வானா",
  BV: "பொவேட் தீவுகள்",
  BR: "பிரேசில்",
  IO: "பிரிட்டிஷ் இந்தியப் பெருங்கடல் பிரதேசம்",
  BN: "புரூனேய்",
  BG: "பல்கேரியா",
  BF: "புர்கினா ஃபாஸோ",
  BI: "புருண்டி",
  KH: "கம்போடியா",
  CM: "கேமரூன்",
  CA: "கனடா",
  CV: "கேப் வெர்டே",
  KY: "கேமென் தீவுகள்",
  CF: "மத்திய ஆப்ரிக்கக் குடியரசு",
  TD: "சாட்",
  CL: "சிலி",
  CN: "சீனா",
  CX: "கிறிஸ்துமஸ் தீவு",
  CC: "கோகோஸ் (கீலிங்) தீவுகள்",
  CO: "கொலம்பியா",
  KM: "கோமரோஸ்",
  CG: "காங்கோ - ப்ராஸாவில்லே",
  CD: "காங்கோ - கின்ஷாசா",
  CK: "குக் தீவுகள்",
  CR: "கோஸ்டாரிகா",
  CI: "கோட் தி’வாயர்",
  HR: "குரோசியா",
  CU: "கியூபா",
  CY: "சைப்ரஸ்",
  CZ: "செக் குடியரசு",
  DK: "டென்மார்க்",
  DJ: "ஜிபௌட்டி",
  DM: "டொமினிகா",
  DO: "டொமினிகன் குடியரசு",
  EC: "ஈக்வடார்",
  EG: "எகிப்து",
  SV: "எல் சால்வடார்",
  GQ: "ஈக்குவாடோரியல் கினியா",
  ER: "எரிட்ரியா",
  EE: "எஸ்டோனியா",
  ET: "எதியோப்பியா",
  FK: "ஃபாக்லாந்து தீவுகள்",
  FO: "ஃபாரோ தீவுகள்",
  FJ: "ஃபிஜி",
  FI: "பின்லாந்து",
  FR: "பிரான்ஸ்",
  GF: "பிரெஞ்சு கயானா",
  PF: "பிரெஞ்சு பாலினேஷியா",
  TF: "பிரெஞ்சு தெற்கு பிரதேசங்கள்",
  GA: "கேபான்",
  GM: "காம்பியா",
  GE: "ஜார்ஜியா",
  DE: "ஜெர்மனி",
  GH: "கானா",
  GI: "ஜிப்ரால்டர்",
  GR: "கிரீஸ்",
  GL: "கிரீன்லாந்து",
  GD: "கிரனெடா",
  GP: "க்வாதேலோப்",
  GU: "குவாம்",
  GT: "கவுதமாலா",
  GN: "கினியா",
  GW: "கினி-பிஸ்ஸாவ்",
  GY: "கயானா",
  HT: "ஹெய்தி",
  HM: "ஹேர்ட் மற்றும் மெக்டொனால்டு தீவுகள்",
  VA: "வாடிகன் நகரம்",
  HN: "ஹோண்டூராஸ்",
  HK: "ஹாங்காங் எஸ்ஏஆர் சீனா",
  HU: "ஹங்கேரி",
  IS: "ஐஸ்லாந்து",
  IN: "இந்தியா",
  ID: "இந்தோனேஷியா",
  IR: "ஈரான்",
  IQ: "ஈராக்",
  IE: "அயர்லாந்து",
  IL: "இஸ்ரேல்",
  IT: "இத்தாலி",
  JM: "ஜமைகா",
  JP: "ஜப்பான்",
  JO: "ஜோர்டான்",
  KZ: "கஸகஸ்தான்",
  KE: "கென்யா",
  KI: "கிரிபடி",
  KP: "வட கொரியா",
  KR: "தென் கொரியா",
  KW: "குவைத்",
  KG: "கிர்கிஸ்தான்",
  LA: "லாவோஸ்",
  LV: "லாட்வியா",
  LB: "லெபனான்",
  LS: "லெசோதோ",
  LR: "லைபீரியா",
  LY: "லிபியா",
  LI: "லிச்செண்ஸ்டெய்ன்",
  LT: "லிதுவேனியா",
  LU: "லக்ஸ்சம்பர்க்",
  MO: "மகாவோ எஸ்ஏஆர் சீனா",
  MG: "மடகாஸ்கர்",
  MW: "மாலவி",
  MY: "மலேஷியா",
  MV: "மாலத்தீவு",
  ML: "மாலி",
  MT: "மால்டா",
  MH: "மார்ஷல் தீவுகள்",
  MQ: "மார்டினிக்",
  MR: "மௌரிடானியா",
  MU: "மொரிசியஸ்",
  YT: "மயோத்",
  MX: "மெக்சிகோ",
  FM: "மைக்ரோனேஷியா",
  MD: "மால்டோவா",
  MC: "மொனாக்கோ",
  MN: "மங்கோலியா",
  MS: "மௌன்ட்செராட்",
  MA: "மொராக்கோ",
  MZ: "மொசாம்பிக்",
  MM: "மியான்மார் (பர்மா)",
  NA: "நமீபியா",
  NR: "நௌரு",
  NP: "நேபாளம்",
  NL: "நெதர்லாந்து",
  NC: "நியூ கேலிடோனியா",
  NZ: "நியூசிலாந்து",
  NI: "நிகரகுவா",
  NE: "நைஜர்",
  NG: "நைஜீரியா",
  NU: "நியூ",
  NF: "நார்ஃபாக் தீவுகள்",
  MK: "மாசிடோனியா",
  MP: "வடக்கு மரியானா தீவுகள்",
  NO: "நார்வே",
  OM: "ஓமன்",
  PK: "பாகிஸ்தான்",
  PW: "பாலோ",
  PS: "பாலஸ்தீனிய பிரதேசங்கள்",
  PA: "பனாமா",
  PG: "பாப்புவா நியூ கினி",
  PY: "பராகுவே",
  PE: "பெரு",
  PH: "பிலிப்பைன்ஸ்",
  PN: "பிட்கெய்ர்ன் தீவுகள்",
  PL: "போலந்து",
  PT: "போர்ச்சுக்கல்",
  PR: "பியூர்டோ ரிகோ",
  QA: "கத்தார்",
  RE: "ரீயூனியன்",
  RO: "ருமேனியா",
  RU: "ரஷ்யா",
  RW: "ருவான்டா",
  SH: "செயின்ட் ஹெலெனா",
  KN: "செயின்ட் கிட்ஸ் மற்றும் நெவிஸ்",
  LC: "செயின்ட் லூசியா",
  PM: "செயின்ட் பியர் மற்றும் மிக்வேலான்",
  VC: "செயின்ட் வின்சென்ட் மற்றும் கிரெனடைன்ஸ்",
  WS: "சமோவா",
  SM: "சான் மெரினோ",
  ST: "சாவ் தோம் மற்றும் ப்ரின்சிபி",
  SA: "சவூதி அரேபியா",
  SN: "செனெகல்",
  SC: "ஸேசேல்ஸ்",
  SL: "சியர்ரா லியோன்",
  SG: "சிங்கப்பூர்",
  SK: "ஸ்லோவாகியா",
  SI: "ஸ்லோவேனியா",
  SB: "சாலமன் தீவுகள்",
  SO: "சோமாலியா",
  ZA: "தென் ஆப்பிரிக்கா",
  GS: "தென் ஜியார்ஜியா மற்றும் தென் சான்ட்விச் தீவுகள்",
  ES: "ஸ்பெயின்",
  LK: "இலங்கை",
  SD: "சூடான்",
  SR: "சுரினாம்",
  SJ: "ஸ்வல்பார்டு மற்றும் ஜான் மேயன்",
  SZ: "ஸ்வாஸிலாந்து",
  SE: "ஸ்வீடன்",
  CH: "ஸ்விட்சர்லாந்து",
  SY: "சிரியா",
  TW: "தைவான்",
  TJ: "தாஜிகிஸ்தான்",
  TZ: "தான்சானியா",
  TH: "தாய்லாந்து",
  TL: "தைமூர்-லெஸ்தே",
  TG: "டோகோ",
  TK: "டோகேலோ",
  TO: "டோங்கா",
  TT: "ட்ரினிடாட் மற்றும் டுபாகோ",
  TN: "டுனிசியா",
  TR: "துருக்கி",
  TM: "துர்க்மெனிஸ்தான்",
  TC: "டர்க்ஸ் மற்றும் கைகோஸ் தீவுகள்",
  TV: "துவாலூ",
  UG: "உகாண்டா",
  UA: "உக்ரைன்",
  AE: "ஐக்கிய அரபு எமிரேட்ஸ்",
  GB: "ஐக்கிய பேரரசு",
  US: "அமெரிக்கா",
  UM: "யூஎஸ் அவுட்லேயிங் தீவுகள்",
  UY: "உருகுவே",
  UZ: "உஸ்பெகிஸ்தான்",
  VU: "வனுவாட்டு",
  VE: "வெனிசுலா",
  VN: "வியட்நாம்",
  VG: "பிரிட்டீஷ் கன்னித் தீவுகள்",
  VI: "யூ.எஸ். கன்னித் தீவுகள்",
  WF: "வாலிஸ் மற்றும் ஃபுடுனா",
  EH: "மேற்கு சஹாரா",
  YE: "ஏமன்",
  ZM: "ஜாம்பியா",
  ZW: "ஜிம்பாப்வே",
  AX: "ஆலந்து தீவுகள்",
  BQ: "கரீபியன் நெதர்லாந்து",
  CW: "குராகவ்",
  GG: "கெர்ன்சி",
  IM: "ஐல் ஆஃப் மேன்",
  JE: "ஜெர்சி",
  ME: "மான்டேனெக்ரோ",
  BL: "செயின்ட் பார்தேலெமி",
  MF: "செயின்ட் மார்ட்டீன்",
  RS: "செர்பியா",
  SX: "சின்ட் மார்டென்",
  SS: "தெற்கு சூடான்",
  XK: "கொசோவோ"
};
const ta = {
  locale: locale$a,
  countries: countries$a
};
const locale$9 = "tg";
const countries$9 = {
  AF: "Афғонистон",
  AL: "Албания",
  DZ: "Алҷазоир",
  AS: "Самоаи Америка",
  AD: "Андорра",
  AO: "Ангола",
  AI: "Ангилия",
  AQ: "Антарктида",
  AG: "Антигуа ва Барбуда",
  AR: "Аргентина",
  AM: "Арманистон",
  AW: "Аруба",
  AU: "Австралия",
  AT: "Австрия",
  AZ: "Озарбойҷон",
  BS: "Багам",
  BH: "Баҳрайн",
  BD: "Бангладеш",
  BB: "Барбадос",
  BY: "Белорус",
  BE: "Белгия",
  BZ: "Белиз",
  BJ: "Бенин",
  BM: "Бермуда",
  BT: "Бутон",
  BO: "Боливия",
  BA: "Босния ва Ҳерсеговина",
  BW: "Ботсвана",
  BV: "Ҷазираи Буве",
  BR: "Бразилия",
  IO: "Қаламрави Британия дар уқёнуси Ҳинд",
  BN: "Бруней",
  BG: "Булғория",
  BF: "Буркина-Фасо",
  BI: "Бурунди",
  KH: "Камбоҷа",
  CM: "Камерун",
  CA: "Канада",
  CV: "Кабо-Верде",
  KY: "Ҷазираҳои Кайман",
  CF: "Ҷумҳурии Африқои Марказӣ",
  TD: "Чад",
  CL: "Чили",
  CN: "Хитой",
  CX: "Ҷазираи Крисмас",
  CC: "Ҷазираҳои Кокос (Килинг)",
  CO: "Колумбия",
  KM: "Комор",
  CG: "Конго",
  CD: "Конго, Ҷумҳурии Демократии",
  CK: "Ҷазираҳои Кук",
  CR: "Коста-Рика",
  CI: "Кот-д’Ивуар",
  HR: "Хорватия",
  CU: "Куба",
  CY: "Кипр",
  CZ: "Ҷумҳурии Чех",
  DK: "Дания",
  DJ: "Ҷибути",
  DM: "Доминика",
  DO: "Ҷумҳурии Доминикан",
  EC: "Эквадор",
  EG: "Миср",
  SV: "Эл-Салвадор",
  GQ: "Гвинеяи Экваторӣ",
  ER: "Эритрея",
  EE: "Эстония",
  ET: "Эфиопия",
  FK: "Ҷазираҳои Фолкленд",
  FO: "Ҷазираҳои Фарер",
  FJ: "Фиҷи",
  FI: "Финляндия",
  FR: "Фаронса",
  GF: "Гвианаи Фаронса",
  PF: "Полинезияи Фаронса",
  TF: "Минтақаҳои Ҷанубии Фаронса",
  GA: "Габон",
  GM: "Гамбия",
  GE: "Гурҷистон",
  DE: "Германия",
  GH: "Гана",
  GI: "Гибралтар",
  GR: "Юнон",
  GL: "Гренландия",
  GD: "Гренада",
  GP: "Гваделупа",
  GU: "Гуам",
  GT: "Гватемала",
  GN: "Гвинея",
  GW: "Гвинея-Бисау",
  GY: "Гайана",
  HT: "Гаити",
  HM: "Ҷазираи Ҳерд ва Ҷазираҳои Макдоналд",
  VA: "Шаҳри Вотикон",
  HN: "Гондурас",
  HK: "Ҳонконг (МММ)",
  HU: "Маҷористон",
  IS: "Исландия",
  IN: "Ҳиндустон",
  ID: "Индонезия",
  IR: "Эрон",
  IQ: "Ироқ",
  IE: "Ирландия",
  IL: "Исроил",
  IT: "Италия",
  JM: "Ямайка",
  JP: "Япония",
  JO: "Урдун",
  KZ: "Қазоқистон",
  KE: "Кения",
  KI: "Кирибати",
  KP: "Кореяи Шимолӣ",
  KR: "Кореяи ҷанубӣ",
  KW: "Қувайт",
  KG: "Қирғизистон",
  LA: "Лаос",
  LV: "Латвия",
  LB: "Лубнон",
  LS: "Лесото",
  LR: "Либерия",
  LY: "Либия",
  LI: "Лихтенштейн",
  LT: "Литва",
  LU: "Люксембург",
  MO: "Макао (МММ)",
  MG: "Мадагаскар",
  MW: "Малави",
  MY: "Малайзия",
  MV: "Малдив",
  ML: "Мали",
  MT: "Малта",
  MH: "Ҷазираҳои Маршалл",
  MQ: "Мартиника",
  MR: "Мавритания",
  MU: "Маврикий",
  YT: "Майотта",
  MX: "Мексика",
  FM: "Штатҳои Федеративии Микронезия",
  MD: "Молдова",
  MC: "Монако",
  MN: "Муғулистон",
  MS: "Монтсеррат",
  MA: "Марокаш",
  MZ: "Мозамбик",
  MM: "Мянма",
  NA: "Намибия",
  NR: "Науру",
  NP: "Непал",
  NL: "Нидерландия",
  NC: "Каледонияи Нав",
  NZ: "Зеландияи Нав",
  NI: "Никарагуа",
  NE: "Нигер",
  NG: "Нигерия",
  NU: "Ниуэ",
  NF: "Ҷазираи Норфолк",
  MK: "Македонияи Шимолӣ",
  MP: "Ҷазираҳои Марианаи Шимолӣ",
  NO: "Норвегия",
  OM: "Умон",
  PK: "Покистон",
  PW: "Палау",
  PS: "Фаластин",
  PA: "Панама",
  PG: "Папуа Гвинеяи Нав",
  PY: "Парагвай",
  PE: "Перу",
  PH: "Филиппин",
  PN: "Ҷазираҳои Питкейрн",
  PL: "Лаҳистон",
  PT: "Португалия",
  PR: "Пуэрто-Рико",
  QA: "Қатар",
  RE: "Реюнион",
  RO: "Руминия",
  RU: "Русия",
  RW: "Руанда",
  SH: "Сент Елена",
  KN: "Сент-Китс ва Невис",
  LC: "Сент-Люсия",
  PM: "Сент-Пер ва Микелон",
  VC: "Сент-Винсент ва Гренадина",
  WS: "Самоа",
  SM: "Сан-Марино",
  ST: "Сан Томе ва Принсипи",
  SA: "Арабистони Саудӣ",
  SN: "Сенегал",
  SC: "Сейшел",
  SL: "Сиерра-Леоне",
  SG: "Сингапур",
  SK: "Словакия",
  SI: "Словения",
  SB: "Ҷазираҳои Соломон",
  SO: "Сомалӣ",
  ZA: "Африкаи Ҷанубӣ",
  GS: "Ҷорҷияи Ҷанубӣ ва Ҷазираҳои Сандвич",
  ES: "Испания",
  LK: "Шри-Ланка",
  SD: "Судон",
  SR: "Суринам",
  SJ: "Шпитсберген ва Ян Майен",
  SZ: "Свазиленд",
  SE: "Шветсия",
  CH: "Швейтсария",
  SY: "Сурия",
  TW: "Тайван",
  TJ: "Тоҷикистон",
  TZ: "Танзания",
  TH: "Таиланд",
  TL: "Тимор-Лесте",
  TG: "Того",
  TK: "Токелау",
  TO: "Тонга",
  TT: "Тринидад ва Тобаго",
  TN: "Тунис",
  TR: "Туркия",
  TM: "Туркманистон",
  TC: "Ҷазираҳои Теркс ва Кайкос",
  TV: "Тувалу",
  UG: "Уганда",
  UA: "Украина",
  AE: "Аморатҳои Муттаҳидаи Араб",
  GB: "Шоҳигарии Муттаҳида",
  US: "Иёлоти Муттаҳида",
  UM: "Ҷазираҳои Хурди Дурдасти ИМА",
  UY: "Уругвай",
  UZ: "Ӯзбекистон",
  VU: "Вануату",
  VE: "Венесуэла",
  VN: "Ветнам",
  VG: "Ҷазираҳои Виргини Британия",
  VI: "Ҷазираҳои Виргини ИМА",
  WF: "Уоллис ва Футуна",
  EH: "Саҳрои Ғарбӣ",
  YE: "Яман",
  ZM: "Замбия",
  ZW: "Зимбабве",
  AX: "Ҷазираҳои Аланд",
  BQ: "Бонайре, Синт Эстатиус ва Саба",
  CW: "Кюрасао",
  GG: "Гернси",
  IM: "Ҷазираи Мэн",
  JE: "Ҷерси",
  ME: "Черногория",
  BL: "Сент-Бартелми",
  MF: "Ҷазираи Сент-Мартин",
  RS: "Сербия",
  SX: "Синт-Маартен",
  SS: "Судони Ҷанубӣ",
  XK: "Косово"
};
const tg = {
  locale: locale$9,
  countries: countries$9
};
const locale$8 = "th";
const countries$8 = {
  BD: "บังกลาเทศ",
  BE: "เบลเยียม",
  BF: "บูร์กินาฟาโซ",
  BG: "บัลแกเรีย",
  BA: "บอสเนียและเฮอร์เซโกวีนา",
  BB: "บาร์เบโดส",
  WF: "วาลลิสและฟุตูนา",
  BL: "เซนต์บาร์เธเลมี",
  BM: "เบอร์มิวดา",
  BN: "บรูไน",
  BO: "โบลิเวีย",
  BH: "บาห์เรน",
  BI: "บุรุนดี",
  BJ: "เบนิน",
  BT: "ภูฏาน",
  JM: "จาเมกา",
  BV: "เกาะบูเวต",
  BW: "บอตสวานา",
  WS: "ซามัว",
  BR: "บราซิล",
  BS: "บาฮามาส",
  JE: "เจอร์ซีย์",
  BY: "เบลารุส",
  BZ: "เบลีซ",
  RU: "รัสเซีย",
  RW: "รวันดา",
  RS: "เซอร์เบีย",
  TL: "ติมอร์ตะวันออก",
  RE: "เรอูนียง",
  TM: "เติร์กเมนิสถาน",
  TJ: "ทาจิกิสถาน",
  RO: "โรมาเนีย",
  TK: "โตเกเลา",
  GW: "กินี-บิสเซา",
  GU: "กวม",
  GT: "กัวเตมาลา",
  GS: "เกาะเซาท์จอร์เจียและหมู่เกาะเซาท์แซนด์วิช",
  GR: "กรีซ",
  GQ: "อิเควทอเรียลกินี",
  GP: "กวาเดอลูป",
  JP: "ญี่ปุ่น",
  GY: "กายอานา",
  GG: "เกิร์นซีย์",
  GF: "เฟรนช์เกียนา",
  GE: "จอร์เจีย",
  GD: "เกรเนดา",
  GB: "สหราชอาณาจักร",
  GA: "กาบอง",
  SV: "เอลซัลวาดอร์",
  GN: "กินี",
  GM: "แกมเบีย",
  GL: "กรีนแลนด์",
  GI: "ยิบรอลตาร์",
  GH: "กานา",
  OM: "โอมาน",
  TN: "ตูนิเซีย",
  JO: "จอร์แดน",
  HR: "โครเอเชีย",
  HT: "เฮติ",
  HU: "ฮังการี",
  HK: "ฮ่องกง เขตปกครองพิเศษประเทศจีน",
  HN: "ฮอนดูรัส",
  HM: "เกาะเฮิร์ดและหมู่เกาะแมกดอนัลด์",
  VE: "เวเนซุเอลา",
  PR: "เปอร์โตริโก",
  PS: "ปาเลสไตน์",
  PW: "ปาเลา",
  PT: "โปรตุเกส",
  SJ: "สฟาลบาร์และยานไมเอน",
  PY: "ปารากวัย",
  IQ: "อิรัก",
  PA: "ปานามา",
  PF: "เฟรนช์โปลินีเซีย",
  PG: "ปาปัวนิวกินี",
  PE: "เปรู",
  PK: "ปากีสถาน",
  PH: "ฟิลิปปินส์",
  PN: "พิตแคร์น",
  PL: "โปแลนด์",
  PM: "แซงปีแยร์และมีเกอลง",
  ZM: "แซมเบีย",
  EH: "ซาฮาราตะวันตก",
  EE: "เอสโตเนีย",
  EG: "อียิปต์",
  ZA: "แอฟริกาใต้",
  EC: "เอกวาดอร์",
  IT: "อิตาลี",
  VN: "เวียดนาม",
  SB: "หมู่เกาะโซโลมอน",
  ET: "เอธิโอเปีย",
  SO: "โซมาเลีย",
  ZW: "ซิมบับเว",
  SA: "ซาอุดีอาระเบีย",
  ES: "สเปน",
  ER: "เอริเทรีย",
  ME: "มอนเตเนโกร",
  MD: "มอลโดวา",
  MG: "มาดากัสการ์",
  MF: "เซนต์มาติน",
  MA: "โมร็อกโก",
  MC: "โมนาโก",
  UZ: "อุซเบกิสถาน",
  MM: "เมียนม่าร์ [พม่า]",
  ML: "มาลี",
  MO: "มาเก๊า เขตปกครองพิเศษประเทศจีน",
  MN: "มองโกเลีย",
  MH: "หมู่เกาะมาร์แชลล์",
  MK: "มาซิโดเนีย",
  MU: "มอริเชียส",
  MT: "มอลตา",
  MW: "มาลาวี",
  MV: "มัลดีฟส์",
  MQ: "มาร์ตินีก",
  MP: "หมู่เกาะนอร์เทิร์นมาเรียนา",
  MS: "มอนต์เซอร์รัต",
  MR: "มอริเตเนีย",
  IM: "เกาะแมน",
  UG: "ยูกันดา",
  TZ: "แทนซาเนีย",
  MY: "มาเลเซีย",
  MX: "เม็กซิโก",
  IL: "อิสราเอล",
  FR: "ฝรั่งเศส",
  IO: "บริติชอินเดียนโอเชียนเทร์ริทอรี",
  SH: "เซนต์เฮเลนา",
  FI: "ฟินแลนด์",
  FJ: "ฟิจิ",
  FK: "หมู่เกาะฟอล์กแลนด์",
  FM: "ไมโครนีเซีย",
  FO: "หมู่เกาะแฟโร",
  NI: "นิการากัว",
  NL: "เนเธอร์แลนด์",
  NO: "นอร์เวย์",
  NA: "นามิเบีย",
  VU: "วานูอาตู",
  NC: "นิวแคลิโดเนีย",
  NE: "ไนเจอร์",
  NF: "เกาะนอร์ฟอล์ก",
  NG: "ไนจีเรีย",
  NZ: "นิวซีแลนด์",
  NP: "เนปาล",
  NR: "นาอูรู",
  NU: "นีอูเอ",
  CK: "หมู่เกาะคุก",
  CI: "ไอวอรี่โคสต์",
  CH: "สวิตเซอร์แลนด์",
  CO: "โคลอมเบีย",
  CN: "จีน",
  CM: "แคเมอรูน",
  CL: "ชิลี",
  CC: "หมู่เกาะโคโคส",
  CA: "แคนาดา",
  CG: "คองโก-บราซซาวิล",
  CF: "สาธารณรัฐแอฟริกากลาง",
  CD: "คองโก-กินชาซา",
  CZ: "สาธารณรัฐเช็ก",
  CY: "ไซปรัส",
  CX: "เกาะคริสต์มาส",
  CR: "คอสตาริกา",
  CV: "เคปเวิร์ด",
  CU: "คิวบา",
  SZ: "สวาซิแลนด์",
  SY: "ซีเรีย",
  KG: "คีร์กีซสถาน",
  KE: "เคนยา",
  SR: "ซูรินาเม",
  KI: "คิริบาส",
  KH: "กัมพูชา",
  KN: "เซนต์คิตส์และเนวิส",
  KM: "คอโมโรส",
  ST: "เซาตูเมและปรินซิปี",
  SK: "สโลวะเกีย",
  KR: "เกาหลีใต้",
  SI: "สโลวีเนีย",
  KP: "เกาหลีเหนือ",
  KW: "คูเวต",
  SN: "เซเนกัล",
  SM: "ซานมารีโน",
  SL: "เซียร์ราลีโอน",
  SC: "เซเชลส์",
  KZ: "คาซัคสถาน",
  KY: "หมู่เกาะเคย์แมน",
  SG: "สิงคโปร์",
  SE: "สวีเดน",
  SD: "ซูดาน",
  DO: "สาธารณรัฐโดมินิกัน",
  DM: "โดมินิกา",
  DJ: "จิบูตี",
  DK: "เดนมาร์ก",
  VG: "หมู่เกาะบริติชเวอร์จิน",
  DE: "เยอรมนี",
  YE: "เยเมน",
  DZ: "แอลจีเรีย",
  US: "สหรัฐอเมริกา",
  UY: "อุรุกวัย",
  YT: "มายอต",
  UM: "หมู่เกาะสหรัฐไมเนอร์เอาต์ไลอิง",
  LB: "เลบานอน",
  LC: "เซนต์ลูเซีย",
  LA: "ลาว",
  TV: "ตูวาลู",
  TW: "ไต้หวัน",
  TT: "ตรินิแดดและโตเบโก",
  TR: "ตุรกี",
  LK: "ศรีลังกา",
  LI: "ลิกเตนสไตน์",
  LV: "ลัตเวีย",
  TO: "ตองกา",
  LT: "ลิทัวเนีย",
  LU: "ลักเซมเบิร์ก",
  LR: "ไลบีเรีย",
  LS: "เลโซโท",
  TH: "ไทย",
  TF: "เฟรนช์เซาเทิร์นเทร์ริทอรีส์",
  TG: "โตโก",
  TD: "ชาด",
  TC: "หมู่เกาะเติกส์และหมู่เกาะเคคอส",
  LY: "ลิเบีย",
  VA: "วาติกัน",
  VC: "เซนต์วินเซนต์และเกรนาดีนส์",
  AE: "สหรัฐอาหรับเอมิเรตส์",
  AD: "อันดอร์รา",
  AG: "แอนติกาและบาร์บูดา",
  AF: "อัฟกานิสถาน",
  AI: "แองกวิลลา",
  VI: "หมู่เกาะยูเอสเวอร์จิน",
  IS: "ไอซ์แลนด์",
  IR: "อิหร่าน",
  AM: "อาร์เมเนีย",
  AL: "แอลเบเนีย",
  AO: "แองโกลา",
  AQ: "แอนตาร์กติกา",
  AS: "อเมริกันซามัว",
  AR: "อาร์เจนตินา",
  AU: "ออสเตรเลีย",
  AT: "ออสเตรีย",
  AW: "อารูบา",
  IN: "อินเดีย",
  AX: "หมู่เกาะโอลันด์",
  AZ: "อาเซอร์ไบจาน",
  IE: "ไอร์แลนด์",
  ID: "อินโดนีเซีย",
  UA: "ยูเครน",
  QA: "กาตาร์",
  MZ: "โมซัมบิก",
  BQ: "โบแนร์, ซินท์เอิสทาทิอุส, ซาบา",
  CW: "คูราเซา",
  SX: "Sint Maarten (ส่วนดัตช์)",
  SS: "ซูดานใต้",
  XK: "โคโซโว"
};
const th = {
  locale: locale$8,
  countries: countries$8
};
const locale$7 = "tr";
const countries$7 = {
  AD: "Andorra",
  AE: "Birleşik Arap Emirlikleri",
  AF: "Afganistan",
  AG: "Antigua ve Barbuda",
  AI: "Anguilla",
  AL: "Arnavutluk",
  AM: "Ermenistan",
  AO: "Angola",
  AQ: "Antarktika",
  AR: "Arjantin",
  AS: "Amerikan Samoası",
  AT: "Avusturya",
  AU: "Avustralya",
  AW: "Aruba",
  AX: "Åland Adaları",
  AZ: "Azerbaycan",
  BA: "Bosna Hersek",
  BB: "Barbados",
  BD: "Bangladeş",
  BE: "Belçika",
  BF: "Burkina Faso",
  BG: "Bulgaristan",
  BH: "Bahreyn",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Saint Barthelemy",
  BM: "Bermuda",
  BN: "Brunei",
  BO: "Bolivya",
  BQ: "Karayip Hollanda",
  BR: "Brezilya",
  BS: "Bahamalar",
  BT: "Butan",
  BV: "Bouvet Adası",
  BW: "Botsvana",
  BY: "Beyaz Rusya",
  BZ: "Belize",
  CA: "Kanada",
  CC: "Cocos (Keeling) Adaları",
  CD: "Kongo - Kinşasa",
  CF: "Orta Afrika Cumhuriyeti",
  CG: "Kongo - Brazavil",
  CH: "İsviçre",
  CI: "Fildişi Sahili",
  CK: "Cook Adaları",
  CL: "Şili",
  CM: "Kamerun",
  CN: "Çin",
  CO: "Kolombiya",
  CR: "Kosta Rika",
  CU: "Küba",
  CV: "Cape Verde",
  CW: "Curaçao",
  CX: "Christmas Adası",
  CY: "Güney Kıbrıs Rum Kesimi",
  CZ: "Çek Cumhuriyeti",
  DE: "Almanya",
  DJ: "Cibuti",
  DK: "Danimarka",
  DM: "Dominika",
  DO: "Dominik Cumhuriyeti",
  DZ: "Cezayir",
  EC: "Ekvador",
  EE: "Estonya",
  EG: "Mısır",
  EH: "Batı Sahara",
  ER: "Eritre",
  ES: "İspanya",
  ET: "Etiyopya",
  FI: "Finlandiya",
  FJ: "Fiji",
  FK: "Falkland Adaları",
  FM: "Mikronezya",
  FO: "Faroe Adaları",
  FR: "Fransa",
  GA: "Gabon",
  GB: "Birleşik Krallık",
  GD: "Grenada",
  GE: "Gürcistan",
  GF: "Fransız Guyanası",
  GG: "Guernsey",
  GH: "Gana",
  GI: "Cebelitarık",
  GL: "Grönland",
  GM: "Gambiya",
  GN: "Gine",
  GP: "Guadalupe",
  GQ: "Ekvator Ginesi",
  GR: "Yunanistan",
  GS: "Güney Georgia ve Güney Sandwich Adaları",
  GT: "Guatemala",
  GU: "Guam",
  GW: "Gine-Bissau",
  GY: "Guyana",
  HK: "Çin Hong Kong ÖYB",
  HM: "Heard Adası ve McDonald Adaları",
  HN: "Honduras",
  HR: "Hırvatistan",
  HT: "Haiti",
  HU: "Macaristan",
  ID: "Endonezya",
  IE: "İrlanda",
  IL: "İsrail",
  IM: "Man Adası",
  IN: "Hindistan",
  IO: "Britanya Hint Okyanusu Toprakları",
  IQ: "Irak",
  IR: "İran",
  IS: "İzlanda",
  IT: "İtalya",
  JE: "Jersey",
  JM: "Jamaika",
  JO: "Ürdün",
  JP: "Japonya",
  KE: "Kenya",
  KG: "Kırgızistan",
  KH: "Kamboçya",
  KI: "Kiribati",
  KM: "Komorlar",
  KN: "Saint Kitts ve Nevis",
  KP: "Kuzey Kore",
  KR: "Güney Kore",
  KW: "Kuveyt",
  KY: "Cayman Adaları",
  KZ: "Kazakistan",
  LA: "Laos",
  LB: "Lübnan",
  LC: "Saint Lucia",
  LI: "Liechtenstein",
  LK: "Sri Lanka",
  LR: "Liberya",
  LS: "Lesoto",
  LT: "Litvanya",
  LU: "Lüksemburg",
  LV: "Letonya",
  LY: "Libya",
  MA: "Fas",
  MC: "Monako",
  MD: "Moldova",
  ME: "Karadağ",
  MF: "Saint Martin",
  MG: "Madagaskar",
  MH: "Marshall Adaları",
  MK: "Kuzey Makedonya",
  ML: "Mali",
  MM: "Myanmar (Burma)",
  MN: "Moğolistan",
  MO: "Çin Makao ÖYB",
  MP: "Kuzey Mariana Adaları",
  MQ: "Martinik",
  MR: "Moritanya",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mauritius",
  MV: "Maldivler",
  MW: "Malavi",
  MX: "Meksika",
  MY: "Malezya",
  MZ: "Mozambik",
  NA: "Namibya",
  NC: "Yeni Kaledonya",
  NE: "Nijer",
  NF: "Norfolk Adası",
  NG: "Nijerya",
  NI: "Nikaragua",
  NL: "Hollanda",
  NO: "Norveç",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Yeni Zelanda",
  OM: "Umman",
  PA: "Panama",
  PE: "Peru",
  PF: "Fransız Polinezyası",
  PG: "Papua Yeni Gine",
  PH: "Filipinler",
  PK: "Pakistan",
  PL: "Polonya",
  PM: "Saint Pierre ve Miquelon",
  PN: "Pitcairn Adaları",
  PR: "Porto Riko",
  PS: "Filistin Bölgeleri",
  PT: "Portekiz",
  PW: "Palau",
  PY: "Paraguay",
  QA: "Katar",
  RE: "Réunion",
  RO: "Romanya",
  RS: "Sırbistan",
  RU: "Rusya",
  RW: "Ruanda",
  SA: "Suudi Arabistan",
  SB: "Solomon Adaları",
  SC: "Seyşeller",
  SD: "Sudan",
  SE: "İsveç",
  SG: "Singapur",
  SH: "Saint Helena",
  SI: "Slovenya",
  SJ: "Svalbard ve Jan Mayen Adaları",
  SK: "Slovakya",
  SL: "Sierra Leone",
  SM: "San Marino",
  SN: "Senegal",
  SO: "Somali",
  SR: "Surinam",
  SS: "Güney Sudan",
  ST: "São Tomé ve Príncipe",
  SV: "El Salvador",
  SX: "Sint Maarten",
  SY: "Suriye",
  SZ: "Svaziland",
  TC: "Turks ve Caicos Adaları",
  TD: "Çad",
  TF: "Fransız Güney Toprakları",
  TG: "Togo",
  TH: "Tayland",
  TJ: "Tacikistan",
  TK: "Tokelau",
  TL: "Timor-Leste",
  TM: "Türkmenistan",
  TN: "Tunus",
  TO: "Tonga",
  TR: "Türkiye",
  TT: "Trinidad ve Tobago",
  TV: "Tuvalu",
  TW: "Tayvan",
  TZ: "Tanzanya",
  UA: "Ukrayna",
  UG: "Uganda",
  UM: "ABD Uzak Adaları",
  US: [
    "ABD",
    "A.B.D.",
    "Amerika Birleşik Devletleri",
    "Birleşik Devletler",
    "Amerika"
  ],
  UY: "Uruguay",
  UZ: "Özbekistan",
  VA: "Vatikan",
  VC: "Saint Vincent ve Grenadinler",
  VE: "Venezuela",
  VG: "Britanya Virjin Adaları",
  VI: "ABD Virjin Adaları",
  VN: "Vietnam",
  VU: "Vanuatu",
  WF: "Wallis ve Futuna Adaları",
  WS: "Samoa",
  YE: "Yemen",
  YT: "Mayotte",
  ZA: "Güney Afrika",
  ZM: "Zambiya",
  ZW: "Zimbabve",
  XK: "Kosova"
};
const tr = {
  locale: locale$7,
  countries: countries$7
};
const locale$6 = "tt";
const countries$6 = {
  AF: "Әфганстан",
  AL: "Албания",
  DZ: "Алжир",
  AS: "Америка Самоасы",
  AD: "Андорра",
  AO: "Ангола",
  AI: "Ангилья",
  AQ: "Антарктика",
  AG: "Антигуа һәм Барбуда",
  AR: "Аргентина",
  AM: "Әрмәнстан",
  AW: "Аруба",
  AU: "Австралия",
  AT: "Австрия",
  AZ: "Әзәрбайҗан",
  BS: "Багам утраулары",
  BH: "Бәхрәйн",
  BD: "Бангладеш",
  BB: "Барбадос",
  BY: "Беларусь",
  BE: "Бельгия",
  BZ: "Белиз",
  BJ: "Бенин",
  BM: "Бермуд утраулары",
  BT: "Бутан",
  BO: "Боливия",
  BA: "Босния һәм Герцеговина",
  BW: "Ботсвана",
  BV: "Буве утравы",
  BR: "Бразилия",
  IO: "Британиянең Һинд Океанындагы Территориясе",
  BN: "Бруней",
  BG: "Болгария",
  BF: "Буркина-Фасо",
  BI: "Бурунди",
  KH: "Камбоджа",
  CM: "Камерун",
  CA: "Канада",
  CV: "Кабо-Верде",
  KY: "Кайман утраулары",
  CF: "Үзәк Африка Республикасы",
  TD: "Чад",
  CL: "Чили",
  CN: "Кытай",
  CX: "Раштуа утравы",
  CC: "Кокос (Килинг) утраулары",
  CO: "Колумбия",
  KM: "Комор утраулары",
  CG: "Конго",
  CD: "Конго, Демократик Республикасы",
  CK: "Кук утраулары",
  CR: "Коста-Рика",
  CI: "Кот-д’Ивуар",
  HR: "Хорватия",
  CU: "Куба",
  CY: "Кипр",
  CZ: "Чехия Республикасы",
  DK: "Дания",
  DJ: "Җибүти",
  DM: "Доминика",
  DO: "Доминикана Республикасы",
  EC: "Эквадор",
  EG: "Мисыр",
  SV: "Сальвадор",
  GQ: "Экваториаль Гвинея",
  ER: "Эритрея",
  EE: "Эстония",
  ET: "Эфиопия",
  FK: "Фолкленд утраулары",
  FO: "Фарер утраулары",
  FJ: "Фиджи",
  FI: "Финляндия",
  FR: "Франция",
  GF: "Француз Гвианасы",
  PF: "Француз Полинезиясе",
  TF: "Франциянең Көньяк Территорияләре",
  GA: "Габон",
  GM: "Гамбия",
  GE: "Грузия",
  DE: "Германия",
  GH: "Гана",
  GI: "Гибралтар",
  GR: "Греция",
  GL: "Гренландия",
  GD: "Гренада",
  GP: "Гваделупа",
  GU: "Гуам",
  GT: "Гватемала",
  GN: "Гвинея",
  GW: "Гвинея-Бисау",
  GY: "Гайана",
  HT: "Гаити",
  HM: "Херд утравы һәм Макдональд утраулары",
  VA: "Изге күренеш (Ватикан шәһәре дәүләте)",
  HN: "Гондурас",
  HK: "Гонконг Махсус Идарәле Төбәге",
  HU: "Венгрия",
  IS: "Исландия",
  IN: "Индия",
  ID: "Индонезия",
  IR: "Иран",
  IQ: "Гыйрак",
  IE: "Ирландия",
  IL: "Израиль",
  IT: "Италия",
  JM: "Ямайка",
  JP: "Япония",
  JO: "Иордания",
  KZ: "Казахстан",
  KE: "Кения",
  KI: "Кирибати",
  KP: "Төньяк Корея",
  KR: "Көньяк Корея",
  KW: "Күвәйт",
  KG: "Кыргызстан",
  LA: "Лаос",
  LV: "Латвия",
  LB: "Ливан",
  LS: "Лесото",
  LR: "Либерия",
  LY: "Ливия",
  LI: "Лихтенштейн",
  LT: "Литва",
  LU: "Люксембург",
  MO: "Макао Махсус Идарәле Төбәге",
  MG: "Мадагаскар",
  MW: "Малави",
  MY: "Малайзия",
  MV: "Мальдив утраулары",
  ML: "Мали",
  MT: "Мальта",
  MH: "Маршалл утраулары",
  MQ: "Мартиника",
  MR: "Мавритания",
  MU: "Маврикий",
  YT: "Майотта",
  MX: "Мексика",
  FM: "Микронезия",
  MD: "Молдова",
  MC: "Монако",
  MN: "Монголия",
  MS: "Монтсеррат",
  MA: "Марокко",
  MZ: "Мозамбик",
  MM: "Мьянма",
  NA: "Намибия",
  NR: "Науру",
  NP: "Непал",
  NL: "Нидерланд",
  NC: "Яңа Каледония",
  NZ: "Яңа Зеландия",
  NI: "Никарагуа",
  NE: "Нигер",
  NG: "Нигерия",
  NU: "Ниуэ",
  NF: "Норфолк утравы",
  MK: "Төньяк Македония",
  MP: "Төньяк Мариана утраулары",
  NO: "Норвегия",
  OM: "Оман",
  PK: "Пакистан",
  PW: "Палау",
  PS: "Палестина",
  PA: "Панама",
  PG: "Папуа - Яңа Гвинея",
  PY: "Парагвай",
  PE: "Перу",
  PH: "Филиппин",
  PN: "Питкэрн утраулары",
  PL: "Польша",
  PT: "Португалия",
  PR: "Пуэрто-Рико",
  QA: "Катар",
  RE: "Реюньон",
  RO: "Румыния",
  RU: "Россия",
  RW: "Руанда",
  SH: "Изге Елена",
  KN: "Сент-Китс һәм Невис",
  LC: "Сент-Люсия",
  PM: "Сен-Пьер һәм Микелон",
  VC: "Сент-Винсент һәм Гренадин",
  WS: "Самоа",
  SM: "Сан-Марино",
  ST: "Сан-Томе һәм Принсипи",
  SA: "Согуд Гарәбстаны",
  SN: "Сенегал",
  SC: "Сейшел утраулары",
  SL: "Сьерра-Леоне",
  SG: "Сингапур",
  SK: "Словакия",
  SI: "Словения",
  SB: "Сөләйман утраулары",
  SO: "Сомали",
  ZA: "Көньяк Африка",
  GS: "Көньяк Георгия һәм Көньяк Сандвич утраулары",
  ES: "Испания",
  LK: "Шри-Ланка",
  SD: "Судан",
  SR: "Суринам",
  SJ: "Шпицберген һәм Ян-Майен",
  SZ: "Свазиленд",
  SE: "Швеция",
  CH: "Швейцария",
  SY: "Сүрия",
  TW: "Тайвань",
  TJ: "Таҗикстан",
  TZ: "Танзания",
  TH: "Тайланд",
  TL: "Тимор-Лесте",
  TG: "Того",
  TK: "Токелау",
  TO: "Тонга",
  TT: "Тринидад һәм Тобаго",
  TN: "Тунис",
  TR: "Төркия",
  TM: "Төркмәнстан",
  TC: "Теркс һәм Кайкос утраулары",
  TV: "Тувалу",
  UG: "Уганда",
  UA: "Украина",
  AE: "Берләшкән Гарәп Әмирлекләре",
  GB: "Берләшкән Корольлек",
  US: "АКШ",
  UM: "АКШ Кече Читтәге утраулары",
  UY: "Уругвай",
  UZ: "Үзбәкстан",
  VU: "Вануату",
  VE: "Венесуэла",
  VN: "Вьетнам",
  VG: "Британия Виргин утраулары",
  VI: "АКШ Виргин утраулары",
  WF: "Уоллис һәм Футуна",
  EH: "Көнбатыш Сахара",
  YE: "Йәмән",
  ZM: "Замбия",
  ZW: "Зимбабве",
  AX: "Аланд утраулары",
  BQ: "Бонейр, Синт Эстатий һәм Саба",
  CW: "Кюрасао",
  GG: "Гернси",
  IM: "Мэн утравы",
  JE: "Джерси",
  ME: "Черногория",
  BL: "Сен-Бартельми",
  MF: "Сент-Мартин",
  RS: "Сербия",
  SX: "Синт-Мартен",
  SS: "Көньяк Судан",
  XK: "Косово"
};
const tt = {
  locale: locale$6,
  countries: countries$6
};
const locale$5 = "ug";
const countries$5 = {
  AF: "ئافغانىستان",
  AL: "ئالبانىيە",
  DZ: "ئالجىرىيە",
  AS: "ئامېرىكا ساموئا",
  AD: "ئاندوررا",
  AO: "ئانگولا",
  AI: "ئانگۋىللا",
  AQ: "ئانتاركتىكا",
  AG: "ئانتىگۇئا ۋە باربۇدا",
  AR: "ئارگېنتىنا",
  AM: "ئەرمېنىيە",
  AW: "ئارۇبا",
  AU: "ئاۋسترالىيە",
  AT: "ئاۋىستىرىيە",
  AZ: "ئەزەربەيجان",
  BS: "باھاما",
  BH: "بەھرەين",
  BD: "بېنگال",
  BB: "باربادوس",
  BY: "بېلارۇسىيە",
  BE: "بېلگىيە",
  BZ: "بېلىز",
  BJ: "بېنىن",
  BM: "بېرمۇدا",
  BT: "بۇتان",
  BO: "بولىۋىيە",
  BA: "بوسىنىيە ۋە گېرتسېگوۋىنا",
  BW: "بوتسۋانا",
  BV: "بوۋېت ئارىلى",
  BR: "بىرازىلىيە",
  IO: "ئەنگلىيەگە قاراشلىق ھىندى ئوكيان تېررىتورىيەسى",
  BN: "بىرۇنېي",
  BG: "بۇلغارىيە",
  BF: "بۇركىنا فاسو",
  BI: "بۇرۇندى",
  KH: "كامبودژا",
  CM: "كامېرون",
  CA: "كانادا",
  CV: "يېشىل تۇمشۇق",
  KY: "كايمان ئاراللىرى",
  CF: "ئوتتۇرا ئافرىقا جۇمھۇرىيىتى",
  TD: "چاد",
  CL: "چىلى",
  CN: "جۇڭگو",
  CX: "مىلاد ئارىلى",
  CC: "كوكوس (كىلىڭ) ئاراللىرى",
  CO: "كولومبىيە",
  KM: "كومورو",
  CG: "كونگو - بىراززاۋىل",
  CD: "كونگو - كىنشاسا",
  CK: "كۇك ئاراللىرى",
  CR: "كوستارىكا",
  CI: "كوتې دې ئىۋوئىر",
  HR: "كىرودىيە",
  CU: "كۇبا",
  CY: "سىپرۇس",
  CZ: "چېخ جۇمھۇرىيىتى",
  DK: "دانىيە",
  DJ: "جىبۇتى",
  DM: "دومىنىكا",
  DO: "دومىنىكا جۇمھۇرىيىتى",
  EC: "ئېكۋاتور",
  EG: "مىسىر",
  SV: "سالۋادور",
  GQ: "ئېكۋاتور گىۋىنىيەسى",
  ER: "ئېرىترىيە",
  EE: "ئېستونىيە",
  ET: "ئېفىيوپىيە",
  FK: "فالكلاند ئاراللىرى",
  FO: "فارو ئاراللىرى",
  FJ: "فىجى",
  FI: "فىنلاندىيە",
  FR: "فىرانسىيە",
  GF: "فىرانسىيەگە قاراشلىق گىۋىيانا",
  PF: "فىرانسىيەگە قاراشلىق پولىنېزىيە",
  TF: "فىرانسىيەنىڭ جەنۇبىي زېمىنى",
  GA: "گابون",
  GM: "گامبىيە",
  GE: "گىرۇزىيە",
  DE: "گېرمانىيە",
  GH: "گانا",
  GI: "جەبىلتارىق",
  GR: "گىرېتسىيە",
  GL: "گىرېنلاندىيە",
  GD: "گىرېنادا",
  GP: "گىۋادېلۇپ",
  GU: "گۇئام",
  GT: "گىۋاتېمالا",
  GN: "گىۋىنىيە",
  GW: "گىۋىنىيە بىسسائۇ",
  GY: "گىۋىيانا",
  HT: "ھايتى",
  HM: "ھېرد ئارىلى ۋە ماكدونالد ئاراللىرى",
  VA: "ۋاتىكان",
  HN: "ھوندۇراس",
  HK: "شياڭگاڭ ئالاھىدە مەمۇرىي رايونى (جۇڭگو)",
  HU: "ۋېنگىرىيە",
  IS: "ئىسلاندىيە",
  IN: "ھىندىستان",
  ID: "ھىندونېزىيە",
  IR: "ئىران",
  IQ: "ئىراق",
  IE: "ئىرېلاندىيە",
  IL: "ئىسرائىلىيە",
  IT: "ئىتالىيە",
  JM: "يامايكا",
  JP: "ياپونىيە",
  JO: "ئىيوردانىيە",
  KZ: "قازاقىستان",
  KE: "كېنىيە",
  KI: "كىرىباتى",
  KP: "چاۋشيەن",
  KR: "كورېيە",
  KW: "كۇۋەيت",
  KG: "قىرغىزىستان",
  LA: "لائوس",
  LV: "لاتۋىيە",
  LB: "لىۋان",
  LS: "لېسوتو",
  LR: "لىبېرىيە",
  LY: "لىۋىيە",
  LI: "لىكتېنستېين",
  LT: "لىتۋانىيە",
  LU: "لىيۇكسېمبۇرگ",
  MO: "ئاۋمېن ئالاھىدە مەمۇرىي رايونى",
  MG: "ماداغاسقار",
  MW: "مالاۋى",
  MY: "مالايسىيا",
  MV: "مالدىۋې",
  ML: "مالى",
  MT: "مالتا",
  MH: "مارشال ئاراللىرى",
  MQ: "مارتىنىكا",
  MR: "ماۋرىتانىيە",
  MU: "ماۋرىتىيۇس",
  YT: "مايوتى",
  MX: "مېكسىكا",
  FM: "مىكرونېزىيە",
  MD: "مولدوۋا",
  MC: "موناكو",
  MN: "موڭغۇلىيە",
  MS: "مونتسېررات",
  MA: "ماراكەش",
  MZ: "موزامبىك",
  MM: "بىرما",
  NA: "نامىبىيە",
  NR: "ناۋرۇ",
  NP: "نېپال",
  NL: "گوللاندىيە",
  NC: "يېڭى كالېدونىيە",
  NZ: "يېڭى زېلاندىيە",
  NI: "نىكاراگۇئا",
  NE: "نىگېر",
  NG: "نىگېرىيە",
  NU: "نيۇئې",
  NF: "نورفولك ئارىلى",
  MK: "شىمالىي ماكېدونىيە",
  MP: "شىمالىي مارىيانا ئاراللىرى",
  NO: "نورۋېگىيە",
  OM: "ئومان",
  PK: "پاكىستان",
  PW: "پالائۇ",
  PS: "پەلەستىن زېمىنى",
  PA: "پاناما",
  PG: "پاپۇئا يېڭى گىۋىنىيەسى",
  PY: "پاراگۋاي",
  PE: "پېرۇ",
  PH: "فىلىپپىن",
  PN: "پىتكايرن ئاراللىرى",
  PL: "پولشا",
  PT: "پورتۇگالىيە",
  PR: "پۇئېرتو رىكو",
  QA: "قاتار",
  RE: "رېيۇنىيون",
  RO: "رومىنىيە",
  RU: "رۇسىيە",
  RW: "رىۋاندا",
  SH: "ساينىت ھېلېنا",
  KN: "ساينت كىتىس ۋە نېۋىس",
  LC: "ساينت لۇسىيە",
  PM: "ساينت پىيېر ۋە مىكېلون ئاراللىرى",
  VC: "ساينت ۋىنسېنت ۋە گىرېنادىنېس",
  WS: "ساموئا",
  SM: "سان مارىنو",
  ST: "سان تومې ۋە پرىنسىپې",
  SA: "سەئۇدىي ئەرەبىستان",
  SN: "سېنېگال",
  SC: "سېيشېل",
  SL: "سېررالېئون",
  SG: "سىنگاپور",
  SK: "سىلوۋاكىيە",
  SI: "سىلوۋېنىيە",
  SB: "سولومون ئاراللىرى",
  SO: "سومالى",
  ZA: "جەنۇبىي ئافرىقا",
  GS: "جەنۇبىي جورجىيە ۋە جەنۇبىي ساندۋىچ ئاراللىرى",
  ES: "ئىسپانىيە",
  LK: "سىرىلانكا",
  SD: "سۇدان",
  SR: "سۇرىنام",
  SJ: "سىۋالبارد ۋە يان مايېن",
  SZ: "سىۋېزىلاند",
  SE: "شىۋېتسىيە",
  CH: "شىۋېتسارىيە",
  SY: "سۇرىيە",
  TW: "تەيۋەن",
  TJ: "تاجىكىستان",
  TZ: "تانزانىيە",
  TH: "تايلاند",
  TL: "شەرقىي تىمور",
  TG: "توگو",
  TK: "توكېلاۋ",
  TO: "تونگا",
  TT: "تىرىنىداد ۋە توباگو",
  TN: "تۇنىس",
  TR: "تۈركىيە",
  TM: "تۈركمەنىستان",
  TC: "تۇركس ۋە كايكوس ئاراللىرى",
  TV: "تۇۋالۇ",
  UG: "ئۇگاندا",
  UA: "ئۇكرائىنا",
  AE: "ئەرەب بىرلەشمە خەلىپىلىكى",
  GB: "بىرلەشمە پادىشاھلىق",
  US: "ئامېرىكا قوشما ئىشتاتلىرى",
  UM: "ئا ق ش تاشقى ئاراللىرى",
  UY: "ئۇرۇگۋاي",
  UZ: "ئۆزبېكىستان",
  VU: "ۋانۇئاتۇ",
  VE: "ۋېنېسۇئېلا",
  VN: "ۋىيېتنام",
  VG: "ئەنگلىيە ۋىرگىن ئاراللىرى",
  VI: "ئا ق ش ۋىرگىن ئاراللىرى",
  WF: "ۋاللىس ۋە فۇتۇنا",
  EH: "غەربىي ساخارا",
  YE: "يەمەن",
  ZM: "زامبىيە",
  ZW: "زىمبابۋې",
  AX: "ئالاند ئاراللىرى",
  BQ: "كارىب دېڭىزى گوللاندىيە",
  CW: "كۇراچاۋ",
  GG: "گۇرنسېي",
  IM: "مان ئارىلى",
  JE: "جېرسېي",
  ME: "قارا تاغ",
  BL: "ساينت بارتېلېمى",
  MF: "ساينت مارتىن",
  RS: "سېربىيە",
  SX: "سىنت مارتېن",
  SS: "جەنۇبىي سۇدان",
  XK: "كوسوۋو"
};
const ug = {
  locale: locale$5,
  countries: countries$5
};
const locale$4 = "uk";
const countries$4 = {
  AU: "Австралія",
  AT: "Австрія",
  AZ: "Азербайджан",
  AX: "Аландські Острови",
  AL: "Албанія",
  DZ: "Алжир",
  AS: "Американське Самоа",
  AI: "Ангілья",
  AO: "Ангола",
  AD: "Андорра",
  AQ: "Антарктика",
  AG: "Антигуа і Барбуда",
  MO: "Макао",
  AR: "Аргентина",
  AM: "Вірменія",
  AW: "Аруба",
  AF: "Афганістан",
  BS: "Багамські Острови",
  BD: "Бангладеш",
  BB: "Барбадос",
  BH: "Бахрейн",
  BZ: "Беліз",
  BE: "Бельгія",
  BJ: "Бенін",
  BM: "Бермудські Острови",
  BY: "Білорусь",
  BG: "Болгарія",
  BO: "Болівія",
  BA: "Боснія і Герцеговина",
  BW: "Ботсвана",
  BR: "Бразилія",
  IO: "Британська Територія в Індійському Океані",
  VG: "Британські Віргінські Острови",
  BN: "Бруней-Даруссалам",
  BF: "Буркіна-Фасо",
  BI: "Бурунді",
  BT: "Бутан",
  VU: "Вануату",
  VA: "Ватикан",
  GB: "Великобританія",
  VE: "Венесуела",
  VI: "Віргінські Острови (США)",
  WF: "Волліс і Футуна",
  VN: "В'єтнам",
  UM: "Зовнішні Віддалені Острови (США)",
  GA: "Габон",
  HT: "Гаїті",
  GY: "Гаяна",
  GM: "Гамбія",
  GH: "Гана",
  GP: "Гваделупа",
  GT: "Гватемала",
  GF: "Гвіана",
  GN: "Гвінея",
  GW: "Гвінея-Бісау",
  GG: "Гернсі",
  GI: "Гібралтар",
  HN: "Гондурас",
  HK: "Гонконг",
  GD: "Гренада",
  GR: "Греція",
  GE: "Грузія",
  GU: "Гуам",
  GL: "Гренландія",
  DK: "Данія",
  JE: "Джерсі",
  DJ: "Джибуті",
  DM: "Домініка",
  DO: "Домініканська Республіка",
  CD: "Демократична Республіка Конго",
  EC: "Еквадор",
  GQ: "Екваторіальна Гвінея",
  ER: "Еритрея",
  EE: "Естонія",
  ET: "Ефіопія",
  EG: "Єгипет",
  YE: "Ємен",
  ZM: "Замбія",
  ZW: "Зімбабве",
  IL: "Ізраїль",
  IN: "Індія",
  ID: "Індонезія",
  IQ: "Ірак",
  IR: "Іран",
  IE: "Ірландія",
  IS: "Ісландія",
  ES: "Іспанія",
  IT: "Італія",
  JO: "Йорданія",
  CV: "Кабо-Верде",
  KZ: "Казахстан",
  KY: "Кайманові Острови",
  KH: "Камбоджа",
  CM: "Камерун",
  CA: "Канада",
  BQ: "Карибські Нідерланди",
  QA: "Катар",
  KE: "Кенія",
  CY: "Кіпр",
  KI: "Кірибаті",
  KG: "Киргизстан",
  TW: "Тайвань, Провінція Китаю",
  KP: "Корейська Народно-Демократична Республіка",
  CN: "Китай",
  CC: "Кокосові Острови",
  CO: "Колумбія",
  KM: "Комори",
  XK: "Косово",
  CR: "Коста-Рика",
  CI: "Кот-Д'Івуар",
  CU: "Куба",
  KW: "Кувейт",
  CW: "Кюрасао",
  LA: "Лаос",
  LV: "Латвія",
  LS: "Лесото",
  LR: "Ліберія",
  LB: "Ліван",
  LY: "Лівія",
  LT: "Литва",
  LI: "Ліхтенштейн",
  LU: "Люксембург",
  MU: "Маврикій",
  MR: "Мавританія",
  MG: "Мадагаскар",
  YT: "Майотта",
  MW: "Малаві",
  MY: "Малайзія",
  ML: "Малі",
  MV: "Мальдіви",
  MT: "Мальта",
  MA: "Марокко",
  MQ: "Мартиніка",
  MH: "Маршаллові Острови",
  MX: "Мексика",
  FM: "Мікронезія",
  MZ: "Мозамбік",
  MD: "Молдова",
  MC: "Монако",
  MN: "Монголія",
  MS: "Монтсеррат",
  MM: "М'янма",
  NA: "Намібія",
  NR: "Науру",
  NP: "Непал",
  NE: "Нігер",
  NG: "Нігерія",
  NL: "Нідерланди",
  NI: "Нікарагуа",
  DE: "Німеччина",
  NU: "Ніуе",
  NZ: "Нова Зеландія",
  NC: "Нова Каледонія",
  NO: "Норвегія",
  AE: "Об'єднані Арабські Емірати",
  OM: "Оман",
  BV: "Острів Буве",
  HM: "Острів Герд і Острови Макдоналд",
  IM: "Острів Мен",
  NF: "Острів Норфолк",
  CX: "Острів Різдва",
  CK: "Острови Кука",
  SH: "Острів Святої Єлени",
  TC: "Острови Теркс і Кайкос",
  PK: "Пакистан",
  PW: "Палау",
  PS: "Палестина",
  PA: "Панама",
  PG: "Папуа-Нова Гвінея",
  ZA: "Південна Африка",
  PY: "Парагвай",
  PE: "Перу",
  GS: "Південна Джорджія та Південні Сандвічеві Острови",
  KR: "Республіка Корея",
  SS: "Південний Судан",
  MK: "Північна Македонія",
  MP: "Північні Маріанські Острови",
  PN: "Піткерн",
  PL: "Польща",
  PT: "Португалія",
  PR: "Пуерто-Рико",
  CG: "Конго",
  RE: "Реюньйон",
  RU: "Росія",
  RW: "Руанда",
  RO: "Румунія",
  EH: "Західна Сахара",
  SV: "Сальвадор",
  WS: "Самоа",
  SM: "Сан-Марино",
  ST: "Сан-Томе і Принсіпі",
  SA: "Саудівська Аравія",
  SZ: "Есватіні",
  SJ: "Острови Шпіцберген та Ян-Маєн",
  SC: "Сейшельські Острови",
  BL: "Сен-Бартелемі",
  MF: "Сен-Мартен",
  PM: "Сен-П'єр і Мікелон",
  SN: "Сенегал",
  VC: "Сент-Вінсент і Гренадіни",
  KN: "Сент-Кітс і Невіс",
  LC: "Сент-Люсія",
  RS: "Сербія",
  SG: "Сингапур",
  SX: "Сінт-Мартен",
  SY: "Сирія",
  SK: "Словаччина",
  SI: "Словенія",
  SB: "Соломонові Острови",
  SO: "Сомалі",
  SD: "Судан",
  SR: "Суринам",
  TL: "Тимор-Лешті",
  US: "США",
  SL: "Сьєрра-Леоне",
  TJ: "Таджикистан",
  TH: "Таїланд",
  TZ: "Танзанія",
  TG: "Того",
  TK: "Токелау",
  TO: "Тонга",
  TT: "Тринідад і Тобаго",
  TV: "Тувалу",
  TN: "Туніс",
  TM: "Туркменистан",
  TR: "Туреччина",
  UG: "Уганда",
  HU: "Угорщина",
  UZ: "Узбекистан",
  UA: "Україна",
  UY: "Уругвай",
  FO: "Фарерські Острови",
  FJ: "Фіджі",
  PH: "Філіппіни",
  FI: "Фінляндія",
  FK: "Фолклендські Острови",
  FR: "Франція",
  PF: "Французька Полінезія",
  TF: "Французькі Південні і Антарктичні Території",
  HR: "Хорватія",
  CF: "Центральноафриканська Республіка",
  TD: "Чад",
  ME: "Чорногорія",
  CZ: "Чехія",
  CL: "Чилі",
  CH: "Швейцарія",
  SE: "Швеція",
  LK: "Шри-Ланка",
  JM: "Ямайка",
  JP: "Японія"
};
const uk = {
  locale: locale$4,
  countries: countries$4
};
const locale$3 = "ur";
const countries$3 = {
  AF: "افغانستان",
  AL: "البانیاہ",
  DZ: "الجزائر",
  AS: "امریکی ساموا",
  AD: "اینڈورا",
  AO: "انگولا",
  AI: "انگویلا",
  AQ: "انٹارکٹیکا",
  AG: "انٹیگوا اور باربودا",
  AR: "ارجنٹینا",
  AM: "آرمینیا",
  AW: "اروبا",
  AU: "آسٹریلیا",
  AT: "آسٹریا",
  AZ: "آزربائیجان",
  BS: "بہاماس",
  BH: "بحرین",
  BD: "بنگلہ دیش",
  BB: "بارباڈوس",
  BY: "بیلاروس",
  BE: "بیلجیم",
  BZ: "بیلیز",
  BJ: "بینن",
  BM: "برمودا",
  BT: "بھوٹان",
  BO: "بولیویا",
  BA: "بوسنیا اور ہرزیگوینا",
  BW: "بوٹسوانا",
  BV: "جزیرہ بوویت",
  BR: "برازیل",
  IO: "بحرِہندکابرطانوی حصہ",
  BN: "برونائی دارالسلام",
  BG: "بلغاریہ",
  BF: "برکینا فاسو",
  BI: "برونڈی",
  KH: "کمبوڈیا",
  CM: "کیمرون",
  CA: "کینیڈا",
  CV: "کیپ وردے",
  KY: "جزائر کیمن",
  CF: "وسطی افریقی جمہوریہ",
  TD: "چاڈ",
  CL: "چلی",
  CN: "چین",
  CX: "کرسمس آئ لینڈ",
  CC: "کوکوس جزائر",
  CO: "کولمبیا",
  KM: "کوموروس",
  CG: "کانگو",
  CD: "عوامی جمہوریہِ کانگو",
  CK: "کوک آیلینڈ",
  CR: "کوسٹا ریکا",
  CI: "کوٹ ڈی آئیورائر",
  HR: "کروشیا",
  CU: "کیوبا",
  CY: "قبرص",
  CZ: "جمہوریہ چیک",
  DK: "ڈنمارک",
  DJ: "جبوتی",
  DM: "ڈومینیکا",
  DO: "ڈومینیکن ریپبلک",
  EC: "ایکواڈور",
  EG: "مصر",
  SV: "ال سلواڈور",
  GQ: "استوائی گنی",
  ER: "ایریٹریا",
  EE: "ایسٹونیا",
  ET: "ایتھوپیا",
  FK: "جزائر فاک لینڈ (مالویناس)",
  FO: "جزائرفارو",
  FJ: "فجی",
  FI: "فن لینڈ",
  FR: "فرانس",
  GF: "فرانسیسی گانا",
  PF: "فرانسیسی پولینیشیا",
  TF: "جنوبی فرانسیسی علاقہ جات",
  GA: "گبون",
  GM: "گیمبیا",
  GE: "جارجیا",
  DE: "جرمنی",
  GH: "گھانا",
  GI: "جبل الطارق",
  GR: "یونان",
  GL: "گرین لینڈ",
  GD: "گریناڈا",
  GP: "گواڈیلوپ",
  GU: "گوام",
  GT: "گوئٹے مالا",
  GN: "گنی",
  GW: "گنی بساؤ",
  GY: "گیوانا",
  HT: "ہیٹی",
  HM: "ہرڈ جزیرہ اور جزائر مکڈونلڈ",
  VA: "ہولی سی، ویٹیکن",
  HN: "ہنڈورس",
  HK: "ہانگ کانگ",
  HU: "ہنگری",
  IS: "آئس لینڈ",
  IN: "انڈیا",
  ID: "انڈونیشیا",
  IR: "اسلامی جمہوریہ ایران",
  IQ: "عراق",
  IE: "آئر لینڈ",
  IL: "اسرائیل",
  IT: "اٹلی",
  JM: "جمیکا",
  JP: "جاپان",
  JO: "اردن",
  KZ: "قازقستان",
  KE: "کینیا",
  KI: "کرباتی",
  KP: "شمالی کوریا",
  KR: "جنوبی کوریا",
  KW: "کویت",
  KG: "کرغزستان",
  LA: "عوامی جمہوریہِ لاوء",
  LV: "لیٹویا",
  LB: "لبنان",
  LS: "لیسوتھو",
  LR: "لائبیریا",
  LY: "لیبیا",
  LI: "لیچسٹنسٹین",
  LT: "لیتھوانیا",
  LU: "لکسمبرگ",
  MO: "مکاؤ",
  MG: "مڈغاسکر",
  MW: "ملاوی",
  MY: "ملائیشیا",
  MV: "مالدیپ",
  ML: "مالی",
  MT: "مالٹا",
  MH: "مارشل جزائر",
  MQ: "مارٹنیک",
  MR: "موریطانیہ",
  MU: "ماریشس",
  YT: "میٹو",
  MX: "میکسیکو",
  FM: "مائیکرونیشیا",
  MD: "جمہوریہ مالڈووا",
  MC: "موناکو",
  MN: "منگولیا",
  MS: "مونٹسیریٹ",
  MA: "مراکش",
  MZ: "موزمبیق",
  MM: "میانمار",
  NA: "نامیبیا",
  NR: "نورو",
  NP: "نیپال",
  NL: "نیدرلینڈ",
  NC: "نیو کالیڈونیا",
  NZ: "نیوزی لینڈ",
  NI: "نکاراگوا",
  NE: "نائجر",
  NG: "نائجیریا",
  NU: "نییو",
  NF: "جزیرہ نورفوک",
  MP: "شمالی ماریانا جزائر",
  MK: "شمالی مقدونیہ",
  NO: "ناروے",
  OM: "عمان",
  PK: "پاکستان",
  PW: "پالاؤ",
  PS: "فلسطین",
  PA: "پاناما",
  PG: "پاپوا نیو گنی",
  PY: "پیراگوئے",
  PE: "پیرو",
  PH: "فلپائن",
  PN: "پٹکیرن",
  PL: "پولینڈ",
  PT: "پرتگال",
  PR: "پورٹو ریکو",
  QA: "قطر",
  RE: "ری یونین",
  RO: "رومانیہ",
  RU: "روس",
  RW: "روانڈا",
  SH: "سینٹ ہیلینا",
  KN: "سینٹ کٹس اور نیویس",
  LC: "سینٹ لوسیا",
  PM: "سینٹ پیئر و میکوئیلون",
  VC: "سینٹ ونسنٹ اور گریناڈینز",
  WS: "ساموآ",
  SM: "سان مارینو",
  ST: "ساؤ ٹوم اور پرنسپے",
  SA: "سعودی عرب",
  SN: "سینیگال",
  SC: "سیچیلز",
  SL: "سیرا لیون",
  SG: "سنگاپور",
  SK: "سلوواکیا",
  SI: "سلووینیا",
  SB: "جزائرِ سولومن",
  SO: "صومالیہ",
  ZA: "جنوبی افریقہ",
  GS: "جنوبی جارجیا اور جزائر جنوبی سینڈوچ",
  ES: "سپین",
  LK: "سری لنکا",
  SD: "سوڈان",
  SR: "سورینام",
  SJ: "سوولبارڈ اور جان میین",
  SZ: "سوزیلینڈ",
  SE: "سویڈن",
  CH: "سوئٹزرلینڈ",
  SY: "شام",
  TW: "تائیوان",
  TJ: "تاجکستان",
  TZ: "تنزانیہ",
  TH: "تھائی لینڈ",
  TL: "تیمور-لیس",
  TG: "ٹوگو",
  TK: "ٹوکیلو",
  TO: "ٹونگا",
  TT: "ٹرینیڈاڈ اور ٹوباگو",
  TN: "تیونس",
  TR: "ترکی",
  TM: "ترکمنستان",
  TC: "ترکی اور کیکوس جزائر",
  TV: "تووالو",
  UG: "یوگنڈا",
  UA: "یوکرین",
  AE: "متحدہ عرب امارات",
  GB: "برطانیہ",
  US: "ریاست ہائے متحدہ امریکہ",
  UM: "ریاست ہائے متحدہ امریکہ کے علیحدہ چھوٹے جزائر",
  UY: "یوراگوئے",
  UZ: "ازبکستان",
  VU: "وانوات",
  VE: "وینزویلا",
  VN: "ویت نام",
  VG: "جزائرِورجن، برطانوی",
  VI: "جزائرِورجن، امریکی",
  WF: "والس اور فتونہ",
  EH: "مغربی صحارا",
  YE: "یمن",
  ZM: "زامبیا",
  ZW: "زمبابوے",
  AX: "جزائرِ آلند",
  BQ: "بونیرے, سینٹ یستتئوس اینڈ صبا",
  CW: "کیوراساؤ",
  GG: "گرنسی",
  IM: "آیل آف مین",
  JE: "جرسی",
  ME: "مونٹینیگرو",
  BL: "سینٹ باریٹی",
  MF: "سینٹ مارٹن (فرانسیسی حصہ)",
  RS: "سربیا",
  SX: "سینٹ مارٹن (ولندیزی حصہ)",
  SS: "جنوبی سوڈان",
  XK: "کوسوو"
};
const ur = {
  locale: locale$3,
  countries: countries$3
};
const locale$2 = "uz";
const countries$2 = {
  AD: "Andorra",
  AE: "Birlashgan Arab Amirliklari",
  AF: "Afgʻoniston",
  AG: "Antigua va Barbuda",
  AI: "Angilya",
  AL: "Albaniya",
  AM: "Armaniston",
  AO: "Angola",
  AQ: "Antarktida",
  AR: "Argentina",
  AS: "Amerika Samoasi",
  AT: "Avstriya",
  AU: "Avstraliya",
  AW: "Aruba",
  AX: "Aland orollari",
  AZ: "Ozarbayjon",
  BA: "Bosniya va Gertsegovina",
  BB: "Barbados",
  BD: "Bangladesh",
  BE: "Belgiya",
  BF: "Burkina-Faso",
  BG: "Bolgariya",
  BH: "Bahrayn",
  BI: "Burundi",
  BJ: "Benin",
  BL: "Sen-Bartelemi",
  BM: "Bermuda orollari",
  BN: "Bruney",
  BO: "Boliviya",
  BQ: "Boneyr, Sint-Estatius va Saba",
  BR: "Braziliya",
  BS: "Bagama orollari",
  BT: "Butan",
  BV: "Buve oroli",
  BW: "Botsvana",
  BY: "Belarus",
  BZ: "Beliz",
  CA: "Kanada",
  CC: "Kokos (Kiling) orollari",
  CD: "Kongo – Kinshasa",
  CF: "Markaziy Afrika Respublikasi",
  CG: "Kongo – Brazzavil",
  CH: "Shveytsariya",
  CI: "Kot-d’Ivuar",
  CK: "Kuk orollari",
  CL: "Chili",
  CM: "Kamerun",
  CN: "Xitoy",
  CO: "Kolumbiya",
  CR: "Kosta-Rika",
  CU: "Kuba",
  CV: "Kabo-Verde",
  CW: "Kyurasao",
  CX: "Rojdestvo oroli",
  CY: "Kipr",
  CZ: "Chexiya",
  DE: "Germaniya",
  DJ: "Jibuti",
  DK: "Daniya",
  DM: "Dominika",
  DO: "Dominikan Respublikasi",
  DZ: "Jazoir",
  EC: "Ekvador",
  EE: "Estoniya",
  EG: "Misr",
  EH: "G‘arbiy Sahroi Kabir",
  ER: "Eritreya",
  ES: "Ispaniya",
  ET: "Efiopiya",
  FI: "Finlandiya",
  FJ: "Fiji",
  FK: "Folklend orollari",
  FM: "Mikroneziya",
  FO: "Farer orollari",
  FR: "Fransiya",
  GA: "Gabon",
  GB: "Buyuk Britaniya",
  GD: "Grenada",
  GE: "Gruziya",
  GF: "Fransuz Gvianasi",
  GG: "Gernsi",
  GH: "Gana",
  GI: "Gibraltar",
  GL: "Grenlandiya",
  GM: "Gambiya",
  GN: "Gvineya",
  GP: "Gvadelupe",
  GQ: "Ekvatorial Gvineya",
  GR: "Gretsiya",
  GS: "Janubiy Georgiya va Janubiy Sendvich orollari",
  GT: "Gvatemala",
  GU: "Guam",
  GW: "Gvineya-Bisau",
  GY: "Gayana",
  HK: "Gonkong (Xitoy MMH)",
  HM: "Xerd va Makdonald orollari",
  HN: "Gonduras",
  HR: "Xorvatiya",
  HT: "Gaiti",
  HU: "Vengriya",
  ID: "Indoneziya",
  IE: "Irlandiya",
  IL: "Isroil",
  IM: "Men oroli",
  IN: "Hindiston",
  IO: "Britaniyaning Hind okeanidagi hududi",
  IQ: "Iroq",
  IR: "Eron",
  IS: "Islandiya",
  IT: "Italiya",
  JE: "Jersi",
  JM: "Yamayka",
  JO: "Iordaniya",
  JP: "Yaponiya",
  KE: "Keniya",
  KG: "Qirgʻiziston",
  KH: "Kambodja",
  KI: "Kiribati",
  KM: "Komor orollari",
  KN: "Sent-Kits va Nevis",
  KP: "Shimoliy Koreya",
  KR: "Janubiy Koreya",
  KW: "Quvayt",
  KY: "Kayman orollari",
  KZ: "Qozogʻiston",
  LA: "Laos",
  LB: "Livan",
  LC: "Sent-Lyusiya",
  LI: "Lixtenshteyn",
  LK: "Shri-Lanka",
  LR: "Liberiya",
  LS: "Lesoto",
  LT: "Litva",
  LU: "Lyuksemburg",
  LV: "Latviya",
  LY: "Liviya",
  MA: "Marokash",
  MC: "Monako",
  MD: "Moldova",
  ME: "Chernogoriya",
  MF: "Sent-Martin",
  MG: "Madagaskar",
  MH: "Marshall orollari",
  MK: "Shimoliy Makedoniya",
  ML: "Mali",
  MM: "Myanma (Birma)",
  MN: "Mongoliya",
  MO: "Makao (Xitoy MMH)",
  MP: "Shimoliy Mariana orollari",
  MQ: "Martinika",
  MR: "Mavritaniya",
  MS: "Montserrat",
  MT: "Malta",
  MU: "Mavrikiy",
  MV: "Maldiv orollari",
  MW: "Malavi",
  MX: "Meksika",
  MY: "Malayziya",
  MZ: "Mozambik",
  NA: "Namibiya",
  NC: "Yangi Kaledoniya",
  NE: "Niger",
  NF: "Norfolk oroli",
  NG: "Nigeriya",
  NI: "Nikaragua",
  NL: "Niderlandiya",
  NO: "Norvegiya",
  NP: "Nepal",
  NR: "Nauru",
  NU: "Niue",
  NZ: "Yangi Zelandiya",
  OM: "Ummon",
  PA: "Panama",
  PE: "Peru",
  PF: "Fransuz Polineziyasi",
  PG: "Papua – Yangi Gvineya",
  PH: "Filippin",
  PK: "Pokiston",
  PL: "Polsha",
  PM: "Sen-Pyer va Mikelon",
  PN: "Pitkern orollari",
  PR: "Puerto-Riko",
  PS: "Falastin hududi",
  PT: "Portugaliya",
  PW: "Palau",
  PY: "Paragvay",
  QA: "Qatar",
  RE: "Reyunion",
  RO: "Ruminiya",
  RS: "Serbiya",
  RU: "Rossiya",
  RW: "Ruanda",
  SA: "Saudiya Arabistoni",
  SB: "Solomon orollari",
  SC: "Seyshel orollari",
  SD: "Sudan",
  SE: "Shvetsiya",
  SG: "Singapur",
  SH: "Muqaddas Yelena oroli",
  SI: "Sloveniya",
  SJ: "Svalbard va Yan-Mayen",
  SK: "Slovakiya",
  SL: "Syerra-Leone",
  SM: "San-Marino",
  SN: "Senegal",
  SO: "Somali",
  SR: "Surinam",
  SS: "Janubiy Sudan",
  ST: "San-Tome va Prinsipi",
  SV: "Salvador",
  SX: "Sint-Marten",
  SY: "Suriya",
  SZ: "Svazilend",
  TC: "Turks va Kaykos orollari",
  TD: "Chad",
  TF: "Fransuz Janubiy hududlari",
  TG: "Togo",
  TH: "Tailand",
  TJ: "Tojikiston",
  TK: "Tokelau",
  TL: "Timor-Leste",
  TM: "Turkmaniston",
  TN: "Tunis",
  TO: "Tonga",
  TR: "Turkiya",
  TT: "Trinidad va Tobago",
  TV: "Tuvalu",
  TW: "Tayvan",
  TZ: "Tanzaniya",
  UA: "Ukraina",
  UG: "Uganda",
  UM: "AQSH yondosh orollari",
  US: "Amerika Qo‘shma Shtatlari",
  UY: "Urugvay",
  UZ: "Oʻzbekiston",
  VA: "Vatikan",
  VC: "Sent-Vinsent va Grenadin",
  VE: "Venesuela",
  VG: "Britaniya Virgin orollari",
  VI: "AQSH Virgin orollari",
  VN: "Vyetnam",
  VU: "Vanuatu",
  WF: "Uollis va Futuna",
  WS: "Samoa",
  XK: "Kosovo",
  YE: "Yaman",
  YT: "Mayotta",
  ZA: "Janubiy Afrika Respublikasi",
  ZM: "Zambiya",
  ZW: "Zimbabve"
};
const uz = {
  locale: locale$2,
  countries: countries$2
};
const locale$1 = "vi";
const countries$1 = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua và Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Úc",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Bỉ",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia và Herzegovina",
  BW: "Botswana",
  BV: "Đảo Bouvet",
  BR: "Brazil",
  IO: "Lãnh thổ Ấn Độ Dương thuộc Anh",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Campuchia",
  CM: "Cameroon",
  CA: "Canada",
  CV: "Cape Verde",
  KY: "Quần đảo Cayman",
  CF: "Cộng hòa Trung Phi",
  TD: "Chad",
  CL: "Chile",
  CN: "Trung Quốc",
  CX: "Đảo Giáng sinh",
  CC: "Quần đảo Cocos (Keeling)",
  CO: "Colombia",
  KM: "Comoros",
  CG: "Công-gô",
  CD: "Cộng hòa Dân chủ Công-gô",
  CK: "Quần đảo Cook",
  CR: "Costa Rica",
  CI: [
    "Cote d'Ivoire",
    "Côte d'Ivoire"
  ],
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Cộng hòa Séc",
  DK: "Đan Mạch",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Cộng hòa Dominica",
  EC: "Ecuador",
  EG: "Ai Cập",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  ET: "Ethiopia",
  FK: "Quần đảo Falkland (Malvinas)",
  FO: "Quần đảo Faroe",
  FJ: "Fiji",
  FI: "Phần Lan",
  FR: "Pháp",
  GF: "Guyane thuộc Pháp",
  PF: "Polynésie thuộc Pháp",
  TF: "Vùng đất phía Nam và châu Nam Cực thuộc Pháp",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Đức",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Hy Lạp",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Đảo Heard và Quần đảo Mcdonald",
  VA: "Tòa Thánh (Thành phố Vatican)",
  HN: "Honduras",
  HK: "Hồng Kông",
  HU: "Hungary",
  IS: "Iceland",
  IN: "Ấn Độ",
  ID: "Indonesia",
  IR: "Cộng hòa Hồi giáo Iran",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Ý",
  JM: "Jamaica",
  JP: "Nhật Bản",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Triều Tiên",
  KR: "Hàn Quốc",
  KW: "Cô-oét",
  KG: "Kyrgyzstan",
  LA: "Cộng hòa Dân chủ nhân dân Lào",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MO: "Ma Cao",
  MK: "Bắc Macedonia",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Bán đảo Mã Lai",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Quần đảo Marshall",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Liên bang Micronesia",
  MD: "Cộng hoà Moldova",
  MC: "Monaco",
  MN: "Mông Cổ",
  MS: "Montserrat",
  MA: "Ma-rốc",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Hà Lan",
  NC: "New Caledonia",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Đảo Norfolk",
  MP: "Quần đảo Bắc Mariana",
  NO: "Na Uy",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Lãnh thổ Palestine, bị chiếm đóng",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PN: "Pitcairn",
  PL: "Ba Lan",
  PT: "Bồ Đào Nha",
  PR: "Puerto Rico",
  QA: "Qatar",
  RE: "Reunion",
  RO: "Rumani",
  RU: [
    "Liên bang Nga",
    "Nga"
  ],
  RW: "Rwanda",
  SH: "Saint Helena",
  KN: "Saint Kitts và Nevis",
  LC: "Saint Lucia",
  PM: "Saint Pierre và Miquelon",
  VC: "Saint Vincent và Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome và Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Quần đảo Solomon",
  SO: "Somalia",
  ZA: "Nam Phi",
  GS: "Nam Georgia và Quần đảo Nam Sandwich",
  ES: "Tây Ban Nha",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SJ: "Svalbard và Jan Mayen",
  SZ: "Eswatini",
  SE: "Thụy Điển",
  CH: "Thụy Sĩ",
  SY: "Cộng Hòa Arab Syrian",
  TW: "Đài Loan",
  TJ: "Tajikistan",
  TZ: "Cộng hòa Thống nhất Tanzania",
  TH: "Thái Lan",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad và Tobago",
  TN: "Tunisia",
  TR: "Thổ Nhĩ Kỳ",
  TM: "Turkmenistan",
  TC: "Quần đảo Turks và Caicos",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "Các Tiểu Vương Quốc Ả Rập Thống Nhất",
  GB: "Vương quốc Anh",
  US: [
    "Hợp chủng quốc Hoa Kỳ",
    "Mỹ"
  ],
  UM: "Quần đảo nhỏ hẻo lánh của Hoa Kỳ",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Việt Nam",
  VG: "Quần đảo Virgin, Anh",
  VI: "Quần đảo Virgin, Hoa Kỳ",
  WF: "Lãnh thổ quần đảo Wallis và Futuna",
  EH: "Tây Sahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Quần đảo Aland",
  BQ: "Bonaire, Sint Eustatius và Saba",
  CW: "Curaçao",
  GG: "Guernsey",
  IM: "Đảo Man",
  JE: "Jersey",
  ME: "Montenegro",
  BL: "Saint Barthélemy",
  MF: "Saint Martin (phần Pháp)",
  RS: "Serbia",
  SX: "Sint Maarten (phần Hà Lan)",
  SS: "Nam Sudan",
  XK: "Kosovo"
};
const vi = {
  locale: locale$1,
  countries: countries$1
};
const locale = "zh";
const countries = {
  AD: "安道尔",
  AE: "阿联酋",
  AF: "阿富汗",
  AG: "安提瓜和巴布达",
  AI: "安圭拉",
  AL: "阿尔巴尼亚",
  AM: "亚美尼亚",
  AO: "安哥拉",
  AQ: "南极洲",
  AR: "阿根廷",
  AS: "美属萨摩亚",
  AT: "奥地利",
  AU: "澳大利亚",
  AW: "阿鲁巴",
  AX: "奥兰",
  AZ: "阿塞拜疆",
  BA: "波黑",
  BB: "巴巴多斯",
  BD: "孟加拉国",
  BE: "比利时",
  BF: "布基纳法索",
  BG: "保加利亚",
  BH: "巴林",
  BI: "布隆迪",
  BJ: "贝宁",
  BL: "圣巴泰勒米",
  BM: "百慕大",
  BN: "文莱",
  BO: "玻利维亚",
  BQ: "荷兰加勒比区",
  BR: "巴西",
  BS: "巴哈马",
  BT: "不丹",
  BV: "布韦岛",
  BW: "博茨瓦纳",
  BY: "白俄罗斯",
  BZ: "伯利兹",
  CA: "加拿大",
  CC: "科科斯（基林）群岛",
  CD: "刚果（金）",
  CF: "中非",
  CG: "刚果（布）",
  CH: "瑞士",
  CI: "科特迪瓦",
  CK: "库克群岛",
  CL: "智利",
  CM: "喀麦隆",
  CN: "中国",
  CO: "哥伦比亚",
  CR: "哥斯达黎加",
  CU: "古巴",
  CV: "佛得角",
  CW: "库拉索",
  CX: "圣诞岛",
  CY: "塞浦路斯",
  CZ: "捷克",
  DE: "德国",
  DJ: "吉布提",
  DK: "丹麦",
  DM: "多米尼克",
  DO: "多米尼加",
  DZ: "阿尔及利亚",
  EC: "厄瓜多尔",
  EE: "爱沙尼亚",
  EG: "埃及",
  EH: "阿拉伯撒哈拉民主共和国",
  ER: "厄立特里亚",
  ES: "西班牙",
  ET: "埃塞俄比亚",
  FI: "芬兰",
  FJ: "斐济",
  FK: "福克兰群岛",
  FM: "密克罗尼西亚联邦",
  FO: "法罗群岛",
  FR: "法国",
  GA: "加蓬",
  GB: "英国",
  GD: "格林纳达",
  GE: "格鲁吉亚",
  GF: "法属圭亚那",
  GG: "根西",
  GH: "加纳",
  GI: "直布罗陀",
  GL: "格陵兰",
  GM: "冈比亚",
  GN: "几内亚",
  GP: "瓜德罗普",
  GQ: "赤道几内亚",
  GR: "希腊",
  GS: "南乔治亚和南桑威奇群岛",
  GT: "危地马拉",
  GU: "关岛",
  GW: "几内亚比绍",
  GY: "圭亚那",
  HK: "香港",
  HM: "赫德岛和麦克唐纳群岛",
  HN: "洪都拉斯",
  HR: "克罗地亚",
  HT: "海地",
  HU: "匈牙利",
  ID: "印尼",
  IE: "爱尔兰",
  IL: "以色列",
  IM: "马恩岛",
  IN: "印度",
  IO: "英属印度洋领地",
  IQ: "伊拉克",
  IR: "伊朗",
  IS: "冰岛",
  IT: "意大利",
  JE: "泽西",
  JM: "牙买加",
  JO: "约旦",
  JP: "日本",
  KE: "肯尼亚",
  KG: "吉尔吉斯斯坦",
  KH: "柬埔寨",
  KI: "基里巴斯",
  KM: "科摩罗",
  KN: "圣基茨和尼维斯",
  KP: "朝鲜",
  KR: "韩国",
  KW: "科威特",
  KY: "开曼群岛",
  KZ: "哈萨克斯坦",
  LA: "老挝",
  LB: "黎巴嫩",
  LC: "圣卢西亚",
  LI: "列支敦士登",
  LK: "斯里兰卡",
  LR: "利比里亚",
  LS: "莱索托",
  LT: "立陶宛",
  LU: "卢森堡",
  LV: "拉脱维亚",
  LY: "利比亚",
  MA: "摩洛哥",
  MC: "摩纳哥",
  MD: "摩尔多瓦",
  ME: "黑山",
  MF: "法属圣马丁",
  MG: "马达加斯加",
  MH: "马绍尔群岛",
  MK: "北马其顿",
  ML: "马里",
  MM: "缅甸",
  MN: "蒙古",
  MO: "澳门",
  MP: "北马里亚纳群岛",
  MQ: "马提尼克",
  MR: "毛里塔尼亚",
  MS: "蒙特塞拉特",
  MT: "马耳他",
  MU: "毛里求斯",
  MV: "马尔代夫",
  MW: "马拉维",
  MX: "墨西哥",
  MY: "马来西亚",
  MZ: "莫桑比克",
  NA: "纳米比亚",
  NC: "新喀里多尼亚",
  NE: "尼日尔",
  NF: "诺福克岛",
  NG: "尼日利亚",
  NI: "尼加拉瓜",
  NL: "荷兰",
  NO: "挪威",
  NP: "尼泊尔",
  NR: "瑙鲁",
  NU: "纽埃",
  NZ: "新西兰",
  OM: "阿曼",
  PA: "巴拿马",
  PE: "秘鲁",
  PF: "法属波利尼西亚",
  PG: "巴布亚新几内亚",
  PH: "菲律宾",
  PK: "巴基斯坦",
  PL: "波兰",
  PM: "圣皮埃尔和密克隆",
  PN: "皮特凯恩群岛",
  PR: "波多黎各",
  PS: "巴勒斯坦",
  PT: "葡萄牙",
  PW: "帕劳",
  PY: "巴拉圭",
  QA: "卡塔尔",
  RE: "留尼汪",
  RO: "罗马尼亚",
  RS: "塞尔维亚",
  RU: "俄罗斯",
  RW: "卢旺达",
  SA: "沙特阿拉伯",
  SB: "所罗门群岛",
  SC: "塞舌尔",
  SD: "苏丹",
  SE: "瑞典",
  SG: "新加坡",
  SH: "圣赫勒拿、阿森松和特里斯坦-达库尼亚",
  SI: "斯洛文尼亚",
  SJ: "斯瓦尔巴和扬马延",
  SK: "斯洛伐克",
  SL: "塞拉利昂",
  SM: "圣马力诺",
  SN: "塞内加尔",
  SO: "索马里",
  SR: "苏里南",
  SS: "南苏丹",
  ST: "圣多美和普林西比",
  SV: "萨尔瓦多",
  SX: "荷属圣马丁",
  SY: "叙利亚",
  SZ: "斯威士兰",
  TC: "特克斯和凯科斯群岛",
  TD: "乍得",
  TF: "法属南部领地",
  TG: "多哥",
  TH: "泰国",
  TJ: "塔吉克斯坦",
  TK: "托克劳",
  TL: "东帝汶",
  TM: "土库曼斯坦",
  TN: "突尼斯",
  TO: "汤加",
  TR: "土耳其",
  TT: "特立尼达和多巴哥",
  TV: "图瓦卢",
  TW: "中国台湾省",
  TZ: "坦桑尼亚",
  UA: "乌克兰",
  UG: "乌干达",
  UM: "美国本土外小岛屿",
  US: "美国",
  UY: "乌拉圭",
  UZ: "乌兹别克斯坦",
  VA: "梵蒂冈",
  VC: "圣文森特和格林纳丁斯",
  VE: "委内瑞拉",
  VG: "英属维尔京群岛",
  VI: "美属维尔京群岛",
  VN: "越南",
  VU: "瓦努阿图",
  WF: "瓦利斯和富图纳",
  WS: "萨摩亚",
  XK: "科索沃",
  YE: "也门",
  YT: "马约特",
  ZA: "南非",
  ZM: "赞比亚",
  ZW: "津巴布韦"
};
const zh = {
  locale,
  countries
};
const locales = {
  af,
  am,
  ar,
  az,
  be,
  bg,
  bn,
  br,
  bs,
  ca,
  cs,
  cy,
  da,
  de,
  dv,
  en,
  es,
  et,
  eu,
  fa,
  fi,
  fr,
  ga,
  gl,
  el,
  ha,
  he,
  hi,
  hr,
  hu,
  hy,
  is,
  it,
  id,
  ja,
  ka,
  kk,
  km,
  ko,
  ku,
  ky,
  lt,
  lv,
  mk,
  ml,
  mn,
  mr,
  ms,
  mt,
  nb,
  nl,
  nn,
  no,
  pl,
  ps,
  pt,
  ro,
  ru,
  sd,
  sk,
  sl,
  so,
  sq,
  sr,
  sv,
  sw,
  ta,
  tg,
  th,
  tr,
  tt,
  ug,
  uk,
  ur,
  uz,
  zh,
  vi
};
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function formatNumberWithSIPrefix(number) {
  var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
  var tier = Math.log10(Math.abs(number)) / 3 | 0;
  if (tier == 0)
    return number;
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);
  var scaled = number / scale;
  return scaled.toFixed(1) + suffix;
}
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function isValidIsoCode(code) {
  const isoCodeRegex = /^(?:[A-Z]{2,3}|[A-Z]{2}-[A-Z0-9]{1,3})$/;
  return isoCodeRegex.test(code);
}
function isSVG(input) {
  const svgRegex = /^\s*<svg\b[^>]*>.*<\/svg>\s*$/is;
  try {
    if (svgRegex.test(input)) {
      const parser = new DOMParser();
      const doc2 = parser.parseFromString(input, "image/svg+xml");
      const parserErrors = doc2.getElementsByTagName("parsererror");
      if (parserErrors.length > 0) {
        return false;
      }
      const svgElements = doc2.getElementsByTagName("svg");
      return svgElements.length > 0 && svgElements[0].parentNode === doc2;
    }
    return false;
  } catch (e) {
    return false;
  }
}
const _withScopeId$1 = (n) => (pushScopeId("data-v-e8982a39"), n = n(), popScopeId(), n);
const _hoisted_1$1 = { class: "v3mc-tooltip-wrapper" };
const _hoisted_2$1 = { class: "v3mc-tooltip-label" };
const _hoisted_3$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("div", { class: "v3mc-tooltip-divider" }, null, -1));
const _hoisted_4$1 = { class: "v3mc-tooltip-value" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Tooltip",
  props: {
    label: {},
    value: {},
    bgColor: { default: "rgba(0, 0, 0, 0.5)" },
    textColor: { default: "#d8d8d8" }
  },
  setup(__props) {
    useCssVars((_ctx) => ({
      "bb2e32be": unref(bgColor),
      "42c7e9f9": unref(textColor)
    }));
    const props = __props;
    const bgColor = computed(() => props.bgColor);
    const textColor = computed(() => props.textColor);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("span", _hoisted_2$1, toDisplayString(props.label), 1),
        props.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          _hoisted_3$1,
          createBaseVNode("span", _hoisted_4$1, toDisplayString(props.value), 1)
        ], 64)) : createCommentVNode("", true)
      ]);
    };
  }
});
const _export_sfc$1 = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const Tooltip = /* @__PURE__ */ _export_sfc$1(_sfc_main$1, [["__scopeId", "data-v-e8982a39"]]);
const _withScopeId$2 = (n) => (pushScopeId("data-v-a1e023ab"), n = n(), popScopeId(), n);
const _hoisted_1$2 = { class: "v3mc-container" };
const _hoisted_2$2 = { class: "v3mc-tiny-loader-wrapper" };
const _hoisted_3$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("div", { class: "v3mc-tiny-loader" }, null, -1));
const _hoisted_4$2 = ["id", "innerHTML"];
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "MapChart",
  props: {
    langCode: { default: "en" },
    width: { default: "100%" },
    height: { default: 500 },
    mapStyles: { default: () => ({}) },
    displayLegend: { type: Boolean, default: true },
    displayLegendWhenEmpty: { type: Boolean, default: true },
    formatValueWithSiPrefix: { type: Boolean, default: false },
    forceCursorPointer: { type: Boolean, default: false },
    legendBgColor: { default: void 0 },
    legendTextColor: { default: void 0 },
    legendValuePrefix: { default: "" },
    legendValueSuffix: { default: "" },
    defaultStrokeColor: { default: "rgb(200, 200, 200)" },
    defaultStrokeHoverColor: { default: "rgb(200, 200, 200)" },
    defaultFillColor: { default: "rgb(236, 236, 236)" },
    defaultFillHoverColor: { default: "rgb(226, 226, 226)" },
    baseColor: { default: "#0782c5" },
    loaderColor: { default: "#3498db" },
    customMapSvg: { default: "" },
    customMapLabels: { default: () => ({}) },
    data: {}
  },
  emits: [
    "mapItemTouchstart",
    "mapItemTouchend",
    "mapItemMouseover",
    "mapItemMouseout",
    "mapItemClick"
  ],
  setup(__props, { emit: __emit }) {
    useCssVars((_ctx) => ({
      "bf277c4c": unref(height),
      "1ec81ab3": unref(width),
      "4230373d": unref(defaultStrokeColor),
      "77b4995c": unref(defaultFillColor),
      "778410e4": unref(defaultCursor),
      "5cff1610": unref(defaultFillHoverColor),
      "b4daa826": _ctx.defaultStrokeHoverColor,
      "307880a9": unref(tooltipY),
      "307880a8": unref(tooltipX),
      "eef22b86": unref(loaderColor)
    }));
    const props = __props;
    onMounted(() => {
      const registerLocale = async (langCode) => {
        try {
          countries$1d.registerLocale(locales[langCode]);
        } catch (error) {
          console.error("Error loading locale:", error);
        }
      };
      registerLocale(props.langCode);
    });
    const height = computed(
      () => typeof props.height === "string" ? props.height : `${props.height}px`
    );
    const width = computed(
      () => typeof props.width === "string" ? props.width : `${props.width}px`
    );
    const loaderColor = computed(() => props.loaderColor);
    const defaultFillColor = computed(() => props.defaultFillColor);
    const defaultFillHoverColor = computed(
      () => props.displayLegend && props.displayLegendWhenEmpty ? props.defaultFillHoverColor : props.defaultFillColor
    );
    const defaultStrokeColor = computed(() => props.defaultStrokeColor);
    const defaultCursor = computed(() => {
      if (props.forceCursorPointer)
        return "pointer";
      return props.displayLegend && props.displayLegendWhenEmpty ? "pointer" : "default";
    });
    const cpntId = getRandomInteger(1e4, 99999);
    const isOutsideMap = ref(true);
    const currentAreaId = ref(null);
    const currentAreaValue = ref(null);
    const emits = __emit;
    onMounted(() => {
      const el2 = document.getElementById(`v3mc-map-${cpntId}`);
      if (el2) {
        const emitEvent = (target, emitId) => {
          var _a;
          const id2 = target.getAttribute("id");
          currentAreaId.value = id2;
          currentAreaValue.value = id2 ? props.data[id2] : null;
          if (id2 && isValidIsoCode(id2) && !!(countries$1d.getName(id2, props.langCode) || ((_a = iso3166.subdivision(id2)) == null ? void 0 : _a.name))) {
            emits(emitId, id2, currentAreaValue.value);
          }
        };
        useEventListener(el2, "touchstart", (event) => {
          emitEvent(event.target, "mapItemTouchstart");
        });
        useEventListener(el2, "touchend", (event) => {
          emitEvent(event.target, "mapItemTouchend");
        });
        useEventListener(el2, "mouseover", (event) => {
          emitEvent(event.target, "mapItemMouseover");
        });
        useEventListener(el2, "mouseout", (event) => {
          emitEvent(event.target, "mapItemMouseout");
        });
        useEventListener(el2, "click", (event) => {
          emitEvent(event.target, "mapItemClick");
        });
        const { isOutside } = useMouseInElement(el2);
        watch(
          () => isOutside.value,
          (value) => {
            isOutsideMap.value = value;
          }
        );
      }
    });
    const { x, y } = useMouse();
    const slots = useSlots();
    const svgMap = ref(null);
    const isLoading = ref(false);
    const loadSvgMap = async () => {
      if (props.customMapSvg && isSVG(props.customMapSvg)) {
        svgMap.value = props.customMapSvg;
        return;
      }
      try {
        if (slots.default) {
          const slotContent = slots.default();
          const type = slotContent[0].type;
          if (typeof type == "object") {
            const fetchData = async () => {
              const svgUrl = `https://raw.githubusercontent.com/noeGnh/vue3-map-chart/master/packages/vue3-map-chart/src/assets/maps/${type.template}`;
              isLoading.value = true;
              const response = await fetch(svgUrl);
              svgMap.value = await response.text();
              const cacheData = {
                svg: svgMap.value,
                timestamp: Date.now()
              };
              localStorage.setItem(type.name, JSON.stringify(cacheData));
            };
            const cachedData = localStorage.getItem(type.name);
            if (cachedData) {
              const { svg, timestamp } = JSON.parse(cachedData);
              const isCacheValid = Date.now() - timestamp < 28 * 24 * 60 * 60 * 1e3;
              if (isCacheValid) {
                svgMap.value = svg;
              } else
                await fetchData();
            } else
              await fetchData();
          }
        } else {
          svgMap.value = "";
          console.warn("No map found");
        }
      } catch (error) {
        svgMap.value = "";
        console.error("Error loading map:", error);
      } finally {
        isLoading.value = false;
      }
    };
    watch(
      () => slots.default,
      () => {
        loadSvgMap();
      },
      { immediate: true, deep: true }
    );
    const { css } = useStyleTag("", {
      id: `v3mc-map-${cpntId}-styles`
    });
    const buildStyles = () => {
      if (isObject(props.data)) {
        let min;
        let max;
        Object.keys(props.data).forEach((key) => {
          const dataValue = props.data[key];
          if (typeof dataValue === "number") {
            if (min === void 0 || dataValue < min) {
              min = dataValue;
            }
            if (max === void 0 || dataValue > max) {
              max = dataValue;
            }
          } else if (isObject(dataValue)) {
            const value = dataValue.value || 0;
            if (min === void 0 || value < min) {
              min = value;
            }
            if (max === void 0 || value > max) {
              max = value;
            }
          }
        });
        Object.keys(props.data).forEach((key) => {
          const dataValue = props.data[key];
          let value, color, opacity;
          if (typeof dataValue === "number") {
            value = dataValue;
          } else if (isObject(dataValue)) {
            value = dataValue.value;
            color = dataValue.color;
          }
          if (value === void 0 || max === void 0 || min === void 0) {
            opacity = 1;
          } else {
            opacity = (value - min) / (max - min);
            opacity = opacity == 0 ? 0.05 : opacity;
          }
          css.value += ` #v3mc-map-${cpntId} #${key.toUpperCase()} { fill: ${color || props.baseColor}; fill-opacity: ${opacity}; cursor: ${props.displayLegend ? "pointer" : "default"}; } `;
          css.value += ` #v3mc-map-${cpntId} #${key.toUpperCase()}:hover { fill-opacity: ${opacity + 0.05}; } `;
        });
      }
    };
    watch(
      () => props.data,
      () => {
        buildStyles();
      },
      { deep: true, immediate: true }
    );
    const tooltipLabel = computed(() => {
      var _a, _b;
      const customLegendLabel = typeof currentAreaValue.value === "number" ? void 0 : (_a = currentAreaValue.value) == null ? void 0 : _a.legendLabel;
      const customMapLabel = props.customMapLabels && currentAreaId.value && props.customMapLabels[currentAreaId.value] ? props.customMapLabels[currentAreaId.value] : void 0;
      const areaName = currentAreaId.value ? countries$1d.getName(currentAreaId.value, props.langCode) || ((_b = iso3166.subdivision(currentAreaId.value)) == null ? void 0 : _b.name) || currentAreaId.value : currentAreaId.value;
      return customLegendLabel || customMapLabel || areaName || "";
    });
    const tooltipValue = computed(() => {
      var _a;
      let value = (typeof currentAreaValue.value === "number" ? currentAreaValue.value : (_a = currentAreaValue.value) == null ? void 0 : _a.value) || "";
      if (typeof value !== "number")
        return value;
      value = props.formatValueWithSiPrefix ? formatNumberWithSIPrefix(value) : value;
      value = props.legendValuePrefix + value + props.legendValueSuffix;
      return value;
    });
    const showTooltipOnHover = computed(() => {
      return !isOutsideMap.value && props.displayLegend && (props.displayLegendWhenEmpty || tooltipValue.value) && tooltipLabel.value;
    });
    const tooltipX = computed(() => {
      return `${x.value - 100}px`;
    });
    const tooltipY = computed(() => {
      return `${y.value < 100 ? y.value + 25 : y.value - 100}px`;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        withDirectives(createBaseVNode("div", _hoisted_2$2, [
          renderSlot(_ctx.$slots, "loader", {}, () => [
            _hoisted_3$2
          ], true)
        ], 512), [
          [vShow, unref(isLoading)]
        ]),
        withDirectives(createBaseVNode("div", {
          id: `v3mc-map-${unref(cpntId)}`,
          class: "v3mc-map",
          style: normalizeStyle(_ctx.mapStyles),
          innerHTML: unref(svgMap)
        }, null, 12, _hoisted_4$2), [
          [vShow, !unref(isLoading)]
        ]),
        unref(showTooltipOnHover) ? (openBlock(), createBlock(Tooltip, {
          key: 0,
          id: `v3mc-tooltip-${unref(cpntId)}`,
          class: "v3mc-tooltip",
          label: unref(tooltipLabel),
          value: unref(tooltipValue),
          "bg-color": props.legendBgColor,
          "text-color": props.legendTextColor
        }, null, 8, ["id", "label", "value", "bg-color", "text-color"])) : createCommentVNode("", true)
      ]);
    };
  }
});
const MapChart = /* @__PURE__ */ _export_sfc$1(_sfc_main$2, [["__scopeId", "data-v-a1e023ab"]]);
const plugin = {
  install(app, options) {
    app.component((options == null ? void 0 : options.name) || "MapChart", MapChart);
    if (options == null ? void 0 : options.maps) {
      Object.keys(options.maps).forEach((mapName) => {
        if (options.maps)
          app.component(mapName, options.maps[mapName]);
      });
    }
  }
};
const WorldMap = { name: "WorldMap", template: "world.svg" };
const AfricaMap = { name: "AfricaMap", template: "continents/africa.svg" };
const AsiaMap = { name: "AsiaMap", template: "continents/asia.svg" };
const EuropeMap = { name: "EuropeMap", template: "continents/europe.svg" };
const NorthAmericaMap = { name: "NorthAmericaMap", template: "continents/north-america.svg" };
const OceaniaMap = { name: "OceaniaMap", template: "continents/oceania.svg" };
const SouthAmericaMap = { name: "SouthAmericaMap", template: "continents/south-america.svg" };
const EgyptMap = { name: "EgyptMap", template: "countries/africa/egypt.svg" };
const JapanMap = { name: "JapanMap", template: "countries/asia/japan.svg" };
const GermanyMap = { name: "GermanyMap", template: "countries/europe/germany.svg" };
const BrazilMap = { name: "BrazilMap", template: "countries/south-america/brazil.svg" };
const _withScopeId = (n) => (pushScopeId("data-v-296e8914"), n = n(), popScopeId(), n);
const _hoisted_1 = { class: "grid-container" };
const _hoisted_2 = { class: "cell big" };
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "World", -1));
const _hoisted_4 = { class: "cell small" };
const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "Africa", -1));
const _hoisted_6 = { class: "cell small" };
const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "Asia", -1));
const _hoisted_8 = { class: "cell small" };
const _hoisted_9 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "Europe", -1));
const _hoisted_10 = { class: "cell small" };
const _hoisted_11 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "North America", -1));
const _hoisted_12 = { class: "cell small" };
const _hoisted_13 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "South America", -1));
const _hoisted_14 = { class: "cell small" };
const _hoisted_15 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "Oceania", -1));
const _hoisted_16 = { class: "cell small" };
const _hoisted_17 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "Germany", -1));
const _hoisted_18 = { class: "cell small" };
const _hoisted_19 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "Brazil", -1));
const _hoisted_20 = { class: "cell small" };
const _hoisted_21 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "Japan", -1));
const _hoisted_22 = { class: "cell small" };
const _hoisted_23 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "map-label" }, "Egypt", -1));
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    const worldData = {
      US: 13,
      CA: 63,
      GB: 10,
      DE: 95,
      JP: 76,
      CN: 46,
      IN: 98,
      BR: 96,
      AU: 10,
      IT: 85,
      RU: 42,
      ZA: 58,
      NG: 72,
      MX: 13,
      ES: 17,
      AR: 64,
      CH: 41,
      NL: 35,
      KR: 45,
      SE: 72,
      NO: 79,
      FI: 34,
      DK: 81,
      PL: 27,
      GR: 78,
      PT: 77,
      BE: 14,
      IE: 92,
      NZ: 83,
      IL: 43,
      TR: 42,
      SA: 74,
      EG: 93,
      PK: 54,
      BD: 25,
      IR: 29,
      IQ: 60,
      AF: 22,
      DZ: 17,
      MA: 60,
      TH: 96,
      MY: 64,
      VN: 11,
      PH: 51,
      SG: 20,
      ID: 47,
      CL: 53,
      CO: 30,
      PE: 47,
      VE: 57,
      CU: 92,
      FR: 47
    };
    const africaData = {
      ZA: 58,
      // South Africa
      NG: 72,
      // Nigeria
      EG: 93,
      // Egypt
      KE: 45,
      // Kenya
      GH: 39,
      // Ghana
      DZ: 17,
      // Algeria
      MA: 60,
      // Morocco
      TZ: 25,
      // Tanzania
      UG: 48,
      // Uganda
      AO: 34,
      // Angola
      ET: 50,
      // Ethiopia
      SN: 30,
      // Senegal
      CI: 21,
      // Ivory Coast
      TN: 40,
      // Tunisia
      BF: 29,
      // Burkina Faso
      MZ: 26,
      // Mozambique
      ZM: 33,
      // Zambia
      CM: 37,
      // Cameroon
      MG: 20,
      // Madagascar
      ML: 22,
      // Mali
      RW: 28,
      // Rwanda
      NE: 18,
      // Niger
      SL: 19,
      // Sierra Leone
      NA: 24,
      // Namibia
      BW: 32
      // Botswana
    };
    const asiaData = {
      CN: 46,
      // China
      IN: 98,
      // India
      JP: 76,
      // Japan
      KR: 45,
      // South Korea
      ID: 47,
      // Indonesia
      PK: 54,
      // Pakistan
      BD: 25,
      // Bangladesh
      VN: 11,
      // Vietnam
      PH: 51,
      // Philippines
      TH: 96,
      // Thailand
      MY: 64,
      // Malaysia
      SG: 20,
      // Singapore
      MM: 31,
      // Myanmar
      LK: 22,
      // Sri Lanka
      KH: 28,
      // Cambodia
      LA: 19,
      // Laos
      NP: 37,
      // Nepal
      MN: 15,
      // Mongolia
      KZ: 33,
      // Kazakhstan
      UZ: 29,
      // Uzbekistan
      SA: 74,
      // Saudi Arabia
      IR: 29,
      // Iran
      IQ: 60,
      // Iraq
      SY: 23,
      // Syria
      JO: 27,
      // Jordan
      LB: 18,
      // Lebanon
      YE: 24,
      // Yemen
      OM: 35,
      // Oman
      QA: 42,
      // Qatar
      KW: 39,
      // Kuwait
      AE: 49,
      // United Arab Emirates
      IL: 43,
      // Israel
      AF: 22
      // Afghanistan
    };
    const europeData = {
      DE: 95,
      // Germany
      FR: 47,
      // France
      GB: 10,
      // United Kingdom
      IT: 85,
      // Italy
      ES: 17,
      // Spain
      PL: 27,
      // Poland
      RO: 30,
      // Romania
      NL: 35,
      // Netherlands
      BE: 14,
      // Belgium
      GR: 78,
      // Greece
      PT: 77,
      // Portugal
      CZ: 29,
      // Czech Republic
      HU: 31,
      // Hungary
      SE: 72,
      // Sweden
      AT: 44,
      // Austria
      CH: 41,
      // Switzerland
      BG: 22,
      // Bulgaria
      DK: 81,
      // Denmark
      FI: 34,
      // Finland
      NO: 79,
      // Norway
      IE: 92,
      // Ireland
      HR: 28,
      // Croatia
      SI: 26,
      // Slovenia
      SK: 33,
      // Slovakia
      LT: 18,
      // Lithuania
      LV: 20,
      // Latvia
      EE: 21,
      // Estonia
      CY: 25,
      // Cyprus
      LU: 19,
      // Luxembourg
      MT: 23,
      // Malta
      IS: 30,
      // Iceland
      UA: 50,
      // Ukraine
      BY: 32,
      // Belarus
      RU: 42
      // Russia
    };
    const northAmericaData = {
      US: 13500,
      // United States
      CA: 63800,
      // Canada
      MX: 13450,
      // Mexico
      GT: 27520,
      // Guatemala
      HN: 18260,
      // Honduras
      SV: 19657,
      // El Salvador
      NI: 23905,
      // Nicaragua
      CR: 24e3,
      // Costa Rica
      PA: 33600,
      // Panama
      HT: 22469,
      // Haiti
      DO: 285,
      // Dominican Republic
      CU: 36223,
      // Cuba
      JM: 31111,
      // Jamaica
      BS: 15333,
      // Bahamas
      BB: 2009,
      // Barbados
      TT: 25456,
      // Trinidad and Tobago
      BZ: 17e3,
      // Belize
      AG: 21223,
      // Antigua and Barbuda
      DM: 16505,
      // Dominica
      LC: 29098,
      // Saint Lucia
      VC: 1434,
      // Saint Vincent and the Grenadines
      GD: 26009,
      // Grenada
      KN: 12e3
      // Saint Kitts and Nevis
    };
    const southAmericaData = {
      AR: 4500,
      // Argentina
      BO: 3400,
      // Bolivia
      BR: 7800,
      // Brazil
      CL: 5200,
      // Chile
      CO: 6700,
      // Colombia
      EC: 3900,
      // Ecuador
      GY: 2200,
      // Guyana
      PY: 2900,
      // Paraguay
      PE: 7100,
      // Peru
      SR: 1800,
      // Suriname
      UY: 3300,
      // Uruguay
      VE: 5500
      // Venezuela
    };
    const oceaniaData = {
      AU: {
        color: "blue",
        legendLabel: "Australia / Capital: Canberra"
      },
      // Australia
      NZ: {
        color: "#339601",
        legendLabel: "New Zealand / Capital: Wellington"
      },
      // New Zealand
      ID: {
        color: "#F7931E",
        legendLabel: "Indonesia / Capital: Jakarta"
      },
      // Indonesia
      PG: {
        color: "#D31F3C",
        legendLabel: "Papua New Guinea / Capital: Port Moresby"
      },
      // Papua New Guinea
      SB: {
        color: "#FFC700",
        legendLabel: "Solomon Islands / Capital: Honiara"
      },
      // Solomon Islands
      VU: {
        color: "#132D50",
        legendLabel: "Vanuatu / Capital: Port Vila"
      },
      // Vanuatu
      PH: {
        legendLabel: "Philippines / Capital: Manila"
      }
      // Philippines
    };
    const germanyData = {
      "DE-BW": 58,
      // Baden-Württemberg
      "DE-BY": 63,
      // Bavaria (Bayern)
      "DE-NW": 75,
      // North Rhine-Westphalia (Nordrhein-Westfalen)
      "DE-HE": 40,
      // Hesse (Hessen)
      "DE-BE": 54,
      // Berlin
      "DE-HH": 50,
      // Hamburg
      "DE-SH": 45,
      // Schleswig-Holstein
      "DE-NI": 49,
      // Lower Saxony (Niedersachsen)
      "DE-SN": 41,
      // Saxony (Sachsen)
      "DE-ST": 38,
      // Saxony-Anhalt (Sachsen-Anhalt)
      "DE-TH": 36,
      // Thuringia (Thüringen)
      "DE-RP": 43,
      // Rhineland-Palatinate (Rheinland-Pfalz)
      "DE-SL": 30,
      // Saarland
      "DE-BB": 37,
      // Brandenburg
      "DE-MV": 34
      // Mecklenburg-Vorpommern
    };
    const brazilData = {
      "BR-SP": {
        color: "#1B5E20",
        legendLabel: "São Paulo",
        value: 600
      },
      "BR-RJ": {
        color: "#4CAF50",
        legendLabel: "Rio de Janeiro",
        value: 300
      },
      "BR-MG": {
        color: "#388E3C",
        legendLabel: "Minas Gerais",
        value: 250
      },
      "BR-RS": {
        color: "#66BB6A",
        legendLabel: "Rio Grande do Sul",
        value: 160
      },
      "BR-BA": {
        color: "#81C784",
        legendLabel: "Bahia",
        value: 140
      },
      "BR-PR": {
        color: "#43A047",
        legendLabel: "Paraná",
        value: 180
      },
      "BR-PE": {
        color: "#A5D6A7",
        legendLabel: "Pernambuco",
        value: 110
      },
      "BR-CE": {
        color: "#C8E6C9",
        legendLabel: "Ceará",
        value: 100
      },
      "BR-PA": {
        color: "#AED581",
        legendLabel: "Pará",
        value: 90
      }
    };
    const japanData = {
      "JP-13": {
        color: "#880E4F",
        legendLabel: "Tokyo / Pop: 14M"
      },
      "JP-27": {
        color: "#C2185B",
        legendLabel: "Osaka / Pop: 8.8M"
      },
      "JP-14": {
        color: "#AD1457",
        legendLabel: "Kanagawa / Pop: 9.2M"
      },
      "JP-23": {
        color: "#D81B60",
        legendLabel: "Aichi / Pop: 7.5M"
      },
      "JP-11": {
        color: "#EC407A",
        legendLabel: "Saitama / Pop: 7.4M"
      },
      "JP-12": {
        color: "#F06292",
        legendLabel: "Chiba / Pop: 6.3M"
      },
      "JP-28": {
        color: "#E91E63",
        legendLabel: "Hyogo / Pop: 5.5M"
      },
      "JP-40": {
        color: "#F48FB1",
        legendLabel: "Fukuoka / Pop: 5.1M"
      },
      "JP-01": {
        color: "#F8BBD0",
        legendLabel: "Hokkaido / Pop: 5.3M"
      }
    };
    const egyptData = {
      "EG-C": 72,
      // Cairo (Le Caire)
      "EG-GZ": 65,
      // Giza (Gizeh)
      "EG-DK": 60,
      // Dakahlia
      "EG-SHR": 59,
      // Sharqia
      "EG-MT": 64,
      // Matruh
      "EG-JS": 58,
      // South Sinai (Janub Sina')
      "EG-BA": 48,
      // Bani Suwayf
      "EG-ASN": 52,
      // Aswan
      "EG-FYM": 47,
      // Faiyum
      "EG-BH": 66,
      // Beheira
      "EG-KB": 61,
      // Qalyubia
      "EG-MNF": 55,
      // Monufia
      "EG-IS": 53,
      // Ismailia
      "EG-KFS": 50,
      // Kafr el-Sheikh
      "EG-SUZ": 62
      // Suez
    };
    const isTouchDevice = computed(
      () => "ontouchstart" in window || navigator.maxTouchPoints > 0
    );
    const onMapItemClick = (areaId, areaValue) => {
      if (!isTouchDevice.value)
        alert(`${areaId}: ${areaValue}`);
    };
    const onMapItemMouseout = (areaId, areaValue) => {
      console.log(`Mouseout ${areaId}: ${areaValue}`);
    };
    const onMapItemMouseover = (areaId, areaValue) => {
      console.log(`Mouseover ${areaId}: ${areaValue}`);
    };
    return (_ctx, _cache) => {
      const _component_MapChart = resolveComponent("MapChart");
      const _component_GermanyMap = resolveComponent("GermanyMap");
      const _component_JapanMap = resolveComponent("JapanMap");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          createVNode(_component_MapChart, {
            data: worldData,
            "map-styles": { height: "100%" },
            "display-legend-when-empty": false,
            onMapItemClick
          }, {
            default: withCtx(() => [
              createVNode(unref(WorldMap))
            ]),
            _: 1
          }),
          _hoisted_3
        ]),
        createBaseVNode("div", _hoisted_4, [
          createVNode(_component_MapChart, {
            "base-color": "#339601",
            "legend-value-suffix": " %",
            "legend-text-color": "whitesmoke",
            "legend-bg-color": "rgba(0, 0, 255, 0.8)",
            data: africaData,
            "map-styles": { height: "100%" },
            "display-legend-when-empty": false,
            onMapItemClick
          }, {
            default: withCtx(() => [
              createVNode(unref(AfricaMap))
            ]),
            _: 1
          }),
          _hoisted_5
        ]),
        createBaseVNode("div", _hoisted_6, [
          createVNode(_component_MapChart, {
            "lang-code": "zh",
            "base-color": "#F7931E",
            data: asiaData,
            "map-styles": { height: "100%" },
            "display-legend-when-empty": false,
            onMapItemClick
          }, {
            default: withCtx(() => [
              createVNode(unref(AsiaMap))
            ]),
            _: 1
          }),
          _hoisted_7
        ]),
        createBaseVNode("div", _hoisted_8, [
          createVNode(_component_MapChart, {
            "lang-code": "fr",
            "base-color": "#D31F3C",
            "legend-value-suffix": " €",
            data: europeData,
            "map-styles": { height: "100%" },
            "display-legend-when-empty": false,
            onMapItemClick
          }, {
            default: withCtx(() => [
              createVNode(unref(EuropeMap))
            ]),
            _: 1
          }),
          _hoisted_9
        ]),
        createBaseVNode("div", _hoisted_10, [
          createVNode(_component_MapChart, {
            "base-color": "#FFC700",
            "legend-value-prefix": "$ ",
            data: northAmericaData,
            "map-styles": { height: "100%" },
            onMapItemClick
          }, {
            default: withCtx(() => [
              createVNode(unref(NorthAmericaMap))
            ]),
            _: 1
          }),
          _hoisted_11
        ]),
        createBaseVNode("div", _hoisted_12, [
          createVNode(_component_MapChart, {
            "base-color": "#132D50",
            "legend-text-color": "black",
            "legend-bg-color": "rgba(255, 255, 255, 0.8)",
            "legend-value-suffix": " km2",
            "format-value-with-si-prefix": "",
            data: southAmericaData,
            "map-styles": { height: "100%" },
            onMapItemClick
          }, {
            default: withCtx(() => [
              createVNode(unref(SouthAmericaMap))
            ]),
            _: 1
          }),
          _hoisted_13
        ]),
        createBaseVNode("div", _hoisted_14, [
          createVNode(_component_MapChart, {
            data: oceaniaData,
            "map-styles": { height: "100%" },
            onMapItemClick,
            onMapItemMouseout,
            onMapItemMouseover
          }, {
            default: withCtx(() => [
              createVNode(unref(OceaniaMap))
            ]),
            _: 1
          }),
          _hoisted_15
        ]),
        createBaseVNode("div", _hoisted_16, [
          createVNode(_component_MapChart, {
            "base-color": "#3F51B5",
            "legend-value-suffix": " %",
            data: germanyData,
            "map-styles": { height: "100%" },
            onMapItemClick
          }, {
            default: withCtx(() => [
              createVNode(_component_GermanyMap)
            ]),
            _: 1
          }),
          _hoisted_17
        ]),
        createBaseVNode("div", _hoisted_18, [
          createVNode(_component_MapChart, {
            data: brazilData,
            "map-styles": { height: "100%" },
            "legend-value-prefix": "GDP: $",
            "legend-value-suffix": "B",
            "display-legend-when-empty": false,
            onMapItemClick
          }, {
            default: withCtx(() => [
              createVNode(unref(BrazilMap))
            ]),
            _: 1
          }),
          _hoisted_19
        ]),
        createBaseVNode("div", _hoisted_20, [
          createVNode(_component_MapChart, {
            "base-color": "#E91E63",
            "legend-value-suffix": " ppl",
            data: japanData,
            "map-styles": { height: "100%" },
            onMapItemClick
          }, {
            default: withCtx(() => [
              createVNode(_component_JapanMap)
            ]),
            _: 1
          }),
          _hoisted_21
        ]),
        createBaseVNode("div", _hoisted_22, [
          createVNode(_component_MapChart, {
            "base-color": "#000000",
            "legend-value-suffix": "°C",
            "legend-bg-color": "rgba(0,0,0,0.7)",
            "legend-text-color": "white",
            data: egyptData,
            "map-styles": { height: "100%" },
            onMapItemClick
          }, {
            default: withCtx(() => [
              createVNode(unref(EgyptMap))
            ]),
            _: 1
          }),
          _hoisted_23
        ])
      ]);
    };
  }
});
const App_vue_vue_type_style_index_0_lang = "";
const App_vue_vue_type_style_index_1_scoped_296e8914_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-296e8914"]]);
__vitePreload(() => Promise.resolve({}), true ? ["assets/style-91eb124a.css"] : void 0);
createApp(App).use(plugin, { maps: { GermanyMap, JapanMap } }).mount("#app");
