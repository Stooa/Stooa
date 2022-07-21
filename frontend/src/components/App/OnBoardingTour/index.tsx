/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { useEffect } from 'react';

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
  const {
    isModerator,
    data,
    conferenceReady,
    conferenceStatus,
    showOnBoardingTour,
    setShowOnBoardingTour
  } = useStooa();
  const { t } = useTranslation('on-boarding-tour');

  const attendeeSteps: step[] = [
    {
      intro: (
        <StepTooltip
          title={t('step1.title')}
          text={t('step1.text')}
          img="/img/friends/dancing.png"
        />
      ),
      tooltipClass: 'custom-onboarding-tooltip first-step'
    },
    {
      element: '#seat-2',
      intro: (
        <StepTooltip
          title={t('step3.title')}
          text={t('step2.text')}
          img="/img/tour/tour-step3.gif"
        />
      ),
      position: 'right',
      tooltipClass: 'custom-onboarding-tooltip'
    },
    {
      element: '#button-join',
      intro: (
        <StepTooltip
          title={t('step2.title')}
          text={data.hasIntroduction ? t('step3.textIntroduction') : t('step3.text')}
          img="/img/tour/tour-step2.gif"
        />
      ),
      tooltipClass: 'custom-onboarding-tooltip'
    },
    {
      element: '.participant-toggle',
      intro: (
        <StepTooltip
          title={t('step4.title')}
          text={t('step4.text')}
          img="/img/tour/tour-step4.gif"
        />
      ),
      tooltipClass: 'custom-onboarding-tooltip'
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
  };

  const onExitTour = () => {
    OnBoardingTourCookie.setOnBoardingCookie();
  };

  const onCompleteTour = () => {
    pushEventDataLayer({
      category: 'OnBoarding Tour',
      action: 'End'
    });
    setShowOnBoardingTour(false);
  };

  const showTour = (): void => {
    const cookie = OnBoardingTourCookie.getOnBoardingTourCookie();

    if (
      conferenceReady &&
      !isModerator &&
      !cookie &&
      (conferenceStatus === IConferenceStatus.RUNNING ||
        conferenceStatus === IConferenceStatus.INTRODUCTION)
    ) {
      console.log('shouldShow lol');
      setShowOnBoardingTour(true);
    } else {
      setShowOnBoardingTour(false);
    }
  };

  useEffect(() => {
    showTour();
  }, []);

  if (showOnBoardingTour) {
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
