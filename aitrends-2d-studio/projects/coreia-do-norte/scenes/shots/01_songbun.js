// shots/01_songbun.js — ato 1: o nascimento, a ficha songbun, a pirâmide e o que ela decide (s02–s14, sem as 3D).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, backdrop, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { nursery, crib, village } from '../sets/places.js';
import { dossier, stamp, bpTitle, iconHouse, iconMine, iconRings, scarfOn, ground } from '../sets/common.js';
import { VOCE_KID, OFICIAL, LENCO } from '../cast.js';

const ui = () => S().ui;

// s02 — "No dia em que você nasce, antes mesmo do seu primeiro banho" — berçário, bacia ainda fumegando
registerShot('s02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.02 + 0.1 * k, x: -30 + 50 * k };
  const { GY, CX, M } = nursery(g, t, cam);
  layer(g, cam, 1, (g) => {
    crib(g, CX - 110, GY, 1.7, M, true);
    // bacia de banho num suporte, com vapor (o primeiro banho ainda não aconteceu)
    const bx = CX + 300, by = GY - 210;
    seg(g, [[bx - 70, by + 20], [bx - 90, GY]], 8, shade(M.wall, -0.5)); seg(g, [[bx + 70, by + 20], [bx + 90, GY]], 8, shade(M.wall, -0.5));
    g.fillStyle = '#d8dde8'; g.beginPath(); g.moveTo(bx - 110, by - 30); g.quadraticCurveTo(bx, by + 70, bx + 110, by - 30); g.closePath(); g.fill();
    g.fillStyle = '#9fc4e8'; g.beginPath(); g.ellipse(bx, by - 30, 104, 16, 0, 0, 7); g.fill(); glow(g, bx, by - 30, 160, '#bfe0ff', 0.25);
    for (let i = 0; i < 5; i++) { const ph = (t * 0.45 + i / 5) % 1; g.strokeStyle = alpha('#e8f2ff', 0.35 * Math.sin(ph * Math.PI)); g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); const x0 = bx - 50 + i * 25; g.moveTo(x0, by - 40 - ph * 40); g.bezierCurveTo(x0 + 20, by - 80 - ph * 120, x0 - 20, by - 120 - ph * 150, x0 + 10, by - 160 - ph * 200); g.stroke(); }
    // toalha dobrada
    rr(g, bx - 60, by + 40, 120, 24, 8); g.fillStyle = shade(ui().cream, -0.1); g.fill();
  });
  FX.clock(g, CX + 330, GY - 980, 46, 3 * 3600 + 12 * 60 + t * 4, { face: '#d8dcea' });
  blurLayer(g, 10, (g) => crib(g, CX - 520, GY + 380, 2.8, M, false), cam, 1.7);
  FX.dust(g, t, { count: 40, color: M.rim, a: 0.4 });
} });

// s03 — "o governo já tem uma ficha sua." — o funcionário ao lado do berço; a ficha salta
registerShot('s03', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.08 + 0.05 * k, x: 20 + 20 * k };
  const { GY, CX, M } = nursery(g, t, cam);
  layer(g, cam, 1, (g) => {
    crib(g, CX - 150, GY, 1.6, M, true);
    drawFigure(g, { x: CX + 260, y: GY, s: 2.0, facing: -1, outfit: OFICIAL, pose: breathe(posesAt(t, [[0, 'stand'], [0.35, 'holdFront']]), t, 0.6, 4), prop: 'paper', expr: 'neutral', rim: { color: M.rim, dir: [-1, -0.4], w: 5 } });
  });
  FX.dust(g, t, { count: 40, color: M.rim, a: 0.4 });
  veil(g, M.dark, 0.3 * ease.out(prog(t, 0.7, 1.2)));
  dossier(g, CX, E.H * 0.25, t - 0.95, 99);
} });

