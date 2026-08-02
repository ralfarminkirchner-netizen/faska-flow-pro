import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { Ot as Spherical, Rt as Vector3, S as Color, a as useFrame, wt as ShaderMaterial } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as version } from "./constants-B7-Wg9vD.js";
//#region node_modules/@react-three/drei/core/Stars.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var StarfieldMaterial = class extends ShaderMaterial {
	constructor() {
		super({
			uniforms: {
				time: { value: 0 },
				fade: { value: 1 }
			},
			vertexShader: `
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,
			fragmentShader: `
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${version >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
      }`
		});
	}
};
var genStar = (r) => {
	return new Vector3().setFromSpherical(new Spherical(r, Math.acos(1 - Math.random() * 2), Math.random() * 2 * Math.PI));
};
var Stars = /* @__PURE__ */ import_react.forwardRef(({ radius = 100, depth = 50, count = 5e3, saturation = 0, factor = 4, fade = false, speed = 1 }, ref) => {
	const material = import_react.useRef(null);
	const [position, color, size] = import_react.useMemo(() => {
		const positions = [];
		const colors = [];
		const sizes = Array.from({ length: count }, () => (.5 + .5 * Math.random()) * factor);
		const color = new Color();
		let r = radius + depth;
		const increment = depth / count;
		for (let i = 0; i < count; i++) {
			r -= increment * Math.random();
			positions.push(...genStar(r).toArray());
			color.setHSL(i / count, saturation, .9);
			colors.push(color.r, color.g, color.b);
		}
		return [
			new Float32Array(positions),
			new Float32Array(colors),
			new Float32Array(sizes)
		];
	}, [
		count,
		depth,
		factor,
		radius,
		saturation
	]);
	useFrame((state) => material.current && (material.current.uniforms.time.value = state.clock.elapsedTime * speed));
	const [starfieldMaterial] = import_react.useState(() => new StarfieldMaterial());
	return /* @__PURE__ */ import_react.createElement("points", { ref }, /* @__PURE__ */ import_react.createElement("bufferGeometry", null, /* @__PURE__ */ import_react.createElement("bufferAttribute", {
		attach: "attributes-position",
		args: [position, 3]
	}), /* @__PURE__ */ import_react.createElement("bufferAttribute", {
		attach: "attributes-color",
		args: [color, 3]
	}), /* @__PURE__ */ import_react.createElement("bufferAttribute", {
		attach: "attributes-size",
		args: [size, 1]
	})), /* @__PURE__ */ import_react.createElement("primitive", {
		ref: material,
		object: starfieldMaterial,
		attach: "material",
		blending: 2,
		"uniforms-fade-value": fade,
		depthWrite: false,
		transparent: true,
		vertexColors: true
	}));
});
//#endregion
export { Stars as t };
