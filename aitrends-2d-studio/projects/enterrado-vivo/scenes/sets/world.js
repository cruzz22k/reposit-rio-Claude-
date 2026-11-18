// sets/world.js — Europa, 1830: rua, quarto, cemitério, corte do subsolo, dentro do caixão, casa de espera, ringue.
// Ilustração 2D plana em camadas com parallax; paleta fria (azul-marinho), velas e lampiões como acento quente.
import { E, V, S, mood, layer, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, backdrop, lerp, clamp, noise, ease, prog } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { ground } from './common.js';

export const NAVY = ['#070b18', '#0b1224', '#1a2448'];
export const CANDLE = '#ffb45a', MOON = '#a9b8ff', WOOD = '#4a3424', WOOD2 = '#6a4a30';
const NIGHT = ['#060a18', '#0b1428', '#1c2650'], DUSK = ['#141a3a', '#4a3a6a', '#c0706a', '#f0b07a'];
const M = () => mood('night');

// ---------- adereços ----------
export function candle(g, x, y, t, s = 1, seed = 0) {
  rr(g, x - 9 * s, y - 60 * s, 18 * s, 60 * s, 3 * s); g.fillStyle = '#e8dcc0'; g.fill();
  const f = 1 + 0.1 * Math.sin(t * 13 + seed) + 0.06 * Math.sin(t * 7.3 + seed);
  glow(g, x, y - 70 * s, 140 * s * f, CANDLE, 0.4);
  g.fillStyle = '#ffd890'; g.beginPath(); g.ellipse(x, y - 74 * s, 7 * s, 15 * s * f, 0, 0, 7); g.fill();
  g.fillStyle = '#fff4d8'; g.beginPath(); g.ellipse(x, y - 70 * s, 3 * s, 7 * s, 0, 0, 7); g.fill();
}
export function lantern(g, x, y, t, s = 1, on = 1) {
  seg(g, [[x, y - 70 * s], [x, y - 90 * s]], 4 * s, '#2a2218');
  rr(g, x - 22 * s, y - 72 * s, 44 * s, 70 * s, 6 * s); g.fillStyle = alpha('#ffcf7a', 0.25 + 0.6 * on); g.fill(); g.strokeStyle = '#2a2218'; g.lineWidth = 4 * s; g.stroke();
  if (on > 0) { glow(g, x, y - 36 * s, 260 * s * (1 + 0.05 * Math.sin(t * 9)), CANDLE, 0.45 * on); g.fillStyle = '#fff1c8'; g.beginPath(); g.ellipse(x, y - 36 * s, 6 * s, 12 * s, 0, 0, 7); g.fill(); }
}
// sino (balanço = ângulo em rad)
export function bell(g, x, y, s = 1, swing = 0, c = '#c8a050') {
  g.save(); g.translate(x, y); g.rotate(swing);
  g.fillStyle = shade(c, -0.25); g.beginPath(); g.moveTo(-34 * s, 60 * s); g.quadraticCurveTo(-30 * s, 0, 0, -6 * s); g.quadraticCurveTo(30 * s, 0, 34 * s, 60 * s); g.closePath(); g.fill();
  g.fillStyle = c; g.beginPath(); g.moveTo(-28 * s, 56 * s); g.quadraticCurveTo(-24 * s, 4 * s, 0, 0); g.quadraticCurveTo(6 * s, 10 * s, 4 * s, 56 * s); g.closePath(); g.fill();
  g.fillStyle = shade(c, -0.4); g.fillRect(-38 * s, 56 * s, 76 * s, 8 * s);
  circle(g, 0, 70 * s, 8 * s, shade(c, -0.5)); ring(g, 0, -10 * s, 8 * s, 4 * s, shade(c, -0.4));
  g.restore();
}
// ondas de som saindo do sino
export function ringWaves(g, x, y, t, t0, c = '#f2c46a', n = 3) {
  for (let i = 0; i < n; i++) { const k = (t - t0 - i * 0.22); if (k < 0 || k > 0.9) continue; const f = k / 0.9; g.save(); g.globalAlpha = 1 - f; g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); g.arc(x, y, 50 + f * 220, -2.6, -0.54); g.stroke(); g.restore(); }
}
export function gravestone(g, x, y, s = 1, c = '#3a4058', kind = 0) {
  if (kind === 1) { g.fillStyle = c; g.fillRect(x - 8 * s, y - 150 * s, 16 * s, 150 * s); g.fillRect(x - 46 * s, y - 118 * s, 92 * s, 16 * s); return; }
  g.fillStyle = c; g.beginPath(); g.moveTo(x - 44 * s, y); g.lineTo(x - 44 * s, y - 90 * s); g.arc(x, y - 90 * s, 44 * s, Math.PI, 0); g.lineTo(x + 44 * s, y); g.fill();
  g.fillStyle = alpha('#000', 0.25); g.fillRect(x - 26 * s, y - 100 * s, 52 * s, 6 * s); g.fillRect(x - 20 * s, y - 84 * s, 40 * s, 5 * s);
}
// caixão de lado (perfil retangular com tampa); w = comprimento
export function coffinSide(g, x, y, w, h, o = {}) {
  const c = o.color || WOOD, lid = o.lid ?? 0;
  g.fillStyle = shade(c, -0.25); g.fillRect(x, y - h, w, h);
  g.fillStyle = c; g.fillRect(x + 6, y - h + 6, w - 12, h - 12);
  g.fillStyle = shade(c, 0.12); g.save(); g.translate(x, y - h); g.rotate(-lid); g.fillRect(-6, -16, w + 12, 18); g.restore();
  g.fillStyle = shade(c, -0.4); for (const k of [0.2, 0.5, 0.8]) g.fillRect(x + w * k - 14, y - h * 0.55, 28, 8);
}
// caixão visto de cima (forma hexagonal clássica)
export function coffinTop(g, cx, cy, L, W, c = WOOD, o = {}) {
  const pts = [[cx - L / 2, cy - W * 0.32], [cx - L * 0.22, cy - W / 2], [cx + L / 2, cy - W * 0.36], [cx + L / 2, cy + W * 0.36], [cx - L * 0.22, cy + W / 2], [cx - L / 2, cy + W * 0.32]];
  poly(g, pts, o.fill ?? c); g.strokeStyle = o.stroke ?? shade(c, 0.3); g.lineWidth = o.w ?? 4; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.closePath(); g.stroke();
  return pts;
}
// fole
export function bellows(g, x, y, s = 1, squeeze = 0) {
  const h = 40 * s * (1 - 0.5 * squeeze);
  poly(g, [[x - 70 * s, y - h], [x + 40 * s, y - h * 0.6], [x + 40 * s, y + h * 0.6], [x - 70 * s, y + h]], '#6a3a24');
  g.strokeStyle = '#3a2014'; g.lineWidth = 3 * s; for (let i = 1; i < 5; i++) { const xx = x - 70 * s + i * 22 * s; g.beginPath(); g.moveTo(xx, y - h * (1 - i * 0.08)); g.lineTo(xx, y + h * (1 - i * 0.08)); g.stroke(); }
  seg(g, [[x + 40 * s, y], [x + 80 * s, y]], 8 * s, '#8a7a6a'); seg(g, [[x - 70 * s, y - h], [x - 130 * s, y - h - 20 * s]], 7 * s, '#4a2a18'); seg(g, [[x - 70 * s, y + h], [x - 130 * s, y + h + 20 * s]], 7 * s, '#4a2a18');
}
export function shovel(g, x, y, ang, s = 1) {
  g.save(); g.translate(x, y); g.rotate(ang); seg(g, [[0, 0], [0, 180 * s]], 7 * s, '#4a3424'); poly(g, [[-22 * s, 180 * s], [22 * s, 180 * s], [18 * s, 230 * s], [0, 244 * s], [-18 * s, 230 * s]], '#7a8088'); g.restore();
}