// s04 — "Ela se chama songbun." — a ficha enche a tela; carimbo
registerShot('s04', { draw(g, t, info) {
  const ts = 0.92, sh = t > ts ? shake(t, 12 * (1 - prog(t, ts, ts + 0.35)), 30) : [0, 0];
  blurLayer(g, 14, (g) => nursery(g, t, { z: 1.3, x: -80 }));
  veil(g, '#0a0c18', 0.45);
  g.save(); g.translate(sh[0], sh[1]);
  dossier(g, E.W / 2, E.H * 0.42, t + 1.6, ts + 1.6, { scale: 1.45 + 0.04 * t, rot: -0.06 });
  g.restore();
  FX.dust(g, t, { count: 30, color: '#cfd8ff', a: 0.3 });
} });

// s05 — "É uma classificação que diz o quanto a sua família é leal ao regime." — medidor de lealdade
function family(g, x, y, s, color, a = 1) {
  g.save(); g.globalAlpha *= a;
  UI.lineFigure(g, { x: x - 110 * s, y, s: 1.25 * s, pose: POSES.stand, color });
  UI.lineFigure(g, { x: x + 110 * s, y, s: 1.2 * s, pose: POSES.stand, color, facing: -1 });
  UI.lineFigure(g, { x, y, s: 0.8 * s, pose: POSES.cheer, color });
  g.restore();
}
registerShot('s05', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), U = ui(), k = ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(1 + 0.04 * k, 1 + 0.04 * k); g.translate(-E.W / 2, -E.H / 2);
  bpTitle(g, 'CLASSIFICAÇÃO', 330, ease.out(prog(t, 0.2, 0.6)));
  family(g, 360, 1150, 1.6, bp, ease.out(prog(t, 1.5, 2.1)));
  text(g, 'SUA FAMÍLIA', 360, 1230, { size: 40, color: U.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 1.9, 2.3)) });
  // termômetro de lealdade
  const gx = 800, g0 = 1180, g1 = 520, fill = 0.68 * ease.inOut(prog(t, 2.6, 3.4)) + 0.06 * Math.sin(t * 3) * prog(t, 3.0, 3.6);
  rr(g, gx - 46, g1, 92, g0 - g1, 46); g.strokeStyle = bp; g.lineWidth = 4; g.stroke();
  for (let i = 0; i <= 10; i++) { const y = lerp(g0 - 30, g1 + 30, i / 10); seg(g, [[gx + 56, y], [gx + (i % 5 ? 74 : 90), y]], 3, alpha(bp, 0.7)); }
  const fy = lerp(g0 - 20, g1 + 20, fill); rr(g, gx - 30, fy, 60, g0 - 20 - fy, 30); g.fillStyle = linGrad(g, 0, g1, 0, g0, [U.gold, LENCO]); g.fill(); glow(g, gx, fy, 120, U.gold, 0.4);
  text(g, 'LEALDADE', gx, g1 - 60, { size: 40, color: U.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 2.5, 2.9)) });
  text(g, 'AO REGIME', gx, g1 - 18, { size: 30, color: U.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 2.7, 3.1)) });
  g.restore();
} });

// s06 — "E ela não depende de nada que você fez." — rosto do bebê, confuso
registerShot('s06', { draw(g, t, info) {
  blurLayer(g, 14, (g) => nursery(g, t, { z: 1.5, x: 120, y: -200 })); veil(g, '#0a0c18', 0.35);
  const M = mood('interiorCool'), r = 270 * (1 + 0.04 * t), cx = E.W / 2, cy = E.H * 0.55;
  bigFace(g, cx, cy, r, { outfit: { top: 'none' }, expr: t < 0.6 ? 'neutral' : 'confused', look: [lerp(-0.3, 0.3, ease.inOut(prog(t, 0.2, 1.2))), -0.2], rimColor: M.rim, rimSide: -1, blink: t > 1.3 && t < 1.42 });
  g.fillStyle = shade(ui().cream, -0.12); g.beginPath(); g.ellipse(cx, cy + r * 1.55, r * 1.5, r * 0.75, 0, Math.PI, 0); g.fill();
  g.fillStyle = alpha('#000', 0.12); for (let i = 0; i < 4; i++) g.fillRect(cx - r * 1.2, cy + r * (0.95 + i * 0.16), r * 2.4, 6);
  FX.dust(g, t, { count: 30, color: M.rim, a: 0.35 });
} });

