Feature: Fishbowl
    As a host user
    I can access the fishbowl page

    Scenario: Logged users can see information about future fishbowl
        Given a logged user
        When navigates to future fishbowl
        Then sees tomorrow fishbowl information page

    Scenario: Host user can start and finish a fishbowl
        Given a logged user
        And a fishbowl
        When navigates to fishbowl
        And can access to pre fishbowl
        And clicks on "Enter fishbowl"
        And sees the prefishbowl page
        And starts fishbowl
        Then finishes a fishbowl
