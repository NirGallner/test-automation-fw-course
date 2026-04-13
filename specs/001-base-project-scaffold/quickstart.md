# Quickstart: Base Project Scaffold

## Prerequisites

- Node.js 20+ installed
- npm available
- Git installed

## 1. Install dependencies

```bash
npm install
```

## 2. Install Playwright browser binaries

```bash
npx playwright install --with-deps chromium
```

## 3. Run full validation

```bash
npm run validate
```

Expected result:
- TypeScript strict mode reports zero errors.
- Unit tests pass.
- Structure and Playwright-boundary checks pass.
- One smoke scenario passes.

## 4. Run smoke tests only

```bash
npm run test:smoke
```

Expected result:
- At least one Gherkin smoke scenario executes and passes.
- Process exits with code `0`.

## 5. Run cross-driver smoke parity

```bash
npm run test:drivers
```

Expected result:
- The same layer 1-4 code executes once with `DRIVER_ENGINE=playwright` and once with `DRIVER_ENGINE=vibium`.

## 6. Verify architecture boundaries

Use a repository search to verify Playwright imports are isolated to adapter files only.

```bash
npm run check:boundary
```

Expected result:
- Matches only in Layer 5 adapter files and Playwright config.

## 7. Troubleshooting

- Error: missing browser executable
  - Run `npx playwright install --with-deps chromium`
- Error: Node engine mismatch
  - Switch to Node 20+ and reinstall dependencies
- Error: strict TypeScript failure
  - Fix type violations; do not bypass strict settings
