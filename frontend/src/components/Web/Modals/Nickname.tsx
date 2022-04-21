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
        <h2 className="title-md">{t('fishbowl:prejoin.title')}</h2>
        <Button variant="text" className="body-sm" onClick={toggleModal}>
          {t('cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default Nickname;
