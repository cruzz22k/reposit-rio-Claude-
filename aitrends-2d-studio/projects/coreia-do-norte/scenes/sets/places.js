// sets/places.js — cenários reutilizáveis: berçário, sala da família, quarto, rua da vila, sala de aula, arrozal.
// Cada função desenha o cenário em camadas com parallax e devolve { GY, CX, M }. Personagens vão na profundidade 1.
import { E, V, S, mood, layer, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, backdrop, lerp, clamp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { portraitPair, ground } from './common.js';
import { LENCO } from '../cast.js';

// ---------- berçário (hospital) à noite ----------
export function crib(g, x, GY, s, M, baby = true) {
  const c = shade(M.wall, 0.35), w = 230 * s, h = 96 * s, top = GY - 190 * s;
  seg(g, [[x - w * 0.36, top + h], [x - w * 0.44, GY]], 9 * s, shade(c, -0.35)); seg(g, [[x + w * 0.36, top + h], [x + w * 0.44, GY]], 9 * s, shade(c, -0.35));
  seg(g, [[x - w * 0.44, GY - 30 * s], [x + w * 0.44, GY - 30 * s]], 6 * s, shade(c, -0.45));
  if (baby) {
    g.fillStyle = shade(S().ui.cream, -0.12); g.beginPath(); g.ellipse(x + 12 * s, top + 4 * s, 70 * s, 30 * s, 0, Math.PI, 0); g.fill();
    circle(g, x - 58 * s, top - 12 * s, 21 * s, M.rim); circle(g, x - 56 * s, top - 10 * s, 20 * s, S().ink);
  }
  rr(g, x - w / 2, top, w, h, 22 * s); g.fillStyle = linGrad(g, 0, top, 0, top + h, [c, shade(c, -0.4)]); g.fill();
  g.fillStyle = alpha(M.rim, 0.55); g.fillRect(x - w / 2 + 16 * s, top, w - 32 * s, 3 * s);
}
export function nursery(g, t, cam) {
  const M = mood('interiorCool'), GY = ground(), CX = E.W / 2;
  const wx = CX - V(520, 400), wy = GY - V(620, 900), ww = V(560, 520), wh = V(380, 560);
  layer(g, cam, 0.4, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [M.dark, shade(M.wall, -0.15)]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 3, rows: 2, frame: shade(M.wall, -0.55), bar: 12 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, mood('night').sky); g.fillRect(x, y, w, h);
      FX.stars(g, t, { count: 60, area: [x, y, w, h * 0.7] });
      FX.moon(g, x + w * 0.7, y + h * 0.26, 44);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.34, color: alpha(M.dark, 0.95), windowColor: alpha(M.practical, 0.25), lit: 0.06, seed: 4 });
    });
    glow(g, wx + ww / 2, wy + wh / 2, 620, M.key, 0.1);
    for (const i of [0, 1, 2]) { const x = CX + V(260, 140) + i * 150; rr(g, x, GY - V(560, 760), 110, 150, 6); g.fillStyle = shade(M.wall, 0.12); g.fill(); g.fillStyle = alpha(M.rim, 0.25); for (let k = 0; k < 4; k++) g.fillRect(x + 16, GY - V(560, 760) + 28 + k * 26, 78 - (k % 2) * 24, 6); }
  });
  layer(g, cam, 0.7, (g) => { for (const i of [-2, -1, 1, 2]) crib(g, CX + i * 330 + 60, GY - 50, 0.7, M, true); });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 50, 0, GY + 700, [shade(M.floor, 0.12), M.dark]); g.fillRect(-E.W, GY - 50, E.W * 3, E.H * 2);
    FX.floorLines(g, GY - 50, GY + 700, 'rgba(0,0,0,.22)', 0.07);
    FX.pool(g, CX - 120, GY + 30, 460, 90, M.key, 0.3);
  });
  FX.godRays(g, wx + ww * 0.6, wy + wh * 0.3, { count: 6, angle: Math.PI * 0.42, spread: 0.6, len: 1700, color: M.key, a: 0.07, t });
  return { GY, CX, M };
}

