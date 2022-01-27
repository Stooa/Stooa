/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import NoCam from '@/ui/svg/no-cam.svg';
import Placeholder from '@/components/App/VideoPlaceholder/styles';

const VideoPlaceholder = ({ ...props }) => (
  <Placeholder {...props}>
    <NoCam />
  </Placeholder>
);

export default VideoPlaceholder;
