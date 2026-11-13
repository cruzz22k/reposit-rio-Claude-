// shots/01_2d.js — todas as tomadas 2D (as 3D estão em 02_3d.js).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, backdrop, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { wasp, dragonfly, waspFace, dragonFace, fly, beetle, lion, zebra, sky, lake, garden, savanna, lab, SKY, RIM } from '../sets/bugs.js';
import { labelTitle, cross, ground } from '../sets/common.js';
import { VESPA, LIBELULA, GOLD } from '../cast.js';

const U = () => S().ui;
function zoomAt(g, cx, cy, z) { g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); }
const blurSky = (g, t, z = 1.4) => { blurLayer(g, 14, (g) => sky(g, t, { z, y: -120 })); veil(g, '#140a14', 0.25); };
const bob = (t, a = 10, f = 2.2, p = 0) => Math.sin(t * f + p) * a;
const hex = (g, cx, cy, r, c, w = 2) => { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); for (let a = 0; a < 6; a++) g.lineTo(cx + Math.cos(a * Math.PI / 3) * r, cy + Math.sin(a * Math.PI / 3) * r); g.closePath(); g.stroke(); };
const mosaic = (g, a = 0.12) => { for (let j = 0; j < 40; j++) for (let i = 0; i < 24; i++) hex(g, i * 52 + (j % 2) * 26, j * 45, 26, alpha('#9ff0ea', a), 1.5); };

// s02 — "Você é uma vespa."
registerShot('s02', { draw(g, t, info) {
  blurSky(g, t); waspFace(g, E.W / 2, E.H * 0.57, 300 * (1 + 0.04 * t), { expr: 'smirk', look: [0.2, 0], t });
  labelTitle(g, t, 'VOCÊ É UMA', 'VESPA', 330, { at: 0.5, big: 100 });
} });

// s03 — "Tem ferrão. Tem veneno."
registerShot('s03', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); sky(g, t, { z: 1.2, x: -30 * k });
  g.save(); zoomAt(g, 540, 900, 1 + 0.05 * k);
  const x = 680, y = 900 + bob(t, 8), s = 3.6, tipX = x + (-22 - 102) * s, tipY = y + (6 + 14) * s;
  wasp(g, x, y, s, { t, expr: 'smirk', look: [0.4, 0], stingGlow: t > 0.35 ? 0.6 : 0 });
  if (t > 1.1) { const d = (t - 1.1) * 260; g.fillStyle = '#c8f070'; g.beginPath(); g.ellipse(tipX - 6, tipY + 20 + d, 9, 13, 0, 0, 7); g.fill(); glow(g, tipX - 6, tipY + 20 + d, 40, '#c8f070', 0.5); }
  g.restore();
  UI.callout(g, t, { at: [tipX + 20, tipY], to: [300, 660], str: 'FERRÃO', color: GOLD, start: 0.35, size: 44 });
  UI.callout(g, t, { at: [tipX + 10, tipY + 60], to: [300, 1200], str: 'VENENO', color: '#c8f070', start: 1.1, size: 44 });
} });

// s04 — "Quase todo bicho do seu tamanho foge de você."
registerShot('s04', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.06, x: -20 + 50 * k }, { GY, CX } = garden(g, t, cam);
  layer(g, cam, 1, (g) => {
    const run = ease.out(prog(t, 0.4, info.dur));
    for (let i = 0; i < 4; i++) fly(g, CX - 40 + i * 120 + run * 700 + bob(t, 20, 9, i), 620 + i * 110 + bob(t, 30, 5, i), 2.4, t);
    for (let i = 0; i < 2; i++) beetle(g, CX + 40 + i * 180 + run * 600, GY + 140 + i * 40, 2.8, t, ['#3a6a4a', '#7a4a6a'][i]);
    wasp(g, lerp(-200, CX - 220, ease.out(prog(t, 0, 1))), 900 + bob(t, 14), 2.6, { t, expr: 'smirk', look: [1, 0] });
  });
  FX.speedLines(g, t, { cx: E.W * 0.75, cy: 850, count: 26, a: 0.12 });
} });

// s06 — "Lá no alto, você vê uma libélula"
registerShot('s06', { draw(g, t, info) {
  blurSky(g, t); waspFace(g, E.W / 2, E.H * 0.6, 300 * (1 + 0.04 * t), { expr: t < 0.7 ? 'neutral' : 'surprised', look: [0.2, -1], t });
  const a = ease.out(prog(t, 0.6, 1.1)); g.save(); g.globalAlpha *= a; dragonfly(g, E.W * 0.7, 330 + bob(t, 8), 0.9, { t, look: [-0.5, 0.5] }); g.restore();
} });

