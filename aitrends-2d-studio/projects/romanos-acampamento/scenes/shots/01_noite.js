// shots/01_noite.js — a noite: título, Germânia, a emboscada antiga, o pântano, a vala, o muro, as estacas, as sentinelas (s01–s21).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, backdrop, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { forest, marsh, campOutside, campInside, torch, spear, shield, cornu, tent, stakes } from '../sets/world.js';
import { labelTitle, bpTitle, cross, joint, ground } from '../sets/common.js';
import { VOCE, GUERREIRO, ROMANO, GOLD } from '../cast.js';

const rimOf = (c, dir = [0.5, -1]) => ({ color: c, dir, w: 5 });
const MOON = '#a9b8ff', TORCH = '#ffb45a';
function zoomAt(g, cx, cy, z) { g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); }
// figura com lança na mão da frente
export function withSpear(g, o, ang = -Math.PI / 2 + 0.15, len = 330) { drawFigure(g, o); const [hx, hy] = joint(o, 'hF'); spear(g, hx - Math.cos(ang) * len * 0.35, hy - Math.sin(ang) * len * 0.35, ang, len * (o.s ?? 1) / 2.2); }
// legionário com escudo
export function legion(g, o) { drawFigure(g, o); const [hx, hy] = joint(o, 'hB'); shield(g, hx + 10 * (o.facing ?? 1) * (o.s ?? 1), hy - 10 * (o.s ?? 1), (o.s ?? 1) * 0.75, '#8a3a34', o.facing ?? 1); }
// legionário de costas/perfil caminhando
// close de legionário: rosto + capacete (calota cinza, protetores de face, crista)
export function romanFace(g, cx, cy, r, o) {
  bigFace(g, cx, cy, r, { ...o, outfit: { ...ROMANO, head: 'none' } });
  const hc = '#8e959e';
  g.fillStyle = shade(hc, -0.2); g.beginPath(); g.arc(cx, cy, r * 1.06, Math.PI * 1.02, Math.PI * 1.98); g.lineTo(cx + r * 1.06, cy - r * 0.32); g.lineTo(cx - r * 1.06, cy - r * 0.32); g.fill();
  g.fillStyle = hc; g.beginPath(); g.arc(cx, cy, r * 1.0, Math.PI * 1.06, Math.PI * 1.94); g.lineTo(cx + r * 0.96, cy - r * 0.42); g.lineTo(cx - r * 0.96, cy - r * 0.42); g.fill();
  g.fillStyle = shade(hc, -0.3); g.fillRect(cx - r * 1.12, cy - r * 0.42, r * 2.24, r * 0.12);
  for (const sx of [-1, 1]) { g.fillStyle = shade(hc, -0.1); g.beginPath(); g.moveTo(cx + sx * r * 0.95, cy - r * 0.3); g.lineTo(cx + sx * r * 1.02, cy + r * 0.45); g.lineTo(cx + sx * r * 0.78, cy + r * 0.55); g.lineTo(cx + sx * r * 0.72, cy - r * 0.3); g.fill(); }
  g.strokeStyle = '#9a2e28'; g.lineWidth = r * 0.16; g.lineCap = 'butt'; g.beginPath(); g.arc(cx, cy, r * 1.1, Math.PI * 1.22, Math.PI * 1.78); g.stroke();
  g.strokeStyle = 'rgba(255,200,160,.35)'; g.lineWidth = r * 0.03; g.beginPath(); g.arc(cx, cy, r * 1.15, Math.PI * 1.25, Math.PI * 1.75); g.stroke();
  if (o.bags) for (const sx of [-1, 1]) { g.fillStyle = 'rgba(120,80,140,.55)'; g.beginPath(); g.ellipse(cx + sx * r * 0.34, cy + r * 0.05, r * 0.16, r * 0.06, 0, 0, Math.PI); g.fill(); }
}
const sepia = (g, a = 0.55) => { g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = `rgba(150,100,60,${a})`; g.fillRect(0, 0, E.W, E.H); g.restore(); };

