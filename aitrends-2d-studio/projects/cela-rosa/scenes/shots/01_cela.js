// shots/01_cela.js — a briga, a cela rosa, 1979, o teste dos braços, Seattle, a tinta, 156 dias, a ideia se espalha, o vestiário (s01–s20).
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, text, FONTS, rng, wordTime } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { corredor, cela, lab1979, cartaz, naval, vestiario, mictorio, portaCela, ROSA, ROSA_CL, ROSA_ES, FRIO, LAMP } from '../sets/world.js';
import { labelTitle, bpTitle, stamp, joint, cross } from '../sets/common.js';
import { camPath, punch, focus, dof, bokeh, fogDrift, shafts } from '/engine/cine.js';
import { VOCE, DETENTO, PRESO2, PRESO3, GUARDA, CIENTISTA, OFICIAL, TECNICO, JOGADOR, GOLD } from '../cast.js';

export const rimOf = (c, dir = [0.5, -1]) => ({ color: c, dir, w: 5 });
export const HID = { hidden: true };
export const W0 = (w, info, after = 0) => { const s0 = info.shot.start, x = wordTime(w, s0 - 0.25 + after); return x == null ? 99 : x - s0; };
export function zoomAt(g, cx, cy, z) { g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); }
export const BRACOS = { ...POSES.stand, eF: [40, -178], hF: [80, -180], eB: [36, -176], hB: [76, -178] };
const BAIXO = { ...POSES.stand, eF: [34, -150], hF: [60, -122], eB: [30, -148], hB: [56, -120] };
export const EMPURRA = { ...POSES.reach, eF: [30, -170], hF: [56, -168], eB: [26, -166], hB: [52, -164] };

// s01 — abertura: a porta com luz rosa vazando no corredor escuro
registerShot('s01', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0, y: 0 }, { z: 1.08, y: 30 }, { hand: 4, seed: 2 });
  const { GY, CX } = corredor(g, t, cam, { portaRosa: 0.12 + 0.03 * Math.sin(t * 2) });
  layer(g, cam, 0.7, (g) => shafts(g, t, CX + 30, GY - 300, { angle: Math.PI * 0.55, spread: 0.4, len: 1200, color: ROSA, a: 0.08 }));
  fogDrift(g, t, GY - 100, 300, '#5a6a9a', { a: 0.18, speed: 14, seed: 3 });
  bokeh(g, t, { count: 6, color: ROSA, a: 0.1, seed: 5, rMin: 40, rMax: 110 });
  FX.dust(g, t, { count: 50, color: '#ffd0e4', a: 0.3 });
  UI.titleCard(g, t + 0.2, { lines: ['O QUE ACONTECERIA', 'SE VOCÊ FOSSE PRESO', 'NUMA CELA', 'TODA ROSA?'], dur: d + 0.4, y: E.H * 0.24 });
} });

// s02 — "Suíça. Você está preso e acabou de arrumar briga com outro detento."
registerShot('s02', { draw(g, t, info) {
  const d = info.dur, tB = W0('briga', info), cam0 = camPath(t, d, { z: 1.08, x: 20 }, { z: 1.16, x: -10 }, { hand: 5, seed: 3 }), cam = { ...cam0, z: cam0.z + punch(t, tB, 0.06) };
  const { GY, CX } = corredor(g, t, cam);
  const shove = ease.out(prog(t, tB - 0.2, tB + 0.1)), back = ease.out(prog(t, tB, tB + 0.5));
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: CX - 170, y: GY + 120, s: 2.0, facing: 1, outfit: VOCE, pose: breathe(t < tB - 0.2 ? POSES.ready : blendPose(POSES.ready, POSES.reach, shove), t, 0.7, 1), expr: 'angry', look: [1, 0], rim: rimOf(FRIO, [-1, -0.5]) });
    drawFigure(g, { x: CX + 170 + 60 * back, y: GY + 120, s: 2.0, facing: -1, rot: 0.15 * back * Math.exp(-(t - tB) * 2), outfit: DETENTO, pose: breathe(t < tB ? POSES.ready : POSES.surprised || POSES.stand, t, 0.7, 2), expr: t > tB ? 'shocked' : 'angry', look: [-1, 0], rim: rimOf(FRIO, [1, -0.5]) });
  });
  if (t > tB) for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, k = prog(t, tB, tB + 0.4); seg(g, [[CX + Math.cos(a) * 60 * k, GY - 210 + Math.sin(a) * 60 * k], [CX + Math.cos(a) * 110 * k, GY - 210 + Math.sin(a) * 110 * k]], 5, alpha(GOLD, 1 - k)); }
  labelTitle(g, t, 'PRISÃO NA', 'SUÍÇA', E.H * 0.22, { at: 0.05, big: 120 });
  FX.dust(g, t, { count: 40, color: '#dfe8ff', a: 0.25 });
} });

