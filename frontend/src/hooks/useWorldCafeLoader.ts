/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GET_WORLD_CAFE } from '@/graphql/WorldCafe';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';

const useWorldCafeLoader = (wid: string) => {
  const { loading, error, data } = useQuery(GET_WORLD_CAFE, { variables: { slug: wid } });
  const { setWorldCafe } = useWorldCafeStore(state => ({
    setWorldCafe: state.setWorldCafe
  }));

  useEffect(() => {
    if (data && !error) {
      const { bySlugQueryWorldCafe: worldCafeData } = data;
      setWorldCafe(worldCafeData);
    }
  }, [data]);

  return { loading, error };
};

export default useWorldCafeLoader;
