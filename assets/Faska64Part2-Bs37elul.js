import { n as require_react, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Faska64Part2({ onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center h-full w-full bg-slate-900 text-white p-8 text-center relative z-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-bold mb-4",
				children: "FASKA 64 Part 2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xl mb-8",
				children: "Agent 3 encountered a write error. This game is being re-developed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onExit,
				className: "px-6 py-3 bg-red-600 hover:bg-red-500 rounded-full font-bold text-white transition-colors",
				children: "Beenden"
			})
		]
	});
}
//#endregion
export { Faska64Part2 as default };
