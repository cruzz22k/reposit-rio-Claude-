// shots/02_reviravolta.js — mictórios, de volta à cela, humilhação, a reviravolta, o estudo de 2014, final (s21–s39).
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { corredor, cela, lab1979, vestiario, mictorio, ROSA, ROSA_CL, ROSA_ES, FRIO, LAMP } from '../sets/world.js';
import { labelTitle, bpTitle, stamp, cross, ageBadge } from '../sets/common.js';
import { camPath, punch, bokeh, fogDrift } from '/engine/cine.js';
import { VOCE, DETENTO, PRESO2, PRESO3, GUARDA, CIENTISTA, GOLD } from '../cast.js';
import { rimOf, HID, W0, zoomAt, testeBracos } from './01_cela.js';

const relogio = (g, cx, cy, r, ang, cor = GOLD) => { circle(g, cx, cy, r + 14, cor); circle(g, cx, cy, r, '#f0e6d0'); for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; seg(g, [[cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82], [cx + Math.cos(a) * r * 0.94, cy + Math.sin(a) * r * 0.94]], 5, '#2a2018'); } seg(g, [[cx, cy], [cx + Math.sin(ang / 12) * r * 0.5, cy - Math.cos(ang / 12) * r * 0.5]], 12, '#2a2018'); seg(g, [[cx, cy], [cx + Math.sin(ang) * r * 0.8, cy - Math.cos(ang) * r * 0.8]], 7, '#2a2018'); circle(g, cx, cy, 10, cor); };
const sentado = (t, s = 1) => breathe({ ...POSES.sit, head: [8, -178] }, t, 0.6, s);

// s21 — "E até hoje esse vestiário é rosa. Até os mictórios."
registerShot('s21', { draw(g, t, info) {
  const d = info.dur, tM = W0('mictórios', info), cam0 = camPath(t, d, { z: 1.0, x: -40 }, { z: 1.1, x: 40 }, { hand: 3, seed: 2 }), cam = { ...cam0, z: cam0.z + punch(t, tM, 0.05) };
  vestiario(g, t, cam, { rosa: 1 });
  const GY = E.H * 0.68, CX = E.W / 2;
  layer(g, cam, 1, (g) => { for (let i = 0; i < 4; i++) mictorio(g, CX - 360 + i * 240, GY + 160, 1.25 * ease.outBack(prog(t, tM - 0.3 + i * 0.1, tM + i * 0.1)) + 0.001); });
  labelTitle(g, t, 'ATÉ HOJE', 'TUDO ROSA', 400, { at: 0.2, big: 100 });
} });

// s22 — "Agora, de volta pra você na cela."
registerShot('s22', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0, y: -40 }, { z: 1.18, y: 20 }, { hand: 3, seed: 3 });
  const { GY, CX } = cela(g, t, cam);
  layer(g, cam, 1, (g) => drawFigure(g, { x: CX, y: GY - 260, s: 1.7, facing: 1, outfit: VOCE, pose: sentado(t), expr: 'angry', look: [0, 0.3], rim: rimOf('#ffffff', [0, -1]) }));
  FX.dust(g, t, { count: 40, color: '#ffffff', a: 0.3 });
} });

// s23 — "A psicóloga que trouxe o rosa pras prisões suíças diz que a raiva pode baixar em 15 minutos."
registerShot('s23', { draw(g, t, info) {
  UI.blueprint(g); const u = S().ui, t15 = W0('15', info);
  drawFigure(g, { x: 300, y: 1180, s: 2.0, facing: 1, outfit: { top: 'dress', color: '#8a5ad6', head: 'bun' }, pose: breathe(posesAt(t, [[0, POSES.stand], [1.2, POSES.explain]]), t, 0.6, 1), face: HID, rim: rimOf(ROSA, [1, -0.5]) });
  rr(g, 520, 620, 420, 300, 14); g.fillStyle = '#ffffff'; g.fill(); rr(g, 540, 640, 380, 200, 8); g.fillStyle = ROSA; g.fill(); text(g, '"COOL DOWN PINK"', 730, 885, { size: 30, color: '#2a2a30', font: FONTS.ui, weight: 900 });
  bpTitle(g, 'A PSICÓLOGA SUÍÇA', 400, ease.out(prog(t, 0.1, 0.5)));
  if (t > t15 - 0.3) { ageBadge(g, t, '15 MIN', { at: t15 - 0.3, x: 730, y: 1120 }); }
} });

