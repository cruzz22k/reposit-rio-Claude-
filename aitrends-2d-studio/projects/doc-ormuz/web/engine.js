// engine.js — mundo 3D do documentário: mapa real escuro, câmera única, e um quadro feito de várias amostras
// de tempo (borrão de movimento) e de lente (profundidade de campo), somadas — nada de filtro de borrão.
import * as THREE from 'three';
export { THREE };
THREE.ColorManagement.enabled = false;

const Q = new URLSearchParams(location.search);
export const SCALE = +(Q.get('scale') || 1);
export const W = Math.round(1920 * SCALE), H = Math.round(1080 * SCALE);
export const FPS = 30, SHUTTER = 0.5 / FPS;                 // obturador de 180°
export const BAR = Math.round(((1080 - 1920 / 2.39) / 2) * SCALE);   // faixa de cinema 2,39:1
export const FOV = 30;

// ---------- utilidades ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
export const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
export const easeInOut = k => { k = clamp(k); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
export const win = (t, a, b, fi = 0.3, fo = 0.3) => Math.min(smooth(a, a + fi, t), 1 - smooth(b - fo, b, t));  // entra e sai suave
export function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

// interpolação cúbica monótona (não passa do ponto; as chaves seguidas são sempre diferentes, então a câmera não para)
export function pchip(ts, ys) {
  const n = ts.length, h = [], d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) { h[i] = ts[i + 1] - ts[i]; d[i] = (ys[i + 1] - ys[i]) / h[i]; }
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else { const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]); }
  }
  return t => {
    if (t <= ts[0]) return ys[0] + m[0] * (t - ts[0]);
    if (t >= ts[n - 1]) return ys[n - 1] + m[n - 1] * (t - ts[n - 1]);
    let i = 0; while (t > ts[i + 1]) i++;
    const s = (t - ts[i]) / h[i], s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * ys[i] + (s3 - 2 * s2 + s) * h[i] * m[i] + (-2 * s3 + 3 * s2) * ys[i + 1] + (s3 - s2) * h[i] * m[i + 1];
  };
}

// ---------- fontes ----------
export async function loadFonts() {
  const F = [
    ['Maquina', '/node_modules/@fontsource/courier-prime/files/courier-prime-latin-700-normal.woff2', '700'],
    ['MaquinaR', '/node_modules/@fontsource/courier-prime/files/courier-prime-latin-400-normal.woff2', '400'],
    ['Serifa', '/node_modules/@fontsource/playfair-display/files/playfair-display-latin-900-normal.woff2', '900'],
  ];
  for (const [fam, url, wt] of F) { const f = new FontFace(fam, `url(${url})`, { weight: wt }); await f.load(); document.fonts.add(f); }
}

// ---------- renderizador e passes ----------
export const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
export const R = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, alpha: false, powerPreference: 'high-performance' });
R.setPixelRatio(1); R.setSize(W, H, false); R.autoClear = false;
const RT = (w, h) => new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: true, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
const sampleRT = RT(W, H), accRT = RT(W, H);
const bW = Math.round(W / 4), bH = Math.round(H / 4);
const b1a = RT(bW, bH), b1b = RT(bW, bH), b2a = RT(bW >> 1, bH >> 1), b2b = RT(bW >> 1, bH >> 1);
const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), quadScene = new THREE.Scene();
const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quadScene.add(quad);
const VQ = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
const accMat = new THREE.ShaderMaterial({ vertexShader: VQ, fragmentShader: 'uniform sampler2D t; uniform float w; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(t, vUv).rgb * w, 1.); }', uniforms: { t: { value: null }, w: { value: 1 } }, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation, depthTest: false, depthWrite: false });
const brightMat = new THREE.ShaderMaterial({ vertexShader: VQ, fragmentShader: 'uniform sampler2D t; uniform float th; varying vec2 vUv; void main(){ vec3 c = texture2D(t, vUv).rgb; float l = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(c * smoothstep(th, th + 0.35, l), 1.); }', uniforms: { t: { value: null }, th: { value: 0.62 } }, depthTest: false });
const blurMat = new THREE.ShaderMaterial({ vertexShader: VQ, fragmentShader: `uniform sampler2D t; uniform vec2 dir; varying vec2 vUv;
  void main(){ vec3 c = texture2D(t, vUv).rgb * 0.1964825501511404;
    c += (texture2D(t, vUv + dir * 1.411764705882353).rgb + texture2D(t, vUv - dir * 1.411764705882353).rgb) * 0.2969069646728344;
    c += (texture2D(t, vUv + dir * 3.2941176470588234).rgb + texture2D(t, vUv - dir * 3.2941176470588234).rgb) * 0.09447039785044732;
    c += (texture2D(t, vUv + dir * 5.176470588235294).rgb + texture2D(t, vUv - dir * 5.176470588235294).rgb) * 0.010381362401148057;
    gl_FragColor = vec4(c, 1.); }`, uniforms: { t: { value: null }, dir: { value: new THREE.Vector2() } }, depthTest: false });
