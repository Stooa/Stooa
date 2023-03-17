Feature: Finished Fishbowl List
  As a Stooa user
  I can access the finished fishbowl list page

#    Scenario: Non logged users cannot access to fishbowl list
#        Given a non logged user
#        When navigates to "/fishbowl/finished"
#        Then gets redirect to "/register"

#    Scenario: Logged users can have multiple finished fishbowls on its list
#        Given a logged user
#        And a desktop computer
#        And a list of multiple finished fishbowls
#        When navigates to "/fishbowl/finished"
#        Then sees the fishbowl list page with multiple finished fishbowls

    Scenario: Logged user enters to a finished fishbowl from the list
        Given a logged user
        And a desktop computer
        And a list of multiple finished fishbowls
        When navigates to "/fishbowl/finished"
        And clicks on "First fishbowl"
        Then sees the finished fishbowl details
