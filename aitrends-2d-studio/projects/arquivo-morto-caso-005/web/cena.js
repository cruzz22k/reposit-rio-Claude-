// Caso 005 — "A escada de treze degraus", estilo Planta no escuro. O desenho principal é o corte da escada.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, trajeto, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, camera, mao, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, caminho, medTxt, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(18) + 1.4;
const T = i => S(i) - 0.25;
const LINHAS = ['CASO 005 · TRAVESSA DOS IPÊS, 9', 'CORTE DA ESCADA · 1974'];
const PEROBA = '#7a4a2a', PEROBA_CLARA = '#b98a5a';

// ---------- o corte da escada (2D): 1 m = 230 px; origem no pé do 1º espelho, no chão antigo ----------
const K = 230, X0 = 170, Y0 = 1150, PI = 0.28 * K, ES = 0.18 * K, YL = Y0 - 12 * ES;   // piso, espelho, laje de cima
function corte(t, o = {}) {
  const { treze = false, contaAte = 0, contaDesce = null, chaoNovo = false, chaoAntigo = 1, cotas = false, comparar = 0, laje = 0, noite = 0, cor13 = 0 } = o;
  fundo();
  // laje de cima (original) e parede do hall
  const xl = X0 + 12 * PI;
  g.fillStyle = '#1e1913'; g.fillRect(xl, YL - 34, 1080 - xl, 34);
  riscos(g, Array.from({ length: 14 }, (_, i) => [[xl + i * 20, YL], [xl + i * 20 + 34, YL - 34]]).map(s => s.map(q => [Math.min(1080, q[0]), q[1]])), { w: 1, alpha: 0.5 });
  tinta(g, [[xl, YL - 34], [1080, YL - 34]], 1, { w: 2.4, over: 0 }); tinta(g, [[xl, YL], [1080, YL]], 1, { w: 2.4, over: 0 }); tinta(g, [[xl, YL - 34], [xl, YL]], 1, { w: 2.4, over: 0 });
  tinta(g, [[60, YL - 260], [60, Y0 + 300]], 1, { w: 2.8, over: 0 });
  if (laje > 0) { medTxt(g, [xl + 40, YL - 60], 'LAJE ORIGINAL · 1974', { tam: 26, cor: CLARO, alpha: laje }); riscos(g, [[[xl, YL - 8], [1080, YL - 8]]], { w: 5, cor: COR.ambar, alpha: 0.6 * laje }); }
  // chão do hall: antigo (taco) ou novo (cerâmica), e a terra embaixo
  const yc = chaoNovo ? Y0 + ES : Y0;
  g.fillStyle = '#18140f'; g.fillRect(60, yc, 1020, 340);
  riscos(g, Array.from({ length: 40 }, (_, i) => [[60 + i * 28, yc + 340], [60 + i * 28 + 60, yc + 40]]).map(s => s.map(q => [Math.max(60, Math.min(1080, q[0])), q[1]])), { w: 1, alpha: 0.18 });
  g.fillStyle = chaoNovo ? '#cdbb92' : '#5a3a22'; g.fillRect(60, yc - 8, 1020, 8);
  if (!chaoNovo) riscos(g, Array.from({ length: 34 }, (_, i) => [[60 + i * 30, yc - 8], [60 + i * 30, yc]]), { w: 1, cor: '#2a1a10', alpha: 0.8 });
  else riscos(g, Array.from({ length: 17 }, (_, i) => [[60 + i * 60, yc - 8], [60 + i * 60, yc]]), { w: 1, cor: '#8a7a58', alpha: 0.9 });
  tinta(g, [[60, yc - 8], [1080, yc - 8]], 1, { w: 2.4, over: 0 });
  // os degraus (peroba): 12, ou 13 com o degrau mais claro embaixo
  const deg = [];
  for (let i = 1; i <= 12; i++) deg.push({ x: X0 + (i - 1) * PI, y: Y0 - i * ES, n: i + (treze ? 1 : 0), novo: false });
  if (treze) deg.unshift({ x: X0 - PI, y: Y0, n: 1, novo: true });
  for (const d of deg) {
    g.fillStyle = d.novo ? PEROBA_CLARA : PEROBA; g.fillRect(d.x, d.y, PI + 6, 12); g.fillRect(d.x, d.y, 8, ES);
    tinta(g, [[d.x, d.y + ES], [d.x, d.y], [d.x + PI + 6, d.y]], 1, { w: 2, over: 3, seed: d.n, cor: d.novo ? '#f0d9b0' : COR.osso });
  }
  // a longarina por baixo
  const yb0 = treze ? Y0 + ES : Y0, xb0 = treze ? X0 - PI : X0;
  tinta(g, [[xb0 + 20, yb0], [xl, YL + 30]], 1, { w: 2, over: 0, alpha: 0.7 });
  // números contados (subindo ou descendo)
  if (contaAte > 0) deg.forEach((d, k) => { const a = clamp(contaAte - k); if (a > 0) medTxt(g, [d.x + PI / 2 - 8, d.y - 18], String(d.n), { tam: 34, alinh: 'center', alpha: a, cor: d.n === 13 ? VERM_TXT : CLARO, fonte: 'Caneta' }); });
  if (contaDesce) { const { k, t0 } = contaDesce; deg.slice().reverse().forEach((d, j) => { if (j < k) medTxt(g, [d.x + PI / 2 - 8, d.y - 18], String(12 - j), { tam: 34, alinh: 'center', alpha: 0.85, cor: '#c9d2dc', fonte: 'Caneta' }); }); }
  if (cor13 > 0) { const x = X0 + PI * 0.5, y = Y0 + 150, gl = g.createRadialGradient(x, y, 0, x, y, 120); gl.addColorStop(0, `rgba(200,40,30,${0.35 * cor13})`); gl.addColorStop(1, 'rgba(200,40,30,0)'); g.fillStyle = gl; g.fillRect(x - 120, y - 120, 240, 240); medTxt(g, [x, y + 20], '13', { tam: 90, alinh: 'center', cor: VERM_TXT, alpha: cor13, fonte: 'Caneta' }); }
  // cotas: 12 × 18 = 2,16 ou 13 × 18 = 2,34; e o chão antigo, tracejado
  if (cotas) { const yA = treze ? Y0 + ES : Y0; cota(g, [960, yA], [960, YL], 1, treze ? '2,34 m' : '2,16 m', { cor: CLARO, w: 2, tam: 34, lado: -1 }); deg.slice(0, 3).forEach(d => cota(g, [d.x - 22, d.y + ES], [d.x - 22, d.y], 1, null, { cor: COR.cinza, w: 1.2, alpha: 0.8 })); medTxt(g, [deg[0].x - 120, deg[0].y + ES / 2 + 10], '18', { tam: 26, cor: COR.cinza }); }
  if (comparar > 0) { g.save(); g.setLineDash([12, 9]); tinta(g, [[60, Y0], [1080, Y0]], comparar, { cor: COR.verm, w: 2.6, over: 0 }); g.restore(); medTxt(g, [700, Y0 - 16], 'chão antigo (1974)', { tam: 28, cor: VERM_TXT, alpha: comparar }); cota(g, [640, Y0], [640, Y0 + ES], comparar, null, { cor: COR.verm, w: 2.4 }); medTxt(g, [660, Y0 + ES - 4], '18 cm', { tam: 30, cor: VERM_TXT, alpha: comparar }); }
  if (noite > 0) { g.fillStyle = `rgba(10,14,22,${0.35 * noite})`; g.fillRect(0, 0, W, H); }
  return deg;
}

