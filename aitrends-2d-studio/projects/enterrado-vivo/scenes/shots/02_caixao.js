// shots/02_caixao.js — você acorda no caixão, o ar, o gás carbônico, o pânico, a família, o caixão de segurança (s11–s23).
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, underground, coffinInside, coffinSide, coffinTop, candle, bell, CANDLE, MOON, WOOD } from '../sets/world.js';
import { labelTitle, bpTitle } from '../sets/common.js';
import { camPath, punch, focus, dof, bokeh, fogDrift, shafts } from '/engine/cine.js';
import { VOCE, MAE, PAI, GOLD } from '../cast.js';
import { rimOf, W0, zoomAt, deitado } from './01_morte.js';

const AR = '#7fc8ff', CO2 = '#ff6a50';
// tubo do caixão até a superfície (corte)
export function tubo(g, x, y0, y1, c = '#8a8a96', w = 18) { g.fillStyle = shade(c, -0.3); g.fillRect(x - w / 2 - 3, y1, w + 6, y0 - y1); g.fillStyle = c; g.fillRect(x - w / 2, y1, w, y0 - y1); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x - w / 2 + 3, y1, 3, y0 - y1); }
export function postoSino(g, x, sy, s, swing = 0) { seg(g, [[x, sy], [x, sy - 220 * s]], 9 * s, '#2a2218'); seg(g, [[x - 6, sy - 220 * s], [x + 60 * s, sy - 220 * s]], 7 * s, '#2a2218'); bell(g, x + 52 * s, sy - 216 * s, 0.7 * s, swing); }
// caixão em blueprint (vista lateral): retângulo e medidas
function bpCoffin(g, x, y, w, h, c, p = 1) { g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); const L = (w * 2 + h * 2) * p; let r = L; const pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]; g.moveTo(x, y); for (let i = 1; i < 5 && r > 0; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], d = Math.hypot(bx - ax, by - ay), k = Math.min(1, r / d); g.lineTo(ax + (bx - ax) * k, ay + (by - ay) * k); r -= d; } g.stroke(); }

// s11 — "Horas depois, você acorda." — escuro total; seus olhos se abrem
registerShot('s11', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.08 }, { z: 1.0 }, { hand: 2, seed: 1 });
  coffinInside(g, t, cam, { light: 0.1 });
  const tA = W0('acorda', info), open = ease.out(prog(t, tA - 0.05, tA + 0.25));
  layer(g, cam, 1, (g) => bigFace(g, E.W / 2, E.H * 0.52, 300, { outfit: VOCE, expr: open > 0.5 ? 'shocked' : 'neutral', blink: 1 - open, look: [0, -0.6], rimColor: '#ffb070', rimSide: 1 }));
  veil(g, '#000', 0.85 - 0.55 * ease.out(prog(t, 0, tA + 0.2)));
  text(g, 'HORAS DEPOIS', E.W / 2, 330, { size: 38, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 10, alpha: 0.85 * ease.out(prog(t, 0.1, 0.5)) });
} });

