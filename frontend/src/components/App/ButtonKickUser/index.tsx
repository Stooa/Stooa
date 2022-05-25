/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  onClick: () => void;
}

const ButtonKickUser = ({ onClick }: Props) => {
  const { t } = useTranslation('fishbowl');

  return (
    <>
      <Button variant="secondary" className="never-full" onClick={onClick}>
        <span>{t('kick.button')}</span>
      </Button>
    </>
  );
};

export default ButtonKickUser;
