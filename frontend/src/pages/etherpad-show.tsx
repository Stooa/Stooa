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
import {useState} from "react";
const EtherPadPage = () => {
  const [text, setText] = useState('');
  const apiKey= 'b6e337ae0340f150f97668a4bd7de2add4bcfb63cc123efeba1b9b5824116f45';

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
  }

  getText('one');

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
