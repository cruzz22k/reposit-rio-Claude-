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
const FICHAS = JSON.parse(ler('fichas.json'));
const ANOT = JSON.parse(ler('anotacoes.json')); // perguntas-guia de cada caso, na página de anotações
const bolas = n => `<span class="bolas">${'●'.repeat(n)}<span class="off">${'●'.repeat(5 - n)}</span></span>`;
const ROT_DIF = ['', 'muito fácil', 'fácil', 'média', 'difícil', 'muito difícil'];
const docsDe = h => [...h.matchAll(/<div class="rotulo"[^>]*>(Documento \d+[^<]*)<\/div>/g)].map(m => m[1].replace(/\s+/g, ' ').trim());
let corpo = '', solucoes = '', placar = '';
for (const f of casos) {
  const num = f.slice(0, 3), [caso0, sol0] = ler('partes/' + f).split('<!-- SOLUCAO -->');
  const ex = fs.existsSync(P('extras/' + f)) ? ler('extras/' + f) : '';
  const exDocs = ex ? ex.split('<!-- SOL -->')[0].replace('<!-- DOCS -->', '') : '', exSol = ex ? (ex.split('<!-- SOL -->')[1] || '') : '';
  const titulo = (caso0.match(/<h2>([^<]+)<\/h2>/) || [])[1] || '';
  const fi = FICHAS[num] || {}, nDocs = docsDe(caso0).length + docsDe(exDocs).length;
  const caso = caso0.replace(`id="c${num}"`, '');
  const ficha = `<section class="pagina ficha" id="c${num}">
  <div class="aba">ARQUIVO MORTO</div>
  <div class="rotulo">Ficha do caso</div>
  <div class="num">${num}</div>
  <h2>${titulo}</h2>
  <table class="ficha-tab">
    <tr><th>Local</th><td>${fi.local || ''}</td></tr>
    <tr><th>Imóvel</th><td>${fi.tipo || ''}</td></tr>
    <tr><th>Período</th><td>${fi.periodo || ''}</td></tr>
    <tr><th>Depoimento</th><td>${fi.depoimento || ''}</td></tr>
    <tr><th>Envolvidos</th><td><ul>${(fi.envolvidos || []).map(e => `<li>${e}</li>`).join('')}</ul></td></tr>
    <tr><th>Documentos</th><td>${nDocs} anexados ao envelope</td></tr>
    <tr><th>Dificuldade</th><td>${bolas(fi.dificuldade || 3)} &nbsp;${ROT_DIF[fi.dificuldade || 3]}</td></tr>
    <tr><th>Leitura</th><td>cerca de ${fi.tempo || '20 min'}</td></tr>
  </table>
  <div class="pergunta"><span>A pergunta do arquivo</span>${fi.pergunta || ''}</div>
  <p class="instr">Leia o relato, examine os documentos e anote a sua hipótese antes de procurar a solução.</p>
  <div class="carimbo">CASO ABERTO</div>
  <div class="rodape"><span>CASO ${num} · FICHA</span><span class="pg"></span></div>
</section>
`;
  const an = ANOT[num] || {};
  const campo = (rot, guia, n) => `<div class="campo"><b>${rot}</b>${guia ? `<span class="guia">${guia}</span>` : ''}<div class="linhas">${'<i></i>'.repeat(n)}</div></div>`;
  const anot = `<section class="pagina anot">
  <div class="rotulo">Caso ${num} · Suas anotações</div>
  <h2>E então?</h2>
  <div class="campo"><b>${fi.pergunta || 'A pergunta do arquivo'}</b></div>
  <p class="intro">Escreva a sua teoria antes de ver a solução. As perguntas em cinza ajudam a pensar.</p>
  ${campo('Quem?', an.quem, 2)}
  ${campo('Como?', an.como, 2)}
  ${campo('Por quê?', an.porque, 2)}
  ${campo('A pista que decidiu', 'Qual documento entrega a resposta? Anote o número dele.', 1)}
  ${campo('Datas e medidas que importam', an.medidas, 2)}
  <div class="caixas"><span>☐ resolvi sozinho</span><span>☐ precisei das pistas</span><span>☐ fui direto à solução</span></div>
  <p class="dica">Quando tiver certeza, confira a solução na <span class="pgref" data-ref="s${num}"></span>.</p>
  <div class="rodape"><span>CASO ${num} · ANOTAÇÕES</span><span class="pg"></span></div>
</section>
`;
  corpo += ficha + caso + exDocs + anot; solucoes += (sol0 || '') + exSol;
  placar += `<tr><td>${num}</td><td>${titulo}</td><td>${bolas(fi.dificuldade || 3)}</td><td><span class="cx"></span></td><td><span class="cx"></span></td><td><span class="cx"></span></td></tr>`;
}
// placar do investigador e índice de documentos (no fim do volume)
const placarPg = `<section class="pagina" id="placar">
  <div class="rotulo">Placar do investigador</div>
  <h2>Quantos você resolveu?</h2>
  <table class="placar"><tr><th>Caso</th><th style="text-align:left">Título</th><th>Grau</th><th>Sozinho</th><th>Com pistas</th><th>Li a solução</th></tr>${placar}</table>
  <p style="margin-top:5mm; font-size:9pt">Conte 3 pontos para cada caso resolvido sozinho, 1 para cada caso resolvido com as pistas. <b>30 ou mais</b>: o Arquivo tem uma vaga para você. <b>Menos de 10</b>: talvez seja melhor não medir a sua casa.</p>
  <div class="rodape"><span>ARQUIVO MORTO · VOL. 1</span><span class="pg"></span></div>
</section>
`;
let itens = []; for (const f of casos) { const num = f.slice(0, 3), [c0] = ler('partes/' + f).split('<!-- SOLUCAO -->'), ex = fs.existsSync(P('extras/' + f)) ? ler('extras/' + f).split('<!-- SOL -->')[0] : ''; itens.push(`<div class="caso">CASO ${num}</div>`); [...docsDe(c0), ...docsDe(ex)].forEach((d, i) => itens.push(`<div class="item"><span>${d.replace(/^Documento \d+ · /, (i + 1) + '. ')}</span><span class="pgdoc" data-k="${num}|${d.split(' · ')[0]}"></span></div>`)); }
const meio = Math.ceil(itens.length / 2);
const indicePg = `<section class="pagina" id="indice"><div class="rotulo">Índice de documentos</div><h2>Tudo o que veio nos envelopes</h2><div class="indice-docs">${itens.slice(0, meio).join('')}</div><div class="rodape"><span>ARQUIVO MORTO · VOL. 1</span><span class="pg"></span></div></section>
<section class="pagina"><div class="rotulo">Índice de documentos</div><div class="indice-docs" style="margin-top:4mm">${itens.slice(meio).join('')}</div><div class="rodape"><span>ARQUIVO MORTO · VOL. 1</span><span class="pg"></span></div></section>
`;
let html = ler('partes/00-abertura.html') + ler('partes/01-guia.html') + corpo + ler('partes/90-solucoes.html') + solucoes + placarPg + indicePg + ler('partes/99-fim.html');

