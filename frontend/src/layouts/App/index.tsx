/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';

import { Fishbowl } from '@/types/api-platform';
import { IS_FISHBOWL_CREATOR } from '@/lib/gql/Fishbowl';
import { StooaProvider } from '@/contexts/StooaManager';
import ScriptLoader from '@/hocs/withScriptLoader';
import Error from '@/components/Common/Error';
import Loader from '@/components/Web/Loader';
import { Container } from '@/layouts/App/styles';
import { DevicesProvider } from '@/contexts/DevicesContext';
import Seo from '@/components/Web/Seo';

import { ToastContainer } from 'react-toastify';
import { ModalsProvider } from '@/contexts/ModalsContext';

const scripts = ['https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js'];

interface Props {
  data: Fishbowl;
  scriptsLoaded: boolean;
  scriptsLoadedSuccessfully: boolean;
  title: string;
  prejoin: boolean;
  className?: string;
}

const Layout: React.FC<Props> = ({
  className,
  data,
  scriptsLoaded,
  scriptsLoadedSuccessfully,
  title,
  children
}) => {
  const router = useRouter();
  const { fid } = router.query;
  const {
    loading,
    error,
    data: fbCreatorData
  } = useQuery(IS_FISHBOWL_CREATOR, { variables: { slug: fid } });
  const [loadedJitsi, setLoadedJitsi] = useState(false);

  const importJitsi = async () => {
    let importedJitsiMeetJs;
    try {
      // @ts-expect-error: lib-jitsi-meet not found
      importedJitsiMeetJs = (await import('lib-jitsi-meet')).default;
    } catch (error) {
      setLoadedJitsi(false);
    }

    if (!window.JitsiMeetJS) {
      window.JitsiMeetJS = importedJitsiMeetJs;
      setLoadedJitsi(true);
    }
  };

  importJitsi();

  if (!scriptsLoaded || !loadedJitsi) return <Loader />;
  if (!scriptsLoadedSuccessfully || !loadedJitsi)
    return <Error message={'Could not create fishbowl event'} />;

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;

  const isModerator = !!fbCreatorData.isCreatorOfFishbowl;

  return (
    <StooaProvider data={data} isModerator={isModerator}>
      <ModalsProvider isModerator={isModerator}>
        <DevicesProvider>
          <Seo title={title} />
          <Container className={className}>{children}</Container>
        </DevicesProvider>
      </ModalsProvider>
      <ToastContainer className="toastify-custom" />
    </StooaProvider>
  );
};

export default ScriptLoader(...scripts)(Layout);
