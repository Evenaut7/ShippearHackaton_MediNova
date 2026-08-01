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
import { initialPatients } from "@/lib/mock-data";
import type {
  ConsultationFormValues,
  Patient,
  PatientFormValues,
} from "@/lib/types";

interface PatientsContextValue {
  patients: Patient[];
  isLoading: boolean;
  getPatient: (id: string) => Patient | undefined;
  addPatient: (values: PatientFormValues) => Patient;
  updatePatient: (id: string, values: PatientFormValues) => void;
  deletePatient: (id: string) => void;
  addConsultation: (patientId: string, values: ConsultationFormValues) => void;
}

const PatientsContext = createContext<PatientsContextValue | null>(null);

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPatients(initialPatients);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, []);

  const getPatient = useCallback(
    (id: string) => patients.find((patient) => patient.id === id),
    [patients],
  );

  const addPatient = useCallback((values: PatientFormValues) => {
    const newPatient: Patient = {
      ...values,
      id: createId("p"),
      consultas: [],
    };
    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  }, []);

  const updatePatient = useCallback((id: string, values: PatientFormValues) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id ? { ...patient, ...values } : patient,
      ),
    );
  }, []);

  const deletePatient = useCallback((id: string) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  }, []);

  const addConsultation = useCallback(
    (patientId: string, values: ConsultationFormValues) => {
      setPatients((prev) =>
        prev.map((patient) =>
          patient.id === patientId
            ? {
                ...patient,
                consultas: [
                  { ...values, id: createId("c") },
                  ...patient.consultas,
                ],
              }
            : patient,
        ),
      );
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
