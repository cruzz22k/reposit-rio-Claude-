// sets/horror.js — kit de terror "não animado": cenários 3D escuros com luz realista + pós-processamento que esconde
// o 3D (câmera de segurança / foto antiga): granulado pesado, chiado, linhas de varredura, vinheta, riscos, cintilação.
import { E, rng, clamp, lerp, ease, prog, text, alpha, radGrad, linGrad } from '/engine/core.js';

const MONO = 'DejaVu Sans Mono';
// ---------- pós-processamento ----------
function noise(g, t, amt, size = 3) {
  const r = rng(Math.floor(t * 24) * 7 + 1), n = Math.floor(E.W * E.H / (size * size) * amt);
  for (let i = 0; i < n; i++) { const v = r(); g.fillStyle = v > 0.5 ? `rgba(255,255,255,${(v - 0.5) * 0.5})` : `rgba(0,0,0,${(0.5 - v) * 0.6})`; g.fillRect(r() * E.W, r() * E.H, size, size); }
}
function vignette(g, a = 0.75, inner = 0.35) { g.fillStyle = radGrad(g, E.W / 2, E.H / 2, E.H * inner, E.H * 0.78, ['rgba(0,0,0,0)', `rgba(0,0,0,${a})`]); g.fillRect(0, 0, E.W, E.H); }
export function cctvPost(g, t, o = {}) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const W = g.canvas.width, H = g.canvas.height;
  g.globalCompositeOperation = 'saturation'; g.fillStyle = '#808080'; g.fillRect(0, 0, W, H);                // preto e branco
  g.globalCompositeOperation = 'multiply'; g.fillStyle = o.tint || '#c8dcc8'; g.fillRect(0, 0, W, H);         // leve verde de câmera
  g.globalCompositeOperation = 'source-over'; g.restore();
  g.save(); vignette(g, 0.8, 0.3);
  for (let y = 0; y < E.H; y += 4) { g.fillStyle = 'rgba(0,0,0,.13)'; g.fillRect(0, y, E.W, 1.5); }               // linhas de varredura
  const by = ((t * 0.18) % 1.2 - 0.1) * E.H; g.fillStyle = linGrad(g, 0, by - 60, 0, by + 60, ['rgba(255,255,255,0)', 'rgba(255,255,255,.05)', 'rgba(255,255,255,0)']); g.fillRect(0, by - 60, E.W, 120);
  noise(g, t, o.noise ?? 0.07, 3);
  if (o.glitch > 0) { const r = rng(Math.floor(t * 24)); for (let i = 0; i < 9; i++) { const y = r() * E.H, h = 6 + r() * 50; g.drawImage(g.canvas, 0, y * E.PX, g.canvas.width, h * E.PX, (r() - 0.5) * 140 * o.glitch, y, E.W, h); } }
  // HUD
  const secs = (o.clock ?? 3 * 3600 + 16 * 60 + 41) + Math.floor(t), hh = Math.floor(secs / 3600) % 24, mm = Math.floor(secs / 60) % 60, ss = secs % 60, p2 = (n) => String(n).padStart(2, '0');
  const hud = { size: 38, color: 'rgba(235,240,235,.85)', font: MONO, weight: 700, align: 'left', glow: 6, glowColor: 'rgba(0,0,0,.9)' };
  text(g, o.cam || 'CAM 02', 60, 170, hud);
  if (Math.floor(t * 1.4) % 2 === 0) { g.fillStyle = '#e03030'; g.beginPath(); g.arc(E.W - 190, 168, 13, 0, 7); g.fill(); }
  text(g, 'REC', E.W - 165, 170, hud);
  text(g, `${o.date || '14/11/2026'}  ${p2(hh)}:${p2(mm)}:${p2(ss)}`, 60, E.H - 170, hud);
  g.restore();
}
export function filmPost(g, t, o = {}) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); const W = g.canvas.width, H = g.canvas.height;
  g.globalCompositeOperation = 'saturation'; g.fillStyle = `rgba(128,128,128,${o.desat ?? 0.75})`; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'multiply'; g.fillStyle = o.tint || '#d8c8b0'; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'source-over'; g.restore();
  g.save();
  const fl = 0.06 * Math.max(0, Math.sin(t * 23) * Math.sin(t * 7.3)); g.fillStyle = `rgba(0,0,0,${0.05 + fl})`; g.fillRect(0, 0, E.W, E.H);   // cintilação
  vignette(g, 0.85, 0.28); noise(g, t, o.noise ?? 0.05, 2);
  const r = rng(Math.floor(t * 24) * 3);                                                                                // riscos e poeira
  for (let i = 0; i < 3; i++) if (r() < 0.5) { g.fillStyle = 'rgba(240,235,220,.18)'; g.fillRect(r() * E.W, 0, 1.5, E.H); }
  for (let i = 0; i < 6; i++) { g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,.5)' : 'rgba(255,250,235,.4)'; g.beginPath(); g.arc(r() * E.W, r() * E.H, 1 + r() * 3, 0, 7); g.fill(); }
  g.restore();
}
// texto de máquina de escrever (regras)
export function typewriter(g, t, str, x, y, at, cps = 22, o = {}) {
  const n = Math.max(0, Math.floor((t - at) * cps)); if (n <= 0) return;
  const s = str.slice(0, n), lines = s.split('\n');
  lines.forEach((ln, i) => text(g, ln + (i === lines.length - 1 && n < str.length && Math.floor(t * 3) % 2 ? '█' : ''), x, y + i * (o.lh || 62), { size: o.size || 46, color: o.color || '#f0f0e8', font: MONO, weight: 700, align: 'left', glow: 14, glowColor: 'rgba(0,0,0,.95)' }));
}

