// Caso 001 — "A casa que sobra", estilo Planta no escuro. v2: a casa em 3D (fachada, corte, noite, medição).
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, trajeto, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, camera, mao, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, narracao, legendas, caminho, medTxt, rot3, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, blocos, parede, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

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
function tomada2_v1(t) {
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
function tomada3_v1(t) {
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
  if (t < S(12) - 0.25) {
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
function tomada8_v1(t) {
  camera2D(t, 600, 1040, 1.0, { amp: 3 }); fundo();
  planta(g, t, -99, { cotas: clamp((t - P(15, 'doze')) / 1.2), vao: clamp((t - P(15, 'dez e meio')) / 0.6) });
  if (t > P(15, 'dez e meio')) medTxt(g, [W / 2, 420], '3,50 + 4,00 + 3,00 = 10,50', { tam: 40, alinh: 'center', cor: CLARO, alpha: clamp((t - P(15, 'dez e meio')) / 0.3) });
  g.restore(); tag('PLANTA DA PREFEITURA', S(15), t);
  return { focos: [{ x: 620, y: 1050, r: 950 }, ...(t > P(15, 'dez e meio') ? [{ x: X(5.25), y: Y(8.25), r: 300, i: 0.5, cor: [255, 80, 60] }] : [])], amb: 0.2, mult: 1 };
}

// =====================================================================================
// v2 — A CASA EM 3D. Metros. x' = largura (0–7; a sala fica em x' alto, à esquerda de quem olha da rua),
// z = profundidade (0 = fachada, 12 = fundo), y = altura. A câmera olhando +z espelha x: x' = 7 − x da planta 2D.
// =====================================================================================
const HE = 2.9, HP = 1.6, AMBAR = [255, 178, 90], VERMC = [255, 70, 50];
const L3 = (cam, pts, p = 1, o = {}) => cam.linha(pts).forEach(pp => tinta(g, pp, p, { w: 2.1, ...o }));
const R3 = (cam, l, o) => riscos(g, l.flatMap(p => cam.linha(p)), o);
const quad = (x0, y0, x1, y1, z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z], [x0, y0, z]];
const quadX = (x, y0, y1, z0, z1) => [[x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0], [x, y0, z0]];
const encher = (cam, pts, cor) => { const pl = cam.poli(pts); if (pl) { caminho(g, pl); g.fillStyle = cor; g.fill(); } return pl; };

// paredes: externas (com vão da porta) e internas (com vãos de passagem); a parede grossa é um bloco à parte
const EXT = [[0, 0, 4.6, 0], [5.5, 0, 7, 0], [0, 12, 7, 12], [7, 0, 7, 12], [0, 0, 0, 12]];
const INT = [[3.5, 0, 3.5, 1.2], [3.5, 2.2, 3.5, 4.8], [3.5, 5.6, 3.5, 7.5], [3.5, 9, 3.5, 10.0], [3.5, 10.8, 3.5, 12], [3.5, 6, 4.0, 6], [4.8, 6, 7, 6], [0, 3.5, 3.5, 3.5]];
const GROSSA = { x0: 0.07, x1: 3.43, z0: 7.5, z1: 9.0, tipo: 'parede', cores: ['#241d16', '#3d3227', 0.8], i: 60,
  linhas: h => { const l = []; for (let c = -1.3; c < 3.38; c += 0.28) { const xa = Math.max(0.12, c), xb = Math.min(3.38, c + 1.4); if (xb > xa) l.push([[xa, h, 7.55 + (xa - c)], [xb, h, 7.55 + (xb - c)]]); } return l; } };
const MOVEIS = [
  [2.0, 5.5, 3.0, 7.4, 0.45, h => [[[2.08, h, 7.0], [2.92, h, 7.0]], [[2.1, h, 7.05], [2.9, h, 7.35]]]],   // cama do menino, cabeceira na parede grossa
  [0.15, 3.7, 0.75, 4.6, 0.75], [0.2, 5.8, 0.6, 6.4, 0.5],                                             // escrivaninha, criado
  [0.1, 0.1, 3.2, 0.7, 0.9, h => [[[0.6, h, 0.4], [1.1, h, 0.4]], [[1.6, h, 0.4], [2.1, h, 0.4]]]], [0.1, 0.8, 0.7, 3.0, 0.9],   // cozinha: pia e bancada
  [5.0, 0.6, 6.8, 1.5, 0.45], [4.2, 3.4, 5.4, 4.4, 0.75],                                               // sala: sofá, mesa
  [4.4, 8.4, 6.2, 10.4, 0.45, h => [[[4.5, h, 10.1], [6.1, h, 10.1]]]], [6.4, 6.4, 6.9, 7.6, 1.7],       // quarto dos pais: cama, armário
  [0.2, 10.6, 1.9, 11.8, 0.55], [2.6, 11.3, 3.2, 11.85, 0.45],                                           // banheiro: banheira, vaso
];
const COMODOS = [['SALA', 5.25, 3.0], ['QUARTO DOS PAIS', 5.25, 9.0], ['COZINHA', 1.75, 1.9], ['QUARTO', 1.75, 4.6], ['BANHEIRO', 1.75, 10.3]];
function blocosCasa(hExt, hInt, t, { tInt = -99, grossa = 1 } = {}) {
  const l = EXT.map((s, i) => parede(s, hExt, { i, cores: hExt > 2 ? ['#221c15', '#b8ab92', 0.8] : undefined }, 0.2));
  INT.forEach((s, i) => l.push(parede(s, hInt, { i: 20 + i, t0: tInt + 0.15 + i * 0.07 })));
  l.push({ ...GROSSA, h: hInt * grossa, t0: tInt + 0.6 });
  if (hExt < 2) MOVEIS.forEach(([x0, z0, x1, z1, h, linhas], i) => l.push({ x0, z0, x1, z1, h, tipo: 'movel', linhas, t0: tInt + 0.8 + i * 0.05 }));
  return l;
}
// chão, nomes, destaques (corte sem telhado)
function pisos(cam, t, o = {}) {
  const alfa = o.rot ?? 1;
  R3(cam, Array.from({ length: 23 }, (_, k) => [[3.6, 0.003, 0.1 + k * 0.26], [6.9, 0.003, 0.1 + k * 0.26]]).filter(q => q[0][2] < 5.9), { w: 0.8, alpha: 0.1 * alfa });   // tacos da sala
  R3(cam, Array.from({ length: 9 }, (_, k) => [[0.1, 0.003, 9.1 + k * 0.32], [3.4, 0.003, 9.1 + k * 0.32]]), { w: 0.8, alpha: 0.12 * alfa });                              // azulejo do banheiro
  if (o.quarto > 0) encher(cam, [[0.07, 0.004, 3.57], [3.43, 0.004, 3.57], [3.43, 0.004, 7.43], [0.07, 0.004, 7.43]], `rgba(242,180,92,${0.22 * o.quarto})`);
  COMODOS.forEach(([s, x, z], i) => rot3(cam, s, [x, 0.01, z], i === 3 && o.quarto > 0 ? 0.3 : 0.24, { max: 46, esp: 2, alpha: 0.75 * alfa, cor: i === 3 && o.quarto > 0 ? CLARO : COR.cinza }));
}
// telhado de duas águas (cumeeira ao longo de z), com telhas em riscos
function telhado(cam, alpha = 1) {
  if (alpha <= 0.01) return;
  const yE = HE, yC = 4.4, a = -0.45, b = 12.45, e0 = -0.45, e1 = 7.45;
  const aguas = [[[e0, yE, a], [3.5, yC, a], [3.5, yC, b], [e0, yE, b]], [[e1, yE, a], [3.5, yC, a], [3.5, yC, b], [e1, yE, b]]]
    .map(q => ({ q, d: cam.prof([(q[0][0] + 3.5) / 2, (yE + yC) / 2, 6]) })).sort((u, v) => v.d - u.d);
  g.save(); g.globalAlpha = alpha;
  encher(cam, [[e0, yE, 0], [3.5, yC, 0], [e1, yE, 0]], '#1c1712');                 // oitão da frente
  for (const { q } of aguas) {
    encher(cam, q, '#2a221a'); L3(cam, [...q, q[0]], 1, { w: 1.6, seed: 31 });
    const tel = []; for (let k = 1; k < 8; k++) { const f = k / 8; tel.push([[lerp(q[0][0], 3.5, f), lerp(yE, yC, f), a], [lerp(q[0][0], 3.5, f), lerp(yE, yC, f), b]]); }
    for (let z = a + 0.5; z < b; z += 0.5) tel.push([[q[0][0], yE, z], [3.5, yC, z]]);
    R3(cam, tel, { w: 0.8, alpha: 0.35 });
  }
  L3(cam, [[e0, yE, 0], [3.5, yC, 0], [e1, yE, 0]], 1, { w: 1.8, seed: 33 });
  g.restore();
}
// detalhes da fachada e das laterais (só nas faces voltadas para a câmera)
function fachada(cam, t, o = {}) {
  const pe = o.p ?? 1, luz = o.janelas ?? 0;
  if (cam.p[2] < 0) {
    [[0.9, 2.3], [5.8, 6.7]].forEach(([x0, x1], i) => { const q = quad(x0, 1.0, x1, 2.2, -0.105); if (luz > 0) encher(cam, q.slice(0, 4), `rgba(220,150,70,${luz * (i ? 0.6 : 0.35)})`); else encher(cam, q.slice(0, 4), '#0f0c0a'); L3(cam, q, pe, { w: 1.7, seed: 40 + i }); R3(cam, [[[(x0 + x1) / 2, 1.0, -0.105], [(x0 + x1) / 2, 2.2, -0.105]], [[x0, 1.6, -0.105], [x1, 1.6, -0.105]]], { w: 1, alpha: 0.7 * pe }); R3(cam, [[[x0 - 0.1, 0.95, -0.2], [x1 + 0.1, 0.95, -0.2]]], { w: 1.4, alpha: 0.8 * pe }); });
    encher(cam, quad(4.6, 0, 5.5, 2.15, -0.1).slice(0, 4), '#16110d'); L3(cam, quad(4.6, 0, 5.5, 2.15, -0.1), pe, { w: 1.8, seed: 45 });
    R3(cam, [[[4.7, 1.05, -0.11], [4.78, 1.05, -0.11]]], { w: 3, alpha: pe });
    const qn = cam.pt([6.25, 2.55, -0.11]), en = cam.esc([6.25, 2.55, 0]);   // número 214
    if (qn && en > 4) { g.save(); g.globalAlpha = pe; g.strokeStyle = COR.osso; g.lineWidth = 1.2; g.strokeRect(qn[0] - en * 0.3, qn[1] - en * 0.13, en * 0.6, en * 0.26); g.fillStyle = COR.osso; g.font = `${Math.max(6, en * 0.2)}px Serifa`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('214', qn[0], qn[1] + 1); g.restore(); }
    if (o.medidor > 0) { const q = quad(0.35, 1.2, 0.8, 1.75, -0.12); encher(cam, q.slice(0, 4), '#2a241c'); L3(cam, q, 1, { w: 1.5, cor: COR.ambar, seed: 47 }); const qc = cam.pt([0.575, 1.5, -0.13]), ec = cam.esc([0.575, 1.5, 0]); if (qc) { g.save(); g.globalAlpha = o.medidor; g.strokeStyle = COR.ambar; g.lineWidth = 1.5; g.beginPath(); g.arc(qc[0], qc[1], ec * 0.12, 0, 6.3); g.stroke(); const an = t * 7; g.beginPath(); g.moveTo(qc[0], qc[1]); g.lineTo(qc[0] + Math.cos(an) * ec * 0.12, qc[1] + Math.sin(an) * ec * 0.12); g.stroke(); g.restore(); } }
  }
  if (cam.p[0] > 7) [[2.0, 3.2], [8.0, 9.2]].forEach(([z0, z1], i) => { const q = quadX(7.105, 1.0, 2.2, z0, z1); encher(cam, q.slice(0, 4), luz > 0 ? `rgba(220,150,70,${luz * 0.3})` : '#0f0c0a'); L3(cam, q, pe, { w: 1.5, seed: 50 + i }); R3(cam, [[[7.105, 1.6, z0], [7.105, 1.6, z1]]], { w: 1, alpha: 0.6 * pe }); });
  if (cam.p[0] < 0) [[1.0, 2.0, 1.0, 2.2], [5.0, 6.0, 1.0, 2.2], [10.2, 10.8, 1.7, 2.2]].forEach(([z0, z1, y0, y1], i) => { const q = quadX(-0.105, y0, y1, z0, z1); encher(cam, q.slice(0, 4), '#0f0c0a'); L3(cam, q, pe, { w: 1.5, seed: 55 + i }); });
  R3(cam, [[[-0.2, HE + 0.05, -0.2], [7.2, HE + 0.05, -0.2]]], { w: 1.6, alpha: 0.7 * pe });   // calha
}
// rua, calçada e vizinhos (só contorno)
const CALCADA = (() => { const l = []; for (let x = -14; x < 21; x += 0.8) l.push([[x, 0, -1.2], [x, 0, -3.2]]); l.push([[-14, 0, -1.2], [21, 0, -1.2]], [[-14, 0, -3.2], [21, 0, -3.2]], [[-14, 0, -3.35], [21, 0, -3.35]]); return l; })();
const VIZ = [[-9, -1.5, 3.2, 4.6], [8.5, 15.5, 3.0, 4.3]];
function rua(cam, t, p = 1) {
  R3(cam, CALCADA, { w: 0.9, alpha: 0.28 * p });
  R3(cam, [[[-14, 0, 0], [21, 0, 0]]], { w: 1.2, alpha: 0.4 * p });
  VIZ.forEach(([x0, x1, h, hc]) => R3(cam, [[[x0, 0, 0], [x0, h, 0], [(x0 + x1) / 2, hc, 0], [x1, h, 0], [x1, 0, 0]], [[x0 + 1.2, 1.0, 0], [x0 + 2.4, 1.0, 0], [x0 + 2.4, 2.1, 0], [x0 + 1.2, 2.1, 0], [x0 + 1.2, 1.0, 0]], [[x1 - 2.4, 1.0, 0], [x1 - 1.2, 1.0, 0], [x1 - 1.2, 2.1, 0], [x1 - 2.4, 2.1, 0], [x1 - 2.4, 1.0, 0]]], { w: 1.1, alpha: 0.3 * p }));
  R3(cam, [[[7.6, 0, 0], [7.6, 0, 12.6], [-0.6, 0, 12.6], [-0.6, 0, 0]]], { w: 1, alpha: 0.25 * p, dash: [8, 8] });    // muro do lote
}
const cam3D = (f, t, amp = 0.08, fov = 40) => { const [px, py, pz, tx, ty, tz] = f(t), hh = mao(t, amp); return { cam: camera([px + hh.x, py + hh.y, pz], [tx + hh.x * 0.4, ty + hh.y * 0.4, tz], fov, hh.r), alvo: [tx, ty, tz] }; };
const cotaOff = (cam, a, b, p, txt, o = {}) => { const qa = cam.pt(a), qb = cam.pt(b); if (qa && qb && p > 0) cota(g, qa, qb, p, txt, o); };
const tagTela = (s, t0, t, big = false) => { if (t <= t0) return; if (big) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, s, 116, 242, (t - t0) / 0.6 * s.length, { tam: 40, cor: COR.osso, esp: 3 }); } else datilo(sb, s, 84, 242, (t - t0) / 0.6 * s.length, { tam: 32, cor: COR.osso, esp: 2 }); };

