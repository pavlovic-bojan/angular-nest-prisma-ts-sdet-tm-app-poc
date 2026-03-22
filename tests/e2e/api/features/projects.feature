Feature: Projects API

  Background:
    Given I am authenticated

  Scenario: Get all projects returns array of Project schema
    Given I have created a project via API
    When I send a GET request to "/projects"
    Then the response status is 200
    And the response is an array where each item matches Project schema

  Scenario: Create project returns Project schema
    When I send a POST request to "/projects" with body
      """
      {"name":"New Project","description":"Optional"}
      """
    Then the response status is 201
    And the response matches Project schema

  Scenario: Get project by id returns Project schema
    Given I have created a project via API
    When I send a GET request to "/projects/$projectId"
    Then the response status is 200
    And the response matches Project schema

  Scenario: Get non-existent project returns 404
    When I send a GET request to "/projects/non-existent-id"
    Then the response status is 404

  Scenario: Update project returns Project schema
    Given I have created a project via API
    When I send a PUT request to "/projects/$projectId" with body
      """
      {"name":"Updated Project","description":"Updated"}
      """
    Then the response status is 200
    And the response matches Project schema

  Scenario: Delete project returns DeleteResponse schema
    Given I have created a project via API
    When I send a DELETE request to "/projects/$projectId"
    Then the response status is 200
    And the response matches DeleteResponse schema
