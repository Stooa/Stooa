/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FC, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import useSound from 'use-sound';

import { CONFERENCE_START, SCREEN_SHARE_PERMISSIONS_DENIED } from '@/jitsi/Events';
import useEventListener from '@/hooks/useEventListener';
import { useStooa } from '@/contexts/StooaManager';

import { Main } from '@/layouts/App/styles';
import ModalPermissions from '@/components/App/ModalPermissions';
import { useDevices } from '@/contexts/DevicesContext';
import ModalKickUser from '@/components/App/ModalKickUser';
import ReactionsReceiver from '@/components/App/Reactions/ReactionsReceiver';
import { pushEventDataLayer } from '@/lib/analytics';
import { useRouter } from 'next/router';
import OnBoardingTour from '@/components/App/OnBoardingTour';
import { useStateValue } from '@/contexts/AppContext';
import { IConferenceStatus } from '@/jitsi/Status';
import PreFishbowl from '@/components/App/PreFishbowl';
import ModalOnboarding from '@/components/App/ModalOnBoarding';
import { HackLeaveHover } from './styles';
import { isTimeLessThanNMinutes } from '@/lib/helpers';
import ModalConfirmLeaving from '../ModalConfirmLeaving';
import { useWindowSize } from '@/hooks/useWIndowSize';
import { BREAKPOINTS } from '@/ui/settings';
import { useModals } from '@/contexts/ModalsContext';
import ModalScreenSharePermissions from '@/components/App/ModalScreenSharePermissions';
import ModalStartRecording from '@/components/App/ModalStartRecording';
import ModalStopRecording from '@/components/App/ModalStopRecording';
import ModalShareLink from '@/components/App/ModalShareLink';
import { toast } from 'react-toastify';
import useTranslation from 'next-translate/useTranslation';

import RedRec from '@/ui/svg/rec-red.svg';
import FeedbackForm from '../FeedbackForm';
import { useClickOutside } from '@/hooks/useClickOutside';
import ModalTranscription from '../ModalTranscription/ModalTranscription';
import { LOCALES } from '@/lib/supportedTranslationLanguages';
import { useConference } from '@/jitsi';
import { useUserAuth } from '@/user/auth/useUserAuth';
import TranscriptionWrapper from '../TranscriptionText/TranscriptionWrapper';

const Header = dynamic(import('../Header'), { loading: () => <div /> });
const Footer = dynamic(import('../Footer'), { loading: () => <div /> });
const Seats = dynamic(import('../Seats'), { loading: () => <div /> });

