Feature: Authentication

  Scenario: Login with valid credentials returns access token
    When I send a POST request to "/auth/login" with body
      """
      {"email":"demo@example.com","password":"password123"}
      """
    Then the response status is 200 or 201
    And the response matches LoginResponse schema
    And the response contains "access_token"
    And the response does not contain "password"

  Scenario: Login with invalid credentials returns 401
    When I send a POST request to "/auth/login" with body
      """
      {"email":"invalid@example.com","password":"wrongpass"}
      """
    Then the response status is 401
