// shots/05_controle.js — fome e mercados, o corpo, o controle, o exército, o rio e o fim (s35–s37, s39–s45, s47–s50, s52–s54, s56, s59).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, backdrop, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, village, home } from '../sets/places.js';
import { stamp, bpTitle, iconEye, iconGlobe, cross, barbed, ageBadge, ground, FLOOR } from '../sets/common.js';
import { VOCE, VOCE_SOLDADO, MAE, OFICIAL, SOLDADO, POLICIA, LENCO } from '../cast.js';

const U = () => S().ui;
const rimOf = (M, dir = [0.4, -1]) => ({ color: M.rim, dir, w: 5 });
const PLAIN = { top: 'none' };
function zoomAt(g, cx, cy, z) { g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); }

// ---------- s35 — "Centenas de milhares de pessoas morreram, talvez milhões." ----------
registerShot('s35', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), u = U();
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a0a12', '#120c14', '#0a0a12']); g.fillRect(0, 0, E.W, E.H);
  g.save(); zoomAt(g, E.W / 2, E.H * 0.5, 1.0 + 0.06 * k);
  const cols = 12, rows = 14, x0 = 130, y0 = 520, dx = (E.W - 260) / (cols - 1), dy = 52, r = rng(4);
  const fade = ease.inOut(prog(t, 0.3, 3.1));
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const thr = r(), gone = fade > thr * 0.95, x = x0 + i * dx, y = y0 + j * dy;
    const c = gone ? alpha(u.accent, 0.22) : alpha(u.cream, 0.85);
    circle(g, x, y - 14, 7, c); seg(g, [[x, y - 6], [x, y + 14]], 6, c);
  }
  g.restore();
  text(g, 'CENTENAS DE MILHARES', E.W / 2, 330, { size: 58, color: u.cream, alpha: ease.out(prog(t, 0.15, 0.55)), spacing: 2 });
  const a2 = ease.out(prog(t, 2.8, 3.1));
  text(g, 'TALVEZ MILHÕES', E.W / 2, 420, { size: 70, color: u.accent, alpha: a2, spacing: 3, glow: 22, glowColor: 'rgba(255,60,40,.7)' });
  FX.dust(g, t, { count: 30, color: '#ffd8c8', a: 0.25 });
} });

// ---------- o mercado noturno ----------
function market(g, t, cam) {
  const M = mood('night'), GY = ground(), CX = E.W / 2, lamp = '#ffb860';
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.stars(g, t, { count: 90, area: [-200, 0, E.W + 400, E.H * 0.4] }); });
  layer(g, cam, 0.35, (g) => { for (let i = 0; i < 6; i++) FX.facade(g, { x: -420 + i * 330, y: GY - 260, w: 280, h: 520 + (i % 2) * 120, color: shade(M.wall, -0.4), win: M.practical, dark: shade(M.wall, -0.6), cols: 5, rows: 7, lit: 0.04, seed: 50 + i }); });
  layer(g, cam, 0.75, (g) => {
    const tarps = ['#5a6a8a', '#7a4a3a', '#4a6a4a', '#6a5a3a', '#4a4a6a'];
    for (let i = -2; i <= 4; i++) {
      const x = CX + i * 300 - 260, top = GY - 420;
      seg(g, [[x, GY - 150], [x, top]], 6, '#140f12'); seg(g, [[x + 250, GY - 150], [x + 250, top]], 6, '#140f12');
      poly(g, [[x - 30, top + 20], [x + 125, top - 70], [x + 280, top + 20], [x + 260, top + 50], [x - 10, top + 50]], shade(tarps[(i + 2) % 5], -0.35));
      rr(g, x - 10, GY - 190, 270, 46, 6); g.fillStyle = '#2a1c16'; g.fill();
      for (let k = 0; k < 6; k++) circle(g, x + 20 + k * 40, GY - 196, 16, ['#c8a050', '#7aa050', '#c86a3a', '#e8e0c8'][(k + i + 8) % 4]);
      const lx = x + 125, ly = top + 70, fl = 1 + 0.06 * Math.sin(t * 9 + i);
      seg(g, [[lx, top - 40], [lx, ly - 14]], 2, '#140f12'); rr(g, lx - 12, ly - 14, 24, 30, 6); g.fillStyle = '#ffe2b0'; g.fill(); glow(g, lx, ly, 260 * fl, lamp, 0.55); FX.pool(g, lx, GY + 10, 220, 40, lamp, 0.25);
    }
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.road, -0.1), M.dark]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.25)', 0.12); });
  return { GY, CX, M, lamp };
}
// s36 — "Foi aí que surgiram os mercados clandestinos,"
registerShot('s36', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.04 + 0.05 * k, x: -60 + 100 * k };
  const { GY, CX, lamp } = market(g, t, cam);
  layer(g, cam, 1, (g) => {
    const people = [[-380, 1, 1.9, 0], [-120, -1, 2.0, 1.3], [140, 1, 1.8, 2.1], [400, -1, 2.1, 0.7], [620, 1, 1.9, 3.3]];
    for (const [dx, f, s, ph] of people) drawFigure(g, { x: CX + dx + f * t * 70, y: GY + 30, s, facing: f, outfit: PLAIN, pose: walkPose(t * Math.PI * 2 * 0.8 + ph), expr: 'neutral', rim: { color: lamp, dir: [0, -1], w: 4 } });
  });
  FX.dust(g, t, { count: 40, color: lamp, a: 0.3 });
  const a = ease.out(prog(t, 1.4, 1.8));
  text(g, 'JANGMADANG', E.W / 2, 320, { size: 60, color: U().gold, alpha: a, spacing: 6, glow: 20, glowColor: 'rgba(255,140,60,.7)' });
  text(g, 'MERCADOS CLANDESTINOS', E.W / 2, 395, { size: 30, color: U().cream, font: FONTS.ui, weight: 900, alpha: a, spacing: 4 });
} });
// s37 — "onde muita família ainda tira o sustento." — a mãe vendendo
registerShot('s37', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.3 + 0.06 * k, x: 80, y: 60 };
  const { GY, CX, lamp } = market(g, t, cam);
  layer(g, cam, 1, (g) => {
    const mx = CX - 150, rim = { color: lamp, dir: [0.3, -1], w: 5 };
    g.fillStyle = '#3a4a6a'; g.beginPath(); g.ellipse(mx + 120, GY + 30, 200, 26, 0, 0, 7); g.fill();
    for (let k2 = 0; k2 < 5; k2++) circle(g, mx + 60 + k2 * 36, GY + 14 - (k2 % 2) * 10, 16, ['#c8a050', '#7aa050', '#e8e0c8'][k2 % 3]);
    drawFigure(g, { x: mx, y: GY + 30, s: 2.0, facing: 1, outfit: MAE, pose: breathe(posesAt(t, [[0, POSES.kneel], [1.2, { ...POSES.kneel, eF: [40, -126], hF: [74, -130] }]]), t, 0.4, 2), expr: 'neutral', rim, shadow: false });
    const bx = CX + 300, give = ease.inOut(prog(t, 0.9, 1.6));
    drawFigure(g, { x: bx, y: GY + 30, s: 2.1, facing: -1, outfit: PLAIN, pose: { ...POSES.reach, hF: [62, -170 + 40 * give] }, expr: 'neutral', rim: { ...rim, dir: [-0.3, -1] } });
    const nx = lerp(bx - 62 * 2.1, mx + 74 * 2.0, give), ny = lerp(GY + 30 - 170 * 2.1, GY + 30 - 130 * 2.0, give) + Math.sin(give * Math.PI) * -40;
    g.save(); g.translate(nx, ny); g.rotate(-0.2 + give * 0.4); rr(g, -34, -18, 68, 36, 4); g.fillStyle = '#9ab89a'; g.fill(); g.strokeStyle = '#4a6a4a'; g.lineWidth = 3; g.strokeRect(-26, -10, 52, 20); g.restore();
  });
  FX.dust(g, t, { count: 40, color: lamp, a: 0.3 });
} });

