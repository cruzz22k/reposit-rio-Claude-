// shots/narrado.js — história narrada no formato "fotos": a casa, o corredor, a porta que abre sozinha.
import { E, registerShot, ease, prog, lerp } from '/engine/core.js';
import { oldHouse, hallway, filmPost } from '../sets/horror.js';

// n1 — "Na casa da minha avó," — zoom lento na casa antiga
registerShot('n1', { kind: '3d',
  init(T) { return { stage: oldHouse(T) }; },
  draw(s, t, info, T) { const k = t / 1.75; T.dolly(s.stage.camera, k * info.dur, [[0, { pos: [2.4, 1.1, 19], look: [0, 3.4, -4], fov: 42 }], [info.dur, { pos: [2.1, 1.15, 17.2], look: [0, 3.4, -4], fov: 41 }]]); },
  overlay(g, t) { filmPost(g, t, { tint: '#c8ccd8', desat: 0.85 }); },
});
// n2 — "tinha uma porta que ninguém podia abrir." — avanço lento pelo corredor
registerShot('n2', { kind: '3d',
  init(T) { const h = hallway(T); h.doorPiv.rotation.y = 0; return { stage: h.st, h }; },
  draw(s, t, info, T) { s.h.bulb.intensity = 12 * (0.85 + 0.15 * Math.sin(t * 31) * Math.sin(t * 7)); T.dolly(s.stage.camera, t, [[0, { pos: [0.15, 1.55, 0.6], look: [0, 1.1, -11] }], [info.dur, { pos: [0.1, 1.5, -1.4], look: [0, 1.1, -11] }]]); },
  overlay(g, t) { filmPost(g, t, { tint: '#d8c8b0' }); },
});
// n3 — "Toda noite, às três da manhã... ela abria sozinha." — a porta abre; dedos aparecem na borda
registerShot('n3', { kind: '3d',
  init(T) { const h = hallway(T, { fov: 40 }); const cold = new T.THREE.PointLight('#b8c4ff', 5, 4.5, 1.6); cold.position.set(0.5, 1.7, -h.L + 2.8); h.st.add(cold); return { stage: h.st, h }; },
  draw(s, t, info, T) {
    const open = 0.08 + 0.32 * ease.inOut(prog(t, 2.6, 3.6)); s.h.doorPiv.rotation.y = open;
    const ex = -0.45 + 0.9 * Math.cos(open), ez = (-s.h.L + 1.06) - 0.9 * Math.sin(open); s.h.hand.position.set(ex - 0.06, 0, ez - 0.05); s.h.hand.rotation.y = -open + 0.35; s.h.fingers.forEach((k, i) => (k.rotation.y = -0.9 - i * 0.08 + Math.sin(t * 9 + i) * 0.05 * (t > 4.3 ? 1 : 0)));
    s.h.eyes.visible = t > 5.15; s.h.eyes.position.set(ex + 0.06, -0.02, ez - 0.32); s.h.eyes.scale.set(0.8, 1, 1);
    s.h.hand.visible = t > 4.3; s.h.bulb.intensity = t > 4.45 ? 1 + (Math.sin(t * 40) > 0 ? 10 : 0) : 12 * (0.9 + 0.1 * Math.sin(t * 29));
    const L = s.h.L, push = ease.inOut(prog(t, 0, info.dur));
    T.dolly(s.stage.camera, t, [[0, { pos: [0.25, 1.4, -L + 5.2], look: [-0.1, 1.15, -L + 1] }], [4.4, { pos: [0.15, 1.35, -L + 3.6], look: [-0.25, 1.2, -L + 1] }], [4.5, { pos: [0.75, 1.45, -L + 3.1], look: [0.4, 1.4, -L + 0.6], fov: 34 }], [info.dur, { pos: [0.7, 1.45, -L + 2.75], look: [0.4, 1.42, -L + 0.6], fov: 34 }]]);
  },
  overlay(g, t) { filmPost(g, t, { tint: '#d8c8b0', noise: t > 4.45 && t < 5.0 ? 0.25 : 0.05 }); },
});
