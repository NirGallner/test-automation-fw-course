# Feature Specification: Base Project Scaffold

**Feature Branch**: `001-base-project-scaffold`  
**Created**: 2026-04-13  
**Status**: Draft  
**Input**: User description: "Build a project from scratch - read the constitution.md to understand the tooling. Create a base project, include typescript best practices, include gitignore, add playwright with config best practices, create a basic playwright test for making sure it is complete"

## Clarifications

### Session 2026-04-13

- Q: For the smoke scenario target, which reliability strategy should the spec require? -> A: Use `https://playwright.dev` by default, but allow one documented fallback URL.
- Q: For Playwright retries in this scaffold, what exact policy should the spec require? -> A: `retries: 2` in CI and `0` locally.
- Q: For Playwright reporting, which artifact policy should the spec require by default? -> A: HTML + JUnit XML.
- Q: If both the default smoke URL and fallback URL are unreachable, what behavior should be required? -> A: Fail immediately with a clear installation/network troubleshooting message.
- Q: For the minimum Node.js version guardrail, which policy should the spec require? -> A: Require `engines.node >=20` and fail install on mismatch (`engine-strict` behavior in CI/bootstrap).

## User Scenarios & Testing *(mandatory)*

Scenarios MUST describe durable business behavior. Avoid encoding transient
button names, menu labels, or exact click paths unless the wording or path is
itself a required outcome.

### User Story 1 - Engineer Runs a Passing Smoke Test (Priority: P1)

A QA engineer clones the repository, installs dependencies, and runs the test
suite. The baseline smoke test completes successfully, confirming the automation
stack is correctly wired from Gherkin scenarios down through tool-agnostic
adapter layers to the browser.

**Why this priority**: Validates the entire five-layer stack is operational from
the first commit. Without a passing end-to-end smoke test, no downstream
feature work can be validated.

**Independent Test**: Can be tested by running `npm test` (or equivalent) after
a clean install and observing that at least one scenario passes and the process
exits with code 0.

**Acceptance Scenarios**:

1. **Given** the repository has been cloned to a clean machine, **When** the
   engineer installs dependencies and runs the test command, **Then** the smoke
   test scenario passes and the exit code is 0.
2. **Given** the project is configured for strict TypeScript, **When** the
   TypeScript compiler checks the codebase, **Then** zero type errors are
   reported.
3. **Given** a browser engine is available, **When** the smoke test runs,
   **Then** the browser opens, navigates to a known page, and the test reports
   success without manual intervention.

---

### User Story 2 - New Team Member Onboards Without Friction (Priority: P2)

A developer joining the team can understand the project layout, install the
required tooling, and contribute a new test file by following the documented
layer structure without needing verbal guidance.

**Why this priority**: Reduces ramp-up time and enforces architectural
compliance from day one.

**Independent Test**: Can be tested by verifying the project root contains a
`.gitignore`, a TypeScript configuration, a Playwright configuration, and clearly
named layer directories whose purposes are self-evident.

**Acceptance Scenarios**:

1. **Given** the repository is freshly cloned, **When** the developer reads the
   project structure, **Then** each of the five architecture layers is
   represented by a distinct directory with a clear, intent-revealing name.
2. **Given** a `.gitignore` is present, **When** the engineer runs the project,
   **Then** generated artifacts, dependency folders, and local environment
   files are not tracked by version control.
3. **Given** TypeScript strict mode is enabled, **When** a contributor writes
   code that uses `any` implicitly, **Then** the compiler rejects it immediately.

---

### User Story 3 - CI Pipeline Executes Tests Reliably (Priority: P3)

An automated CI pipeline can execute the full test run on every push without
any environment-specific manual steps, using the Playwright configuration that
enforces best practices for headless execution, retries, and reporting.

**Why this priority**: Ensures the scaffold is production-ready for team
workflows, not just local development.

**Independent Test**: Can be tested by verifying that the Playwright
configuration enables headless mode, sets a reasonable timeout, and produces a
test report artifact.

**Acceptance Scenarios**:

1. **Given** the CI environment has Node.js and the Playwright browser binaries,
   **When** the test command runs, **Then** all tests execute headlessly and
   produce a structured report.
