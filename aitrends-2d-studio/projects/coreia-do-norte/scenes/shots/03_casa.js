// shots/03_casa.js — a casa: a sala com os retratos, a limpeza, os vizinhos; à noite, os pais; o fim (s15–s20, s34, s38, s55, s58).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, linGrad, backdrop, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, face } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { home, lowTable, bowl } from '../sets/places.js';
import { portrait, portraitPair, faceWithScarf, scarfOn, cross, FLOOR, ground } from '../sets/common.js';
import { VOCE, VOCE_KID, MAE, PAI, VIZINHA, OFICIAL, LENCO } from '../cast.js';

const rimOf = (M, dir = [0.4, -1]) => ({ color: M.rim, dir, w: 5 });
// zoom uniforme (sem parallax) em torno de um ponto
function zoomAt(g, cx, cy, z) { g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); }

// s15 — "Você cresce numa casa onde a parede mais importante da sala" — a família à mesa, push-in até a parede
registerShot('s15', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.0 + 0.14 * k, y: -150 * k };
  const { GY, CX, M } = home(g, t, cam, {});
  layer(g, cam, 1, (g) => {
    const s = 2.1;
    drawFigure(g, { x: CX - 300, y: GY + 20, s, facing: 1, outfit: PAI, pose: breathe(FLOOR, t, 0.5, 1), expr: 'neutral', rim: rimOf(M), shadow: false });
    const kid = { x: CX - 70, y: GY + 20, s, facing: 1, outfit: VOCE_KID, pose: breathe(FLOOR, t, 0.5, 3), expr: 'neutral', look: [0.3, -0.8], rim: rimOf(M), shadow: false };
    drawFigure(g, kid);
    drawFigure(g, { x: CX + 290, y: GY + 20, s, facing: -1, outfit: MAE, pose: breathe(FLOOR, t, 0.5, 2), expr: 'neutral', rim: rimOf(M, [-0.4, -1]), shadow: false });
    const top = lowTable(g, CX + 80, GY + 60, 420);
    bowl(g, CX - 10, top, 1.2, true); bowl(g, CX + 90, top, 1.2, true); bowl(g, CX + 190, top, 1.2, true);
  });
  FX.dust(g, t, { count: 40, color: M.practical, a: 0.35 });
} });

// s16 — "não tem foto da família." — o espaço vazio na parede, riscado
registerShot('s16', { draw(g, t, info) {
  const M = mood('interiorWarm'), k = ease.inOut(t / info.dur), wall = shade(M.wall, -0.1);
  g.save(); zoomAt(g, E.W / 2, E.H * 0.42, 1.0 + 0.05 * k); g.translate(-30 * k, 0);
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, [shade(wall, -0.4), wall, shade(wall, -0.3)]); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  for (let x = -E.W; x < E.W * 2; x += 180) { g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(x, -E.H, 60, E.H * 3); }
  portraitPair(g, E.W + 210, 260, 300, 400, M, { lamps: true });
  // contorno da foto que não está ali
  const x = 140, y = 560, w = 420, h = 320, a = ease.out(prog(t, 0.1, 0.5));
  g.save(); g.globalAlpha *= a; g.setLineDash([18, 14]); g.strokeStyle = alpha(S().ui.cream, 0.6); g.lineWidth = 5; g.strokeRect(x, y, w, h); g.setLineDash([]);
  g.fillStyle = alpha('#000', 0.12); g.fillRect(x, y, w, h);
  const fc = alpha(S().ui.cream, 0.28);
  for (const [dx, sc] of [[0.3, 1], [0.5, 0.7], [0.7, 1]]) { circle(g, x + w * dx, y + h * 0.42, 34 * sc, fc); g.fillStyle = fc; g.beginPath(); g.ellipse(x + w * dx, y + h * 0.95, 60 * sc, 90 * sc, 0, Math.PI, 0); g.fill(); }
  text(g, 'FAMÍLIA', x + w / 2, y + h + 50, { size: 36, color: alpha(S().ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 6 });
  g.restore();
  cross(g, x + w / 2, y + h / 2, 150, S().ui.accent, prog(t, 0.75, 1.15));
  g.restore();
  FX.dust(g, t, { count: 30, color: M.practical, a: 0.35 });
} });

