// shots/04_escola.js — a infância: União das Crianças, lenço, estudo, arrozal, broche, autocrítica (s21–s24, s26–s33).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, backdrop, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, deskLamp, village, classroom, schoolDesk, paddy } from '../sets/places.js';
import { faceWithScarf, scarfOn, pinOn, ageBadge, pointingArm, ground } from '../sets/common.js';
import { VOCE_KID, PROF, KID, LENCO } from '../cast.js';

const WHITE_KID = { top: 'tshirt', color: '#e8e4ee', kid: true };
const rimOf = (M, dir = [0.4, -1]) => ({ color: M.rim, dir, w: 5 });
function zoomAt(g, cx, cy, z) { g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); }
function flag(g, x, y, h, t, ph = 0, w = 220) {
  seg(g, [[x, y], [x, y - h]], 8, '#d8d0c0');
  g.fillStyle = LENCO; g.beginPath(); g.moveTo(x, y - h); for (let i = 0; i <= 8; i++) g.lineTo(x + i * w / 8, y - h + Math.sin(i * 0.8 + t * 5 + ph) * 10 * (i / 8));
  for (let i = 8; i >= 0; i--) g.lineTo(x + i * w / 8, y - h + w * 0.6 + Math.sin(i * 0.8 + t * 5 + ph) * 10 * (i / 8)); g.fill();
}
// cenário da cerimônia: palco com fundo vermelho, bandeiras, retratos
function ceremony(g, t, cam) {
  const M = mood('day'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.15, (g) => { backdrop(g, M.sky); FX.clouds(g, { y: 200, h: 400, color: '#ffffff', a: 0.25, seed: 4 }); });
  layer(g, cam, 0.5, (g) => {
    const top = GY - 1050; g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(LENCO, -0.1), shade(LENCO, -0.5)]); g.fillRect(-E.W, top, E.W * 3, GY - top);
    for (let x = -E.W; x < E.W * 2; x += 120) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x, top, 50, GY - top); }
    for (const sx of [-1, 1]) { const x = CX + sx * 150 - 90; rr(g, x - 10, top + 90, 200, 260, 6); g.fillStyle = '#c8a050'; g.fill(); g.fillStyle = shade(LENCO, 0.1); g.fillRect(x, top + 100, 180, 240); circle(g, x + 90, top + 200, 46, S().ink); g.fillStyle = S().ink; g.beginPath(); g.ellipse(x + 90, top + 345, 80, 70, 0, Math.PI, 0); g.fill(); }
    g.fillStyle = '#f2c21a'; g.fillRect(CX - 360, top + 400, 720, 40);
  });
  layer(g, cam, 0.75, (g) => { for (let i = -3; i <= 4; i++) flag(g, CX + i * 260 - 120, GY - 260, 560, t, i, 180); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, -0.1), shade(M.dark, -0.2)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.2)', 0.1); });
  return { GY, CX, M };
}

// s21 — "Aos sete anos, você entra na União das Crianças."
registerShot('s21', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.02 + 0.06 * k, x: -30 + 40 * k };
  const { GY, CX, M } = ceremony(g, t, cam);
  layer(g, cam, 1, (g) => {
    for (const [row, s, dy] of [[0, 1.5, -120], [1, 1.8, -50]]) for (let i = -3; i <= 3; i++) {
      const x = CX + i * 160 + row * 80, me = row === 1 && i === 0;
      const o = { x, y: GY + dy + 40 * row, s, facing: 1, outfit: me ? VOCE_KID : WHITE_KID, pose: breathe(POSES.stand, t, 0.4, i + row * 7), expr: me ? 'smile' : 'neutral', rim: rimOf(M, [0.3, -1]), dim: me ? 0 : 0.15 * (1 - row) };
      drawFigure(g, o); if (t > 0.9 || !me) scarfOn(g, o);
    }
  });
  FX.dust(g, t, { count: 30, color: '#fff2d8', a: 0.3 });
  ageBadge(g, t, '7 ANOS', { at: 0.3 });
  const a = ease.out(prog(t, 1.8, 2.2));
  text(g, 'UNIÃO DAS CRIANÇAS', E.W / 2, 330, { size: 58, color: S().ui.gold, alpha: a, spacing: 3, glow: 22, glowColor: 'rgba(255,120,40,.8)' });
} });

