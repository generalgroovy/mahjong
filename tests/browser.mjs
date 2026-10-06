// Portable CI regression. Local interactive inspection uses the approved browser tool.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve('.');
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + '/')) { response.writeHead(403).end(); return; }
  try {
    response.setHeader('Content-Type', ({'.html':'text/html','.css':'text/css','.js':'text/javascript'})[extname(file)] || 'application/octet-stream');
    response.end(await readFile(file));
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch();
const results = [];
await mkdir('test-results', { recursive: true });
try {
  for (const width of [1366, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: width > 1000 ? 768 : 844 }, reducedMotion:'reduce' });
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.locator('.hero .practice-link').click();
    assert.equal(await page.locator('#sequenceCheck').isDisabled(), true);
    await page.locator('#sequenceOptions button[data-rank="3"]').focus();
    await page.keyboard.press('Space');
    await page.locator('#sequenceOptions button[data-rank="6"]').focus();
    await page.keyboard.press('Space');
    await page.locator('#sequenceCheck').click();
    await page.getByText('Every tile found', { exact: true }).waitFor();
    assert.match(await page.locator('#sequenceFeedback').innerText(), /Answer: 3m, 6m · 8 unseen copies/);
    assert.equal(await page.locator('#sequenceScore').innerText(), '1 / 1 correct on first try');
    assert.equal(await page.locator('#sequenceNext').evaluate(el => el === document.activeElement), true);
    await page.getByText('Change the exercise', { exact: true }).click();
    await page.locator('#sequenceCustom').fill('34567');
    await page.getByRole('button', { name: 'Use shape', exact: true }).click();
    for (const rank of [2, 5]) await page.locator(`#sequenceOptions button[data-rank="${rank}"]`).click();
    await page.locator('#sequenceCheck').click();
    assert.match(await page.locator('#sequenceFeedback').innerText(), /Answer: 2m, 5m, 8m · 11 unseen copies/);
    assert.match(await page.locator('#sequenceFeedback').innerText(), /234m \+ 567m/);
    await page.locator('#sequenceRetry').click();
    for (const rank of [2, 5, 8]) await page.locator(`#sequenceOptions button[data-rank="${rank}"]`).click();
    await page.locator('#sequenceCheck').click();
    assert.equal(await page.locator('#sequenceScore').innerText(), '1 / 2 correct on first try');
    const previous = await page.locator('#sequenceHand').innerText();
    await page.locator('#sequenceCustom').fill('11111234');
    await page.getByRole('button', { name: 'Use shape', exact: true }).click();
    assert.match(await page.locator('#sequenceCustomError').innerText(), /only four copies/);
    assert.equal(await page.locator('#sequenceHand').innerText(), previous);
    await page.locator('#sequenceLevel').selectOption('3');
    await page.locator('#sequenceVisible').check();
    assert.equal(await page.locator('#sequenceHand .tile').count(), 8);
    const counts = Array(9).fill(0);
    for (const text of await page.locator('#sequenceHand .tile').allTextContents()) counts[Number(text[0]) - 1]++;
    const seen = await page.locator('#sequenceOptions small').allTextContents();
    seen.forEach((text, i) => assert.ok(counts[i] + Number(text.split(' ')[0]) <= 4));
    await page.locator('#sequenceReveal').click();
    assert.equal(await page.locator('#sequenceScore').innerText(), '1 / 3 correct on first try');
    await page.locator('#sequenceSuit').selectOption('p');
    assert.ok((await page.locator('#sequenceHand .tile').allTextContents()).every(t => t.endsWith('p')));
    await page.locator('#sequenceCustom').fill('11');
    await page.getByRole('button', { name: 'Use shape', exact: true }).click();
    await page.locator('#sequenceNone').click();
    await page.locator('#sequenceCheck').click();
    assert.match(await page.locator('#sequenceFeedback').innerText(), /No single tile/);
    assert.equal(await page.locator('#sequenceScore').innerText(), '2 / 4 correct on first try');
    await page.locator('#sequenceCustom').fill('34567');
    await page.getByRole('button', { name: 'Use shape', exact: true }).click();
    for (const rank of [2, 5, 8]) await page.locator(`#sequenceOptions button[data-rank="${rank}"]`).click();
    await page.locator('#sequenceCheck').click();
    await page.getByText('Change the exercise', { exact: true }).click();
    await page.locator('#sequenceTitle').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/sequence-${width}.png`, fullPage: false });
    await page.locator('[data-tab="waits"]').click();
    await page.locator('#practiceTable').click();
    assert.equal(await page.locator('#scenarioDrills').getAttribute('open'), '');
    assert.match(await page.locator('#challengeProgress').innerText(), /Read the wait/i);
    await page.locator('#challengeOptions button').filter({ hasText: /^3m or 6m$/ }).click();
    assert.match(await page.locator('#challengeFeedback').innerText(), /ryanmen/);
    await page.locator('#liveTiles').fill('4'); await page.locator('#outs').fill('1'); await page.locator('#draws').fill('2');
    await page.locator('#calcUkeire').click();
    assert.equal(await page.locator('#ukeireResult').innerText(), '50.0%');
    const labels = await page.locator('#ukeireBars .bar-row > span:first-child').allTextContents();
    assert.deepEqual(labels, ['1 draws', '2 draws', '4 draws']);
    const metrics = await page.evaluate(() => ({width:innerWidth, scroll:document.documentElement.scrollWidth}));
    assert.ok(metrics.scroll <= metrics.width, JSON.stringify(metrics));
    assert.deepEqual(errors, []);
    results.push({ width, passed:true, errors, metrics });
    await context.close();
  }
  await writeFile('test-results/results.json', JSON.stringify(results, null, 2));
} finally { await browser.close(); server.close(); }
