// shots/03_ataque.js — o ataque ao amanhecer, a armadilha dos portões, a derrota e o fim (s34–s53).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, backdrop, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { forest, marsh, campOutside, gateInside, ditch, mudFront, wallTopView, torch, spear, shield, tent } from '../sets/world.js';
import { labelTitle, cross, joint, ground } from '../sets/common.js';
import { withSpear, legion, hornShot } from './01_noite.js';
import { VOCE, GUERREIRO, ROMANO, ARMINIO, INGUIOMERO, SEM_ROSTO, GOLD } from '../cast.js';

const rimOf = (c, dir = [0.5, -1]) => ({ color: c, dir, w: 5 });
const SUN = '#ffb070', MOON = '#a9b8ff';
function zoomAt(g, cx, cy, z) { g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); }
const RUN = (t, ph = 0) => walkPose(t * Math.PI * 2 * 1.6 + ph, { run: true });

// s34 — "Você sai da floresta correndo, com centenas de guerreiros do seu lado."
registerShot('s34', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1, x: lerp(-60, 60, k) };
  const { GY, CX } = campOutside(g, t, cam, { time: 'dawn', big: true, torches: false, sunY: 760 });
  layer(g, { z: 1, x: lerp(-60, 60, k) }, 0.8, (g) => { const r = rng(4); for (let i = 0; i < 26; i++) { const x = -300 + r() * (E.W + 600) + t * 120, y = GY + 40 + r() * 120; drawFigure(g, { x, y, s: 0.9 + r() * 0.3, facing: 1, outfit: { top: 'none' }, pose: RUN(t, i), face: SEM_ROSTO, rim: rimOf(SUN, [-1, -0.5]), dim: 0.3 }); } });
  layer(g, cam, 1.1, (g) => {
    for (let i = 0; i < 3; i++) withSpear(g, { x: 140 + i * 330 + t * 60 + (i === 1 ? 0 : -60), y: GY + 330 + (i === 1 ? 60 : 0), s: i === 1 ? 2.6 : 2.0, facing: 1, outfit: i === 1 ? VOCE : GUERREIRO[i], pose: RUN(t, i * 2), expr: 'angry', rim: rimOf(SUN, [-1, -0.5]), dim: i === 1 ? 0 : 0.15 }, -0.5, 340);
  });
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.55, count: 24, a: 0.12 });
  FX.dust(g, t, { count: 40, color: SUN, a: 0.35 });
} });

// s35 — "Pula dentro da vala. A lama chega no seu joelho."
registerShot('s35', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05 + 0.05 * k, y: 40 };
  const d = ditch(g, t, cam, {});
  const jump = ease.inOut(prog(t, 0.0, 0.5)), land = t > 0.5;
  layer(g, cam, 0.9, (g) => {
    const x = lerp(d.CX - 420, d.CX - 60, jump), y = land ? d.mud + 60 : lerp(d.field, d.mud + 60, jump) - Math.sin(jump * Math.PI) * 160;
    withSpear(g, { x, y, s: 2.2, facing: 1, outfit: VOCE, pose: land ? breathe(POSES.stand, t, 0.6, 1) : POSES.jump, expr: land ? 'shocked' : 'angry', look: land ? [0, 1] : [0.5, 0], rim: rimOf(SUN, [-1, -0.5]) }, -1.2, 320);
    if (land && t < 1.3) for (let i = 0; i < 10; i++) { const a = -Math.PI * (0.15 + i * 0.07), dd = (t - 0.5) * 520; circle(g, x + Math.cos(a) * dd, d.mud + 20 + Math.sin(a) * dd + (t - 0.5) ** 2 * 900, 10, '#4a3420'); }
  });
  mudFront(g, cam, d);
} });

