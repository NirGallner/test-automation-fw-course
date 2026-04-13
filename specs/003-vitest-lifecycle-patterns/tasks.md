# Tasks: Vitest Lifecycle Patterns

**Input**: Design documents from `/specs/003-vitest-lifecycle-patterns/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/vitest-lifecycle-demonstrations.md`, `quickstart.md`

**Tests**: This feature must be validated primarily through automation execution paths (`test:smoke`, driver-specific runs). Internal unit tests may be used for support checks, but they are not the primary delivery target.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish support-layer lifecycle and fixture scaffolding used by automation runtime.

- [X] T001 Create support lifecycle logger module in `src/support/lifecycle-logger.ts`.
- [X] T002 [P] Create automation fixture manager module in `src/support/lifecycle-fixtures.ts`.
- [X] T003 [P] Extend runtime fixture configuration shape in `src/support/runtime-config.ts`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared runtime plumbing before user-story automation behavior.

**CRITICAL**: No user story work should start until these tasks are complete.

- [X] T004 Wire lifecycle logger into scenario world context initialization in `src/support/hooks.ts`.
- [X] T005 Implement fixture allocation and cleanup orchestration APIs in `src/support/lifecycle-fixtures.ts`.
- [X] T006 [P] Integrate fixture manager with driver lifecycle in `src/support/driver-registry.ts`.
- [X] T007 [P] Extend failure-handling path for fixture cleanup failures in `src/support/exception-manager.ts`.

**Checkpoint**: Runtime lifecycle and fixture plumbing is ready for story-level automation behavior.

---

## Phase 3: User Story 1 - Demonstrate Standard Hooks (Priority: P1) 🎯 MVP

**Goal**: Show deterministic automation hook ordering in live Cucumber runs.

**Independent Test**: Run `npm run test:smoke` and verify logs show `BeforeAll`/`Before`/`After`/`AfterAll` sequence around scenario execution.

### Tests for User Story 1

- [X] T008 [US1] Add baseline hook-order verification scenario notes in `tests/layer1-gherkin/smoke.feature`.
- [X] T009 [US1] Add smoke execution assertions for hook-order evidence in `specs/003-vitest-lifecycle-patterns/quickstart.md`.

### Implementation for User Story 1

- [X] T010 [US1] Implement `BeforeAll`, `Before`, `After`, and `AfterAll` lifecycle logs in `src/support/hooks.ts`.
- [X] T011 [US1] Ensure world bootstrap and teardown emit deterministic lifecycle labels in `src/support/hooks.ts`.
- [X] T012 [US1] Ensure failed scenarios still execute teardown lifecycle logging in `src/support/hooks.ts`.

**Checkpoint**: User Story 1 independently demonstrates and validates runtime hook behavior in automation runs.

---

## Phase 4: User Story 2 - Provide Modular Fixture Injection (Priority: P2)

**Goal**: Provide reusable modular fixtures for automation scenarios with explicit opt-in.

**Independent Test**: Run `npm run test:driver:playwright` and `npm run test:driver:vibium` and verify fixture Start/End logs appear for scenarios marked to use fixtures.

### Tests for User Story 2

- [X] T013 [P] [US2] Add fixture opt-in scenario coverage and tags in `tests/layer1-gherkin/smoke.feature`.
- [X] T014 [US2] Add step-level verification for fixture-backed context consumption in `src/layer2-step-definitions/smoke.steps.ts`.

### Implementation for User Story 2

- [X] T015 [US2] Implement worker-lifecycle fixture provisioning and Start/End logs in `src/support/lifecycle-fixtures.ts`.
- [X] T016 [US2] Implement scenario-lifecycle fixture provisioning and Start/End logs in `src/support/lifecycle-fixtures.ts`.
- [X] T017 [US2] Connect fixture opt-in resolution from scenario metadata to hook orchestration in `src/support/hooks.ts`.

**Checkpoint**: User Story 2 independently demonstrates modular fixture composition during automation execution.

---

