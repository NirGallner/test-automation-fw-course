import type { Locator } from 'playwright';
import { IElement } from '../../ports/ielement';

/**
 * Adapter that implements `IElement` by delegating to a Playwright `Locator`.
 * Coerces nullable `textContent` to an empty string to satisfy the port contract.
 */
export class PlaywrightElementAdapter implements IElement {
  /** @param locator - The Playwright locator this adapter wraps. */
  public constructor(private readonly locator: Locator) {}

  /** Returns the element's text content, or an empty string if null. */
  public async textContent(): Promise<string> {
    return (await this.locator.textContent()) ?? '';
  }

  /** @inheritdoc */
  public async isVisible(): Promise<boolean> {
    return this.locator.isVisible();
  }

  /** @inheritdoc */
  public async click(): Promise<void> {
    await this.locator.click();
  }

  /**
   * Fills the element with the given value (clears existing content first).
   * @param value - Text to type into the element.
   */
  public async fill(value: string): Promise<void> {
    await this.locator.fill(value);
  }

  /** Hovers the pointer over the element. */
  public async hover(): Promise<void> {
    await this.locator.hover();
  }

  /**
   * Waits until the element enters a visible state.
   * @param timeoutMs - Maximum wait duration in milliseconds (default 5000).
   */
  public async waitForVisible(timeoutMs = 5000): Promise<void> {
    await this.locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }
}
