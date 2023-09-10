import { Fragment } from 'react';
import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { test } from '@flavorful-symphonies/shared-core';

function Users() {
  // const { data } = useQuery(test);

  return (
    <Fragment>
      <Head>
        <title>All Users</title>
        <meta name="description" content="A list of all users." />
      </Head>
      <h1>All Users</h1>
      {/* <div>{data.test}</div> */}
    </Fragment>
  );
}

export default Users;