// s08 — "Parece inofensiva. Ela não é."
registerShot('s08', { draw(g, t, info) {
  blurSky(g, t, 1.5); const turn = t > 1.45, sh = turn && t < 1.8 ? shake(t, 6, 25) : [0, 0];
  dragonFace(g, E.W / 2 + sh[0], E.H * 0.56 + sh[1], 290 * (1 + 0.04 * t), { expr: turn ? 'angry' : 'smile', look: turn ? [0, 0.1] : [0.3, -0.2] });
} });

// s09 — "Cada olho dela tem cerca de 30 mil lentes."
registerShot('s09', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = U(), k = ease.inOut(t / info.dur), cx = E.W / 2, cy = 960, R = 290;
  g.save(); zoomAt(g, cx, cy, 1 + 0.15 * k);
  circle(g, cx, cy, R, alpha('#3fd0c8', 0.12)); ring(g, cx, cy, R, 5, '#3fd0c8');
  g.save(); g.beginPath(); g.arc(cx, cy, R - 4, 0, 7); g.clip();
  const shown = ease.inOut(prog(t, 0.2, 1.6));
  for (let j = -14; j <= 14; j++) for (let i = -14; i <= 14; i++) { const hx = cx + i * 27 + (j % 2) * 13.5, hy = cy + j * 23.4; if (Math.hypot(hx - cx, hy - cy) > R * shown) continue; hex(g, hx, hy, 13.5, alpha('#9ff0ea', 0.55), 1.5); }
  g.restore(); g.restore();
  labelTitle(g, t, 'CADA OLHO', 'TEM CERCA DE', 300, { at: 0.1, big: 46 });
  const n = Math.round(30000 * ease.out(prog(t, 1.55, 2.3)));
  if (t > 1.55) { text(g, n.toLocaleString('pt-BR'), cx, 480, { size: 104, color: GOLD, glow: 22, glowColor: alpha(GOLD, 0.6) }); text(g, 'LENTES', cx, 565, { size: 40, color: u.cream, font: FONTS.ui, weight: 900, spacing: 8 }); }
} });

// ícone de libélula vista de cima (blueprint)
function topFly(g, x, y, s, c, ang = -Math.PI / 2) {
  g.save(); g.translate(x, y); g.rotate(ang + Math.PI / 2); g.scale(s, s);
  g.strokeStyle = c; g.lineWidth = 3; for (const [sx, dy, l] of [[-1, -6, 90], [1, -6, 90], [-1, 10, 84], [1, 10, 84]]) { g.beginPath(); g.ellipse(sx * l / 2 + sx * 8, dy, l / 2, 9, 0, 0, 7); g.stroke(); }
  seg(g, [[0, 10], [0, 130]], 6, c); circle(g, -9, -24, 10, c); circle(g, 9, -24, 10, c); g.restore();
}
// s10 — "Os dois juntos enxergam quase 360 graus: frente, pros lados e pra trás, ao mesmo tempo."
registerShot('s10', { draw(g, t, info) {
  UI.blueprint(g); const u = U(), cx = E.W / 2, cy = 900, k = ease.inOut(t / info.dur);
  const span = lerp(Math.PI * 0.6, Math.PI * 1.96, ease.inOut(prog(t, 0.6, 2.6)));
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = g.createRadialGradient(cx, cy, 30, cx, cy, 420); g.fillStyle.addColorStop(0, 'rgba(63,208,200,.35)'); g.fillStyle.addColorStop(1, 'rgba(63,208,200,0)');
  g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, 420, -Math.PI / 2 - span / 2, -Math.PI / 2 + span / 2); g.closePath(); g.fill(); g.restore();
  g.strokeStyle = alpha('#3fd0c8', 0.8); g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 420, -Math.PI / 2 - span / 2, -Math.PI / 2 + span / 2); g.stroke();
  topFly(g, cx, cy + 30, 1.6, u.cream);
  const n = Math.round(360 * clamp(span / (Math.PI * 1.96)) * 0.98 + 7);
  text(g, `${Math.min(360, n)}°`, cx, 330, { size: 110, color: GOLD, glow: 22, glowColor: alpha(GOLD, 0.6), alpha: ease.out(prog(t, 0.5, 0.9)) });
  for (const [lab, at, x, y] of [['FRENTE', 3.5, cx, 420], ['LADOS', 4.25, cx - 380, cy + 10], ['LADOS', 4.25, cx + 380, cy + 10], ['TRÁS', 4.9, cx, cy + 470]]) text(g, lab, x, y, { size: 38, color: u.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, at, at + 0.3)) });
} });

