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
import { StepsProps } from 'intro.js-react';
import { useModals } from '@/contexts/ModalsContext';

const Steps = dynamic<StepsProps>(() => import('intro.js-react').then(mod => mod.Steps), {
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

  const {
    showOnBoardingTour,
    setShowOnBoardingTour,
    setActiveOnBoardingTooltip,
    onBoardingTooltipSeen
  } = useModals();

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
      intro: (
        <StepTooltip
          title={t('step3.title')}
          text={t('step2.text')}
          img="/img/tour/tour-step3.gif"
        />
      ),
      position: 'right',
      element: '#seat-2',
      tooltipClass: 'custom-onboarding-tooltip second-step'
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
      position: 'auto',
      tooltipClass: 'custom-onboarding-tooltip'
    },
    {
      intro: (
        <StepTooltip
          title={t('step4.title')}
          text={t('step4.text')}
          img="/img/tour/tour-step4.gif"
        />
      ),
      element: '#participant-toggle',
      tooltipClass: 'custom-onboarding-tooltip third-step'
    }
  ];

  const introJSOptions = {
    nextLabel: t('next'),
    prevLabel: t('previous'),
    doneLabel: t('done'),
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
    setShowOnBoardingTour(false);
    if (!onBoardingTooltipSeen) {
      setActiveOnBoardingTooltip(true);
    }
  };

  const onCompleteTour = () => {
    pushEventDataLayer({
      category: 'OnBoarding Tour',
      action: 'End'
    });
    setShowOnBoardingTour(false);
    if (!onBoardingTooltipSeen) {
      setActiveOnBoardingTooltip(true);
    }
  };

  const showTour = (): void => {
    const cookie = OnBoardingTourCookie.getOnBoardingTourCookie();

    if (!isModerator && !cookie) {
      setShowOnBoardingTour(true);
    } else {
      setShowOnBoardingTour(false);
      setActiveOnBoardingTooltip(true);
    }
  };

  useEffect(() => {
    if (
      (conferenceStatus === IConferenceStatus.RUNNING ||
        conferenceStatus === IConferenceStatus.INTRODUCTION) &&
      conferenceReady
    ) {
      showTour();
    }
  }, [conferenceStatus, conferenceReady]);

  if (showOnBoardingTour) {
    return (
      <div data-testid="on-boarding-tour">
        <Steps
          enabled={true}
          steps={attendeeSteps}
          initialStep={0}
          onStart={onStartTour}
          onExit={onExitTour}
          onComplete={onCompleteTour}
          options={introJSOptions}
        />
      </div>
    );
  } else {
    return null;
  }
};

export default OnBoardingTour;
