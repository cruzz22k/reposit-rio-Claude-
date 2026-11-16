// kit.js — peças que se repetem em todo episódio do Arquivo Morto no estilo Planta no escuro:
// linha do tempo da narração, legendas datilografadas, prancha de arquiteto, título, cartão final,
// texto à mão, rótulos no espaço 3D, blocos 3D (paredes/móveis) e papéis sobre a mesa.
import { W, H, FPS, COR, clamp, lerp, smooth, easeOut, easeInOut, prog, rng, ruido, g, sb, fundo, tinta, riscos, datilo, cota, circulo, legenda, mao, iluminar, compor, limpar, pisca, poeira } from './planta.js';
export const CLARO = '#f6ecd8', VERM_TXT = '#e0402f', TINTA = '#2a241c', AZUL_CANETA = '#22314f';

// ---------- narração ----------
export async function narracao(url) {
  const TL = await (await fetch(url)).json();
  const S = i => TL[i - 1].start, E = i => TL[i - 1].end;
  const P = (i, w) => { const f = TL[i - 1], k = f.text.indexOf(w); if (k < 0) throw new Error(`palavra não achada na frase ${i}: ${w}`); return f.start + (f.end - f.start) * k / f.text.length; };
  return { TL, S, E, P };
}
// legendas: [frase, texto exibido, destaques, (de palavra), (até palavra)]
export function legendas(N, LEG) {
  const { TL, S, E, P } = N;
  return t => LEG.forEach(([i, s, d, de, ate]) => {
    const a = de ? P(i, de) : S(i), b = ate ? P(i, ate) : E(i), prox = ate ? b : (i < TL.length ? S(i + 1) : b + 1);
    if (t < a - 0.05 || t > prox - 0.02) return;
    legenda(s, (t - a + 0.12) / (b - a) * s.length * 1.05, { destaques: d || {}, alpha: 1 - smooth(prox - 0.2, prox - 0.02, t) });
  });
}

