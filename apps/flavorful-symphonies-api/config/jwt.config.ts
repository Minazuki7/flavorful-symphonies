import { accessSecret, jwt_expiration } from './vars';
export const jwtConfig = {
  secret: accessSecret,
  expiresIn: jwt_expiration,
};
