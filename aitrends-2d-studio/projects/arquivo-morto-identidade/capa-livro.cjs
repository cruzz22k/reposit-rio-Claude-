// Fotografa a capa do e-book (primeira página) em alta resolução, para a arte do produto.
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 600, height: 900 }, deviceScaleFactor: 3 });
  await p.goto('file://' + path.join(__dirname, '../arquivo-morto-ebook/ebook-completo.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await (await p.$('section.pagina')).screenshot({ path: path.join(__dirname, 'build/capa-livro.png') });
  await b.close(); console.log('ok');
})();
