// shots/caso001.js — Arquivo Morto, caso 001: "A casa que sobra".
import { E, registerShot, layer, ease, prog, clamp, lerp, shake, text, alpha, rr, seg, circle, glow, poly, linGrad, radGrad, rng } from '/engine/core.js';
import { camPath, punch } from '/engine/cine.js';
import { filmPost } from '../sets/horror.js';
import { desk, paper, floorPlan, mono, stamp, cover, INK, PAPER, RED, MONO, SERIF, PLAN } from '../sets/docs.js';

const SHEET = { x: 160, y: 200, w: 760, h: 1300 };
const post = (g, t, o = {}) => filmPost(g, t, { desat: 0.35, tint: '#ead8c0', noise: 0.035, ...o });
function planShot(g, t, cam, hl, o = {}) {
  desk(g, t);
  layer(g, cam, 1, (g) => paper(g, SHEET.x, SHEET.y + (o.slide || 0), SHEET.w, SHEET.h, -0.018, (g, w, h) => floorPlan(g, w, h, t, hl, o), { seed: 5 }));
}
// ponto da folha (coordenadas internas da planta) -> tela, para enquadrar a câmera
const sheetPt = (mx, my) => [SHEET.x + (SHEET.w - PLAN.W * PLAN.s) / 2 + mx * PLAN.s, SHEET.y + 150 + my * PLAN.s];
const camTo = ([x, y], z) => ({ z, x: (x - E.W / 2), y: (y - E.H / 2) });

