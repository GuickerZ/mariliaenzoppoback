import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import 'dotenv/config';

import './shared/services/TranslationsYup';
import { router } from './routes';
import { ExpressAsyncErrors } from './shared/middlewares/ExpressAsyncErrors';

const server = express();

// Logger apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  server.use(morgan("dev"));
}

// CORS - configuração para funcionar na Vercel
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, idUsuario');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

server.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'idUsuario', 'X-Requested-With', 'Accept'],
}));

server.use(express.json());

// Rota de health check
server.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

server.use(router);
server.use(ExpressAsyncErrors);

export { server };
