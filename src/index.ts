import 'reflect-metadata';
import 'dotenv/config';
import "express-async-errors";

import { server } from './server/Server';
import { AppDataSource } from './server/database/data-source';

let dbInitialized = false;

const initializeDatabase = async () => {
  if (dbInitialized || AppDataSource.isInitialized) return;
  
  await AppDataSource.initialize();
  dbInitialized = true;
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
