// Caso 010 — "A casa espelhada", estilo Planta no escuro.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, medTxt, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N, ULT = N.TL.length;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(ULT) + 1.4;
const T = i => S(i) - 0.25;
const LINHAS = ['CASO 010 · RUA DAS CAMÉLIAS, 15 E 17', 'CASAS GÊMEAS · LICENÇA DE 1958'];
const tag = (s, t0, t, big = false) => { if (t <= t0) return; if (big) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, s, 116, 242, (t - t0) / 0.6 * s.length, { tam: 40, cor: COR.osso, esp: 3 }); } else datilo(sb, s, 84, 242, (t - t0) / 0.6 * s.length, { tam: 32, cor: COR.osso, esp: 2 }); };
const espelho = (x, fn) => { g.save(); g.translate(x, 0); g.scale(-1, 1); g.translate(-x, 0); fn(); g.restore(); };

// rosto sem traços, com a pinta (lado: 'esq' ou 'dir' da pessoa, que fica do lado oposto para quem olha)
function rosto(x, y, s, lado, k = 1, rot = '') {
  if (k <= 0) return; g.save(); g.globalAlpha = k; g.fillStyle = '#1a1612'; g.beginPath(); g.ellipse(x, y, 120 * s, 150 * s, 0, 0, 6.3); g.fill(); g.strokeStyle = COR.osso; g.lineWidth = 2.4; g.stroke();
  g.beginPath(); g.moveTo(x - 200 * s, y + 340 * s); g.quadraticCurveTo(x - 190 * s, y + 170 * s, x, y + 160 * s); g.quadraticCurveTo(x + 190 * s, y + 170 * s, x + 200 * s, y + 340 * s); g.stroke();
  const px = lado === 'esq' ? x + 60 * s : x - 60 * s; g.fillStyle = '#e8dcc4'; g.beginPath(); g.arc(px, y + 40 * s, 7 * s, 0, 6.3); g.fill(); g.restore();
  if (rot) medTxt(g, [x, y + 420 * s], rot, { tam: 26, alinh: 'center', cor: COR.cinza, alpha: k });
  return [px, y + 40 * s];
}
function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 }); fundo();
  prancha(g, t, { linhas: LINHAS, folha: '10/13' });
  const s = 'ARQUIVO MORTO  ·  CASO 010'; datilo(g, s, W / 2, 690, (t - 0.45) / 0.65 * s.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'A CASA', 885, P(1, 'A casa')); titulo(g, t, 'ESPELHADA', 1005, P(1, 'espelhada'));
  if (t > P(1, 'espelhada') + 0.4) { g.save(); g.globalAlpha = 0.25 * clamp((t - P(1, 'espelhada') - 0.4) / 0.5); g.translate(0, 2 * 1030); g.scale(1, -1); titulo(g, t, 'ESPELHADA', 1005, P(1, 'espelhada')); g.restore(); riscos(g, [[[200, 1030], [880, 1030]]], { w: 1.4, cor: COR.verm, alpha: 0.8, dash: [8, 8] }); }
  g.restore();
  return { focos: [{ x: 540, y: 950, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}
function tomada2(t) {
  camera2D(t, W / 2, 960, 1.05, { amp: 4 }); fundo();
  const p = rosto(540, 760, 1.6, 'esq', prog(t, T(2), 0.5));
  if (t > P(2, 'destra')) { medTxt(g, [540, 1300], 'DESTRA', { tam: 44, alinh: 'center', alpha: clamp((t - P(2, 'destra')) / 0.3) }); }
  const tp = P(2, 'pinta'); if (t > tp) { circulo(g, p[0], p[1], 50, 44, easeInOut(prog(t, tp, 0.5)), { seed: 3 }); tinta(g, [[p[0] + 40, p[1]], [p[0] + 240, p[1] - 160], [p[0] + 300, p[1] - 160]], prog(t, tp + 0.2, 0.4), { cor: COR.verm, w: 2, over: 0 }); medTxt(g, [p[0] + 120, p[1] - 180], 'pinta: bochecha ESQUERDA', { tam: 28, cor: VERM_TXT, alpha: clamp((t - tp - 0.3) / 0.3) }); }
  g.restore(); tag('MARINA  ·  35 ANOS  ·  ADOTADA', S(2), t);
  return { focos: [{ x: 540, y: 900, r: 900 }], amb: 0.2, mult: 1 };
}
// planta das duas casas, espelhadas
const PL = [[0, 0, 5, 0], [0, 8, 5, 8], [0, 0, 0, 8], [5, 0, 5, 8], [0, 4, 3, 4], [3, 4, 3, 8], [3, 6, 5, 6]];
const RT = [['SALA', 2.5, 2], ['QUARTO', 1.5, 6], ['BANHO', 4, 7], ['COZINHA', 4, 5]];
function plantas(t, t0, { vidro = 0 } = {}) {
  const K = 80, cx = 540, Y0 = 1400, X = (x, lado) => cx + (lado ? x : -x) * K, Y = z => Y0 - z * K;
  [0, 1].forEach(lado => { PL.forEach(([a, b, c, d], i) => tinta(g, [[X(a, lado), Y(b)], [X(c, lado), Y(d)]], prog(t, t0 + lado * 0.3 + i * 0.05, 0.5), { w: 2.6, over: 8, seed: i + lado * 10 })); RT.forEach(([s, x, z]) => medTxt(g, [X(x, lado), Y(z)], s, { tam: 20, alinh: 'center', cor: COR.cinza, alpha: prog(t, t0 + 0.8, 0.4) })); medTxt(g, [X(2.5, lado), Y(-0.6)], lado ? 'Nº 17' : 'Nº 15', { tam: 32, alinh: 'center', alpha: prog(t, t0 + 0.6, 0.4) }); });
  g.save(); g.setLineDash([10, 10]); tinta(g, [[cx, Y(-1)], [cx, Y(9)]], prog(t, t0 + 1.0, 0.6), { cor: COR.verm, w: 2, over: 0 }); g.restore();
  if (vidro > 0) { riscos(g, [[[cx - 6, Y(6.2)], [cx - 6, Y(7.8)]]], { w: 8, cor: '#9fc3ff', alpha: vidro }); medTxt(g, [cx - 30, Y(8.4)], 'espelho do nº 15 = vidro', { tam: 26, alinh: 'center', cor: '#9fc3ff', alpha: vidro }); }
}
function tomada3(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 }); fundo(); plantas(t, T(3)); g.restore(); tag('1958  ·  CASAS GÊMEAS', S(3), t, true);
  return { focos: [{ x: 540, y: 1000, r: 1000 }], amb: 0.2, mult: 1 };
}
// as duas janelas de cozinha, frente a frente
function janelaPessoa(x, y, mao, k, cor) {
  g.save(); g.globalAlpha = k; g.fillStyle = '#e8c88a'; g.fillRect(x - 170, y - 260, 340, 420); g.fillStyle = cor; g.beginPath(); g.ellipse(x, y - 90, 50, 62, 0, 0, 6.3); g.fill(); g.fillRect(x - 80, y - 20, 160, 180);
  const lx = mao > 0 ? x + 70 : x - 70; g.strokeStyle = cor; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.moveTo(lx, y + 10); g.lineTo(lx + (mao > 0 ? 40 : -40), y - 160); g.stroke(); g.restore();
  tinta(g, [[x - 180, y - 270], [x + 180, y - 270], [x + 180, y + 170], [x - 180, y + 170], [x - 180, y - 270]], 1, { w: 3, over: 4 });
}
function tomada4(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 }); fundo();
  const tm = P(5, 'levantou');
  janelaPessoa(270, 1000, t > tm ? -1 : 0, 1, '#1a1612'); medTxt(g, [270, 1250], 'Marina · nº 15', { tam: 26, alinh: 'center', cor: COR.cinza });
  janelaPessoa(810, 1000, t > tm + 0.3 ? 1 : 0, clamp((t - P(4, 'mulher')) / 0.4), '#1a1612'); medTxt(g, [810, 1250], 'cozinha do nº 17', { tam: 26, alinh: 'center', cor: COR.cinza, alpha: clamp((t - P(4, 'mulher')) / 0.4) });
  g.save(); g.setLineDash([10, 10]); riscos(g, [[[540, 650], [540, 1300]]], { w: 2, cor: COR.verm, alpha: 0.6 }); g.restore();
  if (t > tm) { medTxt(g, [270, 640], 'mão direita', { tam: 30, alinh: 'center', alpha: clamp((t - tm) / 0.3) }); medTxt(g, [810, 640], 'mão esquerda', { tam: 30, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - tm - 0.3) / 0.3) }); }
  // chuva
  riscos(g, Array.from({ length: 60 }, (_, i) => { const x = (i * 97 + t * 400) % 1100, y = (i * 173 + t * 900) % 1900; return [[x, y], [x - 8, y + 40]]; }), { w: 1, cor: '#9fb6cc', alpha: 0.25 });
  g.restore(); tag('NOITE DE CHUVA', S(4), t);
  return { focos: [{ x: 270, y: 950, r: 520, cor: [255, 220, 160] }, ...(t > P(4, 'mulher') ? [{ x: 810, y: 950, r: 520, cor: [255, 220, 160] }] : [])], amb: 0.16, mult: 1 };
}
// as notas fiscais
const NF = papelTex(400, 760, 51, '#f2eee4');
function nota(x, rot, hora, itens, quem, k) {
  if (k <= 0) return; papel(g, NF, x, 560, { rot, alpha: k }); g.save(); g.translate(x + 200, 560); g.rotate(rot); g.globalAlpha = k; g.fillStyle = TINTA; g.textAlign = 'center'; g.font = '28px Maquina'; g.fillText('MERCADO TULIPA', 0, 70); g.font = '20px MaquinaR'; g.fillText(`12/05/2024 · ${hora}`, 0, 108); g.fillText(quem, 0, 140); g.textAlign = 'left'; g.font = '22px Maquina'; itens.forEach((s, i) => g.fillText(s, -160, 220 + i * 60)); g.restore();
}
function tomada5(t) {
  camera2D(t, W / 2, 960, 1.05, { amp: 3 }); fundo();
  const A = ['1 LEITE INTEGRAL', '1 PÃO DE FORMA', '4 MAÇÃS', '1 SABÃO EM PÓ'];
  nota(90, -0.03, '19h02', A, '(da Marina)', easeOut(prog(t, T(6) + 0.1, 0.4))); nota(590, 0.03, '19h04', [...A].reverse(), '(do lixo do nº 17)', easeOut(prog(t, P(6, 'nota fiscal') - 0.3, 0.4)));
  const to = P(6, 'ordem contrária'); if (t > to - 0.2) { const k = prog(t, to - 0.2, 0.8); A.forEach((s, i) => riscos(g, [[[440, 780 + i * 60], [lerp(440, 640, k), lerp(780 + i * 60, 780 + (3 - i) * 60, k)]]], { w: 2.4, cor: COR.verm, alpha: 0.85 })); }
  if (t > P(6, 'dois minutos')) medTxt(g, [W / 2, 1450], '2 minutos depois · ao contrário', { tam: 34, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(6, 'dois minutos')) / 0.3) });
  g.restore(); tag('O LIXO DO Nº 17', S(6), t);
  return { focos: [{ x: 540, y: 960, r: 950 }], amb: 0.2, mult: 1 };
}
// o bilhete espelhado
const BIL = papelTex(760, 380, 61, '#f4eedf');
function tomada6(t) {
  camera2D(t, W / 2, 940, 1.1, { amp: 4 }); fundo(); papel(g, BIL, 160, 560, { rot: -0.02 });
  espelho(540, () => escrita(g, 'Você está do lado errado.', 210, 770, 1, 0.1, { tam: 54, cor: TINTA }));
  // um espelho de mão por baixo mostra o texto direito
  const te = P(7, 'espelho'); if (t > te - 0.3) { const k = easeOut(prog(t, te - 0.3, 0.5)); g.save(); g.globalAlpha = k; g.fillStyle = '#9fb6cc'; g.fillRect(140, 1060, 800, 220); g.fillStyle = 'rgba(255,255,255,0.15)'; g.fillRect(140, 1060, 800, 30); tinta(g, [[140, 1060], [940, 1060], [940, 1280], [140, 1280], [140, 1060]], 1, { w: 3, over: 0 }); g.restore(); if (t > S(8)) escrita(g, 'Você está do lado errado.', 220, 1190, (t - S(8)) / 1.0, -0.1, { tam: 50, cor: '#1a1612' }); }
  g.restore(); tag('NA CAIXA DE CORREIO', S(7), t);
  return { focos: [{ x: 540, y: 950, r: 900 }], amb: 0.2, mult: 1 };
}
// cartório e registro de nascimento
const CERT = papelTex(820, 520, 71), REG = papelTex(820, 560, 72);
function tomada7(t) {
  const k = easeInOut(prog(t, S(10) - 0.3, 1.0)); camera2D(t, W / 2, lerp(700, 1220, k), 1.12, { amp: 4 }); fundo();
  papel(g, CERT, 130, 400, { rot: 0.01 }); g.save(); g.translate(130, 400); g.rotate(0.01); g.fillStyle = TINTA; g.font = '30px Serifa'; g.fillText('Cartório de Imóveis', 50, 70); g.font = '24px MaquinaR'; ['Casa nº 15 · 1998: Helena A. Siqueira.', 'Alugada desde então por imobiliária.', 'Casa nº 17 · 1998: Helena A. Siqueira.', '2023: doação para LÍVIA A. SIQUEIRA, filha.'].forEach((l, i) => g.fillText(l, 50, 160 + i * 52)); g.restore();
  circulo(g, 130 + 50 + 360, 400 + 160 + 3 * 52 - 8, 330, 32, easeInOut(prog(t, P(9, 'Lívia'), 0.5)), { seed: 4 });
  papel(g, REG, 130, 1000, { rot: -0.015 }); g.save(); g.translate(130, 1000); g.rotate(-0.015); g.fillStyle = TINTA; g.font = '30px Serifa'; g.fillText('Registro de nascimento (original)', 50, 70); g.font = '24px MaquinaR'; ['Nascida em 03/04/1989, às 7h05.', 'PARTO GEMELAR. Mãe: Helena A. Siqueira.', 'Entregue para adoção.', 'A segunda criança, nascida às 7h12,', 'permaneceu com a mãe.'].forEach((l, i) => g.fillText(l, 50, 160 + i * 52)); g.restore();
  circulo(g, 130 + 50 + 140, 1000 + 160 + 52 - 8, 150, 30, easeInOut(prog(t, P(10, 'gêmeas'), 0.5)), { seed: 6 }); circulo(g, 130 + 50 + 260, 1000 + 160 + 4 * 52 - 8, 290, 32, easeInOut(prog(t, P(10, 'A segunda'), 0.5)), { seed: 9 });
  g.restore(); tag('CARTÓRIO', S(9), t);
  return { focos: [{ x: 540, y: lerp(700, 1220, k) - 40, r: 950 }], amb: 0.2, mult: 1 };
}
// a geladeira e o banheiro
function tomada8(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 }); fundo();
  if (t < S(12)) {
    g.fillStyle = '#d9d2c2'; g.fillRect(240, 380, 600, 1240); tinta(g, [[240, 380], [840, 380], [840, 1620], [240, 1620], [240, 380]], 1, { w: 3, over: 6, cor: CLARO }); riscos(g, [[[240, 780], [840, 780]], [[780, 450], [780, 700]], [[780, 860], [780, 1200]]], { w: 4, cor: '#7a7266' });
    [[330, 520, -0.1], [560, 560, 0.08], [380, 960, 0.06], [600, 1000, -0.05], [460, 1280, 0.03]].forEach(([x, y, r], i) => { const k = easeOut(prog(t, P(11, 'fotos') + i * 0.2, 0.3)); if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(r); g.globalAlpha = k; g.fillStyle = '#efe9da'; g.fillRect(-90, -100, 180, 210); g.fillStyle = '#2a3036'; g.fillRect(-76, -86, 152, 140); g.fillStyle = '#e8c88a'; g.fillRect(-60, -70, 70, 90); g.fillStyle = '#1a1612'; g.beginPath(); g.arc(-25, -40, 14, 0, 6.3); g.fill(); g.fillRect(-42, -26, 34, 40); g.fillStyle = TINTA; g.font = '18px Caneta'; g.textAlign = 'center'; g.fillText(['ela usa a direita', 'pinta do lado errado', 'pelo vidro', 'logo', '...'][i], 0, 90); g.restore(); });
  } else { plantas(t, -99, { vidro: clamp((t - P(12, 'vidro')) / 0.4) }); const te = P(12, 'do outro lado'); if (t > te) { const x0 = 540 + 1.2 * 80, y = 1400 - 7 * 80; tinta(g, [[x0 + 60, y], [540, y]], prog(t, te, 0.4), { cor: '#9fc3ff', w: 2.4, over: 0 }); g.fillStyle = '#9fc3ff'; g.beginPath(); g.ellipse(x0 + 80, y, 18, 10, 0, 0, 6.3); g.fill(); } }
  g.restore(); tag(t < S(12) ? 'JUNHO  ·  DENTRO DO Nº 17' : 'A PAREDE DO MEIO', t < S(12) ? S(11) : S(12), t);
  return { focos: [{ x: 540, y: 1000, r: 950 }], amb: 0.18, mult: 1 };
}
// o escuro
function tomada9(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 }); fundo();
  const ta = P(13, 'apagou'), tp = P(13, 'passou');
  if (t > tp) { const k = (t - tp) / 1.4, x = lerp(-100, 1180, clamp(k)); g.fillStyle = 'rgba(10,8,6,0.9)'; g.beginPath(); g.ellipse(x, 820, 60, 74, 0, 0, 6.3); g.fill(); g.fillRect(x - 90, 890, 180, 520); }
  const tf = P(13, 'perfume'); if (t > tf) for (let i = 0; i < 8; i++) riscos(g, [Array.from({ length: 30 }, (_, j) => [200 + i * 90 + Math.sin(t * 2 + j * 0.3 + i) * 30, 1300 - j * 22])], { w: 4, cor: '#d9b8d0', alpha: 0.12 * clamp((t - tf) / 0.5) });
  g.restore();
  const mult = t < ta ? 1 : Math.max(0.08, [1, 0.3, 0.8, 0.1, 0][Math.min(4, Math.floor((t - ta) * 10))]);
  return { focos: [{ x: 540, y: 1000, r: 900 }], amb: 0.12, mult };
}
// ela acordou: escreve com a esquerda; a pinta mudou de lado
const REL = papelTex(820, 540, 81, '#ece4cf');
function tomada10(t) {
  camera2D(t, W / 2, 960, 1.05, { amp: 3 }); fundo();
  papel(g, REL, 130, 360, { rot: 0.02 }); g.save(); g.translate(130, 360); g.rotate(0.02);
  ['Desde então, estou bem.', 'Mais calma, até. Escrevo este', 'relato à mão, com a esquerda...'].forEach((l, i) => escrita(g, l, 50, 120 + i * 70, (t - S(14) - i * 0.6) / 0.9, 0.22, { tam: 42, cor: TINTA }));
  g.restore();
  const tm = P(14, 'esquerda'); if (t > tm) medTxt(g, [W / 2, 990], 'letra inclinada para trás: canhota', { tam: 30, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - tm) / 0.3) });
  const p = rosto(540, 1230, 0.9, 'dir', clamp((t - P(14, 'Tocando')) / 0.4));
  if (p && t > P(14, 'direita')) { circulo(g, p[0], p[1], 36, 32, easeInOut(prog(t, P(14, 'direita'), 0.5)), { seed: 5 }); medTxt(g, [W / 2, 1640], 'pinta: bochecha DIREITA', { tam: 32, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(14, 'direita') - 0.3) / 0.3) }); }
  g.restore(); tag('NA MANHÃ SEGUINTE', S(14), t);
  return { focos: [{ x: 540, y: 1050, r: 950 }], amb: 0.2, mult: 1 };
}
const tomadaFim = t => cartaoFinal(t, T(ULT), N, 10, { linhas: LINHAS });
const LEG = [
  [2, 'A Marina tem 35 anos. É destra. Tem uma pinta na bochecha esquerda.', { 'destra': CLARO, 'bochecha esquerda': CLARO }],
  [3, 'Em 2023, ela alugou a casa 15. A 17, colada, é o reflexo exato dela.', { 'reflexo exato': VERM_TXT }],
  [4, 'A 17 parecia vazia. Até a noite em que ela viu uma mulher na cozinha de lá.', { 'uma mulher': VERM_TXT }],
  [5, 'Quando a Marina levantou a mão direita, a mulher levantou a esquerda.', { 'a esquerda': VERM_TXT }],
  [6, 'O lixo da 17 tinha as mesmas compras que o dela. A nota fiscal, 2 minutos depois. Na ordem contrária.', { 'Na ordem contrária.': VERM_TXT }],
  [7, 'Na caixa de correio, um bilhete que ela não conseguia ler. Até segurar diante do espelho.', {}],
  [8, '"Você está do lado errado."', { '"Você está do lado errado."': VERM_TXT }],
  [9, 'No cartório, a dona das duas casas: Helena Siqueira. Que deu a 17 para a filha, Lívia.', { 'Lívia': VERM_TXT }],
  [10, 'E o registro de nascimento da Marina, de antes da adoção: parto de gêmeas. A segunda ficou com a mãe.', { 'parto de gêmeas': VERM_TXT }],
  [11, 'Em junho, um chaveiro abriu a 17. Na geladeira, fotos da Marina, tiradas pelas janelas.', { 'fotos da Marina': VERM_TXT }],
  [12, 'No banheiro, na parede do meio, não tinha espelho. Tinha um vidro. E, do outro lado, o banheiro dela.', { 'um vidro': VERM_TXT }],
  [13, 'A luz apagou. Alguém passou por ela no escuro. Com o perfume dela.', { 'Com o perfume dela.': VERM_TXT }],
  [14, 'Ela acordou na própria casa. E escreveu tudo isso com a mão esquerda. Tocando a pinta da bochecha direita.', { 'mão esquerda': VERM_TXT, 'bochecha direita': VERM_TXT }],
];
rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(3), tomada3], [T(4), tomada4], [T(6), tomada5], [T(7), tomada6], [T(9), tomada7], [T(11), tomada8], [T(13), tomada9], [T(14), tomada10], [T(ULT), tomadaFim]], legendasFn: legendas(N, LEG) });
