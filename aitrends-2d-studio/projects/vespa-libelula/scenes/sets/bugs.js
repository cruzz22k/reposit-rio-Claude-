// sets/bugs.js — a vespa e a libélula em 2D (perfil e rosto grande, no estilo do canal) + cenários: céu de fim de tarde, lago, jardim, savana, laboratório.
import { E, V, S, mood, layer, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, backdrop, lerp, clamp, ease, prog } from '/engine/core.js';
import { face, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { ground } from './common.js';
import { VESPA, LIBELULA } from '../cast.js';

export const SKY = ['#2c2c64', '#7a5088', '#e08a68', '#f6c890'];   // tarde quente: roxo -> laranja
export const RIM = '#ffc890';
const ink = () => S().ink;

// ---------- a vespa (perfil, virada para a direita; o: t, expr, look, curl, flap, rim) ----------
export function wasp(g, x, y, s, o = {}) {
  const t = o.t ?? 0, f = o.facing ?? 1, rimC = o.rim ?? RIM, curl = o.curl ?? 0;
  g.save(); g.translate(x, y); g.scale(f * s, s);
  // asas (atrás do corpo), batendo rápido
  const flap = o.flap ?? 1;
  for (let k = 0; k < 3; k++) { const a = -1.9 + Math.sin(t * 60 + k * 2.1) * 0.5 * flap; g.save(); g.translate(2, -18); g.rotate(a); g.fillStyle = VESPA.wing; g.beginPath(); g.ellipse(34, 0, 38, 12, 0, 0, 7); g.fill(); g.restore(); }
  // pernas
  for (let i = 0; i < 3; i++) seg(g, [[-6 + i * 12, 14], [-12 + i * 16, 34], [-16 + i * 18, 48]], 3.5, ink());
  // abdômen listrado (gira no pecíolo para "virar o ferrão")
  g.save(); g.translate(-22, 6); g.rotate(curl);
  const ab = (gg, fill) => { gg.beginPath(); gg.ellipse(-40, 4, 42, 25, 0.12, 0, 7); gg.fillStyle = fill; gg.fill(); };
  g.save(); g.translate(-3, -3); ab(g, rimC); g.restore();
  g.save(); ab(g, VESPA.yellow); g.clip(); for (let i = 0; i < 4; i++) { g.fillStyle = ink(); g.fillRect(-74 + i * 21, -40, 10, 90); } g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(-90, 14, 100, 30); g.restore();
  poly(g, [[-80, 8], [-102, 14 + (o.sting ?? 0) * 6], [-80, 16]], ink());
  if (o.stingGlow) { glow(g, -100, 14, 40, '#fff4c8', o.stingGlow); }
  g.restore();
  seg(g, [[-20, 6], [-12, 4]], 6, ink());
  // tórax e cabeça
  g.save(); g.translate(-2, -2); circle(g, 4, 0, 24, rimC); circle(g, 38, -8, 23, rimC); g.restore();
  g.fillStyle = ink(); g.beginPath(); g.ellipse(4, 0, 24, 21, 0, 0, 7); g.fill();
  g.fillStyle = VESPA.yellow; g.fillRect(-6, -18, 20, 5);
  circle(g, 38, -8, 22, ink());
  g.strokeStyle = ink(); g.lineWidth = 3.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(44, -26); g.quadraticCurveTo(58, -52, 76, -50); g.stroke(); g.beginPath(); g.moveTo(36, -28); g.quadraticCurveTo(46, -58, 62, -60); g.stroke();
  g.restore();
  // rosto (fora da escala espelhada para o texto ficar certo)
  g.save(); g.translate(x, y); g.scale(f, 1); face(g, 38 * s, -8 * s, 22 * s, { expr: o.expr || 'neutral', look: o.look, blink: o.blink }); g.restore();
}

// ---------- a libélula (perfil, virada para a direita; o: t, expr, look, wingPhase[], legs 0..1 (cestinha), bite) ----------
export function dragonfly(g, x, y, s, o = {}) {
  const t = o.t ?? 0, f = o.facing ?? 1, rimC = o.rim ?? RIM, B = LIBELULA.body;
  g.save(); g.translate(x, y); g.scale(f * s, s);
  // quatro asas, cada uma no seu ritmo
  const ph = o.wingPhase || [0, 1.7, 0.6, 2.4], amp = o.wingAmp ?? 0.55, sp = o.wingSpeed ?? 38;
  const wing = (bx, a) => { g.save(); g.translate(bx, -10); g.rotate(a); g.fillStyle = LIBELULA.wing; g.beginPath(); g.ellipse(0, -70, 13, 72, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(220,250,255,.45)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -4); g.lineTo(0, -138); g.stroke(); for (let k = 1; k < 6; k++) { g.beginPath(); g.moveTo(-10, -k * 22); g.lineTo(10, -k * 22 - 6); g.stroke(); } g.restore(); };
  wing(6, 0.5 + Math.sin(t * sp + ph[2]) * amp); wing(-6, 0.9 + Math.sin(t * sp + ph[3]) * amp);
  // pernas espinhosas (0 = recolhidas; 1 = abertas em cesta para a frente)
  const L = o.legs ?? 0;
  for (let i = 0; i < 3; i++) { const bx = 0 + i * 10, kx = bx + 12 + L * 30, ky = 26 + i * 4 - L * 10, fx = kx + 10 + L * 34 - i * 4, fy = ky + 18 - L * 36 + i * 8;
    seg(g, [[bx, 12], [kx, ky], [fx, fy]], 3, ink()); for (let k = 1; k < 4; k++) seg(g, [[lerp(kx, fx, k / 4), lerp(ky, fy, k / 4)], [lerp(kx, fx, k / 4) + 5, lerp(ky, fy, k / 4) - 6]], 1.6, ink()); }
  // abdômen longo e fino, segmentado
  g.save(); g.translate(0, 0); seg(g, [[-10, 6], [-200, 14]], 13, rimC); seg(g, [[-8, 8], [-200, 16]], 11, B);
  for (let k = 0; k < 9; k++) { const xx = -24 - k * 20; seg(g, [[xx, 3], [xx, 17]], 2, shade(B, -0.5)); } seg(g, [[-200, 16], [-214, 10]], 4, ink()); g.restore();
  // tórax
  g.save(); g.translate(-2, -2); g.fillStyle = rimC; g.beginPath(); g.ellipse(12, 2, 25, 21, 0, 0, 7); g.fill(); g.restore();
  g.fillStyle = shade(B, -0.15); g.beginPath(); g.ellipse(12, 2, 24, 20, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, -14, 26, 4);
  // asas da frente (na frente do corpo)
  wing(18, 0.25 + Math.sin(t * sp + ph[0]) * amp); wing(10, 0.7 + Math.sin(t * sp + ph[1]) * amp);
  // cabeça com os olhos compostos enormes
  circle(g, 44, 0, 18, ink());
  circle(g, 48, -12, 19, rimC); circle(g, 49, -11, 18, LIBELULA.eye);
  g.save(); g.beginPath(); g.arc(49, -11, 18, 0, 7); g.clip(); g.strokeStyle = 'rgba(0,40,50,.25)'; g.lineWidth = 1; for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { const hx = 49 + i * 6 + (j % 2) * 3, hy = -11 + j * 5.2; g.beginPath(); for (let a = 0; a < 6; a++) g.lineTo(hx + Math.cos(a * Math.PI / 3) * 3, hy + Math.sin(a * Math.PI / 3) * 3); g.closePath(); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(43, -20, 6, 4, -0.5, 0, 7); g.fill(); g.restore();
  if (o.bite != null) { const b = o.bite; g.strokeStyle = ink(); g.lineWidth = 3; g.beginPath(); g.moveTo(58, 8); g.quadraticCurveTo(70, 8 + b * 8, 66, 16 + b * 10); g.stroke(); g.beginPath(); g.moveTo(58, 10); g.quadraticCurveTo(66, 18 - b * 4, 60, 20); g.stroke(); }
  g.restore();
  // olhinho de desenho dentro do olho composto
  g.save(); g.translate(x, y); g.scale(f, 1);
  const lk = o.look || [0.4, 0], ex = (49 + lk[0] * 4) * s, ey = (-11 + lk[1] * 4) * s;
  circle(g, ex, ey, 6.5 * s, '#f4efe6'); circle(g, ex + 1.5 * s, ey, 3.2 * s, ink());
  if (o.expr === 'angry' || o.expr === 'determined') seg(g, [[40 * s, -30 * s], [58 * s, -24 * s]], 3 * s, ink());
  g.restore();
}

// ---------- rostos grandes ----------
export function waspFace(g, cx, cy, r, o = {}) {
  const rimC = o.rimColor || RIM;
  bigFace(g, cx, cy, r, { outfit: { top: 'none' }, expr: o.expr, look: o.look, blink: o.blink, rimColor: rimC, rimSide: o.rimSide ?? -1, tilt: o.tilt });
  // ombros listrados
  g.save(); g.beginPath(); g.ellipse(cx, cy + r * 1.65, r * 1.25, r * 0.85, 0, Math.PI, Math.PI * 2); g.clip();
  g.fillStyle = VESPA.yellow; g.fillRect(cx - r * 1.3, cy + r * 0.8, r * 2.6, r); for (let i = 0; i < 3; i++) { g.fillStyle = ink(); g.fillRect(cx - r * 1.3, cy + r * (1.0 + i * 0.26), r * 2.6, r * 0.12); } g.restore();
  // antenas
  g.strokeStyle = ink(); g.lineWidth = r * 0.07; g.lineCap = 'round';
  for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(cx + sx * r * 0.35, cy - r * 0.9); g.quadraticCurveTo(cx + sx * r * 0.5, cy - r * 1.55, cx + sx * r * 0.95, cy - r * 1.6 + Math.sin((o.t ?? 0) * 3 + sx) * r * 0.05); g.stroke(); }
}
export function dragonFace(g, cx, cy, r, o = {}) {
  const rimC = o.rimColor || RIM, ex = o.expr || 'neutral', lk = o.look || [0, 0];
  g.fillStyle = LIBELULA.body; g.beginPath(); g.ellipse(cx, cy + r * 1.65, r * 1.15, r * 0.85, 0, Math.PI, Math.PI * 2); g.fill();
  circle(g, cx + (o.rimSide ?? 1) * r * 0.05, cy, r * 1.04, rimC); circle(g, cx, cy, r, ink());
  for (const sx of [-1, 1]) {
    const dx = cx + sx * r * 0.5, dy = cy - r * 0.42, dr = r * 0.62;
    circle(g, dx, dy, dr * 1.04, rimC); circle(g, dx, dy, dr, LIBELULA.eye);
    g.save(); g.beginPath(); g.arc(dx, dy, dr, 0, 7); g.clip(); g.strokeStyle = 'rgba(0,50,60,.22)'; g.lineWidth = r * 0.012;
    for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) { const hx = dx + i * dr * 0.18 + (j % 2) * dr * 0.09, hy = dy + j * dr * 0.156; g.beginPath(); for (let a = 0; a < 6; a++) g.lineTo(hx + Math.cos(a * Math.PI / 3) * dr * 0.09, hy + Math.sin(a * Math.PI / 3) * dr * 0.09); g.closePath(); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.ellipse(dx - dr * 0.35, dy - dr * 0.45, dr * 0.25, dr * 0.14, -0.6, 0, 7); g.fill(); g.restore();
    const px = dx + lk[0] * dr * 0.2, py = dy + dr * 0.15 + lk[1] * dr * 0.2;
    const narrow = ex === 'angry' || ex === 'determined' ? 0.55 : 1;
    g.fillStyle = '#f4efe6'; g.beginPath(); g.ellipse(px, py, dr * 0.28, dr * 0.28 * narrow, 0, 0, 7); g.fill(); circle(g, px + lk[0] * dr * 0.06, py, dr * 0.13 * Math.max(0.7, narrow), ink());
    if (narrow < 1) seg(g, [[dx + sx * dr * 0.45, py - dr * 0.42], [dx - sx * dr * 0.3, py - dr * 0.16]], r * 0.07, ink());
  }
  // boca / mandíbulas
  const b = o.bite ?? 0, my = cy + r * 0.45;
  if (o.bite != null) { for (const sx of [-1, 1]) { g.strokeStyle = '#f4efe6'; g.lineWidth = r * 0.07; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx + sx * r * 0.08, my - r * 0.05); g.quadraticCurveTo(cx + sx * r * (0.25 + 0.15 * b), my + r * 0.1, cx + sx * r * (0.08 + 0.22 * b), my + r * 0.3); g.stroke(); } }
  else if (ex === 'smile' || ex === 'happy') { g.strokeStyle = '#f4efe6'; g.lineWidth = r * 0.07; g.beginPath(); g.arc(cx, my - r * 0.15, r * 0.2, 0.4, Math.PI - 0.4); g.stroke(); }
  else if (ex === 'smirk') { g.strokeStyle = '#f4efe6'; g.lineWidth = r * 0.07; g.beginPath(); g.moveTo(cx - r * 0.15, my); g.quadraticCurveTo(cx + r * 0.05, my + r * 0.06, cx + r * 0.2, my - r * 0.08); g.stroke(); }
  else seg(g, [[cx - r * 0.12, my], [cx + r * 0.12, my]], r * 0.07, '#f4efe6');
}

