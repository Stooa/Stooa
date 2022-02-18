Feature: Edit fishbowl
    As a Stooa user
    I can access the fishbowl list page and edit a fishbowl

    Scenario: Logged users can access to fishbowl list
        Given a logged user
        Given a list of one fishbowl
        When navigates to "/"
        And clicks on "Linwood Hahn" button
        And clicks on "Fishbowl list" link
        And clicks on "Fishbowl test" fishbowl title
        Then sees the fishbowl edit form with "Fishbowl test" title