// s11 — "Ela já te viu antes de você vê-la."
registerShot('s11', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05 + 0.04 * k }; sky(g, t, cam);
  layer(g, cam, 0.5, (g) => { const x = 260, y = 420 + bob(t, 6); dragonfly(g, x, y, 0.9, { t, look: [1, 0.6], expr: 'determined' }); if (t > 0.2) { FX.sparkle(g, x + 44, y - 10, 30 * (1 - prog(t, 0.2, 1.2)) + 8, '#bff8f4', 0.9); FX.rings(g, x + 44, y - 10, t - 0.2, { count: 2, r0: 20, r1: 140, speed: 1.2, color: '#9ff0ea', a: 0.4 }); } });
  layer(g, cam, 1, (g) => wasp(g, 720, 1050 + bob(t, 12), 3.0, { t, expr: 'happy', look: [1, 0] }));
} });

// s12 — "E ela não vem atrás de você como um leão correndo atrás de uma zebra."
registerShot('s12', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05, x: -40 + 80 * k }, { GY } = savanna(g, t, cam);
  layer(g, cam, 1, (g) => { const zx = 560 + t * 60, lx = 180 + t * 75; zebra(g, zx, GY + 10, 2.1, t * 12); lion(g, lx, GY + 10, 2.0, t * 13);
    g.setLineDash([12, 12]); g.strokeStyle = alpha('#fff0c8', 0.6); g.lineWidth = 4; g.beginPath(); g.moveTo(lx + 160, GY - 160); g.quadraticCurveTo((lx + zx) / 2 + 60, GY - 260, zx + 100, GY - 220); g.stroke(); g.setLineDash([]); });
  cross(g, E.W / 2, 560, 150, U().accent, prog(t, 2.5, 2.9));
} });

// s13 — "Ela calcula onde você vai estar e voa direto para esse ponto."
registerShot('s13', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = U();
  const P = (q) => [lerp(120, 960, q), 640 - Math.sin(q * Math.PI) * 180];
  g.setLineDash([14, 12]); g.strokeStyle = alpha(GOLD, 0.6); g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 40; i++) g.lineTo(...P(i / 40)); g.stroke(); g.setLineDash([]);
  const q = 0.08 + 0.28 * ease.inOut(prog(t, 0, info.dur)), [wx, wy] = P(q); wasp(g, wx, wy, 1.1, { t, expr: 'neutral', look: [1, 0] });
  const tgt = P(0.62), a = ease.outBack(prog(t, 1.05, 1.4));
  if (a > 0) { g.save(); g.translate(...tgt); g.scale(a, a); cross(g, 0, 0, 44, GOLD, 1); ring(g, 0, 0, 70, 3, alpha(GOLD, 0.6)); g.restore(); text(g, 'ONDE VOCÊ VAI ESTAR', tgt[0], tgt[1] - 110, { size: 32, color: GOLD, font: FONTS.ui, weight: 900, spacing: 3, alpha: a }); }
  const dp = ease.inOut(prog(t, 2.4, 3.8)), d0 = [300, 1250], dx = lerp(d0[0], tgt[0], dp), dy = lerp(d0[1], tgt[1], dp);
  if (t > 2.4) { seg(g, [d0, [dx, dy]], 5, '#3fd0c8'); }
  dragonfly(g, dx, dy, 0.9, { t, look: [1, -1], expr: 'determined' });
  text(g, 'LINHA RETA', 300, 1330, { size: 30, color: '#3fd0c8', font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 2.5, 2.9)) });
} });

// s14 — "Ela mantém você sempre no mesmo lugar da visão dela, chegando mais perto e mais perto,"
registerShot('s14', { draw(g, t, info) {
  sky(g, t, { z: 1.3, x: -200 + t * 60, y: -100 + Math.sin(t) * 40 }, { trees: true });
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(160,230,220,1)'; g.fillRect(0, 0, E.W, E.H); g.restore(); mosaic(g, 0.14);
  const cx = E.W / 2, cy = 820, s = 0.8 + 0.9 * ease.inOut(prog(t, 2.9, 3.6)) + 1.2 * ease.inOut(prog(t, 4.2, 5.0)) + 0.06 * t;
  wasp(g, cx + bob(t, 6, 3), cy + bob(t, 6, 2.5), s, { t, expr: 'neutral', look: [1, 0] });
  ring(g, cx, cy, 160 + s * 40, 4, alpha(GOLD, 0.8)); for (const a of [0, 1, 2, 3]) { const an = a * Math.PI / 2; seg(g, [[cx + Math.cos(an) * (130 + s * 40), cy + Math.sin(an) * (130 + s * 40)], [cx + Math.cos(an) * (200 + s * 40), cy + Math.sin(an) * (200 + s * 40)]], 4, GOLD); }
  text(g, 'MESMO LUGAR', cx, 330, { size: 40, color: U().cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 0.6, 1.0)) });
} });