// s03 — "Os guardas te seguram e te levam pra cela de castigo."
registerShot('s03', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.05, x: 60 }, { z: 1.1, x: -60 }, { hand: 4, seed: 4 });
  const { GY, CX } = corredor(g, t, cam), x = CX - 200 + t * 70;
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: x - 120, y: GY + 130, s: 1.95, facing: 1, outfit: GUARDA, pose: { ...walkPose(t * 3.4), eF: [36, -150], hF: [66, -146] }, expr: 'neutral', rim: rimOf(FRIO, [-1, -0.5]) });
    drawFigure(g, { x, y: GY + 130, s: 1.95, facing: 1, outfit: VOCE, pose: { ...walkPose(t * 3.4 + 0.5), eF: [-14, -140], hF: [-26, -110], eB: [-10, -138], hB: [-22, -108] }, expr: 'angry', look: [-0.6, 0], rim: rimOf(FRIO, [1, -0.5]) });
    drawFigure(g, { x: x + 130, y: GY + 130, s: 1.95, facing: 1, outfit: GUARDA, pose: { ...walkPose(t * 3.4 + 1), eB: [-30, -150], hB: [-62, -146] }, expr: 'neutral', rim: rimOf(FRIO, [1, -0.5]) });
  });
  const tC = W0('castigo', info); if (t > tC) text(g, 'CELA DE CASTIGO', E.W / 2, 380, { size: 56, color: GOLD, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, tC, tC + 0.3)), glow: 16, glowColor: 'rgba(255,150,60,.5)' });
  FX.dust(g, t, { count: 40, color: '#dfe8ff', a: 0.25 });
} });

// s04 — "A porta abre… e tudo lá dentro é rosa." — a porta desliza; a luz rosa invade
registerShot('s04', { draw(g, t, info) {
  const d = info.dur, tR = W0('rosa', info), cam0 = camPath(t, d, { z: 1.1 }, { z: 1.25, y: 40 }, { hand: 3, seed: 5 }), cam = { ...cam0, z: cam0.z + punch(t, tR, 0.05) };
  const open = ease.inOut(prog(t, 0.1, tR + 0.1));
  const { GY, CX } = corredor(g, t, cam, { portaRosa: open });
  layer(g, cam, 1, (g) => drawFigure(g, { x: CX - 330, y: GY + 200, s: 2.2, facing: 1, outfit: VOCE, pose: breathe(POSES.stand, t, 0.6, 1), expr: open > 0.6 ? 'shocked' : 'angry', look: [1, -0.2], rim: rimOf(ROSA, [1, -0.3]) }));
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha(ROSA, 0.12 * open); g.fillRect(0, 0, E.W, E.H); g.restore();
  FX.dust(g, t, { count: 50, color: '#ffd0e4', a: 0.35 });
} });

