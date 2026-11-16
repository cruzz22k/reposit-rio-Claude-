// Caso 006 — "O quarto das crianças sem crianças", estilo Planta no escuro. O desenho principal é o batente da porta.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, trajeto, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, camera, mao, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, caminho, arco3, medTxt, rot3, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, blocos, parede, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(16) + 1.4;
const T = i => S(i) - 0.25;
const LINHAS = ['CASO 006 · RUA SALDANHA, 77', 'QUARTO DAS CRIANÇAS · 1993'];
const AMARELO = '#c9a64a';

// ---------- tomada 1: título ----------
function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 }); fundo();
  riscos(g, [0.86, 1.0, 1.13, 1.26, 1.37, 1.58, 1.64].map((h, i) => [[420, 1560 - h * 260], [520, 1560 - h * 260]]), { w: 1.4, alpha: 0.2 * prog(t, 0.3, 1.5) });
  tinta(g, [[400, 1600], [400, 1060], [540, 1060], [540, 1600]], prog(t, 0.3, 1.5), { w: 1.4, alpha: 0.18 });
  prancha(g, t, { linhas: LINHAS, folha: '06/13' });
  const tag = 'ARQUIVO MORTO  ·  CASO 006'; datilo(g, tag, W / 2, 690, (t - 0.45) / 0.65 * tag.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'O QUARTO DAS CRIANÇAS', 885, P(1, 'O quarto')); titulo(g, t, 'SEM CRIANÇAS', 1005, P(1, 'sem'));
  const pr = prog(t, P(1, 'sem') + 0.3, 0.5); if (pr > 0) { riscos(g, [[[420, 1100], [420 + 240 * pr, 1100]], [[660, 1100], [660 + 240 * pr, 1100]]], { w: 3, cor: COR.verm }); medTxt(g, [540, 1115], '?', { tam: 40, alinh: 'center', cor: VERM_TXT, alpha: pr }); }
  g.restore();
  return { focos: [{ x: 540, y: 900, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}

// ---------- tomada 2: a casa da Rua Saldanha ----------
function tomada2(t) {
  camera2D(t, W / 2, 960, 1 + 0.08 * easeInOut(prog(t, T(2), 4)), { amp: 4 }); fundo();
  const p = k => prog(t, T(2) + k, 0.6), L = (pts, k, o = {}) => tinta(g, pts, p(k), { w: 2.2, ...o });
  L([[80, 1300], [1000, 1300]], 0, { over: 0 }); L([[200, 1300], [200, 820], [880, 820], [880, 1300]], 0.2); L([[160, 830], [540, 560], [920, 830]], 0.5);
  L([[460, 1300], [460, 1050], [620, 1050], [620, 1300]], 0.7, { w: 1.8 }); L([[270, 920], [410, 920], [410, 1040], [270, 1040], [270, 920]], 0.8, { w: 1.6 }); L([[670, 920], [810, 920], [810, 1040], [670, 1040], [670, 920]], 0.9, { w: 1.6 });
  riscos(g, [[[340, 920], [340, 1040]], [[740, 920], [740, 1040]], ...Array.from({ length: 22 }, (_, i) => [[220 + i * 30, 1300], [220 + i * 30, 1360]]), [[200, 1340], [880, 1340]]], { w: 1.2, alpha: 0.6 * p(1.0) });
  if (t > P(2, 'Rua Saldanha')) medTxt(g, [540, 1450], 'RUA SALDANHA, 77', { tam: 44, alinh: 'center', cor: CLARO, alpha: clamp((t - P(2, 'Rua Saldanha')) / 0.4) });
  g.restore();
  if (t > S(2)) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, '2018  ·  PAULA E ROGÉRIO', 116, 242, (t - S(2)) / 0.6 * 24, { tam: 40, cor: COR.osso, esp: 3 }); }
  return { focos: [{ x: 540, y: 1000, r: 950 }], amb: 0.18, mult: 1 };
}

