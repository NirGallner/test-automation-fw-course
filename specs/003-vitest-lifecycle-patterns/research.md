# Research: Vitest Lifecycle Patterns

## Decision 1: Keep Demonstrations in Unit-Test Assets Only

- Decision: Implement lifecycle demonstrations exclusively in `tests/unit/` and optional test-local utilities.
- Rationale: The feature is educational/verification-focused and must not alter production architecture or layer contracts.
- Alternatives considered:
  - Place lifecycle examples in `src/`: rejected because it introduces non-runtime behavior into source layers.
  - Mix examples into existing smoke task tests: rejected because it blurs behavior-test intent with lifecycle pedagogy.

## Decision 2: Baseline Hook Demonstration Pattern

- Decision: Use one standalone Vitest spec with `beforeAll`, `beforeEach`, `afterEach`, and `afterAll`, plus at least two `it` cases in a single `describe` block.
- Rationale: This provides the clearest deterministic baseline for suite-level and per-test hook ordering.
- Alternatives considered:
  - Single test case only: rejected because it cannot prove per-test repetition of `beforeEach`/`afterEach`.
  - Multiple describe blocks in one demo: rejected because it complicates order reasoning for first-pass readers.

## Decision 3: Logging Strategy as Primary Proof Artifact

- Decision: Emit unique `console.log` messages for every hook and fixture setup/teardown phase, and collect these logs in-memory for assertions.
- Rationale: Requirements make logs the authoritative lifecycle evidence while assertions keep the demo deterministic and reviewable.
- Alternatives considered:
  - Snapshot testing raw console output only: rejected because snapshots are brittle and less explicit about required sequence semantics.
  - Assertion-only without logs: rejected because it violates feature intent to demonstrate execution sequence visibly.

## Decision 4: Modular Fixture Design with `test.extend`

- Decision: Provide a dedicated fixture utility that exports an extended `test` object containing:
  - one worker-scoped fixture representing global server lifecycle
  - one test-scoped fixture representing database lifecycle
  Both fixtures log `Start` before `use()` and `End` after `use()`.
- Rationale: This mirrors scalable modular setup while directly satisfying fixture-scope and lifecycle requirements.
- Alternatives considered:
  - Inline fixtures inside each test file: rejected because reuse and composability goals are reduced.
  - Global setup file for all tests: rejected because it contradicts dependency-driven opt-in behavior.

## Decision 5: Fixture Opt-In Isolation Demonstration

- Decision: In the fixture demonstration spec, include mixed tests: one that destructures both fixtures and one that requests none.
- Rationale: Mixed usage in one file provides direct evidence that fixture lifecycle execution is dependency-driven.
- Alternatives considered:
  - Separate files for fixture and non-fixture tests: rejected because cross-file ordering/noise makes comparison less obvious.
  - Always inject fixtures everywhere: rejected because it cannot prove opt-in isolation.

## Decision 6: Teardown Visibility on Failure

- Decision: Include a controlled failing path (or equivalent assertion pattern) that verifies teardown logs still appear after test-body failure.
- Rationale: Edge-case requirements explicitly require cleanup observability in failure conditions.
- Alternatives considered:
  - Skip failure-path verification: rejected because it leaves a stated edge case unproven.
  - Depend on framework trust without assertion: rejected because requirement calls for demonstrable sequence evidence.

## Decision 7: BDD Syntax and Typing Discipline

- Decision: Use BDD syntax (`describe`, `it`, `expect`) consistently and keep fixture/test typings explicit with no `any`.
- Rationale: Satisfies functional requirements and strict TypeScript governance while keeping demonstrations clear.
- Alternatives considered:
  - `test()` style only: rejected because requirement explicitly calls for BDD syntax.
  - Untyped fixture context values: rejected due to strict typing requirements and maintainability concerns.

## Decision 8: Validation Command Scope

- Decision: Primary validation uses `npm run test:unit` and `npm run typecheck`, with optional full checks (`verify:structure`, `check:async-surface`, `check:boundary`) for repository-wide confidence.
- Rationale: Feature changes are unit-test scoped, but full guard scripts remain available to detect accidental architectural drift.
- Alternatives considered:
  - Run only a single targeted file: rejected because planning quickstart should reflect project-standard quality gates.
  - Run full smoke/driver matrix for this feature: rejected as unnecessary for unit-demo-only changes.