// s36 — "Vocês jogam galhos pra encher o buraco e começam a escalar o muro."
registerShot('s36', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05 + 0.04 * k, y: 20 };
  const d = ditch(g, t, cam, {});
  layer(g, cam, 0.9, (g) => {
    const fill = ease.inOut(prog(t, 0, 1.8));
    for (let i = 0; i < 6; i++) { const ph = clamp((t - i * 0.25) / 0.7); if (ph <= 0) continue; const x = lerp(d.CX - 460, d.CX - 140 + i * 50, ph), y = lerp(d.field - 60, d.mud - 20 - Math.floor(i / 3) * 30, ph) - Math.sin(ph * Math.PI) * 200;
      g.save(); g.translate(x, y); g.rotate(ph * 2); for (let b = 0; b < 5; b++) seg(g, [[-70, -14 + b * 7], [70, -18 + b * 9]], 6, '#5a4028'); seg(g, [[-10, -24], [-10, 24]], 6, '#c8a070'); g.restore(); }
    withSpear(g, { x: d.CX - 470, y: d.field, s: 1.8, facing: 1, outfit: GUERREIRO[1], pose: Math.sin(t * 5) > 0 ? POSES.reach : POSES.pointUp, expr: 'angry', rim: rimOf(SUN, [-1, -0.5]) }, -0.6, 200);
    // escalando o muro
    for (let i = 0; i < 3; i++) { const p = ease.inOut(prog(t, 1.4 + i * 0.35, 3.2 + i * 0.35)), x = lerp(d.CX + 120, d.CX + 300, p) + i * 26, y = lerp(d.mud + 50, d.wallTop + 30, p);
      if (p > 0) drawFigure(g, { x, y, s: 1.7, facing: 1, rot: -0.5 * (1 - p), outfit: i === 0 ? VOCE : GUERREIRO[i], pose: Math.sin(t * 8 + i) > 0 ? { ...POSES.reach, hF: [60, -220] } : { ...POSES.pointUp, hF: [30, -250] }, expr: 'determined', rim: rimOf(SUN, [-1, -0.5]) }); }
  });
  mudFront(g, cam, d);
} });

// s37 — "Lá em cima, quase ninguém defendendo."
registerShot('s37', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.3 + 0.05 * k, x: 180, y: -330 };
  const d = ditch(g, t, cam, {});
  layer(g, cam, 0.9, (g) => { legion(g, { x: d.CX + 520, y: d.wallTop, s: 1.5, facing: -1, outfit: ROMANO, pose: breathe(POSES.stand, t, 0.4, 1), expr: 'neutral', rim: rimOf(SUN, [-1, -0.5]) }); });
  FX.dust(g, t, { count: 30, color: SUN, a: 0.3 });
} });

// s38 — "Parece fácil demais." — seu rosto
registerShot('s38', { draw(g, t, info) {
  blurLayer(g, 14, (g) => ditch(g, t, { z: 1.4, y: -300 }, {})); veil(g, '#0a0608', 0.3);
  bigFace(g, E.W / 2, E.H * 0.56, 320 * (1 + 0.04 * t), { outfit: VOCE, expr: t < 0.55 ? 'smirk' : 'thinking', look: t < 0.55 ? [0.3, 0] : [0.7, -0.4], rimColor: SUN, rimSide: -1 });
} });

// s39 — "Você chega no topo e vê o truque." / s41 — a lança que não alcança
function onWall(g, t, info, cam) {
  const r = wallTopView(g, t, cam, {});
  return r;
}
registerShot('s39', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.06 + 0.06 * k };
  const { GY, CX } = onWall(g, t, info, cam);
  layer(g, cam, 0.9, (g) => withSpear(g, { x: CX - 300, y: GY - 100, s: 2.3, facing: 1, outfit: VOCE, pose: posesAt(t, [[0, POSES.ready], [1.2, POSES.stand]]), expr: t < 1.6 ? 'determined' : 'shocked', look: [1, 0.2], rim: rimOf(SUN, [1, -0.6]) }, -1.3, 320));
  FX.dust(g, t, { count: 30, color: SUN, a: 0.3 });
} });
registerShot('s41', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.0 + 0.04 * k };
  const { GY, CX } = onWall(g, t, info, cam);
  const throwT = 0.4, p = clamp((t - throwT) / 1.1), sx = CX - 260, sy = GY - 560, ex = CX + 220, ey = GY - 330;
  layer(g, cam, 0.9, (g) => drawFigure(g, { x: CX - 330, y: GY - 100, s: 2.3, facing: 1, outfit: VOCE, pose: posesAt(t, [[0, { ...POSES.pointUp, hF: [-20, -240] }], [throwT, { ...POSES.point, hF: [70, -160] }]], 0.15), expr: t > 1.6 ? 'shocked' : 'angry', look: [1, 0.3], rim: rimOf(SUN, [1, -0.6]) }));
  layer(g, cam, 0.7, (g) => {
    g.setLineDash([10, 12]); g.strokeStyle = alpha(GOLD, 0.6); g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 20; i++) { const q = i / 20 * p; g.lineTo(lerp(sx, ex, q), lerp(sy, ey, q) - Math.sin(q * Math.PI) * 220); } g.stroke(); g.setLineDash([]);
    if (t > throwT) { const x = lerp(sx, ex, p), y = lerp(sy, ey, p) - Math.sin(p * Math.PI) * 220, a = Math.atan2(lerp(sy, ey, Math.min(1, p + 0.02)) - Math.sin(Math.min(1, p + 0.02) * Math.PI) * 220 - y, 2); spear(g, x - Math.cos(a) * 80, y - Math.sin(a) * 80, a, 80); }
    if (p >= 1) cross(g, ex + 30, ey - 10, 30, S().ui.accent, prog(t, 1.5, 1.8));
  });
  const a = ease.out(prog(t, 1.6, 2.0)); text(g, 'FORA DO ALCANCE', E.W / 2, 330, { size: 44, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: a });
} });

