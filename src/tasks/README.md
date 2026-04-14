# Layer 3 - Business Interaction Tasks

## Role

This layer expresses complete user journeys by composing one or more Page
Objects from Layer 4. Each Task class represents a named business goal such as
"smoke the home page" or "purchase a product". Step Definitions in Layer 2 call
these classes and MUST NOT interact with Page Objects directly.

## Contract

- Every Task class depends on `IAutomationEngine` and Layer 4 Page Objects.
- No Playwright or other engine-specific types may appear in this layer.
- Task methods express **user-facing goals**, not low-level UI steps.
- Layers 1–4 MUST NOT use `async`/`await`; use Promise chaining instead.

## Files

| File | Business Goal |
|------|--------------|
| [`home-smoke.task.ts`](./home-smoke.task.ts) | Smoke-test the home page (navigate, title, visibility) |
| [`add-to-cart.task.ts`](./add-to-cart.task.ts) | Purchase flow: search → select product → add to cart → verify |

## Dependency Direction

```
Layer 1 (Gherkin)
  ↓
Layer 2 (Step Definitions)
  ↓
Layer 3 (Tasks ← this layer)
  ↓
Layer 4 (Page Objects)
  ↓
Layer 5 (IAutomationEngine port)
  ↓
Layer 5 Adapter (Playwright / Selenium / Vibium)
```
