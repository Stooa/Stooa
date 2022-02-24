Feature: Edit fishbowl
    As a Stooa user
    I can access the fishbowl list page and edit a fishbowl

    # Scenario: Logged users can access to fishbowl list
    #     Given a logged user
    #     And a list of one fishbowl
    #     And an updated fishbowl
    #     When navigates to "/"
    #     And clicks on "Linwood Hahn" button
    #     And clicks on "Fishbowl list" link
    #     And clicks on fishbowl card
    #     Then sees the fishbowl edit form full of information

    # Scenario: Logged users can edit a fishbowl
    #     Given a logged user
    #     And a list of one fishbowl
    #     And an updated fishbowl
    #     When navigates to "/fishbowl/list"
    #     And clicks on fishbowl card
    #     Then sees the fishbowl edit form full of information
    #     When modifies the fishbowl title
    #     And saves the changes
    #     Then sees the fishbowl list updated

    Scenario: Logged user sees placeholder when no fishbowl selected
        Given a logged user
        And a desktop computer
        And a list of one fishbowl
        When navigates to "/fishbowl/list"
        Then sees the placeholder area

    Scenario: Logged user tries to edit a fishbowl that is about to start
        Given a logged user
        And a list of one fishbowl that is about to start
        ## TODO: No se puede editar y que entre
