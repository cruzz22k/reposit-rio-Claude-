// Caso 004 — "O porão que não estava na escritura", estilo Planta no escuro.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, trajeto, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, camera, mao, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, caminho, arco3, centro, medTxt, rot3, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, blocos, parede, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(18) + 1.4;
const T = i => S(i) - 0.25;                   // cada tomada começa um pouco antes da frase
const LINHAS = ['CASO 004 · RUA ITAPURA, 640', 'PLANTA APROVADA EM 1968'];
const AMBAR = [255, 178, 90];

// ---------- a casa 640 (metros; x ao longo da rua, z para o fundo; a divisa com o 642 fica em x = 12) ----------
const HP = 1.8, LX = 12, LZ = 7;
const PAR = [[0, 0, LX, 0], [0, LZ, LX, LZ], [0, 0, 0, LZ], [LX, 0, LX, LZ], [4.08, 0, 4.08, 2.2], [4.08, 3.0, 4.08, 4.4], [4.08, 5.2, 4.08, LZ], [0, 3.5, 4.08, 3.5],
  [4.08, 4.25, 5.5, 4.25], [6.3, 4.25, 9.0, 4.25], [9.8, 4.25, LX, 4.25], [8.04, 4.25, 8.04, LZ], [8.4, 0, 8.4, 0.5], [8.4, 1.3, 8.4, 4.25], [8.4, 2.0, 9.0, 2.0], [9.8, 2.0, LX, 2.0]];
const BLOCOS = PAR.map((s, i) => parede(s, HP, { i }));
const M = (x0, z0, x1, z1, h, linhas) => BLOCOS.push({ x0, x1, z0, z1, h, tipo: 'movel', linhas });
M(1.2, 0.15, 2.9, 2.2, 0.5, h => [[[1.3, h, 0.35], [2.0, h, 0.35], [2.0, h, 0.7], [1.3, h, 0.7], [1.3, h, 0.35]], [[2.1, h, 0.35], [2.8, h, 0.35], [2.8, h, 0.7], [2.1, h, 0.7], [2.1, h, 0.35]]]);   // cama do casal (quarto 2)
M(0.3, 4.6, 1.3, 6.7, 0.45); M(2.6, 6.2, 3.9, 6.85, 1.5);                      // quarto 1: cama de solteiro, armário
M(5.0, 5.8, 6.4, 6.85, 0.75); M(7.2, 4.5, 7.9, 5.1, 0.45);                      // quarto 3: escritório (mesa, cadeira)
M(9.0, 6.0, 11.8, 6.8, 0.8); M(9.8, 4.8, 11.0, 5.4, 0.4);                       // sala: sofá, mesa de centro
M(5.0, 1.2, 6.4, 2.4, 0.75); M(4.2, 3.5, 6.0, 4.15, 0.9);                       // cozinha: mesa, bancada
M(8.5, 1.4, 11.9, 1.9, 1.6); M(11.4, 0.1, 11.9, 1.3, 1.6);                      // despensa: prateleiras
const GRELHAS = [[0.15, 0.02, 1.8, 'x'], [0.15, 0.02, 5.6, 'x'], [6.0, 0.02, 4.32, 'z']];   // quartos 2, 1 e 3
const PORAO = { x0: 7.44, x1: 11.88, z0: 0.13, z1: 4.06 };
const DUTOS = [[[0.15, -0.3, 1.8], [3.5, -0.6, 1.6], [7.5, -0.9, 1.4]], [[0.15, -0.3, 5.6], [4.0, -0.6, 4.8], [7.5, -0.9, 3.4]], [[6.0, -0.3, 4.32], [6.8, -0.6, 4.0], [7.6, -0.9, 3.8]]];
const COMODOS = [['QUARTO 2', 2.0, 2.8], ['QUARTO 1', 2.0, 5.2], ['QUARTO 3', 6.1, 5.3], ['SALA', 10.0, 5.6], ['COZINHA', 6.2, 3.0], ['DESPENSA', 10.2, 0.6]];