// ---------- tomada 3: Dona Ivone ----------
const NOTA = papelTex(760, 560, 31, '#e6dcc6');
function tomada3(t) {
  camera2D(t, W / 2, 940, 1.12, { amp: 4 }); fundo(); papel(g, NOTA, 160, 660, { rot: -0.015 });
  g.save(); g.translate(160, 660); g.rotate(-0.015); g.fillStyle = TINTA; g.font = '22px Maquina'; g.textAlign = 'center'; g.fillText('NOTA DE FALECIMENTO · 2017', 380, 70); g.fillRect(80, 88, 600, 2);
  g.font = '56px Serifa'; g.fillText('Ivone Lacerda', 380, 180); g.font = '30px MaquinaR'; g.fillText('1929 – 2017 · 88 anos', 380, 236);
  g.font = '24px MaquinaR'; g.fillStyle = '#5c5242'; ['Viveu sozinha a vida inteira', 'na Rua Saldanha, 77.', 'Nunca casou. Não deixou filhos.'].forEach((l, i) => g.fillText(l, 380, 320 + i * 44)); g.textAlign = 'left'; g.restore();
  circulo(g, 160 + 380, 660 + 320 + 2 * 44 - 8, 230, 32, easeInOut(prog(t, P(3, 'Nunca'), 0.5)), { seed: 4 });
  g.restore();
  if (t > S(3)) datilo(sb, 'A ANTIGA DONA', 84, 242, (t - S(3)) / 0.5 * 13, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 540, y: 920, r: 900 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 4: o quarto montado em 1993 (3D) ----------
const HP = 1.8, PAR = [[0, 0, 4, 0], [0, 3.4, 4, 3.4], [0, 0, 0, 3.4], [4, 0, 4, 1.6], [4, 2.5, 4, 3.4]];
const QUARTO = [...PAR.map((s, i) => parede(s, HP, { i })),
  { x0: 0.3, x1: 1.1, z0: 0.2, z1: 1.8, h: 0.42, tipo: 'movel', linhas: h => [[[0.35, h, 0.35], [1.05, h, 0.35], [1.05, h, 0.6], [0.35, h, 0.6], [0.35, h, 0.35]]] },
  { x0: 1.6, x1: 2.4, z0: 0.2, z1: 1.8, h: 0.42, tipo: 'movel', linhas: h => [[[1.65, h, 0.35], [2.35, h, 0.35], [2.35, h, 0.6], [1.65, h, 0.6], [1.65, h, 0.35]]] },
  { x0: 2.9, x1: 3.9, z0: 0.1, z1: 0.45, h: 1.2, tipo: 'movel', linhas: h => [[[2.9, h, 0.27], [3.9, h, 0.27]]] },
  { x0: 0.1, x1: 2.2, z0: 2.75, z1: 3.33, h: 1.75, tipo: 'movel', linhas: h => [[[1.15, h, 2.75], [1.15, h, 3.33]]] }];
const cam4 = trajeto([[T(4), -6.5, 10.5, -6.0, 2.0, 0, 1.7], [S(5), -4.5, 9.0, -4.6, 2.0, 0, 1.7], [T(6), -3.8, 8.4, -4.0, 2.0, 0, 1.7]]);
function tomada4(t) {
  const [px, py, pz, tx, ty, tz] = cam4(t), hh = mao(t, 0.04), cam = camera([px + hh.x, py + hh.y, pz], [tx, ty, tz], 40, hh.r);
  fundo();
  const fl = cam.poli([[0.07, 0, 0.07], [3.93, 0, 0.07], [3.93, 0, 3.33], [0.07, 0, 3.33]]); if (fl) { caminho(g, fl); g.fillStyle = 'rgba(201,166,74,0.10)'; g.fill(); }
  riscos(g, Array.from({ length: 12 }, (_, i) => [[0.3 + i * 0.3, 0, 0.07], [0.3 + i * 0.3, 0, 3.33]]).flatMap(p => cam.linha(p)), { w: 0.9, alpha: 0.1 });
  riscos(g, [arco3(4, 0.01, 2.5, 0.9, -Math.PI / 2, -Math.PI, 12)].flatMap(p => cam.linha(p)), { w: 1.2, alpha: 0.4, dash: [6, 6] });
  blocos(cam, QUARTO.map(b => b.tipo === 'parede' ? { ...b, cores: ['#2a2412', '#c9b27a', 0.75] } : b));
  // brinquedos na prateleira (um cavalinho, um trem, um urso, de linhas)
  const q = cam.pt([3.4, 1.22, 0.27]), e = cam.esc([3.4, 1.2, 0.27]); if (q) { riscos(g, [[[q[0] - e * 0.4, q[1]], [q[0] - e * 0.4, q[1] - e * 0.15], [q[0] - e * 0.2, q[1] - e * 0.15], [q[0] - e * 0.2, q[1]]], Array.from({ length: 13 }, (_, k) => [q[0] + e * 0.15 + Math.cos(k / 12 * 6.3) * e * 0.08, q[1] - e * 0.1 + Math.sin(k / 12 * 6.3) * e * 0.08]), [[q[0] + e * 0.3, q[1]], [q[0] + e * 0.35, q[1] - e * 0.12], [q[0] + e * 0.45, q[1] - e * 0.12], [q[0] + e * 0.5, q[1]]]], { w: 1.4, alpha: 0.85 }); }
  // poeira grossa por cima de tudo
  const r = rng(6); g.fillStyle = '#d8ccb2'; for (let i = 0; i < 160; i++) { const p3 = [r() * 4, r() * 0.5, r() * 3.4], s = cam.pt(p3); if (s) { g.globalAlpha = 0.12; g.fillRect(s[0], s[1], 2, 2); } } g.globalAlpha = 1;
  ['CAMA 1', 'CAMA 2'].forEach((s, i) => rot3(cam, s, [0.7 + i * 1.3, 0.5, 1.2], 0.2, { max: 34, cor: COR.osso }));
  if (t > P(4, 'Montado')) datilo(sb, 'MONTADO EM 1993', 84, 242, (t - P(4, 'Montado')) / 0.5 * 15, { tam: 32, cor: COR.osso, esp: 2 }); else if (t > S(4)) datilo(sb, 'QUARTO DE CRIANÇA', 84, 242, (t - S(4)) / 0.5 * 17, { tam: 32, cor: COR.osso, esp: 2 });
  const tq = P(5, 'para quando'); if (t > tq - 0.2) { const s = '"Para quando eles chegarem."'; datilo(g, s, W / 2, 1180, (t - tq + 0.2) / 1.3 * s.length, { fonte: 'SerifaI', tam: 54, cor: CLARO, alinh: 'center' }); }
  const c = cam.pt([2, 0.4, 1.6]) || [W / 2, H / 2];
  return { focos: [{ x: c[0], y: c[1], r: 950, cor: [255, 225, 170] }], amb: 0.18, mult: 1 };
}

// ---------- tomada 5: Lia e Teo nascem ----------
function pulseira(c, x, y, rot, nome, data, k) {
  if (k <= 0) return; c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha = k;
  c.fillStyle = '#e9e4d6'; c.beginPath(); c.roundRect(-260, -55, 520, 110, 55); c.fill(); c.strokeStyle = '#9aa7b8'; c.lineWidth = 3; c.stroke();
  c.fillStyle = '#d7e3ef'; c.fillRect(-150, -40, 300, 80); c.fillStyle = TINTA; c.font = '40px Maquina'; c.textAlign = 'center'; c.fillText(nome, 0, 0); c.font = '22px MaquinaR'; c.fillText(data, 0, 30); c.restore();
}
function tomada5(t) {
  camera2D(t, W / 2, 960, 1.05, { amp: 4 }); fundo();
  pulseira(g, 540, 780, -0.08, 'LIA', 'nascida em março de 2019', easeOut(prog(t, P(6, 'Lia'), 0.4)));
  pulseira(g, 540, 1080, 0.06, 'TEO', 'nascido em janeiro de 2022', easeOut(prog(t, P(6, 'Teo'), 0.4)));
  if (t > E(6) - 0.4) medTxt(g, [540, 1300], 'nomes escolhidos pelos avós do Rogério', { tam: 28, alinh: 'center', cor: COR.cinza, alpha: clamp((t - E(6) + 0.4) / 0.4) });
  g.restore();
  return { focos: [{ x: 540, y: 930, r: 900 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 6: o fundo falso do guarda-roupa ----------
const CAIXAS = [['LIA', [2, 4, 6, 8, 10, 12, 14, 16, 18]], ['TEO', [2, 4, 6, 8, 9]]];
function tomada6(t) {
  const k = easeInOut(prog(t, S(9) - 0.3, 1.0)); camera2D(t, W / 2, lerp(900, 1060, k), lerp(1.0, 1.08, k), { amp: 4 }); fundo();
  const X0 = 140, X1 = 940, Y0 = 380, Y1 = 1560;
  g.fillStyle = '#1f1912'; g.fillRect(X0, Y0, X1 - X0, Y1 - Y0); tinta(g, [[X0, Y0], [X1, Y0], [X1, Y1], [X0, Y1], [X0, Y0]], 1, { w: 3, over: 8 });
  // o fundo falso desliza e mostra as prateleiras de caixas
  const ab = easeInOut(prog(t, P(7, 'fundo falso') - 0.3, 1.0));
  const prat = [560, 820, 1080, 1340]; riscos(g, prat.map(y => [[X0, y], [X1, y]]), { w: 3, alpha: 0.8 * ab });
  const lista = []; CAIXAS.forEach(([n, idades], fi) => idades.forEach(id => lista.push([n, id, fi])));
  lista.forEach(([n, id, fi], i) => {
    const prateleira = fi === 0 ? Math.floor(i / 5) : 2 + Math.floor((i - 9) / 5), col = fi === 0 ? i % 5 : (i - 9) % 5;
    const x = X0 + 20 + col * 155, y = prat[prateleira] - 160, ta = fi === 0 ? P(8, 'Lia') + i * 0.18 : P(9, 'Teo') + (i - 9) * 0.22, a = easeOut(prog(t, ta, 0.25)) * ab;
    if (a <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = '#9b7b52'; g.fillRect(x, y, 140, 150); g.strokeStyle = '#5a4026'; g.lineWidth = 2; g.strokeRect(x, y, 140, 150); riscos(g, [[[x, y + 30], [x + 140, y + 30]]], { w: 1.5, cor: '#5a4026' });
    g.fillStyle = '#efe8da'; g.fillRect(x + 14, y + 52, 112, 64); g.fillStyle = TINTA; g.font = '22px Caneta'; g.textAlign = 'center'; g.fillText(`${n} — ${id}`, x + 70, y + 82); g.font = '16px Caneta'; g.fillText('ANOS', x + 70, y + 104); g.restore();
  });
  // depois dos nove: nada
  const tn = P(9, 'nenhuma'); if (t > tn - 0.1) { const x = X0 + 20 + 1 * 155, y = prat[3] - 160, kk = clamp((t - tn + 0.1) / 0.4); g.save(); g.setLineDash([10, 8]); tinta(g, [[x, y], [x + 600, y], [x + 600, y + 150], [x, y + 150], [x, y]], kk, { cor: COR.verm, w: 2.4, over: 0 }); g.restore(); medTxt(g, [x + 300, y + 98], 'depois dos 9: nada', { tam: 40, alinh: 'center', cor: VERM_TXT, alpha: kk }); }
  // o painel falso, ainda cobrindo uma parte
  g.fillStyle = '#3a2c1e'; g.fillRect(X0 + (X1 - X0) * ab, Y0, (X1 - X0) * (1 - ab) + 2, Y1 - Y0); riscos(g, Array.from({ length: 12 }, (_, i) => [[X0 + (X1 - X0) * ab + 10, Y0 + 40 + i * 95], [X1 - 10, Y0 + 40 + i * 95]]), { w: 1, alpha: 0.3 * (1 - ab) });
  g.restore();
  if (t > S(7)) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, '2024  ·  O GUARDA-ROUPA', 116, 242, (t - S(7)) / 0.6 * 23, { tam: 40, cor: COR.osso, esp: 3 }); }
  return { focos: [{ x: 540, y: lerp(800, 1250, k), r: 950 }], amb: 0.18, mult: 1 };
}

// ---------- tomada 7: o bilhete ----------
const BIL = papelTex(700, 440, 41, '#f4eedf');
function tomada7(t) {
  camera2D(t, W / 2, 940, 1.12, { amp: 4 }); fundo(); papel(g, BIL, 190, 720, { rot: -0.03 });
  g.save(); g.translate(190, 720); g.rotate(-0.03);
  escrita(g, 'Este quarto é da Lia e do Teo.', 60, 140, (t - P(10, 'este quarto')) / 1.3, -0.08, { tam: 46, cor: TINTA });
  escrita(g, 'Não pintem o batente.', 60, 240, (t - P(10, 'Não pintem')) / 1.0, -0.08, { tam: 46, cor: TINTA });
  escrita(g, '— I.', 420, 350, (t - E(10) + 0.3) / 0.4, -0.08, { tam: 46, cor: TINTA });
  g.restore();
  circulo(g, 190 + 280, 720 + 228, 250, 46, easeInOut(prog(t, P(10, 'batente'), 0.5)), { seed: 6 });
  g.restore();
  return { focos: [{ x: 540, y: 940, r: 900 }], amb: 0.2, mult: 1 };
}

// ---------- o batente (2D): 1 m = 640 px; altura 0 no chão ----------
const MARCAS = [['LIA', 2021, 0.86], ['LIA', 2023, 1.00], ['TEO', 2024, 0.86], ['LIA', 2025, 1.13], ['TEO', 2026, 1.01], ['LIA', 2027, 1.26], ['TEO', 2028, 1.14], ['LIA', 2029, 1.37], ['TEO', 2031, 1.30, 'ÚLTIMA'], ['LIA', 2033, 1.58], ['LIA', 2037, 1.64]];
const BX0 = 470, BX1 = 610, YH = h => 1820 - h * 820;
function batente(t, { lixa = 0, foco = null, camadas = 0 } = {}) {
  fundo();
  g.fillStyle = '#2a2412'; g.fillRect(0, 0, BX0 - 30, H); g.fillRect(BX1 + 30, 0, W - BX1 - 30, H);      // parede amarela, no escuro
  // madeira lixada (embaixo) e esmalte creme (em cima)
  g.fillStyle = '#b58a5a'; g.fillRect(BX0, 0, BX1 - BX0, H); riscos(g, Array.from({ length: 9 }, (_, i) => Array.from({ length: 30 }, (_, k) => [BX0 + 10 + i * 15 + Math.sin(k * 0.5 + i) * 3, k * 70])), { w: 1, cor: '#8a6038', alpha: 0.6 });
  const yl = H - lixa * H;   // até onde já foi lixado (de baixo para cima)
  MARCAS.forEach(([n, ano, h, extra]) => { const y = YH(h); if (y < yl) return; const lia = n === 'LIA'; riscos(g, [[[BX0 + 4, y], [BX1 - 4, y]]], { w: 3.2, cor: '#2a2a2a', alpha: 0.95 }); g.save(); g.font = '38px Caneta'; g.fillStyle = '#d9d2c2'; g.textAlign = lia ? 'left' : 'right'; g.fillText(`${n} ${ano}`, lia ? BX1 + 16 : BX0 - 16, y + 8); g.font = '28px Caneta'; g.fillText(String(h.toFixed(2)).replace('.', ','), lia ? BX1 + 16 : BX0 - 16, y + 34); if (extra) { g.fillStyle = VERM_TXT; g.font = '34px Caneta'; g.fillText(extra, BX0 - 16, y - 18); } g.restore(); });
  g.fillStyle = '#e9dcc0'; g.fillRect(BX0, 0, BX1 - BX0, yl); g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(BX0, yl - 6, BX1 - BX0, 6);
  tinta(g, [[BX0, 0], [BX0, H]], 1, { w: 2.4, over: 0 }); tinta(g, [[BX1, 0], [BX1, H]], 1, { w: 2.4, over: 0 });
  // os textos das marcas ficam na parede, ao lado do batente: só aparecem onde já foi lixado
  if (camadas > 0) {
    const x = 720, y = 520, w = 280;
    [['madeira (batente)', '#b58a5a'], ['grafite: os riscos', '#555'], ['esmalte creme · 22/03/1994', '#e9dcc0'], ['2ª demão · 1994', '#ddd0b0'], ['3ª demão · 1994', '#d2c4a2']].forEach(([s, c], i) => { const a = clamp(camadas * 5 - i); if (a <= 0) return; g.globalAlpha = a; g.fillStyle = c; g.fillRect(x, y + (4 - i) * 70, w, 60); g.globalAlpha = 1; medTxt(g, [x + w + 0, y + (4 - i) * 70 + 40], '', {}); g.save(); g.globalAlpha = a; g.fillStyle = i === 1 ? VERM_TXT : CLARO; g.font = '24px Maquina'; g.textAlign = 'right'; g.fillText(s, x - 14, y + (4 - i) * 70 + 40); g.restore(); });
    medTxt(g, [x + w / 2, y - 30], 'corte da tinta', { tam: 26, alinh: 'center', cor: COR.cinza, alpha: clamp(camadas * 2) });
  }
}

// ---------- tomada 8: o pintor lixa: riscos a lápis ----------
function tomada8(t) {
  const k = easeInOut(prog(t, S(12) - 0.3, 1.0));
  camera2D(t, W / 2, lerp(980, YH(0.86) - 40, k), lerp(1.0, 1.45, k), { amp: 4 });
  batente(t, { lixa: easeInOut(prog(t, P(11, 'lixou'), 2.6)) });
  // o celular da Paula, ao lado da marca de 2021 (e depois da do Teo, 2024)
  const tl = P(12, 'celular'), tt = P(13, 'Teo');
  if (t > tl - 0.4) { const a = clamp((t - tl + 0.4) / 0.4), x = 690, y = YH(0.86) - 210; g.save(); g.globalAlpha = a; g.fillStyle = '#e9e4d8'; g.beginPath(); g.roundRect(x, y, 300, 170, 18); g.fill(); g.fillStyle = TINTA; g.font = '20px Texto'; g.fillText('Notas · Paula', x + 18, y + 34); g.font = '22px Texto'; g.fillText('Lia, 2 anos (mar/2021): 0,86', x + 18, y + 80); if (t > tt) g.fillText('Teo, 2 anos (jan/2024): 0,86', x + 18, y + 120); g.restore(); circulo(g, BX1 + 70, YH(0.86) + 14, 90, 40, easeInOut(prog(t, P(12, 'oitenta'), 0.5)), { seed: 3 }); }
  if (t > tt) circulo(g, BX0 - 70, YH(0.86) + 14, 90, 40, easeInOut(prog(t, P(13, 'oitenta'), 0.5)), { seed: 7 });
  g.restore();
  if (t > S(11)) datilo(sb, 'O BATENTE  ·  LIXADO', 84, 242, (t - S(11)) / 0.5 * 20, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 560, y: lerp(900, 1000, k), r: 900 }], amb: 0.18, mult: 1 };
}

// ---------- tomada 9: a tinta é de 1994; a última marca ----------
function tomada9(t) {
  const t15 = S(15), k = easeInOut(prog(t, t15 - 0.3, 1.0));
  camera2D(t, W / 2, lerp(900, YH(1.30) + 60, k), lerp(1.0, 1.35, k), { amp: 4 });
  batente(t, { lixa: 1, camadas: t < t15 ? clamp((t - P(14, 'pintura')) / 1.4) : 0 });
  const tu = P(15, 'palavra') + 0.4; if (t > tu - 0.3) circulo(g, BX0 - 120, YH(1.30) - 10, 150, 60, easeInOut(prog(t, tu - 0.3, 0.6)), { seed: 9 });
  if (t > t15 + 0.6) medTxt(g, [W / 2 + 160, YH(1.30) + 130], 'Teo faz 9 anos em 2031', { tam: 30, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - t15 - 0.6) / 0.4) });
  g.restore();
  if (t > S(14)) datilo(sb, t < t15 ? 'PINTURAS IRMÃOS COUTO  ·  22/03/1994' : 'A MARCA DE 2031', 84, 242, (t - (t < t15 ? S(14) : t15)) / 0.6 * 34, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: t < t15 ? 700 : 480, y: t < t15 ? 760 : 900, r: 900 }], amb: 0.18, mult: 1 };
}

