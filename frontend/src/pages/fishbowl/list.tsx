/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import FishbowlList from '@/components/App/FishbowlList';
import dynamic from 'next/dynamic';

const Layout = dynamic(import('@/layouts/Default'), { loading: () => <div /> });

const List = () => {
  return (
    <Layout>
      <FishbowlList />
    </Layout>
  );
};

export default List;
