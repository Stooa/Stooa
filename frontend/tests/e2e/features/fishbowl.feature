Feature: Fishbowl
    As a host user
    I can access the fishbowl page

#    Scenario: Logged users can see information about future fishbowl
#        Given a logged user
#        When navigates to "/fb/test-me-fishbowl"
#        Then sees tomorrow fishbowl information page

    Scenario: Host user can start and finish a fishbowl
        Given a logged user
        When navigates to "/fb/test-fishbowl"
        And can access to pre fishbowl
        And clicks on "Enter fishbowl"
        And sees the fishbowl page
        And starts fishbowl
        Then finishes a fishbowl
