/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';

import { FINISH_FISHBOWL, NO_INTRO_RUN_FISHBOWL, RUN_FISHBOWL } from '@/graphql/Fishbowl';
import { IConferenceStatus } from '@/jitsi/Status';

import { useStateValue } from '@/contexts/AppContext';
import { useDevices } from '@/contexts/DevicesContext';
import { useStooa } from '@/contexts/StooaManager';

import ModalStartIntroduction from '@/components/App/ModalStartIntroduction';
import ModalEndFishbowl from '@/components/App/ModalEndFishbowl';
import Button from '@/components/Common/Button';

import PermissionsAlert from '@/ui/svg/permissions-alert.svg';
import { useModals } from '@/contexts/ModalsContext';
import ModalEndIntroduction from '../ModalEndIntroduction';
import { pushEventDataLayer } from '@/lib/analytics';
import { useConference, useSharedTrack } from '@/jitsi';

interface Props {
  fid: string;
  conferenceStatus: IConferenceStatus;
}

const ModeratorActions: React.FC<Props> = ({ fid, conferenceStatus }) => {
  const [, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const { getLocalTracks } = useConference();
  const { removeShareTrack } = useSharedTrack();
  const [introduction, setIntroduction] = useState(false);
  const [showIntroductionModal, setShowIntroductionModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [runFishbowl] = useMutation(RUN_FISHBOWL);
  const [endFishbowl] = useMutation(FINISH_FISHBOWL);
  const [runWithoutIntroFishbowl] = useMutation(NO_INTRO_RUN_FISHBOWL);
  const { t } = useTranslation('fishbowl');
  const { data, isSharing, clientRunning, setClientRunning, isRecording, stopRecording } =
    useStooa();
  const { permissions, setShowModalPermissions } = useDevices();
  const { showEndIntroductionModal, setShowEndIntroductionModal } = useModals();

  const toggleIntroductionModal = () => {
    if (!permissions.audio && !introduction) {
      setShowModalPermissions(true);
      return;
    }

    setShowIntroductionModal(!showIntroductionModal);
  };

  const toggleFinishModal = () => {
    setShowFinishModal(!showFinishModal);
  };

  const startIntroduction = () => {
    setLoading(true);

    dispatch({
      type: 'FISHBOWL_STARTED',
      fishbowlStarted: true
    });
  };

  const startFishbowl = () => {
    if (!permissions.audio && !introduction) {
      setShowModalPermissions(true);
      return;
    }

    setLoading(true);
    const slug = { variables: { input: { slug: fid } } };

    if (data.hasIntroduction) {
      runFishbowl(slug)
        .then(() => {
          console.log('[STOOA] allowing users in');
          setClientRunning(true);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
    } else {
      dispatch({
        type: 'FISHBOWL_STARTED',
        fishbowlStarted: true
      });

      try {
        runWithoutIntroFishbowl(slug)
          .then(() => {
            console.log('[STOOA] run fishbowl without introduction');
            setLoading(true);
          })
          .catch(error => {
            console.error(error);
          });
      } catch (error) {
        console.error(`[STOOA] Error run fishbowl without introduction: ${error}`);
      }
    }
  };

  const finishFishbowl = async () => {
    setLoading(true);

    if (isRecording) {
      await stopRecording();
    }

    endFishbowl({
      variables: {
        input: {
          slug: fid
        }
      }
    })
      .then(() => {
        console.log('[STOOA] Finished fishbowl. redirecting to thankyou page');
        setLoading(false);
        setShowFinishModal(false);
      })
      .catch(error => {
        console.error('[STOOA] error finishing fishbowl: ', error);
        setLoading(false);
      });
  };

  const handleStartFishbowl = () => {
    if (isSharing) {
      setShowEndIntroductionModal(true);
    } else {
      startFishbowl();
    }
  };

  const handleStartFishbowlWhileSharing = async () => {
    setLoading(true);
    const shareLocalTrack = getLocalTracks().filter(track => track.getVideoType() === 'desktop');

    await removeShareTrack(shareLocalTrack[0]);
    setShowEndIntroductionModal(false);
    startFishbowl();

    pushEventDataLayer({
      action: 'modal_stop_share',
      category: 'Sharescreen',
      label: window.location.href
    });
  };

  useEffect(() => {
    setClientRunning(conferenceStatus === IConferenceStatus.RUNNING);

    if (conferenceStatus === IConferenceStatus.RUNNING) {
      setLoading(false);
    }

    if (conferenceStatus === IConferenceStatus.INTRODUCTION) {
      setIntroduction(true);
      setShowIntroductionModal(false);
      setLoading(false);
    }
  }, [conferenceStatus]);

  return conferenceStatus === IConferenceStatus.FINISHED ? null : (
    <div className="actions">
      {showIntroductionModal && (
        <ModalStartIntroduction
          closeModal={toggleIntroductionModal}
          startIntroduction={startIntroduction}
          disabled={loading}
        />
      )}
      {showEndIntroductionModal && (
        <ModalEndIntroduction
          closeModal={() => setShowEndIntroductionModal(false)}
          startFishbowl={handleStartFishbowlWhileSharing}
          disabled={loading}
        />
      )}
      {showFinishModal && (
        <ModalEndFishbowl
          closeModal={toggleFinishModal}
          endFishbowl={finishFishbowl}
          disabled={loading}
          isRecording={isRecording}
          stopRecording={stopRecording}
        />
      )}
      {(clientRunning || data.isFishbowlNow) && (
        <Button
          data-testid="finish-fishbowl"
          size="medium"
          className="button error"
          onClick={toggleFinishModal}
        >
          <span className="text">{t('endFishbowl')}</span>
        </Button>
      )}
      {!(clientRunning || data.isFishbowlNow) &&
        (!introduction && data.hasIntroduction && !data.isFishbowlNow ? (
          <Button size="medium" className="button" onClick={toggleIntroductionModal}>
            {!permissions.audio && (
              <div className="alert">
                <PermissionsAlert />
              </div>
            )}
            <span className="text">{t('startIntroduction')}</span>
          </Button>
        ) : (
          <Button size="medium" className="button" onClick={handleStartFishbowl} disabled={loading}>
            {!permissions.audio && !introduction && (
              <div className="alert">
                <PermissionsAlert />
              </div>
            )}
            <span className="text">
              {data.hasIntroduction ? t('allowUsers') : t('startFishbowl')}
            </span>
          </Button>
        ))}
    </div>
  );
};

export default ModeratorActions;
