Feature: Fishbowl
    As a host user
    I can access the fishbowl page

    Scenario: Logged users can see information about future fishbowl
        Given a logged user
        When navigates to "/fb/test-me-fishbowl"
        Then sees tomorrow fishbowl information page
