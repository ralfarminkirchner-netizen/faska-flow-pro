import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { Bt as WebGLRenderTarget, G as LinearFilter, I as FloatType, L as HalfFloatType, k as DepthTexture, s as useThree } from "./react-three-fiber.esm-pJsmxxS9.js";
//#region node_modules/@react-three/drei/core/Fbo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useFBO(width, height, settings) {
	const size = useThree((state) => state.size);
	const viewport = useThree((state) => state.viewport);
	const _width = typeof width === "number" ? width : size.width * viewport.dpr;
	const _height = typeof height === "number" ? height : size.height * viewport.dpr;
	const _settings = (typeof width === "number" ? settings : width) || {};
	const { samples = 0, depth, ...targetSettings } = _settings;
	const depthBuffer = depth !== null && depth !== void 0 ? depth : _settings.depthBuffer;
	const target = import_react.useMemo(() => {
		const target = new WebGLRenderTarget(_width, _height, {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			type: HalfFloatType,
			...targetSettings
		});
		if (depthBuffer) target.depthTexture = new DepthTexture(_width, _height, FloatType);
		target.samples = samples;
		return target;
	}, []);
	import_react.useLayoutEffect(() => {
		target.setSize(_width, _height);
		if (samples) target.samples = samples;
	}, [
		samples,
		target,
		_width,
		_height
	]);
	import_react.useEffect(() => {
		return () => target.dispose();
	}, []);
	return target;
}
//#endregion
export { useFBO as t };
