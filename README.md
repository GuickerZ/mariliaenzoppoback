# OFF - Backend API

API REST para a rede social antidependência OFF.

## Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação por token
- **Bcrypt** - Hash de senhas

## Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn
- PostgreSQL (ou um serviço como Aiven, Supabase, etc.)

## Instalação

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre no diretório do backend
cd Api-Rest

# Instale as dependências
npm install

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Configure as variáveis de ambiente no arquivo .env
```

## Configuração

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
PORT=3333
NODE_ENV=development

# Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=off_db
DB_SSL=false

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura

# CORS
CORS_ORIGINS=http://localhost:8080,http://localhost:3000
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Build para produção
npm run build

# Iniciar produção
npm run start:production

# Testes
npm run test
```

## Endpoints da API

### Autenticação
- `POST /cadastrar` - Criar nova conta
- `POST /entrar` - Login
- `GET /entrar` - Obter dados do usuário logado

### Posts
- `GET /posts` - Listar posts aleatórios
- `POST /posts` - Criar novo post
- `GET /posts/me` - Listar meus posts
- `POST /posts/:id/like` - Curtir post
- `POST /posts/:id/unlike` - Descurtir post
- `POST /posts/:id/dislike` - Não gostar do post
- `POST /posts/:id/undislike` - Remover não gostei

### Comunidades
- `GET /communities` - Listar comunidades
- `POST /communities` - Criar comunidade
- `GET /communities/:id` - Detalhes da comunidade
- `POST /communities/:id/join` - Entrar na comunidade
- `GET /communities/:id/posts` - Posts da comunidade
- `POST /communities/:id/posts` - Criar post na comunidade

### Discussões
- `GET /posts/:postId/discussions` - Listar discussões de um post
- `POST /posts/:postId/discussions` - Criar discussão

### Estatísticas
- `GET /me/stats` - Estatísticas do usuário
- `GET /me/activity/weekly` - Atividade semanal
- `GET /me/insights` - Insights do usuário

## Deploy na Vercel

1. Conecte o repositório à Vercel
2. Configure o diretório raiz como `Api-Rest`
3. Configure as variáveis de ambiente no painel da Vercel:
   - `PORT`
   - `NODE_ENV=production`
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `DB_SSL=true`
   - `JWT_SECRET`
   - `CORS_ORIGINS=https://seu-frontend.vercel.app`
4. Deploy!

## Estrutura do Projeto

```
src/
├── index.ts              # Entrada da aplicação
└── server/
    ├── Server.ts         # Configuração do Express
    ├── routes/           # Rotas da API
    ├── controllers/      # Controllers
    ├── DAO/              # Data Access Objects
    ├── database/
    │   ├── data-source.ts    # Configuração TypeORM
    │   └── entities/         # Entidades do banco
    ├── helpers/          # Helpers e erros
    └── shared/
        ├── middlewares/  # Middlewares
        └── services/     # Serviços (JWT, Crypto)
```

## Autor

Marília Marques

