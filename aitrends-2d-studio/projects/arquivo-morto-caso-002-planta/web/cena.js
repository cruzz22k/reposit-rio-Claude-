// Caso 002 — "O corredor que encolhe", estilo Planta no escuro. Prévia: frases 1 a 5 (0 a 21,3 s).
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, trajeto, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo,
  camera, mao, iluminar, compor, limpar, pisca, legenda, riscos, poeira } from './planta.js';

await fontes();
const TL = await (await fetch('/project/input/timeline-v1.json')).json();
const S = i => TL[i - 1].start, E = i => TL[i - 1].end;
const P = (i, w) => { const f = TL[i - 1], k = f.text.indexOf(w); if (k < 0) throw new Error('palavra não achada: ' + w); return f.start + (f.end - f.start) * k / f.text.length; };
const Q = new URLSearchParams(location.search);
const FIM = Q.get('fim') ? +Q.get('fim') : 21.3;
const T2 = 3.35, T3 = 10.1, T4 = 13.65;                 // trocas de cena (a luz pisca)
const CLARO = '#f6ecd8', VERM_TXT = '#e0402f', TINTA = '#2a241c';
const caminho = (c, pl) => { c.beginPath(); pl.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); };
const arco3 = (cx, y, cz, r, a0, a1, n = 18) => Array.from({ length: n + 1 }, (_, k) => { const a = a0 + (a1 - a0) * k / n; return [cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]; });

// ---------- planta do apartamento (metros; x para a direita, z para o fundo) ----------
const HP = 1.8, ESP = 0.14, ZF = 14;                    // altura do corte das paredes, espessura, parede do fundo do corredor
const PAREDES = [[0, 0, 1.0, 0], [2.6, 0, 4.2, 0], [5.1, 0, 6, 0], [0, 0, 0, 1.5], [0, 3.5, 0, 8], [0, 8.8, 0, 10], [6, 0, 6, 5], [0, 5, 2.2, 5], [3.3, 5, 4.5, 5], [5.5, 5, 7.5, 5],
  [0, 7, 2.2, 7], [0, 10, 2.2, 10], [2.2, 5, 2.2, 8], [2.2, 8.8, 2.2, ZF], [3.3, 5, 3.3, 12.6], [3.3, 13.4, 3.3, ZF], [3.3, 9.5, 7.5, 9.5],
  [7.5, 5, 7.5, 6], [7.5, 7.5, 7.5, 11], [7.5, 12.6, 7.5, ZF], [3.3, ZF, 5, ZF], [6.5, ZF, 7.5, ZF], [2.2, ZF, 3.3, ZF]];
const JANELAS = [[1.0, 0, 2.6, 0], [0, 1.5, 0, 3.5], [0, 8, 0, 8.8], [7.5, 6, 7.5, 7.5], [7.5, 11, 7.5, 12.6], [5, ZF, 6.5, ZF]];
const PORTAS = [[4.2, 0, 0.9, 0, 1], [2.2, 8, 0.8, Math.PI / 2, 1], [3.3, 13.4, 0.8, -Math.PI / 2, 1], [4.5, 5, 1.0, 0, 1]];   // dobradiça x,z, raio, ângulo fechada, sentido
const tSobe = z => 13.95 + 0.75 * z / ZF;
const caixa = (x0, z0, x1, z1, h, extra = {}) => ({ x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1), h, ...extra });
const BLOCOS = [];
PAREDES.forEach(([x1, z1, x2, z2], i) => BLOCOS.push(caixa(Math.min(x1, x2) - ESP / 2, Math.min(z1, z2) - ESP / 2, Math.max(x1, x2) + ESP / 2, Math.max(z1, z2) + ESP / 2, HP, { i, t0: tSobe((z1 + z2) / 2), tipo: 'parede' })));
// janela: peitoril baixo com os dois traços do vidro por cima
JANELAS.forEach(([x1, z1, x2, z2], i) => { const ao = z1 === z2; BLOCOS.push(caixa(Math.min(x1, x2), Math.min(z1, z2) - ESP / 2, Math.max(x1, x2), Math.max(z1, z2) + ESP / 2, 1.0, { i: 40 + i, t0: tSobe((z1 + z2) / 2) + 0.1, tipo: 'janela',
  ...(ao ? {} : { x0: x1 - ESP / 2, x1: x1 + ESP / 2, z0: Math.min(z1, z2), z1: Math.max(z1, z2) }),
  linhas: h => ao ? [[[x1, h, z1 - 0.025], [x2, h, z1 - 0.025]], [[x1, h, z1 + 0.025], [x2, h, z1 + 0.025]]] : [[[x1 - 0.025, h, z1], [x1 - 0.025, h, z2]], [[x1 + 0.025, h, z1], [x1 + 0.025, h, z2]]] })); });
// folhas das portas, abertas
[[4.16, 0.05, 4.2, 0.9], [1.4, 8, 2.2, 8.04], [3.3, 13.36, 4.1, 13.4], [4.5, 5.05, 4.54, 6.0]].forEach(([a, b, c, d], i) => BLOCOS.push(caixa(a, b, c, d, 1.72, { i: 60 + i, t0: 14.75 + i * 0.05, tipo: 'porta' })));
// móveis, no símbolo de planta (caixas baixas com detalhes por cima)
const M = (x0, z0, x1, z1, h, linhas) => BLOCOS.push(caixa(x0, z0, x1, z1, h, { i: 80 + BLOCOS.length, t0: 14.7 + 0.5 * ((z0 + z1) / 2) / ZF, tipo: 'movel', linhas }));
M(0.15, 1.0, 1.0, 3.2, 0.45, h => [[[0.35, h, 1.0], [0.35, h, 3.2]], [[0.35, h, 2.1], [1.0, h, 2.1]]]); M(0.15, 1.0, 0.35, 3.2, 0.85);          // sofá
M(1.7, 1.7, 2.5, 2.6, 0.4); M(5.5, 1.2, 5.9, 3.4, 0.5); M(5.72, 1.6, 5.8, 3.0, 1.1);                                                           // mesa de centro, rack, TV
M(3.4, 3.0, 4.6, 4.2, 0.75); [[3.55, 2.6], [4.05, 2.6], [3.55, 4.25], [4.05, 4.25]].forEach(([x, z]) => M(x, z, x + 0.4, z + 0.35, 0.45)); // mesa de jantar e cadeiras
M(0.15, 7.25, 0.55, 7.95, 0.4, h => [arco3(0.35, h, 7.75, 0.15, 0, Math.PI * 2, 14)]); M(0.1, 8.3, 0.6, 9.0, 0.85, h => [arco3(0.35, h, 8.65, 0.16, 0, Math.PI * 2, 14)]);  // vaso, pia
M(1.2, 9.0, 1.23, 9.9, 1.6);                                                                                                                  // vidro do box
M(6.85, 5.3, 7.43, 8.3, 0.9, h => [...[5.65, 6.15].flatMap(z => [arco3(7.0, h, z, 0.1, 0, 6.3, 10), arco3(7.25, h, z, 0.1, 0, 6.3, 10)]), [[6.95, h, 7.2], [7.35, h, 7.2], [7.35, h, 7.9], [6.95, h, 7.9], [6.95, h, 7.2]]]);   // bancada: fogão e pia
M(6.75, 8.5, 7.43, 9.35, 1.7); M(4.2, 7.2, 5.2, 8.4, 0.75); M(4.45, 6.8, 4.85, 7.15, 0.45); M(4.45, 8.45, 4.85, 8.8, 0.45);                    // geladeira, mesa, cadeiras
M(4.7, 11.7, 6.6, 13.86, 0.5, h => [[[4.85, h, 13.2], [5.55, h, 13.2], [5.55, h, 13.7], [4.85, h, 13.7], [4.85, h, 13.2]], [[5.75, h, 13.2], [6.45, h, 13.2], [6.45, h, 13.7], [5.75, h, 13.7], [5.75, h, 13.2]], [[4.7, h, 12.6], [6.6, h, 12.4]]]);   // cama
M(4.2, 13.4, 4.6, 13.86, 0.55); M(6.7, 13.4, 7.1, 13.86, 0.55); M(3.5, 9.64, 5.9, 10.25, 1.65, h => [[[4.3, h, 9.64], [4.3, h, 10.25]], [[5.1, h, 9.64], [5.1, h, 10.25]]]);  // criados, guarda-roupa
M(6.85, 10.4, 7.43, 11.6, 0.75); M(6.4, 10.8, 6.75, 11.2, 0.45);                                                                                 // escrivaninha e cadeira
const COMODOS = [['SALA', '30,00 m²', 3.2, 0.6], ['BANHO', '6,60 m²', 1.1, 7.9], ['COZINHA', '18,90 m²', 5.4, 6.0], ['QUARTO', '18,90 m²', 5.2, 10.9]];
const COTAS = [[[0, -0.8], [1.0, -0.8], '1,00'], [[1.0, -0.8], [2.6, -0.8], '1,60'], [[2.6, -0.8], [4.2, -0.8], '1,60'], [[4.2, -0.8], [5.1, -0.8], '0,90'], [[5.1, -0.8], [6.0, -0.8], '0,90'],
  [[-0.8, 0], [-0.8, 5], '5,00'], [[-0.8, 5], [-0.8, 10], '5,00'], [[8.3, 5], [8.3, 9.5], '4,50'], [[8.3, 9.5], [8.3, ZF], '4,50'], [[2.2, ZF + 0.8], [3.3, ZF + 0.8], '1,10'], [[3.3, ZF + 0.8], [7.5, ZF + 0.8], '4,20']];

