// Caso 002 — "O corredor que encolhe", estilo Planta no escuro. Prévia: frases 1 a 5 (0 a 21,3 s).
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, trajeto, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo,
  camera, mao, iluminar, compor, limpar, pisca, legenda } from './planta.js';

await fontes();
const TL = await (await fetch('/project/input/timeline-v1.json')).json();
const S = i => TL[i - 1].start, E = i => TL[i - 1].end;
const P = (i, w) => { const f = TL[i - 1], k = f.text.indexOf(w); if (k < 0) throw new Error('palavra não achada: ' + w); return f.start + (f.end - f.start) * k / f.text.length; };
const Q = new URLSearchParams(location.search);
const FIM = Q.get('fim') ? +Q.get('fim') : 21.3;
const T2 = 3.35, T3 = 10.1, T4 = 13.65;                 // trocas de cena (a luz pisca)
const CLARO = '#f6ecd8', VERM_TXT = '#e0402f';

// ---------- planta do apartamento (metros; x para a direita, z para o fundo) ----------
const HP = 1.8, ESP = 0.14, ZF = 14;                    // altura do corte das paredes, espessura, parede do fundo do corredor
const PAREDES = [[0, 0, 4.2, 0], [5.1, 0, 6, 0], [0, 0, 0, 10], [6, 0, 6, 5], [0, 5, 2.2, 5], [3.3, 5, 4.5, 5], [5.5, 5, 7.5, 5], [0, 7, 2.2, 7], [0, 10, 2.2, 10],
  [2.2, 5, 2.2, 8], [2.2, 8.8, 2.2, ZF], [3.3, 5, 3.3, 12.6], [3.3, 13.4, 3.3, ZF], [3.3, 9.5, 7.5, 9.5], [7.5, 5, 7.5, ZF], [3.3, ZF, 7.5, ZF], [2.2, ZF, 3.3, ZF]];
const FUNDO_I = PAREDES.length - 1;
const caixas = PAREDES.map(([x1, z1, x2, z2], i) => ({ i, x0: Math.min(x1, x2) - ESP / 2, x1: Math.max(x1, x2) + ESP / 2, z0: Math.min(z1, z2) - ESP / 2, z1: Math.max(z1, z2) + ESP / 2, t0: 13.95 + 0.75 * (Math.min(z1, z2) + Math.max(z1, z2)) / 2 / ZF }));
const PORTAS = [[4.2, 0, 0.9, 0, 1], [2.2, 8, 0.8, Math.PI / 2, 1], [3.3, 13.4, 0.8, -Math.PI / 2, -1], [4.5, 5, 1.0, 0, 1]];   // dobradiça x,z, raio, ângulo inicial, sentido

// planta vista de cima, em 2D (fundo do título)
function planta2D(c, ox, oy, esc, p, alpha) {
  PAREDES.forEach(([x1, z1, x2, z2], i) => tinta(c, [[ox + x1 * esc, oy - z1 * esc], [ox + x2 * esc, oy - z2 * esc]], prog(p, i / PAREDES.length * 0.6, 0.4), { w: 2, alpha, seed: i + 1, over: 12 }));
}

