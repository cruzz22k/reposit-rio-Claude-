// planta.js — estilo "Planta no escuro" do Arquivo Morto (vertical 9:16, 2D em canvas).
// A casa é desenhada a nanquim, em traço de arquiteto (as linhas passam um pouco dos cantos), sobre papel escuro.
// Tudo fica no escuro e uma lanterna revela o que importa. Cores da identidade do canal: preto quente, osso,
// e vermelho só para o que está errado. A cena muda quando a luz pisca.
const Q = new URLSearchParams(location.search);
export const SCALE = +(Q.get('scale') || 1), W = 1080, H = 1920, FPS = 30;
export const COR = { preto: '#0d0b09', fundo: '#15120e', osso: '#e8dcc4', papel: '#e9dfc9', cinza: '#b9ad95', sombra: '#6a5e4c', verm: '#b3261c', ambar: '#f2b45c' };

// ---------- utilidades ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a)); return k * k * (3 - 2 * k); };
export const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
export const easeInOut = k => { k = clamp(k); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
export const prog = (t, a, d) => clamp((t - a) / d);
export function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const h1 = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const ruido = (x, seed = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(h1(i + seed * 57), h1(i + 1 + seed * 57), u) * 2 - 1; };
export function pchip(ts, ys) {
  const n = ts.length, h = [], d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) { h[i] = ts[i + 1] - ts[i]; d[i] = (ys[i + 1] - ys[i]) / h[i]; }
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) { if (d[i - 1] * d[i] <= 0) m[i] = 0; else { const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1]; m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]); } }
  return t => {
    if (t <= ts[0]) return ys[0]; if (t >= ts[n - 1]) return ys[n - 1];
    let i = 0; while (t > ts[i + 1]) i++;
    const s = (t - ts[i]) / h[i], s2 = s * s, s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * ys[i] + (s3 - 2 * s2 + s) * h[i] * m[i] + (-2 * s3 + 3 * s2) * ys[i + 1] + (s3 - s2) * h[i] * m[i + 1];
  };
}
// trajetória por quadros-chave: [t, ...valores]; cada coluna é uma curva suave
export function trajeto(K) { const cols = K[0].length - 1, f = []; for (let c = 1; c <= cols; c++) f.push(pchip(K.map(k => k[0]), K.map(k => k[c]))); return t => f.map(g => g(t)); }

// ---------- fontes ----------
export async function fontes() {
  const F = [['Maquina', 'courier-prime/files/courier-prime-latin-700-normal.woff2', '700'], ['MaquinaR', 'courier-prime/files/courier-prime-latin-400-normal.woff2', '400'],
    ['Datilo', 'special-elite/files/special-elite-latin-400-normal.woff2', '400'], ['Serifa', 'playfair-display/files/playfair-display-latin-900-normal.woff2', '900'],
    ['SerifaI', 'playfair-display/files/playfair-display-latin-400-italic.woff2', '400'], ['Caneta', 'kalam/files/kalam-latin-400-normal.woff2', '400']];
  for (const [fam, url, wt] of F) { const f = new FontFace(fam, `url(/node_modules/@fontsource/${url})`, { weight: wt }); await f.load(); document.fonts.add(f); }
}

// ---------- telas ----------
export const tela = document.getElementById('c'); tela.width = Math.round(W * SCALE); tela.height = Math.round(H * SCALE);
const out = tela.getContext('2d');
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
export const cenaC = mk(W, H), g = cenaC.getContext('2d');           // a cena com luz cheia
const luzC = mk(W / 4, H / 4), lz = luzC.getContext('2d');           // máscara da lanterna (baixa resolução, é toda macia)
const brilhoC = mk(W / 6, H / 6), br = brilhoC.getContext('2d');      // brilho em volta do que está claro
const fin = mk(W, H), fg = fin.getContext('2d');
export const sobreC = mk(W, H), sb = sobreC.getContext('2d');        // legendas e etiquetas fixas na tela (não sofrem a lanterna)

