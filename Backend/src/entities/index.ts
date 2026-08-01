import { EntitySchema } from '@mikro-orm/core';

export interface Professional {
    id?: number;
    nombreCompleto: string;
    especialidad?: string;
    email?: string;
    telefono?: string;
    createdAt?: Date;
    consultations?: Consultation[];
}

export interface Patient {
    id?: number;
    nombreCompleto: string;
    documento: string;
    fechaNacimiento: Date;
    sexo: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    obraSocial?: string;
    contactoEmergenciaNombre?: string;
    contactoEmergenciaTelefono?: string;
    aiInsightNivel?: string;
    aiInsightResumen?: string;
    aiInsightHallazgos?: string[];
    aiInsightGeneradoEl?: Date;
    createdAt?: Date;
    consultations?: Consultation[];
}

export interface Consultation {
    id?: number;
    fecha: Date;
    motivoConsulta: string;
    sintomas: string[];
    diagnostico: string;
    indicaciones: string;
    notas?: string;
    transcript?: string;
    audioPath?: string;
    createdAt?: Date;
    professional: Professional;
    patient: Patient;
}

export const ProfessionalSchema: EntitySchema<Professional> = new EntitySchema<Professional>({
    name: 'Professional',
    tableName: 'professionals',
    properties: {
        id: { type: 'number', primary: true },
        nombreCompleto: { type: 'string' },
        especialidad: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true },
        telefono: { type: 'string', nullable: true },
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
        nombreCompleto: { type: 'string' },
        documento: { type: 'string', unique: true },
        fechaNacimiento: { type: 'Date' },
        sexo: { type: 'string' },
        telefono: { type: 'string', nullable: true },
        email: { type: 'string', nullable: true },
        direccion: { type: 'string', nullable: true },
        obraSocial: { type: 'string', nullable: true },
        contactoEmergenciaNombre: { type: 'string', nullable: true },
        contactoEmergenciaTelefono: { type: 'string', nullable: true },
        aiInsightNivel: { type: 'string', nullable: true },
        aiInsightResumen: { type: 'text', nullable: true },
        aiInsightHallazgos: { type: 'json', nullable: true },
        aiInsightGeneradoEl: { type: 'Date', nullable: true },
        createdAt: { type: 'Date', onCreate: () => new Date() },
        consultations: {
            kind: '1:m',
            entity: () => ConsultationSchema,
            mappedBy: 'patient',
            nullable: true,
        },
    },
});

export const ConsultationSchema: EntitySchema<Consultation> = new EntitySchema<Consultation>({
    name: 'Consultation',
    tableName: 'consultations',
    properties: {
        id: { type: 'number', primary: true },
        fecha: { type: 'Date' },
        motivoConsulta: { type: 'text' },
        sintomas: { type: 'json' },
        diagnostico: { type: 'text' },
        indicaciones: { type: 'text' },
        notas: { type: 'text', nullable: true },
        transcript: { type: 'text', nullable: true },
        audioPath: { type: 'string', nullable: true },
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
