export interface VibiumLocator {
  textContent(): Promise<string | null>;
  isVisible(): Promise<boolean>;
  click(): Promise<void>;
  fill(value: string): Promise<void>;
  hover(): Promise<void>;
  waitFor(options?: { state?: 'visible'; timeout?: number }): Promise<void>;
}

export class VibiumElementAdapter {
  public constructor(private readonly locator: VibiumLocator) {}

  public textContent(): Promise<string> {
    return this.locator.textContent().then((content) => content ?? '');
  }

  public isVisible(): Promise<boolean> {
    return this.locator.isVisible();
  }

  public click(): Promise<void> {
    return this.locator.click();
  }

  public fill(value: string): Promise<void> {
    return this.locator.fill(value);
  }

  public hover(): Promise<void> {
    return this.locator.hover();
  }

  public waitForVisible(timeoutMs = 5000): Promise<void> {
    return this.locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }
}