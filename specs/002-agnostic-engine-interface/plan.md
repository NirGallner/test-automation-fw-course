# Implementation Plan: Agnostic Automation Engine Interface Redesign

**Branch**: `002-before-specify-hook` | **Date**: 2026-04-13 | **Spec**: `/specs/002-agnostic-engine-interface/spec.md`
**Input**: Feature specification from `/specs/002-agnostic-engine-interface/spec.md`

## Summary

Introduce a strictly typed `IAutomationEngine` contract with intent-based
methods spanning shared capabilities (navigation, interaction, waits, frame,
window) and declared single-engine capabilities, then align Playwright and
Vibium adapters to that contract while providing a Selenium implementation
outline and unsupported-capability failure semantics. Runtime engine selection
remains configuration-driven through registry/factory behavior, with executable
parity validation restricted to Playwright and Vibium for this iteration.

Adapter implementations are decomposed per engine into multiple files where
needed (browser/page/element responsibilities) so each engine can evolve
capabilities without coupling unrelated abstractions.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js LTS (>=20)
**Primary Dependencies**: `playwright`, `@cucumber/cucumber`, `vitest`, `typescript`, `ts-node`, `tsx`, `@types/node`, `vibium` (vendored)
**Storage**: N/A (in-memory runtime + file-based configuration)
**Testing**: Vitest unit and contract tests, Cucumber behavior smoke tests, TypeScript no-emit checks, boundary and async-surface guard scripts
**Target Platform**: macOS/Linux/Windows local and CI execution
**Project Type**: Single-project Node.js automation framework
**Performance Goals**: Cross-engine smoke parity in under 5 minutes for configured engines (Playwright, Vibium)
**Constraints**: Strict TypeScript, no tool-specific types above Layer 5, standardized unsupported-method error format, Layers 1-4 avoid `async/await` syntax
**Scale/Scope**: One shared automation contract, two executable engines this iteration (Playwright and Vibium), Selenium retained in interface/factory design scope with non-executed implementation outline

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Gate

- Hexagonal boundaries remain intact: new engine behavior is expressed via a
  port (`IAutomationEngine`) and implemented only by Layer 5 adapters.
- Affected layers: Layer 3 task contracts, Layer 4 Page Object interaction
  surfaces, and Layer 5 ports/adapters/registry. Flow remains strictly downward.
- Gherkin and Step Definitions remain business-intent driven; no engine
  vocabulary is introduced into Layers 1-2.
- New/changed interfaces include `IAutomationEngine` and capability-specific
  types; existing `IBrowser`/`IPage`/`IElement` remain as compatibility surfaces
  or internal adapter composition boundaries.
- Pattern use:
  - Strategy/Factory: runtime engine selection from environment config.
  - Singleton/Registry: lifecycle management for selected engine instance.
  - Chain of Responsibility: unchanged; `ExceptionManager` remains escalation seam.
- `ExceptionManager` keeps centralized governance and receives unsupported
  capability failures with method and engine metadata.
- Strict TypeScript remains mandatory (`strict: true`, no `any` leakage).
- Page Flow Pattern is preserved by mapping page-object actions to intent
  methods without cross-page god-object aggregation.
- OOP discipline is preserved through class-based adapters and registries.
- Async surface remains minimized to adapter/framework boundaries.

Gate Result: PASS

### Post-Phase 1 Re-check

- Research decisions resolve naming, capability taxonomy, and unsupported method
  semantics without violating layer boundaries.
- Data model defines typed entities and relationships for engine capabilities,
  implementations, and factory resolution.
- Contract draft keeps engine-specific types out of Layers 1-4.
- Quickstart and validation scope explicitly constrain runnable parity to
  Playwright and Vibium, matching current repository dependencies.

Gate Result: PASS

## Project Structure

### Documentation (this feature)

```text
specs/002-agnostic-engine-interface/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── automation-engine.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── layer2-step-definitions/
├── layer4-page-objects/
├── layer5-abstractions/
│   ├── adapter/
│   │   ├── playwright-browser.adapter.ts
│   │   ├── playwright-page.adapter.ts
│   │   ├── playwright-element.adapter.ts
│   │   ├── vibium-browser.adapter.ts
│   │   ├── vibium-page.adapter.ts (planned if split required)
│   │   ├── vibium-element.adapter.ts (planned if split required)
│   │   ├── selenium-browser.adapter.ts (planned)
│   │   ├── selenium-page.adapter.ts (planned)
│   │   └── selenium-element.adapter.ts (planned)
│   └── ports/
│       ├── ibrowser.ts
│       ├── ipage.ts
│       ├── ielement.ts
│       └── iautomation-engine.ts (planned)
├── support/
│   ├── driver-registry.ts
│   ├── runtime-config.ts
│   └── exception-manager.ts
└── tasks/

tests/
├── layer1-gherkin/
└── unit/
```

**Structure Decision**: Keep the existing single-project layered layout and add
the new engine contract and adapter implementations under Layer 5 only, with
runtime selection logic centralized in support registry/config classes. Per
engine adapter code may span multiple files (browser/page/element) to preserve
clear boundaries and testability.

## Phase 0: Research Plan

- Research intent-based method taxonomy suitable for Playwright, Vibium, and
  Selenium parity while avoiding vendor terminology.
- Research unsupported capability behavior that is deterministic and testable
  via standardized error messages.
- Research factory-selection safeguards for invalid `DRIVER_ENGINE` values and
  compatibility with existing defaulting behavior.
- Research migration strategy from current `IBrowser`/`IPage`/`IElement` ports
  to a higher-level `IAutomationEngine` without Layer 1-3 disruption.
- Research complete capability coverage needed across existing
  `IBrowser`/`IPage`/`IElement` interfaces and new `IAutomationEngine` intent
  methods, including which methods are shared vs unique.

Output artifact: `/specs/002-agnostic-engine-interface/research.md`

## Phase 1: Design Plan

- Define data model for engine contract entities, capability metadata,
  implementation status, and error types.
- Define contract document for `IAutomationEngine` methods, shared vs unique
  capabilities, standardized unsupported-capability behavior, and mapping from
  existing `IBrowser`/`IPage`/`IElement` capabilities.
- Define quickstart and validation workflow including parity execution on
  Playwright/Vibium only.
- Update agent context using `.specify/scripts/bash/update-agent-context.sh copilot`.

Output artifacts:
- `/specs/002-agnostic-engine-interface/data-model.md`
- `/specs/002-agnostic-engine-interface/contracts/automation-engine.md`
- `/specs/002-agnostic-engine-interface/quickstart.md`

## Phase 2: Task Planning Approach

Task generation (`/speckit.tasks`) should produce dependency-ordered tasks:
1. Introduce `IAutomationEngine` port and supporting typed capability models.
2. Add/align Playwright and Vibium adapter classes to the new contract.
3. Add Selenium adapter scaffold/outline and explicit unsupported methods where
   implementation is intentionally deferred.
4. Refactor registry/config factory to validated engine resolution and fail-fast
   behavior for unknown identifiers.
5. Update Layer 4 and Layer 3 call sites to consume intent-level contract.
6. Add/expand contract tests for strict typing and unsupported-method messages.
7. Keep smoke parity scripts on Playwright and Vibium for executable coverage.
8. Validate with `typecheck`, `test:unit`, boundary checks, async-surface
   checks, and smoke/parity runs.

## Complexity Tracking

No constitution violations or complexity exceptions identified.
