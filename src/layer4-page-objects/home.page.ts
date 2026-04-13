import { IPage } from '../layer5-abstractions/ports/ipage';

export class HomePage {
  public constructor(private readonly page: IPage) {}

  public navigate(url: string): Promise<HomePage> {
    return this.page.goto(url).then(() => this);
  }

  public getTitle(): Promise<string> {
    return this.page.title();
  }

  public isMainContentVisible(): Promise<boolean> {
    return this.page.find('main').then((mainElement) =>
      mainElement.isVisible().then((isMainVisible) => {
        if (isMainVisible) {
          return true;
        }

        return this.page.find('body').then((bodyElement) => bodyElement.isVisible());
      })
    );
  }
}
