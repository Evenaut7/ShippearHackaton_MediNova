import { getGroqClient } from './groqClient.js';

export interface StructuredReport {
    motivoConsulta: string;
    sintomas: string[];
    diagnostico: string;
    indicaciones: string;
    notas: string;
}

const SYSTEM_PROMPT = `Sos un asistente clínico que estructura la transcripción de una consulta médica grabada en audio.
A partir del texto que te pasa el usuario, devolvé ÚNICAMENTE un JSON con esta forma exacta, sin texto adicional:
{
  "motivoConsulta": string,
  "sintomas": string[],
  "diagnostico": string,
  "indicaciones": string,
  "notas": string
}
Escribí todo en español, de forma concisa y en tono clínico. Si la transcripción no menciona alguno de estos datos, completá el campo con tu mejor inferencia razonable a partir del contexto, o dejalo como una cadena vacía ("") o un array vacío ([]) si no hay información suficiente. No inventes diagnósticos graves sin base en el texto.`;

export class ReportService {
    static async structure(transcript: string): Promise<StructuredReport> {
        const completion = await getGroqClient().chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: transcript },
            ],
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            throw new Error('La IA no devolvió contenido para estructurar el reporte.');
        }

        const parsed = JSON.parse(content);
        return {
            motivoConsulta: parsed.motivoConsulta ?? '',
            sintomas: Array.isArray(parsed.sintomas) ? parsed.sintomas : [],
            diagnostico: parsed.diagnostico ?? '',
            indicaciones: parsed.indicaciones ?? '',
            notas: parsed.notas ?? '',
        };
    }
}