// papel escuro de fundo, com manchas e fibras
function texturaFundo() {
  const c = mk(W + 200, H + 200), x = c.getContext('2d'), r = rng(4);
  x.fillStyle = COR.fundo; x.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 90; i++) { const px = r() * c.width, py = r() * c.height, rad = 80 + r() * 380, gr = x.createRadialGradient(px, py, 0, px, py, rad); const a = r() * 0.07; gr.addColorStop(0, r() < 0.5 ? `rgba(0,0,0,${a * 2})` : `rgba(90,78,60,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(px - rad, py - rad, rad * 2, rad * 2); }
  const img = x.getImageData(0, 0, c.width, c.height), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const v = (r() - 0.5) * 9; d[i] += v; d[i + 1] += v; d[i + 2] += v; }
  x.putImageData(img, 0, 0);
  for (let i = 0; i < 900; i++) { const px = r() * c.width, py = r() * c.height, a = r() * Math.PI, l = 3 + r() * 14; x.strokeStyle = `rgba(160,140,110,${0.03 + r() * 0.05})`; x.lineWidth = 0.6; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  return c;
}
const FUNDO = texturaFundo();
export function fundo(dx = 0, dy = 0) { g.drawImage(FUNDO, -100 + clamp(dx, -100, 100), -100 + clamp(dy, -100, 100)); }

// grão de filme: alguns ladrilhos sorteados por quadro
const GRAOS = [0, 1, 2, 3].map(k => { const c = mk(W / 2, H / 2), x = c.getContext('2d'), img = x.createImageData(c.width, c.height), d = img.data, r = rng(100 + k); for (let i = 0; i < d.length; i += 4) { const v = 128 + (r() + r() + r() - 1.5) * 70; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } x.putImageData(img, 0, 0); return c; });

// textura de papel claro (fichas, laudos)
export function papelTex(w, h, seed = 1, base = COR.papel) {
  const c = mk(w, h), x = c.getContext('2d'), r = rng(seed);
  x.fillStyle = base; x.fillRect(0, 0, w, h);
  const img = x.getImageData(0, 0, w, h), d = img.data; for (let i = 0; i < d.length; i += 4) { const v = (r() - 0.5) * 14; d[i] += v; d[i + 1] += v; d[i + 2] += v * 0.9; } x.putImageData(img, 0, 0);
  for (let i = 0; i < 26; i++) { const px = r() * w, py = r() * h, rad = 20 + r() * 120, gr = x.createRadialGradient(px, py, 0, px, py, rad); gr.addColorStop(0, `rgba(120,95,60,${r() * 0.07})`); gr.addColorStop(1, 'rgba(120,95,60,0)'); x.fillStyle = gr; x.fillRect(px - rad, py - rad, rad * 2, rad * 2); }
  const e = x.createLinearGradient(0, 0, 0, h); e.addColorStop(0, 'rgba(80,60,30,0.10)'); e.addColorStop(0.08, 'rgba(0,0,0,0)'); e.addColorStop(0.92, 'rgba(0,0,0,0)'); e.addColorStop(1, 'rgba(80,60,30,0.12)'); x.fillStyle = e; x.fillRect(0, 0, w, h);
  return c;
}

// ---------- traço de nanquim ----------
// pts: [[x,y],...] na tela. p: quanto do traço já foi desenhado (0..1). O traço passa um pouco das pontas (over),
// treme de leve (wob) e tem uma segunda passada fraca, como tinta que espalha no papel.
export function tinta(c, pts, p = 1, { w = 2.2, cor = COR.osso, alpha = 1, over = 9, seed = 1, wob = 0.7, dash = null } = {}) {
  if (p <= 0 || pts.length < 2) return;
  const P = pts.map(q => [q[0], q[1]]);
  if (over) { const ext = (a, b) => { const dx = a[0] - b[0], dy = a[1] - b[1], l = Math.hypot(dx, dy) || 1; return [a[0] + dx / l * over, a[1] + dy / l * over]; }; P[0] = ext(P[0], P[1]); P[P.length - 1] = ext(P[P.length - 1], P[P.length - 2]); }
  let L = 0; const seg = []; for (let i = 0; i < P.length - 1; i++) { const l = Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]); seg.push(l); L += l; }
  const alvo = L * clamp(p); let acc = 0;
  const path = [];
  for (let i = 0; i < seg.length && acc < alvo; i++) {
    const [ax, ay] = P[i], [bx, by] = P[i + 1], l = seg[i]; if (l < 0.01) continue;
    const nx = -(by - ay) / l, ny = (bx - ax) / l, passos = Math.max(1, Math.ceil(l / 22)), fim = Math.min(1, (alvo - acc) / l);
    for (let k = 0; k <= passos; k++) { const s = Math.min(k / passos, fim), o = wob * ruido((acc + s * l) * 0.035, seed); path.push([ax + (bx - ax) * s + nx * o, ay + (by - ay) * s + ny * o]); if (s >= fim) break; }
    acc += l;
  }
  if (path.length < 2) return;
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = cor; if (dash) c.setLineDash(dash);
  c.globalAlpha = alpha * 0.28; c.lineWidth = w * 2.1; c.beginPath(); path.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
  c.globalAlpha = alpha; c.lineWidth = w; c.stroke();
  c.restore();
}
// círculo de caneta vermelha (mais de uma volta, torto, com pressão variando)
export function circulo(c, cx, cy, rx, ry, p, { cor = COR.verm, w = 4.2, seed = 3, rot = -0.08 } = {}) {
  if (p <= 0) return; const r = rng(seed), voltas = 1.18, n = 90, a0 = -2.2 + r() * 0.5;
  const pts = []; for (let i = 0; i <= n * p; i++) { const k = i / n, a = a0 + k * voltas * Math.PI * 2, rr = 1 + 0.05 * ruido(k * 6, seed) + 0.04 * k; const x = Math.cos(a) * rx * rr, y = Math.sin(a) * ry * rr; pts.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); }
  c.save(); c.lineCap = 'round'; c.strokeStyle = cor;
  for (let i = 1; i < pts.length; i++) { const k = i / n; c.globalAlpha = 0.85; c.lineWidth = w * (0.55 + 0.6 * Math.sin(Math.PI * clamp(k / voltas))); c.beginPath(); c.moveTo(pts[i - 1][0], pts[i - 1][1]); c.lineTo(pts[i][0], pts[i][1]); c.stroke(); }
  c.restore();
}
// cota de arquiteto: linha com traços nas pontas e o número no meio
export function cota(c, a, b, p, txt, { cor = COR.osso, w = 2, tam = 30, lado = -1, alpha = 1, fonte = 'Maquina' } = {}) {
  if (p <= 0) return; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, nx = -uy, ny = ux, e = [a[0] + dx * clamp(p), a[1] + dy * clamp(p)];
  tinta(c, [a, e], 1, { w, cor, alpha, over: 0 });
  const tick = (q, k) => tinta(c, [[q[0] - (ux + nx) * 9 * k, q[1] - (uy + ny) * 9 * k], [q[0] + (ux + nx) * 9 * k, q[1] + (uy + ny) * 9 * k]], 1, { w: w * 1.2, cor, alpha, over: 0 });
  tick(a, 1); tinta(c, [[a[0] - nx * 16, a[1] - ny * 16], [a[0] + nx * 16, a[1] + ny * 16]], 1, { w: w * 0.8, cor, alpha: alpha * 0.8, over: 0 });
  if (p >= 1) { tick(b, 1); tinta(c, [[b[0] - nx * 16, b[1] - ny * 16], [b[0] + nx * 16, b[1] + ny * 16]], 1, { w: w * 0.8, cor, alpha: alpha * 0.8, over: 0 }); }
  if (txt) { const m = [(a[0] + e[0]) / 2 + nx * lado * (tam * 0.9), (a[1] + e[1]) / 2 + ny * lado * (tam * 0.9)]; let ang = Math.atan2(dy, dx); if (ang > Math.PI / 2) ang -= Math.PI; if (ang < -Math.PI / 2) ang += Math.PI; c.save(); c.translate(m[0], m[1]); c.rotate(ang); c.globalAlpha = alpha; c.fillStyle = cor; c.font = `${tam}px ${fonte}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 0, 0); c.restore(); }
}

