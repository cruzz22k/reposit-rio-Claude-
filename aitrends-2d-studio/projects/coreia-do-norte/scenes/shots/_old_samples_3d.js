// shots/a_3d.js — cenas 3D low-poly da amostra: a avenida de Pyongyang (título) e o rio na fronteira.
import { E, V, S, registerShot, mood, ease, prog, alpha, shade, mix, rng, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { VOCE, LENCO } from '../cast.js';

// ---------- a001: avenida monumental ao entardecer, torre com chama, formação na praça ----------
registerShot('a001', {
  kind: '3d',
  init(T) {
    const M = mood('dusk'), { THREE } = T, r = rng(11);
    const st = T.stage({ mood: 'dusk', fov: V(36, 54), fog: [50, 260], fogColor: mix(M.sky[2], M.dark, 0.35), keyPos: [-40, 30, -120], keyIntensity: 2.6, ambient: 1.1, shadowSize: 70 });
    st.add(T.ground(600, 600, shade(M.floor, -0.05), T.tiles(M.floor, 8, [60, 60])));
    // sol baixo atrás da torre
    st.add(T.sphere(16, T.basic('#fff0d0', { fog: false }), 14, 20, -330));
    st.add(T.sphere(30, T.basic(M.sky[2], { fog: false, transparent: true, opacity: 0.35 }), 14, 20, -335));
    // prédios dos dois lados da avenida, de frente para ela, com faixas vermelhas
    for (let i = 0; i < 8; i++) for (const sx of [-1, 1]) {
      const h = 16 + Math.floor(r() * 5) * 5, z = -6 - i * 19;
      const b = T.building(15, h, 12, { color: shade(M.wall, -0.2), win: M.practical, lit: 0.3, seed: i * 2 + (sx > 0 ? 1 : 0) + 3 });
      b.position.x = sx * 21; b.position.z = z; b.rotation.y = -sx * Math.PI / 2; st.add(b);
      if (i % 2 === 0) st.add(T.box(0.25, h * 0.55, 2.2, T.mat(LENCO, { emissive: new THREE.Color(LENCO), emissiveIntensity: 0.35 }), sx * 14.8, h * 0.6, z));
    }
    // postes com luz quente
    for (let i = 0; i < 9; i++) for (const sx of [-1, 1]) {
      st.add(T.cyl(0.08, 0.1, 6, '#15121c', sx * 9, 3, 4 - i * 16));
      st.add(T.sphere(0.32, T.basic(M.practical), sx * 9, 6.1, 4 - i * 16));
    }
    // a torre: base em degraus, corpo afilado, chama acesa no topo
    const tz = -165, stone = shade(M.wall, 0.25);
    st.add(T.box(34, 3, 34, stone, 0, 1.5, tz), T.box(22, 3, 22, shade(stone, 0.08), 0, 4.5, tz));
    const body = T.cyl(1.9, 4.2, 70, T.mat(shade(stone, 0.15), { flat: true }), 0, 41, tz, 4); body.rotation.y = Math.PI / 4; st.add(body);
    st.add(T.cyl(2.6, 2.0, 2.2, '#3a2a30', 0, 77, tz, 8));
    const flame = T.sphere(3.4, T.basic('#ff5a2a', { fog: false }), 0, 81.5, tz); flame.scale.set(1, 1.5, 1); st.add(flame);
    const core = T.sphere(1.8, T.basic('#ffe0a0', { fog: false }), 0, 81, tz); core.scale.set(1, 1.5, 1); st.add(core);
    // prédios distantes + pirâmide no horizonte
    for (let i = 0; i < 14; i++) { const h = 20 + r() * 40, b = T.building(16, h, 14, { color: shade(M.wall, -0.3), win: M.practical, lit: 0.2, seed: 40 + i }); b.position.x = -150 + i * 22 + (i > 6 ? 16 : -16); b.position.z = -210 - r() * 40; st.add(b); }
    const pyr = T.cone(34, 105, T.mat(shade(M.wall, -0.35), { flat: true }), -70, 52, -300, 3); pyr.rotation.y = 0.5; st.add(pyr);
    // a praça: blocos de pessoas em formação perfeita, bandeiras vermelhas à frente
    const geo = new THREE.CapsuleGeometry(0.2, 0.9, 3, 6), hgeo = new THREE.SphereGeometry(0.2, 8, 6), n = 3 * 7 * 9;
    const bodies = new THREE.InstancedMesh(geo, T.mat('#ffffff'), n), heads = new THREE.InstancedMesh(hgeo, T.mat('#ffffff'), n);
    const m4 = new THREE.Matrix4(), col = new THREE.Color(); let k = 0; const flags = [];
    for (const bx of [-8.6, 0, 8.6]) {
      for (let i = 0; i < 7; i++) for (let j = 0; j < 9; j++) {
        const x = bx - 3 + i, z = -4 - j * 1.5;
        m4.makeTranslation(x, 0.75, z); bodies.setMatrixAt(k, m4); m4.makeTranslation(x, 1.72, z); heads.setMatrixAt(k, m4);
        col.set(shade(S().ink, 0.04 + r() * 0.1)); bodies.setColorAt(k, col); heads.setColorAt(k, col); k++;
      }
      st.add(T.cyl(0.05, 0.05, 4.4, '#cfc7dd', bx, 2.2, -2.4));
      const f = T.box(1.9, 1.15, 0.05, T.mat(LENCO, { emissive: new THREE.Color(LENCO), emissiveIntensity: 0.3 }), bx + 0.98, 3.75, -2.4); st.add(f); flags.push(f);
    }
    bodies.castShadow = heads.castShadow = true; st.add(bodies, heads);
    return { stage: st, flags, flame };
  },
  draw(s, t, info, T) {
    const d = info.dur;
    T.dolly(s.stage.camera, ease.inOut(t / d) * d, [[0, { pos: [0, 2.2, 21], look: [0, 22, -160] }], [d, { pos: [0, 7.5, 13], look: [0, 34, -160] }]]);
    s.flags.forEach((f, i) => { f.rotation.y = Math.sin(t * 2.2 + i) * 0.16; });
    s.flame.scale.set(1 + Math.sin(t * 9) * 0.05, 1.5 + Math.sin(t * 7 + 1) * 0.12, 1);
  },
  overlay(g, t, info) {
    UI.titleCard(g, t, { lines: ['O QUE ACONTECERIA', 'SE VOCÊ NASCESSE NA', 'COREIA DO NORTE?'], dur: info.dur, y: E.H * V(0.42, 0.775) });
  },
});

// ---------- a004: o rio na fronteira, de noite. Margem escura deste lado, luzes do outro. ----------
registerShot('a004', {
  kind: '3d',
  init(T) {
    const M = mood('night'), { THREE } = T, r = rng(29);
    const st = T.stage({ mood: 'night', fov: V(36, 54), fog: [26, 190], fogColor: shade(M.sky[1], -0.35), keyPos: [-26, 34, -90], keyIntensity: 1.5, ambient: 0.75, shadowSize: 30 });
    // céu: lua + estrelas
    st.add(T.sphere(7, T.basic('#e8ecff', { fog: false }), -40, 132, -300));
    const sp = []; for (let i = 0; i < 260; i++) sp.push((r() - 0.5) * 520, 40 + r() * 190, -320);
    const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
    st.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: '#cfd8ff', size: 1.3, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.8 })));
    // margem de cá (escura), rio, margem de lá
    st.add(T.box(400, 2, 60, shade(M.grass, -0.55), 0, -1, 24));
    const river = T.plane(400, 84, T.mat(shade(M.sky[1], -0.25), { roughness: 0.35 }), 0, -0.6, -48); river.rotation.x = -Math.PI / 2; st.add(river);
    st.add(T.box(400, 3, 80, shade(M.wall, -0.4), 0, 0.2, -130));
    // a cidade do outro lado: janelas acesas, letreiros, reflexos compridos na água
    const signs = ['#ff5a4a', '#5fe0d8', M.practical, '#ffd47e'];
    for (let i = 0; i < 17; i++) {
      const h = 10 + r() * 26, x = -128 + i * 16 + (r() - 0.5) * 4, z = -100 - r() * 14;
      const b = T.building(12, h, 10, { color: shade(M.wall, -0.1), win: M.practical, lit: 0.82, seed: 60 + i }); b.position.x = x; b.position.z = z; b.position.y = h / 2 + 1.7; st.add(b);
      const c = signs[i % signs.length];
      if (i % 2 === 0) st.add(T.box(5, 1.3, 0.2, T.basic(c), x, h * 0.72 + 1.7, z + 5.2));
      const ref = T.shaft(3.2, 44, i % 2 === 0 ? c : M.practical, 0.2); ref.rotation.x = Math.PI / 2; ref.position.set(x, -0.55, -68); st.add(ref);
    }
    const moonRef = T.shaft(5, 80, '#cfd8ff', 0.1); moonRef.rotation.x = Math.PI / 2; moonRef.position.set(-10, -0.55, -48); st.add(moonRef);
    // cerca de arame na beira
    const steel = T.mat('#1a1c2a');
    for (let x = -60; x <= 60; x += 4) { const p = T.box(0.14, 2.6, 0.14, steel, x, 1.3, -4.4); p.rotation.z = 0.04 * Math.sin(x); st.add(p); }
    for (const y of [0.8, 1.5, 2.2, 2.55]) st.add(T.box(124, 0.035, 0.035, T.mat('#565a78'), 0, y, -4.4));
    // torre de vigia com holofote varrendo a água
    const tx = 3.1, tz = -5.2;
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) st.add(T.box(0.16, 5, 0.16, steel, tx + dx * 1.0, 2.5, tz + dz * 1.0));
    st.add(T.box(2.7, 0.18, 2.7, steel, tx, 5, tz), T.box(2.5, 0.95, 2.5, shade(M.wall, -0.5), tx, 5.55, tz), T.box(3.2, 0.18, 3.2, steel, tx, 7.3, tz));
    for (const y of [1.3, 2.6, 3.9]) st.add(T.box(2.1, 0.07, 0.07, steel, tx, y, tz + 1.0), T.box(0.07, 0.07, 2.1, steel, tx - 1.0, y, tz));
    for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) st.add(T.box(0.1, 1.3, 0.1, steel, tx + dx * 1.15, 6.65, tz + dz * 1.15));
    const guard = T.figure3D({ top: 'none' }, { rim: M.rim, pose: POSES.stand, s: 0.95 }); guard.position.set(tx, 5.09, tz); guard.rotation.y = Math.PI / 2 + 0.4; st.add(guard);
    const lamp = new THREE.Group(); lamp.position.set(tx - 1.1, 6.5, tz - 1.3);
    lamp.add(T.sphere(0.34, T.basic('#f4f7ff')));
    const beam = T.shaft(2.6, 34, '#dfe6ff', 0.2); beam.position.set(0, -17, 0); const tilt = new THREE.Group(); tilt.rotation.x = 1.3; tilt.add(beam); lamp.add(tilt);
    const beam2 = T.shaft(2.6, 34, '#dfe6ff', 0.12); beam2.position.set(0, -17, 0); beam2.rotation.y = Math.PI / 2; tilt.add(beam2);
    const spot = new THREE.Mesh(new THREE.CircleGeometry(4.2, 28), new THREE.MeshBasicMaterial({ color: '#aebcf0', transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false })); spot.rotation.x = -Math.PI / 2; spot.scale.set(1, 2.2, 1); spot.position.set(0, -7.05, -25.4); lamp.add(spot); st.add(lamp);
    // juncos na beira e você, agachado, olhando para o outro lado
    for (let i = 0; i < 90; i++) { const x = -9 + r() * 18, z = -3.8 + r() * 5.2; if (Math.abs(x - 0.3) < 1.3 && z > -0.5) continue; const h = 0.5 + r() * 0.9; const c = T.cone(0.035, h, T.mat(shade(M.grass, -0.35 + r() * 0.2), { flat: true }), x, h / 2, z, 4); c.rotation.z = (r() - 0.5) * 0.3; st.add(c); }
    const you = T.figure3D(VOCE, { rim: M.rim, pose: POSES.crouch }); you.position.set(0.0, 0, 3.4);
    const fill = new THREE.PointLight('#aebcff', 14, 14); fill.position.set(1.8, 2.4, 6.4); st.add(fill); you.rotation.y = Math.PI / 2 - 0.12; st.add(you);
    return { stage: st, lamp, you };
  },
  draw(s, t, info, T) {
    const d = info.dur;
    T.dolly(s.stage.camera, ease.inOut(t / d) * d, [[0, { pos: [0.9, 1.35, 9.4], look: [0.3, 4.6, -60] }], [d, { pos: [0.6, 1.6, 8.3], look: [0.3, 5.2, -60] }]]);
    s.lamp.rotation.y = 0.5 + Math.sin(t * 0.8 + 0.2) * 0.32;
    const k = ease.inOut(prog(t, 1.4, 2.4));
    s.you.setPose({ ...POSES.crouch, head: [16 + 3 * k, -150 - 5 * k], eF: [28 + 8 * k, -88 - 10 * k], hF: [38 + 22 * k, -60 - 30 * k] });
  },
  overlay(g, t) {
    const a = ease.out(prog(t, 0.9, 1.5)) * 0.9, ui = S().ui;
    text(g, 'CHINA', E.W * V(0.5, 0.36), E.H * V(0.16, 0.29), { size: V(34, 40), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 10, alpha: a, glow: 16, glowColor: alpha(ui.gold, 0.6) });
  },
});
