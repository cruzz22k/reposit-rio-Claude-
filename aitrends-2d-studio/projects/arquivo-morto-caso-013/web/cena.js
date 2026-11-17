// Caso 013 — "A planta desenhada por quem morreu", estilo Planta no escuro.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, medTxt, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N, ULT = N.TL.length;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(ULT) + 1.4;
const T = i => S(i) - 0.25;
const LINHAS = ['CASO 013 · ENDEREÇO DO ARQUIVISTA', 'PLANTA RECEBIDA PELO CORREIO · 2024'];
const LAPIS = '#4a4a4e';
const tag = (s, t0, t, big = false) => { if (t <= t0) return; if (big) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, s, 116, 242, (t - t0) / 0.6 * s.length, { tam: 40, cor: COR.osso, esp: 3 }); } else datilo(sb, s, 84, 242, (t - t0) / 0.6 * s.length, { tam: 32, cor: COR.osso, esp: 2 }); };

// a casa do Arquivista em planta (2D): 1 m = 64 px; x 0–8 (largura), z 0–10 (comprimento, frente embaixo)
const K = 64, OX = 540 - 4 * K, OY = 1500, X = x => OX + x * K, Y = z => OY - z * K;
const PAR = [[0, 0, 8, 0], [0, 10, 8, 10], [0, 0, 0, 10], [8, 0, 8, 10], [4, 0, 4, 10], [0, 5, 4, 5], [4, 4, 8, 4], [4, 5.5, 8, 5.5]];
function casa(c, t, t0, { cor = LAPIS, w = 2, x = 0, cotas = 0, vao = 0 } = {}) {
  PAR.forEach(([a, b, cc, d], i) => tinta(c, [[X(a), Y(b)], [X(cc), Y(d)]], prog(t, t0 + i * 0.08, 0.5), { w, cor, over: 8, seed: i + 1, wob: 0.4 }));
  const L = [['SALA', 2, 2.5], ['COZINHA', 2, 7.5], ['ESCRITÓRIO', 6, 2], ['QUARTO', 6, 7.8]];
  L.forEach(([s, xx, zz]) => { c.save(); c.globalAlpha = prog(t, t0 + 0.6, 0.4); c.fillStyle = cor; c.font = '22px Caneta'; c.textAlign = 'center'; c.fillText(s, X(xx), Y(zz)); c.restore(); });
  // mesa encostada na parede do fundo do escritório; estante
  riscos(c, [[[X(4.6), Y(3.95)], [X(7.4), Y(3.95)], [X(7.4), Y(3.2)], [X(4.6), Y(3.2)], [X(4.6), Y(3.95)]], [[X(7.6), Y(0.4)], [X(7.95), Y(0.4)], [X(7.95), Y(3.0)], [X(7.6), Y(3.0)], [X(7.6), Y(0.4)]]], { w: 1.4, cor, alpha: prog(t, t0 + 0.8, 0.4) });
  if (x > 0) { const cx = X(6), cy = Y(4.75); tinta(c, [[cx - 40, cy - 40], [cx + 40, cy + 40]], x, { cor: COR.verm, w: 4, over: 0 }); tinta(c, [[cx + 40, cy - 40], [cx - 40, cy + 40]], clamp(x * 2 - 1), { cor: COR.verm, w: 4, over: 0 }); }
  if (vao > 0) { c.save(); c.globalAlpha = vao; c.fillStyle = '#0d0b09'; c.fillRect(X(4) + 3, Y(5.5) + 3, 4 * K - 6, 1.5 * K - 6); riscos(c, Array.from({ length: 16 }, (_, i) => [[X(4) + i * 18, Y(4)], [X(4) + i * 18 + 60, Y(5.5)]].map(q => [Math.min(X(8), q[0]), q[1]])), { w: 1, cor: COR.verm, alpha: 0.6 }); c.restore(); medTxt(c, [X(6), Y(4.75) + 10], '1,50 m', { tam: 30, alinh: 'center', cor: VERM_TXT, alpha: vao }); }
  if (cotas > 0) { cota(c, [X(8) + 60, Y(0)], [X(8) + 60, Y(10)], cotas, '10,00', { cor: CLARO, w: 1.6, tam: 26, lado: -1 }); cota(c, [X(8) + 140, Y(0)], [X(8) + 140, Y(4)], clamp(cotas * 2 - 0.5), '4,00', { cor: COR.cinza, w: 1.4, tam: 24, lado: -1 }); cota(c, [X(8) + 140, Y(5.5)], [X(8) + 140, Y(10)], clamp(cotas * 2 - 1), '4,50', { cor: COR.cinza, w: 1.4, tam: 24, lado: -1 }); }
}
function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 }); fundo();
  g.save(); g.globalAlpha = 0.2; casa(g, t, 0.3, { cor: COR.osso }); g.restore();
  prancha(g, t, { linhas: LINHAS, folha: '13/13' });
  const s = 'ARQUIVO MORTO  ·  CASO 013'; datilo(g, s, W / 2, 690, (t - 0.45) / 0.65 * s.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'A PLANTA DESENHADA', 885, P(1, 'A planta')); titulo(g, t, 'POR QUEM MORREU', 1005, P(1, 'por quem'));
  g.restore();
  return { focos: [{ x: 540, y: 900, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}
const ENV = papelTex(820, 520, 21, '#d8c9a8');
function tomada2(t) {
  camera2D(t, W / 2, 960, 1.1, { amp: 4 }); fundo(); papel(g, ENV, 130, 700, { rot: -0.03 });
  g.save(); g.translate(130, 700); g.rotate(-0.03); riscos(g, [[[0, 0], [410, 260], [820, 0]]], { w: 2, cor: '#8a7a58' }); g.fillStyle = TINTA; g.font = '26px Maquina'; g.fillText('AO ARQUIVO MORTO', 260, 380); g.font = '22px MaquinaR'; g.fillText('remetente: —', 60, 470);
  g.save(); g.translate(660, 110); g.rotate(-0.2); g.strokeStyle = '#4a3a6a'; g.lineWidth = 3; g.globalAlpha = 0.85; g.beginPath(); g.arc(0, 0, 80, 0, 6.3); g.stroke(); g.fillStyle = '#4a3a6a'; g.font = '16px Maquina'; g.textAlign = 'center'; g.fillText('AG. CENTRAL', 0, -14); g.fillText('04/03/2024', 0, 14); g.restore(); g.restore();
  if (t > P(2, 'sem remetente')) circulo(g, 130 + 180, 700 + 462, 170, 34, easeInOut(prog(t, P(2, 'sem remetente'), 0.5)), { seed: 3 });
  g.restore(); tag('MARÇO DE 2024', S(2), t, true);
  return { focos: [{ x: 540, y: 960, r: 900 }], amb: 0.2, mult: 1 };
}
const VEG = papelTex(900, 1300, 31, '#dfe0d6');
function tomada3(t) {
  camera2D(t, W / 2, 1000, 1.0 + 0.12 * easeInOut(prog(t, S(4), 2.5)), { amp: 3 }); fundo();
  g.save(); g.globalAlpha = 0.92; papel(g, VEG, 90, 420); g.restore();
  casa(g, t, T(3) + 0.2, { cor: LAPIS });
  if (t > P(4, 'mesa')) circulo(g, X(6), Y(3.6), 140, 50, easeInOut(prog(t, P(4, 'mesa'), 0.5)), { seed: 5 });
  if (t > P(3, 'era a minha')) medTxt(g, [W / 2, 360], 'é a minha casa', { tam: 40, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(3, 'era a minha')) / 0.3) });
  g.restore(); tag('PAPEL VEGETAL · A LÁPIS', S(3), t);
  return { focos: [{ x: 540, y: 1100, r: 950 }], amb: 0.2, mult: 1 };
}
function tomada4(t) {
  camera2D(t, W / 2, lerp(1000, 820, easeInOut(prog(t, S(6) - 0.5, 0.8))), 1.05, { amp: 3 }); fundo(); g.save(); g.globalAlpha = 0.92; papel(g, VEG, 90, 420); g.restore();
  casa(g, t, -99, { cor: LAPIS, x: easeInOut(prog(t, P(5, 'X'), 0.4)) });
  const L4 = ['Ele mudou de casa.', 'Agora é a sua.', 'Ele bate porque sabe que você está acordado.', 'Não responda.     — A.'], ts = [P(6, 'Ele mudou'), P(6, 'Agora'), P(6, 'Ele bate'), P(6, 'Não responda')];
  g.save(); g.fillStyle = 'rgba(223,224,214,0.9)'; g.fillRect(100, 300, 880, 250); g.restore();
  L4.forEach((s, i) => escrita(g, s, 130, 350 + i * 56, (t - ts[i]) / (0.25 + s.length * 0.04), -0.08, { tam: 36, cor: LAPIS }));
  if (t > P(5, 'A.')) circulo(g, 130 + 360, 350 + 3 * 56 - 10, 50, 30, easeInOut(prog(t, P(5, 'A.'), 0.5)), { seed: 9 });
  g.restore(); tag('ATRÁS DA MESA', S(5), t);
  return { focos: [{ x: 540, y: t < S(6) ? 1100 : 700, r: 1000 }], amb: 0.2, mult: 1 };
}
const B1 = papelTex(480, 380, 41, '#f4eedf'), B2 = papelTex(480, 380, 42, '#dfe0d6');
function tomada5(t) {
  camera2D(t, W / 2, 960, 1.0, { amp: 3 }); fundo();
  papel(g, B1, 60, 560, { rot: -0.05 }); g.save(); g.translate(60, 560); g.rotate(-0.05); ['Não responda quando', 'ele bater. Ele só bate', 'porque sabe que você', 'está acordado.', '                 — A.'].forEach((l, i) => escrita(g, l, 30, 70 + i * 56, 1, -0.08, { tam: 34, cor: LAPIS })); g.restore();
  medTxt(g, [300, 1000], 'caso 001 · atrás do rodapé', { tam: 24, alinh: 'center', cor: COR.cinza });
  papel(g, B2, 540, 1100, { rot: 0.04, alpha: easeOut(prog(t, T(7) + 0.3, 0.4)) }); g.save(); g.translate(540, 1100); g.rotate(0.04); g.globalAlpha = easeOut(prog(t, T(7) + 0.3, 0.4)); ['Ele mudou de casa.', 'Agora é a sua.', 'Ele bate porque sabe', 'que você está acordado.', 'Não responda.     — A.'].forEach((l, i) => escrita(g, l, 30, 70 + i * 56, 1, -0.08, { tam: 34, cor: LAPIS })); g.restore();
  medTxt(g, [780, 1540], '2024 · pelo correio', { tam: 24, alinh: 'center', cor: COR.cinza });
  const tl = P(7, 'letra'); if (t > tl) { tinta(g, [[300, 560 + 290], [740, 1100 + 300]], prog(t, tl, 0.6), { cor: COR.verm, w: 3, over: 0 }); circulo(g, 300 + 40, 560 + 290, 60, 34, easeInOut(prog(t, tl, 0.5)), { seed: 2 }); circulo(g, 740 + 20, 1100 + 300, 60, 34, easeInOut(prog(t, tl + 0.3, 0.5)), { seed: 4 }); }
  g.restore(); tag('A MESMA LETRA', S(7), t);
  return { focos: [{ x: 540, y: 1000, r: 1000 }], amb: 0.2, mult: 1 };
}
const OBITO = papelTex(820, 520, 51);
function tomada6(t) {
  camera2D(t, W / 2, 960, 1.08, { amp: 4 }); fundo(); papel(g, OBITO, 130, 520, { rot: 0.015 });
  g.save(); g.translate(130, 520); g.rotate(0.015); g.fillStyle = TINTA; g.font = '32px Serifa'; g.fillText('Certidão de óbito', 50, 70); g.fillRect(50, 90, 720, 2); g.font = '25px MaquinaR'; ['Nome: AURORA ALVES · 63 anos · solteira', 'Falecida em 02/11/1997, em sua residência:', 'Rua das Acácias, 214.', 'Moradora do imóvel desde 1989.'].forEach((l, i) => g.fillText(l, 50, 160 + i * 52)); g.restore();
  circulo(g, 130 + 50 + 170, 520 + 160 - 8, 170, 30, easeInOut(prog(t, P(8, 'Aurora'), 0.5)), { seed: 5 }); circulo(g, 130 + 50 + 330, 520 + 212 - 8, 120, 30, easeInOut(prog(t, P(8, 'Morreu'), 0.5)), { seed: 7 });
  if (t > S(9)) { const y = 1300, x0 = 160, x1 = 920; tinta(g, [[x0, y], [x1, y]], prog(t, S(9), 0.6), { w: 2.4, over: 0 }); medTxt(g, [x0, y + 60], '1997', { tam: 36, alinh: 'center' }); medTxt(g, [x1, y + 60], '2024', { tam: 36, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - S(9) - 0.4) / 0.3) }); medTxt(g, [(x0 + x1) / 2, y - 30], '26 anos e meio depois', { tam: 32, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - S(9) - 0.8) / 0.3) }); }
  g.restore(); tag('CARTÓRIO DA CIDADE DO CASO 001', S(8), t);
  return { focos: [{ x: 540, y: 1000, r: 950 }], amb: 0.2, mult: 1 };
}
function tomada7(t) {
  camera2D(t, 600, 1000, 1.0, { amp: 3 }); fundo();
  casa(g, t, T(10), { cor: COR.osso, w: 2.4, cotas: clamp((t - P(10, 'Dez metros')) / 1.2), vao: clamp((t - P(11, 'Falta')) / 0.6) });
  if (t > P(10, 'Oito e meio')) medTxt(g, [W / 2, 360], '4,00 + 4,50 = 8,50', { tam: 44, alinh: 'center', cor: CLARO, alpha: clamp((t - P(10, 'Oito e meio')) / 0.3) });
  if (t > P(11, 'Atrás')) medTxt(g, [W / 2, 420], 'o mesmo 1,50 m da Rua das Acácias', { tam: 30, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(11, 'Atrás')) / 0.3) });
  g.restore(); tag('EU MEDI A MINHA CASA', S(10), t);
  return { focos: [{ x: 600, y: 1150, r: 950 }], amb: 0.2, mult: 1 };
}
// o escritório à noite: as batidas
function batidas(cx, cy, t0, t, cor = COR.osso, lado = -1) {
  for (let i = 0; i < 3; i++) { const tt = t - t0 - i * 0.55; if (tt < 0 || tt > 0.8) continue; const f = tt / 0.8; g.save(); g.globalAlpha = 1 - f; g.strokeStyle = cor; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 30 + f * 200, lado > 0 ? -0.9 : Math.PI - 0.9, lado > 0 ? 0.9 : Math.PI + 0.9); g.stroke(); g.restore(); }
}
function tomada8(t) {
  camera2D(t, W / 2, 1050, 1.0 + 0.06 * easeInOut(prog(t, T(12), 6)), { amp: 2.5 }); fundo();
  const Yp = 1500, Xp = 860; tinta(g, [[40, Yp], [1040, Yp]], 1, { w: 2.6, over: 0 }); tinta(g, [[Xp, 380], [Xp, Yp]], 1, { w: 3, over: 0 }); g.fillStyle = '#120f0c'; g.fillRect(Xp, 380, 1080 - Xp, Yp - 380); riscos(g, Array.from({ length: 30 }, (_, i) => [[Xp, 400 + i * 40], [1080, 360 + i * 40]]), { w: 1, alpha: 0.2 });
  medTxt(g, [970, 360], '1,50 m', { tam: 24, alinh: 'center', cor: COR.cinza });
  // mesa, cadeira, luminária, papéis
  riscos(g, [[[380, 1180], [840, 1180]], [[400, 1180], [400, Yp]], [[820, 1180], [820, Yp]]], { w: 3 }); riscos(g, [[[230, Yp], [240, 1250], [330, 1250], [340, Yp]], [[240, 1250], [230, 1000]]], { w: 2.6 });
  g.fillStyle = '#efe9da'; g.fillRect(500, 1160, 160, 20); riscos(g, [[[760, 1180], [760, 1040], [700, 1000]]], { w: 2.4 }); g.fillStyle = '#ffd690'; g.beginPath(); g.moveTo(670, 990); g.lineTo(730, 990); g.lineTo(700, 1030); g.closePath(); g.fill();
  // furo do tamanho de uma moeda, na altura de quem está sentado
  g.fillStyle = '#000'; g.beginPath(); g.arc(Xp, 1150, 6, 0, 6.3); g.fill();
  const tb = P(12, 'três batidas'); if (t > tb) batidas(Xp - 10, 1150, tb, t, COR.osso, -1);
  if (t > P(12, 'três e dois')) medTxt(g, [W / 2, 520], '03:02', { tam: 90, alinh: 'center', cor: CLARO, alpha: clamp((t - P(12, 'três e dois')) / 0.3) });
  if (t > S(13)) medTxt(g, [W / 2, 640], 'nunca respondi', { tam: 36, alinh: 'center', cor: COR.cinza, alpha: clamp((t - S(13)) / 0.4) * (t < S(14) ? 1 : 0.3) });
  // até esta noite: a resposta, deste lado (vermelho), e logo depois a do outro lado
  const ta = S(14); if (t > ta) { batidas(Xp - 10, 1150, ta + 0.3, t, COR.verm, 1); batidas(Xp - 10, 1150, ta + 2.0, t, COR.osso, -1); }
  g.restore(); tag('ABRIL DE 2024  ·  03:02', S(12), t);
  const tr = t > S(14) ? Math.max(0.3, 1 - (t - S(14)) * 0.3) : 1;
  return { focos: [{ x: 700, y: 1050, r: 700, i: 0.8, cor: [255, 214, 150] }], amb: 0.1, mult: tr };
}
const tomadaFim = t => cartaoFinal(t, T(ULT), N, 13, { linhas: LINHAS });
const LEG = [
  [2, 'Este envelope não veio de um leitor. Chegou para mim, o Arquivista, sem remetente.', { 'sem remetente': VERM_TXT }],
  [3, 'Dentro, a planta de uma casa, desenhada a lápis. Eu levei uma noite para entender que era a minha.', { 'era a minha': VERM_TXT }],
  [4, 'Estava tudo lá. Até a minha mesa, no escritório onde ninguém de fora jamais entrou.', { 'ninguém de fora jamais entrou': VERM_TXT }],
  [5, 'Atrás da mesa, a pessoa desenhou um X. E, embaixo, quatro linhas assinadas com uma letra só: A.', { 'um X': VERM_TXT, 'A.': VERM_TXT }],
  [6, '"Ele mudou de casa. Agora é a sua. Ele bate porque sabe que você está acordado. Não responda."', { 'Agora é a sua.': VERM_TXT }],
  [7, 'Eu conheço essa letra. É a do bilhete do caso 1, achado atrás de um rodapé.', { 'caso 1': CLARO }],
  [8, 'No cartório descobri: a mulher que assinava A. se chamava Aurora Alves. Morreu em 1997.', { 'Morreu em 1997.': VERM_TXT }],
  [9, 'A planta chegou em 2024.', { '2024.': VERM_TXT }],
  [10, 'Eu medi a minha casa. 10 metros por fora. 8,5 por dentro.', { '8,5 por dentro': CLARO }],
  [11, 'Falta 1,5 metro. Atrás da minha mesa.', { 'Atrás da minha mesa.': VERM_TXT }],
  [12, 'Desde abril, às 3h02 da manhã, eu ouço três batidas na parede. Na altura de quem está sentado.', { 'três batidas': VERM_TXT }],
  [13, 'Eu nunca respondi.', {}],
  [14, 'Até esta noite.', { 'Até esta noite.': VERM_TXT }],
];
rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(3), tomada3], [T(5), tomada4], [T(7), tomada5], [T(8), tomada6], [T(10), tomada7], [T(12), tomada8], [T(ULT), tomadaFim]], legendasFn: legendas(N, LEG) });