// s22 — "Ganha um lenço vermelho," — o lenço é amarrado
registerShot('s22', { draw(g, t, info) {
  blurLayer(g, 14, (g) => ceremony(g, t, { z: 1.5, y: -200 })); veil(g, '#14080a', 0.3);
  const M = mood('day'), r = 320 * (1 + 0.04 * t), p = ease.inOut(prog(t, 0.2, 1.0));
  faceWithScarf(g, E.W / 2, E.H * 0.52, r, { outfit: VOCE_KID, scarf: p, expr: t < 0.9 ? 'neutral' : 'happy', look: [0, 0.4 - 0.6 * p], rimColor: '#fff1d6', rimSide: -1 });
  if (t > 1.0) FX.sparkle(g, E.W / 2 + r * 0.4, E.H * 0.52 + r * 1.3, 40 * (1 - prog(t, 1.0, 1.6)) + 8, '#fff2c8', 0.9);
  FX.dust(g, t, { count: 30, color: '#fff2d8', a: 0.3 });
} });

// s23 — "mas antes precisa decorar o juramento, as regras e os poemas dos líderes." — os livros caem na pilha
registerShot('s23', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12 + 0.08 * k, x: 40, y: 40 };
  const { GY, CX, M, W } = bedroom(g, t, cam, { portraits: true });
  veil(g, '#05040a', 0.15);
  layer(g, cam, 1, (g) => {
    const top = deskLamp(g, CX + 80, GY, W, 1);
    FX.chair(g, CX - 230, GY, 2.0, '#1e1412');
    const books = [[1.5, 'JURAMENTO', '#8a2a2a'], [2.4, 'REGRAS', '#2a4a7a'], [3.2, 'POEMAS', '#7a5a1a']];
    let y = top; const bx = CX + 120;
    books.forEach(([at, lab, c], i) => {
      const p = ease.in(prog(t, at - 0.3, at)), by = lerp(-200, y, p) - (t > at ? Math.max(0, Math.sin((t - at) * 20)) * 8 * Math.exp(-(t - at) * 8) : 0);
      if (p > 0) { g.save(); g.translate(bx, by); g.rotate((1 - p) * 0.4 + [0.03, -0.04, 0.02][i]); rr(g, -150, -58, 300, 58, 6); g.fillStyle = c; g.fill(); g.fillStyle = '#f2e6c8'; g.fillRect(-150, -58, 300, 6); g.fillRect(-150, -6, 300, 6);
        text(g, lab, 0, -29, { size: 30, color: '#f6e8c0', font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
      y -= 58;
    });
    const nb = books.filter(([at]) => t > at).length;
    const pose = { ...POSES.sit, head: [14, -176], eF: [40, -126], hF: [72, -128], eB: [30, -120], hB: [64, -134] };
    drawFigure(g, { x: CX - 210, y: GY, s: 2.0, facing: 1, outfit: VOCE_KID, pose: breathe(pose, t, 0.4, 2), expr: nb < 2 ? 'thinking' : nb < 3 ? 'nervous' : 'shocked', look: [0.7, nb ? -0.5 : 0.3], rim: { color: W.practical, dir: [1, -0.3], w: 5 }, shadow: false });
  });
  FX.dust(g, t, { count: 40, color: W.practical, a: 0.35 });
} });

