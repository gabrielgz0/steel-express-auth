import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { randomUUID } from 'crypto';
import * as argon2 from 'argon2';
import prismaClient from '../config/prisma';
import type {
  TypedRequest,
  UserLoginCredentials,
  UserSignUpCredentials
} from '../types/types';
import {
  addToken,
  createAccessToken,
  createRefreshToken,
  popToken
} from '../utils/token.utils';
import config from '../config/config';

import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig
} from '../config/cookieConfig';

import { sendVerifyEmail } from '../utils/sendEmail.util';
import { verifyPassword } from '../utils/verifyPassword.util';

/**
 * This function handles the signup process for new users. It expects a request object with the following properties:
 *
 * @param {TypedRequest<UserSignUpCredentials>} req - The request object that includes user's username, email, and password.
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 400 BAD REQUEST status code and an error message if the request body is missing any required parameters.
 *   - A 409 CONFLICT status code if the user email already exists in the database.
 *   - A 201 CREATED status code and a success message if the new user is successfully created and a verification email is sent.
 *   - A 500 INTERNAL SERVER ERROR status code if there is an error in the server.
 */
export const handleSignUp = async (
  req: TypedRequest<UserSignUpCredentials>,
  res: Response
) => {
  const { username, email, password } = req.body;

  // check req.body values
  if (!username || !email || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Username, email and password are required!'
    });
  }

  const checkUserEmail = await prismaClient.user.findUnique({
    where: {
      email
    }
  });

  if (checkUserEmail) return res.sendStatus(httpStatus.CONFLICT); // email is already in db

  try {
    const hashedPassword = await argon2.hash(password);

    const newUser = await prismaClient.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword
      }
    });

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    await prismaClient.emailVerificationToken.create({
      data: {
        token,
        expiresAt,
        userId: newUser.id
      }
    });

    // Send an email with the verification link
    sendVerifyEmail(email, token);

    res.status(httpStatus.CREATED).json({ message: 'New user created' });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * This function handles the login process for users. It expects a request object with the following properties:
 *
 * @param {TypedRequest<UserLoginCredentials>} req - The request object that includes user's email and password.
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 400 BAD REQUEST status code and an error message if the request body is missing any required parameters.
 *   - A 401 UNAUTHORIZED status code if the user email does not exist in the database or the email is not verified or the password is incorrect.
 *   - A 200 OK status code and an access token if the login is successful and a new refresh token is stored in the database and a new refresh token cookie is set.
 *   - A 500 INTERNAL SERVER ERROR status code if there is an error in the server.
 */
export const handleLogin = async (
  req: TypedRequest<UserLoginCredentials>,
  res: Response
) => {
  const cookies = req.cookies;

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Email and password are required!' });
  }

  const user = await prismaClient.user.findUnique({
    where: {
      email
    }
  });

  // check if user not exists or password is incorrect
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Username or password incorrect!'
    });
  }

  if (user.provider) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'User created using social network, use social network method.'
    });
  }

  if (!verifyPassword(user.password, password)) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Username or password incorrect!'
    });
  }

  // check if email is verified
  if (!user.emailVerified) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Your email is not verified! Please confirm your email!'
    });
  }

  try {
    // if there is a refresh token in the req.cookie, then we need to check if this
    // refresh token exists in the database and belongs to the current user
    // if the token does not belong to the current user, then we delete all refresh tokens
    // of the user stored in the db to be on the safe site
    // we also clear the cookie in both cases
    if (cookies?.[config.jwt.refresh_token.cookie_name]) {
      // get the current token from database
      const refreshToken = await popToken(
        cookies[config.jwt.refresh_token.cookie_name]
      );

      // if token exists in db but is not from the current user delete all tokens
      // from the user
      if (refreshToken && refreshToken.userId !== user.id) {
        await prismaClient.refreshToken.deleteMany({
          where: {
            userId: refreshToken.userId
          }
        });
      }
    }

    // if this token does not exists in database just clear cookies
    res.clearCookie(
      config.jwt.refresh_token.cookie_name,
      clearRefreshTokenCookieConfig
    );

    const accessToken = createAccessToken(user.id);

    const newRefreshToken = createRefreshToken(user.id);

    // store new refresh token in db
    await prismaClient.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id
      }
    });

    // save refresh token in cookie
    res.cookie(
      config.jwt.refresh_token.cookie_name,
      newRefreshToken,
      refreshTokenCookieConfig
    );

    // send access token per json to user so it can be stored in the localStorage
    return res.json({ accessToken });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

/**
 * This function handles the logout process for users. It expects a request object with the following properties:
 *
 * @param {TypedRequest} req - The request object that includes a cookie with a valid refresh token
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 204 NO CONTENT status code if the refresh token cookie is undefined
 *   - A 204 NO CONTENT status code if the refresh token does not exists in the database
 *   - A 204 NO CONTENT status code if the refresh token cookie is successfully cleared
 */
export const handleLogout = async (req: TypedRequest, res: Response) => {
  const cookies = req.cookies;

  if (!cookies[config.jwt.refresh_token.cookie_name]) {
    return res.sendStatus(httpStatus.NO_CONTENT); // No content
  }

  // Is refreshToken in db?
  const refreshToken = await popToken(
    cookies[config.jwt.refresh_token.cookie_name]
  );

  if (!refreshToken) {
    res.clearCookie(
      config.jwt.refresh_token.cookie_name,
      clearRefreshTokenCookieConfig
    );
    return res.sendStatus(httpStatus.NO_CONTENT);
  }

  res.clearCookie(
    config.jwt.refresh_token.cookie_name,
    clearRefreshTokenCookieConfig
  );

  return res.sendStatus(httpStatus.NO_CONTENT);
};

/**
 * This function handles the refresh process for users. It expects a request object with the following properties:
 *
 * @param {Request} req - The request object that includes a cookie with a valid refresh token
 * @param {Response} res - The response object that will be used to send the HTTP response.
 *
 * @returns {Response} Returns an HTTP response that includes one of the following:
 *   - A 401 UNAUTHORIZED status code if the refresh token cookie is undefined
 *   - A 403 FORBIDDEN status code if a refresh token reuse was detected but the token wasn't valid
 *   - A 403 FORBIDDEN status code if a refresh token reuse was detected but the token was valid
 *   - A 403 FORBIDDEN status code if the token wasn't valid
 *   - A 200 OK status code if the token was valid and the user was granted a new refresh and access token
 * Note: This route needs be protected against spammers
 */
export const handleRefresh = async (req: Request, res: Response) => {
  if (!req.payload) return res.sendStatus(httpStatus.FORBIDDEN);

  const accessToken = createAccessToken(req.payload.userId);

  const newRefreshToken = createRefreshToken(req.payload.userId);

  // add refresh token to db
  await addToken(newRefreshToken, req.payload.userId);

  // Creates Secure Cookie with refresh token
  res.cookie(
    config.jwt.refresh_token.cookie_name,
    newRefreshToken,
    refreshTokenCookieConfig
  );

  return res.json({ accessToken });
};
