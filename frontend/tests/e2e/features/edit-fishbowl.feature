Feature: Edit fishbowl
    As a Stooa user
    I can access the fishbowl list page and edit a fishbowl

    Scenario: Logged users can access to fishbowl list
        Given a logged user
        And a list of one fishbowl
        And an updated fishbowl
        When navigates to "/"
        And clicks on "Linwood Hahn" button
        And clicks on "Fishbowl list" link
        And clicks on fishbowl title
        Then sees the fishbowl edit form full of information
        When clicks on modify fishbowl button
#        Then sees the fishbowl list updatedz
