// Caso 012 — "A porta pintada", estilo Planta no escuro.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, medTxt, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N, ULT = N.TL.length;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(ULT) + 1.4;
const T = i => S(i) - 0.25;
const LINHAS = ['CASO 012 · VILA INÊS, CASAS 4 E 5', 'PLANTA DA VILA · 1960'];
const LAV = '#b79ad6', LAVr = [190, 160, 230];
const tag = (s, t0, t, big = false) => { if (t <= t0) return; if (big) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, s, 116, 242, (t - t0) / 0.6 * s.length, { tam: 40, cor: COR.osso, esp: 3 }); } else datilo(sb, s, 84, 242, (t - t0) / 0.6 * s.length, { tam: 32, cor: COR.osso, esp: 2 }); };

// a porta pintada na parede da sala (elevação). sombra: -1 à esquerda, 1 à direita; abre: 0..1
function porta(x, y, s, { sombra = 1, abre = 0, rot = true } = {}) {
  const w = 220 * s, h = 470 * s;
  g.fillStyle = 'rgba(0,0,0,0.45)'; g.fillRect(x - w / 2 + sombra * 18 * s, y - h + 10 * s, w + 8 * s, h);
  g.fillStyle = '#3e2a18'; g.fillRect(x - w / 2 - 14 * s, y - h - 14 * s, w + 28 * s, h + 14 * s);
  if (abre > 0) { g.fillStyle = '#1a1018'; g.fillRect(x - w / 2, y - h, w, h); const gr = g.createLinearGradient(x + w / 2 - 30 * s, 0, x + w / 2, 0); gr.addColorStop(0, 'rgba(183,154,214,0)'); gr.addColorStop(1, `rgba(183,154,214,${0.6 * abre})`); g.fillStyle = gr; g.fillRect(x - w / 2, y - h, w, h); }
  const fw = w * (1 - 0.12 * abre); g.fillStyle = '#5a3b22'; g.fillRect(x - w / 2, y - h, fw, h);
  riscos(g, [[[x - w / 2 + 24 * s, y - h + 24 * s], [x - w / 2 + fw - 24 * s, y - h + 24 * s], [x - w / 2 + fw - 24 * s, y - h / 2 - 12 * s], [x - w / 2 + 24 * s, y - h / 2 - 12 * s], [x - w / 2 + 24 * s, y - h + 24 * s]], [[x - w / 2 + 24 * s, y - h / 2 + 12 * s], [x - w / 2 + fw - 24 * s, y - h / 2 + 12 * s], [x - w / 2 + fw - 24 * s, y - 24 * s], [x - w / 2 + 24 * s, y - 24 * s], [x - w / 2 + 24 * s, y - h / 2 + 12 * s]]], { w: 2 * s, cor: '#2a1a10', alpha: 0.9 });
  g.fillStyle = '#d9b24a'; g.beginPath(); g.arc(x - w / 2 + fw - 30 * s, y - h / 2, 11 * s, 0, 6.3); g.fill();
  tinta(g, [[x - w / 2 - 14 * s, y], [x - w / 2 - 14 * s, y - h - 14 * s], [x + w / 2 + 14 * s, y - h - 14 * s], [x + w / 2 + 14 * s, y]], 1, { w: 2, over: 0, alpha: 0.8 });
}
function sala(t, { sombra = 1, abre = 0, janela = 0, abajur = 0, gato = 0 } = {}) {
  fundo(); g.fillStyle = '#231d17'; g.fillRect(0, 380, W, 1200); tinta(g, [[0, 1500], [W, 1500]], 1, { w: 2.6, over: 0 });
  // janela à esquerda, abajur à direita
  g.fillStyle = `rgba(242,211,154,${0.12 + 0.5 * janela})`; g.fillRect(70, 700, 220, 380); tinta(g, [[70, 700], [290, 700], [290, 1080], [70, 1080], [70, 700]], 1, { w: 2.4, over: 4 }); riscos(g, [[[180, 700], [180, 1080]], [[70, 890], [290, 890]]], { w: 2 });
  riscos(g, [[[880, 1500], [880, 1180]], [[820, 1500], [940, 1500]]], { w: 3 }); g.fillStyle = `rgba(242,211,154,${0.2 + 0.6 * abajur})`; g.beginPath(); g.moveTo(820, 1180); g.lineTo(940, 1180); g.lineTo(910, 1090); g.lineTo(850, 1090); g.closePath(); g.fill(); tinta(g, [[820, 1180], [940, 1180], [910, 1090], [850, 1090], [820, 1180]], 1, { w: 2, over: 0 });
  porta(540, 1500, 1.15, { sombra, abre });
  if (gato > 0) { g.save(); g.globalAlpha = gato; g.fillStyle = '#0c0a08'; g.beginPath(); g.ellipse(540, 1450, 60, 50, 0, 0, 6.3); g.fill(); g.beginPath(); g.ellipse(540, 1380, 34, 30, 0, 0, 6.3); g.fill(); g.beginPath(); g.moveTo(515, 1365); g.lineTo(520, 1335); g.lineTo(532, 1360); g.moveTo(548, 1360); g.lineTo(560, 1335); g.lineTo(565, 1365); g.fill(); riscos(g, [Array.from({ length: 12 }, (_, i) => [600 + i * 8, 1490 - Math.sin(i * 0.4) * 30])], { w: 8, cor: '#0c0a08' }); g.restore(); }
}
function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 }); fundo();
  g.save(); g.globalAlpha = 0.25 * prog(t, 0.3, 1.0); porta(540, 1680, 0.9, { sombra: Math.sin(t * 2) }); g.restore();
  prancha(g, t, { linhas: LINHAS, folha: '12/13' });
  const s = 'ARQUIVO MORTO  ·  CASO 012'; datilo(g, s, W / 2, 690, (t - 0.45) / 0.65 * s.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'A PORTA', 885, P(1, 'A porta')); titulo(g, t, 'PINTADA', 1005, P(1, 'pintada'));
  g.restore();
  return { focos: [{ x: 540, y: 1000, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}
function vila(t, t0, { com = 0 } = {}) {
  const X = i => 120 + i * 140, Y0 = 1350, Y1 = 850;
  for (let i = 0; i < 6; i++) { tinta(g, [[X(i), Y0], [X(i), Y1], [X(i + 1), Y1], [X(i + 1), Y0], [X(i), Y0]], prog(t, t0 + i * 0.1, 0.5), { w: 2.4, over: 6, cor: i === 3 ? CLARO : COR.osso, alpha: i === 3 || i === 4 ? 1 : 0.6 }); medTxt(g, [X(i) + 70, Y0 + 50], String(i + 1), { tam: 28, alinh: 'center', cor: i === 3 ? CLARO : COR.cinza, alpha: prog(t, t0 + 0.6, 0.4) }); }
  medTxt(g, [X(3) + 70, Y1 - 30], 'SOFIA', { tam: 24, alinh: 'center', cor: CLARO, alpha: prog(t, t0 + 0.8, 0.4) });
  if (com > 0) { riscos(g, [[[X(4), 1020], [X(4), 1120]]], { w: 7, cor: '#231d17' }); riscos(g, [Array.from({ length: 12 }, (_, k) => [X(4) + Math.cos(-Math.PI / 2 + k / 11 * Math.PI / 2) * 100, 1120 + Math.sin(-Math.PI / 2 + k / 11 * Math.PI / 2) * 100]), [[X(4), 1120], [X(4) + 100, 1120]]], { w: 2, cor: COR.verm, alpha: com, dash: [6, 6] }); medTxt(g, [X(4) + 60, 1210], 'porta de comunicação', { tam: 24, alinh: 'center', cor: VERM_TXT, alpha: com }); medTxt(g, [X(4) + 60, 1245], '(abre para a casa 5)', { tam: 20, alinh: 'center', cor: VERM_TXT, alpha: com }); }
}
function tomada2(t) { camera2D(t, W / 2, 1100, 1.15, { amp: 4 }); fundo(); vila(t, T(2)); g.restore(); tag('2023  ·  VILA INÊS', S(2), t, true); return { focos: [{ x: 600, y: 1100, r: 900 }], amb: 0.2, mult: 1 }; }
function tomada3(t) {
  camera2D(t, W / 2, 1100, 1.0 + 0.08 * easeInOut(prog(t, T(3), 5)), { amp: 3 }); sala(t, { sombra: 1, janela: 0.6 });
  const tb = P(3, 'sombra'); if (t > tb) { tinta(g, [[680, 1100], [860, 900], [960, 900]], prog(t, tb, 0.4), { cor: COR.ambar, w: 2, over: 0 }); medTxt(g, [870, 880], 'sombra do batente', { tam: 26, cor: COR.ambar }); }
  const tq = P(4, 'é só'); if (t > tq) { const s = '"É só pintura. É parede."'; datilo(g, s, W / 2, 520, (t - tq) / 1.0 * s.length, { fonte: 'SerifaI', tam: 50, cor: CLARO, alinh: 'center' }); }
  g.restore(); tag('A SALA DA CASA 4', S(3), t);
  return { focos: [{ x: 540, y: 1150, r: 900 }, { x: 180, y: 890, r: 400, i: 0.5, cor: [255, 230, 180] }], amb: 0.18, mult: 1 };
}
function tomada4(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 }); fundo();
  tinta(g, [[200, 1400], [200, 700], [880, 700], [880, 1400]], prog(t, T(5), 0.6), { w: 2.6, over: 6 }); tinta(g, [[160, 710], [540, 470], [920, 710]], prog(t, T(5) + 0.2, 0.6), { w: 2.6, over: 6 });
  [[300, 820], [640, 820]].forEach(([x, y]) => { g.fillStyle = '#2a2219'; g.fillRect(x, y, 140, 220); riscos(g, Array.from({ length: 10 }, (_, i) => [[x + 10, y + 12 + i * 21], [x + 130, y + 12 + i * 21]]), { w: 2, alpha: 0.7 }); });
  riscos(g, [[[480, 1400], [480, 1120], [600, 1120], [600, 1400]]], { w: 2.4 }); medTxt(g, [540, 1480], 'CASA 5', { tam: 34, alinh: 'center' });
  if (t > P(5, 'fechada')) carimbo(g, 540, 1000, clamp((t - P(5, 'fechada')) / 0.12), 'FECHADA · 2020', { larg: 560, rot: -0.12 });
  if (t > P(5, 'Albertina')) medTxt(g, [540, 600], 'Dona Albertina · †2020', { tam: 34, alinh: 'center', cor: CLARO, alpha: clamp((t - P(5, 'Albertina')) / 0.3) });
  g.restore(); tag('A CASA DO LADO', S(5), t);
  return { focos: [{ x: 540, y: 1000, r: 950 }], amb: 0.18, mult: 1 };
}
function tomada5(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 }); fundo();
  // perfume: o nível baixa
  const tp = P(6, 'perfume'), nv = 1 - 0.35 * easeInOut(prog(t, tp, 1.2)); g.save(); g.fillStyle = 'rgba(232,220,196,0.12)'; g.fillRect(170, 560, 220, 300); g.fillStyle = 'rgba(217,170,110,0.6)'; g.fillRect(170, 560 + 300 * (1 - nv), 220, 300 * nv); g.restore(); tinta(g, [[170, 560], [390, 560], [390, 860], [170, 860], [170, 560]], 1, { w: 2.4, over: 0 }); riscos(g, [[[240, 520], [320, 520], [320, 560], [240, 560], [240, 520]]], { w: 2.4 }); riscos(g, [[[150, 560 + 300 * 0.0], [170, 560]], [[150, 560 + 300 * 0.35], [170, 560 + 300 * 0.35]]], { w: 2, cor: COR.verm }); medTxt(g, [280, 920], 'perfume', { tam: 26, alinh: 'center', cor: COR.cinza });
  // açucareiro vazio
  const ta = P(6, 'açucareiro'); if (t > ta - 0.2) { const k = clamp((t - ta + 0.2) / 0.3); g.save(); g.globalAlpha = k; tinta(g, [[620, 860], [600, 640], [860, 640], [840, 860], [620, 860]], 1, { w: 2.4, over: 0 }); riscos(g, [[[640, 620], [820, 620]]], { w: 3 }); g.restore(); medTxt(g, [730, 920], 'açucareiro: vazio', { tam: 26, alinh: 'center', cor: VERM_TXT, alpha: k }); medTxt(g, [730, 960], '(ela não usa açúcar)', { tam: 20, alinh: 'center', cor: COR.cinza, alpha: k }); }
  // escova com o fio branco de quase 1 m
  const te = P(7, 'escova'); if (t > te - 0.2) { const k = clamp((t - te + 0.2) / 0.3); g.save(); g.globalAlpha = k; g.fillStyle = '#3a2c1e'; g.beginPath(); g.roundRect(160, 1120, 260, 90, 30); g.fill(); g.fillRect(420, 1150, 260, 30); riscos(g, Array.from({ length: 12 }, (_, i) => [[180 + i * 20, 1120], [180 + i * 20, 1100]]), { w: 2, cor: '#8a7a60' }); g.restore();
    const fio = prog(t, P(7, 'fio branco'), 1.0); riscos(g, [Array.from({ length: Math.max(2, Math.floor(60 * fio)) }, (_, i) => [200 + i * 13, 1110 - Math.sin(i * 0.25) * 60 - i * 3])], { w: 2.2, cor: '#f4f0e6', alpha: 0.9 }); if (fio > 0.9) { cota(g, [200, 1300], [980, 1300], 1, '≈ 1 m', { cor: CLARO, w: 1.6, tam: 26, lado: 1 }); } }
  if (t > P(7, 'preto e curto')) medTxt(g, [W / 2, 1480], 'o dela: preto e curto', { tam: 30, alinh: 'center', cor: COR.cinza, alpha: clamp((t - P(7, 'preto e curto')) / 0.3) });
  g.restore(); tag('OUTUBRO  ·  A LISTA DA SOFIA', S(6), t);
  return { focos: [{ x: 540, y: t < S(7) ? 760 : 1180, r: 900 }], amb: 0.2, mult: 1 };
}
function tomada6(t) {
  camera2D(t, W / 2, 1150, 1.08, { amp: 3 }); sala(t, { sombra: -1, abajur: 0.15, gato: clamp((t - P(8, 'gato')) / 0.4) });
  const tl = P(8, 'lavanda'); if (t > tl - 0.3) for (let i = 0; i < 7; i++) riscos(g, [Array.from({ length: 30 }, (_, j) => [540 + 126 + Math.sin(t * 1.7 + j * 0.3 + i) * 24 + j * 4, 1460 - j * 26 - i * 20])], { w: 5, cor: LAV, alpha: 0.18 * clamp((t - tl + 0.3) / 0.5) });
  g.restore(); tag('MADRUGADA', S(8), t);
  return { focos: [{ x: 600, y: 1200, r: 700, i: 0.7, cor: LAVr }], amb: 0.12, mult: 1 };
}
function foto(x, y, rot, manha, k, hora) {
  if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = k; g.fillStyle = '#efe9da'; g.fillRect(-200, -300, 400, 560);
  g.save(); g.beginPath(); g.rect(-180, -280, 360, 460); g.clip(); g.translate(-180, -280); g.scale(360 / 1080, 460 / 1150); g.translate(0, -420); sala(0, { sombra: manha ? 1 : -1, janela: manha ? 0.9 : 0, abajur: manha ? 0 : 0.9 }); g.restore();
  g.fillStyle = TINTA; g.font = '26px Caneta'; g.textAlign = 'center'; g.fillText(hora, 0, 230); g.restore();
}
function tomada7(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 }); fundo();
  foto(300, 960, -0.05, true, easeOut(prog(t, T(9) + 0.2, 0.4)), '08h12 · luz da janela');
  foto(780, 1000, 0.05, false, easeOut(prog(t, P(9, 'noite') - 0.2, 0.4)), '21h40 · abajur aceso');
  const tq = P(10, 'por que'); if (t > tq - 0.2) { const k = easeOut(prog(t, tq - 0.2, 0.3)); g.save(); g.globalAlpha = k; g.fillStyle = '#e9e4d8'; g.beginPath(); g.roundRect(140, 1380, 800, 120, 24); g.fill(); g.fillStyle = TINTA; g.font = '28px Texto'; g.fillText('@lu.reis: por que a sombra da porta', 170, 1430); g.fillText('muda de lado?', 170, 1470); g.restore(); }
  if (t > P(10, 'muda')) { circulo(g, 300 + 70, 960 - 30, 60, 120, easeInOut(prog(t, P(10, 'muda'), 0.5)), { seed: 3 }); circulo(g, 780 - 50, 1000 - 30, 60, 120, easeInOut(prog(t, P(10, 'muda') + 0.3, 0.5)), { seed: 6 }); }
  g.restore(); tag('O PERFIL DA SOFIA', S(9), t);
  return { focos: [{ x: 540, y: 1050, r: 950 }], amb: 0.2, mult: 1 };
}
function tomada8(t) {
  const fim = t > S(12);
  if (!fim) { camera2D(t, W / 2, 1100, 1.15, { amp: 4 }); fundo(); vila(t, -99, { com: clamp((t - P(11, 'porta de comunicação')) / 0.5) }); g.restore(); tag('PLANTA DA VILA  ·  1960', S(11), t); return { focos: [{ x: 700, y: 1100, r: 900 }], amb: 0.2, mult: 1 }; }
  camera2D(t, W / 2, 1150, 1.1 + 0.1 * easeInOut(prog(t, S(12), 3)), { amp: 3 }); sala(t, { sombra: -1, abre: clamp((t - P(12, 'lavanda')) / 0.8) * 0.25 });
  if (t > P(12, 'cabelo branco')) riscos(g, [Array.from({ length: 50 }, (_, i) => [540 + 120 + i * 2, 1060 + i * 8 + Math.sin(i * 0.4) * 6])], { w: 2, cor: '#f4f0e6', alpha: 0.8 * clamp((t - P(12, 'cabelo branco')) / 0.5) });
  g.restore(); tag('AGORA', S(12), t);
  return { focos: [{ x: 640, y: 1250, r: 700, i: 0.8, cor: LAVr }], amb: 0.14, mult: 1 };
}
const tomadaFim = t => cartaoFinal(t, T(ULT), N, 12, { linhas: LINHAS });
const LEG = [
  [2, 'Em 2023, a Sofia alugou uma casinha geminada numa vila.', { 'Sofia': CLARO }],
  [3, 'Na parede da sala há uma porta pintada. Madeira escura, maçaneta dourada, até a sombra do batente.', { 'porta pintada': CLARO }],
  [4, 'A dona garantiu: "é só pintura. É parede."', { '"é só pintura. É parede."': VERM_TXT }],
  [5, 'A casa do lado está fechada desde 2020, quando morreu a moradora, Dona Albertina.', { 'Dona Albertina': VERM_TXT }],
  [6, 'Em outubro, o perfume da Sofia começou a baixar no vidro. O açucareiro, vazio. Ela não usa açúcar.', { 'Ela não usa açúcar.': VERM_TXT }],
  [7, 'Na escova de cabelo, um fio branco de quase 1 metro. O cabelo dela é preto e curto.', { 'fio branco': VERM_TXT }],
  [8, 'De madrugada, a casa cheirava a lavanda. E o gato dormia sentado, olhando para a porta pintada.', { 'lavanda': VERM_TXT }],
  [9, 'A Sofia posta uma foto da sala de manhã e outra de noite. A janela fica à esquerda. O abajur, à direita.', { 'janela': CLARO, 'abajur': CLARO }],
  [10, 'Uma seguidora perguntou: por que a sombra da porta muda de lado?', { 'muda de lado?': VERM_TXT }],
  [11, 'Na planta da vila, de 1960, aquela parede tinha uma porta de comunicação.', { 'porta de comunicação': VERM_TXT }],
  [12, 'E a vizinha que morreu tinha um cabelo branco até a cintura. E usava lavanda.', { 'cabelo branco': VERM_TXT, 'lavanda': VERM_TXT }],
];
rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(3), tomada3], [T(5), tomada4], [T(6), tomada5], [T(8), tomada6], [T(9), tomada7], [T(11), tomada8], [T(ULT), tomadaFim]], legendasFn: legendas(N, LEG) });
