// Caso 003 — "A janela que dá para dentro", estilo Planta no escuro.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, trajeto, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, camera, mao, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, caminho, arco3, centro, medTxt, rot3, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, blocos, parede, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(18) + 1.4;
const T2 = 3.4, T3 = 11.55, T4 = 24.5, T5 = 35.3, T6 = 46.5, T7 = 61.6, T8 = 68.35, T9 = 72.8, T10 = 80.15;
const LINHAS = ['CASO 003 · RUA DO ROSÁRIO, 31', 'PLANTA DO ANDAR DE CIMA'];
const AMBAR = [255, 178, 90];

// ---------- o sobrado: andar de cima em planta (metros; x ao longo da rua, z para o fundo) ----------
const HP = 1.8, XP = 9, XF = 11.4, ZQ = 4, ZF = 6;          // poço: x 9–11,4, z 0–4
const JAN = [1.5, 4.5, 7.5, 10.2];                             // janelas da fachada (a 4ª é a do "poço")
const PAR = [[0, 0, 0.95, 0], [2.05, 0, 3.95, 0], [5.05, 0, 6.95, 0], [8.05, 0, 9.65, 0], [10.75, 0, XF, 0], [0, ZF, XF, ZF], [0, 0, 0, ZF], [XF, 0, XF, ZF],
  [3, 0, 3, ZQ], [6, 0, 6, ZQ], [XP, 0, XP, 1.4], [XP, 2.6, XP, ZQ], [0, ZQ, 1.0, ZQ], [1.8, ZQ, 4.0, ZQ], [4.8, ZQ, 7.0, ZQ], [7.8, ZQ, XF, ZQ]];
const BLOCOS = PAR.map((s, i) => parede(s, HP, { i }));
JAN.forEach((x, i) => BLOCOS.push({ x0: x - 0.55, x1: x + 0.55, z0: -0.07, z1: 0.07, h: 1.0, tipo: 'janela', i: 30 + i, linhas: h => [[[x - 0.55, h, -0.025], [x + 0.55, h, -0.025]], [[x - 0.55, h, 0.025], [x + 0.55, h, 0.025]]] }));
// a janela de dentro: vidro canelado (traços finos atravessados)
BLOCOS.push({ x0: XP - 0.07, x1: XP + 0.07, z0: 1.4, z1: 2.6, h: 1.0, tipo: 'janela', i: 40, linhas: h => [[[XP - 0.025, h, 1.4], [XP - 0.025, h, 2.6]], [[XP + 0.025, h, 1.4], [XP + 0.025, h, 2.6]], ...Array.from({ length: 9 }, (_, k) => [[XP - 0.06, h, 1.48 + k * 0.13], [XP + 0.06, h, 1.48 + k * 0.13]])] });
// o "poço": volume fechado, sem porta, tampado por cima
BLOCOS.push({ x0: XP + 0.07, x1: XF - 0.07, z0: 0.07, z1: ZQ - 0.07, h: HP - 0.02, tipo: 'escuro', i: 50, linhas: h => { const x0 = XP + 0.15, x1 = XF - 0.15, z0 = 0.15, z1 = ZQ - 0.15, l = []; for (let c = x0 + z0 + 0.3; c < x1 + z1; c += 0.35) { const xa = Math.max(x0, c - z1), xb = Math.min(x1, c - z0); if (xb > xa) l.push([[xa, h, c - xa], [xb, h, c - xb]]); } return l; } });
const M = (x0, z0, x1, z1, h, linhas) => BLOCOS.push({ x0, x1, z0, z1, h, tipo: 'movel', linhas });
M(0.2, 1.2, 1.6, 3.2, 0.5, h => [[[0.3, h, 2.9], [1.5, h, 2.9]]]); M(2.2, 0.3, 2.8, 0.9, 0.55);                                   // quarto da avó: cama, criado
M(3.3, 0.4, 4.7, 1.0, 0.8, h => [[[3.6, h, 0.55], [4.1, h, 0.55], [4.1, h, 0.85]]]); M(3.8, 1.3, 4.2, 1.7, 0.45); M(5.0, 2.6, 5.8, 3.8, 1.6);  // costura: máquina, cadeira, armário
M(6.2, 1.2, 7.2, 3.2, 0.45, h => [[[6.3, h, 2.95], [7.1, h, 2.95]]]); M(8.4, 3.0, 8.85, 3.8, 0.7);                          // hóspedes: cama do menino, mesinha
const DEGRAUS = Array.from({ length: 9 }, (_, k) => [[9.7, 0.02, 4.3 + k * 0.17], [11.2, 0.02, 4.3 + k * 0.17]]);
const COMODOS = [['D. DIRCE', 1.5, 2.2], ['COSTURA', 4.5, 2.2], ['HÓSPEDES', 7.5, 2.2], ['CORREDOR · ESCADA', 5, 5.0]];

function plantaSobrado(cam, t, o = {}) {
  const Rz = (l, op) => riscos(g, l.flatMap(p => cam.linha(p)), op);
  fundo();
  // piso: tábuas largas, degraus da escada, nomes
  const tab = []; for (let x = 0.3; x < XP; x += 0.3) tab.push([[x, 0, 0.07], [x, 0, ZQ - 0.07]]);
  Rz(tab, { w: 0.9, alpha: 0.09 }); Rz(DEGRAUS, { w: 1.1, alpha: 0.45 });
  Rz([[[1.0, 0.01, ZQ], ...arco3(1.0, 0.01, ZQ, 0.8, 0, -Math.PI / 2, 10).slice(1)], [[4.0, 0.01, ZQ], ...arco3(4.0, 0.01, ZQ, 0.8, 0, -Math.PI / 2, 10).slice(1)], [[7.0, 0.01, ZQ], ...arco3(7.0, 0.01, ZQ, 0.8, 0, -Math.PI / 2, 10).slice(1)]], { w: 1.1, alpha: 0.4, dash: [6, 6] });
  COMODOS.forEach(([s, x, z]) => rot3(cam, s, [x, 0, z], 0.26, { max: 46, esp: 2 }));
  blocos(cam, BLOCOS, o.tSobe ?? 99);
  rot3(cam, 'POÇO DE LUZ', [10.2, HP + 0.05, 2.0], 0.24, { max: 40, cor: COR.osso, alpha: 0.75 * (o.rotPoco ?? 1) });
}

