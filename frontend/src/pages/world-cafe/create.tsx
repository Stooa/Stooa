/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import WorldCafeForm from '@/components/Web/Forms/WorldCafeForm/WorldCafeForm';
import Layout from '@/layouts/Default';

const WorldcafeCreate = () => {
  return (
    <Layout title={'Create a world Cafe'}>
      <h1 className="title-md form-title">WORLD CAFE CREATION</h1>
      <WorldCafeForm />
    </Layout>
  );
};

export default WorldcafeCreate;
