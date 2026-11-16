// mesa.js — estilo "mesa de evidências" do Arquivo Morto (vertical 9:16).
// Uma mesa de ardósia verde-escura, a planta da casa marcada com fita branca, objetos de verdade com luz e sombra,
// e uma câmera só. Cada quadro é a soma de várias amostras: tempo (borrão de movimento), lente (foco raso)
// e posição da luz (sombra macia). Nada de filtro de borrão.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
export { THREE };

const Q = new URLSearchParams(location.search);
export const SCALE = +(Q.get('scale') || 1);
export const W = Math.round(1080 * SCALE), H = Math.round(1920 * SCALE);
export const FPS = 30, SHUTTER = 0.5 / FPS;
export const SPP = Q.get('spp') ? +Q.get('spp') : null;

// ---------- utilidades ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
export const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
export const easeInOut = k => { k = clamp(k); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
export const win = (t, a, b, fi = 0.3, fo = 0.3) => Math.min(smooth(a, a + fi, t), 1 - smooth(b - fo, b, t));
export function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
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
    ['Maquina', 'courier-prime/files/courier-prime-latin-700-normal.woff2', '700'],
    ['MaquinaR', 'courier-prime/files/courier-prime-latin-400-normal.woff2', '400'],
    ['Datilo', 'special-elite/files/special-elite-latin-400-normal.woff2', '400'],
    ['Giz', 'caveat/files/caveat-latin-600-normal.woff2', '600'],
    ['Caneta', 'kalam/files/kalam-latin-400-normal.woff2', '400'],
    ['Serifa', 'playfair-display/files/playfair-display-latin-900-normal.woff2', '900'],
    ['Texto', 'nunito/files/nunito-latin-700-normal.woff2', '700'],
  ];
  for (const [fam, url, wt] of F) { const f = new FontFace(fam, `url(/node_modules/@fontsource/${url})`, { weight: wt }); await f.load(); document.fonts.add(f); }
}

// ---------- renderizador ----------
export const canvas = document.getElementById('c'); canvas.width = W; canvas.height = H;
export const R = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, alpha: false });
R.setPixelRatio(1); R.setSize(W, H, false); R.autoClear = false;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
R.toneMapping = THREE.NoToneMapping; R.outputColorSpace = THREE.LinearSRGBColorSpace;   // a conversão final é feita no último passe
const RT = (w, h) => new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, format: THREE.RGBAFormat, depthBuffer: true, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
const sampleRT = RT(W, H), accRT = RT(W, H);
const bW = Math.round(W / 4), bH = Math.round(H / 4);
const b1a = RT(bW, bH), b1b = RT(bW, bH), b2a = RT(bW >> 1, bH >> 1), b2b = RT(bW >> 1, bH >> 1);
const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), quadScene = new THREE.Scene();
const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); quadScene.add(quad);
const VQ = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
const accMat = new THREE.ShaderMaterial({ vertexShader: VQ, fragmentShader: 'uniform sampler2D t; uniform float w; varying vec2 vUv; void main(){ gl_FragColor = vec4(texture2D(t, vUv).rgb * w, 1.); }', uniforms: { t: { value: null }, w: { value: 1 } }, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation, depthTest: false, depthWrite: false });
const brightMat = new THREE.ShaderMaterial({ vertexShader: VQ, fragmentShader: 'uniform sampler2D t; uniform float th; varying vec2 vUv; void main(){ vec3 c = texture2D(t, vUv).rgb; float l = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(c * smoothstep(th, th + 0.5, l), 1.); }', uniforms: { t: { value: null }, th: { value: 0.85 } }, depthTest: false });
const blurMat = new THREE.ShaderMaterial({ vertexShader: VQ, fragmentShader: `uniform sampler2D t; uniform vec2 dir; varying vec2 vUv;
  void main(){ vec3 c = texture2D(t, vUv).rgb * 0.1964825501511404;
    c += (texture2D(t, vUv + dir * 1.411764705882353).rgb + texture2D(t, vUv - dir * 1.411764705882353).rgb) * 0.2969069646728344;
    c += (texture2D(t, vUv + dir * 3.2941176470588234).rgb + texture2D(t, vUv - dir * 3.2941176470588234).rgb) * 0.09447039785044732;
    c += (texture2D(t, vUv + dir * 5.176470588235294).rgb + texture2D(t, vUv - dir * 5.176470588235294).rgb) * 0.010381362401148057;
    gl_FragColor = vec4(c, 1.); }`, uniforms: { t: { value: null }, dir: { value: new THREE.Vector2() } }, depthTest: false });
