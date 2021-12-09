/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import { ROUTE_HOME } from '@/app.config';
import { useAuth } from '@/contexts/AuthContext';
import userRepository from '@/jitsi/User';

import { Header as HeaderStyled, Decoration as DecorationStyled } from '@/layouts/Default/styles';
import Decoration from '@/components/Web/Decoration';
import Header from '@/components/Web/Header';
import VideoPlaceholder from '@/components/App/VideoPlaceholder';
import ButtonConfig from '@/components/App/ButtonConfig';
import ButtonMic from '@/components/App/ButtonMic';
import ButtonVideo from '@/components/App/ButtonVideo';
import NicknameForm from '@/components/App/FishbowlPreJoin/form';
import AuthUser from '@/components/App/FishbowlPreJoin/form-auth';

import Modal from '@/ui/Modal';
import { ButtonLink } from '@/ui/Button';
import {
  Container,
  Devices,
  DevicesToolbar,
  Form,
  VideoContainer
} from '@/components/App/FishbowlPreJoin/styles';
import LocalTracks from '@/jitsi/LocalTracks';
import { useDevices } from '@/contexts/DevicesContext';

const FishbowlPreJoin: React.FC = () => {
  const localTracks = useRef([]);
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(
    userRepository.getUserVideoMuted()
  );
  const router = useRouter();
  const { t, lang } = useTranslation('common');
  const { isAuthenticated, user } = useAuth();

  const { videoDevice } = useDevices();

  const configButtonRef = useRef(null);

  const disposeLocalTracks = () => {
    for (let index = 0; index < localTracks.current.length; index++) {
      const localTrack = localTracks.current[index];
      const track = localTrack.getTrack();

      // This is needed to prevent a bug on Firefox
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1400488
      track.stop();
      localTrack.dispose();
    }

    localTracks.current = [];
  };

  const handleParentClick = event => {
    if (event.target.id !== 'config-button') {
      configButtonRef.current.handleShowDevices(false);
    }
  };

  const handleVideo = () => {
    setShowPlaceholder(!showPlaceholder);
  };

  const handleCancel = () => {
    router.push(ROUTE_HOME, ROUTE_HOME, { locale: lang });
  };

  useEffect(() => {
    const createLocalTracks = async () => {
      disposeLocalTracks();

      localTracks.current = await LocalTracks.createLocalTracks();

      for (let index = 0; index < localTracks.current.length; index++) {
        const localTrack = localTracks.current[index];

        if (!localTrack.isAudioTrack()) {
          const video = document.querySelector('video');

          if (video) {
            localTrack.attach(video);

            video
              .play()
              .then(() => {
                console.log('[STOOA] Playing track', localTrack.deviceId);
              })
              .catch(error => {
                console.log('[STOOA] Problem with auto play', error);
              });
          }
        }
      }
    };

    // This prevents a bug on Pre Join when you enter for the first time
    // and your camera doesn't shut down after going to the Fishbowl.
    if (videoDevice !== null) {
      createLocalTracks();
    }

    return () => {
      disposeLocalTracks();
    };
  }, [videoDevice]);

  return (
    <>
      <HeaderStyled>
        <Header navigation={false} />
      </HeaderStyled>
      <Modal onClick={handleParentClick}>
        <Container>
          <Devices>
            <VideoContainer>
              {showPlaceholder && <VideoPlaceholder />}
              <video autoPlay muted className="video" playsInline />
            </VideoContainer>
            <DevicesToolbar>
              <ButtonVideo
                handleVideo={handleVideo}
                joined={true}
                disabled={false}
                unlabeled={true}
              />
              <ButtonMic joined={true} disabled={false} unlabeled={true} />
              <ButtonConfig ref={configButtonRef} unlabeled={true} />
            </DevicesToolbar>
          </Devices>
          <Form>
            <h2 className="title-md">{t('fishbowl:nickname.title')}</h2>
            {isAuthenticated ? <AuthUser name={user.name} /> : <NicknameForm />}
            <ButtonLink className="text-sm" onClick={handleCancel}>
              {t('cancel')}
            </ButtonLink>
          </Form>
        </Container>
      </Modal>
      <DecorationStyled>
        <Decoration />
      </DecorationStyled>
    </>
  );
};

export default FishbowlPreJoin;