// s01 — abertura/capa
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.0 + 0.06 * k, y: 30 * k };
  const { GY } = campOutside(g, t, cam, { time: 'night', big: true });
  layer(g, { z: 1 + 0.1 * k, x: -20 * k }, 1.3, (g) => {
    for (const [x, s, sp] of [[150, 2.6, -1.35], [360, 2.2, -1.5], [930, 2.8, -1.75]]) withSpear(g, { x, y: GY + 330, s, facing: x > 600 ? -1 : 1, outfit: { top: 'none' }, pose: breathe(POSES.stand, t, 0.4, x), face: { hidden: true }, rim: rimOf(MOON, [0, -1]) }, sp, 420);
  });
  FX.fog(g, GY + 120, 240, '#4a5a8a', 0.25);
  FX.dust(g, t, { count: 40, color: '#cfd8ff', a: 0.25 });
  UI.titleCard(g, t + 0.2, { lines: ['O QUE ACONTECERIA', 'SE VOCÊ ATACASSE UM', 'EXÉRCITO ROMANO', 'ENQUANTO ELE DORMIA?'], dur: info.dur + 0.4, y: E.H * 0.3 });
} });

// s02 — "Germânia. Ano 15."
registerShot('s02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); forest(g, t, { z: 1.05 + 0.05 * k, x: -40 * k }, { time: 'night' });
  FX.dust(g, t, { count: 40, color: MOON, a: 0.3 });
  labelTitle(g, t, 'GERMÂNIA', 'ANO 15', E.H * 0.3, { at: 0.1, big: 110 });
} });

// s03 — "Você é um guerreiro germânico,"
registerShot('s03', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12 + 0.06 * k, x: 20 };
  const { GY, CX } = forest(g, t, cam, { time: 'night' });
  layer(g, cam, 1, (g) => withSpear(g, { x: CX - 40, y: GY, s: 2.5, facing: 1, outfit: VOCE, pose: breathe({ ...POSES.stand, eF: [16, -150], hF: [28, -170] }, t, 0.5, 1), expr: 'determined', look: [0.5, 0], rim: rimOf(MOON, [1, -0.6]) }));
  FX.dust(g, t, { count: 40, color: MOON, a: 0.3 });
} });

// s04 — "escondido na floresta, no meio da noite."
registerShot('s04', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.2 + 0.05 * k, x: -30 + 30 * k };
  const { GY, CX } = forest(g, t, cam, { time: 'night' });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: CX - 120, y: GY, s: 2.4, facing: 1, outfit: VOCE, pose: breathe({ ...POSES.crouch, head: [22, -148] }, t, 0.4, 2), expr: 'neutral', look: [1, -0.1], rim: rimOf(MOON, [1, -0.4]) });
    g.fillStyle = '#1a2032'; g.fillRect(CX + 60, -E.H, 170, E.H * 2.5); g.fillStyle = alpha(MOON, 0.55); g.fillRect(CX + 60, -E.H, 7, E.H * 2.5); g.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 9; i++) g.fillRect(CX + 90 + (i % 3) * 40, -E.H + i * 260, 6, 160);
  });
  blurLayer(g, 10, (g) => { g.fillStyle = '#04060a'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(-60 + i * 230, E.H * 0.95, 220, 160, 0, 0, 7); g.fill(); } }, cam, 1.7);
} });

// s05 — "Seis anos atrás, o seu povo destruiu" — a emboscada antiga (sépia)
registerShot('s05', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.05 * k, x: 30 * k };
  const { GY, CX } = forest(g, t, cam, { time: 'night' });
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 4; i++) legion(g, { x: CX - 200 + i * 170 + t * 40, y: GY, s: 1.6, facing: 1, outfit: ROMANO, pose: posesAt(t, [[0, walkPose(t * 5 + i)], [0.5, POSES.handsOnHead]]), expr: t < 0.5 ? 'neutral' : 'scared', rim: rimOf('#ffd8a0') });
    for (let i = 0; i < 3; i++) { const p = ease.out(prog(t, 0.3 + i * 0.15, 0.9 + i * 0.15)); withSpear(g, { x: lerp(-150, CX - 340 + i * 220, p), y: GY - Math.sin(p * Math.PI) * 220, s: 1.8, facing: 1, outfit: GUERREIRO[i], pose: POSES.jump, expr: 'angry', rim: rimOf('#ffd8a0') }, -0.4, 300); }
  });
  sepia(g); FX.dust(g, t, { count: 50, color: '#ffe0b0', a: 0.35 });
  labelTitle(g, t, 'SEIS ANOS ANTES', 'ANO 9', E.H * 0.26, { at: 0.15, big: 90 });
} });

