import * as dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const envSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.string().required().default('4000'),
  SERVER_URL: Joi.string().required(),
  CORS_ORIGIN: Joi.string().required().default('*'),
  ACCESS_TOKEN_SECRET: Joi.string().min(8).required(),
  ACCESS_TOKEN_EXPIRE: Joi.string().required().default('20m'),
  REFRESH_TOKEN_SECRET: Joi.string().min(8).required(),
  REFRESH_TOKEN_EXPIRE: Joi.string().required().default('1d'),
  REFRESH_TOKEN_COOKIE_NAME: Joi.string().required().default('jid'),
  PG_DATABASE: Joi.string().required(),
  PG_PASSWORD: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.string().default('587'),
  SMTP_USERNAME: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  EMAIL_FROM: Joi.string().email().required(),

  // enable or disable social auth
  APPLE_ENABLE: Joi.boolean(),
  GOOGLE_ENABLE: Joi.boolean(),
  MICROSOFT_ENABLE: Joi.boolean(),

  // social auth schemas, optional
  GOOGLE_CLIENT_ID: Joi.string().allow('').optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().allow('').optional(),

  APPLE_CLIENT_ID: Joi.string().allow('').optional(),
  APPLE_TEAM_ID: Joi.string().allow('').optional(),
  APPLE_KEY_ID: Joi.string().allow('').optional(),
  APPLE_PRIVATE_KEY: Joi.string().allow('').optional(),

  MICROSOFT_CLIENT_ID: Joi.string().allow('').optional(),
  MICROSOFT_CLIENT_SECRET: Joi.string().allow('').optional()
});

const { value: validatedEnv, error } = envSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
  throw new Error(
    `Environment variable validation error: \n${error.details
      .map((detail) => detail.message)
      .join('\n')}`
  );
}

const config = {
  node_env: validatedEnv.NODE_ENV,
  server: {
    port: validatedEnv.PORT,
    url: validatedEnv.SERVER_URL
  },
  cors: {
    cors_origin: validatedEnv.CORS_ORIGIN
  },
  jwt: {
    access_token: {
      secret: validatedEnv.ACCESS_TOKEN_SECRET,
      expire: validatedEnv.ACCESS_TOKEN_EXPIRE
    },
    refresh_token: {
      secret: validatedEnv.REFRESH_TOKEN_SECRET,
      expire: validatedEnv.REFRESH_TOKEN_EXPIRE,
      cookie_name: validatedEnv.REFRESH_TOKEN_COOKIE_NAME
    }
  },
  email: {
    smtp: {
      host: validatedEnv.SMTP_HOST,
      port: validatedEnv.SMTP_PORT,
      auth: {
        username: validatedEnv.SMTP_USERNAME,
        password: validatedEnv.SMTP_PASSWORD
      }
    },
    from: validatedEnv.EMAIL_FROM
  },
  social_auth: {
    google: {
      enable: validatedEnv.GOOGLE_ENABLE,
      client_id: validatedEnv.GOOGLE_CLIENT_ID,
      client_secret: validatedEnv.GOOGLE_CLIENT_SECRET
    },
    apple: {
      enable: validatedEnv.APPLE_ENABLE,
      clientID: validatedEnv.APPLE_CLIENT_ID,
      teamID: validatedEnv.APPLE_TEAM_ID,
      keyID: validatedEnv.APPLE_KEY_ID,
      privateKey: validatedEnv.APPLE_PRIVATE_KEY
    },
    microsoft: {
      enable: validatedEnv.MICROSOFT_ENABLE,
      client_id: validatedEnv.MICROSOFT_CLIENT_ID,
      client_secret: validatedEnv.MICROSOFT_CLIENT_SECRET
    }
  }
} as const;

export default config;
