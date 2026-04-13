# Data Model: Base Project Scaffold

## Entity: FeatureFile (Layer 1)

- Purpose: Express durable business behavior in Gherkin.
- Fields:
  - `name: string`
  - `scenarios: Scenario[]`
- Validation Rules:
  - Scenarios describe business outcomes, not brittle UI wording.
  - At least one smoke scenario exists for baseline validation.

## Entity: StepDefinition (Layer 2)

- Purpose: Translate Gherkin statements into task/page operations.
- Fields:
  - `pattern: RegExp | string`
  - `handlerClass: string`
  - `handlerMethod: string`
- Validation Rules:
  - Must not import Playwright types.
  - Must delegate to Layer 3 or Layer 4 abstractions, not to adapter internals.

## Entity: BusinessTask (Layer 3)

- Purpose: Represent page-scoped business interactions.
- Fields:
  - `taskName: string`
  - `pageObjectRef: string`
  - `goalDescription: string`
- Validation Rules:
  - No cross-application god-class orchestration.
  - Uses only tool-agnostic contracts for browser/page interactions.

## Entity: PageObject (Layer 4)

- Purpose: Encapsulate page-specific atomic actions and state queries.
- Fields:
  - `pageName: string`
  - `actions: PageAction[]`
  - `queries: PageQuery[]`
- Validation Rules:
  - Scoped to one page/component.
  - Navigation methods return destination Page Object type (Page Flow Pattern).
  - Must not import Playwright-specific runtime types.

## Entity: ToolAgnosticPort (Layer 5 Contract)

- Purpose: Define automation capability contracts independent of driver.
- Types:
  - `IBrowser`
  - `IPage`
  - `IElement`
- Validation Rules:
  - No Playwright types in signatures.
  - Stable API consumed by Layers 1-4.

## Entity: PlaywrightAdapter (Layer 5 Implementation)

- Purpose: Implement tool-agnostic ports with Playwright.
- Fields:
  - `adapterName: "playwright"`
  - `browserImpl: class`
  - `pageImpl: class`
  - `elementImpl: class`
- Validation Rules:
  - All Playwright imports are isolated to adapter files.
  - Adapter behavior conforms to `IBrowser`/`IPage`/`IElement` contracts.

## Entity: ExceptionManager

- Purpose: Centralized failure governance and escalation extension point.
- Fields:
  - `failureContext: FailureContext`
  - `strategy: EscalationStrategy`
- Validation Rules:
  - Accepts typed context.
  - Exposes hooks for future healing/discovery/smart-rerun behavior.

## Relationships

- `FeatureFile` maps to one or more `StepDefinition` handlers.
- `StepDefinition` invokes `BusinessTask` methods.
- `BusinessTask` composes one `PageObject` at a time for page-scoped behavior.
- `PageObject` depends on `ToolAgnosticPort` abstractions.
- `PlaywrightAdapter` implements `ToolAgnosticPort` interfaces.
- All runtime failures can be routed to `ExceptionManager`.

## State Transitions

- `ScenarioRegistered -> ScenarioExecuting -> ScenarioPassed | ScenarioFailed`
- On failure: `ScenarioFailed -> ExceptionManagerEscalation` (future transitions to healing/rerun remain out of scope in this feature)
