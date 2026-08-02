import { n as require_react, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { t as create } from "./react-B1iXS_n6.js";
import "./react-three-rapier.esm-BcN_gKXh.js";
require_react();
require_jsx_runtime();
create((set) => ({
	gameState: "START",
	artifactFound: false,
	playCount: 0,
	setGameState: (state) => set({ gameState: state }),
	collectArtifact: () => set({
		artifactFound: true,
		gameState: "ARTIFACT_FOUND"
	}),
	restart: () => set((state) => ({
		gameState: "PLAYING",
		artifactFound: false,
		playCount: state.playCount + 1
	}))
}));
//#endregion
