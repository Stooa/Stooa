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
import Button from '@/components/Common/Button';
import Trans from 'next-translate/Trans';

interface Props {
  closeModal: () => void;
}

const ModalScreenSharePermissions = ({ closeModal }: Props) => {
  const { t } = useTranslation('fishbowl');

  return (
    <Modal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <div className="modal--body">
          <h2 className="title-sm">{t('screenSharePermissionsModal.title')}</h2>
          <p className="description">
            <Trans
              i18nKey="fishbowl:screenSharePermissionsModal.description"
              components={{
                a: (
                  <a
                    className="colored decorated"
                    href="x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                )
              }}
            />
          </p>
        </div>
        <div className="modal-footer">
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalScreenSharePermissions;
