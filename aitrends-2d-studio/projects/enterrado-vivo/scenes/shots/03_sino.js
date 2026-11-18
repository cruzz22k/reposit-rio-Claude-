// shots/03_sino.js — você puxa, o sino toca, o vigia, o fole, as patentes, o médico que se enterrou, o problema (s24–s35).
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { cemetery, underground, coffinInside, coffinTop, lantern, bell, ringWaves, bellows, shovel, CANDLE, MOON } from '../sets/world.js';
import { labelTitle, bpTitle, stamp, joint } from '../sets/common.js';
import { camPath, punch, focus, dof, bokeh, fogDrift, shafts, foreLeaves } from '/engine/cine.js';
import { VOCE, VIGIA, MEDICO, COVEIRO, GOLD } from '../cast.js';
import { rimOf, W0, zoomAt, deitado } from './01_morte.js';
import { tubo, postoSino } from './02_caixao.js';

const AR = '#7fc8ff', HID = { hidden: true };
const sinoBalanco = (t, t0) => t > t0 ? 0.35 * Math.sin((t - t0) * 14) * Math.exp(-(t - t0) * 1.2) : 0;
const xray = (g, CX, cy) => { g.fillStyle = '#120c08'; g.fillRect(CX - 254, cy - 134, 508, 118); };

// s24 — "Você puxa. Lá em cima, o sino toca." — a mão puxa a corda; corta para o sino
registerShot('s24', { draw(g, t, info) {
  const d = info.dur, tL = W0('Lá', info), tP = W0('puxa', info);
  if (t < tL - 0.1) {
    const cam = camPath(t, tL, { z: 1.0 }, { z: 1.08 }, { hand: 4, seed: 3 }); coffinInside(g, t, cam, { light: 0.2 });
    const pull = ease.inOut(prog(t, tP - 0.1, tP + 0.35)), hx = E.W / 2 + 120, hy = lerp(700, 1050, pull);
    layer(g, cam, 1, (g) => { seg(g, [[hx, -200], [hx, hy]], 6, GOLD); bigFace(g, E.W / 2 - 140, 1620, 300, { outfit: VOCE, expr: 'determined', blink: 0, look: [0.6, -1], rimColor: '#ffb070', rimSide: 1 }); seg(g, [[hx + 140, 2100], [hx + 40, hy + 120], [hx, hy + 20]], 66, '#3a6ea5'); circle(g, hx, hy, 50, S().ink); });
    veil(g, '#000', 0.15);
  } else {
    const tt = t - tL, cam0 = camPath(tt, d - tL, { z: 1.25, y: 120 }, { z: 1.32, y: 140 }, { hand: 5, seed: 4 }), cam = { ...cam0, z: cam0.z + punch(tt, 0.05, 0.08) };
    const { GY, CX } = cemetery(g, t, cam, { clear: true });
    layer(g, cam, 1, (g) => { postoSino(g, CX - 40, GY + 40, 2.4, sinoBalanco(tt, 0.05)); ringWaves(g, CX + 85, GY - 470, tt, 0.05); ringWaves(g, CX + 85, GY - 470, tt, 0.75); });
    fogDrift(g, t, GY, 260, '#4a5a8a', { a: 0.22, speed: 18, seed: 6 });
    text(g, 'DIM-DOM', E.W / 2, 360, { size: 60, color: GOLD, font: FONTS.ui, weight: 900, spacing: 8, alpha: ease.out(prog(tt, 0.05, 0.3)), glow: 16, glowColor: 'rgba(255,150,60,.5)' });
  }
  FX.dust(g, t, { count: 30, color: '#cfd8ff', a: 0.25 });
} });

