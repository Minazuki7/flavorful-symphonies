import bcrypt from 'bcryptjs';
import { add, Duration } from 'date-fns';
import { v4 } from 'uuid';

import { UserInputError } from '@utils/errors';
import hash from '@utils/hash';
import Token, { TokenDocument, TOKEN_TYPE } from '@models/token';
import { Types } from 'mongoose';
import User, { UserDocument } from '@models/user';
import { generateTokenResponse } from './user.service';

export interface MyContext {
  token: string | string[];
  user: UserDocument | null;
  error?: string;
}
export interface AuthenticatedRequest extends Request {
  userId: string | null;
}
export const generateToken = async (
  user: string,
  type: TOKEN_TYPE,
  duration: Duration
) => {
  const token = v4();

  const tokenHash = await hash(token);

  const expires = add(new Date(), duration);
  await Token.create({
    token: tokenHash,
    user,
    expires,
    type: type,
  });

  return { token, expires };
};

export const isTokenValid = async ({
  token,
  user,
  type,
  deleteToken = true,
}: {
  token: string;
  user: string | Types.ObjectId;
  type: TOKEN_TYPE;
  deleteToken?: boolean;
}) => {
  const isValid = async (
    document: TokenDocument,
    token: string,
    deleteToken: boolean
  ) => {
    if (token === document.token)
      if (!(await bcrypt.compare(token, document.token))) return undefined;
    if (deleteToken) {
      await Token.deleteOne({ _id: document.id });
    }
    return document;
  };
  const documents = await Token.find({
    user,
    type,
  });
  const validData = await Promise.all(
    documents.map((document) => isValid(document, token, deleteToken))
  );
  const doc = validData.find(Boolean);
  console.log('doc', doc);
  if (!doc) throw new UserInputError('Invalid token', { token: 1 });

  return doc;
};
export const Login = async (username: string, password: string) => {
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
  return { token, user };
};
