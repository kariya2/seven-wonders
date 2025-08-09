import { Express, Request, Response, NextFunction } from 'express';

// Simple auth middleware - replace with real authentication in production
export function setupAuthMiddleware(app: Express) {
  // For now, just add a simple API key check for protected routes
  app.use(
    '/api/protected/*',
    (req: Request, res: Response, next: NextFunction) => {
      const apiKey = req.headers['x-api-key'];

      if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      next();
    }
  );
}
