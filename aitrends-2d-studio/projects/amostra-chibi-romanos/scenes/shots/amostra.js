// shots/amostra.js — amostra de 10 s no estilo chibi 3D (mesma narração do vídeo do acampamento romano).
import { E, S, registerShot, ease, prog, lerp } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import { germania, warrior, flicker } from '../sets/germania_toon.js';
import { labelTitle } from '../sets/common.js';

// c1 — o acampamento romano visto da beira da floresta, com o título
registerShot('c1', { kind: '3d',
  init(T) { const g = germania(T, { fov: 46 }); return { stage: g.st, g }; },
  draw(s, t, info, T) { flicker(s.g.torches, t); s.g.motes.rotation.y = t * 0.02; T.dolly(s.stage.camera, t, [[0, { pos: [0.2, 1.6, 4.5], look: [0, 2.2, -16] }], [info.dur, { pos: [0.1, 1.5, 3.0], look: [0, 2.1, -16] }]]); },
  overlay(g, t, info) { UI.titleCard(g, t + 0.2, { lines: ['O QUE ACONTECERIA', 'SE VOCÊ ATACASSE UM', 'EXÉRCITO ROMANO', 'ENQUANTO ELE DORMIA?'], dur: info.dur + 0.4, y: E.H * 0.27 }); },
});
// c2 — "Germânia. Ano 15."
registerShot('c2', { kind: '3d',
  init(T) { const g = germania(T, { fov: 50, seed: 5 }); return { stage: g.st, g }; },
  draw(s, t, info, T) { flicker(s.g.torches, t); s.g.motes.rotation.y = t * 0.02; T.dolly(s.stage.camera, t, [[0, { pos: [-1.5, 3.2, 3.5], look: [0.5, 2.0, -10] }], [info.dur, { pos: [-1.0, 2.8, 2.6], look: [0.5, 1.8, -10] }]]); },
  overlay(g, t) { labelTitle(g, t, 'GERMÂNIA', 'ANO 15', E.H * 0.28, { at: 0.1, big: 110 }); },
});
// c3 — "Você é um guerreiro germânico,"
registerShot('c3', { kind: '3d',
  init(T) { const g = germania(T, { fov: 42, seed: 7, clear: [[0.7, 2.4, 2.2]] }), w = warrior(T, { expr: 'neutral' }); w.position.set(0, 0, -1.0); w.rotation.y = -0.25; g.st.add(w); return { stage: g.st, g, w }; },
  draw(s, t, info, T) { flicker(s.g.torches, t); s.w.userData.idle(t); s.w.userData.arms[1].rotation.x = -0.35; s.w.userData.setExpr(t > 0.8 ? 'angry' : 'neutral', t > 0.5 && t < 0.62);
    s.g.fill.intensity = 7; s.g.fill.position.set(1.2, 1.8, 1.6);
    T.dolly(s.stage.camera, t, [[0, { pos: [0.8, 1.2, 3.0], look: [0, 1.0, -1] }], [info.dur, { pos: [0.65, 1.15, 2.6], look: [0, 1.0, -1] }]]); },
});
// c4 — "escondido na floresta, no meio da noite." — agachado atrás de um tronco, espiando
registerShot('c4', { kind: '3d',
  init(T) {
    const { THREE } = T, g = germania(T, { fov: 44, seed: 9, campZ: -12, clear: [[-1.4, 1.4, 2.6], [0, 0, 1.4]] }), w = warrior(T, { expr: 'neutral', spear: false });
    w.position.set(-0.2, -0.28, 0.3); w.rotation.y = Math.PI - 0.35; g.st.add(w);
    const trunk = T.cyl(0.32, 0.4, 9, '#221e30', 0.75, 4.5, -0.3, 10); g.st.add(trunk);
    w.userData.legs.forEach((l, i) => { l.rotation.x = i ? 1.3 : -0.2; }); w.userData.arms[0].rotation.x = -1.1;
    return { stage: g.st, g, w };
  },
  draw(s, t, info, T) {
    flicker(s.g.torches, t); s.g.motes.rotation.y = t * 0.02;
    s.g.fill.intensity = 6; s.g.fill.position.set(-1.6, 1.6, 1.8);
    s.w.userData.head.rotation.y = 0.25 * Math.sin(t * 0.8); s.w.userData.setExpr('neutral', t > 1.6 && t < 1.72);
    T.dolly(s.stage.camera, t, [[0, { pos: [-2.2, 1.35, 3.4], look: [0.3, 0.85, -3] }], [info.dur, { pos: [-1.9, 1.3, 2.9], look: [0.3, 0.85, -3] }]]);
  },
});
