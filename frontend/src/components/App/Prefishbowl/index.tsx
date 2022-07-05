/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Button from '@/components/Common/Button';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import BoxedFriend from '@/components/Common/SVG/BoxedFriend/BoxedFriend';
import {
  StyledFishbowlDataCard,
  StyledFishbowlDataCardHeader
} from '@/components/Web/FishbowlDataCard/styles';
import { useStooa } from '@/contexts/StooaManager';
import { Fishbowl } from '@/types/api-platform';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Counter } from '../StatusBar/Counter';
import { StyledContainer, StyledFishbowlInformation } from './styles';

interface Props {
  fishbowl: Fishbowl;
}

const Prefishbowl = ({ fishbowl }: Props) => {
  const router = useRouter();
  const { slug } = router.query;
  const { isModerator, conferenceStatus, timeStatus } = useStooa();

  const { t, lang } = useTranslation();

  return (
    <StyledContainer>
      <StyledFishbowlInformation>
        <BoxedFriend />
        <Counter
          fishbowlData={fishbowl}
          timeStatus={timeStatus}
          isModerator={isModerator}
          conferenceStatus={conferenceStatus}
        />

        <StyledFishbowlDataCard>
          <StyledFishbowlDataCardHeader>
            <p className="body-xs">
              <Trans i18nKey="fishbowl:detail.cardMiniTitle" components={{ i: <i /> }} />
            </p>
            <ButtonCopyUrl
              data-testid="copy-link"
              variant="text"
              fid={slug as string}
              locale={lang}
            >
              {t('common:linkButton')}
            </ButtonCopyUrl>
          </StyledFishbowlDataCardHeader>

          <h2 className="body-lg medium">{fishbowl.name}</h2>
          {fishbowl.description && (
            <p className="description body-md" data-testid="fishbowl-description">
              {fishbowl.description}
            </p>
          )}
        </StyledFishbowlDataCard>

        <Button variant="link">what ever you do idkidkdik</Button>
      </StyledFishbowlInformation>
      <div>Participant List</div>
    </StyledContainer>
  );
};

export default Prefishbowl;
