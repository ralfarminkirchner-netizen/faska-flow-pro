import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { $ as MathUtils, B as InstancedBufferGeometry, Dt as Sphere, F as Float32BufferAttribute, Lt as Vector2, Nt as UniformsUtils, Rt as Vector3, S as Color, U as InterleavedBufferAttribute, V as InstancedInterleavedBuffer, Vt as WireframeGeometry, W as Line3, a as useFrame, i as extend, m as Box3, nt as Mesh, s as useThree, tt as Matrix4, u as UniformsLib, wt as ShaderMaterial, zt as Vector4 } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as _extends } from "./extends-DijYlAKA.js";
import { t as version } from "./constants-CAaXaS54.js";
import { t as version$1 } from "./constants-B7-Wg9vD.js";
//#region node_modules/three-stdlib/_polyfill/uv1.js
var UV1 = version >= 125 ? "uv1" : "uv2";
//#endregion
//#region node_modules/three-stdlib/lines/LineSegmentsGeometry.js
var _box$1 = /* @__PURE__ */ new Box3();
var _vector = /* @__PURE__ */ new Vector3();
var LineSegmentsGeometry = class extends InstancedBufferGeometry {
	constructor() {
		super();
		this.isLineSegmentsGeometry = true;
		this.type = "LineSegmentsGeometry";
		const positions = [
			-1,
			2,
			0,
			1,
			2,
			0,
			-1,
			1,
			0,
			1,
			1,
			0,
			-1,
			0,
			0,
			1,
			0,
			0,
			-1,
			-1,
			0,
			1,
			-1,
			0
		];
		const uvs = [
			-1,
			2,
			1,
			2,
			-1,
			1,
			1,
			1,
			-1,
			-1,
			1,
			-1,
			-1,
			-2,
			1,
			-2
		];
		this.setIndex([
			0,
			2,
			1,
			2,
			3,
			1,
			2,
			4,
			3,
			4,
			5,
			3,
			4,
			6,
			5,
			6,
			7,
			5
		]);
		this.setAttribute("position", new Float32BufferAttribute(positions, 3));
		this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
	}
	applyMatrix4(matrix) {
		const start = this.attributes.instanceStart;
		const end = this.attributes.instanceEnd;
		if (start !== void 0) {
			start.applyMatrix4(matrix);
			end.applyMatrix4(matrix);
			start.needsUpdate = true;
		}
		if (this.boundingBox !== null) this.computeBoundingBox();
		if (this.boundingSphere !== null) this.computeBoundingSphere();
		return this;
	}
	setPositions(array) {
		let lineSegments;
		if (array instanceof Float32Array) lineSegments = array;
		else if (Array.isArray(array)) lineSegments = new Float32Array(array);
		const instanceBuffer = new InstancedInterleavedBuffer(lineSegments, 6, 1);
		this.setAttribute("instanceStart", new InterleavedBufferAttribute(instanceBuffer, 3, 0));
		this.setAttribute("instanceEnd", new InterleavedBufferAttribute(instanceBuffer, 3, 3));
		this.computeBoundingBox();
		this.computeBoundingSphere();
		return this;
	}
	setColors(array, itemSize = 3) {
		let colors;
		if (array instanceof Float32Array) colors = array;
		else if (Array.isArray(array)) colors = new Float32Array(array);
		const instanceColorBuffer = new InstancedInterleavedBuffer(colors, itemSize * 2, 1);
		this.setAttribute("instanceColorStart", new InterleavedBufferAttribute(instanceColorBuffer, itemSize, 0));
		this.setAttribute("instanceColorEnd", new InterleavedBufferAttribute(instanceColorBuffer, itemSize, itemSize));
		return this;
	}
	fromWireframeGeometry(geometry) {
		this.setPositions(geometry.attributes.position.array);
		return this;
	}
	fromEdgesGeometry(geometry) {
		this.setPositions(geometry.attributes.position.array);
		return this;
	}
	fromMesh(mesh) {
		this.fromWireframeGeometry(new WireframeGeometry(mesh.geometry));
		return this;
	}
	fromLineSegments(lineSegments) {
		const geometry = lineSegments.geometry;
		this.setPositions(geometry.attributes.position.array);
		return this;
	}
	computeBoundingBox() {
		if (this.boundingBox === null) this.boundingBox = new Box3();
		const start = this.attributes.instanceStart;
		const end = this.attributes.instanceEnd;
		if (start !== void 0 && end !== void 0) {
			this.boundingBox.setFromBufferAttribute(start);
			_box$1.setFromBufferAttribute(end);
			this.boundingBox.union(_box$1);
		}
	}
	computeBoundingSphere() {
		if (this.boundingSphere === null) this.boundingSphere = new Sphere();
		if (this.boundingBox === null) this.computeBoundingBox();
		const start = this.attributes.instanceStart;
		const end = this.attributes.instanceEnd;
		if (start !== void 0 && end !== void 0) {
			const center = this.boundingSphere.center;
			this.boundingBox.getCenter(center);
			let maxRadiusSq = 0;
			for (let i = 0, il = start.count; i < il; i++) {
				_vector.fromBufferAttribute(start, i);
				maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
				_vector.fromBufferAttribute(end, i);
				maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
			}
			this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
			if (isNaN(this.boundingSphere.radius)) console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.", this);
		}
	}
	toJSON() {}
	applyMatrix(matrix) {
		console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().");
		return this.applyMatrix4(matrix);
	}
};
//#endregion
//#region node_modules/three-stdlib/lines/LineGeometry.js
var LineGeometry = class extends LineSegmentsGeometry {
	constructor() {
		super();
		this.isLineGeometry = true;
		this.type = "LineGeometry";
	}
	setPositions(array) {
		const length = array.length - 3;
		const points = new Float32Array(2 * length);
		for (let i = 0; i < length; i += 3) {
			points[2 * i] = array[i];
			points[2 * i + 1] = array[i + 1];
			points[2 * i + 2] = array[i + 2];
			points[2 * i + 3] = array[i + 3];
			points[2 * i + 4] = array[i + 4];
			points[2 * i + 5] = array[i + 5];
		}
		super.setPositions(points);
		return this;
	}
	setColors(array, itemSize = 3) {
		const length = array.length - itemSize;
		const colors = new Float32Array(2 * length);
		if (itemSize === 3) for (let i = 0; i < length; i += itemSize) {
			colors[2 * i] = array[i];
			colors[2 * i + 1] = array[i + 1];
			colors[2 * i + 2] = array[i + 2];
			colors[2 * i + 3] = array[i + 3];
			colors[2 * i + 4] = array[i + 4];
			colors[2 * i + 5] = array[i + 5];
		}
		else for (let i = 0; i < length; i += itemSize) {
			colors[2 * i] = array[i];
			colors[2 * i + 1] = array[i + 1];
			colors[2 * i + 2] = array[i + 2];
			colors[2 * i + 3] = array[i + 3];
			colors[2 * i + 4] = array[i + 4];
			colors[2 * i + 5] = array[i + 5];
			colors[2 * i + 6] = array[i + 6];
			colors[2 * i + 7] = array[i + 7];
		}
		super.setColors(colors, itemSize);
		return this;
	}
	fromLine(line) {
		const geometry = line.geometry;
		this.setPositions(geometry.attributes.position.array);
		return this;
	}
};
//#endregion
//#region node_modules/three-stdlib/lines/LineMaterial.js
var LineMaterial = class extends ShaderMaterial {
	constructor(parameters) {
		super({
			type: "LineMaterial",
			uniforms: UniformsUtils.clone(UniformsUtils.merge([
				UniformsLib.common,
				UniformsLib.fog,
				{
					worldUnits: { value: 1 },
					linewidth: { value: 1 },
					resolution: { value: new Vector2(1, 1) },
					dashOffset: { value: 0 },
					dashScale: { value: 1 },
					dashSize: { value: 1 },
					gapSize: { value: 1 }
				}
			])),
			vertexShader: `
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,
			fragmentShader: `
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${version >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,
			clipping: true
		});
		this.isLineMaterial = true;
		this.onBeforeCompile = function() {
			if (this.transparent) this.defines.USE_LINE_COLOR_ALPHA = "1";
			else delete this.defines.USE_LINE_COLOR_ALPHA;
		};
		Object.defineProperties(this, {
			color: {
				enumerable: true,
				get: function() {
					return this.uniforms.diffuse.value;
				},
				set: function(value) {
					this.uniforms.diffuse.value = value;
				}
			},
			worldUnits: {
				enumerable: true,
				get: function() {
					return "WORLD_UNITS" in this.defines;
				},
				set: function(value) {
					if (value === true) this.defines.WORLD_UNITS = "";
					else delete this.defines.WORLD_UNITS;
				}
			},
			linewidth: {
				enumerable: true,
				get: function() {
					return this.uniforms.linewidth.value;
				},
				set: function(value) {
					this.uniforms.linewidth.value = value;
				}
			},
			dashed: {
				enumerable: true,
				get: function() {
					return Boolean("USE_DASH" in this.defines);
				},
				set(value) {
					if (Boolean(value) !== Boolean("USE_DASH" in this.defines)) this.needsUpdate = true;
					if (value === true) this.defines.USE_DASH = "";
					else delete this.defines.USE_DASH;
				}
			},
			dashScale: {
				enumerable: true,
				get: function() {
					return this.uniforms.dashScale.value;
				},
				set: function(value) {
					this.uniforms.dashScale.value = value;
				}
			},
			dashSize: {
				enumerable: true,
				get: function() {
					return this.uniforms.dashSize.value;
				},
				set: function(value) {
					this.uniforms.dashSize.value = value;
				}
			},
			dashOffset: {
				enumerable: true,
				get: function() {
					return this.uniforms.dashOffset.value;
				},
				set: function(value) {
					this.uniforms.dashOffset.value = value;
				}
			},
			gapSize: {
				enumerable: true,
				get: function() {
					return this.uniforms.gapSize.value;
				},
				set: function(value) {
					this.uniforms.gapSize.value = value;
				}
			},
			opacity: {
				enumerable: true,
				get: function() {
					return this.uniforms.opacity.value;
				},
				set: function(value) {
					this.uniforms.opacity.value = value;
				}
			},
			resolution: {
				enumerable: true,
				get: function() {
					return this.uniforms.resolution.value;
				},
				set: function(value) {
					this.uniforms.resolution.value.copy(value);
				}
			},
			alphaToCoverage: {
				enumerable: true,
				get: function() {
					return Boolean("USE_ALPHA_TO_COVERAGE" in this.defines);
				},
				set: function(value) {
					if (Boolean(value) !== Boolean("USE_ALPHA_TO_COVERAGE" in this.defines)) this.needsUpdate = true;
					if (value === true) {
						this.defines.USE_ALPHA_TO_COVERAGE = "";
						this.extensions.derivatives = true;
					} else {
						delete this.defines.USE_ALPHA_TO_COVERAGE;
						this.extensions.derivatives = false;
					}
				}
			}
		});
		this.setValues(parameters);
	}
};
//#endregion
//#region node_modules/three-stdlib/lines/LineSegments2.js
var _viewport = /* @__PURE__ */ new Vector4();
var _start = /* @__PURE__ */ new Vector3();
var _end = /* @__PURE__ */ new Vector3();
var _start4 = /* @__PURE__ */ new Vector4();
var _end4 = /* @__PURE__ */ new Vector4();
var _ssOrigin = /* @__PURE__ */ new Vector4();
var _ssOrigin3 = /* @__PURE__ */ new Vector3();
var _mvMatrix = /* @__PURE__ */ new Matrix4();
var _line = /* @__PURE__ */ new Line3();
var _closestPoint = /* @__PURE__ */ new Vector3();
var _box = /* @__PURE__ */ new Box3();
var _sphere = /* @__PURE__ */ new Sphere();
var _clipToWorldVector = /* @__PURE__ */ new Vector4();
var _ray, _lineWidth;
function getWorldSpaceHalfWidth(camera, distance, resolution) {
	_clipToWorldVector.set(0, 0, -distance, 1).applyMatrix4(camera.projectionMatrix);
	_clipToWorldVector.multiplyScalar(1 / _clipToWorldVector.w);
	_clipToWorldVector.x = _lineWidth / resolution.width;
	_clipToWorldVector.y = _lineWidth / resolution.height;
	_clipToWorldVector.applyMatrix4(camera.projectionMatrixInverse);
	_clipToWorldVector.multiplyScalar(1 / _clipToWorldVector.w);
	return Math.abs(Math.max(_clipToWorldVector.x, _clipToWorldVector.y));
}
function raycastWorldUnits(lineSegments, intersects) {
	const matrixWorld = lineSegments.matrixWorld;
	const geometry = lineSegments.geometry;
	const instanceStart = geometry.attributes.instanceStart;
	const instanceEnd = geometry.attributes.instanceEnd;
	const segmentCount = Math.min(geometry.instanceCount, instanceStart.count);
	for (let i = 0, l = segmentCount; i < l; i++) {
		_line.start.fromBufferAttribute(instanceStart, i);
		_line.end.fromBufferAttribute(instanceEnd, i);
		_line.applyMatrix4(matrixWorld);
		const pointOnLine = new Vector3();
		const point = new Vector3();
		_ray.distanceSqToSegment(_line.start, _line.end, point, pointOnLine);
		if (point.distanceTo(pointOnLine) < _lineWidth * .5) intersects.push({
			point,
			pointOnLine,
			distance: _ray.origin.distanceTo(point),
			object: lineSegments,
			face: null,
			faceIndex: i,
			uv: null,
			[UV1]: null
		});
	}
}
function raycastScreenSpace(lineSegments, camera, intersects) {
	const projectionMatrix = camera.projectionMatrix;
	const resolution = lineSegments.material.resolution;
	const matrixWorld = lineSegments.matrixWorld;
	const geometry = lineSegments.geometry;
	const instanceStart = geometry.attributes.instanceStart;
	const instanceEnd = geometry.attributes.instanceEnd;
	const segmentCount = Math.min(geometry.instanceCount, instanceStart.count);
	const near = -camera.near;
	_ray.at(1, _ssOrigin);
	_ssOrigin.w = 1;
	_ssOrigin.applyMatrix4(camera.matrixWorldInverse);
	_ssOrigin.applyMatrix4(projectionMatrix);
	_ssOrigin.multiplyScalar(1 / _ssOrigin.w);
	_ssOrigin.x *= resolution.x / 2;
	_ssOrigin.y *= resolution.y / 2;
	_ssOrigin.z = 0;
	_ssOrigin3.copy(_ssOrigin);
	_mvMatrix.multiplyMatrices(camera.matrixWorldInverse, matrixWorld);
	for (let i = 0, l = segmentCount; i < l; i++) {
		_start4.fromBufferAttribute(instanceStart, i);
		_end4.fromBufferAttribute(instanceEnd, i);
		_start4.w = 1;
		_end4.w = 1;
		_start4.applyMatrix4(_mvMatrix);
		_end4.applyMatrix4(_mvMatrix);
		if (_start4.z > near && _end4.z > near) continue;
		if (_start4.z > near) {
			const deltaDist = _start4.z - _end4.z;
			const t = (_start4.z - near) / deltaDist;
			_start4.lerp(_end4, t);
		} else if (_end4.z > near) {
			const deltaDist = _end4.z - _start4.z;
			const t = (_end4.z - near) / deltaDist;
			_end4.lerp(_start4, t);
		}
		_start4.applyMatrix4(projectionMatrix);
		_end4.applyMatrix4(projectionMatrix);
		_start4.multiplyScalar(1 / _start4.w);
		_end4.multiplyScalar(1 / _end4.w);
		_start4.x *= resolution.x / 2;
		_start4.y *= resolution.y / 2;
		_end4.x *= resolution.x / 2;
		_end4.y *= resolution.y / 2;
		_line.start.copy(_start4);
		_line.start.z = 0;
		_line.end.copy(_end4);
		_line.end.z = 0;
		const param = _line.closestPointToPointParameter(_ssOrigin3, true);
		_line.at(param, _closestPoint);
		const zPos = MathUtils.lerp(_start4.z, _end4.z, param);
		const isInClipSpace = zPos >= -1 && zPos <= 1;
		const isInside = _ssOrigin3.distanceTo(_closestPoint) < _lineWidth * .5;
		if (isInClipSpace && isInside) {
			_line.start.fromBufferAttribute(instanceStart, i);
			_line.end.fromBufferAttribute(instanceEnd, i);
			_line.start.applyMatrix4(matrixWorld);
			_line.end.applyMatrix4(matrixWorld);
			const pointOnLine = new Vector3();
			const point = new Vector3();
			_ray.distanceSqToSegment(_line.start, _line.end, point, pointOnLine);
			intersects.push({
				point,
				pointOnLine,
				distance: _ray.origin.distanceTo(point),
				object: lineSegments,
				face: null,
				faceIndex: i,
				uv: null,
				[UV1]: null
			});
		}
	}
}
var LineSegments2 = class extends Mesh {
	constructor(geometry = new LineSegmentsGeometry(), material = new LineMaterial({ color: Math.random() * 16777215 })) {
		super(geometry, material);
		this.isLineSegments2 = true;
		this.type = "LineSegments2";
	}
	computeLineDistances() {
		const geometry = this.geometry;
		const instanceStart = geometry.attributes.instanceStart;
		const instanceEnd = geometry.attributes.instanceEnd;
		const lineDistances = new Float32Array(2 * instanceStart.count);
		for (let i = 0, j = 0, l = instanceStart.count; i < l; i++, j += 2) {
			_start.fromBufferAttribute(instanceStart, i);
			_end.fromBufferAttribute(instanceEnd, i);
			lineDistances[j] = j === 0 ? 0 : lineDistances[j - 1];
			lineDistances[j + 1] = lineDistances[j] + _start.distanceTo(_end);
		}
		const instanceDistanceBuffer = new InstancedInterleavedBuffer(lineDistances, 2, 1);
		geometry.setAttribute("instanceDistanceStart", new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0));
		geometry.setAttribute("instanceDistanceEnd", new InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1));
		return this;
	}
	raycast(raycaster, intersects) {
		const worldUnits = this.material.worldUnits;
		const camera = raycaster.camera;
		if (camera === null && !worldUnits) console.error("LineSegments2: \"Raycaster.camera\" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.");
		const threshold = raycaster.params.Line2 !== void 0 ? raycaster.params.Line2.threshold || 0 : 0;
		_ray = raycaster.ray;
		const matrixWorld = this.matrixWorld;
		const geometry = this.geometry;
		const material = this.material;
		_lineWidth = material.linewidth + threshold;
		if (geometry.boundingSphere === null) geometry.computeBoundingSphere();
		_sphere.copy(geometry.boundingSphere).applyMatrix4(matrixWorld);
		let sphereMargin;
		if (worldUnits) sphereMargin = _lineWidth * .5;
		else sphereMargin = getWorldSpaceHalfWidth(camera, Math.max(camera.near, _sphere.distanceToPoint(_ray.origin)), material.resolution);
		_sphere.radius += sphereMargin;
		if (_ray.intersectsSphere(_sphere) === false) return;
		if (geometry.boundingBox === null) geometry.computeBoundingBox();
		_box.copy(geometry.boundingBox).applyMatrix4(matrixWorld);
		let boxMargin;
		if (worldUnits) boxMargin = _lineWidth * .5;
		else boxMargin = getWorldSpaceHalfWidth(camera, Math.max(camera.near, _box.distanceToPoint(_ray.origin)), material.resolution);
		_box.expandByScalar(boxMargin);
		if (_ray.intersectsBox(_box) === false) return;
		if (worldUnits) raycastWorldUnits(this, intersects);
		else raycastScreenSpace(this, camera, intersects);
	}
	onBeforeRender(renderer) {
		const uniforms = this.material.uniforms;
		if (uniforms && uniforms.resolution) {
			renderer.getViewport(_viewport);
			this.material.uniforms.resolution.value.set(_viewport.z, _viewport.w);
		}
	}
};
//#endregion
//#region node_modules/three-stdlib/lines/Line2.js
var Line2 = class extends LineSegments2 {
	constructor(geometry = new LineGeometry(), material = new LineMaterial({ color: Math.random() * 16777215 })) {
		super(geometry, material);
		this.isLine2 = true;
		this.type = "Line2";
	}
};
//#endregion
//#region node_modules/@react-three/drei/core/Line.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var Line = /* @__PURE__ */ import_react.forwardRef(function Line({ points, color = 16777215, vertexColors, linewidth, lineWidth, segments, dashed, ...rest }, ref) {
	var _vertexColors$, _ref;
	const size = useThree((state) => state.size);
	const line2 = import_react.useMemo(() => segments ? new LineSegments2() : new Line2(), [segments]);
	const [lineMaterial] = import_react.useState(() => new LineMaterial());
	const itemSize = (vertexColors == null || (_vertexColors$ = vertexColors[0]) == null ? void 0 : _vertexColors$.length) === 4 ? 4 : 3;
	const lineGeom = import_react.useMemo(() => {
		const geom = segments ? new LineSegmentsGeometry() : new LineGeometry();
		const pValues = points.map((p) => {
			const isArray = Array.isArray(p);
			return p instanceof Vector3 || p instanceof Vector4 ? [
				p.x,
				p.y,
				p.z
			] : p instanceof Vector2 ? [
				p.x,
				p.y,
				0
			] : isArray && p.length === 3 ? [
				p[0],
				p[1],
				p[2]
			] : isArray && p.length === 2 ? [
				p[0],
				p[1],
				0
			] : p;
		});
		geom.setPositions(pValues.flat());
		if (vertexColors) {
			color = 16777215;
			const cValues = vertexColors.map((c) => c instanceof Color ? c.toArray() : c);
			geom.setColors(cValues.flat(), itemSize);
		}
		return geom;
	}, [
		points,
		segments,
		vertexColors,
		itemSize
	]);
	import_react.useLayoutEffect(() => {
		line2.computeLineDistances();
	}, [points, line2]);
	import_react.useLayoutEffect(() => {
		if (dashed) lineMaterial.defines.USE_DASH = "";
		else delete lineMaterial.defines.USE_DASH;
		lineMaterial.needsUpdate = true;
	}, [dashed, lineMaterial]);
	import_react.useEffect(() => {
		return () => {
			lineGeom.dispose();
			lineMaterial.dispose();
		};
	}, [lineGeom]);
	return /* @__PURE__ */ import_react.createElement("primitive", _extends({
		object: line2,
		ref
	}, rest), /* @__PURE__ */ import_react.createElement("primitive", {
		object: lineGeom,
		attach: "geometry"
	}), /* @__PURE__ */ import_react.createElement("primitive", _extends({
		object: lineMaterial,
		attach: "material",
		color,
		vertexColors: Boolean(vertexColors),
		resolution: [size.width, size.height],
		linewidth: (_ref = linewidth !== null && linewidth !== void 0 ? linewidth : lineWidth) !== null && _ref !== void 0 ? _ref : 1,
		dashed,
		transparent: itemSize === 4
	}, rest)));
});
//#endregion
//#region node_modules/@react-three/drei/core/Sparkles.js
var SparklesImplMaterial = class extends ShaderMaterial {
	constructor() {
		super({
			uniforms: {
				time: { value: 0 },
				pixelRatio: { value: 1 }
			},
			vertexShader: `
        uniform float pixelRatio;
        uniform float time;
        attribute float size;  
        attribute float speed;  
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
          modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
          modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPostion = projectionMatrix * viewPosition;
          gl_Position = projectionPostion;
          gl_PointSize = size * 25. * pixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,
			fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${version$1 >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
        }
      `
		});
	}
	get time() {
		return this.uniforms.time.value;
	}
	set time(value) {
		this.uniforms.time.value = value;
	}
	get pixelRatio() {
		return this.uniforms.pixelRatio.value;
	}
	set pixelRatio(value) {
		this.uniforms.pixelRatio.value = value;
	}
};
var isFloat32Array = (def) => def && def.constructor === Float32Array;
var expandColor = (v) => [
	v.r,
	v.g,
	v.b
];
var isVector = (v) => v instanceof Vector2 || v instanceof Vector3 || v instanceof Vector4;
var normalizeVector = (v) => {
	if (Array.isArray(v)) return v;
	else if (isVector(v)) return v.toArray();
	return [
		v,
		v,
		v
	];
};
function usePropAsIsOrAsAttribute(count, prop, setDefault) {
	return import_react.useMemo(() => {
		if (prop !== void 0) if (isFloat32Array(prop)) return prop;
		else {
			if (prop instanceof Color) {
				const a = Array.from({ length: count * 3 }, () => expandColor(prop)).flat();
				return Float32Array.from(a);
			} else if (isVector(prop) || Array.isArray(prop)) {
				const a = Array.from({ length: count * 3 }, () => normalizeVector(prop)).flat();
				return Float32Array.from(a);
			}
			return Float32Array.from({ length: count }, () => prop);
		}
		return Float32Array.from({ length: count }, setDefault);
	}, [prop]);
}
var Sparkles = /* @__PURE__ */ import_react.forwardRef(({ noise = 1, count = 100, speed = 1, opacity = 1, scale = 1, size, color, children, ...props }, forwardRef) => {
	import_react.useMemo(() => extend({ SparklesImplMaterial }), []);
	const ref = import_react.useRef(null);
	const dpr = useThree((state) => state.viewport.dpr);
	const _scale = normalizeVector(scale);
	const positions = import_react.useMemo(() => Float32Array.from(Array.from({ length: count }, () => _scale.map(MathUtils.randFloatSpread)).flat()), [count, ..._scale]);
	const sizes = usePropAsIsOrAsAttribute(count, size, Math.random);
	const opacities = usePropAsIsOrAsAttribute(count, opacity);
	const speeds = usePropAsIsOrAsAttribute(count, speed);
	const noises = usePropAsIsOrAsAttribute(count * 3, noise);
	const colors = usePropAsIsOrAsAttribute(color === void 0 ? count * 3 : count, !isFloat32Array(color) ? new Color(color) : color, () => 1);
	useFrame((state) => {
		if (ref.current && ref.current.material) ref.current.material.time = state.clock.elapsedTime;
	});
	import_react.useImperativeHandle(forwardRef, () => ref.current, []);
	return /* @__PURE__ */ import_react.createElement("points", _extends({ key: `particle-${count}-${JSON.stringify(scale)}` }, props, { ref }), /* @__PURE__ */ import_react.createElement("bufferGeometry", null, /* @__PURE__ */ import_react.createElement("bufferAttribute", {
		attach: "attributes-position",
		args: [positions, 3]
	}), /* @__PURE__ */ import_react.createElement("bufferAttribute", {
		attach: "attributes-size",
		args: [sizes, 1]
	}), /* @__PURE__ */ import_react.createElement("bufferAttribute", {
		attach: "attributes-opacity",
		args: [opacities, 1]
	}), /* @__PURE__ */ import_react.createElement("bufferAttribute", {
		attach: "attributes-speed",
		args: [speeds, 1]
	}), /* @__PURE__ */ import_react.createElement("bufferAttribute", {
		attach: "attributes-color",
		args: [colors, 3]
	}), /* @__PURE__ */ import_react.createElement("bufferAttribute", {
		attach: "attributes-noise",
		args: [noises, 3]
	})), children ? children : /* @__PURE__ */ import_react.createElement("sparklesImplMaterial", {
		transparent: true,
		pixelRatio: dpr,
		depthWrite: false
	}));
});
//#endregion
export { Line as n, Sparkles as t };
