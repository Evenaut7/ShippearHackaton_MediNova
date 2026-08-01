import { toFile } from 'openai/uploads';
import { getGroqClient } from './groqClient.js';

export class TranscriptionService {
    static async transcribe(audioBuffer: Buffer, filename: string): Promise<string> {
        const file = await toFile(audioBuffer, filename);
        const response = await getGroqClient().audio.transcriptions.create({
            file,
            model: 'whisper-large-v3',
            language: 'es',
        });

        return response.text;
    }
}
