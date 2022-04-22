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

interface Props {
  closeModal: () => void;
  endFishbowl: () => void;
  disabled: boolean;
}

const EndFishbowl: React.FC<Props> = ({ closeModal, endFishbowl, disabled }) => {
  const { t } = useTranslation('fishbowl');

  return (
    <Modal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="title-sm">{t('endModal.title')}</h2>
        <p className="description">{t('endModal.description')}</p>
        <div className="modal-footer">
          <Button onClick={endFishbowl} className="error" disabled={disabled}>
            {t('endModal.button')}
          </Button>
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EndFishbowl;