2. **Given** a test fails transiently, **When** the Playwright retry setting is
   active, **Then** the test is retried the configured number of times before
   being marked as failed.

---

### Edge Cases

- What happens when required browser binaries are not installed? The test run
  produces a clear, actionable error message directing the engineer to install
  them.
- How does the system handle a missing environment configuration file? The TypeScript
  config and Playwright config contain safe defaults so the suite runs without
  a local override file.
- What happens when `npm install` is run in a Node.js version below the minimum
  supported version? An engines field in `package.json` warns the engineer.
- What happens when both the default smoke URL and the fallback URL are
  unreachable? The scenario fails immediately with a clear troubleshooting
  message covering network access and target availability checks.

## Requirements *(mandatory)*

### Constitution Alignment *(mandatory)*

**Layers affected**: All five layers are introduced in this scaffold. This
feature creates the initial directory structure and wiring for each layer:

- **Layer 1 (Gherkin)**: A single `.feature` file with the smoke test scenario.
- **Layer 2 (Step Definitions)**: Step definition file that translates the
  Gherkin scenario into page-object business interaction calls.
- **Layer 3 (Business Interactions / Tasks)**: Page-scoped business
  interactions are defined alongside each Page Object; no single cross-page
  orchestrator class is allowed.
- **Layer 4 (Page Object Model)**: A minimal Page Object that exposes atomic
  navigation and state-query actions plus page-level business interaction
  methods.
- **Layer 5 (Tool-Agnostic Abstractions)**: Interface definitions (`IBrowser`,
  `IPage`, `IElement`) and a Playwright adapter that implements them.

**New ports and adapters**:
- `IBrowser`, `IPage`, `IElement` ports (interfaces) introduced in Layer 5.
- A Playwright adapter implementing those ports, confined to the adapter layer.
- A driver registry / factory to resolve the correct adapter at runtime.

**AI healing, DiscoveryMode, smart reruns**: Out of scope for this scaffold.
The `ExceptionManager` placeholder MUST be introduced so subsequent features
can wire failure paths into it without architectural refactoring.

**Playwright type isolation**: No Playwright-specific types (`Page`, `Locator`,
`Browser`) may appear in Layers 1–4. All Playwright types are encapsulated
behind the Layer 5 adapter.

**Cucumber phrasing resilience**: The smoke test scenario describes a durable
capability ("the application is reachable and the stack is operational") rather
than brittle UI copy or specific navigation steps.

### Functional Requirements

- **FR-001**: The project MUST include a `tsconfig.json` with strict mode
  enabled (`strict: true`) and settings that prevent implicit `any`, enforce
  null checks, and target a modern ECMAScript version compatible with
  Node.js LTS.
- **FR-002**: The project MUST include a `.gitignore` that excludes `node_modules`,
  TypeScript build output, Playwright report artifacts, test result files, and
  local environment override files.
- **FR-003**: The project MUST include a Playwright configuration file that sets
  headless execution as the default, defines at least one browser project
  (Chromium), configures a global timeout, sets `retries: 0` for local runs,
  sets `retries: 2` for CI runs, and configures reporting to emit both an HTML
  report and a JUnit XML artifact.
- **FR-004**: The project MUST define interface contracts for `IBrowser`, `IPage`,
  and `IElement` in the tool-agnostic abstractions layer. These interfaces MUST
  NOT import or reference any Playwright-specific types.
- **FR-005**: The project MUST include a Playwright adapter that implements the
  `IBrowser`, `IPage`, and `IElement` interfaces. All Playwright imports MUST
  be confined to this adapter.
- **FR-006**: The project MUST include a minimal `ExceptionManager` class that
  accepts a failure context and exposes a hook for escalation strategies, even
  if the initial implementation is a stub.
- **FR-007**: The project MUST include at least one Gherkin `.feature` file,
  one Step Definitions file, and one Page Object class with embedded,
  page-scoped business interaction methods that together form a passing smoke
  test. A single god-class business interaction orchestrator spanning all page
  objects MUST NOT be introduced.