// s12 — "Está tudo escuro. Você levanta a mão… e bate na madeira." — a mão sobe e bate na tampa
registerShot('s12', { draw(g, t, info) {
  const d = info.dur, tB = W0('bate', info), cam0 = camPath(t, d, { z: 1.0, y: 0 }, { z: 1.06, y: -20 }, { hand: 3, seed: 2 }), cam = { ...cam0, z: cam0.z + punch(t, tB, 0.07) };
  coffinInside(g, t, cam, { light: 0.16 });
  const tM = W0('levanta', info), up = ease.inOut(prog(t, tM, tB));
  layer(g, cam, 1, (g) => {
    bigFace(g, E.W / 2 - 60, 1640, 330, { outfit: VOCE, expr: 'scared', blink: 0, look: [0.4, -1], rimColor: '#ffb070', rimSide: 1 });
    const hx = E.W / 2 + 220, hy = lerp(2100, 420, up); seg(g, [[hx + 80, 2200], [hx + 30, hy + 60], [hx, hy]], 70, '#3a6ea5'); circle(g, hx, hy - 10, 52, S().ink); g.fillStyle = 'rgba(255,190,120,.6)'; g.beginPath(); g.arc(hx, hy - 10, 54, -0.3, 1.0); g.lineWidth = 5; g.strokeStyle = 'rgba(255,190,120,.6)'; g.stroke();
    if (t > tB) { for (let i = 0; i < 14; i++) { const r = rng(i + 9), k = (t - tB) * (0.8 + r()), x = hx + (r() - 0.5) * 160, y = 380 + k * 500 * (0.5 + r()); g.fillStyle = alpha('#8a7058', clamp(1 - (t - tB) / 1.2)); g.fillRect(x, y, 5, 5); } }
  });
  if (t > tB) { const a = clamp(1 - (t - tB) / 0.6); text(g, 'TOC', E.W / 2 + 220, 300, { size: 70, color: GOLD, font: FONTS.ui, weight: 900, spacing: 6, alpha: a }); }
  veil(g, '#000', 0.2);
} });

// s13 — "Você está dentro de um caixão, debaixo da terra." — a câmera sobe do caixão até a superfície (corte)
registerShot('s13', { draw(g, t, info) {
  const d = info.dur, k = ease.inOut(prog(t, 0, d)), cam = { z: lerp(1.9, 1.0, k), x: 0, y: lerp(560, 0, k), r: 0 };
  const { CX, sy, cy } = underground(g, t, cam, { sy: 560, cy: 1500 });
  layer(g, cam, 1, (g) => { g.fillStyle = '#120c08'; g.fillRect(CX - 254, cy - 134, 508, 118); deitado(g, CX - 20, cy - 40, 0.55, VOCE, { blink: 0, rim: rimOf('#ffb070', [0, -1]) }); glow(g, CX, cy - 75, 160, '#ffb070', 0.18); });
  layer(g, cam, 1, (g) => UI.dimension(g, t, { x1: CX + 360, y1: sy, x2: CX + 360, y2: cy - 150, str: '1,8 m', start: 1.2 }));
  FX.dust(g, t, { count: 30, color: '#d8c0a0', a: 0.25 });
} });

// s14 — "Um caixão comum tem uns 880 litros de espaço." — blueprint com medidas
registerShot('s14', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, k = ease.inOut(t / info.dur);
  g.save(); zoomAt(g, E.W / 2, 860, 1 + 0.04 * k);
  const x = 140, y = 760, w = 800, h = 230; bpCoffin(g, x, y, w, h, bp, ease.out(prog(t, 0, 0.9)));
  g.strokeStyle = alpha(bp, 0.5); g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 120, y - 90); g.lineTo(x + w + 120, y - 90); g.lineTo(x + w, y); g.moveTo(x + w + 120, y - 90); g.lineTo(x + w + 120, y + h - 90); g.lineTo(x + w, y + h); g.globalAlpha = ease.out(prog(t, 0.5, 1.0)); g.stroke(); g.globalAlpha = 1;
  UI.dimension(g, t, { x1: x, y1: y + h + 60, x2: x + w, y2: y + h + 60, str: '2,0 m', start: 0.6 });
  UI.dimension(g, t, { x1: x - 60, y1: y + h, x2: x - 60, y2: y, str: '0,6 m', start: 0.9 });
  UI.dimension(g, t, { x1: x + w + 40, y1: y + 20, x2: x + w + 150, y2: y - 70, str: '0,7 m', start: 1.2 });
  g.restore();
  bpTitle(g, 'UM CAIXÃO COMUM', 400, ease.out(prog(t, 0.1, 0.5)));
  const t8 = W0('880', info); if (t > t8) text(g, '880 L', E.W / 2, 1230, { size: 130, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, t8, t8 + 0.3)), glow: 22, glowColor: 'rgba(255,150,60,.55)' });
} });

