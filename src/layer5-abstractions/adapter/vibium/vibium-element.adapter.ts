/**
 * Minimal interface for a Vibium locator. Mirrors the Playwright `Locator`
 * surface that `VibiumElementAdapter` delegates to.
 */
export interface VibiumLocator {
  textContent(): Promise<string | null>;
  isVisible(): Promise<boolean>;
  click(): Promise<void>;
  fill(value: string): Promise<void>;
  hover(): Promise<void>;
  waitFor(options?: { state?: 'visible'; timeout?: number }): Promise<void>;
}

/**
 * Adapter that implements the `IElement` contract for the Vibium engine by
 * delegating to a `VibiumLocator`. Coerces nullable `textContent` to an
 * empty string to satisfy the port contract.
 */
export class VibiumElementAdapter {
  /** @param locator - The Vibium locator this adapter wraps. */
  public constructor(private readonly locator: VibiumLocator) {}

  /** Returns the element's text content, or an empty string if null. */
  public textContent(): Promise<string> {
    return this.locator.textContent().then((content) => content ?? '');
  }

  /** @inheritdoc */
  public isVisible(): Promise<boolean> {
    return this.locator.isVisible();
  }

  /** @inheritdoc */
  public click(): Promise<void> {
    return this.locator.click();
  }

  /**
   * Fills the element with the given value (clears existing content first).
   * @param value - Text to type into the element.
   */
  public fill(value: string): Promise<void> {
    return this.locator.fill(value);
  }

  /** Hovers the pointer over the element. */
  public hover(): Promise<void> {
    return this.locator.hover();
  }

  /**
   * Waits until the element enters a visible state.
   * @param timeoutMs - Maximum wait duration in milliseconds (default 5000).
   */
  public waitForVisible(timeoutMs = 5000): Promise<void> {
    return this.locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }
}