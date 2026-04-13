import type { Frame, Page } from 'playwright';
import { PlaywrightElementAdapter } from './playwright-element.adapter';

/**
 * Thin wrapper around a Playwright `Page` instance that maps the page
 * interaction surface to engine-agnostic method signatures. Used internally
 * by `PlaywrightBrowserAdapter`; not part of the public port contract.
 */
export class PlaywrightPageAdapter {
  /** @param page - The underlying Playwright page to wrap. */
  public constructor(private readonly page: Page) {}

  /**
   * Navigates to the given URL and waits until `domcontentloaded`.
   * @param url - Absolute URL to load.
   */
  public async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /** Returns the current page document title. */
  public async title(): Promise<string> {
    return this.page.title();
  }

  /**
   * Returns a `PlaywrightElementAdapter` wrapping the locator for the selector.
   * @param selector - CSS or Playwright selector string.
   */
  public element(selector: string): PlaywrightElementAdapter {
    return new PlaywrightElementAdapter(this.page.locator(selector));
  }

  /**
   * Waits for an iframe element and resolves its `Frame` handle.
   * Rejects if the matched element has no associated content frame.
   * @param frameSelector - Selector identifying the iframe element.
   */
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

  /** Returns the current page URL as a string. */
  public url(): string {
    return this.page.url();
  }
}
