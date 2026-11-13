// sets/toon.js — kit de estilo "toon chibi": sombreado em faixas (MeshToonMaterial), contorno escuro (casco invertido),
// cabeça grande e redonda com rosto desenhado à mão numa textura, cabelo preto com franja, túnica tradicional.
import { rng } from '/engine/core.js';

const OUTLINE = '#2a1420';
let _grad = null;
function gradient(THREE) {
  if (_grad) return _grad;
  const d = new Uint8Array([120, 120, 120, 255, 190, 190, 190, 255, 245, 245, 245, 255]);
  _grad = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); _grad.minFilter = _grad.magFilter = THREE.NearestFilter; _grad.needsUpdate = true; return _grad;
}
export const toonMat = (T, c, o = {}) => new T.THREE.MeshToonMaterial({ color: new T.THREE.Color(c), gradientMap: gradient(T.THREE), ...o });
// malha + contorno (casco invertido)
export function tmesh(T, geo, color, o = {}) {
  const { THREE } = T, g = new THREE.Group();
  const m = new THREE.Mesh(geo, o.material || toonMat(T, color, o.mat || {})); m.castShadow = o.cast !== false; m.receiveShadow = true; g.add(m);
  if (o.outline !== false) { const ol = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: OUTLINE, side: THREE.BackSide })); ol.scale.setScalar(1 + (o.ow ?? 0.035)); g.add(ol); }
  g.userData.mesh = m; return g;
}

// ---------- o rosto desenhado (canvas) ----------
function faceTex(T, expr = 'neutral', blink = false) {
  return T.canvasTex(512, 512, (g, w, h) => {
    g.clearRect(0, 0, w, h); g.lineCap = 'round'; g.lineJoin = 'round';
    const ink = '#1a1218', ey = 250;
    // sobrancelhas grossas
    g.fillStyle = ink;
    for (const sx of [-1, 1]) { g.save(); g.translate(256 + sx * 92, 168 + (expr === 'surprised' ? -18 : 0)); g.rotate(sx * (expr === 'angry' ? 0.25 : -0.06)); g.beginPath(); g.ellipse(0, 0, 50, 11, 0, 0, 7); g.fill(); g.restore(); }
    for (const sx of [-1, 1]) {
      const cx = 256 + sx * 92;
      if (blink || expr === 'happy') { g.strokeStyle = ink; g.lineWidth = 10; g.beginPath(); if (expr === 'happy') g.arc(cx, ey + 10, 32, Math.PI * 1.15, Math.PI * 1.85); else { g.moveTo(cx - 38, ey); g.lineTo(cx + 38, ey); } g.stroke(); continue; }
      if (expr === 'surprised') { g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(cx, ey, 30, 34, 0, 0, 7); g.fill(); g.strokeStyle = ink; g.lineWidth = 7; g.stroke(); g.fillStyle = ink; g.beginPath(); g.arc(cx, ey + 4, 12, 0, 7); g.fill(); continue; }
      // olho meio fechado de anime: íris escura sob a pálpebra grossa
      g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(cx, ey + 8, 34, 20, 0, 0, Math.PI); g.fill();
      g.fillStyle = '#2a1a22'; g.beginPath(); g.ellipse(cx + sx * 4, ey + 10, 17, 19, 0, 0, 7); g.fill();
      g.fillStyle = '#ffffff'; g.beginPath(); g.arc(cx + sx * 4 - 6, ey + 4, 5, 0, 7); g.fill();
      g.strokeStyle = ink; g.lineWidth = 11; g.beginPath(); g.moveTo(cx - 40, ey + 2); g.quadraticCurveTo(cx, ey - 10, cx + 40, ey + 2); g.stroke();
      g.lineWidth = 4; g.beginPath(); g.moveTo(cx + sx * 40, ey + 2); g.lineTo(cx + sx * 50, ey - 8); g.stroke();
      g.lineWidth = 3; g.beginPath(); g.ellipse(cx, ey + 8, 34, 20, 0, 0.15, Math.PI - 0.15); g.stroke();
    }
    g.strokeStyle = ink; g.lineWidth = 5;
    g.beginPath(); g.moveTo(258, 300); g.quadraticCurveTo(250, 318, 262, 322); g.stroke();   // nariz
    g.lineWidth = 7; g.beginPath();
    if (expr === 'happy') g.arc(256, 345, 40, 0.3, Math.PI - 0.3);
    else if (expr === 'surprised') { g.ellipse(256, 372, 18, 24, 0, 0, 7); }
    else { g.moveTo(228, 368); g.quadraticCurveTo(256, 362, 286, 366); }
    g.stroke();
    g.fillStyle = 'rgba(240,140,150,.10)'; for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(256 + sx * 130, 320, 34, 16, 0, 0, 7); g.fill(); }
  });
}

