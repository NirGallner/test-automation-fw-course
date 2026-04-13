import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium, type Browser, type BrowserContext, type Frame, type Page } from 'playwright';
import { createUnsupportedCapabilityError } from '../../../support/exception-manager';
import { IAutomationEngine } from '../../ports/iautomation-engine';
import { PlaywrightPageAdapter } from './playwright-page.adapter';

/**
 * Layer 5 adapter that implements `IAutomationEngine` using Playwright's
 * Chromium driver. All automation primitives are delegated to Playwright;
 * no Playwright-specific type leaks above this class boundary.
 *
 * Construction is restricted to the static `launch()` factory so that
 * the async browser launch is always properly awaited.
 */
export class PlaywrightBrowserAdapter implements IAutomationEngine {
  public readonly engineType = 'playwright' as const;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private frame: Frame | null = null;
  private tracingActive = false;

  /** @param browser - Already-launched Playwright Browser instance. */
  private constructor(private readonly browser: Browser) {}

  /**
   * Launches a headless Chromium instance and wraps it in the adapter.
   * Headless mode is disabled when the `PLAYWRIGHT_HEADLESS` environment
   * variable is set to `'false'`.
   */
  public static async launch(): Promise<PlaywrightBrowserAdapter> {
    const browser = await chromium.launch({ headless: process.env.PLAYWRIGHT_HEADLESS !== 'false' });
    return new PlaywrightBrowserAdapter(browser);
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
    this.tracingActive = false;
  }

  /** @inheritdoc */
  public async openUrl(url: string): Promise<void> {
    const page = await this.requirePage();
    const pageAdapter = new PlaywrightPageAdapter(page);
    await pageAdapter.goto(url);
  }

  /** @inheritdoc */
  public async getTitle(): Promise<string> {
    const page = await this.requirePage();
    const pageAdapter = new PlaywrightPageAdapter(page);
    return pageAdapter.title();
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
    const pageAdapter = new PlaywrightPageAdapter(page);
    this.frame = await pageAdapter.frameElement(frameSelector);
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
        if ((await candidate.title()) === expectedTitle) {
          this.page = candidate;
          this.frame = null;
          return;
        }
      }
    }

    if (windowRef.startsWith('url=')) {
      const expectedUrl = windowRef.slice('url='.length);
      const match = pages.find((candidate) => candidate.url().includes(expectedUrl));
      if (match) {
        this.page = match;
        this.frame = null;
        return;
      }
    }

    throw new Error(`Window not found for reference: ${windowRef}`);
  }

  /** @inheritdoc */
  public async startTrace(traceName = 'smoke-trace'): Promise<void> {
    const context = await this.requireContext();
    await context.tracing.start({ name: traceName, screenshots: true, snapshots: true });
    this.tracingActive = true;
  }

  /** @inheritdoc */
  public async stopTrace(): Promise<string> {
    if (!this.tracingActive) {
      throw createUnsupportedCapabilityError('stopTrace', 'Playwright');
    }

    const context = await this.requireContext();
    const outputDir = path.resolve(process.cwd(), 'reports');
    await mkdir(outputDir, { recursive: true });
    const traceFile = path.join(outputDir, 'playwright-trace.zip');
    await context.tracing.stop({ path: traceFile });
    this.tracingActive = false;
    return traceFile;
  }

  /** @inheritdoc */
  public async useDevtoolsProtocol(method: string, params?: Record<string, unknown>): Promise<unknown> {
    const context = await this.requireContext();
    const page = await this.requirePage();
    const session = await context.newCDPSession(page);
    const sessionAny = session as { send(name: string, payload?: Record<string, unknown>): Promise<unknown> };
    return sessionAny.send(method, params);
  }

  /**
   * Ensures a browser context exists, calling `newPage()` to initialize one
   * if none has been created yet. Throws if initialization fails.
   */
  private async requireContext(): Promise<BrowserContext> {
    if (!this.context) {
      await this.newPage();
    }

    if (!this.context) {
      throw new Error('Playwright context is not initialized.');
    }

    return this.context;
  }

  /**
   * Ensures a page exists, calling `newPage()` for lazy initialization when
   * the adapter has not yet been given an explicit `newPage()` call.
   * Throws if initialization fails.
   */
  private async requirePage(): Promise<Page> {
    if (!this.page) {
      await this.newPage();
    }

    if (!this.page) {
      throw new Error('Playwright page is not initialized.');
    }

    return this.page;
  }

  /**
   * Resolves the element adapter for a selector, routing to the active frame
   * when one is set via `switchToFrame`, or to the current page otherwise.
   * The element adapter module is dynamically imported when the frame path is
   * taken to avoid a circular dependency at module load time.
   */
  private async resolveElement(selector: string): Promise<import('./playwright-element.adapter').PlaywrightElementAdapter> {
    if (this.frame) {
      const { PlaywrightElementAdapter } = await import('./playwright-element.adapter');
      return new PlaywrightElementAdapter(this.frame.locator(selector));
    }

    const page = await this.requirePage();
    const pageAdapter = new PlaywrightPageAdapter(page);
    return pageAdapter.element(selector);
  }
}
