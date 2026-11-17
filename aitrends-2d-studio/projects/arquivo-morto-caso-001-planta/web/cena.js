// Caso 001 — "A casa que sobra", estilo Planta no escuro.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, narracao, legendas, medTxt, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N, ULT = N.TL.length;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(ULT) + 1.4;
const T = i => S(i) - 0.25;
const LINHAS = ['CASO 001 · RUA DAS ACÁCIAS, 214', 'PLANTA BAIXA (PREFEITURA)'];
const LAPIS = '#4a4a4e';
const tag = (s, t0, t, big = false) => { if (t <= t0) return; if (big) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, s, 116, 242, (t - t0) / 0.6 * s.length, { tam: 40, cor: COR.osso, esp: 3 }); } else datilo(sb, s, 84, 242, (t - t0) / 0.6 * s.length, { tam: 32, cor: COR.osso, esp: 2 }); };

// planta (2D, de cima): 1 m = 70 px; x 0–7 (largura), z 0–12 (comprimento, frente embaixo)
const K = 70, OX = 540 - 3.5 * K, OY = 1450, X = x => OX + x * K, Y = z => OY - z * K;
const PAR = [[0, 0, 7, 0], [0, 12, 7, 12], [0, 0, 0, 12], [7, 0, 7, 12], [3.5, 0, 3.5, 12], [0, 6, 3.5, 6], [3.5, 3.5, 7, 3.5], [3.5, 7.5, 7, 7.5], [3.5, 9, 7, 9]];
const ROT = [['SALA', 1.75, 3], ['QUARTO DOS PAIS', 1.75, 9], ['COZINHA', 5.25, 1.75], ['QUARTO', 5.25, 5.5], ['BANHEIRO', 5.25, 10.5]];
function planta(c, t, t0, { cor = COR.osso, destaque = 0, grossa = 0, cotas = 0, vao = 0, cama = 0, rotulos = true } = {}) {
  PAR.forEach(([a, b, cc, d], i) => tinta(c, [[X(a), Y(b)], [X(cc), Y(d)]], prog(t, t0 + i * 0.07, 0.5), { w: 2.6, cor, over: 10, seed: i + 1 }));
  if (rotulos) ROT.forEach(([s, x, z], i) => medTxt(c, [X(x), Y(z)], s, { tam: i === 3 && destaque ? 30 : 22, alinh: 'center', cor: i === 3 && destaque ? CLARO : COR.cinza, alpha: prog(t, t0 + 0.6, 0.4) }));
  if (destaque > 0) { c.save(); c.globalAlpha = 0.2 * destaque; c.fillStyle = '#f2d39a'; c.fillRect(X(3.5), Y(7.5), 3.5 * K, 4 * K); c.restore(); }
  if (cama > 0) { riscos(c, [[[X(4.0), Y(7.4)], [X(5.0), Y(7.4)], [X(5.0), Y(5.4)], [X(4.0), Y(5.4)], [X(4.0), Y(7.4)]], [[X(4.1), Y(7.3)], [X(4.9), Y(7.3)], [X(4.9), Y(6.9)], [X(4.1), Y(6.9)], [X(4.1), Y(7.3)]]], { w: 1.6, alpha: cama }); }
  if (grossa > 0) { c.save(); c.globalAlpha = grossa; c.fillStyle = '#d8ccb2'; c.fillRect(X(3.5), Y(9), 3.5 * K, 1.5 * K); riscos(c, Array.from({ length: 22 }, (_, i) => [[X(3.5) + i * 12, Y(7.5)], [X(3.5) + i * 12 + 60, Y(9)]].map(q => [Math.min(X(7), q[0]), q[1]])), { w: 1, cor: '#5a5040', alpha: 0.8 }); c.restore(); }
  if (vao > 0) { c.save(); c.globalAlpha = vao; c.fillStyle = '#0d0b09'; c.fillRect(X(3.5) + 3, Y(9) + 3, 3.5 * K - 6, 1.5 * K - 6); c.restore(); medTxt(c, [X(5.25), Y(8.25) + 12], '1,50 m ?', { tam: 32, alinh: 'center', cor: VERM_TXT, alpha: vao }); }
  if (cotas > 0) {
    cota(c, [X(7) + 70, Y(0)], [X(7) + 70, Y(12)], clamp(cotas * 1.5), '12,00', { cor: CLARO, w: 1.8, tam: 28, lado: -1 });
    cota(c, [X(7) + 150, Y(0)], [X(7) + 150, Y(3.5)], clamp(cotas * 2 - 0.4), '3,50', { cor: COR.cinza, w: 1.4, tam: 24, lado: -1 });
    cota(c, [X(7) + 150, Y(3.5)], [X(7) + 150, Y(7.5)], clamp(cotas * 2 - 0.7), '4,00', { cor: COR.cinza, w: 1.4, tam: 24, lado: -1 });
    cota(c, [X(7) + 150, Y(9)], [X(7) + 150, Y(12)], clamp(cotas * 2 - 1.0), '3,00', { cor: COR.cinza, w: 1.4, tam: 24, lado: -1 });
  }
}
function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 }); fundo();
  g.save(); g.globalAlpha = 0.14; planta(g, t, 0.3, { rotulos: false }); g.restore();
  prancha(g, t, { linhas: LINHAS, folha: '01/13' });
  const s = 'ARQUIVO MORTO  ·  CASO 001'; datilo(g, s, W / 2, 690, (t - 0.45) / 0.65 * s.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'A CASA', 885, P(1, 'A casa')); titulo(g, t, 'QUE SOBRA', 1005, P(1, 'que sobra'));
  const pr = prog(t, P(1, 'sobra') + 0.2, 0.6); if (pr > 0) { cota(g, [300, 1100], [780, 1100], pr, null, { cor: COR.verm, w: 3 }); if (pr >= 1) { g.fillStyle = COR.verm; g.fillRect(700, 1088, 80, 24); } }
  g.restore();
  return { focos: [{ x: 540, y: 950, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}
// a casa térrea, de frente
function tomada2(t) {
  camera2D(t, W / 2, 1000, 1.0 + 0.06 * easeInOut(prog(t, T(2), 6)), { amp: 4 }); fundo();
  const p = k => prog(t, T(2) + k, 0.6), L = (pts, k, o = {}) => tinta(g, pts, p(k), { w: 2.4, ...o });
  L([[60, 1300], [1020, 1300]], 0, { over: 0 }); L([[120, 1300], [120, 900], [960, 900], [960, 1300]], 0.2); L([[90, 910], [540, 720], [990, 910]], 0.5);
  const tij = []; for (let y = 920; y < 1300; y += 30) for (let x = 130 + ((y / 30) % 2) * 30; x < 950; x += 60) tij.push([[x, y], [x + 50, y]]); riscos(g, tij, { w: 1, alpha: 0.12 * p(0.6) });
  [[200, 960], [400, 960], [640, 960], [800, 960]].forEach(([x, y], i) => { if (i === 2) L([[x, 1300], [x, 1040], [x + 110, 1040], [x + 110, 1300]], 0.7 + i * 0.1, { w: 1.8 }); else L([[x, y], [x + 120, y], [x + 120, y + 130], [x, y + 130], [x, y]], 0.7 + i * 0.1, { w: 1.8 }); });
  medTxt(g, [540, 1380], 'RUA DAS ACÁCIAS, 214', { tam: 40, alinh: 'center', cor: CLARO, alpha: p(1.0) });
  cota(g, [120, 1450], [960, 1450], p(1.2), '12,00 m', { cor: COR.cinza, w: 1.4, tam: 26, lado: 1 });
  const tb = P(2, 'Barata'); if (t > tb) carimbo(g, 540, 640, clamp((t - tb) / 0.12), 'BARATA DEMAIS', { larg: 560, rot: -0.1 });
  g.restore(); tag('2009  ·  A MUDANÇA', S(2), t, true);
  return { focos: [{ x: 540, y: 1050, r: 950 }], amb: 0.2, mult: 1 };
}
// a planta: o quarto do meio, a parede grossa
function tomada3(t) {
  camera2D(t, W / 2, 1040, 1.0 + 0.1 * easeInOut(prog(t, S(4), 2.5)), { amp: 3 }); fundo();
  planta(g, t, T(3), { destaque: clamp((t - P(3, 'quarto do meio')) / 0.4), grossa: clamp((t - P(4, 'mais grossa')) / 0.5), cama: clamp((t - P(3, 'quarto do meio')) / 0.4) });
  const tg = P(4, 'mais grossa'); if (t > tg) { tinta(g, [[X(7) - 20, Y(8.25)], [X(7) + 60, Y(8.25) - 200], [X(7) + 120, Y(8.25) - 200]], prog(t, tg, 0.4), { cor: COR.verm, w: 2, over: 0 }); medTxt(g, [X(7) - 60, Y(8.25) - 220], 'parede grossa', { tam: 30, cor: VERM_TXT, alpha: clamp((t - tg - 0.2) / 0.3) }); }
  if (t > P(3, 'onze')) medTxt(g, [X(5.25), Y(4.6)], '11 anos', { tam: 22, alinh: 'center', cor: COR.ambar, alpha: clamp((t - P(3, 'onze')) / 0.3) });
  g.restore(); tag('A PLANTA DA CASA', S(3), t);
  return { focos: [{ x: X(5.25), y: Y(7), r: 900 }], amb: 0.2, mult: 1 };
}
// o quarto à noite, em corte: a cama encostada na parede grossa
function batidas(cx, cy, t0, t, cor = COR.osso, lado = -1, larg = 200) {
  for (let i = 0; i < 3; i++) { const tt = t - t0 - i * 0.55; if (tt < 0 || tt > 0.8) continue; const f = tt / 0.8; g.save(); g.globalAlpha = 1 - f; g.strokeStyle = cor; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 30 + f * larg, lado > 0 ? -0.9 : Math.PI - 0.9, lado > 0 ? 0.9 : Math.PI + 0.9); g.stroke(); g.restore(); }
}
function quarto(t, { relogio = '', pai = 0, encan = 0 } = {}) {
  fundo(); const Yp = 1400, Xp = 820;
  tinta(g, [[40, Yp], [1040, Yp]], 1, { w: 2.6, over: 0 });
  g.fillStyle = '#d8ccb2'; g.globalAlpha = 0.18; g.fillRect(Xp, 360, 1080 - Xp, Yp - 360); g.globalAlpha = 1; riscos(g, Array.from({ length: 30 }, (_, i) => [[Xp, 380 + i * 40], [1080, 340 + i * 40]]), { w: 1, alpha: 0.25 }); tinta(g, [[Xp, 360], [Xp, Yp]], 1, { w: 3, over: 0 }); medTxt(g, [950, 340], 'parede grossa', { tam: 24, alinh: 'center', cor: COR.cinza });
  // cama, menino deitado (sem rosto), cabeça encostada na parede
  g.fillStyle = '#2a2219'; g.fillRect(260, 1180, 560, 220); tinta(g, [[260, 1180], [820, 1180], [820, 1400]], 1, { w: 2, over: 0 }); riscos(g, [[[260, 1180], [260, 1400]]], { w: 2 });
  g.fillStyle = '#3a3128'; g.beginPath(); g.moveTo(300, 1180); g.quadraticCurveTo(500, 1110, 720, 1150); g.lineTo(720, 1180); g.closePath(); g.fill();
  g.fillStyle = '#e6dcc6'; g.fillRect(700, 1130, 110, 50); g.fillStyle = '#16120e'; g.beginPath(); g.ellipse(760, 1120, 40, 34, 0, 0, 6.3); g.fill(); g.strokeStyle = COR.osso; g.lineWidth = 1.6; g.stroke();
  // relógio digital
  if (relogio) { g.save(); g.fillStyle = '#1a1512'; g.fillRect(90, 1060, 150, 80); g.font = '50px Maquina'; g.fillStyle = '#ff3a2a'; g.textAlign = 'center'; g.fillText(relogio, 165, 1118); g.restore(); riscos(g, [[[90, 1140], [240, 1140], [240, 1400]], [[90, 1140], [90, 1400]]], { w: 2, alpha: 0.6 }); }
  if (encan > 0) { g.save(); g.setLineDash([10, 8]); tinta(g, [[900, 360], [900, 1400]], encan, { cor: '#9fc3ff', w: 3, over: 0 }); g.restore(); medTxt(g, [990, 900], 'cano?', { tam: 28, alinh: 'center', cor: '#9fc3ff', alpha: encan }); }
  return { Xp, yc: 1120 };
}
function tomada4(t) {
  camera2D(t, W / 2, 1050, 1.05, { amp: 3 });
  const r = quarto(t, { relogio: t > P(5, 'três da manhã') ? '03:00' : '', encan: clamp((t - P(7, 'encanamento')) / 0.6) });
  const tb = P(5, 'Sempre três'); if (t > P(5, 'batidas')) [P(5, 'batidas'), tb, P(6, 'Vinham')].forEach(t0 => batidas(r.Xp - 6, r.yc, t0, t));
  if (t > tb) ['1', '2', '3'].forEach((s, i) => medTxt(g, [r.Xp - 120 + i * 50, 700], s, { tam: 60, alinh: 'center', cor: CLARO, alpha: clamp((t - tb - i * 0.4) / 0.2) }));
  const tc = P(6, 'cabeça'); if (t > tc) { tinta(g, [[r.Xp - 10, r.yc], [r.Xp - 200, 900], [r.Xp - 420, 900]], prog(t, tc, 0.4), { cor: COR.verm, w: 2, over: 0 }); medTxt(g, [r.Xp - 420, 880], 'na altura da cabeça', { tam: 30, cor: VERM_TXT, alpha: clamp((t - tc - 0.2) / 0.3) }); }
  if (t > S(7)) medTxt(g, [W / 2, 560], '"é o encanamento"', { tam: 40, alinh: 'center', fonte: 'SerifaI', cor: CLARO, alpha: clamp((t - S(7)) / 0.4) });
  g.restore(); tag(t < S(7) ? 'O SEGUNDO MÊS  ·  MADRUGADA' : 'O PAI', t < S(7) ? S(5) : S(7), t);
  return { focos: [{ x: 700, y: 1050, r: 800, i: 0.85 }], amb: 0.12, mult: 1 };
}
// junho: ele bate de volta; silêncio; a resposta
function tomada5(t) {
  camera2D(t, W / 2, 1050, 1.05 + 0.08 * easeInOut(prog(t, S(9), 2)), { amp: 2.5 });
  const r = quarto(t, { relogio: '03:02' });
  const tv = P(8, 'bateu de volta'); if (t > tv - 0.3) { const k = clamp((t - tv + 0.3) / 0.3); g.save(); g.globalAlpha = k; g.fillStyle = '#16120e'; g.beginPath(); g.ellipse(r.Xp - 40, r.yc - 10, 26, 22, 0, 0, 6.3); g.fill(); g.strokeStyle = COR.osso; g.lineWidth = 1.6; g.stroke(); g.restore(); batidas(r.Xp - 6, r.yc, tv, t, COR.verm, 1, 160); }
  if (t > P(8, 'Três vezes')) medTxt(g, [r.Xp - 300, 720], 'ele bateu de volta', { tam: 32, cor: VERM_TXT, alpha: clamp((t - P(8, 'Três vezes')) / 0.3) });
  const tr = P(10, 'respondeu'); if (t > tr) { batidas(r.Xp - 6, r.yc, tr + 0.2, t, CLARO, -1, 260); batidas(r.Xp - 6, r.yc, tr + 2.0, t, CLARO, -1, 260); }
  if (t > P(10, 'No mesmo')) medTxt(g, [W / 2, 640], 'no mesmo ritmo', { tam: 38, alinh: 'center', cor: CLARO, alpha: clamp((t - P(10, 'No mesmo')) / 0.3) });
  g.restore(); tag('JUNHO  ·  03:02', S(8), t);
  const sil = t > S(9) && t < P(10, 'respondeu') ? 0.45 : 1;
  return { focos: [{ x: 700, y: 1050, r: 760, i: 0.85 }], amb: 0.1, mult: sil };
}
// vazia por onze anos; a conta de luz
function tomada6(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 }); fundo();
  const y0 = 560, x0 = 140, x1 = 940, anos = 11;
  if (t < S(12)) {
    tinta(g, [[x0, y0 + 300], [x1, y0 + 300]], prog(t, T(11), 0.6), { w: 2.4, over: 0 });
    for (let i = 0; i <= anos; i++) { const k = prog(t, T(11) + 0.3 + i * 0.08, 0.2), x = lerp(x0, x1, i / anos); riscos(g, [[[x, y0 + 280], [x, y0 + 320]]], { w: 2, alpha: k }); if (i % 2 === 0 || i === anos) medTxt(g, [x, y0 + 370], String(1998 + i), { tam: 22, alinh: 'center', cor: COR.cinza, alpha: k }); }
    medTxt(g, [W / 2, y0 + 200], 'DESOCUPADA', { tam: 60, alinh: 'center', cor: CLARO, alpha: prog(t, P(11, 'vazia'), 0.4) });
    medTxt(g, [W / 2, y0 + 500], 'ninguém sabia dizer por quê', { tam: 30, alinh: 'center', cor: COR.cinza, alpha: prog(t, P(11, 'Ninguém'), 0.4) });
  } else {
    const yb = 1250, h = 3.2; tinta(g, [[x0, yb], [x1, yb]], 1, { w: 2.4, over: 0 }); tinta(g, [[x0, yb], [x0, yb - 420]], 1, { w: 1.6, over: 0 });
    const v = [96, 101, 98, 104, 99, 103, 97, 102, 100, 98, 101];
    v.forEach((kwh, i) => { const k = easeOut(prog(t, S(12) + i * 0.12, 0.3)), x = x0 + 30 + i * 70; g.fillStyle = COR.ambar; g.globalAlpha = 0.8; g.fillRect(x, yb - kwh * h * k, 44, kwh * h * k); g.globalAlpha = 1; medTxt(g, [x + 22, yb + 36], String(1998 + i).slice(2), { tam: 20, alinh: 'center', cor: COR.cinza }); });
    medTxt(g, [W / 2, yb - 470], 'kWh por mês, com a casa "vazia"', { tam: 30, alinh: 'center', cor: CLARO });
    if (t > P(12, 'Cem')) medTxt(g, [W / 2, yb - 380], '≈ 100', { tam: 60, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(12, 'Cem')) / 0.3) });
    const tp = P(12, 'Paga'); if (t > tp) carimbo(g, 540, 600, clamp((t - tp) / 0.12), 'PAGO EM ESPÉCIE', { larg: 640, rot: -0.1 });
  }
  g.restore(); tag(t < S(12) ? '1998 – 2008' : 'CIA. DE ENERGIA · HISTÓRICO', t < S(12) ? S(11) : S(12), t, t < S(12));
  return { focos: [{ x: 540, y: 980, r: 1000 }], amb: 0.2, mult: 1 };
}
// o bilhete atrás do rodapé
const BIL = papelTex(760, 520, 41, '#f4eedf');
function tomada7(t) {
  camera2D(t, W / 2, 960, 1.1, { amp: 4 }); fundo(); papel(g, BIL, 160, 600, { rot: -0.03 });
  g.save(); g.translate(160, 600); g.rotate(-0.03);
  escrita(g, 'Não responda quando ele bater.', 50, 130, (t - P(13, 'não responda')) / 1.1, -0.08, { tam: 44, cor: LAPIS });
  escrita(g, 'Ele só bate porque sabe', 50, 230, (t - P(13, 'Ele só')) / 0.9, -0.08, { tam: 44, cor: LAPIS });
  escrita(g, 'que você está acordado.', 50, 300, (t - P(13, 'que você')) / 0.9, -0.08, { tam: 44, cor: LAPIS });
  escrita(g, '— A.', 460, 420, (t - P(14, 'A.') + 0.3) / 0.4, -0.08, { tam: 50, cor: LAPIS });
  g.restore();
  if (t > P(14, 'A.')) circulo(g, 160 + 500, 600 + 400, 80, 50, easeInOut(prog(t, P(14, 'A.'), 0.5)), { seed: 5 });
  g.restore(); tag('ATRÁS DO RODAPÉ DO QUARTO', S(13), t);
  return { focos: [{ x: 540, y: 900, r: 900 }], amb: 0.2, mult: 1 };
}
// a planta da prefeitura: 12 m por fora, 10,5 por dentro
function tomada8(t) {
  camera2D(t, 600, 1040, 1.0, { amp: 3 }); fundo();
  planta(g, t, -99, { cotas: clamp((t - P(15, 'doze')) / 1.2), vao: clamp((t - P(15, 'dez e meio')) / 0.6) });
  if (t > P(15, 'dez e meio')) medTxt(g, [W / 2, 420], '3,50 + 4,00 + 3,00 = 10,50', { tam: 40, alinh: 'center', cor: CLARO, alpha: clamp((t - P(15, 'dez e meio')) / 0.3) });
  g.restore(); tag('PLANTA DA PREFEITURA', S(15), t);
  return { focos: [{ x: 620, y: 1050, r: 950 }, ...(t > P(15, 'dez e meio') ? [{ x: X(5.25), y: Y(8.25), r: 300, i: 0.5, cor: [255, 80, 60] }] : [])], amb: 0.2, mult: 1 };
}
const tomadaFim = t => cartaoFinal(t, T(ULT), N, 1, { linhas: LINHAS });
const LEG = [
  [2, 'Em 2009, uma família se mudou para uma casa térrea na Rua das Acácias. Barata demais para o tamanho.', { 'Barata demais': VERM_TXT }],
  [3, 'O filho mais novo, de 11 anos, ficou com o quarto do meio. Entre a cozinha e o banheiro.', { 'quarto do meio': CLARO }],
  [4, 'A parede entre o quarto e o banheiro era mais grossa que as outras.', { 'mais grossa': VERM_TXT }],
  [5, 'No segundo mês, começaram as batidas. Sempre perto das 3 da manhã. Sempre três.', { 'Sempre três.': VERM_TXT }],
  [6, 'Vinham da parede grossa. Na altura da cabeça dele, deitado.', { 'Na altura da cabeça dele': VERM_TXT }],
  [7, 'O pai disse que era o encanamento.', {}],
  [8, 'Numa noite de junho, às 3h02, o menino fechou a mão e bateu de volta. Três vezes.', { 'bateu de volta': VERM_TXT }],
  [9, 'Silêncio.', {}],
  [10, 'Depois, muito devagar, alguém do outro lado respondeu. Três batidas. No mesmo ritmo.', { 'alguém do outro lado respondeu': VERM_TXT }],
  [11, 'Antes deles, a casa tinha ficado vazia por 11 anos. Ninguém sabia dizer por quê.', { 'vazia por 11 anos': CLARO }],
  [12, 'Mas a conta de luz da casa vazia nunca parou. 100 kWh por mês. Paga em dinheiro.', { 'nunca parou': VERM_TXT }],
  [13, 'Atrás do rodapé do quarto, um bilhete: "Não responda quando ele bater. Ele só bate porque sabe que você está acordado."', { '"Não responda quando ele bater.': VERM_TXT }],
  [14, 'Assinado com uma letra só: A.', { 'A.': VERM_TXT }],
  [15, 'Na planta da prefeitura, a casa tem 12 metros. Por dentro, os cômodos somam 10,5.', { '12 metros': CLARO, '10,5': VERM_TXT }],
];
rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(3), tomada3], [T(5), tomada4], [T(8), tomada5], [T(11), tomada6], [T(13), tomada7], [T(15), tomada8], [T(ULT), tomadaFim]], legendasFn: legendas(N, LEG) });
