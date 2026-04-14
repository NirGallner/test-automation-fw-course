# Tasks for 004-page-object-architecture

## Phase 1: Setup
 [X] T002 Ensure Node.js >=20 and dependencies installed (npm install)
## Phase 2: Foundational
- [ ] T005 Scaffold Cart abstraction in src/layer4-page-objects/
- [ ] T006 Scaffold Business Logic task file in src/tasks/add-to-cart.task.ts

## Phase 3: [US1] Successful Product Add to Cart
- [ ] T007 [US1] Implement HomePage selectors and methods in src/layer4-page-objects/home.page.ts
- [ ] T008 [US1] Implement ProductDetailsPage selectors and methods in src/layer4-page-objects/product-details.page.ts
- [ ] T009 [US1] Implement Cart selectors and methods in src/layer4-page-objects/cart.page.ts
- [ ] T010 [US1] Implement business logic method purchaseProduct(productName) in src/tasks/add-to-cart.task.ts
- [ ] T011 [US1] Implement step definitions mapping to business logic in src/layer2-step-definitions/add-to-cart.steps.ts
- [ ] T012 [US1] Integrate Page Objects with Layer 5 abstractions in src/layer5-abstractions/ports/
- [ ] T013 [US1] Ensure all selectors are private and follow locator priority in all Page Objects
- [ ] T014 [US1] Ensure navigation methods return next Page Object instance
- [ ] T015 [US1] Ensure no Playwright types leak above Layer 5
- [ ] T016 [US1] Document all new/modified classes, methods, and interfaces

## Final Phase: Polish & Cross-Cutting
- [ ] T017 Review and refactor for strict OOP, Page Flow Pattern, and constitution compliance
- [ ] T018 Add/Update README files for new/modified directories
- [ ] T019 Run and verify all tests (npm test)

## Dependencies
- Phase 1 must complete before Phase 2
- Phase 2 must complete before Phase 3
- All tasks in Phase 3 are required for feature completion

## Parallel Execution Examples
- T007, T008, and T009 can be implemented in parallel (different files)
- T011 and T012 can be implemented in parallel after T010
- T018 and T019 can be done in parallel after implementation

## MVP Scope
- T003, T004, T007, T008, T010, T011, T019 (core flow for "Successful Product Add to Cart")

## Independent Test Criteria
- Gherkin feature is business-focused and readable
- Step Definitions contain no selectors or raw UI logic
- All selectors are private and follow locator priority
- Navigation methods return correct Page Object
- Business Logic Layer encapsulates complete user flows
- "Successful Product Add to Cart" scenario is fully automated and passes reliably
