/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import { StyledFishbowlDataCard } from '@/components/Web/FishbowlDataCard/styles';
import { Fishbowl } from '@/types/api-platform';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { StyledContainer, StyledFishbowlInformation } from './styles';

interface Props {
  fishbowl: Fishbowl;
}

const Prefishbowl = ({ fishbowl }: Props) => {
  const router = useRouter();
  const { slug } = router.query;

  const { t, lang } = useTranslation();

  return (
    <StyledContainer>
      <StyledFishbowlInformation>
        <h3>Lovely fishbowl</h3>
        <StyledFishbowlDataCard>
          <p className="body-xs card-subtitle">Like yep</p>
          <ButtonCopyUrl data-testid="copy-link" variant="text" fid={slug as string} locale={lang}>
            {t('common:linkButton')}
          </ButtonCopyUrl>
          <h2 className="body-lg medium">{fishbowl.name}</h2>
        </StyledFishbowlDataCard>
      </StyledFishbowlInformation>
      <div>Participant List</div>
    </StyledContainer>
  );
};

export default Prefishbowl;
