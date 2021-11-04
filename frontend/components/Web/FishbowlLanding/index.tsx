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

import { useStateValue } from 'contexts/AppContext';
import { formatDateTime } from 'lib/helpers';
import CopyUrl from 'components/Common/CopyUrl';
import { Container, Description, Time, TimeLeft } from 'ui/pages/fishbowl-detail';

interface IProps {
  data: any;
}

const FishbowlDetail: React.FC<IProps> = ({ data }) => {
  const [{ fishbowlReady }] = useStateValue();
  const { t } = useTranslation('fishbowl');
  const startDate = formatDateTime(data.startDateTimeTz);
  const endDate = formatDateTime(data.endDateTimeTz);

  return (
    <Container centered>
      <h1 className="title-md">{data.name}</h1>
      {data.description && <Description>{data.description}</Description>}
      <Time
        as="time"
        dateTime={`${startDate.date} ${startDate.time} - ${endDate.time}`}
        className="highlight">
        <p className="text-md medium">{t('dateandtime')}</p>
        <div className="text-lg">
          {`${t(`months.${startDate.month}`)} ${startDate.day}, ${startDate.year}. ${
            startDate.time
          } - ${endDate.time} ${endDate.timezone}`}
        </div>
      </Time>
      {!fishbowlReady && (
        <>
          <TimeLeft className="warning text-md prewrap" block>
            <Trans i18nKey="fishbowl:accessMsg" components={{ strong: <strong /> }} />
          </TimeLeft>
          <CopyUrl className="centered" data={data} />
        </>
      )}
    </Container>
  );
};

export default FishbowlDetail;
