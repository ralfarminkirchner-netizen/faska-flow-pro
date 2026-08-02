import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { a as useFrame, s as useThree } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as _extends } from "./extends-DijYlAKA.js";
import { t as useFBO } from "./Fbo-Dydwdw0L.js";
//#region node_modules/@react-three/drei/core/PerspectiveCamera.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var isFunction = (node) => typeof node === "function";
var PerspectiveCamera = /* @__PURE__ */ import_react.forwardRef(({ envMap, resolution = 256, frames = Infinity, makeDefault, children, ...props }, ref) => {
	const set = useThree(({ set }) => set);
	const camera = useThree(({ camera }) => camera);
	const size = useThree(({ size }) => size);
	const cameraRef = import_react.useRef(null);
	import_react.useImperativeHandle(ref, () => cameraRef.current, []);
	const groupRef = import_react.useRef(null);
	const fbo = useFBO(resolution);
	import_react.useLayoutEffect(() => {
		if (!props.manual) cameraRef.current.aspect = size.width / size.height;
	}, [size, props]);
	import_react.useLayoutEffect(() => {
		cameraRef.current.updateProjectionMatrix();
	});
	let count = 0;
	let oldEnvMap = null;
	const functional = isFunction(children);
	useFrame((state) => {
		if (functional && (frames === Infinity || count < frames)) {
			groupRef.current.visible = false;
			state.gl.setRenderTarget(fbo);
			oldEnvMap = state.scene.background;
			if (envMap) state.scene.background = envMap;
			state.gl.render(state.scene, cameraRef.current);
			state.scene.background = oldEnvMap;
			state.gl.setRenderTarget(null);
			groupRef.current.visible = true;
			count++;
		}
	});
	import_react.useLayoutEffect(() => {
		if (makeDefault) {
			const oldCam = camera;
			set(() => ({ camera: cameraRef.current }));
			return () => set(() => ({ camera: oldCam }));
		}
	}, [
		cameraRef,
		makeDefault,
		set
	]);
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, /* @__PURE__ */ import_react.createElement("perspectiveCamera", _extends({ ref: cameraRef }, props), !functional && children), /* @__PURE__ */ import_react.createElement("group", { ref: groupRef }, functional && children(fbo.texture)));
});
//#endregion
export { PerspectiveCamera as t };
