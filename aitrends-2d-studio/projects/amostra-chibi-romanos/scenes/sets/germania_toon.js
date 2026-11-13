// sets/germania_toon.js — floresta da Germânia e o acampamento romano, em estilo toon (contorno + sombreado em faixas).
import { rng } from '/engine/core.js';
import { tmesh, toonMat, chibi } from './toon.js';

// guerreiro germânico chibi: cabelo comprido, capa de pele, lança
export function warrior(T, o = {}) {
  const { THREE } = T;
  const h = chibi(T, { robe: o.robe || '#3a5a6a', robe2: '#c8b898', sash: '#4a3020', hair: o.hair || '#5a3a24', legs: '#8a7a60', expr: o.expr || 'neutral' });
  const ud = h.userData, hair = o.hair || '#5a3a24';
  const back = tmesh(T, new THREE.SphereGeometry(0.4, 24, 18), hair, { ow: 0.03 }); back.scale.set(0.92, 1.15, 0.7); back.position.set(0, -0.1, -0.26); ud.head.add(back);
  const cloak = tmesh(T, new THREE.CylinderGeometry(0.3, 0.34, 0.2, 20), '#6a5038', { ow: 0.04 }); cloak.position.y = 0.92; ud.body.add(cloak);
  const fur = tmesh(T, new THREE.TorusGeometry(0.28, 0.07, 8, 20), '#8a7258', { ow: 0.05 }); fur.rotation.x = Math.PI / 2; fur.position.y = 1.0; ud.body.add(fur);
  if (o.spear !== false) { const sp = new THREE.Group(); sp.add(tmesh(T, new THREE.CylinderGeometry(0.018, 0.018, 1.9, 8), '#4a3020', { ow: 0.06 })); const tip = tmesh(T, new THREE.ConeGeometry(0.045, 0.2, 6), '#b8c0c8', { ow: 0.05 }); tip.position.y = 1.03; sp.add(tip); sp.position.set(0, -0.46, 0.04); sp.rotation.x = 0.05; ud.arms[1].add(sp); ud.spear = sp; }
  return h;
}
// floresta noturna com o acampamento romano ao fundo (o.camp: distância; o.trees: quantidade)
export function germania(T, o = {}) {
  const { THREE } = T, r = rng(o.seed || 11);
  const st = T.stage({ mood: 'night', sky: ['#04061a', '#0a1430', '#1a2a50'], fov: o.fov || 44, fog: [7, 45], fogColor: '#18284e', keyPos: [8, 14, -10], keyColor: '#a8bcff', keyIntensity: 2.4, ambient: 1.9, ambientSky: '#6a7ac0', shadowSize: 12, bloom: 0.6, bloomThreshold: 0.8 });
  st.add(T.ground(160, 160, '#1a3432'));
  // lua
  const moon = new THREE.Mesh(new THREE.SphereGeometry(3, 24, 16), new THREE.MeshBasicMaterial({ color: '#e8eeff', fog: false })); moon.position.set(-18, 26, -80); st.add(moon);
  // árvores (troncos com contorno e copas escuras)
  for (let i = 0; i < (o.trees || 40); i++) {
    let x = -10 + r() * 20, z = 4 - r() * 12; if (Math.abs(x) < 1.6 && z > -4) x += x < 0 ? -2.2 : 2.2; if ((o.clear || []).some(([cx, cz, rr]) => Math.hypot(x - cx, z - cz) < rr)) continue;
    const h = 6 + r() * 5, tr = tmesh(T, new THREE.CylinderGeometry(0.16 + r() * 0.1, 0.28, h, 8), '#1a1826', { ow: 0.05 }); tr.position.set(x, h / 2, z); st.add(tr);
    const cr = tmesh(T, new THREE.ConeGeometry(1.2 + r() * 0.5, 3.4, 7), '#10202a', { ow: 0.03 }); cr.position.set(x, h + 0.6, z); st.add(cr);
  }
  // samambaias e capim
  const fm = toonMat(T, '#1c3a34');
  for (let i = 0; i < 260; i++) { const x = -8 + r() * 16, z = 3 - r() * 11; if (Math.abs(x) < 0.7 && z > -3) continue; for (let k = 0; k < 4; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.6 + r() * 0.4, 4), fm); const a = k * 1.6 + r(); c.position.set(x + Math.cos(a) * 0.12, 0.25, z + Math.sin(a) * 0.12); c.rotation.z = Math.cos(a) * 0.7; c.rotation.x = -Math.sin(a) * 0.7; st.add(c); } }
  // o acampamento romano ao fundo
  const cz = o.campZ ?? -16, wood = '#3a2e28';
  for (let x = -12; x <= 12; x += 0.42) { if (Math.abs(x) < 1.2) continue; const h = 2.2 + Math.sin(x * 7) * 0.15; const s = tmesh(T, new THREE.CylinderGeometry(0.12, 0.13, h, 6), wood, { ow: 0.05 }); s.position.set(x, h / 2 + 0.6, cz); st.add(s); const tp = tmesh(T, new THREE.ConeGeometry(0.13, 0.35, 6), wood, { ow: 0.05 }); tp.position.set(x, h + 0.78, cz); st.add(tp); }
  const mound = tmesh(T, new THREE.BoxGeometry(26, 0.7, 2.2), '#1e1a20', { ow: 0.02 }); mound.position.set(0, 0.3, cz); st.add(mound);
  for (const sx of [-1, 1]) { const tw = tmesh(T, new THREE.BoxGeometry(0.9, 4.2, 0.9), '#2e2622', { ow: 0.04 }); tw.position.set(sx * 1.6, 2.1, cz); st.add(tw); const rf = tmesh(T, new THREE.ConeGeometry(0.85, 0.7, 4), '#1e1814', { ow: 0.04 }); rf.position.set(sx * 1.6, 4.55, cz); rf.rotation.y = Math.PI / 4; st.add(rf); }
  for (let i = -5; i <= 5; i++) { const tn = tmesh(T, new THREE.ConeGeometry(0.9, 1.1, 4), '#5a5058', { ow: 0.03 }); tn.position.set(i * 2.1, 0.55, cz - 3 - (i % 2) * 1.5); tn.rotation.y = Math.PI / 4; st.add(tn); }
  const torches = [];
  for (let x = -10; x <= 10; x += 2.5) { const fl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), new THREE.MeshBasicMaterial({ color: '#ff8a2a', fog: false })); fl.scale.set(1, 1.6, 1); fl.position.set(x + 0.2, 3.4, cz + 0.3); st.add(fl); const halo = new THREE.Mesh(new THREE.SphereGeometry(0.55, 12, 10), new THREE.MeshBasicMaterial({ color: '#ff7a20', transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); halo.position.copy(fl.position); st.add(halo); const pl = new THREE.PointLight('#ff9a40', 9, 9, 1.5); pl.position.copy(fl.position); st.add(pl); torches.push(fl); }
  // vagalumes
  const pg = new THREE.BufferGeometry(), pp = []; for (let i = 0; i < 140; i++) pp.push(-6 + r() * 12, 0.4 + r() * 3, 3 - r() * 12); pg.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));
  const motes = new THREE.Points(pg, new THREE.PointsMaterial({ color: '#c8f0ff', size: 0.04, transparent: true, opacity: 0.85 })); st.add(motes);
  const fill = new THREE.PointLight('#c8d4ff', 0, 7, 1.5); st.add(fill);
  return { st, torches, motes, fill };
}
export const flicker = (torches, t) => torches.forEach((f, i) => f.scale.set(1 + Math.sin(t * 13 + i) * 0.1, 1.6 + Math.sin(t * 9 + i * 2) * 0.2, 1));
