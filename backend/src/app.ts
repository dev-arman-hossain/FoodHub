import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { IndexRoutes } from './routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { notFound } from './middlewares/notFound';
import { envVars } from './config/env';

const app: Application = express();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, 'http://localhost:3000'],
    credentials: true,
  }),
);

// Application routes
app.use('/api/v1', IndexRoutes);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to FoodHub API',
  });
});

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