// s15 — "até a rota de vocês dois se cruzar."
registerShot('s15', { draw(g, t, info) {
  UI.blueprint(g); const p = ease.inOut(prog(t, 0.1, 1.55)), X = [540, 820];
  seg(g, [[100, 560], [lerp(100, X[0], p), lerp(560, X[1], p)]], 6, GOLD); seg(g, [[300, 1300], [lerp(300, X[0], p), lerp(1300, X[1], p)]], 6, '#3fd0c8');
  if (t > 1.55) { const f = 1 - prog(t, 1.55, 2.0); glow(g, X[0], X[1], 400, '#ffffff', 0.8 * f); FX.rings(g, X[0], X[1], t - 1.55, { count: 3, r0: 30, r1: 400, speed: 1.5, color: '#ffffff', a: 0.6 }); }
  text(g, 'VESPA', 140, 520, { size: 34, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, align: 'left' }); text(g, 'LIBÉLULA', 300, 1350, { size: 34, color: '#3fd0c8', font: FONTS.ui, weight: 900, spacing: 4 });
} });

// s16 — "Ela vem por baixo e por trás, bem no ponto em que você não consegue enxergar."
registerShot('s16', { draw(g, t, info) {
  UI.blueprint(g); const u = U(), wx = 640, wy = 700;
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,240,200,.12)'; g.beginPath(); g.moveTo(wx + 60, wy - 20); g.arc(wx + 60, wy - 20, 520, -1.2, 0.9); g.closePath(); g.fill(); g.restore();
  const ba = ease.out(prog(t, 0.3, 0.8)); g.fillStyle = alpha(u.accent, 0.28 * ba); g.beginPath(); g.moveTo(wx - 40, wy + 40); g.arc(wx - 40, wy + 40, 600, 1.75, 2.75); g.closePath(); g.fill();
  g.strokeStyle = alpha(u.accent, 0.7 * ba); g.lineWidth = 3; g.beginPath(); g.moveTo(wx - 40, wy + 40); g.arc(wx - 40, wy + 40, 600, 1.75, 2.75); g.closePath(); g.stroke();
  wasp(g, wx, wy, 2.2, { t, expr: 'neutral', look: [1, 0] });
  text(g, 'PONTO CEGO', 250, 1180, { size: 44, color: u.accent, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 2.6, 3.0)) });
  const p = ease.inOut(prog(t, 0.6, 3.6)); dragonfly(g, lerp(-120, wx - 260, p), lerp(1500, wy + 260, p), 1.2, { t, look: [1, -1], expr: 'determined' });
  text(g, 'VISÃO DA VESPA', 900, 520, { size: 26, color: alpha(u.cream, 0.8), font: FONTS.ui, weight: 900, spacing: 3 });
} });

// s17 — "Pra ela, o céu claro faz você parecer uma manchinha escura. Impossível de perder."
registerShot('s17', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  backdrop(g, ['#bcd8f0', '#e8eef4', '#fff4e0']); glow(g, E.W * 0.75, 300, 600, '#ffffff', 0.7); mosaic(g, 0.1);
  const cx = E.W / 2 + bob(t, 20, 0.8), cy = 760 + bob(t, 14, 1.1), s = 0.7 + 0.2 * k;
  g.save(); g.translate(cx, cy); g.scale(s, s); g.globalAlpha = 0.92; wasp(g, 0, 0, 1.4, { t, expr: 'neutral' }); g.restore();
  g.save(); g.globalCompositeOperation = 'source-atop'; g.restore();
  const lock = ease.outBack(prog(t, 3.35, 3.7)); if (lock > 0) { ring(g, cx, cy, 150 / lock, 6, alpha(U().accent, 0.9)); ring(g, cx, cy, 110 / lock, 2, alpha(U().accent, 0.6)); }
  text(g, 'CÉU CLARO', E.W / 2, 330, { size: 40, color: '#2a3048', font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.2, 0.6)) });
} });

// s18 — "Você nem percebe que está sendo caçada."
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05, x: 60 * k }; sky(g, t, cam);
  layer(g, cam, 1, (g) => { wasp(g, 640 + t * 40, 760 + bob(t, 12), 2.6, { t, expr: 'happy', look: [1, -0.2] }); g.save(); g.globalAlpha = 0.85; dragonfly(g, 250 + t * 50, 1180 + bob(t, 8, 1.5), 1.9, { t, look: [1, -1], expr: 'determined' }); g.restore(); });
} });

