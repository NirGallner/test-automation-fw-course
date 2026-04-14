# Phase 0 Research

**Feature**: 001-project-scaffold-setup  
**Branch**: `006-scaffold-hello-world`  
**Date**: 2026-04-14

## Research Findings

---

### R-001: Cucumber.js + TypeScript + ts-node configuration

**Decision**: Use `@cucumber/cucumber` v11 with `ts-node` and a `cucumber.json` config file.

**Rationale**: `@cucumber/cucumber` v11 has first-class ESM support, but running TypeScript
source directly (no pre-compile step) is best achieved with `ts-node` via Node's
`--require ts-node/register` flag or Cucumber's `requireModule` option. The config lives
in `cucumber.json` at project root — this is JSON and will never be gitignored by the
`*.js` gitignore rule. The Cucumber profile specifies:
- `format`: `json:reports/cucumber.json` (for HTML report generation) + `progress-bar`
- `require`: `src/steps/**/*.ts` (step definitions), `src/hooks/**/*.ts`
- `requireModule`: `ts-node/register` (TypeScript execution)
- `paths`: `features/**/*.feature`

**Alternatives considered**:
- Pre-compile TypeScript to `dist/` then run JS — rejected; adds a mandatory build step
  before running tests, violating the Assumption that no separate build step is required.
- `ts-jest` — not applicable; this is Cucumber, not Jest.
- `@swc-node/register` — faster than ts-node but not installed; defer to a future
  optimisation feature.

---

### R-002: Playwright driver adapter interface

**Decision**: Define three interfaces — `IBrowser`, `IPage`, `IElement` — in
`src/drivers/interfaces.ts`. `PlaywrightAdapter` implements `IBrowser` and wraps
Playwright's `chromium`, `Browser`, `Page` types. For the hello world scaffold the
adapter is instantiated but never calls `browser.launch()`.

**Rationale**: Constitution Principle II mandates tool-agnostic abstractions. The
interface layer is the contract; the adapter is the only file that imports from
`@playwright/test`. Step definitions, flows, and page objects import only the
interfaces, never the Playwright types directly.

**Alternatives considered**:
- Single monolithic `IDriver` interface — rejected; violates Interface Segregation
  (SOLID IV). Separate `IBrowser`, `IPage`, `IElement` interfaces allow mocking at
  the correct granularity in unit tests.

---

### R-003: pino structured logging setup

**Status**: `pino` is **not yet installed** in `node_modules`. It must be added to
`package.json` dependencies and installed.

**Decision**: Add `pino` and `pino-pretty` as production dependencies. Create a singleton
logger in `src/utils/logger.ts` that:
- Exports one `Logger` instance via `export const logger`.
- Uses `pino-pretty` transport only when `NODE_ENV !== 'ci'` (detected via `process.env.CI`).
- All other source files import this singleton — never instantiate pino directly.

**Rationale**: Constitution Principle VIII mandates pino. Singleton pattern ensures a
single root logger with consistent name and level across all layers. Pretty-printing
only in local dev keeps CI logs as structured JSON for aggregation platforms.

**Alternatives considered**:
- `winston` — rejected; not the mandated library.
- `console.log` — explicitly prohibited by Constitution VIII.

---

### R-004: cucumber-html-reporter integration

**Status**: `cucumber-html-reporter` package checked — not in `node_modules`. The
`reports/cucumber-report.html` evidences prior use. Must be added to `package.json`.

**Decision**: Run `cucumber-html-reporter` in an `AfterAll` Cucumber hook
(`src/hooks/report.hook.ts`). The hook reads `reports/cucumber.json` (Cucumber's JSON
formatter output) and writes `reports/cucumber-report.html`. Both files are gitignored
(generated output); the `reports/` directory is tracked with a `.gitkeep`.

**Alternatives considered**:
- Allure report — permitted by constitution stack but adds additional tooling; defer
  to a future feature.
- `@cucumber/html-formatter` (built-in) — already bundled with `@cucumber/cucumber` v11;
  this is the preferred option. **Revised decision**: Use the built-in
  `@cucumber/html-formatter` via Cucumber's `--format html:reports/cucumber-report.html`
  option in `cucumber.json`. This eliminates the `cucumber-html-reporter` dependency.
  Simpler, no extra hook required.

---

### R-005: Package.json dependency list

**Decision**: Reconstruct `package.json` with the following:

**Runtime dependencies**:
```
pino          (not installed — must add)
pino-pretty   (not installed — must add)
```

**Dev dependencies** (already in node_modules or to be added):
```
@cucumber/cucumber    ^11.3.0  (installed: 11.3.0)
@playwright/test      ^1.59.1  (installed: 1.59.1)
typescript            ^5.9.3   (installed: 5.9.3)
ts-node               ^10.9.2  (installed: 10.9.2)
chai                  ^5.3.3   (installed: 5.3.3)
@types/chai           ^5.x     (installed: 5.x via /types/chai)
@types/node           ^24.x    (installed: 24.x)
vitest                ^3.2.4   (installed: 3.2.4)
```

**Scripts**:
```json
"test": "cucumber-js",
"test:report": "cucumber-js --format html:reports/cucumber-report.html",
"lint": "eslint src --ext .ts",
"typecheck": "tsc --noEmit"
```

---

### R-006: TypeScript configuration

**Decision**: `tsconfig.json` with strict mode, ESNext target, CommonJS modules (for
ts-node compatibility without ESM flag), source root `src/`.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "dist",
    "rootDir": ".",
    "skipLibCheck": true
  },
  "include": ["src/**/*", "features/**/*"]
}
```

**Rationale**: CommonJS is used over ESM to allow `ts-node/register` without additional
`--esm` flags, keeping the Cucumber config simpler. ESM migration can be a dedicated
future feature.

**Alternatives considered**:
- ESM with `ts-node-esm` — works but requires Cucumber 11's ESM-first config path and
  `--experimental-vm-modules` flag in some Node versions; deferred to future feature.

---

### R-007: .gitignore gaps

**Decision**: The existing `.gitignore` needs two corrections relevant to this spec:
1. The bare `*.js` rule is replaced with `dist/**/*.js` to avoid ignoring config files.
2. `reports/` is changed from ignore-directory to ignore-contents: `reports/*.html`,
   `reports/*.json` — the directory is tracked via `reports/.gitkeep`.

All other existing rules are correct and preserved.

---

## Resolved Unknowns

| Unknown | Resolution |
|---------|------------|
| Performance goals per feature | N/A for scaffold — no browser launch; suite runs in <5s |
| Scale/scope | 1 scenario, 4 source layers, 1 Playwright adapter |
| pino installed? | No — must install; added to package.json dependencies |
| cucumber-html-reporter | Replaced by built-in `@cucumber/html-formatter` (no extra dep) |
| ESLint config | Deferred from hello world scope — constitution compliance requires it eventually; `typecheck` script covers FR-010 for now |
| TypeScript module system | CommonJS for ts-node simplicity; ESM deferred |
