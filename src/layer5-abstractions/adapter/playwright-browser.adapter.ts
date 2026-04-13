import { chromium, type Browser } from 'playwright';
import { IBrowser } from '../ports/ibrowser';
import { IPage } from '../ports/ipage';
import { PlaywrightPageAdapter } from './playwright-page.adapter';

export class PlaywrightBrowserAdapter implements IBrowser {
  private constructor(private readonly browser: Browser) {}

  public static async launch(): Promise<PlaywrightBrowserAdapter> {
    const browser = await chromium.launch({ headless: process.env.PLAYWRIGHT_HEADLESS !== 'false' });
    return new PlaywrightBrowserAdapter(browser);
  }

  public async newPage(): Promise<IPage> {
    const context = await this.browser.newContext();
    const page = await context.newPage();
    return new PlaywrightPageAdapter(page);
  }

  public async close(): Promise<void> {
    await this.browser.close();
  }
}