// ---------- o personagem chibi ----------
// o: robe, robe2 (gola), sash, skin, hair, legs, expr
export function chibi(T, o = {}) {
  const { THREE } = T, root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const skin = o.skin || '#dcdaf0', hair = o.hair || '#14121c', robe = o.robe || '#3e6a52';
  const R = 0.46, headY = 1.32;
  // cabeça
  const head = new THREE.Group(); head.position.set(0, headY, 0); body.add(head);
  head.add(tmesh(T, new THREE.SphereGeometry(R, 40, 28), skin, { ow: 0.03, material: new THREE.MeshLambertMaterial({ color: new THREE.Color(skin), emissive: new THREE.Color('#5a5a88'), emissiveIntensity: 0.6 }) }));
  const faces = {}; for (const e of ['neutral', 'happy', 'surprised', 'angry']) faces[e] = faceTex(T, e); faces.blink = faceTex(T, 'neutral', true);
  const faceMat = new THREE.MeshBasicMaterial({ map: faces[o.expr || 'neutral'], transparent: true, depthWrite: false });
  const faceGeo = new THREE.SphereGeometry(R * 1.006, 40, 24, Math.PI * 0.15, Math.PI * 0.7, Math.PI * 0.22, Math.PI * 0.56);
  const face = new THREE.Mesh(faceGeo, faceMat); head.add(face);
  // cabelo: calota, nuca, franja em mechas e coque
  const hm = { mat: {} };
  const cap = tmesh(T, new THREE.SphereGeometry(R * 1.05, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.36), hair, { ow: 0.025 }); head.add(cap);
  const back = tmesh(T, new THREE.SphereGeometry(R * 1.04, 32, 20, Math.PI * 1.05, Math.PI * 0.9, 0, Math.PI * 0.62), hair, { ow: 0.025 }); head.add(back);
  const fringe = tmesh(T, new THREE.SphereGeometry(R * 1.055, 40, 20, Math.PI * 0.2, Math.PI * 0.6, 0, Math.PI * 0.43), hair, { ow: 0.02 }); head.add(fringe);
  for (const [a, l] of [[-0.35, 0.2], [0.05, 0.24], [0.4, 0.18]]) { const lock = tmesh(T, new THREE.ConeGeometry(0.05, l, 6), hair, { ow: 0.05 }); lock.position.set(Math.sin(a) * R * 0.98, R * 0.3, Math.cos(a) * R * 0.98); lock.rotation.set(Math.PI - 0.25, 0, a * 0.3); head.add(lock); }
  const bun = tmesh(T, new THREE.SphereGeometry(0.13, 16, 12), hair, {}); bun.position.set(0, R * 0.98, -R * 0.35); head.add(bun);
  // túnica
  const robeG = new THREE.CylinderGeometry(0.2, 0.36, 0.72, 24); const tunic = tmesh(T, robeG, robe, {}); tunic.position.y = 0.62; body.add(tunic);
  const collarM = toonMat(T, o.robe2 || '#e8e0d0');
  for (const sx of [-1, 1]) { const c = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.26, 0.02), collarM); c.position.set(sx * 0.045, 0.86, 0.225); c.rotation.z = sx * 0.6; c.rotation.x = -0.25; body.add(c); }
  const sash = tmesh(T, new THREE.CylinderGeometry(0.27, 0.28, 0.08, 24), o.sash || '#2a2a34', { ow: 0.02 }); sash.position.y = 0.62; body.add(sash);
  // braços (mangas) e mãos
  const arms = [];
  for (const sx of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(sx * 0.22, 0.92, 0); const sl = tmesh(T, new THREE.CylinderGeometry(0.07, 0.1, 0.42, 12), robe, {}); sl.position.y = -0.2; piv.add(sl); const hand = tmesh(T, new THREE.SphereGeometry(0.065, 12, 10), skin, {}); hand.position.y = -0.44; piv.add(hand); piv.rotation.z = sx * 0.18; body.add(piv); arms.push(piv); }
  // pernas com faixas e sapatos
  const legs = [];
  for (const sx of [-1, 1]) { const piv = new THREE.Group(); piv.position.set(sx * 0.1, 0.3, 0); const lg = tmesh(T, new THREE.CylinderGeometry(0.06, 0.055, 0.28, 10), o.legs || '#cfc4a8', {}); lg.position.y = -0.14; piv.add(lg); const shoe = tmesh(T, new THREE.SphereGeometry(0.07, 10, 8), '#14121a', {}); shoe.scale.set(1, 0.6, 1.5); shoe.position.set(0, -0.29, 0.03); piv.add(shoe); body.add(piv); legs.push(piv); }
  root.userData = { head, face, faces, faceMat, arms, legs, body,
    setExpr(e, blink = false) { faceMat.map = blink ? faces.blink : faces[e] || faces.neutral; faceMat.needsUpdate = true; },
    walk(t, sp = 1) { const s = Math.sin(t * 7 * sp); legs[0].rotation.x = s * 0.5; legs[1].rotation.x = -s * 0.5; arms[0].rotation.x = -s * 0.4; arms[1].rotation.x = s * 0.4; body.position.y = Math.abs(Math.cos(t * 7 * sp)) * 0.04; head.rotation.z = Math.sin(t * 3.5 * sp) * 0.03; },
    idle(t) { body.position.y = Math.sin(t * 2) * 0.008; head.rotation.z = Math.sin(t * 0.9) * 0.025; legs.forEach(l => (l.rotation.x = 0)); },
  };
  root.scale.setScalar(o.s || 1); return root;
}

