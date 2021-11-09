/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';
import Router from 'next/router';

import 'react-datepicker/dist/react-datepicker.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import OpenGraphDefault from 'components/Common/OpenGraphDefault';
import { StateProvider } from 'contexts/AppContext';
import { AuthProvider, ProtectRoute } from 'contexts/AuthContext';
import { pushPageViewDataLayer } from 'lib/analytics';
import DataProvider from 'lib/apollo-client';
import GlobalStyles from 'ui/Globals';

const MyApp = ({ Component, pageProps }) => {
  const handleRouteChange = (url: string) => pushPageViewDataLayer({ url });

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.log = function () {
        // Not empty function
      };

      pushPageViewDataLayer({ url: window.location.pathname });
      Router.events.on('routeChangeComplete', handleRouteChange);
    }

    return () => {
      if (process.env.NODE_ENV === 'production') {
        Router.events.off('routeChangeComplete', handleRouteChange);
      }
    };
  }, []);

  return (
    <DataProvider>
      <GlobalStyles />
      <OpenGraphDefault />
      <StateProvider>
        <AuthProvider>
          <ProtectRoute>
            <Component {...pageProps} />
          </ProtectRoute>
        </AuthProvider>
      </StateProvider>
    </DataProvider>
  );
};

export default MyApp;
