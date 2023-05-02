/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Placeholder from '@/components/App/VideoPermissionsPlaceholder/styles';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const VideoPermissionsPlaceholder = ({ children, ...props }: Props) => (
  <Placeholder {...props}>{children}</Placeholder>
);

export default VideoPermissionsPlaceholder;
