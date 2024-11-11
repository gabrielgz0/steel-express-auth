import type { Request, Response } from 'express';
import config from '../config/config';
import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig
} from '../config/cookieConfig';
import httpStatus from 'http-status';
import {
  createAccessToken,
  createRefreshToken,
  popToken
} from '../utils/token.utils';
import prismaClient from '../config/prisma';

export const handlePassportCallback = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);

  // get an delete token
  if (await popToken(req.cookies[config.jwt.refresh_token.cookie_name])) {
    res.clearCookie(
      config.jwt.refresh_token.cookie_name,
      clearRefreshTokenCookieConfig
    );
  }

  const refreshToken = createRefreshToken(user.id);
  const accessToken = createAccessToken(user.id);

  await prismaClient.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id
    }
  });

  res.cookie(
    config.jwt.refresh_token.cookie_name,
    refreshToken,
    refreshTokenCookieConfig
  );

  res.json({ accessToken });
};
