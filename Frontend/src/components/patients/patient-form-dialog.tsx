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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Patient, PatientFormValues, Sexo } from "@/lib/types";

const emptyValues: PatientFormValues = {
  nombreCompleto: "",
  documento: "",
  fechaNacimiento: "",
  sexo: "femenino",
  telefono: "",
  email: "",
  direccion: "",
  obraSocial: "",
  contactoEmergencia: { nombre: "", telefono: "" },
};

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient;
  onSubmit: (values: PatientFormValues) => void;
}

export function PatientFormDialog({
  open,
  onOpenChange,
  patient,
  onSubmit,
}: PatientFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <PatientFormFields
          key={`${open}-${patient?.id ?? "new"}`}
          patient={patient}
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

interface PatientFormFieldsProps {
  patient?: Patient;
  onCancel: () => void;
  onSubmit: (values: PatientFormValues) => void;
}

function PatientFormFields({ patient, onCancel, onSubmit }: PatientFormFieldsProps) {
  const [values, setValues] = useState<PatientFormValues>(() =>
    patient ? { ...patient } : emptyValues,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = Boolean(patient);

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!values.nombreCompleto.trim()) nextErrors.nombreCompleto = "El nombre es obligatorio.";
    if (!values.documento.trim()) nextErrors.documento = "El documento es obligatorio.";
    if (!values.fechaNacimiento) nextErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    if (!values.telefono.trim()) nextErrors.telefono = "El teléfono es obligatorio.";
    if (!values.email.trim()) nextErrors.email = "El email es obligatorio.";
    if (!values.contactoEmergencia.nombre.trim())
      nextErrors.contactoEmergenciaNombre = "El contacto de emergencia es obligatorio.";
    if (!values.contactoEmergencia.telefono.trim())
      nextErrors.contactoEmergenciaTelefono = "El teléfono de emergencia es obligatorio.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Editar paciente" : "Nuevo paciente"}</DialogTitle>
        <DialogDescription>
          Completá los datos del paciente. Los campos marcados con{" "}
          <span className="text-destructive">*</span> son obligatorios.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="nombreCompleto">
            Nombre completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nombreCompleto"
            value={values.nombreCompleto}
            onChange={(e) => setValues({ ...values, nombreCompleto: e.target.value })}
            aria-invalid={Boolean(errors.nombreCompleto)}
          />
          {errors.nombreCompleto && (
            <p className="text-xs text-destructive">{errors.nombreCompleto}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="documento">
            Documento <span className="text-destructive">*</span>
          </Label>
          <Input
            id="documento"
            value={values.documento}
            onChange={(e) => setValues({ ...values, documento: e.target.value })}
            aria-invalid={Boolean(errors.documento)}
          />
          {errors.documento && <p className="text-xs text-destructive">{errors.documento}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fechaNacimiento">
            Fecha de nacimiento <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fechaNacimiento"
            type="date"
            value={values.fechaNacimiento}
            onChange={(e) => setValues({ ...values, fechaNacimiento: e.target.value })}
            aria-invalid={Boolean(errors.fechaNacimiento)}
          />
          {errors.fechaNacimiento && (
            <p className="text-xs text-destructive">{errors.fechaNacimiento}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sexo">Sexo</Label>
          <Select
            value={values.sexo}
            onValueChange={(value: Sexo) => setValues({ ...values, sexo: value })}
          >
            <SelectTrigger id="sexo" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="femenino">Femenino</SelectItem>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telefono">
            Teléfono <span className="text-destructive">*</span>
          </Label>
          <Input
            id="telefono"
            type="tel"
            value={values.telefono}
            onChange={(e) => setValues({ ...values, telefono: e.target.value })}
            aria-invalid={Boolean(errors.telefono)}
          />
          {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="obraSocial">Obra social / seguro</Label>
          <Input
            id="obraSocial"
            value={values.obraSocial ?? ""}
            onChange={(e) => setValues({ ...values, obraSocial: e.target.value })}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            value={values.direccion}
            onChange={(e) => setValues({ ...values, direccion: e.target.value })}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <p className="text-sm font-medium">Contacto de emergencia</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contactoNombre">
            Nombre <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactoNombre"
            value={values.contactoEmergencia.nombre}
            onChange={(e) =>
              setValues({
                ...values,
                contactoEmergencia: { ...values.contactoEmergencia, nombre: e.target.value },
              })
            }
            aria-invalid={Boolean(errors.contactoEmergenciaNombre)}
          />
          {errors.contactoEmergenciaNombre && (
            <p className="text-xs text-destructive">{errors.contactoEmergenciaNombre}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contactoTelefono">
            Teléfono <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactoTelefono"
            type="tel"
            value={values.contactoEmergencia.telefono}
            onChange={(e) =>
              setValues({
                ...values,
                contactoEmergencia: { ...values.contactoEmergencia, telefono: e.target.value },
              })
            }
            aria-invalid={Boolean(errors.contactoEmergenciaTelefono)}
          />
          {errors.contactoEmergenciaTelefono && (
            <p className="text-xs text-destructive">{errors.contactoEmergenciaTelefono}</p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{isEditing ? "Guardar cambios" : "Crear paciente"}</Button>
      </DialogFooter>
    </form>
  );
}