// s24 — "Na primavera, as aulas param." — sala de aula vazia, pétalas
registerShot('s24', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.04 + 0.05 * k, x: 50 - 80 * k };
  const { GY, CX, M } = classroom(g, t, cam, { spring: true, mood: 'interiorCool' });
  layer(g, cam, 1, (g) => { for (let r = 0; r < 2; r++) for (let i = -2; i <= 2; i++) schoolDesk(g, CX + i * 260 + r * 120, GY + r * 120, 1.6 + r * 0.3); });
  const r = rng(8); g.save();
  for (let i = 0; i < 26; i++) { const sp = 0.5 + r(), x = (r() * E.W + t * 90 * sp + Math.sin(t * 2 + i) * 40) % (E.W + 100) - 50, y = (r() * E.H * 0.8 + t * 120 * sp) % E.H; g.fillStyle = alpha('#f6b8cc', 0.8); g.beginPath(); g.ellipse(x, y, 10, 6, t * 2 + i, 0, 7); g.fill(); }
  g.restore();
  FX.dust(g, t, { count: 40, color: '#fff6e8', a: 0.35 });
} });

// pose de plantar (curvado)
const PLANT = { ...POSES.stand, head: [46, -146], sh: [34, -132], hip: [0, -100], eF: [50, -96], hF: [58, -46], eB: [40, -98], hB: [50, -50], kF: [8, -50], fF: [6, 0], kB: [-8, -50], fB: [-16, 0] };
// s26 — "do amanhecer até a noite," — o céu passa do amanhecer à noite
registerShot('s26', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.08, x: -20 + 30 * k };
  const { GY, CX, M } = paddy(g, t, cam, 0.02 + 0.92 * k);
  layer(g, cam, 1, (g) => {
    const pose = { ...PLANT, hF: [58 + Math.sin(t * 6) * 8, -46 + Math.abs(Math.sin(t * 6)) * 12] };
    const o = { x: CX - 60, y: GY + 10, s: 2.6, facing: 1, outfit: VOCE_KID, pose, expr: k > 0.6 ? 'sleepy' : 'neutral', rim: rimOf(M, [1, -0.6]) };
    drawFigure(g, o); scarfOn(g, o);
    g.fillStyle = alpha('#8ab0c8', 0.25); g.beginPath(); g.ellipse(CX - 60, GY + 18, 160, 14, 0, 0, 7); g.fill();
  });
  const hours = Math.floor(5 + k * 16);
  UI.readout(g, { label: 'HORA', value: `${String(hours).padStart(2, '0')}:00`, x: E.W / 2, y: 300, align: 'center' });
} });

// s27 — "por cerca de um mês." — rosto cansado e o contador de dias
registerShot('s27', { draw(g, t, info) {
  blurLayer(g, 14, (g) => paddy(g, t, { z: 1.5, y: -150 }, 0.62)); veil(g, '#100a10', 0.35);
  const M = mood('dusk'), r = 310 * (1 + 0.03 * t);
  faceWithScarf(g, E.W / 2, E.H * 0.6, r, { outfit: VOCE_KID, expr: 'sleepy', look: [0, 0.3], rimColor: M.rim, rimSide: -1 });
  for (const [dx, dy, rr2] of [[-0.45, 0.35, 0.07], [0.5, 0.15, 0.05], [0.2, 0.55, 0.06]]) circle(g, E.W / 2 + dx * r, E.H * 0.6 + dy * r, rr2 * r, alpha('#5a3a24', 0.8));
  const day = Math.min(30, 1 + Math.floor(ease.inOut(prog(t, 0.1, 1.2)) * 29));
  UI.readout(g, { label: 'DIA', value: String(day), x: E.W / 2, y: 330, align: 'center', size: 96 });
} });

