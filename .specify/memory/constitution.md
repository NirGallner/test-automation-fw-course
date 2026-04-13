<!--
Sync Impact Report
Version change: 1.2.0 -> 1.3.0
Modified principles:
- V. Strict TypeScript, OOP, and Failure Governance (explicitly forbids async/await syntax in Layers 1-4)
Added sections:
- None
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs:
- None
-->

# Playwright Clarivate Constitution

## Core Principles

### I. Hexagonal Core Boundaries
The test system MUST follow a strict Hexagonal Architecture. Core test logic,
business workflows, and domain policies MUST depend only on ports and domain
types. Infrastructure implementations for Playwright, Cypress, AI providers,
logging, and environment services MUST live behind adapters and MUST NOT define
behavioral rules for the core. Any change that couples Layer 1, 2, or 3 to an
automation engine is a constitution violation because it prevents tool
replacement and obscures business intent.

### II. Layered Test Flow
The automation stack MUST preserve five explicit layers: Layer 1 Gherkin
scenarios, Layer 2 Step Definitions, Layer 3 Business Interactions (Tasks),
Layer 4 Page Object Model, and Layer 5 Tool-Agnostic Abstractions. Each layer
MUST call only the next appropriate layer down. Step Definitions MUST remain a
translation layer from business language to task execution. Business
Interactions MUST coordinate one or more Page Objects to achieve an end-to-end
goal. Page Objects MUST limit themselves to atomic interactions and element
knowledge. Gherkin scenarios MUST describe stable business intent and outcomes
rather than brittle UI wording, button labels, or exact navigation entry
points, so minor copy changes or moving an action from a form to a menu do not
force scenario rewrites when the user-visible capability is unchanged.
Tool-specific browser primitives MUST be confined to adapters behind Layer 5
interfaces.

Page Objects MUST follow the Page Flow Pattern: each Page Object MUST be
scoped to a single page or component, and any method that causes navigation
to a new page MUST return the Page Object representing that destination,
enabling type-safe, fluent flow chains. A god-class that aggregates interactions
across multiple pages or components is a constitution violation because it
creates tight coupling, hides navigation intent, and makes parallel development
impossible without merge conflicts.

### III. AI Recovery Chain
AI-assisted behavior MUST be reactive, explicit, and composable. Failed find,
read, or click operations MUST enter a Chain of Responsibility that attempts the
standard locator, then the Healer, then the Explorer, and finally the Reporter.
Decorator-based wrappers MUST add healing and logging without mutating the base
Page Object contract. DiscoveryMode MUST be opt-in and MUST explore alternative
navigation paths only after a failure signal. Smart reruns MUST only trigger
when failure analysis identifies flakiness or environment lag, and the rerun
reason plus adjusted wait strategy MUST be recorded.

### IV. Tool-Agnostic Contracts
All business-facing layers MUST depend on interfaces such as IBrowser, IPage,
IElement, and other domain contracts rather than Playwright or Cypress types.
Playwright is the current adapter, but no Playwright-specific type, fixture, or
locator abstraction may leak into Gherkin, Step Definitions, or Business
Interactions. Strategy Pattern implementations MUST isolate multi-environment
selection and AI provider selection. Singleton or Registry usage is allowed only
for stable cross-cutting concerns such as tool-agnostic driver resolution and
shared runtime configuration.

Playwright MUST be used as an automation adapter only and MUST NOT be used as
the test framework. Unit tests MUST use Vitest, while behavior tests continue
to be expressed through Gherkin/Cucumber layers.

### V. Strict TypeScript, OOP, and Failure Governance
TypeScript strict mode is mandatory across the repository. New code MUST avoid
`any`, prefer generics for reusable action layers, and model failure states with
explicit types. Complex test setup MUST use Builder Pattern implementations
rather than ad hoc mutable fixtures. All execution failures MUST flow through a
centralized ExceptionManager that decides whether to trigger AI exploration,
invoke smart reruns, or fail the build. Logging, healing, and escalation
decisions MUST be consistent and reviewable.

