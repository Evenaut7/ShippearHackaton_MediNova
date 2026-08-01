import { Request, Response } from 'express';
import { em } from '../database.js';
import { ConsultationSchema, ProfessionalSchema, PatientSchema, Patient } from '../entities/index.js';
import { InsightService } from '../services/InsightService.js';

const MIN_CONSULTATIONS_FOR_INSIGHT = 2;

async function refreshPatientInsight(patient: Patient) {
    const consultations = await em.find(
        ConsultationSchema,
        { patient: patient.id },
        { orderBy: { fecha: 'ASC' } },
    );

    if (consultations.length < MIN_CONSULTATIONS_FOR_INSIGHT) {
        return;
    }

    try {
        const insight = await InsightService.analyze(consultations);
        patient.aiInsightNivel = insight.nivel;
        patient.aiInsightResumen = insight.resumen;
        patient.aiInsightHallazgos = insight.hallazgos;
        patient.aiInsightGeneradoEl = new Date();
        await em.flush();
    } catch (error) {
        console.error('Error generando la opinión de IA sobre el historial:', error);
    }
}

export class ConsultationController {
    static async list(req: Request, res: Response) {
        const consultations = await em.find(ConsultationSchema, {}, { populate: ['professional', 'patient'] });
        return res.json(consultations);
    }

    static async get(req: Request, res: Response) {
        const id = Number(req.params.id);
        const consultation = await em.findOne(ConsultationSchema, { id }, { populate: ['professional', 'patient'] });

        if (!consultation) {
            return res.status(404).json({ error: 'Consulta no encontrada.' });
        }

        return res.json(consultation);
    }

    static async create(req: Request, res: Response) {
        const {
            patientId,
            professionalId,
            fecha,
            motivoConsulta,
            sintomas,
            diagnostico,
            indicaciones,
            notas,
            transcript,
            audioPath,
        } = req.body;

        if (!patientId || !professionalId || !fecha || !motivoConsulta) {
            return res.status(400).json({
                error: 'Se requieren patientId, professionalId, fecha y motivoConsulta.',
            });
        }

        const professional = await em.findOne(ProfessionalSchema, { id: Number(professionalId) });
        const patient = await em.findOne(PatientSchema, { id: Number(patientId) });

        if (!professional || !patient) {
            return res.status(404).json({ error: 'Profesional o paciente no encontrado.' });
        }

        const consultation = em.create(ConsultationSchema, {
            fecha: new Date(fecha),
            motivoConsulta,
            sintomas: Array.isArray(sintomas) ? sintomas : [],
            diagnostico: diagnostico ?? '',
            indicaciones: indicaciones ?? '',
            notas: notas ?? '',
            transcript,
            audioPath,
            professional,
            patient,
        } as any);

        em.persist(consultation);
        await em.flush();
        await refreshPatientInsight(patient);
        return res.status(201).json(consultation);
    }

    static async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const {
            professionalId,
            patientId,
            fecha,
            motivoConsulta,
            sintomas,
            diagnostico,
            indicaciones,
            notas,
            transcript,
            audioPath,
        } = req.body;
        const consultation = await em.findOne(ConsultationSchema, { id }, { populate: ['professional', 'patient'] });

        if (!consultation) {
            return res.status(404).json({ error: 'Consulta no encontrada.' });
        }

        if (professionalId) {
            const professional = await em.findOne(ProfessionalSchema, { id: Number(professionalId) });
            if (!professional) {
                return res.status(404).json({ error: 'Profesional no encontrado.' });
            }
            consultation.professional = professional;
        }

        if (patientId) {
            const patient = await em.findOne(PatientSchema, { id: Number(patientId) });
            if (!patient) {
                return res.status(404).json({ error: 'Paciente no encontrado.' });
            }
            consultation.patient = patient;
        }

        if (fecha) consultation.fecha = new Date(fecha);
        if (motivoConsulta !== undefined) consultation.motivoConsulta = motivoConsulta;
        if (sintomas !== undefined) consultation.sintomas = Array.isArray(sintomas) ? sintomas : [];
        if (diagnostico !== undefined) consultation.diagnostico = diagnostico;
        if (indicaciones !== undefined) consultation.indicaciones = indicaciones;
        if (notas !== undefined) consultation.notas = notas;
        if (transcript !== undefined) consultation.transcript = transcript;
        if (audioPath !== undefined) consultation.audioPath = audioPath;

        await em.flush();
        return res.json(consultation);
    }

    static async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        const consultation = await em.findOne(ConsultationSchema, { id });

        if (!consultation) {
            return res.status(404).json({ error: 'Consulta no encontrada.' });
        }

        em.remove(consultation);
        await em.flush();
        return res.status(204).send();
    }
}
