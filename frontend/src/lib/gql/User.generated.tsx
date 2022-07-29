/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as Types from '../../types/graphql-codegen/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateUserMutationVariables = Types.Exact<{
  input: Types.CreateUserInput;
}>;

export type CreateUserMutation = {
  createUser?: Types.Maybe<{ user?: Types.Maybe<Pick<Types.UserItem, 'id' | 'name'>> }>;
};

export type UpdateUserMutationVariables = Types.Exact<{
  input: Types.UpdateUserInput;
}>;

export type UpdateUserMutation = {
  updateUser?: Types.Maybe<{
    user?: Types.Maybe<Pick<Types.UpdateUserPayloadData, 'id' | 'name' | 'surnames'>>;
  }>;
};

export type SelfUserQueryVariables = Types.Exact<{ [key: string]: never }>;

export type SelfUserQuery = {
  selfUser?: Types.Maybe<
    Pick<
      Types.User,
      'id' | 'name' | 'surnames' | 'email' | 'allowShareData' | 'linkedinProfile' | 'twitterProfile'
    >
  >;
};

export const CreateUserDocument = gql`
  mutation CreateUser($input: createUserInput!) {
    createUser(input: $input) {
      user {
        id
        name
      }
    }
  }
`;
export type CreateUserMutationFn = Apollo.MutationFunction<
  CreateUserMutation,
  CreateUserMutationVariables
>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(
    CreateUserDocument,
    options
  );
}
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<
  CreateUserMutation,
  CreateUserMutationVariables
>;
export const UpdateUserDocument = gql`
  mutation UpdateUser($input: updateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        name
        surnames
      }
    }
  }
`;
export type UpdateUserMutationFn = Apollo.MutationFunction<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    options
  );
}
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;
export const SelfUserDocument = gql`
  query SelfUser {
    selfUser {
      id
      name
      surnames
      email
      allowShareData
      linkedinProfile
      twitterProfile
    }
  }
`;

/**
 * __useSelfUserQuery__
 *
 * To run a query within a React component, call `useSelfUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelfUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelfUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useSelfUserQuery(
  baseOptions?: Apollo.QueryHookOptions<SelfUserQuery, SelfUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SelfUserQuery, SelfUserQueryVariables>(SelfUserDocument, options);
}
export function useSelfUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SelfUserQuery, SelfUserQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SelfUserQuery, SelfUserQueryVariables>(SelfUserDocument, options);
}
export type SelfUserQueryHookResult = ReturnType<typeof useSelfUserQuery>;
export type SelfUserLazyQueryHookResult = ReturnType<typeof useSelfUserLazyQuery>;
export type SelfUserQueryResult = Apollo.QueryResult<SelfUserQuery, SelfUserQueryVariables>;