// ---------- tomada 1: título ----------
function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 }); fundo();
  // uma escada fantasma ao fundo
  riscos(g, Array.from({ length: 13 }, (_, i) => [[240 + i * 46, 1500 - i * 30], [240 + i * 46, 1500 - (i + 1) * 30], [240 + (i + 1) * 46, 1500 - (i + 1) * 30]]), { w: 1.6, alpha: 0.18 * prog(t, 0.3, 1.5) });
  prancha(g, t, { linhas: LINHAS, folha: '05/13' });
  const tag = 'ARQUIVO MORTO  ·  CASO 005'; datilo(g, tag, W / 2, 690, (t - 0.45) / 0.65 * tag.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'A ESCADA DE', 885, P(1, 'A escada')); titulo(g, t, 'TREZE DEGRAUS', 1005, P(1, 'treze'));
  const pr = prog(t, P(1, 'degraus'), 0.6); if (pr > 0) { const x0 = 330, y0 = 1110; riscos(g, Array.from({ length: Math.ceil(13 * pr) }, (_, i) => [[x0 + i * 32, y0], [x0 + i * 32 + 16, y0]]), { w: 4, cor: COR.verm, alpha: 1 }); medTxt(g, [x0 + 13 * 32 + 20, y0 + 10], '13', { tam: 36, cor: VERM_TXT, alpha: pr }); }
  g.restore();
  return { focos: [{ x: 540, y: 900, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}

// ---------- tomada 2: a encomenda do avô ----------
const PED = papelTex(820, 1100, 51);
function tomada2(t) {
  const k = easeInOut(prog(t, S(3) - 0.3, 1.2)); camera2D(t, W / 2, lerp(820, 1080, k), lerp(1.12, 1.18, k), { amp: 4 });
  fundo(); papel(g, PED, 130, 340, { rot: -0.012 });
  g.save(); g.translate(130, 340); g.rotate(-0.012);
  g.fillStyle = TINTA; g.font = '42px Serifa'; g.fillText('Serraria Santa Rita', 50, 90); g.font = '22px Maquina'; g.fillText('PEDIDO Nº 0381 · 11/03/1974', 50, 130); g.fillRect(50, 146, 720, 2);
  g.font = '25px MaquinaR'; ['Cliente: Aldo Bernardes', 'Escada reta para sobrado', '12 degraus de peroba-rosa', 'piso 28 cm · espelho 18 cm', 'altura do hall ao andar de cima: 2,16 m'].forEach((l, i) => g.fillText(l, 50, 205 + i * 46));
  // o desenho do marceneiro, a lápis, no pé da folha: doze degraus, um por um
  const pd = (t - P(2, 'doze')) / 1.2;
  for (let i = 0; i < 12; i++) { const a = clamp(pd * 12 - i); if (a <= 0) continue; const x = 90 + i * 52, y = 900 - i * 34; riscos(g, [[[x, y], [x, y - 34], [x + 52, y - 34]]], { w: 2, cor: '#4a4234', alpha: a }); }
  if (t > P(3, 'apóstolo')) { g.globalAlpha = clamp((t - P(3, 'apóstolo')) / 0.4); for (let i = 0; i < 12; i++) { const x = 90 + i * 52 + 26, y = 900 - i * 34 - 50; g.fillStyle = '#4a4234'; g.font = '22px Caneta'; g.textAlign = 'center'; g.fillText(['P', 'A', 'T', 'J', 'J', 'F', 'B', 'M', 'T', 'T', 'S', 'J'][i], x, y); } g.textAlign = 'left'; g.globalAlpha = 1; escrita(g, '"um para cada apóstolo"', 330, 1010, (t - P(3, 'apóstolo')) / 1.0, -0.1, { tam: 38, cor: '#4a4234' }); }
  g.restore();
  circulo(g, 130 + 50 + 170, 340 + 205 + 2 * 46 - 10, 190, 30, easeInOut(prog(t, P(2, 'doze'), 0.5)), { seed: 3 });
  circulo(g, 130 + 50 + 330, 340 + 205 + 4 * 46 - 10, 330, 30, easeInOut(prog(t, P(2, 'doze') + 0.5, 0.5)), { seed: 6, cor: '#8a6a40' });
  g.restore();
  if (t > S(2)) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, '1974  ·  O AVÔ MARCENEIRO', 116, 242, (t - S(2)) / 0.6 * 25, { tam: 40, cor: COR.osso, esp: 3 }); }
  return { focos: [{ x: 560, y: lerp(800, 1200, k), r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 3: Júlia aprende a contar ----------
function tomada3(t) {
  camera2D(t, 580, 930, 1.12 + 0.05 * easeInOut(prog(t, T(4), 4)), { amp: 4 });
  corte(t, { contaAte: (t - P(4, 'contar')) * 4.2 });
  g.restore();
  if (t > S(4)) datilo(sb, 'O HALL  ·  CORTE DA ESCADA', 84, 242, (t - S(4)) / 0.6 * 26, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 620, y: 930, r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 4: a carta batida à máquina ----------
const CARTA = papelTex(800, 760, 61, '#efe9da');
function tomada4(t) {
  camera2D(t, W / 2, 900, 1.15, { amp: 4 }); fundo(); papel(g, CARTA, 140, 470, { rot: 0.01 });
  g.save(); g.translate(140, 470); g.rotate(0.01);
  const linhas = ['14 de dezembro de 1996', '', 'Nelson,', '', 'Eu vou embora com outra pessoa.', 'Não me procure. Cuida da menina.', '', '                    SANDRA'];
  let n = (t - P(5, 'carta') + 0.6) * 22; linhas.forEach((l, i) => { datilo(g, l, 60, 110 + i * 64, n, { fonte: 'Datilo', tam: 32, cor: TINTA }); n -= l.length + 3; });
  g.restore();
  const ts = P(5, 'máquina'); circulo(g, 140 + 60 + 390, 470 + 110 + 7 * 64 - 12, 120, 36, easeInOut(prog(t, ts, 0.5)), { seed: 4 });
  if (t > ts + 0.4) { medTxt(g, [W / 2 + 120, 470 + 680], 'até a assinatura é datilografada', { tam: 28, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - ts - 0.4) / 0.4) }); }
  g.restore();
  if (t > S(5)) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, 'DEZEMBRO  ·  1996', 116, 242, (t - S(5)) / 0.5 * 17, { tam: 40, cor: COR.osso, esp: 3 }); }
  return { focos: [{ x: 540, y: 820, r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 5: a máquina de escrever do escritório ----------
function maquinaDesenho(c, x, y, s, p) {
  const L = pts => tinta(c, pts.map(([a, b]) => [x + a * s, y + b * s]), p, { w: 2.4, over: 4 });
  L([[-200, 60], [200, 60], [230, 140], [-230, 140], [-200, 60]]); L([[-180, 60], [-150, -40], [150, -40], [180, 60]]);
  L([[-240, -70], [240, -70]]); L([[-260, -90], [-260, -50]]); L([[260, -90], [260, -50]]); L([[-120, -70], [-110, -190], [110, -190], [120, -70]]);
  if (p >= 1) { const t = []; for (let r = 0; r < 4; r++) for (let k = 0; k < 10 - r; k++) t.push(Array.from({ length: 9 }, (_, i) => [x + (-170 + r * 18 + k * 36 + Math.cos(i / 8 * 6.3) * 12) * s, y + (80 + r * 18 + Math.sin(i / 8 * 6.3) * 7) * s])); riscos(c, t, { w: 1.4, alpha: 0.85 }); }
}
function tomada5(t) {
  camera2D(t, W / 2, 960, 1.0, { amp: 4 }); fundo();
  // em cima: a casa, sem máquina; embaixo: o escritório do pai
  tinta(g, [[160, 300], [920, 300], [920, 760], [160, 760], [160, 300]], prog(t, T(6), 0.6), { w: 2, over: 8, alpha: 0.7 });
  medTxt(g, [540, 360], 'EM CASA', { tam: 30, alinh: 'center', cor: COR.cinza });
  maquinaDesenho(g, 540, 560, 0.7, prog(t, T(6) + 0.2, 0.8)); if (t > P(6, 'nunca')) { const k = prog(t, P(6, 'nunca'), 0.4); tinta(g, [[300, 380], [780, 720]], k, { cor: COR.verm, w: 6, over: 0 }); tinta(g, [[780, 380], [300, 720]], prog(t, P(6, 'nunca') + 0.2, 0.4), { cor: COR.verm, w: 6, over: 0 }); }
  tinta(g, [[160, 860], [920, 860], [920, 1320], [160, 1320], [160, 860]], prog(t, P(6, 'pai') - 0.3, 0.6), { w: 2, over: 8, alpha: 0.7 });
  medTxt(g, [540, 920], 'ESCRITÓRIO DO PAI', { tam: 30, alinh: 'center', cor: COR.cinza, alpha: prog(t, P(6, 'pai') - 0.3, 0.4) });
  maquinaDesenho(g, 540, 1120, 0.7, prog(t, P(6, 'pai'), 0.8)); if (t > P(6, 'escritório')) circulo(g, 540, 1100, 230, 150, easeInOut(prog(t, P(6, 'escritório'), 0.6)), { seed: 7 });
  g.restore();
  return { focos: [{ x: 540, y: t < P(6, 'pai') ? 560 : 1100, r: 820 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 6: duas semanas na tia (calendário) ----------
const CAL = papelTex(880, 960, 71);
function tomada6(t) {
  camera2D(t, W / 2, H / 2 + 20, 1.04, { amp: 4, rot: 0.02 }); fundo(); papel(g, CAL, 100, 520);
  g.save(); g.translate(100, 520);
  g.fillStyle = TINTA; g.font = '64px Serifa'; g.fillText('Dezembro', 50, 100); g.font = '30px Maquina'; g.fillStyle = '#6b604d'; g.fillText('1996', 380, 100);
  const cw = 112, ch = 118, gx = 48, gy = 170; g.font = '24px Maquina'; 'DSTQQSS'.split('').forEach((d, i) => g.fillText(d, gx + i * cw + 44, gy - 14));
  const grade = []; for (let i = 0; i <= 7; i++) grade.push([[gx + i * cw, gy], [gx + i * cw, gy + 5 * ch]]); for (let j = 0; j <= 5; j++) grade.push([[gx, gy + j * ch], [gx + 7 * cw, gy + j * ch]]); riscos(g, grade, { w: 1.2, cor: TINTA, alpha: 0.5 });
  const pos = d => { const k = d - 1; return [gx + (k % 7) * cw, gy + Math.floor(k / 7) * ch]; };      // 1º/12/1996 foi um domingo
  g.font = '30px Maquina'; for (let d = 1; d <= 31; d++) { const [x, y] = pos(d); g.fillStyle = (d - 1) % 7 === 0 ? '#8f1d15' : TINTA; g.fillText(String(d), x + 10, y + 36); }
  const p = prog(t, P(7, 'duas'), 1.4); riscos(g, [[...[15, 21].map(d => pos(d)).map(([x, y], i) => [i ? x + cw - 10 : x + 10, y + 80])], [...[22, 28].map(d => pos(d)).map(([x, y], i) => [i ? x + cw - 10 : x + 10, y + 80])]].map((s, i) => [s[0], [lerp(s[0][0], s[1][0], clamp(p * 2 - i)), s[1][1]]]), { w: 6, cor: '#2f3f66', alpha: 0.75 });
  if (p > 0.3) { g.fillStyle = '#2f3f66'; g.font = '32px Caneta'; const [x, y] = pos(15); g.fillText('casa da tia', x + 10, y + 62); }
  { const [x, y] = pos(14); if (t > S(7)) { g.fillStyle = COR.verm; g.font = '26px Caneta'; g.fillText('a carta', x + 14, y + 92); } }
  g.restore(); g.restore();
  if (t > S(7)) datilo(sb, 'DUAS SEMANAS FORA', 84, 242, (t - S(7)) / 0.5 * 17, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 560, y: 1020, r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 7: o piso novo; deu treze ----------
function tomada7(t) {
  camera2D(t, 580, 960, 1.12 + 0.05 * easeInOut(prog(t, T(8), 4)), { amp: 4 });
  const tc = P(9, 'subiu'), deg = corte(t, { treze: true, chaoNovo: true, contaAte: (t - tc) * 5.5 });
  const tn = P(8, 'novo'); if (t > tn) { medTxt(g, [330, 720], 'PISO NOVO  ·  cerâmica bege', { tam: 30, alinh: 'center', cor: '#e6d6ae', alpha: clamp((t - tn) / 0.4) }); }
  const tu = P(8, 'umidade'); if (t > tu) medTxt(g, [330, 766], '"por causa da umidade"', { tam: 26, alinh: 'center', cor: COR.cinza, alpha: clamp((t - tu) / 0.4) });
  const t13 = P(9, 'treze'); if (t > t13) { const d = deg[0]; tinta(g, [[d.x + PI / 2, d.y - 50], [d.x + PI / 2 - 60, d.y - 200], [d.x + PI / 2 + 140, d.y - 200]], prog(t, t13, 0.4), { cor: COR.verm, w: 2, over: 0 }); medTxt(g, [d.x + PI / 2 - 50, d.y - 214], 'degrau mais claro', { tam: 28, cor: VERM_TXT }); }
  g.restore();
  if (t > S(8)) datilo(sb, 'DE VOLTA  ·  FIM DE 1996', 84, 242, (t - S(8)) / 0.5 * 24, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 600, y: 980, r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 8: a voz que desce contando ----------
function tomada8(t) {
  camera2D(t, 580, 990, 1.14 + 0.06 * easeInOut(prog(t, T(10), T(12) - T(10))), { amp: 3 });
  const td = P(10, 'Doze'), k = t < td ? 0 : Math.min(12, Math.floor((t - td) * 2.4) + 1), t13 = P(11, 'treze');
  corte(t, { treze: true, chaoNovo: true, contaDesce: { k: t < P(11, 'Até o um') ? Math.min(k, 3 + Math.floor(Math.max(0, t - P(10, 'Dez')) * 6)) : 12 }, noite: 1, cor13: clamp((t - t13) / 0.5) });
  g.restore();
  if (t > S(10)) datilo(sb, 'DE MADRUGADA', 84, 242, (t - S(10)) / 0.5 * 12, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 620, y: 900, r: 900, i: 0.95, cor: [190, 205, 230] }, ...(t > t13 ? [{ x: X0 + PI * 0.5 - 30, y: 1230, r: 420, i: 0.8, cor: [255, 70, 50] }] : [])], amb: 0.15, mult: 1 };
}

// ---------- tomada 9: o cartão-postal ----------
const POST = papelTex(820, 560, 81, '#eee6d2');
function tomada9(t) {
  camera2D(t, W / 2, 940, 1.1, { amp: 4 }); fundo();
  const vira = easeInOut(prog(t, P(12, 'Estou') - 0.5, 0.6)), sx = Math.cos(vira * Math.PI);
  g.save(); g.translate(540, 900); g.rotate(-0.03); g.scale(sx, 1); g.translate(-410, -280); papel(g, POST, 0, 0);
  if (sx > 0) { g.fillStyle = '#3c5a74'; g.fillRect(30, 30, 760, 500); riscos(g, Array.from({ length: 8 }, (_, i) => Array.from({ length: 30 }, (_, k) => [30 + k * 26, 340 + i * 24 + Math.sin(k * 0.8 + i) * 6])), { w: 2, cor: '#a9c6d8', alpha: 0.8 }); g.fillStyle = '#d9c38c'; g.fillRect(30, 420, 760, 110);
    riscos(g, [[[600, 420], [620, 200]], ...Array.from({ length: 6 }, (_, i) => [[620, 200], [620 + Math.cos(i * 1.05) * 120, 200 + Math.sin(i * 1.05) * 50 + 30]])], { w: 4, cor: '#2c3a28' }); g.fillStyle = '#f2ead6'; g.font = '64px Serifa'; g.fillText('Salvador', 60, 110); }
  else { g.save(); g.scale(-1, 1); g.translate(-820, 0); riscos(g, [[[410, 40], [410, 520]]], { w: 1.4, cor: TINTA, alpha: 0.6 }); riscos(g, Array.from({ length: 4 }, (_, i) => [[450, 300 + i * 50], [780, 300 + i * 50]]), { w: 1, cor: TINTA, alpha: 0.5 });
    escrita(g, 'Estou bem.', 50, 170, (t - P(12, 'Estou')) / 0.6, -0.05, { tam: 46, cor: TINTA, fonte: 'Datilo' }); escrita(g, 'Não me procurem.', 50, 240, (t - P(12, 'Não me')) / 0.8, -0.05, { tam: 46, cor: TINTA, fonte: 'Datilo' }); escrita(g, 'S.', 50, 320, (t - P(12, 'Não me') - 0.8) / 0.3, 0, { tam: 46, cor: TINTA, fonte: 'Datilo' });
    // carimbo dos Correios
    g.save(); g.translate(640, 140); g.rotate(-0.25); g.strokeStyle = '#4a3a6a'; g.globalAlpha = 0.85; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 90, 0, 6.3); g.stroke(); g.beginPath(); g.arc(0, 0, 70, 0, 6.3); g.stroke(); g.fillStyle = '#4a3a6a'; g.font = '18px Maquina'; g.textAlign = 'center'; g.fillText('AG. CENTRAL', 0, -28); g.fillText('ITAJUBEIRA', 0, 4); g.fillText('03/02/1997', 0, 36); g.restore();
    g.restore(); }
  g.restore();
  const tc = P(13, 'carimbo'); if (t > tc) { circulo(g, 540 + 150, 900 - 150, 140, 120, easeInOut(prog(t, tc, 0.5)), { seed: 5 }); medTxt(g, [W / 2, 1300], 'Itajubeira fica a 1.900 km de Salvador', { tam: 30, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - tc - 0.3) / 0.4) }); }
  g.restore();
  if (t > S(12)) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, '1997  ·  CARTÃO-POSTAL', 116, 242, (t - S(12)) / 0.5 * 22, { tam: 40, cor: COR.osso, esp: 3 }); }
  return { focos: [{ x: 540, y: 900, r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 10: as medidas da Júlia (2022) ----------
function tomada10(t) {
  camera2D(t, 590, 940, 1.1, { amp: 3 });
  const t15 = S(15), t16 = S(16);
  corte(t, { treze: true, chaoNovo: true, cotas: t > P(14, 'dezoito') - 0.2, comparar: clamp((t - P(15, 'doze')) / 0.6), laje: clamp((t - t16) / 0.5) });
  if (t > P(15, 'Dois metros')) { cota(g, [1020, Y0], [1020, YL], prog(t, P(15, 'Dois metros'), 0.5), '2,16 m', { cor: COR.verm, w: 2, tam: 30, lado: 1 }); }
  if (t > t16 + 0.6) { tinta(g, [[300, 760], [300, 1000]], prog(t, t16 + 0.6, 0.5), { cor: COR.ambar, w: 3, over: 0 }); tinta(g, [[285, 980], [300, 1000], [315, 980]], prog(t, t16 + 1.0, 0.3), { cor: COR.ambar, w: 3, over: 0 }); medTxt(g, [320, 880], 'quem desceu foi o chão', { tam: 30, cor: COR.ambar, alpha: clamp((t - t16 - 0.9) / 0.4) }); }
  g.restore();
  if (t > S(14)) datilo(sb, '2022  ·  AS MEDIDAS DA JÚLIA', 84, 242, (t - S(14)) / 0.6 * 27, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 640, y: 930, r: 980 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 11: a gaveta trancada ----------
const GAV = papelTex(W, H, 91, '#3a2a1c');
function tomada11(t) {
  camera2D(t, W / 2, 980, 1.05 + 0.08 * easeInOut(prog(t, T(17), 3)), { amp: 4 });
  g.drawImage(GAV, 0, 0); g.strokeStyle = '#120d09'; g.lineWidth = 50; g.strokeRect(80, 420, 920, 1100); tinta(g, [[55, 395], [1025, 395], [1025, 1545], [55, 1545], [55, 395]], 1, { w: 2.2, over: 8 });
  // carteira de identidade
  g.save(); g.translate(300, 860); g.rotate(-0.08); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 20; g.fillStyle = '#c9d8c0'; g.fillRect(-180, -120, 360, 240); g.shadowBlur = 0;
  g.fillStyle = '#2c3a28'; g.font = '16px Maquina'; g.fillText('REPÚBLICA FEDERATIVA DO BRASIL', -165, -90); g.font = '14px MaquinaR'; g.fillText('CARTEIRA DE IDENTIDADE', -165, -66);
  g.fillStyle = '#9aa892'; g.fillRect(-160, -40, 110, 140); g.fillStyle = '#2c3a28'; g.beginPath(); g.ellipse(-105, 10, 34, 42, 0, 0, 6.3); g.fill(); g.fillRect(-150, 60, 90, 40);
  g.font = '18px MaquinaR'; g.fillText('NOME', -30, -20); g.font = '22px Maquina'; g.fillText('SANDRA B.', -30, 8); g.font = '16px MaquinaR'; g.fillText('NASC. 07/05/1966', -30, 50); g.restore();
  // aliança
  const ax = 740, ay = 1120; g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 16; g.strokeStyle = '#c9a24a'; g.lineWidth = 22; g.beginPath(); g.ellipse(ax, ay, 90, 70, 0.3, 0, 6.3); g.stroke(); g.shadowBlur = 0; g.strokeStyle = '#f4dc8a'; g.lineWidth = 4; g.beginPath(); g.ellipse(ax, ay, 90, 70, 0.3, 3.6, 5.2); g.stroke(); g.restore();
  medTxt(g, [ax, ay + 140], 'Nelson · 1988', { tam: 24, alinh: 'center', cor: COR.cinza, fonte: 'Caneta' });
  const ti = P(17, 'identidade'), tl = P(17, 'aliança'); circulo(g, 300, 860, 230, 170, easeInOut(prog(t, ti, 0.5)), { seed: 4 }); circulo(g, ax, ay, 150, 130, easeInOut(prog(t, tl, 0.5)), { seed: 7 });
  g.restore();
  if (t > S(17)) datilo(sb, 'GAVETA TRANCADA DO PAI  ·  2021', 84, 242, (t - S(17)) / 0.6 * 31, { tam: 32, cor: COR.osso, esp: 2 });
  return { focos: [{ x: 520, y: 980, r: 900 }], amb: 0.18, mult: 1 };
}

const tomadaFim = t => cartaoFinal(t, T(18), N, 5, { linhas: LINHAS });

const LEG = [
  [2, 'Em 1974, o avô Aldo, marceneiro, fez uma escada de peroba com 12 degraus.', { '12 degraus': CLARO }],
  [3, '"Um para cada apóstolo", ele dizia.', {}],
  [4, 'A neta, Júlia, aprendeu a contar naquela escada. Até 12.', { 'Até 12.': CLARO }],
  [5, 'Em dezembro de 96, a mãe da Júlia foi embora. Deixou uma carta batida à máquina.', { 'batida à máquina': VERM_TXT }],
  [6, 'Naquela casa nunca teve máquina de escrever. O pai tinha uma, no escritório.', { 'O pai tinha uma': VERM_TXT }],
  [7, 'A Júlia passou duas semanas na casa da tia.', { 'duas semanas': CLARO }],
  [8, 'Quando voltou, o piso do hall era novo. "Por causa da umidade", o pai disse.', { 'piso do hall era novo': VERM_TXT }],
  [9, 'Ela subiu contando, como sempre. Deu 13.', { 'Deu 13.': VERM_TXT }],
  [10, 'Desde então, de madrugada, uma mulher desce a escada contando baixinho. 12. 11. 10.', { 'uma mulher desce a escada': VERM_TXT }],
  [11, 'Até o 1. E, depois do 1, quando não tem mais degrau nenhum, ela diz: 13.', { 'ela diz: 13.': VERM_TXT }],
  [12, 'Em 97, chegou um cartão-postal de Salvador. "Estou bem. Não me procurem."', { 'Salvador': CLARO }],
  [13, 'O carimbo dos Correios era da própria cidade.', { 'da própria cidade': VERM_TXT }],
  [14, 'Em 2022, a Júlia mediu a escada. 13 degraus de 18 centímetros.', { '13 degraus de 18 centímetros': CLARO }],
  [15, 'A encomenda do avô dizia: 12 degraus. 2,16 m de altura.', { '2,16 m': VERM_TXT }],
  [16, 'E o andar de cima nunca mudou de lugar.', { 'nunca mudou de lugar': VERM_TXT }],
  [17, 'Na gaveta trancada do pai, estavam a identidade e a aliança da mãe.', { 'a identidade e a aliança da mãe': VERM_TXT }],
];

rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(4), tomada3], [T(5), tomada4], [T(6), tomada5], [T(7), tomada6], [T(8), tomada7], [T(10), tomada8], [T(12), tomada9], [T(14), tomada10], [T(17), tomada11], [T(18), tomadaFim]], legendasFn: legendas(N, LEG) });