// ---------- desenho ----------
export const caminho = (c, pl) => { c.beginPath(); pl.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); };
export const arco3 = (cx, y, cz, r, a0, a1, n = 18) => Array.from({ length: n + 1 }, (_, k) => { const a = a0 + (a1 - a0) * k / n; return [cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]; });
export const centro = pl => [pl.reduce((s, q) => s + q[0], 0) / pl.length, pl.reduce((s, q) => s + q[1], 0) / pl.length];
export const fmt = v => v.toFixed(2).replace('.', ',');
export const medTxt = (c, q, s, { tam = 50, alpha = 1, cor = CLARO, alinh = 'left', fonte = 'Maquina' } = {}) => { if (!q) return; c.save(); c.globalAlpha = alpha; c.font = `${tam}px ${fonte}`; c.textAlign = alinh; c.lineWidth = 8; c.strokeStyle = 'rgba(13,11,9,0.85)'; c.strokeText(s, q[0], q[1]); c.fillStyle = cor; c.fillText(s, q[0], q[1]); c.restore(); };
export function rot3(cam, s, p3, k, { min = 9, max = 40, cor = COR.cinza, alpha = 0.7, fonte = 'Maquina', alinh = 'center', dx = 0, dy = 0, esp = 0 } = {}) {
  const q = cam.pt(p3); if (!q) return null; const e = clamp(cam.esc(p3) * k, min, max);
  g.save(); g.globalAlpha = alpha; g.fillStyle = cor; g.font = `${e}px ${fonte}`; g.letterSpacing = esp + 'px'; g.textAlign = alinh; g.textBaseline = 'middle'; g.fillText(s, q[0] + dx, q[1] + dy); g.restore(); return q;
}
// texto à mão, aparecendo da esquerda para a direita
export function escrita(c, s, x, y, p, skew = -0.12, { tam = 42, cor = AZUL_CANETA, fonte = 'Caneta', alpha = 0.92 } = {}) {
  if (p <= 0) return; c.save(); c.translate(x, y); c.transform(1, 0, skew, 1, 0, 0); c.font = `${tam}px ${fonte}`; const w = c.measureText(s).width; c.beginPath(); c.rect(-20, -tam * 1.1, (w + 40) * clamp(p), tam * 1.7); c.clip(); c.fillStyle = cor; c.globalAlpha = alpha; c.fillText(s, 0, 0); c.restore();
}
// papel com sombra
export function papel(c, tex, x, y, { rot = 0, alpha = 1 } = {}) { c.save(); c.translate(x + tex.width / 2, y + tex.height / 2); c.rotate(rot); c.globalAlpha = alpha; c.shadowColor = 'rgba(0,0,0,0.7)'; c.shadowBlur = 40; c.shadowOffsetY = 16; c.drawImage(tex, -tex.width / 2, -tex.height / 2); c.restore(); }
// câmera 2D: aproxima (z) em volta de (cx, cy) com tremor de mão; devolve a função que leva um ponto da prancha para a tela
export function camera2D(t, cx, cy, z, { amp = 4, rot = 0 } = {}) {
  const hh = mao(t, amp); g.save(); g.translate(W / 2 + hh.x, H / 2 + hh.y); g.rotate(hh.r + rot); g.scale(z, z); g.translate(-cx, -cy);
  return p => [(p[0] - cx) * z + W / 2, (p[1] - cy) * z + H / 2];
}
export function carimbo(c, x, y, k, texto = 'CASO ABERTO', { rot = -0.14, larg = 460 } = {}) {
  if (k <= 0) return; const s = lerp(1.7, 1, easeOut(k)); c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.globalAlpha = 0.88 * k;
  c.strokeStyle = COR.verm; c.lineWidth = 6; c.strokeRect(-larg / 2, -62, larg, 124); c.lineWidth = 2; c.strokeRect(-larg / 2 + 12, -50, larg - 24, 100);
  c.fillStyle = COR.verm; c.font = '64px Maquina'; c.textAlign = 'center'; c.letterSpacing = '6px'; c.fillText(texto, 0, 22);
  c.globalCompositeOperation = 'destination-out'; const r = rng(17); for (let i = 0; i < 160; i++) { c.globalAlpha = 0.5 * r(); c.beginPath(); c.arc((r() - 0.5) * larg, (r() - 0.5) * 130, 1 + r() * 4, 0, 6.3); c.fill(); }
  c.restore();
}