export const hudCanvas = document.createElement('canvas'); hudCanvas.width = W; hudCanvas.height = H;
export const hud = hudCanvas.getContext('2d');
const hudTex = new THREE.CanvasTexture(hudCanvas); hudTex.minFilter = THREE.LinearFilter; hudTex.generateMipmaps = false;
// passe final: bloom, gradação (sombras esverdeadas, altos quentes), vinheta, curva de filme, grão, sRGB
const finalMat = new THREE.ShaderMaterial({ vertexShader: VQ, fragmentShader: `
  uniform sampler2D tAcc, tB1, tB2, tHud; uniform vec2 res; uniform float time, flash, grain, expo, bloom, vig, fade;
  varying vec2 vUv;
  float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
  vec3 aces(vec3 x){ return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0., 1.); }
  void main(){
    vec3 c = texture2D(tAcc, vUv).rgb;
    vec3 b = texture2D(tB1, vUv).rgb * 0.6 + texture2D(tB2, vUv).rgb * 0.8;
    c = (c + b * bloom) * expo * (1. + flash);
    vec2 q = (vUv - 0.5) * vec2(res.x / res.y, 1.);
    float v = smoothstep(0.95, 0.12, length(q * vec2(1.25, 0.95)));
    c *= mix(1. - vig, 1.0, v);
    float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
    c = mix(c, c * vec3(0.86, 1.04, 1.06), smoothstep(0.25, 0.0, l) * 0.6);     // sombras puxando para o verde-azulado
    c = mix(c, c * vec3(1.06, 1.0, 0.9), smoothstep(0.3, 0.9, l) * 0.5);       // altos quentes
    c = aces(c * 1.05);
    c = pow(c, vec3(1. / 2.2));
    vec4 h = texture2D(tHud, vUv); c = mix(c, h.rgb, h.a);
    float g = hash(vUv * res + vec2(time * 61.7, time * 37.3)) + hash(vUv * res * 0.5 + time * 13.1) - 1.0;
    c += g * grain * (0.5 + 0.5 * (1. - l));
    c *= 1. - fade;
    gl_FragColor = vec4(clamp(c, 0., 1.), 1.); }`,
  uniforms: { tAcc: { value: accRT.texture }, tB1: { value: b1a.texture }, tB2: { value: b2a.texture }, tHud: { value: hudTex }, res: { value: new THREE.Vector2(W, H) }, time: { value: 0 }, flash: { value: 0 }, grain: { value: 0.05 }, expo: { value: 1 }, bloom: { value: 0.25 }, vig: { value: 0.88 }, fade: { value: 0 } }, depthTest: false });
function pass(mat, target) { quad.material = mat; R.setRenderTarget(target); R.render(quadScene, quadCam); }

// ---------- cena, luz e ambiente ----------
export const scene = new THREE.Scene(); scene.background = new THREE.Color('#000000');
export const camera = new THREE.PerspectiveCamera(32, W / H, 0.5, 5000);
{ const pm = new THREE.PMREMGenerator(R); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.05; }
export const key = new THREE.SpotLight('#ffd6a0', 1.05e5, 0, 0.42, 0.85, 2);   // luminária de mesa, quente, de cima
key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.00012; key.shadow.normalBias = 0.02; key.shadow.radius = 2;
key.shadow.camera.near = 50; key.shadow.camera.far = 800;
scene.add(key, key.target);
export const fill = new THREE.HemisphereLight('#3d6b6a', '#0a1212', 0.12); scene.add(fill);
export const light = { x: -40, y: 300, z: -60, tx: 0, tz: 0, size: 26 };   // posição da luz e tamanho da área (sombra macia)

