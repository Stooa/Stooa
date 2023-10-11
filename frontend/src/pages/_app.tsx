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
import localFont from '@next/font/local';

import 'react-datepicker/dist/react-datepicker.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import 'react-toastify/dist/ReactToastify.css';

import OpenGraphDefault from '@/components/Common/OpenGraphDefault';
import { StateProvider } from '@/contexts/AppContext';
import { AuthProvider, ProtectRoute } from '@/contexts/AuthContext';
import { pushPageViewDataLayer } from '@/lib/analytics';
import DataProvider from '@/lib/apollo-client';
import GlobalStyles from '@/ui/Globals';

const geomanist = localFont({
  src: [
    {
      path: './fonts/geomanist-bold.woff2',
      weight: '700',
      style: 'normal'
    },
    {
      path: './fonts/geomanist-medium.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: './fonts/geomanist-medium-italic.woff2',
      weight: '500',
      style: 'italic'
    },
    {
      path: './fonts/geomanist-regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: './fonts/geomanist-regular-italic.woff2',
      weight: '400',
      style: 'italic'
    }
  ]
});

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
      <StateProvider>
        <AuthProvider>
          <ProtectRoute>
            <div className={geomanist.className}>
              <Component {...pageProps} />
            </div>
          </ProtectRoute>
        </AuthProvider>
      </StateProvider>
    </DataProvider>
  );
};

export default MyApp;
