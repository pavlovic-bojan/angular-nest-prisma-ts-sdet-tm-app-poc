Feature: Users

  Scenario: User can view users list after login
    Given I am logged in as demo user
    When I navigate to Users
    Then I should see the users page

  Scenario: User can open Add User drawer
    Given I am logged in as demo user
    And I am on the users page
    When I click Add User
    Then I should see element "[data-testid='user-form']"

  Scenario: User can create a new user
    Given I am logged in as demo user
    And I am on the users page
    When I click Add User
    And I fill user name "E2E Test User"
    And I fill user email "e2e-user-USERID@example.com"
    And I fill user role "developer"
    And I submit user form
    Then I should see the users page

  Scenario: User can cancel Add User form
    Given I am logged in as demo user
    And I am on the users page
    When I click Add User
    And I cancel user form
    Then I should see the users page

  Scenario: User can view users list
    Given I am logged in as demo user
    And I am on the users page
    Then I should see the users list