// s06 — "três legiões romanas inteiras numa emboscada." — as três águias riscadas
function eagle(g, x, y, s, c) {
  seg(g, [[x, y - 40 * s], [x, y + 220 * s]], 5 * s, c);
  g.strokeStyle = c; g.lineWidth = 5 * s; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x, y - 40 * s); g.quadraticCurveTo(x - 60 * s, y - 110 * s, x - 100 * s, y - 70 * s); g.quadraticCurveTo(x - 60 * s, y - 70 * s, x - 30 * s, y - 40 * s); g.stroke();
  g.beginPath(); g.moveTo(x, y - 40 * s); g.quadraticCurveTo(x + 60 * s, y - 110 * s, x + 100 * s, y - 70 * s); g.quadraticCurveTo(x + 60 * s, y - 70 * s, x + 30 * s, y - 40 * s); g.stroke();
  ring(g, x, y - 66 * s, 16 * s, 5 * s, c); seg(g, [[x - 50 * s, y + 10 * s], [x + 50 * s, y + 10 * s]], 5 * s, c);
}
registerShot('s06', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, k = ease.inOut(t / info.dur);
  g.save(); zoomAt(g, E.W / 2, E.H * 0.5, 1 + 0.04 * k);
  for (let i = 0; i < 3; i++) {
    const x = 220 + i * 320, y = 820, a = ease.outBack(prog(t, i * 0.12, i * 0.12 + 0.4)); if (a <= 0) continue;
    g.save(); g.translate(x, y); g.scale(a, a); circle(g, 0, 40, 140, alpha(bp, 0.06)); ring(g, 0, 40, 140, 3, alpha(bp, 0.5)); eagle(g, 0, 0, 1.1, bp); g.restore();
    cross(g, x, y + 40, 110, u.accent, prog(t, 0.9 + i * 0.45, 1.25 + i * 0.45));
  }
  g.restore();
  labelTitle(g, t, 'DESTRUÍDAS', '3 LEGIÕES', 420, { at: 0.1, big: 92 });
  text(g, 'NUMA EMBOSCADA', E.W / 2, 1120, { size: 38, color: u.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 2.0, 2.4)) });
} });

// s07 — "E agora, outro exército romano está preso no meio do pântano,"
registerShot('s07', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.06 + 0.06 * k, x: -40 + 60 * k };
  const { GY, CX } = marsh(g, t, cam, { time: 'dusk' });
  const row = (y, s, n, dx, d, dim) => layer(g, cam, d, (g) => {
    for (let i = 0; i < n; i++) { const x = -200 + i * dx + t * 26 * s, o = { x, y, s, facing: 1, outfit: ROMANO, pose: walkPose(t * 2.6 + i * 1.3), expr: 'sleepy', rim: rimOf('#ffb070', [1, -0.6]), dim, shadow: false };
      legion(g, o); if (i % 3 === 1) { seg(g, [[x + 20 * s, y - 100 * s], [x + 20 * s, y - 330 * s]], 4 * s, '#2a1e16'); circle(g, x + 20 * s, y - 330 * s, 16 * s, '#c8a050'); } }
    g.fillStyle = alpha('#141e24', 0.92); g.fillRect(-E.W, y - 46 * s, E.W * 3, 60 * s); g.fillStyle = alpha('#ffc890', 0.18); g.fillRect(-E.W, y - 46 * s, E.W * 3, 3);
  });
  row(GY - 160, 1.1, 10, 150, 0.6, 0.25); row(GY + 30, 2.0, 5, 290, 1, 0);
  FX.dust(g, t, { count: 30, color: '#ffd0a0', a: 0.25 });
} });

// s08 — "cansado, sem comida, cercado." — rosto do legionário
registerShot('s08', { draw(g, t, info) {
  blurLayer(g, 14, (g) => marsh(g, t, { z: 1.4, y: -200 }, { time: 'dusk' })); veil(g, '#0a0812', 0.35);
  const r = 320 * (1 + 0.04 * t), cx = E.W / 2, cy = E.H * 0.56;
  const look = t < 1.85 ? [0, 0.3] : [Math.sin((t - 1.85) * 6) * 0.9, -0.1];
  romanFace(g, cx, cy, r, { expr: t < 0.9 ? 'sleepy' : t < 1.85 ? 'sad' : 'scared', look, rimColor: '#ffb070', rimSide: -1, bags: true });
  FX.dust(g, t, { count: 30, color: '#ffd0a0', a: 0.3 });
} });

