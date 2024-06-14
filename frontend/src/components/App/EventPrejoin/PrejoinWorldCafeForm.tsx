/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import { PrejoinForm } from './PrejoinForm';
import { StyledFormWrapper } from './styles';
import { useAuth } from '@/contexts/AuthContext';

export const PrejoinWorldCafeForm = () => {
  const { t } = useTranslation('form');
  const { isAuthenticated, user } = useAuth();

  return (
    <StyledFormWrapper>
      <h2 data-testid="pre-join-title" className="title-md ">
        {t('worldCafe.prejoin.title')}
      </h2>
      <p className="description">{t('worldCafe.prejoin.description')}</p>
      <PrejoinForm isAuthenticated={isAuthenticated} user={user} />
    </StyledFormWrapper>
  );
};
