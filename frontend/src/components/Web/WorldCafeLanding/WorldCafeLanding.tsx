/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HelpText, Time } from '../FishbowlLanding/styles';
// import { WorldCafe } from '@/types/api-platform/interfaces/worldcafe';
import { Description, LandingContainer, StyledNarrowerContent } from '@/ui/pages/event-detail';
import Alert from '@/ui/Alert';
import Trans from 'next-translate/Trans';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import useTranslation from 'next-translate/useTranslation';
import { ToastContainer } from 'react-toastify';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import Loader from '@/components/Web/Loader';

const WorldCafeLanding = () => {
  const { isReady: isWorldCafeReady, worldCafe } = useWorldCafeStore(state => ({
    isReady: state.isReady,
    worldCafe: state.worldCafe
  }));
  const { t, lang } = useTranslation('fishbowl');

  if (!worldCafe) {
    return <Loader />;
  }

  const dateNormalized = new Date(worldCafe.startDateTimeTz ?? '');

  const dateInText = new Intl.DateTimeFormat(lang, {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(dateNormalized);

  return (
    <>
      <ToastContainer className="toastify-custom" />
      <LandingContainer centered>
        <div className="event-data">
          <h1 className="title-md">{worldCafe.name}</h1>
          {worldCafe.description && (
            <Description data-testid="worldCafe-description">{worldCafe.description}</Description>
          )}
        </div>
        <StyledNarrowerContent>
          <Time block as="time">
            <p className="body-md medium">{t('dateandtime')}</p>
            <div className="body-lg">{dateInText}</div>
          </Time>

          {!isWorldCafeReady && (
            <>
              <Alert className="warning body-md prewrap" block>
                <Trans i18nKey="fishbowl:accessMsg" components={{ strong: <strong /> }} />
              </Alert>

              <div>
                <ButtonCopyUrl
                  eventType="world-cafe"
                  size="large"
                  withSvg
                  slug={worldCafe.slug}
                  locale={worldCafe.locale}
                />
                <HelpText className="body-sm">{t('copyText')}</HelpText>
              </div>
            </>
          )}
        </StyledNarrowerContent>
      </LandingContainer>
    </>
  );
};

export default WorldCafeLanding;