// s20 — "Para no ar, sobe reto, dá meia-volta, voa até de ré."
registerShot('s20', { draw(g, t, info) {
  UI.blueprint(g); const u = U();
  let x = 300, y = 900, f = 1;
  if (t < 0.75) y += bob(t, 6, 6);
  else if (t < 1.6) y = 900 - ease.inOut(prog(t, 0.75, 1.6)) * 380;
  else if (t < 2.95) { const a = ease.inOut(prog(t, 1.6, 2.95)) * Math.PI; x = 300 + 300 * Math.sin(a); y = 520 + 180 * (1 - Math.cos(a)); f = a > Math.PI / 2 ? -1 : 1; }
  else { f = -1; y = 880; x = lerp(300, 650, ease.inOut(prog(t, 3.0, 3.8))); }
  dragonfly(g, x, y, 1.3, { t, facing: f, look: [1, 0], expr: 'determined' });
  for (const [lab, at, lx, ly] of [['PARA NO AR', 0.15, 300, 1080], ['SOBE', 0.9, 620, 700], ['MEIA-VOLTA', 1.75, 780, 420], ['DE RÉ', 3.15, 760, 1080]]) text(g, lab, lx, ly, { size: 44, color: GOLD, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, at, at + 0.3)) });
} });

// s21 — "Pode passar de 50 quilômetros por hora."
registerShot('s21', { draw(g, t, info) {
  sky(g, t, { z: 1.3, x: -t * 500 });
  FX.speedLines(g, t, { cx: E.W / 2, cy: 900, count: 50, a: 0.3, inner: 300 });
  for (let i = 3; i >= 1; i--) { g.save(); g.globalAlpha = 0.15 * (4 - i); dragonfly(g, E.W / 2 - i * 70, 900, 2.0, { t, look: [1, 0], expr: 'determined' }); g.restore(); }
  dragonfly(g, E.W / 2, 900 + bob(t, 5, 8), 2.0, { t, look: [1, 0], expr: 'determined' });
  UI.readout(g, { value: '50 KM/H', x: E.W / 2, y: 340, align: 'center', size: 110, color: GOLD, a: ease.out(prog(t, 1.0, 1.3)) });
} });

// s22 / s23 — o placar dos ataques
function board(g, t, showLion, tL = 0) {
  UI.blueprint(g); const u = U(), bp = UI.bpStroke();
  labelTitle(g, t + 2, 'EM TESTES DE', 'LABORATÓRIO', 300, { at: 0, big: 64 });
  const row = (y, lab, frac, val, c, at) => {
    const p = ease.out(prog(t, at, at + 0.6));
    text(g, lab, 120, y - 70, { size: 40, color: c, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
    rr(g, 120, y - 28, 840, 56, 28); g.fillStyle = alpha(c, 0.12); g.fill(); rr(g, 120, y - 28, Math.max(56, 840 * frac * p), 56, 28); g.fillStyle = c; g.fill();
    if (p > 0.05) text(g, val, 120 + 840 * frac * p - 10, y + 80, { size: 64, color: c, align: 'right', glow: 14, glowColor: alpha(c, 0.6) });
  };
  row(640, 'LIBÉLULAS', 0.95, '95%', '#3fd0c8', showLion ? -1 : 3.0);
  const grid = (y, n, hit, c, at) => { for (let i = 0; i < n; i++) { const x = 160 + (i % 10) * 82, yy = y + Math.floor(i / 10) * 70, a = ease.out(prog(t, at + i * 0.03, at + 0.2 + i * 0.03)); if (a <= 0) continue; ring(g, x, yy, 24, 3, alpha(c, 0.6 * a)); if (i < hit) circle(g, x, yy, 13, alpha(c, a)); else cross(g, x, yy, 14, U().accent, a); } };
  if (!showLion) grid(860, 20, 19, '#3fd0c8', 3.3);
  if (showLion) { row(1050, 'LEÃO', 0.25, '1 EM 4', '#ffb070', tL); grid(860, 4, 1, '#ffb070', tL + 0.3); }
}
registerShot('s22', { draw(g, t, info) { board(g, t, false); } });
registerShot('s23', { draw(g, t, info) { board(g, t, true, 1.3); } });

// s24 — "Então, de repente, você sente:"
registerShot('s24', { draw(g, t, info) {
  blurSky(g, t); const sh = t > 0.6 ? shake(t, 10 * (1 - prog(t, 0.6, 1.4)), 25) : [0, 0];
  waspFace(g, E.W / 2 + sh[0], E.H * 0.57 + sh[1], 300 * (1 + 0.04 * t), { expr: t < 0.6 ? 'neutral' : 'shocked', look: [0, 0], t });
} });

// s25 — "seis pernas cheias de espinhos se fecham em volta de você, formando uma cestinha."
registerShot('s25', { draw(g, t, info) {
  blurSky(g, t, 1.6); const k = ease.inOut(t / info.dur), L = ease.inOut(prog(t, 0.5, 2.6));
  g.save(); zoomAt(g, 560, 900, 1.05 + 0.1 * k);
  wasp(g, 640, 820, 3.0, { t, expr: L > 0.5 ? 'scared' : 'shocked', look: [-0.6, 0.6] });
  dragonfly(g, 380, 1080, 3.2, { t, legs: L, look: [1, -0.6], expr: 'determined' });
  g.restore();
  text(g, '6 PERNAS', E.W / 2, 330, { size: 52, color: GOLD, spacing: 4, alpha: ease.out(prog(t, 0.2, 0.6)), glow: 16, glowColor: alpha(GOLD, 0.5) });
} });

// s26 — "Você tenta virar o ferrão, mas ela já está segurando você pelo lado certo."
registerShot('s26', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); sky(g, t, { z: 1.25, x: -40 * k });
  g.save(); zoomAt(g, 540, 900, 1.05 + 0.05 * k);
  const curl = Math.max(0, Math.sin(t * 3)) * 0.9;
  dragonfly(g, 420, 1010, 3.0, { t, legs: 1, look: [1, -0.4], expr: 'determined' });
  wasp(g, 640 + shake(t, 6, 20)[0], 800, 2.8, { t, curl, expr: 'angry', look: [-1, 0.6] });
  g.restore();
} });

