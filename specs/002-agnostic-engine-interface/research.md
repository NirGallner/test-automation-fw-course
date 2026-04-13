# Research: Agnostic Automation Engine Interface Redesign

## Decision 1: Intent-Based Contract Naming

- Decision: Use user-action-oriented method names in `IAutomationEngine` (for example, `openUrl`, `click`, `enterText`, `hover`, `waitForVisible`, `switchToFrame`, `switchToWindow`) and avoid vendor-specific terminology.
- Rationale: Intent names preserve readability in Layers 1-4 and prevent coupling to any single automation vendor API model.
- Alternatives considered:
  - Keep current low-level `IBrowser`/`IPage`/`IElement` methods only: rejected because higher-level parity and capability governance become fragmented.
  - Mirror Playwright naming exactly: rejected due to constitution rule against tool-specific leakage.

## Decision 2: Capability Taxonomy for Shared vs Unique Features

- Decision: Model each method as either shared capability (expected across all engines) or unique capability (available on one subset of engines).
- Rationale: This supports strict typing and explicit parity accounting while still preserving advanced single-tool features.
- Alternatives considered:
  - Shared-only contract: rejected because it discards unique high-value capabilities.
  - Separate engine-specific side interfaces: rejected because usage becomes harder to reason about and test globally.

## Decision 3: Unsupported Capability Behavior

- Decision: Enforce standardized unsupported-capability errors for non-compatible engines in format: `"[MethodName] is not supported by the [ToolName] engine."`.
- Rationale: Deterministic messaging enables contract tests and clear user diagnostics.
- Alternatives considered:
  - Generic `NotImplementedError`: rejected because it omits method and engine identity.
  - Silent no-op fallback: rejected because it hides correctness failures.

## Decision 4: Engine Factory Resolution and Validation

- Decision: Keep configuration-driven selection through `DRIVER_ENGINE` but tighten validation by failing fast for unknown identifiers before scenario execution.
- Rationale: Explicit failure avoids accidental defaulting that can mask misconfiguration in CI matrix runs.
- Alternatives considered:
  - Current soft default-to-playwright behavior: rejected for ambiguity in multi-engine execution.
  - Dynamic plugin loading from package names: rejected as unnecessary complexity for current scope.

## Decision 5: Selenium Scope for This Iteration

- Decision: Keep Selenium in design and contract scope (factory branch and implementation outline) but do not include Selenium in executable parity commands for this cycle.
- Rationale: Current project runtime and scripts already validate Playwright and Vibium parity; this matches user instruction while preserving forward-compatible architecture.
- Alternatives considered:
  - Remove Selenium from contract entirely: rejected because it conflicts with feature requirements and future parity goals.
  - Fully execute Selenium in CI now: rejected due to explicit request to avoid running Selenium in this planning/execution path.

## Decision 6: Migration Strategy from Existing Ports

- Decision: Introduce `IAutomationEngine` as a higher-level orchestration port and adapt existing `IBrowser`/`IPage`/`IElement` implementations underneath it where practical.
- Rationale: This minimizes churn in existing adapters while enabling intent-level flows for tasks and Page Objects.
- Alternatives considered:
  - Replace all existing ports immediately: rejected as high-risk refactor with unnecessary blast radius.
  - Keep both models indefinitely with no bridge strategy: rejected because long-term duplication increases maintenance cost.

## Decision 7: Complete Capability Inventory for Existing Interfaces

- Decision: Treat the current Layer 5 port surface as mandatory baseline capabilities and explicitly map all of them into `IAutomationEngine` behavior.
- Rationale: The existing interfaces represent already-used framework behavior; omitting any capability would cause regression risk during migration.
- Baseline capabilities identified from current interfaces:
  - `IBrowser`: `newPage`, `close`
  - `IPage`: `goto`, `title`, `find`
  - `IElement`: `textContent`, `isVisible`, `click`
- Alternatives considered:
  - Inventory only high-level categories: rejected because category-only coverage can hide missing method parity.
  - Delay inventory until implementation: rejected because missing capabilities should be discovered in planning, not during coding.

## Decision 8: Required IAutomationEngine Capability Set

- Decision: Define a concrete capability set that covers both baseline port parity and new intent-level contract expectations.
- Rationale: A complete, named capability set enables strict contract testing and prevents scope ambiguity.
- Required capabilities for `IAutomationEngine`:
  - Navigation: `openUrl`, `getTitle`
  - Interaction: `click`, `enterText`, `hover`
  - Query/state: `getTextContent`, `isVisible`
  - Waiting: `waitForVisible`
  - Frame/window: `switchToFrame`, `switchToWindow`
  - Lifecycle: `newPage`, `close`
- Compatibility mapping to existing interfaces:
  - `goto` -> `openUrl`
  - `title` -> `getTitle`
  - `find + click` -> `click`
  - `find + textContent` -> `getTextContent`
  - `find + isVisible` -> `isVisible`
  - `newPage` -> `newPage`
  - `close` -> `close`
- Alternatives considered:
  - Keep discovery/query methods only on low-level interfaces: rejected because Layer 3/4 would remain coupled to adapter details.
  - Add window/frame only as optional methods: rejected because frame/window were explicit core feature requirements.

## Decision 9: Adapter File Decomposition per Engine

- Decision: Permit and prefer multi-file adapter decomposition per engine, with dedicated files for browser, page, and element responsibilities where applicable.
- Rationale: Splitting concerns by abstraction level improves maintainability and keeps mapping between interfaces and implementations explicit.
- Alternatives considered:
  - Single monolithic adapter per engine: rejected due to increasing coupling and harder unit-test isolation.
  - Force decomposition for every engine immediately: rejected to allow incremental migration while still defining preferred structure.
