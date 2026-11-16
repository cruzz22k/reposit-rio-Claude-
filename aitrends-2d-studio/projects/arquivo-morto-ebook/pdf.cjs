// Gera o PDF do e-book a partir do HTML (Chromium sem tela) e prévias em PNG de algumas páginas.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + path.resolve(__dirname, 'ebook.html'));
  await p.waitForTimeout(800);
  let v = 1, alvo; do { alvo = path.join(__dirname, `out/arquivo-morto-vol1-amostra${v > 1 ? '-v' + v : ''}.pdf`); v++; } while (require('fs').existsSync(alvo));
  await p.pdf({ path: alvo, format: 'A5', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  await p.setViewportSize({ width: 560, height: 794 });
  const pages = await p.$$('section.pagina');
  for (const i of [0, 3, 5, 7]) await pages[i].screenshot({ path: path.join(__dirname, `build/amostra-previa-${i}.png`) });
  await b.close();
})();
