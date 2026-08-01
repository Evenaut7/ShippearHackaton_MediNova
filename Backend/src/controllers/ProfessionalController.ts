import { Request, Response } from 'express';
import { em } from '../database.js';
import { Professional, ProfessionalSchema } from '../entities/index.js';

export class ProfessionalController {
    static async list(req: Request, res: Response) {
        const professionals = await em.find(ProfessionalSchema, {}, { populate: ['consultations'] });
        return res.json(professionals);
    }

    static async get(req: Request, res: Response) {
        const id = Number(req.params.id);
        const professional = await em.findOne(ProfessionalSchema, { id }, { populate: ['consultations'] });

        if (!professional) {
            return res.status(404).json({ error: 'Profesional no encontrado.' });
        }

        return res.json(professional);
    }

    static async create(req: Request, res: Response) {
        const professionalData = req.body as Omit<Professional, 'id' | 'createdAt' | 'consultations'>;
        const professional = em.create(ProfessionalSchema, {
            ...professionalData,
            createdAt: new Date(),
        } as any);

        em.persist(professional);
        await em.flush();
        return res.status(201).json(professional);
    }

    static async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const professional = await em.findOne(ProfessionalSchema, { id });

        if (!professional) {
            return res.status(404).json({ error: 'Profesional no encontrado.' });
        }

        em.assign(professional, req.body);
        await em.flush();
        return res.json(professional);
    }

    static async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        const professional = await em.findOne(ProfessionalSchema, { id });

        if (!professional) {
            return res.status(404).json({ error: 'Profesional no encontrado.' });
        }

        em.remove(professional);
        await em.flush();
        return res.status(204).send();
    }
}