// ---------- v2 tomada 2: a casa térrea, da rua ----------
const T2 = T(2), T3 = T(3);
const camA = trajeto([[T2, 17, 1.9, -30, 3.6, 2.0, 4], [6.6, 16, 3.4, -23, 3.6, 1.6, 5], [T3, 15, 6.5, -17, 3.5, 1.0, 5.5]]);
function tomada2(t) {
  const { cam, alvo } = cam3D(camA, t, 0.1); fundo();
  rua(cam, t, prog(t, T2, 0.8));
  blocos(cam, blocosCasa(HE, HE, t));
  fachada(cam, t, { p: prog(t, T2 + 0.2, 0.8) });
  telhado(cam, prog(t, T2 + 0.4, 0.8));
  const tt = P(2, 'tamanho');
  cotaOff(cam, [7.9, 0, 0], [7.9, 0, 12], prog(t, tt - 0.2, 0.8), '12,00 m', { cor: CLARO, w: 1.8, tam: 30, lado: 1 });
  cotaOff(cam, [0, 0, -0.8], [7, 0, -0.8], prog(t, tt, 0.6), '7,00', { cor: COR.cinza, w: 1.4, tam: 26, lado: 1 });
  const qr = cam.pt([3.5, 0, -2.3]); if (qr && t > P(2, 'Rua das')) medTxt(g, [qr[0], qr[1] + 40], 'RUA DAS ACÁCIAS', { tam: clamp(cam.esc([3.5, 0, -2.3]) * 0.42, 18, 44), alinh: 'center', cor: CLARO, alpha: prog(t, P(2, 'Rua das'), 0.4) });
  const tb = P(2, 'Barata'); if (t > tb) carimbo(g, 540, 560, clamp((t - tb) / 0.12), 'BARATA DEMAIS', { larg: 560, rot: -0.1 });
  tagTela('2009  ·  A MUDANÇA', S(2), t, true);
  const qa = cam.pt(alvo) || [W / 2, H / 2];
  return { focos: [{ x: qa[0], y: qa[1], r: 1050 }], amb: 0.2, mult: 1 };
}

