// sets/common.js — peças compartilhadas: retratos, ficha songbun, carimbo, lenço, broche, ícones e selos de idade.
import { E, V, S, ease, prog, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, radGrad, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
const LENCO = '#d8362b';

export const ground = () => E.H * V(0.8, 0.68);

// posição de um ponto do esqueleto no mundo (mesma matemática do drawFigure, sem rotação)
export function joint(o, name) {
  const p = o.pose || POSES.stand, s = (o.s ?? 1) * (o.outfit?.kid ? 0.72 : 1), f = o.facing ?? 1;
  return [o.x + p[name][0] * s * f, o.y + p[name][1] * s];
}
// lenço vermelho de pioneiro no pescoço de uma figura
export function scarfOn(g, o) {
  const [x, y] = joint(o, 'sh'), s = (o.s ?? 1) * (o.outfit?.kid ? 0.72 : 1), f = o.facing ?? 1;
  seg(g, [[x - 13 * s * f, y - 4 * s], [x + 13 * s * f, y - 2 * s]], 7 * s, LENCO);
  poly(g, [[x + 4 * s * f, y], [x + 16 * s * f, y + 26 * s], [x + 22 * s * f, y + 4 * s]], shade(LENCO, -0.1));
}
// broche no peito (ponto vermelho com brilho)
export function pinOn(g, o, t = 0, glint = 1) {
  const [x, y] = joint(o, 'sh'), [hx, hy] = joint(o, 'hip'), s = (o.s ?? 1) * (o.outfit?.kid ? 0.72 : 1), f = o.facing ?? 1;
  const px = lerp(x, hx, 0.22) + 7 * s * f, py = lerp(y, hy, 0.22);
  rr(g, px - 4 * s, py - 3 * s, 8 * s, 6 * s, 1.5 * s); g.fillStyle = LENCO; g.fill();
  if (glint > 0) FX.sparkle(g, px, py, (10 + 6 * Math.sin(t * 5)) * s * glint, '#fff2c8', 0.9);
}

// retrato emoldurado de um líder (silhueta sem rosto, fundo vermelho)
export function portrait(g, x, y, w, h, M, hat = false, o = {}) {
  const gold = S().ui.gold, fr = Math.max(8, w * 0.08);
  g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = w * 0.15; g.shadowOffsetY = w * 0.06; rr(g, x - fr, y - fr, w + fr * 2, h + fr * 2, 6); g.fillStyle = shade(gold, -0.3); g.fill(); g.restore();
  rr(g, x - fr, y - fr, w + fr * 2, h + fr * 2, 6); g.fillStyle = linGrad(g, x, y, x + w, y + h, [shade(gold, 0.05), shade(gold, -0.45), shade(gold, -0.15)]); g.fill();
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = linGrad(g, 0, y, 0, y + h, [mix(LENCO, M.practical, 0.35), shade(LENCO, -0.35)]); g.fillRect(x, y, w, h);
  glow(g, x + w / 2, y + h * 0.4, w * 0.8, M.practical, 0.3);
  const ink = S().ink, cx = x + w / 2;
  g.fillStyle = ink; g.beginPath(); g.ellipse(cx, y + h * 1.03, w * 0.46, h * 0.36, 0, Math.PI, 0); g.fill();
  circle(g, cx, y + h * 0.42, w * 0.24, ink);
  if (hat) { g.fillStyle = ink; g.beginPath(); g.ellipse(cx, y + h * 0.3, w * 0.25, h * 0.11, 0, Math.PI, 0); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,.07)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w * 0.55, y); g.lineTo(x + w * 0.2, y + h); g.lineTo(x, y + h); g.fill();
  if (o.dust) { g.fillStyle = alpha('#b8a890', o.dust); g.fillRect(x, y, w, h); }
  g.restore();
}
// par de retratos centrado em cx (larguras pw/ph), com luminárias
export function portraitPair(g, cx, y, pw, ph, M, o = {}) {
  const gap = pw * 0.26;
  for (const sx of [-1, 1]) {
    const x = cx + sx * (pw / 2 + gap / 2);
    if (o.lamps !== false) FX.lightCone(g, x, y - ph * 0.18, { angle: Math.PI / 2, spread: 1.2, len: ph * 1.9, color: M.practical, a: 0.3 });
    portrait(g, x - pw / 2, y, pw, ph, M, sx > 0, o);
    if (o.lamps !== false) { rr(g, x - pw * 0.24, y - ph * 0.22, pw * 0.48, ph * 0.06, ph * 0.03); g.fillStyle = shade(S().ui.gold, -0.5); g.fill(); glow(g, x, y - ph * 0.17, pw * 0.45, M.practical, 0.75); }
  }
}

