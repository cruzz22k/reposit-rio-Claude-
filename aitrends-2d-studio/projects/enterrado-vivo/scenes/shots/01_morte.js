// shots/01_morte.js — título, 1830, a cólera, a febre, o espelho, declarado morto, o enterro às pressas (s01–s10).
import { E, V, S, registerShot, layer, blurLayer, veil, ease, prog, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, backdrop, text, FONTS, rng, wordTime } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street, bedroom, bed1830, cemetery, candle, lantern, coffinSide, shovel, CANDLE, MOON, WOOD } from '../sets/world.js';
import { labelTitle, bpTitle, stamp, joint } from '../sets/common.js';
import { camPath, punch, focus, dof, bokeh, fogDrift, shafts, foreLeaves } from '/engine/cine.js';
import { VOCE, MEDICO, MAE, PAI, COVEIRO, GOLD } from '../cast.js';

export const rimOf = (c, dir = [0.5, -1]) => ({ color: c, dir, w: 5 });
const HID = { hidden: true };
export const W0 = (w, info, after = 0) => { const s0 = info.shot.start, x = wordTime(w, s0 - 0.25 + after); return x == null ? 99 : x - s0; };   // tempo da palavra dentro da tomada (99 se não achar)
export function zoomAt(g, cx, cy, z) { g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); }
// você deitado (de costas), cabeça à esquerda
export function deitado(g, x, y, s, outfit, o = {}) { drawFigure(g, { x, y, s, facing: 1, rot: -Math.PI / 2, outfit, pose: o.pose || POSES.lie, expr: o.expr || 'neutral', blink: o.blink ?? 1, rim: o.rim || rimOf(CANDLE, [0, -1]), shadow: false, face: o.face, alpha: o.alpha }); }
// lenço no rosto (coveiros)
function lenco(g, o) { const [x, y] = joint(o, 'head'), s = o.s ?? 1; rr(g, x - 16 * s, y + 2 * s, 32 * s, 16 * s, 5 * s); g.fillStyle = '#c8c0b0'; g.fill(); }

// s01 — abertura/capa: cemitério à noite, névoa, lápides desfocadas na frente
registerShot('s01', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0, y: 10 }, { z: 1.08, y: 40 }, { hand: 4, seed: 2 });
  const { GY } = cemetery(g, t, cam);
  layer(g, cam, 0.4, (g) => shafts(g, t, E.W / 2 + 280, 330, { angle: Math.PI * 0.62, spread: 0.45, len: 1900, color: '#bcc8ff', a: 0.08 }));
  layer(g, cam, 0.7, (g) => fogDrift(g, t, GY - 200, 220, '#5a6a9a', { a: 0.22, speed: 14, seed: 3 }));
  layer(g, cam, 0.9, (g) => { lantern(g, E.W / 2 + 200, GY + 40, t, 1.3); FX.pool(g, E.W / 2 + 200, GY + 60, 240, 40, CANDLE, 0.16); });
  blurLayer(g, 10, (g) => { for (const [x, s] of [[90, 2.6], [1010, 2.9]]) { g.fillStyle = '#05070e'; g.beginPath(); g.moveTo(x - 60 * s, E.H); g.lineTo(x - 60 * s, E.H - 140 * s); g.arc(x, E.H - 140 * s, 60 * s, Math.PI, 0); g.lineTo(x + 60 * s, E.H); g.fill(); } }, cam, 1.6);
  fogDrift(g, t, GY + 100, 260, '#4a5a8a', { a: 0.22, speed: 22, seed: 7 });
  bokeh(g, t, { count: 6, color: CANDLE, a: 0.1, seed: 5, rMin: 40, rMax: 110 });
  FX.dust(g, t, { count: 50, color: '#cfd8ff', a: 0.3 });
  UI.titleCard(g, t + 0.2, { lines: ['O QUE ACONTECERIA', 'SE VOCÊ FOSSE', 'ENTERRADO VIVO', 'NO SÉCULO 19?'], dur: d + 0.4, y: E.H * 0.27 });
} });

