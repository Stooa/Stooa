/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import TitleWithDivider from '@/components/Common/TitleWithDivider';
import { Fishbowl } from '@/types/api-platform';
import React from 'react';
import { StyledFishbowlDashboardData } from './styles';

interface Props {
  fishbowl: Fishbowl;
}

export const FishbowlDashboardData = ({ fishbowl }: Props) => {
  return (
    <StyledFishbowlDashboardData>
      <h2>Details</h2>
      <div className="details">
        <h3>{fishbowl.name}</h3>
        <p>{fishbowl.description}</p>
        <div className="details__data">
          <div className="details__group">
            <h4>Date</h4>
            <p>13 September, 2023</p>
            <p>13:00h</p>
          </div>
          <div className="details__group">
            <h4>Duration</h4>
            <p>73min</p>
          </div>
          <div className="details__group">
            <h4>Participants</h4>
            <p>13 September, 2023</p>
            <p>13:00h</p>
          </div>
        </div>
        <TitleWithDivider headingLevel="h3">Feedback</TitleWithDivider>
      </div>
    </StyledFishbowlDashboardData>
  );
};
