import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { t as create } from "./react-B1iXS_n6.js";
//#region node_modules/zustand/esm/middleware.mjs
var subscribeWithSelectorImpl = (fn) => (set, get, api) => {
	const origSubscribe = api.subscribe;
	api.subscribe = ((selector, optListener, options) => {
		let listener = selector;
		if (optListener) {
			const equalityFn = (options == null ? void 0 : options.equalityFn) || Object.is;
			let currentSlice = selector(api.getState());
			listener = (state) => {
				const nextSlice = selector(state);
				if (!equalityFn(currentSlice, nextSlice)) {
					const previousSlice = currentSlice;
					optListener(currentSlice = nextSlice, previousSlice);
				}
			};
			if (options == null ? void 0 : options.fireImmediately) optListener(currentSlice, currentSlice);
		}
		return origSubscribe(listener);
	});
	return fn(set, get, api);
};
var subscribeWithSelector = subscribeWithSelectorImpl;
//#endregion
//#region node_modules/@react-three/drei/web/KeyboardControls.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var context = /* @__PURE__ */ import_react.createContext(null);
function KeyboardControls({ map, children, onChange, domElement }) {
	const key = map.map((item) => item.name + item.keys).join("-");
	const useControls = import_react.useMemo(() => {
		return create(subscribeWithSelector(() => map.reduce((prev, cur) => ({
			...prev,
			[cur.name]: false
		}), {})));
	}, [key]);
	const api = import_react.useMemo(() => [
		useControls.subscribe,
		useControls.getState,
		useControls
	], [key]);
	const set = useControls.setState;
	import_react.useEffect(() => {
		const keyMap = map.map(({ name, keys, up }) => ({
			keys,
			up,
			fn: (value) => {
				set({ [name]: value });
				if (onChange) onChange(name, value, api[1]());
			}
		})).reduce((out, { keys, fn, up = true }) => {
			keys.forEach((key) => out[key] = {
				fn,
				pressed: false,
				up
			});
			return out;
		}, {});
		const downHandler = ({ key, code }) => {
			const obj = keyMap[key] || keyMap[code];
			if (!obj) return;
			const { fn, pressed, up } = obj;
			obj.pressed = true;
			if (up || !pressed) fn(true);
		};
		const upHandler = ({ key, code }) => {
			const obj = keyMap[key] || keyMap[code];
			if (!obj) return;
			const { fn, up } = obj;
			obj.pressed = false;
			if (up) fn(false);
		};
		const source = domElement || window;
		source.addEventListener("keydown", downHandler, { passive: true });
		source.addEventListener("keyup", upHandler, { passive: true });
		return () => {
			source.removeEventListener("keydown", downHandler);
			source.removeEventListener("keyup", upHandler);
		};
	}, [domElement, key]);
	return /* @__PURE__ */ import_react.createElement(context.Provider, {
		value: api,
		children
	});
}
function useKeyboardControls(sel) {
	const [sub, get, store] = import_react.useContext(context);
	if (sel) return store(sel);
	else return [sub, get];
}
//#endregion
export { useKeyboardControls as n, KeyboardControls as t };
