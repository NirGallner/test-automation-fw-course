# Data Model for 004-page-object-architecture

## Entities

### HomePage
- Fields: private selectors for search input, product grid/cards, header elements
- Methods: enterSearchText(string), selectProductByName(string), navigateToProductDetails()

### ProductDetailsPage
- Fields: private selectors for product title, add-to-cart button, cart drawer/page
- Methods: clickAddToCart(), confirmProductInCart()

### Cart
- Fields: private selectors for cart items, confirmation elements
- Methods: verifyProductInCart(productName)

## Relationships
- HomePage navigation leads to ProductDetailsPage
- ProductDetailsPage actions update Cart

## Validation Rules
- All selectors must follow locator priority and be private
- Navigation methods must return the next Page Object
- No Playwright types above Layer 5
- All methods and classes must be documented
