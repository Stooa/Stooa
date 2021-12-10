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

import { ButtonLink } from '@/ui/Button';
import Modal from '@/ui/Modal';
import Cross from '@/ui/svg/cross.svg';

interface Props {
  toggleModal: () => void;
}

const Nickname: React.FC<Props> = ({ toggleModal }) => {
  const { t } = useTranslation('common');

  return (
    <Modal>
      <div className="content">
        <button className="close" onClick={toggleModal}>
          <Cross />
        </button>
        <h2 className="title-md">{t('fishbowl:nickname.title')}</h2>
        <ButtonLink className="text-sm" onClick={toggleModal}>
          {t('cancel')}
        </ButtonLink>
      </div>
    </Modal>
  );
};

export default Nickname;
