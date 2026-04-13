# Tasks: Agnostic Automation Engine Interface Redesign

**Input**: Design documents from `/specs/002-agnostic-engine-interface/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/automation-engine.md`, `quickstart.md`

**Tests**: Include unit/contract/integration tasks because this feature changes Layer 5 ports/adapters, runtime engine selection, and cross-engine behavior.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create shared scaffolding for the new engine contract and adapter decomposition.

- [ ] T001 Create the new engine port file `src/layer5-abstractions/ports/iautomation-engine.ts`.
- [ ] T002 Create shared engine capability type definitions in `src/layer5-abstractions/ports/automation-engine-capabilities.ts`.
- [ ] T003 [P] Create decomposed Vibium adapter stubs in `src/layer5-abstractions/adapter/vibium-page.adapter.ts` and `src/layer5-abstractions/adapter/vibium-element.adapter.ts`.
- [ ] T004 [P] Create decomposed Selenium adapter stubs in `src/layer5-abstractions/adapter/selenium-browser.adapter.ts`, `src/layer5-abstractions/adapter/selenium-page.adapter.ts`, and `src/layer5-abstractions/adapter/selenium-element.adapter.ts`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core runtime and error infrastructure required before user stories.

**CRITICAL**: No user story work starts until this phase is complete.

- [ ] T005 Add standardized unsupported-capability error creation in `src/support/exception-manager.ts`.
- [ ] T006 Refactor engine resolution and fail-fast validation in `src/support/runtime-config.ts`.
- [ ] T007 Update engine registry/factory mapping for `playwright|vibium|selenium` in `src/support/driver-registry.ts`.
- [ ] T008 [P] Add foundational unit coverage for runtime resolution and invalid engine errors in `tests/unit/playwright-config.spec.ts` and `tests/unit/driver-parity.spec.ts`.
- [ ] T009 [P] Update boundary/structure guard expectations for new adapter files in `scripts/check-playwright-boundary.mjs` and `scripts/verify-structure.mjs`.

**Checkpoint**: Shared contract scaffolding, runtime selection, and error semantics are ready.

---

## Phase 3: User Story 1 - Execute Core Flows Across Engines (Priority: P1) 🎯 MVP

**Goal**: Run shared business flows with equivalent behavior on Playwright and Vibium using the new intent-level contract.

**Independent Test**: Run the same smoke flow on Playwright and Vibium and verify parity for navigation, interaction, waits, frame, and window operations.

### Tests for User Story 1

- [ ] T010 [P] [US1] Add shared-capability contract tests for Playwright and Vibium adapters in `tests/unit/automation-ports.contract.spec.ts`.
- [ ] T011 [P] [US1] Add parity smoke unit coverage for task-level behavior in `tests/unit/home-smoke.task.spec.ts`.
- [ ] T012 [P] [US1] Extend driver parity assertions for Playwright and Vibium in `tests/unit/driver-parity.spec.ts`.

### Implementation for User Story 1

- [ ] T013 [P] [US1] Implement `IAutomationEngine` shared navigation/interaction methods in `src/layer5-abstractions/adapter/playwright-browser.adapter.ts` and `src/layer5-abstractions/adapter/playwright-page.adapter.ts`.
- [ ] T014 [P] [US1] Implement `IAutomationEngine` shared navigation/interaction methods in `src/layer5-abstractions/adapter/vibium-browser.adapter.ts` and `src/layer5-abstractions/adapter/vibium-page.adapter.ts`.
- [ ] T015 [US1] Implement shared element query/state methods in `src/layer5-abstractions/adapter/playwright-element.adapter.ts` and `src/layer5-abstractions/adapter/vibium-element.adapter.ts`.
- [ ] T016 [US1] Refactor Page Object usage to consume intent-level engine methods in `src/layer4-page-objects/home.page.ts`.
- [ ] T017 [US1] Refactor business task orchestration to use the unified engine contract in `src/tasks/home-smoke.task.ts`.
- [ ] T018 [US1] Update step wiring to keep business intent and route through the new task flow in `src/layer2-step-definitions/smoke.steps.ts`.

**Checkpoint**: User Story 1 is runnable and independently testable on Playwright and Vibium.

---

## Phase 4: User Story 2 - Preserve Full Capability Parity (Priority: P2)

**Goal**: Preserve shared plus unique capabilities with deterministic unsupported-method behavior.

**Independent Test**: Validate unique capability behavior and exact unsupported messages per engine.

### Tests for User Story 2

- [ ] T019 [P] [US2] Add unsupported-capability message contract tests in `tests/unit/automation-ports.contract.spec.ts`.
- [ ] T020 [P] [US2] Add async-surface compliance tests for new contract usage in `tests/unit/async-surface.guard.spec.ts`.

### Implementation for User Story 2

- [ ] T021 [P] [US2] Implement unique capability support and explicit unsupported throws for Playwright in `src/layer5-abstractions/adapter/playwright-browser.adapter.ts`.
- [ ] T022 [P] [US2] Implement unique capability support and explicit unsupported throws for Vibium in `src/layer5-abstractions/adapter/vibium-browser.adapter.ts`.
- [ ] T023 [US2] Add Selenium implementation outline methods with standardized unsupported behavior in `src/layer5-abstractions/adapter/selenium-browser.adapter.ts`, `src/layer5-abstractions/adapter/selenium-page.adapter.ts`, and `src/layer5-abstractions/adapter/selenium-element.adapter.ts`.
- [ ] T024 [US2] Align contract examples and capability list with implemented behavior in `specs/002-agnostic-engine-interface/contracts/automation-engine.md`.