// s27 — "As mandíbulas dela mordem, e, dependendo do tamanho da presa, ela come você ali mesmo, no meio do voo."
registerShot('s27', { draw(g, t, info) {
  if (t < 3.5) { blurSky(g, t, 1.6); const b = Math.abs(Math.sin(Math.max(0, t - 0.6) * 4)); dragonFace(g, E.W / 2, E.H * 0.56, 300 * (1 + 0.03 * t), { expr: 'angry', bite: t > 0.6 ? b : 0, look: [0, 0.3] }); return; }
  const tt = t - 3.5; sky(g, t, { z: 1.1, x: -tt * 80 });
  dragonfly(g, lerp(400, 900, tt / 2.4), 820 + bob(t, 8), 1.6, { t, legs: 0.8, look: [1, 0], expr: 'determined' });
} });

// s28 — "As suas listras amarelas e pretas, que avisam todo mundo que você é perigosa?"
registerShot('s28', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); blurSky(g, t, 1.6);
  g.save(); zoomAt(g, 540, 900, 1 + 0.06 * k); g.translate(540, 900); g.rotate(-0.12);
  g.beginPath(); g.ellipse(0, 0, 470, 300, 0, 0, 7); g.fillStyle = VESPA.yellow; g.fill(); g.save(); g.clip(); for (let i = 0; i < 5; i++) { g.fillStyle = S().ink; g.fillRect(-470 + 60 + i * 190, -320, 90, 640); } g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(-500, 140, 1000, 200); g.restore();
  const pulse = 0.4 + 0.4 * Math.max(0, Math.sin(t * 5)); glow(g, 0, 0, 600, '#ffd040', 0.25 * pulse);
  g.restore();
  labelTitle(g, t, 'LISTRAS DE', 'PERIGO', 300, { at: 0.5, big: 96 });
} });

// s29 — "Num estudo, as libélulas ficaram só um pouco mais desconfiadas de alvos com formato de vespa. Quase nada."
registerShot('s29', { draw(g, t, info) {
  UI.blueprint(g); const u = U();
  labelTitle(g, t, 'DESCONFIANÇA DA LIBÉLULA', 'NUM ESTUDO', 300, { at: 0.1, big: 56 });
  const col = (x, lab, v, draw) => { ring(g, x, 640, 120, 3, alpha(u.blueprint, 0.6)); draw(x, 640); text(g, lab, x, 800, { size: 34, color: u.cream, font: FONTS.ui, weight: 900, spacing: 3 }); const p = ease.out(prog(t, 2.3, 3.6)); rr(g, x - 50, 1240 - 360 * v * p, 100, 360 * v * p, 12); g.fillStyle = alpha('#3fd0c8', 0.8); g.fill(); seg(g, [[x - 90, 1240], [x + 90, 1240]], 3, u.blueprint); };
  col(320, 'MOSCA', 0.42, (x, y) => fly(g, x - 10, y, 4, t));
  col(760, 'VESPA', 0.5, (x, y) => wasp(g, x + 20, y, 1.4, { t, expr: 'neutral' }));
  const a = ease.outBack(prog(t, 5.05, 5.4)); if (a > 0) { g.save(); g.translate(E.W / 2, 1360); g.scale(a, a); text(g, 'QUASE NADA', 0, 0, { size: 60, color: GOLD, glow: 16, glowColor: alpha(GOLD, 0.6) }); g.restore(); }
} });

// s30 — "E ela não para."
registerShot('s30', { draw(g, t, info) { blurSky(g, t); dragonFace(g, E.W / 2, E.H * 0.56, 300 * (1 + 0.05 * t), { expr: 'smirk', look: [0.4, 0] }); } });

