# Layer 4 - Page Objects

## Role

This layer encapsulates all page-scoped atomic interactions and state queries
for the store under test (https://storedemo.testdino.com/). Each class is
scoped to **one page or component** and exposes only low-level actions such as
entering text, clicking buttons, and querying visibility.

## Contract

- Every Page Object depends **only** on `IAutomationEngine` from Layer 5.
- No Playwright or other engine-specific types may appear in this layer.
- All element selectors are **private fields** following locator priority:
  `data-testid > id > name > aria-label > unique CSS selector`.
- Any method that triggers navigation MUST return the **next Page Object**
  (Page Flow Pattern), enabling type-safe, fluent flow chains.
- No business journey orchestration lives here — that belongs in Layer 3 tasks.

## Files

| File | Page / Component |
|------|-----------------|
| [`home.page.ts`](./home.page.ts) | Store home page — search, product grid |
| [`product-details.page.ts`](./product-details.page.ts) | Product details page — title, add-to-cart |
| [`cart.page.ts`](./cart.page.ts) | Cart drawer / cart page — item list, verification |

## Layer Ownership Notes

### Layer 3 Tasks

- Location: `src/tasks`
- Responsibility: orchestrate page-scoped business intent.
- Dependency rule: use Layer 4 and Layer 5 contracts only.

### Layer 4 Page Objects

- Location: `src/layer4-page-objects`
- Responsibility: encapsulate one-page atomic behavior and queries.
- Dependency rule: depend only on Layer 5 ports.

### Layer 5 Abstractions and Adapters

- Location: `src/layer5-abstractions`
- Responsibility: define tool-agnostic ports and tool-specific adapters.
- Dependency rule: only adapters may import automation engine libraries.

### Layer 2 Step Definitions

- Location: `src/layer2-step-definitions`
- Responsibility: translate Gherkin to business-task calls.
- Dependency rule: no direct Playwright imports.
