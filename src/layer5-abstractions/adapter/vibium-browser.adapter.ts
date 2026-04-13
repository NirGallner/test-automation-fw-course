import { IBrowser } from '../ports/ibrowser';
import { IElement } from '../ports/ielement';
import { IPage } from '../ports/ipage';

class VibiumElementAdapter implements IElement {
  public constructor(private readonly locator: { textContent(): Promise<string | null>; isVisible(): Promise<boolean>; click(): Promise<void> }) {}

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

class VibiumPageAdapter implements IPage {
  public constructor(private readonly page: { goto(url: string, options?: unknown): Promise<void>; title(): Promise<string>; locator(selector: string): { textContent(): Promise<string | null>; isVisible(): Promise<boolean>; click(): Promise<void> } }) {}

  public async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  public async title(): Promise<string> {
    return this.page.title();
  }

  public async find(selector: string): Promise<IElement> {
    return new VibiumElementAdapter(this.page.locator(selector));
  }
}

export class VibiumBrowserAdapter implements IBrowser {
  private constructor(private readonly browser: { newContext(): Promise<{ newPage(): Promise<{ goto(url: string, options?: unknown): Promise<void>; title(): Promise<string>; locator(selector: string): { textContent(): Promise<string | null>; isVisible(): Promise<boolean>; click(): Promise<void> } }> }>; close(): Promise<void> }) {}

  public static async launch(): Promise<VibiumBrowserAdapter> {
    const vibiumModule = (await import('vibium')) as unknown as {
      launch?: (options: { headless: boolean }) => Promise<{ newContext(): Promise<{ newPage(): Promise<{ goto(url: string, options?: unknown): Promise<void>; title(): Promise<string>; locator(selector: string): { textContent(): Promise<string | null>; isVisible(): Promise<boolean>; click(): Promise<void> } }> }>; close(): Promise<void> }>;
      browser?: (options: { headless: boolean }) => Promise<{ newContext(): Promise<{ newPage(): Promise<{ goto(url: string, options?: unknown): Promise<void>; title(): Promise<string>; locator(selector: string): { textContent(): Promise<string | null>; isVisible(): Promise<boolean>; click(): Promise<void> } }> }>; close(): Promise<void> }>;
      default?: {
        launch?: (options: { headless: boolean }) => Promise<{ newContext(): Promise<{ newPage(): Promise<{ goto(url: string, options?: unknown): Promise<void>; title(): Promise<string>; locator(selector: string): { textContent(): Promise<string | null>; isVisible(): Promise<boolean>; click(): Promise<void> } }> }>; close(): Promise<void> }>;
        browser?: (options: { headless: boolean }) => Promise<{ newContext(): Promise<{ newPage(): Promise<{ goto(url: string, options?: unknown): Promise<void>; title(): Promise<string>; locator(selector: string): { textContent(): Promise<string | null>; isVisible(): Promise<boolean>; click(): Promise<void> } }> }>; close(): Promise<void> }>;
      };
    };

    const launcher =
      vibiumModule.launch ??
      vibiumModule.browser ??
      vibiumModule.default?.launch ??
      vibiumModule.default?.browser;

    if (!launcher) {
      throw new Error('Vibium adapter could not find a launch/browser factory export');
    }

    const browser = await launcher({ headless: process.env.PLAYWRIGHT_HEADLESS !== 'false' });
    return new VibiumBrowserAdapter(browser);
  }

  public async newPage(): Promise<IPage> {
    const context = await this.browser.newContext();
    const page = await context.newPage();
    return new VibiumPageAdapter(page);
  }

  public async close(): Promise<void> {
    await this.browser.close();
  }
}
