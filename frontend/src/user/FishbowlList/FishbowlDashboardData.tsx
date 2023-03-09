/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import TitleWithDivider from '@/components/Common/TitleWithDivider';
import React, { useCallback } from 'react';
import { StyledFishbowlDashboardData } from './styles';

import Calendar from '@/ui/svg/calendar.svg';
import Hourglass from '@/ui/svg/hourglass.svg';
import People from '@/ui/svg/people-bigger.svg';
import SatisfactionSummary from '../SatisfactionSummary';
import { Fishbowl } from '@/types/api-platform';
import useFeedback from '@/hooks/useFeedback';
import FeedbackList from '../FeedbackList';
import DashboardParticipantsList from '../DashboardParticipantsList';

interface Props {
  fishbowl: Fishbowl;
}

export const FishbowlDashboardData = ({ fishbowl }: Props) => {
  const { summarizeFeedbackSatisfacion } = useFeedback(fishbowl);

  const getSatisfactionData = useCallback(() => {
    if (!fishbowl.summarizedFeedback) {
      return summarizeFeedbackSatisfacion();
    } else {
      return fishbowl.summarizedFeedback;
    }
  }, [fishbowl, summarizeFeedbackSatisfacion]);

  return (
    <StyledFishbowlDashboardData>
      <h2>Details</h2>
      <h3>{fishbowl.name}</h3>
      <p className="description">{fishbowl.description}</p>
      <div className="data">
        <div className="data__group">
          <div className="data__title">
            <Calendar />
            <h4>Date</h4>
          </div>
          <p className="medium">13 September, 2023</p>
          <p className="medium">13:00h</p>
        </div>
        <div className="data__group">
          <div className="data__title">
            <Hourglass />
            <h4>Duration</h4>
          </div>
          <p className="medium">73min</p>
        </div>
        <div className="data__group">
          <div className="data__title">
            <People />
            <h4>Participants</h4>
          </div>
          <p className="medium">13</p>
        </div>
      </div>
      <div className="feedback">
        <TitleWithDivider headingLevel="h3">Feedback</TitleWithDivider>
        <SatisfactionSummary
          personsGaveFeedback={fishbowl.feedbacks?.length || 0}
          participants={fishbowl.participants?.length || 0}
          satisfactionData={getSatisfactionData()}
        />
        {fishbowl.feedbacks && fishbowl.feedbacks?.length > 0 && (
          <FeedbackList feedbacks={fishbowl.feedbacks} />
        )}
        {fishbowl.participants && (
          <>
            <TitleWithDivider headingLevel="h3">
              {fishbowl.participants.length.toString()} Usuarios
            </TitleWithDivider>
            <DashboardParticipantsList participants={fishbowl.participants} />
          </>
        )}
      </div>
    </StyledFishbowlDashboardData>
  );
};
