import { defineConfig } from '@mikro-orm/mysql';
import { MySqlDriver } from '@mikro-orm/mysql';
import dotenv from 'dotenv';
import { User } from './entities/User.js';
dotenv.config();
const config = defineConfig({
    entities: [User],
    dbName: process.env.DB_NAME || 'medinova',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    driver: MySqlDriver,
    debug: process.env.DB_DEBUG === 'true',
    allowGlobalContext: true,
});
export default config;
