# Layer 5 — Ports

## Role
This directory defines the **tool-agnostic port interfaces** for the automation
stack. Every interface here is a formal contract that higher-level layers
(Gherkin, Step Definitions, Business Interactions, Page Objects) program
against. Adapter implementations satisfy these contracts from the
`adapter/` sibling directory.

## Dependencies
- No runtime dependencies on automation tools (Playwright, Selenium, Vibium).
- `automation-engine-capabilities.ts` provides the shared type vocabulary
  (`EngineType`, `CapabilityCategory`, `CapabilitySupportLevel`) used by both
  ports and adapters.
- `IElement` ← `IPage` ← `IBrowser` form a dependency chain; `IAutomationEngine`
  provides the unified engine surface consumed directly by `DriverRegistry`.

## Contract
Interfaces MUST NOT reference any Playwright, Vibium, or Selenium types.
Any change that introduces a framework-specific type into these files is a
constitution violation (Principle IV).