- **FR-008**: The smoke test scenario MUST navigate to a publicly reachable URL
  and assert that the page title or a visible landmark is non-empty, confirming
  end-to-end stack connectivity. The default target MUST be `https://playwright.dev`,
  and the scaffold MUST define one documented fallback URL used only when the
  default target is unreachable. If both targets are unreachable, the scenario
  MUST fail immediately with an actionable troubleshooting message.
- **FR-009**: The project MUST include a `package.json` with scripts for
  installing dependencies, running the full test suite, and type-checking,
  plus an `engines` field requiring `node >=20`; CI/bootstrap execution MUST
  enforce install-time failure on engine mismatch.
- **FR-010**: All source files MUST type-check cleanly with zero errors when
  the TypeScript compiler is invoked in strict mode.

### Key Entities

- **Feature File**: A Gherkin document expressing a business scenario without
  implementation details.
- **Step Definition**: A translation unit that maps Gherkin steps to
  page-object business interaction calls.
- **Task (Business Interaction)**: A page-scoped interaction method or helper
  co-located with its Page Object that fulfills one user-facing goal without
  centralizing all flows into a single god class.
- **Page Object**: A class that encapsulates atomic interactions with a specific
  screen or component, expressed through tool-agnostic interface types.
- **Tool-Agnostic Interface**: A TypeScript interface (`IBrowser`, `IPage`,
  `IElement`) that defines what the automation layer can do without naming any
  concrete automation tool.
- **Playwright Adapter**: The concrete implementation of the tool-agnostic
  interfaces using Playwright APIs, confined entirely to the adapter layer.
- **ExceptionManager**: A centralized class that receives failure signals and
  routes them to healing, rerun, or escalation strategies.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer with Node.js LTS installed can go from a fresh clone
  to a passing test run in under 5 minutes following only the README or
  standard `npm install && npm test` convention.
- **SC-002**: The TypeScript compiler reports zero errors on the entire codebase
  when invoked in strict mode.
- **SC-003**: The smoke test suite passes 100% of the time in a local clean
  environment and in a headless CI environment without manual configuration.
- **SC-008**: Retry policy is deterministic and environment-specific: local
  execution uses `retries: 0`, and CI execution uses `retries: 2`.
- **SC-009**: Test execution produces both an HTML report artifact and a JUnit
  XML artifact in deterministic output locations for local and CI runs.
- **SC-010**: Dependency installation fails fast when the runtime Node.js
  version is below 20 in CI/bootstrap environments.
- **SC-004**: Every Playwright-specific import is isolated to the adapter layer;
  zero occurrences of Playwright types appear in Layers 1–4 source files.
- **SC-007**: Business interactions remain distributed across page-specific
  Page Object modules; no single class owns interactions for all pages.
- **SC-005**: The `.gitignore` ensures that a `git status` on a freshly built
  project shows no untracked generated files (build output, reports,
  `node_modules`).
- **SC-006**: The project structure communicates the five-layer architecture
  clearly enough that a team member can identify which directory corresponds
  to which architectural layer without additional documentation.

## Assumptions

- Node.js LTS (v20 or later) is the target runtime environment.
- Node.js engine enforcement (`>=20`) is configured to fail install on mismatch
  during CI/bootstrap workflows.
- Chromium is the primary browser for baseline validation; additional browser
  configurations may be added in future features.
- The smoke test navigates to `https://playwright.dev` as the default publicly
  reachable target and supports one documented fallback URL for reliability
  when the default target is unreachable.
- GitHub Actions is assumed as the default CI target for headless execution
  defaults; no CI workflow file is in scope for this scaffold (CI configuration
  is a separate feature).
- Cucumber.js is the BDD runner for Gherkin/Step Definition execution, as it
  is the standard JavaScript BDD framework compatible with the project's
  TypeScript constraint.
- Playwright remains the only active adapter; all interfaces are designed to be
  implementable by an alternative adapter (e.g., Cypress) without changing
  Layers 1–3.
- Mobile browser viewports and accessibility tooling are out of scope for the
  base scaffold.
- AI healing, DiscoveryMode, and smart reruns are out of scope; the
  ExceptionManager stub is introduced as an extension point only.
