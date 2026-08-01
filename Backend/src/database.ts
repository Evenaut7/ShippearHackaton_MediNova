import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.js';

export const orm = await MikroORM.init(config);
export const em = orm.em;

// MVP: no hay migraciones configuradas, así que sincronizamos el esquema al
// arrancar. Esto es seguro en un servidor persistente (Railway, local), pero
// en una plataforma serverless (Vercel) conviene desactivarlo con
// DB_AUTO_SYNC=false y correr `npm run db:sync` una sola vez a mano.
if (process.env.DB_AUTO_SYNC !== 'false') {
    await orm.schema.ensureDatabase();
    await orm.schema.update();
}