// s05 — "As paredes, o teto, até o chão. Um rosa forte, cor de chiclete." — a câmera percorre a cela
registerShot('s05', { draw(g, t, info) {
  const d = info.dur, tT = W0('teto', info), tC = W0('chão', info), ty = lerp(0, 160, ease.inOut(prog(t, tT - 0.3, tT + 0.4))) - lerp(0, 320, ease.inOut(prog(t, tC - 0.3, tC + 0.4)));
  const cam = camPath(t, d, { z: 1.0, x: -40 }, { z: 1.12, x: 40 }, { hand: 3, seed: 6 }); cam.y += ty;
  cela(g, t, cam);
  [['paredes', 'PAREDES', 900], ['teto', 'TETO', 560], ['chão', 'CHÃO', 1250]].forEach(([w, s, y]) => { const tw = W0(w, info); if (t > tw) text(g, s, E.W / 2, y, { size: 60, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 8, alpha: ease.out(prog(t, tw, tw + 0.25)) * (1 - prog(t, tw + 1.1, tw + 1.4)), glow: 14, glowColor: alpha(ROSA_ES, 0.8) }); });
  const tCh = W0('chiclete', info); if (t > tCh - 0.3) { const k = ease.outBack(prog(t, tCh - 0.3, tCh + 0.1)); g.save(); g.translate(E.W / 2, 860); g.scale(k, k); rr(g, -180, -220, 360, 440, 18); g.fillStyle = '#ffffff'; g.fill(); rr(g, -160, -200, 320, 300, 10); g.fillStyle = ROSA; g.fill(); g.fillStyle = '#2a2a30'; g.font = '900 30px sans-serif'; g.textAlign = 'center'; g.fillText('COR DE CHICLETE', 0, 150); g.restore(); }
  FX.dust(g, t, { count: 40, color: '#ffffff', a: 0.3 });
} });

// s06 — "Isso não é piada. É de propósito." — você sentado no banco, confuso
registerShot('s06', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.12, x: 30 }, { z: 1.2, x: -20 }, { hand: 3, seed: 7 });
  const { GY, CX } = cela(g, t, cam);
  layer(g, cam, 1, (g) => drawFigure(g, { x: CX, y: GY - 260, s: 1.7, facing: 1, outfit: VOCE, pose: breathe({ ...POSES.sit, head: [8, -178] }, t, 0.6, 1), expr: 'worried', look: [lerp(-1, 1, (Math.sin(t * 1.3) + 1) / 2), -0.3], rim: rimOf('#ffffff', [0, -1]) }));
  stamp(g, E.W / 2, 420, t - W0('propósito', info), 'DE PROPÓSITO', { rot: -0.1 });
  FX.dust(g, t, { count: 40, color: '#ffffff', a: 0.3 });
} });

// s07 — "Tudo começou em 1979," — laboratório; o cartaz rosa
registerShot('s07', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0 }, { z: 1.06 }, { hand: 3, seed: 8 });
  const { GY, CX } = lab1979(g, t, cam);
  layer(g, cam, 1, (g) => cartaz(g, CX + 160, GY + 80, 1.3, ROSA));
  g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = 'rgba(160,110,60,.25)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  labelTitle(g, t, 'TUDO COMEÇOU EM', '1979', E.H * 0.22, { at: 0.05, big: 130 });
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.3 });
} });

// s08 — "com um pesquisador americano chamado Alexander Schauss." — silhueta sem rosto
registerShot('s08', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.06, x: -20 }, { z: 1.14, x: 20 }, { hand: 3, seed: 9 });
  const { GY, CX } = lab1979(g, t, cam);
  layer(g, cam, 1, (g) => { cartaz(g, CX + 230, GY + 80, 1.2, ROSA); drawFigure(g, { x: CX - 150, y: GY + 120, s: 2.1, facing: 1, outfit: CIENTISTA, pose: breathe(posesAt(t, [[0, POSES.stand], [1.0, POSES.point]]), t, 0.6, 2), face: HID, rim: rimOf(LAMP, [1, -0.5]) }); });
  g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = 'rgba(160,110,60,.25)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  labelTitle(g, t, 'O PESQUISADOR', 'ALEXANDER SCHAUSS', E.H * 0.2, { at: W0('Alexander', info) - 0.3, big: 76 });
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.3 });
} });

