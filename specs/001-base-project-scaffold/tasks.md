# Tasks: Base Project Scaffold

**Input**: Design documents from `/specs/001-base-project-scaffold/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are included because the feature explicitly requires a passing smoke scenario, strict type checks, and adapter-boundary validation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize repository tooling and baseline project structure.

- [ ] T001 Initialize Node/TypeScript automation project metadata and scripts in package.json
- [ ] T002 Add strict TypeScript compiler configuration in tsconfig.json
- [ ] T003 [P] Add repository ignore rules for dependencies, outputs, and reports in .gitignore
- [ ] T004 [P] Create five-layer scaffold directories with placeholder ownership docs in src/layer2-step-definitions/README.md
- [ ] T005 [P] Create layer 1 gherkin test directory structure in tests/layer1-gherkin/.gitkeep

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core architecture contracts and shared runtime wiring required by all stories.

**CRITICAL**: No user story implementation starts until this phase completes.

- [ ] T006 Define tool-agnostic browser port contract in src/layer5-abstractions/ports/ibrowser.ts
- [ ] T007 [P] Define tool-agnostic page port contract in src/layer5-abstractions/ports/ipage.ts
- [ ] T008 [P] Define tool-agnostic element port contract in src/layer5-abstractions/ports/ielement.ts
- [ ] T009 Implement Playwright browser adapter conforming to IBrowser in src/layer5-abstractions/adapter/playwright-browser.adapter.ts
- [ ] T010 [P] Implement Playwright page adapter conforming to IPage in src/layer5-abstractions/adapter/playwright-page.adapter.ts
- [ ] T011 [P] Implement Playwright element adapter conforming to IElement in src/layer5-abstractions/adapter/playwright-element.adapter.ts
- [ ] T012 Implement adapter resolution and lifecycle management in src/support/driver-registry.ts
- [ ] T013 Implement typed failure context and escalation seam in src/support/exception-manager.ts
- [ ] T014 Configure Playwright headless defaults, retries, timeout, and reporters in playwright.config.ts
- [ ] T015 Configure Cucumber TypeScript execution profile in cucumber.js

**Checkpoint**: Foundation ready. User stories can now be implemented and tested independently.

---

## Phase 3: User Story 1 - Engineer Runs a Passing Smoke Test (Priority: P1) 🎯 MVP

**Goal**: Deliver one passing end-to-end smoke path from Gherkin to browser adapter execution.

**Independent Test**: From a clean clone, run `npm install && npm run typecheck && npm test` and confirm at least one smoke scenario passes with exit code 0.

### Tests for User Story 1

- [ ] T016 [P] [US1] Add smoke Gherkin scenario validating reachable URL and non-empty title in tests/layer1-gherkin/smoke.feature
- [ ] T017 [P] [US1] Add unit tests for home smoke interaction behavior in tests/unit/home-smoke.task.spec.ts

### Implementation for User Story 1

- [ ] T018 [P] [US1] Implement page object atomic actions and page-scoped business methods in src/layer4-page-objects/home.page.ts
- [ ] T019 [P] [US1] Implement smoke business task orchestration for home page in src/tasks/home-smoke.task.ts
- [ ] T020 [US1] Implement step definitions mapping Gherkin to business task calls in src/layer2-step-definitions/smoke.steps.ts
- [ ] T021 [US1] Implement Cucumber hooks for browser setup/teardown and failure routing in src/support/hooks.ts
- [ ] T022 [US1] Wire Cucumber CLI test script for smoke execution in package.json

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - New Team Member Onboards Without Friction (Priority: P2)

**Goal**: Make architecture intent, setup steps, and strict typing expectations self-evident for new contributors.

**Independent Test**: Validate presence of `.gitignore`, TypeScript strict config, Playwright config, and clearly named five-layer directories plus onboarding instructions.

### Tests for User Story 2

- [ ] T023 [P] [US2] Add structure verification tests for required scaffold paths and config files in tests/unit/project-structure.spec.ts

### Implementation for User Story 2

- [ ] T024 [P] [US2] Document onboarding workflow and architecture map in README.md
- [ ] T025 [P] [US2] Add layer ownership notes for step definitions, tasks, page objects, and abstractions in src/layer4-page-objects/README.md
- [ ] T026 [US2] Add script that validates layer directory and config-file presence in scripts/verify-structure.mjs
- [ ] T027 [US2] Wire structure verification command for contributors in package.json

**Checkpoint**: User Stories 1 and 2 both work independently and onboarding is self-service.

---

## Phase 5: User Story 3 - CI Pipeline Executes Tests Reliably (Priority: P3)

**Goal**: Ensure default configuration supports stable headless CI execution with retry and report artifacts.

**Independent Test**: Run CI-mode test command with `CI=true` and verify headless execution, retry behavior, and report artifacts are produced.

### Tests for User Story 3

- [ ] T028 [P] [US3] Add Playwright configuration tests for CI retries and reporter settings in tests/unit/playwright-config.spec.ts

### Implementation for User Story 3

- [ ] T029 [P] [US3] Add CI-oriented test and report scripts in package.json
- [ ] T030 [P] [US3] Document CI execution requirements and artifact expectations in docs/ci.md
- [ ] T031 [US3] Add architecture boundary guard that detects Playwright imports outside adapters in scripts/check-playwright-boundary.mjs
- [ ] T032 [US3] Wire boundary guard command into validation workflow in package.json

**Checkpoint**: All user stories are independently functional with CI-ready defaults.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, boundary hardening, and quickstart alignment.

- [ ] T033 [P] Add contract-conformance tests for automation ports and adapters in tests/unit/automation-ports.contract.spec.ts
- [ ] T034 [P] Add strict typecheck and boundary checks to default validation workflow in package.json
- [ ] T035 Update quickstart command flow to match implemented scripts and checks in specs/001-base-project-scaffold/quickstart.md

---

## Phase 7: Driver Portability - Playwright or Vibium via Configuration

**Purpose**: Ensure the same layer 1-4 code can run on either Playwright or Vibium by changing runtime configuration only.

- [ ] T036 Add Vibium dependency and engine selection scripts in package.json
- [ ] T037 [P] Define driver-selection environment contract and defaults in src/support/runtime-config.ts
- [ ] T038 [P] Implement Vibium adapter classes conforming to existing ports in src/layer5-abstractions/adapter/vibium-browser.adapter.ts
- [ ] T039 Implement config-only adapter switching in driver registry strategy logic in src/support/driver-registry.ts
- [ ] T040 Add cross-driver parity smoke validation that runs unchanged scenarios on both drivers in tests/unit/driver-parity.spec.ts
- [ ] T041 Document how to run unchanged tests with either Playwright or Vibium using config only in docs/driver-selection.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies.
- Foundational (Phase 2): Depends on Setup completion and blocks all user stories.
- User Story phases (Phase 3-5): Depend on Foundational completion.
- Polish (Phase 6): Depends on completion of desired user stories.
- Driver Portability (Phase 7): Depends on Foundational completion; recommended after User Story 1 is green.

### User Story Dependencies

- User Story 1 (P1): Starts immediately after Foundational; no dependency on other stories.
- User Story 2 (P2): Starts after Foundational; can run in parallel with User Story 1 if staffed.
- User Story 3 (P3): Starts after Foundational; can run in parallel with User Story 1 and User Story 2 if staffed.

### Within Each User Story

- Story tests are authored before or alongside implementation and must pass independently.
- Ports and shared contracts are completed before story-specific wiring.
- Step-definition integration is completed after page object/task implementations.

## Parallel Opportunities

- Setup tasks marked [P]: T003, T004, T005
- Foundational tasks marked [P]: T007, T008, T010, T011
- User Story 1 tasks marked [P]: T016, T017, T018, T019
- User Story 2 tasks marked [P]: T023, T024, T025
- User Story 3 tasks marked [P]: T028, T029, T030
- Polish tasks marked [P]: T033, T034
- Driver Portability tasks marked [P]: T037, T038

## Parallel Example: User Story 1

- Run T016 and T017 in parallel while feature and unit tests are authored.
- Run T018 and T019 in parallel while Page Object and business task logic are implemented.
- Complete T020, T021, and T022 sequentially to wire and execute the smoke path.

## Parallel Example: User Story 2

- Run T023, T024, and T025 in parallel across tests and documentation.
- Complete T026 and T027 sequentially to enforce structure checks via scripts.

## Parallel Example: User Story 3

- Run T028, T029, and T030 in parallel for tests, scripts, and CI docs.
- Complete T031 and T032 sequentially to enforce boundary validation in CI workflows.

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Validate with `npm run typecheck && npm test`.

### Incremental Delivery

1. Deliver MVP by completing User Story 1.
2. Add User Story 2 for onboarding and structure governance.
3. Add User Story 3 for CI reliability guarantees.
4. Add Phase 7 to enable configuration-only driver switching between Playwright and Vibium.
5. Finish with Polish tasks for cross-cutting quality checks.

### Parallel Team Strategy

1. Pair on Setup + Foundational completion.
2. Split owners by story phase once Foundational is complete.
3. Rejoin for cross-cutting polish and validation.
