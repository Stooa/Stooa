/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getAuthToken } from '@/user/auth';
import LocaleCookie from '@/lib/LocaleCookie';

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_API_DOMAIN}/graphql`
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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  link: authLink.concat(httpLink)
});

const DataProvider = ({ children }) => <ApolloProvider client={client}>{children}</ApolloProvider>;

export default DataProvider;