// ---------- s39 — "jovens que fugiram de lá chegam a ser até dez centímetros mais baixos..." ----------
registerShot('s39', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = U(), k = ease.inOut(t / info.dur);
  g.save(); zoomAt(g, E.W / 2, E.H * 0.55, 1.0 + 0.05 * k);
  const base = 1330, sN = 2.75, sS = 3.15, xN = 330, xS = 760;
  const topN = base - 232 * sN, topS = base - 232 * sS;
  seg(g, [[60, base], [E.W - 60, base]], 3, alpha(bp, 0.7));
  const a1 = ease.out(prog(t, 0.1, 0.5)), a2 = ease.out(prog(t, 0.3, 0.7));
  g.save(); g.globalAlpha *= a1; UI.lineFigure(g, { x: xN, y: base, s: sN, pose: POSES.stand, color: bp }); g.restore();
  g.save(); g.globalAlpha *= a2; UI.lineFigure(g, { x: xS, y: base, s: sS, pose: POSES.stand, color: u.cream, facing: -1 }); g.restore();
  text(g, 'NORTE', xN, base + 60, { size: 44, color: bp, font: FONTS.ui, weight: 900, spacing: 4, alpha: a1 });
  text(g, 'SUL', xS, base + 60, { size: 44, color: u.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: a2 });
  const pl = ease.out(prog(t, 1.4, 2.2));
  g.setLineDash([16, 12]); g.lineWidth = 3;
  g.strokeStyle = alpha(bp, 0.7 * pl); g.beginPath(); g.moveTo(xN - 160, topN); g.lineTo(lerp(xN - 160, E.W - 80, pl), topN); g.stroke();
  g.strokeStyle = alpha(u.cream, 0.7 * pl); g.beginPath(); g.moveTo(xS + 160, topS); g.lineTo(lerp(xS + 160, 80, pl), topS); g.stroke(); g.setLineDash([]);
  UI.dimension(g, t, { x1: E.W - 110, y1: topS, x2: E.W - 110, y2: topN, str: '', start: 2.2 });
  const a3 = ease.outBack(prog(t, 2.35, 2.75));
  if (a3 > 0) { g.save(); g.translate(E.W - 150, (topS + topN) / 2 - 150); g.scale(a3, a3); text(g, '10 CM', 0, 0, { size: 72, color: u.gold, align: 'right', glow: 20, glowColor: alpha(u.gold, 0.6) }); g.restore(); }
  g.restore();
  text(g, 'MESMA IDADE', E.W / 2, 330, { size: 46, color: u.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 4.7, 5.1)) });
} });

