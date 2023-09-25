/* eslint-disable no-empty-pattern */
// IN CLIENT RENDRING USE CLIENT / useQUERY / NO ASYN
// IN SERVER await + async  + no use client
'use client';
import { Fragment } from 'react';
import Head from 'next/head';
import {
  useQuery,
  useSuspenseQuery,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { test } from '@flavorful-symphonies/shared-core';
import { client, getClient } from '../utils/apollo';

function Users({}: any) {
  //const { data } = await getClient().query({ query: test });
  const { data } = useSuspenseQuery<any>(test);

  return (
    <Fragment>
      <Head>
        <title>All Uszzers</title>
        <meta name="description" content="A list of all users." />
      </Head>
      <h1>All Users</h1>
      <div className="bg-purple-500 text-white">{data.test}</div>
    </Fragment>
  );
}

export default Users;
