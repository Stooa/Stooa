/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Tooltip from '@/components/Common/Tooltip';
import { useState } from 'react';
import { StyledPill } from './styles';

interface Props {
  children: React.ReactNode;
  tooltipText: string;
}

const PillWithTooltip = ({ children, tooltipText }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <StyledPill
      onMouseLeave={() => setShowTooltip(false)}
      onMouseEnter={() => setShowTooltip(true)}
      className="body-xs medium"
    >
      <Tooltip showTooltip={showTooltip} arrow position="top">
        {tooltipText}
      </Tooltip>
      {children}
    </StyledPill>
  );
};

export default PillWithTooltip;
