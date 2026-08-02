import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { S as LayoutGroupContext, b as useIsomorphicLayoutEffect, n as usePresence, r as MotionConfigContext, s as isHTMLElement, x as useConstant, y as PresenceContext } from "./proxy--6s_pC9q.js";
//#region node_modules/framer-motion/dist/es/utils/use-composed-ref.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Taken from https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/compose-refs.tsx
*/
/**
* Set a given ref to a given value
* This utility takes care of different types of refs: callback refs and RefObject(s)
*/
function setRef(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
/**
* A utility to compose multiple refs together
* Accepts callback refs and RefObject(s)
*/
function composeRefs(...refs) {
	return (node) => {
		let hasCleanup = false;
		const cleanups = refs.map((ref) => {
			const cleanup = setRef(ref, node);
			if (!hasCleanup && typeof cleanup === "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup === "function") cleanup();
				else setRef(refs[i], null);
			}
		};
	};
}
/**
* A custom hook that composes multiple refs
* Accepts callback refs and RefObject(s)
*/
function useComposedRefs(...refs) {
	return import_react.useCallback(composeRefs(...refs), refs);
}
//#endregion
//#region node_modules/framer-motion/dist/es/components/AnimatePresence/PopChild.mjs
var import_jsx_runtime = require_jsx_runtime();
/**
* Measurement functionality has to be within a separate component
* to leverage snapshot lifecycle.
*/
var PopChildMeasure = class extends import_react.Component {
	getSnapshotBeforeUpdate(prevProps) {
		const element = this.props.childRef.current;
		if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
			const parent = element.offsetParent;
			const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
			const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
			const computedStyle = getComputedStyle(element);
			const size = this.props.sizeRef.current;
			size.height = parseFloat(computedStyle.height);
			size.width = parseFloat(computedStyle.width);
			size.top = element.offsetTop;
			size.left = element.offsetLeft;
			size.right = parentWidth - size.width - size.left;
			size.bottom = parentHeight - size.height - size.top;
		}
		return null;
	}
	/**
	* Required with getSnapshotBeforeUpdate to stop React complaining.
	*/
	componentDidUpdate() {}
	render() {
		return this.props.children;
	}
};
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
	const id = (0, import_react.useId)();
	const ref = (0, import_react.useRef)(null);
	const size = (0, import_react.useRef)({
		width: 0,
		height: 0,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	});
	const { nonce } = (0, import_react.useContext)(MotionConfigContext);
	const composedRef = useComposedRefs(ref, children.props?.ref ?? children?.ref);
	/**
	* We create and inject a style block so we can apply this explicit
	* sizing in a non-destructive manner by just deleting the style block.
	*
	* We can't apply size via render as the measurement happens
	* in getSnapshotBeforeUpdate (post-render), likewise if we apply the
	* styles directly on the DOM node, we might be overwriting
	* styles set via the style prop.
	*/
	(0, import_react.useInsertionEffect)(() => {
		const { width, height, top, left, right, bottom } = size.current;
		if (isPresent || pop === false || !ref.current || !width || !height) return;
		const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
		const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
		ref.current.dataset.motionPopId = id;
		const style = document.createElement("style");
		if (nonce) style.nonce = nonce;
		const parent = root ?? document.head;
		parent.appendChild(style);
		if (style.sheet) style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
		return () => {
			ref.current?.removeAttribute("data-motion-pop-id");
			if (parent.contains(style)) parent.removeChild(style);
		};
	}, [isPresent]);
	return (0, import_jsx_runtime.jsx)(PopChildMeasure, {
		isPresent,
		childRef: ref,
		sizeRef: size,
		pop,
		children: pop === false ? children : import_react.cloneElement(children, { ref: composedRef })
	});
}
//#endregion
//#region node_modules/framer-motion/dist/es/components/AnimatePresence/PresenceChild.mjs
var PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
	const presenceChildren = useConstant(newChildrenMap);
	const id = (0, import_react.useId)();
	let isReusedContext = true;
	let context = (0, import_react.useMemo)(() => {
		isReusedContext = false;
		return {
			id,
			initial,
			isPresent,
			custom,
			onExitComplete: (childId) => {
				presenceChildren.set(childId, true);
				for (const isComplete of presenceChildren.values()) if (!isComplete) return;
				onExitComplete && onExitComplete();
			},
			register: (childId) => {
				presenceChildren.set(childId, false);
				return () => presenceChildren.delete(childId);
			}
		};
	}, [
		isPresent,
		presenceChildren,
		onExitComplete
	]);
	/**
	* If the presence of a child affects the layout of the components around it,
	* we want to make a new context value to ensure they get re-rendered
	* so they can detect that layout change.
	*/
	if (presenceAffectsLayout && isReusedContext) context = { ...context };
	(0, import_react.useMemo)(() => {
		presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
	}, [isPresent]);
	/**
	* If there's no `motion` components to fire exit animations, we want to remove this
	* component immediately.
	*/
	import_react.useEffect(() => {
		!isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
	}, [isPresent]);
	children = (0, import_jsx_runtime.jsx)(PopChild, {
		pop: mode === "popLayout",
		isPresent,
		anchorX,
		anchorY,
		root,
		children
	});
	return (0, import_jsx_runtime.jsx)(PresenceContext.Provider, {
		value: context,
		children
	});
};
function newChildrenMap() {
	return /* @__PURE__ */ new Map();
}
//#endregion
//#region node_modules/framer-motion/dist/es/components/AnimatePresence/utils.mjs
var getChildKey = (child) => child.key || "";
function onlyElements(children) {
	const filtered = [];
	import_react.Children.forEach(children, (child) => {
		if ((0, import_react.isValidElement)(child)) filtered.push(child);
	});
	return filtered;
}
//#endregion
//#region node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs
/**
* `AnimatePresence` enables the animation of components that have been removed from the tree.
*
* When adding/removing more than a single child, every child **must** be given a unique `key` prop.
*
* Any `motion` components that have an `exit` property defined will animate out when removed from
* the tree.
*
* ```jsx
* import { motion, AnimatePresence } from 'framer-motion'
*
* export const Items = ({ items }) => (
*   <AnimatePresence>
*     {items.map(item => (
*       <motion.div
*         key={item.id}
*         initial={{ opacity: 0 }}
*         animate={{ opacity: 1 }}
*         exit={{ opacity: 0 }}
*       />
*     ))}
*   </AnimatePresence>
* )
* ```
*
* You can sequence exit animations throughout a tree using variants.
*
* If a child contains multiple `motion` components with `exit` props, it will only unmount the child
* once all `motion` components have finished animating out. Likewise, any components using
* `usePresence` all need to call `safeToRemove`.
*
* @public
*/
var AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
	const [isParentPresent, safeToRemove] = usePresence(propagate);
	/**
	* Filter any children that aren't ReactElements. We can only track components
	* between renders with a props.key.
	*/
	const presentChildren = (0, import_react.useMemo)(() => onlyElements(children), [children]);
	/**
	* Track the keys of the currently rendered children. This is used to
	* determine which children are exiting.
	*/
	const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
	/**
	* If `initial={false}` we only want to pass this to components in the first render.
	*/
	const isInitialRender = (0, import_react.useRef)(true);
	/**
	* A ref containing the currently present children. When all exit animations
	* are complete, we use this to re-render the component with the latest children
	* *committed* rather than the latest children *rendered*.
	*/
	const pendingPresentChildren = (0, import_react.useRef)(presentChildren);
	/**
	* Track which exiting children have finished animating out.
	*/
	const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
	/**
	* Track which components are currently processing exit to prevent duplicate processing.
	*/
	const exitingComponents = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	/**
	* Save children to render as React state. To ensure this component is concurrent-safe,
	* we check for exiting children via an effect.
	*/
	const [diffedChildren, setDiffedChildren] = (0, import_react.useState)(presentChildren);
	const [renderedChildren, setRenderedChildren] = (0, import_react.useState)(presentChildren);
	useIsomorphicLayoutEffect(() => {
		isInitialRender.current = false;
		pendingPresentChildren.current = presentChildren;
		/**
		* Update complete status of exiting children.
		*/
		for (let i = 0; i < renderedChildren.length; i++) {
			const key = getChildKey(renderedChildren[i]);
			if (!presentKeys.includes(key)) {
				if (exitComplete.get(key) !== true) exitComplete.set(key, false);
			} else {
				exitComplete.delete(key);
				exitingComponents.current.delete(key);
			}
		}
	}, [
		renderedChildren,
		presentKeys.length,
		presentKeys.join("-")
	]);
	const exitingChildren = [];
	if (presentChildren !== diffedChildren) {
		let nextChildren = [...presentChildren];
		/**
		* Loop through all the currently rendered components and decide which
		* are exiting.
		*/
		for (let i = 0; i < renderedChildren.length; i++) {
			const child = renderedChildren[i];
			const key = getChildKey(child);
			if (!presentKeys.includes(key)) {
				nextChildren.splice(i, 0, child);
				exitingChildren.push(child);
			}
		}
		/**
		* If we're in "wait" mode, and we have exiting children, we want to
		* only render these until they've all exited.
		*/
		if (mode === "wait" && exitingChildren.length) nextChildren = exitingChildren;
		setRenderedChildren(onlyElements(nextChildren));
		setDiffedChildren(presentChildren);
		/**
		* Early return to ensure once we've set state with the latest diffed
		* children, we can immediately re-render.
		*/
		return null;
	}
	/**
	* If we've been provided a forceRender function by the LayoutGroupContext,
	* we can use it to force a re-render amongst all surrounding components once
	* all components have finished animating out.
	*/
	const { forceRender } = (0, import_react.useContext)(LayoutGroupContext);
	return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: renderedChildren.map((child) => {
		const key = getChildKey(child);
		const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
		const onExit = () => {
			if (exitingComponents.current.has(key)) return;
			if (exitComplete.has(key)) {
				exitingComponents.current.add(key);
				exitComplete.set(key, true);
			} else return;
			let isEveryExitComplete = true;
			exitComplete.forEach((isExitComplete) => {
				if (!isExitComplete) isEveryExitComplete = false;
			});
			if (isEveryExitComplete) {
				forceRender?.();
				setRenderedChildren(pendingPresentChildren.current);
				propagate && safeToRemove?.();
				onExitComplete && onExitComplete();
			}
		};
		return (0, import_jsx_runtime.jsx)(PresenceChild, {
			isPresent,
			initial: !isInitialRender.current || initial ? void 0 : false,
			custom,
			presenceAffectsLayout,
			mode,
			root,
			onExitComplete: isPresent ? void 0 : onExit,
			anchorX,
			anchorY,
			children: child
		}, key);
	}) });
};
//#endregion
//#region src/utils/sounds.js
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
var playInstrumentTone = (instrumentId = "piano", freq = 261.63, options = {}) => withSound(() => {
	const { start = 0, velocity = 1, pan = 0, send = .18 } = options;
	const out = createOutput({
		volume: Math.min(Math.max(velocity, .1), 1.4),
		send,
		pan
	});
	if (!out) return;
	const { ctx, input } = out;
	const now = ctx.currentTime + start;
	switch (instrumentId) {
		case "glockenspiel":
			voice({
				freq: freq * 2,
				type: "sine",
				start,
				attack: .006,
				hold: .16,
				release: 1.25,
				gain: .42,
				sustain: .16,
				destination: input
			});
			voice({
				freq: freq * 3.01,
				type: "sine",
				start: start + .006,
				attack: .004,
				hold: .08,
				release: .8,
				gain: .18,
				sustain: .05,
				destination: input
			});
			voice({
				freq: freq * 4.02,
				type: "sine",
				start: start + .012,
				attack: .004,
				hold: .04,
				release: .5,
				gain: .08,
				sustain: .02,
				destination: input
			});
			break;
		case "floete": {
			const osc = voice({
				freq,
				type: "sine",
				start,
				attack: .12,
				hold: .42,
				release: .45,
				gain: .32,
				sustain: .28,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 2600,
					q: .7
				}
			});
			if (osc) {
				const vibrato = ctx.createOscillator();
				const vibratoGain = ctx.createGain();
				vibrato.frequency.setValueAtTime(5.4, now);
				vibratoGain.gain.setValueAtTime(6, now);
				vibrato.connect(vibratoGain);
				vibratoGain.connect(osc.frequency);
				vibrato.start(now + .08);
				vibrato.stop(now + 1.08);
			}
			break;
		}
		case "geige":
			voice({
				freq,
				type: "sawtooth",
				start,
				attack: .09,
				hold: .46,
				release: .6,
				gain: .18,
				sustain: .16,
				detune: -5,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 1800,
					to: 2300,
					time: .25
				}
			});
			voice({
				freq: freq * 2,
				type: "triangle",
				start: start + .01,
				attack: .08,
				hold: .35,
				release: .5,
				gain: .12,
				sustain: .08,
				detune: 6,
				destination: input
			});
			break;
		case "gitarre":
			noiseBurst({
				start,
				duration: .04,
				gain: .04,
				frequency: 3600,
				filterType: "highpass",
				output: input
			});
			voice({
				freq,
				type: "triangle",
				start: start + .004,
				attack: .008,
				hold: .12,
				release: .8,
				gain: .34,
				sustain: .12,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 1500
				}
			});
			voice({
				freq: freq * 2.01,
				type: "sine",
				start: start + .01,
				attack: .006,
				hold: .06,
				release: .35,
				gain: .1,
				sustain: .02,
				destination: input
			});
			break;
		case "bass":
			voice({
				freq: freq * .5,
				type: "sine",
				start,
				attack: .015,
				hold: .18,
				release: .65,
				gain: .5,
				sustain: .18,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 700
				}
			});
			voice({
				freq: freq * .5,
				type: "square",
				start: start + .002,
				attack: .01,
				hold: .08,
				release: .35,
				gain: .07,
				sustain: .02,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 500
				}
			});
			break;
		case "orgel":
			voice({
				freq,
				type: "sine",
				start,
				attack: .035,
				hold: .65,
				release: .25,
				gain: .23,
				sustain: .21,
				destination: input
			});
			voice({
				freq: freq * 1.5,
				type: "sine",
				start,
				attack: .04,
				hold: .62,
				release: .25,
				gain: .16,
				sustain: .14,
				destination: input
			});
			voice({
				freq: freq * 2,
				type: "triangle",
				start,
				attack: .04,
				hold: .55,
				release: .22,
				gain: .08,
				sustain: .07,
				destination: input
			});
			break;
		case "xylophon":
			noiseBurst({
				start,
				duration: .03,
				gain: .05,
				frequency: 4200,
				filterType: "bandpass",
				q: 4,
				output: input
			});
			voice({
				freq: freq * 2,
				type: "sine",
				start,
				attack: .004,
				hold: .08,
				release: .42,
				gain: .42,
				sustain: .08,
				destination: input
			});
			voice({
				freq: freq * 3.03,
				type: "triangle",
				start: start + .008,
				attack: .004,
				hold: .04,
				release: .25,
				gain: .12,
				sustain: .02,
				destination: input
			});
			break;
		case "kalimba":
			voice({
				freq: freq * 1.5,
				type: "triangle",
				start,
				attack: .005,
				hold: .08,
				release: .7,
				gain: .34,
				sustain: .1,
				destination: input
			});
			voice({
				freq: freq * 2.49,
				type: "sine",
				start: start + .01,
				attack: .006,
				hold: .04,
				release: .45,
				gain: .12,
				sustain: .03,
				destination: input
			});
			break;
		case "trompete":
			voice({
				freq,
				type: "sawtooth",
				start,
				attack: .055,
				hold: .28,
				release: .28,
				gain: .26,
				sustain: .2,
				destination: input,
				filter: {
					type: "bandpass",
					frequency: 1150,
					q: 2.1,
					to: 1700,
					time: .12
				}
			});
			voice({
				freq: freq * 2,
				type: "square",
				start: start + .01,
				attack: .04,
				hold: .14,
				release: .2,
				gain: .06,
				sustain: .04,
				destination: input,
				filter: {
					type: "bandpass",
					frequency: 1800,
					q: 1.5
				}
			});
			break;
		case "chor":
			voice({
				freq,
				type: "sine",
				start,
				attack: .2,
				hold: .55,
				release: .65,
				gain: .2,
				sustain: .18,
				detune: -11,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 2200
				}
			});
			voice({
				freq: freq * 1.01,
				type: "sine",
				start,
				attack: .24,
				hold: .52,
				release: .65,
				gain: .2,
				sustain: .18,
				detune: 10,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 2200
				}
			});
			voice({
				freq: freq * 1.5,
				type: "triangle",
				start: start + .03,
				attack: .22,
				hold: .42,
				release: .55,
				gain: .08,
				sustain: .06,
				destination: input
			});
			break;
		case "traum":
			voice({
				freq,
				type: "triangle",
				start,
				attack: .12,
				hold: .42,
				release: 1.1,
				gain: .22,
				sustain: .17,
				detune: -7,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 900,
					to: 3e3,
					time: .6
				}
			});
			voice({
				freq: freq * 1.5,
				type: "sine",
				start: start + .035,
				attack: .1,
				hold: .34,
				release: .95,
				gain: .14,
				sustain: .09,
				detune: 7,
				destination: input
			});
			voice({
				freq: freq * 2.01,
				type: "sine",
				start: start + .13,
				attack: .06,
				hold: .18,
				release: .8,
				gain: .08,
				sustain: .04,
				destination: input
			});
			break;
		case "synth_bass":
			voice({
				freq,
				type: "sawtooth",
				start,
				attack: .02,
				hold: .2,
				release: .4,
				gain: .28,
				sustain: .2,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 800,
					to: 300,
					time: .3
				}
			});
			voice({
				freq: freq * .5,
				type: "sine",
				start,
				attack: .02,
				hold: .3,
				release: .4,
				gain: .4,
				sustain: .3,
				destination: input
			});
			break;
		case "lofi_keys":
			noiseBurst({
				start,
				duration: .05,
				gain: .02,
				frequency: 3e3,
				filterType: "lowpass",
				output: input
			});
			voice({
				freq,
				type: "sine",
				start,
				attack: .05,
				hold: .3,
				release: .6,
				gain: .3,
				sustain: .15,
				detune: Math.sin(now * 5) * 10,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 1200
				}
			});
			voice({
				freq: freq * 2,
				type: "triangle",
				start,
				attack: .06,
				hold: .2,
				release: .5,
				gain: .1,
				sustain: .05,
				detune: Math.cos(now * 4) * 8,
				destination: input
			});
			break;
		case "brass_pad":
			voice({
				freq,
				type: "sawtooth",
				start,
				attack: .15,
				hold: .4,
				release: .6,
				gain: .2,
				sustain: .15,
				detune: -4,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 600,
					to: 2e3,
					time: .2
				}
			});
			voice({
				freq: freq * 1.01,
				type: "sawtooth",
				start,
				attack: .18,
				hold: .38,
				release: .6,
				gain: .2,
				sustain: .15,
				detune: 5,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 600,
					to: 2e3,
					time: .2
				}
			});
			break;
		case "strings_orchestral":
			voice({
				freq,
				type: "sawtooth",
				start,
				attack: .25,
				hold: .5,
				release: .8,
				gain: .15,
				sustain: .12,
				detune: -6,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 1500,
					to: 2500,
					time: .4
				}
			});
			voice({
				freq: freq * 1.005,
				type: "sawtooth",
				start,
				attack: .3,
				hold: .45,
				release: .85,
				gain: .15,
				sustain: .12,
				detune: 5,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 1600,
					to: 2400,
					time: .4
				}
			});
			voice({
				freq: freq * .5,
				type: "sawtooth",
				start,
				attack: .2,
				hold: .5,
				release: .9,
				gain: .08,
				sustain: .06,
				detune: -2,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 800
				}
			});
			break;
		case "flute_wooden": {
			noiseBurst({
				start,
				duration: .6,
				attack: .1,
				release: .3,
				gain: .03,
				frequency: 3e3,
				filterType: "bandpass",
				q: 2,
				output: input
			});
			const fluteOsc = voice({
				freq,
				type: "sine",
				start,
				attack: .15,
				hold: .4,
				release: .35,
				gain: .35,
				sustain: .25,
				destination: input
			});
			voice({
				freq: freq * 2,
				type: "sine",
				start,
				attack: .15,
				hold: .35,
				release: .3,
				gain: .05,
				sustain: .03,
				destination: input
			});
			if (fluteOsc && ctx) {
				const vibrato = ctx.createOscillator();
				const vibratoGain = ctx.createGain();
				vibrato.frequency.setValueAtTime(5.5, now);
				vibratoGain.gain.setValueAtTime(4, now);
				vibrato.connect(vibratoGain);
				vibratoGain.connect(fluteOsc.frequency);
				vibrato.start(now + .2);
				vibrato.stop(now + 1.2);
			}
			break;
		}
		case "piano_grand":
			voice({
				freq,
				type: "triangle",
				start,
				attack: .005,
				hold: .15,
				release: 1.5,
				gain: .35,
				sustain: .15,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 2500
				}
			});
			voice({
				freq: freq * 1.002,
				type: "triangle",
				start,
				attack: .005,
				hold: .15,
				release: 1.4,
				gain: .25,
				sustain: .1,
				detune: 3,
				destination: input
			});
			voice({
				freq: freq * 2,
				type: "sine",
				start,
				attack: .005,
				hold: .1,
				release: .8,
				gain: .1,
				sustain: .05,
				destination: input
			});
			voice({
				freq: freq * 3.01,
				type: "sine",
				start,
				attack: .005,
				hold: .05,
				release: .5,
				gain: .05,
				sustain: .02,
				destination: input
			});
			noiseBurst({
				start,
				duration: .03,
				gain: .02,
				frequency: 500,
				filterType: "lowpass",
				output: input
			});
			break;
		case "upright_bass":
			voice({
				freq: freq * .5,
				type: "triangle",
				start,
				attack: .01,
				hold: .2,
				release: .8,
				gain: .45,
				sustain: .15,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 800,
					to: 300,
					time: .4
				}
			});
			voice({
				freq: freq * .5,
				type: "sine",
				start,
				attack: .015,
				hold: .25,
				release: 1,
				gain: .55,
				sustain: .2,
				destination: input,
				bendTo: freq * .495,
				bendTime: .5
			});
			voice({
				freq,
				type: "sine",
				start,
				attack: .005,
				hold: .1,
				release: .4,
				gain: .1,
				sustain: .05,
				destination: input
			});
			noiseBurst({
				start,
				duration: .04,
				attack: .002,
				release: .03,
				gain: .04,
				frequency: 1200,
				filterType: "bandpass",
				q: 1,
				output: input
			});
			break;
		case "lead_saw":
			voice({
				freq,
				type: "sawtooth",
				start,
				attack: .015,
				hold: .2,
				release: .4,
				gain: .22,
				sustain: .18,
				detune: 0,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 4500,
					to: 1800,
					time: .25
				}
			});
			voice({
				freq,
				type: "sawtooth",
				start,
				attack: .02,
				hold: .2,
				release: .4,
				gain: .2,
				sustain: .16,
				detune: 14,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 4500,
					to: 1800,
					time: .25
				}
			});
			voice({
				freq,
				type: "sawtooth",
				start,
				attack: .02,
				hold: .2,
				release: .4,
				gain: .2,
				sustain: .16,
				detune: -14,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 4500,
					to: 1800,
					time: .25
				}
			});
			voice({
				freq: freq * 2,
				type: "square",
				start,
				attack: .01,
				hold: .15,
				release: .3,
				gain: .08,
				sustain: .06,
				destination: input
			});
			break;
		case "pad_warm":
			voice({
				freq,
				type: "sine",
				start,
				attack: .4,
				hold: 1,
				release: 1.5,
				gain: .28,
				sustain: .22,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 800,
					to: 1200,
					time: 1
				}
			});
			voice({
				freq: freq * 1.006,
				type: "triangle",
				start,
				attack: .5,
				hold: .9,
				release: 1.4,
				gain: .18,
				sustain: .14,
				detune: 8,
				destination: input
			});
			voice({
				freq: freq * .994,
				type: "sawtooth",
				start,
				attack: .6,
				hold: .8,
				release: 1.3,
				gain: .12,
				sustain: .08,
				detune: -8,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 600,
					to: 1e3,
					time: .8
				}
			});
			break;
		case "arp_pluck":
			voice({
				freq,
				type: "square",
				start,
				attack: .005,
				hold: .05,
				release: .2,
				gain: .2,
				sustain: .04,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 3500,
					to: 400,
					time: .12
				}
			});
			voice({
				freq,
				type: "sawtooth",
				start,
				attack: .005,
				hold: .05,
				release: .15,
				gain: .18,
				sustain: .04,
				detune: 5,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 4e3,
					to: 500,
					time: .1
				}
			});
			noiseBurst({
				start,
				duration: .02,
				gain: .04,
				frequency: 3e3,
				filterType: "highpass",
				output: input
			});
			break;
		case "bass_fm":
			voice({
				freq: freq * .5,
				type: "sine",
				start,
				attack: .01,
				hold: .15,
				release: .4,
				gain: .4,
				sustain: .25,
				destination: input
			});
			voice({
				freq,
				type: "triangle",
				start,
				attack: .01,
				hold: .1,
				release: .3,
				gain: .25,
				sustain: .1,
				detune: 0,
				destination: input,
				bendTo: freq * .98,
				bendTime: .15
			});
			voice({
				freq: freq * 2,
				type: "square",
				start,
				attack: .01,
				hold: .05,
				release: .2,
				gain: .1,
				sustain: .04,
				destination: input,
				filter: {
					type: "bandpass",
					frequency: freq * 4,
					q: 2,
					to: freq * 2,
					time: .1
				}
			});
			break;
		case "wobble_bass":
			voice({
				freq: freq * .5,
				type: "sawtooth",
				start,
				attack: .02,
				hold: .3,
				release: .4,
				gain: .3,
				sustain: .2,
				detune: -9,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 200,
					to: 2200,
					time: .15
				}
			});
			voice({
				freq: freq * .5,
				type: "sawtooth",
				start,
				attack: .02,
				hold: .3,
				release: .4,
				gain: .3,
				sustain: .2,
				detune: 9,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 200,
					to: 2200,
					time: .15
				}
			});
			voice({
				freq: freq * .25,
				type: "square",
				start,
				attack: .02,
				hold: .3,
				release: .4,
				gain: .25,
				sustain: .2,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 1e3,
					to: 300,
					time: .25
				}
			});
			break;
		default:
			noiseBurst({
				start,
				duration: .035,
				gain: .025,
				frequency: 2800,
				filterType: "highpass",
				output: input
			});
			voice({
				freq,
				type: "triangle",
				start,
				attack: .007,
				hold: .12,
				release: .72,
				gain: .34,
				sustain: .12,
				destination: input,
				filter: {
					type: "lowpass",
					frequency: 1900
				}
			});
			voice({
				freq: freq * 2.01,
				type: "sine",
				start: start + .006,
				attack: .005,
				hold: .05,
				release: .35,
				gain: .08,
				sustain: .02,
				destination: input
			});
			break;
	}
});
var playArp = (notes, instrument = "glockenspiel", { interval = .075, start = 0, velocity = .8, send = .24 } = {}) => {
	notes.forEach((freq, index) => {
		playInstrumentTone(instrument, freq, {
			start: start + index * interval,
			velocity,
			send
		});
	});
};
var playBubble = () => withSound(() => {
	const out = createOutput({
		volume: .7,
		send: .1
	});
	if (!out) return;
	voice({
		freq: 320,
		type: "sine",
		attack: .004,
		hold: .035,
		release: .12,
		gain: .22,
		destination: out.input,
		bendTo: 620,
		bendTime: .08
	});
	voice({
		freq: 720,
		type: "triangle",
		start: .015,
		attack: .003,
		hold: .025,
		release: .08,
		gain: .08,
		destination: out.input
	});
});
var playCoin = () => withSound(() => {
	playArp([
		988,
		1319,
		1760
	], "glockenspiel", {
		interval: .045,
		velocity: .82,
		send: .28
	});
});
var playWhoosh = () => withSound(() => {
	const out = createOutput({
		volume: .7,
		send: .2
	});
	if (!out) return;
	const ctx = out.ctx;
	const now = ctx.currentTime;
	const length = Math.floor(ctx.sampleRate * .34);
	const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < length; i += 1) {
		const progress = i / length;
		data[i] = (Math.random() * 2 - 1) * Math.sin(progress * Math.PI);
	}
	const source = ctx.createBufferSource();
	source.buffer = buffer;
	const filter = ctx.createBiquadFilter();
	filter.type = "bandpass";
	filter.frequency.setValueAtTime(520, now);
	filter.frequency.exponentialRampToValueAtTime(4300, now + .28);
	filter.Q.value = 1.2;
	const gain = ctx.createGain();
	envelope(gain.gain, now, .015, .16, .16, .2, .12);
	source.connect(filter);
	filter.connect(gain);
	gain.connect(out.input);
	source.start(now);
	source.stop(now + .36);
});
var playMagicDust = () => withSound(() => {
	playArp([
		659,
		784,
		988,
		1175,
		1568
	], "traum", {
		interval: .055,
		velocity: .55,
		send: .42
	});
});
var playJingle = (type = "success") => withSound(() => {
	switch (type) {
		case "start":
			playWhoosh();
			playArp([
				392,
				523,
				659
			], "kalimba", {
				interval: .07,
				start: .08,
				velocity: .7,
				send: .24
			});
			break;
		case "levelUp":
			playArp([
				523,
				659,
				784,
				1047,
				1319
			], "glockenspiel", {
				interval: .07,
				velocity: .8,
				send: .34
			});
			setTimeout(() => playInstrumentTone("chor", 523, {
				velocity: .65,
				send: .4
			}), 220);
			break;
		case "badge":
			playMagicDust();
			setTimeout(() => playInstrumentTone("chor", 659, {
				velocity: .55,
				send: .48
			}), 180);
			break;
		case "combo":
			playCoin();
			setTimeout(() => playArp([
				784,
				988,
				1175
			], "xylophon", {
				interval: .04,
				velocity: .65,
				send: .18
			}), 80);
			break;
		case "try":
			playArp([
				330,
				294,
				262
			], "kalimba", {
				interval: .07,
				velocity: .45,
				send: .16
			});
			break;
		case "calm":
			playArp([
				392,
				523,
				659,
				523
			], "chor", {
				interval: .13,
				velocity: .38,
				send: .45
			});
			break;
		default:
			playArp([
				523,
				659,
				784,
				1047
			], "glockenspiel", {
				interval: .055,
				velocity: .72,
				send: .28
			});
			break;
	}
});
var playPop = () => {
	playBubble();
};
var playSparkle = () => {
	playJingle("success");
};
var playError = () => withSound(() => {
	const out = createOutput({
		volume: .72,
		send: .16
	});
	if (!out) return;
	voice({
		freq: 220,
		type: "triangle",
		attack: .012,
		hold: .08,
		release: .25,
		gain: .18,
		destination: out.input,
		bendTo: 174,
		bendTime: .18,
		filter: {
			type: "lowpass",
			frequency: 900
		}
	});
	voice({
		freq: 294,
		type: "sine",
		start: .04,
		attack: .01,
		hold: .05,
		release: .2,
		gain: .06,
		destination: out.input
	});
});
var playKick = ({ volume = 1, pan = 0, send = .03 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 150,
		type: "sine",
		attack: .002,
		hold: .04,
		release: .44,
		gain: .72,
		destination: out.input,
		bendTo: 42,
		bendTime: .2
	});
	noiseBurst({
		duration: .025,
		gain: .08,
		frequency: 2200,
		filterType: "highpass",
		output: out.input
	});
});
var playSnare = ({ volume = .9, pan = 0, send = .08 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 178,
		type: "triangle",
		attack: .003,
		hold: .045,
		release: .18,
		gain: .18,
		destination: out.input,
		bendTo: 132,
		bendTime: .1
	});
	noiseBurst({
		duration: .18,
		attack: .004,
		release: .14,
		gain: .34,
		frequency: 1700,
		filterType: "bandpass",
		q: 1.2,
		output: out.input
	});
});
var playHiHat = ({ volume = .65, pan = 0, send = .04, open = false } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		2,
		3,
		4.16,
		5.43,
		6.79,
		8.21
	].forEach((ratio, index) => {
		voice({
			freq: 40 * ratio,
			type: "square",
			start: index * .001,
			attack: .001,
			hold: open ? .055 : .018,
			release: open ? .28 : .07,
			gain: .028,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 6500
			}
		});
	});
	noiseBurst({
		duration: open ? .34 : .08,
		attack: .001,
		release: open ? .26 : .07,
		gain: open ? .2 : .14,
		frequency: 9e3,
		filterType: "highpass",
		output: out.input
	});
});
var playClap = ({ volume = .78, pan = 0, send = .16 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		0,
		.018,
		.04
	].forEach((start, index) => {
		noiseBurst({
			start,
			duration: .08 + index * .025,
			attack: .002,
			release: .12,
			gain: .2 - index * .03,
			frequency: 1800 + index * 520,
			filterType: "bandpass",
			q: 1.3,
			output: out.input
		});
	});
});
var playRim = ({ volume = .7, pan = 0, send = .07 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 740,
		type: "square",
		attack: .001,
		hold: .025,
		release: .08,
		gain: .18,
		destination: out.input,
		filter: {
			type: "bandpass",
			frequency: 1600,
			q: 5
		}
	});
	noiseBurst({
		duration: .035,
		attack: .001,
		release: .04,
		gain: .08,
		frequency: 3200,
		filterType: "bandpass",
		q: 4,
		output: out.input
	});
});
var playTom = ({ volume = .86, pan = 0, send = .08, freq = 160 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq,
		type: "sine",
		attack: .004,
		hold: .07,
		release: .34,
		gain: .42,
		destination: out.input,
		bendTo: freq * .62,
		bendTime: .18
	});
	noiseBurst({
		duration: .045,
		gain: .04,
		frequency: 1200,
		filterType: "bandpass",
		output: out.input
	});
});
var playCrash = ({ volume = .55, pan = 0, send = .24 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	[
		2.1,
		2.7,
		3.6,
		4.4,
		5.1,
		6.3,
		7.2
	].forEach((ratio, index) => {
		voice({
			freq: 112 * ratio,
			type: "square",
			start: index * .002,
			attack: .002,
			hold: .08,
			release: .7,
			gain: .025,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 5200
			}
		});
	});
	noiseBurst({
		duration: .75,
		attack: .002,
		release: .62,
		gain: .18,
		frequency: 7800,
		filterType: "highpass",
		output: out.input
	});
});
var playShaker = ({ volume = .5, pan = 0, send = .05 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	noiseBurst({
		duration: .075,
		attack: .001,
		release: .06,
		gain: .12,
		frequency: 7200,
		filterType: "bandpass",
		q: 1.8,
		output: out.input
	});
});
var play808 = ({ volume = 1, pan = 0, send = .05, freq = 55 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq,
		type: "sine",
		attack: .02,
		hold: .4,
		release: .9,
		gain: .85,
		destination: out.input,
		bendTo: freq * .98,
		bendTime: .8
	});
	voice({
		freq: freq * 2,
		type: "square",
		attack: .01,
		hold: .1,
		release: .3,
		gain: .08,
		destination: out.input,
		filter: {
			type: "lowpass",
			frequency: 400
		}
	});
});
var playKickHiphop = ({ volume = 1, pan = 0, send = .03 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 110,
		type: "sine",
		attack: .001,
		hold: .03,
		release: .3,
		gain: .8,
		destination: out.input,
		bendTo: 30,
		bendTime: .15
	});
	voice({
		freq: 110,
		type: "square",
		attack: .001,
		hold: .02,
		release: .1,
		gain: .1,
		destination: out.input,
		filter: {
			type: "lowpass",
			frequency: 300
		}
	});
});
var playSnareHiphop = ({ volume = .9, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 220,
		type: "triangle",
		attack: .002,
		hold: .03,
		release: .2,
		gain: .25,
		destination: out.input,
		bendTo: 140,
		bendTime: .08
	});
	voice({
		freq: 160,
		type: "sine",
		attack: .002,
		hold: .05,
		release: .25,
		gain: .15,
		destination: out.input
	});
	noiseBurst({
		duration: .22,
		attack: .002,
		release: .18,
		gain: .38,
		frequency: 2200,
		filterType: "bandpass",
		q: .8,
		output: out.input
	});
});
var playHatTrap = ({ volume = .7, pan = 0, send = .06 } = {}) => withSound(() => {
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
		gain: .04,
		destination: out.input,
		filter: {
			type: "highpass",
			frequency: 7e3
		}
	});
	noiseBurst({
		duration: .04,
		attack: .001,
		release: .03,
		gain: .18,
		frequency: 1e4,
		filterType: "highpass",
		output: out.input
	});
});
var playVinyl = ({ volume = .3, pan = 0, send = 0 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	noiseBurst({
		duration: .1,
		attack: .01,
		release: .05,
		gain: .05,
		frequency: 600,
		filterType: "lowpass",
		q: .5,
		output: out.input
	});
	noiseBurst({
		duration: .02,
		attack: .001,
		release: .01,
		gain: .15,
		frequency: 4e3,
		filterType: "highpass",
		output: out.input
	});
});
var playSnap = ({ volume = .7, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	noiseBurst({
		duration: .03,
		attack: .001,
		release: .02,
		gain: .3,
		frequency: 3500,
		filterType: "bandpass",
		q: 3,
		output: out.input
	});
	voice({
		freq: 2800,
		type: "sine",
		attack: .001,
		hold: .01,
		release: .02,
		gain: .1,
		destination: out.input
	});
});
var playSynth = (freq, options = {}) => {
	playInstrumentTone(options.instrument || "glockenspiel", freq, {
		velocity: options.velocity ?? .9,
		send: options.send ?? .24,
		pan: options.pan ?? 0
	});
};
var playMicSample = (audioBuffer, offset = 0, duration = null, options = {}) => {
	if (!audioBuffer) return;
	withSound(() => {
		const ctx = initAudio();
		if (!ctx) return;
		const source = ctx.createBufferSource();
		const out = createOutput({
			volume: options.volume ?? .95,
			send: options.send ?? .08,
			pan: options.pan ?? 0
		});
		if (!out) return;
		source.buffer = audioBuffer;
		source.connect(out.input);
		if (duration !== null) source.start(ctx.currentTime, offset, duration);
		else source.start(ctx.currentTime, offset);
	});
};
var generateWaveform = (audioBuffer, points = 40) => {
	if (!audioBuffer) return [];
	const rawData = audioBuffer.getChannelData(0);
	const samples = rawData.length;
	const blockSize = Math.max(1, Math.floor(samples / points));
	const waveform = [];
	for (let i = 0; i < points; i += 1) {
		const blockStart = blockSize * i;
		let sum = 0;
		let count = 0;
		for (let j = 0; j < blockSize && blockStart + j < samples; j += 1) {
			sum += Math.abs(rawData[blockStart + j]);
			count += 1;
		}
		waveform.push(count > 0 ? sum / count : 0);
	}
	const max = Math.max(...waveform);
	return max > 0 ? waveform.map((n) => n / max) : waveform;
};
var timeStretchBuffer = async (ctx, originalBuffer, targetDurationSec) => {
	const ratio = originalBuffer.duration / targetDurationSec;
	const sampleRate = ctx.sampleRate;
	const targetSamples = Math.floor(targetDurationSec * sampleRate);
	const newBuffer = ctx.createBuffer(originalBuffer.numberOfChannels, targetSamples, sampleRate);
	const windowSize = Math.floor(sampleRate * .05);
	const hopSize = Math.floor(windowSize / 2);
	const hann = new Float32Array(windowSize);
	for (let i = 0; i < windowSize; i++) hann[i] = .5 * (1 - Math.cos(2 * Math.PI * i / (windowSize - 1)));
	for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
		const input = originalBuffer.getChannelData(channel);
		const output = newBuffer.getChannelData(channel);
		let outOffset = 0;
		while (outOffset < targetSamples) {
			const inOffset = Math.floor(outOffset * ratio);
			for (let i = 0; i < windowSize; i++) if (inOffset + i < input.length && outOffset + i < targetSamples) output[outOffset + i] += input[inOffset + i] * hann[i];
			outOffset += hopSize;
		}
		let maxAmp = 0;
		for (let i = 0; i < targetSamples; i++) if (Math.abs(output[i]) > maxAmp) maxAmp = Math.abs(output[i]);
		if (maxAmp > 1) for (let i = 0; i < targetSamples; i++) output[i] /= maxAmp;
	}
	return newBuffer;
};
var getAudioContext = () => initAudio();
var playKickAcoustic = ({ volume = 1, pan = 0, send = .05 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 110,
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
		freq: 140,
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
var playSnareAcoustic = ({ volume = .9, pan = 0, send = .08 } = {}) => withSound(() => {
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
var playTomLowAcoustic = ({ volume = .85, pan = -.2, send = .08 } = {}) => withSound(() => {
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
var playTomHighAcoustic = ({ volume = .85, pan = .2, send = .08 } = {}) => withSound(() => {
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
var playCrashAcoustic = ({ volume = .6, pan = .3, send = .25 } = {}) => withSound(() => {
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
var playRideAcoustic = ({ volume = .65, pan = -.3, send = .15 } = {}) => withSound(() => {
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
			start: 0,
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
var playHiHatClosedAcoustic = ({ volume = .7, pan = .1, send = .05 } = {}) => withSound(() => {
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
			start: 0,
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
var playKickEDM = ({ volume = 1, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 280,
		type: "sine",
		attack: .001,
		hold: .02,
		release: .35,
		gain: .8,
		destination: out.input,
		bendTo: 45,
		bendTime: .1
	});
	voice({
		freq: 150,
		type: "triangle",
		attack: .001,
		hold: .01,
		release: .2,
		gain: .3,
		destination: out.input,
		bendTo: 30,
		bendTime: .08
	});
	noiseBurst({
		duration: .03,
		gain: .15,
		frequency: 4e3,
		filterType: "highpass",
		output: out.input
	});
});
var playKickDeep = ({ volume = 1, pan = 0, send = .05 } = {}) => withSound(() => {
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
		hold: .05,
		release: .8,
		gain: .9,
		destination: out.input,
		bendTo: 35,
		bendTime: .25
	});
	voice({
		freq: 80,
		type: "triangle",
		attack: .01,
		hold: .05,
		release: .7,
		gain: .4,
		destination: out.input,
		bendTo: 35,
		bendTime: .2
	});
});
var playSnareClap = ({ volume = .85, pan = 0, send = .15 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 220,
		type: "triangle",
		attack: .002,
		hold: .04,
		release: .2,
		gain: .25,
		destination: out.input,
		bendTo: 160,
		bendTime: .1
	});
	[
		0,
		.015,
		.03
	].forEach((startDelay, index) => {
		noiseBurst({
			start: startDelay,
			duration: .15 + index * .03,
			attack: .002,
			release: .15,
			gain: .25 - index * .04,
			frequency: 2200 + index * 400,
			filterType: "bandpass",
			q: 1.5,
			output: out.input
		});
	});
	noiseBurst({
		start: .01,
		duration: .25,
		attack: .005,
		release: .2,
		gain: .3,
		frequency: 3500,
		filterType: "highpass",
		output: out.input
	});
});
var playHatEDM = ({ volume = .7, pan = 0, send = .08 } = {}) => withSound(() => {
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
		6.1
	].forEach((ratio, index) => {
		voice({
			freq: 300 * ratio,
			type: "square",
			start: index * .002,
			attack: .001,
			hold: .02,
			release: .08,
			gain: .03,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 8e3
			}
		});
	});
	noiseBurst({
		duration: .06,
		attack: .001,
		release: .05,
		gain: .25,
		frequency: 1e4,
		filterType: "highpass",
		output: out.input
	});
});
var playCymbalReverse = ({ volume = .6, pan = 0, send = .3 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	const attackTime = .6;
	[
		2.2,
		3.5,
		4.8,
		5.9
	].forEach((ratio) => {
		voice({
			freq: 150 * ratio,
			type: "square",
			start: 0,
			attack: attackTime,
			hold: .02,
			release: .05,
			gain: .04,
			destination: out.input,
			filter: {
				type: "highpass",
				frequency: 4e3
			}
		});
	});
	noiseBurst({
		start: 0,
		duration: attackTime + .05,
		attack: attackTime,
		release: .05,
		gain: .2,
		frequency: 6e3,
		filterType: "highpass",
		output: out.input
	});
});
var playPercFM = ({ volume = .8, pan = 0, send = .1 } = {}) => withSound(() => {
	const out = createOutput({
		volume,
		pan,
		send
	});
	if (!out) return;
	voice({
		freq: 440,
		type: "sine",
		attack: .002,
		hold: .03,
		release: .15,
		gain: .4,
		destination: out.input,
		bendTo: 110,
		bendTime: .1
	});
	voice({
		freq: 880,
		type: "square",
		attack: .002,
		hold: .02,
		release: .1,
		gain: .15,
		destination: out.input,
		filter: {
			type: "bandpass",
			frequency: 1200,
			q: 3
		}
	});
	voice({
		freq: 1760,
		type: "triangle",
		attack: .005,
		hold: .05,
		release: .2,
		gain: .1,
		destination: out.input
	});
});
//#endregion
export { playSnareAcoustic as A, timeStretchBuffer as B, playPercFM as C, playShaker as D, playRim as E, playTom as F, playTomHighAcoustic as I, playTomLowAcoustic as L, playSnareHiphop as M, playSparkle as N, playSnap as O, playSynth as P, playVinyl as R, playMicSample as S, playRideAcoustic as T, AnimatePresence as V, playKickAcoustic as _, playCoin as a, playKickHiphop as b, playCymbalReverse as c, playHatTrap as d, playHiHat as f, playKick as g, playJingle as h, playClap as i, playSnareClap as j, playSnare as k, playError as l, playInstrumentTone as m, getAudioContext as n, playCrash as o, playHiHatClosedAcoustic as p, play808 as r, playCrashAcoustic as s, generateWaveform as t, playHatEDM as u, playKickDeep as v, playPop as w, playMagicDust as x, playKickEDM as y, playWhoosh as z };
