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
const Page = () => {
  const [sessionId, setSessionId] = useState('');
  const apiKey= '0d7b26f659fced90cbdb6b8ab51748b4c86970302a33b9bc371b10215fca9bd6';
  const padName = 'test1234';
  const groupMapper = '999';
  let authorId = null;
  let groupId = null;

  // Portal maps the internal userid to an etherpad author.
  api
    .post(`https://localhost:8243/etherpad/api/1/createAuthorIfNotExistsFor?apikey=${apiKey}&name=Michael&groupMapper=${groupMapper}`)
    .then(res => {
      console.log('Author ID', res.data.data.authorID);
      authorId = res.data.data.authorID;
    })
    .catch(err => {
      console.log('error', err);
    });

  // Portal maps the internal userid to an etherpad group:
  api
    .post(`https://localhost:8243/etherpad/api/1/createGroupIfNotExistsFor?apikey=${apiKey}&groupMapper=${groupMapper}`)
    .then(res => {
      console.log('Group ID', res.data.data.groupID);
      groupId = res.data.data.groupID;

      api
        .post(`https://localhost:8243/etherpad/api/1/createGroupPad?apikey=${apiKey}&groupID=${groupId}&padName=${padName}&text=Hello`)
        .then(res => {
          console.log('Portal creates a pad in the userGroup', res);
        })
        .catch(err => {
          console.log('error', err);
        });
      // Portal starts the session for the user on the group:
      api
        .post(`https://localhost:8243/etherpad/api/1/createSession?apikey=${apiKey}&groupID=${groupId}&authorID=${authorId}&validUntil=1690195784` )
        .then(res => {
          console.log('Session ID', res.data.data.sessionID);
          setSessionId(res.data.data.sessionID);
        })
        .catch(err => {
          console.log('error', err);
        });

    })
    .catch(err => {
      console.log('error', err);
    });

  if (sessionId !== '') {
    return (
      <Layout center={false} title="Etherpad">
        <iframe src={`https://localhost:8243/etherpad/auth_session?sessionID=${sessionId}&padName=${padName}`} width="600" height="400"></iframe>
        <iframe src={`https://localhost:8243/etherpad/p/one`} width="600" height="400"></iframe>
        <iframe
          src={`https://localhost:8243/etherpad/p/two?showChat=false&showLineNumbers=false&showControls=false&userName=Tronco`}
          width="600" height="400"></iframe>
      </Layout>
    );
  } else {
    return (
      <Layout center={false} title="Etherpad">
        Can't print iframe
      </Layout>
    );
  }
};
export default Page;
