import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  ITestCaseHookParameter,
  setWorldConstructor,
  World
} from '@cucumber/cucumber';
import { DriverRegistry } from './driver-registry';
import { ExceptionManager } from './exception-manager';
import { HomeSmokeTask } from '../tasks/home-smoke.task';
import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';
import { AutomationFixtureManager, FixtureContext, FixtureRequest } from './lifecycle-fixtures';
import { LifecycleLogger } from './lifecycle-logger';
import { resolveRuntimeConfig } from './runtime-config';

/**
 * Cucumber World subclass that carries per-scenario state shared between
 * step definitions and lifecycle hooks. Declared here so both can access a
 * typed `this` without coupling through a separate module.
 */
class SmokeWorld extends World {
  public engine: IAutomationEngine | null = null;
  public smokeTask: HomeSmokeTask | null = null;
  public lastTitle = '';
  public scenarioName = '';
  // Dynamic fixture request/context
  public fixtureRequest: FixtureRequest = {};
  public fixtureContext: FixtureContext = {};
}

setWorldConstructor(SmokeWorld);

/**
 * Reads the scenario's Cucumber tags and maps them to a `FixtureRequest`.
 * A scenario tagged with `fixtureTag` opts into both worker and scenario
 * fixtures; `workerFixtureTag` and `scenarioFixtureTag` opt into each
 * independently. Tags are read from `resolveRuntimeConfig()` so the tag
 * names can be changed via environment variables without code changes.
 *
 * @param hook - The Cucumber before-hook parameter containing pickle metadata.
 */
// Dynamically resolve requested fixtures from tags/config
const resolveFixtureRequest = (hook: ITestCaseHookParameter): FixtureRequest => {
  const config = resolveRuntimeConfig();
  const tags = new Set(hook.pickle.tags.map((tag) => tag.name));
  const request: FixtureRequest = {};
  if (tags.has(config.fixtures.fixtureTag) || tags.has(config.fixtures.workerFixtureTag)) {
    request.globalServer = true;
  }
  if (tags.has(config.fixtures.fixtureTag) || tags.has(config.fixtures.scenarioFixtureTag)) {
    request.testDatabase = true;
  }
  // Add more dynamic fixture tag mappings here as needed
  if (tags.has('@cacheServer')) {
    request.cacheServer = { size: 10 }; // Example: pass options
  }
  return request;
};

/** Resets the lifecycle logger at the start of the test run. */
BeforeAll(function (): void {
  LifecycleLogger.reset();
  LifecycleLogger.log('BeforeAll', 'BeforeAll');
});

/**
 * Per-scenario setup: allocates fixtures based on tags, launches the
 * automation engine, and wires the smoke task onto the World.
 */
Before(function (this: SmokeWorld, hook: ITestCaseHookParameter): Promise<void> {
  this.scenarioName = hook.pickle.name;
  this.fixtureRequest = resolveFixtureRequest(hook);
  LifecycleLogger.log('Before', 'Before', this.scenarioName);

  return AutomationFixtureManager.allocateWorkerFixtures(this.scenarioName, this.fixtureRequest)
    .then(() => AutomationFixtureManager.allocateScenarioFixtures(this.scenarioName, this.fixtureRequest))
    .then((fixtureContext) => {
      this.fixtureContext = fixtureContext;
      return DriverRegistry.getAutomationEngine();
    })
    .then((engine) => {
      this.engine = engine;
      this.smokeTask = new HomeSmokeTask(engine);
      this.lastTitle = '';
    });
});

/**
 * Per-scenario teardown: cleans up scenario fixtures, closes the engine,
 * and re-throws when the scenario itself failed so the failure is surfaced
 * through `ExceptionManager`.
 */
After(function (this: SmokeWorld, hook: ITestCaseHookParameter): Promise<void> {
  return AutomationFixtureManager.cleanupScenarioFixtures(
    this.scenarioName,
    this.fixtureRequest,
    this.fixtureContext
  )
    .catch((error) => {
      new ExceptionManager().handleCleanupFailure({
        source: 'cucumber.after',
        message: 'Failed to cleanup scenario fixtures',
        scenarioName: this.scenarioName,
        error
      });
    })
    .then(() => DriverRegistry.closeAutomationEngine())
    .finally(() => {
      LifecycleLogger.log('After', 'After', this.scenarioName);
    })
    .then(() => {
      if (hook.result?.status === 'FAILED') {
        new ExceptionManager().handleFailure({
          source: 'cucumber.after',
          message: 'Smoke scenario failed',
          scenarioName: hook.pickle.name,
          error: hook.result?.message
        });
      }
    });
});

/** Cleans up worker-scoped fixtures after all scenarios in the worker have run. */
AfterAll(function (): Promise<void> {
  return AutomationFixtureManager.cleanupWorkerFixtures()
    .catch((error) => {
      new ExceptionManager().handleCleanupFailure({
        source: 'cucumber.afterAll',
        message: 'Failed to cleanup worker fixtures',
        error
      });
    })
    .finally(() => {
      LifecycleLogger.log('AfterAll', 'AfterAll');
    });
});
