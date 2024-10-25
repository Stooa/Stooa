/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import Cross from '@/ui/svg/cross.svg';
import QuestionMark from '@/ui/svg/questionmark.svg';
import OnboardingWrapper, { Icon, Tooltip } from '@/components/App/OnBoarding/styles';
import { useStooa } from '@/contexts/StooaManager';
import { useModals } from '@/contexts/ModalsContext';

const OnBoarding = () => {
  const { isModerator } = useStooa();
  const {
    activeOnBoardingTooltip,
    setActiveOnBoardingTooltip,
    toggleOnBoarding,
    setOnBoardingTooltipSeen,
    setShowOnBoardingTour
  } = useModals();
  const { t } = useTranslation('on-boarding');

  const handleClick = (): void => {
    if (isModerator) {
      toggleOnBoarding('header');
    } else {
      setShowOnBoardingTour(true);
    }
  };

  return (
    <OnboardingWrapper>
      <Icon onClick={handleClick}>
        <QuestionMark />
      </Icon>
      {activeOnBoardingTooltip && (
        <Tooltip className="info">
          <p>{t('tooltip')}</p>
          <button
            onClick={() => {
              setActiveOnBoardingTooltip(false);
              setOnBoardingTooltipSeen(true);
            }}
          >
            <Cross />
          </button>
        </Tooltip>
      )}
    </OnboardingWrapper>
  );
};

export default OnBoarding;