// s31 — "Uma pesquisadora de Harvard viu uma libélula comer 30 moscas seguidas, e ela só parou porque a comida acabou."
registerShot('s31', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.05 * k, x: 60 }, { GY, CX, M, top } = lab(g, t, cam);
  layer(g, cam, 1, (g) => {
    rr(g, CX - 340, top - 420, 560, 420, 10); g.fillStyle = 'rgba(190,230,255,.08)'; g.fill(); g.strokeStyle = 'rgba(210,240,255,.5)'; g.lineWidth = 4; g.stroke();
    const n = Math.min(30, Math.floor(ease.inOut(prog(t, 2.5, 4.9)) * 30)), left = 30 - n, r = rng(3);
    for (let i = 0; i < Math.min(left, 12); i++) fly(g, CX - 300 + r() * 480, top - 380 + r() * 300 + bob(t, 10, 6, i), 1.3, t);
    dragonfly(g, CX - 60 + bob(t, 60, 1.5), top - 230 + bob(t, 30, 2.3), 1.1, { t, legs: 0.6, look: [1, 0], expr: 'determined' });
    drawFigure(g, { x: CX + 360, y: GY + 20, s: 2.3, facing: -1, outfit: { top: 'labcoat', face: 'glasses', head: 'bun' }, pose: breathe({ ...POSES.holdFront }, t, 0.5, 2), prop: 'tablet', expr: t > 5 ? 'surprised' : 'thinking', look: [-1, 0], rim: { color: '#cfe0ff', dir: [-1, -0.5], w: 5 } });
    UI.readout(g, { label: 'MOSCAS', value: String(n), x: CX - 60, y: top - 520, align: 'center', size: 90, color: GOLD, a: ease.out(prog(t, 2.4, 2.7)) });
  });
  text(g, 'HARVARD', E.W / 2, 300, { size: 34, color: U().cream, font: FONTS.ui, weight: 900, spacing: 10, alpha: ease.out(prog(t, 0.9, 1.3)) });
} });

// s32 — "Isso tudo é fruto de mais de 300 milhões de anos de evolução."
registerShot('s32', { draw(g, t, info) {
  UI.blueprint(g); const u = U(), y = 1000, p = ease.inOut(prog(t, 0.2, 2.2));
  seg(g, [[100, y], [lerp(100, 980, p), y]], 5, u.blueprint);
  for (let i = 0; i <= 6; i++) { const x = 100 + i * 880 / 6; if (x > lerp(100, 980, p)) break; seg(g, [[x, y - 16], [x, y + 16]], 4, u.blueprint); }
  for (let i = 0; i < 4; i++) { const q = i / 3, a = ease.out(prog(t, 0.4 + i * 0.4, 0.8 + i * 0.4)); if (a <= 0) continue; g.save(); g.globalAlpha = a; topFly(g, 130 + q * 820, y - 160, 1.25 - q * 0.45, mix(u.blueprint, '#3fd0c8', q), -Math.PI / 2); g.restore(); }
  text(g, 'HÁ 300 M', 120, y + 70, { size: 26, color: alpha(u.cream, 0.7), font: FONTS.ui, weight: 900, align: 'left' }); text(g, 'HOJE', 960, y + 70, { size: 26, color: alpha(u.cream, 0.7), font: FONTS.ui, weight: 900, align: 'right' });
  labelTitle(g, t, 'MAIS DE', '300 MILHÕES', 400, { at: 1.85, big: 96 });
  text(g, 'DE ANOS DE EVOLUÇÃO', E.W / 2, 500, { size: 36, color: u.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 2.6, 3.0)) });
} });

// s34 — "Mas a natureza tem uma reviravolta."
registerShot('s34', { draw(g, t, info) { blurSky(g, t); waspFace(g, E.W / 2, E.H * 0.57, 300 * (1 + 0.05 * t), { expr: t < 0.7 ? 'thinking' : 'determined', look: [0, 0], t }); } });

// s35 — "Às vezes, quem caça é você."
registerShot('s35', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); sky(g, t, { z: 1.1, x: 40 * k });
  const p = ease.in(prog(t, 0.3, 2.2)); dragonfly(g, 760 + bob(t, 8), 760, 1.8, { t, facing: -1, look: [1, 0], expr: p > 0.3 ? 'shocked' : 'neutral' });
  wasp(g, lerp(120, 520, p), 1040 - 200 * p, 2.4, { t, expr: 'angry', look: [1, -0.4] });
  if (p > 0.2) FX.speedLines(g, t, { cx: 400, cy: 950, count: 24, a: 0.15 });
  labelTitle(g, t, 'QUEM CAÇA', 'É VOCÊ', 330, { at: 1.4, big: 100 });
} });

