import { EngineType } from './automation-engine-capabilities';

/**
 * Primary port describing the full automation surface exposed to business layers.
 * All Layer 5 adapter implementations MUST satisfy this contract. Business
 * Interaction classes and Page Objects MUST depend only on this interface so
 * that the underlying automation engine can be swapped without touching
 * higher-level layers.
 */
export interface IAutomationEngine {
  /** Identifies which engine implementation is active at runtime. */
  readonly engineType: EngineType;

  /** Opens a fresh browser page/tab within the current session context. */
  newPage(): Promise<void>;
  /** Closes the browser and releases all associated resources. */
  close(): Promise<void>;

  /**
   * Navigates the current page to the given URL.
   * @param url - Absolute URL to navigate to.
   */
  openUrl(url: string): Promise<void>;
  /** Returns the current page's document title. */
  getTitle(): Promise<string>;

  /**
   * Clicks the first element matching the selector.
   * @param selector - CSS or engine-native selector string.
   */
  click(selector: string): Promise<void>;
  /**
   * Types a value into the first element matching the selector.
   * @param selector - CSS or engine-native selector string.
   * @param value - Text to enter.
   */
  enterText(selector: string, value: string): Promise<void>;
  /**
   * Moves the pointer over the first element matching the selector.
   * @param selector - CSS or engine-native selector string.
   */
  hover(selector: string): Promise<void>;
  /**
   * Retrieves the visible text content of the first matching element.
   * @param selector - CSS or engine-native selector string.
   */
  getTextContent(selector: string): Promise<string>;
  /**
   * Returns whether the first matching element is currently visible.
   * @param selector - CSS or engine-native selector string.
   */
  isVisible(selector: string): Promise<boolean>;

  /**
   * Waits until the first matching element becomes visible.
   * @param selector - CSS or engine-native selector string.
   * @param timeoutMs - Maximum wait time in milliseconds.
   */
  waitForVisible(selector: string, timeoutMs?: number): Promise<void>;
  /**
   * Switches the active interaction context into an embedded frame.
   * @param frameSelector - Selector identifying the frame element.
   */
  switchToFrame(frameSelector: string): Promise<void>;
  /**
   * Switches focus to another open browser window or tab.
   * @param windowRef - Index, `title=<title>`, or `url=<partial-url>` reference.
   */
  switchToWindow(windowRef: string): Promise<void>;

  /**
   * Starts a trace recording session (Playwright-specific; not all engines support this).
   * @param traceName - Optional label for the recorded trace.
   */
  startTrace(traceName?: string): Promise<void>;
  /**
   * Stops the active trace and returns the file path or data URI for the recording.
   * Throws if no trace is active.
   */
  stopTrace(): Promise<string>;
  /**
   * Executes a raw Chrome DevTools Protocol command (Playwright-specific).
   * @param method - CDP method name, e.g. `Network.enable`.
   * @param params - Optional CDP parameters object.
   */
  useDevtoolsProtocol(method: string, params?: Record<string, unknown>): Promise<unknown>;
}