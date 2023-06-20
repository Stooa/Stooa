/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import useTranslation from 'next-translate/useTranslation';
import Trans from 'next-translate/Trans';

import Layout from '@/layouts/Default';
import Wysiwyg from '@/ui/Wysiwyg';

const Page = () => {
  const { t } = useTranslation('legals');

  return (
    <Layout title={t('privacyPolicy.title')}>
      <Wysiwyg>
        <h1 className="title-lg">{t('privacyPolicy.title')}</h1>
        <Trans
          i18nKey="legals:privacyPolicy.text"
          components={{
            section: <section className="section" />,
            h2: <h2 className="title-md" />,
            p: <p />,
            ul: <ul />,
            li: <li />,
            info: <a href="mailto:info@runroom.com" />,
            delete: (
              <a href="mailto:stooa@stooa.com?subject=Delete fishbowl event&amp;body=Fishbowl event url: " />
            ),
            unsub: <a href="mailto:stooa@stooa.com?subject=Delete Stooa account" />
          }}
        />
      </Wysiwyg>
    </Layout>
  );
};

export default Page;