// ---------- câmera ----------
// k = { x, z: alvo na mesa (cm) ; D: distância ; yaw: giro em torno da vertical ; tilt: inclinação (0 = de cima) ;
//       roll ; aperture: raio da lente em cm ; fy: altura do ponto de foco }
export function camState(k) {
  const up = new THREE.Vector3(Math.sin(k.yaw), 0, -Math.cos(k.yaw));            // para onde fica o "alto" da tela
  const T = new THREE.Vector3(k.x, k.fy || 0, k.z);
  const pos = T.clone().add(new THREE.Vector3(0, k.D * Math.cos(k.tilt), 0)).addScaledVector(up, -k.D * Math.sin(k.tilt));
  return { ...k, T, pos, up };
}
export function handheld(t, amp = 1) {
  const s = (a, b, c) => Math.sin(t * a + b) * c;
  return { x: amp * (s(0.71, 1.3, 0.35) + s(1.93, 0.2, 0.14)), z: amp * (s(0.83, 0.7, 0.3) + s(2.31, 1.9, 0.12)), roll: amp * (s(0.57, 2.9, 0.0035) + s(1.71, 0.6, 0.0015)) };
}
const GOLD = Math.PI * (3 - Math.sqrt(5));
function diskPt(i, n, r0) { const r = Math.sqrt((i + 0.5) / n), a = i * GOLD + r0; return [Math.cos(a) * r, Math.sin(a) * r]; }

// ---------- um quadro = soma de amostras ----------
export function renderFrame(t, spp, world, post = {}) {
  R.setRenderTarget(accRT); R.setClearColor(0x000000, 1); R.clear(true, true, true);
  const jit = rng(Math.floor(t * FPS) * 7919 + 13);
  for (let j = 0; j < spp; j++) {
    const ts = t + ((j + 0.5) / spp - 0.5) * SHUTTER;
    const k = camState(world(ts));
    const [lx, ly] = diskPt((j * 7) % spp, spp, jit() * 6.283), [sx, sz] = diskPt((j * 11 + 3) % spp, spp, jit() * 6.283);
    // luz de área: a fonte anda um pouco a cada amostra
    key.position.set(light.x + sx * light.size, light.y, light.z + sz * light.size); key.target.position.set(light.tx, 0, light.tz); key.target.updateMatrixWorld();
    // lente: desloca a câmera no plano da lente e mira sempre o ponto de foco
    camera.up.copy(k.up); camera.position.copy(k.pos); camera.lookAt(k.T);
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0), cup = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    camera.position.addScaledVector(right, lx * k.aperture).addScaledVector(cup, ly * k.aperture);
    camera.lookAt(k.T); camera.rotateZ(k.roll || 0);
    camera.setViewOffset(W, H, jit() - 0.5, jit() - 0.5, W, H);
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
  const F = finalMat.uniforms; F.time.value = t; F.flash.value = post.flash || 0; F.expo.value = post.expo ?? 1; F.bloom.value = post.bloom ?? 0.25; F.fade.value = post.fade || 0;
  pass(finalMat, null);
}

// ---------- texturas ----------
export function canvasTex(w, h, draw, { srgb = true, aniso = 8 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.anisotropy = aniso; t.minFilter = THREE.LinearMipmapLinearFilter; if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.userData = { canvas: c, g }; return t;
}
// ruído de papel/fibra
export function grainFill(g, w, h, base, amt, seed = 1, cell = 2) {
  g.fillStyle = base; g.fillRect(0, 0, w, h); const r = rng(seed); const img = g.getImageData(0, 0, w, h), d = img.data;
  for (let y = 0; y < h; y += cell) for (let x = 0; x < w; x += cell) { const v = (r() - 0.5) * amt; for (let yy = 0; yy < cell && y + yy < h; yy++) for (let xx = 0; xx < cell && x + xx < w; xx++) { const i = ((y + yy) * w + x + xx) * 4; d[i] += v; d[i + 1] += v; d[i + 2] += v; } }
  g.putImageData(img, 0, 0);
}
export function blotches(g, w, h, n, color, rMin, rMax, seed = 1, aMax = 0.12) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { const x = r() * w, y = r() * h, rad = lerp(rMin, rMax, r()); const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, color.replace('A', (aMax * r()).toFixed(3))); gr.addColorStop(1, color.replace('A', '0')); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
}
