import { Resolver, Query, Arg, Mutation, Ctx } from 'type-graphql';

import { TOKEN_TYPE } from '@models/token';
import { isTokenValid, Login, MyContext } from '@graphQl/services/auth.service';
import { AuthType } from '@graphQl/types';

@Resolver()
class AuthResolver {
  @Query(() => Boolean)
  async isValidToken(
    @Arg('userId') user: string,
    @Arg('token') token: string,
    @Arg('tokenType', () => TOKEN_TYPE) tokenType: TOKEN_TYPE
  ) {
    const tokenValidation = await isTokenValid({
      token,
      user,
      type: tokenType,
      deleteToken: false,
    });
    if (!tokenValidation) {
      throw new Error('InvalidToken');
    }
    return true;
  }
  @Mutation(() => AuthType)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string
  ) {
    return await Login(username, password);
  }

  @Mutation(() => String)
  async logout(
    @Arg('refreshToken') refreshToken: string,
    @Ctx() ctx: MyContext
  ) {
    const { user } = ctx;

    await isTokenValid({
      token: refreshToken,
      type: TOKEN_TYPE.REFRESH,
      user: user.id,
    });

    return 'done';
  }
}

export default AuthResolver;
