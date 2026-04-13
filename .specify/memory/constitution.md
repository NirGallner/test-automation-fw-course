<!--
Sync Impact Report
Version change: 1.0.0 -> 1.0.1
Modified principles:
- II. Layered Test Flow -> II. Layered Test Flow
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

### V. Strict TypeScript and Failure Governance
TypeScript strict mode is mandatory across the repository. New code MUST avoid
`any`, prefer generics for reusable action layers, and model failure states with
explicit types. Complex test setup MUST use Builder Pattern implementations
rather than ad hoc mutable fixtures. All execution failures MUST flow through a
centralized ExceptionManager that decides whether to trigger AI exploration,
invoke smart reruns, or fail the build. Logging, healing, and escalation
decisions MUST be consistent and reviewable.

## Implementation Standards

- Architectural changes MUST document the impacted layers, affected ports,
	required adapters, and why the chosen patterns are necessary.
- Page Object classes MUST expose atomic actions and state queries only; they
	MUST NOT contain business journey orchestration.
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

**Version**: 1.0.1 | **Ratified**: 2026-04-13 | **Last Amended**: 2026-04-13
