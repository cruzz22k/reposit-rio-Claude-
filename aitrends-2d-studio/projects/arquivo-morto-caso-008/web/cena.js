// Caso 008 — "O apartamento 7B, que não existe", estilo Planta no escuro.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, medTxt, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N, ULT = N.TL.length;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(ULT) + 1.4;
const T = i => S(i) - 0.25;
const LINHAS = ['CASO 008 · ED. SOLAR DAS PALMEIRAS', 'PAINEL DO INTERFONE · 7º ANDAR'];
const FRIO = [170, 200, 255];
const tag = (s, t0, t, big = false) => { if (t <= t0) return; if (big) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, s, 116, 242, (t - t0) / 0.6 * s.length, { tam: 40, cor: COR.osso, esp: 3 }); } else datilo(sb, s, 84, 242, (t - t0) / 0.6 * s.length, { tam: 32, cor: COR.osso, esp: 2 }); };

function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 }); fundo();
  riscos(g, Array.from({ length: 13 }, (_, i) => [[300, 1640 - i * 60], [780, 1640 - i * 60]]).concat([[[300, 1640], [300, 920]], [[780, 1640], [780, 920]]]), { w: 1.4, alpha: 0.18 * prog(t, 0.3, 1.5) });
  prancha(g, t, { linhas: LINHAS, folha: '08/13' });
  const s = 'ARQUIVO MORTO  ·  CASO 008'; datilo(g, s, W / 2, 690, (t - 0.45) / 0.65 * s.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'O APARTAMENTO 7B,', 885, P(1, 'O apartamento')); titulo(g, t, 'QUE NÃO EXISTE', 1005, P(1, 'que não'));
  if (t > P(1, 'existe')) { const k = clamp((t - P(1, 'existe')) / 0.3), on = Math.floor(t * 3) % 2; g.save(); g.globalAlpha = k; g.fillStyle = on ? '#ff3a2a' : '#5a1a14'; g.beginPath(); g.arc(540, 1110, 14, 0, 6.3); g.fill(); g.restore(); }
  g.restore();
  return { focos: [{ x: 540, y: 900, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}

// ---------- folhas da guarita ----------
const FOLHA = papelTex(820, 1150, 21, '#ece4cf');
function tomada2(t) {
  camera2D(t, W / 2, 960, 1.1 + 0.04 * easeInOut(prog(t, T(2), 6)), { amp: 4, rot: -0.02 }); fundo(); papel(g, FOLHA, 130, 380, { rot: 0.02 });
  g.save(); g.translate(130, 380); g.rotate(0.02); riscos(g, Array.from({ length: 16 }, (_, i) => [[0, 130 + i * 64], [820, 130 + i * 64]]), { w: 1.2, cor: '#7f9cc2', alpha: 0.55 });
  escrita(g, 'Meu nome é Valdir,', 50, 180, (t - S(3) + 0.1) / 0.8, -0.1, { tam: 46, cor: TINTA });
  escrita(g, 'sou o porteiro da noite.', 50, 244, (t - S(3) - 0.6) / 0.8, -0.1, { tam: 46, cor: TINTA });
  escrita(g, 'Entro às dez, saio às seis.', 50, 308, (t - P(3, 'Entro')) / 0.9, -0.1, { tam: 46, cor: TINTA });
  ['O prédio tem doze andares,', 'três apartamentos por andar.', 'Menos o sétimo...'].forEach((l, i) => escrita(g, l, 50, 436 + i * 64, 1, -0.1, { tam: 40, cor: TINTA, alpha: 0.35 }));
  g.restore(); g.restore();
  tag('FOLHAS ACHADAS NA GAVETA DA GUARITA', S(2), t);
  return { focos: [{ x: 540, y: 820, r: 900 }], amb: 0.2, mult: 1 };
}

// ---------- o prédio: 12 andares, menos o 7B ----------
function tomada3(t) {
  camera2D(t, W / 2, 960, 1.0, { amp: 3 }); fundo();
  const X0 = 240, X1 = 840, Y0 = 1560, h = 92;
  tinta(g, [[X0, Y0], [X0, Y0 - 12.5 * h], [X1, Y0 - 12.5 * h], [X1, Y0]], prog(t, T(4), 0.8), { w: 2.6, over: 8 });
  tinta(g, [[100, Y0], [980, Y0]], prog(t, T(4), 0.5), { w: 2.4, over: 0 });
  for (let a = 1; a <= 12; a++) {
    const y = Y0 - (a - 0.5) * h - 30, k = prog(t, T(4) + 0.2 + a * 0.06, 0.4); riscos(g, [[[X0, Y0 - a * h], [X1, Y0 - a * h]]], { w: 1.2, alpha: 0.6 * k });
    ['A', 'B', 'C'].forEach((c, j) => { const x = X0 + 40 + j * 190; if (a === 7 && c === 'B') { if (t > P(4, 'sétimo')) { g.save(); g.beginPath(); g.rect(x, y, 140, 60); g.clip(); riscos(g, Array.from({ length: 14 }, (_, i) => [[x - 60 + i * 16, y + 60], [x + i * 16, y]]), { w: 1.4, cor: COR.verm, alpha: 0.7 }); g.restore(); } return; }
      riscos(g, [[[x, y], [x + 140, y], [x + 140, y + 60], [x, y + 60], [x, y]]], { w: 1.4, alpha: 0.8 * k }); });
    medTxt(g, [X0 - 30, y + 44], String(a), { tam: 26, alinh: 'right', cor: a === 7 ? CLARO : COR.cinza, alpha: k });
  }
  const t7 = P(4, 'No sétimo'); if (t > t7) { const y = Y0 - 6.5 * h - 30; ['7A', '?', '7C'].forEach((s, j) => medTxt(g, [X0 + 110 + j * 190, y + 44], s, { tam: 34, alinh: 'center', cor: j === 1 ? VERM_TXT : CLARO, alpha: clamp((t - t7 - j * 0.3) / 0.3) })); tinta(g, [[X0 - 10, Y0 - 7 * h], [X1 + 10, Y0 - 7 * h], [X1 + 10, Y0 - 6 * h], [X0 - 10, Y0 - 6 * h], [X0 - 10, Y0 - 7 * h]], prog(t, t7, 0.5), { cor: COR.verm, w: 2.4, over: 0 }); }
  g.restore();
  tag('12 ANDARES  ·  A, B, C', S(4), t);
  return { focos: [{ x: 540, y: t > P(4, 'sétimo') ? 960 : 1000, r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- o painel do interfone ----------
function painel(t, { pisca7B = false, k = 1 } = {}) {
  fundo(); const X = 170, Y = 520, Wp = 740, Hp = 900;
  g.fillStyle = '#2b2722'; g.fillRect(X, Y, Wp, Hp); tinta(g, [[X, Y], [X + Wp, Y], [X + Wp, Y + Hp], [X, Y + Hp], [X, Y]], 1, { w: 2.4, over: 6 });
  medTxt(g, [X + Wp / 2, Y + 50], 'PORTARIA · INTERFONE', { tam: 26, alinh: 'center', cor: COR.cinza });
  for (let a = 12; a >= 1; a--) ['A', 'B', 'C'].forEach((c, j) => { const x = X + 90 + j * 220, y = Y + 100 + (12 - a) * 64; const e7 = a === 7 && c === 'B'; g.fillStyle = '#3a352e'; g.fillRect(x, y, 170, 48); g.fillStyle = e7 ? '#7a6a58' : '#d9d2c2'; g.font = '22px Maquina'; g.fillText(`${a}${c}`, x + 14, y + 32); const on = e7 && pisca7B && Math.floor(t * 3) % 2 === 0; g.fillStyle = on ? '#ff3a2a' : '#1a1512'; g.beginPath(); g.arc(x + 145, y + 24, 9, 0, 6.3); g.fill(); if (on) { const gr = g.createRadialGradient(x + 145, y + 24, 0, x + 145, y + 24, 60); gr.addColorStop(0, 'rgba(255,60,40,0.5)'); gr.addColorStop(1, 'rgba(255,60,40,0)'); g.fillStyle = gr; g.fillRect(x + 85, y - 36, 120, 120); } });
}
function tomada4(t) {
  const k = easeInOut(prog(t, S(5) + 1.5, 1.0)); camera2D(t, lerp(540, 600, k), lerp(980, 880, k), lerp(1.0, 1.35, k), { amp: 3 });
  painel(t, { pisca7B: t > P(5, 'luzinha') - 0.3 });
  g.restore();
  // relógio digital, por cima (fixo na tela)
  if (t > P(5, 'três e trinta')) { g.save(); g.font = '120px Maquina'; g.textAlign = 'center'; g.fillStyle = '#ff3a2a'; g.globalAlpha = clamp((t - P(5, 'três e trinta')) / 0.3); g.fillText('03:33', W / 2, 400); g.restore(); }
  const tv = P(6, 'moço'); if (t > tv) { const s1 = '"Moço, sobe aqui, por favor.', s2 = 'Está faltando água."'; datilo(g, s1, W / 2, 1660, (t - tv) / 1.3 * s1.length, { fonte: 'SerifaI', tam: 46, cor: CLARO, alinh: 'center' }); datilo(g, s2, W / 2, 1720, (t - P(6, 'Está')) / 1.0 * s2.length, { fonte: 'SerifaI', tam: 46, cor: '#9fc3ff', alinh: 'center' }); }
  tag('TODA NOITE', S(5), t);
  return { focos: [{ x: 600, y: 920, r: 900 }, ...(t > P(5, 'luzinha') ? [{ x: 700, y: 820, r: 380, i: 0.6, cor: [255, 70, 50] }] : [])], amb: 0.15, mult: 1 };
}

// ---------- o corredor do 7º andar ----------
function tomada5(t) {
  camera2D(t, W / 2, 1000, 1.0 + 0.08 * easeInOut(prog(t, T(7), 4)), { amp: 3 }); fundo();
  const Y0 = 1400, Yt = 500; tinta(g, [[40, Y0], [1040, Y0]], 1, { w: 2.6, over: 0 }); tinta(g, [[40, Yt], [1040, Yt]], 1, { w: 1.6, over: 0, alpha: 0.6 });
  [[90, '7A'], [790, '7C']].forEach(([x, s]) => { g.fillStyle = '#3a2c1e'; g.fillRect(x, Y0 - 620, 200, 620); tinta(g, [[x, Y0], [x, Y0 - 620], [x + 200, Y0 - 620], [x + 200, Y0]], 1, { w: 2.2, over: 0 }); g.fillStyle = '#c9a24a'; g.beginPath(); g.arc(x + 170, Y0 - 300, 9, 0, 6.3); g.fill(); medTxt(g, [x + 100, Y0 - 660], s, { tam: 34, alinh: 'center' }); });
  // parede lisa, pintada de novo; o contorno de uma porta que sumiu; a marca do capacho
  g.fillStyle = 'rgba(232,220,196,0.08)'; g.fillRect(380, Yt + 10, 320, Y0 - Yt - 10);
  const tp = P(7, 'pintada'); if (t > tp - 0.2) { const k = clamp((t - tp + 0.2) / 0.6); g.save(); g.setLineDash([10, 9]); tinta(g, [[440, Y0], [440, Y0 - 620], [640, Y0 - 620], [640, Y0]], k, { cor: COR.verm, w: 2.4, over: 0 }); g.restore(); medTxt(g, [540, Y0 - 680], '7B?', { tam: 40, alinh: 'center', cor: VERM_TXT, alpha: k }); }
  g.save(); g.globalAlpha = 0.25; g.strokeStyle = COR.osso; g.setLineDash([4, 6]); g.strokeRect(450, Y0 + 20, 180, 60); g.restore(); medTxt(g, [540, Y0 + 130], 'marca de capacho', { tam: 24, alinh: 'center', cor: COR.cinza });
  g.restore();
  tag('7º ANDAR  ·  ENTRE O 7A E O 7C', S(7), t);
  return { focos: [{ x: 540, y: 1050, r: 850 }], amb: 0.14, mult: 1 };
}

// ---------- a guarita: rádio, cadeira gelada ----------
function tomada6(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 3 }); fundo();
  const Y0 = 1420; tinta(g, [[40, Y0], [1040, Y0]], 1, { w: 2.4, over: 0 });
  // balcão e livro da portaria
  g.fillStyle = '#2a2219'; g.fillRect(560, Y0 - 330, 460, 330); tinta(g, [[560, Y0 - 330], [1020, Y0 - 330]], 1, { w: 2.2, over: 4 });
  g.save(); g.translate(790, Y0 - 350); g.fillStyle = '#e6dcc6'; g.fillRect(-160, -40, 320, 40); g.fillStyle = TINTA; g.font = '18px Caneta'; g.textAlign = 'center'; g.fillText('livro da portaria · 1999', 0, -14); g.restore();
  // a cadeira vazia (e gelada)
  const cx = 300, cy = Y0; tinta(g, [[cx - 110, cy], [cx - 100, cy - 260], [cx + 100, cy - 260], [cx + 110, cy]], 1, { w: 2.4, over: 0 }); tinta(g, [[cx - 100, cy - 260], [cx - 90, cy - 560], [cx + 90, cy - 560], [cx + 100, cy - 260]], 1, { w: 2.4, over: 0 });
  const tg = P(9, 'gelada'); if (t > tg - 0.4) { const k = clamp((t - tg + 0.4) / 0.8); const r = rng(5); for (let i = 0; i < 40; i++) { const a = r() * 6.3, d = 30 + r() * 120; riscos(g, [[[cx + Math.cos(a) * d, cy - 330 + Math.sin(a) * d * 1.6], [cx + Math.cos(a) * (d + 22), cy - 330 + Math.sin(a) * (d + 22) * 1.6]]], { w: 2, cor: '#a8c8ff', alpha: 0.6 * k }); } medTxt(g, [cx, cy - 620], 'a cadeira está gelada', { tam: 28, alinh: 'center', cor: '#a8c8ff', alpha: k }); }
  // dois rádios: o do dia liga, o da noite desliga
  const rx = 680, ry = Y0 - 470, to = P(8, 'Desliga'); const meuLig = t < to;
  [[rx, 'rádio do Valdir', meuLig], [rx + 210, 'rádio do Josué', !meuLig]].forEach(([x, s, on]) => { g.fillStyle = '#3a3228'; g.fillRect(x - 80, ry - 60, 170, 110); g.fillStyle = on ? '#ffcc66' : '#1a1512'; g.beginPath(); g.arc(x + 60, ry - 34, 8, 0, 6.3); g.fill(); riscos(g, Array.from({ length: 5 }, (_, i) => [[x - 70, ry - 30 + i * 14], [x + 20, ry - 30 + i * 14]]), { w: 1.4, alpha: 0.7 }); medTxt(g, [x + 5, ry + 90], s, { tam: 18, alinh: 'center', cor: COR.cinza }); });
  // o que o rádio fala
  const tb = P(10, 'bug'); if (t > tb - 0.3) { const s = 'BUG DO MILÊNIO: FALTAM 69 DIAS PARA O ANO 2000'; datilo(g, s, W / 2, 560, (t - tb + 0.3) / 1.4 * s.length, { fonte: 'Maquina', tam: 28, cor: '#ffcc66', alinh: 'center' }); }
  g.restore();
  tag(t < S(10) ? 'GUARITA  ·  06:00' : 'RÁDIO DE PILHA', t < S(10) ? S(8) : S(10), t);
  return { focos: [{ x: t < S(9) ? 760 : 320, y: 1000, r: 780 }, ...(t > tg ? [{ x: cx, y: cy - 330, r: 420, i: 0.5, cor: FRIO }] : [])], amb: 0.15, mult: 1 };
}

// ---------- o fone pendurado: desculpa / está faltando água ----------
function tomada7(t) {
  camera2D(t, W / 2, 980, 1.05, { amp: 3 }); fundo();
  const cx = 540; riscos(g, [Array.from({ length: 40 }, (_, i) => [cx + Math.sin(i * 0.9) * 30, 300 + i * 18])], { w: 3, cor: '#9a9890' });
  g.save(); g.translate(cx, 1050); g.rotate(Math.sin(t * 1.3) * 0.08); g.fillStyle = '#2b2722'; g.beginPath(); g.roundRect(-60, -240, 120, 480, 50); g.fill(); g.strokeStyle = COR.osso; g.lineWidth = 2; g.stroke(); riscos(g, Array.from({ length: 4 }, (_, i) => [[-30, -200 + i * 16], [30, -200 + i * 16]]), { w: 2 }); riscos(g, Array.from({ length: 4 }, (_, i) => [[-30, 150 + i * 16], [30, 150 + i * 16]]), { w: 2 }); g.restore();
  const tdz = P(11, 'desculpa'); for (let i = 0; i < 6; i++) { const tt = tdz + i * 0.35; if (t > tt) escrita(g, 'desculpa', 110 + (i % 2) * 40, 470 + i * 70, (t - tt) / 0.5, -0.12, { tam: 38, cor: '#c9c2b2', alpha: 0.7 }); }
  const ta = P(11, 'Só pede'); for (let i = 0; i < 4; i++) { const tt = ta + i * 0.3; if (t > tt) escrita(g, 'está faltando água', 600, 600 + i * 110, (t - tt) / 0.7, -0.08, { tam: 34, cor: '#9fc3ff', alpha: 0.75, fonte: 'SerifaI' }); }
  if (t > P(11, 'não escuta')) medTxt(g, [W / 2, 1550], 'um não escuta o outro', { tam: 30, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(11, 'não escuta')) / 0.4) });
  g.restore();
  return { focos: [{ x: 540, y: 950, r: 900 }], amb: 0.16, mult: 1 };
}

// ---------- o laudo do técnico; o jornal de 1999 ----------
const LAUDO = papelTex(820, 520, 31), JOR = papelTex(840, 980, 41, '#d9cfb6');
function tomada8(t) {
  camera2D(t, W / 2, 960, 1.12, { amp: 4 }); fundo(); papel(g, LAUDO, 130, 700, { rot: 0.015 });
  g.save(); g.translate(130, 700); g.rotate(0.015); g.fillStyle = TINTA; g.font = '30px Serifa'; g.fillText('Laudo técnico · interfone', 50, 80); g.font = '20px Maquina'; g.fillText('Solar das Palmeiras · 2023', 50, 112); g.fillRect(50, 126, 720, 2);
  g.font = '25px MaquinaR'; ['Ramal 7B: a linha foi cortada e', 'isolada em 1999, na obra que juntou', 'o 7B ao 7A. Não existe aparelho nem', 'fio ligado ao painel nessa posição.'].forEach((l, i) => g.fillText(l, 50, 190 + i * 48)); g.restore();
  circulo(g, 130 + 50 + 330, 700 + 190 + 1 * 48 - 10, 200, 32, easeInOut(prog(t, P(12, 'cortado'), 0.5)), { seed: 3 });
  g.restore(); tag('O TÉCNICO', S(12), t);
  return { focos: [{ x: 540, y: 940, r: 900 }], amb: 0.2, mult: 1 };
}
function tomada9(t) {
  const k = easeInOut(prog(t, S(14) - 0.3, 1.0)); camera2D(t, W / 2, lerp(820, 1100, k), lerp(1.12, 1.22, k), { amp: 4 }); fundo(); papel(g, JOR, 120, 360, { rot: -0.02 });
  g.save(); g.translate(120, 360); g.rotate(-0.02); g.fillStyle = TINTA; g.font = '22px Maquina'; g.fillText('CORREIO DA CIDADE · DOMINGO, 24/10/1999', 50, 60); g.fillRect(50, 76, 740, 2);
  g.font = '46px Serifa'; ['Aposentada morre em', 'incêndio no Solar', 'das Palmeiras'].forEach((l, i) => g.fillText(l, 50, 150 + i * 56));
  g.font = '25px Serifa'; ['Celina M., 81 anos, moradora do 7B,', 'morreu na madrugada de ontem em um', 'incêndio que começou por volta das 3h30.', 'Segundo os bombeiros, faltou água no', 'hidrante do andar.', '', 'O interfone registrou chamadas do 7B para', 'a portaria. O porteiro noturno, Valdir R.,', 'não atendeu: estava dormindo.', 'Ele foi demitido.'].forEach((l, i) => g.fillText(l, 50, 350 + i * 40));
  g.restore();
  circulo(g, 120 + 50 + 230, 360 + 510 - 8, 230, 30, easeInOut(prog(t, P(13, 'Faltou água'), 0.5)), { seed: 5 });
  circulo(g, 120 + 50 + 440, 360 + 630 - 8, 140, 32, easeInOut(prog(t, P(14, 'Valdir'), 0.5)), { seed: 9 });
  if (t > P(14, 'Valdir') + 0.4) medTxt(g, [W / 2, 360 + 1060], '= quem escreveu as folhas', { tam: 40, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(14, 'Valdir') - 0.4) / 0.4) });
  g.restore(); tag('OUTUBRO DE 1999', S(13), t, true);
  return { focos: [{ x: 540, y: lerp(800, 1150, k), r: 950 }], amb: 0.2, mult: 1 };
}

