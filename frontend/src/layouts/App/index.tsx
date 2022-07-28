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

import { Fishbowl } from '@/types/graphql-codegen/types';
import { StooaProvider } from '@/contexts/StooaManager';
import ScriptLoader from '@/hocs/withScriptLoader';
import Error from '@/components/Common/Error';
import Loader from '@/components/Web/Loader';
import { Container } from '@/layouts/App/styles';
import { DevicesProvider } from '@/contexts/DevicesContext';
import Seo from '@/components/Web/Seo';
import { useIsCreatorOfFishbowlQuery } from '@/graphql/Fishbowl.generated';

import { ToastContainer } from 'react-toastify';

const scripts = [
  'https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js',
  '/vendor/lib-jitsi-meet.min.js'
];

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
  } = useIsCreatorOfFishbowlQuery({ variables: { slug: fid as string } });

  if (!scriptsLoaded) return <Loader />;
  if (!scriptsLoadedSuccessfully) return <Error message={'Could not create fishbowl event'} />;

  if (loading) return <Loader />;
  if (error) return <Error message={error.message} />;

  const isModerator = !!fbCreatorData.isCreatorOfFishbowl;

  return (
    <StooaProvider data={data} isModerator={isModerator}>
      <DevicesProvider>
        <Seo title={title} />
        <Container className={className}>{children}</Container>
      </DevicesProvider>
      <ToastContainer className="toastify-custom" />
    </StooaProvider>
  );
};

export default ScriptLoader(...scripts)(Layout);
