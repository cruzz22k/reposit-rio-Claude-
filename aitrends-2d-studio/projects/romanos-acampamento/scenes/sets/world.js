// sets/world.js — Germânia, ano 15: floresta, pântano, o acampamento romano (fora, dentro, portão, alto do muro), a vala.
// Ilustração 2D plana em camadas com parallax; paleta fria (azul-marinho), luz de tochas como acento quente.
import { E, V, S, mood, layer, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, backdrop, lerp, clamp, noise } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { ground } from './common.js';

export const NAVY = ['#070b18', '#0b1224', '#1a2448'];
const TORCH = '#ffb45a';
// céu por hora do dia
function skyFor(time) {
  if (time === 'dawn') return ['#1a2048', '#6a4a7a', '#e08a5a', '#f6c48a'];
  if (time === 'dusk') return ['#141a3a', '#4a3a6a', '#c0706a', '#f0b07a'];
  return ['#060a18', '#0b1428', '#1c2650'];
}
export const moodFor = (time) => mood(time === 'dawn' || time === 'dusk' ? 'dusk' : 'night');

// ---------- adereços ----------
export function torch(g, x, y, t, s = 1, seed = 0) {
  seg(g, [[x, y], [x, y - 70 * s]], 6 * s, '#2a1a12');
  const fl = 1 + 0.12 * Math.sin(t * 13 + seed) + 0.08 * Math.sin(t * 7 + seed * 2);
  g.fillStyle = '#ffcf7a'; g.beginPath(); g.ellipse(x, y - 82 * s, 9 * s * fl, 18 * s * fl, Math.sin(t * 5 + seed) * 0.15, 0, 7); g.fill();
  glow(g, x, y - 82 * s, 150 * s * fl, TORCH, 0.6);
}
export function spear(g, x0, y0, ang, len, c = '#2a1e16', tip = '#b8c0c8') {
  const x1 = x0 + Math.cos(ang) * len, y1 = y0 + Math.sin(ang) * len;
  seg(g, [[x0, y0], [x1, y1]], 5, c); poly(g, [[x1 + Math.cos(ang) * 30, y1 + Math.sin(ang) * 30], [x1 + Math.cos(ang + 1.6) * 7, y1 + Math.sin(ang + 1.6) * 7], [x1 + Math.cos(ang - 1.6) * 7, y1 + Math.sin(ang - 1.6) * 7]], tip);
}
export function shield(g, x, y, s = 1, c = '#8a3a34', facing = 1) {   // escudo retangular curvo (scutum)
  g.save(); g.translate(x, y); g.scale(facing * s, s);
  rr(g, -22, -56, 44, 112, 10); g.fillStyle = shade(c, -0.25); g.fill(); rr(g, -18, -52, 36, 104, 8); g.fillStyle = c; g.fill();
  circle(g, 0, 0, 9, '#c8b070'); seg(g, [[0, -46], [0, 46]], 3, alpha('#c8b070', 0.7)); g.restore();
}
export function horse(g, x, y, s, ph, facing = 1, c = '#1a1416', rimC = null) {
  g.save(); g.translate(x, y); g.scale(facing * s, s);
  const leg = (bx, by, a) => { const kx = bx + Math.sin(a) * 18, ky = by + 38, fx = kx + Math.sin(a - 0.6) * 14, fy = by + 78; seg(g, [[bx, by], [kx, ky], [fx, fy]], 9, c); };
  leg(-48, -10, ph + Math.PI); leg(52, -10, ph);
  if (rimC) { g.fillStyle = rimC; g.beginPath(); g.ellipse(0, -36, 74, 34, 0, 0, 7); g.fill(); }
  g.fillStyle = c; g.beginPath(); g.ellipse(2, -34, 72, 32, 0, 0, 7); g.fill();
  poly(g, [[48, -56], [86, -112], [104, -104], [70, -34]], c);
  g.beginPath(); g.ellipse(104, -104, 26, 14, 0.5, 0, 7); g.fill(); poly(g, [[86, -118], [92, -132], [96, -116]], c);
  for (let i = 0; i < 4; i++) seg(g, [[54 + i * 9, -70 - i * 12], [46 + i * 9, -60 - i * 12 + Math.sin(ph + i) * 4]], 5, shade(c, 0.15));
  seg(g, [[-70, -40], [-96, -6 + Math.sin(ph * 2) * 6]], 9, shade(c, 0.1));
  leg(-60, -10, ph); leg(40, -10, ph + Math.PI);
  g.restore();
}
export function cornu(g, x, y, s, c = '#d8b050') {   // trombeta curva romana (cornu)
  g.save(); g.translate(x, y); g.scale(s, s);
  const a0 = Math.PI * 0.8, a1 = Math.PI * 2.05, R = 120;
  g.lineCap = 'round'; g.strokeStyle = shade(c, -0.35); g.lineWidth = 18; g.beginPath(); g.arc(0, 0, R, a0, a1); g.stroke();
  g.strokeStyle = c; g.lineWidth = 11; g.beginPath(); g.arc(0, 0, R, a0, a1); g.stroke();
  g.strokeStyle = 'rgba(255,240,200,.5)'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, R - 3, a0 + 0.2, a1 - 0.3); g.stroke();
  seg(g, [[Math.cos(a0) * R, Math.sin(a0) * R], [Math.cos(a0 + 0.9) * R * 0.2, Math.sin(a0 + 0.9) * R * 0.2]], 9, '#5a3a24');   // travessa de madeira
  const sx = Math.cos(a0) * R, sy = Math.sin(a0) * R; circle(g, sx - 6, sy - 8, 9, shade(c, -0.2));                         // bocal
  const ex = Math.cos(a1) * R, ey = Math.sin(a1) * R, tg = a1 + Math.PI / 2, nx = Math.cos(tg), ny = Math.sin(tg), px = -ny, py = nx, L = 90;
  g.fillStyle = c; g.beginPath(); g.moveTo(ex + px * 6, ey + py * 6); g.quadraticCurveTo(ex + nx * L * 0.7 + px * 10, ey + ny * L * 0.7 + py * 10, ex + nx * L + px * 46, ey + ny * L + py * 46); g.lineTo(ex + nx * L - px * 46, ey + ny * L - py * 46); g.quadraticCurveTo(ex + nx * L * 0.7 - px * 10, ey + ny * L * 0.7 - py * 10, ex - px * 6, ey - py * 6); g.fill();
  g.fillStyle = shade(c, -0.45); g.beginPath(); g.ellipse(ex + nx * L, ey + ny * L, 46, 14, Math.atan2(py, px), 0, 7); g.fill();
  g.restore();
  return [x + (ex + nx * (L + 20)) * s, y + (ey + ny * (L + 20)) * s];
}
export function tent(g, x, y, w, h, c = '#6a5a48', lit = 0) {
  poly(g, [[x - w / 2, y], [x, y - h], [x + w / 2, y]], shade(c, -0.15)); poly(g, [[x, y - h], [x + w / 2, y], [x + w * 0.1, y]], shade(c, -0.4));
  seg(g, [[x, y - h], [x, y]], 2, alpha('#000', 0.35));
  if (lit) { poly(g, [[x - w * 0.12, y], [x, y - h * 0.4], [x + w * 0.12, y]], alpha(TORCH, 0.8 * lit)); glow(g, x, y - h * 0.15, w * 0.6, TORCH, 0.25 * lit); }
}
export function stakes(g, x0, x1, y, h, c = '#3a2a1e', gap = 22) {
  for (let x = x0; x < x1; x += gap) poly(g, [[x - 7, y], [x - 7, y - h + 12], [x, y - h - (x * 7 % 13)], [x + 7, y - h + 12], [x + 7, y]], c);
  seg(g, [[x0, y - h * 0.45], [x1, y - h * 0.45]], 5, shade(c, -0.3));
}

