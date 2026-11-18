// shots/04_espera.js — as casas de espera, o único sinal, quantos foram salvos, o lado bom, o gongo, Washington, final (s36–s47).
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { mortuary, stretcher, bedroom, bed1830, boxingRing, coffinTop, candle, bell, ringWaves, CANDLE, MOON } from '../sets/world.js';
import { labelTitle, bpTitle, stamp, cross, ageBadge } from '../sets/common.js';
import { camPath, punch, focus, dof, bokeh, fogDrift, shafts } from '/engine/cine.js';
import { VOCE, VIGIA, MEDICO, MAE, PAI, GOLD } from '../cast.js';
import { rimOf, W0, zoomAt, deitado } from './01_morte.js';

const HID = { hidden: true };
// fileiras de macas com cordões até o sino grande na parede
function salao(g, t, cam, o = {}) {
  const { GY, CX } = mortuary(g, t, cam);
  layer(g, cam, 0.55, (g) => { bell(g, CX, GY - 760, 1.6, o.swing || 0); for (let i = 0; i < 9; i++) { g.strokeStyle = alpha(GOLD, 0.25); g.lineWidth = 2; g.beginPath(); g.moveTo(CX, GY - 660); g.lineTo(CX - 520 + i * 130, GY - 200); g.stroke(); } for (let i = 0; i < 9; i++) stretcher(g, CX - 520 + i * 130, GY - 120, 0.45, { ch: 900, cdx: (CX - (CX - 520 + i * 130)) * 0.98 / 0.45 * 0 , cord: false }); });
  layer(g, cam, 0.8, (g) => { for (let i = 0; i < 6; i++) { const x = CX - 450 + i * 180; stretcher(g, x, GY + 90, 0.75, { cord: false }); g.strokeStyle = alpha(GOLD, 0.45); g.lineWidth = 2; g.beginPath(); g.moveTo(x - 15, GY + 15); g.lineTo(CX + (x - CX) * 0.3, GY - 660); g.stroke(); } });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 4; i++) { const x = CX - 420 + i * 280; stretcher(g, x, GY + 380, 1.15, { cord: false }); g.strokeStyle = alpha(GOLD, 0.6); g.lineWidth = 3; g.beginPath(); g.moveTo(x - 25, GY + 265); g.lineTo(CX + (x - CX) * 0.2, GY - 660); g.stroke(); circle(g, x - 25, GY + 265, 6, GOLD); } });
  return { GY, CX };
}

// s36 — "Na Alemanha criaram até "casas de espera" para os mortos."
registerShot('s36', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0, y: -20 }, { z: 1.1, y: 20 }, { hand: 3, seed: 2 });
  salao(g, t, cam); fogDrift(g, t, 1100, 300, '#5a6a9a', { a: 0.16, speed: 10, seed: 4 });
  labelTitle(g, t, 'ALEMANHA', 'CASAS DE ESPERA', 400, { at: 0.2, big: 86 });
  FX.dust(g, t, { count: 50, color: '#cfd8ff', a: 0.3 });
} });

// s37 — "A maior, em Munique, tinha lugar para 120 corpos, com os dedos amarrados a um sino bem forte."
registerShot('s37', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.12, y: 40 }, { z: 1.0, y: -30 }, { hand: 3, seed: 3 });
  const { GY, CX } = salao(g, t, cam, { swing: 0.03 * Math.sin(t * 1.5) });
  const t1 = W0('120', info), tS = W0('sino', info);
  labelTitle(g, t, 'A MAIOR', 'MUNIQUE', 330, { at: 0.1, big: 92, out: t1 - 0.4 });
  if (t > t1 - 0.2) { const n = Math.round(lerp(0, 120, clamp((t - t1 + 0.2) / 1.0))); text(g, String(n), E.W / 2, 400, { size: 140, color: GOLD, font: FONTS.ui, weight: 900, glow: 22, glowColor: 'rgba(255,150,60,.55)' }); text(g, 'CORPOS', E.W / 2, 490, { size: 44, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 8 }); }
  if (t > tS) glow(g, E.W / 2, 600, 260, GOLD, 0.3 * (0.6 + 0.4 * Math.sin(t * 6)));
  FX.dust(g, t, { count: 50, color: '#cfd8ff', a: 0.3 });
} });

// s38 — "Os corpos ficavam ali até começarem a apodrecer," — os dias passam
registerShot('s38', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.05 }, { z: 1.12 }, { hand: 2, seed: 4 });
  salao(g, t, cam); const day = Math.min(5, 1 + Math.floor(t / d * 5));
  g.save(); g.globalAlpha = 0.25 * (0.5 + 0.5 * Math.sin(t / d * 5 * Math.PI * 2)); g.fillStyle = '#ffd8a0'; g.fillRect(0, 0, E.W, E.H); g.restore();
  text(g, `DIA ${day}`, E.W / 2, 380, { size: 96, color: GOLD, font: FONTS.ui, weight: 900, spacing: 6, glow: 18, glowColor: 'rgba(255,150,60,.5)' });
  FX.dust(g, t, { count: 60, color: '#cfd8ff', a: 0.3 });
} });

