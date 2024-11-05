import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware to manage HTTP response headers for security.
 * Helps prevent information leakage about the server
 * and reduces the risk of attacks by limiting the data available
 * to potential attackers.
 */

export const headerManagement = (_: Request, res: Response, next: NextFunction) => {
  // headers to add
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY', // change to 'SAMEORIGIN' if you need
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains', // 2year
    // eslint-disable-next-line quotes
    'Content-Security-Policy': "default-src 'self'",
    'X-Powered-By': 'PHP 5.3' // kk
  };

  Object.entries(securityHeaders).forEach(([header, value]) => {
    res.setHeader(header, value);
  });

  // headers to remove
  const headersToRemove = [
    'Server',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'X-DNS-Prefetch-Control',
    'Origin-Agent-Cluster',
    'X-XSS-Protection',
    'X-Permitted-Cross-Domain-Policies',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
    'Access-Control-Expose-Headers',
    'Cross-Origin-Embedder-Policy',
    'Cross-Origin-Opener-Policy',
    'Cross-Origin-Resource-Policy',
    'X-Download-Options'
  ];

  // Remove os cabeçalhos desnecessários
  headersToRemove.forEach(header => {
    res.removeHeader(header);
  });

  // Chama o próximo middleware
  next();
};
