Feature: Edit fishbowl
    As a Stooa user
    I can access the fishbowl list page and edit a fishbowl

    Scenario: Logged users can access to fishbowl list
        Given a logged user
        And a list of one fishbowl
        When navigates to "/fishbowl/finished"
        And clicks on fishbowl card
        Then sees the fishbowl edit form full of information

    Scenario: Logged users can edit a fishbowl
        Given a logged user
        And a list of one fishbowl
        When navigates to "/fishbowl/finished"
        And clicks on fishbowl card
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
        And saves the changes
        Then sees the success message
        And sees the fishbowl list updated

    Scenario: Logged user sees placeholder when no fishbowl selected
        Given a logged user
        And a desktop computer
        And a list of one fishbowl
        When navigates to "/fishbowl/finished"
        Then sees the placeholder area

    Scenario: Logged user clicks on fishbowl that is about to start
        Given a logged user
        And a list of one fishbowl that is about to start
        When navigates to "/fishbowl/finished"
        Then clicks on fishbowl card that is about to start
        And sees a placeholder with Enter Fishbowl button
        And clicks on placeholders Enter Fishbowl link
        And gets redirect to "/fb/test-me-fishbowl"

