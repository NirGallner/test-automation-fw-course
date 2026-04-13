
// Register fixtures after all definitions


import { LifecycleLogger } from './lifecycle-logger';



// Dynamic fixture request: map of fixture name to options (or true/false)
export type FixtureRequest = Record<string, any>;

// Dynamic fixture context: map of fixture name to context object
export type FixtureContext = Record<string, any>;

// SOLID-compliant fixture handler interface
export interface FixtureHandler {
  name: string;
  scope: 'worker' | 'scenario';
  allocate(scenarioName: string, options?: any): Promise<any>;
  cleanup(scenarioName: string, context: any): Promise<void>;
}

/**
 * Manages the allocation and cleanup of test fixtures that span worker and
 * scenario scopes. Fixture state is tracked as class-level statics so that a
 * single worker fixture is shared across all scenarios within the same worker
 * process, matching Cucumber's lifecycle model.
 */
export class AutomationFixtureManager {
  private static registry: Map<string, FixtureHandler> = new Map();

  // Register a fixture handler
  public static register(handler: FixtureHandler) {
    this.registry.set(handler.name, handler);
  }

  // Allocate all worker-scoped fixtures requested
  public static async allocateWorkerFixtures(scenarioName: string, request: FixtureRequest): Promise<void> {
    for (const [name, options] of Object.entries(request)) {
      const handler = this.registry.get(name);
      if (handler && handler.scope === 'worker') {
        await handler.allocate(scenarioName, options);
      }
    }
  }

  // Allocate all scenario-scoped fixtures requested
  public static async allocateScenarioFixtures(scenarioName: string, request: FixtureRequest): Promise<FixtureContext> {
    const context: FixtureContext = {};
    for (const [name, options] of Object.entries(request)) {
      const handler = this.registry.get(name);
      if (handler && handler.scope === 'scenario') {
        context[name] = await handler.allocate(scenarioName, options);
      }
    }
    return context;
  }

  // Cleanup all scenario-scoped fixtures
  public static async cleanupScenarioFixtures(scenarioName: string, request: FixtureRequest, context: FixtureContext): Promise<void> {
    for (const [name, fixtureContext] of Object.entries(context)) {
      const handler = this.registry.get(name);
      if (handler && handler.scope === 'scenario') {
        await handler.cleanup(scenarioName, fixtureContext);
      }
    }
  }

  // Cleanup all worker-scoped fixtures
  public static async cleanupWorkerFixtures(): Promise<void> {
    for (const handler of this.registry.values()) {
      if (handler.scope === 'worker' && typeof handler.cleanup === 'function') {
        // For worker-scoped, we don't have a scenarioName or context, so pass empty
        await handler.cleanup('worker', {});
      }
    }
  }

  // Driver session logging (unchanged)
  public static noteDriverSessionStarted(scenarioName: string): void {
    LifecycleLogger.log('DriverStart', 'driver session started', scenarioName);
  }
  public static noteDriverSessionClosed(scenarioName?: string): void {
    LifecycleLogger.log('DriverEnd', 'driver session closed', scenarioName);
  }
}


// Register fixtures after class definition
AutomationFixtureManager.register({
  name: 'cacheServer',
  scope: 'scenario',
  async allocate(scenarioName: string, options?: any) {
    // Simulate allocation logic (could connect to a cache, etc.)
    LifecycleLogger.logFixture('cacheServer Start', scenarioName, true);
    return { name: 'cacheServer', allocated: true, options };
  },
  async cleanup(scenarioName: string, context: any) {
    if (context && context.allocated) {
      LifecycleLogger.logFixture('cacheServer End', scenarioName, true);
    }
  }
});

AutomationFixtureManager.register({
  name: 'globalServer',
  scope: 'worker',
  async allocate(scenarioName: string) {
    if (!(global as any).__globalServerAllocated) {
      LifecycleLogger.logFixture('globalServer Start', scenarioName, true);
      (global as any).__globalServerAllocated = true;
    }
    return { name: 'globalServer', allocated: true };
  },
  async cleanup(scenarioName: string) {
    if ((global as any).__globalServerAllocated) {
      LifecycleLogger.log('FixtureEnd', 'globalServer End');
      (global as any).__globalServerAllocated = false;
    }
  }
});

AutomationFixtureManager.register({
  name: 'testDatabase',
  scope: 'scenario',
  async allocate(scenarioName: string) {
    LifecycleLogger.logFixture('testDatabase Start', scenarioName, true);
    return { name: 'testDatabase', allocated: true };
  },
  async cleanup(scenarioName: string, context: any) {
    if (context && context.allocated) {
      LifecycleLogger.logFixture('testDatabase End', scenarioName, true);
    }
  }
});