// ---------- v2 tomada 3: tira o telhado; o corte; o quarto do meio; a parede grossa ----------
const camB = trajeto([[T3, 15, 6.5, -17, 3.5, 1.0, 5.5], [13.2, 12, 17, -8, 3.5, 0, 6.0], [S(4) + 0.2, 8.5, 15.5, -3.5, 2.6, 0, 6.9], [T(5), 6.0, 11.5, 0.2, 1.9, 0.3, 8.0]]);
function tomada3(t) {
  const { cam } = cam3D(camB, t, 0.06); fundo();
  const corte = easeInOut(prog(t, T3 + 0.2, 1.2)), hExt = lerp(HE, HP, corte);
  rua(cam, t, 1 - corte * 0.6);
  const tq = P(3, 'quarto do meio'), tg = P(4, 'mais grossa');
  pisos(cam, t, { rot: prog(t, T3 + 1.2, 0.6), quarto: clamp((t - tq) / 0.4) });
  blocos(cam, blocosCasa(hExt, HP, t, { tInt: T3 + 0.9 }), t);
  if (corte < 0.5) fachada(cam, t, { p: 1 - corte * 2 });
  telhado(cam, 1 - easeInOut(prog(t, T3, 0.9)));
  // a parede grossa: contorno vermelho e etiqueta
  if (t > tg - 0.2) {
    const k = clamp((t - tg + 0.2) / 0.4);
    L3(cam, [[0.07, HP + 0.01, 7.5], [3.43, HP + 0.01, 7.5], [3.43, HP + 0.01, 9.0], [0.07, HP + 0.01, 9.0], [0.07, HP + 0.01, 7.5]], k, { cor: COR.verm, w: 3.2, seed: 70 });
    const q = cam.pt([0.2, HP, 8.25]); if (q) { const lx = clamp(q[0] + 70, 80, W - 380), ly = Math.max(q[1] - 180, 360); tinta(g, [q, [lx, ly], [lx + 300, ly]], prog(t, tg, 0.4), { cor: COR.verm, w: 2, over: 0 }); medTxt(g, [lx, ly - 20], 'parede grossa', { tam: 34, cor: VERM_TXT, alpha: clamp((t - tg - 0.2) / 0.3) }); }
  }
  const to = P(3, 'onze'); if (t > to) { const q = cam.pt([2.5, 0.5, 6.4]); if (q) medTxt(g, [q[0], q[1] - 30], '11 anos', { tam: 26, alinh: 'center', cor: COR.ambar, alpha: clamp((t - to) / 0.3) }); }
  tagTela(t < S(4) ? 'A CASA POR DENTRO' : 'O QUARTO DO MEIO', t < S(4) ? S(3) : S(4), t);
  const qq = cam.pt([1.75, 0.3, 6.5]) || [W / 2, H / 2], focos = [{ x: qq[0], y: qq[1], r: 980 }];
  if (t > tq) focos.push({ x: qq[0], y: qq[1], r: 380, i: 0.45, cor: AMBAR });
  return { focos, amb: 0.17, mult: 1 };
}