// s40 — "Entre o muro e as barracas tem um espaço vazio de uns 60 metros."
registerShot('s40', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, k = ease.inOut(t / info.dur), gy = 1000;
  g.save(); zoomAt(g, E.W / 2, gy, 1.02 + 0.03 * k);
  seg(g, [[40, gy], [E.W - 40, gy]], 3, bp);
  poly(g, [[60, gy], [100, gy - 140], [200, gy - 140], [240, gy]], alpha(bp, 0.18)); g.strokeStyle = bp; g.lineWidth = 3; g.beginPath(); g.moveTo(60, gy); g.lineTo(100, gy - 140); g.lineTo(200, gy - 140); g.lineTo(240, gy); g.stroke();
  for (let x = 110; x < 200; x += 18) seg(g, [[x, gy - 140], [x, gy - 200]], 4, bp);
  text(g, 'MURO', 150, gy + 50, { size: 28, color: u.cream, font: FONTS.ui, weight: 900, spacing: 3 });
  UI.lineFigure(g, { x: 150, y: gy - 140, s: 0.55, pose: POSES.point, color: alpha(u.cream, 0.9) });
  for (let i = 0; i < 3; i++) { const x = 880 + i * 70; g.strokeStyle = bp; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 30, gy); g.lineTo(x, gy - 60); g.lineTo(x + 30, gy); g.stroke(); }
  text(g, 'BARRACAS', 950, gy + 50, { size: 28, color: u.cream, font: FONTS.ui, weight: 900, spacing: 3 });
  g.fillStyle = alpha(GOLD, 0.06 * ease.out(prog(t, 0.3, 1))); g.fillRect(250, gy - 300, 590, 300);
  UI.dimension(g, t, { x1: 260, y1: gy - 340, x2: 830, y2: gy - 340, str: '', start: 2.4 });
  const a = ease.outBack(prog(t, 2.95, 3.3)); if (a > 0) { g.save(); g.translate(545, gy - 420); g.scale(a, a); text(g, '60 M', 0, 0, { size: 88, color: GOLD, glow: 18, glowColor: alpha(GOLD, 0.6) }); g.restore(); }
  text(g, 'ESPAÇO VAZIO', 545, gy - 150, { size: 34, color: alpha(u.cream, 0.85), font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 1.4, 1.8)) });
  g.restore();
} });

// s42 — "Aí, uma trombeta toca."
registerShot('s42', { draw(g, t, info) { hornShot(g, t, info, true); } });

// s43 — "Portões se abrem dos lados."
registerShot('s43', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), open = ease.out(prog(t, 0.1, 0.8)), cam = { z: 1.1 + 0.04 * k };
  const { GY, CX } = gateInside(g, t, cam, { time: 'dawn', open });
  layer(g, cam, 1, (g) => { for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) { const x = CX - 330 + i * 150 + j * 70 + t * 160, s = 1.6 + j * 0.4; legion(g, { x, y: GY + 20 + j * 80, s, facing: 1, outfit: ROMANO, pose: walkPose(t * 7 + i + j), expr: 'determined', rim: rimOf(SUN, [1, -0.5]), dim: j ? 0 : 0.2 }); } });
  FX.dust(g, t, { count: 30, color: SUN, a: 0.3 });
} });