// s24 — "Mas você vai ficar lá umas duas horas."
registerShot('s24', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.12 }, { z: 1.18 }, { hand: 3, seed: 4 });
  const { GY, CX } = cela(g, t, cam);
  layer(g, cam, 1, (g) => drawFigure(g, { x: CX + 120, y: GY - 260, s: 1.6, facing: -1, outfit: VOCE, pose: sentado(t), expr: 'angry', look: [-0.6, 0.4], rim: rimOf('#ffffff', [0, -1]) }));
  relogio(g, E.W / 2 - 200, 620, 150, t * 9);
  const tH = W0('horas', info); if (t > tH) text(g, '2 HORAS', E.W / 2 - 200, 880, { size: 70, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tH, tH + 0.3)), glow: 16, glowColor: 'rgba(120,60,40,.6)' });
} });

// s25 — "E, enquanto isso, você não se sente calmo. Você se sente humilhado."
registerShot('s25', { draw(g, t, info) {
  const d = info.dur, tH = W0('humilhado', info), cam = camPath(t, d, { z: 1.0 }, { z: 1.12 }, { hand: 3, seed: 5 });
  blurLayer(g, 12, (g) => cela(g, t, cam), cam, 0.5);
  veil(g, '#000', 0.25);
  layer(g, cam, 1, (g) => bigFace(g, E.W / 2, E.H * 0.5, 300, { outfit: VOCE, expr: t > tH ? 'sad' : 'angry', blink: 0, look: [t > tH ? -0.4 : 0, t > tH ? 0.7 : 0], rimColor: ROSA, rimSide: 1, tilt: t > tH ? -0.08 : 0 }));
  const tC = W0('calmo', info); if (t > tC) cross(g, E.W / 2, 400, 40, S().ui.accent, prog(t, tC, tC + 0.3)); if (t > tC) text(g, 'CALMO', E.W / 2 - 140, 412, { size: 46, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'right', alpha: ease.out(prog(t, tC, tC + 0.3)) });
  if (t > tH) text(g, 'HUMILHADO', E.W / 2, 1220, { size: 70, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, tH, tH + 0.3)), glow: 18, glowColor: alpha(ROSA_ES, 0.9) });
} });

// s26 — "Os outros presos dizem que parece quarto de menininha."
registerShot('s26', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.06, x: 30 }, { z: 1.14, x: -20 }, { hand: 4, seed: 6 });
  const { GY, CX } = corredor(g, t, cam);
  layer(g, cam, 1, (g) => { [[CX - 280, PRESO2, 1], [CX, DETENTO, 1], [CX + 280, PRESO3, -1]].forEach(([x, of, f], i) => { const laugh = Math.abs(Math.sin(t * 7 + i)); drawFigure(g, { x, y: GY + 140, s: 1.8, facing: f, outfit: of, pose: breathe(i === 1 ? POSES.point : { ...POSES.stand, head: [6, -206 + laugh * 4] }, t, 0.7, i), expr: 'joy', talk: laugh, rim: rimOf(FRIO, [-f, -0.5]) }); }); });
  const tQ = W0('quarto', info); if (t > tQ) { const a = ease.outBack(prog(t, tQ, tQ + 0.3)); g.save(); g.translate(E.W / 2, 520); g.scale(a, a); UI.bubble(g, 0, 0, { w: 620, h: 110, str: 'QUARTO DE MENININHA', color: '#f4efe6' }); g.restore(); }
  FX.dust(g, t, { count: 40, color: '#dfe8ff', a: 0.25 });
} });