// o teste dos braços (usado em s09, s10, s29, s31)
export function testeBracos(g, t, cam, o = {}) {
  const { GY, CX } = lab1979(g, t, cam);
  layer(g, cam, 1, (g) => {
    cartaz(g, CX + 330, GY + 80, 1.1, o.cor || ROSA);
    const down = o.down ?? 0;
    drawFigure(g, { x: CX - 170, y: GY + 130, s: 2.0, facing: 1, outfit: { top: 'tshirt', color: '#5a7a9a', head: 'none' }, pose: breathe(blendPose(BRACOS, BAIXO, down), t, 0.6, 3), expr: down > 0.5 ? 'worried' : 'determined', look: [1, -0.1], rim: rimOf(LAMP, [1, -0.5]) });
    if (o.pusher) drawFigure(g, { x: CX + 90, y: GY + 150, s: 2.0, facing: -1, outfit: CIENTISTA, pose: breathe({ ...EMPURRA, hF: [56, lerp(-168, -128, down)], hB: [52, lerp(-164, -124, down)] }, t, 0.6, 4), face: o.pusherFace ? undefined : HID, expr: 'determined', look: o.pusherLook ?? [-1, 0], rim: rimOf(LAMP, [-1, -0.5]) });
  });
  g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = 'rgba(160,110,60,.22)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  return { GY, CX };
}
// s09 — "Ele pedia pra homens olharem pra um cartaz rosa com os braços esticados pra frente."
registerShot('s09', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0, x: 30 }, { z: 1.1, x: -20 }, { hand: 3, seed: 10 });
  testeBracos(g, t, cam, { down: 0 });
  const tB = W0('braços', info); if (t > tB) { UI.callout(g, t, { at: [E.W / 2 - 20, 1050], to: [E.W / 2 - 160, 820], str: 'BRAÇOS ESTICADOS', start: tB, color: GOLD }); }
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.3 });
} });
// s10 — "Depois, alguém empurrava os braços deles pra baixo."
registerShot('s10', { draw(g, t, info) {
  const d = info.dur, tE = W0('empurrava', info), cam = camPath(t, d, { z: 1.08 }, { z: 1.16 }, { hand: 3, seed: 11 });
  testeBracos(g, t, cam, { down: ease.inOut(prog(t, tE, tE + 1.2)), pusher: true });
  if (t > tE) for (let i = 0; i < 3; i++) { const y = 920 + i * 40 + ((t * 120) % 40); poly(g, [[E.W / 2 - 40, y], [E.W / 2, y + 30], [E.W / 2 + 40, y]], alpha(GOLD, 0.7)); }
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.3 });
} });

// s11 — "E, segundo ele, quem olhava pro rosa ficava mais fraco." — barras de força
registerShot('s11', { draw(g, t, info) {
  UI.blueprint(g); const u = S().ui, tF = W0('fraco', info);
  bpTitle(g, 'SEGUNDO ELE', 380, ease.out(prog(t, 0.1, 0.5)));
  [['OLHANDO OUTRA COR', 0.85, '#dfe8ff'], ['OLHANDO O ROSA', 0.42, ROSA]].forEach(([lab, v, c], i) => { const y = 640 + i * 260, a = ease.out(prog(t, 0.2 + i * 0.3, 0.5 + i * 0.3)), p = ease.out(prog(t, 0.6 + i * (tF - 0.6) * 0.8, 1.4 + i * (tF - 0.6) * 0.8)); text(g, lab, 110, y, { size: 44, color: u.cream, font: FONTS.ui, weight: 900, align: 'left', alpha: a, spacing: 2 }); rr(g, 110, y + 40, 860, 80, 40); g.fillStyle = alpha('#ffffff', 0.06 * a); g.fill(); if (p > 0) { rr(g, 110, y + 40, Math.max(80, 860 * v * p), 80, 40); g.fillStyle = alpha(c, 0.85); g.fill(); } });
  text(g, 'FORÇA DOS BRAÇOS', E.W / 2, 560, { size: 30, color: alpha(u.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 6 });
  if (t > tF) text(g, 'MAIS FRACO?', E.W / 2, 1250, { size: 64, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tF, tF + 0.3)), glow: 16, glowColor: 'rgba(255,150,60,.5)' });
} });

