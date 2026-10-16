const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
(async () => {
  const [html, out] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto(pathToFileURL(html).href, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
  await p.waitForTimeout(500);
  console.log('fuentes:', await p.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + f.weight).join(', ')));
  await p.emulateMedia({ media: 'print' });
  await p.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width:100%;font:8px Inter,Arial,sans-serif;color:#8a8f99;padding:0 17mm;display:flex;justify-content:space-between"><span>SMC · Manual del panel</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>' });
  await b.close();
  const n = (require('fs').readFileSync(out, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log('páginas:', n);
})();
