/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
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

import { ToastContainer } from 'react-toastify';
import { ModalsProvider } from '@/contexts/ModalsContext';
import { TranscriptionsProvider } from '@/contexts/TranscriptionContext';
import useLoadJitsi from '@/hooks/useLoadJitsi';

const scripts = ['https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js'];

interface Props {
  fishbowl: Fishbowl;
  scriptsLoaded: boolean;
  scriptsLoadedSuccessfully: boolean;
  prejoin: boolean;
  className?: string;
  children: React.ReactNode;
}

const Layout = ({
  className,
  fishbowl,
  scriptsLoaded,
  scriptsLoadedSuccessfully,
  children
}: Props) => {
  const router = useRouter();
  const { fid } = router.query;
  const { data: fbCreatorData } = useQuery(IS_FISHBOWL_CREATOR, {
    variables: { slug: fid }
  });
  const { loadedJitsi } = useLoadJitsi(scriptsLoaded);

  if (!scriptsLoaded || !loadedJitsi) return <Loader />;
  if (!scriptsLoadedSuccessfully || !loadedJitsi)
    return <Error message={'Could not create fishbowl event'} />;

  const isModerator = !!fbCreatorData && !!fbCreatorData.isCreatorOfFishbowl;

  return (
    <StooaProvider fishbowl={fishbowl} isModerator={isModerator}>
      <TranscriptionsProvider>
        <ModalsProvider isModerator={isModerator}>
          <DevicesProvider>
            <Container className={className}>{children}</Container>
          </DevicesProvider>
        </ModalsProvider>
      </TranscriptionsProvider>
      <ToastContainer className="toastify-custom" />
    </StooaProvider>
  );
};

export default ScriptLoader(...scripts)(Layout);
