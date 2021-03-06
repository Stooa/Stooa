/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Placeholder from '@/components/App/VideoPermissionsPlaceholder/styles';

const VideoPermissionsPlaceholder: React.FC = ({ children, ...props }) => (
  <Placeholder {...props}>{children}</Placeholder>
);

export default VideoPermissionsPlaceholder;
