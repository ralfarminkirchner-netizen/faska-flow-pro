import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { Bt as WebGLRenderTarget, Rt as Vector3, S as Color, a as useFrame, it as MeshDepthMaterial, nt as Mesh, pt as PlaneGeometry, s as useThree, t as Canvas, wt as ShaderMaterial } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as _extends } from "./extends-DijYlAKA.js";
import { a as Physics, i as InstancedRigidBodies, o as RigidBody } from "./react-three-rapier.esm-BcN_gKXh.js";
import { t as Environment } from "./Environment-CqP6Yhdo.js";
import { n as Cylinder, r as Sphere, t as Box } from "./shapes-BBrczoYY.js";
//#region node_modules/three-stdlib/shaders/HorizontalBlurShader.js
var HorizontalBlurShader = {
	uniforms: {
		tDiffuse: { value: null },
		h: { value: 1 / 512 }
	},
	vertexShader: `
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,
	fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `
};
//#endregion
//#region node_modules/three-stdlib/shaders/VerticalBlurShader.js
var VerticalBlurShader = {
	uniforms: {
		tDiffuse: { value: null },
		v: { value: 1 / 512 }
	},
	vertexShader: `
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,
	fragmentShader: `

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `
};
//#endregion
//#region node_modules/@react-three/drei/core/ContactShadows.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var ContactShadows = /* @__PURE__ */ import_react.forwardRef(({ scale = 10, frames = Infinity, opacity = 1, width = 1, height = 1, blur = 1, near = 0, far = 10, resolution = 512, smooth = true, color = "#000000", depthWrite = false, renderOrder, ...props }, fref) => {
	const ref = import_react.useRef(null);
	const scene = useThree((state) => state.scene);
	const gl = useThree((state) => state.gl);
	const shadowCamera = import_react.useRef(null);
	width = width * (Array.isArray(scale) ? scale[0] : scale || 1);
	height = height * (Array.isArray(scale) ? scale[1] : scale || 1);
	const [renderTarget, planeGeometry, depthMaterial, blurPlane, horizontalBlurMaterial, verticalBlurMaterial, renderTargetBlur] = import_react.useMemo(() => {
		const renderTarget = new WebGLRenderTarget(resolution, resolution);
		const renderTargetBlur = new WebGLRenderTarget(resolution, resolution);
		renderTargetBlur.texture.generateMipmaps = renderTarget.texture.generateMipmaps = false;
		const planeGeometry = new PlaneGeometry(width, height).rotateX(Math.PI / 2);
		const blurPlane = new Mesh(planeGeometry);
		const depthMaterial = new MeshDepthMaterial();
		depthMaterial.depthTest = depthMaterial.depthWrite = false;
		depthMaterial.onBeforeCompile = (shader) => {
			shader.uniforms = {
				...shader.uniforms,
				ucolor: { value: new Color(color) }
			};
			shader.fragmentShader = shader.fragmentShader.replace(`void main() {`, `uniform vec3 ucolor;
           void main() {
          `);
			shader.fragmentShader = shader.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );", "vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );");
		};
		const horizontalBlurMaterial = new ShaderMaterial(HorizontalBlurShader);
		const verticalBlurMaterial = new ShaderMaterial(VerticalBlurShader);
		verticalBlurMaterial.depthTest = horizontalBlurMaterial.depthTest = false;
		return [
			renderTarget,
			planeGeometry,
			depthMaterial,
			blurPlane,
			horizontalBlurMaterial,
			verticalBlurMaterial,
			renderTargetBlur
		];
	}, [
		resolution,
		width,
		height,
		scale,
		color
	]);
	const blurShadows = (blur) => {
		blurPlane.visible = true;
		blurPlane.material = horizontalBlurMaterial;
		horizontalBlurMaterial.uniforms.tDiffuse.value = renderTarget.texture;
		horizontalBlurMaterial.uniforms.h.value = blur * 1 / 256;
		gl.setRenderTarget(renderTargetBlur);
		gl.render(blurPlane, shadowCamera.current);
		blurPlane.material = verticalBlurMaterial;
		verticalBlurMaterial.uniforms.tDiffuse.value = renderTargetBlur.texture;
		verticalBlurMaterial.uniforms.v.value = blur * 1 / 256;
		gl.setRenderTarget(renderTarget);
		gl.render(blurPlane, shadowCamera.current);
		blurPlane.visible = false;
	};
	let count = 0;
	let initialBackground;
	let initialOverrideMaterial;
	useFrame(() => {
		if (shadowCamera.current && (frames === Infinity || count < frames)) {
			count++;
			initialBackground = scene.background;
			initialOverrideMaterial = scene.overrideMaterial;
			ref.current.visible = false;
			scene.background = null;
			scene.overrideMaterial = depthMaterial;
			gl.setRenderTarget(renderTarget);
			gl.render(scene, shadowCamera.current);
			blurShadows(blur);
			if (smooth) blurShadows(blur * .4);
			gl.setRenderTarget(null);
			ref.current.visible = true;
			scene.overrideMaterial = initialOverrideMaterial;
			scene.background = initialBackground;
		}
	});
	import_react.useImperativeHandle(fref, () => ref.current, []);
	return /* @__PURE__ */ import_react.createElement("group", _extends({ "rotation-x": Math.PI / 2 }, props, { ref }), /* @__PURE__ */ import_react.createElement("mesh", {
		renderOrder,
		geometry: planeGeometry,
		scale: [
			1,
			-1,
			1
		],
		rotation: [
			-Math.PI / 2,
			0,
			0
		]
	}, /* @__PURE__ */ import_react.createElement("meshBasicMaterial", {
		transparent: true,
		map: renderTarget.texture,
		opacity,
		depthWrite
	})), /* @__PURE__ */ import_react.createElement("orthographicCamera", {
		ref: shadowCamera,
		args: [
			-width / 2,
			width / 2,
			height / 2,
			-height / 2,
			near,
			far
		]
	}));
});
//#endregion
//#region src/components/games/engines/FaskaAstro/FaskaAstro.jsx
var import_jsx_runtime = require_jsx_runtime();
function useKeys() {
	const [keys, setKeys] = (0, import_react.useState)({
		forward: false,
		backward: false,
		left: false,
		right: false,
		jump: false,
		action: false
	});
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
					setKeys((k) => ({
						...k,
						forward: true
					}));
					break;
				case "KeyS":
				case "ArrowDown":
					setKeys((k) => ({
						...k,
						backward: true
					}));
					break;
				case "KeyA":
				case "ArrowLeft":
					setKeys((k) => ({
						...k,
						left: true
					}));
					break;
				case "KeyD":
				case "ArrowRight":
					setKeys((k) => ({
						...k,
						right: true
					}));
					break;
				case "Space":
					setKeys((k) => ({
						...k,
						jump: true
					}));
					break;
				case "KeyF":
				case "Enter":
					setKeys((k) => ({
						...k,
						action: true
					}));
					break;
				default: break;
			}
		};
		const handleKeyUp = (e) => {
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
					setKeys((k) => ({
						...k,
						forward: false
					}));
					break;
				case "KeyS":
				case "ArrowDown":
					setKeys((k) => ({
						...k,
						backward: false
					}));
					break;
				case "KeyA":
				case "ArrowLeft":
					setKeys((k) => ({
						...k,
						left: false
					}));
					break;
				case "KeyD":
				case "ArrowRight":
					setKeys((k) => ({
						...k,
						right: false
					}));
					break;
				case "Space":
					setKeys((k) => ({
						...k,
						jump: false
					}));
					break;
				case "KeyF":
				case "Enter":
					setKeys((k) => ({
						...k,
						action: false
					}));
					break;
				default: break;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	return keys;
}
var Player = () => {
	const playerRef = (0, import_react.useRef)();
	const keys = useKeys();
	const { camera } = useThree();
	const [hovering, setHovering] = (0, import_react.useState)(false);
	const moveSpeed = 10;
	const jumpForce = 16;
	const hoverForce = 22;
	const direction = new Vector3();
	const frontVector = new Vector3();
	const sideVector = new Vector3();
	useFrame(() => {
		if (!playerRef.current) return;
		const { forward, backward, left, right, jump, action } = keys;
		const translation = playerRef.current.translation();
		camera.position.lerp(new Vector3(translation.x, translation.y + 8, translation.z + 14), .1);
		camera.lookAt(translation.x, translation.y, translation.z);
		frontVector.set(0, 0, Number(backward) - Number(forward));
		sideVector.set(Number(left) - Number(right), 0, 0);
		direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(moveSpeed);
		const linvel = playerRef.current.linvel();
		playerRef.current.setLinvel({
			x: direction.x,
			y: linvel.y,
			z: direction.z
		}, true);
		if (jump && Math.abs(linvel.y) < .1) playerRef.current.setLinvel({
			x: linvel.x,
			y: jumpForce,
			z: linvel.z
		}, true);
		if (action && linvel.y < 0) {
			playerRef.current.applyImpulse({
				x: 0,
				y: hoverForce * .016,
				z: 0
			}, true);
			setHovering(true);
		} else setHovering(false);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RigidBody, {
		ref: playerRef,
		position: [
			0,
			5,
			0
		],
		enabledRotations: [
			false,
			false,
			false
		],
		colliders: "ball",
		mass: 1,
		friction: .5,
		restitution: .2,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sphere, {
				args: [
					.5,
					32,
					32
				],
				castShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#FFFFFF",
					metalness: .9,
					roughness: .1
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					.6,
					.2,
					.4
				],
				position: [
					0,
					.1,
					-.4
				],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#00FFFF",
					emissive: "#00FFFF",
					emissiveIntensity: .8
				})
			}),
			hovering && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cylinder, {
				args: [
					.1,
					.3,
					1,
					16
				],
				position: [
					0,
					-.8,
					0
				],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#00FFFF",
					transparent: true,
					opacity: .6
				})
			})
		]
	});
};
var PhysicsObjects = () => {
	const count = 60;
	const instances = (0, import_react.useMemo)(() => {
		const positions = [];
		const rotations = [];
		for (let i = 0; i < count; i++) {
			positions.push([
				Math.random() * 30 - 15,
				Math.random() * 10 + 2,
				Math.random() * 30 - 15
			]);
			rotations.push([
				Math.random() * Math.PI,
				Math.random() * Math.PI,
				Math.random() * Math.PI
			]);
		}
		return {
			positions,
			rotations
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstancedRigidBodies, {
		positions: instances.positions,
		rotations: instances.rotations,
		colliders: "cuboid",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("instancedMesh", {
			args: [
				null,
				null,
				count
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.6,
				.6,
				.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#FF00FF",
				metalness: .6,
				roughness: .2
			})]
		})
	});
};
var Scene = () => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, { preset: "city" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .5 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			castShadow: true,
			position: [
				10,
				20,
				10
			],
			intensity: 1.5,
			"shadow-mapSize": [2048, 2048]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					100,
					1,
					100
				],
				position: [
					0,
					-.5,
					0
				],
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#222222",
					metalness: .8,
					roughness: .2
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				0,
				2,
				-15
			],
			restitution: 1.5,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cylinder, {
				args: [
					3,
					3,
					1,
					32
				],
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#00FF00",
					emissive: "#00FF00",
					emissiveIntensity: .3
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				10,
				5,
				-25
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					6,
					1,
					6
				],
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#444444",
					metalness: .8,
					roughness: .2
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RigidBody, {
			type: "fixed",
			colliders: "cuboid",
			position: [
				-10,
				8,
				-20
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Box, {
				args: [
					4,
					1,
					4
				],
				castShadow: true,
				receiveShadow: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					color: "#00FFFF",
					metalness: .8,
					roughness: .2,
					emissive: "#00FFFF",
					emissiveIntensity: .2
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhysicsObjects, {})
	] });
};
function FaskaAstro({ onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100vw",
			height: "100vh",
			position: "relative",
			overflow: "hidden",
			backgroundColor: "#000022"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
			shadows: true,
			camera: {
				position: [
					0,
					8,
					12
				],
				fov: 50
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Physics, {
				gravity: [
					0,
					-25,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Player, {})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactShadows, {
				position: [
					0,
					0,
					0
				],
				opacity: .4,
				scale: 100,
				blur: 2,
				far: 10
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				position: "absolute",
				top: 20,
				left: 20,
				zIndex: 10,
				fontFamily: "monospace"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					style: {
						color: "#00FFFF",
						textShadow: "0 0 10px #00FFFF",
						margin: 0,
						fontSize: "2.5rem"
					},
					children: "Faska Astro"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					style: {
						color: "white",
						textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
						fontSize: "1.2rem"
					},
					children: "WASD to move, SPACE to jump, F to hover!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onExit,
					style: {
						padding: "10px 20px",
						backgroundColor: "transparent",
						color: "#00FFFF",
						border: "2px solid #00FFFF",
						borderRadius: "5px",
						cursor: "pointer",
						fontWeight: "bold",
						fontSize: "1.1rem",
						marginTop: "10px",
						boxShadow: "0 0 10px #00FFFF",
						transition: "all 0.2s"
					},
					onMouseOver: (e) => {
						e.target.style.backgroundColor = "#00FFFF";
						e.target.style.color = "#000";
					},
					onMouseOut: (e) => {
						e.target.style.backgroundColor = "transparent";
						e.target.style.color = "#00FFFF";
					},
					children: "Exit Simulation"
				})
			]
		})]
	});
}
//#endregion
export { FaskaAstro as default };