// ---------- prancha de arquiteto (moldura, grade, registro, norte, escala e carimbo) ----------
export function prancha(c, t, { linhas = [], folha = '01/13' } = {}) {
  const a = 0.44, p0 = prog(t, 0.3, 1.1), ap = a * clamp((t - 0.7) / 0.5);
  tinta(c, [[60, 150], [1020, 150], [1020, 1770], [60, 1770], [60, 150]], p0, { w: 1.1, alpha: a, over: 16, seed: 201 });
  tinta(c, [[82, 172], [998, 172], [998, 1748], [82, 1748], [82, 172]], p0, { w: 2.6, alpha: a, over: 0, seed: 202 });
  c.save(); c.globalAlpha = ap; c.fillStyle = COR.cinza; c.font = '17px Maquina'; c.textAlign = 'center'; c.textBaseline = 'middle';
  const tk = [];
  'ABCDEF'.split('').forEach((L, i) => { const x = 82 + (i + 0.5) * 916 / 6; c.fillText(L, x, 161); c.fillText(L, x, 1759); if (i) { const xx = 82 + i * 916 / 6; tk.push([[xx, 150], [xx, 172]], [[xx, 1748], [xx, 1770]]); } });
  for (let i = 0; i < 8; i++) { const y = 172 + (i + 0.5) * 1576 / 8; c.fillText(String(i + 1), 71, y); c.fillText(String(i + 1), 1009, y); if (i) { const yy = 172 + i * 1576 / 8; tk.push([[60, yy], [82, yy]], [[998, yy], [1020, yy]]); } }
  c.restore(); riscos(c, tk, { w: 1, alpha: ap, cor: COR.cinza });
  const reg = []; for (const [x, y] of [[120, 212], [960, 212], [120, 1708], [960, 1708]]) reg.push([[x - 18, y], [x + 18, y]], [[x, y - 18], [x, y + 18]], Array.from({ length: 21 }, (_, k) => [x + Math.cos(k / 20 * 6.283) * 10, y + Math.sin(k / 20 * 6.283) * 10]));
  riscos(c, reg, { w: 1, alpha: ap });
  const nx = 175, ny = 1560, pn = prog(t, 1.0, 0.6);
  tinta(c, Array.from({ length: 33 }, (_, k) => [nx + Math.cos(k / 32 * 6.283) * 38, ny + Math.sin(k / 32 * 6.283) * 38]), pn, { w: 1.4, alpha: a + 0.1, over: 0, seed: 203 });
  if (pn >= 1) { c.save(); c.globalAlpha = a + 0.15; c.fillStyle = COR.osso; c.beginPath(); c.moveTo(nx, ny - 34); c.lineTo(nx + 12, ny + 18); c.lineTo(nx, ny + 8); c.closePath(); c.fill(); c.strokeStyle = COR.osso; c.lineWidth = 1.3; c.beginPath(); c.moveTo(nx, ny - 34); c.lineTo(nx - 12, ny + 18); c.lineTo(nx, ny + 8); c.stroke(); c.font = '22px Maquina'; c.textAlign = 'center'; c.fillText('N', nx, ny - 48); c.restore(); }
  const ex = 130, ey = 1675, pe = prog(t, 1.2, 0.5);
  if (pe > 0) { c.save(); c.globalAlpha = (a + 0.05) * pe; for (let i = 0; i < 5; i++) { c.strokeStyle = COR.osso; c.lineWidth = 1.2; c.strokeRect(ex + i * 50, ey, 50, 10); if (i % 2 === 0) { c.fillStyle = COR.osso; c.fillRect(ex + i * 50, ey, 50, 10); } }
    c.fillStyle = COR.cinza; c.font = '16px Maquina'; c.textAlign = 'center'; for (let i = 0; i <= 5; i++) c.fillText(String(i), ex + i * 50, ey + 30); c.textAlign = 'left'; c.fillText('m', ex + 262, ey + 30); c.fillText('ESC. 1:50', ex, ey - 12); c.restore(); }
  const bx = 560, by = 1540, bw = 438, bh = 208, pc = prog(t, 0.9, 0.7);
  tinta(c, [[bx, by], [bx + bw, by], [bx + bw, by + bh], [bx, by + bh], [bx, by]], pc, { w: 1.6, alpha: a + 0.08, over: 6, seed: 204 });
  riscos(c, [[[bx, by + 62], [bx + bw, by + 62]], [[bx, by + 110], [bx + bw, by + 110]], [[bx, by + 158], [bx + bw, by + 158]], [[bx + 250, by + 110], [bx + 250, by + bh]]], { w: 1, alpha: (a + 0.05) * pc });
  const L = (s, x, y, t0, o) => datilo(c, s, x, y, (t - t0) / 0.5 * s.length, { alpha: a + 0.2, cor: COR.cinza, ...o });
  L('ARQUIVO MORTO', bx + 18, by + 44, 1.3, { fonte: 'Serifa', tam: 30, cor: COR.osso, esp: 2 });
  L(linhas[0] || '', bx + 18, by + 94, 1.5, { fonte: 'Maquina', tam: 17 });
  L(linhas[1] || 'PLANTA BAIXA', bx + 18, by + 142, 1.7, { fonte: 'Maquina', tam: 17 }); L('ESC. 1:50', bx + 268, by + 142, 1.8, { fonte: 'Maquina', tam: 17 });
  L('DES.: O ARQUIVISTA', bx + 18, by + 190, 1.9, { fonte: 'Maquina', tam: 17 }); L('PRANCHA ' + folha, bx + 268, by + 190, 2.0, { fonte: 'Maquina', tam: 17 });
}
// título grande, letra por letra
export function titulo(c, t, s, y, t0, { tam = 106 } = {}) {
  c.save(); c.font = `${tam}px Serifa`; c.letterSpacing = '2px'; let wd = c.measureText(s).width; const k = Math.min(1, 900 / wd); c.translate(W / 2, y); c.scale(k, k); let x = -wd / 2;
  for (let i = 0; i < s.length; i++) { const a = easeOut(prog(t, t0 + i * 0.03, 0.22)); c.globalAlpha = a; c.fillStyle = CLARO; c.fillText(s[i], x, (1 - a) * 18); x += c.measureText(s[i]).width + 2; } c.restore();
}
// a lanterna acendendo no começo do vídeo
export const ligaLanterna = t => t < 0.28 ? 0 : t < 0.5 ? [0.7, 0, 0, 0.9, 0.4, 1][Math.floor((t - 0.28) / 0.037)] ?? 1 : 1;

