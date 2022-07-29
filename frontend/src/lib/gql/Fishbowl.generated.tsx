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
export type CreateFishbowlMutationVariables = Types.Exact<{
  input: Types.CreateFishbowlInput;
}>;

export type CreateFishbowlMutation = {
  createFishbowl?: Types.Maybe<{
    fishbowl?: Types.Maybe<
      Pick<
        Types.Fishbowl,
        | 'id'
        | 'name'
        | 'slug'
        | 'description'
        | 'locale'
        | 'startDateTimeTz'
        | 'endDateTimeTz'
        | 'isFishbowlNow'
        | 'hasIntroduction'
      >
    >;
  }>;
};

export type UpdateFishbowlMutationVariables = Types.Exact<{
  input: Types.UpdateFishbowlInput;
}>;

export type UpdateFishbowlMutation = {
  updateFishbowl?: Types.Maybe<{
    fishbowl?: Types.Maybe<
      Pick<
        Types.Fishbowl,
        | 'id'
        | 'name'
        | 'description'
        | 'startDateTimeTz'
        | 'timezone'
        | 'locale'
        | 'duration'
        | 'durationFormatted'
        | 'isFishbowlNow'
        | 'hasIntroduction'
      >
    >;
  }>;
};

export type BySlugQueryFishbowlQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
}>;

export type BySlugQueryFishbowlQuery = {
  bySlugQueryFishbowl?: Types.Maybe<
    Pick<
      Types.Fishbowl,
      | 'id'
      | 'name'
      | 'slug'
      | 'description'
      | 'locale'
      | 'startDateTimeTz'
      | 'endDateTimeTz'
      | 'durationFormatted'
      | 'isFishbowlNow'
      | 'hasIntroduction'
      | 'currentStatus'
    >
  >;
};

export type IsCreatorOfFishbowlQueryVariables = Types.Exact<{
  slug: Types.Scalars['String'];
}>;

export type IsCreatorOfFishbowlQuery = {
  isCreatorOfFishbowl?: Types.Maybe<Pick<Types.Fishbowl, 'currentStatus'>>;
};

export type NoIntroRunFishbowlMutationVariables = Types.Exact<{
  input: Types.NoIntroRunFishbowlInput;
}>;

export type NoIntroRunFishbowlMutation = {
  noIntroRunFishbowl?: Types.Maybe<{
    fishbowl?: Types.Maybe<Pick<Types.Fishbowl, 'currentStatus'>>;
  }>;
};

export type IntroduceFishbowlMutationVariables = Types.Exact<{
  input: Types.IntroduceFishbowlInput;
}>;

export type IntroduceFishbowlMutation = {
  introduceFishbowl?: Types.Maybe<{
    fishbowl?: Types.Maybe<Pick<Types.Fishbowl, 'currentStatus'>>;
  }>;
};

export type RunFishbowlMutationVariables = Types.Exact<{
  input: Types.RunFishbowlInput;
}>;

export type RunFishbowlMutation = {
  runFishbowl?: Types.Maybe<{ fishbowl?: Types.Maybe<Pick<Types.Fishbowl, 'currentStatus'>> }>;
};

export type FinishFishbowlMutationVariables = Types.Exact<{
  input: Types.FinishFishbowlInput;
}>;

export type FinishFishbowlMutation = {
  finishFishbowl?: Types.Maybe<{ fishbowl?: Types.Maybe<Pick<Types.Fishbowl, 'currentStatus'>> }>;
};

export type CreateGuestMutationVariables = Types.Exact<{
  input: Types.CreateGuestInput;
}>;

export type CreateGuestMutation = {
  createGuest?: Types.Maybe<{ guest?: Types.Maybe<Pick<Types.Guest, 'id'>> }>;
};

