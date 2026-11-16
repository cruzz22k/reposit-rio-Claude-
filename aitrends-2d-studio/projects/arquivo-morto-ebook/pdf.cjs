// Gera o PDF do e-book a partir do HTML (Chromium sem tela) e prévias em PNG de algumas páginas.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, 'ebook.html'));
  await p.waitForTimeout(800);
  await p.pdf({ path: path.join(__dirname, 'out/arquivo-morto-vol1-amostra.pdf'), format: 'A5', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  await p.setViewportSize({ width: 560, height: 794 });
  const pages = await p.$$('section.pagina');
  for (const i of [0, 3, 5, 7]) await pages[i].screenshot({ path: path.join(__dirname, `out/previa-${i}.png`) });
  await b.close();
})();
