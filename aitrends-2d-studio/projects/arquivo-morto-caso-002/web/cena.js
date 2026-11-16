// cena.js — Caso 002, "O corredor que encolhe", no estilo mesa de evidências.
// A planta do ap. 503 está marcada com fita na ardósia, na escala 1:8 (1 m da casa = 12,5 cm da mesa),
// e os documentos ficam dentro dos cômodos, como na abertura de referência.
// Cada frase tem um herói (objeto ou papel) e um gesto (círculo vermelho, giz que se escreve, etiqueta).
import { W, H, FPS, SPP, clamp, smooth, pchip, rng, loadFonts, renderFrame, handheld, light, hud } from './mesa.js';
import * as O from './objetos.js';

const Qs = new URLSearchParams(location.search);
const TL = await (await fetch('/project/input/timeline-v1.json')).json();
const S = i => TL[i - 1].start, E = i => TL[i - 1].end;
const P = (i, palavra) => { const f = TL[i - 1], k = f.text.indexOf(palavra); return f.start + (f.end - f.start) * (k / f.text.length); };
const FIM = +(Qs.get('fim') || E(5) + 1.2);

await loadFonts();
O.ardosia();

// ---------- a planta em fita ----------
const M = m => m * 12.5;
const zS = 60, zF = zS - M(9.6), cx = 7.5;          // corredor de 9,60 m x 1,20 m
const zB = zS - M(3.2), zQ = zS - M(6.1);            // portas do banheiro e do quarto
let sd = 1; const F = (a, b, c, d) => O.fita(a, b, c, d, { seed: sd++ });
F(-58, zS, -cx, zS); F(cx, zS, 44, zS); F(-58, zS, -58, 146); F(44, zS, 44, 146); F(-58, 146, 44, 146);        // sala
O.fitaT(-cx, zS, Math.PI / 2, { seed: 90, len: 5 }); O.fitaT(cx, zS, Math.PI / 2, { seed: 91, len: 5 });
F(-cx, zS, -cx, zB + 3); F(-cx, zB - 9, -cx, zF);                                                                  // corredor
F(cx, zS, cx, zQ + 3); F(cx, zQ - 9, cx, zF);
F(-cx, zF, 58, zF);
O.fitaT(-cx, zB + 3, 0, { seed: 92, len: 5 }); O.fitaT(-cx, zB - 9, 0, { seed: 93, len: 5 }); O.fitaT(cx, zQ + 3, 0, { seed: 94, len: 5 }); O.fitaT(cx, zQ - 9, 0, { seed: 95, len: 5 });
F(-46, zB + 22, -cx, zB + 22); F(-46, zB - 24, -cx, zB - 24); F(-46, zB + 22, -46, zB - 24);                     // banheiro
F(58, zF, 58, zQ + 24); F(cx, zQ + 24, 58, zQ + 24);                                                               // quarto

O.etiqueta('CASO 002', -8, 157, 0.04, { alt: 1.9 });
O.etiqueta('AP. 503', -44, 138, -0.05, { alt: 1.4 });
O.etiqueta('LÚCIA', -30, 80, 0.06, { alt: 1.5 });
O.etiqueta('BANHEIRO', -38, zB + 17, 0.03, { alt: 1.2 });
O.etiqueta('QUARTO', 40, zQ - 22, -0.04, { alt: 1.2 });

// ---------- papéis ----------
const tipo = (g, s, x, y, px, cor = '#1f1b16', fonte = 'MaquinaR', peso = 400) => { g.font = `${peso} ${px}px ${fonte}`; g.fillStyle = cor; g.fillText(s, x, y); };
const riscos = (g, x, y, w, n, lh, seed) => { const r = rng(seed); g.fillStyle = 'rgba(70,64,56,0.35)'; for (let i = 0; i < n; i++) g.fillRect(x, y + i * lh, w * (0.55 + 0.45 * r()), lh * 0.22); };

const contrato = O.papel(21, 29.7, (g, w, h, p) => {
  tipo(g, 'CONTRATO DE LOCAÇÃO RESIDENCIAL', p * 2, p * 3.2, p * 0.78, '#1f1b16', 'Maquina', 700);
  g.fillStyle = '#1f1b16'; g.fillRect(p * 2, p * 3.7, w - p * 4, p * 0.05);
  ['IMÓVEL: Edifício Marajoara, apartamento 503', 'Rua Tamandaré, 88', 'LOCATÁRIA: Lúcia M. Ferreira', 'INÍCIO: 02/08/2021   PRAZO: 30 meses', 'ALUGUEL MENSAL: R$ 1.150,00']
    .forEach((s, i) => tipo(g, s, p * 2, p * (5.4 + i * 1.25), p * 0.62, '#2a251f'));
  riscos(g, p * 2, p * 12.4, w - p * 4, 14, p * 0.95, 21);
  g.save(); g.translate(w * 0.6, h * 0.9); g.rotate(-0.06); tipo(g, 'Lúcia M. Ferreira', 0, 0, p * 1.05, '#23306a', 'Caneta'); g.restore();
}, { seed: 31 });
contrato.position.set(-22, 0, 100); contrato.rotation.y = 0.12;