// s27 — "Sair da cela rosa pode te fazer perder o respeito lá dentro."
registerShot('s27', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.08 }, { z: 1.14, x: -30 }, { hand: 3, seed: 7 });
  const { GY, CX } = corredor(g, t, cam, { portaRosa: 0.8 });
  layer(g, cam, 1, (g) => { drawFigure(g, { x: CX - 20 - t * 60, y: GY + 160, s: 2.0, facing: -1, outfit: VOCE, pose: breathe({ ...walkPose(t * 2), head: [10, -196] }, t, 0.5, 1), expr: 'sad', look: [0, 0.6], rim: rimOf(ROSA, [1, -0.4]) }); for (const [x, of] of [[CX - 420, PRESO2], [CX + 380, PRESO3]]) drawFigure(g, { x, y: GY + 120, s: 1.7, facing: x < CX ? 1 : -1, outfit: of, pose: POSES.point, expr: 'joy', talk: Math.abs(Math.sin(t * 6)), rim: rimOf(FRIO, [0, -1]) }); });
  const tR = W0('respeito', info), v = lerp(0.9, 0.15, ease.inOut(prog(t, tR - 0.3, tR + 0.8)));
  text(g, 'RESPEITO', 140, 470, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3, alpha: ease.out(prog(t, 0.3, 0.6)) });
  rr(g, 140, 500, 800, 54, 27); g.fillStyle = 'rgba(255,255,255,.08)'; g.fill(); rr(g, 140, 500, Math.max(54, 800 * v), 54, 27); g.fillStyle = alpha(v < 0.4 ? S().ui.accent : GOLD, 0.85); g.fill();
} });

// s28 — "E aqui vem a reviravolta."
registerShot('s28', { draw(g, t, info) {
  UI.blueprint(g); const k = ease.outBack(prog(t, 0.1, 0.5)), sp = ease.inOut(prog(t, 0.1, 0.9));
  g.save(); g.translate(E.W / 2, 860); g.rotate(sp * Math.PI * 2); g.scale(k, k); ring(g, 0, 0, 180, 10, GOLD); poly(g, [[150, -60], [210, 10], [120, 20]], GOLD); poly(g, [[-150, 60], [-210, -10], [-120, -20]], GOLD); g.restore();
  text(g, 'REVIRAVOLTA', E.W / 2, 1200, { size: 80, color: GOLD, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.3, 0.6)), glow: 20, glowColor: 'rgba(255,150,60,.55)' });
} });

// s29 — "No teste dos braços, quem empurrava também via a cor do cartaz…"
registerShot('s29', { draw(g, t, info) {
  const d = info.dur, tV = W0('via', info), cam = camPath(t, d, { z: 1.1, x: -40 }, { z: 1.2, x: -60 }, { hand: 3, seed: 8 });
  const { GY, CX } = testeBracos(g, t, cam, { down: 0.2, pusher: true, pusherFace: true, pusherLook: [t > tV ? 1 : -1, -0.2] });
  if (t > tV) { const k = ease.out(prog(t, tV, tV + 0.5)); g.save(); g.setLineDash([14, 12]); g.strokeStyle = alpha(GOLD, 0.9); g.lineWidth = 4; g.beginPath(); g.moveTo(CX + 110, GY - 290); g.lineTo(lerp(CX + 110, CX + 330, k), lerp(GY - 290, GY - 300, k)); g.stroke(); g.restore(); text(g, 'ELE TAMBÉM VIA O ROSA', E.W / 2, 420, { size: 48, color: GOLD, font: FONTS.ui, weight: 900, spacing: 2, alpha: k }); }
} });

// s30 — "e podia estar empurrando mais forte sem perceber."
registerShot('s30', { draw(g, t, info) {
  UI.blueprint(g); const u = S().ui, tF = W0('forte', info);
  bpTitle(g, 'SEM PERCEBER', 400, ease.out(prog(t, 0.1, 0.5)));
  const k = ease.inOut(prog(t, tF - 0.3, tF + 0.6));
  for (let i = 0; i < 3; i++) { const w = lerp(16, 40, k), y = 640 + i * 60; poly(g, [[E.W / 2 - w * 2, y], [E.W / 2, y + w * 1.6], [E.W / 2 + w * 2, y]], alpha(u.accent, 0.5 + 0.2 * i)); }
  text(g, 'EMPURRÃO', E.W / 2, 600, { size: 40, color: u.cream, font: FONTS.ui, weight: 900, spacing: 5 });
  text(g, k > 0.5 ? 'MAIS FORTE' : 'NORMAL', E.W / 2, 1000, { size: 70, color: k > 0.5 ? u.accent : u.cream, font: FONTS.ui, weight: 900, spacing: 4 });
  text(g, '→ O BRAÇO CAI', E.W / 2, 1180, { size: 46, color: GOLD, font: FONTS.ui, weight: 900, spacing: 3, alpha: k });
} });

