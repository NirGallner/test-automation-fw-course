import { LifecycleLogger } from './lifecycle-logger';

export interface FixtureRequest {
  usesGlobalServer: boolean;
  usesScenarioDatabase: boolean;
}

export interface FixtureContext {
  globalServer?: {
    name: 'globalServer';
    allocated: true;
  };
  testDatabase?: {
    name: 'testDatabase';
    allocated: true;
  };
}

export class AutomationFixtureManager {
  private static workerFixtureAllocated = false;

  public static async allocateWorkerFixtures(
    scenarioName: string,
    request: FixtureRequest
  ): Promise<void> {
    if (!request.usesGlobalServer || AutomationFixtureManager.workerFixtureAllocated) {
      return;
    }

    LifecycleLogger.logFixture('globalServer Start', scenarioName, true);
    AutomationFixtureManager.workerFixtureAllocated = true;
  }

  public static async allocateScenarioFixtures(
    scenarioName: string,
    request: FixtureRequest
  ): Promise<FixtureContext> {
    const context: FixtureContext = {};

    if (request.usesGlobalServer && AutomationFixtureManager.workerFixtureAllocated) {
      context.globalServer = { name: 'globalServer', allocated: true };
    }

    if (request.usesScenarioDatabase) {
      LifecycleLogger.logFixture('testDatabase Start', scenarioName, true);
      context.testDatabase = { name: 'testDatabase', allocated: true };
    }

    return context;
  }

  public static async cleanupScenarioFixtures(
    scenarioName: string,
    request: FixtureRequest,
    context: FixtureContext
  ): Promise<void> {
    if (request.usesScenarioDatabase && context.testDatabase) {
      LifecycleLogger.logFixture('testDatabase End', scenarioName, true);
    }
  }

  public static async cleanupWorkerFixtures(): Promise<void> {
    if (!AutomationFixtureManager.workerFixtureAllocated) {
      return;
    }

    LifecycleLogger.log('FixtureEnd', 'globalServer End');
    AutomationFixtureManager.workerFixtureAllocated = false;
  }

  public static noteDriverSessionStarted(scenarioName: string): void {
    LifecycleLogger.log('DriverStart', 'driver session started', scenarioName);
  }

  public static noteDriverSessionClosed(scenarioName?: string): void {
    LifecycleLogger.log('DriverEnd', 'driver session closed', scenarioName);
  }
}