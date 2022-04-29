Feature: Create fishbowl
    As a Stooa user
    I can create a fishbowl and be redirected to details

    Scenario: Logged users will be able to go to create a fishbowl
        Given a logged user
        And a created Fishbowl
        And a Fishbowl by slug
        When navigates to "/"
        And clicks on "Schedule a fishbowl" link
        Then gets redirect to "/fishbowl/create"
        And sees the create fishbowl form
        When writes "Updated fishbowl" in input "title"
        And writes "Updated description" in input "description"
        And writes "15/02/2030" in input "day"
        And writes "10:00" in input "time"
        And modifies the fishbowl "hours" selecting "04:00"
        And modifies the fishbowl "timezone" selecting "Antarctica/Vostok"
        And modifies the fishbowl "language" selecting "ca"
        And modifies the fishbowl "hasIntroduction" to true
        Then clicks submit button
        And sees the fishbowl created
        And sees the fishbowl by query
