# Layer 2 - Step Definitions

## Ownership

This layer maps Gherkin steps to page-scoped business tasks.

## Rules

- Depend on layer 3 tasks and layer 5 ports only.
- Do not import Playwright types directly.
- Keep each step thin and business-oriented.