// s12 — "Dois oficiais de uma prisão da Marinha americana, em Seattle, resolveram testar."
registerShot('s12', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0, y: -20 }, { z: 1.1, y: 20 }, { hand: 4, seed: 12 });
  const { GY, CX } = naval(g, t, cam);
  layer(g, cam, 1, (g) => { for (const [x, f] of [[CX - 200, 1], [CX + 200, -1]]) drawFigure(g, { x, y: GY + 170, s: 2.0, facing: f, outfit: OFICIAL, pose: breathe(POSES.crossArms || POSES.stand, t, 0.6, x), face: HID, rim: rimOf(FRIO, [-f, -0.5]) }); });
  fogDrift(g, t, GY - 60, 260, '#4a5a8a', { a: 0.2, speed: 14, seed: 4 });
  labelTitle(g, t, 'MARINHA DOS EUA', 'SEATTLE', E.H * 0.2, { at: W0('Seattle', info) - 0.4, big: 120 });
  FX.dust(g, t, { count: 40, color: '#dfe8ff', a: 0.25 });
} });

// s13 — "Misturaram um pote de tinta vermelha com um galão de tinta branca…" — a receita em blueprint
function lata(g, x, y, w, h, cor, lab, a = 1) { g.save(); g.globalAlpha = a; rr(g, x - w / 2, y - h, w, h, 10); g.fillStyle = '#c8ccd4'; g.fill(); rr(g, x - w / 2 + 10, y - h * 0.75, w - 20, h * 0.5, 6); g.fillStyle = cor; g.fill(); g.fillStyle = '#9a9ea8'; g.fillRect(x - w / 2 - 6, y - h - 12, w + 12, 16); text(g, lab, x, y + 50, { size: 34, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
registerShot('s13', { draw(g, t, info) {
  UI.blueprint(g); const tV = W0('vermelha', info), tB = W0('branca', info);
  bpTitle(g, 'A RECEITA', 380, ease.out(prog(t, 0.1, 0.5)));
  lata(g, 260, 900, 150, 180, '#d8303a', 'VERMELHA', ease.out(prog(t, tV - 0.3, tV)));
  text(g, '+', 440, 820, { size: 90, color: GOLD, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, tV, tV + 0.3)) });
  lata(g, 640, 900, 260, 300, '#f4f4f8', 'GALÃO BRANCO', ease.out(prog(t, tB - 0.3, tB)));
  const k = ease.outBack(prog(t, tB + 0.4, tB + 0.8)); if (k > 0) { text(g, '=', E.W / 2, 1060, { size: 90, color: GOLD, font: FONTS.ui, weight: 900 }); g.save(); g.translate(E.W / 2, 1270); g.scale(k, k); lata(g, 0, 0, 200, 200, ROSA, 'ROSA', 1); g.restore(); }
} });

// s14 — "e pintaram uma cela inteira." — o rolo de tinta passa
registerShot('s14', { draw(g, t, info) {
  const d = info.dur, p = ease.inOut(prog(t, 0, d - 0.2)), cam = camPath(t, d, { z: 1.1 }, { z: 1.0 }, { hand: 3, seed: 13 });
  cela(g, t, cam, { pint: 0 });
  g.save(); g.beginPath(); g.rect(0, 0, E.W * p, E.H); g.clip(); cela(g, t, cam, { pint: 1 }); g.restore();
  const x = E.W * p; seg(g, [[x, 300], [x, 1500]], 34, ROSA_ES); seg(g, [[x + 20, 900], [x + 140, 1100], [x + 140, 1600]], 10, '#3a3a40');
  FX.dust(g, t, { count: 30, color: '#ffffff', a: 0.3 });
} });

// s15 — "Eles disseram que, nos 156 dias seguintes, nenhum preso que entrou ali ficou agressivo."
registerShot('s15', { draw(g, t, info) {
  UI.blueprint(g); const u = S().ui, t1 = W0('156', info), tN = W0('nenhum', info);
  bpTitle(g, 'ELES DISSERAM', 380, ease.out(prog(t, 0.1, 0.5)));
  const n = Math.round(lerp(1, 156, clamp((t - t1 + 0.2) / 1.6))); if (t > t1 - 0.2) { text(g, String(n), E.W / 2, 760, { size: 200, color: GOLD, font: FONTS.ui, weight: 900, glow: 24, glowColor: 'rgba(255,150,60,.55)' }); text(g, 'DIAS', E.W / 2, 880, { size: 50, color: u.cream, font: FONTS.ui, weight: 900, spacing: 10 }); }
  for (let i = 0; i < 26; i++) { const x = 140 + (i % 13) * 66, y = 980 + Math.floor(i / 13) * 70, a = clamp((t - t1 - i * 0.05) / 0.2); rr(g, x, y, 54, 54, 8); g.strokeStyle = alpha(u.blueprint, 0.6 * a); g.lineWidth = 3; g.stroke(); if (t > tN) { g.strokeStyle = alpha(GOLD, a); g.lineWidth = 5; g.beginPath(); g.moveTo(x + 12, y + 28); g.lineTo(x + 24, y + 40); g.lineTo(x + 44, y + 14); g.stroke(); } }
  if (t > tN) text(g, '0 AGRESSÕES', E.W / 2, 1260, { size: 60, color: ROSA, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tN, tN + 0.3)) });
} });