// s07 — "Depende do que seus avós fizeram." — árvore genealógica em blueprint
registerShot('s07', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), U = ui(), k = ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H * 0.6); g.scale(1.06 - 0.06 * k, 1.06 - 0.06 * k); g.translate(-E.W / 2, -E.H * 0.6);
  const rows = [[[300, 560], [780, 560]], [[300, 920], [780, 920]], [[540, 1260]]];
  const hi = ease.out(prog(t, 1.45, 1.9));
  // ligações
  const link = (a, b, p, c, w) => { if (p <= 0) return; const mid = (a[1] + b[1]) / 2 - 40; g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(a[0], a[1] + 20); g.lineTo(a[0], mid); g.lineTo(lerp(a[0], b[0], p), mid); if (p > 0.99) g.lineTo(b[0], b[1] - 200); g.stroke(); };
  link(rows[0][0], [540, 920], ease.out(prog(t, 0.2, 0.7)), alpha(bp, 0.6), 3); link(rows[0][1], [540, 920], ease.out(prog(t, 0.2, 0.7)), alpha(bp, 0.6), 3);
  link(rows[1][0], rows[2][0], ease.out(prog(t, 0.5, 1.0)), alpha(bp, 0.6), 3); link(rows[1][1], rows[2][0], ease.out(prog(t, 0.5, 1.0)), alpha(bp, 0.6), 3);
  if (hi > 0) { link(rows[0][0], [540, 920], hi, U.gold, 6); link(rows[1][0], rows[2][0], clamp(hi * 1.4 - 0.2), U.gold, 6); }
  const fig = (x, y, s, pose, c, f = 1) => UI.lineFigure(g, { x, y, s, pose, color: c, facing: f });
  const old = { ...POSES.stand, head: [8, -196], sh: [4, -166], eF: [18, -130], hF: [30, -96] };
  fig(rows[0][0][0], rows[0][0][1], 1.15, old, hi > 0 ? mix(bp, U.gold, hi) : bp); seg(g, [[rows[0][0][0] + 34, rows[0][0][1] - 110], [rows[0][0][0] + 40, rows[0][0][1]]], 4, hi > 0 ? mix(bp, U.gold, hi) : bp);
  fig(rows[0][1][0], rows[0][1][1], 1.1, old, bp, -1);
  fig(rows[1][0][0], rows[1][0][1], 1.15, POSES.stand, bp); fig(rows[1][1][0], rows[1][1][1], 1.1, POSES.stand, bp, -1);
  fig(rows[2][0][0], rows[2][0][1], 0.75, POSES.stand, U.gold);
  if (hi > 0) glow(g, rows[0][0][0], rows[0][0][1] - 120, 160, U.gold, 0.35 * hi);
  text(g, 'AVÓS', 540, 330, { size: 52, color: hi > 0 ? U.gold : U.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.1, 0.5)), glow: 14, glowColor: alpha(U.gold, 0.5 * hi) });
  text(g, 'VOCÊ', 540, 1330, { size: 34, color: U.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.9, 1.3)) });
  g.restore();
} });