## Phase 5: User Story 3 - Verify BDD Injection Isolation (Priority: P3)

**Goal**: Prove fixture lifecycle execution is scenario opt-in and dependency-driven.

**Independent Test**: Run `npm run test:smoke` with mixed tagged/untagged scenarios and verify fixture logs only appear for opted-in scenarios.

### Tests for User Story 3

- [X] T018 [US3] Add mixed fixture/non-fixture scenarios proving isolation in `tests/layer1-gherkin/smoke.feature`.
- [X] T019 [US3] Add teardown evidence checks for fixture and non-fixture paths in `specs/003-vitest-lifecycle-patterns/quickstart.md`.
- [X] T020 [US3] Add failed-scenario cleanup verification steps for fixture teardown in `src/layer2-step-definitions/smoke.steps.ts`.

### Implementation for User Story 3

- [X] T021 [US3] Implement scenario-level fixture isolation filtering in `src/support/lifecycle-logger.ts`.
- [X] T022 [US3] Ensure scenario context typing supports optional fixture presence without leakage in `src/support/hooks.ts`.

**Checkpoint**: User Story 3 independently proves dependency-driven fixture execution in automation runtime.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency updates and validation guidance across all stories.

- [X] T023 [P] Update automation execution command matrix and expected lifecycle logs in `specs/003-vitest-lifecycle-patterns/quickstart.md`.
- [X] T024 [P] Refine contract notes for automation hook/fixture semantics in `specs/003-vitest-lifecycle-patterns/contracts/vitest-lifecycle-demonstrations.md`.
- [X] T025 [P] Update driver selection guidance for lifecycle fixture behavior in `docs/driver-selection.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2; can proceed independently of US1 completion if staffed, but default sequence is P1 then P2.
- **Phase 5 (US3)**: Depends on Phase 2 and benefits from US2 fixture utility completion.
- **Phase 6 (Polish)**: Depends on completion of all selected user stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories after foundational completion.
- **US2 (P2)**: No hard dependency on US1, but shares foundational helpers.
- **US3 (P3)**: Depends on fixture orchestration from US2 for isolation demonstrations.

### Within Each User Story

- Add/adjust tests before implementation changes in the same story.
- Build reusable fixture/log infrastructure before story-specific assertions.
- Complete and validate each story independently before proceeding to next priority.

---

## Parallel Opportunities

- Setup parallel work: T002 and T003.
- Foundational parallel work: T006 and T007.
- US2 parallel work: T013 and T015 (different files).
- Polish parallel work: T023, T024, and T025.

---

## Parallel Example: User Story 1

```bash
# US1 runtime-hook tasks target one file, so execute sequentially:
Task: T010 -> T011 -> T012 in src/support/hooks.ts
```

## Parallel Example: User Story 2

```bash
Task: T013 tests/layer1-gherkin/smoke.feature
Task: T015 src/support/lifecycle-fixtures.ts
```

## Parallel Example: User Story 3

```bash
Task: T021 src/support/lifecycle-logger.ts
Task: T022 src/support/hooks.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently with smoke execution.
4. Demo lifecycle baseline before fixture modularization.

### Incremental Delivery

1. Deliver US1 (runtime hook baseline).
2. Deliver US2 (reusable modular fixtures in automation runtime).
3. Deliver US3 (scenario opt-in isolation proof).
4. Complete polish and full validation command set.

### Parallel Team Strategy

1. Team completes Setup and Foundational phases together.
2. Then split work by story:
   - Engineer A: US1 runtime hook implementation.
   - Engineer B: US2 fixture manager and scenario opt-in flow.
   - Engineer C: US3 isolation and failure-edge cleanup validation.
3. Rejoin for final polish and validation.

---

## Notes

- `[P]` tasks indicate parallelizable work across different files with no blocking dependency on unfinished tasks.
- `[US1]`, `[US2]`, and `[US3]` labels map each task to a specific user story.
- All tasks include explicit file paths so execution is immediately actionable.
- Keep changes scoped to automation runtime layers and execution documentation for this feature.
