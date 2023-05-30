/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import Layout from '@/layouts/Default';

import api from '@/lib/api';
import { useState } from 'react';
const EtherPadPage = () => {
  const [text, setText] = useState('');
  const apiKey = '915f49ff98a8df4519e89ff8075fc29aa466e4783968b0c2326fcd087b0af002';

  const getText = (padName: string): void => {
    api
      .post(`https://localhost:8243/etherpad/api/1/getText?apikey=${apiKey}&padID=${padName}`)
      .then(res => {
        console.log('Text', res);

        setText(res.data.data.text);
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  getText('NUEVO_PAD');

  if (text !== '') {
    return (
      <Layout center={false} title="Etherpad">
        <h1>Pad One</h1>
        <p>{text}</p>
      </Layout>
    );
  } else {
    return (
      <Layout center={false} title="Etherpad">
        No text in the pad
      </Layout>
    );
  }
};
export default EtherPadPage;