const recorte = O.papel(13, 15, (g, w, h, p) => {
  tipo(g, 'CLASSIFICADOS · IMÓVEIS', p * 0.8, p * 1.3, p * 0.55, '#3a332a', 'Maquina', 700); g.fillStyle = '#3a332a'; g.fillRect(p * 0.8, p * 1.6, w - p * 1.6, p * 0.04);
  [['ED. MARAJOARA · AP. 701', '2 dorm. · R$ 2.300'], ['ED. MARAJOARA · AP. 503', '2 dorm. · R$ 1.150'], ['ED. MARAJOARA · AP. 302', '2 dorm. · R$ 2.250']]
    .forEach(([a, b], i) => { const y = p * (3.2 + i * 3.9); tipo(g, 'ALUGA-SE', p * 0.8, y, p * 0.62, '#1f1b16', 'Maquina', 700); tipo(g, a, p * 0.8, y + p * 0.9, p * 0.5, '#2a251f'); tipo(g, b, p * 0.8, y + p * 1.7, p * 0.62, '#1f1b16', 'Maquina', 700); riscos(g, p * 0.8, y + p * 2.2, w - p * 1.6, 1, p * 0.6, 40 + i); });
}, { cor: '#ddd4c0', seed: 33, curva: 0.25 });
recorte.position.set(22, 0, 116); recorte.rotation.y = -0.16;
O.circuloCaneta(recorte, 4.7, 8.6, 4.3, 0.85, P(3, 'metade'), 0.75, { seed: 5 });

O.polaroid(12, 92, 0.24, (g, x, y, w, h) => {      // o prédio de noite, uma janela acesa
  const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#1a2230'); gr.addColorStop(1, '#0c0f14'); g.fillStyle = gr; g.fillRect(x, y, w, h);
  g.fillStyle = '#20232a'; g.fillRect(x + w * 0.18, y + h * 0.12, w * 0.64, h * 0.9);
  const r = rng(77);
  for (let andar = 0; andar < 8; andar++) for (let c = 0; c < 3; c++) {
    const wx = x + w * (0.25 + c * 0.19), wy = y + h * (0.17 + andar * 0.1), acesa = andar === 3 && c === 1;
    g.fillStyle = acesa ? '#e8c27a' : `rgba(60,70,85,${0.4 + r() * 0.3})`; g.fillRect(wx, wy, w * 0.11, h * 0.06);
    if (acesa) { g.fillStyle = 'rgba(232,194,122,0.25)'; g.fillRect(wx - 4, wy - 4, w * 0.11 + 8, h * 0.06 + 8); }
  }
}, 'Marajoara, ago/21');

const vistoria = O.papel(21, 29.7, (g, w, h, p) => {
  tipo(g, 'LAUDO DE VISTORIA DE ENTRADA', p * 2, p * 3.2, p * 0.8, '#1f1b16', 'Maquina', 700);
  tipo(g, 'IMOBILIÁRIA CENTRAL · AP. 503 · 02/08/2021', p * 2, p * 4.3, p * 0.5, '#4a4237');
  g.fillStyle = '#1f1b16'; g.fillRect(p * 2, p * 4.7, w - p * 4, p * 0.05);
  [['SALA', 'piso de taco · bom estado'], ['CORREDOR', 'comprimento: 9,00 m (trena laser)'], ['', 'parede do fundo: pintura nova, cor gelo'], ['', 'rodapé do fundo novo, sem pintura'], ['BANHEIRO', 'azulejo · sem avarias'], ['QUARTO', 'piso de taco · bom estado'], ['CHAVES', '1 jogo · 2ª cópia não devolvida']]
    .forEach(([a, b], i) => { const y = p * (6.4 + i * 1.3); tipo(g, a, p * 2, y, p * 0.6, '#1f1b16', 'Maquina', 700); tipo(g, b, p * 6.2, y, p * 0.6, '#2a251f'); });
  riscos(g, p * 2, p * 16.4, w - p * 4, 9, p * 0.95, 51);
  g.save(); g.translate(w * 0.58, h * 0.9); g.rotate(-0.04); tipo(g, 'vistoriadora', 0, 0, p * 0.9, '#23306a', 'Caneta'); g.restore();
}, { seed: 35 });
vistoria.position.set(-34, 0, -42); vistoria.rotation.y = -0.07;
O.circuloCaneta(vistoria, 11.95, 7.5, 1.55, 0.62, S(5) + 0.15, 0.7, { seed: 7 });
O.sublinha(vistoria, 12.3, 9.25, 16.8, P(5, 'pintura'), 0.5);