// s02 — "Europa, 1830. Uma epidemia de cólera está" — rua antiga ao entardecer; aviso na parede
registerShot('s02', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.04, x: 30, y: 20 }, { z: 1.12, x: -30, y: 0 }, { hand: 4, seed: 4 });
  const { GY, CX } = street(g, t, cam, { time: 'dusk' });
  layer(g, cam, 0.6, (g) => fogDrift(g, t, GY - 260, 260, '#c08a7a', { a: 0.14, speed: 10, seed: 9 }));
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 3; i++) { const x = CX - 380 + i * 160 + t * 50, o = { x, y: GY + 120 + i * 30, s: 1.5, facing: 1, outfit: [PAI, MAE, COVEIRO][i], pose: walkPose(t * 4 + i * 1.3), expr: 'worried', rim: rimOf('#ffb070', [-0.6, -0.6]) }; drawFigure(g, o); lenco(g, o); }
    const tA = W0('epidemia', info); if (t > tA - 0.2) { const k = ease.outBack(prog(t, tA - 0.2, tA + 0.2)); g.save(); g.translate(CX + 300, GY - 330); g.rotate(0.04); g.scale(k, k); rr(g, -120, -150, 240, 300, 6); g.fillStyle = '#e8dcc0'; g.fill(); text(g, 'AVISO', 0, -100, { size: 40, color: '#2a2018', font: FONTS.ui, weight: 900, spacing: 4 }); text(g, 'CÓLERA', 0, -30, { size: 50, color: '#a02a20', font: FONTS.ui, weight: 900 }); for (let j = 0; j < 4; j++) { g.fillStyle = 'rgba(40,30,20,.35)'; g.fillRect(-90, 20 + j * 28, 180 * [1, 0.8, 0.9, 0.6][j], 8); } g.restore(); }
  });
  FX.dust(g, t, { count: 40, color: '#ffd8b0', a: 0.3 });
  labelTitle(g, t, 'EUROPA', '1830', E.H * 0.24, { at: 0.1, big: 120 });
} });

// s03 — "matando gente em todo lugar." — mapa em traço fino com a cólera se espalhando
const CID = [['MOSCOU', 860, 560], ['VARSÓVIA', 660, 700], ['BERLIM', 520, 720], ['VIENA', 560, 880], ['PARIS', 300, 860], ['LONDRES', 250, 700], ['MADRI', 150, 1110], ['ROMA', 520, 1090]];
registerShot('s03', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, k = ease.inOut(t / info.dur);
  g.save(); zoomAt(g, E.W / 2, E.H * 0.47, 1.0 + 0.06 * k);
  g.strokeStyle = alpha(bp, 0.35); g.lineWidth = 3; g.beginPath(); const r = rng(3); g.moveTo(90, 620); for (const [x, y] of [[200, 560], [330, 600], [420, 520], [560, 470], [700, 420], [900, 440], [980, 560], [980, 900], [820, 1000], [700, 1040], [620, 1200], [540, 1180], [460, 1000], [380, 1040], [300, 1000], [180, 1220], [80, 1160], [100, 940], [200, 860], [140, 760]]) g.lineTo(x + (r() - 0.5) * 10, y); g.closePath(); g.stroke(); g.fillStyle = alpha(bp, 0.04); g.fill();
  CID.forEach(([n, x, y], i) => { const t0 = i * 0.22, p = prog(t, t0, t0 + 1.2); if (p <= 0) { circle(g, x, y, 6, alpha(bp, 0.6)); return; } glow(g, x, y, 60 + 120 * ease.out(p), u.accent, 0.35 * (1 - 0.4 * p)); ring(g, x, y, 14 + 70 * ease.out(p), 3, alpha(u.accent, 0.7 * (1 - p) + 0.2)); circle(g, x, y, 10, u.accent); text(g, n, x, y - 34, { size: 24, color: u.cream, font: FONTS.ui, weight: 900, spacing: 2, alpha: clamp(p * 3) }); });
  g.restore();
  bpTitle(g, 'CÓLERA · 1830–1832', 330, ease.out(prog(t, 0.1, 0.5)));
  const n = Math.round(lerp(0, 8, clamp(t / 1.9))); text(g, `${n} CIDADES`, E.W / 2, 1255, { size: 54, color: u.accent, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.2, 0.5)) });
} });

