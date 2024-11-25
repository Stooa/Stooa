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

import { StyledLeftAlignedModal } from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';
import Button from '@/components/Common/Button';

interface Props {
  closeModal: () => void;
}

const ModalEnableAiSummary = ({ closeModal }: Props) => {
  const { t } = useTranslation('form');

  return (
    <StyledLeftAlignedModal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="title-sm">{t('fishbowl.AIDataPrivacyTitle')}</h2>
        <p className="description">{t('fishbowl.AIDataPrivacyDescription')}</p>
        <div className="modal-footer">
          <Button onClick={closeModal}>{t('common:modalAccept')}</Button>
        </div>
      </div>
    </StyledLeftAlignedModal>
  );
};

export default ModalEnableAiSummary;
