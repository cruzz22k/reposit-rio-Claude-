// doc.js — direção do documentário "O corredor de 3 km". Cada bloco diz de qual frase e regra saiu.
import { THREE, W, H, FPS, FOV, SCALE, scene, U, hud, clamp, lerp, smooth, easeOut, easeInOut, win, rng, pchip,
  loadFonts, loadMap, mapMat, camState, handheld, renderFrame, ribbon, handCircle, canvasTexture, label } from './engine.js';

const Q = new URLSearchParams(location.search);
try {
await loadFonts();
const meta = await loadMap();
const WORDS = (await (await fetch('/project/timeline/words-v2.json')).json()).words;
const DUR = 68.06;                                   // duração da voz v2 = duração do vídeo
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const w = (s, word, n = 1, end = false) => { let c = 0; for (const x of WORDS) if (x.s === s && norm(x.word) === norm(word) && ++c === n) return end ? x.end : x.start; throw new Error(`palavra ${word} (${n}) não está na frase ${s}`); };
const we = (s, word, n = 1) => w(s, word, n, true);
const PL = meta.places;

// ---------- faixas de navegação (regra 1: o mundo é o mapa real) ----------
const curve = new THREE.CatmullRomCurve3(meta.lane.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
const LP = curve.getSpacedPoints(800), LS = [0]; for (let i = 1; i < LP.length; i++) LS.push(LS[i - 1] + LP[i].distanceTo(LP[i - 1]));
const LANE_LEN = LS[LS.length - 1];
function laneAt(s) {   // ponto e direção a s km do começo da faixa
  s = clamp(s, 0, LANE_LEN - 1e-6); let i = 0; while (LS[i + 1] < s) i++;
  const k = (s - LS[i]) / (LS[i + 1] - LS[i]), a = LP[i], b = LP[i + 1], dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz);
  return { x: lerp(a.x, b.x, k), z: lerp(a.z, b.z, k), dx: dx / l, dz: dz / l };
}
const lanePt = (s, off = 0) => { const p = laneAt(s); return [p.x - p.dz * off, p.z + p.dx * off]; };   // off > 0 = lado direito de quem vai para o oceano
const laneYaw = s => { const p = laneAt(s); return Math.atan2(p.dz, p.dx); };
let sA = 0, best = 1e9; for (let s = 0; s < LANE_LEN; s += 0.2) { const [x, z] = lanePt(s); const d = Math.hypot(x - PL.ESTREITO[0], z - PL.ESTREITO[1]); if (d < best) { best = d; sA = s; } }
sA -= 6;                                              // começo do vídeo: um pouco antes do ponto mais estreito
const HERO = [1.6, 4.8];                              // faixa de saída: 3,2 km (2 milhas)
{
  const edge = off => { const v = []; for (let s = 0; s < LANE_LEN - 0.5; s += 0.5) { const [x0, z0] = lanePt(s, off), [x1, z1] = lanePt(s + 0.5, off); v.push(x0, 0, z0, x1, 0, z1); } return v; };
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([...edge(1.6), ...edge(4.8), ...edge(-1.6), ...edge(-4.8)], 3));
  const L = new THREE.LineSegments(g, mapMat('#b8c2c6', { alpha: 0.6, noise: 0 })); L.renderOrder = 3; L.frustumCulled = false; scene.add(L);
  const v = []; for (let s = 0; s < LANE_LEN - 0.5; s += 0.5) { const a0 = lanePt(s, HERO[0]), a1 = lanePt(s, HERO[1]), b0 = lanePt(s + 0.5, HERO[0]), b1 = lanePt(s + 0.5, HERO[1]); v.push(a0[0], 0, a0[1], a1[0], 0, a1[1], b0[0], 0, b0[1], a1[0], 0, a1[1], b1[0], 0, b1[1], b0[0], 0, b0[1]); }
  const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  const F = new THREE.Mesh(fg, mapMat('#16232c', { alpha: 1, noise: 0.1 })); F.renderOrder = 2; F.frustumCulled = false; scene.add(F);
}

