import { add } from 'date-fns';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { jwtConfig } from '@config/jwt.config';
import { generateToken } from './auth.service';
import { TOKEN_TYPE } from '@models/token';
import { CreateUserInputType } from '@graphQl/types';
import User, { UserDocument } from '@models/user';

export async function generateUserToken(
  user: string
): Promise<{ token: string; expiresIn: string }> {
  return new Promise((resolve, reject) => {
    const payload = {
      sub: user,
    };
    const expiresIn = add(new Date(), { minutes: jwtConfig.expiresIn });

    jwt.sign(
      payload,
      jwtConfig.secret,
      {
        expiresIn: `${jwtConfig.expiresIn}m`,
      },
      (error, token) => {
        if (error || !token) {
          reject('Unable to generate token');
        } else {
          resolve({ token, expiresIn: expiresIn.toISOString() });
        }
      }
    );
  });
}

export async function generateTokenResponse(userId: string) {
  const tokenType = 'Bearer';
  const user = await User.findById(userId);

  const { token: accessToken, expiresIn } = await generateUserToken(userId);
  const { token: refreshToken } = await generateToken(
    userId,
    TOKEN_TYPE.REFRESH,
    {
      days: 2,
    }
  );
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
    user,
  };
}
export async function createUser(
  createUserInput: CreateUserInputType
): Promise<UserDocument> {
  const { password: plainPassword } = createUserInput;
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS));
  const password = await bcrypt.hash(plainPassword, salt);

  const createdUser = await User.create({ ...createUserInput, password });

  return createdUser.save();
}
