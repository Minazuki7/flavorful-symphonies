import { Resolver, Query, Arg, Mutation, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { TOKEN_TYPE } from '@models/token';
import { isTokenValid, MyContext } from '@graphQl/services/auth.service';
import User from '@models/user';
import { UserInputError } from '@utils/errors';
import { AuthType } from '@graphQl/types';
import { generateTokenResponse } from '@graphQl/services/user.service';

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
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user?.password || !(await bcrypt.compare(password, user.password))) {
      throw new UserInputError('LOGIN.INCORRECT');
    }

    if (user && !user?.isActive) {
      throw new UserInputError('LOGIN.BLOCKED');
    }

    const token = await generateTokenResponse(user?.id);
    return { token };
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
