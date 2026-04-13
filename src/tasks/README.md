# Layer 3 — Tasks (Business Interactions)

## Role
Business Interaction classes that coordinate one or more Page Objects to
achieve an end-to-end user goal. Step Definitions MUST call into this layer
rather than interacting with Page Objects directly.

## Contents
| File | Responsibility |
|---|---|
| `home-smoke.task.ts` | Smoke-test workflow for the home page (open, inspect title, check content). |

## Dependencies
- `../layer4-page-objects/home.page` — Page Object composed by `HomeSmokeTask`.
- `../layer5-abstractions/ports/iautomation-engine` — engine contract passed
  in at construction time.

## Contract
Task classes MUST express user goals (e.g. "open the home page and verify it
loads"). They MUST compose Page Objects through `IAutomationEngine` and MUST
NOT call Playwright, Vibium, or Selenium APIs directly. Task methods MUST
remain synchronous-style at the call site (no `async`/`await`; use Promise
chaining) in accordance with the constitution's async-surface rule.
