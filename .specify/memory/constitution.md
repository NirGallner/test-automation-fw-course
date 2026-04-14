<!--
Sync Impact Report
==================
Version change: 1.0.1 → 1.1.0
Bump rationale: MINOR — new mandatory technology added (Vitest as unit test framework)
Modified principles: none renamed
Added sections: Vitest entry in Technology Stack
Removed sections: none
Templates updated:
  ✅ .specify/memory/constitution.md — written
  ✅ .specify/templates/plan-template.md — Technical Context Testing line updated to include Vitest
  ✅ .specify/templates/spec-template.md — no change required
  ✅ .specify/templates/tasks-template.md — no change required
Deferred TODOs: none
-->

# Clarivate Test Automation Framework Constitution

## Core Principles

### I. TypeScript & Object-Oriented Programming

All source code MUST be written in TypeScript with strict mode enabled (`"strict": true`
in `tsconfig.json`). Every module, component, and utility MUST be expressed as a class.
Procedural scripts, bare functions exported at module scope (except pure utility helpers
with no state), and `any` type usage are PROHIBITED.

**Rationale**: TypeScript strict mode eliminates an entire class of runtime errors at
compile time. Mandatory OOP ensures consistent structure across contributors and makes
the codebase navigable as it scales.

### II. Tool-Agnostic Automation Core (NON-NEGOTIABLE)

The framework MUST NOT couple business logic or step definitions to any specific
automation driver. All driver interactions MUST be abstracted behind interfaces
(e.g., `IBrowser`, `IPage`, `IElement`). Supported drivers: Playwright, Virbium,
Cypress, Selenium. Swapping drivers MUST require changes only in the infrastructure
adapter layer — never in feature files, step definitions, or business flow classes.

**Rationale**: Tool lock-in is a long-term maintenance liability. Decoupling through
interfaces guarantees the suite survives driver migrations and multi-tool scenarios.

### III. Cucumber BDD — Preferred Test Authoring Standard

Cucumber BDD with Gherkin feature files (`*.feature`) is the STRONGLY PREFERRED
test authoring approach and SHOULD be used for all new automation scenarios.
Alternative test runners are permitted where Cucumber integration is impractical,
provided the layered architecture (Principle V) is preserved. When Cucumber is used,
raw driver calls inside step definitions are PROHIBITED, and step definition classes
(the binding layer) MUST be the sole consumers of business flow classes.

**Rationale**: Gherkin provides a living specification readable by non-technical
stakeholders and enforces a clean boundary between intent (what) and implementation (how).
Mandating a single runner is relaxed to avoid blocking edge cases where a different
runner integrates better with a specific driver or CI environment.

### IV. SOLID Principles & OOP Design Patterns

Every class MUST adhere to SOLID:
- **Single Responsibility**: Each class has exactly one reason to change.
- **Open/Closed**: Classes are open for extension, closed for modification.
- **Liskov Substitution**: Subtypes MUST be substitutable for their base types.
- **Interface Segregation**: Clients MUST NOT be forced to depend on interfaces
  they do not use. Prefer small, focused interfaces over monolithic ones.
- **Dependency Inversion**: High-level modules MUST NOT depend on low-level modules;
  both MUST depend on abstractions.

Well-known design patterns (Factory, Strategy, Builder, Decorator, Facade) are
ENCOURAGED where they reduce coupling. Patterns MUST be justified — no speculative
abstraction.

**Rationale**: SOLID compliance makes the codebase testable in isolation, prevents
regression cascades, and enables safe parallel development across the team.

### V. Layered Architecture & Separation of Concerns (NON-NEGOTIABLE)

The framework is organised into four mandatory layers. Dependencies flow strictly
downward — upper layers MUST NOT be imported by lower layers.

```
┌─────────────────────────────────────────────┐
│  Layer 4 — Feature Files  (*.feature)        │  Gherkin only, no code
├─────────────────────────────────────────────┤
│  Layer 3 — Cucumber Binding Layer            │  Step definitions, hooks
│            (src/steps/, src/hooks/)          │  calls Layer 2 only
├─────────────────────────────────────────────┤
│  Layer 2 — Business Flows                    │  Domain actions, assertions
│            (src/flows/)                       │  calls Layer 1 only
├─────────────────────────────────────────────┤
│  Layer 1 — Page Object Model                 │  Element locators, atomic actions
│            (src/pages/)                       │  calls driver abstractions only
└─────────────────────────────────────────────┘
         Driver Adapters (src/drivers/)
         Shared Utilities (src/utils/)
```

