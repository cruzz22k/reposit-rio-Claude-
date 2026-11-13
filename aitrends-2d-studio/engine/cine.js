// engine/cine.js — recursos cinematográficos para as cenas 2D:
// câmera com movimento de mão e trajetória suave, foco que muda (rack focus), bokeh no primeiro plano,
// névoa que desliza, feixes de luz que respiram, e um "punch-in" para batidas fortes.
import { E, noise, lerp, clamp, ease, prog, alpha, radGrad, rng, layer, blurLayer } from './core.js';
import * as FX from './fx2d.js';

// leve movimento de câmera na mão (deriva orgânica, nunca parada)
export function handheld(t, amp = 6, seed = 1) {
  return { x: noise(t * 0.55, seed) * amp, y: noise(t * 0.47, seed + 5) * amp * 0.7, r: noise(t * 0.4, seed + 11) * 0.0045 * (amp / 6) };
}
// trajetória de câmera de a para b (z, x, y, r) com easing + mão; o.hand = amplitude da mão, o.ease = curva
export function camPath(t, dur, a, b, o = {}) {
  const k = (o.ease || ease.inOut)(clamp(t / dur)), h = handheld(t + (o.seed ?? 1) * 3, o.hand ?? 5, o.seed ?? 1);
  return { z: lerp(a.z ?? 1, b.z ?? 1, k), x: lerp(a.x ?? 0, b.x ?? 0, k) + h.x, y: lerp(a.y ?? 0, b.y ?? 0, k) + h.y, r: lerp(a.r ?? 0, b.r ?? 0, k) + h.r };
}
// punch-in: um empurrão rápido de zoom numa batida (t0), que assenta
export const punch = (t, t0, amt = 0.06) => (t < t0 ? 0 : amt * Math.exp(-(t - t0) * 6) * Math.sin(Math.min(1, (t - t0) * 8) * Math.PI / 2) + amt * 0.35 * ease.out(prog(t, t0, t0 + 0.4)));
// foco: valor de desfoque que vai de `from` a `to` entre at e at+dur
export const focus = (t, at, dur, from, to) => lerp(from, to, ease.inOut(prog(t, at, at + dur)));
// desenha uma camada com desfoque (profundidade de campo) e parallax da câmera
export function dof(g, amount, cam, depth, fn) { if (amount < 0.4) layer(g, cam, depth, fn); else blurLayer(g, amount, fn, cam, depth); }

// bokeh: discos de luz desfocados flutuando no primeiro plano
export function bokeh(g, t, o = {}) {
  const { count = 9, color = '#ffd8a0', a = 0.16, seed = 3, rMin = 28, rMax = 120, drift = 10 } = o, r = rng(seed);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < count; i++) {
    const bx = r() * E.W, by = r() * E.H, rad = rMin + r() * (rMax - rMin), sp = r() - 0.5, ph = r() * 6.28;
    const x = bx + Math.sin(t * 0.3 + ph) * drift * 3 + t * drift * sp * 2, y = by + Math.cos(t * 0.23 + ph) * drift * 2;
    const p = a * (0.65 + 0.35 * Math.sin(t * (0.6 + r()) + ph));
    g.fillStyle = radGrad(g, x, y, 0, rad, [alpha(color, p), [0.72, alpha(color, p * 0.85)], [0.9, alpha(color, p * 0.35)], alpha(color, 0)]);
    g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
  }
  g.restore();
}
// névoa que desliza em bandas (o efeito de profundidade mais barato e mais bonito)
export function fogDrift(g, t, y, h, color, o = {}) {
  const { a = 0.22, speed = 16, seed = 2, count = 7 } = o, r = rng(seed);
  for (let i = 0; i < count; i++) {
    const w = 520 + r() * 700, span = E.W + w * 2, x = ((r() * span + t * speed * (0.5 + r())) % span) - w, yy = y + r() * h, cx = x + w / 2;
    g.save(); g.translate(cx, yy); g.scale(1, 0.16 + r() * 0.1);
    g.fillStyle = radGrad(g, 0, 0, 0, w / 2, [alpha(color, a), alpha(color, 0)]); g.beginPath(); g.arc(0, 0, w / 2, 0, Math.PI * 2); g.fill(); g.restore();
  }
}
// feixes de luz que balançam e respiram (lua, sol, janela)
export function shafts(g, t, x, y, o = {}) {
  const { angle = Math.PI / 2, spread = 0.7, len = 1800, color = '#cfd8ff', a = 0.08, count = 7 } = o;
  FX.godRays(g, x, y, { count, angle: angle + Math.sin(t * 0.25) * 0.04, spread, len, color, a: a * (0.8 + 0.2 * Math.sin(t * 0.7)), t, width: 0.06 });
}
// galhos/folhas desfocados passando bem perto da câmera (primeiro plano)
export function foreLeaves(g, t, cam, o = {}) {
  const { color = '#05070c', side = -1, amount = 12, y = E.H * 0.2, seed = 4 } = o, r = rng(seed);
  blurLayer(g, amount, (g) => {
    g.fillStyle = color;
    const bx = side < 0 ? -120 : E.W + 120;
    for (let i = 0; i < 9; i++) { const yy = y + i * 120 + Math.sin(t * 0.8 + i) * 10, l = 220 + r() * 220, a = side < 0 ? -0.3 + r() * 0.6 : Math.PI - 0.3 + r() * 0.6;
      g.save(); g.translate(bx, yy); g.rotate(a + Math.sin(t * 0.9 + i) * 0.04); g.beginPath(); g.ellipse(l / 2, 0, l / 2, 26 + r() * 20, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
  }, cam, 1.8);
}
