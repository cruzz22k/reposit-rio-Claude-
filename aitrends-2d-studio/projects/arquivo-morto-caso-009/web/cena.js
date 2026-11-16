// Caso 009 — "O sítio onde os relógios atrasam", estilo Planta no escuro.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, medTxt, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N, ULT = N.TL.length;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(ULT) + 1.4;
const T = i => S(i) - 0.25;
const LINHAS = ['CASO 009 · SÍTIO BOA VISTA, KM 14', 'CROQUI DO SÍTIO (SEU DITO)'];
const TERRA = '#a8452a';
const tag = (s, t0, t, big = false) => { if (t <= t0) return; if (big) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, s, 116, 242, (t - t0) / 0.6 * s.length, { tam: 40, cor: COR.osso, esp: 3 }); } else datilo(sb, s, 84, 242, (t - t0) / 0.6 * s.length, { tam: 32, cor: COR.osso, esp: 2 }); };

// relógio analógico
function relogio(c, x, y, r, hh, mm, { cor = '#e8e1d2', moldura = TINTA, k = 1, rot = '' } = {}) {
  if (k <= 0) return; c.save(); c.globalAlpha = k; c.fillStyle = cor; c.beginPath(); c.arc(x, y, r, 0, 6.3); c.fill(); c.strokeStyle = moldura; c.lineWidth = r * 0.07; c.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; riscos(c, [[[x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8], [x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92]]], { w: r * 0.04, cor: TINTA }); }
  const ah = -Math.PI / 2 + ((hh % 12) + mm / 60) / 12 * 6.283, am = -Math.PI / 2 + mm / 60 * 6.283;
  riscos(c, [[[x, y], [x + Math.cos(ah) * r * 0.5, y + Math.sin(ah) * r * 0.5]]], { w: r * 0.07, cor: TINTA }); riscos(c, [[[x, y], [x + Math.cos(am) * r * 0.75, y + Math.sin(am) * r * 0.75]]], { w: r * 0.04, cor: TINTA });
  c.restore(); if (rot) medTxt(c, [x, y + r + 44], rot, { tam: 24, alinh: 'center', cor: COR.cinza, alpha: k });
}
// croqui do sítio (2D)
const CASA = [300, 1360], POCO = [700, 620], MANG = [790, 520];
function croqui(t, t0, o = {}) {
  const p = k => prog(t, t0 + k, 0.6);
  tinta(g, [[CASA[0] - 110, CASA[1] - 80], [CASA[0] + 110, CASA[1] - 80], [CASA[0] + 110, CASA[1] + 80], [CASA[0] - 110, CASA[1] + 80], [CASA[0] - 110, CASA[1] - 80]], p(0), { w: 2.6, over: 6 });
  medTxt(g, [CASA[0], CASA[1] + 10], 'CASA', { tam: 28, alinh: 'center', alpha: p(0.3) });
  const trilha = Array.from({ length: 40 }, (_, i) => { const s = i / 39; return [lerp(CASA[0] + 60, POCO[0] - 30, s) + Math.sin(s * 7) * 60, lerp(CASA[1] - 90, POCO[1] + 40, s)]; });
  g.save(); g.setLineDash([10, 10]); tinta(g, trilha, p(0.4), { w: 2, over: 0, alpha: 0.8 }); g.restore();
  medTxt(g, [560, 1000], 'trilha: 450 m', { tam: 24, cor: COR.cinza, alpha: p(0.8) });
  tinta(g, Array.from({ length: 25 }, (_, i) => [POCO[0] + Math.cos(i / 24 * 6.3) * 44, POCO[1] + Math.sin(i / 24 * 6.3) * 44]), p(0.7), { w: 2.6, over: 0 }); riscos(g, [Array.from({ length: 25 }, (_, i) => [POCO[0] + Math.cos(i / 24 * 6.3) * 30, POCO[1] + Math.sin(i / 24 * 6.3) * 30])], { w: 1.4, alpha: p(0.8) });
  medTxt(g, [POCO[0] - 60, POCO[1] + 90], 'POÇO VELHO', { tam: 24, alinh: 'center', alpha: p(0.9) });
  const r = rng(4), copa = []; for (let i = 0; i < 9; i++) { const a = r() * 6.3, d = r() * 50; copa.push(Array.from({ length: 16 }, (_, k) => [MANG[0] + Math.cos(a) * d + Math.cos(k / 15 * 6.3) * 50, MANG[1] + Math.sin(a) * d + Math.sin(k / 15 * 6.3) * 50])); }
  riscos(g, copa, { w: 1.4, alpha: 0.7 * p(1.0) }); medTxt(g, [MANG[0] + 30, MANG[1] - 100], 'MANGUEIRA', { tam: 24, alinh: 'center', alpha: p(1.1) });
  if (o.cota) cota(g, [POCO[0] + 44, POCO[1] - 10], [MANG[0] - 10, MANG[1] + 50], o.cota, '3 m', { cor: COR.cinza, w: 1.4, tam: 22, lado: 1 });
  // árvores e cerca, de fundo
  riscos(g, Array.from({ length: 22 }, (_, i) => { const x = 120 + (i * 137) % 860, y = 420 + ((i * 251) % 1250); return Array.from({ length: 10 }, (_, k) => [x + Math.cos(k / 9 * 6.3) * 22, y + Math.sin(k / 9 * 6.3) * 22]); }), { w: 1, alpha: 0.18 * p(0.5) });
}

