import { test, expect } from '@playwright/test';

test.describe('Architecture Page - Gradient Rendering', () => {
  test('info-box-featured should have full-width gradient without cutoff on webkit', async ({
    page,
    browserName,
  }, testInfo) => {
    await page.goto('/architecture');

    // Find the "Why Architecture as Code?" info box
    const infoBox = page.locator('.info-box-featured').first();
    await expect(infoBox).toBeVisible();

    // Take a screenshot for visual verification (saved per project)
    await page.screenshot({
      path: `test-results/architecture-gradient-${testInfo.project.name.replace(/\s+/g, '-')}.png`,
      fullPage: true,
    });

    // Check that the box has the ::before pseudo-element with proper styles
    const hasGradient = await infoBox.evaluate((el) => {
      const styles = window.getComputedStyle(el, '::before');
      const background = styles.background || styles.backgroundImage;
      return background.includes('radial-gradient');
    });

    expect(hasGradient).toBe(true);

    // Verify no horizontal scrollbar on the page
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test('footer should not have gradient background', async ({ page }) => {
    await page.goto('/architecture');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check that footer doesn't have page-surface class
    const hasPageSurface = await footer.evaluate((el) => {
      return el.classList.contains('page-surface');
    });

    expect(hasPageSurface).toBe(false);

    // Verify footer background is solid (no gradient)
    const backgroundImage = await footer.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundImage;
    });

    expect(backgroundImage).toBe('none');
  });

  test('diagram images should not cause horizontal overflow', async ({ page }) => {
    await page.goto('/architecture');

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    // Check all images in info-box-featured containers
    const images = page.locator('.info-box-featured img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();

      // Verify image doesn't overflow its container
      const overflows = await img.evaluate((el) => {
        const parent = el.closest('.info-box-featured');
        if (!parent) return false;

        const parentRect = parent.getBoundingClientRect();
        const imgRect = el.getBoundingClientRect();

        return imgRect.right > parentRect.right + 1; // Allow 1px tolerance
      });

      expect(overflows).toBe(false);
    }
  });
});
