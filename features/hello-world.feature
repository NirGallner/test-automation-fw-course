Feature: Hello World
  Scenario: Developer verifies the scaffold is wired
    Given the project dependencies have been installed
    When the test suite is executed
    Then the hello world scenario passes with a log entry
