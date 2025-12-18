import 'reflect-metadata';
import 'dotenv/config';
import "express-async-errors";

// Log das variáveis de ambiente (sem mostrar senhas)
console.log('🔧 Configuração:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- DB_HOST:', process.env.DB_HOST ? '✅ Definido' : '❌ Não definido');
console.log('- DB_USER:', process.env.DB_USER ? '✅ Definido' : '❌ Não definido');
console.log('- DB_PASSWORD:', process.env.DB_PASSWORD ? '✅ Definido' : '❌ Não definido');
console.log('- DB_NAME:', process.env.DB_NAME ? '✅ Definido' : '❌ Não definido');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✅ Definido' : '❌ Não definido');

import { server } from './server/Server';
import { AppDataSource } from './server/database/data-source';

// Inicialização do banco de dados (apenas uma vez)
let dbInitialized = false;
let dbError: Error | null = null;

const initializeDatabase = async () => {
  if (dbError) {
    throw dbError;
  }
  
  if (!dbInitialized && !AppDataSource.isInitialized) {
    try {
      console.log('🔄 Iniciando conexão com banco de dados...');
      await AppDataSource.initialize();
      console.log('✅ Banco de dados conectado com sucesso.');
      dbInitialized = true;
    } catch (error) {
      console.error('❌ Erro ao iniciar o banco de dados:', error);
      dbError = error as Error;
      throw error;
    }
  }
};

// Handler para Vercel (exportação default)
const handler = async (req: any, res: any) => {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, idUsuario');

  // Resposta para preflight
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
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
};

// Para ambiente local (desenvolvimento)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  initializeDatabase().then(() => {
    const PORT = process.env.PORT || 3333;
    server.listen(PORT, () => {
      console.log(`🚀 App rodando na porta ${PORT}`);
    });
  }).catch(err => {
    console.error('Falha ao iniciar servidor:', err);
    process.exit(1);
  });
}

// Exportação para Vercel
export default handler;

// Exporta também o server para uso em testes
export { server };
