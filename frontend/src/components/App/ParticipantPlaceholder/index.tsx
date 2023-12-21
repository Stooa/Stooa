/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import { StyledPrefishbowlParticipant } from '@/components/App/PreFishbowl/styles';
import Twitter from '@/ui/svg/x.svg';
import Linkedin from '@/ui/svg/share-linkedin.svg';

const ParticipantPlaceholder = props => {
  return (
    <StyledPrefishbowlParticipant
      {...props}
      className="prefishbowl"
      data-testid="participant-placeholder"
    >
      <div className="placeholder">
        <div />
      </div>
      <div className="social">
        <span className="icon">
          <Twitter />
        </span>

        <span className="icon">
          <Linkedin />
        </span>
      </div>
    </StyledPrefishbowlParticipant>
  );
};

export default ParticipantPlaceholder;