export const hudCanvas = document.createElement('canvas'); hudCanvas.width = W; hudCanvas.height = H;
export const hud = hudCanvas.getContext('2d');
const hudTex = new THREE.CanvasTexture(hudCanvas); hudTex.minFilter = THREE.LinearFilter; hudTex.generateMipmaps = false;
const finalMat = new THREE.ShaderMaterial({ vertexShader: VQ, fragmentShader: `
  uniform sampler2D tAcc, tB1, tB2, tHud; uniform vec2 res; uniform float time, flash, grain, bar, expo, bloom;
  varying vec2 vUv;
  float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
  void main(){
    vec3 c = texture2D(tAcc, vUv).rgb;
    vec3 b = texture2D(tB1, vUv).rgb * 0.7 + texture2D(tB2, vUv).rgb * 0.9;
    c = (c + b * bloom) * expo * (1. + flash);
    vec2 q = (vUv - 0.5) * vec2(res.x / res.y, 1.);
    float v = smoothstep(1.02, 0.18, length(q * vec2(0.82, 1.35)));
    c *= mix(0.05, 1.0, v);                                   // centro iluminado, bordas quase pretas
    c = c / (1. + 0.22 * c) * 1.12;                             // ombro suave nos altos
    vec4 h = texture2D(tHud, vUv); c = mix(c, h.rgb, h.a);
    float g = hash(vUv * res + vec2(time * 61.7, time * 37.3)) + hash(vUv * res * 0.5 + time * 13.1) - 1.0;
    c += g * grain * (0.6 + 0.4 * (1. - dot(c, vec3(0.33))));   // grão leve, um pouco mais nas sombras
    float py = vUv.y * res.y; if (py < bar || py > res.y - bar) c = vec3(0.);
    gl_FragColor = vec4(clamp(c, 0., 1.), 1.); }`,
  uniforms: { tAcc: { value: accRT.texture }, tB1: { value: b1a.texture }, tB2: { value: b2a.texture }, tHud: { value: hudTex }, res: { value: new THREE.Vector2(W, H) }, time: { value: 0 }, flash: { value: 0 }, grain: { value: 0.045 }, bar: { value: BAR }, expo: { value: 1 }, bloom: { value: 0.55 } }, depthTest: false });
function pass(mat, target) { quad.material = mat; R.setRenderTarget(target); R.render(quadScene, quadCam); }

