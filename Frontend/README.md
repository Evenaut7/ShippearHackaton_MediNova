# MediNova — Frontend

Frontend MVP del sistema de asistencia clínica con IA. Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui, con datos mockeados en memoria (sin backend real todavía).

## Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). La raíz redirige a `/pacientes`.

## Estructura

- `src/app/pacientes` — listado y CRUD de pacientes.
- `src/app/pacientes/[id]` — historial del paciente: datos personales, opinión de IA sobre el historial y línea de tiempo de consultas.
- `src/context/patients-context.tsx` — estado en memoria (pacientes, consultas) con las operaciones CRUD. Punto de reemplazo cuando haya una API real.
- `src/lib/mock-data.ts` — pacientes y consultas de ejemplo.
- `src/components/patients` y `src/components/patient-detail` — componentes de cada pantalla.
