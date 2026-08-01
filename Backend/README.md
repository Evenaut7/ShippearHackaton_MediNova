# MediNova — Backend

Express + MikroORM (MySQL) + Groq (transcripción y estructuración de reportes con IA).

## Desarrollo local

```bash
pnpm install
pnpm run build && pnpm start   # o: npx tsc --watch en una terminal + node dist/index.js en otra
```

Copiá `.env.example` a `.env` y completá los valores. En desarrollo, el esquema de la base se sincroniza solo al arrancar.

## Deploy a Railway (recomendado si la base también está en Railway)

Railway corre el backend como un servidor persistente normal (no serverless), así que es el camino más simple si el MySQL también vive ahí:

1. En el proyecto de Railway, **New → GitHub Repo**, seleccioná este repo y en **Settings → Root Directory** poné `Backend`.
2. Railway detecta Node.js solo (Nixpacks) y corre `npm install`, `npm run build` y `npm start` — no hace falta ningún archivo de config extra.
3. **Variables de entorno** del servicio backend (Settings → Variables). Si el MySQL es otro servicio del mismo proyecto de Railway, usá referencias a sus variables en vez de copiar valores a mano (así quedan sincronizadas si cambian):
   ```
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   DB_SSL=false
   GROQ_API_KEY=...
   BLOB_READ_WRITE_TOKEN=...
   CORS_ORIGIN=https://tu-frontend...
   ```
   (`MySQL` es el nombre del servicio de base de datos en tu proyecto de Railway; ajustalo si le pusiste otro nombre.) Como está en la red **privada** de Railway (`mysql.railway.internal`), no hace falta exponer el MySQL públicamente ni usar el TCP Proxy.
4. El esquema se sincroniza solo al arrancar (`DB_AUTO_SYNC` está en `true` por defecto) — no hay que correr nada a mano.
5. Railway asigna su propio dominio público al servicio backend; usá esa URL como `NEXT_PUBLIC_API_URL` (+ `/api`) en el frontend.

## Deploy a Vercel (alternativa serverless)

El proyecto corre "zero-config" como Vercel Function (Express) — no hace falta `vercel.json`. Pasos:

1. **Base de datos**: Vercel Functions no pueden conectarse a un MySQL en `localhost` ni a la red privada de Railway. Necesitás un MySQL accesible por internet (PlanetScale, Aiven, o el TCP Proxy público de Railway). Cargá `DB_HOST/PORT/USER/PASSWORD/NAME` con esos datos y `DB_SSL=true` (la mayoría de los proveedores gestionados lo exigen).
2. **Desactivar el auto-sync** (`DB_AUTO_SYNC=false`) y sincronizar el esquema una sola vez, a mano, contra esa base (correr DDL en cada cold start sería lento y riesgoso):
   ```bash
   DB_HOST=... DB_PORT=... DB_USER=... DB_PASSWORD=... DB_NAME=... DB_SSL=true npm run db:sync
   ```
3. **Vercel Blob** (subida de audio): en el proyecto de Vercel, `Storage` → `Create Database` → `Blob`. Esto agrega `BLOB_READ_WRITE_TOKEN` automáticamente al proyecto. Para probarlo en local, `vercel env pull` o copiá el token a tu `.env`.
4. **Variables de entorno** en el dashboard de Vercel (Project Settings → Environment Variables): todas las de `.env.example` (con `DB_AUTO_SYNC=false`), y `CORS_ORIGIN` apuntando a la URL del frontend en producción.
5. Conectá el repo (Root Directory = esta carpeta `Backend/`) y deployá.

### Por qué el flujo de audio no usa multer

Las Vercel Functions tienen un límite de **4.5MB** en el body de la request — muy poco para un audio real de varios minutos. Por eso el navegador sube el audio directo a Vercel Blob (`@vercel/blob/client`) y el backend solo recibe la URL del archivo (`POST /api/audio/generate-report` con `{ audioUrl }`), lo descarga en memoria y lo transcribe sin tocar el filesystem. Esto funciona igual en Railway, así que no hace falta cambiarlo.