// s17 — "Tem os retratos de Kim Il Sung e Kim Jong Il." — o rosto da criança diante dos retratos
registerShot('s17', { draw(g, t, info) {
  const M = mood('interiorWarm'), CX = E.W / 2, k = ease.inOut(t / info.dur);
  const cam = { z: 1.02 + 0.06 * k, y: -26 * k }, pw = 300, ph = 400, py = E.H * 0.13;
  layer(g, cam, 0.6, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H * 0.3, 0, E.H * 1.3, [shade(M.wall, -0.5), shade(M.wall, -0.1), shade(M.dark, -0.2)]); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let x = -E.W; x < E.W * 2; x += 180) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(x, -E.H, 3, E.H * 3); }
    portraitPair(g, CX, py, pw, ph, M, { lamps: true });
    const sy = py + ph + 100; g.fillStyle = shade(M.wall, -0.55); g.fillRect(CX - 380, sy, 760, 16); g.fillStyle = alpha(M.rim, 0.5); g.fillRect(CX - 380, sy, 760, 3);
    rr(g, CX - 52, sy - 26, 104, 26, 9); g.fillStyle = shade(S().ui.cream, -0.1); g.fill();
  });
  veil(g, M.dark, 0.16);
  const r = 322 * (1 + 0.035 * k), cy = E.H * 0.635, look = [lerp(-0.35, 0.35, ease.inOut(prog(t, 0.4, 1.9))), -0.95];
  faceWithScarf(g, CX, cy, r, { outfit: VOCE_KID, expr: t < 1.8 ? 'awe' : 'surprised', look, rimColor: M.rim, blink: t > 2.2 && t < 2.32 });
  glow(g, CX, cy - r * 1.5, r * 1.6, M.practical, 0.1);
  FX.dust(g, t, { count: 45, color: M.practical, a: 0.45 });
} });

// s18 — "Eles precisam estar sempre limpos." — a mãe limpa o retrato
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), GY = ground(), CX = E.W / 2;
  g.save(); zoomAt(g, CX - 80, GY - 760, 1.45 + 0.08 * k);
  const { M } = home(g, t, { z: 1 }, {});
  const s = 2.6, x = CX - 124, top = GY - 72 * s;
  FX.stool(g, x, GY, s, '#2a1c18');
  const wipe = Math.sin(t * 9), pose = { ...POSES.pointUp, hF: [22 + wipe * 10, -246 + Math.cos(t * 9) * 8], eF: [18, -206], head: [8, -210] };
  const o = { x, y: top, s, facing: 1, outfit: MAE, pose: breathe(pose, t, 0.4, 2), expr: 'neutral', look: [0.4, -0.8], rim: rimOf(M, [0.5, -1]), shadow: false };
  drawFigure(g, o);
  const hx = x + o.pose.hF[0] * s, hy = top + o.pose.hF[1] * s;
  rr(g, hx - 22, hy - 30, 48, 40, 10); g.fillStyle = '#f4efe6'; g.fill();
  if (t > 1.0) { FX.sparkle(g, hx + 60, hy - 60, 34 * (1 - prog(t, 1.0, 1.9)) + 8, '#fff6dc', 0.9); FX.sparkle(g, hx - 40, hy + 50, 22, '#fff6dc', 0.7 * (1 - prog(t, 1.2, 1.9))); }
  g.restore();
  FX.dust(g, t, { count: 50, color: M.practical, a: 0.4 });
} });

// s19 — "Os vizinhos sabem disso." — rostos espiando pela janela, de fora
registerShot('s19', { draw(g, t, info) {
  const N = mood('night'), M = mood('interiorWarm'), k = ease.inOut(t / info.dur), wall = shade(M.wall, -0.2);
  g.save(); zoomAt(g, E.W / 2, E.H * 0.45, 1.0 + 0.06 * k);
  g.fillStyle = wall; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  FX.windowFrame(g, { x: 110, y: 360, w: 860, h: 980, cols: 2, rows: 2, frame: shade(wall, -0.6), bar: 22 }, (g, x, y, w, h) => {
    g.fillStyle = linGrad(g, 0, y, 0, y + h, N.sky); g.fillRect(x, y, w, h); FX.stars(g, t, { count: 40, area: [x, y, w, h * 0.5] });
    FX.skyline(g, { x, y: y + h * 0.75, w, maxH: 220, color: N.dark, windowColor: alpha(M.practical, 0.4), lit: 0.05, seed: 3 });
    const peek = ease.out(prog(t, 0.05, 0.5));
    // duas cabeças de vizinhos surgindo de baixo
    for (const [hx, r, of, rise] of [[x + w * 0.3, 150, VIZINHA, 1], [x + w * 0.72, 130, { top: 'none' }, 0.85]]) {
      const hy = y + h + r * 0.4 - r * 1.25 * peek * rise;
      g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
      bigFace(g, hx, hy, r, { outfit: of, expr: 'smirk', look: [hx < x + w / 2 ? 0.6 : -0.6, 0.3], rimColor: N.rim, rimSide: hx < x + w / 2 ? -1 : 1 });
      g.restore();
    }
    glow(g, x + w / 2, y + h, 500, M.practical, 0.12);
  });
  g.fillStyle = alpha(M.practical, 0.12); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  g.restore();
  blurLayer(g, 10, (g) => { g.fillStyle = '#5a2a2a'; g.beginPath(); g.moveTo(-50, -50); g.quadraticCurveTo(220, 600, 120, E.H + 50); g.lineTo(-50, E.H + 50); g.fill(); });
} });