// ---------- v2 tomada 6a: a casa vazia, onze anos, à noite ----------
const camC = trajeto([[T(11), 12, 2.6, -22, 3.5, 1.9, 4], [S(12) - 0.2, 11, 2.3, -18, 3.0, 1.7, 3]]);
function tomada6a(t) {
  const { cam } = cam3D(camC, t, 0.05); fundo();
  rua(cam, t, 0.7);
  blocos(cam, blocosCasa(HE, HE, t)); fachada(cam, t, { medidor: clamp((t - P(11, 'Ninguém')) / 0.4) }); telhado(cam, 1);
  // placa no jardim
  const qp = cam.pt([6.2, 1.2, -0.9]), ep = cam.esc([6.2, 1.2, -0.9]);
  if (qp) { const k = prog(t, P(11, 'vazia'), 0.4); g.save(); g.globalAlpha = k; g.strokeStyle = COR.osso; g.lineWidth = 2; g.beginPath(); g.moveTo(qp[0], qp[1]); g.lineTo(qp[0], qp[1] + ep * 1.2); g.stroke(); g.fillStyle = '#e9dfc9'; g.fillRect(qp[0] - ep * 0.55, qp[1] - ep * 0.35, ep * 1.1, ep * 0.5); g.fillStyle = '#1e1913'; g.font = `${Math.max(6, ep * 0.17)}px Maquina`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('VENDE-SE', qp[0], qp[1] - ep * 0.1); g.restore(); }
  // contador dos anos e linha do tempo (na tela)
  const ano = Math.floor(lerp(1998, 2008.99, clamp((t - P(11, 'vazia')) / 2.6)));
  if (t > P(11, 'vazia') - 0.3) { medTxt(g, [W / 2, 520], String(ano), { tam: 120, alinh: 'center', cor: CLARO, fonte: 'Serifa', alpha: prog(t, P(11, 'vazia') - 0.3, 0.3) }); medTxt(g, [W / 2, 600], 'DESOCUPADA', { tam: 40, alinh: 'center', cor: COR.cinza, alpha: prog(t, P(11, 'vazia'), 0.4) }); }
  if (t > P(11, 'Ninguém')) medTxt(g, [W / 2, 1290], 'ninguém sabia dizer por quê', { tam: 32, alinh: 'center', cor: COR.cinza, alpha: prog(t, P(11, 'Ninguém'), 0.4) });
  tagTela('1998 – 2008', S(11), t, true);
  const qm = cam.pt([0.575, 1.5, -0.13]), focos = [{ x: 540, y: 980, r: 900, i: 0.7 }];
  if (qm && t > P(11, 'Ninguém')) focos.push({ x: qm[0], y: qm[1], r: 220, i: 0.6, cor: AMBAR });
  return { focos, amb: 0.1, mult: 1 };
}

