import { After, Before, ITestCaseHookParameter, setWorldConstructor, World } from '@cucumber/cucumber';
import { DriverRegistry } from './driver-registry';
import { ExceptionManager } from './exception-manager';
import { HomeSmokeTask } from '../tasks/home-smoke.task';
import { IPage } from '../layer5-abstractions/ports/ipage';

class SmokeWorld extends World {
  public page: IPage | null = null;
  public smokeTask: HomeSmokeTask | null = null;
  public lastTitle = '';
}

setWorldConstructor(SmokeWorld);

Before(function (this: SmokeWorld): Promise<void> {
  return DriverRegistry.getBrowser()
    .then((browser) => browser.newPage())
    .then((page) => {
      this.page = page;
      this.smokeTask = new HomeSmokeTask(page);
      this.lastTitle = '';
    });
});

After(function (this: SmokeWorld, hook: ITestCaseHookParameter): Promise<void> {
  if (hook.result?.status === 'FAILED') {
    return DriverRegistry.closeBrowser().then(() => {
      new ExceptionManager().handleFailure({
        source: 'cucumber.after',
        message: 'Smoke scenario failed',
        scenarioName: hook.pickle.name,
        error: hook.result?.message
      });
    });
  }

  return DriverRegistry.closeBrowser();
});