// s25 — "O vigia noturno do cemitério ouve." — o vigia com a lanterna para e vira a cabeça
registerShot('s25', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.08, x: 40 }, { z: 1.16, x: -10 }, { hand: 4, seed: 5 });
  const { GY, CX } = cemetery(g, t, cam);
  const tO = W0('ouve', info), stop = ease.inOut(prog(t, tO - 0.6, tO)), turn = ease.inOut(prog(t, tO - 0.2, tO + 0.3));
  layer(g, cam, 0.6, (g) => { postoSino(g, CX + 330, GY - 80, 0.9, 0.2 * Math.sin(t * 9)); ringWaves(g, CX + 380, GY - 260, t, 0.0, GOLD, 3); ringWaves(g, CX + 380, GY - 260, t, 1.0, GOLD, 3); });
  layer(g, cam, 1, (g) => {
    const x = CX - 260 + 140 * ease.out(clamp(t / (tO - 0.3))), pose = stop < 1 ? blendPose(walkPose(t * 3), POSES.stand, stop) : POSES.stand;
    const o = { x, y: GY + 170, s: 1.9, facing: 1, outfit: VIGIA, pose: breathe({ ...pose, head: [lerp(3, 12, turn), -208], hF: [40, -150], eF: [26, -128] }, t, 0.6, 2), expr: turn > 0.5 ? 'surprised' : 'neutral', look: [lerp(0, 1, turn), -0.2], rim: rimOf(CANDLE, [1, -0.4]) };
    drawFigure(g, o); const [hx, hy] = joint(o, 'hF'); lantern(g, hx + 6, hy + 90, t, 1.1);
  });
  fogDrift(g, t, GY + 80, 240, '#4a5a8a', { a: 0.2, speed: 18, seed: 9 });
  foreLeaves(g, t, cam, { side: 1, y: E.H * 0.04, amount: 12, seed: 2 });
  FX.dust(g, t, { count: 40, color: '#cfd8ff', a: 0.28 });
} });

// s26 — "Ele enfia um segundo tubo no caixão e bombeia ar pra dentro com um fole," — o vigia ajoelhado no túmulo
registerShot('s26', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.12, y: 60 }, { z: 1.2, y: 90 }, { hand: 4, seed: 6 });
  const { GY, CX } = cemetery(g, t, cam, { clear: true });
  const tF = W0('bombeia', info), pump = t > tF ? 0.5 + 0.5 * Math.sin((t - tF) * 7) : 0;
  layer(g, cam, 1, (g) => {
    g.fillStyle = '#4a382a'; g.beginPath(); g.ellipse(CX + 60, GY + 120, 360, 60, 0, Math.PI, 0); g.fill();
    postoSino(g, CX + 330, GY + 110, 1.5, 0.08 * Math.sin(t * 6));
    tubo(g, CX + 40, GY + 130, GY - 40, '#9a9aa6', 26);
    const o = { x: CX - 240, y: GY + 150, s: 1.8, facing: 1, outfit: VIGIA, pose: breathe({ ...POSES.kneel, hF: [lerp(70, 92, pump), -110], hB: [lerp(60, 82, pump), -96] }, t, 0.6, 3), expr: 'determined', look: [1, 0.3], rim: rimOf(CANDLE, [1, -0.4]) };
    drawFigure(g, o); bellows(g, CX - 60, GY - 30, 1.3, pump); seg(g, [[CX + 50, GY - 30], [CX + 40, GY - 30]], 10, '#8a7a6a');
    lantern(g, CX - 420, GY + 150, t, 1.1);
    if (t > tF) for (let i = 0; i < 4; i++) { const k = ((t - tF) * 1.6 + i * 0.25) % 1; g.fillStyle = alpha(AR, 0.8 * (1 - k)); g.beginPath(); g.moveTo(CX + 40, GY - 20 + k * 150); g.lineTo(CX + 25, GY - 40 + k * 150); g.lineTo(CX + 55, GY - 40 + k * 150); g.fill(); }
  });
  const tT = W0('segundo', info); if (t > tT) text(g, '2º TUBO: AR', E.W / 2, 380, { size: 52, color: AR, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tT, tT + 0.3)) });
  FX.dust(g, t, { count: 40, color: '#cfd8ff', a: 0.28 });
} });

// s27 — "enquanto cavam pra te tirar dali." — corte: o ar desce; dois coveiros cavam
registerShot('s27', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0, y: -40 }, { z: 1.06, y: 0 }, { hand: 4, seed: 7 });
  const { CX, sy, cy } = underground(g, t, cam, { sy: 620, cy: 1500 });
  layer(g, cam, 1, (g) => {
    xray(g, CX, cy); deitado(g, CX - 20, cy - 40, 0.55, VOCE, { blink: 0, expr: 'scared' });
    tubo(g, CX - 190, cy - 150, sy - 40, '#9a9aa6', 22); tubo(g, CX + 60, cy - 150, sy - 20, '#9a9aa6', 22);
    for (let i = 0; i < 6; i++) { const k = (t * 1.4 + i / 6) % 1; g.fillStyle = alpha(AR, 0.85); g.beginPath(); const y = lerp(sy, cy - 150, k); g.moveTo(CX + 60, y + 18); g.lineTo(CX + 46, y); g.lineTo(CX + 74, y); g.fill(); }
    glow(g, CX + 60, cy - 120, 160, AR, 0.25);
    for (const [x, ph] of [[CX - 330, 0], [CX + 330, 1.5]]) { const dig = 0.5 + 0.5 * Math.sin(t * 6 + ph); drawFigure(g, { x, y: sy - 10, s: 1.3, facing: x < CX ? 1 : -1, outfit: COVEIRO, pose: blendPose(POSES.crouch, POSES.stand, dig), expr: 'determined', rim: rimOf(MOON, [0, -1]) }); shovel(g, x + (x < CX ? 60 : -60), sy - 200 + dig * 60, x < CX ? -0.5 : 0.5, 0.9); for (let k = 0; k < 4; k++) { const r = rng(k + ph * 10), f = ((t * 1.5 + r()) % 1); g.fillStyle = '#5a4434'; g.fillRect(x + (x < CX ? 1 : -1) * (40 + f * 160), sy - 160 - Math.sin(f * Math.PI) * 140, 9, 9); } }
  });
  FX.dust(g, t, { count: 30, color: '#d8c0a0', a: 0.25 });
} });

