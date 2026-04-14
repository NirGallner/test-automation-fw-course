import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';
import { CartPage } from './cart.page';

/**
 * Page Object for the product details page at
 * https://storedemo.testdino.com/product/:slug.
 * Encapsulates all atomic interactions and state queries scoped to a single
 * product detail view. Business journey orchestration MUST NOT live here.
 *
 * Follows the Page Flow Pattern: `clickAddToCart` returns the `CartPage`
 * representing the cart drawer that opens after the action.
 *
 * Locator priority (highest to lowest):
 *   data-testid > id > name > aria-label > unique CSS selector
 */
export class ProductDetailsPage {
  /** Product title heading on the details page. */
  private readonly productName = '[data-testid="product-name"]';

  /** "ADD TO CART" button on the product details page. */
  private readonly addToCartButton = '[data-testid="add-to-cart-button"]';

  /**
   * Cart count badge in the header — updates immediately after add-to-cart
   * and is used as the ready signal that the item was accepted.
   */
  private readonly headerCartCount = '[data-testid="header-cart-count"]';

  /** Cart icon in the header — clicking it opens the cart drawer. */
  private readonly headerCartIcon = '[data-testid="header-cart-icon"]';

  /** Cart item row inside the drawer — visible after the drawer opens. */
  private readonly cartItem = '[data-testid="cart-item"]';

  /** @param engine - Tool-agnostic automation engine for all interactions. */
  public constructor(private readonly engine: IAutomationEngine) {}

  /**
   * Returns the visible text of the product title heading, confirming the
   * correct product details page is displayed.
   */
  public getProductTitle(): Promise<string> {
    return this.engine.getTextContent(this.productName);
  }

  /**
   * Clicks "ADD TO CART", waits for the header cart count badge to confirm the
   * item was accepted, then opens the cart drawer by clicking the cart icon and
   * waits for the first cart item row to become visible. Returns the `CartPage`.
   */
  public clickAddToCart(): Promise<CartPage> {
    return this.engine
      .click(this.addToCartButton)
      .then(() => this.engine.waitForVisible(this.headerCartCount, 10_000))
      .then(() => this.engine.click(this.headerCartIcon))
      .then(() => this.engine.waitForVisible(this.cartItem, 10_000))
      .then(() => new CartPage(this.engine));
  }
}
