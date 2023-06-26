/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const Layout = dynamic(import('@/layouts/App'), { loading: () => <div /> });

const Page = () => {
  const router = useRouter();
  const { wid } = router.query;

  return (
    <Layout>
      <h1>{wid}</h1>
    </Layout>
  );
};

export default Page;