// a ficha songbun (pasta + papel), aparece com pop; carimbo vermelho em tStamp
export function dossier(g, cx, cy, t, tStamp, o = {}) {
  const ui = S().ui, k = ease.outBack(prog(t, 0, 0.45)); if (k <= 0) return;
  const sc = o.scale ?? 1, w = 640 * sc, h = 430 * sc, paper = shade(ui.cream, -0.08), folder = shade(ui.gold, -0.32);
  g.save(); g.translate(cx, cy); g.rotate(o.rot ?? -0.045); g.scale(k, k);
  g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 50; g.shadowOffsetY = 18;
  rr(g, -w / 2 - 22 * sc, -h / 2 - 18 * sc, w + 44 * sc, h + 40 * sc, 16 * sc); g.fillStyle = folder; g.fill(); g.shadowColor = 'transparent';
  rr(g, -w / 2 - 22 * sc, -h / 2 - 62 * sc, 220 * sc, 60 * sc, 14 * sc); g.fillStyle = folder; g.fill();
  text(g, 'Nº 000001', -w / 2 + 88 * sc, -h / 2 - 36 * sc, { size: 28 * sc, color: shade(folder, -0.55), font: FONTS.ui, weight: 900, spacing: 2 });
  rr(g, -w / 2, -h / 2, w, h, 8 * sc); g.fillStyle = paper; g.fill();
  const px = -w / 2 + 44 * sc, py = -h / 2 + 44 * sc, ink = '#2a2430';
  rr(g, px, py, 150 * sc, 180 * sc, 8 * sc); g.fillStyle = shade(paper, -0.16); g.fill();
  g.fillStyle = ink; g.beginPath(); g.ellipse(px + 75 * sc, py + 150 * sc, 52 * sc, 52 * sc, 0, Math.PI, 0); g.fill(); circle(g, px + 75 * sc, py + 74 * sc, 34 * sc, ink);
  text(g, 'SONGBUN', px + 190 * sc, py + 26 * sc, { size: 60 * sc, color: ink, align: 'left', spacing: 4 });
  for (let i = 0; i < 4; i++) { g.fillStyle = alpha(ink, 0.3); g.fillRect(px + 192 * sc, py + (84 + i * 32) * sc, (w - 290 * sc) * [1, 0.72, 0.9, 0.5][i] * ease.out(prog(t, 0.5 + i * 0.12, 0.9 + i * 0.12)), 10 * sc); }
  for (let i = 0; i < 3; i++) { g.fillStyle = alpha(ink, 0.22); g.fillRect(px, py + (226 + i * 34) * sc, (w - 88 * sc) * [0.95, 0.8, 0.6][i] * ease.out(prog(t, 0.9 + i * 0.12, 1.3 + i * 0.12)), 10 * sc); }
  g.restore();
  stamp(g, cx + w * 0.2, cy + h * 0.2, t - tStamp, o.stamp || 'CLASSIFICADO', { scale: sc });
}
// carimbo vermelho que bate (ts = tempo desde a batida)
export function stamp(g, x, y, ts, str, o = {}) {
  if (ts <= 0) return; const red = o.color || S().ui.accent, sc = (o.scale ?? 1) * 0.6;
  const z = lerp(1.6, 1, ease.out(prog(ts, 0, 0.13)));
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.22); g.scale(z * sc, z * sc); g.globalAlpha *= clamp(ts / 0.08) * (o.a ?? 0.92);
  const w = Math.max(220, str.length * 25 + 40);
  rr(g, -w / 2, -52, w, 104, 14); g.strokeStyle = red; g.lineWidth = 9; g.stroke();
  rr(g, -w / 2 + 14, -38, w - 28, 76, 8); g.lineWidth = 3; g.stroke();
  text(g, str, 0, 3, { size: 36, color: red, font: FONTS.ui, weight: 900, spacing: 3 });
  g.restore();
  if (ts < 0.8 && o.rings !== false) FX.rings(g, x, y, ts, { count: 2, r0: 60 * sc, r1: 420 * sc, speed: 1.8, color: red, a: 0.5 * (1 - ts / 0.8) });
}

