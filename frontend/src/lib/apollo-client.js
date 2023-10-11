/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAuthToken } from '@/user/auth';
import LocaleCookie from '@/lib/LocaleCookie';
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
  console.log(response);
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri: `${
    typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_DOMAIN : 'https://backend-nginx'
  }/graphql`,
  credentials: 'same-origin'
});

const authLink = setContext(async (_, { headers }) => {
  const auth = await getAuthToken();
  const currentHeaders = headers ? { ...headers } : {};

  return {
    headers: {
      ...currentHeaders,
      'authorization': auth ? auth.authorizationString : null,
      'Accept-Language': LocaleCookie.getCurrentLocaleCookie()
    }
  };
});

export const createApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, authLink.concat(httpLink)]),
    ssrMode: typeof window === 'undefined'
  });
};

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  link: authLink.concat(httpLink)
});

// function createIsomorphLink() {
//   const { HttpLink } = require('@apollo/client/link/http');
//   return new HttpLink({
//     uri: 'http://localhost:4000/api/graphql',
//     credentials: 'same-origin'
//   });
// }

// export function createApolloClient() {
//   let defaultOptions;
//   if (typeof window === 'undefined') {
//     //We don't want any cache to be stored server side
//     defaultOptions = {
//       query: {
//         fetchPolicy: 'no-cache',
//         errorPolicy: 'all'
//       }
//     };
//   } else {
//     //We immediately show results, but check in the background if any changes occured, and eventually update the view
//     defaultOptions = {
//       query: {
//         fetchPolicy: 'cache-and-network',
//         errorPolicy: 'all'
//       }
//     };
//   }
//   return new ApolloClient({
//     ssrMode: typeof window === 'undefined',
//     link: createIsomorphLink(),
//     cache,
//     typeDefs,
//     defaultOptions
//   });
// }

const DataProvider = ({ children }) => (
  <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
);
export default DataProvider;