// s08 — "Se seu avô lutou ao lado do partido," — flashback sépia da guerra
registerShot('s08', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.04 + 0.06 * k, x: -20 * k }, GY = ground();
  layer(g, cam, 0.15, (g) => { backdrop(g, ['#3a2a22', '#8a5a3a', '#d8a070']); FX.sun(g, E.W * 0.7, GY - 700, 70, '#fff0d0', '#ffb070', 4); FX.clouds(g, { y: GY - 1100, h: 400, color: '#f0d0a0', a: 0.12, seed: 2 }); });
  layer(g, cam, 0.4, (g) => { FX.hills(g, { y: GY - 260, amp: 200, color: '#4a3226', seed: 5, freq: 0.004 }); });
  layer(g, cam, 0.8, (g) => {   // o morro em primeiro plano
    g.fillStyle = '#24170f'; g.beginPath(); g.moveTo(-E.W, E.H * 2); g.lineTo(-E.W, GY + 80); g.quadraticCurveTo(E.W * 0.35, GY - 110, E.W * 1.1, GY + 40); g.lineTo(E.W * 2, GY + 120); g.lineTo(E.W * 2, E.H * 2); g.fill();
    for (let i = 0; i < 4; i++) { const ph = (t * 0.2 + i * 0.27) % 1; g.fillStyle = alpha('#c8a888', 0.18 * Math.sin(ph * Math.PI)); g.beginPath(); g.ellipse(120 + i * 260, GY - 180 - ph * 300, 160 + ph * 120, 90 + ph * 60, 0, 0, 7); g.fill(); }
  });
  layer(g, cam, 1, (g) => {
    const x = E.W * 0.42, y = GY - 52, s = 2.1, wave = Math.sin(t * 4);
    // bandeira vermelha num mastro
    seg(g, [[x + 150, y], [x + 150, y - 640]], 9, '#1a120c');
    g.fillStyle = LENCO; g.beginPath(); g.moveTo(x + 150, y - 640); for (let i = 0; i <= 10; i++) g.lineTo(x + 150 + i * 30, y - 640 + Math.sin(i * 0.7 + t * 6) * 14 * (i / 10)); for (let i = 10; i >= 0; i--) g.lineTo(x + 150 + i * 30, y - 450 + Math.sin(i * 0.7 + t * 6) * 14 * (i / 10)); g.fill();
    const pose = { ...POSES.ready, hF: [64, -170], eF: [36, -146], hB: [40, -150] };
    drawFigure(g, { x, y, s, facing: 1, outfit: { top: 'suit', color: '#5a5236', head: 'cap', headColor: '#5a5236' }, pose: breathe(pose, t, 0.6, 2), expr: 'determined', rim: { color: '#ffd8a0', dir: [1, -0.4], w: 5 } });
    seg(g, [[x + 24 * s, y - 150 * s], [x + 110 * s, y - 200 * s]], 7, '#14100c');   // fuzil
  });
  // sépia + vinheta de memória
  g.save(); g.globalCompositeOperation = 'color'; g.fillStyle = 'rgba(150,100,60,.55)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  FX.dust(g, t, { count: 60, color: '#ffe0b0', a: 0.4 });
} });

