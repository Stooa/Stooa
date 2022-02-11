Feature: Fishbowl List
  As a Stooa user
  I can access the fishbowl list page

  Scenario: Non logged users cannot access to fishbowl list
    Given a non logged user
    When navigates to "/fishbowl/list"
    Then gets redirect to "/register"

  Scenario: Logged users can access to fishbowl list
    Given a logged user
    When navigates to "/"
    And clicks on its profile
    And clicks on "Fishbowl list" link
    Then sees the fishbowl list page
