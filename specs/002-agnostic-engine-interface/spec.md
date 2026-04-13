# Feature Specification: Agnostic Automation Engine Interface Redesign

**Feature Branch**: `002-before-specify-hook`  
**Created**: 2026-04-13  
**Status**: Draft  
**Input**: User description: "Redesign the interface of the agnostic tool approach. Cross-tool research on Playwright, Vidium, and Selenium operations. Define a strictly typed IAutomationEngine with intent-based method names. Include unique single-tool capabilities for parity and require unsupported engines to fail with descriptive not-implemented errors. Provide concrete implementation outlines and engine factory selection via environment variable."

## Clarifications

### Session 2026-04-13

- Q: Should Selenium be included in executable parity for this iteration? -> A: Keep Selenium in contract/design scope only; execute parity on Playwright and Vibium.
- Q: What is the canonical engine name for the vendored adapter? -> A: Vibium is canonical everywhere.
- Q: Should adapters be decomposed per engine into browser/page/element files? -> A: Yes, required with incremental migration allowed.
- Q: What runtime target should parity smoke workflows meet? -> A: <=5 minutes total.

## User Scenarios & Testing *(mandatory)*

Scenarios MUST describe durable business behavior. Avoid encoding transient
button names, menu labels, or exact click paths unless the wording or path is
itself a required outcome.

### User Story 1 - Execute Core Flows Across Engines (Priority: P1)

A QA engineer runs the same business scenario against different automation
engines and gets equivalent behavior for navigation, element interaction,
waiting, frame handling, and window management without changing scenario intent.

**Why this priority**: Cross-engine consistency is the primary value of an
agnostic automation layer; without it, the abstraction does not reduce risk or
porting effort.

**Independent Test**: Can be fully tested by executing the same representative
workflow on each engine and verifying consistent outcomes for all shared
capabilities.

**Acceptance Scenarios**:

1. **Given** a shared scenario that uses only common capabilities, **When** the
  scenario runs on Playwright and Vibium engines, **Then** each run completes
  with equivalent business results.
2. **Given** the scenario requires navigation, click, text entry, hover,
   waiting, frame switching, and window switching, **When** each engine is
   selected, **Then** each operation succeeds through the same intent-level
   contract.

---

### User Story 2 - Preserve Full Capability Parity (Priority: P2)

A framework maintainer defines and evolves a single strictly typed automation
contract that includes both shared capabilities and unique single-engine
capabilities, so advanced features are not lost when using the abstraction.

**Why this priority**: The abstraction must remain expressive enough for
real-world needs; omitting unique capabilities creates hidden lock-in and
rework later.

**Independent Test**: Can be tested by validating the contract includes
single-tool capabilities and that unsupported engines return descriptive
not-implemented errors for those capabilities.

**Acceptance Scenarios**:

1. **Given** a capability that exists in only one engine, **When** that
   capability is defined in the contract, **Then** compatible engines execute
   it and non-compatible engines fail with a descriptive unsupported message.
2. **Given** strict typing rules for the automation contract, **When** an engine
   implementation is incomplete or mismatched, **Then** contract validation
   fails before runtime.

---

### User Story 3 - Switch Engines by Configuration (Priority: P3)

A release engineer can switch the active automation engine by environment
configuration so test execution can be routed to Playwright, Vibium, or
Selenium without editing scenario logic.

**Why this priority**: Configuration-driven engine selection supports CI matrix
execution, migration programs, and controlled fallback strategies.

**Independent Test**: Can be tested by changing the engine environment variable
across three values and confirming the corresponding engine implementation is
selected each time.

**Acceptance Scenarios**:

1. **Given** environment configuration selects Playwright, **When** test
   execution starts, **Then** the Playwright engine implementation is used.
2. **Given** environment configuration selects Vibium or Selenium, **When** test
   execution starts, **Then** the matching engine implementation is used without
   changes to user scenarios.
3. **Given** an unknown engine identifier, **When** execution starts, **Then**
   the system fails fast with a clear configuration error.

### Edge Cases

- What happens when a unique single-engine capability is invoked on a different
  engine? The call fails with a descriptive unsupported message naming the
  method and engine.
- How does the system handle a stale frame or closed window context? The engine
  reports a clear recoverable error and does not silently continue.
- What happens when waiting conditions are not satisfied in time? The call
  fails with timeout context that identifies the awaited condition.
