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
import {
  StyledFishbowlDataCard,
  StyledFishbowlDataCardHeader
} from '@/components/Web/FishbowlDataCard/styles';
import { useStooa } from '@/contexts/StooaManager';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Counter } from '@/components/App/StatusBar/Counter';
import {
  StyledContainer,
  StyledFishbowlDataWrapper,
  StyledFishbowlInformation,
  StyledParticipantsColumn
} from './styles';
import PreFishbowlParticipants from '@/components/App/PreFishbowl/PreFishbowlParticipants';

import Red from '@/ui/svg/blobs/red.svg';
import Yellow from '@/ui/svg/blobs/yellow.svg';
import Image from 'next/image';
import { useEffect } from 'react';
import { pushEventDataLayer } from '@/lib/analytics';

const PreFishbowl = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, isModerator, conferenceStatus, timeStatus, toggleOnBoarding } = useStooa();

  const { t, lang } = useTranslation('fishbowl');

  const handleOnBoardingClick = () => {
    pushEventDataLayer({
      action: 'Action',
      category: 'onboarding'
    });
    toggleOnBoarding('prefishbowl');
  };

  useEffect(() => {
    pushEventDataLayer({
      action: 'Connect',
      category: 'prefishbowl'
    });
  }, []);

  return (
    <StyledContainer data-testid="pre-fishbowl">
      <div className="blobs-wrapper">
        <Red />
        <Yellow />
      </div>

      <StyledFishbowlInformation>
        <div className="friend">
          <Image
            alt="Stooa friend seated in a box"
            src="/img/friends/seated.png"
            width={224}
            height={223}
            quality={100}
          />
        </div>
        <Counter
          prefishbowl={true}
          data-testid="prefishbowl-counter"
          fishbowlData={data}
          timeStatus={timeStatus}
          isModerator={isModerator}
          conferenceStatus={conferenceStatus}
        />

        <StyledFishbowlDataWrapper>
          <StyledFishbowlDataCard data-testid="prefishbowl-datacard" className="prefishbowl">
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

            <h2 className=" medium">{data.name}</h2>
            {data.description && (
              <p className="description body-md" data-testid="fishbowl-description">
                {data.description}
              </p>
            )}
          </StyledFishbowlDataCard>
          <Button variant="link" onClick={handleOnBoardingClick}>
            {t('prefishbowl.onBoardingHelp')}
          </Button>
        </StyledFishbowlDataWrapper>
      </StyledFishbowlInformation>
      <StyledParticipantsColumn>
        <PreFishbowlParticipants />
      </StyledParticipantsColumn>
    </StyledContainer>
  );
};

export default PreFishbowl;
