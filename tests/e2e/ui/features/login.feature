Feature: Login

  Scenario: User sees login page
    Given I am on the login page
    Then I should see the login page

  Scenario: Successful login with demo credentials
    Given I am on the login page
    When I login with email "demo@example.com" and password "password123"
    Then I should be redirected to the tasks page

  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I login with email "invalid@example.com" and password "wrongpass"
    Then I should see error message "Invalid"
