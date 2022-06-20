Feature: Fishbowl
    As a host user
    I can click the reactions button

    Scenario: Host user can click on reactions
        Given a logged user
        When access to a current fishbowl
        And starts fishbowl
        Then can clicks on reactions
