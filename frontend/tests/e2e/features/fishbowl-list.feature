Feature: Fishbowl List
  As a Stooa user
  I can access the fishbowl list page

    Scenario: Non logged users cannot access to fishbowl list
        Given a non logged user
        When navigates to "/fishbowl/future"
        Then gets redirect to "/register"

    Scenario: Logged users can access to fishbowl list
        Given a logged user
        And a list of one fishbowl
        When navigates to "/"
        And clicks on its profile
        And clicks on "Future fishbowls" link
        Then sees the fishbowl list page with one fishbowl

    Scenario: Logged users can have multiple fishbowls on its list
        Given a logged user
        And a list of multiple fishbowls
        When navigates to "/fishbowl/future"
        Then sees the fishbowl list page with multiple fishbowls

    Scenario: Logged user has no fishbowls in the list
        Given a logged user
        And a list of empty fishbowls
        When navigates to "/fishbowl/future"
        Then sees the empty fishbowl list page

    Scenario: Logged user enters to a fishbowl from the list
        Given a logged user
        And a list of multiple fishbowls
        When navigates to "/fishbowl/future"
        Then clicks on "Enter fishbowl" link
        And gets redirect to "/fb/test-me-fishbowl"
