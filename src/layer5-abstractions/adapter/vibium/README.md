# Layer 5 — Vibium Adapter

## Role
Implements `IAutomationEngine` (and supporting page/element adapters) using
the **Vibium** automation library. The Vibium API closely mirrors Playwright,
so this adapter maps the shared automation surface using the same structural
patterns as the Playwright adapter.

## Dependencies
- `vibium` (runtime, vendored): dynamically imported via `launch()` to support
  varying module export shapes (`launch`, `browser`, `default.launch`).
- `../../ports/iautomation-engine` — the port contract this adapter satisfies.
- `../../../support/exception-manager` — `createUnsupportedCapabilityError`
  for Playwright-specific methods (`startTrace`, `stopTrace`,
  `useDevtoolsProtocol`) that are not available in Vibium.

## Contract
No Vibium-specific types may propagate above this directory. Internal
interface types (`VibiumBrowser`, `VibiumContext`, `VibiumPage`, etc.) are
declared locally to shape the dynamic import without coupling callers to the
vendor module. The `vibium` package lives under `vendor/vibium/` and is
resolved via the repository's module resolution configuration.
