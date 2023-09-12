// /* eslint-disable no-console */
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Operation,
  createHttpLink,
  HttpLink,
} from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { onError } from '@apollo/client/link/error';
import { logger } from '@flavorful-symphonies/shared-core';
import { Observable } from 'zen-observable-ts';
import { apiUrl } from '../utils/vars';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

let token = '';
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
loadErrorMessages(), loadDevMessages();
export function setAuthorizationBearer(nextToken: string) {
  token = nextToken;
}

const request = async (operation: Operation) => {
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: ZenObservable.Subscription | undefined;
      Promise.resolve(operation)
        .then((oper) => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));
      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

export const client = new ApolloClient({
  link: ApolloLink.from([
    requestLink,
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
          logger.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
      if (networkError) logger.error(`[Network error]: ${networkError}`);
    }),
    createHttpLink({
      uri: apiUrl || 'http://localhost:3333/graphql',
    }),
  ]),
  cache: new InMemoryCache(),
});
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // this needs to be an absolute url, as relative urls cannot be used in SSR
      uri: apiUrl || 'http://localhost:3333/graphql',
      // you can disable result caching here if you want to
      // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
      // fetchOptions: { cache: "no-store" },
    }),
  });
});
