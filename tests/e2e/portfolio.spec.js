const { test, expect } = require('@playwright/test');
const { timeout } = require('../../playwright.config');

test.describe('Portfolio Website E2E Tests', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should load homepage correctly', async ({ page }) => {
        // Check main navigation exists
        await expect(page.locator('nav')).toBeVisible();

        // Check theme toggle button exists  
        await expect(page.locator('#theme-button')).toBeVisible();
    });
});

test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Should Navigate between sections smoothly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        await expect(page.locator('[data-section="about"]')).toBeVisible();
        await expect(page.locator('[data-section="projects"]')).toBeVisible();
        await expect(page.locator('[data-section="contact"]')).toBeVisible();

        //Test Navigation Links
        await page.click('[data-section="about"]');
        await expect(page.locator('#about')).toBeInViewport();

        await page.click('[data-section="projects"]');
        await expect(page.locator('#projects')).toBeInViewport();

        await page.click('[data-section="contact"]');
        await expect(page.locator('#contact')).toBeInViewport();
    });

    test('Should highlight active navigation item', async ({ page }) => {
        await page.click('[data-section="projects"]');
        await expect(page.locator('[data-section="projects"]')).toHaveClass(/active/);
    });

    test('Should work on mobile devices', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(100);

        //Mobile menu should be hidden initially
        const navMenu = page.locator('#nav-menu');
        await expect(navMenu).not.toHaveClass(/active/);

        //Wait for Nav Toggle to be visible and clickable
        const navToggle = page.locator('#nav-toggle');
        const isHidden = await navToggle.isHidden();

        if (isHidden) {
            test.skip('Mobile navigation not implemented for 375px width');
            return;
        }

        await expect(navToggle).toBeVisible();

        //Open Mobile Menu
        await navToggle.click();
        await expect(navMenu).toHaveClass(/active/);

        //Navigate and Menu should close
        await page.click('[data-section="about"]');
        await expect(navMenu).not.toHaveClass(/active/)
    });
});

test.describe('Theme functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Should toggle between light and dark themes', async ({ page }) => {
        //Check initial theme
        const html = page.locator('html');
        const initialTheme = await html.getAttribute('data-theme');

        //Toggle theme
        await page.click('#theme-button');
        const newTheme = await html.getAttribute('data-theme');

        expect(newTheme).not.toBe(initialTheme);

        //Verify button icon changes
        const buttonText = await page.locator('#theme-button').textContent();
        expect(['🌙', '☀️']).toContain(buttonText);
    });

    test('Should persist theme preference', async ({ page }) => {
        await page.click('#theme-button');
        const theme = await page.locator('html').getAttribute('data-theme');

        //Reload Page
        await page.reload();

        //Theme should persist
        const persistedTheme = await page.locator('html').getAttribute('data-theme');
        expect(persistedTheme).toBe(theme);
    });
});

test.describe('Contact Form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Should validate form inputs', async ({ page }) => {
        //Navigate to contact section 
        await page.click('[data-section="contact"]');
        await expect(page.locator('#contact')).toBeInViewport();

        const form = page.locator('#contact-form');

        const submitButton = page.locator('button[type="submit"]');
        await submitButton.click();

        // Check if any required field shows validation message
        const invalidFields = page.locator('input:invalid, textarea:invalid');
        expect(await invalidFields.count()).toBeGreaterThan(0);

        //Submit empty form
        await form.locator('button[type="submit"]').click();

        //Check for validation errors
        await expect(page.locator('.error-message')).toBeVisible();
    });

    test('Should submit valid form succesfully', async ({ page }) => {
        //Fil form with valid data
        await page.fill('input[name="name"]', 'John Doe');
        await page.fill('input[name="email"]', 'john@example.com');
        await page.fill('textarea[name="message"]', 'This is a test message from the E2E tests.');

        //Submit form
        await page.click('button[type="submit"]');

        //Check for success message
        await expect(page.locator('#form-status')).toContainText('sent successfully');
    });

    test('Should show real-time validation', async ({ page }) => {
        const emailInput = page.locator('input[name="email"]');

        //Enter invalid email
        await emailInput.fill('invalid-email');
        await emailInput.blur();

        //check for validation styling
        await expect(emailInput).toHaveClass(/invalid/);

        //Fix email
        await emailInput.fill('valid@email.com');
        await emailInput.blur();

        //Check for validation styling
        await expect(emailInput).toHaveClass(/valid/);
    });
});

