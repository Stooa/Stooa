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
import Trans from 'next-translate/Trans';

import { CONTACT_EMAIL } from 'app.config';

interface IProps {
  statusCode?: number;
}

const ErrorPage = ({ statusCode }: IProps) => {
  const { t } = useTranslation('_error');

  return (
    <>
      <Head>
        <title>{t('pageTitle')}</title> XXX
      </Head>
      <h1>
        {t('title')}
        {statusCode ? `: ${statusCode}` : ''}
      </h1>
      <p>
        <Trans
          i18nKey="_error:description"
          components={{
            a: <a href={`mailto:${CONTACT_EMAIL}`} />
          }}
        />
      </p>
    </>
  );
};

export default ErrorPage;
