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

class SmokeWorld extends World {
  public engine: IAutomationEngine | null = null;
  public smokeTask: HomeSmokeTask | null = null;
  public lastTitle = '';
  public scenarioName = '';
  public fixtureRequest: FixtureRequest = { usesGlobalServer: false, usesScenarioDatabase: false };
  public fixtureContext: FixtureContext = {};
}

setWorldConstructor(SmokeWorld);

const resolveFixtureRequest = (hook: ITestCaseHookParameter): FixtureRequest => {
  const config = resolveRuntimeConfig();
  const tags = new Set(hook.pickle.tags.map((tag) => tag.name));
  const sharedFixtureOptIn = tags.has(config.fixtures.fixtureTag);

  return {
    usesGlobalServer: sharedFixtureOptIn || tags.has(config.fixtures.workerFixtureTag),
    usesScenarioDatabase: sharedFixtureOptIn || tags.has(config.fixtures.scenarioFixtureTag)
  };
};

BeforeAll(function (): void {
  LifecycleLogger.reset();
  LifecycleLogger.log('BeforeAll', 'BeforeAll');
});

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