// s04 — "Você pega uma febre forte… e apaga." — close com suor; os olhos se fecham
registerShot('s04', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0 }, { z: 1.1, y: -20 }, { hand: 3, seed: 5 });
  blurLayer(g, 9, (g) => bedroom(g, t, cam), cam, 0.5);
  glow(g, E.W * 0.2, E.H * 0.55, 500, CANDLE, 0.3);
  const tA = W0('apaga', info), shut = ease.inOut(prog(t, tA - 0.1, tA + 0.35)), tilt = lerp(0, -0.18, ease.inOut(prog(t, tA - 0.4, tA + 0.4)));
  layer(g, cam, 1, (g) => bigFace(g, E.W / 2, E.H * 0.47, 300, { outfit: VOCE, expr: 'nervous', blink: shut, look: [0.2, 0.3], rimColor: CANDLE, rimSide: -1, tilt }));
  for (let i = 0; i < 4; i++) { const y = (E.H * 0.38 + ((t * 120 + i * 90) % 260)); g.fillStyle = 'rgba(200,230,255,.6)'; g.beginPath(); g.ellipse(E.W / 2 + 160 + i * 18, y, 7, 11, 0, 0, 7); g.fill(); }
  const tf = W0('febre', info); if (t > tf) { g.save(); g.globalAlpha = 0.18 * Math.abs(Math.sin(t * 3)); g.fillStyle = '#ff6a3a'; g.fillRect(0, 0, E.W, E.H); g.restore(); }
  veil(g, '#000', 0.92 * ease.in(prog(t, tA + 0.1, d)));
} });

// s05 — "Seu coração bate tão fraco que ninguém sente." — coração em traço fino, pulso quase reto
function heart(g, x, y, s, c, w = 6) { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(x, y + 90 * s); g.bezierCurveTo(x - 160 * s, y - 20 * s, x - 90 * s, y - 130 * s, x, y - 60 * s); g.bezierCurveTo(x + 90 * s, y - 130 * s, x + 160 * s, y - 20 * s, x, y + 90 * s); g.stroke(); }
registerShot('s05', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, d = info.dur;
  const beat = Math.exp(-((t * 0.9) % 1) * 9), weak = lerp(1, 0.18, clamp(t / 1.6));
  heart(g, E.W / 2, 720, 1.6 * (1 + 0.05 * beat * weak), alpha(bp, 0.9)); glow(g, E.W / 2, 700, 300, u.accent, 0.15 * beat * weak);
  g.strokeStyle = u.accent; g.lineWidth = 5; g.beginPath(); const y0 = 1080;
  for (let x = 60; x <= E.W - 60; x += 6) { const ph = (x / 300 - t * 1.6) % 1, f = ph < 0 ? ph + 1 : ph; const spike = f > 0.45 && f < 0.55 ? Math.sin((f - 0.45) / 0.1 * Math.PI) * 220 * weak : 0; x === 60 ? g.moveTo(x, y0 - spike) : g.lineTo(x, y0 - spike); } g.stroke();
  bpTitle(g, 'PULSO', 400, ease.out(prog(t, 0.1, 0.5)));
  text(g, t < 1.6 ? 'FRACO' : 'QUASE ZERO', E.W / 2, 1250, { size: 60, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.6, 1.0)), glow: 16, glowColor: 'rgba(255,150,60,.5)' });
} });

// s06 — "O médico coloca um espelho na frente do seu nariz." — quarto, vela; o médico se inclina
registerShot('s06', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.05, x: -20 }, { z: 1.18, x: 30, y: 20 }, { hand: 3, seed: 7 });
  const { GY, CX } = bedroom(g, t, cam);
  const lean = ease.inOut(prog(t, 0.2, 1.1)), tE = W0('espelho', info);
  layer(g, cam, 1, (g) => {
    bed1830(g, CX - 420, GY + 40, 600);
    deitado(g, CX - 150, GY - 95, 1.25, VOCE, { blink: 1 });
    rr(g, CX + 230, GY - 120, 140, 160, 6); g.fillStyle = '#3a2a1e'; g.fill(); candle(g, CX + 300, GY - 120, t, 1.2);
    const pose = blendPose(POSES.stand, { ...POSES.reach, head: [26, -196], sh: [14, -166] }, lean), o = { x: CX + 140, y: GY + 40, s: 1.55, facing: -1, outfit: MEDICO, pose: breathe(pose, t, 0.6, 3), expr: 'worried', look: [-1, 0.6], rim: rimOf(CANDLE, [1, -0.4]) };
    drawFigure(g, o);
    const [hx, hy] = joint(o, 'hF'); if (t > tE - 0.4) { const a = ease.out(prog(t, tE - 0.4, tE)); g.save(); g.globalAlpha = a; g.translate(hx, hy); g.rotate(-0.3); g.fillStyle = '#c8a050'; g.beginPath(); g.ellipse(0, -30, 30, 42, 0, 0, 7); g.fill(); g.fillStyle = '#cfe0f0'; g.beginPath(); g.ellipse(0, -30, 22, 33, 0, 0, 7); g.fill(); seg(g, [[0, 10], [0, 40]], 8, '#c8a050'); g.restore(); }
  });
  glow(g, E.W / 2 + 300, GY - 200, 500, CANDLE, 0.15);
  bokeh(g, t, { count: 5, color: CANDLE, a: 0.1, seed: 2 });
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.3 });
} });

