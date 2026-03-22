Feature: Tasks API

  Background:
    Given I am authenticated

  Scenario: Get all tasks returns array of Task schema
    Given I have created a task via API
    When I send a GET request to "/tasks"
    Then the response status is 200
    And the response is an array where each item matches Task schema

  Scenario: Get tasks by projectId returns filtered array
    Given I have created a task via API
    When I send a GET request to "/tasks?projectId=$projectId"
    Then the response status is 200
    And the response is an array where each item matches Task schema

  Scenario: Create task returns Task schema
    Given I have created a project via API
    When I send a POST request to "/tasks" with body
      """
      {"title":"New Task","description":"Optional","projectId":"$projectId"}
      """
    Then the response status is 201
    And the response matches Task schema

  Scenario: Get task by id returns Task schema
    Given I have created a task via API
    When I send a GET request to "/tasks/$taskId"
    Then the response status is 200
    And the response matches Task schema

  Scenario: Get non-existent task returns 404
    When I send a GET request to "/tasks/non-existent-id"
    Then the response status is 404

  Scenario: Update task returns Task schema
    Given I have created a task via API
    When I send a PUT request to "/tasks/$taskId" with body
      """
      {"title":"Updated Task","status":"in-progress"}
      """
    Then the response status is 200
    And the response matches Task schema

  Scenario: Delete task returns DeleteResponse schema
    Given I have created a task via API
    When I send a DELETE request to "/tasks/$taskId"
    Then the response status is 200
    And the response matches DeleteResponse schema
