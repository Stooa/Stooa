/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';

import Cross from '@/ui/svg/cross.svg';
import OnboardingModal from '@/components/App/ModalOnBoarding/styles';
import OnBoardingSlider from '@/components/App/OnBoarding/OnBoardingSlider';
import { useStooa } from '@/contexts/StooaManager';
import { useUserAuth } from '@/user/auth/useUserAuth';
import { useModals } from '@/contexts/ModalsContext';

const ModalOnboarding = () => {
  const { isModerator } = useStooa();
  const { setOnBoardingCookie } = useUserAuth();

  const { toggleOnBoarding, setActiveOnBoardingTooltip, onBoardingTooltipSeen } = useModals();

  const skipOnBoarding = () => {
    toggleOnBoarding('skip');
    setOnBoardingCookie(isModerator);
    if (!onBoardingTooltipSeen) setActiveOnBoardingTooltip(true);
  };

  return (
    <OnboardingModal>
      <div className="content white">
        <button className="close" onClick={skipOnBoarding}>
          <Cross />
        </button>
        <OnBoardingSlider skipOnBoarding={skipOnBoarding} />
      </div>
    </OnboardingModal>
  );
};

export default ModalOnboarding;
