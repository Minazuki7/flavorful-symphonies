import User, { UserDocument } from '@models/user';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '@config/jwt.config';
import { createMethodDecorator } from 'type-graphql';
import { MyContext } from '@graphQl/services/auth.service';

type DoneCallback = (error: Error | null, user?: UserDocument | false) => void;
interface AuthenticatedRequest extends Request {
  logIn: (
    user: UserDocument,
    options?: passport.AuthenticateOptions,
    done?: DoneCallback
  ) => void;

  user: UserDocument;
}
function handleJWT(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  return async (_err: string, user: UserDocument) => {
    try {
      req.logIn(user, { session: false }, async () => {
        req.user = user;
        next();
      });
    } catch (e) {
      next();
    }
  };
}

export default function authorize(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  return passport.authenticate(
    'jwt',
    { session: false },
    handleJWT(req, res, next)
  )(req, res, next);
}

// Function to decode a JWT token and obtain user information
export const decodeToken = async (token) => {
  if (!token) return null;
  try {
    // Replace 'your-secret-key' with your actual JWT secret key
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Assuming your token includes user ID as 'userId'
    const userId = decoded.sub;

    // Here, you can fetch user information from your database based on the user ID
    // Replace this with your actual database query logic
    const user = await User.findById(userId);

    return user;
  } catch (error) {
    // If the token is invalid or expired, you can handle the error here
    console.error('Error decoding token:', error);
    return null; // Return null or handle the error as needed
  }
};
export function Authorized(roles: string | string[]) {
  return createMethodDecorator<MyContext>(async ({ context }, next) => {
    const user = context.user; // Access the authenticated user from context

    if (!user) {
      throw new Error('Unauthorized'); // Handle unauthenticated requests
    }

    // Check if the user has the required role(s)
    const userRoles = user.roles || []; // Assuming roles are stored in the user object

    if (typeof roles === 'string' && !userRoles.includes(roles)) {
      throw new Error('Access denied'); // User doesn't have the required role
    }

    if (
      Array.isArray(roles) &&
      !roles.some((role) => userRoles.includes(role))
    ) {
      throw new Error('Access denied'); // User doesn't have any of the required roles
    }

    return next();
  });
}
