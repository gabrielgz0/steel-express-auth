import type { RequestHandler } from 'express';
import { Router } from 'express';
import * as passportController from '../../controller/passport.controller';
import passport from 'passport';
import {
  handleAppleSignUp,
  handleGoogleSignUp,
  handleMicrosoftSignUp
} from '../../middleware/passport.middleware';

import config from '../../config/config';
import type { ExpressMiddleware } from 'src/types/types';

const passportRouter = Router();

const addAuthRoutes = (
  router: Router,
  provider: string,
  handleSignUp: ExpressMiddleware,
  handleCallback: RequestHandler
) => {
  router.get(`/${provider}`, handleSignUp);

  router.get(
    `/${provider}/callback`,
    passport.authenticate(provider, {
      failureRedirect: '/login',
      session: false
    }),
    handleCallback
  );
};

if (config.social_auth.google.enable) {
  addAuthRoutes(
    passportRouter,
    'google',
    handleGoogleSignUp,
    passportController.handlePassportCallback
  );
}

if (config.social_auth.apple.enable) {
  addAuthRoutes(
    passportRouter,
    'apple',
    handleAppleSignUp,
    passportController.handlePassportCallback
  );
}

if (config.social_auth.microsoft.enable) {
  addAuthRoutes(
    passportRouter,
    'microsoft',
    handleMicrosoftSignUp,
    passportController.handlePassportCallback
  );
}

export { passportRouter };