Cross-layer imports (e.g., a step definition importing a page object directly)
are a CONSTITUTION VIOLATION and MUST be flagged in code review.

**Rationale**: Strict layering isolates the blast radius of driver changes,
product UI changes, and test-logic changes to a single layer each.

### VI. Browser Configuration & Injection

Default browser MUST be Chrome. All browser selection MUST be controlled via
injectable configuration — runtime parameters (e.g., `--browser=firefox`),
environment variables (`BROWSER`), or a config file — never hardcoded in test
classes. Browser instantiation MUST be centralised in the driver adapter/factory,
and MUST be the only place where a specific browser name appears in code.

Supported injection targets: Chrome (default), Firefox, Safari/WebKit, Edge.

**Rationale**: Hardcoded browser references make cross-browser regression impossible
to run without code changes, which introduces risk and slows CI matrix execution.

### VII. API-First Testing Strategy

Wherever a user-facing flow has an observable API equivalent, the API assertion
MUST be executed before the UI assertion. UI testing is RESERVED for interactions
that cannot be fully validated at the API level (visual state, DOM behaviour,
end-to-end user experience). API client classes MUST reside in `src/api/` and
MUST be usable independently of any browser driver.

**Rationale**: API tests are an order of magnitude faster and more stable than
UI tests. Front-loading API assertions accelerates feedback loops and reduces flaky
suite runs caused by rendering delays.

### VIII. Structured Logging with Pino

All logging MUST use the `pino` library (TypeScript). `console.log` and `console.error`
are PROHIBITED in framework code except during bootstrap before pino is initialised.
Log levels MUST follow: `trace` (verbose driver calls), `debug` (step lifecycle),
`info` (scenario start/end, API responses), `warn` (soft assertion mismatches),
`error` (unrecoverable failures). A single shared logger instance MUST be created
in `src/utils/logger.ts` and imported by all layers.

**Rationale**: Structured JSON logs integrate with log aggregation platforms and
allow filtering by test run, scenario, or layer without grep-based post-processing.

## Technology Stack

- **Language**: TypeScript (strict mode, ESNext target)
- **BDD Runner**: Cucumber.js (`@cucumber/cucumber`)
- **Automation Drivers** (adapters): Playwright, Virbium, Cypress, Selenium WebDriver
- **Default Browser**: Chrome
- **Logging**: `pino` + `pino-pretty` for local dev
- **Unit Testing**: Vitest
- **Assertions**: Chai (or driver-native assertion library via adapter)
- **Reporting**: `cucumber-html-reporter` / Allure (configurable)
- **Task Runner**: npm scripts
- **Linting**: ESLint with `@typescript-eslint` + `plugin:import/typescript`

## Development Workflow

- All new automation scenarios MUST start as a `.feature` file (Gherkin first).
- Step definitions MUST be written before any page object or flow implementation
  (BDD outside-in).

- PRs MUST include a Constitution Check confirming no cross-layer imports, no
  hardcoded browser names, and no direct `console.log` usage.
- CI MUST run the full Cucumber suite on Chrome. Cross-browser runs are OPTIONAL
  but RECOMMENDED as a nightly or per-release gate.
- API pre-checks MUST be verified in CI before UI scenarios execute for the same feature.

## Governance

This constitution supersedes all other written or verbal practices in this repository.
Amendments require:

1. A written proposal describing the change and rationale.
2. Team review (minimum one approver).
3. An updated `LAST_AMENDED_DATE` and incremented `CONSTITUTION_VERSION`.
4. A migration plan if the amendment introduces a breaking change to existing layers.

Versioning policy follows semantic versioning:
- **MAJOR**: Removal or redefinition of a principle or mandatory layer.
- **MINOR**: New principle, layer, or mandatory technology added.
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements.

All PRs MUST include a Constitution Check section confirming compliance with
Principles I–VIII above.

**Version**: 1.1.0 | **Ratified**: 2026-04-14 | **Last Amended**: 2026-04-14
