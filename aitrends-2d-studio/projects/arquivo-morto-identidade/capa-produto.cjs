// Exporta a capa quadrada do produto (Kiwify/Hotmart). Uso: node capa-produto.cjs <saida.png>
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const saida = process.argv[2]; if (!saida) throw new Error('informe o arquivo de saída');
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(__dirname, 'capa-produto.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await (await p.$('#capa')).screenshot({ path: path.resolve(saida) });
  await b.close(); console.log('ok', saida);
})();