// s28 — "Parece invenção, mas era real." — patentes em blueprint
function patente(g, x, y, rot, a, seed) { g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = a; rr(g, -190, -260, 380, 520, 6); g.fillStyle = '#e8dcc0'; g.fill(); text(g, 'PATENTE', 0, -205, { size: 36, color: '#2a2018', font: FONTS.ui, weight: 900, spacing: 4 }); g.save(); g.translate(0, -40); g.rotate(-Math.PI / 2); coffinTop(g, 0, 0, 240, 110, 'rgba(0,0,0,0)', { stroke: '#2a3a6a', w: 3 }); g.restore(); seg(g, [[0, -170], [0, -110]], 3, '#2a3a6a'); circle(g, 0, -176, 10, '#2a3a6a'); const r = rng(seed); for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(40,30,20,.35)'; g.fillRect(-150, 120 + i * 30, 300 * (0.5 + r() * 0.5), 8); } g.restore(); }
registerShot('s28', { draw(g, t, info) {
  UI.blueprint(g); const k = ease.inOut(t / info.dur);
  g.save(); zoomAt(g, E.W / 2, 900, 1 + 0.05 * k);
  [[-260, -0.16, 0], [0, 0.02, 0.15], [260, 0.14, 0.3]].forEach(([dx, r, at], i) => patente(g, E.W / 2 + dx, 900 + Math.abs(dx) * 0.15, r, ease.out(prog(t, at, at + 0.4)), i + 3));
  g.restore();
  bpTitle(g, 'PARECE INVENÇÃO...', 380, ease.out(prog(t, 0.1, 0.5)));
  const tR = W0('real', info); stamp(g, E.W / 2, 1230, t - tR, 'ERA REAL', { rot: -0.1 });
} });

// s29 — "Só na Alemanha, mais de 30 modelos de caixão de segurança foram patenteados no fim dos anos 1800." — grade de modelos
registerShot('s29', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, t3 = W0('30', info);
  labelTitle(g, t, 'SÓ NA', 'ALEMANHA', 420, { at: 0.1, big: 96 });
  for (let i = 0; i < 32; i++) { const c = i % 6, r = Math.floor(i / 6), x = 190 + c * 140, y = 640 + r * 120, k = ease.outBack(prog(t, t3 - 0.6 + i * 0.05, t3 - 0.3 + i * 0.05)); if (k <= 0) continue; g.save(); g.translate(x, y); g.scale(k, k); g.rotate(-Math.PI / 2); coffinTop(g, 0, 0, 90, 44, alpha(bp, 0.08), { stroke: i % 5 === 0 ? GOLD : bp, w: 3 }); g.restore(); seg(g, [[x, y - 45], [x, y - 62]], 2, alpha(bp, 0.7)); }
  const n = Math.round(lerp(0, 30, clamp((t - t3 + 0.6) / 1.6))); if (t > t3 - 0.6) text(g, n >= 30 ? '30+' : String(n), E.W / 2, 1330 - 120, { size: 110, color: GOLD, font: FONTS.ui, weight: 900, glow: 22, glowColor: 'rgba(255,150,60,.55)' });
  const tF = W0('fim', info); if (t > tF) text(g, 'FIM DOS ANOS 1800', E.W / 2, 1290, { size: 40, color: u.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, tF, tF + 0.3)) });
} });

