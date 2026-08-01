"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Stethoscope } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { ProfessionalTable } from "@/components/professionals/professional-table";
import { ProfessionalFormDialog } from "@/components/professionals/professional-form-dialog";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { TableLoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useProfessionals } from "@/context/professionals-context";
import type { Professional, ProfessionalFormValues } from "@/lib/types";

export default function ProfesionalesPage() {
  const { professionals, isLoading, addProfessional, updateProfessional, deleteProfessional } =
    useProfessionals();
  const [formOpen, setFormOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | undefined>(undefined);
  const [deletingProfessional, setDeletingProfessional] = useState<Professional | undefined>(undefined);

  function handleCreate() {
    setEditingProfessional(undefined);
    setFormOpen(true);
  }

  function handleEdit(professional: Professional) {
    setEditingProfessional(professional);
    setFormOpen(true);
  }

  async function handleFormSubmit(values: ProfessionalFormValues) {
    try {
      if (editingProfessional) {
        await updateProfessional(editingProfessional.id, values);
        toast.success("Profesional actualizado correctamente.");
      } else {
        await addProfessional(values);
        toast.success("Profesional creado correctamente.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el profesional.");
    }
  }

  async function handleConfirmDelete() {
    if (!deletingProfessional) return;
    try {
      await deleteProfessional(deletingProfessional.id);
      toast.success(`${deletingProfessional.nombreCompleto} fue eliminado del sistema.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo eliminar el profesional.");
    } finally {
      setDeletingProfessional(undefined);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Profesionales</h1>
            <p className="text-sm text-muted-foreground">
              Gestioná los médicos y profesionales que atienden consultas en la clínica.
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nuevo profesional
          </Button>
        </div>

        {isLoading ? (
          <TableLoadingSkeleton />
        ) : professionals.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="Todavía no hay profesionales cargados"
            description="Creá el primer profesional para poder asociarlo a las consultas."
            action={
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4" />
                Nuevo profesional
              </Button>
            }
          />
        ) : (
          <ProfessionalTable
            professionals={professionals}
            onEdit={handleEdit}
            onDelete={setDeletingProfessional}
          />
        )}
      </main>

      <ProfessionalFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        professional={editingProfessional}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingProfessional)}
        onOpenChange={(open) => !open && setDeletingProfessional(undefined)}
        title="¿Eliminar profesional?"
        itemName={deletingProfessional?.nombreCompleto ?? ""}
        description="No podrás eliminarlo si tiene consultas asociadas."
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
