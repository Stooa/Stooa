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
import { WorldCafe } from '@/types/api-platform/interfaces/worldcafe';
import { Description, LandingContainer, StyledNarrowerContent } from '@/ui/pages/event-detail';
import Alert from '@/ui/Alert';
import Trans from 'next-translate/Trans';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import useTranslation from 'next-translate/useTranslation';
import { ToastContainer } from 'react-toastify';

interface Props {
  data: WorldCafe;
}

const WorldCafeLanding = ({ data }: Props) => {
  // TODO: CHECK IF WORLD CAFE IS READY
  const startDate = formatDateTime(data.startDateTimeTz ?? '');
  const { t } = useTranslation('fishbowl');

  console.log(data);

  return (
    <LandingContainer centered>
      <ToastContainer className="toastify-custom" />

      <div className="event-data">
        <h1>{data.name}</h1>
        {data.description && (
          <Description data-testid="worldCafe-description">{data.description}</Description>
        )}
      </div>
      <StyledNarrowerContent>
        <Time block as="time" dateTime={`${startDate.date} ${startDate.time}`}>
          <p className="body-md medium">Date and Time</p>
          <div className="body-lg">
            {`${startDate.month} ${startDate.day}, ${startDate.year}. ${startDate.time} ${startDate.timezone}`}
          </div>
        </Time>

        {/* TODO: IF WORLD CAFE IS NOT READY! */}
        {true && (
          <>
            <Alert className="warning body-md prewrap" block>
              <Trans i18nKey="fishbowl:accessMsg" components={{ strong: <strong /> }} />
            </Alert>

            <div>
              <ButtonCopyUrl size="large" withSvg fid={data.slug} locale={data.locale} />
              <HelpText className="body-sm">{t('copyText')}</HelpText>
            </div>
          </>
        )}
      </StyledNarrowerContent>
    </LandingContainer>
  );
};

export default WorldCafeLanding;