// s16 — "E que a calma durava até meia hora depois de sair."
registerShot('s16', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.08, x: 40 }, { z: 1.14, x: -30 }, { hand: 3, seed: 14 });
  const { GY, CX } = corredor(g, t, cam, { portaRosa: 0.8 });
  layer(g, cam, 1, (g) => drawFigure(g, { x: CX - 40 - t * 80, y: GY + 150, s: 2.0, facing: -1, outfit: PRESO2, pose: walkPose(t * 2.4), expr: 'smile', rim: rimOf(ROSA, [1, -0.4]) }));
  const tM = W0('meia', info); if (t > tM - 0.3) { const k = ease.outBack(prog(t, tM - 0.3, tM + 0.1)); g.save(); g.translate(E.W / 2 + 230, 520); g.scale(k, k); circle(g, 0, 0, 120, '#f0e6d0'); ring(g, 0, 0, 120, 12, GOLD); const a = clamp((t - tM) / 1.4) * Math.PI; g.fillStyle = alpha(ROSA, 0.6); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 104, -Math.PI / 2, -Math.PI / 2 + a); g.fill(); seg(g, [[0, 0], [Math.sin(a) * 90, -Math.cos(a) * 90]], 8, '#2a2018'); g.restore(); text(g, 'ATÉ 30 MIN', E.W / 2 + 230, 700, { size: 48, color: GOLD, font: FONTS.ui, weight: 900, spacing: 3, alpha: k }); }
  FX.dust(g, t, { count: 40, color: '#ffd0e4', a: 0.3 });
} });

// s17 — "A ideia se espalhou." — pontos rosa num mapa em traço fino
registerShot('s17', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), r = rng(7);
  g.strokeStyle = alpha(bp, 0.3); g.lineWidth = 3; g.beginPath(); g.moveTo(80, 700); for (const [x, y] of [[300, 620], [600, 640], [900, 600], [1000, 760], [960, 1000], [800, 1120], [560, 1080], [380, 1160], [200, 1080], [100, 900]]) g.lineTo(x, y); g.closePath(); g.stroke();
  for (let i = 0; i < 22; i++) { const x = 150 + r() * 780, y = 680 + r() * 420, k = ease.outBack(prog(t, i * 0.06, i * 0.06 + 0.3)); if (k <= 0) continue; circle(g, x, y, 14 * k, ROSA); glow(g, x, y, 60 * k, ROSA, 0.4); }
  bpTitle(g, 'A IDEIA SE ESPALHOU', 420, ease.out(prog(t, 0.05, 0.4)));
} });