// texto que se datilografa (n = quantos caracteres já apareceram)
export function datilo(c, s, x, y, n, { fonte = 'Datilo', tam = 36, cor = COR.osso, alinh = 'left', esp = 0, alpha = 1, cursor = false, t = 0 } = {}) {
  const k = Math.max(0, Math.min(s.length, Math.floor(n))); if (k <= 0 && !cursor) return;
  c.save(); c.font = `${tam}px ${fonte}`; c.letterSpacing = esp + 'px'; c.fillStyle = cor; c.globalAlpha = alpha; c.textBaseline = 'alphabetic';
  const full = c.measureText(s).width, x0 = alinh === 'center' ? x - full / 2 : alinh === 'right' ? x - full : x;
  c.textAlign = 'left'; c.fillText(s.slice(0, k), x0, y);
  if (cursor && k < s.length && Math.floor(t * 4) % 2 === 0) { const wk = c.measureText(s.slice(0, k)).width; c.fillRect(x0 + wk + 2, y - tam * 0.8, tam * 0.5, tam * 0.95); }
  c.restore(); return full;
}

// ---------- câmera 3D para os desenhos em linha ----------
// mundo em metros, y para cima. A câmera devolve pontos na tela; segmentos atrás da lente são cortados.
export function camera(p, T, fov = 40, roll = 0) {
  const f = norm(sub(T, p)), r0 = norm(cross(f, [0, 1, 0])), u0 = cross(r0, f);
  const cr = Math.cos(roll), sr = Math.sin(roll), r = add(mul(r0, cr), mul(u0, sr)), u = add(mul(u0, cr), mul(r0, -sr));
  const F = (H / 2) / Math.tan(fov * Math.PI / 360), NEAR = 0.15;
  const cam = v => { const d = sub(v, p); return [dot(d, r), dot(d, u), dot(d, f)]; };
  const tela = c => [W / 2 + c[0] / c[2] * F, H / 2 - c[1] / c[2] * F];
  return {
    p, F, cam, tela,
    pt(v) { const c = cam(v); return c[2] > NEAR ? tela(c) : null; },
    esc(v) { const c = cam(v); return c[2] > NEAR ? F / c[2] : 0; },                // pixels por metro naquele ponto
    linha(pts) { // polilinha 3D -> pedaços 2D visíveis
      const res = []; let cur = [];
      for (let i = 0; i < pts.length - 1; i++) {
        let a = cam(pts[i]), b = cam(pts[i + 1]);
        if (a[2] <= NEAR && b[2] <= NEAR) { if (cur.length) { res.push(cur); cur = []; } continue; }
        const cut = (a, b) => { const k = (NEAR - a[2]) / (b[2] - a[2]); return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, NEAR]; };
        let quebra = false; if (a[2] <= NEAR) { a = cut(a, b); quebra = true; } if (b[2] <= NEAR) b = cut(b, a);
        if (quebra && cur.length) { res.push(cur); cur = []; }
        if (!cur.length) cur.push(tela(a)); cur.push(tela(b));
        if (cam(pts[i + 1])[2] <= NEAR) { res.push(cur); cur = []; }
      }
      if (cur.length > 1) res.push(cur); return res;
    },
    poli(pts) { // polígono 3D cortado na lente -> 2D
      const C = pts.map(cam), o = [];
      for (let i = 0; i < C.length; i++) { const a = C[i], b = C[(i + 1) % C.length], ia = a[2] > NEAR, ib = b[2] > NEAR; if (ia) o.push(a); if (ia !== ib) { const k = (NEAR - a[2]) / (b[2] - a[2]); o.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, NEAR]); } }
      return o.length > 2 ? o.map(tela) : null;
    },
    prof(v) { return cam(v)[2]; },
  };
}
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => mul(a, 1 / (Math.hypot(...a) || 1));
export const V = { sub, add, mul, dot, cross, norm };
// tremor de mão na câmera
export function mao(t, amp = 1) { return { x: amp * (ruido(t * 0.7, 1) * 0.6 + ruido(t * 2.3, 2) * 0.15), y: amp * (ruido(t * 0.6, 3) * 0.6 + ruido(t * 2.1, 4) * 0.15), r: amp * 0.004 * ruido(t * 0.5, 5) }; }

