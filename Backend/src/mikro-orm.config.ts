import { defineConfig } from '@mikro-orm/mysql';
import { MySqlDriver } from '@mikro-orm/mysql';
import dotenv from 'dotenv';
import { ConsultationSchema, PatientSchema, ProfessionalSchema } from './entities/index.js';

dotenv.config({ quiet: true });

const config = defineConfig({
    entities: [ProfessionalSchema, PatientSchema, ConsultationSchema],
    dbName: process.env.DB_NAME || 'medinova',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    driver: MySqlDriver,
    debug: process.env.DB_DEBUG === 'true',
    allowGlobalContext: true,
    // La mayoría de los MySQL gestionados (PlanetScale, Railway, Aiven, etc.) exigen SSL.
    driverOptions:
        process.env.DB_SSL === 'true'
            ? { ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' } }
            : {},
});

export default config;