// s28 — "Aos doze, você recebe um broche com o rosto dos líderes." — macro do broche no peito
registerShot('s28', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), U = S().ui;
  g.save(); zoomAt(g, E.W / 2, E.H * 0.5, 1.0 + 0.06 * k);
  g.fillStyle = linGrad(g, 0, 0, E.W, E.H, ['#f2ece4', '#c8bcae', '#7a6e64']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  for (let i = 0; i < 30; i++) { g.strokeStyle = 'rgba(0,0,0,.05)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-200 + i * 60, -100); g.quadraticCurveTo(200 + i * 50, E.H * 0.5, -100 + i * 70, E.H + 100); g.stroke(); }
  seg(g, [[E.W * 0.78, -50], [E.W * 0.72, E.H + 50]], 26, 'rgba(0,0,0,.12)');
  for (let i = 0; i < 4; i++) circle(g, E.W * 0.77 - i * 15, 300 + i * 420, 22, '#e8e0d4');
  // o lenço na borda de cima
  poly(g, [[-50, -50], [E.W * 0.7, -50], [E.W * 0.42, 260]], LENCO);
  // o broche descendo até o peito
  const land = 1.35, p = ease.out(prog(t, 0.3, land)), bx = E.W * 0.45, by = lerp(-300, E.H * 0.5, p);
  g.save(); g.translate(bx, by); g.rotate((1 - p) * -0.3);
  g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 40; g.shadowOffsetY = 20 * p;
  rr(g, -230, -150, 460, 300, 36); g.fillStyle = shade(U.gold, -0.2); g.fill(); g.shadowColor = 'transparent';
  rr(g, -214, -134, 428, 268, 28); g.fillStyle = linGrad(g, 0, -134, 0, 134, [shade(LENCO, 0.15), shade(LENCO, -0.3)]); g.fill();
  for (const sx of [-1, 1]) { const cx = sx * 100; circle(g, cx, 0, 92, shade(U.gold, 0.1)); circle(g, cx, 0, 80, '#d8c8b0'); circle(g, cx, -14, 32, S().ink); g.fillStyle = S().ink; g.beginPath(); g.ellipse(cx, 70, 56, 52, 0, Math.PI, 0); g.fill(); if (sx > 0) { g.beginPath(); g.ellipse(cx, -30, 34, 14, 0, Math.PI, 0); g.fill(); } }
  g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.moveTo(-200, -130); g.lineTo(-40, -130); g.lineTo(-160, 130); g.lineTo(-200, 130); g.fill();
  g.restore();
  g.restore();
  if (t > land) { FX.sparkle(g, bx + 160, E.H * 0.5 - 110, 70 * (1 - prog(t, land, land + 0.8)) + 14, '#fff6dc', 1); FX.rings(g, bx, E.H * 0.5, t - land, { count: 2, r0: 200, r1: 600, speed: 1.4, color: '#fff6dc', a: 0.4 * (1 - prog(t, land, land + 1)) }); }
  ageBadge(g, t, '12 ANOS', { at: 0.2 });
} });

// s29 — "A partir dali, nunca mais sai de casa sem ele." — saindo de casa de manhã, o broche brilhando
registerShot('s29', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12, x: -60 + 120 * k };
  const { GY, CX, M } = village(g, t, cam, { time: 'day', billboard: true });
  layer(g, cam, 1, (g) => {
    const x = lerp(CX - 380, CX + 220, ease.inOut(prog(t, 0.2, info.dur))), walking = t > 0.2;
    const o = { x, y: GY + 20, s: 2.5, facing: 1, outfit: VOCE_KID, pose: walking ? walkPose(t * Math.PI * 2 * 0.9) : POSES.stand, expr: 'neutral', rim: rimOf(M, [-1, -0.6]) };
    drawFigure(g, o); scarfOn(g, o); pinOn(g, o, t, 1);
  });
  FX.dust(g, t, { count: 30, color: '#fff6e0', a: 0.3 });
} });