// ---------- rua europeia, 1830 (o.time 'dusk' | 'night') ----------
function casaRua(g, x, y, w, h, c, r, lit) {
  g.fillStyle = c; g.fillRect(x, y - h, w, h); poly(g, [[x - 10, y - h], [x + w / 2, y - h - w * 0.45], [x + w + 10, y - h]], shade(c, -0.25));
  const cols = Math.max(2, Math.round(w / 90)), rows = Math.max(2, Math.round(h / 130));
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const wx = x + 22 + i * ((w - 44) / cols), wy = y - h + 40 + j * ((h - 80) / rows), on = r() < lit; g.fillStyle = on ? '#ffcf8a' : shade(c, -0.35); g.fillRect(wx, wy, 34, 54); if (on) glow(g, wx + 17, wy + 27, 60, CANDLE, 0.25); }
}
export function street(g, t, cam, o = {}) {
  const time = o.time || 'dusk', GY = ground(), CX = E.W / 2, sky = time === 'dusk' ? DUSK : NIGHT;
  layer(g, cam, 0.1, (g) => { backdrop(g, sky); if (time === 'night') FX.stars(g, t, { count: 120, area: [-300, 0, E.W + 600, E.H * 0.4] }); else FX.clouds(g, { y: E.H * 0.18, color: '#ffd0b0', a: 0.1 }); });
  layer(g, cam, 0.3, (g) => { const r = rng(4), c = mix(sky[1], '#05070c', 0.5); for (let i = -4; i < 12; i++) { const w = 120 + r() * 80, h = 380 + r() * 260; g.fillStyle = c; g.fillRect(i * 150 - 200, GY - 260 - h, w, h + 300); poly(g, [[i * 150 - 210, GY - 260 - h], [i * 150 - 200 + w / 2, GY - 330 - h], [i * 150 - 190 + w, GY - 260 - h]], c); } seg(g, [[CX + 300, GY - 1050], [CX + 300, GY - 740]], 14, c); poly(g, [[CX + 270, GY - 740], [CX + 330, GY - 740], [CX + 300, GY - 900]], c); });
  layer(g, cam, 0.55, (g) => { const r = rng(9); const cs = ['#2a2a40', '#33304a', '#262a3c', '#3a3048']; let x = -500; let i = 0; while (x < E.W + 500) { const w = 220 + r() * 120, h = 620 + r() * 300; casaRua(g, x, GY - 40, w, h, cs[i++ % 4], r, time === 'night' ? 0.25 : 0.12); x += w + 6; } });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 60, 0, GY + 700, ['#2a2836', '#0a0a10']); g.fillRect(-E.W, GY - 60, E.W * 3, E.H * 2);
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 2; for (let y = GY - 40; y < GY + 700; y += 34) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); for (let x = -E.W + ((y / 34) % 2) * 30; x < E.W * 2; x += 60) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 34); g.stroke(); } }
    FX.lampPost(g, CX - 380, GY + 60, 420, { light: CANDLE, a: 0.25 });
    FX.pool(g, CX - 340, GY + 70, 300, 50, CANDLE, 0.14);
  });
  return { GY, CX, sky };
}

