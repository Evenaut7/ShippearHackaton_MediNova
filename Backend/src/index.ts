// src/index.ts
import express from 'express';
import cors from 'cors';
import audioRoutes from './routes/audioRoutes.js';
import professionalRoutes from './routes/professionalRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';

// IMPORTANTE: Importamos el archivo de la cola para que el Worker arranque a escuchar
import './queue/audioQueue.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', audioRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultationRoutes);

// Manejo de errores básicos
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error no capturado:', err);
    res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    console.log(`👂 Worker de transcripción escuchando la cola de Redis...`);
});