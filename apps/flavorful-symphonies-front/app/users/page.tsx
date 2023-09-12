import { Fragment } from 'react';
import Head from 'next/head';
import {
  useQuery,
  useSuspenseQuery,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { test } from '@flavorful-symphonies/shared-core';
import { getClient } from '../utlis/apollo';

async function Users({}: any) {
  const { data } = await getClient().query({ query: test });

  console.log(data);
  console.log('kk', data);
  return (
    <Fragment>
      <Head>
        <title>All Users</title>
        <meta name="description" content="A list of all users." />
      </Head>
      <h1>All Users</h1>
      <div className="bg-white">{data?.test}</div>
    </Fragment>
  );
}

export default Users;
