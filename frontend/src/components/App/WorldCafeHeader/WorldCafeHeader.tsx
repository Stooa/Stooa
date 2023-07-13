/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Logo from '@/components/Common/Logo';
import { StyledWorldCafeHeader } from './styles';
import Button from '@/components/Common/Button';
import { INTRODUCE_WORLD_CAFE } from '@/graphql/WorldCafe';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';

const WorldCafeHeader = () => {
  const { wid } = useRouter().query;
  const [introduceWorldCafe] = useMutation(INTRODUCE_WORLD_CAFE);
  const { t } = useTranslation('world-cafe');
  const { isModerator } = useWorldCafeStore(store => ({
    isModerator: store.isModerator
  }));

  const slug = { variables: { input: { slug: wid } } };

  const handleStartWorldCafe = async () => {
    try {
      const foo = await introduceWorldCafe(slug);
      console.log(foo);
    } catch (error) {
      console.error(`[STOOA] Error introduction: ${error}`);
    }
  };

  return (
    <StyledWorldCafeHeader>
      <Logo className="header-logo" />
      {isModerator && <Button onClick={handleStartWorldCafe}>{t('startWorldCafe')}</Button>}
    </StyledWorldCafeHeader>
  );
};

export default WorldCafeHeader;
