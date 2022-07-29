export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Fishbowl = Node & {
  __typename?: 'Fishbowl';
  _id: Scalars['String'];
  currentStatus: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  duration: Scalars['String'];
  durationFormatted: Scalars['String'];
  endDateTimeTz: Scalars['String'];
  hasIntroduction: Scalars['Boolean'];
  host?: Maybe<User>;
  id: Scalars['ID'];
  isFishbowlNow: Scalars['Boolean'];
  locale: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  startDateTime: Scalars['String'];
  startDateTimeTz: Scalars['String'];
  timezone: Scalars['String'];
};

export type Guest = Node & {
  __typename?: 'Guest';
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** ChangePasswordLoggeds a User. */
  changePasswordLoggedUser?: Maybe<ChangePasswordLoggedUserPayload>;
  /** ChangePasswords a User. */
  changePasswordUser?: Maybe<ChangePasswordUserPayload>;
  /** Creates a Fishbowl. */
  createFishbowl?: Maybe<CreateFishbowlPayload>;
  /** Creates a Guest. */
  createGuest?: Maybe<CreateGuestPayload>;
  /** Creates a Participant. */
  createParticipant?: Maybe<CreateParticipantPayload>;
  /** Creates a ResetPassword. */
  createResetPassword?: Maybe<CreateResetPasswordPayload>;
  /** Creates a User. */
  createUser?: Maybe<CreateUserPayload>;
  /** Deletes a Participant. */
  deleteParticipant?: Maybe<DeleteParticipantPayload>;
  /** Finishs a Fishbowl. */
  finishFishbowl?: Maybe<FinishFishbowlPayload>;
  /** Introduces a Fishbowl. */
  introduceFishbowl?: Maybe<IntroduceFishbowlPayload>;
  /** NoIntroRuns a Fishbowl. */
  noIntroRunFishbowl?: Maybe<NoIntroRunFishbowlPayload>;
  /** Runs a Fishbowl. */
  runFishbowl?: Maybe<RunFishbowlPayload>;
  /** Updates a Fishbowl. */
  updateFishbowl?: Maybe<UpdateFishbowlPayload>;
  /** Updates a Participant. */
  updateParticipant?: Maybe<UpdateParticipantPayload>;
  /** Updates a User. */
  updateUser?: Maybe<UpdateUserPayload>;
};


export type MutationChangePasswordLoggedUserArgs = {
  input: ChangePasswordLoggedUserInput;
};


export type MutationChangePasswordUserArgs = {
  input: ChangePasswordUserInput;
};


export type MutationCreateFishbowlArgs = {
  input: CreateFishbowlInput;
};


export type MutationCreateGuestArgs = {
  input: CreateGuestInput;
};


export type MutationCreateParticipantArgs = {
  input: CreateParticipantInput;
};


export type MutationCreateResetPasswordArgs = {
  input: CreateResetPasswordInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationDeleteParticipantArgs = {
  input: DeleteParticipantInput;
};


export type MutationFinishFishbowlArgs = {
  input: FinishFishbowlInput;
};


export type MutationIntroduceFishbowlArgs = {
  input: IntroduceFishbowlInput;
};


export type MutationNoIntroRunFishbowlArgs = {
  input: NoIntroRunFishbowlInput;
};


export type MutationRunFishbowlArgs = {
  input: RunFishbowlInput;
};


export type MutationUpdateFishbowlArgs = {
  input: UpdateFishbowlInput;
};


export type MutationUpdateParticipantArgs = {
  input: UpdateParticipantInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

/** A node, according to the Relay specification. */
export type Node = {
  /** The id of this node. */
  id: Scalars['ID'];
};

export type Participant = Node & {
  __typename?: 'Participant';
  fishbowl?: Maybe<Fishbowl>;
  guest?: Maybe<Guest>;
  id: Scalars['ID'];
  lastPing: Scalars['String'];
  user?: Maybe<UserItem>;
};

/** Connection for Participant. */
export type ParticipantConnection = {
  __typename?: 'ParticipantConnection';
  edges?: Maybe<Array<Maybe<ParticipantEdge>>>;
  pageInfo: ParticipantPageInfo;
  totalCount: Scalars['Int'];
};

/** Edge of Participant. */
export type ParticipantEdge = {
  __typename?: 'ParticipantEdge';
  cursor: Scalars['String'];
  node?: Maybe<Participant>;
};

/** Information about the current page. */
export type ParticipantPageInfo = {
  __typename?: 'ParticipantPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  bySlugQueryFishbowl?: Maybe<Fishbowl>;
  isCreatorOfFishbowl?: Maybe<Fishbowl>;
  node?: Maybe<Node>;
  participant?: Maybe<Participant>;
  participants?: Maybe<ParticipantConnection>;
  selfUser?: Maybe<User>;
  user?: Maybe<UserItem>;
};


export type QueryBySlugQueryFishbowlArgs = {
  slug: Scalars['String'];
};


export type QueryIsCreatorOfFishbowlArgs = {
  slug: Scalars['String'];
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryParticipantArgs = {
  id: Scalars['ID'];
};


export type QueryParticipantsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type ResetPassword = Node & {
  __typename?: 'ResetPassword';
  email: Scalars['String'];
  id: Scalars['ID'];
  locale: Scalars['String'];
};

export type User = Node & {
  __typename?: 'User';
  allowShareData: Scalars['Boolean'];
  email: Scalars['String'];
  id: Scalars['ID'];
  linkedinProfile?: Maybe<Scalars['String']>;
  locale: Scalars['String'];
  name: Scalars['String'];
  surnames: Scalars['String'];
  twitterProfile?: Maybe<Scalars['String']>;
};

export type UserItem = Node & {
  __typename?: 'UserItem';
  email: Scalars['String'];
  id: Scalars['ID'];
  locale: Scalars['String'];
  name: Scalars['String'];
  publicLinkedinProfile?: Maybe<Scalars['String']>;
  publicTwitterProfile?: Maybe<Scalars['String']>;
  surnames: Scalars['String'];
};

export type ChangePasswordLoggedUserInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  newPassword: Scalars['String'];
  newPasswordConfirmation: Scalars['String'];
  password: Scalars['String'];
};

export type ChangePasswordLoggedUserPayload = {
  __typename?: 'changePasswordLoggedUserPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  user?: Maybe<UserItem>;
};

export type ChangePasswordUserInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  token: Scalars['String'];
};

export type ChangePasswordUserPayload = {
  __typename?: 'changePasswordUserPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  user?: Maybe<UserItem>;
};

export type CreateFishbowlInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  duration: Scalars['String'];
  hasIntroduction: Scalars['Boolean'];
  isFishbowlNow: Scalars['Boolean'];
  locale: Scalars['String'];
  name: Scalars['String'];
  startDateTime: Scalars['String'];
  timezone: Scalars['String'];
};