// ---------- tomada 1: título ----------
function planta2D(c, ox, oy, esc, p, alpha) { PAR.forEach(([x1, z1, x2, z2], i) => tinta(c, [[ox - x1 * esc, oy - z1 * esc], [ox - x2 * esc, oy - z2 * esc]], prog(p, i / PAR.length * 0.6, 0.4), { w: 2, alpha, seed: i + 1, over: 12 })); }
function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 });
  fundo(); planta2D(g, 540 + 5.7 * 80, 1330, 80, prog(t, 0.3, 3.0), 0.18); prancha(g, t, { linhas: LINHAS, folha: '03/13' });
  const tag = 'ARQUIVO MORTO  ·  CASO 003'; datilo(g, tag, W / 2, 690, (t - 0.45) / 0.65 * tag.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'A JANELA QUE', 885, P(1, 'A janela')); titulo(g, t, 'DÁ PARA DENTRO', 1005, P(1, 'dá'));
  // uma janela pequena desenhada em vermelho, que se vira para dentro
  const pj = prog(t, P(1, 'dentro') - 0.1, 0.5), k = Math.cos(easeInOut(prog(t, 2.4, 0.6)) * Math.PI);
  if (pj > 0) { g.save(); g.translate(540, 1110); g.scale(k, 1); tinta(g, [[-40, -30], [40, -30], [40, 30], [-40, 30], [-40, -30]], pj, { cor: COR.verm, w: 3, over: 6 }); riscos(g, [[[0, -30], [0, 30]], ...Array.from({ length: 5 }, (_, i) => [[-34 + i * 17, -24], [-34 + i * 17, 24]])], { cor: COR.verm, w: 1.2, alpha: 0.8 * pj }); g.restore(); }
  g.restore();
  return { focos: [{ x: 540 + 40 * ruido(t * 0.4, 2), y: 900, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}

// ---------- fachada do sobrado (3D, em linhas) ----------
const PEDRAS = (() => { const r = rng(5), l = []; for (let z = -0.3; z > -7; z -= 0.45 + r() * 0.15) { let x = -12; const fila = []; while (x < 24) { const w = 0.45 + r() * 0.35; fila.push([[x, 0, z], [x, 0, z - 0.42]]); x += w; } l.push([[-12, 0, z], [24, 0, z]], ...fila); } return l; })();
const TELHA = (() => { const l = []; for (let k = 0; k < 9; k++) { const z = k * 0.33, y = 6.8 + k * 0.17; l.push(Array.from({ length: 58 }, (_, i) => [-0.2 + i * 0.2, y + 0.05 * Math.abs(Math.sin(i * Math.PI / 2)), z])); } return l; })();
function fachada(cam, t, o = {}) {
  const t0 = o.t0 ?? -99, L = (pts, p, op = {}) => cam.linha(pts).forEach(pp => tinta(g, pp, p, { w: 2.1, ...op })), Rz = (l, op) => riscos(g, l.flatMap(p => cam.linha(p)), op);
  fundo();
  Rz(PEDRAS, { w: 0.9, alpha: 0.28 * prog(t, t0 + 0.2, 0.8) });
  L([[-14, 0, 0], [26, 0, 0]], prog(t, t0, 0.6), { over: 0 });
  // vizinhos colados
  const pv = prog(t, t0 + 0.3, 1.0);
  Rz([[[-8, 0, 0], [-8, 7.4, 0], [0, 7.4, 0]], [[11.4, 6.2, 0], [19, 6.2, 0], [19, 0, 0]], ...[[-6.6, -5.3], [-3.6, -2.3]].flatMap(([a, b]) => [[[a, 4.2, 0], [b, 4.2, 0], [b, 5.8, 0], [a, 5.8, 0], [a, 4.2, 0]], [[a, 0.9, 0], [b, 0.9, 0], [b, 2.4, 0], [a, 2.4, 0], [a, 0.9, 0]]]), ...[[13, 14.2], [16, 17.2]].flatMap(([a, b]) => [[[a, 3.9, 0], [b, 3.9, 0], [b, 5.3, 0], [a, 5.3, 0], [a, 3.9, 0]], [[a, 0.8, 0], [b, 0.8, 0], [b, 2.2, 0], [a, 2.2, 0], [a, 0.8, 0]]])], { w: 1.2, alpha: 0.35 * pv });
  // corpo do sobrado
  L([[0, 0, 0], [0, 6.8, 0]], prog(t, t0 + 0.2, 0.8), { seed: 2 }); L([[XF, 0, 0], [XF, 6.8, 0]], prog(t, t0 + 0.3, 0.8), { seed: 3 });
  L([[-0.15, 6.4, -0.12], [XF + 0.15, 6.4, -0.12], [XF + 0.15, 6.8, -0.12], [-0.15, 6.8, -0.12], [-0.15, 6.4, -0.12]], prog(t, t0 + 0.8, 0.5), { seed: 4 });
  L([[-0.1, 3.4, -0.08], [XF + 0.1, 3.4, -0.08]], prog(t, t0 + 0.7, 0.5), { seed: 5, w: 1.6 }); L([[-0.1, 3.6, -0.08], [XF + 0.1, 3.6, -0.08]], prog(t, t0 + 0.75, 0.5), { seed: 6, w: 1.2 });
  Rz([[[0.25, 0, 0], [0.25, 6.4, 0]], [[XF - 0.25, 0, 0], [XF - 0.25, 6.4, 0]]], { w: 1.1, alpha: 0.6 * prog(t, t0 + 0.6, 0.4) });
  Rz(TELHA, { w: 1.0, alpha: 0.45 * prog(t, t0 + 1.0, 0.6) });
  // térreo: porta em arco, três janelas, número
  const pt = prog(t, t0 + 0.9, 0.6);
  L([[1.0, 0, 0], [1.0, 2.5, 0], ...Array.from({ length: 13 }, (_, k) => { const an = Math.PI - k / 12 * Math.PI; return [1.7 + Math.cos(an) * 0.7, 2.5 + Math.sin(an) * 0.7, 0]; }), [2.4, 2.5, 0], [2.4, 0, 0]], pt, { seed: 7 });
  Rz([[[1.7, 0, 0], [1.7, 2.5, 0]]], { w: 1, alpha: 0.6 * pt });
  [4.6, 7.6, 10.4].forEach((x, i) => L([[x - 0.6, 0.9, 0], [x + 0.6, 0.9, 0], [x + 0.6, 2.5, 0], [x - 0.6, 2.5, 0], [x - 0.6, 0.9, 0]], prog(t, t0 + 1.0 + i * 0.1, 0.4), { seed: 10 + i, w: 1.7 }));
  // andar de cima: quatro janelas; a 4ª sempre fechada (venezianas)
  JAN.forEach((x, i) => {
    const pj = prog(t, t0 + 1.2 + i * 0.12, 0.45), a = [x - 0.55, 4.1, 0], b = [x + 0.55, 4.1, 0], c = [x + 0.55, 5.9, 0], d = [x - 0.55, 5.9, 0];
    if (o.acesas && o.acesas[i] > 0) { const pl = cam.poli([a, b, c, d]); if (pl) { caminho(g, pl); g.fillStyle = `rgba(220,150,70,${o.acesas[i]})`; g.fill(); } }
    L([a, b, c, d, a], pj, { seed: 20 + i, w: 1.8 });
    if (i < 3) { Rz([[[x, 4.1, 0], [x, 5.9, 0]], [[x - 0.7, 4.0, -0.35], [x + 0.7, 4.0, -0.35], [x + 0.7, 4.9, -0.35], [x - 0.7, 4.9, -0.35], [x - 0.7, 4.0, -0.35]], ...Array.from({ length: 13 }, (_, k) => [[x - 0.6 + k * 0.1, 4.0, -0.35], [x - 0.6 + k * 0.1, 4.9, -0.35]]), [[x - 0.7, 4.0, -0.35], [x - 0.7, 4.0, 0]], [[x + 0.7, 4.0, -0.35], [x + 0.7, 4.0, 0]]], { w: 1, alpha: 0.6 * pj }); }
    else Rz(Array.from({ length: 12 }, (_, k) => [[x - 0.5, 4.2 + k * 0.14, -0.02], [x + 0.5, 4.2 + k * 0.14, -0.02]]), { w: 1.1, alpha: 0.75 * pj });
    if (o.numeros) { const q = cam.pt([x, 6.15, 0]); const k = prog(t, o.numeros + i * 0.25, 0.25); if (q && k > 0) medTxt(g, [q[0], q[1]], String(i + 1), { tam: 64 * easeOut(k) + 1, alinh: 'center', cor: i === 3 ? VERM_TXT : CLARO }); }
  });
  { const q = cam.pt([2.75, 1.6, -0.02]), e = cam.esc([2.75, 1.6, 0]); if (q && pt > 0) { g.save(); g.globalAlpha = 0.8 * pt; g.strokeStyle = COR.osso; g.lineWidth = 1.2; g.strokeRect(q[0] - e * 0.18, q[1] - e * 0.14, e * 0.36, e * 0.28); g.fillStyle = COR.osso; g.font = `${Math.max(6, e * 0.2)}px Serifa`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('31', q[0], q[1] + 1); g.restore(); } }
}
// ---------- tomada 2: o sobrado da avó ----------
const cam2 = trajeto([[T2, 5.7, 4.6, -38, 5.7, 4.4, 0], [7.5, 6.0, 4.8, -28, 6.0, 4.6, 0], [T3, 7.3, 5.0, -13, 7.4, 5.0, 0]]);
function tomada2(t) {
  const [px, py, pz, tx, ty, tz] = cam2(t), hh = mao(t, 0.12), cam = camera([px + hh.x, py + hh.y, pz], [tx + hh.x * 0.5, ty + hh.y * 0.5, tz], 40, hh.r);
  fachada(cam, t, { t0: T2, acesas: [0, 0, 0.3 * clamp((t - P(2, 'menino')) / 0.3), 0] });
  const ps = cam.pt([5.7, -1.4, 0]); if (ps) datilo(g, 'SOBRADO  ·  1920', ps[0], ps[1], (t - P(2, 'sobrado')) / 0.6 * 16, { fonte: 'Maquina', tam: clamp(cam.esc([5.7, 0, 0]) * 0.5, 18, 60), cor: COR.osso, alinh: 'center', esp: 6 });
  if (t > S(2)) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, 'JULHO  ·  1994 – 2003', 116, 242, (t - S(2)) / 0.7 * 21, { tam: 40, cor: COR.osso, esp: 3 }); }
  const qa = cam.pt([tx, ty, tz]) || [W / 2, H / 2], focos = [{ x: qa[0], y: qa[1], r: 1050 }];
  const qw = cam.pt([7.5, 5.0, 0]); if (qw && t > P(2, 'menino')) focos.push({ x: qw[0], y: qw[1], r: cam.esc([7.5, 5, 0]) * 3, i: 0.5, cor: AMBAR });
  return { focos, amb: 0.17, mult: 1 };
}

