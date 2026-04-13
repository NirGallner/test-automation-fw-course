import { VibiumElementAdapter, VibiumLocator } from './vibium-element.adapter';

export interface VibiumFrame {
  locator(selector: string): VibiumLocator;
}

export interface VibiumElementHandle {
  contentFrame(): Promise<VibiumFrame | null>;
}

export interface VibiumPage {
  goto(url: string, options?: { waitUntil?: 'domcontentloaded' }): Promise<void>;
  title(): Promise<string>;
  locator(selector: string): VibiumLocator;
  waitForSelector(selector: string, options?: { timeout?: number }): Promise<VibiumElementHandle>;
  url(): string;
}

export class VibiumPageAdapter {
  public constructor(private readonly page: VibiumPage) {}

  public goto(url: string): Promise<void> {
    return this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  public title(): Promise<string> {
    return this.page.title();
  }

  public element(selector: string): VibiumElementAdapter {
    return new VibiumElementAdapter(this.page.locator(selector));
  }

  public waitForFrame(frameSelector: string): Promise<VibiumFrame> {
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