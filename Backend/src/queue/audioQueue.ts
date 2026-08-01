// src/queue/audioQueue.ts
import { Queue, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import fs from 'fs';
import { MediaService } from '../services/MediaService.js';
import { TranscriptionService } from '../services/TranscriptionService.js';

// Conexión a Redis local por defecto
const connection = new Redis({ maxRetriesPerRequest: null });

export const transcriptionQueue = new Queue('audio-transcription', { connection });

// El worker procesa los audios en segundo plano
export const transcriptionWorker = new Worker('audio-transcription', async (job) => {
    const { filePath } = job.data;
    const wavPath = `${filePath}.wav`;

    try {
        console.log(`[Job ${job.id}] Convirtiendo audio...`);
        await MediaService.convertToWav(filePath, wavPath);

        console.log(`[Job ${job.id}] Transcribiendo con Whisper...`);
        const transcription = await TranscriptionService.transcribe(wavPath);

        console.log(`[Job ${job.id}] Transcripción exitosa.`);

        // Acá podés guardar 'transcription' en MySQL usando tu ORM
        return transcription;

    } catch (error) {
        console.error(`[Job ${job.id}] Error:`, error);
        throw error;
    } finally {
        // Limpieza: borramos los archivos temporales para no llenar el disco
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);
    }
}, { connection });