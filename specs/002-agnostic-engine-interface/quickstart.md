# Quickstart: Agnostic Automation Engine Interface Redesign

## Prerequisites

- Node.js 20+
- npm
- Existing project dependencies installed

## 1. Install dependencies

```bash
npm install
```

## 2. Validate compile and unit gates

```bash
npm run typecheck
npm run test:unit
```

Expected result:
- Strict TypeScript checks pass.
- Contract and parity unit tests pass.
- Invalid `DRIVER_ENGINE` values fail fast with explicit validation text.

## 3. Run smoke with Playwright

```bash
DRIVER_ENGINE=playwright npm run test:smoke
```

Expected result:
- Existing business scenario executes through the new `IAutomationEngine` flow.

## 4. Run smoke with Vibium

```bash
DRIVER_ENGINE=vibium npm run test:smoke
```

Expected result:
- Same Layer 1-4 business flow executes with equivalent outcome.

## 5. Run parity script (execution scope for this feature)

```bash
npm run test:drivers
```

Expected result:
- Sequential parity execution on Playwright and Vibium.
- No edits required in Gherkin or step intent mapping.

## 6. Validate deterministic invalid engine behavior

```bash
DRIVER_ENGINE=invalid npm run test:unit
```

Expected result:
- Unit tests assert fail-fast configuration validation and prevent accidental default fallback.

## 7. Verify architecture constraints

```bash
npm run check:boundary
npm run check:async-surface
npm run verify:structure
```

Expected result:
- Tool-specific imports remain isolated to Layer 5.
- Async surface guard remains compliant.
- Layered structure checks pass.

## 8. Selenium note

Selenium remains in design and contract scope for this feature but is not
executed in this quickstart flow. Unsupported or deferred Selenium-specific
operations must still follow standardized not-implemented message behavior.
