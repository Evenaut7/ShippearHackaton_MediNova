"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Users } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PatientTable } from "@/components/patients/patient-table";
import { PatientFormDialog } from "@/components/patients/patient-form-dialog";
import { ConfirmDeleteDialog } from "@/components/patients/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { TableLoadingSkeleton } from "@/components/shared/loading-skeleton";
import { usePatients } from "@/context/patients-context";
import type { Patient, PatientFormValues } from "@/lib/types";

export default function PacientesPage() {
  const { patients, isLoading, addPatient, updatePatient, deletePatient } = usePatients();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);
  const [deletingPatient, setDeletingPatient] = useState<Patient | undefined>(undefined);

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return patients;
    return patients.filter(
      (patient) =>
        patient.nombreCompleto.toLowerCase().includes(normalizedQuery) ||
        patient.documento.toLowerCase().includes(normalizedQuery),
    );
  }, [patients, query]);

  function handleCreate() {
    setEditingPatient(undefined);
    setFormOpen(true);
  }

  function handleEdit(patient: Patient) {
    setEditingPatient(patient);
    setFormOpen(true);
  }

  function handleFormSubmit(values: PatientFormValues) {
    if (editingPatient) {
      updatePatient(editingPatient.id, values);
      toast.success("Paciente actualizado correctamente.");
    } else {
      addPatient(values);
      toast.success("Paciente creado correctamente.");
    }
  }

  function handleConfirmDelete() {
    if (!deletingPatient) return;
    deletePatient(deletingPatient.id);
    toast.success(`${deletingPatient.nombreCompleto} fue eliminado del sistema.`);
    setDeletingPatient(undefined);
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
            <p className="text-sm text-muted-foreground">
              Administrá los pacientes de la clínica y accedé a su historial.
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nuevo paciente
          </Button>
        </div>

        <div className="mb-4 relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o documento…"
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <TableLoadingSkeleton />
        ) : patients.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Todavía no hay pacientes cargados"
            description="Creá el primer paciente para empezar a registrar consultas."
            action={
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4" />
                Nuevo paciente
              </Button>
            }
          />
        ) : filteredPatients.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Sin resultados"
            description={`No se encontraron pacientes que coincidan con "${query}".`}
          />
        ) : (
          <PatientTable
            patients={filteredPatients}
            onEdit={handleEdit}
            onDelete={setDeletingPatient}
          />
        )}
      </main>

      <PatientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        patient={editingPatient}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingPatient)}
        onOpenChange={(open) => !open && setDeletingPatient(undefined)}
        patientName={deletingPatient?.nombreCompleto ?? ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
