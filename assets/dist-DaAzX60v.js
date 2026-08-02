import { n as require_react, s as __toESM, t as require_jsx_runtime } from "./jsx-runtime-Be5yPkiZ.js";
import { At as Texture, Bt as WebGLRenderTarget, Ct as Scene, Ft as UnsignedInt248Type, G as LinearFilter, I as FloatType, J as LinearSRGBColorSpace, L as HalfFloatType, Lt as Vector2, M as EventDispatcher, Mt as Uniform, O as DepthStencilFormat, Pt as UnsignedByteType, Q as Material, S as Color, St as SRGBColorSpace, T as DataTexture, _ as BufferGeometry, _t as RGFormat, a as useFrame, bt as RedFormat, ct as NearestFilter, dt as PerspectiveCamera, g as BufferAttribute, gt as RGBAFormat, i as extend, k as DepthTexture, nt as Mesh, ot as MeshNormalMaterial, p as BasicDepthPacking, s as useThree, tt as Matrix4, ut as OrthographicCamera, wt as ShaderMaterial, xt as RepeatWrapping, zt as Vector4 } from "./react-three-fiber.esm-pJsmxxS9.js";
//#region node_modules/postprocessing/build/index.js
var fullscreenGeometry = /* @__PURE__ */ (() => {
	const vertices = new Float32Array([
		-1,
		-1,
		0,
		3,
		-1,
		0,
		-1,
		3,
		0
	]);
	const uvs = new Float32Array([
		0,
		0,
		2,
		0,
		0,
		2
	]);
	const geometry = new BufferGeometry();
	geometry.setAttribute("position", new BufferAttribute(vertices, 3));
	geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
	return geometry;
})();
var Pass = class _Pass {
	/**
	* A shared fullscreen triangle.
	*
	* The screen size is 2x2 units (NDC). A triangle needs to be 4x4 units to fill the screen.
	* @see https://michaldrobot.com/2014/04/01/gcn-execution-patterns-in-full-screen-passes/
	* @type {BufferGeometry}
	* @internal
	*/
	static get fullscreenGeometry() {
		return fullscreenGeometry;
	}
	/**
	* Constructs a new pass.
	*
	* @param {String} [name] - The name of this pass. Does not have to be unique.
	* @param {Scene} [scene] - The scene to render. The default scene contains a single mesh that fills the screen.
	* @param {Camera} [camera] - A camera. Fullscreen effect passes don't require a camera.
	*/
	constructor(name = "Pass", scene = new Scene(), camera = new OrthographicCamera()) {
		this.name = name;
		this.renderer = null;
		this.scene = scene;
		this.camera = camera;
		this.screen = null;
		this.rtt = true;
		this.needsSwap = true;
		this.needsDepthBlit = false;
		this.needsDepthTexture = false;
		this.enabled = true;
	}
	/**
	* Sets the render to screen flag.
	*
	* If this flag is changed, the fullscreen material will be updated as well.
	*
	* @type {Boolean}
	*/
	get renderToScreen() {
		return !this.rtt;
	}
	set renderToScreen(value) {
		if (this.rtt === value) {
			const material = this.fullscreenMaterial;
			if (material !== null) material.needsUpdate = true;
			this.rtt = !value;
		}
	}
	/**
	* Sets the main scene.
	*
	* @type {Scene}
	*/
	set mainScene(value) {}
	/**
	* Sets the main camera.
	*
	* @type {Camera}
	*/
	set mainCamera(value) {}
	/**
	* Sets the renderer
	*
	* @deprecated
	* @param {WebGLRenderer} renderer - The renderer.
	*/
	setRenderer(renderer) {
		this.renderer = renderer;
	}
	/**
	* Indicates whether this pass is enabled.
	*
	* @deprecated Use enabled instead.
	* @return {Boolean} Whether this pass is enabled.
	*/
	isEnabled() {
		return this.enabled;
	}
	/**
	* Enables or disables this pass.
	*
	* @deprecated Use enabled instead.
	* @param {Boolean} value - Whether the pass should be enabled.
	*/
	setEnabled(value) {
		this.enabled = value;
	}
	/**
	* The fullscreen material.
	*
	* @type {Material}
	*/
	get fullscreenMaterial() {
		return this.screen !== null ? this.screen.material : null;
	}
	set fullscreenMaterial(value) {
		let screen = this.screen;
		if (screen !== null) screen.material = value;
		else {
			screen = new Mesh(_Pass.fullscreenGeometry, value);
			screen.frustumCulled = false;
			if (this.scene === null) this.scene = new Scene();
			this.scene.add(screen);
			this.screen = screen;
		}
	}
	/**
	* Returns the current fullscreen material.
	*
	* @deprecated Use fullscreenMaterial instead.
	* @return {Material} The current fullscreen material, or null if there is none.
	*/
	getFullscreenMaterial() {
		return this.fullscreenMaterial;
	}
	/**
	* Sets the fullscreen material.
	*
	* @deprecated Use fullscreenMaterial instead.
	* @protected
	* @param {Material} value - A fullscreen material.
	*/
	setFullscreenMaterial(value) {
		this.fullscreenMaterial = value;
	}
	/**
	* Returns the current depth texture.
	*
	* @return {Texture} The current depth texture, or null if there is none.
	*/
	getDepthTexture() {
		return null;
	}
	/**
	* Sets the depth texture.
	*
	* This method will be called automatically by the {@link EffectComposer}.
	* You may override this method if your pass relies on the depth information of a preceding {@link RenderPass}.
	*
	* @param {Texture} depthTexture - A depth texture.
	* @param {DepthPackingStrategy} [depthPacking=BasicDepthPacking] - The depth packing.
	*/
	setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {}
	/**
	* Renders this pass.
	*
	* This is an abstract method that must be overridden.
	*
	* @abstract
	* @throws {Error} An error is thrown if the method is not overridden.
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		throw new Error("Render method not implemented!");
	}
	/**
	* Sets the size.
	*
	* You may override this method if you want to be informed about the size of the backbuffer/canvas.
	* This method is called before {@link initialize} and every time the size of the {@link EffectComposer} changes.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {}
	/**
	* Performs initialization tasks.
	*
	* This method is called when this pass is added to an {@link EffectComposer}.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	*/
	initialize(renderer, alpha, frameBufferType) {}
	/**
	* Performs a shallow search for disposable properties and deletes them.
	*
	* The {@link EffectComposer} calls this method when it is being destroyed. You can use it independently to free
	* memory when you're certain that you don't need this pass anymore.
	*/
	dispose() {
		for (const key of Object.keys(this)) {
			const property = this[key];
			if (property instanceof WebGLRenderTarget || property instanceof Material || property instanceof Texture || property instanceof _Pass) this[key].dispose();
		}
		if (this.fullscreenMaterial !== null) this.fullscreenMaterial.dispose();
	}
};
var ClearMaskPass = class extends Pass {
	/**
	* Constructs a new clear mask pass.
	*/
	constructor() {
		super("ClearMaskPass", null, null);
		this.needsSwap = false;
	}
	/**
	* Disables the global stencil test.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		const stencil = renderer.state.buffers.stencil;
		stencil.setLocked(false);
		stencil.setTest(false);
	}
};
var copy_default = `#ifdef COLOR_WRITE
#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#endif
#ifdef DEPTH_WRITE
#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}
#endif
#ifdef USE_WEIGHTS
uniform vec4 channelWeights;
#endif
uniform float opacity;varying vec2 vUv;void main(){
#ifdef COLOR_WRITE
vec4 texel=texture2D(inputBuffer,vUv);
#ifdef USE_WEIGHTS
texel*=channelWeights;
#endif
gl_FragColor=opacity*texel;
#ifdef COLOR_SPACE_CONVERSION
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
#else
gl_FragColor=vec4(0.0);
#endif
#ifdef DEPTH_WRITE
gl_FragDepth=readDepth(vUv);
#endif
}`;
var common_default = `varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}`;
var CopyMaterial = class extends ShaderMaterial {
	/**
	* Constructs a new copy material.
	*/
	constructor() {
		super({
			name: "CopyMaterial",
			defines: {
				COLOR_SPACE_CONVERSION: "1",
				DEPTH_PACKING: "0",
				COLOR_WRITE: "1"
			},
			uniforms: {
				inputBuffer: new Uniform(null),
				depthBuffer: new Uniform(null),
				channelWeights: new Uniform(null),
				opacity: new Uniform(1)
			},
			blending: 0,
			toneMapped: false,
			depthWrite: false,
			depthTest: false,
			fragmentShader: copy_default,
			vertexShader: common_default
		});
		this.depthFunc = 1;
	}
	/**
	* The input buffer.
	*
	* @type {Texture}
	*/
	get inputBuffer() {
		return this.uniforms.inputBuffer.value;
	}
	set inputBuffer(value) {
		const colorWrite = value !== null;
		if (this.colorWrite !== colorWrite) {
			if (colorWrite) this.defines.COLOR_WRITE = true;
			else delete this.defines.COLOR_WRITE;
			this.colorWrite = colorWrite;
			this.needsUpdate = true;
		}
		this.uniforms.inputBuffer.value = value;
	}
	/**
	* A depth buffer.
	*
	* @type {Texture}
	*/
	get depthBuffer() {
		return this.uniforms.depthBuffer.value;
	}
	set depthBuffer(value) {
		const depthWrite = value !== null;
		if (this.depthWrite !== depthWrite) {
			if (depthWrite) this.defines.DEPTH_WRITE = true;
			else delete this.defines.DEPTH_WRITE;
			this.depthTest = depthWrite;
			this.depthWrite = depthWrite;
			this.needsUpdate = true;
		}
		this.uniforms.depthBuffer.value = value;
	}
	/**
	* The depth packing strategy of the depth buffer.
	*
	* @type {DepthPackingStrategies}
	*/
	set depthPacking(value) {
		this.defines.DEPTH_PACKING = value.toFixed(0);
		this.needsUpdate = true;
	}
	/**
	* Indicates whether output color space conversion is enabled.
	*
	* @type {Boolean}
	*/
	get colorSpaceConversion() {
		return this.defines.COLOR_SPACE_CONVERSION !== void 0;
	}
	set colorSpaceConversion(value) {
		if (this.colorSpaceConversion !== value) {
			if (value) this.defines.COLOR_SPACE_CONVERSION = true;
			else delete this.defines.COLOR_SPACE_CONVERSION;
			this.needsUpdate = true;
		}
	}
	/**
	* Color channel weights that modulate texels from the input buffer.
	*
	* Set to `null` to disable.
	*
	* @type {Vector4 | null}
	*/
	get channelWeights() {
		return this.uniforms.channelWeights.value;
	}
	set channelWeights(value) {
		if (value !== null) {
			this.defines.USE_WEIGHTS = "1";
			this.uniforms.channelWeights.value = value;
		} else delete this.defines.USE_WEIGHTS;
		this.needsUpdate = true;
	}
	/**
	* Sets the input buffer.
	*
	* @deprecated Use inputBuffer instead.
	* @param {Number} value - The buffer.
	*/
	setInputBuffer(value) {
		this.uniforms.inputBuffer.value = value;
	}
	/**
	* Returns the opacity.
	*
	* @deprecated Use opacity instead.
	* @return {Number} The opacity.
	*/
	getOpacity(value) {
		return this.uniforms.opacity.value;
	}
	/**
	* Sets the opacity.
	*
	* @deprecated Use opacity instead.
	* @param {Number} value - The opacity.
	*/
	setOpacity(value) {
		this.uniforms.opacity.value = value;
	}
};
var CopyPass = class extends Pass {
	/**
	* Constructs a new save pass.
	*
	* @param {WebGLRenderTarget} [renderTarget] - A render target.
	* @param {Boolean} [autoResize=true] - Whether the render target size should be updated automatically.
	*/
	constructor(renderTarget, autoResize = true) {
		super("CopyPass");
		this.fullscreenMaterial = new CopyMaterial();
		this.needsSwap = false;
		this.renderTarget = renderTarget;
		if (renderTarget === void 0) {
			this.renderTarget = new WebGLRenderTarget(1, 1, {
				minFilter: LinearFilter,
				magFilter: LinearFilter,
				stencilBuffer: false,
				depthBuffer: false
			});
			this.renderTarget.texture.name = "CopyPass.Target";
		}
		this.autoResize = autoResize;
	}
	/**
	* Enables or disables auto resizing of the render target.
	*
	* @deprecated Use autoResize instead.
	* @type {Boolean}
	*/
	get resize() {
		return this.autoResize;
	}
	set resize(value) {
		this.autoResize = value;
	}
	/**
	* The output texture.
	*
	* @type {Texture}
	*/
	get texture() {
		return this.renderTarget.texture;
	}
	/**
	* Returns the output texture.
	*
	* @deprecated Use texture instead.
	* @return {Texture} The texture.
	*/
	getTexture() {
		return this.renderTarget.texture;
	}
	/**
	* Enables or disables auto resizing of the render target.
	*
	* @deprecated Use autoResize instead.
	* @param {Boolean} value - Whether the render target size should be updated automatically.
	*/
	setAutoResizeEnabled(value) {
		this.autoResize = value;
	}
	/**
	* Saves the input buffer.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		this.fullscreenMaterial.inputBuffer = inputBuffer.texture;
		renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
		renderer.render(this.scene, this.camera);
	}
	/**
	* Updates the size of this pass.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		if (this.autoResize) this.renderTarget.setSize(width, height);
	}
	/**
	* Performs initialization tasks.
	*
	* @param {WebGLRenderer} renderer - A renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	*/
	initialize(renderer, alpha, frameBufferType) {
		if (frameBufferType !== void 0) {
			this.renderTarget.texture.type = frameBufferType;
			if (frameBufferType !== 1009) this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
			else if (renderer !== null && renderer.outputColorSpace === "srgb") this.renderTarget.texture.colorSpace = SRGBColorSpace;
		}
	}
};
var color = /* @__PURE__ */ new Color();
var ClearPass = class extends Pass {
	/**
	* Constructs a new clear pass.
	*
	* @param {Boolean} [color=true] - Determines whether the color buffer should be cleared.
	* @param {Boolean} [depth=true] - Determines whether the depth buffer should be cleared.
	* @param {Boolean} [stencil=false] - Determines whether the stencil buffer should be cleared.
	*/
	constructor(color2 = true, depth = true, stencil = false) {
		super("ClearPass", null, null);
		this.needsSwap = false;
		this.color = color2;
		this.depth = depth;
		this.stencil = stencil;
		this.overrideClearColor = null;
		this.overrideClearAlpha = -1;
	}
	/**
	* Sets the clear flags.
	*
	* @param {Boolean} color - Whether the color buffer should be cleared.
	* @param {Boolean} depth - Whether the depth buffer should be cleared.
	* @param {Boolean} stencil - Whether the stencil buffer should be cleared.
	*/
	setClearFlags(color2, depth, stencil) {
		this.color = color2;
		this.depth = depth;
		this.stencil = stencil;
	}
	/**
	* Returns the override clear color. Default is null.
	*
	* @deprecated Use overrideClearColor instead.
	* @return {Color} The clear color.
	*/
	getOverrideClearColor() {
		return this.overrideClearColor;
	}
	/**
	* Sets the override clear color.
	*
	* @deprecated Use overrideClearColor instead.
	* @param {Color} value - The clear color.
	*/
	setOverrideClearColor(value) {
		this.overrideClearColor = value;
	}
	/**
	* Returns the override clear alpha. Default is -1.
	*
	* @deprecated Use overrideClearAlpha instead.
	* @return {Number} The clear alpha.
	*/
	getOverrideClearAlpha() {
		return this.overrideClearAlpha;
	}
	/**
	* Sets the override clear alpha.
	*
	* @deprecated Use overrideClearAlpha instead.
	* @param {Number} value - The clear alpha.
	*/
	setOverrideClearAlpha(value) {
		this.overrideClearAlpha = value;
	}
	/**
	* Clears the input buffer or the screen.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		const overrideClearColor = this.overrideClearColor;
		const overrideClearAlpha = this.overrideClearAlpha;
		const clearAlpha = renderer.getClearAlpha();
		const hasOverrideClearColor = overrideClearColor !== null;
		const hasOverrideClearAlpha = overrideClearAlpha >= 0;
		if (hasOverrideClearColor) {
			renderer.getClearColor(color);
			renderer.setClearColor(overrideClearColor, hasOverrideClearAlpha ? overrideClearAlpha : clearAlpha);
		} else if (hasOverrideClearAlpha) renderer.setClearAlpha(overrideClearAlpha);
		renderer.setRenderTarget(this.renderToScreen ? null : inputBuffer);
		renderer.clear(this.color, this.depth, this.stencil);
		if (hasOverrideClearColor) renderer.setClearColor(color, clearAlpha);
		else if (hasOverrideClearAlpha) renderer.setClearAlpha(clearAlpha);
	}
};
var MaskPass = class extends Pass {
	/**
	* Constructs a new mask pass.
	*
	* @param {Scene} scene - The scene to render.
	* @param {Camera} camera - The camera to use.
	*/
	constructor(scene, camera) {
		super("MaskPass", scene, camera);
		this.needsSwap = false;
		this.clearPass = new ClearPass(false, false, true);
		this.inverse = false;
	}
	set mainScene(value) {
		this.scene = value;
	}
	set mainCamera(value) {
		this.camera = value;
	}
	/**
	* Indicates whether the mask should be inverted.
	*
	* @type {Boolean}
	*/
	get inverted() {
		return this.inverse;
	}
	set inverted(value) {
		this.inverse = value;
	}
	/**
	* Indicates whether this pass should clear the stencil buffer.
	*
	* @type {Boolean}
	* @deprecated Use clearPass.enabled instead.
	*/
	get clear() {
		return this.clearPass.enabled;
	}
	set clear(value) {
		this.clearPass.enabled = value;
	}
	/**
	* Returns the internal clear pass.
	*
	* @deprecated Use clearPass.enabled instead.
	* @return {ClearPass} The clear pass.
	*/
	getClearPass() {
		return this.clearPass;
	}
	/**
	* Indicates whether the mask is inverted.
	*
	* @deprecated Use inverted instead.
	* @return {Boolean} Whether the mask is inverted.
	*/
	isInverted() {
		return this.inverted;
	}
	/**
	* Enables or disable mask inversion.
	*
	* @deprecated Use inverted instead.
	* @param {Boolean} value - Whether the mask should be inverted.
	*/
	setInverted(value) {
		this.inverted = value;
	}
	/**
	* Renders the effect.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		const context = renderer.getContext();
		const buffers = renderer.state.buffers;
		const scene = this.scene;
		const camera = this.camera;
		const clearPass = this.clearPass;
		const writeValue = this.inverted ? 0 : 1;
		const clearValue = 1 - writeValue;
		buffers.color.setMask(false);
		buffers.depth.setMask(false);
		buffers.color.setLocked(true);
		buffers.depth.setLocked(true);
		buffers.stencil.setTest(true);
		buffers.stencil.setOp(context.REPLACE, context.REPLACE, context.REPLACE);
		buffers.stencil.setFunc(context.ALWAYS, writeValue, 4294967295);
		buffers.stencil.setClear(clearValue);
		buffers.stencil.setLocked(true);
		if (this.clearPass.enabled) if (this.renderToScreen) clearPass.render(renderer, null);
		else {
			clearPass.render(renderer, inputBuffer);
			clearPass.render(renderer, outputBuffer);
		}
		if (this.renderToScreen) {
			renderer.setRenderTarget(null);
			renderer.render(scene, camera);
		} else {
			renderer.setRenderTarget(inputBuffer);
			renderer.render(scene, camera);
			renderer.setRenderTarget(outputBuffer);
			renderer.render(scene, camera);
		}
		buffers.color.setLocked(false);
		buffers.depth.setLocked(false);
		buffers.stencil.setLocked(false);
		buffers.stencil.setFunc(context.EQUAL, 1, 4294967295);
		buffers.stencil.setOp(context.KEEP, context.KEEP, context.KEEP);
		buffers.stencil.setLocked(true);
	}
};
var MILLISECONDS_TO_SECONDS = 1 / 1e3;
var SECONDS_TO_MILLISECONDS = 1e3;
var Timer = class {
	/**
	* Constructs a new timer.
	*/
	constructor() {
		this.startTime = performance.now();
		this.previousTime = 0;
		this.currentTime = 0;
		this._delta = 0;
		this._elapsed = 0;
		this._fixedDelta = 1e3 / 60;
		this.timescale = 1;
		this.useFixedDelta = false;
		this._autoReset = false;
	}
	/**
	* Enables or disables auto reset based on page visibility.
	*
	* If enabled, the timer will be reset when the page becomes visible. This effectively pauses the timer when the page
	* is hidden. Has no effect if the API is not supported.
	*
	* @type {Boolean}
	* @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
	*/
	get autoReset() {
		return this._autoReset;
	}
	set autoReset(value) {
		if (typeof document !== "undefined" && document.hidden !== void 0) {
			if (value) document.addEventListener("visibilitychange", this);
			else document.removeEventListener("visibilitychange", this);
			this._autoReset = value;
		}
	}
	get delta() {
		return this._delta * MILLISECONDS_TO_SECONDS;
	}
	get fixedDelta() {
		return this._fixedDelta * MILLISECONDS_TO_SECONDS;
	}
	set fixedDelta(value) {
		this._fixedDelta = value * SECONDS_TO_MILLISECONDS;
	}
	get elapsed() {
		return this._elapsed * MILLISECONDS_TO_SECONDS;
	}
	/**
	* Updates this timer.
	*
	* @param {Boolean} [timestamp] - The current time in milliseconds.
	*/
	update(timestamp) {
		if (this.useFixedDelta) this._delta = this.fixedDelta;
		else {
			this.previousTime = this.currentTime;
			this.currentTime = (timestamp !== void 0 ? timestamp : performance.now()) - this.startTime;
			this._delta = this.currentTime - this.previousTime;
		}
		this._delta *= this.timescale;
		this._elapsed += this._delta;
	}
	/**
	* Resets this timer.
	*/
	reset() {
		this._delta = 0;
		this._elapsed = 0;
		this.currentTime = performance.now() - this.startTime;
	}
	getDelta() {
		return this.delta;
	}
	getElapsed() {
		return this.elapsed;
	}
	handleEvent(e) {
		if (!document.hidden) this.currentTime = performance.now() - this.startTime;
	}
	dispose() {
		this.autoReset = false;
	}
};
var EffectComposer = class {
	/**
	* Constructs a new effect composer.
	*
	* @param {WebGLRenderer} renderer - The renderer that should be used.
	* @param {Object} [options] - The options.
	* @param {Boolean} [options.depthBuffer=true] - Whether the main render targets should have a depth buffer.
	* @param {Boolean} [options.stencilBuffer=false] - Whether the main render targets should have a stencil buffer.
	* @param {Number} [options.multisampling=0] - The number of samples used for multisample antialiasing. Requires WebGL 2.
	* @param {Number} [options.frameBufferType] - The type of the internal frame buffers. It's recommended to use HalfFloatType if possible.
	*/
	constructor(renderer = null, { depthBuffer = true, stencilBuffer = false, multisampling = 0, frameBufferType } = {}) {
		this.renderer = null;
		this.inputBuffer = this.createBuffer(depthBuffer, stencilBuffer, frameBufferType, multisampling);
		this.outputBuffer = this.inputBuffer.clone();
		this.copyPass = new CopyPass();
		this.depthTexture = null;
		this.depthRenderTarget = null;
		this.passes = [];
		this.timer = new Timer();
		this.autoRenderToScreen = true;
		this.setRenderer(renderer);
	}
	/**
	* The current amount of samples used for multisample anti-aliasing.
	*
	* @type {Number}
	*/
	get multisampling() {
		return this.inputBuffer.samples;
	}
	/**
	* Sets the amount of MSAA samples.
	*
	* Requires WebGL 2. Set to zero to disable multisampling.
	*
	* @type {Number}
	*/
	set multisampling(value) {
		const buffer = this.inputBuffer;
		const multisampling = this.multisampling;
		if (multisampling > 0 && value > 0) {
			this.inputBuffer.samples = value;
			this.outputBuffer.samples = value;
			this.inputBuffer.dispose();
			this.outputBuffer.dispose();
		} else if (multisampling !== value) {
			this.inputBuffer.dispose();
			this.outputBuffer.dispose();
			this.inputBuffer = this.createBuffer(buffer.depthBuffer, buffer.stencilBuffer, buffer.texture.type, value);
			this.outputBuffer = this.inputBuffer.clone();
		}
	}
	/**
	* Returns the internal timer.
	*
	* @return {Timer} The timer.
	*/
	getTimer() {
		return this.timer;
	}
	/**
	* Returns the renderer.
	*
	* @return {WebGLRenderer} The renderer.
	*/
	getRenderer() {
		return this.renderer;
	}
	/**
	* Sets the renderer.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	*/
	setRenderer(renderer) {
		this.renderer = renderer;
		if (renderer !== null) {
			const size = renderer.getSize(new Vector2());
			const alpha = renderer.getContext().getContextAttributes().alpha;
			const frameBufferType = this.inputBuffer.texture.type;
			if (frameBufferType === 1009 && renderer.outputColorSpace === "srgb") {
				this.inputBuffer.texture.colorSpace = SRGBColorSpace;
				this.outputBuffer.texture.colorSpace = SRGBColorSpace;
				this.inputBuffer.dispose();
				this.outputBuffer.dispose();
			}
			renderer.autoClear = false;
			this.setSize(size.width, size.height);
			for (const pass of this.passes) pass.initialize(renderer, alpha, frameBufferType);
		}
	}
	/**
	* Replaces the current renderer with the given one.
	*
	* The auto clear mechanism of the provided renderer will be disabled. If the new render size differs from the
	* previous one, all passes will be updated.
	*
	* By default, the DOM element of the current renderer will automatically be removed from its parent node and the DOM
	* element of the new renderer will take its place.
	*
	* @deprecated Use setRenderer instead.
	* @param {WebGLRenderer} renderer - The new renderer.
	* @param {Boolean} updateDOM - Indicates whether the old canvas should be replaced by the new one in the DOM.
	* @return {WebGLRenderer} The old renderer.
	*/
	replaceRenderer(renderer, updateDOM = true) {
		const oldRenderer = this.renderer;
		const parent = oldRenderer.domElement.parentNode;
		this.setRenderer(renderer);
		if (updateDOM && parent !== null) {
			parent.removeChild(oldRenderer.domElement);
			parent.appendChild(renderer.domElement);
		}
		return oldRenderer;
	}
	/**
	* Creates a depth texture attachment that will be provided to all passes.
	*
	* To prevent errors or incorrect behavior when the same depth buffer is attached to the input and output buffers,
	* a separate stable depth target is created alongside the ping-pong buffers.  All passes receive the stable target's
	* depth texture, which is never used as a render output and therefore cannot create a feedback loop.  The stable
	* texture is populated each frame via blitFramebuffer immediately before the first buffer swap.
	*
	* @private
	* @return {DepthTexture} The stable depth texture distributed to passes.
	*/
	createDepthTexture() {
		const inputBuffer = this.inputBuffer;
		const depthTexture = new DepthTexture();
		this.depthTexture = depthTexture;
		if (inputBuffer.stencilBuffer) {
			depthTexture.format = DepthStencilFormat;
			depthTexture.type = UnsignedInt248Type;
		} else depthTexture.type = FloatType;
		const stableDepthTexture = depthTexture.clone();
		stableDepthTexture.name = "EffectComposer.StableDepth";
		this.depthRenderTarget = new WebGLRenderTarget(inputBuffer.width, inputBuffer.height, {
			depthBuffer: true,
			stencilBuffer: inputBuffer.stencilBuffer,
			depthTexture: stableDepthTexture
		});
		return stableDepthTexture;
	}
	/**
	* Copies the depth buffer from the src render target into the stable depth target.
	*
	* @private
	* @param {WebGLRenderTarget} renderTarget - The render target whose depth buffer should be copied.
	*/
	blitDepthBuffer(renderTarget) {
		const renderer = this.renderer;
		const depthRenderTarget = this.depthRenderTarget;
		const props = renderer.properties;
		const gl = renderer.getContext();
		renderer.setRenderTarget(depthRenderTarget);
		const srcFBO = props.get(renderTarget).__webglFramebuffer;
		const dstFBO = props.get(depthRenderTarget).__webglFramebuffer;
		const blitMask = renderTarget.stencilBuffer ? gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT : gl.DEPTH_BUFFER_BIT;
		gl.bindFramebuffer(gl.READ_FRAMEBUFFER, srcFBO);
		gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, dstFBO);
		gl.blitFramebuffer(0, 0, renderTarget.width, renderTarget.height, 0, 0, depthRenderTarget.width, depthRenderTarget.height, blitMask, gl.NEAREST);
		gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
		gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
		renderer.setRenderTarget(null);
	}
	/**
	* Deletes the current depth texture.
	*
	* @private
	*/
	deleteDepthTexture() {
		if (this.depthTexture !== null) {
			this.depthTexture.dispose();
			this.depthTexture = null;
			this.depthRenderTarget.dispose();
			this.depthRenderTarget = null;
			this.inputBuffer.depthTexture = null;
			this.outputBuffer.depthTexture = null;
			for (const pass of this.passes) pass.setDepthTexture(null);
		}
	}
	/**
	* Creates a new render target.
	*
	* @private
	* @param {Boolean} depthBuffer - Whether the render target should have a depth buffer.
	* @param {Boolean} stencilBuffer - Whether the render target should have a stencil buffer.
	* @param {Number} type - The frame buffer type.
	* @param {Number} multisampling - The number of samples to use for antialiasing.
	* @return {WebGLRenderTarget} A new render target that equals the renderer's canvas.
	*/
	createBuffer(depthBuffer, stencilBuffer, type, multisampling) {
		const renderer = this.renderer;
		const size = renderer === null ? new Vector2() : renderer.getDrawingBufferSize(new Vector2());
		const options = {
			minFilter: LinearFilter,
			magFilter: LinearFilter,
			stencilBuffer,
			depthBuffer,
			type
		};
		const renderTarget = new WebGLRenderTarget(size.width, size.height, options);
		if (multisampling > 0) renderTarget.samples = multisampling;
		if (type === 1009 && renderer !== null && renderer.outputColorSpace === "srgb") renderTarget.texture.colorSpace = SRGBColorSpace;
		renderTarget.texture.name = "EffectComposer.Buffer";
		renderTarget.texture.generateMipmaps = false;
		return renderTarget;
	}
	/**
	* Can be used to change the main scene for all registered passes and effects.
	*
	* @param {Scene} scene - The scene.
	*/
	setMainScene(scene) {
		for (const pass of this.passes) pass.mainScene = scene;
	}
	/**
	* Can be used to change the main camera for all registered passes and effects.
	*
	* @param {Camera} camera - The camera.
	*/
	setMainCamera(camera) {
		for (const pass of this.passes) pass.mainCamera = camera;
	}
	/**
	* Adds a pass, optionally at a specific index.
	*
	* @param {Pass} pass - A new pass.
	* @param {Number} [index] - An index at which the pass should be inserted.
	*/
	addPass(pass, index) {
		const passes = this.passes;
		const renderer = this.renderer;
		const drawingBufferSize = renderer.getDrawingBufferSize(new Vector2());
		const alpha = renderer.getContext().getContextAttributes().alpha;
		const frameBufferType = this.inputBuffer.texture.type;
		pass.renderer = renderer;
		pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
		pass.initialize(renderer, alpha, frameBufferType);
		if (this.autoRenderToScreen) {
			if (passes.length > 0) passes[passes.length - 1].renderToScreen = false;
			if (pass.renderToScreen) this.autoRenderToScreen = false;
		}
		if (index !== void 0) passes.splice(index, 0, pass);
		else passes.push(pass);
		if (this.autoRenderToScreen) passes[passes.length - 1].renderToScreen = true;
		if (pass.needsDepthTexture || this.depthTexture !== null) if (this.depthTexture === null) {
			const stableDepthTexture = this.createDepthTexture();
			for (pass of passes) pass.setDepthTexture(stableDepthTexture);
		} else {
			const stableDepthTexture = this.depthRenderTarget.depthTexture;
			pass.setDepthTexture(stableDepthTexture);
		}
	}
	/**
	* Removes a pass.
	*
	* @param {Pass} pass - The pass.
	*/
	removePass(pass) {
		const passes = this.passes;
		const index = passes.indexOf(pass);
		if (index !== -1 && passes.splice(index, 1).length > 0) {
			if (this.depthTexture !== null) {
				const reducer = (a, b) => a || b.needsDepthTexture;
				if (!passes.reduce(reducer, false)) {
					const stableDepthTexture = this.depthRenderTarget.depthTexture;
					if (pass.getDepthTexture() === stableDepthTexture) pass.setDepthTexture(null);
					this.deleteDepthTexture();
				}
			}
			if (this.autoRenderToScreen) {
				if (index === passes.length) {
					pass.renderToScreen = false;
					if (passes.length > 0) passes[passes.length - 1].renderToScreen = true;
				}
			}
		}
	}
	/**
	* Removes all passes.
	*/
	removeAllPasses() {
		const passes = this.passes;
		this.deleteDepthTexture();
		if (passes.length > 0) {
			if (this.autoRenderToScreen) passes[passes.length - 1].renderToScreen = false;
			this.passes = [];
		}
	}
	/**
	* Renders all enabled passes in the order in which they were added.
	*
	* @param {Number} [deltaTime] - The time since the last frame in seconds.
	*/
	render(deltaTime) {
		const renderer = this.renderer;
		const copyPass = this.copyPass;
		let inputBuffer = this.inputBuffer;
		let outputBuffer = this.outputBuffer;
		let buffer;
		let stencilTest = false;
		if (deltaTime === void 0) {
			this.timer.update();
			deltaTime = this.timer.getDelta();
		}
		for (const pass of this.passes) {
			if (!pass.enabled) continue;
			inputBuffer.depthTexture = this.depthTexture;
			outputBuffer.depthTexture = null;
			pass.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest);
			if (pass.needsDepthBlit) {
				if (this.depthRenderTarget !== null) this.blitDepthBuffer(inputBuffer);
			}
			if (pass.needsSwap) {
				if (stencilTest) {
					copyPass.renderToScreen = pass.renderToScreen;
					const context = renderer.getContext();
					const stencil = renderer.state.buffers.stencil;
					stencil.setFunc(context.NOTEQUAL, 1, 4294967295);
					copyPass.render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest);
					stencil.setFunc(context.EQUAL, 1, 4294967295);
				}
				buffer = inputBuffer;
				inputBuffer = outputBuffer;
				outputBuffer = buffer;
			}
			if (pass instanceof MaskPass) stencilTest = true;
			else if (pass instanceof ClearMaskPass) stencilTest = false;
		}
	}
	/**
	* Sets the size of the buffers, passes and the renderer.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	* @param {Boolean} [updateStyle] - Determines whether the style of the canvas should be updated.
	*/
	setSize(width, height, updateStyle) {
		const renderer = this.renderer;
		const currentSize = renderer.getSize(new Vector2());
		if (width === void 0 || height === void 0) {
			width = currentSize.width;
			height = currentSize.height;
		}
		if (currentSize.width !== width || currentSize.height !== height) renderer.setSize(width, height, updateStyle);
		const drawingBufferSize = renderer.getDrawingBufferSize(new Vector2());
		this.inputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
		this.outputBuffer.setSize(drawingBufferSize.width, drawingBufferSize.height);
		if (this.depthRenderTarget !== null) this.depthRenderTarget.setSize(drawingBufferSize.width, drawingBufferSize.height);
		for (const pass of this.passes) pass.setSize(drawingBufferSize.width, drawingBufferSize.height);
	}
	/**
	* Resets this composer by deleting all passes and creating new buffers.
	*/
	reset() {
		this.dispose();
		this.autoRenderToScreen = true;
	}
	/**
	* Disposes this composer and all passes.
	*/
	dispose() {
		for (const pass of this.passes) pass.dispose();
		this.passes = [];
		if (this.inputBuffer !== null) this.inputBuffer.dispose();
		if (this.outputBuffer !== null) this.outputBuffer.dispose();
		this.deleteDepthTexture();
		this.copyPass.dispose();
		this.timer.dispose();
		Pass.fullscreenGeometry.dispose();
	}
};
var EffectAttribute = {
	NONE: 0,
	DEPTH: 1,
	CONVOLUTION: 2
};
var EffectShaderSection = {
	FRAGMENT_HEAD: "FRAGMENT_HEAD",
	FRAGMENT_MAIN_UV: "FRAGMENT_MAIN_UV",
	FRAGMENT_MAIN_IMAGE: "FRAGMENT_MAIN_IMAGE",
	VERTEX_HEAD: "VERTEX_HEAD",
	VERTEX_MAIN_SUPPORT: "VERTEX_MAIN_SUPPORT"
};
var EffectShaderData = class {
	/**
	* Constructs new shader data.
	*/
	constructor() {
		this.shaderParts = /* @__PURE__ */ new Map([
			[EffectShaderSection.FRAGMENT_HEAD, null],
			[EffectShaderSection.FRAGMENT_MAIN_UV, null],
			[EffectShaderSection.FRAGMENT_MAIN_IMAGE, null],
			[EffectShaderSection.VERTEX_HEAD, null],
			[EffectShaderSection.VERTEX_MAIN_SUPPORT, null]
		]);
		this.defines = /* @__PURE__ */ new Map();
		this.uniforms = /* @__PURE__ */ new Map();
		this.blendModes = /* @__PURE__ */ new Map();
		this.extensions = /* @__PURE__ */ new Set();
		this.attributes = EffectAttribute.NONE;
		this.varyings = /* @__PURE__ */ new Set();
		this.uvTransformation = false;
		this.readDepth = false;
		this.colorSpace = LinearSRGBColorSpace;
	}
};
var workaroundEnabled = false;
var OverrideMaterialManager = class {
	/**
	* Constructs a new override material manager.
	*
	* @param {Material} [material=null] - An override material.
	*/
	constructor(material = null) {
		this.originalMaterials = /* @__PURE__ */ new Map();
		this.material = null;
		this.materials = null;
		this.materialsBackSide = null;
		this.materialsDoubleSide = null;
		this.materialsFlatShaded = null;
		this.materialsFlatShadedBackSide = null;
		this.materialsFlatShadedDoubleSide = null;
		this.setMaterial(material);
		this.meshCount = 0;
		this.replaceMaterial = (node) => {
			if (node.isMesh) {
				let materials;
				if (node.material.flatShading) switch (node.material.side) {
					case 2:
						materials = this.materialsFlatShadedDoubleSide;
						break;
					case 1:
						materials = this.materialsFlatShadedBackSide;
						break;
					default:
						materials = this.materialsFlatShaded;
						break;
				}
				else switch (node.material.side) {
					case 2:
						materials = this.materialsDoubleSide;
						break;
					case 1:
						materials = this.materialsBackSide;
						break;
					default:
						materials = this.materials;
						break;
				}
				this.originalMaterials.set(node, node.material);
				if (node.isSkinnedMesh) node.material = materials[2];
				else if (node.isInstancedMesh) node.material = materials[1];
				else node.material = materials[0];
				++this.meshCount;
			}
		};
	}
	/**
	* Clones the given material.
	*
	* @private
	* @param {Material} material - The material.
	* @return {Material} The cloned material.
	*/
	cloneMaterial(material) {
		if (!(material instanceof ShaderMaterial)) return material.clone();
		const uniforms = material.uniforms;
		const textureUniforms = /* @__PURE__ */ new Map();
		for (const key in uniforms) {
			const value = uniforms[key].value;
			if (value.isRenderTargetTexture) {
				uniforms[key].value = null;
				textureUniforms.set(key, value);
			}
		}
		const clone = material.clone();
		for (const entry of textureUniforms) {
			uniforms[entry[0]].value = entry[1];
			clone.uniforms[entry[0]].value = entry[1];
		}
		return clone;
	}
	/**
	* Sets the override material.
	*
	* @param {Material} material - The material.
	*/
	setMaterial(material) {
		this.disposeMaterials();
		this.material = material;
		if (material !== null) {
			const materials = this.materials = [
				this.cloneMaterial(material),
				this.cloneMaterial(material),
				this.cloneMaterial(material)
			];
			for (const m2 of materials) {
				m2.uniforms = Object.assign({}, material.uniforms);
				m2.side = 0;
			}
			materials[2].skinning = true;
			this.materialsBackSide = materials.map((m2) => {
				const c2 = this.cloneMaterial(m2);
				c2.uniforms = Object.assign({}, material.uniforms);
				c2.side = 1;
				return c2;
			});
			this.materialsDoubleSide = materials.map((m2) => {
				const c2 = this.cloneMaterial(m2);
				c2.uniforms = Object.assign({}, material.uniforms);
				c2.side = 2;
				return c2;
			});
			this.materialsFlatShaded = materials.map((m2) => {
				const c2 = this.cloneMaterial(m2);
				c2.uniforms = Object.assign({}, material.uniforms);
				c2.flatShading = true;
				return c2;
			});
			this.materialsFlatShadedBackSide = materials.map((m2) => {
				const c2 = this.cloneMaterial(m2);
				c2.uniforms = Object.assign({}, material.uniforms);
				c2.flatShading = true;
				c2.side = 1;
				return c2;
			});
			this.materialsFlatShadedDoubleSide = materials.map((m2) => {
				const c2 = this.cloneMaterial(m2);
				c2.uniforms = Object.assign({}, material.uniforms);
				c2.flatShading = true;
				c2.side = 2;
				return c2;
			});
		}
	}
	/**
	* Renders the scene with the override material.
	*
	* @private
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {Scene} scene - A scene.
	* @param {Camera} camera - A camera.
	*/
	render(renderer, scene, camera) {
		const shadowMapEnabled = renderer.shadowMap.enabled;
		renderer.shadowMap.enabled = false;
		if (workaroundEnabled) {
			const originalMaterials = this.originalMaterials;
			this.meshCount = 0;
			scene.traverse(this.replaceMaterial);
			renderer.render(scene, camera);
			for (const entry of originalMaterials) entry[0].material = entry[1];
			if (this.meshCount !== originalMaterials.size) originalMaterials.clear();
		} else {
			const overrideMaterial = scene.overrideMaterial;
			scene.overrideMaterial = this.material;
			renderer.render(scene, camera);
			scene.overrideMaterial = overrideMaterial;
		}
		renderer.shadowMap.enabled = shadowMapEnabled;
	}
	/**
	* Deletes cloned override materials.
	*
	* @private
	*/
	disposeMaterials() {
		if (this.material !== null) {
			const materials = this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);
			for (const m2 of materials) m2.dispose();
		}
	}
	/**
	* Performs cleanup tasks.
	*/
	dispose() {
		this.originalMaterials.clear();
		this.disposeMaterials();
	}
	/**
	* Indicates whether the override material workaround is enabled.
	*
	* @type {Boolean}
	*/
	static get workaroundEnabled() {
		return workaroundEnabled;
	}
	/**
	* Enables or disables the override material workaround globally.
	*
	* This only affects post processing passes and effects.
	*
	* @type {Boolean}
	*/
	static set workaroundEnabled(value) {
		workaroundEnabled = value;
	}
};
var AUTO_SIZE = -1;
var Resolution = class extends EventDispatcher {
	/**
	* Constructs a new resolution.
	*
	* @param {Resizable} [resizable=null] - Deprecated. Use `addEventListener("change", listener)` instead.
	* @param {Number} [width=Resolution.AUTO_SIZE] - The preferred width.
	* @param {Number} [height=Resolution.AUTO_SIZE] - The preferred height.
	* @param {Number} [scale=1.0] - A resolution scale.
	*/
	constructor(resizable = null, width = AUTO_SIZE, height = AUTO_SIZE, scale = 1) {
		super();
		if (resizable !== null) this.addEventListener("change", () => resizable.setSize(this.baseSize.width, this.baseSize.height));
		this.baseSize = new Vector2(1, 1);
		this.preferredSize = new Vector2(width, height);
		this.target = this.preferredSize;
		this.s = scale;
		this.effectiveSize = new Vector2();
		this.addEventListener("change", () => this.updateEffectiveSize());
		this.updateEffectiveSize();
	}
	/**
	* Calculates the effective size.
	*
	* @private
	*/
	updateEffectiveSize() {
		const base = this.baseSize;
		const preferred = this.preferredSize;
		const effective = this.effectiveSize;
		const scale = this.scale;
		if (preferred.width !== AUTO_SIZE) effective.width = preferred.width;
		else if (preferred.height !== AUTO_SIZE) effective.width = Math.round(preferred.height * (base.width / Math.max(base.height, 1)));
		else effective.width = Math.round(base.width * scale);
		if (preferred.height !== AUTO_SIZE) effective.height = preferred.height;
		else if (preferred.width !== AUTO_SIZE) effective.height = Math.round(preferred.width / Math.max(base.width / Math.max(base.height, 1), 1));
		else effective.height = Math.round(base.height * scale);
	}
	/**
	* The effective width.
	*
	* If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base width will be returned.
	*
	* @type {Number}
	*/
	get width() {
		return this.effectiveSize.width;
	}
	set width(value) {
		this.preferredWidth = value;
	}
	/**
	* The effective height.
	*
	* If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base height will be returned.
	*
	* @type {Number}
	*/
	get height() {
		return this.effectiveSize.height;
	}
	set height(value) {
		this.preferredHeight = value;
	}
	/**
	* Returns the effective width.
	*
	* If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base width will be returned.
	*
	* @deprecated Use width instead.
	* @return {Number} The effective width.
	*/
	getWidth() {
		return this.width;
	}
	/**
	* Returns the effective height.
	*
	* If the preferred width and height are set to {@link Resizer.AUTO_SIZE}, the base height will be returned.
	*
	* @deprecated Use height instead.
	* @return {Number} The effective height.
	*/
	getHeight() {
		return this.height;
	}
	/**
	* The resolution scale.
	*
	* @type {Number}
	*/
	get scale() {
		return this.s;
	}
	set scale(value) {
		if (this.s !== value) {
			this.s = value;
			this.preferredSize.setScalar(AUTO_SIZE);
			this.dispatchEvent({ type: "change" });
		}
	}
	/**
	* Returns the current resolution scale.
	*
	* @deprecated Use scale instead.
	* @return {Number} The scale.
	*/
	getScale() {
		return this.scale;
	}
	/**
	* Sets the resolution scale.
	*
	* Also sets the preferred resolution to {@link Resizer.AUTO_SIZE}.
	*
	* @deprecated Use scale instead.
	* @param {Number} value - The scale.
	*/
	setScale(value) {
		this.scale = value;
	}
	/**
	* The base width.
	*
	* @type {Number}
	*/
	get baseWidth() {
		return this.baseSize.width;
	}
	set baseWidth(value) {
		if (this.baseSize.width !== value) {
			this.baseSize.width = value;
			this.dispatchEvent({ type: "change" });
		}
	}
	/**
	* Returns the base width.
	*
	* @deprecated Use baseWidth instead.
	* @return {Number} The base width.
	*/
	getBaseWidth() {
		return this.baseWidth;
	}
	/**
	* Sets the base width.
	*
	* @deprecated Use baseWidth instead.
	* @param {Number} value - The width.
	*/
	setBaseWidth(value) {
		this.baseWidth = value;
	}
	/**
	* The base height.
	*
	* @type {Number}
	*/
	get baseHeight() {
		return this.baseSize.height;
	}
	set baseHeight(value) {
		if (this.baseSize.height !== value) {
			this.baseSize.height = value;
			this.dispatchEvent({ type: "change" });
		}
	}
	/**
	* Returns the base height.
	*
	* @deprecated Use baseHeight instead.
	* @return {Number} The base height.
	*/
	getBaseHeight() {
		return this.baseHeight;
	}
	/**
	* Sets the base height.
	*
	* @deprecated Use baseHeight instead.
	* @param {Number} value - The height.
	*/
	setBaseHeight(value) {
		this.baseHeight = value;
	}
	/**
	* Sets the base size.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setBaseSize(width, height) {
		if (this.baseSize.width !== width || this.baseSize.height !== height) {
			this.baseSize.set(width, height);
			this.dispatchEvent({ type: "change" });
		}
	}
	/**
	* The preferred width.
	*
	* @type {Number}
	*/
	get preferredWidth() {
		return this.preferredSize.width;
	}
	set preferredWidth(value) {
		if (this.preferredSize.width !== value) {
			this.preferredSize.width = value;
			this.dispatchEvent({ type: "change" });
		}
	}
	/**
	* Returns the preferred width.
	*
	* @deprecated Use preferredWidth instead.
	* @return {Number} The preferred width.
	*/
	getPreferredWidth() {
		return this.preferredWidth;
	}
	/**
	* Sets the preferred width.
	*
	* Use {@link Resizer.AUTO_SIZE} to automatically calculate the width based on the height and aspect ratio.
	*
	* @deprecated Use preferredWidth instead.
	* @param {Number} value - The width.
	*/
	setPreferredWidth(value) {
		this.preferredWidth = value;
	}
	/**
	* The preferred height.
	*
	* @type {Number}
	*/
	get preferredHeight() {
		return this.preferredSize.height;
	}
	set preferredHeight(value) {
		if (this.preferredSize.height !== value) {
			this.preferredSize.height = value;
			this.dispatchEvent({ type: "change" });
		}
	}
	/**
	* Returns the preferred height.
	*
	* @deprecated Use preferredHeight instead.
	* @return {Number} The preferred height.
	*/
	getPreferredHeight() {
		return this.preferredHeight;
	}
	/**
	* Sets the preferred height.
	*
	* Use {@link Resizer.AUTO_SIZE} to automatically calculate the height based on the width and aspect ratio.
	*
	* @deprecated Use preferredHeight instead.
	* @param {Number} value - The height.
	*/
	setPreferredHeight(value) {
		this.preferredHeight = value;
	}
	/**
	* Sets the preferred size.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setPreferredSize(width, height) {
		if (this.preferredSize.width !== width || this.preferredSize.height !== height) {
			this.preferredSize.set(width, height);
			this.dispatchEvent({ type: "change" });
		}
	}
	/**
	* Copies the given resolution.
	*
	* @param {Resolution} resolution - The resolution.
	*/
	copy(resolution) {
		this.s = resolution.scale;
		this.baseSize.set(resolution.baseWidth, resolution.baseHeight);
		this.preferredSize.set(resolution.preferredWidth, resolution.preferredHeight);
		this.dispatchEvent({ type: "change" });
	}
	/**
	* An auto sizing constant.
	*
	* Can be used to automatically calculate the width or height based on the original aspect ratio.
	*
	* @type {Number}
	*/
	static get AUTO_SIZE() {
		return AUTO_SIZE;
	}
};
var BlendFunction = {
	SKIP: 9,
	SET: 30,
	ADD: 0,
	ALPHA: 1,
	AVERAGE: 2,
	COLOR: 3,
	COLOR_BURN: 4,
	COLOR_DODGE: 5,
	DARKEN: 6,
	DIFFERENCE: 7,
	DIVIDE: 8,
	DST: 9,
	EXCLUSION: 10,
	HARD_LIGHT: 11,
	HARD_MIX: 12,
	HUE: 13,
	INVERT: 14,
	INVERT_RGB: 15,
	LIGHTEN: 16,
	LINEAR_BURN: 17,
	LINEAR_DODGE: 18,
	LINEAR_LIGHT: 19,
	LUMINOSITY: 20,
	MULTIPLY: 21,
	NEGATION: 22,
	NORMAL: 23,
	OVERLAY: 24,
	PIN_LIGHT: 25,
	REFLECT: 26,
	SATURATION: 27,
	SCREEN: 28,
	SOFT_LIGHT: 29,
	SRC: 30,
	SUBTRACT: 31,
	VIVID_LIGHT: 32
};
var blendFunctions = /* @__PURE__ */ new Map([
	[BlendFunction.ADD, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.ALPHA, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,src.a*opacity);}`],
	[BlendFunction.AVERAGE, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=(dst.rgb+src.rgb)*0.5;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.COLOR, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.xy,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.COLOR_BURN, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=mix(step(0.0,b)*(1.0-min(vec3(1.0),(1.0-a)/max(b,1e-9))),vec3(1.0),step(1.0,a));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.COLOR_DODGE, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=step(0.0,a)*mix(min(vec3(1.0),a/max(1.0-b,1e-9)),vec3(1.0),step(1.0,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.DARKEN, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.DIFFERENCE, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=abs(dst.rgb-src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.DIVIDE, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb/max(src.rgb,1e-9);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.DST, null],
	[BlendFunction.EXCLUSION, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-2.0*dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.HARD_LIGHT, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb,1.0);vec3 b=min(src.rgb,1.0);vec3 c=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.HARD_MIX, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=step(1.0,dst.rgb+src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.HUE, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.x,a.yz));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.INVERT, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.INVERT_RGB, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=src.rgb*max(1.0-dst.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.LIGHTEN, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.LINEAR_BURN, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.LINEAR_DODGE, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb+src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.LINEAR_LIGHT, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(2.0*src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.LUMINOSITY, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.xy,b.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.MULTIPLY, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.NEGATION, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-abs(1.0-dst.rgb-src.rgb),0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.NORMAL, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,opacity);}`],
	[BlendFunction.OVERLAY, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=2.0*src.rgb*dst.rgb;vec3 b=1.0-2.0*(1.0-src.rgb)*(1.0-dst.rgb);vec3 c=mix(a,b,step(0.5,dst.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.PIN_LIGHT, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 c=mix(mix(src2,dst.rgb,step(0.5*dst.rgb,src.rgb)),max(src2-1.0,vec3(0.0)),step(dst.rgb,src2-1.0));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.REFLECT, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb*dst.rgb/max(1.0-src.rgb,1e-9),1.0);vec3 c=mix(a,src.rgb,step(1.0,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.SATURATION, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.x,b.y,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.SCREEN, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-min(dst.rgb*src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.SOFT_LIGHT, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 d=dst.rgb+(src2-1.0);vec3 w=step(0.5,src.rgb);vec3 a=dst.rgb-(1.0-src2)*dst.rgb*(1.0-dst.rgb);vec3 b=mix(d*(sqrt(dst.rgb)-dst.rgb),d*dst.rgb*((16.0*dst.rgb-12.0)*dst.rgb+3.0),w*(1.0-step(0.25,dst.rgb)));vec3 c=mix(a,b,w);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.SRC, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return src;}`],
	[BlendFunction.SUBTRACT, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`],
	[BlendFunction.VIVID_LIGHT, `vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=mix(max(1.0-min((1.0-dst.rgb)/(2.0*src.rgb),1.0),0.0),min(dst.rgb/(2.0*(1.0-src.rgb)),1.0),step(0.5,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}`]
]);
var BlendMode = class extends EventDispatcher {
	/**
	* Constructs a new blend mode.
	*
	* @param {BlendFunction} blendFunction - The blend function.
	* @param {Number} opacity - The opacity of the color that will be blended with the base color.
	*/
	constructor(blendFunction, opacity = 1) {
		super();
		this._blendFunction = blendFunction;
		this.opacity = new Uniform(opacity);
	}
	/**
	* Returns the opacity.
	*
	* @return {Number} The opacity.
	*/
	getOpacity() {
		return this.opacity.value;
	}
	/**
	* Sets the opacity.
	*
	* @param {Number} value - The opacity.
	*/
	setOpacity(value) {
		this.opacity.value = value;
	}
	/**
	* The blend function.
	*
	* @type {BlendFunction}
	*/
	get blendFunction() {
		return this._blendFunction;
	}
	set blendFunction(value) {
		this._blendFunction = value;
		this.dispatchEvent({ type: "change" });
	}
	/**
	* Returns the blend function.
	*
	* @deprecated Use blendFunction instead.
	* @return {BlendFunction} The blend function.
	*/
	getBlendFunction() {
		return this.blendFunction;
	}
	/**
	* Sets the blend function.
	*
	* @deprecated Use blendFunction instead.
	* @param {BlendFunction} value - The blend function.
	*/
	setBlendFunction(value) {
		this.blendFunction = value;
	}
	/**
	* Returns the blend function shader code.
	*
	* @return {String} The blend function shader code.
	*/
	getShaderCode() {
		return blendFunctions.get(this.blendFunction);
	}
};
var Effect = class extends EventDispatcher {
	/**
	* Constructs a new effect.
	*
	* @param {String} name - The name of this effect. Doesn't have to be unique.
	* @param {String} fragmentShader - The fragment shader. This shader is required.
	* @param {Object} [options] - Additional options.
	* @param {EffectAttribute} [options.attributes=EffectAttribute.NONE] - The effect attributes that determine the execution priority and resource requirements.
	* @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
	* @param {Map<String, String>} [options.defines] - Custom preprocessor macro definitions. Keys are names and values are code.
	* @param {Map<String, Uniform>} [options.uniforms] - Custom shader uniforms. Keys are names and values are uniforms.
	* @param {Set<WebGLExtension>} [options.extensions] - WebGL extensions.
	* @param {String} [options.vertexShader=null] - The vertex shader. Most effects don't need one.
	*/
	constructor(name, fragmentShader, { attributes = EffectAttribute.NONE, blendFunction = BlendFunction.NORMAL, defines = /* @__PURE__ */ new Map(), uniforms = /* @__PURE__ */ new Map(), extensions = null, vertexShader = null } = {}) {
		super();
		this.name = name;
		this.renderer = null;
		this.attributes = attributes;
		this.fragmentShader = fragmentShader;
		this.vertexShader = vertexShader;
		this.defines = defines;
		this.uniforms = uniforms;
		this.extensions = extensions;
		this.blendMode = new BlendMode(blendFunction);
		this.blendMode.addEventListener("change", (event) => this.setChanged());
		this._inputColorSpace = LinearSRGBColorSpace;
		this._outputColorSpace = "";
	}
	/**
	* The input color space.
	*
	* @type {ColorSpace}
	* @experimental
	*/
	get inputColorSpace() {
		return this._inputColorSpace;
	}
	/**
	* @type {ColorSpace}
	* @protected
	* @experimental
	*/
	set inputColorSpace(value) {
		this._inputColorSpace = value;
		this.setChanged();
	}
	/**
	* The output color space.
	*
	* Should only be changed if this effect converts the input colors to a different color space.
	*
	* @type {ColorSpace}
	* @experimental
	*/
	get outputColorSpace() {
		return this._outputColorSpace;
	}
	/**
	* @type {ColorSpace}
	* @protected
	* @experimental
	*/
	set outputColorSpace(value) {
		this._outputColorSpace = value;
		this.setChanged();
	}
	/**
	* Sets the main scene.
	*
	* @type {Scene}
	*/
	set mainScene(value) {}
	/**
	* Sets the main camera.
	*
	* @type {Camera}
	*/
	set mainCamera(value) {}
	/**
	* Returns the name of this effect.
	*
	* @deprecated Use name instead.
	* @return {String} The name.
	*/
	getName() {
		return this.name;
	}
	/**
	* Sets the renderer.
	*
	* @deprecated
	* @param {WebGLRenderer} renderer - The renderer.
	*/
	setRenderer(renderer) {
		this.renderer = renderer;
	}
	/**
	* Returns the preprocessor macro definitions.
	*
	* @deprecated Use defines instead.
	* @return {Map<String, String>} The extensions.
	*/
	getDefines() {
		return this.defines;
	}
	/**
	* Returns the uniforms of this effect.
	*
	* @deprecated Use uniforms instead.
	* @return {Map<String, Uniform>} The extensions.
	*/
	getUniforms() {
		return this.uniforms;
	}
	/**
	* Returns the WebGL extensions that are required by this effect.
	*
	* @deprecated Use extensions instead.
	* @return {Set<WebGLExtension>} The extensions.
	*/
	getExtensions() {
		return this.extensions;
	}
	/**
	* Returns the blend mode.
	*
	* The result of this effect will be blended with the result of the previous effect using this blend mode.
	*
	* @deprecated Use blendMode instead.
	* @return {BlendMode} The blend mode.
	*/
	getBlendMode() {
		return this.blendMode;
	}
	/**
	* Returns the effect attributes.
	*
	* @return {EffectAttribute} The attributes.
	*/
	getAttributes() {
		return this.attributes;
	}
	/**
	* Sets the effect attributes.
	*
	* Effects that have the same attributes will be executed in the order in which they were registered. Some attributes
	* imply a higher priority.
	*
	* @protected
	* @param {EffectAttribute} attributes - The attributes.
	*/
	setAttributes(attributes) {
		this.attributes = attributes;
		this.setChanged();
	}
	/**
	* Returns the fragment shader.
	*
	* @return {String} The fragment shader.
	*/
	getFragmentShader() {
		return this.fragmentShader;
	}
	/**
	* Sets the fragment shader.
	*
	* @protected
	* @param {String} fragmentShader - The fragment shader.
	*/
	setFragmentShader(fragmentShader) {
		this.fragmentShader = fragmentShader;
		this.setChanged();
	}
	/**
	* Returns the vertex shader.
	*
	* @return {String} The vertex shader.
	*/
	getVertexShader() {
		return this.vertexShader;
	}
	/**
	* Sets the vertex shader.
	*
	* @protected
	* @param {String} vertexShader - The vertex shader.
	*/
	setVertexShader(vertexShader) {
		this.vertexShader = vertexShader;
		this.setChanged();
	}
	/**
	* Informs the associated {@link EffectPass} that this effect requires a shader recompilation.
	*
	* Should be called after changing macros or extensions and after adding/removing uniforms.
	*
	* @protected
	*/
	setChanged() {
		this.dispatchEvent({ type: "change" });
	}
	/**
	* Sets the depth texture.
	*
	* You may override this method if your effect requires direct access to the depth texture that is bound to the
	* associated {@link EffectPass}.
	*
	* @param {Texture} depthTexture - A depth texture.
	* @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
	*/
	setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {}
	/**
	* Updates this effect by performing supporting operations.
	*
	* This method is called by the {@link EffectPass} right before the main fullscreen render operation, even if the
	* blend function is set to `SKIP`.
	*
	* You may override this method if you need to update custom uniforms or render additional off-screen textures.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	*/
	update(renderer, inputBuffer, deltaTime) {}
	/**
	* Updates the size of this effect.
	*
	* You may override this method if you want to be informed about the size of the backbuffer/canvas.
	* This method is called before {@link initialize} and every time the size of the {@link EffectComposer} changes.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {}
	/**
	* Performs initialization tasks.
	*
	* This method is called when the associated {@link EffectPass} is added to an {@link EffectComposer}.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	* @example if(!alpha && frameBufferType === UnsignedByteType) { this.myRenderTarget.texture.format = RGBFormat; }
	*/
	initialize(renderer, alpha, frameBufferType) {}
	/**
	* Performs a shallow search for properties that define a dispose method and deletes them.
	*
	* The {@link EffectComposer} calls this method when it is being destroyed.
	*/
	dispose() {
		for (const key of Object.keys(this)) {
			const property = this[key];
			if (property instanceof WebGLRenderTarget || property instanceof Material || property instanceof Texture || property instanceof Pass) this[key].dispose();
		}
	}
};
var KernelSize = {
	VERY_SMALL: 0,
	SMALL: 1,
	MEDIUM: 2,
	LARGE: 3,
	VERY_LARGE: 4,
	HUGE: 5
};
var convolution_kawase_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;
#include <colorspace_fragment>
}`;
var convolution_kawase_default2 = `uniform vec4 texelSize;uniform float kernel;uniform float scale;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}`;
var kernelPresets = [
	new Float32Array([0, 0]),
	new Float32Array([
		0,
		1,
		1
	]),
	new Float32Array([
		0,
		1,
		1,
		2
	]),
	new Float32Array([
		0,
		1,
		2,
		2,
		3
	]),
	new Float32Array([
		0,
		1,
		2,
		3,
		4,
		4,
		5
	]),
	new Float32Array([
		0,
		1,
		2,
		3,
		4,
		5,
		7,
		8,
		9,
		10
	])
];
var KawaseBlurMaterial = class extends ShaderMaterial {
	/**
	* Constructs a new convolution material.
	*
	* TODO Remove texelSize param.
	* @param {Vector4} [texelSize] - Deprecated.
	*/
	constructor(texelSize = new Vector4()) {
		super({
			name: "KawaseBlurMaterial",
			uniforms: {
				inputBuffer: new Uniform(null),
				texelSize: new Uniform(new Vector4()),
				scale: new Uniform(1),
				kernel: new Uniform(0)
			},
			blending: 0,
			toneMapped: false,
			depthWrite: false,
			depthTest: false,
			fragmentShader: convolution_kawase_default,
			vertexShader: convolution_kawase_default2
		});
		this.setTexelSize(texelSize.x, texelSize.y);
		this.kernelSize = KernelSize.MEDIUM;
	}
	/**
	* The input buffer.
	*
	* @type {Texture}
	*/
	set inputBuffer(value) {
		this.uniforms.inputBuffer.value = value;
	}
	/**
	* Sets the input buffer.
	*
	* @deprecated Use inputBuffer instead.
	* @param {Texture} value - The input buffer.
	*/
	setInputBuffer(value) {
		this.inputBuffer = value;
	}
	/**
	* The kernel sequence for the current kernel size.
	*
	* @type {Float32Array}
	*/
	get kernelSequence() {
		return kernelPresets[this.kernelSize];
	}
	/**
	* The blur scale.
	*
	* @type {Number}
	*/
	get scale() {
		return this.uniforms.scale.value;
	}
	set scale(value) {
		this.uniforms.scale.value = value;
	}
	/**
	* Returns the blur scale.
	*
	* @deprecated Use scale instead.
	* @return {Number} The scale.
	*/
	getScale() {
		return this.uniforms.scale.value;
	}
	/**
	* Sets the blur scale.
	*
	* @deprecated Use scale instead.
	* @return {Number} value - The scale.
	*/
	setScale(value) {
		this.uniforms.scale.value = value;
	}
	/**
	* Returns the kernel.
	*
	* @return {Float32Array} The kernel.
	* @deprecated Implementation detail, removed with no replacement.
	*/
	getKernel() {
		return null;
	}
	/**
	* The current kernel.
	*
	* @type {Number}
	*/
	get kernel() {
		return this.uniforms.kernel.value;
	}
	set kernel(value) {
		this.uniforms.kernel.value = value;
	}
	/**
	* Sets the current kernel.
	*
	* @deprecated Use kernel instead.
	* @param {Number} value - The kernel.
	*/
	setKernel(value) {
		this.kernel = value;
	}
	/**
	* Sets the texel size.
	*
	* @deprecated Use setSize() instead.
	* @param {Number} x - The texel width.
	* @param {Number} y - The texel height.
	*/
	setTexelSize(x, y) {
		this.uniforms.texelSize.value.set(x, y, x * .5, y * .5);
	}
	/**
	* Sets the size of this object.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		const x = 1 / width, y = 1 / height;
		this.uniforms.texelSize.value.set(x, y, x * .5, y * .5);
	}
};
var KawaseBlurPass = class extends Pass {
	/**
	* Constructs a new Kawase blur pass.
	*
	* @param {Object} [options] - The options.
	* @param {KernelSize} [options.kernelSize=KernelSize.MEDIUM] - The blur kernel size.
	* @param {Number} [options.resolutionScale=0.5] - The resolution scale.
	* @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
	* @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
	* @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
	* @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
	*/
	constructor({ kernelSize = KernelSize.MEDIUM, resolutionScale = .5, width = Resolution.AUTO_SIZE, height = Resolution.AUTO_SIZE, resolutionX = width, resolutionY = height } = {}) {
		super("KawaseBlurPass");
		this.renderTargetA = new WebGLRenderTarget(1, 1, { depthBuffer: false });
		this.renderTargetA.texture.name = "Blur.Target.A";
		this.renderTargetB = this.renderTargetA.clone();
		this.renderTargetB.texture.name = "Blur.Target.B";
		const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
		resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
		this._blurMaterial = new KawaseBlurMaterial();
		this._blurMaterial.kernelSize = kernelSize;
		this.copyMaterial = new CopyMaterial();
	}
	/**
	* Returns the resolution settings.
	*
	* @deprecated Use resolution instead.
	* @return {Resolution} The resolution.
	*/
	getResolution() {
		return this.resolution;
	}
	/**
	* The blur material.
	*
	* @type {KawaseBlurMaterial}
	*/
	get blurMaterial() {
		return this._blurMaterial;
	}
	/**
	* The blur material.
	*
	* @type {KawaseBlurMaterial}
	* @protected
	*/
	set blurMaterial(value) {
		this._blurMaterial = value;
	}
	/**
	* Indicates whether dithering is enabled.
	*
	* @type {Boolean}
	* @deprecated Use copyMaterial.dithering instead.
	*/
	get dithering() {
		return this.copyMaterial.dithering;
	}
	set dithering(value) {
		this.copyMaterial.dithering = value;
	}
	/**
	* The kernel size.
	*
	* @type {KernelSize}
	* @deprecated Use blurMaterial.kernelSize instead.
	*/
	get kernelSize() {
		return this.blurMaterial.kernelSize;
	}
	set kernelSize(value) {
		this.blurMaterial.kernelSize = value;
	}
	/**
	* The current width of the internal render targets.
	*
	* @type {Number}
	* @deprecated Use resolution.width instead.
	*/
	get width() {
		return this.resolution.width;
	}
	/**
	* Sets the render width.
	*
	* @type {Number}
	* @deprecated Use resolution.preferredWidth instead.
	*/
	set width(value) {
		this.resolution.preferredWidth = value;
	}
	/**
	* The current height of the internal render targets.
	*
	* @type {Number}
	* @deprecated Use resolution.height instead.
	*/
	get height() {
		return this.resolution.height;
	}
	/**
	* Sets the render height.
	*
	* @type {Number}
	* @deprecated Use resolution.preferredHeight instead.
	*/
	set height(value) {
		this.resolution.preferredHeight = value;
	}
	/**
	* The current blur scale.
	*
	* @type {Number}
	* @deprecated Use blurMaterial.scale instead.
	*/
	get scale() {
		return this.blurMaterial.scale;
	}
	set scale(value) {
		this.blurMaterial.scale = value;
	}
	/**
	* Returns the current blur scale.
	*
	* @deprecated Use blurMaterial.scale instead.
	* @return {Number} The scale.
	*/
	getScale() {
		return this.blurMaterial.scale;
	}
	/**
	* Sets the blur scale.
	*
	* @deprecated Use blurMaterial.scale instead.
	* @param {Number} value - The scale.
	*/
	setScale(value) {
		this.blurMaterial.scale = value;
	}
	/**
	* Returns the kernel size.
	*
	* @deprecated Use blurMaterial.kernelSize instead.
	* @return {KernelSize} The kernel size.
	*/
	getKernelSize() {
		return this.kernelSize;
	}
	/**
	* Sets the kernel size.
	*
	* Larger kernels require more processing power but scale well with larger render resolutions.
	*
	* @deprecated Use blurMaterial.kernelSize instead.
	* @param {KernelSize} value - The kernel size.
	*/
	setKernelSize(value) {
		this.kernelSize = value;
	}
	/**
	* Returns the current resolution scale.
	*
	* @return {Number} The resolution scale.
	* @deprecated Use resolution instead.
	*/
	getResolutionScale() {
		return this.resolution.scale;
	}
	/**
	* Sets the resolution scale.
	*
	* @param {Number} scale - The new resolution scale.
	* @deprecated Use resolution instead.
	*/
	setResolutionScale(scale) {
		this.resolution.scale = scale;
	}
	/**
	* Renders the blur.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		const scene = this.scene;
		const camera = this.camera;
		const renderTargetA = this.renderTargetA;
		const renderTargetB = this.renderTargetB;
		const material = this.blurMaterial;
		const kernelSequence = material.kernelSequence;
		let previousBuffer = inputBuffer;
		this.fullscreenMaterial = material;
		for (let i = 0, l = kernelSequence.length; i < l; ++i) {
			const buffer = (i & 1) === 0 ? renderTargetA : renderTargetB;
			material.kernel = kernelSequence[i];
			material.inputBuffer = previousBuffer.texture;
			renderer.setRenderTarget(buffer);
			renderer.render(scene, camera);
			previousBuffer = buffer;
		}
		this.fullscreenMaterial = this.copyMaterial;
		this.copyMaterial.inputBuffer = previousBuffer.texture;
		renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
		renderer.render(scene, camera);
	}
	/**
	* Updates the size of this pass.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		const resolution = this.resolution;
		resolution.setBaseSize(width, height);
		const w = resolution.width, h = resolution.height;
		this.renderTargetA.setSize(w, h);
		this.renderTargetB.setSize(w, h);
		this.blurMaterial.setSize(width, height);
	}
	/**
	* Performs initialization tasks.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	*/
	initialize(renderer, alpha, frameBufferType) {
		if (frameBufferType !== void 0) {
			this.renderTargetA.texture.type = frameBufferType;
			this.renderTargetB.texture.type = frameBufferType;
			if (frameBufferType !== 1009) {
				this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
				this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
			} else if (renderer !== null && renderer.outputColorSpace === "srgb") {
				this.renderTargetA.texture.colorSpace = SRGBColorSpace;
				this.renderTargetB.texture.colorSpace = SRGBColorSpace;
			}
		}
	}
	/**
	* An auto sizing flag.
	*
	* @type {Number}
	* @deprecated Use {@link Resolution.AUTO_SIZE} instead.
	*/
	static get AUTO_SIZE() {
		return Resolution.AUTO_SIZE;
	}
};
var luminance_default = `#include <common>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#ifdef RANGE
uniform vec2 range;
#elif defined(THRESHOLD)
uniform float threshold;uniform float smoothing;
#endif
varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);float l=luminance(texel.rgb);float mask=1.0;
#ifdef RANGE
float low=step(range.x,l);float high=step(l,range.y);mask=low*high;
#elif defined(THRESHOLD)
mask=smoothstep(threshold,threshold+smoothing,l);
#endif
#ifdef COLOR
gl_FragColor=texel*mask;
#else
gl_FragColor=vec4(l*mask);
#endif
}`;
var LuminanceMaterial = class extends ShaderMaterial {
	/**
	* Constructs a new luminance material.
	*
	* @param {Boolean} [colorOutput=false] - Defines whether the shader should output colors scaled with their luminance value.
	* @param {Vector2} [luminanceRange] - If provided, the shader will mask out texels that aren't in the specified luminance range.
	*/
	constructor(colorOutput = false, luminanceRange = null) {
		super({
			name: "LuminanceMaterial",
			defines: { THREE_REVISION: "184".replace(/\D+/g, "") },
			uniforms: {
				inputBuffer: new Uniform(null),
				threshold: new Uniform(0),
				smoothing: new Uniform(1),
				range: new Uniform(null)
			},
			blending: 0,
			toneMapped: false,
			depthWrite: false,
			depthTest: false,
			fragmentShader: luminance_default,
			vertexShader: common_default
		});
		this.colorOutput = colorOutput;
		this.luminanceRange = luminanceRange;
	}
	/**
	* The input buffer.
	*
	* @type {Texture}
	*/
	set inputBuffer(value) {
		this.uniforms.inputBuffer.value = value;
	}
	/**
	* Sets the input buffer.
	*
	* @deprecated Use inputBuffer instead.
	* @param {Texture} value - The input buffer.
	*/
	setInputBuffer(value) {
		this.uniforms.inputBuffer.value = value;
	}
	/**
	* The luminance threshold.
	*
	* @type {Number}
	*/
	get threshold() {
		return this.uniforms.threshold.value;
	}
	set threshold(value) {
		if (this.smoothing > 0 || value > 0) this.defines.THRESHOLD = "1";
		else delete this.defines.THRESHOLD;
		this.uniforms.threshold.value = value;
	}
	/**
	* Returns the luminance threshold.
	*
	* @deprecated Use threshold instead.
	* @return {Number} The threshold.
	*/
	getThreshold() {
		return this.threshold;
	}
	/**
	* Sets the luminance threshold.
	*
	* @deprecated Use threshold instead.
	* @param {Number} value - The threshold.
	*/
	setThreshold(value) {
		this.threshold = value;
	}
	/**
	* The luminance threshold smoothing.
	*
	* @type {Number}
	*/
	get smoothing() {
		return this.uniforms.smoothing.value;
	}
	set smoothing(value) {
		if (this.threshold > 0 || value > 0) this.defines.THRESHOLD = "1";
		else delete this.defines.THRESHOLD;
		this.uniforms.smoothing.value = value;
	}
	/**
	* Returns the luminance threshold smoothing factor.
	*
	* @deprecated Use smoothing instead.
	* @return {Number} The smoothing factor.
	*/
	getSmoothingFactor() {
		return this.smoothing;
	}
	/**
	* Sets the luminance threshold smoothing factor.
	*
	* @deprecated Use smoothing instead.
	* @param {Number} value - The smoothing factor.
	*/
	setSmoothingFactor(value) {
		this.smoothing = value;
	}
	/**
	* Indicates whether the luminance threshold is enabled.
	*
	* @type {Boolean}
	* @deprecated Adjust the threshold or smoothing factor instead.
	*/
	get useThreshold() {
		return this.threshold > 0 || this.smoothing > 0;
	}
	set useThreshold(value) {}
	/**
	* Indicates whether color output is enabled.
	*
	* @type {Boolean}
	*/
	get colorOutput() {
		return this.defines.COLOR !== void 0;
	}
	set colorOutput(value) {
		if (value) this.defines.COLOR = "1";
		else delete this.defines.COLOR;
		this.needsUpdate = true;
	}
	/**
	* Indicates whether color output is enabled.
	*
	* @deprecated Use colorOutput instead.
	* @return {Boolean} Whether color output is enabled.
	*/
	isColorOutputEnabled(value) {
		return this.colorOutput;
	}
	/**
	* Enables or disables color output.
	*
	* @deprecated Use colorOutput instead.
	* @param {Boolean} value - Whether color output should be enabled.
	*/
	setColorOutputEnabled(value) {
		this.colorOutput = value;
	}
	/**
	* Indicates whether luminance masking is enabled.
	*
	* @type {Boolean}
	* @deprecated
	*/
	get useRange() {
		return this.luminanceRange !== null;
	}
	set useRange(value) {
		this.luminanceRange = null;
	}
	/**
	* The luminance range. Set to null to disable.
	*
	* @type {Boolean}
	*/
	get luminanceRange() {
		return this.uniforms.range.value;
	}
	set luminanceRange(value) {
		if (value !== null) this.defines.RANGE = "1";
		else delete this.defines.RANGE;
		this.uniforms.range.value = value;
		this.needsUpdate = true;
	}
	/**
	* Returns the current luminance range.
	*
	* @deprecated Use luminanceRange instead.
	* @return {Vector2} The luminance range.
	*/
	getLuminanceRange() {
		return this.luminanceRange;
	}
	/**
	* Sets a luminance range. Set to null to disable.
	*
	* @deprecated Use luminanceRange instead.
	* @param {Vector2} value - The luminance range.
	*/
	setLuminanceRange(value) {
		this.luminanceRange = value;
	}
};
var LuminancePass = class extends Pass {
	/**
	* Constructs a new luminance pass.
	*
	* @param {Object} [options] - The options. See {@link LuminanceMaterial} for additional options.
	* @param {WebGLRenderTarget} [options.renderTarget] - A custom render target.
	* @param {Number} [options.resolutionScale=1.0] - The resolution scale.
	* @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
	* @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
	* @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
	* @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
	*/
	constructor({ renderTarget, luminanceRange, colorOutput, resolutionScale = 1, width = Resolution.AUTO_SIZE, height = Resolution.AUTO_SIZE, resolutionX = width, resolutionY = height } = {}) {
		super("LuminancePass");
		this.fullscreenMaterial = new LuminanceMaterial(colorOutput, luminanceRange);
		this.needsSwap = false;
		this.renderTarget = renderTarget;
		if (this.renderTarget === void 0) {
			this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false });
			this.renderTarget.texture.name = "LuminancePass.Target";
		}
		const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
		resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
	}
	/**
	* The luminance texture.
	*
	* @type {Texture}
	*/
	get texture() {
		return this.renderTarget.texture;
	}
	/**
	* Returns the luminance texture.
	*
	* @deprecated Use texture instead.
	* @return {Texture} The texture.
	*/
	getTexture() {
		return this.renderTarget.texture;
	}
	/**
	* Returns the resolution settings.
	*
	* @deprecated Use resolution instead.
	* @return {Resolution} The resolution.
	*/
	getResolution() {
		return this.resolution;
	}
	/**
	* Renders the luminance.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		const material = this.fullscreenMaterial;
		material.inputBuffer = inputBuffer.texture;
		renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
		renderer.render(this.scene, this.camera);
	}
	/**
	* Updates the size of this pass.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		const resolution = this.resolution;
		resolution.setBaseSize(width, height);
		this.renderTarget.setSize(resolution.width, resolution.height);
	}
	/**
	* Performs initialization tasks.
	*
	* @param {WebGLRenderer} renderer - A renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	*/
	initialize(renderer, alpha, frameBufferType) {
		if (frameBufferType !== void 0 && frameBufferType !== 1009) {
			this.renderTarget.texture.type = frameBufferType;
			this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
		}
	}
};
var convolution_downsampling_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#define WEIGHT_INNER 0.125
#define WEIGHT_OUTER 0.05556
varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;float clampToBorder(const in vec2 uv){return float(uv.s>=0.0&&uv.s<=1.0&&uv.t>=0.0&&uv.t<=1.0);}void main(){vec4 c=vec4(0.0);vec4 w=WEIGHT_INNER*vec4(clampToBorder(vUv00),clampToBorder(vUv01),clampToBorder(vUv02),clampToBorder(vUv03));c+=w.x*texture2D(inputBuffer,vUv00);c+=w.y*texture2D(inputBuffer,vUv01);c+=w.z*texture2D(inputBuffer,vUv02);c+=w.w*texture2D(inputBuffer,vUv03);w=WEIGHT_OUTER*vec4(clampToBorder(vUv04),clampToBorder(vUv05),clampToBorder(vUv06),clampToBorder(vUv07));c+=w.x*texture2D(inputBuffer,vUv04);c+=w.y*texture2D(inputBuffer,vUv05);c+=w.z*texture2D(inputBuffer,vUv06);c+=w.w*texture2D(inputBuffer,vUv07);w=WEIGHT_OUTER*vec4(clampToBorder(vUv08),clampToBorder(vUv09),clampToBorder(vUv10),clampToBorder(vUv11));c+=w.x*texture2D(inputBuffer,vUv08);c+=w.y*texture2D(inputBuffer,vUv09);c+=w.z*texture2D(inputBuffer,vUv10);c+=w.w*texture2D(inputBuffer,vUv11);c+=WEIGHT_OUTER*texture2D(inputBuffer,vUv);gl_FragColor=c;
#include <colorspace_fragment>
}`;
var convolution_downsampling_default2 = `uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;void main(){vUv=position.xy*0.5+0.5;vUv00=vUv+texelSize*vec2(-1.0,1.0);vUv01=vUv+texelSize*vec2(1.0,1.0);vUv02=vUv+texelSize*vec2(-1.0,-1.0);vUv03=vUv+texelSize*vec2(1.0,-1.0);vUv04=vUv+texelSize*vec2(-2.0,2.0);vUv05=vUv+texelSize*vec2(0.0,2.0);vUv06=vUv+texelSize*vec2(2.0,2.0);vUv07=vUv+texelSize*vec2(-2.0,0.0);vUv08=vUv+texelSize*vec2(2.0,0.0);vUv09=vUv+texelSize*vec2(-2.0,-2.0);vUv10=vUv+texelSize*vec2(0.0,-2.0);vUv11=vUv+texelSize*vec2(2.0,-2.0);gl_Position=vec4(position.xy,1.0,1.0);}`;
var DownsamplingMaterial = class extends ShaderMaterial {
	/**
	* Constructs a new downsampling material.
	*/
	constructor() {
		super({
			name: "DownsamplingMaterial",
			uniforms: {
				inputBuffer: new Uniform(null),
				texelSize: new Uniform(new Vector2())
			},
			blending: 0,
			toneMapped: false,
			depthWrite: false,
			depthTest: false,
			fragmentShader: convolution_downsampling_default,
			vertexShader: convolution_downsampling_default2
		});
	}
	/**
	* The input buffer.
	*
	* @type {Texture}
	*/
	set inputBuffer(value) {
		this.uniforms.inputBuffer.value = value;
	}
	/**
	* Sets the size of this object.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		this.uniforms.texelSize.value.set(1 / width, 1 / height);
	}
};
var convolution_upsampling_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;uniform mediump sampler2D supportBuffer;
#else
uniform lowp sampler2D inputBuffer;uniform lowp sampler2D supportBuffer;
#endif
uniform float radius;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vec4 c=vec4(0.0);c+=texture2D(inputBuffer,vUv0)*0.0625;c+=texture2D(inputBuffer,vUv1)*0.125;c+=texture2D(inputBuffer,vUv2)*0.0625;c+=texture2D(inputBuffer,vUv3)*0.125;c+=texture2D(inputBuffer,vUv)*0.25;c+=texture2D(inputBuffer,vUv4)*0.125;c+=texture2D(inputBuffer,vUv5)*0.0625;c+=texture2D(inputBuffer,vUv6)*0.125;c+=texture2D(inputBuffer,vUv7)*0.0625;vec4 baseColor=texture2D(supportBuffer,vUv);gl_FragColor=mix(baseColor,c,radius);
#include <colorspace_fragment>
}`;
var convolution_upsampling_default2 = `uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,1.0);vUv1=vUv+texelSize*vec2(0.0,1.0);vUv2=vUv+texelSize*vec2(1.0,1.0);vUv3=vUv+texelSize*vec2(-1.0,0.0);vUv4=vUv+texelSize*vec2(1.0,0.0);vUv5=vUv+texelSize*vec2(-1.0,-1.0);vUv6=vUv+texelSize*vec2(0.0,-1.0);vUv7=vUv+texelSize*vec2(1.0,-1.0);gl_Position=vec4(position.xy,1.0,1.0);}`;
var UpsamplingMaterial = class extends ShaderMaterial {
	/**
	* Constructs a new upsampling material.
	*/
	constructor() {
		super({
			name: "UpsamplingMaterial",
			uniforms: {
				inputBuffer: new Uniform(null),
				supportBuffer: new Uniform(null),
				texelSize: new Uniform(new Vector2()),
				radius: new Uniform(.85)
			},
			blending: 0,
			toneMapped: false,
			depthWrite: false,
			depthTest: false,
			fragmentShader: convolution_upsampling_default,
			vertexShader: convolution_upsampling_default2
		});
	}
	/**
	* The input buffer.
	*
	* @type {Texture}
	*/
	set inputBuffer(value) {
		this.uniforms.inputBuffer.value = value;
	}
	/**
	* A support buffer.
	*
	* @type {Texture}
	*/
	set supportBuffer(value) {
		this.uniforms.supportBuffer.value = value;
	}
	/**
	* The blur radius.
	*
	* @type {Number}
	*/
	get radius() {
		return this.uniforms.radius.value;
	}
	set radius(value) {
		this.uniforms.radius.value = value;
	}
	/**
	* Sets the size of this object.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		this.uniforms.texelSize.value.set(1 / width, 1 / height);
	}
};
var MipmapBlurPass = class extends Pass {
	/**
	* Constructs a new mipmap blur pass.
	*
	* @param {Object} [options] - The options.
	*/
	constructor() {
		super("MipmapBlurPass");
		this.needsSwap = false;
		this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false });
		this.renderTarget.texture.name = "Upsampling.Mipmap0";
		this.downsamplingMipmaps = [];
		this.upsamplingMipmaps = [];
		this.downsamplingMaterial = new DownsamplingMaterial();
		this.upsamplingMaterial = new UpsamplingMaterial();
		this.resolution = new Vector2();
	}
	/**
	* A texture that contains the blurred result.
	*
	* @type {Texture}
	*/
	get texture() {
		return this.renderTarget.texture;
	}
	/**
	* The MIP levels. Default is 8.
	*
	* @type {Number}
	*/
	get levels() {
		return this.downsamplingMipmaps.length;
	}
	set levels(value) {
		if (this.levels !== value) {
			const renderTarget = this.renderTarget;
			this.dispose();
			this.downsamplingMipmaps = [];
			this.upsamplingMipmaps = [];
			for (let i = 0; i < value; ++i) {
				const mipmap = renderTarget.clone();
				mipmap.texture.name = "Downsampling.Mipmap" + i;
				this.downsamplingMipmaps.push(mipmap);
			}
			this.upsamplingMipmaps.push(renderTarget);
			for (let i = 1, l = value - 1; i < l; ++i) {
				const mipmap = renderTarget.clone();
				mipmap.texture.name = "Upsampling.Mipmap" + i;
				this.upsamplingMipmaps.push(mipmap);
			}
			this.setSize(this.resolution.x, this.resolution.y);
		}
	}
	/**
	* The blur radius.
	*
	* @type {Number}
	*/
	get radius() {
		return this.upsamplingMaterial.radius;
	}
	set radius(value) {
		this.upsamplingMaterial.radius = value;
	}
	/**
	* Renders the blur.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		const { scene, camera } = this;
		const { downsamplingMaterial, upsamplingMaterial } = this;
		const { downsamplingMipmaps, upsamplingMipmaps } = this;
		let previousBuffer = inputBuffer;
		this.fullscreenMaterial = downsamplingMaterial;
		for (let i = 0, l = downsamplingMipmaps.length; i < l; ++i) {
			const mipmap = downsamplingMipmaps[i];
			downsamplingMaterial.setSize(previousBuffer.width, previousBuffer.height);
			downsamplingMaterial.inputBuffer = previousBuffer.texture;
			renderer.setRenderTarget(mipmap);
			renderer.render(scene, camera);
			previousBuffer = mipmap;
		}
		this.fullscreenMaterial = upsamplingMaterial;
		for (let i = upsamplingMipmaps.length - 1; i >= 0; --i) {
			const mipmap = upsamplingMipmaps[i];
			upsamplingMaterial.setSize(previousBuffer.width, previousBuffer.height);
			upsamplingMaterial.inputBuffer = previousBuffer.texture;
			upsamplingMaterial.supportBuffer = downsamplingMipmaps[i].texture;
			renderer.setRenderTarget(mipmap);
			renderer.render(scene, camera);
			previousBuffer = mipmap;
		}
	}
	/**
	* Updates the size of this pass.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		const resolution = this.resolution;
		resolution.set(width, height);
		let w = resolution.width, h = resolution.height;
		for (let i = 0, l = this.downsamplingMipmaps.length; i < l; ++i) {
			w = Math.round(w * .5);
			h = Math.round(h * .5);
			this.downsamplingMipmaps[i].setSize(w, h);
			if (i < this.upsamplingMipmaps.length) this.upsamplingMipmaps[i].setSize(w, h);
		}
	}
	/**
	* Performs initialization tasks.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	*/
	initialize(renderer, alpha, frameBufferType) {
		if (frameBufferType !== void 0) {
			const mipmaps = this.downsamplingMipmaps.concat(this.upsamplingMipmaps);
			for (const mipmap of mipmaps) mipmap.texture.type = frameBufferType;
			if (frameBufferType !== 1009) {
				this.downsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
				this.upsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
			} else if (renderer !== null && renderer.outputColorSpace === "srgb") for (const mipmap of mipmaps) mipmap.texture.colorSpace = SRGBColorSpace;
		}
	}
	/**
	* Deletes internal render targets and textures.
	*/
	dispose() {
		super.dispose();
		for (const mipmap of this.downsamplingMipmaps.concat(this.upsamplingMipmaps)) mipmap.dispose();
	}
};
var bloom_default = `#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
uniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=texture2D(map,uv)*intensity;}`;
var BloomEffect = class extends Effect {
	/**
	* Constructs a new bloom effect.
	*
	* @param {Object} [options] - The options.
	* @param {BlendFunction} [options.blendFunction=BlendFunction.SCREEN] - The blend function of this effect.
	* @param {Number} [options.luminanceThreshold=1.0] - The luminance threshold. Raise this value to mask out darker elements in the scene.
	* @param {Number} [options.luminanceSmoothing=0.03] - Controls the smoothness of the luminance threshold.
	* @param {Boolean} [options.mipmapBlur=true] - Enables or disables mipmap blur.
	* @param {Number} [options.intensity=1.0] - The bloom intensity.
	* @param {Number} [options.radius=0.85] - The blur radius. Only applies to mipmap blur.
	* @param {Number} [options.levels=8] - The amount of MIP levels. Only applies to mipmap blur.
	* @param {KernelSize} [options.kernelSize=KernelSize.LARGE] - Deprecated. Use mipmapBlur instead.
	* @param {Number} [options.resolutionScale=0.5] - Deprecated. Use mipmapBlur instead.
	* @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
	* @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
	* @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
	* @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use mipmapBlur instead.
	*/
	constructor({ blendFunction = BlendFunction.SCREEN, luminanceThreshold = 1, luminanceSmoothing = .03, mipmapBlur = true, intensity = 1, radius = .85, levels = 8, kernelSize = KernelSize.LARGE, resolutionScale = .5, width = Resolution.AUTO_SIZE, height = Resolution.AUTO_SIZE, resolutionX = width, resolutionY = height } = {}) {
		super("BloomEffect", bloom_default, {
			blendFunction,
			uniforms: /* @__PURE__ */ new Map([["map", new Uniform(null)], ["intensity", new Uniform(intensity)]])
		});
		this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false });
		this.renderTarget.texture.name = "Bloom.Target";
		this.blurPass = new KawaseBlurPass({ kernelSize });
		this.luminancePass = new LuminancePass({ colorOutput: true });
		this.luminanceMaterial.threshold = luminanceThreshold;
		this.luminanceMaterial.smoothing = luminanceSmoothing;
		this.mipmapBlurPass = new MipmapBlurPass();
		this.mipmapBlurPass.enabled = mipmapBlur;
		this.mipmapBlurPass.radius = radius;
		this.mipmapBlurPass.levels = levels;
		this.uniforms.get("map").value = mipmapBlur ? this.mipmapBlurPass.texture : this.renderTarget.texture;
		const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
		resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
	}
	/**
	* A texture that contains the intermediate result of this effect.
	*
	* @type {Texture}
	*/
	get texture() {
		return this.mipmapBlurPass.enabled ? this.mipmapBlurPass.texture : this.renderTarget.texture;
	}
	/**
	* Returns the generated bloom texture.
	*
	* @deprecated Use texture instead.
	* @return {Texture} The texture.
	*/
	getTexture() {
		return this.texture;
	}
	/**
	* Returns the resolution settings.
	*
	* @deprecated Use resolution instead.
	* @return {Resolution} The resolution.
	*/
	getResolution() {
		return this.resolution;
	}
	/**
	* Returns the blur pass.
	*
	* @deprecated
	* @return {KawaseBlurPass} The blur pass.
	*/
	getBlurPass() {
		return this.blurPass;
	}
	/**
	* Returns the luminance pass.
	*
	* @deprecated Use luminancePass instead.
	* @return {LuminancePass} The luminance pass.
	*/
	getLuminancePass() {
		return this.luminancePass;
	}
	/**
	* The luminance material.
	*
	* @type {LuminanceMaterial}
	*/
	get luminanceMaterial() {
		return this.luminancePass.fullscreenMaterial;
	}
	/**
	* Returns the luminance material.
	*
	* @deprecated Use luminanceMaterial instead.
	* @return {LuminanceMaterial} The material.
	*/
	getLuminanceMaterial() {
		return this.luminancePass.fullscreenMaterial;
	}
	/**
	* The current width of the internal render targets.
	*
	* @type {Number}
	* @deprecated
	*/
	get width() {
		return this.resolution.width;
	}
	set width(value) {
		this.resolution.preferredWidth = value;
	}
	/**
	* The current height of the internal render targets.
	*
	* @type {Number}
	* @deprecated
	*/
	get height() {
		return this.resolution.height;
	}
	set height(value) {
		this.resolution.preferredHeight = value;
	}
	/**
	* Indicates whether dithering is enabled.
	*
	* @type {Boolean}
	* @deprecated Use EffectPass.dithering instead.
	*/
	get dithering() {
		return this.blurPass.dithering;
	}
	set dithering(value) {
		this.blurPass.dithering = value;
	}
	/**
	* The blur kernel size.
	*
	* @type {KernelSize}
	* @deprecated
	*/
	get kernelSize() {
		return this.blurPass.kernelSize;
	}
	set kernelSize(value) {
		this.blurPass.kernelSize = value;
	}
	/**
	* @type {Number}
	* @deprecated
	*/
	get distinction() {
		console.warn(this.name, "distinction was removed");
		return 1;
	}
	set distinction(value) {
		console.warn(this.name, "distinction was removed");
	}
	/**
	* The bloom intensity.
	*
	* @type {Number}
	*/
	get intensity() {
		return this.uniforms.get("intensity").value;
	}
	set intensity(value) {
		this.uniforms.get("intensity").value = value;
	}
	/**
	* The bloom intensity.
	*
	* @deprecated Use intensity instead.
	* @return {Number} The intensity.
	*/
	getIntensity() {
		return this.intensity;
	}
	/**
	* Sets the bloom intensity.
	*
	* @deprecated Use intensity instead.
	* @param {Number} value - The intensity.
	*/
	setIntensity(value) {
		this.intensity = value;
	}
	/**
	* Returns the current resolution scale.
	*
	* @return {Number} The resolution scale.
	* @deprecated
	*/
	getResolutionScale() {
		return this.resolution.scale;
	}
	/**
	* Sets the resolution scale.
	*
	* @param {Number} scale - The new resolution scale.
	* @deprecated
	*/
	setResolutionScale(scale) {
		this.resolution.scale = scale;
	}
	/**
	* Updates this effect.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	*/
	update(renderer, inputBuffer, deltaTime) {
		const renderTarget = this.renderTarget;
		const luminancePass = this.luminancePass;
		if (luminancePass.enabled) {
			luminancePass.render(renderer, inputBuffer);
			if (this.mipmapBlurPass.enabled) this.mipmapBlurPass.render(renderer, luminancePass.renderTarget);
			else this.blurPass.render(renderer, luminancePass.renderTarget, renderTarget);
		} else if (this.mipmapBlurPass.enabled) this.mipmapBlurPass.render(renderer, inputBuffer);
		else this.blurPass.render(renderer, inputBuffer, renderTarget);
	}
	/**
	* Updates the size of internal render targets.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		const resolution = this.resolution;
		resolution.setBaseSize(width, height);
		this.renderTarget.setSize(resolution.width, resolution.height);
		this.blurPass.resolution.copy(resolution);
		this.luminancePass.setSize(width, height);
		this.mipmapBlurPass.setSize(width, height);
	}
	/**
	* Performs initialization tasks.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	*/
	initialize(renderer, alpha, frameBufferType) {
		this.blurPass.initialize(renderer, alpha, frameBufferType);
		this.luminancePass.initialize(renderer, alpha, frameBufferType);
		this.mipmapBlurPass.initialize(renderer, alpha, frameBufferType);
		if (frameBufferType !== void 0) {
			this.renderTarget.texture.type = frameBufferType;
			if (renderer !== null && renderer.outputColorSpace === "srgb") this.renderTarget.texture.colorSpace = SRGBColorSpace;
		}
	}
};
var chromatic_aberration_default = `#ifdef RADIAL_MODULATION
uniform float modulationOffset;
#endif
varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 ra=inputColor.ra;vec2 ba=inputColor.ba;
#ifdef RADIAL_MODULATION
const vec2 center=vec2(0.5);float d=distance(uv,center)*2.0;d=max(d-modulationOffset,0.0);if(vActive>0.0&&d>0.0){ra=texture2D(inputBuffer,mix(uv,vUvR,d)).ra;ba=texture2D(inputBuffer,mix(uv,vUvB,d)).ba;}
#else
if(vActive>0.0){ra=texture2D(inputBuffer,vUvR).ra;ba=texture2D(inputBuffer,vUvB).ba;}
#endif
outputColor=vec4(ra.x,inputColor.g,ba.x,max(max(ra.y,ba.y),inputColor.a));}`;
var chromatic_aberration_default2 = `uniform vec2 offset;varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainSupport(const in vec2 uv){vec2 shift=offset*vec2(1.0,aspect);vActive=(shift.x!=0.0||shift.y!=0.0)?1.0:0.0;vUvR=uv+shift;vUvB=uv-shift;}`;
var ChromaticAberrationEffect = class extends Effect {
	/**
	* Constructs a new chromatic aberration effect.
	*
	* @param {Object} [options] - The options.
	* @param {Vector2} [options.offset] - The color offset.
	* @param {Boolean} [options.radialModulation=false] - Whether the effect should be modulated with a radial gradient.
	* @param {Number} [options.modulationOffset=0.15] - The modulation offset. Only applies if `radialModulation` is enabled.
	*/
	constructor({ offset = new Vector2(.001, 5e-4), radialModulation = false, modulationOffset = .15 } = {}) {
		super("ChromaticAberrationEffect", chromatic_aberration_default, {
			vertexShader: chromatic_aberration_default2,
			attributes: EffectAttribute.CONVOLUTION,
			uniforms: /* @__PURE__ */ new Map([["offset", new Uniform(offset)], ["modulationOffset", new Uniform(modulationOffset)]])
		});
		this.radialModulation = radialModulation;
	}
	/**
	* The color offset.
	*
	* @type {Vector2}
	*/
	get offset() {
		return this.uniforms.get("offset").value;
	}
	set offset(value) {
		this.uniforms.get("offset").value = value;
	}
	/**
	* Indicates whether radial modulation is enabled.
	*
	* When enabled, the effect will be weaker in the middle and stronger towards the screen edges.
	*
	* @type {Boolean}
	*/
	get radialModulation() {
		return this.defines.has("RADIAL_MODULATION");
	}
	set radialModulation(value) {
		if (value) this.defines.set("RADIAL_MODULATION", "1");
		else this.defines.delete("RADIAL_MODULATION");
		this.setChanged();
	}
	/**
	* The modulation offset.
	*
	* @type {Number}
	*/
	get modulationOffset() {
		return this.uniforms.get("modulationOffset").value;
	}
	set modulationOffset(value) {
		this.uniforms.get("modulationOffset").value = value;
	}
	/**
	* Returns the color offset vector.
	*
	* @deprecated Use offset instead.
	* @return {Vector2} The offset.
	*/
	getOffset() {
		return this.offset;
	}
	/**
	* Sets the color offset vector.
	*
	* @deprecated Use offset instead.
	* @param {Vector2} value - The offset.
	*/
	setOffset(value) {
		this.offset = value;
	}
};
var ShaderPass = class extends Pass {
	/**
	* Constructs a new shader pass.
	*
	* @param {ShaderMaterial} material - A shader material.
	* @param {String} [input="inputBuffer"] - The name of the input buffer uniform.
	*/
	constructor(material, input = "inputBuffer") {
		super("ShaderPass");
		this.fullscreenMaterial = material;
		this.input = input;
	}
	/**
	* Sets the name of the input buffer uniform.
	*
	* @param {String} input - The name of the input buffer uniform.
	* @deprecated Use input instead.
	*/
	setInput(input) {
		this.input = input;
	}
	/**
	* Renders the effect.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		const uniforms = this.fullscreenMaterial.uniforms;
		if (inputBuffer !== null && uniforms !== void 0 && uniforms[this.input] !== void 0) uniforms[this.input].value = inputBuffer.texture;
		renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
		renderer.render(this.scene, this.camera);
	}
	/**
	* Performs initialization tasks.
	*
	* @param {WebGLRenderer} renderer - A renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	*/
	initialize(renderer, alpha, frameBufferType) {
		if (frameBufferType !== void 0 && frameBufferType !== 1009) this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
	}
};
function getNoise(size, format, type) {
	const channels = /* @__PURE__ */ new Map([
		[RedFormat, 1],
		[RGFormat, 2],
		[RGBAFormat, 4]
	]);
	let data;
	if (!channels.has(format)) console.error("Invalid noise texture format");
	if (type === 1009) {
		data = new Uint8Array(size * channels.get(format));
		for (let i = 0, l = data.length; i < l; ++i) data[i] = Math.random() * 255 + .5;
	} else {
		data = new Float32Array(size * channels.get(format));
		for (let i = 0, l = data.length; i < l; ++i) data[i] = Math.random();
	}
	return data;
}
var NoiseTexture = class extends DataTexture {
	/**
	* Constructs a new noise texture.
	*
	* Supported formats are `RGBAFormat`, `RedFormat` and `RGFormat`.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	* @param {Number} [format=RedFormat] - The texture format.
	* @param {Number} [type=UnsignedByteType] - The texture type.
	*/
	constructor(width, height, format = RedFormat, type = UnsignedByteType) {
		super(getNoise(width * height, format, type), width, height, format, type);
		this.needsUpdate = true;
	}
};
var RenderPass = class extends Pass {
	/**
	* Constructs a new render pass.
	*
	* @param {Scene} scene - The scene to render.
	* @param {Camera} camera - The camera to use to render the scene.
	* @param {Material} [overrideMaterial=null] - An override material.
	*/
	constructor(scene, camera, overrideMaterial = null) {
		super("RenderPass", scene, camera);
		this.needsSwap = false;
		this.needsDepthBlit = true;
		this.clearPass = new ClearPass();
		this.overrideMaterialManager = overrideMaterial === null ? null : new OverrideMaterialManager(overrideMaterial);
		this.ignoreBackground = false;
		this.skipShadowMapUpdate = false;
		this.selection = null;
	}
	set mainScene(value) {
		this.scene = value;
	}
	set mainCamera(value) {
		this.camera = value;
	}
	get renderToScreen() {
		return super.renderToScreen;
	}
	set renderToScreen(value) {
		super.renderToScreen = value;
		this.clearPass.renderToScreen = value;
	}
	/**
	* The current override material.
	*
	* @type {Material}
	*/
	get overrideMaterial() {
		const manager = this.overrideMaterialManager;
		return manager !== null ? manager.material : null;
	}
	set overrideMaterial(value) {
		const manager = this.overrideMaterialManager;
		if (value !== null) if (manager !== null) manager.setMaterial(value);
		else this.overrideMaterialManager = new OverrideMaterialManager(value);
		else if (manager !== null) {
			manager.dispose();
			this.overrideMaterialManager = null;
		}
	}
	/**
	* Returns the current override material.
	*
	* @deprecated Use overrideMaterial instead.
	* @return {Material} The material.
	*/
	getOverrideMaterial() {
		return this.overrideMaterial;
	}
	/**
	* Sets the override material.
	*
	* @deprecated Use overrideMaterial instead.
	* @return {Material} value - The material.
	*/
	setOverrideMaterial(value) {
		this.overrideMaterial = value;
	}
	/**
	* Indicates whether the target buffer should be cleared before rendering.
	*
	* @type {Boolean}
	* @deprecated Use clearPass.enabled instead.
	*/
	get clear() {
		return this.clearPass.enabled;
	}
	set clear(value) {
		this.clearPass.enabled = value;
	}
	/**
	* Returns the selection. Default is `null` (no restriction).
	*
	* @deprecated Use selection instead.
	* @return {Selection} The selection.
	*/
	getSelection() {
		return this.selection;
	}
	/**
	* Sets the selection. Set to `null` to disable.
	*
	* @deprecated Use selection instead.
	* @param {Selection} value - The selection.
	*/
	setSelection(value) {
		this.selection = value;
	}
	/**
	* Indicates whether the scene background is disabled.
	*
	* @deprecated Use ignoreBackground instead.
	* @return {Boolean} Whether the scene background is disabled.
	*/
	isBackgroundDisabled() {
		return this.ignoreBackground;
	}
	/**
	* Enables or disables the scene background.
	*
	* @deprecated Use ignoreBackground instead.
	* @param {Boolean} value - Whether the scene background should be disabled.
	*/
	setBackgroundDisabled(value) {
		this.ignoreBackground = value;
	}
	/**
	* Indicates whether the shadow map auto update is disabled.
	*
	* @deprecated Use skipShadowMapUpdate instead.
	* @return {Boolean} Whether the shadow map update is disabled.
	*/
	isShadowMapDisabled() {
		return this.skipShadowMapUpdate;
	}
	/**
	* Enables or disables the shadow map auto update.
	*
	* @deprecated Use skipShadowMapUpdate instead.
	* @param {Boolean} value - Whether the shadow map auto update should be disabled.
	*/
	setShadowMapDisabled(value) {
		this.skipShadowMapUpdate = value;
	}
	/**
	* Returns the clear pass.
	*
	* @deprecated Use clearPass.enabled instead.
	* @return {ClearPass} The clear pass.
	*/
	getClearPass() {
		return this.clearPass;
	}
	/**
	* Renders the scene.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		const scene = this.scene;
		const camera = this.camera;
		const selection = this.selection;
		const mask = camera.layers.mask;
		const background = scene.background;
		const shadowMapAutoUpdate = renderer.shadowMap.autoUpdate;
		const renderTarget = this.renderToScreen ? null : inputBuffer;
		if (selection !== null) camera.layers.set(selection.getLayer());
		if (this.skipShadowMapUpdate) renderer.shadowMap.autoUpdate = false;
		if (this.ignoreBackground || this.clearPass.overrideClearColor !== null) scene.background = null;
		if (this.clearPass.enabled) this.clearPass.render(renderer, inputBuffer);
		renderer.setRenderTarget(renderTarget);
		if (this.overrideMaterialManager !== null) this.overrideMaterialManager.render(renderer, scene, camera);
		else renderer.render(scene, camera);
		camera.layers.mask = mask;
		scene.background = background;
		renderer.shadowMap.autoUpdate = shadowMapAutoUpdate;
	}
};
var VignetteTechnique = {
	DEFAULT: 0,
	ESKIL: 1
};
Math.PI * .5;
function orthographicDepthToViewZ(depth, near, far) {
	return depth * (near - far) - near;
}
function viewZToOrthographicDepth(viewZ, near, far) {
	return Math.min(Math.max((viewZ + near) / (near - far), 0), 1);
}
var ssao_default = `#include <common>
#include <packing>
uniform vec2 cameraNearFar;
#define cameraNear cameraNearFar.x
#define cameraFar cameraNearFar.y
#ifdef NORMAL_DEPTH
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D normalDepthBuffer;
#else
uniform mediump sampler2D normalDepthBuffer;
#endif
float readDepth(const in vec2 uv){float depth=texture2D(normalDepthBuffer,uv).a;
#if defined(USE_LOGARITHMIC_DEPTH_BUFFER) || defined(LOG_DEPTH)
float d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;
#endif
return depth;}
#else
uniform lowp sampler2D normalBuffer;
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
float depth=unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
float depth=texture2D(depthBuffer,uv).r;
#endif
#if defined(USE_LOGARITHMIC_DEPTH_BUFFER) || defined(LOG_DEPTH)
float d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;
#endif
return depth;}
#endif
uniform lowp sampler2D noiseTexture;uniform mat4 inverseProjectionMatrix;uniform mat4 projectionMatrix;uniform vec2 texelSize;uniform float intensity;uniform float minRadiusScale;uniform float fade;uniform float bias;uniform vec2 distanceCutoff;uniform vec2 proximityCutoff;varying vec2 vUv;varying vec2 vUv2;float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}vec3 getViewPosition(const in vec2 screenPosition,const in float depth,const in float viewZ){vec4 clipPosition=vec4(vec3(screenPosition,depth)*2.0-1.0,1.0);float clipW=projectionMatrix[2][3]*viewZ+projectionMatrix[3][3];clipPosition*=clipW;return(inverseProjectionMatrix*clipPosition).xyz;}float getAmbientOcclusion(const in vec3 p,const in vec3 n,const in float depth,const in vec2 uv){float radiusScale=1.0-smoothstep(0.0,distanceCutoff.y,depth);radiusScale=radiusScale*(1.0-minRadiusScale)+minRadiusScale;float radius=RADIUS*radiusScale;float noise=texture2D(noiseTexture,vUv2).r;float baseAngle=noise*PI2;float rings=SPIRAL_TURNS*PI2;float occlusion=0.0;int taps=0;for(int i=0;i<SAMPLES_INT;++i){float alpha=(float(i)+0.5)*INV_SAMPLES_FLOAT;float angle=alpha*rings+baseAngle;vec2 rotation=vec2(cos(angle),sin(angle));vec2 coords=alpha*radius*rotation*texelSize+uv;if(coords.s<0.0||coords.s>1.0||coords.t<0.0||coords.t>1.0){continue;}float sampleDepth=readDepth(coords);float viewZ=getViewZ(sampleDepth);
#ifdef PERSPECTIVE_CAMERA
float linearSampleDepth=viewZToOrthographicDepth(viewZ,cameraNear,cameraFar);
#else
float linearSampleDepth=sampleDepth;
#endif
float proximity=abs(depth-linearSampleDepth);if(proximity<proximityCutoff.y){float falloff=1.0-smoothstep(proximityCutoff.x,proximityCutoff.y,proximity);vec3 Q=getViewPosition(coords,sampleDepth,viewZ);vec3 v=Q-p;float vv=dot(v,v);float vn=dot(v,n)-bias;float f=max(RADIUS_SQ-vv,0.0)/RADIUS_SQ;occlusion+=(f*f*f*max(vn/(fade+vv),0.0))*falloff;}++taps;}return occlusion/(4.0*max(float(taps),1.0));}void main(){
#ifdef NORMAL_DEPTH
vec4 normalDepth=texture2D(normalDepthBuffer,vUv);
#if defined(USE_LOGARITHMIC_DEPTH_BUFFER) || defined(LOG_DEPTH)
float d=pow(2.0,normalDepth.a*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);normalDepth.a=a+b/d;
#endif
#else
vec4 normalDepth=vec4(texture2D(normalBuffer,vUv).xyz,readDepth(vUv));
#endif
float ao=0.0;float depth=normalDepth.a;float viewZ=getViewZ(depth);
#ifdef PERSPECTIVE_CAMERA
float linearDepth=viewZToOrthographicDepth(viewZ,cameraNear,cameraFar);
#else
float linearDepth=depth;
#endif
if(linearDepth<distanceCutoff.y){vec3 viewPosition=getViewPosition(vUv,depth,viewZ);vec3 viewNormal=unpackRGBToNormal(normalDepth.rgb);ao+=getAmbientOcclusion(viewPosition,viewNormal,linearDepth,vUv);float d=smoothstep(distanceCutoff.x,distanceCutoff.y,linearDepth);ao=mix(ao,0.0,d);
#ifdef LEGACY_INTENSITY
ao=clamp(1.0-pow(1.0-ao,abs(intensity)),0.0,1.0);
#endif
}gl_FragColor.r=ao;}`;
var ssao_default2 = `uniform vec2 noiseScale;varying vec2 vUv;varying vec2 vUv2;void main(){vUv=position.xy*0.5+0.5;vUv2=vUv*noiseScale;gl_Position=vec4(position.xy,1.0,1.0);}`;
var SSAOMaterial = class extends ShaderMaterial {
	/**
	* Constructs a new SSAO material.
	*
	* @param {Camera} camera - A camera.
	*/
	constructor(camera) {
		super({
			name: "SSAOMaterial",
			defines: {
				SAMPLES_INT: "0",
				INV_SAMPLES_FLOAT: "0.0",
				SPIRAL_TURNS: "0.0",
				RADIUS: "1.0",
				RADIUS_SQ: "1.0",
				DISTANCE_SCALING: "1",
				DEPTH_PACKING: "0"
			},
			uniforms: {
				depthBuffer: new Uniform(null),
				normalBuffer: new Uniform(null),
				normalDepthBuffer: new Uniform(null),
				noiseTexture: new Uniform(null),
				inverseProjectionMatrix: new Uniform(new Matrix4()),
				projectionMatrix: new Uniform(new Matrix4()),
				texelSize: new Uniform(new Vector2()),
				cameraNearFar: new Uniform(new Vector2()),
				distanceCutoff: new Uniform(new Vector2()),
				proximityCutoff: new Uniform(new Vector2()),
				noiseScale: new Uniform(new Vector2()),
				minRadiusScale: new Uniform(.33),
				intensity: new Uniform(1),
				fade: new Uniform(.01),
				bias: new Uniform(0)
			},
			blending: 0,
			toneMapped: false,
			depthWrite: false,
			depthTest: false,
			fragmentShader: ssao_default,
			vertexShader: ssao_default2
		});
		this.copyCameraSettings(camera);
		this.resolution = new Vector2();
		this.r = 1;
	}
	/**
	* The current near plane setting.
	*
	* @type {Number}
	* @private
	*/
	get near() {
		return this.uniforms.cameraNearFar.value.x;
	}
	/**
	* The current far plane setting.
	*
	* @type {Number}
	* @private
	*/
	get far() {
		return this.uniforms.cameraNearFar.value.y;
	}
	/**
	* A combined normal-depth buffer.
	*
	* @type {Texture}
	*/
	set normalDepthBuffer(value) {
		this.uniforms.normalDepthBuffer.value = value;
		if (value !== null) this.defines.NORMAL_DEPTH = "1";
		else delete this.defines.NORMAL_DEPTH;
		this.needsUpdate = true;
	}
	/**
	* Sets the combined normal-depth buffer.
	*
	* @deprecated Use normalDepthBuffer instead.
	* @param {Number} value - The buffer.
	*/
	setNormalDepthBuffer(value) {
		this.normalDepthBuffer = value;
	}
	/**
	* The normal buffer.
	*
	* @type {Texture}
	*/
	set normalBuffer(value) {
		this.uniforms.normalBuffer.value = value;
	}
	/**
	* Sets the normal buffer.
	*
	* @deprecated Use normalBuffer instead.
	* @param {Number} value - The buffer.
	*/
	setNormalBuffer(value) {
		this.uniforms.normalBuffer.value = value;
	}
	/**
	* The depth buffer.
	*
	* @type {Texture}
	*/
	set depthBuffer(value) {
		this.uniforms.depthBuffer.value = value;
	}
	/**
	* The depth packing strategy.
	*
	* @type {DepthPackingStrategies}
	*/
	set depthPacking(value) {
		this.defines.DEPTH_PACKING = value.toFixed(0);
		this.needsUpdate = true;
	}
	/**
	* Sets the depth buffer.
	*
	* @deprecated Use depthBuffer and depthPacking instead.
	* @param {Texture} buffer - The depth texture.
	* @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
	*/
	setDepthBuffer(buffer, depthPacking = BasicDepthPacking) {
		this.depthBuffer = buffer;
		this.depthPacking = depthPacking;
	}
	/**
	* The noise texture.
	*
	* @type {Texture}
	*/
	set noiseTexture(value) {
		this.uniforms.noiseTexture.value = value;
	}
	/**
	* Sets the noise texture.
	*
	* @deprecated Use noiseTexture instead.
	* @param {Number} value - The texture.
	*/
	setNoiseTexture(value) {
		this.uniforms.noiseTexture.value = value;
	}
	/**
	* The sample count.
	*
	* @type {Number}
	*/
	get samples() {
		return Number(this.defines.SAMPLES_INT);
	}
	set samples(value) {
		this.defines.SAMPLES_INT = value.toFixed(0);
		this.defines.INV_SAMPLES_FLOAT = (1 / value).toFixed(9);
		this.needsUpdate = true;
	}
	/**
	* Returns the amount of occlusion samples per pixel.
	*
	* @deprecated Use samples instead.
	* @return {Number} The sample count.
	*/
	getSamples() {
		return this.samples;
	}
	/**
	* Sets the amount of occlusion samples per pixel.
	*
	* @deprecated Use samples instead.
	* @param {Number} value - The sample count.
	*/
	setSamples(value) {
		this.samples = value;
	}
	/**
	* The sampling spiral ring count.
	*
	* @type {Number}
	*/
	get rings() {
		return Number(this.defines.SPIRAL_TURNS);
	}
	set rings(value) {
		this.defines.SPIRAL_TURNS = value.toFixed(1);
		this.needsUpdate = true;
	}
	/**
	* Returns the amount of spiral turns in the occlusion sampling pattern.
	*
	* @deprecated Use rings instead.
	* @return {Number} The radius.
	*/
	getRings() {
		return this.rings;
	}
	/**
	* Sets the amount of spiral turns in the occlusion sampling pattern.
	*
	* @deprecated Use rings instead.
	* @param {Number} value - The radius.
	*/
	setRings(value) {
		this.rings = value;
	}
	/**
	* The intensity.
	*
	* @type {Number}
	* @deprecated Use SSAOEffect.intensity instead.
	*/
	get intensity() {
		return this.uniforms.intensity.value;
	}
	set intensity(value) {
		this.uniforms.intensity.value = value;
		if (this.defines.LEGACY_INTENSITY === void 0) {
			this.defines.LEGACY_INTENSITY = "1";
			this.needsUpdate = true;
		}
	}
	/**
	* Returns the intensity.
	*
	* @deprecated Use SSAOEffect.intensity instead.
	* @return {Number} The intensity.
	*/
	getIntensity() {
		return this.uniforms.intensity.value;
	}
	/**
	* Sets the intensity.
	*
	* @deprecated Use SSAOEffect.intensity instead.
	* @param {Number} value - The intensity.
	*/
	setIntensity(value) {
		this.uniforms.intensity.value = value;
	}
	/**
	* The depth fade factor.
	*
	* @type {Number}
	*/
	get fade() {
		return this.uniforms.fade.value;
	}
	set fade(value) {
		this.uniforms.fade.value = value;
	}
	/**
	* Returns the depth fade factor.
	*
	* @deprecated Use fade instead.
	* @return {Number} The fade factor.
	*/
	getFade() {
		return this.uniforms.fade.value;
	}
	/**
	* Sets the depth fade factor.
	*
	* @deprecated Use fade instead.
	* @param {Number} value - The fade factor.
	*/
	setFade(value) {
		this.uniforms.fade.value = value;
	}
	/**
	* The depth bias. Range: [0.0, 1.0].
	*
	* @type {Number}
	*/
	get bias() {
		return this.uniforms.bias.value;
	}
	set bias(value) {
		this.uniforms.bias.value = value;
	}
	/**
	* Returns the depth bias.
	*
	* @deprecated Use bias instead.
	* @return {Number} The bias.
	*/
	getBias() {
		return this.uniforms.bias.value;
	}
	/**
	* Sets the depth bias.
	*
	* @deprecated Use bias instead.
	* @param {Number} value - The bias.
	*/
	setBias(value) {
		this.uniforms.bias.value = value;
	}
	/**
	* The minimum radius scale for distance scaling. Range: [0.0, 1.0].
	*
	* @type {Number}
	*/
	get minRadiusScale() {
		return this.uniforms.minRadiusScale.value;
	}
	set minRadiusScale(value) {
		this.uniforms.minRadiusScale.value = value;
	}
	/**
	* Returns the minimum radius scale for distance scaling.
	*
	* @deprecated Use minRadiusScale instead.
	* @return {Number} The minimum radius scale.
	*/
	getMinRadiusScale() {
		return this.uniforms.minRadiusScale.value;
	}
	/**
	* Sets the minimum radius scale for distance scaling.
	*
	* @deprecated Use minRadiusScale instead.
	* @param {Number} value - The minimum radius scale.
	*/
	setMinRadiusScale(value) {
		this.uniforms.minRadiusScale.value = value;
	}
	/**
	* Updates the absolute radius.
	*
	* @private
	*/
	updateRadius() {
		const radius = this.r * this.resolution.height;
		this.defines.RADIUS = radius.toFixed(11);
		this.defines.RADIUS_SQ = (radius * radius).toFixed(11);
		this.needsUpdate = true;
	}
	/**
	* The occlusion sampling radius. Range: [0.0, 1.0].
	*
	* @type {Number}
	*/
	get radius() {
		return this.r;
	}
	set radius(value) {
		this.r = Math.min(Math.max(value, 1e-6), 1);
		this.updateRadius();
	}
	/**
	* Returns the occlusion sampling radius.
	*
	* @deprecated Use radius instead.
	* @return {Number} The radius.
	*/
	getRadius() {
		return this.radius;
	}
	/**
	* Sets the occlusion sampling radius.
	*
	* @deprecated Use radius instead.
	* @param {Number} value - The radius. Range [1e-6, 1.0].
	*/
	setRadius(value) {
		this.radius = value;
	}
	/**
	* Indicates whether distance-based radius scaling is enabled.
	*
	* @type {Boolean}
	* @deprecated
	*/
	get distanceScaling() {
		return true;
	}
	set distanceScaling(value) {}
	/**
	* Indicates whether distance-based radius scaling is enabled.
	*
	* @deprecated
	* @return {Boolean} Whether distance scaling is enabled.
	*/
	isDistanceScalingEnabled() {
		return this.distanceScaling;
	}
	/**
	* Enables or disables distance-based radius scaling.
	*
	* @deprecated
	* @param {Boolean} value - Whether distance scaling should be enabled.
	*/
	setDistanceScalingEnabled(value) {
		this.distanceScaling = value;
	}
	/**
	* The occlusion distance threshold. Range: [0.0, 1.0].
	*
	* @type {Number}
	*/
	get distanceThreshold() {
		return this.uniforms.distanceCutoff.value.x;
	}
	set distanceThreshold(value) {
		this.uniforms.distanceCutoff.value.set(Math.min(Math.max(value, 0), 1), Math.min(Math.max(value + this.distanceFalloff, 0), 1));
	}
	/**
	* The occlusion distance threshold in world units.
	*
	* @type {Number}
	*/
	get worldDistanceThreshold() {
		return -orthographicDepthToViewZ(this.distanceThreshold, this.near, this.far);
	}
	set worldDistanceThreshold(value) {
		this.distanceThreshold = viewZToOrthographicDepth(-value, this.near, this.far);
	}
	/**
	* The occlusion distance falloff. Range: [0.0, 1.0].
	*
	* @type {Number}
	*/
	get distanceFalloff() {
		return this.uniforms.distanceCutoff.value.y - this.distanceThreshold;
	}
	set distanceFalloff(value) {
		this.uniforms.distanceCutoff.value.y = Math.min(Math.max(this.distanceThreshold + value, 0), 1);
	}
	/**
	* The occlusion distance falloff in world units.
	*
	* @type {Number}
	*/
	get worldDistanceFalloff() {
		return -orthographicDepthToViewZ(this.distanceFalloff, this.near, this.far);
	}
	set worldDistanceFalloff(value) {
		this.distanceFalloff = viewZToOrthographicDepth(-value, this.near, this.far);
	}
	/**
	* Sets the occlusion distance cutoff.
	*
	* @deprecated Use distanceThreshold and distanceFalloff instead.
	* @param {Number} threshold - The distance threshold. Range [0.0, 1.0].
	* @param {Number} falloff - The falloff. Range [0.0, 1.0].
	*/
	setDistanceCutoff(threshold, falloff) {
		this.uniforms.distanceCutoff.value.set(Math.min(Math.max(threshold, 0), 1), Math.min(Math.max(threshold + falloff, 0), 1));
	}
	/**
	* The occlusion proximity threshold. Range: [0.0, 1.0].
	*
	* @type {Number}
	*/
	get proximityThreshold() {
		return this.uniforms.proximityCutoff.value.x;
	}
	set proximityThreshold(value) {
		this.uniforms.proximityCutoff.value.set(Math.min(Math.max(value, 0), 1), Math.min(Math.max(value + this.proximityFalloff, 0), 1));
	}
	/**
	* The occlusion proximity threshold in world units.
	*
	* @type {Number}
	*/
	get worldProximityThreshold() {
		return -orthographicDepthToViewZ(this.proximityThreshold, this.near, this.far);
	}
	set worldProximityThreshold(value) {
		this.proximityThreshold = viewZToOrthographicDepth(-value, this.near, this.far);
	}
	/**
	* The occlusion proximity falloff. Range: [0.0, 1.0].
	*
	* @type {Number}
	*/
	get proximityFalloff() {
		return this.uniforms.proximityCutoff.value.y - this.proximityThreshold;
	}
	set proximityFalloff(value) {
		this.uniforms.proximityCutoff.value.y = Math.min(Math.max(this.proximityThreshold + value, 0), 1);
	}
	/**
	* The occlusion proximity falloff in world units.
	*
	* @type {Number}
	*/
	get worldProximityFalloff() {
		return -orthographicDepthToViewZ(this.proximityFalloff, this.near, this.far);
	}
	set worldProximityFalloff(value) {
		this.proximityFalloff = viewZToOrthographicDepth(-value, this.near, this.far);
	}
	/**
	* Sets the occlusion proximity cutoff.
	*
	* @deprecated Use proximityThreshold and proximityFalloff instead.
	* @param {Number} threshold - The range threshold. Range [0.0, 1.0].
	* @param {Number} falloff - The falloff. Range [0.0, 1.0].
	*/
	setProximityCutoff(threshold, falloff) {
		this.uniforms.proximityCutoff.value.set(Math.min(Math.max(threshold, 0), 1), Math.min(Math.max(threshold + falloff, 0), 1));
	}
	/**
	* Sets the texel size.
	*
	* @deprecated Use setSize() instead.
	* @param {Number} x - The texel width.
	* @param {Number} y - The texel height.
	*/
	setTexelSize(x, y) {
		this.uniforms.texelSize.value.set(x, y);
	}
	/**
	* Copies the settings of the given camera.
	*
	* @deprecated Use copyCameraSettings instead.
	* @param {Camera} camera - A camera.
	*/
	adoptCameraSettings(camera) {
		this.copyCameraSettings(camera);
	}
	/**
	* Copies the settings of the given camera.
	*
	* @param {Camera} camera - A camera.
	*/
	copyCameraSettings(camera) {
		if (camera) {
			this.uniforms.cameraNearFar.value.set(camera.near, camera.far);
			this.uniforms.projectionMatrix.value.copy(camera.projectionMatrix);
			this.uniforms.inverseProjectionMatrix.value.copy(camera.projectionMatrix).invert();
			if (camera instanceof PerspectiveCamera) this.defines.PERSPECTIVE_CAMERA = "1";
			else delete this.defines.PERSPECTIVE_CAMERA;
			this.needsUpdate = true;
		}
	}
	/**
	* Sets the size of this object.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		const uniforms = this.uniforms;
		const noiseTexture = uniforms.noiseTexture.value;
		if (noiseTexture !== null) uniforms.noiseScale.value.set(width / noiseTexture.image.width, height / noiseTexture.image.height);
		uniforms.texelSize.value.set(1 / width, 1 / height);
		this.resolution.set(width, height);
		this.updateRadius();
	}
};
var depth_downsampling_default = `#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
#ifdef DOWNSAMPLE_NORMALS
uniform lowp sampler2D normalBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}int findBestDepth(const in float samples[4]){float c=(samples[0]+samples[1]+samples[2]+samples[3])*0.25;float distances[4];distances[0]=abs(c-samples[0]);distances[1]=abs(c-samples[1]);distances[2]=abs(c-samples[2]);distances[3]=abs(c-samples[3]);float maxDistance=max(max(distances[0],distances[1]),max(distances[2],distances[3]));int remaining[3];int rejected[3];int i,j,k;for(i=0,j=0,k=0;i<4;++i){if(distances[i]<maxDistance){remaining[j++]=i;}else{rejected[k++]=i;}}for(;j<3;++j){remaining[j]=rejected[--k];}vec3 s=vec3(samples[remaining[0]],samples[remaining[1]],samples[remaining[2]]);c=(s.x+s.y+s.z)/3.0;distances[0]=abs(c-s.x);distances[1]=abs(c-s.y);distances[2]=abs(c-s.z);float minDistance=min(distances[0],min(distances[1],distances[2]));for(i=0;i<3;++i){if(distances[i]==minDistance){break;}}return remaining[i];}void main(){float d[4];d[0]=readDepth(vUv0);d[1]=readDepth(vUv1);d[2]=readDepth(vUv2);d[3]=readDepth(vUv3);int index=findBestDepth(d);
#ifdef DOWNSAMPLE_NORMALS
vec3 n[4];n[0]=texture2D(normalBuffer,vUv0).rgb;n[1]=texture2D(normalBuffer,vUv1).rgb;n[2]=texture2D(normalBuffer,vUv2).rgb;n[3]=texture2D(normalBuffer,vUv3).rgb;
#else
vec3 n[4];n[0]=vec3(0.0);n[1]=vec3(0.0);n[2]=vec3(0.0);n[3]=vec3(0.0);
#endif
gl_FragColor=vec4(n[index],d[index]);}`;
var depth_downsampling_default2 = `uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=uv;vUv1=vec2(uv.x,uv.y+texelSize.y);vUv2=vec2(uv.x+texelSize.x,uv.y);vUv3=uv+texelSize;gl_Position=vec4(position.xy,1.0,1.0);}`;
var DepthDownsamplingMaterial = class extends ShaderMaterial {
	/**
	* Constructs a new depth downsampling material.
	*/
	constructor() {
		super({
			name: "DepthDownsamplingMaterial",
			defines: { DEPTH_PACKING: "0" },
			uniforms: {
				depthBuffer: new Uniform(null),
				normalBuffer: new Uniform(null),
				texelSize: new Uniform(new Vector2())
			},
			blending: 0,
			toneMapped: false,
			depthWrite: false,
			depthTest: false,
			fragmentShader: depth_downsampling_default,
			vertexShader: depth_downsampling_default2
		});
	}
	/**
	* The depth buffer.
	*
	* @type {Texture}
	*/
	set depthBuffer(value) {
		this.uniforms.depthBuffer.value = value;
	}
	/**
	* The depth packing strategy.
	*
	* @type {DepthPackingStrategies}
	*/
	set depthPacking(value) {
		this.defines.DEPTH_PACKING = value.toFixed(0);
		this.needsUpdate = true;
	}
	/**
	* Sets the depth buffer.
	*
	* @deprecated Use depthBuffer and depthPacking instead.
	* @param {Texture} buffer - The depth texture.
	* @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
	*/
	setDepthBuffer(buffer, depthPacking = BasicDepthPacking) {
		this.depthBuffer = buffer;
		this.depthPacking = depthPacking;
	}
	/**
	* The normal buffer.
	*
	* @type {Texture}
	*/
	set normalBuffer(value) {
		this.uniforms.normalBuffer.value = value;
		if (value !== null) this.defines.DOWNSAMPLE_NORMALS = "1";
		else delete this.defines.DOWNSAMPLE_NORMALS;
		this.needsUpdate = true;
	}
	/**
	* Sets the normal buffer.
	*
	* @deprecated Use normalBuffer instead.
	* @param {Texture} value - The normal buffer.
	*/
	setNormalBuffer(value) {
		this.normalBuffer = value;
	}
	/**
	* Sets the texel size.
	*
	* @deprecated Use setSize() instead.
	* @param {Number} x - The texel width.
	* @param {Number} y - The texel height.
	*/
	setTexelSize(x, y) {
		this.uniforms.texelSize.value.set(x, y);
	}
	/**
	* Sets the size of this object.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		this.uniforms.texelSize.value.set(1 / width, 1 / height);
	}
};
var DepthDownsamplingPass = class extends Pass {
	/**
	* Constructs a new depth downsampling pass.
	*
	* @param {Object} [options] - The options.
	* @param {Texture} [options.normalBuffer=null] - A texture that contains view space normals. See {@link NormalPass}.
	* @param {Number} [options.resolutionScale=0.5] - The resolution scale.
	* @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
	* @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
	* @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
	* @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
	*/
	constructor({ normalBuffer = null, resolutionScale = .5, width = Resolution.AUTO_SIZE, height = Resolution.AUTO_SIZE, resolutionX = width, resolutionY = height } = {}) {
		super("DepthDownsamplingPass");
		const material = new DepthDownsamplingMaterial();
		material.normalBuffer = normalBuffer;
		this.fullscreenMaterial = material;
		this.needsDepthTexture = true;
		this.needsSwap = false;
		this.renderTarget = new WebGLRenderTarget(1, 1, {
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			depthBuffer: false,
			type: FloatType
		});
		this.renderTarget.texture.name = "DepthDownsamplingPass.Target";
		this.renderTarget.texture.generateMipmaps = false;
		const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
		resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
	}
	/**
	* The normal(RGB) + depth(A) texture.
	*
	* @type {Texture}
	*/
	get texture() {
		return this.renderTarget.texture;
	}
	/**
	* Returns the normal(RGB) + depth(A) texture.
	*
	* @deprecated Use texture instead.
	* @return {Texture} The texture.
	*/
	getTexture() {
		return this.renderTarget.texture;
	}
	/**
	* Returns the resolution settings.
	*
	* @deprecated Use resolution instead.
	* @return {Resolution} The resolution.
	*/
	getResolution() {
		return this.resolution;
	}
	/**
	* Sets the depth texture.
	*
	* @param {Texture} depthTexture - A depth texture.
	* @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
	*/
	setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
		this.fullscreenMaterial.depthBuffer = depthTexture;
		this.fullscreenMaterial.depthPacking = depthPacking;
	}
	/**
	* Downsamples depth and scene normals.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		renderer.setRenderTarget(this.renderToScreen ? null : this.renderTarget);
		renderer.render(this.scene, this.camera);
	}
	/**
	* Updates the size of this pass.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		const resolution = this.resolution;
		resolution.setBaseSize(width, height);
		this.renderTarget.setSize(resolution.width, resolution.height);
		this.fullscreenMaterial.setSize(width, height);
	}
	/**
	* Performs initialization tasks.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	*/
	initialize(renderer, alpha, frameBufferType) {
		const gl = renderer.getContext();
		if (!(gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float"))) throw new Error("Rendering to float texture is not supported.");
	}
};
var ssao_default3 = `uniform lowp sampler2D aoBuffer;uniform float luminanceInfluence;uniform float intensity;
#if defined(DEPTH_AWARE_UPSAMPLING) && defined(NORMAL_DEPTH)
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D normalDepthBuffer;
#else
uniform mediump sampler2D normalDepthBuffer;
#endif
#endif
#ifdef COLORIZE
uniform vec3 color;
#endif
void mainImage(const in vec4 inputColor,const in vec2 uv,const in float depth,out vec4 outputColor){float aoLinear=texture2D(aoBuffer,uv).r;
#if defined(DEPTH_AWARE_UPSAMPLING) && defined(NORMAL_DEPTH) && __VERSION__ == 300
vec4 normalDepth[4];normalDepth[0]=textureOffset(normalDepthBuffer,uv,ivec2(0,0));normalDepth[1]=textureOffset(normalDepthBuffer,uv,ivec2(0,1));normalDepth[2]=textureOffset(normalDepthBuffer,uv,ivec2(1,0));normalDepth[3]=textureOffset(normalDepthBuffer,uv,ivec2(1,1));float dot01=dot(normalDepth[0].rgb,normalDepth[1].rgb);float dot02=dot(normalDepth[0].rgb,normalDepth[2].rgb);float dot03=dot(normalDepth[0].rgb,normalDepth[3].rgb);float minDot=min(dot01,min(dot02,dot03));float s=step(THRESHOLD,minDot);float smallestDistance=1.0;int index;for(int i=0;i<4;++i){float distance=abs(depth-normalDepth[i].a);if(distance<smallestDistance){smallestDistance=distance;index=i;}}ivec2 offsets[4];offsets[0]=ivec2(0,0);offsets[1]=ivec2(0,1);offsets[2]=ivec2(1,0);offsets[3]=ivec2(1,1);ivec2 coord=ivec2(uv*vec2(textureSize(aoBuffer,0)))+offsets[index];float aoNearest=texelFetch(aoBuffer,coord,0).r;float ao=mix(aoNearest,aoLinear,s);
#else
float ao=aoLinear;
#endif
float l=luminance(inputColor.rgb);ao=mix(ao,0.0,l*luminanceInfluence);ao=clamp(ao*intensity,0.0,1.0);
#ifdef COLORIZE
outputColor=vec4(1.0-ao*(1.0-color),inputColor.a);
#else
outputColor=vec4(vec3(1.0-ao),inputColor.a);
#endif
}`;
var NOISE_TEXTURE_SIZE = 64;
var SSAOEffect = class extends Effect {
	/**
	* Constructs a new SSAO effect.
	*
	* @todo Move normalBuffer to options.
	* @param {Camera} [camera] - The main camera.
	* @param {Texture} [normalBuffer] - A texture that contains the scene normals.
	* @param {Object} [options] - The options.
	* @param {BlendFunction} [options.blendFunction=BlendFunction.MULTIPLY] - The blend function of this effect.
	* @param {Boolean} [options.distanceScaling=true] - Deprecated.
	* @param {Boolean} [options.depthAwareUpsampling=true] - Enables or disables depth-aware upsampling. Has no effect if WebGL 2 is not supported.
	* @param {Texture} [options.normalDepthBuffer=null] - Deprecated.
	* @param {Number} [options.samples=9] - The amount of samples per pixel. Should not be a multiple of the ring count.
	* @param {Number} [options.rings=7] - The amount of spiral turns in the occlusion sampling pattern. Should be a prime number.
	* @param {Number} [options.worldDistanceThreshold] - The world distance threshold at which the occlusion effect starts to fade out.
	* @param {Number} [options.worldDistanceFalloff] - The world distance falloff. Influences the smoothness of the occlusion cutoff.
	* @param {Number} [options.worldProximityThreshold] - The world proximity threshold at which the occlusion starts to fade out.
	* @param {Number} [options.worldProximityFalloff] - The world proximity falloff. Influences the smoothness of the proximity cutoff.
	* @param {Number} [options.distanceThreshold=0.97] - Deprecated.
	* @param {Number} [options.distanceFalloff=0.03] - Deprecated.
	* @param {Number} [options.rangeThreshold=0.0005] - Deprecated.
	* @param {Number} [options.rangeFalloff=0.001] - Deprecated.
	* @param {Number} [options.minRadiusScale=0.1] - The minimum radius scale.
	* @param {Number} [options.luminanceInfluence=0.7] - Determines how much the luminance of the scene influences the ambient occlusion.
	* @param {Number} [options.radius=0.1825] - The occlusion sampling radius, expressed as a scale relative to the resolution. Range [1e-6, 1.0].
	* @param {Number} [options.intensity=1.0] - The intensity of the ambient occlusion.
	* @param {Number} [options.bias=0.025] - An occlusion bias. Eliminates artifacts caused by depth discontinuities.
	* @param {Number} [options.fade=0.01] - Influences the smoothness of the shadows. A lower value results in higher contrast.
	* @param {Color} [options.color=null] - The color of the ambient occlusion.
	* @param {Number} [options.resolutionScale=1.0] - The resolution scale.
	* @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
	* @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
	* @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
	* @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
	*/
	constructor(camera, normalBuffer, { blendFunction = BlendFunction.MULTIPLY, samples = 9, rings = 7, normalDepthBuffer = null, depthAwareUpsampling = true, worldDistanceThreshold, worldDistanceFalloff, worldProximityThreshold, worldProximityFalloff, distanceThreshold = .97, distanceFalloff = .03, rangeThreshold = 5e-4, rangeFalloff = .001, minRadiusScale = .1, luminanceInfluence = .7, radius = .1825, intensity = 1, bias = .025, fade = .01, color: color2 = null, resolutionScale = 1, width = Resolution.AUTO_SIZE, height = Resolution.AUTO_SIZE, resolutionX = width, resolutionY = height } = {}) {
		super("SSAOEffect", ssao_default3, {
			blendFunction,
			attributes: EffectAttribute.DEPTH,
			defines: /* @__PURE__ */ new Map([["THRESHOLD", "0.997"]]),
			uniforms: /* @__PURE__ */ new Map([
				["aoBuffer", new Uniform(null)],
				["normalDepthBuffer", new Uniform(normalDepthBuffer)],
				["luminanceInfluence", new Uniform(luminanceInfluence)],
				["color", new Uniform(null)],
				["intensity", new Uniform(intensity)],
				["scale", new Uniform(0)]
			])
		});
		this.renderTarget = new WebGLRenderTarget(1, 1, { depthBuffer: false });
		this.renderTarget.texture.name = "AO.Target";
		this.uniforms.get("aoBuffer").value = this.renderTarget.texture;
		const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
		resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
		this.camera = camera;
		this.depthDownsamplingPass = new DepthDownsamplingPass({
			normalBuffer,
			resolutionScale
		});
		this.depthDownsamplingPass.enabled = normalDepthBuffer === null;
		this.ssaoPass = new ShaderPass(new SSAOMaterial(camera));
		const noiseTexture = new NoiseTexture(NOISE_TEXTURE_SIZE, NOISE_TEXTURE_SIZE, RGBAFormat);
		noiseTexture.wrapS = noiseTexture.wrapT = RepeatWrapping;
		const ssaoMaterial = this.ssaoMaterial;
		ssaoMaterial.normalBuffer = normalBuffer;
		ssaoMaterial.noiseTexture = noiseTexture;
		ssaoMaterial.minRadiusScale = minRadiusScale;
		ssaoMaterial.samples = samples;
		ssaoMaterial.radius = radius;
		ssaoMaterial.rings = rings;
		ssaoMaterial.fade = fade;
		ssaoMaterial.bias = bias;
		ssaoMaterial.distanceThreshold = distanceThreshold;
		ssaoMaterial.distanceFalloff = distanceFalloff;
		ssaoMaterial.proximityThreshold = rangeThreshold;
		ssaoMaterial.proximityFalloff = rangeFalloff;
		if (worldDistanceThreshold !== void 0) ssaoMaterial.worldDistanceThreshold = worldDistanceThreshold;
		if (worldDistanceFalloff !== void 0) ssaoMaterial.worldDistanceFalloff = worldDistanceFalloff;
		if (worldProximityThreshold !== void 0) ssaoMaterial.worldProximityThreshold = worldProximityThreshold;
		if (worldProximityFalloff !== void 0) ssaoMaterial.worldProximityFalloff = worldProximityFalloff;
		if (normalDepthBuffer !== null) {
			this.ssaoMaterial.normalDepthBuffer = normalDepthBuffer;
			this.defines.set("NORMAL_DEPTH", "1");
		}
		this.depthAwareUpsampling = depthAwareUpsampling;
		this.color = color2;
	}
	set mainCamera(value) {
		this.camera = value;
		this.ssaoMaterial.copyCameraSettings(value);
	}
	/**
	* Sets the normal buffer.
	*
	* @type {Texture}
	*/
	get normalBuffer() {
		return this.ssaoMaterial.normalBuffer;
	}
	set normalBuffer(value) {
		this.ssaoMaterial.normalBuffer = value;
		this.depthDownsamplingPass.fullscreenMaterial.normalBuffer = value;
	}
	/**
	* Returns the resolution settings.
	*
	* @deprecated Use resolution instead.
	* @return {Resolution} The resolution.
	*/
	getResolution() {
		return this.resolution;
	}
	/**
	* The SSAO material.
	*
	* @type {SSAOMaterial}
	*/
	get ssaoMaterial() {
		return this.ssaoPass.fullscreenMaterial;
	}
	/**
	* Returns the SSAO material.
	*
	* @deprecated Use ssaoMaterial instead.
	* @return {SSAOMaterial} The material.
	*/
	getSSAOMaterial() {
		return this.ssaoMaterial;
	}
	/**
	* The amount of occlusion samples per pixel.
	*
	* @type {Number}
	* @deprecated Use ssaoMaterial.samples instead.
	*/
	get samples() {
		return this.ssaoMaterial.samples;
	}
	set samples(value) {
		this.ssaoMaterial.samples = value;
	}
	/**
	* The amount of spiral turns in the occlusion sampling pattern.
	*
	* @type {Number}
	* @deprecated Use ssaoMaterial.rings instead.
	*/
	get rings() {
		return this.ssaoMaterial.rings;
	}
	set rings(value) {
		this.ssaoMaterial.rings = value;
	}
	/**
	* The occlusion sampling radius.
	*
	* @type {Number}
	* @deprecated Use ssaoMaterial.radius instead.
	*/
	get radius() {
		return this.ssaoMaterial.radius;
	}
	set radius(value) {
		this.ssaoMaterial.radius = value;
	}
	/**
	* Indicates whether depth-aware upsampling is enabled.
	*
	* @type {Boolean}
	*/
	get depthAwareUpsampling() {
		return this.defines.has("DEPTH_AWARE_UPSAMPLING");
	}
	set depthAwareUpsampling(value) {
		if (this.depthAwareUpsampling !== value) {
			if (value) this.defines.set("DEPTH_AWARE_UPSAMPLING", "1");
			else this.defines.delete("DEPTH_AWARE_UPSAMPLING");
			this.setChanged();
		}
	}
	/**
	* Indicates whether depth-aware upsampling is enabled.
	*
	* @deprecated Use depthAwareUpsampling instead.
	* @return {Boolean} Whether depth-aware upsampling is enabled.
	*/
	isDepthAwareUpsamplingEnabled() {
		return this.depthAwareUpsampling;
	}
	/**
	* Enables or disables depth-aware upsampling.
	*
	* @deprecated Use depthAwareUpsampling instead.
	* @param {Boolean} value - Whether depth-aware upsampling should be enabled.
	*/
	setDepthAwareUpsamplingEnabled(value) {
		this.depthAwareUpsampling = value;
	}
	/**
	* Indicates whether distance-based radius scaling is enabled.
	*
	* @type {Boolean}
	* @deprecated
	*/
	get distanceScaling() {
		return true;
	}
	set distanceScaling(value) {}
	/**
	* The color of the ambient occlusion. Set to `null` to disable.
	*
	* @type {Color}
	*/
	get color() {
		return this.uniforms.get("color").value;
	}
	set color(value) {
		const uniforms = this.uniforms;
		const defines = this.defines;
		if (value !== null) if (defines.has("COLORIZE")) uniforms.get("color").value.set(value);
		else {
			defines.set("COLORIZE", "1");
			uniforms.get("color").value = new Color(value);
			this.setChanged();
		}
		else if (defines.has("COLORIZE")) {
			defines.delete("COLORIZE");
			uniforms.get("color").value = null;
			this.setChanged();
		}
	}
	/**
	* The luminance influence factor. Range: [0.0, 1.0].
	*
	* @type {Boolean}
	*/
	get luminanceInfluence() {
		return this.uniforms.get("luminanceInfluence").value;
	}
	set luminanceInfluence(value) {
		this.uniforms.get("luminanceInfluence").value = value;
	}
	/**
	* The intensity.
	*
	* @type {Number}
	*/
	get intensity() {
		return this.uniforms.get("intensity").value;
	}
	set intensity(value) {
		this.uniforms.get("intensity").value = value;
	}
	/**
	* Returns the color of the ambient occlusion.
	*
	* @deprecated Use color instead.
	* @return {Color} The color.
	*/
	getColor() {
		return this.color;
	}
	/**
	* Sets the color of the ambient occlusion. Set to `null` to disable colorization.
	*
	* @deprecated Use color instead.
	* @param {Color} value - The color.
	*/
	setColor(value) {
		this.color = value;
	}
	/**
	* Sets the occlusion distance cutoff.
	*
	* @deprecated Use ssaoMaterial instead.
	* @param {Number} threshold - The distance threshold. Range [0.0, 1.0].
	* @param {Number} falloff - The falloff. Range [0.0, 1.0].
	*/
	setDistanceCutoff(threshold, falloff) {
		this.ssaoMaterial.distanceThreshold = threshold;
		this.ssaoMaterial.distanceFalloff = falloff;
	}
	/**
	* Sets the occlusion proximity cutoff.
	*
	* @deprecated Use ssaoMaterial instead.
	* @param {Number} threshold - The proximity threshold. Range [0.0, 1.0].
	* @param {Number} falloff - The falloff. Range [0.0, 1.0].
	*/
	setProximityCutoff(threshold, falloff) {
		this.ssaoMaterial.proximityThreshold = threshold;
		this.ssaoMaterial.proximityFalloff = falloff;
	}
	/**
	* Sets the depth texture.
	*
	* @param {Texture} depthTexture - A depth texture.
	* @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
	*/
	setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
		this.depthDownsamplingPass.setDepthTexture(depthTexture, depthPacking);
		this.ssaoMaterial.depthBuffer = depthTexture;
		this.ssaoMaterial.depthPacking = depthPacking;
	}
	/**
	* Updates this effect.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	*/
	update(renderer, inputBuffer, deltaTime) {
		const renderTarget = this.renderTarget;
		if (this.depthDownsamplingPass.enabled) this.depthDownsamplingPass.render(renderer);
		this.ssaoPass.render(renderer, null, renderTarget);
	}
	/**
	* Sets the size.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		const resolution = this.resolution;
		resolution.setBaseSize(width, height);
		const w = resolution.width, h = resolution.height;
		this.ssaoMaterial.copyCameraSettings(this.camera);
		this.ssaoMaterial.setSize(w, h);
		this.renderTarget.setSize(w, h);
		this.depthDownsamplingPass.resolution.scale = resolution.scale;
		this.depthDownsamplingPass.setSize(width, height);
	}
	/**
	* Performs initialization tasks.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	*/
	initialize(renderer, alpha, frameBufferType) {
		try {
			let normalDepthBuffer = this.uniforms.get("normalDepthBuffer").value;
			if (normalDepthBuffer === null) {
				this.depthDownsamplingPass.initialize(renderer, alpha, frameBufferType);
				normalDepthBuffer = this.depthDownsamplingPass.texture;
				this.uniforms.get("normalDepthBuffer").value = normalDepthBuffer;
				this.ssaoMaterial.normalDepthBuffer = normalDepthBuffer;
				this.defines.set("NORMAL_DEPTH", "1");
			}
		} catch (e) {
			this.depthDownsamplingPass.enabled = false;
		}
	}
};
var vignette_default = `uniform float offset;uniform float darkness;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){const vec2 center=vec2(0.5);vec3 color=inputColor.rgb;
#if VIGNETTE_TECHNIQUE == 0
float d=distance(uv,center);color*=smoothstep(0.8,offset*0.799,d*(darkness+offset));
#else
vec2 coord=(uv-center)*vec2(offset);color=mix(color,vec3(1.0-darkness),dot(coord,coord));
#endif
outputColor=vec4(color,inputColor.a);}`;
var VignetteEffect = class extends Effect {
	/**
	* Constructs a new Vignette effect.
	*
	* @param {Object} [options] - The options.
	* @param {BlendFunction} [options.blendFunction] - The blend function of this effect.
	* @param {VignetteTechnique} [options.technique=VignetteTechnique.DEFAULT] - The Vignette technique.
	* @param {Boolean} [options.eskil=false] - Deprecated. Use technique instead.
	* @param {Number} [options.offset=0.5] - The Vignette offset.
	* @param {Number} [options.darkness=0.5] - The Vignette darkness.
	*/
	constructor({ blendFunction, eskil = false, technique = eskil ? VignetteTechnique.ESKIL : VignetteTechnique.DEFAULT, offset = .5, darkness = .5 } = {}) {
		super("VignetteEffect", vignette_default, {
			blendFunction,
			defines: /* @__PURE__ */ new Map([["VIGNETTE_TECHNIQUE", technique.toFixed(0)]]),
			uniforms: /* @__PURE__ */ new Map([["offset", new Uniform(offset)], ["darkness", new Uniform(darkness)]])
		});
	}
	/**
	* The Vignette technique.
	*
	* @type {VignetteTechnique}
	*/
	get technique() {
		return Number(this.defines.get("VIGNETTE_TECHNIQUE"));
	}
	set technique(value) {
		if (this.technique !== value) {
			this.defines.set("VIGNETTE_TECHNIQUE", value.toFixed(0));
			this.setChanged();
		}
	}
	/**
	* Indicates whether Eskil's Vignette technique is enabled.
	*
	* @type {Boolean}
	* @deprecated Use technique instead.
	*/
	get eskil() {
		return this.technique === VignetteTechnique.ESKIL;
	}
	/**
	* Indicates whether Eskil's Vignette technique is enabled.
	*
	* @type {Boolean}
	* @deprecated Use technique instead.
	*/
	set eskil(value) {
		this.technique = value ? VignetteTechnique.ESKIL : VignetteTechnique.DEFAULT;
	}
	/**
	* Returns the Vignette technique.
	*
	* @deprecated Use technique instead.
	* @return {VignetteTechnique} The technique.
	*/
	getTechnique() {
		return this.technique;
	}
	/**
	* Sets the Vignette technique.
	*
	* @deprecated Use technique instead.
	* @param {VignetteTechnique} value - The technique.
	*/
	setTechnique(value) {
		this.technique = value;
	}
	/**
	* The Vignette offset.
	*
	* @type {Number}
	*/
	get offset() {
		return this.uniforms.get("offset").value;
	}
	set offset(value) {
		this.uniforms.get("offset").value = value;
	}
	/**
	* Returns the Vignette offset.
	*
	* @deprecated Use offset instead.
	* @return {Number} The offset.
	*/
	getOffset() {
		return this.offset;
	}
	/**
	* Sets the Vignette offset.
	*
	* @deprecated Use offset instead.
	* @param {Number} value - The offset.
	*/
	setOffset(value) {
		this.offset = value;
	}
	/**
	* The Vignette darkness.
	*
	* @type {Number}
	*/
	get darkness() {
		return this.uniforms.get("darkness").value;
	}
	set darkness(value) {
		this.uniforms.get("darkness").value = value;
	}
	/**
	* Returns the Vignette darkness.
	*
	* @deprecated Use darkness instead.
	* @return {Number} The darkness.
	*/
	getDarkness() {
		return this.darkness;
	}
	/**
	* Sets the Vignette darkness.
	*
	* @deprecated Use darkness instead.
	* @param {Number} value - The darkness.
	*/
	setDarkness(value) {
		this.darkness = value;
	}
};
var effect_default = `#include <common>
#include <packing>
#include <dithering_pars_fragment>
#define packFloatToRGBA(v) packDepthToRGBA(v)
#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;vec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
float depth=unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
float depth=texture2D(depthBuffer,uv).r;
#endif
#if defined(USE_LOGARITHMIC_DEPTH_BUFFER) || defined(LOG_DEPTH)
float d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;
#elif defined(USE_REVERSED_DEPTH_BUFFER)
depth=1.0-depth;
#endif
return depth;}float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE color0.a=clamp(color0.a,0.0,1.0);gl_FragColor=color0;
#ifdef ENCODE_OUTPUT
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
}`;
var effect_default2 = `uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}`;
var EffectMaterial = class extends ShaderMaterial {
	/**
	* Constructs a new effect material.
	*
	* @param {Map<String, String>} [shaderParts] - Deprecated. Use setShaderData instead.
	* @param {Map<String, String>} [defines] - Deprecated. Use setShaderData instead.
	* @param {Map<String, Uniform>} [uniforms] - Deprecated. Use setShaderData instead.
	* @param {Camera} [camera] - A camera.
	* @param {Boolean} [dithering=false] - Deprecated.
	*/
	constructor(shaderParts, defines, uniforms, camera, dithering = false) {
		super({
			name: "EffectMaterial",
			defines: {
				THREE_REVISION: "184".replace(/\D+/g, ""),
				DEPTH_PACKING: "0",
				ENCODE_OUTPUT: "1"
			},
			uniforms: {
				inputBuffer: new Uniform(null),
				depthBuffer: new Uniform(null),
				resolution: new Uniform(new Vector2()),
				texelSize: new Uniform(new Vector2()),
				cameraNear: new Uniform(.3),
				cameraFar: new Uniform(1e3),
				aspect: new Uniform(1),
				time: new Uniform(0)
			},
			blending: 0,
			toneMapped: false,
			depthWrite: false,
			depthTest: false,
			dithering
		});
		if (shaderParts) this.setShaderParts(shaderParts);
		if (defines) this.setDefines(defines);
		if (uniforms) this.setUniforms(uniforms);
		this.copyCameraSettings(camera);
	}
	/**
	* The input buffer.
	*
	* @type {Texture}
	*/
	set inputBuffer(value) {
		this.uniforms.inputBuffer.value = value;
	}
	/**
	* Sets the input buffer.
	*
	* @deprecated Use inputBuffer instead.
	* @param {Texture} value - The input buffer.
	*/
	setInputBuffer(value) {
		this.uniforms.inputBuffer.value = value;
	}
	/**
	* The depth buffer.
	*
	* @type {Texture}
	*/
	get depthBuffer() {
		return this.uniforms.depthBuffer.value;
	}
	set depthBuffer(value) {
		this.uniforms.depthBuffer.value = value;
	}
	/**
	* The depth packing strategy.
	*
	* @type {DepthPackingStrategies}
	*/
	get depthPacking() {
		return Number(this.defines.DEPTH_PACKING);
	}
	set depthPacking(value) {
		this.defines.DEPTH_PACKING = value.toFixed(0);
		this.needsUpdate = true;
	}
	/**
	* Sets the depth buffer.
	*
	* @deprecated Use depthBuffer and depthPacking instead.
	* @param {Texture} buffer - The depth texture.
	* @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing strategy.
	*/
	setDepthBuffer(buffer, depthPacking = BasicDepthPacking) {
		this.depthBuffer = buffer;
		this.depthPacking = depthPacking;
	}
	/**
	* Sets the shader data.
	*
	* @param {EffectShaderData} data - The shader data.
	* @return {EffectMaterial} This material.
	*/
	setShaderData(data) {
		this.setShaderParts(data.shaderParts);
		this.setDefines(data.defines);
		this.setUniforms(data.uniforms);
		this.setExtensions(data.extensions);
	}
	/**
	* Sets the shader parts.
	*
	* @deprecated Use setShaderData instead.
	* @param {Map<String, String>} shaderParts - A collection of shader snippets. See {@link EffectShaderSection}.
	* @return {EffectMaterial} This material.
	*/
	setShaderParts(shaderParts) {
		this.fragmentShader = effect_default.replace(EffectShaderSection.FRAGMENT_HEAD, shaderParts.get(EffectShaderSection.FRAGMENT_HEAD) || "").replace(EffectShaderSection.FRAGMENT_MAIN_UV, shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_UV) || "").replace(EffectShaderSection.FRAGMENT_MAIN_IMAGE, shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_IMAGE) || "");
		this.vertexShader = effect_default2.replace(EffectShaderSection.VERTEX_HEAD, shaderParts.get(EffectShaderSection.VERTEX_HEAD) || "").replace(EffectShaderSection.VERTEX_MAIN_SUPPORT, shaderParts.get(EffectShaderSection.VERTEX_MAIN_SUPPORT) || "");
		this.needsUpdate = true;
		return this;
	}
	/**
	* Sets the shader macros.
	*
	* @deprecated Use setShaderData instead.
	* @param {Map<String, String>} defines - A collection of preprocessor macro definitions.
	* @return {EffectMaterial} This material.
	*/
	setDefines(defines) {
		for (const entry of defines.entries()) this.defines[entry[0]] = entry[1];
		this.needsUpdate = true;
		return this;
	}
	/**
	* Sets the shader uniforms.
	*
	* @deprecated Use setShaderData instead.
	* @param {Map<String, Uniform>} uniforms - A collection of uniforms.
	* @return {EffectMaterial} This material.
	*/
	setUniforms(uniforms) {
		for (const entry of uniforms.entries()) this.uniforms[entry[0]] = entry[1];
		return this;
	}
	/**
	* Sets the required shader extensions.
	*
	* @deprecated Use setShaderData instead.
	* @param {Set<WebGLExtension>} extensions - A collection of extensions.
	* @return {EffectMaterial} This material.
	*/
	setExtensions(extensions) {
		this.extensions = {};
		for (const extension of extensions) this.extensions[extension] = true;
		return this;
	}
	/**
	* Indicates whether output encoding is enabled.
	*
	* @type {Boolean}
	*/
	get encodeOutput() {
		return this.defines.ENCODE_OUTPUT !== void 0;
	}
	set encodeOutput(value) {
		if (this.encodeOutput !== value) {
			if (value) this.defines.ENCODE_OUTPUT = "1";
			else delete this.defines.ENCODE_OUTPUT;
			this.needsUpdate = true;
		}
	}
	/**
	* Indicates whether output encoding is enabled.
	*
	* @deprecated Use encodeOutput instead.
	* @return {Boolean} Whether output encoding is enabled.
	*/
	isOutputEncodingEnabled(value) {
		return this.encodeOutput;
	}
	/**
	* Enables or disables output encoding.
	*
	* @deprecated Use encodeOutput instead.
	* @param {Boolean} value - Whether output encoding should be enabled.
	*/
	setOutputEncodingEnabled(value) {
		this.encodeOutput = value;
	}
	/**
	* The time in seconds.
	*
	* @type {Number}
	*/
	get time() {
		return this.uniforms.time.value;
	}
	set time(value) {
		this.uniforms.time.value = value;
	}
	/**
	* Sets the delta time.
	*
	* @deprecated Use time instead.
	* @param {Number} value - The delta time in seconds.
	*/
	setDeltaTime(value) {
		this.uniforms.time.value += value;
	}
	/**
	* Copies the settings of the given camera.
	*
	* @deprecated Use copyCameraSettings instead.
	* @param {Camera} camera - A camera.
	*/
	adoptCameraSettings(camera) {
		this.copyCameraSettings(camera);
	}
	/**
	* Copies the settings of the given camera.
	*
	* @param {Camera} camera - A camera.
	*/
	copyCameraSettings(camera) {
		if (camera) {
			this.uniforms.cameraNear.value = camera.near;
			this.uniforms.cameraFar.value = camera.far;
			if (camera instanceof PerspectiveCamera) this.defines.PERSPECTIVE_CAMERA = "1";
			else delete this.defines.PERSPECTIVE_CAMERA;
			this.needsUpdate = true;
		}
	}
	/**
	* Sets the resolution.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		const uniforms = this.uniforms;
		uniforms.resolution.value.set(width, height);
		uniforms.texelSize.value.set(1 / width, 1 / height);
		uniforms.aspect.value = width / height;
	}
	/**
	* An enumeration of shader code placeholders.
	*
	* @deprecated Use EffectShaderSection instead.
	* @type {Object}
	*/
	static get Section() {
		return EffectShaderSection;
	}
};
Number("184".replace(/\D+/g, ""));
var unpackDownscale = 255 / 256;
new Float32Array([
	unpackDownscale / 256 ** 3,
	unpackDownscale / 256 ** 2,
	unpackDownscale / 256,
	unpackDownscale
]);
new Float32Array([
	unpackDownscale,
	unpackDownscale / 256,
	unpackDownscale / 256 ** 2,
	1 / 256 ** 3
]);
function prefixSubstrings(prefix, substrings, strings) {
	for (const substring of substrings) {
		const prefixed = "$1" + prefix + substring.charAt(0).toUpperCase() + substring.slice(1);
		const regExp = new RegExp("([^\\.])(\\b" + substring + "\\b)", "g");
		for (const entry of strings.entries()) if (entry[1] !== null) strings.set(entry[0], entry[1].replace(regExp, prefixed));
	}
}
function integrateEffect(prefix, effect, data) {
	let fragmentShader = effect.getFragmentShader();
	let vertexShader = effect.getVertexShader();
	const mainImageExists = fragmentShader !== void 0 && /mainImage/.test(fragmentShader);
	const mainUvExists = fragmentShader !== void 0 && /mainUv/.test(fragmentShader);
	data.attributes |= effect.getAttributes();
	if (fragmentShader === void 0) throw new Error(`Missing fragment shader (${effect.name})`);
	else if (mainUvExists && (data.attributes & EffectAttribute.CONVOLUTION) !== 0) throw new Error(`Effects that transform UVs are incompatible with convolution effects (${effect.name})`);
	else if (!mainImageExists && !mainUvExists) throw new Error(`Could not find mainImage or mainUv function (${effect.name})`);
	else {
		const functionRegExp = /\w+\s+(\w+)\([\w\s,]*\)\s*{/g;
		const shaderParts = data.shaderParts;
		let fragmentHead = shaderParts.get(EffectShaderSection.FRAGMENT_HEAD) || "";
		let fragmentMainUv = shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_UV) || "";
		let fragmentMainImage = shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_IMAGE) || "";
		let vertexHead = shaderParts.get(EffectShaderSection.VERTEX_HEAD) || "";
		let vertexMainSupport = shaderParts.get(EffectShaderSection.VERTEX_MAIN_SUPPORT) || "";
		const varyings = /* @__PURE__ */ new Set();
		const names = /* @__PURE__ */ new Set();
		if (mainUvExists) {
			fragmentMainUv += `	${prefix}MainUv(UV);
`;
			data.uvTransformation = true;
		}
		if (vertexShader !== null && /mainSupport/.test(vertexShader)) {
			const needsUv = /mainSupport *\([\w\s]*?uv\s*?\)/.test(vertexShader);
			vertexMainSupport += `	${prefix}MainSupport(`;
			vertexMainSupport += needsUv ? "vUv);\n" : ");\n";
			for (const m2 of vertexShader.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g)) for (const n of m2[1].split(/\s*,\s*/)) {
				data.varyings.add(n);
				varyings.add(n);
				names.add(n);
			}
			for (const m2 of vertexShader.matchAll(functionRegExp)) names.add(m2[1]);
		}
		for (const m2 of fragmentShader.matchAll(functionRegExp)) names.add(m2[1]);
		for (const d of effect.defines.keys()) names.add(d.replace(/\([\w\s,]*\)/g, ""));
		for (const u of effect.uniforms.keys()) names.add(u);
		names.delete("while");
		names.delete("for");
		names.delete("if");
		effect.uniforms.forEach((val, key) => data.uniforms.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), val));
		effect.defines.forEach((val, key) => data.defines.set(prefix + key.charAt(0).toUpperCase() + key.slice(1), val));
		const shaders = /* @__PURE__ */ new Map([["fragment", fragmentShader], ["vertex", vertexShader]]);
		prefixSubstrings(prefix, names, data.defines);
		prefixSubstrings(prefix, names, shaders);
		fragmentShader = shaders.get("fragment");
		vertexShader = shaders.get("vertex");
		const blendMode = effect.blendMode;
		data.blendModes.set(blendMode.blendFunction, blendMode);
		if (mainImageExists) {
			if (effect.inputColorSpace !== null && effect.inputColorSpace !== data.colorSpace) fragmentMainImage += effect.inputColorSpace === "srgb" ? "color0 = sRGBTransferOETF(color0);\n	" : "color0 = sRGBToLinear(color0);\n	";
			if (effect.outputColorSpace !== "") data.colorSpace = effect.outputColorSpace;
			else if (effect.inputColorSpace !== null) data.colorSpace = effect.inputColorSpace;
			const depthParamRegExp = /MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;
			fragmentMainImage += `${prefix}MainImage(color0, UV, `;
			if ((data.attributes & EffectAttribute.DEPTH) !== 0 && depthParamRegExp.test(fragmentShader)) {
				fragmentMainImage += "depth, ";
				data.readDepth = true;
			}
			fragmentMainImage += "color1);\n	";
			const blendOpacity = prefix + "BlendOpacity";
			data.uniforms.set(blendOpacity, blendMode.opacity);
			fragmentMainImage += `color0 = blend${blendMode.blendFunction}(color0, color1, ${blendOpacity});

	`;
			fragmentHead += `uniform float ${blendOpacity};

`;
		}
		fragmentHead += fragmentShader + "\n";
		if (vertexShader !== null) vertexHead += vertexShader + "\n";
		shaderParts.set(EffectShaderSection.FRAGMENT_HEAD, fragmentHead);
		shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_UV, fragmentMainUv);
		shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_IMAGE, fragmentMainImage);
		shaderParts.set(EffectShaderSection.VERTEX_HEAD, vertexHead);
		shaderParts.set(EffectShaderSection.VERTEX_MAIN_SUPPORT, vertexMainSupport);
		if (effect.extensions !== null) for (const extension of effect.extensions) data.extensions.add(extension);
	}
}
var EffectPass = class extends Pass {
	/**
	* Constructs a new effect pass.
	*
	* @param {Camera} camera - The main camera.
	* @param {...Effect} effects - The effects that will be rendered by this pass.
	*/
	constructor(camera, ...effects) {
		super("EffectPass");
		this.fullscreenMaterial = new EffectMaterial(null, null, null, camera);
		this.listener = (event) => this.handleEvent(event);
		this.effects = [];
		this.setEffects(effects);
		this.skipRendering = false;
		this.minTime = 1;
		this.maxTime = Number.POSITIVE_INFINITY;
		this.timeScale = 1;
	}
	set mainScene(value) {
		for (const effect of this.effects) effect.mainScene = value;
	}
	set mainCamera(value) {
		this.fullscreenMaterial.copyCameraSettings(value);
		for (const effect of this.effects) effect.mainCamera = value;
	}
	/**
	* Indicates whether this pass encodes its output when rendering to screen.
	*
	* @type {Boolean}
	* @deprecated Use fullscreenMaterial.encodeOutput instead.
	*/
	get encodeOutput() {
		return this.fullscreenMaterial.encodeOutput;
	}
	set encodeOutput(value) {
		this.fullscreenMaterial.encodeOutput = value;
	}
	/**
	* Indicates whether dithering is enabled.
	*
	* @type {Boolean}
	*/
	get dithering() {
		return this.fullscreenMaterial.dithering;
	}
	set dithering(value) {
		const material = this.fullscreenMaterial;
		material.dithering = value;
		material.needsUpdate = true;
	}
	/**
	* Sets the effects.
	*
	* @param {Effect[]} effects - The effects.
	* @protected
	*/
	setEffects(effects) {
		for (const effect of this.effects) effect.removeEventListener("change", this.listener);
		this.effects = effects.sort((a, b) => b.attributes - a.attributes);
		for (const effect of this.effects) effect.addEventListener("change", this.listener);
	}
	/**
	* Updates the compound shader material.
	*
	* @protected
	*/
	updateMaterial() {
		const data = new EffectShaderData();
		let id = 0;
		for (const effect of this.effects) if (effect.blendMode.blendFunction === BlendFunction.DST) data.attributes |= effect.getAttributes() & EffectAttribute.DEPTH;
		else if ((data.attributes & effect.getAttributes() & EffectAttribute.CONVOLUTION) !== 0) throw new Error(`Convolution effects cannot be merged (${effect.name})`);
		else integrateEffect("e" + id++, effect, data);
		let fragmentHead = data.shaderParts.get(EffectShaderSection.FRAGMENT_HEAD);
		let fragmentMainImage = data.shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_IMAGE);
		let fragmentMainUv = data.shaderParts.get(EffectShaderSection.FRAGMENT_MAIN_UV);
		const blendRegExp = /\bblend\b/g;
		for (const blendMode of data.blendModes.values()) fragmentHead += blendMode.getShaderCode().replace(blendRegExp, `blend${blendMode.blendFunction}`) + "\n";
		if ((data.attributes & EffectAttribute.DEPTH) !== 0) {
			if (data.readDepth) fragmentMainImage = "float depth = readDepth(UV);\n\n	" + fragmentMainImage;
			this.needsDepthTexture = this.getDepthTexture() === null;
		} else this.needsDepthTexture = false;
		if (data.colorSpace === "srgb") fragmentMainImage += "color0 = sRGBToLinear(color0);\n	";
		if (data.uvTransformation) {
			fragmentMainUv = "vec2 transformedUv = vUv;\n" + fragmentMainUv;
			data.defines.set("UV", "transformedUv");
		} else data.defines.set("UV", "vUv");
		data.shaderParts.set(EffectShaderSection.FRAGMENT_HEAD, fragmentHead);
		data.shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_IMAGE, fragmentMainImage);
		data.shaderParts.set(EffectShaderSection.FRAGMENT_MAIN_UV, fragmentMainUv);
		for (const [key, value] of data.shaderParts) if (value !== null) data.shaderParts.set(key, value.trim().replace(/^#/, "\n#"));
		this.skipRendering = id === 0;
		this.needsSwap = !this.skipRendering;
		this.fullscreenMaterial.setShaderData(data);
	}
	/**
	* Rebuilds the shader material.
	*/
	recompile() {
		this.updateMaterial();
	}
	/**
	* Returns the current depth texture.
	*
	* @return {Texture} The current depth texture, or null if there is none.
	*/
	getDepthTexture() {
		return this.fullscreenMaterial.depthBuffer;
	}
	/**
	* Sets the depth texture.
	*
	* @param {Texture} depthTexture - A depth texture.
	* @param {DepthPackingStrategies} [depthPacking=BasicDepthPacking] - The depth packing.
	*/
	setDepthTexture(depthTexture, depthPacking = BasicDepthPacking) {
		this.fullscreenMaterial.depthBuffer = depthTexture;
		this.fullscreenMaterial.depthPacking = depthPacking;
		for (const effect of this.effects) effect.setDepthTexture(depthTexture, depthPacking);
	}
	/**
	* Renders the effect.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		for (const effect of this.effects) effect.update(renderer, inputBuffer, deltaTime);
		if (!this.skipRendering || this.renderToScreen) {
			const material = this.fullscreenMaterial;
			material.inputBuffer = inputBuffer.texture;
			material.time += deltaTime * this.timeScale;
			renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
			renderer.render(this.scene, this.camera);
		}
	}
	/**
	* Updates the size of this pass.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		this.fullscreenMaterial.setSize(width, height);
		for (const effect of this.effects) effect.setSize(width, height);
	}
	/**
	* Performs initialization tasks.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {Boolean} alpha - Whether the renderer uses the alpha channel or not.
	* @param {Number} frameBufferType - The type of the main frame buffers.
	*/
	initialize(renderer, alpha, frameBufferType) {
		this.renderer = renderer;
		for (const effect of this.effects) effect.initialize(renderer, alpha, frameBufferType);
		this.updateMaterial();
		if (frameBufferType !== void 0 && frameBufferType !== 1009) this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH = "1";
	}
	/**
	* Deletes disposable objects.
	*/
	dispose() {
		super.dispose();
		for (const effect of this.effects) {
			effect.removeEventListener("change", this.listener);
			effect.dispose();
		}
	}
	/**
	* Handles events.
	*
	* @param {Event} event - An event.
	*/
	handleEvent(event) {
		switch (event.type) {
			case "change":
				this.recompile();
				break;
		}
	}
};
var NormalPass = class extends Pass {
	/**
	* Constructs a new normal pass.
	*
	* @param {Scene} scene - The scene to render.
	* @param {Camera} camera - The camera to use to render the scene.
	* @param {Object} [options] - The options.
	* @param {WebGLRenderTarget} [options.renderTarget] - A custom render target.
	* @param {Number} [options.resolutionScale=1.0] - The resolution scale.
	* @param {Number} [options.resolutionX=Resolution.AUTO_SIZE] - The horizontal resolution.
	* @param {Number} [options.resolutionY=Resolution.AUTO_SIZE] - The vertical resolution.
	* @param {Number} [options.width=Resolution.AUTO_SIZE] - Deprecated. Use resolutionX instead.
	* @param {Number} [options.height=Resolution.AUTO_SIZE] - Deprecated. Use resolutionY instead.
	*/
	constructor(scene, camera, { renderTarget, resolutionScale = 1, width = Resolution.AUTO_SIZE, height = Resolution.AUTO_SIZE, resolutionX = width, resolutionY = height } = {}) {
		super("NormalPass");
		this.needsSwap = false;
		this.renderPass = new RenderPass(scene, camera, new MeshNormalMaterial());
		const renderPass = this.renderPass;
		renderPass.ignoreBackground = true;
		renderPass.skipShadowMapUpdate = true;
		const clearPass = renderPass.getClearPass();
		clearPass.overrideClearColor = new Color(7829503);
		clearPass.overrideClearAlpha = 1;
		this.renderTarget = renderTarget;
		if (this.renderTarget === void 0) {
			this.renderTarget = new WebGLRenderTarget(1, 1, {
				minFilter: NearestFilter,
				magFilter: NearestFilter
			});
			this.renderTarget.texture.name = "NormalPass.Target";
		}
		const resolution = this.resolution = new Resolution(this, resolutionX, resolutionY, resolutionScale);
		resolution.addEventListener("change", (e) => this.setSize(resolution.baseWidth, resolution.baseHeight));
	}
	set mainScene(value) {
		this.renderPass.mainScene = value;
	}
	set mainCamera(value) {
		this.renderPass.mainCamera = value;
	}
	/**
	* The normal texture.
	*
	* @type {Texture}
	*/
	get texture() {
		return this.renderTarget.texture;
	}
	/**
	* The normal texture.
	*
	* @deprecated Use texture instead.
	* @return {Texture} The texture.
	*/
	getTexture() {
		return this.renderTarget.texture;
	}
	/**
	* Returns the resolution settings.
	*
	* @deprecated Use resolution instead.
	* @return {Resolution} The resolution.
	*/
	getResolution() {
		return this.resolution;
	}
	/**
	* Returns the current resolution scale.
	*
	* @return {Number} The resolution scale.
	* @deprecated Use resolution.preferredWidth or resolution.preferredHeight instead.
	*/
	getResolutionScale() {
		return this.resolution.scale;
	}
	/**
	* Sets the resolution scale.
	*
	* @param {Number} scale - The new resolution scale.
	* @deprecated Use resolution.preferredWidth or resolution.preferredHeight instead.
	*/
	setResolutionScale(scale) {
		this.resolution.scale = scale;
	}
	/**
	* Renders the scene normals.
	*
	* @param {WebGLRenderer} renderer - The renderer.
	* @param {WebGLRenderTarget} inputBuffer - A frame buffer that contains the result of the previous pass.
	* @param {WebGLRenderTarget} outputBuffer - A frame buffer that serves as the output render target unless this pass renders to screen.
	* @param {Number} [deltaTime] - The time between the last frame and the current one in seconds.
	* @param {Boolean} [stencilTest] - Indicates whether a stencil mask is active.
	*/
	render(renderer, inputBuffer, outputBuffer, deltaTime, stencilTest) {
		const renderTarget = this.renderToScreen ? null : this.renderTarget;
		this.renderPass.render(renderer, renderTarget, renderTarget);
	}
	/**
	* Updates the size of this pass.
	*
	* @param {Number} width - The width.
	* @param {Number} height - The height.
	*/
	setSize(width, height) {
		const resolution = this.resolution;
		resolution.setBaseSize(width, height);
		this.renderTarget.setSize(resolution.width, resolution.height);
	}
};
new Float32Array([
	0,
	0,
	0
]), new Float32Array([
	1,
	0,
	0
]), new Float32Array([
	1,
	1,
	0
]), new Float32Array([
	1,
	1,
	1
]), new Float32Array([
	0,
	0,
	0
]), new Float32Array([
	1,
	0,
	0
]), new Float32Array([
	1,
	0,
	1
]), new Float32Array([
	1,
	1,
	1
]), new Float32Array([
	0,
	0,
	0
]), new Float32Array([
	0,
	0,
	1
]), new Float32Array([
	1,
	0,
	1
]), new Float32Array([
	1,
	1,
	1
]), new Float32Array([
	0,
	0,
	0
]), new Float32Array([
	0,
	1,
	0
]), new Float32Array([
	1,
	1,
	0
]), new Float32Array([
	1,
	1,
	1
]), new Float32Array([
	0,
	0,
	0
]), new Float32Array([
	0,
	1,
	0
]), new Float32Array([
	0,
	1,
	1
]), new Float32Array([
	1,
	1,
	1
]), new Float32Array([
	0,
	0,
	0
]), new Float32Array([
	0,
	0,
	1
]), new Float32Array([
	0,
	1,
	1
]), new Float32Array([
	1,
	1,
	1
]);
new Float32Array([
	0,
	-.25,
	.25,
	-.125,
	.125,
	-.375,
	.375
]);
new Float32Array([0, 0]), new Float32Array([.25, -.25]), new Float32Array([-.25, .25]), new Float32Array([.125, -.125]), new Float32Array([-.125, .125]);
new Uint8Array([0, 0]), new Uint8Array([3, 0]), new Uint8Array([0, 3]), new Uint8Array([3, 3]), new Uint8Array([1, 0]), new Uint8Array([4, 0]), new Uint8Array([1, 3]), new Uint8Array([4, 3]), new Uint8Array([0, 1]), new Uint8Array([3, 1]), new Uint8Array([0, 4]), new Uint8Array([3, 4]), new Uint8Array([1, 1]), new Uint8Array([4, 1]), new Uint8Array([1, 4]), new Uint8Array([4, 4]);
new Uint8Array([0, 0]), new Uint8Array([1, 0]), new Uint8Array([0, 2]), new Uint8Array([1, 2]), new Uint8Array([2, 0]), new Uint8Array([3, 0]), new Uint8Array([2, 2]), new Uint8Array([3, 2]), new Uint8Array([0, 1]), new Uint8Array([1, 1]), new Uint8Array([0, 3]), new Uint8Array([1, 3]), new Uint8Array([2, 1]), new Uint8Array([3, 1]), new Uint8Array([2, 3]), new Uint8Array([3, 3]);
bilinear(0, 0, 0, 0), new Float32Array([
	0,
	0,
	0,
	0
]), bilinear(0, 0, 0, 1), new Float32Array([
	0,
	0,
	0,
	1
]), bilinear(0, 0, 1, 0), new Float32Array([
	0,
	0,
	1,
	0
]), bilinear(0, 0, 1, 1), new Float32Array([
	0,
	0,
	1,
	1
]), bilinear(0, 1, 0, 0), new Float32Array([
	0,
	1,
	0,
	0
]), bilinear(0, 1, 0, 1), new Float32Array([
	0,
	1,
	0,
	1
]), bilinear(0, 1, 1, 0), new Float32Array([
	0,
	1,
	1,
	0
]), bilinear(0, 1, 1, 1), new Float32Array([
	0,
	1,
	1,
	1
]), bilinear(1, 0, 0, 0), new Float32Array([
	1,
	0,
	0,
	0
]), bilinear(1, 0, 0, 1), new Float32Array([
	1,
	0,
	0,
	1
]), bilinear(1, 0, 1, 0), new Float32Array([
	1,
	0,
	1,
	0
]), bilinear(1, 0, 1, 1), new Float32Array([
	1,
	0,
	1,
	1
]), bilinear(1, 1, 0, 0), new Float32Array([
	1,
	1,
	0,
	0
]), bilinear(1, 1, 0, 1), new Float32Array([
	1,
	1,
	0,
	1
]), bilinear(1, 1, 1, 0), new Float32Array([
	1,
	1,
	1,
	0
]), bilinear(1, 1, 1, 1), new Float32Array([
	1,
	1,
	1,
	1
]);
function lerp2(a, b, p) {
	return a + (b - a) * p;
}
function bilinear(e0, e1, e2, e3) {
	return lerp2(lerp2(e0, e1, .75), lerp2(e2, e3, .75), .875);
}
//#endregion
//#region node_modules/@react-three/postprocessing/node_modules/maath/dist/objectSpread2-284232a6.esm.js
function _defineProperty(obj, key, value) {
	if (key in obj) Object.defineProperty(obj, key, {
		value,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else obj[key] = value;
	return obj;
}
//#endregion
//#region node_modules/@react-three/postprocessing/node_modules/maath/dist/isNativeReflectConstruct-5594d075.esm.js
function _setPrototypeOf(o, p) {
	_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf(o, p);
}
new Vector2();
new Vector2();
//#endregion
//#region node_modules/@react-three/postprocessing/node_modules/maath/dist/classCallCheck-9098b006.esm.js
function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
//#endregion
//#region node_modules/@react-three/postprocessing/node_modules/maath/dist/index-43782085.esm.js
var Grad = function Grad(x, y, z) {
	var _this = this;
	_classCallCheck(this, Grad);
	_defineProperty(this, "dot2", function(x, y) {
		return _this.x * x + _this.y * y;
	});
	_defineProperty(this, "dot3", function(x, y, z) {
		return _this.x * x + _this.y * y + _this.z * z;
	});
	this.x = x;
	this.y = y;
	this.z = z;
};
var grad3 = [
	new Grad(1, 1, 0),
	new Grad(-1, 1, 0),
	new Grad(1, -1, 0),
	new Grad(-1, -1, 0),
	new Grad(1, 0, 1),
	new Grad(-1, 0, 1),
	new Grad(1, 0, -1),
	new Grad(-1, 0, -1),
	new Grad(0, 1, 1),
	new Grad(0, -1, 1),
	new Grad(0, 1, -1),
	new Grad(0, -1, -1)
];
var p = [
	151,
	160,
	137,
	91,
	90,
	15,
	131,
	13,
	201,
	95,
	96,
	53,
	194,
	233,
	7,
	225,
	140,
	36,
	103,
	30,
	69,
	142,
	8,
	99,
	37,
	240,
	21,
	10,
	23,
	190,
	6,
	148,
	247,
	120,
	234,
	75,
	0,
	26,
	197,
	62,
	94,
	252,
	219,
	203,
	117,
	35,
	11,
	32,
	57,
	177,
	33,
	88,
	237,
	149,
	56,
	87,
	174,
	20,
	125,
	136,
	171,
	168,
	68,
	175,
	74,
	165,
	71,
	134,
	139,
	48,
	27,
	166,
	77,
	146,
	158,
	231,
	83,
	111,
	229,
	122,
	60,
	211,
	133,
	230,
	220,
	105,
	92,
	41,
	55,
	46,
	245,
	40,
	244,
	102,
	143,
	54,
	65,
	25,
	63,
	161,
	1,
	216,
	80,
	73,
	209,
	76,
	132,
	187,
	208,
	89,
	18,
	169,
	200,
	196,
	135,
	130,
	116,
	188,
	159,
	86,
	164,
	100,
	109,
	198,
	173,
	186,
	3,
	64,
	52,
	217,
	226,
	250,
	124,
	123,
	5,
	202,
	38,
	147,
	118,
	126,
	255,
	82,
	85,
	212,
	207,
	206,
	59,
	227,
	47,
	16,
	58,
	17,
	182,
	189,
	28,
	42,
	223,
	183,
	170,
	213,
	119,
	248,
	152,
	2,
	44,
	154,
	163,
	70,
	221,
	153,
	101,
	155,
	167,
	43,
	172,
	9,
	129,
	22,
	39,
	253,
	19,
	98,
	108,
	110,
	79,
	113,
	224,
	232,
	178,
	185,
	112,
	104,
	218,
	246,
	97,
	228,
	251,
	34,
	242,
	193,
	238,
	210,
	144,
	12,
	191,
	179,
	162,
	241,
	81,
	51,
	145,
	235,
	249,
	14,
	239,
	107,
	49,
	192,
	214,
	31,
	181,
	199,
	106,
	157,
	184,
	84,
	204,
	176,
	115,
	121,
	50,
	45,
	127,
	4,
	150,
	254,
	138,
	236,
	205,
	93,
	222,
	114,
	67,
	29,
	24,
	72,
	243,
	141,
	128,
	195,
	78,
	66,
	215,
	61,
	156,
	180
];
var perm = new Array(512);
var gradP = new Array(512);
(function seed(_seed) {
	if (_seed > 0 && _seed < 1) _seed *= 65536;
	_seed = Math.floor(_seed);
	if (_seed < 256) _seed |= _seed << 8;
	for (var i = 0; i < 256; i++) {
		var v;
		if (i & 1) v = p[i] ^ _seed & 255;
		else v = p[i] ^ _seed >> 8 & 255;
		perm[i] = perm[i + 256] = v;
		gradP[i] = gradP[i + 256] = grad3[v % 12];
	}
})(0);
.5 * (Math.sqrt(3) - 1);
(3 - Math.sqrt(3)) / 6;
Math.PI * 2;
function normalizeSeed(seed) {
	if (typeof seed === "number") seed = Math.abs(seed);
	else if (typeof seed === "string") {
		var string = seed;
		seed = 0;
		for (var i = 0; i < string.length; i++) seed = (seed + (i + 1) * (string.charCodeAt(i) % 96)) % 2147483647;
	}
	if (seed === 0) seed = 311;
	return seed;
}
function lcgRandom(seed) {
	var state = normalizeSeed(seed);
	return function() {
		var result = state * 48271 % 2147483647;
		state = result;
		return result / 2147483647;
	};
}
new function Generator(_seed) {
	var _this = this;
	_classCallCheck(this, Generator);
	_defineProperty(this, "seed", 0);
	_defineProperty(this, "init", function(seed) {
		_this.seed = seed;
		_this.value = lcgRandom(seed);
	});
	_defineProperty(this, "value", lcgRandom(this.seed));
	this.init(_seed);
}(Math.random());
function _getPrototypeOf(o) {
	_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf(o);
}
Uint8Array.from(atob(`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`), (c) => c.charCodeAt(0));
parseInt("184".replace(/\D+/g, ""));
//#endregion
//#region node_modules/@react-three/postprocessing/dist/index.js
var import_jsx_runtime = require_jsx_runtime(), import_react = /* @__PURE__ */ __toESM(require_react(), 1), D = /* @__PURE__ */ (0, import_react.createContext)(null), ie = (e) => (e.getAttributes() & 2) === 2, dt = /* @__PURE__ */ (0, import_react.memo)(/* @__PURE__ */ (0, import_react.forwardRef)(({ children: e, camera: t, scene: o, resolutionScale: r, enabled: a = !0, renderPriority: n = 1, autoClear: i = !0, depthBuffer: s, enableNormalPass: l, stencilBuffer: p, multisampling: _ = 8, frameBufferType: S = HalfFloatType }, g) => {
	const { gl: d, scene: m, camera: v, size: x } = useThree(), f = o || m, u = t || v, [c, U, b] = (0, import_react.useMemo)(() => {
		const C = new EffectComposer(d, {
			depthBuffer: s,
			stencilBuffer: p,
			multisampling: _,
			frameBufferType: S
		});
		C.addPass(new RenderPass(f, u));
		let R = null, E = null;
		return l && (E = new NormalPass(f, u), E.enabled = !1, C.addPass(E), r !== void 0 && (R = new DepthDownsamplingPass({
			normalBuffer: E.texture,
			resolutionScale: r
		}), R.enabled = !1, C.addPass(R))), [
			C,
			E,
			R
		];
	}, [
		u,
		d,
		s,
		p,
		_,
		S,
		f,
		l,
		r
	]);
	(0, import_react.useEffect)(() => c?.setSize(x.width, x.height), [c, x]), useFrame((C, R) => {
		if (a) {
			const E = d.autoClear;
			d.autoClear = i, p && !i && d.clearStencil(), c.render(R), d.autoClear = E;
		}
	}, a ? n : 0);
	const F = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const C = [], R = F.current.__r3f;
		if (R && c) {
			const E = R.children;
			for (let T = 0; T < E.length; T++) {
				const N = E[T].object;
				if (N instanceof Effect) {
					const q = [N];
					if (!ie(N)) {
						let G = null;
						for (; (G = E[T + 1]?.object) instanceof Effect && !ie(G);) q.push(G), T++;
					}
					const $ = new EffectPass(u, ...q);
					C.push($);
				} else N instanceof Pass && C.push(N);
			}
			for (const T of C) c?.addPass(T);
			U && (U.enabled = !0), b && (b.enabled = !0);
		}
		return () => {
			for (const E of C) c?.removePass(E);
			U && (U.enabled = !1), b && (b.enabled = !1);
		};
	}, [
		c,
		e,
		u,
		U,
		b
	]), (0, import_react.useEffect)(() => {
		const C = d.toneMapping;
		return d.toneMapping = 0, () => {
			d.toneMapping = C;
		};
	}, [d]);
	const X = (0, import_react.useMemo)(() => ({
		composer: c,
		normalPass: U,
		downSamplingPass: b,
		resolutionScale: r,
		camera: u,
		scene: f
	}), [
		c,
		U,
		b,
		r,
		u,
		f
	]);
	return (0, import_react.useImperativeHandle)(g, () => c, [c]), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(D.Provider, {
		value: X,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
			ref: F,
			children: e
		})
	});
})), vt = 0, le = /* @__PURE__ */ new WeakMap(), P = (e, t) => function({ blendFunction: o = t?.blendFunction, opacity: r = t?.opacity, ...a }) {
	let n = le.get(e);
	if (!n) {
		const l = `@react-three/postprocessing/${e.name}-${vt++}`;
		extend({ [l]: e }), le.set(e, n = l);
	}
	const i = useThree((l) => l.camera), s = import_react.useMemo(() => [...t?.args ?? [], ...a.args ?? [{
		...t,
		...a
	}]], [JSON.stringify(a)]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n, {
		camera: i,
		"blendMode-blendFunction": o,
		"blendMode-opacity-value": r,
		...a,
		args: s
	});
}, wt = /* @__PURE__ */ P(BloomEffect, { blendFunction: 0 }), yt = /* @__PURE__ */ P(ChromaticAberrationEffect), It = /* @__PURE__ */ (0, import_react.forwardRef)(function(e, t) {
	const { camera: o, normalPass: r, downSamplingPass: a, resolutionScale: n } = (0, import_react.useContext)(D);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", {
		ref: t,
		object: (0, import_react.useMemo)(() => r === null && a === null ? (console.error("Please enable the NormalPass in the EffectComposer in order to use SSAO."), {}) : new SSAOEffect(o, r && !a ? r.texture : null, {
			blendFunction: 21,
			samples: 30,
			rings: 4,
			distanceThreshold: 1,
			distanceFalloff: 0,
			rangeThreshold: .5,
			rangeFalloff: .1,
			luminanceInfluence: .9,
			radius: 20,
			bias: .5,
			intensity: 1,
			color: void 0,
			normalDepthBuffer: a ? a.texture : null,
			resolutionScale: n ?? 1,
			depthAwareUpsampling: !0,
			...e
		}), [
			o,
			a,
			r,
			n
		]),
		dispose: null
	});
}), qt = /* @__PURE__ */ P(VignetteEffect);
//#endregion
export { yt as a, wt as i, dt as n, qt as r, It as t };
