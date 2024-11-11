/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { openAccessToken } from '../utils/token.utils';

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  // token looks like 'Bearer vnjaknvijdaknvikbnvreiudfnvriengviewjkdsbnvierj'

  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  const token: string | undefined = authHeader.split(' ')[1];

  if (!token) return res.sendStatus(httpStatus.UNAUTHORIZED);

  const payload = openAccessToken(token);

  if (!payload) return res.sendStatus(httpStatus.FORBIDDEN);

  req.payload = payload;

  next();
};

export default isAuth;
