// Exporta o calendário de postagens (1080x1920). Uso: node calendario.cjs <saida.png>
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const saida = process.argv[2]; if (!saida) throw new Error('informe o arquivo de saída');
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'calendario.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  await (await p.$('#cal')).screenshot({ path: path.resolve(saida) });
  await b.close(); console.log('ok', saida);
})();