// ---------- cena ----------
export const scene = new THREE.Scene(); scene.background = new THREE.Color('#000000');
export const camera = new THREE.PerspectiveCamera(FOV, W / H, 0.01, 1e6);
export const U = {   // uniformes compartilhados do mapa
  uPoolC: { value: new THREE.Vector2() }, uPoolR: { value: 10 }, uDim: { value: 1 },
  uAmbC: { value: new THREE.Vector2() }, uAmbR: { value: 1 }, uAmbI: { value: 0 }, uD: { value: 10 },
};
const MAPV = 'varying vec2 vW; void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xz; gl_Position = projectionMatrix * viewMatrix * wp; }';
const MAPF = `uniform vec3 uCol; uniform float uAlpha, uNoise; uniform vec2 uPoolC, uAmbC; uniform float uPoolR, uDim, uAmbR, uAmbI, uD;
  varying vec2 vW;
  float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p){ float a = 0.5, s = 0.; for (int i = 0; i < 4; i++){ s += a * vn(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
  void main(){
    float l = log2(max(uD, 0.01)) - 3.0, fl = floor(l), fr = l - fl;
    float s0 = exp2(fl), s1 = s0 * 2.;
    float n = mix(fbm(vW / s0), fbm(vW / s1), fr);           // detalhe na escala da vista, sem "nadar" no zoom
    float d = length(vW - uPoolC) / uPoolR; float pool = mix(0.16, 1.0, exp(-d * d * 1.7));
    vec3 c = uCol * (1. + uNoise * (n - 0.5) * 2.);
    float da = length(vW - uAmbC) / uAmbR; c += vec3(1.0, 0.6, 0.22) * uAmbI * exp(-da * da * 2.2) * (0.6 + 0.8 * n);
    gl_FragColor = vec4(c * pool * uDim, uAlpha); }`;
export function mapMat(col, { alpha = 1, noise = 0.12, order = 0 } = {}) {
  const m = new THREE.ShaderMaterial({ vertexShader: MAPV, fragmentShader: MAPF, uniforms: { ...U, uCol: { value: new THREE.Color(col) }, uAlpha: { value: alpha }, uNoise: { value: noise } }, transparent: alpha < 1, depthTest: false, depthWrite: false });
  m.userData.order = order; return m;
}

export async function loadMap() {
  const meta = await (await fetch('/project/web/data/mapa.json')).json();
  const bin = await (await fetch('/project/web/data/mapa.bin')).arrayBuffer();
  const ocean = new THREE.Mesh(new THREE.PlaneGeometry(4e5, 4e5).rotateX(-Math.PI / 2), mapMat('#0c141b', { noise: 0.38 })); ocean.renderOrder = 0; scene.add(ocean);
  const add = (name, mat, order) => {
    const L = meta[name], v2 = new Float32Array(bin, L.v[0], L.v[1] * 2), v3 = new Float32Array(L.v[1] * 3);
    for (let i = 0; i < L.v[1]; i++) { v3[i * 3] = v2[i * 2]; v3[i * 3 + 2] = v2[i * 2 + 1]; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(v3, 3));
    let o; if (L.kind === 'mesh') { g.setIndex(new THREE.BufferAttribute(new Uint32Array(bin, L.i[0], L.i[1]), 1)); o = new THREE.Mesh(g, mat); } else o = new THREE.LineSegments(g, mat);
    o.renderOrder = order; o.frustumCulled = false; scene.add(o); return o;
  };
  [['K_200', '#070c11'], ['J_1000', '#060a0e'], ['I_2000', '#05080c'], ['H_3000', '#04070a']].forEach(([lv, c], i) => { add('bat' + lv, mapMat(c, { noise: 0.38 }), 0.1 + i * 0.1); add('batl' + lv, mapMat('#2a3a44', { alpha: 0.28 - i * 0.04, noise: 0 }), 0.5 + i * 0.01); });
  add('land50', mapMat('#1d1c19', { noise: 0.32 }), 1); add('land10', mapMat('#1d1c19', { noise: 0.32 }), 1);
  add('coast50', mapMat('#7a7362', { alpha: 0.55, noise: 0 }), 2); add('coast10', mapMat('#8a826e', { alpha: 0.7, noise: 0 }), 2);
  add('bord50', mapMat('#5c574b', { alpha: 0.35, noise: 0 }), 2); add('bord10', mapMat('#6a6455', { alpha: 0.45, noise: 0 }), 2);
  return meta;
}

