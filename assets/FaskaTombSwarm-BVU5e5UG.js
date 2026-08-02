import { n as require_react, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Placeholder({ onExit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white font-mono",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-2xl animate-pulse",
			children: "Building..."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onExit,
			className: "mt-8 px-6 py-2 bg-red-600 rounded",
			children: "Beenden"
		})]
	});
}
//#endregion
export { Placeholder as default };
