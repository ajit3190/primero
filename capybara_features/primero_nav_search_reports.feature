# JIRA PRIMERO-41
Feature: As a logged in user, I can access search, advanced search, and reports from the nav bar

  Scenario: I try to access advanced search from the nav bar
    Given I am logged in as an admin
    When I should see a "Advanced Search" button on the page
    Then I press the "Advanced Search" button
    Then I should see "Select A Criteria"

  Scenario: I try to access reports from the nav bar
    Given I am logged in as an admin
    When I should see a "REPORTS" button on the page
    Then I press the "REPORTS" button
    Then I should see "RapidFTR Reports"

  Scenario: I try to find the search bar
    Given I am logged in as an admin
    When I should see the "query" field
    Then I fill in the "query" field with "test"

  Scenario: I try to search for something
    Given I am logged in as an admin
    When I should see the "query" field
    Then I fill in the "query" field with "test"
    Then I press the "Go" button
    Then I should see the "results-count" class

  Scenario Outline: I can access the search, advanced search and reports from any page
    Given I am logged in as an admin
    When I access "<page>"
    Then I should see a "Advanced Search" button on the page
    Then I should see a "REPORTS" button on the page
    Then I should see the "query" field
    Examples:
      | page |
      | new child page |
      | system settings page |
      | create form page |