// planta vista de cima, em 2D (fundo do título)
function planta2D(c, ox, oy, esc, p, alpha) {
  const q = (x, z) => [ox + x * esc, oy - z * esc];
  PAREDES.forEach(([x1, z1, x2, z2], i) => tinta(c, [q(x1, z1), q(x2, z2)], prog(p, i / PAREDES.length * 0.5, 0.35), { w: 2, alpha, seed: i + 1, over: 12 }));
  const pm = prog(p, 0.55, 0.45);
  riscos(c, BLOCOS.filter(b => b.tipo === 'movel').map(b => [q(b.x0, b.z0), q(b.x1, b.z0), q(b.x1, b.z1), q(b.x0, b.z1), q(b.x0, b.z0)]), { w: 1.2, alpha: alpha * 0.8 * pm });
  riscos(c, PORTAS.map(([x, z, r, a0, s]) => [...Array.from({ length: 13 }, (_, k) => { const a = a0 + s * k / 12 * Math.PI / 2; return q(x + Math.cos(a) * r, z + Math.sin(a) * r); }), q(x, z)]), { w: 1, alpha: alpha * 0.7 * pm, dash: [5, 5] });
  riscos(c, JANELAS.map(([x1, z1, x2, z2]) => [q(x1, z1), q(x2, z2)]), { w: 4, alpha: alpha * pm });
}

// a prancha de arquiteto em volta do título: moldura, grade, registro, norte, escala e carimbo
function prancha(c, t) {
  const a = 0.44, p0 = prog(t, 0.3, 1.1), ap = a * clamp((t - 0.7) / 0.5);
  tinta(c, [[60, 150], [1020, 150], [1020, 1770], [60, 1770], [60, 150]], p0, { w: 1.1, alpha: a, over: 16, seed: 201 });
  tinta(c, [[82, 172], [998, 172], [998, 1748], [82, 1748], [82, 172]], p0, { w: 2.6, alpha: a, over: 0, seed: 202 });
  c.save(); c.globalAlpha = ap; c.fillStyle = COR.cinza; c.font = '17px Maquina'; c.textAlign = 'center'; c.textBaseline = 'middle';
  const tk = [];
  'ABCDEF'.split('').forEach((L, i) => { const x = 82 + (i + 0.5) * 916 / 6; c.fillText(L, x, 161); c.fillText(L, x, 1759); if (i) { const xx = 82 + i * 916 / 6; tk.push([[xx, 150], [xx, 172]], [[xx, 1748], [xx, 1770]]); } });
  for (let i = 0; i < 8; i++) { const y = 172 + (i + 0.5) * 1576 / 8; c.fillText(String(i + 1), 71, y); c.fillText(String(i + 1), 1009, y); if (i) { const yy = 172 + i * 1576 / 8; tk.push([[60, yy], [82, yy]], [[998, yy], [1020, yy]]); } }
  c.restore(); riscos(c, tk, { w: 1, alpha: ap, cor: COR.cinza });
  const reg = []; for (const [x, y] of [[120, 212], [960, 212], [120, 1708], [960, 1708]]) { reg.push([[x - 18, y], [x + 18, y]], [[x, y - 18], [x, y + 18]], Array.from({ length: 21 }, (_, k) => [x + Math.cos(k / 20 * 6.283) * 10, y + Math.sin(k / 20 * 6.283) * 10])); }
  riscos(c, reg, { w: 1, alpha: ap });
  // norte
  const nx = 175, ny = 1560, pn = prog(t, 1.0, 0.6);
  tinta(c, Array.from({ length: 33 }, (_, k) => [nx + Math.cos(k / 32 * 6.283) * 38, ny + Math.sin(k / 32 * 6.283) * 38]), pn, { w: 1.4, alpha: a + 0.1, over: 0, seed: 203 });
  if (pn >= 1) { c.save(); c.globalAlpha = a + 0.15; c.fillStyle = COR.osso; c.beginPath(); c.moveTo(nx, ny - 34); c.lineTo(nx + 12, ny + 18); c.lineTo(nx, ny + 8); c.closePath(); c.fill(); c.strokeStyle = COR.osso; c.lineWidth = 1.3; c.beginPath(); c.moveTo(nx, ny - 34); c.lineTo(nx - 12, ny + 18); c.lineTo(nx, ny + 8); c.stroke(); c.font = '22px Maquina'; c.textAlign = 'center'; c.fillText('N', nx, ny - 48); c.restore(); }
  // escala gráfica
  const ex = 130, ey = 1675, pe = prog(t, 1.2, 0.5);
  if (pe > 0) { c.save(); c.globalAlpha = (a + 0.05) * pe; for (let i = 0; i < 5; i++) { c.strokeStyle = COR.osso; c.lineWidth = 1.2; c.strokeRect(ex + i * 50, ey, 50, 10); if (i % 2 === 0) { c.fillStyle = COR.osso; c.fillRect(ex + i * 50, ey, 50, 10); } }
    c.fillStyle = COR.cinza; c.font = '16px Maquina'; c.textAlign = 'center'; for (let i = 0; i <= 5; i++) c.fillText(String(i), ex + i * 50, ey + 30); c.textAlign = 'left'; c.fillText('m', ex + 262, ey + 30); c.fillText('ESC. 1:50', ex, ey - 12); c.restore(); }
  // carimbo
  const bx = 560, by = 1540, bw = 438, bh = 208, pc = prog(t, 0.9, 0.7);
  tinta(c, [[bx, by], [bx + bw, by], [bx + bw, by + bh], [bx, by + bh], [bx, by]], pc, { w: 1.6, alpha: a + 0.08, over: 6, seed: 204 });
  riscos(c, [[[bx, by + 62], [bx + bw, by + 62]], [[bx, by + 110], [bx + bw, by + 110]], [[bx, by + 158], [bx + bw, by + 158]], [[bx + 250, by + 110], [bx + 250, by + bh]]], { w: 1, alpha: (a + 0.05) * pc });
  const linhaT = (s, x, y, t0, o) => datilo(c, s, x, y, (t - t0) / 0.5 * s.length, { alpha: a + 0.2, cor: COR.cinza, ...o });
  linhaT('ARQUIVO MORTO', bx + 18, by + 44, 1.3, { fonte: 'Serifa', tam: 30, cor: COR.osso, esp: 2 });
  linhaT('CASO 002  ·  AP. 503  ·  ED. MARAJOARA', bx + 18, by + 94, 1.5, { fonte: 'Maquina', tam: 17 });
  linhaT('PLANTA BAIXA', bx + 18, by + 142, 1.7, { fonte: 'Maquina', tam: 17 }); linhaT('ESC. 1:50', bx + 268, by + 142, 1.8, { fonte: 'Maquina', tam: 17 });
  linhaT('DES.: O ARQUIVISTA', bx + 18, by + 190, 1.9, { fonte: 'Maquina', tam: 17 }); linhaT('PRANCHA 02/13', bx + 268, by + 190, 2.0, { fonte: 'Maquina', tam: 17 });
}