All source code MUST follow Object-Oriented Programming principles. Domain
concepts MUST be modelled as classes; behavior that belongs to a domain concept
MUST be encapsulated within the corresponding class. Standalone utility
functions are only permitted inside explicitly designated factory or utility
classes. Functional patterns that scatter behavior outside class boundaries are
a constitution violation.

Asynchronous code MUST be minimized to the smallest necessary surface. `async`
and `await` MUST only be introduced where a genuinely asynchronous operation
exists in the underlying adapter. Layers 1-4 MUST NOT use `async` or `await`
syntax; they MUST compose asynchronous work with direct Promise returns or
Promise chaining so orchestration remains synchronous-style at the language
surface. Wrapping synchronous logic in `Promise` or `async` for stylistic
consistency is prohibited; every asynchronous boundary MUST be traceable to an
I/O or timer boundary in the adapter or framework hook surface.

Unit tests for domain and support classes MUST be authored with Vitest. Adapter
and end-to-end behavior validation may use Playwright automation through Layer 5
and Cucumber scenarios, but Playwright MUST NOT become the primary unit test
runner.

## Implementation Standards

- Architectural changes MUST document the impacted layers, affected ports,
	required adapters, and why the chosen patterns are necessary.
- Page Object classes MUST expose atomic actions and state queries only; they
	MUST NOT contain business journey orchestration.
- Page Objects MUST follow the Page Flow Pattern: each Page Object is scoped to
	a single page or component and MUST return the next-state Page Object from any
	method that triggers navigation, enabling fluent, type-safe flow chains without
	exposing URL logic or routing decisions to callers. No god-class aggregating
	interactions across multiple pages is permitted.
- Business Interaction classes MUST express user goals such as checkout,
	onboarding, or search refinement and compose multiple Page Objects through
	tool-agnostic contracts.
- Cucumber language MUST stay intent-focused and avoid overfitting to transient
	labels, control names, or incidental interaction paths unless that wording or
	path is itself the business requirement under test.
- AI wrappers MUST preserve the original Page Object API surface while adding
	healing, telemetry, and fallback coordination.
- Environment-specific behavior MUST be selected through Strategy Pattern
	implementations, not inline conditionals scattered across workflows.
- Shared runtime state MUST be minimal, deterministic, and justified when a
	Singleton or Registry is introduced.
- All source MUST apply OOP discipline: classes MUST encapsulate all behavior
	pertaining to their domain concept; standalone multi-purpose utility functions
	outside designated utility or factory classes are prohibited.
- Async surface area MUST be minimized: Layers 1-4 MUST NOT introduce `async`
	methods or `await` expressions. Adapter and framework-boundary code may use
	them only when required by true asynchronous operations.

## Delivery Workflow & Quality Gates

- Every plan MUST pass a constitution check that confirms hexagonal boundaries,
	layer ownership, tool-agnostic contracts, AI recovery responsibilities, and
	ExceptionManager coverage.
- Every specification MUST identify which layers change, which ports or adapters
	are introduced, and whether AI healing, exploration, or smart reruns are part
	of the feature behavior.
- Every task list MUST include work for ports/adapters, layer-safe tests,
	exception handling, and observability whenever those concerns are touched.
- Reviews MUST reject features that leak Playwright-specific types above Layer 5
	or bypass the ExceptionManager for recoverable failures.
- Reviews MUST reject plans that use Playwright as the unit test framework; unit
	test responsibilities belong to Vitest.
- Merges MUST preserve strict TypeScript guarantees and include validation that
	the chosen design patterns were applied where the feature requires them.

## Governance

This constitution overrides conflicting local practices and templates.
Amendments require: (1) a written rationale, (2) updates to dependent templates
and guidance files, and (3) a clear migration note for any affected active
specification or plan. Compliance review is mandatory during specification,
planning, implementation, and code review.

Versioning policy follows semantic versioning for governance documents.
MAJOR versions change or remove principles in a backward-incompatible way.
MINOR versions add principles, sections, or materially stronger guidance.
PATCH versions clarify wording without changing governance meaning.

Every pull request and feature plan MUST state how it complies with these
principles or explicitly justify an approved exception. Unjustified deviations
MUST be corrected before merge.

**Version**: 1.3.0 | **Ratified**: 2026-04-13 | **Last Amended**: 2026-04-13