// selo de idade no canto (pop com outBack)
export function ageBadge(g, t, str, o = {}) {
  const k = ease.outBack(prog(t, o.at ?? 0.2, (o.at ?? 0.2) + 0.4)); if (k <= 0) return; const ui = S().ui;
  const x = o.x ?? E.W - V(150, 190), y = o.y ?? V(130, 250), r = V(78, 96);
  g.save(); g.translate(x, y); g.scale(k, k);
  circle(g, 0, 0, r, alpha(ui.bpBg, 0.85)); ring(g, 0, 0, r, 5, ui.gold); ring(g, 0, 0, r - 12, 2, alpha(ui.gold, 0.5));
  const [n, u] = str.split(' ');
  text(g, n, 0, -r * 0.14, { size: r * 0.78, color: ui.gold, font: FONTS.ui, weight: 900, glow: 14, glowColor: alpha(ui.gold, 0.6) });
  text(g, u || '', 0, r * 0.5, { size: r * 0.26, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 });
  g.restore();
}
// título curto de blueprint
export function bpTitle(g, str, y, a = 1, color) {
  text(g, str, E.W / 2, y, { size: V(46, 54), color: color || S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: a, glow: 12, glowColor: alpha(S().ui.blueprint, 0.5) });
}

// ícones de linha (blueprint)
export function iconHouse(g, x, y, s, c) { g.strokeStyle = c; g.lineWidth = 6 * s; g.lineJoin = 'round'; g.beginPath(); g.moveTo(x - 60 * s, y - 40 * s); g.lineTo(x, y - 95 * s); g.lineTo(x + 60 * s, y - 40 * s); g.stroke(); g.strokeRect(x - 46 * s, y - 45 * s, 92 * s, 85 * s); g.strokeRect(x - 14 * s, y + 2 * s, 28 * s, 38 * s); }
export function iconMine(g, x, y, s, c) { g.strokeStyle = c; g.lineWidth = 6 * s; g.lineCap = 'round'; g.beginPath(); g.arc(x, y + 40 * s, 62 * s, Math.PI, 0); g.stroke(); seg(g, [[x - 62 * s, y + 40 * s], [x + 62 * s, y + 40 * s]], 6 * s, c); seg(g, [[x - 34 * s, y - 40 * s], [x + 30 * s, y + 24 * s]], 6 * s, c); g.beginPath(); g.moveTo(x - 66 * s, y - 30 * s); g.quadraticCurveTo(x - 30 * s, y - 70 * s, x + 6 * s, y - 64 * s); g.stroke(); }
export function iconRings(g, x, y, s, c) { ring(g, x - 26 * s, y, 40 * s, 6 * s, c); ring(g, x + 26 * s, y, 40 * s, 6 * s, c); poly(g, [[x - 26 * s, y - 52 * s], [x - 38 * s, y - 64 * s], [x - 14 * s, y - 64 * s]], c); }
export function iconEye(g, x, y, s, c, open = 1) {
  g.strokeStyle = c; g.lineWidth = 6 * s; g.beginPath(); g.moveTo(x - 90 * s, y); g.quadraticCurveTo(x, y - 70 * s * open, x + 90 * s, y); g.quadraticCurveTo(x, y + 70 * s * open, x - 90 * s, y); g.stroke();
  if (open > 0.2) { circle(g, x, y, 26 * s * open, c); circle(g, x, y, 11 * s * open, S().ui.bpBg); }
}
export function iconGlobe(g, x, y, s, c) { ring(g, x, y, 70 * s, 6 * s, c); g.strokeStyle = c; g.lineWidth = 4 * s; g.beginPath(); g.ellipse(x, y, 30 * s, 70 * s, 0, 0, 7); g.stroke(); seg(g, [[x - 70 * s, y], [x + 70 * s, y]], 4 * s, c); g.beginPath(); g.ellipse(x, y - 34 * s, 58 * s, 10 * s, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(x, y + 34 * s, 58 * s, 10 * s, 0, 0, 7); g.stroke(); }
export function cross(g, x, y, r, c, p = 1) { if (p <= 0) return; seg(g, [[x - r, y - r], [x - r + 2 * r * clamp(p * 2), y - r + 2 * r * clamp(p * 2)]], r * 0.18, c); if (p > 0.5) seg(g, [[x + r, y - r], [x + r - 2 * r * clamp(p * 2 - 1), y - r + 2 * r * clamp(p * 2 - 1)]], r * 0.18, c); }

// arame farpado entre dois pontos
export function barbed(g, x0, y0, x1, y1, c, w = 3) {
  seg(g, [[x0, y0], [x1, y1]], w, c); const n = Math.floor(Math.hypot(x1 - x0, y1 - y0) / 34);
  for (let i = 1; i < n; i++) { const x = lerp(x0, x1, i / n), y = lerp(y0, y1, i / n); seg(g, [[x - 7, y - 7], [x + 7, y + 7]], w * 0.8, c); seg(g, [[x - 7, y + 7], [x + 7, y - 7]], w * 0.8, c); }
}
// mão estendida apontando (cápsulas), da borda até a ponta
export function pointingArm(g, x0, y0, x1, y1, w, sleeve, ink) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  seg(g, [[x0, y0], [lerp(x0, x1, 0.55), lerp(y0, y1, 0.55)]], w * 1.35, sleeve);
  seg(g, [[lerp(x0, x1, 0.5), lerp(y0, y1, 0.5)], [x1 - Math.cos(a) * w * 0.8, y1 - Math.sin(a) * w * 0.8]], w, ink);
  circle(g, x1 - Math.cos(a) * w * 0.9, y1 - Math.sin(a) * w * 0.9, w * 0.72, ink);
  seg(g, [[x1 - Math.cos(a) * w * 0.9, y1 - Math.sin(a) * w * 0.9], [x1 + Math.cos(a) * w * 0.7, y1 + Math.sin(a) * w * 0.7]], w * 0.34, ink);
}