// ---------- floresta (o.time: 'night' | 'dawn') ----------
export function forest(g, t, cam, o = {}) {
  const time = o.time || 'night', M = moodFor(time), GY = ground(), CX = E.W / 2, sky = skyFor(time);
  layer(g, cam, 0.1, (g) => { backdrop(g, sky); if (time === 'night') { FX.stars(g, t, { count: 160, area: [-300, 0, E.W + 600, E.H * 0.5] }); FX.moon(g, CX + 260, 300, 46); } else FX.sun(g, CX - 200, GY - 520, 50, '#fff3dc', '#ffb070', 4); });
  layer(g, cam, 0.25, (g) => { const c = mix(sky[1], '#04060c', 0.55); for (let i = 0; i < 26; i++) { const x = -600 + i * 95 + (i * 37) % 40, h = 520 + (i * 53) % 260; FX.pine(g, x, GY - 300, h / 220, c); } g.fillStyle = c; g.fillRect(-E.W, GY - 300, E.W * 3, 400); });
  FX.fog(g, GY - 420, 260, time === 'night' ? '#4a5a8a' : '#e0a080', 0.22);
  layer(g, cam, 0.5, (g) => {
    const r = rng(7), c = mix(sky[0], '#020308', 0.4), rimC = time === 'night' ? M.rim : '#ffb070';
    for (let i = 0; i < 12; i++) { const x = -700 + i * 220 + r() * 60, w = 40 + r() * 50; g.fillStyle = c; g.fillRect(x, -E.H, w, GY + E.H - 120); g.fillStyle = alpha(rimC, 0.35); g.fillRect(x + (time === 'night' ? w - 5 : 0), -E.H, 5, GY + E.H - 120); }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 140, 0, GY + 600, [mix(sky[1], '#0a0e14', 0.75), '#05070c']); g.fillRect(-E.W, GY - 140, E.W * 3, E.H * 2);
    const r = rng(3); for (let i = 0; i < 40; i++) { const x = -500 + r() * (E.W + 1000), y = GY - 130 + r() * 180; g.fillStyle = alpha('#0e1a16', 0.9); g.beginPath(); g.ellipse(x, y, 60 + r() * 60, 20 + r() * 14, 0, Math.PI, 0); g.fill(); }
    if (time === 'night') FX.pool(g, CX + 120, GY + 10, 380, 60, M.rim, 0.12);
  });
  return { GY, CX, M, sky };
}

