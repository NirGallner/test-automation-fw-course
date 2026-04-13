# Support

## Role
Cross-cutting infrastructure used by Cucumber hooks, adapters, and step
definitions. Files here provide runtime configuration, lifecycle logging,
fixture management, engine registry, and centralised failure handling.

## Contents
| File | Responsibility |
|---|---|
| `runtime-config.ts` | Reads environment variables and produces a typed `RuntimeConfig`. |
| `driver-registry.ts` | Singleton that lazily constructs and caches the active `IAutomationEngine`. |
| `exception-manager.ts` | Centralised failure handler; all test failures MUST flow through `ExceptionManager`. |
| `lifecycle-fixtures.ts` | Allocates and cleans up worker- and scenario-scoped test fixtures. |
| `lifecycle-logger.ts` | In-memory lifecycle event log used for hook-ordering assertions. |
| `hooks.ts` | Cucumber BeforeAll / Before / After / AfterAll hook implementations. |

## Dependencies
- `../layer5-abstractions/ports/iautomation-engine` — engine type contract.
- `../layer4-page-objects/home.page` — Page Object wired by the Before hook.
- `../tasks/home-smoke.task` — Business Interaction wired by the Before hook.
- `@cucumber/cucumber` — hook registration APIs.

## Contract
Support classes MUST NOT contain business journey logic or page interaction
code. `ExceptionManager` is the single escalation point; raw `throw` in hook
code is only permitted via `ExceptionManager.handleFailure` or
`ExceptionManager.handleCleanupFailure`.
