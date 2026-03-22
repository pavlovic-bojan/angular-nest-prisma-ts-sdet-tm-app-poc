Feature: Projects

  Scenario: User can view projects list after login
    Given I am logged in as demo user
    When I navigate to Projects
    Then I should see the projects page

  Scenario: User can open Add Project drawer
    Given I am logged in as demo user
    And I am on the projects page
    When I click Add Project
    Then I should see element "[data-testid='project-form']"

  Scenario: User can create a new project
    Given I am logged in as demo user
    And I am on the projects page
    When I click Add Project
    And I fill project name "E2E Test Project"
    And I fill project description "Created by E2E test"
    And I submit project form
    Then I should see the projects page

  Scenario: User can cancel Add Project form
    Given I am logged in as demo user
    And I am on the projects page
    When I click Add Project
    And I cancel project form
    Then I should see the projects page

  Scenario: User sees projects list
    Given I am logged in as demo user
    And I am on the projects page
    Then I should see the projects list
