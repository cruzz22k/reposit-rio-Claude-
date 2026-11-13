// shots/teste.js — teste de estilo toon chibi (3 tomadas).
import { E, registerShot, ease, prog, lerp } from '/engine/core.js';
import { chibi, nightGarden } from '../sets/toon.js';

const HERO = { robe: '#3e6a5a', robe2: '#e8e0d0', sash: '#24303a', legs: '#cfc4a8' };

// t1 — andando pela trilha de flores
registerShot('t1', { kind: '3d',
  init(T) { const g = nightGarden(T, { fov: 50 }), h = chibi(T, HERO); g.st.add(h); return { stage: g.st, h, motes: g.motes }; },
  draw(s, t, info, T) {
    const z = lerp(-4.2, -1.9, t / info.dur); s.h.position.set(Math.sin(((3 - z) / 0.62) * 0.45) * 0.3, 0, z); s.h.rotation.y = 0.1; s.h.userData.walk(t, 0.9); s.h.userData.setExpr('neutral', t > 1.9 && t < 2.02);
    s.motes.rotation.y = t * 0.03;
    T.dolly(s.stage.camera, t, [[0, { pos: [0.9, 1.7, 3.2], look: [0, 0.9, -4.0] }], [info.dur, { pos: [0.7, 1.55, 3.6], look: [0, 0.9, -2.2] }]]);
  } });
// t2 — close do rosto
registerShot('t2', { kind: '3d',
  init(T) { const g = nightGarden(T, { fov: 42 }), h = chibi(T, HERO); h.position.set(0, 0, -0.4); g.st.add(h); return { stage: g.st, h, motes: g.motes }; },
  draw(s, t, info, T) {
    s.h.userData.idle(t); s.h.userData.setExpr('neutral', t > 1.25 && t < 1.37); s.motes.rotation.y = t * 0.03;
    T.dolly(s.stage.camera, t, [[0, { pos: [0.35, 1.25, 1.9], look: [0, 1.15, -0.4] }], [info.dur, { pos: [0.28, 1.25, 1.6], look: [0, 1.15, -0.4] }]]);
  } });
// t3 — uma luz acende na mão
registerShot('t3', { kind: '3d',
  init(T) {
    const { THREE } = T, g = nightGarden(T, { fov: 44 }), h = chibi(T, { ...HERO, robe: '#4a8a7a' }); h.position.set(0, 0, -0.4); g.st.add(h);
    const arm = h.userData.arms[1];
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 14), new THREE.MeshBasicMaterial({ color: '#bff4ff' })); orb.position.set(0, -0.52, 0.06); arm.add(orb);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), new THREE.MeshBasicMaterial({ color: '#8fe8ff', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })); orb.add(halo);
    const pl = new THREE.PointLight('#9fe8ff', 0, 1.6, 2); orb.add(pl);
    return { stage: g.st, h, orb, halo, pl, motes: g.motes };
  },
  draw(s, t, info, T) {
    s.h.userData.idle(t);
    const raise = ease.inOut(prog(t, 0.1, 0.8)); s.h.userData.arms[1].rotation.x = -0.85 * raise; s.h.userData.arms[1].rotation.z = 0.18 - 0.3 * raise;
    const on = ease.out(prog(t, 0.95, 1.5)); s.orb.scale.setScalar(Math.max(0.001, on * (1 + 0.06 * Math.sin(t * 9)))); s.pl.intensity = 0.9 * on; s.halo.scale.setScalar(1 + 0.25 * Math.sin(t * 5));
    s.h.userData.setExpr(t > 1.2 ? 'surprised' : 'neutral'); s.h.userData.head.rotation.x = 0.25 * ease.inOut(prog(t, 1.0, 1.6));
    s.motes.rotation.y = t * 0.03;
    T.dolly(s.stage.camera, t, [[0, { pos: [0.6, 1.2, 2.4], look: [0, 0.95, -0.4] }], [info.dur, { pos: [0.45, 1.15, 2.0], look: [0.05, 0.95, -0.4] }]]);
  } });