// ---------- câmera única (regras 1 e 2): chaves com alvo, distância, rumo e inclinação ----------
const N = -Math.PI / 2;   // olhando para o norte
const c0 = lanePt(sA, 3.2), c1 = lanePt(sA + 3.0, 3.2), PAPER = lanePt(sA + 6.4, 7.2);
const WORLD = [-4620, 1825];
const KEYS = [
  [0.0, { x: c0[0], z: c0[1], D: 7.0, yaw: laneYaw(sA) + 0.06, pitch: 0.40 }],
  [4.2, { x: c1[0], z: c1[1], D: 6.6, yaw: laneYaw(sA + 3) + 0.03, pitch: 0.46 }],
  [6.5, { x: PAPER[0] - 0.4, z: PAPER[1] - 0.2, D: 7.4, yaw: laneYaw(sA + 6) - 0.02, pitch: 0.72 }],
  [7.5, { x: PAPER[0] + 0.3, z: PAPER[1] - 0.6, D: 9.5, yaw: laneYaw(sA + 6) - 0.08, pitch: 0.76 }],
  [9.6, { x: PL.ESTREITO[0] + 2, z: PL.ESTREITO[1] + 9, D: 300, yaw: N + 0.06, pitch: 1.10 }],
  [13.4, { x: PL.ESTREITO[0] + 6, z: PL.ESTREITO[1] + 8, D: 275, yaw: N + 0.04, pitch: 1.12 }],
  [18.7, { x: PL.ESTREITO[0] + 8, z: PL.ESTREITO[1] + 1, D: 188, yaw: N + 0.01, pitch: 1.14 }],
  [21.2, { x: PL.ESTREITO[0] + 9, z: PL.ESTREITO[1], D: 200, yaw: N, pitch: 1.15 }],
  [22.7, { x: WORLD[0], z: WORLD[1], D: 40000, yaw: N, pitch: 1.32 }],
  [25.2, { x: WORLD[0] + 500, z: WORLD[1] - 150, D: 37500, yaw: N - 0.01, pitch: 1.33 }],
  [29.8, { x: PL.GOLFO[0] - 40, z: PL.GOLFO[1] + 30, D: 1250, yaw: N + 0.10, pitch: 1.02 }],
  [37.6, { x: PL.GOLFO[0] + 300, z: PL.GOLFO[1] + 10, D: 1000, yaw: N + 0.16, pitch: 0.98 }],
  [40.5, { x: c0[0] + 1, z: c0[1], D: 8.0, yaw: laneYaw(sA) + 0.10, pitch: 0.44 }],
  [43.6, { x: c1[0] + 0.5, z: c1[1], D: 7.4, yaw: laneYaw(sA + 3) + 0.07, pitch: 0.47 }],
  [51.2, { x: PL.ESTREITO[0], z: PL.ESTREITO[1] + 5, D: 165, yaw: N + 0.05, pitch: 1.05 }],
  [55.2, { x: PL.ESTREITO[0] + 4, z: PL.ESTREITO[1] + 7, D: 150, yaw: N + 0.03, pitch: 1.07 }],
  [58.7, { x: PL.MINAS[0], z: PL.MINAS[1] - 2, D: 58, yaw: N - 0.05, pitch: 0.98 }],
  [59.8, { x: PL.MINAS[0] + 1, z: PL.MINAS[1] - 1, D: 54, yaw: N - 0.07, pitch: 0.97 }],
  [61.4, { x: c0[0], z: c0[1], D: 7.0, yaw: laneYaw(sA) + 0.06, pitch: 0.40 }],        // regra 8: volta ao primeiro objeto
  [DUR + 0.5, { x: lanePt(sA + 4.6, 3.2)[0], z: lanePt(sA + 4.6, 3.2)[1], D: 6.4, yaw: laneYaw(sA + 4.6) + 0.02, pitch: 0.45 }],
];
const kt = KEYS.map(k => k[0]);
const CH = { x: pchip(kt, KEYS.map(k => k[1].x)), z: pchip(kt, KEYS.map(k => k[1].z)), lD: pchip(kt, KEYS.map(k => Math.log(k[1].D))), yaw: pchip(kt, KEYS.map(k => k[1].yaw)), pitch: pchip(kt, KEYS.map(k => k[1].pitch)) };
const STAMP_T = w(12, 'fechou') + 0.15;   // no meio da palavra: o som do carimbo não cobre o começo dela
function camAt(t) {
  const hh = handheld(t, 1), D0 = Math.exp(CH.lD(t));
  const u = t - STAMP_T, punch = u > 0 ? Math.exp(-u * 9) * Math.sin(u * 46) : 0;   // regra 5: tranco do carimbo
  return { x: CH.x(t), z: CH.z(t), D: D0 * (1 - 0.035 * punch), yaw: CH.yaw(t) + hh.yaw, pitch: CH.pitch(t) + hh.pitch + 0.004 * punch, roll: hh.roll, aperture: 0.0035 };
}

