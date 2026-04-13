import { HomePage } from '../layer4-page-objects/home.page';
import { IPage } from '../layer5-abstractions/ports/ipage';

export class HomeSmokeTask {
  private readonly homePage: HomePage;

  public constructor(page: IPage) {
    this.homePage = new HomePage(page);
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
