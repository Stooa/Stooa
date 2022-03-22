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
import { ButtonApp, ButtonLinkApp } from '@/ui/Button';
import Cross from '@/ui/svg/cross.svg';
import Trans from 'next-translate/Trans';

interface Props {
  closeModal: () => void;
  startIntroduction: () => void;
  disabled: boolean;
}

const StartIntroduction: React.FC<Props> = ({ closeModal, startIntroduction, disabled }) => {
  const { t } = useTranslation('fishbowl');

  return (
    <Modal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="app-lg">{t('introduceModal.title')}</h2>
        <p className="description">
          <Trans i18nKey="fishbowl:introduceModal.description" components={{ i: <i /> }} />
        </p>
        <div className="modal-footer">
          <ButtonApp onClick={startIntroduction} disabled={disabled}>
            {t('introduceModal.button')}
          </ButtonApp>
          <ButtonLinkApp onClick={closeModal}>{t('common:cancel')}</ButtonLinkApp>
        </div>
      </div>
    </Modal>
  );
};

export default StartIntroduction;
