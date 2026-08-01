import fs from 'fs';
import { getGroqClient } from './groqClient.js';

export class TranscriptionService {
    static async transcribe(filePath: string): Promise<string> {
        const response = await getGroqClient().audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-large-v3',
            language: 'es',
        });

        return response.text;
    }
}
