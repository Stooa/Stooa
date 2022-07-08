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
import { getOnBoardingCookie, setOnBoardingCookie } from '@/lib/auth';

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
  const [enabled, setEnabled] = useState(false);

  const startTour = () => {
    setOnBoardingCookie(true);
  };

  const exitTour = () => {
    setEnabled(false);
  };

  const showTour = (): boolean => {
    const cookie = getOnBoardingCookie(isModerator);

    if (
      !cookie &&
      isModerator &&
      (conferenceStatus === IConferenceStatus.RUNNING ||
        conferenceStatus === IConferenceStatus.INTRODUCTION)
    ) {
      setEnabled(true);

      return true;
    }

    return false;
  };

  useEffect(() => {}, [enabled]);

  return (
    <>
      {showTour() && (
        <Steps
          onStart={startTour}
          enabled={enabled}
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
