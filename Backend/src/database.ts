import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.js';

export const orm = await MikroORM.init(config);
export const em = orm.em;

// MVP: no hay migraciones configuradas, así que sincronizamos el esquema al arrancar.
await orm.schema.ensureDatabase();
await orm.schema.update();