// ---------- pântano (o.time: 'night' | 'dusk' | 'dawn') ----------
export function marsh(g, t, cam, o = {}) {
  const time = o.time || 'night', M = moodFor(time), GY = ground(), CX = E.W / 2, sky = skyFor(time);
  layer(g, cam, 0.1, (g) => { backdrop(g, sky); if (time === 'night') { FX.stars(g, t, { count: 120, area: [-300, 0, E.W + 600, E.H * 0.45] }); FX.moon(g, CX - 280, 330, 40); } else FX.sun(g, CX + 240, GY - 520, 56, '#fff3dc', '#ffb070', 4); });
  layer(g, cam, 0.22, (g) => { const c = mix(sky[1], '#04060c', 0.6); for (let i = 0; i < 30; i++) FX.pine(g, -600 + i * 80, GY - 360, 1.2 + (i * 7 % 5) * 0.2, c); g.fillStyle = c; g.fillRect(-E.W, GY - 362, E.W * 3, 40); });
  layer(g, cam, 0.45, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 330, 0, GY, [mix(sky[sky.length - 1], '#101828', 0.55), mix(sky[0], '#05080e', 0.6)]); g.fillRect(-E.W, GY - 330, E.W * 3, 340);
    const r = rng(11); for (let i = 0; i < 24; i++) { const x = -600 + r() * (E.W + 1200), y = GY - 300 + r() * 280, w = 80 + r() * 200; g.fillStyle = alpha('#0a120e', 0.85); g.beginPath(); g.ellipse(x, y, w, 10 + r() * 8, 0, 0, 7); g.fill(); }
    for (let i = 0; i < 60; i++) { const x = -600 + r() * (E.W + 1200), y = GY - 300 + r() * 300; seg(g, [[x, y], [x + (r() - 0.5) * 10, y - 30 - r() * 50]], 3, alpha('#0c1410', 0.9)); }
    const refl = time === 'night' ? '#cfd8ff' : '#ffc890'; g.fillStyle = alpha(refl, 0.12); for (let j = 0; j < 9; j++) g.fillRect(CX + (time === 'night' ? -280 : 240) - 40 + Math.sin(t * 2 + j) * 8, GY - 300 + j * 30, 80 - j * 6, 6);
  });
  FX.fog(g, GY - 380, 220, time === 'night' ? '#5a6a9a' : '#f0b090', 0.25);
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 40, 0, GY + 600, ['#14120e', '#07080a']); g.fillRect(-E.W, GY - 40, E.W * 3, E.H * 2); g.fillStyle = alpha('#2a2418', 0.6); for (let i = 0; i < 14; i++) { g.beginPath(); g.ellipse(-300 + i * 130, GY + 20 + (i % 3) * 30, 70, 12, 0, 0, 7); g.fill(); } });
  return { GY, CX, M, sky };
}

