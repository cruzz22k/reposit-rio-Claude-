// shots/02_madrugada.js — a madrugada: os gritos, o cavalo, o pânico, o general no portão, o conselho germânico (s22–s33).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, backdrop, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { forest, campOutside, campInside, gateInside, torch, spear, tent, horse } from '../sets/world.js';
import { labelTitle, cross, joint, ground } from '../sets/common.js';
import { withSpear, legion, romanFace } from './01_noite.js';
import { VOCE, GUERREIRO, ROMANO, CECINA, ARMINIO, INGUIOMERO, SEM_ROSTO, GOLD } from '../cast.js';

const rimOf = (c, dir = [0.5, -1]) => ({ color: c, dir, w: 5 });
const MOON = '#a9b8ff', TORCH = '#ffb45a';
function zoomAt(g, cx, cy, z) { g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); }
function torchIn(g, o, t) { const [hx, hy] = joint(o, 'hF'); torch(g, hx + 4, hy + 40, t, (o.s ?? 1) * 0.7, o.x); }

// s22 — "Você passa a noite gritando e cantando com os outros guerreiros,"
registerShot('s22', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12 + 0.05 * k, x: -30 + 40 * k };
  const { GY, CX } = forest(g, t, cam, { time: 'night' });
  layer(g, cam, 1, (g) => {
    const shout = { ...POSES.pointUp, hF: [30, -250], eF: [24, -210], head: [10, -212] };
    const spots = [[CX - 420, 1.7, GUERREIRO[0]], [CX - 220, 1.9, GUERREIRO[1]], [CX + 230, 1.8, GUERREIRO[3]], [CX + 420, 1.6, GUERREIRO[2]]];
    spots.forEach(([x, s, of], i) => { const o = { x, y: GY - 20 + i % 2 * 20, s, facing: x < CX ? 1 : -1, outfit: of, pose: breathe(shout, t * 1.6, 1.4, i), expr: 'shocked', talk: 0.5 + 0.5 * Math.sin(t * 9 + i), rim: rimOf(TORCH, [0, -1]), dim: 0.12 }; drawFigure(g, o); torchIn(g, o, t); });
    const me = { x: CX, y: GY + 30, s: 2.3, facing: 1, outfit: VOCE, pose: breathe(shout, t * 1.6, 1.4, 9), expr: 'shocked', talk: 0.5 + 0.5 * Math.sin(t * 8), rim: rimOf(TORCH, [0, -1]) };
    drawFigure(g, me); torchIn(g, me, t);
    FX.rings(g, CX + 40, GY - 470, t, { count: 4, r0: 40, r1: 520, speed: 1.3, color: '#ffe0b0', a: 0.35 });
  });
  FX.dust(g, t, { count: 50, color: TORCH, a: 0.35 });
} });

// s23 — "só pra não deixar eles dormirem." — dentro da tenda, olhos abertos
registerShot('s23', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  g.fillStyle = '#120e10'; g.fillRect(0, 0, E.W, E.H);
  g.save(); zoomAt(g, E.W / 2, E.H * 0.55, 1.0 + 0.06 * k);
  poly(g, [[-200, 1500], [E.W / 2, 300], [E.W + 200, 1500]], '#3a2e2a'); poly(g, [[E.W / 2, 300], [E.W + 200, 1500], [E.W / 2 + 140, 1500]], '#2a201e');
  glow(g, E.W * 0.75, 900, 520, '#ffe0b0', 0.12 + 0.08 * Math.sin(t * 9));
  rr(g, 120, 1180, 840, 70, 30); g.fillStyle = '#4a4038'; g.fill();
  drawFigure(g, { x: 560, y: 1200, s: 2.3, rot: -Math.PI / 2, facing: 1, outfit: ROMANO, pose: POSES.lie, expr: 'worried', look: [0.6, -0.5], rim: rimOf('#ffd8a0', [1, -0.2]), shadow: false });
  rr(g, 520, 1150, 380, 90, 30); g.fillStyle = '#5a4a40'; g.fill();
  g.restore();
  FX.rings(g, E.W + 60, 900, t, { count: 4, r0: 60, r1: 700, speed: 1.4, color: '#ffe0b0', a: 0.3 });
} });