export type CreateFishbowlPayload = {
  __typename?: 'createFishbowlPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  fishbowl?: Maybe<Fishbowl>;
};

export type CreateGuestInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type CreateGuestPayload = {
  __typename?: 'createGuestPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  guest?: Maybe<Guest>;
};

export type CreateParticipantInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
};

export type CreateParticipantPayload = {
  __typename?: 'createParticipantPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  participant?: Maybe<Participant>;
};

export type CreateResetPasswordInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  locale: Scalars['String'];
};

export type CreateResetPasswordPayload = {
  __typename?: 'createResetPasswordPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  resetPassword?: Maybe<ResetPassword>;
};

export type CreateUserInput = {
  allowShareData: Scalars['Boolean'];
  clientMutationId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  linkedinProfile?: InputMaybe<Scalars['String']>;
  locale: Scalars['String'];
  name: Scalars['String'];
  plainPassword?: InputMaybe<Scalars['String']>;
  privacyPolicy: Scalars['Boolean'];
  surnames: Scalars['String'];
  twitterProfile?: InputMaybe<Scalars['String']>;
};

export type CreateUserPayload = {
  __typename?: 'createUserPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  user?: Maybe<UserItem>;
};

export type DeleteParticipantInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type DeleteParticipantPayload = {
  __typename?: 'deleteParticipantPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  participant?: Maybe<Participant>;
};

export type FinishFishbowlInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
};

export type FinishFishbowlPayload = {
  __typename?: 'finishFishbowlPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  fishbowl?: Maybe<Fishbowl>;
};

export type IntroduceFishbowlInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
};

export type IntroduceFishbowlPayload = {
  __typename?: 'introduceFishbowlPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  fishbowl?: Maybe<Fishbowl>;
};

export type NoIntroRunFishbowlInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
};

export type NoIntroRunFishbowlPayload = {
  __typename?: 'noIntroRunFishbowlPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  fishbowl?: Maybe<Fishbowl>;
};

export type RunFishbowlInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
};

export type RunFishbowlPayload = {
  __typename?: 'runFishbowlPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  fishbowl?: Maybe<Fishbowl>;
};

export type UpdateFishbowlInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['String']>;
  hasIntroduction?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  isFishbowlNow?: InputMaybe<Scalars['Boolean']>;
  locale?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  startDateTime?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
};

export type UpdateFishbowlPayload = {
  __typename?: 'updateFishbowlPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  fishbowl?: Maybe<Fishbowl>;
};

export type UpdateParticipantInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type UpdateParticipantPayload = {
  __typename?: 'updateParticipantPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  participant?: Maybe<Participant>;
};

export type UpdateUserInput = {
  allowShareData?: InputMaybe<Scalars['Boolean']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  linkedinProfile?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  plainPassword?: InputMaybe<Scalars['String']>;
  surnames?: InputMaybe<Scalars['String']>;
  twitterProfile?: InputMaybe<Scalars['String']>;
};

export type UpdateUserPayload = {
  __typename?: 'updateUserPayload';
  clientMutationId?: Maybe<Scalars['String']>;
  user?: Maybe<UpdateUserPayloadData>;
};

export type UpdateUserPayloadData = Node & {
  __typename?: 'updateUserPayloadData';
  allowShareData?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  linkedinProfile?: Maybe<Scalars['String']>;
  locale?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  surnames?: Maybe<Scalars['String']>;
  twitterProfile?: Maybe<Scalars['String']>;
};
