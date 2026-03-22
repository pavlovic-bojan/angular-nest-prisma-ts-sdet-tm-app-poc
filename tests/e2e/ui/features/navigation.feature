Feature: Navigation

  Scenario: Logged-in user can navigate to Tasks
    Given I am logged in as demo user
    When I navigate to Users
    And I navigate to Tasks
    Then I should see the tasks page
    And I should be on the tasks page

  Scenario: Logged-in user can navigate to Users
    Given I am logged in as demo user
    When I navigate to Users
    Then I should see the users page
    And I should be on the users page

  Scenario: Logged-in user can navigate to Projects
    Given I am logged in as demo user
    When I navigate to Projects
    Then I should see the projects page
    And I should be on the projects page
