Feature: Smoke
  As an engineer
  I want a baseline smoke run
  So that I can verify end-to-end automation wiring and runtime lifecycle behavior

  # Baseline lifecycle evidence for deterministic hook order.
  Scenario: Open default smoke page and validate content
    Given I open the smoke page
    When I capture the page title
    Then the page title should not be empty
    And the main content should be visible
    And lifecycle hooks should wrap the scenario

  @fixtures
  Scenario: Open smoke page with fixture-backed context
    Given I open the smoke page
    When I capture the page title
    Then the page title should not be empty
    And fixture lifecycle logs should be emitted
    And cleanup lifecycle logs should be present for this scenario

  Scenario: Open smoke page without fixture opt-in
    Given I open the smoke page
    When I capture the page title
    Then fixture lifecycle logs should not be emitted
    And cleanup lifecycle logs should be present for this scenario