// s44 — "Os romanos saem correndo pra fora e dão a volta por trás de você."
registerShot('s44', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), u = S().ui, k = ease.inOut(t / info.dur), cx = E.W / 2;
  g.save(); zoomAt(g, cx, 900, 1.02 + 0.03 * k);
  rr(g, cx - 260, 360, 520, 420, 40); g.strokeStyle = bp; g.lineWidth = 5; g.stroke();
  for (const sx of [-1, 1]) { g.fillStyle = u.bpBg; g.fillRect(cx + sx * 260 - 10, 520, 20, 70); }
  text(g, 'ACAMPAMENTO', cx, 570, { size: 30, color: alpha(u.cream, 0.8), font: FONTS.ui, weight: 900, spacing: 3 });
  const r = rng(2); for (let i = 0; i < 70; i++) { const x = cx - 230 + r() * 460, y = 800 + r() * 90; circle(g, x, y, 8, alpha(GOLD, 0.9)); }
  text(g, 'VOCÊS', cx, 950, { size: 34, color: GOLD, font: FONTS.ui, weight: 900, spacing: 5 });
  const p = ease.inOut(prog(t, 0.4, 3.2));
  for (const sx of [-1, 1]) {
    const pts = []; for (let i = 0; i <= 40; i++) { const q = i / 40 * p, a = lerp(0, Math.PI * 0.95, q); pts.push([cx + sx * (260 + Math.sin(a) * 220), lerp(555, 1010, (1 - Math.cos(a)) / 2)]); }
    g.strokeStyle = u.accent; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); pts.forEach((q, i) => i ? g.lineTo(...q) : g.moveTo(...q)); g.stroke();
    const [ax, ay] = pts[pts.length - 1], [bx, by] = pts[Math.max(0, pts.length - 3)], ang = Math.atan2(ay - by, ax - bx);
    if (p > 0.05) poly(g, [[ax + Math.cos(ang) * 30, ay + Math.sin(ang) * 30], [ax + Math.cos(ang + 2.3) * 26, ay + Math.sin(ang + 2.3) * 26], [ax + Math.cos(ang - 2.3) * 26, ay + Math.sin(ang - 2.3) * 26]], u.accent);
  }
  text(g, 'ROMANOS', cx, 1120, { size: 40, color: u.accent, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 3.0, 3.4)) });
  g.restore();
} });

// s45 — "Agora quem está preso é você."
registerShot('s45', { draw(g, t, info) {
  blurLayer(g, 14, (g) => ditch(g, t, { z: 1.5, y: 100 }, {})); veil(g, '#0a0608', 0.35);
  const beat = 1 + 0.03 * Math.max(0, Math.sin(t * 7));
  bigFace(g, E.W / 2, E.H * 0.56, 320 * beat * (1 + 0.04 * t), { outfit: VOCE, expr: 'scared', look: [Math.sin(t * 4) * 0.7, 0], rimColor: SUN, rimSide: -1 });
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.25, E.W / 2, E.H / 2, E.H * 0.7); g.fillStyle.addColorStop(0, 'rgba(255,255,255,1)'); g.fillStyle.addColorStop(1, 'rgba(160,30,30,1)'); g.fillRect(0, 0, E.W, E.H); g.restore();
} });

// s46 — "Espremido dentro da vala, de costas pros inimigos, sem espaço pra lutar."
registerShot('s46', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15 + 0.05 * k, x: -60, y: 60 };
  const d = ditch(g, t, cam, {});
  layer(g, cam, 0.9, (g) => {
    for (let i = 0; i < 6; i++) withSpear(g, { x: d.CX - 170 + i * 50 + Math.sin(t * 6 + i) * 6, y: d.mud + 60 - (i % 2) * 14, s: 1.8, facing: 1, outfit: i === 3 ? VOCE : GUERREIRO[i % 4], pose: breathe(POSES.crossArms, t * 2, 1.5, i), expr: i === 3 ? 'scared' : 'worried', look: [-0.8, -0.3], rim: rimOf(SUN, [-1, -0.5]), dim: i === 3 ? 0 : 0.15 }, -1.4, 260);
    for (let i = 0; i < 6; i++) { const x = d.CX - 700 + i * 70, o = { x, y: d.field, s: 1.7, facing: 1, outfit: ROMANO, pose: { ...POSES.point, hF: [70, -140] }, expr: 'angry', rim: rimOf(SUN, [-1, -0.5]) }; legion(g, o); const [hx, hy] = joint(o, 'hF'); spear(g, hx - 40, hy - 20, 0.5, 120); }
  });
  mudFront(g, cam, d);
} });

