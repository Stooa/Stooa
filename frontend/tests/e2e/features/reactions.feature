Feature: Fishbowl
    As a host user
    I can click the reactions button

    Scenario: Host user can click on reactions
        Given a logged user
        And has host role
        And a fishbowl
        When navigates to fishbowl
        And can access to pre join
        And clicks on "Enter fishbowl"
        And sees the prefishbowl page
        And starts fishbowl
        Then can click on reactions
