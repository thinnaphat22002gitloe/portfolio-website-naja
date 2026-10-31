// node src/build.mjs [outHtmlDir] [pngOutDir] [only]
import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright-core'; import sharp from 'sharp';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlDir = path.resolve(process.argv[2] || path.join(root, 'apps'));
const pngDir = path.resolve(process.argv[3] || path.join(root, 'out'));
const only = process.argv[4];
const APPS = { 'nova-commerce': 'nova', 'paysmart-banking': 'paysmart', 'pulse-analytics': 'pulse', 'tablefy-booking': 'tablefy', 'estatia-realestate': 'estatia', 'atlas-ai-console': 'atlas' };
fs.mkdirSync(path.join(htmlDir, '_shared', 'photos'), { recursive: true }); fs.mkdirSync(pngDir, { recursive: true });
fs.copyFileSync(path.join(root, 'node_modules/chart.js/dist/chart.umd.js'), path.join(htmlDir, '_shared/chart.umd.js'));
for (const f of fs.readdirSync(path.join(root, 'photos/big'))) fs.copyFileSync(path.join(root, 'photos/big', f), path.join(htmlDir, '_shared/photos', f));
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome' });
for (const [slug, mod] of Object.entries(APPS)) {
  if (only && only !== slug) continue;
  if (!fs.existsSync(path.join(root, 'src', mod + '.mjs'))) continue;
  const m = await import(path.join(root, 'src', mod + '.mjs'));
  const dir = path.join(htmlDir, slug); fs.mkdirSync(dir, { recursive: true });
  let n = 0;
  for (const [name, opt = {}] of m.shots) {
    const names = opt.group || [name];
    const bufs = [];
    for (const nm of names) {
      const html = m.pages[nm]();
      fs.writeFileSync(path.join(dir, nm + '.html'), html);
      const mobile = opt.group || opt.mobile;
      const ctx = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
      const pg = await ctx.newPage();
      await pg.goto('file://' + path.join(dir, nm + '.html'));
      await pg.waitForFunction(() => window.__ready === true); await pg.waitForTimeout(250);
      bufs.push(await pg.screenshot()); await ctx.close();
    }
    let buf = bufs[0];
    if (opt.group) { // plain side-by-side board of real mobile screenshots (no device frames)
      const W = 1600, H = 1000, sw = 390, sh = 844, gap = 70, x0 = Math.round((W - (sw * bufs.length + gap * (bufs.length - 1))) / 2), y0 = Math.round((H - sh) / 2);
      const mask = Buffer.from(`<svg width="${sw}" height="${sh}"><rect width="${sw}" height="${sh}" rx="22" fill="#fff"/></svg>`);
      const comps = [];
      for (let i = 0; i < bufs.length; i++) {
        const rounded = await sharp(bufs[i]).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
        const shadow = Buffer.from(`<svg width="${sw + 40}" height="${sh + 40}"><defs><filter id="f"><feGaussianBlur stdDeviation="10"/></filter></defs><rect x="20" y="26" width="${sw}" height="${sh}" rx="22" fill="rgba(15,23,42,.16)" filter="url(#f)"/></svg>`);
        comps.push({ input: shadow, left: x0 + i * (sw + gap) - 20, top: y0 - 20 }, { input: rounded, left: x0 + i * (sw + gap), top: y0 });
      }
      buf = await sharp({ create: { width: W, height: H, channels: 3, background: opt.bg || '#eef1f5' } }).composite(comps).png().toBuffer();
    }
    n++;
    const out = path.join(pngDir, `mock-${slug}-real-${n}.png`);
    await sharp(buf).png({ palette: true, quality: 92, effort: 8, colors: 256 }).toFile(out);
    console.log(out, Math.round(fs.statSync(out).size / 1024) + 'KB', name);
  }
}
await browser.close();
