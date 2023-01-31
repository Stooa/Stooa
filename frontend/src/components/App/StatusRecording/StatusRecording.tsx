/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';

interface Props {
  isSharing: boolean;
  disabled: boolean;
  className: string;
  onClick: () => void;
}

const StatusRecording = ({ isSharing, onClick, disabled, className, ...props }: Props) => {
  const { t } = useTranslation('fishbowl');
  return <div>Status</div>;
};

export default StatusRecording;
