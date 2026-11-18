// sets/world.js — prisão suíça (corredor, cela rosa, cela branca), laboratório de 1979, prisão naval em Seattle, vestiário rosa.
import { E, V, S, layer, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, backdrop, lerp, clamp, ease, prog } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { ground } from './common.js';

export const ROSA = '#ff7eb6', ROSA_CL = '#ffb3d4', ROSA_ES = '#d8558f', FRIO = '#a9c4ff', LAMP = '#ffd59a';
const NIGHT = ['#060a18', '#0b1428', '#1c2650'];

// porta de cela (aço com visor); open 0..1 desliza para a esquerda; light = cor que vaza
export function portaCela(g, x, y, w, h, o = {}) {
  const open = o.open ?? 0, light = o.light;
  g.fillStyle = '#0a0c12'; g.fillRect(x, y - h, w, h);
  if (open > 0 && light) { g.fillStyle = light; g.fillRect(x + w * (1 - open), y - h, w * open, h); glow(g, x + w * (1 - open * 0.5), y - h / 2, 300 + 500 * open, light, 0.5 * open); }
  const dx = -w * open; g.fillStyle = '#4a5468'; g.fillRect(x + dx, y - h, w, h); g.fillStyle = '#5a6478'; g.fillRect(x + dx + 10, y - h + 10, w - 20, h - 20);
  g.fillStyle = '#1a1e28'; g.fillRect(x + dx + w * 0.3, y - h * 0.78, w * 0.4, h * 0.12); for (let i = 1; i < 4; i++) g.fillRect(x + dx + w * 0.3 + i * w * 0.1, y - h * 0.78, 3, h * 0.12);
  circle(g, x + dx + w * 0.85, y - h * 0.48, 9, '#2a2e38'); g.fillStyle = 'rgba(0,0,0,.25)'; for (const k of [0.2, 0.8]) g.fillRect(x + dx, y - h * k, w, 6);
}
// corredor da prisão (frio, lâmpadas no teto); o.portaRosa: abertura da porta central
export function corredor(g, t, cam, o = {}) {
  const GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.2, (g) => { g.fillStyle = linGrad(g, 0, -300, 0, GY, ['#10141e', '#1c2232']); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H); });
  layer(g, cam, 0.45, (g) => { for (let i = -4; i < 8; i++) { const x = CX - 700 + i * 260; g.fillStyle = '#161b28'; g.fillRect(x, -E.H, 16, GY + E.H); } for (let i = -3; i < 6; i++) { const x = CX - 600 + i * 380; rr(g, x - 60, 120, 120, 16, 6); g.fillStyle = '#e8f0ff'; g.fill(); FX.lightCone(g, x, 136, { angle: Math.PI / 2, spread: 0.55, len: GY - 100, color: '#dfe8ff', a: 0.06 }); } });
  layer(g, cam, 0.7, (g) => { for (let i = -3; i < 6; i++) { const x = CX - 640 + i * 420; if (o.portaRosa != null && i === 1) continue; portaCela(g, x, GY - 10, 220, 520); } if (o.portaRosa != null) portaCela(g, CX - 220 + 0, GY - 10, 220 + 220, 620, { open: o.portaRosa, light: ROSA }); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY - 10, 0, GY + 600, ['#2a2e3a', '#0a0b10']); g.fillRect(-E.W, GY - 10, E.W * 3, E.H * 2); g.strokeStyle = 'rgba(255,255,255,.04)'; g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 120) { g.beginPath(); g.moveTo(x, GY); g.lineTo(CX + (x - CX) * 2.2, GY + 700); g.stroke(); } if (o.portaRosa) FX.pool(g, CX, GY + 80, 520 * o.portaRosa, 90, ROSA, 0.3 * o.portaRosa); });
  return { GY, CX };
}
// cela (rosa ou branca/cinza), vista de frente: parede do fundo, teto, chão, banco de concreto
export function cela(g, t, cam, o = {}) {
  const GY = ground(), CX = E.W / 2, rosa = o.cor !== 'branca', p = o.pint ?? 1;
  const wall = rosa ? mix('#cfd4dc', ROSA, p) : '#d8dce4', floor = rosa ? mix('#6a6e78', ROSA_ES, p) : '#6a6e78', ceil = rosa ? mix('#e8ecf2', ROSA_CL, p) : '#eef0f4';
  layer(g, cam, 0.3, (g) => {
    g.fillStyle = wall; g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    g.fillStyle = shade(wall, -0.12); poly(g, [[-E.W, -E.H], [CX - 360, 300], [CX + 360, 300], [E.W * 2, -E.H]], ceil);
    g.fillStyle = shade(wall, -0.18); poly(g, [[-E.W, -E.H], [CX - 360, 300], [CX - 360, GY - 200], [-E.W, E.H * 2]], shade(wall, -0.16)); poly(g, [[E.W * 2, -E.H], [CX + 360, 300], [CX + 360, GY - 200], [E.W * 2, E.H * 2]], shade(wall, -0.1));
    rr(g, CX - 70, 360, 140, 30, 10); g.fillStyle = '#ffffff'; g.fill(); glow(g, CX, 380, 500, rosa ? ROSA_CL : '#ffffff', 0.35);
    g.fillStyle = shade(wall, -0.06); g.fillRect(CX - 360, 300, 720, GY - 500);
    g.fillStyle = shade(wall, -0.22); g.fillRect(CX - 300, GY - 330, 600, 70);
  });
  layer(g, cam, 0.8, (g) => { g.fillStyle = floor; poly(g, [[CX - 360, GY - 200], [CX + 360, GY - 200], [E.W * 2, E.H * 2], [-E.W, E.H * 2]], floor); g.fillStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < 8; i++) g.fillRect(-E.W, GY - 180 + i * i * 14, E.W * 3, 2); });
  return { GY, CX, wall };
}
// laboratório 1979 (luz de lâmpada quente, painel de madeira)
export function lab1979(g, t, cam, o = {}) {
  const GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.3, (g) => { g.fillStyle = linGrad(g, 0, -300, 0, GY, ['#1a1612', '#2a2218']); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H); g.fillStyle = '#3a2c1e'; g.fillRect(-E.W, GY - 500, E.W * 3, 500); for (let x = -E.W; x < E.W * 2; x += 70) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x, GY - 500, 4, 500); } FX.lightCone(g, CX + 120, -40, { angle: Math.PI / 2, spread: 0.5, len: GY + 100, color: LAMP, a: 0.1 }); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 600, ['#3a3028', '#0c0a08']); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); });
  return { GY, CX };
}
// cartaz colorido num cavalete
export function cartaz(g, x, y, s, cor) { seg(g, [[x - 60 * s, y], [x - 10 * s, y - 420 * s]], 8 * s, '#4a3424'); seg(g, [[x + 60 * s, y], [x + 10 * s, y - 420 * s]], 8 * s, '#4a3424'); rr(g, x - 130 * s, y - 470 * s, 260 * s, 300 * s, 6 * s); g.fillStyle = '#efe8dc'; g.fill(); rr(g, x - 112 * s, y - 452 * s, 224 * s, 264 * s, 4 * s); g.fillStyle = cor; g.fill(); }
// prisão naval em Seattle, à noite, perto da água
export function naval(g, t, cam) {
  const GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, NIGHT); FX.stars(g, t, { count: 140, area: [-300, 0, E.W + 600, E.H * 0.45] }); FX.moon(g, CX + 300, 320, 40); });
  layer(g, cam, 0.25, (g) => { const c = '#0c1222'; for (let i = 0; i < 9; i++) { const x = -300 + i * 200, h = 300 + (i * 97) % 260; g.fillStyle = c; g.fillRect(x, GY - 380 - h, 140, h); } FX.hills(g, { y: GY - 380, amp: 30, color: '#0a0e1c', seed: 3 }); });
  layer(g, cam, 0.5, (g) => { g.fillStyle = '#1a2032'; g.fillRect(CX - 460, GY - 620, 920, 560); g.fillStyle = '#141a2a'; g.fillRect(CX - 480, GY - 640, 960, 40); for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) { g.fillStyle = (i + j) % 3 === 0 ? '#ffd59a' : '#0c101a'; g.fillRect(CX - 400 + i * 140, GY - 560 + j * 150, 50, 80); for (let k = 0; k < 4; k++) g.fillRect(CX - 400 + i * 140 + k * 14, GY - 560 + j * 150, 3, 80); } seg(g, [[CX + 420, GY - 640], [CX + 420, GY - 900]], 6, '#2a3040'); const wv = Math.sin(t * 2) * 10; poly(g, [[CX + 423, GY - 900], [CX + 540, GY - 880 + wv], [CX + 423, GY - 840]], '#5a6a90'); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = linGrad(g, 0, GY - 60, 0, GY + 600, ['#0e1830', '#05070e']); g.fillRect(-E.W, GY - 60, E.W * 3, E.H * 2); for (let i = 0; i < 18; i++) { const y = GY + i * 30, a = 0.08 + 0.05 * Math.sin(t * 2 + i); g.fillStyle = `rgba(169,196,255,${a})`; g.fillRect(CX + 200 + Math.sin(i * 3) * 60, y, 140 + i * 10, 3); } });
  return { GY, CX };
}
// vestiário (o.rosa 0..1)
export function vestiario(g, t, cam, o = {}) {
  const GY = ground(), CX = E.W / 2, k = o.rosa ?? 1, wall = mix('#5a6478', ROSA, k), lock = mix('#3a4458', ROSA_ES, k);
  layer(g, cam, 0.3, (g) => { g.fillStyle = wall; g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H); for (let i = -5; i < 12; i++) { const x = i * 130 - 200; g.fillStyle = lock; g.fillRect(x, GY - 760, 120, 740); g.fillStyle = shade(lock, -0.2); for (let j = 0; j < 6; j++) g.fillRect(x + 30, GY - 720 + j * 14, 60, 5); circle(g, x + 100, GY - 400, 6, shade(lock, 0.3)); } FX.lightCone(g, CX, -60, { angle: Math.PI / 2, spread: 0.6, len: GY + 100, color: '#fff2f8', a: 0.08 }); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = mix('#2a2e3a', ROSA_ES, k * 0.8); g.fillRect(-E.W, GY, E.W * 3, E.H * 2); g.fillStyle = mix('#7a6a5a', '#b06a8a', k); g.fillRect(-E.W, GY + 40, E.W * 3, 40); g.fillStyle = shade(mix('#7a6a5a', '#b06a8a', k), -0.3); for (let x = -E.W; x < E.W * 2; x += 300) g.fillRect(x, GY + 80, 20, 120); });
  return { GY, CX };
}
// mictório (rosa)
export function mictorio(g, x, y, s, cor = ROSA) { rr(g, x - 60 * s, y - 260 * s, 120 * s, 220 * s, 50 * s); g.fillStyle = cor; g.fill(); rr(g, x - 40 * s, y - 200 * s, 80 * s, 140 * s, 36 * s); g.fillStyle = shade(cor, -0.18); g.fill(); seg(g, [[x, y - 260 * s], [x, y - 340 * s]], 8 * s, '#c8ccd4'); }