// s30 — "Um médico alemão se enterrou vivo pra testar o dele." — silhueta sem rosto no caixão de teste
registerShot('s30', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.2, y: 260 }, { z: 1.05, y: 60 }, { hand: 3, seed: 8 });
  const { CX, sy, cy } = underground(g, t, cam, { sy: 620, cy: 1500 });
  layer(g, cam, 1, (g) => { xray(g, CX, cy); deitado(g, CX - 20, cy - 40, 0.55, MEDICO, { face: HID, rim: rimOf('#ffb070', [0, -1]) }); glow(g, CX, cy - 75, 200, '#ffb070', 0.2); tubo(g, CX - 190, cy - 150, sy - 40, '#9a9aa6', 22); postoSino(g, CX - 230, sy - 40, 1.2, 0); });
  labelTitle(g, t, 'O TESTE', 'DO MÉDICO', 330, { at: 0.2, big: 92 });
  FX.dust(g, t, { count: 30, color: '#d8c0a0', a: 0.25 });
} });

// s31 — "Ficou horas lá embaixo… e comeu sopa, cerveja e linguiça por um tubo." — comida descendo pelo tubo
function sopa(g, x, y, s) { g.fillStyle = '#d8d0c0'; g.beginPath(); g.arc(x, y, 40 * s, 0, Math.PI); g.fill(); g.fillStyle = '#c87a3a'; g.fillRect(x - 38 * s, y - 6 * s, 76 * s, 8 * s); for (let i = 0; i < 3; i++) { g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 16 * s + i * 16 * s, y - 14 * s); g.quadraticCurveTo(x - 6 * s + i * 16 * s, y - 34 * s, x - 16 * s + i * 16 * s, y - 52 * s); g.stroke(); } }
function cerveja(g, x, y, s) { rr(g, x - 26 * s, y - 70 * s, 52 * s, 76 * s, 6 * s); g.fillStyle = '#e8a83a'; g.fill(); rr(g, x - 28 * s, y - 84 * s, 56 * s, 20 * s, 10 * s); g.fillStyle = '#f4efe0'; g.fill(); g.strokeStyle = '#e8a83a'; g.lineWidth = 8 * s; g.beginPath(); g.arc(x + 30 * s, y - 34 * s, 18 * s, -1.4, 1.4); g.stroke(); }
function linguica(g, x, y, s) { g.strokeStyle = '#a0482a'; g.lineWidth = 26 * s; g.lineCap = 'round'; g.beginPath(); g.arc(x, y + 40 * s, 60 * s, -2.4, -0.7); g.stroke(); g.strokeStyle = 'rgba(255,220,180,.4)'; g.lineWidth = 5 * s; g.beginPath(); g.arc(x, y + 34 * s, 58 * s, -2.2, -0.9); g.stroke(); g.lineCap = 'butt'; }
registerShot('s31', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.05, y: 40 }, { z: 1.1, y: 80 }, { hand: 3, seed: 9 });
  const { CX, sy, cy } = underground(g, t, cam, { sy: 620, cy: 1500 });
  layer(g, cam, 1, (g) => {
    xray(g, CX, cy); deitado(g, CX - 20, cy - 40, 0.55, MEDICO, { face: HID }); glow(g, CX, cy - 75, 200, '#ffb070', 0.2);
    tubo(g, CX + 60, cy - 150, sy - 20, '#9a9aa6', 60);
    [['sopa', sopa], ['cerveja', cerveja], ['linguiça', linguica]].forEach(([w, fn], i) => { const tw = W0(w, info), k = ease.inOut(prog(t, tw - 0.1, tw + 1.0)); if (k <= 0 || k >= 1) return; const x = CX + 60 + 120 * (1 - k) * (i - 1), y = lerp(sy - 120, cy - 160, k); fn(g, x, y, 0.9); text(g, w.toUpperCase(), x - 210, y, { size: 40, color: GOLD, font: FONTS.ui, weight: 900, spacing: 3 }); });
  });
  const tH = W0('horas', info); if (t > tH) text(g, 'HORAS LÁ EMBAIXO', E.W / 2, 330, { size: 46, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, tH, tH + 0.3)) });
} });

// s32 — "Mas tem um problema." — o sino parado na névoa
registerShot('s32', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.2, y: 80 }, { z: 1.32, y: 110 }, { hand: 2, seed: 10 });
  const { GY, CX } = cemetery(g, t, cam, { clear: true });
  layer(g, cam, 1, (g) => postoSino(g, CX - 40, GY + 40, 2.2, 0));
  fogDrift(g, t, GY - 100, 380, '#5a6a9a', { a: 0.3, speed: 10, seed: 12 });
  veil(g, '#000', 0.25);
  text(g, 'MAS...', E.W / 2, 380, { size: 90, color: S().ui.accent, font: FONTS.ui, weight: 900, spacing: 10, alpha: ease.out(prog(t, 0.2, 0.6)) });
} });

