import type { Request } from 'express';
import config from '../config/config';
import { baseOAuthCallback } from './base.callback';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import type { MicrosoftStrategyOptionsWithRequest } from 'passport-microsoft';
import type { VerifyCallback } from 'passport-oauth2';

const microsoftCallback = async (
  req: Request,
  _: string | undefined,
  __: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any,
  done: VerifyCallback
) => {
  const email = profile.emails?.[0]?.value;
  const displayName = profile.displayName;
  await baseOAuthCallback(req, email, displayName, done, 'microsoft');
};

export const createMicrosoftStrategy = () => {
  const options: MicrosoftStrategyOptionsWithRequest = {
    clientID: config.social_auth.microsoft.client_id,
    clientSecret: config.social_auth.microsoft.client_secret,
    callbackURL: `${config.server.url}/api/v1/auth/microsoft/callback`,
    passReqToCallback: true
  };

  return new MicrosoftStrategy(options, microsoftCallback);
};
