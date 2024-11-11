// passportConfig.ts

import passport from 'passport';
import { createGoogleStrategy } from '../strategies/googleStrategy';
import { createAppleStrategy } from '../strategies/appleStrategy';
import { createMicrosoftStrategy } from '../strategies/microsoftStrategy';
import type { User } from '@prisma/client';
import config from './config';

export const InitPassport = () => {
  if (config.social_auth.google.enable) passport.use(createGoogleStrategy());
  if (config.social_auth.apple.enable) passport.use(createAppleStrategy());
  if (config.social_auth.microsoft.enable) { passport.use(createMicrosoftStrategy()); }

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: User, done) => {
    done(null, user);
  });
};
export default passport;