const tomadaFim = t => cartaoFinal(t, T(16), N, 6, { linhas: LINHAS });

const LEG = [
  [2, 'Em 2018, a Paula e o Rogério compraram a casa da Rua Saldanha.', { 'Paula': CLARO, 'Rogério': CLARO }],
  [3, 'A antiga dona, Dona Ivone, morreu aos 88 anos. Nunca teve filhos.', { 'Nunca teve filhos.': VERM_TXT }],
  [4, 'Mesmo assim, a casa tinha um quarto de criança. Duas caminhas. Montado em 1993.', { 'Montado em 1993.': CLARO }],
  [5, 'Quando perguntavam para quem era, ela respondia: "para quando eles chegarem."', { '"para quando eles chegarem."': VERM_TXT }],
  [6, 'A Lia nasceu em 2019. O Teo, em 2022.', { 'Lia': CLARO, 'Teo': CLARO }],
  [7, 'Em 2024, atrás do guarda-roupa, o marceneiro achou um fundo falso.', { 'fundo falso': VERM_TXT }],
  [8, 'Caixas de roupa nova, com etiqueta. Lia, 2 anos. Lia, 4 anos. Até os 18.', { 'Lia': CLARO }],
  [9, 'Teo, 2 anos. Até os 9. Depois dos 9, nenhuma caixa.', { 'nenhuma caixa': VERM_TXT }],
  [10, 'E um bilhete: "Este quarto é da Lia e do Teo. Não pintem o batente."', { '"Não pintem o batente."': VERM_TXT }],
  [11, 'O pintor lixou o batente. Embaixo da tinta, riscos a lápis. A altura de duas crianças, ano a ano.', { 'riscos a lápis': CLARO }],
  [12, 'Lia, 2021: 86 cm. A mesma altura que a Paula anotou no celular.', { 'A mesma altura': VERM_TXT }],
  [13, 'Teo, 2024: 86. Também igual.', { 'Também igual.': VERM_TXT }],
  [14, 'A pintura do batente é de 1994. E os riscos estão por baixo dela.', { 'por baixo dela': VERM_TXT }],
  [15, 'A última marca do Teo é de 2031. Do lado, uma palavra: ÚLTIMA.', { 'ÚLTIMA.': VERM_TXT }],
];

rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(3), tomada3], [T(4), tomada4], [T(6), tomada5], [T(7), tomada6], [T(10), tomada7], [T(11), tomada8], [T(14), tomada9], [T(16), tomadaFim]], legendasFn: legendas(N, LEG) });
