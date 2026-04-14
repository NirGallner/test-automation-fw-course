import { Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { CartPage } from '../layer4-page-objects/cart.page';
import { AddToCartTask } from '../tasks/add-to-cart.task';
import { resolveRuntimeConfig } from '../support/runtime-config';

/**
 * Partial view of the Cucumber World needed by these step definitions.
 * Only the properties accessed from steps are declared here; the full
 * implementation lives in `src/support/hooks.ts`.
 */
interface AddToCartWorld {
  /** Add-to-cart task wired to the active engine by the Before hook. */
  addToCartTask: AddToCartTask | null;
  /** Cart page captured after adding a product, used for cart assertions. */
  cartPage: CartPage | null;
  /** Name of the product being purchased, set by the search step. */
  productName: string;
}

/** Navigates to the configured store URL (defaults to https://storedemo.testdino.com/). */
Given('I am on the store home page', function (this: AddToCartWorld): Promise<void> {
  assert.ok(this.addToCartTask, 'AddToCartTask was not initialized by hooks');
  const { storeUrl } = resolveRuntimeConfig();
  return this.addToCartTask.openHomePage(storeUrl);
});

/**
 * Searches for the product by name and selects it from the results grid,
 * navigating to the product details page. The `AddToCartTask` holds the
 * resulting page internally so the next step can call `addToCart()` without
 * re-navigating. The product name is stored on the World for assertion steps.
 */
When(
  'I search for and select the product {string}',
  function (this: AddToCartWorld, productName: string): Promise<void> {
    assert.ok(this.addToCartTask, 'AddToCartTask was not initialized by hooks');
    this.productName = productName;
    return this.addToCartTask.searchAndSelectProduct(productName);
  }
);

/**
 * Clicks the "Add to Cart" button on the product details page reached by the
 * previous search step. Stores the resulting `CartPage` on the World so that
 * subsequent assertion steps can verify cart state without re-querying.
 */
When('I add the product to the cart', function (this: AddToCartWorld): Promise<void> {
  assert.ok(this.addToCartTask, 'AddToCartTask was not initialized by hooks');
  return this.addToCartTask.addToCart().then((cartPage) => {
    this.cartPage = cartPage;
  });
});

/** Asserts that the cart drawer or cart container is visible. */
Then('the cart should be visible', function (this: AddToCartWorld): Promise<void> {
  assert.ok(this.cartPage, 'Cart page was not captured – did the add-to-cart step run?');
  return this.cartPage.isCartVisible().then((visible) => {
    assert.equal(visible, true, 'Expected the cart to be visible after adding a product');
  });
});

/** Asserts that the product appears in the cart drawer or cart page. */
Then(
  'the product should appear in the cart',
  function (this: AddToCartWorld): Promise<void> {
    assert.ok(this.cartPage, 'Cart page was not captured – did the add-to-cart step run?');
    return this.addToCartTask!
      .verifyProductInCart(this.cartPage, this.productName)
      .then((found) => {
        assert.equal(
          found,
          true,
          `Expected product "${this.productName}" to be present in the cart`
        );
      });
  }
);
