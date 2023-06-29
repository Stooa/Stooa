/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import WorldCafeLanding from '@/components/Web/WorldCafeLanding';
import { GET_WORLD_CAFE } from '@/graphql/WorldCafe';
import WorldCafeApp from '@/layouts/WorldCafeApp/WorldCafeApp';
import { useQuery } from '@apollo/client';

const LayoutWeb = dynamic(import('@/layouts/EventDetail'), { loading: () => <div /> });

const Page = () => {
  const router = useRouter();
  const { wid } = router.query;
  const { loading, error, data } = useQuery(GET_WORLD_CAFE, { variables: { slug: wid } });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { bySlugQueryWorldCafe: worldCafeData } = data;

  return (
    <LayoutWeb>
      <WorldCafeLanding data={worldCafeData} />
    </LayoutWeb>
  );
};

export default Page;
