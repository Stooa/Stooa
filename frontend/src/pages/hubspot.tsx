/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Layout from '@/layouts/Default';
import { GET_SELF_USER } from '@/graphql/User';
import { useQuery } from '@apollo/client';
import { getHubspotContactList } from '@/repository/HubspotContactRepository';
import { useEffect, useState } from 'react';

const Hubspot = () => {
  const hubspotUrl = `${process.env.NEXT_PUBLIC_HUBSPOT_URL}?client_id=${process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_HUBSPOT_REDIRECT_URL}&scope=crm.objects.contacts.read%20crm.objects.contacts.write`;
  const { data } = useQuery(GET_SELF_USER);
  const [contacts, setContacts] = useState([]);

  const getContacts = () => {
    getHubspotContactList()
      .then(contactList => {
        setContacts(contactList.contacts);
      })
      .catch(error => {
        console.log('[STOOA] Error getting contacts', error);
      });
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <Layout title="Hubspot">
      <h1 className="title-md form-title">Hubspot</h1>
      <b>
        {data?.selfUser.hasHubspotRefreshToken ? 'Tiene Refresh token' : 'No tiene Refresh Token'}
      </b>
      <br></br>
      <a className="body-md bold" href={hubspotUrl}>
        {data?.selfUser.hasHubspotRefreshToken ? 'Reconectar con Hubspot' : 'Conectar con Hubspot'}
      </a>
      <br></br>
     {data?.selfUser.hasHubspotRefreshToken ? 'Contactos' : 'No hay contactos'}
      {contacts?.map((contact, index) => {
        return (
          <div key={index}>
            <p>
              <b>name:</b> {contact.properties.firstname}
            </p>
            <p>
              ({contact.properties.email})
            </p>
          </div>
        );
      })}
    </Layout>
  );
};

export default Hubspot;
