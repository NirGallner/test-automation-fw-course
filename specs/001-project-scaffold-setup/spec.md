# Feature Specification: Project Scaffold Setup

**Feature Branch**: `006-scaffold-hello-world`  
**Created**: 2026-04-14  
**Status**: Draft  
**Input**: User description: "the project is currently empty. I want you to prepare it for work. Meaning - package.json creation, install dependencies, build folders, create demo test hello world that is mapped all the way from feature file to page object. the test just prints to the log"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Runs the Hello World Test (Priority: P1)

A developer who has just cloned the repository wants to verify the scaffold is
working end-to-end. They run a single command and the hello world scenario executes,
printing a log message — confirming that the full BDD chain (feature file → step
definition → business flow → page object → logger) is wired together correctly.

**Why this priority**: Without a runnable test, it is impossible to confirm that any
part of the scaffold works. This story is the top-level acceptance proof for the
entire scaffold.

**Independent Test**: Can be fully tested by running the test suite from the project
root and verifying that the console/log output contains the hello world message and
the Cucumber report shows one passing scenario. No browser, web server, or external
service is required.

**Acceptance Scenarios** *(Gherkin — written into `features/*.feature`)*:

1. **Given** the project dependencies have been installed, **When** the test suite is
   executed, **Then** the hello world scenario passes with a visible log entry in the
   test output.
2. **Given** the test suite has run, **When** the output is inspected, **Then** exactly
   one scenario is reported as passed and zero scenarios are reported as failed.

**API Pre-Check** *(Constitution VII — if an API equivalent exists)*:
- N/A — this scenario has no network dependency; the log output is the only observable.

---

### User Story 2 - Developer Navigates the Project Structure (Priority: P2)

A developer (new or returning) wants to know where to put a new feature file, where
to write step definitions, and where to create page objects. The folder structure must
be self-documenting — each concern lives in its own clearly named directory.

**Why this priority**: Without a predictable folder structure, every contributor is
forced to infer conventions, slowing onboarding and increasing the risk of cross-layer
imports.

**Independent Test**: Can be fully tested by inspecting the repository after scaffold
completes. A developer should be able to identify `features/`, `src/steps/`,
`src/flows/`, `src/pages/`, `src/drivers/`, `src/api/`, and `src/utils/` directories
without any documentation, and the hello world files in each layer serve as working
examples.

**Acceptance Scenarios**:

1. **Given** the scaffold is complete, **When** the developer lists the project
   directories, **Then** all mandatory layers (`features/`, `src/steps/`, `src/flows/`,
   `src/pages/`, `src/drivers/`, `src/api/`, `src/utils/`) exist.
2. **Given** the scaffold is complete, **When** the developer opens any hello world
   source file, **Then** they can trace the dependency chain downward to the next layer
   without finding any cross-layer import.

---

### User Story 3 - Developer Installs Dependencies in a Fresh Environment (Priority: P3)

A developer on a new machine (or CI agent) wants to install all required packages with
a single command and have the project immediately ready to run tests.

**Why this priority**: Installation must be repeatable and deterministic. Failing
installs prevent all downstream work but are lower-priority than the runnable test story
because they are a pre-condition that is usually satisfied first.

**Independent Test**: Can be fully tested by deleting `node_modules`, running the
install command, and then immediately running the hello world test — end-to-end with no
manual intervention.

**Acceptance Scenarios**:

1. **Given** an empty `node_modules` directory, **When** the install command is
   executed, **Then** all packages are installed without errors within 120 seconds.
2. **Given** all packages are installed, **When** the hello world test command is run,
   **Then** the test passes without any missing-module errors.

---

### Edge Cases

- What happens when the test is run before `npm install` has been executed? The runner
  exits with a clear error (missing module), not a silent failure.
- What happens when the log output is missing (e.g., logger is misconfigured)? The
  scenario step that asserts the log entry fails explicitly rather than passing silently.
- How does the system handle a duplicate hello world step definition registered twice?
  Cucumber reports an ambiguous step error — the scaffold must not register duplicate
  bindings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST have a `package.json` that declares all runtime and
  development dependencies needed to run the Cucumber BDD suite with Playwright as
  the driver adapter.
- **FR-002**: The project MUST define an npm script that executes the full Cucumber
  test suite with a single command (e.g., `npm test`).
- **FR-003**: The project MUST include a hello world `.feature` file written in Gherkin
  syntax with at least one scenario.
- **FR-004**: The project MUST include a step definition class that maps each Gherkin
  step in the hello world feature to a method on a business flow class (no direct page
  object calls from step definitions).
- **FR-005**: The project MUST include a business flow class that delegates the hello
  world action to a page object method.
- **FR-006**: The project MUST include a page object class that, when its hello world
  method is called, emits a structured log message via the shared logger (no
  `console.log`).
- **FR-007**: The project MUST include a shared logger instance (`src/utils/logger.ts`)
  backed by `pino`, used by all layers.
- **FR-008**: The project MUST include a Playwright driver adapter that implements the
  driver interface, even if the hello world test does not launch a browser.
- **FR-009**: Folder structure MUST contain all four mandatory architecture layers:
  `features/`, `src/steps/`, `src/flows/`, `src/pages/`, plus `src/drivers/`,
  `src/api/`, and `src/utils/`.
- **FR-010**: All TypeScript source files MUST compile without errors under strict mode.
- **FR-011**: The hello world test MUST produce a Cucumber HTML report in the `reports/`
  directory after execution.

### Key Entities

- **Feature File**: A Gherkin document describing one user-observable behaviour; lives
  in `features/`.
- **Step Definition**: A class that binds Gherkin step text to business flow
  invocations; lives in `src/steps/`.
- **Business Flow**: A class encapsulating a multi-step user action without any
  knowledge of DOM elements or driver APIs; lives in `src/flows/`.
- **Page Object**: A class exposing atomic, element-level interactions for a single
  screen or component; lives in `src/pages/`.
- **Driver Adapter**: A class implementing the driver interface for a specific
  automation tool (Playwright); lives in `src/drivers/`.
- **Logger**: A singleton `pino` logger instance shared across all layers; lives in
  `src/utils/logger.ts`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can complete installation and run the hello world test in
  under 2 minutes from a clean clone on a machine with Node.js already installed.
- **SC-002**: The hello world test suite produces exactly one passing scenario and zero
  failing scenarios in the Cucumber report.
- **SC-003**: The test output contains at least one structured log entry originating
  from the page object layer, visible in the terminal during the test run.
- **SC-004**: A new developer can identify the correct directory for a new feature file,
  step definition, flow, and page object within 5 minutes using only the existing
  scaffold as a guide (no external documentation required).
- **SC-005**: TypeScript compilation completes without errors or warnings within
  30 seconds on a standard developer machine.

## Assumptions

- Node.js (LTS) is pre-installed on the developer's machine or CI agent; the scaffold
  does not manage Node.js installation.
- The hello world test does not open a browser; it exercises the full four-layer chain
  but terminates at the page object log call rather than launching Playwright's browser
  context, keeping the scenario dependency-free for scaffold verification.
- `pino-pretty` is used for human-readable log output during local development; raw
  JSON output (pino default) is used in CI.
- TypeScript compilation is invoked as part of the test run via `ts-node` or an
  equivalent TypeScript execution layer — no separate build step is required to run
  tests locally.
- The Cucumber HTML reporter used is the one already evidenced by `reports/cucumber-report.html`
  in the project (`cucumber-html-reporter` or equivalent).
- ESLint configuration with `@typescript-eslint` is part of the scaffold but linting
  is not required to pass as a pre-condition for the hello world test run.