// s39 — "porque para os médicos da época esse era o único sinal de morte garantido." — checklist em blueprint
registerShot('s39', { draw(g, t, info) {
  UI.blueprint(g); const u = S().ui, bp = UI.bpStroke();
  bpTitle(g, 'SINAIS DE MORTE', 400, ease.out(prog(t, 0.1, 0.5)));
  const L = [['PULSO', false], ['RESPIRAÇÃO', false], ['ESPELHO', false], ['DECOMPOSIÇÃO', true]], tU = W0('único', info);
  L.forEach(([s, ok], i) => { const at = ok ? tU - 0.2 : 0.3 + i * 0.35, a = ease.out(prog(t, at, at + 0.3)); if (a <= 0) return; const y = 600 + i * 150; text(g, s, 230, y, { size: 52, color: ok ? GOLD : u.cream, font: FONTS.ui, weight: 900, align: 'left', alpha: a, spacing: 2 }); if (ok) { g.strokeStyle = GOLD; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(860, y - 4); g.lineTo(890, y + 26); g.lineTo(950, y - 40); g.stroke(); } else cross(g, 900, y - 10, 30, u.accent, prog(t, at + 0.2, at + 0.5)); });
  if (t > tU) text(g, 'O ÚNICO GARANTIDO', E.W / 2, 1250, { size: 54, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tU, tU + 0.3)), glow: 16, glowColor: 'rgba(255,150,60,.5)' });
} });

// s40 — "E sabe quantas pessoas essas casas salvaram?" — você pensando
registerShot('s40', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0 }, { z: 1.1 }, { hand: 3, seed: 5 });
  blurLayer(g, 10, (g) => salao(g, t, cam), cam, 0.5); veil(g, '#000', 0.3);
  layer(g, cam, 1, (g) => bigFace(g, E.W / 2 - 80, E.H * 0.52, 280, { outfit: VOCE, expr: 'thinking', blink: 0, look: [0.7, -0.6], rimColor: MOON, rimSide: 1, tilt: 0.08 }));
  const a = ease.outBack(prog(t, 0.4, 0.8)); if (a > 0) text(g, '?', E.W - 250, 560 - 10 * Math.sin(t * 2), { size: 260 * a, color: GOLD, font: FONTS.ui, weight: 900, glow: 26, glowColor: 'rgba(255,150,60,.6)' });
} });

// s41 — "Um historiador foi atrás de cada história de sino tocando e de morto acordando." — o historiador (sem rosto) e os registros
registerShot('s41', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.05, x: 30 }, { z: 1.15, x: -20 }, { hand: 3, seed: 6 });
  const { GY, CX } = bedroom(g, t, cam);
  layer(g, cam, 1, (g) => {
    rr(g, CX - 380, GY - 150, 760, 34, 6); g.fillStyle = '#4a3424'; g.fill(); g.fillRect(CX - 350, GY - 116, 24, 160); g.fillRect(CX + 330, GY - 116, 24, 160);
    for (let s = 0; s < 3; s++) for (let i = 0; i < 6 + s * 2; i++) { g.fillStyle = i % 2 ? '#e8dcc0' : '#d8ccb0'; g.fillRect(CX + 80 + s * 90, GY - 156 - i * 12, 80, 10); }
    const r = rng(4); for (let i = 0; i < 5; i++) { const k = ease.out(prog(t, 0.3 + i * 0.7, 0.7 + i * 0.7)); if (k <= 0) continue; g.save(); g.translate(CX - 220 + i * 26, GY - 170 - i * 3); g.rotate((r() - 0.5) * 0.3); rr(g, -70, -50, 140, 100, 4); g.fillStyle = '#efe6d0'; g.fill(); g.restore(); stamp(g, CX - 220 + i * 26, GY - 180, t - 0.7 - i * 0.7, 'NÃO', { scale: 0.45 }); }
    drawFigure(g, { x: CX - 140, y: GY + 40, s: 1.6, facing: 1, outfit: { top: 'suit', color: '#4a4a6a', head: 'none' }, pose: breathe({ ...POSES.sit, hF: [44, -130], eF: [30, -118], head: [14, -176] }, t, 0.6, 3), face: HID, rim: rimOf(CANDLE, [1, -0.4]) });
    candle(g, CX + 330, GY - 150, t, 1.1);
  });
  glow(g, E.W / 2 + 300, GY - 260, 420, CANDLE, 0.16);
  labelTitle(g, t, 'UM', 'HISTORIADOR', 380, { at: 0.2, big: 92 });
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.3 });
} });

