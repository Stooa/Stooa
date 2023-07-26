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
} from '../../PreFishbowl/styles';

import Red from '@/ui/svg/blobs/red.svg';
import Yellow from '@/ui/svg/blobs/yellow.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { pushEventDataLayer } from '@/lib/analytics';
import PreFishbowlParticipants from '../../PreFishbowl/PreFishbowlParticipants';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import Counter from '../Counter/Counter';

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

  const getOrderedQuestions = questions => {
    return [...questions].sort((a, b) => a.position - b.position);
  };

  const { lang } = useTranslation('fishbowl');

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
        <Image
          alt="Stooa friend seated in a box"
          src="/img/friends/seated.png"
          width={224 / 1.4}
          height={223 / 1.4}
          sizes="(max-width: 1200px) 150px"
        />

        {status && (
          <Counter
            isModerator={isModerator}
            preEvent={true}
            data-testid="preworldcafe-counter"
            startDateTimeTz={worldCafe.startDateTimeTz}
            eventStatus={status}
          />
        )}

        <StyledFishbowlDataWrapper>
          <StyledFishbowlDataCard data-testid="preworldcafe-datacard" className="prefishbowl">
            <StyledFishbowlDataCardHeader>
              <p className="body-xs">
                <Trans i18nKey="world-cafe:detail.cardMiniTitle" components={{ i: <i /> }} />
              </p>
              <ButtonCopyUrl
                data-testid="copy-link"
                variant="text"
                eventType="world-cafe"
                slug={wid as string}
                locale={lang}
              />
            </StyledFishbowlDataCardHeader>

            <StyledFishbowlDataCardScroll>
              <h2 data-testid="fishbowl-name" className="medium">
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
              {worldCafe.description && worldCafe.description.length > 220 && (
                <Button
                  variant="link"
                  className="see-more"
                  onClick={() => setClosedDescription(state => !state)}
                >
                  {closedDescription ? 'Read more' : 'Less'}
                </Button>
              )}

              {worldCafe.questions && (
                <div>
                  {getOrderedQuestions(worldCafe.questions).map((question, index) => (
                    <div key={index} className="question">
                      <h3 className="body-md" data-testid="fishbowl-question">
                        {question.title}
                      </h3>
                      {question.description && question.description.length > 0 && (
                        <p>{question.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </StyledFishbowlDataCardScroll>
          </StyledFishbowlDataCard>
        </StyledFishbowlDataWrapper>
      </StyledFishbowlInformation>
      <StyledParticipantsColumn>
        <PreFishbowlParticipants eventType="world-cafe" isGuest={isGuest} slug={wid as string} />
      </StyledParticipantsColumn>
    </StyledContainer>
  );
};

export default PreWorldCafe;
