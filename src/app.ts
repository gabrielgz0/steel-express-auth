import express, { type Express } from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import compressFilter from './utils/compressFilter.util';
import {
  authRouter,
  passportRouter,
  passwordRouter,
  verifyEmailRouter
} from './routes/v1';
import isAuth from './middleware/isAuth';
import { errorHandler } from './middleware/errorHandler';
import config from './config/config';
import authLimiter from './middleware/authLimiter';
import { xssMiddleware } from './middleware/xssMiddleware';
import path from 'path';
import { headerManagement } from './middleware/headerManagement';
import { InitPassport } from './config/passportConfig';

const app: Express = express();

// Init Passport to social auth
InitPassport();

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Security middlewares
app.use(xssMiddleware());

// Add, remove or modify some headers for safety
app.use(headerManagement);
app.set('etag', false);

// Compression to reduce response size
app.use(compression({ filter: compressFilter }));

// CORS configuration
app.use(
  cors({
    origin: String(config.cors.cors_origin).split('|'),
    credentials: true
  })
);

if (config.node_env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/auth', passportRouter);
app.use('/api/v1', passwordRouter);
app.use('/api/v1', verifyEmailRouter);

// Secure route
app.get('/secret', isAuth, (_req, res) => {
  res.json({
    message: 'You can see me'
  });
});

// Handle 404 for undefined routes
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// Error handler middleware
app.use(errorHandler);

export default app;
