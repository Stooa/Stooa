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
  const apiKey = 'ca8bf94864bd28192b3b9d7b3fc0e5d8b1d683ccd68edd04ba0663efb5b72d3e';

  const getText = (padName: string): void => {
    api
      .post(`https://localhost:8243/etherpad/api/1/getText?apikey=${apiKey}&padID=g.ZEVnp2ZLyLqh0TfD\$${padName}`)
      .then(res => {
        console.log('Text', res);

        setText(res.data.data.text);
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  getText('newBrandPad2');

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