// caderno da Lúcia no quarto
O.caderno(34, -38, -0.12, (g, w, h, p) => { g.font = `400 ${p * 0.62}px Caneta`; g.fillStyle = '#23306a'; ['dom 05/09 — 9,00', 'dom 12/09 — 8,85', 'dom 19/09 — 8,70', 'dom 26/09 — 8,55'].forEach((s, i) => g.fillText(s, p * 2, p * (3.0 + i * 1.15))); },
  (g, w, h, p) => { g.font = `400 ${p * 0.62}px Caneta`; g.fillStyle = '#23306a'; ['dom 03/10 — 8,40', 'dom 10/10 — 8,25'].forEach((s, i) => g.fillText(s, p * 2, p * (3.0 + i * 1.15))); });

// ---------- objetos ----------
O.chaves(-2, 84, 0.5, { n: 1 });
O.trena(-1.5, zS + 3.5, -Math.PI / 2, M(9.0) - 3.5);       // estica do começo do corredor até 9,00 m: sobra um vão até a fita do fundo
O.lapis(-14, -66, 0.6);
O.tocoGiz(24, 176, 0.3);
O.bituca(3, zF + 5, 2.2);
O.po(0, zF + 2.5, 4);
O.marcaCafe(-48, 30, 4.2);

// ---------- giz ----------
const gizes = [
  O.giz('', 2, 166, { tam: 5.2, t0: S(1) + 0.55, dur: 1.5, ang: -0.04, linhas: ['O corredor', 'que encolhe'] }),
  O.giz('', 23, 128, { linhas: ['metade', 'do preço'], tam: 2.7, t0: P(3, 'metade') + 0.1, dur: 1.0, ang: -0.08 }),
  O.giz('9,00 m ?', 15.5, zS - M(9.0) + 1.5, { tam: 2.8, t0: P(4, 'nove') + 0.05, dur: 0.8 }),
];
const tracos = [O.tracoGiz([[10.5, zS - M(9.0) + 1.2], [7, zS - M(9.0) + 0.3], [1.5, zS - M(9.0)]], { t0: P(4, 'nove') + 0.5, dur: 0.4, larg: 0.3 })];
const papeis = [contrato, recorte, vistoria];

// ---------- câmera ----------
// [t, x, z, D, yaw, tilt, abertura]
const K = [
  [0.0, -2, 164, 100, 0.05, 0.30, 0.3],
  [S(1) + 2.2, 0, 162, 118, 0.02, 0.34, 0.4],
  [S(2) + 0.5, -12, 100, 170, 0.0, 0.40, 0.34],
  [S(2) + 4.2, -6, 96, 146, -0.04, 0.46, 0.36],
  [S(3) + 0.25, 18, 116, 74, -0.10, 0.32, 0.4],
  [E(3) + 0.1, 22, 115, 60, -0.14, 0.28, 0.42],
  [S(4) + 0.6, 0, 50, 110, 0.0, 0.66, 0.3],
  [P(4, 'nove') + 0.2, 5, -36, 104, 0.02, 0.62, 0.3],
  [S(5) + 0.1, -30, -44, 92, -0.03, 0.40, 0.36],
  [E(5) + 0.5, -34, -42, 80, -0.05, 0.32, 0.4],
  [E(5) + 1.6, -26, -36, 104, -0.07, 0.40, 0.36],
];
if (Qs.get('geral')) K.splice(0, K.length, [0, -2, 40, 520, 0, 0, 0], [99, -2, 40, 520, 0, 0, 0]);
const col = c => pchip(K.map(k => k[0]), K.map(k => k[c]));
const cX = col(1), cZ = col(2), cD = col(3), cYaw = col(4), cTilt = col(5), cAp = col(6);
light.size = 12;
function world(t) {
  const hh = handheld(t, 0.35);
  for (const p of papeis) p.userData.atualiza(t);
  for (const gz of gizes) gz.userData.atualiza(t);
  for (const tr of tracos) tr.userData.atualiza(t);
  const x = cX(t) + hh.x, z = cZ(t) + hh.z;
  // luminária baixa e de lado (sombras compridas), acompanhando devagar o assunto
  light.tx = x; light.tz = z; light.x = x - 70; light.z = z - 95; light.y = 165;
  return { x, z, D: cD(t), yaw: cYaw(t), tilt: cTilt(t), roll: hh.roll, aperture: cAp(t), fy: 0.2 };
}
function sppAt(t) {
  if (SPP) return SPP;
  const a = world(t - 0.02), b = world(t + 0.02), v = Math.hypot(a.x - b.x, a.z - b.z, a.D - b.D) / 0.04;
  return Math.round(clamp(12 + v * 0.5, 12, 22));
}
window.TOTAL_FRAMES = Math.ceil(FIM * FPS);
window.renderAt = f => { const t = f / FPS, spp = sppAt(t); hud.clearRect(0, 0, W, H); renderFrame(t, spp, world, { fade: 1 - smooth(0, 0.6, t) }); return spp; };
window.READY = true;