// ---------- s40 — "O rádio da sua casa vem lacrado. Só pega o governo." ----------
registerShot('s40', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), W = mood('interiorWarm'), u = U();
  blurLayer(g, 12, (g) => home(g, t, { z: 1.6, x: -200, y: -300 }, { night: true }));
  veil(g, '#0a0810', 0.4);
  g.save(); zoomAt(g, E.W / 2, E.H * 0.47, 1.0 + 0.07 * k);
  const x = 110, y = 520, w = 860, h = 620;
  g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 60; g.shadowOffsetY = 30; rr(g, x, y, w, h, 40); g.fillStyle = '#5a3624'; g.fill(); g.restore();
  rr(g, x, y, w, h, 40); g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#7a4a30', '#4a2a1c']); g.fill();
  rr(g, x + 40, y + 50, 380, 520, 24); g.fillStyle = '#2a1a14'; g.fill();
  for (let i = 0; i < 12; i++) seg(g, [[x + 70, y + 90 + i * 40], [x + 390, y + 90 + i * 40]], 10, '#3e2a20');
  const ring1 = (1 - prog(t, 2.6, 3.1)) * prog(t, 2.6, 2.9); if (t > 2.6) FX.rings(g, x + 230, y + 310, t - 2.6, { count: 3, r0: 60, r1: 320, speed: 1.6, color: u.cream, a: 0.35 });
  // o dial
  const dx = x + 470, dy = y + 70, dw = 350, dh = 200;
  rr(g, dx, dy, dw, dh, 16); g.fillStyle = '#f0e2c0'; g.fill(); glow(g, dx + dw / 2, dy + dh / 2, 260, W.practical, 0.35);
  for (let i = 0; i <= 20; i++) seg(g, [[dx + 25 + i * 15, dy + 40], [dx + 25 + i * 15, dy + (i % 5 ? 62 : 78)]], 3, '#5a4030');
  circle(g, dx + 25 + 7 * 15, dy + 130, 14, LENCO); text(g, 'GOVERNO', dx + 25 + 7 * 15, dy + 168, { size: 22, color: '#5a2a1a', font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 2.5, 2.9)) });
  const jig = t > 1.3 && t < 1.9 ? Math.sin(t * 60) * 3 : 0;
  seg(g, [[dx + 25 + 7 * 15 + jig, dy + 22], [dx + 25 + 7 * 15 + jig, dy + 110]], 5, LENCO);
  // o botão de sintonia, com o lacre por cima
  const kx = dx + 175, ky = y + 440, turn = t > 1.2 && t < 1.9 ? Math.sin(t * 40) * 0.08 : 0;
  g.save(); g.translate(kx, ky); g.rotate(turn); circle(g, 0, 0, 92, '#2a1a14'); circle(g, 0, 0, 78, '#4a3022'); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; seg(g, [[Math.cos(a) * 66, Math.sin(a) * 66], [Math.cos(a) * 78, Math.sin(a) * 78]], 5, '#2a1a14'); } g.restore();
  g.save(); g.translate(kx, ky - 40); g.rotate(-0.5); rr(g, -60, -170, 120, 400, 6); g.fillStyle = '#efe6d2'; g.fill(); g.restore();
  stamp(g, kx, ky - 40, t - 0.95, 'LACRADO', { scale: 0.7, rot: -0.5 });
  g.restore();
} });

// ---------- s41 — "Internet de verdade? Você nunca viu." ----------
registerShot('s41', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.4, y: -200 })); veil(g, '#05060c', 0.5);
  const scr = '#7fc8ff', r = 310 * (1 + 0.04 * t), cx = E.W / 2, cy = E.H * 0.6;
  glow(g, cx, cy + r * 1.6, r * 2, scr, 0.35);
  bigFace(g, cx, cy, r, { outfit: VOCE, expr: t < 1.4 ? 'thinking' : 'confused', look: [0, -0.8], rimColor: scr, rimSide: 1, blink: t > 2.0 && t < 2.12 });
  const a = ease.outBack(prog(t, 0.1, 0.5)), gy = 420;
  if (a > 0) { g.save(); g.translate(cx, gy); g.scale(a, a); glow(g, 0, 0, 200, scr, 0.3); iconGlobe(g, 0, 0, 1.6, scr); g.restore(); }
  cross(g, cx, gy, 140, U().accent, prog(t, 1.75, 2.15));
} });

// ---------- s42 — "Só existe uma rede interna, vigiada." ----------
registerShot('s42', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = U(), k = ease.inOut(t / info.dur), cx = E.W / 2, cy = 1010;
  g.save(); zoomAt(g, cx, cy, 1.0 + 0.05 * k);
  const r0 = rng(9); for (let i = 0; i < 40; i++) { const a = r0() * 7, d = 420 + r0() * 400; circle(g, cx + Math.cos(a) * d, cy + Math.sin(a) * d * 1.2, 6, alpha(bp, 0.18)); }
  ring(g, cx, cy, 360, 14, alpha(bp, 0.9)); ring(g, cx, cy, 384, 3, alpha(bp, 0.4));
  const nodes = []; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + 0.3, d = i % 3 === 0 ? 120 : 240; nodes.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d]); }
  const p = ease.out(prog(t, 0.15, 0.9)); g.strokeStyle = alpha(bp, 0.6); g.lineWidth = 3;
  nodes.forEach((n, i) => { const m = nodes[(i + 2) % 9]; g.beginPath(); g.moveTo(n[0], n[1]); g.lineTo(lerp(n[0], m[0], p), lerp(n[1], m[1], p)); g.stroke(); });
  nodes.forEach((n, i) => { circle(g, n[0], n[1], 18, u.bpBg); ring(g, n[0], n[1], 18, 4, bp); const pulse = (t * 2 + i * 0.3) % 1; circle(g, n[0], n[1], 7, alpha(u.cream, 0.4 + 0.6 * pulse)); });
  g.restore();
  const eo = ease.out(prog(t, 1.4, 1.8)), ex = cx + Math.sin(t * 2) * 30;
  glow(g, ex, 470, 220, u.accent, 0.25 * eo); iconEye(g, ex, 470, 1.4, eo > 0.5 ? u.accent : bp, Math.max(0.05, eo));
  if (eo > 0.5) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, 0, 500, 0, cy, [alpha(u.accent, 0.25), alpha(u.accent, 0)]); g.beginPath(); g.moveTo(ex - 20, 500); g.lineTo(cx - 360, cy); g.lineTo(cx + 360, cy); g.lineTo(ex + 20, 500); g.fill(); g.restore(); }
  text(g, 'REDE INTERNA', cx, 300, { size: 54, color: u.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 0.6, 1.0)) });
} });

