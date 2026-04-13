import { LifecycleLogger } from './lifecycle-logger';

/** Describes which fixture categories a scenario has opted into. */
export interface FixtureRequest {
  /** When true, a shared globalServer worker fixture should be allocated. */
  usesGlobalServer: boolean;
  /** When true, a per-scenario testDatabase fixture should be allocated. */
  usesScenarioDatabase: boolean;
}

/** Holds references to fixtures that were successfully allocated for a scenario. */
export interface FixtureContext {
  /** Present when the globalServer worker fixture is active for this scenario. */
  globalServer?: {
    name: 'globalServer';
    allocated: true;
  };
  /** Present when the testDatabase scenario fixture is active for this scenario. */
  testDatabase?: {
    name: 'testDatabase';
    allocated: true;
  };
}

/**
 * Manages the allocation and cleanup of test fixtures that span worker and
 * scenario scopes. Fixture state is tracked as class-level statics so that a
 * single worker fixture is shared across all scenarios within the same worker
 * process, matching Cucumber's lifecycle model.
 */
export class AutomationFixtureManager {
  private static workerFixtureAllocated = false;

  /**
   * Allocates the worker-scoped `globalServer` fixture for the first scenario
   * that requests it. Subsequent calls for the same worker are no-ops.
   *
   * @param scenarioName - Name of the requesting Cucumber scenario.
   * @param request - Describes which fixtures the scenario needs.
   */
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

  /**
   * Allocates per-scenario fixtures based on the request and the current worker
   * state. Returns a `FixtureContext` describing which fixtures are active.
   *
   * @param scenarioName - Name of the requesting Cucumber scenario.
   * @param request - Describes which fixtures the scenario needs.
   */
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

  /**
   * Releases per-scenario fixtures allocated by `allocateScenarioFixtures`.
   *
   * @param scenarioName - Name of the Cucumber scenario being cleaned up.
   * @param request - The request that was used to allocate fixtures.
   * @param context - The context returned by `allocateScenarioFixtures`.
   */
  public static async cleanupScenarioFixtures(
    scenarioName: string,
    request: FixtureRequest,
    context: FixtureContext
  ): Promise<void> {
    if (request.usesScenarioDatabase && context.testDatabase) {
      LifecycleLogger.logFixture('testDatabase End', scenarioName, true);
    }
  }

  /**
   * Releases the worker-scoped `globalServer` fixture at the end of the worker
   * lifecycle. Resets the allocation flag so the fixture could be re-acquired
   * if tests run again in the same process.
   */
  public static async cleanupWorkerFixtures(): Promise<void> {
    if (!AutomationFixtureManager.workerFixtureAllocated) {
      return;
    }

    LifecycleLogger.log('FixtureEnd', 'globalServer End');
    AutomationFixtureManager.workerFixtureAllocated = false;
  }

  /**
   * Records that a driver session has started for the given scenario.
   * Delegates to `LifecycleLogger` for consistent event sequencing.
   *
   * @param scenarioName - Cucumber scenario that owns the driver session.
   */
  public static noteDriverSessionStarted(scenarioName: string): void {
    LifecycleLogger.log('DriverStart', 'driver session started', scenarioName);
  }

  /**
   * Records that a driver session has been closed.
   * @param scenarioName - Optional scenario name for session-scoped logging.
   */
  public static noteDriverSessionClosed(scenarioName?: string): void {
    LifecycleLogger.log('DriverEnd', 'driver session closed', scenarioName);
  }
}