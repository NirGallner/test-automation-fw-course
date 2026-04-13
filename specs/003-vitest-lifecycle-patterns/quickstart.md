# Quickstart: Vitest Lifecycle Patterns

## Prerequisites

- Node.js 20+
- npm
- Project dependencies installed

## 1. Install dependencies

```bash
npm install
```

## 2. Run type checks

```bash
npm run typecheck
```

Expected result:
- TypeScript strict checks pass with no `any` introduced by lifecycle demo assets.

## 3. Run baseline smoke lifecycle flow

```bash
npm run test:smoke
```

Expected result:
- Console output contains lifecycle labels for `BeforeAll`, `Before`, `After`, and `AfterAll`.
- Tagged fixture scenario emits `globalServer Start` and `testDatabase Start/End` labels.
- Non-tagged scenario emits no fixture labels.

## 4. Verify driver parity with fixture lifecycle

```bash
npm run test:driver:playwright
npm run test:driver:vibium
```

Expected result:
- Fixture lifecycle labels appear with the same ordering semantics on both engines.
- Fixture opt-in remains scenario-driven and does not leak into non-tagged scenarios.

## 5. Optional full repository guards

```bash
npm run verify:structure
npm run check:async-surface
npm run check:boundary
```

Expected result:
- Layered boundaries remain intact.
- Async surface constraints remain compliant.
- No Playwright boundary regressions appear in Layers 1-4.

## 6. Confirm teardown evidence on failures

```bash
SMOKE_URL=https://example.com npm run test:smoke
```

Expected result:
- `After` labels are emitted for every scenario.
- Fixture teardown labels (`testDatabase End`, worker fixture final `globalServer End`) remain observable during runtime cleanup.