// numera as páginas e guarda em que página começa cada caso e cada solução
let n = 0; const ref = {};
html = html.replace(/<section class="pagina([^"]*)"([^>]*)>/g, (m, cls, attrs) => {
  n++; const id = (attrs.match(/id="([^"]+)"/) || [])[1]; if (id) ref[id] = n; return m;
});
let k = 0; html = html.replace(/<section class="pagina[\s\S]*?<\/section>/g, sec => { k++; return sec.replace('<span class="pg"></span>', `<span class="pg">${String(k).padStart(2, '0')}</span>`); });
const pgDoc = {}; { let kk = 0; for (const sec of html.match(/<section class="pagina[\s\S]*?<\/section>/g)) { kk++; const cs = (sec.match(/<span>CASO (\d{3})/) || [])[1]; if (!cs) continue; for (const m of sec.matchAll(/<div class="rotulo"[^>]*>(Documento \d+)/g)) if (!pgDoc[cs + '|' + m[1]]) pgDoc[cs + '|' + m[1]] = kk; } }
html = html.replace(/<span class="pgdoc" data-k="([^"]+)"><\/span>/g, (m, k) => `<span class="pg">${pgDoc[k] ? 'p. ' + pgDoc[k] : '??'}</span>`);
html = html.replace(/<span class="pgref" data-ref="([^"]+)"><\/span>/g, (m, id) => `<span class="pg">${ref[id] ? 'p. ' + ref[id] : '??'}</span>`);

const doc = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Arquivo Morto — Vol. 1</title><link rel="stylesheet" href="estilo.css"></head><body>\n${html}\n</body></html>`;
fs.writeFileSync(P('ebook-completo.html'), doc);

(async () => {
  const final = process.argv.includes('--final');
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + P('ebook-completo.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  // pautas como linhas de verdade (degradês repetidos saem errados em leitores de PDF de celular)
  await p.evaluate(() => {
    const mm = 96 / 25.4;
    const pauta = (el, passo, esp, cor, vertical, ini = passo - esp) => {
      const cam = document.createElement('div'); cam.className = 'pauta';
      const tam = vertical ? el.clientWidth : el.clientHeight;
      for (let x = ini; x < tam; x += passo) {
        const l = document.createElement('div'); l.style.cssText = `position:absolute;background:${cor};` + (vertical ? `left:${x}px;top:0;bottom:0;width:${esp}px` : `top:${x}px;left:0;right:0;height:${esp}px`);
        cam.appendChild(l);
      }
      el.prepend(cam);
    };
    document.querySelectorAll('.doc.caderno').forEach(e => pauta(e, 5.45 * mm, 0.25 * mm, '#b9c6d4', false, (3 + 4.75) * mm)); // logo abaixo de cada linha escrita (3 mm de margem + base do texto)
    document.querySelectorAll('section.ficha').forEach(e => pauta(e, 6 * mm, 1, '#ddceb0', true));
  });
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