// ---------- tomada 3: o andar de cima; duas janelas; o "poço" ----------
const cam3 = trajeto([[T3, -7.0, 17, 3.0, 5.4, 0, 3.0], [S(3) + 2.5, 2.6, 9.0, 2.4, 7.6, 0, 2.3], [S(4) + 1.2, 4.6, 6.8, 2.1, 9.0, 0.4, 2.0], [S(5) + 0.6, 5.2, 8.0, 2.2, 10.1, 0.4, 2.0], [T4, 5.8, 8.8, 2.3, 10.3, 0.4, 2.0]]);
function tomada3(t) {
  const [px, py, pz, tx, ty, tz] = cam3(t), hh = mao(t, 0.06), cam = camera([px + hh.x, py + hh.y, pz], [tx, ty, tz], 40, hh.r);
  plantaSobrado(cam, t, { rotPoco: clamp((t - P(5, 'poço')) / 0.3) });
  const Rz = (l, op) => riscos(g, l.flatMap(p => cam.linha(p)), op);
  // janela da rua do quarto de hóspedes
  const tr = P(3, 'rua'); if (t > tr - 0.2) { const k = clamp((t - tr + 0.2) / 0.3); Rz([[[6.95, 1.02, -0.09], [8.05, 1.02, -0.09]]], { w: 6, cor: CLARO, alpha: 0.6 * k }); const q = cam.pt([7.5, 1.0, -0.3]); if (q) { tinta(g, [q, [q[0], q[1] + 120]], k, { cor: COR.osso, w: 1.6, over: 0 }); medTxt(g, [q[0], q[1] + 160], 'RUA', { tam: 40, alinh: 'center', alpha: k }); } }
  // a janela que dá para dentro: vidro canelado
  const td = P(4, 'dentro'); if (t > td - 0.2) { const k = clamp((t - td + 0.2) / 0.3); Rz([[[XP, 1.02, 1.4], [XP, 1.02, 2.6]]], { w: 7, cor: COR.ambar, alpha: 0.65 * k }); const q = cam.pt([XP, 1.0, 2.0]); if (q) { const lx = clamp(q[0] + 150, 80, W - 420); tinta(g, [q, [lx - 10, q[1] - 200], [lx + 340, q[1] - 200]], prog(t, td, 0.4), { cor: COR.ambar, w: 2, over: 0 }); datilo(g, 'VIDRO CANELADO', lx, q[1] - 216, (t - P(4, 'Vidro')) / 0.5 * 14, { fonte: 'Maquina', tam: 36, cor: COR.ambar, esp: 1 }); } }
  // poço de luz? fechado há anos
  const tf = P(5, 'fechado'); if (t > tf) { const q = cam.pt([10.2, HP, 2.0]); if (q) carimbo(g, q[0], q[1] + 70, clamp((t - tf) / 0.12), 'VEDADO', { larg: 300, rot: -0.1 }); }
  if (t > S(5)) datilo(sb, 'ANDAR DE CIMA  ·  1962', 84, 242, (t - S(5)) / 0.6 * 21, { tam: 32, cor: COR.osso, esp: 2 });
  const qa = cam.pt([tx, 0.5, tz]) || [W / 2, H / 2];
  return { focos: [{ x: qa[0], y: qa[1], r: 950 }], amb: 0.17, mult: 1 };
}

