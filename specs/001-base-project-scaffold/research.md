# Research: Base Project Scaffold

## Decision 1: Node and TypeScript Baseline

- Decision: Use Node.js LTS >= 20 with TypeScript strict mode enabled and no-emit type checks.
- Rationale: Node 20 is the assumed runtime in the spec, and strict mode enforces the constitution requirement for explicit, safe typing and no implicit `any`.
- Alternatives considered:
  - Node 18: rejected because the spec explicitly targets Node 20+.
  - Non-strict TypeScript: rejected due to constitution and FR-001/FR-010 violations.

## Decision 2: Playwright Configuration Defaults

- Decision: Configure Playwright for headless-by-default execution, Chromium baseline project, bounded timeouts, HTML report artifacts, and CI-only retries.
- Rationale: This supports reliable local/CI execution while keeping failures visible and diagnosable without masking issues during local development.
- Alternatives considered:
  - Retries everywhere: rejected because it can hide flaky test design locally.
  - Multiple browser projects in scaffold: rejected as unnecessary scope for base bootstrap.

## Decision 3: Layering and Type Isolation

- Decision: Enforce five explicit layers and expose only tool-agnostic interfaces (`IBrowser`, `IPage`, `IElement`) above the adapter boundary.
- Rationale: Keeps architecture hexagonal and allows future tool replacement without changing Gherkin, Step Definitions, tasks, or Page Objects.
- Alternatives considered:
  - Direct Playwright imports in Page Objects or steps: rejected due to constitution and FR-004/FR-005 violations.
  - A cross-page orchestration god class: rejected by constitution Page Flow Pattern constraints.

## Decision 4: Exception Handling Baseline

- Decision: Introduce a minimal `ExceptionManager` class with typed failure context and a default escalation path.
- Rationale: Satisfies FR-006 now and provides a stable extension seam for healing/discovery/rerun behaviors in future features.
- Alternatives considered:
  - Scatter try/catch handling across step files: rejected because it fragments governance and increases coupling.
  - Omit exception manager from scaffold: rejected because it would force refactoring in follow-up features.

## Decision 5: Test Runner Composition

- Decision: Keep BDD flow as Layer 1 Gherkin -> Layer 2 Step Definitions -> Layer 3 page-scoped tasks -> Layer 4 Page Objects -> Layer 5 adapter.
- Rationale: Provides explicit traceability from business language to automation execution while preserving constitution layering rules.
- Alternatives considered:
  - Playwright test-only scaffold (no Gherkin): rejected because FR-007 requires `.feature` and step definition layers.
  - Step definitions calling adapter directly: rejected as a layering violation.
