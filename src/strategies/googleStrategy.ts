import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { StrategyOptionsWithRequest } from 'passport-google-oauth20';
import config from '../config/config';
import { baseOAuthCallback } from './base.callback';
import type { Google } from '../types/types';

const googleCallback: Google = async (req, _, __, profile, done) => {
  const email = profile.emails?.[0]?.value;
  const displayName = profile.displayName;
  await baseOAuthCallback(req, email, displayName, done, 'google');
};

export const createGoogleStrategy = () => {
  const options: StrategyOptionsWithRequest = {
    clientID: config.social_auth.google.client_id,
    clientSecret: config.social_auth.google.client_secret,
    callbackURL: `${config.server.url}/api/v1/auth/microsoft/callback`,
    passReqToCallback: true
  };

  return new GoogleStrategy(options, googleCallback);
};
