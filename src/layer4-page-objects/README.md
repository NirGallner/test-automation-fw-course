# Layer Ownership Notes

## Layer 3 Tasks

- Location: src/tasks
- Responsibility: orchestrate page-scoped business intent.
- Dependency rule: use layer 4 and layer 5 contracts only.

## Layer 4 Page Objects

- Location: src/layer4-page-objects
- Responsibility: encapsulate one-page atomic behavior and queries.
- Dependency rule: depend only on layer 5 ports.

## Layer 5 Abstractions and Adapters

- Location: src/layer5-abstractions
- Responsibility: define tool-agnostic ports and tool-specific adapters.
- Dependency rule: only adapters may import automation engine libraries.

## Layer 2 Step Definitions

- Location: src/layer2-step-definitions
- Responsibility: translate Gherkin to business-task calls.
- Dependency rule: no direct Playwright imports.
