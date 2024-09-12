/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useRef, useState } from 'react';
import { AISummaryTooltip } from './AISummaryTooltip';
import { StyledAISummaryIconWrapper } from './styles';
import AISummary from '@/ui/svg/ai-summary.svg';
import { useClickOutside } from '@/hooks/useClickOutside';

export const AISummaryIcon = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipRef = useRef<HTMLDivElement>(null);
  useClickOutside(tooltipRef, () => setShowTooltip(false));

  const handleMouseEvents = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <StyledAISummaryIconWrapper>
      <button onClick={handleMouseEvents}>
        <AISummary />
      </button>
      {showTooltip && <AISummaryTooltip ref={tooltipRef} />}
    </StyledAISummaryIconWrapper>
  );
};
