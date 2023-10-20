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

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri: `${
    typeof window !== 'undefined' && process.env.NODE_ENV !== 'prod'
      ? process.env.NEXT_PUBLIC_API_DOMAIN
      : 'https://backend-nginx'
  }/graphql`,
  credentials: 'same-origin'
});

const authLink = setContext(async (_, { headers }) => {
  const auth = await getAuthToken();
  const currentHeaders = headers ? { ...headers } : {};

  console.log(
    'THE LINK ADDRESS',
    typeof window !== 'undefined' || process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_API_DOMAIN
      : 'https://backend-nginx'
  );

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

const DataProvider = ({ children }) => (
  <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
);
export default DataProvider;
