Feature: Tasks

  Scenario: User can view tasks list after login
    Given I am logged in as demo user
    Then I should see the tasks list

  Scenario: Tasks page displays correctly
    Given I am logged in as demo user
    Then the tasks page should be displayed

  Scenario: User can open Add Task drawer
    Given I am logged in as demo user
    And I am on the tasks list
    When I click Add Task
    Then the task drawer should be visible

  Scenario: User can create a new task
    Given I am logged in as demo user
    And I am on the tasks list
    When I click Add Task
    And I fill task title "E2E Test Task"
    And I fill task description "Created by E2E"
    And I submit task form
    Then the tasks page should be displayed

  Scenario: User can cancel Add Task form
    Given I am logged in as demo user
    And I am on the tasks list
    When I click Add Task
    And I cancel task form
    Then the tasks page should be displayed