// ---------- o acampamento visto de fora (o.time, o.big: plano mais fechado, o.torches) ----------
export function campOutside(g, t, cam, o = {}) {
  const time = o.time || 'night', M = moodFor(time), GY = ground(), CX = E.W / 2, sky = skyFor(time);
  const base = GY - (o.big ? 160 : 300), sc = o.big ? 1.7 : 1;
  layer(g, cam, 0.1, (g) => { backdrop(g, sky); if (time === 'night') { FX.stars(g, t, { count: 160, area: [-300, 0, E.W + 600, E.H * 0.45] }); FX.moon(g, CX + 280, 290, 44); } else { FX.sun(g, CX - 240, o.sunY ?? (base - 330 * sc), 60, '#fff3dc', '#ffb070', 5); } });
  layer(g, cam, 0.2, (g) => { const c = mix(sky[1], '#04060c', 0.6); FX.hills(g, { y: base - 140 * sc, amp: 120, color: c, seed: 4, freq: 0.004 }); });
  layer(g, cam, 0.4, (g) => {
    const wall = time === 'night' ? '#2a2a34' : '#5a4a44', earth = time === 'night' ? '#1e1c22' : '#3a302a';
    // barracas atrás do muro
    for (let i = -6; i <= 6; i++) tent(g, CX + i * 90 * sc, base - 70 * sc, 70 * sc, 50 * sc, time === 'night' ? '#4a4450' : '#8a7a68', (i * 5 + 3) % 4 === 0 && time === 'night' ? 0.7 : 0);
    // muro de terra + paliçada
    g.fillStyle = earth; g.beginPath(); g.moveTo(-E.W, base + 10); g.lineTo(-E.W, base - 50 * sc); g.lineTo(E.W * 2, base - 50 * sc); g.lineTo(E.W * 2, base + 10); g.fill();
    stakes(g, -E.W, E.W * 2, base - 48 * sc, 46 * sc, wall, 14 * sc);
    // portão com torres
    for (const sx of [-1, 1]) { const x = CX + sx * 60 * sc; g.fillStyle = shade(wall, -0.2); g.fillRect(x - 18 * sc, base - 150 * sc, 36 * sc, 150 * sc); poly(g, [[x - 26 * sc, base - 150 * sc], [x, base - 175 * sc], [x + 26 * sc, base - 150 * sc]], shade(wall, -0.4)); }
    g.fillStyle = shade(wall, -0.35); g.fillRect(CX - 42 * sc, base - 92 * sc, 84 * sc, 92 * sc);
    // tochas na paliçada
    if (o.torches !== false) for (let i = -5; i <= 5; i++) torch(g, CX + i * 110 * sc + (i === 0 ? 0 : 0), base - 50 * sc, t, 0.55 * sc, i);
    // vala na frente
    g.fillStyle = '#05060a'; g.fillRect(-E.W, base + 6, E.W * 3, 18 * sc);
  });
  layer(g, cam, 0.7, (g) => {
    g.fillStyle = linGrad(g, 0, base + 20, 0, GY + 600, [mix(sky[1], '#0a0e14', 0.75), '#05070c']); g.fillRect(-E.W, base + 20 * sc, E.W * 3, E.H * 2);
    const r = rng(5); for (let i = 0; i < 50; i++) { const x = -500 + r() * (E.W + 1000), y = base + 40 + r() * 600; seg(g, [[x, y], [x + (r() - 0.5) * 12, y - 20 - r() * 40]], 3, alpha('#0c1410', 0.9)); }
    if (time === 'night') FX.pool(g, CX, base + 60, 500, 40, TORCH, 0.12);
  });
  FX.fog(g, base - 40, 160, time === 'night' ? '#4a5a8a' : '#f0b090', 0.18);
  return { GY, CX, M, sky, base };
}