// ---------- figura alta e magra (silhueta) ----------
export function tallFigure(T, o = {}) {
  const { THREE } = T, m = new THREE.MeshStandardMaterial({ color: '#050505', roughness: 1 }), g = new THREE.Group(), h = o.h || 2.5;
  const add = (geo, x, y, z, rx = 0, rz = 0) => { const k = new THREE.Mesh(geo, m); k.position.set(x, y, z); k.rotation.set(rx, 0, rz); k.castShadow = true; g.add(k); return k; };
  add(new THREE.CylinderGeometry(0.11, 0.07, h * 0.42, 8), 0, h * 0.62, 0);
  add(new THREE.SphereGeometry(0.13, 12, 10), 0, h * 0.9, 0).scale.set(0.85, 1.2, 0.9);
  for (const sx of [-1, 1]) { add(new THREE.CylinderGeometry(0.03, 0.025, h * 0.5, 6), sx * 0.13, h * 0.55, 0, 0, sx * 0.05); add(new THREE.CylinderGeometry(0.04, 0.03, h * 0.45, 6), sx * 0.06, h * 0.22, 0); }
  if (o.eyes) for (const sx of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: '#f0f0e0' })); e.position.set(sx * 0.04, h * 0.91, 0.11); g.add(e); }
  return g;
}

