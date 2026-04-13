---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Include tests whenever the
feature or constitution requires validation of ports/adapters, layer contracts,
AI recovery behavior, or cross-layer workflows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

When features add or revise Gherkin coverage, include tasks that keep scenarios
focused on business intent rather than transient UI labels or incidental
navigation paths.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/core`, `src/application`, `src/adapters`, `src/ui`,
  `src/support`, and `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create the hexagonal project structure per implementation plan
- [ ] T002 Initialize TypeScript strict-mode OOP tooling and shared config
- [ ] T003 [P] Create baseline ports, adapter folders, and layer ownership rules
- [ ] T004 [P] Scaffold Page Flow Pattern: one Page Object per page/component, navigation methods return next Page Object

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Define core interfaces such as browser, page, element, and AI ports
- [ ] T005 [P] Implement the first concrete automation adapter behind those ports
- [ ] T006 [P] Add ExceptionManager, failure classification, and logging pipeline
- [ ] T007 Create builder utilities for complex test data and runtime state setup
- [ ] T008 Implement environment/provider strategy selection and registry wiring
- [ ] T009 Establish baseline page object decorators and recovery chain plumbing

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T010 [P] [US1] Contract test for new or changed ports/adapters
- [ ] T011 [P] [US1] Integration or Gherkin test for the business journey

### Implementation for User Story 1

- [ ] T012 [P] [US1] Add or update business interaction logic in src/core/tasks/
- [ ] T013 [P] [US1] Add or update page objects in src/ui/page-objects/
- [ ] T014 [US1] Implement supporting ports/adapters in src/core/ports/ and src/adapters/
- [ ] T015 [US1] Wire step definitions or application services without leaking tool types
- [ ] T016 [US1] Extend ExceptionManager, healing rules, or smart rerun policy as needed
- [ ] T017 [US1] Add telemetry/logging for user story 1 operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T018 [P] [US2] Contract test for changed ports, decorators, or strategies
- [ ] T019 [P] [US2] Integration or Gherkin test for the user journey

### Implementation for User Story 2

- [ ] T020 [P] [US2] Extend business interactions, builders, or registries for the new flow
- [ ] T021 [US2] Implement required adapters, decorators, or AI chain handlers
- [ ] T022 [US2] Add the feature flow in the correct layer-owned files
- [ ] T023 [US2] Integrate with User Story 1 components without violating boundaries

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T024 [P] [US3] Contract test for ExceptionManager or AI recovery updates
- [ ] T025 [P] [US3] Integration or Gherkin test for the user journey

### Implementation for User Story 3

- [ ] T026 [P] [US3] Add or update the relevant tasks, page objects, or support builders
- [ ] T027 [US3] Implement the required recovery, exploration, or rerun behavior
- [ ] T028 [US3] Add the feature flow in the correct layer-owned files

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Ports and domain contracts before adapters
- Business interactions before step-definition wiring
- Core and adapter implementation before cross-layer integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Layer-owned tasks within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for changed browser or AI ports in tests/contract/..."
Task: "Gherkin or integration test for the user journey in tests/gherkin/... or tests/integration/..."

# Launch layer-safe implementation tasks for User Story 1 together:
Task: "Add business interaction logic in src/core/tasks/..."
Task: "Add page objects in src/ui/page-objects/..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing when tests are part of the scope
- Include explicit tasks whenever a feature adds or changes ports, adapters,
  decorators, ExceptionManager logic, or AI recovery behavior
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
