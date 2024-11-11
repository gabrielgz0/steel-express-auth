// resolveTokenIntegrity.ts

import { openRefreshToken, popToken } from '../utils/token.utils';
import type { NextFunction, Request, Response } from 'express';
import config from '../config/config';
import httpStatus from 'http-status';
import { clearRefreshTokenCookieConfig } from '../config/cookieConfig';

export const resolveTokenIntegrity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken: string | undefined =
    req.cookies[config.jwt.refresh_token.cookie_name];

  if (!refreshToken) return res.sendStatus(httpStatus.UNAUTHORIZED);

  res.clearCookie(
    config.jwt.refresh_token.cookie_name,
    clearRefreshTokenCookieConfig
  );

  const getRefreshToken = await popToken(refreshToken);

  if (!getRefreshToken) return res.sendStatus(httpStatus.FORBIDDEN);

  const payloadRefreshToken = openRefreshToken(refreshToken);

  if (!payloadRefreshToken) return res.sendStatus(httpStatus.FORBIDDEN);

  console.log(payloadRefreshToken);
  req.payload = payloadRefreshToken;
  // is valid
  next();
};
