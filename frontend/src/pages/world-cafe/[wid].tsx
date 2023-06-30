/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dynamic from 'next/dynamic';

import WorldCafeLanding from '@/components/Web/WorldCafeLanding';
// import WorldCafeApp from '@/layouts/WorldCafeApp/WorldCafeApp';
import useWorldCafeLoader from '@/hooks/useWorldCafeLoader';
import { useRouter } from 'next/router';
import Loader from '@/components/Web/Loader';
import JoinEvent from '@/components/Web/JoinEvent';

const LayoutWeb = dynamic(import('@/layouts/EventDetail'), { loading: () => <div /> });

const Page = () => {
  const {
    query: { wid }
  } = useRouter();

  const { loading, error } = useWorldCafeLoader(wid as string);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <LayoutWeb>
      <WorldCafeLanding />
      <JoinEvent />
    </LayoutWeb>
  );
};

export default Page;