// rosto gigante com o lenço vermelho amarrado (p = 0..1 progresso do laço); o queixo fica por cima do lenço
import { bigFace, face } from '/engine/rig2d.js';
export function faceWithScarf(g, cx, cy, r, o = {}) {
  const ink = S().ink, p = o.scarf ?? 1, tilt = o.tilt ?? -0.03, fo = { expr: o.expr, look: o.look, blink: o.blink, front: true };
  bigFace(g, cx, cy, r, { outfit: o.outfit, expr: o.expr, look: o.look, rimColor: o.rimColor, rimSide: o.rimSide ?? 1, blink: o.blink, tilt });
  if (p > 0) {
    g.save(); g.beginPath(); g.rect(cx - r * 1.2, cy, r * 2.4 * clamp(p * 1.3), r * 2); g.clip();
    g.strokeStyle = LENCO; g.lineWidth = r * 0.2; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - r * 0.86, cy + r * 0.9); g.quadraticCurveTo(cx, cy + r * 1.62, cx + r * 0.86, cy + r * 0.9); g.stroke(); g.restore();
    if (p > 0.7) { const k = clamp((p - 0.7) / 0.3);
      poly(g, [[cx - r * 0.06, cy + r * 1.24], [cx - r * 0.06 - r * 0.28 * k, cy + r * (1.24 + 0.5 * k)], [cx - r * 0.02, cy + r * (1.24 + 0.36 * k)]], shade(LENCO, -0.12));
      poly(g, [[cx + r * 0.06, cy + r * 1.24], [cx + r * 0.06 + r * 0.24 * k, cy + r * (1.24 + 0.46 * k)], [cx, cy + r * (1.24 + 0.38 * k)]], shade(LENCO, -0.22));
      circle(g, cx, cy + r * 1.25, r * 0.1 * k, shade(LENCO, 0.12)); }
    g.save(); g.beginPath(); g.arc(cx, cy, r * 1.07, 0.15, Math.PI - 0.15); g.lineTo(cx - r * 1.1, cy - r * 1.2); g.lineTo(cx + r * 1.1, cy - r * 1.2); g.closePath(); g.clip();
    g.translate(cx, cy); g.rotate(tilt); g.translate(-cx, -cy);
    g.save(); g.beginPath(); g.arc(cx, cy, r * 1.06, 0, 7); g.arc(cx + (o.rimSide ?? 1) * r * 0.07, cy + r * 0.02, r, 0, 7, true); g.fillStyle = o.rimColor || '#ffc68a'; g.fill('evenodd'); g.restore(); circle(g, cx, cy, r, ink);
    g.restore();
    g.save(); g.translate(cx, cy); g.rotate(tilt); face(g, 0, 0, r, fo); g.restore();
  }
}
// pose sentado no chão (pernas dobradas)
export const FLOOR = { head: [6, -140], sh: [2, -106], hip: [0, -32], eF: [18, -72], hF: [42, -54], eB: [12, -72], hB: [34, -52], kF: [48, -36], fF: [22, -6], kB: [42, -32], fB: [14, -4] };

// título elegante: rótulo pequeno espaçado + palavra grande dourada
export function labelTitle(g, t, small, big, y, o = {}) {
  const a = ease.out(prog(t, o.at ?? 0.2, (o.at ?? 0.2) + 0.4)) * (o.out != null ? 1 - prog(t, o.out, o.out + 0.3) : 1); if (a <= 0) return;
  text(g, small, E.W / 2, y - (o.big ?? 84) * 0.85, { size: 32, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 10, alpha: a * 0.9 });
  text(g, big, E.W / 2, y, { size: o.big ?? 84, color: '#f2c46a', spacing: 6, alpha: a, glow: 22, glowColor: 'rgba(255,150,60,.55)' });
}
