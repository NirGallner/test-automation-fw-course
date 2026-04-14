import { CartPage } from '../layer4-page-objects/cart.page';
import { HomePage } from '../layer4-page-objects/home.page';
import { ProductDetailsPage } from '../layer4-page-objects/product-details.page';
import { ProductsListingPage } from '../layer4-page-objects/products-listing.page';
import { IAutomationEngine } from '../layer5-abstractions/ports/iautomation-engine';

/**
 * Business Interaction class that orchestrates the "Add to Cart" user journey
 * for https://storedemo.testdino.com/.
 *
 * Flow: Home → Products Listing (search) → Product Details → Cart Drawer.
 *
 * Composes `HomePage`, `ProductsListingPage`, `ProductDetailsPage`, and
 * `CartPage` through the tool-agnostic `IAutomationEngine` contract so the
 * layer boundary is preserved.
 *
 * Step Definitions call this class; they MUST NOT interact with Page Objects
 * directly. All navigation and coordination happens here, keeping Layers 1–2
 * free of UI implementation details.
 *
 * Stateful flow: `searchAndSelectProduct` navigates from Home → Listing →
 * Details, storing enough state so `addToCart` can complete the action in a
 * subsequent step without re-navigating.
 */
export class AddToCartTask {
  private readonly homePage: HomePage;

  /**
   * `ProductDetailsPage` reached after `searchAndSelectProduct` completes.
   * Held internally so `addToCart` can click the button without navigating again.
   */
  private currentProductDetailsPage: ProductDetailsPage | null = null;

  /** @param engine - Automation engine provided by `DriverRegistry`. */
  public constructor(private readonly engine: IAutomationEngine) {
    this.homePage = new HomePage(engine);
  }

  /**
   * Opens the store home page at the given URL.
   * @param url - Absolute store URL to navigate to.
   */
  public openHomePage(url: string): Promise<void> {
    this.currentProductDetailsPage = null;
    return this.homePage.navigate(url).then(() => undefined);
  }

  /**
   * Navigates to the products listing page via the home "Shop Now" CTA,
   * searches for the product by name, and clicks the first matching card to
   * land on the product details page. Stores the `ProductDetailsPage` internally
   * for the subsequent `addToCart` call.
   *
   * @param productName - Exact or partial product name to search for.
   */
  public searchAndSelectProduct(productName: string): Promise<void> {
    let listingPage: ProductsListingPage;

    return this.homePage
      .clickShopNow()
      .then((lp) => {
        listingPage = lp;
        return listingPage.enterSearchText(productName);
      })
      .then(() => listingPage.selectProductByName(productName))
      .then((productDetailsPage) => {
        this.currentProductDetailsPage = productDetailsPage;
      });
  }

  /**
   * Clicks "ADD TO CART" on the product details page stored by the preceding
   * `searchAndSelectProduct` call. Returns the `CartPage` confirming the cart
   * drawer has opened with the product inside.
   *
   * Throws when called before `searchAndSelectProduct` has run.
   */
  public addToCart(): Promise<CartPage> {
    if (!this.currentProductDetailsPage) {
      return Promise.reject(
        new Error(
          'AddToCartTask.addToCart called before searchAndSelectProduct – ' +
            'ensure the search step runs first.'
        )
      );
    }
    return this.currentProductDetailsPage.clickAddToCart();
  }

  /**
   * Convenience method: executes the complete journey in one call.
   * Navigates to the home page, goes to products listing, searches, selects
   * the product, adds it to the cart, and returns the `CartPage`.
   *
   * @param url - Absolute store URL to open.
   * @param productName - Name of the product to find and add to the cart.
   */
  public purchaseProduct(url: string, productName: string): Promise<CartPage> {
    let listingPage: ProductsListingPage;

    return this.homePage
      .navigate(url)
      .then(() => this.homePage.clickShopNow())
      .then((lp) => {
        listingPage = lp;
        return listingPage.enterSearchText(productName);
      })
      .then(() => listingPage.selectProductByName(productName))
      .then((productDetailsPage) => {
        this.currentProductDetailsPage = productDetailsPage;
        return productDetailsPage.clickAddToCart();
      });
  }

  /**
   * Returns whether the given product name appears in the cart.
   * @param cartPage - The `CartPage` returned by `addToCart` or `purchaseProduct`.
   * @param productName - Product name expected to be present in the cart.
   */
  public verifyProductInCart(cartPage: CartPage, productName: string): Promise<boolean> {
    return cartPage.verifyProductInCart(productName);
  }
}
