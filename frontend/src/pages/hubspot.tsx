/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Layout from '@/layouts/Default';
import useTranslation from 'next-translate/useTranslation';
const Hubspot = () => {
  const hubspotUrl = `${process.env.NEXT_PUBLIC_HUBSPOT_URL}?client_id=${process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_HUBSPOT_REDIRECT_URL}&scope=crm.objects.contacts.read%20crm.objects.contacts.write`;
  const { t } = useTranslation('common');

  return (
    <Layout title="Hubspot">
      <h1 className="title-md form-title">Hubspot</h1>
      <a className="body-md bold" href={hubspotUrl}>
        Conectar con Hubspot
      </a>
    </Layout>
  );
};

export default Hubspot;
