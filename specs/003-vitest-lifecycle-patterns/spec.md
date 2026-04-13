# Feature Specification: Vitest Lifecycle Patterns

**Feature Branch**: `003-before-specification`  
**Created**: 2026-04-14  
**Status**: Draft  
**Input**: User description: "Create a technical specification for implementing Vitest lifecycles using both standard hooks and the modular test.extend fixture pattern. All implementations must use BDD syntax (describe, it, expect) and utilize console.log to demonstrate the execution sequence."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

Scenarios MUST describe durable business behavior. Avoid encoding transient
button names, menu labels, or exact click paths unless the wording or path is
itself a required outcome.

### User Story 1 - Demonstrate Standard Hooks (Priority: P1)

As a test engineer, I want a standalone lifecycle demonstration using native Vitest hooks so I can understand baseline setup and teardown behavior in BDD-style tests.

**Why this priority**: Native hook behavior is foundational and must be understood before introducing modular fixtures.

**Independent Test**: Run the standalone lifecycle spec and verify that logs show one global setup and teardown, and per-test setup and teardown around each test case.

**Acceptance Scenarios**:

1. **Given** a lifecycle test file with beforeAll, beforeEach, afterEach, and afterAll, **When** the suite runs, **Then** each hook writes a unique console message identifying its lifecycle position.
2. **Given** a describe block with multiple it cases, **When** the suite runs, **Then** beforeEach and afterEach execute for every individual test case.

---

### User Story 2 - Provide Modular Fixture Injection (Priority: P2)

As a test engineer, I want reusable fixtures defined via test.extend so lifecycle behavior can be composed by need rather than applied universally.

**Why this priority**: Modular setup reduces noise and reflects the recommended scalable pattern for larger suites.

**Independent Test**: Run fixture-enabled tests and verify worker-scoped and test-scoped resources log start and end around use() according to their scope behavior.

**Acceptance Scenarios**:

1. **Given** an extended test utility with worker-scoped and test-scoped fixtures, **When** a test opts into fixtures, **Then** logs show Start before use() and End after use() for each requested fixture.
2. **Given** multiple tests in one file, **When** only some tests request fixtures, **Then** fixture lifecycle logs appear only for tests that inject those fixtures.

---

### User Story 3 - Verify BDD Injection Isolation (Priority: P3)

As a test engineer, I want BDD tests that explicitly opt in or out of fixtures so I can prove fixture-based lifecycle execution is dependency-driven.

**Why this priority**: Isolation proof prevents incorrect assumptions that fixture setup runs for all tests.

**Independent Test**: Run one test that injects both fixtures and one test that injects none, then compare logs to confirm fixture activity only occurs for injected tests.

**Acceptance Scenarios**:

1. **Given** a BDD test that destructures both fixtures in the it callback, **When** it executes, **Then** both fixture lifecycle logs are present around the test body.
2. **Given** a BDD test that requests no fixtures, **When** it executes, **Then** no fixture lifecycle logs are emitted for that test.

---

### Edge Cases

- If a test fails, teardown logs for afterEach and fixture End phases still appear so lifecycle cleanup order remains observable.
- If a suite contains only tests that do not inject fixtures, no fixture Start/End messages should be emitted.
- If multiple tests inject the test-scoped fixture, each test gets its own Start/End cycle while the worker-scoped fixture starts once per worker lifecycle.

## Requirements *(mandatory)*

### Constitution Alignment *(mandatory)*

- Changes are limited to unit-test demonstration assets and optional test utilities; the five-layer execution architecture remains unchanged.
- No new ports, adapters, decorators, strategies, builders, chains, or registries are introduced.
- AI healing, DiscoveryMode exploration, and smart reruns are out of scope.
- No Playwright-specific types or direct locator primitives are introduced in Layers 1 through 3.
- Existing Cucumber phrasing and feature files remain unchanged.

### Functional Requirements

- **FR-001**: The specification MUST define one standalone lifecycle test file that uses native hooks: beforeAll, beforeEach, afterEach, and afterAll.
- **FR-002**: The standalone lifecycle test file MUST use BDD syntax with describe, it, and expect.
- **FR-003**: Each native hook MUST emit a unique console.log message identifying its lifecycle position.
- **FR-004**: The standalone lifecycle suite MUST contain multiple it cases to demonstrate that beforeEach and afterEach execute around every test case.
- **FR-005**: The specification MUST define a separate test utility file that provides an extended test object through test.extend.
- **FR-006**: The extended utility MUST include a worker-scoped fixture representing a global server lifecycle and log "Start" before use() and "End" after use().
- **FR-007**: The extended utility MUST include a test-scoped fixture representing a database lifecycle and log "Start" before use() and "End" after use().
- **FR-008**: Fixture lifecycle logic MUST be expressed through the use() callback to demonstrate setup and teardown within a single fixture function.
- **FR-009**: A BDD test file MUST import the extended test object and include at least one it case that injects both fixtures via parameter destructuring.
- **FR-010**: The same BDD test file MUST include at least one it case that injects no fixtures, proving lifecycle execution is opt-in.
- **FR-011**: The specification MUST require console log output sufficient to verify execution order for standard hooks and injected fixtures.

### Key Entities *(include if feature involves data)*

- **Lifecycle Event**: A logged setup or teardown moment, including phase label, scope type (suite, test, worker, fixture), and order position within execution.
- **Fixture Dependency Declaration**: A test-level declaration of requested fixtures that determines whether scoped lifecycles execute for that test.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In 100% of execution runs of the standard lifecycle suite, logs show a complete and ordered sequence for suite-level and per-test hooks.
- **SC-002**: In 100% of runs containing at least two test cases, logs confirm per-test setup and teardown are emitted once for each test case.
- **SC-003**: In 100% of runs with mixed fixture usage, tests that do not request fixtures emit no fixture lifecycle logs.
- **SC-004**: In 100% of runs where both fixtures are injected, logs show both fixture Start and End phases surrounding test execution.

## Assumptions

- The feature is educational and verification-focused; no production runtime behavior is changed.
- Console output is the authoritative proof artifact for lifecycle ordering in this feature.
- Existing project test conventions allow BDD-style unit tests under the current test setup.
- The scope covers only standard hook and fixture-injection lifecycle demonstration, not performance benchmarking or parallelization analysis.
