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

import Cross from '@/ui/svg/cross.svg';
// import Trans from 'next-translate/Trans';
import Button from '@/components/Common/Button';
import Modal from '@/ui/Modal';

interface Props {
  closeModal: () => void;
  startFishbowl: () => void;
  disabled: boolean;
}

const ModalEndIntroduction: React.FC<Props> = ({ closeModal, startFishbowl, disabled }) => {
  const { t } = useTranslation('fishbowl');

  return (
    <Modal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="title-sm">{t('endIntroModal.title')}</h2>
        <p className="description">
          {/* <Trans i18nKey="fishbowl:introduceModal.description" components={{ i: <i /> }} /> */}
          Cuando acabes la intro y dejes entrar a lxs asistentes, dejarás automáticamente de
          compartir pantalla y ya no podrás volver a hacerlo.
        </p>
        <div className="modal-footer">
          <Button size="medium" onClick={startFishbowl} disabled={disabled}>
            Acabar introducción
          </Button>
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEndIntroduction;
