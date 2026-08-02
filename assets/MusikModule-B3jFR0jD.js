const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SubjectPremiumAtelier-OFFtJlBa.js","assets/jsx-runtime-Be5yPkiZ.js","assets/star-DBCbE8d7.js","assets/proxy--6s_pC9q.js","assets/sounds-Dh98eEYj.js","assets/DeepLearningQuest-CbOGahul.js","assets/learningContent-D1WsycQZ.js","assets/wand-sparkles-CtIcwwM8.js","assets/animalFriends-U19Ro3hF.js","assets/premiumGamePack-CHz1F5u_.js","assets/compass-JckdT0FA.js","assets/grid-3x3-BjeKZBlx.js","assets/sparkles-bt2KNUwI.js","assets/SkyWonderland-Bz4SaHcY.js","assets/volume-2-Vs6pZO3N.js","assets/LearningArcade-BGnmy9QN.js","assets/trophy-Ci-hdIiU.js"])))=>i.map(i=>d[i]);
import { n as require_react, r as __commonJSMin, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as require_react_dom } from "./react-dom-koF_Qq9w.js";
import { _ as invariant, b as useIsomorphicLayoutEffect, c as animateVisualElement, t as motion, u as setTarget, x as useConstant } from "./proxy--6s_pC9q.js";
import { A as playSnareAcoustic, B as timeStretchBuffer, C as playPercFM, D as playShaker, E as playRim, F as playTom, I as playTomHighAcoustic, L as playTomLowAcoustic, M as playSnareHiphop, N as playSparkle, O as playSnap, P as playSynth, R as playVinyl, S as playMicSample, T as playRideAcoustic, V as AnimatePresence, _ as playKickAcoustic, b as playKickHiphop, c as playCymbalReverse, d as playHatTrap, f as playHiHat, g as playKick, h as playJingle, i as playClap, j as playSnareClap, k as playSnare, l as playError, m as playInstrumentTone, n as getAudioContext, o as playCrash, p as playHiHatClosedAcoustic, r as play808, s as playCrashAcoustic, t as generateWaveform, u as playHatEDM, v as playKickDeep, w as playPop, y as playKickEDM } from "./sounds-Dh98eEYj.js";
import { n as createLucideIcon, r as confetti_module_default } from "./star-DBCbE8d7.js";
import { t as __vitePreload } from "./index-B5O6y7xB.js";
import { a as MUSIC_MEMORY_INSTRUMENTS, o as MUSIC_RHYTHM_PATTERNS, s as SUBJECT_VARIANT_CONTENT } from "./learningContent-D1WsycQZ.js";
import { t as Sparkles } from "./sparkles-bt2KNUwI.js";
import { t as Volume2 } from "./volume-2-Vs6pZO3N.js";
import { i as VariantStudio, n as GameWorld, r as ActionArena, t as QuestMixer } from "./QuestMixer-CwJK0O5N.js";
//#region node_modules/framer-motion/dist/es/animation/hooks/animation-controls.mjs
function stopAnimation(visualElement) {
	visualElement.values.forEach((value) => value.stop());
}
function setVariants(visualElement, variantLabels) {
	[...variantLabels].reverse().forEach((key) => {
		const variant = visualElement.getVariant(key);
		variant && setTarget(visualElement, variant);
		if (visualElement.variantChildren) visualElement.variantChildren.forEach((child) => {
			setVariants(child, variantLabels);
		});
	});
}
function setValues(visualElement, definition) {
	if (Array.isArray(definition)) return setVariants(visualElement, definition);
	else if (typeof definition === "string") return setVariants(visualElement, [definition]);
	else setTarget(visualElement, definition);
}
/**
* @public
*/
function animationControls() {
	/**
	* Track whether the host component has mounted.
	*/
	let hasMounted = false;
	/**
	* A collection of linked component animation controls.
	*/
	const subscribers = /* @__PURE__ */ new Set();
	const controls = {
		subscribe(visualElement) {
			subscribers.add(visualElement);
			return () => void subscribers.delete(visualElement);
		},
		start(definition, transitionOverride) {
			invariant(hasMounted, "controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook.");
			const animations = [];
			subscribers.forEach((visualElement) => {
				animations.push(animateVisualElement(visualElement, definition, { transitionOverride }));
			});
			return Promise.all(animations);
		},
		set(definition) {
			invariant(hasMounted, "controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook.");
			return subscribers.forEach((visualElement) => {
				setValues(visualElement, definition);
			});
		},
		stop() {
			subscribers.forEach((visualElement) => {
				stopAnimation(visualElement);
			});
		},
		mount() {
			hasMounted = true;
			return () => {
				hasMounted = false;
				controls.stop();
			};
		}
	};
	return controls;
}
//#endregion
//#region node_modules/framer-motion/dist/es/animation/hooks/use-animation.mjs
/**
* Creates `LegacyAnimationControls`, which can be used to manually start, stop
* and sequence animations on one or more components.
*
* The returned `LegacyAnimationControls` should be passed to the `animate` property
* of the components you want to animate.
*
* These components can then be animated with the `start` method.
*
* ```jsx
* import * as React from 'react'
* import { motion, useAnimation } from 'framer-motion'
*
* export function MyComponent(props) {
*    const controls = useAnimation()
*
*    controls.start({
*        x: 100,
*        transition: { duration: 0.5 },
*    })
*
*    return <motion.div animate={controls} />
* }
* ```
*
* @returns Animation controller with `start` and `stop` methods
*
* @public
*/
function useAnimationControls() {
	const controls = useConstant(animationControls);
	useIsomorphicLayoutEffect(controls.mount, []);
	return controls;
}
var Copy = createLucideIcon("copy", [["rect", {
	width: "14",
	height: "14",
	x: "8",
	y: "8",
	rx: "2",
	ry: "2",
	key: "17jyea"
}], ["path", {
	d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
	key: "zix9uf"
}]]);
var Download = createLucideIcon("download", [
	["path", {
		d: "M12 15V3",
		key: "m9g1x1"
	}],
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}],
	["path", {
		d: "m7 10 5 5 5-5",
		key: "brsn70"
	}]
]);
var Eraser = createLucideIcon("eraser", [["path", {
	d: "M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21",
	key: "g5wo59"
}], ["path", {
	d: "m5.082 11.09 8.828 8.828",
	key: "1wx5vj"
}]]);
var FolderOpen = createLucideIcon("folder-open", [["path", {
	d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
	key: "usdka0"
}]]);
var MicVocal = createLucideIcon("mic-vocal", [
	["path", {
		d: "m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12",
		key: "80a601"
	}],
	["path", {
		d: "M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5",
		key: "j0ngtp"
	}],
	["circle", {
		cx: "16",
		cy: "7",
		r: "5",
		key: "d08jfb"
	}]
]);
var Minus = createLucideIcon("minus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}]]);
var Music2 = createLucideIcon("music-2", [["circle", {
	cx: "8",
	cy: "18",
	r: "4",
	key: "1fc0mg"
}], ["path", {
	d: "M12 18V2l7 4",
	key: "g04rme"
}]]);
var Pen = createLucideIcon("pen", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]);
var Piano = createLucideIcon("piano", [
	["path", {
		d: "M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8",
		key: "lag0yf"
	}],
	["path", {
		d: "M2 14h20",
		key: "myj16y"
	}],
	["path", {
		d: "M6 14v4",
		key: "9ng0ue"
	}],
	["path", {
		d: "M10 14v4",
		key: "1v8uk5"
	}],
	["path", {
		d: "M14 14v4",
		key: "1tqops"
	}],
	["path", {
		d: "M18 14v4",
		key: "18uqwm"
	}]
]);
var Play = createLucideIcon("play", [["path", {
	d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
	key: "10ikf1"
}]]);
var Plus = createLucideIcon("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]);
var Save = createLucideIcon("save", [
	["path", {
		d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
		key: "1c8476"
	}],
	["path", {
		d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
		key: "1ydtos"
	}],
	["path", {
		d: "M7 3v4a1 1 0 0 0 1 1h7",
		key: "t51u73"
	}]
]);
var SlidersHorizontal = createLucideIcon("sliders-horizontal", [
	["path", {
		d: "M10 5H3",
		key: "1qgfaw"
	}],
	["path", {
		d: "M12 19H3",
		key: "yhmn1j"
	}],
	["path", {
		d: "M14 3v4",
		key: "1sua03"
	}],
	["path", {
		d: "M16 17v4",
		key: "1q0r14"
	}],
	["path", {
		d: "M21 12h-9",
		key: "1o4lsq"
	}],
	["path", {
		d: "M21 19h-5",
		key: "1rlt1p"
	}],
	["path", {
		d: "M21 5h-7",
		key: "1oszz2"
	}],
	["path", {
		d: "M8 10v4",
		key: "tgpxqk"
	}],
	["path", {
		d: "M8 12H3",
		key: "a7s4jb"
	}]
]);
var Square = createLucideIcon("square", [["rect", {
	width: "18",
	height: "18",
	x: "3",
	y: "3",
	rx: "2",
	key: "afitv7"
}]]);
var Trash2 = createLucideIcon("trash-2", [
	["path", {
		d: "M10 11v6",
		key: "nco0om"
	}],
	["path", {
		d: "M14 11v6",
		key: "outv1u"
	}],
	["path", {
		d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
		key: "miytrc"
	}],
	["path", {
		d: "M3 6h18",
		key: "d0wm0j"
	}],
	["path", {
		d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
		key: "e791ji"
	}]
]);
var X = createLucideIcon("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]);
//#endregion
//#region node_modules/prop-types/lib/ReactPropTypesSecret.js
/**
* Copyright (c) 2013-present, Facebook, Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_ReactPropTypesSecret = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
}));
//#endregion
//#region node_modules/prop-types/factoryWithThrowingShims.js
/**
* Copyright (c) 2013-present, Facebook, Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_factoryWithThrowingShims = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ReactPropTypesSecret = require_ReactPropTypesSecret();
	function emptyFunction() {}
	function emptyFunctionWithReset() {}
	emptyFunctionWithReset.resetWarningCache = emptyFunction;
	module.exports = function() {
		function shim(props, propName, componentName, location, propFullName, secret) {
			if (secret === ReactPropTypesSecret) return;
			var err = /* @__PURE__ */ new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
			err.name = "Invariant Violation";
			throw err;
		}
		shim.isRequired = shim;
		function getShim() {
			return shim;
		}
		var ReactPropTypes = {
			array: shim,
			bigint: shim,
			bool: shim,
			func: shim,
			number: shim,
			object: shim,
			string: shim,
			symbol: shim,
			any: shim,
			arrayOf: getShim,
			element: shim,
			elementType: shim,
			instanceOf: getShim,
			node: shim,
			objectOf: getShim,
			oneOf: getShim,
			oneOfType: getShim,
			shape: getShim,
			exact: getShim,
			checkPropTypes: emptyFunctionWithReset,
			resetWarningCache: emptyFunction
		};
		ReactPropTypes.PropTypes = ReactPropTypes;
		return ReactPropTypes;
	};
}));
//#endregion
//#region node_modules/prop-types/index.js
var require_prop_types = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_factoryWithThrowingShims()();
}));
//#endregion
//#region node_modules/clsx/dist/clsx.js
var require_clsx = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function r(e) {
		var o, t, f = "";
		if ("string" == typeof e || "number" == typeof e) f += e;
		else if ("object" == typeof e) if (Array.isArray(e)) {
			var n = e.length;
			for (o = 0; o < n; o++) e[o] && (t = r(e[o])) && (f && (f += " "), f += t);
		} else for (t in e) e[t] && (f && (f += " "), f += t);
		return f;
	}
	function e() {
		for (var e, o, t = 0, f = "", n = arguments.length; t < n; t++) (e = arguments[t]) && (o = r(e)) && (f && (f += " "), f += o);
		return f;
	}
	module.exports = e, module.exports.clsx = e;
}));
//#endregion
//#region node_modules/react-draggable/build/cjs/utils/shims.js
var require_shims = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.dontSetMe = dontSetMe;
	exports.findInArray = findInArray;
	exports.int = int;
	exports.isFunction = isFunction;
	exports.isNum = isNum;
	function findInArray(array, callback) {
		for (let i = 0, length = array.length; i < length; i++) if (callback.apply(callback, [
			array[i],
			i,
			array
		])) return array[i];
	}
	function isFunction(func) {
		return typeof func === "function" || Object.prototype.toString.call(func) === "[object Function]";
	}
	function isNum(num) {
		return typeof num === "number" && !isNaN(num);
	}
	function int(a) {
		return parseInt(a, 10);
	}
	function dontSetMe(props, propName, componentName) {
		if (props[propName]) return /* @__PURE__ */ new Error(`Invalid prop ${propName} passed to ${componentName} - do not set this, set it on the child.`);
	}
}));
//#endregion
//#region node_modules/react-draggable/build/cjs/utils/getPrefix.js
var require_getPrefix = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.browserPrefixToKey = browserPrefixToKey;
	exports.browserPrefixToStyle = browserPrefixToStyle;
	exports.default = void 0;
	exports.getPrefix = getPrefix;
	var prefixes = [
		"Moz",
		"Webkit",
		"O",
		"ms"
	];
	function getPrefix() {
		let prop = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "transform";
		if (typeof window === "undefined") return "";
		const style = window.document?.documentElement?.style;
		if (!style) return "";
		if (prop in style) return "";
		for (let i = 0; i < prefixes.length; i++) if (browserPrefixToKey(prop, prefixes[i]) in style) return prefixes[i];
		return "";
	}
	function browserPrefixToKey(prop, prefix) {
		return prefix ? `${prefix}${kebabToTitleCase(prop)}` : prop;
	}
	function browserPrefixToStyle(prop, prefix) {
		return prefix ? `-${prefix.toLowerCase()}-${prop}` : prop;
	}
	function kebabToTitleCase(str) {
		let out = "";
		let shouldCapitalize = true;
		for (let i = 0; i < str.length; i++) if (shouldCapitalize) {
			out += str[i].toUpperCase();
			shouldCapitalize = false;
		} else if (str[i] === "-") shouldCapitalize = true;
		else out += str[i];
		return out;
	}
	exports.default = getPrefix();
}));
//#endregion
//#region node_modules/react-draggable/build/cjs/utils/domFns.js
var require_domFns = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.addClassName = addClassName;
	exports.addEvent = addEvent;
	exports.addUserSelectStyles = addUserSelectStyles;
	exports.createCSSTransform = createCSSTransform;
	exports.createSVGTransform = createSVGTransform;
	exports.getTouch = getTouch;
	exports.getTouchIdentifier = getTouchIdentifier;
	exports.getTranslation = getTranslation;
	exports.innerHeight = innerHeight;
	exports.innerWidth = innerWidth;
	exports.matchesSelector = matchesSelector;
	exports.matchesSelectorAndParentsTo = matchesSelectorAndParentsTo;
	exports.offsetXYFromParent = offsetXYFromParent;
	exports.outerHeight = outerHeight;
	exports.outerWidth = outerWidth;
	exports.removeClassName = removeClassName;
	exports.removeEvent = removeEvent;
	exports.scheduleRemoveUserSelectStyles = scheduleRemoveUserSelectStyles;
	var _shims = require_shims();
	var _getPrefix = _interopRequireWildcard(require_getPrefix());
	function _interopRequireWildcard(e, t) {
		if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
		return (_interopRequireWildcard = function(e, t) {
			if (!t && e && e.__esModule) return e;
			var o, i, f = {
				__proto__: null,
				default: e
			};
			if (null === e || "object" != typeof e && "function" != typeof e) return f;
			if (o = t ? n : r) {
				if (o.has(e)) return o.get(e);
				o.set(e, f);
			}
			for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);
			return f;
		})(e, t);
	}
	var matchesSelectorFunc = "";
	function matchesSelector(el, selector) {
		if (!matchesSelectorFunc) matchesSelectorFunc = (0, _shims.findInArray)([
			"matches",
			"webkitMatchesSelector",
			"mozMatchesSelector",
			"msMatchesSelector",
			"oMatchesSelector"
		], function(method) {
			return (0, _shims.isFunction)(el[method]);
		});
		if (!(0, _shims.isFunction)(el[matchesSelectorFunc])) return false;
		return el[matchesSelectorFunc](selector);
	}
	function matchesSelectorAndParentsTo(el, selector, baseNode) {
		let node = el;
		do {
			if (matchesSelector(node, selector)) return true;
			if (node === baseNode) return false;
			node = node.parentNode;
		} while (node);
		return false;
	}
	function addEvent(el, event, handler, inputOptions) {
		if (!el) return;
		const options = {
			capture: true,
			...inputOptions
		};
		if (el.addEventListener) el.addEventListener(event, handler, options);
		else if (el.attachEvent) el.attachEvent("on" + event, handler);
		else el["on" + event] = handler;
	}
	function removeEvent(el, event, handler, inputOptions) {
		if (!el) return;
		const options = {
			capture: true,
			...inputOptions
		};
		if (el.removeEventListener) el.removeEventListener(event, handler, options);
		else if (el.detachEvent) el.detachEvent("on" + event, handler);
		else el["on" + event] = null;
	}
	function outerHeight(node) {
		let height = node.clientHeight;
		const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
		height += (0, _shims.int)(computedStyle.borderTopWidth);
		height += (0, _shims.int)(computedStyle.borderBottomWidth);
		return height;
	}
	function outerWidth(node) {
		let width = node.clientWidth;
		const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
		width += (0, _shims.int)(computedStyle.borderLeftWidth);
		width += (0, _shims.int)(computedStyle.borderRightWidth);
		return width;
	}
	function innerHeight(node) {
		let height = node.clientHeight;
		const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
		height -= (0, _shims.int)(computedStyle.paddingTop);
		height -= (0, _shims.int)(computedStyle.paddingBottom);
		return height;
	}
	function innerWidth(node) {
		let width = node.clientWidth;
		const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
		width -= (0, _shims.int)(computedStyle.paddingLeft);
		width -= (0, _shims.int)(computedStyle.paddingRight);
		return width;
	}
	function offsetXYFromParent(evt, offsetParent, scale) {
		const offsetParentRect = offsetParent === offsetParent.ownerDocument.body ? {
			left: 0,
			top: 0
		} : offsetParent.getBoundingClientRect();
		return {
			x: (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale,
			y: (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale
		};
	}
	function createCSSTransform(controlPos, positionOffset) {
		const translation = getTranslation(controlPos, positionOffset, "px");
		return { [(0, _getPrefix.browserPrefixToKey)("transform", _getPrefix.default)]: translation };
	}
	function createSVGTransform(controlPos, positionOffset) {
		return getTranslation(controlPos, positionOffset, "");
	}
	function getTranslation(_ref, positionOffset, unitSuffix) {
		let { x, y } = _ref;
		let translation = `translate(${x}${unitSuffix},${y}${unitSuffix})`;
		if (positionOffset) translation = `translate(${`${typeof positionOffset.x === "string" ? positionOffset.x : positionOffset.x + unitSuffix}`}, ${`${typeof positionOffset.y === "string" ? positionOffset.y : positionOffset.y + unitSuffix}`})` + translation;
		return translation;
	}
	function getTouch(e, identifier) {
		return e.targetTouches && (0, _shims.findInArray)(e.targetTouches, (t) => identifier === t.identifier) || e.changedTouches && (0, _shims.findInArray)(e.changedTouches, (t) => identifier === t.identifier);
	}
	function getTouchIdentifier(e) {
		if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
		if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
	}
	function addUserSelectStyles(doc) {
		if (!doc) return;
		let styleEl = doc.getElementById("react-draggable-style-el");
		if (!styleEl) {
			styleEl = doc.createElement("style");
			styleEl.type = "text/css";
			styleEl.id = "react-draggable-style-el";
			styleEl.innerHTML = ".react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n";
			styleEl.innerHTML += ".react-draggable-transparent-selection *::selection {all: inherit;}\n";
			doc.getElementsByTagName("head")[0].appendChild(styleEl);
		}
		if (doc.body) addClassName(doc.body, "react-draggable-transparent-selection");
	}
	function scheduleRemoveUserSelectStyles(doc) {
		if (window.requestAnimationFrame) window.requestAnimationFrame(() => {
			removeUserSelectStyles(doc);
		});
		else removeUserSelectStyles(doc);
	}
	function removeUserSelectStyles(doc) {
		if (!doc) return;
		try {
			if (doc.body) removeClassName(doc.body, "react-draggable-transparent-selection");
			if (doc.selection) doc.selection.empty();
			else {
				const selection = (doc.defaultView || window).getSelection();
				if (selection && selection.type !== "Caret") selection.removeAllRanges();
			}
		} catch (e) {}
	}
	function addClassName(el, className) {
		if (el.classList) el.classList.add(className);
		else if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) el.className += ` ${className}`;
	}
	function removeClassName(el, className) {
		if (el.classList) el.classList.remove(className);
		else el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, "g"), "");
	}
}));
//#endregion
//#region node_modules/react-draggable/build/cjs/utils/positionFns.js
var require_positionFns = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.canDragX = canDragX;
	exports.canDragY = canDragY;
	exports.createCoreData = createCoreData;
	exports.createDraggableData = createDraggableData;
	exports.getBoundPosition = getBoundPosition;
	exports.getControlPosition = getControlPosition;
	exports.snapToGrid = snapToGrid;
	var _shims = require_shims();
	var _domFns = require_domFns();
	function getBoundPosition(draggable, x, y) {
		if (!draggable.props.bounds) return [x, y];
		let { bounds } = draggable.props;
		bounds = typeof bounds === "string" ? bounds : cloneBounds(bounds);
		const node = findDOMNode(draggable);
		if (typeof bounds === "string") {
			const { ownerDocument } = node;
			const ownerWindow = ownerDocument.defaultView;
			let boundNode;
			if (bounds === "parent") boundNode = node.parentNode;
			else boundNode = node.getRootNode().querySelector(bounds);
			if (!(boundNode instanceof ownerWindow.HTMLElement)) throw new Error("Bounds selector \"" + bounds + "\" could not find an element.");
			const boundNodeEl = boundNode;
			const nodeStyle = ownerWindow.getComputedStyle(node);
			const boundNodeStyle = ownerWindow.getComputedStyle(boundNodeEl);
			bounds = {
				left: -node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingLeft) + (0, _shims.int)(nodeStyle.marginLeft),
				top: -node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingTop) + (0, _shims.int)(nodeStyle.marginTop),
				right: (0, _domFns.innerWidth)(boundNodeEl) - (0, _domFns.outerWidth)(node) - node.offsetLeft + (0, _shims.int)(boundNodeStyle.paddingRight) - (0, _shims.int)(nodeStyle.marginRight),
				bottom: (0, _domFns.innerHeight)(boundNodeEl) - (0, _domFns.outerHeight)(node) - node.offsetTop + (0, _shims.int)(boundNodeStyle.paddingBottom) - (0, _shims.int)(nodeStyle.marginBottom)
			};
		}
		if ((0, _shims.isNum)(bounds.right)) x = Math.min(x, bounds.right);
		if ((0, _shims.isNum)(bounds.bottom)) y = Math.min(y, bounds.bottom);
		if ((0, _shims.isNum)(bounds.left)) x = Math.max(x, bounds.left);
		if ((0, _shims.isNum)(bounds.top)) y = Math.max(y, bounds.top);
		return [x, y];
	}
	function snapToGrid(grid, pendingX, pendingY) {
		return [Math.round(pendingX / grid[0]) * grid[0], Math.round(pendingY / grid[1]) * grid[1]];
	}
	function canDragX(draggable) {
		return draggable.props.axis === "both" || draggable.props.axis === "x";
	}
	function canDragY(draggable) {
		return draggable.props.axis === "both" || draggable.props.axis === "y";
	}
	function getControlPosition(e, touchIdentifier, draggableCore) {
		const touchObj = typeof touchIdentifier === "number" ? (0, _domFns.getTouch)(e, touchIdentifier) : null;
		if (typeof touchIdentifier === "number" && !touchObj) return null;
		const node = findDOMNode(draggableCore);
		const offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
		return (0, _domFns.offsetXYFromParent)(touchObj || e, offsetParent, draggableCore.props.scale);
	}
	function createCoreData(draggable, x, y) {
		const isStart = !(0, _shims.isNum)(draggable.lastX);
		const node = findDOMNode(draggable);
		if (isStart) return {
			node,
			deltaX: 0,
			deltaY: 0,
			lastX: x,
			lastY: y,
			x,
			y
		};
		else return {
			node,
			deltaX: x - draggable.lastX,
			deltaY: y - draggable.lastY,
			lastX: draggable.lastX,
			lastY: draggable.lastY,
			x,
			y
		};
	}
	function createDraggableData(draggable, coreData) {
		const scale = draggable.props.scale;
		return {
			node: coreData.node,
			x: draggable.state.x + coreData.deltaX / scale,
			y: draggable.state.y + coreData.deltaY / scale,
			deltaX: coreData.deltaX / scale,
			deltaY: coreData.deltaY / scale,
			lastX: draggable.state.x,
			lastY: draggable.state.y
		};
	}
	function cloneBounds(bounds) {
		return {
			left: bounds.left,
			top: bounds.top,
			right: bounds.right,
			bottom: bounds.bottom
		};
	}
	function findDOMNode(draggable) {
		const node = draggable.findDOMNode();
		if (!node) throw new Error("<DraggableCore>: Unmounted during event!");
		return node;
	}
}));
//#endregion
//#region node_modules/react-draggable/build/cjs/utils/log.js
var require_log = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = log;
	function log() {}
}));
//#endregion
//#region node_modules/react-draggable/build/cjs/DraggableCore.js
var require_DraggableCore = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	var React = _interopRequireWildcard(require_react());
	var _propTypes = _interopRequireDefault(require_prop_types());
	var _reactDom = _interopRequireDefault(require_react_dom());
	var _domFns = require_domFns();
	var _positionFns = require_positionFns();
	var _shims = require_shims();
	var _log = _interopRequireDefault(require_log());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function _interopRequireWildcard(e, t) {
		if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
		return (_interopRequireWildcard = function(e, t) {
			if (!t && e && e.__esModule) return e;
			var o, i, f = {
				__proto__: null,
				default: e
			};
			if (null === e || "object" != typeof e && "function" != typeof e) return f;
			if (o = t ? n : r) {
				if (o.has(e)) return o.get(e);
				o.set(e, f);
			}
			for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);
			return f;
		})(e, t);
	}
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == typeof i ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != typeof t || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != typeof i) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var eventsFor = {
		touch: {
			start: "touchstart",
			move: "touchmove",
			stop: "touchend"
		},
		mouse: {
			start: "mousedown",
			move: "mousemove",
			stop: "mouseup"
		}
	};
	var dragEventFor = eventsFor.mouse;
	var DraggableCore = class extends React.Component {
		constructor() {
			super(...arguments);
			_defineProperty(this, "dragging", false);
			_defineProperty(this, "lastX", NaN);
			_defineProperty(this, "lastY", NaN);
			_defineProperty(this, "touchIdentifier", null);
			_defineProperty(this, "mounted", false);
			_defineProperty(this, "handleDragStart", (e) => {
				this.props.onMouseDown(e);
				if (!this.props.allowAnyClick && typeof e.button === "number" && e.button !== 0) return false;
				const thisNode = this.findDOMNode();
				if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) throw new Error("<DraggableCore> not mounted on DragStart!");
				const { ownerDocument } = thisNode;
				if (this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || this.props.handle && !(0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.handle, thisNode) || this.props.cancel && (0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.cancel, thisNode)) return;
				if (e.type === "touchstart" && !this.props.allowMobileScroll) e.preventDefault();
				const touchIdentifier = (0, _domFns.getTouchIdentifier)(e);
				this.touchIdentifier = touchIdentifier;
				const position = (0, _positionFns.getControlPosition)(e, touchIdentifier, this);
				if (position == null) return;
				const { x, y } = position;
				const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
				(0, _log.default)("DraggableCore: handleDragStart: %j", coreEvent);
				(0, _log.default)("calling", this.props.onStart);
				if (this.props.onStart(e, coreEvent) === false || this.mounted === false) return;
				if (this.props.enableUserSelectHack) (0, _domFns.addUserSelectStyles)(ownerDocument);
				this.dragging = true;
				this.lastX = x;
				this.lastY = y;
				(0, _domFns.addEvent)(ownerDocument, dragEventFor.move, this.handleDrag);
				(0, _domFns.addEvent)(ownerDocument, dragEventFor.stop, this.handleDragStop);
			});
			_defineProperty(this, "handleDrag", (e) => {
				const position = (0, _positionFns.getControlPosition)(e, this.touchIdentifier, this);
				if (position == null) return;
				let { x, y } = position;
				if (Array.isArray(this.props.grid)) {
					let deltaX = x - this.lastX, deltaY = y - this.lastY;
					[deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
					if (!deltaX && !deltaY) return;
					x = this.lastX + deltaX, y = this.lastY + deltaY;
				}
				const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
				(0, _log.default)("DraggableCore: handleDrag: %j", coreEvent);
				if (this.props.onDrag(e, coreEvent) === false || this.mounted === false) {
					try {
						this.handleDragStop(new MouseEvent("mouseup"));
					} catch (err) {
						const event = document.createEvent("MouseEvents");
						event.initMouseEvent("mouseup", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
						this.handleDragStop(event);
					}
					return;
				}
				this.lastX = x;
				this.lastY = y;
			});
			_defineProperty(this, "handleDragStop", (e) => {
				if (!this.dragging) return;
				const position = (0, _positionFns.getControlPosition)(e, this.touchIdentifier, this);
				if (position == null) return;
				let { x, y } = position;
				if (Array.isArray(this.props.grid)) {
					let deltaX = x - this.lastX || 0;
					let deltaY = y - this.lastY || 0;
					[deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
					x = this.lastX + deltaX, y = this.lastY + deltaY;
				}
				const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
				if (this.props.onStop(e, coreEvent) === false || this.mounted === false) return false;
				const thisNode = this.findDOMNode();
				if (thisNode) {
					if (this.props.enableUserSelectHack) (0, _domFns.scheduleRemoveUserSelectStyles)(thisNode.ownerDocument);
				}
				(0, _log.default)("DraggableCore: handleDragStop: %j", coreEvent);
				this.dragging = false;
				this.lastX = NaN;
				this.lastY = NaN;
				if (thisNode) {
					(0, _log.default)("DraggableCore: Removing handlers");
					(0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
					(0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
				}
			});
			_defineProperty(this, "onMouseDown", (e) => {
				dragEventFor = eventsFor.mouse;
				return this.handleDragStart(e);
			});
			_defineProperty(this, "onMouseUp", (e) => {
				dragEventFor = eventsFor.mouse;
				return this.handleDragStop(e);
			});
			_defineProperty(this, "onTouchStart", (e) => {
				dragEventFor = eventsFor.touch;
				return this.handleDragStart(e);
			});
			_defineProperty(this, "onTouchEnd", (e) => {
				dragEventFor = eventsFor.touch;
				return this.handleDragStop(e);
			});
		}
		componentDidMount() {
			this.mounted = true;
			const thisNode = this.findDOMNode();
			if (thisNode) (0, _domFns.addEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, { passive: false });
		}
		componentWillUnmount() {
			this.mounted = false;
			const thisNode = this.findDOMNode();
			if (thisNode) {
				const { ownerDocument } = thisNode;
				(0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
				(0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
				(0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
				(0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
				(0, _domFns.removeEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, { passive: false });
				if (this.props.enableUserSelectHack) (0, _domFns.scheduleRemoveUserSelectStyles)(ownerDocument);
			}
		}
		findDOMNode() {
			return this.props?.nodeRef ? this.props?.nodeRef?.current : _reactDom.default.findDOMNode(this);
		}
		render() {
			return /* @__PURE__ */ React.cloneElement(React.Children.only(this.props.children), {
				onMouseDown: this.onMouseDown,
				onMouseUp: this.onMouseUp,
				onTouchEnd: this.onTouchEnd
			});
		}
	};
	exports.default = DraggableCore;
	_defineProperty(DraggableCore, "displayName", "DraggableCore");
	_defineProperty(DraggableCore, "propTypes", {
		allowAnyClick: _propTypes.default.bool,
		allowMobileScroll: _propTypes.default.bool,
		children: _propTypes.default.node.isRequired,
		disabled: _propTypes.default.bool,
		enableUserSelectHack: _propTypes.default.bool,
		offsetParent: function(props, propName) {
			if (props[propName] && props[propName].nodeType !== 1) throw new Error("Draggable's offsetParent must be a DOM Node.");
		},
		grid: _propTypes.default.arrayOf(_propTypes.default.number),
		handle: _propTypes.default.string,
		cancel: _propTypes.default.string,
		nodeRef: _propTypes.default.object,
		onStart: _propTypes.default.func,
		onDrag: _propTypes.default.func,
		onStop: _propTypes.default.func,
		onMouseDown: _propTypes.default.func,
		scale: _propTypes.default.number,
		className: _shims.dontSetMe,
		style: _shims.dontSetMe,
		transform: _shims.dontSetMe
	});
	_defineProperty(DraggableCore, "defaultProps", {
		allowAnyClick: false,
		allowMobileScroll: false,
		disabled: false,
		enableUserSelectHack: true,
		onStart: function() {},
		onDrag: function() {},
		onStop: function() {},
		onMouseDown: function() {},
		scale: 1
	});
}));
//#endregion
//#region node_modules/react-draggable/build/cjs/Draggable.js
var require_Draggable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	Object.defineProperty(exports, "DraggableCore", {
		enumerable: true,
		get: function() {
			return _DraggableCore.default;
		}
	});
	exports.default = void 0;
	var React = _interopRequireWildcard(require_react());
	var _propTypes = _interopRequireDefault(require_prop_types());
	var _reactDom = _interopRequireDefault(require_react_dom());
	var _clsx = require_clsx();
	var _domFns = require_domFns();
	var _positionFns = require_positionFns();
	var _shims = require_shims();
	var _DraggableCore = _interopRequireDefault(require_DraggableCore());
	var _log = _interopRequireDefault(require_log());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function _interopRequireWildcard(e, t) {
		if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
		return (_interopRequireWildcard = function(e, t) {
			if (!t && e && e.__esModule) return e;
			var o, i, f = {
				__proto__: null,
				default: e
			};
			if (null === e || "object" != typeof e && "function" != typeof e) return f;
			if (o = t ? n : r) {
				if (o.has(e)) return o.get(e);
				o.set(e, f);
			}
			for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);
			return f;
		})(e, t);
	}
	function _extends() {
		return _extends = Object.assign ? Object.assign.bind() : function(n) {
			for (var e = 1; e < arguments.length; e++) {
				var t = arguments[e];
				for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
			}
			return n;
		}, _extends.apply(null, arguments);
	}
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == typeof i ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != typeof t || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != typeof i) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var Draggable = class extends React.Component {
		static getDerivedStateFromProps(_ref, _ref2) {
			let { position } = _ref;
			let { prevPropsPosition } = _ref2;
			if (position && (!prevPropsPosition || position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y)) {
				(0, _log.default)("Draggable: getDerivedStateFromProps %j", {
					position,
					prevPropsPosition
				});
				return {
					x: position.x,
					y: position.y,
					prevPropsPosition: { ...position }
				};
			}
			return null;
		}
		constructor(props) {
			super(props);
			_defineProperty(this, "onDragStart", (e, coreData) => {
				(0, _log.default)("Draggable: onDragStart: %j", coreData);
				if (this.props.onStart(e, (0, _positionFns.createDraggableData)(this, coreData)) === false) return false;
				this.setState({
					dragging: true,
					dragged: true
				});
			});
			_defineProperty(this, "onDrag", (e, coreData) => {
				if (!this.state.dragging) return false;
				(0, _log.default)("Draggable: onDrag: %j", coreData);
				const uiData = (0, _positionFns.createDraggableData)(this, coreData);
				const newState = {
					x: uiData.x,
					y: uiData.y,
					slackX: 0,
					slackY: 0
				};
				if (this.props.bounds) {
					const { x, y } = newState;
					newState.x += this.state.slackX;
					newState.y += this.state.slackY;
					const [newStateX, newStateY] = (0, _positionFns.getBoundPosition)(this, newState.x, newState.y);
					newState.x = newStateX;
					newState.y = newStateY;
					newState.slackX = this.state.slackX + (x - newState.x);
					newState.slackY = this.state.slackY + (y - newState.y);
					uiData.x = newState.x;
					uiData.y = newState.y;
					uiData.deltaX = newState.x - this.state.x;
					uiData.deltaY = newState.y - this.state.y;
				}
				if (this.props.onDrag(e, uiData) === false) return false;
				this.setState(newState);
			});
			_defineProperty(this, "onDragStop", (e, coreData) => {
				if (!this.state.dragging) return false;
				if (this.props.onStop(e, (0, _positionFns.createDraggableData)(this, coreData)) === false) return false;
				(0, _log.default)("Draggable: onDragStop: %j", coreData);
				const newState = {
					dragging: false,
					slackX: 0,
					slackY: 0
				};
				if (Boolean(this.props.position)) {
					const { x, y } = this.props.position;
					newState.x = x;
					newState.y = y;
				}
				this.setState(newState);
			});
			this.state = {
				dragging: false,
				dragged: false,
				x: props.position ? props.position.x : props.defaultPosition.x,
				y: props.position ? props.position.y : props.defaultPosition.y,
				prevPropsPosition: { ...props.position },
				slackX: 0,
				slackY: 0,
				isElementSVG: false
			};
			if (props.position && !(props.onDrag || props.onStop)) console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element.");
		}
		componentDidMount() {
			if (typeof window.SVGElement !== "undefined" && this.findDOMNode() instanceof window.SVGElement) this.setState({ isElementSVG: true });
		}
		componentWillUnmount() {
			if (this.state.dragging) this.setState({ dragging: false });
		}
		findDOMNode() {
			return this.props?.nodeRef?.current ?? _reactDom.default.findDOMNode(this);
		}
		render() {
			const { axis, bounds, children, defaultPosition, defaultClassName, defaultClassNameDragging, defaultClassNameDragged, position, positionOffset, scale, ...draggableCoreProps } = this.props;
			let style = {};
			let svgTransform = null;
			const draggable = !Boolean(position) || this.state.dragging;
			const validPosition = position || defaultPosition;
			const transformOpts = {
				x: (0, _positionFns.canDragX)(this) && draggable ? this.state.x : validPosition.x,
				y: (0, _positionFns.canDragY)(this) && draggable ? this.state.y : validPosition.y
			};
			if (this.state.isElementSVG) svgTransform = (0, _domFns.createSVGTransform)(transformOpts, positionOffset);
			else style = (0, _domFns.createCSSTransform)(transformOpts, positionOffset);
			const className = (0, _clsx.clsx)(children.props.className || "", defaultClassName, {
				[defaultClassNameDragging]: this.state.dragging,
				[defaultClassNameDragged]: this.state.dragged
			});
			return /* @__PURE__ */ React.createElement(_DraggableCore.default, _extends({}, draggableCoreProps, {
				onStart: this.onDragStart,
				onDrag: this.onDrag,
				onStop: this.onDragStop
			}), /* @__PURE__ */ React.cloneElement(React.Children.only(children), {
				className,
				style: {
					...children.props.style,
					...style
				},
				transform: svgTransform
			}));
		}
	};
	exports.default = Draggable;
	_defineProperty(Draggable, "displayName", "Draggable");
	_defineProperty(Draggable, "propTypes", {
		..._DraggableCore.default.propTypes,
		axis: _propTypes.default.oneOf([
			"both",
			"x",
			"y",
			"none"
		]),
		bounds: _propTypes.default.oneOfType([
			_propTypes.default.shape({
				left: _propTypes.default.number,
				right: _propTypes.default.number,
				top: _propTypes.default.number,
				bottom: _propTypes.default.number
			}),
			_propTypes.default.string,
			_propTypes.default.oneOf([false])
		]),
		defaultClassName: _propTypes.default.string,
		defaultClassNameDragging: _propTypes.default.string,
		defaultClassNameDragged: _propTypes.default.string,
		defaultPosition: _propTypes.default.shape({
			x: _propTypes.default.number,
			y: _propTypes.default.number
		}),
		positionOffset: _propTypes.default.shape({
			x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
			y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
		}),
		position: _propTypes.default.shape({
			x: _propTypes.default.number,
			y: _propTypes.default.number
		}),
		className: _shims.dontSetMe,
		style: _shims.dontSetMe,
		transform: _shims.dontSetMe
	});
	_defineProperty(Draggable, "defaultProps", {
		..._DraggableCore.default.defaultProps,
		axis: "both",
		bounds: false,
		defaultClassName: "react-draggable",
		defaultClassNameDragging: "react-draggable-dragging",
		defaultClassNameDragged: "react-draggable-dragged",
		defaultPosition: {
			x: 0,
			y: 0
		},
		scale: 1
	});
}));
//#endregion
//#region node_modules/react-draggable/build/cjs/cjs.js
var require_cjs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { default: Draggable, DraggableCore } = require_Draggable();
	module.exports = Draggable;
	module.exports.default = Draggable;
	module.exports.DraggableCore = DraggableCore;
}));
//#endregion
//#region node_modules/re-resizable/lib/resizer.js
var import_react_dom = require_react_dom();
var import_cjs = /* @__PURE__ */ __toESM(require_cjs());
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var __assign$2 = function() {
	__assign$2 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$2.apply(this, arguments);
};
var rowSizeBase = {
	width: "100%",
	height: "10px",
	top: "0px",
	left: "0px",
	cursor: "row-resize"
};
var colSizeBase = {
	width: "10px",
	height: "100%",
	top: "0px",
	left: "0px",
	cursor: "col-resize"
};
var edgeBase = {
	width: "20px",
	height: "20px",
	position: "absolute",
	zIndex: 1
};
var styles = {
	top: __assign$2(__assign$2({}, rowSizeBase), { top: "-5px" }),
	right: __assign$2(__assign$2({}, colSizeBase), {
		left: void 0,
		right: "-5px"
	}),
	bottom: __assign$2(__assign$2({}, rowSizeBase), {
		top: void 0,
		bottom: "-5px"
	}),
	left: __assign$2(__assign$2({}, colSizeBase), { left: "-5px" }),
	topRight: __assign$2(__assign$2({}, edgeBase), {
		right: "-10px",
		top: "-10px",
		cursor: "ne-resize"
	}),
	bottomRight: __assign$2(__assign$2({}, edgeBase), {
		right: "-10px",
		bottom: "-10px",
		cursor: "se-resize"
	}),
	bottomLeft: __assign$2(__assign$2({}, edgeBase), {
		left: "-10px",
		bottom: "-10px",
		cursor: "sw-resize"
	}),
	topLeft: __assign$2(__assign$2({}, edgeBase), {
		left: "-10px",
		top: "-10px",
		cursor: "nw-resize"
	})
};
var Resizer = (0, import_react.memo)(function(props) {
	var onResizeStart = props.onResizeStart, direction = props.direction, children = props.children, replaceStyles = props.replaceStyles, className = props.className;
	var onMouseDown = (0, import_react.useCallback)(function(e) {
		onResizeStart(e, direction);
	}, [onResizeStart, direction]);
	var onTouchStart = (0, import_react.useCallback)(function(e) {
		onResizeStart(e, direction);
	}, [onResizeStart, direction]);
	var style = (0, import_react.useMemo)(function() {
		return __assign$2(__assign$2({
			position: "absolute",
			userSelect: "none"
		}, styles[direction]), replaceStyles !== null && replaceStyles !== void 0 ? replaceStyles : {});
	}, [replaceStyles, direction]);
	return (0, import_jsx_runtime.jsx)("div", {
		className: className || void 0,
		style,
		onMouseDown,
		onTouchStart,
		children
	});
});
//#endregion
//#region node_modules/re-resizable/lib/index.js
var __extends$1 = (function() {
	var extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
			d.__proto__ = b;
		} || function(d, b) {
			for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
		};
		return extendStatics(d, b);
	};
	return function(d, b) {
		if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
		extendStatics(d, b);
		function __() {
			this.constructor = d;
		}
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
})();
var __assign$1 = function() {
	__assign$1 = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$1.apply(this, arguments);
};
var DEFAULT_SIZE = {
	width: "auto",
	height: "auto"
};
var clamp = function(n, min, max) {
	return Math.max(Math.min(n, max), min);
};
var snap = function(n, size, gridGap) {
	var v = Math.round(n / size);
	return v * size + gridGap * (v - 1);
};
var hasDirection = function(dir, target) {
	return new RegExp(dir, "i").test(target);
};
var isTouchEvent = function(event) {
	return Boolean(event.touches && event.touches.length);
};
var isMouseEvent = function(event) {
	return Boolean((event.clientX || event.clientX === 0) && (event.clientY || event.clientY === 0));
};
var findClosestSnap = function(n, snapArray, snapGap) {
	if (snapGap === void 0) snapGap = 0;
	var closestGapIndex = snapArray.reduce(function(prev, curr, index) {
		return Math.abs(curr - n) < Math.abs(snapArray[prev] - n) ? index : prev;
	}, 0);
	var gap = Math.abs(snapArray[closestGapIndex] - n);
	return snapGap === 0 || gap < snapGap ? snapArray[closestGapIndex] : n;
};
var getStringSize = function(n) {
	n = n.toString();
	if (n === "auto") return n;
	if (n.endsWith("px")) return n;
	if (n.endsWith("%")) return n;
	if (n.endsWith("vh")) return n;
	if (n.endsWith("vw")) return n;
	if (n.endsWith("vmax")) return n;
	if (n.endsWith("vmin")) return n;
	return "".concat(n, "px");
};
var getPixelSize = function(size, parentSize, innerWidth, innerHeight) {
	if (size && typeof size === "string") {
		if (size.endsWith("px")) return Number(size.replace("px", ""));
		if (size.endsWith("%")) {
			var ratio = Number(size.replace("%", "")) / 100;
			return parentSize * ratio;
		}
		if (size.endsWith("vw")) {
			var ratio = Number(size.replace("vw", "")) / 100;
			return innerWidth * ratio;
		}
		if (size.endsWith("vh")) {
			var ratio = Number(size.replace("vh", "")) / 100;
			return innerHeight * ratio;
		}
	}
	return size;
};
var calculateNewMax = function(parentSize, innerWidth, innerHeight, maxWidth, maxHeight, minWidth, minHeight) {
	maxWidth = getPixelSize(maxWidth, parentSize.width, innerWidth, innerHeight);
	maxHeight = getPixelSize(maxHeight, parentSize.height, innerWidth, innerHeight);
	minWidth = getPixelSize(minWidth, parentSize.width, innerWidth, innerHeight);
	minHeight = getPixelSize(minHeight, parentSize.height, innerWidth, innerHeight);
	return {
		maxWidth: typeof maxWidth === "undefined" ? void 0 : Number(maxWidth),
		maxHeight: typeof maxHeight === "undefined" ? void 0 : Number(maxHeight),
		minWidth: typeof minWidth === "undefined" ? void 0 : Number(minWidth),
		minHeight: typeof minHeight === "undefined" ? void 0 : Number(minHeight)
	};
};
/**
* transform T | [T, T] to [T, T]
* @param val
* @returns
*/
var normalizeToPair = function(val) {
	return Array.isArray(val) ? val : [val, val];
};
var definedProps = [
	"as",
	"ref",
	"style",
	"className",
	"grid",
	"gridGap",
	"snap",
	"bounds",
	"boundsByDirection",
	"size",
	"defaultSize",
	"minWidth",
	"minHeight",
	"maxWidth",
	"maxHeight",
	"lockAspectRatio",
	"lockAspectRatioExtraWidth",
	"lockAspectRatioExtraHeight",
	"enable",
	"handleStyles",
	"handleClasses",
	"handleWrapperStyle",
	"handleWrapperClass",
	"children",
	"onResizeStart",
	"onResize",
	"onResizeStop",
	"handleComponent",
	"scale",
	"resizeRatio",
	"snapGap"
];
var baseClassName = "__resizable_base__";
var Resizable = function(_super) {
	__extends$1(Resizable, _super);
	function Resizable(props) {
		var _a, _b, _c, _d;
		var _this = _super.call(this, props) || this;
		_this.ratio = 1;
		_this.resizable = null;
		_this.parentLeft = 0;
		_this.parentTop = 0;
		_this.resizableLeft = 0;
		_this.resizableRight = 0;
		_this.resizableTop = 0;
		_this.resizableBottom = 0;
		_this.targetLeft = 0;
		_this.targetTop = 0;
		_this.delta = {
			width: 0,
			height: 0
		};
		_this.appendBase = function() {
			if (!_this.resizable || !_this.window) return null;
			var parent = _this.parentNode;
			if (!parent) return null;
			var element = _this.window.document.createElement("div");
			element.style.width = "100%";
			element.style.height = "100%";
			element.style.position = "absolute";
			element.style.transform = "scale(0, 0)";
			element.style.left = "0";
			element.style.flex = "0 0 100%";
			if (element.classList) element.classList.add(baseClassName);
			else element.className += baseClassName;
			parent.appendChild(element);
			return element;
		};
		_this.removeBase = function(base) {
			var parent = _this.parentNode;
			if (!parent) return;
			parent.removeChild(base);
		};
		_this.state = {
			isResizing: false,
			width: (_b = (_a = _this.propsSize) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : "auto",
			height: (_d = (_c = _this.propsSize) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : "auto",
			direction: "right",
			original: {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			},
			backgroundStyle: {
				height: "100%",
				width: "100%",
				backgroundColor: "rgba(0,0,0,0)",
				cursor: "auto",
				opacity: 0,
				position: "fixed",
				zIndex: 9999,
				top: "0",
				left: "0",
				bottom: "0",
				right: "0"
			},
			flexBasis: void 0
		};
		_this.onResizeStart = _this.onResizeStart.bind(_this);
		_this.onMouseMove = _this.onMouseMove.bind(_this);
		_this.onMouseUp = _this.onMouseUp.bind(_this);
		return _this;
	}
	Object.defineProperty(Resizable.prototype, "parentNode", {
		get: function() {
			if (!this.resizable) return null;
			return this.resizable.parentNode;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Resizable.prototype, "window", {
		get: function() {
			if (!this.resizable) return null;
			if (!this.resizable.ownerDocument) return null;
			return this.resizable.ownerDocument.defaultView;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Resizable.prototype, "propsSize", {
		get: function() {
			return this.props.size || this.props.defaultSize || DEFAULT_SIZE;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Resizable.prototype, "size", {
		get: function() {
			var width = 0;
			var height = 0;
			if (this.resizable && this.window) {
				var orgWidth = this.resizable.offsetWidth;
				var orgHeight = this.resizable.offsetHeight;
				var orgPosition = this.resizable.style.position;
				if (orgPosition !== "relative") this.resizable.style.position = "relative";
				width = this.resizable.style.width !== "auto" ? this.resizable.offsetWidth : orgWidth;
				height = this.resizable.style.height !== "auto" ? this.resizable.offsetHeight : orgHeight;
				this.resizable.style.position = orgPosition;
			}
			return {
				width,
				height
			};
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Resizable.prototype, "sizeStyle", {
		get: function() {
			var _this = this;
			var size = this.props.size;
			var getSize = function(key) {
				var _a;
				if (typeof _this.state[key] === "undefined" || _this.state[key] === "auto") return "auto";
				if (_this.propsSize && _this.propsSize[key] && ((_a = _this.propsSize[key]) === null || _a === void 0 ? void 0 : _a.toString().endsWith("%"))) {
					if (_this.state[key].toString().endsWith("%")) return _this.state[key].toString();
					var parentSize = _this.getParentSize();
					var percent = Number(_this.state[key].toString().replace("px", "")) / parentSize[key] * 100;
					return "".concat(percent, "%");
				}
				return getStringSize(_this.state[key]);
			};
			return {
				width: size && typeof size.width !== "undefined" && !this.state.isResizing ? getStringSize(size.width) : getSize("width"),
				height: size && typeof size.height !== "undefined" && !this.state.isResizing ? getStringSize(size.height) : getSize("height")
			};
		},
		enumerable: false,
		configurable: true
	});
	Resizable.prototype.getParentSize = function() {
		if (!this.parentNode) {
			if (!this.window) return {
				width: 0,
				height: 0
			};
			return {
				width: this.window.innerWidth,
				height: this.window.innerHeight
			};
		}
		var base = this.appendBase();
		if (!base) return {
			width: 0,
			height: 0
		};
		var wrapChanged = false;
		var wrap = this.parentNode.style.flexWrap;
		if (wrap !== "wrap") {
			wrapChanged = true;
			this.parentNode.style.flexWrap = "wrap";
		}
		base.style.position = "relative";
		base.style.minWidth = "100%";
		base.style.minHeight = "100%";
		var size = {
			width: base.offsetWidth,
			height: base.offsetHeight
		};
		if (wrapChanged) this.parentNode.style.flexWrap = wrap;
		this.removeBase(base);
		return size;
	};
	Resizable.prototype.bindEvents = function() {
		if (this.window) {
			this.window.addEventListener("mouseup", this.onMouseUp);
			this.window.addEventListener("mousemove", this.onMouseMove);
			this.window.addEventListener("mouseleave", this.onMouseUp);
			this.window.addEventListener("touchmove", this.onMouseMove, {
				capture: true,
				passive: false
			});
			this.window.addEventListener("touchend", this.onMouseUp);
		}
	};
	Resizable.prototype.unbindEvents = function() {
		if (this.window) {
			this.window.removeEventListener("mouseup", this.onMouseUp);
			this.window.removeEventListener("mousemove", this.onMouseMove);
			this.window.removeEventListener("mouseleave", this.onMouseUp);
			this.window.removeEventListener("touchmove", this.onMouseMove, true);
			this.window.removeEventListener("touchend", this.onMouseUp);
		}
	};
	Resizable.prototype.componentDidMount = function() {
		if (!this.resizable || !this.window) return;
		var computedStyle = this.window.getComputedStyle(this.resizable);
		this.setState({
			width: this.state.width || this.size.width,
			height: this.state.height || this.size.height,
			flexBasis: computedStyle.flexBasis !== "auto" ? computedStyle.flexBasis : void 0
		});
	};
	Resizable.prototype.componentWillUnmount = function() {
		if (this.window) this.unbindEvents();
	};
	Resizable.prototype.createSizeForCssProperty = function(newSize, kind) {
		var propsSize = this.propsSize && this.propsSize[kind];
		return this.state[kind] === "auto" && this.state.original[kind] === newSize && (typeof propsSize === "undefined" || propsSize === "auto") ? "auto" : newSize;
	};
	Resizable.prototype.calculateNewMaxFromBoundary = function(maxWidth, maxHeight) {
		var boundsByDirection = this.props.boundsByDirection;
		var direction = this.state.direction;
		var widthByDirection = boundsByDirection && hasDirection("left", direction);
		var heightByDirection = boundsByDirection && hasDirection("top", direction);
		var boundWidth;
		var boundHeight;
		if (this.props.bounds === "parent") {
			var parent_1 = this.parentNode;
			if (parent_1) {
				boundWidth = widthByDirection ? this.resizableRight - this.parentLeft : parent_1.offsetWidth + (this.parentLeft - this.resizableLeft);
				boundHeight = heightByDirection ? this.resizableBottom - this.parentTop : parent_1.offsetHeight + (this.parentTop - this.resizableTop);
			}
		} else if (this.props.bounds === "window") {
			if (this.window) {
				boundWidth = widthByDirection ? this.resizableRight : this.window.innerWidth - this.resizableLeft;
				boundHeight = heightByDirection ? this.resizableBottom : this.window.innerHeight - this.resizableTop;
			}
		} else if (this.props.bounds) {
			boundWidth = widthByDirection ? this.resizableRight - this.targetLeft : this.props.bounds.offsetWidth + (this.targetLeft - this.resizableLeft);
			boundHeight = heightByDirection ? this.resizableBottom - this.targetTop : this.props.bounds.offsetHeight + (this.targetTop - this.resizableTop);
		}
		if (boundWidth && Number.isFinite(boundWidth)) maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
		if (boundHeight && Number.isFinite(boundHeight)) maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
		return {
			maxWidth,
			maxHeight
		};
	};
	Resizable.prototype.calculateNewSizeFromDirection = function(clientX, clientY) {
		var scale = this.props.scale || 1;
		var _a = normalizeToPair(this.props.resizeRatio || 1), resizeRatioX = _a[0], resizeRatioY = _a[1];
		var _b = this.state, direction = _b.direction, original = _b.original;
		var _c = this.props, lockAspectRatio = _c.lockAspectRatio, lockAspectRatioExtraHeight = _c.lockAspectRatioExtraHeight, lockAspectRatioExtraWidth = _c.lockAspectRatioExtraWidth;
		var newWidth = original.width;
		var newHeight = original.height;
		var extraHeight = lockAspectRatioExtraHeight || 0;
		var extraWidth = lockAspectRatioExtraWidth || 0;
		if (hasDirection("right", direction)) {
			newWidth = original.width + (clientX - original.x) * resizeRatioX / scale;
			if (lockAspectRatio) newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
		}
		if (hasDirection("left", direction)) {
			newWidth = original.width - (clientX - original.x) * resizeRatioX / scale;
			if (lockAspectRatio) newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
		}
		if (hasDirection("bottom", direction)) {
			newHeight = original.height + (clientY - original.y) * resizeRatioY / scale;
			if (lockAspectRatio) newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
		}
		if (hasDirection("top", direction)) {
			newHeight = original.height - (clientY - original.y) * resizeRatioY / scale;
			if (lockAspectRatio) newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
		}
		return {
			newWidth,
			newHeight
		};
	};
	Resizable.prototype.calculateNewSizeFromAspectRatio = function(newWidth, newHeight, max, min) {
		var _a = this.props, lockAspectRatio = _a.lockAspectRatio, lockAspectRatioExtraHeight = _a.lockAspectRatioExtraHeight, lockAspectRatioExtraWidth = _a.lockAspectRatioExtraWidth;
		var computedMinWidth = typeof min.width === "undefined" ? 10 : min.width;
		var computedMaxWidth = typeof max.width === "undefined" || max.width < 0 ? newWidth : max.width;
		var computedMinHeight = typeof min.height === "undefined" ? 10 : min.height;
		var computedMaxHeight = typeof max.height === "undefined" || max.height < 0 ? newHeight : max.height;
		var extraHeight = lockAspectRatioExtraHeight || 0;
		var extraWidth = lockAspectRatioExtraWidth || 0;
		if (lockAspectRatio) {
			var extraMinWidth = (computedMinHeight - extraHeight) * this.ratio + extraWidth;
			var extraMaxWidth = (computedMaxHeight - extraHeight) * this.ratio + extraWidth;
			var extraMinHeight = (computedMinWidth - extraWidth) / this.ratio + extraHeight;
			var extraMaxHeight = (computedMaxWidth - extraWidth) / this.ratio + extraHeight;
			var lockedMinWidth = Math.max(computedMinWidth, extraMinWidth);
			var lockedMaxWidth = Math.min(computedMaxWidth, extraMaxWidth);
			var lockedMinHeight = Math.max(computedMinHeight, extraMinHeight);
			var lockedMaxHeight = Math.min(computedMaxHeight, extraMaxHeight);
			newWidth = clamp(newWidth, lockedMinWidth, lockedMaxWidth);
			newHeight = clamp(newHeight, lockedMinHeight, lockedMaxHeight);
		} else {
			newWidth = clamp(newWidth, computedMinWidth, computedMaxWidth);
			newHeight = clamp(newHeight, computedMinHeight, computedMaxHeight);
		}
		return {
			newWidth,
			newHeight
		};
	};
	Resizable.prototype.setBoundingClientRect = function() {
		var adjustedScale = 1 / (this.props.scale || 1);
		if (this.props.bounds === "parent") {
			var parent_2 = this.parentNode;
			if (parent_2) {
				var parentRect = parent_2.getBoundingClientRect();
				this.parentLeft = parentRect.left * adjustedScale;
				this.parentTop = parentRect.top * adjustedScale;
			}
		}
		if (this.props.bounds && typeof this.props.bounds !== "string") {
			var targetRect = this.props.bounds.getBoundingClientRect();
			this.targetLeft = targetRect.left * adjustedScale;
			this.targetTop = targetRect.top * adjustedScale;
		}
		if (this.resizable) {
			var _a = this.resizable.getBoundingClientRect(), left = _a.left, top_1 = _a.top, right = _a.right, bottom = _a.bottom;
			this.resizableLeft = left * adjustedScale;
			this.resizableRight = right * adjustedScale;
			this.resizableTop = top_1 * adjustedScale;
			this.resizableBottom = bottom * adjustedScale;
		}
	};
	Resizable.prototype.onResizeStart = function(event, direction) {
		if (!this.resizable || !this.window) return;
		var clientX = 0;
		var clientY = 0;
		if (event.nativeEvent && isMouseEvent(event.nativeEvent)) {
			clientX = event.nativeEvent.clientX;
			clientY = event.nativeEvent.clientY;
		} else if (event.nativeEvent && isTouchEvent(event.nativeEvent)) {
			clientX = event.nativeEvent.touches[0].clientX;
			clientY = event.nativeEvent.touches[0].clientY;
		}
		if (this.props.onResizeStart) {
			if (this.resizable) {
				if (this.props.onResizeStart(event, direction, this.resizable) === false) return;
			}
		}
		if (this.props.size) {
			if (typeof this.props.size.height !== "undefined" && this.props.size.height !== this.state.height) this.setState({ height: this.props.size.height });
			if (typeof this.props.size.width !== "undefined" && this.props.size.width !== this.state.width) this.setState({ width: this.props.size.width });
		}
		this.ratio = typeof this.props.lockAspectRatio === "number" ? this.props.lockAspectRatio : this.size.width / this.size.height;
		var flexBasis;
		var computedStyle = this.window.getComputedStyle(this.resizable);
		if (computedStyle.flexBasis !== "auto") {
			var parent_3 = this.parentNode;
			if (parent_3) {
				this.flexDir = this.window.getComputedStyle(parent_3).flexDirection.startsWith("row") ? "row" : "column";
				flexBasis = computedStyle.flexBasis;
			}
		}
		this.setBoundingClientRect();
		this.bindEvents();
		var state = {
			original: {
				x: clientX,
				y: clientY,
				width: this.size.width,
				height: this.size.height
			},
			isResizing: true,
			backgroundStyle: __assign$1(__assign$1({}, this.state.backgroundStyle), { cursor: this.window.getComputedStyle(event.target).cursor || "auto" }),
			direction,
			flexBasis
		};
		this.setState(state);
	};
	Resizable.prototype.onMouseMove = function(event) {
		var _this = this;
		if (!this.state.isResizing || !this.resizable || !this.window) return;
		if (this.window.TouchEvent && isTouchEvent(event)) try {
			event.preventDefault();
			event.stopPropagation();
		} catch (e) {}
		var _a = this.props, maxWidth = _a.maxWidth, maxHeight = _a.maxHeight, minWidth = _a.minWidth, minHeight = _a.minHeight;
		var clientX = isTouchEvent(event) ? event.touches[0].clientX : event.clientX;
		var clientY = isTouchEvent(event) ? event.touches[0].clientY : event.clientY;
		var _b = this.state, direction = _b.direction, original = _b.original, width = _b.width, height = _b.height;
		var parentSize = this.getParentSize();
		var max = calculateNewMax(parentSize, this.window.innerWidth, this.window.innerHeight, maxWidth, maxHeight, minWidth, minHeight);
		maxWidth = max.maxWidth;
		maxHeight = max.maxHeight;
		minWidth = max.minWidth;
		minHeight = max.minHeight;
		var _c = this.calculateNewSizeFromDirection(clientX, clientY), newHeight = _c.newHeight, newWidth = _c.newWidth;
		var boundaryMax = this.calculateNewMaxFromBoundary(maxWidth, maxHeight);
		if (this.props.snap && this.props.snap.x) newWidth = findClosestSnap(newWidth, this.props.snap.x, this.props.snapGap);
		if (this.props.snap && this.props.snap.y) newHeight = findClosestSnap(newHeight, this.props.snap.y, this.props.snapGap);
		var newSize = this.calculateNewSizeFromAspectRatio(newWidth, newHeight, {
			width: boundaryMax.maxWidth,
			height: boundaryMax.maxHeight
		}, {
			width: minWidth,
			height: minHeight
		});
		newWidth = newSize.newWidth;
		newHeight = newSize.newHeight;
		if (this.props.grid) {
			var newGridWidth = snap(newWidth, this.props.grid[0], this.props.gridGap ? this.props.gridGap[0] : 0);
			var newGridHeight = snap(newHeight, this.props.grid[1], this.props.gridGap ? this.props.gridGap[1] : 0);
			var gap = this.props.snapGap || 0;
			var w = gap === 0 || Math.abs(newGridWidth - newWidth) <= gap ? newGridWidth : newWidth;
			var h = gap === 0 || Math.abs(newGridHeight - newHeight) <= gap ? newGridHeight : newHeight;
			newWidth = w;
			newHeight = h;
		}
		var delta = {
			width: newWidth - original.width,
			height: newHeight - original.height
		};
		this.delta = delta;
		if (width && typeof width === "string") {
			if (width.endsWith("%")) {
				var percent = newWidth / parentSize.width * 100;
				newWidth = "".concat(percent, "%");
			} else if (width.endsWith("vw")) {
				var vw = newWidth / this.window.innerWidth * 100;
				newWidth = "".concat(vw, "vw");
			} else if (width.endsWith("vh")) {
				var vh = newWidth / this.window.innerHeight * 100;
				newWidth = "".concat(vh, "vh");
			}
		}
		if (height && typeof height === "string") {
			if (height.endsWith("%")) {
				var percent = newHeight / parentSize.height * 100;
				newHeight = "".concat(percent, "%");
			} else if (height.endsWith("vw")) {
				var vw = newHeight / this.window.innerWidth * 100;
				newHeight = "".concat(vw, "vw");
			} else if (height.endsWith("vh")) {
				var vh = newHeight / this.window.innerHeight * 100;
				newHeight = "".concat(vh, "vh");
			}
		}
		var newState = {
			width: this.createSizeForCssProperty(newWidth, "width"),
			height: this.createSizeForCssProperty(newHeight, "height")
		};
		if (this.flexDir === "row") newState.flexBasis = newState.width;
		else if (this.flexDir === "column") newState.flexBasis = newState.height;
		var widthChanged = this.state.width !== newState.width;
		var heightChanged = this.state.height !== newState.height;
		var flexBaseChanged = this.state.flexBasis !== newState.flexBasis;
		var changed = widthChanged || heightChanged || flexBaseChanged;
		if (changed) (0, import_react_dom.flushSync)(function() {
			_this.setState(newState);
		});
		if (this.props.onResize) {
			if (changed) this.props.onResize(event, direction, this.resizable, delta);
		}
	};
	Resizable.prototype.onMouseUp = function(event) {
		var _a, _b, _c = this.state, isResizing = _c.isResizing, direction = _c.direction;
		_c.original;
		if (!isResizing || !this.resizable) return;
		if (this.props.onResizeStop) this.props.onResizeStop(event, direction, this.resizable, this.delta);
		if (this.props.size) this.setState({
			width: (_a = this.props.size.width) !== null && _a !== void 0 ? _a : "auto",
			height: (_b = this.props.size.height) !== null && _b !== void 0 ? _b : "auto"
		});
		this.unbindEvents();
		this.setState({
			isResizing: false,
			backgroundStyle: __assign$1(__assign$1({}, this.state.backgroundStyle), { cursor: "auto" })
		});
	};
	Resizable.prototype.updateSize = function(size) {
		var _a, _b;
		this.setState({
			width: (_a = size.width) !== null && _a !== void 0 ? _a : "auto",
			height: (_b = size.height) !== null && _b !== void 0 ? _b : "auto"
		});
	};
	Resizable.prototype.renderResizer = function() {
		var _this = this;
		var _a = this.props, enable = _a.enable, handleStyles = _a.handleStyles, handleClasses = _a.handleClasses, handleWrapperStyle = _a.handleWrapperStyle, handleWrapperClass = _a.handleWrapperClass, handleComponent = _a.handleComponent;
		if (!enable) return null;
		return (0, import_jsx_runtime.jsx)("div", {
			className: handleWrapperClass,
			style: handleWrapperStyle,
			children: Object.keys(enable).map(function(dir) {
				if (enable[dir] !== false) return (0, import_jsx_runtime.jsx)(Resizer, {
					direction: dir,
					onResizeStart: _this.onResizeStart,
					replaceStyles: handleStyles && handleStyles[dir],
					className: handleClasses && handleClasses[dir],
					children: handleComponent && handleComponent[dir] ? handleComponent[dir] : null
				}, dir);
				return null;
			})
		});
	};
	Resizable.prototype.render = function() {
		var _this = this;
		var extendsProps = Object.keys(this.props).reduce(function(acc, key) {
			if (definedProps.indexOf(key) !== -1) return acc;
			acc[key] = _this.props[key];
			return acc;
		}, {});
		var style = __assign$1(__assign$1(__assign$1({
			position: "relative",
			userSelect: this.state.isResizing ? "none" : "auto"
		}, this.props.style), this.sizeStyle), {
			maxWidth: this.props.maxWidth,
			maxHeight: this.props.maxHeight,
			minWidth: this.props.minWidth,
			minHeight: this.props.minHeight,
			boxSizing: "border-box",
			flexShrink: 0
		});
		if (this.state.flexBasis) style.flexBasis = this.state.flexBasis;
		return (0, import_jsx_runtime.jsxs)(this.props.as || "div", __assign$1({
			style,
			className: this.props.className
		}, extendsProps, {
			ref: function(c) {
				if (c) _this.resizable = c;
			},
			children: [
				this.state.isResizing && (0, import_jsx_runtime.jsx)("div", { style: this.state.backgroundStyle }),
				this.props.children,
				this.renderResizer()
			]
		}));
	};
	Resizable.defaultProps = {
		as: "div",
		onResizeStart: function() {},
		onResize: function() {},
		onResizeStop: function() {},
		enable: {
			top: true,
			right: true,
			bottom: true,
			left: true,
			topRight: true,
			bottomRight: true,
			bottomLeft: true,
			topLeft: true
		},
		style: {},
		grid: [1, 1],
		gridGap: [0, 0],
		lockAspectRatio: false,
		lockAspectRatioExtraWidth: 0,
		lockAspectRatioExtraHeight: 0,
		scale: 1,
		resizeRatio: 1,
		snapGap: 0
	};
	return Resizable;
}(import_react.PureComponent);
//#endregion
//#region node_modules/react-rnd/lib/index.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var extendStatics = function(d, b) {
	extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics(d, b);
};
function __extends(d, b) {
	extendStatics(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function() {
	__assign = Object.assign || function __assign(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
var resizableStyle = {
	width: "auto",
	height: "auto",
	display: "inline-block",
	position: "absolute",
	top: 0,
	left: 0
};
var getEnableResizingByFlag = function(flag) {
	return {
		bottom: flag,
		bottomLeft: flag,
		bottomRight: flag,
		left: flag,
		right: flag,
		top: flag,
		topLeft: flag,
		topRight: flag
	};
};
var Rnd = function(_super) {
	__extends(Rnd, _super);
	function Rnd(props) {
		var _this = _super.call(this, props) || this;
		_this.resizingPosition = {
			x: 0,
			y: 0
		};
		_this.offsetFromParent = {
			left: 0,
			top: 0
		};
		_this.resizableElement = { current: null };
		_this.originalPosition = {
			x: 0,
			y: 0
		};
		_this.state = {
			resizing: false,
			bounds: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			},
			maxWidth: props.maxWidth,
			maxHeight: props.maxHeight
		};
		_this.onResizeStart = _this.onResizeStart.bind(_this);
		_this.onResize = _this.onResize.bind(_this);
		_this.onResizeStop = _this.onResizeStop.bind(_this);
		_this.onDragStart = _this.onDragStart.bind(_this);
		_this.onDrag = _this.onDrag.bind(_this);
		_this.onDragStop = _this.onDragStop.bind(_this);
		_this.getMaxSizesFromProps = _this.getMaxSizesFromProps.bind(_this);
		return _this;
	}
	Rnd.prototype.componentDidMount = function() {
		this.updateOffsetFromParent();
		var _a = this.offsetFromParent, left = _a.left, top = _a.top;
		var _b = this.getDraggablePosition(), x = _b.x, y = _b.y;
		this.draggable.setState({
			x: x - left,
			y: y - top
		});
		this.forceUpdate();
	};
	Rnd.prototype.getDraggablePosition = function() {
		var _a = this.draggable.state;
		return {
			x: _a.x,
			y: _a.y
		};
	};
	Rnd.prototype.getParent = function() {
		return this.resizable && this.resizable.parentNode;
	};
	Rnd.prototype.getParentSize = function() {
		return this.resizable.getParentSize();
	};
	Rnd.prototype.getMaxSizesFromProps = function() {
		return {
			maxWidth: typeof this.props.maxWidth === "undefined" ? Number.MAX_SAFE_INTEGER : this.props.maxWidth,
			maxHeight: typeof this.props.maxHeight === "undefined" ? Number.MAX_SAFE_INTEGER : this.props.maxHeight
		};
	};
	Rnd.prototype.getSelfElement = function() {
		return this.resizable && this.resizable.resizable;
	};
	Rnd.prototype.getOffsetHeight = function(boundary) {
		var scale = this.props.scale;
		switch (this.props.bounds) {
			case "window": return window.innerHeight / scale;
			case "body": return document.body.offsetHeight / scale;
			default: return boundary.offsetHeight;
		}
	};
	Rnd.prototype.getOffsetWidth = function(boundary) {
		var scale = this.props.scale;
		switch (this.props.bounds) {
			case "window": return window.innerWidth / scale;
			case "body": return document.body.offsetWidth / scale;
			default: return boundary.offsetWidth;
		}
	};
	Rnd.prototype.onDragStart = function(e, data) {
		if (this.props.onDragStart && this.props.onDragStart(e, data) === false) return false;
		this.originalPosition = this.getDraggablePosition();
		if (!this.props.bounds) return;
		var parent = this.getParent();
		var scale = this.props.scale;
		var boundary;
		if (this.props.bounds === "parent") boundary = parent;
		else if (this.props.bounds === "body") {
			var parentRect_1 = parent.getBoundingClientRect();
			var parentLeft_1 = parentRect_1.left;
			var parentTop_1 = parentRect_1.top;
			var bodyRect = document.body.getBoundingClientRect();
			var left_1 = -(parentLeft_1 - parent.offsetLeft * scale - bodyRect.left) / scale;
			var top_1 = -(parentTop_1 - parent.offsetTop * scale - bodyRect.top) / scale;
			var right = (document.body.offsetWidth - this.resizable.size.width * scale) / scale + left_1;
			var bottom = (document.body.offsetHeight - this.resizable.size.height * scale) / scale + top_1;
			return this.setState({ bounds: {
				top: top_1,
				right,
				bottom,
				left: left_1
			} });
		} else if (this.props.bounds === "window") {
			if (!this.resizable) return;
			var parentRect_2 = parent.getBoundingClientRect();
			var parentLeft_2 = parentRect_2.left;
			var parentTop_2 = parentRect_2.top;
			var left_2 = -(parentLeft_2 - parent.offsetLeft * scale) / scale;
			var top_2 = -(parentTop_2 - parent.offsetTop * scale) / scale;
			var right = (window.innerWidth - this.resizable.size.width * scale) / scale + left_2;
			var bottom = (window.innerHeight - this.resizable.size.height * scale) / scale + top_2;
			return this.setState({ bounds: {
				top: top_2,
				right,
				bottom,
				left: left_2
			} });
		} else if (typeof this.props.bounds === "string") boundary = document.querySelector(this.props.bounds);
		else if (this.props.bounds instanceof HTMLElement) boundary = this.props.bounds;
		if (!(boundary instanceof HTMLElement) || !(parent instanceof HTMLElement)) return;
		var boundaryRect = boundary.getBoundingClientRect();
		var boundaryLeft = boundaryRect.left;
		var boundaryTop = boundaryRect.top;
		var parentRect = parent.getBoundingClientRect();
		var parentLeft = parentRect.left;
		var parentTop = parentRect.top;
		var left = (boundaryLeft - parentLeft) / scale;
		var top = boundaryTop - parentTop;
		if (!this.resizable) return;
		this.updateOffsetFromParent();
		var offset = this.offsetFromParent;
		this.setState({ bounds: {
			top: top - offset.top,
			right: left + (boundary.offsetWidth - this.resizable.size.width) - offset.left / scale,
			bottom: top + (boundary.offsetHeight - this.resizable.size.height) - offset.top,
			left: left - offset.left / scale
		} });
	};
	Rnd.prototype.onDrag = function(e, data) {
		if (!this.props.onDrag) return;
		var _a = this.offsetFromParent, left = _a.left, top = _a.top;
		if (!this.props.dragAxis || this.props.dragAxis === "both") return this.props.onDrag(e, __assign(__assign({}, data), {
			x: data.x + left,
			y: data.y + top
		}));
		else if (this.props.dragAxis === "x") return this.props.onDrag(e, __assign(__assign({}, data), {
			x: data.x + left,
			y: this.originalPosition.y + top,
			deltaY: 0
		}));
		else if (this.props.dragAxis === "y") return this.props.onDrag(e, __assign(__assign({}, data), {
			x: this.originalPosition.x + left,
			y: data.y + top,
			deltaX: 0
		}));
	};
	Rnd.prototype.onDragStop = function(e, data) {
		if (!this.props.onDragStop) return;
		var _a = this.offsetFromParent, left = _a.left, top = _a.top;
		if (!this.props.dragAxis || this.props.dragAxis === "both") return this.props.onDragStop(e, __assign(__assign({}, data), {
			x: data.x + left,
			y: data.y + top
		}));
		else if (this.props.dragAxis === "x") return this.props.onDragStop(e, __assign(__assign({}, data), {
			x: data.x + left,
			y: this.originalPosition.y + top,
			deltaY: 0
		}));
		else if (this.props.dragAxis === "y") return this.props.onDragStop(e, __assign(__assign({}, data), {
			x: this.originalPosition.x + left,
			y: data.y + top,
			deltaX: 0
		}));
	};
	Rnd.prototype.onResizeStart = function(e, dir, elementRef) {
		if (this.props.onResizeStart && this.props.onResizeStart(e, dir, elementRef) === false) return false;
		e.stopPropagation();
		this.setState({ resizing: true });
		var scale = this.props.scale;
		var offset = this.offsetFromParent;
		var pos = this.getDraggablePosition();
		this.resizingPosition = {
			x: pos.x + offset.left,
			y: pos.y + offset.top
		};
		this.originalPosition = pos;
		if (this.props.bounds) {
			var parent_1 = this.getParent();
			var boundary = void 0;
			if (this.props.bounds === "parent") boundary = parent_1;
			else if (this.props.bounds === "body") boundary = document.body;
			else if (this.props.bounds === "window") boundary = window;
			else if (typeof this.props.bounds === "string") boundary = document.querySelector(this.props.bounds);
			else if (this.props.bounds instanceof HTMLElement) boundary = this.props.bounds;
			var self_1 = this.getSelfElement();
			if (self_1 instanceof Element && (boundary instanceof HTMLElement || boundary === window) && parent_1 instanceof HTMLElement) {
				var _a = this.getMaxSizesFromProps(), maxWidth = _a.maxWidth, maxHeight = _a.maxHeight;
				var parentSize = this.getParentSize();
				if (maxWidth && typeof maxWidth === "string") {
					if (maxWidth.endsWith("%")) {
						var ratio = Number(maxWidth.replace("%", "")) / 100;
						maxWidth = parentSize.width * ratio;
					} else if (maxWidth.endsWith("px")) maxWidth = Number(maxWidth.replace("px", ""));
				}
				if (maxHeight && typeof maxHeight === "string") {
					if (maxHeight.endsWith("%")) {
						var ratio = Number(maxHeight.replace("%", "")) / 100;
						maxHeight = parentSize.height * ratio;
					} else if (maxHeight.endsWith("px")) maxHeight = Number(maxHeight.replace("px", ""));
				}
				var selfRect = self_1.getBoundingClientRect();
				var selfLeft = selfRect.left;
				var selfTop = selfRect.top;
				var boundaryRect = this.props.bounds === "window" ? {
					left: 0,
					top: 0
				} : boundary.getBoundingClientRect();
				var boundaryLeft = boundaryRect.left;
				var boundaryTop = boundaryRect.top;
				var offsetWidth = this.getOffsetWidth(boundary);
				var offsetHeight = this.getOffsetHeight(boundary);
				var hasLeft = dir.toLowerCase().endsWith("left");
				var hasRight = dir.toLowerCase().endsWith("right");
				var hasTop = dir.startsWith("top");
				var hasBottom = dir.startsWith("bottom");
				if ((hasLeft || hasTop) && this.resizable) {
					var max = (selfLeft - boundaryLeft) / scale + this.resizable.size.width;
					this.setState({ maxWidth: max > Number(maxWidth) ? maxWidth : max });
				}
				if (hasRight || this.props.lockAspectRatio && !hasLeft && !hasTop) {
					var max = offsetWidth + (boundaryLeft - selfLeft) / scale;
					this.setState({ maxWidth: max > Number(maxWidth) ? maxWidth : max });
				}
				if ((hasTop || hasLeft) && this.resizable) {
					var max = (selfTop - boundaryTop) / scale + this.resizable.size.height;
					this.setState({ maxHeight: max > Number(maxHeight) ? maxHeight : max });
				}
				if (hasBottom || this.props.lockAspectRatio && !hasTop && !hasLeft) {
					var max = offsetHeight + (boundaryTop - selfTop) / scale;
					this.setState({ maxHeight: max > Number(maxHeight) ? maxHeight : max });
				}
			}
		} else this.setState({
			maxWidth: this.props.maxWidth,
			maxHeight: this.props.maxHeight
		});
	};
	Rnd.prototype.onResize = function(e, direction, elementRef, delta) {
		var _this = this;
		var newPos = {
			x: this.originalPosition.x,
			y: this.originalPosition.y
		};
		var left = -delta.width;
		var top = -delta.height;
		if ([
			"top",
			"left",
			"topLeft",
			"bottomLeft",
			"topRight"
		].includes(direction)) if (direction === "bottomLeft") newPos.x += left;
		else if (direction === "topRight") newPos.y += top;
		else {
			newPos.x += left;
			newPos.y += top;
		}
		var draggableState = this.draggable.state;
		if (newPos.x !== draggableState.x || newPos.y !== draggableState.y) (0, import_react_dom.flushSync)(function() {
			_this.draggable.setState(newPos);
		});
		this.updateOffsetFromParent();
		var offset = this.offsetFromParent;
		var x = this.getDraggablePosition().x + offset.left;
		var y = this.getDraggablePosition().y + offset.top;
		this.resizingPosition = {
			x,
			y
		};
		if (!this.props.onResize) return;
		this.props.onResize(e, direction, elementRef, delta, {
			x,
			y
		});
	};
	Rnd.prototype.onResizeStop = function(e, direction, elementRef, delta) {
		this.setState({ resizing: false });
		var _a = this.getMaxSizesFromProps(), maxWidth = _a.maxWidth, maxHeight = _a.maxHeight;
		this.setState({
			maxWidth,
			maxHeight
		});
		if (this.props.onResizeStop) this.props.onResizeStop(e, direction, elementRef, delta, this.resizingPosition);
	};
	Rnd.prototype.updateSize = function(size) {
		if (!this.resizable) return;
		this.resizable.updateSize({
			width: size.width,
			height: size.height
		});
	};
	Rnd.prototype.updatePosition = function(position) {
		this.draggable.setState(position);
	};
	Rnd.prototype.updateOffsetFromParent = function() {
		var scale = this.props.scale;
		var parent = this.getParent();
		var self = this.getSelfElement();
		if (!parent || self === null) return {
			top: 0,
			left: 0
		};
		var parentRect = parent.getBoundingClientRect();
		var parentLeft = parentRect.left;
		var parentTop = parentRect.top;
		var selfRect = self.getBoundingClientRect();
		var position = this.getDraggablePosition();
		var scrollLeft = parent.scrollLeft;
		var scrollTop = parent.scrollTop;
		this.offsetFromParent = {
			left: selfRect.left - parentLeft + scrollLeft - position.x * scale,
			top: selfRect.top - parentTop + scrollTop - position.y * scale
		};
	};
	Rnd.prototype.render = function() {
		var _this = this, _a = this.props, disableDragging = _a.disableDragging, style = _a.style, dragHandleClassName = _a.dragHandleClassName, position = _a.position, onMouseDown = _a.onMouseDown, onMouseUp = _a.onMouseUp, dragAxis = _a.dragAxis, dragGrid = _a.dragGrid, bounds = _a.bounds, enableUserSelectHack = _a.enableUserSelectHack, cancel = _a.cancel, children = _a.children;
		_a.onResizeStart;
		_a.onResize;
		_a.onResizeStop;
		_a.onDragStart;
		_a.onDrag;
		_a.onDragStop;
		var resizeHandleStyles = _a.resizeHandleStyles, resizeHandleClasses = _a.resizeHandleClasses, resizeHandleComponent = _a.resizeHandleComponent, enableResizing = _a.enableResizing, resizeGrid = _a.resizeGrid, resizeHandleWrapperClass = _a.resizeHandleWrapperClass, resizeHandleWrapperStyle = _a.resizeHandleWrapperStyle, scale = _a.scale, allowAnyClick = _a.allowAnyClick, dragPositionOffset = _a.dragPositionOffset, resizableProps = __rest(_a, [
			"disableDragging",
			"style",
			"dragHandleClassName",
			"position",
			"onMouseDown",
			"onMouseUp",
			"dragAxis",
			"dragGrid",
			"bounds",
			"enableUserSelectHack",
			"cancel",
			"children",
			"onResizeStart",
			"onResize",
			"onResizeStop",
			"onDragStart",
			"onDrag",
			"onDragStop",
			"resizeHandleStyles",
			"resizeHandleClasses",
			"resizeHandleComponent",
			"enableResizing",
			"resizeGrid",
			"resizeHandleWrapperClass",
			"resizeHandleWrapperStyle",
			"scale",
			"allowAnyClick",
			"dragPositionOffset"
		]);
		var defaultValue = this.props.default ? __assign({}, this.props.default) : void 0;
		delete resizableProps.default;
		var cursorStyle = disableDragging || dragHandleClassName ? { cursor: "auto" } : { cursor: "move" };
		var innerStyle = __assign(__assign(__assign({}, resizableStyle), cursorStyle), style);
		var _b = this.offsetFromParent, left = _b.left, top = _b.top;
		var draggablePosition;
		if (position) draggablePosition = {
			x: position.x - left,
			y: position.y - top
		};
		var pos = this.state.resizing ? void 0 : draggablePosition;
		var dragAxisOrUndefined = this.state.resizing ? "both" : dragAxis;
		return (0, import_react.createElement)(import_cjs.default, {
			ref: function(c) {
				if (!c) return;
				_this.draggable = c;
			},
			handle: dragHandleClassName ? ".".concat(dragHandleClassName) : void 0,
			defaultPosition: defaultValue,
			onMouseDown,
			onMouseUp,
			onStart: this.onDragStart,
			onDrag: this.onDrag,
			onStop: this.onDragStop,
			axis: dragAxisOrUndefined,
			disabled: disableDragging,
			grid: dragGrid,
			bounds: bounds ? this.state.bounds : void 0,
			position: pos,
			enableUserSelectHack,
			cancel,
			scale,
			allowAnyClick,
			nodeRef: this.resizableElement,
			positionOffset: dragPositionOffset
		}, (0, import_react.createElement)(Resizable, __assign({}, resizableProps, {
			ref: function(c) {
				if (!c) return;
				_this.resizable = c;
				_this.resizableElement.current = c.resizable;
			},
			defaultSize: defaultValue,
			size: this.props.size,
			enable: typeof enableResizing === "boolean" ? getEnableResizingByFlag(enableResizing) : enableResizing,
			onResizeStart: this.onResizeStart,
			onResize: this.onResize,
			onResizeStop: this.onResizeStop,
			style: innerStyle,
			minWidth: this.props.minWidth,
			minHeight: this.props.minHeight,
			maxWidth: this.state.resizing ? this.state.maxWidth : this.props.maxWidth,
			maxHeight: this.state.resizing ? this.state.maxHeight : this.props.maxHeight,
			grid: resizeGrid,
			handleWrapperClass: resizeHandleWrapperClass,
			handleWrapperStyle: resizeHandleWrapperStyle,
			lockAspectRatio: this.props.lockAspectRatio,
			lockAspectRatioExtraWidth: this.props.lockAspectRatioExtraWidth,
			lockAspectRatioExtraHeight: this.props.lockAspectRatioExtraHeight,
			handleStyles: resizeHandleStyles,
			handleClasses: resizeHandleClasses,
			handleComponent: resizeHandleComponent,
			scale: this.props.scale
		}), children));
	};
	Rnd.defaultProps = {
		maxWidth: Number.MAX_SAFE_INTEGER,
		maxHeight: Number.MAX_SAFE_INTEGER,
		scale: 1,
		onResizeStart: function() {},
		onResize: function() {},
		onResizeStop: function() {},
		onDragStart: function() {},
		onDrag: function() {},
		onDragStop: function() {}
	};
	return Rnd;
}(import_react.PureComponent);
//#endregion
//#region src/utils/sounds_basses.js
var safeTime$2 = (time) => Math.max(time, .001);
var MIN_GAIN$2 = 1e-4;
var envelope$2 = (gainParam, start, attack, hold, release, peak, sustain = peak * .35) => {
	gainParam.cancelScheduledValues(start);
	gainParam.setValueAtTime(MIN_GAIN$2, start);
	gainParam.linearRampToValueAtTime(Math.max(peak, MIN_GAIN$2), start + safeTime$2(attack));
	gainParam.exponentialRampToValueAtTime(Math.max(sustain, MIN_GAIN$2), start + safeTime$2(attack + hold));
	gainParam.exponentialRampToValueAtTime(MIN_GAIN$2, start + safeTime$2(attack + hold + release));
};
var createOutput$2 = ({ volume = 1, pan = 0 } = {}) => {
	const ctx = getAudioContext();
	if (!ctx) return null;
	const input = ctx.createGain();
	input.gain.value = volume;
	let output = input;
	if (ctx.createStereoPanner) {
		const panner = ctx.createStereoPanner();
		panner.pan.value = pan;
		input.connect(panner);
		output = panner;
	}
	output.connect(ctx.destination);
	return {
		ctx,
		input
	};
};
var voice$2 = ({ freq, type = "sine", start = 0, attack = .01, hold = .08, release = .35, gain = .32, sustain, detune = 0, destination, filter, bendTo, bendTime = .2 }) => {
	const ctx = getAudioContext();
	if (!ctx || !destination || !freq || freq <= 0) return null;
	const now = ctx.currentTime + start;
	const osc = ctx.createOscillator();
	const gainNode = ctx.createGain();
	const filterNode = filter ? ctx.createBiquadFilter() : null;
	osc.type = type;
	osc.frequency.setValueAtTime(freq, now);
	osc.detune.setValueAtTime(detune, now);
	if (bendTo) osc.frequency.exponentialRampToValueAtTime(Math.max(bendTo, 1), now + safeTime$2(bendTime));
	if (filterNode) {
		filterNode.type = filter.type || "lowpass";
		filterNode.frequency.setValueAtTime(filter.frequency || 2200, now);
		filterNode.Q.value = filter.q || .8;
		if (filter.to) filterNode.frequency.linearRampToValueAtTime(filter.to, now + safeTime$2(filter.time || .35));
		osc.connect(filterNode);
		filterNode.connect(gainNode);
	} else osc.connect(gainNode);
	envelope$2(gainNode.gain, now, attack, hold, release, gain, sustain);
	gainNode.connect(destination);
	osc.start(now);
	osc.stop(now + attack + hold + release + .06);
	return osc;
};
var noiseBurst$2 = ({ start = 0, duration = .16, attack = .004, release = .12, gain = .22, filterType = "bandpass", frequency = 1800, q = 1, output } = {}) => {
	const ctx = getAudioContext();
	if (!ctx || !output) return;
	const now = ctx.currentTime + start;
	const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
	const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < length; i += 1) {
		const fade = 1 - i / length;
		data[i] = (Math.random() * 2 - 1) * fade;
	}
	const source = ctx.createBufferSource();
	source.buffer = buffer;
	const filter = ctx.createBiquadFilter();
	filter.type = filterType;
	filter.frequency.setValueAtTime(frequency, now);
	filter.Q.value = q;
	const gainNode = ctx.createGain();
	envelope$2(gainNode.gain, now, attack, Math.max(duration - release, .01), release, gain, gain * .4);
	source.connect(filter);
	filter.connect(gainNode);
	gainNode.connect(output);
	source.start(now);
	source.stop(now + duration + release + .04);
};
var BASS_INSTRUMENTS = [
	{
		id: "808_deep",
		name: "Deep 808",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sine",
				start,
				attack: .02,
				hold: .4,
				release: 1.2,
				gain: .9,
				destination: out.input,
				bendTo: freq * .95,
				bendTime: .6
			});
			voice$2({
				freq: freq * 2,
				type: "triangle",
				start,
				attack: .01,
				hold: .1,
				release: .4,
				gain: .15,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 300
				}
			});
		}
	},
	{
		id: "808_punch",
		name: "Punchy 808",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq: freq * 2,
				type: "sine",
				start,
				attack: .005,
				hold: .05,
				release: .6,
				gain: .8,
				destination: out.input,
				bendTo: freq,
				bendTime: .05
			});
			voice$2({
				freq,
				type: "square",
				start,
				attack: .01,
				hold: .1,
				release: .5,
				gain: .1,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 400
				}
			});
		}
	},
	{
		id: "808_distorted",
		name: "Distorted 808",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sine",
				start,
				attack: .02,
				hold: .3,
				release: .8,
				gain: .9,
				destination: out.input
			});
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .01,
				hold: .2,
				release: .6,
				gain: .3,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 800,
					to: 300,
					time: .4
				}
			});
		}
	},
	{
		id: "808_glide",
		name: "Glide 808",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq: freq * 1.5,
				type: "sine",
				start,
				attack: .05,
				hold: .4,
				release: 1,
				gain: .9,
				destination: out.input,
				bendTo: freq,
				bendTime: .2
			});
		}
	},
	{
		id: "sub_basic",
		name: "Basic Sub",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sine",
				start,
				attack: .05,
				hold: .3,
				release: .5,
				gain: 1,
				destination: out.input
			});
		}
	},
	{
		id: "sub_warm",
		name: "Warm Sub",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sine",
				start,
				attack: .04,
				hold: .3,
				release: .5,
				gain: .8,
				destination: out.input
			});
			voice$2({
				freq,
				type: "triangle",
				start,
				attack: .04,
				hold: .3,
				release: .5,
				gain: .3,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 200
				}
			});
		}
	},
	{
		id: "sub_thick",
		name: "Thick Sub",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sine",
				start,
				attack: .05,
				hold: .3,
				release: .5,
				gain: .8,
				destination: out.input
			});
			voice$2({
				freq: freq * .5,
				type: "square",
				start,
				attack: .05,
				hold: .3,
				release: .5,
				gain: .15,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 150
				}
			});
		}
	},
	{
		id: "reese_classic",
		name: "Classic Reese",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .05,
				hold: .4,
				release: .6,
				gain: .4,
				detune: -10,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 1200
				}
			});
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .05,
				hold: .4,
				release: .6,
				gain: .4,
				detune: 10,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 1200
				}
			});
		}
	},
	{
		id: "reese_wide",
		name: "Wide Reese",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .08,
				hold: .4,
				release: .6,
				gain: .3,
				detune: -15,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 1500
				}
			});
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .08,
				hold: .4,
				release: .6,
				gain: .3,
				detune: 15,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 1500
				}
			});
			voice$2({
				freq: freq * .5,
				type: "square",
				start,
				attack: .08,
				hold: .4,
				release: .6,
				gain: .2,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 400
				}
			});
		}
	},
	{
		id: "reese_filtered",
		name: "Filtered Reese",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .05,
				hold: .4,
				release: .6,
				gain: .4,
				detune: -8,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 2e3,
					to: 400,
					time: .4
				}
			});
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .05,
				hold: .4,
				release: .6,
				gain: .4,
				detune: 8,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 2e3,
					to: 400,
					time: .4
				}
			});
		}
	},
	{
		id: "fm_wobble_slow",
		name: "Slow Wobble",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .02,
				hold: .5,
				release: .4,
				gain: .5,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 300,
					to: 1200,
					time: .3,
					q: 2
				}
			});
			voice$2({
				freq: freq * .5,
				type: "sine",
				start,
				attack: .02,
				hold: .5,
				release: .4,
				gain: .6,
				destination: out.input
			});
		}
	},
	{
		id: "fm_wobble_fast",
		name: "Fast Wobble",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "square",
				start,
				attack: .02,
				hold: .3,
				release: .4,
				gain: .4,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 200,
					to: 1800,
					time: .1,
					q: 3
				}
			});
			voice$2({
				freq: freq * .5,
				type: "sine",
				start,
				attack: .02,
				hold: .3,
				release: .4,
				gain: .6,
				destination: out.input
			});
		}
	},
	{
		id: "fm_bass_pluck",
		name: "FM Pluck Bass",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sine",
				start,
				attack: .01,
				hold: .15,
				release: .4,
				gain: .8,
				destination: out.input
			});
			voice$2({
				freq: freq * 2,
				type: "triangle",
				start,
				attack: .01,
				hold: .1,
				release: .2,
				gain: .4,
				destination: out.input,
				bendTo: freq,
				bendTime: .1
			});
		}
	},
	{
		id: "slap_bass_acoustic",
		name: "Acoustic Slap",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "triangle",
				start,
				attack: .01,
				hold: .1,
				release: .5,
				gain: .7,
				destination: out.input
			});
			noiseBurst$2({
				start,
				duration: .04,
				attack: .002,
				release: .03,
				gain: .15,
				frequency: 1200,
				filterType: "bandpass",
				q: 1,
				output: out.input
			});
			voice$2({
				freq: freq * 2,
				type: "sine",
				start,
				attack: .01,
				hold: .05,
				release: .2,
				gain: .2,
				destination: out.input
			});
		}
	},
	{
		id: "slap_bass_synth",
		name: "Synth Slap",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .01,
				hold: .1,
				release: .4,
				gain: .5,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 3e3,
					to: 400,
					time: .1
				}
			});
			voice$2({
				freq: freq * .5,
				type: "square",
				start,
				attack: .01,
				hold: .1,
				release: .4,
				gain: .3,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 800,
					to: 200,
					time: .1
				}
			});
		}
	},
	{
		id: "acid_303_classic",
		name: "Classic Acid",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .01,
				hold: .1,
				release: .3,
				gain: .6,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 4e3,
					to: 300,
					time: .15,
					q: 4
				}
			});
		}
	},
	{
		id: "acid_303_squelch",
		name: "Squelch Acid",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "square",
				start,
				attack: .01,
				hold: .1,
				release: .3,
				gain: .5,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 5e3,
					to: 400,
					time: .2,
					q: 8
				}
			});
		}
	},
	{
		id: "acid_square",
		name: "Square Acid",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "square",
				start,
				attack: .01,
				hold: .15,
				release: .3,
				gain: .5,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 2500,
					to: 500,
					time: .1,
					q: 3
				}
			});
		}
	},
	{
		id: "moog_model_d",
		name: "Model D Style",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .02,
				hold: .2,
				release: .4,
				gain: .4,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 1800,
					to: 400,
					time: .2,
					q: 2
				}
			});
			voice$2({
				freq: freq * .5,
				type: "square",
				start,
				attack: .02,
				hold: .2,
				release: .4,
				gain: .3,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 1800,
					to: 400,
					time: .2,
					q: 2
				}
			});
		}
	},
	{
		id: "moog_taurus",
		name: "Taurus Bass",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .05,
				hold: .4,
				release: .8,
				gain: .35,
				detune: -6,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 1200,
					to: 300,
					time: .5
				}
			});
			voice$2({
				freq: freq * .5,
				type: "sawtooth",
				start,
				attack: .05,
				hold: .4,
				release: .8,
				gain: .35,
				detune: 6,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 1200,
					to: 300,
					time: .5
				}
			});
		}
	},
	{
		id: "moog_subphatty",
		name: "Sub Phatty",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .01,
				hold: .2,
				release: .4,
				gain: .4,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 2e3,
					to: 500,
					time: .15
				}
			});
			voice$2({
				freq: freq * .5,
				type: "triangle",
				start,
				attack: .01,
				hold: .2,
				release: .4,
				gain: .5,
				destination: out.input
			});
		}
	},
	{
		id: "pluck_bass_simple",
		name: "Simple Pluck",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "square",
				start,
				attack: .005,
				hold: .05,
				release: .2,
				gain: .5,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 3e3,
					to: 300,
					time: .1
				}
			});
		}
	},
	{
		id: "pluck_bass_fm",
		name: "FM Pluck",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sine",
				start,
				attack: .005,
				hold: .1,
				release: .3,
				gain: .7,
				destination: out.input
			});
			voice$2({
				freq: freq * 3,
				type: "triangle",
				start,
				attack: .005,
				hold: .05,
				release: .1,
				gain: .3,
				destination: out.input,
				filter: {
					type: "highpass",
					frequency: 800
				}
			});
		}
	},
	{
		id: "pluck_bass_hollow",
		name: "Hollow Pluck",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "triangle",
				start,
				attack: .005,
				hold: .1,
				release: .3,
				gain: .6,
				destination: out.input
			});
			voice$2({
				freq: freq * 2,
				type: "sine",
				start,
				attack: .005,
				hold: .05,
				release: .2,
				gain: .3,
				destination: out.input
			});
		}
	},
	{
		id: "tech_house_bass",
		name: "Tech House Bass",
		play: (freq, opts = {}) => {
			const out = createOutput$2(opts);
			if (!out) return;
			const { start = 0 } = opts;
			voice$2({
				freq,
				type: "sawtooth",
				start,
				attack: .01,
				hold: .1,
				release: .2,
				gain: .4,
				destination: out.input,
				filter: {
					type: "lowpass",
					frequency: 1500,
					to: 200,
					time: .1
				}
			});
			voice$2({
				freq: freq * .5,
				type: "sine",
				start,
				attack: .01,
				hold: .1,
				release: .25,
				gain: .6,
				destination: out.input
			});
		}
	}
];
//#endregion
//#region src/utils/sounds_leads.js
var audioCtx$1 = null;
var masterGain$1 = null;
var compressor$1 = null;
var dryBus$1 = null;
var fxBus$1 = null;
var delayNode$1 = null;
var delayFeedback$1 = null;
var delayFilter$1 = null;
var MIN_GAIN$1 = 1e-4;
var safeTime$1 = (time) => Math.max(time, .001);
var silent$1 = (error) => {};
var initAudio$1 = () => {
	if (typeof window === "undefined") return null;
	if (!audioCtx$1) {
		audioCtx$1 = new (window.AudioContext || window.webkitAudioContext)();
		compressor$1 = audioCtx$1.createDynamicsCompressor();
		compressor$1.threshold.value = -18;
		compressor$1.knee.value = 22;
		compressor$1.ratio.value = 5;
		compressor$1.attack.value = .004;
		compressor$1.release.value = .22;
		masterGain$1 = audioCtx$1.createGain();
		masterGain$1.gain.value = .78;
		dryBus$1 = audioCtx$1.createGain();
		dryBus$1.gain.value = 1;
		fxBus$1 = audioCtx$1.createGain();
		fxBus$1.gain.value = .72;
		delayNode$1 = audioCtx$1.createDelay(1.4);
		delayNode$1.delayTime.value = .18;
		delayFeedback$1 = audioCtx$1.createGain();
		delayFeedback$1.gain.value = .28;
		delayFilter$1 = audioCtx$1.createBiquadFilter();
		delayFilter$1.type = "lowpass";
		delayFilter$1.frequency.value = 3200;
		dryBus$1.connect(masterGain$1);
		fxBus$1.connect(delayNode$1);
		delayNode$1.connect(delayFilter$1);
		delayFilter$1.connect(delayFeedback$1);
		delayFeedback$1.connect(delayNode$1);
		delayFilter$1.connect(masterGain$1);
		masterGain$1.connect(compressor$1);
		compressor$1.connect(audioCtx$1.destination);
	}
	if (audioCtx$1.state === "suspended") audioCtx$1.resume().catch(silent$1);
	return audioCtx$1;
};
var createOutput$1 = ({ volume = 1, send = .16, pan = 0 } = {}) => {
	const ctx = initAudio$1();
	if (!ctx) return null;
	const input = ctx.createGain();
	input.gain.value = volume;
	let output = input;
	if (ctx.createStereoPanner) {
		const panner = ctx.createStereoPanner();
		panner.pan.value = pan;
		input.connect(panner);
		output = panner;
	}
	output.connect(dryBus$1);
	if (send > 0) {
		const sendGain = ctx.createGain();
		sendGain.gain.value = send;
		output.connect(sendGain);
		sendGain.connect(fxBus$1);
	}
	return {
		ctx,
		input
	};
};
var envelope$1 = (gainParam, start, attack, hold, release, peak, sustain = peak * .35) => {
	gainParam.cancelScheduledValues(start);
	gainParam.setValueAtTime(MIN_GAIN$1, start);
	gainParam.linearRampToValueAtTime(Math.max(peak, MIN_GAIN$1), start + safeTime$1(attack));
	gainParam.exponentialRampToValueAtTime(Math.max(sustain, MIN_GAIN$1), start + safeTime$1(attack + hold));
	gainParam.exponentialRampToValueAtTime(MIN_GAIN$1, start + safeTime$1(attack + hold + release));
};
var voice$1 = ({ freq, type = "sine", start = 0, attack = .01, hold = .08, release = .35, gain = .32, sustain, detune = 0, destination, filter, bendTo, bendTime = .2 }) => {
	const ctx = initAudio$1();
	if (!ctx || !destination || !freq || freq <= 0) return null;
	const now = ctx.currentTime + start;
	const osc = ctx.createOscillator();
	const gainNode = ctx.createGain();
	const filterNode = filter ? ctx.createBiquadFilter() : null;
	osc.type = type;
	osc.frequency.setValueAtTime(freq, now);
	osc.detune.setValueAtTime(detune, now);
	if (bendTo) osc.frequency.exponentialRampToValueAtTime(Math.max(bendTo, 1), now + safeTime$1(bendTime));
	if (filterNode) {
		filterNode.type = filter.type || "lowpass";
		filterNode.frequency.setValueAtTime(filter.frequency || 2200, now);
		filterNode.Q.value = filter.q || .8;
		if (filter.to) filterNode.frequency.linearRampToValueAtTime(filter.to, now + safeTime$1(filter.time || .35));
		osc.connect(filterNode);
		filterNode.connect(gainNode);
	} else osc.connect(gainNode);
	envelope$1(gainNode.gain, now, attack, hold, release, gain, sustain);
	gainNode.connect(destination);
	osc.start(now);
	osc.stop(now + attack + hold + release + .06);
	return osc;
};
var noiseBurst$1 = ({ start = 0, duration = .16, attack = .004, release = .12, gain = .22, filterType = "bandpass", frequency = 1800, q = 1, output } = {}) => {
	const ctx = initAudio$1();
	if (!ctx || !output) return;
	const now = ctx.currentTime + start;
	const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
	const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < length; i += 1) {
		const fade = 1 - i / length;
		data[i] = (Math.random() * 2 - 1) * fade;
	}
	const source = ctx.createBufferSource();
	source.buffer = buffer;
	const filter = ctx.createBiquadFilter();
	filter.type = filterType;
	filter.frequency.setValueAtTime(frequency, now);
	filter.Q.value = q;
	const gainNode = ctx.createGain();
	envelope$1(gainNode.gain, now, attack, Math.max(duration - release, .01), release, gain, gain * .4);
	source.connect(filter);
	filter.connect(gainNode);
	gainNode.connect(output);
	source.start(now);
	source.stop(now + duration + release + .04);
};
var withSound$1 = (fn) => {
	try {
		fn();
	} catch (error) {
		silent$1(error);
	}
};
var makeSynth = (name, synthFn) => {
	return {
		id: name.toLowerCase().replace(/ /g, "_").replace(/-/g, "_"),
		name,
		play: (freq, options = {}) => withSound$1(() => {
			const out = createOutput$1({
				volume: Math.min(Math.max(options.velocity || 1, .1), 1.4),
				send: options.send ?? .18,
				pan: options.pan ?? 0
			});
			if (!out) return;
			const { ctx, input } = out;
			synthFn(freq, input, options.start || 0, ctx, options);
		})
	};
};
var LEAD_INSTRUMENTS = [
	makeSynth("Super Saw Lead", (freq, input, start) => {
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .02,
			hold: .2,
			release: .4,
			gain: .25,
			sustain: .2,
			detune: 0,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 4500,
				to: 2e3,
				time: .3
			}
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .025,
			hold: .2,
			release: .4,
			gain: .2,
			sustain: .18,
			detune: 15,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 4500,
				to: 2e3,
				time: .3
			}
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .025,
			hold: .2,
			release: .4,
			gain: .2,
			sustain: .18,
			detune: -15,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 4500,
				to: 2e3,
				time: .3
			}
		});
		voice$1({
			freq: freq * 2,
			type: "square",
			start,
			attack: .01,
			hold: .1,
			release: .3,
			gain: .1,
			sustain: .05,
			destination: input
		});
	}),
	makeSynth("Square Sync Lead", (freq, input, start) => {
		voice$1({
			freq,
			type: "square",
			start,
			attack: .01,
			hold: .15,
			release: .3,
			gain: .3,
			sustain: .15,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 3e3
			}
		});
		voice$1({
			freq: freq * 2,
			type: "square",
			start,
			attack: .02,
			hold: .1,
			release: .3,
			gain: .15,
			sustain: .05,
			detune: 5,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 4e3
			}
		});
	}),
	makeSynth("Classic Glide Sine", (freq, input, start) => {
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .05,
			hold: .2,
			release: .5,
			gain: .4,
			sustain: .3,
			destination: input
		});
		voice$1({
			freq: freq * 2,
			type: "sine",
			start: start + .02,
			attack: .05,
			hold: .1,
			release: .4,
			gain: .1,
			sustain: .05,
			destination: input
		});
	}),
	makeSynth("Dirty Pulse Lead", (freq, input, start) => {
		voice$1({
			freq,
			type: "square",
			start,
			attack: .01,
			hold: .2,
			release: .3,
			gain: .3,
			sustain: .2,
			detune: -4,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 2500,
				to: 1500,
				time: .2
			}
		});
		voice$1({
			freq,
			type: "square",
			start,
			attack: .01,
			hold: .2,
			release: .3,
			gain: .3,
			sustain: .2,
			detune: 4,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 2500,
				to: 1500,
				time: .2
			}
		});
		noiseBurst$1({
			start,
			duration: .1,
			gain: .05,
			frequency: 3e3,
			filterType: "highpass",
			output: input
		});
	}),
	makeSynth("Sci Fi Theremin", (freq, input, start, ctx) => {
		const osc = voice$1({
			freq,
			type: "sine",
			start,
			attack: .1,
			hold: .4,
			release: .6,
			gain: .4,
			sustain: .4,
			destination: input
		});
		if (osc && ctx) {
			const now = ctx.currentTime + start;
			const lfo = ctx.createOscillator();
			const lfoGain = ctx.createGain();
			lfo.frequency.setValueAtTime(6, now);
			lfoGain.gain.setValueAtTime(10, now);
			lfo.connect(lfoGain);
			lfoGain.connect(osc.frequency);
			lfo.start(now + .1);
			lfo.stop(now + 1.1);
		}
	}),
	makeSynth("Hard Sync Lead", (freq, input, start) => {
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .01,
			hold: .15,
			release: .3,
			gain: .3,
			sustain: .15,
			destination: input,
			filter: {
				type: "bandpass",
				frequency: 1e3,
				to: 3e3,
				time: .15,
				q: 2
			}
		});
		voice$1({
			freq: freq * 1.5,
			type: "square",
			start,
			attack: .02,
			hold: .1,
			release: .2,
			gain: .15,
			sustain: .05,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 2e3
			}
		});
	}),
	makeSynth("8 Bit Lead", (freq, input, start) => {
		voice$1({
			freq,
			type: "square",
			start,
			attack: .005,
			hold: .1,
			release: .1,
			gain: .25,
			sustain: .1,
			destination: input
		});
		voice$1({
			freq: freq * .5,
			type: "square",
			start,
			attack: .005,
			hold: .1,
			release: .1,
			gain: .15,
			sustain: .05,
			destination: input
		});
	}),
	makeSynth("Laser Pitch Lead", (freq, input, start) => {
		voice$1({
			freq: freq * 2,
			type: "sawtooth",
			start,
			attack: .01,
			hold: .1,
			release: .2,
			gain: .3,
			sustain: .1,
			destination: input,
			bendTo: freq,
			bendTime: .1,
			filter: {
				type: "lowpass",
				frequency: 4e3,
				to: 1e3,
				time: .1
			}
		});
		voice$1({
			freq,
			type: "square",
			start: start + .02,
			attack: .01,
			hold: .15,
			release: .25,
			gain: .2,
			sustain: .1,
			destination: input
		});
	}),
	makeSynth("Warm Analog Pad", (freq, input, start) => {
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .5,
			hold: 1,
			release: 1.5,
			gain: .3,
			sustain: .25,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 800,
				to: 1200,
				time: 1
			}
		});
		voice$1({
			freq: freq * 1.006,
			type: "triangle",
			start,
			attack: .6,
			hold: .9,
			release: 1.4,
			gain: .2,
			sustain: .15,
			detune: 8,
			destination: input
		});
		voice$1({
			freq: freq * .994,
			type: "sawtooth",
			start,
			attack: .7,
			hold: .8,
			release: 1.3,
			gain: .15,
			sustain: .1,
			detune: -8,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 600,
				to: 1e3,
				time: .8
			}
		});
	}),
	makeSynth("Angelic Choir Pad", (freq, input, start) => {
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .3,
			hold: .8,
			release: 1.2,
			gain: .25,
			sustain: .2,
			detune: -4,
			destination: input,
			filter: {
				type: "bandpass",
				frequency: 1200,
				q: 1.5
			}
		});
		voice$1({
			freq: freq * 1.01,
			type: "sine",
			start,
			attack: .35,
			hold: .8,
			release: 1.2,
			gain: .25,
			sustain: .2,
			detune: 4,
			destination: input,
			filter: {
				type: "bandpass",
				frequency: 1800,
				q: 1.5
			}
		});
		voice$1({
			freq: freq * 2,
			type: "triangle",
			start: start + .1,
			attack: .4,
			hold: .6,
			release: 1,
			gain: .1,
			sustain: .08,
			destination: input
		});
	}),
	makeSynth("Dark Space Pad", (freq, input, start) => {
		voice$1({
			freq: freq * .5,
			type: "sawtooth",
			start,
			attack: .8,
			hold: 1.5,
			release: 2,
			gain: .25,
			sustain: .2,
			detune: -6,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 1500,
				to: 400,
				time: 1.5
			}
		});
		voice$1({
			freq: freq * .502,
			type: "sawtooth",
			start,
			attack: .8,
			hold: 1.5,
			release: 2,
			gain: .25,
			sustain: .2,
			detune: 6,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 1500,
				to: 400,
				time: 1.5
			}
		});
		voice$1({
			freq,
			type: "sine",
			start: start + .2,
			attack: 1,
			hold: 1,
			release: 1.5,
			gain: .3,
			sustain: .2,
			destination: input
		});
	}),
	makeSynth("Glassy Pad", (freq, input, start) => {
		voice$1({
			freq: freq * 2,
			type: "triangle",
			start,
			attack: .4,
			hold: 1,
			release: 1.5,
			gain: .15,
			sustain: .1,
			destination: input
		});
		voice$1({
			freq: freq * 3.01,
			type: "sine",
			start,
			attack: .5,
			hold: .8,
			release: 1.2,
			gain: .1,
			sustain: .05,
			destination: input
		});
		voice$1({
			freq: freq * 4.02,
			type: "sine",
			start,
			attack: .6,
			hold: .6,
			release: 1,
			gain: .05,
			sustain: .02,
			destination: input
		});
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .2,
			hold: 1.2,
			release: 1.8,
			gain: .25,
			sustain: .2,
			destination: input
		});
	}),
	makeSynth("Filter Sweep Pad", (freq, input, start) => {
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .1,
			hold: 1,
			release: 1.2,
			gain: .2,
			sustain: .15,
			detune: -5,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 200,
				to: 2500,
				time: 1,
				q: 2
			}
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .1,
			hold: 1,
			release: 1.2,
			gain: .2,
			sustain: .15,
			detune: 5,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 200,
				to: 2500,
				time: 1,
				q: 2
			}
		});
		voice$1({
			freq: freq * .5,
			type: "square",
			start,
			attack: .2,
			hold: .8,
			release: 1,
			gain: .15,
			sustain: .1,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 100,
				to: 1500,
				time: 1.2
			}
		});
	}),
	makeSynth("Frozen Time Pad", (freq, input, start) => {
		voice$1({
			freq,
			type: "sine",
			start,
			attack: 1,
			hold: 2,
			release: 2.5,
			gain: .3,
			sustain: .25,
			detune: -2,
			destination: input
		});
		voice$1({
			freq,
			type: "sine",
			start,
			attack: 1,
			hold: 2,
			release: 2.5,
			gain: .3,
			sustain: .25,
			detune: 2,
			destination: input
		});
		voice$1({
			freq: freq * 2,
			type: "triangle",
			start: start + .5,
			attack: 1.5,
			hold: 1.5,
			release: 2,
			gain: .1,
			sustain: .08,
			destination: input
		});
	}),
	makeSynth("Lush Strings Pad", (freq, input, start) => {
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .4,
			hold: .8,
			release: 1.2,
			gain: .18,
			sustain: .15,
			detune: -7,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 1800
			}
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .4,
			hold: .8,
			release: 1.2,
			gain: .18,
			sustain: .15,
			detune: 7,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 1800
			}
		});
		voice$1({
			freq: freq * 1.002,
			type: "sawtooth",
			start,
			attack: .45,
			hold: .75,
			release: 1.1,
			gain: .15,
			sustain: .12,
			detune: -12,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 2e3
			}
		});
		voice$1({
			freq: freq * .998,
			type: "sawtooth",
			start,
			attack: .45,
			hold: .75,
			release: 1.1,
			gain: .15,
			sustain: .12,
			detune: 12,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 2e3
			}
		});
	}),
	makeSynth("Analog Pluck", (freq, input, start) => {
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .005,
			hold: .05,
			release: .25,
			gain: .35,
			sustain: .05,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 4e3,
				to: 400,
				time: .15,
				q: 1.5
			}
		});
		voice$1({
			freq: freq * .5,
			type: "square",
			start,
			attack: .005,
			hold: .05,
			release: .25,
			gain: .2,
			sustain: .05,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 3e3,
				to: 300,
				time: .15
			}
		});
	}),
	makeSynth("FM Digital Pluck", (freq, input, start) => {
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .005,
			hold: .05,
			release: .3,
			gain: .4,
			sustain: .05,
			destination: input
		});
		voice$1({
			freq: freq * 2,
			type: "triangle",
			start,
			attack: .005,
			hold: .02,
			release: .15,
			gain: .2,
			sustain: .02,
			destination: input,
			bendTo: freq * 1.9,
			bendTime: .05
		});
		voice$1({
			freq: freq * 4.05,
			type: "sine",
			start,
			attack: .005,
			hold: .01,
			release: .1,
			gain: .15,
			sustain: .01,
			destination: input
		});
	}),
	makeSynth("Crystal Harp Pluck", (freq, input, start) => {
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .005,
			hold: .1,
			release: .8,
			gain: .35,
			sustain: .1,
			destination: input
		});
		voice$1({
			freq: freq * 2.02,
			type: "sine",
			start,
			attack: .005,
			hold: .05,
			release: .5,
			gain: .15,
			sustain: .05,
			destination: input
		});
		voice$1({
			freq: freq * 3.03,
			type: "triangle",
			start,
			attack: .005,
			hold: .02,
			release: .3,
			gain: .08,
			sustain: .02,
			destination: input
		});
	}),
	makeSynth("Koto Pluck", (freq, input, start) => {
		noiseBurst$1({
			start,
			duration: .02,
			gain: .08,
			frequency: 4e3,
			filterType: "highpass",
			output: input
		});
		voice$1({
			freq,
			type: "triangle",
			start,
			attack: .005,
			hold: .1,
			release: .6,
			gain: .4,
			sustain: .1,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 2500,
				to: 800,
				time: .3
			}
		});
		voice$1({
			freq: freq * 1.5,
			type: "sine",
			start,
			attack: .005,
			hold: .05,
			release: .4,
			gain: .1,
			sustain: .02,
			destination: input
		});
	}),
	makeSynth("Muted Guitar Pluck", (freq, input, start) => {
		noiseBurst$1({
			start,
			duration: .03,
			gain: .05,
			frequency: 3e3,
			filterType: "bandpass",
			q: 2,
			output: input
		});
		voice$1({
			freq,
			type: "triangle",
			start,
			attack: .005,
			hold: .05,
			release: .15,
			gain: .4,
			sustain: .05,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 1200,
				to: 400,
				time: .1
			}
		});
		voice$1({
			freq: freq * 2,
			type: "sine",
			start,
			attack: .005,
			hold: .02,
			release: .1,
			gain: .15,
			sustain: .02,
			destination: input
		});
	}),
	makeSynth("Wood Marimba Pluck", (freq, input, start) => {
		noiseBurst$1({
			start,
			duration: .02,
			gain: .06,
			frequency: 1500,
			filterType: "bandpass",
			q: 3,
			output: input
		});
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .005,
			hold: .05,
			release: .3,
			gain: .45,
			sustain: .1,
			destination: input
		});
		voice$1({
			freq: freq * 4.2,
			type: "sine",
			start,
			attack: .005,
			hold: .02,
			release: .1,
			gain: .1,
			sustain: .02,
			destination: input
		});
	}),
	makeSynth("Vintage EPiano", (freq, input, start) => {
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .01,
			hold: .1,
			release: .8,
			gain: .35,
			sustain: .15,
			destination: input
		});
		voice$1({
			freq,
			type: "triangle",
			start,
			attack: .01,
			hold: .1,
			release: .6,
			gain: .2,
			sustain: .1,
			destination: input
		});
		voice$1({
			freq: freq * 2,
			type: "sine",
			start,
			attack: .01,
			hold: .05,
			release: .4,
			gain: .1,
			sustain: .05,
			destination: input
		});
		noiseBurst$1({
			start,
			duration: .02,
			gain: .03,
			frequency: 2e3,
			filterType: "lowpass",
			output: input
		});
	}),
	makeSynth("Wurli Keys", (freq, input, start) => {
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .01,
			hold: .1,
			release: .5,
			gain: .2,
			sustain: .1,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 1200,
				to: 400,
				time: .4
			}
		});
		voice$1({
			freq,
			type: "square",
			start,
			attack: .01,
			hold: .1,
			release: .5,
			gain: .15,
			sustain: .08,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 1e3,
				to: 300,
				time: .4
			}
		});
		voice$1({
			freq: freq * 2,
			type: "sine",
			start,
			attack: .01,
			hold: .05,
			release: .3,
			gain: .1,
			sustain: .05,
			destination: input
		});
	}),
	makeSynth("FM Bell Keys", (freq, input, start) => {
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .005,
			hold: .15,
			release: 1.2,
			gain: .35,
			sustain: .15,
			destination: input
		});
		voice$1({
			freq: freq * 2.01,
			type: "triangle",
			start,
			attack: .005,
			hold: .1,
			release: .8,
			gain: .15,
			sustain: .05,
			destination: input
		});
		voice$1({
			freq: freq * 3.5,
			type: "sine",
			start,
			attack: .005,
			hold: .05,
			release: .5,
			gain: .1,
			sustain: .02,
			destination: input
		});
	}),
	makeSynth("Toy Piano Keys", (freq, input, start) => {
		noiseBurst$1({
			start,
			duration: .02,
			gain: .04,
			frequency: 4e3,
			filterType: "bandpass",
			output: input
		});
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .01,
			hold: .05,
			release: .4,
			gain: .3,
			sustain: .05,
			destination: input
		});
		voice$1({
			freq: freq * 2.05,
			type: "sine",
			start,
			attack: .01,
			hold: .02,
			release: .2,
			gain: .1,
			sustain: .02,
			destination: input
		});
	}),
	makeSynth("Funky Clav", (freq, input, start) => {
		voice$1({
			freq,
			type: "square",
			start,
			attack: .005,
			hold: .05,
			release: .2,
			gain: .2,
			sustain: .05,
			destination: input,
			filter: {
				type: "bandpass",
				frequency: 2e3,
				to: 800,
				time: .15,
				q: 2
			}
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .005,
			hold: .05,
			release: .2,
			gain: .2,
			sustain: .05,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 3e3,
				to: 1e3,
				time: .1
			}
		});
		voice$1({
			freq: freq * 2,
			type: "square",
			start,
			attack: .005,
			hold: .02,
			release: .1,
			gain: .1,
			sustain: .02,
			destination: input
		});
	}),
	makeSynth("Rock Organ", (freq, input, start) => {
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .02,
			hold: .4,
			release: .2,
			gain: .3,
			sustain: .25,
			destination: input
		});
		voice$1({
			freq: freq * 2,
			type: "sine",
			start,
			attack: .02,
			hold: .4,
			release: .2,
			gain: .2,
			sustain: .15,
			destination: input
		});
		voice$1({
			freq: freq * 3,
			type: "triangle",
			start,
			attack: .02,
			hold: .4,
			release: .2,
			gain: .15,
			sustain: .1,
			destination: input
		});
		voice$1({
			freq: freq * 4,
			type: "sine",
			start,
			attack: .02,
			hold: .4,
			release: .2,
			gain: .1,
			sustain: .05,
			destination: input
		});
	}),
	makeSynth("Majestic Brass", (freq, input, start) => {
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .1,
			hold: .3,
			release: .4,
			gain: .25,
			sustain: .2,
			detune: -4,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 800,
				to: 2500,
				time: .15
			}
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .12,
			hold: .3,
			release: .4,
			gain: .25,
			sustain: .2,
			detune: 4,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 800,
				to: 2500,
				time: .15
			}
		});
		voice$1({
			freq: freq * .5,
			type: "square",
			start,
			attack: .08,
			hold: .35,
			release: .45,
			gain: .15,
			sustain: .1,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 600,
				to: 1800,
				time: .2
			}
		});
	}),
	makeSynth("Epic Synth Brass", (freq, input, start) => {
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .05,
			hold: .2,
			release: .3,
			gain: .2,
			sustain: .15,
			detune: -10,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 1e3,
				to: 4e3,
				time: .1
			}
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .05,
			hold: .2,
			release: .3,
			gain: .2,
			sustain: .15,
			detune: 10,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 1e3,
				to: 4e3,
				time: .1
			}
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .05,
			hold: .2,
			release: .3,
			gain: .2,
			sustain: .15,
			detune: 0,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 1e3,
				to: 4e3,
				time: .1
			}
		});
	}),
	makeSynth("Soft Horns", (freq, input, start) => {
		voice$1({
			freq,
			type: "triangle",
			start,
			attack: .15,
			hold: .4,
			release: .5,
			gain: .3,
			sustain: .25,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 800,
				to: 1200,
				time: .2
			}
		});
		voice$1({
			freq: freq * 1.01,
			type: "sine",
			start,
			attack: .18,
			hold: .35,
			release: .5,
			gain: .2,
			sustain: .15,
			destination: input
		});
	}),
	makeSynth("Pizzicato Strings", (freq, input, start) => {
		voice$1({
			freq,
			type: "triangle",
			start,
			attack: .005,
			hold: .02,
			release: .1,
			gain: .3,
			sustain: .02,
			destination: input
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .005,
			hold: .02,
			release: .08,
			gain: .15,
			sustain: .01,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 3e3,
				to: 800,
				time: .05
			}
		});
	}),
	makeSynth("Marcato Strings", (freq, input, start) => {
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .05,
			hold: .2,
			release: .3,
			gain: .2,
			sustain: .15,
			detune: -5,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 2e3,
				to: 1e3,
				time: .2
			}
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .06,
			hold: .2,
			release: .3,
			gain: .2,
			sustain: .15,
			detune: 5,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 2e3,
				to: 1e3,
				time: .2
			}
		});
		voice$1({
			freq: freq * .5,
			type: "triangle",
			start,
			attack: .04,
			hold: .25,
			release: .35,
			gain: .2,
			sustain: .15,
			destination: input
		});
	}),
	makeSynth("Cello Section", (freq, input, start) => {
		voice$1({
			freq: freq * .5,
			type: "sawtooth",
			start,
			attack: .15,
			hold: .4,
			release: .6,
			gain: .3,
			sustain: .25,
			detune: -3,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 800,
				to: 1500,
				time: .3
			}
		});
		voice$1({
			freq: freq * .5,
			type: "sawtooth",
			start,
			attack: .18,
			hold: .4,
			release: .6,
			gain: .3,
			sustain: .25,
			detune: 3,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 800,
				to: 1500,
				time: .3
			}
		});
		voice$1({
			freq: freq * .25,
			type: "sine",
			start,
			attack: .1,
			hold: .5,
			release: .7,
			gain: .2,
			sustain: .15,
			destination: input
		});
	}),
	makeSynth("Acid Arp", (freq, input, start) => {
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .005,
			hold: .05,
			release: .15,
			gain: .3,
			sustain: .05,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 4e3,
				to: 300,
				time: .1,
				q: 3
			}
		});
		voice$1({
			freq,
			type: "square",
			start,
			attack: .005,
			hold: .05,
			release: .15,
			gain: .15,
			sustain: .02,
			destination: input,
			filter: {
				type: "lowpass",
				frequency: 4e3,
				to: 300,
				time: .1,
				q: 2
			}
		});
	}),
	makeSynth("Ping Arp", (freq, input, start) => {
		voice$1({
			freq,
			type: "sine",
			start,
			attack: .002,
			hold: .02,
			release: .2,
			gain: .4,
			sustain: .05,
			destination: input
		});
		voice$1({
			freq: freq * 2,
			type: "sine",
			start,
			attack: .002,
			hold: .01,
			release: .1,
			gain: .15,
			sustain: .02,
			destination: input
		});
	}),
	makeSynth("Chiptune Arp", (freq, input, start) => {
		voice$1({
			freq,
			type: "square",
			start,
			attack: .002,
			hold: .05,
			release: .05,
			gain: .25,
			sustain: .1,
			destination: input
		});
		voice$1({
			freq: freq * 1.5,
			type: "square",
			start: start + .02,
			attack: .002,
			hold: .03,
			release: .05,
			gain: .1,
			sustain: .05,
			destination: input
		});
	}),
	makeSynth("Glitch Arp", (freq, input, start) => {
		noiseBurst$1({
			start,
			duration: .05,
			gain: .05,
			frequency: 5e3,
			filterType: "highpass",
			output: input
		});
		voice$1({
			freq,
			type: "sawtooth",
			start,
			attack: .002,
			hold: .02,
			release: .05,
			gain: .2,
			sustain: .05,
			destination: input,
			bendTo: freq * 2,
			bendTime: .05
		});
		voice$1({
			freq: freq * .5,
			type: "square",
			start: start + .05,
			attack: .002,
			hold: .02,
			release: .05,
			gain: .2,
			sustain: .05,
			destination: input
		});
	})
];
//#endregion
//#region src/utils/sounds_drums.js
var audioCtx = null;
var masterGain = null;
var compressor = null;
var dryBus = null;
var fxBus = null;
var delayNode = null;
var delayFeedback = null;
var delayFilter = null;
var MIN_GAIN = 1e-4;
var safeTime = (time) => Math.max(time, .001);
var silent = (error) => {};
var initAudio = () => {
	if (typeof window === "undefined") return null;
	if (!audioCtx) {
		audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		compressor = audioCtx.createDynamicsCompressor();
		compressor.threshold.value = -18;
		compressor.knee.value = 22;
		compressor.ratio.value = 5;
		compressor.attack.value = .004;
		compressor.release.value = .22;
		masterGain = audioCtx.createGain();
		masterGain.gain.value = .78;
		dryBus = audioCtx.createGain();
		dryBus.gain.value = 1;
		fxBus = audioCtx.createGain();
		fxBus.gain.value = .72;
		delayNode = audioCtx.createDelay(1.4);
		delayNode.delayTime.value = .18;
		delayFeedback = audioCtx.createGain();
		delayFeedback.gain.value = .28;
		delayFilter = audioCtx.createBiquadFilter();
		delayFilter.type = "lowpass";
		delayFilter.frequency.value = 3200;
		dryBus.connect(masterGain);
		fxBus.connect(delayNode);
		delayNode.connect(delayFilter);
		delayFilter.connect(delayFeedback);
		delayFeedback.connect(delayNode);
		delayFilter.connect(masterGain);
		masterGain.connect(compressor);
		compressor.connect(audioCtx.destination);
	}
	if (audioCtx.state === "suspended") audioCtx.resume().catch(silent);
	return audioCtx;
};
var createOutput = ({ volume = 1, send = .16, pan = 0 } = {}) => {
	const ctx = initAudio();
	if (!ctx) return null;
	const input = ctx.createGain();
	input.gain.value = volume;
	let output = input;
	if (ctx.createStereoPanner) {
		const panner = ctx.createStereoPanner();
		panner.pan.value = pan;
		input.connect(panner);
		output = panner;
	}
	output.connect(dryBus);
	if (send > 0) {
		const sendGain = ctx.createGain();
		sendGain.gain.value = send;
		output.connect(sendGain);
		sendGain.connect(fxBus);
	}
	return {
		ctx,
		input
	};
};
var envelope = (gainParam, start, attack, hold, release, peak, sustain = peak * .35) => {
	gainParam.cancelScheduledValues(start);
	gainParam.setValueAtTime(MIN_GAIN, start);
	gainParam.linearRampToValueAtTime(Math.max(peak, MIN_GAIN), start + safeTime(attack));
	gainParam.exponentialRampToValueAtTime(Math.max(sustain, MIN_GAIN), start + safeTime(attack + hold));
	gainParam.exponentialRampToValueAtTime(MIN_GAIN, start + safeTime(attack + hold + release));
};
var voice = ({ freq, type = "sine", start = 0, attack = .01, hold = .08, release = .35, gain = .32, sustain, detune = 0, destination, filter, bendTo, bendTime = .2 }) => {
	const ctx = initAudio();
	if (!ctx || !destination || !freq || freq <= 0) return null;
	const now = ctx.currentTime + start;
	const osc = ctx.createOscillator();
	const gainNode = ctx.createGain();
	const filterNode = filter ? ctx.createBiquadFilter() : null;
	osc.type = type;
	osc.frequency.setValueAtTime(freq, now);
	osc.detune.setValueAtTime(detune, now);
	if (bendTo) osc.frequency.exponentialRampToValueAtTime(Math.max(bendTo, 1), now + safeTime(bendTime));
	if (filterNode) {
		filterNode.type = filter.type || "lowpass";
		filterNode.frequency.setValueAtTime(filter.frequency || 2200, now);
		filterNode.Q.value = filter.q || .8;
		if (filter.to) filterNode.frequency.linearRampToValueAtTime(filter.to, now + safeTime(filter.time || .35));
		osc.connect(filterNode);
		filterNode.connect(gainNode);
	} else osc.connect(gainNode);
	envelope(gainNode.gain, now, attack, hold, release, gain, sustain);
	gainNode.connect(destination);
	osc.start(now);
	osc.stop(now + attack + hold + release + .06);
	return osc;
};
var noiseBurst = ({ start = 0, duration = .16, attack = .004, release = .12, gain = .22, filterType = "bandpass", frequency = 1800, q = 1, output } = {}) => {
	const ctx = initAudio();
	if (!ctx || !output) return;
	const now = ctx.currentTime + start;
	const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
	const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < length; i += 1) {
		const fade = 1 - i / length;
		data[i] = (Math.random() * 2 - 1) * fade;
	}
	const source = ctx.createBufferSource();
	source.buffer = buffer;
	const filter = ctx.createBiquadFilter();
	filter.type = filterType;
	filter.frequency.setValueAtTime(frequency, now);
	filter.Q.value = q;
	const gainNode = ctx.createGain();
	envelope(gainNode.gain, now, attack, Math.max(duration - release, .01), release, gain, gain * .4);
	source.connect(filter);
	filter.connect(gainNode);
	gainNode.connect(output);
	source.start(now);
	source.stop(now + duration + release + .04);
};
var withSound = (fn) => {
	try {
		fn();
	} catch (error) {
		silent(error);
	}
};
var playKickTrap1 = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 150,
		type: "sine",
		attack: .005,
		hold: .05,
		release: .8,
		gain: .9,
		destination: out.input,
		bendTo: 45,
		bendTime: .3
	});
	voice({
		freq: 150,
		type: "triangle",
		attack: .001,
		hold: .02,
		release: .1,
		gain: .3,
		destination: out.input,
		bendTo: 50,
		bendTime: .1
	});
});
var playKickTrap2 = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 200,
		type: "sine",
		attack: .001,
		hold: .02,
		release: .25,
		gain: .8,
		destination: out.input,
		bendTo: 55,
		bendTime: .1
	});
	noiseBurst({
		duration: .02,
		attack: .001,
		release: .01,
		gain: .2,
		frequency: 3e3,
		filterType: "highpass",
		output: out.input
	});
});
var playSnareTrap1 = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 220,
		type: "triangle",
		attack: .001,
		hold: .02,
		release: .15,
		gain: .4,
		destination: out.input,
		bendTo: 180,
		bendTime: .05
	});
	noiseBurst({
		duration: .15,
		attack: .001,
		release: .1,
		gain: .4,
		frequency: 2800,
		filterType: "bandpass",
		q: 1.2,
		output: out.input
	});
});
var playSnareTrap2 = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 300,
		type: "sine",
		attack: .001,
		hold: .03,
		release: .2,
		gain: .3,
		destination: out.input,
		bendTo: 220,
		bendTime: .05
	});
	noiseBurst({
		duration: .2,
		attack: .001,
		release: .15,
		gain: .5,
		frequency: 3500,
		filterType: "highpass",
		output: out.input
	});
});
var playHatTrapClosed = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 8e3,
		type: "square",
		attack: .001,
		hold: .01,
		release: .04,
		gain: .05,
		destination: out.input,
		filter: {
			type: "highpass",
			frequency: 7e3
		}
	});
	noiseBurst({
		duration: .05,
		attack: .001,
		release: .04,
		gain: .25,
		frequency: 9e3,
		filterType: "highpass",
		output: out.input
	});
});
var playHatTrapOpen = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 8e3,
		type: "square",
		attack: .005,
		hold: .05,
		release: .3,
		gain: .05,
		destination: out.input,
		filter: {
			type: "highpass",
			frequency: 7e3
		}
	});
	noiseBurst({
		duration: .35,
		attack: .002,
		release: .3,
		gain: .2,
		frequency: 9e3,
		filterType: "highpass",
		output: out.input
	});
});
var playClapTrap = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		0,
		.015,
		.03
	].forEach((startDelay, index) => {
		noiseBurst({
			start: startDelay,
			duration: .1 + index * .02,
			attack: .001,
			release: .1,
			gain: .3 - index * .05,
			frequency: 2500,
			filterType: "bandpass",
			q: 1.5,
			output: out.input
		});
	});
});
var playPercTrapRim = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 650,
		type: "square",
		attack: .001,
		hold: .01,
		release: .05,
		gain: .3,
		destination: out.input,
		filter: {
			type: "bandpass",
			frequency: 1800,
			q: 3
		}
	});
	voice({
		freq: 800,
		type: "triangle",
		attack: .001,
		hold: .02,
		release: .06,
		gain: .2,
		destination: out.input
	});
});
var playKickLofi = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 110,
		type: "sine",
		attack: .01,
		hold: .05,
		release: .3,
		gain: .7,
		destination: out.input,
		bendTo: 50,
		bendTime: .1,
		filter: {
			type: "lowpass",
			frequency: 400
		}
	});
	noiseBurst({
		duration: .05,
		attack: .01,
		release: .04,
		gain: .05,
		frequency: 1e3,
		filterType: "lowpass",
		output: out.input
	});
});
var playSnareLofi = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 180,
		type: "triangle",
		attack: .005,
		hold: .05,
		release: .2,
		gain: .2,
		destination: out.input,
		bendTo: 140,
		bendTime: .1,
		filter: {
			type: "lowpass",
			frequency: 1200
		}
	});
	noiseBurst({
		duration: .2,
		attack: .01,
		release: .15,
		gain: .25,
		frequency: 1800,
		filterType: "bandpass",
		q: .8,
		output: out.input
	});
});
var playHatLofi = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	noiseBurst({
		duration: .08,
		attack: .005,
		release: .06,
		gain: .15,
		frequency: 4e3,
		filterType: "bandpass",
		q: 1.5,
		output: out.input
	});
});
var playClapLofi = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[0, .02].forEach((startDelay) => {
		noiseBurst({
			start: startDelay,
			duration: .15,
			attack: .01,
			release: .1,
			gain: .2,
			frequency: 1500,
			filterType: "bandpass",
			q: 1,
			output: out.input
		});
	});
});
var playPercLofiSnap = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	noiseBurst({
		duration: .05,
		attack: .002,
		release: .04,
		gain: .3,
		frequency: 2500,
		filterType: "bandpass",
		q: 2,
		output: out.input
	});
	voice({
		freq: 2e3,
		type: "sine",
		attack: .002,
		hold: .01,
		release: .03,
		gain: .1,
		destination: out.input
	});
});
var playPercLofiClick = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	noiseBurst({
		duration: .015,
		attack: .001,
		release: .01,
		gain: .15,
		frequency: 5e3,
		filterType: "highpass",
		output: out.input
	});
	voice({
		freq: 1200,
		type: "square",
		attack: .001,
		hold: .005,
		release: .01,
		gain: .05,
		destination: out.input
	});
});
var playTomLofi = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 120,
		type: "sine",
		attack: .01,
		hold: .1,
		release: .4,
		gain: .6,
		destination: out.input,
		bendTo: 80,
		bendTime: .15,
		filter: {
			type: "lowpass",
			frequency: 600
		}
	});
});
var playSfxLofiVinyl = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	noiseBurst({
		duration: .4,
		attack: .05,
		release: .2,
		gain: .08,
		frequency: 1500,
		filterType: "highpass",
		output: out.input
	});
	noiseBurst({
		duration: .3,
		attack: .1,
		release: .1,
		gain: .05,
		frequency: 800,
		filterType: "lowpass",
		output: out.input
	});
});
var playKickTechno1 = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 160,
		type: "sine",
		attack: .001,
		hold: .03,
		release: .25,
		gain: .8,
		destination: out.input,
		bendTo: 40,
		bendTime: .1
	});
	voice({
		freq: 160,
		type: "square",
		attack: .001,
		hold: .02,
		release: .1,
		gain: .15,
		destination: out.input,
		filter: {
			type: "lowpass",
			frequency: 400
		}
	});
});
var playKickTechno2 = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 90,
		type: "sine",
		attack: .01,
		hold: .2,
		release: .5,
		gain: .7,
		destination: out.input,
		bendTo: 45,
		bendTime: .2
	});
	noiseBurst({
		duration: .4,
		attack: .05,
		release: .3,
		gain: .05,
		frequency: 200,
		filterType: "lowpass",
		output: out.input
	});
});
var playSnareTechno = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 200,
		type: "triangle",
		attack: .001,
		hold: .03,
		release: .15,
		gain: .25,
		destination: out.input,
		bendTo: 150,
		bendTime: .05
	});
	noiseBurst({
		duration: .2,
		attack: .001,
		release: .15,
		gain: .4,
		frequency: 2500,
		filterType: "highpass",
		output: out.input
	});
});
var playHatTechnoClosed = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		2.1,
		3.2,
		4.3
	].forEach((ratio) => {
		voice({
			freq: 200 * ratio,
			type: "square",
			attack: .001,
			hold: .01,
			release: .05,
			gain: .03,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 6e3
			}
		});
	});
	noiseBurst({
		duration: .06,
		attack: .001,
		release: .05,
		gain: .2,
		frequency: 8e3,
		filterType: "highpass",
		output: out.input
	});
});
var playHatTechnoOpen = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		2.1,
		3.2,
		4.3
	].forEach((ratio) => {
		voice({
			freq: 200 * ratio,
			type: "square",
			attack: .002,
			hold: .05,
			release: .25,
			gain: .02,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 6e3
			}
		});
	});
	noiseBurst({
		duration: .3,
		attack: .002,
		release: .25,
		gain: .15,
		frequency: 8e3,
		filterType: "highpass",
		output: out.input
	});
});
var playClapTechno = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		0,
		.01,
		.025
	].forEach((startDelay, index) => {
		noiseBurst({
			start: startDelay,
			duration: .15,
			attack: .001,
			release: .12,
			gain: .3 - index * .05,
			frequency: 2200,
			filterType: "highpass",
			output: out.input
		});
	});
});
var playTomTechno = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 130,
		type: "sine",
		attack: .002,
		hold: .05,
		release: .3,
		gain: .6,
		destination: out.input,
		bendTo: 70,
		bendTime: .1
	});
	voice({
		freq: 130,
		type: "square",
		attack: .002,
		hold: .02,
		release: .15,
		gain: .1,
		destination: out.input,
		filter: {
			type: "lowpass",
			frequency: 500
		}
	});
});
var playCymbalTechno = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		1.5,
		2.3,
		3.1,
		4.5,
		5.7
	].forEach((ratio) => {
		voice({
			freq: 180 * ratio,
			type: "square",
			attack: .005,
			hold: .1,
			release: .6,
			gain: .02,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 5e3
			}
		});
	});
	noiseBurst({
		duration: .7,
		attack: .005,
		release: .6,
		gain: .15,
		frequency: 7e3,
		filterType: "highpass",
		output: out.input
	});
});
var playKickAcoustic1 = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 120,
		type: "sine",
		attack: .002,
		hold: .03,
		release: .35,
		gain: .6,
		destination: out.input,
		bendTo: 45,
		bendTime: .1
	});
	voice({
		freq: 150,
		type: "triangle",
		attack: .002,
		hold: .02,
		release: .15,
		gain: .2,
		destination: out.input,
		bendTo: 60,
		bendTime: .05
	});
	noiseBurst({
		duration: .02,
		attack: .001,
		release: .015,
		gain: .1,
		frequency: 3e3,
		filterType: "bandpass",
		q: 1,
		output: out.input
	});
});
var playSnareAcoustic1 = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 190,
		type: "sine",
		attack: .002,
		hold: .04,
		release: .15,
		gain: .3,
		destination: out.input,
		bendTo: 160,
		bendTime: .05
	});
	voice({
		freq: 320,
		type: "triangle",
		attack: .002,
		hold: .02,
		release: .25,
		gain: .1,
		destination: out.input
	});
	noiseBurst({
		duration: .25,
		attack: .005,
		release: .2,
		gain: .35,
		frequency: 2400,
		filterType: "bandpass",
		q: .8,
		output: out.input
	});
});
var playHatAcousticClosed = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		2.5,
		3.8,
		4.9,
		6.2
	].forEach((ratio) => {
		voice({
			freq: 150 * ratio,
			type: "square",
			attack: .001,
			hold: .01,
			release: .06,
			gain: .02,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 6e3
			}
		});
	});
	noiseBurst({
		duration: .06,
		attack: .001,
		release: .05,
		gain: .15,
		frequency: 9500,
		filterType: "highpass",
		output: out.input
	});
});
var playHatAcousticOpen = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		2.5,
		3.8,
		4.9,
		6.2,
		7.5
	].forEach((ratio) => {
		voice({
			freq: 150 * ratio,
			type: "square",
			attack: .005,
			hold: .1,
			release: .35,
			gain: .015,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 5e3
			}
		});
	});
	noiseBurst({
		duration: .45,
		attack: .005,
		release: .35,
		gain: .18,
		frequency: 8e3,
		filterType: "highpass",
		output: out.input
	});
});
var playTomAcousticHigh = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 150,
		type: "sine",
		attack: .004,
		hold: .06,
		release: .35,
		gain: .45,
		destination: out.input,
		bendTo: 100,
		bendTime: .1
	});
	voice({
		freq: 220,
		type: "triangle",
		attack: .003,
		hold: .03,
		release: .15,
		gain: .15,
		destination: out.input,
		bendTo: 130,
		bendTime: .08
	});
	noiseBurst({
		duration: .04,
		gain: .05,
		frequency: 2e3,
		filterType: "bandpass",
		q: 1,
		output: out.input
	});
});
var playTomAcousticLow = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 90,
		type: "sine",
		attack: .005,
		hold: .08,
		release: .45,
		gain: .5,
		destination: out.input,
		bendTo: 60,
		bendTime: .15
	});
	voice({
		freq: 140,
		type: "triangle",
		attack: .003,
		hold: .04,
		release: .2,
		gain: .15,
		destination: out.input,
		bendTo: 80,
		bendTime: .1
	});
	noiseBurst({
		duration: .05,
		gain: .05,
		frequency: 1500,
		filterType: "bandpass",
		q: 1,
		output: out.input
	});
});
var playCymbalAcousticRide = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		2.2,
		3.5,
		4.8,
		6.1,
		7.5
	].forEach((ratio) => {
		voice({
			freq: 280 * ratio,
			type: "square",
			attack: .002,
			hold: .05,
			release: 1.5,
			gain: .01,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 5e3
			}
		});
	});
	voice({
		freq: 3200,
		type: "sine",
		attack: .001,
		hold: .01,
		release: .3,
		gain: .05,
		destination: out.input
	});
	noiseBurst({
		duration: 1.5,
		attack: .005,
		release: 1.2,
		gain: .08,
		frequency: 7e3,
		filterType: "highpass",
		output: out.input
	});
});
var playCymbalAcousticCrash = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		1.8,
		2.4,
		3.1,
		4,
		5.2,
		6.5,
		7.8,
		9.1
	].forEach((ratio, index) => {
		voice({
			freq: 130 * ratio,
			type: "square",
			start: index * .001,
			attack: .005,
			hold: .1,
			release: 1.2 + index * .1,
			gain: .015,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 4e3
			}
		});
	});
	noiseBurst({
		duration: 1.5,
		attack: .005,
		release: 1.2,
		gain: .2,
		frequency: 8e3,
		filterType: "highpass",
		output: out.input
	});
	noiseBurst({
		duration: 1,
		attack: .01,
		release: .8,
		gain: .1,
		frequency: 4e3,
		filterType: "bandpass",
		q: .5,
		output: out.input
	});
});
var playKickGlitch = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 200,
		type: "square",
		attack: .001,
		hold: .01,
		release: .1,
		gain: .8,
		destination: out.input,
		bendTo: 20,
		bendTime: .05,
		filter: {
			type: "lowpass",
			frequency: 800
		}
	});
	noiseBurst({
		duration: .02,
		attack: .001,
		release: .01,
		gain: .4,
		frequency: 1e3,
		filterType: "bandpass",
		q: 5,
		output: out.input
	});
});
var playSnareGlitch = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 600,
		type: "sine",
		attack: .001,
		hold: .01,
		release: .1,
		gain: .4,
		destination: out.input,
		bendTo: 100,
		bendTime: .05
	});
	noiseBurst({
		duration: .1,
		attack: .001,
		release: .05,
		gain: .5,
		frequency: 4e3,
		filterType: "bandpass",
		q: .5,
		output: out.input
	});
	voice({
		freq: 1200,
		type: "sawtooth",
		attack: .001,
		hold: .01,
		release: .05,
		gain: .2,
		destination: out.input,
		bendTo: 200,
		bendTime: .02
	});
});
var playHatGlitch = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 5e3,
		type: "triangle",
		attack: .001,
		hold: .01,
		release: .05,
		gain: .1,
		destination: out.input,
		bendTo: 8e3,
		bendTime: .02
	});
	noiseBurst({
		duration: .04,
		attack: .001,
		release: .02,
		gain: .3,
		frequency: 6e3,
		filterType: "bandpass",
		q: 5,
		output: out.input
	});
});
var playClapGlitch = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		0,
		.005,
		.01,
		.015,
		.02
	].forEach((startDelay, index) => {
		noiseBurst({
			start: startDelay,
			duration: .03,
			attack: .001,
			release: .02,
			gain: .4 - index * .05,
			frequency: 3e3 + index * 500,
			filterType: "highpass",
			output: out.input
		});
	});
});
var playPercGlitchZap = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 2e3,
		type: "sawtooth",
		attack: .001,
		hold: .02,
		release: .1,
		gain: .3,
		destination: out.input,
		bendTo: 100,
		bendTime: .05,
		filter: {
			type: "lowpass",
			frequency: 4e3,
			to: 500,
			time: .05
		}
	});
});
var playPercGlitchBloop = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 400,
		type: "sine",
		attack: .001,
		hold: .05,
		release: .1,
		gain: .5,
		destination: out.input,
		bendTo: 800,
		bendTime: .05
	});
	voice({
		freq: 400,
		type: "square",
		attack: .001,
		hold: .02,
		release: .05,
		gain: .1,
		destination: out.input,
		filter: {
			type: "lowpass",
			frequency: 1200
		}
	});
});
var playSfxGlitchError = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 150,
		type: "sawtooth",
		attack: .01,
		hold: .1,
		release: .1,
		gain: .3,
		destination: out.input,
		detune: 50
	});
	voice({
		freq: 155,
		type: "square",
		attack: .01,
		hold: .1,
		release: .1,
		gain: .3,
		destination: out.input,
		detune: -50
	});
	noiseBurst({
		duration: .15,
		attack: .01,
		release: .1,
		gain: .2,
		frequency: 2e3,
		filterType: "bandpass",
		q: 10,
		output: out.input
	});
});
var playSfxGlitchReverse = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	noiseBurst({
		duration: .25,
		attack: .2,
		release: .01,
		gain: .3,
		frequency: 5e3,
		filterType: "lowpass",
		output: out.input
	});
	voice({
		freq: 100,
		type: "sine",
		attack: .2,
		hold: .01,
		release: .01,
		gain: .4,
		destination: out.input,
		bendTo: 1e3,
		bendTime: .2
	});
});
var NEW_DRUMS = [
	{
		id: "kick_trap1",
		short: "KCKT",
		name: "Trap Kick 1",
		hue: "#ef4444",
		play: playKickTrap1
	},
	{
		id: "kick_trap2",
		short: "KCK2",
		name: "Trap Kick 2",
		hue: "#dc2626",
		play: playKickTrap2
	},
	{
		id: "snare_trap1",
		short: "SNRT",
		name: "Trap Snare 1",
		hue: "#f97316",
		play: playSnareTrap1
	},
	{
		id: "snare_trap2",
		short: "SNR2",
		name: "Trap Snare 2",
		hue: "#ea580c",
		play: playSnareTrap2
	},
	{
		id: "hat_trap_closed",
		short: "HHTC",
		name: "Trap Hat Closed",
		hue: "#eab308",
		play: playHatTrapClosed
	},
	{
		id: "hat_trap_open",
		short: "HHTO",
		name: "Trap Hat Open",
		hue: "#ca8a04",
		play: playHatTrapOpen
	},
	{
		id: "clap_trap",
		short: "CLPT",
		name: "Trap Clap",
		hue: "#84cc16",
		play: playClapTrap
	},
	{
		id: "perc_trap_rim",
		short: "PRCT",
		name: "Trap Rim",
		hue: "#65a30d",
		play: playPercTrapRim
	},
	{
		id: "kick_lofi",
		short: "KCKL",
		name: "Lo-Fi Kick",
		hue: "#10b981",
		play: playKickLofi
	},
	{
		id: "snare_lofi",
		short: "SNRL",
		name: "Lo-Fi Snare",
		hue: "#059669",
		play: playSnareLofi
	},
	{
		id: "hat_lofi",
		short: "HHTL",
		name: "Lo-Fi Hat",
		hue: "#06b6d4",
		play: playHatLofi
	},
	{
		id: "clap_lofi",
		short: "CLPL",
		name: "Lo-Fi Clap",
		hue: "#0891b2",
		play: playClapLofi
	},
	{
		id: "perc_lofi_snap",
		short: "SNPL",
		name: "Lo-Fi Snap",
		hue: "#3b82f6",
		play: playPercLofiSnap
	},
	{
		id: "perc_lofi_click",
		short: "CLCK",
		name: "Lo-Fi Click",
		hue: "#2563eb",
		play: playPercLofiClick
	},
	{
		id: "tom_lofi",
		short: "TOML",
		name: "Lo-Fi Tom",
		hue: "#6366f1",
		play: playTomLofi
	},
	{
		id: "sfx_lofi_vinyl",
		short: "VNYL",
		name: "Lo-Fi Vinyl",
		hue: "#4f46e5",
		play: playSfxLofiVinyl
	},
	{
		id: "kick_techno1",
		short: "KCKC",
		name: "Techno Kick 1",
		hue: "#8b5cf6",
		play: playKickTechno1
	},
	{
		id: "kick_techno2",
		short: "KCKD",
		name: "Techno Kick Deep",
		hue: "#7c3aed",
		play: playKickTechno2
	},
	{
		id: "snare_techno",
		short: "SNRC",
		name: "Techno Snare",
		hue: "#d946ef",
		play: playSnareTechno
	},
	{
		id: "hat_techno_closed",
		short: "HHCC",
		name: "Techno Hat Closed",
		hue: "#c026d3",
		play: playHatTechnoClosed
	},
	{
		id: "hat_techno_open",
		short: "HHCO",
		name: "Techno Hat Open",
		hue: "#ec4899",
		play: playHatTechnoOpen
	},
	{
		id: "clap_techno",
		short: "CLPC",
		name: "Techno Clap",
		hue: "#db2777",
		play: playClapTechno
	},
	{
		id: "tom_techno",
		short: "TOMC",
		name: "Techno Tom",
		hue: "#f43f5e",
		play: playTomTechno
	},
	{
		id: "cymbal_techno",
		short: "CYMC",
		name: "Techno Cymbal",
		hue: "#e11d48",
		play: playCymbalTechno
	},
	{
		id: "kick_acoustic1",
		short: "KCKA",
		name: "Acoustic Kick",
		hue: "#fda4af",
		play: playKickAcoustic1
	},
	{
		id: "snare_acoustic1",
		short: "SNRA",
		name: "Acoustic Snare",
		hue: "#f87171",
		play: playSnareAcoustic1
	},
	{
		id: "hat_acoustic_closed",
		short: "HHAC",
		name: "Acoustic Hat Closed",
		hue: "#fbbf24",
		play: playHatAcousticClosed
	},
	{
		id: "hat_acoustic_open",
		short: "HHAO",
		name: "Acoustic Hat Open",
		hue: "#f59e0b",
		play: playHatAcousticOpen
	},
	{
		id: "tom_acoustic_high",
		short: "TOMA",
		name: "Acoustic Tom High",
		hue: "#34d399",
		play: playTomAcousticHigh
	},
	{
		id: "tom_acoustic_low",
		short: "TOMB",
		name: "Acoustic Tom Low",
		hue: "#10b981",
		play: playTomAcousticLow
	},
	{
		id: "cymbal_acoustic_ride",
		short: "RIDE",
		name: "Acoustic Ride",
		hue: "#60a5fa",
		play: playCymbalAcousticRide
	},
	{
		id: "cymbal_acoustic_crash",
		short: "CRSH",
		name: "Acoustic Crash",
		hue: "#3b82f6",
		play: playCymbalAcousticCrash
	},
	{
		id: "kick_glitch",
		short: "KCKG",
		name: "Glitch Kick",
		hue: "#94a3b8",
		play: playKickGlitch
	},
	{
		id: "snare_glitch",
		short: "SNRG",
		name: "Glitch Snare",
		hue: "#64748b",
		play: playSnareGlitch
	},
	{
		id: "hat_glitch",
		short: "HHTG",
		name: "Glitch Hat",
		hue: "#cbd5e1",
		play: playHatGlitch
	},
	{
		id: "clap_glitch",
		short: "CLPG",
		name: "Glitch Clap",
		hue: "#475569",
		play: playClapGlitch
	},
	{
		id: "perc_glitch_zap",
		short: "ZAPG",
		name: "Glitch Zap",
		hue: "#fcd34d",
		play: playPercGlitchZap
	},
	{
		id: "perc_glitch_bloop",
		short: "BLOP",
		name: "Glitch Bloop",
		hue: "#6ee7b7",
		play: playPercGlitchBloop
	},
	{
		id: "sfx_glitch_error",
		short: "ERRG",
		name: "Glitch Error",
		hue: "#fca5a5",
		play: playSfxGlitchError
	},
	{
		id: "sfx_glitch_reverse",
		short: "REVG",
		name: "Glitch Reverse",
		hue: "#93c5fd",
		play: playSfxGlitchReverse
	}
];
//#endregion
//#region src/components/BeatMaker/MicSampler.jsx
function MicSampler({ onSamplesUpdate, bpm = 120 }) {
	const [samples, setSamples] = (0, import_react.useState)([]);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const [editingSample, setEditingSample] = (0, import_react.useState)(null);
	const mediaRecorderRef = (0, import_react.useRef)(null);
	const audioChunksRef = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		onSamplesUpdate(samples);
	}, [samples, onSamplesUpdate]);
	const startRecording = async () => {
		try {
			playPop();
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);
			audioChunksRef.current = [];
			mediaRecorderRef.current.ondataavailable = (e) => {
				if (e.data.size > 0) audioChunksRef.current.push(e.data);
			};
			mediaRecorderRef.current.onstop = processAudio;
			mediaRecorderRef.current.start();
			setStatus("recording");
		} catch (err) {
			setStatus("error");
			setErrorMsg("Bitte Mikrofon-Zugriff erlauben!");
		}
	};
	const stopRecording = () => {
		if (mediaRecorderRef.current && status === "recording") {
			playPop();
			mediaRecorderRef.current.stop();
			mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
			setStatus("processing");
		}
	};
	const processAudio = async () => {
		try {
			const arrayBuffer = await new Blob(audioChunksRef.current, { type: "audio/webm" }).arrayBuffer();
			const audioBuffer = await getAudioContext().decodeAudioData(arrayBuffer);
			const newSample = {
				id: `mic_${Date.now()}`,
				name: `Sample ${samples.length + 1}`,
				buffer: audioBuffer,
				originalDuration: audioBuffer.duration,
				trimStart: 0,
				trimEnd: audioBuffer.duration,
				waveform: generateWaveform(audioBuffer, 50),
				color: [
					"bg-teal-500",
					"bg-rose-500",
					"bg-amber-500",
					"bg-purple-500"
				][samples.length % 4],
				shadow: [
					"shadow-teal-500/50",
					"shadow-rose-500/50",
					"shadow-amber-500/50",
					"shadow-purple-500/50"
				][samples.length % 4]
			};
			setSamples((prev) => [...prev, newSample]);
			setStatus("idle");
		} catch (err) {
			setStatus("error");
			setErrorMsg("Fehler beim Verarbeiten.");
		}
	};
	const deleteSample = (id) => {
		playPop();
		setSamples((prev) => prev.filter((s) => s.id !== id));
	};
	const copySample = (sample) => {
		playPop();
		const copy = {
			...sample,
			id: `mic_${Date.now()}`,
			name: `${sample.name} (Kopie)`
		};
		setSamples((prev) => [...prev, copy]);
	};
	const playPreview = (sample) => {
		playMicSample(sample.buffer, sample.trimStart, sample.trimEnd - sample.trimStart);
	};
	const saveEdit = (updatedSample) => {
		playPop();
		setSamples((prev) => prev.map((s) => s.id === updatedSample.id ? updatedSample : s));
		setEditingSample(null);
	};
	const autoSyncSample = async (sample) => {
		setStatus("processing");
		try {
			const buffer = sample.buffer;
			const data = buffer.getChannelData(0);
			const threshold = .015;
			let startIdx = 0;
			for (let i = 0; i < data.length; i++) if (Math.abs(data[i]) > threshold) {
				startIdx = i;
				break;
			}
			let endIdx = data.length - 1;
			for (let i = data.length - 1; i >= 0; i--) if (Math.abs(data[i]) > threshold) {
				endIdx = i;
				break;
			}
			const trimStart = Math.max(0, startIdx / buffer.sampleRate - .05);
			const duration = Math.min(buffer.duration, endIdx / buffer.sampleRate + .05) - trimStart;
			const beatSecs = 60 / bpm;
			const possibleTargets = [
				beatSecs,
				beatSecs * 2,
				beatSecs * 4,
				beatSecs * 8
			];
			let targetDuration = possibleTargets[0];
			let minDiff = Math.abs(duration - targetDuration);
			for (let i = 1; i < possibleTargets.length; i++) {
				const diff = Math.abs(duration - possibleTargets[i]);
				if (diff < minDiff) {
					minDiff = diff;
					targetDuration = possibleTargets[i];
				}
			}
			const audioCtx = getAudioContext();
			const trimmedLen = Math.floor(duration * audioCtx.sampleRate);
			const trimmedBuffer = audioCtx.createBuffer(buffer.numberOfChannels, trimmedLen, audioCtx.sampleRate);
			for (let c = 0; c < buffer.numberOfChannels; c++) {
				const inData = buffer.getChannelData(c);
				const outData = trimmedBuffer.getChannelData(c);
				const offset = Math.floor(trimStart * audioCtx.sampleRate);
				for (let i = 0; i < trimmedLen; i++) if (offset + i < inData.length) outData[i] = inData[offset + i];
			}
			const stretchedBuffer = await timeStretchBuffer(audioCtx, trimmedBuffer, targetDuration);
			setEditingSample((prev) => ({
				...prev,
				buffer: stretchedBuffer,
				originalDuration: stretchedBuffer.duration,
				trimStart: 0,
				trimEnd: stretchedBuffer.duration,
				waveform: generateWaveform(stretchedBuffer, 50)
			}));
			setStatus("idle");
			playPop();
		} catch (err) {
			console.error(err);
			setStatus("error");
			setErrorMsg("Time-Stretch Error");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-4 items-stretch h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-slate-800/80 p-4 rounded-3xl border border-slate-700 shadow-xl flex flex-col items-center justify-center gap-3 w-40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-hand text-xl font-bold tracking-wider uppercase text-center w-full min-h-[1.5rem] mb-1",
					children: [
						status === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white",
							children: "Studio"
						}),
						status === "recording" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-red-400 animate-pulse",
							children: "Aufnahme..."
						}),
						status === "processing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-amber-400",
							children: "Lädt..."
						}),
						status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-red-500 text-xs",
							children: errorMsg
						})
					]
				}), status !== "recording" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					whileHover: { scale: 1.05 },
					whileTap: { scale: .95 },
					onClick: startRecording,
					className: "w-16 h-16 bg-red-500 rounded-full border-4 border-slate-700 shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center justify-center transition-colors hover:bg-red-400",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5 h-5 bg-white rounded-full" })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					whileHover: { scale: 1.05 },
					whileTap: { scale: .95 },
					onClick: stopRecording,
					className: "w-16 h-16 bg-slate-700 rounded-lg border-4 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center animate-pulse",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5 h-5 bg-red-500 rounded-sm" })
				})]
			}),
			samples.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2 max-h-32 overflow-y-auto w-64 pr-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: samples.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					layout: true,
					initial: {
						opacity: 0,
						x: -20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					exit: {
						opacity: 0,
						scale: .8
					},
					className: "flex items-center justify-between bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-inner",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 overflow-hidden cursor-pointer",
						onClick: () => playPreview(sample),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-3 h-3 rounded-full ${sample.color} shrink-0` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sans text-xs font-bold text-slate-300 truncate",
							children: sample.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 shrink-0 ml-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => playPreview(sample),
								className: "text-emerald-400 hover:text-emerald-300 text-xs p-1",
								children: "▶"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditingSample(sample),
								className: "text-sky-400 hover:text-sky-300 text-xs p-1",
								children: "✂️"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => copySample(sample),
								className: "text-amber-400 hover:text-amber-300 text-xs p-1",
								children: "📄"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => deleteSample(sample.id),
								className: "text-red-400 hover:text-red-300 text-xs p-1",
								children: "✖"
							})
						]
					})]
				}, sample.id)) })
			}),
			editingSample && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						scale: .9,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					className: "bg-slate-800 rounded-3xl p-8 border-4 border-slate-700 shadow-2xl w-full max-w-2xl relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-hand text-4xl font-bold text-white mb-6",
							children: ["Sample Editor: ", editingSample.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-32 bg-slate-900 rounded-xl border-2 border-slate-700 p-4 relative flex items-center justify-between gap-[2px]",
							children: editingSample.waveform.map((val, i) => {
								const pct = i / 50;
								const isActive = pct >= editingSample.trimStart / editingSample.originalDuration && pct <= editingSample.trimEnd / editingSample.originalDuration;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1 rounded-sm transition-all",
									style: {
										height: `${Math.max(5, val * 100)}%`,
										backgroundColor: isActive ? "#38bdf8" : "#334155"
									}
								}, i);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-slate-400 font-sans text-xs font-bold uppercase tracking-widest mb-2 block",
								children: [
									"Start (",
									editingSample.trimStart.toFixed(2),
									"s)"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "0",
								max: editingSample.trimEnd - .05,
								step: "0.01",
								value: editingSample.trimStart,
								onChange: (e) => setEditingSample((prev) => ({
									...prev,
									trimStart: parseFloat(e.target.value)
								})),
								className: "w-full accent-emerald-500"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-slate-400 font-sans text-xs font-bold uppercase tracking-widest mb-2 block",
								children: [
									"Ende (",
									editingSample.trimEnd.toFixed(2),
									"s)"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: editingSample.trimStart + .05,
								max: editingSample.originalDuration,
								step: "0.01",
								value: editingSample.trimEnd,
								onChange: (e) => setEditingSample((prev) => ({
									...prev,
									trimEnd: parseFloat(e.target.value)
								})),
								className: "w-full accent-rose-500"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => autoSyncSample(editingSample),
								className: "px-4 py-3 bg-fuchsia-600/20 text-fuchsia-300 rounded-xl font-bold border border-fuchsia-500/50 hover:bg-fuchsia-500/30 transition-colors flex items-center gap-2",
								children: "🪄 Auto-Sync & Stretch"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => playPreview(editingSample),
										className: "px-6 py-3 bg-slate-700 text-white rounded-xl font-bold shadow-md hover:bg-slate-600 transition-colors",
										children: "▶ Vorschau"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setEditingSample(null),
										className: "px-6 py-3 bg-transparent text-slate-400 rounded-xl font-bold hover:text-white transition-colors",
										children: "Abbrechen"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => saveEdit(editingSample),
										className: "px-8 py-3 bg-sky-500 text-white rounded-xl font-bold shadow-lg hover:bg-sky-400 shadow-sky-500/40 transition-colors",
										children: "Speichern"
									})
								]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
//#region src/components/BeatMaker/BeatMaker.jsx
var DEFAULT_STEPS = 16;
var MAX_TRACKS = 12;
var CURRENT_STORAGE_KEY = "faskar-flow-beat-current-v2";
var PROJECT_STORAGE_KEY = "faskar-flow-beat-projects-v2";
var DRUM_SOUNDS = [
	...NEW_DRUMS,
	{
		id: "kick_deep",
		name: "Kick tief",
		short: "Kick",
		hue: "#6366f1",
		play: (track) => playKick(track)
	},
	{
		id: "kick_edm",
		name: "EDM Kick",
		short: "Kick E",
		hue: "#4f46e5",
		play: (track) => playKickEDM(track)
	},
	{
		id: "kick_sub",
		name: "Deep Sub Kick",
		short: "Kick S",
		hue: "#4338ca",
		play: (track) => playKickDeep(track)
	},
	{
		id: "kick_ac",
		name: "Akustik Kick",
		short: "Kick A",
		hue: "#d97706",
		play: (track) => playKickAcoustic(track)
	},
	{
		id: "snare_snap",
		name: "Snare knackig",
		short: "Snare",
		hue: "#ec4899",
		play: (track) => playSnare(track)
	},
	{
		id: "snare_clap",
		name: "Snare Clap",
		short: "Sn Clap",
		hue: "#be185d",
		play: (track) => playSnareClap(track)
	},
	{
		id: "snare_ac",
		name: "Akustik Snare",
		short: "Snare A",
		hue: "#b45309",
		play: (track) => playSnareAcoustic(track)
	},
	{
		id: "clap",
		name: "Clap",
		short: "Clap",
		hue: "#fb7185",
		play: (track) => playClap(track)
	},
	{
		id: "rim",
		name: "Rimshot",
		short: "Rim",
		hue: "#f97316",
		play: (track) => playRim(track)
	},
	{
		id: "hat_closed",
		name: "Hi-Hat zu",
		short: "Hat",
		hue: "#facc15",
		play: (track) => playHiHat(track)
	},
	{
		id: "hat_edm",
		name: "EDM Hat",
		short: "Hat E",
		hue: "#eab308",
		play: (track) => playHatEDM(track)
	},
	{
		id: "hat_ac_closed",
		name: "Akustik Hat",
		short: "Hat A",
		hue: "#fbbf24",
		play: (track) => playHiHatClosedAcoustic(track)
	},
	{
		id: "hat_open",
		name: "Hi-Hat offen",
		short: "Open",
		hue: "#fde047",
		play: (track) => playHiHat({
			...track,
			open: true
		})
	},
	{
		id: "shaker",
		name: "Shaker",
		short: "Shake",
		hue: "#a3e635",
		play: (track) => playShaker(track)
	},
	{
		id: "tom_low",
		name: "Tom tief",
		short: "Tom L",
		hue: "#14b8a6",
		play: (track) => playTom({
			...track,
			freq: 122
		})
	},
	{
		id: "tom_ac_low",
		name: "Ak. Tom Tief",
		short: "Tom LA",
		hue: "#0f766e",
		play: (track) => playTomLowAcoustic(track)
	},
	{
		id: "tom_mid",
		name: "Tom mittel",
		short: "Tom M",
		hue: "#2dd4bf",
		play: (track) => playTom({
			...track,
			freq: 172
		})
	},
	{
		id: "tom_ac_high",
		name: "Ak. Tom Hoch",
		short: "Tom HA",
		hue: "#0d9488",
		play: (track) => playTomHighAcoustic(track)
	},
	{
		id: "crash",
		name: "Crash",
		short: "Crash",
		hue: "#0ea5e9",
		play: (track) => playCrash(track)
	},
	{
		id: "crash_ac",
		name: "Akustik Crash",
		short: "Crash A",
		hue: "#0284c7",
		play: (track) => playCrashAcoustic(track)
	},
	{
		id: "ride_ac",
		name: "Akustik Ride",
		short: "Ride",
		hue: "#0369a1",
		play: (track) => playRideAcoustic(track)
	},
	{
		id: "cymbal_rev",
		name: "Reverse Cymbal",
		short: "Rev Cym",
		hue: "#3b82f6",
		play: (track) => playCymbalReverse(track)
	},
	{
		id: "kick_hiphop",
		name: "Hip-Hop Kick",
		short: "Kick H",
		hue: "#4f46e5",
		play: (track) => playKickHiphop(track)
	},
	{
		id: "snare_hiphop",
		name: "Hip-Hop Snare",
		short: "Snare H",
		hue: "#be185d",
		play: (track) => playSnareHiphop(track)
	},
	{
		id: "hat_trap",
		name: "Trap Hat",
		short: "Hat T",
		hue: "#eab308",
		play: (track) => playHatTrap(track)
	},
	{
		id: "808",
		name: "808 Bass",
		short: "808",
		hue: "#16a34a",
		play: (track) => play808(track)
	},
	{
		id: "snap",
		name: "Snap",
		short: "Snap",
		hue: "#d946ef",
		play: (track) => playSnap(track)
	},
	{
		id: "vinyl",
		name: "Vinyl Crackle",
		short: "Vinyl",
		hue: "#78716c",
		play: (track) => playVinyl(track)
	},
	{
		id: "perc_fm",
		name: "FM Perc",
		short: "Perc F",
		hue: "#8b5cf6",
		play: (track) => playPercFM(track)
	}
];
var MELODIC_INSTRUMENTS = [
	...LEAD_INSTRUMENTS,
	...BASS_INSTRUMENTS,
	{
		id: "piano",
		name: "Piano"
	},
	{
		id: "piano_grand",
		name: "Konzertflügel"
	},
	{
		id: "strings_orchestral",
		name: "Orchester-Streicher"
	},
	{
		id: "upright_bass",
		name: "Kontrabass"
	},
	{
		id: "lead_saw",
		name: "EDM Lead"
	},
	{
		id: "pad_warm",
		name: "Warm Pad"
	},
	{
		id: "wobble_bass",
		name: "Wobble Bass"
	},
	{
		id: "bass_fm",
		name: "FM Bass"
	},
	{
		id: "arp_pluck",
		name: "Arp Pluck"
	},
	{
		id: "flute_wooden",
		name: "Holzflöte"
	},
	{
		id: "lofi_keys",
		name: "Lo-Fi Keys"
	},
	{
		id: "synth_bass",
		name: "Synth Bass"
	},
	{
		id: "brass_pad",
		name: "Brass Pad"
	},
	{
		id: "glockenspiel",
		name: "Glocken"
	},
	{
		id: "kalimba",
		name: "Kalimba"
	},
	{
		id: "xylophon",
		name: "Xylo"
	},
	{
		id: "gitarre",
		name: "Gitarre"
	},
	{
		id: "bass",
		name: "E-Bass"
	},
	{
		id: "floete",
		name: "Flöte"
	},
	{
		id: "trompete",
		name: "Trompete"
	},
	{
		id: "chor",
		name: "Chor"
	},
	{
		id: "traum",
		name: "Dream Pad"
	}
];
var NOTE_NAMES = [
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B"
];
var PC_KEYS = [
	"y",
	"s",
	"x",
	"d",
	"c",
	"v",
	"g",
	"b",
	"h",
	"n",
	"j",
	"m",
	"q",
	"2",
	"w",
	"3",
	"e",
	"r",
	"5",
	"t",
	"6",
	"z",
	"7",
	"u",
	"i",
	"9",
	"o"
];
var generateKeyboard = (baseOctave) => {
	const keys = [];
	for (let i = 0; i < 25; i++) {
		const octave = baseOctave + Math.floor(i / 12);
		const noteIndex = i % 12;
		const name = NOTE_NAMES[noteIndex];
		const midi = (octave + 1) * 12 + noteIndex;
		const freq = 440 * Math.pow(2, (midi - 69) / 12);
		keys.push({
			note: `${name}${octave}`,
			freq,
			type: name.includes("#") ? "black" : "white",
			key: PC_KEYS[i] || "",
			label: PC_KEYS[i] ? PC_KEYS[i].toUpperCase() : ""
		});
	}
	return keys;
};
var getNoteFrequency = (noteName) => {
	const match = noteName.match(/([A-G]#?)(\d)/);
	if (!match) return 261.63;
	const name = match[1];
	const octave = parseInt(match[2], 10);
	const noteIndex = NOTE_NAMES.indexOf(name);
	if (noteIndex === -1) return 261.63;
	const midi = (octave + 1) * 12 + noteIndex;
	return 440 * Math.pow(2, (midi - 69) / 12);
};
var PATTERN_TEMPLATES = [
	{
		id: "pop",
		name: "Pop Groove",
		bpm: 112,
		steps: 16,
		patterns: {
			kick_deep: [0, 8],
			snare_snap: [4, 12],
			hat_closed: [
				0,
				2,
				4,
				6,
				8,
				10,
				12,
				14
			],
			clap: [12]
		},
		melody: [
			["C4", 0],
			["E4", 4],
			["G4", 8],
			["C5", 12]
		]
	},
	{
		id: "trap",
		name: "Trap Steps",
		bpm: 142,
		steps: 16,
		patterns: {
			kick_deep: [
				0,
				3,
				8,
				10
			],
			snare_room: [4, 12],
			hat_closed: [
				0,
				1,
				2,
				3,
				4,
				6,
				7,
				8,
				9,
				10,
				11,
				12,
				14,
				15
			],
			perc_bass: [
				0,
				7,
				10
			]
		},
		melody: [
			["C4", 0],
			["D#4", 3],
			["G4", 8],
			["F4", 11]
		]
	},
	{
		id: "garage",
		name: "Garage Beat",
		bpm: 126,
		steps: 16,
		patterns: {
			kick_soft: [
				0,
				7,
				10
			],
			snare_snap: [4, 12],
			hat_closed: [
				0,
				2,
				4,
				5,
				8,
				10,
				12,
				13
			],
			shaker: [
				1,
				3,
				5,
				7,
				9,
				11,
				13,
				15
			],
			perc_bell: [6, 14]
		},
		melody: [
			["C4", 0],
			["G4", 4],
			["A4", 8],
			["G4", 12]
		]
	},
	{
		id: "cinema",
		name: "Filmisch",
		bpm: 84,
		steps: 16,
		patterns: {
			kick_soft: [0, 8],
			clap: [12],
			crash: [0],
			tom_low: [6],
			tom_mid: [10],
			tom_high: [14]
		},
		melody: [
			["C4", 0],
			["E4", 4],
			["G4", 8],
			["E5", 12]
		]
	},
	{
		id: "boombap",
		name: "Boom Bap",
		bpm: 92,
		steps: 16,
		patterns: {
			kick_hiphop: [
				0,
				8,
				11
			],
			snare_hiphop: [4, 12],
			hat_trap: [
				0,
				2,
				4,
				6,
				8,
				10,
				12,
				14
			],
			vinyl: [0]
		},
		melody: [
			["C4", 0],
			["D#4", 4],
			["G4", 8],
			["A#4", 12]
		]
	}
];
var safeParse = (value, fallback) => {
	try {
		return value ? JSON.parse(value) : fallback;
	} catch {
		return fallback;
	}
};
var emptyPattern = (steps = DEFAULT_STEPS) => Array.from({ length: steps }, () => false);
var emptyNotes = (steps = DEFAULT_STEPS) => Array.from({ length: steps }, () => null);
var fitArray = (array, steps, fillValue) => {
	const source = Array.isArray(array) ? array : [];
	return Array.from({ length: steps }, (_, index) => source[index] ?? fillValue);
};
var findNote = (noteName) => {
	return {
		note: noteName,
		freq: getNoteFrequency(noteName),
		velocity: .86
	};
};
var drumById = (id) => DRUM_SOUNDS.find((sound) => sound.id === id) || DRUM_SOUNDS[0];
var createTrack = ({ kind = "drum", instId = "kick_deep", instrument = "piano", name, steps = DEFAULT_STEPS }) => ({
	id: `track_${Date.now()}_${Math.random().toString(16).slice(2)}`,
	kind,
	instId,
	instrument,
	name: name || (kind === "melody" ? "Melodie" : drumById(instId).name),
	volume: kind === "melody" ? .82 : .9,
	pan: 0,
	send: kind === "melody" ? .22 : .1,
	muted: false,
	solo: false,
	pattern: emptyPattern(steps),
	notes: emptyNotes(steps)
});
var createDefaultTracks = (steps = DEFAULT_STEPS) => {
	const kick = createTrack({
		instId: "kick_deep",
		name: "Kick",
		steps
	});
	const snare = createTrack({
		instId: "snare_snap",
		name: "Snare",
		steps
	});
	const hats = createTrack({
		instId: "hat_closed",
		name: "Hi-Hat",
		steps
	});
	const clap = createTrack({
		instId: "clap",
		name: "Clap",
		steps
	});
	const melody = createTrack({
		kind: "melody",
		instrument: "piano",
		name: "Piano",
		steps
	});
	kick.pattern = kick.pattern.map((_, index) => [0, 8].includes(index));
	snare.pattern = snare.pattern.map((_, index) => [4, 12].includes(index));
	hats.pattern = hats.pattern.map((_, index) => index % 2 === 0);
	clap.pattern = clap.pattern.map((_, index) => index === 12);
	melody.notes = melody.notes.map((_, index) => {
		const entry = [
			["C4", 0],
			["E4", 4],
			["G4", 8],
			["C5", 12]
		].find(([, step]) => step === index);
		if (!entry) return null;
		const note = findNote(entry[0]);
		return {
			note: note.note,
			freq: note.freq,
			velocity: .88
		};
	});
	return [
		kick,
		snare,
		hats,
		clap,
		melody
	];
};
var sanitizeTrack = (track, steps) => ({
	id: track.id || `track_${Date.now()}_${Math.random().toString(16).slice(2)}`,
	kind: track.kind === "melody" || track.kind === "sample" ? track.kind : "drum",
	instId: track.instId || "kick_deep",
	instrument: track.instrument || "piano",
	name: track.name || "Spur",
	volume: Number.isFinite(track.volume) ? track.volume : .9,
	pan: Number.isFinite(track.pan) ? track.pan : 0,
	send: Number.isFinite(track.send) ? track.send : .12,
	muted: Boolean(track.muted),
	solo: Boolean(track.solo),
	pattern: fitArray(track.pattern, steps, false).map(Boolean),
	notes: fitArray(track.notes, steps, null)
});
var loadInitialProject = () => {
	if (typeof window === "undefined") return {
		name: "Mein Beat",
		bpm: 118,
		steps: DEFAULT_STEPS,
		swing: .08,
		tracks: createDefaultTracks(DEFAULT_STEPS)
	};
	const saved = safeParse(window.localStorage.getItem(CURRENT_STORAGE_KEY), null);
	if (!saved || !Array.isArray(saved.tracks)) return {
		name: "Mein Beat",
		bpm: 118,
		steps: DEFAULT_STEPS,
		swing: .08,
		tracks: createDefaultTracks(DEFAULT_STEPS)
	};
	const steps = saved.steps === 32 ? 32 : DEFAULT_STEPS;
	return {
		name: saved.name || "Mein Beat",
		bpm: Number.isFinite(saved.bpm) ? saved.bpm : 118,
		steps,
		swing: Number.isFinite(saved.swing) ? saved.swing : .08,
		tracks: saved.tracks.map((track) => sanitizeTrack(track, steps)).slice(0, MAX_TRACKS)
	};
};
var createTemplateTracks = (template) => {
	const tracks = createDefaultTracks(template.steps).map((track) => ({
		...track,
		pattern: emptyPattern(template.steps),
		notes: emptyNotes(template.steps)
	}));
	Object.entries(template.patterns).forEach(([instId, activeSteps], index) => {
		const target = tracks.find((track) => track.instId === instId) || tracks[index] || createTrack({
			instId,
			steps: template.steps
		});
		target.kind = "drum";
		target.instId = instId;
		target.name = drumById(instId).name;
		target.pattern = emptyPattern(template.steps).map((_, step) => activeSteps.includes(step));
		if (!tracks.includes(target)) tracks.push(target);
	});
	const melody = tracks.find((track) => track.kind === "melody") || createTrack({
		kind: "melody",
		instrument: "piano",
		steps: template.steps
	});
	melody.instrument = template.id === "cinema" ? "traum" : template.id === "garage" ? "kalimba" : "piano";
	melody.name = MELODIC_INSTRUMENTS.find((instrument) => instrument.id === melody.instrument)?.name || "Melodie";
	melody.notes = emptyNotes(template.steps);
	template.melody.forEach(([noteName, step]) => {
		const note = findNote(noteName);
		melody.notes[step] = {
			note: note.note,
			freq: note.freq,
			velocity: .9
		};
	});
	return tracks.slice(0, MAX_TRACKS);
};
function BeatMaker() {
	const [initialProject] = (0, import_react.useState)(loadInitialProject);
	const [isEditMode, setIsEditMode] = (0, import_react.useState)(false);
	const [isDualKeyboard, setIsDualKeyboard] = (0, import_react.useState)(false);
	const [layoutCoords, setLayoutCoords] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("faska-layout");
			if (saved) return JSON.parse(saved);
		}
		return {
			header: {
				x: 0,
				y: 0,
				width: "100%",
				height: "auto"
			},
			drums: {
				x: 50,
				y: 50,
				width: 400,
				height: "auto"
			},
			keys: {
				x: 100,
				y: 150,
				width: 800,
				height: "auto"
			},
			grooves: {
				x: 200,
				y: 250,
				width: 400,
				height: "auto"
			}
		};
	});
	const saveLayout = (id, d, ref) => {
		setLayoutCoords((prev) => {
			const next = {
				...prev,
				[id]: {
					x: d.x,
					y: d.y,
					width: ref.style.width,
					height: ref.style.height
				}
			};
			localStorage.setItem("faska-layout", JSON.stringify(next));
			return next;
		});
	};
	const WorkspacePanel = ({ id, children }) => {
		if (!isEditMode) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full relative z-10",
			children
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Rnd, {
			default: layoutCoords[id],
			bounds: "parent",
			className: "z-50 bg-slate-900/95 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-[30px] border-4 border-fuchsia-500 overflow-hidden",
			onDragStop: (e, d) => saveLayout(id, d, { style: layoutCoords[id] }),
			onResizeStop: (e, direction, ref, delta, position) => saveLayout(id, position, ref),
			dragHandleClassName: "drag-handle",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "drag-handle bg-fuchsia-500/20 w-full h-8 cursor-move flex items-center justify-center border-b border-fuchsia-500/30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-bold text-fuchsia-300 tracking-widest uppercase",
					children: "Anfassen & Bewegen"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar p-2",
				children
			})]
		});
	};
	const [isLandscapeFullscreen, setIsLandscapeFullscreen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const handleResize = () => {
			if (typeof window !== "undefined") {
				const isLandscape = window.innerWidth > window.innerHeight;
				const isMobileOrTablet = window.innerWidth <= 1180 || window.innerHeight <= 850;
				setIsLandscapeFullscreen(isLandscape && isMobileOrTablet);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("orientationchange", handleResize);
		};
	}, []);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [bpm, setBpm] = (0, import_react.useState)(initialProject.bpm);
	const [steps, setSteps] = (0, import_react.useState)(initialProject.steps);
	const [swing, setSwing] = (0, import_react.useState)(initialProject.swing);
	const [currentStep, setCurrentStep] = (0, import_react.useState)(0);
	const [tracks, setTracks] = (0, import_react.useState)(initialProject.tracks);
	const [selectedTrackId, setSelectedTrackId] = (0, import_react.useState)(initialProject.tracks[0]?.id || "");
	const [selectedPadId, setSelectedPadId] = (0, import_react.useState)("kick_deep");
	const [selectedInstrument, setSelectedInstrument] = (0, import_react.useState)("piano");
	const [recordPads, setRecordPads] = (0, import_react.useState)(true);
	const [recordKeys, setRecordKeys] = (0, import_react.useState)(true);
	const [projectName, setProjectName] = (0, import_react.useState)(initialProject.name);
	const [savedProjects, setSavedProjects] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return [];
		return safeParse(window.localStorage.getItem(PROJECT_STORAGE_KEY), []);
	});
	const [customSamples, setCustomSamples] = (0, import_react.useState)([]);
	const [octaveOffset, setOctaveOffset] = (0, import_react.useState)(3);
	const keyboardNotes = (0, import_react.useMemo)(() => generateKeyboard(octaveOffset), [octaveOffset]);
	const keyboardNotesUpper = (0, import_react.useMemo)(() => generateKeyboard(Math.min(6, octaveOffset + 1)), [octaveOffset]);
	const computerKeysMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		keyboardNotes.forEach((n) => map.set(n.key.toLowerCase(), n));
		if (isDualKeyboard) {}
		return map;
	}, [keyboardNotes, isDualKeyboard]);
	const [lastNote, setLastNote] = (0, import_react.useState)(keyboardNotes[0]);
	const [editingTrackId, setEditingTrackId] = (0, import_react.useState)(null);
	const tracksRef = (0, import_react.useRef)(tracks);
	const bpmRef = (0, import_react.useRef)(bpm);
	const stepsRef = (0, import_react.useRef)(steps);
	const swingRef = (0, import_react.useRef)(swing);
	const currentStepRef = (0, import_react.useRef)(currentStep);
	const customSamplesRef = (0, import_react.useRef)(customSamples);
	(0, import_react.useRef)(null);
	(0, import_react.useRef)(0);
	const chordBufferRef = (0, import_react.useRef)({
		notes: [],
		timer: null
	});
	const selectedTrack = tracks.find((track) => track.id === selectedTrackId) || tracks[0];
	const soloActive = tracks.some((track) => track.solo);
	const customSamplePads = customSamples.map((sample) => ({
		id: sample.id,
		name: sample.name,
		short: sample.name.slice(0, 5),
		hue: "#06b6d4",
		sample,
		play: (track) => playMicSample(sample.buffer, sample.trimStart, sample.trimEnd - sample.trimStart, track)
	}));
	const padBank = [...DRUM_SOUNDS, ...customSamplePads].slice(0, 24);
	(0, import_react.useEffect)(() => {
		tracksRef.current = tracks;
	}, [tracks]);
	(0, import_react.useEffect)(() => {
		bpmRef.current = bpm;
	}, [bpm]);
	(0, import_react.useEffect)(() => {
		stepsRef.current = steps;
	}, [steps]);
	(0, import_react.useEffect)(() => {
		swingRef.current = swing;
	}, [swing]);
	(0, import_react.useEffect)(() => {
		currentStepRef.current = currentStep;
	}, [currentStep]);
	(0, import_react.useEffect)(() => {
		customSamplesRef.current = customSamples;
	}, [customSamples]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const payload = {
			name: projectName,
			bpm,
			steps,
			swing,
			tracks: tracks.map(({ id, kind, instId, instrument, name, volume, pan, send, muted, solo, pattern, notes }) => ({
				id,
				kind,
				instId,
				instrument,
				name,
				volume,
				pan,
				send,
				muted,
				solo,
				pattern,
				notes
			}))
		};
		window.localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(payload));
	}, [
		bpm,
		projectName,
		steps,
		swing,
		tracks
	]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(savedProjects));
	}, [savedProjects]);
	const triggerPadSound = (0, import_react.useCallback)((padId, trackOptions = {}) => {
		const custom = customSamplesRef.current.find((sample) => sample.id === padId);
		if (custom) {
			playMicSample(custom.buffer, custom.trimStart, custom.trimEnd - custom.trimStart, trackOptions);
			return;
		}
		drumById(padId).play(trackOptions);
	}, []);
	const playTrackStep = (0, import_react.useCallback)((track, stepIndex) => {
		if (soloActive && !track.solo) return;
		if (track.muted) return;
		const output = {
			volume: track.volume,
			pan: track.pan,
			send: track.send
		};
		const active = track.kind === "melody" ? Boolean(track.notes[stepIndex]) : Boolean(track.pattern[stepIndex]);
		if (active && track.kind === "melody") (Array.isArray(track.notes[stepIndex]) ? track.notes[stepIndex] : [track.notes[stepIndex]]).forEach((note) => {
			if (!note) return;
			const freq = note.freq || 440;
			const inst = MELODIC_INSTRUMENTS.find((i) => i.id === track.instrument);
			if (inst && inst.play) inst.play(freq, {
				velocity: (note.velocity || .85) * track.volume,
				pan: track.pan,
				send: track.send
			});
			else playInstrumentTone(track.instrument || "piano", freq, {
				velocity: (note.velocity || .85) * track.volume,
				pan: track.pan,
				send: track.send
			});
		});
		else if (active && track.kind === "drum") triggerPadSound(track.instId, output);
	}, [soloActive, triggerPadSound]);
	const triggerStep = (0, import_react.useCallback)((stepIndex) => {
		tracksRef.current.forEach((track) => {
			if (stepIndex % 2 === 1 && swingRef.current > 0) window.setTimeout(() => playTrackStep(track, stepIndex), Math.round(6e4 / bpmRef.current / 4 * swingRef.current));
			else playTrackStep(track, stepIndex);
		});
	}, [playTrackStep]);
	(0, import_react.useEffect)(() => {
		if (!isPlaying) return void 0;
		let cancelled = false;
		let timerId = 0;
		const tick = () => {
			if (cancelled) return;
			const stepIndex = currentStepRef.current;
			triggerStep(stepIndex);
			const nextStep = (stepIndex + 1) % stepsRef.current;
			setCurrentStep(nextStep);
			currentStepRef.current = nextStep;
			timerId = window.setTimeout(tick, 6e4 / bpmRef.current / 4);
		};
		tick();
		return () => {
			cancelled = true;
			window.clearTimeout(timerId);
		};
	}, [isPlaying, triggerStep]);
	const updateTrack = (trackId, updater) => {
		setTracks((prev) => prev.map((track) => track.id === trackId ? updater(track) : track));
	};
	const selectOrCreateTrack = (kind) => {
		const current = tracks.find((track) => track.id === selectedTrackId && track.kind === kind);
		if (current) return current.id;
		const existing = tracks.find((track) => track.kind === kind);
		if (existing) {
			setSelectedTrackId(existing.id);
			return existing.id;
		}
		if (tracks.length >= MAX_TRACKS) return tracks[0]?.id;
		const newTrack = createTrack({
			kind,
			instId: selectedPadId,
			instrument: selectedInstrument,
			steps
		});
		setTracks((prev) => [...prev, newTrack]);
		setSelectedTrackId(newTrack.id);
		return newTrack.id;
	};
	const toggleStep = (trackId, stepIndex) => {
		updateTrack(trackId, (track) => {
			if (track.kind === "melody") {
				const nextNotes = [...track.notes];
				const existing = nextNotes[stepIndex];
				if (Array.isArray(existing) && existing.length > 0) nextNotes[stepIndex] = [];
				else if (existing && !Array.isArray(existing)) nextNotes[stepIndex] = [];
				else nextNotes[stepIndex] = [{
					note: lastNote.note,
					freq: lastNote.freq,
					velocity: .86
				}];
				return {
					...track,
					notes: nextNotes
				};
			}
			const nextPattern = [...track.pattern];
			nextPattern[stepIndex] = !nextPattern[stepIndex];
			return {
				...track,
				pattern: nextPattern
			};
		});
	};
	const playPad = (pad) => {
		const options = selectedTrack?.kind === "drum" ? selectedTrack : {
			volume: .9,
			pan: 0,
			send: .12
		};
		setSelectedPadId(pad.id);
		triggerPadSound(pad.id, options);
		if (!recordPads) return;
		updateTrack(selectOrCreateTrack("drum"), (track) => {
			const nextPattern = [...track.pattern];
			nextPattern[currentStepRef.current] = true;
			return {
				...track,
				instId: pad.id,
				name: pad.name,
				pattern: nextPattern,
				kind: "drum"
			};
		});
	};
	function playKeyboardNote(note) {
		setLastNote(note);
		const inst = MELODIC_INSTRUMENTS.find((i) => i.id === selectedInstrument);
		if (inst && inst.play) inst.play(note.freq, {
			velocity: .88,
			send: .22
		});
		else playInstrumentTone(selectedInstrument, note.freq, {
			velocity: .88,
			send: .22
		});
		if (!recordKeys) return;
		if (!chordBufferRef.current.timer) chordBufferRef.current.captureStep = currentStepRef.current;
		chordBufferRef.current.notes.push({
			note: note.note,
			freq: note.freq,
			velocity: .9
		});
		if (chordBufferRef.current.timer) return;
		chordBufferRef.current.timer = setTimeout(() => {
			const recordedNotes = [...chordBufferRef.current.notes];
			const targetStep = chordBufferRef.current.captureStep;
			chordBufferRef.current.notes = [];
			chordBufferRef.current.timer = null;
			updateTrack(selectOrCreateTrack("melody"), (track) => {
				const nextNotes = [...track.notes];
				const existing = nextNotes[targetStep];
				const combined = Array.isArray(existing) ? [...existing] : existing ? [existing] : [];
				recordedNotes.forEach((n) => {
					if (!combined.some((e) => e.note === n.note)) combined.push(n);
				});
				nextNotes[targetStep] = combined.length === 1 ? combined[0] : combined;
				return {
					...track,
					kind: "melody",
					instrument: selectedInstrument,
					name: MELODIC_INSTRUMENTS.find((instrument) => instrument.id === selectedInstrument)?.name || "Melodie",
					notes: nextNotes
				};
			});
			if (!isPlaying) setCurrentStep((value) => {
				const next = (value + 1) % stepsRef.current;
				currentStepRef.current = next;
				return next;
			});
		}, 120);
	}
	const toggleTransport = () => {
		if (isPlaying) {
			setIsPlaying(false);
			currentStepRef.current = 0;
			setCurrentStep(0);
			return;
		}
		setIsPlaying(true);
	};
	(0, import_react.useEffect)(() => {
		const onKeyDown = (event) => {
			if (event.repeat) return;
			const target = event.target;
			if (target && [
				"INPUT",
				"TEXTAREA",
				"SELECT"
			].includes(target.tagName)) return;
			const note = computerKeysMap.get(event.key.toLowerCase());
			if (note) {
				event.preventDefault();
				playKeyboardNote(note);
			}
			if (event.code === "Space") {
				event.preventDefault();
				toggleTransport();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});
	const addTrack = (kind) => {
		if (tracks.length >= MAX_TRACKS) return;
		const next = createTrack({
			kind,
			instId: selectedPadId,
			instrument: selectedInstrument,
			name: kind === "melody" ? MELODIC_INSTRUMENTS.find((instrument) => instrument.id === selectedInstrument)?.name : drumById(selectedPadId).name,
			steps
		});
		setTracks((prev) => [...prev, next]);
		setSelectedTrackId(next.id);
	};
	const duplicateTrack = () => {
		if (!selectedTrack || tracks.length >= MAX_TRACKS) return;
		const copy = {
			...selectedTrack,
			id: `${selectedTrack.id}_copy_${tracks.length + 1}`,
			name: `${selectedTrack.name} 2`,
			pattern: [...selectedTrack.pattern],
			notes: [...selectedTrack.notes]
		};
		setTracks((prev) => [...prev, copy]);
		setSelectedTrackId(copy.id);
	};
	const removeTrack = (trackId) => {
		setTracks((prev) => {
			const next = prev.filter((track) => track.id !== trackId);
			if (!next.some((track) => track.id === selectedTrackId)) setSelectedTrackId(next[0]?.id || "");
			return next.length ? next : createDefaultTracks(steps);
		});
	};
	const clearSelectedTrack = () => {
		if (!selectedTrack) return;
		updateTrack(selectedTrack.id, (track) => ({
			...track,
			pattern: emptyPattern(steps),
			notes: emptyNotes(steps)
		}));
	};
	const randomizeSelectedTrack = () => {
		if (!selectedTrack) return;
		updateTrack(selectedTrack.id, (track) => {
			if (track.kind === "melody") return {
				...track,
				notes: emptyNotes(steps).map((_, index) => {
					if (Math.random() > (index % 4 === 0 ? .52 : .82)) return null;
					const note = keyboardNotes[Math.floor(Math.random() * keyboardNotes.length)];
					return {
						note: note.note,
						freq: note.freq,
						velocity: .72 + Math.random() * .24
					};
				})
			};
			return {
				...track,
				pattern: emptyPattern(steps).map((_, index) => Math.random() > (index % 4 === 0 ? .42 : .76))
			};
		});
	};
	const changeSteps = (nextSteps) => {
		setSteps(nextSteps);
		setCurrentStep((step) => Math.min(step, nextSteps - 1));
		setTracks((prev) => prev.map((track) => ({
			...track,
			pattern: fitArray(track.pattern, nextSteps, false).map(Boolean),
			notes: fitArray(track.notes, nextSteps, null)
		})));
	};
	const applyTemplate = (template) => {
		setBpm(template.bpm);
		setSteps(template.steps);
		setSwing(template.id === "garage" ? .16 : template.id === "trap" ? .04 : .08);
		const nextTracks = createTemplateTracks(template);
		setTracks(nextTracks);
		setSelectedTrackId(nextTracks[0]?.id || "");
		setProjectName(template.name);
		setCurrentStep(0);
	};
	const saveProject = () => {
		const payload = {
			id: `project_${Date.now()}`,
			name: projectName.trim() || "Beat",
			savedAt: (/* @__PURE__ */ new Date()).toISOString(),
			bpm,
			steps,
			swing,
			tracks
		};
		setSavedProjects((prev) => [payload, ...prev.filter((project) => project.name !== payload.name)].slice(0, 12));
	};
	const loadProject = (project) => {
		const nextSteps = project.steps === 32 ? 32 : DEFAULT_STEPS;
		setProjectName(project.name);
		setBpm(project.bpm || 118);
		setSteps(nextSteps);
		setSwing(project.swing || 0);
		const nextTracks = (project.tracks || []).map((track) => sanitizeTrack(track, nextSteps)).slice(0, MAX_TRACKS);
		setTracks(nextTracks.length ? nextTracks : createDefaultTracks(nextSteps));
		setSelectedTrackId(nextTracks[0]?.id || "");
		setCurrentStep(0);
	};
	const deleteProject = (projectId) => {
		setSavedProjects((prev) => prev.filter((project) => project.id !== projectId));
	};
	const exportProject = () => {
		if (typeof window === "undefined") return;
		const payload = JSON.stringify({
			name: projectName,
			bpm,
			steps,
			swing,
			tracks
		}, null, 2);
		const blob = new Blob([payload], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${projectName.trim() || "beat"}.json`;
		link.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: isLandscapeFullscreen ? "fixed inset-0 z-[100] h-[100dvh] w-screen overflow-y-auto bg-slate-950 text-white" : "w-full overflow-hidden rounded-[34px] border border-slate-700 bg-slate-950 text-white shadow-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `relative ${isEditMode ? "min-h-[1200px]" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed top-4 right-4 z-[200]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsEditMode((e) => !e),
						className: `px-6 py-3 rounded-full font-bold shadow-2xl transition-all border-2 flex items-center gap-2 ${isEditMode ? "bg-fuchsia-500 text-white border-white scale-105" : "bg-slate-800 text-slate-300 border-slate-600 hover:border-slate-400"}`,
						children: isEditMode ? "Workspace Speichern" : "Workspace Anpassen"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspacePanel, {
					id: "header",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden border-b border-slate-800 bg-[radial-gradient(circle_at_top_left,#312e81_0%,#0f172a_34%,#020617_100%)] px-5 py-6 md:px-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 opacity-[0.06]",
							style: {
								backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
								backgroundSize: "24px 24px"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-w-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/30",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { size: 25 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: projectName,
										onChange: (event) => setProjectName(event.target.value),
										className: "w-full max-w-[28rem] bg-transparent font-hand text-4xl font-bold leading-tight text-white outline-none md:text-5xl",
										"aria-label": "Projektname"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.22em] text-slate-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												tracks.length,
												"/",
												MAX_TRACKS,
												" Spuren"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [steps, " Steps"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [bpm, " BPM"] })
										]
									})] })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: toggleTransport,
										className: `flex h-16 min-w-16 items-center justify-center rounded-2xl px-6 shadow-xl transition ${isPlaying ? "bg-rose-500 shadow-rose-500/30" : "bg-emerald-400 text-slate-950 shadow-emerald-400/30"}`,
										"aria-label": isPlaying ? "Stop" : "Play",
										children: isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {
											size: 25,
											fill: "currentColor"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-1 h-0 w-0 border-y-[12px] border-l-[18px] border-y-transparent border-l-current" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid min-w-[18rem] grid-cols-2 gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "text-xs font-black uppercase tracking-[0.18em] text-slate-400",
												children: ["Tempo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "mt-2 w-full accent-amber-400",
													type: "range",
													min: "60",
													max: "190",
													value: bpm,
													onChange: (event) => setBpm(Number(event.target.value))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "text-xs font-black uppercase tracking-[0.18em] text-slate-400",
												children: ["Swing", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "mt-2 w-full accent-fuchsia-400",
													type: "range",
													min: "0",
													max: "0.28",
													step: "0.01",
													value: swing,
													onChange: (event) => setSwing(Number(event.target.value))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "col-span-2 flex items-center justify-between gap-2",
												children: [16, 32].map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => changeSteps(size),
													className: `flex-1 rounded-xl px-3 py-2 text-sm font-black uppercase tracking-widest ${steps === size ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`,
													children: [size, " Steps"]
												}, size))
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicSampler, {
										onSamplesUpdate: setCustomSamples,
										bpm
									})
								]
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `p-5 md:p-8 ${isEditMode ? "relative h-full" : "flex flex-col gap-8"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: isEditMode ? "static" : "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspacePanel, {
								id: "drums",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl h-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4 flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[0.68rem] font-black uppercase tracking-[0.22em] text-amber-300",
											children: "MPC Pads"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-hand text-3xl font-bold text-white",
											children: "Drum Machine"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setRecordPads((value) => !value),
											className: `rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest ${recordPads ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"}`,
											children: "Rec"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-4 gap-2 md:gap-3",
										children: padBank.slice(0, 16).map((pad) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
											whileTap: { scale: .92 },
											onPointerDown: (e) => {
												if (e.pointerType === "touch") e.preventDefault();
												playPad(pad);
											},
											className: `touch-none relative flex flex-col justify-end rounded-2xl border border-white/10 p-2 md:p-3 text-left shadow-lg transition aspect-square ${selectedPadId === pad.id ? "ring-2 ring-white" : "hover:border-white/30"}`,
											style: {
												background: `linear-gradient(145deg, ${pad.hue}, #0f172a 82%)`,
												boxShadow: selectedPadId === pad.id ? `0 0 22px ${pad.hue}66` : void 0
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-[0.55rem] md:text-[0.64rem] font-black uppercase tracking-widest text-white/70",
												children: pad.short
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 md:mt-2 block truncate font-hand text-sm md:text-xl font-bold leading-none text-white",
												children: pad.name
											})]
										}, pad.id))
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspacePanel, {
								id: "keys",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl h-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-5 py-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Piano, { size: 20 })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-hand text-2xl font-bold text-white",
													children: "Klaviatur & Instrumente"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[0.65rem] font-black uppercase tracking-widest text-slate-500",
													children: "2 Oktaven spielbar"
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													value: selectedInstrument,
													onChange: (event) => setSelectedInstrument(event.target.value),
													className: "rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-white outline-none",
													children: MELODIC_INSTRUMENTS.map((instrument) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: instrument.id,
														children: instrument.name
													}, instrument.id))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 rounded-xl bg-slate-950 p-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => setIsDualKeyboard(!isDualKeyboard),
															className: `rounded-lg p-2 text-xs font-bold uppercase tracking-widest ${isDualKeyboard ? "bg-amber-400 text-slate-900" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"}`,
															children: "2 Zeilen"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => setOctaveOffset((o) => Math.max(1, o - 1)),
															className: "rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white",
															title: "-1 Oktave",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 16 })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "w-12 text-center text-xs font-bold text-slate-400",
															children: ["Okt ", octaveOffset]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => setOctaveOffset((o) => Math.min(6, o + 1)),
															className: "rounded-lg bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white",
															title: "+1 Oktave",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 })
														})
													]
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setRecordKeys((value) => !value),
											className: `mt-4 mb-3 w-full rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-widest ${recordKeys ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"}`,
											children: "Melodie aufnehmen"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-slate-950/50 p-5 rounded-xl border border-slate-800 flex flex-col gap-4",
											children: [isDualKeyboard && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex justify-center overflow-x-auto pb-2 custom-scrollbar",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex relative min-w-max px-4",
													children: keyboardNotesUpper.map((note) => {
														const isBlack = note.type === "black";
														return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: `touch-none flex-shrink-0 relative rounded-b-xl transition-all outline-none border
                            h-32 md:h-40 
                            ${isBlack ? "w-8 md:w-12 bg-slate-800 -mx-4 md:-mx-6 z-10 border-slate-900 shadow-xl" : "w-12 md:w-16 bg-white border-slate-300 z-0 shadow-sm"}
                            ${lastNote?.note === note.note ? isBlack ? "bg-slate-700 translate-y-1" : "bg-slate-100 translate-y-1" : "hover:bg-slate-50"}
                          `,
															onPointerDown: (e) => {
																if (e.pointerType === "touch") e.preventDefault();
																playKeyboardNote(note);
															},
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: `absolute bottom-3 w-full text-center text-xs font-bold ${isBlack ? "text-slate-400" : "text-slate-400"}`,
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "block text-[8px]",
																	children: note.note.replace("#", "♯")
																})
															})
														}, note.note + "-upper");
													})
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex justify-center overflow-x-auto pb-4 custom-scrollbar",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex relative min-w-max px-4",
													children: keyboardNotes.map((note) => {
														const isBlack = note.type === "black";
														return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: `touch-none flex-shrink-0 relative rounded-b-xl transition-all outline-none border
                          h-48 md:h-56 
                          ${isBlack ? "w-10 md:w-14 bg-slate-800 -mx-5 md:-mx-7 z-10 border-slate-900 shadow-xl" : "w-14 md:w-20 bg-white border-slate-300 z-0 shadow-sm"}
                          ${lastNote?.note === note.note ? isBlack ? "bg-slate-700 translate-y-1" : "bg-slate-100 translate-y-1" : "hover:bg-slate-50"}
                        `,
															onPointerDown: (e) => {
																if (e.pointerType === "touch") e.preventDefault();
																playKeyboardNote(note);
															},
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: `absolute bottom-3 w-full text-center text-xs font-bold ${isBlack ? "text-slate-400" : "text-slate-400"}`,
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "block mb-1",
																	children: note.note.replace("#", "♯")
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "block text-[9px] uppercase",
																	children: note.label
																})]
															})
														}, note.note);
													})
												})
											})]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspacePanel, {
								id: "grooves",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl h-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
											size: 19,
											className: "text-fuchsia-300"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-hand text-3xl font-bold text-white",
											children: "Grooves"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 gap-2",
										children: PATTERN_TEMPLATES.map((template) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => applyTemplate(template),
											className: "rounded-2xl bg-slate-800 px-3 py-3 text-left font-bold text-slate-200 hover:bg-slate-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block font-hand text-2xl leading-none",
												children: template.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs uppercase tracking-widest text-slate-500",
												children: [template.bpm, " BPM"]
											})]
										}, template.id))
									})]
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "min-w-0 space-y-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkspacePanel, {
							id: "sequencer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4 flex flex-wrap items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
												className: "text-amber-300",
												size: 22
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[0.68rem] font-black uppercase tracking-[0.22em] text-amber-300",
												children: "Sequencer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-hand text-3xl font-bold text-white",
												children: "Pattern & Mixer"
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => addTrack("drum"),
													className: "inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-100 hover:bg-slate-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), " Drum"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => addTrack("melody"),
													className: "inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-100 hover:bg-slate-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 }), " Melodie"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: duplicateTrack,
													className: "inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-100 hover:bg-slate-700",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { size: 16 }), " Kopie"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: randomizeSelectedTrack,
													className: "inline-flex items-center gap-2 rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-black text-white hover:bg-fuchsia-400",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 16 }), " Würfeln"]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "max-w-full overflow-x-auto pb-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											style: { minWidth: steps === 32 ? "62rem" : "38rem" },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid items-center gap-1 pl-[13.25rem]",
												style: { gridTemplateColumns: `repeat(${steps}, minmax(${steps === 32 ? "1.05rem" : "1.25rem"}, 1fr))` },
												children: Array.from({ length: steps }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `text-center text-[0.64rem] font-black ${currentStep === index ? "text-amber-300" : index % 4 === 0 ? "text-slate-300" : "text-slate-600"}`,
													children: index + 1
												}, index))
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
												initial: false,
												children: tracks.map((track) => {
													const isSelected = selectedTrackId === track.id;
													const color = track.kind === "melody" ? "#38bdf8" : drumById(track.instId).hue;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
														layout: true,
														initial: {
															opacity: 0,
															y: 12
														},
														animate: {
															opacity: 1,
															y: 0
														},
														exit: {
															opacity: 0,
															x: -30
														},
														className: `grid items-center gap-1 rounded-2xl border p-2 transition ${isSelected ? "border-amber-300 bg-slate-800" : "border-slate-800 bg-slate-950/70"}`,
														style: { gridTemplateColumns: `12.75rem repeat(${steps}, minmax(${steps === 32 ? "1.05rem" : "1.25rem"}, 1fr))` },
														onClick: () => setSelectedTrackId(track.id),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex min-w-0 items-center gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "h-10 w-2 rounded-full",
																style: { backgroundColor: color }
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "min-w-0 flex-1",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																		value: track.name,
																		onChange: (event) => updateTrack(track.id, (prev) => ({
																			...prev,
																			name: event.target.value
																		})),
																		className: "w-full bg-transparent font-hand text-xl font-bold leading-none text-white outline-none",
																		"aria-label": "Spurname"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "mt-1 flex flex-wrap items-center gap-1",
																		children: [
																			track.kind === "melody" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
																				onClick: (event) => {
																					event.stopPropagation();
																					setEditingTrackId(track.id);
																				},
																				className: "rounded-lg bg-indigo-500 px-2 py-1 text-[0.65rem] font-bold text-white hover:bg-indigo-400 flex items-center gap-1 shadow-lg shadow-indigo-500/30",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { size: 12 }), " Roll"]
																			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
																				value: track.instrument,
																				onChange: (event) => updateTrack(track.id, (prev) => ({
																					...prev,
																					instrument: event.target.value,
																					name: MELODIC_INSTRUMENTS.find((instrument) => instrument.id === event.target.value)?.name || prev.name
																				})),
																				className: "max-w-24 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[0.65rem] font-bold text-slate-300 outline-none",
																				children: MELODIC_INSTRUMENTS.map((instrument) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																					value: instrument.id,
																					children: instrument.name
																				}, instrument.id))
																			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
																				value: track.instId,
																				onChange: (event) => updateTrack(track.id, (prev) => ({
																					...prev,
																					instId: event.target.value,
																					name: padBank.find((pad) => pad.id === event.target.value)?.name || prev.name
																				})),
																				className: "max-w-24 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[0.65rem] font-bold text-slate-300 outline-none",
																				children: padBank.map((pad) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																					value: pad.id,
																					children: pad.name
																				}, pad.id))
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																				onClick: (event) => {
																					event.stopPropagation();
																					updateTrack(track.id, (prev) => ({
																						...prev,
																						muted: !prev.muted
																					}));
																				},
																				className: `rounded-lg px-2 py-1 text-[0.62rem] font-black ${track.muted ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"}`,
																				children: "M"
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																				onClick: (event) => {
																					event.stopPropagation();
																					updateTrack(track.id, (prev) => ({
																						...prev,
																						solo: !prev.solo
																					}));
																				},
																				className: `rounded-lg px-2 py-1 text-[0.62rem] font-black ${track.solo ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-400"}`,
																				children: "S"
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																				onClick: (event) => {
																					event.stopPropagation();
																					removeTrack(track.id);
																				},
																				className: "rounded-lg bg-slate-800 p-1 text-slate-500 hover:text-rose-300",
																				"aria-label": "Spur löschen",
																				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 13 })
																			})
																		]
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "mt-2 grid grid-cols-3 gap-1",
																		children: [
																			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																				className: "text-[0.58rem] font-black uppercase tracking-widest text-slate-500",
																				children: [
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
																						size: 11,
																						className: "mb-0.5 inline"
																					}),
																					" Vol",
																					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																						type: "range",
																						min: "0",
																						max: "1.2",
																						step: "0.01",
																						value: track.volume,
																						onChange: (event) => updateTrack(track.id, (prev) => ({
																							...prev,
																							volume: Number(event.target.value)
																						})),
																						className: "block w-full accent-amber-400"
																					})
																				]
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																				className: "text-[0.58rem] font-black uppercase tracking-widest text-slate-500",
																				children: ["Pan", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																					type: "range",
																					min: "-1",
																					max: "1",
																					step: "0.01",
																					value: track.pan,
																					onChange: (event) => updateTrack(track.id, (prev) => ({
																						...prev,
																						pan: Number(event.target.value)
																					})),
																					className: "block w-full accent-sky-400"
																				})]
																			}),
																			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
																				className: "text-[0.58rem] font-black uppercase tracking-widest text-slate-500",
																				children: ["FX", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																					type: "range",
																					min: "0",
																					max: "0.55",
																					step: "0.01",
																					value: track.send,
																					onChange: (event) => updateTrack(track.id, (prev) => ({
																						...prev,
																						send: Number(event.target.value)
																					})),
																					className: "block w-full accent-fuchsia-400"
																				})]
																			})
																		]
																	})
																]
															})]
														}), Array.from({ length: steps }, (_, index) => {
															const active = track.kind === "melody" ? Boolean(track.notes[index]) : Boolean(track.pattern[index]);
															const isBeat = index % 4 === 0;
															const isNow = isPlaying && currentStep === index;
															return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
																whileTap: { scale: .9 },
																onClick: (event) => {
																	event.stopPropagation();
																	toggleStep(track.id, index);
																},
																className: `relative h-10 rounded-lg border text-[0.6rem] font-black transition ${active ? "border-white/50 text-white shadow-lg" : isBeat ? "border-slate-700 bg-slate-800 text-slate-500" : "border-slate-800 bg-slate-900 text-slate-600"} ${isNow ? "ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-950" : ""}`,
																style: active ? {
																	backgroundColor: color,
																	boxShadow: `0 0 18px ${color}55`
																} : void 0,
																children: track.kind === "melody" && active ? Array.isArray(track.notes[index]) ? (track.notes[index][0]?.note || "").replace("#", "♯") + (track.notes[index].length > 1 ? "+" : "") : track.notes[index].note.replace("#", "♯") : active ? "●" : ""
															}, index);
														})]
													}, track.id);
												})
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex flex-wrap justify-between gap-3 border-t border-slate-800 pt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: clearSelectedTrack,
											className: "inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-200 hover:bg-slate-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eraser, { size: 16 }), " Spur leeren"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												setTracks(createDefaultTracks(steps));
												setCurrentStep(0);
											},
											className: "inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-200 hover:bg-slate-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 }), " Alles neu"]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-5 lg:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
												className: "text-emerald-300",
												size: 20
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-hand text-3xl font-bold text-white",
												children: "Projekte"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: saveProject,
												className: "inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950 hover:bg-emerald-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { size: 16 }), " Speichern"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: exportProject,
												className: "inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-black text-slate-100 hover:bg-slate-700",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 16 }), " Export"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 max-h-56 space-y-2 overflow-y-auto pr-1",
											children: [savedProjects.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-hand text-2xl text-slate-500",
												children: "Noch kein gespeicherter Beat."
											}), savedProjects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-3 rounded-2xl bg-slate-950 px-3 py-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														onClick: () => loadProject(project),
														className: "min-w-0 flex-1 text-left",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "block truncate font-hand text-2xl font-bold text-white",
															children: project.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-xs font-black uppercase tracking-widest text-slate-500",
															children: [
																project.bpm,
																" BPM · ",
																project.steps,
																" Steps"
															]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => loadProject(project),
														className: "rounded-full bg-slate-800 p-2 text-slate-300 hover:bg-slate-700",
														"aria-label": "Projekt laden",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { size: 16 })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => deleteProject(project.id),
														className: "rounded-full bg-slate-800 p-2 text-slate-500 hover:text-rose-300",
														"aria-label": "Projekt löschen",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 })
													})
												]
											}, project.id))]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-[2] rounded-[26px] border border-slate-800 bg-slate-900 p-4 shadow-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicVocal, {
											className: "text-cyan-300",
											size: 20
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-hand text-3xl font-bold text-white",
											children: "Sound-Auswahl (Pads)"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6",
										children: padBank.map((pad) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onPointerDown: (e) => {
												if (e.pointerType === "touch") e.preventDefault();
												setSelectedPadId(pad.id);
												triggerPadSound(pad.id, selectedTrack || {
													volume: .9,
													pan: 0,
													send: .12
												});
											},
											className: `rounded-2xl border px-3 py-2 text-left ${selectedPadId === pad.id ? "border-white bg-slate-800" : "border-slate-800 bg-slate-950 hover:bg-slate-800"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block h-2 w-10 rounded-full",
												style: { backgroundColor: pad.hue }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-2 block truncate font-hand text-xl font-bold text-white",
												children: pad.name
											})]
										}, pad.id))
									})]
								})]
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: editingTrackId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						scale: .95
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					exit: {
						opacity: 0,
						scale: .95
					},
					className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 md:p-8 backdrop-blur-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl",
						children: (() => {
							const trk = tracks.find((t) => t.id === editingTrackId);
							if (!trk) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-hand text-3xl font-bold text-white",
									children: ["Piano Roll - ", trk.name]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-black uppercase tracking-widest text-sky-400",
									children: "Polyphoner Editor"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											value: trk.instrument,
											onChange: (e) => updateTrack(trk.id, (prev) => ({
												...prev,
												instrument: e.target.value,
												name: MELODIC_INSTRUMENTS.find((i) => i.id === e.target.value)?.name || prev.name
											})),
											className: "rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-bold text-white outline-none",
											children: MELODIC_INSTRUMENTS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: i.id,
												children: i.name
											}, i.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: toggleTransport,
											className: `flex h-12 w-12 items-center justify-center rounded-full transition ${isPlaying ? "bg-rose-500 text-white" : "bg-emerald-400 text-slate-950"}`,
											children: isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {
												size: 20,
												fill: "currentColor"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
												size: 20,
												fill: "currentColor"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setEditingTrackId(null),
											className: "flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 24 })
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 overflow-auto bg-slate-950 p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex min-w-full flex-col gap-1 pb-12",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 md:w-24 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-1 gap-1",
											children: Array.from({ length: steps }).map((_, stepIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `flex-1 text-center text-[0.6rem] md:text-xs font-black ${currentStep === stepIdx ? "text-amber-400" : stepIdx % 4 === 0 ? "text-slate-400" : "text-slate-700"}`,
												children: stepIdx + 1
											}, stepIdx))
										})]
									}), [...keyboardNotes].reverse().map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-h-[32px] gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `flex w-16 md:w-24 shrink-0 items-center justify-end rounded-l-lg border-r-4 pr-2 text-xs font-bold ${note.type === "black" ? "bg-slate-900 text-slate-400 border-slate-700" : "bg-slate-200 text-slate-900 border-white"}`,
											children: note.note.replace("#", "♯")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-1 gap-1",
											children: Array.from({ length: steps }).map((_, stepIdx) => {
												const isActive = (Array.isArray(trk.notes[stepIdx]) ? trk.notes[stepIdx] : trk.notes[stepIdx] ? [trk.notes[stepIdx]] : []).some((n) => n.note === note.note);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														updateTrack(trk.id, (prev) => {
															const newNotes = [...prev.notes];
															let currentStepNotes = Array.isArray(newNotes[stepIdx]) ? [...newNotes[stepIdx]] : newNotes[stepIdx] ? [newNotes[stepIdx]] : [];
															if (isActive) currentStepNotes = currentStepNotes.filter((n) => n.note !== note.note);
															else currentStepNotes.push({
																note: note.note,
																freq: note.freq,
																velocity: .9
															});
															newNotes[stepIdx] = currentStepNotes.length > 0 ? currentStepNotes : null;
															return {
																...prev,
																notes: newNotes
															};
														});
													},
													className: `flex-1 rounded-md border transition-all ${isActive ? "border-sky-300 bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.5)]" : isPlaying && currentStep === stepIdx ? "border-amber-400/50 bg-amber-400/10" : "border-slate-800 bg-slate-900/50 hover:bg-slate-800"}`
												}, stepIdx);
											})
										})]
									}, note.note))]
								})
							})] });
						})()
					})
				}) })
			]
		})
	});
}
//#endregion
//#region src/components/Musik/LyricsEditor.jsx
function LyricsEditor() {
	const [lyrics, setLyrics] = (0, import_react.useState)("");
	const [savedSongs, setSavedSongs] = (0, import_react.useState)([]);
	const [title, setTitle] = (0, import_react.useState)("Mein neuer Song");
	const [isEditingTitle, setIsEditingTitle] = (0, import_react.useState)(false);
	const saveSong = () => {
		if (lyrics.trim() === "") return;
		playSparkle();
		setSavedSongs([{
			title,
			lyrics,
			date: (/* @__PURE__ */ new Date()).toLocaleDateString()
		}, ...savedSongs]);
		setLyrics("");
		setTitle("Mein neuer Song");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col lg:flex-row gap-8 w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:w-2/3 flex flex-col gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-[#fdfbf7] rounded-[40px] border-4 border-slate-200 shadow-xl overflow-hidden paper-texture p-8 min-h-[500px] flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-4 mb-8 border-b-2 border-slate-200 pb-4",
					children: isEditingTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: title,
						onChange: (e) => setTitle(e.target.value),
						onBlur: () => setIsEditingTitle(false),
						autoFocus: true,
						className: "font-hand text-4xl font-bold text-slate-800 bg-transparent border-none outline-none w-full"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-hand text-4xl font-bold text-slate-800 cursor-pointer hover:text-rose-500 transition-colors flex items-center gap-4",
						onClick: () => {
							playPop();
							setIsEditingTitle(true);
						},
						children: [
							title,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl text-slate-400",
								children: "✎"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: lyrics,
					onChange: (e) => setLyrics(e.target.value),
					placeholder: "Schreibe deinen Songtext hier...",
					className: "w-full flex-grow font-hand text-3xl leading-relaxed text-slate-700 bg-transparent border-none outline-none resize-none placeholder:opacity-30",
					style: {
						backgroundImage: "linear-gradient(transparent, transparent 38px, #e2e8f0 38px, #e2e8f0 40px)",
						backgroundSize: "100% 40px",
						lineHeight: "40px"
					}
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
					whileHover: { scale: 1.05 },
					whileTap: { scale: .95 },
					onClick: saveSong,
					className: "px-8 py-3 bg-fuchsia-500 text-white font-sans font-bold text-xl rounded-full shadow-lg hover:bg-fuchsia-600 transition-all flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💾" }), " Speichern"]
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:w-1/3 bg-white/60 backdrop-blur-md rounded-3xl p-6 border-2 border-white shadow-xl flex flex-col gap-6 max-h-[600px] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-hand text-3xl font-bold text-slate-700 border-b pb-2",
				children: "Meine Hits"
			}), savedSongs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-xl text-slate-400 opacity-60 text-center mt-10",
				children: "Noch keine Songs gespeichert."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: savedSongs.map((song, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						x: 20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					className: "bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow",
					onClick: () => {
						playPop();
						setTitle(song.title);
						setLyrics(song.lyrics);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-xl font-bold text-slate-700",
						children: song.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-sans text-slate-400 mt-1",
						children: song.date
					})]
				}, i)) })
			})]
		})]
	});
}
//#endregion
//#region src/components/Musik/FreePlay.jsx
var NOTES$1 = [
	{
		name: "C",
		freq: 261.63,
		color: "#fca5a5",
		key: "a"
	},
	{
		name: "D",
		freq: 293.66,
		color: "#fcd34d",
		key: "s"
	},
	{
		name: "E",
		freq: 329.63,
		color: "#6ee7b7",
		key: "d"
	},
	{
		name: "F",
		freq: 349.23,
		color: "#60a5fa",
		key: "f"
	},
	{
		name: "G",
		freq: 392,
		color: "#c084fc",
		key: "g"
	},
	{
		name: "A",
		freq: 440,
		color: "#f472b6",
		key: "h"
	},
	{
		name: "B",
		freq: 493.88,
		color: "#fb923c",
		key: "j"
	},
	{
		name: "C5",
		freq: 523.25,
		color: "#fca5a5",
		key: "k"
	}
];
var INSTRUMENTS$1 = [
	{
		id: "piano",
		name: "Klavier",
		icon: "🎹",
		color: "#6366f1",
		hint: "weich und klar"
	},
	{
		id: "glockenspiel",
		name: "Glockenspiel",
		icon: "🔔",
		color: "#f59e0b",
		hint: "hell und funkelnd"
	},
	{
		id: "floete",
		name: "Flöte",
		icon: "🪈",
		color: "#14b8a6",
		hint: "luftig und sanft"
	},
	{
		id: "geige",
		name: "Geige",
		icon: "🎻",
		color: "#ef4444",
		hint: "warm gestrichen"
	},
	{
		id: "gitarre",
		name: "Gitarre",
		icon: "🎸",
		color: "#d97706",
		hint: "gezupft"
	},
	{
		id: "bass",
		name: "Kontrabass",
		icon: "🎻",
		color: "#475569",
		hint: "tief und rund"
	},
	{
		id: "orgel",
		name: "Orgel",
		icon: "⛪",
		color: "#8b5cf6",
		hint: "voll und tragend"
	},
	{
		id: "xylophon",
		name: "Xylophon",
		icon: "🪵",
		color: "#22c55e",
		hint: "kurz und hüpfend"
	},
	{
		id: "kalimba",
		name: "Kalimba",
		icon: "🫧",
		color: "#06b6d4",
		hint: "kleine Tropfen"
	},
	{
		id: "trompete",
		name: "Trompete",
		icon: "🎺",
		color: "#f97316",
		hint: "mutig und hell"
	},
	{
		id: "chor",
		name: "Chor",
		icon: "🎶",
		color: "#ec4899",
		hint: "weich schwebend"
	},
	{
		id: "traum",
		name: "Traum-Synth",
		icon: "✨",
		color: "#a855f7",
		hint: "schimmernd"
	}
];
var OCTAVES = [
	{
		id: "low",
		label: "tief",
		factor: .5
	},
	{
		id: "middle",
		label: "mittel",
		factor: 1
	},
	{
		id: "high",
		label: "hoch",
		factor: 2
	}
];
function FreePlay() {
	const [activeNote, setActiveNote] = (0, import_react.useState)(null);
	const [activeInstrument, setActiveInstrument] = (0, import_react.useState)(INSTRUMENTS$1[0]);
	const [activeOctave, setActiveOctave] = (0, import_react.useState)(OCTAVES[1]);
	const triggerNote = (0, import_react.useCallback)((note) => {
		setActiveNote(note.name);
		setTimeout(() => setActiveNote(null), 220);
		try {
			playInstrumentTone(activeInstrument.id, note.freq * activeOctave.factor, {
				velocity: .95,
				send: .24
			});
		} catch (e) {
			console.log(e);
		}
	}, [activeInstrument, activeOctave]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (event) => {
			if (event.repeat) return;
			const key = event.key.toLowerCase();
			const note = NOTES$1.find((item) => item.key === key);
			if (!note) return;
			event.preventDefault();
			triggerNote(note);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [triggerNote]);
	const selectInstrument = (instrument) => {
		playInstrumentTone(instrument.id, 329.63, {
			velocity: .7,
			send: .2
		});
		setActiveInstrument(instrument);
	};
	const selectOctave = (octave) => {
		playJingle("start");
		setActiveOctave(octave);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8 w-full max-w-6xl mx-auto items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-4xl font-bold text-slate-800",
					children: "Freies Instrumenten-Spiel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500",
					children: "Wähle ein Instrument und spiele mit Tasten oder Computertastatur (A-K)."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full bg-white/60 backdrop-blur-md rounded-[46px] p-6 border-4 border-white shadow-2xl relative z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-20 h-20 rounded-[26px] border-4 border-white shadow-lg flex items-center justify-center text-5xl",
								style: { backgroundColor: `${activeInstrument.color}22` },
								children: activeInstrument.icon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400",
									children: "Aktives Instrument"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-hand text-4xl font-bold text-slate-800",
									children: activeInstrument.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-hand text-xl text-slate-500",
									children: activeInstrument.hint
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 bg-white/70 rounded-full p-2 border-2 border-white shadow-inner w-fit",
							children: OCTAVES.map((octave) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => selectOctave(octave),
								className: `px-5 py-2 rounded-full font-hand text-xl font-bold transition-all ${activeOctave.id === octave.id ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-white"}`,
								children: octave.label
							}, octave.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8",
						children: INSTRUMENTS$1.map((instrument) => {
							const isActive = activeInstrument.id === instrument.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
								whileHover: {
									scale: 1.04,
									y: -3
								},
								whileTap: { scale: .95 },
								onClick: () => selectInstrument(instrument),
								className: `min-h-28 rounded-[28px] border-4 p-3 shadow-md flex flex-col items-center justify-center gap-1 transition-all ${isActive ? "border-white ring-4 ring-white scale-[1.02]" : "border-white/70 bg-white/65 hover:bg-white"}`,
								style: { backgroundColor: isActive ? `${instrument.color}22` : void 0 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-4xl",
										children: instrument.icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-hand text-2xl font-bold text-slate-700 leading-none",
										children: instrument.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-sans text-[10px] uppercase tracking-wide text-slate-400 text-center",
										children: instrument.hint
									})
								]
							}, instrument.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 p-4 bg-slate-800 rounded-3xl shadow-inner w-full justify-between overflow-x-auto relative",
						children: NOTES$1.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							whileHover: { scale: 1.02 },
							whileTap: {
								scale: .95,
								y: 10
							},
							onClick: () => {
								playPop();
								triggerNote(n);
							},
							className: `relative flex flex-col justify-end pb-8 items-center w-20 md:w-28 h-64 rounded-b-2xl cursor-pointer shadow-lg transition-colors border-2
                ${activeNote === n.name ? "border-white brightness-110" : "border-transparent"}`,
							style: {
								backgroundColor: n.color,
								boxShadow: activeNote === n.name ? `0 0 30px ${n.color}` : "none"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-hand text-3xl font-bold text-white drop-shadow-md",
								children: n.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute bottom-2 font-sans text-xs font-bold text-white/50 uppercase",
								children: n.key
							})]
						}, n.name))
					})
				]
			}),
			activeNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 pointer-events-none z-[-1] opacity-20 transition-colors duration-300",
				style: { backgroundColor: activeInstrument.color || NOTES$1.find((n) => n.name === activeNote)?.color || "transparent" }
			})
		]
	});
}
//#endregion
//#region src/components/games/KlangMemory.jsx
var INSTRUMENTS = MUSIC_MEMORY_INSTRUMENTS;
var shuffle = (items) => [...items].map((item) => ({
	item,
	sort: Math.random()
})).sort((a, b) => a.sort - b.sort).map(({ item }) => item);
function makeDeck() {
	return shuffle(shuffle(INSTRUMENTS).slice(0, 6).flatMap((instrument) => [{
		cardId: `${instrument.id}-icon`,
		pairId: instrument.id,
		kind: "icon",
		label: instrument.icon,
		freq: instrument.freq
	}, {
		cardId: `${instrument.id}-word`,
		pairId: instrument.id,
		kind: "word",
		label: instrument.word,
		freq: instrument.freq
	}]));
}
function KlangMemory({ onCorrect = () => {}, onWrong = () => {} }) {
	const [seed, setSeed] = (0, import_react.useState)(0);
	const deck = (0, import_react.useMemo)(() => makeDeck(), [seed]);
	const pairCount = deck.length / 2;
	const [open, setOpen] = (0, import_react.useState)([]);
	const [matched, setMatched] = (0, import_react.useState)([]);
	const [locked, setLocked] = (0, import_react.useState)(false);
	const choose = (card) => {
		if (locked || open.includes(card.cardId) || matched.includes(card.pairId)) return;
		playPop();
		if (card.kind === "icon") playSynth(card.freq);
		const nextOpen = [...open, card.cardId];
		setOpen(nextOpen);
		if (nextOpen.length === 2) {
			const selected = deck.filter((item) => nextOpen.includes(item.cardId));
			setLocked(true);
			if (selected[0].pairId === selected[1].pairId) setTimeout(() => {
				const nextMatched = [...matched, selected[0].pairId];
				setMatched(nextMatched);
				setOpen([]);
				setLocked(false);
				playSparkle();
				onCorrect(4);
				if (nextMatched.length === pairCount) confetti_module_default({
					particleCount: 150,
					spread: 100,
					origin: { y: .75 }
				});
			}, 650);
			else setTimeout(() => {
				playError();
				onWrong();
				setOpen([]);
				setLocked(false);
			}, 850);
		}
	};
	const reset = () => {
		playPop();
		setOpen([]);
		setMatched([]);
		setSeed((value) => value + 1);
	};
	const isVisible = (card) => open.includes(card.cardId) || matched.includes(card.pairId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-6xl mx-auto py-8 flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Klang-Memory"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Finde Instrument und Namen. Bildkarten klingen kurz an."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-5 gap-4 bg-fuchsia-50/70 rounded-[54px] border-4 border-white shadow-2xl p-6 paper-texture",
				children: deck.map((card) => {
					const visible = isVisible(card);
					const done = matched.includes(card.pairId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
						whileHover: {
							scale: done ? 1 : 1.04,
							y: done ? 0 : -3
						},
						whileTap: { scale: .96 },
						onClick: () => choose(card),
						className: `aspect-square rounded-[32px] border-4 shadow-lg flex items-center justify-center transition-all ${done ? "bg-emerald-50 border-emerald-200" : visible ? "bg-white border-fuchsia-200" : "bg-white/70 border-white"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							mode: "wait",
							children: visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
								initial: {
									rotateY: 90,
									opacity: 0
								},
								animate: {
									rotateY: 0,
									opacity: 1
								},
								exit: {
									rotateY: -90,
									opacity: 0
								},
								className: card.kind === "icon" ? "text-6xl" : "font-hand text-3xl font-bold text-slate-700",
								children: card.label
							}, "front") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								className: "font-hand text-6xl text-fuchsia-300",
								children: "♪"
							}, "back")
						})
					}, card.cardId);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-20 flex flex-col items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-hand text-2xl text-slate-500",
						children: [
							matched.length,
							" von ",
							pairCount,
							" Klängen gefunden · ",
							INSTRUMENTS.length,
							" Instrumente im Pool"
						]
					}),
					matched.length === pairCount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-3xl font-bold text-emerald-600",
						children: "Deine Ohren haben gut gesucht."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: reset,
						className: "px-7 py-3 bg-fuchsia-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
						children: "Neu mischen"
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/games/RhythmusGarten.jsx
var BEATS = {
	stampf: {
		label: "Stampf",
		icon: "🦶",
		sound: playKick,
		color: "bg-amber-100 border-amber-200 text-amber-700"
	},
	klatsch: {
		label: "Klatsch",
		icon: "👏",
		sound: playSnare,
		color: "bg-rose-100 border-rose-200 text-rose-700"
	},
	zisch: {
		label: "Zisch",
		icon: "✨",
		sound: playHiHat,
		color: "bg-sky-100 border-sky-200 text-sky-700"
	}
};
var PATTERNS = MUSIC_RHYTHM_PATTERNS;
function RhythmusGarten({ onCorrect = () => {}, onWrong = () => {} }) {
	const [patternIndex, setPatternIndex] = (0, import_react.useState)(0);
	const [sequence, setSequence] = (0, import_react.useState)([]);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const pattern = PATTERNS[patternIndex];
	const addBeat = (id) => {
		if (feedback === "richtig") return;
		BEATS[id].sound();
		const next = [...sequence, id].slice(0, pattern.pattern.length);
		setSequence(next);
		if (next.length === pattern.pattern.length) if (next.join(",") === pattern.pattern.join(",")) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(5);
			confetti_module_default({
				particleCount: 120,
				spread: 100,
				origin: { y: .75 }
			});
		} else {
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setSequence([]);
				setFeedback(null);
			}, 1200);
		}
	};
	const playPattern = () => {
		playPop();
		pattern.pattern.forEach((id, index) => {
			setTimeout(() => BEATS[id].sound(), index * 360);
		});
	};
	const next = () => {
		playPop();
		setPatternIndex((patternIndex + 1) % PATTERNS.length);
		setSequence([]);
		setFeedback(null);
	};
	const clear = () => {
		playPop();
		setSequence([]);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-6xl mx-auto py-8 flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Rhythmus-Garten"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Höre oder lies den Rhythmus und spiele ihn nach."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-amber-50/70 rounded-[56px] border-4 border-white shadow-2xl p-8 paper-texture",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-xs uppercase tracking-widest font-bold text-amber-600",
						children: "Pattern"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-hand text-4xl font-bold text-slate-700",
						children: pattern.title
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: playPattern,
						className: "px-7 py-3 bg-amber-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
						children: "Anhören"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-3 md:gap-5",
					children: pattern.pattern.map((id, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							scale: .8,
							opacity: 0
						},
						animate: {
							scale: 1,
							opacity: 1
						},
						transition: { delay: index * .08 },
						className: `min-h-28 rounded-[30px] border-4 shadow-md flex flex-col items-center justify-center ${BEATS[id].color}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-5xl",
							children: BEATS[id].icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-xl font-bold",
							children: BEATS[id].label
						})]
					}, `${patternIndex}-${index}`))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-4",
				children: Object.entries(BEATS).map(([id, beat]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
					whileHover: {
						scale: 1.06,
						y: -4
					},
					whileTap: { scale: .94 },
					onClick: () => addBeat(id),
					className: `w-32 h-32 rounded-[36px] border-4 shadow-lg flex flex-col items-center justify-center ${beat.color}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-6xl",
						children: beat.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-2xl font-bold",
						children: beat.label
					})]
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white/65 rounded-[36px] border-4 border-white shadow-lg p-5 min-h-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-xs font-bold uppercase tracking-widest text-slate-400 mb-3",
					children: "Dein Rhythmus"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [sequence.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-2xl text-slate-400",
						children: "Tippe die Klangsteine an."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: sequence.map((id, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
						initial: { scale: 0 },
						animate: { scale: 1 },
						exit: { scale: 0 },
						className: `px-4 py-2 rounded-2xl border-2 font-hand text-2xl font-bold ${BEATS[id].color}`,
						children: [
							BEATS[id].icon,
							" ",
							BEATS[id].label
						]
					}, `${id}-${index}`)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-20 text-center",
				children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-3xl font-bold text-rose-500",
					children: "Der Rhythmus stolpert noch. Versuch ihn langsam."
				}), feedback === "richtig" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-3xl font-bold text-emerald-600",
						children: "Das groovt."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: next,
						className: "px-8 py-3 bg-emerald-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
						children: "Neuer Rhythmus"
					})]
				}) : sequence.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: clear,
					className: "px-7 py-3 bg-white text-slate-500 rounded-full font-hand text-2xl font-bold shadow-md border-2 border-slate-100",
					children: "Leeren"
				})]
			})
		]
	});
}
//#endregion
//#region src/modules/MusikModule.jsx
var SubjectPremiumAtelier = (0, import_react.lazy)(() => __vitePreload(() => import("./SubjectPremiumAtelier-OFFtJlBa.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])));
var SkyWonderland = (0, import_react.lazy)(() => __vitePreload(() => import("./SkyWonderland-Bz4SaHcY.js"), __vite__mapDeps([13,1,2,3,4,12,14,7,8])));
var DeepLearningQuest = (0, import_react.lazy)(() => __vitePreload(() => import("./DeepLearningQuest-CbOGahul.js"), __vite__mapDeps([5,1,2,3,4,6,7,8,9])));
var LearningArcade = (0, import_react.lazy)(() => __vitePreload(() => import("./LearningArcade-BGnmy9QN.js"), __vite__mapDeps([15,1,2,3,4,10,6,12,16,8,9])));
var NOTES = [
	{
		name: "C",
		freq: 261.63,
		color: "#fca5a5",
		y: 80
	},
	{
		name: "D",
		freq: 293.66,
		color: "#fcd34d",
		y: 70
	},
	{
		name: "E",
		freq: 329.63,
		color: "#6ee7b7",
		y: 60
	},
	{
		name: "F",
		freq: 349.23,
		color: "#60a5fa",
		y: 50
	},
	{
		name: "G",
		freq: 392,
		color: "#c084fc",
		y: 40
	},
	{
		name: "A",
		freq: 440,
		color: "#f472b6",
		y: 30
	}
];
function MusikModule({ onCorrect = () => {}, onWrong = () => {} }) {
	const [placedNotes, setPlacedNotes] = (0, import_react.useState)([]);
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("himmelwelt");
	const [playheadX, setPlayheadX] = (0, import_react.useState)(0);
	const boardRef = (0, import_react.useRef)(null);
	useAnimationControls();
	const triggerNote = (0, import_react.useCallback)((freq) => {
		try {
			playInstrumentTone("traum", freq, {
				velocity: .72,
				send: .28
			});
		} catch (e) {
			console.log("Audio Error:", e);
		}
	}, []);
	const handleDragEndFromPalette = (note, point) => {
		if (!boardRef.current) return;
		const board = boardRef.current.getBoundingClientRect();
		const boardLeft = board.left + window.scrollX;
		const boardRight = board.right + window.scrollX;
		const boardTop = board.top + window.scrollY;
		const boardBottom = board.bottom + window.scrollY;
		const buffer = 30;
		if (point.x >= boardLeft - buffer && point.x <= boardRight + buffer && point.y >= boardTop - buffer && point.y <= boardBottom + buffer) {
			playPop();
			const x = point.x - boardLeft - 24;
			const yRelative = point.y - boardTop;
			const closestNote = NOTES.reduce((prev, curr) => Math.abs(curr.y * 4.5 - yRelative) < Math.abs(prev.y * 4.5 - yRelative) ? curr : prev);
			setPlacedNotes((prev) => [...prev, {
				id: Date.now(),
				freq: closestNote.freq,
				color: closestNote.color,
				x: Math.max(0, Math.min(x, board.width - 48)),
				y: closestNote.y * 4.5 - 24,
				name: closestNote.name
			}]);
		}
	};
	const removeItem = (id) => {
		playPop();
		setPlacedNotes((prev) => prev.filter((n) => n.id !== id));
	};
	(0, import_react.useEffect)(() => {
		if (isPlaying) {
			const startTime = Date.now();
			const duration = 4e3;
			const triggeredRef = /* @__PURE__ */ new Set();
			const interval = setInterval(() => {
				const currentX = (Date.now() - startTime) % duration / duration * 100;
				setPlayheadX(currentX);
				placedNotes.forEach((note) => {
					const noteProgress = note.x / boardRef.current.clientWidth * 100;
					if (Math.abs(currentX - noteProgress) < 1 && !triggeredRef.has(note.id)) {
						triggerNote(note.freq);
						triggeredRef.add(note.id);
						setTimeout(() => triggeredRef.delete(note.id), 200);
					}
				});
			}, 16);
			return () => clearInterval(interval);
		} else setPlayheadX(0);
	}, [
		isPlaying,
		placedNotes,
		triggerNote
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-10 w-full max-w-6xl mx-auto pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-4xl font-bold text-slate-800",
					children: "Klang & Instrumente"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500",
					children: "Hören, bauen, vergleichen."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap justify-center gap-4 mb-4",
				children: [
					{
						id: "himmelwelt",
						label: "Himmelswelt",
						icon: "🌤️"
					},
					{
						id: "arcade",
						label: "Arcade-Welt",
						icon: "🎮"
					},
					{
						id: "sinn",
						label: "Denk-Abenteuer",
						icon: "🧭"
					},
					{
						id: "melodie",
						label: "Zauber-Melodie",
						icon: "🎵"
					},
					{
						id: "rhythmus",
						label: "Rhythmus-Garten",
						icon: "🌿"
					},
					{
						id: "klangmemory",
						label: "Klang-Memory",
						icon: "🔔"
					},
					{
						id: "beat",
						label: "Beat Studio",
						icon: "🥁"
					},
					{
						id: "lyrics",
						label: "Songtexte",
						icon: "📝"
					},
					{
						id: "freeplay",
						label: "Freies Spielen",
						icon: "🎹"
					},
					{
						id: "spielwelt",
						label: "Spielwelt",
						icon: "🎲"
					},
					{
						id: "quest",
						label: "Quest-Mixer",
						icon: "🧭"
					},
					{
						id: "premium",
						label: "Premium-Atelier",
						icon: "✨"
					},
					{
						id: "action",
						label: "Klang-Fangspiel",
						icon: "💫"
					},
					{
						id: "klanglabor",
						label: "Mega-Auswahl",
						icon: "🧭"
					}
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						playPop();
						setActiveTab(tab.id);
					},
					className: `px-6 py-3 rounded-full font-sans font-bold text-lg transition-all flex items-center gap-2 ${activeTab === tab.id ? "bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/40 transform scale-105" : "bg-white/60 text-slate-500 hover:bg-white/80"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.icon }),
						" ",
						tab.label
					]
				}, tab.id))
			}),
			activeTab === "himmelwelt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[620px] rounded-[34px] bg-sky-100/80 border-4 border-white shadow-lg" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyWonderland, {
					title: "Klang-Himmel",
					onCorrect,
					onWrong
				})
			}),
			activeTab === "arcade" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[660px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearningArcade, {
					subject: "musik",
					onCorrect,
					onWrong
				})
			}),
			activeTab === "sinn" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[640px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeepLearningQuest, {
					subject: "musik",
					onCorrect,
					onWrong
				})
			}),
			activeTab === "melodie" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col lg:flex-row gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:w-1/4 bg-white/60 backdrop-blur-md rounded-3xl p-6 border-2 border-white shadow-xl relative z-50 flex flex-col gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-hand text-2xl font-bold text-slate-700 border-b pb-2",
						children: "Notenschrank"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap lg:flex-col gap-4 justify-center items-center",
						children: NOTES.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							drag: true,
							dragSnapToOrigin: true,
							dragConstraints: null,
							onDragEnd: (e, info) => handleDragEndFromPalette(n, info.point),
							whileDrag: {
								scale: 1.3,
								zIndex: 100
							},
							whileHover: { scale: 1.1 },
							className: "w-14 h-14 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg border-2 border-white text-white font-hand text-2xl font-bold hover:drag-shadow active:drag-shadow transition-shadow",
							style: { backgroundColor: n.color },
							children: n.name
						}, n.name))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:w-3/4 flex flex-col gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: boardRef,
						className: "music-drop-zone relative h-[450px] bg-white rounded-[40px] border-4 border-slate-100 shadow-2xl overflow-hidden paper-texture",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex flex-col justify-around py-20 pointer-events-none opacity-20",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-0.5 bg-slate-800 w-full" }, l))
							}),
							isPlaying && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								className: "absolute top-0 bottom-0 w-1 bg-rose-400 z-50 shadow-[0_0_15px_rgba(244,63,94,0.5)]",
								style: { left: `${playheadX}%` }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: placedNotes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
								initial: { scale: 0 },
								animate: { scale: 1 },
								exit: { scale: 0 },
								className: "absolute w-12 h-12 rounded-full cursor-pointer flex items-center justify-center text-white font-hand text-xl font-bold shadow-md z-10 watercolor-effect hover:drag-shadow active:drag-shadow transition-shadow",
								style: {
									left: n.x,
									top: n.y,
									backgroundColor: n.color
								},
								onDoubleClick: () => removeItem(n.id),
								whileHover: { scale: 1.1 },
								children: n.name
							}, n.id)) }),
							placedNotes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-hand text-5xl text-slate-800 rotate-[-2deg]",
									children: "Schreibe dein Lied..."
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between bg-white/70 backdrop-blur-sm p-6 rounded-[30px] border-2 border-white shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
								whileHover: { scale: 1.05 },
								whileTap: { scale: .95 },
								onClick: () => {
									const nextState = !isPlaying;
									if (nextState) {
										const ctx = getAudioContext();
										if (ctx?.state === "suspended") ctx.resume();
										playJingle("start");
									}
									setIsPlaying(nextState);
								},
								className: `px-12 py-4 rounded-2xl font-sans font-bold text-xl shadow-lg transition-all flex items-center gap-3
                  ${isPlaying ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`,
								children: isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-4 bg-white rounded-sm" }), " Stop"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent" }), " Lied abspielen"] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setPlacedNotes([]),
								className: "font-hand text-2xl text-slate-400 px-4",
								children: "Alles löschen"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-xs font-bold text-slate-400 uppercase tracking-widest",
								children: "Töne im Lied"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-hand text-4xl text-slate-800 font-bold",
								children: placedNotes.length
							})]
						})]
					})]
				})]
			}),
			activeTab === "rhythmus" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RhythmusGarten, {
				onCorrect,
				onWrong
			}),
			activeTab === "klangmemory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KlangMemory, {
				onCorrect,
				onWrong
			}),
			activeTab === "beat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeatMaker, {}),
			activeTab === "lyrics" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LyricsEditor, {}),
			activeTab === "freeplay" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreePlay, {}),
			activeTab === "spielwelt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameWorld, {
				title: "Klang-Spielwelt",
				intro: "Acht Spielarten für Instrumente, Rhythmus, Klangfarben, Tempo und Premium-Orchesterkarten.",
				collections: SUBJECT_VARIANT_CONTENT.musik,
				accent: "bg-fuchsia-500",
				scene: "music",
				onCorrect,
				onWrong
			}),
			activeTab === "quest" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestMixer, {
				title: "Klang-Quest-Mixer",
				intro: "Expedition, Puzzle, Sternenlauf und Kartenwirbel für Instrumente, Tempo, Klangfarben und Orchesterwissen.",
				collections: SUBJECT_VARIANT_CONTENT.musik,
				accent: "bg-emerald-500",
				onCorrect,
				onWrong
			}),
			activeTab === "premium" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[360px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectPremiumAtelier, {
					subject: "musik",
					onCorrect,
					onWrong
				})
			}),
			activeTab === "action" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionArena, {
				title: "Klang-Fangspiel",
				intro: "Fang Instrumente, Muster und Klangwörter mit Zeit, Herzen und Combo.",
				collections: SUBJECT_VARIANT_CONTENT.musik,
				accent: "bg-fuchsia-500",
				onCorrect,
				onWrong
			}),
			activeTab === "klanglabor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantStudio, {
				title: "Klang-Mega-Auswahl",
				intro: "Viele Instrumenten-, Rhythmus-, Tempo-, Dynamik-, Orchester- und Klangfarbenkarten zum Hören, Denken und Spielen.",
				collections: SUBJECT_VARIANT_CONTENT.musik,
				onCorrect,
				onWrong
			})
		]
	});
}
//#endregion
export { MusikModule as default };
