Feature: Fishbowl
    As a host user
    I can access the fishbowl page

#    Scenario: Logged users can see information about future fishbowl
#        Given a logged user
#        When navigates to "/fb/test-me-fishbowl"
#        Then sees tomorrow fishbowl information page

    Scenario: Logged users can access current fishbowl
        Given a logged user
        When navigates to "/fb/test-me-fishbowl"
        Then can access to pre fishbowl
        And clicks on "Enter fishbowl"
        And sees the fishbowl page
        And clicks on "Skip to the fishbowl"
        And clicks to close modal
        