// s09 — "Você olha para o acampamento deles" — por cima do ombro
registerShot('s09', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  campOutside(g, t, { z: 1.2 + 0.08 * k, y: -60 }, { time: 'night' });
  const hx = 250 - 20 * k, hy = 1300, r = 300;
  g.save(); g.beginPath(); g.ellipse(hx + 40, hy + r * 1.5, r * 1.5, r * 0.9, 0, Math.PI, 0); g.fillStyle = '#1f3a5c'; g.fill(); g.restore();
  circle(g, hx + 8, hy, r * 1.04, alpha(MOON, 0.8)); circle(g, hx, hy + 6, r, '#06070c');
  for (let i = 0; i < 7; i++) { const a = -2.6 + i * 0.32; poly(g, [[hx + Math.cos(a) * r * 0.9, hy + Math.sin(a) * r * 0.9], [hx + Math.cos(a + 0.12) * r * 1.22, hy + Math.sin(a + 0.12) * r * 1.22], [hx + Math.cos(a + 0.24) * r * 0.9, hy + Math.sin(a + 0.24) * r * 0.9]], '#06070c'); }
  FX.dust(g, t, { count: 30, color: TORCH, a: 0.25 });
} });

// s10 — "e percebe uma coisa estranha." — seu rosto
registerShot('s10', { draw(g, t, info) {
  blurLayer(g, 14, (g) => campOutside(g, t, { z: 1.5, y: -100 }, { time: 'night' })); veil(g, '#05060c', 0.35);
  const r = 320 * (1 + 0.04 * t);
  bigFace(g, E.W / 2, E.H * 0.56, r, { outfit: VOCE, expr: t < 0.8 ? 'neutral' : 'confused', look: [0.3, -0.2], rimColor: MOON, rimSide: 1, blink: t > 1.2 && t < 1.32 });
  FX.dust(g, t, { count: 30, color: MOON, a: 0.3 });
} });

// cena de obra: o terreno com a vala sendo cavada (k = quanto já foi cavado)
function works(g, t, cam, o = {}) {
  const r = marsh(g, t, cam, { time: 'dusk' }), { GY, CX } = r;
  layer(g, cam, 0.92, (g) => {
    g.fillStyle = '#100c0a'; g.beginPath(); g.moveTo(-E.W, GY + 40); g.lineTo(CX - 260, GY + 40); g.lineTo(CX - 120, GY + 260); g.lineTo(CX + 140, GY + 260); g.lineTo(CX + 280, GY + 40); g.lineTo(E.W * 2, GY + 40); g.lineTo(E.W * 2, E.H * 2); g.lineTo(-E.W, E.H * 2); g.fill();
    g.fillStyle = '#2a2018'; g.beginPath(); g.moveTo(CX + 300, GY + 40); g.lineTo(CX + 380, GY - 140); g.lineTo(E.W * 2, GY - 140); g.lineTo(E.W * 2, GY + 40); g.fill();
    for (const x of [CX - 420, CX + 470]) torch(g, x, GY + 40, t, 1.3, x);
  });
  return r;
}
// s11 — "Eles não dormiram simplesmente no chão. Mesmo exaustos, antes de deitar," — cavando a vala
registerShot('s11', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.05 * k, y: 60 };
  const { GY, CX } = works(g, t, cam);
  layer(g, cam, 0.92, (g) => {
    for (let i = 0; i < 3; i++) {
      const x = CX - 110 + i * 110, up = Math.sin(t * 3.4 + i * 2) > 0, s = 1.5;
      const pose = up ? { ...POSES.pointUp, hF: [30, -230], hB: [20, -220] } : { ...POSES.crouch, hF: [56, -30], hB: [46, -34] };
      drawFigure(g, { x, y: GY + 255, s, facing: 1, outfit: ROMANO, pose, expr: 'sleepy', rim: rimOf(TORCH, [i ? 1 : -1, -0.6]) });
      const [hx, hy] = joint({ x, y: GY + 255, s, pose }, 'hF'); seg(g, [[hx, hy], [hx + 26, hy + (up ? -40 : 50)]], 5, '#3a2a1e'); poly(g, [[hx + 20, hy + (up ? -50 : 44)], [hx + 44, hy + (up ? -60 : 56)], [hx + 40, hy + (up ? -30 : 74)]], '#8a9098');
      if (!up) for (let p = 0; p < 4; p++) { const ph = ((t * 2 + p * 0.25 + i) % 1); circle(g, x + 40 + ph * 160, GY + 200 - Math.sin(ph * Math.PI) * 180, 7, '#4a3a2a'); }
    }
  });
  FX.dust(g, t, { count: 40, color: TORCH, a: 0.3 });
} });