// s31 — "O próprio Schauss repetiu os testes depois e não viu a calma de novo."
registerShot('s31', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0 }, { z: 1.08 }, { hand: 3, seed: 9 });
  testeBracos(g, t, cam, { down: 0, pusher: false });
  stamp(g, E.W / 2, 440, t - W0('não', info), 'SEM EFEITO', { rot: -0.1 });
  labelTitle(g, t, 'O PRÓPRIO', 'SCHAUSS', 300, { at: 0.1, big: 80, out: W0('não', info) - 0.4 });
} });

// s32 — "Ele até ficou com medo de que o rosa deixasse os presos mais violentos."
registerShot('s32', { draw(g, t, info) {
  const d = info.dur, tV = W0('violentos', info), cam0 = camPath(t, d, { z: 1.08 }, { z: 1.16 }, { hand: 5, seed: 10 }), cam = { ...cam0, z: cam0.z + punch(t, tV, 0.07) };
  const { GY, CX } = cela(g, t, cam);
  const hit = t > tV ? Math.abs(Math.sin((t - tV) * 7)) : 0;
  layer(g, cam, 1, (g) => drawFigure(g, { x: CX - 60, y: GY - 120, s: 1.9, facing: 1, outfit: DETENTO, pose: blendPose(POSES.ready, POSES.reach, hit), expr: 'angry', look: [1, 0], rim: rimOf('#ffffff', [0, -1]) }));
  if (t > tV) { g.save(); g.globalAlpha = 0.18 * hit; g.fillStyle = '#ff2030'; g.fillRect(0, 0, E.W, E.H); g.restore(); text(g, 'MAIS VIOLENTOS?', E.W / 2, 420, { size: 64, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 3, glow: 18, glowColor: 'rgba(200,0,40,.8)', alpha: ease.out(prog(t, tV, tV + 0.3)) }); }
} });

// s33 — "Em 2014, cientistas fizeram o teste mais sério de todos, numa prisão de verdade, na Suíça."
registerShot('s33', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.04, x: 40 }, { z: 1.12, x: -30 }, { hand: 3, seed: 11 });
  const { GY, CX } = corredor(g, t, cam);
  layer(g, cam, 1, (g) => { for (const [x, f] of [[CX - 220, 1], [CX + 220, -1]]) drawFigure(g, { x, y: GY + 150, s: 1.9, facing: f, outfit: CIENTISTA, pose: breathe({ ...POSES.holdFront }, t, 0.6, x), face: HID, rim: rimOf(FRIO, [-f, -0.5]) }); });
  labelTitle(g, t, 'O TESTE MAIS SÉRIO', '2014', E.H * 0.2, { at: 0.05, big: 130 });
  const tS = W0('Suíça', info); if (t > tS) text(g, 'PRISÃO DE VERDADE · SUÍÇA', E.W / 2, 560, { size: 38, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tS, tS + 0.3)) });
} });

// ícone de preso (cabeça + ombros)
const preso = (g, x, y, s, c) => { circle(g, x, y - 26 * s, 14 * s, c); g.fillStyle = c; g.beginPath(); g.ellipse(x, y + 6 * s, 22 * s, 18 * s, 0, Math.PI, 0); g.fill(); };
// s34 — "Foram 59 presos de castigo."
registerShot('s34', { draw(g, t, info) {
  UI.blueprint(g); const u = S().ui;
  bpTitle(g, 'PRESOS DE CASTIGO', 380, ease.out(prog(t, 0.05, 0.4)));
  for (let i = 0; i < 59; i++) { const k = ease.outBack(prog(t, i * 0.02, i * 0.02 + 0.25)); if (k > 0) preso(g, 150 + (i % 10) * 86, 560 + Math.floor(i / 10) * 100, k, alpha('#dfe8ff', 0.85)); }
  text(g, '59', E.W / 2, 1240, { size: 120, color: GOLD, font: FONTS.ui, weight: 900, glow: 22, glowColor: 'rgba(255,150,60,.55)', alpha: ease.out(prog(t, 0.6, 0.9)) });
} });

