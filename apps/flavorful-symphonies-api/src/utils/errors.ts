import { GraphQLError } from 'graphql';

import { ApolloServerErrorCode } from '@apollo/server/errors';

export class UserInputError extends GraphQLError {
  constructor(message: string, extensions: Record<string, any> = {}) {
    super(message, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT, ...extensions },
    });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string, extensions: Record<string, any> = {}) {
    super(message, { extensions: { code: 'UNAUTHENTICATED', ...extensions } });
  }
}
