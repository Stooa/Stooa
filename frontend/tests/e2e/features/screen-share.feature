Feature: Fishbowl
    As a host user
    I can share the screen

    Scenario: Host user can see the screen share button
        Given a logged user
        And has host role
        And a fishbowl with introduction
        When navigates to fishbowl
        And can access to pre join
        And clicks on "Join the fishbowl" button
        And sees the prefishbowl page with introduction
        And starts fishbowl with introduction
        Then can click on screen share button
