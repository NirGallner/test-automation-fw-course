import { createUnsupportedCapabilityError } from '../../../support/exception-manager';
import { IAutomationEngine } from '../../ports/iautomation-engine';
import { VibiumElementAdapter } from './vibium-element.adapter';
import { VibiumFrame, VibiumPage, VibiumPageAdapter } from './vibium-page.adapter';

/**
 * Internal shape of a Vibium browser context. Mirrors the Playwright
 * `BrowserContext` surface that this adapter relies on.
 */
interface VibiumContext {
  newPage(): Promise<VibiumPage>;
  pages(): VibiumPage[];
  tracing?: {
    start(options: { name: string; screenshots: boolean; snapshots: boolean }): Promise<void>;
    stop(options?: { path?: string }): Promise<void>;
  };
}

/**
 * Internal shape of a Vibium browser instance.
 * Mirrors the Playwright `Browser` surface used by this adapter.
 */
interface VibiumBrowser {
  newContext(): Promise<VibiumContext>;
  close(): Promise<void>;
}

/**
 * Layer 5 adapter that implements `IAutomationEngine` for the Vibium
 * automation library. The Vibium API closely mirrors Playwright; this adapter
 * maps the shared automation surface across both engines. Playwright-specific
 * capabilities (tracing, CDP) throw `createUnsupportedCapabilityError`.
 *
 * Construction is restricted to the static `launch()` factory which resolves
 * the Vibium launcher export dynamically to handle varying module shapes.
 */
export class VibiumBrowserAdapter implements IAutomationEngine {
  public readonly engineType = 'vibium' as const;
  private context: VibiumContext | null = null;
  private page: VibiumPage | null = null;
  private frame: VibiumFrame | null = null;

  /** @param browser - Already-launched Vibium browser instance. */
  private constructor(private readonly browser: VibiumBrowser) {}

  /**
   * Dynamically imports the Vibium module and locates its launch factory,
   * supporting both named exports (`launch`, `browser`) and default-export
   * shapes. Headless mode is disabled when `PLAYWRIGHT_HEADLESS` is `'false'`.
   */
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

  /** Opens a new browser context and page, resetting any active frame reference. */
  public async newPage(): Promise<void> {
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.frame = null;
  }

  /** Closes the browser and nullifies all session state. */
  public async close(): Promise<void> {
    await this.browser.close();
    this.context = null;
    this.page = null;
    this.frame = null;
  }

  /** @inheritdoc */
  public async openUrl(url: string): Promise<void> {
    const page = await this.requirePage();
    const adapter = new VibiumPageAdapter(page);
    await adapter.goto(url);
  }

  /** @inheritdoc */
  public async getTitle(): Promise<string> {
    const page = await this.requirePage();
    const adapter = new VibiumPageAdapter(page);
    return adapter.title();
  }

  /** @inheritdoc */
  public async click(selector: string): Promise<void> {
    const element = await this.resolveElement(selector);
    await element.click();
  }

  /** @inheritdoc */
  public async enterText(selector: string, value: string): Promise<void> {
    const element = await this.resolveElement(selector);
    await element.fill(value);
  }

  /** @inheritdoc */
  public async hover(selector: string): Promise<void> {
    const element = await this.resolveElement(selector);
    await element.hover();
  }

  /** @inheritdoc */
  public async getTextContent(selector: string): Promise<string> {
    const element = await this.resolveElement(selector);
    return element.textContent();
  }

  /** @inheritdoc */
  public async isVisible(selector: string): Promise<boolean> {
    const element = await this.resolveElement(selector);
    return element.isVisible();
  }

  /** @inheritdoc */
  public async waitForVisible(selector: string, timeoutMs = 5000): Promise<void> {
    const element = await this.resolveElement(selector);
    await element.waitForVisible(timeoutMs);
  }

  /** @inheritdoc */
  public async switchToFrame(frameSelector: string): Promise<void> {
    const page = await this.requirePage();
    const adapter = new VibiumPageAdapter(page);
    this.frame = await adapter.waitForFrame(frameSelector);
  }

  /** @inheritdoc */
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

  /** @inheritdoc — Vibium does not support tracing; always throws. */
  public async startTrace(_traceName?: string): Promise<void> {
    throw createUnsupportedCapabilityError('startTrace', 'Vibium');
  }

  /** @inheritdoc — Vibium does not support tracing; always throws. */
  public async stopTrace(): Promise<string> {
    throw createUnsupportedCapabilityError('stopTrace', 'Vibium');
  }

  /** @inheritdoc — CDP is not available in Vibium; always throws. */
  public async useDevtoolsProtocol(_method: string, _params?: Record<string, unknown>): Promise<unknown> {
    throw createUnsupportedCapabilityError('useDevtoolsProtocol', 'Vibium');
  }

  /**
   * Ensures a Vibium context exists, calling `newPage()` to initialize one
   * if none has been created yet. Throws if initialization fails.
   */
  private async requireContext(): Promise<VibiumContext> {
    if (!this.context) {
      await this.newPage();
    }

    if (!this.context) {
      throw new Error('Vibium context is not initialized.');
    }

    return this.context;
  }

  /**
   * Ensures a Vibium page exists, calling `newPage()` for lazy initialization
   * when the adapter has not yet received an explicit `newPage()` call.
   * Throws if initialization fails.
   */
  private async requirePage(): Promise<VibiumPage> {
    if (!this.page) {
      await this.newPage();
    }

    if (!this.page) {
      throw new Error('Vibium page is not initialized.');
    }

    return this.page;
  }

  /**
   * Resolves the element adapter for a selector, routing to the active frame
   * when one is set via `switchToFrame`, or to the current page otherwise.
   */
  private async resolveElement(selector: string): Promise<VibiumElementAdapter> {
    if (this.frame) {
      return new VibiumElementAdapter(this.frame.locator(selector));
    }

    const page = await this.requirePage();
    return new VibiumPageAdapter(page).element(selector);
  }
}
