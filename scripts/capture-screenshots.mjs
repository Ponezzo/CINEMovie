import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const outDir = 'docs/screenshots'
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const base = 'http://127.0.0.1:5173'

async function waitAppReady() {
  await page.waitForSelector('.navbar', { timeout: 30000 })
  const hasError = await page.locator('text=Failed to resolve import').count()
  if (hasError) throw new Error('Vite error overlay detected — restart vue dev server from vue/')
  await page.waitForTimeout(1500)
}

async function shot(name) {
  await page.screenshot({ path: `${outDir}/${name}.png` })
  console.log('saved', name)
}

// 홈
await page.goto(`${base}/`, { waitUntil: 'networkidle', timeout: 60000 })
await waitAppReady()
await shot('home')

// 로그인 페이지
await page.goto(`${base}/login`, { waitUntil: 'networkidle' })
await waitAppReady()
await shot('login')

// 회원가입 후 로그인 (테스트 계정)
const user = `readme_${Date.now()}`
await page.goto(`${base}/signup`, { waitUntil: 'networkidle' })
await waitAppReady()
await page.fill('#username', user)
await page.fill('#password1', 'ReadmeTest123!')
await page.fill('#password2', 'ReadmeTest123!')
await page.click('button.signup-btn')
await page.waitForURL('**/')
await waitAppReady()
await shot('main-logged-in')

// 검색
await page.goto(`${base}/search`, { waitUntil: 'networkidle' })
await waitAppReady()
await shot('search')

// 프로필
await page.goto(`${base}/profile`, { waitUntil: 'networkidle' })
await waitAppReady()
await shot('profile')

// 커뮤니티
await page.goto(`${base}/community`, { waitUntil: 'networkidle' })
await waitAppReady()
await shot('community')

await browser.close()

import { copyFileSync } from 'fs'
const rootFiles = ['home', 'login', 'search', 'profile', 'community', 'main-logged-in']
for (const name of rootFiles) {
  copyFileSync(`${outDir}/${name}.png`, `${name}.png`)
}
copyFileSync(`${outDir}/demo.gif`, 'demo.gif')
copyFileSync(`${outDir}/erd.png`, 'image.png')
console.log('copied to repo root')
console.log('done')
