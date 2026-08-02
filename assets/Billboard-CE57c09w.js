import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { a as useFrame, mt as Quaternion } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as _extends } from "./extends-DijYlAKA.js";
//#region node_modules/@react-three/drei/core/Billboard.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Wraps children in a billboarded group. Sample usage:
*
* ```js
* <Billboard>
*   <Text>hi</Text>
* </Billboard>
* ```
*/
var Billboard = /* @__PURE__ */ import_react.forwardRef(function Billboard({ children, follow = true, lockX = false, lockY = false, lockZ = false, ...props }, fref) {
	const inner = import_react.useRef(null);
	const localRef = import_react.useRef(null);
	const q = new Quaternion();
	useFrame(({ camera }) => {
		if (!follow || !localRef.current) return;
		const prevRotation = inner.current.rotation.clone();
		localRef.current.updateMatrix();
		localRef.current.updateWorldMatrix(false, false);
		localRef.current.getWorldQuaternion(q);
		camera.getWorldQuaternion(inner.current.quaternion).premultiply(q.invert());
		if (lockX) inner.current.rotation.x = prevRotation.x;
		if (lockY) inner.current.rotation.y = prevRotation.y;
		if (lockZ) inner.current.rotation.z = prevRotation.z;
	});
	import_react.useImperativeHandle(fref, () => localRef.current, []);
	return /* @__PURE__ */ import_react.createElement("group", _extends({ ref: localRef }, props), /* @__PURE__ */ import_react.createElement("group", { ref: inner }, children));
});
//#endregion
export { Billboard as t };
