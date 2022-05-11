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
import Image from 'next/image';

interface Props {
  closeModal: () => void;
}

const ModalPermissions: React.FC<Props> = ({ closeModal }) => {
  const { t } = useTranslation('fishbowl');

  return (
    <Modal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <Image
          src="/img/permissions/modal.png"
          alt="Modal Illustration, a cute one"
          height={165}
          width={138.85}
        />
        <h2 className="title-sm">Permissions needed</h2>
        <p className="description">
          If you want to take a seat in order say something, Stooa needs permissions to access your
          microphone so others can hear you.
          {/* <Trans i18nKey="fishbowl:introduceModal.description" components={{ i: <i /> }} /> */}
        </p>
        <div className="modal-footer">
          <Button size="large">Request access</Button>
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPermissions;
