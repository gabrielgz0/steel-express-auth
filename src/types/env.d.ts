declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NODE_ENV: 'production' | 'development' | 'test';
    readonly PORT: string;
    readonly SERVER_URL: string;
    readonly CORS_ORIGIN: string;
    readonly ACCESS_TOKEN_SECRET: string;
    readonly ACCESS_TOKEN_EXPIRE: string;
    readonly REFRESH_TOKEN_SECRET: string;
    readonly REFRESH_TOKEN_EXPIRE: string;
    readonly REFRESH_TOKEN_COOKIE_NAME: string;
    readonly PG_DATABASE: string;
    readonly PG_PASSWORD: string;
    readonly DATABASE_URL: string;
    readonly SMTP_HOST: string;
    readonly SMTP_PORT: string;
    readonly SMTP_USERNAME: string;
    readonly SMTP_PASSWORD: string;
    readonly EMAIL_FROM: string;
    readonly GOOGLE_ENABLE: boolean;
    readonly GOOGLE_CLIENT_ID: string;
    readonly GOOGLE_CLIENT_SECRET: string;
    readonly APPLE_ENABLE: boolean;
    readonly APPLE_CLIENT_ID: string;
    readonly APPLE_TEAM_ID: string;
    readonly APPLE_KEY_ID: string;
    readonly APPLE_PRIVATE_KEY: string;
    readonly MICROSOFT_ENABLE: boolean;
    readonly MICROSOFT_CLIENT_ID: string;
    readonly MICROSOFT_CLIENT_SECRET: string;
  }
}