// s07 — "O espelho não embaça." — close do espelho: limpo, só a chama refletida
registerShot('s07', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0 }, { z: 1.08 }, { hand: 3, seed: 8 });
  blurLayer(g, 12, (g) => { bedroom(g, t, cam); deitado(g, E.W / 2 - 60, 1180, 2.6, VOCE, { blink: 1 }); }, cam, 0.6);
  veil(g, '#000', 0.35);
  layer(g, cam, 1.1, (g) => {
    const x = E.W / 2 + 40, y = E.H * 0.44; g.save(); g.translate(x, y); g.rotate(-0.12);
    g.fillStyle = '#9a7a38'; g.beginPath(); g.ellipse(0, 0, 250, 340, 0, 0, 7); g.fill(); g.fillStyle = '#c8a050'; g.beginPath(); g.ellipse(0, 0, 232, 322, 0, 0, 7); g.fill();
    g.fillStyle = linGrad(g, -200, -300, 200, 300, ['#d8e6f2', '#9fb4c8', '#cfdeec']); g.beginPath(); g.ellipse(0, 0, 205, 296, 0, 0, 7); g.fill();
    glow(g, 90, 60, 120, CANDLE, 0.5); g.fillStyle = '#ffd890'; g.beginPath(); g.ellipse(90, 60, 10, 22, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(-150, -200); g.lineTo(-90, -250); g.lineTo(60, 220); g.lineTo(0, 260); g.fill();
    seg(g, [[0, 330], [0, 560]], 34, '#9a7a38'); g.restore();
  });
  const tN = W0('não', info); if (t > tN) { const a = ease.out(prog(t, tN, tN + 0.3)); text(g, 'NÃO EMBAÇA', E.W / 2, 300, { size: 64, color: GOLD, font: FONTS.ui, weight: 900, spacing: 5, alpha: a, glow: 18, glowColor: 'rgba(255,150,60,.5)' }); }
  FX.dust(g, t, { count: 30, color: '#ffe0b0', a: 0.3 });
} });

// s08 — "Você é declarado morto." — o médico baixa o espelho; a mãe leva as mãos à cabeça; carimbo pequeno
registerShot('s08', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.12, x: 20 }, { z: 1.04, x: -10 }, { hand: 3, seed: 9 });
  const { GY, CX } = bedroom(g, t, cam), tM = W0('morto', info);
  layer(g, cam, 1, (g) => {
    bed1830(g, CX - 420, GY + 40, 600); deitado(g, CX - 150, GY - 95, 1.25, VOCE, { blink: 1 });
    rr(g, CX + 230, GY - 120, 140, 160, 6); g.fillStyle = '#3a2a1e'; g.fill(); candle(g, CX + 300, GY - 120, t, 1.2);
    drawFigure(g, { x: CX + 140, y: GY + 40, s: 1.55, facing: -1, outfit: MEDICO, pose: breathe({ ...POSES.sad, head: [6, -200] }, t, 0.5, 4), expr: 'sad', look: [-1, 0.5], rim: rimOf(CANDLE, [1, -0.4]) });
    drawFigure(g, { x: CX + 420, y: GY + 60, s: 1.5, facing: -1, outfit: MAE, pose: posesAt(t, [[0, POSES.stand], [tM - 0.1, POSES.handsOnHead]]), expr: t > tM ? 'shocked' : 'worried', rim: rimOf(CANDLE, [-1, -0.4]) });
  });
  glow(g, E.W / 2 + 300, GY - 200, 500, CANDLE, 0.15);
  stamp(g, E.W / 2, 420, t - tM, 'ÓBITO', { rot: -0.12 });
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.3 });
} });

