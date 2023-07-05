/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';

import ScriptLoader from '@/hocs/withScriptLoader';
import Error from '@/components/Common/Error';
import Loader from '@/components/Web/Loader';
import { Container } from '@/layouts/App/styles';
import { DevicesProvider } from '@/contexts/DevicesContext';
import Seo from '@/components/Web/Seo';

import { ToastContainer } from 'react-toastify';
import { ModalsProvider } from '@/contexts/ModalsContext';
import { IS_WORLD_CAFE_CREATOR } from '@/graphql/WorldCafe';

const scripts = ['https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js'];

interface Props {
  scriptsLoaded: boolean;
  scriptsLoadedSuccessfully: boolean;
  title: string;
  prejoin: boolean;
  children: React.ReactNode;
}

const WorldCafeApp = ({ scriptsLoaded, scriptsLoadedSuccessfully, title, children }: Props) => {
  const router = useRouter();
  const { fid } = router.query;

  const { loading, data: IsCreatorOfWorldCafe } = useQuery(IS_WORLD_CAFE_CREATOR, {
    variables: { slug: fid }
  });
  const [loadedJitsi, setLoadedJitsi] = useState(!!window.JitsiMeetJS);

  console.log('RADMONM', IsCreatorOfWorldCafe);

  const importJitsi = async () => {
    if (loadedJitsi) return;

    let importedJitsiMeetJs;

    try {
      // @ts-expect-error: lib-jitsi-meet not found
      importedJitsiMeetJs = (await import('lib-jitsi-meet')).default;
    } catch (error) {
      return;
    }

    window.JitsiMeetJS = importedJitsiMeetJs;

    setLoadedJitsi(true);
  };

  useEffect(() => {
    importJitsi();
  }, []);

  if (!scriptsLoaded || !loadedJitsi) return <Loader />;
  if (!scriptsLoadedSuccessfully || !loadedJitsi)
    return <Error message={'Could not create WORLDCAFE event'} />;

  if (loading) return <Loader />;
  const isModerator = !!IsCreatorOfWorldCafe && !!IsCreatorOfWorldCafe.isCreatorOfWorldCafe;

  return (
    <>
      <ModalsProvider isModerator={isModerator}>
        <DevicesProvider>
          <Seo title={title} />
          <Container>{children}</Container>
        </DevicesProvider>
      </ModalsProvider>
      <ToastContainer className="toastify-custom" />
    </>
  );
};

export default ScriptLoader(...scripts)(WorldCafeApp);
