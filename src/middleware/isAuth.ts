/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { openAccessToken } from '../utils/token.utils';

const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = openAccessToken(token);
    if (!payload) throw new Error('Token inválido');

    req.payload = payload;
    next();
  } catch (error) {
    res.sendStatus(httpStatus.FORBIDDEN);
  }
};

export default isAuth;
