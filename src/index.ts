import 'dotenv/config';
import 'reflect-metadata';
import "express-async-errors";
import { server } from './server/Server';
import { AppDataSource } from './server/database/data-source';

// Inicialização do banco de dados (apenas uma vez)
let dbInitialized = false;

const initializeDatabase = async () => {
  if (!dbInitialized && !AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log('✅ Banco de dados conectado com sucesso.');
      dbInitialized = true;
    } catch (error) {
      console.error('❌ Erro ao iniciar o banco de dados:', error);
      throw error;
    }
  }
};

// Handler para Vercel (exportação default)
const handler = async (req: any, res: any) => {
  try {
    await initializeDatabase();
    return server(req, res);
  } catch (error) {
    console.error('Erro no handler:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Para ambiente local (desenvolvimento)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  initializeDatabase().then(() => {
    const PORT = process.env.PORT || 3333;
    server.listen(PORT, () => {
      console.log(`🚀 App rodando na porta ${PORT}`);
    });
  });
}

// Exportação para Vercel
export default handler;

// Exporta também o server para uso em testes
export { server };
