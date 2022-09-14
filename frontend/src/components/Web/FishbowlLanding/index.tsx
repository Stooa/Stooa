/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import React from 'react';
import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

import { Fishbowl } from '@/types/api-platform';
import { useStateValue } from '@/contexts/AppContext';
import { formatDateTime } from '@/lib/helpers';
import { Description } from '@/ui/pages/fishbowl-detail';
import ButtonCopyUrl from '@/components/Common/ButtonCopyUrl';
import { HelpText, LandingContainer, StyledDetailAlert, StyledFishbowlData, Time } from './styles';
import { ToastContainer } from 'react-toastify';

interface Props {
  data: Fishbowl;
}

const FishbowlLanding: React.FC<Props> = ({ data }) => {
  const [{ fishbowlReady }] = useStateValue();
  const { t } = useTranslation('fishbowl');
  const startDate = formatDateTime(data.startDateTimeTz);
  const endDate = formatDateTime(data.endDateTimeTz);

  return (
    <LandingContainer centered>
      <ToastContainer className="toastify-custom" />
      <StyledFishbowlData>
        <h1 data-testid="fishbowl-name" className="title-md">
          {data.name}
        </h1>
        {data.description && (
          <Description data-testid="fishbowl-description">{data.description}</Description>
        )}
      </StyledFishbowlData>
      <Time as="time" dateTime={`${startDate.date} ${startDate.time} - ${endDate.time}`}>
        <p className="body-md medium">{t('dateandtime')}</p>
        <div className="body-lg">
          {`${t(`months.${startDate.month}`)} ${startDate.day}, ${startDate.year}. ${
            startDate.time
          } - ${endDate.time} ${endDate.timezone}`}
        </div>
      </Time>
      {!fishbowlReady && (
        <>
          <StyledDetailAlert className="warning body-md prewrap" block>
            <Trans i18nKey="fishbowl:accessMsg" components={{ strong: <strong /> }} />
          </StyledDetailAlert>
          {!data.isPrivate && (
            <ButtonCopyUrl size="large" withSvg fid={data.slug} locale={data.locale} />
          )}
          {data.plainPassword && (
            <ButtonCopyUrl
              size="large"
              withSvg
              fid={data.slug}
              locale={data.locale}
              isPrivate
              plainPassword={data.plainPassword}
            />
          )}
          <HelpText className="body-sm">{t('copyText')}</HelpText>
        </>
      )}
    </LandingContainer>
  );
};

export default FishbowlLanding;
