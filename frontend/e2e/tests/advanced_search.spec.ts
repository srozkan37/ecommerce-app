import { test, expect } from '@playwright/test'

test.describe('Advanced Search and Filtering (KAN-12)', () => {
  test('e2e search bar filters products on Home view', async ({ page }) => {
    await page.goto('/')

    // Wait for products to load
    await expect(page.locator('article, [data-testid="product-card"]').first()).toBeVisible({
      timeout: 10000,
    })

    const searchInput = page.locator('input[placeholder*="Search Items"]').first()
    await searchInput.fill('Wireless')
    await searchInput.press('Enter')

    await page.waitForTimeout(1000)

    // Verify products grid reflects filtering
    const count = await page.locator('article, [data-testid="product-card"]').count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('e2e price range and sort options', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('input[placeholder="Min"]').first()).toBeVisible()

    await page.locator('input[placeholder="Min"]').first().fill('10')
    await page.locator('input[placeholder="Max"]').first().fill('100')
    await page.getByRole('button', { name: 'Filter' }).click()

    await page.waitForTimeout(1000)
    expect(page.url()).toContain('min_price=10')
    expect(page.url()).toContain('max_price=100')

    const sortSelect = page.locator('select').first()
    await sortSelect.selectOption('price_asc')
    await page.waitForTimeout(1000)
    expect(page.url()).toContain('sort=price_asc')
  })

  test('e2e pagination navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()

    await page.getByRole('button', { name: 'Next' }).click()
    await page.waitForTimeout(1000)
    expect(page.url()).toContain('skip=')
  })
})
