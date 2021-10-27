/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import { ROUTE_FISHBOWL_CREATE, ROUTE_HOME } from 'app.config';
import Layout from 'layouts/Default';
import Button from 'ui/Button';
import ArrowRight from 'ui/svg/arrow-right.svg';
import NotFoundImg from 'ui/svg/not-found.svg';
import NotFoundStyled from 'ui/pages/not-found';

const Page404 = () => {
  const { t } = useTranslation('_error');

  return (
    <Layout title={t('404.pageTitle')} decorated>
      <NotFoundStyled>
        <NotFoundImg className="not-found-img" />
        <h1>
          <p className="title-md">{t('404.pageTitle')}</p>
          <p className="text-lg medium">{t('404.title')}</p>
        </h1>
        <p>{t('404.text')}</p>
        <div className="ctas">
          <Link href={ROUTE_FISHBOWL_CREATE} passHref>
            <Button as="a">
              <span>{t('home:cta')}</span>
              <ArrowRight />
            </Button>
          </Link>
          <Link href={ROUTE_HOME} passHref>
            <Button className="secondary" as="a">
              <span>{t('common:goHome')}</span>
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </NotFoundStyled>
    </Layout>
  );
};

export default Page404;
