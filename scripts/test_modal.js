import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const DIST_DIR = path.resolve('dist');
const PORT = 3457;

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(DIST_DIR, reqPath);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950 });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
    
    // Click open modal
    await page.click('[data-open-modal]');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.resolve('modal_screen_1.png') });
    console.log('Saved modal_screen_1.png');

    // Go to screen 6 (Tone Picker)
    await page.evaluate(() => {
      const s = document.querySelectorAll('.survey-screen');
      s.forEach(el => { el.hidden = true; el.classList.remove('active'); });
      const s6 = document.querySelector('[data-screen="6"]');
      if (s6) { s6.hidden = false; s6.classList.add('active'); }
    });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.resolve('modal_screen_6.png') });
    console.log('Saved modal_screen_6.png');

    // Go to screen 10 (Milestone)
    await page.evaluate(() => {
      const s = document.querySelectorAll('.survey-screen');
      s.forEach(el => { el.hidden = true; el.classList.remove('active'); });
      const s10 = document.querySelector('[data-screen="10"]');
      if (s10) { s10.hidden = false; s10.classList.add('active'); }
      document.querySelector('.dialog-wrapper')?.classList.add('is-wine');
    });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.resolve('modal_screen_10.png') });
    console.log('Saved modal_screen_10.png');

    await browser.close();
  } catch (err) {
    console.error(err);
  } finally {
    server.close();
  }
});

