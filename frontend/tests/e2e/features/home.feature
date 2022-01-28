Feature: Home
  As a Stooa user
  I can access the Home page

  Scenario: Non logged users can see the Home page
    Given a non logged user
    When navigates to "/"
    Then sees "The online fishbowl tool"

  Scenario: Non logged users will be redirect to register when trying to create a fishbowl
    Given a non logged user
    When navigates to "/"
    And clicks on "Create a free fishbowl"
    Then gets redirect to "/register"
    And sees the register form

  Scenario: Logged users will be able to go to create a fishbowl
    Given a logged user
    When navigates to "/"
    And clicks on "Create a free fishbowl"
    Then gets redirect to "/fishbowl/create"
    And sees the create fishbowl form
