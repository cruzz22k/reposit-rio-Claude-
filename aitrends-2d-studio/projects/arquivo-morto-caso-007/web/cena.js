// Caso 007 — "A casa com duas cozinhas", estilo Planta no escuro.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, fontes, g, sb, fundo, papelTex, tinta, circulo, cota, datilo, riscos } from '/projects/arquivo-morto-kit/web/planta.js';
import { CLARO, VERM_TXT, TINTA, AZUL_CANETA, narracao, legendas, medTxt, escrita, papel, camera2D, carimbo, prancha, titulo, ligaLanterna, cartaoFinal, rodar } from '/projects/arquivo-morto-kit/web/kit.js';

await fontes();
const N = await narracao('/project/input/timeline-v1.json'), { S, E, P } = N, ULT = N.TL.length;
const Q = new URLSearchParams(location.search), FIM = Q.get('fim') ? +Q.get('fim') : E(ULT) + 1.4;
const T = i => S(i) - 0.25;
const LINHAS = ['CASO 007 · RUA DAS PAINEIRAS, 12', 'PLANTA APROVADA EM 1975'];
const AMBAR = [255, 178, 90], GAS = '#b9c46a';
const tag = (s, t0, t, { big = false } = {}) => { if (t <= t0) return; if (big) { sb.fillStyle = COR.verm; sb.fillRect(84, 224, 16, 16); datilo(sb, s, 116, 242, (t - t0) / 0.6 * s.length, { tam: 40, cor: COR.osso, esp: 3 }); } else datilo(sb, s, 84, 242, (t - t0) / 0.6 * s.length, { tam: 32, cor: COR.osso, esp: 2 }); };

// ---------- planta da casa (2D, de cima): 1 m = 80 px ----------
const PX = m => 140 + m * 80, PY = m => 1500 - m * 80;     // x 0–10 m, z 0–12 m (frente embaixo)
const PAR = [[0, 0, 10, 0], [0, 12, 10, 12], [0, 0, 0, 12], [10, 0, 10, 12], [0, 4, 10, 4], [0, 8, 10, 8], [5, 0, 5, 4], [6, 4, 6, 8], [4, 8, 4, 12], [7, 8, 7, 12]];
const ROT = [['COZINHA DA FRENTE', 2.5, 2, '(antigo escritório)'], ['SALA', 7.5, 2], ['QUARTO', 3, 6], ['COPA', 8, 6], ['DESPENSA', 2, 10], ['COZINHA DOS FUNDOS', 5.5, 10, '(a original)'], ['', 8.5, 10]];
function planta(t, t0, o = {}) {
  PAR.forEach(([a, b, c, d], i) => tinta(g, [[PX(a), PY(b)], [PX(c), PY(d)]], prog(t, t0 + i * 0.05, 0.5), { w: 3, over: 10, seed: i + 1 }));
  ROT.forEach(([s, x, z, sub]) => { if (!s) return; medTxt(g, [PX(x), PY(z)], s, { tam: 24, alinh: 'center', cor: COR.cinza, alpha: prog(t, t0 + 0.6, 0.4) }); if (sub && o.subs) medTxt(g, [PX(x), PY(z) + 34], sub, { tam: 20, alinh: 'center', cor: VERM_TXT, alpha: o.subs }); });
  if (o.frente) { g.save(); g.globalAlpha = 0.25 * o.frente; g.fillStyle = '#f2d39a'; g.fillRect(PX(0.1), PY(3.9), 4.8 * 80, 3.8 * 80); g.restore(); }
  if (o.fundos) { g.save(); g.beginPath(); g.rect(PX(4.1), PY(11.9), 2.8 * 80, 3.8 * 80); g.clip(); g.fillStyle = `rgba(13,11,9,${0.85 * o.fundos})`; g.fillRect(0, 0, W, H); riscos(g, Array.from({ length: 30 }, (_, i) => [[PX(4) - 300 + i * 22, PY(8)], [PX(4) - 300 + i * 22 + 300, PY(12)]]), { w: 1.2, alpha: 0.4 * o.fundos }); g.restore(); medTxt(g, [PX(5.5), PY(9.2)], 'TRANCADA', { tam: 30, alinh: 'center', cor: VERM_TXT, alpha: o.fundos }); }
  if (o.boom > 0) { const cx = PX(5.5), cy = PY(10.4), k = o.boom; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283, r1 = 40 * k, r2 = (110 + (i % 2) * 50) * k; riscos(g, [[[cx + Math.cos(a) * r1, cy + Math.sin(a) * r1], [cx + Math.cos(a) * r2, cy + Math.sin(a) * r2]]], { w: 3, cor: COR.verm, alpha: 0.9 }); } medTxt(g, [cx, cy + 200], '12/08/1977 · 19h40', { tam: 28, alinh: 'center', cor: VERM_TXT, alpha: k }); }
}

