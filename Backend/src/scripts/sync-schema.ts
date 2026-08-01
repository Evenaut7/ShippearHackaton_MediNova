import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { MikroORM } from '@mikro-orm/core';
import config from '../mikro-orm.config.js';

const orm = await MikroORM.init(config);
await orm.schema.ensureDatabase();
await orm.schema.update();
console.log('Esquema sincronizado correctamente.');
await orm.close();