// ---------- dentro do acampamento: fileiras de barracas, tochas, paliçada ao fundo ----------
export function campInside(g, t, cam, o = {}) {
  const time = o.time || 'night', M = moodFor(time), GY = ground(), CX = E.W / 2, sky = skyFor(time);
  layer(g, cam, 0.1, (g) => { backdrop(g, sky); if (time === 'night') FX.stars(g, t, { count: 140, area: [-300, 0, E.W + 600, E.H * 0.4] }); });
  layer(g, cam, 0.3, (g) => { stakes(g, -E.W, E.W * 2, GY - 520, 90, time === 'night' ? '#1c1c26' : '#4a3e38', 18); g.fillStyle = time === 'night' ? '#14141c' : '#3a302a'; g.fillRect(-E.W, GY - 520, E.W * 3, 80); for (let i = -4; i <= 6; i++) torch(g, i * 230 + 80, GY - 520, t, 0.7, i); });
  layer(g, cam, 0.55, (g) => { for (let i = -5; i <= 7; i++) tent(g, i * 170 + 40, GY - 260, 150, 120, time === 'night' ? '#4a4450' : '#7a6a58', (i + 9) % 3 === 0 && time === 'night' ? 0.8 : 0); });
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 240, 0, GY + 600, [time === 'night' ? '#1a1820' : '#4a3e34', '#07070a']); g.fillRect(-E.W, GY - 240, E.W * 3, E.H * 2);
    for (let i = -3; i <= 4; i++) tent(g, i * 300 - 60, GY - 60, 240, 190, time === 'night' ? '#55505c' : '#8a7a68', (i + 7) % 2 === 0 && time === 'night' ? 1 : 0);
    if (time === 'night') FX.pool(g, CX, GY + 40, 520, 70, TORCH, 0.14);
  });
  return { GY, CX, M, sky };
}

// ---------- o portão, visto de dentro (o.open 0..1) ----------
export function gateInside(g, t, cam, o = {}) {
  const time = o.time || 'night', M = moodFor(time), GY = ground(), CX = E.W / 2, sky = skyFor(time), open = o.open ?? 0;
  layer(g, cam, 0.1, (g) => { backdrop(g, sky); if (time === 'night') FX.stars(g, t, { count: 140, area: [-300, 0, E.W + 600, E.H * 0.4] }); });
  layer(g, cam, 0.45, (g) => {
    const wood = time === 'night' ? '#241e1c' : '#4a3a2e';
    stakes(g, -E.W, CX - 230, GY - 120, 260, wood, 26); stakes(g, CX + 230, E.W * 2, GY - 120, 260, wood, 26);
    for (const sx of [-1, 1]) { const x = CX + sx * 270; g.fillStyle = shade(wood, -0.2); g.fillRect(x - 60, GY - 760, 120, 760); g.fillStyle = shade(wood, -0.4); g.fillRect(x - 80, GY - 780, 160, 40); torch(g, x, GY - 560, t, 1.2, sx * 3); }
    // vão do portão: lá fora, a névoa do pântano
    g.fillStyle = linGrad(g, 0, GY - 520, 0, GY, [mix(sky[1], '#203048', 0.5), '#0c1018']); g.fillRect(CX - 210, GY - 520, 420, 520);
    FX.fog(g, GY - 200, 200, '#5a6a9a', 0.3);
    // folhas do portão
    for (const sx of [-1, 1]) { const w = 210 * (1 - 0.85 * open); g.fillStyle = shade(wood, 0.05); g.fillRect(sx < 0 ? CX - 210 : CX + 210 - w, GY - 520, w, 520); for (let k = 1; k < 5; k++) { g.fillStyle = alpha('#000', 0.3); g.fillRect((sx < 0 ? CX - 210 : CX + 210 - w) + k * w / 5, GY - 520, 3, 520); } g.fillStyle = shade(wood, -0.3); g.fillRect(sx < 0 ? CX - 210 : CX + 210 - w, GY - 400, w, 16); }
    g.fillStyle = shade(wood, -0.3); g.fillRect(CX - 300, GY - 560, 600, 40);
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, [time === 'night' ? '#1e1a1c' : '#4a3e34', '#07070a']); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.25)', 0.12); if (time === 'night') FX.pool(g, CX, GY + 40, 520, 70, TORCH, 0.2); });
  return { GY, CX, M, sky };
}

