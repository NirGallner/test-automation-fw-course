import type { Locator } from 'playwright';
import { IElement } from '../../ports/ielement';

export class PlaywrightElementAdapter implements IElement {
  public constructor(private readonly locator: Locator) {}

  public async textContent(): Promise<string> {
    return (await this.locator.textContent()) ?? '';
  }

  public async isVisible(): Promise<boolean> {
    return this.locator.isVisible();
  }

  public async click(): Promise<void> {
    await this.locator.click();
  }

  public async fill(value: string): Promise<void> {
    await this.locator.fill(value);
  }

  public async hover(): Promise<void> {
    await this.locator.hover();
  }

  public async waitForVisible(timeoutMs = 5000): Promise<void> {
    await this.locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }
}
