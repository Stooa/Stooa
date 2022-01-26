/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, {useEffect, useState} from 'react';
import {useMutation} from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';

import {FINISH_FISHBOWL, NO_INTRO_RUN_FISHBOWL, RUN_FISHBOWL} from '@/graphql/Fishbowl';
import {IConferenceStatus} from '@/jitsi/Status';
import {useStateValue} from '@/contexts/AppContext';
import ModalStartIntroduction from '@/components/App/ModalStartIntroduction';
import ModalEndFishbowl from '@/components/App/ModalEndFishbowl';

import {ButtonAppSmall} from '@/ui/Button';
import {useStooa} from "@/contexts/StooaManager";

interface Props {
  fid: string;
  conferenceStatus: IConferenceStatus;
}

const ModeratorActions: React.FC<Props> = ({ fid, conferenceStatus }) => {
  const [{}, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [introduction, setIntroduction] = useState(false);
  const [running, setRunning] = useState(false);
  const [showIntroductionModal, setShowIntroductionModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [runFishbowl] = useMutation(RUN_FISHBOWL);
  const [endFishbowl] = useMutation(FINISH_FISHBOWL);
  const [runWithoutIntroFishbowl] = useMutation(NO_INTRO_RUN_FISHBOWL);
  const { t } = useTranslation('fishbowl');
  const { data } = useStooa();

  const toggleIntroductionModal = () => {
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
    setLoading(true);
    const slug = {variables: {input: {slug: fid}}};

    if (data.hasIntroduction) {
      runFishbowl(slug)
        .then(() => {
          console.log('[STOOA] allowing users in');
          setRunning(true);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
    } else {
      try {
        runWithoutIntroFishbowl(slug)
          .then(() => {
            console.log('[STOOA] run fishbowl without introduction');
            setLoading(true);
          })
          .catch(error => {
            console.error(error);
            setLoading(false);
          });
      } catch (error) {
        console.error(`[STOOA] Error run fishbowl without introduction: ${error}`);
      }
    }
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

    if (conferenceStatus === IConferenceStatus.RUNNING) {
      setLoading(false);
    }
    
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
          (!introduction && data.hasIntroduction ? (
            <ButtonAppSmall className="app-sm button" onClick={toggleIntroductionModal}>
              <span className="text">{t('startFishbowl')}</span>
            </ButtonAppSmall>
          ) : (
            <ButtonAppSmall className="app-sm button" onClick={startFishbowl} disabled={loading}>
              <span className="text">{data.hasIntroduction ? t('allowUsers') : t('startFishbowl')}</span>
            </ButtonAppSmall>
          ))}
      </div>
    )
  );
};

export default ModeratorActions;
