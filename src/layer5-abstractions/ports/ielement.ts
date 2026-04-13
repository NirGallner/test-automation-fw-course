/**
 * Port representing an interactive DOM element.
 * Adapters MUST implement this interface to expose element operations to
 * Page Objects without exposing engine-specific locator or handle types.
 */
export interface IElement {
  /** Returns the element's visible text content. */
  textContent(): Promise<string>;
  /** Returns whether the element is currently visible in the viewport. */
  isVisible(): Promise<boolean>;
  /** Performs a click interaction on the element. */
  click(): Promise<void>;
}