// ---------- cartão final ----------
export function cartaoFinal(t, t0, N, num, { linhas = [] } = {}) {
  const { S, P } = N, i = N.TL.length;
  const cam = camera2D(t, W / 2, H / 2, 1, { amp: 3 });
  fundo();
  prancha(g, t - t0 + 3.2, { linhas });
  g.save(); g.font = '30px Datilo'; g.fillStyle = COR.cinza; g.textAlign = 'center'; g.letterSpacing = '6px'; g.globalAlpha = clamp((t - t0) / 0.4); g.fillText('ARQUIVO MORTO', W / 2, 640); g.restore();
  g.save(); g.font = '104px Serifa'; g.fillStyle = CLARO; g.textAlign = 'center'; g.globalAlpha = easeOut(clamp((t - S(i)) / 0.4)); g.fillText(`CASO ${num} DE 13`, W / 2, 800); g.restore();
  datilo(g, 'A solução está no arquivo.', W / 2, 920, (t - P(i, 'A solução')) / 0.9 * 26, { fonte: 'Maquina', tam: 44, cor: COR.osso, alinh: 'center' });
  const tlk = P(i, 'Link');
  if (t > tlk - 0.1) { const a = easeOut(clamp((t - tlk + 0.1) / 0.3)); g.save(); g.globalAlpha = a; g.strokeStyle = COR.verm; g.lineWidth = 3; g.strokeRect(W / 2 - 200, 1010, 400, 92); g.fillStyle = VERM_TXT; g.font = '46px Maquina'; g.textAlign = 'center'; g.letterSpacing = '6px'; g.fillText('LINK NA BIO', W / 2, 1073); g.restore(); }
  carimbo(g, W / 2 + 150, 1290, clamp((t - P(i, 'treze') - 0.15) / 0.12));
  g.restore();
  return { focos: [{ x: 540, y: 900, r: 1050 }], amb: 0.22, mult: clamp((t - t0) / 0.25) };
}

