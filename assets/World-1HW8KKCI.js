import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { F as Float32BufferAttribute, Rt as Vector3, _ as BufferGeometry, a as useFrame, nt as Mesh, st as MeshStandardMaterial } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as create } from "./react-B1iXS_n6.js";
//#region src/components/games/engines/FaskaKartSwarm/GameLogic.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useGameStore = create((set, get) => ({
	phase: "countdown",
	laps: 0,
	heldItem: null,
	pendingCountry: null,
	showCountryModal: false,
	countryOptions: [],
	countryAnswer: "",
	boostTimer: 0,
	raceTime: 0,
	wrongAnswer: false,
	itemBoxes: [],
	bananas: [],
	projectiles: [],
	particles: [],
	updateGame: (updates) => set((state) => ({
		...state,
		...updates
	})),
	setItemBoxes: (updater) => set((state) => ({ itemBoxes: typeof updater === "function" ? updater(state.itemBoxes) : updater })),
	setBananas: (updater) => set((state) => ({ bananas: typeof updater === "function" ? updater(state.bananas) : updater })),
	setProjectiles: (updater) => set((state) => ({ projectiles: typeof updater === "function" ? updater(state.projectiles) : updater })),
	setParticles: (updater) => set((state) => ({ particles: typeof updater === "function" ? updater(state.particles) : updater })),
	reset: () => set({
		phase: "countdown",
		laps: 0,
		heldItem: null,
		pendingCountry: null,
		showCountryModal: false,
		countryOptions: [],
		countryAnswer: "",
		boostTimer: 0,
		raceTime: 0,
		wrongAnswer: false,
		itemBoxes: [],
		bananas: [],
		projectiles: [],
		particles: []
	})
}));
var ITEMS = [
	"shell",
	"boost",
	"banana"
];
var COUNTRIES = [
	{
		name: "Deutschland",
		flag: "🇩🇪",
		alt: [
			"germany",
			"deutschland",
			"de"
		]
	},
	{
		name: "Frankreich",
		flag: "🇫🇷",
		alt: [
			"france",
			"frankreich",
			"fr"
		]
	},
	{
		name: "Japan",
		flag: "🇯🇵",
		alt: ["japan", "jp"]
	},
	{
		name: "Brasilien",
		flag: "🇧🇷",
		alt: [
			"brazil",
			"brasilien",
			"br"
		]
	},
	{
		name: "Australien",
		flag: "🇦🇺",
		alt: [
			"australia",
			"australien",
			"au"
		]
	},
	{
		name: "Mexiko",
		flag: "🇲🇽",
		alt: [
			"mexico",
			"mexiko",
			"mx"
		]
	},
	{
		name: "Indien",
		flag: "🇮🇳",
		alt: [
			"india",
			"indien",
			"in"
		]
	},
	{
		name: "Kanada",
		flag: "🇨🇦",
		alt: [
			"canada",
			"kanada",
			"ca"
		]
	},
	{
		name: "Italien",
		flag: "🇮🇹",
		alt: [
			"italy",
			"italien",
			"it"
		]
	},
	{
		name: "China",
		flag: "🇨🇳",
		alt: ["china", "cn"]
	},
	{
		name: "Ägypten",
		flag: "🇪🇬",
		alt: [
			"egypt",
			"ägypten",
			"aegypten",
			"eg"
		]
	},
	{
		name: "Argentinien",
		flag: "🇦🇷",
		alt: [
			"argentina",
			"argentinien",
			"ar"
		]
	}
];
//#endregion
//#region src/components/games/engines/FaskaKartSwarm/World.jsx
var import_jsx_runtime = require_jsx_runtime();
var getTrackPoint = (t) => {
	const angle = t * Math.PI * 2;
	return new Vector3(Math.cos(angle) * 80, 0, Math.sin(angle) * 80);
};
var getTrackTangent = (t) => {
	const angle = t * Math.PI * 2;
	return new Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize();
};
var getTrackT = (pos) => {
	let t = Math.atan2(pos.z, pos.x) / (Math.PI * 2);
	if (t < 0) t += 1;
	return t;
};
var buildTrackGeometry = () => {
	const positions = [];
	const normals = [];
	const uvs = [];
	const indices = [];
	for (let i = 0; i <= 80; i++) {
		const t = i / 80;
		const center = getTrackPoint(t);
		const tangent = getTrackTangent(t);
		const right = new Vector3(-tangent.z, 0, tangent.x);
		const left = center.clone().addScaledVector(right, -18 / 2);
		const rightPt = center.clone().addScaledVector(right, 18 / 2);
		positions.push(left.x, .01, left.z);
		positions.push(rightPt.x, .01, rightPt.z);
		normals.push(0, 1, 0, 0, 1, 0);
		uvs.push(0, t * 10, 1, t * 10);
		if (i < 80) {
			const base = i * 2;
			indices.push(base, base + 1, base + 2);
			indices.push(base + 1, base + 3, base + 2);
		}
	}
	const geo = new BufferGeometry();
	geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
	geo.setAttribute("normal", new Float32BufferAttribute(normals, 3));
	geo.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
	geo.setIndex(indices);
	return geo;
};
var Track = () => {
	const geo = (0, import_react.useMemo)(() => buildTrackGeometry(), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: new Mesh(geo, new MeshStandardMaterial({
			color: "#444444",
			roughness: .9,
			side: 2
		})) }),
		Array.from({ length: 80 }).map((_, i) => {
			if (i % 4 !== 0) return null;
			const p = getTrackPoint(i / 80);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					p.x,
					.02,
					p.z
				],
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.5, 3] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					color: "#ffffff",
					opacity: .6,
					transparent: true
				})]
			}, i);
		}),
		Array.from({ length: 80 }).map((_, i) => {
			const t = i / 80;
			const center = getTrackPoint(t);
			const tangent = getTrackTangent(t);
			const right = new Vector3(-tangent.z, 0, tangent.x);
			const lp = center.clone().addScaledVector(right, -18 / 2);
			const rp = center.clone().addScaledVector(right, 18 / 2);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					lp.x,
					.3,
					lp.z
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					.6,
					.5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: i % 6 < 3 ? "#ef4444" : "#ffffff" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					rp.x,
					.3,
					rp.z
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
					.5,
					.6,
					.5
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: i % 6 < 3 ? "#ef4444" : "#ffffff" })]
			})] }, i);
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				-.05,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [400, 400] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#3d7a20",
				roughness: 1
			})]
		}),
		Array.from({ length: 20 }).map((_, i) => {
			const angle = i / 20 * Math.PI * 2;
			const r = 104;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
				position: [
					Math.cos(angle) * r,
					0,
					Math.sin(angle) * r
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						2,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
						.4,
						.6,
						4,
						6
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#6b3a1f" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						6,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
						3,
						6,
						6
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#22863a" })]
				})]
			}, i);
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
			position: [
				80,
				0,
				0
			],
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						-18 / 2 - 1,
						4,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.4,
						8,
						.4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#555" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						10,
						4,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						.4,
						8,
						.4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#555" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
					position: [
						0,
						8.2,
						0
					],
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
						20,
						.5,
						.4
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#facc15" })]
				})
			]
		})
	] });
};
var ItemBox = ({ pos, active, index }) => {
	const ref = (0, import_react.useRef)();
	useFrame(({ clock }) => {
		if (ref.current) {
			ref.current.rotation.y = clock.elapsedTime * 2;
			ref.current.position.y = .8 + Math.sin(clock.elapsedTime * 3 + index) * .2;
		}
	});
	if (!active) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref,
		position: pos,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.5,
				1.5,
				1.5
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#facc15",
				emissive: "#f59e0b",
				emissiveIntensity: .4,
				metalness: .5,
				roughness: .2
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			1.6,
			1.6,
			1.6
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#ffffff",
			wireframe: true,
			opacity: .3,
			transparent: true
		})] })]
	});
};
var ITEM_BOX_POSITIONS = [
	.1,
	.25,
	.4,
	.55,
	.7,
	.85
].map((t) => {
	const p = getTrackPoint(t);
	return {
		t,
		pos: [
			p.x,
			.8,
			p.z
		]
	};
});
var Projectile = ({ proj, onHit }) => {
	const ref = (0, import_react.useRef)();
	const vel = (0, import_react.useRef)(new Vector3(proj.vx, 0, proj.vz));
	const pos = (0, import_react.useRef)(new Vector3(proj.x, .5, proj.z));
	const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);
	useFrame((_, delta) => {
		if (!ref.current) return;
		const dt = clamp(delta, .001, .05);
		pos.current.addScaledVector(vel.current, dt * 30);
		ref.current.position.copy(pos.current);
		ref.current.rotation.y += .3;
		const distFromCenter = Math.sqrt(pos.current.x ** 2 + pos.current.z ** 2);
		if (distFromCenter > 103 || distFromCenter < 57) onHit(proj.id);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		ref,
		position: [
			proj.x,
			.5,
			proj.z
		],
		castShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.4,
			8,
			8
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#16a34a",
			emissive: "#16a34a",
			emissiveIntensity: .6
		})]
	});
};
var BananaPeel = ({ banana }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: [
			banana.x,
			.2,
			banana.z
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("torusGeometry", { args: [
				.5,
				.15,
				6,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#fde047" })]
		})
	});
};
var Particles = ({ particles }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: particles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: p.pos,
		scale: p.scale,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.3,
			4,
			4
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: p.color })]
	}, p.id)) });
};
//#endregion
export { BananaPeel, ITEM_BOX_POSITIONS, ItemBox, Particles, Projectile, Track, getTrackPoint, getTrackT, ITEMS as n, useGameStore as r, COUNTRIES as t };