// s12 — "cavaram uma vala em volta de tudo." — planta vista de cima
registerShot('s12', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, k = ease.inOut(t / info.dur), cx = E.W / 2, cy = 900;
  g.save(); zoomAt(g, cx, cy, 1.04 - 0.04 * k);
  rr(g, cx - 330, cy - 330, 660, 660, 60); g.strokeStyle = alpha(bp, 0.8); g.lineWidth = 3; g.stroke();
  for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { if ((i === 2 || i === 3) && (j === 2 || j === 3)) continue; rr(g, cx - 270 + i * 92, cy - 270 + j * 92, 60, 44, 6); g.strokeStyle = alpha(bp, 0.45); g.lineWidth = 2; g.stroke(); }
  rr(g, cx - 70, cy - 70, 140, 140, 12); g.strokeStyle = alpha(u.cream, 0.6); g.lineWidth = 3; g.stroke();
  // a vala se desenhando em volta
  const p = ease.inOut(prog(t, 0.15, 1.6)), per = 4 * 820 - 4 * 160 + 2 * Math.PI * 80;
  g.save(); g.setLineDash([per * p, per]); rr(g, cx - 410, cy - 410, 820, 820, 80); g.strokeStyle = GOLD; g.lineWidth = 14; g.stroke(); g.restore();
  glow(g, cx, cy, 600, GOLD, 0.06 * p);
  g.restore();
  labelTitle(g, t, 'EM VOLTA DE TUDO', 'A VALA', 300, { at: 0.2, big: 84 });
} });