// s36 — "Já registraram vespas atacando libélulas e arrancando pedaços delas no ar."
registerShot('s36', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); sky(g, t, { z: 1.2, x: -30 * k });
  const sh = shake(t, 5, 14); g.save(); g.translate(sh[0], sh[1]);
  dragonfly(g, 560, 900, 2.4, { t, look: [-1, -0.4], expr: 'shocked', wingAmp: 0.9 });
  wasp(g, 640, 700, 2.3, { t, expr: 'angry', look: [-0.5, 1], curl: 0.5 * Math.max(0, Math.sin(t * 6)) });
  g.restore();
  if (t > 2.4) { const d = t - 2.4; g.save(); g.translate(700 + d * 260, 640 - d * 300 + d * d * 260); g.rotate(d * 5); g.fillStyle = 'rgba(200,240,255,.45)'; g.beginPath(); g.ellipse(0, 0, 40, 12, 0, 0, 7); g.fill(); g.restore(); }
} });

// s37 — "Então me diz:"
registerShot('s37', { draw(g, t, info) { blurSky(g, t); waspFace(g, E.W / 2, E.H * 0.57, 300 * (1 + 0.05 * t), { expr: 'thinking', look: [0, 0.05], t }); } });

// s38 — "se você fosse a vespa, tentaria fugir ou atacaria primeiro?"
registerShot('s38', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); sky(g, t, { z: 1.1 + 0.05 * k });
  wasp(g, 560, 900 + bob(t, 10), 2.8, { t, expr: t < 2.6 ? 'thinking' : 'determined', look: t < 2.0 ? [-1, 0] : [1, 0] });
  dragonfly(g, 880, 560 + bob(t, 6), 1.1, { t, facing: -1, look: [1, 0.4], expr: 'determined' });
  text(g, 'FUGIR?', 220, 520, { size: 64, color: '#5fe0d8', alpha: ease.out(prog(t, 1.9, 2.2)), glow: 14, glowColor: 'rgba(95,224,216,.5)' });
  text(g, 'ATACAR?', 760, 1240, { size: 64, color: '#ffb070', alpha: ease.out(prog(t, 2.65, 2.95)), glow: 14, glowColor: 'rgba(255,176,112,.5)' });
} });

// s39 — "Comenta aí." — tela final
registerShot('s39', { draw(g, t, info) {
  const u = U();
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#070b18', '#0b1224', '#2a1a34']); g.fillRect(0, 0, E.W, E.H);
  FX.stars(g, t, { count: 90, area: [0, 0, E.W, E.H * 0.4] }); glow(g, E.W / 2, E.H * 0.95, E.W * 0.7, '#ff9a5a', 0.2);
  const a1 = ease.out(prog(t, 0.1, 0.5));
  text(g, 'Se você fosse a vespa,', E.W / 2, 330, { size: 64, font: FONTS.serif, weight: 900, italic: true, color: u.cream, alpha: a1, glow: 18, glowColor: 'rgba(255,170,90,.5)' });
  text(g, 'fugiria ou atacaria?', E.W / 2, 420, { size: 72, font: FONTS.serif, weight: 900, italic: true, color: GOLD, alpha: a1, glow: 18, glowColor: 'rgba(255,170,90,.5)' });
  [['FUGIR', '#5fe0d8', 0.35], ['ATACAR', '#ffb070', 0.5]].forEach(([lab, c, at], i) => { const p = ease.outBack(prog(t, at, at + 0.4)); if (p <= 0) return; g.save(); g.translate(E.W / 2 + (i ? 230 : -230), 590); g.scale(p, p); rr(g, -200, -50, 400, 100, 50); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); text(g, lab, 0, 3, { size: 40, color: c, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); });
  const pb = ease.outBack(prog(t, 0.65, 1.05)); if (pb > 0) { g.save(); g.translate(E.W / 2, 750); g.scale(pb, pb); UI.bubble(g, 0, 0, { w: 560, h: 120, str: 'COMENTA AÍ', color: '#f4efe6' }); g.restore(); }
  const kk = (i) => ease.out(prog(t, 0.3 + i * 0.1, 0.8 + i * 0.1));
  g.save(); g.globalAlpha = kk(0); fly(g, 230, 1150 + bob(t, 8, 3), 3.2, t); g.restore();
  g.save(); g.globalAlpha = kk(1); wasp(g, 560, 1120 + bob(t, 8, 2.6), 2.2, { t, expr: 'thinking', look: [0, 0] }); g.restore();
  g.save(); g.globalAlpha = kk(2); dragonfly(g, 930, 1180 + bob(t, 6, 2.2), 1.0, { t, facing: -1, look: [1, 0], expr: 'smile' }); g.restore();
} });
