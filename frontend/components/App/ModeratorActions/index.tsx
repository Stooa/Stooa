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

import { RUN_FISHBOWL, FINISH_FISHBOWL } from '@/graphql/Fishbowl';
import { IConferenceStatus } from '@/jitsi/Status';
import { ActionTypes, useStateValue } from '@/contexts/AppContext';
import ModalStartIntroduction from '@/components/App/ModalStartIntroduction';
import ModalEndFishbowl from '@/components/App/ModalEndFishbowl';

import { ButtonAppSmall } from '@/ui/Button';

interface Props {
  fid: string;
  conferenceStatus: IConferenceStatus;
}

const ModeratorActions: React.FC<Props> = ({ fid, conferenceStatus }) => {
  const { dispatch } = useStateValue();
  const [loading, setLoading] = useState(false);
  const [introduction, setIntroduction] = useState(false);
  const [running, setRunning] = useState(false);
  const [showIntroductionModal, setShowIntroductionModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [runFishbowl] = useMutation(RUN_FISHBOWL);
  const [endFishbowl] = useMutation(FINISH_FISHBOWL);
  const { t } = useTranslation('fishbowl');

  const toggleIntroductionModal = () => {
    setShowIntroductionModal(!showIntroductionModal);
  };

  const toggleFinishModal = () => {
    setShowFinishModal(!showFinishModal);
  };

  const startIntroduction = () => {
    setLoading(true);
    console.log('Starting introduction');

    dispatch({
      type: ActionTypes.Start,
      payload: {
        fishbowlStarted: true
      }
    });
  };

  const startFishbowl = () => {
    setLoading(true);

    runFishbowl({
      variables: {
        input: {
          slug: fid
        }
      }
    })
      .then(() => {
        console.log('[STOOA] allowing users in');
        setIntroduction(false);
        setRunning(true);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const finishFishbowl = () => {
    setLoading(true);

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

  useEffect(() => {
    setRunning(conferenceStatus === IConferenceStatus.RUNNING);

    if (conferenceStatus === IConferenceStatus.INTRODUCTION) {
      setIntroduction(true);
      setShowIntroductionModal(false);
      setLoading(false);
    }
  }, [conferenceStatus]);

  return (
    conferenceStatus !== IConferenceStatus.FINISHED && (
      <div className="actions">
        {showIntroductionModal && (
          <ModalStartIntroduction
            closeModal={toggleIntroductionModal}
            startIntroduction={startIntroduction}
            disabled={loading}
          />
        )}
        {showFinishModal && (
          <ModalEndFishbowl
            closeModal={toggleFinishModal}
            endFishbowl={finishFishbowl}
            disabled={loading}
          />
        )}
        {running && (
          <ButtonAppSmall className="app-sm button error" onClick={toggleFinishModal}>
            <span className="text">{t('endFishbowl')}</span>
          </ButtonAppSmall>
        )}
        {!running &&
          (!introduction ? (
            <ButtonAppSmall className="app-sm button" onClick={toggleIntroductionModal}>
              <span className="text">{t('startFishbowl')}</span>
            </ButtonAppSmall>
          ) : (
            <ButtonAppSmall className="app-sm button" onClick={startFishbowl} disabled={loading}>
              <span className="text">{t('allowUsers')}</span>
            </ButtonAppSmall>
          ))}
      </div>
    )
  );
};

export default ModeratorActions;
