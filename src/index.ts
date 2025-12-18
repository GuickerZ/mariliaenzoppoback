console.log('🚀 Iniciando aplicação...');

import 'reflect-metadata';
import 'dotenv/config';
import "express-async-errors";

console.log('✅ Dependências básicas carregadas');

import { server } from './server/Server';
import { AppDataSource } from './server/database/data-source';

console.log('✅ Server e DataSource importados');

// Inicialização do banco de dados
let dbInitialized = false;

const initializeDatabase = async () => {
  if (dbInitialized || AppDataSource.isInitialized) {
    console.log('📦 Banco já inicializado');
    return;
  }
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await AppDataSource.initialize();
    console.log('✅ Banco de dados conectado!');
    dbInitialized = true;
  } catch (error: any) {
    console.error('❌ Erro ao conectar ao banco:', error.message);
    throw error;
  }
};

// Handler para Vercel
const handler = async (req: any, res: any) => {
  // Headers CORS
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
    console.error('❌ Erro no handler:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
};

// Para desenvolvimento local
if (!process.env.VERCEL) {
  initializeDatabase().then(() => {
    const PORT = process.env.PORT || 3333;
    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  }).catch(err => {
    console.error('❌ Falha ao iniciar:', err);
    process.exit(1);
  });
}

export default handler;
