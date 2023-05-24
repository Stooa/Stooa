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
import Settings from "lib-jitsi-meet/types/hand-crafted/modules/settings/Settings";
import sessionId = Settings.sessionId;
import {useState} from "react";
const Page = () => {
  const [sessionId, setSessionId] = useState('');
  let authorId = null;
  let groupId = null;

  // Portal maps the internal userid to an etherpad author.
  api
    .post('https://localhost:8243/etherpad/api/1/createAuthorIfNotExistsFor?apikey=36760b9f0e63a69ceea4ec5ae44868afd35e1053f8c5e44110125a35ad7f7920&name=Michael&groupMapper=7' )
    .then(res => {
      console.log('Author ID', res.data.data.authorID);
      authorId = res.data.data.authorID;
    })
    .catch(err => {
      console.log('error', err);
    });

  // Portal maps the internal userid to an etherpad group:
  api
    .post('https://localhost:8243/etherpad/api/1/createGroupIfNotExistsFor?apikey=36760b9f0e63a69ceea4ec5ae44868afd35e1053f8c5e44110125a35ad7f7920&groupMapper=7' )
    .then(res => {
      console.log('Group ID', res.data.data.groupID);
      groupId = res.data.data.groupID;

      api
        .post(`https://localhost:8243/etherpad/api/1/createGroupPad?apikey=36760b9f0e63a69ceea4ec5ae44868afd35e1053f8c5e44110125a35ad7f7920&groupID=${groupId}&padName=test123&text=Hello` )
        .then(res => {
          console.log('Portal creates a pad in the userGroup', res);
        })
        .catch(err => {
          console.log('error', err);
        });
      // Portal starts the session for the user on the group:
      api
        .post(`https://localhost:8243/etherpad/api/1/createSession?apikey=36760b9f0e63a69ceea4ec5ae44868afd35e1053f8c5e44110125a35ad7f7920&groupID=${groupId}&authorID=${authorId}&validUntil=1690195784` )
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
        <iframe src={`https://localhost:8243/etherpad/auth_session?sessionID=${sessionId}&padName=test123`} width="600" height="400"></iframe>
        <iframe src={`https://localhost:8243/etherpad/p/lolololololo`} width="600" height="400"></iframe>
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
