Feature: Fishbowl
    As a user
    I can give my feedback

    Scenario: User can see the feedback button and the from
        Given a logged user
        And doesn't have host role
        And a not owned started fishbowl
        When navigates to fishbowl
        And clicks on "Join the fishbowl" button
        Then can click on the feedback button
        And sees the feedback form

   Scenario: Logged user can give neutral feedback without comment
        Given a logged user
        And doesn't have host role
        And a not owned started fishbowl
        When navigates to fishbowl
        And clicks on "Join the fishbowl" button
        And clicks on the feedback button
        And clicks the okay button
        And sees the comment step
        And skips the comment step
        Then sees the end step

   Scenario: Logged user can give neutral feedback with comment
        Given a logged user
        And doesn't have host role
        And a not owned started fishbowl
        When navigates to fishbowl
        And clicks on "Join the fishbowl" button
        And clicks on the feedback button
        And clicks the okay button
        And sees the comment step
        And writes in the comment step
        And clicks on the send button
        Then sees the end step
