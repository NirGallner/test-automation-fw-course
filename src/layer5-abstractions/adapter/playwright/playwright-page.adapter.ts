import type { Frame, Page } from 'playwright';
import { PlaywrightElementAdapter } from './playwright-element.adapter';

export class PlaywrightPageAdapter {
  public constructor(private readonly page: Page) {}

  public async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  public async title(): Promise<string> {
    return this.page.title();
  }

  public element(selector: string): PlaywrightElementAdapter {
    return new PlaywrightElementAdapter(this.page.locator(selector));
  }

  public frameElement(frameSelector: string): Promise<Frame> {
    return this.page.waitForSelector(frameSelector).then((frameElement) =>
      frameElement.contentFrame().then((frame) => {
        if (!frame) {
          throw new Error(`Frame not found for selector: ${frameSelector}`);
        }

        return frame;
      })
    );
  }

  public url(): string {
    return this.page.url();
  }
}
