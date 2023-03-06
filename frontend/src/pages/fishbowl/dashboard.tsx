/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import FishbowlList from '@/user/FishbowlList';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';

const Layout = dynamic(import('@/layouts/Default'), { loading: () => <div /> });

const Dashboard = () => {
  const router = useRouter();
  const { selected } = router.query;

  return (
    <Layout>
      <FishbowlList finished selectedFishbowlParam={selected as string} />
      <ToastContainer className="toastify-custom" />
    </Layout>
  );
};

export default Dashboard;
