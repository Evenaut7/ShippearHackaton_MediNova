import { Request, Response } from 'express';
import { em } from '../database.js';
import { ConsultationSchema, ProfessionalSchema, PatientSchema } from '../entities/index.js';

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
        const { audioPath, professionalId, patientId } = req.body;

        if (!audioPath || !professionalId || !patientId) {
            return res.status(400).json({ error: 'Se requieren audioPath, professionalId y patientId.' });
        }

        const professional = await em.findOne(ProfessionalSchema, { id: Number(professionalId) });
        const patient = await em.findOne(PatientSchema, { id: Number(patientId) });

        if (!professional || !patient) {
            return res.status(404).json({ error: 'Profesional o paciente no encontrado.' });
        }

        const consultation = em.create(ConsultationSchema, {
            audioPath,
            createdAt: new Date(),
            professional,
            patient,
        } as any);

        em.persist(consultation);
        await em.flush();
        return res.status(201).json(consultation);
    }

    static async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { audioPath, professionalId, patientId } = req.body;
        const consultation = await em.findOne(ConsultationSchema, { id }, { populate: ['professional', 'patient'] });

        if (!consultation) {
            return res.status(404).json({ error: 'Consulta no encontrada.' });
        }

        if (audioPath) {
            consultation.audioPath = audioPath;
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
