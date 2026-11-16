// Exporta as artes da identidade do canal em PNG, no tamanho exato de cada rede.
//   node exportar.cjs  -> out/foto-de-perfil.png, out/banner-youtube.png, out/capas/capa-001.png ...
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2600, height: 2000 } });
  await p.goto('file://' + path.join(__dirname, 'identidade.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
  fs.mkdirSync(path.join(__dirname, 'out/capas'), { recursive: true });
  const salvar = async (sel, arq) => { await (await p.$(sel)).screenshot({ path: path.join(__dirname, 'out', arq) }); console.log(arq); };
  await salvar('#perfil', 'foto-de-perfil.png');
  await salvar('#banner', 'banner-youtube.png');
  for (const el of await p.$$('.capa')) { const id = await el.getAttribute('id'); await el.screenshot({ path: path.join(__dirname, 'out/capas', id + '.png') }); }
  console.log('capas:', fs.readdirSync(path.join(__dirname, 'out/capas')).length);
  await b.close();
})();
