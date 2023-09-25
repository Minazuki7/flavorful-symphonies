import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import { jwtConfig } from './jwt.config';
import User, { UserDocument } from '@models/user';

const jwtOptions = {
  secretOrKey: jwtConfig.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  expiresIn: jwtConfig.expiresIn,
};

const jwt = async (
  payload: { sub: string },
  done: (e: Error | null, user: UserDocument | boolean) => void
) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

export default {
  jwt: new JwtStrategy(jwtOptions, jwt),
};
