/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';
import VideoGrid from '../VideoGrid/VideoGrid';
import { useJitsi } from '@/lib/useJitsi';
import { useUser } from '@/jitsi/useUser';

export const ActiveWorldCafe = () => {
  const { joinWorldCafe } = useJitsi();
  const { getUser } = useUser();

  useEffect(() => {
    const handleJoin = async () => {
      const foo = await joinWorldCafe(getUser());
      console.log('JOINED LETS GO', foo);
    };

    handleJoin();
  }, []);

  return (
    <>
      <VideoGrid />
    </>
  );
};