// ---------- quarto à luz de vela (o.warm: família) ----------
export function bedroom(g, t, cam, o = {}) {
  const GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.3, (g) => {
    g.fillStyle = linGrad(g, 0, -200, 0, GY, ['#141a2c', '#1e2238']); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    g.strokeStyle = 'rgba(255,255,255,.035)'; g.lineWidth = 3; for (let x = -E.W; x < E.W * 2; x += 46) { g.beginPath(); g.moveTo(x, -E.H); g.lineTo(x, GY); g.stroke(); }
    // janela com lua
    const wx = CX + 170, wy = GY - 980; g.fillStyle = '#0c1430'; g.fillRect(wx, wy, 260, 380); FX.moon(g, wx + 180, wy + 90, 26); FX.stars(g, t, { count: 20, area: [wx, wy, 260, 380], seed: 3 });
    g.strokeStyle = '#3a3040'; g.lineWidth = 14; g.strokeRect(wx, wy, 260, 380); seg(g, [[wx + 130, wy], [wx + 130, wy + 380]], 8, '#3a3040'); seg(g, [[wx, wy + 190], [wx + 260, wy + 190]], 8, '#3a3040');
    FX.lightCone(g, wx + 130, wy + 200, { angle: Math.PI * 0.65, spread: 0.35, len: 1300, color: MOON, a: 0.07 });
    // quadro na parede
    rr(g, CX - 420, GY - 900, 200, 260, 8); g.fillStyle = '#4a3a28'; g.fill(); rr(g, CX - 404, GY - 884, 168, 228, 4); g.fillStyle = '#2a2a3a'; g.fill();
  });
  layer(g, cam, 0.8, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, ['#2a2230', '#0a080c']); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 2; for (let y = GY + 20; y < GY + 700; y += 40) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); } });
  return { GY, CX };
}
// cama do século 19, com você deitado (opcional)
export function bed1830(g, x, y, w = 560, o = {}) {
  g.fillStyle = '#3a2a1e'; g.fillRect(x - 20, y - 260, 26, 260); g.fillRect(x + w - 6, y - 180, 26, 180);
  g.fillStyle = '#4a3624'; g.fillRect(x, y - 110, w, 50);
  g.fillStyle = '#d8d0c0'; rr(g, x + 6, y - 150, w - 12, 50, 18); g.fill();
  g.fillStyle = '#e8e2d4'; rr(g, x + 14, y - 196, 150, 56, 22); g.fill();
}