function grelha(cam, [x, y, z, ax], k = 1, cor = COR.osso) {
  const l = [], w = 0.36, d = 0.16;
  if (ax === 'x') { l.push([[x, y, z - w / 2], [x + d, y, z - w / 2], [x + d, y, z + w / 2], [x, y, z + w / 2], [x, y, z - w / 2]]); for (let i = 1; i < 6; i++) l.push([[x, y, z - w / 2 + i * w / 6], [x + d, y, z - w / 2 + i * w / 6]]); }
  else { l.push([[x - w / 2, y, z], [x + w / 2, y, z], [x + w / 2, y, z + d], [x - w / 2, y, z + d], [x - w / 2, y, z]]); for (let i = 1; i < 6; i++) l.push([[x - w / 2 + i * w / 6, y, z], [x - w / 2 + i * w / 6, y, z + d]]); }
  riscos(g, l.flatMap(p => cam.linha(p)), { w: 1.4, cor, alpha: 0.9 * k });
}
// ondas de som saindo de um ponto
function ondas(c, q, t, { r0 = 20, n = 4, cor = COR.verm, alpha = 1, larg = 140 } = {}) {
  if (!q) return; for (let i = 0; i < n; i++) { const f = ((t * 0.9 + i / n) % 1), r = r0 + f * larg; c.save(); c.globalAlpha = alpha * (1 - f) * 0.8; c.strokeStyle = cor; c.lineWidth = 2.4; c.beginPath(); c.arc(q[0], q[1], r, -0.9, 0.9); c.stroke(); c.beginPath(); c.arc(q[0], q[1], r, Math.PI - 0.9, Math.PI + 0.9); c.stroke(); c.restore(); }
}
function casa(cam, t, o = {}) {
  const Rz = (l, op) => riscos(g, l.flatMap(p => cam.linha(p)), op);
  fundo();
  // piso: tacos na sala e quartos, cerâmica na cozinha, ladrilho vermelho novo na despensa
  const tc = []; for (let x = 0.3; x < 4; x += 0.3) tc.push([[x, 0, 0.07], [x, 0, LZ - 0.07]]); for (let x = 4.4; x < LX; x += 0.3) tc.push([[x, 0, 4.32], [x, 0, LZ - 0.07]]);
  Rz(tc, { w: 0.9, alpha: 0.08 });
  const cz = []; for (let x = 4.15; x < 8.4; x += 0.4) cz.push([[x, 0, 0.07], [x, 0, 4.2]]); for (let z = 0.07; z < 4.2; z += 0.4) cz.push([[4.15, 0, z], [8.33, 0, z]]); Rz(cz, { w: 0.9, alpha: 0.13 });
  const ver = cam.poli([[9.2, 0.01, 0.35], [10.3, 0.01, 0.35], [10.3, 0.01, 1.15], [9.2, 0.01, 1.15]]); if (ver) { caminho(g, ver); g.fillStyle = `rgba(150,50,35,${0.55 * (o.vermelho ?? 0.6)})`; g.fill(); }
  const vl = []; for (let x = 9.2; x <= 10.31; x += 0.275) vl.push([[x, 0.012, 0.35], [x, 0.012, 1.15]]); for (let z = 0.35; z <= 1.16; z += 0.2) vl.push([[9.2, 0.012, z], [10.3, 0.012, z]]); Rz(vl, { w: 1.1, cor: '#d9a07a', alpha: 0.7 });
  COMODOS.forEach(([s, x, z]) => rot3(cam, s, [x, 0, z], 0.26, { max: 46, esp: 2 }));
  GRELHAS.forEach((gr, i) => grelha(cam, gr, 1, o.grelhas ? (o.grelhas[i] ? COR.verm : COR.osso) : COR.osso));
  blocos(cam, BLOCOS, o.tSobe ?? 99);
  // o que existe embaixo (só quando a cena pede), por cima de tudo, como raio X: porão e dutos, em tracejado
  if (o.raiox > 0) {
    const { x0, x1, z0, z1 } = PORAO, y0 = -2.5, A = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], B = A.map(q => [q[0], -0.05, q[2]]);
    Rz([[...A, A[0]], [...B, B[0]], [A[0], B[0]], [A[1], B[1]], [A[2], B[2]], [A[3], B[3]]], { w: 2.4, cor: COR.verm, alpha: o.raiox, dash: [10, 8] });
    Rz(DUTOS, { w: 2, cor: COR.verm, alpha: 0.8 * o.raiox, dash: [6, 6] });
    Rz([[[12.45, -0.05, -1.15], [12.45, -2.4, -1.15], [11.6, -2.4, 0.4], [11.6, -2.4, 1.0]]], { w: 2, cor: COR.verm, alpha: 0.8 * o.raiox, dash: [6, 6] });
  }
  // calçada e o vizinho 642
  if (o.rua) {
    Rz([[[-3, 0, -0.1], [26, 0, -0.1]], [[-3, 0, -2.0], [26, 0, -2.0]], [[-3, 0.15, -2.05], [26, 0.15, -2.05]], ...Array.from({ length: 15 }, (_, i) => [[-2 + i * 2, 0, -2], [-2 + i * 2, 0, -0.1]])], { w: 1.1, alpha: 0.4 });
    Rz([[[12.3, 0, 0], [12.3, 1.2, 0], [12.3, 1.2, LZ + 3], [12.3, 0, LZ + 3]]], { w: 1.2, alpha: 0.4 });
    const tp = [[12.15, 0.02, -1.45], [12.75, 0.02, -1.45], [12.75, 0.02, -0.85], [12.15, 0.02, -0.85]]; Rz([[...tp, tp[0]], [tp[0], tp[2]], [tp[1], tp[3]]], { w: 1.6, alpha: 0.85 });
  }
}

