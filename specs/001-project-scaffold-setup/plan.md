# Implementation Plan: Project Scaffold Setup

**Branch**: `006-scaffold-hello-world` | **Date**: 2026-04-14 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-project-scaffold-setup/spec.md`

## Summary

Bootstrap the project from zero: create `package.json`, install all dependencies
(including `pino` which is not yet installed), scaffold all mandatory architectural
directories, and wire a hello world scenario through all four layers (feature →
step definition → business flow → page object → logger) so a single `npm test`
produces a passing Cucumber result with a structured log entry.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode, CommonJS for ts-node compatibility)  
**Primary Dependencies**: `@cucumber/cucumber` v11, `pino` + `pino-pretty`, `@playwright/test` v1.59, `ts-node` v10, `typescript` v5  
**Storage**: None (test automation framework — no persistent data store)  
**Testing**: Cucumber.js (BDD scenarios); Vitest (unit tests per layer — future); Chai (assertions)  
**Target Platform**: Node.js v24 (local); CI-compatible (any platform with Node LTS)  
**Project Type**: Test automation framework scaffold  
**Performance Goals**: Hello world suite executes in under 5 seconds (no browser launch)  
**Constraints**: No cross-layer imports; no hardcoded browser names; pino-only logging; all TypeScript strict-mode compliant  
**Scale/Scope**: 1 Gherkin scenario, 4 source layers, 1 Playwright driver adapter, 1 logger utility

## Constitution Check

*Pre-design gate: all items verified. Post-design re-check: ✓ all still pass.*

- [x] **I. TypeScript & OOP** — All new classes use strict TypeScript; `IBrowser`, `IPage`, `IElement`, `PlaywrightAdapter`, `HelloWorldPage`, `HelloWorldFlow`, `HelloWorldSteps` are all proper classes; no `any`, no bare module-scope functions
- [x] **II. Tool-Agnostic Core** — `PlaywrightAdapter` is the only file importing from `@playwright/test`; all other layers depend only on `IBrowser`/`IPage`/`IElement` interfaces defined in `src/drivers/interfaces.ts`
- [x] **III. Cucumber BDD (preferred)** — Feature file authored first (Gherkin); step definitions reference only business flow methods; no raw driver calls in step definitions
- [x] **IV. SOLID** — Each class has a single responsibility; all dependencies injected via constructor (no `new` inside classes except the driver factory); no concrete-to-concrete coupling above driver layer
- [x] **V. Layered Architecture** — Dependency flow is strictly downward: steps → flows → pages → drivers; no cross-layer imports
- [x] **VI. Browser Injection** — No browser name hardcoded outside `src/drivers/playwright.adapter.ts`; adapter default is Chromium but never referenced by name outside that file
- [x] **VII. API-First** — Not applicable for this feature (hello world emits a log; no UI action, no API equivalent)
- [x] **VIII. Pino Logging** — `console.log`/`console.error` absent from all framework code; shared logger singleton in `src/utils/logger.ts` imported by all layers that log

## Project Structure

### Documentation (this feature)

```text
specs/001-project-scaffold-setup/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output — all unknowns resolved
├── data-model.md        # Phase 1 output — layer entities and dependency graph
├── quickstart.md        # Phase 1 output — developer getting started guide
└── tasks.md             # Phase 2 output (/speckit.tasks command — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
playwright-clarivate/
├── features/
│   └── hello-world.feature           # Layer 4 — Gherkin: hello world scenario
├── src/
│   ├── drivers/
│   │   ├── interfaces.ts             # IBrowser, IPage, IElement (no framework imports)
│   │   └── playwright.adapter.ts     # PlaywrightAdapter implements IBrowser
│   ├── pages/
│   │   └── hello-world.page.ts       # HelloWorldPage — calls logger.info()
│   ├── flows/
│   │   └── hello-world.flow.ts       # HelloWorldFlow — delegates to HelloWorldPage
│   ├── steps/
│   │   └── hello-world.steps.ts      # HelloWorldSteps — binds Gherkin to HelloWorldFlow
│   ├── hooks/
│   │   └── index.ts                  # Cucumber before/after hooks (empty scaffold)
│   ├── api/                          # API client dir (empty for this feature)
│   └── utils/
│       └── logger.ts                 # Shared pino singleton — only logger source
├── reports/
│   └── .gitkeep                      # Tracks directory; generated HTML/JSON are gitignored
├── cucumber.json                     # Cucumber runner config (requireModule: ts-node/register)
├── tsconfig.json                     # TypeScript strict, target ES2022, module CommonJS
├── package.json                      # Scripts: test, test:report, typecheck; all deps
└── .gitignore                        # Updated: reports contents gitignored, dir tracked
```

**Structure Decision**: Playwright is the active driver adapter for feature 006. The
`src/api/` and `src/hooks/` directories are scaffolded empty to establish the convention
for future features. No `config/` directory is needed at this scaffold stage — browser
injection uses environment variables (`BROWSER`) which is read in `PlaywrightAdapter`.

## Complexity Tracking

> No constitution violations in this plan. Table omitted per instructions.
