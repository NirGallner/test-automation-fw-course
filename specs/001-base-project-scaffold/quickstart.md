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

## 3. Type-check the project

```bash
npm run typecheck
```

Expected result: TypeScript strict mode reports zero errors.

## 4. Run smoke tests

```bash
npm test
```

Expected result:
- At least one Gherkin smoke scenario executes and passes.
- Process exits with code `0`.

## 5. Verify architecture boundaries

Use a repository search to verify Playwright imports are isolated to adapter files only.

```bash
rg "from 'playwright|from \"playwright|@playwright/test" src tests
```

Expected result:
- Matches only in Layer 5 adapter files and Playwright config.

## 6. Troubleshooting

- Error: missing browser executable
  - Run `npx playwright install --with-deps chromium`
- Error: Node engine mismatch
  - Switch to Node 20+ and reinstall dependencies
- Error: strict TypeScript failure
  - Fix type violations; do not bypass strict settings