// ---------- a sala da família (o = { night, lamp, doorOpen, doorLight, window: 'night'|'day', portraits }) ----------
export function home(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), N = mood('night'), GY = ground(), CX = E.W / 2, night = !!o.night;
  const wall = night ? shade(M.wall, -0.45) : shade(M.wall, -0.1), floorC = night ? shade('#6a5236', -0.45) : '#6a5236';
  const bulb = [CX + 150, GY - 1010], lampOn = o.lamp !== false;
  layer(g, cam, 0.55, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(wall, -0.35), wall, shade(wall, -0.15)]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    // papel de parede listrado + rodapé
    for (let x = -E.W; x < E.W * 2; x += 90) { g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(x, -E.H, 30, GY + E.H); }
    g.fillStyle = shade(wall, -0.4); g.fillRect(-E.W, GY - 250, E.W * 3, 12); g.fillStyle = shade(wall, -0.25); g.fillRect(-E.W, GY - 238, E.W * 3, 238);
    // janela (esquerda)
    const wx = CX - 520, wy = GY - 820, ww = 280, wh = 360;
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(wall, -0.6), bar: 12 }, (g, x, y, w, h) => {
      const sky = o.window === 'day' ? mood('day').sky : N.sky; g.fillStyle = linGrad(g, 0, y, 0, y + h, sky); g.fillRect(x, y, w, h);
      if (o.window !== 'day') { FX.stars(g, t, { count: 30, area: [x, y, w, h * 0.6], seed: 9 }); FX.moon(g, x + w * 0.3, y + h * 0.25, 22); }
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.45, minH: 60, color: alpha(N.dark, 0.95), windowColor: alpha(M.practical, 0.5), lit: 0.05, seed: 12 });
      o.windowExtra?.(g, x, y, w, h);
    });
    // os retratos
    if (o.portraits !== false) {
      const pw = 170, ph = 226, py = GY - 900;
      portraitPair(g, CX + 40, py, pw, ph, M, { lamps: true });
      g.fillStyle = shade(wall, -0.55); g.fillRect(CX + 40 - 260, py + ph + 70, 520, 14); g.fillStyle = alpha(M.rim, 0.45); g.fillRect(CX + 40 - 260, py + ph + 70, 520, 3);
    }
    // porta (direita)
    FX.door(g, { x: CX + 330, y: GY, w: 190, h: 450, color: shade(wall, -0.3), open: o.doorOpen || 0, light: o.doorLight || N.key });
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [floorC, shade(floorC, -0.55)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 2; for (let x = -E.W; x < E.W * 2; x += 140) { g.beginPath(); g.moveTo(x, GY); g.lineTo(CX + (x - CX) * 2.6, GY + 700); g.stroke(); }
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.18)', 0.12);
    if (lampOn) FX.pool(g, CX + 60, GY + 70, 560, 120, M.practical, night ? 0.32 : 0.22);
    if (o.doorOpen) FX.pool(g, CX + 420, GY + 60, 300, 70, o.doorLight || N.key, 0.35 * o.doorOpen);
  });
  // lâmpada pendurada
  layer(g, cam, 0.7, (g) => {
    seg(g, [[bulb[0], -E.H], [bulb[0], bulb[1] - 20]], 3, '#120d10');
    if (lampOn) { circle(g, bulb[0], bulb[1], 16, '#fff1cf'); glow(g, bulb[0], bulb[1], night ? 420 : 300, M.practical, 0.55); FX.lightCone(g, bulb[0], bulb[1], { angle: Math.PI / 2, spread: 1.4, len: 1400, color: M.practical, a: night ? 0.12 : 0.08 }); }
    else circle(g, bulb[0], bulb[1], 16, '#3a3036');
  });
  return { GY, CX, M, wall };
}
// mesa baixa coreana (desenhar na profundidade 0.95–1)
export function lowTable(g, x, GY, w = 360, c = '#3a2418') {
  const top = GY - 70; rr(g, x - w / 2, top, w, 22, 8); g.fillStyle = c; g.fill(); g.fillStyle = 'rgba(255,210,150,.28)'; g.fillRect(x - w / 2 + 8, top, w - 16, 3);
  for (const dx of [-0.42, 0.42]) seg(g, [[x + dx * w, top + 20], [x + dx * w, GY]], 12, shade(c, -0.3));
  return top;
}
export function bowl(g, x, y, s = 1, full = false) {
  g.fillStyle = '#e9e2d4'; g.beginPath(); g.ellipse(x, y - 4 * s, 26 * s, 8 * s, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(x - 26 * s, y - 4 * s); g.quadraticCurveTo(x, y + 26 * s, x + 26 * s, y - 4 * s); g.fill();
  g.fillStyle = full ? '#f6f2ea' : '#5a4a40'; g.beginPath(); g.ellipse(x, y - 4 * s, 21 * s, 5 * s, 0, 0, Math.PI * 2); g.fill();
}

// ---------- quarto à noite (cama, mesa com abajur, janela) ----------
export function bedroom(g, t, cam, o = {}) {
  const M = mood('night'), W = mood('interiorWarm'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.55, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(M.wall, -0.5), shade(M.wall, -0.15)]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    FX.windowFrame(g, { x: CX + 120, y: GY - 900, w: 300, h: 380, cols: 2, rows: 2, frame: shade(M.wall, -0.65), bar: 12 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h); FX.stars(g, t, { count: 40, area: [x, y, w, h], seed: 3 }); FX.moon(g, x + w * 0.65, y + h * 0.3, 28);
    });
    glow(g, CX + 270, GY - 700, 500, M.key, 0.1);
    if (o.portraits) portraitPair(g, CX - 260, GY - 980, 120, 160, W, { lamps: false });
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.floor, 0.1), M.dark]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.25)', 0.1);
    FX.pool(g, CX + 200, GY + 40, 420, 80, M.key, 0.18);
  });
  return { GY, CX, M, W };
}
// mesa + abajur aceso (luz quente localizada)
export function deskLamp(g, x, GY, M, on = 1) {
  const top = GY - 150; rr(g, x - 190, top, 380, 18, 6); g.fillStyle = '#2a1c18'; g.fill();
  for (const dx of [-170, 170]) seg(g, [[x + dx, top + 16], [x + dx, GY]], 10, '#1e1412');
  seg(g, [[x + 120, top], [x + 120, top - 110], [x + 70, top - 160]], 7, '#1e1412'); poly(g, [[x + 40, top - 150], [x + 100, top - 190], [x + 110, top - 140]], '#2a1c18');
  if (on) { glow(g, x + 80, top - 150, 520, M.practical, 0.7 * on); FX.lightCone(g, x + 78, top - 150, { angle: Math.PI * 0.62, spread: 1.0, len: 560, color: M.practical, a: 0.25 * on }); FX.pool(g, x, GY - 140, 260, 26, M.practical, 0.4 * on); }
  return top;
}

