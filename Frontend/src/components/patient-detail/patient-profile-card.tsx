"use client";

import { Cake, Mail, MapPin, Phone, Pencil, ShieldPlus, Users as UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Patient } from "@/lib/types";
import { calculateAge, formatDate, getInitials } from "@/lib/format";

const sexoLabel: Record<Patient["sexo"], string> = {
  femenino: "Femenino",
  masculino: "Masculino",
  otro: "Otro",
};

interface PatientProfileCardProps {
  patient: Patient;
  onEdit: () => void;
}

export function PatientProfileCard({ patient, onEdit }: PatientProfileCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-accent text-accent-foreground text-lg">
              {getInitials(patient.nombreCompleto)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{patient.nombreCompleto}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {sexoLabel[patient.sexo]} · {calculateAge(patient.fechaNacimiento)} años · Doc.{" "}
              {patient.documento}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <dt className="text-muted-foreground">Teléfono</dt>
              <dd className="font-medium">{patient.telefono}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium break-all">{patient.email}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <dt className="text-muted-foreground">Dirección</dt>
              <dd className="font-medium">{patient.direccion || "—"}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <ShieldPlus className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <dt className="text-muted-foreground">Obra social / seguro</dt>
              <dd className="font-medium">{patient.obraSocial || "No especifica"}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Cake className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <dt className="text-muted-foreground">Fecha de nacimiento</dt>
              <dd className="font-medium">{formatDate(patient.fechaNacimiento)}</dd>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <UsersIcon className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <dt className="text-muted-foreground">Contacto de emergencia</dt>
              <dd className="font-medium">
                {patient.contactoEmergencia.nombre} · {patient.contactoEmergencia.telefono}
              </dd>
            </div>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
