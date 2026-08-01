import { OpenAI } from 'openai';

let client: OpenAI | null = null;

export function getGroqClient(): OpenAI {
    if (!client) {
        client = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1',
        });
    }
    return client;
}
