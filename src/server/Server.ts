import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import 'dotenv/config';

import './shared/services/TranslationsYup';
import { router } from './routes';
import { ExpressAsyncErrors } from './shared/middlewares/ExpressAsyncErrors';

const server = express();
const logger = morgan("dev");

// Configuração do CORS
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:8080', 'http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem origin (como apps mobile ou Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'idUsuario', 'X-Requested-With'],
};

server.use(logger);
server.use(cors(corsOptions));
server.use(express.json());

server.use(router);
server.use(ExpressAsyncErrors);

export { server };