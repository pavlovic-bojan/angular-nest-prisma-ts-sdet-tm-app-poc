Feature: Logout

  Scenario: User can logout
    Given I am logged in as demo user
    When I open user menu
    And I click Logout
    Then I should be on the login page
