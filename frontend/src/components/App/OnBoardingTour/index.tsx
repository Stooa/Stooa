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

import StepTooltip from '@/components/App/OnBoardingTour/StepTooltip';
import useTranslation from 'next-translate/useTranslation';
import { pushEventDataLayer } from '@/lib/analytics';

const Steps = dynamic(() => import('intro.js-react').then(mod => mod.Steps), {
  ssr: false
});

type step = {
  element?: string;
  intro: JSX.Element | string;
  position?: string;
  tooltipClass?: string;
};

const OnBoardingTour = () => {
  const { isModerator, data, conferenceReady, conferenceStatus } = useStooa();
  const [alreadySeen, setAlreadySeen] = useState(false);
  const { t } = useTranslation('on-boarding-tour');

  const attendeeSteps: step[] = [
    {
      intro: <StepTooltip title={t('step1.title')} text={t('step1.text')} img="" />,
      tooltipClass: 'first-step'
    },
    {
      element: '.button-join',
      intro: (
        <StepTooltip
          title={t('step2.title')}
          text={t('step2.title')}
          img="/img/tour/tour-step2.gif"
        />
      )
    },
    {
      element: '#seat-2',
      intro: (
        <StepTooltip
          title={t('step3.title')}
          text={data.hasIntroduction ? t('step3.textIntroduction') : t('step3.text')}
          img="/img/tour/tour-step3.gif"
        />
      ),
      position: 'right'
    },
    {
      element: '.participant-toggle',
      intro: (
        <StepTooltip
          title={t('step4.title')}
          text={t('step4.text')}
          img="/img/tour/tour-step4.gif"
        />
      )
    }
  ];

  const introJSOptions = {
    nextLabel: t('next'),
    prevLabel: t('previous'),
    doneLabel: t('done'),
    tooltipClass: 'on-boarding-tour',
    hidePrev: true
  };

  const onStartTour = () => {
    pushEventDataLayer({
      category: 'OnBoarding Tour',
      action: 'Start'
    });
    OnBoardingTourCookie.setOnBoardingCookie();
  };

  const onExitTour = () => {
    setAlreadySeen(true);
  };

  const onCompleteTour = () => {
    pushEventDataLayer({
      category: 'OnBoarding Tour',
      action: 'End'
    });
  };

  const showTour = (): boolean => {
    const cookie = OnBoardingTourCookie.getOnBoardingTourCookie();

    if (
      conferenceReady &&
      !isModerator &&
      !cookie &&
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
        enabled={true}
        steps={attendeeSteps}
        initialStep={0}
        onStart={onStartTour}
        onExit={onExitTour}
        onComplete={onCompleteTour}
        options={introJSOptions}
      />
    );
  } else {
    return null;
  }
};

export default OnBoardingTour;
