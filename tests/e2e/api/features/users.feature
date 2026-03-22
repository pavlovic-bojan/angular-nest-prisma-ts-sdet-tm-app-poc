Feature: Users API

  Background:
    Given I am authenticated

  Scenario: Get all users returns array of User schema
    Given I have created a user via API
    When I send a GET request to "/users"
    Then the response status is 200
    And the response is an array where each item matches User schema

  Scenario: Create user returns User schema
    When I send a POST request to "/users" with body
      """
      {"name":"New User","email":"new-USERID@example.com","password":"secret123","role":"user"}
      """
    Then the response status is 201
    And the response matches User schema
    And the response contains "name" with value "New User"
    And the response does not contain "password"

  Scenario: Get user by id returns User schema
    Given I have created a user via API
    When I send a GET request to "/users/$userId"
    Then the response status is 200
    And the response matches User schema

  Scenario: Get non-existent user returns 404
    When I send a GET request to "/users/non-existent-id"
    Then the response status is 404

  Scenario: Update user returns User schema
    Given I have created a user via API
    When I send a PUT request to "/users/$userId" with body
      """
      {"name":"Updated User"}
      """
    Then the response status is 200
    And the response matches User schema
    And the response contains "name" with value "Updated User"

  Scenario: Delete user returns DeleteResponse schema
    Given I have created a user via API
    When I send a DELETE request to "/users/$userId"
    Then the response status is 200
    And the response matches DeleteResponse schema
