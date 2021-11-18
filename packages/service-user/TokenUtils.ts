import * as jwt from 'jsonwebtoken';
import { object, string } from 'yup';

import { env } from './env';
import { User } from './UserTypes';

interface TokenPayload {
  userId: string;
}

const validateUserAccountBasedToken = async (tokenPayload: TokenPayload) => {
  return object<{ userId: string }>()
    .shape({ userId: string().required() })
    .validate(tokenPayload);
};

export const createAccessToken = (user: User): string =>
  jwt.sign({ userId: user.id }, env.secrets.accessToken);

const verifyToken = (secret: string) => async (token: string) => {
  try {
    const tokenPayload = jwt.verify(token, secret) as TokenPayload;
    await validateUserAccountBasedToken(tokenPayload);

    return { tokenPayload, error: null };
  } catch (error) {
    return { tokenPayload: null, error: error.message };
  }
};

export const verifyAccessToken = verifyToken(env.secrets.accessToken);