// s42 — "Resultado: nenhuma." — zero
registerShot('s42', { draw(g, t, info) {
  UI.blueprint(g); const u = S().ui, tN = W0('nenhuma', info), k = ease.outBack(prog(t, tN - 0.1, tN + 0.25));
  bpTitle(g, 'RESULTADO', 440, ease.out(prog(t, 0.05, 0.4)));
  g.save(); g.translate(E.W / 2, 860); g.scale(1 + punch(t, tN, 0.1), 1 + punch(t, tN, 0.1));
  if (k > 0) { g.save(); g.scale(k, k); ring(g, 0, 0, 230, 8, GOLD); text(g, '0', 0, 20, { size: 300, color: GOLD, font: FONTS.ui, weight: 900, glow: 30, glowColor: 'rgba(255,150,60,.6)' }); g.restore(); text(g, 'PESSOAS SALVAS', 0, 340, { size: 48, color: u.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: k }); }
  g.restore();
} });

// s43 — "E até hoje não existe nenhum caso registrado de alguém salvo por um caixão de segurança."
registerShot('s43', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, k = ease.inOut(t / info.dur);
  g.save(); zoomAt(g, E.W / 2, 860, 1 + 0.04 * k);
  g.save(); g.translate(E.W / 2, 900); g.rotate(-Math.PI / 2); coffinTop(g, 0, 0, 640, 260, alpha(bp, 0.06), { stroke: bp, w: 5 }); g.restore();
  seg(g, [[E.W / 2, 580], [E.W / 2, 420]], 6, bp); bell(g, E.W / 2 + 40, 420, 0.8, 0, bp);
  const tC = W0('caso', info); cross(g, E.W / 2, 760, 300, u.accent, prog(t, tC, tC + 0.6));
  g.restore();
  bpTitle(g, 'ATÉ HOJE', 300, ease.out(prog(t, 0.1, 0.5)));
  if (t > tC) text(g, '0 CASOS REGISTRADOS', E.W / 2, 1260, { size: 54, color: GOLD, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tC, tC + 0.3)), glow: 16, glowColor: 'rgba(255,150,60,.5)' });
} });

// s44 — "O lado bom é que os médicos daquela época erravam bem menos do que o povo achava."
registerShot('s44', { draw(g, t, info) {
  UI.blueprint(g); const u = S().ui;
  bpTitle(g, 'O LADO BOM', 380, ease.out(prog(t, 0.1, 0.5)));
  const tE = W0('erravam', info);
  [['MEDO DO POVO', 0.92, u.accent], ['ERRO DOS MÉDICOS', 0.14, GOLD]].forEach(([lab, v, c], i) => { const y = 640 + i * 230, a = ease.out(prog(t, 0.3 + i * 0.3, 0.6 + i * 0.3)), p = ease.out(prog(t, tE - 0.5 + i * 0.4, tE + 0.5 + i * 0.4)); text(g, lab, 110, y, { size: 46, color: u.cream, font: FONTS.ui, weight: 900, align: 'left', alpha: a, spacing: 2 }); rr(g, 110, y + 40, 860, 70, 35); g.fillStyle = alpha('#ffffff', 0.06 * a); g.fill(); if (p > 0) { rr(g, 110, y + 40, Math.max(70, 860 * v * p), 70, 35); g.fillStyle = alpha(c, 0.85); g.fill(); } });
} });

// s45 — "E "salvo pelo gongo"? Não vem dos caixões. Vem do boxe." — ringue
registerShot('s45', { draw(g, t, info) {
  const d = info.dur, tG = W0('gongo', info), tB = W0('boxe', info), cam0 = camPath(t, d, { z: 1.05 }, { z: 1.14 }, { hand: 4, seed: 7 }), cam = { ...cam0, z: cam0.z + punch(t, tG, 0.06) };
  const { GY, CX } = boxingRing(g, t, cam);
  layer(g, cam, 1, (g) => {
    const wob = Math.sin(t * 5) * 0.12;
    drawFigure(g, { x: CX - 200, y: GY + 20, s: 1.9, facing: 1, outfit: { top: 'none', legs: '#b03030', gloves: '#c03030' }, pose: breathe(t < tG ? POSES.ready : POSES.stand, t, 0.8, 1), expr: 'determined', rim: rimOf('#fff0d0', [0, -1]) });
    drawFigure(g, { x: CX + 220, y: GY + 20, s: 1.9, facing: -1, rot: t < tG ? wob : 0, outfit: { top: 'none', legs: '#3060b0', gloves: '#3050a0' }, pose: t < tG ? POSES.sad : POSES.relaxed, expr: t < tG ? 'worried' : 'happy', rim: rimOf('#fff0d0', [0, -1]) });
    bell(g, CX + 420, GY - 520, 1.0, t > tG ? 0.2 * Math.sin((t - tG) * 16) * Math.exp(-(t - tG) * 2) : 0); ringWaves(g, CX + 440, GY - 480, t, tG);
  });
  labelTitle(g, t, 'SALVO PELO', 'GONGO', 380, { at: tG - 0.3, big: 110, out: tB - 0.3 });
  labelTitle(g, t, 'NÃO VEM DOS CAIXÕES', 'VEM DO BOXE', 380, { at: tB - 0.2, big: 96 });
} });