// ---------- tomada 1 ----------
function tomada1(t) {
  camera2D(t, W / 2, H / 2, 1 + 0.05 * easeInOut(t / 3.4), { amp: 5 }); fundo();
  g.save(); g.globalAlpha = 0.18; PAR.forEach(([a, b, c, d], i) => tinta(g, [[PX(a), PY(b)], [PX(c), PY(d)]], prog(t, 0.3 + i * 0.1, 0.6), { w: 2, seed: i + 30 })); g.restore();
  prancha(g, t, { linhas: LINHAS, folha: '07/13' });
  const s = 'ARQUIVO MORTO  ·  CASO 007'; datilo(g, s, W / 2, 690, (t - 0.45) / 0.65 * s.length, { tam: 34, cor: COR.cinza, alinh: 'center', esp: 5 });
  titulo(g, t, 'A CASA COM', 885, P(1, 'A casa')); titulo(g, t, 'DUAS COZINHAS', 1005, P(1, 'duas'));
  const pr = prog(t, P(1, 'cozinhas'), 0.5); if (pr > 0) [440, 640].forEach((x, i) => { const k = prog(t, P(1, 'cozinhas') + i * 0.2, 0.4); tinta(g, Array.from({ length: 17 }, (_, j) => [x + Math.cos(j / 16 * 6.3) * 26, 1100 + Math.sin(j / 16 * 6.3) * 26]), k, { cor: i ? COR.verm : COR.osso, w: 2.4, over: 0 }); });
  g.restore();
  return { focos: [{ x: 540, y: 900, r: 1000 }], amb: 0.2, mult: ligaLanterna(t) };
}
// ---------- tomada 2: a planta; a cozinha trancada; 1977 ----------
function tomada2(t) {
  camera2D(t, W / 2, 1010, 1.0 + 0.06 * easeInOut(prog(t, T(2), 8)), { amp: 4 }); fundo();
  planta(t, T(2), { frente: clamp((t - P(3, 'frente')) / 0.4), fundos: clamp((t - P(3, 'fundos')) / 0.4), boom: easeOut(clamp((t - P(4, 'explosão')) / 0.4)), subs: clamp((t - E(4)) / 0.4) });
  g.restore();
  tag('2023  ·  RUA DAS PAINEIRAS', S(2), t, { big: true });
  return { focos: [{ x: 560, y: t < S(4) ? 1000 : 820, r: 1000 }, ...(t > P(4, 'explosão') ? [{ x: PX(5.5), y: PY(10.4) - 40, r: 420, i: 0.5, cor: [255, 120, 70] }] : [])], amb: 0.18, mult: 1 };
}

