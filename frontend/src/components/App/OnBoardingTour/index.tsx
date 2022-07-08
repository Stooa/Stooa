/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import { useStooa } from '@/contexts/StooaManager';
import { IConferenceStatus } from '@/jitsi/Status';
import { getTourSteps } from '@/components/App/OnBoardingTour/Steps';
import OnBoardingTourCookie from '@/lib/OnBoardingTourCookie';

const Steps = dynamic(() => import('intro.js-react').then(mod => mod.Steps), {
  ssr: false
});

const introJSOptions = {
  nextLabel: 'next',
  prevLabel: 'prev',
  showStepNumbers: true,
  hintAnimation: true,
  showBullets: true,
  showButtons: true
};

const OnBoardingTour: React.FC = () => {
  const { isModerator, conferenceStatus } = useStooa();
  const [alreadySeen, setAlreadySeen] = useState(false);

  const startTour = () => {
    OnBoardingTourCookie.setOnBoardingCookie();
  };

  const exitTour = () => {
    setAlreadySeen(true);
  };

  const showTour = (): boolean => {
    const cookie = OnBoardingTourCookie.getOnBoardingTourCookie();

    if (
      !isModerator &&
      !alreadySeen &&
      (conferenceStatus === IConferenceStatus.RUNNING ||
        conferenceStatus === IConferenceStatus.INTRODUCTION)
    ) {
      return true;
    }

    return false;
  };

  return (
    <>
      {showTour() && (
        <Steps
          onStart={startTour}
          enabled={true}
          steps={getTourSteps()}
          initialStep={0}
          onExit={exitTour}
          options={introJSOptions}
        />
      )}
    </>
  );
};

export default OnBoardingTour;
