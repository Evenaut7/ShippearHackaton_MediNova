export type Sexo = "femenino" | "masculino" | "otro";

export interface ContactoEmergencia {
  nombre: string;
  telefono: string;
}

export interface Professional {
  id: string;
  nombreCompleto: string;
  especialidad?: string;
  email?: string;
  telefono?: string;
}

export type ProfessionalFormValues = Omit<Professional, "id">;

export interface Consultation {
  id: string;
  fecha: string; // ISO datetime
  professionalId: string;
  medico: string;
  motivoConsulta: string;
  sintomas: string[];
  diagnostico: string;
  indicaciones: string;
  notas: string;
  transcript?: string;
  audioPath?: string;
}

export interface AIInsight {
  nivel: "alerta" | "info";
  resumen: string;
  hallazgos: string[];
  generadoEl: string; // ISO datetime
}

export interface Patient {
  id: string;
  nombreCompleto: string;
  documento: string;
  fechaNacimiento: string; // ISO date
  sexo: Sexo;
  telefono: string;
  email: string;
  direccion: string;
  obraSocial?: string;
  contactoEmergencia: ContactoEmergencia;
  consultas: Consultation[];
  aiInsight?: AIInsight;
}

export type PatientFormValues = Omit<Patient, "id" | "consultas" | "aiInsight">;

export type ConsultationFormValues = Omit<Consultation, "id" | "medico">;
