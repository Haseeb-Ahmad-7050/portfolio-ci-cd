
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('production build contains the portfolio HTML', async () => {
  const html = await readFile(
    new URL('../dist/index.html', import.meta.url),
    'utf8'
  )

  assert.ok(html.includes('<div id="root">') || html.includes('id="root"'))
  assert.ok(html.includes('/intentionally-wrong-path/'))
})

test('production build contains JavaScript and CSS assets', async () => {
  const html = await readFile(
    new URL('../dist/index.html', import.meta.url),
    'utf8'
  )

  assert.match(html, /assets\/.*\.js/)
  assert.match(html, /assets\/.*\.css/)
})