// s35 — "Metade foi pra uma cela toda rosa, e a outra metade pra uma cela branca com chão cinza."
function celaIcone(g, x, y, w, h, parede, chao, a) { g.save(); g.globalAlpha = a; g.fillStyle = parede; g.fillRect(x, y, w, h * 0.7); g.fillStyle = shade(parede, -0.1); poly(g, [[x, y], [x + w, y], [x + w - w * 0.15, y + h * 0.12], [x + w * 0.15, y + h * 0.12]], shade(parede, 0.08)); g.fillStyle = chao; poly(g, [[x, y + h * 0.7], [x + w, y + h * 0.7], [x + w, y + h], [x, y + h]], chao); g.strokeStyle = alpha('#ffffff', 0.5); g.lineWidth = 3; g.strokeRect(x, y, w, h); g.restore(); }
registerShot('s35', { draw(g, t, info) {
  UI.blueprint(g); const u = S().ui, tB = W0('branca', info);
  celaIcone(g, 80, 560, 420, 460, ROSA, ROSA_ES, ease.out(prog(t, 0.2, 0.6))); celaIcone(g, 580, 560, 420, 460, '#e8ecf2', '#6a6e78', ease.out(prog(t, tB - 0.3, tB)));
  for (let i = 0; i < 30; i++) { const k = ease.out(prog(t, 0.6 + i * 0.02, 0.8 + i * 0.02)); if (k > 0) preso(g, 125 + (i % 6) * 66, 1130 + Math.floor(i / 6) * 0, 0.0001 + 0); }
  text(g, 'CELA ROSA', 290, 1090, { size: 40, color: ROSA, font: FONTS.ui, weight: 900, spacing: 2, alpha: ease.out(prog(t, 0.2, 0.6)) });
  text(g, 'BRANCA + CHÃO CINZA', 790, 1090, { size: 34, color: u.cream, font: FONTS.ui, weight: 900, spacing: 1, alpha: ease.out(prog(t, tB - 0.3, tB)) });
  text(g, '30', 290, 820, { size: 110, color: '#ffffff', font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 0.4, 0.7)) }); text(g, '29', 790, 820, { size: 110, color: '#2a2e3a', font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, tB, tB + 0.3)) });
  bpTitle(g, 'METADE E METADE', 400, ease.out(prog(t, 0.05, 0.4)));
} });

// gráfico de agressividade em 3 dias (duas linhas)
function grafico(g, t, k, igual) {
  const u = S().ui, x0 = 140, y0 = 1150, w = 800, h = 520;
  seg(g, [[x0, y0 - h], [x0, y0], [x0 + w, y0]], 4, alpha('#dfe8ff', 0.7));
  ['DIA 1', 'DIA 2', 'DIA 3'].forEach((s, i) => text(g, s, x0 + 80 + i * 320, y0 + 50, { size: 32, color: u.cream, font: FONTS.ui, weight: 900 }));
  text(g, 'AGRESSIVIDADE', x0 + 20, y0 - h - 30, { size: 30, color: u.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  const lin = (off, c, w2) => { g.strokeStyle = c; g.lineWidth = w2; g.beginPath(); for (let i = 0; i <= 40 * k; i++) { const f = i / 40, x = x0 + 80 + f * 640, y = y0 - h * 0.85 + h * 0.6 * (1 - Math.exp(-f * 2.2)) / (1 - Math.exp(-2.2)) + off; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); };
  lin(igual ? 0 : -6, alpha('#e8ecf2', 0.9), 8); lin(igual ? 0 : 6, alpha(ROSA, 0.95), igual ? 4 : 8);
  text(g, '— ROSA', x0 + w - 150, y0 - h + 20, { size: 30, color: ROSA, font: FONTS.ui, weight: 900, align: 'left' }); text(g, '— BRANCA', x0 + w - 150, y0 - h + 64, { size: 30, color: '#e8ecf2', font: FONTS.ui, weight: 900, align: 'left' });
}
// s36 — "Depois de três dias, todo mundo estava mais calmo."
registerShot('s36', { draw(g, t, info) {
  UI.blueprint(g); grafico(g, t, ease.inOut(prog(t, 0.2, info.dur - 0.3)), false);
  bpTitle(g, 'TODOS MAIS CALMOS', 400, ease.out(prog(t, 0.1, 0.5)));
} });
// s37 — "Mas a cor não fez nenhuma diferença."
registerShot('s37', { draw(g, t, info) {
  UI.blueprint(g); grafico(g, t, 1, true); const tN = W0('nenhuma', info);
  bpTitle(g, 'A COR', 400, ease.out(prog(t, 0.05, 0.4)));
  if (t > tN) text(g, 'NENHUMA DIFERENÇA', E.W / 2, 1300, { size: 60, color: GOLD, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tN, tN + 0.3)), glow: 16, glowColor: 'rgba(255,150,60,.5)' });
} });