// ---------- rua da vila (o = { time: 'dusk'|'night'|'day', wall: bool, checkpoint: bool }) ----------
export function village(g, t, cam, o = {}) {
  const time = o.time || 'dusk', M = mood(time === 'day' ? 'day' : time), GY = ground(), CX = E.W / 2;
  const houseC = shade(M.wall, time === 'night' ? -0.35 : -0.15);
  layer(g, cam, 0.12, (g) => {
    backdrop(g, M.sky);
    if (time === 'night') { FX.stars(g, t, { count: 120, area: [-200, 0, E.W + 400, E.H * 0.5] }); FX.moon(g, CX + 300, GY - 1050, 40); }
    else FX.sun(g, CX - 260, GY - 760, 52, '#fff3dc', M.key, 4);
    FX.hills(g, { y: GY - 420, amp: 260, color: mix(M.sky[M.sky.length - 1], M.dark, 0.6), seed: 3, freq: 0.003 });
    FX.hills(g, { y: GY - 300, amp: 160, color: mix(M.sky[M.sky.length - 1], M.dark, 0.78), seed: 7, freq: 0.005 });
  });
  layer(g, cam, 0.35, (g) => {   // blocos de apartamentos baratos, quase sem luz
    for (let i = 0; i < 6; i++) FX.facade(g, { x: -400 + i * 330, y: GY - 200, w: 260, h: 380 + (i % 3) * 80, color: shade(M.wall, -0.35), win: M.practical, dark: shade(M.wall, -0.55), cols: 5, rows: 6, lit: time === 'night' ? 0.06 : 0.1, seed: 30 + i });
    g.fillStyle = shade(M.dark, 0.05); g.fillRect(-E.W, GY - 200, E.W * 3, 200);
  });
  layer(g, cam, 0.7, (g) => {   // casas térreas com telhado, painel de propaganda, postes
    if (!o.noHouses) for (let i = -2; i <= 3; i++) {
      const x = CX + i * 420 - 200, w = 360, h = 300;
      g.fillStyle = houseC; g.fillRect(x, GY - h, w, h);
      poly(g, [[x - 30, GY - h], [x + w / 2, GY - h - 120], [x + w + 30, GY - h]], shade(houseC, -0.35));
      g.fillStyle = shade(houseC, -0.5); g.fillRect(x - 30, GY - h - 8, w + 60, 14);
      const lit = (i * 7 + 3) % 3 === 0 && time !== 'day';
      rr(g, x + 50, GY - h + 70, 90, 100, 4); g.fillStyle = lit ? M.practical : shade(houseC, -0.55); g.fill(); if (lit) glow(g, x + 95, GY - h + 120, 140, M.practical, 0.35);
      g.fillStyle = shade(houseC, -0.6); g.fillRect(x + w - 130, GY - 210, 90, 210);
    }
    if (o.wall) { g.fillStyle = linGrad(g, 0, GY - 420, 0, GY, [shade(houseC, 0.12), shade(houseC, -0.2)]); g.fillRect(-E.W, GY - 420, E.W * 3, 420); g.fillStyle = shade(houseC, -0.45); g.fillRect(-E.W, GY - 430, E.W * 3, 16); }
    if (o.billboard !== false) {   // painel de propaganda com faixa vermelha
      const bx = CX + 120, by = GY - 760; seg(g, [[bx + 30, by + 300], [bx + 30, GY]], 12, '#151018'); seg(g, [[bx + 250, by + 300], [bx + 250, GY]], 12, '#151018');
      rr(g, bx - 20, by, 320, 300, 6); g.fillStyle = shade(LENCO, -0.15); g.fill(); g.fillStyle = mix(LENCO, '#ffd47e', 0.55); g.fillRect(bx, by + 30, 280, 40);
      for (let k = 0; k < 3; k++) g.fillRect(bx + 20, by + 110 + k * 46, 240 - k * 50, 18);
      if (time !== 'day') glow(g, bx + 140, by + 150, 260, LENCO, 0.25);
    }
    for (const px of [-260, 560, 1380]) { seg(g, [[px, GY], [px, GY - 820]], 10, '#120d12'); seg(g, [[px - 50, GY - 790], [px + 50, GY - 790]], 6, '#120d12'); }
    g.strokeStyle = 'rgba(10,8,12,.8)'; g.lineWidth = 2; for (const dy of [-790, -760]) { g.beginPath(); g.moveTo(-1000, GY + dy + 30); g.quadraticCurveTo(150, GY + dy + 90, 560, GY + dy); g.quadraticCurveTo(970, GY + dy + 90, 1380, GY + dy); g.stroke(); }
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.road, -0.05), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.2)', 0.12);
    if (time === 'night') FX.pool(g, CX + 120, GY + 40, 380, 70, M.practical, 0.16);
  });
  return { GY, CX, M };
}

