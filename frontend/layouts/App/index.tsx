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
import { IS_FISHBOWL_CREATOR } from 'lib/gql/Fishbowl';
import { StooaProvider } from 'contexts/StooaManager';
import ScriptLoader from 'hocs/withScriptLoader';
import Error from 'components/Common/Error';
import Loader from 'components/Web/Loader';
import { Container } from 'layouts/App/styles';
import { DevicesProvider } from 'contexts/DevicesContext';
import Seo from 'components/Web/Seo';

const scripts = [
  'https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js',
  '/vendor/lib-jitsi-meet.min.js'
];

interface Props {
  data: Fishbowl;
  scriptsLoaded: boolean;
  scriptsLoadedSuccessfully: boolean;
  title: string;
}

const Layout: React.FC<Props> = ({
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

  if (!scriptsLoaded) return <Loader />;
  if (!scriptsLoadedSuccessfully) return <Error message={'Could not create fishbowl event'} />;

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;

  const isModerator = !!fbCreatorData.isCreatorOfFishbowl;

  return (
    <StooaProvider data={data} isModerator={isModerator}>
      <DevicesProvider>
        <Seo title={title} />
        <Container>{children}</Container>
      </DevicesProvider>
    </StooaProvider>
  );
};

export default ScriptLoader(...scripts)(Layout);
