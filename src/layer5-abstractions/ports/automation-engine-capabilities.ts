export type EngineType = 'playwright' | 'vibium' | 'selenium';

export type CapabilityCategory =
  | 'navigation'
  | 'interaction'
  | 'query'
  | 'waiting'
  | 'frame'
  | 'window'
  | 'lifecycle'
  | 'unique';

export type CapabilitySupportLevel = 'shared' | 'unique';

export interface EngineCapability {
  methodName: string;
  category: CapabilityCategory;
  supportLevel: CapabilitySupportLevel;
  supportedEngines: EngineType[];
}

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

export const UNIQUE_CAPABILITIES: ReadonlyArray<EngineCapability> = [
  { methodName: 'startTrace', category: 'unique', supportLevel: 'unique', supportedEngines: ['playwright'] },
  { methodName: 'stopTrace', category: 'unique', supportLevel: 'unique', supportedEngines: ['playwright'] },
  { methodName: 'useDevtoolsProtocol', category: 'unique', supportLevel: 'unique', supportedEngines: ['playwright'] }
];