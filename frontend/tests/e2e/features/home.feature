Feature: Home
  As a Stooa user
  I can access the Home page

  Scenario: User can see the Home page
    When navigates to "/"
    Then sees "The online fishbowl tool"

  Scenario: User will be redirect to register when trying to create a fishbowl
    When navigates to "/"
    And clicks on "Create a free fishbowl"
    Then gets redirect to "/register"
    And sees the register form