// ---------- sala de aula (o = { spring, empty, mood }) ----------
export function classroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), W = mood('interiorWarm'), GY = ground(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(M.wall, -0.4), shade(M.wall, 0.05)]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    // quadro-negro + retratos acima
    const bx = CX - 330, by = GY - 680, bw = 660, bh = 330;
    rr(g, bx - 16, by - 16, bw + 32, bh + 32, 8); g.fillStyle = '#3a2a22'; g.fill(); g.fillStyle = linGrad(g, 0, by, 0, by + bh, ['#1f3a30', '#16281f']); g.fillRect(bx, by, bw, bh);
    g.strokeStyle = 'rgba(230,240,230,.35)'; g.lineWidth = 4; g.lineCap = 'round';
    for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(bx + 50, by + 60 + k * 62); for (let x = 0; x < bw - 120 - (k % 2) * 140; x += 18) g.lineTo(bx + 50 + x, by + 60 + k * 62 + Math.sin(x * 0.4 + k) * 6); g.stroke(); }
    portraitPair(g, CX, by - 300, 120, 160, W, { lamps: false });
    g.fillStyle = shade(LENCO, -0.1); g.fillRect(bx - 16, by - 70, bw + 32, 34); g.fillStyle = alpha('#ffd47e', 0.8); for (let k = 0; k < 9; k++) g.fillRect(bx + 20 + k * 72, by - 60, 46, 14);
    // janelas à esquerda
    for (const i of [0, 1]) {
      const wx = CX - 520 - i * 330 + (i ? 0 : -20), wy = GY - 900, ww = 230, wh = 420;
      FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 3, frame: shade(M.wall, -0.6), bar: 10 }, (g, x, y, w, h) => {
        g.fillStyle = linGrad(g, 0, y, 0, y + h, mood('day').sky); g.fillRect(x, y, w, h);
        if (o.spring) { const r = rng(5 + i); for (let k = 0; k < 18; k++) { circle(g, x + r() * w, y + r() * h * 0.6, 18 + r() * 26, alpha('#f6b8cc', 0.75)); } seg(g, [[x, y + h * 0.5], [x + w, y + h * 0.2]], 8, '#3a2a2a'); }
      });
      FX.lightCone(g, wx + ww / 2, wy + wh / 2, { angle: Math.PI * 0.32, spread: 0.5, len: 900, color: mood('day').key, a: 0.06 });
    }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.floor, 0.15), M.dark]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.2)', 0.1);
    FX.pool(g, CX - 200, GY + 60, 520, 90, mood('day').key, 0.14);
  });
  return { GY, CX, M };
}
// carteira escolar simples
export function schoolDesk(g, x, y, s = 1, c = '#4a3426') {
  rr(g, x - 70 * s, y - 120 * s, 140 * s, 16 * s, 4 * s); g.fillStyle = c; g.fill();
  seg(g, [[x - 58 * s, y - 106 * s], [x - 58 * s, y]], 7 * s, shade(c, -0.35)); seg(g, [[x + 58 * s, y - 106 * s], [x + 58 * s, y]], 7 * s, shade(c, -0.35));
}