// ---------- o fogão (2D, de frente/cima) ----------
function fogao(t, abertos, registro, fotos) {
  fundo();
  const X = 200, Y = 520, Wf = 680, Hf = 900;
  g.fillStyle = '#d9d2c2'; g.fillRect(X, Y, Wf, 380); g.fillStyle = '#1e1913'; g.fillRect(X, Y + 380, Wf, 90); g.fillStyle = '#cfc7b6'; g.fillRect(X, Y + 470, Wf, 430);
  tinta(g, [[X, Y], [X + Wf, Y], [X + Wf, Y + Hf], [X, Y + Hf], [X, Y]], 1, { w: 2.6, over: 6, cor: CLARO });
  // quatro bocas
  [[X + 170, Y + 110], [X + 510, Y + 110], [X + 170, Y + 280], [X + 510, Y + 280]].forEach(([x, y], i) => { riscos(g, [Array.from({ length: 25 }, (_, k) => [x + Math.cos(k / 24 * 6.3) * 70, y + Math.sin(k / 24 * 6.3) * 70]), Array.from({ length: 25 }, (_, k) => [x + Math.cos(k / 24 * 6.3) * 38, y + Math.sin(k / 24 * 6.3) * 38])], { w: 3, cor: '#3a3228' }); riscos(g, Array.from({ length: 4 }, (_, k) => [[x + Math.cos(k * 1.57) * 40, y + Math.sin(k * 1.57) * 40], [x + Math.cos(k * 1.57) * 90, y + Math.sin(k * 1.57) * 90]]), { w: 4, cor: '#2a241c' }); });
  // porta do forno com visor
  g.fillStyle = '#2a241c'; g.fillRect(X + 140, Y + 560, Wf - 280, 220); tinta(g, [[X + 40, Y + 500], [X + Wf - 40, Y + 500], [X + Wf - 40, Y + 860], [X + 40, Y + 860], [X + 40, Y + 500]], 1, { w: 2, over: 0, cor: '#5a5040' });
  // os cinco botões: girados quando abertos
  for (let i = 0; i < 5; i++) {
    const x = X + 90 + i * 125, y = Y + 425, a = abertos[i] || 0, ang = -Math.PI / 2 + a * Math.PI * 0.75;
    g.fillStyle = '#efe9da'; g.beginPath(); g.arc(x, y, 30, 0, 6.3); g.fill(); g.strokeStyle = '#1e1913'; g.lineWidth = 3; g.stroke();
    riscos(g, [[[x, y], [x + Math.cos(ang) * 26, y + Math.sin(ang) * 26]]], { w: 5, cor: a > 0.5 ? COR.verm : TINTA });
    medTxt(g, [x, y + 70], i < 4 ? String(i + 1) : 'F', { tam: 22, alinh: 'center', cor: COR.cinza });
  }
  // registro do botijão, ao lado
  const rx = 960, ry = 1240, ra = registro ? 0 : Math.PI / 2;
  riscos(g, [[[X + Wf, ry], [rx - 30, ry]], [[rx + 30, ry], [rx + 30, ry + 200]]], { w: 6, cor: '#7a6a50' }); g.fillStyle = '#b9ad95'; g.beginPath(); g.arc(rx, ry, 30, 0, 6.3); g.fill();
  riscos(g, [[[rx - Math.cos(ra) * 48, ry - Math.sin(ra) * 48], [rx + Math.cos(ra) * 48, ry + Math.sin(ra) * 48]]], { w: 9, cor: registro ? '#2f6a3a' : COR.verm });
  medTxt(g, [rx - 10, ry - 60], registro ? 'registro' : 'registro fechado', { tam: 22, alinh: 'right', cor: COR.cinza });
  if (fotos) fotos();
}
function polaroid(x, y, rot, txt, k, abertas) {
  if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = k; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 16; g.fillStyle = '#efe9da'; g.fillRect(-90, -100, 180, 210); g.shadowBlur = 0;
  g.fillStyle = '#2a241c'; g.fillRect(-76, -86, 152, 140); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (abertas ? Math.PI * 0.75 : 0); g.fillStyle = '#d9d2c2'; g.beginPath(); g.arc(-60 + i * 30, 20, 9, 0, 6.3); g.fill(); riscos(g, [[[-60 + i * 30, 20], [-60 + i * 30 + Math.cos(a) * 8, 20 + Math.sin(a) * 8]]], { w: 2, cor: abertas ? COR.verm : TINTA }); }
  g.fillStyle = TINTA; g.font = '20px Caneta'; g.textAlign = 'center'; g.fillText(txt, 0, 90); g.restore();
}
// ---------- tomada 3: o registro, os botões, as fotos ----------
function tomada3(t) {
  camera2D(t, W / 2, 1000, 1.0, { amp: 4 });
  const tm = P(6, 'de manhã'), ab = [0, 1, 2, 3, 4].map(i => easeInOut(prog(t, P(6, 'botões') + i * 0.25, 0.3)));
  fogao(t, t < tm ? [0, 0, 0, 0, 0] : ab, t < P(5, 'fecha'), () => {
    if (t > S(7)) [['14/03 23h10', 0], ['21/03 23h48', 1], ['28/03 22h57', 2]].forEach(([s, i]) => polaroid(220 + i * 300, 1720, -0.06 + i * 0.05, s, easeOut(prog(t, S(7) + 0.5 + i * 0.4, 0.3)), false));
  });
  if (t > P(6, 'quatro bocas')) medTxt(g, [540, 470], '4 BOCAS + FORNO: ABERTOS', { tam: 36, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(6, 'quatro bocas')) / 0.3) });
  g.restore();
  tag(t < tm ? 'TODA NOITE  ·  23H' : 'DE MANHÃ  ·  06H30', t < tm ? S(5) : tm, t);
  return { focos: [{ x: 560, y: t < S(7) ? 980 : 1300, r: 950 }], amb: 0.18, mult: 1 };
}