// ---------- v2 tomada 8: a medição — 12 por fora, 10,5 por dentro ----------
const camD = trajeto([[T(15), 3.5, 27, -7.5, 3.5, 0, 6.0], [P(15, 'Por dentro'), 3.1, 24, -5.5, 3.3, 0, 6.3], [T(16), 2.4, 17, -1.5, 2.3, 0, 7.6]]);
function tomada8(t) {
  const { cam } = cam3D(camD, t, 0.04, 38); fundo();
  const tdz = P(15, 'doze'), tdm = P(15, 'dez e meio'), vao = clamp((t - tdm) / 0.6);
  pisos(cam, t, { rot: 1 - 0.5 * vao });
  const lista = blocosCasa(HP, HP, t, { grossa: 1 - easeInOut(vao) * 0.98 });
  blocos(cam, lista, t);
  // o vão: preto, com brilho vermelho
  if (vao > 0) { encher(cam, [[0.07, 0.02, 7.5], [3.43, 0.02, 7.5], [3.43, 0.02, 9.0], [0.07, 0.02, 9.0]], `rgba(13,11,9,${vao})`); L3(cam, [[0.07, HP, 7.5], [3.43, HP, 7.5], [3.43, HP, 9.0], [0.07, HP, 9.0], [0.07, HP, 7.5]], vao, { cor: COR.verm, w: 3, seed: 80 }); R3(cam, [[[0.07, 0, 7.5], [0.07, HP, 7.5]], [[3.43, 0, 7.5], [3.43, HP, 7.5]], [[0.07, 0, 9], [0.07, HP, 9]], [[3.43, 0, 9], [3.43, HP, 9]]], { cor: COR.verm, w: 1.6, alpha: 0.8 * vao }); const q = cam.pt([1.75, HP + 0.3, 8.25]); if (q) medTxt(g, [q[0], q[1]], '1,50 m ?', { tam: 40, alinh: 'center', cor: VERM_TXT, alpha: vao }); }
  cotaOff(cam, [7.7, 0, 0], [7.7, 0, 12], clamp((t - tdz + 0.2) / 1.0), '12,00', { cor: CLARO, w: 2, tam: 32, lado: 1 });
  const pi = k => clamp((t - P(15, 'Por dentro') - k * 0.35) / 0.5);
  cotaOff(cam, [-0.7, 0, 0], [-0.7, 0, 3.5], pi(0), '3,50', { cor: COR.cinza, w: 1.5, tam: 26, lado: -1 });
  cotaOff(cam, [-0.7, 0, 3.5], [-0.7, 0, 7.5], pi(1), '4,00', { cor: COR.cinza, w: 1.5, tam: 26, lado: -1 });
  cotaOff(cam, [-0.7, 0, 9], [-0.7, 0, 12], pi(2), '3,00', { cor: COR.cinza, w: 1.5, tam: 26, lado: -1 });
  if (t > tdm) { g.fillStyle = `rgba(13,11,9,${0.8 * clamp((t - tdm) / 0.3)})`; g.fillRect(90, 370, 900, 160); }
  if (t > tdm) medTxt(g, [W / 2, 430], '3,50 + 4,00 + 3,00 = 10,50', { tam: 42, alinh: 'center', cor: CLARO, alpha: clamp((t - tdm) / 0.3) });
  if (t > tdm + 0.6) medTxt(g, [W / 2, 500], '12,00 − 10,50 = 1,50', { tam: 36, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - tdm - 0.6) / 0.3) });
  tagTela('PLANTA DA PREFEITURA', S(15), t);
  const qv = cam.pt([1.75, 0.5, 8.25]), focos = [{ x: 540, y: 1050, r: 1000 }];
  if (qv && vao > 0) focos.push({ x: qv[0], y: qv[1], r: 320, i: 0.5 * vao, cor: VERMC });
  return { focos, amb: 0.18, mult: 1 };
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
rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(3), tomada3], [T(5), tomada4], [T(8), tomada5], [T(11), tomada6a], [S(12) - 0.25, tomada6], [T(13), tomada7], [T(15), tomada8], [T(ULT), tomadaFim]], legendasFn: legendas(N, LEG) });