// ---------- outros bichos ----------
export function fly(g, x, y, s, t, c = '#1a1a22') {
  for (const a of [-2.2, -1.0]) { g.fillStyle = 'rgba(220,235,255,.4)'; g.beginPath(); g.ellipse(x + Math.cos(a) * 10 * s, y + Math.sin(a) * 10 * s + Math.sin(t * 70) * 2, 10 * s, 5 * s, a, 0, 7); g.fill(); }
  g.fillStyle = c; g.beginPath(); g.ellipse(x, y, 12 * s, 8 * s, 0, 0, 7); g.fill(); circle(g, x + 12 * s, y - 2 * s, 6 * s, c); circle(g, x + 14 * s, y - 4 * s, 3 * s, '#a83030');
}
export function beetle(g, x, y, s, t, c = '#3a5a3a') { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, 22 * s, 14 * s, 0, Math.PI, 0); g.fill(); circle(g, x + 22 * s, y - 4 * s, 8 * s, ink()); for (let i = 0; i < 3; i++) seg(g, [[x - 10 * s + i * 10 * s, y], [x - 14 * s + i * 10 * s + Math.sin(t * 20 + i) * 4 * s, y + 10 * s]], 2 * s, ink()); seg(g, [[x, y - 14 * s], [x, y]], 1.5 * s, shade(c, -0.4)); }
export function lion(g, x, y, s, ph, c = '#1c120c') {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c;
  const leg = (bx, a) => seg(g, [[bx, -40], [bx + Math.sin(a) * 22, -14], [bx + Math.sin(a) * 30, 0]], 10, c);
  leg(-50, ph + Math.PI); leg(46, ph);
  g.beginPath(); g.ellipse(0, -58, 70, 26, 0, 0, 7); g.fill(); circle(g, 80, -74, 34, c); circle(g, 92, -72, 20, shade(c, 0.2)); g.beginPath(); g.moveTo(-66, -62); g.quadraticCurveTo(-110, -90, -118, -50 + Math.sin(ph) * 8); g.lineWidth = 6; g.strokeStyle = c; g.stroke();
  leg(-60, ph); leg(36, ph + Math.PI); g.restore();
}
export function zebra(g, x, y, s, ph, c = '#1c120c') {
  g.save(); g.translate(x, y); g.scale(s, s);
  const leg = (bx, a) => seg(g, [[bx, -46], [bx + Math.sin(a) * 22, -18], [bx + Math.sin(a) * 30, 0]], 8, c);
  leg(-44, ph + Math.PI); leg(44, ph);
  g.fillStyle = c; g.beginPath(); g.ellipse(0, -66, 62, 26, 0, 0, 7); g.fill(); poly(g, [[44, -80], [80, -136], [100, -126], [64, -60]], c); g.beginPath(); g.ellipse(102, -128, 22, 12, 0.6, 0, 7); g.fill();
  g.strokeStyle = 'rgba(240,220,190,.5)'; g.lineWidth = 5; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-40 + i * 16, -86); g.lineTo(-46 + i * 16, -46); g.stroke(); }
  leg(-54, ph); leg(34, ph + Math.PI); g.restore();
}