// s15 — "Tirando o seu corpo, sobram cerca de 820 litros de ar." — o corpo dentro; o ar em azul
registerShot('s15', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, k = ease.inOut(t / info.dur);
  const x = 140, y = 760, w = 800, h = 230, tC = W0('corpo', info), tA = W0('820', info);
  const air = ease.out(prog(t, tA - 0.3, tA + 0.6)); if (air > 0) { g.fillStyle = alpha(AR, 0.22 * air); g.fillRect(x, y + h * (1 - air), w, h * air); for (let i = 0; i < 26; i++) { const r = rng(i), bx = x + 30 + r() * (w - 60), by = y + h - ((t * 60 + r() * h) % h); circle(g, bx, by, 5, alpha(AR, 0.6 * air)); } }
  bpCoffin(g, x, y, w, h, bp, 1);
  if (t > tC - 0.2) { const a = ease.out(prog(t, tC - 0.2, tC + 0.3)); g.save(); g.globalAlpha = a; g.translate(x + w - 110, y + h / 2 + 20); g.rotate(-Math.PI / 2); UI.lineFigure(g, { x: 0, y: 0, s: 2.8, pose: POSES.lie, color: '#e8f0ff' }); g.restore(); text(g, '− 60 L', x + w - 120, y - 60, { size: 54, color: u.accent, font: FONTS.ui, weight: 900, alpha: a }); }
  bpTitle(g, 'TIRANDO O SEU CORPO', 400, ease.out(prog(t, 0.1, 0.5)));
  if (t > tA) { text(g, '820 L', E.W / 2, 1180, { size: 130, color: AR, font: FONTS.ui, weight: 900, alpha: air, glow: 22, glowColor: alpha(AR, 0.5) }); text(g, 'DE AR', E.W / 2, 1270, { size: 46, color: u.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: air }); }
} });

// barra vertical de gás (0..1)
function gauge(g, x, y, h, v, c, lab, val, a = 1) { g.save(); g.globalAlpha = a; rr(g, x - 40, y - h, 80, h, 40); g.strokeStyle = alpha(c, 0.8); g.lineWidth = 4; g.stroke(); rr(g, x - 30, y - 10 - (h - 20) * v, 60, (h - 20) * v, 30); g.fillStyle = alpha(c, 0.75); g.fill(); text(g, lab, x, y + 50, { size: 40, color: c, font: FONTS.ui, weight: 900 }); text(g, val, x, y - h - 40, { size: 44, color: S().ui.cream, font: FONTS.ui, weight: 900 }); g.restore(); }
// s16 — "Parece muito. Mas o que te mata não é só o oxigênio acabando." — o oxigênio cai devagar
registerShot('s16', { draw(g, t, info) {
  UI.blueprint(g); const u = S().ui, d = info.dur, o2 = lerp(21, 17.5, ease.inOut(prog(t, 0.6, d)));
  bpTitle(g, 'PARECE MUITO...', 400, ease.out(prog(t, 0.1, 0.5)));
  gauge(g, E.W / 2, 1150, 560, o2 / 21, AR, 'O₂', `${o2.toFixed(1).replace('.', ',')}%`);
  const tO = W0('oxigênio', info); if (t > tO) text(g, 'NÃO É SÓ ISSO', E.W / 2, 1290, { size: 46, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tO, tO + 0.3)) });
} });