// s20 — "E podem aparecer pra conferir." — a porta abre: a chefe do bairro inspeciona a moldura
registerShot('s20', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.06 + 0.04 * k, x: 60 }, open = ease.out(prog(t, 0, 0.35));
  const sh = t < 0.4 ? shake(t, 6, 20) : [0, 0];
  g.save(); g.translate(sh[0], sh[1]);
  const { GY, CX, M } = home(g, t, cam, { doorOpen: open * 0.85, doorLight: '#cfd8f0' });
  layer(g, cam, 1, (g) => {
    const s = 2.0;
    drawFigure(g, { x: CX - 330, y: GY, s, facing: 1, outfit: PAI, pose: breathe(POSES.stand, t, 0.3, 1), expr: 'nervous', rim: rimOf(M), blink: false });
    const kid = { x: CX - 180, y: GY, s, facing: 1, outfit: VOCE_KID, pose: breathe(POSES.stand, t, 0.3, 3), expr: 'nervous', rim: rimOf(M) }; drawFigure(g, kid); scarfOn(g, kid);
    drawFigure(g, { x: CX - 40, y: GY, s, facing: 1, outfit: MAE, pose: breathe(POSES.stand, t, 0.3, 2), expr: 'nervous', rim: rimOf(M) });
    const vx = lerp(CX + 440, CX + 250, ease.out(prog(t, 0.2, 0.9)));
    drawFigure(g, { x: vx, y: GY, s, facing: -1, outfit: VIZINHA, pose: posesAt(t, [[0, walkPose(t * 6)], [0.9, POSES.pointUp]]), expr: 'determined', look: [-0.4, -0.8], rim: { color: '#cfd8f0', dir: [1, -0.4], w: 5 } });
  });
  g.restore();
  FX.dust(g, t, { count: 40, color: M.practical, a: 0.35 });
} });

// s34 — "Seus pais ainda lembram da fome dos anos 90." — os pais à luz de vela, lembrança sépia
registerShot('s34', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.08 + 0.06 * k, y: 40 };
  const { GY, CX, M } = home(g, t, cam, { night: true, lamp: false });
  veil(g, '#05040a', 0.35);
  layer(g, cam, 1, (g) => {
    const s = 2.2, cx = CX + 40, fl = 1 + 0.08 * Math.sin(t * 13) + 0.05 * Math.sin(t * 7);
    glow(g, cx, GY - 140, 520 * fl, '#ffb060', 0.45); FX.pool(g, cx, GY + 60, 420, 80, '#ffb060', 0.3);
    const rim = { color: '#ffc080', dir: [0, -1], w: 5 };
    drawFigure(g, { x: cx - 250, y: GY + 20, s, facing: 1, outfit: PAI, pose: breathe({ ...FLOOR, head: [12, -134] }, t, 0.4, 1), expr: 'sad', rim: { ...rim, dir: [1, -0.3] }, shadow: false });
    drawFigure(g, { x: cx + 250, y: GY + 20, s, facing: -1, outfit: MAE, pose: breathe({ ...FLOOR, head: [12, -134] }, t, 0.4, 2), expr: 'sad', rim: { ...rim, dir: [-1, -0.3] }, shadow: false });
    const top = lowTable(g, cx, GY + 60, 380);
    bowl(g, cx - 90, top, 1.3, false); bowl(g, cx + 90, top, 1.3, false);
    rr(g, cx - 10, top - 46, 20, 46, 4); g.fillStyle = '#efe6d4'; g.fill(); g.fillStyle = '#ffd890'; g.beginPath(); g.ellipse(cx, top - 58 - 3 * fl, 7, 15 * fl, 0, 0, 7); g.fill(); glow(g, cx, top - 58, 90, '#ffd890', 0.8);
  });
  // a lembrança: um balão sépia com uma tigela vazia
  const a = ease.out(prog(t, 0.6, 1.1)), bx = CX, by = 560;
  if (a > 0) {
    g.save(); g.globalAlpha *= a;
    for (const [dx, dy, r] of [[-60, 330, 18], [-30, 270, 28]]) circle(g, bx + dx, by + dy, r, '#d8b888');
    rr(g, bx - 300, by - 210, 600, 420, 60); g.fillStyle = '#c8a070'; g.fill(); rr(g, bx - 280, by - 190, 560, 380, 50); g.fillStyle = linGrad(g, 0, by - 190, 0, by + 190, ['#5a4030', '#3a2a20']); g.fill();
    bowl(g, bx, by + 70, 3.0, false);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.3 + i / 3) % 1; g.strokeStyle = alpha('#d8c0a0', 0.25 * Math.sin(ph * Math.PI)); g.lineWidth = 6; g.beginPath(); g.moveTo(bx - 40 + i * 40, by + 20 - ph * 60); g.quadraticCurveTo(bx - 20 + i * 40, by - 30 - ph * 80, bx - 40 + i * 40, by - 70 - ph * 90); g.stroke(); }
    text(g, 'ANOS 90', bx, by - 120, { size: 64, color: '#f4dcb0', font: FONTS.serif, weight: 900, italic: true });
    g.restore();
  }
  FX.dust(g, t, { count: 30, color: '#ffc080', a: 0.3 });
} });

