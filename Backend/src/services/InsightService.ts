import { getGroqClient } from './groqClient.js';

export interface HistoryInsight {
    nivel: 'alerta' | 'info';
    resumen: string;
    hallazgos: string[];
}

export interface ConsultationSummary {
    fecha: Date;
    motivoConsulta: string;
    sintomas: string[];
    diagnostico: string;
    indicaciones: string;
    notas?: string;
}

const SYSTEM_PROMPT = `Sos un asistente clínico que analiza el historial completo de consultas de un paciente para detectar patrones que un médico podría pasar por alto viendo cada consulta de forma aislada: síntomas recurrentes sin diagnóstico común, posibles correlaciones entre consultas, señales de alarma que se repiten, etc.
Devolvé ÚNICAMENTE un JSON con esta forma exacta, sin texto adicional:
{
  "nivel": "alerta" | "info",
  "resumen": string,
  "hallazgos": string[]
}
Usá "alerta" cuando el cruce de consultas revele algo que amerite atención médica prioritaria (por ejemplo, un síntoma persistente sin diagnóstico claro, o señales combinadas de riesgo). Usá "info" cuando el análisis sea relevante pero no urgente. Escribí en español, tono clínico y conciso. No inventes hallazgos que no estén respaldados por el texto.`;

export class InsightService {
    static async analyze(consultations: ConsultationSummary[]): Promise<HistoryInsight> {
        const transcript = consultations
            .map(
                (c, i) =>
                    `Consulta ${i + 1} (${c.fecha.toISOString().slice(0, 10)}):\nMotivo: ${c.motivoConsulta}\nSíntomas: ${c.sintomas.join(', ')}\nDiagnóstico: ${c.diagnostico}\nIndicaciones: ${c.indicaciones}\nNotas: ${c.notas ?? ''}`,
            )
            .join('\n\n');

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
            throw new Error('La IA no devolvió contenido para el análisis del historial.');
        }

        const parsed = JSON.parse(content);
        return {
            nivel: parsed.nivel === 'alerta' ? 'alerta' : 'info',
            resumen: parsed.resumen ?? '',
            hallazgos: Array.isArray(parsed.hallazgos) ? parsed.hallazgos : [],
        };
    }
}