// s24 — "E funciona." — rosto romano com olheiras
registerShot('s24', { draw(g, t, info) {
  blurLayer(g, 14, (g) => campInside(g, t, { z: 1.4, y: -150 }, { time: 'night' })); veil(g, '#05060c', 0.35);
  romanFace(g, E.W / 2, E.H * 0.56, 320 * (1 + 0.05 * t), { expr: 'sleepy', look: [0, 0.2], rimColor: TORCH, rimSide: -1, bags: true });
} });

// s25 — "De madrugada, um cavalo se solta lá dentro e sai correndo entre as barracas."
registerShot('s25', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15, x: lerp(-120, 120, k) };
  const { GY, CX } = campInside(g, t, cam, { time: 'night' });
  layer(g, cam, 1, (g) => {
    const run = t > 0.6, x = run ? lerp(-300, E.W + 400, ease.in(prog(t, 0.6, info.dur))) : -300 + Math.sin(t * 8) * 10;
    horse(g, x, GY - 50, 2.1, t * (run ? 14 : 4), 1, '#14100e', alpha(TORCH, 0.6));
    if (run) for (let i = 0; i < 6; i++) { const ph = (t * 3 + i / 6) % 1; circle(g, x - 140 - ph * 200, GY + 10 - ph * 40, 14 + ph * 30, alpha('#8a7a68', 0.35 * (1 - ph))); }
    drawFigure(g, { x: CX + 300, y: GY + 30, s: 1.9, facing: -1, outfit: ROMANO, pose: t > 1.6 ? POSES.handsOnHead : POSES.stand, expr: t > 1.6 ? 'shocked' : 'sleepy', rim: rimOf(TORCH, [-1, -0.5]) });
  });
  FX.dust(g, t, { count: 40, color: TORCH, a: 0.3 });
  labelTitle(g, t, 'DE MADRUGADA', 'UM CAVALO SOLTO', 330, { at: 0.2, big: 64, out: 2.6 });
} });

// s26 — "Os romanos acham que vocês invadiram e correm pros portões, em pânico."
registerShot('s26', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.05 * k, x: 30 };
  const { GY, CX } = gateInside(g, t, cam, { time: 'night', open: 0.15 });
  layer(g, cam, 1, (g) => {
    const r = rng(5);
    for (let i = 0; i < 7; i++) { const d = r(), s = 1.4 + d * 1.0, dir = i % 2 ? 1 : -1, x = (dir > 0 ? -200 : E.W + 200) + dir * t * (260 + d * 160) + (i - 3) * 60, y = GY + 30 + d * 120;
      drawFigure(g, { x, y, s, facing: dir, outfit: ROMANO, pose: walkPose(t * 9 + i, { run: true }), expr: 'scared', rim: rimOf(TORCH, [-dir, -0.5]) }); }
  });
  FX.speedLines(g, t, { cx: CX, cy: GY - 260, count: 30, a: 0.15 });
  FX.dust(g, t, { count: 40, color: TORCH, a: 0.3 });
} });

// s27 — "O general deles, Cecina, se joga no chão, deitado na frente do portão,"
registerShot('s27', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15 + 0.06 * k, y: 60 };
  const { GY, CX } = gateInside(g, t, cam, { time: 'night', open: 0.6 });
  layer(g, cam, 1, (g) => {
    const down = ease.inOut(prog(t, 1.6, 2.3));
    if (down < 1) drawFigure(g, { x: CX - 40, y: GY + 10, s: 2.2, facing: 1, outfit: CECINA, pose: posesAt(t, [[0, POSES.stand], [1.2, POSES.crouch]]), face: SEM_ROSTO, rim: rimOf(TORCH, [0, -1]), alpha: 1 - down });
    if (down > 0) drawFigure(g, { x: CX + 230, y: GY + 195, s: 2.2, rot: -Math.PI / 2, facing: 1, outfit: CECINA, pose: POSES.lie, face: SEM_ROSTO, rim: rimOf(TORCH, [0, -1]), alpha: down, shadow: false });
  });
  labelTitle(g, t, 'O GENERAL', 'CECINA', 330, { at: 1.15, big: 90 });
} });

