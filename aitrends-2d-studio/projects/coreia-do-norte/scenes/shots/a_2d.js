// shots/a_2d.js — cenas 2.5D da amostra: a ficha songbun no berçário e os retratos na parede da sala.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { VOCE_KID, OFICIAL, LENCO } from '../cast.js';

const GYv = () => E.H * V(0.8, 0.68);

// ---------- berçário à noite ----------
function crib(g, x, GY, s, M, baby = true) {
  const c = shade(M.wall, 0.35), w = 230 * s, h = 96 * s, top = GY - 190 * s;
  seg(g, [[x - w * 0.36, top + h], [x - w * 0.44, GY]], 9 * s, shade(c, -0.35)); seg(g, [[x + w * 0.36, top + h], [x + w * 0.44, GY]], 9 * s, shade(c, -0.35));
  seg(g, [[x - w * 0.44, GY - 30 * s], [x + w * 0.44, GY - 30 * s]], 6 * s, shade(c, -0.45));
  if (baby) {                                                    // o bebê: cabecinha preta, manta clara
    g.fillStyle = shade(S().ui.cream, -0.12); g.beginPath(); g.ellipse(x + 12 * s, top + 4 * s, 70 * s, 30 * s, 0, Math.PI, 0); g.fill();
    circle(g, x - 58 * s, top - 12 * s, 21 * s, M.rim); circle(g, x - 56 * s, top - 10 * s, 20 * s, S().ink);
  }
  rr(g, x - w / 2, top, w, h, 22 * s); g.fillStyle = linGrad(g, 0, top, 0, top + h, [c, shade(c, -0.4)]); g.fill();
  g.fillStyle = alpha(M.rim, 0.55); g.fillRect(x - w / 2 + 16 * s, top, w - 32 * s, 3 * s);
}
function nursery(g, t, cam) {
  const M = mood('interiorCool'), GY = GYv(), CX = E.W / 2;
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
// a ficha: pasta de papel, ícone do bebê, linhas, carimbo
function dossier(g, cx, cy, t, tStamp) {
  const ui = S().ui, k = ease.outBack(prog(t, 0, 0.45)); if (k <= 0) return;
  const w = V(620, 640), h = V(400, 430), paper = shade(ui.cream, -0.08), folder = shade(ui.gold, -0.32);
  g.save(); g.translate(cx, cy); g.rotate(-0.045); g.scale(k, k);
  g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 50; g.shadowOffsetY = 18;
  rr(g, -w / 2 - 22, -h / 2 - 18, w + 44, h + 40, 16); g.fillStyle = folder; g.fill(); g.shadowColor = 'transparent';
  rr(g, -w / 2 - 22, -h / 2 - 62, 220, 60, 14); g.fillStyle = folder; g.fill();
  text(g, 'Nº 000001', -w / 2 + 88, -h / 2 - 36, { size: 28, color: shade(folder, -0.55), font: FONTS.ui, weight: 900, spacing: 2 });
  rr(g, -w / 2, -h / 2, w, h, 8); g.fillStyle = paper; g.fill();
  const px = -w / 2 + 44, py = -h / 2 + 44, ink = '#2a2430';
  rr(g, px, py, 150, 180, 8); g.fillStyle = shade(paper, -0.16); g.fill();
  g.fillStyle = ink; g.beginPath(); g.ellipse(px + 75, py + 150, 52, 52, 0, Math.PI, 0); g.fill(); circle(g, px + 75, py + 74, 34, ink);
  text(g, 'SONGBUN', px + 190, py + 26, { size: V(58, 62), color: ink, align: 'left', spacing: 4 });
  for (let i = 0; i < 4; i++) { g.fillStyle = alpha(ink, 0.3); g.fillRect(px + 192, py + 84 + i * 32, (w - 290) * [1, 0.72, 0.9, 0.5][i] * ease.out(prog(t, 0.5 + i * 0.12, 0.9 + i * 0.12)), 10); }
  for (let i = 0; i < 3; i++) { g.fillStyle = alpha(ink, 0.22); g.fillRect(px, py + 226 + i * 34, (w - 88) * [0.95, 0.8, 0.6][i] * ease.out(prog(t, 0.9 + i * 0.12, 1.3 + i * 0.12)), 10); }
  const ts = t - tStamp;
  if (ts > 0) {                                                  // carimbo vermelho batendo
    const z = lerp(2.4, 1, ease.out(prog(ts, 0, 0.13))), red = ui.accent;
    g.save(); g.translate(w * 0.2, h * 0.2); g.rotate(-0.22); g.scale(z, z); g.globalAlpha = clamp(ts / 0.08) * 0.92;
    rr(g, -150, -52, 300, 104, 14); g.strokeStyle = red; g.lineWidth = 9; g.stroke();
    rr(g, -136, -38, 272, 76, 8); g.lineWidth = 3; g.stroke();
    text(g, 'CLASSIFICADO', 0, 3, { size: 34, color: red, font: FONTS.ui, weight: 900, spacing: 3 });
    g.restore();
  }
  g.restore();
  if (ts > 0 && ts < 0.8) FX.rings(g, cx + w * 0.2, cy + h * 0.2, ts, { count: 2, r0: 60, r1: 420, speed: 1.8, color: ui.accent, a: 0.5 * (1 - ts / 0.8) });
}
registerShot('a002', { draw(g, t, info) {
  const tStamp = 2.3, sh = t > tStamp ? shake(t, 9 * (1 - prog(t, tStamp, tStamp + 0.4)), 30) : [0, 0];
  const cam = { z: 1 + 0.07 * ease.inOut(t / info.dur), x: 20 * ease.inOut(t / info.dur) + sh[0], y: sh[1] };
  const { GY, CX, M } = nursery(g, t, cam);
  layer(g, cam, 1, (g) => {
    crib(g, CX - 150, GY, V(1.5, 1.6), M, true);
    drawFigure(g, { x: CX + V(250, 250), y: GY, s: V(1.7, 2.0), facing: -1, outfit: OFICIAL, pose: breathe(posesAt(t, [[0, 'stand'], [0.5, 'holdFront']]), t, 0.6, 4), prop: 'paper', expr: 'neutral', rim: { color: M.rim, dir: [-1, -0.4], w: 5 } });
  });
  blurLayer(g, 11, (g) => crib(g, CX + V(700, 520), GY + V(260, 420), 2.6, M, false), cam, 1.7);
  FX.dust(g, t, { count: 40, color: M.rim, a: 0.4 });
  veil(g, M.dark, 0.25 * ease.out(prog(t, 1.2, 1.7)));
  dossier(g, CX, E.H * V(0.36, 0.25), t - 1.3, tStamp - 1.3);
} });

// ---------- a parede mais importante da sala: os dois retratos ----------
function portrait(g, x, y, w, h, M, seed) {
  const gold = S().ui.gold;
  g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40; g.shadowOffsetY = 16; rr(g, x - 20, y - 20, w + 40, h + 40, 8); g.fillStyle = shade(gold, -0.3); g.fill(); g.restore();
  rr(g, x - 20, y - 20, w + 40, h + 40, 8); g.fillStyle = linGrad(g, x, y, x + w, y + h, [shade(gold, 0.05), shade(gold, -0.45), shade(gold, -0.15)]); g.fill();
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = linGrad(g, 0, y, 0, y + h, [mix(LENCO, M.practical, 0.35), shade(LENCO, -0.35)]); g.fillRect(x, y, w, h);
  glow(g, x + w / 2, y + h * 0.4, w * 0.8, M.practical, 0.3);
  const ink = S().ink, cx = x + w / 2;                            // busto estilizado, sem rosto
  g.fillStyle = ink; g.beginPath(); g.ellipse(cx, y + h * 1.03, w * 0.46, h * 0.36, 0, Math.PI, 0); g.fill();
  circle(g, cx, y + h * 0.42, w * 0.24, ink);
  if (seed) { g.fillStyle = ink; g.beginPath(); g.ellipse(cx, y + h * 0.3, w * 0.25, h * 0.11, 0, Math.PI, 0); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,.07)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + w * 0.55, y); g.lineTo(x + w * 0.2, y + h); g.lineTo(x, y + h); g.fill();
  g.restore();
}
registerShot('a003', { draw(g, t, info) {
  const M = mood('interiorWarm'), CX = E.W / 2, k = ease.inOut(t / info.dur);
  const cam = { z: 1.02 + 0.06 * k, y: -26 * k };
  const pw = V(250, 300), ph = V(330, 400), py = E.H * V(0.1, 0.13), gap = V(70, 56);
  layer(g, cam, 0.6, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H * 0.3, 0, E.H * 1.3, [shade(M.wall, -0.5), shade(M.wall, -0.1), shade(M.dark, -0.2)]); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let x = -E.W; x < E.W * 2; x += 180) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(x, -E.H, 3, E.H * 3); }
    for (const sx of [-1, 1]) {                                  // luminária de quadro em cima de cada retrato
      const x = CX + sx * (pw / 2 + gap / 2);
      FX.lightCone(g, x, py - 60, { angle: Math.PI / 2, spread: 1.25, len: ph * 1.9, color: M.practical, a: 0.34 });
      portrait(g, x - pw / 2, py, pw, ph, M, sx > 0);
      rr(g, x - 60, py - 74, 120, 20, 10); g.fillStyle = shade(S().ui.gold, -0.5); g.fill(); glow(g, x, py - 56, 110, M.practical, 0.8);
    }
    const sy = py + ph + V(90, 100);                              // prateleira com o pano de limpar
    g.fillStyle = shade(M.wall, -0.55); g.fillRect(CX - pw - gap, sy, pw * 2 + gap * 2, 16); g.fillStyle = alpha(M.rim, 0.5); g.fillRect(CX - pw - gap, sy, pw * 2 + gap * 2, 3);
    rr(g, CX - 52, sy - 26, 104, 26, 9); g.fillStyle = shade(S().ui.cream, -0.1); g.fill(); g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(CX - 44, sy - 14, 88, 3);
  });
  veil(g, M.dark, 0.16);
  const r = V(300, 322) * (1 + 0.035 * k), cx = CX, cy = E.H * V(0.66, 0.635);
  const expr = t < 2.3 ? 'awe' : 'surprised';
  const scarf = (g) => {                                         // o lenço vermelho, amarrado no pescoço
    g.strokeStyle = LENCO; g.lineWidth = r * 0.2; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - r * 0.86, cy + r * 0.9); g.quadraticCurveTo(cx, cy + r * 1.62, cx + r * 0.86, cy + r * 0.9); g.stroke();
    poly(g, [[cx - r * 0.06, cy + r * 1.24], [cx - r * 0.34, cy + r * 1.74], [cx - r * 0.02, cy + r * 1.6]], shade(LENCO, -0.12));
    poly(g, [[cx + r * 0.06, cy + r * 1.24], [cx + r * 0.3, cy + r * 1.7], [cx + r * 0.0, cy + r * 1.62]], shade(LENCO, -0.22));
    circle(g, cx, cy + r * 1.25, r * 0.1, shade(LENCO, 0.12));
  };
  layer(g, { z: 1 + 0.02 * k }, 1, (g) => {
    bigFace(g, cx, cy, r, { outfit: VOCE_KID, expr, look: [lerp(-0.35, 0.35, ease.inOut(prog(t, 0.5, 1.9))), -0.95], rimColor: M.rim, rimSide: 1, blink: t > 3.3 && t < 3.42, tilt: -0.03 });
    scarf(g);
    g.save(); g.beginPath(); g.arc(cx, cy, r * 1.07, 0.15, Math.PI - 0.15); g.lineTo(cx - r * 1.1, cy - r * 1.2); g.lineTo(cx + r * 1.1, cy - r * 1.2); g.closePath(); g.clip();
    g.translate(cx, cy); g.rotate(-0.03); g.translate(-cx, -cy);
    g.save(); g.beginPath(); g.arc(cx, cy, r * 1.06, 0, 7); g.arc(cx + r * 0.07, cy + r * 0.02, r, 0, 7, true); g.fillStyle = M.rim; g.fill('evenodd'); g.restore(); circle(g, cx, cy, r, S().ink);
    g.restore();
    bigFaceOnly(g, cx, cy, r, expr, t);
  });
  glow(g, CX, cy - r * 1.5, r * 1.6, M.practical, 0.1);
  FX.dust(g, t, { count: 45, color: M.practical, a: 0.45 });
} });
// redesenha só o rosto por cima do lenço (o lenço passa por trás do queixo)
import { face } from '/engine/rig2d.js';
function bigFaceOnly(g, cx, cy, r, expr, t) {
  g.save(); g.translate(cx, cy); g.rotate(-0.03);
  face(g, 0, 0, r, { expr, look: [lerp(-0.35, 0.35, ease.inOut(prog(t, 0.5, 1.9))), -0.95], blink: t > 3.3 && t < 3.42, front: true });
  g.restore();
}
