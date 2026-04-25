import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const templatePath = resolve(here, 'brand-template.html')
const outDir = resolve(here, '..', 'public', 'brand')

const targets = [
  { variant: 'apple', selector: '.stage.apple', file: 'apple-touch-icon.png', width: 180, height: 180 },
  { variant: 'og', selector: '.stage.og', file: 'og-image.png', width: 1200, height: 630 },
]

async function main () {
  const browser = await chromium.launch()
  const context = await browser.newContext({ deviceScaleFactor: 2 })
  const page = await context.newPage()

  for (const target of targets) {
    await page.setViewportSize({ width: target.width, height: target.height })
    await page.goto(`file://${templatePath}`)
    await page.evaluate(variant => {
      document.body.setAttribute('data-variant', variant)
    }, target.variant)
    await page.evaluate(() => document.fonts.ready)
    const element = await page.$(target.selector)
    const out = resolve(outDir, target.file)
    await element.screenshot({ path: out, omitBackground: false })
    console.log(`wrote ${out}`)
  }

  await browser.close()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
