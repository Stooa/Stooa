/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React, { useState } from 'react';
import Button from '@/components/Common/Button';
import { User } from '@/types/user';
import useTranslation from 'next-translate/useTranslation';
import Modal from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';
import Trans from 'next-translate/Trans';
import ReasonForm from '@/components/App/HostContextActions/ReasonForm';

interface Props {
  participant: User;
}

const HostContextActions: React.FC<Props> = ({ participant, children }) => {
  const { t } = useTranslation('fishbowl');
  const [show, setShow] = useState<boolean>(false);

  const closeModal = (): void => {
    setShow(false);
  };

  const showModal = (): void => {
    setShow(true);
  };

  return (
    <>
      <Button variant="secondary" className="never-full" onClick={showModal}>
        <span>{t('kick.button')}</span>
      </Button>
      {show && (
        <Modal>
          <div className="content">
            <button className="close" onClick={closeModal}>
              <Cross />
            </button>
            <h2 className="title-sm">{t('kick.modal.title', {userName: participant.name})}</h2>
            <p className="description">
              <Trans i18nKey="fishbowl:kick.modal.description" components={{ i: <i /> }} />
            </p>
            <ReasonForm participant={participant} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default HostContextActions;
