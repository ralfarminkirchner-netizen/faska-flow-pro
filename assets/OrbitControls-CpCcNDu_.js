import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { Lt as Vector2, Ot as Spherical, Rt as Vector3, Z as MOUSE, a as useFrame, dt as PerspectiveCamera, ft as Plane, kt as TOUCH, mt as Quaternion, s as useThree, ut as OrthographicCamera, vt as Ray } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as _extends } from "./extends-DijYlAKA.js";
import { t as EventDispatcher } from "./EventDispatcher-DmhwHaXM.js";
//#region node_modules/three-stdlib/controls/OrbitControls.js
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
var _ray = /* @__PURE__ */ new Ray();
var _plane = /* @__PURE__ */ new Plane();
var TILT_LIMIT = Math.cos(70 * (Math.PI / 180));
var moduloWrapAround = (offset, capacity) => (offset % capacity + capacity) % capacity;
var OrbitControls$1 = class extends EventDispatcher {
	constructor(object, domElement) {
		super();
		__publicField(this, "object");
		__publicField(this, "domElement");
		__publicField(this, "enabled", true);
		__publicField(this, "target", new Vector3());
		__publicField(this, "minDistance", 0);
		__publicField(this, "maxDistance", Infinity);
		__publicField(this, "minZoom", 0);
		__publicField(this, "maxZoom", Infinity);
		__publicField(this, "minPolarAngle", 0);
		__publicField(this, "maxPolarAngle", Math.PI);
		__publicField(this, "minAzimuthAngle", -Infinity);
		__publicField(this, "maxAzimuthAngle", Infinity);
		__publicField(this, "enableDamping", false);
		__publicField(this, "dampingFactor", .05);
		__publicField(this, "enableZoom", true);
		__publicField(this, "zoomSpeed", 1);
		__publicField(this, "enableRotate", true);
		__publicField(this, "rotateSpeed", 1);
		__publicField(this, "enablePan", true);
		__publicField(this, "panSpeed", 1);
		__publicField(this, "screenSpacePanning", true);
		__publicField(this, "keyPanSpeed", 7);
		__publicField(this, "zoomToCursor", false);
		__publicField(this, "autoRotate", false);
		__publicField(this, "autoRotateSpeed", 2);
		__publicField(this, "reverseOrbit", false);
		__publicField(this, "reverseHorizontalOrbit", false);
		__publicField(this, "reverseVerticalOrbit", false);
		__publicField(this, "keys", {
			LEFT: "ArrowLeft",
			UP: "ArrowUp",
			RIGHT: "ArrowRight",
			BOTTOM: "ArrowDown"
		});
		__publicField(this, "mouseButtons", {
			LEFT: MOUSE.ROTATE,
			MIDDLE: MOUSE.DOLLY,
			RIGHT: MOUSE.PAN
		});
		__publicField(this, "touches", {
			ONE: TOUCH.ROTATE,
			TWO: TOUCH.DOLLY_PAN
		});
		__publicField(this, "target0");
		__publicField(this, "position0");
		__publicField(this, "zoom0");
		__publicField(this, "_domElementKeyEvents", null);
		__publicField(this, "getPolarAngle");
		__publicField(this, "getAzimuthalAngle");
		__publicField(this, "setPolarAngle");
		__publicField(this, "setAzimuthalAngle");
		__publicField(this, "getDistance");
		__publicField(this, "getZoomScale");
		__publicField(this, "listenToKeyEvents");
		__publicField(this, "stopListenToKeyEvents");
		__publicField(this, "saveState");
		__publicField(this, "reset");
		__publicField(this, "update");
		__publicField(this, "connect");
		__publicField(this, "dispose");
		__publicField(this, "dollyIn");
		__publicField(this, "dollyOut");
		__publicField(this, "getScale");
		__publicField(this, "setScale");
		this.object = object;
		this.domElement = domElement;
		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;
		this.getPolarAngle = () => spherical.phi;
		this.getAzimuthalAngle = () => spherical.theta;
		this.setPolarAngle = (value) => {
			let phi = moduloWrapAround(value, 2 * Math.PI);
			let currentPhi = spherical.phi;
			if (currentPhi < 0) currentPhi += 2 * Math.PI;
			if (phi < 0) phi += 2 * Math.PI;
			let phiDist = Math.abs(phi - currentPhi);
			if (2 * Math.PI - phiDist < phiDist) if (phi < currentPhi) phi += 2 * Math.PI;
			else currentPhi += 2 * Math.PI;
			sphericalDelta.phi = phi - currentPhi;
			scope.update();
		};
		this.setAzimuthalAngle = (value) => {
			let theta = moduloWrapAround(value, 2 * Math.PI);
			let currentTheta = spherical.theta;
			if (currentTheta < 0) currentTheta += 2 * Math.PI;
			if (theta < 0) theta += 2 * Math.PI;
			let thetaDist = Math.abs(theta - currentTheta);
			if (2 * Math.PI - thetaDist < thetaDist) if (theta < currentTheta) theta += 2 * Math.PI;
			else currentTheta += 2 * Math.PI;
			sphericalDelta.theta = theta - currentTheta;
			scope.update();
		};
		this.getDistance = () => scope.object.position.distanceTo(scope.target);
		this.listenToKeyEvents = (domElement2) => {
			domElement2.addEventListener("keydown", onKeyDown);
			this._domElementKeyEvents = domElement2;
		};
		this.stopListenToKeyEvents = () => {
			this._domElementKeyEvents.removeEventListener("keydown", onKeyDown);
			this._domElementKeyEvents = null;
		};
		this.saveState = () => {
			scope.target0.copy(scope.target);
			scope.position0.copy(scope.object.position);
			scope.zoom0 = scope.object.zoom;
		};
		this.reset = () => {
			scope.target.copy(scope.target0);
			scope.object.position.copy(scope.position0);
			scope.object.zoom = scope.zoom0;
			scope.object.updateProjectionMatrix();
			scope.dispatchEvent(changeEvent);
			scope.update();
			state = STATE.NONE;
		};
		this.update = (() => {
			const offset = new Vector3();
			const up = new Vector3(0, 1, 0);
			const quat = new Quaternion().setFromUnitVectors(object.up, up);
			const quatInverse = quat.clone().invert();
			const lastPosition = new Vector3();
			const lastQuaternion = new Quaternion();
			const twoPI = 2 * Math.PI;
			return function update() {
				const position = scope.object.position;
				quat.setFromUnitVectors(object.up, up);
				quatInverse.copy(quat).invert();
				offset.copy(position).sub(scope.target);
				offset.applyQuaternion(quat);
				spherical.setFromVector3(offset);
				if (scope.autoRotate && state === STATE.NONE) rotateLeft(getAutoRotationAngle());
				if (scope.enableDamping) {
					spherical.theta += sphericalDelta.theta * scope.dampingFactor;
					spherical.phi += sphericalDelta.phi * scope.dampingFactor;
				} else {
					spherical.theta += sphericalDelta.theta;
					spherical.phi += sphericalDelta.phi;
				}
				let min = scope.minAzimuthAngle;
				let max = scope.maxAzimuthAngle;
				if (isFinite(min) && isFinite(max)) {
					if (min < -Math.PI) min += twoPI;
					else if (min > Math.PI) min -= twoPI;
					if (max < -Math.PI) max += twoPI;
					else if (max > Math.PI) max -= twoPI;
					if (min <= max) spherical.theta = Math.max(min, Math.min(max, spherical.theta));
					else spherical.theta = spherical.theta > (min + max) / 2 ? Math.max(min, spherical.theta) : Math.min(max, spherical.theta);
				}
				spherical.phi = Math.max(scope.minPolarAngle, Math.min(scope.maxPolarAngle, spherical.phi));
				spherical.makeSafe();
				if (scope.enableDamping === true) scope.target.addScaledVector(panOffset, scope.dampingFactor);
				else scope.target.add(panOffset);
				if (scope.zoomToCursor && performCursorZoom || scope.object.isOrthographicCamera) spherical.radius = clampDistance(spherical.radius);
				else spherical.radius = clampDistance(spherical.radius * scale);
				offset.setFromSpherical(spherical);
				offset.applyQuaternion(quatInverse);
				position.copy(scope.target).add(offset);
				if (!scope.object.matrixAutoUpdate) scope.object.updateMatrix();
				scope.object.lookAt(scope.target);
				if (scope.enableDamping === true) {
					sphericalDelta.theta *= 1 - scope.dampingFactor;
					sphericalDelta.phi *= 1 - scope.dampingFactor;
					panOffset.multiplyScalar(1 - scope.dampingFactor);
				} else {
					sphericalDelta.set(0, 0, 0);
					panOffset.set(0, 0, 0);
				}
				let zoomChanged = false;
				if (scope.zoomToCursor && performCursorZoom) {
					let newRadius = null;
					if (scope.object instanceof PerspectiveCamera && scope.object.isPerspectiveCamera) {
						const prevRadius = offset.length();
						newRadius = clampDistance(prevRadius * scale);
						const radiusDelta = prevRadius - newRadius;
						scope.object.position.addScaledVector(dollyDirection, radiusDelta);
						scope.object.updateMatrixWorld();
					} else if (scope.object.isOrthographicCamera) {
						const mouseBefore = new Vector3(mouse.x, mouse.y, 0);
						mouseBefore.unproject(scope.object);
						scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / scale));
						scope.object.updateProjectionMatrix();
						zoomChanged = true;
						const mouseAfter = new Vector3(mouse.x, mouse.y, 0);
						mouseAfter.unproject(scope.object);
						scope.object.position.sub(mouseAfter).add(mouseBefore);
						scope.object.updateMatrixWorld();
						newRadius = offset.length();
					} else {
						console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.");
						scope.zoomToCursor = false;
					}
					if (newRadius !== null) if (scope.screenSpacePanning) scope.target.set(0, 0, -1).transformDirection(scope.object.matrix).multiplyScalar(newRadius).add(scope.object.position);
					else {
						_ray.origin.copy(scope.object.position);
						_ray.direction.set(0, 0, -1).transformDirection(scope.object.matrix);
						if (Math.abs(scope.object.up.dot(_ray.direction)) < TILT_LIMIT) object.lookAt(scope.target);
						else {
							_plane.setFromNormalAndCoplanarPoint(scope.object.up, scope.target);
							_ray.intersectPlane(_plane, scope.target);
						}
					}
				} else if (scope.object instanceof OrthographicCamera && scope.object.isOrthographicCamera) {
					zoomChanged = scale !== 1;
					if (zoomChanged) {
						scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / scale));
						scope.object.updateProjectionMatrix();
					}
				}
				scale = 1;
				performCursorZoom = false;
				if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS || 8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
					scope.dispatchEvent(changeEvent);
					lastPosition.copy(scope.object.position);
					lastQuaternion.copy(scope.object.quaternion);
					zoomChanged = false;
					return true;
				}
				return false;
			};
		})();
		this.connect = (domElement2) => {
			scope.domElement = domElement2;
			scope.domElement.style.touchAction = "none";
			scope.domElement.addEventListener("contextmenu", onContextMenu);
			scope.domElement.addEventListener("pointerdown", onPointerDown);
			scope.domElement.addEventListener("pointercancel", onPointerUp);
			scope.domElement.addEventListener("wheel", onMouseWheel);
		};
		this.dispose = () => {
			var _a, _b, _c, _d, _e, _f;
			if (scope.domElement) scope.domElement.style.touchAction = "auto";
			(_a = scope.domElement) == null || _a.removeEventListener("contextmenu", onContextMenu);
			(_b = scope.domElement) == null || _b.removeEventListener("pointerdown", onPointerDown);
			(_c = scope.domElement) == null || _c.removeEventListener("pointercancel", onPointerUp);
			(_d = scope.domElement) == null || _d.removeEventListener("wheel", onMouseWheel);
			(_e = scope.domElement) == null || _e.ownerDocument.removeEventListener("pointermove", onPointerMove);
			(_f = scope.domElement) == null || _f.ownerDocument.removeEventListener("pointerup", onPointerUp);
			if (scope._domElementKeyEvents !== null) scope._domElementKeyEvents.removeEventListener("keydown", onKeyDown);
		};
		const scope = this;
		const changeEvent = { type: "change" };
		const startEvent = { type: "start" };
		const endEvent = { type: "end" };
		const STATE = {
			NONE: -1,
			ROTATE: 0,
			DOLLY: 1,
			PAN: 2,
			TOUCH_ROTATE: 3,
			TOUCH_PAN: 4,
			TOUCH_DOLLY_PAN: 5,
			TOUCH_DOLLY_ROTATE: 6
		};
		let state = STATE.NONE;
		const EPS = 1e-6;
		const spherical = new Spherical();
		const sphericalDelta = new Spherical();
		let scale = 1;
		const panOffset = new Vector3();
		const rotateStart = new Vector2();
		const rotateEnd = new Vector2();
		const rotateDelta = new Vector2();
		const panStart = new Vector2();
		const panEnd = new Vector2();
		const panDelta = new Vector2();
		const dollyStart = new Vector2();
		const dollyEnd = new Vector2();
		const dollyDelta = new Vector2();
		const dollyDirection = new Vector3();
		const mouse = new Vector2();
		let performCursorZoom = false;
		const pointers = [];
		const pointerPositions = {};
		function getAutoRotationAngle() {
			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
		}
		function getZoomScale() {
			return Math.pow(.95, scope.zoomSpeed);
		}
		function rotateLeft(angle) {
			if (scope.reverseOrbit || scope.reverseHorizontalOrbit) sphericalDelta.theta += angle;
			else sphericalDelta.theta -= angle;
		}
		function rotateUp(angle) {
			if (scope.reverseOrbit || scope.reverseVerticalOrbit) sphericalDelta.phi += angle;
			else sphericalDelta.phi -= angle;
		}
		const panLeft = (() => {
			const v = new Vector3();
			return function panLeft2(distance, objectMatrix) {
				v.setFromMatrixColumn(objectMatrix, 0);
				v.multiplyScalar(-distance);
				panOffset.add(v);
			};
		})();
		const panUp = (() => {
			const v = new Vector3();
			return function panUp2(distance, objectMatrix) {
				if (scope.screenSpacePanning === true) v.setFromMatrixColumn(objectMatrix, 1);
				else {
					v.setFromMatrixColumn(objectMatrix, 0);
					v.crossVectors(scope.object.up, v);
				}
				v.multiplyScalar(distance);
				panOffset.add(v);
			};
		})();
		const pan = (() => {
			const offset = new Vector3();
			return function pan2(deltaX, deltaY) {
				const element = scope.domElement;
				if (element && scope.object instanceof PerspectiveCamera && scope.object.isPerspectiveCamera) {
					const position = scope.object.position;
					offset.copy(position).sub(scope.target);
					let targetDistance = offset.length();
					targetDistance *= Math.tan(scope.object.fov / 2 * Math.PI / 180);
					panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
					panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);
				} else if (element && scope.object instanceof OrthographicCamera && scope.object.isOrthographicCamera) {
					panLeft(deltaX * (scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
					panUp(deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);
				} else {
					console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.");
					scope.enablePan = false;
				}
			};
		})();
		function setScale(newScale) {
			if (scope.object instanceof PerspectiveCamera && scope.object.isPerspectiveCamera || scope.object instanceof OrthographicCamera && scope.object.isOrthographicCamera) scale = newScale;
			else {
				console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.");
				scope.enableZoom = false;
			}
		}
		function dollyOut(dollyScale) {
			setScale(scale / dollyScale);
		}
		function dollyIn(dollyScale) {
			setScale(scale * dollyScale);
		}
		function updateMouseParameters(event) {
			if (!scope.zoomToCursor || !scope.domElement) return;
			performCursorZoom = true;
			const rect = scope.domElement.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			const w = rect.width;
			const h = rect.height;
			mouse.x = x / w * 2 - 1;
			mouse.y = -(y / h) * 2 + 1;
			dollyDirection.set(mouse.x, mouse.y, 1).unproject(scope.object).sub(scope.object.position).normalize();
		}
		function clampDistance(dist) {
			return Math.max(scope.minDistance, Math.min(scope.maxDistance, dist));
		}
		function handleMouseDownRotate(event) {
			rotateStart.set(event.clientX, event.clientY);
		}
		function handleMouseDownDolly(event) {
			updateMouseParameters(event);
			dollyStart.set(event.clientX, event.clientY);
		}
		function handleMouseDownPan(event) {
			panStart.set(event.clientX, event.clientY);
		}
		function handleMouseMoveRotate(event) {
			rotateEnd.set(event.clientX, event.clientY);
			rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
			const element = scope.domElement;
			if (element) {
				rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);
				rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
			}
			rotateStart.copy(rotateEnd);
			scope.update();
		}
		function handleMouseMoveDolly(event) {
			dollyEnd.set(event.clientX, event.clientY);
			dollyDelta.subVectors(dollyEnd, dollyStart);
			if (dollyDelta.y > 0) dollyOut(getZoomScale());
			else if (dollyDelta.y < 0) dollyIn(getZoomScale());
			dollyStart.copy(dollyEnd);
			scope.update();
		}
		function handleMouseMovePan(event) {
			panEnd.set(event.clientX, event.clientY);
			panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
			pan(panDelta.x, panDelta.y);
			panStart.copy(panEnd);
			scope.update();
		}
		function handleMouseWheel(event) {
			updateMouseParameters(event);
			if (event.deltaY < 0) dollyIn(getZoomScale());
			else if (event.deltaY > 0) dollyOut(getZoomScale());
			scope.update();
		}
		function handleKeyDown(event) {
			let needsUpdate = false;
			switch (event.code) {
				case scope.keys.UP:
					pan(0, scope.keyPanSpeed);
					needsUpdate = true;
					break;
				case scope.keys.BOTTOM:
					pan(0, -scope.keyPanSpeed);
					needsUpdate = true;
					break;
				case scope.keys.LEFT:
					pan(scope.keyPanSpeed, 0);
					needsUpdate = true;
					break;
				case scope.keys.RIGHT:
					pan(-scope.keyPanSpeed, 0);
					needsUpdate = true;
					break;
			}
			if (needsUpdate) {
				event.preventDefault();
				scope.update();
			}
		}
		function handleTouchStartRotate() {
			if (pointers.length == 1) rotateStart.set(pointers[0].pageX, pointers[0].pageY);
			else {
				const x = .5 * (pointers[0].pageX + pointers[1].pageX);
				const y = .5 * (pointers[0].pageY + pointers[1].pageY);
				rotateStart.set(x, y);
			}
		}
		function handleTouchStartPan() {
			if (pointers.length == 1) panStart.set(pointers[0].pageX, pointers[0].pageY);
			else {
				const x = .5 * (pointers[0].pageX + pointers[1].pageX);
				const y = .5 * (pointers[0].pageY + pointers[1].pageY);
				panStart.set(x, y);
			}
		}
		function handleTouchStartDolly() {
			const dx = pointers[0].pageX - pointers[1].pageX;
			const dy = pointers[0].pageY - pointers[1].pageY;
			const distance = Math.sqrt(dx * dx + dy * dy);
			dollyStart.set(0, distance);
		}
		function handleTouchStartDollyPan() {
			if (scope.enableZoom) handleTouchStartDolly();
			if (scope.enablePan) handleTouchStartPan();
		}
		function handleTouchStartDollyRotate() {
			if (scope.enableZoom) handleTouchStartDolly();
			if (scope.enableRotate) handleTouchStartRotate();
		}
		function handleTouchMoveRotate(event) {
			if (pointers.length == 1) rotateEnd.set(event.pageX, event.pageY);
			else {
				const position = getSecondPointerPosition(event);
				const x = .5 * (event.pageX + position.x);
				const y = .5 * (event.pageY + position.y);
				rotateEnd.set(x, y);
			}
			rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);
			const element = scope.domElement;
			if (element) {
				rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight);
				rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);
			}
			rotateStart.copy(rotateEnd);
		}
		function handleTouchMovePan(event) {
			if (pointers.length == 1) panEnd.set(event.pageX, event.pageY);
			else {
				const position = getSecondPointerPosition(event);
				const x = .5 * (event.pageX + position.x);
				const y = .5 * (event.pageY + position.y);
				panEnd.set(x, y);
			}
			panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);
			pan(panDelta.x, panDelta.y);
			panStart.copy(panEnd);
		}
		function handleTouchMoveDolly(event) {
			const position = getSecondPointerPosition(event);
			const dx = event.pageX - position.x;
			const dy = event.pageY - position.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			dollyEnd.set(0, distance);
			dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));
			dollyOut(dollyDelta.y);
			dollyStart.copy(dollyEnd);
		}
		function handleTouchMoveDollyPan(event) {
			if (scope.enableZoom) handleTouchMoveDolly(event);
			if (scope.enablePan) handleTouchMovePan(event);
		}
		function handleTouchMoveDollyRotate(event) {
			if (scope.enableZoom) handleTouchMoveDolly(event);
			if (scope.enableRotate) handleTouchMoveRotate(event);
		}
		function onPointerDown(event) {
			var _a, _b;
			if (scope.enabled === false) return;
			if (pointers.length === 0) {
				(_a = scope.domElement) == null || _a.ownerDocument.addEventListener("pointermove", onPointerMove);
				(_b = scope.domElement) == null || _b.ownerDocument.addEventListener("pointerup", onPointerUp);
			}
			addPointer(event);
			if (event.pointerType === "touch") onTouchStart(event);
			else onMouseDown(event);
		}
		function onPointerMove(event) {
			if (scope.enabled === false) return;
			if (event.pointerType === "touch") onTouchMove(event);
			else onMouseMove(event);
		}
		function onPointerUp(event) {
			var _a, _b, _c;
			removePointer(event);
			if (pointers.length === 0) {
				(_a = scope.domElement) == null || _a.releasePointerCapture(event.pointerId);
				(_b = scope.domElement) == null || _b.ownerDocument.removeEventListener("pointermove", onPointerMove);
				(_c = scope.domElement) == null || _c.ownerDocument.removeEventListener("pointerup", onPointerUp);
			}
			scope.dispatchEvent(endEvent);
			state = STATE.NONE;
		}
		function onMouseDown(event) {
			let mouseAction;
			switch (event.button) {
				case 0:
					mouseAction = scope.mouseButtons.LEFT;
					break;
				case 1:
					mouseAction = scope.mouseButtons.MIDDLE;
					break;
				case 2:
					mouseAction = scope.mouseButtons.RIGHT;
					break;
				default: mouseAction = -1;
			}
			switch (mouseAction) {
				case MOUSE.DOLLY:
					if (scope.enableZoom === false) return;
					handleMouseDownDolly(event);
					state = STATE.DOLLY;
					break;
				case MOUSE.ROTATE:
					if (event.ctrlKey || event.metaKey || event.shiftKey) {
						if (scope.enablePan === false) return;
						handleMouseDownPan(event);
						state = STATE.PAN;
					} else {
						if (scope.enableRotate === false) return;
						handleMouseDownRotate(event);
						state = STATE.ROTATE;
					}
					break;
				case MOUSE.PAN:
					if (event.ctrlKey || event.metaKey || event.shiftKey) {
						if (scope.enableRotate === false) return;
						handleMouseDownRotate(event);
						state = STATE.ROTATE;
					} else {
						if (scope.enablePan === false) return;
						handleMouseDownPan(event);
						state = STATE.PAN;
					}
					break;
				default: state = STATE.NONE;
			}
			if (state !== STATE.NONE) scope.dispatchEvent(startEvent);
		}
		function onMouseMove(event) {
			if (scope.enabled === false) return;
			switch (state) {
				case STATE.ROTATE:
					if (scope.enableRotate === false) return;
					handleMouseMoveRotate(event);
					break;
				case STATE.DOLLY:
					if (scope.enableZoom === false) return;
					handleMouseMoveDolly(event);
					break;
				case STATE.PAN:
					if (scope.enablePan === false) return;
					handleMouseMovePan(event);
					break;
			}
		}
		function onMouseWheel(event) {
			if (scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE && state !== STATE.ROTATE) return;
			event.preventDefault();
			scope.dispatchEvent(startEvent);
			handleMouseWheel(event);
			scope.dispatchEvent(endEvent);
		}
		function onKeyDown(event) {
			if (scope.enabled === false || scope.enablePan === false) return;
			handleKeyDown(event);
		}
		function onTouchStart(event) {
			trackPointer(event);
			switch (pointers.length) {
				case 1:
					switch (scope.touches.ONE) {
						case TOUCH.ROTATE:
							if (scope.enableRotate === false) return;
							handleTouchStartRotate();
							state = STATE.TOUCH_ROTATE;
							break;
						case TOUCH.PAN:
							if (scope.enablePan === false) return;
							handleTouchStartPan();
							state = STATE.TOUCH_PAN;
							break;
						default: state = STATE.NONE;
					}
					break;
				case 2:
					switch (scope.touches.TWO) {
						case TOUCH.DOLLY_PAN:
							if (scope.enableZoom === false && scope.enablePan === false) return;
							handleTouchStartDollyPan();
							state = STATE.TOUCH_DOLLY_PAN;
							break;
						case TOUCH.DOLLY_ROTATE:
							if (scope.enableZoom === false && scope.enableRotate === false) return;
							handleTouchStartDollyRotate();
							state = STATE.TOUCH_DOLLY_ROTATE;
							break;
						default: state = STATE.NONE;
					}
					break;
				default: state = STATE.NONE;
			}
			if (state !== STATE.NONE) scope.dispatchEvent(startEvent);
		}
		function onTouchMove(event) {
			trackPointer(event);
			switch (state) {
				case STATE.TOUCH_ROTATE:
					if (scope.enableRotate === false) return;
					handleTouchMoveRotate(event);
					scope.update();
					break;
				case STATE.TOUCH_PAN:
					if (scope.enablePan === false) return;
					handleTouchMovePan(event);
					scope.update();
					break;
				case STATE.TOUCH_DOLLY_PAN:
					if (scope.enableZoom === false && scope.enablePan === false) return;
					handleTouchMoveDollyPan(event);
					scope.update();
					break;
				case STATE.TOUCH_DOLLY_ROTATE:
					if (scope.enableZoom === false && scope.enableRotate === false) return;
					handleTouchMoveDollyRotate(event);
					scope.update();
					break;
				default: state = STATE.NONE;
			}
		}
		function onContextMenu(event) {
			if (scope.enabled === false) return;
			event.preventDefault();
		}
		function addPointer(event) {
			pointers.push(event);
		}
		function removePointer(event) {
			delete pointerPositions[event.pointerId];
			for (let i = 0; i < pointers.length; i++) if (pointers[i].pointerId == event.pointerId) {
				pointers.splice(i, 1);
				return;
			}
		}
		function trackPointer(event) {
			let position = pointerPositions[event.pointerId];
			if (position === void 0) {
				position = new Vector2();
				pointerPositions[event.pointerId] = position;
			}
			position.set(event.pageX, event.pageY);
		}
		function getSecondPointerPosition(event) {
			return pointerPositions[(event.pointerId === pointers[0].pointerId ? pointers[1] : pointers[0]).pointerId];
		}
		this.dollyIn = (dollyScale = getZoomScale()) => {
			dollyIn(dollyScale);
			scope.update();
		};
		this.dollyOut = (dollyScale = getZoomScale()) => {
			dollyOut(dollyScale);
			scope.update();
		};
		this.getScale = () => {
			return scale;
		};
		this.setScale = (newScale) => {
			setScale(newScale);
			scope.update();
		};
		this.getZoomScale = () => {
			return getZoomScale();
		};
		if (domElement !== void 0) this.connect(domElement);
		this.update();
	}
};
//#endregion
//#region node_modules/@react-three/drei/core/OrbitControls.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var OrbitControls = /* @__PURE__ */ import_react.forwardRef(({ makeDefault, camera, regress, domElement, enableDamping = true, keyEvents = false, onChange, onStart, onEnd, ...restProps }, ref) => {
	const invalidate = useThree((state) => state.invalidate);
	const defaultCamera = useThree((state) => state.camera);
	const gl = useThree((state) => state.gl);
	const events = useThree((state) => state.events);
	const setEvents = useThree((state) => state.setEvents);
	const set = useThree((state) => state.set);
	const get = useThree((state) => state.get);
	const performance = useThree((state) => state.performance);
	const explCamera = camera || defaultCamera;
	const explDomElement = domElement || events.connected || gl.domElement;
	const controls = import_react.useMemo(() => new OrbitControls$1(explCamera), [explCamera]);
	useFrame(() => {
		if (controls.enabled) controls.update();
	}, -1);
	import_react.useEffect(() => {
		if (keyEvents) controls.connect(keyEvents === true ? explDomElement : keyEvents);
		controls.connect(explDomElement);
		return () => void controls.dispose();
	}, [
		keyEvents,
		explDomElement,
		regress,
		controls,
		invalidate
	]);
	import_react.useEffect(() => {
		const callback = (e) => {
			invalidate();
			if (regress) performance.regress();
			if (onChange) onChange(e);
		};
		const onStartCb = (e) => {
			if (onStart) onStart(e);
		};
		const onEndCb = (e) => {
			if (onEnd) onEnd(e);
		};
		controls.addEventListener("change", callback);
		controls.addEventListener("start", onStartCb);
		controls.addEventListener("end", onEndCb);
		return () => {
			controls.removeEventListener("start", onStartCb);
			controls.removeEventListener("end", onEndCb);
			controls.removeEventListener("change", callback);
		};
	}, [
		onChange,
		onStart,
		onEnd,
		controls,
		invalidate,
		setEvents
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
		object: controls,
		enableDamping
	}, restProps));
});
//#endregion
export { OrbitControls as t };
