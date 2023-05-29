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
import { useEffect, useState } from 'react';
const Page = () => {
  const apiKey = 'ca8bf94864bd28192b3b9d7b3fc0e5d8b1d683ccd68edd04ba0663efb5b72d3e';
  const padName = 'newBrandPad23';
  const groupMapper = '00002';
  const name = 'Jhon';
  const [sessionId, setSessionId] = useState('');
  let authorId = null;
  let groupId = null;

  useEffect(() => {
    api
      .post(
        `https://localhost:8243/etherpad/api/1/createAuthorIfNotExistsFor?apikey=${apiKey}&name=${name}&groupMapper=${groupMapper}`
      )
      .then(res => {
        console.log('Author ID', res.data.data.authorID);
        authorId = res.data.data.authorID;
      })
      .catch(err => {
        console.log('error', err);
      });

    api
      .post(
        `https://localhost:8243/etherpad/api/1/createGroupIfNotExistsFor?apikey=${apiKey}&groupMapper=${groupMapper}`
      )
      .then(res => {
        console.log('Group ID', res.data.data.groupID);
        groupId = res.data.data.groupID;

        api
          .post(
            `https://localhost:8243/etherpad/api/1/createGroupPad?apikey=${apiKey}&groupID=${groupId}&padName=${padName}`
          )
          .then(res => {
            console.log('Portal creates a pad in the userGroup', res);
          })
          .catch(err => {
            console.log('error', err);
          });
        api
          .post(
            `https://localhost:8243/etherpad/api/1/createSession?apikey=${apiKey}&groupID=${groupId}&authorID=${authorId}&validUntil=1690195784`
          )
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
  }, []);

  return (
    <Layout center={false} title="Etherpad">
      <h1>{padName}</h1>
      <iframe
        src={`https://localhost:8243/etherpad/p/g.ZEVnp2ZLyLqh0TfD\$${padName}?&showChat=false`}
        width="600"
        height="400"
      ></iframe>
      <h1>{padName} with auth_session plugin</h1>
      <iframe
        src={`https://localhost:8243/etherpad/auth_session?sessionID=${sessionId}&padName=${padName}&showChat=false`}
        width="600"
        height="400"
      ></iframe>
      <h1>One</h1>
      <iframe
        src={`https://localhost:8243/etherpad/p/one?&showChat=false`}
        width="600"
        height="400"
      ></iframe>
      <h2>Two</h2>
      <iframe
        src={`https://localhost:8243/etherpad/p/two?showChat=false&showLineNumbers=false&showControls=false&userName=Tronco`}
        width="600"
        height="400"
      ></iframe>
    </Layout>
  );
};
export default Page;