// s09 / s12 — a pirâmide do songbun
function pyramid(g, t, mark) {
  UI.blueprint(g); const bp = UI.bpStroke(), U = ui();
  const cx = E.W / 2, top = 470, bot = 1330, half = 470;
  const tiers = [['LEAL', U.gold], ['VACILANTE', bp], ['HOSTIL', U.accent]];
  tiers.forEach(([lab, c], i) => {
    const y0 = lerp(top, bot, i / 3) + 8, y1 = lerp(top, bot, (i + 1) / 3) - 8, w0 = half * (i / 3), w1 = half * ((i + 1) / 3);
    const lit = mark.tier === i ? mark.lit : 0;
    poly(g, [[cx - w0, y0], [cx + w0, y0], [cx + w1, y1], [cx - w1, y1]], alpha(c, 0.1 + 0.35 * lit));
    g.strokeStyle = alpha(c, 0.8); g.lineWidth = 3; g.beginPath(); g.moveTo(cx - w0, y0); g.lineTo(cx + w0, y0); g.lineTo(cx + w1, y1); g.lineTo(cx - w1, y1); g.closePath(); g.stroke();
    text(g, lab, cx, lerp(y0, y1, i === 0 ? 0.72 : 0.6), { size: i === 0 ? 34 : 44, color: c, font: FONTS.ui, weight: 900, spacing: 4, glow: 10 * lit, glowColor: alpha(c, 0.7) });
  });
  // o marcador (bebê) em mark.y
  const [mx, my] = [cx, mark.y];
  glow(g, mx, my, 150, mark.color, 0.5); circle(g, mx, my - 22, 22, mark.color); g.fillStyle = mark.color; g.beginPath(); g.ellipse(mx, my + 22, 34, 20, 0, Math.PI, 0); g.fill();
  bpTitle(g, 'SONGBUN', 300, 1);
}
registerShot('s09', { draw(g, t, info) {
  const U = ui(), up = ease.inOut(prog(t, 0.15, 0.85));
  g.save(); g.translate(E.W / 2, E.H / 2); const z = 1.02 + 0.04 * t; g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  pyramid(g, t, { y: lerp(1500, 600, up), tier: 0, lit: ease.out(prog(t, 0.8, 1.1)), color: U.gold });
  g.restore();
  if (t > 0.85) FX.sparkle(g, E.W / 2 + 40, 560, 40 * (1 - prog(t, 0.85, 1.35)) + 10, '#fff2c8', 0.9);
} });
registerShot('s12', { draw(g, t, info) {
  const U = ui(), fall = ease.in(prog(t, 0.95, 1.35)), sh = t > 1.35 ? shake(t, 10 * (1 - prog(t, 1.35, 1.65)), 30) : [0, 0];
  g.save(); g.translate(sh[0], sh[1]); g.translate(E.W / 2, E.H / 2); const z = 1.06 - 0.03 * t; g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  pyramid(g, t, { y: lerp(600, 1210, fall), tier: t > 1.35 ? 2 : 0, lit: t > 1.35 ? 1 : 0.6, color: t > 1.35 ? U.accent : U.gold });
  g.restore();
} });

// s11 — "e estudar nas melhores escolas." — escola grandiosa, luz dourada
registerShot('s11', { draw(g, t, info) {
  const M = mood('golden'), GY = ground(), CX = E.W / 2, k = ease.inOut(t / info.dur), cam = { z: 1.04 + 0.05 * k, x: -20 + 40 * k };
  layer(g, cam, 0.12, (g) => { backdrop(g, M.sky); FX.sun(g, CX + 330, GY - 1180, 60, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.5, (g) => {
    const fx = CX - 700, fw = 1400, ft = GY - 980, wall = '#cfc0a8';
    g.fillStyle = linGrad(g, 0, ft, 0, GY, [shade(wall, -0.1), shade(wall, -0.45)]); g.fillRect(fx, ft, fw, GY - ft);
    poly(g, [[fx - 40, ft], [CX, ft - 220], [fx + fw + 40, ft]], shade(wall, -0.3));
    circle(g, CX, ft - 90, 54, LENCO); ring(g, CX, ft - 90, 54, 8, M.practical);
    for (let i = 0; i < 8; i++) { const x = fx + 90 + i * 175; g.fillStyle = linGrad(g, x, 0, x + 60, 0, [shade(wall, 0.2), shade(wall, -0.25)]); g.fillRect(x, ft + 40, 60, GY - ft - 220); }
    for (let i = 0; i < 7; i++) { const x = fx + 175 + i * 175; rr(g, x, ft + 160, 70, 140, 30); g.fillStyle = M.practical; g.fill(); glow(g, x + 35, ft + 230, 110, M.practical, 0.3); }
    g.fillStyle = shade(LENCO, -0.1); g.fillRect(CX - 300, ft + 60, 600, 50);
    for (let s = 0; s < 6; s++) { g.fillStyle = shade(wall, -0.2 - s * 0.05); g.fillRect(fx - 60 + s * 30, GY - 180 + s * 30, fw + 120 - s * 60, 30); }
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, 0.2), M.dark]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); FX.pool(g, CX, GY + 40, 520, 80, M.key, 0.25); });
  layer(g, cam, 1, (g) => {
    const x = lerp(CX - 260, CX + 40, t / info.dur), s = 2.3, o = { x, y: GY - 10, s, facing: 1, outfit: VOCE_KID, pose: walkPose(t * Math.PI * 2 * 0.9), expr: 'happy', rim: { color: M.rim, dir: [0.6, -1], w: 5 } };
    drawFigure(g, o); scarfOn(g, o);
    rr(g, x - 46, GY - 190, 34, 46, 6); g.fillStyle = '#6a3a2a'; g.fill();
    for (const dx of [-330, 300]) drawFigure(g, { x: x + dx, y: GY - 10, s: 2.0, facing: 1, outfit: { top: 'tshirt', color: '#e8e4ee', kid: true }, pose: walkPose(t * Math.PI * 2 * 0.9 + dx), expr: 'smile', rim: { color: M.rim, dir: [0.6, -1] }, dim: 0.2 });
  });
  FX.dust(g, t, { count: 50, color: '#ffe2bd', a: 0.35 }); FX.lensStreak(g, E.W / 2, E.H * 0.2, E.W * 1.4, '#ffe0b0', 0.2);
} });

