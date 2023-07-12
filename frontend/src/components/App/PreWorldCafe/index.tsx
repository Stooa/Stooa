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
  StyledFishbowlDataCardHeader,
  StyledFishbowlDataCardScroll
} from '@/components/Web/FishbowlDataCard/styles';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import {
  StyledContainer,
  StyledFishbowlDataWrapper,
  StyledFishbowlInformation,
  StyledParticipantsColumn
} from './styles';

import Red from '@/ui/svg/blobs/red.svg';
import Yellow from '@/ui/svg/blobs/yellow.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { pushEventDataLayer } from '@/lib/analytics';
import { useModals } from '@/contexts/ModalsContext';
import PreFishbowlParticipants from '../PreFishbowl/PreFishbowlParticipants';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import WorldCafeCounter from '../WorldCafeCounter/WorldCafeCounter';

const PreWorldCafe = () => {
  const [closedDescription, setClosedDescription] = useState(true);
  const router = useRouter();
  const { wid } = router.query;
  const { worldCafe, isGuest, isModerator, status } = useWorldCafeStore(store => ({
    isModerator: store.isModerator,
    status: store.status,
    worldCafe: store.worldCafe,
    isGuest: store.isGuest
  }));

  const { toggleOnBoarding } = useModals();

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

  if (!worldCafe) {
    return null;
  }

  return (
    <StyledContainer className="world-cafe" data-testid="pre-worldcafe">
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
        <WorldCafeCounter
          isModerator={isModerator}
          preEvent={true}
          data-testid="prefishbowl-counter"
          startDateTimeTz={worldCafe.startDateTimeTz ?? worldCafe.startDateTime}
          eventStatus={status}
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
                eventType="fishbowl"
                slug={wid as string}
                locale={lang}
              />
            </StyledFishbowlDataCardHeader>

            <StyledFishbowlDataCardScroll>
              <h2 data-testid="fishbowl-name" className=" medium">
                {worldCafe.name}
              </h2>
              {worldCafe.description && (
                <p
                  className={`description body-md ${closedDescription ? 'closed' : ''}`}
                  data-testid="fishbowl-description"
                >
                  {worldCafe.description}
                </p>
              )}
              {worldCafe.description && worldCafe.description.length > 300 && (
                <Button variant="link" onClick={() => setClosedDescription(state => !state)}>
                  {closedDescription ? 'Read more' : 'Less'}
                </Button>
              )}

              {worldCafe.questions && (
                <div>
                  {worldCafe.questions.map((question, index) => (
                    <div key={index} className="question">
                      <span className="question-title">
                        <h3 className="body-md" data-testid="fishbowl-question">
                          {question.title}
                        </h3>
                        <p>
                          ({index === 0 ? worldCafe.roundMinutes + 5 : worldCafe.roundMinutes}{' '}
                          {t('form:worldCafe.minutes')})
                        </p>
                      </span>
                      {question.description && question.description.length > 0 && (
                        <p>{question.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </StyledFishbowlDataCardScroll>
          </StyledFishbowlDataCard>
          <Button data-testid="on-boarding-button" variant="link" onClick={handleOnBoardingClick}>
            {t('prefishbowl.onBoardingHelp')}
          </Button>
        </StyledFishbowlDataWrapper>
      </StyledFishbowlInformation>
      <StyledParticipantsColumn>
        <PreFishbowlParticipants isGuest={isGuest} slug={wid as string} />
      </StyledParticipantsColumn>
    </StyledContainer>
  );
};

export default PreWorldCafe;