// ---------- s43 — "Se te pegarem com uma novela sul-coreana num pendrive," ----------
registerShot('s43', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.75 + 0.08 * k, x: -100, y: 230 }, caught = t > 0.55;
  const { GY, CX, M } = bedroom(g, t, cam);
  veil(g, '#03040a', 0.45);
  layer(g, cam, 1, (g) => {
    FX.bed(g, { x: CX - 380, y: GY + 20, w: 640, color: '#3a3a6a', frame: '#1a1628' });
    // corpo sob o cobertor, cabeça e tela
    g.fillStyle = '#4a4a80'; g.beginPath(); g.moveTo(CX - 330, GY - 70); g.quadraticCurveTo(CX - 120, GY - 240, CX + 120, GY - 90); g.lineTo(CX + 220, GY - 70); g.closePath(); g.fill();
    const hx = CX - 280, hy = GY - 130;
    const scr = '#8fe0ff', blink = (t * 3) % 1 > 0.5;
    glow(g, hx + 110, hy + 10, caught ? 160 : 260, scr, 0.6);
    circle(g, hx, hy, 52, S().ink); circle(g, hx + 18, hy - 6, caught ? 14 : 10, '#f4efe6'); circle(g, hx + 44, hy - 6, caught ? 14 : 10, '#f4efe6');
    rr(g, hx + 80, hy - 30, 90, 60, 6); g.fillStyle = '#10141c'; g.fill(); g.fillStyle = scr; g.fillRect(hx + 86, hy - 24, 78, 48);
    circle(g, hx + 112, hy, 9, '#1a1a2a'); circle(g, hx + 140, hy, 9, '#1a1a2a'); g.fillStyle = '#ff7aa8'; g.beginPath(); g.arc(hx + 122, hy - 12, 5, 0, 7); g.arc(hx + 130, hy - 12, 5, 0, 7); g.fill();
    rr(g, hx + 168, hy - 10, 26, 16, 3); g.fillStyle = '#c8c8d8'; g.fill();
    // a lanterna entrando
    if (caught) { const sw = ease.out(prog(t, 0.55, 0.9)); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, E.W + 200, 0, hx, 0, ['rgba(240,244,255,.5)', 'rgba(240,244,255,.05)']); g.beginPath(); g.moveTo(E.W + 200, GY - 700); g.lineTo(hx - 160, lerp(GY - 1100, GY - 300, sw)); g.lineTo(hx - 160, lerp(GY - 700, GY + 100, sw)); g.closePath(); g.fill(); g.restore(); }
  });
  if (caught) stamp(g, E.W / 2, 400, t - 0.55, 'FLAGRADO', { scale: 0.9 });
} });

