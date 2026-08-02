import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { t as _extends } from "./extends-DijYlAKA.js";
//#region node_modules/@react-three/drei/core/shapes.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function create(type, effect) {
	const El = type + "Geometry";
	return /* @__PURE__ */ import_react.forwardRef(({ args, children, ...props }, fref) => {
		const ref = import_react.useRef(null);
		import_react.useImperativeHandle(fref, () => ref.current);
		import_react.useLayoutEffect(() => void (effect == null ? void 0 : effect(ref.current)));
		return /* @__PURE__ */ import_react.createElement("mesh", _extends({ ref }, props), /* @__PURE__ */ import_react.createElement(El, {
			attach: "geometry",
			args
		}), children);
	});
}
var Box = /* @__PURE__ */ create("box");
var Cylinder = /* @__PURE__ */ create("cylinder");
var Sphere = /* @__PURE__ */ create("sphere");
//#endregion
export { Cylinder as n, Sphere as r, Box as t };