// ---------- tomada 1: título ----------
function tomada1(t) {
  const k = 1 + 0.05 * easeInOut(t / 3.4), hh = mao(t, 5);
  g.save(); g.translate(W / 2 + hh.x, H / 2 + hh.y); g.rotate(hh.r); g.scale(k, k); g.translate(-W / 2, -H / 2);
  fundo(hh.x * 0.5, hh.y * 0.5);
  planta2D(g, 540 - 3.75 * 92, 1640, 92, prog(t, 0.3, 3.0), 0.16);
  const tag = 'ARQUIVO MORTO  ·  CASO 002';
  datilo(g, tag, W / 2, 690, (t - 0.45) / 0.65 * tag.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  const letras = (s, y, t0) => { g.save(); g.font = '106px Serifa'; g.letterSpacing = '2px'; const wd = g.measureText(s).width; let x = W / 2 - wd / 2;
    for (let i = 0; i < s.length; i++) { const a = easeOut(prog(t, t0 + i * 0.03, 0.22)); g.globalAlpha = a; g.fillStyle = CLARO; g.fillText(s[i], x, y + (1 - a) * 18); x += g.measureText(s[i]).width + 2; } g.restore(); };
  letras('O CORREDOR', 885, P(1, 'O corredor'));
  letras('QUE ENCOLHE', 1005, P(1, 'que'));
  // a cota vermelha embaixo encolhe aos saltos, como o corredor
  const fimX = 930 - [2.25, 2.55, 2.85, 3.15].reduce((s, tc) => s + 34 * easeOut(prog(t, tc, 0.12)), 0);
  cota(g, [150, 1090], [fimX, 1090], prog(t, P(1, 'encolhe') - 0.05, 0.4), null, { cor: COR.verm, w: 3 });
  g.restore();
  const liga = t < 0.28 ? 0 : t < 0.5 ? [0.7, 0, 0, 0.9, 0.4, 1][Math.floor((t - 0.28) / 0.037)] ?? 1 : 1;
  return { focos: [{ x: 540 + 40 * ruido(t * 0.4, 2), y: 900 + 30 * ruido(t * 0.4, 3), r: 950 }], amb: 0.14, mult: liga };
}

// ---------- tomada 2: o prédio, a janela do 503 ----------
const andarY = k => 3.5 + (k - 1) * 3;           // base do andar k (1 a 8); térreo de 0 a 3,5
const COLS = [-6, -2, 2, 6];
const cam2 = trajeto([[T2, 0, 13, -52, 0, 14.5, 0], [6.0, 0.4, 14, -44, 0.4, 15.2, 0], [P(2, 'quinhentos'), 1.4, 16, -29, 1.6, 16.6, 0], [9.45, 2, 17.2, -10, 2, 17.25, 0], [T3, 2, 17.25, -6.5, 2, 17.25, 0]]);
function predio(c, cam, t, x0, x1, alt, alpha, seed, t0) {
  const L = (pts, p, o = {}) => cam.linha(pts).forEach(pp => tinta(c, pp, p, { w: 2, alpha, seed, ...o }));
  L([[x0, 0, 0], [x0, alt, 0], [x1, alt, 0], [x1, 0, 0]], prog(t, t0, 1.2));
  for (let y = 3.5; y < alt - 1; y += 3) {
    L([[x0, y, 0], [x1, y, 0]], prog(t, t0 + 0.4 + y * 0.02, 0.5), { w: 1.4, alpha: alpha * 0.7 });
    for (let x = x0 + 1.4; x < x1 - 1.6; x += 3.2) L([[x, y + 1, 0], [x + 1.8, y + 1, 0], [x + 1.8, y + 2.4, 0], [x, y + 2.4, 0], [x, y + 1, 0]], prog(t, t0 + 0.8 + y * 0.02, 0.4), { w: 1.2, alpha: alpha * 0.6 });
  }
}
function tomada2(t) {
  const [px, py, pz, tx, ty, tz] = cam2(t), hh = mao(t, 0.25);
  const cam = camera([px + hh.x, py + hh.y, pz], [tx + hh.x * 0.6, ty + hh.y * 0.6, tz], 40, hh.r);
  fundo();
  const L = (pts, p, o = {}) => cam.linha(pts).forEach(pp => tinta(g, pp, p, { w: 2.2, ...o }));
  // vizinhos, mais apagados
  predio(g, cam, t, -25, -11.5, 18.5, 0.32, 21, T2 + 0.3); predio(g, cam, t, 11.5, 23, 21.5, 0.32, 22, T2 + 0.5);
  L([[-40, 0, 0], [40, 0, 0]], prog(t, T2 + 0.05, 0.7), { w: 2.4, over: 0 });
  // o Marajoara
  const TOPO = andarY(9);
  L([[-9, 0, 0], [-9, TOPO, 0]], prog(t, T2 + 0.2, 1.0), { seed: 2 }); L([[9, 0, 0], [9, TOPO, 0]], prog(t, T2 + 0.3, 1.0), { seed: 3 });
  L([[-9.3, TOPO, 0], [9.3, TOPO, 0], [9.3, TOPO + 0.8, 0], [-9.3, TOPO + 0.8, 0], [-9.3, TOPO, 0]], prog(t, T2 + 1.2, 0.5), { seed: 4 });
  L([[-3, TOPO + 0.8, 0], [-3, TOPO + 3, 0], [1.5, TOPO + 3, 0], [1.5, TOPO + 0.8, 0]], prog(t, T2 + 1.5, 0.4), { seed: 5, w: 1.8 });
  for (let k = 1; k <= 8; k++) {
    const y = andarY(k), tk = T2 + 0.6 + k * 0.1;
    L([[-9, y, 0], [9, y, 0]], prog(t, tk, 0.5), { seed: 10 + k, w: 1.8 });
    L([[-9, y, -0.35], [9, y, -0.35]], prog(t, tk + 0.1, 0.5), { seed: 30 + k, w: 1.2, alpha: 0.55 });
    COLS.forEach((cx, j) => {
      const tj = T2 + 1.2 + k * 0.09 + j * 0.05, a = [cx - 1.1, y + 1, 0], b = [cx + 1.1, y + 1, 0], cc = [cx + 1.1, y + 2.5, 0], d = [cx - 1.1, y + 2.5, 0];
      L([a, b, cc, d, a], prog(t, tj, 0.45), { seed: 50 + k * 4 + j, w: 1.6 });
      L([[cx, y + 1, 0], [cx, y + 2.5, 0]], prog(t, tj + 0.25, 0.3), { seed: 90 + k * 4 + j, w: 1.1, alpha: 0.7 });
    });
  }
  // térreo: porta e marquise
  L([[-1.3, 0, 0], [-1.3, 2.6, 0], [1.3, 2.6, 0], [1.3, 0, 0]], prog(t, T2 + 0.9, 0.5), { seed: 7 });
  L([[-2.4, 2.9, -1.2], [2.4, 2.9, -1.2], [2.4, 2.9, 0], [-2.4, 2.9, 0], [-2.4, 2.9, -1.2]], prog(t, T2 + 1.1, 0.5), { seed: 8, w: 1.6 });
  const pn = cam.pt([0, -1.9, 0]); if (pn) { const s = clamp(cam.esc([0, -1.9, 0]) * 0.75, 18, 80); datilo(g, 'EDIFÍCIO MARAJOARA', pn[0], pn[1], (t - P(2, 'Edifício')) / 0.7 * 18, { fonte: 'Maquina', tam: s, cor: COR.osso, alinh: 'center', esp: s * 0.3 }); }
  // a janela do 503 acende quando a Lúcia aparece
  const y5 = andarY(5), wq = [[0.9, y5 + 1, 0], [3.1, y5 + 1, 0], [3.1, y5 + 2.5, 0], [0.9, y5 + 2.5, 0]];
  const tl = P(2, 'Lúcia'), acesa = t < tl ? 0 : [0.6, 0.1, 0.9, 0.5, 1][Math.min(4, Math.floor((t - tl) / 0.05))];
  const poly = cam.poli(wq);
  if (poly && acesa > 0) {
    g.save(); g.beginPath(); poly.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.clip();
    const c0 = cam.pt([2, y5 + 1.75, 0]), s = cam.esc([2, y5 + 1.75, 0]);
    const gr = g.createRadialGradient(c0[0], c0[1] + s * 0.3, 0, c0[0], c0[1], s * 1.8); gr.addColorStop(0, `rgba(255,200,120,${acesa})`); gr.addColorStop(1, `rgba(190,110,40,${acesa * 0.85})`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // silhueta sem rosto, de costas para a rua
    const sx = cam.pt([1.55, y5 + 1, 0]), cab = cam.pt([1.55, y5 + 1.95, 0]);
    if (sx && cab) { g.fillStyle = `rgba(20,14,10,${acesa})`; g.beginPath(); g.ellipse(cab[0], cab[1], s * 0.17, s * 0.21, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(sx[0] - s * 0.42, sx[1] + 2); g.quadraticCurveTo(sx[0] - s * 0.4, cab[1] + s * 0.32, sx[0], cab[1] + s * 0.26); g.quadraticCurveTo(sx[0] + s * 0.4, cab[1] + s * 0.32, sx[0] + s * 0.42, sx[1] + 2); g.fill(); }
    // a esquadria por cima
    tinta(g, [poly[0], poly[1], poly[2], poly[3], poly[0]], 1, { w: 2.2, over: 0 }); const m0 = cam.pt([2, y5 + 1, 0]), m1 = cam.pt([2, y5 + 2.5, 0]); if (m0 && m1) tinta(g, [m0, m1], 1, { w: 1.8, over: 0 });
    g.restore();
  }
  // etiqueta AP. 503 com linha de chamada
  const tq = P(2, 'quinhentos'), cq = cam.pt([3.1, y5 + 2.5, 0]);
  if (cq && t > tq - 0.1 && t < T3 - 0.45) {
    const fx = cq[0] + 170, fy = cq[1] - 150, a = 1 - smooth(T3 - 0.9, T3 - 0.45, t);
    tinta(g, [cq, [fx - 10, fy + 14], [fx + 150, fy + 14]], prog(t, tq - 0.1, 0.35), { w: 2, cor: COR.verm, alpha: a, over: 0 });
    datilo(g, 'AP. 503', fx, fy, (t - tq - 0.1) / 0.4 * 7, { fonte: 'Maquina', tam: 46, cor: CLARO, alpha: a });
    datilo(g, 'LÚCIA', fx, fy + 58, (t - tq - 0.45) / 0.35 * 5, { fonte: 'Datilo', tam: 32, cor: COR.cinza, alpha: a, esp: 3 });
  }
  // data no canto
  const ta = P(2, 'agosto'), ad = 1 - smooth(8.6, 9.2, t);
  if (t > ta) { sb.fillStyle = COR.verm; sb.globalAlpha = ad; sb.fillRect(84, 224, 16, 16); sb.globalAlpha = 1; datilo(sb, 'AGO  ·  2021', 116, 242, (t - ta) / 0.5 * 12, { tam: 40, cor: COR.osso, esp: 4, alpha: ad }); }
  // luz: lanterna no prédio, e a janela acesa como fonte quente
  const alvo = cam.pt([tx, ty, tz]) || [W / 2, H / 2], focos = [{ x: alvo[0], y: alvo[1], r: lerp(1100, 760, prog(t, 6, 3)) }];
  const cw = cam.pt([2, y5 + 1.75, 0]); if (cw && acesa > 0) focos.push({ x: cw[0], y: cw[1], r: clamp(cam.esc([2, y5, 0]) * 6, 160, 1400), i: 0.75 * acesa, cor: [255, 170, 80] });
  return { focos, amb: 0.17, mult: 1 };
}

// ---------- tomada 3: as fichas de aluguel ----------
const FICHAS = [{ ap: '701', and: '7º andar', preco: 'R$ 2.300', v: 2300, y: 560, rot: -0.022, t0: T3 + 0.08 }, { ap: '503', and: '5º andar', preco: 'R$ 1.150', v: 1150, y: 870, rot: 0.014, t0: T3 + 0.24, verm: true }, { ap: '302', and: '3º andar', preco: 'R$ 2.250', v: 2250, y: 1180, rot: -0.01, t0: T3 + 0.4 }];
const FW = 740, FH = 262; FICHAS.forEach((f, i) => f.tex = papelTex(FW, FH, 11 + i));
function tomada3(t) {
  const hh = mao(t, 5), z = 1 + 0.2 * easeInOut(prog(t, 11.6, 2.1)), cy = lerp(H / 2, 870, easeInOut(prog(t, 11.6, 2.1)));
  g.save(); g.translate(W / 2 + hh.x, H / 2 + hh.y); g.rotate(hh.r); g.scale(z, z); g.translate(-W / 2, -cy);
  fundo();
  const tm = P(3, 'metade');
  FICHAS.forEach((f, i) => {
    const a = easeOut(prog(t, f.t0, 0.35)); if (a <= 0) return;
    g.save(); g.translate(540 + (1 - a) * 70, f.y); g.rotate(f.rot); g.translate(-FW / 2, -FH / 2); g.globalAlpha = a;
    g.save(); g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 34; g.shadowOffsetY = 14; g.drawImage(f.tex, 0, 0); g.restore();
    g.fillStyle = '#2a241c'; g.font = '46px Maquina'; g.fillText('AP. ' + f.ap, 40, 72);
    g.fillStyle = '#5c5242'; g.font = '25px MaquinaR'; g.fillText('2 dorm.  ·  ' + f.and, 40, 110);
    g.fillStyle = f.verm ? '#8f1d15' : '#2a241c'; g.font = '60px Serifa'; g.textAlign = 'right'; g.fillText(f.preco, FW - 40, 84); g.textAlign = 'left';
    const len = f.v / 2300 * (FW - 90), tb = f.verm ? T3 + 1.0 : T3 + 0.5 + i * 0.2, db = f.verm ? tm + 0.25 - tb : 0.5;
    cota(g, [40, 182], [40 + len, 182], easeInOut(prog(t, tb, db)), null, { cor: f.verm ? COR.verm : '#2a241c', w: 2.6, alpha: 0.9 });
    g.fillStyle = '#6b604d'; g.font = '22px MaquinaR'; g.fillText('aluguel mensal', 40, 228);
    if (f.verm) { circulo(g, FW - 165, 66, 150, 50, easeInOut(prog(t, tm, 0.55)), { seed: 5 }); g.globalAlpha = clamp((t - P(3, 'preço')) / 0.25) * a; g.fillStyle = COR.verm; g.font = '70px Caneta'; g.fillText('½', 40 + len + 26, 205); }
    g.restore();
  });
  g.restore();
  const fy = lerp(FICHAS[0].y, FICHAS[1].y, easeInOut(prog(t, T3 + 0.4, 1.2)));
  const sy = (fy - cy) * z + H / 2;
  return { focos: [{ x: 560 + 50 * ruido(t * 0.5, 4), y: sy, r: 820 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 4: o apartamento, o corredor, a parede do fundo ----------
const cam4 = trajeto([[T4, 6.5, 17, -7.5, 3.4, 0, 6.5], [15.2, 4.6, 13.5, -3.5, 2.9, 0, 8], [16.8, 2.75, 8.6, 3.0, 2.75, 0, 12.0], [17.9, 2.75, 7.6, 4.6, 2.75, 0.6, ZF - 0.5], [20.0, 2.75, 6.6, 6.2, 2.75, 0.8, ZF], [21.4, 2.75, 6.2, 6.8, 2.75, 0.8, ZF]]);
function tomada4(t) {
  const [px, py, pz, tx, ty, tz] = cam4(t), hh = mao(t, 0.08);
  const cam = camera([px + hh.x, py + hh.y, pz], [tx + hh.x * 0.5, ty + hh.y * 0.5, tz], 40, hh.r);
  fundo();
  const L = (pts, p, o = {}) => cam.linha(pts).forEach(pp => tinta(g, pp, p, { w: 1.6, ...o }));
  const pb = prog(t, T4, 0.6);
  // piso: tábuas no corredor, tacos na sala, arcos das portas, nomes dos cômodos
  for (let x = 2.42; x < 3.2; x += 0.22) L([[x, 0, 5], [x, 0, ZF - 0.07]], pb, { alpha: 0.13, w: 1.2, over: 0 });
  for (let x = 0.5; x < 6; x += 0.5) L([[x, 0, 0.07], [x, 0, 4.93]], pb, { alpha: 0.1, w: 1.1, over: 0 });
  PORTAS.forEach(([x, z, r, a0, s], i) => { const pts = []; for (let k = 0; k <= 16; k++) { const a = a0 + s * k / 16 * Math.PI / 2; pts.push([x + Math.cos(a) * r, 0.01, z + Math.sin(a) * r]); } pts.push([x, 0.01, z]); L(pts, prog(t, T4 + 0.5 + i * 0.1, 0.5), { alpha: 0.45, w: 1.3, dash: [7, 7], over: 0 }); });
  [['SALA', 3, 2.4], ['BANHO', 1.1, 8.5], ['COZINHA', 5.4, 7.2], ['QUARTO', 5.4, 11.8]].forEach(([s, x, z]) => { const q = cam.pt([x, 0, z]); if (q) { const e = clamp(cam.esc([x, 0, z]) * 0.32, 10, 60); datilo(g, s, q[0], q[1], (t - T4 - 0.8) / 0.4 * s.length, { fonte: 'Maquina', tam: e, cor: COR.cinza, alinh: 'center', esp: e * 0.25, alpha: 0.7 }); } });
  // a cota do corredor, medida como na vistoria
  const tc0 = P(4, 'corredor'), tn = P(4, 'nove'), pc = easeInOut(prog(t, tc0, tn + 0.15 - tc0));
  const ca = cam.pt([2.75, 0.02, 5.0]), cb = cam.pt([2.75, 0.02, ZF - 0.07]);
  // paredes: contorno no chão, depois sobem; as mais longe primeiro
  const vis = caixas.map(b => ({ ...b, h: HP * easeOut(prog(t, b.t0, 0.55)), d: cam.prof([(b.x0 + b.x1) / 2, HP / 2, (b.z0 + b.z1) / 2]) })).sort((a, b) => b.d - a.d);
  for (const b of caixas) L([[b.x0, 0, b.z0], [b.x1, 0, b.z0], [b.x1, 0, b.z1], [b.x0, 0, b.z1], [b.x0, 0, b.z0]], prog(t, T4 + 0.05 + b.i * 0.02, 0.4), { w: 1.6, alpha: 0.8, over: 0, seed: b.i });
  // a cota fica no chão, antes das paredes por cima
  if (ca && cb && pc > 0) { const val = (pc * (ZF - 0.07 - 5)).toFixed(2).replace('.', ','); cota(g, ca, cb, pc, null, { cor: CLARO, w: 2.4 }); }
  for (const b of vis) {
    if (b.h < 0.02) continue;
    const c = [[b.x0, 0, b.z0], [b.x1, 0, b.z0], [b.x1, 0, b.z1], [b.x0, 0, b.z1]], tp = c.map(q => [q[0], b.h, q[2]]);
    const faces = [[c[0], c[1], tp[1], tp[0], [0, 0, -1]], [c[1], c[2], tp[2], tp[1], [1, 0, 0]], [c[2], c[3], tp[3], tp[2], [0, 0, 1]], [c[3], c[0], tp[0], tp[3], [-1, 0, 0]]];
    for (const f of faces) {
      const n = f[4], m = [(f[0][0] + f[2][0]) / 2, b.h / 2, (f[0][2] + f[2][2]) / 2]; if ((cam.p[0] - m[0]) * n[0] + (cam.p[2] - m[2]) * n[2] <= 0) continue;
      const pl = cam.poli(f.slice(0, 4)); if (!pl) continue;
      g.beginPath(); pl.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.fillStyle = '#1e1913'; g.fill();
      tinta(g, [...pl, pl[0]], 1, { w: 1.5, alpha: 0.75, over: 0, seed: b.i + 3 });
    }
    const pt = cam.poli(tp); if (pt) { g.beginPath(); pt.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.fillStyle = '#b8ab92'; g.fill(); tinta(g, [...pt, pt[0]], 1, { w: 1.8, over: 4, seed: b.i + 7 }); }
  }
  // número da medida, por cima de tudo
  if (ca && cb && pc > 0) {
    const head = cam.pt([2.75, 0.02, 5 + pc * (ZF - 0.07 - 5)]), val = (pc * 9).toFixed(2).replace('.', ',') + ' m', pulso = 1 + 0.12 * Math.sin(clamp((t - tn - 0.15) / 0.35) * Math.PI);
    if (head) { g.save(); g.globalAlpha = 1 - 0.55 * smooth(S(5), S(5) + 0.6, t); g.translate(head[0] + 34, head[1] - 10); g.scale(pulso, pulso); g.font = '52px Maquina'; g.lineWidth = 8; g.strokeStyle = 'rgba(13,11,9,0.85)'; g.strokeText(val, 0, 0); g.fillStyle = CLARO; g.fillText(val, 0, 0); g.restore(); }
  }
  // parede do fundo: pintura nova (hachura vermelha)
  const zf = ZF - ESP / 2, face = cam.poli([[2.2 + ESP / 2, 0, zf], [3.3 - ESP / 2, 0, zf], [3.3 - ESP / 2, HP, zf], [2.2 + ESP / 2, HP, zf]]);
  const th = S(5) + 0.25, ph = prog(t, th, 0.9);
  if (face && ph > 0) {
    g.save(); g.beginPath(); face.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.clip();
    g.fillStyle = `rgba(179,38,28,${0.16 * ph})`; g.fill();
    const xs = face.map(q => q[0]), ys = face.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), n = Math.ceil((x1 - x0 + y1 - y0) / 16);
    g.beginPath(); for (let i = 0; i < n * ph; i++) { const o = x0 - (y1 - y0) + i * 16; g.moveTo(o, y1); g.lineTo(o + (y1 - y0), y0); } g.strokeStyle = COR.verm; g.globalAlpha = 0.85; g.lineWidth = 2.2; g.stroke(); g.globalAlpha = 1;
    g.restore();
  }
  const tp = P(5, 'pintura');
  if (face && t > tp - 0.1) {
    const m = [(face[0][0] + face[2][0]) / 2, (face[0][1] + face[2][1]) / 2], fx = clamp(m[0] - 520, 70, W - 420), fy = clamp(m[1] - 340, 330, H);
    tinta(g, [m, [fx + 340, fy + 16], [fx - 10, fy + 16]], prog(t, tp - 0.1, 0.4), { w: 2.2, cor: COR.verm, over: 0 });
    datilo(g, 'PINTURA NOVA', fx, fy, (t - tp) / 0.5 * 12, { fonte: 'Maquina', tam: 44, cor: VERM_TXT, esp: 2 });
  }
  // o espaço atrás da parede aparece por um instante (tracejado), e some
  const tg = 20.3, fr = Math.floor((t - tg) * FPS), on = t >= tg && [0, 1, 2, 5, 6, 11, 12, 13, 14].includes(fr);
  if (on) {
    const z0 = ZF + ESP / 2, z1 = ZF + 0.6, x0 = 2.2, x1 = 3.3, A = [[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]], B = A.map(q => [q[0], HP, q[2]]);
    [[...A, A[0]], [...B, B[0]], [A[1], B[1]], [A[2], B[2]], [A[3], B[3]], [A[0], B[0]]].forEach((e, i) => L(e, 1, { cor: COR.verm, w: 2.6, dash: [10, 8], over: 0, seed: 70 + i }));
  }
  // vistoria no canto
  const tv = S(4) + 0.05; if (t > tv) datilo(sb, 'VISTORIA DE ENTRADA  ·  02/08/2021', 84, 242, (t - tv) / 0.8 * 34, { tam: 32, cor: COR.osso, esp: 2 });
  const alvo = face && t > S(5) ? [(face[0][0] + face[2][0]) / 2, (face[0][1] + face[2][1]) / 2] : (ca && cb ? [lerp(ca[0], cb[0], Math.max(pc, 0.3)), lerp(ca[1], cb[1], Math.max(pc, 0.3))] : [W / 2, H / 2]);
  const focos = [{ x: alvo[0], y: alvo[1], r: lerp(1150, 720, prog(t, T4, 4)) }];
  if (on) focos.push({ x: alvo[0], y: alvo[1] - 80, r: 600, i: 0.35, cor: [255, 60, 40] });
  return { focos, amb: 0.17, mult: 1 };
}

// ---------- legendas ----------
const LEG = { 2: ['Em agosto de 2021, a Lúcia alugou o apartamento 503 do Edifício Marajoara.', { '503': CLARO, 'Lúcia': CLARO }],
  3: ['O aluguel era metade do preço dos vizinhos.', { 'metade do preço': VERM_TXT }],
  4: ['Na vistoria de entrada, o corredor media 9 metros.', { '9 metros': CLARO }],
  5: ['Parede do fundo com pintura nova.', { 'pintura nova': VERM_TXT }] };
function legendas(t) {
  for (const [i, [s, d]] of Object.entries(LEG)) {
    const a = S(+i), b = E(+i), prox = +i < TL.length ? S(+i + 1) : b + 1;
    if (t < a - 0.05 || t > prox - 0.02) continue;
    const n = (t - a + 0.12) / (b - a) * s.length * 1.05, al = 1 - smooth(prox - 0.2, prox - 0.02, t);
    legenda(s, n, { destaques: d, alpha: al });
  }
}

window.TOTAL_FRAMES = Math.ceil(FIM * FPS);
window.renderAt = f => {
  const t = f / FPS; limpar();
  const r = t < T2 ? tomada1(t) : t < T3 ? tomada2(t) : t < T4 ? tomada3(t) : tomada4(t);
  const mult = r.mult * pisca(t, T2) * pisca(t, T3) * pisca(t, T4);
  iluminar(r.focos, r.amb, t, mult);
  legendas(t);
  compor(t, { fade: smooth(FIM - 0.6, FIM, t) });
  return 1;
};
window.READY = true;