// ---------- o posto 24h ----------
export function gasStation(T, o = {}) {
  const { THREE } = T;
  const st = T.stage({ mood: 'night', sky: ['#020204', '#06070a', '#0a0c12'], fov: o.fov || 62, fog: [10, 48], fogColor: '#05060a', keyPos: [-8, 10, 6], keyColor: '#8090b0', keyIntensity: 0.35, ambient: 0.25, shadowSize: 18, bloom: 0.5, bloomThreshold: 0.75 });
  const asphalt = T.mat('#2a2a2c', { roughness: 0.95 }); st.add(T.ground(200, 200, '#1c1c1e'));
  const pad = T.box(14, 0.06, 9, asphalt, 0, 0.03, 0); st.add(pad);
  for (let i = -3; i <= 3; i++) st.add(T.box(0.15, 0.065, 1.4, T.mat('#9a9a8a'), i * 2.2, 0.035, 5.6));
  // cobertura com luzes fluorescentes
  for (const [x, z] of [[-4.5, -2.2], [4.5, -2.2], [-4.5, 2.2], [4.5, 2.2]]) st.add(T.box(0.35, 4.6, 0.35, '#c8c8c0', x, 2.3, z));
  st.add(T.box(11, 0.5, 6.4, '#d8d8d0', 0, 4.85, 0));
  const lamps = [];
  for (let i = 0; i < 3; i++) { const x = -3 + i * 3; const panel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.05, 0.5), new THREE.MeshBasicMaterial({ color: '#f4f8ff' })); panel.position.set(x, 4.58, 0); st.add(panel); const pl = new THREE.PointLight('#e8f0ff', 14, 11, 1.6); pl.position.set(x, 4.2, 0); pl.castShadow = i !== 2; st.add(pl); lamps.push({ panel, pl }); }
  // bombas
  const pumps = [];
  for (let i = 0; i < 3; i++) { const x = -3 + i * 3; st.add(T.box(1.6, 0.25, 0.9, '#9a9a94', x, 0.13, 0)); const p = T.box(0.7, 1.7, 0.5, '#b8b8b0', x, 1.1, 0); st.add(p);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.32), new THREE.MeshBasicMaterial({ map: T.canvasTex(128, 96, (gg, w, h) => { gg.fillStyle = '#0a1a10'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#9fffb0'; gg.font = 'bold 64px sans-serif'; gg.textAlign = 'center'; gg.fillText(String(i + 1), w / 2, 72); }) })); scr.position.set(x, 1.45, 0.26); st.add(scr); pumps.push(scr); }
  // a loja de conveniência
  st.add(T.box(9, 3.6, 4, '#8a8a84', 0, 1.8, -7.5));
  const win = T.windowPane(6, 2, { glowColor: '#fff4dc', cols: 4, rows: 1, power: 0.9, interior: true }); win.position.set(-0.6, 1.4, -5.48); st.add(win);
  const sl = new THREE.PointLight('#fff0d0', 6, 8, 1.6); sl.position.set(0, 1.6, -4.6); st.add(sl);
  // estrada e um poste distante, mato escuro
  st.add(T.box(200, 0.04, 7, '#141416', 0, 0.02, 11)); for (let x = -60; x < 60; x += 4) st.add(T.box(2, 0.045, 0.15, '#6a6a60', x, 0.04, 11));
  const pole = T.cyl(0.08, 0.1, 6, '#2a2a2a', -11, 3, 15); st.add(pole); const pb = new THREE.PointLight('#ffb070', 3, 9, 1.8); pb.position.set(-10.4, 5.8, 15); st.add(pb); st.add(new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), new THREE.MeshBasicMaterial({ color: '#ffd090' }))).position.set(-10.4, 5.85, 15);
  const r = rng(5); for (let i = 0; i < 40; i++) st.add(T.tree3D(-40 + r() * 80, -18 - r() * 20, 1.6 + r(), '#0c0c0e'));
  return { st, lamps, pumps };
}

// ---------- casa antiga, corredor e porta ----------
export function oldHouse(T) {
  const { THREE } = T, r = rng(3);
  const st = T.stage({ mood: 'night', sky: ['#05060c', '#0e1220', '#1a1e2e'], fov: 40, fog: [8, 40], fogColor: '#0a0c14', keyPos: [-10, 14, 8], keyColor: '#9aa8d0', keyIntensity: 0.9, ambient: 0.35, shadowSize: 16, bloom: 0.5, bloomThreshold: 0.8 });
  st.add(T.ground(200, 200, '#16181c'));
  const wood = T.planks('#3a342e', 18, [3, 2]), wm = T.mat('#ffffff', { map: wood, roughness: 1 });
  st.add(T.box(7, 4.2, 6, wm, 0, 2.1, -4)); const roof = T.cone(5.6, 2.6, '#1a1816', 0, 5.5, -4, 4); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.8); st.add(roof);
  st.add(T.box(7.6, 0.25, 1.6, '#2a2622', 0, 0.12, -0.3)); for (const x of [-3.4, 3.4]) st.add(T.box(0.18, 2.6, 0.18, '#2a2622', x, 1.3, 0.3)); st.add(T.box(7.6, 0.18, 1.8, '#1e1c1a', 0, 2.65, -0.2));
  const lit = T.windowPane(0.9, 1.2, { glowColor: '#ffcf90', cols: 2, rows: 2, power: 0.85 }); lit.position.set(1.8, 2.8, -0.98); st.add(lit);
  const dark = T.windowPane(0.9, 1.2, { lit: false, cols: 2, rows: 2 }); dark.position.set(-1.8, 2.8, -0.98); st.add(dark);
  st.add(T.box(1.0, 2.0, 0.1, '#1a1412', 0, 1.0, -0.98));
  const wl = new THREE.PointLight('#ffb870', 4, 7, 1.8); wl.position.set(1.8, 2.8, 0.2); st.add(wl);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(2.4, 20, 14), new THREE.MeshBasicMaterial({ color: '#d8dcf0', fog: false })); moon.position.set(-22, 24, -70); st.add(moon);
  // árvore seca
  const tm = T.mat('#0e0c0c'); const trunk = T.cyl(0.18, 0.32, 5, tm, -5.5, 2.5, 1.5, 7); st.add(trunk);
  for (let i = 0; i < 9; i++) { const b = T.cyl(0.03, 0.09, 2.2, tm, -5.5, 3.6 + i * 0.25, 1.5, 5); b.rotation.z = (r() - 0.5) * 2.2; b.rotation.x = (r() - 0.5) * 1.2; b.position.x += Math.sin(b.rotation.z) * -1; st.add(b); }
  return st;
}
export function hallway(T, o = {}) {
  const { THREE } = T;
  const st = T.stage({ mood: 'night', sky: '#000000', fov: o.fov || 46, fog: [3, 14], fogColor: '#050506', keyPos: [0, 6, 6], keyColor: '#8090b0', keyIntensity: 0.15, ambient: 0.18, shadowSize: 8, bloom: 0.45, bloomThreshold: 0.8 });
  const wall = T.mat('#5a5048', { roughness: 1 }), floorM = T.mat('#ffffff', { map: T.planks('#3a2e24', 10, [2, 6]), roughness: 0.9 });
  const L = 12, Wd = 1.8, Hh = 2.7;
  st.add(T.box(Wd, 0.05, L, floorM, 0, 0, -L / 2 + 1)); st.add(T.box(Wd, 0.05, L, wall, 0, Hh, -L / 2 + 1));
  st.add(T.box(0.05, Hh, L, wall, -Wd / 2, Hh / 2, -L / 2 + 1)); st.add(T.box(0.05, Hh, L, wall, Wd / 2, Hh / 2, -L / 2 + 1));
  st.add(T.box(Wd, Hh, 0.05, wall, 0, Hh / 2, -L + 1));
  for (let i = 0; i < 4; i++) { const fr = T.box(0.04, 0.5, 0.38, '#2a2018', -Wd / 2 + 0.05, 1.6, -1.5 - i * 2.4); st.add(fr); }
  // a porta no fim, entreaberta, com luz fraca por baixo
  const doorPiv = new THREE.Group(); doorPiv.position.set(-0.45, 0, -L + 1.06); st.add(doorPiv);
  const door = T.box(0.9, 2.05, 0.06, T.mat('#2a1e16', { roughness: 0.8 }), 0.45, 1.03, 0); doorPiv.add(door);
  const knob = T.sphere(0.035, T.mat('#a08850', { metalness: 0.6, roughness: 0.3 }), 0.8, 1.0, 0.05); doorPiv.add(knob);
  st.add(T.box(1.04, 2.15, 0.05, '#1a120c', 0, 1.07, -L + 1.0));
  const inside = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2.05), new THREE.MeshBasicMaterial({ color: '#000000' })); inside.position.set(0, 1.03, -L + 1.03); st.add(inside);
  const under = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.04), new THREE.MeshBasicMaterial({ color: '#ffb070' })); under.position.set(0, 0.03, -L + 1.1); under.rotation.x = -Math.PI / 2 + 0.3; st.add(under);
  const ul = new THREE.PointLight('#ff9a50', 0.8, 2.5, 2); ul.position.set(0, 0.1, -L + 1.3); st.add(ul);
  const bulb = new THREE.PointLight('#ffd8a0', 2.2, 6, 1.8); bulb.position.set(0, 2.4, -1.5); st.add(bulb);
  // dedos pálidos na borda da porta (escondidos até a hora)
  const hand = new THREE.Group(), skin = T.mat('#c8c4bc', { roughness: 0.9 });
  for (let i = 0; i < 4; i++) { const f = T.cyl(0.012, 0.014, 0.12 - Math.abs(i - 1.5) * 0.015, skin, 0, 0, 0, 6); f.rotation.z = Math.PI / 2; f.position.set(0.02, 1.35 + i * 0.03, 0.0); hand.add(f); }
  hand.position.set(-0.47, 0, -L + 1.0); hand.visible = false; st.add(hand);
  return { st, doorPiv, bulb, hand, L };
}
