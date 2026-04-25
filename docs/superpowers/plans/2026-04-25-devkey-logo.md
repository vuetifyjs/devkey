# DevKey Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the DevKey logo system — inline Vue component, static SVG mark + favicon, generated raster assets — and wire it into the app shell, README, and meta tags. Replace the scaffolded placeholder branding.

**Architecture:** A single `DkLogo.vue` component is the canonical inline mark (uses `currentColor`, sized via prop). Static brand SVGs (`devkey-mark.svg`, `favicon.svg`) live in `public/brand/`. Two PNGs (`apple-touch-icon.png`, `og-image.png`) are produced by a one-shot Playwright-driven Node script (`scripts/generate-brand-assets.mjs`) that renders an HTML template with the real Geist webfont and screenshots at exact dimensions. Wordmark uses Geist 800 via the existing `unplugin-fonts` + `@fontsource/*` pipeline.

**Tech Stack:** Vue 3 + Vite + TypeScript, Vuetify0, `unplugin-fonts` (fontsource provider), Playwright (one-shot raster generation), pnpm.

**Commit conventions:** This repo follows the user's global rule that `feat`/`fix` are reserved for `packages/*` source. DevKey is a demo app, so all commits in this plan use `chore` (build/asset) or `docs` (README) types.

---

## File Structure

**Create:**
- `src/components/DkLogo.vue` — inline SVG mark component
- `public/brand/devkey-mark.svg` — standalone mark, `currentColor`
- `public/brand/favicon.svg` — favicon with `prefers-color-scheme` switching
- `public/brand/apple-touch-icon.png` — generated, 180×180
- `public/brand/og-image.png` — generated, 1200×630
- `scripts/generate-brand-assets.mjs` — Playwright-driven raster generator
- `scripts/brand-template.html` — static HTML template the generator screenshots

**Modify:**
- `package.json` — add `@fontsource/geist`, add Playwright dev dep, add `gen:brand` script
- `vite.config.mts` — register Geist 800 with `unplugin-fonts`
- `index.html` — replace favicon link, add apple-touch-icon, update og:image path
- `src/pages/LandingPage.vue` — add hero brand lockup
- `src/pages/LoginPage.vue` — add mark to login card header
- `src/pages/DashboardPage.vue` — add mark + wordmark to dashboard header
- `README.md` — add brand header

**Delete:**
- `src/assets/logo.png`
- `src/assets/logo.svg`
- `public/0.png`
- `public/og-image.png` (replaced by `public/brand/og-image.png`)

---

## Task 1: Add Geist font and create the inline mark component

**Files:**
- Modify: `package.json`
- Modify: `vite.config.mts`
- Create: `src/components/DkLogo.vue`

- [ ] **Step 1: Install Geist font**

```bash
cd ~/sites/devkey && pnpm add @fontsource/geist
```

Expected: `@fontsource/geist` added to `dependencies` in `package.json`. Lockfile updated.

- [ ] **Step 2: Register Geist 800 in vite.config.mts**

Open `vite.config.mts` and update the `Fonts` plugin call. Add a Geist family entry beside the existing Inter entry.

```ts
Fonts({
  fontsource: {
    families: [
      {
        name: 'Inter',
        weights: [100, 300, 400, 500, 700, 900],
        styles: ['normal', 'italic'],
      },
      {
        name: 'Geist',
        weights: [800],
        styles: ['normal'],
      },
    ],
  },
}),
```

- [ ] **Step 3: Create the DkLogo component**

Write `src/components/DkLogo.vue`. The mark uses `currentColor` for both stroke and fill so the parent context controls color. Size defaults to 32.

```vue
<script setup lang="ts">
  defineOptions({ name: 'DkLogo' })

  const { size = 32 } = defineProps<{
    size?: number
  }>()
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    role="img"
    aria-label="DevKey"
  >
    <rect x="6" y="18" width="28" height="28" rx="8" stroke="currentColor" stroke-width="5" fill="none"/>
    <circle cx="20" cy="32" r="3" fill="currentColor"/>
    <rect x="34" y="29.5" width="26" height="5" fill="currentColor"/>
    <rect x="46" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
    <rect x="55" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
  </svg>
</template>
```

