/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import { useStooa } from '@/contexts/StooaManager';
import { IConferenceStatus } from '@/jitsi/Status';
import OnBoardingTourCookie from '@/lib/OnBoardingTourCookie';
import 'intro.js/introjs.css';

import StepTooltip from "@/components/App/OnBoardingTour/StepTooltip";

const Steps = dynamic(() => import('intro.js-react').then(mod => mod.Steps), {
  ssr: false
});

const introJSOptions = {
  nextLabel: 'next',
  prevLabel: 'prev',
  tooltipClass: 'on-boarding-tour',
  hidePrev: true
};

type step = {
  element?: string;
  intro: JSX.Element|string;
};


const OnBoardingTour = () => {
  const { isModerator, conferenceReady, conferenceStatus } = useStooa();
  const [alreadySeen, setAlreadySeen] = useState(false);

  const startTour = () => {
    OnBoardingTourCookie.setOnBoardingCookie();
  };

  const exitTour = () => {
    setAlreadySeen(true);
  };

  const getTourSteps = (): step[] => {
    return [
      {
        intro: <StepTooltip title="step1.title" text="step2.text" img="" />
      },
      {
        element: '.button-join',
        intro: <StepTooltip title="step2.title" text="step2.text" img="/img/tour/step2.gif" />
      },
      {
        element: '#seat-2',
        intro: <StepTooltip title="step3.title" text="step3.text" img="/img/tour/step3.gif" />
      },
      {
        element: '.participant-toggle',
        intro: <StepTooltip title="step4.title" text="step4.text" img="/img/tour/step4.gif" />
      }
    ];
  };

  const showTour = (): boolean => {
    const cookie = OnBoardingTourCookie.getOnBoardingTourCookie();

    if (
      conferenceReady &&
      // !isModerator &&
      !alreadySeen &&
      (conferenceStatus === IConferenceStatus.RUNNING ||
        conferenceStatus === IConferenceStatus.INTRODUCTION)
    ) {
      return true;
    }

    return false;
  };

  if (showTour()) {
    return (
      <Steps
        onStart={startTour}
        enabled={true}
        steps={getTourSteps()}
        initialStep={0}
        onExit={exitTour}
        options={introJSOptions}
      />
    );
  } else {
    return null;
  }
};

export default OnBoardingTour;