// ---------- luz ----------
// focos: [{x, y, r, i, cor}] em pixels da tela. amb: o quanto se vê fora da lanterna. A luz pisca de leve sempre.
export function iluminar(focos, amb = 0.2, t = 0, mult = 1) {
  const s = 0.25; lz.setTransform(1, 0, 0, 1, 0, 0); lz.globalCompositeOperation = 'source-over';
  const a = Math.round(255 * amb * mult); lz.fillStyle = `rgb(${a},${Math.round(a * 0.95)},${Math.round(a * 0.86)})`; lz.fillRect(0, 0, luzC.width, luzC.height);
  lz.globalCompositeOperation = 'lighter';
  const tremor = 0.94 + 0.06 * (0.5 + 0.5 * ruido(t * 9, 7));
  for (const f of focos) {
    const k = (f.i ?? 1) * mult * tremor; if (k <= 0) continue; const [r, gg, b] = f.cor || [255, 236, 205];
    const gr = lz.createRadialGradient(f.x * s, f.y * s, 0, f.x * s, f.y * s, f.r * s);
    gr.addColorStop(0, `rgba(${r},${gg},${b},${k})`); gr.addColorStop(0.45, `rgba(${r},${gg},${b},${k * 0.72})`); gr.addColorStop(0.8, `rgba(${r},${gg},${b},${k * 0.18})`); gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    lz.fillStyle = gr; lz.fillRect(0, 0, luzC.width, luzC.height);
  }
}

