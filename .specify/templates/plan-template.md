# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [e.g., library/cli/web-service/mobile-app/compiler/desktop-app or NEEDS CLARIFICATION]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Confirm the design preserves Hexagonal Architecture: core logic depends only
  on ports/domain types and infrastructure is isolated behind adapters.
- Identify all affected layers (Gherkin, Step Definitions, Business
  Interactions, POM, Tool-Agnostic Abstractions) and verify each dependency
  points downward only.
- Confirm Gherkin scenarios describe business behavior and outcomes rather than
  brittle UI copy, element labels, or exact navigation paths unless those are
  explicitly part of the requirement.
- List new or changed interfaces such as `IBrowser`, `IPage`, `IElement`,
  provider strategies, or driver registries; explain why no Playwright-specific
  types leak above Layer 5.
- Describe whether the feature requires Decorator, Strategy, Builder, Chain of
  Responsibility, or Singleton/Registry patterns and where each pattern lives.
- Document ExceptionManager behavior for this feature, including when healing,
  exploration, smart reruns, or hard failure apply.
- Confirm TypeScript strict mode remains satisfied with no `any` and typed
  generics for reusable action abstractions.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── core/
│   ├── domain/
│   ├── ports/
│   └── tasks/
├── application/
│   ├── step-definitions/
│   └── services/
├── adapters/
│   ├── browser/
│   ├── ai/
│   └── observability/
├── ui/
│   └── page-objects/
└── support/
  ├── builders/
  ├── exceptions/
  └── registry/

tests/
├── gherkin/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., Playwright type exposed above Layer 5] | [current need] | [why a port/adapter boundary could not satisfy it] |
| [e.g., Global registry introduced] | [specific problem] | [why dependency injection or explicit composition was insufficient] |
