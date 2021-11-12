/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { User } from '@/types/user'

export type Fishbowl = {
  id: string;
  name: string;
  description?: string;
  slug: string;
  locale: string;
  host?: User;
  currentStatus: string;
  participants?: (first?: number, last?: number, before?: string, after?: string) => ParticipantConnection;
  startDateTimeTz: string;
  endDateTimeTz: string;
  durationFormatted: string;
};

type ParticipantConnection = {
  edges?: ParticipantEdge[];
  pageInfo: ParticipantPageInfo;
  totalCount: number;
}

type ParticipantEdge = {
  node?: Participant;
  cursor: string;
}

type ParticipantPageInfo = {
  endCursor?: string;
  startCursor?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

type Participant = {
  id: string;
  user?: UserItem;
  guest?: Guest;
  lastPing: string;
  fishbowl?: Fishbowl;
}

type Guest = {
  id: string;
}

type UserItem = {
  id: string;
  name: string;
  surnames: string;
  email: string;
  locale: string;
  publicLinkedinProfile?: string;
  publicTwitterProfile?: string;
}

// type Mutation {
//   """Introduces a Fishbowl."""
//   introduceFishbowl(input: introduceFishbowlInput!): introduceFishbowlPayload

//   """Runs a Fishbowl."""
//   runFishbowl(input: runFishbowlInput!): runFishbowlPayload

//   """Finishs a Fishbowl."""
//   finishFishbowl(input: finishFishbowlInput!): finishFishbowlPayload

//   """Updates a Fishbowl."""
//   updateFishbowl(input: updateFishbowlInput!): updateFishbowlPayload

//   """Creates a Fishbowl."""
//   createFishbowl(input: createFishbowlInput!): createFishbowlPayload

//   """Updates a User."""
//   updateUser(input: updateUserInput!): updateUserPayload

//   """Creates a User."""
//   createUser(input: createUserInput!): createUserPayload

//   """ChangePasswords a User."""
//   changePasswordUser(input: changePasswordUserInput!): changePasswordUserPayload

//   """ChangePasswordLoggeds a User."""
//   changePasswordLoggedUser(input: changePasswordLoggedUserInput!): changePasswordLoggedUserPayload

//   """Deletes a Participant."""
//   deleteParticipant(input: deleteParticipantInput!): deleteParticipantPayload

//   """Updates a Participant."""
//   updateParticipant(input: updateParticipantInput!): updateParticipantPayload

//   """Creates a Participant."""
//   createParticipant(input: createParticipantInput!): createParticipantPayload

//   """Creates a Guest."""
//   createGuest(input: createGuestInput!): createGuestPayload

//   """Creates a ResetPassword."""
//   createResetPassword(input: createResetPasswordInput!): createResetPasswordPayload
// }

// """A node, according to the Relay specification."""
// interface Node {
//   """The id of this node."""
//   id: ID!
// }

// type Participant implements Node {
//   id: ID!
//   user: UserItem
//   guest: Guest
//   lastPing: String!
//   fishbowl: Fishbowl
// }

// """Connection for Participant."""
// type ParticipantConnection {
//   edges: [ParticipantEdge]
//   pageInfo: ParticipantPageInfo!
//   totalCount: Int!
// }

// """Edge of Participant."""
// type ParticipantEdge {
//   node: Participant
//   cursor: String!
// }

// """Information about the current page."""
// type ParticipantPageInfo {
//   endCursor: String
//   startCursor: String
//   hasNextPage: Boolean!
//   hasPreviousPage: Boolean!
// }

// type Query {
//   node(id: ID!): Node
//   bySlugQueryFishbowl(slug: String!): Fishbowl
//   isCreatorOfFishbowl(slug: String!): Fishbowl
//   user(id: ID!): UserItem
//   selfUser: User
//   participant(id: ID!): Participant
//   participants(
//     """Returns the first n elements from the list."""
//     first: Int

//     """Returns the last n elements from the list."""
//     last: Int

//     """
//     Returns the elements in the list that come before the specified cursor.
//     """
//     before: String

//     """
//     Returns the elements in the list that come after the specified cursor.
//     """
//     after: String
//   ): ParticipantConnection
// }

// type ResetPassword implements Node {
//   id: ID!
//   email: String!
//   locale: String!
// }

// type User implements Node {
//   id: ID!
//   name: String!
//   surnames: String!
//   email: String!
//   allowShareData: Boolean!
//   linkedinProfile: String
//   twitterProfile: String
//   locale: String!
// }

// type UserItem implements Node {
//   id: ID!
//   name: String!
//   surnames: String!
//   email: String!
//   locale: String!
//   publicLinkedinProfile: String
//   publicTwitterProfile: String
// }

// input changePasswordLoggedUserInput {
//   password: String!
//   newPassword: String!
//   newPasswordConfirmation: String!
//   clientMutationId: String
// }

// type changePasswordLoggedUserPayload {
//   user: UserItem
//   clientMutationId: String
// }

// input changePasswordUserInput {
//   token: String!
//   password: String!
//   passwordConfirmation: String!
//   clientMutationId: String
// }

// type changePasswordUserPayload {
//   user: UserItem
//   clientMutationId: String
// }

// input createFishbowlInput {
//   name: String!
//   description: String
//   startDateTime: String!
//   timezone: String!
//   locale: String!
//   duration: String!
//   clientMutationId: String
// }

// type createFishbowlPayload {
//   fishbowl: Fishbowl
//   clientMutationId: String
// }

// input createGuestInput {
//   name: String!
//   clientMutationId: String
// }

// type createGuestPayload {
//   guest: Guest
//   clientMutationId: String
// }

// input createParticipantInput {
//   clientMutationId: String
// }

// type createParticipantPayload {
//   participant: Participant
//   clientMutationId: String
// }

// input createResetPasswordInput {
//   email: String!
//   locale: String!
//   clientMutationId: String
// }

// type createResetPasswordPayload {
//   resetPassword: ResetPassword
//   clientMutationId: String
// }

// input createUserInput {
//   name: String!
//   surnames: String!
//   email: String!
//   privacyPolicy: Boolean!
//   allowShareData: Boolean!
//   linkedinProfile: String
//   twitterProfile: String
//   locale: String!
//   plainPassword: String
//   clientMutationId: String
// }

// type createUserPayload {
//   user: UserItem
//   clientMutationId: String
// }

// input deleteParticipantInput {
//   id: ID!
//   clientMutationId: String
// }

// type deleteParticipantPayload {
//   participant: Participant
//   clientMutationId: String
// }

// input finishFishbowlInput {
//   slug: String!
//   clientMutationId: String
// }

// type finishFishbowlPayload {
//   fishbowl: Fishbowl
//   clientMutationId: String
// }

// input introduceFishbowlInput {
//   slug: String!
//   clientMutationId: String
// }

// type introduceFishbowlPayload {
//   fishbowl: Fishbowl
//   clientMutationId: String
// }

// input runFishbowlInput {
//   slug: String!
//   clientMutationId: String
// }

// type runFishbowlPayload {
//   fishbowl: Fishbowl
//   clientMutationId: String
// }

// input updateFishbowlInput {
//   id: ID!
//   name: String
//   description: String
//   startDateTime: String
//   timezone: String
//   locale: String
//   duration: String
//   clientMutationId: String
// }

// type updateFishbowlPayload {
//   fishbowl: Fishbowl
//   clientMutationId: String
// }

// input updateParticipantInput {
//   id: ID!
//   clientMutationId: String
// }

// type updateParticipantPayload {
//   participant: Participant
//   clientMutationId: String
// }

// input updateUserInput {
//   id: ID!
//   name: String
//   surnames: String
//   allowShareData: Boolean
//   linkedinProfile: String
//   twitterProfile: String
//   plainPassword: String
//   clientMutationId: String
// }

// type updateUserPayload {
//   user: updateUserPayloadData
//   clientMutationId: String
// }

// type updateUserPayloadData implements Node {
//   id: ID!
//   name: String
//   surnames: String
//   email: String
//   allowShareData: Boolean
//   linkedinProfile: String
//   twitterProfile: String
//   locale: String
// }
