import { After, Before, ITestCaseHookParameter, setWorldConstructor, World } from '@cucumber/cucumber';
import { DriverRegistry } from './driver-registry';
import { ExceptionManager } from './exception-manager';
import { HomeSmokeTask } from '../tasks/home-smoke.task';
import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';

class SmokeWorld extends World {
  public engine: IAutomationEngine | null = null;
  public smokeTask: HomeSmokeTask | null = null;
  public lastTitle = '';
}

setWorldConstructor(SmokeWorld);

Before(function (this: SmokeWorld): Promise<void> {
  return DriverRegistry.getAutomationEngine()
    .then((engine) => {
      this.engine = engine;
      this.smokeTask = new HomeSmokeTask(engine);
      this.lastTitle = '';
    });
});

After(function (this: SmokeWorld, hook: ITestCaseHookParameter): Promise<void> {
  if (hook.result?.status === 'FAILED') {
    return DriverRegistry.closeAutomationEngine().then(() => {
      new ExceptionManager().handleFailure({
        source: 'cucumber.after',
        message: 'Smoke scenario failed',
        scenarioName: hook.pickle.name,
        error: hook.result?.message
      });
    });
  }

  return DriverRegistry.closeAutomationEngine();
});
