Feature: Fishbowl
    As a host user
    I can share the screen

    Scenario: Host user can see the screen share button
        Given a logged user
        And doesn't have host role
        And a started fishbowl
        When navigates to fishbowl
        And clicks on "Join the fishbowl" button
        Then can click on the feedback button
        And sees the feedback form