// e01 — a pasta abre e a planta desliza para a luz
registerShot('e01', { draw(g, t, info) {
  const cam = camPath(t, info.dur, { z: 0.92 }, { z: 1.0 }, { hand: 3, seed: 1 });
  const slide = lerp(900, 0, ease.out(prog(t, 0.5, 2.4)));
  desk(g, t);
  layer(g, cam, 1, (g) => {
    const fy = 1050 + slide * 0.2; g.save(); g.translate(120, fy); g.rotate(0.04);
    g.fillStyle = '#5a4630'; rr(g, 0, 0, 840, 620, 10); g.fill(); g.fillStyle = '#6a5438'; rr(g, 20, -40, 260, 60, 8); g.fill();
    mono(g, 'ARQUIVO MORTO', 420, 140, 54, { align: 'center', color: '#2a1e14' }); mono(g, 'CASO Nº 001', 420, 220, 40, { align: 'center', color: '#2a1e14' }); stamp(g, 620, 400, 99, 'CONFIDENCIAL', { scale: 0.75 }); g.restore();
    paper(g, SHEET.x, SHEET.y + slide, SHEET.w, SHEET.h, -0.018, (g, w, h) => floorPlan(g, w, h, t, {}), { seed: 5 });
  });
  const a = ease.out(prog(t, 0.2, 0.7)) * (1 - prog(t, 4.3, 4.9));
  text(g, 'ARQUIVO MORTO', E.W / 2, 120, { size: 34, color: '#e8dcc4', font: MONO, weight: 700, spacing: 10, alpha: a });
  text(g, 'CASO 001 · A CASA QUE SOBRA', E.W / 2, 175, { size: 30, color: RED, font: MONO, weight: 700, spacing: 2, alpha: a });
  post(g, t);
} });
// e02 — "Olhe com calma."
registerShot('e02', { draw(g, t, info) { planShot(g, t, camPath(t, info.dur, { z: 1.0 }, { z: 1.08, y: -20 }, { hand: 3, seed: 2 }), {}); post(g, t); } });
// e03 — os cômodos acendem um a um
registerShot('e03', { draw(g, t, info) {
  const on = (at) => ease.out(prog(t, at, at + 0.3)) * (1 - ease.inOut(prog(t, 3.3, 4.0)));
  planShot(g, t, camPath(t, info.dur, { z: 1.08, y: -20 }, { z: 1.12, y: 0 }, { hand: 3, seed: 3 }), { sala: on(0.15), cozinha: on(0.5), quarto: on(1.2), quarto2: on(1.3), banheiro: on(2.2) }); post(g, t);
} });
// e04 — "Por fora, a casa tem 12 metros de comprimento."
registerShot('e04', { draw(g, t, info) {
  const k = ease.inOut(prog(t, 0, info.dur)), c = camTo(sheetPt(6.2, 6), 1.25);
  planShot(g, t, camPath(t, info.dur, { z: 1.0 }, c, { hand: 3, seed: 4 }), {}, { outer: ease.out(prog(t, 4.3, 4.8)) }); post(g, t);
} });
// e05 — "Mas, somando por dentro, dá 10,5. Falta 1,5 metro."
registerShot('e05', { draw(g, t, info) {
  const c0 = camTo(sheetPt(6.2, 6), 1.25), c1 = camTo(sheetPt(4.6, 8), 1.15);
  const cam = camPath(t, info.dur, c0, c1, { hand: 3, seed: 5 }); cam.z += punch(t, 4.95, 0.08);
  planShot(g, t, cam, { gap: ease.out(prog(t, 4.95, 5.3)) }, { outer: 1, inner: ease.out(prog(t, 0.6, 1.4)), sum: ease.out(prog(t, 3.4, 3.8)), missing: ease.out(prog(t, 4.95, 5.3)) }); post(g, t);
} });
// e06 — o espaço sem porta e sem janela
registerShot('e06', { draw(g, t, info) {
  const cam = camPath(t, info.dur, camTo(sheetPt(5.5, 8.25), 1.5), camTo(sheetPt(5.5, 8.25), 2.3), { hand: 4, seed: 6, ease: ease.in });
  const pulse = 0.75 + 0.25 * Math.sin(t * 4);
  planShot(g, t, cam, { gap: pulse, quarto: 0.4, banheiro: 0.4 }, { outer: 1, inner: 1 });
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = radGrad(g, E.W / 2, E.H * 0.47, 200, 900, ['rgba(255,255,255,1)', 'rgba(60,40,40,1)']); g.fillRect(0, 0, E.W, E.H); g.restore();
  post(g, t, { noise: 0.05 });
} });
// a foto da parede do quarto (2D, com cara de foto de flash fraco)
function wallPhoto(g, t, o = {}) {
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#2a2620', '#1e1a16']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  for (let x = -E.W; x < E.W * 2; x += 90) { g.fillStyle = 'rgba(80,90,70,.18)'; g.fillRect(x, -E.H, 30, E.H * 3); for (let y = -E.H; y < E.H * 2; y += 110) { g.fillStyle = 'rgba(120,110,80,.12)'; g.beginPath(); g.arc(x + 60, y + ((x / 90) % 2 ? 55 : 0), 9, 0, 7); g.fill(); } }
  g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(-E.W, 1350, E.W * 3, 40);
  g.fillStyle = '#14100c'; rr(g, -120, 1130, 640, 480, 20); g.fill(); g.fillStyle = '#3a3440'; rr(g, -100, 1300, 620, 300, 10); g.fill();
  g.fillStyle = '#0e0c0a'; g.fillRect(620, 1180, 240, 400); g.fillStyle = '#080706'; rr(g, 660, 1110, 160, 70, 10); g.fill();
  text(g, '03:00', 740, 1146, { size: 46, color: '#ff3a2a', font: MONO, weight: 700, glow: 18, glowColor: 'rgba(255,40,30,.8)' });
  g.fillStyle = '#100c08'; g.fillRect(250, 520, 260, 330); g.fillStyle = '#3a3428'; g.fillRect(270, 540, 220, 290);
  g.fillStyle = radGrad(g, 740, 1146, 0, 500, ['rgba(255,60,40,.18)', 'rgba(255,60,40,0)']); g.fillRect(0, 0, E.W, E.H);
  g.fillStyle = radGrad(g, E.W * 0.45, E.H * 0.4, 100, 1100, ['rgba(255,240,220,.22)', 'rgba(0,0,0,0)']); g.fillRect(0, 0, E.W, E.H);
}
// e07 — "Toda noite, perto das 3 da manhã, alguém batia na parede. Três batidas."
registerShot('e07', { draw(g, t, info) {
  const knocks = [5.55, 5.95, 6.35], sh = knocks.reduce((a, k) => (t > k && t < k + 0.25 ? shake(t, 14 * (1 - (t - k) / 0.25), 40) : a), [0, 0]);
  const cam = camPath(t, info.dur, { z: 1.0 }, { z: 1.12, x: -30, y: -40 }, { hand: 4, seed: 7 }); cam.x += sh[0]; cam.y += sh[1];
  layer(g, cam, 1, (g) => wallPhoto(g, t));
  knocks.forEach((k) => { if (t > k && t < k + 0.6) { const p = (t - k) / 0.6; g.strokeStyle = `rgba(240,230,210,${0.4 * (1 - p)})`; g.lineWidth = 4; g.beginPath(); g.arc(E.W * 0.6, E.H * 0.38, 60 + p * 300, 0, 7); g.stroke(); } });
  post(g, t, { desat: 0.5, noise: 0.06 });
} });
// e08 — "Até o dia em que eu bati de volta."
registerShot('e08', { draw(g, t, info) {
  const k = 4.75, sh = t > k && t < k + 0.3 ? shake(t, 12, 40) : [0, 0];
  const cam = camPath(t, info.dur, { z: 1.7, x: 60, y: -260 }, { z: 1.9, x: 60, y: -260 }, { hand: 4, seed: 8 }); cam.x += sh[0]; cam.y += sh[1];
  layer(g, cam, 1, (g) => wallPhoto(g, t));
  const hp = ease.inOut(prog(t, 3.6, 4.6)) - ease.inOut(prog(t, 5.2, 5.9)), hx = lerp(E.W + 200, E.W * 0.62, hp), hy = lerp(E.H + 200, E.H * 0.44, hp);
  if (hp > 0) { g.fillStyle = '#d8ccc0'; g.save(); g.translate(hx, hy); g.rotate(-0.6); rr(g, -60, -70, 140, 150, 50); g.fill(); g.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 3; i++) g.fillRect(-40 + i * 40, -70, 4, 60); g.fillStyle = '#d8ccc0'; rr(g, -30, 60, 110, 500, 40); g.fill(); g.restore(); }
  post(g, t, { desat: 0.5, noise: 0.06 });
} });
// e09 — "E alguém respondeu." — escuro; três batidas
registerShot('e09', { draw(g, t, info) {
  g.fillStyle = '#050403'; g.fillRect(0, 0, E.W, E.H);
  [1.9, 2.25, 2.6].forEach((k) => { if (t > k && t < k + 0.5) { const p = (t - k) / 0.5; glow(g, E.W / 2, E.H * 0.42, 260 + p * 200, '#d8ccb4', 0.18 * (1 - p)); g.strokeStyle = `rgba(230,220,200,${0.5 * (1 - p)})`; g.lineWidth = 5; g.beginPath(); g.arc(E.W / 2, E.H * 0.42, 40 + p * 340, 0, 7); g.stroke(); } });
  post(g, t, { noise: 0.08 });
} });
// e10 — "a casa tinha ficado vazia por 11 anos." — a polaroid da casa
function polaroidHouse(g, x, y, w, h, t) {
  g.save(); g.translate(x, y); g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 40; g.shadowOffsetY = 16; g.fillStyle = '#e8e2d4'; g.fillRect(0, 0, w, h); g.restore();
  const ix = 36, iy = 36, iw = w - 72, ih = iw * 1.05; g.save(); g.beginPath(); g.rect(ix, iy, iw, ih); g.clip();
  g.fillStyle = linGrad(g, 0, iy, 0, iy + ih, ['#2a2a34', '#4a4650', '#6a5e58']); g.fillRect(ix, iy, iw, ih);
  const gy = iy + ih * 0.78; g.fillStyle = '#1a1816'; g.fillRect(ix, gy, iw, ih);
  const hx = ix + iw * 0.18, hw = iw * 0.64, hh = ih * 0.36; g.fillStyle = '#2a2622'; g.fillRect(hx, gy - hh, hw, hh); poly(g, [[hx - 20, gy - hh], [hx + hw / 2, gy - hh - ih * 0.18], [hx + hw + 20, gy - hh]], '#1a1714');
  for (const [wx, wy] of [[0.12, 0.25], [0.62, 0.25]]) { g.fillStyle = '#0c0b0a'; g.fillRect(hx + hw * wx, gy - hh + hh * wy, hw * 0.24, hh * 0.32); }
  g.fillStyle = '#0c0b0a'; g.fillRect(hx + hw * 0.42, gy - hh * 0.55, hw * 0.16, hh * 0.55);
  g.strokeStyle = '#141210'; g.lineWidth = 5; for (let i = 0; i < 18; i++) { g.beginPath(); g.moveTo(ix + i * iw / 17, gy + 10); g.lineTo(ix + i * iw / 17, gy - 30); g.stroke(); }
  g.fillStyle = 'rgba(255,240,210,.12)'; g.fillRect(ix, iy, iw, ih); g.restore();
  text(g, 'Rua das Acácias, 214 — 2009', w / 2, iy + ih + 70, { size: 30, color: '#3a3430', font: SERIF, weight: 900, italic: true });
  g.restore();
}
registerShot('e10', { draw(g, t, info) {
  desk(g, t); const cam = camPath(t, info.dur, { z: 1.0 }, { z: 1.1, y: -30 }, { hand: 3, seed: 10 }); cam.z += punch(t, 5.3, 0.05);
  layer(g, cam, 1, (g) => { g.save(); g.translate(540, 820); g.rotate(-0.05); polaroidHouse(g, -380, -480, 760, 920, t); g.restore(); stamp(g, 600, 1040, t - 5.3, 'VAZIA · 11 ANOS', { scale: 0.85, rot: -0.12 }); });
  post(g, t);
} });
// e11 — "Então... quem pagava a conta de luz?"
registerShot('e11', { draw(g, t, info) {
  desk(g, t); const cam = camPath(t, info.dur, { z: 1.02 }, { z: 1.22, y: 60 }, { hand: 3, seed: 11, ease: ease.in });
  layer(g, cam, 1, (g) => paper(g, 150, 230, 780, 1180, 0.02, (g, w, h) => {
    mono(g, 'CIA. DE ENERGIA ELÉTRICA', 40, 70, 30); mono(g, 'UNIDADE: R. DAS ACÁCIAS, 214', 40, 120, 22); mono(g, 'HISTÓRICO DE CONSUMO (kWh)', 40, 200, 26);
    const r = rng(9), x0 = 50, y0 = 760, cw = (w - 100) / 132;
    for (let i = 0; i < 132; i++) { const v = 60 + r() * 140 + (i % 12 > 5 ? 30 : 0); g.fillStyle = i % 12 === 0 ? '#5a4632' : '#2a2018'; g.fillRect(x0 + i * cw, y0 - v * 2, cw * 0.7, v * 2); }
    seg(g, [[x0, y0], [w - 50, y0]], 3, INK); for (let yr = 0; yr <= 11; yr++) mono(g, String(1998 + yr).slice(2), x0 + yr * 12 * cw, y0 + 34, 18);
    mono(g, 'SITUAÇÃO: TODAS AS FATURAS QUITADAS', 40, 870, 24); mono(g, 'TITULAR: ———', 40, 920, 24);
    stamp(g, w * 0.72, 1020, t - 2.5, 'PAGO', { scale: 0.9, rot: -0.2 });
  }, { seed: 9 }));
  if (t > 2.5) { const p = ease.out(prog(t, 2.5, 3.0)); g.strokeStyle = alpha(RED, 0.85); g.lineWidth = 6; g.beginPath(); g.ellipse(E.W / 2, 760, 470 * p, 150 * p, -0.03, 0, 7); g.stroke(); }
  post(g, t);
} });
// e12 — encerramento: caso 1 de 13 + capa do e-book
registerShot('e12', { draw(g, t, info) {
  desk(g, t, { ly: E.H * 0.45 }); const cam = camPath(t, info.dur, { z: 0.96 }, { z: 1.02 }, { hand: 2, seed: 12 });
  layer(g, cam, 1, (g) => { const k = ease.out(prog(t, 0.3, 1.2)); g.save(); g.translate(540, 900 + (1 - k) * 200); g.rotate(-0.04); cover(g, -270, -380, 540, 760, t); g.restore(); });
  const a1 = ease.out(prog(t, 0.2, 0.7)), a2 = ease.out(prog(t, 1.4, 1.9));
  text(g, 'CASO 1 DE 13', E.W / 2, 250, { size: 64, color: '#e8dcc4', font: SERIF, weight: 900, spacing: 4, alpha: a1 });
  text(g, 'O ARQUIVO COMPLETO', E.W / 2, 1450, { size: 44, color: '#e8dcc4', font: MONO, weight: 700, spacing: 3, alpha: a2 });
  text(g, 'ESTÁ NO LINK', E.W / 2, 1515, { size: 44, color: RED, font: MONO, weight: 700, spacing: 3, alpha: a2 });
  post(g, t);
} });