// ---------- cemitério à noite ----------
export function cemetery(g, t, cam, o = {}) {
  const GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, NIGHT); FX.stars(g, t, { count: 170, area: [-300, 0, E.W + 600, E.H * 0.5] }); FX.moon(g, CX + 280, 330, 48); });
  layer(g, cam, 0.25, (g) => { const c = '#0b1020'; FX.hills(g, { y: GY - 330, amp: 50, color: c, seed: 4 });
    // igreja
    const ix = CX - 330, iy = GY - 300; g.fillStyle = c; g.fillRect(ix, iy - 260, 300, 300); poly(g, [[ix - 20, iy - 260], [ix + 150, iy - 400], [ix + 320, iy - 260]], c); g.fillRect(ix + 210, iy - 560, 90, 320); poly(g, [[ix + 200, iy - 560], [ix + 255, iy - 720], [ix + 310, iy - 560]], c); seg(g, [[ix + 255, iy - 720], [ix + 255, iy - 780]], 6, c); seg(g, [[ix + 236, iy - 760], [ix + 274, iy - 760]], 6, c);
    g.fillStyle = alpha(CANDLE, 0.5); g.fillRect(ix + 60, iy - 180, 26, 60); g.fillRect(ix + 120, iy - 180, 26, 60); });
  FX.fog(g, GY - 380, 260, '#4a5a8a', 0.24);
  layer(g, cam, 0.5, (g) => { const r = rng(12); for (let i = 0; i < 18; i++) { const x = -400 + i * 110 + r() * 40, s = 0.55 + r() * 0.2; gravestone(g, x, GY - 170 - r() * 30, s, '#262c44', r() < 0.4 ? 1 : 0); }
    for (const x of [-260, 1240]) FX.tree(g, x, GY - 150, 3.2, '#0a0e1a'); });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 120, 0, GY + 600, ['#151a26', '#05070c']); g.fillRect(-E.W, GY - 120, E.W * 3, E.H * 2);
    const r = rng(5); for (let i = 0; i < 7; i++) { const x = -300 + i * 300 + r() * 80; if (o.clear && Math.abs(x - CX) < 260) continue; gravestone(g, x, GY + 20 + r() * 40, 1.1 + r() * 0.3, '#323a56', r() < 0.3 ? 1 : 0); g.fillStyle = alpha(MOON, 0.25); g.fillRect(x + 36, GY - 80, 6, 90); }
    FX.pool(g, CX + 120, GY + 40, 420, 60, MOON, 0.1);
  });
  return { GY, CX };
}

