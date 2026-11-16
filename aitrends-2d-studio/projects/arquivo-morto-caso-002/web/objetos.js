// objetos.js — os objetos da mesa de evidências, todos feitos aqui (sem foto baixada):
// ardósia, fita crepe, papéis, caderno, chaves, trena, etiqueta preta, giz, lápis, toco de giz, bituca, pó.
// Unidade: centímetro. A mesa é o plano y = 0.
import { THREE, scene, canvasTex, grainFill, blotches, rng, clamp, lerp } from './mesa.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const add = (o, { cast = true, recv = true } = {}) => { o.traverse(m => { if (m.isMesh) { m.castShadow = cast; m.receiveShadow = recv; } }); scene.add(o); return o; };

// ---------- ardósia verde-escura ----------
export function ardosia(size = 700) {
  const tex = canvasTex(2048, 2048, (g, w, h) => {
    grainFill(g, w, h, '#26393a', 10, 3, 2);
    blotches(g, w, h, 220, 'rgba(10,22,22,A)', 30, 220, 5, 0.35);         // manchas escuras
    blotches(g, w, h, 160, 'rgba(120,150,145,A)', 20, 140, 7, 0.06);      // pó de giz espalhado
    const r = rng(9); g.lineCap = 'round';
    for (let i = 0; i < 70; i++) {                                        // marcas de apagador
      const x = r() * w, y = r() * h, len = 80 + r() * 260, a = r() * Math.PI;
      g.strokeStyle = `rgba(150,175,170,${0.015 + r() * 0.035})`; g.lineWidth = 18 + r() * 40;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * len * 0.5 + (r() - .5) * 40, y + Math.sin(a) * len * 0.5 + (r() - .5) * 40, x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke();
    }
    for (let i = 0; i < 500; i++) {                                       // riscos finos
      const x = r() * w, y = r() * h, len = 4 + r() * 30, a = r() * Math.PI * 2;
      g.strokeStyle = `rgba(170,190,185,${0.04 + r() * 0.08})`; g.lineWidth = 0.6 + r();
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); g.stroke();
    }
  });
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(2.2, 2.2);
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.82, metalness: 0 });
  // detalhe fino pela posição no mundo, para não ficar borrado de perto
  mat.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 vWp;
      float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }`)
      .replace('#include <map_fragment>', `#include <map_fragment>
      float fine = vn(vWp.xz * 3.1) * 0.5 + vn(vWp.xz * 9.7) * 0.3 + vn(vWp.xz * 31.0) * 0.2;
      diffuseColor.rgb *= 0.86 + 0.28 * fine;`);
  };
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size).rotateX(-Math.PI / 2), mat);
  return add(m, { cast: false });
}

// ---------- fita crepe branca (paredes da planta) ----------
function fitaTex(len, wid, seed) {
  const ppc = 10, w = Math.max(16, Math.round(len * ppc)), h = Math.round(wid * ppc * 2);
  return canvasTex(Math.min(4096, w), h, (g, W2, H2) => {
    grainFill(g, W2, H2, '#e6e1d3', 16, seed, 1);
    const r = rng(seed + 1);
    for (let i = 0; i < W2 / 3; i++) { g.fillStyle = `rgba(150,140,120,${r() * 0.06})`; g.fillRect(r() * W2, r() * H2, 1 + r() * 6, 0.6); }   // fibras
    blotches(g, W2, H2, Math.ceil(W2 / 120), 'rgba(120,110,90,A)', 6, 30, seed + 2, 0.12);                                                   // sujeira
    // pontas rasgadas: apaga o canto em zigue-zague
    g.globalCompositeOperation = 'destination-out';
    for (const side of [0, 1]) {
      g.beginPath(); const x0 = side ? W2 : 0, dir = side ? -1 : 1; g.moveTo(x0, 0);
      for (let y = 0; y <= H2; y += 3) g.lineTo(x0 + dir * (2 + r() * 7), y);
      g.lineTo(x0, H2); g.closePath(); g.fill();
    }
    // bordas levemente translúcidas
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 0, W2, 2); g.fillRect(0, H2 - 2, W2, 2);
  });
}
const fitas = [];
export function fita(x1, z1, x2, z2, { wid = 1.9, seed = 1, y = 0.03 } = {}) {
  const len = Math.hypot(x2 - x1, z2 - z1) + wid * 0.6;
  const tex = fitaTex(len, wid, seed);
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, transparent: true, alphaTest: 0.4, color: '#ffffff' });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(len, wid).rotateX(-Math.PI / 2), mat);
  m.position.set((x1 + x2) / 2, y + seed * 0.0007, (z1 + z2) / 2); m.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
  fitas.push(m); return add(m, { cast: false });
}
// "T" das pontas de parede, como nas plantas de fita
export function fitaT(x, z, ang, { len = 7, seed = 50 } = {}) { const c = Math.cos(ang), s = Math.sin(ang); return fita(x - c * len / 2, z - s * len / 2, x + c * len / 2, z + s * len / 2, { seed, y: 0.05 }); }

// ---------- papel (com leve curvatura e textura desenhada) ----------
export function papel(w, h, desenha, { ppc = 46, cor = '#e4dccb', curva = 0.35, seed = 1, cast = true } = {}) {
  const tex = canvasTex(Math.round(w * ppc), Math.round(h * ppc), (g, W2, H2) => {
    grainFill(g, W2, H2, cor, 9, seed, 2);
    blotches(g, W2, H2, 6, 'rgba(160,130,80,A)', W2 * 0.05, W2 * 0.3, seed + 3, 0.08);    // amarelado do tempo
    desenha(g, W2, H2, ppc);
  });
  const geo = new THREE.PlaneGeometry(w, h, 24, 32).rotateX(-Math.PI / 2);
  const p = geo.attributes.position, r = rng(seed);
  const cx = (r() - 0.5) * 2, cz = (r() - 0.5) * 2;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) / (w / 2), z = p.getZ(i) / (h / 2);
    const borda = Math.pow(Math.max(Math.abs(x), Math.abs(z)), 4);
    const canto = Math.max(0, x * Math.sign(cx || 1) + z * Math.sign(cz || 1) - 1.2);
    p.setY(i, 0.06 + curva * (0.25 * borda + 1.6 * canto * canto) + 0.05 * Math.sin(x * 2.1 + z * 1.3));
  }
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide });
  const m = new THREE.Mesh(geo, mat); m.userData.tex = tex; m.userData.w = w; m.userData.h = h;
  // camada de desenho por cima (marca-texto, círculo vermelho) refeita só quando muda
  const base = document.createElement('canvas'); base.width = tex.image.width; base.height = tex.image.height; base.getContext('2d').drawImage(tex.image, 0, 0);
  m.userData.camadas = []; let ult = '';
  m.userData.atualiza = (t) => {
    const chave = m.userData.camadas.map(c => c.estado(t)).join('|'); if (chave === ult) return; ult = chave;
    const g = tex.image.getContext('2d'); g.drawImage(base, 0, 0); for (const c of m.userData.camadas) c.desenha(g, tex.image.width, tex.image.height, ppc, t); tex.needsUpdate = true;
  };
  return add(m, { cast });
}

// círculo de caneta vermelha feito à mão, desenhado aos poucos (dentro da textura do papel)
export function circuloCaneta(papelMesh, cx, cy, rx, ry, t0, dur = 0.7, { cor = 'rgba(178,22,18,0.92)', larg = 0.16, seed = 3 } = {}) {
  const r = rng(seed), a0 = -2.2 + r() * 0.6, sweep = Math.PI * 2 + 0.35;
  papelMesh.userData.camadas.push({
    estado: t => Math.round(clamp((t - t0) / dur) * 40),
    desenha: (g, W2, H2, ppc, t) => {
      const k = clamp((t - t0) / dur); if (k <= 0) return; const kk = 1 - Math.pow(1 - k, 2.2);
      g.strokeStyle = cor; g.lineCap = 'round'; g.lineJoin = 'round';
      const n = Math.max(2, Math.round(90 * kk));
      for (let pass = 0; pass < 2; pass++) {
        g.lineWidth = larg * ppc * (pass ? 0.55 : 1); g.globalAlpha = pass ? 0.5 : 1; g.beginPath();
        for (let i = 0; i <= n; i++) { const a = a0 + sweep * kk * i / n, wob = 1 + 0.04 * Math.sin(a * 3 + seed) - 0.08 * Math.max(0, (a - a0 - 5.4) / 1.2); const x = (cx + Math.cos(a) * rx * wob) * ppc + pass * 1.5, y = (cy + Math.sin(a) * ry * wob) * ppc; i ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.stroke();
      }
      g.globalAlpha = 1;
    },
  });
}
// sublinhado de caneta, desenhado aos poucos
export function sublinha(papelMesh, x1, y1, x2, t0, dur = 0.45, { cor = 'rgba(178,22,18,0.92)', larg = 0.13 } = {}) {
  papelMesh.userData.camadas.push({
    estado: t => Math.round(clamp((t - t0) / dur) * 30),
    desenha: (g, W2, H2, ppc, t) => { const k = clamp((t - t0) / dur); if (k <= 0) return; g.strokeStyle = cor; g.lineWidth = larg * ppc; g.lineCap = 'round'; g.beginPath(); g.moveTo(x1 * ppc, y1 * ppc); for (let i = 1; i <= 20; i++) { const x = lerp(x1, x2, k * i / 20); g.lineTo(x * ppc, (y1 + Math.sin(i * 1.7) * 0.04 + (x - x1) * 0.012) * ppc); } g.stroke(); },
  });
}

// ---------- texto escrito a giz na ardósia, que se escreve sozinho ----------
export function giz(texto, x, z, { tam = 6, ang = 0, cor = '#e9ece4', t0 = 0, dur = 1.2, seed = 4, fonte = 'Giz', linhas = null } = {}) {
  const L = linhas || [texto], px = 120, g0 = document.createElement('canvas').getContext('2d'); g0.font = `600 ${px}px ${fonte}`;
  const tw = Math.max(...L.map(s => g0.measureText(s).width)) + px, th = px * (L.length * 1.05 + 0.4);
  const cv = document.createElement('canvas'); cv.width = Math.ceil(tw); cv.height = Math.ceil(th);
  const full = document.createElement('canvas'); full.width = cv.width; full.height = cv.height;
  { const g = full.getContext('2d'); g.font = `600 ${px}px ${fonte}`; g.fillStyle = cor; g.textBaseline = 'top'; L.forEach((s, i) => g.fillText(s, px * 0.5, px * 0.2 + i * px * 1.05));
    g.globalCompositeOperation = 'destination-out'; const r = rng(seed);                 // falhas do giz
    for (let i = 0; i < cv.width * cv.height / 40; i++) { g.fillStyle = `rgba(0,0,0,${0.3 + r() * 0.7})`; g.fillRect(r() * cv.width, r() * cv.height, 1 + r() * 2.5, 1 + r() * 1.5); } }
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const hgt = tam * th / px, wid = hgt * cv.width / cv.height;
  const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(wid, hgt).rotateX(-Math.PI / 2), mat); m.position.set(x, 0.02, z); m.rotation.y = -ang; m.receiveShadow = true; scene.add(m);
  let ult = -1; const nL = L.length;
  m.userData.atualiza = t => {   // revela linha por linha, da esquerda para a direita
    const k = clamp((t - t0) / dur), q = Math.round(k * 200); if (q === ult) return; ult = q;
    const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height);
    for (let i = 0; i < nL; i++) { const kl = clamp(k * nL - i); if (kl <= 0) break; const y0 = px * 0.2 + i * px * 1.05 - px * 0.1, ww = px * 0.5 + (cv.width - px) * kl; g.drawImage(full, 0, y0, ww, px * 1.2, 0, y0, ww, px * 1.2); }
    tex.needsUpdate = true;
  };
  m.userData.atualiza(0); return m;
}
// traço de giz (seta, linha, colchete) que se desenha sozinho
export function tracoGiz(pts, { larg = 0.5, t0 = 0, dur = 0.8, cor = '#e3e7df', seed = 6 } = {}) {
  const g = new THREE.BufferGeometry(), r = rng(seed);
  const mat = new THREE.MeshStandardMaterial({ color: cor, roughness: 1, transparent: true, opacity: 0.85, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const m = new THREE.Mesh(g, mat); m.receiveShadow = true; scene.add(m);
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  let ult = -1;
  m.userData.atualiza = t => {
    const k = clamp((t - t0) / dur), q = Math.round(k * 120); if (q === ult) return; ult = q; m.visible = k > 0; if (!m.visible) return;
    const end = L[L.length - 1] * k, P = [];
    for (let i = 0; i < pts.length; i++) { if (L[i] > end) { const a = pts[i - 1], b = pts[i], f = (end - L[i - 1]) / (L[i] - L[i - 1]); P.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]); break; } P.push(pts[i]); }
    const v = [];
    for (let i = 0; i < P.length - 1; i++) {
      const a = P[i], b = P[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], l = Math.hypot(dx, dz) || 1, nx = -dz / l * larg / 2, nz = dx / l * larg / 2;
      v.push(a[0] + nx, 0.025, a[1] + nz, a[0] - nx, 0.025, a[1] - nz, b[0] + nx, 0.025, b[1] + nz, a[0] - nx, 0.025, a[1] - nz, b[0] - nx, 0.025, b[1] - nz, b[0] + nx, 0.025, b[1] + nz);
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.computeVertexNormals(); g.computeBoundingSphere();
  };
  return m;
}

// ---------- etiqueta preta (fita de rotulador) ----------
export function etiqueta(texto, x, z, ang = 0, { alt = 2.0, seed = 8 } = {}) {
  const px = 90, g0 = document.createElement('canvas').getContext('2d'); g0.font = `700 ${px}px Maquina`;
  const tw = g0.measureText(texto).width + px * 1.2;
  const tex = canvasTex(Math.ceil(tw), Math.round(px * 1.5), (g, W2, H2) => {
    grainFill(g, W2, H2, '#121314', 8, seed, 2);
    g.font = `700 ${px}px Maquina`; g.textBaseline = 'middle'; g.fillStyle = '#e8e8e2'; g.fillText(texto, px * 0.6, H2 / 2 + 4);
    g.globalCompositeOperation = 'destination-out'; const r = rng(seed); g.beginPath(); g.moveTo(0, 0); for (let y = 0; y <= H2; y += 6) g.lineTo(r() * 5, y); g.lineTo(0, H2); g.fill();
    g.beginPath(); g.moveTo(W2, 0); for (let y = 0; y <= H2; y += 6) g.lineTo(W2 - r() * 5, y); g.lineTo(W2, H2); g.fill();
  });
  const wid = alt * tex.image.width / tex.image.height;
  const m = new THREE.Mesh(new THREE.BoxGeometry(wid, 0.08, alt), [0, 1, 2, 3, 4, 5].map(i => i === 2 ? new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, transparent: true, alphaTest: 0.5 }) : new THREE.MeshStandardMaterial({ color: '#0d0e0f', roughness: 0.4 })));
  m.position.set(x, 0.1, z); m.rotation.y = -ang; return add(m);
}

// ---------- chaves e chaveiro ----------
function formaChave(dentes) {
  const s = new THREE.Shape(); s.absarc(0, 0, 1.25, 0.35, Math.PI * 2 - 0.35, false);
  s.lineTo(1.6, -0.32); s.lineTo(5.6, -0.32);
  const r = rng(dentes); let x = 5.6; s.lineTo(5.9, 0.05);
  for (let i = 0; i < 6; i++) { x -= 0.55; s.lineTo(x + 0.27, 0.32 + r() * 0.25); s.lineTo(x, 0.32); }
  s.lineTo(1.6, 0.32); s.lineTo(Math.cos(0.35) * 1.25, Math.sin(0.35) * 1.25);
  const furo = new THREE.Path(); furo.absarc(-0.45, 0, 0.38, 0, Math.PI * 2, true); s.holes.push(furo); return s;
}
export function chaves(x, z, ang = 0, { n = 1 } = {}) {
  const grp = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: '#c9c3b2', metalness: 1, roughness: 0.32 });
  const latao = new THREE.MeshStandardMaterial({ color: '#8f7440', metalness: 1, roughness: 0.42 });
  const argola = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.11, 10, 48), metal); argola.rotation.x = Math.PI / 2; argola.position.y = 0.12; grp.add(argola);
  for (let i = 0; i < n; i++) {
    const geo = new THREE.ExtrudeGeometry(formaChave(11 + i * 7), { depth: 0.16, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, curveSegments: 18 });
    const k = new THREE.Mesh(geo, i ? metal : latao); k.rotation.x = -Math.PI / 2; k.position.set(1.7 + 0.9, 0.08 + i * 0.18, 0); k.rotation.z = -0.25 - i * 0.5;
    const piv = new THREE.Group(); piv.add(k); piv.rotation.y = -0.4 - i * 0.6; grp.add(piv);
  }
  grp.position.set(x, 0, z); grp.rotation.y = -ang; return add(grp);
}

// ---------- trena ----------
export function trena(x, z, ang, comp, { seed = 2 } = {}) {
  const grp = new THREE.Group();
  const caixa = new THREE.Mesh(new RoundedBoxGeometry(7.4, 3.6, 7.4, 4, 1.4), new THREE.MeshStandardMaterial({ color: '#d9a514', roughness: 0.45 }));
  caixa.position.set(-3.9, 1.8, 0); grp.add(caixa);
  const borracha = new THREE.Mesh(new RoundedBoxGeometry(5.6, 3.8, 5.6, 4, 1.2), new THREE.MeshStandardMaterial({ color: '#1b1b1a', roughness: 0.8 })); borracha.position.set(-3.9, 1.8, 0); borracha.scale.set(1, 1.03, 1); grp.add(borracha);
  const botao = new THREE.Mesh(new RoundedBoxGeometry(1.6, 0.8, 2.6, 2, 0.3), new THREE.MeshStandardMaterial({ color: '#2a2a28', roughness: 0.6 })); botao.position.set(-1.8, 3.7, 0); grp.add(botao);
  // a fita amarela, com centímetros impressos
  const ppc = 24, tex = canvasTex(Math.min(8192, Math.round(comp * ppc)), Math.round(2.5 * ppc), (g, W2, H2) => {
    grainFill(g, W2, H2, '#b8962a', 8, seed, 1);
    g.fillStyle = '#1a1712'; g.font = `700 ${Math.round(ppc * 0.7)}px Texto`; g.textBaseline = 'top';
    for (let cm = 0; cm * ppc < W2; cm++) {
      const x = cm * ppc, big = cm % 10 === 0, mid = cm % 5 === 0;
      g.fillRect(x, 0, big ? 2.4 : 1.4, H2 * (big ? 0.5 : mid ? 0.36 : 0.22));
      for (let mm = 1; mm < 10; mm++) g.fillRect(x + mm * ppc / 10, 0, 0.8, H2 * (mm === 5 ? 0.18 : 0.1));
      if (cm % 10 === 0 && cm) { g.fillStyle = '#b3201a'; g.fillText(String(cm), x + 3, H2 * 0.52); g.fillStyle = '#1a1712'; }
      else if (cm) g.fillText(String(cm % 10), x + 2, H2 * 0.55);
    }
  });
  const fitaG = new THREE.PlaneGeometry(comp, 2.5, Math.ceil(comp / 6), 1).rotateX(-Math.PI / 2);
  const p = fitaG.attributes.position; for (let i = 0; i < p.count; i++) { const u = (p.getX(i) + comp / 2) / comp, zz = p.getZ(i); p.setY(i, 0.08 + 0.12 * Math.sin(u * 40) * 0.2 + zz * zz * 0.035); }   // côncava, como fita de aço
  fitaG.computeVertexNormals();
  const fitaM = new THREE.Mesh(fitaG, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5, metalness: 0.0, side: THREE.DoubleSide })); fitaM.position.x = comp / 2; grp.add(fitaM);
  const gancho = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 2.7), new THREE.MeshStandardMaterial({ color: '#b9b4a8', metalness: 1, roughness: 0.3 })); gancho.position.set(comp, 0.6, 0); grp.add(gancho);
  grp.position.set(x, 0, z); grp.rotation.y = -ang; return add(grp);
}

// ---------- lápis, toco de giz, bituca ----------
export function lapis(x, z, ang) {
  const grp = new THREE.Group();
  const corpo = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 14, 6), new THREE.MeshStandardMaterial({ color: '#d9a92a', roughness: 0.45 })); corpo.rotation.z = Math.PI / 2; grp.add(corpo);
  const mad = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.6, 6), new THREE.MeshStandardMaterial({ color: '#d8b98a', roughness: 0.9 })); mad.rotation.z = -Math.PI / 2; mad.position.x = 7.8; grp.add(mad);
  const graf = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.55, 8), new THREE.MeshStandardMaterial({ color: '#2b2b2e', roughness: 0.4, metalness: 0.3 })); graf.rotation.z = -Math.PI / 2; graf.position.x = 8.85; grp.add(graf);
  const anel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.9, 16), new THREE.MeshStandardMaterial({ color: '#b8b2a4', metalness: 1, roughness: 0.35 })); anel.rotation.z = Math.PI / 2; anel.position.x = -7.4; grp.add(anel);
  const borr = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.9, 16), new THREE.MeshStandardMaterial({ color: '#d77f7f', roughness: 0.8 })); borr.rotation.z = Math.PI / 2; borr.position.x = -8.3; grp.add(borr);
  grp.position.set(x, 0.39, z); grp.rotation.y = -ang; return add(grp);
}
export function tocoGiz(x, z, ang) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.52, 4.2, 14), new THREE.MeshStandardMaterial({ color: '#efefe8', roughness: 1 }));
  m.rotation.z = Math.PI / 2; const grp = new THREE.Group(); grp.add(m); grp.position.set(x, 0.5, z); grp.rotation.y = -ang; return add(grp);
}
export function bituca(x, z, ang) {
  const grp = new THREE.Group();
  const filtro = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2, 16), new THREE.MeshStandardMaterial({ color: '#c8873e', roughness: 0.8 })); filtro.rotation.z = Math.PI / 2; filtro.position.x = -1; grp.add(filtro);
  const papelC = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 1.6, 16), new THREE.MeshStandardMaterial({ color: '#e9e6dc', roughness: 0.9 })); papelC.rotation.z = Math.PI / 2; papelC.position.x = 0.8; grp.add(papelC);
  const cinza = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.3, 0.4, 16), new THREE.MeshStandardMaterial({ color: '#3b3732', roughness: 1 })); cinza.rotation.z = Math.PI / 2; cinza.position.x = 1.8; grp.add(cinza);
  grp.position.set(x, 0.4, z); grp.rotation.y = -ang; return add(grp);
}
// pó branco espalhado (mancha transparente no chão)
export function po(x, z, r = 6, seed = 12) {
  const tex = canvasTex(512, 512, (g, w, h) => { const rr = rng(seed); for (let i = 0; i < 2600; i++) { const a = rr() * 6.283, d = Math.pow(rr(), 0.7) * w * 0.45; g.fillStyle = `rgba(235,235,228,${0.15 + rr() * 0.5})`; g.fillRect(w / 2 + Math.cos(a) * d * 1.3, h / 2 + Math.sin(a) * d * 0.6, 1 + rr() * 2.5, 1 + rr() * 2.5); } });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 1, depthWrite: false }));
  m.position.set(x, 0.04, z); m.receiveShadow = true; scene.add(m); return m;
}

// ---------- polaroid (moldura branca, foto desenhada, legenda à mão) ----------
export function polaroid(x, z, ang, foto, legenda, { seed = 21 } = {}) {
  const m = papel(8.8, 10.7, (g, w, h, p) => {
    g.fillStyle = '#eeeae0'; g.fillRect(0, 0, w, h);
    const fx = p * 0.6, fy = p * 0.6, fw = w - p * 1.2, fh = fw;
    g.save(); g.beginPath(); g.rect(fx, fy, fw, fh); g.clip(); foto(g, fx, fy, fw, fh, p);
    const gr = g.createRadialGradient(fx + fw / 2, fy + fh / 2, fw * 0.2, fx + fw / 2, fy + fh / 2, fw * 0.75); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = gr; g.fillRect(fx, fy, fw, fh);
    const r = rng(seed); for (let i = 0; i < fw * fh / 30; i++) { g.fillStyle = `rgba(255,240,220,${r() * 0.05})`; g.fillRect(fx + r() * fw, fy + r() * fh, 1.5, 1.5); }
    g.restore();
    g.font = `400 ${p * 0.62}px Caneta`; g.fillStyle = '#23306a'; g.textBaseline = 'middle'; g.fillText(legenda, p * 0.8, h - p * 1.05);
  }, { cor: '#eeeae0', seed, curva: 0.18 });
  m.position.set(x, 0.02, z); m.rotation.y = -ang; return m;
}
// marca redonda de xícara de café na ardósia
export function marcaCafe(x, z, r = 4.2, seed = 30) {
  const tex = canvasTex(256, 256, (g, w, h) => { const rr = rng(seed); for (let i = 0; i < 360; i++) { const a = i / 360 * 6.283, k = 0.86 + rr() * 0.04; g.strokeStyle = `rgba(70,45,25,${0.25 + rr() * 0.35})`; g.lineWidth = 2 + rr() * 4; g.beginPath(); g.arc(w / 2, h / 2, w * 0.45 * k, a, a + 0.03); g.stroke(); } const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.45); gr.addColorStop(0, 'rgba(60,40,20,0.06)'); gr.addColorStop(1, 'rgba(60,40,20,0.12)'); g.fillStyle = gr; g.beginPath(); g.arc(w / 2, h / 2, w * 0.43, 0, 6.283); g.fill(); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.7, depthWrite: false }));
  m.position.set(x, 0.015, z); m.receiveShadow = true; scene.add(m); return m;
}
// caderno aberto, espiral no meio, páginas pautadas com anotações à mão
export function caderno(x, z, ang, esq, dir, { seed = 41 } = {}) {
  const grp = new THREE.Group();
  const capa = new THREE.Mesh(new THREE.BoxGeometry(31, 0.25, 21.5), new THREE.MeshStandardMaterial({ color: '#3b2a22', roughness: 0.75 })); capa.position.y = 0.12; grp.add(capa);
  const pag = (desenha, sx, s) => { const m = papel(14.6, 20.4, (g, w, h, p) => { g.strokeStyle = 'rgba(90,120,160,0.45)'; g.lineWidth = 1.2; for (let y = p * 2.4; y < h - p * 0.8; y += p * 0.72) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } g.strokeStyle = 'rgba(190,60,60,0.45)'; g.beginPath(); g.moveTo(p * 1.6, 0); g.lineTo(p * 1.6, h); g.stroke(); desenha(g, w, h, p); }, { cor: '#f1ecdc', seed: s, curva: 0.5, cast: false }); scene.remove(m); m.position.set(sx, 0.32, 0); grp.add(m); return m; };
  const a = pag(esq, -7.6, seed), b = pag(dir, 7.6, seed + 1);
  for (let i = 0; i < 17; i++) { const anel = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 8, 20), new THREE.MeshStandardMaterial({ color: '#a8a39a', metalness: 1, roughness: 0.35 })); anel.position.set(0, 0.55, -9.6 + i * 1.2); grp.add(anel); }
  grp.position.set(x, 0, z); grp.rotation.y = -ang; add(grp); grp.userData.paginas = [a, b]; return grp;
}
