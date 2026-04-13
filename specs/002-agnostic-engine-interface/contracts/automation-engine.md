# Contract: IAutomationEngine and Factory Selection

## Scope

This contract defines the intent-level automation engine interface consumed by
Layer 3 tasks and Layer 4 Page Objects. Tool-specific primitives remain
isolated in Layer 5 adapter implementations.

## Interface Contract: IAutomationEngine

```ts
export interface IAutomationEngine {
  openUrl(url: string): Promise<void>;
  click(selector: string): Promise<void>;
  enterText(selector: string, value: string): Promise<void>;
  hover(selector: string): Promise<void>;
  waitForVisible(selector: string, timeoutMs?: number): Promise<void>;
  switchToFrame(frameSelector: string): Promise<void>;
  switchToWindow(windowRef: string): Promise<void>;

  // Unique capability examples
  startTrace?(traceName?: string): Promise<void>;
  stopTrace?(): Promise<string>;
  useDevtoolsProtocol?(method: string, params?: Record<string, unknown>): Promise<unknown>;
}
```

Rules:
- Method names MUST be intent-based and vendor-neutral.
- Signatures MUST NOT expose Playwright, Vibium, or Selenium runtime types.
- Shared capabilities MUST be implemented by all supported engines.
- Unique capabilities MAY be optional in type declarations but MUST still have
  deterministic runtime behavior in every engine.

## Shared Capability Categories

Required categories:
- Navigation: URL loading and navigation verification helpers.
- Interaction: click, text entry, hover.
- Waiting: condition-based waits with explicit timeout context.
- Frame handling: switching and operating in frame contexts.
- Window management: selecting active window/tab contexts.

Conformance rule:
- Every concrete engine adapter MUST provide shared categories with equivalent
  business-level behavior.

## Unique Capability Rules

- Unique methods are declared in the same contract so parity is explicit.
- Engines that support a unique method execute it normally.
- Engines that do not support a unique method MUST throw this exact format:

`"[MethodName] is not supported by the [ToolName] engine."`

Examples:
- `"startTrace is not supported by the Vibium engine."`
- `"useDevtoolsProtocol is not supported by the Selenium engine."`

## Engine Implementation Contract

Each adapter class (`PlaywrightAutomationEngine`, `VibiumAutomationEngine`,
`SeleniumAutomationEngine`) MUST satisfy one of these for every contract method:
- Full implementation with deterministic Promise behavior, or
- Explicit standardized unsupported-capability error.

No adapter may silently no-op an unsupported method.

## Factory and Runtime Selection Contract

`DriverRegistry` (or equivalent factory service) MUST:
- Resolve engine from `DRIVER_ENGINE` runtime config.
- Accept known values: `playwright`, `vibium`, `selenium`.
- Fail fast for unknown values before scenario execution.
- Return an `IAutomationEngine` instance without leaking adapter internals.

## Execution Scope for This Iteration

- Contract and design include all three engines (`playwright`, `vibium`,
  `selenium`).
- Executable parity validation commands are limited to Playwright and Vibium.
- Selenium remains implementation-outline scope and is not run in this cycle.

## Versioning

- Contract version: `v2` (supersedes low-level-only port shape for task/POM use).
- Breaking changes require spec/plan/tasks updates and conformance tests.
