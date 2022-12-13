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
import { StyledIntroModal } from './styles';
import Image from 'next/image';

interface Props {
  closeModal: () => void;
  startIntroduction: () => void;
  disabled: boolean;
}

const ModalStartIntroduction: React.FC<Props> = ({ closeModal, startIntroduction, disabled }) => {
  const { t } = useTranslation('fishbowl');
  // TODO: usesinwodwisdth to chose one content or another

  return (
    <StyledIntroModal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <h2 className="title-sm">{t('introduceModal.title')}</h2>
        {/* <p className="description">
          <Trans i18nKey="fishbowl:introduceModal.description" components={{ i: <i /> }} />
        </p> */}
        <div className="description">
          <div>
            <Image
              src="/img/friends/reading-book.png"
              objectFit="contain"
              width={146}
              height={200}
              quality={100}
              alt="Stooa's friend reading a book"
            />
            <p>
              Es tu momento para dirigir unas palabras a lxs asistentes antes de abrir el fishbowl.
            </p>
          </div>

          <div>
            <Image
              src="/img/friends/choosing.png"
              objectFit="contain"
              width={186}
              height={200}
              quality={100}
              alt="Stooa's friend choosing to share the screen"
            />
            <p>
              También podrás compartir tu pantalla para dotar de contenido visual a tu introducción.
            </p>
          </div>
          <div>
            <Image
              src="/img/friends/idea.png"
              objectFit="contain"
              width={114}
              height={200}
              quality={100}
              alt="Stooa's friend choosing to share the screen"
            />
            <p>Cuando acabes, podrás permitir a lxs asistentes unirse a la conversación.</p>
          </div>
        </div>
        <div className="modal-footer">
          <Button size="medium" onClick={startIntroduction} disabled={disabled}>
            {t('introduceModal.button')}
          </Button>
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
        </div>
      </div>
    </StyledIntroModal>
  );
};

export default ModalStartIntroduction;
