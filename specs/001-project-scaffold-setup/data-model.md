# Data Model

**Feature**: 001-project-scaffold-setup  
**Branch**: `006-scaffold-hello-world`  
**Date**: 2026-04-14

## Overview

This feature does not introduce a persistent data store. The "entities" are the
architectural building blocks defined by Constitution V. This document maps them to
concrete source files and describes the relationships and contracts between layers.

---

## Entities

### Logger

| Attribute | Value |
|-----------|-------|
| **Location** | `src/utils/logger.ts` |
| **Type** | Singleton `pino.Logger` |
| **Used by** | All four source layers |
| **Fields** | `name: 'clarivate-framework'`, `level: 'debug'`, `transport: pino-pretty (non-CI)` |

```
Logger (singleton)
  └── created once at module load
  └── imported by all layers that need to emit log entries
  └── no constructor injection — static singleton export
```

---

### IBrowser (interface)

| Attribute | Value |
|-----------|-------|
| **Location** | `src/drivers/interfaces.ts` |
| **Methods** | `launch(): Promise<IPage>`, `close(): Promise<void>` |
| **Implemented by** | `PlaywrightAdapter` |
| **Used by** | Business flows (injected via constructor) |

---

### IPage (interface)

| Attribute | Value |
|-----------|-------|
| **Location** | `src/drivers/interfaces.ts` |
| **Methods** | `navigate(url: string): Promise<void>`, `close(): Promise<void>` |
| **Implemented by** | `PlaywrightPageAdapter` (inner class or companion of `PlaywrightAdapter`) |
| **Used by** | Page objects (injected via constructor) |

---

### IElement (interface)

| Attribute | Value |
|-----------|-------|
| **Location** | `src/drivers/interfaces.ts` |
| **Methods** | `click(): Promise<void>`, `getText(): Promise<string>`, `isVisible(): Promise<boolean>` |
| **Used by** | Page objects to represent DOM elements |

---

### PlaywrightAdapter

| Attribute | Value |
|-----------|-------|
| **Location** | `src/drivers/playwright.adapter.ts` |
| **Implements** | `IBrowser` |
| **Dependencies** | `@playwright/test` (only file in the project that imports Playwright) |
| **State** | `_browser: Browser \| null` (private) |
| **Hello world usage** | Instantiated but `launch()` is never called — validates wiring |

---

### HelloWorldPage (Page Object — Layer 1)

| Attribute | Value |
|-----------|-------|
| **Location** | `src/pages/hello-world.page.ts` |
| **Dependencies** | `IPage` (constructor-injected), `logger` (imported singleton) |
| **Methods** | `greet(): void` — emits a `logger.info` message |
| **State** | `_page: IPage` (private, readonly) |

**Note**: `greet()` is synchronous for the hello world scaffold — it only calls
`logger.info` and returns immediately. No I/O or driver call is made.

---

### HelloWorldFlow (Business Flow — Layer 2)

| Attribute | Value |
|-----------|-------|
| **Location** | `src/flows/hello-world.flow.ts` |
| **Dependencies** | `HelloWorldPage` (constructor-injected) |
| **Methods** | `runHelloWorld(): void` — delegates to `HelloWorldPage.greet()` |
| **State** | `_page: HelloWorldPage` (private, readonly) |

---

### HelloWorldSteps (Step Definition — Layer 3 — Binding Layer)

| Attribute | Value |
|-----------|-------|
| **Location** | `src/steps/hello-world.steps.ts` |
| **Dependencies** | `HelloWorldFlow` (constructor-injected via Cucumber World or direct `new`) |
| **Methods** | One method per Gherkin step; delegates to `HelloWorldFlow` |
| **State** | `_flow: HelloWorldFlow` (private, readonly) |

---

### HelloWorld Feature File (Layer 4)

| Attribute | Value |
|-----------|-------|
| **Location** | `features/hello-world.feature` |
| **Format** | Gherkin |
| **Scenarios** | 1 (the hello world scenario) |

---

## Layer Dependency Graph

```
features/hello-world.feature          (Layer 4 — no code)
        │
        ▼
src/steps/hello-world.steps.ts        (Layer 3 — imports HelloWorldFlow only)
        │
        ▼
src/flows/hello-world.flow.ts         (Layer 2 — imports HelloWorldPage only)
        │
        ▼
src/pages/hello-world.page.ts         (Layer 1 — imports IPage + logger)
        │
        ▼
src/drivers/interfaces.ts             (Layer 0 interfaces — IPage, IBrowser, IElement)
src/drivers/playwright.adapter.ts     (Layer 0 adapter — implements IBrowser)
        │
        ▼
src/utils/logger.ts                   (Shared utility — imported by any layer)
```

**Cross-layer import rule**: Every arrow above points strictly downward. No reverse
imports are permitted (Constitution V). `logger.ts` is a shared utility, not a layer;
any layer may import it.

---

## State Transitions

There are no persistent state machines in this scaffold. The hello world scenario
lifecycle is:

```
[Gherkin Given] → HelloWorldSteps.givenDepsInstalled()
      → HelloWorldFlow.runHelloWorld()
        → HelloWorldPage.greet()
          → logger.info('Hello, World!')
[Gherkin When]  → HelloWorldSteps.whenTestRuns()
      → (no action — step confirms flow ran)
[Gherkin Then]  → HelloWorldSteps.thenScenarioPasses()
      → (assertion — confirms no exception was thrown)
```

---

## Validation Rules

| Entity | Rule |
|--------|------|
| `IBrowser` | Methods MUST return Promises (async interface) |
| `HelloWorldPage.greet()` | MUST call `logger.info` at least once |
| Step definitions | MUST NOT import from `src/pages/` directly |
| Step definitions | MUST NOT import from `@playwright/test` |
| `PlaywrightAdapter` | MUST be the only file importing from `@playwright/test` |
| `logger.ts` | MUST export a single named `logger` constant |
