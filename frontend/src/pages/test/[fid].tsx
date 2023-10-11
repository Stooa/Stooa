/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { GET_FISHBOWL } from '@/graphql/Fishbowl';
import { createApolloClient } from '@/lib/apollo-client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

const Page = ({ fid }: { fid: string }) => {
  return (
    <>
      <Head>
        <title>{fid}</title>
      </Head>
      <h1>Amazing website</h1>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const fid = params ? params.fid : '';
  const apolloClient = createApolloClient();
  const { data } = await apolloClient.query({
    query: GET_FISHBOWL,
    variables: { slug: fid as string }
  });

  const SEOTitle = "Jordi sala's fishbowl - " + params.fid;

  console.log(data);

  // const { bySlugQueryFishbowl: fishbowl } = data;
  return {
    props: { fid: SEOTitle }
  };
};

export default Page;
