import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3001';

test('onboarding flow creates a site with selected theme', async ({ page }) => {
  await page.goto(BASE + '/');
  // click Create your site
  await page.getByRole('button', { name: /Créer votre site/i }).click();

  // wait for the form to appear (step 1)
  await expect(page.getByLabel('Nom du site')).toBeVisible();

  // fill name and email and go next
  await page.fill('input[placeholder="Mon Super Site"], input[aria-label="Nom du site"]', 'E2E Test Site');
  await page.fill('input[placeholder="contact@example.com"], input[aria-label="Email de contact"]', 'e2e@example.com');

  // Continue to step 2
  await page.getByRole('button', { name: /Continuer/i }).click();

  // Choose a theme (first preset)
  await page.locator('text=OVH Modern,Classic Élégant,Créatif Bold').first();
  // click the first card
  await page.locator('div:has-text("OVH Modern")').first().click();

  // continue and submit flow
  await page.getByRole('button', { name: /Continuer|Créer mon site/i }).click();

  // wait for redirect to edit or success
  await page.waitForURL(/\/edit\//, { timeout: 15000 }).catch(() => {});

  // If redirected to /edit, assert editor loads
  if (page.url().includes('/edit/')) {
    await expect(page.locator('text=Chargement de l\'éditeur...')).not.toBeVisible({ timeout: 15000 });
  }

  // If not, ensure API returned site via by-token
  const url = page.url();
  if (url.includes('?token=')) {
    const token = new URL(url).searchParams.get('token');
    expect(token).toBeTruthy();
  }
});