// s17 — "É o gás carbônico que você mesmo solta." — CO2 se acumulando
registerShot('s17', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, d = info.dur;
  const x = 140, y = 640, w = 800, h = 230; bpCoffin(g, x, y, w, h, bp, 1);
  g.save(); g.translate(x + w - 110, y + h / 2 + 20); g.rotate(-Math.PI / 2); UI.lineFigure(g, { x: 0, y: 0, s: 2.8, pose: POSES.lie, color: '#e8f0ff' }); g.restore();
  const n = Math.floor(lerp(4, 60, clamp(t / d))); for (let i = 0; i < n; i++) { const r = rng(i + 4), px = x + 150 + r() * (w - 190), py = y + 30 + r() * (h - 60) + Math.sin(t * 2 + i) * 6; circle(g, px, py, 9, alpha(CO2, 0.8)); circle(g, px - 13, py, 6, alpha('#ffd0c0', 0.7)); circle(g, px + 13, py, 6, alpha('#ffd0c0', 0.7)); }
  const puff = (t * 0.8) % 1; ring(g, x + 120, y + 70, 20 + puff * 60, 3, alpha(CO2, 0.6 * (1 - puff)));
  gauge(g, E.W / 2, 1290, 280, clamp(t / d) * 0.6, CO2, 'CO₂', `${(clamp(t / d) * 4).toFixed(1).replace('.', ',')}%`);
  bpTitle(g, 'GÁS CARBÔNICO', 400, ease.out(prog(t, 0.1, 0.5)), CO2);
} });

// s18 — "Em umas duas horas, o ar fica tão ruim que você começa a ficar confuso." — relógio; depois você tonto
function relogio(g, cx, cy, r, t, speed) { circle(g, cx, cy, r + 18, '#c8a050'); circle(g, cx, cy, r, '#f0e6d0'); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; seg(g, [[cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82], [cx + Math.cos(a) * r * 0.94, cy + Math.sin(a) * r * 0.94]], 5, '#2a2018'); } const h = t * speed, m = h * 12; seg(g, [[cx, cy], [cx + Math.sin(h) * r * 0.5, cy - Math.cos(h) * r * 0.5]], 12, '#2a2018'); seg(g, [[cx, cy], [cx + Math.sin(m) * r * 0.8, cy - Math.cos(m) * r * 0.8]], 7, '#2a2018'); circle(g, cx, cy, 12, '#c8a050'); ring(g, cx, cy - r - 40, 26, 8, '#c8a050'); }
registerShot('s18', { draw(g, t, info) {
  const d = info.dur, tC = W0('confuso', info), sw = ease.inOut(prog(t, tC - 0.9, tC - 0.3)), cam = camPath(t, d, { z: 1.0 }, { z: 1.12 }, { hand: 3, seed: 4 });
  coffinInside(g, t, cam, { light: 0.2 });
  if (sw < 1) { g.save(); g.globalAlpha = 1 - sw; const h = clamp(t / (tC - 0.5)) * Math.PI / 3; relogio(g, E.W / 2, 860, 250, h, 1); text(g, '2 HORAS', E.W / 2, 1250, { size: 70, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, glow: 16, glowColor: 'rgba(255,150,60,.5)' }); g.restore(); }
  if (sw > 0) { const wob = Math.sin(t * 3) * 0.12, amt = 4 + 4 * Math.sin(t * 2.2); g.save(); g.globalAlpha = sw; blurLayer(g, amt * sw, (g) => bigFace(g, E.W / 2 + Math.sin(t * 2) * 30, E.H * 0.5, 300, { outfit: VOCE, expr: 'worried', blink: 0.4 + 0.3 * Math.sin(t * 4), look: [Math.sin(t * 3), 0.2], rimColor: '#ffb070', rimSide: 1, tilt: wob }), cam, 1); for (let i = 0; i < 3; i++) { const a = t * 2 + i * 2.1; ring(g, E.W / 2 + Math.cos(a) * 340, 560 + Math.sin(a) * 60, 18, 4, alpha(GOLD, 0.6)); } g.restore(); }
  veil(g, '#000', 0.15);
} });

