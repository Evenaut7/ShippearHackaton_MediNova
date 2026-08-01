// src/controllers/AudioController.ts
import { Request, Response } from 'express';
import { transcriptionQueue } from '../queue/audioQueue.js';

export class AudioController {
    static async upload(req: Request, res: Response) {
        if (!req.file) {
            return res.status(400).json({ error: 'No se envió ningún audio.' });
        }

        // Agregamos el trabajo a la cola asíncrona
        const job = await transcriptionQueue.add('transcribe-task', {
            filePath: req.file.path // Ej: 'uploads/1690000000-audio.ogg'
        });

        // Respondemos Inmediatamente (202 Accepted)
        return res.status(202).json({
            message: 'Audio recibido y encolado para transcripción.',
            jobId: job.id
        });
    }
}