// s47 — "Seus companheiros caem um atrás do outro."
registerShot('s47', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.2 + 0.04 * k, y: 60 };
  const d = ditch(g, t, cam, {});
  layer(g, cam, 0.9, (g) => {
    for (let i = 0; i < 4; i++) { const at = 0.3 + i * 0.55, f = ease.in(prog(t, at, at + 0.35));
      drawFigure(g, { x: d.CX - 170 + i * 80, y: d.mud + 60, s: 1.8, facing: 1, rot: f * (i % 2 ? 1.4 : -1.4), outfit: GUERREIRO[i % 4], pose: f > 0 ? POSES.fall : POSES.stand, expr: f > 0 ? 'cry' : 'scared', rim: rimOf(SUN, [-1, -0.5]), alpha: 1 - 0.5 * f, shadow: false }); }
  });
  mudFront(g, cam, d);
  veil(g, '#200808', 0.2);
} });

// s48 — "Inguiomero sai gravemente ferido."
registerShot('s48', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.04 * k };
  const { GY, CX } = forest(g, t, cam, { time: 'dawn' });
  layer(g, cam, 1, (g) => {
    const x = CX + 220 - t * 70, lean = { ...POSES.sad, head: [18, -184], sh: [8, -160] };
    drawFigure(g, { x: x - 110, y: GY + 20, s: 2.1, facing: -1, outfit: GUERREIRO[0], pose: walkPose(t * 4), expr: 'worried', rim: rimOf(SUN, [1, -0.5]) });
    drawFigure(g, { x, y: GY + 20, s: 2.3, facing: -1, outfit: INGUIOMERO, pose: { ...lean, ...walkPose(t * 3), head: lean.head, sh: lean.sh }, face: SEM_ROSTO, rim: rimOf(SUN, [1, -0.5]) });
    drawFigure(g, { x: x + 110, y: GY + 20, s: 2.1, facing: -1, outfit: GUERREIRO[3], pose: walkPose(t * 4 + 1), expr: 'worried', rim: rimOf(SUN, [1, -0.5]) });
  });
  labelTitle(g, t, 'GRAVEMENTE FERIDO', 'INGUIOMERO', 330, { at: 0.2, big: 80 });
} });

// s49 — "Armínio consegue fugir."
registerShot('s49', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12, x: 40 * k };
  const { GY, CX } = forest(g, t, cam, { time: 'dawn' });
  layer(g, cam, 1, (g) => drawFigure(g, { x: lerp(CX + 300, CX - 360, ease.in(prog(t, 0, info.dur))), y: GY + 20, s: 2.3, facing: -1, outfit: ARMINIO, pose: RUN(t), face: SEM_ROSTO, rim: rimOf(SUN, [1, -0.5]) }));
  labelTitle(g, t, 'CONSEGUE FUGIR', 'ARMÍNIO', 330, { at: 0.1, big: 84 });
} });

// s50 — "E aquele exército cansado, cercado e com fome, sobrevive e volta pra casa."
registerShot('s50', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.14 - 0.08 * k };
  const { GY, CX } = marsh(g, t, cam, { time: 'dusk' });
  layer(g, cam, 0.7, (g) => { for (let i = 0; i < 14; i++) { const x = -100 + i * 90 + t * 30, o = { x, y: GY - 40, s: 1.1, facing: 1, outfit: ROMANO, pose: walkPose(t * 2.4 + i), expr: 'sleepy', rim: rimOf(SUN, [1, -0.6]), dim: 0.25 }; legion(g, o); if (i % 4 === 1) { seg(g, [[x + 20, GY - 140], [x + 20, GY - 380]], 4, '#2a1e16'); circle(g, x + 20, GY - 380, 16, '#c8a050'); } } });
  FX.godRays(g, CX + 240, GY - 520, { count: 8, angle: Math.PI * 0.6, spread: 1.4, len: 1500, color: '#ffc890', a: 0.06, t });
  FX.dust(g, t, { count: 40, color: SUN, a: 0.3 });
} });

