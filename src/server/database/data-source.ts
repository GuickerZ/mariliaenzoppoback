import { DataSource } from "typeorm";
import 'dotenv/config';

import { User } from "./entities/User.entity";
import { Post } from "./entities/Post.entity";
import { Community } from "./entities/Community.entity";
import { Discussion } from "./entities/Discussion.entity";

const DB_HOST = process.env.DB_HOST || process.env.DATABASE_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || process.env.DATABASE_PORT || "5432");
const DB_USER = process.env.DB_USER || process.env.DATABASE_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || process.env.DATABASE_NAME || "off_db";
const DB_SSL = process.env.DB_SSL || process.env.DATABASE_SSL || "false";

const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  ssl: DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  synchronize: true,
  logging: process.env.NODE_ENV === "development",
  entities: [User, Post, Community, Discussion],
  extra: {
    max: 1,
    min: 0,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 3000,
    allowExitOnIdle: true,
  },
  poolSize: 1,
});

export { AppDataSource };
