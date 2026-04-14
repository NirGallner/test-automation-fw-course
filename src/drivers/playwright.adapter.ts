import { IBrowser, IPage, IElement } from './interfaces';
import { chromium, Browser, Page } from '@playwright/test';

export class PlaywrightAdapter implements IBrowser {
  private browser: Browser | null = null;

  async launch(): Promise<IPage> {
    this.browser = await chromium.launch();
    const page = await this.browser.newPage();
    return new PlaywrightPageAdapter(page);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

class PlaywrightPageAdapter implements IPage {
  constructor(private page: Page) {}

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async close(): Promise<void> {
    await this.page.close();
  }
}

class PlaywrightElementAdapter implements IElement {
  constructor(private element: any) {}

  async click(): Promise<void> {
    await this.element.click();
  }

  async type(text: string): Promise<void> {
    await this.element.type(text);
  }

  async getText(): Promise<string> {
    return this.element.textContent();
  }
}
