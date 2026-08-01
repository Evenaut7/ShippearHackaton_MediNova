import { Request, Response } from 'express';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { get } from '@vercel/blob';
import { TranscriptionService } from '../services/TranscriptionService.js';
import { ReportService } from '../services/ReportService.js';

function filenameFromUrl(url: string): string {
    try {
        const { pathname } = new URL(url);
        const last = pathname.split('/').pop();
        return last || 'audio';
    } catch {
        return 'audio';
    }
}

export class AudioController {
    static async uploadToken(req: Request, res: Response) {
        const body = req.body as HandleUploadBody;

        try {
            const jsonResponse = await handleUpload({
                body,
                request: req,
                onBeforeGenerateToken: async () => ({
                    allowedContentTypes: ['audio/*'],
                    addRandomSuffix: true,
                    maximumSizeInBytes: 25 * 1024 * 1024, // límite de Groq para transcripción
                }),
                onUploadCompleted: async ({ blob }) => {
                    console.log('Audio subido a Blob:', blob.url);
                },
            });

            return res.json(jsonResponse);
        } catch (error) {
            console.error('Error generando el token de subida de audio:', error);
            return res.status(400).json({
                error: error instanceof Error ? error.message : 'No se pudo generar el token de subida.',
            });
        }
    }

    static async generateReport(req: Request, res: Response) {
        const { audioUrl } = req.body as { audioUrl?: string };

        if (!audioUrl) {
            return res.status(400).json({ error: 'Se requiere audioUrl.' });
        }

        try {
            const blob = await get(audioUrl, { access: 'private' });
            if (!blob || blob.stream === null) {
                return res.status(400).json({ error: 'No se pudo descargar el audio desde la URL provista.' });
            }
            const audioBuffer = Buffer.from(await new Response(blob.stream).arrayBuffer());

            const transcript = await TranscriptionService.transcribe(audioBuffer, filenameFromUrl(audioUrl));
            const report = await ReportService.structure(transcript);

            return res.json({
                audioPath: audioUrl,
                transcript,
                ...report,
            });
        } catch (error) {
            console.error('Error generando el reporte de audio:', error);
            return res.status(502).json({ error: 'No se pudo generar el reporte a partir del audio.' });
        }
    }
}
