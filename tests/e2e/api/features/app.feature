Feature: App health

  Scenario: Health endpoint returns status ok
    When I send a GET request to "/"
    Then the response status is 200
    And the response contains "status" with value "ok"