// ---------- tomada 1: título ----------
function planta2D(c, ox, oy, esc, p, alpha) { PAR.forEach(([x1, z1, x2, z2], i) => tinta(c, [[ox + x1 * esc, oy - z1 * esc], [ox + x2 * esc, oy - z2 * esc]], prog(p, i / PAR.length * 0.6, 0.4), { w: 2, alpha, seed: i + 1, over: 12 })); }
function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 });
  fundo(); planta2D(g, 540 - 6 * 70, 1300, 70, prog(t, 0.3, 3.0), 0.18); prancha(g, t, { linhas: LINHAS, folha: '04/13' });
  const tag = 'ARQUIVO MORTO  ·  CASO 004'; datilo(g, tag, W / 2, 690, (t - 0.45) / 0.65 * tag.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'O PORÃO QUE NÃO', 885, P(1, 'O porão')); titulo(g, t, 'ESTAVA NA ESCRITURA', 1005, P(1, 'estava'));
  // um retângulo tracejado em vermelho embaixo do título: o que não está no papel
  const pr = prog(t, P(1, 'escritura') - 0.1, 0.6); if (pr > 0) { g.save(); g.setLineDash([12, 10]); tinta(g, [[290, 1070], [790, 1070], [790, 1150], [290, 1150], [290, 1070]], pr, { cor: COR.verm, w: 2.6, over: 0 }); g.restore(); }
  g.restore();
  return { focos: [{ x: 540 + 40 * ruido(t * 0.4, 2), y: 900, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}

// ---------- tomada 2: as duas casas da Rua Itapura ----------
function exterior(cam, t, t0) {
  const Rz = (l, op) => riscos(g, l.flatMap(p => cam.linha(p)), op), L = (pts, p, op = {}) => cam.linha(pts).forEach(pp => tinta(g, pp, p, { w: 2, ...op }));
  fundo();
  Rz([[[-6, 0, -0.1], [30, 0, -0.1]], [[-6, 0, -2.0], [30, 0, -2.0]], [[-6, 0, -6], [30, 0, -6]], ...Array.from({ length: 19 }, (_, i) => [[-4 + i * 2, 0, -2], [-4 + i * 2, 0, -0.1]])], { w: 1.1, alpha: 0.4 * prog(t, t0, 0.6) });
  [[0, LX, 0, 'Nº 640', 1968], [12.6, 23.6, 0.4, 'Nº 642', 1974]].forEach(([x0, x1, s, lab], i) => {
    const p = prog(t, t0 + 0.2 + i * 0.4, 1.0), h = 2.9, zz = LZ, mx = (x0 + x1) / 2;
    L([[x0, 0, 0], [x0, h, 0], [x1, h, 0], [x1, 0, 0]], p, { seed: 10 + i }); L([[x0, h, 0], [x0, h, zz], [x1, h, zz], [x1, h, 0]], p, { seed: 20 + i, w: 1.4 });
    L([[x0, h, 0], [mx, h + 2.0, zz / 2], [x1, h, 0]], prog(t, t0 + 0.8 + i * 0.4, 0.6), { seed: 30 + i, w: 1.6 }); L([[x0, h, zz], [mx, h + 2.0, zz / 2], [x1, h, zz]], prog(t, t0 + 0.9 + i * 0.4, 0.6), { seed: 40 + i, w: 1.2, alpha: 0.6 });
    const jan = [[x0 + 1.2, x0 + 2.8], [x0 + 8.8, x0 + 10.4]], pj = prog(t, t0 + 1.2 + i * 0.3, 0.5);
    Rz([...jan.map(([a, b]) => [[a, 0.9, 0], [b, 0.9, 0], [b, 2.1, 0], [a, 2.1, 0], [a, 0.9, 0]]), [[x0 + 5.2, 0, 0], [x0 + 5.2, 2.2, 0], [x0 + 6.2, 2.2, 0], [x0 + 6.2, 0, 0]], ...Array.from({ length: 12 }, (_, k) => [[x0 + k, 0, -0.1], [x0 + k, 1.1, -0.1]]), [[x0, 1.1, -0.1], [x1, 1.1, -0.1]]], { w: 1.2, alpha: 0.7 * pj });
    const q = cam.pt([mx, -0.6, -1.0]); if (q) medTxt(g, q, lab, { tam: clamp(cam.esc([mx, 0, -1]) * 0.9, 20, 60), alinh: 'center', alpha: pj, cor: i ? COR.cinza : CLARO });
  });
  // goiabeira no quintal do 640
  const pg = prog(t, t0 + 1.6, 0.8), copa = [], r = rng(8); for (let i = 0; i < 7; i++) { const cx = 3 + (r() - 0.5) * 2.6, cy = 4.4 + (r() - 0.3) * 1.6, rr = 0.8 + r() * 0.6; copa.push(Array.from({ length: 20 }, (_, k) => { const a = k / 19 * 6.283; return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.8, LZ + 2]; })); }
  Rz([[[3, 0, LZ + 2], [3.1, 3.6, LZ + 2]], ...copa], { w: 1.1, alpha: 0.5 * pg });
}
const cam2 = trajeto([[T(2), 11.5, 11, -32, 11.5, 2.0, 3], [E(2), 9.0, 8.5, -21, 8.0, 1.6, 3]]);
function tomada2(t) {
  const [px, py, pz, tx, ty, tz] = cam2(t), hh = mao(t, 0.1), cam = camera([px + hh.x, py + hh.y, pz], [tx, ty, tz], 40, hh.r);
  exterior(cam, t, T(2));
  if (t > S(2)) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, '2022  ·  RUA ITAPURA', 116, 242, (t - S(2)) / 0.6 * 20, { tam: 40, cor: COR.osso, esp: 3 }); }
  const q = cam.pt([6, 1.5, 0]) || [W / 2, H / 2];
  return { focos: [{ x: q[0], y: q[1], r: 1000 }], amb: 0.18, mult: 1 };
}