const Fishbowl: FC = () => {
  const [play] = useSound(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/sounds/ding.mp3`);
  const {
    data,
    isModerator,
    participantToKick,
    setParticipantToKick,
    stopRecording,
    startRecording,
    setIsRecording,
    gaveFeedback,
    setGaveFeedback,
    isTranscriptionEnabled,
    setIsTranscriptionEnabled,
    participantsActive,
    setParticipantsActive
  } = useStooa();

  const {
    showOnBoardingModal,
    showConfirmCloseTabModal,
    setShowConfirmCloseTabModal,
    showScreenSharePermissions,
    setShowScreenSharePermissions,
    showStartRecording,
    showStopRecording,
    setShowStartRecording,
    setShowStopRecording,
    showFeedbackForm,
    setShowFeedbackForm,
    showTranscriptionModal,
    setShowTranscriptionModal
  } = useModals();
  const { startRecordingEvent, startTranscriptionEvent } = useConference();
  const { getTranscriptionLanguageCookie, setTranscriptionLanguageCookie } = useUserAuth();

  const { width } = useWindowSize();
  const feedbackFormRef = useRef<HTMLDivElement>(null);

  useClickOutside(feedbackFormRef, () => {
    if (!gaveFeedback) {
      setShowFeedbackForm(false);
    }
  });

  const [{ conferenceStatus }] = useStateValue();
  const { showModalPermissions, setShowModalPermissions } = useDevices();

  const { fid } = useRouter().query;

  const { t, lang } = useTranslation('fishbowl');

  const isPreFishbowl =
    conferenceStatus === IConferenceStatus.NOT_STARTED && (!data.isFishbowlNow || !isModerator);

  useEventListener(CONFERENCE_START, () => {
    if (!isModerator) play();
  });

  useEventListener(SCREEN_SHARE_PERMISSIONS_DENIED, () => {
    setShowScreenSharePermissions(true);
  });

  const handleCloseModalPermissions = () => {
    setShowModalPermissions(false);
  };

  const handleModeratorIsGonnaLeave = () => {
    if (
      isModerator &&
      conferenceStatus === IConferenceStatus.RUNNING &&
      isTimeLessThanNMinutes(data.endDateTimeTz, 5)
    ) {
      setShowConfirmCloseTabModal(true);
    }
  };

  const handleStopRecording = async () => {
    const recordingStopped = await stopRecording().catch(() => false);
    if (!recordingStopped) return;
    setShowStopRecording(false);
  };

  const handleStartRecording = async () => {
    const recordingStarted = await startRecording();
    if (recordingStarted.status === 'error') {
      const translationString =
        recordingStarted.type === 'wrong-tab' ? 'recording.wrongTab' : 'recording.recordingError';

      toast(t(translationString), {
        icon: '⚠️',
        type: 'error',
        position: 'top-center',
        autoClose: 5000
      });
      return;
    }

    setIsRecording(true);
    toast(t('recording.startedSuccessfully'), {
      icon: <RedRec />,
      type: 'success',
      position: 'bottom-center',
      autoClose: 5000
    });
    startRecordingEvent();
    setShowStartRecording(false);
  };

  const handleFinishFeedback = () => {
    setShowFeedbackForm(false);
  };

  const handleStartTranscription = () => {
    const transcriptionCookie = getTranscriptionLanguageCookie();

    if (!transcriptionCookie) {
      setTranscriptionLanguageCookie(LOCALES[lang]);
    }

    startTranscriptionEvent();
    setIsTranscriptionEnabled(true);
    setParticipantsActive(true);
    setShowTranscriptionModal(false);
  };

  useEffect(() => {
    pushEventDataLayer({
      action: fid as string,
      category: 'FishbowlReactions',
      label: 'Connect'
    });
  }, []);

  useEffect(() => {
    if (width && width < BREAKPOINTS.tablet) {
      setParticipantsActive(false);
    }
  }, [width, setParticipantsActive]);

  return (
    <>
      <Header isPrefishbowl={isPreFishbowl} />
      <Main className={participantsActive ? 'drawer-open' : ''}>
        <HackLeaveHover onMouseEnter={handleModeratorIsGonnaLeave} />

        <ModalShareLink />

        {/* MODALS */}
        {showConfirmCloseTabModal && (
          <ModalConfirmLeaving
            handleFinished={() => setShowConfirmCloseTabModal(false)}
            closeModal={() => setShowConfirmCloseTabModal(false)}
          />
        )}
        {showModalPermissions && <ModalPermissions closeModal={handleCloseModalPermissions} />}
        {participantToKick && (
          <ModalKickUser
            participant={participantToKick}
            onSubmit={() => setParticipantToKick(undefined)}
            closeModal={() => setParticipantToKick(undefined)}
          />
        )}
        {showOnBoardingModal && <ModalOnboarding />}

        {showScreenSharePermissions && (
          <ModalScreenSharePermissions closeModal={() => setShowScreenSharePermissions(false)} />
        )}

        {showStartRecording && (
          <ModalStartRecording
            closeModal={() => setShowStartRecording(false)}
            startRecording={() => handleStartRecording()}
          />
        )}

        {showStopRecording && (
          <ModalStopRecording
            closeModal={() => setShowStopRecording(false)}
            stopRecording={() => handleStopRecording()}
          />
        )}

        {showFeedbackForm && (
          <FeedbackForm
            ref={feedbackFormRef}
            handleGaveSatisfaction={() => setGaveFeedback(true)}
            handleFinish={handleFinishFeedback}
            fishbowl={data}
            variant="fishbowl-mobile"
          />
        )}

        {showTranscriptionModal && (
          <ModalTranscription
            closeModal={() => setShowTranscriptionModal(false)}
            startTranscription={handleStartTranscription}
          />
        )}

        {isPreFishbowl ? <PreFishbowl /> : <Seats />}
        <ReactionsReceiver className={participantsActive ? 'drawer-open' : ''} />
        {isTranscriptionEnabled && <TranscriptionWrapper />}
      </Main>
      {!isPreFishbowl && <Footer />}
      <OnBoardingTour />
    </>
  );
};

export default Fishbowl;
