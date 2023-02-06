Feature: Fishbowl
    As a host user
    I can record the fishbowl

    Scenario: Host user can record the fishbowl
        Given a logged user
        And has host role
        And a fishbowl
        When navigates to fishbowl
        And can access to pre join
        And clicks on "Join the fishbowl" button
        And sees the prefishbowl page
        And starts fishbowl
        Then can click on more options button
        And can click on record button
        And can click on start recording button from modal
