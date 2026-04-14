import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';
import { ProductsListingPage } from './products-listing.page';

/**
 * Page Object for the store home page at https://storedemo.testdino.com/.
 * Encapsulates all atomic interactions and state queries scoped to this page.
 * Business journey orchestration MUST NOT live here.
 *
 * Follows the Page Flow Pattern: navigation methods return the Page Object
 * representing the destination page, enabling fluent, type-safe flow chains.
 *
 * Locator priority (highest to lowest):
 *   data-testid > id > name > aria-label > unique CSS selector
 */
export class HomePage {
  /** "Shop Now" CTA button in the hero section. Navigates to /products. */
  private readonly shopNowButton = '[data-testid="hero-shop-now"]';

  /** "All Products" navigation menu item in the site header. */
  private readonly allProductsNavItem = '[data-testid="header-menu-all-products"]';

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
   * the `body` element when no `main` element is present.
   */
  public isMainContentVisible(): Promise<boolean> {
    return this.engine.isVisible('main').then((isMainVisible) => {
      if (isMainVisible) {
        return true;
      }
      return this.engine.isVisible('body');
    });
  }

  /**
   * Clicks the "Shop Now" hero button and returns the `ProductsListingPage`
   * that represents the product catalogue view.
   */
  public clickShopNow(): Promise<ProductsListingPage> {
    return this.engine
      .click(this.shopNowButton)
      .then(() => new ProductsListingPage(this.engine));
  }

  /**
   * Clicks the "All Products" navigation item in the site header and returns
   * the `ProductsListingPage` that represents the product catalogue view.
   */
  public navigateToAllProducts(): Promise<ProductsListingPage> {
    return this.engine
      .click(this.allProductsNavItem)
      .then(() => new ProductsListingPage(this.engine));
  }
}
