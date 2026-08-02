import { n as require_react, s as __toESM } from "./jsx-runtime-Be5yPkiZ.js";
import { At as Texture, Bt as WebGLRenderTarget, C as CubeTextureLoader, Ct as Scene, D as DataUtils, E as DataTextureLoader, Et as ShortType, G as LinearFilter, H as IntType, I as FloatType, It as UnsignedIntType, J as LinearSRGBColorSpace, K as LinearMipMapLinearFilter, L as HalfFloatType, P as FileLoader, Pt as UnsignedByteType, R as IcosahedronGeometry, Rt as Vector3, St as SRGBColorSpace, T as DataTexture, X as LoadingManager, Y as Loader, a as useFrame, bt as RedFormat, d as WebGLCubeRenderTarget, f as WebGLRenderer, gt as RGBAFormat, i as extend, n as applyProps, nt as Mesh, o as useLoader, pt as PlaneGeometry, r as createPortal, rt as MeshBasicMaterial, s as useThree, ut as OrthographicCamera, v as ByteType, wt as ShaderMaterial, x as ClampToEdgeWrapping } from "./react-three-fiber.esm-pJsmxxS9.js";
import { t as _extends } from "./extends-DijYlAKA.js";
import { t as version } from "./constants-CAaXaS54.js";
//#region node_modules/three-stdlib/node_modules/fflate/esm/browser.js
var u8 = Uint8Array, u16 = Uint16Array, u32 = Uint32Array;
var fleb = new u8([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	2,
	2,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	0,
	0,
	0,
	0
]);
var fdeb = new u8([
	0,
	0,
	0,
	0,
	1,
	1,
	2,
	2,
	3,
	3,
	4,
	4,
	5,
	5,
	6,
	6,
	7,
	7,
	8,
	8,
	9,
	9,
	10,
	10,
	11,
	11,
	12,
	12,
	13,
	13,
	0,
	0
]);
var clim = new u8([
	16,
	17,
	18,
	0,
	8,
	7,
	9,
	6,
	10,
	5,
	11,
	4,
	12,
	3,
	13,
	2,
	14,
	1,
	15
]);
var freb = function(eb, start) {
	var b = new u16(31);
	for (var i = 0; i < 31; ++i) b[i] = start += 1 << eb[i - 1];
	var r = new u32(b[30]);
	for (var i = 1; i < 30; ++i) for (var j = b[i]; j < b[i + 1]; ++j) r[j] = j - b[i] << 5 | i;
	return [b, r];
};
var _a = freb(fleb, 2), fl = _a[0], revfl = _a[1];
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0), fd = _b[0];
_b[1];
var rev = new u16(32768);
for (var i = 0; i < 32768; ++i) {
	var x = (i & 43690) >>> 1 | (i & 21845) << 1;
	x = (x & 52428) >>> 2 | (x & 13107) << 2;
	x = (x & 61680) >>> 4 | (x & 3855) << 4;
	rev[i] = ((x & 65280) >>> 8 | (x & 255) << 8) >>> 1;
}
var hMap = (function(cd, mb, r) {
	var s = cd.length;
	var i = 0;
	var l = new u16(mb);
	for (; i < s; ++i) ++l[cd[i] - 1];
	var le = new u16(mb);
	for (i = 0; i < mb; ++i) le[i] = le[i - 1] + l[i - 1] << 1;
	var co;
	if (r) {
		co = new u16(1 << mb);
		var rvb = 15 - mb;
		for (i = 0; i < s; ++i) if (cd[i]) {
			var sv = i << 4 | cd[i];
			var r_1 = mb - cd[i];
			var v = le[cd[i] - 1]++ << r_1;
			for (var m = v | (1 << r_1) - 1; v <= m; ++v) co[rev[v] >>> rvb] = sv;
		}
	} else {
		co = new u16(s);
		for (i = 0; i < s; ++i) if (cd[i]) co[i] = rev[le[cd[i] - 1]++] >>> 15 - cd[i];
	}
	return co;
});
var flt = new u8(288);
for (var i = 0; i < 144; ++i) flt[i] = 8;
for (var i = 144; i < 256; ++i) flt[i] = 9;
for (var i = 256; i < 280; ++i) flt[i] = 7;
for (var i = 280; i < 288; ++i) flt[i] = 8;
var fdt = new u8(32);
for (var i = 0; i < 32; ++i) fdt[i] = 5;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1), fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
	var m = a[0];
	for (var i = 1; i < a.length; ++i) if (a[i] > m) m = a[i];
	return m;
};
var bits = function(d, p, m) {
	var o = p / 8 | 0;
	return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
	var o = p / 8 | 0;
	return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
	return (p / 8 | 0) + (p & 7 && 1);
};
var slc = function(v, s, e) {
	if (s == null || s < 0) s = 0;
	if (e == null || e > v.length) e = v.length;
	var n = new (v instanceof u16 ? u16 : v instanceof u32 ? u32 : u8)(e - s);
	n.set(v.subarray(s, e));
	return n;
};
var inflt = function(dat, buf, st) {
	var sl = dat.length;
	if (!sl || st && !st.l && sl < 5) return buf || new u8(0);
	var noBuf = !buf || st;
	var noSt = !st || st.i;
	if (!st) st = {};
	if (!buf) buf = new u8(sl * 3);
	var cbuf = function(l) {
		var bl = buf.length;
		if (l > bl) {
			var nbuf = new u8(Math.max(bl * 2, l));
			nbuf.set(buf);
			buf = nbuf;
		}
	};
	var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
	var tbts = sl * 8;
	do {
		if (!lm) {
			st.f = final = bits(dat, pos, 1);
			var type = bits(dat, pos + 1, 3);
			pos += 3;
			if (!type) {
				var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
				if (t > sl) {
					if (noSt) throw "unexpected EOF";
					break;
				}
				if (noBuf) cbuf(bt + l);
				buf.set(dat.subarray(s, t), bt);
				st.b = bt += l, st.p = pos = t * 8;
				continue;
			} else if (type == 1) lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
			else if (type == 2) {
				var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
				var tl = hLit + bits(dat, pos + 5, 31) + 1;
				pos += 14;
				var ldt = new u8(tl);
				var clt = new u8(19);
				for (var i = 0; i < hcLen; ++i) clt[clim[i]] = bits(dat, pos + i * 3, 7);
				pos += hcLen * 3;
				var clb = max(clt), clbmsk = (1 << clb) - 1;
				var clm = hMap(clt, clb, 1);
				for (var i = 0; i < tl;) {
					var r = clm[bits(dat, pos, clbmsk)];
					pos += r & 15;
					var s = r >>> 4;
					if (s < 16) ldt[i++] = s;
					else {
						var c = 0, n = 0;
						if (s == 16) n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i - 1];
						else if (s == 17) n = 3 + bits(dat, pos, 7), pos += 3;
						else if (s == 18) n = 11 + bits(dat, pos, 127), pos += 7;
						while (n--) ldt[i++] = c;
					}
				}
				var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
				lbt = max(lt);
				dbt = max(dt);
				lm = hMap(lt, lbt, 1);
				dm = hMap(dt, dbt, 1);
			} else throw "invalid block type";
			if (pos > tbts) {
				if (noSt) throw "unexpected EOF";
				break;
			}
		}
		if (noBuf) cbuf(bt + 131072);
		var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
		var lpos = pos;
		for (;; lpos = pos) {
			var c = lm[bits16(dat, pos) & lms], sym = c >>> 4;
			pos += c & 15;
			if (pos > tbts) {
				if (noSt) throw "unexpected EOF";
				break;
			}
			if (!c) throw "invalid length/literal";
			if (sym < 256) buf[bt++] = sym;
			else if (sym == 256) {
				lpos = pos, lm = null;
				break;
			} else {
				var add = sym - 254;
				if (sym > 264) {
					var i = sym - 257, b = fleb[i];
					add = bits(dat, pos, (1 << b) - 1) + fl[i];
					pos += b;
				}
				var d = dm[bits16(dat, pos) & dms], dsym = d >>> 4;
				if (!d) throw "invalid distance";
				pos += d & 15;
				var dt = fd[dsym];
				if (dsym > 3) {
					var b = fdeb[dsym];
					dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
				}
				if (pos > tbts) {
					if (noSt) throw "unexpected EOF";
					break;
				}
				if (noBuf) cbuf(bt + 131072);
				var end = bt + add;
				for (; bt < end; bt += 4) {
					buf[bt] = buf[bt - dt];
					buf[bt + 1] = buf[bt + 1 - dt];
					buf[bt + 2] = buf[bt + 2 - dt];
					buf[bt + 3] = buf[bt + 3 - dt];
				}
				bt = end;
			}
		}
		st.l = lm, st.p = lpos, st.b = bt;
		if (lm) final = 1, st.m = lbt, st.d = dm, st.n = dbt;
	} while (!final);
	return bt == buf.length ? buf : slc(buf, 0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var zlv = function(d) {
	if ((d[0] & 15) != 8 || d[0] >>> 4 > 7 || (d[0] << 8 | d[1]) % 31) throw "invalid zlib data";
	if (d[1] & 32) throw "invalid zlib data: preset dictionaries not supported";
};
/**
* Expands Zlib data
* @param data The data to decompress
* @param out Where to write the data. Saves memory if you know the decompressed size and provide an output buffer of that length.
* @returns The decompressed version of the data
*/
function unzlibSync(data, out) {
	return inflt((zlv(data), data.subarray(2, -4)), out);
}
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
try {
	td.decode(et, { stream: true });
} catch (e) {}
//#endregion
//#region node_modules/three-stdlib/objects/GroundProjectedEnv.js
var isCubeTexture = (def) => def && def.isCubeTexture;
var GroundProjectedEnv = class extends Mesh {
	constructor(texture, options) {
		var _a, _b;
		const isCubeMap = isCubeTexture(texture);
		const cubeSize = ((_b = isCubeMap ? (_a = texture.image[0]) == null ? void 0 : _a.width : texture.image.width) != null ? _b : 1024) / 4;
		const _lodMax = Math.floor(Math.log2(cubeSize));
		const _cubeSize = Math.pow(2, _lodMax);
		const width = 3 * Math.max(_cubeSize, 112);
		const height = 4 * _cubeSize;
		const defines = [
			isCubeMap ? "#define ENVMAP_TYPE_CUBE" : "",
			`#define CUBEUV_TEXEL_WIDTH ${1 / width}`,
			`#define CUBEUV_TEXEL_HEIGHT ${1 / height}`,
			`#define CUBEUV_MAX_MIP ${_lodMax}.0`
		];
		const vertexShader = `
        varying vec3 vWorldPosition;
        void main() 
        {
            vec4 worldPosition = ( modelMatrix * vec4( position, 1.0 ) );
            vWorldPosition = worldPosition.xyz;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;
		const fragmentShader = defines.join("\n") + `
        #define ENVMAP_TYPE_CUBE_UV
        varying vec3 vWorldPosition;
        uniform float radius;
        uniform float height;
        uniform float angle;
        #ifdef ENVMAP_TYPE_CUBE
            uniform samplerCube map;
        #else
            uniform sampler2D map;
        #endif
        // From: https://www.shadertoy.com/view/4tsBD7
        float diskIntersectWithBackFaceCulling( vec3 ro, vec3 rd, vec3 c, vec3 n, float r ) 
        {
            float d = dot ( rd, n );
            
            if( d > 0.0 ) { return 1e6; }
            
            vec3  o = ro - c;
            float t = - dot( n, o ) / d;
            vec3  q = o + rd * t;
            
            return ( dot( q, q ) < r * r ) ? t : 1e6;
        }
        // From: https://www.iquilezles.org/www/articles/intersectors/intersectors.htm
        float sphereIntersect( vec3 ro, vec3 rd, vec3 ce, float ra ) 
        {
            vec3 oc = ro - ce;
            float b = dot( oc, rd );
            float c = dot( oc, oc ) - ra * ra;
            float h = b * b - c;
            
            if( h < 0.0 ) { return -1.0; }
            
            h = sqrt( h );
            
            return - b + h;
        }
        vec3 project() 
        {
            vec3 p = normalize( vWorldPosition );
            vec3 camPos = cameraPosition;
            camPos.y -= height;
            float intersection = sphereIntersect( camPos, p, vec3( 0.0 ), radius );
            if( intersection > 0.0 ) {
                
                vec3 h = vec3( 0.0, - height, 0.0 );
                float intersection2 = diskIntersectWithBackFaceCulling( camPos, p, h, vec3( 0.0, 1.0, 0.0 ), radius );
                p = ( camPos + min( intersection, intersection2 ) * p ) / radius;
            } else {
                p = vec3( 0.0, 1.0, 0.0 );
            }
            return p;
        }
        #include <common>
        #include <cube_uv_reflection_fragment>
        void main() 
        {
            vec3 projectedWorldPosition = project();
            
            #ifdef ENVMAP_TYPE_CUBE
                vec3 outcolor = textureCube( map, projectedWorldPosition ).rgb;
            #else
                vec3 direction = normalize( projectedWorldPosition );
                vec2 uv = equirectUv( direction );
                vec3 outcolor = texture2D( map, uv ).rgb;
            #endif
            gl_FragColor = vec4( outcolor, 1.0 );
            #include <tonemapping_fragment>
            #include <${version >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
        }
        `;
		const uniforms = {
			map: { value: texture },
			height: { value: (options == null ? void 0 : options.height) || 15 },
			radius: { value: (options == null ? void 0 : options.radius) || 100 }
		};
		const geometry = new IcosahedronGeometry(1, 16);
		const material = new ShaderMaterial({
			uniforms,
			fragmentShader,
			vertexShader,
			side: 2
		});
		super(geometry, material);
	}
	set radius(radius) {
		this.material.uniforms.radius.value = radius;
	}
	get radius() {
		return this.material.uniforms.radius.value;
	}
	set height(height) {
		this.material.uniforms.height.value = height;
	}
	get height() {
		return this.material.uniforms.height.value;
	}
};
//#endregion
//#region node_modules/three-stdlib/loaders/RGBELoader.js
var RGBELoader = class extends DataTextureLoader {
	constructor(manager) {
		super(manager);
		this.type = HalfFloatType;
	}
	parse(buffer) {
		const rgbe_read_error = 1, rgbe_write_error = 2, rgbe_format_error = 3, rgbe_memory_error = 4, rgbe_error = function(rgbe_error_code, msg) {
			switch (rgbe_error_code) {
				case rgbe_read_error: throw new Error("THREE.RGBELoader: Read Error: " + (msg || ""));
				case rgbe_write_error: throw new Error("THREE.RGBELoader: Write Error: " + (msg || ""));
				case rgbe_format_error: throw new Error("THREE.RGBELoader: Bad File Format: " + (msg || ""));
				default:
				case rgbe_memory_error: throw new Error("THREE.RGBELoader: Memory Error: " + (msg || ""));
			}
		}, RGBE_VALID_PROGRAMTYPE = 1, RGBE_VALID_FORMAT = 2, RGBE_VALID_DIMENSIONS = 4, NEWLINE = "\n", fgets = function(buffer2, lineLimit, consume) {
			const chunkSize = 128;
			lineLimit = !lineLimit ? 1024 : lineLimit;
			let p = buffer2.pos, i = -1, len = 0, s = "", chunk = String.fromCharCode.apply(null, new Uint16Array(buffer2.subarray(p, p + chunkSize)));
			while (0 > (i = chunk.indexOf(NEWLINE)) && len < lineLimit && p < buffer2.byteLength) {
				s += chunk;
				len += chunk.length;
				p += chunkSize;
				chunk += String.fromCharCode.apply(null, new Uint16Array(buffer2.subarray(p, p + chunkSize)));
			}
			if (-1 < i) {
				if (false !== consume) buffer2.pos += len + i + 1;
				return s + chunk.slice(0, i);
			}
			return false;
		}, RGBE_ReadHeader = function(buffer2) {
			const magic_token_re = /^#\?(\S+)/, gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/, exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/, format_re = /^\s*FORMAT=(\S+)\s*$/, dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/, header = {
				valid: 0,
				string: "",
				comments: "",
				programtype: "RGBE",
				format: "",
				gamma: 1,
				exposure: 1,
				width: 0,
				height: 0
			};
			let line, match;
			if (buffer2.pos >= buffer2.byteLength || !(line = fgets(buffer2))) rgbe_error(rgbe_read_error, "no header found");
			if (!(match = line.match(magic_token_re))) rgbe_error(rgbe_format_error, "bad initial token");
			header.valid |= RGBE_VALID_PROGRAMTYPE;
			header.programtype = match[1];
			header.string += line + "\n";
			while (true) {
				line = fgets(buffer2);
				if (false === line) break;
				header.string += line + "\n";
				if ("#" === line.charAt(0)) {
					header.comments += line + "\n";
					continue;
				}
				if (match = line.match(gamma_re)) header.gamma = parseFloat(match[1]);
				if (match = line.match(exposure_re)) header.exposure = parseFloat(match[1]);
				if (match = line.match(format_re)) {
					header.valid |= RGBE_VALID_FORMAT;
					header.format = match[1];
				}
				if (match = line.match(dimensions_re)) {
					header.valid |= RGBE_VALID_DIMENSIONS;
					header.height = parseInt(match[1], 10);
					header.width = parseInt(match[2], 10);
				}
				if (header.valid & RGBE_VALID_FORMAT && header.valid & RGBE_VALID_DIMENSIONS) break;
			}
			if (!(header.valid & RGBE_VALID_FORMAT)) rgbe_error(rgbe_format_error, "missing format specifier");
			if (!(header.valid & RGBE_VALID_DIMENSIONS)) rgbe_error(rgbe_format_error, "missing image size specifier");
			return header;
		}, RGBE_ReadPixels_RLE = function(buffer2, w2, h2) {
			const scanline_width = w2;
			if (scanline_width < 8 || scanline_width > 32767 || 2 !== buffer2[0] || 2 !== buffer2[1] || buffer2[2] & 128) return new Uint8Array(buffer2);
			if (scanline_width !== (buffer2[2] << 8 | buffer2[3])) rgbe_error(rgbe_format_error, "wrong scanline width");
			const data_rgba = new Uint8Array(4 * w2 * h2);
			if (!data_rgba.length) rgbe_error(rgbe_memory_error, "unable to allocate buffer space");
			let offset = 0, pos = 0;
			const ptr_end = 4 * scanline_width;
			const rgbeStart = new Uint8Array(4);
			const scanline_buffer = new Uint8Array(ptr_end);
			let num_scanlines = h2;
			while (num_scanlines > 0 && pos < buffer2.byteLength) {
				if (pos + 4 > buffer2.byteLength) rgbe_error(rgbe_read_error);
				rgbeStart[0] = buffer2[pos++];
				rgbeStart[1] = buffer2[pos++];
				rgbeStart[2] = buffer2[pos++];
				rgbeStart[3] = buffer2[pos++];
				if (2 != rgbeStart[0] || 2 != rgbeStart[1] || (rgbeStart[2] << 8 | rgbeStart[3]) != scanline_width) rgbe_error(rgbe_format_error, "bad rgbe scanline format");
				let ptr = 0, count;
				while (ptr < ptr_end && pos < buffer2.byteLength) {
					count = buffer2[pos++];
					const isEncodedRun = count > 128;
					if (isEncodedRun) count -= 128;
					if (0 === count || ptr + count > ptr_end) rgbe_error(rgbe_format_error, "bad scanline data");
					if (isEncodedRun) {
						const byteValue = buffer2[pos++];
						for (let i = 0; i < count; i++) scanline_buffer[ptr++] = byteValue;
					} else {
						scanline_buffer.set(buffer2.subarray(pos, pos + count), ptr);
						ptr += count;
						pos += count;
					}
				}
				const l = scanline_width;
				for (let i = 0; i < l; i++) {
					let off = 0;
					data_rgba[offset] = scanline_buffer[i + off];
					off += scanline_width;
					data_rgba[offset + 1] = scanline_buffer[i + off];
					off += scanline_width;
					data_rgba[offset + 2] = scanline_buffer[i + off];
					off += scanline_width;
					data_rgba[offset + 3] = scanline_buffer[i + off];
					offset += 4;
				}
				num_scanlines--;
			}
			return data_rgba;
		};
		const RGBEByteToRGBFloat = function(sourceArray, sourceOffset, destArray, destOffset) {
			const e = sourceArray[sourceOffset + 3];
			const scale = Math.pow(2, e - 128) / 255;
			destArray[destOffset + 0] = sourceArray[sourceOffset + 0] * scale;
			destArray[destOffset + 1] = sourceArray[sourceOffset + 1] * scale;
			destArray[destOffset + 2] = sourceArray[sourceOffset + 2] * scale;
			destArray[destOffset + 3] = 1;
		};
		const RGBEByteToRGBHalf = function(sourceArray, sourceOffset, destArray, destOffset) {
			const e = sourceArray[sourceOffset + 3];
			const scale = Math.pow(2, e - 128) / 255;
			destArray[destOffset + 0] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 0] * scale, 65504));
			destArray[destOffset + 1] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 1] * scale, 65504));
			destArray[destOffset + 2] = DataUtils.toHalfFloat(Math.min(sourceArray[sourceOffset + 2] * scale, 65504));
			destArray[destOffset + 3] = DataUtils.toHalfFloat(1);
		};
		const byteArray = new Uint8Array(buffer);
		byteArray.pos = 0;
		const rgbe_header_info = RGBE_ReadHeader(byteArray);
		const w = rgbe_header_info.width, h = rgbe_header_info.height, image_rgba_data = RGBE_ReadPixels_RLE(byteArray.subarray(byteArray.pos), w, h);
		let data, type;
		let numElements;
		switch (this.type) {
			case FloatType:
				numElements = image_rgba_data.length / 4;
				const floatArray = new Float32Array(numElements * 4);
				for (let j = 0; j < numElements; j++) RGBEByteToRGBFloat(image_rgba_data, j * 4, floatArray, j * 4);
				data = floatArray;
				type = FloatType;
				break;
			case HalfFloatType:
				numElements = image_rgba_data.length / 4;
				const halfArray = new Uint16Array(numElements * 4);
				for (let j = 0; j < numElements; j++) RGBEByteToRGBHalf(image_rgba_data, j * 4, halfArray, j * 4);
				data = halfArray;
				type = HalfFloatType;
				break;
			default: throw new Error("THREE.RGBELoader: Unsupported type: " + this.type);
		}
		return {
			width: w,
			height: h,
			data,
			header: rgbe_header_info.string,
			gamma: rgbe_header_info.gamma,
			exposure: rgbe_header_info.exposure,
			type
		};
	}
	setDataType(value) {
		this.type = value;
		return this;
	}
	load(url, onLoad, onProgress, onError) {
		function onLoadCallback(texture, texData) {
			switch (texture.type) {
				case FloatType:
				case HalfFloatType:
					if ("colorSpace" in texture) texture.colorSpace = "srgb-linear";
					else texture.encoding = 3e3;
					texture.minFilter = LinearFilter;
					texture.magFilter = LinearFilter;
					texture.generateMipmaps = false;
					texture.flipY = true;
					break;
			}
			if (onLoad) onLoad(texture, texData);
		}
		return super.load(url, onLoadCallback, onProgress, onError);
	}
};
//#endregion
//#region node_modules/three-stdlib/loaders/EXRLoader.js
var hasColorSpace = version >= 152;
var EXRLoader = class extends DataTextureLoader {
	constructor(manager) {
		super(manager);
		this.type = HalfFloatType;
	}
	parse(buffer) {
		const USHORT_RANGE = 65536;
		const BITMAP_SIZE = USHORT_RANGE >> 3;
		const HUF_ENCBITS = 16;
		const HUF_DECBITS = 14;
		const HUF_ENCSIZE = (1 << HUF_ENCBITS) + 1;
		const HUF_DECSIZE = 1 << HUF_DECBITS;
		const HUF_DECMASK = HUF_DECSIZE - 1;
		const NBITS = 16;
		const A_OFFSET = 1 << NBITS - 1;
		const MOD_MASK = (1 << NBITS) - 1;
		const SHORT_ZEROCODE_RUN = 59;
		const LONG_ZEROCODE_RUN = 63;
		const SHORTEST_LONG_RUN = 2 + LONG_ZEROCODE_RUN - SHORT_ZEROCODE_RUN;
		const ULONG_SIZE = 8;
		const FLOAT32_SIZE = 4;
		const INT32_SIZE = 4;
		const INT16_SIZE = 2;
		const INT8_SIZE = 1;
		const STATIC_HUFFMAN = 0;
		const DEFLATE = 1;
		const UNKNOWN = 0;
		const LOSSY_DCT = 1;
		const RLE = 2;
		const logBase = Math.pow(2.7182818, 2.2);
		function reverseLutFromBitmap(bitmap, lut) {
			var k = 0;
			for (var i = 0; i < USHORT_RANGE; ++i) if (i == 0 || bitmap[i >> 3] & 1 << (i & 7)) lut[k++] = i;
			var n = k - 1;
			while (k < USHORT_RANGE) lut[k++] = 0;
			return n;
		}
		function hufClearDecTable(hdec) {
			for (var i = 0; i < HUF_DECSIZE; i++) {
				hdec[i] = {};
				hdec[i].len = 0;
				hdec[i].lit = 0;
				hdec[i].p = null;
			}
		}
		const getBitsReturn = {
			l: 0,
			c: 0,
			lc: 0
		};
		function getBits(nBits, c, lc, uInt8Array2, inOffset) {
			while (lc < nBits) {
				c = c << 8 | parseUint8Array(uInt8Array2, inOffset);
				lc += 8;
			}
			lc -= nBits;
			getBitsReturn.l = c >> lc & (1 << nBits) - 1;
			getBitsReturn.c = c;
			getBitsReturn.lc = lc;
		}
		const hufTableBuffer = new Array(59);
		function hufCanonicalCodeTable(hcode) {
			for (var i = 0; i <= 58; ++i) hufTableBuffer[i] = 0;
			for (var i = 0; i < HUF_ENCSIZE; ++i) hufTableBuffer[hcode[i]] += 1;
			var c = 0;
			for (var i = 58; i > 0; --i) {
				var nc = c + hufTableBuffer[i] >> 1;
				hufTableBuffer[i] = c;
				c = nc;
			}
			for (var i = 0; i < HUF_ENCSIZE; ++i) {
				var l = hcode[i];
				if (l > 0) hcode[i] = l | hufTableBuffer[l]++ << 6;
			}
		}
		function hufUnpackEncTable(uInt8Array2, inDataView, inOffset, ni, im, iM, hcode) {
			var p = inOffset;
			var c = 0;
			var lc = 0;
			for (; im <= iM; im++) {
				if (p.value - inOffset.value > ni) return false;
				getBits(6, c, lc, uInt8Array2, p);
				var l = getBitsReturn.l;
				c = getBitsReturn.c;
				lc = getBitsReturn.lc;
				hcode[im] = l;
				if (l == LONG_ZEROCODE_RUN) {
					if (p.value - inOffset.value > ni) throw "Something wrong with hufUnpackEncTable";
					getBits(8, c, lc, uInt8Array2, p);
					var zerun = getBitsReturn.l + SHORTEST_LONG_RUN;
					c = getBitsReturn.c;
					lc = getBitsReturn.lc;
					if (im + zerun > iM + 1) throw "Something wrong with hufUnpackEncTable";
					while (zerun--) hcode[im++] = 0;
					im--;
				} else if (l >= SHORT_ZEROCODE_RUN) {
					var zerun = l - SHORT_ZEROCODE_RUN + 2;
					if (im + zerun > iM + 1) throw "Something wrong with hufUnpackEncTable";
					while (zerun--) hcode[im++] = 0;
					im--;
				}
			}
			hufCanonicalCodeTable(hcode);
		}
		function hufLength(code) {
			return code & 63;
		}
		function hufCode(code) {
			return code >> 6;
		}
		function hufBuildDecTable(hcode, im, iM, hdecod) {
			for (; im <= iM; im++) {
				var c = hufCode(hcode[im]);
				var l = hufLength(hcode[im]);
				if (c >> l) throw "Invalid table entry";
				if (l > HUF_DECBITS) {
					var pl = hdecod[c >> l - HUF_DECBITS];
					if (pl.len) throw "Invalid table entry";
					pl.lit++;
					if (pl.p) {
						var p = pl.p;
						pl.p = new Array(pl.lit);
						for (var i = 0; i < pl.lit - 1; ++i) pl.p[i] = p[i];
					} else pl.p = new Array(1);
					pl.p[pl.lit - 1] = im;
				} else if (l) {
					var plOffset = 0;
					for (var i = 1 << HUF_DECBITS - l; i > 0; i--) {
						var pl = hdecod[(c << HUF_DECBITS - l) + plOffset];
						if (pl.len || pl.p) throw "Invalid table entry";
						pl.len = l;
						pl.lit = im;
						plOffset++;
					}
				}
			}
			return true;
		}
		const getCharReturn = {
			c: 0,
			lc: 0
		};
		function getChar(c, lc, uInt8Array2, inOffset) {
			c = c << 8 | parseUint8Array(uInt8Array2, inOffset);
			lc += 8;
			getCharReturn.c = c;
			getCharReturn.lc = lc;
		}
		const getCodeReturn = {
			c: 0,
			lc: 0
		};
		function getCode(po, rlc, c, lc, uInt8Array2, inDataView, inOffset, outBuffer, outBufferOffset, outBufferEndOffset) {
			if (po == rlc) {
				if (lc < 8) {
					getChar(c, lc, uInt8Array2, inOffset);
					c = getCharReturn.c;
					lc = getCharReturn.lc;
				}
				lc -= 8;
				var cs = c >> lc;
				var cs = new Uint8Array([cs])[0];
				if (outBufferOffset.value + cs > outBufferEndOffset) return false;
				var s = outBuffer[outBufferOffset.value - 1];
				while (cs-- > 0) outBuffer[outBufferOffset.value++] = s;
			} else if (outBufferOffset.value < outBufferEndOffset) outBuffer[outBufferOffset.value++] = po;
			else return false;
			getCodeReturn.c = c;
			getCodeReturn.lc = lc;
		}
		function UInt16(value) {
			return value & 65535;
		}
		function Int16(value) {
			var ref = UInt16(value);
			return ref > 32767 ? ref - 65536 : ref;
		}
		const wdec14Return = {
			a: 0,
			b: 0
		};
		function wdec14(l, h) {
			var ls = Int16(l);
			var hi = Int16(h);
			var ai = ls + (hi & 1) + (hi >> 1);
			var as = ai;
			var bs = ai - hi;
			wdec14Return.a = as;
			wdec14Return.b = bs;
		}
		function wdec16(l, h) {
			var m = UInt16(l);
			var d = UInt16(h);
			var bb = m - (d >> 1) & MOD_MASK;
			wdec14Return.a = d + bb - A_OFFSET & MOD_MASK;
			wdec14Return.b = bb;
		}
		function wav2Decode(buffer2, j, nx, ox, ny, oy, mx) {
			var w14 = mx < 16384;
			var n = nx > ny ? ny : nx;
			var p = 1;
			var p2;
			while (p <= n) p <<= 1;
			p >>= 1;
			p2 = p;
			p >>= 1;
			while (p >= 1) {
				var py = 0;
				var ey = py + oy * (ny - p2);
				var oy1 = oy * p;
				var oy2 = oy * p2;
				var ox1 = ox * p;
				var ox2 = ox * p2;
				var i00, i01, i10, i11;
				for (; py <= ey; py += oy2) {
					var px = py;
					var ex = py + ox * (nx - p2);
					for (; px <= ex; px += ox2) {
						var p01 = px + ox1;
						var p10 = px + oy1;
						var p11 = p10 + ox1;
						if (w14) {
							wdec14(buffer2[px + j], buffer2[p10 + j]);
							i00 = wdec14Return.a;
							i10 = wdec14Return.b;
							wdec14(buffer2[p01 + j], buffer2[p11 + j]);
							i01 = wdec14Return.a;
							i11 = wdec14Return.b;
							wdec14(i00, i01);
							buffer2[px + j] = wdec14Return.a;
							buffer2[p01 + j] = wdec14Return.b;
							wdec14(i10, i11);
							buffer2[p10 + j] = wdec14Return.a;
							buffer2[p11 + j] = wdec14Return.b;
						} else {
							wdec16(buffer2[px + j], buffer2[p10 + j]);
							i00 = wdec14Return.a;
							i10 = wdec14Return.b;
							wdec16(buffer2[p01 + j], buffer2[p11 + j]);
							i01 = wdec14Return.a;
							i11 = wdec14Return.b;
							wdec16(i00, i01);
							buffer2[px + j] = wdec14Return.a;
							buffer2[p01 + j] = wdec14Return.b;
							wdec16(i10, i11);
							buffer2[p10 + j] = wdec14Return.a;
							buffer2[p11 + j] = wdec14Return.b;
						}
					}
					if (nx & p) {
						var p10 = px + oy1;
						if (w14) wdec14(buffer2[px + j], buffer2[p10 + j]);
						else wdec16(buffer2[px + j], buffer2[p10 + j]);
						i00 = wdec14Return.a;
						buffer2[p10 + j] = wdec14Return.b;
						buffer2[px + j] = i00;
					}
				}
				if (ny & p) {
					var px = py;
					var ex = py + ox * (nx - p2);
					for (; px <= ex; px += ox2) {
						var p01 = px + ox1;
						if (w14) wdec14(buffer2[px + j], buffer2[p01 + j]);
						else wdec16(buffer2[px + j], buffer2[p01 + j]);
						i00 = wdec14Return.a;
						buffer2[p01 + j] = wdec14Return.b;
						buffer2[px + j] = i00;
					}
				}
				p2 = p;
				p >>= 1;
			}
			return py;
		}
		function hufDecode(encodingTable, decodingTable, uInt8Array2, inDataView, inOffset, ni, rlc, no, outBuffer, outOffset) {
			var c = 0;
			var lc = 0;
			var outBufferEndOffset = no;
			var inOffsetEnd = Math.trunc(inOffset.value + (ni + 7) / 8);
			while (inOffset.value < inOffsetEnd) {
				getChar(c, lc, uInt8Array2, inOffset);
				c = getCharReturn.c;
				lc = getCharReturn.lc;
				while (lc >= HUF_DECBITS) {
					var pl = decodingTable[c >> lc - HUF_DECBITS & HUF_DECMASK];
					if (pl.len) {
						lc -= pl.len;
						getCode(pl.lit, rlc, c, lc, uInt8Array2, inDataView, inOffset, outBuffer, outOffset, outBufferEndOffset);
						c = getCodeReturn.c;
						lc = getCodeReturn.lc;
					} else {
						if (!pl.p) throw "hufDecode issues";
						var j;
						for (j = 0; j < pl.lit; j++) {
							var l = hufLength(encodingTable[pl.p[j]]);
							while (lc < l && inOffset.value < inOffsetEnd) {
								getChar(c, lc, uInt8Array2, inOffset);
								c = getCharReturn.c;
								lc = getCharReturn.lc;
							}
							if (lc >= l) {
								if (hufCode(encodingTable[pl.p[j]]) == (c >> lc - l & (1 << l) - 1)) {
									lc -= l;
									getCode(pl.p[j], rlc, c, lc, uInt8Array2, inDataView, inOffset, outBuffer, outOffset, outBufferEndOffset);
									c = getCodeReturn.c;
									lc = getCodeReturn.lc;
									break;
								}
							}
						}
						if (j == pl.lit) throw "hufDecode issues";
					}
				}
			}
			var i = 8 - ni & 7;
			c >>= i;
			lc -= i;
			while (lc > 0) {
				var pl = decodingTable[c << HUF_DECBITS - lc & HUF_DECMASK];
				if (pl.len) {
					lc -= pl.len;
					getCode(pl.lit, rlc, c, lc, uInt8Array2, inDataView, inOffset, outBuffer, outOffset, outBufferEndOffset);
					c = getCodeReturn.c;
					lc = getCodeReturn.lc;
				} else throw "hufDecode issues";
			}
			return true;
		}
		function hufUncompress(uInt8Array2, inDataView, inOffset, nCompressed, outBuffer, nRaw) {
			var outOffset = { value: 0 };
			var initialInOffset = inOffset.value;
			var im = parseUint32(inDataView, inOffset);
			var iM = parseUint32(inDataView, inOffset);
			inOffset.value += 4;
			var nBits = parseUint32(inDataView, inOffset);
			inOffset.value += 4;
			if (im < 0 || im >= HUF_ENCSIZE || iM < 0 || iM >= HUF_ENCSIZE) throw "Something wrong with HUF_ENCSIZE";
			var freq = new Array(HUF_ENCSIZE);
			var hdec = new Array(HUF_DECSIZE);
			hufClearDecTable(hdec);
			hufUnpackEncTable(uInt8Array2, inDataView, inOffset, nCompressed - (inOffset.value - initialInOffset), im, iM, freq);
			if (nBits > 8 * (nCompressed - (inOffset.value - initialInOffset))) throw "Something wrong with hufUncompress";
			hufBuildDecTable(freq, im, iM, hdec);
			hufDecode(freq, hdec, uInt8Array2, inDataView, inOffset, nBits, iM, nRaw, outBuffer, outOffset);
		}
		function applyLut(lut, data, nData) {
			for (var i = 0; i < nData; ++i) data[i] = lut[data[i]];
		}
		function predictor(source) {
			for (var t = 1; t < source.length; t++) source[t] = source[t - 1] + source[t] - 128;
		}
		function interleaveScalar(source, out) {
			var t1 = 0;
			var t2 = Math.floor((source.length + 1) / 2);
			var s = 0;
			var stop = source.length - 1;
			while (true) {
				if (s > stop) break;
				out[s++] = source[t1++];
				if (s > stop) break;
				out[s++] = source[t2++];
			}
		}
		function decodeRunLength(source) {
			var size = source.byteLength;
			var out = new Array();
			var p = 0;
			var reader = new DataView(source);
			while (size > 0) {
				var l = reader.getInt8(p++);
				if (l < 0) {
					var count = -l;
					size -= count + 1;
					for (var i = 0; i < count; i++) out.push(reader.getUint8(p++));
				} else {
					var count = l;
					size -= 2;
					var value = reader.getUint8(p++);
					for (var i = 0; i < count + 1; i++) out.push(value);
				}
			}
			return out;
		}
		function lossyDctDecode(cscSet, rowPtrs, channelData, acBuffer, dcBuffer, outBuffer) {
			var dataView = new DataView(outBuffer.buffer);
			var width = channelData[cscSet.idx[0]].width;
			var height = channelData[cscSet.idx[0]].height;
			var numComp = 3;
			var numFullBlocksX = Math.floor(width / 8);
			var numBlocksX = Math.ceil(width / 8);
			var numBlocksY = Math.ceil(height / 8);
			var leftoverX = width - (numBlocksX - 1) * 8;
			var leftoverY = height - (numBlocksY - 1) * 8;
			var currAcComp = { value: 0 };
			var currDcComp = new Array(numComp);
			var dctData = new Array(numComp);
			var halfZigBlock = new Array(numComp);
			var rowBlock = new Array(numComp);
			var rowOffsets = new Array(numComp);
			for (let comp2 = 0; comp2 < numComp; ++comp2) {
				rowOffsets[comp2] = rowPtrs[cscSet.idx[comp2]];
				currDcComp[comp2] = comp2 < 1 ? 0 : currDcComp[comp2 - 1] + numBlocksX * numBlocksY;
				dctData[comp2] = new Float32Array(64);
				halfZigBlock[comp2] = new Uint16Array(64);
				rowBlock[comp2] = new Uint16Array(numBlocksX * 64);
			}
			for (let blocky = 0; blocky < numBlocksY; ++blocky) {
				var maxY = 8;
				if (blocky == numBlocksY - 1) maxY = leftoverY;
				var maxX = 8;
				for (let blockx = 0; blockx < numBlocksX; ++blockx) {
					if (blockx == numBlocksX - 1) maxX = leftoverX;
					for (let comp2 = 0; comp2 < numComp; ++comp2) {
						halfZigBlock[comp2].fill(0);
						halfZigBlock[comp2][0] = dcBuffer[currDcComp[comp2]++];
						unRleAC(currAcComp, acBuffer, halfZigBlock[comp2]);
						unZigZag(halfZigBlock[comp2], dctData[comp2]);
						dctInverse(dctData[comp2]);
					}
					csc709Inverse(dctData);
					for (let comp2 = 0; comp2 < numComp; ++comp2) convertToHalf(dctData[comp2], rowBlock[comp2], blockx * 64);
				}
				let offset2 = 0;
				for (let comp2 = 0; comp2 < numComp; ++comp2) {
					const type2 = channelData[cscSet.idx[comp2]].type;
					for (let y2 = 8 * blocky; y2 < 8 * blocky + maxY; ++y2) {
						offset2 = rowOffsets[comp2][y2];
						for (let blockx = 0; blockx < numFullBlocksX; ++blockx) {
							const src = blockx * 64 + (y2 & 7) * 8;
							dataView.setUint16(offset2 + 0 * INT16_SIZE * type2, rowBlock[comp2][src + 0], true);
							dataView.setUint16(offset2 + 1 * INT16_SIZE * type2, rowBlock[comp2][src + 1], true);
							dataView.setUint16(offset2 + 2 * INT16_SIZE * type2, rowBlock[comp2][src + 2], true);
							dataView.setUint16(offset2 + 3 * INT16_SIZE * type2, rowBlock[comp2][src + 3], true);
							dataView.setUint16(offset2 + 4 * INT16_SIZE * type2, rowBlock[comp2][src + 4], true);
							dataView.setUint16(offset2 + 5 * INT16_SIZE * type2, rowBlock[comp2][src + 5], true);
							dataView.setUint16(offset2 + 6 * INT16_SIZE * type2, rowBlock[comp2][src + 6], true);
							dataView.setUint16(offset2 + 7 * INT16_SIZE * type2, rowBlock[comp2][src + 7], true);
							offset2 += 8 * INT16_SIZE * type2;
						}
					}
					if (numFullBlocksX != numBlocksX) for (let y2 = 8 * blocky; y2 < 8 * blocky + maxY; ++y2) {
						const offset3 = rowOffsets[comp2][y2] + 8 * numFullBlocksX * INT16_SIZE * type2;
						const src = numFullBlocksX * 64 + (y2 & 7) * 8;
						for (let x2 = 0; x2 < maxX; ++x2) dataView.setUint16(offset3 + x2 * INT16_SIZE * type2, rowBlock[comp2][src + x2], true);
					}
				}
			}
			var halfRow = new Uint16Array(width);
			var dataView = new DataView(outBuffer.buffer);
			for (var comp = 0; comp < numComp; ++comp) {
				channelData[cscSet.idx[comp]].decoded = true;
				var type = channelData[cscSet.idx[comp]].type;
				if (channelData[comp].type != 2) continue;
				for (var y = 0; y < height; ++y) {
					const offset2 = rowOffsets[comp][y];
					for (var x = 0; x < width; ++x) halfRow[x] = dataView.getUint16(offset2 + x * INT16_SIZE * type, true);
					for (var x = 0; x < width; ++x) dataView.setFloat32(offset2 + x * INT16_SIZE * type, decodeFloat16(halfRow[x]), true);
				}
			}
		}
		function unRleAC(currAcComp, acBuffer, halfZigBlock) {
			var acValue;
			var dctComp = 1;
			while (dctComp < 64) {
				acValue = acBuffer[currAcComp.value];
				if (acValue == 65280) dctComp = 64;
				else if (acValue >> 8 == 255) dctComp += acValue & 255;
				else {
					halfZigBlock[dctComp] = acValue;
					dctComp++;
				}
				currAcComp.value++;
			}
		}
		function unZigZag(src, dst) {
			dst[0] = decodeFloat16(src[0]);
			dst[1] = decodeFloat16(src[1]);
			dst[2] = decodeFloat16(src[5]);
			dst[3] = decodeFloat16(src[6]);
			dst[4] = decodeFloat16(src[14]);
			dst[5] = decodeFloat16(src[15]);
			dst[6] = decodeFloat16(src[27]);
			dst[7] = decodeFloat16(src[28]);
			dst[8] = decodeFloat16(src[2]);
			dst[9] = decodeFloat16(src[4]);
			dst[10] = decodeFloat16(src[7]);
			dst[11] = decodeFloat16(src[13]);
			dst[12] = decodeFloat16(src[16]);
			dst[13] = decodeFloat16(src[26]);
			dst[14] = decodeFloat16(src[29]);
			dst[15] = decodeFloat16(src[42]);
			dst[16] = decodeFloat16(src[3]);
			dst[17] = decodeFloat16(src[8]);
			dst[18] = decodeFloat16(src[12]);
			dst[19] = decodeFloat16(src[17]);
			dst[20] = decodeFloat16(src[25]);
			dst[21] = decodeFloat16(src[30]);
			dst[22] = decodeFloat16(src[41]);
			dst[23] = decodeFloat16(src[43]);
			dst[24] = decodeFloat16(src[9]);
			dst[25] = decodeFloat16(src[11]);
			dst[26] = decodeFloat16(src[18]);
			dst[27] = decodeFloat16(src[24]);
			dst[28] = decodeFloat16(src[31]);
			dst[29] = decodeFloat16(src[40]);
			dst[30] = decodeFloat16(src[44]);
			dst[31] = decodeFloat16(src[53]);
			dst[32] = decodeFloat16(src[10]);
			dst[33] = decodeFloat16(src[19]);
			dst[34] = decodeFloat16(src[23]);
			dst[35] = decodeFloat16(src[32]);
			dst[36] = decodeFloat16(src[39]);
			dst[37] = decodeFloat16(src[45]);
			dst[38] = decodeFloat16(src[52]);
			dst[39] = decodeFloat16(src[54]);
			dst[40] = decodeFloat16(src[20]);
			dst[41] = decodeFloat16(src[22]);
			dst[42] = decodeFloat16(src[33]);
			dst[43] = decodeFloat16(src[38]);
			dst[44] = decodeFloat16(src[46]);
			dst[45] = decodeFloat16(src[51]);
			dst[46] = decodeFloat16(src[55]);
			dst[47] = decodeFloat16(src[60]);
			dst[48] = decodeFloat16(src[21]);
			dst[49] = decodeFloat16(src[34]);
			dst[50] = decodeFloat16(src[37]);
			dst[51] = decodeFloat16(src[47]);
			dst[52] = decodeFloat16(src[50]);
			dst[53] = decodeFloat16(src[56]);
			dst[54] = decodeFloat16(src[59]);
			dst[55] = decodeFloat16(src[61]);
			dst[56] = decodeFloat16(src[35]);
			dst[57] = decodeFloat16(src[36]);
			dst[58] = decodeFloat16(src[48]);
			dst[59] = decodeFloat16(src[49]);
			dst[60] = decodeFloat16(src[57]);
			dst[61] = decodeFloat16(src[58]);
			dst[62] = decodeFloat16(src[62]);
			dst[63] = decodeFloat16(src[63]);
		}
		function dctInverse(data) {
			const a = .5 * Math.cos(3.14159 / 4);
			const b = .5 * Math.cos(3.14159 / 16);
			const c = .5 * Math.cos(3.14159 / 8);
			const d = .5 * Math.cos(3 * 3.14159 / 16);
			const e = .5 * Math.cos(5 * 3.14159 / 16);
			const f = .5 * Math.cos(3 * 3.14159 / 8);
			const g = .5 * Math.cos(7 * 3.14159 / 16);
			var alpha = new Array(4);
			var beta = new Array(4);
			var theta = new Array(4);
			var gamma = new Array(4);
			for (var row = 0; row < 8; ++row) {
				var rowPtr = row * 8;
				alpha[0] = c * data[rowPtr + 2];
				alpha[1] = f * data[rowPtr + 2];
				alpha[2] = c * data[rowPtr + 6];
				alpha[3] = f * data[rowPtr + 6];
				beta[0] = b * data[rowPtr + 1] + d * data[rowPtr + 3] + e * data[rowPtr + 5] + g * data[rowPtr + 7];
				beta[1] = d * data[rowPtr + 1] - g * data[rowPtr + 3] - b * data[rowPtr + 5] - e * data[rowPtr + 7];
				beta[2] = e * data[rowPtr + 1] - b * data[rowPtr + 3] + g * data[rowPtr + 5] + d * data[rowPtr + 7];
				beta[3] = g * data[rowPtr + 1] - e * data[rowPtr + 3] + d * data[rowPtr + 5] - b * data[rowPtr + 7];
				theta[0] = a * (data[rowPtr + 0] + data[rowPtr + 4]);
				theta[3] = a * (data[rowPtr + 0] - data[rowPtr + 4]);
				theta[1] = alpha[0] + alpha[3];
				theta[2] = alpha[1] - alpha[2];
				gamma[0] = theta[0] + theta[1];
				gamma[1] = theta[3] + theta[2];
				gamma[2] = theta[3] - theta[2];
				gamma[3] = theta[0] - theta[1];
				data[rowPtr + 0] = gamma[0] + beta[0];
				data[rowPtr + 1] = gamma[1] + beta[1];
				data[rowPtr + 2] = gamma[2] + beta[2];
				data[rowPtr + 3] = gamma[3] + beta[3];
				data[rowPtr + 4] = gamma[3] - beta[3];
				data[rowPtr + 5] = gamma[2] - beta[2];
				data[rowPtr + 6] = gamma[1] - beta[1];
				data[rowPtr + 7] = gamma[0] - beta[0];
			}
			for (var column = 0; column < 8; ++column) {
				alpha[0] = c * data[16 + column];
				alpha[1] = f * data[16 + column];
				alpha[2] = c * data[48 + column];
				alpha[3] = f * data[48 + column];
				beta[0] = b * data[8 + column] + d * data[24 + column] + e * data[40 + column] + g * data[56 + column];
				beta[1] = d * data[8 + column] - g * data[24 + column] - b * data[40 + column] - e * data[56 + column];
				beta[2] = e * data[8 + column] - b * data[24 + column] + g * data[40 + column] + d * data[56 + column];
				beta[3] = g * data[8 + column] - e * data[24 + column] + d * data[40 + column] - b * data[56 + column];
				theta[0] = a * (data[column] + data[32 + column]);
				theta[3] = a * (data[column] - data[32 + column]);
				theta[1] = alpha[0] + alpha[3];
				theta[2] = alpha[1] - alpha[2];
				gamma[0] = theta[0] + theta[1];
				gamma[1] = theta[3] + theta[2];
				gamma[2] = theta[3] - theta[2];
				gamma[3] = theta[0] - theta[1];
				data[0 + column] = gamma[0] + beta[0];
				data[8 + column] = gamma[1] + beta[1];
				data[16 + column] = gamma[2] + beta[2];
				data[24 + column] = gamma[3] + beta[3];
				data[32 + column] = gamma[3] - beta[3];
				data[40 + column] = gamma[2] - beta[2];
				data[48 + column] = gamma[1] - beta[1];
				data[56 + column] = gamma[0] - beta[0];
			}
		}
		function csc709Inverse(data) {
			for (var i = 0; i < 64; ++i) {
				var y = data[0][i];
				var cb = data[1][i];
				var cr = data[2][i];
				data[0][i] = y + 1.5747 * cr;
				data[1][i] = y - .1873 * cb - .4682 * cr;
				data[2][i] = y + 1.8556 * cb;
			}
		}
		function convertToHalf(src, dst, idx) {
			for (var i = 0; i < 64; ++i) dst[idx + i] = DataUtils.toHalfFloat(toLinear(src[i]));
		}
		function toLinear(float) {
			if (float <= 1) return Math.sign(float) * Math.pow(Math.abs(float), 2.2);
			else return Math.sign(float) * Math.pow(logBase, Math.abs(float) - 1);
		}
		function uncompressRAW(info) {
			return new DataView(info.array.buffer, info.offset.value, info.size);
		}
		function uncompressRLE(info) {
			var compressed = info.viewer.buffer.slice(info.offset.value, info.offset.value + info.size);
			var rawBuffer = new Uint8Array(decodeRunLength(compressed));
			var tmpBuffer = new Uint8Array(rawBuffer.length);
			predictor(rawBuffer);
			interleaveScalar(rawBuffer, tmpBuffer);
			return new DataView(tmpBuffer.buffer);
		}
		function uncompressZIP(info) {
			var rawBuffer = unzlibSync(info.array.slice(info.offset.value, info.offset.value + info.size));
			var tmpBuffer = new Uint8Array(rawBuffer.length);
			predictor(rawBuffer);
			interleaveScalar(rawBuffer, tmpBuffer);
			return new DataView(tmpBuffer.buffer);
		}
		function uncompressPIZ(info) {
			var inDataView = info.viewer;
			var inOffset = { value: info.offset.value };
			var outBuffer = new Uint16Array(info.width * info.scanlineBlockSize * (info.channels * info.type));
			var bitmap = new Uint8Array(BITMAP_SIZE);
			var outBufferEnd = 0;
			var pizChannelData = new Array(info.channels);
			for (var i = 0; i < info.channels; i++) {
				pizChannelData[i] = {};
				pizChannelData[i]["start"] = outBufferEnd;
				pizChannelData[i]["end"] = pizChannelData[i]["start"];
				pizChannelData[i]["nx"] = info.width;
				pizChannelData[i]["ny"] = info.lines;
				pizChannelData[i]["size"] = info.type;
				outBufferEnd += pizChannelData[i].nx * pizChannelData[i].ny * pizChannelData[i].size;
			}
			var minNonZero = parseUint16(inDataView, inOffset);
			var maxNonZero = parseUint16(inDataView, inOffset);
			if (maxNonZero >= BITMAP_SIZE) throw "Something is wrong with PIZ_COMPRESSION BITMAP_SIZE";
			if (minNonZero <= maxNonZero) for (var i = 0; i < maxNonZero - minNonZero + 1; i++) bitmap[i + minNonZero] = parseUint8(inDataView, inOffset);
			var lut = new Uint16Array(USHORT_RANGE);
			var maxValue = reverseLutFromBitmap(bitmap, lut);
			var length = parseUint32(inDataView, inOffset);
			hufUncompress(info.array, inDataView, inOffset, length, outBuffer, outBufferEnd);
			for (var i = 0; i < info.channels; ++i) {
				var cd = pizChannelData[i];
				for (var j = 0; j < pizChannelData[i].size; ++j) wav2Decode(outBuffer, cd.start + j, cd.nx, cd.size, cd.ny, cd.nx * cd.size, maxValue);
			}
			applyLut(lut, outBuffer, outBufferEnd);
			var tmpOffset2 = 0;
			var tmpBuffer = new Uint8Array(outBuffer.buffer.byteLength);
			for (var y = 0; y < info.lines; y++) for (var c = 0; c < info.channels; c++) {
				var cd = pizChannelData[c];
				var n = cd.nx * cd.size;
				var cp = new Uint8Array(outBuffer.buffer, cd.end * INT16_SIZE, n * INT16_SIZE);
				tmpBuffer.set(cp, tmpOffset2);
				tmpOffset2 += n * INT16_SIZE;
				cd.end += n;
			}
			return new DataView(tmpBuffer.buffer);
		}
		function uncompressPXR(info) {
			var rawBuffer = unzlibSync(info.array.slice(info.offset.value, info.offset.value + info.size));
			const sz = info.lines * info.channels * info.width;
			const tmpBuffer = info.type == 1 ? new Uint16Array(sz) : new Uint32Array(sz);
			let tmpBufferEnd = 0;
			let writePtr = 0;
			const ptr = new Array(4);
			for (let y = 0; y < info.lines; y++) for (let c = 0; c < info.channels; c++) {
				let pixel = 0;
				switch (info.type) {
					case 1:
						ptr[0] = tmpBufferEnd;
						ptr[1] = ptr[0] + info.width;
						tmpBufferEnd = ptr[1] + info.width;
						for (let j = 0; j < info.width; ++j) {
							const diff = rawBuffer[ptr[0]++] << 8 | rawBuffer[ptr[1]++];
							pixel += diff;
							tmpBuffer[writePtr] = pixel;
							writePtr++;
						}
						break;
					case 2:
						ptr[0] = tmpBufferEnd;
						ptr[1] = ptr[0] + info.width;
						ptr[2] = ptr[1] + info.width;
						tmpBufferEnd = ptr[2] + info.width;
						for (let j = 0; j < info.width; ++j) {
							const diff = rawBuffer[ptr[0]++] << 24 | rawBuffer[ptr[1]++] << 16 | rawBuffer[ptr[2]++] << 8;
							pixel += diff;
							tmpBuffer[writePtr] = pixel;
							writePtr++;
						}
						break;
				}
			}
			return new DataView(tmpBuffer.buffer);
		}
		function uncompressDWA(info) {
			var inDataView = info.viewer;
			var inOffset = { value: info.offset.value };
			var outBuffer = new Uint8Array(info.width * info.lines * (info.channels * info.type * INT16_SIZE));
			var dwaHeader = {
				version: parseInt64(inDataView, inOffset),
				unknownUncompressedSize: parseInt64(inDataView, inOffset),
				unknownCompressedSize: parseInt64(inDataView, inOffset),
				acCompressedSize: parseInt64(inDataView, inOffset),
				dcCompressedSize: parseInt64(inDataView, inOffset),
				rleCompressedSize: parseInt64(inDataView, inOffset),
				rleUncompressedSize: parseInt64(inDataView, inOffset),
				rleRawSize: parseInt64(inDataView, inOffset),
				totalAcUncompressedCount: parseInt64(inDataView, inOffset),
				totalDcUncompressedCount: parseInt64(inDataView, inOffset),
				acCompression: parseInt64(inDataView, inOffset)
			};
			if (dwaHeader.version < 2) throw "EXRLoader.parse: " + EXRHeader.compression + " version " + dwaHeader.version + " is unsupported";
			var channelRules = new Array();
			var ruleSize = parseUint16(inDataView, inOffset) - INT16_SIZE;
			while (ruleSize > 0) {
				var name = parseNullTerminatedString(inDataView.buffer, inOffset);
				var value = parseUint8(inDataView, inOffset);
				var compression = value >> 2 & 3;
				var csc = (value >> 4) - 1;
				var index = new Int8Array([csc])[0];
				var type = parseUint8(inDataView, inOffset);
				channelRules.push({
					name,
					index,
					type,
					compression
				});
				ruleSize -= name.length + 3;
			}
			var channels = EXRHeader.channels;
			var channelData = new Array(info.channels);
			for (var i = 0; i < info.channels; ++i) {
				var cd = channelData[i] = {};
				var channel = channels[i];
				cd.name = channel.name;
				cd.compression = UNKNOWN;
				cd.decoded = false;
				cd.type = channel.pixelType;
				cd.pLinear = channel.pLinear;
				cd.width = info.width;
				cd.height = info.lines;
			}
			var cscSet = { idx: new Array(3) };
			for (var offset2 = 0; offset2 < info.channels; ++offset2) {
				var cd = channelData[offset2];
				for (var i = 0; i < channelRules.length; ++i) {
					var rule = channelRules[i];
					if (cd.name == rule.name) {
						cd.compression = rule.compression;
						if (rule.index >= 0) cscSet.idx[rule.index] = offset2;
						cd.offset = offset2;
					}
				}
			}
			if (dwaHeader.acCompressedSize > 0) switch (dwaHeader.acCompression) {
				case STATIC_HUFFMAN:
					var acBuffer = new Uint16Array(dwaHeader.totalAcUncompressedCount);
					hufUncompress(info.array, inDataView, inOffset, dwaHeader.acCompressedSize, acBuffer, dwaHeader.totalAcUncompressedCount);
					break;
				case DEFLATE:
					var compressed = info.array.slice(inOffset.value, inOffset.value + dwaHeader.totalAcUncompressedCount);
					var data = unzlibSync(compressed);
					var acBuffer = new Uint16Array(data.buffer);
					inOffset.value += dwaHeader.totalAcUncompressedCount;
					break;
			}
			if (dwaHeader.dcCompressedSize > 0) {
				var zlibInfo = {
					array: info.array,
					offset: inOffset,
					size: dwaHeader.dcCompressedSize
				};
				var dcBuffer = new Uint16Array(uncompressZIP(zlibInfo).buffer);
				inOffset.value += dwaHeader.dcCompressedSize;
			}
			if (dwaHeader.rleRawSize > 0) {
				var compressed = info.array.slice(inOffset.value, inOffset.value + dwaHeader.rleCompressedSize);
				var data = unzlibSync(compressed);
				var rleBuffer = decodeRunLength(data.buffer);
				inOffset.value += dwaHeader.rleCompressedSize;
			}
			var outBufferEnd = 0;
			var rowOffsets = new Array(channelData.length);
			for (var i = 0; i < rowOffsets.length; ++i) rowOffsets[i] = new Array();
			for (var y = 0; y < info.lines; ++y) for (var chan = 0; chan < channelData.length; ++chan) {
				rowOffsets[chan].push(outBufferEnd);
				outBufferEnd += channelData[chan].width * info.type * INT16_SIZE;
			}
			lossyDctDecode(cscSet, rowOffsets, channelData, acBuffer, dcBuffer, outBuffer);
			for (var i = 0; i < channelData.length; ++i) {
				var cd = channelData[i];
				if (cd.decoded) continue;
				switch (cd.compression) {
					case RLE:
						var row = 0;
						var rleOffset = 0;
						for (var y = 0; y < info.lines; ++y) {
							var rowOffsetBytes = rowOffsets[i][row];
							for (var x = 0; x < cd.width; ++x) {
								for (var byte = 0; byte < INT16_SIZE * cd.type; ++byte) outBuffer[rowOffsetBytes++] = rleBuffer[rleOffset + byte * cd.width * cd.height];
								rleOffset++;
							}
							row++;
						}
						break;
					case LOSSY_DCT:
					default: throw "EXRLoader.parse: unsupported channel compression";
				}
			}
			return new DataView(outBuffer.buffer);
		}
		function parseNullTerminatedString(buffer2, offset2) {
			var uintBuffer = new Uint8Array(buffer2);
			var endOffset = 0;
			while (uintBuffer[offset2.value + endOffset] != 0) endOffset += 1;
			var stringValue = new TextDecoder().decode(uintBuffer.slice(offset2.value, offset2.value + endOffset));
			offset2.value = offset2.value + endOffset + 1;
			return stringValue;
		}
		function parseFixedLengthString(buffer2, offset2, size) {
			var stringValue = new TextDecoder().decode(new Uint8Array(buffer2).slice(offset2.value, offset2.value + size));
			offset2.value = offset2.value + size;
			return stringValue;
		}
		function parseRational(dataView, offset2) {
			return [parseInt32(dataView, offset2), parseUint32(dataView, offset2)];
		}
		function parseTimecode(dataView, offset2) {
			return [parseUint32(dataView, offset2), parseUint32(dataView, offset2)];
		}
		function parseInt32(dataView, offset2) {
			var Int32 = dataView.getInt32(offset2.value, true);
			offset2.value = offset2.value + INT32_SIZE;
			return Int32;
		}
		function parseUint32(dataView, offset2) {
			var Uint32 = dataView.getUint32(offset2.value, true);
			offset2.value = offset2.value + INT32_SIZE;
			return Uint32;
		}
		function parseUint8Array(uInt8Array2, offset2) {
			var Uint8 = uInt8Array2[offset2.value];
			offset2.value = offset2.value + INT8_SIZE;
			return Uint8;
		}
		function parseUint8(dataView, offset2) {
			var Uint8 = dataView.getUint8(offset2.value);
			offset2.value = offset2.value + INT8_SIZE;
			return Uint8;
		}
		const parseInt64 = function(dataView, offset2) {
			let int;
			if ("getBigInt64" in DataView.prototype) int = Number(dataView.getBigInt64(offset2.value, true));
			else int = dataView.getUint32(offset2.value + 4, true) + Number(dataView.getUint32(offset2.value, true) << 32);
			offset2.value += ULONG_SIZE;
			return int;
		};
		function parseFloat32(dataView, offset2) {
			var float = dataView.getFloat32(offset2.value, true);
			offset2.value += FLOAT32_SIZE;
			return float;
		}
		function decodeFloat32(dataView, offset2) {
			return DataUtils.toHalfFloat(parseFloat32(dataView, offset2));
		}
		function decodeFloat16(binary) {
			var exponent = (binary & 31744) >> 10, fraction = binary & 1023;
			return (binary >> 15 ? -1 : 1) * (exponent ? exponent === 31 ? fraction ? NaN : Infinity : Math.pow(2, exponent - 15) * (1 + fraction / 1024) : 6103515625e-14 * (fraction / 1024));
		}
		function parseUint16(dataView, offset2) {
			var Uint16 = dataView.getUint16(offset2.value, true);
			offset2.value += INT16_SIZE;
			return Uint16;
		}
		function parseFloat16(buffer2, offset2) {
			return decodeFloat16(parseUint16(buffer2, offset2));
		}
		function parseChlist(dataView, buffer2, offset2, size) {
			var startOffset = offset2.value;
			var channels = [];
			while (offset2.value < startOffset + size - 1) {
				var name = parseNullTerminatedString(buffer2, offset2);
				var pixelType = parseInt32(dataView, offset2);
				var pLinear = parseUint8(dataView, offset2);
				offset2.value += 3;
				var xSampling = parseInt32(dataView, offset2);
				var ySampling = parseInt32(dataView, offset2);
				channels.push({
					name,
					pixelType,
					pLinear,
					xSampling,
					ySampling
				});
			}
			offset2.value += 1;
			return channels;
		}
		function parseChromaticities(dataView, offset2) {
			return {
				redX: parseFloat32(dataView, offset2),
				redY: parseFloat32(dataView, offset2),
				greenX: parseFloat32(dataView, offset2),
				greenY: parseFloat32(dataView, offset2),
				blueX: parseFloat32(dataView, offset2),
				blueY: parseFloat32(dataView, offset2),
				whiteX: parseFloat32(dataView, offset2),
				whiteY: parseFloat32(dataView, offset2)
			};
		}
		function parseCompression(dataView, offset2) {
			return [
				"NO_COMPRESSION",
				"RLE_COMPRESSION",
				"ZIPS_COMPRESSION",
				"ZIP_COMPRESSION",
				"PIZ_COMPRESSION",
				"PXR24_COMPRESSION",
				"B44_COMPRESSION",
				"B44A_COMPRESSION",
				"DWAA_COMPRESSION",
				"DWAB_COMPRESSION"
			][parseUint8(dataView, offset2)];
		}
		function parseBox2i(dataView, offset2) {
			return {
				xMin: parseUint32(dataView, offset2),
				yMin: parseUint32(dataView, offset2),
				xMax: parseUint32(dataView, offset2),
				yMax: parseUint32(dataView, offset2)
			};
		}
		function parseLineOrder(dataView, offset2) {
			return ["INCREASING_Y"][parseUint8(dataView, offset2)];
		}
		function parseV2f(dataView, offset2) {
			return [parseFloat32(dataView, offset2), parseFloat32(dataView, offset2)];
		}
		function parseV3f(dataView, offset2) {
			return [
				parseFloat32(dataView, offset2),
				parseFloat32(dataView, offset2),
				parseFloat32(dataView, offset2)
			];
		}
		function parseValue(dataView, buffer2, offset2, type, size) {
			if (type === "string" || type === "stringvector" || type === "iccProfile") return parseFixedLengthString(buffer2, offset2, size);
			else if (type === "chlist") return parseChlist(dataView, buffer2, offset2, size);
			else if (type === "chromaticities") return parseChromaticities(dataView, offset2);
			else if (type === "compression") return parseCompression(dataView, offset2);
			else if (type === "box2i") return parseBox2i(dataView, offset2);
			else if (type === "lineOrder") return parseLineOrder(dataView, offset2);
			else if (type === "float") return parseFloat32(dataView, offset2);
			else if (type === "v2f") return parseV2f(dataView, offset2);
			else if (type === "v3f") return parseV3f(dataView, offset2);
			else if (type === "int") return parseInt32(dataView, offset2);
			else if (type === "rational") return parseRational(dataView, offset2);
			else if (type === "timecode") return parseTimecode(dataView, offset2);
			else if (type === "preview") {
				offset2.value += size;
				return "skipped";
			} else {
				offset2.value += size;
				return;
			}
		}
		function parseHeader(dataView, buffer2, offset2) {
			const EXRHeader2 = {};
			if (dataView.getUint32(0, true) != 20000630) throw "THREE.EXRLoader: provided file doesn't appear to be in OpenEXR format.";
			EXRHeader2.version = dataView.getUint8(4);
			const spec = dataView.getUint8(5);
			EXRHeader2.spec = {
				singleTile: !!(spec & 2),
				longName: !!(spec & 4),
				deepFormat: !!(spec & 8),
				multiPart: !!(spec & 16)
			};
			offset2.value = 8;
			var keepReading = true;
			while (keepReading) {
				var attributeName = parseNullTerminatedString(buffer2, offset2);
				if (attributeName == 0) keepReading = false;
				else {
					var attributeType = parseNullTerminatedString(buffer2, offset2);
					var attributeValue = parseValue(dataView, buffer2, offset2, attributeType, parseUint32(dataView, offset2));
					if (attributeValue === void 0) console.warn(`EXRLoader.parse: skipped unknown header attribute type '${attributeType}'.`);
					else EXRHeader2[attributeName] = attributeValue;
				}
			}
			if ((spec & -5) != 0) {
				console.error("EXRHeader:", EXRHeader2);
				throw "THREE.EXRLoader: provided file is currently unsupported.";
			}
			return EXRHeader2;
		}
		function setupDecoder(EXRHeader2, dataView, uInt8Array2, offset2, outputType) {
			const EXRDecoder2 = {
				size: 0,
				viewer: dataView,
				array: uInt8Array2,
				offset: offset2,
				width: EXRHeader2.dataWindow.xMax - EXRHeader2.dataWindow.xMin + 1,
				height: EXRHeader2.dataWindow.yMax - EXRHeader2.dataWindow.yMin + 1,
				channels: EXRHeader2.channels.length,
				bytesPerLine: null,
				lines: null,
				inputSize: null,
				type: EXRHeader2.channels[0].pixelType,
				uncompress: null,
				getter: null,
				format: null,
				[hasColorSpace ? "colorSpace" : "encoding"]: null
			};
			switch (EXRHeader2.compression) {
				case "NO_COMPRESSION":
					EXRDecoder2.lines = 1;
					EXRDecoder2.uncompress = uncompressRAW;
					break;
				case "RLE_COMPRESSION":
					EXRDecoder2.lines = 1;
					EXRDecoder2.uncompress = uncompressRLE;
					break;
				case "ZIPS_COMPRESSION":
					EXRDecoder2.lines = 1;
					EXRDecoder2.uncompress = uncompressZIP;
					break;
				case "ZIP_COMPRESSION":
					EXRDecoder2.lines = 16;
					EXRDecoder2.uncompress = uncompressZIP;
					break;
				case "PIZ_COMPRESSION":
					EXRDecoder2.lines = 32;
					EXRDecoder2.uncompress = uncompressPIZ;
					break;
				case "PXR24_COMPRESSION":
					EXRDecoder2.lines = 16;
					EXRDecoder2.uncompress = uncompressPXR;
					break;
				case "DWAA_COMPRESSION":
					EXRDecoder2.lines = 32;
					EXRDecoder2.uncompress = uncompressDWA;
					break;
				case "DWAB_COMPRESSION":
					EXRDecoder2.lines = 256;
					EXRDecoder2.uncompress = uncompressDWA;
					break;
				default: throw "EXRLoader.parse: " + EXRHeader2.compression + " is unsupported";
			}
			EXRDecoder2.scanlineBlockSize = EXRDecoder2.lines;
			if (EXRDecoder2.type == 1) switch (outputType) {
				case FloatType:
					EXRDecoder2.getter = parseFloat16;
					EXRDecoder2.inputSize = INT16_SIZE;
					break;
				case HalfFloatType:
					EXRDecoder2.getter = parseUint16;
					EXRDecoder2.inputSize = INT16_SIZE;
					break;
			}
			else if (EXRDecoder2.type == 2) switch (outputType) {
				case FloatType:
					EXRDecoder2.getter = parseFloat32;
					EXRDecoder2.inputSize = FLOAT32_SIZE;
					break;
				case HalfFloatType:
					EXRDecoder2.getter = decodeFloat32;
					EXRDecoder2.inputSize = FLOAT32_SIZE;
			}
			else throw "EXRLoader.parse: unsupported pixelType " + EXRDecoder2.type + " for " + EXRHeader2.compression + ".";
			EXRDecoder2.blockCount = (EXRHeader2.dataWindow.yMax + 1) / EXRDecoder2.scanlineBlockSize;
			for (var i = 0; i < EXRDecoder2.blockCount; i++) parseInt64(dataView, offset2);
			EXRDecoder2.outputChannels = EXRDecoder2.channels == 3 ? 4 : EXRDecoder2.channels;
			const size = EXRDecoder2.width * EXRDecoder2.height * EXRDecoder2.outputChannels;
			switch (outputType) {
				case FloatType:
					EXRDecoder2.byteArray = new Float32Array(size);
					if (EXRDecoder2.channels < EXRDecoder2.outputChannels) EXRDecoder2.byteArray.fill(1, 0, size);
					break;
				case HalfFloatType:
					EXRDecoder2.byteArray = new Uint16Array(size);
					if (EXRDecoder2.channels < EXRDecoder2.outputChannels) EXRDecoder2.byteArray.fill(15360, 0, size);
					break;
				default:
					console.error("THREE.EXRLoader: unsupported type: ", outputType);
					break;
			}
			EXRDecoder2.bytesPerLine = EXRDecoder2.width * EXRDecoder2.inputSize * EXRDecoder2.channels;
			if (EXRDecoder2.outputChannels == 4) EXRDecoder2.format = RGBAFormat;
			else EXRDecoder2.format = RedFormat;
			if (hasColorSpace) EXRDecoder2.colorSpace = "srgb-linear";
			else EXRDecoder2.encoding = 3e3;
			return EXRDecoder2;
		}
		const bufferDataView = new DataView(buffer);
		const uInt8Array = new Uint8Array(buffer);
		const offset = { value: 0 };
		const EXRHeader = parseHeader(bufferDataView, buffer, offset);
		const EXRDecoder = setupDecoder(EXRHeader, bufferDataView, uInt8Array, offset, this.type);
		const tmpOffset = { value: 0 };
		const channelOffsets = {
			R: 0,
			G: 1,
			B: 2,
			A: 3,
			Y: 0
		};
		for (let scanlineBlockIdx = 0; scanlineBlockIdx < EXRDecoder.height / EXRDecoder.scanlineBlockSize; scanlineBlockIdx++) {
			const line = parseUint32(bufferDataView, offset);
			EXRDecoder.size = parseUint32(bufferDataView, offset);
			EXRDecoder.lines = line + EXRDecoder.scanlineBlockSize > EXRDecoder.height ? EXRDecoder.height - line : EXRDecoder.scanlineBlockSize;
			const viewer = EXRDecoder.size < EXRDecoder.lines * EXRDecoder.bytesPerLine ? EXRDecoder.uncompress(EXRDecoder) : uncompressRAW(EXRDecoder);
			offset.value += EXRDecoder.size;
			for (let line_y = 0; line_y < EXRDecoder.scanlineBlockSize; line_y++) {
				const true_y = line_y + scanlineBlockIdx * EXRDecoder.scanlineBlockSize;
				if (true_y >= EXRDecoder.height) break;
				for (let channelID = 0; channelID < EXRDecoder.channels; channelID++) {
					const cOff = channelOffsets[EXRHeader.channels[channelID].name];
					for (let x = 0; x < EXRDecoder.width; x++) {
						tmpOffset.value = (line_y * (EXRDecoder.channels * EXRDecoder.width) + channelID * EXRDecoder.width + x) * EXRDecoder.inputSize;
						const outIndex = (EXRDecoder.height - 1 - true_y) * (EXRDecoder.width * EXRDecoder.outputChannels) + x * EXRDecoder.outputChannels + cOff;
						EXRDecoder.byteArray[outIndex] = EXRDecoder.getter(viewer, tmpOffset);
					}
				}
			}
		}
		return {
			header: EXRHeader,
			width: EXRDecoder.width,
			height: EXRDecoder.height,
			data: EXRDecoder.byteArray,
			format: EXRDecoder.format,
			[hasColorSpace ? "colorSpace" : "encoding"]: EXRDecoder[hasColorSpace ? "colorSpace" : "encoding"],
			type: this.type
		};
	}
	setDataType(value) {
		this.type = value;
		return this;
	}
	load(url, onLoad, onProgress, onError) {
		function onLoadCallback(texture, texData) {
			if (hasColorSpace) texture.colorSpace = texData.colorSpace;
			else texture.encoding = texData.encoding;
			texture.minFilter = LinearFilter;
			texture.magFilter = LinearFilter;
			texture.generateMipmaps = false;
			texture.flipY = false;
			if (onLoad) onLoad(texture, texData);
		}
		return super.load(url, onLoadCallback, onProgress, onError);
	}
};
//#endregion
//#region node_modules/@monogrid/gainmap-js/dist/QuadRenderer-Bj1xl_EK.js
/**
* @monogrid/gainmap-js v3.4.0
* With ❤️, by MONOGRID <gainmap@monogrid.com>
*/
var getBufferForType = (type, width, height) => {
	let out;
	switch (type) {
		case UnsignedByteType:
			out = new Uint8ClampedArray(width * height * 4);
			break;
		case HalfFloatType:
			out = new Uint16Array(width * height * 4);
			break;
		case UnsignedIntType:
			out = new Uint32Array(width * height * 4);
			break;
		case ByteType:
			out = new Int8Array(width * height * 4);
			break;
		case ShortType:
			out = new Int16Array(width * height * 4);
			break;
		case IntType:
			out = new Int32Array(width * height * 4);
			break;
		case FloatType:
			out = new Float32Array(width * height * 4);
			break;
		default: throw new Error("Unsupported data type");
	}
	return out;
};
var _canReadPixelsResult;
/**
* Test if this browser implementation can correctly read pixels from the specified
* Render target type.
*
* Runs only once
*
* @param type
* @param renderer
* @param camera
* @param renderTargetOptions
* @returns
*/
var canReadPixels = (type, renderer, camera, renderTargetOptions) => {
	if (_canReadPixelsResult !== void 0) return _canReadPixelsResult;
	const testRT = new WebGLRenderTarget(1, 1, renderTargetOptions);
	renderer.setRenderTarget(testRT);
	const mesh = new Mesh(new PlaneGeometry(), new MeshBasicMaterial({ color: 16777215 }));
	renderer.render(mesh, camera);
	renderer.setRenderTarget(null);
	const out = getBufferForType(type, testRT.width, testRT.height);
	renderer.readRenderTargetPixels(testRT, 0, 0, testRT.width, testRT.height, out);
	testRT.dispose();
	mesh.geometry.dispose();
	mesh.material.dispose();
	_canReadPixelsResult = out[0] !== 0;
	return _canReadPixelsResult;
};
/**
* Utility class used for rendering a texture with a material
*
* @category Core
* @group Core
*/
var QuadRenderer = class QuadRenderer {
	_renderer;
	_rendererIsDisposable = false;
	_material;
	_scene;
	_camera;
	_quad;
	_renderTarget;
	_width;
	_height;
	_type;
	_colorSpace;
	_supportsReadPixels = true;
	/**
	* Constructs a new QuadRenderer
	*
	* @param options Parameters for this QuadRenderer
	*/
	constructor(options) {
		this._width = options.width;
		this._height = options.height;
		this._type = options.type;
		this._colorSpace = options.colorSpace;
		const rtOptions = {
			format: RGBAFormat,
			depthBuffer: false,
			stencilBuffer: false,
			type: this._type,
			colorSpace: this._colorSpace,
			anisotropy: options.renderTargetOptions?.anisotropy !== void 0 ? options.renderTargetOptions?.anisotropy : 1,
			generateMipmaps: options.renderTargetOptions?.generateMipmaps !== void 0 ? options.renderTargetOptions?.generateMipmaps : false,
			magFilter: options.renderTargetOptions?.magFilter !== void 0 ? options.renderTargetOptions?.magFilter : LinearFilter,
			minFilter: options.renderTargetOptions?.minFilter !== void 0 ? options.renderTargetOptions?.minFilter : LinearFilter,
			samples: options.renderTargetOptions?.samples !== void 0 ? options.renderTargetOptions?.samples : void 0,
			wrapS: options.renderTargetOptions?.wrapS !== void 0 ? options.renderTargetOptions?.wrapS : ClampToEdgeWrapping,
			wrapT: options.renderTargetOptions?.wrapT !== void 0 ? options.renderTargetOptions?.wrapT : ClampToEdgeWrapping
		};
		this._material = options.material;
		if (options.renderer) this._renderer = options.renderer;
		else {
			this._renderer = QuadRenderer.instantiateRenderer();
			this._rendererIsDisposable = true;
		}
		this._scene = new Scene();
		this._camera = new OrthographicCamera();
		this._camera.position.set(0, 0, 10);
		this._camera.left = -.5;
		this._camera.right = .5;
		this._camera.top = .5;
		this._camera.bottom = -.5;
		this._camera.updateProjectionMatrix();
		if (!canReadPixels(this._type, this._renderer, this._camera, rtOptions)) {
			let alternativeType;
			switch (this._type) {
				case HalfFloatType:
					alternativeType = this._renderer.extensions.has("EXT_color_buffer_float") ? FloatType : void 0;
					break;
			}
			if (alternativeType !== void 0) {
				console.warn(`This browser does not support reading pixels from ${this._type} RenderTargets, switching to ${FloatType}`);
				this._type = alternativeType;
			} else {
				this._supportsReadPixels = false;
				console.warn("This browser dos not support toArray or toDataTexture, calls to those methods will result in an error thrown");
			}
		}
		this._quad = new Mesh(new PlaneGeometry(), this._material);
		this._quad.geometry.computeBoundingBox();
		this._scene.add(this._quad);
		this._renderTarget = new WebGLRenderTarget(this.width, this.height, rtOptions);
		this._renderTarget.texture.mapping = options.renderTargetOptions?.mapping !== void 0 ? options.renderTargetOptions?.mapping : 300;
	}
	/**
	* Instantiates a temporary renderer
	*
	* @returns
	*/
	static instantiateRenderer() {
		const renderer = new WebGLRenderer();
		renderer.setSize(128, 128);
		return renderer;
	}
	/**
	* Renders the input texture using the specified material
	*/
	render = () => {
		this._renderer.setRenderTarget(this._renderTarget);
		try {
			this._renderer.render(this._scene, this._camera);
		} catch (e) {
			this._renderer.setRenderTarget(null);
			throw e;
		}
		this._renderer.setRenderTarget(null);
	};
	/**
	* Obtains a Buffer containing the rendered texture.
	*
	* @throws Error if the browser cannot read pixels from this RenderTarget type.
	* @returns a TypedArray containing RGBA values from this renderer
	*/
	toArray() {
		if (!this._supportsReadPixels) throw new Error("Can't read pixels in this browser");
		const out = getBufferForType(this._type, this._width, this._height);
		this._renderer.readRenderTargetPixels(this._renderTarget, 0, 0, this._width, this._height, out);
		return out;
	}
	/**
	* Performs a readPixel operation in the renderTarget
	* and returns a DataTexture containing the read data
	*
	* @param options options
	* @returns
	*/
	toDataTexture(options) {
		const returnValue = new DataTexture(this.toArray(), this.width, this.height, RGBAFormat, this._type, options?.mapping || 300, options?.wrapS || 1001, options?.wrapT || 1001, options?.magFilter || 1006, options?.minFilter || 1006, options?.anisotropy || 1, LinearSRGBColorSpace);
		returnValue.generateMipmaps = options?.generateMipmaps !== void 0 ? options?.generateMipmaps : false;
		return returnValue;
	}
	/**
	* If using a disposable renderer, it will dispose it.
	*/
	disposeOnDemandRenderer() {
		this._renderer.setRenderTarget(null);
		if (this._rendererIsDisposable) {
			this._renderer.dispose();
			this._renderer.forceContextLoss();
		}
	}
	/**
	* Will dispose of **all** assets used by this renderer.
	*
	*
	* @param disposeRenderTarget will dispose of the renderTarget which will not be usable later
	* set this to true if you passed the `renderTarget.texture` to a `PMREMGenerator`
	* or are otherwise done with it.
	*
	* @example
	* ```js
	* const loader = new HDRJPGLoader(renderer)
	* const result = await loader.loadAsync('gainmap.jpeg')
	* const mesh = new Mesh(geometry, new MeshBasicMaterial({ map: result.renderTarget.texture }) )
	* // DO NOT dispose the renderTarget here,
	* // it is used directly in the material
	* result.dispose()
	* ```
	*
	* @example
	* ```js
	* const loader = new HDRJPGLoader(renderer)
	* const pmremGenerator = new PMREMGenerator( renderer );
	* const result = await loader.loadAsync('gainmap.jpeg')
	* const envMap = pmremGenerator.fromEquirectangular(result.renderTarget.texture)
	* const mesh = new Mesh(geometry, new MeshStandardMaterial({ envMap }) )
	* // renderTarget can be disposed here
	* // because it was used to generate a PMREM texture
	* result.dispose(true)
	* ```
	*/
	dispose(disposeRenderTarget) {
		this.disposeOnDemandRenderer();
		if (disposeRenderTarget) this.renderTarget.dispose();
		if (this.material instanceof ShaderMaterial) Object.values(this.material.uniforms).forEach((v) => {
			if (v.value instanceof Texture) v.value.dispose();
		});
		Object.values(this.material).forEach((value) => {
			if (value instanceof Texture) value.dispose();
		});
		this.material.dispose();
		this._quad.geometry.dispose();
	}
	/**
	* Width of the texture
	*/
	get width() {
		return this._width;
	}
	set width(value) {
		this._width = value;
		this._renderTarget.setSize(this._width, this._height);
	}
	/**
	* Height of the texture
	*/
	get height() {
		return this._height;
	}
	set height(value) {
		this._height = value;
		this._renderTarget.setSize(this._width, this._height);
	}
	/**
	* The renderer used
	*/
	get renderer() {
		return this._renderer;
	}
	/**
	* The `WebGLRenderTarget` used.
	*/
	get renderTarget() {
		return this._renderTarget;
	}
	set renderTarget(value) {
		this._renderTarget = value;
		this._width = value.width;
		this._height = value.height;
	}
	/**
	* The `Material` used.
	*/
	get material() {
		return this._material;
	}
	/**
	*
	*/
	get type() {
		return this._type;
	}
	get colorSpace() {
		return this._colorSpace;
	}
};
//#endregion
//#region node_modules/@monogrid/gainmap-js/dist/Loader-DLI-_JDP.js
/**
* @monogrid/gainmap-js v3.4.0
* With ❤️, by MONOGRID <gainmap@monogrid.com>
*/
/**
* Shared decode implementation factory
* Creates a decode function that prepares a QuadRenderer with the given parameters
*/
function createDecodeFunction(config) {
	return (params) => {
		const { sdr, gainMap, renderer } = params;
		if (sdr.colorSpace !== "srgb") {
			console.warn("SDR Colorspace needs to be *SRGBColorSpace*, setting it automatically");
			sdr.colorSpace = SRGBColorSpace;
		}
		sdr.needsUpdate = true;
		if (gainMap.colorSpace !== "srgb-linear") {
			console.warn("Gainmap Colorspace needs to be *LinearSRGBColorSpace*, setting it automatically");
			gainMap.colorSpace = LinearSRGBColorSpace;
		}
		gainMap.needsUpdate = true;
		const material = config.createMaterial({
			...params,
			sdr,
			gainMap
		});
		return config.createQuadRenderer({
			width: sdr.image.width,
			height: sdr.image.height,
			type: HalfFloatType,
			colorSpace: LinearSRGBColorSpace,
			material,
			renderer,
			renderTargetOptions: params.renderTargetOptions
		});
	};
}
var GainMapNotFoundError = class extends Error {};
var XMPMetadataNotFoundError = class extends Error {};
var getXMLValue = (xml, tag, defaultValue) => {
	const attributeMatch = new RegExp(`${tag}="([^"]*)"`, "i").exec(xml);
	if (attributeMatch) return attributeMatch[1];
	const tagMatch = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i").exec(xml);
	if (tagMatch) {
		const liValues = tagMatch[1].match(/<rdf:li>([^<]*)<\/rdf:li>/g);
		if (liValues && liValues.length === 3) return liValues.map((v) => v.replace(/<\/?rdf:li>/g, ""));
		return tagMatch[1].trim();
	}
	if (defaultValue !== void 0) return defaultValue;
	throw new Error(`Can't find ${tag} in gainmap metadata`);
};
var extractXMP = (input) => {
	let str;
	if (typeof TextDecoder !== "undefined") str = new TextDecoder().decode(input);
	else str = input.toString();
	let start = str.indexOf("<x:xmpmeta");
	while (start !== -1) {
		const end = str.indexOf("x:xmpmeta>", start);
		const xmpBlock = str.slice(start, end + 10);
		try {
			const gainMapMin = getXMLValue(xmpBlock, "hdrgm:GainMapMin", "0");
			const gainMapMax = getXMLValue(xmpBlock, "hdrgm:GainMapMax");
			const gamma = getXMLValue(xmpBlock, "hdrgm:Gamma", "1");
			const offsetSDR = getXMLValue(xmpBlock, "hdrgm:OffsetSDR", "0.015625");
			const offsetHDR = getXMLValue(xmpBlock, "hdrgm:OffsetHDR", "0.015625");
			const hdrCapacityMinMatch = /hdrgm:HDRCapacityMin="([^"]*)"/.exec(xmpBlock);
			const hdrCapacityMin = hdrCapacityMinMatch ? hdrCapacityMinMatch[1] : "0";
			const hdrCapacityMaxMatch = /hdrgm:HDRCapacityMax="([^"]*)"/.exec(xmpBlock);
			if (!hdrCapacityMaxMatch) throw new Error("Incomplete gainmap metadata");
			const hdrCapacityMax = hdrCapacityMaxMatch[1];
			return {
				gainMapMin: Array.isArray(gainMapMin) ? gainMapMin.map((v) => parseFloat(v)) : [
					parseFloat(gainMapMin),
					parseFloat(gainMapMin),
					parseFloat(gainMapMin)
				],
				gainMapMax: Array.isArray(gainMapMax) ? gainMapMax.map((v) => parseFloat(v)) : [
					parseFloat(gainMapMax),
					parseFloat(gainMapMax),
					parseFloat(gainMapMax)
				],
				gamma: Array.isArray(gamma) ? gamma.map((v) => parseFloat(v)) : [
					parseFloat(gamma),
					parseFloat(gamma),
					parseFloat(gamma)
				],
				offsetSdr: Array.isArray(offsetSDR) ? offsetSDR.map((v) => parseFloat(v)) : [
					parseFloat(offsetSDR),
					parseFloat(offsetSDR),
					parseFloat(offsetSDR)
				],
				offsetHdr: Array.isArray(offsetHDR) ? offsetHDR.map((v) => parseFloat(v)) : [
					parseFloat(offsetHDR),
					parseFloat(offsetHDR),
					parseFloat(offsetHDR)
				],
				hdrCapacityMin: parseFloat(hdrCapacityMin),
				hdrCapacityMax: parseFloat(hdrCapacityMax)
			};
		} catch (e) {}
		start = str.indexOf("<x:xmpmeta", end);
	}
};
/**
* MPF Extractor (Multi Picture Format Extractor)
* By Henrik S Nilsson 2019
*
* Extracts images stored in images based on the MPF format (found here: https://www.cipa.jp/e/std/std-sec.html
* under "CIPA DC-007-Translation-2021 Multi-Picture Format"
*
* Overly commented, and without intention of being complete or production ready.
* Created to extract depth maps from iPhone images, and to learn about image metadata.
* Kudos to: Phil Harvey (exiftool), Jaume Sanchez (android-lens-blur-depth-extractor)
*/
var MPFExtractor = class {
	options;
	constructor(options) {
		this.options = {
			debug: options && options.debug !== void 0 ? options.debug : false,
			extractFII: options && options.extractFII !== void 0 ? options.extractFII : true,
			extractNonFII: options && options.extractNonFII !== void 0 ? options.extractNonFII : true
		};
	}
	extract(imageArrayBuffer) {
		return new Promise((resolve, reject) => {
			const debug = this.options.debug;
			const dataView = new DataView(imageArrayBuffer.buffer);
			if (dataView.getUint16(0) !== 65496) {
				reject(/* @__PURE__ */ new Error("Not a valid jpeg"));
				return;
			}
			const length = dataView.byteLength;
			let offset = 2;
			let loops = 0;
			let marker;
			while (offset < length) {
				if (++loops > 250) {
					reject(/* @__PURE__ */ new Error(`Found no marker after ${loops} loops 😵`));
					return;
				}
				if (dataView.getUint8(offset) !== 255) {
					reject(/* @__PURE__ */ new Error(`Not a valid marker at offset 0x${offset.toString(16)}, found: 0x${dataView.getUint8(offset).toString(16)}`));
					return;
				}
				marker = dataView.getUint8(offset + 1);
				if (debug) console.log(`Marker: ${marker.toString(16)}`);
				if (marker === 226) {
					if (debug) console.log("Found APP2 marker (0xffe2)");
					const formatPt = offset + 4;
					if (dataView.getUint32(formatPt) === 1297106432) {
						const tiffOffset = formatPt + 4;
						let bigEnd;
						if (dataView.getUint16(tiffOffset) === 18761) bigEnd = false;
						else if (dataView.getUint16(tiffOffset) === 19789) bigEnd = true;
						else {
							reject(/* @__PURE__ */ new Error("No valid endianness marker found in TIFF header"));
							return;
						}
						if (dataView.getUint16(tiffOffset + 2, !bigEnd) !== 42) {
							reject(/* @__PURE__ */ new Error("Not valid TIFF data! (no 0x002A marker)"));
							return;
						}
						const firstIFDOffset = dataView.getUint32(tiffOffset + 4, !bigEnd);
						if (firstIFDOffset < 8) {
							reject(/* @__PURE__ */ new Error("Not valid TIFF data! (First offset less than 8)"));
							return;
						}
						const dirStart = tiffOffset + firstIFDOffset;
						const count = dataView.getUint16(dirStart, !bigEnd);
						const entriesStart = dirStart + 2;
						let numberOfImages = 0;
						for (let i = entriesStart; i < entriesStart + 12 * count; i += 12) if (dataView.getUint16(i, !bigEnd) === 45057) numberOfImages = dataView.getUint32(i + 8, !bigEnd);
						const MPImageListValPt = dirStart + 2 + count * 12 + 4;
						const images = [];
						for (let i = MPImageListValPt; i < MPImageListValPt + numberOfImages * 16; i += 16) {
							const image = {
								MPType: dataView.getUint32(i, !bigEnd),
								size: dataView.getUint32(i + 4, !bigEnd),
								dataOffset: dataView.getUint32(i + 8, !bigEnd),
								dependantImages: dataView.getUint32(i + 12, !bigEnd),
								start: -1,
								end: -1,
								isFII: false
							};
							if (!image.dataOffset) {
								image.start = 0;
								image.isFII = true;
							} else {
								image.start = tiffOffset + image.dataOffset;
								image.isFII = false;
							}
							image.end = image.start + image.size;
							images.push(image);
						}
						if (this.options.extractNonFII && images.length) {
							const bufferBlob = new Blob([dataView]);
							const imgs = [];
							for (const image of images) {
								if (image.isFII && !this.options.extractFII) continue;
								const imageBlob = bufferBlob.slice(image.start, image.end + 1, "image/jpeg");
								imgs.push(imageBlob);
							}
							resolve(imgs);
						}
					}
				}
				offset += 2 + dataView.getUint16(offset + 2);
			}
		});
	}
};
/**
* Extracts XMP Metadata and the gain map recovery image
* from a single JPEG file.
*
* @category Decoding Functions
* @group Decoding Functions
* @param jpegFile an `Uint8Array` containing and encoded JPEG file
* @returns an sdr `Uint8Array` compressed in JPEG, a gainMap `Uint8Array` compressed in JPEG and the XMP parsed XMP metadata
* @throws Error if XMP Metadata is not found
* @throws Error if Gain map image is not found
* @example
* import { FileLoader } from 'three'
* import { extractGainmapFromJPEG } from '@monogrid/gainmap-js'
*
* const jpegFile = await new FileLoader()
*  .setResponseType('arraybuffer')
*  .loadAsync('image.jpg')
*
* const { sdr, gainMap, metadata } = extractGainmapFromJPEG(jpegFile)
*/
var extractGainmapFromJPEG = async (jpegFile) => {
	const metadata = extractXMP(jpegFile);
	if (!metadata) throw new XMPMetadataNotFoundError("Gain map XMP metadata not found");
	const images = await new MPFExtractor({
		extractFII: true,
		extractNonFII: true
	}).extract(jpegFile);
	if (images.length !== 2) throw new GainMapNotFoundError("Gain map recovery image not found");
	return {
		sdr: new Uint8Array(await images[0].arrayBuffer()),
		gainMap: new Uint8Array(await images[1].arrayBuffer()),
		metadata
	};
};
/**
* private function, async get image from blob
*
* @param blob
* @returns
*/
var getHTMLImageFromBlob = (blob) => {
	return new Promise((resolve, reject) => {
		const img = document.createElement("img");
		img.onload = () => {
			resolve(img);
		};
		img.onerror = (e) => {
			reject(e);
		};
		img.src = URL.createObjectURL(blob);
	});
};
/**
* Shared base class for loaders that extracts common logic
*/
var LoaderBaseShared = class extends Loader {
	_renderer;
	_renderTargetOptions;
	_internalLoadingManager;
	_config;
	constructor(config, manager) {
		super(manager);
		this._config = config;
		if (config.renderer) this._renderer = config.renderer;
		this._internalLoadingManager = new LoadingManager();
	}
	setRenderer(renderer) {
		this._renderer = renderer;
		return this;
	}
	setRenderTargetOptions(options) {
		this._renderTargetOptions = options;
		return this;
	}
	prepareQuadRenderer() {
		if (!this._renderer) console.warn("WARNING: A Renderer was not passed to this Loader constructor or in setRenderer, the result of this Loader will need to be converted to a Data Texture with toDataTexture() before you can use it in your renderer.");
		const material = this._config.createMaterial({
			gainMapMax: [
				1,
				1,
				1
			],
			gainMapMin: [
				0,
				0,
				0
			],
			gamma: [
				1,
				1,
				1
			],
			offsetHdr: [
				1,
				1,
				1
			],
			offsetSdr: [
				1,
				1,
				1
			],
			hdrCapacityMax: 1,
			hdrCapacityMin: 0,
			maxDisplayBoost: 1,
			gainMap: new Texture(),
			sdr: new Texture()
		});
		return this._config.createQuadRenderer({
			width: 16,
			height: 16,
			type: HalfFloatType,
			colorSpace: LinearSRGBColorSpace,
			material,
			renderer: this._renderer,
			renderTargetOptions: this._renderTargetOptions
		});
	}
	async processImages(sdrBuffer, gainMapBuffer, imageOrientation) {
		const gainMapBlob = gainMapBuffer ? new Blob([gainMapBuffer], { type: "image/jpeg" }) : void 0;
		const sdrBlob = new Blob([sdrBuffer], { type: "image/jpeg" });
		let sdrImage;
		let gainMapImage;
		let needsFlip = false;
		if (typeof createImageBitmap === "undefined") {
			const res = await Promise.all([gainMapBlob ? getHTMLImageFromBlob(gainMapBlob) : Promise.resolve(void 0), getHTMLImageFromBlob(sdrBlob)]);
			gainMapImage = res[0];
			sdrImage = res[1];
			needsFlip = imageOrientation === "flipY";
		} else {
			const res = await Promise.all([gainMapBlob ? createImageBitmap(gainMapBlob, { imageOrientation: imageOrientation || "flipY" }) : Promise.resolve(void 0), createImageBitmap(sdrBlob, { imageOrientation: imageOrientation || "flipY" })]);
			gainMapImage = res[0];
			sdrImage = res[1];
		}
		return {
			sdrImage,
			gainMapImage,
			needsFlip
		};
	}
	createTextures(sdrImage, gainMapImage, needsFlip) {
		const gainMap = new Texture(gainMapImage || new ImageData(2, 2), 300, ClampToEdgeWrapping, ClampToEdgeWrapping, LinearFilter, LinearMipMapLinearFilter, RGBAFormat, UnsignedByteType, 1, LinearSRGBColorSpace);
		gainMap.flipY = needsFlip;
		gainMap.needsUpdate = true;
		const sdr = new Texture(sdrImage, 300, ClampToEdgeWrapping, ClampToEdgeWrapping, LinearFilter, LinearMipMapLinearFilter, RGBAFormat, UnsignedByteType, 1, SRGBColorSpace);
		sdr.flipY = needsFlip;
		sdr.needsUpdate = true;
		return {
			gainMap,
			sdr
		};
	}
	updateQuadRenderer(quadRenderer, sdrImage, gainMap, sdr, metadata) {
		quadRenderer.width = sdrImage.width;
		quadRenderer.height = sdrImage.height;
		quadRenderer.material.gainMap = gainMap;
		quadRenderer.material.sdr = sdr;
		quadRenderer.material.gainMapMin = metadata.gainMapMin;
		quadRenderer.material.gainMapMax = metadata.gainMapMax;
		quadRenderer.material.offsetHdr = metadata.offsetHdr;
		quadRenderer.material.offsetSdr = metadata.offsetSdr;
		quadRenderer.material.gamma = metadata.gamma;
		quadRenderer.material.hdrCapacityMin = metadata.hdrCapacityMin;
		quadRenderer.material.hdrCapacityMax = metadata.hdrCapacityMax;
		quadRenderer.material.maxDisplayBoost = Math.pow(2, metadata.hdrCapacityMax);
		quadRenderer.material.needsUpdate = true;
	}
};
//#endregion
//#region node_modules/@monogrid/gainmap-js/dist/decode.js
/**
* @monogrid/gainmap-js v3.4.0
* With ❤️, by MONOGRID <gainmap@monogrid.com>
*/
var vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
var fragmentShader = `
// min half float value
#define HALF_FLOAT_MIN vec3( -65504, -65504, -65504 )
// max half float value
#define HALF_FLOAT_MAX vec3( 65504, 65504, 65504 )

uniform sampler2D sdr;
uniform sampler2D gainMap;
uniform vec3 gamma;
uniform vec3 offsetHdr;
uniform vec3 offsetSdr;
uniform vec3 gainMapMin;
uniform vec3 gainMapMax;
uniform float weightFactor;

varying vec2 vUv;

void main() {
  vec3 rgb = texture2D( sdr, vUv ).rgb;
  vec3 recovery = texture2D( gainMap, vUv ).rgb;
  vec3 logRecovery = pow( recovery, gamma );
  vec3 logBoost = gainMapMin * ( 1.0 - logRecovery ) + gainMapMax * logRecovery;
  vec3 hdrColor = (rgb + offsetSdr) * exp2( logBoost * weightFactor ) - offsetHdr;
  vec3 clampedHdrColor = max( HALF_FLOAT_MIN, min( HALF_FLOAT_MAX, hdrColor ));
  gl_FragColor = vec4( clampedHdrColor , 1.0 );
}
`;
/**
* A Material which is able to decode the Gainmap into a full HDR Representation
*
* @category Materials
* @group Materials
*/
var GainMapDecoderMaterial = class extends ShaderMaterial {
	_maxDisplayBoost;
	_hdrCapacityMin;
	_hdrCapacityMax;
	/**
	*
	* @param params
	*/
	constructor({ gamma, offsetHdr, offsetSdr, gainMapMin, gainMapMax, maxDisplayBoost, hdrCapacityMin, hdrCapacityMax, sdr, gainMap }) {
		super({
			name: "GainMapDecoderMaterial",
			vertexShader,
			fragmentShader,
			uniforms: {
				sdr: { value: sdr },
				gainMap: { value: gainMap },
				gamma: { value: new Vector3(1 / gamma[0], 1 / gamma[1], 1 / gamma[2]) },
				offsetHdr: { value: new Vector3().fromArray(offsetHdr) },
				offsetSdr: { value: new Vector3().fromArray(offsetSdr) },
				gainMapMin: { value: new Vector3().fromArray(gainMapMin) },
				gainMapMax: { value: new Vector3().fromArray(gainMapMax) },
				weightFactor: { value: (Math.log2(maxDisplayBoost) - hdrCapacityMin) / (hdrCapacityMax - hdrCapacityMin) }
			},
			blending: 0,
			depthTest: false,
			depthWrite: false
		});
		this._maxDisplayBoost = maxDisplayBoost;
		this._hdrCapacityMin = hdrCapacityMin;
		this._hdrCapacityMax = hdrCapacityMax;
		this.needsUpdate = true;
		this.uniformsNeedUpdate = true;
	}
	get sdr() {
		return this.uniforms.sdr.value;
	}
	set sdr(value) {
		this.uniforms.sdr.value = value;
	}
	get gainMap() {
		return this.uniforms.gainMap.value;
	}
	set gainMap(value) {
		this.uniforms.gainMap.value = value;
	}
	/**
	* @see {@link GainMapMetadata.offsetHdr}
	*/
	get offsetHdr() {
		return this.uniforms.offsetHdr.value.toArray();
	}
	set offsetHdr(value) {
		this.uniforms.offsetHdr.value.fromArray(value);
	}
	/**
	* @see {@link GainMapMetadata.offsetSdr}
	*/
	get offsetSdr() {
		return this.uniforms.offsetSdr.value.toArray();
	}
	set offsetSdr(value) {
		this.uniforms.offsetSdr.value.fromArray(value);
	}
	/**
	* @see {@link GainMapMetadata.gainMapMin}
	*/
	get gainMapMin() {
		return this.uniforms.gainMapMin.value.toArray();
	}
	set gainMapMin(value) {
		this.uniforms.gainMapMin.value.fromArray(value);
	}
	/**
	* @see {@link GainMapMetadata.gainMapMax}
	*/
	get gainMapMax() {
		return this.uniforms.gainMapMax.value.toArray();
	}
	set gainMapMax(value) {
		this.uniforms.gainMapMax.value.fromArray(value);
	}
	/**
	* @see {@link GainMapMetadata.gamma}
	*/
	get gamma() {
		const g = this.uniforms.gamma.value;
		return [
			1 / g.x,
			1 / g.y,
			1 / g.z
		];
	}
	set gamma(value) {
		const g = this.uniforms.gamma.value;
		g.x = 1 / value[0];
		g.y = 1 / value[1];
		g.z = 1 / value[2];
	}
	/**
	* @see {@link GainMapMetadata.hdrCapacityMin}
	* @remarks Logarithmic space
	*/
	get hdrCapacityMin() {
		return this._hdrCapacityMin;
	}
	set hdrCapacityMin(value) {
		this._hdrCapacityMin = value;
		this.calculateWeight();
	}
	/**
	* @see {@link GainMapMetadata.hdrCapacityMin}
	* @remarks Logarithmic space
	*/
	get hdrCapacityMax() {
		return this._hdrCapacityMax;
	}
	set hdrCapacityMax(value) {
		this._hdrCapacityMax = value;
		this.calculateWeight();
	}
	/**
	* @see {@link GainmapDecodingParameters.maxDisplayBoost}
	* @remarks Non Logarithmic space
	*/
	get maxDisplayBoost() {
		return this._maxDisplayBoost;
	}
	set maxDisplayBoost(value) {
		this._maxDisplayBoost = Math.max(1, Math.min(65504, value));
		this.calculateWeight();
	}
	calculateWeight() {
		const val = (Math.log2(this._maxDisplayBoost) - this._hdrCapacityMin) / (this._hdrCapacityMax - this._hdrCapacityMin);
		this.uniforms.weightFactor.value = Math.max(0, Math.min(1, val));
	}
};
createDecodeFunction({
	renderer: WebGLRenderer,
	createMaterial: (params) => new GainMapDecoderMaterial(params),
	createQuadRenderer: (params) => new QuadRenderer(params)
});
/**
* Base class for WebGL loaders
* @template TUrl - The type of URL used to load resources
*/
var LoaderBaseWebGL = class extends LoaderBaseShared {
	constructor(renderer, manager) {
		super({
			renderer,
			createMaterial: (params) => new GainMapDecoderMaterial(params),
			createQuadRenderer: (params) => new QuadRenderer(params)
		}, manager);
	}
	/**
	* @private
	* @param quadRenderer
	* @param metadata
	* @param sdrBuffer
	* @param gainMapBuffer
	*/
	async render(quadRenderer, metadata, sdrBuffer, gainMapBuffer) {
		const { sdrImage, gainMapImage, needsFlip } = await this.processImages(sdrBuffer, gainMapBuffer, "flipY");
		const { gainMap, sdr } = this.createTextures(sdrImage, gainMapImage, needsFlip);
		this.updateQuadRenderer(quadRenderer, sdrImage, gainMap, sdr, metadata);
		quadRenderer.render();
	}
};
/**
* A Three.js Loader for the gain map format.
*
* @category Loaders
* @group Loaders
*
* @example
* import { GainMapLoader } from '@monogrid/gainmap-js'
* import {
*   EquirectangularReflectionMapping,
*   Mesh,
*   MeshBasicMaterial,
*   PerspectiveCamera,
*   PlaneGeometry,
*   Scene,
*   WebGLRenderer
* } from 'three'
*
* const renderer = new WebGLRenderer()
*
* const loader = new GainMapLoader(renderer)
*   .setRenderTargetOptions({ mapping: EquirectangularReflectionMapping })
*
* const result = await loader.loadAsync(['sdr.jpeg', 'gainmap.jpeg', 'metadata.json'])
* // `result` can be used to populate a Texture
*
* const scene = new Scene()
* const mesh = new Mesh(
*   new PlaneGeometry(),
*   new MeshBasicMaterial({ map: result.renderTarget.texture })
* )
* scene.add(mesh)
* renderer.render(scene, new PerspectiveCamera())
*
* // Starting from three.js r159
* // `result.renderTarget.texture` can
* // also be used as Equirectangular scene background
* //
* // it was previously needed to convert it
* // to a DataTexture with `result.toDataTexture()`
* scene.background = result.renderTarget.texture
*
* // result must be manually disposed
* // when you are done using it
* result.dispose()
*
*/
var GainMapLoader = class extends LoaderBaseWebGL {
	/**
	* Loads a gainmap using separate data
	* * sdr image
	* * gain map image
	* * metadata json
	*
	* useful for webp gain maps
	*
	* @param urls An array in the form of [sdr.jpg, gainmap.jpg, metadata.json]
	* @param onLoad Load complete callback, will receive the result
	* @param onProgress Progress callback, will receive a `ProgressEvent`
	* @param onError Error callback
	* @returns
	*/
	load([sdrUrl, gainMapUrl, metadataUrl], onLoad, onProgress, onError) {
		const quadRenderer = this.prepareQuadRenderer();
		let sdr;
		let gainMap;
		let metadata;
		const loadCheck = async () => {
			if (sdr && gainMap && metadata) {
				try {
					await this.render(quadRenderer, metadata, sdr, gainMap);
				} catch (error) {
					this.manager.itemError(sdrUrl);
					this.manager.itemError(gainMapUrl);
					this.manager.itemError(metadataUrl);
					if (typeof onError === "function") onError(error);
					quadRenderer.disposeOnDemandRenderer();
					return;
				}
				if (typeof onLoad === "function") onLoad(quadRenderer);
				this.manager.itemEnd(sdrUrl);
				this.manager.itemEnd(gainMapUrl);
				this.manager.itemEnd(metadataUrl);
				quadRenderer.disposeOnDemandRenderer();
			}
		};
		let sdrLengthComputable = true;
		let sdrTotal = 0;
		let sdrLoaded = 0;
		let gainMapLengthComputable = true;
		let gainMapTotal = 0;
		let gainMapLoaded = 0;
		let metadataLengthComputable = true;
		let metadataTotal = 0;
		let metadataLoaded = 0;
		const progressHandler = () => {
			if (typeof onProgress === "function") {
				const total = sdrTotal + gainMapTotal + metadataTotal;
				const loaded = sdrLoaded + gainMapLoaded + metadataLoaded;
				onProgress(new ProgressEvent("progress", {
					lengthComputable: sdrLengthComputable && gainMapLengthComputable && metadataLengthComputable,
					loaded,
					total
				}));
			}
		};
		this.manager.itemStart(sdrUrl);
		this.manager.itemStart(gainMapUrl);
		this.manager.itemStart(metadataUrl);
		const sdrLoader = new FileLoader(this._internalLoadingManager);
		sdrLoader.setResponseType("arraybuffer");
		sdrLoader.setRequestHeader(this.requestHeader);
		sdrLoader.setPath(this.path);
		sdrLoader.setWithCredentials(this.withCredentials);
		sdrLoader.load(sdrUrl, async (buffer) => {
			/* istanbul ignore if
			this condition exists only because of three.js types + strict mode
			*/
			if (typeof buffer === "string") throw new Error("Invalid sdr buffer");
			sdr = buffer;
			await loadCheck();
		}, (e) => {
			sdrLengthComputable = e.lengthComputable;
			sdrLoaded = e.loaded;
			sdrTotal = e.total;
			progressHandler();
		}, (error) => {
			this.manager.itemError(sdrUrl);
			if (typeof onError === "function") onError(error);
		});
		const gainMapLoader = new FileLoader(this._internalLoadingManager);
		gainMapLoader.setResponseType("arraybuffer");
		gainMapLoader.setRequestHeader(this.requestHeader);
		gainMapLoader.setPath(this.path);
		gainMapLoader.setWithCredentials(this.withCredentials);
		gainMapLoader.load(gainMapUrl, async (buffer) => {
			/* istanbul ignore if
			this condition exists only because of three.js types + strict mode
			*/
			if (typeof buffer === "string") throw new Error("Invalid gainmap buffer");
			gainMap = buffer;
			await loadCheck();
		}, (e) => {
			gainMapLengthComputable = e.lengthComputable;
			gainMapLoaded = e.loaded;
			gainMapTotal = e.total;
			progressHandler();
		}, (error) => {
			this.manager.itemError(gainMapUrl);
			if (typeof onError === "function") onError(error);
		});
		const metadataLoader = new FileLoader(this._internalLoadingManager);
		metadataLoader.setRequestHeader(this.requestHeader);
		metadataLoader.setPath(this.path);
		metadataLoader.setWithCredentials(this.withCredentials);
		metadataLoader.load(metadataUrl, async (json) => {
			/* istanbul ignore if
			this condition exists only because of three.js types + strict mode
			*/
			if (typeof json !== "string") throw new Error("Invalid metadata string");
			metadata = JSON.parse(json);
			await loadCheck();
		}, (e) => {
			metadataLengthComputable = e.lengthComputable;
			metadataLoaded = e.loaded;
			metadataTotal = e.total;
			progressHandler();
		}, (error) => {
			this.manager.itemError(metadataUrl);
			if (typeof onError === "function") onError(error);
		});
		return quadRenderer;
	}
};
/**
* A Three.js Loader for a JPEG with embedded gainmap metadata.
*
* @category Loaders
* @group Loaders
*
* @example
* import { HDRJPGLoader } from '@monogrid/gainmap-js'
* import {
*   EquirectangularReflectionMapping,
*   Mesh,
*   MeshBasicMaterial,
*   PerspectiveCamera,
*   PlaneGeometry,
*   Scene,
*   WebGLRenderer
* } from 'three'
*
* const renderer = new WebGLRenderer()
*
* const loader = new HDRJPGLoader(renderer)
*   .setRenderTargetOptions({ mapping: EquirectangularReflectionMapping })
*
* const result = await loader.loadAsync('gainmap.jpeg')
* // `result` can be used to populate a Texture
*
* const scene = new Scene()
* const mesh = new Mesh(
*   new PlaneGeometry(),
*   new MeshBasicMaterial({ map: result.renderTarget.texture })
* )
* scene.add(mesh)
* renderer.render(scene, new PerspectiveCamera())
*
* // Starting from three.js r159
* // `result.renderTarget.texture` can
* // also be used as Equirectangular scene background
* //
* // it was previously needed to convert it
* // to a DataTexture with `result.toDataTexture()`
* scene.background = result.renderTarget.texture
*
* // result must be manually disposed
* // when you are done using it
* result.dispose()
*
*/
var HDRJPGLoader = class extends LoaderBaseWebGL {
	/**
	* Loads a JPEG containing gain map metadata
	* Renders a normal SDR image if gainmap data is not found
	*
	* @param url Path to a JPEG file containing embedded gain map metadata
	* @param onLoad Load complete callback, will receive the result
	* @param onProgress Progress callback, will receive a `ProgressEvent`
	* @param onError Error callback
	* @returns
	*/
	load(url, onLoad, onProgress, onError) {
		const quadRenderer = this.prepareQuadRenderer();
		const loader = new FileLoader(this._internalLoadingManager);
		loader.setResponseType("arraybuffer");
		loader.setRequestHeader(this.requestHeader);
		loader.setPath(this.path);
		loader.setWithCredentials(this.withCredentials);
		this.manager.itemStart(url);
		loader.load(url, async (jpeg) => {
			/* istanbul ignore if
			this condition exists only because of three.js types + strict mode
			*/
			if (typeof jpeg === "string") throw new Error("Invalid buffer, received [string], was expecting [ArrayBuffer]");
			const jpegBuffer = new Uint8Array(jpeg);
			let sdrJPEG;
			let gainMapJPEG;
			let metadata;
			try {
				const extractionResult = await extractGainmapFromJPEG(jpegBuffer);
				sdrJPEG = extractionResult.sdr;
				gainMapJPEG = extractionResult.gainMap;
				metadata = extractionResult.metadata;
			} catch (e) {
				if (e instanceof XMPMetadataNotFoundError || e instanceof GainMapNotFoundError) {
					console.warn(`Failure to reconstruct an HDR image from ${url}: Gain map metadata not found in the file, HDRJPGLoader will render the SDR jpeg`);
					metadata = {
						gainMapMin: [
							0,
							0,
							0
						],
						gainMapMax: [
							1,
							1,
							1
						],
						gamma: [
							1,
							1,
							1
						],
						hdrCapacityMin: 0,
						hdrCapacityMax: 1,
						offsetHdr: [
							0,
							0,
							0
						],
						offsetSdr: [
							0,
							0,
							0
						]
					};
					sdrJPEG = jpegBuffer;
				} else throw e;
			}
			try {
				await this.render(quadRenderer, metadata, sdrJPEG.buffer, gainMapJPEG?.buffer);
			} catch (error) {
				this.manager.itemError(url);
				if (typeof onError === "function") onError(error);
				quadRenderer.disposeOnDemandRenderer();
				return;
			}
			if (typeof onLoad === "function") onLoad(quadRenderer);
			this.manager.itemEnd(url);
			quadRenderer.disposeOnDemandRenderer();
		}, onProgress, (error) => {
			this.manager.itemError(url);
			if (typeof onError === "function") onError(error);
		});
		return quadRenderer;
	}
};
//#endregion
//#region node_modules/@react-three/drei/helpers/environment-assets.js
var presetsObj = {
	apartment: "lebombo_1k.hdr",
	city: "potsdamer_platz_1k.hdr",
	dawn: "kiara_1_dawn_1k.hdr",
	forest: "forest_slope_1k.hdr",
	lobby: "st_fagans_interior_1k.hdr",
	night: "dikhololo_night_1k.hdr",
	park: "rooitou_park_1k.hdr",
	studio: "studio_small_03_1k.hdr",
	sunset: "venice_sunset_1k.hdr",
	warehouse: "empty_warehouse_01_1k.hdr"
};
//#endregion
//#region node_modules/@react-three/drei/core/useEnvironment.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var CUBEMAP_ROOT = "https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/";
var isArray = (arr) => Array.isArray(arr);
var defaultFiles = [
	"/px.png",
	"/nx.png",
	"/py.png",
	"/ny.png",
	"/pz.png",
	"/nz.png"
];
function useEnvironment({ files = defaultFiles, path = "", preset = void 0, colorSpace = void 0, extensions } = {}) {
	if (preset) {
		validatePreset(preset);
		files = presetsObj[preset];
		path = CUBEMAP_ROOT;
	}
	const multiFile = isArray(files);
	const { extension, isCubemap } = getExtension(files);
	const loader = getLoader(extension);
	if (!loader) throw new Error("useEnvironment: Unrecognized file extension: " + files);
	const gl = useThree((state) => state.gl);
	(0, import_react.useLayoutEffect)(() => {
		if (extension !== "webp" && extension !== "jpg" && extension !== "jpeg") return;
		function clearGainmapTexture() {
			useLoader.clear(loader, multiFile ? [files] : files);
		}
		gl.domElement.addEventListener("webglcontextlost", clearGainmapTexture, { once: true });
	}, [files, gl.domElement]);
	const loaderResult = useLoader(loader, multiFile ? [files] : files, (loader) => {
		if (extension === "webp" || extension === "jpg" || extension === "jpeg") loader.setRenderer(gl);
		loader.setPath == null || loader.setPath(path);
		if (extensions) extensions(loader);
	});
	let texture = multiFile ? loaderResult[0] : loaderResult;
	if (extension === "jpg" || extension === "jpeg" || extension === "webp") {
		var _renderTarget;
		texture = (_renderTarget = texture.renderTarget) == null ? void 0 : _renderTarget.texture;
	}
	texture.mapping = isCubemap ? 301 : 303;
	texture.colorSpace = colorSpace !== null && colorSpace !== void 0 ? colorSpace : isCubemap ? "srgb" : "srgb-linear";
	return texture;
}
var preloadDefaultOptions = {
	files: defaultFiles,
	path: "",
	preset: void 0,
	extensions: void 0
};
useEnvironment.preload = (preloadOptions) => {
	const options = {
		...preloadDefaultOptions,
		...preloadOptions
	};
	let { files, path = "" } = options;
	const { preset, extensions } = options;
	if (preset) {
		validatePreset(preset);
		files = presetsObj[preset];
		path = CUBEMAP_ROOT;
	}
	const { extension } = getExtension(files);
	if (extension === "webp" || extension === "jpg" || extension === "jpeg") throw new Error("useEnvironment: Preloading gainmaps is not supported");
	const loader = getLoader(extension);
	if (!loader) throw new Error("useEnvironment: Unrecognized file extension: " + files);
	useLoader.preload(loader, isArray(files) ? [files] : files, (loader) => {
		loader.setPath == null || loader.setPath(path);
		if (extensions) extensions(loader);
	});
};
var clearDefaultOptins = {
	files: defaultFiles,
	preset: void 0
};
useEnvironment.clear = (clearOptions) => {
	const options = {
		...clearDefaultOptins,
		...clearOptions
	};
	let { files } = options;
	const { preset } = options;
	if (preset) {
		validatePreset(preset);
		files = presetsObj[preset];
	}
	const { extension } = getExtension(files);
	const loader = getLoader(extension);
	if (!loader) throw new Error("useEnvironment: Unrecognized file extension: " + files);
	useLoader.clear(loader, isArray(files) ? [files] : files);
};
function validatePreset(preset) {
	if (!(preset in presetsObj)) throw new Error("Preset must be one of: " + Object.keys(presetsObj).join(", "));
}
function getExtension(files) {
	var _firstEntry$split$pop;
	const isCubemap = isArray(files) && files.length === 6;
	const isGainmap = isArray(files) && files.length === 3 && files.some((file) => file.endsWith("json"));
	const firstEntry = isArray(files) ? files[0] : files;
	return {
		extension: isCubemap ? "cube" : isGainmap ? "webp" : firstEntry.startsWith("data:application/exr") ? "exr" : firstEntry.startsWith("data:application/hdr") ? "hdr" : firstEntry.startsWith("data:image/jpeg") ? "jpg" : (_firstEntry$split$pop = firstEntry.split(".").pop()) == null || (_firstEntry$split$pop = _firstEntry$split$pop.split("?")) == null || (_firstEntry$split$pop = _firstEntry$split$pop.shift()) == null ? void 0 : _firstEntry$split$pop.toLowerCase(),
		isCubemap,
		isGainmap
	};
}
function getLoader(extension) {
	return extension === "cube" ? CubeTextureLoader : extension === "hdr" ? RGBELoader : extension === "exr" ? EXRLoader : extension === "jpg" || extension === "jpeg" ? HDRJPGLoader : extension === "webp" ? GainMapLoader : null;
}
//#endregion
//#region node_modules/@react-three/drei/core/Environment.js
var isRef = (obj) => obj.current && obj.current.isScene;
var resolveScene = (scene) => isRef(scene) ? scene.current : scene;
function setEnvProps(background, scene, defaultScene, texture, sceneProps = {}) {
	var _target$backgroundRot, _target$backgroundRot2, _target$environmentRo, _target$environmentRo2;
	sceneProps = {
		backgroundBlurriness: 0,
		backgroundIntensity: 1,
		backgroundRotation: [
			0,
			0,
			0
		],
		environmentIntensity: 1,
		environmentRotation: [
			0,
			0,
			0
		],
		...sceneProps
	};
	const target = resolveScene(scene || defaultScene);
	const oldbg = target.background;
	const oldenv = target.environment;
	const oldSceneProps = {
		backgroundBlurriness: target.backgroundBlurriness,
		backgroundIntensity: target.backgroundIntensity,
		backgroundRotation: (_target$backgroundRot = (_target$backgroundRot2 = target.backgroundRotation) == null || _target$backgroundRot2.clone == null ? void 0 : _target$backgroundRot2.clone()) !== null && _target$backgroundRot !== void 0 ? _target$backgroundRot : [
			0,
			0,
			0
		],
		environmentIntensity: target.environmentIntensity,
		environmentRotation: (_target$environmentRo = (_target$environmentRo2 = target.environmentRotation) == null || _target$environmentRo2.clone == null ? void 0 : _target$environmentRo2.clone()) !== null && _target$environmentRo !== void 0 ? _target$environmentRo : [
			0,
			0,
			0
		]
	};
	if (background !== "only") target.environment = texture;
	if (background) target.background = texture;
	applyProps(target, sceneProps);
	return () => {
		if (background !== "only") target.environment = oldenv;
		if (background) target.background = oldbg;
		applyProps(target, oldSceneProps);
	};
}
function EnvironmentMap({ scene, background = false, map, ...config }) {
	const defaultScene = useThree((state) => state.scene);
	import_react.useLayoutEffect(() => {
		if (map) return setEnvProps(background, scene, defaultScene, map, config);
	});
	return null;
}
function EnvironmentCube({ background = false, scene, blur, backgroundBlurriness, backgroundIntensity, backgroundRotation, environmentIntensity, environmentRotation, ...rest }) {
	const texture = useEnvironment(rest);
	const defaultScene = useThree((state) => state.scene);
	import_react.useLayoutEffect(() => {
		return setEnvProps(background, scene, defaultScene, texture, {
			backgroundBlurriness: blur !== null && blur !== void 0 ? blur : backgroundBlurriness,
			backgroundIntensity,
			backgroundRotation,
			environmentIntensity,
			environmentRotation
		});
	});
	import_react.useEffect(() => {
		return () => {
			texture.dispose();
		};
	}, [texture]);
	return null;
}
function EnvironmentPortal({ children, near = .1, far = 1e3, resolution = 256, frames = 1, map, background = false, blur, backgroundBlurriness, backgroundIntensity, backgroundRotation, environmentIntensity, environmentRotation, scene, files, path, preset = void 0, extensions }) {
	const gl = useThree((state) => state.gl);
	const defaultScene = useThree((state) => state.scene);
	const camera = import_react.useRef(null);
	const [virtualScene] = import_react.useState(() => new Scene());
	const fbo = import_react.useMemo(() => {
		const fbo = new WebGLCubeRenderTarget(resolution);
		fbo.texture.type = HalfFloatType;
		return fbo;
	}, [resolution]);
	import_react.useEffect(() => {
		return () => {
			fbo.dispose();
		};
	}, [fbo]);
	import_react.useLayoutEffect(() => {
		if (frames === 1) {
			const autoClear = gl.autoClear;
			gl.autoClear = true;
			camera.current.update(gl, virtualScene);
			gl.autoClear = autoClear;
		}
		return setEnvProps(background, scene, defaultScene, fbo.texture, {
			backgroundBlurriness: blur !== null && blur !== void 0 ? blur : backgroundBlurriness,
			backgroundIntensity,
			backgroundRotation,
			environmentIntensity,
			environmentRotation
		});
	}, [
		children,
		virtualScene,
		fbo.texture,
		scene,
		defaultScene,
		background,
		frames,
		gl
	]);
	let count = 1;
	useFrame(() => {
		if (frames === Infinity || count < frames) {
			const autoClear = gl.autoClear;
			gl.autoClear = true;
			camera.current.update(gl, virtualScene);
			gl.autoClear = autoClear;
			count++;
		}
	});
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, createPortal(/* @__PURE__ */ import_react.createElement(import_react.Fragment, null, children, /* @__PURE__ */ import_react.createElement("cubeCamera", {
		ref: camera,
		args: [
			near,
			far,
			fbo
		]
	}), files || preset ? /* @__PURE__ */ import_react.createElement(EnvironmentCube, {
		background: true,
		files,
		preset,
		path,
		extensions
	}) : map ? /* @__PURE__ */ import_react.createElement(EnvironmentMap, {
		background: true,
		map,
		extensions
	}) : null), virtualScene));
}
function EnvironmentGround(props) {
	var _props$ground, _props$ground2, _scale, _props$ground3;
	const textureDefault = useEnvironment(props);
	const texture = props.map || textureDefault;
	import_react.useMemo(() => extend({ GroundProjectedEnvImpl: GroundProjectedEnv }), []);
	import_react.useEffect(() => {
		return () => {
			textureDefault.dispose();
		};
	}, [textureDefault]);
	const args = import_react.useMemo(() => [texture], [texture]);
	const height = (_props$ground = props.ground) == null ? void 0 : _props$ground.height;
	const radius = (_props$ground2 = props.ground) == null ? void 0 : _props$ground2.radius;
	const scale = (_scale = (_props$ground3 = props.ground) == null ? void 0 : _props$ground3.scale) !== null && _scale !== void 0 ? _scale : 1e3;
	return /* @__PURE__ */ import_react.createElement(import_react.Fragment, null, /* @__PURE__ */ import_react.createElement(EnvironmentMap, _extends({}, props, { map: texture })), /* @__PURE__ */ import_react.createElement("groundProjectedEnvImpl", {
		args,
		scale,
		height,
		radius
	}));
}
function Environment(props) {
	return props.ground ? /* @__PURE__ */ import_react.createElement(EnvironmentGround, props) : props.map ? /* @__PURE__ */ import_react.createElement(EnvironmentMap, props) : props.children ? /* @__PURE__ */ import_react.createElement(EnvironmentPortal, props) : /* @__PURE__ */ import_react.createElement(EnvironmentCube, props);
}
//#endregion
export { Environment as t };
