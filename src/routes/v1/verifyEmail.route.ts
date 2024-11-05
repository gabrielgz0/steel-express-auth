import { Router } from 'express';
import validate from '../../middleware/validate';
import {
  sendVerifyEmailSchema,
  verifyEmailSchema
} from '../../validations/verifyEmail.validation';
import * as emailController from '../../controller/verifyEmail.controller';

const verifyEmailRouter = Router();

verifyEmailRouter.post(
  '/send-verification-email',
  validate(sendVerifyEmailSchema),
  emailController.sendVerificationEmail
);

verifyEmailRouter.get(
  '/verify-email/:token',
  validate(verifyEmailSchema),
  emailController.handleVerifyEmail
);

export default verifyEmailRouter;