// ---------- o vidro canelado, visto do quarto (tomadas 4 e 6) ----------
const VX = 210, VY = 330, VW = 660, VH = 1000;
const trasC = document.createElement('canvas'); trasC.width = VW; trasC.height = VH; const tg = trasC.getContext('2d');
const vapC = document.createElement('canvas'); vapC.width = VW; vapC.height = VH; const vg = vapC.getContext('2d');
const PAREDE = papelTex(W, H, 21, '#2a231c');
function vidro(t, o) {
  const { luz = 0, sombra = 0, manha = 0, escreve = null, espelhado = null } = o;
  g.drawImage(PAREDE, 0, 0);
  // o que está do outro lado do vidro
  tg.setTransform(1, 0, 0, 1, 0, 0); tg.globalAlpha = 1; tg.fillStyle = manha ? '#5d6a72' : '#0d0b09'; tg.fillRect(0, 0, VW, VH);
  if (luz > 0) { const fl = 0.8 + 0.2 * ruido(t * 9, 3), gr = tg.createRadialGradient(VW * 0.32, VH * 0.62, 10, VW * 0.32, VH * 0.62, VH * 0.75); gr.addColorStop(0, `rgba(255,190,100,${luz * fl})`); gr.addColorStop(0.4, `rgba(200,120,50,${luz * 0.6 * fl})`); gr.addColorStop(1, 'rgba(60,30,10,0)'); tg.fillStyle = gr; tg.fillRect(0, 0, VW, VH); }
  if (sombra > 0) { tg.fillStyle = `rgba(14,10,8,${0.9 * sombra})`; tg.beginPath(); tg.ellipse(VW * 0.55, VH * 0.42, 62, 76, 0, 0, 6.3); tg.fill(); tg.beginPath(); tg.moveTo(VW * 0.55 - 170, VH * 0.86); tg.quadraticCurveTo(VW * 0.55 - 160, VH * 0.52, VW * 0.55, VH * 0.5); tg.quadraticCurveTo(VW * 0.55 + 160, VH * 0.52, VW * 0.55 + 170, VH * 0.86); tg.fill(); tg.fillRect(VW * 0.55 - 190, VH * 0.6, 26, VH * 0.4); }
  // as caneluras: cada faixa amplia o meio de uma fatia do que está atrás
  const fw = 22;
  g.save(); g.beginPath(); g.rect(VX, VY, VW, VH); g.clip();
  for (let x = 0; x < VW; x += fw) g.drawImage(trasC, x + fw * 0.3, 0, fw * 0.4, VH, VX + x, VY, fw, VH);
  const fr = []; for (let x = 0; x < VW; x += fw) fr.push([[VX + x, VY], [VX + x, VY + VH]]);
  riscos(g, fr, { w: 2, cor: '#000', alpha: 0.35 }); riscos(g, fr.map(s => s.map(q => [q[0] + 5, q[1]])), { w: 1.2, cor: '#fff', alpha: 0.08 + 0.12 * luz });
  // vapor de bafo e letras escritas com o dedo
  if (escreve || espelhado) {
    vg.setTransform(1, 0, 0, 1, 0, 0); vg.globalCompositeOperation = 'source-over'; vg.clearRect(0, 0, VW, VH);
    const e = escreve || espelhado, gr = vg.createRadialGradient(VW / 2, VH * 0.5, 30, VW / 2, VH * 0.5, VW * 0.62); gr.addColorStop(0, `rgba(225,228,226,${0.62 * e.vapor})`); gr.addColorStop(1, 'rgba(225,228,226,0)'); vg.fillStyle = gr; vg.fillRect(0, 0, VW, VH);
    vg.globalCompositeOperation = 'destination-out'; vg.fillStyle = '#000'; vg.font = `${e.tam || 118}px Caneta`; vg.textAlign = 'left'; vg.textBaseline = 'middle';
    e.linhas.forEach((ln, li) => { const w = vg.measureText(ln.s).width; vg.save(); vg.translate(VW / 2, VH * 0.5 + (li - (e.linhas.length - 1) / 2) * (e.tam || 118) * 1.05); if (espelhado) vg.scale(-1, 1); vg.beginPath(); vg.rect(-w / 2 - 10, -100, (w + 20) * clamp(ln.p), 200); vg.clip(); vg.fillText(ln.s, -w / 2, 0); vg.restore(); });
    vg.globalCompositeOperation = 'source-over'; g.drawImage(vapC, VX, VY);
  }
  g.restore();
  // caixilho de madeira, duas folhas, tramela
  g.save(); g.strokeStyle = '#3a2e22'; g.lineWidth = 34; g.strokeRect(VX - 17, VY - 17, VW + 34, VH + 34); g.restore();
  tinta(g, [[VX - 34, VY - 34], [VX + VW + 34, VY - 34], [VX + VW + 34, VY + VH + 34], [VX - 34, VY + VH + 34], [VX - 34, VY - 34]], 1, { w: 2.2, over: 10 });
  tinta(g, [[VX, VY], [VX + VW, VY], [VX + VW, VY + VH], [VX, VY + VH], [VX, VY]], 1, { w: 1.6, over: 0, alpha: 0.8 });
  g.fillStyle = '#3a2e22'; g.fillRect(VX + VW / 2 - 9, VY, 18, VH); tinta(g, [[VX + VW / 2, VY], [VX + VW / 2, VY + VH]], 1, { w: 1.4, over: 0, alpha: 0.7 });
  riscos(g, [[[VX + VW / 2 - 30, VY + VH / 2], [VX + VW / 2 + 30, VY + VH / 2]], [[VX - 50, VY + VH + 60], [VX + VW + 50, VY + VH + 60]]], { w: 3, alpha: 0.8 });
  if (manha) { g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(90,110,130,${0.35 * manha})`; g.fillRect(0, 0, W, H); g.restore(); }
}
// tomada 4: de noite, a luz e a sombra
function tomada4(t) {
  const z = 1 + 0.12 * easeInOut(prog(t, T4, T5 - T4)); camera2D(t, W / 2, H / 2 + 40, z, { amp: 3 });
  const luz = t < P(6, 'luz') ? 0 : clamp((t - P(6, 'luz')) / 0.6), sombra = clamp((t - P(7, 'sombra')) / 1.2);
  vidro(t, { luz, sombra });
  const ta = P(6, 'lamparina'); if (t > ta) { medTxt(g, [VX + VW + 50, VY + VH * 0.66], 'luz de lamparina?', { tam: 30, cor: COR.ambar, alpha: clamp((t - ta) / 0.4), alinh: 'right' }); }
  const ts = P(7, 'sentada'); if (t > ts) { const q = [VX + VW * 0.55, VY + VH * 0.42]; tinta(g, [[q[0] + 90, q[1] - 40], [q[0] + 260, q[1] - 230], [q[0] + 330, q[1] - 230]], prog(t, ts, 0.4), { cor: COR.verm, w: 2, over: 0 }); datilo(g, 'ALGUÉM SENTADO', q[0] - 20, q[1] - 250, (t - ts - 0.3) / 0.6 * 14, { fonte: 'Maquina', tam: 34, cor: VERM_TXT }); }
  g.restore();
  if (t > S(6)) datilo(sb, 'NOITE  ·  JULHO', 84, 242, (t - S(6)) / 0.5 * 15, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 420, y: 1020, r: 900, i: 0.35 + 0.65 * luz, cor: luz > 0 ? AMBAR : [255, 236, 205] }, { x: 540, y: 800, r: 700, i: 0.4 }], amb: 0.14, mult: 1 };
}

// ---------- tomada 5: o prato das sete da noite ----------
const MESA = papelTex(W, H, 31, '#3b2c1f');
function tomada5(t) {
  const z = 1.05 + 0.1 * easeInOut(prog(t, T5, T6 - T5)); camera2D(t, W / 2, 960, z, { amp: 4 });
  g.drawImage(MESA, 0, 0); riscos(g, Array.from({ length: 14 }, (_, i) => [[0, 140 + i * 130 + Math.sin(i) * 20], [W, 120 + i * 130 + Math.cos(i) * 20]]), { w: 1, cor: '#000', alpha: 0.35 });
  const cx = 540, cy = 1000;
  // prato com borda de flores
  g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30; g.shadowOffsetY = 12; g.fillStyle = '#e8e1d2'; g.beginPath(); g.ellipse(cx, cy, 300, 270, 0, 0, 6.3); g.fill(); g.restore();
  g.strokeStyle = '#b9ad95'; g.lineWidth = 3; g.beginPath(); g.ellipse(cx, cy, 210, 188, 0, 0, 6.3); g.stroke();
  for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283; g.fillStyle = '#5b7a9a'; g.beginPath(); g.ellipse(cx + Math.cos(a) * 255, cy + Math.sin(a) * 229, 10, 6, a, 0, 6.3); g.fill(); }
  const tv = P(10, 'Vazio'), vazio = t > P(10, 'voltar');
  if (vazio) { g.fillStyle = '#8a6a40'; const r = rng(4); for (let i = 0; i < 26; i++) { g.globalAlpha = 0.7; g.beginPath(); g.arc(cx + (r() - 0.5) * 300, cy + (r() - 0.5) * 260, 2 + r() * 4, 0, 6.3); g.fill(); } g.globalAlpha = 1; riscos(g, [[[cx - 120, cy + 120], [cx + 150, cy - 110]], [[cx - 100, cy + 140], [cx + 170, cy - 90]]], { w: 7, cor: '#9a9890', alpha: 0.95 }); }
  // o pano de prato: cobre o prato; quando volta, foi puxado para o lado
  const tira = easeInOut(prog(t, P(10, 'voltar') - 0.1, 0.6)), px = cx + tira * 330, py = cy + tira * 240, rot = -0.08 + tira * 0.5;
  g.save(); g.translate(px, py); g.rotate(rot); g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 24; g.fillStyle = '#efe8da'; g.beginPath(); g.moveTo(-330, -300); g.quadraticCurveTo(0, -330, 330, -290); g.quadraticCurveTo(350, 0, 320, 300); g.quadraticCurveTo(0, 330, -320, 290); g.quadraticCurveTo(-350, 0, -330, -300); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = '#a8221a'; g.lineWidth = 10; g.setLineDash([22, 14]); g.strokeRect(-290, -262, 580, 530); g.setLineDash([]); riscos(g, [[[-300, -40], [300, -60]], [[-260, 120], [280, 90]], [[-120, -280], [-90, 280]]], { w: 1.4, cor: '#b9ad95', alpha: 0.7 });
  g.fillStyle = '#a8221a'; g.font = '40px Caneta'; g.textAlign = 'center'; g.fillText('D', 210, 220); g.restore();
  // relógio da sala
  const rx = 840, ry = 380, h = (t - S(8)) * 0.02; g.save(); g.fillStyle = '#e8e1d2'; g.beginPath(); g.arc(rx, ry, 110, 0, 6.3); g.fill(); g.strokeStyle = '#2a241c'; g.lineWidth = 6; g.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; riscos(g, [[[rx + Math.cos(a) * 88, ry + Math.sin(a) * 88], [rx + Math.cos(a) * 100, ry + Math.sin(a) * 100]]], { w: 3, cor: TINTA }); }
  const hm = vazio ? -Math.PI / 2 + (21.5 / 12) * 6.283 : -Math.PI / 2 + (19 / 12) * 6.283 + h, mm = vazio ? -Math.PI / 2 + 0.5 * 6.283 : -Math.PI / 2 + (t - S(8)) * 0.4;
  riscos(g, [[[rx, ry], [rx + Math.cos(hm) * 55, ry + Math.sin(hm) * 55]]], { w: 7, cor: TINTA }); riscos(g, [[[rx, ry], [rx + Math.cos(mm) * 84, ry + Math.sin(mm) * 84]]], { w: 4, cor: TINTA }); g.restore();
  medTxt(g, [rx, ry + 170], vazio ? '21:30' : '19:00', { tam: 44, alinh: 'center' });
  // "para a santa": oratório pequeno, com vela
  const tsn = P(9, 'santa'); if (t > tsn - 0.2) { const k = clamp((t - tsn + 0.2) / 0.4), ox = 220, oy = 420; tinta(g, [[ox - 70, oy + 90], [ox - 70, oy - 30], [ox, oy - 100], [ox + 70, oy - 30], [ox + 70, oy + 90], [ox - 70, oy + 90]], k, { w: 2.2, cor: COR.osso, over: 4 }); riscos(g, [[[ox, oy - 70], [ox, oy - 40]], [[ox - 12, oy - 58], [ox + 12, oy - 58]], [[ox - 10, oy + 30], [ox + 10, oy + 30], [ox + 10, oy + 80], [ox - 10, oy + 80], [ox - 10, oy + 30]]], { w: 2, cor: COR.osso, alpha: k }); g.save(); g.globalAlpha = k * (0.8 + 0.2 * ruido(t * 10, 2)); g.fillStyle = '#ffcc70'; g.beginPath(); g.ellipse(ox, oy + 18, 6, 12, 0, 0, 6.3); g.fill(); g.restore(); medTxt(g, [ox, oy + 150], '"para a santa"', { tam: 32, alinh: 'center', alpha: k, cor: COR.osso }); }
  if (t > tv) { medTxt(g, [cx, cy - 330], 'VAZIO', { tam: 70, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - tv) / 0.25) }); }
  g.restore();
  if (t > S(8)) datilo(sb, 'TODO DIA  ·  19:00', 84, 242, (t - S(8)) / 0.5 * 18, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 560, y: 980, r: 900 }, { x: 860, y: 420, r: 420, i: 0.5 }, ...(t > tsn ? [{ x: 230, y: 440, r: 380, i: 0.6, cor: AMBAR }] : [])], amb: 0.17, mult: 1 };
}

// ---------- tomada 6: QUEM É? / VOLTA A DORMIR ----------
function tomada6(t) {
  const z = 1 + 0.06 * easeInOut(prog(t, T6, T7 - T6)); camera2D(t, W / 2, H / 2 + 40, z, { amp: 3 });
  const tq = P(11, 'escreveu'), ta = P(12, 'apagou'), tm = S(13), tl = P(13, 'ao contrário');
  const manha = clamp((t - tm) / 0.8), luz = t < ta ? 1 : 0;
  if (t < tm) vidro(t, { luz, sombra: 0, escreve: { vapor: clamp((t - S(11) - 1.2) / 0.8) * (t < ta ? 1 : 0.85), linhas: [{ s: 'QUEM É?', p: (t - tq - 0.1) / 1.1 }] } });
  else vidro(t, { luz: 0, manha, espelhado: { vapor: 1, tam: 104, linhas: [{ s: 'VOLTA A', p: (t - tl + 0.4) / 0.9 }, { s: 'DORMIR', p: (t - tl - 0.4) / 0.9 }] } });
  if (t > S(14)) { medTxt(g, [W / 2, VY + VH + 150], '(lido do lado de cá: ao contrário)', { tam: 28, alinh: 'center', cor: COR.cinza, alpha: clamp((t - S(14)) / 0.4) }); }
  g.restore();
  if (t > S(11)) datilo(sb, t < tm ? 'JULHO DE 1996  ·  MADRUGADA' : 'NA MANHÃ SEGUINTE', 84, 242, (t - (t < tm ? S(11) : tm)) / 0.6 * 27, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 540, y: 960, r: 950, i: t < tm ? 0.9 : 0.7, cor: t < ta ? AMBAR : (t < tm ? [255, 236, 205] : [200, 215, 230]) }], amb: t >= ta && t < tm ? 0.06 : 0.16, mult: t >= ta && t < tm ? 0.35 : 1 };
}

// ---------- tomada 7: quatro janelas, três quartos ----------
function tomada7(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.04 * easeInOut(prog(t, T7, T8 - T7)), { amp: 3 });
  fundo();
  const esc = 62, ox = 540 - 5.7 * esc, X = x => ox + x * esc;
  // fachada (em cima)
  const yb = 840, Yf = y => yb - y * esc, pf = prog(t, T7, 0.8);
  tinta(g, [[X(0), Yf(0)], [X(0), Yf(6.8)], [X(XF), Yf(6.8)], [X(XF), Yf(0)]], pf, { w: 2.2, over: 10 });
  riscos(g, [[[X(-0.2), Yf(3.4)], [X(XF + 0.2), Yf(3.4)]], [[X(-0.2), Yf(6.4)], [X(XF + 0.2), Yf(6.4)]], [[X(-1.5), Yf(0)], [X(XF + 1.5), Yf(0)]]], { w: 1.4, alpha: pf });
  const tq = P(15, 'quatro');
  JAN.forEach((x, i) => { const a = [X(x - 0.55), Yf(4.1)], b = [X(x + 0.55), Yf(5.9)]; tinta(g, [a, [b[0], a[1]], b, [a[0], b[1]], a], prog(t, T7 + 0.3 + i * 0.1, 0.4), { w: 2, over: 4, cor: i === 3 && t > tq ? VERM_TXT : COR.osso }); if (i === 3) riscos(g, Array.from({ length: 10 }, (_, k) => [[X(x - 0.5), Yf(4.25 + k * 0.16)], [X(x + 0.5), Yf(4.25 + k * 0.16)]]), { w: 1, alpha: 0.7 }); const k = prog(t, tq - 0.1 + i * 0.22, 0.2); if (k > 0) medTxt(g, [X(x), Yf(7.3)], String(i + 1), { tam: 60 * easeOut(k) + 1, alinh: 'center', cor: i === 3 ? VERM_TXT : CLARO }); });
  [4.6, 7.6, 10.4].forEach(x => riscos(g, [[[X(x - 0.6), Yf(0.9)], [X(x + 0.6), Yf(0.9)], [X(x + 0.6), Yf(2.5)], [X(x - 0.6), Yf(2.5)], [X(x - 0.6), Yf(0.9)]]], { w: 1.4, alpha: 0.6 * pf }));
  // planta do andar de cima (embaixo), com linhas de chamada das janelas até os quartos
  const ypl = 930, Zp = z => ypl + z * esc, pp = prog(t, P(15, 'Lá dentro') - 0.3, 0.7);
  PAR.forEach(([x1, z1, x2, z2], i) => tinta(g, [[X(x1), Zp(z1)], [X(x2), Zp(z2)]], prog(pp, i / PAR.length * 0.5, 0.5), { w: 2.4, seed: i + 60, over: 8 }));
  if (pp > 0.5) { g.save(); g.globalAlpha = clamp((pp - 0.5) * 2); g.fillStyle = 'rgba(13,11,9,0.9)'; g.fillRect(X(XP), Zp(0), (XF - XP) * esc, ZQ * esc); g.restore(); g.save(); g.beginPath(); g.rect(X(XP), Zp(0), (XF - XP) * esc, ZQ * esc); g.clip(); riscos(g, Array.from({ length: 24 }, (_, k) => [[X(XP) - 200 + k * 16, Zp(ZQ)], [X(XP) - 200 + k * 16 + 250, Zp(0)]]), { w: 1, alpha: 0.4 * pp }); g.restore(); }
  const t3 = P(15, 'três quartos');
  ['D. DIRCE', 'COSTURA', 'HÓSPEDES'].forEach((s, i) => { const k = prog(t, t3 + i * 0.2, 0.25); if (k <= 0) return; riscos(g, [[[X(JAN[i]), Yf(4.0)], [X(JAN[i]), Zp(1.4)]]], { w: 1.2, dash: [6, 6], alpha: 0.6 * k }); medTxt(g, [X(JAN[i]), Zp(2.3)], s, { tam: 24, alinh: 'center', alpha: k }); medTxt(g, [X(JAN[i]), Zp(3.2)], '✓', { tam: 40, alinh: 'center', alpha: k }); });
  const t4 = E(15) - 0.6; if (t > t4) { const k = clamp((t - t4) / 0.3); riscos(g, [[[X(JAN[3]), Yf(4.0)], [X(JAN[3]), Zp(1.4)]]], { w: 2, cor: COR.verm, dash: [6, 6], alpha: k }); medTxt(g, [X(JAN[3]), Zp(2.6)], '?', { tam: 90, alinh: 'center', cor: VERM_TXT, alpha: k }); }
  g.restore();
  if (t > S(15)) datilo(sb, 'FACHADA  ×  PLANTA', 84, 242, (t - S(15)) / 0.5 * 17, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 540, y: t < P(15, 'Lá dentro') ? 600 : 1150, r: 1000 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 8: o telhado não tem abertura ----------
const cam8 = trajeto([[T8, -7.5, 18, -2, 5.7, 6.8, 3.0], [E(16), 1.5, 15, -0.5, 9.8, 6.8, 2.2], [T9, 3.0, 14, 0, 10.2, 6.8, 2.0]]);
function tomada8(t) {
  const [px, py, pz, tx, ty, tz] = cam8(t), hh = mao(t, 0.06), cam = camera([px + hh.x, py + hh.y, pz], [tx, ty, tz], 40, hh.r);
  fundo();
  const Rz = (l, op) => riscos(g, l.flatMap(p => cam.linha(p)), op), y0 = 6.8, yr = 8.6, zr = 3;
  // duas águas de telha colonial: frente (z 0–3) e fundo (z 3–6)
  const fr = cam.poli([[-0.2, y0, -0.2], [XF + 0.2, y0, -0.2], [XF + 0.2, yr, zr], [-0.2, yr, zr]]), fu = cam.poli([[-0.2, yr, zr], [XF + 0.2, yr, zr], [XF + 0.2, y0, ZF + 0.2], [-0.2, y0, ZF + 0.2]]);
  for (const p of [fu, fr]) if (p) { caminho(g, p); g.fillStyle = '#2a211a'; g.fill(); tinta(g, [...p, p[0]], 1, { w: 2, over: 6 }); }
  const tel = []; for (let k = 0; k <= 12; k++) { const s = k / 12, z = lerp(-0.2, zr, s), y = lerp(y0, yr, s); tel.push(Array.from({ length: 58 }, (_, i) => [-0.2 + i * 0.2, y + 0.05 * Math.abs(Math.sin(i * Math.PI / 2)), z])); const z2 = lerp(ZF + 0.2, zr, s); tel.push(Array.from({ length: 58 }, (_, i) => [-0.2 + i * 0.2, y + 0.05 * Math.abs(Math.sin(i * Math.PI / 2)), z2])); }
  for (let x = 0; x <= XF; x += 0.2) tel.push([[x, y0, -0.2], [x, yr, zr]]);
  Rz(tel, { w: 0.9, alpha: 0.45 });
  Rz([[[-0.2, yr, zr], [XF + 0.2, yr, zr]]], { w: 3, alpha: 0.9 });
  // onde o poço deveria abrir para o céu
  const tn = P(16, 'nenhuma'), k = prog(t, tn - 0.3, 0.6);
  const a = [XP, y0 + (yr - y0) * 0.1 / zr, 0.1], qs = [[XP + 0.2, 0, 0.3], [XF - 0.2, 0, 0.3], [XF - 0.2, 0, 2.7], [XP + 0.2, 0, 2.7]].map(([x, , z]) => [x, lerp(y0, yr, (z + 0.2) / (zr + 0.2)) + 0.03, z]);
  if (k > 0) { cam.linha([...qs, qs[0]]).forEach(pp => tinta(g, pp, k, { cor: COR.verm, w: 3, dash: [10, 8], over: 0 })); if (k >= 1) { Rz([[qs[0], qs[2]], [qs[1], qs[3]]], { w: 3, cor: COR.verm, alpha: 0.9 }); const q = cam.pt([10.2, yr + 0.5, 1.5]); if (q) { medTxt(g, [q[0], q[1] - 120], 'NENHUMA ABERTURA', { tam: 40, alinh: 'center', cor: VERM_TXT }); medTxt(g, [q[0], q[1] - 76], 'telhado contínuo · sem claraboia', { tam: 24, alinh: 'center', cor: COR.cinza }); } } }
  if (t > S(16)) datilo(sb, 'COBERTURA  ·  LICENÇA DE 1962', 84, 242, (t - S(16)) / 0.6 * 29, { tam: 32, cor: COR.osso, esp: 2 });
  const q = cam.pt([10.2, yr, 1.5]) || [W / 2, H / 2];
  return { focos: [{ x: q[0], y: q[1], r: 950 }], amb: 0.18, mult: 1 };
}

// ---------- tomada 9: a certidão e o caderno ----------
const CERT = papelTex(820, 640, 41), CAD = papelTex(860, 980, 42, '#ece4cf');
const ENTR = [['12/07/1996', 'O menino escreveu no vidro. Ela respondeu.'], ['20/03/1998', 'Ela se foi hoje de manhã. Fiz tudo sozinha.'], ['14/07/1999', 'Deixei o prato por costume. Voltou vazio.'], ['09/07/2002', 'O prato voltou vazio de novo. Ela perguntou do menino.']];
function tomada9(t) {
  const k = easeInOut(prog(t, P(17, 'E um caderno') - 0.4, 1.0)), z = lerp(1.18, 1.12, k), cy = lerp(560, 1240, k);
  camera2D(t, W / 2, cy, z, { amp: 4 });
  fundo();
  papel(g, CERT, 130, 220, { rot: -0.02 });
  g.save(); g.translate(130, 220); g.rotate(-0.02);
  g.fillStyle = TINTA; g.font = '30px Serifa'; g.fillText('REPÚBLICA DOS ESTADOS UNIDOS DO BRASIL', 40, 70); g.font = '22px Maquina'; g.fillText('CERTIDÃO DE NASCIMENTO · 2ª VIA · Registro nº 4.117', 40, 110); g.fillRect(40, 124, 740, 2);
  g.font = '26px MaquinaR'; ['Nascidas em 02/05/1931, às 4h e às 4h20,', 'duas crianças do sexo feminino,', 'gêmeas, que receberam os nomes de', 'DIRCE e DALVA.'].forEach((l, i) => g.fillText(l, 40, 190 + i * 52));
  g.font = '22px MaquinaR'; g.fillStyle = '#6b604d'; g.fillText('Rua do Rosário, 31 · Cartório do 1º Ofício', 40, 480); g.restore();
  const tg = P(17, 'gêmeas'); circulo(g, 130 + 40 + 60, 220 + 190 + 2 * 52 - 10, 80, 30, easeInOut(prog(t, tg, 0.5)), { seed: 3 }); circulo(g, 130 + 40 + 175, 220 + 190 + 3 * 52 - 10, 180, 34, easeInOut(prog(t, tg + 0.4, 0.5)), { seed: 6 });
  papel(g, CAD, 110, 900, { rot: 0.015 });
  g.save(); g.translate(110, 900); g.rotate(0.015);
  riscos(g, Array.from({ length: 14 }, (_, i) => [[0, 120 + i * 62], [860, 120 + i * 62]]), { w: 1.2, cor: '#7f9cc2', alpha: 0.6 }); riscos(g, [[[100, 0], [100, 980]]], { w: 1.6, cor: '#c9524a', alpha: 0.7 });
  escrita(g, 'caderno da Dirce', 130, 90, 1, -0.1, { tam: 44 });
  ENTR.forEach(([d, s], i) => { const y = 200 + i * 186; escrita(g, d, 130, y, 1, -0.1, { tam: 36 }); escrita(g, s, 160, y + 60, 1, -0.1, { tam: 32, cor: '#3b4a6b' }); });
  const tm = P(17, 'depois da morte'); if (t > tm - 0.2) { const kk = prog(t, tm - 0.2, 0.5), y1 = 200 + 2 * 186 - 50, y2 = 200 + 3 * 186 + 80; tinta(g, [[90, y1], [70, y1], [70, y2], [90, y2]], kk, { cor: COR.verm, w: 3.5, over: 0 }); escrita(g, 'depois', 18, (y1 + y2) / 2, kk, 0, { tam: 34, cor: COR.verm }); circulo(g, 300, 200 + 186 + 60 - 10, 150, 32, easeInOut(prog(t, tm + 0.3, 0.5)), { seed: 9 }); }
  g.restore(); g.restore();
  if (t > S(17)) datilo(sb, 'A GAVETA DA AVÓ', 84, 242, (t - S(17)) / 0.5 * 15, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 560, y: lerp(560, 1150, k), r: 950 }], amb: 0.2, mult: 1 };
}

const tomada10 = t => cartaoFinal(t, T10, N, 3, { linhas: LINHAS });

const LEG = [
  [2, 'Todo julho, de 1994 a 2003, um menino passava as férias no sobrado da avó Dirce.', { 'avó Dirce': CLARO }],
  [3, 'O quarto dele tinha duas janelas. Uma dava para a rua.', { 'duas janelas': CLARO }],
  [4, 'A outra dava para dentro da casa. Vidro canelado.', { 'para dentro da casa': VERM_TXT }],
  [5, 'A avó dizia que do outro lado era um poço de luz, fechado havia muitos anos.', { 'poço de luz': CLARO }],
  [6, 'Mas, de noite, às vezes tinha luz do outro lado. Amarela, tremendo, como chama de lamparina.', { 'luz do outro lado': VERM_TXT }],
  [7, 'E uma sombra parada atrás do vidro, na altura de uma pessoa sentada.', { 'pessoa sentada': VERM_TXT }],
  [8, 'Todo dia, às 7 da noite, a avó subia com um prato de comida coberto com um pano.', { 'às 7 da noite': CLARO }],
  [9, 'Dizia que era "para a santa".', { '"para a santa"': CLARO }],
  [10, 'Uma vez, o menino viu o prato voltar. Vazio.', { 'Vazio.': VERM_TXT }],
  [11, 'Em 1996, ele embaçou o vidro com o bafo e escreveu: QUEM É?', { 'QUEM É?': CLARO }],
  [12, 'A luz apagou.', { 'A luz apagou.': VERM_TXT }],
  [13, 'De manhã, o vidro estava embaçado do lado de lá. E as letras apareciam ao contrário.', { 'do lado de lá': VERM_TXT }],
  [14, 'VOLTA A DORMIR.', { 'VOLTA A DORMIR.': VERM_TXT }],
  [15, 'A fachada tem 4 janelas no andar de cima. Lá dentro, só 3 quartos dão para a rua.', { '4 janelas': CLARO, '3 quartos': VERM_TXT }],
  [16, 'E o telhado não tem nenhuma abertura para o tal poço de luz.', { 'nenhuma abertura': VERM_TXT }],
  [17, 'Na gaveta da avó havia uma certidão de gêmeas. E um caderno que continua depois da morte de alguém.', { 'gêmeas': CLARO, 'depois da morte': VERM_TXT }],
];

rodar({ FIM, TOMADAS: [[0, tomada1], [T2, tomada2], [T3, tomada3], [T4, tomada4], [T5, tomada5], [T6, tomada6], [T7, tomada7], [T8, tomada8], [T9, tomada9], [T10, tomada10]], legendasFn: legendas(N, LEG) });
