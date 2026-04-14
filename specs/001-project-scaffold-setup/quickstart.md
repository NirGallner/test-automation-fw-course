# Developer Quickstart

**Feature**: 001-project-scaffold-setup  
**Branch**: `006-scaffold-hello-world`  
**Date**: 2026-04-14

## Prerequisites

- Node.js LTS (v20+) installed
- Git installed
- No other setup required — the scaffold is self-contained

## First-time Setup

```bash
# 1. Clone and enter the project
git clone <repo-url>
cd playwright-clarivate

# 2. Install dependencies (includes pino, pino-pretty and all existing packages)
npm install

# 3. Run the hello world test
npm test
```

Expected output (local dev with pino-pretty):

```
3 steps (3 passed)
```

> The HTML report is written to `reports/cucumber-report.html` automatically when you
> run `npm run test:report`.

## Project Structure

```
playwright-clarivate/
├── features/                     # Layer 4 — Gherkin feature files
│   └── hello-world.feature       # Hello world BDD scenario
├── src/
│   ├── drivers/                  # Layer 0 — Driver adapters + interfaces
│   │   ├── interfaces.ts         # IBrowser, IPage, IElement
│   │   └── playwright.adapter.ts # Playwright implementation of IBrowser
│   ├── pages/                    # Layer 1 — Page Object Model
│   │   └── hello-world.page.ts
│   ├── flows/                    # Layer 2 — Business flows
│   │   └── hello-world.flow.ts
│   ├── steps/                    # Layer 3 — Cucumber step definitions
│   │   └── hello-world.steps.ts
│   ├── hooks/                    # Layer 3 — Cucumber before/after hooks
│   │   └── index.ts
│   ├── api/                      # API clients (empty scaffold dir)
│   └── utils/
│       └── logger.ts             # Shared pino logger — import here, never console.log
├── reports/                      # Generated test reports (gitignored contents)
├── cucumber.json                 # Cucumber runner configuration
├── tsconfig.json                 # TypeScript strict mode config
└── package.json                  # npm scripts and dependencies
```

## Adding a New Feature

**Follow this order strictly (constitution outside-in BDD):**

1. Write the `.feature` file in `features/`
2. Write step definition class in `src/steps/`
3. Write business flow class in `src/flows/`
4. Write page object class in `src/pages/`
5. Add driver interactions to `src/drivers/` if new elements are needed

**Cross-layer import rule** (violation = PR blocked):
- Step definitions (`src/steps/`) import only from `src/flows/`
- Business flows (`src/flows/`) import only from `src/pages/`
- Page objects (`src/pages/`) import only from `src/drivers/` interfaces and `src/utils/`
- Driver adapters (`src/drivers/`) are the only files that import from `@playwright/test`

## Logging

Import the shared logger in any source file:

```typescript
import { logger } from '../utils/logger';

// Use structured logging — never console.log
logger.info({ layer: 'page', class: 'MyPage' }, 'Navigating to home page');
logger.debug({ step: 'click' }, 'Clicking submit button');
logger.error({ error: err }, 'Driver action failed');
```

Log levels: `trace` → `debug` → `info` → `warn` → `error`

## npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm test` | `cucumber-js` | Run all scenarios; terminal progress output |
| `npm run test:report` | `cucumber-js --format html:...` | Run and generate HTML report |
| `npm run typecheck` | `tsc --noEmit` | Verify TypeScript compiles without errors |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Cannot find module 'pino'` | Run `npm install` |
| `SyntaxError: Unexpected token` | Check your TypeScript — ts-node/register not picking up ts files? Verify `requireModule` in `cucumber.json` |
| `Multiple step definition matches` | You have a duplicate step binding — check `src/steps/` for regex collisions |
| HTML report not generated | Run `npm run test:report` (not `npm test`) |
