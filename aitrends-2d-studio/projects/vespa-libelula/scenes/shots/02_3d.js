// shots/02_3d.js — as cenas 3D (como no vídeo da Coreia): o lago, a vespa sobre o lago, a libélula parada no ar, as quatro asas, a floresta pré-histórica.
import { E, V, S, registerShot, mood, ease, prog, clamp, lerp, alpha, shade, mix, rng, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { labelTitle } from '../sets/common.js';
import { SKY } from '../sets/bugs.js';
import { VESPA, LIBELULA, GOLD } from '../cast.js';

const INK = () => S().ink;
// ---------- modelos ----------
function stripes(T) { return T.canvasTex(64, 256, (g, w, h) => { g.fillStyle = VESPA.yellow; g.fillRect(0, 0, w, h); g.fillStyle = '#16121a'; for (let i = 0; i < 5; i++) g.fillRect(0, 30 + i * 46, w, 22); }); }
function wingMat(T, THREE, tint = '#dff4ff', veins = false) {
  const tex = T.canvasTex(64, 256, (g, w, h) => { g.fillStyle = 'rgba(230,245,255,.35)'; g.fillRect(0, 0, w, h); if (veins) { g.strokeStyle = 'rgba(160,210,230,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke(); for (let i = 1; i < 10; i++) { g.beginPath(); g.moveTo(4, i * h / 10); g.lineTo(w - 4, i * h / 10 + 8); g.stroke(); } } });
  return new THREE.MeshBasicMaterial({ map: tex, color: tint, transparent: true, opacity: 0.38, side: THREE.DoubleSide, depthWrite: false, fog: false });
}
export function waspMesh(T) {
  const { THREE } = T, root = new THREE.Group(), ink = T.mat(INK(), { roughness: 0.5 });
  const head = T.sphere(0.22, ink, 0.55, 0.05, 0); root.add(head);
  for (const z of [-0.1, 0.1]) { root.add(T.sphere(0.06, T.basic('#f4efe6'), 0.72, 0.1, z)); root.add(T.sphere(0.03, T.basic('#0e0b12'), 0.77, 0.1, z)); }
  const thorax = T.sphere(0.26, ink, 0.18, 0, 0); root.add(thorax);
  const ab = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16), T.mat('#ffffff', { map: stripes(T), roughness: 0.5 })); ab.rotation.z = Math.PI / 2; ab.scale.set(1, 1.55, 1); ab.position.set(-0.45, -0.05, 0); ab.castShadow = true; root.add(ab);
  root.add(T.cone(0.05, 0.18, ink, -0.95, -0.07, 0)); root.children[root.children.length - 1].rotation.z = Math.PI / 2;
  for (const z of [-0.15, 0.15]) { const a = T.cyl(0.012, 0.012, 0.5, ink, 0.75, 0.32, z * 0.6); a.rotation.z = -0.7; root.add(a); }
  for (let i = 0; i < 3; i++) for (const z of [-1, 1]) { const l = T.cyl(0.015, 0.015, 0.45, ink, 0.1 + i * 0.12, -0.3, z * 0.2); l.rotation.x = z * 0.5; root.add(l); }
  const wings = [], wm = wingMat(T, THREE);
  for (const z of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(0.15, 0.2, z * 0.08); const w = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.22), wm); w.position.set(-0.3, 0, z * 0.0); w.rotation.x = Math.PI / 2; piv.add(w); root.add(piv); wings.push({ piv, z }); }
  root.userData.flap = (t) => wings.forEach(({ piv, z }) => { piv.rotation.x = z * (0.3 + Math.sin(t * 55) * 0.6); });
  return root;
}
export function dragonflyMesh(T, o = {}) {
  const { THREE } = T, root = new THREE.Group(), body = T.mat(LIBELULA.body, { roughness: 0.4 }), ink = T.mat(INK(), { roughness: 0.5 });
  root.add(T.sphere(0.15, ink, 0.62, 0, 0));
  for (const z of [-1, 1]) { root.add(T.sphere(0.17, T.mat(LIBELULA.eye, { roughness: 0.25, emissive: new THREE.Color(LIBELULA.eye), emissiveIntensity: 0.25 }), 0.66, 0.08, z * 0.12)); root.add(T.sphere(0.06, T.basic('#f4efe6'), 0.8, 0.1, z * 0.15)); root.add(T.sphere(0.03, T.basic('#0e0b12'), 0.85, 0.1, z * 0.15)); }
  const th = T.sphere(0.24, body, 0.28, 0, 0); th.scale.set(1.3, 1, 0.9); root.add(th);
  const abd = T.cyl(0.07, 0.04, 1.9, body, -0.75, 0.02, 0, 10); abd.rotation.z = Math.PI / 2; root.add(abd);
  for (let i = 0; i < 9; i++) { const r = T.cyl(0.075 - i * 0.003, 0.075 - i * 0.003, 0.03, ink, 0.0 - i * 0.2, 0.02, 0, 10); r.rotation.z = Math.PI / 2; root.add(r); }
  for (let i = 0; i < 3; i++) for (const z of [-1, 1]) { const l = T.cyl(0.012, 0.012, 0.4, ink, 0.32 + i * 0.08, -0.26, z * 0.14); l.rotation.x = z * 0.4; root.add(l); }
  const wings = [], wm = wingMat(T, THREE, '#e8fbff', true);
  [[0.38, -1], [0.38, 1], [0.18, -1], [0.18, 1]].forEach(([x, z], i) => { const piv = new THREE.Group(); piv.position.set(x, 0.18, z * 0.06); const w = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 1.15), wm); w.position.set(0, 0, z * 0.6); w.rotation.x = Math.PI / 2; piv.add(w); root.add(piv); wings.push({ piv, z, ph: [0, 1.7, 0.6, 2.4][i] }); });
  root.userData.flap = (t, speed = 30, amp = 0.5) => wings.forEach(({ piv, z, ph }) => { piv.rotation.x = z * (0.1 + Math.sin(t * speed + ph) * amp); });
  root.traverse((m) => { if (m.isMesh && !m.material.transparent) m.castShadow = true; });
  return root;
}
// ---------- o lago numa tarde quente ----------
function buildLake(T, o = {}) {
  const M = mood('dusk'), { THREE } = T, r = rng(13);
  const st = T.stage({ mood: 'dusk', sky: SKY, fov: V(36, 52), fog: [20, 140], fogColor: mix(SKY[2], '#3a2a4a', 0.5), keyPos: [30, 10, -60], keyColor: '#ffc890', keyIntensity: 2.0, ambient: 0.9, shadowSize: 20, bloom: o.bloom ?? 0.35 });
  if (o.sun !== false) st.add(T.sphere(10, T.basic('#fff0d0', { fog: false }), 40, 14, -160));
  const water = T.plane(400, 400, T.mat(mix(SKY[1], '#2a2a4a', 0.4), { roughness: 0.25, metalness: 0.2 }), 0, 0, -60); water.rotation.x = -Math.PI / 2; st.add(water);
  const glint = new THREE.Mesh(new THREE.PlaneGeometry(10, 120), new THREE.MeshBasicMaterial({ color: '#ffd8a0', transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false })); glint.rotation.x = -Math.PI / 2; glint.position.set(24, 0.02, -90); glint.rotation.z = -0.25; if (o.sun !== false) st.add(glint);
  for (let i = 0; i < 30; i++) st.add(T.tree3D(-90 + i * 6.5 + r() * 3, -70 - r() * 10, 1.6 + r() * 0.8, mix(SKY[1], '#140c1c', 0.6)));
  for (let i = 0; i < 6; i++) { const c = T.cone(18 + r() * 10, 16 + r() * 10, T.mat(mix(SKY[1], '#1a1028', 0.5), { flat: true }), -120 + i * 50, 6, -110, 6); st.add(c); }
  const reedM = T.mat('#2a3a24', { flat: true }), headM = T.mat('#4a2a18');
  for (let i = 0; i < 160; i++) { const x = -14 + r() * 28, z = 2 + r() * 8; if (Math.abs(x) < 2.5 && z < 5) continue; const h = 0.8 + r() * 1.6; const c = T.cone(0.03, h, reedM, x, h / 2, z, 4); c.rotation.z = (r() - 0.5) * 0.25; st.add(c); if (r() < 0.2) st.add(T.cyl(0.05, 0.05, 0.22, headM, x, h - 0.05, z, 6)); }
  for (let i = 0; i < 18; i++) st.add(T.cyl(0.35 + r() * 0.3, 0.35, 0.02, T.mat('#3a6a3a'), -8 + r() * 16, 0.02, -2 - r() * 12, 10));
  return st;
}
// s01 — abertura/capa
registerShot('s01', { kind: '3d',
  init(T) { const st = buildLake(T), df = dragonflyMesh(T); df.position.set(0.4, 1.8, -3); df.rotation.y = -0.5; st.add(df); return { stage: st, df }; },
  draw(s, t, info, T) { s.df.userData.flap(t, 34, 0.55); s.df.position.y = 1.8 + Math.sin(t * 2.2) * 0.06; T.dolly(s.stage.camera, ease.inOut(t / info.dur) * info.dur, [[0, { pos: [-1.2, 1.4, 6.5], look: [0.3, 2.6, -8] }], [info.dur, { pos: [-0.6, 1.6, 4.4], look: [0.3, 2.4, -8] }]]); },
  overlay(g, t, info) { UI.titleCard(g, t + 0.2, { lines: ['O QUE ACONTECERIA', 'SE VOCÊ FOSSE UMA VESPA', 'E CRUZASSE COM UMA', 'LIBÉLULA?'], dur: info.dur + 0.4, y: E.H * 0.24 }); },
});
// s05 — a vespa sobrevoa o lago
registerShot('s05', { kind: '3d',
  init(T) { const st = buildLake(T, { sun: false, bloom: 0.2 }), w = waspMesh(T); st.add(w); const fill = new T.THREE.PointLight('#ffd8b0', 30, 20); st.add(fill); return { stage: st, w, fill }; },
  draw(s, t, info, T) { const d = info.dur, x = lerp(-3, 3, t / d); s.w.userData.flap(t); s.w.position.set(x, 1.4 + Math.sin(t * 3) * 0.08, 0.5); s.w.rotation.y = 0; s.w.rotation.z = Math.sin(t * 2) * 0.05;
    s.fill.position.set(x - 1, 3, 4); T.dolly(s.stage.camera, t, [[0, { pos: [x - 1.4, 2.4, 7.5], look: [x, 1.5, 0] }], [d, { pos: [x - 1.0, 2.1, 6.4], look: [x + 0.2, 1.5, 0] }]]); },
  overlay(g, t) { labelTitle(g, t, 'UMA TARDE QUENTE', 'PERTO DE UM LAGO', 330, { at: 0.2, big: 60 }); },
});
// s07 — a libélula parada no ar como um helicóptero
registerShot('s07', { kind: '3d',
  init(T) { const st = buildLake(T, { sun: false, bloom: 0.2 }), df = dragonflyMesh(T); df.position.set(0, 2.2, 0); st.add(df); return { stage: st, df }; },
  draw(s, t, info, T) { s.df.userData.flap(t, 40, 0.5); s.df.position.y = 2.2 + Math.sin(t * 2.5) * 0.04; T.orbit(s.stage.camera, t, { target: [0, 2.2, 0], radius: 3.4, height: [2.7, 2.3], from: 2.3, to: 3.5, dur: info.dur }); },
});
// s19 — as quatro asas, cada uma no seu ritmo (câmera lenta)
registerShot('s19', { kind: '3d',
  init(T) { const st = buildLake(T, { sun: false, bloom: 0.2 }), df = dragonflyMesh(T); df.position.set(0, 2.2, 0); st.add(df); return { stage: st, df }; },
  draw(s, t, info, T) { s.df.userData.flap(t, 6, 0.7); T.orbit(s.stage.camera, t, { target: [-0.2, 2.25, 0], radius: [3.1, 2.7], height: [3.3, 3.0], from: 2.2, to: 3.1, dur: info.dur }); },
  overlay(g, t) { labelTitle(g, t, 'CADA UMA SOZINHA', '4 ASAS', 330, { at: 0.2, big: 96 }); },
});
// s33 — a floresta pré-histórica e a libélula gigante (60 cm de ponta a ponta)
registerShot('s33', { kind: '3d',
  init(T) {
    const { THREE } = T, r = rng(31), M = mood('dusk');
    const st = T.stage({ mood: 'dusk', sky: ['#1a2a3a', '#3a5a5a', '#c0a070', '#f0d090'], fov: V(36, 52), fog: [8, 70], fogColor: '#4a5a50', keyPos: [20, 16, -30], keyColor: '#ffd8a0', keyIntensity: 1.8, ambient: 1.0, shadowSize: 16 });
    st.add(T.ground(200, 200, '#2a3424'));
    const water = T.plane(30, 30, T.mat('#3a5050', { roughness: 0.2 }), 2, 0.02, -6); water.rotation.x = -Math.PI / 2; st.add(water);
    const trunkM = T.mat('#3a3428', { flat: true }), leafM = T.mat('#2f4a2a', { flat: true });
    for (let i = 0; i < 22; i++) { const x = -20 + r() * 40, z = -6 - r() * 30, h = 8 + r() * 10; st.add(T.cyl(0.35, 0.5, h, trunkM, x, h / 2, z, 7)); for (let k = 1; k < h / 1.2; k++) st.add(T.cyl(0.42, 0.42, 0.08, T.mat('#2a261e'), x, k * 1.2, z, 7)); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, c = T.cone(0.4, 2.6, leafM, x + Math.cos(a) * 1.0, h + 0.2, z + Math.sin(a) * 1.0, 5); c.rotation.z = Math.cos(a) * 1.1; c.rotation.x = -Math.sin(a) * 1.1; st.add(c); } }
    for (let i = 0; i < 70; i++) { const x = -12 + r() * 24, z = 0 - r() * 14; if (Math.abs(x - 1.2) < 1.2 && z > -2) continue; for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + r(), c = T.cone(0.18, 1.4 + r() * 0.8, leafM, x + Math.cos(a) * 0.4, 0.5, z + Math.sin(a) * 0.4, 4); c.rotation.z = Math.cos(a) * 0.9; c.rotation.x = -Math.sin(a) * 0.9; st.add(c); } }
    const human = T.figure3D({ top: 'none' }, { rim: '#ffd8a0', pose: POSES.pointUp }); human.position.set(2.5, 0, -0.9); human.rotation.y = Math.PI * 0.75; st.add(human);
    const df = dragonflyMesh(T); df.scale.setScalar(0.6 / 2.36); df.position.set(2.0, 2.25, -0.5); df.rotation.y = 0.4; st.add(df);
    return { stage: st, df };
  },
  draw(s, t, info, T) { s.df.userData.flap(t, 14, 0.5); s.df.position.y = 2.25 + Math.sin(t * 2) * 0.03; T.orbit(s.stage.camera, t, { target: [2.2, 1.6, -0.7], radius: [4.6, 3.6], height: [1.8, 2.0], from: -0.35, to: 0.2, dur: info.dur }); },
  overlay(g, t) { labelTitle(g, t, 'ASAS DE PONTA A PONTA', '60 CM', 330, { at: 2.6, big: 110 }); labelTitle(g, t, 'HÁ 300 MILHÕES DE ANOS', 'GIGANTES', 330, { at: 0.2, big: 90, out: 2.3 }); },
});
