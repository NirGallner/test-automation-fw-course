import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';

/**
 * Page Object for the cart drawer at https://storedemo.testdino.com/.
 * Encapsulates all atomic interactions and state queries scoped to the cart
 * slide-out drawer that appears after a product is added to the cart.
 * Business journey orchestration MUST NOT live here.
 *
 * Follows the Page Flow Pattern: this is a terminal destination in the
 * product-add-to-cart flow; no navigation methods are exposed.
 *
 * Locator priority (highest to lowest):
 *   data-testid > id > name > aria-label > unique CSS selector
 */
export class CartPage {
  /** Root container for the cart drawer. */
  private readonly cartDrawer = '[data-testid="cart-drawer"]';

  /** Individual cart item row inside the drawer. */
  private readonly cartItem = '[data-testid="cart-item"]';

  /** Product name heading within a cart item row. */
  private readonly cartItemHeader = '[data-testid="cart-item-header"]';

  /** Close/dismiss button for the cart drawer. */
  private readonly closeCartButton = '[data-testid="close-cart"]';

  /** @param engine - Tool-agnostic automation engine for all interactions. */
  public constructor(private readonly engine: IAutomationEngine) {}

  /**
   * Returns whether the cart drawer is currently visible, confirming that it
   * has opened successfully after a product was added.
   */
  public isCartVisible(): Promise<boolean> {
    return this.engine.isVisible(this.cartDrawer);
  }

  /**
   * Returns whether the cart contains at least one item row, confirming that
   * a product was successfully added.
   */
  public hasCartItems(): Promise<boolean> {
    return this.engine.isVisible(this.cartItem);
  }

  /**
   * Returns the text content of the first cart item name heading.
   * Used to assert the exact product name shown in the cart.
   */
  public getFirstCartItemName(): Promise<string> {
    return this.engine.getTextContent(this.cartItemHeader);
  }

  /**
   * Returns whether the cart contains an item whose name includes the given
   * `productName` string (case-insensitive substring match via DOM comparison).
   * Falls back to `false` when the element is not present.
   * @param productName - Product name to look for in the cart.
   */
  public verifyProductInCart(productName: string): Promise<boolean> {
    return this.engine
      .getTextContent(this.cartItemHeader)
      .then((name) => name.toLowerCase().includes(productName.toLowerCase()))
      .catch(() => false);
  }

  /**
   * Closes the cart drawer by clicking the dismiss button.
   * Safe to call when the cart is visible; does nothing if the button is absent.
   */
  public closeCartDrawer(): Promise<void> {
    return this.engine.isVisible(this.closeCartButton).then((visible) => {
      if (visible) {
        return this.engine.click(this.closeCartButton);
      }
    });
  }
}
