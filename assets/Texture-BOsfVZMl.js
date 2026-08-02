import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { At as Texture, jt as TextureLoader, o as useLoader, s as useThree } from "./react-three-fiber.esm-pJsmxxS9.js";
//#region node_modules/@react-three/drei/core/Texture.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var IsObject = (url) => url === Object(url) && !Array.isArray(url) && typeof url !== "function";
function useTexture(input, onLoad) {
	const gl = useThree((state) => state.gl);
	const textures = useLoader(TextureLoader, IsObject(input) ? Object.values(input) : input);
	(0, import_react.useLayoutEffect)(() => {
		onLoad?.(textures);
	}, [onLoad]);
	(0, import_react.useEffect)(() => {
		if ("initTexture" in gl) {
			let textureArray = [];
			if (Array.isArray(textures)) textureArray = textures;
			else if (textures instanceof Texture) textureArray = [textures];
			else if (IsObject(textures)) textureArray = Object.values(textures);
			textureArray.forEach((texture) => {
				if (texture instanceof Texture) gl.initTexture(texture);
			});
		}
	}, [gl, textures]);
	return (0, import_react.useMemo)(() => {
		if (IsObject(input)) {
			const keyed = {};
			let i = 0;
			for (const key in input) keyed[key] = textures[i++];
			return keyed;
		} else return textures;
	}, [input, textures]);
}
useTexture.preload = (url) => useLoader.preload(TextureLoader, url);
useTexture.clear = (input) => useLoader.clear(TextureLoader, input);
//#endregion
export { useTexture as t };