// ---------- jardim noturno: trilha de pedras, flores brilhando, árvores, lanternas, névoa ----------
export function nightGarden(T, o = {}) {
  const { THREE } = T, r = rng(o.seed || 7);
  const st = T.stage({ mood: 'night', sky: ['#05081a', '#0c1838', '#1c3058'], fov: o.fov || 38, fog: [6, 34], fogColor: '#0e1a34', keyPos: [-6, 12, -8], keyColor: '#9fb8ff', keyIntensity: 1.6, ambient: 1.1, ambientSky: '#5a70b0', shadowSize: 10, bloom: 0.55, bloomThreshold: 0.82 });
  st.renderer && (st.renderer.toneMappingExposure = 1.0);
  st.add(T.ground(120, 120, '#0e1e2a'));
  // trilha de pedras octogonais
  const stoneM = toonMat(T, '#5a6a80');
  for (let i = 0; i < 26; i++) { const z = 3 - i * 0.62, x = Math.sin(i * 0.45) * 0.35 + (i % 2 ? 0.18 : -0.18); const s = tmesh(T, new THREE.CylinderGeometry(0.34, 0.36, 0.06, 8), '#5a6a80', { material: stoneM, ow: 0.04 }); s.position.set(x, 0.03, z); s.rotation.y = r() * 1; st.add(s); }
  // flores brilhantes (instanciadas)
  const fgeo = new THREE.IcosahedronGeometry(0.026, 0);
  const n = 1500, fl = new THREE.InstancedMesh(fgeo, new THREE.MeshBasicMaterial({ color: '#9fd0ea' }), n), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), pos = new THREE.Vector3(); let k = 0;
  while (k < n) { const x = -5 + r() * 10, z = 4 - r() * 18; if (Math.abs(x - Math.sin((3 - z) / 0.62 * 0.45) * 0.35) < 0.55) continue; const h = 0.12 + r() * 0.2; pos.set(x, h, z); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), r() * 6); sc.setScalar(0.7 + r() * 0.8); m4.compose(pos, q, sc); fl.setMatrixAt(k++, m4); }
  st.add(fl);
  const stemGeo = new THREE.ConeGeometry(0.03, 0.4, 3), stems = new THREE.InstancedMesh(stemGeo, toonMat(T, '#1e4a4a'), 1400); k = 0; const r2 = rng(3);
  while (k < 1400) { const x = -5 + r2() * 10, z = 4 - r2() * 18; if (Math.abs(x) < 0.5) continue; m4.compose(pos.set(x, 0.12, z), q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), (r2() - 0.5) * 0.6), sc.setScalar(0.8 + r2())); stems.setMatrixAt(k++, m4); } st.add(stems);
  // árvores e troncos escuros com contorno
  for (let i = 0; i < 16; i++) { const sx = i % 2 ? 1 : -1, x = sx * (2.6 + r() * 3), z = 2 - i * 1.3, h = 4 + r() * 3; const tr = tmesh(T, new THREE.CylinderGeometry(0.16, 0.26, h, 8), '#1c1a2a', { ow: 0.05 }); tr.position.set(x, h / 2, z); st.add(tr); const cr = tmesh(T, new THREE.IcosahedronGeometry(1.3 + r() * 0.6, 0), '#16283a', { ow: 0.03 }); cr.position.set(x, h + 0.4, z); st.add(cr); }
  // lanternas de pedra com luz quente
  const lamps = [];
  for (const [x, z] of o.lamps || [[-1.3, 0.5], [1.4, -3.2], [-1.4, -7]]) {
    const post = tmesh(T, new THREE.CylinderGeometry(0.06, 0.08, 1.0, 8), '#2a2430', {}); post.position.set(x, 0.5, z); st.add(post);
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.28, 0.22), new THREE.MeshBasicMaterial({ color: '#ffcf7a' })); box.position.set(x, 1.12, z); st.add(box);
    const roof = tmesh(T, new THREE.ConeGeometry(0.22, 0.14, 4), '#2a2430', {}); roof.position.set(x, 1.33, z); roof.rotation.y = Math.PI / 4; st.add(roof);
    const pl = new THREE.PointLight('#ffb860', 3, 3.5, 1.8); pl.position.set(x, 1.12, z); st.add(pl); lamps.push(pl);
  }
  // vagalumes / partículas
  const pg = new THREE.BufferGeometry(), pp = []; for (let i = 0; i < 160; i++) pp.push(-4 + r() * 8, 0.3 + r() * 2.5, 3 - r() * 14); pg.setAttribute('position', new THREE.Float32BufferAttribute(pp, 3));
  const motes = new THREE.Points(pg, new THREE.PointsMaterial({ color: '#bff0ff', size: 0.045, transparent: true, opacity: 0.9 })); st.add(motes);
  return { st, motes, lamps };
}