// ---------- câmera: alvo no mapa, distância, rumo e inclinação ----------
export function camState(k) {   // k = {x, z, D, yaw, pitch, roll}
  const cp = Math.cos(k.pitch), dir = new THREE.Vector3(Math.cos(k.yaw) * cp, -Math.sin(k.pitch), Math.sin(k.yaw) * cp);
  const target = new THREE.Vector3(k.x, 0, k.z), pos = target.clone().addScaledVector(dir, -k.D);
  const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize(), up = new THREE.Vector3().crossVectors(right, dir);
  return { ...k, dir, target, pos, right, up };
}
export function handheld(t, amp = 1) {   // tremor de mão sutil (soma de senos incomensuráveis)
  const s = (a, b, c) => Math.sin(t * a + b) * c;
  return { yaw: amp * (s(0.71, 1.3, 0.0016) + s(1.93, 0.2, 0.0007) + s(4.1, 2.2, 0.00025)), pitch: amp * (s(0.83, 0.7, 0.0013) + s(2.31, 1.9, 0.0006) + s(5.3, 0.4, 0.0002)), roll: amp * (s(0.57, 2.9, 0.0012) + s(1.71, 0.6, 0.0005)) };
}
// disco da lente: pontos bem espalhados (ângulo de ouro)
const GOLD = Math.PI * (3 - Math.sqrt(5));
function lensPt(i, n, r0) { const r = Math.sqrt((i + 0.5) / n), a = i * GOLD + r0; return [Math.cos(a) * r, Math.sin(a) * r]; }

// ---------- um quadro = soma de amostras ----------
// world(ts) prepara o mundo para o instante ts e devolve o estado da câmera {x,z,D,yaw,pitch,roll,aperture}
export function renderFrame(t, spp, world, post) {
  R.setRenderTarget(accRT); R.setClearColor(0x000000, 1); R.clear(true, true, true);
  const jit = rng(Math.floor(t * FPS) * 7919 + 13);
  for (let j = 0; j < spp; j++) {
    const ts = t + ((j + 0.5) / spp - 0.5) * SHUTTER;           // amostra de tempo dentro do obturador
    const k = camState(world(ts)); const [lx, ly] = lensPt((j * 7) % spp, spp, jit() * 6.283);
    const A = k.aperture * k.D;                                   // raio da lente no mesmo sistema do mundo
    const pos = k.pos.clone().addScaledVector(k.right, lx * A).addScaledVector(k.up, ly * A);
    camera.position.copy(pos); camera.up.set(0, 1, 0); camera.lookAt(k.target);   // foco no alvo
    camera.rotateZ(k.roll || 0);
    camera.near = Math.max(0.005, k.D * 0.004); camera.far = k.D * 60 + 2000; camera.updateProjectionMatrix();
    camera.setViewOffset(W, H, jit() - 0.5, jit() - 0.5, W, H);   // meio pixel de jitter = antisserrilhado
    U.uD.value = k.D;
    R.setRenderTarget(sampleRT); R.setClearColor(0x000000, 1); R.clear(true, true, true); R.render(scene, camera);
    camera.clearViewOffset();
    accMat.uniforms.t.value = sampleRT.texture; accMat.uniforms.w.value = 1 / spp; pass(accMat, accRT);
  }
  brightMat.uniforms.t.value = accRT.texture; pass(brightMat, b1a);
  blurMat.uniforms.t.value = b1a.texture; blurMat.uniforms.dir.value.set(1 / bW, 0); pass(blurMat, b1b);
  blurMat.uniforms.t.value = b1b.texture; blurMat.uniforms.dir.value.set(0, 1 / bH); pass(blurMat, b1a);
  blurMat.uniforms.t.value = b1a.texture; blurMat.uniforms.dir.value.set(2 / bW, 0); pass(blurMat, b2b);
  blurMat.uniforms.t.value = b2b.texture; blurMat.uniforms.dir.value.set(0, 2 / bH); pass(blurMat, b2a);
  hudTex.needsUpdate = true;
  const F = finalMat.uniforms; F.time.value = t; F.flash.value = post.flash || 0; F.expo.value = post.expo ?? 1; F.bloom.value = post.bloom ?? 0.55;
  pass(finalMat, null);
}

