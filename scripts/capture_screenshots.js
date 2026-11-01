import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const DIST_DIR = path.resolve('dist');
const PORT = 3456;

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
    '.svg': 'image/svg+xml'
  };
  
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 1. Desktop Screenshot (1440px width)
    console.log('Capturing Desktop Screenshot (1440px)...');
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-revealed'));
    });
    await new Promise(r => setTimeout(r, 600));
    const desktopHeights = await page.evaluate(() => ({
      total: document.body.scrollHeight,
      header: document.querySelector('.site-header')?.offsetHeight,
      hero: document.querySelector('.hero')?.offsetHeight,
      problem: document.querySelector('.problem')?.offsetHeight,
      method: document.querySelector('.method')?.offsetHeight,
      invitation: document.querySelector('.invitation')?.offsetHeight,
      footer: document.querySelector('.site-footer')?.offsetHeight
    }));
    console.log('Desktop Heights:', desktopHeights);
    await page.screenshot({
      path: path.resolve('screenshot_desktop_current.png'),
      fullPage: true
    });
    console.log('Desktop Screenshot saved.');
    
    // 2. Mobile Screenshot (390px width)
    console.log('Capturing Mobile Screenshot (390px)...');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-revealed'));
    });
    await new Promise(r => setTimeout(r, 600));
    const mobileHeights = await page.evaluate(() => ({
      total: document.body.scrollHeight,
      header: document.querySelector('.site-header')?.offsetHeight,
      hero: document.querySelector('.hero')?.offsetHeight,
      problem: document.querySelector('.problem')?.offsetHeight,
      method: document.querySelector('.method')?.offsetHeight,
      methodDetails: {
        header: document.querySelector('.method-header')?.offsetHeight,
        grid: document.querySelector('.method-grid')?.offsetHeight,
        steps: Array.from(document.querySelectorAll('.method-step')).map(s => s.offsetHeight),
        footer: document.querySelector('.method-footer')?.offsetHeight
      },
      invitation: document.querySelector('.invitation')?.offsetHeight,
      footer: document.querySelector('.site-footer')?.offsetHeight
    }));
    console.log('Mobile Heights:', mobileHeights);
    await page.screenshot({
      path: path.resolve('screenshot_mobile_current.png'),
      fullPage: true
    });
    console.log('Mobile Screenshot saved.');
    
    await browser.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
