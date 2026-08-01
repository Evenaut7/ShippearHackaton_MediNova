"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { patientsApi, consultationsApi } from "@/lib/api";
import type {
  ConsultationFormValues,
  Patient,
  PatientFormValues,
} from "@/lib/types";

interface PatientsContextValue {
  patients: Patient[];
  isLoading: boolean;
  getPatient: (id: string) => Patient | undefined;
  addPatient: (values: PatientFormValues) => Promise<Patient>;
  updatePatient: (id: string, values: PatientFormValues) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  addConsultation: (patientId: string, values: ConsultationFormValues) => Promise<void>;
}

const PatientsContext = createContext<PatientsContextValue | null>(null);

export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    patientsApi
      .list()
      .then((data) => {
        if (!cancelled) setPatients(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getPatient = useCallback(
    (id: string) => patients.find((patient) => patient.id === id),
    [patients],
  );

  const addPatient = useCallback(async (values: PatientFormValues) => {
    const newPatient = await patientsApi.create(values);
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  }, []);

  const updatePatient = useCallback(async (id: string, values: PatientFormValues) => {
    const updated = await patientsApi.update(id, values);
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id ? { ...updated, consultas: patient.consultas, aiInsight: patient.aiInsight } : patient,
      ),
    );
  }, []);

  const deletePatient = useCallback(async (id: string) => {
    await patientsApi.remove(id);
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  }, []);

  const addConsultation = useCallback(
    async (patientId: string, values: ConsultationFormValues) => {
      await consultationsApi.create(patientId, values);
      const refreshed = await patientsApi.get(patientId);
      setPatients((prev) => prev.map((patient) => (patient.id === patientId ? refreshed : patient)));
    },
    [],
  );

  const value = useMemo(
    () => ({
      patients,
      isLoading,
      getPatient,
      addPatient,
      updatePatient,
      deletePatient,
      addConsultation,
    }),
    [patients, isLoading, getPatient, addPatient, updatePatient, deletePatient, addConsultation],
  );

  return (
    <PatientsContext.Provider value={value}>
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error("usePatients debe usarse dentro de un PatientsProvider");
  }
  return context;
}