- [ ] **Step 4: Verify the build still passes**

```bash
cd ~/sites/devkey && pnpm build
```

Expected: PASS — `vue-tsc` succeeds, vite emits `dist/` with no errors. The new component compiles even though it's not referenced anywhere yet.

- [ ] **Step 5: Commit**

```bash
cd ~/sites/devkey && git add package.json pnpm-lock.yaml vite.config.mts src/components/DkLogo.vue
git commit -m "chore(brand): add Geist font and DkLogo component"
```

---

## Task 2: Create static SVG brand assets

**Files:**
- Create: `public/brand/devkey-mark.svg`
- Create: `public/brand/favicon.svg`

- [ ] **Step 1: Create the public/brand directory**

```bash
mkdir -p ~/sites/devkey/public/brand
```

- [ ] **Step 2: Create the mark SVG**

Write `public/brand/devkey-mark.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect x="6" y="18" width="28" height="28" rx="8" stroke="currentColor" stroke-width="5" fill="none"/>
  <circle cx="20" cy="32" r="3" fill="currentColor"/>
  <rect x="34" y="29.5" width="26" height="5" fill="currentColor"/>
  <rect x="46" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
  <rect x="55" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
</svg>
```

- [ ] **Step 3: Create the favicon SVG with auto dark/light**

The favicon needs an actual color since browsers don't reliably propagate `currentColor` to favicon contexts. Use a `<style>` block with a `prefers-color-scheme` media query so the favicon adapts to OS theme.

Write `public/brand/favicon.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <style>
    .mark { color: #D18B1F; }
    @media (prefers-color-scheme: dark) {
      .mark { color: #F6B04E; }
    }
  </style>
  <g class="mark">
    <rect x="6" y="18" width="28" height="28" rx="8" stroke="currentColor" stroke-width="5" fill="none"/>
    <circle cx="20" cy="32" r="3" fill="currentColor"/>
    <rect x="34" y="29.5" width="26" height="5" fill="currentColor"/>
    <rect x="46" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
    <rect x="55" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
  </g>
</svg>
```

- [ ] **Step 4: Visually verify in a browser**

```bash
cd ~/sites/devkey && pnpm dev
```

Open `http://localhost:3000/brand/devkey-mark.svg` and `http://localhost:3000/brand/favicon.svg`. The mark.svg will appear black against white (no parent `color`) — that's correct, it's intentional for inline embedding. favicon.svg should render brass.

