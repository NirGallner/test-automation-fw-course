# Playwright Clarivate Scaffold

Strict TypeScript automation scaffold with five explicit layers:

1. Layer 1: Gherkin scenarios in tests/layer1-gherkin
2. Layer 2: Step definitions in src/layer2-step-definitions
3. Layer 3: Business tasks in src/tasks
4. Layer 4: Page objects in src/layer4-page-objects
5. Layer 5: Tool-agnostic ports and adapters in src/layer5-abstractions

## Onboarding

1. Install dependencies: npm install
2. Install browser binaries: npx playwright install --with-deps chromium
3. Validate scaffold: npm run validate
4. Execute smoke only: npm run test:smoke

## Architecture Rules

- Layers 1-4 do not import Playwright types.
- Playwright imports are allowed only in layer 5 Playwright adapters.
- Runtime engine selection is done with DRIVER_ENGINE=playwright|vibium.