// s19 — "E se você entrar em pânico e respirar rápido, isso chega ainda mais cedo." — respiração acelerada; CO2 sobe rápido
registerShot('s19', { draw(g, t, info) {
  const d = info.dur, tP = W0('pânico', info), cam0 = camPath(t, d, { z: 1.05 }, { z: 1.15 }, { hand: 7, seed: 6 }), cam = { ...cam0, z: cam0.z + punch(t, tP, 0.08) };
  coffinInside(g, t, cam, { light: 0.2 });
  const fast = t > tP ? 9 : 3, br = 0.5 + 0.5 * Math.sin(t * fast);
  layer(g, cam, 1, (g) => bigFace(g, E.W / 2 - 80, E.H * 0.5, 290, { outfit: VOCE, expr: t > tP ? 'scared' : 'worried', talk: br, blink: 0, look: [0.3, -0.5], rimColor: '#ffb070', rimSide: 1 }));
  if (t > tP) { for (let i = 0; i < 4; i++) { const k = ((t - tP) * 2 + i * 0.25) % 1; ring(g, E.W / 2 - 80, E.H * 0.5 + 120, 60 + k * 200, 4, alpha(CO2, 0.5 * (1 - k))); } g.save(); g.globalAlpha = 0.12 * br; g.fillStyle = '#ff3020'; g.fillRect(0, 0, E.W, E.H); g.restore(); }
  const v = clamp(0.35 + (t > tP ? (t - tP) * 0.22 : t * 0.02)); gauge(g, E.W - 160, 1200, 520, v, CO2, 'CO₂', `${(v * 6).toFixed(1).replace('.', ',')}%`, ease.out(prog(t, 0.2, 0.6)));
  const tc = W0('cedo', info); if (t > tc) text(g, 'MAIS CEDO', E.W / 2 - 80, 380, { size: 64, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tc, tc + 0.3)), glow: 16, glowColor: 'rgba(255,150,60,.5)' });
} });

// s20 — "Só que a sua família tinha medo exatamente disso." — flashback quente: a família à mesa
registerShot('s20', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.1, x: 30 }, { z: 1.18, x: -20 }, { hand: 3, seed: 7 });
  const { GY, CX } = bedroom(g, t, cam);
  layer(g, cam, 1, (g) => {
    rr(g, CX - 200, GY - 140, 400, 30, 6); g.fillStyle = '#4a3424'; g.fill(); g.fillRect(CX - 170, GY - 110, 20, 150); g.fillRect(CX + 150, GY - 110, 20, 150); candle(g, CX, GY - 140, t, 1.1);
    drawFigure(g, { x: CX - 300, y: GY + 40, s: 1.55, facing: 1, outfit: MAE, pose: breathe(posesAt(t, [[0, POSES.sit], [1.2, { ...POSES.sit, hF: [30, -150], eF: [24, -120] }]]), t, 0.6, 1), expr: 'worried', talk: Math.max(0, Math.sin(t * 9)) * (t < 1.4 ? 1 : 0), look: [1, 0], rim: rimOf(CANDLE, [1, -0.5]) });
    drawFigure(g, { x: CX + 300, y: GY + 40, s: 1.6, facing: -1, outfit: PAI, pose: breathe({ ...POSES.sit, head: [10, -176] }, t, 0.6, 2), expr: 'worried', talk: t > 1.4 ? Math.max(0, Math.sin(t * 8)) : 0, look: [-1, 0], rim: rimOf(CANDLE, [-1, -0.5]) });
  });
  g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = 'rgba(160,100,50,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  glow(g, E.W / 2, GY - 220, 600, CANDLE, 0.18);
  text(g, 'ANTES DO ENTERRO', E.W / 2, 330, { size: 36, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: 0.85 * ease.out(prog(t, 0.2, 0.6)) });
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.3 });
} });

// s21 — "Eles pagaram por um caixão de segurança." — o caixão especial: tubo e sino
registerShot('s21', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.02, y: 20 }, { z: 1.12, y: 50 }, { hand: 3, seed: 8 });
  const { GY, CX } = bedroom(g, t, cam);
  layer(g, cam, 1, (g) => {
    for (const x of [CX - 300, CX + 260]) { g.fillStyle = '#2a1e14'; g.fillRect(x, GY - 140, 30, 180); }
    coffinSide(g, CX - 380, GY - 140, 760, 170, { color: '#5a3a26' }); const tx = CX - 230;
    tubo(g, tx, GY - 300, GY - 640, '#9a9aa6', 22); postoSino(g, tx - 40, GY - 640, 1.4, 0.05 * Math.sin(t * 2));
    candle(g, CX + 380, GY - 140, t, 1.0);
  });
  glow(g, E.W / 2 + 380, GY - 260, 400, CANDLE, 0.16);
  labelTitle(g, t, 'CAIXÃO', 'DE SEGURANÇA', 400, { at: W0('segurança', info) - 0.4, big: 92 });
  bokeh(g, t, { count: 5, color: CANDLE, a: 0.1, seed: 4 }); FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.3 });
} });