// s13 / s14 — o corte da vala e do muro
const M2PX = 140;
function section(g, t, o) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui;
  const gy = 820, x0 = 230, w = 3.5 * M2PX, d = 3 * M2PX;
  seg(g, [[40, gy], [x0, gy]], 3, bp);
  g.strokeStyle = bp; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, gy); g.lineTo(x0 + w / 2 - 30, gy + d); g.lineTo(x0 + w / 2 + 30, gy + d); g.lineTo(x0 + w, gy); g.stroke();
  g.fillStyle = alpha(bp, 0.07); g.beginPath(); g.moveTo(x0, gy); g.lineTo(x0 + w / 2 - 30, gy + d); g.lineTo(x0 + w / 2 + 30, gy + d); g.lineTo(x0 + w, gy); g.fill();
  UI.lineFigure(g, { x: 130, y: gy, s: 1.05, pose: POSES.stand, color: alpha(u.cream, 0.85) });
  text(g, '1,7 M', 130, gy + 50, { size: 26, color: alpha(u.cream, 0.7), font: FONTS.ui, weight: 900 });
  const wallH = (o.wall ?? 0) * 1.4 * M2PX, wx0 = x0 + w + 10, wx1 = wx0 + 300;
  if (wallH > 2) { poly(g, [[wx0, gy], [wx0 + 60, gy - wallH], [wx1 - 40, gy - wallH], [wx1, gy]], alpha(bp, 0.18)); g.strokeStyle = bp; g.lineWidth = 3; g.beginPath(); g.moveTo(wx0, gy); g.lineTo(wx0 + 60, gy - wallH); g.lineTo(wx1 - 40, gy - wallH); g.lineTo(wx1, gy); g.stroke(); }
  if (wallH > 2) seg(g, [[wx1, gy], [E.W - 30, gy]], 3, bp);
  else seg(g, [[x0 + w, gy], [E.W - 30, gy]], 3, bp);
  return { gy, x0, w, d, wx0, wx1, wallH };
}
registerShot('s13', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  g.save(); zoomAt(g, E.W / 2, 900, 1.02 + 0.03 * k);
  const { gy, x0, w, d } = section(g, t, {});
  UI.dimension(g, t, { x1: x0 + w + 60, y1: gy, x2: x0 + w + 60, y2: gy + d, str: '', start: 0.5 });
  const a1 = ease.outBack(prog(t, 0.6, 0.95)); if (a1 > 0) { g.save(); g.translate(x0 + w + 90, gy + d / 2); g.scale(a1, a1); text(g, '3 M', 0, 0, { size: 64, color: GOLD, align: 'left', glow: 16, glowColor: alpha(GOLD, 0.6) }); text(g, 'DE FUNDO', 0, 56, { size: 26, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 }); g.restore(); }
  UI.dimension(g, t, { x1: x0, y1: gy - 60, x2: x0 + w, y2: gy - 60, str: '', start: 2.3 });
  const a2 = ease.outBack(prog(t, 2.4, 2.75)); if (a2 > 0) { g.save(); g.translate(x0 + w / 2, gy - 130); g.scale(a2, a2); text(g, '3,5 M', 0, 0, { size: 64, color: GOLD, glow: 16, glowColor: alpha(GOLD, 0.6) }); text(g, 'DE LARGURA', 0, -56, { size: 26, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); }
  g.restore();
} });
registerShot('s14', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), grow = ease.inOut(prog(t, 0.2, 1.6));
  g.save(); zoomAt(g, E.W / 2, 900, 1.05 + 0.03 * k);
  const { gy, x0, w, d, wx0, wx1 } = section(g, t, { wall: grow });
  for (let i = 0; i < 10; i++) { const ph = ((t * 1.2 + i / 10) % 1); if (t > 1.7) break; const sx = x0 + w / 2, ex = (wx0 + wx1) / 2; circle(g, lerp(sx, ex, ph), lerp(gy + d * 0.6, gy - 1.4 * M2PX * grow, ph) - Math.sin(ph * Math.PI) * 160, 8, alpha(GOLD, 0.8)); }
  text(g, 'MURO', (wx0 + wx1) / 2, gy - 1.4 * M2PX * grow - 50, { size: 44, color: GOLD, alpha: ease.out(prog(t, 1.2, 1.6)), spacing: 4 });
  g.restore();
} });

// alto do muro em obra (estacas)
function rampartScene(g, t, cam) {
  const r = marsh(g, t, cam, { time: 'night' }), { GY, CX } = r;
  layer(g, cam, 0.92, (g) => { g.fillStyle = linGrad(g, 0, GY - 120, 0, GY + 600, ['#2a2220', '#0a0808']); g.beginPath(); g.moveTo(-E.W, E.H * 2); g.lineTo(-E.W, GY - 100); g.lineTo(E.W * 2, GY - 100); g.lineTo(E.W * 2, E.H * 2); g.fill(); g.fillStyle = alpha(TORCH, 0.25); g.fillRect(-E.W, GY - 104, E.W * 3, 4); });
  return r;
}
// s15 — "E em cima do muro, fincaram estacas pontudas,"
registerShot('s15', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.05 * k, x: -20 };
  const { GY, CX } = rampartScene(g, t, cam);
  layer(g, cam, 0.92, (g) => {
    const n = Math.floor(4 + t * 5); for (let i = 0; i < n; i++) { const x = -200 + i * 46; if (x > E.W + 200) break; poly(g, [[x - 9, GY - 100], [x - 9, GY - 300], [x, GY - 330], [x + 9, GY - 300], [x + 9, GY - 100]], '#3a2a1e'); }
    torch(g, CX + 380, GY - 100, t, 1.4, 2);
    for (let i = 0; i < 2; i++) { const x = CX - 60 + i * 230, up = Math.sin(t * 5 + i * 2) > 0;
      const pose = up ? { ...POSES.pointUp, hF: [36, -250] } : { ...POSES.reach, hF: [60, -150] };
      drawFigure(g, { x, y: GY - 100, s: 1.8, facing: 1, outfit: ROMANO, pose, expr: 'sleepy', rim: rimOf(TORCH, [1, -0.5]) });
      const [hx, hy] = joint({ x, y: GY - 100, s: 1.8, pose }, 'hF'); rr(g, hx - 16, hy - 18, 40, 26, 4); g.fillStyle = '#5a4a3a'; g.fill(); seg(g, [[hx, hy], [hx - 4, hy + 40]], 5, '#3a2a1e'); }
  });
  FX.dust(g, t, { count: 30, color: TORCH, a: 0.3 });
} });
// s16 — "que cada soldado carregava nas costas."
registerShot('s16', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15, x: -40 + 60 * k };
  const { GY, CX } = marsh(g, t, cam, { time: 'dusk' });
  layer(g, cam, 1, (g) => {
    const x = CX - 160 + t * 70, s = 2.5, pose = walkPose(t * Math.PI * 2 * 0.7);
    const o = { x, y: GY + 20, s, facing: 1, outfit: ROMANO, pose, expr: 'sleepy', rim: rimOf('#ffb070', [1, -0.6]) };
    const [sx, sy] = joint(o, 'sh');
    for (const a of [-0.35, -0.2]) { const x0 = sx - Math.cos(a) * 260, y0 = sy - 110 - Math.sin(a) * 260; seg(g, [[x0, y0], [sx + 120, sy + 140 + a * 100]], 12, '#3a2a1e'); poly(g, [[x0 - 6, y0 + 6], [x0 - 24, y0 - 10], [x0 + 6, y0 - 8]], '#5a4430'); }
    legion(g, o);
    seg(g, [[sx - 20, sy + 20], [sx + 30, sy + 40]], 6, '#6a5040');
  });
  FX.dust(g, t, { count: 30, color: '#ffd0a0', a: 0.3 });
} });

