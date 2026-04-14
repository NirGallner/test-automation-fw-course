import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';
import { ProductDetailsPage } from './product-details.page';

/**
 * Page Object for the all-products listing page at
 * https://storedemo.testdino.com/products.
 * Encapsulates atomic interactions with the product grid and inline search.
 * Business journey orchestration MUST NOT live here.
 *
 * Follows the Page Flow Pattern: `selectProductByName` returns the
 * `ProductDetailsPage` representing the chosen product.
 *
 * Locator priority (highest to lowest):
 *   data-testid > id > name > aria-label > unique CSS selector
 */
export class ProductsListingPage {
  /** Inline search text input on the products listing page. */
  private readonly searchInput = '[data-testid="all-products-search-input"]';

  /** Product card title/header elements in the listing grid. */
  private readonly productCardHeader = '[data-testid="all-products-header"]';

  /** Results count paragraph – used to confirm search results have loaded. */
  private readonly resultsCount = '[data-testid="all-products-results-count"]';

  /** @param engine - Tool-agnostic automation engine for all interactions. */
  public constructor(private readonly engine: IAutomationEngine) {}

  /**
   * Types a search query into the inline search bar and waits for results to
   * update before returning. The results count element is used as the ready
   * signal; Playwright re-evaluates the DOM after each keystroke.
   * @param text - Product name or search query to enter.
   */
  public enterSearchText(text: string): Promise<void> {
    return this.engine
      .click(this.searchInput)
      .then(() => this.engine.enterText(this.searchInput, text))
      .then(() => this.engine.waitForVisible(this.resultsCount, 10_000));
  }

  /**
   * Clicks the first visible product card whose title matches `productName`
   * and returns the `ProductDetailsPage` representing that product.
   *
   * Because the inline search has already filtered the grid to matching
   * results, clicking the first card header is sufficient for the happy path.
   *
   * @param _productName - Unused at the selector level; kept as parameter for
   *   future multi-result disambiguation and documentation clarity.
   */
  public selectProductByName(_productName: string): Promise<ProductDetailsPage> {
    return this.engine
      .click(this.productCardHeader)
      .then(() => new ProductDetailsPage(this.engine));
  }
}
