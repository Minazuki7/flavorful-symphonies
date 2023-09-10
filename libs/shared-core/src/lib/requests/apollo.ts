/* eslint-disable no-console */
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Operation,
  createHttpLink,
} from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { onError } from '@apollo/client/link/error';
import log from './log';
import { Observable } from 'zen-observable-ts';
import { apiUrl } from '../utlis/vars';

let token = '';

export function setAuthorizationBearer(nextToken: string) {
  token = nextToken;
}
loadErrorMessages(), loadDevMessages();
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
          log.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
      if (networkError) log.error(`[Network error]: ${networkError}`);
    }),
    createHttpLink({
      uri: apiUrl || 'http://localhost:3333/graphql',
    }),
  ]),
  cache: new InMemoryCache(),
});
