Feature: Create fishbowl
    As a Stooa user
    I can create a fishbowl and be redirected to details

    Scenario: Logged users will be able to go to create a fishbowl
        Given a logged user
        And a created Fishbowl
        And a Fishbowl by slug
        When navigates to "/fishbowl/create"
        And writes "Updated fishbowl" in input "title"
        And writes "Updated description" in input "description"
        And writes "15/02/2030" in input "day"
        And writes "10:00" in input "time"
        And modifies the fishbowl "hours" selecting "04:00"
        And modifies the fishbowl "timezone" selecting "Antarctica/Vostok"
        And modifies the fishbowl "language" selecting "ca"
        And modifies the fishbowl "hasIntroduction" to true
        And clicks submit button
        Then sees the fishbowl created
        And sees the fishbowl by query

    Scenario: Logged users will be able to go to create a private fishbowl
        Given a logged user
        And a created Fishbowl
        And a Fishbowl by slug
        When navigates to "/fishbowl/create"
        And writes "Updated fishbowl" in input "title"
        And writes "Updated description" in input "description"
        And writes "15/02/2030" in input "day"
        And writes "10:00" in input "time"
        And modifies the fishbowl "hours" selecting "04:00"
        And modifies the fishbowl "timezone" selecting "Antarctica/Vostok"
        And modifies the fishbowl "language" selecting "ca"
        And modifies the fishbowl "hasIntroduction" to true
        And modifies the fishbowl "isPrivate" to true
        And writes "password" in input "plainPassword"
        And clicks submit button
        Then sees the fishbowl created
        And sees the fishbowl by query
