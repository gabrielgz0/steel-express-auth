import passport from '../config/passportConfig';
import type { ExpressMiddleware } from 'src/types/types';

const handleOAuthSignUp = (
  provider: string,
  scope: string[]
): ExpressMiddleware => {
  return (req, res, next) => {
    passport.authenticate(provider, {
      scope,
      session: false
    })(req, res, next);
  };
};

export const handleGoogleSignUp = handleOAuthSignUp('google', [
  'profile',
  'email'
]);

export const handleAppleSignUp = handleOAuthSignUp('apple', ['email']);

export const handleMicrosoftSignUp = handleOAuthSignUp('microsoft', [
  'user.read'
]);