// junta tudo: cena x luz, brilho, grão, vinheta, sobreposição, escurecimento
export function compor(t, { fade = 0, grao = 0.11, brilho = 0.32, sobre = true } = {}) {
  fg.globalCompositeOperation = 'source-over'; fg.globalAlpha = 1; fg.filter = 'none';
  fg.drawImage(cenaC, 0, 0);
  fg.globalCompositeOperation = 'multiply'; fg.imageSmoothingQuality = 'high'; fg.drawImage(luzC, 0, 0, W, H);
  // brilho: o que ficou claro espalha um pouco de luz
  br.globalCompositeOperation = 'source-over'; br.filter = 'blur(3px)'; br.drawImage(fin, 0, 0, brilhoC.width, brilhoC.height); br.filter = 'none';
  fg.globalCompositeOperation = 'screen'; fg.globalAlpha = brilho; fg.drawImage(brilhoC, 0, 0, W, H); fg.globalAlpha = 1;
  // vinheta
  fg.globalCompositeOperation = 'multiply'; const vg = fg.createRadialGradient(W / 2, H * 0.47, H * 0.22, W / 2, H * 0.5, H * 0.72); vg.addColorStop(0, '#ffffff'); vg.addColorStop(1, '#3a332b'); fg.fillStyle = vg; fg.fillRect(0, 0, W, H);
  // sobreposição (legendas, etiquetas fixas)
  fg.globalCompositeOperation = 'source-over'; if (sobre) fg.drawImage(sobreC, 0, 0);
  // grão
  const k = Math.floor(t * FPS), gt = GRAOS[k % 4]; fg.globalCompositeOperation = 'overlay'; fg.globalAlpha = grao; fg.drawImage(gt, -((k * 37) % 120), -((k * 53) % 160), W + 240, H + 320); fg.globalAlpha = 1;
  fg.globalCompositeOperation = 'source-over';
  if (fade > 0) { fg.fillStyle = `rgba(0,0,0,${clamp(fade)})`; fg.fillRect(0, 0, W, H); }
  out.setTransform(1, 0, 0, 1, 0, 0); out.drawImage(fin, 0, 0, tela.width, tela.height);
}
export function limpar() { g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.fillStyle = COR.preto; g.fillRect(0, 0, W, H); sb.setTransform(1, 0, 0, 1, 0, 0); sb.clearRect(0, 0, W, H); }

// a luz piscando na troca de cena: devolve o multiplicador da luz perto do instante tc
export function pisca(t, tc, dur = 0.34) {
  const d = t - tc; if (Math.abs(d) > dur) return 1;
  const k = (d + dur) / (dur * 2), padrao = [1, 0.55, 1, 0.1, 0, 0, 0.0, 0.35, 0, 0.8, 0.6, 1]; const i = Math.min(padrao.length - 1, Math.floor(k * padrao.length));
  return padrao[i];
}

// legenda datilografada: palavras em destaque ficam claras ou vermelhas
export function legenda(s, n, { y = 1430, tam = 46, larg = 900, destaques = {}, alpha = 1 } = {}) {
  sb.save(); sb.font = `${tam}px Maquina`; sb.textBaseline = 'alphabetic';
  const palavras = s.split(' '), linhas = []; let cur = [];
  for (const p of palavras) { const tent = [...cur, p].join(' '); if (sb.measureText(tent).width > larg && cur.length) { linhas.push(cur.join(' ')); cur = [p]; } else cur.push(p); }
  if (cur.length) linhas.push(cur.join(' '));
  // cor de cada caractere
  const corDe = new Array(s.length).fill(COR.cinza);
  for (const [frase, cor] of Object.entries(destaques)) { const i = s.indexOf(frase); if (i >= 0) for (let k = i; k < i + frase.length; k++) corDe[k] = cor; }
  let idx = 0; const lh = tam * 1.28, y0 = y - (linhas.length - 1) * lh / 2;
  linhas.forEach((ln, li) => {
    const wl = sb.measureText(ln).width; let x = W / 2 - wl / 2; const vis = clamp(n - idx, 0, ln.length);
    // faixa escura atrás para ler em qualquer fundo (só onde já tem letra)
    if (vis > 0) { sb.globalAlpha = alpha * 0.55; sb.fillStyle = '#000'; sb.fillRect(x - 14, y0 + li * lh - tam * 0.86, sb.measureText(ln.slice(0, Math.ceil(vis))).width + 28, tam * 1.18); }
    for (let k = 0; k < ln.length; k++) { if (idx >= n) break; sb.globalAlpha = alpha; sb.fillStyle = corDe[idx]; sb.fillText(ln[k], x, y0 + li * lh); x += sb.measureText(ln[k]).width; idx++; }
    idx++; // o espaço da quebra
  });
  sb.restore();
}