// ---------- tomada 4: a porta trancada; 19h40; o fósforo ----------
const PORTA = papelTex(560, 1100, 41, '#5a3e26');
function tomada4(t) {
  camera2D(t, W / 2, 1000, 1.0 + 0.1 * easeInOut(prog(t, T(8), T(11) - T(8))), { amp: 3 }); fundo();
  const X = 260, Y = 420; g.fillStyle = '#231d17'; g.fillRect(0, 0, W, H); g.drawImage(PORTA, X, Y);
  tinta(g, [[X - 30, Y + 1100], [X - 30, Y - 30], [X + 590, Y - 30], [X + 590, Y + 1100]], 1, { w: 3, over: 0 });
  riscos(g, [[[X + 40, Y + 40], [X + 520, Y + 40], [X + 520, Y + 500], [X + 40, Y + 500], [X + 40, Y + 40]], [[X + 40, Y + 580], [X + 520, Y + 580], [X + 520, Y + 1040], [X + 40, Y + 1040], [X + 40, Y + 580]]], { w: 2, cor: '#2a1c10', alpha: 0.9 });
  g.fillStyle = '#c9a24a'; g.beginPath(); g.arc(X + 480, Y + 560, 16, 0, 6.3); g.fill(); g.fillStyle = '#000'; g.fillRect(X + 474, Y + 590, 12, 26);
  // o vão embaixo da porta, e o gás saindo
  g.fillStyle = '#000'; g.fillRect(X, Y + 1100, 560, 14); tinta(g, [[0, Y + 1114], [W, Y + 1114]], 1, { w: 2.4, over: 0 });
  const tg = P(8, 'cheiro');
  if (t > tg - 0.2) { const k = clamp((t - tg + 0.2) / 0.8); for (let i = 0; i < 9; i++) { const pts = []; for (let j = 0; j < 30; j++) { const s = j / 29, x = X + 40 + i * 60 + Math.sin(t * 1.5 + i + s * 5) * 30 * s, y = Y + 1110 - s * 360 * k + Math.cos(t + i) * 6; pts.push([x - s * 80 * Math.sin(i), y]); } riscos(g, [pts], { w: 6, cor: GAS, alpha: 0.18 * k }); } }
  // 19:40
  const cx = 860, cy = 300; g.save(); g.fillStyle = '#e8e1d2'; g.beginPath(); g.arc(cx, cy, 90, 0, 6.3); g.fill(); g.strokeStyle = TINTA; g.lineWidth = 5; g.stroke(); const hm = -Math.PI / 2 + (19 + 40 / 60) / 12 * 6.283, mm = -Math.PI / 2 + 40 / 60 * 6.283; riscos(g, [[[cx, cy], [cx + Math.cos(hm) * 45, cy + Math.sin(hm) * 45]]], { w: 6, cor: TINTA }); riscos(g, [[[cx, cy], [cx + Math.cos(mm) * 70, cy + Math.sin(mm) * 70]]], { w: 3.5, cor: TINTA }); g.restore();
  medTxt(g, [cx, cy + 140], '19:40', { tam: 40, alinh: 'center' });
  const ts = P(9, 'não chega'); if (t > ts) { medTxt(g, [540, Y + 1220], 'sem gás desde 1977', { tam: 34, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - ts) / 0.4) }); }
  // o risco do fósforo: faíscas no vão, sem chama
  const tf = P(10, 'fósforo'); if (t > tf - 0.1) { [0, 1.3, 2.4].forEach(d => { const k = t - tf - d; if (k < 0 || k > 0.35) return; const r = rng(Math.floor((tf + d) * 10)); for (let i = 0; i < 26; i++) { const a = -Math.PI * r(), v = 40 + r() * 140; g.fillStyle = `rgba(255,${150 + r() * 80},60,${1 - k / 0.35})`; g.beginPath(); g.arc(X + 280 + Math.cos(a) * v * k * 3, Y + 1106 + Math.sin(a) * v * k * 2, 2.5, 0, 6.3); g.fill(); } }); }
  if (t > P(10, 'Nunca a chama')) medTxt(g, [540, Y - 90], 'só o risco · nunca a chama', { tam: 32, alinh: 'center', cor: VERM_TXT, alpha: clamp((t - P(10, 'Nunca a chama')) / 0.4) });
  g.restore();
  tag('A PORTA TRANCADA  ·  19:40', S(8), t);
  const sp = t > tf - 0.1 && ((t - tf) % 1.2) < 0.3;
  return { focos: [{ x: 540, y: 1150, r: 800 }, { x: 860, y: 320, r: 380, i: 0.6 }, ...(sp ? [{ x: 540, y: 1500, r: 400, i: 0.7, cor: [255, 160, 70] }] : [])], amb: 0.15, mult: 1 };
}