// s33 — "Quando um corpo de verdade começa a se decompor, ele incha e se mexe sozinho." — um morto (coberto) incha
registerShot('s33', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.4, y: 520 }, { z: 1.5, y: 560 }, { hand: 3, seed: 11 });
  const { CX, sy, cy } = underground(g, t, cam, { sy: 620, cy: 1500 });
  const tI = W0('incha', info), sw = ease.inOut(prog(t, tI - 0.3, tI + 1.0)), mv = W0('mexe', info);
  layer(g, cam, 1, (g) => {
    xray(g, CX, cy); const jit = t > mv ? Math.sin(t * 20) * 2 * Math.exp(-(t - mv) * 1.5) : 0;
    g.fillStyle = '#9a9aa8'; g.beginPath(); g.moveTo(CX - 240, cy - 22); g.quadraticCurveTo(CX - 200, cy - 70, CX - 140, cy - 60); g.quadraticCurveTo(CX, cy - 60 - 30 * sw + jit, CX + 120, cy - 56 - 10 * sw); g.quadraticCurveTo(CX + 220, cy - 60, CX + 240, cy - 22); g.fill();
    tubo(g, CX - 190, cy - 150, sy - 40, '#9a9aa6', 22); seg(g, [[CX - 130, cy - 60], [CX - 190, cy - 140]], 3, GOLD);
  });
  bpTitle(g, 'UM MORTO DE VERDADE', 330, ease.out(prog(t, 0.1, 0.5)));
  FX.dust(g, t, { count: 30, color: '#d8c0a0', a: 0.25 });
} });

// s34 — "E isso puxava as cordas." — a corda estica; o sino balança lá em cima
registerShot('s34', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0, y: -40 }, { z: 1.06, y: 0 }, { hand: 4, seed: 12 });
  const { CX, sy, cy } = underground(g, t, cam, { sy: 620, cy: 1500 }), tP = W0('puxava', info);
  layer(g, cam, 1, (g) => {
    xray(g, CX, cy); g.fillStyle = '#9a9aa8'; g.beginPath(); g.moveTo(CX - 240, cy - 22); g.quadraticCurveTo(CX, cy - 100, CX + 240, cy - 22); g.fill();
    tubo(g, CX - 190, cy - 150, sy - 40, '#9a9aa6', 22);
    const k = ease.out(prog(t, tP, tP + 0.5)); g.strokeStyle = GOLD; g.lineWidth = 5; g.beginPath(); g.moveTo(CX - 190, cy - 150); g.lineTo(CX - 190, lerp(cy - 150, sy - 220, k)); g.stroke();
    postoSino(g, CX - 230, sy - 40, 1.3, sinoBalanco(t, tP + 0.4)); ringWaves(g, CX - 160, sy - 300, t, tP + 0.4);
  });
  FX.dust(g, t, { count: 30, color: '#d8c0a0', a: 0.25 });
} });

// s35 — "Imagina o vigia ouvindo um sino de madrugada… sem saber se é você ou só um morto inchando." — close do vigia
registerShot('s35', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0 }, { z: 1.1, x: 20 }, { hand: 3, seed: 13 });
  blurLayer(g, 10, (g) => cemetery(g, t, cam), cam, 0.5);
  glow(g, E.W * 0.25, E.H * 0.7, 500, CANDLE, 0.35);
  const tV = W0('você', info), tM = W0('morto', info);
  layer(g, cam, 1, (g) => bigFace(g, E.W / 2 + 60, E.H * 0.5, 290, { outfit: VIGIA, expr: t > tV ? 'scared' : 'worried', blink: 0, look: [lerp(-0.7, 0.7, ease.inOut(prog(t, tV, tM))), -0.2], rimColor: CANDLE, rimSide: -1 }));
  lantern(g, 180, 1600, t, 2.0);
  ringWaves(g, E.W - 120, 420, t, 0.3, GOLD); ringWaves(g, E.W - 120, 420, t, 1.6, GOLD);
  if (t > tV) { const a = ease.outBack(prog(t, tV, tV + 0.3)); g.save(); g.translate(260, 520); g.scale(a, a); UI.bubble(g, 0, 0, { w: 260, h: 100, str: 'VOCÊ?', color: '#f4efe6' }); g.restore(); }
  if (t > tM) { const a = ease.outBack(prog(t, tM, tM + 0.3)); g.save(); g.translate(E.W - 280, 680); g.scale(a, a); UI.bubble(g, 0, 0, { w: 300, h: 100, str: 'UM MORTO?', color: '#f4efe6' }); g.restore(); }
  FX.dust(g, t, { count: 30, color: '#cfd8ff', a: 0.28 });
} });