// s28 — "pra que ninguém fuja sem pisar em cima dele."
registerShot('s28', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.2 + 0.04 * k, x: -40, y: 80 };
  const { GY, CX } = gateInside(g, t, cam, { time: 'night', open: 0.6 });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: CX + 230, y: GY + 195, s: 2.2, rot: -Math.PI / 2, facing: 1, outfit: CECINA, pose: POSES.lie, face: SEM_ROSTO, rim: rimOf(TORCH, [0, -1]), shadow: false });
    for (let i = 0; i < 3; i++) { const stop = CX - 120 - i * 170, x = lerp(-200 - i * 200, stop, ease.out(prog(t, 0, 0.9 + i * 0.2)));
      drawFigure(g, { x, y: GY + 20 + i * 10, s: 2.0 - i * 0.15, facing: 1, outfit: ROMANO, pose: t < 0.9 + i * 0.2 ? walkPose(t * 9 + i, { run: true }) : (i === 0 ? POSES.handsOnHead : POSES.stand), expr: t < 1 ? 'scared' : 'shocked', look: [0.6, 0.6], rim: rimOf(TORCH, [1, -0.5]) }); }
  });
} });

// s29 — "O seu líder, Armínio, quer esperar."
function council(g, t, cam, leader, pose) {
  const { GY, CX } = forest(g, t, cam, { time: 'night' });
  layer(g, cam, 1, (g) => {
    torch(g, CX - 330, GY + 20, t, 1.5, 1); torch(g, CX + 360, GY + 20, t, 1.5, 2);
    for (let i = 0; i < 3; i++) withSpear(g, { x: CX - 300 + i * 120, y: GY + 10, s: 1.5, facing: 1, outfit: GUERREIRO[i], pose: breathe(POSES.stand, t, 0.5, i), expr: 'neutral', rim: rimOf(TORCH, [0, -1]), dim: 0.2 });
    drawFigure(g, { x: CX + 170, y: GY + 30, s: 2.4, facing: -1, outfit: leader, pose: breathe(pose, t, 0.5, 4), face: SEM_ROSTO, rim: rimOf(TORCH, [-1, -0.4]) });
  });
  return { GY, CX };
}
registerShot('s29', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  council(g, t, { z: 1.12 + 0.05 * k }, ARMINIO, posesAt(t, [[0, POSES.stand], [1.2, POSES.explain]]));
  labelTitle(g, t, 'O SEU LÍDER', 'ARMÍNIO', 330, { at: 0.75, big: 90 });
} });