// ---------- tomada 5: o jornal de 1977 ----------
const JOR = papelTex(840, 1100, 51, '#d9cfb6');
function tomada5(t) {
  const k = easeInOut(prog(t, S(12) - 0.3, 1.0)); camera2D(t, W / 2, lerp(820, 1100, k), lerp(1.12, 1.2, k), { amp: 4 }); fundo(); papel(g, JOR, 120, 360, { rot: -0.02 });
  g.save(); g.translate(120, 360); g.rotate(-0.02); g.fillStyle = TINTA;
  g.font = '22px Maquina'; g.fillText('DIÁRIO DO VALE · SÁBADO, 13/08/1977', 50, 60); g.fillRect(50, 76, 740, 2);
  g.font = '48px Serifa'; ['Explosão de gás mata', 'comerciante na', 'Rua das Paineiras'].forEach((l, i) => g.fillText(l, 50, 150 + i * 58));
  g.font = '25px Serifa'; ['O comerciante Arlindo T., 52 anos, morreu', 'na noite de ontem, às 19h40, na explosão', 'da cozinha de sua residência. Segundo a', 'perícia, o gás vazou por esquecimento e a', 'explosão ocorreu quando a vítima riscou', 'um fósforo.', '', 'A esposa, Zuleica, estava na missa das 19h.', '"Ele nunca entrava na cozinha, nem para', 'esquentar água", disse aos vizinhos.'].forEach((l, i) => g.fillText(l, 50, 370 + i * 40));
  riscos(g, Array.from({ length: 6 }, (_, i) => [[50, 820 + i * 34], [50 + 600 + (i % 3) * 40, 820 + i * 34]]), { w: 7, cor: '#8a7e66', alpha: 0.45 });
  g.restore();
  circulo(g, 120 + 50 + 520, 360 + 410 - 8, 90, 30, easeInOut(prog(t, P(11, 'sete e quarenta'), 0.5)), { seed: 3 });
  circulo(g, 120 + 50 + 520, 360 + 650 - 8, 120, 30, easeInOut(prog(t, P(12, 'missa'), 0.5)), { seed: 5 });
  if (t > P(12, 'nunca')) tinta(g, [[120 + 50, 360 + 696], [120 + 560, 360 + 696]], prog(t, P(12, 'nunca'), 0.6), { cor: COR.verm, w: 3, over: 0 });
  g.restore();
  tag('13/08/1977  ·  O JORNAL', S(11), t, { big: true });
  return { focos: [{ x: 540, y: lerp(800, 1150, k), r: 950 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 6: o bilhete na copa ----------
const BIL = papelTex(700, 520, 61, '#f4eedf');
function tomada6(t) {
  camera2D(t, W / 2, 960, 1.12, { amp: 4 }); fundo(); papel(g, BIL, 190, 700, { rot: 0.03 });
  g.save(); g.translate(190, 700); g.rotate(0.03);
  escrita(g, 'Lindo,', 60, 110, (t - S(13) - 0.3) / 0.4, -0.08, { tam: 48, cor: TINTA });
  escrita(g, 'a janta está no forno.', 60, 200, (t - P(13, 'a janta')) / 0.9, -0.08, { tam: 48, cor: TINTA });
  escrita(g, 'É só acender.', 60, 290, (t - P(13, 'É só')) / 0.7, -0.08, { tam: 54, cor: TINTA });
  escrita(g, 'Volto depois da missa.  Z.', 60, 400, (t - P(13, 'acender') - 0.4) / 0.9, -0.08, { tam: 40, cor: TINTA });
  if (t > P(13, 'acender')) tinta(g, [[50, 306], [380, 300]], prog(t, P(13, 'acender'), 0.4), { cor: COR.verm, w: 4, over: 0 });
  g.restore(); g.restore();
  tag('LAUDO DA PERÍCIA  ·  NA COPA', S(13), t);
  return { focos: [{ x: 540, y: 960, r: 900 }], amb: 0.2, mult: 1 };
}

// ---------- tomada 7: a apólice; vinte dias ----------
const APO = papelTex(820, 640, 71);
function tomada7(t) {
  camera2D(t, W / 2, 1000, 1.08, { amp: 4 }); fundo(); papel(g, APO, 130, 360, { rot: -0.015 });
  g.save(); g.translate(130, 360); g.rotate(-0.015); g.fillStyle = TINTA; g.font = '34px Serifa'; g.fillText('Apólice de Seguro de Vida', 50, 80); g.font = '20px Maquina'; g.fillText('Nº 77/0912 · resumo', 50, 112); g.fillRect(50, 126, 720, 2);
  g.font = '25px MaquinaR'; ['Segurado: Arlindo T.', 'Beneficiária: Zuleica T.', 'Contratação: 23/07/1977', 'Cláusula 4ª: em caso de MORTE ACIDENTAL,', 'a indenização é paga EM DOBRO.'].forEach((l, i) => g.fillText(l, 50, 190 + i * 50)); g.restore();
  circulo(g, 130 + 50 + 270, 360 + 290 - 8, 200, 32, easeInOut(prog(t, P(14, 'vinte dias') - 0.4, 0.5)), { seed: 4 });
  circulo(g, 130 + 50 + 360, 360 + 390 - 8, 300, 34, easeInOut(prog(t, P(14, 'dobro') - 0.2, 0.5)), { seed: 8 });
  // régua de dias: 23/07 → 12/08
  const y = 1240, x0 = 120, x1 = 960, dias = 20, tv = P(14, 'vinte dias') - 0.3;
  tinta(g, [[x0, y], [x1, y]], prog(t, tv, 0.8), { w: 2.4, over: 0 });
  for (let d = 0; d <= dias; d++) { const k = prog(t, tv + d * 0.05, 0.1); if (k <= 0) continue; const x = lerp(x0, x1, d / dias); riscos(g, [[[x, y - (d % 5 ? 14 : 26)], [x, y + (d % 5 ? 14 : 26)]]], { w: 2, alpha: k }); }
  medTxt(g, [x0, y + 70], '23/07', { tam: 28, alinh: 'center' }); if (t > tv + 1) { medTxt(g, [x1, y + 70], '12/08', { tam: 28, alinh: 'center', cor: VERM_TXT }); medTxt(g, [(x0 + x1) / 2, y - 50], '20 DIAS', { tam: 44, alinh: 'center', cor: VERM_TXT }); }
  g.restore();
  tag('APÓLICE  ·  23/07/1977', S(14), t);
  return { focos: [{ x: 540, y: 1000, r: 950 }], amb: 0.2, mult: 1 };
}

const tomadaFim = t => cartaoFinal(t, T(ULT), N, 7, { linhas: LINHAS });
const LEG = [
  [2, 'Em março de 2023, o Márcio, cozinheiro, alugou uma casa antiga com duas cozinhas.', { 'duas cozinhas': CLARO }],
  [3, 'A da frente era clara. A dos fundos ficava trancada.', { 'trancada': VERM_TXT }],
  [4, 'O dono contou que o tio dele tinha morrido ali, numa explosão de gás, em 1977.', { 'explosão de gás': VERM_TXT }],
  [5, 'Toda noite, antes de dormir, o Márcio fecha o registro do gás.', { 'fecha o registro': CLARO }],
  [6, 'Mesmo assim, de manhã, os 5 botões do fogão estavam abertos. As 4 bocas e o forno.', { 'estavam abertos': VERM_TXT }],
  [7, 'Toda semana. Ele começou a fotografar o fogão antes de deitar.', {}],
  [8, 'Às 19h40, um cheiro de gás saía por baixo da porta trancada.', { 'cheiro de gás': VERM_TXT }],
  [9, 'Uma cozinha onde não chega gás desde 1977.', { 'desde 1977': VERM_TXT }],
  [10, 'Do lado de lá, alguém riscava um fósforo. Só o risco. Nunca a chama.', { 'riscava um fósforo': VERM_TXT }],
  [11, 'O jornal da época: o marido morreu às 19h40, quando riscou um fósforo.', { 'às 19h40': VERM_TXT }],
  [12, 'A esposa estava na missa das 7. Ela disse que ele nunca entrava na cozinha.', { 'nunca entrava na cozinha': VERM_TXT }],
  [13, 'A perícia achou um bilhete dela na copa: "a janta está no forno. É só acender."', { '"a janta está no forno. É só acender."': VERM_TXT }],
  [14, 'E uma apólice de seguro de vida. Feita 20 dias antes. Morte acidental paga em dobro.', { '20 dias antes': VERM_TXT, 'em dobro': VERM_TXT }],
];
rodar({ FIM, TOMADAS: [[0, tomada1], [T(2), tomada2], [T(5), tomada3], [T(8), tomada4], [T(11), tomada5], [T(13), tomada6], [T(14), tomada7], [T(ULT), tomadaFim]], legendasFn: legendas(N, LEG) });
