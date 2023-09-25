import bcrypt from 'bcryptjs';
import { add, Duration } from 'date-fns';
import { v4 } from 'uuid';

import { UserInputError } from '@utils/errors';
import hash from '@utils/hash';
import Token, { TokenDocument, TOKEN_TYPE } from '@models/token';
import { Types } from 'mongoose';
import { UserDocument } from '@models/user';

export interface MyContext {
  token: string | string[];
  user: UserDocument | null;
  error?: string;
}
export interface AuthenticatedRequest extends Request {
  userId: string | null;
}
export async function generateToken(
  user: string,
  type: TOKEN_TYPE,
  duration: Duration
) {
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
}

export async function isTokenValid({
  token,
  user,
  type,
  deleteToken = true,
}: {
  token: string;
  user: string | Types.ObjectId;
  type: TOKEN_TYPE;
  deleteToken?: boolean;
}) {
  async function isValid(
    document: TokenDocument,
    token: string,
    deleteToken: boolean
  ) {
    // INTRO NEED TO BE PURE TOKEN

    if (token === document.token)
      if (!(await bcrypt.compare(token, document.token))) return undefined;
    if (deleteToken) {
      await Token.deleteOne({ _id: document.id });
    }
    return document;
  }
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
}
