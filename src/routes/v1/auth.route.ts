import { Router } from 'express';
import validate from '../../middleware/validate';
import { loginSchema, signupSchema } from '../../validations/auth.validation';
import * as authController from '../../controller/auth.controller';
import { resolveTokenIntegrity } from '../../middleware/resolveTokenIntegrity';

const authRouter = Router();

authRouter.post('/signup', validate(signupSchema), authController.handleSignUp);

authRouter.post('/login', validate(loginSchema), authController.handleLogin);

authRouter.post('/logout', authController.handleLogout);

authRouter.post(
  '/refresh',
  resolveTokenIntegrity,
  authController.handleRefresh
);

export default authRouter;
