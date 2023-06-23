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

import { Header as HeaderStyled, Decoration as DecorationStyled } from '@/layouts/Default/styles';
import Decoration from '@/components/Web/Decoration';
import Header from '@/components/Web/Header';
import VideoPlaceholder from '@/components/App/VideoPlaceholder';
import ButtonMoreOptions, { ButtonHandle } from '@/components/App/ButtonMoreOptions';
import ButtonMic from '@/components/App/ButtonMic';
import ButtonVideo from '@/components/App/ButtonVideo';
import NicknameForm from '@/components/App/FishbowlPreJoin/form';
import AuthUser from '@/components/App/FishbowlPreJoin/form-auth';

import Modal from '@/ui/Modal';
import {
  Container,
  Devices,
  DevicesToolbar,
  Form,
  VideoContainer
} from '@/components/App/FishbowlPreJoin/styles';
import { useDevices } from '@/contexts/DevicesContext';
import Button from '@/components/Common/Button';
import VideoPermissionsPlaceholder from '../VideoPermissionsPlaceholder';
import Trans from 'next-translate/Trans';
import { useStooa } from '@/contexts/StooaManager';
import Image from 'next/image';
import { IConferenceStatus } from '@/jitsi/Status';
import { useLocalTracks, useUser } from '@/jitsi';

const FishbowlPreJoin: React.FC = () => {
  const { videoDevice, permissions } = useDevices();
  const { isAuthenticated, user } = useAuth();
  const { data, isModerator, conferenceStatus } = useStooa();
  const { getUserVideoMuted } = useUser();
  const { createLocalTracks: hookCreateLocalTracks } = useLocalTracks();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localTracks = useRef<any[]>([]);
  const [muteVideo, setMuteVideo] = useState<boolean>(getUserVideoMuted());
  const router = useRouter();
  const { t, lang } = useTranslation('common');

  const configButtonRef = useRef<ButtonHandle>(null);

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
    if (
      configButtonRef.current &&
      event.target.id !== 'config-button' &&
      !event.target.className.includes('device')
    ) {
      configButtonRef.current.handleShowDevices(false);
    }
  };

  const handleVideo = () => {
    setMuteVideo(!muteVideo);
  };

  const handleCancel = () => {
    router.push(ROUTE_HOME, ROUTE_HOME, { locale: lang });
  };

  useEffect(() => {
    const createLocalTracks = async () => {
      disposeLocalTracks();

      localTracks.current = await hookCreateLocalTracks();

      for (let index = 0; index < localTracks.current.length; index++) {
        const localTrack = localTracks.current[index];

        if (!localTrack.isAudioTrack()) {
          const video: HTMLVideoElement | null = document.querySelector('#prejoin');

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
          } else {
            disposeLocalTracks();
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
              <video
                id="prejoin"
                style={{ opacity: muteVideo ? 0 : 1 }}
                autoPlay
                muted
                className="video"
                playsInline
              />
              <VideoPlaceholder />
              {!permissions.video && (
                <VideoPermissionsPlaceholder>
                  <Image
                    className="friend-image"
                    src="/img/friends/computer.png"
                    alt="Illustration of friend using computer"
                    width={200}
                    height={172.64}
                    quality={100}
                  />
                  <p className="body-sm">
                    <Trans
                      i18nKey="fishbowl:prejoin.permissions"
                      components={{ span: <span className="medium" /> }}
                    />
                  </p>
                </VideoPermissionsPlaceholder>
              )}
            </VideoContainer>
            <DevicesToolbar>
              <ButtonVideo
                handleVideo={handleVideo}
                joined={true}
                disabled={!permissions.video}
                unlabeled={true}
              />
              <ButtonMic joined={true} disabled={!permissions.audio} unlabeled={true} />
              <ButtonMoreOptions
                prejoin
                selectorPosition="bottom"
                ref={configButtonRef}
                unlabeled={true}
              />
            </DevicesToolbar>
          </Devices>
          <Form>
            <h2 data-testid="pre-join-title" className="title-md ">
              {isModerator &&
              data.isFishbowlNow &&
              conferenceStatus === IConferenceStatus.NOT_STARTED
                ? t('fishbowl:prejoin.startFishbowl')
                : t('fishbowl:prejoin.title')}
            </h2>
            <p className="body-md subtitle">
              {isModerator ? (
                t('fishbowl:prejoin.moderatorSubtitle')
              ) : (
                <Trans i18nKey="fishbowl:prejoin.subtitle" components={{ br: <br /> }} />
              )}
            </p>
            {isAuthenticated ? (
              <AuthUser isPrivate={data.isPrivate} name={user?.name ?? ''} />
            ) : (
              <NicknameForm isPrivate={data.isPrivate} />
            )}
            <Button
              data-testid="pre-join-cancel"
              size="small"
              variant="subtleLink"
              className="cancel"
              onClick={handleCancel}
            >
              {t('cancel')}
            </Button>
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