// s17 — "Eles fazem isso toda santa noite." — lapso de noites
registerShot('s17', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), { GY, CX } = campOutside(g, t, { z: 1.02 + 0.04 * k }, { time: 'night' });
  for (let i = 0; i < 3; i++) { const ph = ((t * 1.4 + i / 3) % 1); FX.moon(g, lerp(-80, E.W + 80, ph), 520 - Math.sin(ph * Math.PI) * 260, 30); }
  const n = 1 + Math.floor(ease.in(prog(t, 0.1, info.dur)) * 40);
  UI.readout(g, { label: 'NOITE', value: String(n), x: E.W / 2, y: 330, align: 'center', size: 96, color: GOLD });
} });

// s18 — "Lá dentro, as sentinelas trocam de turno quatro vezes por noite," — troca da guarda + relógio de 4 turnos
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12 + 0.04 * k };
  const { GY, CX } = campInside(g, t, cam, { time: 'night' });
  layer(g, cam, 1, (g) => {
    torch(g, CX + 40, GY + 20, t, 1.6, 4);
    const out = lerp(CX + 140, CX + 700, ease.inOut(prog(t, 0.6, 2.6))), inn = lerp(CX - 700, CX - 150, ease.inOut(prog(t, 0.2, 2.0)));
    withSpear(g, { x: out, y: GY + 20, s: 2.0, facing: 1, outfit: ROMANO, pose: t > 0.6 && t < 2.6 ? walkPose(t * 5) : POSES.stand, expr: 'sleepy', rim: rimOf(TORCH, [-1, -0.5]) });
    withSpear(g, { x: inn, y: GY + 20, s: 2.0, facing: 1, outfit: ROMANO, pose: t > 0.2 && t < 2.0 ? walkPose(t * 5 + 1) : POSES.stand, expr: 'neutral', rim: rimOf(TORCH, [1, -0.5]) });
  });
  // relógio de 4 turnos
  const cx = E.W / 2, cy = 380, r = 110, U = S().ui;
  circle(g, cx, cy, r + 30, alpha(U.bpBg, 0.75)); ring(g, cx, cy, r, 4, alpha(U.blueprint, 0.6));
  for (let i = 0; i < 4; i++) { const p = ease.out(prog(t, 2.0 + i * 0.25, 2.25 + i * 0.25)); if (p <= 0) continue; g.strokeStyle = GOLD; g.lineWidth = 18; g.beginPath(); g.arc(cx, cy, r - 18, -Math.PI / 2 + i * Math.PI / 2 + 0.06, -Math.PI / 2 + i * Math.PI / 2 + (Math.PI / 2 - 0.12) * p); g.stroke(); }
  text(g, '4', cx, cy - 8, { size: 76, color: GOLD, alpha: ease.out(prog(t, 2.0, 2.4)) }); text(g, 'TURNOS', cx, cy + 46, { size: 24, color: U.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 2.0, 2.4)) });
} });

