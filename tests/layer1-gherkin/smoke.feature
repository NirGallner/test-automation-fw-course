Feature: Smoke
  As an engineer
  I want a baseline smoke run
  So that I can verify end-to-end automation wiring

  Scenario: Open default smoke page and validate content
    Given I open the smoke page
    When I capture the page title
    Then the page title should not be empty
    And the main content should be visible
