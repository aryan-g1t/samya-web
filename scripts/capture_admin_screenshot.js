import path from 'path';
import puppeteer from 'puppeteer-core';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // 1. Visit /admin (should show Login screen)
  console.log('Navigating to https://www.samyaglobal.com/admin...');
  await page.goto('https://www.samyaglobal.com/admin', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.resolve('admin_login_screen.png') });
  console.log('Saved admin_login_screen.png');

  // 2. Perform Login via UI
  console.log('Entering credentials...');
  await page.type('#username', 'vaanigupta');
  await page.type('#password', 'aryan2802');
  await page.click('#btn-login');

  // Wait for dashboard to load
  await page.waitForSelector('#dashboard-view', { visible: true, timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: path.resolve('admin_dashboard_screen.png') });
  console.log('Saved admin_dashboard_screen.png');

  await browser.close();
  console.log('Done!');
}

capture().catch(console.error);

