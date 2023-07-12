/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { WorldCafeStatus } from '@/jitsi/Status';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import PreWorldCafe from '../PreWorldCafe';

const WorldCafe = () => {
  const { status } = useWorldCafeStore();

  const isPrejoin = status === WorldCafeStatus.NOT_STARTED;

  return <>{isPrejoin && <PreWorldCafe />}</>;
};

export default WorldCafe;
