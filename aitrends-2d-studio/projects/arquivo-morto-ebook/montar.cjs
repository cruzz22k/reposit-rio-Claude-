// Monta o volume completo do Arquivo Morto a partir das partes:
//   partes/00-abertura.html, partes/001.html ... partes/013.html, partes/99-fim.html
// Cada caso tem o texto do caso e, depois da marca <!-- SOLUCAO -->, a página de solução,
// que vai para a seção de soluções no fim do livro.
// Numera as páginas, preenche o sumário, confere se algum texto passou da página e gera o PDF.
//   node montar.cjs           -> build/previa.pdf + build/paginas/*.png (para conferir)
//   node montar.cjs --final   -> out/arquivo-morto-vol1-completo.pdf (nunca grava por cima: cria -v2, -v3...)
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const D = __dirname, P = f => path.join(D, f);
const ler = f => fs.readFileSync(P(f), 'utf8');

const casos = fs.readdirSync(P('partes')).filter(f => /^\d{3}\.html$/.test(f)).sort();
let corpo = '', solucoes = '';
for (const f of casos) {
  const [caso, sol] = ler('partes/' + f).split('<!-- SOLUCAO -->');
  corpo += caso; solucoes += sol || '';
}
let html = ler('partes/00-abertura.html') + corpo + ler('partes/90-solucoes.html') + solucoes + ler('partes/99-fim.html');

// numera as páginas e guarda em que página começa cada caso e cada solução
let n = 0; const ref = {};
html = html.replace(/<section class="pagina([^"]*)"([^>]*)>/g, (m, cls, attrs) => {
  n++; const id = (attrs.match(/id="([^"]+)"/) || [])[1]; if (id) ref[id] = n; return m;
});
let k = 0; html = html.replace(/<section class="pagina[\s\S]*?<\/section>/g, sec => { k++; return sec.replace('<span class="pg"></span>', `<span class="pg">${String(k).padStart(2, '0')}</span>`); });
html = html.replace(/<span class="pgref" data-ref="([^"]+)"><\/span>/g, (m, id) => `<span class="pg">${ref[id] ? 'p. ' + ref[id] : '??'}</span>`);

const doc = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Arquivo Morto — Vol. 1</title><link rel="stylesheet" href="estilo.css"></head><body>\n${html}\n</body></html>`;
fs.writeFileSync(P('ebook-completo.html'), doc);

(async () => {
  const final = process.argv.includes('--final');
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + P('ebook-completo.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  // confere páginas: nada pode passar do limite (área acima do rodapé)
  const prob = await p.evaluate(() => {
    const mm = 96 / 25.4, out = [];
    document.querySelectorAll('section.pagina').forEach((s, i) => {
      const r = s.getBoundingClientRect(), lim = r.bottom - 15 * mm; let max = 0;
      s.querySelectorAll('*').forEach(e => { if (e.closest('.rodape') || getComputedStyle(e).position === 'absolute') return; const b = e.getBoundingClientRect(); if (b.height) max = Math.max(max, b.bottom); });
      if (max > lim + 1) out.push(`página ${i + 1}: passou ${((max - lim) / mm).toFixed(1)} mm`);
    });
    return out;
  });
  let alvo;
  if (final) { fs.mkdirSync(P('out'), { recursive: true }); let v = 1; do { alvo = P(`out/arquivo-morto-vol1-completo${v > 1 ? '-v' + v : ''}.pdf`); v++; } while (fs.existsSync(alvo)); }
  else { fs.mkdirSync(P('build/paginas'), { recursive: true }); alvo = P('build/previa.pdf'); }
  await p.pdf({ path: alvo, format: 'A5', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  if (!final) {
    await p.setViewportSize({ width: 560, height: 794 });
    for (const f of fs.readdirSync(P('build/paginas'))) fs.unlinkSync(P('build/paginas/' + f));
    const pags = await p.$$('section.pagina');
    for (let i = 0; i < pags.length; i++) await pags[i].screenshot({ path: P(`build/paginas/p${String(i + 1).padStart(2, '0')}.png`) });
  }
  await b.close();
  console.log(`${n} páginas -> ${path.relative(D, alvo)}`);
  console.log(prob.length ? 'PROBLEMAS:\n' + prob.join('\n') : 'Nenhuma página passou do limite.');
  const faltando = Object.keys(ref).length; console.log(`Âncoras do sumário: ${faltando}`);
})();
