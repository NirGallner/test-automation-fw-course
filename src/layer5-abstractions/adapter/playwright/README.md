# Layer 5 — Playwright Adapter

## Role
Implements `IAutomationEngine` (and supporting page/element adapters) using
**Playwright's Chromium driver**. This is the primary adapter used for local
and CI execution.

## Dependencies
- `playwright` (runtime): `chromium`, `Browser`, `BrowserContext`, `Frame`,
  `Page`, `Locator`.
- `../../ports/iautomation-engine` — the port contract this adapter satisfies.
- `../../../support/exception-manager` — `createUnsupportedCapabilityError`
  for capabilities that are Playwright-specific and need a guard.

## Contract
No Playwright-specific types (`Browser`, `Page`, `Locator`, etc.) may leak
above this directory boundary. Higher layers MUST interact exclusively through
`IAutomationEngine`, `IPage`, and `IElement` port interfaces.
Playwright-unique capabilities (`startTrace`, `stopTrace`,
`useDevtoolsProtocol`) are implemented here and documented as unavailable
on other adapters.
