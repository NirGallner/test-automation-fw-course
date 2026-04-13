# Data Model: Vitest Lifecycle Patterns

## Entity: LifecycleLogEvent

- Purpose: Represents one observable lifecycle moment emitted by hook or fixture logging.
- Fields:
  - `label: string` (unique human-readable event text)
  - `phase: "beforeAll" | "beforeEach" | "afterEach" | "afterAll" | "fixtureStart" | "fixtureEnd" | "testBody"`
  - `scope: "suite" | "test" | "workerFixture" | "testFixture"`
  - `testName?: string`
  - `fixtureName?: string`
  - `sequence: number`
- Validation Rules:
  - `label` must be unique within a demonstration run for deterministic assertions.
  - `sequence` increases monotonically for emitted events.
  - `fixtureName` is required when `scope` is `workerFixture` or `testFixture`.

## Entity: StandardLifecycleSuite

- Purpose: Baseline demonstration of native Vitest hook ordering in BDD syntax.
- Fields:
  - `suiteName: string`
  - `testCases: LifecycleTestCase[]`
  - `hooks: NativeHookSet`
  - `events: LifecycleLogEvent[]`
- Validation Rules:
  - Includes all native hooks: `beforeAll`, `beforeEach`, `afterEach`, `afterAll`.
  - Contains at least two `it` test cases.
  - For each test case, exactly one `beforeEach` and one `afterEach` event wrap the test body.

## Entity: NativeHookSet

- Purpose: Declares required native suite hooks and their message identities.
- Fields:
  - `beforeAllLabel: string`
  - `beforeEachLabel: string`
  - `afterEachLabel: string`
  - `afterAllLabel: string`
- Validation Rules:
  - All labels are non-empty and pairwise unique.

## Entity: FixtureDefinition

- Purpose: Describes one fixture in the `test.extend` utility.
- Fields:
  - `name: "globalServer" | "testDatabase"`
  - `scope: "worker" | "test"`
  - `startLabel: string`
  - `endLabel: string`
- Validation Rules:
  - `startLabel` logs before `use()`.
  - `endLabel` logs after `use()`.
  - `globalServer` uses worker scope; `testDatabase` uses test scope.

## Entity: FixtureInjectionCase

- Purpose: Represents one BDD test case and its fixture dependencies.
- Fields:
  - `name: string`
  - `requestedFixtures: FixtureDependencyDeclaration`
  - `events: LifecycleLogEvent[]`
- Validation Rules:
  - Case with both fixtures must produce both fixture Start/End sequences.
  - Case with no requested fixtures must produce no fixture lifecycle events.

## Value Object: FixtureDependencyDeclaration

- Fields:
  - `usesGlobalServer: boolean`
  - `usesTestDatabase: boolean`
- Validation Rules:
  - Derived from parameter destructuring in the `it` callback.
  - Determines whether fixture setup/teardown executes.

## Entity: LifecycleAssertionSet

- Purpose: Defines deterministic checks that convert logged events into pass/fail outcomes.
- Fields:
  - `requiredOrderChecks: string[]`
  - `presenceChecks: string[]`
  - `absenceChecks: string[]`
  - `failureCleanupChecks: string[]`
- Validation Rules:
  - Must assert full hook ordering for standard lifecycle suite.
  - Must assert fixture presence for injected cases.
  - Must assert fixture absence for non-injected cases.
  - Must assert teardown visibility after controlled failure scenario.

## Relationships

- `StandardLifecycleSuite` contains many `LifecycleTestCase` entries and many `LifecycleLogEvent` entries.
- `NativeHookSet` belongs to one `StandardLifecycleSuite`.
- `FixtureDefinition` entries are consumed by fixture utility and referenced by `FixtureInjectionCase`.
- `FixtureInjectionCase` contains one `FixtureDependencyDeclaration` and many `LifecycleLogEvent` entries.
- `LifecycleAssertionSet` validates event streams emitted by both standard-hook and fixture-injection suites.

## State Transitions

- `SuiteStart -> beforeAll -> (beforeEach -> testBody -> afterEach)* -> afterAll -> SuiteEnd`
- `WorkerFixtureStart -> use() window across dependent tests -> WorkerFixtureEnd`
- `TestFixtureStart -> testBody -> TestFixtureEnd` (per dependent test)
- `TestBodyFailure -> afterEach/FixtureEnd emitted -> Assertion evaluation`