export const CreateFishbowlDocument = gql`
  mutation CreateFishbowl($input: createFishbowlInput!) {
    createFishbowl(input: $input) {
      fishbowl {
        id
        name
        slug
        description
        locale
        startDateTimeTz
        endDateTimeTz
        isFishbowlNow
        hasIntroduction
      }
    }
  }
`;
export type CreateFishbowlMutationFn = Apollo.MutationFunction<
  CreateFishbowlMutation,
  CreateFishbowlMutationVariables
>;

/**
 * __useCreateFishbowlMutation__
 *
 * To run a mutation, you first call `useCreateFishbowlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFishbowlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFishbowlMutation, { data, loading, error }] = useCreateFishbowlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFishbowlMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateFishbowlMutation, CreateFishbowlMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateFishbowlMutation, CreateFishbowlMutationVariables>(
    CreateFishbowlDocument,
    options
  );
}
export type CreateFishbowlMutationHookResult = ReturnType<typeof useCreateFishbowlMutation>;
export type CreateFishbowlMutationResult = Apollo.MutationResult<CreateFishbowlMutation>;
export type CreateFishbowlMutationOptions = Apollo.BaseMutationOptions<
  CreateFishbowlMutation,
  CreateFishbowlMutationVariables
>;
export const UpdateFishbowlDocument = gql`
  mutation UpdateFishbowl($input: updateFishbowlInput!) {
    updateFishbowl(input: $input) {
      fishbowl {
        id
        name
        description
        startDateTimeTz
        timezone
        locale
        duration
        durationFormatted
        isFishbowlNow
        hasIntroduction
      }
    }
  }
`;
export type UpdateFishbowlMutationFn = Apollo.MutationFunction<
  UpdateFishbowlMutation,
  UpdateFishbowlMutationVariables
>;

/**
 * __useUpdateFishbowlMutation__
 *
 * To run a mutation, you first call `useUpdateFishbowlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFishbowlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFishbowlMutation, { data, loading, error }] = useUpdateFishbowlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateFishbowlMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateFishbowlMutation, UpdateFishbowlMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateFishbowlMutation, UpdateFishbowlMutationVariables>(
    UpdateFishbowlDocument,
    options
  );
}
export type UpdateFishbowlMutationHookResult = ReturnType<typeof useUpdateFishbowlMutation>;
export type UpdateFishbowlMutationResult = Apollo.MutationResult<UpdateFishbowlMutation>;
export type UpdateFishbowlMutationOptions = Apollo.BaseMutationOptions<
  UpdateFishbowlMutation,
  UpdateFishbowlMutationVariables
>;
export const BySlugQueryFishbowlDocument = gql`
  query BySlugQueryFishbowl($slug: String!) {
    bySlugQueryFishbowl(slug: $slug) {
      id
      name
      slug
      description
      locale
      startDateTimeTz
      endDateTimeTz
      durationFormatted
      slug
      isFishbowlNow
      hasIntroduction
      currentStatus
    }
  }
`;

/**
 * __useBySlugQueryFishbowlQuery__
 *
 * To run a query within a React component, call `useBySlugQueryFishbowlQuery` and pass it any options that fit your needs.
 * When your component renders, `useBySlugQueryFishbowlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBySlugQueryFishbowlQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useBySlugQueryFishbowlQuery(
  baseOptions: Apollo.QueryHookOptions<BySlugQueryFishbowlQuery, BySlugQueryFishbowlQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<BySlugQueryFishbowlQuery, BySlugQueryFishbowlQueryVariables>(
    BySlugQueryFishbowlDocument,
    options
  );
}
export function useBySlugQueryFishbowlLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    BySlugQueryFishbowlQuery,
    BySlugQueryFishbowlQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<BySlugQueryFishbowlQuery, BySlugQueryFishbowlQueryVariables>(
    BySlugQueryFishbowlDocument,
    options
  );
}
export type BySlugQueryFishbowlQueryHookResult = ReturnType<typeof useBySlugQueryFishbowlQuery>;
export type BySlugQueryFishbowlLazyQueryHookResult = ReturnType<
  typeof useBySlugQueryFishbowlLazyQuery
>;
export type BySlugQueryFishbowlQueryResult = Apollo.QueryResult<
  BySlugQueryFishbowlQuery,
  BySlugQueryFishbowlQueryVariables
>;
export const IsCreatorOfFishbowlDocument = gql`
  query IsCreatorOfFishbowl($slug: String!) {
    isCreatorOfFishbowl(slug: $slug) {
      currentStatus
    }
  }
`;

/**
 * __useIsCreatorOfFishbowlQuery__
 *
 * To run a query within a React component, call `useIsCreatorOfFishbowlQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsCreatorOfFishbowlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsCreatorOfFishbowlQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useIsCreatorOfFishbowlQuery(
  baseOptions: Apollo.QueryHookOptions<IsCreatorOfFishbowlQuery, IsCreatorOfFishbowlQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<IsCreatorOfFishbowlQuery, IsCreatorOfFishbowlQueryVariables>(
    IsCreatorOfFishbowlDocument,
    options
  );
}
export function useIsCreatorOfFishbowlLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    IsCreatorOfFishbowlQuery,
    IsCreatorOfFishbowlQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<IsCreatorOfFishbowlQuery, IsCreatorOfFishbowlQueryVariables>(
    IsCreatorOfFishbowlDocument,
    options
  );
}
export type IsCreatorOfFishbowlQueryHookResult = ReturnType<typeof useIsCreatorOfFishbowlQuery>;
export type IsCreatorOfFishbowlLazyQueryHookResult = ReturnType<
  typeof useIsCreatorOfFishbowlLazyQuery
>;
export type IsCreatorOfFishbowlQueryResult = Apollo.QueryResult<
  IsCreatorOfFishbowlQuery,
  IsCreatorOfFishbowlQueryVariables
>;
export const NoIntroRunFishbowlDocument = gql`
  mutation NoIntroRunFishbowl($input: noIntroRunFishbowlInput!) {
    noIntroRunFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;
export type NoIntroRunFishbowlMutationFn = Apollo.MutationFunction<
  NoIntroRunFishbowlMutation,
  NoIntroRunFishbowlMutationVariables
>;

/**
 * __useNoIntroRunFishbowlMutation__
 *
 * To run a mutation, you first call `useNoIntroRunFishbowlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNoIntroRunFishbowlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [noIntroRunFishbowlMutation, { data, loading, error }] = useNoIntroRunFishbowlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useNoIntroRunFishbowlMutation(
  baseOptions?: Apollo.MutationHookOptions<
    NoIntroRunFishbowlMutation,
    NoIntroRunFishbowlMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<NoIntroRunFishbowlMutation, NoIntroRunFishbowlMutationVariables>(
    NoIntroRunFishbowlDocument,
    options
  );
}
export type NoIntroRunFishbowlMutationHookResult = ReturnType<typeof useNoIntroRunFishbowlMutation>;
export type NoIntroRunFishbowlMutationResult = Apollo.MutationResult<NoIntroRunFishbowlMutation>;
export type NoIntroRunFishbowlMutationOptions = Apollo.BaseMutationOptions<
  NoIntroRunFishbowlMutation,
  NoIntroRunFishbowlMutationVariables
>;
export const IntroduceFishbowlDocument = gql`
  mutation IntroduceFishbowl($input: introduceFishbowlInput!) {
    introduceFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;
export type IntroduceFishbowlMutationFn = Apollo.MutationFunction<
  IntroduceFishbowlMutation,
  IntroduceFishbowlMutationVariables
>;

/**
 * __useIntroduceFishbowlMutation__
 *
 * To run a mutation, you first call `useIntroduceFishbowlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIntroduceFishbowlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [introduceFishbowlMutation, { data, loading, error }] = useIntroduceFishbowlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useIntroduceFishbowlMutation(
  baseOptions?: Apollo.MutationHookOptions<
    IntroduceFishbowlMutation,
    IntroduceFishbowlMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<IntroduceFishbowlMutation, IntroduceFishbowlMutationVariables>(
    IntroduceFishbowlDocument,
    options
  );
}
export type IntroduceFishbowlMutationHookResult = ReturnType<typeof useIntroduceFishbowlMutation>;
export type IntroduceFishbowlMutationResult = Apollo.MutationResult<IntroduceFishbowlMutation>;
export type IntroduceFishbowlMutationOptions = Apollo.BaseMutationOptions<
  IntroduceFishbowlMutation,
  IntroduceFishbowlMutationVariables
>;
export const RunFishbowlDocument = gql`
  mutation RunFishbowl($input: runFishbowlInput!) {
    runFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;
export type RunFishbowlMutationFn = Apollo.MutationFunction<
  RunFishbowlMutation,
  RunFishbowlMutationVariables
>;

/**
 * __useRunFishbowlMutation__
 *
 * To run a mutation, you first call `useRunFishbowlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRunFishbowlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [runFishbowlMutation, { data, loading, error }] = useRunFishbowlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRunFishbowlMutation(
  baseOptions?: Apollo.MutationHookOptions<RunFishbowlMutation, RunFishbowlMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RunFishbowlMutation, RunFishbowlMutationVariables>(
    RunFishbowlDocument,
    options
  );
}
export type RunFishbowlMutationHookResult = ReturnType<typeof useRunFishbowlMutation>;
export type RunFishbowlMutationResult = Apollo.MutationResult<RunFishbowlMutation>;
export type RunFishbowlMutationOptions = Apollo.BaseMutationOptions<
  RunFishbowlMutation,
  RunFishbowlMutationVariables
>;
export const FinishFishbowlDocument = gql`
  mutation FinishFishbowl($input: finishFishbowlInput!) {
    finishFishbowl(input: $input) {
      fishbowl {
        currentStatus
      }
    }
  }
`;
export type FinishFishbowlMutationFn = Apollo.MutationFunction<
  FinishFishbowlMutation,
  FinishFishbowlMutationVariables
>;

/**
 * __useFinishFishbowlMutation__
 *
 * To run a mutation, you first call `useFinishFishbowlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFinishFishbowlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [finishFishbowlMutation, { data, loading, error }] = useFinishFishbowlMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFinishFishbowlMutation(
  baseOptions?: Apollo.MutationHookOptions<FinishFishbowlMutation, FinishFishbowlMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<FinishFishbowlMutation, FinishFishbowlMutationVariables>(
    FinishFishbowlDocument,
    options
  );
}
export type FinishFishbowlMutationHookResult = ReturnType<typeof useFinishFishbowlMutation>;
export type FinishFishbowlMutationResult = Apollo.MutationResult<FinishFishbowlMutation>;
export type FinishFishbowlMutationOptions = Apollo.BaseMutationOptions<
  FinishFishbowlMutation,
  FinishFishbowlMutationVariables
>;
export const CreateGuestDocument = gql`
  mutation CreateGuest($input: createGuestInput!) {
    createGuest(input: $input) {
      guest {
        id
      }
    }
  }
`;
export type CreateGuestMutationFn = Apollo.MutationFunction<
  CreateGuestMutation,
  CreateGuestMutationVariables
>;

/**
 * __useCreateGuestMutation__
 *
 * To run a mutation, you first call `useCreateGuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGuestMutation, { data, loading, error }] = useCreateGuestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGuestMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateGuestMutation, CreateGuestMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateGuestMutation, CreateGuestMutationVariables>(
    CreateGuestDocument,
    options
  );
}
export type CreateGuestMutationHookResult = ReturnType<typeof useCreateGuestMutation>;
export type CreateGuestMutationResult = Apollo.MutationResult<CreateGuestMutation>;
export type CreateGuestMutationOptions = Apollo.BaseMutationOptions<
  CreateGuestMutation,
  CreateGuestMutationVariables
>;
