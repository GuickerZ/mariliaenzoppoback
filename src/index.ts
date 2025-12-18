import 'dotenv/config';
import "express-async-errors";
import { server } from './server/Server';
import { AppDataSource } from './server/database/data-source';

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Banco de dados conectado com sucesso.');

    server.listen(process.env.PORT || 3333, () => {
      console.log(`App rodando na porta ${process.env.PORT || 3333}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o banco de dados:', error);
  }
};

startServer();