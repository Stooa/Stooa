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
  const apiKey = '28e6d2212949a602fde3822bb1469ede30583212ce3cf5e65658ff2b1674d540';
  const padName = 'newPad2';
  useEffect(() => {
    api
      .post(`https://localhost:8243/etherpad/api/1/createPad?apikey=${apiKey}&padID=${padName}`)
      .then(res => {
        console.log('Portal creates a pad in the userGroup', res);
      })
      .catch(err => {
        console.log('error', err);
      });
  }, []);

  return (
    <Layout center={false} title="Etherpad">
      <h1>{padName}</h1>
      <iframe
        src={`https://localhost:8243/etherpad/p/${padName}?showChat=false&showLineNumbers=false`}
        width="600"
        height="400"
      ></iframe>
    </Layout>
  );
};
export default Page;