// ---------- primitivas do mundo ----------
// fita grossa (traço de caneta) sobre o mapa: pontos [x,z], largura em unidades do mundo, progresso 0..1
export function ribbon(color, { order = 6, opacity = 1 } = {}) {
  const g = new THREE.BufferGeometry(); const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity, depthTest: false, depthWrite: false, side: THREE.DoubleSide }));
  m.renderOrder = order; m.frustumCulled = false; scene.add(m);
  m.userData.set = (pts, width, prog = 1, y = 0.001) => {
    const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const end = L[L.length - 1] * clamp(prog); const P = [];
    for (let i = 0; i < pts.length; i++) {
      if (L[i] > end) { const a = pts[i - 1], b = pts[i], k = (end - L[i - 1]) / Math.max(1e-9, L[i] - L[i - 1]); P.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k)]); break; }
      P.push(pts[i]);
    }
    const v = [];
    for (let i = 0; i < P.length - 1; i++) {
      const a = P[i], b = P[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1, nx = -dz / l * width / 2, nz = dx / l * width / 2;
      v.push(a[0] + nx, y, a[1] + nz, a[0] - nx, y, a[1] - nz, b[0] + nx, y, b[1] + nz, a[0] - nx, y, a[1] - nz, b[0] - nx, y, b[1] - nz, b[0] + nx, y, b[1] + nz);
      if (i < P.length - 2) { const segs = 6; for (let s = 0; s < segs; s++) { const a0 = s / segs * Math.PI * 2, a1 = (s + 1) / segs * Math.PI * 2, r = width / 2; v.push(b[0], y, b[1], b[0] + Math.cos(a0) * r, y, b[1] + Math.sin(a0) * r, b[0] + Math.cos(a1) * r, y, b[1] + Math.sin(a1) * r); } }
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.computeBoundingSphere();
    m.visible = P.length > 1 && prog > 0;
  };
  return m;
}
// círculo feito à mão: elipse que passa um pouco do ponto inicial
export function handCircle(cx, cz, rx, rz, seed = 1) {
  const r = rng(seed), a0 = r() * 6.28, sweep = Math.PI * 2 + 0.28, ph = r() * 6.28, pts = [];
  for (let i = 0; i <= 160; i++) { const k = i / 160, a = a0 + sweep * k, w = 1 + 0.035 * Math.sin(a * 3 + ph) - 0.07 * Math.max(0, (a - a0 - Math.PI * 1.6) / (sweep - Math.PI * 1.6)); pts.push([cx + Math.cos(a) * rx * w, cz + Math.sin(a) * rz * w]); }
  return pts;
}
// textura feita em canvas 2D
export function canvasTexture(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.minFilter = THREE.LinearMipmapLinearFilter; return t; }
// rótulo datilografado (no chão do mapa ou de pé, virado para a câmera); revela n letras
export function label(text, { size = 1, color = '#ece4d2', flat = true, order = 7, font = 'Maquina', spacing = 0.03, glow = true } = {}) {
  const px = 128, c = document.createElement('canvas'), g = c.getContext('2d');
  g.font = `700 ${px}px ${font}`; const tw = Math.ceil(g.measureText(text).width + px * spacing * text.length + px * 0.8);
  c.width = tw; c.height = Math.round(px * 1.6);
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 8;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size * tw / c.height, size), mat); m.renderOrder = order; m.frustumCulled = false; scene.add(m);
  if (flat) m.rotation.x = -Math.PI / 2;
  let shown = -1;
  m.userData.reveal = (n) => {
    n = Math.max(0, Math.min(text.length, Math.floor(n))); if (n === shown) return; shown = n;
    g.clearRect(0, 0, c.width, c.height); g.font = `700 ${px}px ${font}`; g.textBaseline = 'middle';
    let x = px * 0.4; const s = text.slice(0, n);
    for (const ch of s) {
      if (glow) { g.shadowColor = 'rgba(0,0,0,0.85)'; g.shadowBlur = px * 0.25; }
      g.fillStyle = color; g.fillText(ch, x, c.height / 2); x += g.measureText(ch).width + px * spacing;
    }
    tex.needsUpdate = true;
  };
  m.userData.reveal(0); m.userData.flat = flat;
  return m;
}
