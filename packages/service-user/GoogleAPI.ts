import { env } from './env';

export const getGoogleProfile = async (idToken: string) => {
  const { OAuth2Client } = await import('google-auth-library');
  const client = new OAuth2Client(env.services.google.clientId);

  const ticket = await client.verifyIdToken({
    audience: env.services.google.clientId,
    idToken,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error('Invalid id_token');
  }

  return payload;
};
