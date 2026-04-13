import { HomePage } from '../layer4-page-objects/home.page';
import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';

/**
 * Business Interaction class that coordinates the home-page smoke workflow.
 * Composes `HomePage` through the tool-agnostic `IAutomationEngine` contract
 * so the layer boundary is preserved. Step Definitions call this class;
 * they MUST NOT interact with `HomePage` directly.
 */
export class HomeSmokeTask {
  private readonly homePage: HomePage;

  /** @param engine - Automation engine provided by `DriverRegistry`. */
  public constructor(engine: IAutomationEngine) {
    this.homePage = new HomePage(engine);
  }

  /**
   * Opens the home page at the given URL.
   * @param url - Absolute URL to navigate to.
   */
  public open(url: string): Promise<void> {
    return this.homePage.navigate(url).then(() => undefined);
  }

  /** Returns the home page document title. */
  public title(): Promise<string> {
    return this.homePage.getTitle();
  }

  /** Returns whether the main content area is visible on the home page. */
  public mainContentVisible(): Promise<boolean> {
    return this.homePage.isMainContentVisible();
  }
}
