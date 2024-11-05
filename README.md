<!--
Hey, thanks for using the awesome-readme-template template.
If you have any enhancements, then fork this project and create a pull request
or just open an issue with the label "enhancement".

Don't forget to give this project a star for additional support ;)
Maybe you can mention me or this repo in the acknowledgements too
-->
<div align="center">

  <h1>Steel-Express-Auth</h1>
  
  <p>
  A pre-built authentication server that uses JSON Web Tokens (JWT) for authentication. It is built using Express.js, TypeScript and PostgreSQL
  </p>

<h4>
    <a href="https://github.com/gabrielgz0/steel-express-auth#readme">Documentation</a>
  <span> · </span>
    <a href="https://github.com/gabrielgz0/steel-express-auth/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/gabrielgz0/steel-express-auth/issues/">Request Feature</a>
  </h4>
</div>

<!-- About the Project -->

## About the Project

This authentication server project builds upon a secure template, with an even stronger focus on advanced security measures. Designed to streamline the integration of user authentication for web or mobile applications, it leverages JSON Web Tokens (JWT) to establish secure, reliable user sessions. However, beyond basic authentication, this server is engineered with enhanced security features to protect against common vulnerabilities and attacks, offering an extra layer of protection for your application and user data.

Built with Express.js and TypeScript, the server is highly customizable, allowing you to extend and adapt its functionality to fit specific requirements while maintaining a rigorous security standard. By integrating this robust authentication solution into your application, you can ensure that user data and sessions are well safeguarded, freeing you to concentrate on other critical components of your project, confident in the strong security foundation.

<!-- Endpoints -->

### Endpoints

```
POST /v1/auth/signup - Signup
POST /v1/auth/login - Login
POST /v1/auth/refresh - Refresh access token
POST /v1/forgot-password - Send reset password email
POST /v1/reset-password/:token - Reset password
POST /v1/send-verification-email - Send verification email
POST /v1/verify-email/:token - Verify email
```

<!-- Project Structure -->

### Project Structure

```
./src
├── config/         # Config files
├── controller/     # Route controllers
├── middleware/     # Custom middlewares
├── routes/         # Routes
├── types/          # Types
├── utils/          # Utility classes and functions
├── validations/    # Validation schemas
├── app.ts          # Express App
└── index.ts        # App Entrypoint
```

<!-- Database -->

### Database

Our server relies on MySQL as its primary database management system to store and manage all relevant data. MySQL is a popular and widely used open-source relational database system that provides efficient, secure, and scalable storage and retrieval of data.

To simplify and streamline the process of managing the data stored in the MySQL database, we utilize Prisma, which is a modern, type-safe ORM that supports various databases, including MySQL.

Prisma helps us to write database queries in a more readable and intuitive way, making it easier to manage the data stored in our MySQL database. By using Prisma as our ORM of choice, we can also ensure that our application remains scalable, efficient, and maintainable.

If you're interested in the structure of our database, you can take a look at the data model presented below, which provides an overview of the tables, columns, and relationships within the database.

```js

model Account {
  id                String   @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?  @db.Text
  access_token      String?  @db.Text
  expiresAt         DateTime
  token_type        String?
  scope             String?
  id_token          String?  @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model User {
  id                     String                   @id @default(cuid())
  name                   String
  email                  String?                  @unique
  password               String
  emailVerified          DateTime?
  createdAt              DateTime                 @default(now())
  accounts               Account[]
  refreshTokens          RefreshToken[]
  resetToken             ResetToken[]
  emailVerificationToken EmailVerificationToken[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
}

model ResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
}

model EmailVerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
}
```

#### Account

> Social auth is not yet implemented so that the entity can be different in the future

The Account entity represents a linked social media account for a user. It has the following fields:

- id: A unique identifier for the account.
- userId: The ID of the user associated with the account.
- type: The type of account, e.g. oauth.
- provider: The provider of the account, e.g. facebook.
- providerAccountId: The ID associated with the account from the provider's perspective.
- refresh_token: A refresh token used to obtain a new access token.
- access_token: An access token used to authenticate requests to the provider's API.
- expiresAt: The expiration time of the access token.
- token_type: The type of access token.
- scope: The scope of the access token.
- id_token: An ID token associated with the account.
- session_state: The session state of the account.

#### User

The User entity represents a user of the application. It has the following fields:

- id: A unique identifier for the user.
- name: The name of the user.
- email: The email address of the user.
- password: The password of the user.
- emailVerified: The date and time when the user's email address was verified.
- createdAt: The date of creation.
- accounts: A list of linked social media accounts for the user.
- refreshTokens: A list of refresh tokens associated with the user.
- resetToken: A list of reset tokens associated with the user.
- emailVerificationToken: A list of email verification tokens associated with the user.

#### RefreshToken

The RefreshToken entity represents a refresh token used to obtain a new access token. It has the following fields:

- id: A unique identifier for the refresh token.
- token: The token itself.
- user: The user associated with the refresh token.
- userId: The ID of the user associated with the refresh token.
- createdAt: The date of creation.

#### ResetToken

The ResetToken entity represents a reset token used to reset a user's password. It has the following fields:

- id: A unique identifier for the refresh token.
- token: The token itself.
- expiresAt: The expiration time of the reset token.
- user: The user associated with the reset token.
- userId: The ID of the user associated with the reset token.
- createdAt: The date of creation.

#### EmailVerificationToken

The EmailVerificationToken entity represents a token used to verify a user's email address. It has the following fields:

- id: A unique identifier for the refresh token.
- token: The token itself.
- expiresAt: The expiration time of the email verification token.
- user: The user associated with the email verification token.
- userId: The ID of the user associated with the email verification token.
- createdAt: The date of creation.

<!-- Env Variables -->

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
NODE_ENV=                   # Set to 'development' or 'production'

PORT=                       # The port your server will run on (e.g., 3000)
SERVER_URL=                 # Base URL of your server (e.g., http://localhost:3000)
CORS_ORIGIN=                # Allowed origin for CORS (e.g., http://localhost:3000)

ACCESS_TOKEN_SECRET=        # Secret key for signing access tokens
REFRESH_TOKEN_SECRET=       # Secret key for signing refresh tokens

ACCESS_TOKEN_EXPIRE=        # Expiration time for access tokens (e.g., 1h)
REFRESH_TOKEN_EXPIRE=       # Expiration time for refresh tokens (e.g., 30d)

REFRESH_TOKEN_COOKIE_NAME=  # Name of the cookie storing the refresh token

PG_DATABASE=                # Name of your PostgreSQL database
PG_PASSWORD=                # Password for your PostgreSQL user
PG_USER=                    # Username for PostgreSQL (e.g., postgres)
PG_HOST=                    # Host for PostgreSQL (e.g., 127.0.0.1)
PG_PORT=                    # Port for PostgreSQL (default is 5432)

DATABASE_URL=               # Full database URL (useful for ORMs like Prisma)

SMTP_HOST=                  # SMTP server host for email sending
SMTP_PORT=                  # SMTP server port (e.g., 587)
SMTP_USERNAME=              # SMTP server username
SMTP_PASSWORD=              # SMTP server password
EMAIL_FROM=                 # Default sender email address
```

<!-- Getting Started -->

## Getting Started

<!-- Prerequisites -->

### Prerequisites

This project uses Yarn as package manager

```bash
 npm install --global yarn
```

<!-- Installation -->

### Installation

```bash
  git clone https://github.com/gabrielgz0/steel-express-auth.git
  cd express-ts-auth-service
  yarn install
```

### Linting

```bash
  # run ESLint
  yarn lint

  # fix ESLint errors
  yarn lint:fix

  # run prettier
  yarn prettier:check

  # fix prettier errors
  yarn prettier:format

  # fix prettier errors in specific file
  yarn prettier:format:file <file-name>
```

<!-- Running Tests -->

### Running Tests

To run tests, run the following command

```bash
  yarn test
```

Run tests with watch flag

```bash
  yarn test:watch
```

See test coverage

```bash
  yarn coverage
```

<!-- Run Locally -->

### Run Locally

> Note: Dont forget to define the .env variables

Start the server in development mode

```bash
  yarn dev
```

Start the server in production mode

```bash
  yarn start
```

<!-- Run with Docker -->

### Run with Docker

Run docker compose

```bash
  cd steel-express-auth
  docker-compose up
```

<!-- License -->

## License

Distributed under the MIT License. See LICENSE for more information.

<!-- Acknowledgments -->

## Acknowledgements

- [express-ts-auth-service](https://github.com/Louis3797/express-ts-auth-service)
