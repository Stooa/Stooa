/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';

import Cross from '@/ui/svg/cross.svg';
import useTranslation from 'next-translate/useTranslation';

import { StyledConfirmationModal } from './styles';

interface Props {
  title: string;
  body: string;
  closeModal: () => void;
  onSubmit: () => void;
  actionText: string;
}

const ConfirmationModal = ({ closeModal, onSubmit, actionText, title, body }: Props) => {
  const { t } = useTranslation('fishbowl');

  return (
    <StyledConfirmationModal>
      <div className="content">
        <button className="close" onClick={closeModal}>
          <Cross />
        </button>
        <div className="modal--body">
          <h2 className="title-sm">{title}</h2>
          <p className="body-sm subtitle">{body}</p>
        </div>
        <div className="modal-footer">
          <Button variant="subtleLink" onClick={closeModal}>
            {t('common:cancel')}
          </Button>
          <Button onClick={onSubmit}>{actionText}</Button>
        </div>
      </div>
    </StyledConfirmationModal>
  );
};

export default ConfirmationModal;
