import { DataSource } from "typeorm";
import 'dotenv/config';

// Importação direta das entidades
import { User } from "./entities/User.entity";
import { Post } from "./entities/Post.entity";
import { Community } from "./entities/Community.entity";
import { Discussion } from "./entities/Discussion.entity";

// Aceita ambos os formatos de variáveis de ambiente
const DB_HOST = process.env.DB_HOST || process.env.DATABASE_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || process.env.DATABASE_PORT || "5432");
const DB_USER = process.env.DB_USER || process.env.DATABASE_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || process.env.DATABASE_NAME || "off_db";
const DB_SSL = process.env.DB_SSL || process.env.DATABASE_SSL || "false";

console.log('📦 Configuração do banco:');
console.log('- Host:', DB_HOST);
console.log('- Port:', DB_PORT);
console.log('- User:', DB_USER);
console.log('- Database:', DB_NAME);
console.log('- SSL:', DB_SSL);

const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl: DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    synchronize: true,
    logging: false,
    entities: [User, Post, Community, Discussion],
});

export { AppDataSource };