// ---------- corte do subsolo: superfície em sy, caixão em cy ----------
export function underground(g, t, cam, o = {}) {
  const CX = E.W / 2, sy = o.sy ?? 520, cy = o.cy ?? 1350;
  layer(g, cam, 0.15, (g) => { backdrop(g, NIGHT); FX.stars(g, t, { count: 80, area: [-300, -E.H, E.W + 600, sy + E.H] }); FX.moon(g, CX + 300, sy - 330, 36); });
  layer(g, cam, 0.5, (g) => { for (const x of [-120, 1150]) FX.tree(g, x, sy, 2.4, '#0a0e1a'); gravestone(g, CX - 380, sy, 0.8, '#262c44'); gravestone(g, CX + 380, sy, 0.7, '#262c44', 1); });
  layer(g, cam, 1, (g) => {
    const layers = [['#3a2c22', 0], ['#33261c', 160], ['#2a2018', 420], ['#211912', 760], ['#1a140e', 1100]];
    layers.forEach(([c, d], i) => { g.fillStyle = c; g.beginPath(); g.moveTo(-E.W, sy + d); for (let x = -E.W; x <= E.W * 2; x += 80) g.lineTo(x, sy + d + Math.sin(x * 0.01 + i) * 14); g.lineTo(E.W * 2, E.H * 3); g.lineTo(-E.W, E.H * 3); g.fill(); });
    const r = rng(21); for (let i = 0; i < 70; i++) { const x = -200 + r() * (E.W + 400), y = sy + 40 + r() * 1800; g.fillStyle = alpha('#5a4a3a', 0.6); g.beginPath(); g.ellipse(x, y, 8 + r() * 22, 6 + r() * 12, r() * 3, 0, 7); g.fill(); }
    g.strokeStyle = alpha('#4a3a28', 0.8); g.lineWidth = 4; for (let i = 0; i < 6; i++) { const x = r() * E.W; g.beginPath(); g.moveTo(x, sy + 10); for (let k = 1; k < 6; k++) g.lineTo(x + (r() - 0.5) * 80, sy + 10 + k * 40); g.stroke(); }
    // grama, monte da cova e cruz
    g.fillStyle = '#0e1a14'; g.fillRect(-E.W, sy - 14, E.W * 3, 22);
    g.fillStyle = '#4a382a'; g.beginPath(); g.ellipse(CX, sy, 320, 40, 0, Math.PI, 0); g.fill();
    if (o.cross !== false) { gravestone(g, CX - 230, sy - 20, 0.9, '#3a4058', 1); }
    // cova escavada (contorno do buraco preenchido)
    g.strokeStyle = alpha('#000', 0.25); g.setLineDash([12, 10]); g.lineWidth = 3; g.strokeRect(CX - 300, sy, 600, cy - sy + 30); g.setLineDash([]);
    coffinSide(g, CX - 270, cy, 540, 150, { lid: o.lid ?? 0 });
  });
  return { CX, sy, cy };
}

// ---------- dentro do caixão (close, escuro) ----------
export function coffinInside(g, t, cam, o = {}) {
  const CX = E.W / 2, light = o.light ?? 0.15;
  layer(g, cam, 0.6, (g) => {
    g.fillStyle = '#0a0806'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = -6; i < 14; i++) { const y = 260 + i * 120; g.fillStyle = i % 2 ? '#1c140e' : '#22180f'; g.fillRect(-E.W, y, E.W * 3, 116); g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(-E.W, y + 114, E.W * 3, 6); }
    g.fillStyle = 'rgba(255,220,180,.06)'; for (let i = -6; i < 14; i++) for (const x of [140, 940]) circle(g, x, 318 + i * 120, 6, '#3a3028');
    g.fillStyle = radGrad(g, CX, E.H * 0.55, 0, E.W, [alpha('#ffb070', 0.18 * light / 0.15), 'rgba(0,0,0,0)']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  });
  return { CX };
}