Stop the dev server with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
cd ~/sites/devkey && git add public/brand/devkey-mark.svg public/brand/favicon.svg
git commit -m "chore(brand): add mark and favicon SVGs"
```

---

## Task 3: Build the brand asset generation script

**Files:**
- Create: `scripts/brand-template.html`
- Create: `scripts/generate-brand-assets.mjs`
- Modify: `package.json`

The script renders an HTML template in headless Chromium (via Playwright) at the exact target dimensions, then captures a screenshot of a specific element. The wordmark uses the real Geist webfont so the raster is pixel-perfect.

The template renders both variants (apple-touch-icon and og-image) into the DOM at page load — visibility is controlled by a `data-variant` attribute on `<body>`, which the script sets via Playwright before each screenshot. This keeps everything as static HTML (no runtime DOM construction).

- [ ] **Step 1: Create the HTML render template**

Write `scripts/brand-template.html`:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@800&display=swap">
  <style>
    html, body { margin: 0; padding: 0; background: transparent; }
    body { font-family: 'Geist', system-ui, sans-serif; }

    .stage { display: none; align-items: center; justify-content: center; }
    body[data-variant="apple"] .stage.apple { display: flex; }
    body[data-variant="og"] .stage.og { display: flex; }

    .stage.apple {
      width: 180px; height: 180px;
      background: #0F1115;
      border-radius: 36px;
    }
    .stage.apple svg { width: 112px; height: 112px; color: #F6B04E; }

    .stage.og {
      width: 1200px; height: 630px;
      background: #0F1115;
      gap: 36px;
    }
    .stage.og svg { width: 160px; height: 160px; color: #F6B04E; }
    .stage.og .wm {
      font-weight: 800;
      font-size: 144px;
      letter-spacing: -0.04em;
      color: #F5F5F5;
      line-height: 1;
    }
  </style>
</head>
<body>

  <div class="stage apple">
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="6" y="18" width="28" height="28" rx="8" stroke="currentColor" stroke-width="5" fill="none"/>
      <circle cx="20" cy="32" r="3" fill="currentColor"/>
      <rect x="34" y="29.5" width="26" height="5" fill="currentColor"/>
      <rect x="46" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
      <rect x="55" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
    </svg>
  </div>

  <div class="stage og">
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="6" y="18" width="28" height="28" rx="8" stroke="currentColor" stroke-width="5" fill="none"/>
      <circle cx="20" cy="32" r="3" fill="currentColor"/>
      <rect x="34" y="29.5" width="26" height="5" fill="currentColor"/>
      <rect x="46" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
      <rect x="55" y="34.5" width="5" height="6" rx="1.5" fill="currentColor"/>
    </svg>
    <span class="wm">DevKey</span>
  </div>

</body>
</html>
```

- [ ] **Step 2: Create the generation script**

Write `scripts/generate-brand-assets.mjs`:

```js
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
```

- [ ] **Step 3: Add Playwright as a devDependency**

```bash
cd ~/sites/devkey && pnpm add -D playwright
cd ~/sites/devkey && pnpm exec playwright install chromium
```

Expected: Playwright installed; Chromium browser binaries downloaded.

- [ ] **Step 4: Add the gen:brand script to package.json**

Open `package.json`. In the `"scripts"` block, add `"gen:brand"` after `"preview"`:

```json
"scripts": {
  "dev": "vite",
  "build": "run-p type-check \"build-only {@}\" --",
  "preview": "vite preview",
  "gen:brand": "node scripts/generate-brand-assets.mjs",
  "build-only": "vite build",
  "type-check": "vue-tsc --build --force"
},
```

- [ ] **Step 5: Run the generator and verify outputs**

```bash
cd ~/sites/devkey && pnpm gen:brand
```

Expected console output:

```
wrote /home/john/sites/devkey/public/brand/apple-touch-icon.png
wrote /home/john/sites/devkey/public/brand/og-image.png
```

Then check dimensions:

```bash
file ~/sites/devkey/public/brand/apple-touch-icon.png ~/sites/devkey/public/brand/og-image.png
```

Expected: both files report PNG format. apple-touch-icon at 360×360 (2× DPR of 180×180), og-image at 2400×1260 (2× DPR of 1200×630).

- [ ] **Step 6: Visual sanity check**

Open both PNGs in an image viewer (or have the user open them):

```bash
xdg-open ~/sites/devkey/public/brand/apple-touch-icon.png &
xdg-open ~/sites/devkey/public/brand/og-image.png &
```

Confirm:
- `apple-touch-icon.png`: dark ink tile, brass mark centered, rounded corners
- `og-image.png`: dark background, brass mark on the left, "DevKey" wordmark in Geist 800 (compressed, distinctive geometry — not Inter)

If the OG image text appears in a generic system font instead of Geist, the Google Fonts request didn't load before the screenshot. Re-run; if it persists, increase wait by adding `await page.waitForTimeout(500)` after the `document.fonts.ready` promise.

- [ ] **Step 7: Commit**

```bash
cd ~/sites/devkey && git add scripts/ package.json pnpm-lock.yaml public/brand/apple-touch-icon.png public/brand/og-image.png
git commit -m "chore(brand): add asset generation script and rasters"
```