// ---------- campos de trabalho / reeducação ----------
function camp(g, t, cam, o = {}) {
  const M = mood(o.snow ? 'storm' : 'dusk'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); if (!o.snow) FX.sun(g, CX + 260, GY - 560, 46, '#ffe8c8', M.key, 4); FX.hills(g, { y: GY - 300, amp: 260, color: shade(M.dark, 0.1), seed: 2, freq: 0.004 }); });
  layer(g, cam, 0.45, (g) => {
    for (let i = -2; i <= 3; i++) { const x = CX + i * 300 - 150; g.fillStyle = shade(M.wall, -0.3); g.fillRect(x, GY - 250, 260, 160); poly(g, [[x - 20, GY - 250], [x + 130, GY - 320], [x + 280, GY - 250]], shade(M.wall, -0.5)); if (o.snow) { g.fillStyle = alpha('#e8eeff', 0.7); poly(g, [[x - 20, GY - 250], [x + 130, GY - 320], [x + 280, GY - 250], [x + 260, GY - 240], [x, GY - 240]], alpha('#e8eeff', 0.7)); } }
    for (const tx of [CX - 420, CX + 440]) { for (const d of [-40, 40]) seg(g, [[tx + d, GY - 90], [tx + d * 0.6, GY - 520]], 8, '#151018'); rr(g, tx - 70, GY - 600, 140, 90, 6); g.fillStyle = '#1a141c'; g.fill(); poly(g, [[tx - 90, GY - 600], [tx, GY - 660], [tx + 90, GY - 600]], '#120d14'); circle(g, tx - 50, GY - 560, 12, '#f4f7ff'); FX.lightCone(g, tx - 50, GY - 560, { angle: Math.PI * (0.55 + 0.15 * Math.sin(t * 0.9 + tx)), spread: 0.22, len: 900, color: '#e8eeff', a: 0.18 }); }
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 90, 0, GY + 600, o.snow ? ['#c8d0e8', '#5a6080'] : [shade(M.floor, 0.05), M.dark]); g.fillRect(-E.W, GY - 90, E.W * 3, E.H * 2); });
  return { GY, CX, M };
}
function fence(g, GY, t) { for (let x = -60; x < E.W + 100; x += 260) seg(g, [[x, GY + 200], [x, GY - 600]], 12, '#0c0a10'); for (const y of [-520, -400, -280, -160, -40, 80]) barbed(g, -60, GY + y, E.W + 100, GY + y + 10, '#16121a', 3); }
// s44 — "você pode pegar de 5 a 15 anos de trabalho forçado."
registerShot('s44', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.06 + 0.04 * k, x: -30 * k };
  const { GY, CX, M } = camp(g, t, cam);
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 4; i++) {
      const x = CX - 360 + i * 240, sw = Math.sin(t * 4 + i * 1.6) > 0, s = 1.9;
      const pose = sw ? { ...POSES.pointUp, hF: [30, -250], eF: [20, -210], hB: [24, -244] } : { ...POSES.crouch, hF: [60, -40], hB: [52, -44] };
      drawFigure(g, { x, y: GY + 20, s, facing: 1, outfit: { top: 'tshirt', color: '#5a5a62' }, pose, expr: 'sad', rim: rimOf(M, [0.6, -1]) });
      const h = [x + pose.hF[0] * s, GY + 20 + pose.hF[1] * s]; seg(g, [h, [h[0] + 30, h[1] + (sw ? -60 : 60)]], 7, '#2a2228'); seg(g, [[h[0] + 10, h[1] + (sw ? -70 : 70)], [h[0] + 60, h[1] + (sw ? -40 : 40)]], 8, '#8a8a92');
    }
  });
  blurLayer(g, 8, (g) => fence(g, GY + 160, t), cam, 1.6);
  const n = t < 1.2 ? 5 : Math.round(lerp(5, 15, ease.inOut(prog(t, 1.2, 1.7))));
  const u = U(), a = ease.out(prog(t, 0.15, 0.5));
  text(g, `5 A ${n} ANOS`, E.W / 2, 330, { size: 92, color: u.gold, alpha: a, spacing: 2, glow: 22, glowColor: alpha(u.gold, 0.6) });
  text(g, 'DE TRABALHO FORÇADO', E.W / 2, 430, { size: 40, color: u.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 2.2, 2.6)) });
} });
// s54 — "E quem volta pode passar anos num campo de reeducação." — campo na neve
registerShot('s54', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.0 + 0.08 * k, y: -20 * k };
  const { GY, CX, M } = camp(g, t, cam, { snow: true });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 7; i++) { const x = CX - 420 + i * 130 + t * 30; drawFigure(g, { x, y: GY - 40, s: 1.2, facing: 1, outfit: { top: 'tshirt', color: '#5a5a62' }, pose: walkPose(t * 4 + i), expr: 'sad', rim: rimOf(M, [0.4, -1]) }); } });
  blurLayer(g, 8, (g) => fence(g, GY + 200, t), cam, 1.6);
  FX.snow(g, t, { count: 200, speed: 80 });
  veil(g, '#0a1020', 0.15);
} });

// ---------- s45 — "Pra visitar um parente em outra cidade, você precisa de autorização." ----------
registerShot('s45', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.05 * k, x: 40 };
  const { GY, CX, M } = village(g, t, cam, { time: 'dusk', billboard: false, noHouses: true });
  layer(g, cam, 1, (g) => {
    const bx = CX + 300; rr(g, bx, GY - 420, 220, 420, 8); g.fillStyle = '#3a4030'; g.fill(); rr(g, bx + 30, GY - 360, 160, 100, 6); g.fillStyle = M.practical; g.fill(); glow(g, bx + 110, GY - 310, 200, M.practical, 0.4);
    const lift = ease.inOut(prog(t, 2.8, 3.1));
    g.save(); g.translate(bx - 20, GY - 170); g.rotate(-lift * 1.2); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#e8e4dc' : LENCO; g.fillRect(-i * 70 - 70, -14, 70, 28); } g.restore();
    drawFigure(g, { x: CX + 170, y: GY + 20, s: 2.2, facing: -1, outfit: SOLDADO, pose: breathe(posesAt(t, [[0, 'stand'], [1.6, { ...POSES.reach, hF: [56, -170] }]]), t, 0.4, 1), expr: 'determined', rim: rimOf(M, [-1, -0.6]) });
    drawFigure(g, { x: CX - 200, y: GY + 20, s: 2.2, facing: 1, outfit: VOCE, pose: breathe(posesAt(t, [[0, 'stand'], [1.0, 'holdFront']]), t, 0.4, 2), prop: 'paper', expr: 'nervous', rim: rimOf(M, [1, -0.6]) });
  });
  stamp(g, E.W / 2, 420, t - 2.75, 'AUTORIZADO', { color: '#3fb950', scale: 0.85, rot: -0.12 });
  text(g, 'SALVO-CONDUTO', E.W / 2, 300, { size: 44, color: U().cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 0.6, 1.0)) * (1 - prog(t, 2.6, 2.8)) });
} });