// s18 — "Prisões e alas psiquiátricas pintaram celas de rosa." — fileira de celas mudando de cor
registerShot('s18', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke();
  bpTitle(g, 'PRISÕES E HOSPITAIS', 380, ease.out(prog(t, 0.1, 0.5)));
  for (let i = 0; i < 12; i++) { const x = 140 + (i % 4) * 210, y = 600 + Math.floor(i / 4) * 230, k = ease.out(prog(t, 0.6 + i * 0.18, 0.9 + i * 0.18)); rr(g, x, y, 170, 190, 10); g.fillStyle = mix('#3a4258', ROSA, k); g.fill(); g.strokeStyle = alpha(bp, 0.7); g.lineWidth = 3; g.stroke(); for (let b = 1; b < 4; b++) g.fillRect(x + b * 42, y, 4, 190); }
} });

// s19 — "Um técnico de futebol americano nos Estados Unidos pintou de rosa o vestiário do time visitante,"
registerShot('s19', { draw(g, t, info) {
  const d = info.dur, tP = W0('pintou', info), cam = camPath(t, d, { z: 1.04, x: 30 }, { z: 1.12, x: -30 }, { hand: 3, seed: 15 });
  vestiario(g, t, cam, { rosa: ease.inOut(prog(t, tP, d)) });
  const { GY, CX } = { GY: E.H * 0.68, CX: E.W / 2 };
  layer(g, cam, 1, (g) => { const o = { x: CX - 120, y: GY + 160, s: 2.1, facing: 1, outfit: TECNICO, pose: breathe({ ...POSES.pointUp, hF: [40, lerp(-250, -160, (Math.sin(t * 5) + 1) / 2)] }, t, 0.6, 1), face: HID, rim: rimOf('#fff2f8', [1, -0.5]) }; drawFigure(g, o); const [hx, hy] = joint(o, 'hF'); seg(g, [[hx, hy], [hx + 20, hy - 120]], 8, '#4a3424'); seg(g, [[hx - 10, hy - 130], [hx + 60, hy - 130]], 30, ROSA_ES); });
  const tV = W0('visitante', info); if (t > tV) text(g, 'VESTIÁRIO DO VISITANTE', E.W / 2, 400, { size: 50, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tV, tV + 0.3)), glow: 14, glowColor: alpha(ROSA_ES, 0.9) });
} });

// s20 — "pra deixar os adversários "mansos"." — jogadores sentados, quietinhos
registerShot('s20', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.06 }, { z: 1.14 }, { hand: 3, seed: 16 });
  vestiario(g, t, cam, { rosa: 1 });
  const GY = E.H * 0.68, CX = E.W / 2;
  layer(g, cam, 1, (g) => { for (let i = 0; i < 3; i++) drawFigure(g, { x: CX - 300 + i * 300, y: GY + 120, s: 1.8, facing: i === 2 ? -1 : 1, outfit: { ...JOGADOR, number: 10 + i * 7 }, pose: breathe({ ...POSES.sit, head: [6, -172] }, t, 0.5, i), expr: 'sad', look: [i === 1 ? 0 : (i ? -1 : 1), 0.4], rim: rimOf('#fff2f8', [0, -1]) }); });
  const tM = W0('mansos', info); if (t > tM) text(g, '"MANSOS"', E.W / 2, 420, { size: 80, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, tM, tM + 0.3)), glow: 18, glowColor: alpha(ROSA_ES, 0.9) });
} });
