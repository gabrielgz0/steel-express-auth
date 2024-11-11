import type { User } from '@prisma/client';
import type { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
    payload?: JwtPayload;
    cookies: {
      jid?: string;
    };
  }
}
