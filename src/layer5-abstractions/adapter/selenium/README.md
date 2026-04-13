# Layer 5 — Selenium Adapter (Stub)

## Role
Provides a **stub implementation** of `IAutomationEngine` for the Selenium
engine. All methods currently throw `createUnsupportedCapabilityError`,
allowing capability-parity contracts to verify which methods are expected
without requiring a live Selenium environment.

## Dependencies
- `../../../support/exception-manager` — `createUnsupportedCapabilityError`.
- `../../ports/iautomation-engine` — the port contract this stub satisfies structurally.

## Contract
When a real Selenium integration is added, all methods in
`selenium-browser.adapter.ts` MUST be implemented rather than replaced
wholesale. The `SeleniumPageAdapter` and `SeleniumElementAdapter` stubs follow
the same pattern and MUST be updated in tandem. No Selenium WebDriver types
may be exposed above this directory boundary.