// s13 — "essa marca vai te acompanhar." — a sombra-carimbo segue a criança pela rua
registerShot('s13', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.06, x: -30 + 80 * k };
  const { GY, CX, M } = village(g, t, cam, { time: 'dusk', wall: true, billboard: false, noHouses: true });
  layer(g, cam, 1, (g) => {
    const x = lerp(CX - 250, CX + 220, t / info.dur), s = 2.3;
    // a "sombra" na parede: um carimbo vermelho que acompanha
    const sx = x - 120, sy = GY - 270; g.save(); g.translate(sx, sy); g.rotate(-0.12 + Math.sin(t * 3) * 0.03);
    g.strokeStyle = alpha(S().ui.accent, 0.85); g.lineWidth = 8; rr(g, -150, -55, 300, 110, 14); g.stroke(); g.lineWidth = 3; rr(g, -136, -41, 272, 82, 8); g.stroke();
    text(g, 'HOSTIL', 0, 4, { size: 50, color: alpha(S().ui.accent, 0.9), font: FONTS.ui, weight: 900, spacing: 6 }); g.restore();
    glow(g, sx, sy, 280, S().ui.accent, 0.18);
    seg(g, [[x - 20, GY - 10], [sx + 40, sy + 60]], 2, alpha(S().ui.accent, 0.25));
    const o = { x, y: GY - 10, s, facing: 1, outfit: VOCE_KID, pose: walkPose(t * Math.PI * 2 * 0.8), expr: 'sad', look: [-0.6, 0], rim: { color: M.rim, dir: [-1, -0.5], w: 5 } };
    drawFigure(g, o);
  });
  FX.dust(g, t, { count: 40, color: M.rim, a: 0.3 });
} });

// s14 — "Ela pode decidir onde você mora, onde trabalha e até com quem você pode casar."
registerShot('s14', { draw(g, t, info) {
  UI.blueprint(g); const bp = UI.bpStroke(), U = ui(), k = ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(1 + 0.03 * k, 1 + 0.03 * k); g.translate(-E.W / 2, -E.H / 2);
  const rows = [[1.0, 'ONDE MORA', iconHouse], [1.95, 'ONDE TRABALHA', iconMine], [3.2, 'COM QUEM CASA', iconRings]];
  rows.forEach(([at, lab, ic], i) => {
    const y = 470 + i * 330, p = ease.outBack(prog(t, at, at + 0.4)); if (p <= 0) return;
    g.save(); g.translate(260, y); g.scale(p, p); circle(g, 0, 0, 110, alpha(bp, 0.08)); ring(g, 0, 0, 110, 3, alpha(bp, 0.5)); ic(g, 0, i === 2 ? 0 : 20, 1.05, bp); g.restore();
    text(g, lab, 420, y, { size: 50, color: U.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 2, alpha: ease.out(prog(t, at + 0.1, at + 0.4)) });
    stamp(g, 720, y + 70, t - at - 0.4, 'SONGBUN', { scale: 0.62, rot: -0.15 + i * 0.07 });
  });
  g.restore();
} });
