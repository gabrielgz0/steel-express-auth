import jwt from 'jsonwebtoken';
import config from '../config/config';
import prismaClient from '../config/prisma';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { verify } = jwt;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { sign } = jwt;

/**
 * This functions generates a valid access token
 *
 * @param {number | string} userId - The user id of the user that owns this jwt
 * @returns Returns a valid access token
 */
export const createAccessToken = (userId: number | string): string => {
  return sign({ userId }, config.jwt.access_token.secret, {
    expiresIn: config.jwt.access_token.expire
  });
};

/**
 * This functions generates a valid refresh token
 *
 * @param {number | string} userId - The user id of the user that owns this jwt
 * @returns Returns a valid refresh token
 */
export const createRefreshToken = (userId: number | string): string => {
  return sign({ userId }, config.jwt.refresh_token.secret, {
    expiresIn: config.jwt.refresh_token.expire
  });
};

/**
 * Get refresh token and delete him
 *
 * @returns token | null
 */
export const popToken = async (token: string) => {
  return await prismaClient.refreshToken
    .delete({ where: { token } })
    .catch(() => null);
};

/**
 * Add refresh token to db
 *
 * @returns token | null
 */
export const addToken = async (token: string, userId: string) => {
  return await prismaClient.refreshToken
    .create({ data: { token, userId } })
    .catch(() => null);
};

/**
 * Open refresh token and extract payload.
 *
 * @param token - RefreshToken object or null.
 * @returns JwtPayload - if the token is valid, or null if invalid/expired.
 */
export const openRefreshToken = (token: string | null) => {
  return openToken(token, config.jwt.refresh_token.secret);
};

/**
 * Open access token and extract payload.
 *
 * @param token - RefreshToken object or null.
 * @returns The payload if the token is valid, or null if invalid/expired.
 */
export const openAccessToken = (token: string | null) => {
  return openToken(token, config.jwt.access_token.secret);
};

export const openToken = (token: string | null, secret: string) => {
  try {
    return verify(token, secret);
  } catch (err) {
    return null;
  }
};
