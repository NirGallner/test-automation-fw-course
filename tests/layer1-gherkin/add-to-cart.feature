Feature: Successful Product Add to Cart
  As a store customer
  I want to search for a product and add it to my cart
  So that I can purchase it

  Scenario: Add a product to the cart from the search results
    Given I am on the store home page
    When I search for and select the product "Laptop"
    And I add the product to the cart
    Then the cart should be visible
    And the product should appear in the cart
