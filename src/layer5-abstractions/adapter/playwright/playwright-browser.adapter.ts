import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium, type Browser, type BrowserContext, type Frame, type Page } from 'playwright';
import { createUnsupportedCapabilityError } from '../../../support/exception-manager';
import { IAutomationEngine } from '../../ports/iautomation-engine';
import { PlaywrightPageAdapter } from './playwright-page.adapter';

export class PlaywrightBrowserAdapter implements IAutomationEngine {
  public readonly engineType = 'playwright' as const;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private frame: Frame | null = null;
  private tracingActive = false;

  private constructor(private readonly browser: Browser) {}

  public static async launch(): Promise<PlaywrightBrowserAdapter> {
    const browser = await chromium.launch({ headless: process.env.PLAYWRIGHT_HEADLESS !== 'false' });
    return new PlaywrightBrowserAdapter(browser);
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
    this.tracingActive = false;
  }

  public async openUrl(url: string): Promise<void> {
    const page = await this.requirePage();
    const pageAdapter = new PlaywrightPageAdapter(page);
    await pageAdapter.goto(url);
  }

  public async getTitle(): Promise<string> {
    const page = await this.requirePage();
    const pageAdapter = new PlaywrightPageAdapter(page);
    return pageAdapter.title();
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
    const pageAdapter = new PlaywrightPageAdapter(page);
    this.frame = await pageAdapter.frameElement(frameSelector);
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

  public async startTrace(traceName = 'smoke-trace'): Promise<void> {
    const context = await this.requireContext();
    await context.tracing.start({ name: traceName, screenshots: true, snapshots: true });
    this.tracingActive = true;
  }

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

  public async useDevtoolsProtocol(method: string, params?: Record<string, unknown>): Promise<unknown> {
    const context = await this.requireContext();
    const page = await this.requirePage();
    const session = await context.newCDPSession(page);
    const sessionAny = session as { send(name: string, payload?: Record<string, unknown>): Promise<unknown> };
    return sessionAny.send(method, params);
  }

  private async requireContext(): Promise<BrowserContext> {
    if (!this.context) {
      await this.newPage();
    }

    if (!this.context) {
      throw new Error('Playwright context is not initialized.');
    }

    return this.context;
  }

  private async requirePage(): Promise<Page> {
    if (!this.page) {
      await this.newPage();
    }

    if (!this.page) {
      throw new Error('Playwright page is not initialized.');
    }

    return this.page;
  }

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
