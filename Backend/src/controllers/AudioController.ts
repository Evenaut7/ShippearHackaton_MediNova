import { Request, Response } from 'express';
import { TranscriptionService } from '../services/TranscriptionService.js';
import { ReportService } from '../services/ReportService.js';

export class AudioController {
    static async generateReport(req: Request, res: Response) {
        if (!req.file) {
            return res.status(400).json({ error: 'No se envió ningún audio.' });
        }

        const audioPath = req.file.path;

        try {
            const transcript = await TranscriptionService.transcribe(audioPath);
            const report = await ReportService.structure(transcript);

            return res.json({
                audioPath,
                transcript,
                ...report,
            });
        } catch (error) {
            console.error('Error generando el reporte de audio:', error);
            return res.status(502).json({ error: 'No se pudo generar el reporte a partir del audio.' });
        }
    }
}