const tomadaFim = t => cartaoFinal(t, T(ULT), N, 8, { linhas: LINHAS });
const LEG = [
  [2, 'Estas folhas foram achadas na gaveta da guarita de um prédio. Escritas pelo porteiro da noite.', { 'porteiro da noite': CLARO }],
  [3, 'Meu nome é Valdir. Entro às 22h, saio às 6h.', { 'Valdir': CLARO }],
  [4, 'O prédio tem 12 andares, 3 apartamentos por andar. Menos o 7º. No 7º, só tem o 7A e o 7C.', { 'só tem o 7A e o 7C': VERM_TXT }],
  [5, 'Mesmo assim, toda noite, às 3h33, o interfone toca. E a luzinha que acende é a do 7B.', { 'a do 7B': VERM_TXT }],
  [6, 'Uma voz de senhora: "Moço, sobe aqui, por favor. Está faltando água."', { '"Moço, sobe aqui, por favor. Está faltando água."': CLARO }],
  [7, 'Eu subo. Entre as duas portas, só uma parede lisa, pintada de novo.', { 'pintada de novo': VERM_TXT }],
  [8, 'O porteiro do dia não me dá bom-dia. Desliga o meu rádio e liga o dele.', { 'não me dá bom-dia': VERM_TXT }],
  [9, 'Uma moradora disse que a minha cadeira estava gelada.', { 'gelada': VERM_TXT }],
  [10, 'O meu radinho só fala de futebol e do tal bug do milênio.', { 'bug do milênio': VERM_TXT }],
  [11, 'Eu já pedi desculpa para ela muitas vezes. Ela não escuta. Só pede água.', { 'desculpa': CLARO }],
  [12, 'O técnico diz que o fio do 7B foi cortado em 1999.', { 'cortado em 1999': VERM_TXT }],
  [13, 'No jornal de outubro daquele ano: uma senhora morreu num incêndio no 7B. Faltou água no hidrante.', { 'Faltou água no hidrante.': VERM_TXT }],
  [14, 'O porteiro da noite não atendeu o interfone. Estava dormindo. O nome dele era Valdir.', { 'Valdir.': VERM_TXT }],
];
rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(4), tomada3], [T(5), tomada4], [T(7), tomada5], [T(8), tomada6], [T(11), tomada7], [T(12), tomada8], [T(13), tomada9], [T(ULT), tomadaFim]], legendasFn: legendas(N, LEG) });