// s30 — "Deixa eles saírem. No pântano, a gente acaba com eles." — o plano em traço
registerShot('s30', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, k = ease.inOut(t / info.dur), cx = E.W / 2;
  g.save(); zoomAt(g, cx, 900, 1.02 + 0.03 * k);
  rr(g, cx - 170, 420, 340, 300, 30); g.strokeStyle = bp; g.lineWidth = 4; g.stroke(); text(g, 'ACAMPAMENTO', cx, 570, { size: 30, color: u.cream, font: FONTS.ui, weight: 900, spacing: 3 });
  g.strokeStyle = alpha(bp, 0.45); g.lineWidth = 3; for (let j = 0; j < 6; j++) { g.beginPath(); for (let x = 140; x < E.W - 140; x += 20) g.lineTo(x, 1000 + j * 50 + Math.sin(x * 0.03 + j) * 8); g.stroke(); }
  text(g, 'PÂNTANO', cx, 1290, { size: 36, color: alpha(u.cream, 0.8), font: FONTS.ui, weight: 900, spacing: 6 });
  const p = ease.inOut(prog(t, 0.2, 1.4)); g.setLineDash([16, 14]); g.strokeStyle = u.accent; g.lineWidth = 6; g.beginPath(); g.moveTo(cx, 720); g.lineTo(cx, lerp(720, 1130, p)); g.stroke(); g.setLineDash([]);
  if (p > 0.95) poly(g, [[cx - 18, 1120], [cx + 18, 1120], [cx, 1150]], u.accent);
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) { const a = ease.outBack(prog(t, 1.6 + i * 0.12, 1.9 + i * 0.12)); if (a <= 0) continue; const x = cx + sx * (230 + i * 70), y = 1040 + i * 60; g.save(); g.translate(x, y); g.scale(a, a); poly(g, [[0, -24], [20, 14], [-20, 14]], GOLD); g.restore(); }
  for (let i = 0; i < 3; i++) cross(g, cx - 80 + i * 80, 1130, 34, u.accent, prog(t, 2.4 + i * 0.1, 2.7 + i * 0.1));
  g.restore();
  labelTitle(g, t, 'O PLANO', 'ESPERAR', 290, { at: 0.1, big: 84 });
} });

// s31 — "Mas o tio dele, Inguiomero, quer atacar agora, ao amanhecer."
registerShot('s31', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), up = posesAt(t, [[0, POSES.stand], [1.7, { ...POSES.pointUp, hF: [26, -262] }]]);
  const { GY, CX } = council(g, t, { z: 1.15 + 0.05 * k, x: 40 }, INGUIOMERO, up);
  layer(g, { z: 1.15 + 0.05 * k, x: 40 }, 1, (g) => { if (t > 1.7) { const o = { x: CX + 170, y: GY + 30, s: 2.4, facing: -1, pose: up }; const [hx, hy] = joint(o, 'hF'); seg(g, [[hx, hy + 20], [hx - 6, hy - 170]], 9, '#c8d0d8'); seg(g, [[hx - 22, hy + 6], [hx + 22, hy + 6]], 8, '#6a5030'); FX.sparkle(g, hx - 6, hy - 170, 30, '#ffffff', 0.8); } });
  labelTitle(g, t, 'O TIO DELE', 'INGUIOMERO', 330, { at: 1.0, big: 82 });
} });

// s32 — "E a maioria concorda com ele." — lanças para o alto
registerShot('s32', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.04 * k };
  const { GY, CX } = forest(g, t, cam, { time: 'night' });
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 7; i++) { const x = CX - 450 + i * 150, s = 1.5 + (i % 2) * 0.3, up = ease.out(prog(t, 0.1 + (i % 4) * 0.08, 0.4 + (i % 4) * 0.08));
      const of = i === 3 ? VOCE : GUERREIRO[i % 4], pose = { ...POSES.stand, hF: [lerp(13, 26, up), lerp(-101, -250, up)], eF: [lerp(9, 22, up), lerp(-137, -206, up)] };
      withSpear(g, { x, y: GY + 20 + (i % 2) * 30, s, facing: 1, outfit: of, pose, expr: 'angry', rim: rimOf(MOON, [0.4, -1]), dim: i === 3 ? 0 : 0.15 }, -Math.PI / 2 + 0.05, 300); }
  });
  FX.dust(g, t, { count: 40, color: MOON, a: 0.3 });
} });

// s33 — "O sol nasce."
registerShot('s33', { draw(g, t, info) {
  const k = ease.out(t / info.dur), { GY } = campOutside(g, t, { z: 1.04 + 0.04 * k }, { time: 'dawn', big: true, torches: false, sunY: lerp(1050, 820, k) });
  FX.godRays(g, E.W / 2 - 240, lerp(1050, 820, k), { count: 9, angle: -Math.PI / 2, spread: Math.PI * 1.4, len: 1600, color: '#ffc890', a: 0.07, t });
} });