// s38 — "Ou seja: o que te acalma não é o rosa. É o tempo." — a cela perde o rosa; o relógio gira
registerShot('s38', { draw(g, t, info) {
  const d = info.dur, tT = W0('tempo', info), cam = camPath(t, d, { z: 1.12 }, { z: 1.0 }, { hand: 3, seed: 12 });
  const { GY, CX } = cela(g, t, cam, { pint: 1 - ease.inOut(prog(t, tT - 1.0, tT + 0.3)) });
  layer(g, cam, 1, (g) => drawFigure(g, { x: CX, y: GY - 260, s: 1.7, facing: 1, outfit: VOCE, pose: sentado(t), expr: t > tT ? 'smile' : 'neutral', look: [0, -0.2], rim: rimOf('#ffffff', [0, -1]) }));
  const tR = W0('rosa', info); if (t > tR) text(g, 'NÃO É O ROSA', E.W / 2, 400, { size: 58, color: '#2a2a34', font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tR, tR + 0.3)) });
  if (t > tT - 0.2) { relogio(g, E.W / 2, 700, 130, t * 8); text(g, 'É O TEMPO', E.W / 2, 930, { size: 80, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, glow: 18, glowColor: 'rgba(120,60,40,.6)', alpha: ease.out(prog(t, tT - 0.2, tT + 0.2)) }); }
} });

// s39 — tela final
registerShot('s39', { draw(g, t, info) {
  const u = S().ui;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#070b18', '#0b1224', '#2a1a34']); g.fillRect(0, 0, E.W, E.H);
  FX.stars(g, t, { count: 100, area: [0, 0, E.W, E.H * 0.4] }); glow(g, E.W / 2, E.H * 0.95, E.W * 0.7, ROSA, 0.2);
  const a1 = ease.out(prog(t, 0.1, 0.5));
  text(g, 'Numa cela toda rosa,', E.W / 2, 330, { size: 62, font: FONTS.serif, weight: 900, italic: true, color: u.cream, alpha: a1, glow: 18, glowColor: 'rgba(255,170,90,.5)' });
  text(g, 'calmo ou irritado?', E.W / 2, 420, { size: 70, font: FONTS.serif, weight: 900, italic: true, color: GOLD, alpha: a1, glow: 18, glowColor: 'rgba(255,170,90,.5)' });
  [['MAIS CALMO', '#5fe0d8', 0.35], ['IRRITADO', '#ffb070', 0.5]].forEach(([lab, c, at], i) => {
    const p = ease.outBack(prog(t, at, at + 0.4)); if (p <= 0) return;
    g.save(); g.translate(E.W / 2 + (i ? 230 : -230), 590); g.scale(p, p); rr(g, -200, -50, 400, 100, 50); g.strokeStyle = c; g.lineWidth = 5; g.stroke();
    text(g, lab, 0, 3, { size: 40, color: c, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore();
  });
  const tC = W0('Comenta', info), pb = ease.outBack(prog(t, Math.min(tC, 6) - 0.2, Math.min(tC, 6) + 0.2)); if (pb > 0) { g.save(); g.translate(E.W / 2, 750); g.scale(pb, pb); UI.bubble(g, 0, 0, { w: 560, h: 120, str: 'COMENTA AÍ', color: '#f4efe6' }); g.restore(); }
  const cast = [GUARDA, VOCE, DETENTO], y0 = 1400;
  cast.forEach((of, i) => { const kk = ease.out(prog(t, 0.3 + i * 0.1, 0.8 + i * 0.1)); drawFigure(g, { x: E.W / 2 + (i - 1) * 240, y: y0 + (1 - kk) * 40, s: i === 1 ? 2.3 : 2.0, facing: 1, outfit: of, pose: POSES.relaxed, expr: i === 1 ? 'thinking' : 'neutral', alpha: kk, rim: { color: '#ffb070', dir: [0, 1] } }); });
  veil(g, '#000', ease.in(prog(t, info.dur - 0.8, info.dur)));
} });
