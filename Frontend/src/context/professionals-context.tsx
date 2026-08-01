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
import { professionalsApi } from "@/lib/api";
import type { Professional, ProfessionalFormValues } from "@/lib/types";

interface ProfessionalsContextValue {
  professionals: Professional[];
  isLoading: boolean;
  getProfessional: (id: string) => Professional | undefined;
  addProfessional: (values: ProfessionalFormValues) => Promise<Professional>;
  updateProfessional: (id: string, values: ProfessionalFormValues) => Promise<void>;
  deleteProfessional: (id: string) => Promise<void>;
}

const ProfessionalsContext = createContext<ProfessionalsContextValue | null>(null);

export function ProfessionalsProvider({ children }: { children: ReactNode }) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    professionalsApi
      .list()
      .then((data) => {
        if (!cancelled) setProfessionals(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getProfessional = useCallback(
    (id: string) => professionals.find((professional) => professional.id === id),
    [professionals],
  );

  const addProfessional = useCallback(async (values: ProfessionalFormValues) => {
    const created = await professionalsApi.create(values);
    setProfessionals((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateProfessional = useCallback(async (id: string, values: ProfessionalFormValues) => {
    const updated = await professionalsApi.update(id, values);
    setProfessionals((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }, []);

  const deleteProfessional = useCallback(async (id: string) => {
    await professionalsApi.remove(id);
    setProfessionals((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      professionals,
      isLoading,
      getProfessional,
      addProfessional,
      updateProfessional,
      deleteProfessional,
    }),
    [professionals, isLoading, getProfessional, addProfessional, updateProfessional, deleteProfessional],
  );

  return (
    <ProfessionalsContext.Provider value={value}>
      {children}
    </ProfessionalsContext.Provider>
  );
}

export function useProfessionals() {
  const context = useContext(ProfessionalsContext);
  if (!context) {
    throw new Error("useProfessionals debe usarse dentro de un ProfessionalsProvider");
  }
  return context;
}
