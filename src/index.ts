import 'reflect-metadata';
import 'dotenv/config';
import "express-async-errors";

import { server } from './server/Server';
import { AppDataSource } from './server/database/data-source';

let dbInitialized = false;
let connectionPromise: Promise<void> | null = null;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const initializeDatabase = async (retries = 3): Promise<void> => {
  if (dbInitialized && AppDataSource.isInitialized) return;
  
  // Evita múltiplas inicializações simultâneas
  if (connectionPromise) return connectionPromise;
  
  connectionPromise = (async () => {
    for (let i = 0; i < retries; i++) {
      try {
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }
        dbInitialized = true;
        return;
      } catch (error: any) {
        console.error(`DB connection attempt ${i + 1} failed:`, error.message);
        if (i < retries - 1) {
          await sleep(1000 * (i + 1)); // Backoff: 1s, 2s, 3s
        } else {
          throw error;
        }
      }
    }
  })();
  
  try {
    await connectionPromise;
  } finally {
    connectionPromise = null;
  }
};

// Handler para Vercel (serverless)
const handler = async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, idUsuario');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await initializeDatabase();
    return server(req, res);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
};

// Graceful shutdown - fecha conexões ao reiniciar
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing database connections...`);
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connections closed.');
    }
  } catch (error) {
    console.error('Error closing database:', error);
  }
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart

// Desenvolvimento local
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3333;
  
  initializeDatabase()
    .then(() => {
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(() => process.exit(1));
}

export default handler;
