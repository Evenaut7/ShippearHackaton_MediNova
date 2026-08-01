import { EntitySchema } from '@mikro-orm/core';

export interface Professional {
    id?: number;
    name: string;
    email?: string;
    phone?: string;
    specialization?: string;
    createdAt?: Date;
    consultations?: Consultation[];
}

export interface Patient {
    id?: number;
    name: string;
    email?: string;
    birthDate?: Date;
    createdAt?: Date;
    consultations?: Consultation[];
}

export interface Consultation {
    id?: number;
    audioPath: string;
    createdAt?: Date;
    professional: Professional;
    patient: Patient;
}

export const ProfessionalSchema: EntitySchema<Professional> = new EntitySchema<Professional>({
    name: 'Professional',
    tableName: 'professionals',
    properties: {
        id: { type: 'number', primary: true },
        name: { type: 'string' },
        email: { type: 'string', unique: true, nullable: true },
        phone: { type: 'string', nullable: true },
        specialization: { type: 'string', nullable: true },
        createdAt: { type: 'Date', onCreate: () => new Date() },
        consultations: {
            kind: '1:m',
            entity: () => ConsultationSchema,
            mappedBy: 'professional',
            nullable: true,
        },
    },
});

export const PatientSchema: EntitySchema<Patient> = new EntitySchema<Patient>({
    name: 'Patient',
    tableName: 'patients',
    properties: {
        id: { type: 'number', primary: true },
        name: { type: 'string' },
        email: { type: 'string', unique: true, nullable: true },
        birthDate: { type: 'Date', nullable: true },
        createdAt: { type: 'Date', onCreate: () => new Date() },
        consultations: {
            kind: '1:m',
            entity: () => ConsultationSchema,
            mappedBy: 'patient',
            nullable: true,
        },
    },
});

export const ConsultationSchema: EntitySchema<Consultation>: EntitySchema<Consultation> = new EntitySchema<Consultation>({
    name: 'Consultation',
    tableName: 'consultations',
    properties: {
        id: { type: 'number', primary: true },
        audioPath: { type: 'string' },
        createdAt: { type: 'Date', onCreate: () => new Date() },
        professional: {
            kind: 'm:1',
            entity: () => ProfessionalSchema,
            inversedBy: 'consultations',
        },
        patient: {
            kind: 'm:1',
            entity: () => PatientSchema,
            inversedBy: 'consultations',
        },
    },
});