function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 }); fundo();
  relogio(g, 540, 1350, 150, 3, 10, { cor: 'rgba(232,225,210,0.15)', moldura: 'rgba(232,225,210,0.3)', k: prog(t, 0.3, 1.0) });
  prancha(g, t, { linhas: LINHAS, folha: '09/13' });
  const s = 'ARQUIVO MORTO  ·  CASO 009'; datilo(g, s, W / 2, 690, (t - 0.45) / 0.65 * s.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'O SÍTIO ONDE OS', 885, P(1, 'O sítio')); titulo(g, t, 'RELÓGIOS ATRASAM', 1005, P(1, 'relógios'));
  g.restore();
  return { focos: [{ x: 540, y: 900, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}
function tomada2(t) {
  camera2D(t, W / 2, 960, 1.0, { amp: 4 }); fundo(); croqui(t, T(2));
  g.restore(); tag('2023  ·  SÍTIO BOA VISTA', S(2), t, true);
  return { focos: [{ x: 540, y: 960, r: 1000 }], amb: 0.2, mult: 1 };
}
// ---------- os relógios ----------
function tomada3(t) {
  camera2D(t, W / 2, 960, 1.0, { amp: 3 }); fundo();
  const t5 = S(5), acerta = t > t5 && t < P(5, 'Na manhã') ? 1 : 0, atraso = acerta ? 0 : 17;
  const real = 6 * 60 + 30 + (t - S(3)) * 0.5, m = real - atraso;
  const L = [[300, 640, 150, 'pêndulo (corda)'], [780, 640, 120, 'cozinha (elétrico)'], [300, 1120, 110, 'despertador (pilha)'], [780, 1120, 90, 'pulso']];
  L.forEach(([x, y, r, s], i) => relogio(g, x, y, r, Math.floor(m / 60), m % 60, { k: easeOut(prog(t, P(4, 'pêndulo') - 0.6 + i * 0.35, 0.3)), rot: s }));
  // o celular: hora certa
  const cx = 540, cy = 1470; g.save(); g.fillStyle = '#1b1814'; g.beginPath(); g.roundRect(cx - 110, cy - 70, 220, 140, 24); g.fill(); g.strokeStyle = COR.osso; g.lineWidth = 2; g.stroke(); g.fillStyle = '#9fc3ff'; g.font = '50px Maquina'; g.textAlign = 'center'; g.fillText(`${String(Math.floor(real / 60)).padStart(2, '0')}:${String(Math.floor(real % 60)).padStart(2, '0')}`, cx, cy + 18); g.font = '16px Maquina'; g.fillText('celular · hora da operadora', cx, cy + 52); g.restore();
  const td = P(4, 'dezessete'); if (t > td && !acerta) medTxt(g, [540, 400], '− 17 min em todos', { tam: 48, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - td) / 0.3) });
  g.restore(); tag(t > P(5, 'Na manhã') ? 'MANHÃ SEGUINTE' : 'PRIMEIRA MANHÃ', t > P(5, 'Na manhã') ? P(5, 'Na manhã') : S(3), t);
  return { focos: [{ x: 540, y: 900, r: 1000 }], amb: 0.2, mult: 1 };
}
// ---------- o costume da avó ----------
function tomada4(t) {
  camera2D(t, W / 2, 960, 1.05, { amp: 4 }); fundo();
  relogio(g, 540, 760, 220, 3, 10, { k: prog(t, T(6), 0.5) });
  if (t > P(6, 'para os relógios')) { riscos(g, [[[380, 760], [700, 760]]], { w: 0 }); g.save(); g.globalAlpha = clamp((t - P(6, 'para os relógios')) / 0.3); g.fillStyle = 'rgba(13,11,9,0.5)'; g.beginPath(); g.arc(540, 760, 220, 0, 6.3); g.fill(); g.restore(); medTxt(g, [540, 780], 'PARADO', { tam: 60, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(6, 'para os relógios')) / 0.3) }); }
  const s1 = '"Quando alguém morre em casa,', s2 = 'a gente para os relógios.', s3 = 'E só deixa andar quando o corpo sai."';
  datilo(g, s1, W / 2, 1140, (t - P(6, 'quando')) / 1.0 * s1.length, { fonte: 'SerifaI', tam: 42, cor: CLARO, alinh: 'center' }); datilo(g, s2, W / 2, 1200, (t - P(6, 'a gente')) / 1.0 * s2.length, { fonte: 'SerifaI', tam: 42, cor: CLARO, alinh: 'center' }); datilo(g, s3, W / 2, 1260, (t - P(6, 'E só')) / 1.3 * s3.length, { fonte: 'SerifaI', tam: 42, cor: VERM_TXT, alinh: 'center' });
  g.restore(); tag('O QUE A AVÓ DIZIA', S(6), t);
  return { focos: [{ x: 540, y: 940, r: 950 }], amb: 0.2, mult: 1 };
}
// ---------- o jornal de 1984 ----------
const JOR = papelTex(820, 900, 31, '#d9cfb6');
function tomada5(t) {
  camera2D(t, W / 2, 940, 1.1, { amp: 4 }); fundo(); papel(g, JOR, 130, 480, { rot: 0.015 });
  g.save(); g.translate(130, 480); g.rotate(0.015); g.fillStyle = TINTA; g.font = '22px Maquina'; g.fillText('GAZETA REGIONAL · TERÇA, 24/07/1984', 50, 60); g.fillRect(50, 76, 720, 2);
  g.font = '46px Serifa'; ['Menino de 7 anos', 'desaparece no', 'Sítio Boa Vista'].forEach((l, i) => g.fillText(l, 50, 150 + i * 56));
  g.font = '25px Serifa'; ['Paulo Henrique, de 7 anos, desapareceu', 'na madrugada de sábado, 21. O avô,', 'Bento, contou que acordou às 3h30', 'e não encontrou o neto na cama.'].forEach((l, i) => g.fillText(l, 50, 360 + i * 40));
  g.fillStyle = '#9a8f78'; g.fillRect(500, 520, 230, 260); g.fillStyle = '#2a241c'; g.beginPath(); g.ellipse(615, 610, 46, 56, 0, 0, 6.3); g.fill(); g.fillRect(560, 670, 110, 110); g.restore();
  g.restore(); tag('JULHO DE 1984', S(7), t, true);
  return { focos: [{ x: 540, y: 900, r: 900 }], amb: 0.2, mult: 1 };
}
// ---------- o sonâmbulo: pegadas de terra até a mangueira ----------
function tomada6(t) {
  camera2D(t, W / 2, 960, 1.0, { amp: 3 }); fundo(); croqui(t, -99, { cota: clamp((t - P(10, 'mangueira')) / 0.5) });
  const tp = P(9, 'sai'), pegadas = []; const n = Math.floor(clamp((t - tp) / 3.0) * 26);
  for (let i = 0; i < n; i++) { const s = i / 26, x = lerp(CASA[0] + 60, MANG[0] - 40, s) + Math.sin(s * 7) * 60 + (i % 2 ? 14 : -14), y = lerp(CASA[1] - 90, MANG[1] + 70, s); g.save(); g.translate(x, y); g.rotate(-0.6); g.fillStyle = TERRA; g.globalAlpha = 0.85; g.beginPath(); g.ellipse(0, 0, 8, 14, 0, 0, 6.3); g.fill(); g.restore(); }
  if (t > P(8, 'terra vermelha')) { medTxt(g, [CASA[0], CASA[1] + 160], 'pés sujos de terra vermelha', { tam: 26, alinh: 'center', cor: '#e07a5a', alpha: clamp((t - P(8, 'terra vermelha')) / 0.3) }); }
  if (t > P(9, 'três')) medTxt(g, [CASA[0] + 20, CASA[1] - 140], '03:10', { tam: 44, alinh: 'center', cor: CLARO, alpha: clamp((t - P(9, 'três')) / 0.3) });
  const tc = P(10, 'olhando para o chão'); if (t > tc) { const k = clamp((t - tc) / 0.4), x = MANG[0] - 40, y = MANG[1] + 90; tinta(g, [[x - 26, y - 26], [x + 26, y + 26]], k, { cor: COR.verm, w: 4, over: 0 }); tinta(g, [[x + 26, y - 26], [x - 26, y + 26]], k, { cor: COR.verm, w: 4, over: 0 }); circulo(g, x, y, 70, 60, easeInOut(k), { seed: 6 }); }
  if (t > P(10, 'não olha')) medTxt(g, [POCO[0] - 60, POCO[1] + 130], 'não olha para o poço', { tam: 24, alinh: 'center', cor: COR.cinza, alpha: clamp((t - P(10, 'não olha')) / 0.3) });
  g.restore(); tag(t < S(9) ? 'TODA MANHÃ' : 'O CASEIRO VIU  ·  03:00', t < S(9) ? S(8) : S(9), t);
  return { focos: [{ x: t < S(10) ? 520 : MANG[0] - 60, y: t < S(10) ? 1000 : MANG[1] + 120, r: t < S(10) ? 1000 : 700 }], amb: 0.16, mult: 1 };
}
// ---------- o celular: passos ----------
function tomada7(t) {
  camera2D(t, W / 2, 960, 1.08, { amp: 3 }); fundo();
  const X = 230, Y = 420; g.save(); g.fillStyle = '#16130f'; g.beginPath(); g.roundRect(X, Y, 620, 1100, 60); g.fill(); g.strokeStyle = COR.osso; g.lineWidth = 3; g.stroke(); g.restore();
  medTxt(g, [X + 310, Y + 100], 'Saúde · Passos', { tam: 34, alinh: 'center' });
  const L = [['04/09', '1.286'], ['05/09', '1.312'], ['06/09', '1.297'], ['07/09', '1.301'], ['08/09', '1.290']];
  L.forEach(([d, n], i) => { const k = easeOut(prog(t, S(11) + i * 0.25, 0.3)); if (k <= 0) return; const y = Y + 220 + i * 120; g.save(); g.globalAlpha = k; g.fillStyle = '#2a2520'; g.fillRect(X + 40, y - 50, 540, 90); g.restore(); medTxt(g, [X + 70, y + 8], d, { tam: 30, alpha: k, cor: COR.cinza }); medTxt(g, [X + 300, y + 8], n, { tam: 36, alpha: k }); medTxt(g, [X + 560, y + 8], '3h10–3h27', { tam: 22, alinh: 'right', alpha: k, cor: '#e07a5a' }); });
  const tm = P(11, 'das três'); if (t > tm) { medTxt(g, [X + 310, Y + 900], '1.300 passos × 70 cm ≈ 900 m', { tam: 30, alinh: 'center', cor: CLARO, alpha: clamp((t - tm) / 0.4) }); medTxt(g, [X + 310, Y + 960], '= a trilha, ida e volta', { tam: 30, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - tm - 0.5) / 0.4) }); }
  g.restore(); tag('O CELULAR CONTOU', S(11), t);
  return { focos: [{ x: 540, y: 960, r: 900 }], amb: 0.18, mult: 1 };
}
// ---------- a Bíblia da família ----------
const BIB = papelTex(820, 900, 41, '#e9dfc4');
function tomada8(t) {
  camera2D(t, W / 2, 960, 1.1, { amp: 4 }); fundo(); papel(g, BIB, 130, 520, { rot: -0.01 });
  g.save(); g.translate(130, 520); g.rotate(-0.01); g.strokeStyle = '#8a2a1a'; g.lineWidth = 3; g.strokeRect(30, 30, 760, 840); g.fillStyle = '#5a2a1a'; g.font = '40px Serifa'; g.textAlign = 'center'; g.fillText('Registro da Família', 410, 110); g.textAlign = 'left';
  escrita(g, 'Paulo Henrique — nasceu em 02/05/1977', 70, 260, 1, -0.06, { tam: 36, cor: '#2a2a3a' }); escrita(g, 'Fernando — nasceu em 15/03/1979', 70, 340, 1, -0.06, { tam: 36, cor: '#2a2a3a' });
  escrita(g, 'Paulo Henrique — 21/07/1984 — 3h10', 70, 500, (t - P(12, 'nome')) / 1.0, -0.06, { tam: 40, cor: '#2a2a3a' }); riscos(g, [[[70, 470], [70, 470]]], {});
  g.restore();
  const th = P(12, 'três e dez'); circulo(g, 130 + 70 + 610, 520 + 490, 90, 40, easeInOut(prog(t, th, 0.5)), { seed: 4 });
  if (t > th + 0.5) { medTxt(g, [W / 2, 1300], 'hora de morte · não de sumiço', { tam: 34, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - th - 0.5) / 0.4) }); medTxt(g, [W / 2, 1360], '3h27 − 3h10 = 17 minutos', { tam: 34, alinh: 'center', cor: CLARO, alpha: clamp((t - th - 1.0) / 0.4) }); }
  g.restore(); tag('A BÍBLIA DA FAMÍLIA', S(12), t);
  return { focos: [{ x: 540, y: 1000, r: 900 }], amb: 0.2, mult: 1 };
}
// ---------- o poço esvaziado ----------
function tomada9(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 }); fundo();
  const Y = 760; tinta(g, [[60, Y], [1020, Y]], 1, { w: 2.6, over: 0 }); g.fillStyle = '#1a140f'; g.fillRect(60, Y, 960, 900); riscos(g, Array.from({ length: 40 }, (_, i) => [[60 + i * 26, Y + 900], [60 + i * 26 + 120, Y + 40]]).map(s => s.map(q => [Math.min(1020, q[0]), q[1]])), { w: 1, alpha: 0.15 });
  // corte do poço, vazio
  g.fillStyle = '#0d0b09'; g.fillRect(300, Y, 160, 760); tinta(g, [[300, Y], [300, Y + 760], [460, Y + 760], [460, Y]], 1, { w: 2.4, over: 0 }); medTxt(g, [380, Y - 30], 'POÇO VELHO', { tam: 26, alinh: 'center' });
  const tv = P(13, 'esvaziaram'); if (t > tv) { const k = clamp((t - tv) / 0.6); g.fillStyle = `rgba(80,120,160,${0.5 * (1 - k)})`; g.fillRect(302, Y + 200 + 500 * k, 156, 558 - 500 * k); }
  if (t > P(13, 'Não acharam')) medTxt(g, [380, Y + 860], 'nada', { tam: 40, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(13, 'Não acharam')) / 0.3) });
  // a mangueira, a 3 m; o chão onde ninguém cavou
  const mx = 780; riscos(g, [[[mx, Y], [mx - 10, Y - 260]], [[mx + 30, Y], [mx + 40, Y - 240]]], { w: 3 }); riscos(g, Array.from({ length: 6 }, (_, i) => Array.from({ length: 14 }, (_, k) => [mx + 10 + (i - 2.5) * 50 + Math.cos(k / 13 * 6.3) * 70, Y - 330 + Math.sin(k / 13 * 6.3) * 60])), { w: 1.4, alpha: 0.6 });
  riscos(g, Array.from({ length: 7 }, (_, i) => [[mx + 15, Y], [mx + 15 + (i - 3) * 70, Y + 120 + Math.abs(i - 3) * 20]]), { w: 1.6, alpha: 0.5 });
  cota(g, [460, Y - 80], [mx, Y - 80], prog(t, S(13) + 0.6, 0.6), '3 m', { cor: COR.cinza, w: 1.4, tam: 24 });
  const tq = E(13) - 0.6; if (t > tq) { g.save(); g.setLineDash([10, 9]); tinta(g, [[mx - 120, Y + 60], [mx + 140, Y + 60], [mx + 140, Y + 200], [mx - 120, Y + 200], [mx - 120, Y + 60]], prog(t, tq, 0.5), { cor: COR.verm, w: 2.4, over: 0 }); g.restore(); medTxt(g, [mx + 10, Y + 150], '?', { tam: 80, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - tq - 0.3) / 0.3) }); }
  g.restore(); tag('1984  ·  "A PEDIDO DA FAMÍLIA"', S(13), t);
  return { focos: [{ x: 540, y: 1050, r: 950 }], amb: 0.18, mult: 1 };
}
const tomadaFim = t => cartaoFinal(t, T(ULT), N, 9, { linhas: LINHAS });
const LEG = [
  [2, 'Em 2023, o Fernando foi passar um mês no sítio dos avós, fechado desde 2009.', { 'Fernando': CLARO }],
  [3, 'Na primeira manhã, todos os relógios da casa estavam atrasados.', { 'atrasados': VERM_TXT }],
  [4, 'O de pêndulo, o da cozinha, o despertador e o relógio de pulso dele. Todos 17 minutos.', { 'Todos 17 minutos.': VERM_TXT }],
  [5, 'Ele acertou todos. Na manhã seguinte, 17 minutos de novo.', { '17 minutos de novo': VERM_TXT }],
  [6, 'A avó dizia: quando alguém morre em casa, a gente para os relógios. E só deixa andar quando o corpo sai.', { 'quando o corpo sai': VERM_TXT }],
  [7, 'Em 1984, o irmão dele, Paulinho, sumiu do sítio de madrugada. Tinha 7 anos.', { 'Paulinho': CLARO }],
  [8, 'O Fernando começou a acordar com os pés sujos de terra vermelha.', { 'terra vermelha': VERM_TXT }],
  [9, 'O caseiro viu: ele sai às 3 da madrugada, de olhos abertos, e vai até o poço velho.', { 'de olhos abertos': VERM_TXT }],
  [10, 'Mas não olha para o poço. Fica parado ao lado da mangueira, olhando para o chão.', { 'olhando para o chão': VERM_TXT }],
  [11, 'O celular contou: 1.300 passos, toda noite, das 3h10 às 3h27.', { 'das 3h10 às 3h27': CLARO }],
  [12, 'Na Bíblia da família, ao lado do nome do Paulinho, a avó anotou uma hora: 3h10.', { '3h10.': VERM_TXT }],
  [13, 'Naquele ano, os bombeiros esvaziaram o poço. A pedido da família. Não acharam nada.', { 'A pedido da família.': VERM_TXT }],
];
rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(3), tomada3], [T(6), tomada4], [T(7), tomada5], [T(8), tomada6], [T(11), tomada7], [T(12), tomada8], [T(13), tomada9], [T(ULT), tomadaFim]], legendasFn: legendas(N, LEG) });