// sala de reunião: crianças sentadas, professora
function classSeated(g, t, cam, o = {}) {
  const r = classroom(g, t, cam, { mood: 'interiorCool' }), { GY, CX, M } = r;
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 5; i++) {
      const x = CX - 470 + i * 150, s = 1.6;
      FX.chair(g, x, GY + 60, s, '#1e1824');
      drawFigure(g, { x, y: GY + 60, s, facing: 1, outfit: WHITE_KID, pose: breathe(o.kidPose || POSES.sit, t, 0.4, i), expr: o.kidExpr || 'neutral', rim: rimOf(M, [1, -0.6]), dim: 0.25, shadow: false });
    }
  });
  return r;
}
// s30 — "Aos treze, começam as sessões de autocrítica."
registerShot('s30', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.04 + 0.05 * k, x: 30 };
  const { GY, CX, M } = classSeated(g, t, cam);
  layer(g, cam, 1, (g) => drawFigure(g, { x: CX + 360, y: GY + 20, s: 2.0, facing: -1, outfit: PROF, pose: breathe(posesAt(t, [[0, 'stand'], [1.6, 'point']]), t, 0.5, 9), expr: 'determined', rim: rimOf(M, [-1, -0.5]) }));
  ageBadge(g, t, '13 ANOS', { at: 0.25 });
  const a = ease.out(prog(t, 1.7, 2.1));
  text(g, 'AUTOCRÍTICA', E.W / 2, 320, { size: 72, color: S().ui.accent, alpha: a, spacing: 4, glow: 24, glowColor: 'rgba(255,60,40,.7)' });
} });

// s31 — "Toda semana, você fica de pé na frente dos outros, confessa o que fez de errado…"
registerShot('s31', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.08 * k, x: 120 };
  const { GY, CX, M } = classSeated(g, t, cam, { kidExpr: 'neutral' });
  veil(g, '#05060c', 0.35);
  layer(g, cam, 1, (g) => {
    const x = CX + 330; FX.lightCone(g, x, -200, { angle: Math.PI / 2, spread: 0.32, len: 1700, color: '#fff2d8', a: 0.22 }); FX.pool(g, x, GY + 30, 200, 36, '#fff2d8', 0.4);
    const o = { x, y: GY + 20, s: 2.3, facing: -1, outfit: VOCE_KID, pose: breathe(t < 1.5 ? POSES.stand : POSES.sad, t, 0.5, 4), expr: t < 1.5 ? 'nervous' : 'sad', look: [-0.3, 0.6], rim: { color: '#fff2d8', dir: [0, -1], w: 5 } };
    drawFigure(g, o); scarfOn(g, o); pinOn(g, o, t, 0.4);
  });
  // calendário: uma marca por semana
  const cx = 150, cy = 430; rr(g, cx - 90, cy - 110, 180, 210, 10); g.fillStyle = '#e8e2d6'; g.fill(); g.fillStyle = LENCO; g.fillRect(cx - 90, cy - 110, 180, 44);
  text(g, 'SEMANA', cx, cy - 88, { size: 22, color: '#fff', font: FONTS.ui, weight: 900, spacing: 2 });
  for (let i = 0; i < 4; i++) { const p = prog(t, 0.2 + i * 0.25, 0.4 + i * 0.25); if (p > 0) { const x = cx - 50 + (i % 2) * 100, y = cy - 20 + Math.floor(i / 2) * 80; seg(g, [[x - 22, y - 22], [x - 22 + 44 * p, y - 22 + 44 * p]], 6, S().ui.accent); seg(g, [[x + 22, y - 22], [x + 22 - 44 * p, y - 22 + 44 * p]], 6, S().ui.accent); } }
} });

