Feature: Home
  As a Stooa user
  I can access the Home page

  Scenario: Non logged users can see the Home page
    Given a non logged user
    When navigates to "/"
    Then sees "Fluid and participative online dialogues"

  Scenario: Non logged users will be redirect to register when trying to create a fishbowl
    Given a non logged user
    When navigates to "/"
    And clicks on "Schedule a fishbowl" link
    Then gets redirect to "/register"
    And sees the register form

  Scenario: Non logged users will see login and register buttons on header
    Given a non logged user
    When navigates to "/"
    Then sees login and register buttons

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

  Scenario: Logged users can access to change its profile
    Given a logged user
    And a profile information
    When navigates to "/"
    And clicks on its profile
    And clicks on "Edit profile" link
    Then gets redirect to "/edit-profile"
    And sees the edit profile form

  Scenario: Logged users can access to change its password
    Given a logged user
    When navigates to "/"
    And clicks on its profile
    And clicks on "Change password" link
    Then gets redirect to "/change-password"
    And sees the change password form

  Scenario: Logged users can log out
    Given a logged user
    When navigates to "/"
    And clicks on its profile
    And clicks on "Log out" button
    Then no longer sees its profile
