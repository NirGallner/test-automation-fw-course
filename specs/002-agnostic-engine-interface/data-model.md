# Data Model: Agnostic Automation Engine Interface Redesign

## Entity: AutomationEngineContract

- Purpose: Strictly typed contract representing all intent-level engine operations consumed by Layers 3-4.
- Fields:
  - `name: "IAutomationEngine"`
  - `version: string`
  - `methods: EngineCapability[]`
- Validation Rules:
  - Includes all shared capability categories: navigation, interaction, waiting, frame, window.
  - Method names are intent-based and vendor-neutral.
  - No tool-specific runtime types in signatures.

## Entity: EngineCapability

- Purpose: Typed representation of one callable operation in the contract.
- Fields:
  - `methodName: string`
  - `category: "navigation" | "interaction" | "waiting" | "frame" | "window" | "unique"`
  - `supportLevel: "shared" | "unique"`
  - `supportedEngines: EngineType[]`
  - `inputType: string`
  - `outputType: string`
- Validation Rules:
  - `supportLevel = "shared"` requires support in all declared engines.
  - `supportLevel = "unique"` requires explicit unsupported behavior in non-listed engines.

## Entity: EngineImplementation

- Purpose: Concrete adapter class implementing `IAutomationEngine` for one engine.
- Fields:
  - `engine: EngineType`
  - `className: string`
  - `implementedMethods: string[]`
  - `unsupportedMethods: string[]`
- Validation Rules:
  - Every contract method appears in either `implementedMethods` or `unsupportedMethods`.
  - Unsupported methods MUST throw the standardized message format.

## Entity: UnsupportedCapabilityError

- Purpose: Standardized failure payload for unsupported unique capabilities.
- Fields:
  - `methodName: string`
  - `engine: EngineType`
  - `message: string`
- Validation Rules:
  - `message` format: `"[MethodName] is not supported by the [ToolName] engine."`.
  - Error is thrown synchronously at invocation boundary or as a rejected Promise with the same message.

## Entity: EngineFactorySelection

- Purpose: Runtime input and resolution result for choosing the active engine implementation.
- Fields:
  - `rawValue: string | undefined`
  - `resolvedEngine: EngineType`
  - `defaultEngine: EngineType`
- Validation Rules:
  - Unknown `rawValue` fails fast with clear configuration validation error.
  - Resolution is deterministic and side-effect free.

## Entity: RuntimeConfig

- Purpose: Runtime settings consumed by registry and hooks.
- Fields:
  - `driverEngine: EngineType`
  - `baseUrl: string`
- Validation Rules:
  - `driverEngine` is restricted to known identifiers.
  - `baseUrl` is non-empty and valid for navigation calls.

## Value Object: EngineType

- Members:
  - `"playwright"`
  - `"vibium"`
  - `"selenium"` (design scope; execution deferred in this iteration)

## Relationships

- `AutomationEngineContract` contains many `EngineCapability` entries.
- Each `EngineImplementation` maps to one `EngineType` and realizes one `AutomationEngineContract`.
- `EngineCapability` drives `EngineImplementation` method implementation/unsupported coverage.
- `EngineFactorySelection` resolves one active `EngineImplementation` from `RuntimeConfig`.
- `UnsupportedCapabilityError` is produced by `EngineImplementation` for unsupported unique methods.

## State Transitions

- `EngineUnselected -> EngineResolved -> EngineInstantiated -> EngineClosed`
- `CapabilityInvoked -> CapabilitySucceeded`
- `CapabilityInvoked -> UnsupportedCapabilityErrorRaised`
- `CapabilityInvoked -> OperationFailed -> ExceptionManagerEscalation`