// ---------- tomada 3: a escritura ----------
const ESC = papelTex(820, 1180, 51);
function tomada3(t) {
  const z = 1.1 + 0.12 * easeInOut(prog(t, T(3), T(4) - T(3))); camera2D(t, W / 2, 980, z, { amp: 4 });
  fundo(); papel(g, ESC, 130, 360, { rot: -0.015 });
  g.save(); g.translate(130, 360); g.rotate(-0.015);
  g.fillStyle = TINTA; g.font = '40px Serifa'; g.textAlign = 'center'; g.fillText('ESCRITURA DE COMPRA E VENDA', 410, 90); g.font = '22px Maquina'; g.fillText('2º Tabelionato de Notas · Livro 312 · Fls. 044', 410, 128); g.textAlign = 'left'; g.fillRect(60, 146, 700, 2);
  g.font = '25px MaquinaR'; ['OUTORGANTES: Família Brandão', 'OUTORGADOS: Renata e Diego', 'IMÓVEL: casa térrea, Rua Itapura, 640,', 'construída em 1968, com três quartos.'].forEach((l, i) => g.fillText(l, 60, 210 + i * 46));
  g.font = '30px Maquina'; g.fillText('ÁREA CONSTRUÍDA: 132,00 m²', 60, 440); g.fillText('SUBSOLO: NÃO POSSUI', 60, 500);
  g.font = '22px MaquinaR'; g.fillStyle = '#6b604d'; ['Anexo: declaração do primeiro proprietário (1974),', 'arquivada junto à matrícula.'].forEach((l, i) => g.fillText(l, 60, 590 + i * 34));
  g.fillStyle = TINTA; g.font = '22px MaquinaR'; g.fillText('São Paulo, 14 de março de 2022.', 60, 1040);
  g.restore();
  circulo(g, 130 + 60 + 230, 360 + 440 - 10, 250, 34, easeInOut(prog(t, P(3, 'cento'), 0.5)), { seed: 3 });
  circulo(g, 130 + 60 + 180, 360 + 500 - 10, 200, 36, easeInOut(prog(t, P(3, 'Sem subsolo'), 0.5)), { seed: 6 });
  g.restore();
  if (t > S(3)) datilo(sb, 'ESCRITURA  ·  2022', 84, 242, (t - S(3)) / 0.5 * 18, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 540, y: 900, r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 4: o bolo de fubá e o vizinho ----------
const BIL = papelTex(560, 380, 61, '#f4eedf'), TOALHA = papelTex(W, H, 62, '#3a2c20');
function tomada4(t) {
  const z = 1.05 + 0.1 * easeInOut(prog(t, T(4), T(6) - T(4))); camera2D(t, W / 2, 940, z, { amp: 4 });
  g.drawImage(TOALHA, 0, 0); riscos(g, Array.from({ length: 30 }, (_, i) => [[i * 40, 0], [i * 40, H]]).concat(Array.from({ length: 50 }, (_, i) => [[0, i * 40], [W, i * 40]])), { w: 1, cor: '#5a4030', alpha: 0.4 });
  // prato e bolo (de cima): anel com furo, uma fatia faltando
  const cx = 470, cy = 1080;
  g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30; g.fillStyle = '#e8e1d2'; g.beginPath(); g.ellipse(cx, cy, 330, 300, 0, 0, 6.3); g.fill(); g.restore();
  g.save(); g.fillStyle = '#d9a648'; g.beginPath(); g.ellipse(cx, cy, 250, 228, 0, 0.2, 6.283 - 0.05); g.lineTo(cx, cy); g.closePath(); g.fill();
  g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.ellipse(cx, cy, 70, 62, 0, 0, 6.3); g.fill(); g.restore();
  g.fillStyle = '#e8e1d2'; g.beginPath(); g.ellipse(cx, cy, 70, 62, 0, 0, 6.3); g.fill();
  const r = rng(3); g.fillStyle = '#b5832e'; for (let i = 0; i < 90; i++) { const a = r() * 6, rr = 90 + r() * 150; if (a < 0.4) continue; g.globalAlpha = 0.5; g.beginPath(); g.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.91, 2 + r() * 3, 0, 6.3); g.fill(); } g.globalAlpha = 1;
  riscos(g, [[[cx, cy], [cx + 250 * Math.cos(0.2), cy + 228 * Math.sin(0.2)]], [[cx, cy], [cx + 250 * Math.cos(-0.05), cy + 228 * Math.sin(-0.05)]]], { w: 2, cor: '#7a5420' });
  // o bilhete
  papel(g, BIL, 470, 450, { rot: 0.05 });
  g.save(); g.translate(470 + 280, 450 + 190); g.rotate(0.05); g.fillStyle = TINTA; g.font = '34px SerifaI'; g.textAlign = 'center';
  ['Sejam bem-vindos ao 640.', 'Qualquer barulho, me chamem.', 'Conheço essa casa como ninguém.'].forEach((l, i) => g.fillText(l, 0, -100 + i * 52)); g.font = '32px SerifaI'; g.fillText('— Aurélio, do 642', 60, 100); g.restore();
  const ta = P(4, 'vizinho'); circulo(g, 470 + 280 + 70, 450 + 190 + 92, 160, 32, easeInOut(prog(t, ta, 0.5)), { seed: 5, cor: COR.verm });
  // "já descobriram onde fica tudo?"
  const tq = P(5, 'onde fica tudo');
  if (t > P(5, 'Perguntou') - 0.1) { const s = '"Já descobriram onde fica tudo?"'; datilo(g, s, 540, 345, (t - P(5, 'Perguntou')) / 1.2 * s.length, { fonte: 'Maquina', tam: 40, cor: CLARO, alinh: 'center' }); }
  if (t > tq) { tinta(g, [[540 - 240, 365], [540 + 260, 365]], prog(t, tq, 0.5), { cor: COR.verm, w: 3, over: 0 }); }
  const tv = P(5, 'noventa'); if (t > tv) medTxt(g, [760, 900], 'Seu Aurélio, 90 e poucos', { tam: 30, alinh: 'center', cor: COR.osso, alpha: clamp((t - tv) / 0.4) });
  g.restore();
  if (t > S(4)) datilo(sb, 'PRIMEIRO DIA  ·  O VIZINHO DO 642', 84, 242, (t - S(4)) / 0.7 * 33, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 600, y: t < S(5) ? 760 : 1200, r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 5: as grelhas; a voz ----------
const cam5 = trajeto([[T(6), -6, 15, 3.5, 6, 0, 3.5], [P(6, 'grelha'), -3, 12, 3.2, 4.0, 0, 3.0], [S(7) + 0.6, 5.2, 6.4, 1.6, 1.0, 0, 1.5], [S(9), 5.0, 6.0, 1.7, 1.0, 0, 1.6], [T(10), 5.3, 6.5, 1.8, 1.0, 0, 1.7]]);
function tomada5(t) {
  const [px, py, pz, tx, ty, tz] = cam5(t), hh = mao(t, 0.05), cam = camera([px + hh.x, py + hh.y, pz], [tx, ty, tz], 40, hh.r);
  const tg = P(6, 'grelha');
  casa(cam, t, { grelhas: t > tg ? [1, 1, 1] : null });
  // o casal dormindo (sem rosto)
  const y = 0.53, cob = cam.poli([[1.3, y, 0.85], [2.8, y, 0.85], [2.8, y, 2.1], [1.3, y, 2.1]]); if (cob) { caminho(g, cob); g.fillStyle = '#3a3128'; g.fill(); riscos(g, [[...cob, cob[0]]], { w: 1.3, alpha: 0.7 }); }
  [[1.65, 0.55], [2.45, 0.55]].forEach(([x, z]) => { const q = cam.pt([x, 0.6, z]), e = cam.esc([x, 0.6, z]); if (q) { g.fillStyle = '#16120e'; g.beginPath(); g.ellipse(q[0], q[1], e * 0.13, e * 0.11, 0, 0, 6.3); g.fill(); g.strokeStyle = COR.osso; g.globalAlpha = 0.6; g.lineWidth = 1.2; g.stroke(); g.globalAlpha = 1; } });
  const qg = cam.pt([0.23, 0.05, 1.8]);
  // "Renata..." sai da grelha
  const tn = P(7, 'próprio nome'); if (t > tn - 0.2 && t < S(9)) { ondas(g, qg, t, { alpha: clamp((t - tn + 0.2) / 0.3), larg: 200 }); if (qg) escrita(g, 'Renata...', qg[0] + 40, qg[1] - 120, (t - tn) / 0.8, -0.15, { tam: 54, cor: VERM_TXT }); }
  const tm = P(8, 'marido'); if (t > tm && t < S(9)) { const q = cam.pt([2.45, 0.6, 0.55]); if (q) { tinta(g, [q, [q[0] + 140, q[1] + 220], [q[0] + 380, q[1] + 220]], prog(t, tm, 0.4), { cor: COR.osso, w: 2, over: 0 }); datilo(g, 'DIEGO · DORMINDO', q[0] + 152, q[1] + 204, (t - tm - 0.2) / 0.5 * 16, { fonte: 'Maquina', tam: 30, cor: CLARO }); } }
  // a briga do jantar, palavra por palavra
  const tb = P(9, 'briga'); if (t > tb - 0.2 && qg) { ondas(g, qg, t, { alpha: 0.8, larg: 240 }); ['— você nunca escuta o que eu falo', '— eu escuto. eu escuto tudo.'].forEach((s, i) => datilo(g, s, 90, qg[1] + 150 + i * 56, (t - tb - i * 1.0) / 1.0 * s.length, { fonte: 'Maquina', tam: 32, cor: i ? VERM_TXT : CLARO })); }
  if (t > S(6)) datilo(sb, t < S(7) ? 'UMA GRELHA EM CADA QUARTO' : 'TERCEIRA SEMANA  ·  MADRUGADA', 84, 242, (t - (t < S(7) ? S(6) : S(7))) / 0.6 * 28, { tam: 32, cor: COR.osso, esp: 2 });
  const foco = qg && t > S(7) ? qg : (cam.pt([tx, 0, tz]) || [W / 2, H / 2]);
  return { focos: [{ x: foco[0], y: foco[1], r: 900 }, ...(t > tg && t < S(7) ? GRELHAS.map(gr => { const q = cam.pt(gr.slice(0, 3)); return q ? { x: q[0], y: q[1], r: 260, i: 0.6 } : null; }).filter(Boolean) : [])], amb: 0.15, mult: 1 };
}

// ---------- tomada 6: a despensa — o cachorro e o piso oco (corte) ----------
function tomada6(t) {
  const z = 1.05 + 0.12 * easeInOut(prog(t, T(10), T(12) - T(10))); camera2D(t, W / 2, 1000, z, { amp: 4 });
  fundo();
  const Y = 980, X0 = 120, X1 = 960;
  // corte: chão da cozinha e da despensa, parede, porta
  tinta(g, [[40, Y], [1040, Y]], prog(t, T(10), 0.5), { w: 3, over: 0 });
  g.fillStyle = '#1e1913'; g.fillRect(40, Y, 1000, 60); riscos(g, Array.from({ length: 40 }, (_, i) => [[40 + i * 26, Y + 60], [40 + i * 26 + 30, Y]]), { w: 1, alpha: 0.4 });
  tinta(g, [[640, Y], [640, 520], [1040, 520]], prog(t, T(10) + 0.2, 0.5), { w: 2.6, over: 6 }); riscos(g, [[[640, Y - 420], [700, Y - 420], [700, Y], [640, Y]]], { w: 1.4, alpha: 0.7 }); medTxt(g, [840, 600], 'DESPENSA', { tam: 32, alinh: 'center', cor: COR.cinza });
  medTxt(g, [340, 600], 'COZINHA', { tam: 32, alinh: 'center', cor: COR.cinza });
  // piso vermelho, mais novo
  g.fillStyle = 'rgba(150,50,35,0.7)'; g.fillRect(720, Y - 10, 280, 10); riscos(g, Array.from({ length: 8 }, (_, i) => [[720 + i * 40, Y - 10], [720 + i * 40, Y]]), { w: 1, cor: '#d9a07a' });
  // o cachorro, de perfil, parado na porta, rosnando para o chão
  const dx = 520, dy = Y - 8; g.save(); g.fillStyle = '#0f0c0a'; g.strokeStyle = COR.osso; g.lineWidth = 2;
  g.beginPath(); g.moveTo(dx - 170, dy - 130); g.quadraticCurveTo(dx - 90, dy - 175, dx + 10, dy - 150); g.lineTo(dx + 70, dy - 120); g.quadraticCurveTo(dx + 110, dy - 100, dx + 105, dy - 80); g.lineTo(dx + 60, dy - 78); g.lineTo(dx + 20, dy - 95); g.lineTo(dx - 5, dy - 100); g.lineTo(dx - 10, dy); g.lineTo(dx - 30, dy); g.lineTo(dx - 40, dy - 85); g.lineTo(dx - 130, dy - 85); g.lineTo(dx - 140, dy); g.lineTo(dx - 160, dy); g.lineTo(dx - 175, dy - 100); g.quadraticCurveTo(dx - 220, dy - 140, dx - 240, dy - 190); g.quadraticCurveTo(dx - 200, dy - 140, dx - 170, dy - 130); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(dx + 10, dy - 150); g.lineTo(dx + 20, dy - 185); g.lineTo(dx + 35, dy - 145); g.fill(); g.stroke(); g.restore();
  const tr = P(10, 'rosnando'); if (t > tr - 0.2) { riscos(g, Array.from({ length: 4 }, (_, i) => [[dx + 120 + i * 18, dy - 70 - i * 6], [dx + 135 + i * 18, dy - 50 + i * 4]]), { w: 2.4, cor: COR.verm, alpha: clamp((t - tr + 0.2) / 0.3) * (0.6 + 0.4 * Math.sin(t * 30)) }); }
  // bater no piso: soa oco — e embaixo, um vazio tracejado com uma interrogação
  const to = P(11, 'oco'); if (t > to - 0.4) { const k = clamp((t - to + 0.4) / 0.4); ondas(g, [860, Y - 10], t, { cor: COR.osso, alpha: k, larg: 120 }); }
  if (t > to) { const k = clamp((t - to) / 0.5); g.save(); g.setLineDash([12, 10]); tinta(g, [[700, Y + 70], [1040, Y + 70], [1040, Y + 420], [700, Y + 420], [700, Y + 70]], k, { cor: COR.verm, w: 2.6, over: 0 }); g.restore(); medTxt(g, [870, Y + 290], '?', { tam: 120, alinh: 'center', cor: VERM_TXT, alpha: k }); medTxt(g, [870, Y + 470], 'oco', { tam: 34, alinh: 'center', cor: VERM_TXT, alpha: k }); }
  if (t > P(11, 'mais novo')) medTxt(g, [860, Y - 40], 'piso mais novo', { tam: 26, alinh: 'center', cor: '#d9a07a', alpha: clamp((t - P(11, 'mais novo')) / 0.3) });
  g.restore();
  if (t > S(10)) datilo(sb, 'COZINHA × DESPENSA  ·  CORTE', 84, 242, (t - S(10)) / 0.6 * 28, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: t < S(11) ? 560 : 820, y: 980, r: 820 }], amb: 0.17, mult: 1 };
}

// ---------- tomada 7: a tampa de ferro na calçada ----------
const cam7 = trajeto([[T(12), 6, 9, -12, 11, 0, -0.5], [S(13), 11.0, 4.5, -5.0, 12.45, 0, -1.15], [T(14), 11.6, 3.2, -3.4, 12.45, 0, -1.15]]);
function tomada7(t) {
  const [px, py, pz, tx, ty, tz] = cam7(t), hh = mao(t, 0.05), cam = camera([px + hh.x, py + hh.y, pz], [tx, ty, tz], 40, hh.r);
  exterior(cam, t, -99);
  const Rz = (l, op) => riscos(g, l.flatMap(p => cam.linha(p)), op);
  // a tampa: chumbada na divisa; numa noite, aberta dois dedos
  const ab = clamp((t - P(13, 'aberta')) / 0.8) * 0.05, x0 = 12.15, x1 = 12.75, z0 = -1.45, z1 = -0.85;
  const tp = [[x0, 0.02, z0], [x1, 0.02, z0], [x1, 0.02 + ab * 0.6, z1], [x0, 0.02 + ab * 0.6, z1]];
  const pl = cam.poli(tp); if (pl) { caminho(g, pl); g.fillStyle = '#2b241d'; g.fill(); }
  if (ab > 0) { const fe = cam.poli([[x0, 0.02, z1], [x1, 0.02, z1], [x1, 0.02 + ab * 0.6, z1], [x0, 0.02 + ab * 0.6, z1]]); if (fe) { caminho(g, fe); g.fillStyle = '#000'; g.fill(); } }
  Rz([[...tp, tp[0]], ...Array.from({ length: 5 }, (_, i) => [[x0 + 0.1 * (i + 1), 0.025, z0], [x0 + 0.1 * (i + 1), 0.025 + ab * 0.6, z1]])], { w: 1.6, alpha: 0.9 });
  Rz([[[12.3, 0, -2.2], [12.3, 0, 0], [12.3, 1.2, 0]]], { w: 1.4, cor: COR.cinza, alpha: 0.6, dash: [6, 6] });
  const qd = cam.pt([12.3, 0, -2.3]); if (qd) medTxt(g, [qd[0], qd[1] + 40], 'divisa 640 | 642', { tam: 28, alinh: 'center', cor: COR.cinza });
  const ta = P(13, 'dois dedos'); if (t > ta) { const a = cam.pt([x1 + 0.1, 0.02, z1]), b = cam.pt([x1 + 0.1, 0.02 + ab * 0.6, z1]); if (a && b) { cota(g, [a[0] + 30, a[1]], [b[0] + 30, b[1] - 6], prog(t, ta, 0.4), null, { cor: COR.verm, w: 2.4 }); medTxt(g, [a[0] + 60, a[1] - 10], '≈ 3 cm', { tam: 44, cor: VERM_TXT }); } }
  if (t > S(12)) datilo(sb, 'CALÇADA  ·  TAMPA DE FERRO', 84, 242, (t - S(12)) / 0.6 * 26, { tam: 32, cor: COR.osso, esp: 2 });
  const q = cam.pt([12.45, 0, -1.15]) || [W / 2, H / 2];
  return { focos: [{ x: q[0], y: q[1], r: 820 }, { x: q[0] - 300, y: q[1] - 500, r: 600, i: 0.35, cor: AMBAR }], amb: 0.17, mult: 1 };
}

// ---------- tomada 8: a declaração de 1974 ----------
const DEC = papelTex(860, 980, 71, '#e2d6bd');
function tomada8(t) {
  const k = easeInOut(prog(t, S(15) - 0.2, 1.2)), z = lerp(1.12, 1.3, k), cy = lerp(880, 1180, k); camera2D(t, W / 2, cy, z, { amp: 4 });
  fundo(); papel(g, DEC, 110, 380, { rot: 0.012 });
  g.save(); g.translate(110, 380); g.rotate(0.012);
  g.fillStyle = TINTA; g.font = '36px Serifa'; g.textAlign = 'center'; g.fillText('DECLARAÇÃO', 430, 90); g.font = '20px Maquina'; g.fillText('anexa à matrícula · Rua Itapura, 640 · 1974', 430, 126); g.textAlign = 'left';
  g.font = '27px MaquinaR'; ['Eu, AURÉLIO NUNES, construtor e', 'primeiro proprietário do imóvel,', 'declaro que o porão existente sob', 'a cozinha foi TOTALMENTE ATERRADO', 'e não existe mais, razão pela qual', 'o imóvel é vendido como', '"sem subsolo".'].forEach((l, i) => g.fillText(l, 60, 210 + i * 54));
  g.font = '22px MaquinaR'; g.fillText('São Paulo, 6 de maio de 1974.', 60, 640);
  escrita(g, 'Aurélio Nunes', 420, 800, (t - P(15, 'Aurélio') + 0.3) / 0.9, -0.2, { tam: 64, cor: AZUL_CANETA }); riscos(g, [[[380, 820], [780, 820]]], { w: 1.2, cor: TINTA }); g.font = '20px MaquinaR'; g.fillStyle = TINTA; g.fillText('a) Aurélio Nunes · construtor', 420, 856);
  g.restore();
  circulo(g, 110 + 60 + 300, 380 + 210 + 3 * 54 - 10, 280, 34, easeInOut(prog(t, P(14, 'aterrado'), 0.5)), { seed: 4 });
  const ts = P(15, 'Aurélio'); circulo(g, 110 + 600, 380 + 790, 230, 70, easeInOut(prog(t, ts + 0.5, 0.6)), { seed: 8 });
  if (t > ts + 0.9) { const kk = clamp((t - ts - 0.9) / 0.4); medTxt(g, [600, 380 + 990], '= o vizinho do 642', { tam: 46, alinh: 'center', cor: VERM_TXT, alpha: kk }); }
  g.restore();
  if (t > S(14)) datilo(sb, 'CARTÓRIO  ·  1974', 84, 242, (t - S(14)) / 0.5 * 17, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 560, y: lerp(820, 1200, k), r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 9: "amanhã, então." ----------
const cam9 = trajeto([[T(16), 6.2, 8.5, -2.5, 6.0, 0, 2.2], [S(17), 5.0, 7.5, 1.8, 1.0, 0, 1.6], [P(17, 'amanhã') + 0.4, 15, 13, 2.2, 6.5, -1.0, 2.3], [T(18), 17, 15, 2.4, 6.5, -1.2, 2.3]]);
function tomada9(t) {
  const [px, py, pz, tx, ty, tz] = cam9(t), hh = mao(t, 0.05), cam = camera([px + hh.x, py + hh.y, pz], [tx, ty, tz], 40, hh.r);
  const ta = P(17, 'amanhã'), rx = t > ta + 0.3 ? [0, 1, 0, 0, 1, 1, 0, 1, 1, 1][Math.min(9, Math.floor((t - ta - 0.3) * 12))] : 0;
  const focoRx = rx ? cam.pt([9.6, -1.2, 2.1]) : null;
  casa(cam, t, { raiox: rx, rua: true });
  // na cozinha, os dois combinando baixinho
  if (t < S(17)) [[5.4, 2.8], [6.0, 2.9]].forEach(([x, z]) => { const q = cam.pt([x, 1.0, z]), e = cam.esc([x, 1, z]); if (q) { g.fillStyle = '#16120e'; g.beginPath(); g.arc(q[0], q[1], e * 0.16, 0, 6.3); g.fill(); g.strokeStyle = COR.osso; g.lineWidth = 1.2; g.globalAlpha = 0.7; g.stroke(); g.globalAlpha = 1; } });
  const tb = P(16, 'baixinho'); if (t > tb && t < S(17)) { const q = cam.pt([5.7, 1.2, 2.85]); if (q) datilo(g, '(amanhã a gente quebra o piso)', q[0], q[1] - 90, (t - tb) / 1.2 * 31, { fonte: 'MaquinaR', tam: 28, cor: COR.cinza, alinh: 'center' }); }
  // 3h da manhã: a grelha do quarto responde
  const qg = cam.pt([0.23, 0.05, 1.8]);
  if (t > S(17)) { ondas(g, qg, t, { alpha: 1, larg: 260 }); if (t > ta - 0.2 && qg) escrita(g, 'amanhã, então.', qg[0] + 30, qg[1] - 140, (t - ta + 0.2) / 1.0, -0.15, { tam: 60, cor: VERM_TXT }); }
  if (t > S(17)) datilo(sb, '03:00', 84, 242, (t - S(17)) / 0.3 * 5, { tam: 40, cor: COR.osso, esp: 4 });
  else if (t > S(16)) datilo(sb, 'NA COZINHA  ·  BAIXINHO', 84, 242, (t - S(16)) / 0.6 * 23, { tam: 32, cor: COR.osso, esp: 2 });
  const f = t > S(17) ? (qg || [W / 2, H / 2]) : (cam.pt([5.7, 1, 2.85]) || [W / 2, H / 2]);
  return { focos: [{ x: f[0], y: f[1], r: 820 }, ...(focoRx ? [{ x: focoRx[0], y: focoRx[1], r: 900, i: 0.5, cor: [255, 80, 60] }] : [])], amb: 0.15, mult: 1 };
}

const tomada10 = t => cartaoFinal(t, T(18), N, 4, { linhas: LINHAS });

const LEG = [
  [2, 'Em 2022, a Renata e o Diego compraram uma casa térrea de 1968.', { 'Renata': CLARO, 'Diego': CLARO }],
  [3, 'Na escritura: 132 m². Sem subsolo.', { 'Sem subsolo.': VERM_TXT }],
  [4, 'No primeiro dia, o vizinho do 642 trouxe um bolo de fubá.', { 'vizinho do 642': CLARO }],
  [5, 'Seu Aurélio, 90 e poucos anos. Perguntou se eles já tinham descoberto onde fica tudo.', { 'onde fica tudo': VERM_TXT }],
  [6, 'Cada quarto da casa tem, rente ao chão, uma grelha de ferro.', { 'grelha de ferro': CLARO }],
  [7, 'Na terceira semana, deitada no escuro, a Renata ouviu o próprio nome sair da grelha.', { 'o próprio nome': VERM_TXT }],
  [8, 'Na voz do marido. Que dormia do lado dela.', { 'dormia do lado dela': VERM_TXT }],
  [9, 'Depois, a grelha repetiu uma briga do jantar. Palavra por palavra.', { 'Palavra por palavra.': VERM_TXT }],
  [10, 'O cachorro não entra na despensa. Fica rosnando para o chão.', { 'rosnando para o chão': VERM_TXT }],
  [11, 'O piso da despensa é mais novo que o resto. E soa oco.', { 'soa oco': VERM_TXT }],
  [12, 'Na calçada, colada ao terreno do vizinho, tem uma tampa de ferro chumbada no cimento.', { 'tampa de ferro': CLARO }],
  [13, 'Uma noite, ela estava aberta dois dedos.', { 'aberta dois dedos': VERM_TXT }],
  [14, 'No cartório, uma declaração de 1974 jurava que o porão tinha sido aterrado.', { 'aterrado': VERM_TXT }],
  [15, 'Assinada pelo construtor da casa. Aurélio Nunes.', { 'Aurélio Nunes.': VERM_TXT }],
  [16, 'Os dois combinaram, baixinho, quebrar o piso da despensa no dia seguinte.', { 'baixinho': CLARO }],
  [17, 'Às 3 da manhã, a grelha do quarto respondeu: "amanhã, então."', { '"amanhã, então."': VERM_TXT }],
];

rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(3), tomada3], [T(4), tomada4], [T(6), tomada5], [T(10), tomada6], [T(12), tomada7], [T(14), tomada8], [T(16), tomada9], [T(18), tomada10]], legendasFn: legendas(N, LEG) });
