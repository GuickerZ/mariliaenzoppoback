import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import 'dotenv/config';

import './shared/services/TranslationsYup';
import { router } from './routes';
import { ExpressAsyncErrors } from './shared/middlewares/ExpressAsyncErrors';

const server = express();

// Logger apenas em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  server.use(morgan("dev"));
}

// CORS
server.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'idUsuario', 'X-Requested-With', 'Accept'],
}));

server.use(express.json());

// Health check
server.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

server.use(router);
server.use(ExpressAsyncErrors);

export { server };
