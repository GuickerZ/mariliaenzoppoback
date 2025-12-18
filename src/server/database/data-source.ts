import path from "path";
import { DataSource } from "typeorm";
import 'dotenv/config';

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "off_db",
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    synchronize: process.env.NODE_ENV !== "production",
    entities: [path.resolve(__dirname, "entities/**/*.entity.{js,ts}")],
});

export { AppDataSource };