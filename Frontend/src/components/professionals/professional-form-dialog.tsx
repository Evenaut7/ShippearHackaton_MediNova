"use client";

import { useState, type SubmitEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Professional, ProfessionalFormValues } from "@/lib/types";

const emptyValues: ProfessionalFormValues = {
  nombreCompleto: "",
  especialidad: "",
  email: "",
  telefono: "",
};

interface ProfessionalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional?: Professional;
  onSubmit: (values: ProfessionalFormValues) => void;
}

export function ProfessionalFormDialog({
  open,
  onOpenChange,
  professional,
  onSubmit,
}: ProfessionalFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <ProfessionalFormFields
          key={`${open}-${professional?.id ?? "new"}`}
          professional={professional}
          onCancel={() => onOpenChange(false)}
          onSubmit={(values) => {
            onSubmit(values);
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface ProfessionalFormFieldsProps {
  professional?: Professional;
  onCancel: () => void;
  onSubmit: (values: ProfessionalFormValues) => void;
}

function ProfessionalFormFields({ professional, onCancel, onSubmit }: ProfessionalFormFieldsProps) {
  const [values, setValues] = useState<ProfessionalFormValues>(() =>
    professional ? { ...professional } : emptyValues,
  );
  const [error, setError] = useState("");
  const isEditing = Boolean(professional);

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!values.nombreCompleto.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar profesional" : "Nuevo profesional"}</DialogTitle>
        <DialogDescription>
          Datos del médico o profesional de la clínica.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="space-y-1.5">
          <Label htmlFor="profNombre">
            Nombre completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="profNombre"
            value={values.nombreCompleto}
            onChange={(e) => setValues({ ...values, nombreCompleto: e.target.value })}
            aria-invalid={Boolean(error)}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profEspecialidad">Especialidad</Label>
          <Input
            id="profEspecialidad"
            value={values.especialidad ?? ""}
            onChange={(e) => setValues({ ...values, especialidad: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="profEmail">Email</Label>
            <Input
              id="profEmail"
              type="email"
              value={values.email ?? ""}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="profTelefono">Teléfono</Label>
            <Input
              id="profTelefono"
              type="tel"
              value={values.telefono ?? ""}
              onChange={(e) => setValues({ ...values, telefono: e.target.value })}
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{isEditing ? "Guardar cambios" : "Crear profesional"}</Button>
      </DialogFooter>
    </form>
  );
}