// s32 — "e depois escuta todo mundo apontar seus defeitos." — dedos apontando de todo lado
registerShot('s32', { draw(g, t, info) {
  blurLayer(g, 14, (g) => classroom(g, t, { z: 1.5, y: -250 }, {})); veil(g, '#08060c', 0.45);
  const M = mood('interiorCool'), r = 300 * (1 + 0.05 * t), cx = E.W / 2, cy = E.H * 0.53;
  const sh = t > 1.6 ? shake(t, 4, 12) : [0, 0];
  faceWithScarf(g, cx + sh[0], cy + sh[1], r, { outfit: VOCE_KID, expr: t < 1.3 ? 'worried' : 'scared', look: [Math.sin(t * 3) * 0.5, -0.1], rimColor: M.rim, rimSide: 1 });
  const arms = [[-200, 300, 0.9], [E.W + 200, 380, 1.1], [-200, 1150, 1.5], [E.W + 200, 1250, 1.7], [-150, 1700, 2.0], [E.W + 150, 1750, 2.2], [E.W * 0.3, -250, 2.35], [E.W * 0.75, -250, 2.5]];
  arms.forEach(([x0, y0, at], i) => {
    const p = ease.out(prog(t, at, at + 0.3)); if (p <= 0) return;
    const ang = Math.atan2(cy - y0, cx - x0), d = Math.hypot(cx - x0, cy - y0), reach = d - r * 1.25;
    const x1 = x0 + Math.cos(ang) * reach * p, y1 = y0 + Math.sin(ang) * reach * p;
    pointingArm(g, x0, y0, x1, y1, 46, i % 2 ? '#e8e4ee' : '#d8d2e0', S().ink);
  });
} });

// s33 — "E você também tem que apontar os deles." — agora você aponta
registerShot('s33', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12 + 0.05 * k, x: 60 };
  const { GY, CX, M } = classroom(g, t, cam, {});
  veil(g, '#05060c', 0.2);
  layer(g, cam, 1, (g) => {
    const me = { x: CX - 200, y: GY + 20, s: 2.3, facing: 1, outfit: VOCE_KID, pose: breathe(posesAt(t, [[0, 'stand'], [0.6, 'point']]), t, 0.4, 2), expr: 'worried', look: [0.6, 0], rim: rimOf(M, [1, -0.6]) };
    drawFigure(g, me); scarfOn(g, me); pinOn(g, me, t, 0.3);
    const other = { x: CX + 280, y: GY + 20, s: 2.3, facing: -1, outfit: WHITE_KID, pose: breathe(t < 1.0 ? POSES.stand : POSES.sad, t, 0.4, 5), expr: t < 1.0 ? 'neutral' : 'sad', rim: rimOf(M, [-1, -0.6]) };
    drawFigure(g, other); scarfOn(g, other);
  });
} });

// s25 — "Você e sua turma vão pro campo plantar arroz," — a turma inteira curvada no arrozal, de manhã
registerShot('s25', { draw(g, t, info) {
  const k = ease.out(t / info.dur), cam = { z: 1.1 - 0.04 * k, x: 60 - 90 * k };
  const { GY, CX, M } = paddy(g, t, cam, 0.12);
  const row = (y, s, n, dx, seed, me = -1) => layer(g, cam, 0.85 + s * 0.06, (g) => {
    for (let i = 0; i < n; i++) {
      const x = CX - 520 + i * dx + (seed % 3) * 40, wob = Math.sin(t * 5 + i * 1.7 + seed);
      const pose = { ...PLANT, hF: [58 + wob * 6, -46 + Math.abs(wob) * 10] }, of = i === me ? VOCE_KID : WHITE_KID;
      const o = { x, y, s, facing: 1, outfit: of, pose, expr: 'neutral', rim: rimOf(M, [1, -0.6]), dim: i === me ? 0 : 0.12, shadow: false };
      g.fillStyle = alpha('#9ab8d0', 0.2); g.beginPath(); g.ellipse(x + 10 * s, y + 6, 46 * s, 5 * s, 0, 0, 7); g.fill();
      drawFigure(g, o); scarfOn(g, o);
    }
  });
  row(GY - 150, 1.0, 9, 150, 1); row(GY - 60, 1.5, 6, 210, 2); row(GY + 70, 2.3, 4, 330, 0, 1);
  FX.dust(g, t, { count: 30, color: '#fff2d8', a: 0.3 });
} });
