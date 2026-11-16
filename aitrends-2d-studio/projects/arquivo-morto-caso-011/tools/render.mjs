// Renderiza o episódio quadro a quadro no Chromium sem tela e codifica com ffmpeg.
//   node projects/arquivo-morto-caso-011/tools/render.mjs --stills 2,6.3,10.8 --tag teste        -> build/stills-<tag>/
//   node projects/arquivo-morto-caso-011/tools/render.mjs --from 20 --to 26 --out build/voo.mp4   -> trecho
//   node projects/arquivo-morto-caso-011/tools/render.mjs --out build/video-v1-mudo.mp4           -> vídeo inteiro (sem som)
// Opções: --scale 0.5  --spp N (força amostras)  --workers 3  --seq 22,23,1/30 (sequência de quadros de um voo)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const PROJECT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), ROOT = path.resolve(PROJECT, '../..');
const { chromium } = createRequire(path.join(ROOT, 'render.mjs'))('playwright');
const args = {}; { const a = process.argv.slice(2); for (let i = 0; i < a.length; i++) if (a[i].startsWith('--')) { const k = a[i].slice(2); args[k] = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true; } }
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.bin': 'application/octet-stream' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const p = url.startsWith('/project/') ? path.join(PROJECT, url.slice(9)) : path.join(ROOT, url);
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(p).pipe(res);
}).listen(0);
const PORT = server.address().port, SCALE = +(args.scale || 1), W = Math.round(1080 * SCALE), H = Math.round(1920 * SCALE);
const ABERTOS = [];
const LAUNCH = { args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--disable-dev-shm-usage'] };
async function open(browser) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  page.on('pageerror', e => console.log('[erro na página]', e.message)); page.on('console', m => { if (m.type() === 'error') console.log('[console]', m.text()); });
  await page.goto(`http://localhost:${PORT}/project/web/index.html?scale=${SCALE}${args.spp ? '&spp=' + args.spp : ''}${args.fim ? '&fim=' + args.fim : ''}${args.geral ? '&geral=1' : ''}${args.amb ? '&amb=' + args.amb : ''}${args.expo ? '&expo=' + args.expo : ''}`);
  await page.waitForFunction('window.READY === true || !!window.BOOT_ERROR', null, { timeout: 180000 });
  const err = await page.evaluate('window.BOOT_ERROR'); if (err) throw new Error(err);
  return page;
}
const grab = async (page, f) => { const spp = await page.evaluate(i => window.renderAt(i), f); const img = await page.screenshot({ type: 'jpeg', quality: 95, timeout: 0 }); return { img, spp }; };
const fmt = s => `${Math.floor(s / 60)}m${String(Math.round(s % 60)).padStart(2, '0')}s`;
try {
  const b0 = await chromium.launch(LAUNCH); const p0 = await open(b0); const TOTAL = await p0.evaluate('window.TOTAL_FRAMES');
  if (args.stills || args.seq) {
    let times;
    if (args.seq) { const [a, b, st] = String(args.seq).split(','); const step = eval(st || '1/30'); times = []; for (let t = +a; t <= +b + 1e-9; t += step) times.push(+t.toFixed(4)); }
    else times = String(args.stills).split(',').map(Number);
    const dir = path.join(PROJECT, 'build', `stills-${args.tag || 'x'}`); fs.mkdirSync(dir, { recursive: true });
    for (const t of times) { const t0 = Date.now(); const { img, spp } = await grab(p0, Math.round(t * 30)); const f = path.join(dir, `${t.toFixed(2).padStart(6, '0')}.jpg`); fs.writeFileSync(f, img); console.log(`${t.toFixed(2)}s  ${spp} amostras  ${((Date.now() - t0) / 1000).toFixed(1)} s  -> ${path.relative(PROJECT, f)}`); }
    await b0.close();
  } else {
    await b0.close();
    const f0 = Math.round((+args.from || 0) * 30), f1 = Math.min(TOTAL, args.to ? Math.round(+args.to * 30) : TOTAL);
    const out = path.resolve(PROJECT, args.out || 'build/trecho.mp4');
    if (fs.existsSync(out) && !args.from && !args.to) throw new Error(`${out} já existe: nunca grave uma versão por cima da anterior`);
    const NW = +(args.workers || 3), chunk = Math.ceil((f1 - f0) / NW), parts = path.join(PROJECT, 'build', 'parts-' + path.basename(out, '.mp4')); fs.rmSync(parts, { recursive: true, force: true }); fs.mkdirSync(parts, { recursive: true });
    let done = 0; const t0 = Date.now();
    const work = async k => {
      const a = f0 + k * chunk, b = Math.min(f1, a + chunk); if (a >= b) return null;
      const browser = await chromium.launch(LAUNCH); ABERTOS.push(browser); const page = await open(browser), file = path.join(parts, `p${k}.mp4`);
      const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', '30', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', '30', file], { stdio: ['pipe', 'inherit', 'inherit'] });
      for (let f = a; f < b; f++) { const { img } = await grab(page, f); if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r)); if (++done % 30 === 0) { const el = (Date.now() - t0) / 1000; console.log(`  ${done}/${f1 - f0} quadros  ${fmt(el)}  faltam ~${fmt(el / done * (f1 - f0 - done))}`); } }
      ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close(); return file;
    };
    const files = (await Promise.all([...Array(NW)].map((_, k) => work(k)))).filter(Boolean);
    const list = path.join(parts, 'lista.txt'); fs.writeFileSync(list, files.map(f => `file '${f}'`).join('\n'));
    await new Promise((res, rej) => spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', out], { stdio: 'inherit' }).on('close', c => c ? rej(new Error('concat falhou')) : res()));
    console.log(`Pronto: ${out}  (${fmt((Date.now() - t0) / 1000)})`);
  }
} catch (e) { console.error('FALHOU:', e.message); for (const b of ABERTOS) await b.close().catch(() => {}); server.close(); process.exit(1); } finally { server.close(); }
