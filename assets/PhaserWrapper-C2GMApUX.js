import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as __webpack_exports__default } from "./phaser.esm-BgqlFbI5.js";
//#region src/utils/PhaserWrapper.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
/**
* A robust React wrapper for Phaser 3 games.
* Handles React 18 Strict Mode double mounting, cleans up old instances,
* and ensures the canvas is correctly attached to the container.
*/
function PhaserWrapper({ config, sceneClass }) {
	const containerRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!containerRef.current) return;
		if (gameRef.current) {
			gameRef.current.destroy(true);
			gameRef.current = null;
		}
		const finalConfig = {
			...config,
			scale: {
				mode: __webpack_exports__default.Scale.FIT,
				autoCenter: __webpack_exports__default.Scale.CENTER_BOTH,
				width: config.width || 800,
				height: config.height || 600,
				...config.scale || {}
			},
			parent: containerRef.current,
			scene: [sceneClass]
		};
		gameRef.current = new __webpack_exports__default.Game(finalConfig);
		return () => {
			if (gameRef.current) {
				gameRef.current.destroy(true);
				gameRef.current = null;
			}
		};
	}, [config, sceneClass]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		style: {
			width: "100%",
			height: "100%"
		}
	});
}
//#endregion
export { PhaserWrapper as t };
