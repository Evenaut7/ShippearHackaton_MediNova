import type {
  Consultation,
  ConsultationFormValues,
  Patient,
  PatientFormValues,
  Professional,
  ProfessionalFormValues,
} from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

interface ProfessionalDTO {
  id: number;
  nombreCompleto: string;
  especialidad?: string | null;
  email?: string | null;
  telefono?: string | null;
}

interface ConsultationDTO {
  id: number;
  fecha: string;
  motivoConsulta: string;
  sintomas: string[];
  diagnostico: string;
  indicaciones: string;
  notas?: string | null;
  transcript?: string | null;
  audioPath?: string | null;
  professional?: ProfessionalDTO;
}

interface PatientDTO {
  id: number;
  nombreCompleto: string;
  documento: string;
  fechaNacimiento: string;
  sexo: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  obraSocial?: string | null;
  contactoEmergenciaNombre?: string | null;
  contactoEmergenciaTelefono?: string | null;
  aiInsightNivel?: string | null;
  aiInsightResumen?: string | null;
  aiInsightHallazgos?: string[] | null;
  aiInsightGeneradoEl?: string | null;
  consultations?: ConsultationDTO[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = options?.body instanceof FormData;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: isFormData
      ? options?.headers
      : { "Content-Type": "application/json", ...options?.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Error ${res.status} al llamar a ${path}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

function toProfessional(dto: ProfessionalDTO): Professional {
  return {
    id: String(dto.id),
    nombreCompleto: dto.nombreCompleto,
    especialidad: dto.especialidad ?? undefined,
    email: dto.email ?? undefined,
    telefono: dto.telefono ?? undefined,
  };
}

function toConsultation(dto: ConsultationDTO): Consultation {
  return {
    id: String(dto.id),
    fecha: dto.fecha,
    professionalId: dto.professional ? String(dto.professional.id) : "",
    medico: dto.professional?.nombreCompleto ?? "",
    motivoConsulta: dto.motivoConsulta,
    sintomas: dto.sintomas ?? [],
    diagnostico: dto.diagnostico,
    indicaciones: dto.indicaciones,
    notas: dto.notas ?? "",
    transcript: dto.transcript ?? undefined,
    audioPath: dto.audioPath ?? undefined,
  };
}

function toPatient(dto: PatientDTO): Patient {
  return {
    id: String(dto.id),
    nombreCompleto: dto.nombreCompleto,
    documento: dto.documento,
    fechaNacimiento: dto.fechaNacimiento.slice(0, 10),
    sexo: dto.sexo as Patient["sexo"],
    telefono: dto.telefono ?? "",
    email: dto.email ?? "",
    direccion: dto.direccion ?? "",
    obraSocial: dto.obraSocial ?? undefined,
    contactoEmergencia: {
      nombre: dto.contactoEmergenciaNombre ?? "",
      telefono: dto.contactoEmergenciaTelefono ?? "",
    },
    consultas: (dto.consultations ?? []).map(toConsultation),
    aiInsight:
      dto.aiInsightNivel && dto.aiInsightGeneradoEl
        ? {
            nivel: dto.aiInsightNivel === "alerta" ? "alerta" : "info",
            resumen: dto.aiInsightResumen ?? "",
            hallazgos: dto.aiInsightHallazgos ?? [],
            generadoEl: dto.aiInsightGeneradoEl,
          }
        : undefined,
  };
}

function patientPayload(values: PatientFormValues) {
  return {
    nombreCompleto: values.nombreCompleto,
    documento: values.documento,
    fechaNacimiento: values.fechaNacimiento,
    sexo: values.sexo,
    telefono: values.telefono,
    email: values.email,
    direccion: values.direccion,
    obraSocial: values.obraSocial || undefined,
    contactoEmergenciaNombre: values.contactoEmergencia.nombre,
    contactoEmergenciaTelefono: values.contactoEmergencia.telefono,
  };
}

export const patientsApi = {
  async list(): Promise<Patient[]> {
    const dtos = await request<PatientDTO[]>("/patients");
    return dtos.map(toPatient);
  },
  async get(id: string): Promise<Patient> {
    const dto = await request<PatientDTO>(`/patients/${id}`);
    return toPatient(dto);
  },
  async create(values: PatientFormValues): Promise<Patient> {
    const dto = await request<PatientDTO>("/patients", {
      method: "POST",
      body: JSON.stringify(patientPayload(values)),
    });
    return toPatient(dto);
  },
  async update(id: string, values: PatientFormValues): Promise<Patient> {
    const dto = await request<PatientDTO>(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(patientPayload(values)),
    });
    return toPatient(dto);
  },
  async remove(id: string): Promise<void> {
    await request<void>(`/patients/${id}`, { method: "DELETE" });
  },
};

export const professionalsApi = {
  async list(): Promise<Professional[]> {
    const dtos = await request<ProfessionalDTO[]>("/professionals");
    return dtos.map(toProfessional);
  },
  async create(values: ProfessionalFormValues): Promise<Professional> {
    const dto = await request<ProfessionalDTO>("/professionals", {
      method: "POST",
      body: JSON.stringify(values),
    });
    return toProfessional(dto);
  },
  async update(id: string, values: ProfessionalFormValues): Promise<Professional> {
    const dto = await request<ProfessionalDTO>(`/professionals/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });
    return toProfessional(dto);
  },
  async remove(id: string): Promise<void> {
    await request<void>(`/professionals/${id}`, { method: "DELETE" });
  },
};

export interface GeneratedReport {
  audioPath: string;
  transcript: string;
  motivoConsulta: string;
  sintomas: string[];
  diagnostico: string;
  indicaciones: string;
  notas: string;
}

export const audioApi = {
  async generateReport(file: File): Promise<GeneratedReport> {
    const formData = new FormData();
    formData.append("audio", file);
    return request<GeneratedReport>("/audio/generate-report", {
      method: "POST",
      body: formData,
    });
  },
};

export const consultationsApi = {
  async create(patientId: string, values: ConsultationFormValues): Promise<Consultation> {
    const dto = await request<ConsultationDTO>("/consultations", {
      method: "POST",
      body: JSON.stringify({
        patientId: Number(patientId),
        professionalId: Number(values.professionalId),
        fecha: values.fecha,
        motivoConsulta: values.motivoConsulta,
        sintomas: values.sintomas,
        diagnostico: values.diagnostico,
        indicaciones: values.indicaciones,
        notas: values.notas,
        transcript: values.transcript,
        audioPath: values.audioPath,
      }),
    });
    return toConsultation(dto);
  },
};