test.describe('Project Filtering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Should filter projects by technology', async ({ page }) => {
        //Assume filter buttons
        const filterButtons = page.locator('.filter-btn');
        const projectCards = page.locator('.project-card');

        if (await filterButtons.count() > 0) {
            //Click on a filter
            await filterButtons.first().click();

            //Wait for animation
            await page.waitForTimeout(500);

            //Check that some projects are hidden
            const hiddenCards = page.locator('.project-card.hidden');
            const visibleCards = projectCards.locator(':not(.hidden)');

            expect(await hiddenCards.count()).toBeGreaterThan(0);
            expect(await visibleCards.count()).toBeGreaterThan(0);
        }
    });
});

test.describe('Performance', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Should load quickly', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        //Should load in under 3 seconds
        expect(loadTime).toBeLessThan(3000)
    });

    test('Should be responsive', async ({ page }) => {
        //Test different viewport sizes
        const viewports = [
            { width: 320, height: 568 }, //Mobile
            { width: 768, height: 1024 }, //Tablet
            { width: 1920, height: 1080 }, //Mobile
        ];

        for (const viewport of viewports) {
            await page.setViewportSize(viewport);
            await page.reload();

            //Check that layout doesn't break
            const body = page.locator('body');
            const bodyWidth = await body.evaluate(el => el.scrollWidth);
            expect(bodyWidth).toBeLessThanOrEqual(viewport.width)
        }
    });
});

test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Should have proper keyboard navigation', async ({ page }) => {
        //test tab navigation
        await page.keyboard.press('Tab');

        //First focusable element should be focused
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();

        //Continue tabbing through interactive elements
        for (let i; i < 5, i++;) {
            await page.keyboard.press('Tab');
            const currentFocus = page.locator(':focus')
            await expect(currentFocus).toBeVisible();
        }
    });

    test('Should have proper ARIA attributes', async ({ page }) => {
        //Check for proper navigation structures
        const nav = page.locator('nav[role="navigation"]');
        if (await nav.count() > 0) {
            await expect(nav).toBeVisible();
        }

        //Check for proper headings hierarchy
        const h1 = page.locator('h1');
        expect(await h1.count()).toBe(1)
    });
});

test.describe('Visual Regression', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Should match visual snapshots', async ({ page }) => {
        //Disable animations for stable screenshots
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        await page.addStyleTag({
            content: `
                *,*::before, *::after {
                    animation-duration: 0s !important;
                    animation-delay: 0s !important;
                    transition-duration: 0s !important;
                    transition-delay: 0s !important;
                    transform: none !important;
                }
            `
        });

        await page.waitForFunction(() => {
            const statNumbers = document.querySelectorAll('.stat-number');
            return Array.from(statNumbers).every(el => {
                const target = el.getAttribute('data-target');
                return el.textContent === target;
            });
        }, {timeout: 10000});

        await page.waitForTimeout(2000);

        //Take full page screenshot
        await expect(page).toHaveScreenshot('homepage-full.png', {
            animations: 'disabled',
            threshold: 0.3,
            maxDiffPixels: 1000
        });

        //Test Mobile View
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page).toHaveScreenshot('homepage-mobile.png', {
            threshold: 0.3
        });

        //Test dark theme
        await page.click('#theme-button');
        await expect(page).toHaveScreenshot('homepage-dark.png', {
            threshold:0.3
        });
    });
});