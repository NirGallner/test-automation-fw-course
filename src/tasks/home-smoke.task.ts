import { HomePage } from '../layer4-page-objects/home.page';
import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';

export class HomeSmokeTask {
  private readonly homePage: HomePage;

  public constructor(engine: IAutomationEngine) {
    this.homePage = new HomePage(engine);
  }

  public open(url: string): Promise<void> {
    return this.homePage.navigate(url).then(() => undefined);
  }

  public title(): Promise<string> {
    return this.homePage.getTitle();
  }

  public mainContentVisible(): Promise<boolean> {
    return this.homePage.isMainContentVisible();
  }
}
