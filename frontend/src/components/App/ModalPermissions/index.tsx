/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import Modal from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';
import Trans from 'next-translate/Trans';
import Button from '@/components/Common/Button';
import LocalTracks from '@/jitsi/LocalTracks';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface Props {
  closeModal: () => void;
}

const ModalPermissions: React.FC<Props> = ({ closeModal }) => {
  const { t } = useTranslation('fishbowl');

  const fireErrorToast = () => {
    toast(<Trans i18nKey="fishbowl:permissionsModalErrorToast" components={{ br: <br /> }} />, {
      type: 'error',
      toastId: 'permissions-error',
      icon: '❗',
      position: 'bottom-center',
      autoClose: 5000
    });
  };

  const handleRequestPermissions = () => {
    LocalTracks.createLocalTracks()
      .then(data => {
        let audioGranted = false;
        data.forEach(track => {
          if (track.getType() === 'audio') {
            audioGranted = true;
          }
        });

        if (audioGranted) {
          closeModal();
        } else {
          fireErrorToast();
        }
      })
      .catch(() => {
        fireErrorToast();
      });
  };

  return (
    <Modal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <div className="friend-image">
          <Image
            src="/img/friends/hold.png"
            alt="Illustration of friend holding a microphone icon"
            width={138.85}
            height={165}
            quality={100}
          />
        </div>
        <h2 className="title-sm">
          <Trans i18nKey="fishbowl:permissionsModalTitle" />
        </h2>
        <p className="description">
          <Trans i18nKey="fishbowl:permissionsModalDescription" components={{ i: <i /> }} />
        </p>
        <div className="modal-footer">
          <Button size="large" onClick={handleRequestPermissions}>
            <Trans
              i18nKey="fishbowl:permissionsModalButton"
              components={{ span: <span className="medium" /> }}
            />
          </Button>
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPermissions;
