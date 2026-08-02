const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SubjectPremiumAtelier-OFFtJlBa.js","assets/jsx-runtime-Be5yPkiZ.js","assets/star-DBCbE8d7.js","assets/proxy--6s_pC9q.js","assets/sounds-Dh98eEYj.js","assets/DeepLearningQuest-CbOGahul.js","assets/learningContent-D1WsycQZ.js","assets/wand-sparkles-CtIcwwM8.js","assets/animalFriends-U19Ro3hF.js","assets/premiumGamePack-CHz1F5u_.js","assets/compass-JckdT0FA.js","assets/grid-3x3-BjeKZBlx.js","assets/sparkles-bt2KNUwI.js","assets/SkyWonderland-Bz4SaHcY.js","assets/volume-2-Vs6pZO3N.js","assets/LearningArcade-BGnmy9QN.js","assets/trophy-Ci-hdIiU.js"])))=>i.map(i=>d[i]);
import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { _ as invariant, b as useIsomorphicLayoutEffect, d as collectMotionValues, f as motionValue, g as frame, h as cancelFrame, l as isMotionValue, m as mixNumber, p as interpolate, r as MotionConfigContext, t as motion, v as moveItem, x as useConstant } from "./proxy--6s_pC9q.js";
import { N as playSparkle, V as AnimatePresence, l as playError, w as playPop } from "./sounds-Dh98eEYj.js";
import { r as confetti_module_default } from "./star-DBCbE8d7.js";
import { t as __vitePreload } from "./index-B5O6y7xB.js";
import { n as LAB_DICTIONARY$1, r as LAB_SYLLABLES, s as SUBJECT_VARIANT_CONTENT, t as DEUTSCH_CONTENT } from "./learningContent-D1WsycQZ.js";
import { i as VariantStudio, n as GameWorld, r as ActionArena, t as QuestMixer } from "./QuestMixer-CwJK0O5N.js";
//#region node_modules/motion-dom/dist/es/utils/transform.mjs
function transform(...args) {
	const useImmediate = !Array.isArray(args[0]);
	const argOffset = useImmediate ? 0 : -1;
	const inputValue = args[0 + argOffset];
	const inputRange = args[1 + argOffset];
	const outputRange = args[2 + argOffset];
	const options = args[3 + argOffset];
	const interpolator = interpolate(inputRange, outputRange, options);
	return useImmediate ? interpolator(inputValue) : interpolator;
}
//#endregion
//#region node_modules/framer-motion/dist/es/value/use-motion-value.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Creates a `MotionValue` to track the state and velocity of a value.
*
* Usually, these are created automatically. For advanced use-cases, like use with `useTransform`, you can create `MotionValue`s externally and pass them into the animated component via the `style` prop.
*
* ```jsx
* export const MyComponent = () => {
*   const scale = useMotionValue(1)
*
*   return <motion.div style={{ scale }} />
* }
* ```
*
* @param initial - The initial state.
*
* @public
*/
function useMotionValue(initial) {
	const value = useConstant(() => motionValue(initial));
	/**
	* If this motion value is being used in static mode, like on
	* the Framer canvas, force components to rerender when the motion
	* value is updated.
	*/
	const { isStatic } = (0, import_react.useContext)(MotionConfigContext);
	if (isStatic) {
		const [, setLatest] = (0, import_react.useState)(initial);
		(0, import_react.useEffect)(() => value.on("change", setLatest), []);
	}
	return value;
}
//#endregion
//#region node_modules/framer-motion/dist/es/value/use-combine-values.mjs
function useCombineMotionValues(values, combineValues) {
	/**
	* Initialise the returned motion value. This remains the same between renders.
	*/
	const value = useMotionValue(combineValues());
	/**
	* Create a function that will update the template motion value with the latest values.
	* This is pre-bound so whenever a motion value updates it can schedule its
	* execution in Framesync. If it's already been scheduled it won't be fired twice
	* in a single frame.
	*/
	const updateValue = () => value.set(combineValues());
	/**
	* Synchronously update the motion value with the latest values during the render.
	* This ensures that within a React render, the styles applied to the DOM are up-to-date.
	*/
	updateValue();
	/**
	* Subscribe to all motion values found within the template. Whenever any of them change,
	* schedule an update.
	*/
	useIsomorphicLayoutEffect(() => {
		const scheduleUpdate = () => frame.preRender(updateValue, false, true);
		const subscriptions = values.map((v) => v.on("change", scheduleUpdate));
		return () => {
			subscriptions.forEach((unsubscribe) => unsubscribe());
			cancelFrame(updateValue);
		};
	});
	return value;
}
//#endregion
//#region node_modules/framer-motion/dist/es/value/use-computed.mjs
function useComputed(compute) {
	/**
	* Open session of collectMotionValues. Any MotionValue that calls get()
	* will be saved into this array.
	*/
	collectMotionValues.current = [];
	compute();
	const value = useCombineMotionValues(collectMotionValues.current, compute);
	/**
	* Synchronously close session of collectMotionValues.
	*/
	collectMotionValues.current = void 0;
	return value;
}
//#endregion
//#region node_modules/framer-motion/dist/es/value/use-transform.mjs
function useTransform(input, inputRangeOrTransformer, outputRangeOrMap, options) {
	if (typeof input === "function") return useComputed(input);
	if (outputRangeOrMap !== void 0 && !Array.isArray(outputRangeOrMap) && typeof inputRangeOrTransformer !== "function") return useMapTransform(input, inputRangeOrTransformer, outputRangeOrMap, options);
	const transformer = typeof inputRangeOrTransformer === "function" ? inputRangeOrTransformer : transform(inputRangeOrTransformer, outputRangeOrMap, options);
	const result = Array.isArray(input) ? useListTransform(input, transformer) : useListTransform([input], ([latest]) => transformer(latest));
	const inputAccelerate = !Array.isArray(input) ? input.accelerate : void 0;
	if (inputAccelerate && !inputAccelerate.isTransformed && typeof inputRangeOrTransformer !== "function" && Array.isArray(outputRangeOrMap) && options?.clamp !== false) result.accelerate = {
		...inputAccelerate,
		times: inputRangeOrTransformer,
		keyframes: outputRangeOrMap,
		isTransformed: true,
		...options?.ease ? { ease: options.ease } : {}
	};
	return result;
}
function useListTransform(values, transformer) {
	const latest = useConstant(() => []);
	return useCombineMotionValues(values, () => {
		latest.length = 0;
		const numValues = values.length;
		for (let i = 0; i < numValues; i++) latest[i] = values[i].get();
		return transformer(latest);
	});
}
function useMapTransform(inputValue, inputRange, outputMap, options) {
	/**
	* Capture keys once to ensure hooks are called in consistent order.
	*/
	const keys = useConstant(() => Object.keys(outputMap));
	const output = useConstant(() => ({}));
	for (const key of keys) output[key] = useTransform(inputValue, inputRange, outputMap[key], options);
	return output;
}
//#endregion
//#region node_modules/framer-motion/dist/es/context/ReorderContext.mjs
var ReorderContext = (0, import_react.createContext)(null);
//#endregion
//#region node_modules/framer-motion/dist/es/components/Reorder/utils/check-reorder.mjs
function checkReorder(order, value, offset, velocity) {
	if (!velocity) return order;
	const index = order.findIndex((item) => item.value === value);
	if (index === -1) return order;
	const nextOffset = velocity > 0 ? 1 : -1;
	const nextItem = order[index + nextOffset];
	if (!nextItem) return order;
	const item = order[index];
	const nextLayout = nextItem.layout;
	const nextItemCenter = mixNumber(nextLayout.min, nextLayout.max, .5);
	if (nextOffset === 1 && item.layout.max + offset > nextItemCenter || nextOffset === -1 && item.layout.min + offset < nextItemCenter) return moveItem(order, index, index + nextOffset);
	return order;
}
//#endregion
//#region node_modules/framer-motion/dist/es/components/Reorder/Group.mjs
var import_jsx_runtime = require_jsx_runtime();
function ReorderGroupComponent({ children, as = "ul", axis = "y", onReorder, values, ...props }, externalRef) {
	const Component = useConstant(() => motion[as]);
	const order = [];
	const isReordering = (0, import_react.useRef)(false);
	const groupRef = (0, import_react.useRef)(null);
	invariant(Boolean(values), "Reorder.Group must be provided a values prop", "reorder-values");
	const context = {
		axis,
		groupRef,
		registerItem: (value, layout) => {
			const idx = order.findIndex((entry) => value === entry.value);
			if (idx !== -1) order[idx].layout = layout[axis];
			else order.push({
				value,
				layout: layout[axis]
			});
			order.sort(compareMin);
		},
		updateOrder: (item, offset, velocity) => {
			if (isReordering.current) return;
			const newOrder = checkReorder(order, item, offset, velocity);
			if (order !== newOrder) {
				isReordering.current = true;
				const newValues = [...values];
				for (let i = 0; i < newOrder.length; i++) if (order[i].value !== newOrder[i].value) {
					const a = values.indexOf(order[i].value);
					const b = values.indexOf(newOrder[i].value);
					if (a !== -1 && b !== -1) [newValues[a], newValues[b]] = [newValues[b], newValues[a]];
					break;
				}
				onReorder(newValues);
			}
		}
	};
	(0, import_react.useEffect)(() => {
		isReordering.current = false;
	});
	const setRef = (element) => {
		groupRef.current = element;
		if (typeof externalRef === "function") externalRef(element);
		else if (externalRef) externalRef.current = element;
	};
	/**
	* Disable browser scroll anchoring on the group container.
	* When items reorder, scroll anchoring can cause the browser to adjust
	* the scroll position, which interferes with drag position calculations.
	*/
	const groupStyle = {
		overflowAnchor: "none",
		...props.style
	};
	return (0, import_jsx_runtime.jsx)(Component, {
		...props,
		style: groupStyle,
		ref: setRef,
		ignoreStrict: true,
		children: (0, import_jsx_runtime.jsx)(ReorderContext.Provider, {
			value: context,
			children
		})
	});
}
var ReorderGroup = /* @__PURE__ */ (0, import_react.forwardRef)(ReorderGroupComponent);
function compareMin(a, b) {
	return a.layout.min - b.layout.min;
}
//#endregion
//#region node_modules/framer-motion/dist/es/components/Reorder/utils/auto-scroll.mjs
var threshold = 50;
var maxSpeed = 25;
var overflowStyles = new Set(["auto", "scroll"]);
var initialScrollLimits = /* @__PURE__ */ new WeakMap();
var activeScrollEdge = /* @__PURE__ */ new WeakMap();
var currentGroupElement = null;
function resetAutoScrollState() {
	if (currentGroupElement) {
		const scrollableAncestor = findScrollableAncestor(currentGroupElement, "y");
		if (scrollableAncestor) {
			activeScrollEdge.delete(scrollableAncestor);
			initialScrollLimits.delete(scrollableAncestor);
		}
		const scrollableAncestorX = findScrollableAncestor(currentGroupElement, "x");
		if (scrollableAncestorX && scrollableAncestorX !== scrollableAncestor) {
			activeScrollEdge.delete(scrollableAncestorX);
			initialScrollLimits.delete(scrollableAncestorX);
		}
		currentGroupElement = null;
	}
}
function isScrollableElement(element, axis) {
	const style = getComputedStyle(element);
	const overflow = axis === "x" ? style.overflowX : style.overflowY;
	const isDocumentScroll = element === document.body || element === document.documentElement;
	return overflowStyles.has(overflow) || isDocumentScroll;
}
function findScrollableAncestor(element, axis) {
	let current = element?.parentElement;
	while (current) {
		if (isScrollableElement(current, axis)) return current;
		current = current.parentElement;
	}
	return null;
}
function getScrollAmount(pointerPosition, scrollElement, axis) {
	const rect = scrollElement.getBoundingClientRect();
	const start = axis === "x" ? Math.max(0, rect.left) : Math.max(0, rect.top);
	const end = axis === "x" ? Math.min(window.innerWidth, rect.right) : Math.min(window.innerHeight, rect.bottom);
	const distanceFromStart = pointerPosition - start;
	const distanceFromEnd = end - pointerPosition;
	if (distanceFromStart < threshold) {
		const intensity = 1 - distanceFromStart / threshold;
		return {
			amount: -maxSpeed * intensity * intensity,
			edge: "start"
		};
	} else if (distanceFromEnd < threshold) {
		const intensity = 1 - distanceFromEnd / threshold;
		return {
			amount: maxSpeed * intensity * intensity,
			edge: "end"
		};
	}
	return {
		amount: 0,
		edge: null
	};
}
function autoScrollIfNeeded(groupElement, pointerPosition, axis, velocity) {
	if (!groupElement) return;
	currentGroupElement = groupElement;
	const scrollableAncestor = findScrollableAncestor(groupElement, axis);
	if (!scrollableAncestor) return;
	const { amount: scrollAmount, edge } = getScrollAmount(pointerPosition - (axis === "x" ? window.scrollX : window.scrollY), scrollableAncestor, axis);
	if (edge === null) {
		activeScrollEdge.delete(scrollableAncestor);
		initialScrollLimits.delete(scrollableAncestor);
		return;
	}
	const currentActiveEdge = activeScrollEdge.get(scrollableAncestor);
	const isDocumentScroll = scrollableAncestor === document.body || scrollableAncestor === document.documentElement;
	if (currentActiveEdge !== edge) {
		if (!(edge === "start" && velocity < 0 || edge === "end" && velocity > 0)) return;
		activeScrollEdge.set(scrollableAncestor, edge);
		const maxScroll = axis === "x" ? scrollableAncestor.scrollWidth - (isDocumentScroll ? window.innerWidth : scrollableAncestor.clientWidth) : scrollableAncestor.scrollHeight - (isDocumentScroll ? window.innerHeight : scrollableAncestor.clientHeight);
		initialScrollLimits.set(scrollableAncestor, maxScroll);
	}
	if (scrollAmount > 0) {
		const initialLimit = initialScrollLimits.get(scrollableAncestor);
		if ((axis === "x" ? isDocumentScroll ? window.scrollX : scrollableAncestor.scrollLeft : isDocumentScroll ? window.scrollY : scrollableAncestor.scrollTop) >= initialLimit) return;
	}
	if (axis === "x") if (isDocumentScroll) window.scrollBy({ left: scrollAmount });
	else scrollableAncestor.scrollLeft += scrollAmount;
	else if (isDocumentScroll) window.scrollBy({ top: scrollAmount });
	else scrollableAncestor.scrollTop += scrollAmount;
}
//#endregion
//#region node_modules/framer-motion/dist/es/components/Reorder/Item.mjs
function useDefaultMotionValue(value, defaultValue = 0) {
	return isMotionValue(value) ? value : useMotionValue(defaultValue);
}
function ReorderItemComponent({ children, style = {}, value, as = "li", onDrag, onDragEnd, layout = true, ...props }, externalRef) {
	const Component = useConstant(() => motion[as]);
	const context = (0, import_react.useContext)(ReorderContext);
	const point = {
		x: useDefaultMotionValue(style.x),
		y: useDefaultMotionValue(style.y)
	};
	const zIndex = useTransform([point.x, point.y], ([latestX, latestY]) => latestX || latestY ? 1 : "unset");
	invariant(Boolean(context), "Reorder.Item must be a child of Reorder.Group", "reorder-item-child");
	const { axis, registerItem, updateOrder, groupRef } = context;
	return (0, import_jsx_runtime.jsx)(Component, {
		drag: axis,
		...props,
		dragSnapToOrigin: true,
		style: {
			...style,
			x: point.x,
			y: point.y,
			zIndex
		},
		layout,
		onDrag: (event, gesturePoint) => {
			const { velocity, point: pointerPoint } = gesturePoint;
			updateOrder(value, point[axis].get(), velocity[axis]);
			autoScrollIfNeeded(groupRef.current, pointerPoint[axis], axis, velocity[axis]);
			onDrag && onDrag(event, gesturePoint);
		},
		onDragEnd: (event, gesturePoint) => {
			resetAutoScrollState();
			onDragEnd && onDragEnd(event, gesturePoint);
		},
		onLayoutMeasure: (measured) => {
			registerItem(value, measured);
		},
		ref: externalRef,
		ignoreStrict: true,
		children
	});
}
var ReorderItem = /* @__PURE__ */ (0, import_react.forwardRef)(ReorderItemComponent);
//#endregion
//#region src/components/games/GeschichtenGarten.jsx
var STORIES = DEUTSCH_CONTENT.stories;
function StoryCard({ card, faded = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		layout: true,
		initial: {
			opacity: 0,
			y: 18,
			rotate: -1
		},
		animate: {
			opacity: faded ? .45 : 1,
			y: 0,
			rotate: 0
		},
		className: "min-h-52 bg-white/85 rounded-[36px] border-4 border-white shadow-xl p-6 flex flex-col justify-between watercolor-effect",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-6xl md:text-7xl drop-shadow-sm",
			children: card.icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-hand text-2xl md:text-3xl font-bold leading-tight text-slate-700",
			children: card.text
		})]
	});
}
function GeschichtenGarten({ onCorrect = () => {}, onWrong = () => {} }) {
	const [storyIndex, setStoryIndex] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const story = STORIES[storyIndex];
	const pickedCard = story.options.find((option) => option.id === picked);
	const chooseCard = (id) => {
		if (feedback === "richtig") return;
		setPicked(id);
		playPop();
		if (id === story.answer) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(5);
			confetti_module_default({
				particleCount: 100,
				spread: 90,
				origin: { y: .68 }
			});
		} else {
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setPicked(null);
				setFeedback(null);
			}, 1400);
		}
	};
	const nextStory = () => {
		playPop();
		setStoryIndex((storyIndex + 1) % STORIES.length);
		setPicked(null);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-6xl mx-auto py-8 flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Geschichten-Garten"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Welche Karte erzählt die Geschichte gut weiter?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-amber-50/70 rounded-[52px] border-4 border-white shadow-2xl p-8 paper-texture",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-xs uppercase font-bold tracking-widest text-amber-600",
						children: "Bilderfolge"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-hand text-4xl font-bold text-slate-700",
						children: story.title
					})] }), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "font-hand text-2xl text-emerald-700 bg-white/70 px-5 py-3 rounded-[26px] border-2 border-emerald-100",
						children: story.ending
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-5",
					children: [story.cards.map((card, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, { card }, `${story.title}-${index}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-52 bg-white/55 rounded-[36px] border-4 border-dashed border-amber-300 shadow-inner p-6 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
							mode: "wait",
							children: pickedCard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryCard, {
								card: pickedCard,
								faded: feedback === "falsch"
							}, pickedCard.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-hand text-7xl text-amber-500 mb-2",
									children: "?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-hand text-2xl text-slate-400",
									children: "Hier fehlt eine Karte."
								})]
							}, "blank")
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-4",
				children: story.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
					whileHover: {
						scale: 1.03,
						y: -3
					},
					whileTap: { scale: .96 },
					onClick: () => chooseCard(option.id),
					className: `bg-white/85 rounded-[32px] border-4 p-5 shadow-lg text-left flex items-center gap-4 transition-all ${picked === option.id ? "border-amber-300 ring-4 ring-amber-100" : "border-white hover:border-amber-100"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-5xl",
						children: option.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-2xl font-bold text-slate-700 leading-tight",
						children: option.text
					})]
				}, option.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-20 text-center",
				children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-3xl font-bold text-rose-500",
					children: "Das passt noch nicht ganz zur Geschichte."
				}), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: nextStory,
					className: "px-8 py-3 bg-amber-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
					children: "Nächste Geschichte"
				})]
			})
		]
	});
}
//#endregion
//#region src/components/games/BuchstabenWiese.jsx
var ROUNDS = DEUTSCH_CONTENT.letterRounds;
function BuchstabenWiese({ onCorrect = () => {}, onWrong = () => {} }) {
	const [roundIndex, setRoundIndex] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const round = ROUNDS[roundIndex];
	const choose = (id) => {
		if (feedback === "richtig") return;
		setPicked(id);
		playPop();
		if (id === round.answer) {
			setFeedback("richtig");
			playSparkle();
			onCorrect(4);
			confetti_module_default({
				particleCount: 80,
				spread: 80,
				origin: { y: .7 }
			});
		} else {
			setFeedback("falsch");
			playError();
			onWrong();
			setTimeout(() => {
				setPicked(null);
				setFeedback(null);
			}, 1200);
		}
	};
	const next = () => {
		playPop();
		setRoundIndex((roundIndex + 1) % ROUNDS.length);
		setPicked(null);
		setFeedback(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-5xl mx-auto py-8 flex flex-col gap-8 items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Buchstaben-Wiese"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Hör den Anfangslaut und finde das passende Bild."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full bg-lime-50/70 rounded-[54px] border-4 border-white shadow-2xl p-8 paper-texture",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row items-center justify-center gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							rotate: -8,
							scale: .8
						},
						animate: {
							rotate: 0,
							scale: 1
						},
						className: "w-44 h-44 bg-white/90 rounded-[44px] border-4 border-lime-200 shadow-xl flex flex-col items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-8xl font-bold text-lime-700",
							children: round.letter
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-2xl text-lime-600",
							children: round.sound
						})]
					}, round.letter), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center md:text-left max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-xs font-bold uppercase tracking-widest text-lime-700",
								children: "Lauschfrage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-hand text-4xl font-bold text-slate-700 leading-tight",
								children: [
									"Welches Wort beginnt mit ",
									round.letter,
									"?"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-hand text-2xl text-slate-500 mt-3",
								children: "Sprich die Wörter langsam. Der erste Klang hilft dir."
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4 w-full",
				children: round.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
					whileHover: {
						scale: 1.05,
						y: -4
					},
					whileTap: { scale: .96 },
					onClick: () => choose(option.id),
					className: `bg-white/85 rounded-[34px] border-4 p-5 shadow-lg flex flex-col items-center gap-3 transition-all ${picked === option.id ? "border-lime-300 ring-4 ring-lime-100" : "border-white hover:border-lime-100"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-6xl md:text-7xl",
						children: option.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-3xl font-bold text-slate-700",
						children: option.word
					})]
				}, option.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-20 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
					mode: "wait",
					children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "font-hand text-3xl font-bold text-rose-500",
						children: "Fast. Hör noch einmal auf den ersten Laut."
					}, "wrong"), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "flex flex-col items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-hand text-3xl font-bold text-lime-700",
							children: "Ja. Du hast den Anfang gehört."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: next,
							className: "px-8 py-3 bg-lime-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
							children: "Nächster Laut"
						})]
					}, "right")]
				})
			})
		]
	});
}
//#endregion
//#region src/components/games/WortSchatzMemory.jsx
var PAIRS = DEUTSCH_CONTENT.memoryPairs;
var shuffle = (items) => [...items].map((item) => ({
	item,
	sort: Math.random()
})).sort((a, b) => a.sort - b.sort).map(({ item }) => item);
function buildDeck() {
	return shuffle(shuffle(PAIRS).slice(0, 8).flatMap((pair) => [{
		cardId: `${pair.id}-word`,
		pairId: pair.id,
		kind: "word",
		label: pair.word
	}, {
		cardId: `${pair.id}-icon`,
		pairId: pair.id,
		kind: "icon",
		label: pair.icon
	}]));
}
function WortSchatzMemory({ onCorrect = () => {}, onWrong = () => {} }) {
	const [seed, setSeed] = (0, import_react.useState)(0);
	const deck = (0, import_react.useMemo)(() => buildDeck(), [seed]);
	const pairCount = deck.length / 2;
	const [open, setOpen] = (0, import_react.useState)([]);
	const [matched, setMatched] = (0, import_react.useState)([]);
	const [locked, setLocked] = (0, import_react.useState)(false);
	const reset = () => {
		playPop();
		setOpen([]);
		setMatched([]);
		setSeed((value) => value + 1);
		setLocked(false);
	};
	const choose = (card) => {
		if (locked || open.includes(card.cardId) || matched.includes(card.pairId)) return;
		playPop();
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
				onCorrect(3);
				if (nextMatched.length === pairCount) confetti_module_default({
					particleCount: 140,
					spread: 100,
					origin: { y: .7 }
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
	const isVisible = (card) => open.includes(card.cardId) || matched.includes(card.pairId);
	const isDone = matched.length === pairCount;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-6xl mx-auto py-8 flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Wortschatz-Memory"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Finde Bild und Wort, die zusammengehören."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-sky-50/70 rounded-[54px] border-4 border-white shadow-2xl p-6 paper-texture",
				children: deck.map((card) => {
					const visible = isVisible(card);
					const done = matched.includes(card.pairId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
						layout: true,
						whileHover: {
							scale: done ? 1 : 1.04,
							y: done ? 0 : -3
						},
						whileTap: { scale: .96 },
						onClick: () => choose(card),
						className: `aspect-square rounded-[30px] border-4 shadow-lg flex items-center justify-center transition-all ${done ? "bg-emerald-50 border-emerald-200" : visible ? "bg-white border-sky-200" : "bg-white/70 border-white"}`,
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
								className: card.kind === "icon" ? "text-6xl" : "font-hand text-3xl md:text-4xl font-bold text-slate-700",
								children: card.label
							}, "front") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								exit: { opacity: 0 },
								className: "font-hand text-6xl text-sky-300",
								children: "?"
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
							" Paaren gefunden · ",
							PAIRS.length,
							" Wörter im Pool"
						]
					}),
					isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-hand text-3xl font-bold text-emerald-600",
						children: "Wundervoll. Dein Wortschatz wächst."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: reset,
						className: "px-7 py-3 bg-sky-500 text-white rounded-full font-hand text-2xl font-bold shadow-lg",
						children: "Neu mischen"
					})
				]
			})
		]
	});
}
//#endregion
//#region src/components/games/RapStudio.jsx
var STARTER = [
	"Hund",
	"Katze",
	"Maus",
	"Baum",
	"Stern",
	"Sonne",
	"Ball",
	"Fisch",
	"Herz",
	"Tier",
	"Nacht",
	"blau"
];
var DRAFT_KEY = "faska-rap-draft";
var SAVED_KEY = "faska-rap-saved";
var BPMS = [
	{
		label: "🐢",
		bpm: 70
	},
	{
		label: "🚶",
		bpm: 90
	},
	{
		label: "🐇",
		bpm: 112
	}
];
var norm = (w) => (w || "").trim().toLowerCase().replace(/[.,!?;:]+$/u, "");
var lastWord = (line) => {
	const parts = (line || "").trim().split(/\s+/u).filter(Boolean);
	return parts.length ? parts[parts.length - 1] : "";
};
function speak(text) {
	try {
		if (typeof window === "undefined" || !window.speechSynthesis) return;
		const u = new SpeechSynthesisUtterance(text);
		u.lang = "de-DE";
		u.rate = .95;
		u.pitch = 1.08;
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(u);
	} catch {}
}
function readStore(key, fallback) {
	try {
		return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
	} catch {
		return fallback;
	}
}
function writeStore(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
function RapStudio({ onCorrect = () => {}, onWrong = () => {} }) {
	const [pro, setPro] = (0, import_react.useState)(false);
	const [data, setData] = (0, import_react.useState)(null);
	const [loadError, setLoadError] = (0, import_react.useState)(false);
	const [typed, setTyped] = (0, import_react.useState)("");
	const [lookup, setLookup] = (0, import_react.useState)("");
	const [lines, setLines] = (0, import_react.useState)(() => {
		const d = readStore(DRAFT_KEY, null);
		return Array.isArray(d) && d.length >= 2 ? d : [
			"",
			"",
			"",
			""
		];
	});
	const [saved, setSaved] = (0, import_react.useState)(() => readStore(SAVED_KEY, []));
	const [shared, setShared] = (0, import_react.useState)(false);
	const [beat, setBeat] = (0, import_react.useState)(0);
	const rewarded = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const dataCache = (0, import_react.useRef)({});
	(0, import_react.useEffect)(() => {
		const file = pro ? "/faska-flow-pro/rap/kid-rhymes-pro.json" : "/faska-flow-pro/rap/kid-rhymes.json";
		if (dataCache.current[file]) {
			setData(dataCache.current[file]);
			return;
		}
		let alive = true;
		fetch(file).then((r) => r.json()).then((j) => {
			if (alive) {
				dataCache.current[file] = j;
				setData(j);
			}
		}).catch(() => alive && setLoadError(true));
		return () => {
			alive = false;
		};
	}, [pro]);
	const index = (0, import_react.useMemo)(() => {
		const idx = {};
		if (data?.rhymes) for (const [k, v] of Object.entries(data.rhymes)) idx[k.toLowerCase()] = v;
		return idx;
	}, [data]);
	const getRhymes = (w) => index[norm(w)] || [];
	(0, import_react.useEffect)(() => writeStore(DRAFT_KEY, lines), [lines]);
	const couplet = (a, b) => {
		const wa = norm(lastWord(a));
		const wb = norm(lastWord(b));
		if (!wa || !wb || wa === wb) return false;
		return getRhymes(wa).map(norm).includes(wb) || getRhymes(wb).map(norm).includes(wa);
	};
	const pairKeys = (0, import_react.useMemo)(() => Array.from({ length: Math.floor(lines.length / 2) }, (_, i) => i * 2), [lines.length]);
	const pairs = (0, import_react.useMemo)(() => {
		const res = {};
		for (const i of pairKeys) res[i] = couplet(lines[i], lines[i + 1]);
		return res;
	}, [lines, index]);
	(0, import_react.useEffect)(() => {
		for (const i of pairKeys) if (pairs[i] && !rewarded.current.has(i)) {
			rewarded.current.add(i);
			playSparkle();
			confetti_module_default({
				particleCount: 55,
				spread: 70,
				origin: { y: .7 }
			});
			onCorrect(5);
		} else if (!pairs[i]) rewarded.current.delete(i);
	}, [pairs]);
	const setLine = (i, val) => setLines((ls) => ls.map((l, j) => j === i ? val : l));
	const doLookup = (w) => {
		const word = norm(w);
		if (!word) return;
		setLookup(word);
		if (getRhymes(word).length) {
			playPop();
			speak(word);
		} else playError();
	};
	const dropIntoRap = (word) => {
		setLines((ls) => {
			let target = ls.map((l, i) => norm(lastWord(l)) === norm(lookup) ? i + 1 : -1).find((i) => i >= 0 && i < ls.length);
			if (target == null) target = ls.findIndex((l) => !l.trim());
			if (target == null || target < 0 || target >= ls.length) return ls;
			const sep = ls[target].trim() ? " " : "";
			return ls.map((l, j) => j === target ? `${l}${sep}${word}` : l);
		});
		playPop();
		speak(word);
	};
	const randomWord = () => {
		const keys = Object.keys(index);
		if (!keys.length) return;
		const w = keys[Math.floor(Math.random() * keys.length)];
		setTyped(w);
		doLookup(w);
	};
	const rapText = lines.filter((l) => l.trim()).join("\n");
	const saveRap = () => {
		if (!rapText.trim()) return;
		const next = [{
			id: String(Date.now()),
			lines: [...lines]
		}, ...saved].slice(0, 12);
		setSaved(next);
		writeStore(SAVED_KEY, next);
		playSparkle();
	};
	const loadRap = (entry) => {
		setLines(entry.lines?.length ? entry.lines : [
			"",
			"",
			"",
			""
		]);
		rewarded.current.clear();
		playPop();
	};
	const delRap = (id) => {
		const next = saved.filter((e) => e.id !== id);
		setSaved(next);
		writeStore(SAVED_KEY, next);
	};
	const shareRap = async () => {
		if (!rapText.trim()) return;
		const text = `🎤 Mein Rap:\n${rapText}`;
		try {
			if (navigator.share) await navigator.share({ text });
			else {
				await navigator.clipboard.writeText(text);
				setShared(true);
				setTimeout(() => setShared(false), 1500);
			}
			playPop();
		} catch {}
	};
	const addCouplet = () => lines.length < 8 && setLines((ls) => [
		...ls,
		"",
		""
	]);
	const audioRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	const stepRef = (0, import_react.useRef)(0);
	const noiseRef = (0, import_react.useRef)(null);
	const getCtx = () => {
		if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
		return audioRef.current;
	};
	const getNoise = (ctx) => {
		if (!noiseRef.current) {
			const buf = ctx.createBuffer(1, ctx.sampleRate * .3, ctx.sampleRate);
			const d = buf.getChannelData(0);
			for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
			noiseRef.current = buf;
		}
		return noiseRef.current;
	};
	const kick = (ctx, t) => {
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.frequency.setValueAtTime(165, t);
		o.frequency.exponentialRampToValueAtTime(48, t + .13);
		g.gain.setValueAtTime(.9, t);
		g.gain.exponentialRampToValueAtTime(.001, t + .2);
		o.connect(g).connect(ctx.destination);
		o.start(t);
		o.stop(t + .22);
	};
	const hat = (ctx, t) => {
		const s = ctx.createBufferSource();
		s.buffer = getNoise(ctx);
		const hp = ctx.createBiquadFilter();
		hp.type = "highpass";
		hp.frequency.value = 7e3;
		const g = ctx.createGain();
		g.gain.setValueAtTime(.28, t);
		g.gain.exponentialRampToValueAtTime(.001, t + .05);
		s.connect(hp).connect(g).connect(ctx.destination);
		s.start(t);
		s.stop(t + .06);
	};
	const snare = (ctx, t) => {
		const s = ctx.createBufferSource();
		s.buffer = getNoise(ctx);
		const bp = ctx.createBiquadFilter();
		bp.type = "highpass";
		bp.frequency.value = 1800;
		const g = ctx.createGain();
		g.gain.setValueAtTime(.5, t);
		g.gain.exponentialRampToValueAtTime(.001, t + .14);
		s.connect(bp).connect(g).connect(ctx.destination);
		s.start(t);
		s.stop(t + .16);
	};
	const stopBeat = () => {
		if (timerRef.current) clearInterval(timerRef.current);
		timerRef.current = null;
		stepRef.current = 0;
	};
	const startBeat = (bpm) => {
		stopBeat();
		const ctx = getCtx();
		if (ctx.state === "suspended") ctx.resume();
		const stepMs = 6e4 / bpm / 2;
		timerRef.current = setInterval(() => {
			const t = ctx.currentTime + .03;
			const s = stepRef.current % 8;
			if (s === 0 || s === 3 || s === 4) kick(ctx, t);
			if (s === 2 || s === 6) snare(ctx, t);
			hat(ctx, t);
			stepRef.current++;
		}, stepMs);
	};
	const toggleBeat = (bpm) => {
		if (beat === bpm) {
			setBeat(0);
			stopBeat();
		} else {
			setBeat(bpm);
			startBeat(bpm);
		}
	};
	(0, import_react.useEffect)(() => () => {
		stopBeat();
		try {
			audioRef.current?.close();
		} catch {}
	}, []);
	const currentRhymes = lookup ? getRhymes(lookup) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex w-full max-w-4xl flex-col items-center gap-5 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "🎤 Reim-Studio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500",
					children: "Finde Reime, leg einen Beat auf und bau deinen Rap!"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full flex-wrap items-center justify-center gap-3 rounded-3xl bg-slate-100 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setPro((p) => !p);
							playPop();
						},
						className: `rounded-2xl px-5 py-2.5 font-hand text-2xl font-bold shadow-md transition active:scale-95 ${pro ? "bg-orange-500 text-white" : "bg-white text-slate-400"}`,
						children: pro ? "🔥 Profi an" : "🔥 Profi aus"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-2xl text-slate-400",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-2xl font-bold text-slate-500",
						children: "🥁 Beat:"
					}),
					BPMS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => toggleBeat(b.bpm),
						className: `rounded-2xl px-4 py-2.5 font-hand text-2xl font-bold shadow-md transition active:scale-95 ${beat === b.bpm ? "bg-violet-600 text-white" : "bg-white text-slate-400"}`,
						children: b.label
					}, b.bpm)),
					beat > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => toggleBeat(beat),
						className: "rounded-2xl bg-rose-400 px-4 py-2.5 font-hand text-2xl font-bold text-white shadow-md active:scale-95",
						children: "⏹ Stop"
					})
				]
			}),
			loadError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-xl text-rose-500",
				children: "Ups – die Reime laden gerade nicht. Lade die Seite neu. 🔄"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full rounded-[34px] border-4 border-rose-200 bg-rose-50/70 p-5 shadow-inner",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-3 font-hand text-3xl font-bold text-rose-500",
						children: "1 · Reim-Finder"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							doLookup(typed);
						},
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: typed,
								onChange: (e) => setTyped(e.target.value),
								placeholder: "Schreib ein Wort…",
								className: "min-w-[160px] flex-1 rounded-2xl border-4 border-rose-200 bg-white px-4 py-3 font-hand text-3xl text-slate-700 outline-none focus:border-rose-400"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "rounded-2xl bg-rose-400 px-6 py-3 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-rose-500 active:scale-95",
								children: "Reime finden"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: randomWord,
								className: "rounded-2xl bg-amber-400 px-5 py-3 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-amber-500 active:scale-95",
								children: "🎲"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: STARTER.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setTyped(w);
								doLookup(w);
							},
							className: "rounded-full bg-white/80 px-4 py-1.5 font-hand text-xl font-bold text-rose-400 shadow-sm transition hover:bg-white active:scale-95",
							children: w
						}, w))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						mode: "wait",
						children: lookup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: {
								opacity: 0,
								y: -8
							},
							className: "mt-4 rounded-2xl bg-white/70 p-4",
							children: currentRhymes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-hand text-2xl text-slate-600",
									children: [
										"Reime auf ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-rose-500",
											children: lookup
										}),
										":"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: currentRhymes.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
										initial: {
											opacity: 0,
											scale: .8
										},
										animate: {
											opacity: 1,
											scale: 1
										},
										transition: { delay: i * .04 },
										whileTap: { scale: .9 },
										onClick: () => dropIntoRap(r),
										title: "Antippen: vorlesen + in den Rap",
										className: "rounded-2xl border-2 border-rose-200 bg-rose-100 px-4 py-2 font-hand text-2xl font-bold text-rose-600 shadow-sm transition hover:bg-rose-200 active:scale-90",
										children: r
									}, r))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-sans text-xs font-bold uppercase tracking-wider text-slate-400",
									children: "Tipp: Reim antippen → vorgelesen + kommt in deinen Rap"
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-hand text-2xl text-slate-500",
								children: [
									"Hmm, auf ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-rose-500",
										children: lookup
									}),
									" kenne ich noch keinen Reim – probier ein anderes Wort",
									pro ? "" : " (oder schalt 🔥 Profi an)",
									"! 🙂"
								]
							})
						}, lookup + String(pro))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full rounded-[34px] border-4 border-violet-200 bg-violet-50/70 p-5 shadow-inner",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-hand text-3xl font-bold text-violet-500",
							children: "2 · Mein Rap"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => rapText && speak(rapText),
									className: "rounded-2xl bg-violet-500 px-4 py-2.5 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-violet-600 active:scale-95",
									children: "🎤 Vorlesen"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: saveRap,
									className: "rounded-2xl bg-emerald-500 px-4 py-2.5 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-emerald-600 active:scale-95",
									children: "💾 Merken"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: shareRap,
									className: "rounded-2xl bg-sky-500 px-4 py-2.5 font-hand text-2xl font-bold text-white shadow-md transition hover:bg-sky-600 active:scale-95",
									children: shared ? "✓ kopiert" : "📤 Teilen"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setLines(lines.map(() => ""));
										rewarded.current.clear();
										playPop();
									},
									className: "rounded-2xl bg-white/80 px-4 py-2.5 font-hand text-2xl font-bold text-slate-400 shadow-sm transition hover:bg-white active:scale-95",
									children: "🧹 Neu"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: lines.map((line, i) => {
							const isSecond = i % 2 === 1;
							const rhymes = pairs[i - 1];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-7 shrink-0 text-center font-hand text-2xl font-bold text-violet-300",
										children: i + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: line,
										onChange: (e) => setLine(i, e.target.value),
										placeholder: i === 0 ? "Ich hab einen Hund…" : i === 1 ? "…und der ist bunt" : "schreib weiter…",
										className: "flex-1 rounded-2xl border-4 border-violet-200 bg-white px-4 py-2.5 font-hand text-2xl text-slate-700 outline-none focus:border-violet-400"
									}),
									isSecond && (line || lines[i - 1]) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `shrink-0 font-hand text-2xl font-bold ${rhymes ? "text-emerald-500" : "text-slate-300"}`,
										children: rhymes ? "✓ reimt!" : "💡"
									})
								]
							}, i);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-xs font-bold uppercase tracking-wider text-slate-400",
							children: "Jede 2. Zeile reimt sich mit der Zeile darüber."
						}), lines.length < 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: addCouplet,
							className: "rounded-xl bg-violet-200 px-3 py-1.5 font-hand text-xl font-bold text-violet-600 transition hover:bg-violet-300 active:scale-95",
							children: "+ 2 Zeilen"
						})]
					})
				]
			}),
			saved.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full rounded-[34px] border-4 border-amber-200 bg-amber-50/70 p-5 shadow-inner",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 font-hand text-3xl font-bold text-amber-500",
					children: "⭐ Meine Raps"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: saved.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-2xl bg-white/80 p-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => loadRap(entry),
								className: "flex-1 truncate text-left font-hand text-xl text-slate-600 hover:text-slate-900",
								children: entry.lines.filter((l) => l.trim()).join(" / ") || "(leer)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => speak(entry.lines.filter((l) => l.trim()).join("\n")),
								className: "rounded-lg px-2 py-1 text-xl active:scale-90",
								title: "Vorlesen",
								children: "🔊"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => delRap(entry.id),
								className: "rounded-lg px-2 py-1 text-xl text-slate-300 hover:text-rose-400 active:scale-90",
								title: "Löschen",
								children: "🗑️"
							})
						]
					}, entry.id))
				})]
			})
		]
	});
}
//#endregion
//#region src/modules/DeutschModule.jsx
var SubjectPremiumAtelier = (0, import_react.lazy)(() => __vitePreload(() => import("./SubjectPremiumAtelier-OFFtJlBa.js"), __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12])));
var SkyWonderland = (0, import_react.lazy)(() => __vitePreload(() => import("./SkyWonderland-Bz4SaHcY.js"), __vite__mapDeps([13,1,2,3,4,12,14,7,8])));
var DeepLearningQuest = (0, import_react.lazy)(() => __vitePreload(() => import("./DeepLearningQuest-CbOGahul.js"), __vite__mapDeps([5,1,2,3,4,6,7,8,9])));
var LearningArcade = (0, import_react.lazy)(() => __vitePreload(() => import("./LearningArcade-BGnmy9QN.js"), __vite__mapDeps([15,1,2,3,4,10,6,12,16,8,9])));
var deutschUebungen = DEUTSCH_CONTENT.wordClassExercises;
var WORD_CLASSES = {
	Artikel: {
		color: "#0ea5e9",
		bg: "bg-sky-50",
		border: "border-sky-300",
		icon: "A"
	},
	Nomen: {
		color: "#f43f5e",
		bg: "bg-rose-50",
		border: "border-rose-300",
		icon: "N"
	},
	Verb: {
		color: "#8b5cf6",
		bg: "bg-violet-50",
		border: "border-violet-300",
		icon: "V"
	},
	Adjektiv: {
		color: "#f59e0b",
		bg: "bg-amber-50",
		border: "border-amber-300",
		icon: "Adj"
	},
	Präposition: {
		color: "#14b8a6",
		bg: "bg-teal-50",
		border: "border-teal-300",
		icon: "Präp"
	}
};
var WordHouse = ({ type, words = [], containerRef }) => {
	const config = WORD_CLASSES[type];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex-1 min-w-[140px] min-h-[180px] rounded-[30px_30px_10px_10px] border-2 border-dashed ${config.border} ${config.bg} flex flex-col items-center p-4 relative watercolor-effect transition-all`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -top-6 w-12 h-12 rounded-full bg-white border-2 border-inherit flex items-center justify-center shadow-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-hand text-xl font-bold",
					style: { color: config.color },
					children: config.icon
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "mt-4 font-hand text-xl font-bold mb-3",
				style: { color: config.color },
				children: type
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: words.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: { scale: 0 },
					animate: { scale: 1 },
					exit: { scale: 0 },
					className: "bg-white px-3 py-1.5 rounded-xl shadow-sm text-center font-hand text-lg border border-slate-100",
					children: w
				}, w + i)) })
			})
		]
	});
};
var DraggableWord = ({ word, onDragEnd, containerRef }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
	drag: true,
	dragConstraints: containerRef,
	dragElastic: .1,
	dragMomentum: false,
	onDragEnd: (e, info) => onDragEnd(word, info.point),
	whileDrag: {
		scale: 1.15,
		rotate: [
			0,
			-2,
			2,
			0
		],
		zIndex: 100
	},
	whileHover: {
		scale: 1.05,
		y: -2
	},
	className: "px-6 py-3 bg-white rounded-2xl shadow-md border-2 border-slate-100 cursor-grab active:cursor-grabbing font-hand text-3xl text-slate-700",
	children: word
});
function WortartenGame({ onCorrect, onWrong }) {
	const [exerciseIdx, setExerciseIdx] = (0, import_react.useState)(0);
	const [assigned, setAssigned] = (0, import_react.useState)({});
	const [remainingWords, setRemainingWords] = (0, import_react.useState)(deutschUebungen[0].satz);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const containerRef = (0, import_react.useRef)(null);
	const housesRef = (0, import_react.useRef)({});
	const exercise = deutschUebungen[exerciseIdx];
	const handleDrop = (word, point) => {
		let droppedInType = null;
		Object.keys(WORD_CLASSES).forEach((type) => {
			const el = housesRef.current[type];
			if (el) {
				const rect = el.getBoundingClientRect();
				const rectLeft = rect.left + window.scrollX;
				const rectRight = rect.right + window.scrollX;
				const rectTop = rect.top + window.scrollY;
				const rectBottom = rect.bottom + window.scrollY;
				if (point.x >= rectLeft - 20 && point.x <= rectRight + 20 && point.y >= rectTop - 20 && point.y <= rectBottom + 20) droppedInType = type;
			}
		});
		if (droppedInType) {
			playPop();
			setAssigned((prev) => ({
				...prev,
				[droppedInType]: [...prev[droppedInType] || [], word]
			}));
			setRemainingWords((prev) => prev.filter((w) => w !== word));
		}
	};
	const checkResult = () => {
		let isCorrect = true;
		Object.entries(assigned).forEach(([type, words]) => {
			words.forEach((w) => {
				if (exercise.loesung[w] !== type) isCorrect = false;
			});
		});
		if (isCorrect && remainingWords.length === 0) {
			playSparkle();
			setFeedback("richtig");
			onCorrect(5);
			confetti_module_default({ particleCount: 150 });
		} else {
			playError();
			setFeedback("falsch");
			setTimeout(() => setFeedback(null), 3e3);
			onWrong();
		}
	};
	const reset = () => {
		playPop();
		setAssigned({});
		setRemainingWords(exercise.satz);
		setFeedback(null);
	};
	const nextExercise = () => {
		const nextIdx = (exerciseIdx + 1) % deutschUebungen.length;
		setExerciseIdx(nextIdx);
		reset();
		setRemainingWords(deutschUebungen[nextIdx].satz);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "flex flex-col gap-10 w-full pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-4xl font-bold text-slate-800",
					children: "Das Haus der Wortarten"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500",
					children: "Ziehe jedes Wort in sein richtiges Haus!"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white/40 rounded-[40px] p-8 border-4 border-dashed border-white/60 min-h-[140px] flex flex-wrap justify-center items-center gap-4 relative z-50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: remainingWords.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraggableWord, {
					word: w,
					onDragEnd: handleDrop,
					containerRef
				}, w + i)) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-2 mt-8",
				children: exercise.wortarten.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: (el) => housesRef.current[type] = el,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordHouse, {
						type,
						words: assigned[type],
						containerRef
					})
				}, type))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between bg-white/70 p-6 rounded-[30px] shadow-xl mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: reset,
					className: "font-hand text-2xl text-slate-400 hover:text-slate-600 px-4",
					children: "Nochmal sortieren"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: !feedback || feedback === "falsch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					onClick: checkResult,
					disabled: remainingWords.length > 0,
					className: "px-12 py-4 bg-violet-500 text-white font-bold text-xl rounded-2xl shadow-lg disabled:opacity-30",
					children: "Kontrollieren"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					onClick: nextExercise,
					className: "px-12 py-4 bg-emerald-500 text-white font-bold text-xl rounded-2xl shadow-lg",
					children: "Nächster Satz →"
				}) })]
			})
		]
	});
}
var silbenWoerter = DEUTSCH_CONTENT.syllableWords;
function SilbenGame({ onCorrect, onWrong }) {
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const current = silbenWoerter[idx];
	const check = (num) => {
		if (num === current.silben) {
			playSparkle();
			setFeedback("richtig");
			onCorrect(2);
			confetti_module_default();
			setTimeout(() => {
				setIdx((idx + 1) % silbenWoerter.length);
				setFeedback(null);
			}, 2e3);
		} else {
			playError();
			setFeedback("falsch");
			onWrong();
			setTimeout(() => setFeedback(null), 2e3);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-10 py-10 w-full max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Silben klatschen!"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Wie oft musst du bei diesem Wort klatschen?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-amber-100 rounded-[50px] p-20 shadow-inner border-4 border-amber-300 w-full flex justify-center mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
					initial: {
						scale: .5,
						opacity: 0
					},
					animate: {
						scale: 1,
						opacity: 1
					},
					className: "font-hand text-8xl font-bold text-amber-800 tracking-wide",
					children: current.wort
				}, current.wort)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-6 mt-8",
				children: [
					1,
					2,
					3,
					4
				].map((num) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
					whileHover: { scale: 1.1 },
					whileTap: { scale: .9 },
					onClick: () => check(num),
					className: "w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-4 border-sky-300 text-5xl font-hand font-bold text-sky-600 hover:bg-sky-50",
					children: num
				}, num))
			}),
			feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-3xl text-red-500 font-bold mt-4",
				children: "Oh, fast! Probier nochmal!"
			}),
			feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-3xl text-emerald-500 font-bold mt-4",
				children: "Super gemacht!"
			})
		]
	});
}
var satzbauUebungen = DEUTSCH_CONTENT.sentenceExercises;
function SatzbauGame({ onCorrect, onWrong }) {
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [words, setWords] = (0, import_react.useState)(satzbauUebungen[0].worte);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const check = () => {
		if (words.join(" ") === satzbauUebungen[idx].loesung) {
			playSparkle();
			setFeedback("richtig");
			onCorrect(5);
			confetti_module_default();
			setTimeout(() => {
				const nextIdx = (idx + 1) % satzbauUebungen.length;
				setIdx(nextIdx);
				setWords(satzbauUebungen[nextIdx].worte);
				setFeedback(null);
			}, 3e3);
		} else {
			playError();
			setFeedback("falsch");
			onWrong();
			setTimeout(() => setFeedback(null), 3e3);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-8 py-10 w-full max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-4xl font-bold text-slate-800",
					children: "Satzbaumeister"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Bringe die Wörter in die richtige Reihenfolge!"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-sky-50 rounded-[40px] px-4 py-12 border-4 border-dashed border-sky-200 w-full flex justify-center shadow-inner mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReorderGroup, {
					axis: "x",
					values: words,
					onReorder: setWords,
					className: "flex flex-wrap justify-center gap-4",
					children: words.map((word) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReorderItem, {
						value: word,
						className: "px-6 py-4 bg-white rounded-2xl shadow-md border-2 border-slate-100 font-hand text-4xl text-slate-700 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform",
						children: word
					}, word))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
				whileHover: { scale: 1.05 },
				whileTap: { scale: .95 },
				onClick: check,
				className: "px-10 py-4 bg-sky-500 text-white font-bold text-xl rounded-2xl shadow-lg mt-4",
				children: "Satz überprüfen"
			}),
			feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-2xl text-red-500 font-bold",
				children: "Das klingt noch etwas komisch. Versuche es weiter!"
			}),
			feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-2xl text-emerald-500 font-bold",
				children: "Prima! Ein toller Satz."
			})
		]
	});
}
var LAB_DICTIONARY = LAB_DICTIONARY$1;
var SYLLABLES = LAB_SYLLABLES;
function WortLaborGame({ onCorrect, onWrong }) {
	const [inCauldron, setInCauldron] = (0, import_react.useState)([]);
	const [discovered, setDiscovered] = (0, import_react.useState)([]);
	const [isBrewing, setIsBrewing] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const addSyllable = (s) => {
		if (isBrewing) return;
		playPop();
		setInCauldron((prev) => [...prev, s]);
	};
	const clearCauldron = () => {
		playPop();
		setInCauldron([]);
		setFeedback(null);
	};
	const brew = () => {
		if (inCauldron.length === 0) return;
		setIsBrewing(true);
		const word = inCauldron.join("");
		setTimeout(() => {
			setIsBrewing(false);
			if (LAB_DICTIONARY[word]) if (!discovered.includes(word)) {
				setDiscovered((prev) => [...prev, word]);
				playSparkle();
				setFeedback({
					type: "success",
					text: `Entdeckt: ${word} ${LAB_DICTIONARY[word]}!`
				});
				onCorrect(10);
				confetti_module_default({
					particleCount: 100,
					origin: { y: .8 }
				});
			} else setFeedback({
				type: "info",
				text: "Das kennst du schon!"
			});
			else {
				playError();
				setFeedback({
					type: "error",
					text: "Hm, das gibt es wohl noch nicht..."
				});
				onWrong();
			}
		}, 1500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8 items-center py-6 w-full max-w-5xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Das Wort-Labor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Mixe Silben im Zauberkessel und entdecke neue Wörter!"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-12 w-full mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white/60 rounded-[40px] p-8 border-4 border-white shadow-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-hand text-3xl font-bold text-slate-700 mb-6 border-b pb-2",
						children: "Zutaten-Regal"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-3 max-h-[400px] overflow-y-auto pr-2",
						children: SYLLABLES.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
							whileHover: {
								scale: 1.1,
								rotate: 2
							},
							whileTap: { scale: .9 },
							onClick: () => addSyllable(s),
							className: "px-4 py-2 bg-amber-50 rounded-xl border-2 border-amber-200 font-hand text-2xl text-amber-900 shadow-sm hover:shadow-md transition-all",
							children: s
						}, s + i))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-64 h-64 md:w-80 md:h-80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 200 200",
							className: "w-full h-full drop-shadow-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M40 80 Q40 60 100 60 Q160 60 160 80 L170 140 Q170 180 100 180 Q30 180 30 140 Z",
									fill: "#475569",
									stroke: "#1e293b",
									strokeWidth: "4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
									cx: "100",
									cy: "80",
									rx: "60",
									ry: "15",
									fill: "#334155"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M50 80 Q50 75 100 75 Q150 75 150 80 Q150 85 100 85 Q50 85 50 80",
									fill: isBrewing ? "#8b5cf6" : "#4f46e5",
									opacity: "0.6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
										attributeName: "fill",
										values: "#4f46e5;#8b5cf6;#4f46e5",
										dur: "3s",
										repeatCount: "Indefinite"
									})
								}),
								isBrewing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("circle", {
										cx: "70",
										cy: "70",
										r: "5",
										fill: "#a78bfa",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
											attributeName: "cy",
											values: "70;30;70",
											dur: "1s",
											repeatCount: "Indefinite"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
											attributeName: "opacity",
											values: "1;0;1",
											dur: "1s",
											repeatCount: "Indefinite"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("circle", {
										cx: "100",
										cy: "65",
										r: "8",
										fill: "#c4b5fd",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
											attributeName: "cy",
											values: "65;20;65",
											dur: "1.5s",
											repeatCount: "Indefinite"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
											attributeName: "opacity",
											values: "1;0;1",
											dur: "1.5s",
											repeatCount: "Indefinite"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("circle", {
										cx: "130",
										cy: "70",
										r: "6",
										fill: "#ddd6fe",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
											attributeName: "cy",
											values: "70;40;70",
											dur: "1.2s",
											repeatCount: "Indefinite"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("animate", {
											attributeName: "opacity",
											values: "1;0;1",
											dur: "1.2s",
											repeatCount: "Indefinite"
										})]
									})
								] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-[40%] left-1/2 -translate-x-1/2 text-center w-full px-4 overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap justify-center gap-1",
								children: inCauldron.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
									initial: {
										y: -20,
										opacity: 0
									},
									animate: {
										y: 0,
										opacity: 1
									},
									className: "font-hand text-xl font-bold text-white drop-shadow-md",
									children: s
								}, i))
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: clearCauldron,
							className: "px-6 py-2 bg-slate-200 rounded-xl font-hand text-xl text-slate-600 hover:bg-slate-300",
							children: "Leeren"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
							whileHover: { scale: 1.05 },
							whileTap: { scale: .95 },
							onClick: brew,
							disabled: inCauldron.length === 0 || isBrewing,
							className: `px-12 py-4 rounded-2xl font-bold text-2xl shadow-lg transition-all ${isBrewing ? "bg-purple-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`,
							children: isBrewing ? "Brodelt..." : "Brauen! ✨"
						})]
					})]
				})]
			}),
			feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					y: 20,
					opacity: 0
				},
				animate: {
					y: 0,
					opacity: 1
				},
				className: `px-8 py-4 rounded-2xl font-hand text-3xl font-bold border-2 ${feedback.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : feedback.type === "error" ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-sky-50 border-sky-200 text-sky-700"}`,
				children: feedback.text
			}),
			discovered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full mt-8 bg-white/40 p-6 rounded-3xl border-2 border-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-hand text-2xl font-bold text-slate-600 mb-4 text-center italic",
					children: "Deine Entdeckungen:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap justify-center gap-4",
					children: discovered.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-2 bg-white/80 rounded-xl border border-slate-200 shadow-sm font-hand text-xl text-slate-700",
						children: [
							w,
							" ",
							LAB_DICTIONARY[w]
						]
					}, w))
				})]
			})
		]
	});
}
var ARTIKEL_WORDS = DEUTSCH_CONTENT.articleWords;
function ArtikelSeeGame({ onCorrect, onWrong }) {
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const dropZoneRef = (0, import_react.useRef)(null);
	const currentWord = ARTIKEL_WORDS[idx];
	const handleDrop = (artikelArtikel) => {
		if (artikelArtikel === currentWord.artikel) {
			playSparkle();
			setFeedback("richtig");
			onCorrect(3);
			confetti_module_default();
			setTimeout(() => {
				setIdx((idx + 1) % ARTIKEL_WORDS.length);
				setFeedback(null);
			}, 2e3);
		} else {
			playError();
			setFeedback("falsch");
			onWrong();
			setTimeout(() => setFeedback(null), 2e3);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-10 py-8 w-full max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Der Artikel-See"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Zieh den richtigen Frosch auf das Blatt!"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-6 pb-6",
				children: [
					"Der",
					"Die",
					"Das"
				].map((art) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					drag: true,
					dragSnapToOrigin: true,
					whileDrag: {
						scale: 1.2,
						zIndex: 50
					},
					whileHover: { scale: 1.1 },
					onDragStart: (e) => e.dataTransfer?.setData("text", art),
					onDragEnd: (e, info) => {
						if (!dropZoneRef.current) return;
						const rect = dropZoneRef.current.getBoundingClientRect();
						const rectLeft = rect.left + window.scrollX;
						const rectRight = rect.right + window.scrollX;
						const rectTop = rect.top + window.scrollY;
						const rectBottom = rect.bottom + window.scrollY;
						if (info.point.x >= rectLeft - 30 && info.point.x <= rectRight + 30 && info.point.y >= rectTop - 30 && info.point.y <= rectBottom + 30) handleDrop(art);
					},
					className: "w-24 h-24 bg-emerald-100 rounded-full border-4 border-emerald-400 shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing relative watercolor-effect",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -top-2 text-4xl",
						children: "🐸"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand font-bold text-3xl text-emerald-800 mt-4",
						children: art
					})]
				}, art))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full h-[300px] bg-gradient-to-b from-sky-200 to-blue-400 rounded-[60px] border-8 border-sky-100 shadow-inner relative flex items-center justify-center overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute w-[400px] h-[150px] border-4 border-white/20 rounded-[50%] animate-ping",
					style: { animationDuration: "4s" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					ref: dropZoneRef,
					initial: {
						y: -50,
						opacity: 0
					},
					animate: {
						y: 0,
						opacity: 1
					},
					className: "w-64 h-24 bg-emerald-400 rounded-[50%] shadow-lg border-b-8 border-emerald-600 flex items-center justify-center relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-4 top-8 w-12 h-12 bg-blue-400 rounded-full transform -skew-x-12" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `font-hand text-4xl font-bold ${currentWord.color} bg-white/80 px-6 py-2 rounded-2xl shadow-sm z-10 -rotate-2`,
						children: currentWord.wort
					})]
				}, currentWord.wort)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, { children: [feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
				initial: {
					opacity: 0,
					scale: .8
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: { opacity: 0 },
				className: "font-hand text-3xl text-red-500 font-bold bg-white/80 px-6 py-2 rounded-2xl border-2 border-red-200",
				children: "Oh je, der Frosch ist ins Wasser geplumpst!"
			}), feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
				initial: {
					opacity: 0,
					scale: .8
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: { opacity: 0 },
				className: "font-hand text-3xl text-emerald-500 font-bold bg-white/80 px-6 py-2 rounded-2xl border-2 border-emerald-200",
				children: "Platsch! Genau richtig."
			})] })
		]
	});
}
var stableChoiceScore = (text, seed) => String(text).split("").reduce((score, char, index) => score + char.charCodeAt(0) * (index + 7 + seed), seed * 31);
var buildStableOptions = (pairs, index) => {
	const pair = pairs[index];
	const options = [pair.b, ...pairs.filter((entry) => entry.b !== pair.b).map((entry) => entry.b)].sort((a, b) => stableChoiceScore(a, index) - stableChoiceScore(b, index)).slice(0, 3);
	if (!options.includes(pair.b)) options[0] = pair.b;
	return options.sort((a, b) => stableChoiceScore(a, index + 17) - stableChoiceScore(b, index + 17));
};
var REIM_PAARE = DEUTSCH_CONTENT.rhymePairs;
function ReimMaschineGame({ onCorrect, onWrong }) {
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [isSpinning, setIsSpinning] = (0, import_react.useState)(false);
	const pair = REIM_PAARE[idx];
	const options = buildStableOptions(REIM_PAARE, idx);
	const handleSelect = (word) => {
		if (word === pair.b) {
			playSparkle();
			setFeedback("richtig");
			setIsSpinning(true);
			onCorrect(4);
			confetti_module_default();
			setTimeout(() => {
				setIsSpinning(false);
				setIdx((idx + 1) % REIM_PAARE.length);
				setFeedback(null);
			}, 2500);
		} else {
			playError();
			setFeedback("falsch");
			onWrong();
			setTimeout(() => setFeedback(null), 2e3);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-10 py-8 w-full max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Die Reim-Maschine"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Welches Wort reimt sich auf das linke Rad?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row items-center gap-12 mt-8 bg-slate-50 p-12 rounded-[50px] border-4 border-slate-200 shadow-inner w-full justify-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						animate: { rotate: isSpinning ? 360 : 0 },
						transition: {
							duration: 2,
							ease: "easeInOut"
						},
						className: `w-40 h-40 rounded-full border-8 border-slate-700 flex items-center justify-center relative ${pair.color}`,
						children: [[
							0,
							45,
							90,
							135,
							180,
							225,
							270,
							315
						].map((deg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute w-6 h-6 bg-slate-700",
							style: { transform: `rotate(${deg}deg) translateY(-22px)` }
						}, deg)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-full bg-inherit rounded-full z-10 flex items-center justify-center border-4 border-white/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-hand text-3xl font-bold text-slate-800 bg-white/80 px-3 py-1 rounded-xl shadow-sm",
								children: pair.a
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-5xl text-slate-300 font-bold",
						children: "〰️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-4",
						children: options.map((opt, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
							whileHover: { scale: 1.05 },
							whileTap: { scale: .95 },
							onClick: () => !isSpinning && handleSelect(opt),
							className: `w-40 py-4 bg-white border-4 ${isSpinning && opt === pair.b ? "border-emerald-400 bg-emerald-50" : "border-slate-300 hover:border-slate-400"} rounded-2xl shadow-md font-hand text-2xl font-bold text-slate-700`,
							children: opt
						}, opt + i))
					})
				]
			}),
			feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-3xl text-red-500 font-bold",
				children: "Krrr... das klemmt! Versuche es nochmal."
			}),
			feedback === "richtig" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-3xl text-emerald-500 font-bold",
				children: "Surrrr... die Räder drehen sich!"
			})
		]
	});
}
var GEGENTEIL_PAARE = DEUTSCH_CONTENT.antonymPairs;
function GegenteileGame({ onCorrect, onWrong }) {
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [snapped, setSnapped] = (0, import_react.useState)(false);
	const pair = GEGENTEIL_PAARE[idx];
	const options = buildStableOptions(GEGENTEIL_PAARE, idx);
	const handleSelect = (word) => {
		if (word === pair.b) {
			playPop();
			setSnapped(true);
			setFeedback("richtig");
			onCorrect(3);
			confetti_module_default({
				particleCount: 50,
				spread: 60
			});
			setTimeout(() => {
				setSnapped(false);
				setIdx((idx + 1) % GEGENTEIL_PAARE.length);
				setFeedback(null);
			}, 2e3);
		} else {
			playError();
			setFeedback("falsch");
			onWrong();
			setTimeout(() => setFeedback(null), 2e3);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-8 py-8 w-full max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold text-slate-800",
					children: "Der Gegen-Magnet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-2xl text-slate-500 mt-2",
					children: "Gegensätze ziehen sich an! Was ist das Gegenteil?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-0 mt-8 relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						animate: { y: snapped ? 20 : 0 },
						className: "w-64 h-32 bg-red-500 rounded-t-full border-8 border-red-700 flex items-end justify-center pb-4 shadow-xl z-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-4xl font-bold text-white bg-black/20 px-4 py-1 rounded-xl",
							children: pair.a
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-20 w-ful flex items-center justify-center",
						style: { width: "100%" },
						children: [snapped && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: { scale: 0 },
							animate: { scale: 1 },
							className: "text-4xl absolute z-30",
							children: "✨💥✨"
						}), !snapped && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-3xl animate-pulse",
							children: "⚡⚡⚡"
						})]
					}),
					!snapped ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-4",
						children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.button, {
							whileHover: { y: -5 },
							onClick: () => handleSelect(opt),
							className: "w-32 h-24 bg-blue-500 rounded-b-full border-4 border-blue-700 flex items-start justify-center pt-4 shadow-lg active:bg-blue-600",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-hand text-2xl font-bold text-white bg-black/20 px-2 py-1 rounded-lg",
								children: opt
							})
						}, opt))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						animate: { y: -20 },
						className: "w-64 h-32 bg-blue-500 rounded-b-[60px] border-8 border-blue-700 flex items-start justify-center pt-4 shadow-xl z-20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-4xl font-bold text-white bg-black/20 px-4 py-1 rounded-xl",
							children: pair.b
						})
					})
				]
			}),
			feedback === "falsch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-hand text-3xl text-red-500 font-bold mt-4",
				children: "Abgestoßen! Falscher Pol."
			})
		]
	});
}
var DEUTSCH_TAB_IDS = new Set([
	"himmelwelt",
	"arcade",
	"sinn",
	"wortlabor",
	"buchstaben",
	"memory",
	"wortarten",
	"silben",
	"satzbau",
	"geschichten",
	"artikel",
	"reime",
	"rap",
	"gegenteile",
	"spielwelt",
	"quest",
	"premium",
	"action",
	"varianten"
]);
var getInitialDeutschTab = () => {
	if (typeof window === "undefined") return "himmelwelt";
	const tab = new URLSearchParams(window.location.search).get("tab");
	return tab && DEUTSCH_TAB_IDS.has(tab) ? tab : "himmelwelt";
};
function DeutschModule({ onCorrect = () => {}, onWrong = () => {} }) {
	const [activeTab, setActiveTab] = (0, import_react.useState)(getInitialDeutschTab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8 w-full max-w-6xl mx-auto h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap justify-center gap-3 p-3 bg-white/40 backdrop-blur-sm rounded-[40px] border-2 border-white shadow-inner max-w-fit mx-auto",
			children: [
				{
					id: "himmelwelt",
					label: "Himmelswelt",
					color: "bg-sky-500"
				},
				{
					id: "arcade",
					label: "Arcade-Welt",
					color: "bg-orange-500"
				},
				{
					id: "sinn",
					label: "Denk-Abenteuer",
					color: "bg-slate-900"
				},
				{
					id: "wortlabor",
					label: "Wort-Labor",
					color: "bg-indigo-500"
				},
				{
					id: "buchstaben",
					label: "Buchstaben",
					color: "bg-lime-500"
				},
				{
					id: "memory",
					label: "Wort-Memory",
					color: "bg-sky-400"
				},
				{
					id: "wortarten",
					label: "Wortarten",
					color: "bg-fuchsia-400"
				},
				{
					id: "silben",
					label: "Silben",
					color: "bg-amber-400"
				},
				{
					id: "satzbau",
					label: "Satzbau",
					color: "bg-sky-400"
				},
				{
					id: "geschichten",
					label: "Geschichten",
					color: "bg-orange-400"
				},
				{
					id: "artikel",
					label: "Artikel-See",
					color: "bg-emerald-400"
				},
				{
					id: "reime",
					label: "Reim-Maschine",
					color: "bg-rose-400"
				},
				{
					id: "rap",
					label: "🎤 Rap-Studio",
					color: "bg-purple-600"
				},
				{
					id: "gegenteile",
					label: "Gegenteile",
					color: "bg-violet-400"
				},
				{
					id: "spielwelt",
					label: "Spielwelt",
					color: "bg-fuchsia-500"
				},
				{
					id: "quest",
					label: "Quest-Mixer",
					color: "bg-emerald-500"
				},
				{
					id: "premium",
					label: "Premium-Atelier",
					color: "bg-amber-500"
				},
				{
					id: "action",
					label: "Fangspiel",
					color: "bg-orange-500"
				},
				{
					id: "varianten",
					label: "Mega-Auswahl",
					color: "bg-slate-800"
				}
			].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setActiveTab(tab.id),
				className: `px-6 py-2.5 rounded-full font-hand text-2xl font-bold transition-all ${activeTab === tab.id ? `${tab.color} text-white shadow-lg scale-105` : "text-slate-500 hover:bg-white/60"}`,
				children: tab.label
			}, tab.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -10
					},
					children: [
						activeTab === "himmelwelt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[620px] rounded-[34px] bg-sky-100/80 border-4 border-white shadow-lg" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyWonderland, {
								title: "Himmelswunderland",
								onCorrect,
								onWrong
							})
						}),
						activeTab === "arcade" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[660px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearningArcade, {
								subject: "deutsch",
								onCorrect,
								onWrong
							})
						}),
						activeTab === "sinn" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[640px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeepLearningQuest, {
								subject: "deutsch",
								onCorrect,
								onWrong
							})
						}),
						activeTab === "wortlabor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WortLaborGame, {
							onCorrect,
							onWrong
						}),
						activeTab === "buchstaben" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuchstabenWiese, {
							onCorrect,
							onWrong
						}),
						activeTab === "memory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WortSchatzMemory, {
							onCorrect,
							onWrong
						}),
						activeTab === "wortarten" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WortartenGame, {
							onCorrect,
							onWrong
						}),
						activeTab === "silben" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SilbenGame, {
							onCorrect,
							onWrong
						}),
						activeTab === "satzbau" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SatzbauGame, {
							onCorrect,
							onWrong
						}),
						activeTab === "geschichten" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeschichtenGarten, {
							onCorrect,
							onWrong
						}),
						activeTab === "artikel" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArtikelSeeGame, {
							onCorrect,
							onWrong
						}),
						activeTab === "reime" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReimMaschineGame, {
							onCorrect,
							onWrong
						}),
						activeTab === "rap" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RapStudio, {
							onCorrect,
							onWrong
						}),
						activeTab === "gegenteile" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GegenteileGame, {
							onCorrect,
							onWrong
						}),
						activeTab === "spielwelt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameWorld, {
							title: "Sprach-Spielwelt",
							intro: "Acht Spielarten mit Bildwelt, Bewegung, Puzzle, Atelier und erweitertem Premium-Wortpool.",
							collections: SUBJECT_VARIANT_CONTENT.deutsch,
							accent: "bg-fuchsia-500",
							scene: "language",
							onCorrect,
							onWrong
						}),
						activeTab === "quest" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestMixer, {
							title: "Sprach-Quest-Mixer",
							intro: "Expedition, Puzzle, Sternenlauf und Kartenwirbel mit Premium-Wortschatz, Silben, Bildern und Reimen.",
							collections: SUBJECT_VARIANT_CONTENT.deutsch,
							accent: "bg-emerald-500",
							onCorrect,
							onWrong
						}),
						activeTab === "premium" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[360px] rounded-[34px] bg-white/70 border-4 border-white shadow-lg" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubjectPremiumAtelier, {
								subject: "deutsch",
								onCorrect,
								onWrong
							})
						}),
						activeTab === "action" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionArena, {
							title: "Wörter-Fangspiel",
							intro: "Fang die richtige Antwort, halte deine Herzen und baue eine Combo auf.",
							collections: SUBJECT_VARIANT_CONTENT.deutsch,
							accent: "bg-orange-500",
							onCorrect,
							onWrong
						}),
						activeTab === "varianten" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VariantStudio, {
							title: "Sprach-Mega-Auswahl",
							intro: "Viele Wortschatz-, Laut-, Artikel-, Silben-, Reim-, Bild- und Gegensatzkarten aus dem erweiterten Premium-Pool.",
							collections: SUBJECT_VARIANT_CONTENT.deutsch,
							onCorrect,
							onWrong
						})
					]
				}, activeTab)
			})
		})]
	});
}
//#endregion
export { DeutschModule as default };