// s19 / s42 — a trombeta
export function hornShot(g, t, info, strong = false) {
  blurLayer(g, 14, (g) => campInside(g, t, { z: 1.4, y: -200 }, { time: strong ? 'dawn' : 'night' })); veil(g, '#05060c', 0.45);
  const k = ease.inOut(t / info.dur), s = 2.2 + 0.1 * k, at = strong ? 0.6 : 1.1;
  const sh = t > at && strong ? shake(t, 5, 18) : [0, 0];
  g.save(); g.translate(sh[0], sh[1]);
  const [bx, by] = cornu(g, E.W / 2 - 120, E.H * 0.47, s, '#d8b050');
  g.restore();
  if (t > at) { FX.rings(g, bx, by, t - at, { count: strong ? 5 : 3, r0: 40, r1: strong ? 900 : 600, speed: strong ? 1.6 : 1.1, color: GOLD, a: strong ? 0.6 : 0.45 }); glow(g, bx, by, 300, GOLD, 0.25); }
  FX.dust(g, t, { count: 30, color: GOLD, a: 0.3 });
}
registerShot('s19', { draw(g, t, info) { hornShot(g, t, info, false); } });

// s20 — "E se um romano dorme no posto, os próprios colegas" — sentinela cochilando
registerShot('s20', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.25 + 0.05 * k, x: -40 };
  const { GY, CX } = campInside(g, t, cam, { time: 'night' });
  layer(g, cam, 1, (g) => {
    torch(g, CX + 250, GY + 20, t, 1.5, 1);
    const nod = Math.max(0, Math.sin(t * 1.8)) * 10;
    const pose = { ...POSES.sad, head: [14, -186 + nod], hF: [30, -150], eF: [24, -132] };
    const o = { x: CX - 40, y: GY + 20, s: 2.4, facing: 1, outfit: ROMANO, pose, expr: 'sleepy', rim: rimOf(TORCH, [1, -0.5]) };
    const [hx, hy] = joint(o, 'hF'); spear(g, hx + 6, GY + 20, -Math.PI / 2 - 0.08, 520);
    legion(g, o);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.6 + i / 3) % 1; text(g, 'z', CX + 40 + ph * 80 + i * 10, GY - 520 - ph * 200, { size: 30 + ph * 26, color: alpha(S().ui.cream, 0.7 * Math.sin(ph * Math.PI)), font: FONTS.ui, weight: 900 }); }
  });
} });

// s21 — "espancam ele até a morte." — sombras na lona de uma tenda
registerShot('s21', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  g.fillStyle = '#05060c'; g.fillRect(0, 0, E.W, E.H);
  g.save(); zoomAt(g, E.W / 2, E.H * 0.5, 1.0 + 0.05 * k);
  poly(g, [[-60, 1400], [E.W / 2, 260], [E.W + 60, 1400]], '#c08a50'); glow(g, E.W / 2, 1000, 700, TORCH, 0.35);
  g.save(); g.beginPath(); g.moveTo(-60, 1400); g.lineTo(E.W / 2, 260); g.lineTo(E.W + 60, 1400); g.closePath(); g.clip();
  const ink = alpha('#2a1408', 0.85);
  for (let i = 0; i < 3; i++) { const x = 280 + i * 260, down = t > 0.35 + i * 0.12;
    const pose = down ? { ...POSES.point, hF: [70, -120], eF: [40, -140] } : { ...POSES.pointUp, hF: [24, -260] };
    drawFigure(g, { x, y: 1300, s: 2.3, facing: i === 2 ? -1 : 1, outfit: { top: 'none' }, pose, ink, inkFar: ink, rim: false, face: { hidden: true }, shadow: false });
    const [hx, hy] = joint({ x, y: 1300, s: 2.3, facing: i === 2 ? -1 : 1, pose }, 'hF'); seg(g, [[hx, hy], [hx + (i === 2 ? -1 : 1) * (down ? 90 : 20), hy + (down ? 60 : -110)]], 16, ink); }
  g.restore(); g.restore();
  if (t > 0.35) { g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = `rgba(200,40,30,${0.35 * (1 - prog(t, 0.35, 1.2))})`; g.fillRect(0, 0, E.W, E.H); g.restore(); }
} });
