Feature: Fishbowl
    As a host user
    I can access the fishbowl page

    Scenario: Logged users can see information about future fishbowl
        Given a logged user
        And has host role
        And a future fishbowl
        When navigates to fishbowl with slug "tomorrow-fishbowl"
        Then sees tomorrow fishbowl information page

    Scenario: Host user can start and finish a fishbowl
        Given a logged user
        And has host role
        And a fishbowl
        When navigates to fishbowl with slug "current-fishbowl"
        And can access to pre join
        And clicks on "Join the fishbowl" button
        And sees the prefishbowl page
        And starts fishbowl
        Then finishes a fishbowl

    Scenario: Host user can start and finish their own private fishbowl
        Given a logged user
        And has host role
        And a private fishbowl
        When navigates to fishbowl with slug "current-private-fishbowl"
        And can access to pre join
        And clicks on "Join the fishbowl" button
        And sees the prefishbowl page
        And starts fishbowl
        Then finishes a fishbowl

    Scenario: Non-host user can enter and see the prefishbowl page
        Given a logged user
        And doesn't have host role
        And a not owned fishbowl
        When navigates to fishbowl with slug "current-not-owned-fishbowl"
        And can access to pre join
        And clicks on "Join the fishbowl" button
        Then sees the prefishbowl page

    Scenario: Non-host user can enter and sees the password input
        Given a logged user
        And doesn't have host role
        And a private fishbowl
        When navigates to fishbowl with slug "current-not-owned-private-fishbowl"
        And can access to pre join
        Then sees the password input
        And writes the correct password
        And sees the prefishbowl page