// ---------- casa de espera (Munique) ----------
export function mortuary(g, t, cam, o = {}) {
  const GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.3, (g) => {
    g.fillStyle = linGrad(g, 0, -300, 0, GY, ['#10162a', '#1a2038']); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    for (let i = -2; i < 5; i++) { const x = CX - 520 + i * 360, y = GY - 1100; g.fillStyle = '#0c1430'; g.beginPath(); g.moveTo(x, y + 420); g.lineTo(x, y + 120); g.arc(x + 90, y + 120, 90, Math.PI, 0); g.lineTo(x + 180, y + 420); g.fill(); g.strokeStyle = '#2a2a40'; g.lineWidth = 10; g.stroke(); FX.lightCone(g, x + 90, y + 260, { angle: Math.PI * 0.6, spread: 0.3, len: 1100, color: MOON, a: 0.06 }); }
    for (let i = -3; i < 6; i++) { const x = CX - 700 + i * 360; g.fillStyle = '#141a2e'; g.fillRect(x, -E.H, 40, GY + E.H); }
  });
  layer(g, cam, 0.8, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, ['#22222c', '#08080c']); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); g.strokeStyle = 'rgba(255,255,255,.04)'; g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 90) { g.beginPath(); g.moveTo(x, GY); g.lineTo(CX + (x - CX) * 2.4, GY + 700); g.stroke(); } });
  return { GY, CX };
}
// maca com corpo coberto por lençol (vista lateral), cordão do dedo até o alto
export function stretcher(g, x, y, s = 1, o = {}) {
  g.fillStyle = '#2a2a34'; g.fillRect(x - 130 * s, y - 70 * s, 260 * s, 14 * s); for (const dx of [-120, 110]) g.fillRect(x + dx * s, y - 60 * s, 10 * s, 60 * s);
  g.fillStyle = o.sheet || '#cfcfd8'; g.beginPath(); g.moveTo(x - 128 * s, y - 70 * s); g.quadraticCurveTo(x - 110 * s, y - 112 * s, x - 70 * s, y - 104 * s); g.quadraticCurveTo(x, y - 96 * s, x + 50 * s, y - 100 * s * (o.swell ?? 1)); g.quadraticCurveTo(x + 110 * s, y - 104 * s, x + 128 * s, y - 70 * s); g.fill();
  if (o.cord !== false) { g.strokeStyle = alpha('#f2c46a', 0.7); g.lineWidth = 2 * s; g.beginPath(); g.moveTo(x - 20 * s, y - 100 * s); g.lineTo(x - 20 * s + (o.cdx ?? 0), y - (o.ch ?? 600) * s); g.stroke(); }
}

// ---------- ringue de boxe ----------
export function boxingRing(g, t, cam) {
  const GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.2, (g) => { g.fillStyle = '#07080e'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.crowd ? 0 : 0; for (let i = 0; i < 60; i++) { const r = rng(i + 3); circle(g, -300 + r() * (E.W + 600), GY - 420 + r() * 200, 26 + r() * 10, '#10121c'); } });
  layer(g, cam, 0.5, (g) => { FX.lightCone(g, CX, -100, { angle: Math.PI / 2, spread: 0.55, len: GY + 200, color: '#fff0d0', a: 0.12 }); });
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = '#3a3a5a'; g.fillRect(-E.W, GY - 40, E.W * 3, 90); g.fillStyle = '#1a1a2a'; g.fillRect(-E.W, GY + 50, E.W * 3, E.H);
    for (let i = 0; i < 3; i++) seg(g, [[-E.W, GY - 170 - i * 90], [E.W * 2, GY - 170 - i * 90]], 7, ['#c03a30', '#e8e0d0', '#2a5aa0'][i]);
    for (const x of [60, E.W - 60]) { g.fillStyle = '#c8c8d0'; g.fillRect(x - 14, GY - 420, 28, 400); }
  });
  return { GY, CX };
}