// ---------- s47 — "Os homens ficam cerca de dez anos. As mulheres, sete." ----------
registerShot('s47', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = U(), k = ease.inOut(t / info.dur);
  g.save(); zoomAt(g, E.W / 2, E.H * 0.5, 1.0 + 0.04 * k);
  bpTitle(g, 'SERVIÇO MILITAR', 320, ease.out(prog(t, 0.1, 0.5)));
  const rows = [[700, 'HOMENS', 10, 1.4, u.gold], [1100, 'MULHERES', 7, 2.75, bp]];
  const x0 = 300, x1 = E.W - 110, per = (x1 - x0) / 10;
  rows.forEach(([y, lab, yrs, at, c], i) => {
    const a = ease.out(prog(t, 0.3 + i * 0.3, 0.7 + i * 0.3)); g.save(); g.globalAlpha *= a;
    UI.lineFigure(g, { x: 170, y: y + 110, s: 1.15, pose: POSES.stand, color: c });
    if (i === 1) { g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); g.moveTo(170 - 14, y + 110 - 245); g.quadraticCurveTo(170 - 60, y + 110 - 220, 170 - 44, y + 110 - 170); g.stroke(); }
    text(g, lab, x0, y - 60, { size: 38, color: c, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
    for (let j = 0; j < 10; j++) { rr(g, x0 + j * per + 4, y - 22, per - 8, 44, 8); g.fillStyle = alpha(c, 0.1); g.fill(); }
    const p = ease.out(prog(t, at - 0.5, at + 0.2)), n = p * yrs;
    for (let j = 0; j < Math.ceil(n); j++) { const f = clamp(n - j); rr(g, x0 + j * per + 4, y - 22, (per - 8) * f, 44, 8); g.fillStyle = c; g.fill(); }
    if (p > 0.05) text(g, `${Math.round(n)} ANOS`, x0 + Math.max(1, n) * per - 4, y + 72, { size: 50, color: c, align: 'right', glow: 16, glowColor: alpha(c, 0.6) });
    g.restore();
  });
  g.restore();
} });

// ---------- o portão do quartel (s48 adolescente, s49 quase 30) ----------
function barracks(g, t, cam) {
  const M = mood('dusk'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, CX - 260, GY - 620, 50, '#fff3dc', M.key, 4); FX.hills(g, { y: GY - 280, amp: 220, color: shade(M.dark, 0.15), seed: 6 }); });
  layer(g, cam, 0.55, (g) => {
    const c = shade(M.wall, -0.2);
    for (const sx of [-1, 1]) { g.fillStyle = c; g.fillRect(CX + sx * 330 - 70, GY - 760, 140, 760); g.fillStyle = shade(c, -0.4); g.fillRect(CX + sx * 330 - 90, GY - 790, 180, 40); g.fillStyle = shade(c, -0.25); g.fillRect(CX + sx * 330 + (sx < 0 ? -1200 : 70), GY - 360, 1130, 360); }
    g.fillStyle = shade(c, 0.05); g.fillRect(CX - 400, GY - 900, 800, 150); circle(g, CX, GY - 825, 60, LENCO); poly(g, Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? 20 : 48; return [CX + Math.cos(a) * rr2, GY - 825 + Math.sin(a) * rr2]; }), '#ffd47e');
    g.fillStyle = linGrad(g, 0, GY - 750, 0, GY, ['#1a1418', '#0a080c']); g.fillRect(CX - 260, GY - 750, 520, 750);
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.road, 0), M.dark]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); FX.pool(g, CX, GY + 40, 400, 60, M.key, 0.2); });
  return { GY, CX, M };
}
registerShot('s48', { draw(g, t, info) {
  const cam = { z: 1.06 + 0.04 * t }, { GY, CX, M } = barracks(g, t, cam);
  layer(g, cam, 1, (g) => {
    const x = lerp(CX + 120, CX - 20, t / info.dur);
    drawFigure(g, { x, y: GY + 20, s: 1.95, facing: -1, outfit: VOCE_SOLDADO, pose: walkPose(t * Math.PI * 2 * 0.8), expr: 'scared', rim: rimOf(M, [-1, -0.6]) });
  });
  UI.readout(g, { label: 'IDADE', value: '17', x: E.W / 2, y: 330, align: 'center', size: 90 });
} });
registerShot('s49', { draw(g, t, info) {
  const cam = { z: 1.1 - 0.03 * t }, { GY, CX, M } = barracks(g, t, cam);
  layer(g, cam, 1, (g) => {
    const x = lerp(CX - 20, CX + 120, t / info.dur);
    drawFigure(g, { x, y: GY + 20, s: 2.45, facing: 1, outfit: VOCE_SOLDADO, pose: walkPose(t * Math.PI * 2 * 0.6), expr: 'sad', rim: rimOf(M, [-1, -0.6]) });
  });
  const age = Math.round(lerp(17, 29, ease.out(prog(t, 0.05, 0.9))));
  UI.readout(g, { label: 'IDADE', value: String(age), x: E.W / 2, y: 330, align: 'center', size: 90 });
} });