---

## Task 4: Wire favicon, apple-touch-icon, and OG image in index.html

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update favicon and add apple-touch-icon**

In `index.html`, find this line:

```html
<link rel="icon" type="image/png" href="/0.png">
```

Replace with:

```html
<link rel="icon" type="image/svg+xml" href="/brand/favicon.svg">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
```

- [ ] **Step 2: Update OG and Twitter image paths**

In `index.html`, find:

```html
<meta property="og:image" content="https://devkey.vuetifyjs.com/og-image.png">
```

Replace with:

```html
<meta property="og:image" content="https://devkey.vuetifyjs.com/brand/og-image.png">
```

Then find:

```html
<meta name="twitter:image" content="https://devkey.vuetifyjs.com/og-image.png">
```

Replace with:

```html
<meta name="twitter:image" content="https://devkey.vuetifyjs.com/brand/og-image.png">
```

- [ ] **Step 3: Verify in browser**

```bash
cd ~/sites/devkey && pnpm dev
```

Open `http://localhost:3000`. Browser tab favicon should be the brass key. In DevTools → Network, reload and confirm `/brand/favicon.svg` returns 200. (Apple-touch-icon only loads under iOS UA, so not testable here directly — just verify the link tag is present in the rendered HTML.)

Stop dev server.

- [ ] **Step 4: Commit**

```bash
cd ~/sites/devkey && git add index.html
git commit -m "chore(brand): wire favicon and og image to brand assets"
```

---

## Task 5: Place DkLogo across the app pages

**Files:**
- Modify: `src/pages/LandingPage.vue`
- Modify: `src/pages/LoginPage.vue`
- Modify: `src/pages/DashboardPage.vue`

The component goes in different visual contexts on each page. Read each page's full template before editing to find the right insertion point — class names below assume the existing BEM-style scoping (`.dk-landing__*`, `.dk-login__*`, `.dk-dashboard__*`); confirm against actual file content.

- [ ] **Step 1: Add DkLogo + wordmark to LandingPage hero**

Read `src/pages/LandingPage.vue` first to identify the hero section.

In the `<script setup>` block, add this import alongside the existing component imports:

```ts
import DkLogo from '../components/DkLogo.vue'
```

In the template's hero section, insert this lockup at the top — above the existing hero headline:

```vue
<div class="dk-landing__brand">
  <DkLogo :size="40" class="dk-landing__brand-mark" />
  <span class="dk-landing__brand-wordmark">DevKey</span>
</div>
```

Add the matching styles to the page's `<style>` block (match the scoping convention used by the rest of the file — scoped or global):

```css
.dk-landing__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}
.dk-landing__brand-mark {
  color: #F6B04E;
}
.dk-landing__brand-wordmark {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: 28px;
  letter-spacing: -0.04em;
}
```

- [ ] **Step 2: Add mark to LoginPage card header**

Read `src/pages/LoginPage.vue` first to find the existing `<h1 class="dk-login__title">Sign in to DevKey</h1>`.

In the `<script setup>` block, add:

```ts
import DkLogo from '../components/DkLogo.vue'
```

In the template, immediately inside `<DkCard class="dk-login__card">`, before the existing `<h1>`, add:

```vue
<DkLogo :size="40" class="dk-login__mark" />
```

Add to the page's `<style>` block:

```css
.dk-login__mark {
  color: #F6B04E;
  margin-bottom: 16px;
}
```

- [ ] **Step 3: Inspect DkLayout for a brand slot**

```bash
grep -n 'slot' ~/sites/devkey/src/components/DkLayout.vue
```

Note any named slots (e.g. `#brand`, `#header`). If there is a brand-style slot exposed, prefer using it in the next step; otherwise use the inline placement described below.

- [ ] **Step 4: Add mark + wordmark to DashboardPage**

Read `src/pages/DashboardPage.vue` to find the main content area. The intent is a small brand block at the top of the dashboard surface.