// ---------- frase 1 e 14: cota vermelha na largura do corredor (regra 5) ----------
const RED = '#e3271c';
const sC1 = sA + 2.3, sC14 = sA + 2.2;
const cota = ribbon(RED, { order: 8 }), tickA = ribbon(RED, { order: 8 }), tickB = ribbon(RED, { order: 8 });
const lbl3 = label('3 KM', { size: 0.42, flat: false, color: '#f2ebdc' });
function cotaAt(t, s, tDraw, tLabel, tOff, wpx) {
  const a = lanePt(s, HERO[0] - 0.05), b = lanePt(s, HERO[1] + 0.05), d = laneAt(s), tl = 0.32;
  const vis = t < tDraw ? 0 : 1 - smooth(tOff, tOff + 0.35, t);
  const p = easeInOut((t - tDraw) / 0.3);
  cota.userData.set([a, b], wpx, p); cota.material.opacity = vis;
  const tk = (P, on) => [[P[0] - d.dx * tl, P[1] - d.dz * tl], [P[0] + d.dx * tl, P[1] + d.dz * tl]];
  tickA.userData.set(tk(a), wpx, smooth(tDraw, tDraw + 0.08, t)); tickB.userData.set(tk(b), wpx, smooth(tDraw + 0.26, tDraw + 0.34, t));
  tickA.material.opacity = tickB.material.opacity = vis;
  const [lx, lz] = lanePt(s + 0.55, 3.2); lbl3.position.set(lx, 0.32, lz);
  lbl3.userData.reveal((t - tLabel) * 18); lbl3.material.opacity = vis;
}

