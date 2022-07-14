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

const OnBoardingButton = () => {
  const {
    activeOnBoardingTooltip,
    setActiveOnBoardingTooltip,
    toggleOnBoarding,
    setOnBoardingTooltipSeen
  } = useStooa();
  const { t } = useTranslation('on-boarding');

  return (
    <OnboardingWrapper>
      <Icon onClick={() => toggleOnBoarding('header')}>
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

export default OnBoardingButton;