// s22 — "Tem cordinhas amarradas nas suas mãos, nos seus pés e na sua cabeça." — blueprint, vista de cima
registerShot('s22', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, k = ease.inOut(t / info.dur);
  g.save(); zoomAt(g, E.W / 2, 900, 1 + 0.05 * k);
  const cx = E.W / 2, cy = 900; g.save(); g.translate(cx, cy); g.rotate(-Math.PI / 2); coffinTop(g, 0, 0, 1100, 420, 'rgba(0,0,0,0)', { stroke: bp, w: 5 }); g.restore();
  UI.lineFigure(g, { x: cx, y: cy + 420, s: 3.3, pose: { ...POSES.stand, hF: [60, -100], hB: [-60, -100], eF: [40, -140], eB: [-40, -140], fF: [26, 0], fB: [-26, 0] }, color: '#e8f0ff' });
  const ring0 = [cx, cy - 560]; circle(g, ring0[0], ring0[1], 26, alpha(GOLD, 0.25)); ring(g, ring0[0], ring0[1], 26, 5, GOLD);
  const ends = [['mãos', [[cx + 198, cy + 90], [cx - 198, cy + 90]]], ['pés', [[cx + 86, cy + 420], [cx - 86, cy + 420]]], ['cabeça', [[cx, cy - 290]]]];
  ends.forEach(([w, pts]) => { const tw = W0(w, info), p = ease.out(prog(t, tw - 0.1, tw + 0.5)); if (p <= 0) return; pts.forEach(([x, y]) => { g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.lineTo(lerp(x, ring0[0], p), lerp(y, ring0[1], p)); g.stroke(); circle(g, x, y, 12, GOLD); }); });
  g.restore();
  bpTitle(g, 'AS CORDINHAS', 330, ease.out(prog(t, 0.1, 0.5)));
} });

// s23 — "Elas sobem por um tubo… até um sino em cima do seu túmulo." — o tubo atravessa a terra até o sino
registerShot('s23', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.1, y: 140 }, { z: 1.0, y: -40 }, { hand: 3, seed: 9 });
  const tx = E.W / 2 - 190, { sy, cy } = (() => { let r; r = underground(g, t, cam, { sy: 620, cy: 1500 }); return r; })();
  const tS = W0('sino', info), up = ease.inOut(prog(t, 0.3, tS));
  layer(g, cam, 1, (g) => {
    tubo(g, tx, cy - 150, sy - 40, '#9a9aa6', 26);
    g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.moveTo(tx, cy - 150); g.lineTo(tx, lerp(cy - 150, sy - 220, up)); g.stroke(); glow(g, tx, lerp(cy - 150, sy - 220, up), 60, GOLD, 0.6 * (1 - prog(t, tS, tS + 0.5)));
    postoSino(g, tx - 40, sy - 40, 1.3, t > tS ? 0.12 * Math.sin((t - tS) * 10) * Math.exp(-(t - tS) * 2) : 0);
    g.fillStyle = '#120c08'; g.fillRect(E.W / 2 - 254, cy - 134, 508, 118); deitado(g, E.W / 2 - 20, cy - 40, 0.55, VOCE, { blink: 0 });
  });
  if (t > tS) glow(g, tx + 20, sy - 300, 160, GOLD, 0.3 * (1 - prog(t, tS, tS + 1)));
  FX.dust(g, t, { count: 30, color: '#d8c0a0', a: 0.25 });
} });
