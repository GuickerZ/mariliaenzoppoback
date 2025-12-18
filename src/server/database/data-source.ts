import { DataSource } from "typeorm";
import 'dotenv/config';

// Importação direta das entidades
import { User } from "./entities/User.entity";
import { Post } from "./entities/Post.entity";
import { Community } from "./entities/Community.entity";
import { Discussion } from "./entities/Discussion.entity";

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "off_db",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    synchronize: true, // Permite sync em produção para criar tabelas automaticamente
    logging: process.env.NODE_ENV !== "production",
    entities: [User, Post, Community, Discussion],
});

export { AppDataSource };