// s38 — "E o seu corpo sente isso:" — rosto do adolescente
registerShot('s38', { draw(g, t, info) {
  blurLayer(g, 14, (g) => home(g, t, { z: 1.4, x: -120, y: -300 }, { night: true }));
  veil(g, '#0a0812', 0.4);
  const M = mood('interiorWarm'), r = 320 * (1 + 0.04 * t), cx = E.W / 2, cy = E.H * 0.56;
  bigFace(g, cx, cy, r, { outfit: VOCE, expr: t < 0.6 ? 'neutral' : 'worried', look: [0, lerp(-0.2, 0.9, ease.inOut(prog(t, 0.3, 0.9)))], rimColor: M.rim, rimSide: 1, blink: t > 1.25 && t < 1.37 });
  FX.dust(g, t, { count: 30, color: M.practical, a: 0.35 });
} });

// s55 — "E a sua família pode ser punida junto." — a porta dos pais abre com lanterna
registerShot('s55', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.06 + 0.06 * k, x: 40 }, open = ease.out(prog(t, 0.05, 0.3));
  const sh = t < 0.5 ? shake(t, 9 * (1 - t / 0.5), 24) : [0, 0];
  g.save(); g.translate(sh[0], sh[1]);
  const { GY, CX, M } = home(g, t, cam, { night: true, lamp: false, doorOpen: open, doorLight: '#e8eeff' });
  veil(g, '#05040a', 0.3);
  layer(g, cam, 1, (g) => {
    const s = 2.1, cold = { color: '#dfe6ff', dir: [1, -0.3], w: 5 };
    // facho de lanterna vindo da porta
    g.save(); g.globalCompositeOperation = 'lighter'; const sw = Math.sin(t * 2.2) * 0.12;
    g.fillStyle = linGrad(g, CX + 420, 0, CX - 400, 0, ['rgba(230,238,255,.35)', 'rgba(230,238,255,0)']); g.beginPath(); g.moveTo(CX + 380, GY - 300); g.lineTo(CX - 500, GY - 700 + sw * 600); g.lineTo(CX - 500, GY + 50 + sw * 600); g.closePath(); g.fill(); g.restore();
    drawFigure(g, { x: CX + 420, y: GY, s, facing: -1, outfit: OFICIAL, pose: { ...POSES.point, hF: [60, -160] }, prop: 'flashlight', expr: 'angry', rim: { color: '#dfe6ff', dir: [-1, -0.3], w: 4 } });
    drawFigure(g, { x: CX - 150, y: GY, s, facing: 1, outfit: PAI, pose: breathe({ ...POSES.stand, eF: [24, -150], hF: [40, -150] }, t, 0.3, 1), expr: 'scared', rim: cold });
    drawFigure(g, { x: CX - 300, y: GY, s, facing: 1, outfit: MAE, pose: breathe(POSES.handsOnHead, t, 0.3, 2), expr: 'cry', rim: cold });
  });
  g.restore();
} });

// s58 — "ou ficaria?" — você na janela de casa, à noite
registerShot('s58', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), GY = ground(), CX = E.W / 2;
  g.save(); zoomAt(g, CX - 330, GY - 620, 1.35 + 0.05 * k);
  const { M } = home(g, t, { z: 1 }, { night: true, lamp: true });
  const N = mood('night');
  drawFigure(g, { x: CX - 120, y: GY, s: 2.3, facing: -1, outfit: VOCE, pose: breathe({ ...POSES.stand, head: [6, -206] }, t, 0.4, 1), expr: 'sad', look: [-0.8, -0.2], rim: { color: N.rim, dir: [-1, -0.3], w: 5 } });
  glow(g, CX - 380, GY - 640, 420, N.key, 0.12);
  g.restore();
  FX.dust(g, t, { count: 30, color: M.practical, a: 0.3 });
} });