- How does the system behave if a selector matches multiple elements for an
  intent requiring a single target? The engine returns deterministic ambiguity
  feedback.

## Requirements *(mandatory)*

### Constitution Alignment *(mandatory)*

- **Layers affected**: Layer 3 task orchestration contracts, Layer 4 page object
  interaction surfaces, and Layer 5 automation abstractions/adapters are
  updated. Layer 1 and Layer 2 behavior wording remains business-focused and
  tool-agnostic.
- **Flow preservation**: The feature preserves the existing Gherkin -> Step
  Definitions -> Business Interactions -> POM -> Tool-Agnostic Abstractions
  sequence.
- **New architecture elements**: Introduces a unified `IAutomationEngine` port,
  three concrete engine adapters, and an engine factory for runtime selection.
- **AI healing / DiscoveryMode / smart reruns**: Out of scope for this feature;
  existing failure routing remains unchanged.
- **Tool isolation rule**: No engine-specific primitives are exposed in Layers
  1 through 3.
- **Cucumber resilience**: Step phrasing remains intent-based and independent of
  transient UI wording changes.

### Functional Requirements

- **FR-001**: The system MUST define a strictly typed `IAutomationEngine`
  contract using intent-based method names for user actions.
- **FR-002**: The contract MUST include shared capabilities for navigation,
  element interaction (click, text entry, hover), waiting strategies, frame
  handling, and window management.
- **FR-003**: Intent-level method names MUST be user-action oriented (for
  example, "enter text") and MUST NOT encode vendor-specific terminology.
- **FR-004**: The contract MUST include unique single-engine capabilities when
  they exist in one supported engine so feature parity is preserved.
- **FR-005**: For any unique capability not supported by a selected engine, that
  engine MUST fail with a descriptive not-implemented error in the format:
  "[MethodName] is not supported by the [ToolName] engine."
- **FR-006**: The system MUST provide three concrete engine implementations:
  Playwright engine, Vibium engine, and Selenium engine.
- **FR-007**: All engine operations MUST support asynchronous execution semantics
  so interaction flows can be awaited deterministically.
- **FR-008**: The system MUST provide a factory mechanism that selects the
  active engine based on environment configuration at runtime.
- **FR-009**: The factory MUST reject unsupported engine identifiers with a
  clear validation error before test execution proceeds.
- **FR-010**: Existing scenarios and business interactions using shared
  capabilities MUST run without behavioral regression when switching engines.
- **FR-011**: Each engine adapter MUST use decomposed browser/page/element
  implementation files (or equivalent separated classes), and migration to this
  structure MAY be completed incrementally per engine.

### Key Entities

- **Automation Engine Contract**: A strictly typed definition of intent-level
  capabilities required by the framework.
- **Engine Capability**: A contract method representing either a shared action
  across engines or a unique single-engine action.
- **Engine Implementation**: A concrete Playwright, Vibium, or Selenium adapter
  that fulfills the contract.
- **Unsupported Capability Error**: A standardized error outcome returned when a
  capability is unavailable in the selected engine.
- **Engine Factory Selection**: Runtime configuration input and resolution logic
  that maps environment values to a concrete engine.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of defined shared capability categories (navigation,
  interaction, waiting, frame, window) are available through one contract and
  executable in each supported engine.
- **SC-002**: Switching the selected engine via environment configuration
  requires zero edits to existing scenario text and step intent mappings for
  shared flows.
- **SC-003**: 100% of unsupported unique capability calls fail with the
  standardized descriptive message format and identify both method and engine.
- **SC-004**: Contract conformance checks identify all missing or mismatched
  engine methods before runtime execution.
- **SC-005**: Primary cross-engine smoke workflows complete successfully on
  Playwright and Vibium with no critical behavioral regressions in <=5 minutes
  total runtime.

## Assumptions

- Playwright and Vibium are executable engines for this iteration; Selenium
  remains in design/contract scope and implementation outline scope only.
- The existing layered architecture and current scenario corpus remain in place
  and are not fundamentally restructured by this feature.
- Unique single-engine capabilities are expected to be a minority of the
  contract and are explicitly documented.
- Runtime environment configuration is available and trusted as the engine
  selection input.
- Standardized unsupported-capability errors are sufficient for initial parity
  signaling; advanced fallback behavior is out of scope.
