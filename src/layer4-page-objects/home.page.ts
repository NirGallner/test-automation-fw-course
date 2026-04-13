import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';

/**
 * Page Object for the application home page. Encapsulates all atomic
 * interactions and state queries for this page; business journey
 * orchestration MUST NOT live here.
 *
 * Follows the Page Flow Pattern: `navigate` returns `this` so that callers
 * can chain further actions fluently without holding a separate reference.
 */
export class HomePage {
  /** @param engine - Tool-agnostic automation engine for all interactions. */
  public constructor(private readonly engine: IAutomationEngine) {}

  /**
   * Navigates to the given URL and returns this page object for fluent chaining.
   * @param url - Absolute URL to open.
   */
  public navigate(url: string): Promise<HomePage> {
    return this.engine.openUrl(url).then(() => this);
  }

  /** Returns the current document title of the home page. */
  public getTitle(): Promise<string> {
    return this.engine.getTitle();
  }

  /**
   * Returns whether the main content area is visible. Falls back to checking
   * the `body` element when no `main` element is present, accommodating
   * pages that use a non-semantic layout root.
   */
  public isMainContentVisible(): Promise<boolean> {
    return this.engine.isVisible('main').then((isMainVisible) => {
        if (isMainVisible) {
          return true;
        }

        return this.engine.isVisible('body');
      });
  }
}
