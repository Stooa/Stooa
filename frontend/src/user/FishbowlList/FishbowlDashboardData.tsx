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
import { MobileBackButton, StyledFishbowlDashboardData } from './styles';

import Calendar from '@/ui/svg/calendar.svg';
import BackArrow from '@/ui/svg/arrow-prev.svg';
import Hourglass from '@/ui/svg/hourglass.svg';
import ArrowDown from '@/ui/svg/down-arrow.svg';
import People from '@/ui/svg/people-bigger.svg';
import SatisfactionSummary from '../SatisfactionSummary';
import { Fishbowl } from '@/types/api-platform';
import useFeedback from '@/hooks/useFeedback';
import FeedbackList from '../FeedbackList';
import DashboardParticipantsList from '../DashboardParticipantsList';
import { motion, Variants } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  fishbowl: Fishbowl;
  onClickBack: () => void;
  variants?: Variants;
}

export const FishbowlDashboardData = ({ fishbowl, onClickBack, variants }: Props) => {
  const { t } = useTranslation('fishbowl');
  const { summarizeFeedbackSatisfacion } = useFeedback(fishbowl);
  const { startDateTimeTz } = fishbowl;

  const getSatisfactionData = useCallback(() => {
    if (!fishbowl.summarizedFeedback) {
      return summarizeFeedbackSatisfacion();
    } else {
      return fishbowl.summarizedFeedback;
    }
  }, [fishbowl, summarizeFeedbackSatisfacion]);

  const startDateTime = new Date(startDateTimeTz);

  const month = startDateTime.toLocaleString('default', { month: 'long' });
  const day = startDateTime.toLocaleString('default', { day: 'numeric' });
  const time = startDateTime.toLocaleString('default', { hour: 'numeric', minute: 'numeric' });
  const year = startDateTime.toLocaleString('default', { year: 'numeric' });

  return (
    <StyledFishbowlDashboardData
      key={fishbowl.id}
      as={motion.div}
      variants={variants}
      initial="initial"
      exit="exit"
      animate="visible"
    >
      <div className="header-wrapper">
        <MobileBackButton className="bottom" onClick={onClickBack}>
          <BackArrow />
        </MobileBackButton>
        <h2 className="medium">{t('feedback.dashboard.details')}</h2>
      </div>
      <h3>{fishbowl.name}</h3>
      <p className="description">{fishbowl.description}</p>
      <div className="data">
        <div className="data__group">
          <div className="data__title">
            <Calendar />
            <h4>{t('form:fishbowl.day')}</h4>
          </div>
          <p className="medium">
            {month} {day}, {year}
          </p>
          <p className="medium">{time}</p>
        </div>
        <div className="data__group">
          <div className="data__title">
            <Hourglass />
            <h4>{t('form:fishbowl.duration')}</h4>
          </div>
          <p className="medium">{fishbowl.durationFormatted}</p>
        </div>
        <div className="data__group">
          <div className="data__title">
            <People />
            <h4>{t('feedback.dashboard.participants')}</h4>
          </div>
          <p className="medium">
            <a href="#participants">
              {fishbowl.participants?.length || 0} {t('feedback.dashboard.users')}
              <ArrowDown />
            </a>
          </p>
        </div>
      </div>
      <div className="feedback">
        <TitleWithDivider headingLevel="h3">{t('feedback.title')}</TitleWithDivider>
        <SatisfactionSummary
          personsGaveFeedback={fishbowl.feedbacks?.length || 0}
          satisfactionData={getSatisfactionData()}
        />
        {fishbowl.feedbacks && fishbowl.feedbacks?.length > 0 && (
          <FeedbackList feedbacks={fishbowl.feedbacks} />
        )}
        {fishbowl.participants && fishbowl.participants?.length > 0 && (
          <>
            <TitleWithDivider headingLevel="h3" id="participants">
              {`${fishbowl.participants.length.toString()} ${t('feedback.dashboard.participants')}`}
            </TitleWithDivider>
            <DashboardParticipantsList participants={fishbowl.participants} />
          </>
        )}
      </div>
    </StyledFishbowlDashboardData>
  );
};