// s46 — "Mesmo assim, até George Washington, no leito de morte, pediu para só ser colocado no túmulo três dias depois."
registerShot('s46', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.04, x: 20 }, { z: 1.16, x: -20, y: 20 }, { hand: 3, seed: 8 });
  const { GY, CX } = bedroom(g, t, cam);
  layer(g, cam, 1, (g) => {
    bed1830(g, CX - 420, GY + 40, 600); deitado(g, CX - 150, GY - 95, 1.25, { top: 'suit', color: '#e8e4dc', head: 'none' }, { face: HID, rim: rimOf(CANDLE, [0, -1]) });
    rr(g, CX + 230, GY - 120, 140, 160, 6); g.fillStyle = '#3a2a1e'; g.fill(); candle(g, CX + 300, GY - 120, t, 1.2);
    drawFigure(g, { x: CX + 400, y: GY + 60, s: 1.5, facing: -1, outfit: { top: 'suit', color: '#2a2a3a', head: 'none' }, pose: breathe(POSES.holdFront, t, 0.5, 4), face: HID, rim: rimOf(CANDLE, [-1, -0.4]) });
  });
  glow(g, E.W / 2 + 300, GY - 200, 500, CANDLE, 0.15);
  labelTitle(g, t, 'GEORGE WASHINGTON', '1799', 380, { at: 0.3, big: 110 });
  const t3 = W0('três', info); if (t > t3 - 0.2) ageBadge(g, t, '3 DIAS', { at: t3 - 0.2, y: 640 });
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.3 });
} });

// s47 — tela final
registerShot('s47', { draw(g, t, info) {
  const u = S().ui;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#070b18', '#0b1224', '#1a1a34']); g.fillRect(0, 0, E.W, E.H);
  FX.stars(g, t, { count: 100, area: [0, 0, E.W, E.H * 0.4] }); glow(g, E.W / 2, E.H * 0.95, E.W * 0.7, '#ff9a5a', 0.2);
  const a1 = ease.out(prog(t, 0.1, 0.5));
  text(g, 'Um sino no caixão', E.W / 2, 330, { size: 66, font: FONTS.serif, weight: 900, italic: true, color: u.cream, alpha: a1, glow: 18, glowColor: 'rgba(255,170,90,.5)' });
  text(g, 'ou esperar uns dias?', E.W / 2, 420, { size: 70, font: FONTS.serif, weight: 900, italic: true, color: GOLD, alpha: a1, glow: 18, glowColor: 'rgba(255,170,90,.5)' });
  [['SINO', '#5fe0d8', 0.35], ['ESPERAR', '#ffb070', 0.5]].forEach(([lab, c, at], i) => {
    const p = ease.outBack(prog(t, at, at + 0.4)); if (p <= 0) return;
    g.save(); g.translate(E.W / 2 + (i ? 230 : -230), 590); g.scale(p, p); rr(g, -200, -50, 400, 100, 50); g.strokeStyle = c; g.lineWidth = 5; g.stroke();
    text(g, lab, 0, 3, { size: 40, color: c, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore();
  });
  const tC = W0('Comenta', info), pb = ease.outBack(prog(t, Math.min(tC, 6) - 0.2, Math.min(tC, 6) + 0.2)); if (pb > 0) { g.save(); g.translate(E.W / 2, 750); g.scale(pb, pb); UI.bubble(g, 0, 0, { w: 560, h: 120, str: 'COMENTA AÍ', color: '#f4efe6' }); g.restore(); }
  const cast = [VIGIA, VOCE, MEDICO], y0 = 1400;
  cast.forEach((of, i) => { const kk = ease.out(prog(t, 0.3 + i * 0.1, 0.8 + i * 0.1)); drawFigure(g, { x: E.W / 2 + (i - 1) * 240, y: y0 + (1 - kk) * 40, s: i === 1 ? 2.3 : 2.0, facing: 1, outfit: of, pose: POSES.relaxed, expr: i === 1 ? 'thinking' : 'neutral', alpha: kk, rim: { color: '#ffb070', dir: [0, 1] } }); });
  veil(g, '#000', ease.in(prog(t, info.dur - 0.8, info.dur)));
} });