// ---------- arrozal 2D (k = 0 amanhecer → 1 noite) ----------
export function paddy(g, t, cam, k = 0.3) {
  const GY = ground(), CX = E.W / 2;
  const pick = (a, b, c, d) => k < 0.33 ? mixArr(a, b, k / 0.33) : k < 0.66 ? mixArr(b, c, (k - 0.33) / 0.33) : mixArr(c, d, (k - 0.66) / 0.34);
  const sky = pick(['#2e2a52', '#c07a8a', '#f6c49a'], ['#7fa8d8', '#bcd2ea', '#eee2cc'], ['#5a4a7a', '#e08a5a', '#f8cc8a'], ['#0b1028', '#1d2550', '#3a3570']);
  const sunY = GY - 300 - Math.sin(clamp(k / 0.8) * Math.PI) * 900, sunX = lerp(-100, E.W + 100, clamp(k / 0.8));
  layer(g, cam, 0.12, (g) => {
    backdrop(g, sky);
    if (k > 0.72) { FX.stars(g, t, { count: 120, area: [-200, 0, E.W + 400, E.H * 0.5] }); FX.moon(g, CX - 260, GY - 1000, 34); }
    else FX.sun(g, sunX, sunY, 50, '#fff3dc', k < 0.2 || k > 0.55 ? '#ffb070' : '#fff1d0', 4);
  });
  const hillC = mixC(sky[0], '#0e0b14', 0.55);
  layer(g, cam, 0.25, (g) => { FX.hills(g, { y: GY - 380, amp: 340, color: hillC, seed: 11, freq: 0.0035 }); FX.hills(g, { y: GY - 220, amp: 140, color: shade(hillC, -0.25), seed: 4, freq: 0.006 }); });
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 220, 0, GY + 700, [mixC(sky[2], '#203030', 0.55), mixC(sky[1], '#101418', 0.7)]); g.fillRect(-E.W, GY - 220, E.W * 3, E.H * 2);
    if (k <= 0.72) glow(g, sunX, GY - 120, 300, sky[2], 0.25);
    for (let row = 0; row < 9; row++) {
      const y = GY - 200 + row * row * 14 + row * 30, sp = 34 + row * 10, sz = 0.5 + row * 0.25;
      for (let x = -E.W + (row % 2) * sp / 2; x < E.W * 2; x += sp) { const c = '#1f3a24'; seg(g, [[x, y], [x - 6 * sz, y - 22 * sz]], 2.5 * sz, c); seg(g, [[x, y], [x + 5 * sz, y - 20 * sz]], 2.5 * sz, c); seg(g, [[x, y], [x, y - 26 * sz]], 2.5 * sz, c); }
    }
    g.fillStyle = shade('#2a2018', -0.2); g.fillRect(-E.W, GY + 10, E.W * 3, 20);
  });
  return { GY, CX, sky, M: mood(k > 0.72 ? 'night' : k > 0.5 ? 'dusk' : 'golden') };
}
function mixC(a, b, k) { return mix(a, b, k); }
function mixArr(a, b, k) { return a.map((c, i) => mix(c, b[i], k)); }
