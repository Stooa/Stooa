/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

interface ParticipantKickedPageProps {
  reason?: string;
}

const ParticipantKickedPage = ({ reason }: ParticipantKickedPageProps) => {
  const { t } = useTranslation('participant-kicked');

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title> XXX
      </Head>
      <h1>{t('title')}</h1>
    </>
  );
};

export default ParticipantKickedPage;
