# Implementation Plan: Base Project Scaffold

**Branch**: `001-base-project-scaffold` | **Date**: 2026-04-13 | **Spec**: `/specs/001-base-project-scaffold/spec.md`
**Input**: Feature specification from `/specs/001-base-project-scaffold/spec.md`

## Summary

Create a strict TypeScript Playwright-automation+Cucumber base scaffold that enforces the
five-layer architecture from the constitution, includes tool-agnostic browser
ports (`IBrowser`, `IPage`, `IElement`), a Playwright-only adapter layer, an
`ExceptionManager` extension point, and one passing smoke scenario proving
end-to-end wiring from Gherkin to browser automation.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js LTS (>=20)
**Primary Dependencies**: `playwright`, `@cucumber/cucumber`, `vitest`, `typescript`, `ts-node`, `tsx`, `@types/node`
**Storage**: N/A (file-based project scaffold only)
**Testing**: Cucumber scenario execution for behavior tests, Vitest for unit tests, `tsc --noEmit` for type checks
**Target Platform**: macOS/Linux CI and local development (headless-first)
**Project Type**: Single-project Node.js test-automation scaffold
**Performance Goals**: Fresh clone to green smoke run under 5 minutes
**Constraints**: Strict TypeScript (`strict: true`), no Playwright types above Layer 5, CI-safe headless defaults
**Scale/Scope**: 1 smoke scenario, 5 architecture layers, 1 browser project (Chromium) in scaffold phase

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate

- Hexagonal boundaries are preserved by placing all browser-engine details in
  adapter classes while Step Definitions, tasks, and Page Objects depend only
  on ports.
- Affected layers are explicitly represented and dependency flow is one-way:
  Layer 1 Gherkin -> Layer 2 Step Definitions -> Layer 3 page-scoped business
  interactions -> Layer 4 Page Objects -> Layer 5 tool-agnostic ports/adapters.
- Gherkin wording targets stable outcome validation (application reachable,
  non-empty title/landmark), avoiding brittle UI labels.
- New interfaces: `IBrowser`, `IPage`, `IElement`; optional driver registry
  class for adapter resolution. Playwright types remain isolated to
  `src/adapters/playwright/*`.
- Required patterns:
  - Strategy: adapter selection for current/future driver swap.
  - Singleton/Registry: driver resolution lifetime in support layer.
  - Chain of Responsibility: not implemented in scaffold, but
    `ExceptionManager` provides integration seam for future healing chain.
- `ExceptionManager` starts as a typed escalation stub receiving failure
  context and routing to fail-fast behavior now, extendable later.
- Type safety gate: strict compiler settings, no implicit `any`, typed domain
  contracts, and Vitest unit test coverage for core classes.
- Page Flow Pattern: each Page Object remains page-scoped; navigation methods
  return destination Page Object where navigation occurs.
- OOP gate: domain behavior is encapsulated in classes; no standalone
  multi-purpose utility functions.
- Async minimization: async boundaries are limited to adapter/browser I/O,
  while orchestration logic remains as synchronous-style as tool constraints
  allow.

Gate Result: PASS

### Post-Phase 1 Re-check

- Research and design artifacts preserve all principle constraints and include
  no justified violations.
- Contracts explicitly prevent Playwright type leakage into Layers 1-4.
- Data model includes typed class/interface responsibilities for each layer.

Gate Result: PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-base-project-scaffold/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── automation-ports.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── layer2-step-definitions/
│   └── smoke.steps.ts
├── layer4-page-objects/
│   └── home.page.ts
├── layer5-abstractions/
│   ├── ports/
│   │   ├── ibrowser.ts
│   │   ├── ielement.ts
│   │   └── ipage.ts
│   └── adapter/
│       ├── playwright-browser.adapter.ts
│       ├── playwright-page.adapter.ts
│       └── playwright-element.adapter.ts
├── tasks/
│   └── home-smoke.task.ts
└── support/
    ├── exception-manager.ts
    └── driver-registry.ts

tests/
└── layer1-gherkin/
    └── smoke.feature
```

**Structure Decision**: Single-project TypeScript scaffold with explicit layer
directories encoded in path names to make constitution boundaries obvious for
new contributors and reviewers.

## Phase 0: Research Plan

- Validate strict TypeScript baseline and Node engine guardrails.
- Validate Playwright CI defaults (headless, retries in CI, reporter artifacts,
  timeouts) suitable for scaffold-level reliability.
- Validate Cucumber + Playwright wiring patterns that maintain five-layer
  architecture and avoid god-class interaction design.

Output artifact: `/specs/001-base-project-scaffold/research.md`

## Phase 1: Design Plan

- Define data model for architecture entities and relationships.
- Define contract for automation ports and adapter boundary.
- Define onboarding and execution quickstart.
- Update agent context using `.specify/scripts/bash/update-agent-context.sh copilot`.

Output artifacts:
- `/specs/001-base-project-scaffold/data-model.md`
- `/specs/001-base-project-scaffold/contracts/automation-ports.md`
- `/specs/001-base-project-scaffold/quickstart.md`

## Phase 2: Task Planning Approach

Task generation (`/speckit.tasks`) should produce dependency-ordered tasks in
this sequence:
1. Scaffold package/tooling and strict TypeScript config.
2. Create layer directories and tool-agnostic ports.
3. Implement Playwright adapters and driver registry.
4. Implement Page Object and page-scoped task classes.
5. Implement Step Definitions and Gherkin smoke scenario.
6. Add `ExceptionManager` stub and failure-context typing.
7. Add Vitest unit tests for ports, Page Objects, and failure-governance classes.
8. Validate with typecheck, unit tests, and smoke test execution.

## Complexity Tracking

No constitution violations or complexity exceptions identified.
