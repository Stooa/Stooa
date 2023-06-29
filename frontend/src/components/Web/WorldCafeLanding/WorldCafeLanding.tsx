/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { formatDateTime } from '@/lib/helpers';
import { HelpText, Time } from '../FishbowlLanding/styles';
// import { WorldCafe } from '@/types/api-platform/interfaces/worldcafe';
import { Description, LandingContainer, StyledNarrowerContent } from '@/ui/pages/event-detail';
import Alert from '@/ui/Alert';
import Trans from 'next-translate/Trans';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import useTranslation from 'next-translate/useTranslation';
import { ToastContainer } from 'react-toastify';
import { useWorldCafeStore } from '@/store/useWorldCafeStore';
import LoadingIcon from '@/components/Common/LoadingIcon';

const WorldCafeLanding = () => {
  const { isReady: isWorldCafeReady, worldCafe } = useWorldCafeStore(state => ({
    isReady: state.isReady,
    worldCafe: state.worldCafe
  }));
  const { t } = useTranslation('fishbowl');

  if (!worldCafe) {
    return <LoadingIcon />;
  }

  const startDate = formatDateTime(worldCafe.startDateTimeTz ?? '');

  return (
    <LandingContainer centered>
      <ToastContainer className="toastify-custom" />

      <div className="event-data">
        <h1>{worldCafe.name}</h1>
        {worldCafe.description && (
          <Description data-testid="worldCafe-description">{worldCafe.description}</Description>
        )}
      </div>
      <StyledNarrowerContent>
        <Time block as="time" dateTime={`${startDate.date} ${startDate.time}`}>
          <p className="body-md medium">Date and Time</p>
          <div className="body-lg">
            {`${startDate.month} ${startDate.day}, ${startDate.year}. ${startDate.time} ${startDate.timezone}`}
          </div>
        </Time>

        {!isWorldCafeReady && (
          <>
            <Alert className="warning body-md prewrap" block>
              <Trans i18nKey="fishbowl:accessMsg" components={{ strong: <strong /> }} />
            </Alert>

            <div>
              <ButtonCopyUrl size="large" withSvg fid={worldCafe.slug} locale={worldCafe.locale} />
              <HelpText className="body-sm">{t('copyText')}</HelpText>
            </div>
          </>
        )}
      </StyledNarrowerContent>
    </LandingContainer>
  );
};

export default WorldCafeLanding;
