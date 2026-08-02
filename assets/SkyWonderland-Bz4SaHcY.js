import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as motion } from "./proxy--6s_pC9q.js";
import { V as AnimatePresence, a as playCoin, h as playJingle, l as playError, m as playInstrumentTone, w as playPop, x as playMagicDust, z as playWhoosh } from "./sounds-Dh98eEYj.js";
import { i as useReducedMotion, n as createLucideIcon, r as confetti_module_default, t as Star } from "./star-DBCbE8d7.js";
import { t as Sparkles } from "./sparkles-bt2KNUwI.js";
import { t as Volume2 } from "./volume-2-Vs6pZO3N.js";
import { t as WandSparkles } from "./wand-sparkles-CtIcwwM8.js";
import { t as ANIMAL_FRIENDS } from "./animalFriends-U19Ro3hF.js";
var ChevronLeft = createLucideIcon("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]);
var ChevronRight = createLucideIcon("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]);
var Cloud = createLucideIcon("cloud", [["path", {
	d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
	key: "p7xjir"
}]]);
var Moon = createLucideIcon("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]);
var RotateCcw = createLucideIcon("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]);
var Telescope = createLucideIcon("telescope", [
	["path", {
		d: "m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44",
		key: "k4qptu"
	}],
	["path", {
		d: "m13.56 11.747 4.332-.924",
		key: "19l80z"
	}],
	["path", {
		d: "m16 21-3.105-6.21",
		key: "7oh9d"
	}],
	["path", {
		d: "M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z",
		key: "m7xp4m"
	}],
	["path", {
		d: "m6.158 8.633 1.114 4.456",
		key: "74o979"
	}],
	["path", {
		d: "m8 21 3.105-6.21",
		key: "1fvxut"
	}],
	["circle", {
		cx: "12",
		cy: "13",
		r: "2",
		key: "1c1ljs"
	}]
]);
//#endregion
//#region src/components/games/skyWonderlandData.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var SKY_WONDERLAND_MODES = [
	{
		id: "constellation",
		label: "Sterne",
		icon: "Star",
		target: 5
	},
	{
		id: "clouds",
		label: "Wolken",
		icon: "Cloud",
		target: 4
	},
	{
		id: "moon",
		label: "Mond",
		icon: "Moon",
		target: 3
	},
	{
		id: "comets",
		label: "Kometen",
		icon: "Sparkles",
		target: 6
	},
	{
		id: "rainbow",
		label: "Regenbogen",
		icon: "Sparkles",
		target: 6
	},
	{
		id: "treasure",
		label: "Schatz",
		icon: "Star",
		target: 4
	}
];
var SKY_SKYLINE_ASSETS = [
	"/faska-flow-pro/premium-sky/backgrounds/sky-aurora.jpg",
	"/faska-flow-pro/premium-sky/backgrounds/sky-rainbow.jpg",
	"/faska-flow-pro/premium-sky/backgrounds/sky-night.jpg",
	"/faska-flow-pro/premium-sky/backgrounds/sky-morning.jpg",
	"/faska-flow-pro/premium-sky/backgrounds/sky-rain.jpg",
	"/faska-flow-pro/premium-sky/backgrounds/sky-sunset.jpg",
	"/faska-flow-pro/sky-bitmaps/sky-world.webp",
	"/faska-flow-pro/sky-bitmaps/rainbow-arc.webp",
	"/faska-flow-pro/sky-bitmaps/treasure-instruments.webp"
];
var SKY_SPRITES = {
	sun: "/faska-flow-pro/premium-sky/sprites/sun-medallion.png",
	cloudA: "/faska-flow-pro/premium-sky/sprites/cloud-soft-1.png",
	cloudB: "/faska-flow-pro/premium-sky/sprites/cloud-soft-2.png",
	cloudPeach: "/faska-flow-pro/premium-sky/sprites/cloud-peach.png",
	rainbow: "/faska-flow-pro/premium-sky/sprites/rainbow-arc.png",
	moon: "/faska-flow-pro/premium-sky/sprites/moon-crescent.png",
	star: "/faska-flow-pro/premium-sky/sprites/star-gold.png",
	rain: "/faska-flow-pro/premium-sky/sprites/rain-drop.png",
	gem: "/faska-flow-pro/premium-sky/sprites/aqua-gem.png",
	kite: "/faska-flow-pro/premium-sky/sprites/letter-kite.png",
	balloon: "/faska-flow-pro/premium-sky/sprites/number-balloon.png",
	heart: "/faska-flow-pro/premium-sky/sprites/heart-balloon.png",
	music: "/faska-flow-pro/premium-sky/sprites/music-notes.png",
	book: "/faska-flow-pro/premium-sky/sprites/story-book.png",
	leaf: "/faska-flow-pro/premium-sky/sprites/leaf-glider.png",
	drum: "/faska-flow-pro/premium-sky/sprites/drum-cloud.png",
	compass: "/faska-flow-pro/premium-sky/sprites/compass-orb.png",
	skyWorld: "/faska-flow-pro/sky-bitmaps/sky-world.webp",
	sunSmile: "/faska-flow-pro/sky-bitmaps/sun-smile.webp",
	cloudFamily: "/faska-flow-pro/sky-bitmaps/cloud-family.webp",
	treasure: "/faska-flow-pro/sky-bitmaps/treasure-instruments.webp"
};
var RAINBOW_SETS = [
	[
		"Rosa",
		"Orange",
		"Gelb",
		"Grün",
		"Blau",
		"Violett"
	],
	[
		"Rot",
		"Gold",
		"Sonne",
		"Blatt",
		"Wasser",
		"Traum"
	],
	[
		"Leise",
		"Hell",
		"Warm",
		"Frisch",
		"Klar",
		"Mutig"
	],
	[
		"1",
		"2",
		"3",
		"4",
		"5",
		"6"
	],
	[
		"Do",
		"Re",
		"Mi",
		"Fa",
		"Sol",
		"La"
	],
	[
		"Atmen",
		"Schauen",
		"Wählen",
		"Legen",
		"Hören",
		"Freuen"
	]
];
var TREASURE_SETS = [
	[
		{
			id: "kite",
			label: "Buchstaben",
			sprite: SKY_SPRITES.kite,
			answer: true
		},
		{
			id: "book",
			label: "Geschichte",
			sprite: SKY_SPRITES.book,
			answer: true
		},
		{
			id: "drum",
			label: "Trommel",
			sprite: SKY_SPRITES.drum,
			answer: false
		},
		{
			id: "leaf",
			label: "Blatt",
			sprite: SKY_SPRITES.leaf,
			answer: false
		}
	],
	[
		{
			id: "balloon",
			label: "Zahl",
			sprite: SKY_SPRITES.balloon,
			answer: true
		},
		{
			id: "gem",
			label: "Perle",
			sprite: SKY_SPRITES.gem,
			answer: true
		},
		{
			id: "moon",
			label: "Mond",
			sprite: SKY_SPRITES.moon,
			answer: false
		},
		{
			id: "music",
			label: "Klang",
			sprite: SKY_SPRITES.music,
			answer: false
		}
	],
	[
		{
			id: "rain",
			label: "Regen",
			sprite: SKY_SPRITES.rain,
			answer: true
		},
		{
			id: "sun",
			label: "Sonne",
			sprite: SKY_SPRITES.sun,
			answer: true
		},
		{
			id: "leaf",
			label: "Natur",
			sprite: SKY_SPRITES.leaf,
			answer: true
		},
		{
			id: "book",
			label: "Buch",
			sprite: SKY_SPRITES.book,
			answer: false
		}
	],
	[
		{
			id: "heart",
			label: "Herz",
			sprite: SKY_SPRITES.heart,
			answer: true
		},
		{
			id: "compass",
			label: "Mut",
			sprite: SKY_SPRITES.compass,
			answer: true
		},
		{
			id: "rain",
			label: "Regen",
			sprite: SKY_SPRITES.rain,
			answer: false
		},
		{
			id: "balloon",
			label: "Zahl",
			sprite: SKY_SPRITES.balloon,
			answer: false
		}
	],
	[
		{
			id: "music",
			label: "Melodie",
			sprite: SKY_SPRITES.music,
			answer: true
		},
		{
			id: "drum",
			label: "Trommel",
			sprite: SKY_SPRITES.drum,
			answer: true
		},
		{
			id: "kite",
			label: "Buchstabe",
			sprite: SKY_SPRITES.kite,
			answer: false
		},
		{
			id: "gem",
			label: "Perle",
			sprite: SKY_SPRITES.gem,
			answer: false
		}
	],
	[
		{
			id: "star",
			label: "Stern",
			sprite: SKY_SPRITES.star,
			answer: true
		},
		{
			id: "rainbow",
			label: "Bogen",
			sprite: SKY_SPRITES.rainbow,
			answer: true
		},
		{
			id: "cloud",
			label: "Wolke",
			sprite: SKY_SPRITES.cloudA,
			answer: true
		},
		{
			id: "drum",
			label: "Trommel",
			sprite: SKY_SPRITES.drum,
			answer: false
		}
	]
];
var SKY_WONDERLAND_ROUNDS = [
	{
		id: "polar",
		name: "Polarlicht",
		sky: "from-[#14233f] via-[#305d75] to-[#9ad7c4]",
		glow: "#79f2d0",
		accent: "#f8df72",
		constellation: {
			title: "Segelboot",
			order: [
				"s1",
				"s2",
				"s3",
				"s4",
				"s5"
			],
			stars: [
				{
					id: "s1",
					x: 19,
					y: 67,
					size: 18
				},
				{
					id: "s2",
					x: 36,
					y: 42,
					size: 15
				},
				{
					id: "s3",
					x: 52,
					y: 67,
					size: 18
				},
				{
					id: "s4",
					x: 36,
					y: 70,
					size: 12
				},
				{
					id: "s5",
					x: 36,
					y: 22,
					size: 20
				},
				{
					id: "d1",
					x: 67,
					y: 29,
					size: 12
				},
				{
					id: "d2",
					x: 77,
					y: 59,
					size: 14
				},
				{
					id: "d3",
					x: 13,
					y: 30,
					size: 11
				}
			]
		},
		clouds: [
			{
				id: "c1",
				icon: "🌧️",
				bucket: "Regen",
				x: 11,
				y: 19
			},
			{
				id: "c2",
				icon: "🌤️",
				bucket: "Sonne",
				x: 43,
				y: 11
			},
			{
				id: "c3",
				icon: "❄️",
				bucket: "Schnee",
				x: 69,
				y: 27
			},
			{
				id: "c4",
				icon: "🌧️",
				bucket: "Regen",
				x: 29,
				y: 57
			}
		],
		moon: {
			answer: "Halbmond",
			choices: [
				{
					label: "Vollmond",
					phase: "full"
				},
				{
					label: "Halbmond",
					phase: "half"
				},
				{
					label: "Sichel",
					phase: "crescent"
				}
			]
		},
		comets: [
			{
				id: "p1",
				x: 17,
				y: 72
			},
			{
				id: "p2",
				x: 29,
				y: 49
			},
			{
				id: "p3",
				x: 44,
				y: 33
			},
			{
				id: "p4",
				x: 58,
				y: 45
			},
			{
				id: "p5",
				x: 72,
				y: 30
			},
			{
				id: "p6",
				x: 84,
				y: 58
			}
		]
	},
	{
		id: "dawn",
		name: "Morgenrot",
		sky: "from-[#71395d] via-[#e68a73] to-[#f8d98d]",
		glow: "#ffd080",
		accent: "#78d7ff",
		constellation: {
			title: "Drachen",
			order: [
				"s2",
				"s4",
				"s5",
				"s6",
				"s7"
			],
			stars: [
				{
					id: "s1",
					x: 15,
					y: 40,
					size: 12
				},
				{
					id: "s2",
					x: 27,
					y: 28,
					size: 20
				},
				{
					id: "s3",
					x: 34,
					y: 68,
					size: 12
				},
				{
					id: "s4",
					x: 44,
					y: 44,
					size: 17
				},
				{
					id: "s5",
					x: 58,
					y: 27,
					size: 18
				},
				{
					id: "s6",
					x: 70,
					y: 48,
					size: 16
				},
				{
					id: "s7",
					x: 58,
					y: 69,
					size: 18
				},
				{
					id: "d1",
					x: 82,
					y: 22,
					size: 10
				}
			]
		},
		clouds: [
			{
				id: "c1",
				icon: "🌤️",
				bucket: "Sonne",
				x: 13,
				y: 23
			},
			{
				id: "c2",
				icon: "❄️",
				bucket: "Schnee",
				x: 39,
				y: 15
			},
			{
				id: "c3",
				icon: "🌈",
				bucket: "Bunt",
				x: 67,
				y: 31
			},
			{
				id: "c4",
				icon: "🌤️",
				bucket: "Sonne",
				x: 31,
				y: 59
			}
		],
		moon: {
			answer: "Sichel",
			choices: [
				{
					label: "Sichel",
					phase: "crescent"
				},
				{
					label: "Neumond",
					phase: "new"
				},
				{
					label: "Vollmond",
					phase: "full"
				}
			]
		},
		comets: [
			{
				id: "p1",
				x: 13,
				y: 31
			},
			{
				id: "p2",
				x: 28,
				y: 45
			},
			{
				id: "p3",
				x: 42,
				y: 64
			},
			{
				id: "p4",
				x: 58,
				y: 52
			},
			{
				id: "p5",
				x: 69,
				y: 34
			},
			{
				id: "p6",
				x: 85,
				y: 25
			}
		]
	},
	{
		id: "midnight",
		name: "Mitternacht",
		sky: "from-[#11182e] via-[#333b72] to-[#8667ad]",
		glow: "#c9b6ff",
		accent: "#86f7ff",
		constellation: {
			title: "Krone",
			order: [
				"s1",
				"s3",
				"s5",
				"s7",
				"s8"
			],
			stars: [
				{
					id: "s1",
					x: 18,
					y: 62,
					size: 18
				},
				{
					id: "s2",
					x: 25,
					y: 30,
					size: 10
				},
				{
					id: "s3",
					x: 34,
					y: 38,
					size: 16
				},
				{
					id: "s4",
					x: 43,
					y: 72,
					size: 11
				},
				{
					id: "s5",
					x: 51,
					y: 25,
					size: 21
				},
				{
					id: "s6",
					x: 65,
					y: 39,
					size: 12
				},
				{
					id: "s7",
					x: 69,
					y: 38,
					size: 16
				},
				{
					id: "s8",
					x: 83,
					y: 62,
					size: 18
				}
			]
		},
		clouds: [
			{
				id: "c1",
				icon: "🌈",
				bucket: "Bunt",
				x: 14,
				y: 18
			},
			{
				id: "c2",
				icon: "🌧️",
				bucket: "Regen",
				x: 42,
				y: 19
			},
			{
				id: "c3",
				icon: "❄️",
				bucket: "Schnee",
				x: 72,
				y: 32
			},
			{
				id: "c4",
				icon: "🌈",
				bucket: "Bunt",
				x: 32,
				y: 58
			}
		],
		moon: {
			answer: "Vollmond",
			choices: [
				{
					label: "Halbmond",
					phase: "half"
				},
				{
					label: "Vollmond",
					phase: "full"
				},
				{
					label: "Neumond",
					phase: "new"
				}
			]
		},
		comets: [
			{
				id: "p1",
				x: 14,
				y: 58
			},
			{
				id: "p2",
				x: 26,
				y: 38
			},
			{
				id: "p3",
				x: 39,
				y: 27
			},
			{
				id: "p4",
				x: 54,
				y: 39
			},
			{
				id: "p5",
				x: 69,
				y: 54
			},
			{
				id: "p6",
				x: 84,
				y: 41
			}
		]
	},
	{
		id: "raingarden",
		name: "Regenlicht",
		sky: "from-[#51708b] via-[#9fc4dc] to-[#ecf8ff]",
		glow: "#d4f3ff",
		accent: "#38bdf8",
		constellation: {
			title: "Regenschirm",
			order: [
				"s1",
				"s2",
				"s3",
				"s4",
				"s5",
				"s6"
			],
			stars: [
				{
					id: "s1",
					x: 24,
					y: 58,
					size: 16
				},
				{
					id: "s2",
					x: 34,
					y: 37,
					size: 14
				},
				{
					id: "s3",
					x: 48,
					y: 29,
					size: 18
				},
				{
					id: "s4",
					x: 62,
					y: 37,
					size: 14
				},
				{
					id: "s5",
					x: 73,
					y: 58,
					size: 16
				},
				{
					id: "s6",
					x: 49,
					y: 72,
					size: 18
				},
				{
					id: "d1",
					x: 18,
					y: 28,
					size: 10
				},
				{
					id: "d2",
					x: 83,
					y: 32,
					size: 12
				}
			]
		},
		clouds: [
			{
				id: "c1",
				icon: "🌧️",
				bucket: "Regen",
				x: 12,
				y: 24
			},
			{
				id: "c2",
				icon: "🌈",
				bucket: "Bunt",
				x: 40,
				y: 14
			},
			{
				id: "c3",
				icon: "🌧️",
				bucket: "Regen",
				x: 68,
				y: 34
			},
			{
				id: "c4",
				icon: "🌤️",
				bucket: "Sonne",
				x: 29,
				y: 60
			}
		],
		moon: {
			answer: "Neumond",
			choices: [
				{
					label: "Neumond",
					phase: "new"
				},
				{
					label: "Halbmond",
					phase: "half"
				},
				{
					label: "Vollmond",
					phase: "full"
				}
			]
		},
		comets: [
			{
				id: "p1",
				x: 16,
				y: 26
			},
			{
				id: "p2",
				x: 27,
				y: 42
			},
			{
				id: "p3",
				x: 40,
				y: 60
			},
			{
				id: "p4",
				x: 57,
				y: 66
			},
			{
				id: "p5",
				x: 70,
				y: 51
			},
			{
				id: "p6",
				x: 84,
				y: 35
			}
		]
	},
	{
		id: "sunmeadow",
		name: "Sonnenwiese",
		sky: "from-[#81d4ff] via-[#ffe4a3] to-[#b8f4c7]",
		glow: "#ffe58a",
		accent: "#f59e0b",
		constellation: {
			title: "Blume",
			order: [
				"s1",
				"s2",
				"s3",
				"s4",
				"s5"
			],
			stars: [
				{
					id: "s1",
					x: 51,
					y: 28,
					size: 18
				},
				{
					id: "s2",
					x: 66,
					y: 43,
					size: 16
				},
				{
					id: "s3",
					x: 51,
					y: 58,
					size: 18
				},
				{
					id: "s4",
					x: 36,
					y: 43,
					size: 16
				},
				{
					id: "s5",
					x: 51,
					y: 43,
					size: 21
				},
				{
					id: "d1",
					x: 19,
					y: 31,
					size: 11
				},
				{
					id: "d2",
					x: 79,
					y: 65,
					size: 10
				}
			]
		},
		clouds: [
			{
				id: "c1",
				icon: "🌤️",
				bucket: "Sonne",
				x: 17,
				y: 20
			},
			{
				id: "c2",
				icon: "🌤️",
				bucket: "Sonne",
				x: 46,
				y: 12
			},
			{
				id: "c3",
				icon: "🌈",
				bucket: "Bunt",
				x: 70,
				y: 34
			},
			{
				id: "c4",
				icon: "❄️",
				bucket: "Schnee",
				x: 31,
				y: 62
			}
		],
		moon: {
			answer: "Vollmond",
			choices: [
				{
					label: "Sichel",
					phase: "crescent"
				},
				{
					label: "Vollmond",
					phase: "full"
				},
				{
					label: "Neumond",
					phase: "new"
				}
			]
		},
		comets: [
			{
				id: "p1",
				x: 15,
				y: 66
			},
			{
				id: "p2",
				x: 30,
				y: 52
			},
			{
				id: "p3",
				x: 42,
				y: 34
			},
			{
				id: "p4",
				x: 57,
				y: 28
			},
			{
				id: "p5",
				x: 72,
				y: 40
			},
			{
				id: "p6",
				x: 86,
				y: 62
			}
		]
	},
	{
		id: "cloudharbor",
		name: "Wolkenhafen",
		sky: "from-[#7dd3fc] via-[#c4e7ff] to-[#fff7cd]",
		glow: "#ffffff",
		accent: "#06b6d4",
		constellation: {
			title: "Leuchtturm",
			order: [
				"s1",
				"s2",
				"s3",
				"s4",
				"s5",
				"s6"
			],
			stars: [
				{
					id: "s1",
					x: 46,
					y: 72,
					size: 16
				},
				{
					id: "s2",
					x: 46,
					y: 56,
					size: 14
				},
				{
					id: "s3",
					x: 46,
					y: 40,
					size: 14
				},
				{
					id: "s4",
					x: 46,
					y: 24,
					size: 18
				},
				{
					id: "s5",
					x: 34,
					y: 34,
					size: 13
				},
				{
					id: "s6",
					x: 58,
					y: 34,
					size: 13
				},
				{
					id: "d1",
					x: 22,
					y: 58,
					size: 10
				},
				{
					id: "d2",
					x: 78,
					y: 26,
					size: 12
				}
			]
		},
		clouds: [
			{
				id: "c1",
				icon: "🌈",
				bucket: "Bunt",
				x: 15,
				y: 21
			},
			{
				id: "c2",
				icon: "❄️",
				bucket: "Schnee",
				x: 41,
				y: 17
			},
			{
				id: "c3",
				icon: "🌤️",
				bucket: "Sonne",
				x: 70,
				y: 29
			},
			{
				id: "c4",
				icon: "🌧️",
				bucket: "Regen",
				x: 29,
				y: 59
			}
		],
		moon: {
			answer: "Halbmond",
			choices: [
				{
					label: "Vollmond",
					phase: "full"
				},
				{
					label: "Sichel",
					phase: "crescent"
				},
				{
					label: "Halbmond",
					phase: "half"
				}
			]
		},
		comets: [
			{
				id: "p1",
				x: 12,
				y: 42
			},
			{
				id: "p2",
				x: 28,
				y: 30
			},
			{
				id: "p3",
				x: 42,
				y: 42
			},
			{
				id: "p4",
				x: 57,
				y: 59
			},
			{
				id: "p5",
				x: 72,
				y: 47
			},
			{
				id: "p6",
				x: 86,
				y: 29
			}
		]
	}
].map((round, index) => ({
	...round,
	background: SKY_SKYLINE_ASSETS[index % SKY_SKYLINE_ASSETS.length],
	foreground: index % 3 === 0 ? SKY_SPRITES.cloudFamily : index % 3 === 1 ? SKY_SPRITES.rainbow : SKY_SPRITES.treasure,
	rainbow: RAINBOW_SETS[index % RAINBOW_SETS.length],
	treasures: TREASURE_SETS[index % TREASURE_SETS.length]
}));
var SKY_BUCKETS = [
	{
		id: "Regen",
		icon: "💧",
		color: "bg-sky-100 text-sky-800 border-sky-200"
	},
	{
		id: "Sonne",
		icon: "☀️",
		color: "bg-amber-100 text-amber-800 border-amber-200"
	},
	{
		id: "Schnee",
		icon: "❄️",
		color: "bg-cyan-100 text-cyan-800 border-cyan-200"
	},
	{
		id: "Bunt",
		icon: "🌈",
		color: "bg-rose-100 text-rose-800 border-rose-200"
	}
];
//#endregion
//#region src/components/games/SkyWonderland.jsx
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	Cloud,
	Moon,
	Sparkles,
	Star
};
var NOTES = [
	523.25,
	587.33,
	659.25,
	783.99,
	880,
	987.77
];
var MotionButton = motion.button;
var skyBits = Array.from({ length: 34 }, (_, index) => ({
	id: `bit-${index}`,
	x: index * 29 % 96,
	y: index * 47 % 88,
	delay: index % 7 * .16,
	size: 2 + index % 4
}));
var driftSprites = [
	{
		src: SKY_SPRITES.cloudA,
		x: -4,
		y: 8,
		w: 240,
		duration: 18
	},
	{
		src: SKY_SPRITES.cloudB,
		x: 68,
		y: 13,
		w: 190,
		duration: 21
	},
	{
		src: SKY_SPRITES.cloudPeach,
		x: 28,
		y: 23,
		w: 210,
		duration: 24
	},
	{
		src: SKY_SPRITES.sun,
		x: 78,
		y: 3,
		w: 138,
		duration: 16
	},
	{
		src: SKY_SPRITES.rainbow,
		x: 55,
		y: 47,
		w: 220,
		duration: 20
	},
	{
		src: SKY_SPRITES.star,
		x: 8,
		y: 42,
		w: 96,
		duration: 15
	}
];
function MoonFace({ phase, large = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `${large ? "h-40 w-40" : "h-20 w-20"} relative rounded-full bg-slate-700 shadow-inner shadow-slate-950/50`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 rounded-full bg-[#fff5c7] shadow-[0_0_42px_rgba(255,245,199,0.75)]",
				style: { clipPath: phase === "half" ? "inset(0 0 0 48%)" : phase === "crescent" ? "circle(42% at 70% 50%)" : phase === "new" ? "circle(0% at 50% 50%)" : "circle(80% at 50% 50%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[28%] top-[32%] h-2 w-2 rounded-full bg-amber-200/60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[52%] top-[55%] h-3 w-3 rounded-full bg-amber-200/50" })
		]
	});
}
function SkyStage({ round, friend, friendX, friendDirection, friendHop, children }) {
	const shouldReduceMotion = useReducedMotion();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative min-h-[620px] overflow-hidden rounded-[34px] border border-white/30 bg-gradient-to-br ${round.sky} shadow-2xl`,
		style: {
			backgroundImage: round.background ? `linear-gradient(180deg, rgba(255,255,255,.02), rgba(20,31,68,.14)), url(${round.background})` : void 0,
			backgroundSize: "cover",
			backgroundPosition: "center"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.26),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0),rgba(15,23,42,.18))]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "absolute -left-24 top-10 h-56 w-[calc(100%+12rem)] rounded-full blur-3xl",
				style: {
					backgroundColor: round.glow,
					opacity: .38
				},
				animate: shouldReduceMotion ? void 0 : {
					x: [
						-16,
						18,
						-16
					],
					scaleY: [
						1,
						1.18,
						1
					]
				},
				transition: {
					duration: 9,
					repeat: shouldReduceMotion ? 0 : Infinity,
					ease: "easeInOut"
				}
			}),
			driftSprites.map((sprite, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
				src: sprite.src,
				alt: "",
				draggable: "false",
				loading: "lazy",
				decoding: "async",
				className: "pointer-events-none absolute select-none drop-shadow-2xl",
				style: {
					left: `${sprite.x}%`,
					top: `${sprite.y}%`,
					width: sprite.w
				},
				animate: shouldReduceMotion ? void 0 : {
					x: [
						0,
						index % 2 ? -18 : 20,
						0
					],
					y: [
						0,
						index % 2 ? 8 : -10,
						0
					],
					rotate: [
						0,
						index % 2 ? -2 : 2,
						0
					]
				},
				transition: {
					duration: sprite.duration,
					repeat: shouldReduceMotion ? 0 : Infinity,
					ease: "easeInOut"
				}
			}, `${round.id}-${sprite.src}-${index}`)),
			skyBits.map((bit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.span, {
				className: "absolute rounded-full bg-white",
				style: {
					left: `${bit.x}%`,
					top: `${bit.y}%`,
					width: bit.size,
					height: bit.size
				},
				animate: shouldReduceMotion ? void 0 : {
					opacity: [
						.25,
						.9,
						.25
					],
					scale: [
						1,
						1.8,
						1
					]
				},
				transition: {
					duration: 2.6,
					repeat: shouldReduceMotion ? 0 : Infinity,
					delay: bit.delay
				}
			}, bit.id)),
			round.foreground ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: round.foreground,
				alt: "",
				draggable: "false",
				loading: "lazy",
				decoding: "async",
				className: "pointer-events-none absolute bottom-0 right-0 max-h-[230px] w-auto max-w-[54%] select-none object-contain opacity-90 drop-shadow-2xl"
			}) : null,
			friend ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "pointer-events-none absolute bottom-5 z-20 -translate-x-1/2",
				initial: {
					opacity: 0,
					left: `${friendX}%`
				},
				animate: {
					opacity: 1,
					left: `${friendX}%`
				},
				transition: {
					type: "spring",
					stiffness: 130,
					damping: 18
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					className: "relative",
					animate: shouldReduceMotion ? {
						y: 0,
						rotate: 0,
						scale: 1
					} : {
						y: friendHop ? [
							0,
							-30,
							0,
							-10,
							0
						] : [
							0,
							-8,
							0
						],
						rotate: friendHop ? [
							0,
							friendDirection * 5,
							0
						] : [
							friendDirection * 1.5,
							friendDirection * -1,
							friendDirection * 1.5
						],
						scale: friendHop ? [
							1,
							1.06,
							1
						] : 1
					},
					transition: {
						duration: friendHop ? .62 : 4.5,
						repeat: friendHop || shouldReduceMotion ? 0 : Infinity,
						ease: "easeInOut"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-1 left-1/2 h-8 w-28 -translate-x-1/2 rounded-full bg-slate-950/22 blur-md md:w-36" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: friend.image,
						alt: friend.name,
						draggable: "false",
						decoding: "async",
						className: "relative h-44 w-44 object-contain md:h-56 md:w-56",
						style: {
							filter: "drop-shadow(0 18px 20px rgba(15, 23, 42, 0.22)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.45))",
							transform: `scaleX(${friendDirection})`
						}
					})]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/25 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 h-full min-h-[620px]",
				children
			})
		]
	});
}
function ModeIcon({ name, className = "h-6 w-6" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ICONS[name] || Sparkles, {
		className,
		strokeWidth: 2.4
	});
}
function SkyWonderland({ title = "Himmelswunderland", rounds = SKY_WONDERLAND_ROUNDS, onCorrect = () => {}, onWrong = () => {} }) {
	const [mode, setMode] = (0, import_react.useState)("constellation");
	const [roundIndex, setRoundIndex] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(0);
	const [pickedStars, setPickedStars] = (0, import_react.useState)([]);
	const [sortedClouds, setSortedClouds] = (0, import_react.useState)({});
	const [activeCloudId, setActiveCloudId] = (0, import_react.useState)(null);
	const [moonPick, setMoonPick] = (0, import_react.useState)(null);
	const [cometStep, setCometStep] = (0, import_react.useState)(0);
	const [rainbowStep, setRainbowStep] = (0, import_react.useState)(0);
	const [foundTreasures, setFoundTreasures] = (0, import_react.useState)([]);
	const [friendId, setFriendId] = (0, import_react.useState)(ANIMAL_FRIENDS[0].id);
	const [friendX, setFriendX] = (0, import_react.useState)(24);
	const [friendDirection, setFriendDirection] = (0, import_react.useState)(1);
	const [friendHop, setFriendHop] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const round = rounds[roundIndex % rounds.length] || SKY_WONDERLAND_ROUNDS[0];
	const activeFriend = ANIMAL_FRIENDS.find((friend) => friend.id === friendId) || ANIMAL_FRIENDS[0];
	const sortedCount = Object.keys(sortedClouds).length;
	const currentCloud = round.clouds.find((cloud) => cloud.id === activeCloudId) || round.clouds.find((cloud) => !sortedClouds[cloud.id]);
	const cometPath = (0, import_react.useMemo)(() => round.comets.slice(0, cometStep + 1), [cometStep, round.comets]);
	const award = (points = 1) => {
		setScore((value) => value + points);
		onCorrect(points);
	};
	const resetBoard = (nextRound = roundIndex) => {
		playWhoosh();
		setRoundIndex(nextRound);
		setPickedStars([]);
		setSortedClouds({});
		setActiveCloudId(null);
		setMoonPick(null);
		setCometStep(0);
		setRainbowStep(0);
		setFoundTreasures([]);
		setFeedback(null);
	};
	const switchMode = (nextMode) => {
		playPop();
		setMode(nextMode);
		resetBoard(roundIndex);
	};
	const nextSky = () => {
		resetBoard((roundIndex + 1) % rounds.length);
	};
	const celebrate = (message) => {
		setFeedback(message);
		playJingle("levelUp");
		confetti_module_default({
			particleCount: 120,
			spread: 96,
			origin: { y: .68 }
		});
	};
	const chooseStar = (star) => {
		if (pickedStars.includes(star.id)) return;
		const expected = round.constellation.order[pickedStars.length];
		if (star.id !== expected) {
			playError();
			setFeedback("Noch ein Funkeln suchen");
			onWrong();
			setTimeout(() => setFeedback(null), 900);
			return;
		}
		const nextPicked = [...pickedStars, star.id];
		setPickedStars(nextPicked);
		playInstrumentTone("glockenspiel", NOTES[nextPicked.length - 1] || 1046.5, {
			velocity: .72,
			send: .32
		});
		award(1);
		if (nextPicked.length === round.constellation.order.length) setTimeout(() => celebrate(round.constellation.title), 280);
	};
	const sortCloud = (bucketId) => {
		if (!currentCloud) return;
		if (currentCloud.bucket !== bucketId) {
			playError();
			setFeedback("Andere Schale");
			onWrong();
			setTimeout(() => setFeedback(null), 850);
			return;
		}
		const nextSorted = {
			...sortedClouds,
			[currentCloud.id]: bucketId
		};
		setSortedClouds(nextSorted);
		setActiveCloudId(null);
		playCoin();
		award(2);
		if (Object.keys(nextSorted).length === round.clouds.length) setTimeout(() => celebrate("Wolken klar"), 240);
	};
	const chooseMoon = (choice) => {
		setMoonPick(choice.label);
		if (choice.label !== round.moon.answer) {
			playError();
			setFeedback("Mond dreht sich");
			onWrong();
			setTimeout(() => {
				setMoonPick(null);
				setFeedback(null);
			}, 900);
			return;
		}
		playMagicDust();
		award(3);
		setTimeout(() => celebrate(choice.label), 260);
	};
	const touchComet = (point, index) => {
		if (index !== cometStep) {
			playError();
			setFeedback("Der nächste Schweifpunkt");
			onWrong();
			setTimeout(() => setFeedback(null), 850);
			return;
		}
		playInstrumentTone("traum", NOTES[index] || 1046.5, {
			velocity: .62,
			send: .48
		});
		const nextStep = cometStep + 1;
		setCometStep(nextStep);
		award(1);
		if (nextStep >= round.comets.length) setTimeout(() => celebrate("Kometenflug"), 260);
	};
	const chooseRainbow = (label, index) => {
		if (index !== rainbowStep) {
			playError();
			setFeedback("Farbe später");
			onWrong();
			setTimeout(() => setFeedback(null), 800);
			return;
		}
		playInstrumentTone("glockenspiel", NOTES[index] || 1046.5, {
			velocity: .7,
			send: .34
		});
		setRainbowStep(index + 1);
		award(1);
		if (index + 1 >= round.rainbow.length) setTimeout(() => celebrate(label), 220);
	};
	const pickTreasure = (item) => {
		if (foundTreasures.includes(item.id)) return;
		if (!item.answer) {
			playError();
			setFeedback("Bleibt liegen");
			onWrong();
			setTimeout(() => setFeedback(null), 850);
			return;
		}
		playMagicDust();
		const next = [...foundTreasures, item.id];
		setFoundTreasures(next);
		award(2);
		if (next.length >= round.treasures.filter((treasure) => treasure.answer).length) setTimeout(() => celebrate("Schatz hell"), 260);
	};
	const chooseFriend = (friend) => {
		setFriendId(friend.id);
		playPop();
	};
	const moveFriend = (direction) => {
		setFriendDirection(direction);
		setFriendX((value) => Math.max(24, Math.min(76, value + direction * 8)));
		playWhoosh();
	};
	const hopFriend = () => {
		setFriendHop(true);
		setTimeout(() => setFriendHop(false), 700);
		playPop();
	};
	const renderConstellation = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "absolute inset-0 h-full w-full",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "sky-line",
					x1: "0%",
					x2: "100%",
					y1: "0%",
					y2: "100%",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "#fff4a3"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: round.accent
					})]
				}) }), pickedStars.slice(1).map((id, index) => {
					const from = round.constellation.stars.find((star) => star.id === pickedStars[index]);
					const to = round.constellation.stars.find((star) => star.id === id);
					if (!from || !to) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: `${from.x}%`,
						y1: `${from.y}%`,
						x2: `${to.x}%`,
						y2: `${to.y}%`,
						stroke: "url(#sky-line)",
						strokeWidth: "4",
						strokeLinecap: "round",
						opacity: "0.88"
					}, `${from.id}-${to.id}`);
				})]
			}),
			round.constellation.stars.map((star) => {
				const active = pickedStars.includes(star.id);
				const next = star.id === round.constellation.order[pickedStars.length];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
					whileHover: { scale: 1.18 },
					whileTap: { scale: .88 },
					onClick: () => chooseStar(star),
					className: `absolute grid place-items-center rounded-full ${active ? "bg-amber-200 text-amber-700" : next ? "bg-white text-amber-500" : "bg-white/60 text-white"} shadow-[0_0_24px_rgba(255,255,255,0.72)]`,
					style: {
						left: `${star.x}%`,
						top: `${star.y}%`,
						width: star.size * 2.2,
						height: star.size * 2.2
					},
					"aria-label": "Stern",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 fill-current" })
				}, star.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-5 top-5 rounded-3xl bg-white/18 px-5 py-4 text-white backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-hand text-4xl font-bold leading-none",
					children: round.constellation.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-sans text-xs font-bold uppercase tracking-[0.26em] text-white/70",
					children: [
						pickedStars.length,
						"/",
						round.constellation.order.length
					]
				})]
			})
		]
	});
	const renderClouds = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 p-5",
		children: [
			round.clouds.map((cloud) => {
				if (sortedClouds[cloud.id]) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
					drag: true,
					dragMomentum: false,
					whileDrag: { scale: 1.08 },
					whileHover: { y: -5 },
					onClick: () => {
						setActiveCloudId(cloud.id);
						playPop();
					},
					className: `absolute grid h-32 w-44 place-items-center rounded-[42px] border border-white/60 bg-white/78 shadow-xl backdrop-blur-md transition ${currentCloud?.id === cloud.id ? "ring-4 ring-amber-200" : ""}`,
					style: {
						left: `${cloud.x}%`,
						top: `${cloud.y}%`
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: cloud.bucket === "Regen" ? SKY_SPRITES.rain : cloud.bucket === "Sonne" ? SKY_SPRITES.sun : cloud.bucket === "Schnee" ? SKY_SPRITES.cloudB : SKY_SPRITES.rainbow,
						alt: "",
						className: "h-20 w-20 object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "-mt-4 text-4xl",
						children: cloud.icon
					})]
				}, cloud.id);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-3 md:grid-cols-4",
				children: SKY_BUCKETS.map((bucket) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
					whileHover: { y: -4 },
					whileTap: { scale: .96 },
					onClick: () => sortCloud(bucket.id),
					className: `min-h-24 rounded-[26px] border-2 px-4 py-3 text-left shadow-lg ${bucket.color}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-4xl",
						children: bucket.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-3xl font-bold",
						children: bucket.id
					})]
				}, bucket.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-5 top-5 rounded-3xl bg-white/18 px-5 py-4 text-white backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-hand text-4xl font-bold leading-none",
					children: [
						sortedCount,
						"/",
						round.clouds.length
					]
				})
			})
		]
	});
	const renderMoon = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 grid place-items-center p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			animate: { y: [
				-8,
				8,
				-8
			] },
			transition: {
				duration: 5,
				repeat: Infinity,
				ease: "easeInOut"
			},
			className: "grid place-items-center rounded-full bg-white/14 p-8 backdrop-blur-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: SKY_SPRITES.moon,
				alt: "",
				className: "absolute h-48 w-48 object-contain opacity-55 blur-[1px]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoonFace, {
				large: true,
				phase: round.moon.choices.find((choice) => choice.label === round.moon.answer)?.phase
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute bottom-8 left-5 right-5 grid grid-cols-3 gap-3",
			children: round.moon.choices.map((choice) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
					whileHover: {
						y: -4,
						scale: 1.03
					},
					whileTap: { scale: .96 },
					onClick: () => chooseMoon(choice),
					className: `grid min-h-32 place-items-center rounded-[28px] border border-white/70 bg-white/78 p-3 shadow-xl backdrop-blur-md ${moonPick === choice.label ? "ring-4 ring-amber-200" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoonFace, { phase: choice.phase }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-hand text-2xl font-bold text-slate-700",
						children: choice.label
					})]
				}, choice.label);
			})
		})]
	});
	const renderComets = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "absolute inset-0 h-full w-full",
				viewBox: "0 0 100 100",
				preserveAspectRatio: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
					points: cometPath.map((point) => `${point.x},${point.y}`).join(" "),
					vectorEffect: "non-scaling-stroke",
					fill: "none",
					stroke: "#fff4a3",
					strokeWidth: "5",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					opacity: "0.78"
				})
			}),
			round.comets.map((point, index) => {
				const done = index < cometStep;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
					whileHover: { scale: 1.12 },
					whileTap: { scale: .9 },
					onClick: () => touchComet(point, index),
					className: `absolute grid h-16 w-16 place-items-center rounded-full shadow-[0_0_28px_rgba(255,255,255,0.72)] ${done ? "bg-amber-200 text-amber-700" : index === cometStep ? "bg-white text-cyan-500" : "bg-white/35 text-white/70"}`,
					style: {
						left: `${point.x}%`,
						top: `${point.y}%`
					},
					"aria-label": "Kometenpunkt",
					children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-7 w-7 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-current" })
				}, point.id);
			}),
			cometStep > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				className: "absolute h-12 w-28 rounded-full bg-gradient-to-r from-transparent via-white/80 to-amber-200 blur-sm",
				style: {
					left: `${round.comets[Math.min(cometStep - 1, round.comets.length - 1)].x - 7}%`,
					top: `${round.comets[Math.min(cometStep - 1, round.comets.length - 1)].y + 1}%`
				},
				initial: {
					opacity: 0,
					scale: .6
				},
				animate: {
					opacity: .9,
					scale: 1
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-5 top-5 rounded-3xl bg-white/18 px-5 py-4 text-white backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-hand text-4xl font-bold leading-none",
					children: [
						cometStep,
						"/",
						round.comets.length
					]
				})
			})
		]
	});
	const renderRainbow = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: SKY_SPRITES.rainbow,
				alt: "",
				className: "pointer-events-none absolute left-1/2 top-10 w-[min(760px,78%)] -translate-x-1/2 object-contain drop-shadow-2xl"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-5 bottom-7 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6",
				children: round.rainbow.map((label, index) => {
					const done = index < rainbowStep;
					const next = index === rainbowStep;
					const colors = [
						"bg-pink-300",
						"bg-orange-300",
						"bg-yellow-300",
						"bg-emerald-300",
						"bg-sky-300",
						"bg-violet-300"
					];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MotionButton, {
						whileHover: {
							y: -5,
							scale: 1.03
						},
						whileTap: { scale: .95 },
						onClick: () => chooseRainbow(label, index),
						className: `min-h-28 rounded-[30px] border-4 border-white px-4 py-4 shadow-xl ${colors[index % colors.length]} ${next ? "ring-4 ring-white" : ""} ${done ? "opacity-70" : ""}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-4xl font-bold leading-none text-white drop-shadow-sm",
							children: label
						})
					}, `${label}-${index}`);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-5 top-5 rounded-3xl bg-white/20 px-5 py-4 text-white backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-hand text-4xl font-bold leading-none",
					children: [
						rainbowStep,
						"/",
						round.rainbow.length
					]
				})
			})
		]
	});
	const renderTreasure = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: SKY_SPRITES.treasure,
				alt: "",
				className: "pointer-events-none absolute inset-x-0 top-2 mx-auto h-[270px] w-auto max-w-[88%] rounded-[36px] object-cover opacity-90 shadow-2xl"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-5 bottom-7 grid grid-cols-2 gap-4 md:grid-cols-4",
				children: round.treasures.map((item) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
						whileHover: {
							y: -5,
							scale: 1.04
						},
						whileTap: { scale: .94 },
						onClick: () => pickTreasure(item),
						className: `min-h-40 rounded-[34px] border-4 border-white bg-white/78 p-4 shadow-xl backdrop-blur-md ${foundTreasures.includes(item.id) ? "ring-4 ring-emerald-200" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: item.sprite,
							alt: "",
							className: "mx-auto h-24 w-24 object-contain drop-shadow-xl"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-2 block font-hand text-3xl font-bold text-slate-700",
							children: item.label
						})]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute left-5 top-5 rounded-3xl bg-white/20 px-5 py-4 text-white backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-hand text-4xl font-bold leading-none",
					children: [
						foundTreasures.length,
						"/",
						round.treasures.filter((item) => item.answer).length
					]
				})
			})
		]
	});
	const gameView = {
		constellation: renderConstellation,
		clouds: renderClouds,
		moon: renderMoon,
		comets: renderComets,
		rainbow: renderRainbow,
		treasure: renderTreasure
	}[mode];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-7xl flex-col gap-5 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2 text-slate-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Telescope, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-sans text-xs font-bold uppercase tracking-[0.28em]",
						children: round.name
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-hand text-5xl font-bold leading-none text-slate-800 md:text-7xl",
					children: title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => playJingle("calm"),
							className: "grid h-12 w-12 place-items-center rounded-full bg-white text-slate-700 shadow-md",
							"aria-label": "Klang",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => resetBoard(roundIndex),
							className: "grid h-12 w-12 place-items-center rounded-full bg-white text-slate-700 shadow-md",
							"aria-label": "Neu starten",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: nextSky,
							className: "grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white shadow-md",
							"aria-label": "Nächster Himmel",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-5 w-5" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6",
				children: SKY_WONDERLAND_MODES.map((item) => {
					const active = item.id === mode;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MotionButton, {
						whileHover: { y: -3 },
						whileTap: { scale: .96 },
						onClick: () => switchMode(item.id),
						className: `flex min-h-20 items-center gap-3 rounded-[24px] border px-4 py-3 text-left shadow-lg transition ${active ? "border-slate-900 bg-slate-900 text-white" : "border-white bg-white/75 text-slate-600 hover:bg-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid h-11 w-11 place-items-center rounded-2xl ${active ? "bg-white/18" : "bg-slate-100"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeIcon, { name: item.icon })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-hand text-3xl font-bold leading-none",
							children: item.label
						})]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex snap-x gap-5 overflow-x-auto rounded-[32px] border border-white/45 bg-white/25 px-4 py-4 shadow-inner backdrop-blur-sm",
				children: ANIMAL_FRIENDS.map((friend) => {
					const active = friend.id === friendId;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => chooseFriend(friend),
						"aria-label": friend.name,
						className: `snap-start min-w-[76px] rounded-[24px] border border-transparent px-1 py-1 transition hover:-translate-y-1 hover:scale-[1.03] active:scale-95 ${active ? "text-slate-900" : "text-slate-600"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative grid h-24 w-24 place-items-center",
							children: [active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-2 h-7 w-16 rounded-full bg-sky-200/55 blur-md" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: friend.image,
								alt: "",
								className: `relative h-24 w-24 object-contain transition ${active ? "scale-110" : ""}`,
								style: { filter: "drop-shadow(0 7px 8px rgba(15, 23, 42, 0.18))" },
								loading: "lazy",
								decoding: "async"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `block text-center font-hand text-2xl font-bold ${active ? "text-sky-700" : "text-slate-700"}`,
							children: friend.name
						})]
					}, friend.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => moveFriend(-1),
						className: "grid h-12 w-12 place-items-center rounded-full bg-white text-slate-700 shadow-md",
						"aria-label": "Nach links",
						title: "Nach links",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: hopFriend,
						className: "grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white shadow-md",
						"aria-label": "Hüpfen",
						title: "Hüpfen",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => moveFriend(1),
						className: "grid h-12 w-12 place-items-center rounded-full bg-white text-slate-700 shadow-md",
						"aria-label": "Nach rechts",
						title: "Nach rechts",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-6 w-6" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkyStage, {
				round,
				friend: activeFriend,
				friendX,
				friendDirection,
				friendHop,
				children: gameView?.()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_auto] items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-3 overflow-hidden rounded-full bg-white shadow-inner",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						className: "h-full rounded-full bg-gradient-to-r from-amber-300 via-cyan-300 to-rose-300",
						animate: { width: `${Math.min(100, score * 7)}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-full bg-white px-5 py-2 font-hand text-3xl font-bold text-slate-800 shadow-md",
					children: score
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						y: 12,
						scale: .96
					},
					animate: {
						opacity: 1,
						y: 0,
						scale: 1
					},
					exit: {
						opacity: 0,
						y: -8
					},
					className: "mx-auto rounded-full bg-white px-7 py-3 text-center font-hand text-3xl font-bold text-slate-700 shadow-lg",
					children: feedback
				}, feedback)
			})
		]
	});
}
//#endregion
export { SkyWonderland as default };
