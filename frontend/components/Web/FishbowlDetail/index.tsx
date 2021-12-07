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
import { useStateValue } from 'contexts/AppContext';
import { formatDateTime } from 'lib/helpers';
import CopyUrl from 'components/Common/CopyUrl';
import { Container, TimeLeft } from 'ui/pages/fishbowl-detail';

interface Props {
  data: Fishbowl;
}

const FishbowlDetail: React.FC<Props> = ({ data }) => {
  const {
    state: { fishbowlReady }
  } = useStateValue();
  const { t } = useTranslation('fishbowl');
  const startDate = formatDateTime(data.startDateTimeTz);

  return (
    <Container>
      <dl>
        <dt>{t('detail.title')}</dt>
        <dd>{data.name}</dd>
        {data.description && (
          <>
            <dt>{t('detail.description')}</dt>
            <dd>{data.description}</dd>
          </>
        )}
        <dt>{t('detail.startDate')}</dt>
        <dd>
          {t(`months.${startDate.month}`)} {startDate.day}, {startDate.year}
        </dd>
        <dt>{t('detail.startTime')}</dt>
        <dd>{startDate.time}</dd>
        <dt>{t('detail.duration')}</dt>
        <dd>{data.durationFormatted}</dd>
      </dl>
      {!fishbowlReady && (
        <TimeLeft className="warning text-md prewrap" block>
          <Trans i18nKey="fishbowl:accessMsg" components={{ strong: <strong /> }} />
        </TimeLeft>
      )}
      <CopyUrl className="centered" data={data} />
    </Container>
  );
};

export default FishbowlDetail;
