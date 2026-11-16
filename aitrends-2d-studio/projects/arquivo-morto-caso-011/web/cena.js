// Caso 011 — "O sótão que respira", estilo Planta no escuro.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, medTxt, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N, ULT = N.TL.length;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(ULT) + 1.4;
const T = i => S(i) - 0.25;
const LINHAS = ['CASO 011 · RUA PIRATININGA, 233', 'CORTE DO CORREDOR E DO SÓTÃO'];
const MEL = '#d99a2a', AMBAR = [255, 178, 90];
const tag = (s, t0, t, big = false) => { if (t <= t0) return; if (big) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, s, 116, 242, (t - t0) / 0.6 * s.length, { tam: 40, cor: COR.osso, esp: 3 }); } else datilo(sb, s, 84, 242, (t - t0) / 0.6 * s.length, { tam: 32, cor: COR.osso, esp: 2 }); };
function hexes(c, x0, y0, x1, y1, r, k, { cor = MEL, alpha = 0.6 } = {}) {
  const l = [], h = r * Math.sqrt(3); let n = 0;
  for (let y = y0, row = 0; y < y1; y += h * 0.5, row++) for (let x = x0 + (row % 2) * r * 1.5; x < x1; x += r * 3) { n++; if ((n * 37 % 100) / 100 > k) continue; l.push(Array.from({ length: 7 }, (_, i) => [x + Math.cos(i / 6 * 6.283) * r, y + Math.sin(i / 6 * 6.283) * r])); }
  riscos(c, l, { w: 1.4, cor, alpha });
}
// corte: telhado, sótão, laje/forro, corredor, alçapão
function corte(t, { respira = 0, parafusos = 0, colmeia = 0, mancha = 0, gotas = 0 } = {}) {
  fundo();
  const Yf = 940, Yc = 1560;   // forro (teto do corredor) e piso
  tinta(g, [[60, Yf - 40], [540, 360], [1020, Yf - 40]], 1, { w: 2.6, over: 10 }); riscos(g, Array.from({ length: 12 }, (_, i) => [[60 + i * 40, Yf - 40 - i * 48], [80 + i * 40, Yf - 30 - i * 48]]).concat(Array.from({ length: 12 }, (_, i) => [[1020 - i * 40, Yf - 40 - i * 48], [1000 - i * 40, Yf - 30 - i * 48]])), { w: 1.2, alpha: 0.5 });
  medTxt(g, [540, 620], 'SÓTÃO', { tam: 30, alinh: 'center', cor: COR.cinza });
  if (colmeia > 0) { g.save(); g.beginPath(); g.moveTo(80, Yf - 50); g.lineTo(540, 380); g.lineTo(1000, Yf - 50); g.closePath(); g.clip(); hexes(g, 100, 420, 1000, Yf - 50, 14, colmeia); g.restore(); }
  g.fillStyle = '#2a2219'; g.fillRect(60, Yf - 40, 960, 40); tinta(g, [[60, Yf - 40], [1020, Yf - 40]], 1, { w: 2.4, over: 0 }); tinta(g, [[60, Yf], [1020, Yf]], 1, { w: 2.4, over: 0 });
  // o alçapão: uma tampa de madeira que sobe e desce 1–2 mm
  const dy = respira * Math.sin(t * 1.4) * 5; g.fillStyle = '#5a3e26'; g.fillRect(430, Yf - 40 + dy, 220, 40); tinta(g, [[430, Yf - 40 + dy], [650, Yf - 40 + dy], [650, Yf + dy], [430, Yf + dy], [430, Yf - 40 + dy]], 1, { w: 2, over: 0, cor: '#e0b080' });
  if (parafusos > 0) [[445, Yf - 50], [635, Yf - 50]].forEach(([x, y]) => { g.fillStyle = '#c9c3b2'; g.beginPath(); g.arc(x, y + dy, 8, 0, 6.3); g.fill(); circulo(g, x, y + dy, 26, 22, parafusos, { seed: x }); });
  if (respira > 0) { for (let i = 0; i < 3; i++) { const f = (t * 0.7 + i / 3) % 1, a = Math.sin(t * 1.4) > 0 ? 1 : -1; riscos(g, [[[470 + i * 70, Yf + 10 + a * f * 60], [480 + i * 70, Yf + 30 + a * f * 60]]], { w: 2, cor: CLARO, alpha: 0.5 * (1 - f) * respira }); } }
  // paredes e piso do corredor
  tinta(g, [[60, Yf], [60, Yc]], 1, { w: 2.4, over: 0 }); tinta(g, [[1020, Yf], [1020, Yc]], 1, { w: 2.4, over: 0 }); tinta(g, [[60, Yc], [1020, Yc]], 1, { w: 2.6, over: 0 }); medTxt(g, [540, Yc - 40], 'CORREDOR', { tam: 28, alinh: 'center', cor: COR.cinza });
  if (mancha > 0) { const gr = g.createRadialGradient(800, Yf + 8, 4, 800, Yf + 8, 160 * mancha); gr.addColorStop(0, 'rgba(217,154,42,0.75)'); gr.addColorStop(1, 'rgba(217,154,42,0)'); g.fillStyle = gr; g.fillRect(620, Yf, 360, 200); }
  if (gotas > 0) for (let i = 0; i < 3; i++) { const f = (t * 0.5 + i / 3) % 1; g.fillStyle = MEL; g.beginPath(); g.ellipse(800, Yf + 20 + f * (Yc - Yf - 40), 7, 11, 0, 0, 6.3); g.fill(); }
  return { Yf, Yc };
}
function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 }); fundo();
  g.save(); g.globalAlpha = 0.25; hexes(g, 200, 1150, 880, 1650, 18, prog(t, 0.3, 2.5)); g.restore();
  prancha(g, t, { linhas: LINHAS, folha: '11/13' });
  const s = 'ARQUIVO MORTO  ·  CASO 011'; datilo(g, s, W / 2, 690, (t - 0.45) / 0.65 * s.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'O SÓTÃO', 885, P(1, 'O sótão')); titulo(g, t, 'QUE RESPIRA', 1005, P(1, 'respira'));
  g.restore();
  return { focos: [{ x: 540, y: 900, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}
const EDITAL = papelTex(820, 640, 21), CARTAZ = papelTex(520, 680, 22, '#e6dcc0');
function tomada2(t) {
  camera2D(t, W / 2, 960, 1.08, { amp: 4 }); fundo();
  papel(g, EDITAL, 130, 400, { rot: -0.015 }); g.save(); g.translate(130, 400); g.rotate(-0.015); g.fillStyle = TINTA; g.font = '40px Serifa'; g.fillText('Edital de Leilão', 50, 80); g.font = '20px Maquina'; g.fillText('Banco · 2ª praça · 2022', 50, 114); g.fillRect(50, 130, 720, 2);
  g.font = '25px MaquinaR'; ['Imóvel: Rua Piratininga, 233.', 'Casa com sótão. Fechada desde 2009.', 'Ocupante anterior: Nestor Vieira', '(desaparecido). Venda no estado.'].forEach((l, i) => g.fillText(l, 50, 200 + i * 50)); g.restore();
  circulo(g, 130 + 50 + 250, 400 + 250 - 8, 250, 30, easeInOut(prog(t, P(2, 'treze anos'), 0.5)), { seed: 4 });
  if (t > S(3)) { papel(g, CARTAZ, 320, 1050, { rot: 0.04, alpha: clamp((t - S(3)) / 0.4) }); g.save(); g.translate(320, 1050); g.rotate(0.04); g.globalAlpha = clamp((t - S(3)) / 0.4); g.fillStyle = TINTA; g.font = '54px Serifa'; g.textAlign = 'center'; g.fillText('PROCURA-SE', 260, 90); g.fillStyle = '#9a8f78'; g.fillRect(150, 130, 220, 260); g.fillStyle = '#2a241c'; g.beginPath(); g.ellipse(260, 220, 50, 62, 0, 0, 6.3); g.fill(); g.fillRect(200, 290, 120, 100); g.fillStyle = TINTA; g.font = '26px Maquina'; g.fillText('NESTOR VIEIRA · 67 ANOS', 260, 450); g.font = '22px MaquinaR'; g.fillText('apicultor · desde 14/09/2009', 260, 490); g.restore(); }
  g.restore(); tag('2022  ·  LEILÃO DO BANCO', S(2), t, true);
  return { focos: [{ x: 540, y: t < S(3) ? 760 : 1200, r: 950 }], amb: 0.2, mult: 1 };
}
function tomada3(t) {
  camera2D(t, W / 2, 1000, 1.0 + 0.15 * easeInOut(prog(t, T(4), 2.5)), { amp: 3 });
  const r = corte(t, { respira: clamp((t - P(5, 'alçapão se mexia')) / 0.5), parafusos: easeInOut(prog(t, P(4, 'parafusos'), 0.5)) });
  const tn = P(4, 'nenhum parafuso'); if (t > tn) { medTxt(g, [540, r.Yf + 110], 'embaixo: nenhum parafuso', { tam: 30, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - tn) / 0.3) }); medTxt(g, [540, r.Yf - 90], 'os parafusos estão do lado de cima', { tam: 26, alinh: 'center', cor: CLARO, alpha: clamp((t - tn - 0.4) / 0.3) }); }
  const ts = P(5, 'som grave'); if (t > ts) for (let i = 0; i < 4; i++) { const f = (t * 0.6 + i / 4) % 1; g.save(); g.globalAlpha = 0.5 * (1 - f); g.strokeStyle = MEL; g.lineWidth = 2; g.beginPath(); g.arc(540, 700, 60 + f * 260, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); g.restore(); }
  if (t > P(5, 'Entrava')) medTxt(g, [540, r.Yf + 170], 'entra ar · sai ar', { tam: 30, alinh: 'center', cor: CLARO, alpha: clamp((t - P(5, 'Entrava')) / 0.3) });
  g.restore(); tag(t < S(5) ? 'O ALÇAPÃO DO CORREDOR' : 'INVERNO', t < S(5) ? S(4) : S(5), t);
  return { focos: [{ x: 540, y: 900, r: 950 }], amb: 0.18, mult: 1 };
}
// termômetros: lá fora × sótão
function termometro(x, y, h, v, max, cor, rot, k) {
  if (k <= 0) return; g.save(); g.globalAlpha = k; g.strokeStyle = COR.osso; g.lineWidth = 3; g.beginPath(); g.roundRect(x - 22, y - h, 44, h, 22); g.stroke(); g.beginPath(); g.arc(x, y + 20, 36, 0, 6.3); g.stroke();
  g.fillStyle = cor; g.beginPath(); g.arc(x, y + 20, 28, 0, 6.3); g.fill(); const hh = h * clamp(v / max) * k; g.fillRect(x - 12, y - hh, 24, hh + 10); g.restore();
  medTxt(g, [x, y + 110], rot, { tam: 26, alinh: 'center', cor: COR.cinza, alpha: k }); medTxt(g, [x, y - h - 30], `${v} °C`, { tam: 48, alinh: 'center', cor: cor === MEL ? VERM_TXT : CLARO, alpha: k });
}
function tomada4(t) {
  camera2D(t, W / 2, 960, 1.0, { amp: 3 }); fundo();
  termometro(320, 1150, 520, 8, 40, '#9fc3ff', 'lá fora', easeOut(prog(t, P(6, 'Lá fora'), 0.4)));
  termometro(760, 1150, 520, 35, 40, MEL, 'no sótão', easeOut(prog(t, P(6, 'No sótão'), 0.4)));
  const td = P(6, 'Dia e noite'); if (t > td) { const x0 = 160, x1 = 920, y = 1440; riscos(g, [[[x0, y], [x1, y]]], { w: 1.4, alpha: 0.6 }); riscos(g, [Array.from({ length: 40 }, (_, i) => [lerp(x0, x1, i / 39), y - 40 - 30 * Math.sin(i / 39 * 6.283 * 4)])], { w: 2.4, cor: '#9fc3ff', alpha: clamp((t - td) / 0.5) }); riscos(g, [[[x0, y - 150], [x1, y - 150]]], { w: 3, cor: MEL, alpha: clamp((t - td) / 0.5) }); medTxt(g, [x1, y - 170], '35 °C, sempre', { tam: 26, alinh: 'right', cor: VERM_TXT, alpha: clamp((t - td) / 0.5) }); }
  if (t > S(7)) { medTxt(g, [W / 2, 450], 'sem tomada · sem fio · sem aquecedor', { tam: 34, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - S(7)) / 0.4) }); }
  g.restore(); tag('JULHO DE 2022  ·  MEDIÇÕES', S(6), t);
  return { focos: [{ x: 540, y: 950, r: 1000 }], amb: 0.2, mult: 1 };
}
const LAUDO = papelTex(820, 440, 31);
function tomada5(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 });
  const r = corte(t, { mancha: clamp((t - S(8)) / 1.5), gotas: t > P(8, 'pingar') ? 1 : 0 });
  if (t > P(8, 'âmbar')) medTxt(g, [800, r.Yf + 300], 'cor de âmbar · cheiro doce', { tam: 26, alinh: 'center', cor: MEL, alpha: clamp((t - P(8, 'âmbar')) / 0.3) });
  if (t > S(9) - 0.2) { const k = easeOut(prog(t, S(9) - 0.2, 0.4)); papel(g, LAUDO, 130, 380, { rot: 0.01, alpha: k }); g.save(); g.translate(130, 380); g.rotate(0.01); g.globalAlpha = k; g.fillStyle = TINTA; g.font = '30px Serifa'; g.fillText('Laudo do laboratório', 50, 70); g.font = '24px MaquinaR'; ['Amostra 1 (gota): MEL de abelha', 'Apis mellifera, com cera e pólen.', 'Amostra 2 (forro): madeira com', 'mel e própolis.'].forEach((l, i) => g.fillText(l, 50, 150 + i * 50)); g.restore(); circulo(g, 130 + 50 + 270, 380 + 150 - 8, 130, 30, easeInOut(prog(t, P(9, 'mel'), 0.5)), { seed: 5 }); }
  g.restore(); tag(t < S(9) ? 'AGOSTO  ·  O TETO DO QUARTO' : 'LABORATÓRIO', t < S(9) ? S(8) : S(9), t);
  return { focos: [{ x: t < S(9) ? 800 : 540, y: t < S(9) ? 1100 : 560, r: 900 }], amb: 0.18, mult: 1 };
}
function tomada6(t) {
  camera2D(t, W / 2, 960, 1.0, { amp: 3 }); fundo();
  // a caixa de abelhas e a injeção
  const bx = 330, by = 1000; tinta(g, [[bx - 170, by], [bx + 170, by], [bx + 170, by + 300], [bx - 170, by + 300], [bx - 170, by]], prog(t, T(10), 0.6), { w: 2.6, over: 6 }); riscos(g, [[[bx - 190, by - 20], [bx + 190, by - 20]], [[bx - 170, by + 100], [bx + 170, by + 100]], [[bx - 170, by + 200], [bx + 170, by + 200]], [[bx - 40, by + 290], [bx + 40, by + 290]]], { w: 2, alpha: prog(t, T(10) + 0.3, 0.4) });
  medTxt(g, [bx, by + 370], 'caixa 3', { tam: 26, alinh: 'center', cor: COR.cinza });
  const ti = P(10, 'injeção'); if (t > ti - 0.3) { const k = easeOut(prog(t, ti - 0.3, 0.4)); g.save(); g.translate(760, 1100); g.rotate(-0.5); g.globalAlpha = k; g.fillStyle = '#d9d2c2'; g.beginPath(); g.roundRect(-40, -170, 80, 300, 20); g.fill(); g.fillStyle = '#d97a2a'; g.fillRect(-40, 80, 80, 50); g.fillStyle = TINTA; g.font = '20px Maquina'; g.textAlign = 'center'; g.save(); g.rotate(Math.PI / 2); g.fillText('ADRENALINA', -20, 8); g.restore(); g.restore(); medTxt(g, [760, 1380], 'sempre no bolso', { tam: 28, alinh: 'center', cor: VERM_TXT, alpha: k }); }
  if (t > P(10, 'alérgico')) medTxt(g, [W / 2, 520], 'APICULTOR  ·  ALÉRGICO', { tam: 48, alinh: 'center', cor: CLARO, alpha: clamp((t - P(10, 'alérgico')) / 0.3) });
  // abelhas voando
  const r = rng(3); for (let i = 0; i < 18; i++) { const x = bx + Math.sin(t * (1 + r()) + i) * 220, y = by - 150 + Math.cos(t * (1.3 + r()) + i * 2) * 120; g.fillStyle = MEL; g.beginPath(); g.ellipse(x, y, 7, 4, 0, 0, 6.3); g.fill(); }
  g.restore(); tag('SEU NESTOR', S(10), t);
  return { focos: [{ x: 540, y: 1000, r: 950 }], amb: 0.2, mult: 1 };
}
const CAD = papelTex(840, 620, 41, '#ece4cf');
function tomada7(t) {
  camera2D(t, W / 2, 960, 1.08, { amp: 4 }); fundo();
  papel(g, CAD, 120, 380, { rot: -0.02 }); g.save(); g.translate(120, 380); g.rotate(-0.02); riscos(g, Array.from({ length: 9 }, (_, i) => [[0, 90 + i * 62], [840, 90 + i * 62]]), { w: 1.2, cor: '#7f9cc2', alpha: 0.55 });
  escrita(g, '02/09 — O enxame da caixa 3 fugiu.', 40, 140, 1, -0.08, { tam: 36, cor: TINTA, alpha: 0.6 }); escrita(g, '10/09 — Zumbido no forro.', 40, 202, 1, -0.08, { tam: 36, cor: TINTA, alpha: 0.6 });
  escrita(g, '13/09 — Amanhã subo no forro.', 40, 326, (t - P(11, 'amanhã')) / 0.9, -0.08, { tam: 40, cor: TINTA }); escrita(g, 'Vou parafusar o alçapão por dentro.', 40, 388, (t - P(11, 'Vou parafusar')) / 1.1, -0.08, { tam: 40, cor: TINTA });
  g.restore();
  if (t > S(12) - 0.2) { const k = easeOut(prog(t, S(12) - 0.2, 0.4)); g.save(); g.translate(560, 1250); g.rotate(0.05); g.globalAlpha = k; g.fillStyle = '#e6dcc0'; g.fillRect(-300, -200, 600, 400); g.fillStyle = TINTA; g.font = '50px Serifa'; g.textAlign = 'center'; g.fillText('PROCURA-SE', 0, -110); g.font = '26px MaquinaR'; g.fillText('Visto pela última vez', 0, -10); g.font = '34px Maquina'; g.fillText('em 14/09/2009, em casa.', 0, 40); g.restore(); tinta(g, [[480, 840], [520, 1240]], prog(t, P(12, 'no dia seguinte'), 0.4), { cor: COR.verm, w: 3, over: 0 }); medTxt(g, [700, 1060], 'um dia depois', { tam: 30, cor: VERM_TXT, alpha: clamp((t - P(12, 'no dia seguinte')) / 0.3) }); }
  g.restore(); tag('O CADERNO DE APICULTURA', S(11), t);
  return { focos: [{ x: 540, y: t < S(12) ? 700 : 1100, r: 950 }], amb: 0.2, mult: 1 };
}
function tomada8(t) {
  camera2D(t, W / 2, 900, 1.0 + 0.1 * easeInOut(prog(t, T(13), 4)), { amp: 3 });
  const r = corte(t, { parafusos: 1, colmeia: clamp((t - P(13, 'parafusado')) / 2.0) * 0.8, respira: 0.6 });
  if (t > S(13)) carimbo(g, 540, r.Yf + 220, clamp((t - P(13, 'não subiu')) / 0.12), 'NÃO VERIFICADO', { larg: 620, rot: -0.08 });
  g.restore(); tag('PROCESSO  ·  2009', S(13), t);
  return { focos: [{ x: 540, y: 760, r: 900, cor: AMBAR, i: 0.9 }], amb: 0.16, mult: 1 };
}
const tomadaFim = t => cartaoFinal(t, T(ULT), N, 11, { linhas: LINHAS });
const LEG = [
  [2, 'Em 2022, o Tiago comprou uma casa num leilão. Fechada havia 13 anos.', { '13 anos': CLARO }],
  [3, 'O dono anterior, seu Nestor, tinha desaparecido em 2009.', { 'desaparecido': VERM_TXT }],
  [4, 'No teto do corredor há um alçapão. Preso com parafusos. Mas nenhum parafuso do lado de baixo.', { 'nenhum parafuso do lado de baixo': VERM_TXT }],
  [5, 'No inverno, um som grave vinha do teto. E o alçapão se mexia. Entrava ar, saía ar.', { 'o alçapão se mexia': VERM_TXT }],
  [6, 'O Tiago passou um termômetro pela fresta. Lá fora, 8 graus. No sótão, 35. Dia e noite.', { 'No sótão, 35.': VERM_TXT }],
  [7, 'O sótão não tem tomada nem fio. Nenhum aquecedor.', {}],
  [8, 'Em agosto, o teto do quarto começou a pingar. Uma gota grossa, cor de âmbar, com cheiro doce.', { 'cor de âmbar': VERM_TXT }],
  [9, 'O laboratório respondeu: mel.', { 'mel.': VERM_TXT }],
  [10, 'Seu Nestor era apicultor. E alérgico. Andava com uma injeção no bolso.', { 'apicultor': CLARO, 'alérgico': VERM_TXT }],
  [11, 'A última anotação do caderno dele: "amanhã subo no forro. Vou parafusar o alçapão por dentro."', { '"amanhã subo no forro. Vou parafusar o alçapão por dentro."': CLARO }],
  [12, 'O cartaz de procura-se diz que ele foi visto pela última vez no dia seguinte. Em casa.', { 'no dia seguinte': VERM_TXT }],
  [13, 'A polícia não subiu. O alçapão estava parafusado pelo lado de cima.', { 'pelo lado de cima': VERM_TXT }],
];
rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(4), tomada3], [T(6), tomada4], [T(8), tomada5], [T(10), tomada6], [T(11), tomada7], [T(13), tomada8], [T(ULT), tomadaFim]], legendasFn: legendas(N, LEG) });
