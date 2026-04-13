# CI Execution Guide

## Recommended Command

Run all validation gates in CI mode:

npm run test:ci

## Expected Behavior

- Headless browser execution
- CI retries enabled through Playwright config
- HTML artifacts available under playwright-report and reports/cucumber-report.html
- Boundary guard blocks Playwright imports outside adapter layer
- Runtime config validates DRIVER_ENGINE against playwright, vibium, selenium
- Executable parity scope for this iteration remains Playwright and Vibium