// ---------- frase 2: ficha em papel cai de perto da lente e assenta ao lado da faixa (regra 4) ----------
const paperTex = canvasTexture(1400, 900, (g, w, h) => {
  g.fillStyle = '#d9cfb8'; g.fillRect(0, 0, w, h);
  const r = rng(7); for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '90,80,60' : '255,250,235'},${0.04 * r()})`; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3); }
  g.strokeStyle = 'rgba(80,70,55,0.35)'; g.lineWidth = 3; g.strokeRect(44, 44, w - 88, h - 88);
  g.fillStyle = '#1d1a16'; g.font = '700 98px Maquina'; g.textBaseline = 'alphabetic';
  g.fillText('PRAIA DE', 92, 210); g.fillText('COPACABANA', 92, 318);
  g.fillStyle = '#a3241b'; g.font = '700 118px Maquina'; g.fillText('EXTENSÃO: 4 KM', 92, 470);
  g.fillStyle = 'rgba(70,65,55,0.42)'; for (let i = 0; i < 6; i++) { const y = 560 + i * 50; g.fillRect(92, y, (w - 184) * (i === 5 ? 0.45 : 0.78 + 0.2 * r()), 16); }
});
const PW = 3.7, PH = PW * 900 / 1400;
const paper = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), new THREE.MeshBasicMaterial({ map: paperTex, color: new THREE.Color('#8f8a80'), transparent: true, side: THREE.DoubleSide, depthWrite: true }));
paper.renderOrder = 10; paper.frustumCulled = false; scene.add(paper);
const shadowTex = canvasTexture(256, 256, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(0,0,0,0.75)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
const pShadow = new THREE.Mesh(new THREE.PlaneGeometry(PW * 1.5, PH * 1.6).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthTest: false, depthWrite: false }));
pShadow.renderOrder = 9; scene.add(pShadow);
const P_T0 = 4.95, P_T1 = w(2, 'Copacabana') + 0.06;
const pStart = (() => { const k = camState(camAt(P_T0)); return { pos: k.pos.clone().addScaledVector(k.dir, 1.25).addScaledVector(k.up, 0.18).addScaledVector(k.right, -0.25), q: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(), k.dir.clone().negate(), k.up)).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.5)) }; })();
const pEnd = (() => { const yaw = laneYaw(sA + 6.4); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)); q.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -yaw - Math.PI / 2)); return { pos: new THREE.Vector3(PAPER[0], 0.015, PAPER[1]), q }; })();
function paperAt(t) {
  const u = clamp((t - P_T0) / (P_T1 - P_T0)), vis = (t >= P_T0 ? 1 : 0) * (1 - smooth(8.2, 9.0, t));
  paper.visible = pShadow.visible = vis > 0; if (!vis) return;
  const e = easeOut(u), ey = 1 - Math.pow(1 - u, 2.2);
  paper.position.set(lerp(pStart.pos.x, pEnd.pos.x, e), lerp(pStart.pos.y, pEnd.pos.y, ey), lerp(pStart.pos.z, pEnd.pos.z, e));
  paper.quaternion.copy(pStart.q).slerp(pEnd.q, easeInOut(u * 1.05));
  const fl = Math.sin(u * 9.5) * (1 - u) * 0.35; paper.rotateX(fl); paper.rotateY(fl * 0.4);
  paper.material.opacity = vis; pShadow.position.set(paper.position.x + 0.15, 0.002, paper.position.z + 0.12);
  pShadow.rotation.y = -laneYaw(sA + 6.4) - Math.PI / 2; pShadow.material.opacity = vis * smooth(0.45, 1, u);
}

// ---------- frase 3: IRÃ e OMÃ datilografados; círculo vermelho no estreito (regras 5 e 8) ----------
const lIra = label('IRÃ', { size: 11 }), lOma = label('OMÃ', { size: 11 });
const PJ = (lon, lat) => [(lon - meta.proj.LON0) * meta.proj.KX, -(lat - meta.proj.LAT0) * meta.proj.KZ];
const pI = PJ(57.1, 26.8), pO = PJ(56.28, 26.12); lIra.position.set(pI[0], 0.01, pI[1]); lOma.position.set(pO[0], 0.01, pO[1]);
const circ3 = ribbon(RED, { order: 8 }), CIRC3 = handCircle(PL.ESTREITO[0] - 1, PL.ESTREITO[1] + 1, 31, 25, 3);
// frase 13: círculo nas minas + "SEGUNDO O IRÃ"
const circ13 = ribbon(RED, { order: 8 }), CIRC13 = handCircle(PL.MINAS[0], PL.MINAS[1], 6.5, 5.2, 11);

// ---------- frases 5 e 6: grade de 100 casas sobre o mapa (regra 7) ----------
function grid(cell, gap, cx, cz) {
  const g = new THREE.Group(); scene.add(g); const cells = [];
  for (let i = 0; i < 100; i++) {
    const r = Math.floor(i / 10), c = i % 10;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(cell - gap, cell - gap).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color('#f0a43c'), transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    m.position.set(cx + (c - 4.5) * cell, 0.002, cz + (r - 4.5) * cell); m.renderOrder = 7; m.frustumCulled = false; g.add(m); cells.push(m);
  }
  return cells;
}
const G5 = grid(5.0, 0.9, PL.ESTREITO[0] + 9, PL.ESTREITO[1]), G6 = grid(1150, 190, WORLD[0] + 600, WORLD[1] - 600);
const lOrmuz5 = label('ORMUZ', { size: 6 }), lBrasil5 = label('BRASIL', { size: 6 }), lOrmuz6 = label('ORMUZ', { size: 900 });
lOrmuz5.position.set(PL.ESTREITO[0] + 9 - 44, 0.01, PL.ESTREITO[1] - 22); lBrasil5.position.copy(lOrmuz5.position);
lOrmuz6.position.set(WORLD[0] + 600 - 8200, 0.01, WORLD[1] - 600 - 5175);
const LIT = '#d99536', OFF = '#3b3428';
function gridAt(cells, t, tIn, tLit, nLit, tDim, tOut, dimTo) {
  const vis = smooth(tIn, tIn + 0.15, t) * (1 - smooth(tOut, tOut + 0.35, t));
  cells.forEach((m, i) => {
    const appear = smooth(tIn + i * 0.006, tIn + i * 0.006 + 0.12, t);
    const on = i < nLit ? smooth(tLit + i * 0.012, tLit + i * 0.012 + 0.12, t) : (tDim == null ? 0 : smooth(tLit + i * 0.003, tLit + i * 0.003 + 0.1, t) * (1 - smooth(tDim + (99 - i) * 0.003, tDim + (99 - i) * 0.003 + 0.12, t)));
    m.material.color.set(OFF).lerp(new THREE.Color(LIT), on); m.material.opacity = vis * appear * (0.34 + 0.48 * on);
    m.visible = vis > 0;
  });
}

// ---------- frase 12: carimbo (regra 5) ----------
const stampTex = canvasTexture(1400, 640, (g, w, h) => {
  g.translate(w / 2, h / 2); g.strokeStyle = g.fillStyle = '#b81d14'; g.lineWidth = 22; g.strokeRect(-w / 2 + 30, -h / 2 + 30, w - 60, h - 60); g.lineWidth = 7; g.strokeRect(-w / 2 + 64, -h / 2 + 64, w - 128, h - 128);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '700 170px Maquina'; g.fillText('FECHADO', 0, -88); g.fillText('DE NOVO', 0, 72);
  g.font = '700 70px Maquina'; g.fillText('JULHO · 2026', 0, 205);
  g.globalCompositeOperation = 'destination-out'; const r = rng(5); for (let i = 0; i < 2600; i++) { g.globalAlpha = r() * 0.8; g.beginPath(); g.arc((r() - 0.5) * w, (r() - 0.5) * h, r() * 5 + 1, 0, 6.28); g.fill(); }
});
const stamp = new THREE.Mesh(new THREE.PlaneGeometry(58, 58 * 640 / 1400).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: stampTex, transparent: true, depthTest: false, depthWrite: false }));
stamp.position.set(PL.ESTREITO[0] + 2, 0.01, PL.ESTREITO[1] + 4); stamp.rotation.y = 0.12; stamp.renderOrder = 8; scene.add(stamp);

// ---------- HUD: régua de anos, ano em serifa, contadores e texto datilografado ----------
const S = SCALE, CREAM = '#ece4d2', AMBER = '#f0a43c';
const RULER = [[0, 2026.87], [w(4, 'dois'), 2026.87], [we(4, 'cinco'), 2025.5], [w(7, 'mil'), 2025.5], [we(7, 'quatro'), 1984], [w(8, 'mil'), 1984], [we(8, 'oito'), 1988], [w(10, 'dois'), 1988], [we(10, 'seis'), 2026.17], [w(12, 'julho'), 2026.17], [we(12, 'julho') + 0.2, 2026.5], [w(13, 'neste'), 2026.5], [we(13, 'semana'), 2026.87]];
function rulerYear(t) { for (let i = 0; i < RULER.length - 1; i++) if (t < RULER[i + 1][0]) { const [t0, y0] = RULER[i], [t1, y1] = RULER[i + 1]; return lerp(y0, y1, easeInOut((t - t0) / Math.max(1e-6, t1 - t0))); } return RULER[RULER.length - 1][1]; }
function drawRuler(t) {   // regra 7: régua fina de anos embaixo
  const a = smooth(0.2, 0.9, t), y = 900 * S, x0 = 430 * S, x1 = 1490 * S, Y0 = 1980, Y1 = 2027, X = yr => lerp(x0, x1, (yr - Y0) / (Y1 - Y0));
  hud.save(); hud.globalAlpha = a * 0.75; hud.strokeStyle = CREAM; hud.lineWidth = 1.5 * S; hud.beginPath(); hud.moveTo(x0, y); hud.lineTo(x1, y); hud.stroke();
  hud.font = `400 ${21 * S}px MaquinaR`; hud.fillStyle = CREAM; hud.textAlign = 'center';
  for (let yr = 1980; yr <= 2026; yr++) { const dec = yr % 10 === 0; hud.globalAlpha = a * (dec ? 0.7 : 0.35); hud.beginPath(); hud.moveTo(X(yr), y); hud.lineTo(X(yr), y - (dec ? 12 : 6) * S); hud.stroke(); if (dec) hud.fillText(String(yr), X(yr), y + 26 * S); }
  const yr = rulerYear(t), mx = X(yr); hud.globalAlpha = a; hud.fillStyle = AMBER;
  hud.beginPath(); hud.moveTo(mx, y - 4 * S); hud.lineTo(mx - 8 * S, y - 18 * S); hud.lineTo(mx + 8 * S, y - 18 * S); hud.closePath(); hud.fill();
  hud.font = `700 ${24 * S}px Maquina`; hud.fillText(String(Math.floor(yr + 1e-6)), mx, y - 28 * S); hud.restore();
}
function drawYear(t, str, times, tOut) {   // regra 6: um algarismo por palavra, preso no centro, em serifa
  const a = 1 - smooth(tOut, tOut + 0.45, t); if (t < times[0] || a <= 0) return;
  hud.save(); hud.font = `900 ${330 * S}px Serifa`; hud.textBaseline = 'middle'; hud.textAlign = 'left';
  const ws = [...str].map(c => hud.measureText(c).width), tot = ws.reduce((p, c) => p + c, 0) + 18 * S * 3; let x = W / 2 - tot / 2;
  [...str].forEach((ch, i) => { const k = smooth(times[i], times[i] + 0.16, t); if (k > 0) { hud.globalAlpha = a * k; hud.shadowColor = 'rgba(255,160,70,0.45)'; hud.shadowBlur = 50 * S; hud.fillStyle = '#f4e8cf'; hud.fillText(ch, x, 520 * S + (1 - k) * 18 * S); } x += ws[i] + 18 * S; });
  hud.restore();
}
const fmt = n => (n < 0 ? '−' : '') + Math.round(Math.abs(n)).toLocaleString('pt-BR');
function drawCounter(t, segs, finalStr, unit, tIn, tOut) {   // regra 7: contador correndo que para na palavra
  const a = smooth(tIn, tIn + 0.25, t) * (1 - smooth(tOut, tOut + 0.4, t)); if (a <= 0) return;
  let v = segs[0][2]; for (const [t0, t1, v0, v1] of segs) { if (t >= t0) v = lerp(v0, v1, easeOut((t - t0) / (t1 - t0))); }
  const str = fmt(v);
  hud.save(); hud.globalAlpha = a; hud.font = `700 ${168 * S}px Maquina`; hud.textBaseline = 'middle';
  const fw = hud.measureText(finalStr).width, right = W / 2 + fw / 2; hud.textAlign = 'right';
  hud.shadowColor = 'rgba(0,0,0,0.9)'; hud.shadowBlur = 30 * S; hud.fillStyle = '#f4ecdb'; hud.fillText(str, right, 470 * S);
  for (const [txt, t0] of unit) { const n = Math.floor((t - t0) * 28); if (n <= 0) continue; const next = unit.find(u => u[1] > t0); if (next && t >= next[1]) continue;
    hud.textAlign = 'center'; hud.font = `700 ${50 * S}px Maquina`; hud.fillStyle = AMBER; hud.fillText(txt.slice(0, n), W / 2, 600 * S); }
  hud.restore();
}
function drawTyped(t, lines, t0, cps, tOut, y = 500, size = 74) {   // regra 8: frase datilografada, uma vez só
  const a = 1 - smooth(tOut, tOut + 0.4, t); if (t < t0 || a <= 0) return;
  let n = Math.floor((t - t0) * cps); hud.save(); hud.globalAlpha = a; hud.font = `700 ${size * S}px Maquina`; hud.textBaseline = 'middle'; hud.textAlign = 'left';
  hud.shadowColor = 'rgba(0,0,0,0.9)'; hud.shadowBlur = 24 * S; hud.fillStyle = '#f2ebdc';
  lines.forEach((ln, i) => { const full = hud.measureText(ln).width, s = ln.slice(0, Math.max(0, n)); n -= ln.length; hud.fillText(s, W / 2 - full / 2, (y + (i - (lines.length - 1) / 2) * size * 1.25) * S); });
  hud.restore();
}

// ---------- o mundo em cada instante ----------
const DIMS = [[5.0, 7.7, 0.6], [15.0, 18.8, 0.45], [18.9, 21.3, 0.55], [22.0, 25.0, 0.55], [25.3, 30.1, 0.5], [32.6, 37.4, 0.45], [37.8, 41.3, 0.5], [41.8, 43.9, 0.5], [45.5, 51.6, 0.45], [53.7, 55.5, 0.6], [57.0, 60.0, 0.7], [62.2, DUR + 1, 0.45]];
const dimAt = t => DIMS.reduce((d, [a, b, v]) => Math.min(d, lerp(1, v, win(t, a, b, 0.4, 0.4))), 1);
const YEARS = [[w(7, 'mil'), w(7, 'novecentos'), w(7, 'oitenta'), w(7, 'quatro')], [w(10, 'dois'), w(10, 'mil'), w(10, 'vinte'), w(10, 'seis')]];
const AMB = [[25.3, 30.0], [41.5, 44.0]];
function world(ts) {
  const k = camAt(ts), cs = camState(k), px = k.D * 2 * Math.tan(FOV * Math.PI / 360) / H;   // unidades do mundo por pixel no alvo
  U.uPoolC.value.set(k.x, k.z); U.uPoolR.value = k.D * 0.95; U.uDim.value = dimAt(ts);
  let ai = 0; for (const [a, b] of AMB) if (ts > a && ts < b) { const u = (ts - a) / (b - a); const c = cs.target.clone().addScaledVector(cs.right, lerp(-1.1, 1.1, u) * k.D * 0.7); U.uAmbC.value.set(c.x, c.z); U.uAmbR.value = k.D * 0.55; ai = 0.42 * Math.sin(u * Math.PI); }
  U.uAmbI.value = ai;
  // frase 1 (e retorno na 14)
  if (ts < 30) cotaAt(ts, sC1, w(1, 'três'), w(1, 'quilômetros'), 4.75, px * 5.5);
  else cotaAt(ts, sC14, w(14, 'três'), w(14, 'quilômetros'), 62.0, px * 5.5);
  lbl3.quaternion.copy(new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(cs.pos, cs.target, cs.up)));
  lbl3.lookAt(cs.pos);
  paperAt(ts);
  // frase 3
  lIra.userData.reveal((ts - w(3, 'Irã')) * 14); lOma.userData.reveal((ts - w(3, 'Omã')) * 14);
  lIra.material.opacity = lOma.material.opacity = 1 - smooth(13.1, 13.6, ts);
  circ3.userData.set(CIRC3, px * 5.5, easeInOut((ts - w(3, 'única')) / (we(3, 'saída') - w(3, 'única') + 0.1))); circ3.material.opacity = 1 - smooth(13.1, 13.6, ts);
  // frases 5 e 6
  gridAt(G5, ts, 18.92, 19.05, 19, w(5, 'Brasil'), 21.0);
  lOrmuz5.userData.reveal((ts - 19.05) * 16); lOrmuz5.material.opacity = 1 - smooth(w(5, 'Brasil') - 0.1, w(5, 'Brasil') + 0.1, ts);
  lBrasil5.userData.reveal((ts - w(5, 'Brasil')) * 16); lBrasil5.material.opacity = 1 - smooth(21.0, 21.35, ts);
  gridAt(G6, ts, 22.25, w(6, 'cinco'), 20, null, 24.8);
  lOrmuz6.userData.reveal((ts - w(6, 'cinco') - 0.25) * 16); lOrmuz6.material.opacity = 1 - smooth(24.8, 25.15, ts);
  // frase 12
  { const u = ts - STAMP_T; stamp.visible = u > 0 && ts < 55.9; const sc = u < 0.07 ? lerp(1.35, 1, u / 0.07) : 1; stamp.scale.set(sc, 1, sc); stamp.material.opacity = (u > 0 ? 1 : 0) * (1 - smooth(55.3, 55.8, ts)); }
  // frase 13
  circ13.userData.set(CIRC13, px * 5.5, easeInOut((ts - w(13, 'minas')) / 0.55)); circ13.material.opacity = 1 - smooth(59.7, 60.15, ts);
  return k;
}
function drawHud(t) {
  hud.clearRect(0, 0, W, H);
  drawRuler(t);
  drawCounter(t, [[w(4, 'passavam'), w(4, 'milhões'), 0, 20e6]], '20.000.000', [['BARRIS DE PETRÓLEO POR DIA', w(4, 'milhões') + 0.15]], w(4, 'passavam') - 0.1, 18.55);
  drawYear(t, '1984', YEARS[0], 29.7);
  drawCounter(t, [[w(8, 'quatrocentos'), w(8, 'um'), 0, 451]], '451', [['NAVIOS ATINGIDOS', w(8, 'um') + 0.12]], w(8, 'quatrocentos') - 0.1, 37.25);
  drawTyped(t, ['MESMO ASSIM, A PASSAGEM', 'NUNCA TINHA SIDO FECHADA.'], w(9, 'Mesmo'), 22, 40.95);
  drawYear(t, '2026', YEARS[1], 43.75);
  drawCounter(t, [[w(11, 'perdeu'), w(11, 'milhões'), 0, -10e6]], '−10.000.000', [['BARRIS POR DIA A MENOS NO MUNDO', w(11, 'milhões') + 0.15]], w(11, 'mundo'), 51.4);
  drawTyped(t, ['SEGUNDO O IRÃ'], w(13, 'disse'), 26, 59.75, 300, 58);
  drawCounter(t, [[w(14, 'passavam'), w(14, 'cinco'), 0, 85], [w(14, 'nas'), w(14, 'nove'), 85, 9]], '85', [['NAVIOS POR DIA', w(14, 'cinco') + 0.12], ['NAS ÚLTIMAS 24 HORAS', w(14, 'nas') + 0.1]], w(14, 'passavam') - 0.1, DUR + 5);
}
// amostras por quadro: mais quando a câmera voa ou o papel cai perto da lente (borrão vem de amostrar, não de filtro)
function sppAt(t) {
  const a = camAt(t), b = camAt(t + 1 / FPS);
  const motion = Math.abs(Math.log(b.D / a.D)) + Math.hypot(b.x - a.x, b.z - a.z) / a.D + Math.abs(b.yaw - a.yaw) + Math.abs(b.pitch - a.pitch);
  let n = 10 + Math.round(clamp(motion * 260, 0, 22));
  if (t > P_T0 - 0.05 && t < P_T1 + 0.1) n = Math.max(n, 40);
  return +(Q.get('spp') || 0) || n;
}
window.TOTAL_FRAMES = Math.round(DUR * FPS);
window.DUR = DUR;
window.renderAt = (f) => {
  const t = f / FPS, spp = sppAt(t);
  drawHud(t);
  const u = t - STAMP_T, flash = u > 0 ? 0.9 * Math.exp(-u / 0.11) : 0;
  renderFrame(t, spp, world, { flash, expo: 1.0, bloom: 0.55 + flash * 0.8 });
  return spp;
};
window.proj = (t, lon, lat) => { const k = camState(camAt(t)); const c = new THREE.PerspectiveCamera(FOV, W / H, 0.01, 1e6); c.position.copy(k.pos); c.lookAt(k.target); c.updateMatrixWorld(); const [x, z] = PJ(lon, lat); const v = new THREE.Vector3(x, 0, z).project(c); return [Math.round((v.x + 1) / 2 * 1920), Math.round((1 - v.y) / 2 * 1080)]; };
window.READY = true;
} catch (e) { window.BOOT_ERROR = String(e && e.stack || e); console.error(e); }
