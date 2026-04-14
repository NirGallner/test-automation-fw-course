# Quickstart: 004-page-object-architecture

## Prerequisites
- Node.js >=20
- npm install

## Steps
1. Write Gherkin feature in tests/layer1-gherkin/
2. Implement Step Definitions in src/layer2-step-definitions/
3. Implement Page Objects in src/layer4-page-objects/
4. Implement Business Logic in src/tasks/
5. Run tests with npm test

## Key Principles
- All selectors private, follow locator priority
- No Playwright types above Layer 5
- Navigation methods return next Page Object
- Step Definitions map only to Business Logic
- All code documented