// s09 — "Com medo do contágio, as vítimas da cólera eram enterradas rápido," — carroça de caixões à noite
function carroca(g, x, y, s, t) {
  g.fillStyle = '#3a2a1e'; g.fillRect(x - 230 * s, y - 120 * s, 460 * s, 30 * s);
  for (let i = 0; i < 3; i++) coffinSide(g, x - 210 * s + (i % 2) * 20 * s, y - 120 * s - i * 62 * s, 420 * s, 60 * s, { color: i % 2 ? '#5a4030' : WOOD });
  for (const dx of [-150, 150]) { ring(g, x + dx * s, y - 50 * s, 50 * s, 10 * s, '#2a1e14'); for (let k = 0; k < 6; k++) { const a = t * 3 + k; seg(g, [[x + dx * s, y - 50 * s], [x + dx * s + Math.cos(a) * 46 * s, y - 50 * s + Math.sin(a) * 46 * s]], 4 * s, '#2a1e14'); } }
  seg(g, [[x + 230 * s, y - 100 * s], [x + 420 * s, y - 60 * s]], 8 * s, '#3a2a1e');
}
registerShot('s09', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.06, x: 60 }, { z: 1.1, x: -40 }, { hand: 4, seed: 11 });
  const { GY, CX } = street(g, t, cam, { time: 'night' });
  layer(g, cam, 0.6, (g) => fogDrift(g, t, GY - 200, 240, '#5a6a9a', { a: 0.2, speed: 16, seed: 5 }));
  layer(g, cam, 1, (g) => {
    const x = CX - 60 + t * 40; carroca(g, x, GY + 200, 1.0, t);
    const o = { x: x + 470, y: GY + 210, s: 1.5, facing: 1, outfit: COVEIRO, pose: walkPose(t * 3.2), expr: 'worried', rim: rimOf(CANDLE, [-1, -0.5]) }; drawFigure(g, o); lenco(g, o);
    const o2 = { x: x - 330, y: GY + 220, s: 1.45, facing: 1, outfit: { ...COVEIRO, color: '#4a4a5a' }, pose: walkPose(t * 3.2 + 1), expr: 'worried', rim: rimOf(CANDLE, [1, -0.5]) }; drawFigure(g, o2); lenco(g, o2);
    lantern(g, x + 520, GY + 60, t, 1.0);
  });
  const tR = W0('rápido', info); if (t > tR) text(g, 'ENTERRO RÁPIDO', E.W / 2, 400, { size: 56, color: GOLD, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tR, tR + 0.3)), glow: 16, glowColor: 'rgba(255,150,60,.5)' });
  foreLeaves(g, t, cam, { side: -1, y: E.H * 0.05, amount: 10, seed: 3 });
  FX.dust(g, t, { count: 40, color: '#cfd8ff', a: 0.28 });
} });

// s10 — "às vezes sem ninguém conferir direito quem estava morto e quem ainda estava morrendo." — coveiros baixam o caixão
registerShot('s10', { draw(g, t, info) {
  const d = info.dur, cam = camPath(t, d, { z: 1.0, y: 30 }, { z: 1.14, y: 80 }, { hand: 4, seed: 12 });
  const { GY, CX } = cemetery(g, t, cam, { clear: true });
  const down = ease.inOut(prog(t, 0.3, d - 0.5));
  layer(g, cam, 0.95, (g) => {
    g.fillStyle = '#0a0806'; g.fillRect(CX - 280, GY + 40, 560, 600); g.fillStyle = '#4a382a'; g.beginPath(); g.ellipse(CX + 420, GY + 60, 180, 60, 0, Math.PI, 0); g.fill();
    g.save(); g.beginPath(); g.rect(CX - 280, -E.H, 560, GY + 40 + E.H + 600); g.clip(); coffinSide(g, CX - 240, GY + 40 + down * 380, 480, 110); seg(g, [[CX - 246, GY - 86 + down * 380], [CX + 246, GY - 86 + down * 380]], 4, alpha(MOON, 0.7)); g.restore();
    for (const [sx, ox] of [[-1, CX - 360], [1, CX + 360]]) { const o = { x: ox, y: GY + 60, s: 1.5, facing: -sx, outfit: COVEIRO, pose: breathe({ ...POSES.holdFront, hF: [36, lerp(-152, -120, down)], hB: [30, lerp(-154, -122, down)] }, t, 0.6, ox), expr: 'worried', rim: rimOf(MOON, [sx, -0.6]) }; drawFigure(g, o); lenco(g, o); const [hx, hy] = joint(o, 'hF'); seg(g, [[hx, hy], [CX + sx * 200, GY + down * 380 - 60]], 3, '#b8a888'); }
    shovel(g, CX + 520, GY - 140, 0.4, 1.1);
  });
  const tm = W0('morto', info), tr = W0('morrendo', info);
  if (t > tm) text(g, 'MORTO?', E.W / 2 - 200, 520, { size: 58, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tm, tm + 0.3)) });
  if (t > tr) text(g, 'MORRENDO?', E.W / 2 + 170, 620, { size: 58, color: S().ui.accent, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tr, tr + 0.3)) });
  fogDrift(g, t, GY + 120, 240, '#4a5a8a', { a: 0.22, speed: 18, seed: 8 });
  FX.dust(g, t, { count: 40, color: '#cfd8ff', a: 0.28 });
} });
