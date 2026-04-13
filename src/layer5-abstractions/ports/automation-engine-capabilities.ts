/** Union of all supported automation engine identifiers. */
export type EngineType = 'playwright' | 'vibium' | 'selenium';

/** Logical grouping of automation capabilities for capability matrix queries. */
export type CapabilityCategory =
  | 'navigation'
  | 'interaction'
  | 'query'
  | 'waiting'
  | 'frame'
  | 'window'
  | 'lifecycle'
  | 'unique';

/** Indicates whether a capability is available across all engines or unique to one. */
export type CapabilitySupportLevel = 'shared' | 'unique';

/**
 * Describes a single automation method and its support breadth across engines.
 * Used by test utilities and capability-guard contracts.
 */
export interface EngineCapability {
  /** Matches the method name on `IAutomationEngine`. */
  methodName: string;
  /** Functional grouping used for capability matrix reports. */
  category: CapabilityCategory;
  /** Whether the method is available on all engines or only on specific ones. */
  supportLevel: CapabilitySupportLevel;
  /** List of engines that implement this capability. */
  supportedEngines: EngineType[];
}

/**
 * Capabilities shared by all engine adapters (playwright, vibium, selenium).
 * These methods MUST be implemented by every `IAutomationEngine` adapter.
 */
export const SHARED_CAPABILITIES: ReadonlyArray<EngineCapability> = [
  { methodName: 'newPage', category: 'lifecycle', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'close', category: 'lifecycle', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'openUrl', category: 'navigation', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'getTitle', category: 'navigation', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'click', category: 'interaction', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'enterText', category: 'interaction', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'hover', category: 'interaction', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'getTextContent', category: 'query', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'isVisible', category: 'query', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'waitForVisible', category: 'waiting', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'switchToFrame', category: 'frame', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] },
  { methodName: 'switchToWindow', category: 'window', supportLevel: 'shared', supportedEngines: ['playwright', 'vibium', 'selenium'] }
];

/**
 * Capabilities exclusive to specific engine adapters.
 * Methods listed here MUST throw `createUnsupportedCapabilityError` on engines
 * that do not implement them, allowing the capability-guard contract to detect
 * mismatches at test time.
 */
export const UNIQUE_CAPABILITIES: ReadonlyArray<EngineCapability> = [
  { methodName: 'startTrace', category: 'unique', supportLevel: 'unique', supportedEngines: ['playwright'] },
  { methodName: 'stopTrace', category: 'unique', supportLevel: 'unique', supportedEngines: ['playwright'] },
  { methodName: 'useDevtoolsProtocol', category: 'unique', supportLevel: 'unique', supportedEngines: ['playwright'] }
];