// ---------- s50 — "Um dia, você ouve um boato:" — o sussurro ----------
registerShot('s50', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.35 + 0.06 * k, x: -40, y: 80 };
  const { GY, CX, M } = village(g, t, cam, { time: 'night', billboard: false });
  veil(g, '#03040a', 0.3);
  layer(g, cam, 1, (g) => {
    const lamp = M.practical; glow(g, CX + 60, GY - 700, 500, lamp, 0.25);
    drawFigure(g, { x: CX + 160, y: GY + 20, s: 2.3, facing: -1, outfit: { top: 'hoodie', color: '#2a2a34', head: 'hood' }, pose: breathe({ ...POSES.talk, head: [16, -200], sh: [6, -172] }, t, 0.4, 1), expr: 'neutral', rim: { color: lamp, dir: [0, -1], w: 4 } });
    const me = { x: CX - 70, y: GY + 20, s: 2.3, facing: 1, outfit: VOCE, pose: breathe(POSES.stand, t, 0.4, 2), expr: t < 0.7 ? 'neutral' : 'surprised', look: [0.3, 0], rim: { color: lamp, dir: [0, -1], w: 4 } };
    drawFigure(g, me);
    FX.rings(g, CX + 120, GY + 20 - 205 * 2.3, t, { count: 3, r0: 10, r1: 90, speed: 1.2, color: '#fff3e0', a: 0.45 });
  });
} });

// ---------- a margem do rio em 2D (s52, s53, s56) ----------
function river(g, t, cam) {
  const M = mood('night'), GY = ground(), CX = E.W / 2, wy = GY - 380;
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.stars(g, t, { count: 120, area: [-200, 0, E.W + 400, E.H * 0.35] }); FX.moon(g, CX - 300, 300, 34); });
  layer(g, cam, 0.3, (g) => {
    FX.skyline(g, { x: -400, y: wy - 20, w: E.W + 800, minH: 120, maxH: 420, color: '#1a1a34', windowColor: '#ffcf8a', lit: 0.7, seed: 31 });
    for (let i = 0; i < 8; i++) { const c = ['#ff5a4a', '#5fe0d8', '#ffd47e'][i % 3], x = -200 + i * 190; rr(g, x, wy - 260 - (i % 3) * 60, 90, 26, 4); g.fillStyle = c; g.fill(); glow(g, x + 45, wy - 247 - (i % 3) * 60, 120, c, 0.35); }
    g.fillStyle = '#121428'; g.fillRect(-E.W, wy - 20, E.W * 3, 30);
  });
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, wy, 0, GY, ['#1a2040', '#0c0e1e']); g.fillRect(-E.W, wy, E.W * 3, GY - wy);
    for (let i = 0; i < 26; i++) { const x = -300 + i * 70, c = ['#ffcf8a', '#5fe0d8', '#ff5a4a', '#ffcf8a'][i % 4]; g.fillStyle = alpha(c, 0.18); for (let j = 0; j < 8; j++) g.fillRect(x + Math.sin(t * 2 + j + i) * 6, wy + 20 + j * 34, 26 - j * 2, 8); }
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 30, 0, GY + 600, ['#0e1a14', '#05080a']); g.beginPath(); g.moveTo(-E.W, GY + 40); g.quadraticCurveTo(CX, GY - 60, E.W * 2, GY + 30); g.lineTo(E.W * 2, E.H * 2); g.lineTo(-E.W, E.H * 2); g.fill(); });
  return { GY, CX, M, wy };
}
// s52 — "Mas atravessar é crime."
registerShot('s52', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.06 + 0.05 * k };
  const { GY, CX, M } = river(g, t, cam);
  layer(g, cam, 0.7, (g) => { const x = CX + 260 + Math.sin(t * 1.2) * 300; FX.lightCone(g, E.W + 100, GY - 900, { angle: Math.atan2(GY - (GY - 900), x - E.W - 100), spread: 0.18, len: 1400, color: '#e8eeff', a: 0.22 }); FX.pool(g, x, GY - 120, 220, 40, '#e8eeff', 0.35); });
  layer(g, cam, 1, (g) => {
    seg(g, [[CX - 200, GY + 200], [CX - 200, GY - 380]], 14, '#120e14');
    rr(g, CX - 380, GY - 520, 360, 200, 10); g.fillStyle = '#c8302a'; g.fill(); rr(g, CX - 366, GY - 506, 332, 172, 6); g.strokeStyle = '#f4e8d8'; g.lineWidth = 5; g.stroke();
    text(g, 'PROIBIDO', CX - 200, GY - 450, { size: 50, color: '#f4e8d8', font: FONTS.ui, weight: 900, spacing: 3 });
    text(g, 'ATRAVESSAR', CX - 200, GY - 390, { size: 34, color: '#f4e8d8', font: FONTS.ui, weight: 900, spacing: 3 });
  });
  layer(g, cam, 1.4, (g) => { for (const y of [-260, -120, 20]) barbed(g, -100, GY + y, E.W + 100, GY + y - 40, '#0a080c', 5); for (const x of [120, 900]) seg(g, [[x, GY + 400], [x, GY - 400]], 22, '#0a080c'); });
  stamp(g, E.W / 2, 380, t - 1.25, 'CRIME', { scale: 1.1 });
} });
// s53 — "Se a polícia chinesa te pega, você é mandado de volta."
registerShot('s53', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12 + 0.04 * k, x: 40 };
  const { GY, CX, M } = river(g, t, cam);
  const red = Math.sin(t * 14) > 0;
  layer(g, cam, 1, (g) => {
    const cx = CX + 260, cy = GY + 10;   // a viatura
    rr(g, cx - 240, cy - 150, 480, 110, 30); g.fillStyle = '#e8e8ee'; g.fill(); rr(g, cx - 150, cy - 230, 280, 90, 30); g.fillStyle = '#e8e8ee'; g.fill();
    rr(g, cx - 130, cy - 215, 110, 64, 10); g.fillStyle = '#1a2440'; g.fill(); rr(g, cx - 4, cy - 215, 110, 64, 10); g.fillStyle = '#1a2440'; g.fill();
    g.fillStyle = '#2a4a9a'; g.fillRect(cx - 240, cy - 110, 480, 24);
    for (const wx of [-150, 150]) { circle(g, cx + wx, cy - 30, 46, '#111'); circle(g, cx + wx, cy - 30, 20, '#666'); }
    rr(g, cx - 70, cy - 252, 140, 22, 8); g.fillStyle = red ? '#ff3030' : '#3060ff'; g.fill();
    glow(g, cx, cy - 240, 520, red ? '#ff3030' : '#3060ff', 0.45);
    const rim = { color: red ? '#ff7070' : '#7090ff', dir: [1, -0.4], w: 5 };
    drawFigure(g, { x: CX - 120, y: GY + 20, s: 2.1, facing: 1, outfit: VOCE, pose: { ...POSES.sad, eF: [-6, -134], hF: [-20, -112], eB: [-10, -132], hB: [-22, -110] }, expr: 'sad', rim });
    drawFigure(g, { x: CX - 280, y: GY + 20, s: 2.2, facing: 1, outfit: POLICIA, pose: { ...POSES.reach, hF: [74, -150] }, expr: 'determined', rim });
  });
  const a = ease.out(prog(t, 2.1, 2.4)), u = U();
  if (a > 0) { g.save(); g.globalAlpha *= a; const y = 380, x = E.W / 2 + 160 - 320 * ease.out(prog(t, 2.1, 2.6)); poly(g, [[x - 230, y], [x - 130, y - 70], [x - 130, y - 30], [x + 170, y - 30], [x + 170, y + 30], [x - 130, y + 30], [x - 130, y + 70]], u.accent); text(g, 'DE VOLTA', E.W / 2, y + 120, { size: 56, color: u.cream, spacing: 4 }); g.restore(); }
} });
// s56 — "Então me diz:" — você olha para nós
registerShot('s56', { draw(g, t, info) {
  blurLayer(g, 14, (g) => river(g, t, { z: 1.4, y: -200 })); veil(g, '#03040a', 0.35);
  const M = mood('night'), r = 320 * (1 + 0.05 * t);
  bigFace(g, E.W / 2, E.H * 0.56, r, { outfit: VOCE, expr: t < 0.4 ? 'neutral' : 'thinking', look: [0, 0.05], rimColor: M.rim, rimSide: -1 });
} });

