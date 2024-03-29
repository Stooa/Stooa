/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import TitleWithDivider from '@/components/Common/TitleWithDivider';
import React, { useCallback, useRef } from 'react';
import { MobileBackButton, StyledFishbowlDashboardData } from './styles';

import Calendar from '@/ui/svg/calendar.svg';
import BackArrow from '@/ui/svg/arrow-prev.svg';
import Hourglass from '@/ui/svg/hourglass.svg';
import ArrowDown from '@/ui/svg/down-arrow.svg';
import People from '@/ui/svg/people-bigger.svg';
import SatisfactionSummary from '../SatisfactionSummary';
import { Fishbowl } from '@/types/api-platform';
import useFeedback from '@/hooks/useFeedback';
import FeedbackList from '@/user/FeedbackList';
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

  const participantsAttended = fishbowl.participants?.length || 0;

  const participantsRef = useRef<HTMLDivElement>(null);
  const dashboardWrapperRef = useRef<HTMLDivElement>(null);

  const handleScrollToParticipants = () => {
    if (participantsRef.current && dashboardWrapperRef.current) {
      dashboardWrapperRef.current.scrollTo({
        top: participantsRef.current.offsetTop,
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <StyledFishbowlDashboardData
      key={fishbowl.id}
      as={motion.div}
      variants={variants}
      initial="initial"
      exit="exit"
      animate="visible"
      data-testid="fishbowl-dashboard-data"
      ref={dashboardWrapperRef}
    >
      <div className="header-wrapper">
        <MobileBackButton className="bottom" onClick={onClickBack}>
          <BackArrow />
        </MobileBackButton>
        <h2 className="medium">{t('feedback.dashboard.details')}</h2>
      </div>
      <h3 data-testid="finished-fishbowl-name">{fishbowl.name}</h3>
      <p className="description" data-testid="finished-fishbowl-description">
        {fishbowl.description}
      </p>
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
        <div className="data__group participants">
          <div className="data__title">
            <People />
            <h4>{t('feedback.dashboard.participants')}</h4>
          </div>
          <p className="medium">
            <a
              onClick={handleScrollToParticipants}
              className="body-md"
              data-testid="finished-fishbowl-participant-count"
            >
              {t('feedback.dashboard.users', { count: participantsAttended })}
              {participantsAttended > 0 && <ArrowDown />}
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
            <TitleWithDivider headingLevel="h3" ref={participantsRef}>
              {t('feedback.dashboard.participants', { count: participantsAttended })}
            </TitleWithDivider>
            <DashboardParticipantsList participants={fishbowl.participants} host={fishbowl.host} />
          </>
        )}
      </div>
    </StyledFishbowlDashboardData>
  );
};
