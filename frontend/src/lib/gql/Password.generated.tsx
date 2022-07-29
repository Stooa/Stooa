import * as Types from '../../types/graphql-codegen/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateResetPasswordMutationVariables = Types.Exact<{
  input: Types.CreateResetPasswordInput;
}>;


export type CreateResetPasswordMutation = { createResetPassword?: Types.Maybe<{ resetPassword?: Types.Maybe<Pick<Types.ResetPassword, 'email'>> }> };

export type ChangePasswordMutationVariables = Types.Exact<{
  input: Types.ChangePasswordUserInput;
}>;


export type ChangePasswordMutation = { changePasswordUser?: Types.Maybe<{ user?: Types.Maybe<Pick<Types.UserItem, 'email'>> }> };

export type ChangePasswordLoggedMutationVariables = Types.Exact<{
  input: Types.ChangePasswordLoggedUserInput;
}>;


export type ChangePasswordLoggedMutation = { changePasswordLoggedUser?: Types.Maybe<{ user?: Types.Maybe<Pick<Types.UserItem, 'email'>> }> };


export const CreateResetPasswordDocument = gql`
    mutation CreateResetPassword($input: createResetPasswordInput!) {
  createResetPassword(input: $input) {
    resetPassword {
      email
    }
  }
}
    `;
export type CreateResetPasswordMutationFn = Apollo.MutationFunction<CreateResetPasswordMutation, CreateResetPasswordMutationVariables>;

/**
 * __useCreateResetPasswordMutation__
 *
 * To run a mutation, you first call `useCreateResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createResetPasswordMutation, { data, loading, error }] = useCreateResetPasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<CreateResetPasswordMutation, CreateResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateResetPasswordMutation, CreateResetPasswordMutationVariables>(CreateResetPasswordDocument, options);
      }
export type CreateResetPasswordMutationHookResult = ReturnType<typeof useCreateResetPasswordMutation>;
export type CreateResetPasswordMutationResult = Apollo.MutationResult<CreateResetPasswordMutation>;
export type CreateResetPasswordMutationOptions = Apollo.BaseMutationOptions<CreateResetPasswordMutation, CreateResetPasswordMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($input: changePasswordUserInput!) {
  changePasswordUser(input: $input) {
    user {
      email
    }
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ChangePasswordLoggedDocument = gql`
    mutation ChangePasswordLogged($input: changePasswordLoggedUserInput!) {
  changePasswordLoggedUser(input: $input) {
    user {
      email
    }
  }
}
    `;
export type ChangePasswordLoggedMutationFn = Apollo.MutationFunction<ChangePasswordLoggedMutation, ChangePasswordLoggedMutationVariables>;

/**
 * __useChangePasswordLoggedMutation__
 *
 * To run a mutation, you first call `useChangePasswordLoggedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordLoggedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordLoggedMutation, { data, loading, error }] = useChangePasswordLoggedMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangePasswordLoggedMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordLoggedMutation, ChangePasswordLoggedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordLoggedMutation, ChangePasswordLoggedMutationVariables>(ChangePasswordLoggedDocument, options);
      }
export type ChangePasswordLoggedMutationHookResult = ReturnType<typeof useChangePasswordLoggedMutation>;
export type ChangePasswordLoggedMutationResult = Apollo.MutationResult<ChangePasswordLoggedMutation>;
export type ChangePasswordLoggedMutationOptions = Apollo.BaseMutationOptions<ChangePasswordLoggedMutation, ChangePasswordLoggedMutationVariables>;