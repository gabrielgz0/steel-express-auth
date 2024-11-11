import prismaClient from '../config/prisma';
import type { Request } from 'express';
import type { VerifyCallback as DoneApple } from 'passport-apple';
import type { VerifyCallback as DoneGoogle } from 'passport-google-oauth20';

export const baseOAuthCallback = async (
  _req: Request, // dps eu arrumo
  email: string | undefined,
  displayName: string,
  done: DoneGoogle | DoneApple,
  provider: string
) => {
  try {
    if (!email) {
      done(new Error('An error occurred!'));
      return;
    }

    let user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      // if the user does not exist in db, create one
      user = await prismaClient.user.create({
        data: {
          name: displayName,
          email,
          password: '',
          emailVerified: new Date(),
          provider,
          createdAt: new Date()
        }
      });

      // the callback dones here
      done(null, user);
      return;
    }

    done(null, user);
    return;
  } catch (err) {
    done(new Error('An error occurred!'));
  }
};
