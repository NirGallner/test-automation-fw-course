import type { Locator } from 'playwright';
import { IElement } from '../ports/ielement';

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
}