// ---------- s59 — "Comenta aí." — tela final ----------
registerShot('s59', { draw(g, t, info) {
  const u = U(), N = mood('night');
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#0a0e22', '#16183a', '#2a1a2e']); g.fillRect(0, 0, E.W, E.H);
  FX.stars(g, t, { count: 100, area: [0, 0, E.W, E.H * 0.4] });
  glow(g, E.W / 2, E.H * 0.95, E.W * 0.7, '#ff9a5a', 0.25);
  const a1 = ease.out(prog(t, 0.1, 0.5));
  text(g, 'Você atravessaria', E.W / 2, 330, { size: 74, font: FONTS.serif, weight: 900, italic: true, color: u.cream, alpha: a1, glow: 18, glowColor: 'rgba(255,170,90,.5)' });
  text(g, 'o rio… ou ficaria?', E.W / 2, 420, { size: 74, font: FONTS.serif, weight: 900, italic: true, color: u.gold, alpha: a1, glow: 18, glowColor: 'rgba(255,170,90,.5)' });
  [['ATRAVESSAR', '#5fe0d8', 0.4], ['FICAR', '#ffb070', 0.55]].forEach(([lab, c, at], i) => {
    const p = ease.outBack(prog(t, at, at + 0.4)); if (p <= 0) return;
    g.save(); g.translate(E.W / 2 + (i ? 230 : -230), 590); g.scale(p, p); rr(g, -200, -50, 400, 100, 50); g.fillStyle = alpha(c, 0.18); g.fill(); g.strokeStyle = c; g.lineWidth = 5; g.stroke();
    text(g, lab, 0, 3, { size: 40, color: c, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore();
  });
  const pb = ease.outBack(prog(t, 0.7, 1.1));
  if (pb > 0) { g.save(); g.translate(E.W / 2, 800); g.scale(pb, pb); UI.bubble(g, 0, 0, { w: 560, h: 120, str: 'COMENTA AÍ', color: '#f4efe6' }); g.restore(); }
  const cast = [MAE, VOCE, { top: 'tracksuit', color: '#2f8f6f' }], y0 = 1420;
  cast.forEach((of, i) => { const kk = ease.out(prog(t, 0.3 + i * 0.1, 0.8 + i * 0.1)); drawFigure(g, { x: E.W / 2 + (i - 1) * 230, y: y0 + (1 - kk) * 40, s: i === 1 ? 2.3 : 2.1, facing: 1, outfit: of, pose: POSES.relaxed, expr: i === 1 ? 'thinking' : 'neutral', alpha: kk, rim: { color: '#ffb070', dir: [0, 1] } }); });
  g.fillStyle = alpha('#000', 0.3); g.fillRect(0, y0 + 10, E.W, 6);
} });
