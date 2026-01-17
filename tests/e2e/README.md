# End-to-End Tests

Playwright-based E2E tests for visual and functional testing across different browsers and devices.

## Setup

Browsers are installed automatically when you run tests for the first time. To manually install:

```bash
npx playwright install webkit
```

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run only webkit (Desktop Safari) tests
npm run test:e2e:webkit

# Run mobile Safari tests
npm run test:e2e:mobile

# Run with UI mode (interactive)
npm run test:e2e:ui
```

## Test Files

### `architecture-gradient.spec.ts`

Tests for the architecture page gradient rendering, specifically:

- **Gradient coverage**: Ensures the green glow in `.info-box-featured` extends fully without cutoff
- **Footer background**: Verifies footer doesn't have unwanted gradient
- **Image overflow**: Checks that diagram images don't cause horizontal scrolling

**Why webkit-specific?**
Webkit browsers (Safari, iOS Safari) have different rendering behavior for:

- Background gradients with `background-attachment`
- Pseudo-elements with percentage-based positioning
- Overflow handling on mobile viewports

## Visual Regression

Screenshots are saved to `test-results/` for manual verification. Review these when:

- Making CSS changes to gradients or layouts
- Testing on actual iOS devices vs webkit emulation
- Debugging webkit-specific rendering issues

## Configuration

See `playwright.config.ts` for:

- Browser configurations (Desktop Safari, iPhone 13)
- Base URL and server settings
- Screenshot and trace settings
