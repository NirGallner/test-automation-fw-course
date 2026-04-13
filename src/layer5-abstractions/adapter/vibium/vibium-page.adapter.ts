import { VibiumElementAdapter, VibiumLocator } from './vibium-element.adapter';

/** Describes a Vibium frame that exposes a locator factory. */
export interface VibiumFrame {
  locator(selector: string): VibiumLocator;
}

/** Represents a resolved Vibium element handle capable of yielding its content frame. */
export interface VibiumElementHandle {
  contentFrame(): Promise<VibiumFrame | null>;
}

/**
 * Internal shape of a Vibium page instance. Mirrors the Playwright `Page`
 * surface needed by this adapter.
 */
export interface VibiumPage {
  goto(url: string, options?: { waitUntil?: 'domcontentloaded' }): Promise<void>;
  title(): Promise<string>;
  locator(selector: string): VibiumLocator;
  waitForSelector(selector: string, options?: { timeout?: number }): Promise<VibiumElementHandle>;
  url(): string;
}

/**
 * Thin wrapper around a `VibiumPage` that maps the page interaction surface
 * to engine-agnostic method signatures. Used internally by
 * `VibiumBrowserAdapter`; not part of the public port contract.
 */
export class VibiumPageAdapter {
  /** @param page - The underlying Vibium page to wrap. */
  public constructor(private readonly page: VibiumPage) {}

  /**
   * Navigates to the given URL and waits until `domcontentloaded`.
   * @param url - Absolute URL to load.
   */
  public goto(url: string): Promise<void> {
    return this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /** Returns the current page document title. */
  public title(): Promise<string> {
    return this.page.title();
  }

  /**
   * Returns a `VibiumElementAdapter` wrapping the locator for the selector.
   * @param selector - CSS or Vibium selector string.
   */
  public element(selector: string): VibiumElementAdapter {
    return new VibiumElementAdapter(this.page.locator(selector));
  }

  /**
   * Waits for an iframe element and resolves its `VibiumFrame` handle.
   * Rejects if the matched element has no associated content frame.
   * @param frameSelector - Selector identifying the iframe element.
   */
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

  /** Returns the current page URL as a string. */
  public url(): string {
    return this.page.url();
  }
}