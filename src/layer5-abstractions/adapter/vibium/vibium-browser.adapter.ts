import { createUnsupportedCapabilityError } from '../../../support/exception-manager';
import { IAutomationEngine } from '../../ports/iautomation-engine';
import { VibiumElementAdapter } from './vibium-element.adapter';
import { VibiumFrame, VibiumPage, VibiumPageAdapter } from './vibium-page.adapter';

interface VibiumContext {
  newPage(): Promise<VibiumPage>;
  pages(): VibiumPage[];
  tracing?: {
    start(options: { name: string; screenshots: boolean; snapshots: boolean }): Promise<void>;
    stop(options?: { path?: string }): Promise<void>;
  };
}

interface VibiumBrowser {
  newContext(): Promise<VibiumContext>;
  close(): Promise<void>;
}

export class VibiumBrowserAdapter implements IAutomationEngine {
  public readonly engineType = 'vibium' as const;
  private context: VibiumContext | null = null;
  private page: VibiumPage | null = null;
  private frame: VibiumFrame | null = null;

  private constructor(private readonly browser: VibiumBrowser) {}

  public static async launch(): Promise<VibiumBrowserAdapter> {
    const vibiumModule = (await import('vibium')) as unknown as {
      launch?: (options: { headless: boolean }) => Promise<VibiumBrowser>;
      browser?: (options: { headless: boolean }) => Promise<VibiumBrowser>;
      default?: {
        launch?: (options: { headless: boolean }) => Promise<VibiumBrowser>;
        browser?: (options: { headless: boolean }) => Promise<VibiumBrowser>;
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

  public async newPage(): Promise<void> {
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.frame = null;
  }

  public async close(): Promise<void> {
    await this.browser.close();
    this.context = null;
    this.page = null;
    this.frame = null;
  }

  public async openUrl(url: string): Promise<void> {
    const page = await this.requirePage();
    const adapter = new VibiumPageAdapter(page);
    await adapter.goto(url);
  }

  public async getTitle(): Promise<string> {
    const page = await this.requirePage();
    const adapter = new VibiumPageAdapter(page);
    return adapter.title();
  }

  public async click(selector: string): Promise<void> {
    const element = await this.resolveElement(selector);
    await element.click();
  }

  public async enterText(selector: string, value: string): Promise<void> {
    const element = await this.resolveElement(selector);
    await element.fill(value);
  }

  public async hover(selector: string): Promise<void> {
    const element = await this.resolveElement(selector);
    await element.hover();
  }

  public async getTextContent(selector: string): Promise<string> {
    const element = await this.resolveElement(selector);
    return element.textContent();
  }

  public async isVisible(selector: string): Promise<boolean> {
    const element = await this.resolveElement(selector);
    return element.isVisible();
  }

  public async waitForVisible(selector: string, timeoutMs = 5000): Promise<void> {
    const element = await this.resolveElement(selector);
    await element.waitForVisible(timeoutMs);
  }

  public async switchToFrame(frameSelector: string): Promise<void> {
    const page = await this.requirePage();
    const adapter = new VibiumPageAdapter(page);
    this.frame = await adapter.waitForFrame(frameSelector);
  }

  public async switchToWindow(windowRef: string): Promise<void> {
    const context = await this.requireContext();
    const pages = context.pages();

    const byIndex = Number(windowRef);
    if (Number.isInteger(byIndex) && byIndex >= 0 && byIndex < pages.length) {
      this.page = pages[byIndex] ?? null;
      this.frame = null;
      return;
    }

    if (windowRef.startsWith('title=')) {
      const expectedTitle = windowRef.slice('title='.length);
      for (const candidate of pages) {
        const adapter = new VibiumPageAdapter(candidate);
        if ((await adapter.title()) === expectedTitle) {
          this.page = candidate;
          this.frame = null;
          return;
        }
      }
    }

    if (windowRef.startsWith('url=')) {
      const expectedUrl = windowRef.slice('url='.length);
      const match = pages.find((candidate) => new VibiumPageAdapter(candidate).url().includes(expectedUrl));
      if (match) {
        this.page = match;
        this.frame = null;
        return;
      }
    }

    throw new Error(`Window not found for reference: ${windowRef}`);
  }

  public async startTrace(_traceName?: string): Promise<void> {
    throw createUnsupportedCapabilityError('startTrace', 'Vibium');
  }

  public async stopTrace(): Promise<string> {
    throw createUnsupportedCapabilityError('stopTrace', 'Vibium');
  }

  public async useDevtoolsProtocol(_method: string, _params?: Record<string, unknown>): Promise<unknown> {
    throw createUnsupportedCapabilityError('useDevtoolsProtocol', 'Vibium');
  }

  private async requireContext(): Promise<VibiumContext> {
    if (!this.context) {
      await this.newPage();
    }

    if (!this.context) {
      throw new Error('Vibium context is not initialized.');
    }

    return this.context;
  }

  private async requirePage(): Promise<VibiumPage> {
    if (!this.page) {
      await this.newPage();
    }

    if (!this.page) {
      throw new Error('Vibium page is not initialized.');
    }

    return this.page;
  }

  private async resolveElement(selector: string): Promise<VibiumElementAdapter> {
    if (this.frame) {
      return new VibiumElementAdapter(this.frame.locator(selector));
    }

    const page = await this.requirePage();
    return new VibiumPageAdapter(page).element(selector);
  }
}
