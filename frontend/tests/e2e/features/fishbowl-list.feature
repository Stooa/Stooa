Feature: Fishbowl List
  As a Stooa user
  I can access the fishbowl list page

  Scenario: Logged users will be able to go to create a fishbowl
    Given a logged user
    When navigates to "/"
    And clicks on "Schedule a fishbowl" link
    Then gets redirect to "/fishbowl/create"
    And sees the create fishbowl form

  Scenario: Logged users will see create fishbowl and profile buttons on header
    Given a logged user
    When navigates to "/"
    Then sees create fishbowl and profile buttons

  Scenario: Logged users can access to fishbowl list
    Given a logged user
    When navigates to "/"
    And clicks on its profile
    And clicks on "Fishbowl list" button
    Then no longer sees its profile