// ---------- tomada 1: título ----------
function tomada1(t) {
  const k = 1 + 0.05 * easeInOut(t / 3.4), hh = mao(t, 5);
  g.save(); g.translate(W / 2 + hh.x, H / 2 + hh.y); g.rotate(hh.r); g.scale(k, k); g.translate(-W / 2, -H / 2);
  fundo(hh.x * 0.5, hh.y * 0.5);
  planta2D(g, 540 - 3.75 * 80, 1440, 80, prog(t, 0.3, 3.0), 0.17);
  prancha(g, t);
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
  return { focos: [{ x: 540 + 40 * ruido(t * 0.4, 2), y: 900 + 30 * ruido(t * 0.4, 3), r: 1000 }], amb: 0.2, mult: liga };
}

// ---------- tomada 2: o prédio, a janela do 503 ----------
const andarY = k => 3.5 + (k - 1) * 3;           // base do andar k (1 a 8); térreo de 0 a 3,5
const COLS = [-6, -2, 2, 6], VARANDA = [0, 3];      // colunas de janelas; as das pontas têm varanda
const cam2 = trajeto([[T2, 0, 13, -52, 0, 14.5, 0], [6.0, 0.4, 14, -44, 0.4, 15.2, 0], [P(2, 'quinhentos'), 1.4, 16, -29, 1.6, 16.6, 0], [9.45, 2, 17.2, -10, 2, 17.25, 0], [T3, 2, 17.25, -6.5, 2, 17.25, 0]]);
const R2 = rng(808), AR = [], CORT = [], ACESAS = [[2, 1, 0.42, 0], [7, 2, 0.32, 0.4], [3, 3, 0.3, 0.8], [6, 0, 0.36, 1.1]], TV = [8, 1];
for (let k = 1; k <= 8; k++) COLS.forEach((c, j) => { if (k === 5 && j === 2) return; const r = R2(); if (r < 0.28) AR.push([k, j]); else if (r < 0.6) CORT.push([k, j, R2() < 0.5 ? -1 : 1]); });
function predio(c, cam, t, x0, x1, alt, alpha, seed, t0) {
  const L = (pts, p, o = {}) => cam.linha(pts).forEach(pp => tinta(c, pp, p, { w: 2, alpha, seed, ...o }));
  L([[x0, 0, 0], [x0, alt, 0], [x1, alt, 0], [x1, 0, 0]], prog(t, t0, 1.2));
  const fr = [], jn = [];
  for (let y = 3.5; y < alt - 1; y += 3) { fr.push([[x0, y, 0], [x1, y, 0]]); for (let x = x0 + 1.4; x < x1 - 1.6; x += 3.2) jn.push([[x, y + 1, 0], [x + 1.8, y + 1, 0], [x + 1.8, y + 2.4, 0], [x, y + 2.4, 0], [x, y + 1, 0]]); }
  const pa = prog(t, t0 + 0.6, 0.8);
  riscos(c, fr.flatMap(s => cam.linha(s)), { w: 1.3, alpha: alpha * 0.7 * pa }); riscos(c, jn.flatMap(s => cam.linha(s)), { w: 1.1, alpha: alpha * 0.6 * pa });
}
function tomada2(t) {
  const [px, py, pz, tx, ty, tz] = cam2(t), hh = mao(t, 0.25);
  const cam = camera([px + hh.x, py + hh.y, pz], [tx + hh.x * 0.6, ty + hh.y * 0.6, tz], 40, hh.r);
  fundo();
  const L = (pts, p, o = {}) => cam.linha(pts).forEach(pp => tinta(g, pp, p, { w: 2.2, ...o }));
  const Rz = (lista, o) => riscos(g, lista.flatMap(pts => cam.linha(pts)), o);
  const fill = (pts, cor) => { const pl = cam.poli(pts); if (pl) { caminho(g, pl); g.fillStyle = cor; g.fill(); } };
  // vizinhos, mais apagados
  predio(g, cam, t, -25, -11.5, 18.5, 0.32, 21, T2 + 0.3); predio(g, cam, t, 11.5, 23, 21.5, 0.32, 22, T2 + 0.5);
  // rua: chão, meio-fio, juntas da calçada
  L([[-40, 0, 0], [40, 0, 0]], prog(t, T2 + 0.05, 0.7), { w: 2.4, over: 0 });
  const pr = prog(t, T2 + 0.4, 0.8);
  Rz([[[-40, 0, -3], [40, 0, -3]], [[-40, 0.15, -3.05], [40, 0.15, -3.05]], ...Array.from({ length: 30 }, (_, i) => [[-29 + i * 2, 0, -3], [-29 + i * 2, 0, -0.1]])], { w: 1.1, alpha: 0.4 * pr });
  // outras janelas acesas (vida no prédio), antes das linhas
  ACESAS.forEach(([k, j, a, d]) => { const y = andarY(k), cx = COLS[j], on = clamp((t - T2 - 1.6 - d) / 0.15); if (on > 0) fill([[cx - 1.1, y + 1, 0], [cx + 1.1, y + 1, 0], [cx + 1.1, y + 2.5, 0], [cx - 1.1, y + 2.5, 0]], `rgba(220,150,70,${a * on})`); });
  { const [k, j] = TV, y = andarY(k), cx = COLS[j], fl = 0.5 + 0.5 * ruido(t * 7, 5); if (t > T2 + 2.2) fill([[cx - 1.1, y + 1, 0], [cx + 1.1, y + 1, 0], [cx + 1.1, y + 2.5, 0], [cx - 1.1, y + 2.5, 0]], `rgba(110,140,230,${0.12 + 0.16 * fl})`); }
  // o Marajoara
  const TOPO = andarY(9);
  L([[-9, 0, 0], [-9, TOPO, 0]], prog(t, T2 + 0.2, 1.0), { seed: 2 }); L([[9, 0, 0], [9, TOPO, 0]], prog(t, T2 + 0.3, 1.0), { seed: 3 });
  L([[-9.3, TOPO, 0], [9.3, TOPO, 0], [9.3, TOPO + 0.8, 0], [-9.3, TOPO + 0.8, 0], [-9.3, TOPO, 0]], prog(t, T2 + 1.2, 0.5), { seed: 4 });
  L([[-3, TOPO + 0.8, 0], [-3, TOPO + 3, 0], [1.5, TOPO + 3, 0], [1.5, TOPO + 0.8, 0]], prog(t, T2 + 1.5, 0.4), { seed: 5, w: 1.8 });
  const pt = prog(t, T2 + 1.8, 0.5);
  Rz([[[-0.8, TOPO + 3, 0], [-0.8, TOPO + 5.2, 0]], [[-1.6, TOPO + 4.6, 0], [0, TOPO + 4.6, 0]], [[-1.3, TOPO + 4, 0], [-0.3, TOPO + 4, 0]], [[0.6, TOPO + 3, 0], [0.6, TOPO + 4.2, 0]], [[-3, TOPO + 2.2, 0], [1.5, TOPO + 2.2, 0]]], { w: 1.2, alpha: 0.7 * pt });
  for (let k = 1; k <= 8; k++) {
    const y = andarY(k), tk = T2 + 0.6 + k * 0.1;
    L([[-9, y, 0], [9, y, 0]], prog(t, tk, 0.5), { seed: 10 + k, w: 1.8 });
    COLS.forEach((cx, j) => {
      const tj = T2 + 1.2 + k * 0.09 + j * 0.05, a = [cx - 1.1, y + 1, 0], b = [cx + 1.1, y + 1, 0], cc = [cx + 1.1, y + 2.5, 0], d = [cx - 1.1, y + 2.5, 0];
      if (VARANDA.includes(j)) { a[1] = y + 0.05; b[1] = y + 0.05; }        // porta de varanda vai até o chão
      L([a, b, cc, d, a], prog(t, tj, 0.45), { seed: 50 + k * 4 + j, w: 1.6 });
      L([[cx, a[1], 0], [cx, y + 2.5, 0]], prog(t, tj + 0.25, 0.3), { seed: 90 + k * 4 + j, w: 1.1, alpha: 0.7 });
    });
    // detalhes do andar: peitoris, vergas, varandas com guarda-corpo, sombra embaixo da laje
    const pd = prog(t, T2 + 1.9 + k * 0.07, 0.5); if (pd <= 0) continue;
    const det = [], fino = [], sombra = [];
    [1, 2].forEach(j => { const cx = COLS[j]; det.push([[cx - 1.3, y + 0.95, -0.12], [cx + 1.3, y + 0.95, -0.12]], [[cx - 1.3, y + 0.95, 0], [cx - 1.3, y + 0.95, -0.12]], [[cx + 1.3, y + 0.95, 0], [cx + 1.3, y + 0.95, -0.12]], [[cx - 1.2, y + 2.65, 0], [cx + 1.2, y + 2.65, 0]]); });
    VARANDA.forEach(j => {
      const cx = COLS[j], x0 = cx - 1.5, x1 = cx + 1.5, zf = -1.2, gy = y + 1.05;
      det.push([[x0, y, 0], [x0, y, zf], [x1, y, zf], [x1, y, 0]], [[x0, y - 0.18, zf], [x1, y - 0.18, zf]], [[x0, y - 0.18, zf], [x0, y, zf]], [[x1, y - 0.18, zf], [x1, y, zf]], [[x0, gy, 0], [x0, gy, zf], [x1, gy, zf], [x1, gy, 0]]);
      for (let x = x0 + 0.15; x < x1; x += 0.15) fino.push([[x, y, zf], [x, gy, zf]]);
      for (let z = zf + 0.2; z < 0; z += 0.2) { fino.push([[x0, y, z], [x0, gy, z]]); fino.push([[x1, y, z], [x1, gy, z]]); }
      for (let x = x0; x < x1 + 0.6; x += 0.22) sombra.push([[x, y - 0.18, 0], [x - 0.55, y - 0.75, 0]]);
    });
    Rz(det, { w: 1.4, alpha: 0.8 * pd }); Rz(fino, { w: 0.9, alpha: 0.5 * pd }); Rz(sombra, { w: 0.8, alpha: 0.22 * pd });
  }
  // ar-condicionado e cortinas
  const pa = prog(t, T2 + 2.4, 0.6);
  if (pa > 0) {
    const ac = [], cort = [];
    AR.forEach(([k, j]) => { const y = andarY(k), x = COLS[j] + (VARANDA.includes(j) ? 0.3 : 0.2), y0 = y + (VARANDA.includes(j) ? 2.7 : 0.25), w = 0.8, h = 0.5, z = -0.4;
      ac.push([[x, y0, z], [x + w, y0, z], [x + w, y0 + h, z], [x, y0 + h, z], [x, y0, z]], [[x, y0 + h, z], [x, y0 + h, 0]], [[x + w, y0 + h, z], [x + w, y0 + h, 0]], [[x + w, y0, z], [x + w, y0, 0]]);
      for (let i = 1; i < 5; i++) ac.push([[x + 0.08, y0 + i * h / 5, z], [x + w - 0.08, y0 + i * h / 5, z]]); });
    CORT.forEach(([k, j, lado]) => { const y = andarY(k), cx = COLS[j], xa = lado < 0 ? cx - 1.05 : cx + 0.05, xb = xa + 0.95, ya = VARANDA.includes(j) ? y + 0.1 : y + 1.05;
      for (let i = 0; i < 5; i++) { const x = lerp(xa, xb, (i + 0.5) / 5); cort.push(Array.from({ length: 7 }, (_, s) => [x + Math.sin(s * 1.3 + i) * 0.05, lerp(y + 2.45, ya, s / 6), 0.05])); } });
    Rz(ac, { w: 1.1, alpha: 0.65 * pa }); Rz(cort, { w: 0.9, alpha: 0.4 * pa });
  }
  // níveis dos andares (à esquerda) e altura total (à direita)
  const pn = prog(t, T2 + 2.0, 0.6);
  if (pn > 0) for (let k = 0; k <= 9; k++) {
    const y = k ? andarY(k) : 0, q = cam.pt([-10.3, y, 0]); if (!q) continue; const s = clamp(cam.esc([-10.3, y, 0]) * 0.42, 9, 34);
    riscos(g, [cam.linha([[-9.4, y, 0], [-11.6, y, 0]]).flat(), [[q[0] - s * 0.4, q[1] - s * 0.55], [q[0] + s * 0.4, q[1] - s * 0.55], [q[0], q[1]], [q[0] - s * 0.4, q[1] - s * 0.55]]], { w: 1.1, alpha: 0.55 * pn });
    g.save(); g.globalAlpha = 0.6 * pn; g.fillStyle = COR.cinza; g.font = `${s}px Maquina`; g.textAlign = 'right'; g.fillText((k ? '+' : '±') + y.toFixed(2).replace('.', ','), q[0] - s * 0.7, q[1] - s * 0.15); g.restore();
  }
  { const a = cam.pt([10.6, 0, 0]), b = cam.pt([10.6, TOPO + 0.8, 0]); if (a && b) cota(g, a, b, prog(t, T2 + 2.3, 0.8), '28,30', { tam: clamp(cam.esc([10.6, 14, 0]) * 0.5, 12, 34), w: 1.4, alpha: 0.6, cor: COR.cinza, lado: 1 }); }
  // térreo: porta, marquise, placa e número
  L([[-1.3, 0, 0], [-1.3, 2.6, 0], [1.3, 2.6, 0], [1.3, 0, 0]], prog(t, T2 + 0.9, 0.5), { seed: 7 });
  L([[-2.4, 2.9, -1.2], [2.4, 2.9, -1.2], [2.4, 2.9, 0], [-2.4, 2.9, 0], [-2.4, 2.9, -1.2]], prog(t, T2 + 1.1, 0.5), { seed: 8, w: 1.6 });
  Rz([[[0, 0, 0], [0, 2.6, 0]], [[-1.2, 1.3, 0], [-0.2, 1.3, 0]], [[0.2, 1.3, 0], [1.2, 1.3, 0]], [[-2.4, 3.15, -1.2], [2.4, 3.15, -1.2]], [[-2.4, 2.9, -1.2], [-2.4, 3.15, -1.2]], [[2.4, 2.9, -1.2], [2.4, 3.15, -1.2]], [[1.8, 1.6, -0.02], [2.4, 1.6, -0.02], [2.4, 2.0, -0.02], [1.8, 2.0, -0.02], [1.8, 1.6, -0.02]]], { w: 1.2, alpha: 0.7 * prog(t, T2 + 1.3, 0.4) });
  { const q = cam.pt([2.1, 1.72, -0.02]); if (q) { const s = clamp(cam.esc([2.1, 1.7, 0]) * 0.28, 7, 30); g.save(); g.globalAlpha = 0.75 * prog(t, T2 + 1.6, 0.3); g.fillStyle = COR.osso; g.font = `${s}px Maquina`; g.textAlign = 'center'; g.fillText('1450', q[0], q[1]); g.restore(); } }
  { const q = cam.pt([0, 2.98, -1.2]); if (q) { const s = clamp(cam.esc([0, 3, -1.2]) * 0.22, 6, 40); g.save(); g.globalAlpha = 0.8 * prog(t, T2 + 1.7, 0.3); g.fillStyle = COR.osso; g.font = `${s}px Maquina`; g.letterSpacing = (s * 0.4) + 'px'; g.textAlign = 'center'; g.fillText('MARAJOARA', q[0], q[1]); g.restore(); } }
  const pn2 = cam.pt([0, -1.9, 0]); if (pn2) { const s = clamp(cam.esc([0, -1.9, 0]) * 0.75, 18, 80); datilo(g, 'EDIFÍCIO MARAJOARA', pn2[0], pn2[1], (t - P(2, 'Edifício')) / 0.7 * 18, { fonte: 'Maquina', tam: s, cor: COR.osso, alinh: 'center', esp: s * 0.3 }); }
  // rua: poste com luminária, fios, árvore e um carro parado
  const pp = prog(t, T2 + 0.6, 0.9), zr = -3.6, POSTE = -12.2;
  L([[POSTE, 0, zr], [POSTE, 6.6, zr], [POSTE + 0.4, 7.0, zr], [POSTE + 1.5, 7.05, zr]], pp, { w: 2, seed: 301 });
  Rz([[[POSTE + 1.2, 6.85, zr], [POSTE + 1.9, 6.85, zr], [POSTE + 1.75, 6.65, zr], [POSTE + 1.35, 6.65, zr], [POSTE + 1.2, 6.85, zr]], [[POSTE - 0.25, 0, zr], [POSTE + 0.25, 0, zr]]], { w: 1.3, alpha: 0.8 * pp });
  const fio = (x0, y0, x1, y1, sag) => Array.from({ length: 25 }, (_, i) => { const k = i / 24; return [lerp(x0, x1, k), lerp(y0, y1, k) - sag * 4 * k * (1 - k), zr]; });
  Rz([fio(-45, 6.0, POSTE, 6.4, 0.9), fio(POSTE, 6.4, 45, 6.6, 1.4), fio(-45, 5.5, POSTE, 5.9, 1.0), fio(POSTE, 5.9, 45, 6.1, 1.6)], { w: 1, alpha: 0.45 * pp });
  const lp = cam.pt([POSTE + 1.55, 6.62, zr]), lamp = clamp((t - T2 - 1.2) / 0.1) * (0.85 + 0.15 * ruido(t * 11, 9));
  if (lp && lamp > 0) { const s = cam.esc([POSTE, 6.6, zr]); g.save(); const gr = g.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], s * 1.4); gr.addColorStop(0, `rgba(255,214,150,${0.9 * lamp})`); gr.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = gr; g.fillRect(lp[0] - s * 1.4, lp[1] - s * 1.4, s * 2.8, s * 2.8); g.restore(); }
  const ARV = 13.5, pa2 = prog(t, T2 + 1.0, 1.0);
  L([[ARV - 0.15, 0, zr], [ARV - 0.1, 2.6, zr], [ARV - 0.6, 3.6, zr]], pa2, { w: 1.8, seed: 302 }); L([[ARV + 0.15, 0, zr], [ARV + 0.12, 2.8, zr], [ARV + 0.7, 3.8, zr]], pa2, { w: 1.8, seed: 303 });
  const copa = []; const rc = rng(5); for (let i = 0; i < 9; i++) { const cx = ARV + (rc() - 0.5) * 3.4, cy = 4.6 + (rc() - 0.3) * 2.2, r = 0.9 + rc() * 0.9; copa.push(Array.from({ length: 22 }, (_, k) => { const a = k / 21 * 6.283; return [cx + Math.cos(a) * r * (1 + 0.12 * ruido(k * 0.9 + i, 4)), cy + Math.sin(a) * r * 0.8, zr]; })); }
  Rz(copa, { w: 1.1, alpha: 0.55 * pa2 });
  const zc = -2.0, CX = -6.8, pc2 = prog(t, T2 + 1.4, 0.7);
  Rz([[[CX, 0.35, zc], [CX, 0.85, zc], [CX + 0.9, 1.0, zc], [CX + 1.6, 1.5, zc], [CX + 3.1, 1.5, zc], [CX + 3.7, 1.0, zc], [CX + 4.3, 0.92, zc], [CX + 4.3, 0.35, zc]], [[CX + 1.75, 1.0, zc], [CX + 1.75, 1.38, zc]], [[CX + 0.95, 1.0, zc], [CX + 3.6, 1.0, zc]], [[CX + 2.5, 1.0, zc], [CX + 2.5, 1.45, zc]],
    arco3(CX + 0.9, 0.35, zc, 0.33, 0, 6.3, 16).map(q => [q[0], q[2] - zc + 0.33, zc]), arco3(CX + 3.5, 0.35, zc, 0.33, 0, 6.3, 16).map(q => [q[0], q[2] - zc + 0.33, zc]), [[CX + 0.2, 0.35, zc], [CX + 0.55, 0.35, zc]], [[CX + 1.25, 0.35, zc], [CX + 3.15, 0.35, zc]], [[CX + 3.85, 0.35, zc], [CX + 4.3, 0.35, zc]]], { w: 1.3, alpha: 0.6 * pc2 });
  // a janela do 503 acende quando a Lúcia aparece
  const y5 = andarY(5), wq = [[0.9, y5 + 1, 0], [3.1, y5 + 1, 0], [3.1, y5 + 2.5, 0], [0.9, y5 + 2.5, 0]];
  const tl = P(2, 'Lúcia'), acesa = t < tl ? 0 : [0.6, 0.1, 0.9, 0.5, 1][Math.min(4, Math.floor((t - tl) / 0.05))];
  const poly = cam.poli(wq);
  if (poly && acesa > 0) {
    g.save(); caminho(g, poly); g.clip();
    const c0 = cam.pt([2, y5 + 1.75, 0]), s = cam.esc([2, y5 + 1.75, 0]);
    const gr = g.createRadialGradient(c0[0], c0[1] + s * 0.3, 0, c0[0], c0[1], s * 1.8); gr.addColorStop(0, `rgba(255,200,120,${acesa})`); gr.addColorStop(1, `rgba(190,110,40,${acesa * 0.85})`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // o fundo do quarto: luminária pendurada e uma estante, vistos pela janela
    riscos(g, [cam.linha([[2.6, y5 + 2.5, 0.05], [2.6, y5 + 2.15, 0.05]]).flat(), ...cam.linha(arco3(2.6, y5 + 2.07, 0.05, 0.09, 0, 6.3, 12).map(q => [q[0], y5 + 2.07 + (q[2] - 0.05), 0.05])), ...cam.linha([[0.95, y5 + 1.6, 0.05], [1.25, y5 + 1.6, 0.05]]), ...cam.linha([[0.95, y5 + 1.9, 0.05], [1.25, y5 + 1.9, 0.05]])], { w: 1.4, cor: '#6b3d17', alpha: 0.8 * acesa });
    // silhueta sem rosto, de costas para a rua
    const sx = cam.pt([1.65, y5 + 1, 0]), cab = cam.pt([1.65, y5 + 1.95, 0]);
    if (sx && cab) { g.fillStyle = `rgba(20,14,10,${acesa})`; g.beginPath(); g.ellipse(cab[0], cab[1], s * 0.17, s * 0.21, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.moveTo(sx[0] - s * 0.42, sx[1] + 2); g.quadraticCurveTo(sx[0] - s * 0.4, cab[1] + s * 0.32, sx[0], cab[1] + s * 0.26); g.quadraticCurveTo(sx[0] + s * 0.4, cab[1] + s * 0.32, sx[0] + s * 0.42, sx[1] + 2); g.fill(); }
    // cortina meio puxada
    riscos(g, [0, 1, 2, 3].map(i => cam.linha(Array.from({ length: 7 }, (_, k) => [2.45 + i * 0.16 + Math.sin(k * 1.4 + i) * 0.04, lerp(y5 + 2.45, y5 + 1.05, k / 6), 0.04])).flat()), { w: 1.3, cor: '#7a4a1c', alpha: 0.7 * acesa });
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
  // luz: lanterna no prédio, a janela acesa e o poste como fontes quentes
  const alvo = cam.pt([tx, ty, tz]) || [W / 2, H / 2], focos = [{ x: alvo[0], y: alvo[1], r: lerp(1100, 760, prog(t, 6, 3)) }];
  const cw = cam.pt([2, y5 + 1.75, 0]); if (cw && acesa > 0) focos.push({ x: cw[0], y: cw[1], r: clamp(cam.esc([2, y5, 0]) * 6, 160, 1400), i: 0.75 * acesa, cor: [255, 170, 80] });
  if (lp && lamp > 0) focos.push({ x: lp[0], y: lp[1] + cam.esc([POSTE, 6, zr]) * 2, r: cam.esc([POSTE, 6, zr]) * 7, i: 0.5 * lamp, cor: [255, 190, 120] });
  return { focos, amb: 0.17, mult: 1 };
}

// ---------- tomada 3: as fichas de aluguel sobre o jornal ----------
const FICHAS = [{ ap: '701', and: '7º andar', preco: 'R$ 2.300', v: 2300, y: 520, rot: -0.022, t0: T3 + 0.08, tel: '98413-2210' }, { ap: '503', and: '5º andar', preco: 'R$ 1.150', v: 1150, y: 830, rot: 0.014, t0: T3 + 0.24, verm: true, tel: '99107-0035' }, { ap: '302', and: '3º andar', preco: 'R$ 2.250', v: 2250, y: 1140, rot: -0.01, t0: T3 + 0.4, tel: '98266-4471' }];
const FW = 740, FH = 262; FICHAS.forEach((f, i) => f.tex = papelTex(FW, FH, 11 + i));
const JORNAL = (() => {
  const c = papelTex(1080, 1600, 31, '#c9bfa8'), x = c.getContext('2d'), r = rng(32);
  x.fillStyle = '#3a3329'; x.font = '84px Serifa'; x.fillText('CLASSIFICADOS', 60, 130); x.fillRect(60, 158, 960, 4); x.fillRect(60, 168, 960, 1.5);
  x.font = '22px MaquinaR'; x.fillText('IMÓVEIS  ·  ALUGUEL', 60, 205); x.textAlign = 'right'; x.fillText('domingo, 1º de agosto de 2021  ·  C4', 1020, 205); x.textAlign = 'left';
  for (let col = 0; col < 4; col++) { const cx = 60 + col * 245; let y = 250;
    while (y < 1540) { if (r() < 0.16) { x.fillStyle = '#3a3329'; x.font = '22px Maquina'; x.fillText(['ALUGA-SE', 'VENDE-SE', 'KITNET', 'OPORTUNIDADE', 'TEMPORADA'][Math.floor(r() * 5)], cx, y + 18); y += 34; }
      let xx = cx; while (xx < cx + 220) { const w = 12 + r() * 46; x.fillStyle = `rgba(58,51,41,${0.25 + r() * 0.2})`; x.fillRect(xx, y, Math.min(w, cx + 225 - xx), 7); xx += w + 7; } y += 17; if (r() < 0.1) y += 16; }
    x.fillStyle = 'rgba(58,51,41,0.5)'; if (col) x.fillRect(cx - 12, 240, 1, 1310); }
  const gr = x.createRadialGradient(820, 1300, 60, 820, 1300, 84); gr.addColorStop(0, 'rgba(110,70,30,0)'); gr.addColorStop(0.85, 'rgba(110,70,30,0.12)'); gr.addColorStop(0.92, 'rgba(110,70,30,0.32)'); gr.addColorStop(1, 'rgba(110,70,30,0)'); x.fillStyle = gr; x.fillRect(700, 1180, 240, 240);
  return c;
})();
function clipe(c, x, y) {   // clipe de metal
  c.save(); c.translate(x, y); c.rotate(0.12); c.strokeStyle = '#9a9890'; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath();
  c.moveTo(8, 70); c.lineTo(8, 10); c.arc(18, 10, 10, Math.PI, 0); c.lineTo(28, 80); c.arc(16, 80, 12, 0, Math.PI); c.lineTo(4, 24); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 1; c.stroke(); c.restore();
}
function tomada3(t) {
  const hh = mao(t, 5), z = 1 + 0.14 * easeInOut(prog(t, 11.6, 2.1)), cy = lerp(H / 2, 830, easeInOut(prog(t, 11.6, 2.1)));
  g.save(); g.translate(W / 2 + hh.x, H / 2 + hh.y); g.rotate(hh.r); g.scale(z, z); g.translate(-W / 2, -cy);
  fundo();
  // o jornal embaixo, de onde as fichas foram recortadas
  g.save(); g.translate(540, 880); g.rotate(0.035); g.globalAlpha = 0.92; g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; g.drawImage(JORNAL, -540, -800); g.restore(); g.restore();
  const tm = P(3, 'metade');
  FICHAS.forEach((f, i) => {
    const a = easeOut(prog(t, f.t0, 0.35)); if (a <= 0) return;
    g.save(); g.translate(540 + (1 - a) * 70, f.y); g.rotate(f.rot); g.translate(-FW / 2, -FH / 2); g.globalAlpha = a;
    g.save(); g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 34; g.shadowOffsetY = 14; g.drawImage(f.tex, 0, 0); g.restore();
    g.fillStyle = 'rgba(80,60,30,0.1)'; g.fillRect(FW * 0.62, 0, 1.5, FH);                        // vinco de dobra
    g.fillStyle = TINTA; g.font = '46px Maquina'; g.fillText('AP. ' + f.ap, 40, 72);
    g.fillStyle = '#5c5242'; g.font = '25px MaquinaR'; g.fillText('2 dorm.  ·  ' + f.and, 40, 110);
    g.fillStyle = f.verm ? '#8f1d15' : TINTA; g.font = '60px Serifa'; g.textAlign = 'right'; g.fillText(f.preco, FW - 40, 84);
    g.fillStyle = '#6b604d'; g.font = '20px MaquinaR'; g.fillText('tratar: (91) ' + f.tel, FW - 40, f.verm ? 146 : 128); g.textAlign = 'left';
    const len = f.v / 2300 * (FW - 90), tb = f.verm ? T3 + 1.0 : T3 + 0.5 + i * 0.2, db = f.verm ? tm + 0.25 - tb : 0.5;
    cota(g, [40, 182], [40 + len, 182], easeInOut(prog(t, tb, db)), null, { cor: f.verm ? COR.verm : TINTA, w: 2.6, alpha: 0.9 });
    g.fillStyle = '#6b604d'; g.font = '22px MaquinaR'; g.fillText('aluguel mensal', 40, 228);
    if (!f.verm) riscos(g, [[[18, 14], [44, 10]], [[18, 18], [44, 14]]], { w: 2.4, cor: '#8e8c86', alpha: 0.9 });   // grampo
    if (f.verm) {
      clipe(g, FW - 70, -30);
      circulo(g, FW - 165, 66, 150, 50, easeInOut(prog(t, tm, 0.55)), { seed: 5 });
      g.globalAlpha = clamp((t - P(3, 'preço')) / 0.25) * a; g.fillStyle = COR.verm; g.font = '70px Caneta'; g.fillText('½', 40 + len + 26, 205);
      // anotação a lápis, escrita na hora
      const tn = P(3, 'vizinhos'), pn = clamp((t - tn) / 0.8); if (pn > 0) { g.save(); g.globalAlpha = 0.8 * a; g.translate(470, 236); g.rotate(-0.05); g.beginPath(); g.rect(-4, -40, 250 * pn + 4, 60); g.clip(); g.fillStyle = '#4a4234'; g.font = '34px Caneta'; g.fillText('por que tão barato?', 0, 0); g.restore(); }
    }
    g.restore();
  });
  g.restore();
  const fy = lerp(FICHAS[0].y, FICHAS[1].y, easeInOut(prog(t, T3 + 0.4, 1.2)));
  const sy = (fy - cy) * z + H / 2;
  return { focos: [{ x: 560 + 50 * ruido(t * 0.5, 4), y: sy, r: 820 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 4: o apartamento, o corredor, a parede do fundo ----------
const cam4 = trajeto([[T4, 6.5, 17, -7.5, 3.4, 0, 6.5], [15.2, 4.6, 13.5, -3.5, 2.9, 0, 8], [16.8, 2.75, 8.6, 3.0, 2.75, 0, 12.0], [17.9, 2.75, 7.6, 4.6, 2.75, 0.6, ZF - 0.5], [20.0, 2.75, 6.6, 6.2, 2.75, 0.8, ZF], [21.4, 2.75, 6.2, 6.8, 2.75, 0.8, ZF]]);
const COR_BLOCO = { parede: ['#1e1913', '#b8ab92', 0.75], janela: ['#1e1913', '#8f846f', 0.7], porta: ['#2a231b', '#9c9079', 0.7], movel: ['#18140f', '#4d4436', 0.6] };
function tomada4(t) {
  const [px, py, pz, tx, ty, tz] = cam4(t), hh = mao(t, 0.08);
  const cam = camera([px + hh.x, py + hh.y, pz], [tx + hh.x * 0.5, ty + hh.y * 0.5, tz], 40, hh.r);
  fundo();
  const L = (pts, p, o = {}) => cam.linha(pts).forEach(pp => tinta(g, pp, p, { w: 1.6, ...o }));
  const Rz = (lista, o) => riscos(g, lista.flatMap(pts => cam.linha(pts)), o);
  const pb = prog(t, T4, 0.6), pd = prog(t, T4 + 0.9, 0.6);
  // piso: tábuas no corredor, tacos na sala, tapete, box, arcos das portas
  Rz(Array.from({ length: 4 }, (_, i) => [[2.42 + i * 0.22, 0, 5], [2.42 + i * 0.22, 0, ZF - 0.07]]), { w: 1.1, alpha: 0.14 * pb });
  const tacos = []; for (let x = 0.1; x < 5.9; x += 0.5) for (let z = 0.1; z < 4.9; z += 0.5) { const v = ((x * 2 + z * 2) | 0) % 2; for (let k = 1; k < 4; k++) tacos.push(v ? [[x + k * 0.125, 0, z], [x + k * 0.125, 0, z + 0.5]] : [[x, 0, z + k * 0.125], [x + 0.5, 0, z + k * 0.125]]); }
  Rz(tacos, { w: 0.8, alpha: 0.08 * pb });
  Rz([[[1.3, 0.01, 0.9], [3.1, 0.01, 0.9], [3.1, 0.01, 3.4], [1.3, 0.01, 3.4], [1.3, 0.01, 0.9]], [[1.45, 0.01, 1.05], [2.95, 0.01, 1.05], [2.95, 0.01, 3.25], [1.45, 0.01, 3.25], [1.45, 0.01, 1.05]]], { w: 1.1, alpha: 0.35 * pd, dash: [4, 5] });
  Rz([[[0.1, 0.01, 9.0], [1.2, 0.01, 9.9]], [[1.2, 0.01, 9.0], [0.1, 0.01, 9.9]]], { w: 1, alpha: 0.35 * pd });
  PORTAS.forEach(([x, z, r, a0, s], i) => { const pts = []; for (let k = 0; k <= 16; k++) { const a = a0 + s * k / 16 * Math.PI / 2; pts.push([x + Math.cos(a) * r, 0.01, z + Math.sin(a) * r]); } L(pts, prog(t, T4 + 0.5 + i * 0.1, 0.5), { alpha: 0.45, w: 1.3, dash: [7, 7], over: 0 }); });
  // luz do corredor (círculo com X no teto) e o único interruptor, ligados pelo fio tracejado
  const lx = 2.75, lz = 9.4, pl = prog(t, T4 + 1.4, 0.6);
  Rz([arco3(lx, 0.01, lz, 0.2, 0, 6.3, 20), [[lx - 0.14, 0.01, lz - 0.14], [lx + 0.14, 0.01, lz + 0.14]], [[lx - 0.14, 0.01, lz + 0.14], [lx + 0.14, 0.01, lz - 0.14]], arco3(3.1, 0.01, 12.9, 0.08, 0, 6.3, 10)], { w: 1.4, alpha: 0.7 * pl });
  Rz([Array.from({ length: 20 }, (_, k) => { const s = k / 19; return [lerp(3.1, lx, s) + 0.32 * Math.sin(s * Math.PI), 0.01, lerp(12.82, lz + 0.2, s)]; })], { w: 1.1, alpha: 0.5 * pl, dash: [5, 6] });
  { const q = cam.pt([3.1, 0.01, 12.9]); if (q && pl > 0) { const s = clamp(cam.esc([3.1, 0, 12.9]) * 0.14, 8, 28); g.save(); g.globalAlpha = 0.75 * pl; g.fillStyle = COR.osso; g.font = `${s}px Maquina`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('S', q[0], q[1]); g.restore(); } }
  // nomes e áreas dos cômodos
  COMODOS.forEach(([s, a, x, z]) => { const q = cam.pt([x, 0, z]), q2 = cam.pt([x, 0, z - 0.45]); if (q) { const e = clamp(cam.esc([x, 0, z]) * 0.3, 10, 56); datilo(g, s, q[0], q[1], (t - T4 - 0.8) / 0.4 * s.length, { fonte: 'Maquina', tam: e, cor: COR.cinza, alinh: 'center', esp: e * 0.25, alpha: 0.7 }); if (q2) datilo(g, a, q2[0], q2[1], (t - T4 - 1.1) / 0.4 * a.length, { fonte: 'MaquinaR', tam: e * 0.62, cor: COR.cinza, alinh: 'center', alpha: 0.6 }); } });
  // cotas por fora da planta e o norte
  COTAS.forEach(([a, b, txt], i) => { const A = cam.pt([a[0], 0, a[1]]), B = cam.pt([b[0], 0, b[1]]); if (A && B) cota(g, A, B, prog(pd, i * 0.05, 0.5), txt, { tam: clamp(cam.esc([(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2]) * 0.26, 9, 30), w: 1.2, alpha: 0.55, cor: COR.cinza, lado: (a[0] < 0 || a[1] < 0) ? 1 : -1 }); });
  Rz([arco3(-1.8, 0.01, 1.2, 0.45, 0, 6.3, 24), [[-1.8, 0.01, 0.8], [-1.8, 0.01, 1.75]], [[-1.95, 0.01, 1.2], [-1.8, 0.01, 1.75], [-1.65, 0.01, 1.2]]], { w: 1.3, alpha: 0.5 * pd });
  { const q = cam.pt([-1.8, 0, 1.95]); if (q && pd > 0) { const s = clamp(cam.esc([-1.8, 0, 1.9]) * 0.3, 9, 30); g.save(); g.globalAlpha = 0.55 * pd; g.fillStyle = COR.osso; g.font = `${s}px Maquina`; g.textAlign = 'center'; g.fillText('N', q[0], q[1]); g.restore(); } }
  // a cota do corredor, medida como na vistoria
  const tc0 = P(4, 'corredor'), tn = P(4, 'nove'), pc = easeInOut(prog(t, tc0, tn + 0.15 - tc0));
  const ca = cam.pt([2.75, 0.02, 5.0]), cb = cam.pt([2.75, 0.02, ZF - 0.07]);
  for (const b of BLOCOS.filter(b => b.tipo === 'parede')) L([[b.x0, 0, b.z0], [b.x1, 0, b.z0], [b.x1, 0, b.z1], [b.x0, 0, b.z1], [b.x0, 0, b.z0]], prog(t, T4 + 0.05 + b.i * 0.015, 0.4), { w: 1.6, alpha: 0.8, over: 0, seed: b.i });
  if (ca && cb && pc > 0) cota(g, ca, cb, pc, null, { cor: CLARO, w: 2.4 });
  // blocos (paredes, peitoris, portas, móveis) sobem do chão; os mais longe primeiro
  const vis = BLOCOS.map(b => ({ ...b, hh: b.h * easeOut(prog(t, b.t0, 0.55)), d: cam.prof([(b.x0 + b.x1) / 2, b.h / 2, (b.z0 + b.z1) / 2]) })).sort((a, b) => b.d - a.d);
  for (const b of vis) {
    if (b.hh < 0.02) continue;
    const [cl, ct, ea] = COR_BLOCO[b.tipo], hb = b.hh;
    const c = [[b.x0, 0, b.z0], [b.x1, 0, b.z0], [b.x1, 0, b.z1], [b.x0, 0, b.z1]], tp = c.map(q => [q[0], hb, q[2]]);
    const faces = [[c[0], c[1], tp[1], tp[0], [0, 0, -1]], [c[1], c[2], tp[2], tp[1], [1, 0, 0]], [c[2], c[3], tp[3], tp[2], [0, 0, 1]], [c[3], c[0], tp[0], tp[3], [-1, 0, 0]]];
    for (const f of faces) {
      const n = f[4], m = [(f[0][0] + f[2][0]) / 2, hb / 2, (f[0][2] + f[2][2]) / 2]; if ((cam.p[0] - m[0]) * n[0] + (cam.p[2] - m[2]) * n[2] <= 0) continue;
      const pl2 = cam.poli(f.slice(0, 4)); if (!pl2) continue;
      caminho(g, pl2); g.fillStyle = cl; g.fill();
      if (b.tipo === 'parede') tinta(g, [...pl2, pl2[0]], 1, { w: 1.5, alpha: ea, over: 0, seed: (b.i || 0) + 3 }); else riscos(g, [[...pl2, pl2[0]]], { w: 1.1, alpha: ea });
    }
    const pt = cam.poli(tp); if (pt) { caminho(g, pt); g.fillStyle = ct; g.fill(); if (b.tipo === 'parede') tinta(g, [...pt, pt[0]], 1, { w: 1.8, over: 4, seed: (b.i || 0) + 7 }); else riscos(g, [[...pt, pt[0]]], { w: 1.2, alpha: 0.85 }); }
    if (b.linhas) Rz(b.linhas(hb + 0.002), { w: b.tipo === 'janela' ? 1.6 : 1.1, alpha: b.tipo === 'janela' ? 0.9 : 0.7, cor: b.tipo === 'janela' ? CLARO : COR.osso });
  }
  // rodapé por dentro do corredor
  Rz([[[2.27, 0.08, 5.1], [2.27, 0.08, 8]], [[2.27, 0.08, 8.8], [2.27, 0.08, ZF - 0.07]], [[3.23, 0.08, 5.1], [3.23, 0.08, 12.6]], [[3.23, 0.08, 13.4], [3.23, 0.08, ZF - 0.07]], [[2.27, 0.08, ZF - 0.07], [3.23, 0.08, ZF - 0.07]]], { w: 1.2, alpha: 0.55 * prog(t, 15.0, 0.5) });
  // número da medida, por cima de tudo
  if (ca && cb && pc > 0) {
    const head = cam.pt([2.75, 0.02, 5 + pc * (ZF - 0.07 - 5)]), val = (pc * 9).toFixed(2).replace('.', ',') + ' m', pulso = 1 + 0.12 * Math.sin(clamp((t - tn - 0.15) / 0.35) * Math.PI);
    if (head) { g.save(); g.globalAlpha = 1 - 0.55 * smooth(S(5), S(5) + 0.6, t); g.translate(head[0] + 34, head[1] - 10); g.scale(pulso, pulso); g.font = '52px Maquina'; g.lineWidth = 8; g.strokeStyle = 'rgba(13,11,9,0.85)'; g.strokeText(val, 0, 0); g.fillStyle = CLARO; g.fillText(val, 0, 0); g.restore(); }
  }
  // parede do fundo: pintura nova (hachura vermelha) com as marcas do rolo
  const zf = ZF - ESP / 2, face = cam.poli([[2.2 + ESP / 2, 0, zf], [3.3 - ESP / 2, 0, zf], [3.3 - ESP / 2, HP, zf], [2.2 + ESP / 2, HP, zf]]);
  const th = S(5) + 0.25, ph = prog(t, th, 0.9);
  if (face && ph > 0) {
    g.save(); caminho(g, face); g.clip();
    g.fillStyle = `rgba(179,38,28,${0.16 * ph})`; g.fill();
    const xs = face.map(q => q[0]), ys = face.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), n = Math.ceil((x1 - x0 + y1 - y0) / 16);
    g.beginPath(); for (let i = 0; i < n * ph; i++) { const o = x0 - (y1 - y0) + i * 16; g.moveTo(o, y1); g.lineTo(o + (y1 - y0), y0); } g.strokeStyle = COR.verm; g.globalAlpha = 0.85; g.lineWidth = 2.2; g.stroke();
    g.globalAlpha = 0.25 * ph; g.fillStyle = '#ffd9c8'; const rr = rng(9); for (let i = 0; i < 5; i++) { const xx = lerp(x0, x1, (i + 0.5) / 5) + (rr() - 0.5) * 10; g.fillRect(xx - 3, y0, 6, (y1 - y0) * (0.6 + 0.4 * rr())); }
    g.restore();
  }
  const tp = P(5, 'pintura');
  if (face && t > tp - 0.1) {
    const m = [(face[0][0] + face[2][0]) / 2, (face[0][1] + face[2][1]) / 2], fx = clamp(m[0] - 520, 70, W - 420), fy = clamp(m[1] - 430, 330, H);
    tinta(g, [m, [fx + 340, fy + 16], [fx - 10, fy + 16]], prog(t, tp - 0.1, 0.4), { w: 2.2, cor: COR.verm, over: 0 });
    datilo(g, 'PINTURA NOVA', fx, fy, (t - tp) / 0.5 * 12, { fonte: 'Maquina', tam: 44, cor: VERM_TXT, esp: 2 });
    datilo(g, 'cor gelo  ·  sem marcas', fx, fy + 52, (t - tp - 0.5) / 0.6 * 23, { fonte: 'MaquinaR', tam: 26, cor: COR.cinza, esp: 1 });
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
  poeira(g, t);
  const mult = r.mult * pisca(t, T2) * pisca(t, T3) * pisca(t, T4);
  iluminar(r.focos, r.amb, t, mult);
  legendas(t);
  compor(t, { fade: smooth(FIM - 0.6, FIM, t) });
  return 1;
};
window.READY = true;