// ---------- blocos 3D (paredes, peitoris, portas, móveis) desenhados do mais longe para o mais perto ----------
// b: {x0,x1,z0,z1,h, y0?, tipo, linhas?(h), i}
export const COR_BLOCO = { parede: ['#1e1913', '#b8ab92', 0.75], janela: ['#1e1913', '#8f846f', 0.7], porta: ['#2a231b', '#9c9079', 0.7], movel: ['#18140f', '#4d4436', 0.6], escuro: ['#120f0c', '#2b241d', 0.6] };
export function blocos(cam, lista, t = 99) {
  const Rz = (l, op) => riscos(g, l.flatMap(pts => cam.linha(pts)), op);
  const vis = lista.map(b => ({ ...b, hh: (b.h) * (b.t0 != null ? easeOut(prog(t, b.t0, 0.55)) : 1), d: cam.prof([(b.x0 + b.x1) / 2, (b.y0 || 0) + b.h / 2, (b.z0 + b.z1) / 2]) })).sort((a, b) => b.d - a.d);
  for (const b of vis) {
    if (b.hh < 0.02) continue;
    const [cl, ct, ea] = b.cores || COR_BLOCO[b.tipo || 'parede'], y0 = b.y0 || 0, hb = y0 + b.hh;
    const c = [[b.x0, y0, b.z0], [b.x1, y0, b.z0], [b.x1, y0, b.z1], [b.x0, y0, b.z1]], tp = c.map(q => [q[0], hb, q[2]]);
    const faces = [[c[0], c[1], tp[1], tp[0], [0, 0, -1]], [c[1], c[2], tp[2], tp[1], [1, 0, 0]], [c[2], c[3], tp[3], tp[2], [0, 0, 1]], [c[3], c[0], tp[0], tp[3], [-1, 0, 0]]];
    for (const f of faces) {
      const n = f[4], m = [(f[0][0] + f[2][0]) / 2, 0, (f[0][2] + f[2][2]) / 2]; if ((cam.p[0] - m[0]) * n[0] + (cam.p[2] - m[2]) * n[2] <= 0) continue;
      const pl = cam.poli(f.slice(0, 4)); if (!pl) continue; caminho(g, pl); g.fillStyle = cl; g.fill();
      if ((b.tipo || 'parede') === 'parede') tinta(g, [...pl, pl[0]], 1, { w: 1.5, alpha: ea, over: 0, seed: (b.i || 0) + 3 }); else riscos(g, [[...pl, pl[0]]], { w: 1.1, alpha: ea });
    }
    if (cam.p[1] > hb) { const pt = cam.poli(tp); if (pt) { caminho(g, pt); g.fillStyle = ct; g.fill(); if ((b.tipo || 'parede') === 'parede') tinta(g, [...pt, pt[0]], 1, { w: 1.8, over: 4, seed: (b.i || 0) + 7 }); else riscos(g, [[...pt, pt[0]]], { w: 1.2, alpha: 0.85 }); } }
    if (b.linhas) Rz(b.linhas(hb + 0.002), { w: b.tipo === 'janela' ? 1.6 : 1.1, alpha: b.tipo === 'janela' ? 0.9 : 0.7, cor: b.tipo === 'janela' ? CLARO : COR.osso });
    if (b.depois) b.depois(cam, hb);
  }
}
// parede (segmento em planta) -> bloco
export const parede = ([x1, z1, x2, z2], h, extra = {}, esp = 0.14) => ({ x0: Math.min(x1, x2) - esp / 2, x1: Math.max(x1, x2) + esp / 2, z0: Math.min(z1, z2) - esp / 2, z1: Math.max(z1, z2) + esp / 2, h, tipo: 'parede', ...extra });

// ---------- o laço de render: tomadas, trocas com a luz piscando, legendas ----------
export function rodar({ FIM, TOMADAS, legendasFn }) {
  const TROCAS = TOMADAS.slice(1).map(x => x[0]);
  window.TOTAL_FRAMES = Math.ceil(FIM * FPS);
  window.renderAt = f => {
    const t = f / FPS; limpar();
    let fn = TOMADAS[0][1]; for (const [a, h] of TOMADAS) if (t >= a) fn = h;
    const r = fn(t);
    poeira(g, t);
    iluminar(r.focos, r.amb, t, r.mult * TROCAS.reduce((m, tc) => m * pisca(t, tc), 1));
    if (legendasFn) legendasFn(t);
    compor(t, { fade: smooth(FIM - 0.9, FIM, t) });
    return 1;
  };
  window.READY = true;
}
