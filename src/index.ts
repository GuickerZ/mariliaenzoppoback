// Primeiro, vamos testar se o básico funciona
console.log('🚀 Iniciando aplicação...');

import 'reflect-metadata';
console.log('✅ reflect-metadata carregado');

import 'dotenv/config';
console.log('✅ dotenv carregado');

// Log das variáveis de ambiente
console.log('🔧 Variáveis de ambiente:');
console.log('- DB_HOST:', process.env.DB_HOST || 'NÃO DEFINIDO');
console.log('- DB_PORT:', process.env.DB_PORT || 'NÃO DEFINIDO');
console.log('- DB_USER:', process.env.DB_USER || 'NÃO DEFINIDO');
console.log('- DB_NAME:', process.env.DB_NAME || 'NÃO DEFINIDO');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'DEFINIDO' : 'NÃO DEFINIDO');

import express from 'express';
console.log('✅ express carregado');

import cors from 'cors';
console.log('✅ cors carregado');

// Criar app Express simples primeiro
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Rota de teste básica
app.get('/', (req, res) => {
  res.json({ message: 'API Running!', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      DB_HOST: process.env.DB_HOST ? 'SET' : 'NOT SET',
      DB_USER: process.env.DB_USER ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
    }
  });
});

// Handler para Vercel
const handler = (req: any, res: any) => {
  console.log(`📥 ${req.method} ${req.url}`);
  return app(req, res);
};

// Para desenvolvimento local
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}

export default handler;