// ---------- a vala em corte lateral (ataque ao amanhecer): campo à esquerda, vala no meio, muro à direita ----------
export function ditch(g, t, cam, o = {}) {
  const time = o.time || 'dawn', M = moodFor(time), GY = ground(), CX = E.W / 2, sky = skyFor(time);
  const field = GY - 380, bottom = GY + 40, wallTop = GY - 760;
  layer(g, cam, 0.1, (g) => { backdrop(g, sky); FX.sun(g, CX - 320, field - 380, 60, '#fff3dc', '#ffb070', 5); FX.clouds(g, { y: 200, h: 300, color: '#ffd0a0', a: 0.12, seed: 3 }); });
  layer(g, cam, 0.25, (g) => { const c = mix(sky[1], '#04060c', 0.6); for (let i = 0; i < 20; i++) FX.pine(g, -700 + i * 80, field - 10, 1.3 + (i * 7 % 5) * 0.15, c); });
  layer(g, cam, 0.9, (g) => {
    const earth = '#2a2220', wood = '#3a2c22';
    // perfil: campo -> vala em V -> muro de terra -> topo com estacas
    g.fillStyle = linGrad(g, 0, wallTop, 0, GY + 500, ['#3a2e28', '#14100e']);
    g.beginPath(); g.moveTo(-E.W, E.H * 2); g.lineTo(-E.W, field); g.lineTo(CX - 420, field); g.lineTo(CX - 120, bottom); g.lineTo(CX + 60, bottom); g.lineTo(CX + 280, field + 40); g.lineTo(CX + 330, wallTop); g.lineTo(E.W * 2, wallTop); g.lineTo(E.W * 2, E.H * 2); g.closePath(); g.fill();
    g.strokeStyle = alpha('#ffb070', 0.35); g.lineWidth = 4; g.beginPath(); g.moveTo(-E.W, field); g.lineTo(CX - 420, field); g.stroke(); g.beginPath(); g.moveTo(CX + 330, wallTop); g.lineTo(E.W * 2, wallTop); g.stroke();
    stakes(g, CX + 335, E.W * 2, wallTop, 120, wood, 28);
    // lama no fundo
    g.fillStyle = '#3a2a1c'; g.beginPath(); g.moveTo(CX - 200, bottom - 70); g.lineTo(CX + 110, bottom - 70); g.lineTo(CX + 60, bottom); g.lineTo(CX - 120, bottom); g.fill();
    g.fillStyle = alpha('#c8a070', 0.25); g.fillRect(CX - 196, bottom - 72, 300, 4);
  });
  return { GY, CX, M, sky, field, bottom, wallTop, mud: bottom - 70 };
}
// lama por cima das pernas (desenhar depois das figuras)
export function mudFront(g, cam, d) { layer(g, cam, 0.9, (g) => { g.fillStyle = '#3a2a1c'; g.fillRect(E.W / 2 - 230, d.mud + 6, 380, 64); g.fillStyle = alpha('#c8a070', 0.25); g.fillRect(E.W / 2 - 226, d.mud + 4, 370, 4); }); }

// ---------- no alto do muro olhando para dentro: passadiço embaixo, espaço vazio, barracas ao fundo ----------
export function wallTopView(g, t, cam, o = {}) {
  const time = o.time || 'dawn', M = moodFor(time), GY = ground(), CX = E.W / 2, sky = skyFor(time);
  layer(g, cam, 0.1, (g) => { backdrop(g, sky); FX.sun(g, CX + 300, GY - 900, 50, '#fff3dc', '#ffb070', 4); });
  layer(g, cam, 0.3, (g) => { for (let i = -6; i <= 8; i++) tent(g, i * 120, GY - 520, 100, 70, '#7a6a58', 0); g.fillStyle = '#3a302a'; g.fillRect(-E.W, GY - 520, E.W * 3, 10); });
  layer(g, cam, 0.55, (g) => { g.fillStyle = linGrad(g, 0, GY - 520, 0, GY - 100, ['#4a3e34', '#2a221e']); g.fillRect(-E.W, GY - 516, E.W * 3, 420); FX.floorLines(g, GY - 516, GY - 100, 'rgba(0,0,0,.15)', 0.15); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY - 100, 0, GY + 600, ['#2a2220', '#0a0808']); g.fillRect(-E.W, GY - 100, E.W * 3, E.H * 2); stakes(g, -E.W, E.W * 2, GY + 260, 160, '#2a1e16', 30); });
  return { GY, CX, M, sky };
}
