import { IElement } from './ielement';

/**
 * Port representing a single browser page or document context.
 * Page Objects MUST consume this interface rather than engine-native page types
 * so that the automation engine can be replaced without modifying Layer 4.
 */
export interface IPage {
  /**
   * Navigates the page to the specified URL.
   * @param url - Absolute URL to load.
   */
  goto(url: string): Promise<void>;
  /** Returns the current document title. */
  title(): Promise<string>;
  /**
   * Finds the first element matching the selector.
   * @param selector - CSS or engine-native selector string.
   */
  find(selector: string): Promise<IElement>;
}
