# Contract: Vitest Lifecycle Demonstration Assets

## Scope

This contract defines required automation runtime assets and observable behavior
for showing lifecycle execution in Cucumber hooks with modular fixtures and
log-based sequence proof.

## Asset Contract

Required artifacts:
- `src/support/hooks.ts`
- `src/support/lifecycle-logger.ts`
- `src/support/lifecycle-fixtures.ts`
- `tests/layer1-gherkin/smoke.feature`
- `src/layer2-step-definitions/smoke.steps.ts`

Rules:
- Console logs MUST be emitted for each required lifecycle event.
- Lifecycle and fixture orchestration MUST stay in support layer modules.
- Layer 1-4 code MUST remain automation-tool agnostic.

## Standard Hook Contract

Runtime hook orchestration MUST:
- Implement `BeforeAll`, `Before`, `After`, and `AfterAll` hooks.
- Emit unique lifecycle labels for each hook phase.
- Preserve ordering semantics such that:
  - `BeforeAll` occurs once before any scenario begins.
  - `Before` and `After` wrap every scenario.
  - `AfterAll` occurs once after all scenarios finish.

## Fixture Utility Contract

Fixture orchestration MUST support exactly two fixture concepts for this feature:
- `globalServer` (worker-scoped)
- `testDatabase` (test-scoped)

Each fixture MUST:
- Log `Start` when allocated.
- Log `End` when cleaned up.
- Use explicit typed fixture context (no `any`).

## Fixture Injection Contract

Feature assets MUST:
- Include at least one fixture-tagged smoke scenario.
- Include at least one non-tagged smoke scenario.
- Prove with assertions and logs that fixture lifecycle events appear only for
  fixture-tagged scenarios.

## Failure and Edge-Case Contract

The demonstrations MUST show or assert that:
- Teardown lifecycle logs (`After`, fixture `End`) are still emitted when a
  scenario path fails.
- If scenarios do not opt into fixtures, no fixture Start/End logs are emitted.
- Test-scoped fixture Start/End repeats for each dependent scenario.
- Worker-scoped fixture Start/End follows worker lifecycle behavior.

## Logging Contract

- Every lifecycle message MUST be uniquely identifiable for reliable assertions.
- Logs MUST be sufficient to reconstruct execution sequence without debugger use.
- Assertions may use in-memory capture of log labels, but console output remains
  the primary demonstration artifact.

## Validation Contract

Minimum validation commands:
- `npm run typecheck`
- `npm run test:smoke`

Optional confidence commands:
- `npm run test:driver:playwright`
- `npm run test:driver:vibium`
- `npm run verify:structure`
- `npm run check:async-surface`
- `npm run check:boundary`

## Versioning

- Contract version: `v1`
- Breaking changes to required artifacts, fixture names/scopes, or lifecycle
  observability require synchronized updates to spec, plan, and tasks.
