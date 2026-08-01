// src/services/TranscriptionService.ts
import fs from 'fs';
import { OpenAI } from 'openai';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    // baseURL: "https://api.groq.com/openai/v1", // Clave para el MVP: Groq es gratis y rapidísimo
});
export class TranscriptionService {
    static async transcribe(filePath) {
        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-large-v3', // o 'whisper-1' si usás OpenAI puro
            language: 'es',
        });
        return response.text;
    }
}