In the `<script setup>` block, add:

```ts
import DkLogo from '../components/DkLogo.vue'
```

In the template, at the top of the dashboard's main content area (or inside `DkLayout`'s brand slot if Step 3 found one), add:

```vue
<div class="dk-dashboard__brand">
  <DkLogo :size="28" class="dk-dashboard__brand-mark" />
  <span class="dk-dashboard__brand-text">DevKey</span>
</div>
```

Add to the page's `<style>` block:

```css
.dk-dashboard__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
.dk-dashboard__brand-mark {
  color: #F6B04E;
}
.dk-dashboard__brand-text {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.04em;
}
```

(Brass is set on the mark only — the wordmark inherits from the page's normal text color so it stays paper/ink, not brass.)

- [ ] **Step 5: Verify build and visual rendering**

```bash
cd ~/sites/devkey && pnpm build
```

Expected: PASS.

Then:

```bash
cd ~/sites/devkey && pnpm dev
```

Visit each page in the browser:
- `http://localhost:3000/` — landing — confirm brass key + "DevKey" wordmark above the hero headline
- `http://localhost:3000/login` — login — confirm brass key inside the login card, above the title
- `http://localhost:3000/dashboard` — dashboard — confirm brass key + smaller "DevKey" near the top

The wordmark should render in Geist (compressed letterforms, distinct from Inter). If it looks like Inter or a system font, double-check `unfonts.css` is imported in `src/main.ts` and Geist was actually installed.

Stop dev server.

- [ ] **Step 6: Commit**

```bash
cd ~/sites/devkey && git add src/pages/LandingPage.vue src/pages/LoginPage.vue src/pages/DashboardPage.vue
git commit -m "chore(brand): place DkLogo on landing, login, and dashboard pages"
```

---

## Task 6: Update README and remove orphan scaffold assets

**Files:**
- Modify: `README.md`
- Delete: `src/assets/logo.png`, `src/assets/logo.svg`, `public/0.png`, `public/og-image.png`

- [ ] **Step 1: Read current README**

```bash
cat ~/sites/devkey/README.md
```

Note the current top of the file so the brand header sits naturally above the existing intro.

- [ ] **Step 2: Add brand header to README**

Add this block at the very top of `README.md`, before the existing first heading:

```markdown
<p align="center">
  <img src="public/brand/devkey-mark.svg" width="80" alt="DevKey" />
</p>

<h1 align="center">DevKey</h1>

<p align="center">A Vuetify0 example project — developer API dashboard.</p>

---
```

If the existing README starts with `# DevKey` as the first H1, remove that duplicate so the centered version is the only top heading.

- [ ] **Step 3: Delete orphan scaffold assets**

```bash
cd ~/sites/devkey && git rm src/assets/logo.png src/assets/logo.svg public/0.png public/og-image.png
```

Expected: 4 files removed from the index. None are referenced in source (verified during planning).

- [ ] **Step 4: Final build verification**

```bash
cd ~/sites/devkey && pnpm build
```

Expected: PASS — no broken imports.

- [ ] **Step 5: Final visual smoke test**

```bash
cd ~/sites/devkey && pnpm dev
```

Smoke-test all three pages plus the favicon one more time. No regressions, all logos in place.

Stop dev server.

- [ ] **Step 6: Commit**

```bash
cd ~/sites/devkey && git add README.md src/assets/ public/
git commit -m "docs: add brand header to README and remove scaffold assets"
```

- [ ] **Step 7: Confirm clean working tree**

```bash
cd ~/sites/devkey && git status
```

Expected: `working tree clean`.

---

## Done

The DevKey logo system is live: an inline `DkLogo` component, two static brand SVGs, two generated PNGs, wired into the app shell, page UI, README, and meta tags. Scaffolded placeholder branding has been removed.

If at any point a step's expected output doesn't match, stop and investigate before continuing — silent drift compounds.