**Checkpoint**: User Story 2 capability parity rules are enforced and independently testable.

---

## Phase 5: User Story 3 - Switch Engines by Configuration (Priority: P3)

**Goal**: Select engine by environment with deterministic validation and no scenario edits.

**Independent Test**: Set `DRIVER_ENGINE` to `playwright`, `vibium`, `selenium`, and an invalid value to validate selection and fail-fast behavior.

### Tests for User Story 3

- [ ] T025 [P] [US3] Add engine-selection coverage for valid and invalid values in `tests/unit/playwright-config.spec.ts`.
- [ ] T026 [P] [US3] Add registry selection and fail-fast tests in `tests/unit/driver-parity.spec.ts`.

### Implementation for User Story 3

- [ ] T027 [US3] Finalize environment-to-engine selection rules and error text in `src/support/runtime-config.ts`.
- [ ] T028 [US3] Finalize registry instantiation path per engine in `src/support/driver-registry.ts`.
- [ ] T029 [US3] Keep hook lifecycle compatible with runtime-selected engines in `src/support/hooks.ts`.
- [ ] T030 [US3] Update driver selection guidance for Playwright/Vibium execution and Selenium design scope in `docs/driver-selection.md`.

**Checkpoint**: User Story 3 is independently testable and configuration-driven.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and quality gates across all stories.

- [ ] T031 [P] Update implementation notes and verification flow in `specs/002-agnostic-engine-interface/quickstart.md`.
- [ ] T032 [P] Update CI/parity documentation for Playwright and Vibium execution scope in `docs/ci.md`.
- [ ] T033 Run full validation suite and capture final results in `reports/cucumber-report.html`.

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): No dependencies.
- Phase 2 (Foundational): Depends on Phase 1 and blocks all user stories.
- Phase 3 (US1): Depends on Phase 2.
- Phase 4 (US2): Depends on Phase 2; can run in parallel with Phase 3 after foundation, but recommended after US1 for lower risk.
- Phase 5 (US3): Depends on Phase 2; can run in parallel with US2 if staffed.
- Phase 6 (Polish): Depends on completion of all selected user stories.

### User Story Dependencies

- US1 (P1): No dependency on other stories after Phase 2.
- US2 (P2): No hard dependency on US1, but reuses US1 adapter surfaces.
- US3 (P3): No hard dependency on US1/US2, but benefits from adapter completion.

### Within Each User Story

- Tests first, then implementation.
- Ports/contracts before adapter behavior.
- Adapter behavior before Layer 4/3 integration wiring.
- Story must pass independent validation before moving on.

---

## Parallel Opportunities

- Setup parallel: T003 and T004.
- Foundational parallel: T008 and T009.
- US1 parallel: T010, T011, T012, T013, T014.
- US2 parallel: T019, T020, T021, T022.
- US3 parallel: T025 and T026.
- Polish parallel: T031 and T032.

---

## Parallel Example: User Story 1

```bash
# Contract/parity tests in parallel
Task: T010 tests/unit/automation-ports.contract.spec.ts
Task: T011 tests/unit/home-smoke.task.spec.ts
Task: T012 tests/unit/driver-parity.spec.ts

# Adapter implementation in parallel by engine
Task: T013 src/layer5-abstractions/adapter/playwright-browser.adapter.ts + src/layer5-abstractions/adapter/playwright-page.adapter.ts
Task: T014 src/layer5-abstractions/adapter/vibium-browser.adapter.ts + src/layer5-abstractions/adapter/vibium-page.adapter.ts
```

## Parallel Example: User Story 2

```bash
# Independent capability test tasks
Task: T019 tests/unit/automation-ports.contract.spec.ts
Task: T020 tests/unit/async-surface.guard.spec.ts

# Engine-specific capability implementation in parallel
Task: T021 src/layer5-abstractions/adapter/playwright-browser.adapter.ts
Task: T022 src/layer5-abstractions/adapter/vibium-browser.adapter.ts
```

## Parallel Example: User Story 3

```bash
# Selection behavior tests in parallel
Task: T025 tests/unit/playwright-config.spec.ts
Task: T026 tests/unit/driver-parity.spec.ts

# Runtime and registry wiring
Task: T027 src/support/runtime-config.ts
Task: T028 src/support/driver-registry.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete US1 tasks (T010-T018).
3. Validate parity on Playwright and Vibium.
4. Demo MVP before expanding to US2/US3.

### Incremental Delivery

1. Deliver US1 (core cross-engine flows).
2. Deliver US2 (unique capability parity and unsupported handling).
3. Deliver US3 (config-driven switching and fail-fast behavior).
4. Finish with Phase 6 polish and full-gate validation.

### Parallel Team Strategy

1. Team completes Phase 1-2 together.
2. Then split by story:
   - Engineer A: US1 implementation and parity checks.
   - Engineer B: US2 capability semantics and unsupported tests.
   - Engineer C: US3 runtime selection and docs.
3. Rejoin for Phase 6 full validation.

---

## Notes

- `[P]` means different files and no blocking dependency on an incomplete task.
- `[US1]`, `[US2]`, and `[US3]` provide story traceability.
- Selenium remains in design/contract/outline scope for this feature; executable parity scope is Playwright and Vibium.
- Keep Layers 1-4 free of tool-specific imports and `async/await` syntax while implementing these tasks.