// ---------- cenários ----------
export function sky(g, t, cam, o = {}) {
  const GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, o.colors || SKY); FX.sun(g, o.sunX ?? CX + 240, o.sunY ?? GY - 380, 70, '#fff3dc', '#ffb070', 5); FX.clouds(g, { y: 260, h: 600, color: '#ffd8b0', a: 0.14, seed: 4 }); });
  if (o.trees !== false) layer(g, cam, 0.25, (g) => { const c = mix(SKY[1], '#0e0a18', 0.6); for (let i = 0; i < 18; i++) FX.tree(g, -500 + i * 140, GY + 120, 1.6 + (i * 7 % 5) * 0.2, c); g.fillStyle = c; g.fillRect(-E.W, GY + 110, E.W * 3, E.H); });
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.35 });
  return { GY, CX };
}
export function lake(g, t, cam, o = {}) {
  const GY = ground(), CX = E.W / 2, wy = GY - 160;
  layer(g, cam, 0.1, (g) => { backdrop(g, SKY); FX.sun(g, CX + 200, wy - 300, 70, '#fff3dc', '#ffb070', 5); FX.clouds(g, { y: 300, h: 500, color: '#ffd8b0', a: 0.14, seed: 6 }); });
  layer(g, cam, 0.25, (g) => { const c = mix(SKY[1], '#0e0a18', 0.62); for (let i = 0; i < 22; i++) FX.tree(g, -600 + i * 120, wy + 4, 1.3 + (i * 5 % 4) * 0.25, c); g.fillStyle = c; g.fillRect(-E.W, wy, E.W * 3, 8); });
  layer(g, cam, 0.4, (g) => {
    g.fillStyle = linGrad(g, 0, wy, 0, GY + 300, [mix(SKY[3], '#4a3a5a', 0.4), mix(SKY[1], '#0c0a18', 0.6)]); g.fillRect(-E.W, wy, E.W * 3, E.H);
    g.fillStyle = alpha('#fff0d0', 0.3); for (let j = 0; j < 14; j++) g.fillRect(CX + 200 - 70 + j * 3 + Math.sin(t * 2 + j) * 10, wy + 16 + j * 26, 140 - j * 8, 5);
  });
  layer(g, cam, 0.9, (g) => { const r = rng(9); for (let i = 0; i < 70; i++) { const x = -400 + r() * (E.W + 800), h = 160 + r() * 360, bend = Math.sin(t * 1.2 + i) * 8; g.strokeStyle = shade('#1a2418', r() * 0.2); g.lineWidth = 5; g.beginPath(); g.moveTo(x, E.H + 50); g.quadraticCurveTo(x + bend, E.H - h / 2, x + bend * 2, E.H - h); g.stroke(); if (i % 7 === 0) { g.fillStyle = '#3a2418'; g.beginPath(); g.ellipse(x + bend * 2, E.H - h, 7, 22, 0, 0, 7); g.fill(); } } });
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.35 });
  return { GY, CX, wy };
}
export function garden(g, t, cam) {
  const GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, SKY); FX.sun(g, CX - 260, GY - 600, 60, '#fff3dc', '#ffb070', 5); });
  layer(g, cam, 0.3, (g) => { const c = mix(SKY[1], '#0e0a18', 0.55); for (let i = 0; i < 14; i++) FX.tree(g, -400 + i * 170, GY - 120, 2.2, c); g.fillStyle = c; g.fillRect(-E.W, GY - 130, E.W * 3, E.H); });
  layer(g, cam, 0.8, (g) => { const r = rng(4); for (let i = 0; i < 9; i++) { const x = -100 + i * 160 + r() * 40, h = 300 + r() * 400; seg(g, [[x, E.H], [x + 10, GY + 300 - h]], 6, '#1c2a1a'); for (let p = 0; p < 6; p++) { const a = p / 6 * Math.PI * 2 + t * 0.2; g.fillStyle = ['#e07a8a', '#f2c46a', '#c08ad0'][i % 3]; g.beginPath(); g.ellipse(x + 10 + Math.cos(a) * 26, GY + 300 - h + Math.sin(a) * 26, 22, 12, a, 0, 7); g.fill(); } circle(g, x + 10, GY + 300 - h, 16, '#f2c21a'); } });
  FX.dust(g, t, { count: 40, color: '#ffe0b0', a: 0.35 });
  return { GY, CX };
}
export function savanna(g, t, cam) {
  const GY = ground(), CX = E.W / 2, c = '#1c120c';
  layer(g, cam, 0.1, (g) => { backdrop(g, ['#3a2a5a', '#c0605a', '#f0a060', '#f8d090']); FX.sun(g, CX, GY - 260, 160, '#fff0c8', '#ffb060', 3); });
  layer(g, cam, 0.4, (g) => { for (const [x, sc] of [[-80, 1.6], [880, 2.0]]) { seg(g, [[x, GY], [x + 10 * sc, GY - 200 * sc]], 12 * sc, c); g.fillStyle = c; g.beginPath(); g.ellipse(x + 10 * sc, GY - 210 * sc, 140 * sc, 26 * sc, 0, 0, 7); g.fill(); } });
  layer(g, cam, 0.8, (g) => { g.fillStyle = c; g.fillRect(-E.W, GY, E.W * 3, E.H); for (let x = -300; x < E.W + 300; x += 14) seg(g, [[x, GY + 4], [x + 4, GY - 20 - (x * 7 % 13)]], 3, c); });
  return { GY, CX, c };
}
export function lab(g, t, cam) {
  const M = mood('interiorCool'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => { g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(M.wall, -0.45), shade(M.wall, -0.1)]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H); FX.windowFrame(g, { x: CX + 150, y: GY - 900, w: 300, h: 380, cols: 2, rows: 2, frame: shade(M.wall, -0.6), bar: 10 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, SKY); g.fillRect(x, y, w, h); }); });
  layer(g, cam, 0.85, (g) => { FX.counter(g, { x: CX - 520, y: GY, w: 1040, h: 140, color: shade(M.wall, -0.5), top: shade(M.wall, -0.2), doors: 6 }); g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [shade(M.floor, 0.1), M.dark]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); });
  return { GY, CX, M, top: GY - 148 };
}