// s51 — "Então me diz:"
registerShot('s51', { draw(g, t, info) {
  blurLayer(g, 14, (g) => forest(g, t, { z: 1.4, y: -150 }, { time: 'night' })); veil(g, '#05060c', 0.35);
  bigFace(g, E.W / 2, E.H * 0.56, 320 * (1 + 0.05 * t), { outfit: VOCE, expr: 'thinking', look: [0, 0.05], rimColor: MOON, rimSide: 1 });
} });

// s52 — "você atacaria de madrugada ou esperaria eles saírem do acampamento?"
registerShot('s52', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05 + 0.06 * k };
  const { GY } = campOutside(g, t, cam, { time: 'night', big: true });
  layer(g, { z: 1 + 0.08 * k }, 1.2, (g) => withSpear(g, { x: 260, y: GY + 300, s: 2.7, facing: 1, outfit: VOCE, pose: breathe(t < 1.9 ? POSES.ready : POSES.think, t, 0.5, 1), expr: 'thinking', look: [1, -0.2], rim: rimOf(MOON, [1, -0.5]) }, -1.2, 380));
  const a1 = ease.out(prog(t, 1.1, 1.5)) * (1 - prog(t, 1.9, 2.1)), a2 = ease.out(prog(t, 2.0, 2.4));
  labelTitle(g, t, 'VOCÊ', 'ATACARIA?', 330, { at: 1.1, big: 92, out: 1.9 });
  labelTitle(g, t, 'OU', 'ESPERARIA?', 330, { at: 2.0, big: 92 });
} });

// s53 — "Comenta aí." — tela final
registerShot('s53', { draw(g, t, info) {
  const u = S().ui;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#070b18', '#0b1224', '#1a1a34']); g.fillRect(0, 0, E.W, E.H);
  FX.stars(g, t, { count: 100, area: [0, 0, E.W, E.H * 0.4] }); glow(g, E.W / 2, E.H * 0.95, E.W * 0.7, '#ff9a5a', 0.2);
  const a1 = ease.out(prog(t, 0.1, 0.5));
  text(g, 'Atacaria de madrugada', E.W / 2, 330, { size: 66, font: FONTS.serif, weight: 900, italic: true, color: u.cream, alpha: a1, glow: 18, glowColor: 'rgba(255,170,90,.5)' });
  text(g, 'ou esperaria?', E.W / 2, 420, { size: 74, font: FONTS.serif, weight: 900, italic: true, color: GOLD, alpha: a1, glow: 18, glowColor: 'rgba(255,170,90,.5)' });
  [['ATACAR', '#5fe0d8', 0.35], ['ESPERAR', '#ffb070', 0.5]].forEach(([lab, c, at], i) => {
    const p = ease.outBack(prog(t, at, at + 0.4)); if (p <= 0) return;
    g.save(); g.translate(E.W / 2 + (i ? 230 : -230), 590); g.scale(p, p); rr(g, -200, -50, 400, 100, 50); g.strokeStyle = c; g.lineWidth = 5; g.stroke();
    text(g, lab, 0, 3, { size: 40, color: c, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore();
  });
  const pb = ease.outBack(prog(t, 0.65, 1.05)); if (pb > 0) { g.save(); g.translate(E.W / 2, 750); g.scale(pb, pb); UI.bubble(g, 0, 0, { w: 560, h: 120, str: 'COMENTA AÍ', color: '#f4efe6' }); g.restore(); }
  const cast = [GUERREIRO[0], VOCE, GUERREIRO[1]], y0 = 1400;
  cast.forEach((of, i) => { const kk = ease.out(prog(t, 0.3 + i * 0.1, 0.8 + i * 0.1)); withSpear(g, { x: E.W / 2 + (i - 1) * 240, y: y0 + (1 - kk) * 40, s: i === 1 ? 2.3 : 2.0, facing: 1, outfit: of, pose: POSES.relaxed, expr: i === 1 ? 'thinking' : 'neutral', alpha: kk, rim: { color: '#ffb070', dir: [0, 1] } }, -1.45, 300); });
} });
