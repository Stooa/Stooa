Feature: Fishbowl
    As a user
    I can give my feedback
#     Scenario: User can see the feedback button and the from
#         Given a logged user
#         And doesn't have host role
#         And a not owned started fishbowl
#         When navigates to fishbowl
#         And clicks on "Join the fishbowl" button
#         Then can click on the feedback button
#         And sees the feedback form

#    Scenario: Logged user can give neutral feedback without comment
#         Given a logged user
#         And doesn't have host role
#         And a not owned started fishbowl
#         When navigates to fishbowl
#         And clicks on "Join the fishbowl" button
#         And clicks on the feedback button
#         And clicks the okay button
#         And sees the comment step
#         And skips the comment step
#         Then sees the end step

#    Scenario: Logged user can give feedback with comment
#         Given a logged user
#         And doesn't have host role
#         And a not owned started fishbowl
#         When navigates to fishbowl
#         And clicks on "Join the fishbowl" button
#         And clicks on the feedback button
#         And clicks the okay button
#         And sees the comment step
#         And writes in the comment step
#         And clicks on the comment send button
#         Then sees the end step

#    Scenario: Guest user can give feedback with comment and without mail
#         Given a non logged user
#         And doesn't have host role
#         And a not owned started fishbowl
#         When navigates to fishbowl
#         And clicks on "Join as guest user" button
#         And writes "Guestname" in input "name"
#         And clicks on "Join the fishbowl" button
#         And clicks on the feedback button
#         And clicks the okay button
#         And sees the comment step
#         And writes in the comment step
#         And clicks on the comment send button
#         And sees the mail step
#         And skips the mail step
#         Then sees the end step

#     Scenario: Guest user can give feedback with comment and mail
#         Given a non logged user
#         And doesn't have host role
#         And a not owned started fishbowl
#         When navigates to fishbowl
#         And clicks on "Join as guest user" button
#         And writes "Guestname" in input "name"
#         And clicks on "Join the fishbowl" button
#         And clicks on the feedback button
#         And clicks the okay button
#         And sees the comment step
#         And writes in the comment step
#         And clicks on the comment send button
#         And sees the mail step
#         And writes in the mail step
#         And clicks on the mail send button
#         Then sees the end step
