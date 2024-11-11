import config from '../config/config';
import { baseOAuthCallback } from './base.callback';
import AppleStrategy from 'passport-apple';
import type {
  AuthenticateOptionsWithRequest,
  VerifyFunctionWithRequest
} from 'passport-apple';

// not tested, because i don't have 100 dollars

const appleCallback: VerifyFunctionWithRequest = async (
  req,
  _,
  __,
  _idToken,
  profile,
  done
) => {
  // eslint-disable-next-line @typescript-eslint/dot-notation
  const email = profile['email'];
  // eslint-disable-next-line @typescript-eslint/dot-notation
  const displayName = profile['displayName'];
  await baseOAuthCallback(req, email, displayName, done, 'apple');
};

export const createAppleStrategy = () => {
  const options: AuthenticateOptionsWithRequest = {
    clientID: config.social_auth.apple.clientID,
    teamID: config.social_auth.apple.teamID,
    keyID: config.social_auth.apple.keyID,
    privateKeyString: config.social_auth.apple.privateKey,
    passReqToCallback: true
  };
  return new AppleStrategy(options, appleCallback);
};
