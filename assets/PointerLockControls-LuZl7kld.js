import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { Rt as Vector3, j as Euler, s as useThree } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as _extends } from "./extends-DijYlAKA.js";
import { t as EventDispatcher } from "./EventDispatcher-DmhwHaXM.js";
//#region node_modules/three-stdlib/controls/PointerLockControls.js
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __publicField = (obj, key, value) => {
	__defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
	return value;
};
var _euler = /* @__PURE__ */ new Euler(0, 0, 0, "YXZ");
var _vector = /* @__PURE__ */ new Vector3();
var _changeEvent = { type: "change" };
var _lockEvent = { type: "lock" };
var _unlockEvent = { type: "unlock" };
var _MOUSE_SENSITIVITY = .002;
var _PI_2 = Math.PI / 2;
var PointerLockControls$1 = class extends EventDispatcher {
	constructor(camera, domElement) {
		super();
		__publicField(this, "camera");
		__publicField(this, "domElement");
		__publicField(this, "isLocked");
		__publicField(this, "minPolarAngle");
		__publicField(this, "maxPolarAngle");
		__publicField(this, "pointerSpeed");
		__publicField(this, "onMouseMove", (event) => {
			if (!this.domElement || this.isLocked === false) return;
			_euler.setFromQuaternion(this.camera.quaternion);
			_euler.y -= event.movementX * _MOUSE_SENSITIVITY * this.pointerSpeed;
			_euler.x -= event.movementY * _MOUSE_SENSITIVITY * this.pointerSpeed;
			_euler.x = Math.max(_PI_2 - this.maxPolarAngle, Math.min(_PI_2 - this.minPolarAngle, _euler.x));
			this.camera.quaternion.setFromEuler(_euler);
			this.dispatchEvent(_changeEvent);
		});
		__publicField(this, "onPointerlockChange", () => {
			if (!this.domElement) return;
			if (this.domElement.ownerDocument.pointerLockElement === this.domElement) {
				this.dispatchEvent(_lockEvent);
				this.isLocked = true;
			} else {
				this.dispatchEvent(_unlockEvent);
				this.isLocked = false;
			}
		});
		__publicField(this, "onPointerlockError", () => {
			console.error("THREE.PointerLockControls: Unable to use Pointer Lock API");
		});
		__publicField(this, "connect", (domElement) => {
			this.domElement = domElement || this.domElement;
			if (!this.domElement) return;
			this.domElement.ownerDocument.addEventListener("mousemove", this.onMouseMove);
			this.domElement.ownerDocument.addEventListener("pointerlockchange", this.onPointerlockChange);
			this.domElement.ownerDocument.addEventListener("pointerlockerror", this.onPointerlockError);
		});
		__publicField(this, "disconnect", () => {
			if (!this.domElement) return;
			this.domElement.ownerDocument.removeEventListener("mousemove", this.onMouseMove);
			this.domElement.ownerDocument.removeEventListener("pointerlockchange", this.onPointerlockChange);
			this.domElement.ownerDocument.removeEventListener("pointerlockerror", this.onPointerlockError);
		});
		__publicField(this, "dispose", () => {
			this.disconnect();
		});
		__publicField(this, "getObject", () => {
			return this.camera;
		});
		__publicField(this, "direction", new Vector3(0, 0, -1));
		__publicField(this, "getDirection", (v) => {
			return v.copy(this.direction).applyQuaternion(this.camera.quaternion);
		});
		__publicField(this, "moveForward", (distance) => {
			_vector.setFromMatrixColumn(this.camera.matrix, 0);
			_vector.crossVectors(this.camera.up, _vector);
			this.camera.position.addScaledVector(_vector, distance);
		});
		__publicField(this, "moveRight", (distance) => {
			_vector.setFromMatrixColumn(this.camera.matrix, 0);
			this.camera.position.addScaledVector(_vector, distance);
		});
		__publicField(this, "lock", () => {
			if (this.domElement) this.domElement.requestPointerLock();
		});
		__publicField(this, "unlock", () => {
			if (this.domElement) this.domElement.ownerDocument.exitPointerLock();
		});
		this.camera = camera;
		this.domElement = domElement;
		this.isLocked = false;
		this.minPolarAngle = 0;
		this.maxPolarAngle = Math.PI;
		this.pointerSpeed = 1;
		if (domElement) this.connect(domElement);
	}
};
//#endregion
//#region node_modules/@react-three/drei/core/PointerLockControls.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var PointerLockControls = /* @__PURE__ */ import_react.forwardRef(({ domElement, selector, onChange, onLock, onUnlock, enabled = true, makeDefault, ...props }, ref) => {
	const { camera, ...rest } = props;
	const setEvents = useThree((state) => state.setEvents);
	const gl = useThree((state) => state.gl);
	const defaultCamera = useThree((state) => state.camera);
	const invalidate = useThree((state) => state.invalidate);
	const events = useThree((state) => state.events);
	const get = useThree((state) => state.get);
	const set = useThree((state) => state.set);
	const explCamera = camera || defaultCamera;
	const explDomElement = domElement || events.connected || gl.domElement;
	const controls = import_react.useMemo(() => new PointerLockControls$1(explCamera), [explCamera]);
	import_react.useEffect(() => {
		if (enabled) {
			controls.connect(explDomElement);
			const oldComputeOffsets = get().events.compute;
			setEvents({ compute(event, state) {
				const offsetX = state.size.width / 2;
				const offsetY = state.size.height / 2;
				state.pointer.set(offsetX / state.size.width * 2 - 1, -(offsetY / state.size.height) * 2 + 1);
				state.raycaster.setFromCamera(state.pointer, state.camera);
			} });
			return () => {
				controls.disconnect();
				setEvents({ compute: oldComputeOffsets });
			};
		}
	}, [enabled, controls]);
	import_react.useEffect(() => {
		const callback = (e) => {
			invalidate();
			if (onChange) onChange(e);
		};
		controls.addEventListener("change", callback);
		if (onLock) controls.addEventListener("lock", onLock);
		if (onUnlock) controls.addEventListener("unlock", onUnlock);
		const handler = () => controls.lock();
		const elements = selector ? Array.from(document.querySelectorAll(selector)) : [document];
		elements.forEach((element) => element && element.addEventListener("click", handler));
		return () => {
			controls.removeEventListener("change", callback);
			if (onLock) controls.removeEventListener("lock", onLock);
			if (onUnlock) controls.removeEventListener("unlock", onUnlock);
			elements.forEach((element) => element ? element.removeEventListener("click", handler) : void 0);
		};
	}, [
		onChange,
		onLock,
		onUnlock,
		selector,
		controls,
		invalidate
	]);
	import_react.useEffect(() => {
		if (makeDefault) {
			const old = get().controls;
			set({ controls });
			return () => set({ controls: old });
		}
	}, [makeDefault, controls]);
	return /* @__PURE__ */ import_react.createElement("primitive", _extends({
		ref,
		object: controls
	}, rest));
});
//#endregion
export { PointerLockControls as t };
