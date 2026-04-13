# Implementation Plan: Vitest Lifecycle Patterns

**Branch**: `003-before-specification` | **Date**: 2026-04-14 | **Spec**: `/specs/003-vitest-lifecycle-patterns/spec.md`
**Input**: Feature specification from `/specs/003-vitest-lifecycle-patterns/spec.md`

## Summary

Implement lifecycle and fixture behavior in the automation runtime itself,
centered on Cucumber hook execution and reusable scenario-scoped resources used
by Layer 2/3 smoke flows. The feature adds deterministic lifecycle logging at
automation boundaries (`BeforeAll`, `Before`, `After`, `AfterAll`) and a modular
fixture composition mechanism that can be opted into per scenario without
turning the behavior into unit-test-only demonstrations.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js LTS (>=20)
**Primary Dependencies**: `@cucumber/cucumber`, `playwright`, `typescript`, `ts-node`, `@types/node` (Vitest remains internal support only)
**Storage**: N/A (in-memory runtime fixture state per worker/scenario)
**Testing**: Cucumber smoke/driver runs (`npm run test:smoke`, `npm run test:driver:playwright`, `npm run test:driver:vibium`), plus typecheck and guard scripts
**Target Platform**: macOS/Linux/Windows local and CI execution
**Project Type**: Single-project Node.js automation framework
**Performance Goals**: Deterministic lifecycle ordering in every smoke/driver run with no extra retries caused by fixture orchestration
**Constraints**: Changes must serve automation execution paths (not unit-demo-only), preserve layered boundaries, avoid Playwright leakage above Layer 5, and keep async surface constrained to framework/adapter boundaries
**Scale/Scope**: Support-layer lifecycle/fixture modules, hook integration, scenario opt-in path, and automation-level validation through existing Cucumber execution commands

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate

- Hexagonal boundaries are preserved by implementing lifecycle/fixture behavior
  in support orchestration while keeping adapter contracts behind Layer 5.
- Affected layers: Layer 1 scenario metadata/tags, Layer 2 step wiring,
  `src/support/hooks.ts`, and support fixture services. Layer 3/4 business
  flows consume prepared context without tool-type leakage.
- Gherkin remains business-intent-first; any scenario metadata added for fixture
  opt-in is minimal and durable.
- No new interfaces (`IBrowser`, `IPage`, `IElement`, registry contracts) are
  required; existing contracts remain the primary abstraction boundary.
- Pattern impact:
  - Registry usage remains in `DriverRegistry`.
  - Fixture composition is introduced as support-level orchestration, not a new
    cross-layer domain abstraction.
- `ExceptionManager` remains the failure handoff point for scenario teardown and
  fixture cleanup failures.
- TypeScript strict mode remains enforceable; planned files use explicit typing
  and avoid `any`.
- Page Flow Pattern remains unaffected unless a page-object call site needs
  fixture-prepared context only.
- OOP principle is preserved through class-based support modules for fixture
  provisioning and lifecycle logging.
- Async-surface governance is preserved by confining async to Cucumber hooks and
  adapter-facing boundaries.

Gate Result: PASS

### Post-Phase 1 Re-check

- Research confirms lifecycle and modular fixtures are implemented for automation
  execution (Cucumber runtime), not just internal unit-test coverage.
- Data model and contract define scenario-level fixture declarations and
  deterministic hook/fixture log semantics for runtime verification.
- Quickstart validation scope uses smoke and driver runs as primary evidence.

Gate Result: PASS

## Project Structure

### Documentation (this feature)

```text
specs/003-vitest-lifecycle-patterns/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── vitest-lifecycle-demonstrations.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── layer2-step-definitions/
├── tasks/
├── layer4-page-objects/
├── layer5-abstractions/
└── support/
  ├── hooks.ts
  ├── runtime-config.ts
  ├── driver-registry.ts
  ├── exception-manager.ts
  ├── lifecycle-logger.ts (planned)
  └── lifecycle-fixtures.ts (planned)

tests/
└── layer1-gherkin/
  └── smoke.feature (updated with fixture opt-in scenario coverage)
```

**Structure Decision**: Keep the existing single-project layered layout and add
automation lifecycle/fixture support under `src/support/` and consume it through
real Cucumber execution paths, with only minimal Layer 1 metadata updates needed
for fixture opt-in behavior.

## Phase 0: Research Plan

- Research deterministic Cucumber hook ordering (`BeforeAll`, `Before`, `After`,
  `AfterAll`) in this repository's runtime configuration.
- Research support-layer fixture composition patterns that allow scenario-level
  opt-in without coupling step definitions to tool internals.
- Research fixture declaration mechanisms suitable for automation scenarios
  (for example tags or runtime context flags) and their maintainability.
- Research failure-edge behavior to guarantee teardown logs and cleanup when a
  scenario fails mid-step.
- Research validation strategy using smoke/driver command outputs as the primary
  proof artifact.

Output artifact: `/specs/003-vitest-lifecycle-patterns/research.md`

## Phase 1: Design Plan

- Define a concise data model for lifecycle log events, hook phases, fixture
  declarations, and execution sequences in automation runtime.
- Define a contract document describing required automation assets and
  deterministic log semantics for hook and fixture orchestration.
- Define quickstart commands for running and validating lifecycle behavior
  through smoke and driver execution workflows.
- Update agent context using `.specify/scripts/bash/update-agent-context.sh copilot`.

Output artifacts:
- `/specs/003-vitest-lifecycle-patterns/data-model.md`
- `/specs/003-vitest-lifecycle-patterns/contracts/vitest-lifecycle-demonstrations.md`
- `/specs/003-vitest-lifecycle-patterns/quickstart.md`

## Phase 2: Task Planning Approach

Task generation (`/speckit.tasks`) should produce dependency-ordered tasks:
1. Add support-layer lifecycle logger and fixture manager used by real Cucumber
  runtime hooks.
2. Extend `src/support/hooks.ts` with complete lifecycle coverage and
  deterministic lifecycle/fixture logging.
3. Add scenario-level fixture opt-in behavior and keep step/task orchestration
  aligned with Layer 2/3 boundaries.
4. Add automation-level verification scenarios and expected outcomes in Layer 1
  feature files and quickstart guidance.
5. Ensure compatibility with runtime engine selection and failure governance via
  `DriverRegistry`, `RuntimeConfig`, and `ExceptionManager`.
6. Validate with `npm run typecheck`, `npm run test:smoke`, and driver-specific
  smoke runs, then execute structure/boundary/async-surface guards.

## Complexity Tracking

No constitution violations or complexity exceptions identified.
