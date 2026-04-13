import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';

export class HomePage {
  public constructor(private readonly engine: IAutomationEngine) {}

  public navigate(url: string): Promise<HomePage> {
    return this.engine.openUrl(url).then(() => this);
  }

  public getTitle(): Promise<string> {
    return this.engine.getTitle();
  }

  public isMainContentVisible(): Promise<boolean> {
    return this.engine.isVisible('main').then((isMainVisible) => {
        if (isMainVisible) {
          return true;
        }

        return this.engine.isVisible('body');
      });
  }
}
