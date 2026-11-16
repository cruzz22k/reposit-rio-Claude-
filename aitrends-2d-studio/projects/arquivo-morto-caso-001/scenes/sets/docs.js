// sets/docs.js — "Arquivo Morto": documentos sobre uma mesa à luz de abajur (planta da casa, foto, polaroid, conta de luz, capa do e-book).
import { E, rng, clamp, lerp, ease, prog, text, alpha, radGrad, linGrad, rr, seg, circle, glow, poly, shade } from '/engine/core.js';

export const INK = '#1e1a16', PAPER = '#d8ccb4', RED = '#b8261c', MONO = 'DejaVu Sans Mono', SERIF = 'Playfair Display';

// mesa de madeira escura com a luz quente do abajur
export function desk(g, t, o = {}) {
  g.fillStyle = linGrad(g, 0, 0, E.W, E.H, ['#1a120c', '#0e0a08', '#060404']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  const r = rng(7); g.strokeStyle = 'rgba(255,220,180,.035)'; g.lineWidth = 3;
  for (let i = 0; i < 40; i++) { const x = -200 + r() * (E.W + 400); g.beginPath(); g.moveTo(x, -200); g.bezierCurveTo(x + 40, E.H * 0.3, x - 40, E.H * 0.6, x + 20, E.H + 200); g.stroke(); }
  const lx = o.lx ?? E.W * 0.62, ly = o.ly ?? E.H * 0.38, f = 1 + 0.015 * Math.sin(t * 7) + 0.01 * Math.sin(t * 13);
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radGrad(g, lx, ly, 0, 1100 * f, ['rgba(255,190,120,.28)', 'rgba(255,170,100,.10)', 'rgba(255,160,90,0)']); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.restore();
}
// folha de papel envelhecido com sombra; desenha o conteúdo em fn(x, y, w, h)
export function paper(g, x, y, w, h, rot, fn, o = {}) {
  g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.translate(-w / 2, -h / 2);
  g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 40; g.shadowOffsetY = 16; g.fillStyle = o.color || PAPER; g.fillRect(0, 0, w, h); g.restore();
  g.fillStyle = radGrad(g, w * 0.5, h * 0.45, Math.min(w, h) * 0.2, Math.max(w, h) * 0.75, ['rgba(0,0,0,0)', 'rgba(90,60,30,.35)']); g.fillRect(0, 0, w, h);
  const r = rng(o.seed || 3); for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(110,80,40,${0.04 + r() * 0.06})`; g.beginPath(); g.arc(r() * w, r() * h, 10 + r() * 60, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(60,40,20,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, h * 0.5); g.lineTo(w, h * 0.5 + 6); g.stroke();
  fn(g, w, h); g.restore();
}
export const mono = (g, s, x, y, size, o = {}) => text(g, s, x, y, { size, color: o.color || INK, font: MONO, weight: o.weight || 700, align: o.align || 'left', alpha: o.a ?? 1, spacing: o.spacing || 0 });

// ---------- a planta da casa (7 m x 12 m); hl = { sala, cozinha, quarto, quarto2, banheiro, gap } em 0..1 ----------
export const PLAN = { W: 7, L: 12, s: 82 };   // pixels por metro dentro da folha
export function floorPlan(g, w, h, t, hl = {}, o = {}) {
  const s = PLAN.s, ox = (w - PLAN.W * s) / 2, oy = 150;
  const X = (m) => ox + m * s, Y = (m) => oy + m * s;
  mono(g, 'PLANTA BAIXA — RUA DAS ACÁCIAS, 214', 40, 70, 24); mono(g, 'ESC. 1:100', w - 40, 70, 22, { align: 'right' });
  const rooms = { sala: [0, 0, 4, 7, 'SALA'], quarto2: [0, 7, 4, 12, 'QUARTO 2'], cozinha: [4, 0, 7, 3.5, 'COZINHA'], quarto: [4, 3.5, 7, 7.5, 'MEU QUARTO'], banheiro: [4, 9, 7, 12, 'BANHEIRO'] };
  for (const [k, [x0, y0, x1, y1, lab]] of Object.entries(rooms)) {
    const a = hl[k] || 0; if (a > 0) { g.fillStyle = `rgba(184,38,28,${0.16 * a})`; g.fillRect(X(x0), Y(y0), (x1 - x0) * s, (y1 - y0) * s); }
    mono(g, lab, (X(x0) + X(x1)) / 2, (Y(y0) + Y(y1)) / 2, 22, { align: 'center', color: a > 0.5 ? RED : INK });
  }
  // o espaço que sobra (parece só uma parede grossa até ser revelado)
  const gp = hl.gap || 0;
  g.fillStyle = gp > 0 ? `rgba(184,38,28,${0.25 + 0.35 * gp})` : 'rgba(30,26,22,.92)'; g.fillRect(X(4), Y(7.5), 3 * s, 1.5 * s);
  if (gp > 0) { g.save(); g.beginPath(); g.rect(X(4), Y(7.5), 3 * s, 1.5 * s); g.clip(); g.strokeStyle = alpha(RED, 0.8); g.lineWidth = 3; for (let i = -10; i < 20; i++) { g.beginPath(); g.moveTo(X(4) + i * 22, Y(7.5)); g.lineTo(X(4) + i * 22 + 1.5 * s, Y(9)); g.stroke(); } g.restore(); if (gp > 0.6) mono(g, '?', X(5.5), Y(8.25) + 4, 64, { align: 'center', color: '#f4e8d8' }); }
  // paredes
  g.strokeStyle = INK; g.lineWidth = 10; g.strokeRect(X(0), Y(0), PLAN.W * s, PLAN.L * s);
  g.lineWidth = 6; const wall = (a, b) => { g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); };
  wall([X(4), Y(0)], [X(4), Y(12)]); wall([X(0), Y(7)], [X(4), Y(7)]); wall([X(4), Y(3.5)], [X(7), Y(3.5)]); wall([X(4), Y(7.5)], [X(7), Y(7.5)]); wall([X(4), Y(9)], [X(7), Y(9)]);
  // portas (arcos) e janelas
  g.lineWidth = 2; const door = (x, y, r, a0, a1) => { g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, a0, a1); g.closePath(); g.stroke(); };
  door(X(4), Y(1.2), 0.8 * s, 0, Math.PI / 2); door(X(4), Y(4.2), 0.8 * s, 0, Math.PI / 2); door(X(4), Y(9.6), 0.75 * s, 0, Math.PI / 2); door(X(2.2), Y(7), 0.8 * s, Math.PI / 2, Math.PI); door(X(1.4), Y(12), 0.9 * s, -Math.PI, -Math.PI / 2);
  g.fillStyle = PAPER; for (const [x0, y0, x1, y1] of [[1, -0.1, 3, 0.1], [7 - 0.1, 1, 7.1, 2.5], [7 - 0.1, 4.5, 7.1, 6.5], [-0.1, 2, 0.1, 4.5], [-0.1, 8.5, 0.1, 10.5], [7 - 0.1, 10, 7.1, 11.2]]) { g.fillRect(X(x0), Y(y0), (x1 - x0) * s, (y1 - y0) * s); g.strokeRect(X(x0), Y(y0), (x1 - x0) * s, (y1 - y0) * s); }
  // cotas
  const dim = (x0, y0, x1, y1, lab, col, a, side = 1) => { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    for (const [x, y] of [[x0, y0], [x1, y1]]) { g.beginPath(); g.moveTo(x - 10, y); g.lineTo(x + 10, y); g.stroke(); }
    g.save(); g.translate((x0 + x1) / 2 + side * 34, (y0 + y1) / 2); g.rotate(-Math.PI / 2); text(g, lab, 0, 0, { size: 34, color: col, font: MONO, weight: 700 }); g.restore(); g.restore(); };
  dim(X(7) + 50, Y(0), X(7) + 50, Y(12), '12,0 M', INK, o.outer || 0, 1);
  const ia = o.inner || 0; dim(X(4) + 40, Y(0), X(4) + 40, Y(3.5), '3,5', '#3a5a8a', ia, -1); dim(X(4) + 40, Y(3.5), X(4) + 40, Y(7.5), '4,0', '#3a5a8a', ia, -1); dim(X(4) + 40, Y(9), X(4) + 40, Y(12), '3,0', '#3a5a8a', ia, -1);
  if (o.sum > 0) mono(g, '3,5 + 4,0 + 3,0 = 10,5 M', w / 2, Y(12) + 70, 30, { align: 'center', color: '#3a5a8a', a: o.sum });
  if (o.missing > 0) mono(g, 'FALTAM 1,5 M', w / 2, Y(12) + 120, 40, { align: 'center', color: RED, a: o.missing });
  return { X, Y };
}
// carimbo vermelho pequeno com contorno
export function stamp(g, x, y, ts, str, o = {}) {
  if (ts <= 0) return; const z = lerp(1.5, 1, ease.out(prog(ts, 0, 0.12))), sc = o.scale ?? 1;
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.18); g.scale(z * sc, z * sc); g.globalAlpha *= clamp(ts / 0.08) * 0.88;
  const w = str.length * 26 + 50; g.strokeStyle = RED; g.lineWidth = 7; rr(g, -w / 2, -40, w, 80, 8); g.stroke(); g.lineWidth = 2.5; rr(g, -w / 2 + 10, -30, w - 20, 60, 5); g.stroke();
  text(g, str, 0, 3, { size: 38, color: RED, font: MONO, weight: 700, spacing: 3 }); g.restore();
}
// capa do e-book
export function cover(g, x, y, w, h, t) {
  g.save(); g.translate(x, y);
  g.save(); g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 50; g.shadowOffsetX = 20; g.shadowOffsetY = 20; g.fillStyle = '#0c0a09'; g.fillRect(0, 0, w, h); g.restore();
  g.fillStyle = linGrad(g, 0, 0, 0, h, ['#1a1410', '#0a0807']); g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(0, 0, 14, h);
  const s = w / 19, px = (w - 7 * s) / 2, py = h * 0.29;
  g.globalAlpha = 0.3; g.strokeStyle = '#d8ccb4'; g.lineWidth = 3; g.strokeRect(px, py, 7 * s, 12 * s); g.beginPath(); g.moveTo(px + 4 * s, py); g.lineTo(px + 4 * s, py + 12 * s); g.stroke(); g.globalAlpha = 0.85; g.fillStyle = RED; g.fillRect(px + 4 * s, py + 7.5 * s, 3 * s, 1.5 * s); g.globalAlpha = 1;
  text(g, 'ARQUIVO', w / 2, h * 0.11, { size: w * 0.13, color: '#e8dcc4', font: SERIF, weight: 900, spacing: 6 }); text(g, 'MORTO', w / 2, h * 0.215, { size: w * 0.13, color: RED, font: SERIF, weight: 900, spacing: 10 });
  text(g, 'VOL. 1', w / 2, h * 0.82, { size: w * 0.055, color: '#e8dcc4', font: MONO, weight: 700, spacing: 6 });
  text(g, '13 CASAS QUE', w / 2, h * 0.88, { size: w * 0.06, color: '#c8bca4', font: MONO, weight: 700 }); text(g, 'NÃO DEVERIAM EXISTIR', w / 2, h * 0.93, { size: w * 0.06, color: '#c8bca4', font: MONO, weight: 700 });
  g.restore();
}
