import { em } from '../database.js';
import { PatientSchema } from '../entities/index.js';
export class PatientController {
    static async list(req, res) {
        const patients = await em.find(PatientSchema, {}, { populate: ['consultations'] });
        return res.json(patients);
    }
    static async get(req, res) {
        const id = Number(req.params.id);
        const patient = await em.findOne(PatientSchema, { id }, { populate: ['consultations'] });
        if (!patient) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }
        return res.json(patient);
    }
    static async create(req, res) {
        const patientData = req.body;
        const patient = em.create(PatientSchema, {
            ...patientData,
            createdAt: new Date(),
        });
        em.persist(patient);
        await em.flush();
        return res.status(201).json(patient);
    }
    static async update(req, res) {
        const id = Number(req.params.id);
        const patient = await em.findOne(PatientSchema, { id });
        if (!patient) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }
        em.assign(patient, req.body);
        await em.flush();
        return res.json(patient);
    }
    static async delete(req, res) {
        const id = Number(req.params.id);
        const patient = await em.findOne(PatientSchema, { id });
        if (!patient) {
            return res.status(404).json({ error: 'Paciente no encontrado.' });
        }
        em.remove(patient);
        await em.flush();
        return res.status(204).send();
    }
}
